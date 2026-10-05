# Customer Management Feature Specification

> **Provenance**
>
> - **Source prompt:** 3.5 Feature Specification từ User Stories & Acceptance Criteria
> - **Artifact status:** `Draft - Awaiting Review`

## F-CUS-01 — Xem Menu

### Goal

Cho phép Khách hàng xem các món ăn hiện có trước khi đặt hàng.

### Preconditions

- Menu có dữ liệu món ăn.

### Main Flow

1. Khách hàng mở Menu.
2. Hệ thống hiển thị danh sách món.
3. Khách hàng có thể lọc theo danh mục.
4. Khách hàng có thể tìm kiếm theo tên món.
5. Khách hàng xem thông tin món.

### Business Rules

- Mỗi món cần có tên, giá, mô tả ngắn và trạng thái.
- Món không khả dụng phải được thể hiện rõ trạng thái.

### Information

- Tên món
- Giá
- Mô tả ngắn
- Danh mục
- Trạng thái

### Acceptance Criteria

- [ ] Hiển thị tên món.
- [ ] Hiển thị giá món.
- [ ] Hiển thị mô tả ngắn.
- [ ] Hiển thị trạng thái món.
- [ ] Có thể lọc theo danh mục.
- [ ] Có thể tìm kiếm theo tên món.

### Traceability

- User Story: US-CUS-01
- Requirement: PR-01

---

## F-CUS-02 — Tạo Đơn hàng

### Goal

Cho phép Khách hàng chọn món và tạo đơn hàng.

### Preconditions

- Khách hàng đã xem Menu.
- Món được chọn đang khả dụng.

### Main Flow

1. Khách hàng chọn món.
2. Khách hàng xác định số lượng.
3. Khách hàng xác nhận đơn.
4. Hệ thống tạo đơn hàng.
5. Đơn được chuyển sang quy trình xử lý.

### Business Rules

- Chỉ món khả dụng mới được đặt.
- Đơn phải chứa ít nhất một món.
- Thông tin món và số lượng phải được lưu trong đơn.

### Information

- Mã đơn
- Danh sách món
- Số lượng
- Tổng tiền
- Trạng thái đơn

### Acceptance Criteria

- [ ] Khách hàng có thể chọn món.
- [ ] Khách hàng có thể thay đổi số lượng.
- [ ] Hệ thống tạo đơn sau khi xác nhận.
- [ ] Đơn chứa đúng các món và số lượng đã chọn.

### Traceability

- User Story: US-CUS-02
- Requirement: PR-02

### Dependency

- F-CUS-01

---

## F-CUS-03 — Theo dõi Đơn hàng

### Goal

Cho phép Khách hàng theo dõi trạng thái đơn hàng.

### Preconditions

- Đơn hàng đã được tạo.

### Main Flow

1. Khách hàng mở đơn hàng.
2. Hệ thống hiển thị trạng thái hiện tại.
3. Khi trạng thái thay đổi, thông tin theo dõi được cập nhật.

### Business Rules

- Trạng thái phải phản ánh trạng thái xử lý thực tế.
- Không được hiển thị trạng thái không hợp lệ.

### Information

- Mã đơn
- Trạng thái
- Danh sách món
- Thời điểm cập nhật

### Acceptance Criteria

- [ ] Khách hàng xem được trạng thái đơn.
- [ ] Trạng thái được cập nhật theo quá trình xử lý.
- [ ] Khách hàng phân biệt được các đơn hàng khác nhau.

### Traceability

- User Story: US-CUS-03
- Requirement: PR-03, PR-08

### Dependencies

- F-KIT-02
- F-ORD-03

---

## ❓ Open Questions

- Có bắt buộc Customer phải đăng nhập không?
- Có hỗ trợ Takeaway/Table Order không?

## 📋 Review Checklist

- [ ] Nội dung phù hợp với US-CUS-01..03.
- [ ] Acceptance Criteria đã được kiểm tra.
- [ ] Business Rules cần được xác nhận.

## Review Gate

`Draft - Awaiting Review`
