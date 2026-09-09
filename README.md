# ResMan# Restaurant Management System

> Hệ thống Quản lý Nhà hàng — dự án phát triển phần mềm theo phương pháp AI-augmented SDLC.

## 1. Giới thiệu

**Restaurant Management System** là hệ thống quản lý nhà hàng nhằm kết nối các hoạt động giữa khách hàng và các bộ phận vận hành trên một nền tảng thống nhất.

Hệ thống tập trung vào việc:

- Quản lý menu và món ăn.
- Tiếp nhận và quản lý đơn hàng.
- Theo dõi quá trình chế biến món ăn.
- Quản lý nguyên liệu và tồn kho.
- Quản lý nhân viên và vai trò.
- Theo dõi hoạt động và lập báo cáo vận hành.
- Đồng bộ thông tin giữa các bộ phận liên quan.

Mục tiêu của hệ thống là **tăng hiệu quả vận hành, giảm sai sót thủ công, cải thiện khả năng phối hợp và cung cấp thông tin rõ ràng cho người quản lý**.

---

## 2. Các vai trò trong hệ thống

| Vai trò                | Chức năng chính                      |
| :--------------------- | :----------------------------------- |
| 👤 **Khách hàng**      | Xem menu, đặt món, theo dõi đơn hàng |
| 🛎️ **Nhân viên Order** | Tiếp nhận và quản lý đơn hàng        |
| 👨‍🍳 **Nhân viên Bếp**   | Tiếp nhận và chế biến món ăn         |
| 📦 **Nhân viên Kho**   | Quản lý nguyên liệu và tồn kho       |
| 📊 **Quản lý**         | Giám sát, báo cáo và quản lý nhân sự |

---

## 3. Phạm vi dự án

### In Scope

Phiên bản hiện tại tập trung vào:

- Menu và đặt món.
- Vòng đời đơn hàng.
- Hàng đợi và trạng thái chế biến tại bếp.
- Quản lý tồn kho cơ bản.
- Quản lý nhân viên và vai trò cơ bản.
- Báo cáo vận hành cơ bản.
- Luồng thông tin giữa 5 vai trò.

### Out of Scope

Các nội dung chưa thuộc phạm vi phiên bản ban đầu:

- Quản lý nhiều chi nhánh.
- Logistics giao hàng và bên thứ ba.
- Cổng thanh toán nâng cao.
- Business Intelligence nâng cao.
- Chương trình khách hàng thân thiết.
- Supply Chain nâng cao.
- AI gợi ý món ăn.

> **Lưu ý:** AI trong dự án hiện được sử dụng như **công cụ hỗ trợ quá trình phát triển**, không phải là một vai trò người dùng của hệ thống.

---

## 4. Tiến độ phát triển

Dự án được phát triển theo các giai đoạn:

Product Discovery $\rightarrow$ PRD $\rightarrow$ Requirement Analysis $\rightarrow$ User Stories $\rightarrow$ Feature Specification $\rightarrow$ Product Design $\rightarrow$ Architecture & Development $\rightarrow$ Testing $\rightarrow$ Deployment

### Trạng thái hiện tại

| Giai đoạn                     | Trạng thái                 |
| :---------------------------- | :------------------------- |
| **3.1 Product Discovery**     | ✅ Approved                |
| **3.2 PRD**                   | ✅ Approved                |
| **3.3 Requirement Analysis**  | ✅ Approved                |
| **3.4 User Stories**          | ✅ Approved                |
| **3.5 Feature Specification** | 🟡 Draft / Awaiting Review |
| **Product Design**            | ⏳ Chưa thực hiện          |
| **Architecture**              | ⏳ Chưa thực hiện          |
| **Development**               | ⏳ Chưa thực hiện          |
| **Testing**                   | ⏳ Chưa thực hiện          |
| **Deployment**                | ⏳ Chưa thực hiện          |

---

## 5. Cấu trúc Repository

