# ResMan — Backend Specification

> **Trạng thái:** Draft — đặc tả backend, chưa phải mã nguồn triển khai  
> **Ngày cập nhật:** 06/11/2026  
> **Nhánh:** `member/minhhuy`  
> **Công nghệ mục tiêu:** NestJS, PostgreSQL, Prisma  
> **Phạm vi:** MVP quản lý nhà hàng, một nhà hàng

## 1. Mục đích và nguyên tắc

Tài liệu mô tả ranh giới backend, vai trò, quy tắc dữ liệu, luồng nghiệp vụ, API đề xuất, bảo mật, transaction và tiêu chí nghiệm thu của ResMan MVP.

Đây là tài liệu đặc tả. Việc tạo/cập nhật tài liệu không đồng nghĩa đã triển khai module NestJS, API, Prisma schema hay migration. Các endpoint và payload là hợp đồng đề xuất để đội phát triển thống nhất trước khi code.

Nguyên tắc:
- Backend là nguồn dữ liệu chuẩn; tablet và các giao diện nhân viên chỉ giao tiếp qua API.
- Không để client tự quyết định trạng thái nghiệp vụ, quyền truy cập, giá tiền hoặc tổng thanh toán.
- Mỗi order item có trạng thái và lịch sử riêng; không ép tất cả món trong đơn đi theo một trạng thái chung.
- Quy tắc đã được người dùng xác nhận ưu tiên hơn schema/tài liệu cũ.
- Không tự thêm nghiệp vụ ngoài MVP hoặc biến giả định kỹ thuật thành quyết định nghiệp vụ.

## 2. Vai trò và phạm vi MVP

Hệ thống có đúng năm vai trò nghiệp vụ:

| Vai trò | Trách nhiệm |
|---|---|
| Customer | Xem menu, gọi món và xem các món thuộc phiên bàn hiện tại; yêu cầu thanh toán bằng cách liên hệ nhân viên |
| Order Staff | Quản lý bàn/phiên, gọi món thay khách, xem món, sửa ghi chú/hủy món theo điều kiện, tiếp nhận tiền và xác nhận thanh toán |
| Kitchen Staff | Xem hàng đợi món của toàn bộ nhà bếp, tiếp nhận món có thể chế biến, cập nhật tiến độ và hoàn thành/hủy theo quy tắc |
| Inventory Staff | Quản lý nguyên liệu, số dư, giao dịch kho, kiểm kê và xem cảnh báo tồn thấp |
| Manager | Quản lý menu, bàn, nhân viên; thực hiện các nghiệp vụ được giao cho Order/Kitchen/Inventory; xem báo cáo |

Quản lý kế thừa quyền thao tác nghiệp vụ của các vai trò nhân viên nêu trên. Đây không phải vai trò thứ sáu.

### 2.1 Ngoài phạm vi MVP

- Gợi ý món bằng AI.
- Đặt bàn trước và chuyển bàn bằng phần mềm.
- Modifier/tùy chọn biến thể món.
- Phân chia nhà bếp thành nhiều station hoặc định tuyến món theo station.
- Công thức/định mức nguyên liệu cho món.
- Tự động trừ kho khi bán món.
- Tự động đổi trạng thái món ăn sang hết hàng chỉ vì tồn kho thấp.
- Chia hóa đơn hoặc nhiều lần thanh toán cho một order.
- Cổng thanh toán trực tuyến, nhà cung cấp và đơn mua hàng.
- Xác thực tablet/thiết bị ở mức chi tiết; quyết định này được để lại cho giai đoạn thiết kế bảo mật.

## 3. Mô hình bàn, tablet, phiên và order

### 3.1 Tablet và bàn

- Mỗi tablet được gán vật lý cho một bàn.
- Việc đổi tablet giữa các bàn là thao tác vật lý; MVP không cần chức năng chuyển bàn trên phần mềm.
- Một tablet chỉ phục vụ bàn được gán cho nó.
- Không cần xác định khách cụ thể nào đã gọi từng món. Không cần lưu chủ sở hữu cá nhân cho từng order item.
- Mọi món được gọi trên tablet thuộc phiên đang hoạt động của bàn đó.

Cơ chế xác thực tablet, cấp/thu hồi credential và vòng đời token chưa được chốt; không coi bất kỳ phương án cụ thể nào là quyết định nghiệp vụ.

