# CHƯƠNG 2. PHÂN TÍCH VÀ ĐẶC TẢ YÊU CẦU HỆ THỐNG

> **Phạm vi và cách đánh giá:** Tài liệu này phân tích nhánh `member/minhhuy` của repository `NTMHuy/ResMan`. Trạng thái triển khai được xác định từ mã nguồn frontend, backend và `prisma/schema.prisma`; tài liệu nghiệp vụ được dùng để đối chiếu, không thay thế bằng chứng mã nguồn. Phân tích là khảo sát tĩnh, chưa phải kết quả kiểm thử vận hành toàn bộ.

## 2.1. Tổng quan yêu cầu hệ thống

ResMan là hệ thống hỗ trợ quản lý hoạt động của một nhà hàng, tập trung vào luồng phục vụ tại bàn: khách hàng xem thực đơn và gọi món; nhân viên Order quản lý bàn, phiên phục vụ và yêu cầu món; nhân viên Bếp tiếp nhận và cập nhật tiến độ chế biến; nhân viên Kho quản lý nguyên liệu và số lượng tồn; Quản lý giám sát tài khoản, thực đơn, bàn và báo cáo.

Phạm vi nghiệp vụ có căn cứ trong tài liệu `docs/01-project-vision.md`, `docs/08-prd.md`, `docs/11-confirmed-business-rules.md` và các module hiện có trong `backend/src`. Hệ thống hiện tập trung vào một nhà hàng, đặt món tại chỗ, một đơn hàng gắn với một phiên bàn, quản lý tồn kho thủ công và ghi nhận thanh toán cơ bản. Chưa có bằng chứng về giao hàng, đa chi nhánh, tích điểm, tích hợp cổng thanh toán nhiều nhà cung cấp, định mức công thức món ăn hoặc gợi ý món bằng AI.

Frontend được tổ chức theo các phân hệ trong `frontend/src/features` và các route Expo Router trong `frontend/app/(main)`; các repository API gọi backend qua Axios. Backend sử dụng NestJS, tổ chức theo module/controller/service và Prisma để truy cập PostgreSQL. Lược đồ dữ liệu được khai báo tại `prisma/schema.prisma`.

**Đối tượng sử dụng:** Khách hàng (tài khoản CUSTOMER gắn với thiết bị/bàn), Nhân viên Order, Nhân viên Bếp, Nhân viên Kho và Quản lý. Đây là năm vai trò nghiệp vụ được xác định trong tài liệu và được seed trong `backend/src/seed.ts`.

## 2.2. Xác định tác nhân

### 2.2.1. Mô tả các tác nhân

Trong mô hình yêu cầu, tác nhân là vai trò bên ngoài tương tác với hệ thống. Role là bản ghi phân quyền trong cơ sở dữ liệu; User là tài khoản đăng nhập; Permission là quyền thao tác được gán cho Role thông qua RolePermission. Vì vậy, năm tác nhân nghiệp vụ không đồng nghĩa với năm tài khoản cụ thể.

### 2.2.2. Bảng tổng hợp tác nhân

| Tác nhân | Vai trò | Chức năng chính |
|---|---|---|
| Khách hàng (CUSTOMER) | Người sử dụng dịch vụ tại bàn; tài khoản khách được gắn với TableDevice và DiningTable. | Xem thực đơn công khai; bắt đầu/xem phiên bàn; gửi món, theo dõi món trong phiên, hủy món khi còn chờ bếp tiếp nhận; gửi yêu cầu thanh toán. |
| Nhân viên Order (ORDER_STAFF) | Tiếp nhận và điều phối hoạt động phục vụ tại bàn. | Xem bàn; mở/đóng phiên; xem đơn đang hoạt động; thêm món, cập nhật ghi chú hoặc hủy món theo trạng thái; xem yêu cầu thanh toán và xác nhận thanh toán. |
| Nhân viên Bếp (KITCHEN_STAFF) | Xử lý hàng đợi chế biến. | Xem hàng đợi KDS; cập nhật trạng thái từng món theo các chuyển trạng thái backend cho phép. |
| Nhân viên Kho (INVENTORY_STAFF) | Theo dõi nguyên liệu và tồn kho thủ công. | Xem/tìm nguyên liệu, cập nhật thông tin nguyên liệu, nhập kho, kiểm kê và xem lịch sử biến động/kiểm kê. |
| Quản lý (MANAGER) | Quản trị và giám sát nghiệp vụ nhà hàng. | Quản lý tài khoản/role, thực đơn, bàn; tham gia nghiệp vụ Order, Bếp, Kho, thanh toán; xem báo cáo. |

**Căn cứ:** role và permission được khai báo trong `backend/src/seed.ts`; xác thực và lấy permission hiện hành tại `backend/src/auth/auth.service.ts`, `backend/src/auth/strategies/jwt.strategy.ts`; kiểm tra quyền tại `backend/src/auth/guards/permissions.guard.ts`. Các controller nghiệp vụ thể hiện quyền cụ thể.

### 2.2.3. Phân biệt role và quyền truy cập

- **Role trong database:** `MANAGER`, `ORDER_STAFF`, `KITCHEN_STAFF`, `INVENTORY_STAFF`, `CUSTOMER`.
- **Tài khoản:** lưu tại `users`, có `username`, `passwordHash`, `isActive`, `roleId`; nhân viên có hồ sơ liên kết trong `employees`. Tài khoản CUSTOMER được liên kết thiết bị/bàn qua `table_devices`.
- **Permission:** các mã quyền như `orders:read`, `kitchen:update-item`, `inventory:count`, `reports:read`; quan hệ Role–Permission được lưu qua `role_permissions`.
- **Backend authorization:** JWT guard xác thực token; PermissionsGuard kiểm tra permission lấy từ role trong database. Frontend có thêm kiểm soát route/quyền tại `frontend/src/constants/rbac.ts`, nhưng đây là lớp hỗ trợ trải nghiệm; backend mới là nơi quyết định quyền đối với API.

## 2.3. Phân tích yêu cầu chức năng

Các yêu cầu dưới đây được nhóm theo nghiệp vụ. “Đã triển khai” phản ánh có luồng frontend/backend/database đủ căn cứ ở mức mã nguồn; các sai khác tích hợp được ghi ở mục 2.6.

### 2.3.1. Nhóm chức năng Khách hàng

