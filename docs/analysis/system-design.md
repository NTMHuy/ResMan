# CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

> **Phạm vi khảo sát:** Nhánh nguồn `member/minhhuy` tại commit `8658704` của repository `NTMHuy/ResMan`. Nội dung kế thừa tác nhân, yêu cầu FR/NFR và Use Case trong [Chương 2](requirements-analysis.md), đồng thời đối chiếu với `docs/11-confirmed-business-rules.md`, mã nguồn frontend/backend và `prisma/schema.prisma`. Đây là kết quả khảo sát tĩnh; không thay thế kiểm thử tích hợp hoặc xác nhận vận hành trên môi trường thực tế.

> **Quy ước trạng thái:** **Đã triển khai** = có bằng chứng ở source code; **Triển khai một phần** = có thành phần nhưng chưa đáp ứng đầy đủ hợp đồng/yêu cầu; **Quy tắc nghiệp vụ** = yêu cầu đã xác nhận nhưng chưa được code thực hiện; **Đề xuất** = hướng cải thiện chưa được xem là chức năng hiện hành.

## 3.1. Phạm vi và nguyên tắc thiết kế

### 3.1.1. Phạm vi hệ thống

ResMan là hệ thống quản lý hoạt động nhà hàng theo mô hình phục vụ tại bàn. Phạm vi nghiệp vụ chính gồm: tài khoản và phân quyền; thực đơn; bàn và phiên phục vụ; gọi món; điều phối chế biến tại bếp (KDS); quản lý nguyên liệu và kiểm kê; ghi nhận thanh toán; báo cáo vận hành. Hệ thống có năm vai trò nghiệp vụ: Khách hàng (CUSTOMER), Nhân viên Order (ORDER_STAFF), Nhân viên Bếp (KITCHEN_STAFF), Nhân viên Kho (INVENTORY_STAFF) và Quản lý (MANAGER).

Khách hàng sử dụng tablet được gán trước với một bàn và đăng nhập bằng tài khoản CUSTOMER. Backend xác định bàn từ quan hệ User–TableDevice, không cho khách tự chọn bàn hoặc truyền mã phiên để truy cập bàn khác. Nhân viên Order có thể chọn bàn và mở phiên thay khách. Mỗi bàn có tối đa một phiên OPEN; mỗi phiên có tối đa một Order; các lần gọi món tiếp theo bổ sung OrderItem vào cùng Order.

Các nội dung không thuộc phạm vi MVP theo quyết định nghiệp vụ gồm: đặt bàn trước, chuyển bàn bằng phần mềm, modifier/biến thể món, công thức định mức nguyên liệu, tự động trừ kho theo doanh số, tự động hết món do tồn kho thấp, thanh toán chia nhỏ/nhiều lần và tích hợp cổng thanh toán trực tuyến. AI gợi ý món là hướng phát triển nâng cao, không được coi là điều kiện của luồng nghiệp vụ cốt lõi.

### 3.1.2. Nguyên tắc thiết kế

- **Theo vai trò và ngữ cảnh thiết bị:** trải nghiệm khách trên tablet khác giao diện vận hành của nhân viên và quản lý.
- **Một nguồn dữ liệu nghiệp vụ:** trạng thái phiên, đơn và món được lưu phía server; frontend không tự quyết định trạng thái có hiệu lực.
- **Kiểm tra ở backend:** JWT xác thực danh tính; permission và điều kiện nghiệp vụ được kiểm tra ở API/service, không dựa riêng vào ẩn/hiện nút trên giao diện.
- **Bảo toàn lịch sử:** OrderItem lưu snapshot tên món và giá; lịch sử trạng thái và AuditLog được ghi nhận ở các nghiệp vụ quan trọng.
- **Transaction cho nghiệp vụ nhiều bước:** gọi món, cập nhật trạng thái, nhập/kiểm kê kho và xác nhận thanh toán có thao tác transaction để hạn chế dữ liệu dở dang.
- **Tách hiện trạng và định hướng:** chỉ mô tả chức năng đã có bằng chứng; quy tắc chưa triển khai và khuyến nghị được gắn nhãn riêng.