### 3.2 Phiên bàn và order

- Mỗi bàn có tối đa một phiên đang hoạt động.
- Khi khách bắt đầu sử dụng bàn, nhân viên mở phiên; phiên chuyển sang hoạt động và bàn chuyển sang `OCCUPIED`.
- Một phiên bàn có một order.
- Khách có thể gọi món nhiều lần trong cùng phiên. Mỗi lần gọi thêm tạo các order item mới trong cùng order; không cộng dồn hoặc sửa quantity của order item cũ.
- Gọi thêm món chỉ yêu cầu phiên bàn còn hoạt động. Không phụ thuộc trạng thái của các món đã gọi trước đó.
- Khi phiên kết thúc sau khi nhân viên xác nhận thanh toán, backend đóng phiên. Bàn trở về `AVAILABLE`.
- Sau khi phiên đóng, không được thêm/sửa món trong order đã thanh toán thông qua API vận hành thông thường.

### 3.3 Trạng thái bàn

Chỉ có hai trạng thái được lưu/hiển thị:

| Mã | Nhãn | Ý nghĩa |
|---|---|---|
| `AVAILABLE` | Trống | Không có phiên đang hoạt động |
| `OCCUPIED` | Đang có khách | Có phiên đang hoạt động |

“Đang thanh toán” là một bước trong quy trình thanh toán, **không phải trạng thái bàn thứ ba**. Việc khách yêu cầu thanh toán không tự làm bàn chuyển trạng thái. Chỉ sau khi nhân viên nhận đủ tiền và xác nhận thanh toán, phiên mới đóng và bàn trở về Trống.

Nên bảo đảm trạng thái bàn nhất quán với sự tồn tại của phiên đang hoạt động; không được để bàn `AVAILABLE` trong khi vẫn có phiên mở.

## 4. Order item và trạng thái món

### 4.1 Dữ liệu order item

Mỗi order item cần tối thiểu:
- Order và menu item tham chiếu.
- Tên món và đơn giá snapshot tại thời điểm gọi.
- Số lượng của lần gọi đó.
- Ghi chú riêng của món (nếu có).
- Trạng thái hiện tại.
- Thời điểm tạo/cập nhật phù hợp.
- Lịch sử thay đổi trạng thái và actor thực hiện.

Không có modifier. Ghi chú là nơi lưu yêu cầu như “ít cay”, “không hành”.

### 4.2 Tập trạng thái chuẩn

| Mã API đề xuất | Nhãn hiển thị |
|---|---|
| `AWAITING_ACCEPTANCE` | Chờ tiếp nhận |
| `ACCEPTED` | Đã tiếp nhận |
| `IN_PREPARATION` | Đang chế biến |
| `COMPLETED` | Đã hoàn thành |
| `CANCELLED` | Đã hủy |

Không sử dụng các trạng thái legacy `REJECTED`, `PENDING_CONFIRMATION`, `QUEUED`, `PREPARING`, `READY`, `SERVED` như trạng thái nghiệp vụ hiện hành.

Luồng thông thường:
`AWAITING_ACCEPTANCE → ACCEPTED → IN_PREPARATION → COMPLETED`

Bếp được phép chuyển `IN_PREPARATION → ACCEPTED` khi cần đưa món trở lại trạng thái đã tiếp nhận.

Hủy là nhánh kết thúc riêng. Không xóa vật lý món đã hủy; giữ lại lịch sử và loại món đó khỏi tổng tiền.

### 4.3 Quyền sửa/hủy của Order Staff

| Trạng thái hiện tại | Hủy món | Sửa ghi chú |
|---|---:|---:|
| `AWAITING_ACCEPTANCE` | Có | Có |
| `ACCEPTED` | Có | Có |
| `IN_PREPARATION` | Không | Không |
| `COMPLETED` | Không | Không |
| `CANCELLED` | Không | Không |

Quản lý có quyền tương đương Order Staff.

Khách chỉ được hủy món khi món còn `AWAITING_ACCEPTANCE`, tức bếp chưa tiếp nhận. Sau khi bếp tiếp nhận, khách không tự hủy món.

### 4.4 Gọi thêm món

