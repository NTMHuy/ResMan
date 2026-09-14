# User Stories — Inventory Staff

> **Role:** Nhân viên Kho
> **Source:** PRD 3.2 + Requirement Analysis 3.3
> **Artifact status:** `Approved`

---

## US-INV-01 — Theo dõi tồn kho

**Traceability:** PR-05  
**Priority:** Must

> **As a** Nhân viên Kho  
> **I want** xem tình trạng tồn kho nguyên liệu  
> **So that** tôi biết số lượng nguyên liệu hiện tại.

### Acceptance Criteria

- [ ] Nhân viên Kho có thể xem danh sách nguyên liệu.
- [ ] Mỗi nguyên liệu hiển thị tối thiểu: tên, số lượng tồn và đơn vị.
- [ ] Có thể nhận biết nguyên liệu đang ở mức tồn kho thấp.
- [ ] Số lượng tồn kho được cập nhật khi có biến động.
- [ ] Dữ liệu tồn kho nhất quán với các cập nhật đã được ghi nhận.

---

## US-INV-02 — Cập nhật nhập/xuất tồn kho

**Traceability:** PR-05  
**Priority:** Must

> **As a** Nhân viên Kho  
> **I want** ghi nhận biến động nguyên liệu  
> **So that** số liệu tồn kho phản ánh tình trạng thực tế.

### Acceptance Criteria

- [ ] Nhân viên Kho có thể ghi nhận biến động tồn kho.
- [ ] Hệ thống cập nhật số lượng tương ứng.
- [ ] Không chấp nhận dữ liệu làm phát sinh trạng thái tồn kho không hợp lệ.
- [ ] Thông tin biến động được lưu cùng với dữ liệu liên quan.
- [ ] Số lượng tồn sau cập nhật có thể được kiểm tra.

---

## US-INV-03 — Theo dõi nguyên liệu sắp thiếu

**Traceability:** PR-05  
**Priority:** Must

> **As a** Nhân viên Kho  
> **I want** nhận biết nguyên liệu có tồn kho thấp  
> **So that** tôi có thể chủ động xử lý nguy cơ thiếu nguyên liệu.

### Acceptance Criteria

- [ ] Nguyên liệu dưới mức tồn tối thiểu được nhận biết.
- [ ] Có thể đối chiếu số lượng hiện tại với mức tồn tối thiểu.
- [ ] Trạng thái cảnh báo phản ánh số liệu tồn kho hiện tại.
- [ ] Cảnh báo không làm thay đổi số lượng tồn thực tế.

> **ASSUMPTION:** Mức tồn tối thiểu cụ thể chưa được xác nhận.