| Mã | Chức năng | Mục đích và mô tả xử lý | Mức độ |
|---|---|---|---|
| FR-01 | Xem thực đơn | Truy cập danh sách danh mục và món đang hoạt động/có thể bán; backend cung cấp endpoint đọc thực đơn khách hàng. | Đã triển khai |
| FR-02 | Bắt đầu hoặc tiếp tục phiên bàn | Khách dùng tài khoản CUSTOMER đã gắn TableDevice; backend xác định bàn từ tài khoản, tái sử dụng phiên OPEN hoặc tạo phiên và đơn tương ứng. | Đã triển khai |
| FR-03 | Gửi yêu cầu gọi món | Khách chọn món, số lượng và ghi chú; backend kiểm tra phiên, trạng thái món, giá trong database và tạo OrderItem cùng lịch sử trạng thái. | Đã triển khai |
| FR-04 | Theo dõi món trong phiên | Khách xem phiên, đơn và các món cùng trạng thái hiện tại; frontend ánh xạ trạng thái API sang trạng thái hiển thị. | Đã triển khai |
| FR-05 | Hủy món trước khi bếp tiếp nhận | Khách chỉ hủy món thuộc phiên bàn của mình khi món ở trạng thái AWAITING_ACCEPTANCE; hệ thống chuyển CANCELLED và lưu lịch sử. | Đã triển khai |
| FR-06 | Yêu cầu thanh toán | Khách gửi yêu cầu thanh toán cho phiên đang mở; nhân viên tiếp nhận yêu cầu để xử lý. | Đã triển khai |

**Căn cứ:** `backend/src/menu-items/guest-menu.controller.ts`; `backend/src/sessions/sessions.controller.ts`; `backend/src/orders/orders.controller.ts`, `orders.service.ts`; `backend/src/payments/payments.controller.ts`, `payments.service.ts`; `frontend/src/repositories/api/ApiCustomerOrderRepository.ts`.

Lưu ý: tài liệu vision từng mô tả khách có thể đặt món không cần tài khoản, nhưng luồng backend hiện tại dùng JWT CUSTOMER và TableDevice. Chưa tìm thấy luồng đặt món ẩn danh tương ứng trong controller/service hiện tại; do đó yêu cầu đặt món không cần tài khoản không được xem là đã triển khai.

### 2.3.2. Nhóm chức năng Nhân viên Order

| Mã | Chức năng | Mục đích và mô tả xử lý | Mức độ |
|---|---|---|---|
| FR-07 | Xem và quản lý bàn | Xem danh sách/chi tiết bàn; tạo, cập nhật, xóa bàn theo quyền. Nhân viên Order có quyền đọc; quyền quản trị bàn được cấp cho Quản lý theo seed. | Đã triển khai |
| FR-08 | Mở và đóng phiên phục vụ | Nhân viên Order mở phiên cho bàn được chọn; hệ thống tạo phiên và đơn gắn với phiên. Có endpoint đóng phiên theo permission. | Đã triển khai |
| FR-09 | Theo dõi đơn đang hoạt động | Xem danh sách đơn thuộc các phiên đang mở, kèm bàn và danh sách món. | Đã triển khai |
| FR-10 | Thêm món vào đơn | Nhân viên thêm món vào đơn của phiên đang mở; backend kiểm tra món khả dụng, lấy giá từ database và tạo các OrderItem mới. | Đã triển khai |
| FR-11 | Cập nhật ghi chú hoặc hủy món | Nhân viên cập nhật ghi chú/hủy món qua API quản lý món; điều kiện trạng thái được kiểm tra trong service. | Đã triển khai một phần |
| FR-12 | Xử lý yêu cầu và xác nhận thanh toán | Nhân viên xem yêu cầu thanh toán, xem tổng kết phiên và xác nhận đã thu tiền; backend tạo Payment, đóng phiên và trả bàn về AVAILABLE trong transaction. | Đã triển khai |

**Căn cứ:** `backend/src/tables/tables.controller.ts`; `backend/src/sessions/sessions.controller.ts`; `backend/src/orders/staff-orders.controller.ts`, `orders.service.ts`; `backend/src/payments/payments.controller.ts`, `payments.service.ts`; `frontend/src/repositories/api/ApiOrderRepository.ts`.

FR-11 được đánh giá một phần vì frontend gọi endpoint cập nhật trạng thái toàn đơn `PATCH /orders/:id/items/status`, trong khi controller hiện tại không khai báo route này. Backend có API riêng cho ghi chú và hủy từng món; cần đồng bộ thao tác frontend với API thực tế.

### 2.3.3. Nhóm chức năng Nhân viên Bếp

| Mã | Chức năng | Mục đích và mô tả xử lý | Mức độ |
|---|---|---|---|
| FR-13 | Xem hàng đợi bếp (KDS) | Hiển thị các món ở trạng thái chờ tiếp nhận, đã tiếp nhận hoặc đang chế biến thuộc phiên đang mở. | Đã triển khai |
| FR-14 | Cập nhật trạng thái chế biến | Bếp cập nhật trạng thái từng món; backend kiểm tra trạng thái hiện tại, ghi lịch sử và audit log trong transaction. | Đã triển khai một phần |

**Căn cứ:** `backend/src/kitchen/kitchen.controller.ts`, `kitchen.service.ts`; `frontend/src/repositories/api/ApiKDSRepository.ts`; `docs/11-confirmed-business-rules.md`.

Luồng backend hiện cho phép AWAITING_ACCEPTANCE → ACCEPTED/CANCELLED; ACCEPTED → IN_PREPARATION/CANCELLED; IN_PREPARATION → COMPLETED/CANCELLED. Chưa có chuyển ngược IN_PREPARATION → ACCEPTED như một số mô tả nghiệp vụ trước đó. Backend cũng yêu cầu lý do khi bếp hủy món, trong khi quy tắc đã xác nhận ở tài liệu có nội dung không yêu cầu lý do. Đây là điểm chưa đồng nhất cần xử lý trước khi khẳng định toàn bộ quy trình KDS đã hoàn chỉnh.

### 2.3.4. Nhóm chức năng Nhân viên Kho

