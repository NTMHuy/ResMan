# Thiết kế cơ sở dữ liệu ResMan

> **Phiên bản:** 3.1  
> **Ngày cập nhật:** 06/11/2026  
> **Nhánh:** `member/minhhuy`  
> **Nguồn chuẩn nghiệp vụ:** `backend/README.md`, `docs/11-confirmed-business-rules.md`, PRD và các quyết định đã xác nhận.

## 1. Phạm vi và nguyên tắc

Thiết kế PostgreSQL cho MVP một nhà hàng, backend NestJS và Prisma. Client (tablet, màn hình bếp, giao diện nhân viên/quản lý) chỉ gọi API, không kết nối trực tiếp database.

- Prisma quản lý schema và migration có version.
- Primary key dùng BIGINT identity; timestamp dùng TIMESTAMPTZ; tiền dùng NUMERIC(14,2); số lượng kho dùng NUMERIC(14,3).
- Tên bảng/cột snake_case; Prisma model/field dùng PascalCase/camelCase và `@map`.
- Không cascade-delete dữ liệu giao dịch/lịch sử.
- Không lưu mật khẩu dạng rõ hoặc secrets trong repository.
- Một nhà hàng; chưa có chi nhánh, nhà cung cấp, đơn mua hàng, ca làm.
- AI Recommendation là phạm vi tương lai.
- Không tạo migration triển khai trong bước đồng bộ thiết kế này.

## 2. Quyết định nghiệp vụ chi phối dữ liệu

| Chủ đề | Quyết định |
|---|---|
| Bàn và tablet | Tablet gắn vật lý với một bàn; không có chức năng chuyển bàn bằng phần mềm |
| Khách hàng | Không tạo tài khoản/định danh khách trong MVP; không gắn người gọi vào order item |
| Phiên bàn | Một bàn tối đa một phiên OPEN; một phiên có một order |
| Gọi thêm | Mỗi lần gọi thêm tạo order item mới trong cùng order; chỉ cần phiên còn OPEN |
| Ghi chú | Không có modifier; yêu cầu riêng lưu trong `order_items.note` |
| Bếp | Một hàng đợi bếp chung; không có Kitchen Station, station routing hoặc kitchen ticket riêng |
| Trạng thái món | `AWAITING_ACCEPTANCE`, `ACCEPTED`, `IN_PREPARATION`, `COMPLETED`, `CANCELLED` |
| Hủy của khách | Chỉ được hủy khi món còn `AWAITING_ACCEPTANCE` |
| Order Staff | Sửa note/hủy theo ma trận trạng thái; gọi thêm tạo item mới |
| Thanh toán | Một payment tối đa cho một order; nhân viên nhận tiền rồi mới xác nhận |
| Tính tiền | ACCEPTED, IN_PREPARATION, COMPLETED được tính; AWAITING_ACCEPTANCE và CANCELLED không tính |
| Bàn | Chỉ `AVAILABLE` và `OCCUPIED`; “đang thanh toán” là bước quy trình, không phải trạng thái |
| Kho | Cập nhật thủ công; không recipe, không tự trừ kho theo món bán |
| Kiểm kê | Mỗi lần kiểm kê lưu thời điểm và số lượng thực tế; không có mô hình bắt buộc đầu ngày/cuối ngày |
| Cảnh báo tồn thấp | Chỉ Inventory Staff xem; Manager quản lý nguyên liệu/ngưỡng |
| Báo cáo | Chỉ Manager xem |

## 3. Mô hình dữ liệu và danh sách bảng

| Nhóm | Bảng | Mục đích |
|---|---|---|
| Identity/Staff | `roles` | Bốn vai trò tài khoản nhân viên: Order Staff, Kitchen Staff, Inventory Staff, Manager |
| | `permissions` | Danh mục quyền |
| | `role_permissions` | Gán quyền cho vai trò |
| | `users` | Tài khoản nhân viên |
| | `employees` | Hồ sơ nhân viên |
| Menu | `menu_categories` | Danh mục món |
| | `menu_items` | Món, giá, trạng thái hiển thị/khả dụng |
| Dining | `dining_tables` | Bàn và trạng thái bàn |
| | `dining_sessions` | Phiên đang hoạt động/đã đóng |
| | `table_devices` | Định danh tablet gắn vật lý với bàn; không quyết định cơ chế auth |
| Order | `orders` | Một order cho mỗi phiên bàn |
| | `order_items` | Các lần gọi món, snapshot giá và trạng thái |
| | `order_item_status_history` | Lịch sử trạng thái món |
| Inventory | `ingredients` | Nguyên liệu và ngưỡng cảnh báo |
| | `inventory_balances` | Số dư hiện tại |
| | `stock_movements` | Sổ giao dịch kho |
| | `inventory_count_records` | Các lần kiểm kê độc lập |
| Payment | `payments` | Một payment cho một order |
| Audit | `audit_logs` | Nhật ký thao tác quan trọng, actor, đối tượng và thời điểm |

