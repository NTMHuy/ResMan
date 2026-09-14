# Payment Feature Specification

> **Provenance**
>
> - **Source prompt:** 3.5 Feature Specification từ User Stories & Acceptance Criteria
> - **Artifact status:** `Draft - Awaiting Review`

## F-PAY-01 — Ghi nhận thanh toán

> **Status:** Proposed

### Goal

Cho phép Nhân viên Order ghi nhận thanh toán cho đơn hàng.

### Preconditions

- Đơn hàng tồn tại.
- Tổng tiền đơn hàng đã được xác định.
- Đơn đủ điều kiện thanh toán theo business rule.

### Main Flow

1. Nhân viên Order chọn đơn hàng.
2. Kiểm tra tổng tiền.
3. Chọn phương thức thanh toán.
4. Nhập/xác nhận số tiền thanh toán.
5. Hệ thống ghi nhận thanh toán.
6. Đơn được đánh dấu đã thanh toán.

### Business Rules

- Số tiền thanh toán phải khớp với tổng tiền đơn.
- Không được ghi nhận thanh toán cho đơn chưa đủ điều kiện.
- Phương thức thanh toán phải thuộc danh sách được hỗ trợ.

### Information

- Mã đơn
- Tổng tiền
- Số tiền thanh toán
- Phương thức thanh toán
- Trạng thái thanh toán

### Acceptance Criteria

- [ ] Nhân viên có thể ghi nhận thanh toán.
- [ ] Có thể chọn phương thức thanh toán.
- [ ] Số tiền thanh toán phải khớp tổng tiền đơn.
- [ ] Đơn được đánh dấu đã thanh toán sau khi ghi nhận thành công.
- [ ] Không thể thanh toán đơn chưa đủ điều kiện.

### Traceability

- User Story: US-PAY-01
- Requirement: Payment\*

> `*` Payment hiện chưa có Requirement ID riêng trong Requirement Analysis.

### Dependencies

- Order Management
- Có thể được sử dụng bởi Reporting/Manager.

## ❓ Open Questions

- Những phương thức thanh toán nào được hỗ trợ?
- Thanh toán được thực hiện trước hay sau khi hoàn thành món?
- Có hỗ trợ thanh toán một phần không?
- Có cần hoàn tiền/cancel payment không?

## 📋 Review Checklist

- [ ] Quy tắc thời điểm thanh toán được xác nhận.
- [ ] Phương thức thanh toán được xác nhận.
- [ ] Payment có cần Requirement ID riêng không?
- [ ] Phạm vi payment trong release đầu tiên được xác nhận.

## Review Gate

`Draft - Awaiting Review`
