## 1. Discovery Objective

Mục tiêu của Product Discovery là giảm sự không chắc chắn trước khi bước vào các giai đoạn thiết kế và phát triển hệ thống.

Đối với dự án **Restaurant Management System**, Product Discovery tập trung vào việc xác định:

- Vấn đề vận hành chính mà hệ thống cần giải quyết.
- Đối tượng người dùng và nhu cầu của từng vai trò.
- Giá trị mà hệ thống cần tạo ra cho hoạt động nhà hàng.
- Các chức năng cốt lõi cần được ưu tiên.
- Các giả định và câu hỏi chưa được xác nhận.
- Những rủi ro có thể ảnh hưởng đến phạm vi và khả năng thực hiện dự án.

Product Discovery không nhằm quyết định công nghệ hoặc kiến trúc kỹ thuật ở giai đoạn này.

---

# 2. Problem Discovery

## 2.1 Problem Statement

Các nhà hàng vừa và nhỏ có thể gặp khó khăn khi việc đặt món, xử lý đơn hàng, chế biến, quản lý kho và theo dõi hoạt động được thực hiện thủ công hoặc trên các hệ thống rời rạc.

Những vấn đề chính được xác định gồm:

| Khu vực  | Vấn đề                                                             |
| -------- | ------------------------------------------------------------------ |
| Đặt món  | Quy trình đặt món có thể chậm, dễ sai sót và khó theo dõi          |
| Đơn hàng | Có nguy cơ thất lạc, trùng lặp hoặc xử lý chậm                     |
| Bếp      | Khó theo dõi thứ tự ưu tiên và trạng thái chế biến                 |
| Kho      | Khó theo dõi tồn kho và nguy cơ thiếu hoặc dư nguyên liệu          |
| Nhân sự  | Khó quản lý vai trò và trách nhiệm nếu thiếu hệ thống tập trung    |
| Quản lý  | Thiếu cái nhìn tổng thể về hoạt động hàng ngày                     |
| Báo cáo  | Việc tổng hợp doanh thu, đơn hàng và tồn kho có thể chậm và dễ sai |
| Phối hợp | Thông tin giữa các bộ phận có thể bị hiểu sai hoặc truyền đạt chậm |

**Nguồn:** Project Vision hiện tại của dự án.

---

# 3. Target Users

Hệ thống phục vụ năm vai trò chính.

## 3.1 Customer

**Nhu cầu chính:**

- Xem thực đơn.
- Biết món ăn có còn phục vụ hay không.
- Đặt món.
- Theo dõi trạng thái đơn hàng.

**Giá trị mong đợi:**

Giảm nhầm lẫn khi đặt món và giúp khách hàng theo dõi đơn hàng rõ ràng hơn.

---

## 3.2 Order Staff

**Nhu cầu chính:**

- Tiếp nhận đơn hàng.
- Ghi nhận thông tin đơn chính xác.
- Gửi đơn đến bếp.
- Theo dõi trạng thái đơn.

**Giá trị mong đợi:**

Giảm sai sót khi nhập đơn và hạn chế tình trạng đơn hàng bị bỏ sót.

---

## 3.3 Kitchen Staff

**Nhu cầu chính:**

- Nhận các đơn cần chế biến.
- Xem chi tiết món ăn trong đơn.
- Theo dõi thứ tự ưu tiên.
- Cập nhật trạng thái chế biến.

**Giá trị mong đợi:**

Giúp quá trình chế biến có tổ chức hơn và giảm nhầm lẫn giữa các đơn.

---

## 3.4 Inventory Staff

**Nhu cầu chính:**

- Theo dõi tồn kho.
- Theo dõi mức sử dụng nguyên liệu.
- Nhận biết nguy cơ thiếu nguyên liệu.
- Hỗ trợ nhu cầu nhập hàng.

**Giá trị mong đợi:**

Giảm nguy cơ hết nguyên liệu hoặc nhập dư do thiếu thông tin tồn kho.

---

## 3.5 Manager

**Nhu cầu chính:**

- Theo dõi hoạt động nhà hàng.
- Quản lý nhân sự và vai trò.
- Theo dõi đơn hàng.
- Theo dõi tồn kho.
- Xem báo cáo doanh thu và hiệu suất cơ bản.

**Giá trị mong đợi:**

Có được cái nhìn tập trung để hỗ trợ việc giám sát và ra quyết định vận hành.

---

# 4. Solution Discovery

## 4.1 Proposed Product

Đề xuất xây dựng một **Restaurant Management System** tích hợp các hoạt động cốt lõi của nhà hàng trên một nền tảng thống nhất.

Hệ thống tạo luồng thông tin giữa:

```text
Customer
    ↓
Order Staff
    ↓
Kitchen Staff
    ↓
Inventory Staff

Manager
    ↓
Giám sát toàn bộ hoạt động
```

Mục tiêu không phải xây dựng một hệ thống có số lượng tính năng lớn, mà tập trung vào một hệ thống lõi có khả năng phối hợp thông tin nhất quán giữa năm vai trò.

