# Tầm Nhìn Dự Án (Project Vision)

## 1. Tổng Quan Dự Án

Dự án này là một **Hệ thống Quản lý Nhà hàng** được thiết kế để kết nối các vai trò cốt lõi trong hoạt động của một nhà hàng — Khách hàng, Nhân viên Order, Quản lý, Nhân viên Kho, và Nhân viên Bếp — vào một nền tảng thống nhất. Thay vì xử lý việc đặt món, chế biến trong bếp, quản lý kho, và báo cáo như những hoạt động thủ công hoặc rời rạc, hệ thống hướng đến việc gắn kết chúng lại để thông tin có thể luân chuyển thông suốt giữa các vai trò và các giai đoạn vận hành.

Dự án sẽ được xây dựng với sự hỗ trợ của AI trong suốt vòng đời phát triển (phân tích yêu cầu, lập kế hoạch, mô hình hóa, tạo task, và đánh giá), và — sau khi hệ thống cốt lõi hoàn thiện — có thể bổ sung tính năng **gợi ý món ăn bằng AI** như một tính năng nâng cao dành cho sản phẩm.

## 2. Phát Biểu Vấn Đề (Problem Statement)

Các nhà hàng vận hành thủ công hoặc sử dụng nhiều hệ thống rời rạc thường gặp phải các vấn đề sau:

- **Đặt món của khách hàng:** Khách hàng có thể gặp khó khăn khi đặt món do quy trình chậm, dễ sai sót, không có cách dễ dàng để xem thực đơn, đặt món, hoặc theo dõi trạng thái đơn hàng.
- **Xử lý đơn hàng:** Nhân viên Order có thể gặp khó khăn trong việc theo dõi đơn hàng chính xác, dẫn đến thất lạc, trùng lặp, hoặc chậm trễ đơn hàng, đặc biệt vào giờ cao điểm.
- **Phối hợp trong bếp:** Nhân viên Bếp có thể không nhận được đơn hàng kịp thời hoặc có tổ chức, gây nhầm lẫn về thứ tự ưu tiên chế biến và trạng thái đơn hàng.
- **Quản lý kho:** Nhân viên Kho có thể thiếu khả năng theo dõi tồn kho theo thời gian thực, dẫn đến thiếu nguyên liệu hoặc lãng phí do quản lý kém.
- **Quản lý nhân sự:** Quản lý có thể gặp khó khăn trong việc theo dõi vai trò, trách nhiệm, và hiệu suất của nhân viên nếu không có hệ thống tập trung.
- **Quản lý nhà hàng:** Quản lý có thể thiếu một cái nhìn tổng thể về hoạt động hàng ngày, khiến việc ra quyết định kịp thời trở nên khó khăn hơn.
- **Báo cáo:** Nếu không có dữ liệu tích hợp, việc tạo báo cáo doanh thu, tồn kho, hoặc hiệu suất trở nên chậm và dễ sai sót.
- **Đồng bộ thông tin:** Các hệ thống rời rạc hoặc phối hợp thủ công (ví dụ: phiếu giấy, trao đổi bằng lời) làm tăng nguy cơ hiểu nhầm giữa các vai trò.

Đây là những vấn đề phổ biến ở các nhà hàng vừa và nhỏ chưa áp dụng hệ thống số hóa tích hợp.

## 3. Mục Tiêu Dự Án

Mục tiêu chính của hệ thống là **cải thiện hiệu quả, độ chính xác, và sự phối hợp trong vận hành nhà hàng** bằng cách kết nối khách hàng, nhân viên, và quản lý thông qua một nền tảng thống nhất. Hệ thống cần giảm thiểu sai sót thủ công, tăng tốc độ trao đổi thông tin giữa các vai trò, và giúp quản lý có cái nhìn rõ ràng hơn về hoạt động hàng ngày của nhà hàng — từ đó cải thiện trải nghiệm khách hàng và chất lượng ra quyết định quản lý.

Mục tiêu này tập trung vào giá trị kinh doanh và sự cải thiện vận hành, không phải vào một giải pháp kỹ thuật cụ thể.

## 4. Đối Tượng Người Dùng

