# Feature Specifications

> **Provenance**
>
> - **Source prompt:** 3.5 Feature Specification từ User Stories & Acceptance Criteria
> - **Artifact status:** `Draft - Awaiting Review`

## 1. Mục đích

Thư mục này chứa đặc tả chi tiết cho các tính năng chính của Hệ thống Quản lý Nhà hàng.

Feature Specification được xây dựng trực tiếp từ:

- Product Requirements Document (PRD)
- Requirement Analysis
- User Stories
- Acceptance Criteria

Mục tiêu là mô tả rõ:

- Feature làm gì
- Ai sử dụng
- Điều kiện trước khi thực hiện
- Luồng xử lý chính
- Business Rules
- Thông tin liên quan
- Acceptance Criteria
- Dependencies
- Traceability

Feature Specification không bao gồm thiết kế kỹ thuật, database schema, API hoặc source code.

---

## 2. Cấu trúc Feature

### Customer Management

- F-CUS-01 — Xem Menu
- F-CUS-02 — Tạo Đơn hàng
- F-CUS-03 — Theo dõi Đơn hàng

### Order Management

- F-ORD-01 — Tiếp nhận Đơn hàng
- F-ORD-02 — Quản lý Vòng đời Đơn
- F-ORD-03 — Theo dõi Đơn đang xử lý

### Kitchen Management

- F-KIT-01 — Danh sách món cần chế biến
- F-KIT-02 — Cập nhật trạng thái chế biến
- F-KIT-03 — Tiếp nhận món từ đơn hàng

### Inventory Management

- F-INV-01 — Theo dõi tồn kho
- F-INV-02 — Cập nhật tồn kho
- F-INV-03 — Cảnh báo tồn kho thấp

### Staff Management

- F-MGR-03 — Quản lý nhân viên & vai trò

### Reporting

- F-MGR-01 — Giám sát vận hành
- F-MGR-02 — Báo cáo vận hành

### Payment

- F-PAY-01 — Ghi nhận thanh toán

---

## 3. Traceability Matrix

| Feature ID | Feature                      | User Story | Requirement  |
| ---------- | ---------------------------- | ---------- | ------------ |
| F-CUS-01   | Xem Menu                     | US-CUS-01  | PR-01        |
| F-CUS-02   | Tạo Đơn hàng                 | US-CUS-02  | PR-02        |
| F-CUS-03   | Theo dõi Đơn hàng            | US-CUS-03  | PR-03, PR-08 |
| F-ORD-01   | Tiếp nhận Đơn hàng           | US-ORD-01  | PR-02        |
| F-ORD-02   | Quản lý Vòng đời Đơn         | US-ORD-02  | PR-02        |
| F-ORD-03   | Theo dõi Đơn đang xử lý      | US-ORD-03  | PR-02, PR-08 |
| F-KIT-01   | Danh sách món cần chế biến   | US-KIT-01  | PR-03        |
| F-KIT-02   | Cập nhật trạng thái chế biến | US-KIT-02  | PR-03, PR-08 |
| F-KIT-03   | Tiếp nhận món từ đơn hàng    | US-KIT-03  | PR-04        |
| F-INV-01   | Theo dõi tồn kho             | US-INV-01  | PR-05        |
| F-INV-02   | Cập nhật tồn kho             | US-INV-02  | PR-05        |
| F-INV-03   | Cảnh báo tồn kho thấp        | US-INV-03  | PR-05        |
| F-MGR-01   | Giám sát vận hành            | US-MGR-01  | PR-08        |
| F-MGR-02   | Báo cáo vận hành             | US-MGR-02  | PR-07        |
| F-MGR-03   | Quản lý nhân viên & vai trò  | US-MGR-03  | PR-06        |
| F-PAY-01   | Ghi nhận thanh toán          | US-PAY-01  | Payment\*    |

> `*` Payment là đề xuất từ User Stories vì Requirement Analysis hiện chưa có PR-PAY riêng.

---

## 4. Cross-Feature Dependencies

| Feature  | Depends On       | Used By            |
| -------- | ---------------- | ------------------ |
| F-CUS-01 | -                | F-CUS-02           |
| F-CUS-02 | F-CUS-01         | F-ORD-01           |
| F-ORD-01 | F-CUS-02         | F-ORD-02, F-KIT-03 |
| F-ORD-02 | F-ORD-01         | F-ORD-03, F-KIT-01 |
| F-KIT-03 | F-ORD-01         | F-KIT-02           |
| F-KIT-02 | F-KIT-03         | F-CUS-03, F-ORD-03 |
| F-INV-01 | -                | F-INV-03, F-MGR-02 |
| F-INV-02 | F-INV-01         | F-INV-01           |
| F-MGR-02 | Order, Inventory | Manager            |
| F-MGR-03 | -                | Role-based access  |
| F-PAY-01 | Order            | Manager/Reporting  |

---

## 5. Open Questions

- Trạng thái đầy đủ của Order Lifecycle là gì?
- Khi nào Order được chuyển sang Kitchen?
- Kitchen có những trạng thái chế biến nào?
- Quan hệ giữa Menu và Inventory có cần quản lý theo Recipe/Ingredient không?
- Mức quyền cụ thể của từng Staff Role là gì?
- Reporting cần những KPI nào?
- Các phương thức thanh toán được hỗ trợ?
- Có quản lý bàn hay không?
- Có hỗ trợ Takeaway hay không?
- Customer có bắt buộc phải có tài khoản hay không?

---

## 6. Fact / Decision / Assumption

### Fact

- Feature Specification được xây dựng từ User Stories và Acceptance Criteria.
- Hệ thống có 5 vai trò chính.
- Feature được tổ chức theo các module quản lý chính.

### Decision

- 3.4 User Stories là đầu vào của 3.5.
- Không đưa thiết kế kỹ thuật vào Feature Specification.
- Không mở rộng scope ngoài phạm vi đã xác định.

### Assumption

- Một số business rules vẫn cần xác nhận.
- Payment chưa có requirement ID riêng trong Requirement Analysis.
- Một số dependency cần được xác nhận ở mức nghiệp vụ.

---

## 📋 Review Checklist

- [ ] Tất cả User Stories đã được chuyển thành Feature.
- [ ] Acceptance Criteria được phản ánh đầy đủ.
- [ ] Feature không mở rộng scope.
- [ ] Business Rules cần được con người xác nhận.
- [ ] Dependencies đã được kiểm tra.
- [ ] Traceability từ Requirement → User Story → Feature chính xác.
- [ ] Các Open Questions đã được xem xét.
- [ ] Không có thiết kế kỹ thuật ngoài phạm vi.

## Review Gate

Artifact này đang ở trạng thái:

`Draft - Awaiting Review`

Chỉ chuyển sang `Approved` sau khi có xác nhận của người quyết định dự án.