```text
Restaurant-Management-System/
│
├── README.md
├── CONTRIBUTING.md
├── .gitignore
├── .env.example
│
├── docs/
│   ├── 01-project-vision.md
│   ├── 02-prd.md
│   ├── 03-requirement-analysis.md
│   ├── 04-user-stories/
│   ├── 05-feature-specs/
│   ├── 06-project-management/
│   ├── 07-architecture/
│   ├── 08-deployment/
│   └── 09-testing/
│
├── prompts/
├── references/
├── checklists/
├── templates/
│
├── src/
│   ├── backend/
│   └── frontend/
│
├── database/
│   └── schema/
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/

## 6. AI-Augmented SDLC

AI được sử dụng để hỗ trợ nhóm trong các hoạt động:
- Phân tích yêu cầu.
- Product Discovery.
- Xây dựng PRD.
- Phân tích và ưu tiên yêu cầu.
- Tạo User Stories và Acceptance Criteria.
- Đặc tả tính năng.
- Hỗ trợ thiết kế và phát triển ở các giai đoạn sau.
- Hỗ trợ kiểm thử và review.

*AI không tự động quyết định hoặc phê duyệt artifact. Các quyết định quan trọng của dự án phải được con người xem xét và xác nhận.*

---

## 7. Nguyên tắc làm việc

Dự án phân biệt rõ:
* **FACT** — thông tin đã được xác nhận.
* **DECISION** — quyết định đã được con người phê duyệt.
* **ASSUMPTION** — giả định chưa được xác nhận.

Mọi artifact quan trọng đều phải trải qua Review Gate trước khi được xem là hoàn tất.

**Nguyên tắc ưu tiên:**
Human Decisions $\rightarrow$ Project Vision $\rightarrow$ Project Context $\rightarrow$ AI Suggestions

*AI đóng vai trò hỗ trợ, không thay thế quyết định của nhóm.*

---

## 8. Tài liệu dự án

| Tài liệu | Nội dung |
| :--- | :--- |
| `docs/01-project-vision.md` | Tầm nhìn và phạm vi dự án |
| `docs/02-prd.md` | Product Requirements Document |
| `docs/03-requirement-analysis.md` | Phân tích và ưu tiên yêu cầu |
| `docs/04-user-stories/` | User Stories và Acceptance Criteria |
| `docs/05-feature-specs/` | Đặc tả chi tiết các tính năng |
| `docs/06-project-management/` | Decision, assumptions, risks, glossary... |
| `prompts/` | Prompt sử dụng trong quá trình phát triển |
| `references/` | Evidence và nguồn tham khảo |
| `checklists/` | Checklist kiểm tra |

---

## 9. Review & Approval

Các artifact được đánh dấu:
* `Draft - Awaiting Review` $\rightarrow$ đang chờ con người review.
* `Approved` $\rightarrow$ đã được con người phê duyệt.
* `Needs Revision` $\rightarrow$ cần chỉnh sửa.

*Không tự động chuyển Draft thành Approved.*

---

## 10. Trạng thái dự án

* **Current Stage:** Chapter 3 — AI trong Phân tích Yêu cầu & Sản phẩm
* **Current Focus:** Hoàn thiện Feature Specification và chuẩn bị chuyển sang các giai đoạn thiết kế tiếp theo.

---

## 11. Getting Started

### 11.1. Xem Tài Liệu Dự Án
1. Bắt đầu với `docs/01-project-vision.md` để hiểu tầm nhìn dự án.
2. Xem `docs/02-prd.md` để nắm yêu cầu sản phẩm.
3. Đọc `docs/03-requirement-analysis.md` để hiểu phân tích yêu cầu.
4. Xem `docs/04-user-stories/` để hiểu User Stories.
5. Xem `docs/05-feature-specs/` để theo dõi đặc tả tính năng.

### 11.2. Đóng Góp
- Xem `CONTRIBUTING.md` để biết quy trình đóng góp.
- Sử dụng prompt templates trong `prompts/`.
- Tham khảo `references/` cho evidence và nguồn tham khảo.

### 11.3. Kiểm Tra Chất Lượng
- Sử dụng `checklists/` để review artifact.
- Đảm bảo mọi artifact đều có Review Gate trước khi được Approve.
- Phân biệt rõ Fact, Decision và Assumption.

---

## 12. Tech Stack

**Status:** Chưa được quyết định chính thức.

Công nghệ cụ thể sẽ được xác định ở giai đoạn thiết kế/kiến trúc sau khi nhóm đánh giá yêu cầu, ràng buộc và trade-off.

| Layer | Status |
| :--- | :--- |
| **Backend** | Chưa quyết định |
| **Frontend** | Chưa quyết định |
| **Database** | Chưa quyết định |
| **ORM** | Chưa quyết định |
| **Authentication** | Chưa quyết định |
| **Deployment** | Chưa quyết định |

*Các thư mục `src/backend/`, `src/frontend/` và `database/schema/` hiện chỉ là cấu trúc chuẩn bị, không đại diện cho quyết định công nghệ.*

---

## 13. Team

| Vai trò | Thành viên | Trách nhiệm |
| :--- | :--- | :--- |
| **Developer 1** | Nguyễn Trọng Minh Huy | TBD |
| **Developer 2** | Phạm Quốc Thắng | TBD |

*Phân công trách nhiệm chi tiết sẽ được cập nhật khi nhóm chính thức quyết định.*

---

## 14. Liên Hệ

* **Repository:** [GitHub Repository]
* **Project Board:** [Project Board nếu có]
* **Documentation:** `docs/`

---

## 15. License

Dự án được phát triển cho mục đích học tập và nghiên cứu.
License cụ thể chưa được quyết định.

---

## 16. Key Artifacts

### ✅ Đã Approved
* `docs/01-project-vision.md` — Tầm nhìn dự án
* `docs/02-prd.md` — Product Requirements Document
* `docs/03-requirement-analysis.md` — Phân tích yêu cầu
* `docs/04-user-stories/` — User Stories cho 5 roles

### 🟡 Đang Review
* `docs/05-feature-specs/` — Feature Specifications

### ⏳ Chưa Thực Hiện
* Product Design
* Architecture Design
* Development
* Testing
* Deployment
```