### 4.1 Khách Hàng

- **Là ai:** Những người muốn xem thực đơn và đặt món tại nhà hàng.
- **Cần gì từ hệ thống:** Một cách dễ dàng và đáng tin cậy để xem các món ăn có sẵn, đặt món, và theo dõi trạng thái đơn hàng.
- **Vấn đề được giải quyết:** Giảm sự nhầm lẫn khi đặt món, thời gian chờ đợi, và hiểu lầm về chi tiết đơn hàng.

### 4.2 Nhân Viên Order

- **Là ai:** Nhân viên chịu trách nhiệm tiếp nhận và quản lý đơn đặt món của khách hàng (ví dụ: nhân viên phục vụ hoặc thu ngân).
- **Cần gì từ hệ thống:** Một cách rõ ràng để ghi nhận đơn hàng, gửi đến bếp, và theo dõi tiến độ đơn hàng.
- **Vấn đề được giải quyết:** Giảm sai sót khi nhập đơn, đơn hàng bị bỏ sót, và nhầm lẫn về việc đơn đã được gửi đến bếp hay chưa.

### 4.3 Nhân Viên Bếp

- **Là ai:** Nhân viên chịu trách nhiệm chế biến món ăn dựa trên các đơn hàng đến.
- **Cần gì từ hệ thống:** Một cái nhìn rõ ràng, có tổ chức, và kịp thời về các đơn cần chế biến, cùng với mức độ ưu tiên/trạng thái của chúng.
- **Vấn đề được giải quyết:** Giảm sự chậm trễ, hiểu lầm về chi tiết đơn hàng, và thứ tự chế biến thiếu tổ chức.

### 4.4 Nhân Viên Kho

- **Là ai:** Nhân viên chịu trách nhiệm quản lý nguyên liệu và vật tư trong kho.
- **Cần gì từ hệ thống:** Khả năng theo dõi mức tồn kho hiện tại, xu hướng sử dụng, và nhu cầu nhập hàng.
- **Vấn đề được giải quyết:** Giảm nguy cơ hết nguyên liệu hoặc nhập hàng dư thừa do theo dõi kém.

### 4.5 Quản Lý

- **Là ai:** Người (hoặc những người) giám sát toàn bộ hoạt động, nhân sự, và hiệu suất của nhà hàng.
- **Cần gì từ hệ thống:** Một cái nhìn tổng hợp về đơn hàng, tồn kho, hoạt động nhân sự, và báo cáo doanh thu/hiệu suất.
- **Vấn đề được giải quyết:** Giảm khó khăn khi ra quyết định do thiếu dữ liệu vận hành tích hợp và cập nhật.

## 5. Phạm Vi Dự Án

### 5.1 Trong Phạm Vi (In Scope)

- Xem thực đơn và đặt món dành cho khách hàng
- Tạo, theo dõi, và cập nhật trạng thái đơn hàng (Nhân viên Order)
- Hàng đợi đơn hàng và quản lý trạng thái trong bếp (Nhân viên Bếp)
- Theo dõi tồn kho cơ bản (mức tồn kho, mức sử dụng) (Nhân viên Kho)
- Quản lý nhân sự/vai trò cơ bản (Quản lý)
- Báo cáo vận hành cơ bản (ví dụ: tổng hợp doanh thu, số lượng đơn hàng)
- Luồng thông tin và phối hợp cốt lõi giữa năm vai trò

### 5.2 Ngoài Phạm Vi (Out of Scope) — cho phiên bản hoàn chỉnh đầu tiên

- Hỗ trợ đa nhà hàng hoặc đa chi nhánh
- Logistics giao hàng và tích hợp với bên giao hàng thứ ba
- Tích hợp cổng thanh toán nâng cao (nhiều nhà cung cấp thanh toán)
- Phân tích nâng cao hoặc bảng điều khiển business intelligence
- Chương trình khách hàng thân thiết/tích điểm
- Tính năng gợi ý món ăn bằng AI (dự kiến bổ sung sau khi hệ thống cốt lõi hoàn thiện)
- Quản lý chuỗi cung ứng hoặc nhà cung cấp nâng cao