- Gọi thêm tạo order item mới trong order của phiên hiện tại.
- Điều kiện duy nhất ở cấp phiên là phiên vẫn đang hoạt động.
- Không khóa chức năng gọi thêm vì một món cũ đang chế biến/đã hoàn thành/đã hủy.
- Không dùng thao tác gọi thêm để tăng quantity hoặc thay đổi nội dung item cũ.

### 4.5 Hủy bởi Bếp

Bếp có thao tác hủy món khi không thể chế biến. Phạm vi trạng thái cụ thể được phép hủy và việc có cần lưu lý do hay không chưa được xác nhận đầy đủ. API/implementation phải áp dụng ma trận được chốt sau; không tự cho phép hủy ở mọi trạng thái.

## 5. Quy trình Bếp — một hàng đợi chung

MVP chỉ có một hoạt động bếp chung, không chia thành bếp nóng/bếp lạnh/đồ uống hoặc các kitchen station độc lập.

- Một nhân viên Bếp sử dụng giao diện bếp để xem danh sách món được gửi đến.
- Danh sách hiển thị tối thiểu: số bàn, tên món, số lượng, ghi chú và trạng thái.
- Bếp xem từng món và quyết định có thể chế biến hay không.
- Khi Bếp tiếp nhận món, trạng thái chuyển từ `AWAITING_ACCEPTANCE` sang `ACCEPTED`.
- Khi bắt đầu làm, chuyển sang `IN_PREPARATION`.
- Khi làm xong, chuyển sang `COMPLETED`.
- Bếp có thể đưa món từ `IN_PREPARATION` về `ACCEPTED` theo quy tắc đã xác nhận.
- Trạng thái được quản lý theo từng món, không phải một trạng thái duy nhất cho cả order.

Không có `stationId`, `kitchen_station_id`, bộ lọc station, phân tuyến station hoặc ràng buộc “một order chỉ thuộc một station”. Những cấu trúc này trong thiết kế cũ phải được loại bỏ khi đồng bộ schema.

## 6. Thanh toán

### 6.1 Yêu cầu và xác nhận thanh toán

- Khách yêu cầu thanh toán bằng cách liên hệ nhân viên.
- Yêu cầu thanh toán và xác nhận thanh toán là hai hành động khác nhau.
- Nhân viên nhận đủ tiền trước, sau đó mới xác nhận thanh toán trên hệ thống.
- Chỉ Order Staff hoặc Manager được xác nhận thanh toán.
- Một order có tối đa một payment; không chia nhỏ và không thanh toán nhiều lần.
- Khi xác nhận thành công, lưu payment history gồm actor và thời điểm; đóng phiên và khóa order đã thanh toán.

Không suy diễn rằng việc khách yêu cầu thanh toán tự động tạo payment hoặc đóng phiên.

### 6.2 Quy tắc tính tiền theo trạng thái món

Món phải được tính vào tổng tiền khi Bếp đã tiếp nhận món trở đi:

| Trạng thái món | Tính tiền |
|---|---:|
| `AWAITING_ACCEPTANCE` | Không |
| `ACCEPTED` | Có |
| `IN_PREPARATION` | Có |
| `COMPLETED` | Có |
| `CANCELLED` | Không |

Backend tự tính tổng từ snapshot giá và quantity lưu trên server. Không tin tổng tiền do client gửi lên. Món `CANCELLED` luôn bị loại khỏi tổng tiền.

**Điều kiện xác nhận payment và đóng phiên (đã xác nhận — phương án B):** nhân viên được xác nhận thanh toán và đóng phiên khi tất cả order item đều ở một trong các trạng thái `ACCEPTED`, `IN_PREPARATION`, `COMPLETED` hoặc `CANCELLED`. Không được xác nhận/đóng phiên nếu còn bất kỳ item nào ở `AWAITING_ACCEPTANCE`. Item `ACCEPTED`, `IN_PREPARATION`, `COMPLETED` được tính tiền; item `CANCELLED` và `AWAITING_ACCEPTANCE` không được tính. Vì vậy phiên có thể đóng khi món còn đang chế biến; hệ thống không bắt buộc chờ tất cả món `COMPLETED`.

### 6.3 Dữ liệu payment

Tối thiểu lưu:
- Order duy nhất được thanh toán.
- Số tiền do backend tính.
- Người xác nhận.
- Thời điểm xác nhận.
- Thông tin tham chiếu cần thiết cho lịch sử.

Danh sách phương thức thanh toán và hình thức xuất/in/tải hóa đơn chưa được quyết định; không hard-code chúng vào hợp đồng API lúc này.