---

# 5. Core Functional Areas

Các khu vực chức năng ban đầu được xác định:

| Functional Area      | Mục đích                                     |
| -------------------- | -------------------------------------------- |
| Customer Management  | Quản lý thông tin cần thiết cho việc đặt món |
| Staff Management     | Quản lý vai trò và quyền truy cập            |
| Menu Management      | Quản lý món ăn và trạng thái còn/hết         |
| Order Management     | Quản lý vòng đời đơn hàng                    |
| Kitchen Management   | Quản lý hàng đợi và trạng thái chế biến      |
| Inventory Management | Theo dõi nguyên liệu và tồn kho              |
| Payment              | Ghi nhận giao dịch cơ bản                    |
| Reporting            | Tổng hợp dữ liệu phục vụ quản lý             |

Các khu vực này sẽ được phân tích chi tiết hơn trong PRD, Requirement Analysis, User Stories và Feature Specifications.

---

# 6. Evidence

Product Discovery cần dựa trên evidence thay vì chỉ dựa trên sự kỳ vọng về sản phẩm.

## 6.1 Evidence hiện có

### Project Vision

Project Vision xác định các vấn đề vận hành phổ biến trong nhà hàng vừa và nhỏ khi hoạt động được xử lý thủ công hoặc thông qua nhiều hệ thống rời rạc.

Các vấn đề được mô tả bao gồm:

- Sai sót trong đặt món.
- Đơn hàng bị bỏ sót hoặc chậm.
- Khó phối hợp với bếp.
- Khó kiểm soát tồn kho.
- Khó giám sát nhân sự.
- Thiếu dữ liệu tổng hợp cho quản lý.
- Báo cáo chậm và dễ sai.
- Thông tin giữa các vai trò không đồng bộ.

### Product Discovery Framework

Theo tài liệu Chương 3, Discovery cần:

1. Làm rõ outcome mong muốn.
2. Sử dụng evidence để xác thực ý tưởng.
3. Nghiên cứu thị trường và các giải pháp thay thế.
4. Ưu tiên dựa trên value, evidence và effort.
5. Xác nhận chất lượng artifact với con người.

**Lưu ý:** Ở thời điểm hiện tại, Project Vision mới cung cấp baseline về vấn đề và nhu cầu. Các nghiên cứu thị trường, competitor analysis và evidence thực tế khác chưa được xác nhận trong artifact này.

---

# 7. Initial Value Hypothesis

### Hypothesis

Nếu các hoạt động đặt món, xử lý đơn, chế biến, quản lý kho và giám sát được kết nối trên một hệ thống thống nhất, nhà hàng có thể:

- Giảm sai sót trong quá trình xử lý đơn.
- Cải thiện tốc độ luân chuyển thông tin giữa các vai trò.
- Giúp bếp quản lý đơn có tổ chức hơn.
- Cải thiện khả năng theo dõi tồn kho.
- Cung cấp dữ liệu tập trung cho quản lý.
- Cải thiện trải nghiệm đặt và theo dõi đơn của khách hàng.

### Validation Required

Các giả thuyết trên cần được kiểm chứng thêm trong các bước phân tích tiếp theo thay vì được xem là kết quả đã được chứng minh.

---

# 8. Scope Discovery

## 8.1 In Scope

- Xem menu và đặt món.
- Tạo và quản lý đơn hàng.
- Theo dõi hàng đợi và trạng thái chế biến.
- Theo dõi tồn kho cơ bản.
- Quản lý nhân sự và vai trò cơ bản.
- Ghi nhận thanh toán cơ bản.
- Báo cáo vận hành cơ bản.
- Luồng phối hợp giữa năm vai trò.

## 8.2 Out of Scope – Initial Release

- Multi-restaurant / multi-branch.
- Logistics và tích hợp bên giao hàng thứ ba.
- Payment gateway nâng cao.
- Business Intelligence nâng cao.
- Loyalty / tích điểm.
- Supply chain management nâng cao.
- AI recommendation trong core system.

Tính năng **AI gợi ý món ăn** có thể được xem xét sau khi hệ thống lõi hoàn thiện và ổn định, nhưng không phải yêu cầu bắt buộc của phiên bản core.

---

# 9. Discovery Constraints

Các constraint hiện tại:

### Team

- Nhóm phát triển gồm **2 thành viên**.
- Hai thành viên phối hợp thông qua Git.
- Công việc được tổ chức theo **Feature/Module**.

### Project

- Đây là dự án phần mềm của sinh viên.
- Scope cần đủ thực tế để có thể hoàn thành.
- Không mở rộng vượt quá năm vai trò đã xác định.
- Technology stack chưa được quyết định.

### AI

AI được sử dụng như **development assistant** trong quá trình phát triển.

AI hỗ trợ:

- Phân tích yêu cầu.
- Phân tích người dùng.
- User Flow.
- Use Case.
- Mô hình hóa.
- Lập kế hoạch.
- Tạo task.
- Đánh giá artifact.

