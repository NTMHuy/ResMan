# Payment Feature Specification

> **Trạng thái:** Draft — đã đối chiếu Confirmed Business Rules  
> **Nguồn nghiệp vụ chuẩn:** `docs/11-confirmed-business-rules.md`

## F-PAY-01 — Xác nhận thanh toán

### Goal
Cho phép Nhân viên Order ghi nhận thanh toán sau khi đã nhận đủ tiền từ khách và đóng phiên bàn đúng quy tắc.

### Preconditions
- Order thuộc một phiên bàn đang hoạt động.
- Order chưa có payment.
- Không còn order item ở trạng thái `AWAITING_ACCEPTANCE`.

### Main Flow
1. Khách liên hệ Nhân viên Order để yêu cầu thanh toán.
2. Nhân viên kiểm tra bảng tổng kết do backend tính.
3. Nhân viên nhận đủ tiền từ khách.
4. Nhân viên xác nhận thanh toán trên hệ thống.
5. Backend kiểm tra lại trạng thái từng item và tính tổng tiền từ snapshot giá/số lượng.
6. Backend tạo một payment, lưu người xác nhận và thời điểm, đóng phiên bàn và đưa bàn về `AVAILABLE` trong cùng transaction.

### Business Rules — Payment gate phương án B
- Một order có tối đa một payment; không hỗ trợ split payment hoặc nhiều lần thanh toán.
- Khách yêu cầu thanh toán và nhân viên xác nhận payment là hai hành động khác nhau.
- Nhân viên phải nhận đủ tiền trước khi xác nhận trên hệ thống.
- Không được xác nhận payment nếu còn bất kỳ item `AWAITING_ACCEPTANCE`.
- Được phép xác nhận payment khi các item còn lại ở `ACCEPTED`, `IN_PREPARATION`, `COMPLETED` hoặc `CANCELLED`. Vì vậy `IN_PREPARATION` không chặn thanh toán.
- Tính tiền item `ACCEPTED`, `IN_PREPARATION`, `COMPLETED`.
- Loại `AWAITING_ACCEPTANCE` và `CANCELLED` khỏi tổng tiền.
- Backend tự tính số tiền; không tin tổng tiền do client gửi.
- Tạo payment, ghi actor/time, đóng session và cập nhật bàn phải nguyên tử.
- Sau payment, order và item không được sửa qua API vận hành thông thường.

### Acceptance Criteria
- [ ] Chỉ Order Staff hoặc Manager xác nhận payment.
- [ ] Một order không thể có payment thứ hai.
- [ ] Item `AWAITING_ACCEPTANCE` làm payment bị chặn.
- [ ] Item `IN_PREPARATION` không làm payment bị chặn.
- [ ] Item `CANCELLED` không được tính tiền.
- [ ] Backend tính tổng tiền từ dữ liệu đã lưu.
- [ ] Lưu người xác nhận và thời điểm.
- [ ] Xác nhận thành công đóng session và đưa bàn về `AVAILABLE`.

## Open Decisions
- Danh sách phương thức thanh toán trong MVP.
- Hình thức kết quả thanh toán: màn hình tổng kết, in, tải hoặc xuất tệp.
- Có cần quy trình điều chỉnh/refund riêng sau khi order đã thanh toán hay không.

## Review Gate
`Draft — Awaiting Review`