## 7. Quản lý kho và kiểm kê

### 7.1 Nguyên tắc tồn kho

- Kho được cập nhật thủ công bởi Nhân viên Kho hoặc Quản lý theo quyền.
- Không tự động trừ nguyên liệu khi bán món.
- Không quản lý recipe/định mức tiêu hao nguyên liệu theo món.
- Ngưỡng tồn thấp chỉ tạo cảnh báo; không tự động chuyển món trên menu sang hết hàng/không khả dụng.
- Chỉ Nhân viên Kho nhìn thấy danh sách/cảnh báo tồn thấp. Quản lý vẫn được quản lý nguyên liệu và ngưỡng tồn.

### 7.2 Thông tin nguyên liệu

Thông tin cơ bản:
- Tên nguyên liệu.
- Nhóm nguyên liệu.
- Đơn vị tính.
- Số lượng tồn hiện tại.
- Ngưỡng cảnh báo tồn thấp.
- Ghi chú.

### 7.3 Giao dịch kho

Nhập kho, xuất kho, điều chỉnh hoặc hao hụt phải cập nhật số dư và ghi lịch sử giao dịch trong cùng transaction. Lịch sử cần đủ thông tin truy vết: loại giao dịch, lượng thay đổi, người thực hiện, thời điểm và lý do/ghi chú phù hợp.

Không xóa cứng lịch sử giao dịch kho.

### 7.4 Kiểm kê

- Có thể thực hiện kiểm kê khi cần; không bắt buộc mô hình đầu ngày/cuối ngày.
- Mỗi lần kiểm kê phải lưu thời điểm kiểm kê.
- Lưu số lượng thực tế được đếm để có thể đối chiếu với số dư hệ thống.
- Không tạo quy trình bắt buộc “mở kiểm kê đầu ngày / chốt kiểm kê cuối ngày”.
- Chi tiết về cách xử lý chênh lệch phải được thực hiện nhất quán: ghi nhận điều chỉnh và lưu lịch sử, không âm thầm ghi đè số dư.

## 8. Menu, bàn, nhân viên và báo cáo

### 8.1 Menu — Manager

Manager được:
- Thêm/sửa/xóa hoặc ngừng sử dụng danh mục/món theo chính sách lưu lịch sử.
- Cập nhật tên, mô tả, giá và thông tin hiển thị.
- Bật/tắt món.
- Đánh dấu món không khả dụng theo thao tác quản lý.
- Không bị hệ thống tự động chuyển món sang không khả dụng chỉ vì ngưỡng tồn kho thấp.

### 8.2 Bàn — Manager

Manager được tạo/sửa/xóa bàn theo ràng buộc lịch sử và quản lý hai trạng thái `AVAILABLE` / `OCCUPIED`. Không có trạng thái lưu riêng `WAITING_PAYMENT` hoặc “Đang thanh toán”.

### 8.3 Nhân viên — Manager

Manager quản lý tài khoản nhân viên, vai trò và trạng thái hoạt động theo chính sách xác thực. Chi tiết quy trình đặt lại mật khẩu và chính sách tài khoản thuộc thiết kế Auth.

### 8.4 Báo cáo — Manager

Chỉ Manager được xem báo cáo trong MVP:
- Doanh thu theo ngày/tháng.
- Số lượng món đã bán.
- Món bán chạy.
- Lịch sử đơn hàng.
- Tình trạng tồn kho.

Định nghĩa chỉ số doanh thu phải dựa trên payment đã xác nhận; món bị hủy hoặc chưa được Bếp tiếp nhận không được tính vào doanh thu đã thanh toán.

## 9. Kiến trúc backend đề xuất

Đề xuất Modular Monolith với NestJS. Các module là ranh giới trách nhiệm logic, không bắt buộc cấu trúc thư mục cụ thể:

| Module | Trách nhiệm |
|---|---|
| Auth & Access | Đăng nhập nhân viên, xác thực và phân quyền |
| Staff | Hồ sơ/tài khoản nhân viên và vai trò |
| Menu | Danh mục món, giá, trạng thái bán |
| Tables & Sessions | Bàn, thiết bị gán bàn, phiên hoạt động |
| Orders | Order, order items, ghi chú, hủy và lịch sử trạng thái |
| Kitchen | Hàng đợi bếp và thao tác trạng thái món |
| Payments | Tính tổng phải trả, xác nhận payment và lịch sử |
| Inventory | Nguyên liệu, số dư, giao dịch, kiểm kê, cảnh báo |
| Reports | Báo cáo chỉ dành cho Manager |
| Audit | Lưu actor/thời điểm/hành động cho thay đổi quan trọng |

