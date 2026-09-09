# 3.4 User Stories & Acceptance Criteria

> **Provenance**
>
> - **Source:** PRD 3.2 + Requirement Analysis 3.3
> - **Artifact status:** `Approved`
> - **Revision:** `R2`
> - **Scope:** 5 roles của hệ thống quản lý nhà hàng
>
> **Note:** Nội dung này được xây dựng từ PRD 3.2 và Requirement Analysis 3.3 đã chốt. Các điểm chưa được xác nhận vẫn được đánh dấu `ASSUMPTION`, `OPEN` hoặc `AI PROPOSAL`.

---

## 1. Mục tiêu

Chuyển các requirement đã xác định trong PRD 3.2 và Requirement Analysis 3.3 thành User Stories có:

- Actor rõ ràng
- Business goal rõ ràng
- Acceptance Criteria có thể kiểm chứng
- Priority/MoSCoW
- Traceability về `PR-xx`
- Phân biệt Fact / Decision / Assumption
- Không mở rộng scope ngoài 5 roles đã chốt

---

## 2. Cấu trúc User Stories

| File                 | Role            |
| -------------------- | --------------- |
| `customer.md`        | Khách hàng      |
| `order-staff.md`     | Nhân viên Order |
| `kitchen-staff.md`   | Nhân viên Bếp   |
| `inventory-staff.md` | Nhân viên Kho   |
| `manager.md`         | Quản lý         |

---

## 3. Story Coverage

| Requirement | User Stories                               | Priority |
| ----------- | ------------------------------------------ | -------- |
| PR-01       | US-CUS-01                                  | Must     |
| PR-02       | US-CUS-02, US-ORD-01, US-ORD-02, US-ORD-03 | Must     |
| PR-03       | US-CUS-03, US-KIT-01, US-KIT-02            | Must     |
| PR-04       | US-KIT-03                                  | Must     |
| PR-05       | US-INV-01, US-INV-02, US-INV-03            | Must     |
| PR-06       | US-MGR-03                                  | Should   |
| PR-07       | US-MGR-02                                  | Should   |
| PR-08       | US-CUS-03, US-ORD-03, US-KIT-02, US-MGR-01 | Must     |
| Payment     | US-PAY-01                                  | Should\* |

> `*` Payment là Core Product Area trong PRD nhưng chưa có requirement ID riêng trong Requirement Analysis 3.3. Vì vậy `US-PAY-01` cần được xem là proposal cho đến khi scope được xác nhận.

---

## 4. Traceability Matrix

| Story ID  | Role      | Requirement   | Priority | AC  | Status   |
| --------- | --------- | ------------- | -------- | --- | -------- |
| US-CUS-01 | Customer  | PR-01         | Must     | ✓   | Approved |
| US-CUS-02 | Customer  | PR-02         | Must     | ✓   | Approved |
| US-CUS-03 | Customer  | PR-03, PR-08  | Must     | ✓   | Approved |
| US-ORD-01 | Order     | PR-02         | Must     | ✓   | Approved |
| US-ORD-02 | Order     | PR-02         | Must     | ✓   | Approved |
| US-ORD-03 | Order     | PR-02, PR-08  | Must     | ✓   | Approved |
| US-KIT-01 | Kitchen   | PR-03         | Must     | ✓   | Approved |
| US-KIT-02 | Kitchen   | PR-03, PR-08  | Must     | ✓   | Approved |
| US-KIT-03 | Kitchen   | PR-04         | Must     | ✓   | Approved |
| US-INV-01 | Inventory | PR-05         | Must     | ✓   | Approved |
| US-INV-02 | Inventory | PR-05         | Must     | ✓   | Approved |
| US-INV-03 | Inventory | PR-05         | Must     | ✓   | Approved |
| US-MGR-01 | Manager   | PR-08         | Must     | ✓   | Approved |
| US-MGR-02 | Manager   | PR-07         | Should   | ✓   | Approved |
| US-MGR-03 | Manager   | PR-06         | Should   | ✓   | Approved |
| US-PAY-01 | Order     | Payment / PRD | Should\* | ✓   | Proposal |

---

## 5. Requirement Coverage

### Core PR Coverage

- PR-01: Covered
- PR-02: Covered
- PR-03: Covered
- PR-04: Covered
- PR-05: Covered
- PR-06: Covered
- PR-07: Covered
- PR-08: Covered

**Coverage: 8/8 PR có User Story.**

### Payment

Payment được PRD xác định là một Core Product Area nhưng chưa có `PR-PAY` riêng trong Requirement Analysis 3.3.

Do đó:

`US-PAY-01 = AI Proposal / Scope Decision Required`

---

## 6. Open Questions

### OQ-01 — Order State Flow

Có chấp nhận flow:

`Pending → Confirmed → Sent to Kitchen → Completed`

hay cần thay đổi?

### OQ-02 — Kitchen State Flow

Có chấp nhận:

`Pending → Cooking → Completed`

hay cần thêm trạng thái?

### OQ-03 — Payment Scope

Payment có thuộc release hiện tại không?

### OQ-04 — Payment Method

Nếu có Payment, phương thức thanh toán nào được hỗ trợ?

### OQ-05 — Reporting KPI

Các KPI chính thức cho PR-07 là gì?

### OQ-06 — Staff Permission

Quyền của từng role cần được xác định ở mức nào?

### OQ-07 — Table / Takeaway

Có cần thể hiện bàn hoặc takeaway trong User Stories không?

### OQ-08 — Reporting Export

CSV/PDF có thuộc phạm vi PR-07 không?

---

## 7. Fact / Decision / Assumption

### FACT

- Hệ thống có 5 roles.
- PRD 3.2 đã được Approved.
- Requirement Analysis 3.3 đã được Approved.
- PR-01 đến PR-08 là baseline requirements.
- PR-04 là Must Have.
- Payment xuất hiện trong PRD dưới Core Product Areas.
- Advanced payment gateway nằm ngoài initial scope.

### DECISION

- User Stories được tổ chức theo 5 roles.
- Repository giữ nguyên cấu trúc hiện tại.
- Không mở rộng hệ thống ngoài 5 roles.
- Revision 2 là baseline của User Stories sau khi được human approval.

### ASSUMPTION / AI PROPOSAL

- Order State Flow.
- Kitchen State Flow.
- Reporting KPI cụ thể.
- Payment priority và payment actor.
- Payment methods.
- CSV/PDF export.
- Menu search/filter.

---

## 8. Review Gate

### Artifact Status

`Approved`

### Human Approval

Revision 2 đã được con người chốt làm baseline cho giai đoạn tiếp theo.

### Điều kiện khi thay đổi

Nếu các Open Questions làm thay đổi requirement hoặc business rule, cần cập nhật User Stories và tạo revision mới thay vì sửa âm thầm artifact hiện tại.
