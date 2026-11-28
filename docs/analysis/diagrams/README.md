# Danh mục sơ đồ Chương 3

Các sơ đồ là nguồn văn bản có thể chỉnh sửa; caption và số hình chính thức được đặt trong `docs/analysis/system-design.md`.

| Loại | File |
|---|---|
| Kiến trúc | `architecture.mmd` |
| Deployment | `deployment.puml` |
| Module dependency | `module-dependencies.mmd` |
| Use Case | `use-cases.puml` (UC-15 là đề xuất, chưa có API đọc AuditLog) |
| Activity | `activity-customer-order.mmd`, `activity-kitchen.mmd`, `activity-payment.mmd` |
| Sequence | `sequence-login.mmd`, `sequence-customer-order.mmd`, `sequence-payment.mmd`, `sequence-cancel-item.mmd`, `sequence-kitchen-status.mmd`, `sequence-payment-request.mmd`, `sequence-inventory-operations.mmd` |
| State | `state-order-item.mmd` (transition OrderItem); `state-lifecycle.mmd` (DiningSession, DiningTable, PaymentRequest) |
| ERD | `erd-overview.mmd`, `erd-account-rbac.mmd`, `erd-session-order-payment.mmd`, `erd-menu-inventory.mmd` |
| Class | `class-domain.puml` |

## Quy ước đối chiếu

- Quan hệ ERD biểu diễn cardinality theo Prisma FK, unique và optional fields; chi tiết nullability, index, default và onDelete nằm trong từ điển dữ liệu của Chương 3.
- State diagram thể hiện transition đang có trong service; các transition chưa triển khai hoặc đề xuất phải được ghi chú, không trộn với luồng hiện hành.
- Use Case UC-15 được bổ sung trong Chương 3 để truy vết FR-24; đây là khoảng trống chức năng, không phải tính năng đã triển khai.
- Không có Activity Diagram đăng nhập; đăng nhập được mô tả bằng Sequence.
- Sequence inventory có hai nhánh nghiệp vụ: nhập kho và kiểm kê; nhánh kiểm kê chỉ tạo StockMovement ADJUSTMENT khi delta khác 0.
- Các ERD chi tiết được tách thành ba nhóm để giữ khả năng đọc.

## Wireframe SVG

Thư mục `wireframes/` chứa 9 wireframe SVG theo component frontend hiện có. Đây là bản thiết kế minh họa, không phải ảnh chụp runtime.

## Render / validation

Mermaid sources cần được render/validate bằng Mermaid CLI (`mmdc`) trong môi trường có package và Chromium/Puppeteer. PlantUML sources cần PlantUML renderer. Ở lần rà soát ngày 2026-11-28, môi trường thao tác không có `mmdc`; việc tải/cài package bị timeout do không có kết nối registry. Vì vậy không tuyên bố đã render thành công. Các source được rà soát thủ công về cấu trúc, node, nhánh và liên kết; kiểm tra cú pháp bằng renderer vẫn là việc chưa xác minh.