### 3.1.3. Giả định và giới hạn khảo sát

Các mô hình được xây dựng từ branch source được nêu trong phạm vi. Không có quyền truy cập database đang chạy, log vận hành, cấu hình bí mật hoặc thiết bị thật trong lần khảo sát này; vì vậy không kết luận dữ liệu production đã migrate đầy đủ, thời gian phản hồi đạt một ngưỡng cụ thể, hoặc mọi thao tác UI đã được kiểm thử end-to-end. Số trang phần thân báo cáo vẫn là thông tin biên tập cần điền: **[ĐIỀN SỐ TRANG]**.

## 3.2. Thiết kế kiến trúc tổng thể

### 3.2.1. Kiến trúc logic

ResMan được tổ chức theo kiến trúc frontend – backend – database, triển khai theo hướng modular monolith ở backend. Frontend là ứng dụng React Native chạy trên Expo SDK 58, sử dụng Expo Router và các feature module. Lớp repository API đóng gói lời gọi HTTP; context quản lý trạng thái xác thực và điều hướng. Backend sử dụng NestJS, chia module theo nghiệp vụ; Controller tiếp nhận HTTP request, DTO kiểm tra dữ liệu đầu vào và Service thực hiện nghiệp vụ. Prisma Client cùng `PrismaService` truy cập PostgreSQL. Cloudinary là dịch vụ ngoài dùng cho ảnh món ăn.

Đường giao tiếp chính là REST API với global prefix `/api/v1`. Các API nội bộ sử dụng Bearer JWT. Backend dùng `JwtAuthGuard` và `PermissionsGuard` ở các controller/route được khai báo. API đọc thực đơn khách `GET /menu-items/customer/menu` được tách thành `GuestMenuController` không gắn guard ở controller; đây là endpoint đọc công khai trong code hiện tại, cần được đối chiếu với chính sách truy cập khi triển khai.

### 3.2.2. Thành phần và trách nhiệm

| Thành phần | Công nghệ / cấu phần | Trách nhiệm |
|---|---|---|
| Giao diện | React Native 0.88, Expo SDK 58, Expo Router | Hiển thị màn hình theo vai trò và thiết bị. |
| Trạng thái và điều hướng | `AuthContext`, `NavigationContext`, `FeatureRouteView`, `AppShell` | Khôi phục profile, điều hướng và giới hạn route theo role. |
| Repository frontend | `Api*Repository`, Axios API client | Chuyển đổi dữ liệu API sang kiểu dữ liệu giao diện và gọi endpoint. |
| HTTP/API | NestJS Controllers, DTO, Guards | Ánh xạ endpoint, xác thực và kiểm tra permission. |
| Nghiệp vụ | NestJS Services | Kiểm tra quy tắc, phối hợp truy vấn và transaction. |
| Truy cập dữ liệu | Prisma Client, `PrismaService`, `@prisma/adapter-pg`, `pg` | Truy vấn và quản lý kết nối PostgreSQL. |
| Lưu trữ | PostgreSQL | Lưu tài khoản, thực đơn, bàn, phiên, đơn, kho, thanh toán và audit. |
| Ảnh | Cloudinary | Lưu ảnh thực đơn; database lưu URL và public ID. |

### 3.2.3. Luồng dữ liệu tổng quát

**Hình 3.1. Kiến trúc logic tổng thể của ResMan.** Sơ đồ biểu diễn luồng gọi API và lưu trữ dữ liệu, không khẳng định số lượng máy chủ hay topology triển khai thực tế.

![Kiến trúc logic](diagrams/architecture.mmd)

Frontend gọi API thông qua repository. Với API được bảo vệ, request mang Bearer JWT; backend xác minh token, tải lại user và permission từ database, sau đó kiểm tra permission được khai báo trên endpoint. Service thao tác với Prisma trong database; các nghiệp vụ có nhiều thay đổi liên quan được đóng gói trong transaction. Khi tải ảnh món, backend kiểm tra file, upload lên Cloudinary rồi lưu `imageUrl` và `imagePublicId` vào MenuItem.