Phạm vi được giữ ở mức thực tế và khả thi cho một dự án phần mềm của sinh viên, tránh việc mở rộng liên tục vượt ra ngoài nhu cầu vận hành cốt lõi.

## 6. Các Khu Vực Chức Năng Cốt Lõi Của Hệ Thống

- **Quản lý Khách hàng:** Quản lý thông tin liên quan đến khách hàng cần thiết cho việc đặt món (ví dụ: hồ sơ/lịch sử đơn hàng cơ bản, nếu có tài khoản). Thuộc hệ thống vì đây là nền tảng cho việc đặt món và có thể phục vụ cá nhân hóa sau này.
- **Quản lý Nhân sự:** Quản lý vai trò và quyền truy cập của Nhân viên Order, Nhân viên Bếp, Nhân viên Kho, và Quản lý. Cần thiết để phối hợp trách nhiệm và kiểm soát truy cập.
- **Quản lý Thực đơn:** Quản lý các món ăn có thể đặt, bao gồm trạng thái còn hàng/hết hàng. Cần thiết vì đây là nền tảng của quy trình đặt món.
- **Quản lý Đơn hàng:** Quản lý vòng đời của một đơn hàng từ lúc đặt đến khi hoàn thành. Là trung tâm kết nối Khách hàng, Nhân viên Order, và Nhân viên Bếp.
- **Quản lý Bếp:** Quản lý cách các đơn hàng đến được xếp hàng, ưu tiên, và đánh dấu đã chế biến xong. Cần thiết cho việc phối hợp trong bếp.
- **Quản lý Kho:** Quản lý mức tồn kho nguyên liệu/vật tư và theo dõi mức sử dụng. Cần thiết để ngăn ngừa thiếu hụt và hỗ trợ Nhân viên Kho.
- **Thanh toán:** Quản lý việc ghi nhận giao dịch cơ bản cho các đơn hàng đã hoàn thành. Cần thiết để khép lại vòng đời đơn hàng, dù việc tích hợp thanh toán nâng cao nằm ngoài phạm vi.
- **Báo cáo:** Cung cấp các báo cáo tổng hợp về doanh thu, đơn hàng, và tồn kho cho Quản lý. Cần thiết để hỗ trợ ra quyết định vận hành.

*(Khu vực Đánh giá/Phản hồi đã được xem xét nhưng chưa đưa vào phạm vi cốt lõi ban đầu, vì nó không thiết yếu đối với luồng vận hành chính — có thể được xem xét lại sau.)*

## 7. Vai Trò Của AI Trong Quá Trình Phát Triển

AI sẽ được sử dụng như một **trợ lý phát triển (development assistant)** trong suốt vòng đời dự án, hỗ trợ (nhưng không thay thế) việc ra quyết định của con người ở từng giai đoạn:

- **Phân tích Yêu cầu:** Hỗ trợ xác định và tổ chức các yêu cầu chức năng và phi chức năng từ ý tưởng ban đầu của dự án.
- **Phân tích Người dùng:** Hỗ trợ phân tích nhu cầu, mục tiêu, và các vấn đề của từng vai trò trong năm vai trò người dùng.
- **Luồng Người dùng (User Flow):** Hỗ trợ thiết kế các luồng thao tác logic, từng bước cho cách mỗi vai trò tương tác với hệ thống (ở giai đoạn sau).
- **Phân tích Use Case:** Hỗ trợ xác định và cấu trúc các use case khi phạm vi và vai trò đã được hiểu rõ.
- **Mô hình hóa:** Hỗ trợ xây dựng các mô hình hệ thống (ví dụ: sơ đồ khái niệm) dựa trên các yêu cầu đã xác định.
- **Lập kế hoạch:** Hỗ trợ các hoạt động lập kế hoạch dự án như sắp xếp ưu tiên và phân kỳ.
- **Tạo Task:** Hỗ trợ chia nhỏ các tính năng thành các task phát triển cụ thể.
- **Phát triển:** Hỗ trợ triển khai sau khi thiết kế và lập kế hoạch đã hoàn tất.
- **Đánh giá:** Hỗ trợ đánh giá và xác thực các yêu cầu, mô hình, và kết quả ở mỗi giai đoạn.

