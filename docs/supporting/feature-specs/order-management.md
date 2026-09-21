# Order Management Feature Specification

> **Provenance**
>
> - **Source prompt:** 3.5 Feature Specification từ User Stories & Acceptance Criteria
> - **Artifact status:** `Draft - Awaiting Review`

## F-ORD-01 — Tiếp nhận Đơn hàng

### Goal

Cho phép Nhân viên Order tiếp nhận và kiểm tra đơn hàng từ Khách hàng.

### Preconditions

- Customer đã tạo đơn.

### Main Flow

1. Nhân viên Order xem danh sách đơn mới.
2. Chọn một đơn.
3. Kiểm tra thông tin đơn.
4. Xác nhận tiếp nhận đơn.
5. Đơn được đưa vào quy trình xử lý.

### Business Rules

- Mỗi đơn phải có mã đơn.
- Đơn phải chứa danh sách món và số lượng.
- Nhân viên cần phân biệt được các đơn khác nhau.

### Acceptance Criteria

- [ ] Nhân viên Order xem được đơn mới.
- [ ] Xem được món và số lượng.
- [ ] Xem được thông tin cần thiết để xử lý đơn.
- [ ] Có thể xác nhận tiếp nhận đơn.

### Traceability

- User Story: US-ORD-01
- Requirement: PR-02

### Dependency

- F-CUS-02

---

## F-ORD-02 — Quản lý Vòng đời Đơn

### Goal

Cho phép Nhân viên Order quản lý trạng thái đơn hàng.

### Preconditions

- Đơn hàng đã được tiếp nhận.

### Main Flow

1. Nhân viên Order mở đơn.
2. Xem trạng thái hiện tại.
3. Cập nhật trạng thái theo quy trình.
4. Hệ thống ghi nhận trạng thái mới.
5. Thông tin được sử dụng bởi các bộ phận liên quan.

### Business Rules

Trạng thái đề xuất:

`Pending → Confirmed → Sent to Kitchen → Completed`

Ngoài ra đơn có thể chuyển sang:

`Cancelled`

Không được chuyển trạng thái từ:

- Completed
- Cancelled

Mọi cập nhật trạng thái phải được ghi nhận.

### Information

- Mã đơn
- Trạng thái
- Thời điểm cập nhật
- Người cập nhật

### Acceptance Criteria

- [ ] Đơn có trạng thái hiện tại.
- [ ] Trạng thái được cập nhật theo flow hợp lệ.
- [ ] Không thể chuyển từ Completed/Cancelled sang trạng thái khác.
- [ ] Mọi thay đổi trạng thái được ghi nhận.

### Traceability

- User Story: US-ORD-02
- Requirement: PR-02

### Dependencies

- F-ORD-01

---

## F-ORD-03 — Theo dõi Đơn đang xử lý

### Goal

Cho phép Nhân viên Order theo dõi các đơn đang được xử lý.

### Main Flow

1. Nhân viên mở danh sách đơn.
2. Hệ thống hiển thị các đơn đang xử lý.
3. Nhân viên xem trạng thái từng đơn.
4. Thông tin được cập nhật khi trạng thái thay đổi.

### Acceptance Criteria

- [ ] Xem được danh sách đơn đang xử lý.
- [ ] Xem được trạng thái từng đơn.
- [ ] Có thể phân biệt từng đơn.
- [ ] Trạng thái phản ánh tiến trình hiện tại.

### Traceability

- User Story: US-ORD-03
- Requirement: PR-02, PR-08

### Dependencies

- F-ORD-02
- F-KIT-02

---

## ❓ Open Questions

- Có cần trạng thái `Preparing` riêng giữa Confirmed và Sent to Kitchen không?
- Khi nào chính xác Order được chuyển sang Kitchen?
- Ai có quyền Cancel Order?

## 📋 Review Checklist

- [ ] Order Lifecycle được xác nhận.
- [ ] Quy tắc chuyển trạng thái được xác nhận.
- [ ] Quyền cập nhật trạng thái được xác nhận.

## Review Gate

`Draft - Awaiting Review`
