# Staff Management Feature Specification

> **Provenance**
>
> - **Source prompt:** 3.5 Feature Specification từ User Stories & Acceptance Criteria
> - **Artifact status:** `Draft - Awaiting Review`

## F-MGR-03 — Quản lý nhân viên & vai trò

### Goal

Cho phép Quản lý quản lý thông tin nhân viên và vai trò trong hệ thống.

### Preconditions

- Người sử dụng có quyền Quản lý.

### Main Flow

1. Quản lý mở danh sách nhân viên.
2. Xem thông tin nhân viên.
3. Tạo hoặc cập nhật thông tin nhân viên.
4. Gán vai trò phù hợp.
5. Lưu thay đổi.

### Business Rules

- Mỗi nhân viên phải có vai trò.
- Vai trò phải thuộc phạm vi các vai trò được xác định của hệ thống.
- Quyền truy cập phải phù hợp với vai trò.

### Roles

- Customer
- Order Staff
- Kitchen Staff
- Inventory Staff
- Manager

### Acceptance Criteria

- [ ] Quản lý xem được danh sách nhân viên.
- [ ] Có thể cập nhật thông tin nhân viên.
- [ ] Có thể gán vai trò.
- [ ] Vai trò được sử dụng để xác định quyền truy cập phù hợp.

### Traceability

- User Story: US-MGR-03
- Requirement: PR-06

### Dependencies

- Không có dependency chức năng bắt buộc.

## ❓ Open Questions

- Chi tiết thông tin nhân viên cần quản lý đến mức nào?
- Mỗi vai trò có những quyền cụ thể nào?
- Có cần khóa/kích hoạt tài khoản nhân viên không?

## 📋 Review Checklist

- [ ] Phạm vi Staff Management được xác nhận.
- [ ] Các vai trò được xác nhận.
- [ ] Quyền của từng vai trò được xác nhận.

## Review Gate

`Draft - Awaiting Review`
