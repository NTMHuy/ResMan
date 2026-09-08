# Phân Tích Actor & Nhu Cầu Người Dùng (Actor & User Needs Analysis)

*Tài liệu tham chiếu: `docs/01-project-vision.md`*

## 1. Tổng Quan Về Actor

Hệ thống Quản lý Nhà hàng có **năm (5) actor đã được xác nhận**, phản ánh đúng các vai trò đã nêu trong Project Vision:

1. **Khách hàng (Customer)** — người khởi tạo nhu cầu đặt món.
2. **Nhân viên Order (Order Staff)** — người tiếp nhận và xử lý đơn hàng.
3. **Nhân viên Bếp (Kitchen Staff)** — người chế biến món ăn theo đơn hàng.
4. **Nhân viên Kho (Warehouse Staff)** — người quản lý nguyên liệu/vật tư.
5. **Quản lý (Manager)** — người giám sát toàn bộ hoạt động nhà hàng.

Năm actor này được giữ nguyên, không bị loại bỏ hay thay thế, vì chúng nhất quán với các vai trò người dùng đã được xác nhận trong Project Vision (Mục 4). Tài liệu này không giới thiệu actor mới vào phạm vi xác nhận; các actor tiềm năng khác (nếu có) chỉ được đề xuất và gắn nhãn rõ ràng ở Mục 8.

## 2. Phân Tích Actor

### 2.1 Khách Hàng (Customer)

- **Là ai:** Người đến nhà hàng (hoặc tương tác với hệ thống đặt món) với mục đích thưởng thức món ăn.
- **Vai trò trong nhà hàng:** Người tiêu dùng dịch vụ — khởi đầu chuỗi hoạt động của toàn bộ hệ thống bằng việc đặt món.
- **Mục tiêu chính:** Đặt món một cách nhanh chóng, chính xác, và theo dõi được trạng thái đơn hàng của mình.
- **Mối quan hệ với hệ thống:** Là actor bên ngoài tương tác trực tiếp với hệ thống thông qua giao diện đặt món (xem thực đơn, đặt món, theo dõi đơn).

### 2.2 Nhân Viên Order (Order Staff)

- **Là ai:** Nhân viên tiếp xúc trực tiếp với khách hàng để tiếp nhận đơn đặt món (ví dụ: nhân viên phục vụ, thu ngân).
- **Vai trò trong nhà hàng:** Cầu nối giữa Khách hàng và Nhân viên Bếp; đảm bảo đơn hàng được ghi nhận và chuyển tiếp chính xác.
- **Mục tiêu chính:** Ghi nhận đơn hàng không sai sót và đảm bảo đơn được gửi đến bếp kịp thời.
- **Mối quan hệ với hệ thống:** Tương tác trực tiếp với hệ thống để tạo đơn hàng, cập nhật trạng thái, và theo dõi tiến độ xử lý.

### 2.3 Nhân Viên Bếp (Kitchen Staff)

- **Là ai:** Nhân viên chịu trách nhiệm chế biến món ăn.
- **Vai trò trong nhà hàng:** Thực hiện việc chuẩn bị món ăn dựa trên các đơn hàng đã được xác nhận.
- **Mục tiêu chính:** Nhận đơn hàng rõ ràng, đúng thứ tự ưu tiên, và cập nhật trạng thái chế biến chính xác.
- **Mối quan hệ với hệ thống:** Tương tác với hệ thống thông qua hàng đợi đơn hàng (order queue), cập nhật trạng thái món khi hoàn thành.

### 2.4 Nhân Viên Kho (Warehouse Staff)

- **Là ai:** Nhân viên quản lý nguyên liệu và vật tư của nhà hàng.
- **Vai trò trong nhà hàng:** Đảm bảo nguồn nguyên liệu luôn sẵn có cho việc chế biến, tránh thiếu hụt hoặc lãng phí.
- **Mục tiêu chính:** Theo dõi chính xác mức tồn kho và nhận biết kịp thời khi cần nhập thêm nguyên liệu.
- **Mối quan hệ với hệ thống:** Tương tác với hệ thống để cập nhật số lượng tồn kho, ghi nhận mức sử dụng, và xem cảnh báo tồn kho thấp (nếu có).

### 2.5 Quản Lý (Manager)

- **Là ai:** Người giám sát và điều hành hoạt động chung của nhà hàng.
- **Vai trò trong nhà hàng:** Ra quyết định vận hành dựa trên dữ liệu tổng hợp từ các bộ phận khác nhau.
- **Mục tiêu chính:** Có cái nhìn tổng thể, kịp thời về đơn hàng, tồn kho, nhân sự, và hiệu suất kinh doanh.
- **Mối quan hệ với hệ thống:** Tương tác với hệ thống ở mức giám sát và báo cáo — xem báo cáo tổng hợp, quản lý nhân sự, và theo dõi hoạt động chung (không trực tiếp thực hiện các thao tác vận hành hàng ngày như đặt món hay chế biến).

