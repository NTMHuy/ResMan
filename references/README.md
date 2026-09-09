# References

> **Provenance**
>
> - **Source prompt:** Reference Management for Chapter 3
> - **Artifact status:** `Draft - Awaiting Review`

## 1. Mục đích

Thư mục này lưu các nguồn tham khảo và context được sử dụng trong quá trình Product Discovery, PRD, Requirement Analysis, User Stories và Feature Specification.

References được sử dụng để:

- Hỗ trợ Product Discovery.
- Kiểm chứng các vấn đề nghiệp vụ.
- Tham khảo workflow nhà hàng.
- So sánh với các hệ thống tương tự.
- Hỗ trợ xác định assumptions và open questions.

References không tự động trở thành Requirements.

---

## 2. Reference Categories

### Industry Standards

Chứa các tiêu chuẩn, nguyên tắc hoặc tài liệu liên quan đến chất lượng phần mềm và hệ thống.

File:

- `industry-standards.md`

### Restaurant Workflow

Chứa context về quy trình nghiệp vụ nhà hàng.

File:

- `restaurant-workflow.md`

### Similar Systems

Chứa thông tin về các hệ thống/giải pháp tương tự dùng cho Product Discovery và competitor analysis.

File:

- `similar-systems.md`

### Useful Links

Chứa các đường dẫn tham khảo được sử dụng trong quá trình nghiên cứu.

File:

- `useful-links.md`

---

## 3. Reference Usage Rules

### Rule 1 — Reference không phải Requirement

Thông tin từ reference chỉ là evidence/context.

Không được tự động chuyển reference thành:

- Functional Requirement
- Business Rule
- Feature
- User Story

Nếu cần đưa vào product scope, phải được Human Review.

### Rule 2 — Phân biệt Evidence và Assumption

Mỗi thông tin cần được phân loại:

- `Fact` — đã được xác nhận.
- `Evidence` — thông tin từ nguồn tham khảo.
- `Assumption` — suy luận/chưa được xác nhận.
- `Decision` — quyết định của nhóm.

### Rule 3 — Traceability

Khi một reference ảnh hưởng đến artifact, cần ghi rõ nguồn hoặc reference liên quan.

Ví dụ:

`Reference → Product Discovery → Requirement → User Story → Feature`

### Rule 4 — Human Validation

AI có thể hỗ trợ tổng hợp reference nhưng con người phải kiểm tra:

- Nguồn có đáng tin cậy không?
- Thông tin có phù hợp với dự án không?
- Thông tin có còn phù hợp với scope hiện tại không?

---

## 4. Relation to Chapter 3

```text
References
    ↓
Product Discovery
    ↓
PRD
    ↓
Requirement Analysis
    ↓
User Stories
    ↓
Feature Specifications
```
