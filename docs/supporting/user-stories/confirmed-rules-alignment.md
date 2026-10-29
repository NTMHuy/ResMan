# User Stories — Alignment với nghiệp vụ đã xác nhận

> Nguồn chuẩn: [docs/11-confirmed-business-rules.md](../../11-confirmed-business-rules.md)  
> Tài liệu này bổ sung Acceptance Criteria và điều chỉnh các User Stories hiện có khi có nội dung mâu thuẫn.

## 1. Customer

### US-CUS-01 — Xem menu
Là khách hàng, tôi muốn xem món, giá và trạng thái để lựa chọn món phù hợp.

**Acceptance Criteria**
- [ ] Xem được tên, giá, mô tả, danh mục và trạng thái món.
- [ ] Có thể lọc danh mục/tìm kiếm nếu chức năng này được giữ trong UI hiện tại.
- [ ] Khách không bắt buộc đăng nhập.
- [ ] Món bị Quản lý tắt không thể đặt.
- [ ] Tồn nguyên liệu thấp không tự động làm món chuyển sang không khả dụng.

### US-CUS-02 — Đặt món tại bàn
Là khách hàng đang dùng tablet tại bàn, tôi muốn gửi món để nhà hàng xử lý.

**Acceptance Criteria**
- [ ] Nhân viên đã mở phiên bàn trước khi khách đặt món.
- [ ] Khách có thể gửi món với tư cách guest.
- [ ] Mỗi món gửi được lưu thành item trong đơn của phiên.
- [ ] Có thể nhập ghi chú cho item.
- [ ] Không bắt buộc nhân viên Order xác nhận mọi lần gửi món.

### US-CUS-03 — Theo dõi và thao tác với món
Là khách hàng, tôi muốn xem trạng thái từng món và gọi thêm/hủy món khi còn được phép.

**Acceptance Criteria**
- [ ] Mỗi item hiển thị số thứ tự, tên, trạng thái, giá, Tùy chọn và ghi chú.
- [ ] Chỉ hủy được khi bếp chưa xác nhận tiếp nhận.
- [ ] Gọi thêm tạo item mới trong cùng đơn, không sửa số lượng item cũ.
- [ ] Item đã hủy vẫn xuất hiện trong lịch sử với trạng thái Đã hủy.
- [ ] Tablet hiển thị trạng thái cập nhật; không yêu cầu push notification.

## 2. Order Staff

### US-ORD-01 — Mở phiên và gọi món thay khách
Là Nhân viên Order, tôi muốn mở phiên bàn và gọi món thay khách để hỗ trợ phục vụ.

**Acceptance Criteria**
- [ ] Có thể mở phiên bàn.
- [ ] Mỗi bàn chỉ có tối đa một phiên hoạt động.
- [ ] Có thể truy cập từng bàn và gọi món thay khách.
- [ ] Có thể xem các bàn đang hoạt động.

### US-ORD-02 — Quản lý món trong đơn
Là Nhân viên Order, tôi muốn hủy, gọi thêm hoặc sửa ghi chú món theo trạng thái để xử lý yêu cầu của khách.

**Acceptance Criteria**
- [ ] Tùy chọn có Hủy món, Gọi thêm và Sửa.
- [ ] Sửa chỉ cập nhật ghi chú, không thay tên món hoặc số lượng.
- [ ] Hủy/sửa ghi chú được khi item ở Chờ tiếp nhận hoặc Đã tiếp nhận.
- [ ] Không hủy/sửa ghi chú khi item ở Đang chế biến, Đã hoàn thành hoặc Đã hủy.
- [ ] Gọi thêm được trong phiên đang hoạt động và tạo item mới.
- [ ] Không thêm/sửa đơn sau khi payment đã xác nhận.

### US-ORD-03 — Xem lịch sử đơn
Là Nhân viên Order, tôi muốn xem lịch sử đơn đã thanh toán để tra cứu giao dịch.

**Acceptance Criteria**
- [ ] Xem được lịch sử đơn đã thanh toán.
- [ ] Quyền này không cấp quyền xem báo cáo quản lý.

## 3. Kitchen Staff

### US-KIT-01 — Xem danh sách món cần xử lý
**Acceptance Criteria**
- [ ] Xem món theo đơn/phiên.
- [ ] Hiển thị số thứ tự, tên món, trạng thái, giá và ghi chú.
- [ ] Phân biệt được các đơn/bàn.

