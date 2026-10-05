# User Stories — Customer

> **Role:** Khách hàng
> **Source:** PRD 3.2 + Requirement Analysis 3.3
> **Artifact status:** `Approved`

---

## US-CUS-01 — Xem menu

**Traceability:** PR-01  
**Priority:** Must

> **As a** Khách hàng  
> **I want** xem danh sách món ăn  
> **So that** tôi có thể lựa chọn món phù hợp trước khi đặt hàng.

### Acceptance Criteria

- [ ] Hiển thị danh sách các món đang được cung cấp.
- [ ] Mỗi món hiển thị tối thiểu: tên món, giá, mô tả ngắn và trạng thái.
- [ ] Có thể phân biệt món đang còn và món hết.
- [ ] Khách hàng có thể xem món theo danh mục.
- [ ] Khách hàng có thể tìm kiếm món theo tên.

> **ASSUMPTION:** Tìm kiếm và lọc theo danh mục là đề xuất cụ thể hóa trải nghiệm xem menu; cần xác nhận có thuộc PR-01 hay không.

---

## US-CUS-02 — Tạo đơn hàng

**Traceability:** PR-02  
**Priority:** Must

> **As a** Khách hàng  
> **I want** chọn món và tạo đơn hàng  
> **So that** yêu cầu gọi món của tôi được tiếp nhận.

### Acceptance Criteria

- [ ] Khách hàng có thể chọn một hoặc nhiều món.
- [ ] Mỗi món trong đơn có số lượng tương ứng.
- [ ] Khách hàng có thể kiểm tra lại nội dung đơn trước khi gửi.
- [ ] Đơn hàng được ghi nhận sau khi khách hàng xác nhận.
- [ ] Đơn hàng được chuyển đến quy trình tiếp nhận của nhân viên Order.
- [ ] Hệ thống không tạo nhiều đơn ngoài ý muốn từ cùng một thao tác xác nhận.

---

## US-CUS-03 — Theo dõi trạng thái đơn hàng

**Traceability:** PR-03, PR-08  
**Priority:** Must

> **As a** Khách hàng  
> **I want** theo dõi trạng thái đơn hàng  
> **So that** tôi biết đơn hàng đang được xử lý đến đâu.

### Acceptance Criteria

- [ ] Khách hàng có thể xem trạng thái hiện tại của đơn.
- [ ] Trạng thái được cập nhật khi đơn thay đổi.
- [ ] Thông tin trạng thái phản ánh dữ liệu xử lý của hệ thống.
- [ ] Khách hàng không thể xem trạng thái đơn của khách hàng khác.
- [ ] Đơn đã hoàn thành vẫn có thể được nhận biết là đã hoàn thành.