Module không được tùy tiện ghi trực tiếp vào dữ liệu do module khác sở hữu; sử dụng application service/domain operation của module sở hữu.

## 10. API đề xuất

Tất cả đường dẫn dưới đây là đề xuất. Tất cả API được đặt dưới `/api/v1`; trạng thái chỉ được thay đổi qua command endpoint, không cho client PATCH tùy ý trường status.

### 10.1 Menu và phiên bàn

| Method | Path | Mục đích | Quyền |
|---|---|---|---|
| GET | `/menu/items` | Xem menu đang được phép bán | Customer/Staff/Manager |
| GET | `/tables/current/session` | Lấy phiên hiện tại của tablet đã xác thực | Tablet |
| GET | `/sessions/{sessionId}` | Xem phiên bàn | Đúng tablet/Order Staff/Manager |
| POST | `/tables/{tableId}/sessions` | Mở phiên và order cho bàn | Order Staff/Manager |
| POST | `/sessions/{sessionId}/order/items` | Gọi món mới trong phiên | Tablet/Order Staff/Manager |

### 10.2 Order và món

| Method | Path | Mục đích | Quyền |
|---|---|---|---|
| GET | `/orders/{orderId}` | Xem order và danh sách món | Đúng phiên/Order Staff/Manager |
| GET | `/orders` | Danh sách order theo bộ lọc | Order Staff/Manager |
| PATCH | `/orders/{orderId}/items/{itemId}/note` | Sửa ghi chú theo ma trận trạng thái | Order Staff/Manager |
| POST | `/orders/{orderId}/items/{itemId}/cancel` | Hủy món theo quyền/trạng thái | Customer scoped/Order Staff/Manager |

Không có endpoint cập nhật quantity của item cũ. Gọi thêm luôn tạo item mới.

### 10.3 Kitchen

| Method | Path | Mục đích | Quyền |
|---|---|---|---|
| GET | `/kitchen/items` | Danh sách món chờ/đang xử lý, kèm số bàn | Kitchen Staff/Manager |
| POST | `/kitchen/items/{itemId}/accept` | Tiếp nhận món | Kitchen Staff/Manager |
| POST | `/kitchen/items/{itemId}/start` | Bắt đầu chế biến | Kitchen Staff/Manager |
| POST | `/kitchen/items/{itemId}/complete` | Hoàn thành món | Kitchen Staff/Manager |
| POST | `/kitchen/items/{itemId}/revert-to-accepted` | Đưa về Đã tiếp nhận | Kitchen Staff/Manager |
| POST | `/kitchen/items/{itemId}/cancel` | Hủy món theo ma trận được duyệt | Kitchen Staff/Manager |

Không có query/filter `stationId` và không có endpoint dispatch theo station.

### 10.4 Payment

| Method | Path | Mục đích | Quyền |
|---|---|---|---|
| GET | `/orders/{orderId}/payment-summary` | Tính món được tính tiền và tổng tiền | Order Staff/Manager |
| POST | `/orders/{orderId}/payments/confirm` | Xác nhận sau khi nhận đủ tiền | Order Staff/Manager |
| GET | `/orders/{orderId}/payment` | Xem payment đã ghi nhận | Order Staff/Manager |
| GET | `/orders/paid-history` | Lịch sử order đã thanh toán | Order Staff/Manager |

Không cung cấp endpoint thanh toán trực tuyến hoặc xác nhận payment từ Customer trong MVP.

### 10.5 Inventory

| Method | Path | Mục đích | Quyền |
|---|---|---|---|
| GET | `/inventory/ingredients` | Danh sách nguyên liệu | Inventory Staff/Manager |
| POST | `/inventory/ingredients` | Tạo nguyên liệu | Inventory Staff/Manager |
| PATCH | `/inventory/ingredients/{ingredientId}` | Sửa thông tin/ngưỡng | Inventory Staff/Manager |
| POST | `/inventory/stock-movements` | Ghi nhận nhập/xuất/điều chỉnh | Inventory Staff/Manager |
| GET | `/inventory/stock-movements` | Lịch sử giao dịch | Inventory Staff/Manager |
| POST | `/inventory/stocktakes` | Ghi nhận lần kiểm kê và thời điểm | Inventory Staff/Manager |
| GET | `/inventory/alerts` | Cảnh báo tồn thấp | Inventory Staff |

