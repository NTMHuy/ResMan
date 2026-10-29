# Thiết kế cơ sở dữ liệu ResMan

> Phiên bản: 2.0  
> Ngày cập nhật: 28/10/2026  
> Nhánh: `member/minhhuy`  
> Nguồn yêu cầu: [PRD](08-prd.md), [System Analysis & Design](09-system-analysis-and-design.md)

## 1. Phạm vi và nguyên tắc

Thiết kế PostgreSQL cho MVP của một nhà hàng, phục vụ nhiều giao diện (web quản lý, tablet tại bàn, giao diện nhân viên/KDS và ứng dụng mobile trong tương lai) qua một backend NestJS. Các client chỉ gọi API; không kết nối trực tiếp PostgreSQL.

- Prisma ORM quản lý schema và versioned migrations.
- PK dùng BIGINT identity; thời gian dùng TIMESTAMPTZ; tiền dùng NUMERIC(14,2); số lượng kho dùng NUMERIC(14,3).
- Tên bảng/cột snake_case. Trạng thái dùng VARCHAR + CHECK để dễ mở rộng.
- Không cascade-delete dữ liệu giao dịch/lịch sử.
- Không lưu mật khẩu dạng rõ.
- Một nhà hàng trong MVP; chưa có chi nhánh, nhà cung cấp, đơn mua hàng hoặc ca làm việc.
- AI Recommendation là tương lai, không thuộc migration MVP.

## 2. Quyết định nghiệp vụ đã chốt

| ID | Quyết định |
|---|---|
| DD-01 / DD-07 | Một đơn chỉ chứa món thuộc một kitchen station; một đơn có tối đa một kitchen ticket. |
| DD-02 | Không có modifier; yêu cầu riêng của khách lưu ở order_items.note. |
| DD-03 | Một đơn có tối đa một payment; không chia hóa đơn/thanh toán nhiều lần. |
| DD-04 | Không quản lý công thức/định mức số lượng nguyên liệu cho món. |
| DD-05 | Không tự động trừ kho theo đơn; nhân viên Kho ghi nhận nhập/xuất/điều chỉnh/hao hụt. |
| DD-06 / DD-10 | Khách có thể đặt với tư cách guest; đăng ký/đăng nhập là tùy chọn. |
| DD-08 | Khi nguyên liệu bắt buộc được ánh xạ cho món có tồn bằng 0 hoặc dưới ngưỡng, backend tự chuyển món sang trạng thái hết hàng do thiếu nguyên liệu và chặn đơn mới; phải hiển thị nguyên liệu/lý do. |
| DD-09 | Khách và Order Staff chỉ được hủy món khi món còn QUEUED, tức bếp chưa nhận/bắt đầu chế biến. |
| INV-01 | Kho kiểm kê đầu ngày và cuối ngày. Nhập thêm trong ngày ghi bằng stock_movements; không lưu lặp tổng nhập ở bản ghi kiểm kê. |

## 3. Mô hình trạng thái

### 3.1 Trạng thái món (order_items.status)

- PENDING_CONFIRMATION: khách vừa gửi đơn, chờ Order Staff xác nhận.
- QUEUED: đã được chuyển đến bếp, đang chờ bếp nhận.
- PREPARING: bếp đã nhận và bắt đầu chế biến.
- READY: món hoàn tất, chờ nhân viên giao.
- SERVED: món đã giao đến bàn.
- REJECTED: bếp từ chối chế biến, bắt buộc có lý do.
- CANCELLED: món bị hủy, lưu lý do khi có.

Luồng bình thường: PENDING_CONFIRMATION → QUEUED → PREPARING → READY → SERVED.  
Nhánh kết thúc: PENDING_CONFIRMATION/QUEUED → CANCELLED; QUEUED/PREPARING → REJECTED theo quyền và quy trình. Khách/Order Staff không được hủy sau khi món đã chuyển PREPARING. Bếp có thể từ chối món với lý do; các món khác trong cùng đơn tiếp tục xử lý.

Mỗi lần đổi trạng thái phải append order_item_status_history trong cùng transaction. Backend chịu trách nhiệm kiểm tra transition và quyền actor.

### 3.2 Trạng thái đơn

