# User Stories — Kitchen Staff

> **Role:** Nhân viên Bếp
> **Source:** PRD 3.2 + Requirement Analysis 3.3
> **Artifact status:** `Approved`

---

## US-KIT-01 — Nhận danh sách món cần chế biến

**Traceability:** PR-03  
**Priority:** Must

> **As a** Nhân viên Bếp  
> **I want** xem các món cần chế biến  
> **So that** tôi biết những món cần chuẩn bị.

### Acceptance Criteria

- [ ] Bếp có thể xem các món được gửi đến để chế biến.
- [ ] Mỗi món được liên kết với đơn hàng tương ứng.
- [ ] Hiển thị tối thiểu tên món và số lượng.
- [ ] Món đã hoàn thành không tiếp tục được hiển thị như món chưa xử lý.
- [ ] Các món thuộc những đơn khác nhau được phân biệt rõ.

---

## US-KIT-02 — Cập nhật trạng thái chế biến

**Traceability:** PR-03, PR-08  
**Priority:** Must

> **As a** Nhân viên Bếp  
> **I want** cập nhật trạng thái chế biến món  
> **So that** nhân viên Order và khách hàng có thể theo dõi tiến độ.

### Acceptance Criteria

- [ ] Nhân viên Bếp có thể cập nhật trạng thái món.
- [ ] Chỉ cho phép chuyển sang trạng thái hợp lệ.
- [ ] Trạng thái món được liên kết đúng với đơn hàng.
- [ ] Khi món hoàn thành, trạng thái mới được phản ánh tới các bộ phận liên quan.
- [ ] Không thể chuyển món đã hoàn thành về trạng thái trước đó nếu quy trình không cho phép.

> **OPEN:** Kitchen State Flow chưa được chốt.
>
> AI Proposal:
>
> `Pending → Cooking → Completed`

---

## US-KIT-03 — Tiếp nhận và xử lý món từ đơn hàng

**Traceability:** PR-04  
**Priority:** Must

> **As a** Nhân viên Bếp  
> **I want** tiếp nhận và xử lý các món từ đơn hàng được gửi đến  
> **So that** tôi biết chính xác cần chế biến món gì và cho đơn hàng nào.

### Acceptance Criteria

- [ ] Bếp nhận được danh sách món từ đơn hàng do quy trình Order gửi đến.
- [ ] Mỗi món hiển thị tối thiểu: tên món, số lượng và ghi chú đặc biệt nếu có.
- [ ] Mỗi món được xác định rõ thuộc đơn hàng nào.
- [ ] Bếp có thể xác nhận đã nhận món.
- [ ] Món đã nhận không biến mất khỏi danh sách trước khi hoàn thành.
- [ ] Các món thuộc những đơn hàng khác nhau được phân biệt rõ ràng.
- [ ] Thông tin món không bị thay đổi ngoài ý muốn trong quá trình tiếp nhận.