### 3.2.4. Mô hình triển khai khái niệm

**Hình 3.2. Mô hình triển khai khái niệm.** Đây là mô hình logic dựa trên các thành phần trong repository; không thay thế sơ đồ hạ tầng triển khai production.

![Mô hình triển khai](diagrams/deployment.puml)

## 3.3. Thiết kế phân hệ và ranh giới module

### 3.3.1. Phân hệ nghiệp vụ

| Phân hệ | Trách nhiệm | Frontend | Backend / dữ liệu |
|---|---|---|---|
| Tài khoản và phân quyền | Đăng nhập, profile, quản lý user/role/permission | `features/auth`, `features/employees` | AuthModule, UsersModule; User, Role, Permission, RolePermission, Employee |
| Thực đơn | Danh mục, món, giá, trạng thái và ảnh | `features/menu` | MenuCategoriesModule, MenuItemsModule, CloudinaryModule; MenuCategory, MenuItem |
| Bàn và phiên | Quản lý bàn, mở/đóng và truy xuất phiên | `features/tables` | TablesModule, SessionsModule; DiningTable, TableDevice, DiningSession |
| Gọi món và Order | Thêm món, ghi chú, hủy món, theo dõi đơn | `features/customer-order`, `features/orders` | OrdersModule; Order, OrderItem, OrderItemStatusHistory |
| KDS | Hàng đợi bếp và cập nhật trạng thái món | `features/kds` | KitchenModule; OrderItem, OrderItemStatusHistory |
| Kho | Nguyên liệu, tồn, nhập kho, kiểm kê và lịch sử | `features/inventory` | InventoryModule; Ingredient, InventoryBalance, StockMovement, InventoryCountRecord |
| Thanh toán | Yêu cầu, tổng kết, xác nhận và đóng phiên | `features/orders` (PaymentModal) và customer order | PaymentsModule; PaymentRequest, Payment |
| Báo cáo | Tổng quan, doanh thu, best-sellers, đơn, tồn kho | `features/reports`, `features/dashboard` | ReportsModule; tổng hợp từ Payment, Order, OrderItem và inventory |
| Nhật ký | Ghi nhận thao tác nghiệp vụ quan trọng | Chưa thấy màn hình/API đọc audit | AuditLog được ghi bởi các service; chưa thấy controller đọc |

### 3.3.2. Ranh giới module backend

`AppModule` import ConfigModule, DatabaseModule và các module nghiệp vụ: Auth, Tables, Users, Sessions, Orders, Kitchen, Payments, Inventory, Reports, MenuCategories và MenuItems. DatabaseModule được khai báo global và export PrismaService. Các module Tables, Users, Sessions, Orders, Kitchen, Payments, Inventory và Reports khai báo import AuthModule trong module metadata. MenuCategoriesModule hiện không khai báo import; MenuItemsModule import CloudinaryModule. Sơ đồ dependency phải được hiểu đúng theo metadata `*.module.ts`, không suy diễn các module có dependency chỉ vì chúng cùng được AppModule import.

**Hình 3.3. Quan hệ phụ thuộc module NestJS theo khai báo hiện tại.**

![Module dependency](diagrams/module-dependencies.mmd)

### 3.3.3. Nguyên tắc phân tách trách nhiệm

Controller không nên chứa logic nghiệp vụ dài; DTO mô tả và xác thực dữ liệu request; Service quản lý quy tắc và transaction; Prisma model biểu diễn dữ liệu, không phải service. Frontend feature screen gọi repository thay vì tự xây dựng quy tắc dữ liệu nghiệp vụ. Backend hiện truy cập Prisma trực tiếp từ Service; chưa có bằng chứng về một lớp repository backend riêng.

## 3.4. Mô hình Use Case và truy vết yêu cầu

### 3.4.1. Tác nhân

