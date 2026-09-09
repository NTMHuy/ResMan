# Requirement Analysis Checklist

> **Provenance**
>
> - **Source:** Chapter 3 — Requirements & Product Analysis
> - **Artifact status:** `Draft - Awaiting Review`
> - **Date:** 2026-09-09

---

## 1. Product Discovery

- [x] Problem đã được xác định rõ.
- [x] Target users đã được xác định.
- [x] Product goals đã được xác định.
- [x] Evidence được phân biệt với Assumption.
- [x] Market / competitor research có nguồn tham khảo.
- [x] Các insight từ research không tự động trở thành requirement.
- [x] Product scope không vượt quá phạm vi dự án.

---

## 2. PRD

- [x] Product Vision rõ ràng.
- [x] Problem Statement rõ ràng.
- [x] Goals được xác định.
- [x] 5 user roles được bao phủ:
  - [x] Customer
  - [x] Order Staff
  - [x] Kitchen Staff
  - [x] Inventory Staff
  - [x] Manager
- [x] Functional scope được xác định.
- [x] Out-of-Scope được xác định.
- [x] Open Questions được ghi nhận.
- [x] Assumptions được ghi nhận.
- [x] AI meal recommendation không nằm trong core scope.

---

## 3. Functional Requirements

- [x] Requirement có ID.
- [x] Requirement có mô tả rõ.
- [x] Requirement có source/traceability.
- [x] Requirement có actor phù hợp.
- [x] Requirement có priority.
- [x] Không tự thêm requirement ngoài scope.
- [x] Implicit Requirements được đánh dấu rõ.
- [x] Requirement chưa xác nhận không được ghi thành Decision.

---

## 4. Non-Functional / Quality

- [x] Accuracy được xem xét.
- [x] Reliability được xem xét.
- [x] Usability được xem xét.
- [x] Performance được xem xét.
- [x] Security được xem xét.
- [x] Consistency được xem xét.
- [x] Timeliness được xem xét.
- [x] Completeness được xem xét.
- [x] Không tự đặt numerical target nếu chưa có evidence.

---

## 5. MoSCoW Prioritization

- [x] Must requirements được xác định.
- [x] Should requirements được xác định.
- [x] Could requirements được xem xét.
- [x] Won't requirements được xác định.
- [x] Priority có lý do.
- [ ] Priority cuối cùng được Human Review.

---

## 6. Risk & Assumptions

- [x] Requirement risks được xác định.
- [x] Riskiest assumptions được xác định.
- [x] Impact được đánh giá.
- [x] Assumptions chưa được xác nhận vẫn giữ trạng thái Assumption.

---

## 7. Dependencies

- [x] Requirement dependencies được xác định.
- [x] Dependency direction được kiểm tra.
- [x] Circular dependency được phát hiện nếu có.
- [x] Circular dependency không được tự động sửa nếu chưa có business decision.

---

## 8. Gap Analysis

- [x] Missing information được xác định.
- [x] Unclear workflow được xác định.
- [x] Missing business rules được xác định.
- [x] Permission gaps được xác định.
- [x] Reporting KPI gaps được xác định.
- [x] Payment gaps được xác định.
- [x] Table / Takeaway gaps được xác định.

---

## 9. User Stories

- [x] Mỗi requirement quan trọng có User Story.
- [x] User Story xác định đúng actor.
- [x] User Story thể hiện goal.
- [x] User Story thể hiện value.
- [x] User Story có traceability.
- [x] Acceptance Criteria cụ thể.
- [x] Acceptance Criteria có thể kiểm tra.
- [x] Edge cases được xem xét.

---

## 10. Feature Specification

- [ ] Mỗi User Story quan trọng được chuyển thành Feature.
- [ ] Feature có Goal.
- [ ] Feature có Preconditions.
- [ ] Feature có Main Flow.
- [ ] Feature có Business Rules.
- [ ] Feature có Information.
- [ ] Feature có Acceptance Criteria.
- [ ] Feature có Dependencies.
- [ ] Feature có Traceability.
- [ ] Feature có Open Questions.
- [ ] Không đưa API/Database/Code vào Feature Specification.

---

## 11. Traceability

Kiểm tra chuỗi:

$$\text{Evidence} \longrightarrow \text{Product Discovery} \longrightarrow \text{PRD} \longrightarrow \text{Requirement} \longrightarrow \text{User Story} \longrightarrow \text{Acceptance Criteria} \longrightarrow \text{Feature Specification}$$

- [x] Không có requirement quan trọng bị mất traceability.
- [x] Không có User Story không có source.
- [ ] Không có Feature không có User Story.
- [x] Traceability Matrix được kiểm tra.

---

## 12. Human Review

- [x] Fact được phân biệt với Decision.
- [ ] Decision được xác nhận bởi người có thẩm quyền.
- [x] Assumption được ghi nhận.
- [x] Open Questions được xem xét.
- [ ] Scope được Human Review.
- [ ] Business Rules được Human Review.
- [ ] Priority được Human Review.
- [ ] Acceptance Criteria được Human Review.
