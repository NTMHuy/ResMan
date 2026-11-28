# Sơ đồ Chương 3

## Nguồn có thể chỉnh sửa

| Nhóm | Tệp |
|---|---|
| Kiến trúc / module | `architecture.mmd`, `module-dependencies.mmd`, `deployment.puml` |
| Use Case | `use-cases.puml` |
| Activity | `activity-customer-order.mmd`, `activity-kitchen.mmd`, `activity-payment.mmd` |
| Sequence | `sequence-login.mmd`, `sequence-customer-order.mmd`, `sequence-payment.mmd`, `sequence-cancel-item.mmd`, `sequence-kitchen-status.mmd`, `sequence-payment-request.mmd`, `sequence-inventory-operations.mmd` |
| State transition | `state-order-item.mmd` |
| ERD | `erd-overview.mmd`, `erd-account-rbac.mmd`, `erd-session-order-payment.mmd`, `erd-menu-inventory.mmd` |
| Class | `class-domain.puml` |

Không có Activity Diagram đăng nhập; luồng đăng nhập được biểu diễn bằng Sequence. Các sequence bổ sung mô tả hủy món theo vai trò, cập nhật trạng thái bếp, yêu cầu thanh toán, nhập kho và kiểm kê. Mũi tên `IN_PREPARATION → ACCEPTED` được ghi chú là quy tắc nghiệp vụ chưa triển khai. Các ERD chi tiết được tách thành ba nhóm với số thực thể giới hạn để dễ đọc.

## Wireframe SVG

Thư mục `wireframes/` chứa 9 wireframe SVG theo các component frontend hiện có. Đây là bản thiết kế minh họa, không phải ảnh chụp runtime.

## Render

Các tệp Mermaid và PlantUML là nguồn văn bản có thể render bằng Mermaid CLI và PlantUML tại môi trường có cài renderer. Trong phiên thao tác GitHub này chỉ tạo/kiểm tra nguồn sơ đồ và SVG wireframe; không có renderer Mermaid/PlantUML hoặc rasterizer để xác nhận PNG 300 DPI. Vì vậy không đính kèm PNG và không tuyên bố đã render PNG.