| Tác nhân | Mục tiêu chính |
|---|---|
| Khách hàng (CUSTOMER) | Xem menu, bắt đầu/tiếp tục phiên được gán, gửi món, theo dõi/hủy món đủ điều kiện và yêu cầu thanh toán. |
| Nhân viên Order (ORDER_STAFF) | Xem bàn, mở phiên, theo dõi đơn, thêm món, sửa ghi chú/hủy món theo trạng thái và xác nhận thanh toán. |
| Nhân viên Bếp (KITCHEN_STAFF) | Theo dõi hàng đợi chung và cập nhật trạng thái từng món. |
| Nhân viên Kho (INVENTORY_STAFF) | Quản lý nguyên liệu, nhập kho, kiểm kê và xem biến động tồn. |
| Quản lý (MANAGER) | Quản trị tài khoản, thực đơn, bàn; tham gia nghiệp vụ và xem báo cáo. |

### 3.4.2. Danh sách Use Case

Danh sách giữ nguyên mã UC đã xác định trong Chương 2 để đảm bảo truy vết:

| Use Case | Tác nhân | Kết quả mong đợi | Mức triển khai theo Chương 2 |
|---|---|---|---|
| UC-01 Đăng nhập | Cả năm vai trò | Nhận JWT và thông tin role/permission | Đã triển khai |
| UC-02 Xem thực đơn | Khách hàng, Order, Quản lý | Xem danh mục/món theo API tương ứng | Đã triển khai |
| UC-03 Mở phiên | Khách hàng, Order | Tạo hoặc tái sử dụng phiên bàn và Order | Đã triển khai |
| UC-04 Gọi món | Khách hàng, Order | Tạo OrderItem mới trong phiên OPEN | Đã triển khai |
| UC-05 Theo dõi đơn/món | Khách hàng, Order | Xem món và trạng thái hiện tại | Đã triển khai |
| UC-06 Hủy món | Khách hàng, Order, Bếp, Quản lý | Hủy theo quyền và trạng thái | Triển khai một phần; có sai khác nghiệp vụ |
| UC-07 Quản lý bàn | Quản lý; Order (đọc) | Quản lý thông tin bàn và xem trạng thái | Đã triển khai |
| UC-08 Quản lý thực đơn | Quản lý | Quản lý danh mục, món, giá, ảnh | Đã triển khai |
| UC-09 Xử lý hàng đợi bếp | Bếp, Quản lý | Cập nhật trạng thái món | Triển khai một phần |
| UC-10 Quản lý kho | Kho, Quản lý | Quản lý nguyên liệu, nhập và kiểm kê | Đã triển khai |
| UC-11 Yêu cầu thanh toán | Khách hàng | Tạo PaymentRequest PENDING | Đã triển khai |
| UC-12 Xác nhận thanh toán | Order, Quản lý | Tạo Payment, đóng phiên, giải phóng bàn | Đã triển khai |
| UC-13 Quản lý tài khoản | Quản lý | Tạo/cập nhật user, role và trạng thái | Đã triển khai |
| UC-14 Xem báo cáo | Quản lý | Xem tổng quan, doanh thu, đơn, món bán chạy, kho | Đã triển khai |

### 3.4.3. Biểu đồ Use Case

**Hình 3.4. Use Case tổng quát theo năm tác nhân nghiệp vụ.**

![Use Case tổng quát](diagrams/use-cases.puml)

### 3.4.4. Truy vết FR – UC – phân hệ

| Nhóm FR | Use Case liên quan | Phân hệ chính |
|---|---|---|
| FR-01 – FR-06 | UC-02 – UC-06, UC-11 | Customer Order, Sessions, Orders, Payments |
| FR-07 – FR-12 | UC-03 – UC-07, UC-12 | Tables, Sessions, Orders, Payments |
| FR-13 – FR-14 | UC-06, UC-09 | Kitchen / KDS |
| FR-15 – FR-18 | UC-10 | Inventory |
| FR-19 – FR-24 | UC-07, UC-08, UC-12 – UC-14 | Users, Menu, Tables, Reports, Audit |

**Nhận xét:** Mã FR và UC được kế thừa từ `docs/analysis/requirements-analysis.md`; bảng này chỉ ánh xạ phạm vi, không nâng trạng thái “triển khai một phần” thành “đã triển khai”. Các sai khác cụ thể giữa yêu cầu và source code được phân tích ở các mục 3.7, 3.9 và 3.13.


