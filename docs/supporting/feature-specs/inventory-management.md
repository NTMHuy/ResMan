# Inventory Management Feature Specification

> **Trạng thái:** Draft — đã đối chiếu Confirmed Business Rules  
> **Nguồn nghiệp vụ chuẩn:** `docs/11-confirmed-business-rules.md`

## F-INV-01 — Theo dõi nguyên liệu và tồn kho

### Goal
Cho phép Nhân viên Kho theo dõi thông tin nguyên liệu và số dư tồn hiện tại.

### Information
- Tên nguyên liệu.
- Nhóm/danh mục.
- Đơn vị.
- Số lượng tồn hiện tại.
- Ngưỡng cảnh báo tồn thấp.
- Ghi chú.

### Acceptance Criteria
- [ ] Xem được danh sách nguyên liệu và số dư hiện tại.
- [ ] Xem được đơn vị và ngưỡng cảnh báo.
- [ ] Xem được lịch sử nhập, điều chỉnh và kiểm kê.

## F-INV-02 — Nhập kho và điều chỉnh tồn

### Main Flow
1. Chọn nguyên liệu.
2. Nhập số lượng và đơn vị.
3. Thêm ghi chú nếu cần.
4. Xác nhận thao tác.
5. Hệ thống cập nhật số dư và tạo stock movement.

### Business Rules
- Mỗi stock movement lưu loại giao dịch, lượng thay đổi, người thực hiện, thời điểm và ghi chú/lý do.
- Điều chỉnh tồn không được ghi đè hoặc xóa lịch sử cũ.
- Cập nhật số dư và tạo movement phải nằm trong cùng transaction.

### Acceptance Criteria
- [ ] Nhập kho làm tăng số dư nguyên liệu.
- [ ] Điều chỉnh tồn tạo lịch sử riêng.
- [ ] Có thể xác định actor, timestamp và lượng chênh lệch.

## F-INV-03 — Kiểm kê linh hoạt

### Main Flow
1. Nhân viên Kho chọn nguyên liệu.
2. Ghi số lượng thực tế tại thời điểm kiểm kê.
3. Xác nhận và lưu bản ghi.
4. Hệ thống đối chiếu số thực tế với số dư đang ghi nhận.
5. Nếu cần điều chỉnh số dư, tạo movement điều chỉnh có lịch sử.

### Business Rules
- Kiểm kê có thể thực hiện bất cứ khi nào cần.
- Mỗi lần kiểm kê là một bản ghi độc lập, lưu actual quantity, counted_at, actor và note.
- Không bắt buộc phân loại đầu ngày/cuối ngày.
- Stock-in/adjustment được lưu trong stock movements riêng.
- Không suy diễn lượng tiêu thụ chính xác từ chênh lệch kiểm kê.

### Acceptance Criteria
- [ ] Có thể tạo kiểm kê khi cần.
- [ ] Lưu số lượng thực tế, người kiểm kê và thời điểm.
- [ ] Có thể so sánh số thực tế với số dư hệ thống.
- [ ] Điều chỉnh số dư (nếu có) tạo movement riêng.

## F-INV-04 — Cảnh báo tồn thấp

### Business Rules
- Quản lý hoặc Nhân viên Kho có thể thiết lập ngưỡng tồn thấp.
- Khi số dư thấp hơn ngưỡng, hệ thống tạo/hiển thị cảnh báo cho Nhân viên Kho.
- Tồn thấp không tự động khóa món hoặc thay đổi menu availability.
- Không tự động trừ kho khi bán món.
- Không có recipe/ingredient mapping, nhà cung cấp hoặc đơn mua hàng trong MVP.

### Acceptance Criteria
- [ ] Hệ thống xác định được nguyên liệu dưới ngưỡng.
- [ ] Cảnh báo gắn với đúng nguyên liệu.
- [ ] Cảnh báo tồn thấp chỉ hiển thị cho Nhân viên Kho.
- [ ] Không tự động thay đổi trạng thái menu.

## Open Decisions
- Quy tắc quy đổi khi đơn vị nhập khác đơn vị chuẩn.
- Có cho phép số dư tồn âm hay không.
- Cách phân loại/lý do khi kiểm kê có chênh lệch.

## Review Gate
`Draft — Awaiting Review`
