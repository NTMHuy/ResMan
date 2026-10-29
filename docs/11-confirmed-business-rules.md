# Quyết định nghiệp vụ đã xác nhận — ResMan

> Ngày tổng hợp: 29/10/2026  
> Phạm vi: MVP ResMan  
> Trạng thái: Tập hợp các quyết định người dùng đã trực tiếp xác nhận trong quá trình rà soát.  
> Tài liệu này bổ sung và ưu tiên áp dụng khi có nội dung cũ trong tài liệu khác mâu thuẫn.

## 1. Nguyên tắc sử dụng

- Đây là nguồn đối chiếu nghiệp vụ cho PRD, user flows, use cases, system analysis và database design.
- Chỉ các nội dung được ghi là **Đã xác nhận** mới được xem là quyết định nghiệp vụ.
- Các nội dung ghi **Cần làm rõ** không được tự suy diễn thành yêu cầu.
- Tài liệu này không phải đặc tả triển khai Backend và không quyết định framework/API.

## 2. Vai trò và thiết bị

Hệ thống có năm vai trò chính: Khách hàng, Nhân viên Order, Nhân viên Bếp, Nhân viên Kho và Quản lý.

- Tablet khách hàng được gắn cố định với một bàn.
- Nhân viên sử dụng giao diện phù hợp trên điện thoại hoặc máy tính.
- Bếp, kho, quầy thanh toán và quản lý sử dụng giao diện theo công việc.
- Dữ liệu phiên bàn và đơn hàng được lưu ở server. Tablet chỉ kết nối để hiển thị và gửi thao tác; khi khởi động lại hoặc kết nối lại, tablet tải dữ liệu phiên đang hoạt động từ server.
- Không có chức năng chuyển bàn/đổi bàn trên phần mềm trong MVP; nếu cần đổi vị trí tablet thì nhân viên di chuyển thiết bị vật lý.
- Mỗi bàn chỉ có tối đa một phiên đang hoạt động.
- Khách có thể đặt món với tư cách guest; đăng nhập khách hàng không bắt buộc.
- AI gợi ý món ăn là định hướng tương lai, không thuộc MVP.

## 3. Phiên bàn và đặt món

### 3.1 Mở và kết thúc phiên

- Quản lý hoặc Nhân viên Order có thể mở phiên bàn.
- Sau khi phiên được mở, tablet tại bàn có thể được khách sử dụng để xem menu và đặt món.
- Không hỗ trợ đặt bàn trước trong MVP.
- Phiên chỉ kết thúc sau khi khách dùng bữa xong, yêu cầu thanh toán, nhân viên nhận đủ tiền và xác nhận thanh toán trên hệ thống.
- Yêu cầu thanh toán và xác nhận thanh toán là hai hành động khác nhau.
- Khách liên hệ nhân viên để yêu cầu thanh toán; không có thao tác tự thanh toán độc lập trên tablet trong quy trình MVP.
- Mỗi phiên bàn có một đơn hàng; các lần gọi món tiếp theo được thêm vào cùng đơn đó.

### 3.2 Đặt món và gọi thêm

- Khách hàng có thể gửi món trực tiếp từ tablet.
- Nhân viên Order có thể xem và xử lý đơn; việc nhân viên xác nhận đơn không bắt buộc cho mọi lần gửi món.
- Khách có thể gọi thêm trong suốt phiên đang hoạt động. Mỗi món gọi thêm được tạo thành một order item mới trong cùng đơn, không sửa số lượng của order item cũ.
- Nhân viên Order cũng có thể gọi thêm theo cách tương tự.
- Không có hệ thống modifier/tùy chọn biến thể món. Yêu cầu riêng được lưu bằng ghi chú của món.

### 3.3 Danh sách món trên tablet khách hàng

Danh sách món đã gọi hiển thị theo dạng danh sách dọc; mỗi món thể hiện:
1. Số thứ tự.
2. Tên món.
3. Trạng thái.
4. Giá.
5. Nút “Tùy chọn”.
6. Ghi chú.

Trong “Tùy chọn” của khách hàng có:
- **Hủy món:** chỉ được hủy khi bếp chưa xác nhận tiếp nhận món.
- **Gọi thêm:** chọn món khác và tạo order item mới trong cùng đơn.

Món đã hủy vẫn được lưu trong lịch sử với trạng thái “Đã hủy”.

## 4. Quy trình bếp và trạng thái món

### 4.1 Trạng thái nghiệp vụ

