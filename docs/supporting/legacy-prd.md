# Product Requirement Document (PRD) - Hệ thống Quản lý Nhà hàng

- **Artifact:** 3.2 PRD
- **Status:** Approved
- **Human Review:** Approved
- **Scope:** 5 roles
- **AI Meal Recommendation:** Out of Core Scope
- **Technical Design:** Not Defined
- **Next Artifact:** 3.3 Requirement Analysis

---

## 1. Product Overview

**Tên sản phẩm:** Hệ thống Quản lý Nhà hàng

Hệ thống cung cấp một nền tảng thống nhất để kết nối các hoạt động chính của nhà hàng giữa Khách hàng, Nhân viên Order, Nhân viên Bếp, Nhân viên Kho và Quản lý.

**Mục tiêu của sản phẩm là:**

- Cải thiện hiệu quả vận hành.
- Giảm sai sót thủ công.
- Tăng tốc độ trao đổi thông tin.
- Cải thiện khả năng phối hợp giữa các bộ phận.
- Giúp Quản lý có cái nhìn rõ hơn về hoạt động của nhà hàng.

---

## 2. Problem Statement

Nhà hàng có thể gặp các vấn đề sau:

1. Quy trình gọi món chậm hoặc dễ xảy ra sai sót.
2. Đơn hàng có thể bị bỏ sót, trùng hoặc xử lý chậm.
3. Thông tin giữa Nhân viên Order và Nhân viên Bếp chưa được đồng bộ tốt.
4. Việc theo dõi nguyên liệu và tồn kho còn khó kiểm soát.
5. Quản lý nhân sự và phân quyền cần được quản lý tập trung.
6. Quản lý thiếu thông tin tổng quan phục vụ giám sát.
7. Việc lập báo cáo vận hành có thể mất thời gian và dễ sai sót.

---

## 3. Product Goals

- **Goal 1 — Cải thiện hiệu quả vận hành:** Giúp các hoạt động order, bếp, kho và quản lý được tổ chức trên cùng một hệ thống.
- **Goal 2 — Giảm sai sót:** Giảm các lỗi do nhập liệu thủ công, bỏ sót đơn hàng và truyền đạt thông tin không đồng bộ.
- **Goal 3 — Tăng khả năng phối hợp:** Cung cấp luồng thông tin rõ ràng giữa:
  $$\text{Khách hàng} \longrightarrow \text{Nhân viên Order} \longrightarrow \text{Nhân viên Bếp} \longrightarrow \text{Hoàn thành món} \longrightarrow \text{Khách hàng}$$
  _Đồng thời hỗ trợ luồng thông tin liên quan đến Kho và Quản lý._
- **Goal 4 — Hỗ trợ Quản lý:** Cung cấp thông tin và báo cáo vận hành cơ bản để Quản lý theo dõi hoạt động của nhà hàng.

---

## 4. Target Users

| Vai trò                | Nhu cầu chính                        |
| :--------------------- | :----------------------------------- |
| 👤 **Khách hàng**      | Xem menu, đặt món, theo dõi đơn hàng |
| 🛎️ **Nhân viên Order** | Tiếp nhận và quản lý đơn hàng        |
| 👨‍🍳 **Nhân viên Bếp**   | Nhận và xử lý các món cần chế biến   |
| 📦 **Nhân viên Kho**   | Quản lý nguyên liệu và tồn kho       |
| 📊 **Quản lý**         | Giám sát, báo cáo và quản lý nhân sự |

> **Scope Constraint:** PRD chỉ xác định các nhu cầu thuộc 5 vai trò trên.

---

## 5. Product Scope

### 5.1 In Scope

Phiên bản ban đầu bao gồm:

- Quản lý menu.
- Đặt và quản lý đơn hàng.
- Theo dõi vòng đời đơn hàng.
- Quản lý hàng đợi và trạng thái chế biến tại Bếp.
- Quản lý nguyên liệu và tồn kho cơ bản.
- Quản lý nhân viên và vai trò cơ bản.
- Báo cáo vận hành cơ bản.
- Luồng thông tin cốt lõi giữa 5 vai trò.

### 5.2 Out of Scope

Phiên bản ban đầu không bao gồm:

- Quản lý nhiều nhà hàng/chi nhánh.
- Logistics giao hàng và bên thứ ba.
- Payment gateway nâng cao.
- Business Intelligence nâng cao.
- Chương trình khách hàng thân thiết.
- Hệ thống chuỗi cung ứng nâng cao.
- AI gợi ý món ăn trong core scope.

> **AI Role:** AI trong dự án được xác định là development assistant, không phải end-user feature.

---

## 6. Core Product Areas

| Product Area             | Mục đích                                              |
| :----------------------- | :---------------------------------------------------- |
| **Customer Management**  | Quản lý thông tin liên quan đến khách hàng            |
| **Staff Management**     | Quản lý nhân viên và vai trò                          |
| **Menu Management**      | Quản lý thông tin món ăn                              |
| **Order Management**     | Quản lý quá trình đặt và xử lý đơn                    |
| **Kitchen Management**   | Quản lý quá trình chế biến                            |
| **Inventory Management** | Quản lý nguyên liệu và tồn kho                        |
| **Payment**              | Hỗ trợ hoạt động thanh toán trong phạm vi đã xác định |
| **Reporting**            | Cung cấp báo cáo vận hành cơ bản                      |