orders.status là trạng thái tổng hợp phục vụ danh sách đơn, không thay thế trạng thái từng món. Đơn có thể chứa món ở nhiều trạng thái; backend tính trạng thái tổng hợp theo quy tắc nghiệp vụ. Không đánh dấu đơn hoàn tất chỉ vì một món READY. Payment chỉ được ghi nhận một lần; đơn chỉ COMPLETED sau khi payment hợp lệ và các điều kiện giao món được đáp ứng.

### 3.3 Trạng thái khả dụng món

menu_items.availability_status gồm AVAILABLE, MANUAL_UNAVAILABLE, AUTO_OUT_OF_STOCK. Cột is_active quản lý việc món còn được sử dụng trong hệ thống; không dùng thêm trạng thái INACTIVE để tránh lưu trùng ý nghĩa. Trạng thái tự động do backend tính lại khi số dư/ngưỡng/mapping nguyên liệu thay đổi. Trạng thái thủ công của Quản lý không được tự động ghi đè. Nếu có nhiều nguyên liệu thiếu, API trả danh sách nguyên liệu và lý do.

Giới hạn quan trọng: mapping menu_item_ingredients chỉ xác định nguyên liệu bắt buộc, không có định mức. Hệ thống không thể tính đủ nguyên liệu cho số phần bất kỳ; không tự động trừ tồn.

## 4. Danh sách 24 bảng

| Nhóm | Bảng | Mục đích |
|---|---|---|
| Identity/Staff | roles | Vai trò nhân viên |
| | permissions | Danh mục quyền |
| | role_permissions | Vai trò - quyền |
| | users | Tài khoản nhân viên |
| | employees | Hồ sơ nhân viên |
| Menu/Kitchen setup | menu_categories | Danh mục món |
| | kitchen_stations | Trạm chế biến |
| | menu_items | Món ăn, giá, trạng thái bán, trạm |
| Dining/Customer | dining_tables | Bàn ăn |
| | dining_sessions | Phiên phục vụ của bàn, token lưu dạng hash |
| | table_devices | Tablet/thiết bị được gán bàn |
| | customers | Tài khoản khách tùy chọn |
| Order | orders | Đơn hàng, bàn/phiên/khách/trạm |
| | order_items | Snapshot món, số lượng, ghi chú, trạng thái món |
| | order_status_history | Lịch sử trạng thái tổng đơn |
| | order_item_status_history | Lịch sử trạng thái từng món |
| Kitchen | kitchen_tickets | Một vé bếp cho một đơn |
| Inventory | ingredients | Danh mục nguyên liệu và ngưỡng thấp |
| | inventory_balances | Số lượng tồn hiện tại |
| | stock_movements | Sổ cái nhập/xuất/điều chỉnh/hao hụt |
| | shortage_reports | Bếp báo thiếu nguyên liệu |
| | menu_item_ingredients | Mapping nguyên liệu bắt buộc, không có định mức |
| | daily_inventory_records | Số đếm đầu/cuối ngày theo nguyên liệu |
| Payment | payments | Một khoản thanh toán cho một đơn |

Không tạo kitchen_ticket_items: KDS truy vấn order_items theo order/kitchen_ticket; trạng thái món chỉ nằm ở order_items.

## 5. Quy tắc dữ liệu chi tiết

### 5.1 Customer, tablet và dining session

- customers tách khỏi users: users dành cho nhân viên, customers dành cho khách.
- Đăng nhập khách tùy chọn; đơn guest có orders.customer_id NULL.
- table_devices.device_code duy nhất và gắn một dining_table. Việc đổi bàn/thu hồi thiết bị do backend quản lý.
- dining_sessions đại diện phiên phục vụ của bàn; mỗi bàn tối đa một phiên OPEN tại một thời điểm.
- orders.customer_id lưu khách thực sự đặt từng đơn. Không đặt customer_id ở dining_sessions vì nhiều khách có thể dùng chung bàn/phiên.
- Khi khách đăng xuất hoặc kết thúc lượt sử dụng tablet, ứng dụng phải xóa liên kết tài khoản khỏi thiết bị/session hiện tại để tránh gắn nhầm lịch sử cho khách tiếp theo.

### 5.2 Order và kitchen station