## 3.5. Thiết kế quy trình nghiệp vụ

### 3.5.1. Quy trình khách hàng gọi món

Khách hàng đăng nhập bằng tài khoản CUSTOMER đã gán với TableDevice. Khi mở chức năng gọi món, frontend tải menu và yêu cầu backend mở/tiếp tục phiên. `SessionsService.openForCustomer()` xác định bàn từ user; nếu có phiên OPEN thì sử dụng phiên hiện tại, nếu bàn AVAILABLE thì tạo DiningSession và Order. Khi gửi món, `OrdersService` xác định phiên từ tài khoản, kiểm tra trạng thái phiên, tính khả dụng và giá từ MenuItem, sau đó tạo OrderItem cùng OrderItemStatusHistory trong transaction. Giá do server xác định, không lấy giá do client gửi làm giá có hiệu lực.

**Hình 3.5. Activity – Khách hàng gọi món, thể hiện các lane theo vai trò và hệ thống.**

![Activity customer order](diagrams/activity-customer-order.mmd)

### 3.5.2. Quy trình xử lý tại bếp

KDS truy vấn các OrderItem ở trạng thái AWAITING_ACCEPTANCE, ACCEPTED hoặc IN_PREPARATION thuộc phiên OPEN. Nhân viên Bếp chọn món và cập nhật trạng thái; backend kiểm tra trạng thái hiện tại, cập nhật có điều kiện, ghi lịch sử và AuditLog trong transaction. Theo code hiện tại, chuyển trạng thái bình thường là AWAITING_ACCEPTANCE → ACCEPTED → IN_PREPARATION → COMPLETED. Business Rules còn xác nhận khả năng quay lại IN_PREPARATION → ACCEPTED; chuyển trạng thái này chưa có trong bảng allowed của KitchenService và được đánh dấu là quy tắc chưa triển khai ở mục 3.7.

**Hình 3.6. Activity – Xử lý món tại KDS.**

![Activity kitchen](diagrams/activity-kitchen.mmd)

### 3.5.3. Quy trình yêu cầu và xác nhận thanh toán

Khách hàng gửi yêu cầu thanh toán; backend tạo hoặc tái sử dụng PaymentRequest PENDING. Nhân viên Order xem yêu cầu và tổng kết phiên. Khi xác nhận, PaymentsService kiểm tra phiên OPEN, Order tồn tại, chưa có Payment và không còn món AWAITING_ACCEPTANCE. Tổng tiền loại trừ món CANCELLED; các món ACCEPTED, IN_PREPARATION và COMPLETED vẫn được tính. Trong transaction Serializable, backend tạo Payment PAID, chuyển PaymentRequest PENDING thành COMPLETED, đóng DiningSession, đưa DiningTable về AVAILABLE và ghi AuditLog.

**Hình 3.7. Activity – Xác nhận thanh toán và đóng phiên.**

![Activity payment](diagrams/activity-payment.mmd)

## 3.6. Thiết kế tương tác – Sequence Diagram

### 3.6.1. Đăng nhập

**Hình 3.8. Sequence – Đăng nhập và tải quyền.** Login endpoint không gắn JwtAuthGuard vì đây là điểm cấp token. AuthService tìm user theo username, kiểm tra isActive và bcrypt password, cập nhật lastLoginAt, ký JWT thời hạn một ngày và trả role/permissions. JwtStrategy tải lại user và permission khi xác thực các request sau đó.

![Sequence login](diagrams/sequence-login.mmd)

### 3.6.2. Khách hàng mở phiên và gửi món

**Hình 3.9. Sequence – Khách hàng xem menu, mở phiên và gửi món.** Menu GET hiện không gắn guard; các thao tác mở phiên, đọc phiên và gửi món yêu cầu JWT cùng permission CUSTOMER tương ứng. Customer API lấy bàn từ TableDevice, không nhận tableId/sessionCode từ client.

![Sequence customer](diagrams/sequence-customer-order.mmd)

### 3.6.3. Nhân viên xác nhận thanh toán

