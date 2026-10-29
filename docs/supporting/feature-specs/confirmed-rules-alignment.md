# Feature Specifications — Alignment với nghiệp vụ đã xác nhận

> Nguồn chuẩn: [docs/11-confirmed-business-rules.md](../../11-confirmed-business-rules.md)  
> Phạm vi: MVP  
> Tài liệu này bổ sung/ghi đè các nội dung cũ mâu thuẫn trong Feature Specs hiện có. Không phải thiết kế kỹ thuật.

## 1. F-CUS — Customer Ordering

### F-CUS-01 — Xem menu
- Khách xem danh sách món, giá, mô tả, danh mục và trạng thái khả dụng.
- Trạng thái món không khả dụng do Quản lý thiết lập; không tự động đổi chỉ vì nguyên liệu dưới ngưỡng tồn.
- Khách có thể đặt món với tư cách guest; không bắt buộc đăng nhập.

### F-CUS-02 — Gửi món và gọi thêm
**Preconditions:** Nhân viên đã mở phiên cho bàn; phiên đang hoạt động; menu có món khả dụng.

**Main flow:**
1. Khách chọn một hoặc nhiều món.
2. Khách nhập ghi chú nếu có.
3. Khách gửi yêu cầu đặt món.
4. Hệ thống thêm các món thành order item vào đơn của phiên bàn.
5. Khách có thể tiếp tục gọi thêm; mỗi lần gọi thêm tạo order item mới trong cùng đơn.

**Rules:**
- Mỗi bàn tối đa một phiên hoạt động; một phiên có một đơn.
- Gọi thêm không cập nhật số lượng của item cũ.
- Không có modifier; ghi chú là văn bản tự do theo từng item.
- Nhân viên Order không bắt buộc xác nhận mọi lần gửi món.

### F-CUS-03 — Theo dõi và tùy chọn món
Mỗi item hiển thị số thứ tự, tên món, trạng thái, giá, nút Tùy chọn và ghi chú.

Khách có thể:
- Hủy món khi bếp chưa xác nhận tiếp nhận.
- Gọi thêm món mới vào đơn hiện tại.

Món đã hủy vẫn được lưu lịch sử với trạng thái Đã hủy. Không xóa vật lý item đã gửi.

## 2. F-ORD — Order Staff

### F-ORD-01 — Mở phiên và gọi món thay khách
- Nhân viên Order có thể mở phiên bàn.
- Có thể truy cập từng bàn và gọi món thay khách.
- Có thể xem danh sách món của tất cả bàn đang hoạt động.

### F-ORD-02 — Quản lý item
Menu Tùy chọn của Nhân viên Order có:
1. Hủy món.
2. Gọi thêm.
3. Sửa ghi chú.

Sửa chỉ thay đổi ghi chú; không sửa tên món hoặc số lượng. Gọi thêm luôn tạo item mới.

| Trạng thái item | Hủy | Gọi thêm | Sửa ghi chú |
|---|---:|---:|---:|
| Chờ tiếp nhận | Có | Có | Có |
| Đã tiếp nhận | Có | Có | Có |
| Đang chế biến | Không | Có | Không |
| Đã hoàn thành | Không | Có | Không |
| Đã hủy | Không | Có | Không |

Không cho phép thay đổi đơn sau khi payment đã được xác nhận và phiên đã đóng.

### F-ORD-03 — Theo dõi bàn và lịch sử
- Xem tất cả bàn có phiên đang hoạt động.
- Xem lịch sử các đơn đã thanh toán.
- Có thể xác nhận thanh toán sau khi nhận đủ tiền từ khách.

## 3. F-KIT — Kitchen

### F-KIT-01 — Danh sách món
Hiển thị số thứ tự, tên món, trạng thái, giá và ghi chú. Bếp nhìn thấy giá món.

### F-KIT-02 — Cập nhật trạng thái
Trạng thái nghiệp vụ:
`Chờ tiếp nhận → Đã tiếp nhận → Đang chế biến → Đã hoàn thành`

- Bếp xác nhận tiếp nhận món.
- Bếp chuyển món sang Đang chế biến.
- Bếp xác nhận Đã hoàn thành.
- Bếp có thể chuyển Đang chế biến về Đã tiếp nhận.
- Nhánh Đã hủy tồn tại; không có trạng thái Bị từ chối.
- Hủy món từ giao diện Bếp không yêu cầu lý do.
- Điều kiện trạng thái cụ thể cho thao tác hủy của Bếp vẫn là câu hỏi mở.
- Không tự thêm transition từ Đã hoàn thành về trạng thái trước đó.

