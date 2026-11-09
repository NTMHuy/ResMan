# ResMan — Backend Database Design

> Trạng thái: Đề xuất kỹ thuật để review, chưa phải migration đã áp dụng.
> Phạm vi: MVP một nhà hàng; mỗi bàn tối đa một phiên đang mở; mỗi phiên một đơn; một hàng đợi bếp chung.
> Nguồn nghiệp vụ ưu tiên: docs/11-confirmed-business-rules.md. Đối chiếu docs/08-prd.md, docs/09-system-analysis-and-design.md và prisma/schema.prisma.

## 1. Mục tiêu và nguyên tắc

1. Kế thừa 19 model hiện có; không thiết kế lại database từ đầu.
2. OrderItem là đơn vị trạng thái vận hành và hiển thị trên KDS.
3. Mỗi lần gọi thêm tạo OrderItem mới, không cộng dồn item cũ.
4. Lưu snapshot tên và giá tại thời điểm gọi món.
5. Mọi thay đổi trạng thái, số dư kho và thanh toán phải có lịch sử tương ứng.
6. Dùng transaction cho nghiệp vụ cập nhật nhiều bảng.
7. Không có customer account, kitchen station, recipe, supplier, shift scheduling, split payment hoặc automatic stock deduction trong MVP.
8. ID BigInt trả ra JSON dưới dạng string; Decimal trả ra dạng chuỗi thập phân.

## 2. Model hiện có

| Miền | Model | Vai trò |
|---|---|---|
| Identity/RBAC | Role, Permission, RolePermission, User, Employee | Tài khoản nhân viên và phân quyền |
| Menu | MenuCategory, MenuItem | Danh mục, món, giá, availability |
| Table/device | DiningTable, DiningSession, TableDevice | Bàn, phiên, tablet gắn bàn |
| Order/Kitchen | Order, OrderItem, OrderItemStatusHistory | Đơn, từng món, lịch sử trạng thái |
| Inventory | Ingredient, InventoryBalance, StockMovement, InventoryCountRecord | Nguyên liệu, số dư, giao dịch, kiểm kê |
| Payment | Payment | Một payment/order |
| Audit | AuditLog | Nhật ký hành động quan trọng |

Không thêm model cho customer account, kitchen station/ticket, recipe, supplier, purchase order, loyalty, shift scheduling hoặc AI recommendation trong MVP.

## 3. ERD