### 10.6 Quản lý và báo cáo

| Method | Path | Mục đích | Quyền |
|---|---|---|---|
| CRUD | `/admin/tables` | Quản lý bàn | Manager |
| CRUD | `/admin/menu` | Quản lý menu | Manager |
| CRUD | `/admin/staff` | Quản lý nhân viên | Manager |
| GET | `/reports/revenue` | Doanh thu theo ngày/tháng | Manager |
| GET | `/reports/items` | Số lượng/món bán chạy | Manager |
| GET | `/reports/orders` | Lịch sử đơn | Manager |
| GET | `/reports/inventory` | Tình trạng tồn kho | Manager |

## 11. Quy ước request/response và lỗi

### 11.1 Định dạng chung

Response thành công đề xuất:

```json
{
  "data": {},
  "meta": { "requestId": "req_123" }
}
```

Response danh sách có thêm `page`, `pageSize`, `total`. Error response:

```json
{
  "error": {
    "code": "INVALID_STATE_TRANSITION",
    "message": "The requested action is not allowed for the current state.",
    "details": {},
    "requestId": "req_123"
  }
}
```

- ID ở API là chuỗi opaque.
- Timestamp dùng ISO 8601 có timezone.
- Tiền dùng decimal string, không dùng floating-point.
- Validate dữ liệu ở backend; không tin dữ liệu tính toán từ client.
- Pagination phải có giới hạn phía server; giá trị mặc định/tối đa sẽ chốt khi triển khai.

### 11.2 HTTP status đề xuất

| HTTP | Ý nghĩa |
|---|---|
| 200 | Đọc/cập nhật/command thành công |
| 201 | Tạo tài nguyên thành công |
| 204 | Thành công không có body |
| 400 | Request sai định dạng hoặc validation |
| 401 | Chưa xác thực/xác thực không hợp lệ |
| 403 | Không đủ quyền |
| 404 | Không tìm thấy hoặc không thuộc phạm vi truy cập |
| 409 | Xung đột nghiệp vụ/trạng thái/phiên/payment trùng |
| 422 | Dữ liệu hợp lệ về cú pháp nhưng vi phạm quy tắc nghiệp vụ, nếu nhóm chọn dùng nhất quán |
| 429 | Quá giới hạn request |
| 500 | Lỗi hệ thống không dự kiến |

Cần thống nhất chính sách 400/422 trước triển khai; không trộn lẫn tùy endpoint.

## 12. Phân quyền và bảo mật

- Mỗi request protected phải kiểm tra danh tính, vai trò và phạm vi tài nguyên.
- Customer/tablet chỉ được truy cập phiên của bàn được gán; không nhận `tableId` từ client làm bằng chứng xác thực.
- Không có khái niệm “món của khách A” trong một bàn; quyền Customer được giới hạn ở phiên bàn hiện tại.
- Kitchen Staff chỉ thao tác các order item thuộc hàng đợi bếp chung.
- Inventory alert feed chỉ dành cho Inventory Staff; Manager được quản lý dữ liệu kho nhưng không tự động có quyền xem feed cảnh báo.
- Chỉ Manager truy cập Reports.
- Không lưu mật khẩu dạng rõ; không commit secrets.
- Không trả stack trace, SQL hoặc thông tin nhạy cảm cho client.
- Ghi audit actor/time cho xác nhận thanh toán, chuyển trạng thái món, thay đổi tồn kho, quản trị nhân viên và các thay đổi nhạy cảm.
- Chính sách xác thực tablet còn để mở; thiết kế phải bổ sung trước khi triển khai endpoint tablet thực tế.

## 13. Transaction, đồng thời và tính toàn vẹn

Các thao tác sau phải nguyên tử:
- Mở session và tạo order ban đầu.
- Tạo order item và lịch sử trạng thái ban đầu.
- Chuyển trạng thái item và ghi history.
- Cập nhật số dư kho và ghi stock movement.
- Ghi nhận kiểm kê/điều chỉnh số dư và lịch sử liên quan.
- Xác nhận payment, lưu actor/time, đóng session và cập nhật trạng thái liên quan.

