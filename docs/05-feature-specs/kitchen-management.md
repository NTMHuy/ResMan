# Kitchen Management Feature Specification

> **Provenance**
>
> - **Source prompt:** 3.5 Feature Specification từ User Stories & Acceptance Criteria
> - **Artifact status:** `Draft - Awaiting Review`

## F-KIT-01 — Danh sách món cần chế biến

### Goal

Cho phép Nhân viên Bếp xem các món cần chế biến.

### Preconditions

- Đơn đã được chuyển đến Kitchen.

### Main Flow

1. Nhân viên Bếp mở danh sách món.
2. Hệ thống hiển thị các món cần chế biến.
3. Nhân viên chọn món/đơn để xử lý.

### Business Rules

- Món phải gắn với đúng đơn hàng.
- Phải hiển thị số lượng.
- Phải phân biệt được các đơn.

### Acceptance Criteria

- [ ] Hiển thị món cần chế biến.
- [ ] Hiển thị số lượng.
- [ ] Hiển thị mã/nhận diện đơn.
- [ ] Có thể phân biệt các đơn khác nhau.

### Traceability

- User Story: US-KIT-01
- Requirement: PR-03

### Dependency

- F-ORD-02

---

## F-KIT-02 — Cập nhật trạng thái chế biến

### Goal

Cho phép Nhân viên Bếp cập nhật tiến trình chế biến món.

### Proposed State Flow

`Pending → Cooking → Completed`

### Main Flow

1. Bếp nhận món.
2. Chuyển món sang Cooking.
3. Sau khi hoàn thành, chuyển sang Completed.
4. Khi tất cả món trong đơn hoàn thành, đơn có thể chuyển sang Completed.

### Business Rules

- Không được chuyển món đã Completed sang trạng thái khác.
- Trạng thái món phải được phản ánh vào tiến trình Order.

### Acceptance Criteria

- [ ] Có thể chuyển món sang Cooking.
- [ ] Có thể chuyển món sang Completed.
- [ ] Không thể chuyển món đã Completed sang trạng thái khác.
- [ ] Khi tất cả món hoàn thành, Order được cập nhật phù hợp.

### Traceability

- User Story: US-KIT-02
- Requirement: PR-03, PR-08

### Dependencies

- F-KIT-03

---

## F-KIT-03 — Tiếp nhận món từ đơn hàng

### Goal

Cho phép Nhân viên Bếp tiếp nhận chính xác các món từ đơn hàng.

### Main Flow

1. Bếp nhận danh sách món từ Order.
2. Hệ thống hiển thị:
   - Tên món
   - Số lượng
   - Ghi chú đặc biệt
3. Bếp xác nhận đã tiếp nhận.
4. Món được giữ trong danh sách cho đến khi hoàn thành.
5. Các đơn khác nhau phải được phân biệt.

### Acceptance Criteria

- [ ] Bếp nhận được danh sách món từ Order.
- [ ] Hiển thị tên món.
- [ ] Hiển thị số lượng.
- [ ] Hiển thị ghi chú đặc biệt nếu có.
- [ ] Bếp có thể xác nhận tiếp nhận.
- [ ] Món đã nhận vẫn được theo dõi cho đến khi hoàn thành.
- [ ] Có thể phân biệt các đơn hàng.

### Traceability

- User Story: US-KIT-03
- Requirement: PR-04

### Dependency

- F-ORD-01

---

## ❓ Open Questions

- Kitchen có cần trạng thái `Paused` hoặc `Rejected` không?
- Khi nào Order được xem là hoàn thành hoàn toàn?
- Ghi chú đặc biệt của món có giới hạn hay quy tắc cụ thể không?

## 📋 Review Checklist

- [ ] Kitchen State Flow được xác nhận.
- [ ] Quy tắc hoàn thành Order được xác nhận.
- [ ] Thông tin truyền từ Order sang Kitchen chính xác.

## Review Gate

`Draft - Awaiting Review`