## 3. Nhu Cầu Người Dùng

Nhu cầu của từng actor được nhóm theo các danh mục logic:

| Danh mục | Khách hàng | Nhân viên Order | Nhân viên Bếp | Nhân viên Kho | Quản lý |
|---|---|---|---|---|---|
| **Thông tin (Information)** | Xem thực đơn, giá cả, tình trạng món | Xem chi tiết đơn hàng | Xem chi tiết đơn cần chế biến | Xem mức tồn kho hiện tại | Xem tổng quan hoạt động |
| **Đặt món (Ordering)** | Đặt món, chỉnh sửa đơn (nếu chưa xử lý) | Tạo/chuyển đơn hàng đến bếp | — | — | — |
| **Quản lý (Management)** | — | Quản lý danh sách đơn đang xử lý | Quản lý thứ tự chế biến | Quản lý số lượng nguyên liệu | Quản lý nhân sự, thực đơn |
| **Giám sát (Monitoring)** | Theo dõi trạng thái đơn của mình | Theo dõi tiến độ đơn hàng | Theo dõi hàng đợi chế biến | Theo dõi mức tồn kho, cảnh báo thiếu hụt | Giám sát toàn bộ hoạt động |
| **Giao tiếp (Communication)** | Nhận thông báo trạng thái đơn | Trao đổi trạng thái với bếp | Cập nhật trạng thái món cho Order Staff | Thông báo tình trạng nguyên liệu cho Quản lý | Nhận thông tin từ các bộ phận |
| **Báo cáo (Reporting)** | — | — | — | Báo cáo tình trạng tồn kho | Xem báo cáo doanh thu, đơn hàng, hiệu suất |

## 4. Trách Nhiệm Của Actor

- **Khách hàng:** Chịu trách nhiệm cung cấp thông tin đặt món chính xác (món, số lượng, ghi chú nếu có).
- **Nhân viên Order:** Chịu trách nhiệm nhập đơn hàng đúng, đầy đủ, và chuyển tiếp kịp thời đến bếp; cập nhật trạng thái đơn khi cần.
- **Nhân viên Bếp:** Chịu trách nhiệm chế biến món ăn theo đúng đơn hàng và cập nhật trạng thái hoàn thành.
- **Nhân viên Kho:** Chịu trách nhiệm theo dõi và cập nhật số lượng nguyên liệu tồn kho, đảm bảo dữ liệu tồn kho phản ánh đúng thực tế.
- **Quản lý:** Chịu trách nhiệm giám sát hoạt động chung, quản lý nhân sự và thực đơn, và ra quyết định dựa trên báo cáo hệ thống cung cấp.

Các trách nhiệm được phân định rõ để tránh chồng chéo. Điểm giao thoa duy nhất đáng lưu ý là giữa **Nhân viên Order** và **Nhân viên Bếp** trong việc cập nhật trạng thái đơn hàng (Order Staff tạo đơn, Kitchen Staff cập nhật trạng thái chế biến) — đây là sự chồng chéo hợp lý vì cả hai đều tham gia vào cùng một vòng đời đơn hàng ở các giai đoạn khác nhau.

## 5. Mục Tiêu Của Actor

| Actor | Kết quả mong đợi từ hệ thống |
|---|---|
| Khách hàng | Đặt món dễ dàng, nhanh chóng, và biết chắc đơn hàng của mình đang được xử lý |
| Nhân viên Order | Quản lý đơn hàng không sai sót, giảm thời gian xử lý thủ công |
| Nhân viên Bếp | Nhận đơn hàng rõ ràng, đúng thứ tự, giảm nhầm lẫn khi chế biến |
| Nhân viên Kho | Luôn biết chính xác mức tồn kho, tránh thiếu hụt hoặc lãng phí nguyên liệu |
| Quản lý | Có dữ liệu tổng hợp, kịp thời để ra quyết định vận hành và kinh doanh |

Đây là các mục tiêu ở góc độ người dùng (user goals), không phải chức năng hệ thống cụ thể.

## 6. Mối Quan Hệ Actor–Hệ Thống

- **Khách hàng ↔ Hệ thống:** Tương tác ở lớp giao diện đặt món — xem thực đơn, tạo đơn hàng, theo dõi trạng thái.
- **Nhân viên Order ↔ Hệ thống:** Tương tác ở lớp xử lý đơn hàng — nhập đơn, chuyển đơn, theo dõi tiến độ.
- **Nhân viên Bếp ↔ Hệ thống:** Tương tác ở lớp hàng đợi bếp — nhận đơn, cập nhật trạng thái chế biến.
- **Nhân viên Kho ↔ Hệ thống:** Tương tác ở lớp quản lý tồn kho — cập nhật số lượng, ghi nhận sử dụng.
- **Quản lý ↔ Hệ thống:** Tương tác ở lớp giám sát và báo cáo — xem báo cáo tổng hợp, quản lý nhân sự và thực đơn.