| Mã | Chức năng | Mục đích và mô tả xử lý | Mức độ |
|---|---|---|---|
| FR-15 | Quản lý danh mục nguyên liệu | Tạo, tìm kiếm, xem và cập nhật thông tin nguyên liệu, đơn vị, ngưỡng tồn và trạng thái hoạt động. | Đã triển khai |
| FR-16 | Ghi nhận nhập kho | Cộng số lượng nhập vào InventoryBalance, tạo StockMovement loại IN và audit log trong transaction. | Đã triển khai |
| FR-17 | Kiểm kê nguyên liệu | Ghi nhận số lượng thực tế, lưu InventoryCountRecord và điều chỉnh số dư bằng movement ADJUSTMENT. | Đã triển khai |
| FR-18 | Theo dõi tồn kho và lịch sử | Xem số lượng hiện có, cảnh báo mức tồn thấp theo ngưỡng và tra cứu movement/record kiểm kê. | Đã triển khai |

**Căn cứ:** `backend/src/inventory/inventory.controller.ts`, `inventory.service.ts`; `prisma/schema.prisma` (Ingredient, InventoryBalance, StockMovement, InventoryCountRecord); `frontend/src/repositories/api/ApiInventoryRepository.ts`.

Chưa tìm thấy API xuất kho độc lập hoặc cơ chế tự động trừ nguyên liệu theo đơn hàng. Tài liệu nghiệp vụ cũng xác nhận MVP không tự động trừ kho khi chưa có định mức nguyên liệu. Việc kiểm kê hiện thực tế cập nhật số dư và ghi movement điều chỉnh, dù tài liệu API còn ghi nhận đây là điểm cần quyết định.

### 2.3.5. Nhóm chức năng Quản lý

| Mã | Chức năng | Mục đích và mô tả xử lý | Mức độ |
|---|---|---|---|
| FR-19 | Quản lý tài khoản và vai trò | Tạo tài khoản nhân viên/khách hàng, cập nhật hồ sơ, gán role và khóa/mở tài khoản. Mật khẩu được băm trước khi lưu. | Đã triển khai |
| FR-20 | Quản lý thực đơn | Quản lý danh mục, món ăn, giá, trạng thái bán và hình ảnh; ảnh được tải lên Cloudinary và URL/public ID được lưu. | Đã triển khai |
| FR-21 | Quản lý bàn | Tạo, cập nhật và xóa bàn theo điều kiện nghiệp vụ; quản lý có quyền tables:manage. | Đã triển khai |
| FR-22 | Giám sát nghiệp vụ đơn, bếp, kho và thanh toán | Quản lý được seed toàn bộ permission nghiệp vụ nội bộ, có thể sử dụng các API tương ứng. | Đã triển khai |
| FR-23 | Xem báo cáo vận hành | Xem tổng quan doanh thu, số đơn đã thanh toán, số món bán, doanh thu theo kỳ, món bán chạy, danh sách đơn và tổng hợp tồn kho. | Đã triển khai |
| FR-24 | Xem nhật ký kiểm toán | Database có AuditLog và service nghiệp vụ ghi log cho các thao tác quan trọng; chưa tìm thấy API đọc audit log trong controller hiện tại. | Đang triển khai một phần |

**Căn cứ:** `backend/src/users/users.controller.ts`, `users.service.ts`, `seed.ts`; `backend/src/menu-categories/menu-categories.controller.ts`; `backend/src/menu-items/menu-items.controller.ts`; `backend/src/tables/tables.controller.ts`; `backend/src/reports/reports.controller.ts`, `reports.service.ts`; `prisma/schema.prisma`.

### 2.3.6. Bảng tổng hợp yêu cầu chức năng

| Nhóm | Mã yêu cầu | Phạm vi |
|---|---|---|
| Khách hàng | FR-01 – FR-06 | Xem thực đơn, phiên bàn, gọi món, theo dõi/hủy món, yêu cầu thanh toán |
| Nhân viên Order | FR-07 – FR-12 | Bàn, phiên, đơn đang hoạt động, thêm/sửa/hủy món, thanh toán |
| Nhân viên Bếp | FR-13 – FR-14 | Hàng đợi KDS và cập nhật trạng thái món |
| Nhân viên Kho | FR-15 – FR-18 | Nguyên liệu, nhập kho, kiểm kê, tồn kho và lịch sử |
| Quản lý | FR-19 – FR-24 | Tài khoản, thực đơn, bàn, giám sát, báo cáo và audit |

## 2.4. Phân tích yêu cầu phi chức năng

| Mã | Nhóm | Yêu cầu và căn cứ | Cách kiểm chứng | Đánh giá |
|---|---|---|---|---|
| NFR-01 | Bảo mật và xác thực | API nội bộ sử dụng JWT Bearer; mật khẩu lưu dạng hash bcrypt; tài khoản không hoạt động bị từ chối. Căn cứ: `auth.service.ts`, `jwt.strategy.ts`, `apiClient.ts`. | Thử đăng nhập sai, token sai/hết hạn và tài khoản bị khóa. | Đã đáp ứng ở mức mã nguồn |
| NFR-02 | Phân quyền | Backend kiểm tra quyền theo permission qua JwtAuthGuard và PermissionsGuard; role-permission được seed riêng. Frontend giới hạn route và thao tác tương ứng. | Gọi API bằng từng role và kiểm tra trường hợp thiếu permission. | Đã đáp ứng ở cấu trúc; cần kiểm thử ma trận đầy đủ |
| NFR-03 | Bảo vệ dữ liệu đầu vào | Global ValidationPipe bật whitelist, forbidNonWhitelisted và transform; DTO được dùng tại controller. | Gửi thiếu/sai kiểu dữ liệu và trường ngoài DTO. | Đã đáp ứng ở cấu hình; cần kiểm thử |
| NFR-04 | Hiệu năng truy vấn | Có phân trang/giới hạn ở danh sách người dùng, báo cáo, movement và count; schema có index trên các trường tra cứu/trạng thái. Không có chỉ tiêu thời gian phản hồi được xác nhận. | Đo tải và thời gian phản hồi trên dữ liệu đại diện. | Có hỗ trợ kỹ thuật; chưa có số liệu |
| NFR-05 | Tính nhất quán | Các nghiệp vụ nhiều bước như gọi món, cập nhật trạng thái, nhập/kiểm kê kho và thanh toán sử dụng transaction; một số luồng đặt isolation Serializable và xử lý xung đột. | Kiểm thử đồng thời và lỗi giữa transaction. | Đã có cơ chế trong code; cần kiểm thử |
| NFR-06 | Khả năng truy vết | Có OrderItemStatusHistory và AuditLog; một số service ghi lịch sử và nhật ký cùng giao dịch nghiệp vụ. | Đối chiếu thay đổi trạng thái với lịch sử/audit. | Đáp ứng một phần; API xem audit chưa thấy |
| NFR-07 | Khả năng sử dụng | Frontend chia phân hệ theo vai trò, có màn hình dashboard, menu, customer order, orders, KDS, inventory, employees và reports; có context xác thực, theme và toast. | Kiểm thử tác vụ với đại diện từng vai trò. | Có bằng chứng giao diện; chưa có đánh giá người dùng |
| NFR-08 | Tương thích nền tảng | Frontend dùng Expo/React Native, cấu hình Android, iOS và Web trong package scripts; backend cung cấp REST API qua HTTP. | Kiểm thử build và luồng trên từng nền tảng. | Có cấu hình; chưa xác minh tương thích đầy đủ |
| NFR-09 | Khả năng bảo trì | Backend chia NestJS module/controller/service; frontend chia feature và repository interface/API implementation. | Kiểm tra mức phụ thuộc và khả năng thay đổi từng phân hệ. | Đã đáp ứng ở cấu trúc |
| NFR-10 | Khả năng triển khai và vận hành an toàn | Backend dùng Helmet, CORS allowlist theo biến môi trường, cấu hình API prefix và static upload. | Kiểm tra cấu hình môi trường triển khai và CORS. | Đáp ứng một phần; cần rà soát cấu hình thực tế |

