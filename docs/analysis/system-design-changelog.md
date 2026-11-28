# Nhật ký thay đổi Chương 3 – Thiết kế hệ thống

> Phạm vi thay đổi: nhánh `docs/complete-system-design-chapter-3`, được tạo từ `member/minhhuy` tại commit `865870498670c3b828caa71d01031be429571197`. Chỉ thay đổi tài liệu và sơ đồ trong `docs/analysis`; không chỉnh sửa backend/frontend, schema, migration hoặc file môi trường.

## Nguồn đối chiếu đã đọc
- `AGENTS.md` và các skill: project-analysis, requirements-analysis, system-analysis, architecture-design, database-design, api-design, ui-ux-design.
- `docs/01-project-vision.md`, `docs/08-prd.md`, `docs/11-confirmed-business-rules.md`, `docs/analysis/requirements-analysis.md`.
- `backend/src/app.module.ts`, các module/controller/service auth, users, tables, sessions, orders, kitchen, menu, inventory, payments, reports; `frontend/src/features/**`, `frontend/src/repositories/api/**`, `frontend/src/navigation/FeatureRouteView.tsx`; `prisma/schema.prisma` và migrations.

## Nhóm 1 – Chương 3.1–3.4
- Viết lại phạm vi, nguyên tắc, kiến trúc, phân hệ, ranh giới module và Use Case.
- Đánh dấu trạng thái triển khai dựa trên Chương 2 và mã nguồn; không mô tả AI recommendation là chức năng bắt buộc của MVP.
- Thêm nguồn Mermaid/PlantUML cho kiến trúc, dependency module, use case và deployment.
- Giữ placeholder số trang `[ĐIỀN SỐ TRANG]`; không tự ước lượng.

## Quy ước biên tập và kiểm chứng
- Quy tắc nghiệp vụ ưu tiên `docs/11-confirmed-business-rules.md`; code được dùng để xác định trạng thái triển khai, không thay thế quyết định nghiệp vụ.
- Không đưa sơ đồ Activity đăng nhập; đăng nhập được biểu diễn bằng Sequence.
- Không thay đổi mã nguồn sản phẩm hoặc cấu hình bí mật.
- Các tham chiếu mục/hình ở Chương 2 sẽ được rà soát sau khi đánh số Chương 3 hoàn tất.


## Nhóm 2 – Chương 3.5–3.8
- Bổ sung Activity cho gọi món, KDS và thanh toán; không tạo Activity đăng nhập.
- Bổ sung Sequence đăng nhập, gọi món và thanh toán.
- Bổ sung bảng trạng thái và state transition; đánh dấu IN_PREPARATION → ACCEPTED là quy tắc nghiệp vụ chưa triển khai.
- Đối chiếu mục 4.2 Business Rules: bếp không cần lý do hủy; code hiện bắt buộc lý do.
- Bổ sung ERD tổng quan và ba ERD chi tiết; mỗi ERD chi tiết giới hạn số thực thể để dễ đọc.
- Bổ sung class diagram; mô tả PaymentRequest.status không có CHECK trong migration tạo bảng.


## Nhóm 3 – Chương 3.9–3.14
- Bổ sung API inventory theo controller thực tế, RBAC từ seed và guards, UI/navigation, NFR và bảng technical debt.
- Technical debt ghi rõ `Ưu tiên đề xuất`, không biến thành severity đã phê duyệt.
- Thêm 9 wireframe SVG theo component thực tế; ghi target device và chú thích không phải ảnh chụp sản phẩm.
- Rà soát các tham chiếu Chương 3 trong `docs/`: Chương 2 chỉ tham chiếu Chương 3 ở mức tổng quát, không có link tới các figure/section cũ; `implementation-testing.md` link tới `system-design.md` vẫn hợp lệ. Các heading “Mục 3.x” trong `07-project-plan.md` thuộc cấu trúc nội bộ tài liệu kế hoạch, không phải tham chiếu Chương 3 nên không đổi.
- Không ghi nhận SD-04; không thay đổi backend/frontend/schema/migrations/config.
- Giới hạn xuất bản: wireframe được tạo dạng SVG; nguồn Mermaid/PlantUML được lưu editable. Không tuyên bố đã render PNG 300 DPI cho Mermaid/PlantUML vì phiên thao tác GitHub không có Mermaid CLI/PlantUML renderer hoặc môi trường raster hóa để kiểm chứng PNG.


## Kiểm tra tham chiếu và định dạng sơ đồ
- Các tham chiếu Mermaid/PlantUML trong nội dung chương dùng liên kết tới tệp nguồn thay vì Markdown image, vì `.mmd`/`.puml` là mã nguồn chứ không phải ảnh raster/vector đã render.
- Các wireframe SVG được nhúng trực tiếp bằng Markdown image và có caption trong từng SVG.
- Chưa tạo PNG 300 DPI cho sơ đồ Mermaid/PlantUML; không ghi nhận render PNG thành công khi không có renderer trong môi trường thao tác GitHub.
