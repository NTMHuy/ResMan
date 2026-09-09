# Inventory Management Feature Specification

> **Provenance**
>
> - **Source prompt:** 3.5 Feature Specification từ User Stories & Acceptance Criteria
> - **Artifact status:** `Draft - Awaiting Review`

## F-INV-01 — Theo dõi tồn kho

### Goal

Cho phép Nhân viên Kho theo dõi số lượng nguyên liệu hiện có.

### Main Flow

1. Nhân viên Kho mở danh sách tồn kho.
2. Hệ thống hiển thị nguyên liệu.
3. Nhân viên xem số lượng hiện tại.
4. Nhân viên xác định nguyên liệu đang ở mức thấp.

### Information

- Tên nguyên liệu
- Số lượng tồn
- Đơn vị
- Mức tồn tối thiểu

### Acceptance Criteria

- [ ] Xem được danh sách nguyên liệu.
- [ ] Xem được số lượng tồn.
- [ ] Xem được mức tồn tối thiểu.
- [ ] Có thể xác định nguyên liệu tồn thấp.

### Traceability

- User Story: US-INV-01
- Requirement: PR-05

---

## F-INV-02 — Cập nhật tồn kho

### Goal

Cho phép Nhân viên Kho cập nhật thông tin tồn kho.

### Main Flow

1. Nhân viên chọn nguyên liệu.
2. Nhập thông tin tồn kho mới.
3. Xác nhận cập nhật.
4. Hệ thống ghi nhận thông tin mới.

### Business Rules

- Số lượng tồn phải được cập nhật chính xác.
- Dữ liệu sau cập nhật phải phản ánh trạng thái hiện tại.

### Acceptance Criteria

- [ ] Có thể cập nhật số lượng tồn.
- [ ] Hệ thống lưu giá trị mới.
- [ ] Giá trị tồn kho hiển thị được cập nhật.

### Traceability

- User Story: US-INV-02
- Requirement: PR-05

### Dependency

- F-INV-01

---

## F-INV-03 — Cảnh báo tồn kho thấp

### Goal

Giúp Nhân viên Kho nhận biết nguyên liệu dưới mức tồn tối thiểu.

### Main Flow

1. Hệ thống kiểm tra số lượng tồn.
2. So sánh với mức tồn tối thiểu.
3. Nếu thấp hơn mức cho phép, hiển thị cảnh báo.

### Business Rules

- Cảnh báo khi tồn kho dưới mức tối thiểu.
- Mức tối thiểu phải được xác định cho nguyên liệu.

### Acceptance Criteria

- [ ] Hệ thống xác định được nguyên liệu tồn thấp.
- [ ] Hiển thị cảnh báo.
- [ ] Thông tin cảnh báo gắn với đúng nguyên liệu.

### Traceability

- User Story: US-INV-03
- Requirement: PR-05

### Dependencies

- F-INV-01

---

## ❓ Open Questions

- Menu có liên kết trực tiếp với nguyên liệu hay Recipe không?
- Có tự động trừ tồn kho khi Order hoàn thành không?
- Ai xác định mức tồn tối thiểu?

## 📋 Review Checklist

- [ ] Quy tắc tồn kho thấp được xác nhận.
- [ ] Mức tồn tối thiểu được xác nhận.
- [ ] Quan hệ Menu/Ingredient cần được làm rõ.

## Review Gate

`Draft - Awaiting Review`
