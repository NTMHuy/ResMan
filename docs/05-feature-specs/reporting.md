# Reporting Feature Specification

> **Provenance**
>
> - **Source prompt:** 3.5 Feature Specification từ User Stories & Acceptance Criteria
> - **Artifact status:** `Draft - Awaiting Review`

## F-MGR-01 — Giám sát vận hành

### Goal

Cho phép Quản lý có cái nhìn tổng quan về hoạt động của nhà hàng.

### Main Flow

1. Quản lý mở màn hình giám sát.
2. Hệ thống hiển thị các thông tin vận hành chính.
3. Quản lý theo dõi tình trạng Order, Kitchen và Inventory.

### Information

- Đơn hàng
- Trạng thái xử lý
- Tình trạng Kitchen
- Tình trạng Inventory
- Các chỉ số vận hành cơ bản

### Acceptance Criteria

- [ ] Quản lý xem được tình trạng đơn hàng.
- [ ] Quản lý theo dõi được tiến trình xử lý.
- [ ] Quản lý xem được thông tin tồn kho liên quan.
- [ ] Thông tin được cập nhật theo dữ liệu vận hành.

### Traceability

- User Story: US-MGR-01
- Requirement: PR-08

---

## F-MGR-02 — Báo cáo vận hành

### Goal

Cho phép Quản lý xem và xuất các báo cáo vận hành cơ bản.

### Main Flow

1. Quản lý chọn loại báo cáo.
2. Chọn khoảng thời gian.
3. Hệ thống tổng hợp dữ liệu.
4. Hiển thị báo cáo.
5. Quản lý có thể xuất báo cáo.

### Reports

- Doanh thu theo ngày/tuần/tháng.
- Số lượng đơn theo ngày/tuần/tháng.
- Top 10 món ăn.
- Báo cáo nguyên liệu tồn thấp.

### Acceptance Criteria

- [ ] Xem được doanh thu theo ngày/tuần/tháng.
- [ ] Xem được số lượng đơn theo ngày/tuần/tháng.
- [ ] Xem được Top 10 món ăn.
- [ ] Xem được báo cáo tồn kho thấp.
- [ ] Có thể xuất báo cáo CSV/PDF.

### Traceability

- User Story: US-MGR-02
- Requirement: PR-07

### Dependencies

- Order Management
- Inventory Management

---

## ❓ Open Questions

- KPI chính thức của báo cáo là gì?
- Có cần thêm báo cáo nào ngoài các báo cáo trên không?
- CSV/PDF có bắt buộc trong release đầu tiên không?

## 📋 Review Checklist

- [ ] Bộ KPI được xác nhận.
- [ ] Phạm vi báo cáo được xác nhận.
- [ ] Định dạng export được xác nhận.

## Review Gate

`Draft - Awaiting Review`
