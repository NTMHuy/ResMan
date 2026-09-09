    # 3.3 Requirement Analysis

    > **Provenance**
    > - **Source prompt:** `3.3 Requirement Analysis`
    > - **Artifact status:** `Draft - Awaiting Review`
    > - **Based on:** Project Vision và PRD 3.2 đã Approved
    > - **Human Approval:** Pending

    ---

    ## 1. Purpose

    Requirement Analysis nhằm phân tích, làm rõ, ưu tiên và đánh giá các yêu cầu sản phẩm được xác định trong PRD.

    Phân tích tập trung vào:
    * Extract explicit requirements từ PRD.
    * Suy ra implicit requirements từ mục tiêu và phạm vi sản phẩm.
    * Phân loại requirement theo MoSCoW.
    * Đánh giá quality characteristics.
    * Đánh giá feasibility.
    * Phân tích dependency giữa các requirement.
    * Đánh giá risk.
    * Xác định các gap còn tồn tại.
    * Ưu tiên và xác định tiêu chí validation.
    * Xác định các quyết định cần Human Review trước khi chuyển sang User Stories.

    > **Scope Constraint:** Phân tích chỉ tập trung vào core product và 5 vai trò đã được xác định trong PRD.

    ---

    ## 2. Requirement Extraction

    ### 2.1. Explicit Requirements
    Các yêu cầu được ghi rõ trong PRD 3.2:

    | ID | Explicit Requirement | Source |
    | :--- | :--- | :--- |
    | **PR-01** | Hệ thống phải cho phép xem và quản lý thông tin Menu | PRD §7 |
    | **PR-02** | Hệ thống phải hỗ trợ tạo và quản lý Order | PRD §7 |
    | **PR-03** | Hệ thống phải hỗ trợ theo dõi Order Lifecycle | PRD §7 |
    | **PR-04** | Nhân viên Bếp phải có khả năng tiếp nhận và xử lý món | PRD §7 |
    | **PR-05** | Nhân viên Kho phải có khả năng quản lý nguyên liệu và tồn kho cơ bản | PRD §7 |
    | **PR-06** | Quản lý phải có khả năng quản lý nhân viên và vai trò | PRD §7 |
    | **PR-07** | Quản lý phải có khả năng xem báo cáo vận hành cơ bản | PRD §7 |
    | **PR-08** | Thông tin giữa Order, Bếp, Kho và Quản lý phải được tổ chức trên cùng hệ thống | PRD §7 |

    ---

    ### 2.2. Explicit Scope Requirements
    Các giới hạn scope được xác định rõ trong PRD:

    #### In Scope
    * Menu Management.
    * Order Management.
    * Order Lifecycle.
    * Kitchen Management.
    * Basic Inventory Management.
    * Basic Staff & Role Management.
    * Basic Operational Reporting.
    * Core Information Flow giữa 5 vai trò.

    #### Out of Scope — Initial Release
    * Multi-restaurant / Multi-branch.
    * Delivery logistics và third parties.
    * Advanced Payment Gateway.
    * Advanced Business Intelligence.
    * Loyalty Program.
    * Advanced Supply Chain.
    * AI Meal Recommendation trong core release.

    ---

    ### 2.3. Requirement Sources

    | Source | Requirements |
    | :--- | :--- |
    | **Project Vision** | Business goals, user roles, scope |
    | **PRD** | PR-01 → PR-08 |
    | **Product Discovery** | Problem, value, evidence và assumptions |
    | **Human Decisions** | Scope 5 roles, repository structure, core direction |

    > **Priority of sources:** Human Decisions > Project Vision > Context > AI Suggestions.

    ---

    ## 2.4. Requirement Traceability

    | Requirement | Product Goal | Role(s) | Priority |
    |-------------|--------------|---------|----------|
    | PR-01 (Menu) | Goal 1: Efficiency, Goal 2: Reduce Errors | Customer, Order Staff, Manager | Must |
    | PR-02 (Order) | Goal 1: Efficiency, Goal 2: Reduce Errors, Goal 3: Coordination | Customer, Order Staff | Must |
    | PR-03 (Lifecycle) | Goal 2: Reduce Errors, Goal 3: Coordination | Customer, Order Staff, Kitchen Staff | Must |
    | PR-04 (Kitchen) | Goal 1: Efficiency, Goal 3: Coordination | Kitchen Staff | Must |
    | PR-05 (Inventory) | Goal 1: Efficiency, Goal 2: Reduce Errors | Inventory Staff | Must |
    | PR-06 (Staff & Roles) | Goal 4: Management Support | Manager | Should |
    | PR-07 (Reporting) | Goal 4: Management Support | Manager | Should |
    | PR-08 (Info Flow) | Goal 2: Reduce Errors, Goal 3: Coordination, Goal 4: Management | Order, Kitchen, Inventory, Manager | Must |
    ---

    ### 2.5. Implicit Requirements
    Các yêu cầu ngầm định được suy ra từ PRD nhưng không được ghi rõ thành requirement độc lập.

    | ID | Implicit Requirement | Từ PRD | Lý do |
    | :--- | :--- | :--- | :--- |
    | **IR-01** | Hệ thống phải có khả năng xử lý nhiều đơn hàng đồng thời | PR-02, PR-04 | Nhà hàng có thể có nhiều đơn cùng lúc |
    | **IR-02** | Dữ liệu phải được lưu trữ và truy xuất đủ nhanh để hỗ trợ theo dõi trạng thái | PR-03, PR-08 | Cần cập nhật và theo dõi thông tin kịp thời |
    | **IR-03** | Giao diện phải dễ sử dụng cho nhân viên | All PRs | Nhân viên cần thao tác nhanh trong môi trường vận hành |
    | **IR-04** | Hệ thống phải có khả năng phục hồi khi xảy ra lỗi | PR-03 | Tránh mất thông tin hoặc trạng thái đơn hàng |

    > **ASSUMPTION:** Các implicit requirements trên là kết quả suy luận từ PRD, chưa phải business requirements đã được Human xác nhận.

    ---

    ## 3. MoSCoW Prioritization

    ### 3.1. Must Have
    Các requirement bắt buộc để hệ thống hỗ trợ được luồng vận hành cốt lõi:

    | ID | Requirement | Reason |
    | :--- | :--- | :--- |
    | **PR-01** | Menu | Cần thông tin món để thực hiện Order |
    | **PR-02** | Order | Là chức năng trung tâm của quy trình nhà hàng |
    | **PR-03** | Order Lifecycle | Cần theo dõi quá trình xử lý đơn |
    | **PR-04** | Kitchen | Bếp cần nhận và xử lý món |
    | **PR-05** | Inventory | Hỗ trợ kiểm soát nguyên liệu và tồn kho |
    | **PR-08** | Information Flow | Đảm bảo thông tin giữa các bộ phận được đồng bộ |

    #### Core Flow
    $$\text{Menu} \longrightarrow \text{Order} \longrightarrow \text{Order Lifecycle} \longrightarrow \text{Kitchen} \longrightarrow \text{Order Completion}$$

    *Inventory và Information Flow hỗ trợ luồng vận hành trên.*

    ---

    ### 3.2. Should Have

    | ID | Requirement | Reason |
    | :--- | :--- | :--- |
    | **PR-06** | Staff & Roles | Hỗ trợ Quản lý nhân viên và vai trò |
    | **PR-07** | Reporting | Hỗ trợ Quản lý giám sát hoạt động |

    *Các requirement này có giá trị cao nhưng không trực tiếp tạo ra luồng Order → Kitchen.*

    ---

    ### 3.3. Could Have
    * Chưa xác định requirement cụ thể thuộc nhóm Could Have.
    * Không tự động bổ sung tính năng mới vào scope.

    ---

    ### 3.4. Won't Have — Initial Release

    | Feature | Reason |
    | :--- | :--- |
    | **Multi-restaurant / Multi-branch** | Out of Scope |
    | **Delivery Logistics / Third Parties** | Out of Scope |
    | **Advanced Payment Gateway** | Out of Scope |
    | **Advanced Business Intelligence** | Out of Scope |
    | **Loyalty Program** | Out of Scope |
    | **Advanced Supply Chain** | Out of Scope |
    | **AI Meal Recommendation** | Out of Core Scope |

    ---

    ## 4. Requirement Risk Analysis

    ### 4.1. Risk Matrix

    | Risk ID | Requirement / Area | Risk | Impact | Likelihood | Priority |
    | :--- | :--- | :--- | :--- | :--- | :--- |
    | **R-01** | Order Lifecycle | Trạng thái đơn không rõ ràng có thể gây nhầm lẫn trong xử lý | High | High | High |
    | **R-02** | Information Flow | Thông tin giữa Order và Bếp không đồng bộ | High | High | High |
    | **R-03** | Inventory | Tồn kho không chính xác có thể ảnh hưởng hoạt động chế biến | High | Medium | High |
    | **R-04** | Menu | Thông tin món không chính xác có thể ảnh hưởng Order | Medium | Medium | Medium |
    | **R-05** | Staff & Roles | Phân quyền không phù hợp có thể ảnh hưởng hoạt động quản lý | High | Medium | High |
    | **R-06** | Reporting | Báo cáo không phản ánh đúng dữ liệu vận hành | Medium | Medium | Medium |
    | **R-07** | Scope | Scope mở rộng ngoài core product làm tăng độ phức tạp | High | Medium | High |

    ---

    ### 4.2. Riskiest Assumptions

    * **A-01 — Order → Kitchen là luồng vận hành cốt lõi**
    * **Risk:** High
    * Nếu luồng này không phản ánh đúng quy trình thực tế, nhiều requirement khác có thể bị ảnh hưởng.
    * **A-02 — Inventory chỉ cần quản lý ở mức cơ bản**
    * **Risk:** Medium
    * Mức độ chi tiết của quản lý nguyên liệu có thể làm thay đổi requirement.
    * **A-03 — Reporting cơ bản đáp ứng nhu cầu của Quản lý**
    * **Risk:** Medium
    * Nếu Quản lý cần KPI hoặc báo cáo chuyên sâu hơn, phạm vi Reporting cần được review.
    * **A-04 — Initial release tập trung vào mô hình nhà hàng hiện tại**
    * **Risk:** Medium
    * Nếu phát sinh nhu cầu multi-branch sớm, scope cần được xem xét lại.

    ---

    ## 5. Requirement Complexity Estimation

    *Ước lượng dưới đây là relative estimation, dùng để so sánh mức độ phức tạp tương đối.*

    | ID | Requirement | Complexity | Reason |
    | :--- | :--- | :--- | :--- |
    | **PR-01** | Menu | Low | Phạm vi tương đối rõ |
    | **PR-02** | Order | High | Trung tâm của nhiều hoạt động |
    | **PR-03** | Order Lifecycle | High | Liên quan nhiều trạng thái và bộ phận |
    | **PR-04** | Kitchen | Medium | Phụ thuộc vào Order |
    | **PR-05** | Inventory | Medium | Liên quan đến trạng thái nguyên liệu |
    | **PR-06** | Staff & Roles | Medium | Liên quan đến vai trò và quyền |
    | **PR-07** | Reporting | Medium | Phụ thuộc dữ liệu vận hành |
    | **PR-08** | Information Flow | High | Liên quan nhiều vai trò |

    #### Complexity Scale

    | Level | Meaning |
    | :--- | :--- |
    | **Low** | Phạm vi đơn giản, ít dependency |
    | **Medium** | Có nhiều business rules hoặc dependency |
    | **High** | Liên quan nhiều vai trò, trạng thái hoặc luồng nghiệp vụ |

    > Đây là relative estimation, chưa phải effort estimate theo giờ/ngày công.

    ---

    ## 6. Quality, Feasibility & Dependencies Analysis

    ### 6.1. Quality Characteristics

    | Requirement | Quality Characteristic | Why |
    | :--- | :--- | :--- |
    | **PR-01 (Menu)** | Accuracy, Usability | Menu phải chính xác và dễ xem |
    | **PR-02 (Order)** | Accuracy, Reliability | Đơn hàng phải chính xác, không bị mất |
    | **PR-03 (Lifecycle)** | Traceability, Performance | Có thể theo dõi và cập nhật kịp thời |
    | **PR-04 (Kitchen)** | Usability, Efficiency | Dễ sử dụng và hỗ trợ Bếp xử lý nhanh |
    | **PR-05 (Inventory)** | Accuracy, Consistency | Tồn kho cần chính xác và nhất quán |
    | **PR-06 (Staff)** | Security, Usability | Phân quyền an toàn và dễ quản lý |
    | **PR-07 (Reporting)** | Accuracy, Completeness | Báo cáo cần chính xác và đủ thông tin |
    | **PR-08 (Info Flow)** | Reliability, Timeliness | Thông tin cần đáng tin cậy và kịp thời |

    ---

    ### 6.2. Feasibility Assessment

    | ID | Requirement | Feasibility | Notes |
    | :--- | :--- | :--- | :--- |
    | **PR-01** | Menu | High | Phạm vi chức năng tương đối rõ |
    | **PR-02** | Order | High | Business logic chính có thể xác định từ PRD |
    | **PR-03** | Order Lifecycle | High | Có thể mô tả bằng các trạng thái nghiệp vụ |
    | **PR-04** | Kitchen | Medium | Cần phối hợp thông tin với Order |
    | **PR-05** | Inventory | High | Phạm vi basic inventory |
    | **PR-06** | Staff & Roles | High | Phạm vi role management cơ bản |
    | **PR-07** | Reporting | Medium | Phụ thuộc dữ liệu và KPI được xác định |
    | **PR-08** | Information Flow | Medium | Liên quan nhiều module và vai trò |

    > **ASSUMPTION:** Feasibility được đánh giá ở mức product/requirement analysis, chưa đánh giá theo một technology stack cụ thể vì công nghệ chưa được quyết định.

    ---

    ### 6.3. Detailed Dependency Matrix

    | Requirement | Depends On | Used By | Validation Status |
    |-------------|------------|---------|-------------------|
    | PR-01 (Menu) | - | PR-02 | ✅ Xác nhận |
    | PR-02 (Order) | PR-01 | PR-03, PR-04 | ✅ Xác nhận |
    | PR-03 (Lifecycle) | PR-02 | PR-04 | ✅ Xác nhận |
    | PR-04 (Kitchen) | PR-02, PR-03 | PR-05 | ⚠️ Cần xác nhận |
    | PR-05 (Inventory) | PR-04 | PR-02 | ⚠️ Cần xác nhận |
    | PR-06 (Staff) | - | All | ✅ Xác nhận |
    | PR-07 (Reporting) | PR-02, PR-05 | - | ⚠️ Cần xác nhận |
    | PR-08 (Info Flow) | PR-02, PR-03, PR-04 | All | ⚠️ Cần xác nhận |

    > **REVIEW NOTE:** Dependency giữa PR-02 và PR-05 cần được xác nhận lại ở cấp business rule trong các artifact tiếp theo, vì PRD hiện tại chưa mô tả chi tiết mối liên hệ giữa Order và Inventory.

    ---

    ## 7. Requirement Dependency Flow

    ### 7.1. Core Operational Dependency
    $$\text{PR-01 Menu} \longrightarrow \text{PR-02 Order} \longrightarrow \text{PR-03 Order Lifecycle} \longrightarrow \text{PR-04 Kitchen}$$

    ### 7.2. Supporting Dependency
    $$\text{PR-04 Kitchen} \longrightarrow \text{PR-05 Inventory}$$

    ### 7.3. Management Dependency
    $$\begin{array}{c} \text{PR-02 Order} \\ \text{PR-05 Inventory} \end{array} \Big\}\longrightarrow \text{PR-07 Reporting}$$

    ### 7.4. Information Flow
    $$\text{Customer} \iff \text{Order} \iff \text{Kitchen} \iff \text{Inventory} \longrightarrow \text{Management}$$

    > Đây là product-level dependency analysis, không phải technical architecture.

    ---

    ## 8. Gap Analysis

    ### 8.1. Identified Gaps

    | ID | Gap | Impact | Solution |
    | :--- | :--- | :--- | :--- |
    | **G-01** | Quy trình trạng thái đơn hàng chưa chi tiết | High | Cần xác định state flow cụ thể |
    | **G-02** | Tương tác Inventory với Menu chưa rõ | Medium | Cần xác định business rule |
    | **G-03** | Phân quyền Staff chưa chi tiết | Medium | Cần xác định role matrix |
    | **G-04** | KPI Reporting chưa xác định | Medium | Cần xác định metrics |
    | **G-05** | Payment method chưa xác định | Medium | Cần xác định danh sách |
    | **G-06** | Quản lý bàn / Takeaway chưa rõ | High | Cần quyết định scope |

    ---

    ### 8.2. Gap Resolution Plan

    | Gap | Resolution | Owner |
    | :--- | :--- | :--- |
    | **G-01** | Xác định state flow trong User Stories | Team |
    | **G-02** | Xác định trong Feature Specs | Team |
    | **G-03** | Xác định trong User Stories | Team |
    | **G-04** | Xác định trong Feature Specs | Manager |
    | **G-05** | Xác định trong PRD | Manager |
    | **G-06** | Quyết định trong Review | Manager |

    > **REVIEW NOTE:** Owner ở bảng trên là đề xuất phục vụ quản lý artifact; cần Team xác nhận trước khi áp dụng chính thức.

    ---

    ## 9. Requirement Quality Assessment

    | Criterion | Status | Evidence |
    | :--- | :--- | :--- |
    | **Aligned with Vision** | Pass | Problem Statement và Goals phù hợp Project Vision |
    | **Aligned with PRD** | Pass | PR-01 → PR-08 được trace về PRD |
    | **Feasible with team size** | Pass* | Scope hiện tại được giới hạn trong core product |
    | **Testable** | Pass | Có thể chuyển thành Acceptance Criteria |
    | **Traceable** | Pass | Mỗi requirement có ID riêng |
    | **Consistent** | Pass* | Không phát hiện conflict lớn với PRD |
    | **Complete** | Partial | Vẫn còn Open Questions và Gaps |

    *\* Các đánh giá này vẫn cần được Human Review xác nhận trước khi xem là final.*

    ---

    ## 10. Requirement Prioritization & Validation

    ### 10.1. Prioritization Summary

    | Priority | Requirements | Count | Focus |
    | :--- | :--- | :--- | :--- |
    | **Must Have** | PR-01, PR-02, PR-03, PR-04, PR-05, PR-08 | 6 | Core operations |
    | **Should Have** | PR-06, PR-07 | 2 | Management support |
    | **Could Have** | TBD | 0 | Future |
    | **Won't Have** | AI Recommendation, Multi-branch, Delivery, Advanced Payment, Advanced BI, Loyalty, Advanced Supply Chain | 7 | Out of scope |

    ---

    ### 10.2. Validation Criteria

    | Criterion | Status | Evidence |
    | :--- | :--- | :--- |
    | **Aligned with Vision** | Pass | Problem Statement matches Project Vision |
    | **Feasible with team size** | Pass* | Scope phù hợp với nhóm 2 người |
    | **Testable** | Pass | Có thể tạo Acceptance Criteria |
    | **Traceable** | Pass | Mỗi requirement có ID riêng |
    | **Complete** | Partial | Còn Open Questions |

    ---

    ### 10.3. Stakeholder Validation

    | Stakeholder | Validation Status |
    | :--- | :--- |
    | **Product Owner / Project Decision Maker** | Scope và Priorities Pending |
    | **Technical Reviewer** | Feasibility Pending |
    | **Team** | Understanding và consistency Pending |

    > Stakeholder validation ở đây là validation của artifact, không tạo thêm user role mới cho hệ thống.

    ---

    ## 11. Recommended Requirement Sequence

    Dựa trên priority và dependency, thứ tự phân tích đề xuất:

    1. **PR-01 — Menu**
    2. **PR-02 — Order**
    3. **PR-03 — Order Lifecycle**
    4. **PR-04 — Kitchen**
    5. **PR-05 — Inventory**
    6. **PR-08 — Information Flow**
    7. **PR-06 — Staff & Roles**
    8. **PR-07 — Reporting**


    ### 11.2. Rationale

    | Step | Requirement | Why This Order |
    |------|-------------|----------------|
    | 1 | PR-01 (Menu) | Nền tảng cho mọi hoạt động |
    | 2 | PR-02 (Order) | Trung tâm của luồng vận hành |
    | 3 | PR-03 (Lifecycle) | Cần hiểu rõ order để lifecycle |
    | 4 | PR-04 (Kitchen) | Phụ thuộc vào PR-02, PR-03 |
    | 5 | PR-05 (Inventory) | Hỗ trợ PR-04 |
    | 6 | PR-08 (Info Flow) | Kết nối các module |
    | 7 | PR-06 (Staff) | Quản lý, không phụ thuộc vận hành |
    | 8 | PR-07 (Reporting) | Phụ thuộc dữ liệu từ các module khác |

    ---

    ## 12. Open Questions

    Các vấn đề cần được xác nhận trước khi chuyển sang User Stories:
    1. Quy trình trạng thái đơn hàng cụ thể gồm những trạng thái nào?
    2. Khi nào một Order được chuyển từ Order Staff sang Kitchen?
    3. Kitchen có được phép thay đổi hoặc từ chối trạng thái món hay không?
    4. Inventory có liên kết trực tiếp với Menu/Recipe hay chỉ quản lý tồn kho cơ bản?
    5. Staff & Roles cần bao nhiêu mức quyền?
    6. Những KPI nào là bắt buộc trong Reporting?
    7. Payment trong initial release cần hỗ trợ những phương thức nào?
    8. Có cần quản lý bàn trong initial release hay không?
    9. Có cần hỗ trợ Takeaway trong initial release hay không?
    10. Khách hàng có bắt buộc phải có tài khoản hay không?

    ---

    ## 13. Human Decision Required

    ### 13.1. Priority Decisions

    | Item | Current | Options | Decision |
    | :--- | :--- | :--- | :--- |
    | **MoSCoW classification** | Draft | Must / Should / Could / Won't | Pending |
    | **Order Status Flow** | TBD | Xác định state flow | Pending |
    | **Inventory-Menu Link** | TBD | Auto / Manual / TBD | Pending |

    ---

    ### 13.2. Scope Decisions

    | Item | Current | Options | Decision |
    | :--- | :--- | :--- | :--- |
    | **Table Management** | TBD | In / Out | Pending |
    | **Takeaway Support** | TBD | In / Out | Pending |
    | **Payment Methods** | TBD | Xác định danh sách | Pending |


    ---

    ### 13.3. Validation Sign-off

    | Item | Status | Required By |
    | :--- | :--- | :--- |
    | **MoSCoW Approval** | Pending | Human Decision Maker |
    | **Risk Analysis Approval** | Pending | Team |
    | **Scope Confirmation** | Pending | Human Decision Maker |
    | **Dependency Validation** | Pending | Team |
    | **Gap Analysis Approval** | Pending | Team |

    ---

    ## 14. AI Contribution

    **AI được sử dụng để hỗ trợ:**
    * Extract explicit requirements từ PRD.
    * Suy luận implicit requirements.
    * Phân loại requirement theo MoSCoW.
    * Nhận diện dependencies.
    * Đề xuất risk analysis.
    * Đề xuất quality characteristics.
    * Đề xuất feasibility assessment.
    * Nhận diện gaps.
    * Đề xuất requirement sequence.
    * Kiểm tra traceability và consistency.

    **AI không tự quyết định:**
    * Thay đổi Product Scope.
    * Thêm feature mới.
    * Xác định business rule cuối cùng.
    * Phê duyệt requirement.
    * Xác định final priority nếu chưa có Human Decision.

    ---

    ## 15. Glossary Update

    | Term | Definition | Context |
    | :--- | :--- | :--- |
    | **Order Lifecycle** | Các trạng thái của đơn hàng từ lúc tạo đến khi hoàn thành | PR-03 |
    | **State Flow** | Luồng chuyển đổi giữa các trạng thái | PR-03 |
    | **Information Flow** | Luồng thông tin giữa các bộ phận | PR-08 |
    | **Stock Level** | Số lượng nguyên liệu hiện tại | PR-05 |
    | **Min Level** | Ngưỡng tồn kho tối thiểu dùng để xác định nhu cầu kiểm soát tồn kho | PR-05 |
    | **Explicit Requirement** | Yêu cầu được ghi rõ trong tài liệu nguồn | Requirement Extraction |
    | **Implicit Requirement** | Yêu cầu được suy ra từ mục tiêu, scope hoặc requirement hiện có | Requirement Extraction |
    | **MoSCoW** | Phương pháp phân loại Must, Should, Could và Won't | Prioritization |
    | **Dependency** | Mối quan hệ trong đó một requirement cần requirement khác để hỗ trợ hoặc thực hiện | Dependency Analysis |
    | **Gap** | Khoảng thiếu hoặc điểm chưa được xác định đầy đủ trong requirements | Gap Analysis |

    ---

    ## 16. Artifact Status

    | Attribute | Status |
    | :--- | :--- |
    | **Artifact** | 3.3 Requirement Analysis |
    | **Status** | Draft - Awaiting Review |
    | **Based on** | 3.2 PRD — Approved |
    | **Human Review** | Pending |
    | **Requirement Extraction** | Completed — Draft |
    | **Implicit Requirements** | Identified — Draft |
    | **MoSCoW** | Completed — Draft |
    | **Risk Analysis** | Completed — Draft |
    | **Quality Analysis** | Completed — Draft |
    | **Feasibility Analysis** | Completed — Draft |
    | **Dependency Analysis** | Completed — Draft |
    | **Gap Analysis** | Completed — Draft |
    | **Validation** | Pending |
    | **Human Decision** | Pending |

    ---

    ## 17. Review Gate

    Artifact **3.3 Requirement Analysis** chỉ được chuyển sang **Approved** sau khi Human Review xác nhận:

    - [ ] Explicit Requirements.
    - [ ] Implicit Requirements.
    - [ ] MoSCoW Prioritization.
    - [ ] Risk Analysis.
    - [ ] Quality Characteristics.
    - [ ] Feasibility Assessment.
    - [ ] Dependency Matrix.
    - [ ] Gap Analysis.
    - [ ] Requirement Prioritization & Validation.
    - [ ] Open Questions.
    - [ ] Human Decision Required.
    - [ ] Glossary Update.