AI không thay thế quyết định của nhóm.

---

# 10. Initial Prioritization Direction

Ở giai đoạn Discovery, chưa thực hiện prioritization chi tiết theo MoSCoW.

Tuy nhiên, dựa trên Project Vision, luồng nghiệp vụ cốt lõi có thể được xem xét theo hướng:

```text
Menu
  ↓
Order
  ↓
Kitchen
  ↓
Order Completion
  ↓
Payment
  ↓
Reporting

Inventory
  ↕
Kitchen / Operations

Staff Management
  ↓
Manager
```

Đây là **AI Suggestion**, chưa phải thứ tự triển khai được nhóm phê duyệt.

Prioritization chính thức sẽ được thực hiện trong **Requirement Analysis**.

---

# 11. Key Assumptions

Các assumption hiện tại:

| ID   | Assumption                                               | Status                           |
| ---- | -------------------------------------------------------- | -------------------------------- |
| A-01 | Hệ thống phục vụ một nhà hàng trong phiên bản đầu        | Chưa xác nhận                    |
| A-02 | Nhóm sử dụng một Git repository chung                    | Đã xác nhận theo team decision   |
| A-03 | Công việc được chia theo Feature/Module                  | Đã xác nhận                      |
| A-04 | Technology stack chưa được quyết định                    | Chưa quyết định                  |
| A-05 | Các chức năng cốt lõi ưu tiên hơn các tính năng nâng cao | Định hướng hiện tại              |
| A-06 | AI recommendation không thuộc core scope                 | Đã xác định trong Project Vision |

---

# 12. Open Questions

Các vấn đề cần được con người quyết định ở giai đoạn tiếp theo:

1. Nhà hàng mục tiêu có quy mô như thế nào?
2. Khách hàng có cần tài khoản hay có thể đặt món không cần đăng ký?
3. Phiên bản đầu có cần quản lý bàn hay không?
4. Có hỗ trợ tại chỗ, mang đi hoặc cả hai?
5. Phương thức thanh toán nào cần hỗ trợ?
6. Quản lý nhân sự chỉ bao gồm role/access hay cần thêm quản lý ca?
7. Những KPI nào là bắt buộc trong báo cáo?
8. Có cần đưa đánh giá/phản hồi khách hàng vào phiên bản đầu không?
9. Những evidence nào cần bổ sung từ thị trường hoặc hệ thống tương tự?

---

# 13. Discovery Outcome

Product Discovery hiện tại xác định được:

**Problem**

> Các hoạt động vận hành nhà hàng có thể bị phân tán, thủ công và thiếu đồng bộ giữa các vai trò.

**Target**

> Customer, Order Staff, Kitchen Staff, Inventory Staff và Manager.

**Proposed Solution**

> Một hệ thống quản lý nhà hàng thống nhất, kết nối các hoạt động cốt lõi từ đặt món đến chế biến, kho và quản lý.

**Core Value**

> Cải thiện hiệu quả, độ chính xác và khả năng phối hợp trong vận hành nhà hàng.

**Main Constraint**

> Dự án được thực hiện bởi nhóm 2 người và cần duy trì scope phù hợp với khả năng thực hiện.

**Current Uncertainty**

> Quy mô nhà hàng, phương thức thanh toán, quản lý bàn, hình thức phục vụ, mức độ quản lý nhân sự và KPI báo cáo vẫn cần được xác định.

---

# 14. Human Decision Required

Các quyết định sau **chưa được AI tự động xác nhận**:

- [ ] Xác nhận Problem Statement.
- [ ] Xác nhận Target Users.
- [ ] Xác nhận Core Functional Areas.
- [ ] Xác nhận In Scope / Out of Scope.
- [ ] Xác nhận các giả định quan trọng.
- [ ] Bổ sung evidence từ thị trường / hệ thống tương tự.
- [ ] Xác định các Open Questions cần giải quyết trước PRD.

---

## 📋 Review Checklist

- [ ] Problem có phản ánh đúng vấn đề nhóm muốn giải quyết?
- [ ] Năm vai trò có đầy đủ và không có vai trò ngoài scope?
- [ ] Các functional areas có phù hợp với Project Vision?
- [ ] Scope có đủ nhỏ để nhóm 2 người thực hiện?
- [ ] Các assumption đã được phân biệt với decision?
- [ ] Evidence hiện tại có đủ mạnh để chuyển sang PRD?
- [ ] Các Open Questions đã được xác định đầy đủ?
- [ ] Có điểm nào AI đề xuất nhưng nhóm không đồng ý?

---

## ❓ Open Questions for Review

> **Review Gate:** Artifact này vẫn ở trạng thái `Draft - Awaiting Review`.

Nhóm cần xác nhận trước khi chuyển sang **3.2 PRD**:

1. Có **approve Product Discovery** này không?
2. Có muốn bổ sung **competitor/market research** trước khi chuyển sang PRD không?
3. Trong các Open Questions ở trên, câu nào cần ưu tiên giải quyết trước?