Không có căn cứ để khẳng định hệ thống đạt một ngưỡng hiệu năng, tiêu chuẩn bảo mật hoặc mức độ sẵn sàng cụ thể. Những nội dung đó cần được xác nhận bằng kiểm thử và cấu hình triển khai.

## 2.5. Mô hình Use Case

### 2.5.1. Danh sách Use Case tổng quát

| Mã | Use Case | Tác nhân chính | Mô tả | Trạng thái |
|---|---|---|---|---|
| UC-01 | Đăng nhập hệ thống | Cả năm tác nhân | Xác thực tài khoản và nhận JWT cùng thông tin role/permission. | Đã triển khai |
| UC-02 | Xem thực đơn | Khách hàng; Nhân viên Order | Truy xuất danh mục và món ăn phù hợp quyền truy cập. | Đã triển khai |
| UC-03 | Mở phiên phục vụ | Khách hàng; Nhân viên Order | Mở phiên cho bàn đã gán (khách) hoặc bàn được chọn (nhân viên Order). | Đã triển khai |
| UC-04 | Gọi món | Khách hàng; Nhân viên Order | Thêm món vào đơn của phiên đang mở. | Đã triển khai |
| UC-05 | Theo dõi đơn/món | Khách hàng; Nhân viên Order | Xem danh sách món và trạng thái trong phiên/đơn đang hoạt động. | Đã triển khai |
| UC-06 | Hủy món | Khách hàng; Nhân viên Order; Nhân viên Bếp | Hủy món theo điều kiện trạng thái và quyền tương ứng. | Đã triển khai một phần |
| UC-07 | Quản lý bàn | Quản lý; Nhân viên Order (xem) | Quản lý thông tin bàn; nhân viên Order xem danh sách bàn. | Đã triển khai |
| UC-08 | Quản lý thực đơn | Quản lý | Quản lý danh mục, món ăn, giá, trạng thái và hình ảnh. | Đã triển khai |
| UC-09 | Xử lý hàng đợi bếp | Nhân viên Bếp; Quản lý | Xem KDS và cập nhật trạng thái từng món. | Đã triển khai một phần |
| UC-10 | Quản lý kho nguyên liệu | Nhân viên Kho; Quản lý | Quản lý nguyên liệu, nhập kho, kiểm kê và lịch sử tồn. | Đã triển khai |
| UC-11 | Yêu cầu thanh toán | Khách hàng | Gửi yêu cầu thanh toán cho phiên bàn đang mở. | Đã triển khai |
| UC-12 | Xác nhận thanh toán | Nhân viên Order; Quản lý | Xem tổng kết, xác nhận thanh toán, đóng phiên và giải phóng bàn. | Đã triển khai |
| UC-13 | Quản lý tài khoản và vai trò | Quản lý | Tạo/cập nhật tài khoản, hồ sơ nhân viên, gán role và thay đổi trạng thái. | Đã triển khai |
| UC-14 | Xem báo cáo | Quản lý | Xem tổng quan, doanh thu, món bán chạy, đơn hàng và tồn kho. | Đã triển khai |

### 2.5.2. Bảng Actor – Use Case

Ký hiệu X biểu thị tác nhân có tham gia Use Case theo quyền và luồng hiện có; “–” biểu thị không có căn cứ tham gia.

| Use Case | Khách hàng | Nhân viên Order | Nhân viên Bếp | Nhân viên Kho | Quản lý |
|---|:---:|:---:|:---:|:---:|:---:|
| UC-01 Đăng nhập | X | X | X | X | X |
| UC-02 Xem thực đơn | X | X | – | – | X |
| UC-03 Mở phiên phục vụ | X | X | – | – | X |
| UC-04 Gọi món | X | X | – | – | X |
| UC-05 Theo dõi đơn/món | X | X | – | – | X |
| UC-06 Hủy món | X | X | X | – | X |
| UC-07 Quản lý bàn | – | X* | – | – | X |
| UC-08 Quản lý thực đơn | – | – | – | – | X |
| UC-09 Xử lý hàng đợi bếp | – | – | X | – | X |
| UC-10 Quản lý kho nguyên liệu | – | – | – | X | X |
| UC-11 Yêu cầu thanh toán | X | – | – | – | – |
| UC-12 Xác nhận thanh toán | – | X | – | – | X |
| UC-13 Quản lý tài khoản và vai trò | – | – | – | – | X |
| UC-14 Xem báo cáo | – | – | – | – | X |

* Nhân viên Order có quyền xem bàn và mở/đóng phiên; không có quyền tạo/sửa/xóa thông tin bàn theo seed permission hiện tại. Quản lý có quyền quản lý bàn. Quản lý có thể tham gia các nghiệp vụ nội bộ vì seed cấp toàn bộ permission nghiệp vụ.

### 2.5.3. Biểu đồ Use Case tổng quát