Không tạo các bảng `customers`, `kitchen_stations`, `kitchen_tickets`, `shortage_reports`, `menu_item_ingredients` hoặc `daily_inventory_records` trong MVP hiện tại.

## 4. Các thực thể chính

### 4.1 Staff và role

- `users` lưu tài khoản nhân viên; `employees` lưu hồ sơ nhân sự.
- Role code dự kiến: `ORDER_STAFF`, `KITCHEN_STAFF`, `INVENTORY_STAFF`, `MANAGER`. Customer không phải tài khoản nhân viên và không có role đăng nhập trong MVP.
- Có thể dùng bảng permissions/role_permissions để phân quyền chi tiết.
- Quản lý được quyền quản trị; quyền xem inventory alert vẫn chỉ cấp cho Inventory Staff.

### 4.2 Menu

`menu_items` lưu giá hiện tại và trạng thái:
- `is_active`: món còn được quản lý/sử dụng trong menu.
- `availability_status`: `AVAILABLE` hoặc `MANUAL_UNAVAILABLE`.
- `availability_reason`: lý do quản lý đánh dấu không khả dụng (nếu có).

Không còn `AUTO_OUT_OF_STOCK`, nguyên liệu bắt buộc hoặc mapping món-nguyên liệu. Tồn thấp không tự động thay đổi khả dụng của món.

### 4.3 Bàn, tablet và phiên

- `dining_tables.status` chỉ nhận `AVAILABLE` hoặc `OCCUPIED`.
- Phiên có `OPEN` hoặc `CLOSED`; bàn OCCUPIED khi có phiên OPEN và AVAILABLE khi không có phiên OPEN.
- Database phải bảo đảm tối đa một phiên OPEN trên mỗi bàn bằng partial unique index trong migration SQL.
- `table_devices` chỉ mô tả tablet/thiết bị được gán vật lý với bàn (mã thiết bị, tên hiển thị, trạng thái gán). Không lưu token/hash/credential cho tới khi cơ chế xác thực tablet được quyết định.
- Mỗi phiên có một order. Dùng unique constraint trên `orders.dining_session_id`.
- Không lưu trạng thái `WAITING_PAYMENT` cho bàn.

### 4.4 Order và order item

- MVP chỉ phục vụ tại bàn: bỏ `order_type`, `guest_count`, `customer_id`, `kitchen_station_id`, `rejection_reason`, `dispatched_at` và trạng thái tổng order cũ.
- `orders` tham chiếu `dining_session_id`; bàn được xác định qua session, tránh lưu lặp `dining_table_id`.
- Mỗi order item lưu menu item, tên món snapshot, đơn giá snapshot, quantity, line total, note và trạng thái.
- Giá snapshot không đổi khi Manager cập nhật giá menu về sau.
- Mỗi lần gọi thêm là row mới; không tăng quantity row cũ.
- Không có customer ownership ở order item.
- Không có stationId ở menu item/order/order item.

Trạng thái hợp lệ của `order_items.status`:
`AWAITING_ACCEPTANCE`, `ACCEPTED`, `IN_PREPARATION`, `COMPLETED`, `CANCELLED`.

Luồng thông thường:
`AWAITING_ACCEPTANCE → ACCEPTED → IN_PREPARATION → COMPLETED`

Bếp có thể đưa `IN_PREPARATION → ACCEPTED`. Hủy là trạng thái kết thúc riêng. Mọi thay đổi trạng thái phải append `order_item_status_history` trong cùng transaction. Ma trận hủy của Bếp còn cần chốt chi tiết; không mã hóa giả định thành CHECK constraint.

