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