Tablet khách hàng hiển thị trạng thái cập nhật; không yêu cầu push notification.

## 4. F-INV — Inventory

### F-INV-01 — Theo dõi nguyên liệu
Thông tin gồm tên, nhóm/danh mục, đơn vị, số lượng tồn hiện tại, ngưỡng cảnh báo và ghi chú. Không cần mã hiển thị cho người dùng.

### F-INV-02 — Nhập kho và điều chỉnh
Nhập kho gồm chọn nguyên liệu, số lượng, đơn vị, ghi chú tùy chọn và xác nhận. Lưu người thực hiện, thời điểm và lịch sử giao dịch.

Điều chỉnh tồn phải giữ lịch sử, bao gồm giá trị trước/sau hoặc chênh lệch, người thực hiện, thời điểm và lý do/ghi chú.

### F-INV-03 — Kiểm kê và cảnh báo
- Có thể kiểm kê bất cứ khi nào cần; lưu số thực tế, người kiểm kê và thời điểm.
- Quản lý và Nhân viên Kho được cấu hình ngưỡng tồn thấp.
- Cảnh báo tồn thấp chỉ hiển thị/gửi cho Nhân viên Kho.
- Tồn thấp không tự động khóa món.
- Không tự động trừ kho theo đơn hàng.
- Không quản lý recipe/định mức nguyên liệu, nhà cung cấp hoặc đơn mua hàng trong MVP.
- Cách biểu diễn bản ghi kiểm kê đầu ngày/cuối ngày còn chờ xác nhận.

## 5. F-PAY — Payment

- Khách yêu cầu thanh toán sau khi dùng bữa.
- Nhân viên nhận đủ tiền và xác nhận payment.
- Một order có tối đa một payment; không chia nhỏ hoặc thanh toán nhiều lần.
- Chỉ thanh toán khi mọi item đã hoàn thành hoặc được giải quyết bằng trạng thái kết thúc phù hợp.
- Item Đã hủy không tính vào tổng tiền.
- Lưu người xác nhận và thời điểm.
- Sau payment, đơn bất biến và phiên bàn đóng.
- Phương thức thanh toán và hình thức hóa đơn/output chưa chốt.

## 6. F-MGR — Management

Quản lý có quyền:
- Tạo, khóa/mở khóa tài khoản nhân viên; đổi vai trò; đặt lại mật khẩu.
- Thêm/sửa/xóa món; cập nhật giá; bật/tắt món.
- Thêm/sửa/xóa bàn; thay đổi trạng thái bàn; xem bàn trống, đang có khách và chờ thanh toán.
- Thực hiện toàn bộ thao tác của Order Staff, Kitchen Staff và Inventory Staff.
- Xem báo cáo doanh thu ngày/tháng, số lượng món bán, món bán chạy, lịch sử đơn và tình trạng tồn kho.

Chỉ Quản lý được xem báo cáo. Nhân viên Order chỉ có quyền xem lịch sử đơn đã thanh toán, không đồng nghĩa với quyền xem báo cáo.

## 7. Open decisions — không được tự giả định

- Điều kiện trạng thái cụ thể để Bếp hủy món.
- Có cho phép chuyển Đã hoàn thành về trạng thái trước đó không.
- Hình thức xuất/in/tải hóa đơn.
- Giữ nhãn kiểm kê đầu ngày/cuối ngày hay dùng các lần kiểm kê độc lập.
- Quy tắc quy đổi đơn vị.
- Danh sách phương thức thanh toán.
- Quy trình điều chỉnh sau khi payment đã xác nhận.

## 8. Review checklist

- [ ] Các Feature Specs cũ đã đối chiếu tài liệu này.
- [ ] Không còn yêu cầu bắt buộc Order Staff xác nhận mọi đơn.
- [ ] Không còn trạng thái Bị từ chối/REJECTED.
- [ ] Không còn tự động khóa món do tồn kho thấp.
- [ ] Không còn tự động trừ kho hoặc recipe/định mức trong MVP.
- [ ] Quyền sửa/hủy/gọi thêm đúng ma trận.
- [ ] Payment loại trừ item Đã hủy và khóa đơn sau xác nhận.
- [ ] Các điểm chưa quyết định được giữ ở trạng thái Open.