- Mỗi menu_item có một kitchen_station_id.
- Khi tạo đơn, backend xác thực tất cả món cùng station; orders lưu kitchen_station_id để ràng buộc nhất quán.
- order_items lưu menu_item_id, kitchen_station_id, item_name_snapshot, unit_price, quantity, line_total và note.
- Ràng buộc composite FK bảo đảm món trong order_items cùng station với đơn và station của menu_item.
- kitchen_tickets.order_id unique; ticket station phải trùng station trên order.
- Ticket được tạo khi Order Staff điều phối đơn đã xác nhận vào bếp.

### 5.3 Inventory và kiểm kê

- inventory_balances là số dư hiện tại; stock_movements là sổ lịch sử bất biến.
- Mọi cập nhật số dư phải ghi movement trong cùng transaction và khóa dòng balance để tránh cập nhật đồng thời gây sai lệch.
- IN có quantity_delta dương; OUT/WASTE âm; ADJUSTMENT có thể dương hoặc âm.
- daily_inventory_records có unique (ingredient_id, inventory_date), lưu opening_quantity và closing_quantity là số đếm thực tế; closing có thể NULL cho đến khi chốt cuối ngày.
- Không lưu received_quantity trong daily_inventory_records: tổng nhập trong ngày được truy vấn từ stock_movements loại IN.
- Khi chốt closing count, backend so sánh số đếm thực tế với balance hiện tại, ghi ADJUSTMENT cho chênh lệch rồi cập nhật balance.
- Cảnh báo đặt hàng cho ngày sau khi closing_quantity dưới low_stock_threshold. MVP không có supplier/purchase order.

### 5.4 Payment

payments.order_id unique. payment_method lưu mã dạng chuỗi để không khóa cứng phương thức trước khi nhóm chốt. Không hỗ trợ split payment. Chỉ backend mới được tạo payment; amount phải được tính từ dữ liệu server.

## 6. Ràng buộc và transaction bắt buộc

- CHECK: quantity > 0; price/unit_price/line_total/amount >= 0; inventory quantity >= 0; capacity/guest_count > 0 nếu có; status nằm trong tập hợp hợp lệ.
- UNIQUE: username, email (khi có), employee_code, menu code, table code, device_code, order_code, kitchen_ticket.order_id, payments.order_id, (ingredient_id, inventory_date), (menu_item_id, ingredient_id).
- Một dining_table tối đa một dining_session OPEN (partial unique index).
- DINE_IN yêu cầu table_id + dining_session_id; TAKEAWAY không có bàn/session.
- Ghi trạng thái và lịch sử trong cùng transaction.
- Tạo order + order_items + history là một transaction.
- Dispatch tạo kitchen_ticket và chuyển món sang QUEUED cùng transaction.
- Cập nhật inventory balance + stock movement là một transaction.
- Chốt kiểm kê tạo adjustment + cập nhật balance + đóng bản ghi kiểm kê cùng transaction.
- Tạo payment + chuyển order sang COMPLETED + history là một transaction.

## 7. Index đề xuất

Index các truy vấn chính: menu theo category/status; orders theo status/created_at, table_id/created_at và customer_id/created_at; order_items theo order_id/status; lịch sử trạng thái theo item/order và changed_at; kitchen ticket theo station/status/dispatched_at; stock movements theo ingredient_id/created_at; daily inventory theo inventory_date; shortage_reports theo status/created_at.

## 8. Quyết định còn mở (không chặn migration nền tảng)

- OQ-02: danh sách phương thức thanh toán cuối cùng; hiện dùng VARCHAR.
- OQ-03: vai trò cụ thể được phép cấu hình low_stock_threshold; hiện bảo vệ bằng authorization ở backend.
- OQ-05: thao tác dispatch tự động hay thủ công; hiện tạo ticket khi Order Staff dispatch.
- OQ-07: chính sách xóa/ẩn món; mặc định không xóa cứng món có lịch sử.
- OQ-09: kênh thông báo; hiện lưu shortage_reports, notification transport để tầng ứng dụng quyết định.

## 9. Prisma và migration

- Prisma schema đặt tại prisma/schema.prisma.
- Migration đặt tại prisma/migrations/<timestamp>_initial_schema/migration.sql.
- Dùng PostgreSQL provider và DATABASE_URL qua environment variable; không commit secret.
- Không dùng prisma db push cho database dùng chung/production. Thay đổi schema phải có migration được review.
- Migration đầu tiên tạo schema nền tảng; seed role/permission/demo data tách riêng và không chứa tài khoản/mật khẩu mặc định production.