Việc sử dụng AI này hoàn toàn nhằm **tăng tốc và hỗ trợ quá trình phát triển** — đây là công cụ dành cho nhóm phát triển, không phải là tính năng mà người dùng cuối tương tác trực tiếp.

## 8. Tính Năng AI Trong Sản Phẩm

Khác với vai trò trợ lý phát triển, dự án có thể bao gồm một **tính năng AI dành cho sản phẩm**: **Gợi ý Món ăn**.

- Hệ thống có thể phân tích lịch sử đặt món và hành vi của khách hàng để gợi ý các món ăn phù hợp với sở thích của họ.
- Tính năng này dự kiến được triển khai **sau khi hệ thống cốt lõi đã hoàn thiện và ổn định**, như một tính năng nâng cao chứ không phải yêu cầu bắt buộc.
- Ở giai đoạn này, logic gợi ý, thuật toán, hoặc mô hình machine learning cụ thể **chưa được thiết kế** — việc này sẽ được để lại cho một giai đoạn phân tích chuyên biệt sau này, khi đã có đủ dữ liệu đơn hàng và bối cảnh hệ thống.

## 9. Kết Quả Mong Đợi

Từ góc nhìn người dùng, phiên bản hoàn chỉnh đầu tiên của dự án cần cung cấp:

- Một nền tảng hoạt động cho phép **Khách hàng** xem thực đơn và đặt món mà không gặp nhầm lẫn.
- Một cách đáng tin cậy để **Nhân viên Order** quản lý và theo dõi các đơn hàng đến.
- Một hàng đợi rõ ràng, có tổ chức để **Nhân viên Bếp** biết cần chế biến gì và theo thứ tự nào.
- Một cách để **Nhân viên Kho** theo dõi và quản lý mức tồn kho nguyên liệu.
- Một cái nhìn tập trung để **Quản lý** giám sát hoạt động, nhân sự, và báo cáo hiệu suất cơ bản.
- Một hệ thống mà thông tin luân chuyển nhất quán giữa cả năm vai trò, giảm thiểu hiểu lầm và sai sót thủ công so với các quy trình thủ công hoặc rời rạc.

Trọng tâm là một hệ thống cốt lõi hoạt động tốt, có sự phối hợp — không phải công nghệ cao cấp hay tập hợp tính năng lớn.

## 10. Giả Định và Câu Hỏi Còn Bỏ Ngỏ

Các điểm sau đây chưa được quyết định và cần được làm rõ ở các giai đoạn phân tích sau:

- Quy mô giả định của nhà hàng là gì (nhà hàng độc lập nhỏ hay cơ sở lớn hơn)?
- Hệ thống chỉ hỗ trợ một nhà hàng duy nhất, hay có dự kiến hỗ trợ đa chi nhánh/đa nhà hàng sau này?
- Những phương thức thanh toán nào cần được hỗ trợ (chỉ tiền mặt, thẻ, ví điện tử, v.v.)?
- Quản lý bàn (ví dụ: gán bàn, đặt bàn trước) có cần thiết cho phiên bản đầu tiên không?
- Chức năng giao hàng/mang đi có được bao gồm không, hay hệ thống chỉ giới hạn ở việc đặt món tại chỗ?
- Khách hàng có cần tạo tài khoản không, hay có thể đặt món mà không cần đăng ký?
- Mức độ chi tiết mong đợi cho quản lý nhân sự là gì (ví dụ: xếp lịch ca làm, tính lương) so với chỉ kiểm soát truy cập theo vai trò cơ bản?
- Những chỉ số báo cáo nào được xem là thiết yếu cho Quản lý trong phiên bản đầu tiên?
- Tính năng đánh giá/phản hồi của khách hàng có được mong đợi trong phiên bản đầu tiên không, hay sẽ được hoãn lại cùng với tính năng gợi ý?

Các mục này được liệt kê như những câu hỏi còn bỏ ngỏ chứ không phải quyết định đã được xác nhận, và cần được làm rõ trước khi chuyển sang giai đoạn thiết kế use case và user flow chi tiết.