Không cần `orders.status` hoặc `order_status_history` trong MVP; trạng thái vận hành được quản lý theo từng item. Nếu sau này cần trạng thái tổng hợp, nên tính từ item/payment thay vì tạo nguồn dữ liệu thứ hai.

### 4.5 Thanh toán

- `payments.order_id` unique: một order tối đa một payment.
- Lưu amount, actor xác nhận và timestamp.
- `payment_method` nullable để không khóa cứng phương thức khi nhóm chưa quyết định; chỉ ghi khi phương thức đã được thống nhất.
- Không lưu payment request như payment đã hoàn tất.
- Amount do backend tính từ order item snapshot. Tính tiền theo trạng thái: ACCEPTED, IN_PREPARATION, COMPLETED được tính; AWAITING_ACCEPTANCE, CANCELLED không tính.
- **Payment gate đã chốt (phương án B):** chỉ cho phép xác nhận payment/đóng session khi không còn order item ở `AWAITING_ACCEPTANCE`. Các item `ACCEPTED`, `IN_PREPARATION`, `COMPLETED`, `CANCELLED` đều không chặn đóng phiên. Amount vẫn chỉ cộng `ACCEPTED`, `IN_PREPARATION`, `COMPLETED`; loại `AWAITING_ACCEPTANCE` và `CANCELLED`.
- Xác nhận payment, đóng session và cập nhật bàn phải nằm trong cùng transaction. Trong transaction phải khóa/kiểm tra order items và từ chối nếu còn item `AWAITING_ACCEPTANCE`; item `IN_PREPARATION` không chặn đóng phiên.

### 4.6 Inventory và kiểm kê

- `ingredients`: tên, nhóm, đơn vị, ngưỡng cảnh báo, ghi chú, trạng thái.
- `inventory_balances`: số lượng tồn hiện tại, một row cho mỗi ingredient.
- `stock_movements`: IN/OUT/ADJUSTMENT/WASTE, quantity delta, lý do, actor, timestamp.
- Nhập/xuất/điều chỉnh/hao hụt cập nhật balance và append movement trong cùng transaction.
- Không tự động trừ kho khi order được tạo/hoàn thành.
- `inventory_count_records` lưu mỗi lần kiểm kê độc lập: ingredient, actual quantity, counted_at, người kiểm kê, note; không gộp theo ngày và không phân loại opening/closing.
- Khi lưu số đếm thực tế, backend đối chiếu với balance; nếu áp dụng chênh lệch phải ghi stock movement loại ADJUSTMENT, không âm thầm ghi đè.
- Cảnh báo tồn thấp được tính từ balance và threshold; quyền đọc feed chỉ cấp Inventory Staff.

## 5. Ràng buộc và tính toàn vẹn

Các ràng buộc cần có trong Prisma và/hoặc migration SQL:
- Quantity order item > 0; giá/line total/payment amount >= 0.
- Số dư kho không âm; quy tắc delta phù hợp movement type.
- Trạng thái bàn, phiên, món và menu nằm trong tập giá trị được định nghĩa.
- Username, email (nếu có), employee_code, menu code, table code, device_code là unique theo quy tắc nullability.
- Một bàn tối đa một session OPEN (partial unique index).
- Một session tối đa một order (unique dining_session_id).
- Một order tối đa một payment (unique order_id).
- Không xóa cứng order item/history/payment/stock movement/count record đã phát sinh.
- Không dùng cascade delete cho dữ liệu lịch sử.

Một số constraint PostgreSQL (partial unique index, CHECK phức tạp) có thể cần viết trong migration SQL vì Prisma schema không biểu diễn đầy đủ.

## 6. Transaction bắt buộc

1. Mở phiên: tạo session OPEN, tạo order và cập nhật bàn OCCUPIED nguyên tử.
2. Gọi món: tạo order item cùng snapshot giá và history trạng thái đầu tiên nguyên tử.
3. Chuyển trạng thái món: kiểm tra trạng thái hiện tại, cập nhật item và append history nguyên tử.
4. Hủy món: kiểm tra role + state + payment/session, cập nhật item và history nguyên tử.
5. Giao dịch kho: khóa balance, cập nhật số dư và tạo stock movement nguyên tử.
6. Kiểm kê: lưu actual count/time/actor; nếu điều chỉnh balance thì tạo ADJUSTMENT trong cùng transaction.
7. Thanh toán: khóa order/session phù hợp, tính amount từ server, tạo payment, đóng session và đặt bàn AVAILABLE trong cùng transaction sau khi qua payment gate đã được xác nhận.