PlantUML:

~~~plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Khách hàng" as Customer
actor "Nhân viên Order" as OrderStaff
actor "Nhân viên Bếp" as KitchenStaff
actor "Nhân viên Kho" as InventoryStaff
actor "Quản lý" as Manager

rectangle "Hệ thống ResMan" {
  usecase "UC-01\nĐăng nhập" as UC01
  usecase "UC-02\nXem thực đơn" as UC02
  usecase "UC-03\nMở phiên phục vụ" as UC03
  usecase "UC-04\nGọi món" as UC04
  usecase "UC-05\nTheo dõi đơn/món" as UC05
  usecase "UC-06\nHủy món" as UC06
  usecase "UC-07\nQuản lý bàn" as UC07
  usecase "UC-08\nQuản lý thực đơn" as UC08
  usecase "UC-09\nXử lý hàng đợi bếp" as UC09
  usecase "UC-10\nQuản lý kho nguyên liệu" as UC10
  usecase "UC-11\nYêu cầu thanh toán" as UC11
  usecase "UC-12\nXác nhận thanh toán" as UC12
  usecase "UC-13\nQuản lý tài khoản và vai trò" as UC13
  usecase "UC-14\nXem báo cáo" as UC14
}

Customer -- UC01
Customer -- UC02
Customer -- UC03
Customer -- UC04
Customer -- UC05
Customer -- UC06
Customer -- UC11

OrderStaff -- UC01
OrderStaff -- UC02
OrderStaff -- UC03
OrderStaff -- UC04
OrderStaff -- UC05
OrderStaff -- UC06
OrderStaff -- UC07
OrderStaff -- UC12

KitchenStaff -- UC01
KitchenStaff -- UC06
KitchenStaff -- UC09

InventoryStaff -- UC01
InventoryStaff -- UC10

Manager -- UC01
Manager -- UC02
Manager -- UC03
Manager -- UC04
Manager -- UC05
Manager -- UC06
Manager -- UC07
Manager -- UC08
Manager -- UC09
Manager -- UC10
Manager -- UC12
Manager -- UC13
Manager -- UC14
@enduml
~~~

Không sử dụng include/extend trong sơ đồ tổng quát vì các Use Case trên là các mục tiêu nghiệp vụ độc lập; chưa có quan hệ bắt buộc cần thể hiện bằng các quan hệ này.

### 2.5.4. Đặc tả các Use Case quan trọng

**UC-03 – Mở phiên phục vụ**

- **Tác nhân:** Khách hàng hoặc Nhân viên Order.
- **Mục đích:** Bắt đầu một lượt phục vụ tại bàn để có thể ghi nhận món.
- **Tiền điều kiện:** Khách hàng đã xác thực bằng tài khoản CUSTOMER được gán với TableDevice; hoặc nhân viên Order đã đăng nhập và có quyền `sessions:open`. Bàn phải tồn tại và chưa có phiên đang mở.
- **Luồng chính:** (1) Tác nhân yêu cầu mở phiên. (2) Backend xác định bàn từ TableDevice đối với khách hoặc nhận bàn được chọn từ nhân viên. (3) Kiểm tra trạng thái bàn/phiên. (4) Tạo DiningSession và Order trong cùng luồng nghiệp vụ. (5) Cập nhật trạng thái bàn và trả thông tin phiên.
- **Ngoại lệ:** Tài khoản khách chưa gắn thiết bị/bàn; bàn không tồn tại; bàn đã có phiên OPEN; dữ liệu thay đổi đồng thời khiến thao tác bị từ chối.
- **Hậu điều kiện:** Phiên phục vụ OPEN và có đơn hàng liên kết.
- **Căn cứ:** `backend/src/sessions/sessions.controller.ts`, `sessions.service.ts`; `backend/src/users/users.service.ts`; `prisma/schema.prisma`.

**UC-04 – Gọi món**

- **Tác nhân:** Khách hàng hoặc Nhân viên Order.
- **Mục đích:** Ghi nhận các món khách yêu cầu trong đơn của phiên đang mở.
- **Tiền điều kiện:** Phiên đang OPEN; món tồn tại, danh mục/món còn hoạt động và món có trạng thái AVAILABLE; tác nhân có quyền gọi món.
- **Luồng chính:** (1) Tác nhân chọn món, số lượng và ghi chú. (2) Frontend gửi danh sách món. (3) Backend kiểm tra dữ liệu, phiên và tính khả dụng của món. (4) Backend lấy giá từ database, tính thành tiền và tạo OrderItem mới cho từng món. (5) Tạo lịch sử trạng thái ban đầu AWAITING_ACCEPTANCE và audit log. (6) Trả kết quả cho frontend.
- **Ngoại lệ:** Phiên đã đóng/không tồn tại; món không khả dụng; số lượng không hợp lệ; món chưa có giá cố định; xung đột giao dịch.
- **Hậu điều kiện:** Các món hợp lệ được lưu vào đơn với trạng thái chờ bếp tiếp nhận.
- **Quy tắc:** Một lần gọi thêm tạo OrderItem mới; khách không tự gửi giá hoặc tổng tiền.
- **Căn cứ:** `backend/src/orders/orders.controller.ts`, `orders.service.ts`; `backend/src/orders/staff-orders.controller.ts`; `frontend/src/repositories/api/ApiCustomerOrderRepository.ts`.

**UC-09 – Xử lý hàng đợi bếp**

- **Tác nhân:** Nhân viên Bếp; Quản lý.
- **Mục đích:** Theo dõi các món cần chế biến và cập nhật tiến độ.
- **Tiền điều kiện:** Đã đăng nhập với quyền `kitchen:read` hoặc `kitchen:update-item`; phiên của đơn còn mở.
- **Luồng chính:** (1) Tác nhân mở KDS. (2) Backend trả các món AWAITING_ACCEPTANCE, ACCEPTED và IN_PREPARATION. (3) Bếp chọn món và trạng thái tiếp theo. (4) Backend kiểm tra chuyển trạng thái. (5) Cập nhật món, ghi OrderItemStatusHistory và AuditLog trong transaction. (6) Frontend làm mới hàng đợi.
- **Ngoại lệ:** Món không tồn tại; phiên đã đóng; chuyển trạng thái không hợp lệ; món vừa được thiết bị khác cập nhật.
- **Hậu điều kiện:** Trạng thái mới và lịch sử được lưu.
- **Căn cứ:** `backend/src/kitchen/kitchen.controller.ts`, `kitchen.service.ts`; `frontend/src/repositories/api/ApiKDSRepository.ts`.

