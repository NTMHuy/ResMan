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
