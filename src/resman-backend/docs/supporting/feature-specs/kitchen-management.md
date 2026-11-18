# Kitchen Management Feature Specification

> **Trạng thái:** Draft — đã đối chiếu Confirmed Business Rules  
> **Nguồn nghiệp vụ chuẩn:** `docs/11-confirmed-business-rules.md`

## F-KIT-01 — Hàng đợi bếp chung

### Goal
Cho phép Nhân viên Bếp xem tất cả món đang chờ tiếp nhận hoặc đang được xử lý.

### Business Rules
- MVP chỉ có một hàng đợi bếp chung.
- Không có Kitchen Station, stationId, station routing hoặc kitchen ticket theo station.
- Một order không bị giới hạn vào một station; không tách order theo khu vực bếp.
- Danh sách món hiển thị tối thiểu: bàn, số thứ tự, tên món, số lượng, trạng thái, giá và ghi chú.

### Acceptance Criteria
- [ ] Bếp xem được món thuộc các bàn/phiên đang hoạt động.
- [ ] Phân biệt được món theo bàn và order item.
- [ ] Hiển thị tên món, số lượng, trạng thái, giá và ghi chú.
- [ ] Tất cả món được quản lý trong cùng một hàng đợi chung.

## F-KIT-02 — Cập nhật trạng thái món

### Trạng thái chuẩn
`AWAITING_ACCEPTANCE → ACCEPTED → IN_PREPARATION → COMPLETED`

Bếp có thể chuyển `IN_PREPARATION → ACCEPTED`. `CANCELLED` là nhánh kết thúc riêng.

### Business Rules
- Trạng thái được quản lý ở cấp order item.
- Không sử dụng `QUEUED`, `PREPARING`, `READY`, `SERVED` hoặc `REJECTED` như trạng thái nghiệp vụ hiện hành.
- Bếp có thao tác hủy món; điều kiện trạng thái cụ thể được phép hủy và yêu cầu lý do vẫn cần được quyết định.
- Không mặc định cho phép chuyển `COMPLETED` về trạng thái trước đó.
- Mọi thay đổi trạng thái phải lưu lịch sử, actor và thời điểm.

### Acceptance Criteria
- [ ] Bếp tiếp nhận món: `AWAITING_ACCEPTANCE → ACCEPTED`.
- [ ] Bếp bắt đầu chế biến: `ACCEPTED → IN_PREPARATION`.
- [ ] Bếp hoàn thành món: `IN_PREPARATION → COMPLETED`.
- [ ] Bếp có thể chuyển `IN_PREPARATION → ACCEPTED`.
- [ ] Có thao tác hủy món, nhưng implementation phải chờ ma trận trạng thái hủy được duyệt.
- [ ] Không có trạng thái/hành động từ chối món.

## Open Decisions
- Bếp được phép hủy món ở những trạng thái nào? Có được hủy sau khi bắt đầu chế biến không?
- Có cho phép chuyển món `COMPLETED` về trạng thái trước đó không?

## Review Gate
`Draft — Awaiting Review`