### US-KIT-02 — Cập nhật tiến trình chế biến
**Acceptance Criteria**
- [ ] Có thể xác nhận Chờ tiếp nhận → Đã tiếp nhận.
- [ ] Có thể chuyển Đã tiếp nhận → Đang chế biến.
- [ ] Có thể chuyển Đang chế biến → Đã hoàn thành.
- [ ] Có thể chuyển Đang chế biến về Đã tiếp nhận.
- [ ] Có thao tác Hủy món, không yêu cầu lý do.
- [ ] Không tồn tại hành động/trạng thái Bị từ chối.
- [ ] Chưa áp đặt điều kiện trạng thái hủy khi người quyết định chưa chốt.

## 4. Inventory Staff

### US-INV-01 — Theo dõi tồn kho
**Acceptance Criteria**
- [ ] Xem tên, nhóm, đơn vị, tồn hiện tại, ngưỡng và ghi chú.
- [ ] Xem lịch sử nhập, điều chỉnh và kiểm kê.
- [ ] Nhận cảnh báo khi tồn dưới ngưỡng.

### US-INV-02 — Nhập kho và điều chỉnh
**Acceptance Criteria**
- [ ] Nhập kho bằng nguyên liệu, số lượng, đơn vị và ghi chú tùy chọn.
- [ ] Hệ thống cập nhật số dư sau xác nhận.
- [ ] Lưu người thực hiện và thời điểm.
- [ ] Điều chỉnh tồn không xóa/ghi đè lịch sử.
- [ ] Lịch sử cho phép xác định trước/sau hoặc lượng chênh lệch và lý do.

### US-INV-03 — Kiểm kê linh hoạt
**Acceptance Criteria**
- [ ] Có thể tạo bản ghi kiểm kê khi cần.
- [ ] Lưu số lượng thực tế, người kiểm kê và thời điểm.
- [ ] So sánh số thực tế với số liệu hệ thống.
- [ ] Chưa yêu cầu kiểm kê bắt buộc vào đầu/cuối ngày.

## 5. Manager

### US-MGR-01 — Quản lý vận hành
**Acceptance Criteria**
- [ ] Quản lý được tài khoản nhân viên và vai trò.
- [ ] Quản lý được món ăn, giá và trạng thái bật/tắt.
- [ ] Quản lý được bàn và trạng thái bàn.
- [ ] Có toàn bộ quyền thao tác của Order Staff, Kitchen Staff và Inventory Staff.

### US-MGR-02 — Xem báo cáo
**Acceptance Criteria**
- [ ] Xem doanh thu theo ngày/tháng.
- [ ] Xem số lượng món đã bán và món bán chạy.
- [ ] Xem lịch sử đơn và tình trạng tồn kho.
- [ ] Chỉ vai trò Quản lý có quyền xem báo cáo.

## 6. Payment

### US-PAY-01 — Xác nhận thanh toán
Là Nhân viên Order, tôi muốn xác nhận thanh toán sau khi nhận đủ tiền để đóng phiên bàn chính xác.

**Acceptance Criteria**
- [ ] Khách yêu cầu thanh toán sau khi dùng bữa.
- [ ] Nhân viên nhận đủ tiền rồi xác nhận trên hệ thống.
- [ ] Một đơn chỉ có một payment; không hỗ trợ thanh toán một phần.
- [ ] Chỉ item hoàn thành được tính tiền; item Đã hủy bị loại trừ.
- [ ] Mọi item phải ở trạng thái đã hoàn thành hoặc trạng thái kết thúc phù hợp trước khi thanh toán.
- [ ] Lưu người xác nhận và thời điểm.
- [ ] Xác nhận payment làm đơn bất biến và đóng phiên.
- [ ] Phương thức và định dạng hóa đơn vẫn là quyết định mở.

## 7. Quy tắc xuyên vai trò

- Một phiên bàn có một đơn; mỗi bàn tối đa một phiên đang hoạt động.
- Tablet gắn cố định với bàn; không có chuyển bàn trên phần mềm.
- Server lưu trạng thái phiên và đơn; tablet tải lại dữ liệu khi kết nối lại.
- Một đơn chỉ thuộc một kitchen station và có tối đa một kitchen ticket.
- Không có modifier, recipe/định mức, tự động trừ kho, nhà cung cấp/đơn mua hàng hoặc AI recommendation trong MVP.
- Quản lý có toàn quyền nghiệp vụ của ba nhóm nhân viên; báo cáo chỉ dành cho Quản lý.

## 8. Các quyết định còn mở

Xem Mục 10 trong [confirmed business rules](../../11-confirmed-business-rules.md). Không chuyển các câu hỏi này thành Acceptance Criteria bắt buộc trước khi có xác nhận.