Đây là mô tả ở mức tổng quan; các luồng tương tác chi tiết (user flow) sẽ được thiết kế ở giai đoạn phân tích tiếp theo.

## 7. Ma Trận Actor

Ma trận dưới đây thể hiện mối liên hệ giữa các actor và các khu vực chức năng cốt lõi đã xác định trong Project Vision (Mục 6).

Chú thích: ✓ = Trách nhiệm chính | ○ = Tương tác phụ | — = Không liên quan trực tiếp

| Khu vực chức năng | Khách hàng | Nhân viên Order | Nhân viên Bếp | Nhân viên Kho | Quản lý |
|---|---|---|---|---|---|
| Quản lý Khách hàng | ○ | ○ | — | — | ○ |
| Quản lý Nhân sự | — | — | — | — | ✓ |
| Quản lý Thực đơn | ○ | ○ | — | — | ✓ |
| Quản lý Đơn hàng | ✓ | ✓ | ○ | — | ○ |
| Quản lý Bếp | — | ○ | ✓ | — | ○ |
| Quản lý Kho | — | — | ○ | ✓ | ○ |
| Thanh toán | ○ | ✓ | — | — | ○ |
| Báo cáo | — | — | — | ○ | ✓ |

## 8. Actor Bổ Sung Tiềm Năng

Các actor dưới đây **chưa được xác nhận** trong phạm vi hệ thống, nhưng được đề xuất để cân nhắc trong các giai đoạn phân tích sau, dựa trên các khoảng trống tiềm ẩn trong luồng vận hành:

- **[Suggested Actor] Quản trị viên hệ thống (System Administrator):** Có thể cần thiết để quản lý cấu hình hệ thống, tài khoản người dùng, và phân quyền — khác với vai trò vận hành của Quản lý. Chưa được xác nhận vì Project Vision chưa đề cập đến nhu cầu quản trị kỹ thuật riêng biệt.
- **[External Actor] Nhà cung cấp (Supplier):** Có thể liên quan gián tiếp đến Quản lý Kho (ví dụ: khi cần nhập thêm nguyên liệu), nhưng không phải là người dùng trực tiếp của hệ thống trong phạm vi hiện tại. Được xem là actor bên ngoài, không tương tác trực tiếp với hệ thống trừ khi phạm vi được mở rộng trong tương lai.
- **[External Actor] Cổng thanh toán bên thứ ba (Payment Gateway):** Nếu hệ thống tích hợp thanh toán điện tử trong tương lai, đây sẽ là một actor bên ngoài. Hiện tại, theo Project Vision, tích hợp thanh toán nâng cao nằm ngoài phạm vi (Out of Scope).
- **[Optional Actor] Khách hàng vãng lai không có tài khoản (Guest Customer):** Nếu hệ thống hỗ trợ đặt món không cần đăng ký (một trong những câu hỏi mở trong Project Vision), đây có thể là một biến thể của actor Khách hàng chứ không phải actor hoàn toàn mới.

Các actor này **không được đưa vào phạm vi xác nhận** của hệ thống ở giai đoạn này. Việc có bổ sung chúng hay không cần được quyết định sau khi các câu hỏi mở trong Project Vision (Mục 10) được làm rõ.

## 9. Câu Hỏi Còn Bỏ Ngỏ

- Khách hàng có bắt buộc phải có tài khoản để đặt món không, hay có thể đặt món dưới dạng khách vãng lai (guest)? (Ảnh hưởng đến việc có cần một biến thể actor riêng hay không.)
- Có cần một vai trò quản trị hệ thống riêng biệt (System Administrator) để quản lý cấu hình và phân quyền, tách biệt khỏi vai trò Quản lý (Manager) không?
- Nhà cung cấp nguyên liệu (Supplier) có cần tương tác trực tiếp với hệ thống (ví dụ: nhận đơn đặt hàng tự động) hay việc này vẫn được xử lý thủ công ngoài hệ thống?
- Nếu tích hợp thanh toán điện tử được bổ sung sau này, actor "Cổng thanh toán" sẽ được xử lý như một actor bên ngoài chính thức như thế nào?
- Vai trò Quản lý có thể được chia nhỏ (ví dụ: Quản lý ca, Quản lý tổng) trong các nhà hàng có quy mô lớn hơn không, hay được xem là một vai trò duy nhất trong phạm vi dự án này?

Các câu hỏi này cần được làm rõ trước khi chuyển sang giai đoạn phân tích use case và user flow chi tiết.