**UC-10 – Quản lý kho nguyên liệu**

- **Tác nhân:** Nhân viên Kho; Quản lý.
- **Mục đích:** Theo dõi số lượng nguyên liệu và ghi nhận nhập kho/kiểm kê.
- **Tiền điều kiện:** Đã đăng nhập và có permission kho tương ứng.
- **Luồng chính:** (1) Tác nhân xem/tìm nguyên liệu. (2) Khi nhập kho, nhập số lượng và lý do. (3) Backend cập nhật InventoryBalance, tạo StockMovement loại IN và audit log. (4) Khi kiểm kê, tác nhân nhập số lượng thực tế. (5) Backend cập nhật số dư, tạo InventoryCountRecord và movement điều chỉnh nếu có chênh lệch. (6) Tác nhân tra cứu lịch sử biến động/kiểm kê.
- **Ngoại lệ:** Nguyên liệu không tồn tại/đã ngừng hoạt động; số lượng hoặc dữ liệu không hợp lệ; xung đột cập nhật.
- **Hậu điều kiện:** Số dư và lịch sử kho được lưu nhất quán theo transaction.
- **Căn cứ:** `backend/src/inventory/inventory.controller.ts`, `inventory.service.ts`; `prisma/schema.prisma`.

**UC-11 – Yêu cầu thanh toán**

- **Tác nhân:** Khách hàng.
- **Mục đích:** Thông báo cho nhân viên rằng khách muốn thanh toán phiên bàn.
- **Tiền điều kiện:** Khách hàng đã xác thực và có phiên OPEN gắn với bàn của tài khoản.
- **Luồng chính:** (1) Khách chọn yêu cầu thanh toán. (2) Backend xác định bàn/phiên từ tài khoản CUSTOMER. (3) Kiểm tra phiên chưa thanh toán. (4) Tạo hoặc cập nhật PaymentRequest trạng thái PENDING. (5) Trả trạng thái yêu cầu.
- **Ngoại lệ:** Tài khoản chưa gán bàn; không có phiên đang mở; phiên đã có Payment.
- **Hậu điều kiện:** Yêu cầu thanh toán ở trạng thái PENDING để nhân viên xử lý.
- **Căn cứ:** `backend/src/payments/payments.controller.ts`, `payments.service.ts`; `frontend/src/repositories/api/ApiCustomerOrderRepository.ts`.

**UC-12 – Xác nhận thanh toán**

- **Tác nhân:** Nhân viên Order; Quản lý.
- **Mục đích:** Ghi nhận tiền đã thu và kết thúc phiên phục vụ.
- **Tiền điều kiện:** Phiên OPEN, có Order, chưa có Payment; người thực hiện có quyền `payments:confirm`.
- **Luồng chính:** (1) Nhân viên xem yêu cầu/tóm tắt phiên. (2) Kiểm tra các món và tổng tiền. (3) Backend từ chối nếu còn món AWAITING_ACCEPTANCE. (4) Tính tiền từ các món không bị hủy. (5) Tạo Payment trạng thái PAID. (6) Đóng DiningSession, cập nhật DiningTable về AVAILABLE, cập nhật PaymentRequest và ghi AuditLog trong cùng transaction. (7) Trả kết quả.
- **Ngoại lệ:** Phiên không tồn tại/đã đóng; đơn đã thanh toán; còn món chờ bếp tiếp nhận; phiên hoặc bàn bị thay đổi đồng thời.
- **Hậu điều kiện:** Payment được ghi nhận, phiên CLOSED và bàn AVAILABLE.
- **Quy tắc:** Một Payment cho một Order; món CANCELLED không tính tiền.
- **Căn cứ:** `backend/src/payments/payments.service.ts`; `prisma/schema.prisma`; `frontend/src/repositories/api/ApiOrderRepository.ts`.

**UC-13 – Quản lý tài khoản và vai trò**

- **Tác nhân:** Quản lý.
- **Mục đích:** Tạo và duy trì tài khoản người dùng cùng vai trò nghiệp vụ.
- **Tiền điều kiện:** Quản lý đã đăng nhập và có quyền users tương ứng.
- **Luồng chính:** (1) Quản lý xem danh sách người dùng. (2) Tạo tài khoản nhân viên hoặc CUSTOMER. (3) Backend kiểm tra role; với nhân viên tạo Employee; với CUSTOMER yêu cầu thông tin bàn và thiết bị để tạo TableDevice. (4) Mật khẩu được bcrypt hash. (5) Quản lý có thể cập nhật thông tin, gán role hoặc thay đổi trạng thái hoạt động.
- **Ngoại lệ:** Role không tồn tại; username/email/mã nhân viên trùng; bàn đã được gán hoặc không khả dụng; dữ liệu bắt buộc thiếu.
- **Hậu điều kiện:** Tài khoản và liên kết nghiệp vụ được lưu.
- **Căn cứ:** `backend/src/users/users.controller.ts`, `users.service.ts`, `backend/src/seed.ts`.

**UC-08 – Quản lý thực đơn**

- **Tác nhân:** Quản lý.
- **Mục đích:** Duy trì danh mục và thông tin món được cung cấp.
- **Tiền điều kiện:** Đã xác thực và có permission menu tương ứng.
- **Luồng chính:** (1) Quản lý xem danh mục/món. (2) Tạo hoặc cập nhật danh mục, món, giá và thông tin mô tả. (3) Cập nhật trạng thái hoạt động/khả dụng. (4) Tải ảnh lên; backend kiểm tra loại và dung lượng, tải lên Cloudinary rồi lưu URL và public ID. (5) Xóa hoặc thay ảnh cũ theo quy trình của service/controller.
- **Ngoại lệ:** Dữ liệu không hợp lệ; không đủ quyền; file ảnh không đúng định dạng/kích thước; lỗi tải ảnh hoặc cập nhật database.
- **Hậu điều kiện:** Thông tin thực đơn được lưu và phản ánh trên luồng xem thực đơn.
- **Căn cứ:** `backend/src/menu-categories/menu-categories.controller.ts`, `backend/src/menu-items/menu-items.controller.ts`, `backend/src/cloudinary/cloudinary.service.ts`.