Ràng buộc quan trọng:
- Một bàn tối đa một session OPEN.
- Một session có đúng một order theo mô hình MVP.
- Một order tối đa một payment.
- Quantity món > 0; tiền và số lượng tồn không âm.
- Không xóa cứng lịch sử order/payment/stock movement.
- Các command có thể bị gửi lặp phải có biện pháp chống xử lý trùng; phạm vi và thời gian lưu idempotency key cần được chốt.
- Xử lý cạnh tranh khi nhiều client cùng cập nhật một item/session/payment bằng transaction và kiểm tra trạng thái hiện tại.

## 14. Các điểm còn mở

Các nội dung sau chưa được coi là quyết định đã chốt:
1. Cơ chế xác thực, cấp phát, thu hồi và xoay vòng credential cho tablet.
2. Điều kiện trạng thái chính xác để Kitchen Staff được hủy món và việc có bắt buộc lý do hủy hay không.
3. Quy tắc hủy món của Bếp: các trạng thái được phép hủy và việc có bắt buộc lý do hủy hay không.
4. Danh sách phương thức thanh toán.
5. Hình thức hóa đơn: hiển thị, in, tải hoặc xuất.
6. Đơn vị kho và quy tắc chuyển đổi nếu có nhiều đơn vị.
7. Chính sách 400/422, pagination, idempotency và thời gian lưu audit.
8. Chính sách ẩn/xóa dữ liệu menu có lịch sử.
9. Cơ chế realtime/polling giữa tablet, nhân viên và màn hình bếp; không mặc định bắt buộc WebSocket.

Không được tự giải quyết các mục trên bằng cách thêm trạng thái hoặc nghiệp vụ mới.

## 15. Checklist nghiệm thu đặc tả trước khi code

- [ ] Có đúng năm vai trò nghiệp vụ.
- [ ] Không có định danh khách hàng gắn với từng order item.
- [ ] Tablet gắn vật lý với bàn; không có chức năng chuyển bàn bằng phần mềm.
- [ ] Một bàn tối đa một phiên hoạt động; một phiên có một order.
- [ ] Gọi thêm tạo item mới trong cùng order và chỉ cần phiên còn hoạt động.
- [ ] Không có modifier; ghi chú món là trường note.
- [ ] Trạng thái item chỉ gồm năm trạng thái tại §4.2; không có REJECTED.
- [ ] Một hàng đợi bếp chung; không có stationId/kitchen station/routing.
- [ ] Kitchen list hiển thị số bàn, món, quantity, note và trạng thái.
- [ ] Quyền sửa/hủy Order Staff khớp ma trận tại §4.3.
- [ ] Tính tiền: ACCEPTED, IN_PREPARATION, COMPLETED được tính; AWAITING_ACCEPTANCE và CANCELLED không tính.
- [ ] Một order tối đa một payment; nhân viên nhận tiền rồi mới xác nhận.
- [ ] Bàn chỉ có AVAILABLE/OCCUPIED; “đang thanh toán” không phải trạng thái bàn.
- [ ] Xác nhận payment chỉ được thực hiện khi không còn item `AWAITING_ACCEPTANCE`; cho phép item `ACCEPTED`/`IN_PREPARATION`/`COMPLETED`/`CANCELLED`; sau xác nhận đóng phiên và đưa bàn về AVAILABLE.
- [ ] Kiểm kê lưu thời điểm và số lượng thực tế; không bắt buộc đầu ngày/cuối ngày.
- [ ] Không tự động trừ kho; không recipe/định mức.
- [ ] Cảnh báo tồn thấp chỉ hiển thị cho Inventory Staff.
- [ ] Chỉ Manager xem báo cáo.
- [ ] Các điểm còn mở không bị biến thành giả định trong implementation.

---

**Lưu ý đồng bộ:** `docs/10-database-design.md` và `prisma/schema.prisma` từng chứa mô hình cũ về kitchen station, customer ownership, daily opening/closing inventory và các trạng thái legacy. Chúng cần được rà soát/thiết kế lại riêng để khớp đặc tả này trước khi tạo migration triển khai. Tài liệu này không tuyên bố schema hoặc migration đã được cập nhật.