---

## 7. Key Product Requirements

- **PR-01 — Menu:** Hệ thống phải cho phép người dùng xem thông tin menu phù hợp với quyền truy cập của từng vai trò.
- **PR-02 — Order:** Hệ thống phải hỗ trợ tạo và quản lý đơn hàng.
- **PR-03 — Order Lifecycle:** Hệ thống phải hỗ trợ theo dõi trạng thái của đơn hàng trong quá trình xử lý.
- **PR-04 — Kitchen:** Nhân viên Bếp phải có khả năng tiếp nhận và xử lý các món cần chế biến theo đơn.
- **PR-05 — Inventory:** Nhân viên Kho phải có khả năng quản lý nguyên liệu và theo dõi tồn kho ở mức cơ bản.
- **PR-06 — Staff & Roles:** Quản lý phải có khả năng quản lý nhân viên và vai trò trong phạm vi hệ thống.
- **PR-07 — Reporting:** Quản lý phải có khả năng xem các báo cáo vận hành cơ bản.
- **PR-08 — Information Flow:** Thông tin quan trọng giữa Order, Bếp, Kho và Quản lý phải được tổ chức trên cùng hệ thống nhằm hạn chế việc truyền đạt thủ công.

---

## 8. Product Success Direction

Các kết quả mong muốn:

- Giảm sai sót trong quá trình xử lý đơn.
- Giảm thời gian trao đổi thông tin giữa các bộ phận.
- Tăng khả năng theo dõi trạng thái đơn hàng.
- Cải thiện khả năng kiểm soát nguyên liệu và tồn kho.
- Giúp Quản lý có thông tin vận hành rõ ràng hơn.

> **Assumption:** Các chỉ số định lượng cụ thể cho những mục tiêu trên chưa được xác định.

---

## 9. Constraints

### 9.1 Đã xác định

- Hệ thống có 5 vai trò chính.
- Phiên bản đầu tập trung vào phạm vi vận hành cốt lõi.
- Không đưa AI recommendation vào core scope.
- Công nghệ và kiến trúc chưa được xác định trong PRD hiện tại.

### 9.2 Chưa xác định

- Quy mô nhà hàng.
- Mô hình single-branch hay multi-branch trong tương lai.
- Các phương thức thanh toán cụ thể.
- Có cần quản lý bàn hay không.
- Quy trình takeaway/delivery.
- Mức độ chi tiết của quản lý nhân sự.
- Bộ KPI báo cáo cụ thể.

---

## 10. Product Prioritization Direction

Ưu tiên ban đầu tập trung vào chuỗi hoạt động cốt lõi:
$$\text{Menu} \longrightarrow \text{Order} \longrightarrow \text{Kitchen} \longrightarrow \text{Order Completion}$$

Các hoạt động hỗ trợ:

- Inventory
- Staff & Roles
- Reporting

_(Đây là định hướng ưu tiên, chưa phải backlog hoặc sprint plan)._

---

## 11. Key Assumptions

| ID       | Assumption                                                        | Risk   |
| :------- | :---------------------------------------------------------------- | :----- |
| **A-01** | Phiên bản đầu phục vụ một mô hình nhà hàng trong phạm vi hiện tại | Medium |
| **A-02** | Quy trình Order → Kitchen là luồng vận hành cốt lõi               | High   |
| **A-03** | Quản lý cần báo cáo vận hành cơ bản                               | Medium |
| **A-04** | Inventory ở phiên bản đầu chỉ cần mức quản lý cơ bản              | Medium |
| **A-05** | AI không phải chức năng dành cho end-user trong core release      | High   |

---

## 12. Open Questions

Các vấn đề sau chưa được xác định trong PRD:

1. Nhà hàng mục tiêu có quy mô bao nhiêu?
2. Phiên bản đầu có cần quản lý bàn không?
3. Thanh toán sẽ bao gồm những phương thức nào?
4. Có cần hỗ trợ takeaway không?
5. Khách hàng có bắt buộc phải có tài khoản không?
6. Quản lý nhân sự cần ở mức cơ bản hay chi tiết hơn?
7. Những KPI nào bắt buộc phải xuất hiện trong báo cáo?

---

## 13. Human Decision

Các nội dung sau đã được con người review và **Approved**:

- [x] Product Goals.
- [x] 5 Target Users.
- [x] In Scope / Out of Scope.
- [x] Core Product Areas.
- [x] Key Product Requirements.
- [x] Key Assumptions.
- [x] Open Questions.

---

## 14. Artifact Status

| Thuộc tính                 | Trạng thái               |
| :------------------------- | :----------------------- |
| **Artifact**               | 3.2 PRD                  |
| **Status**                 | Approved                 |
| **Human Review**           | Approved                 |
| **Scope**                  | 5 roles                  |
| **AI Meal Recommendation** | Out of Core Scope        |
| **Technical Design**       | Not Defined              |
| **Next Artifact**          | 3.3 Requirement Analysis |