## 10. Tiêu chí nghiệm thu

- [ ] 24 bảng và quan hệ khớp mô hình.
- [ ] Không tồn tại kitchen_ticket_items hoặc modifier/recipe tables.
- [ ] Một đơn chỉ có một station và một kitchen ticket.
- [ ] Trạng thái món chỉ có một nguồn chuẩn và có history.
- [ ] Guest order và customer-linked order đều hợp lệ.
- [ ] Tablet gắn bàn; session token chỉ lưu hash.
- [ ] Auto-unavailable không ghi đè manual unavailable.
- [ ] Inventory opening/closing là số đếm thực; received total lấy từ stock_movements.
- [ ] Không tự động trừ kho theo đơn.
- [ ] Một payment tối đa cho một order.
- [ ] Migration có thể chạy trên PostgreSQL sạch và rollback/khôi phục theo quy trình backup.


---

## 11. Cập nhật quyết định dữ liệu theo nghiệp vụ ngày 29/10/2026

Nguồn nghiệp vụ ưu tiên: [11-confirmed-business-rules.md](11-confirmed-business-rules.md). Các quy tắc cũ mâu thuẫn tại tài liệu này không còn là yêu cầu nghiệp vụ hiện hành.

### 11.1 Điều chỉnh trạng thái order item
Tập trạng thái nghiệp vụ cần phản ánh:
- `PENDING_ACCEPTANCE` (Chờ tiếp nhận)
- `ACCEPTED` (Đã tiếp nhận)
- `PREPARING` (Đang chế biến)
- `COMPLETED` (Đã hoàn thành)
- `CANCELLED` (Đã hủy)

Tên mã enum/string cuối cùng phải được thống nhất trong schema và migration; không sử dụng `REJECTED`. Bếp có thể chuyển `PREPARING` về `ACCEPTED`. Nhân viên Order chỉ được sửa ghi chú/hủy món ở hai trạng thái trước khi chế biến; gọi thêm tạo order item mới.

### 11.2 Inventory
- Bỏ quy tắc tự động chuyển menu item sang AUTO_OUT_OF_STOCK do tồn nguyên liệu thấp/đạt ngưỡng.
- Ngưỡng thấp chỉ phát cảnh báo đến Nhân viên Kho.
- Không tự động trừ kho theo đơn hàng; không dùng recipe/định mức.
- Stock movement cần cho phép lưu thông tin đủ để truy vết nhập kho/điều chỉnh: loại giao dịch, lượng thay đổi, lý do/ghi chú, người thực hiện và thời điểm.
- Kiểm kê được thực hiện linh hoạt; chưa chốt có tiếp tục dùng bản ghi opening/closing theo ngày hay không.

### 11.3 Phiên bàn, thanh toán và tính bất biến
- Một phiên bàn có một đơn; gọi thêm tạo item mới trong cùng đơn.
- Một bàn chỉ có một phiên đang hoạt động.
- Payment duy nhất cho một order; không hỗ trợ split payment.
- Payment chỉ hợp lệ sau khi mọi item đã hoàn thành hoặc đã được giải quyết bằng trạng thái kết thúc phù hợp; CANCELLED không được tính tiền.
- Sau payment, order không được chỉnh sửa; xác nhận payment đóng phiên.
- Bảng/field cho yêu cầu thanh toán riêng chỉ bổ sung nếu phân tích tiếp theo xác định cần lưu trạng thái “đã yêu cầu thanh toán” tách biệt với “đã thanh toán”.

### 11.4 Cần đồng bộ trước khi migration
Schema hiện tại vẫn chứa các khái niệm cũ như `REJECTED`, `PENDING_CONFIRMATION`, `QUEUED`, `READY`, `SERVED`, quan hệ mapping nguyên liệu-món và daily opening/closing. Không được coi schema hiện tại là đã khớp nghiệp vụ mới. Cần thực hiện một lượt thiết kế lại có kiểm tra quan hệ và migration sau khi rà soát toàn bộ schema; không tự ý chạy migration production trong bước cập nhật tài liệu này.
