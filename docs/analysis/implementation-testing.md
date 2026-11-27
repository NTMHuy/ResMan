# CHƯƠNG 4. TRIỂN KHAI VÀ ĐÁNH GIÁ HỆ THỐNG

> **Phạm vi khảo sát:** Repository `NTMHuy/ResMan`, nhánh `member/minhhuy`, commit `cea1036bfb29b288f9e77433a1cf800fbe1c361f`. Chương này kế thừa phạm vi và thuật ngữ của [Chương 2 – Phân tích và đặc tả yêu cầu](requirements-analysis.md) và [Chương 3 – Phân tích và thiết kế hệ thống](system-design.md). Kết quả được xác định bằng cách đối chiếu mã nguồn, cấu hình, lược đồ Prisma và trạng thái CI có thể truy xuất. Các nội dung chưa có bằng chứng chạy ứng dụng được ghi rõ là chưa kiểm thử thực tế.

## 4.1. Môi trường và công nghệ triển khai

### 4.1.1. Công nghệ Frontend

Frontend được xây dựng bằng React Native và Expo, sử dụng TypeScript để định nghĩa kiểu dữ liệu cho màn hình, trạng thái và dữ liệu trao đổi với backend. Expo Router đảm nhiệm điều hướng theo cấu trúc tệp trong thư mục `frontend/app`. Các màn hình nghiệp vụ được tổ chức theo nhóm tính năng trong `frontend/src/features`, bao gồm xác thực, đặt món khách hàng, bàn, đơn hàng, bếp, kho, nhân viên, thực đơn, báo cáo và dashboard.

Một số thư viện chính được khai báo trong `frontend/package.json`:

| Công nghệ / thư viện | Vai trò |
|---|---|
| React Native 0.88.1, React 19.3.0 | Xây dựng giao diện đa nền tảng. |
| Expo SDK 58, Expo Router ~58.0.32 | Môi trường phát triển và điều hướng ứng dụng. |
| TypeScript ~6.0.3 | Kiểm tra kiểu dữ liệu khi phát triển. |
| Axios ^1.21.1 | Gửi HTTP request đến backend. |
| Zod ^4.6.7 | Kiểm tra dữ liệu biểu mẫu đăng nhập ở frontend. |
| lucide-react-native ^1.77.0 | Biểu tượng giao diện. |
| expo-image-picker ~58.0.10 | Chọn ảnh từ thiết bị. |
| expo-secure-store ~58.0.3, AsyncStorage 2.2.0 | Hỗ trợ lưu trữ dữ liệu phía ứng dụng; token được quản lý thông qua storage service. |
| react-native-svg 15.16.0 | Hiển thị thành phần đồ họa dạng SVG. |

Mã nguồn sử dụng các Context như `AuthContext`, `NavigationContext`, `ToastContext` và `ThemeContext` để chia sẻ trạng thái đăng nhập, điều hướng, thông báo và giao diện. Các repository API (`ApiAuthRepository`, `ApiMenuRepository`, `ApiCustomerOrderRepository`, `ApiOrderRepository`, `ApiKDSRepository`, `ApiInventoryRepository`, `ApiEmployeeRepository`, `ApiReportRepository`, `ApiDashboardRepository`) được đăng ký tại `frontend/src/repositories/index.ts`. Ở cấu hình hiện tại, registry sử dụng các implementation API thay vì mock repository.

Frontend có thể chạy trên iOS, Android và Web theo cấu hình `frontend/app.json`; điều này thể hiện mục tiêu nền tảng được cấu hình, không phải bằng chứng rằng cả ba nền tảng đã được nghiệm thu trên thiết bị thực tế.

### 4.1.2. Công nghệ Backend

Backend sử dụng NestJS 11 và TypeScript, chạy trên Node.js. Cấu trúc mã nguồn được chia theo module nghiệp vụ; các Controller tiếp nhận HTTP request, DTO mô tả dữ liệu đầu vào, Service xử lý quy tắc nghiệp vụ và `PrismaService` cung cấp truy cập dữ liệu.

Các thư viện đáng chú ý trong `backend/package.json` gồm:

- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`: nền tảng xây dựng REST API.
- `@nestjs/config`: đọc cấu hình môi trường.
- `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`: xác thực bằng JWT Bearer.
- `class-validator`, `class-transformer`: kiểm tra và chuyển đổi dữ liệu DTO.
- `bcrypt`: đối chiếu mật khẩu đã băm.
- `helmet`: thiết lập một số HTTP security headers.
- `multer`: tiếp nhận tệp ảnh tải lên.
- `@prisma/client`, `@prisma/adapter-pg`, `pg`: truy cập PostgreSQL thông qua Prisma và PostgreSQL adapter.

Backend đặt tiền tố API toàn cục là `/api/v1`. Trong `main.ts`, ứng dụng bật `ValidationPipe` với `whitelist`, `forbidNonWhitelisted` và `transform`; đồng thời cấu hình CORS, Helmet và phục vụ các tệp ảnh cục bộ tại đường dẫn `/uploads/`. Các endpoint được bảo vệ sử dụng JWT guard; những endpoint khai báo permission còn được kiểm tra bởi `PermissionsGuard`. JWT strategy tải lại tài khoản và quyền hiện hành từ cơ sở dữ liệu, thay vì chỉ dựa vào dữ liệu role gửi từ frontend.

### 4.1.3. Hệ quản trị cơ sở dữ liệu

Hệ thống sử dụng PostgreSQL. Lược đồ dữ liệu được khai báo tập trung tại `prisma/schema.prisma`, còn lịch sử thay đổi cấu trúc được lưu trong `prisma/migrations`. Prisma 7 được cấu hình qua `backend/prisma.config.ts`; Prisma Client được sinh vào `backend/src/generated/prisma`. `PrismaService` khởi tạo `pg.Pool`, truyền qua `PrismaPg` adapter và quản lý vòng đời kết nối.

Các nhóm dữ liệu chính gồm:

| Nhóm dữ liệu | Các model tiêu biểu | Mục đích |
|---|---|---|
| Tài khoản và phân quyền | `Role`, `Permission`, `RolePermission`, `User`, `Employee` | Lưu tài khoản, hồ sơ nhân viên và quyền truy cập. |
| Thực đơn | `MenuCategory`, `MenuItem` | Lưu danh mục, thông tin món, giá, trạng thái và thông tin ảnh. |
| Bàn và phiên phục vụ | `DiningTable`, `DiningSession`, `TableDevice` | Quản lý bàn, phiên đang mở/đã đóng và thiết bị gắn với bàn. |
| Đơn hàng và lịch sử trạng thái | `Order`, `OrderItem`, `OrderItemStatusHistory` | Lưu đơn, món đã gọi và lịch sử chuyển trạng thái món. |
| Kho | `Ingredient`, `InventoryBalance`, `StockMovement`, `InventoryCountRecord` | Lưu nguyên liệu, số dư, biến động và kết quả kiểm kê. |
| Thanh toán | `PaymentRequest`, `Payment` | Lưu yêu cầu thanh toán và giao dịch được nhân viên xác nhận. |
| Nhật ký | `AuditLog` | Ghi nhận một số thao tác nghiệp vụ quan trọng. |

Các quan hệ đáng chú ý gồm: một danh mục có nhiều món; một bàn có nhiều phiên theo thời gian; một phiên có tối đa một đơn; một đơn có nhiều món; một đơn có tối đa một payment; mỗi nguyên liệu có một bản ghi số dư. Bảng `TableDevice` liên kết thiết bị với bàn và có thể liên kết một tài khoản CUSTOMER. Những ràng buộc chi tiết được trình bày tại Chương 3.

### 4.1.4. Công cụ và dịch vụ tích hợp

**Cloudinary** được sử dụng để lưu trữ ảnh món ăn. Backend nhận ảnh qua multipart field `file`, giới hạn dung lượng 5 MB và chỉ chấp nhận JPG, JPEG, PNG hoặc WEBP. Sau khi tải lên, backend lưu URL và public ID trong `MenuItem`; khi thay ảnh hoặc xóa món, service thực hiện xóa tài nguyên Cloudinary tương ứng. Mã nguồn vẫn có tiện ích xử lý ảnh cục bộ cũ để tương thích dữ liệu trước đây, nhưng luồng upload hiện tại gọi `CloudinaryService`.

**GitHub Actions** được cấu hình cho hai nhóm xác minh tự động:
- Backend: cài dependencies, kiểm tra Prisma schema, sinh Prisma Client và build NestJS.
- Frontend: cài dependencies và chạy TypeScript typecheck.

**Playwright** đã được khai báo cho mục tiêu kiểm thử E2E trên Web. Tuy nhiên, tài liệu trong `tests/e2e` mô tả cấu hình ở trạng thái scaffold/chờ rà soát; chưa tìm thấy file test nghiệp vụ thực thi trong thư mục test. Vì vậy, không xem cấu hình Playwright là bằng chứng hệ thống đã được kiểm thử E2E.

### 4.1.5. Môi trường thực thi

Thông tin môi trường được xác định từ package manifest, tài liệu phát triển và workflow:

| Thành phần | Yêu cầu / cấu hình được khai báo |
|---|---|
| Node.js backend | `>=24.0.0` theo `backend/package.json`; CI dùng Node.js 24. |
| npm backend | `backend/DEVELOPMENT.md` yêu cầu npm 11 trở lên. |
| PostgreSQL | `backend/DEVELOPMENT.md` nêu PostgreSQL 15 trở lên. |
| Frontend | Expo SDK 58; CI dùng Node.js 24 và `npm ci`. |
| Backend API | Mặc định cổng 3000, tiền tố `/api/v1`; health endpoint là `GET /api/v1/health`. |
| Frontend API URL | Đọc từ `EXPO_PUBLIC_API_URL`; khi phát triển có thể suy ra host Metro và cổng 3000. Android emulator mặc định dùng host `10.0.2.2`. |

Các biến môi trường được tham chiếu trong mã nguồn/tài liệu gồm `DATABASE_URL`, `PORT`, `JWT_SECRET`, `FRONTEND_ORIGIN`, nhóm `INITIAL_ADMIN_*` dùng khi seed tài khoản quản lý ban đầu, và nhóm `CLOUDINARY_*` để tích hợp dịch vụ ảnh. Frontend sử dụng `EXPO_PUBLIC_API_URL` và một số cờ `EXPO_PUBLIC_USE_MOCK_*`. Báo cáo không ghi giá trị thực của các biến cấu hình.

Các lệnh chính được khai báo:

| Mục đích | Lệnh | Ghi chú |
|---|---|---|
| Cài backend | `cd backend && npm install` | Cần cấu hình môi trường phù hợp. |
| Kiểm tra Prisma | `npm run prisma:validate` | Không thay đổi dữ liệu. |
| Sinh Prisma Client | `npm run prisma:generate` | Sinh mã client theo schema. |
| Build backend | `npm run build` | Biên dịch NestJS. |
| Chạy backend phát triển | `npm run start:dev` | Cần PostgreSQL và biến môi trường hợp lệ. |
| Chạy backend production | `npm run start:prod` | Chạy mã đã build. |
| Kiểm tra kiểu frontend | `cd frontend && npm run typecheck` | Thực thi `tsc --noEmit`. |
| Chạy Expo | `cd frontend && npm start` | Khởi động Expo development server. |

Các lệnh migration và seed có khả năng thay đổi dữ liệu nên không được thực thi trong quá trình khảo sát này. Đặc biệt, không chạy `prisma migrate deploy`, `prisma migrate dev` hoặc `db:seed` trên cơ sở dữ liệu đang có dữ liệu nếu chưa sao lưu và xác nhận môi trường.

## 4.2. Kết quả triển khai các chức năng

Phần này mô tả những gì có thể xác nhận từ mã nguồn ở commit khảo sát. “Đã hiện thực trong mã nguồn” không đồng nghĩa chức năng đã được chạy và nghiệm thu trên môi trường thực tế.

### 4.2.1. Đăng nhập và phân quyền

Frontend cung cấp màn hình đăng nhập, kiểm tra dữ liệu username/password bằng Zod và gọi `POST /api/v1/auth/login`. Backend tìm tài khoản theo username, kiểm tra tài khoản đang hoạt động và so sánh mật khẩu bằng bcrypt. Nếu hợp lệ, hệ thống cập nhật thời điểm đăng nhập, tạo JWT và trả thông tin người dùng, role cùng danh sách permission. Frontend lưu token thông qua storage service và gọi `GET /api/v1/auth/profile` để xác thực lại phiên khi khởi động ứng dụng.

Backend phân quyền ở cấp API bằng `JwtAuthGuard` và `PermissionsGuard`; frontend dùng thông tin permission để điều khiển route và thành phần giao diện. Các role được seed gồm `MANAGER`, `ORDER_STAFF`, `KITCHEN_STAFF`, `INVENTORY_STAFF` và `CUSTOMER`.

**Trạng thái:** Đã tìm thấy luồng frontend, endpoint backend, xử lý xác thực và dữ liệu RBAC trong schema/seed. Chưa có bằng chứng chạy kiểm thử đăng nhập hoặc kiểm tra truy cập trái quyền tại commit HEAD.

### 4.2.2. Quản lý thực đơn

Phân hệ thực đơn gồm màn hình quản lý danh mục và món ăn. Mã nguồn hỗ trợ tạo/cập nhật danh mục; tạo, xem, tìm kiếm, lọc và cập nhật món; bật/tắt trạng thái hoạt động và trạng thái khả dụng. Backend kiểm tra danh mục, mã món và loại giá; các bản ghi món/danh mục được vô hiệu hóa mềm để giữ tham chiếu lịch sử đơn hàng. API thực đơn dành cho khách chỉ trả các danh mục và món phù hợp điều kiện hoạt động/khả dụng.

Chức năng tải ảnh sử dụng multipart request. Backend kiểm tra loại tệp và kích thước trước khi tải lên Cloudinary; URL và public ID được lưu trong database. Frontend giải quyết URL ảnh tương đối thành URL tuyệt đối theo API origin.

**Trạng thái:** Đã tìm thấy mã nguồn ở frontend, backend, Prisma schema và tích hợp Cloudinary. Chưa có bằng chứng kiểm thử CRUD, tìm kiếm, thay ảnh hoặc xóa ảnh trên môi trường chạy tại commit HEAD.

### 4.2.3. Quản lý bàn và phiên phục vụ

Frontend có màn hình quản lý bàn. Backend cung cấp API đọc danh sách/chi tiết, tạo, cập nhật và xóa bàn theo permission. Nhân viên có quyền mở phiên cho bàn đang AVAILABLE; hệ thống tạo `DiningSession` và `Order`, cập nhật trạng thái bàn sang OCCUPIED và ghi audit log trong transaction. Khách hàng dùng tài khoản CUSTOMER đã liên kết `TableDevice`; backend xác định bàn từ tài khoản, tái sử dụng phiên OPEN hoặc tạo phiên mới nếu bàn phù hợp điều kiện.

Khi thanh toán được xác nhận, backend đóng phiên và cập nhật bàn về AVAILABLE trong transaction. Cấu trúc migration có partial unique index nhằm hạn chế một bàn có nhiều phiên OPEN cùng lúc.

**Trạng thái:** Đã tìm thấy mã nguồn cho bàn, phiên, liên kết thiết bị và các xử lý transaction. Chưa có bằng chứng kiểm thử đồng thời mở phiên, tiếp tục phiên hoặc giải phóng bàn sau thanh toán.

### 4.2.4. Đặt món và quản lý đơn hàng

Màn hình khách hàng hiển thị thực đơn, giỏ hàng, thông tin món và trạng thái món trong phiên. Repository frontend gọi API lấy thực đơn, truy vấn phiên khách hàng, mở phiên, gửi món và yêu cầu thanh toán. Backend xác định phiên từ tài khoản/thiết bị, kiểm tra phiên còn mở, món còn hoạt động và khả dụng, số lượng hợp lệ, sau đó tạo `OrderItem` và lịch sử trạng thái trong transaction. Mỗi lần gửi thêm món tạo bản ghi mới; backend không gộp số lượng vào món cũ.

Màn hình Nhân viên Order đọc các đơn đang hoạt động, cho phép thêm món, sửa ghi chú và hủy món theo điều kiện trạng thái. Tuy nhiên, có một điểm chưa đồng nhất: `ApiOrderRepository` gọi `PATCH /orders/:id/items/status` khi thực hiện một số thao tác accept/reject/cập nhật trạng thái đơn, trong khi `StaffOrdersController` hiện chỉ khai báo API xem đơn, thêm món, cập nhật ghi chú từng món và hủy từng món. Không tìm thấy route `PATCH /orders/:id/items/status` tương ứng trong controller hiện tại. Vì vậy, các thao tác frontend phụ thuộc endpoint này có nguy cơ không hoạt động khi kết nối backend thật; cần đồng bộ hợp đồng API trước khi xác nhận hoàn chỉnh luồng Order.

Ngoài ra, phương thức tạo đơn POS trực tiếp trong repository hiện ném lỗi và chỉ dẫn khách gọi món thông qua phiên. Do đó, không mô tả tạo đơn POS độc lập như chức năng đã triển khai.

**Trạng thái:** Luồng khách gọi món và các API quản lý món có hiện thực trong mã nguồn; một số thao tác quản lý trạng thái phía Nhân viên Order chưa khớp endpoint. Chưa có bằng chứng kiểm thử API hoặc giao diện tại commit HEAD.

### 4.2.5. Tiếp nhận và xử lý món tại bếp (KDS)

Frontend có màn hình Kitchen/KDS hiển thị hàng đợi món, trạng thái, thời gian chờ, bộ lọc và cơ chế tự làm mới theo chu kỳ. Backend cung cấp API đọc hàng đợi và cập nhật trạng thái từng món. Khi cập nhật, service kiểm tra phiên còn mở và trạng thái chuyển tiếp hợp lệ; việc cập nhật món, ghi lịch sử và audit log được nhóm trong transaction.

Tuy nhiên, mã nguồn backend hiện chỉ cho phép các chuyển trạng thái: `AWAITING_ACCEPTANCE → ACCEPTED/CANCELLED`, `ACCEPTED → IN_PREPARATION/CANCELLED`, `IN_PREPARATION → COMPLETED/CANCELLED`. Backend yêu cầu nhập lý do khi bếp hủy món. Hai điểm này cần được đối chiếu với quy tắc nghiệp vụ đã xác nhận tại Chương 2/3; không nên khẳng định toàn bộ quy trình KDS đã thống nhất nếu chưa điều chỉnh hoặc cập nhật tài liệu nghiệp vụ.

**Trạng thái:** Đã tìm thấy màn hình, repository, controller và service KDS. Chưa có bằng chứng kiểm thử cập nhật trạng thái trên môi trường chạy.

### 4.2.6. Quản lý kho và nguyên liệu

Frontend cung cấp màn hình danh sách nguyên liệu, lọc/tìm kiếm, thông tin tồn kho, lịch sử biến động và kiểm kê. Backend hỗ trợ tạo/cập nhật nguyên liệu, ghi nhận nhập kho, truy vấn số dư, biến động và bản ghi kiểm kê. Khi nhập kho, hệ thống cập nhật số dư, tạo movement và audit log trong transaction. Khi kiểm kê, service lưu `InventoryCountRecord` và tạo biến động điều chỉnh số lượng tồn.

Quy tắc hiện tại là kho được cập nhật thủ công; chưa có bằng chứng về tự động trừ nguyên liệu theo món bán hoặc định mức công thức món ăn. Cần phân biệt việc ghi nhận kiểm kê với nghiệp vụ nhập/xuất kho độc lập; các thao tác xuất kho không được xem là đã triển khai nếu chưa tìm thấy endpoint/service tương ứng.

**Trạng thái:** Đã tìm thấy mã nguồn quản lý nguyên liệu, nhập kho và kiểm kê. Chưa có bằng chứng kiểm thử dữ liệu tồn, cảnh báo tồn thấp hoặc đối chiếu số dư sau kiểm kê.

### 4.2.7. Quản lý nhân viên

Màn hình Employees sử dụng API `/users` để đọc danh sách tài khoản, loại tài khoản CUSTOMER khỏi danh sách nhân viên và ánh xạ hồ sơ nhân viên từ dữ liệu user/employee. Backend hỗ trợ tạo tài khoản, cập nhật thông tin, phân công role và thay đổi trạng thái hoạt động theo permission. Dữ liệu hồ sơ nhân viên được lưu trong `Employee` và liên kết một-một với `User`.

**Trạng thái:** Đã tìm thấy màn hình, repository và API quản lý tài khoản/nhân viên. Chưa có bằng chứng kiểm thử tạo nhân viên, đổi role hoặc khóa tài khoản.

### 4.2.8. Thanh toán

Khách hàng có thể gửi yêu cầu thanh toán cho phiên đang mở. Nhân viên Order xem danh sách yêu cầu, xem tổng kết đơn và xác nhận thanh toán. Backend tính tổng tiền từ các món không ở trạng thái CANCELLED; không cho xác nhận khi còn món `AWAITING_ACCEPTANCE` hoặc đơn đã được thanh toán. Khi xác nhận hợp lệ, hệ thống tạo Payment, hoàn tất yêu cầu thanh toán, đóng DiningSession và chuyển bàn về AVAILABLE trong transaction.

Các phương thức thanh toán được khai báo trong service gồm tiền mặt, thẻ và chuyển khoản; mã nguồn hiện ghi nhận thông tin giao dịch, không phải bằng chứng về tích hợp trực tiếp với cổng thanh toán bên ngoài.

**Trạng thái:** Đã tìm thấy luồng yêu cầu và xác nhận thanh toán trong frontend/backend. Chưa có bằng chứng kiểm thử các trường hợp thanh toán thành công, thanh toán bị chặn hoặc tính tổng tiền.

### 4.2.9. Báo cáo và nhật ký hoạt động

Backend có các API báo cáo tổng quan, doanh thu theo kỳ, món bán chạy, danh sách đơn và tình hình kho. Frontend có màn hình Reports và Dashboard sử dụng repository API để tổng hợp dữ liệu. Đây là các báo cáo được tính từ dữ liệu nghiệp vụ hiện có, không phải hệ thống BI hoặc phân tích nâng cao.

Model `AuditLog` được khai báo trong schema và nhiều service ghi nhật ký khi thực hiện các thao tác quan trọng. Tuy nhiên, trong phạm vi controller đã khảo sát, chưa tìm thấy API đọc danh sách nhật ký hoạt động hoặc màn hình tra cứu audit log. Vì vậy, chỉ mô tả chức năng ghi nhật ký ở backend; không khẳng định đã có chức năng xem nhật ký dành cho người dùng.

**Trạng thái:** Đã tìm thấy mã nguồn API báo cáo và thành phần ghi audit log. Chưa có bằng chứng kiểm thử báo cáo trên dữ liệu thực tế; chức năng đọc audit log chưa được xác minh là đã triển khai.

## 4.3. Giao diện hệ thống

Frontend tổ chức giao diện theo vai trò và nhóm chức năng. Các màn hình được xác định từ Expo Router và các component màn hình trong `frontend/src/features`. Mô tả dưới đây là khảo sát cấu trúc và mã nguồn giao diện, không phải kết quả nghiệm thu trực quan trên ứng dụng đang chạy.

| Hình đề xuất | Tên màn hình | Vai trò sử dụng | Thành phần chính cần thể hiện |
|---|---|---|---|
| Hình 4.1 | Màn hình đăng nhập | Tất cả vai trò | Thương hiệu ResMan, trường username/password, thông báo lỗi và thao tác đăng nhập. |
| Hình 4.2 | Màn hình khách hàng đặt món | CUSTOMER | Danh mục món, danh sách món, tìm kiếm/lọc, giỏ hàng, ghi chú và theo dõi món. |
| Hình 4.3 | Màn hình quản lý đơn hàng | ORDER_STAFF, MANAGER | Danh sách đơn đang hoạt động, trạng thái từng món, thêm món và khu vực yêu cầu thanh toán. |
| Hình 4.4 | Màn hình bếp KDS | KITCHEN_STAFF, MANAGER | Hàng đợi món, bàn/đơn, trạng thái chế biến, thời gian chờ và thao tác chuyển trạng thái. |
| Hình 4.5 | Màn hình quản lý kho | INVENTORY_STAFF, MANAGER theo quyền | Danh sách nguyên liệu, tồn hiện tại, cảnh báo, nhập kho và kiểm kê. |
| Hình 4.6 | Màn hình quản lý thực đơn | MANAGER | Danh mục, danh sách món, trạng thái, biểu mẫu chỉnh sửa và ảnh món ăn. |
| Hình 4.7 | Màn hình quản lý nhân viên | MANAGER | Danh sách tài khoản nhân viên, role, trạng thái và biểu mẫu cập nhật. |
| Hình 4.8 | Màn hình báo cáo | MANAGER | Tổng quan doanh thu, biểu đồ doanh thu, món bán chạy, đơn hàng và dữ liệu kho. |
| Hình 4.9 | Màn hình quản lý bàn | ORDER_STAFF xem bàn; MANAGER quản trị | Danh sách bàn, sức chứa, trạng thái và thông tin phiên đang hoạt động. |

**Tình trạng tài nguyên hình ảnh:** Tại commit khảo sát, chưa tìm thấy ảnh chụp màn hình chạy thực tế trong `docs/analysis/images/`. Các ảnh món ăn trong `frontend/src/assets/images/` là tài nguyên nội dung, không phải ảnh chụp giao diện; các ảnh trong thư mục `frontend/public/assets/aistudio/` cũng không được sử dụng làm bằng chứng giao diện đã vận hành. Vì vậy, các hình 4.1–4.9 là danh sách ảnh cần bổ sung, không phải ảnh đã có.

Đề xuất lưu ảnh chụp thực tế sau khi chạy ứng dụng tại `docs/analysis/images/` theo tên:
- `login-screen.png`
- `customer-order-screen.png`
- `staff-order-screen.png`
- `kitchen-screen.png`
- `inventory-screen.png`
- `menu-management-screen.png`
- `employee-management-screen.png`
- `reports-screen.png`
- `tables-screen.png`

Khi bổ sung ảnh, cần chụp từ ứng dụng đang chạy với dữ liệu thử nghiệm phù hợp, che thông tin tài khoản hoặc dữ liệu nhạy cảm và ghi chú vai trò tương ứng. Không sử dụng ảnh mockup hoặc ảnh minh họa thay cho ảnh sản phẩm thực tế.

## 4.4. Kiểm thử và kết quả

### 4.4.1. Mục tiêu và phạm vi kiểm thử

Kiểm thử cần tập trung vào tính đúng đắn của các luồng nghiệp vụ chính, khả năng kiểm soát quyền truy cập, tính toàn vẹn dữ liệu và sự phối hợp giữa frontend, backend và PostgreSQL. Các nhóm ưu tiên gồm xác thực, thực đơn, bàn/phiên, đặt món, xử lý bếp, kho, thanh toán và báo cáo.

Trong lần khảo sát này, không có môi trường ứng dụng và cơ sở dữ liệu local được khởi chạy từ phiên làm việc hiện tại. Do đó, các trường hợp bên dưới là kế hoạch kiểm thử đại diện để hoàn thiện kiểm thử nghiệm thu; kết quả thực tế được ghi là chưa thực hiện nếu không có log hoặc response có thể truy xuất.

### 4.4.2. Môi trường và phương pháp kiểm thử

Có thể phân loại bằng chứng kiểm thử thành bốn nhóm:

1. **Kiểm tra tĩnh mã nguồn:** đối chiếu Controller, Service, repository, DTO, schema và cấu hình. Nhóm này xác minh sự hiện diện của logic, không xác minh runtime.
2. **Kiểm tra build/typecheck:** xác minh mã nguồn có thể biên dịch hoặc kiểm tra kiểu dữ liệu trong môi trường CI.
3. **Kiểm thử API và giao diện:** cần khởi chạy backend, frontend và database, sau đó gửi request hoặc thao tác trên ứng dụng. Chưa có bằng chứng thực hiện trong lần khảo sát này.
4. **Kiểm thử tự động:** repository có workflow CI cho backend/frontend; cấu hình Playwright mới ở trạng thái scaffold và chưa có test case E2E nghiệp vụ.

Không thực hiện migration, seed hoặc request ghi dữ liệu trong quá trình khảo sát để tránh tác động đến dữ liệu đang tồn tại.

### 4.4.3. Các trường hợp kiểm thử

**Bảng 4.1. Danh sách trường hợp kiểm thử chức năng đề xuất và tình trạng bằng chứng**

| Mã TC | Chức năng | Dữ liệu đầu vào / bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Bằng chứng |
|---|---|---|---|---|---|---|
| TC-01 | Đăng nhập hợp lệ | Tài khoản đang hoạt động, username/password đúng. | Trả JWT Bearer và thông tin user, role, permissions. | Chưa thực hiện. | Chưa có bằng chứng | AuthController/AuthService; chưa có response runtime. |
| TC-02 | Đăng nhập không hợp lệ | Username không tồn tại hoặc mật khẩu sai. | API từ chối xác thực, không cấp token. | Chưa thực hiện. | Chưa có bằng chứng | Nhánh kiểm tra trong AuthService. |
| TC-03 | Phân quyền API | Gọi API bảo vệ khi không có token hoặc thiếu permission. | Trả lỗi xác thực hoặc từ chối quyền phù hợp. | Chưa thực hiện. | Chưa có bằng chứng | JwtAuthGuard, PermissionsGuard và decorator permission. |
| TC-04 | Quản lý thực đơn | Tạo danh mục/món hợp lệ; tìm kiếm; cập nhật giá và trạng thái. | Dữ liệu được lưu và truy vấn đúng; dữ liệu không hợp lệ bị từ chối. | Chưa thực hiện. | Chưa có bằng chứng | MenuCategoriesController, MenuItemsController và service. |
| TC-05 | Tải ảnh món ăn | Upload ảnh JPG/PNG/WEBP hợp lệ; thử tệp sai định dạng hoặc vượt 5 MB. | Ảnh hợp lệ được lưu trên Cloudinary; tệp không hợp lệ bị từ chối. | Chưa thực hiện. | Chưa có bằng chứng | MenuItemsController và CloudinaryService. |
| TC-06 | Mở phiên bàn | Mở phiên cho bàn AVAILABLE; thử mở lại bàn đang OCCUPIED. | Tạo phiên/đơn cho bàn hợp lệ; từ chối phiên trùng hoặc bàn không khả dụng. | Chưa thực hiện. | Chưa có bằng chứng | SessionsService và migration ràng buộc phiên OPEN. |
| TC-07 | Khách hàng gọi món | CUSTOMER có TableDevice hoạt động gửi món trong phiên OPEN. | Tạo OrderItem ở trạng thái AWAITING_ACCEPTANCE, lưu lịch sử. | Chưa thực hiện. | Chưa có bằng chứng | OrdersController/OrdersService và TableDevice. |
| TC-08 | Hủy món phía khách | Hủy món đang AWAITING_ACCEPTANCE; thử hủy món đã được bếp tiếp nhận. | Cho phép hủy trước khi bếp nhận; từ chối khi đã qua trạng thái cho phép. | Chưa thực hiện. | Chưa có bằng chứng | OrdersService; chưa có request/response thực tế. |
| TC-09 | Cập nhật món tại bếp | Chuyển món từ AWAITING_ACCEPTANCE sang ACCEPTED rồi IN_PREPARATION. | Trạng thái, lịch sử và audit log được cập nhật nhất quán. | Chưa thực hiện. | Chưa có bằng chứng | KitchenService; cần kiểm thử thêm các chuyển trạng thái không hợp lệ. |
| TC-10 | Nhân viên Order cập nhật trạng thái | Frontend gọi thao tác accept/reject qua repository. | Request phải khớp endpoint backend và cập nhật trạng thái theo quy tắc. | Chưa thực hiện; khảo sát tĩnh phát hiện repository gọi route chưa có trong StaffOrdersController. | Chưa kiểm thử; có sai lệch mã nguồn | ApiOrderRepository và StaffOrdersController. |
| TC-11 | Nhập kho và kiểm kê | Tạo nguyên liệu, nhập số lượng dương, ghi số lượng kiểm kê. | Số dư, movement và bản ghi kiểm kê phản ánh đúng thao tác. | Chưa thực hiện. | Chưa có bằng chứng | InventoryService; cần đối chiếu số dư sau từng thao tác. |
| TC-12 | Xác nhận thanh toán hợp lệ | Phiên OPEN, không còn món AWAITING_ACCEPTANCE; nhân viên xác nhận. | Tạo Payment, đóng phiên và giải phóng bàn trong cùng transaction. | Chưa thực hiện. | Chưa có bằng chứng | PaymentsService; chưa có response runtime. |
| TC-13 | Chặn thanh toán khi còn món chờ | Phiên có ít nhất một OrderItem AWAITING_ACCEPTANCE. | Backend từ chối xác nhận thanh toán. | Chưa thực hiện. | Chưa có bằng chứng | Điều kiện kiểm tra trong PaymentsService. |
| TC-14 | Báo cáo theo kỳ | Truy vấn overview/revenue/best-sellers với khoảng ngày hợp lệ và không hợp lệ. | Trả dữ liệu tổng hợp đúng; từ chối ngày hoặc tham số không hợp lệ. | Chưa thực hiện. | Chưa có bằng chứng | ReportsController/ReportsService. |

Các cột “Kết quả thực tế” và “Trạng thái” không được gán PASS/FAIL dựa trên việc đọc mã nguồn. TC-10 ghi nhận một sai lệch tĩnh cần xử lý, không phải kết quả một lần chạy API bị lỗi.

### 4.4.4. Kết quả kiểm thử thực tế

**Kiểm tra CI trên GitHub Actions**

Repository có hai workflow xác minh:

- Backend validation: cài dependencies, `npm run prisma:validate`, `npm run prisma:generate`, `npm run build`.
- Frontend validation: cài dependencies và `npm run typecheck`.

Đã tra cứu lịch sử workflow của nhánh. Có một lần chạy Backend validation hoàn tất với kết luận success tại commit `48cdd3ae6ad5ebbf05a53ae9100835a13653710c` ([GitHub Actions – Backend validation](https://github.com/NTMHuy/ResMan/actions/runs/45848026796)); các bước Validate Prisma schema, Generate Prisma Client và Build NestJS đều có trạng thái success. Có một lần chạy Frontend validation hoàn tất với kết luận success tại commit `a1954f56b23c9e8fe82b72c3a461be6e82bc1f7f` ([GitHub Actions – Frontend validation](https://github.com/NTMHuy/ResMan/actions/runs/45848068948)); bước Typecheck có trạng thái success.

**Giới hạn quan trọng:** Hai lần chạy CI nêu trên không gắn với commit HEAD đang khảo sát là `cea1036bfb29b288f9e77433a1cf800fbe1c361f`. Tra cứu workflow theo đúng HEAD không tìm thấy lần chạy tương ứng tại thời điểm khảo sát. Vì vậy, chỉ có thể kết luận các bước xác minh đã thành công ở những commit được dẫn; không khẳng định commit HEAD đã được CI build/typecheck thành công.

Không tìm thấy file test unit, integration hoặc E2E nghiệp vụ thực thi trong `tests/unit`, `tests/integration`, `tests/e2e/web`; các thư mục này chỉ có README hoặc tài liệu scaffold. Không có log Postman/Swagger, response API, ảnh chụp thao tác hoặc log chạy ứng dụng được lưu trong phạm vi repository đã khảo sát. Do đó, các chức năng nghiệp vụ vẫn chưa có bằng chứng kiểm thử runtime trong báo cáo này.

## 4.5. Đánh giá hệ thống

### 4.5.1. Những kết quả đạt được

Qua đối chiếu mã nguồn và thiết kế, có thể ghi nhận các kết quả sau:

- Hệ thống đã hình thành cấu trúc frontend React Native/Expo và backend NestJS tách biệt; frontend gọi backend thông qua API client và repository.
- Cơ chế xác thực JWT, quản lý role/permission và bảo vệ endpoint đã có hiện thực ở backend.
- Các phân hệ nghiệp vụ trọng tâm gồm thực đơn, bàn/phiên, đặt món, KDS, kho, nhân viên, thanh toán và báo cáo đều có cấu trúc màn hình hoặc API/service tương ứng trong repository.
- Dữ liệu nghiệp vụ được mô hình hóa trong Prisma schema; một số thao tác nhiều bước sử dụng transaction để giữ tính nhất quán giữa các bản ghi liên quan.
- Tích hợp Cloudinary cho ảnh món ăn đã có mã nguồn xử lý upload, lưu URL/public ID và dọn dẹp tài nguyên ảnh cũ.
- Hai workflow CI đã từng xác minh thành công các bước build backend và typecheck frontend ở các commit cụ thể được nêu tại mục 4.4.4.

Các kết quả trên phản ánh mức độ hiện thực trong mã nguồn và bằng chứng CI ở các commit đã dẫn; chưa đủ để kết luận toàn bộ hệ thống hoạt động ổn định trong môi trường vận hành thực tế.

### 4.5.2. Những hạn chế còn tồn tại

1. **Thiếu bằng chứng kiểm thử nghiệp vụ:** Chưa có bộ unit/integration/E2E nghiệp vụ thực thi trong repository và chưa có kết quả kiểm thử API/giao diện tại commit HEAD. Đây là hạn chế lớn nhất khi đánh giá mức độ đáp ứng yêu cầu.
2. **Chưa đồng nhất API quản lý trạng thái đơn:** Frontend `ApiOrderRepository` gọi `PATCH /orders/:id/items/status`, nhưng backend `StaffOrdersController` không khai báo endpoint này. Các thao tác accept/reject/cập nhật trạng thái dựa trên route đó cần được đồng bộ.
3. **Quy tắc KDS chưa thống nhất hoàn toàn:** Backend yêu cầu lý do khi bếp hủy món và không khai báo chuyển trạng thái `IN_PREPARATION → ACCEPTED`. Cần xác nhận lại quy tắc nghiệp vụ hoặc điều chỉnh mã nguồn/tài liệu cho thống nhất.
4. **Phạm vi kho còn thủ công:** Chưa có định mức nguyên liệu theo món và không tự động trừ kho khi phát sinh đơn. Ý nghĩa nghiệp vụ của kiểm kê và điều chỉnh số dư cần được kiểm thử, đối chiếu với yêu cầu.
5. **Tài liệu phát triển còn nội dung cũ:** `backend/DEVELOPMENT.md` vẫn mô tả một số endpoint guest theo `X-Session-Code`, trong khi luồng khách hàng hiện tại dùng JWT CUSTOMER và TableDevice. Cần cập nhật tài liệu và các HTTP request mẫu cũ để tránh gây nhầm lẫn.
6. **Tệp cấu hình mẫu có xung đột:** `backend/.env.example` đang chứa dấu phân cách merge conflict ở phần Cloudinary. Cần xử lý tệp này trước khi dùng làm hướng dẫn cấu hình môi trường.
7. **Chưa có ảnh giao diện thực tế trong tài liệu:** Repository có tài nguyên ảnh món ăn nhưng chưa có ảnh chụp các màn hình nghiệp vụ để đưa vào báo cáo nghiệm thu.
8. **Chưa xác minh trạng thái database thực tế:** Schema và migration đã được khảo sát tĩnh; chưa kết nối một database của môi trường triển khai để xác nhận migration đã áp dụng đầy đủ và dữ liệu thực tế tương thích.

### 4.5.3. Hướng phát triển

Từ các hạn chế đã xác định, các công việc ưu tiên tiếp theo gồm:

- Đồng bộ hợp đồng API giữa `ApiOrderRepository` và `StaffOrdersController`; bổ sung hoặc thay thế thao tác frontend để sử dụng đúng endpoint backend hiện có.
- Thống nhất quy tắc chuyển trạng thái KDS, điều kiện hủy món và yêu cầu nhập lý do giữa tài liệu nghiệp vụ, frontend và backend.
- Bổ sung bộ kiểm thử unit cho service nghiệp vụ và integration test cho các luồng quan trọng như mở phiên, gọi món, hủy món, nhập kho, kiểm kê và thanh toán.
- Hoàn thiện kiểm thử E2E trên Web hoặc thiết bị di động sau khi xác định môi trường test, dữ liệu seed riêng và selector ổn định; không sử dụng dữ liệu production để chạy thử.
- Bổ sung ảnh chụp giao diện thật theo danh sách tại mục 4.3 và ghi chú vai trò sử dụng.
- Làm sạch `.env.example`, cập nhật tài liệu DEVELOPMENT và các request mẫu theo API hiện tại; kiểm tra lại biến môi trường mà không đưa thông tin bí mật vào Git.
- Tiếp tục hoàn thiện nghiệp vụ kho theo phạm vi đã thống nhất, làm rõ kiểm kê/điều chỉnh và chỉ mở rộng xuất kho hoặc định mức nguyên liệu khi có yêu cầu được xác nhận.
- Thiết lập quy trình xác minh CI cho từng commit cần nghiệm thu; lưu kết quả test và artifact có thể truy xuất để làm bằng chứng cho báo cáo.

## 4.6. Tổng kết chương

Chương này đã trình bày công nghệ, môi trường, các phân hệ đã có hiện thực trong mã nguồn và cách hệ thống tổ chức giao diện. ResMan hiện có nền tảng frontend React Native/Expo, backend NestJS, PostgreSQL/Prisma, xác thực JWT và các module phục vụ các nghiệp vụ chính của nhà hàng. Mã nguồn cũng thể hiện tích hợp Cloudinary, quản lý phiên bàn, đơn hàng, KDS, kho, thanh toán và báo cáo.

Về kiểm thử, repository có workflow CI cho backend và frontend; các workflow được tra cứu đã có kết quả thành công ở một số commit trước commit HEAD. Tuy nhiên, tại commit khảo sát chưa có bằng chứng CI tương ứng, chưa tìm thấy bộ test nghiệp vụ thực thi và chưa có log kiểm thử API hoặc ảnh giao diện chạy thực tế. Một số điểm chưa đồng nhất giữa frontend và backend, đặc biệt ở thao tác cập nhật trạng thái đơn hàng và quy tắc KDS, cần được xử lý trước khi đánh giá hệ thống đã đáp ứng đầy đủ yêu cầu.

Như vậy, kết quả hiện tại cho thấy phần lớn các phân hệ cốt lõi đã được hiện thực ở mức mã nguồn, nhưng mức độ hoàn thiện vận hành và chất lượng thực tế vẫn cần được xác nhận thông qua kiểm thử có kiểm soát, ảnh chụp giao diện thật và đối chiếu trên môi trường chạy phù hợp.

---

## Phụ lục ghi chú rà soát trước khi đưa vào báo cáo chính thức

### A. Ảnh giao diện cần bổ sung

- [ ] `docs/analysis/images/login-screen.png`
- [ ] `docs/analysis/images/customer-order-screen.png`
- [ ] `docs/analysis/images/staff-order-screen.png`
- [ ] `docs/analysis/images/kitchen-screen.png`
- [ ] `docs/analysis/images/inventory-screen.png`
- [ ] `docs/analysis/images/menu-management-screen.png`
- [ ] `docs/analysis/images/employee-management-screen.png`
- [ ] `docs/analysis/images/reports-screen.png`
- [ ] `docs/analysis/images/tables-screen.png`

### B. Bằng chứng kiểm thử còn thiếu

- [ ] Build và Prisma validation trên đúng commit HEAD `cea1036bfb29b288f9e77433a1cf800fbe1c361f`.
- [ ] Frontend typecheck trên đúng commit HEAD.
- [ ] Log/response API cho đăng nhập, phân quyền, thực đơn, phiên bàn, đặt món, KDS, kho và thanh toán.
- [ ] Kết quả kiểm thử giao diện theo từng vai trò.
- [ ] Unit/integration/E2E tests thực thi và kết quả tương ứng.
- [ ] Kiểm thử migration trên database thử nghiệm đã sao lưu.

### C. Các tệp nguồn chính đã đối chiếu

- `docs/analysis/requirements-analysis.md`
- `docs/analysis/system-design.md`
- `frontend/package.json`, `frontend/app.json`
- `frontend/src/constants/config.ts`, `frontend/src/services/api/apiClient.ts`
- `frontend/src/repositories/index.ts` và các repository API
- `frontend/src/features/*/screens`
- `backend/package.json`, `backend/src/main.ts`, `backend/src/app.module.ts`
- Các module Auth, Users, Menu Categories, Menu Items, Tables, Sessions, Orders, Kitchen, Inventory, Payments, Reports
- `prisma/schema.prisma` và `prisma/migrations/`
- `.github/workflows/backend-validation.yml`
- `.github/workflows/frontend-validation.yml`
- `playwright.config.ts`, `tests/unit/`, `tests/integration/`, `tests/e2e/`

> **Ghi chú về tính trung thực của báo cáo:** Nội dung Chương 4 phản ánh khảo sát tĩnh và lịch sử CI được truy xuất. Những kết quả runtime, ảnh giao diện và trạng thái kiểm thử chưa có dữ liệu xác thực cần được bổ sung sau khi chạy ứng dụng trên môi trường thử nghiệm; không chuyển các trường hợp “chưa thực hiện” thành “đạt” nếu chưa có bằng chứng.