Các request có thể gửi lặp (đặc biệt payment confirmation) cần idempotency hoặc optimistic concurrency; chi tiết key/retention sẽ chốt khi thiết kế API.

## 7. Index đề xuất

- Menu: `(category_id, is_active, availability_status)`.
- Sessions: `(table_id, status)`; partial unique index trên table_id khi status = OPEN.
- Orders: unique `dining_session_id`.
- Order items: `(order_id, status)`, `(status, created_at)`.
- Item history: `(order_item_id, changed_at DESC)`.
- Inventory movements: `(ingredient_id, created_at DESC)`.
- Inventory counts: `(ingredient_id, counted_at DESC)`.
- Payments: unique `order_id`, `paid_at DESC`.

## 8. Các điểm còn mở

1. Cơ chế xác thực tablet và credential lifecycle; do đó schema thiết bị hiện không chứa token.
2. Trạng thái cụ thể mà Bếp được phép hủy và có bắt buộc lý do hay không.
3. Quy tắc hủy món của Bếp: các trạng thái được phép hủy và việc có bắt buộc lý do hay không.
4. Phương thức thanh toán và định dạng hóa đơn.
5. Đơn vị kho có cần quy đổi hay không.
6. Quy tắc lưu trữ/xóa mềm menu và dữ liệu nhân viên.
7. Cơ chế realtime/polling.
8. Chính sách pagination, idempotency và retention audit.

Không dùng các điểm còn mở để tự tạo thêm trạng thái hoặc quan hệ nghiệp vụ.

## 9. Audit log và migration

### 9.1 Audit log

`audit_logs` là nhật ký kỹ thuật/nghiệp vụ dùng để truy vết các thao tác nhạy cảm, độc lập với lịch sử trạng thái món (`order_item_status_history`) và sổ giao dịch kho (`stock_movements`). Tối thiểu lưu actor (có thể null với thao tác hệ thống), action, entity type, entity ID, metadata JSON tùy chọn và timestamp. Không dùng audit log thay thế các bảng lịch sử chuyên biệt.

### 9.2 Prisma và migration

- Prisma schema: `prisma/schema.prisma`.
- Migration: `prisma/migrations/<timestamp>_<name>/migration.sql`.
- PostgreSQL provider; `DATABASE_URL` lấy từ environment, không commit secrets.
- Không dùng `prisma db push` cho database dùng chung/production.
- Mọi thay đổi schema phải có migration được review.
- Seed role/permission tách riêng; không seed mật khẩu production mặc định.
- Schema Prisma phải được validate trước khi tạo migration. Migration khởi tạo cần được sinh từ chính schema bằng Prisma CLI, sau đó bổ sung SQL cho partial unique index và CHECK constraints mà Prisma schema không biểu diễn. Chưa chạy migration và chưa áp dụng lên database.

## 10. Checklist

- [ ] Không có Customer model/tài khoản khách hoặc customer_id trong order.
- [ ] Không có KitchenStation, stationId, KitchenTicket hoặc station routing.
- [ ] Không có order_type takeaway, guest_count hoặc table_id lặp trong Order.
- [ ] Một bàn tối đa một phiên OPEN; một phiên một order.
- [ ] Bàn chỉ AVAILABLE/OCCUPIED.
- [ ] Gọi thêm tạo order item mới.
- [ ] Order item chỉ có năm trạng thái chuẩn và có history.
- [ ] Giá món được snapshot ở thời điểm gọi.
- [ ] Một order tối đa một payment.
- [ ] Payment amount tính theo trạng thái item đã xác nhận.
- [ ] Payment gate: chỉ chặn xác nhận/đóng phiên nếu còn item AWAITING_ACCEPTANCE; cho phép IN_PREPARATION.
- [ ] Không có recipe/menu_item_ingredients/shortage report tự động.
- [ ] Không có daily opening/closing inventory record.
- [ ] Mỗi lần kiểm kê có actual quantity, timestamp và actor.
- [ ] Không tự động trừ kho theo món bán.
- [ ] Cảnh báo tồn thấp chỉ Inventory Staff được đọc.
- [ ] Chỉ Manager được đọc báo cáo.
- [ ] Migration SQL bổ sung partial unique index và CHECK cần thiết.
