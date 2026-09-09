# User Stories — Order Staff

> **Role:** Nhân viên Order
> **Source:** PRD 3.2 + Requirement Analysis 3.3
> **Artifact status:** `Approved`

---

## US-ORD-01 — Tiếp nhận đơn hàng

**Traceability:** PR-02  
**Priority:** Must

> **As a** Nhân viên Order  
> **I want** xem và tiếp nhận đơn hàng mới  
> **So that** yêu cầu của khách hàng được xử lý.

### Acceptance Criteria

- [ ] Nhân viên Order có thể xem các đơn mới.
- [ ] Mỗi đơn hiển thị thông tin cần thiết để tiếp nhận.
- [ ] Nhân viên Order có thể xác nhận tiếp nhận đơn.
- [ ] Đơn đã tiếp nhận được phân biệt với đơn chưa tiếp nhận.
- [ ] Thông tin món và số lượng trong đơn được giữ nguyên khi tiếp nhận.

---

## US-ORD-02 — Quản lý vòng đời đơn hàng

**Traceability:** PR-02  
**Priority:** Must

> **As a** Nhân viên Order  
> **I want** cập nhật trạng thái đơn hàng  
> **So that** các bộ phận liên quan biết tiến độ xử lý đơn.

### Acceptance Criteria

- [ ] Nhân viên Order chỉ có thể chuyển đơn theo các trạng thái hợp lệ.
- [ ] Không cho phép chuyển đơn từ trạng thái kết thúc sang trạng thái xử lý lại nếu quy trình không cho phép.
- [ ] Trạng thái mới được phản ánh cho các bộ phận liên quan.
- [ ] Nội dung đơn không bị mất khi trạng thái thay đổi.
- [ ] Lịch sử thay đổi trạng thái có thể được kiểm tra.

> **OPEN / HUMAN DECISION:** State Flow cụ thể cần được xác nhận.
>
> AI Proposal:
>
> `Pending → Confirmed → Sent to Kitchen → Completed`
>
> Đây chưa phải business rule độc lập ngoài phần đã được chốt.

---

## US-ORD-03 — Theo dõi các đơn đang xử lý

**Traceability:** PR-02, PR-08  
**Priority:** Must

> **As a** Nhân viên Order  
> **I want** xem các đơn đang xử lý  
> **So that** tôi có thể theo dõi tiến độ và phát hiện đơn bị chậm.

### Acceptance Criteria

- [ ] Hiển thị danh sách các đơn đang xử lý.
- [ ] Có thể phân biệt đơn theo trạng thái.
- [ ] Trạng thái được cập nhật khi có thay đổi.
- [ ] Đơn không bị mất khỏi danh sách do thay đổi trạng thái ngoài dự kiến.
- [ ] Có thể xác định đơn tương ứng với khách hàng/đơn hàng đang xử lý.

---

## US-PAY-01 — Ghi nhận thanh toán đơn hàng

**Traceability:** Payment — Core Product Area trong PRD  
**Priority:** Should — AI Proposal

> **As a** Nhân viên Order  
> **I want** ghi nhận thanh toán cho đơn hàng  
> **So that** trạng thái thanh toán của đơn được cập nhật.

### Acceptance Criteria

- [ ] Nhân viên Order có thể ghi nhận thanh toán cho đơn hàng hợp lệ.
- [ ] Phương thức thanh toán được ghi nhận.
- [ ] Số tiền thanh toán được đối chiếu với tổng tiền đơn hàng.
- [ ] Đơn hàng được đánh dấu đã thanh toán sau khi thanh toán hợp lệ.
- [ ] Không thể ghi nhận thanh toán cho đơn chưa đáp ứng điều kiện thanh toán theo quy trình.
- [ ] Không ghi nhận thanh toán trùng cho cùng một giao dịch.

> **SCOPE DECISION REQUIRED**
>
> Payment xuất hiện trong PRD nhưng chưa có requirement ID riêng trong Requirement Analysis 3.3.
>
> Cần xác nhận:
>
> - Payment có thuộc release hiện tại không?
> - Ai thực hiện thanh toán?
> - Phương thức thanh toán nào được hỗ trợ?
> - Chỉ ghi nhận thanh toán hay có tích hợp payment gateway?
>
> Advanced payment gateway đã nằm ngoài initial scope.