**Hình 3.10. Sequence – Xác nhận thanh toán.** Mọi thay đổi payment/session/table trong transaction; lỗi điều kiện hoặc xung đột dẫn đến rollback và trả lỗi nghiệp vụ.

![Sequence payment](diagrams/sequence-payment.mmd)

## 3.7. Thiết kế trạng thái và điều kiện chuyển đổi

### 3.7.1. Trạng thái OrderItem

Các trạng thái lưu trong `OrderItem.status` là String và được giới hạn bằng CHECK constraint trong migration. Bảng dưới đây phân biệt quy tắc nghiệp vụ và code:

| Trạng thái hiện tại | Trạng thái tiếp theo | Tác nhân / điều kiện | Trạng thái theo code |
|---|---|---|---|
| AWAITING_ACCEPTANCE | ACCEPTED | Nhân viên Bếp; món thuộc phiên OPEN | Đã triển khai |
| ACCEPTED | IN_PREPARATION | Nhân viên Bếp; món thuộc phiên OPEN | Đã triển khai |
| IN_PREPARATION | COMPLETED | Nhân viên Bếp; món thuộc phiên OPEN | Đã triển khai |
| IN_PREPARATION | ACCEPTED | Nhân viên Bếp; quy tắc quay lại bước tiếp nhận | **Quy tắc nghiệp vụ, chưa triển khai** |
| AWAITING_ACCEPTANCE | CANCELLED | Khách hàng; món thuộc phiên của chính tài khoản | Đã triển khai |
| AWAITING_ACCEPTANCE / ACCEPTED | CANCELLED | Nhân viên Order; phiên còn OPEN | Đã triển khai |
| AWAITING_ACCEPTANCE / ACCEPTED / IN_PREPARATION | CANCELLED | Nhân viên Bếp; code cho phép nhưng quy tắc nghiệp vụ chưa chốt đầy đủ trạng thái được hủy | Có trong code; cần xác nhận phạm vi nghiệp vụ |

**Hình 3.11. State/transition diagram – OrderItem.** Mũi tên nét đứt thể hiện chuyển trạng thái có trong quy tắc nghiệp vụ nhưng chưa có trong KitchenService.

![Order item state machine](diagrams/state-order-item.mmd)

### 3.7.2. Sai khác liên quan đến hủy món

Mục 4.2 của `docs/11-confirmed-business-rules.md` xác nhận bếp không cần nhập lý do khi hủy món. Tuy nhiên, `KitchenService.updateStatus()` hiện từ chối CANCELLED nếu `reason` rỗng; KDS screen cũng hiển thị trường lý do bắt buộc. Đây là sai khác giữa nghiệp vụ đã xác nhận và triển khai. Báo cáo ghi nhận sai khác, không tự sửa backend/frontend trong phạm vi tài liệu.

### 3.7.3. Trạng thái phiên, bàn và yêu cầu thanh toán

| Đối tượng | Chuyển đổi chính | Tác nhân / guard | Bằng chứng |
|---|---|---|---|
| DiningTable | AVAILABLE → OCCUPIED | Khách bắt đầu phiên đã gán hoặc Order mở phiên; không có phiên OPEN khác | SessionsService + partial unique index |
| DiningTable | OCCUPIED → AVAILABLE | Payment được xác nhận và phiên đóng thành công | PaymentsService transaction |
| DiningSession | OPEN → CLOSED | Nhân viên có payments:confirm; Payment chưa tồn tại và không còn món AWAITING_ACCEPTANCE | PaymentsService |
| PaymentRequest | PENDING → COMPLETED | Xác nhận thanh toán cho phiên | PaymentsService.updateMany |
| Payment | tạo mới với PAID | Mỗi Order tối đa một Payment | unique Payment.orderId |

Không có bằng chứng về endpoint độc lập cho phép đóng phiên mà bỏ qua điều kiện thanh toán trong luồng nghiệp vụ chính. Trạng thái PaymentRequest là String; migration tạo cột và index nhưng không tạo CHECK constraint cho miền giá trị status.

## 3.8. Thiết kế cơ sở dữ liệu

### 3.8.1. Nguyên tắc và nhóm dữ liệu