~~~mermaid
erDiagram
  Role ||--o{ User : assigns
  Role ||--o{ RolePermission : has
  Permission ||--o{ RolePermission : grants
  User ||--o| Employee : profile
  DiningTable ||--o{ DiningSession : hosts
  User o|--o{ DiningSession : opens
  User o|--o{ DiningSession : closes
  DiningTable ||--o{ TableDevice : assigned
  DiningSession ||--o| Order : owns
  Order ||--o{ OrderItem : contains
  MenuCategory ||--o{ MenuItem : groups
  MenuItem ||--o{ OrderItem : referenced_by
  OrderItem ||--o{ OrderItemStatusHistory : records
  User o|--o{ OrderItemStatusHistory : acts
  Order ||--o| Payment : paid_by
  Ingredient ||--o| InventoryBalance : balance
  Ingredient ||--o{ StockMovement : movements
  Ingredient ||--o{ InventoryCountRecord : counts
  User ||--o{ StockMovement : creates
  User ||--o{ InventoryCountRecord : counts
  User ||--o{ Payment : records
  User o|--o{ AuditLog : performs
~~~

ERD trên phản ánh quan hệ model hiện có. Một số ràng buộc nghiệp vụ cần bổ sung bằng SQL migration và service logic.

## 4. Thiết kế theo miền dữ liệu

### 4.1 Identity và RBAC

**Role**
- id BIGINT PK; code VARCHAR(40) UNIQUE; name VARCHAR(100); description; created_at.
- Seed role: MANAGER, ORDER_STAFF, KITCHEN_STAFF, INVENTORY_STAFF.
- GUEST là ngữ cảnh tablet, không phải tài khoản User.

**Permission / RolePermission**
- Permission.code unique.
- RolePermission có composite PK (role_id, permission_id).
- Không xóa role/permission đang được tham chiếu; cập nhật seed có kiểm soát.

**User / Employee**
- User.username unique; email nullable unique; password_hash chỉ lưu hash.
- Employee.user_id unique: tối đa một hồ sơ nhân viên/user.
- is_active kiểm soát đăng nhập; employment_status phản ánh tình trạng nhân sự.
- Khóa tài khoản bằng is_active=false; không xóa user đã phát sinh lịch sử.

### 4.2 Menu

**MenuCategory**
- code unique; is_active điều khiển danh mục hiển thị.
- Không xóa vật lý danh mục đã được món tham chiếu.

**MenuItem**
- code unique; category_id FK.
- price DECIMAL(14,2), không dùng float.
- availability_status và is_active độc lập:
  - AVAILABLE: có thể bán khi is_active=true.
  - OUT_OF_STOCK: tạm hết hàng.
  - is_active=false: ngừng kinh doanh/ẩn khỏi menu.
- availability_reason lưu lý do tùy chọn.
- Tồn kho thấp không tự thay đổi availability_status.
- Không có modifier, recipe hoặc station.

### 4.3 Table, session và device

**DiningTable**
- code unique; capacity nếu có phải > 0.
- status là trạng thái hiển thị bàn; phải cập nhật cùng transaction với session.
- Không xóa bàn có lịch sử session/order; nên deactivate.

**DiningSession**
- session_code unique; table_id FK; opened_by/closed_by FK User.
- OPEN yêu cầu closed_at IS NULL.
- CLOSED yêu cầu closed_at IS NOT NULL.
- Mỗi bàn tối đa một session OPEN.
- Mỗi session tối đa một Order.

**TableDevice**
- device_code unique; dining_table_id FK; is_active để thu hồi thiết bị.
- CẦN DUYỆT: dùng credential riêng, lưu hash, hỗ trợ rotate/revoke; không coi deviceCode dễ đoán là secret.
- Tablet không tự đổi bàn; nhân viên có quyền mới được gán/thu hồi thiết bị.

### 4.4 Order và Kitchen

**Order**
- order_code unique; dining_session_id unique FK.
- Một session có một order.
- Không lưu workflow KDS riêng ở Order; trạng thái vận hành nằm ở OrderItem.

**OrderItem**
- order_id FK; menu_item_id FK.
- item_name_snapshot, unit_price, line_total lưu tại thời điểm gọi món.
- quantity là số nguyên dương; unit_price và line_total không âm.
- note lưu yêu cầu riêng; không có modifier.
- Mỗi lần gọi thêm tạo row mới.
- Đơn đã thanh toán không được chỉnh sửa.

**OrderItemStatusHistory**
- Mỗi transition hợp lệ tạo record.
- from_status nullable cho trạng thái khởi tạo; to_status bắt buộc.
- actor_id nullable chỉ cho thao tác hệ thống/seed; thao tác người dùng phải có actor.
- Không xóa lịch sử.

### 4.5 Inventory

**Ingredient**
- code unique nội bộ; unit là đơn vị chuẩn.
- low_stock_threshold nullable, nếu có phải >= 0.
- CẦN DUYỆT: MVP yêu cầu nhập theo đơn vị chuẩn; chưa có quy đổi đơn vị.

**InventoryBalance**
- ingredient_id vừa PK vừa FK: một nguyên liệu có một số dư.
- quantity_on_hand >= 0.
- Khi tạo nguyên liệu phải tạo balance ban đầu bằng 0.

**StockMovement**
- quantity_delta có dấu: nhập là dương; điều chỉnh tăng/giảm theo dấu.
- reason và created_by bắt buộc.
- Update balance và insert movement trong cùng transaction.
- Không tự phát sinh movement từ bán món trong MVP.

**InventoryCountRecord**
- Lưu actual_quantity, counted_at, counted_by, note.
- Mỗi lần kiểm kê là record độc lập.
- CẦN DUYỆT: kiểm kê chỉ ghi nhận hay tự áp dụng chênh lệch. Đề xuất: chỉ điều chỉnh balance khi nhân viên xác nhận áp dụng; khi áp dụng phải tạo StockMovement riêng.

### 4.6 Payment và Audit

**Payment**
- order_id unique: tối đa một payment/order.
- amount DECIMAL(14,2), không âm.
- status=PAID cho MVP khi nhân viên đã nhận đủ tiền và xác nhận.
- payment_method nullable vì phương thức chưa được chốt.
- recorded_by bắt buộc; paid_at là thời điểm xác nhận.
- Không split payment hoặc nhiều payment/order.

**AuditLog**
- actor, action, entity type/id, metadata JSON, occurred_at.
- Không thay thế OrderItemStatusHistory hoặc StockMovement.
- Không ghi password, JWT, device secret vào metadata.

## 5. Enum và tập giá trị chuẩn

Schema hiện tại dùng String cho nhiều status/type. Đề xuất đợt đầu giữ String trong Prisma để tránh thay đổi lớn, nhưng:
- Khai báo constants/enums ở tầng ứng dụng.
- Validate DTO.
- Thêm PostgreSQL CHECK constraints sau khi chuẩn hóa dữ liệu.
- Nếu chuyển sang Prisma enum native, làm migration riêng.

| Field | Giá trị chuẩn đề xuất | Ghi chú |
|---|---|---|
| menu_items.availability_status | AVAILABLE, OUT_OF_STOCK | is_active độc lập |
| dining_tables.status | AVAILABLE, OCCUPIED, WAITING_PAYMENT | CẦN DUYỆT; có thể derive từ session |
| dining_sessions.status | OPEN, CLOSED | Quy tắc đã xác nhận |
| order_items.status | AWAITING_ACCEPTANCE, ACCEPTED, IN_PREPARATION, COMPLETED, CANCELLED | Quy tắc đã xác nhận |
| employees.employment_status | ACTIVE, INACTIVE | Rà soát dữ liệu cũ trước constraint |
| stock_movements.movement_type | STOCK_IN, ADJUSTMENT_IN, ADJUSTMENT_OUT | Không có recipe consumption |
| payments.status | PAID | Manual confirmation trong MVP |
| payments.payment_method | nullable/chưa giới hạn | Chưa chốt phương thức |

### 5.1 OrderItem state transition

| From | To | Actor/điều kiện |
|---|---|---|
| New | AWAITING_ACCEPTANCE | Khách hoặc Order tạo item |
| AWAITING_ACCEPTANCE | ACCEPTED | Kitchen hoặc Manager |
| ACCEPTED | IN_PREPARATION | Kitchen hoặc Manager |
| IN_PREPARATION | COMPLETED | Kitchen hoặc Manager |
| IN_PREPARATION | ACCEPTED | Kitchen hoặc Manager |
| AWAITING_ACCEPTANCE | CANCELLED | Khách/Order/Kitchen/Manager theo quyền |
| ACCEPTED | CANCELLED | Order/Manager; policy của Kitchen cần duyệt |
| IN_PREPARATION | CANCELLED | CẦN DUYỆT theo điều kiện hủy của bếp |
| COMPLETED | — | Terminal trong MVP |
| CANCELLED | — | Terminal |

Không dùng REJECTED, QUEUED, PREPARING, READY hoặc SERVED làm trạng thái nghiệp vụ hiện hành.

## 6. Constraints và indexes

### 6.1 Đã có trong Prisma schema

- PK BigInt cho các bảng chính.
- Unique role/permission/user identifiers, employee code, menu code, table code, session code, device code, order code.
- RolePermission composite PK.
- Employee.user_id unique.
- Order.dining_session_id unique.
- Payment.order_id unique.
- InventoryBalance.ingredient_id là PK.
- FK dùng ON DELETE RESTRICT.
- Index cho menu availability, order item queue, stock history, payment date và audit lookup.

### 6.2 Đề xuất SQL migration

~~~sql
CREATE UNIQUE INDEX IF NOT EXISTS uq_dining_sessions_one_open_per_table
ON dining_sessions (table_id)
WHERE status = 'OPEN';

ALTER TABLE dining_sessions
  ADD CONSTRAINT ck_dining_sessions_status
  CHECK (status IN ('OPEN', 'CLOSED'));

ALTER TABLE dining_sessions
  ADD CONSTRAINT ck_dining_sessions_closed_fields
  CHECK (
    (status = 'OPEN' AND closed_at IS NULL)
    OR (status = 'CLOSED' AND closed_at IS NOT NULL)
  );

ALTER TABLE order_items
  ADD CONSTRAINT ck_order_items_quantity_positive
  CHECK (quantity > 0);

ALTER TABLE order_items
  ADD CONSTRAINT ck_order_items_prices_non_negative
  CHECK (unit_price >= 0 AND line_total >= 0);

ALTER TABLE inventory_balances
  ADD CONSTRAINT ck_inventory_balance_non_negative
  CHECK (quantity_on_hand >= 0);

ALTER TABLE ingredients
  ADD CONSTRAINT ck_ingredient_low_stock_non_negative
  CHECK (low_stock_threshold IS NULL OR low_stock_threshold >= 0);

ALTER TABLE payments
  ADD CONSTRAINT ck_payment_amount_non_negative
  CHECK (amount >= 0);
~~~

Đây là SQL đề xuất, chưa chạy. Trước khi thêm constraint phải kiểm tra dữ liệu hiện hữu; nếu có dòng vi phạm cần báo cáo và xử lý có kiểm soát. Không chạy trực tiếp trên production khi chưa backup/review.

### 6.3 Invariants ở service/transaction

- Open session: kiểm tra bàn, chống concurrent open; tạo session + order + cập nhật table trong transaction.
- Create item: lấy giá từ DB, tính lineTotal ở server, lưu snapshot và initial history.
- Transition: kiểm tra current status, actor permission và transition; update item + insert history atomically.
- Inventory: update balance + insert movement atomically; ngăn race condition và số dư âm.
- Payment: kiểm tra item statuses, tính tổng server-side, insert payment, close session, update table trong một transaction.
- Không nhận actorId, recordedBy, createdBy, unitPrice, lineTotal hoặc status do client tự quyết định.

## 7. Quy tắc tính tiền

Được thanh toán khi không còn item AWAITING_ACCEPTANCE.

Tính tiền:
- ACCEPTED
- IN_PREPARATION
- COMPLETED

Loại khỏi tổng:
- AWAITING_ACCEPTANCE
- CANCELLED

total = SUM(quantity * unit_price) trên các item được tính tiền.

Không lấy giá menu hiện tại để tính lại item cũ. Không chỉnh sửa order sau payment. Payment, session close và table status update là một transaction.

## 8. Quy ước dữ liệu

- Timestamp dùng TIMESTAMPTZ(6), lưu UTC; hiển thị Asia/Ho_Chi_Minh.
- Tiền DECIMAL(14,2); số lượng tồn DECIMAL(14,3).
- BigInt trả JSON dạng string; Decimal trả JSON dạng string.
- Không trả passwordHash hoặc device secret.
- Deactivate dữ liệu master đã được tham chiếu; không xóa order/payment/stock/audit history.

## 9. Migration plan

**DB-00 — Baseline inspection**
- Backup DB; kiểm tra schema thực tế và migration history.
- Rà soát status/type đang tồn tại, orphan FK, duplicate OPEN sessions, balance âm, quantity không hợp lệ.
- Xác nhận Prisma 7 config và DATABASE_URL.

**DB-01 — Data normalization**
- Chuẩn hóa status cũ về tập giá trị chuẩn.
- Xuất báo cáo dòng dữ liệu vi phạm trước khi sửa.
- Không tự xóa hoặc sửa dữ liệu production.

**DB-02 — Constraints and indexes**
- Thêm partial unique index cho session OPEN.
- Thêm CHECK constraints sau khi dữ liệu sạch.
- Chỉ thêm index khác khi query/use case chứng minh cần.

**DB-03 — Optional security fields**
- Nếu duyệt device credential, bổ sung hash/rotation/revocation theo quyết định được duyệt.

**DB-04 — Seed and verification**
- Seed role/permission theo kiểu idempotent.
- Seed demo tách production.
- Test migration trên DB rỗng và bản sao DB có dữ liệu.
- Kiểm tra restore từ backup; không giả định migration nào cũng tự rollback an toàn.

## 10. Câu hỏi cần duyệt trước migration

| ID | Câu hỏi | Đề xuất |
|---|---|---|
| DB-Q01 | Table status lưu hay derive từ session? | Session là nguồn sự thật; nếu lưu table status thì cập nhật cùng transaction |
| DB-Q02 | Bếp được hủy item ở trạng thái nào? | Chỉ triển khai transition đã duyệt |
| DB-Q03 | Có mở lại item COMPLETED? | Không trong MVP |
| DB-Q04 | Kiểm kê có tự điều chỉnh balance? | Chỉ khi nhân viên xác nhận áp dụng |
| DB-Q05 | Device auth dùng credential nào? | Secret riêng, hash, rotate/revoke |
| DB-Q06 | Payment methods? | Để nullable/chưa giới hạn |

## 11. Tiêu chí nghiệm thu

- [ ] Prisma schema validate thành công.
- [ ] Migration chạy trên DB rỗng và bản sao DB có dữ liệu.
- [ ] Không thể tạo hai session OPEN cùng bàn.
- [ ] Không thể tạo hai order/session hoặc hai payment/order.
- [ ] Không thể ghi quantity <= 0 cho order item.
- [ ] Không thể làm tồn kho âm.
- [ ] Snapshot giá/tên không đổi khi menu thay đổi.
- [ ] Mọi transition có history.
- [ ] Mọi thay đổi balance có stock movement.
- [ ] Không có station, recipe, customer account hoặc split payment trong MVP.