Luồng trạng thái bình thường của từng món:
- Chờ tiếp nhận.
- Đã tiếp nhận.
- Đang chế biến.
- Đã hoàn thành.

Món có thể bị chuyển sang trạng thái “Đã hủy” theo quyền và điều kiện được mô tả bên dưới. Không sử dụng trạng thái “Bị từ chối” trong quy trình nghiệp vụ đã chốt.

- Bếp xác nhận đã nhận món, sau đó chuyển sang đang chế biến và cuối cùng xác nhận hoàn thành.
- Bếp có thể chuyển món từ “Đang chế biến” trở lại “Đã tiếp nhận”.
- Tablet khách hàng hiển thị trạng thái mới; MVP không yêu cầu push notification riêng cho khách.
- Giao diện bếp hiển thị danh sách món với số thứ tự, tên món, trạng thái, giá, ghi chú và mục tùy chọn.
- Nhân viên Bếp nhìn thấy giá món.
- Quản lý có thể thực hiện toàn bộ thao tác của nhân viên Bếp.

### 4.2 Hủy món bởi bếp

- Bếp có chức năng “Hủy món”.
- Không yêu cầu nhập lý do khi bếp hủy món.
- Không có hành động riêng “Từ chối món”.
- Điều kiện/trạng thái cụ thể mà bếp được phép hủy món chưa được xác nhận đầy đủ; không tự đặt thêm giới hạn.

### 4.3 Can thiệp món bởi khách hàng và nhân viên Order

Khách hàng:
- Chỉ được hủy món khi bếp chưa xác nhận tiếp nhận món.
- Có thể gọi thêm món mới trong phiên.

Nhân viên Order có menu “Tùy chọn” gồm ba chức năng:
- **Hủy món:** tương tự quyền hủy của khách hàng.
- **Gọi thêm:** tương tự khách hàng, tạo order item mới.
- **Sửa:** chức năng riêng của nhân viên Order, chỉ sửa ghi chú; không sửa tên món hoặc số lượng.

Quyền thao tác của Nhân viên Order theo trạng thái:

| Trạng thái món | Hủy món | Gọi thêm | Sửa ghi chú |
|---|---:|---:|---:|
| Chờ tiếp nhận | Có | Có | Có |
| Đã tiếp nhận | Có | Có | Có |
| Đang chế biến | Không | Có | Không |
| Đã hoàn thành | Không | Có | Không |
| Đã hủy | Không | Có | Không |

Khi bếp đã chuyển món sang “Đang chế biến”, Nhân viên Order không thể sửa ghi chú hoặc hủy món đó. “Gọi thêm” luôn tạo món mới, không thay đổi món cũ.

## 5. Thanh toán

- Khách yêu cầu thanh toán sau khi dùng bữa.
- Nhân viên nhận đủ tiền và xác nhận thanh toán trên hệ thống.
- Một đơn chỉ có một lần thanh toán; không hỗ trợ tách hóa đơn hoặc thanh toán nhiều lần.
- Phương thức thanh toán cụ thể được để lại cho giai đoạn sau.
- Chỉ được thanh toán khi mọi món trong đơn đã hoàn thành hoặc đã được giải quyết bằng trạng thái kết thúc phù hợp. Món đã hủy không được tính vào số tiền phải thanh toán.
- Khi xác nhận thanh toán, hệ thống lưu lịch sử thanh toán, người xác nhận và thời điểm; sau đó đóng phiên bàn.
- Đơn đã thanh toán không được chỉnh sửa.
- Phần tổng kết thanh toán phải liệt kê các món được tính tiền và loại trừ món đã hủy.

**Cần làm rõ:** Hình thức “xuất” kết quả thanh toán là màn hình tổng kết, hóa đơn in, hay tệp tải xuống. Không mặc định chọn một hình thức.

## 6. Quản lý kho

### 6.1 Thông tin nguyên liệu

Thông tin nguyên liệu gồm:
- Tên nguyên liệu.
- Nhóm/danh mục nguyên liệu.
- Đơn vị.
- Số lượng tồn hiện tại.
- Ngưỡng cảnh báo tồn thấp.
- Ghi chú.

Không yêu cầu mã nguyên liệu hiển thị cho người dùng; hệ thống có thể dùng ID nội bộ.

### 6.2 Nhập kho và điều chỉnh tồn

Quy trình nhập kho:
1. Chọn nguyên liệu.
2. Nhập số lượng.
3. Nhập/chọn đơn vị.
4. Có thể thêm ghi chú.
5. Xác nhận nhập kho.

