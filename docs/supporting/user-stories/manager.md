# User Stories — Manager

> **Role:** Quản lý
> **Source:** PRD 3.2 + Requirement Analysis 3.3
> **Artifact status:** `Approved`

---

## US-MGR-01 — Theo dõi hoạt động vận hành

**Traceability:** PR-08  
**Priority:** Must

> **As a** Quản lý  
> **I want** xem thông tin tổng quan về hoạt động nhà hàng  
> **So that** tôi có thể giám sát tình hình vận hành.

### Acceptance Criteria

- [ ] Quản lý có thể xem thông tin vận hành trong phạm vi được phép.
- [ ] Thông tin phản ánh dữ liệu từ các hoạt động liên quan.
- [ ] Dữ liệu được cập nhật khi có thay đổi.
- [ ] Thông tin giữa các khu vực không mâu thuẫn.
- [ ] Quản lý không truy cập được dữ liệu ngoài phạm vi quyền được cấp.

---

## US-MGR-02 — Xem báo cáo vận hành

**Traceability:** PR-07  
**Priority:** Should

> **As a** Quản lý  
> **I want** xem các báo cáo vận hành  
> **So that** tôi có cơ sở đánh giá hoạt động nhà hàng.

### Acceptance Criteria

- [ ] Có thể xem báo cáo doanh thu theo khoảng thời gian được chọn.
- [ ] Có thể xem số lượng đơn hàng theo khoảng thời gian.
- [ ] Có thể xem danh sách món bán chạy.
- [ ] Có thể xem thông tin nguyên liệu có tồn kho thấp.
- [ ] Các số liệu trong báo cáo nhất quán với dữ liệu hệ thống.
- [ ] Báo cáo chỉ sử dụng dữ liệu thuộc phạm vi hệ thống đã xác định.

> **OPEN:** Danh sách KPI chính thức chưa được chốt trong G-04.
>
> Các loại báo cáo trên là AI Proposal.
>
> Việc export CSV/PDF cần được xác nhận có thuộc PR-07 hay không.

---

## US-MGR-03 — Quản lý nhân viên và vai trò

**Traceability:** PR-06  
**Priority:** Should

> **As a** Quản lý  
> **I want** quản lý thông tin nhân viên và vai trò  
> **So that** nhân viên được phân công đúng trách nhiệm.

### Acceptance Criteria

- [ ] Quản lý có thể xem thông tin nhân viên.
- [ ] Quản lý có thể quản lý vai trò trong phạm vi được phê duyệt.
- [ ] Mỗi nhân viên được gắn với vai trò phù hợp.
- [ ] Quyền truy cập phải phù hợp với vai trò.
- [ ] Thay đổi vai trò được phản ánh trong quyền sử dụng hệ thống.

> **OPEN:** Chi tiết Staff Permission chưa được chốt (`G-03`).