### 2.5.5. Ghi chú về phạm vi Use Case

Không đưa các chức năng đặt bàn trước, giao hàng, quản lý ca/lương, chương trình khách hàng thân thiết, gợi ý món bằng AI, công thức nguyên liệu (BOM), xuất hóa đơn hoặc tích hợp cổng thanh toán nâng cao vào Use Case chính vì chưa thuộc phạm vi MVP hoặc chưa có bằng chứng triển khai.

## 2.6. Đánh giá mức độ triển khai

### 2.6.1. Bảng đối chiếu chức năng với source code

| Chức năng | Mức độ triển khai | Nhận xét và căn cứ |
|---|---|---|
| Đăng nhập và xác thực JWT | Đã triển khai | Backend bcrypt/JWT: `auth.service.ts`, `jwt.strategy.ts`; frontend `AuthContext.tsx`, `ApiAuthRepository.ts`. |
| Phân quyền theo role/permission | Đã triển khai | Role/permission seed, JwtAuthGuard và PermissionsGuard; frontend có route guard phụ trợ. |
| Quản lý tài khoản và hồ sơ nhân viên | Đã triển khai | `users.controller.ts`, `users.service.ts`; Prisma User, Employee. |
| Quản lý danh mục và món ăn | Đã triển khai | Menu category/item controllers và services; frontend ApiMenuRepository. |
| Tải ảnh món lên Cloudinary | Đã triển khai | Kiểm tra file, upload, lưu URL/public ID trong menu item controller/service. |
| Xem thực đơn khách hàng | Đã triển khai | Endpoint công khai `GET /api/v1/menu-items/customer/menu`; repository khách hàng sử dụng endpoint này. |
| Mở phiên bàn và tạo đơn | Đã triển khai | Sessions controller/service; DiningSession và Order liên kết 1:1. |
| Gọi món và lưu trạng thái ban đầu | Đã triển khai | Orders service tạo OrderItem và OrderItemStatusHistory trong transaction. |
| Khách theo dõi/hủy món | Đã triển khai | Customer session GET và DELETE item; hủy chỉ khi AWAITING_ACCEPTANCE. |
| Nhân viên Order xem đơn đang hoạt động | Đã triển khai | `GET /orders/active`; frontend ApiOrderRepository sử dụng đúng endpoint. |
| Nhân viên Order thêm món | Đã triển khai | `POST /orders/:orderId/items`; service kiểm tra phiên và món. |
| Nhân viên Order chấp nhận/từ chối/cập nhật trạng thái toàn đơn | Đang triển khai hoặc triển khai một phần | Frontend gọi `PATCH /orders/:id/items/status`, nhưng StaffOrdersController không khai báo route này; backend có service method cập nhật trạng thái nhưng chưa được controller công khai theo route frontend gọi. |
| Nhân viên Order sửa ghi chú/hủy món | Đã triển khai một phần | Backend có endpoint riêng `PATCH /orders/items/:itemId/note` và `DELETE /orders/items/:itemId`; cần kiểm tra frontend gọi đúng API và trạng thái cho phép. |
| KDS xem hàng đợi | Đã triển khai | KitchenController GET queue; ApiKDSRepository dùng `/kitchen/queue`. |
| KDS cập nhật trạng thái món | Đang triển khai hoặc triển khai một phần | Backend có PATCH trạng thái từng món; logic chuyển trạng thái và yêu cầu lý do hủy còn khác tài liệu nghiệp vụ. |
| Quản lý nguyên liệu | Đã triển khai | InventoryController/Service và Prisma Ingredient, InventoryBalance. |
| Nhập kho và lịch sử biến động | Đã triển khai | stock-in cập nhật balance, StockMovement và AuditLog trong transaction. |
| Kiểm kê kho | Đã triển khai | Tạo InventoryCountRecord và điều chỉnh balance/movement. |
| Xuất kho độc lập | Chưa tìm thấy bằng chứng triển khai | Không có endpoint xuất kho độc lập trong InventoryController hiện tại. |
| Tự động trừ kho theo món đã bán | Chưa tìm thấy bằng chứng triển khai | Không có quan hệ recipe/BOM hoặc luồng trừ kho theo OrderItem; tài liệu xác nhận không tự động trừ kho trong MVP. |
| Cảnh báo tồn kho thấp | Đã triển khai một phần | Service tính isLowStock theo ngưỡng khi đọc nguyên liệu; chưa thấy endpoint alerts riêng như một số tài liệu API mô tả. |
| Khách yêu cầu thanh toán | Đã triển khai | PaymentRequest được tạo/cập nhật qua endpoint customer/request. |
| Nhân viên xác nhận thanh toán và đóng phiên | Đã triển khai | PaymentService tạo Payment, đóng session và giải phóng bàn trong transaction. |
| Báo cáo doanh thu/đơn/món bán chạy/tồn kho | Đã triển khai | ReportsController/Service có overview, revenue, best-sellers, orders, inventory. |
| Xem AuditLog qua giao diện/API | Đang triển khai hoặc triển khai một phần | Có model AuditLog và service ghi log; chưa thấy controller endpoint truy vấn audit log trong module hiện tại. |
| Đặt món ẩn danh không cần tài khoản | Chưa tìm thấy bằng chứng triển khai | Luồng customer order hiện yêu cầu JWT CUSTOMER và TableDevice. |
| Đặt bàn trước/giao hàng/AI recommendation/loyalty | Mới được mô tả trong tài liệu hoặc ngoài phạm vi MVP | Vision xác định ngoài phạm vi hoặc là định hướng tương lai; chưa thấy luồng code tương ứng. |
| Quản lý ca và tính lương | Chưa tìm thấy bằng chứng triển khai | Có hồ sơ Employee, chưa có module lịch ca/chấm công/tính lương. |

### 2.6.2. Những chức năng đã triển khai

Các phân hệ có bằng chứng triển khai xuyên suốt tương đối rõ gồm xác thực và phân quyền; quản lý tài khoản; quản lý thực đơn; quản lý bàn và phiên; luồng khách gọi món; xem đơn đang hoạt động; KDS cơ bản; quản lý nguyên liệu, nhập kho và kiểm kê; yêu cầu/xác nhận thanh toán; báo cáo vận hành. Các phân hệ này có controller/service backend, repository API frontend và mô hình dữ liệu liên quan trong Prisma.