Hệ thống cộng số lượng vào tồn và lưu lịch sử giao dịch, bao gồm nhân viên thực hiện và thời điểm.

Khi điều chỉnh tồn, hệ thống lưu lịch sử tương tự; không ghi đè hoặc xóa lịch sử cũ. Lịch sử cần thể hiện số lượng trước/sau hoặc lượng chênh lệch, người thực hiện, thời điểm và lý do/ghi chú.

### 6.3 Kiểm kê và cảnh báo

- Nhân viên có thể ghi nhận kiểm kê khi cần, không bị giới hạn vào một giờ cố định trong ngày.
- Hệ thống lưu người kiểm kê, thời điểm và so sánh số lượng thực tế với số lượng đang ghi nhận.
- Ngưỡng tồn thấp do Quản lý hoặc Nhân viên Kho thiết lập.
- Khi tồn thấp hơn ngưỡng, cảnh báo chỉ gửi đến Nhân viên Kho theo quyết định hiện tại.
- Ngưỡng thấp chỉ tạo cảnh báo kho; không tự động làm món ăn chuyển sang hết hàng/không khả dụng.
- Không tự động trừ kho khi bán món.
- MVP không quản lý công thức/định mức nguyên liệu cho món và không có quy trình nhà cung cấp/đơn mua hàng.

**Cần làm rõ:** Có giữ khái niệm bản ghi kiểm kê “đầu ngày/cuối ngày” nhưng cho phép thực hiện linh hoạt, hay chuyển hoàn toàn sang các lần kiểm kê độc lập. Chưa được tự chọn một phương án.

## 7. Nhân viên Order

Nhân viên Order được:
- Truy cập từng bàn từ giao diện nhân viên.
- Gọi món thay khách.
- Xem danh sách món của tất cả bàn đang hoạt động.
- Xem lịch sử các đơn đã thanh toán.
- Thực hiện ba thao tác trên order item theo bảng quyền tại Mục 4.3.
- Nhận đủ tiền và xác nhận thanh toán.

Quản lý có thể thực hiện toàn bộ thao tác của Nhân viên Order.

## 8. Quản lý

Quản lý được:
- Tạo tài khoản nhân viên.
- Khóa/mở khóa tài khoản.
- Thay đổi vai trò.
- Đặt lại mật khẩu.
- Thêm/sửa/xóa món ăn; cập nhật giá; bật/tắt món và xem trạng thái món không khả dụng/hết hàng.
- Thêm/sửa/xóa bàn và thay đổi trạng thái bàn.
- Xem bàn trống, đang có khách và đang chờ thanh toán.
- Thực hiện toàn bộ thao tác của Nhân viên Order, Nhân viên Bếp và Nhân viên Kho.
- Xem báo cáo: doanh thu theo ngày/tháng; số lượng món đã bán; món bán chạy; lịch sử đơn hàng; tình trạng tồn kho.

Chỉ Quản lý được xem báo cáo trong MVP.

## 9. Phạm vi MVP và các nội dung loại trừ

Các nội dung đã xác định không thuộc MVP:
- Gợi ý món ăn bằng AI.
- Đặt bàn trước.
- Chuyển bàn bằng thao tác phần mềm.
- Modifier/tùy chọn biến thể món.
- Công thức/định mức nguyên liệu.
- Tự động trừ kho theo doanh số.
- Tự động chuyển món sang không khả dụng chỉ vì tồn kho dưới ngưỡng.
- Thanh toán chia nhỏ hoặc nhiều lần cho một đơn.
- Tích hợp cổng thanh toán nâng cao.
- Nhà cung cấp và đơn mua hàng.

## 10. Các điểm chưa được quyết định — không tự suy diễn

1. Bếp được phép hủy món ở những trạng thái cụ thể nào, nhất là sau khi đã bắt đầu chế biến.
2. Có cho phép chuyển món từ “Đã hoàn thành” về trạng thái trước đó hay không.
3. Hình thức xuất/in/tải hóa đơn hoặc kết quả thanh toán.
4. Kiểm kê có tiếp tục dùng nhãn đầu ngày/cuối ngày hay chỉ là các lần kiểm kê linh hoạt.
5. Quy tắc chuyển đổi đơn vị khi nhập kho khác đơn vị chuẩn của nguyên liệu (nếu phát sinh).
6. Danh sách phương thức thanh toán.
7. Có cần quy trình điều chỉnh riêng sau khi đơn đã thanh toán hay không.