Prisma schema dùng PostgreSQL. Phần lớn khóa chính là BigInt tự tăng; quan hệ khai báo bằng foreign key; nhiều quan hệ sử dụng onDelete Restrict. Các mã nghiệp vụ như username, email, role code, menu code, table code, sessionCode và orderCode có unique constraint. Một số trường giá trị tiền dùng Decimal; OrderItem lưu itemNameSnapshot, unitPrice và lineTotal để bảo toàn thông tin tại thời điểm đặt món.

### 3.8.2. ERD tổng quan

**Hình 3.12. ERD tổng quan.** Sơ đồ thể hiện các nhóm tài khoản, menu, phiên/đơn, kho và thanh toán; thuộc tính chi tiết được tách sang ba ERD nhóm để giữ khả năng đọc.

![ERD overview](diagrams/erd-overview.mmd)

### 3.8.3. ERD tài khoản và RBAC

**Hình 3.13. ERD – Tài khoản, vai trò, quyền và thiết bị khách.**

![ERD account](diagrams/erd-account-rbac.mmd)

- Role – User: một Role có nhiều User; mỗi User có một roleId bắt buộc.
- Role – Permission: quan hệ nhiều-nhiều qua RolePermission với khóa chính ghép.
- User – Employee: một-một tùy chọn qua Employee.userId unique.
- User – TableDevice: userId nullable unique; mỗi tài khoản CUSTOMER gắn tối đa một thiết bị.
- DiningTable – TableDevice: diningTableId unique; mỗi bàn có tối đa một thiết bị gắn trong schema hiện tại.

### 3.8.4. ERD phiên, đơn và thanh toán

**Hình 3.14. ERD – Phiên phục vụ, Order, OrderItem và Payment.**

![ERD sessions orders](diagrams/erd-session-order-payment.mmd)

DiningTable có nhiều DiningSession theo thời gian; Order.diningSessionId unique nên một phiên có tối đa một Order. Order có nhiều OrderItem và mỗi OrderItem tham chiếu MenuItem. OrderItemStatusHistory lưu trạng thái trước/sau, tác nhân, thời điểm và reason. PaymentRequest gắn một-một tùy chọn với DiningSession; Payment gắn một-một tùy chọn với Order.

### 3.8.5. ERD thực đơn và kho

**Hình 3.15. ERD – Danh mục, món ăn và dữ liệu tồn kho.**

![ERD menu inventory](diagrams/erd-menu-inventory.mmd)

MenuCategory có nhiều MenuItem. Ingredient có tối đa một InventoryBalance, đồng thời có nhiều StockMovement và InventoryCountRecord. MVP không có quan hệ công thức/định mức nguyên liệu giữa MenuItem và Ingredient; không mô hình hóa tự động trừ kho theo đơn bán.

### 3.8.6. Ràng buộc và migration

Các migration bổ sung CHECK constraint cho trạng thái bàn, phiên, món, lịch sử trạng thái, giá, số lượng, tồn kho, loại movement, kiểm kê và Payment. Migration `20261117190000_one_open_session_per_table` tạo partial unique index giới hạn một phiên OPEN trên mỗi bàn. Migration `20261126170000_add_payment_requests` tạo bảng PaymentRequest, unique index theo dining_session_id và index theo status/requested_at nhưng **không tạo CHECK constraint cho PaymentRequest.status**. Vì vậy miền giá trị status hiện được kiểm soát chủ yếu ở tầng Service.

Migration khởi tạo mới có thao tác loại bỏ một số cấu trúc cũ; khi áp dụng lên database có dữ liệu cần sao lưu và đánh giá trước. Không kết luận database ở môi trường chạy đã đồng bộ nếu chưa kiểm tra migration status trực tiếp.

### 3.8.7. Class Diagram nhóm xử lý

**Hình 3.16. Class Diagram – Các thành phần điều phối nghiệp vụ cốt lõi.** DTO là cấu trúc request; Prisma model là cấu trúc dữ liệu; Controller và Service là các class xử lý của NestJS.

![Class diagram](diagrams/class-domain.puml)