### 2.6.3. Những chức năng đang triển khai hoặc chưa đồng nhất

Thứ nhất, thao tác chấp nhận/từ chối/cập nhật trạng thái đơn từ giao diện Order chưa khớp API backend. Frontend gọi `PATCH /orders/:id/items/status`, trong khi controller hiện tại cung cấp các endpoint riêng để thêm món, sửa ghi chú và hủy món; trạng thái bếp được xử lý tại `/kitchen/items/:itemId/status`.

Thứ hai, quy tắc chuyển trạng thái bếp chưa hoàn toàn thống nhất với tài liệu đã xác nhận: service yêu cầu lý do khi hủy và không cho chuyển IN_PREPARATION về ACCEPTED. Do đó, không nên mô tả các chuyển trạng thái này như đã hoàn thiện theo toàn bộ nghiệp vụ dự kiến.

Thứ ba, cảnh báo tồn kho được tính khi đọc dữ liệu nguyên liệu và báo cáo; chưa thấy endpoint cảnh báo chuyên biệt như tài liệu API dự kiến. Chưa có tự động khóa món theo mapping nguyên liệu/ngưỡng tồn như một nội dung được nêu trong tài liệu vision cập nhật.

Thứ tư, AuditLog đã được ghi trong nhiều thao tác nhưng chưa thấy API đọc nhật ký trong controller hiện tại.

### 2.6.4. Những chức năng mới được mô tả trong tài liệu hoặc chưa có bằng chứng code

Các nội dung như đặt món ẩn danh, đặt bàn trước, giao hàng, quản lý ca/lương, loyalty, gợi ý món bằng AI, quản lý công thức nguyên liệu và tự động trừ kho theo công thức không được xem là chức năng đã triển khai. Một số nội dung được xác định ngoài phạm vi MVP trong `docs/01-project-vision.md`; một số nội dung được mô tả như định hướng nhưng chưa tìm thấy service/API tương ứng.

### 2.6.5. Những điểm chưa đồng nhất giữa tài liệu và source code

1. **Tài liệu API và controller:** tài liệu `docs/backend-api-specification.md` mô tả một số endpoint theo nhóm `/menu/categories`, `/menu/items`, `/customer/menu`, `/orders/:id/payment/confirm`; controller hiện tại dùng `/menu-categories`, `/menu-items`, `/menu-items/customer/menu`, `/payments/sessions/:sessionId/confirm`. Cần dùng API đang triển khai làm căn cứ cho mô tả tích hợp hiện tại.
2. **Trạng thái đơn hàng:** frontend ApiOrderRepository gọi route cập nhật trạng thái không tồn tại trong StaffOrdersController; đây là rủi ro tích hợp có thể làm thao tác trả lỗi khi chạy thực tế.
3. **Trạng thái bếp:** logic allowed transitions và điều kiện reason trong KitchenService khác một số quy tắc nghiệp vụ đã xác nhận.
4. **Khách hàng:** tài liệu vision có đoạn đề cập đặt món không cần tài khoản; code hiện tại yêu cầu tài khoản CUSTOMER gắn TableDevice và JWT cho các thao tác phiên/đặt món.
5. **Kiểm kê:** InventoryService hiện cập nhật số dư và ghi movement điều chỉnh theo số thực tế; tài liệu API từng để mở quyết định việc kiểm kê chỉ ghi nhận hay điều chỉnh. Hành vi code hiện tại cần được xem là hành vi đang triển khai, đồng thời xác nhận lại với quy tắc nghiệp vụ.
6. **BOM và tự động khóa món:** tài liệu vision cập nhật đề cập khóa món khi nguyên liệu bắt buộc dưới ngưỡng; schema hiện không có bảng công thức/quan hệ món–nguyên liệu, và chưa tìm thấy service áp dụng quy tắc này.
7. **Audit:** có ghi nhật ký nhưng chưa thấy endpoint truy vấn trong backend controller.
8. **Frontend runtime:** `frontend/package.json` đặt entry là `expo-router/entry`, đồng thời repository còn có `src/AppRoot.tsx` và `src/main.tsx` theo cách điều hướng khác. Các route thực tế trong `frontend/app/(main)` là căn cứ phù hợp để mô tả cấu hình Expo Router; cần tránh đồng nhất AppRoot với entry đang chạy nếu chưa xác minh runtime.

## 2.7. Tổng kết chương

Chương này đã xác định năm tác nhân nghiệp vụ và các nhóm chức năng tương ứng của hệ thống ResMan. Các yêu cầu tập trung vào luồng phục vụ tại bàn, từ xem thực đơn, mở phiên, gọi món, xử lý tại bếp, quản lý kho đến thanh toán và báo cáo. Các yêu cầu phi chức năng được phân tích dựa trên cơ chế xác thực JWT, phân quyền permission, kiểm tra dữ liệu, transaction, lịch sử trạng thái và cấu trúc module của frontend/backend.

Đối chiếu source code cho thấy phần lớn phân hệ cốt lõi đã có cấu trúc triển khai ở cả frontend và backend. Tuy nhiên, một số luồng vẫn cần hoàn thiện hoặc đồng bộ, nổi bật là API cập nhật trạng thái đơn ở giao diện Order, quy tắc chuyển trạng thái KDS, cảnh báo tồn kho và khả năng truy vấn nhật ký kiểm toán. Những điểm này cần được xem xét trong Chương 3 khi phân tích và thiết kế hệ thống, đồng thời không được mô tả như chức năng đã hoàn thiện nếu chưa có bằng chứng kiểm thử.

---

## Tài liệu và mã nguồn tham chiếu

- `docs/01-project-vision.md`
- `docs/02-actor-analysis.md`
- `docs/03-user-flows.md`
- `docs/04-use-cases.md`
- `docs/08-prd.md`
- `docs/11-confirmed-business-rules.md`
- `docs/backend-api-specification.md`
- `backend/src/auth/`, `backend/src/users/`, `backend/src/menu-categories/`, `backend/src/menu-items/`
- `backend/src/tables/`, `backend/src/sessions/`, `backend/src/orders/`, `backend/src/kitchen/`
- `backend/src/inventory/`, `backend/src/payments/`, `backend/src/reports/`
- `frontend/src/features/`, `frontend/src/repositories/api/`, `frontend/src/constants/rbac.ts`
- `prisma/schema.prisma`
