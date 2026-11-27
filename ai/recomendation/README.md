AI Recommendation – Hệ thống suy luận sở thích và gợi ý món ăn

Project: ResMan AI Recommendation
Version: 1.0.1
Status: Business Direction Confirmed – Technical Design In Progress

1. Giới thiệu dự án

AI Recommendation là hệ thống hỗ trợ gợi ý món ăn cho khách hàng trong phần mềm quản lý nhà hàng ResMan.

Mục tiêu của hệ thống không đơn thuần là tìm những món có đặc điểm tương tự với món khách đã gọi. Hệ thống cần phân tích toàn bộ danh sách món ăn trong một phiên ăn để nhận diện và suy luận các xu hướng sở thích của cả bàn.

Từ những sở thích khách hàng cung cấp và những sở thích được hệ thống suy luận, AI đánh giá mức độ phù hợp của các món chưa được gọi, sau đó đề xuất những món đạt ngưỡng điểm yêu cầu.

Hệ thống hoạt động theo phạm vi từng phiên ăn (dining_session), không xây dựng hồ sơ sở thích cá nhân của khách hàng.

1.1. Mục tiêu

Hiểu các đặc trưng của món ăn trong menu.

Nhận diện và suy luận nhiều xu hướng sở thích của một bàn cùng lúc.

Cho phép khách hàng chủ động cung cấp sở thích thông qua bộ câu hỏi tùy chọn.

Phân biệt sở thích khách xác nhận với sở thích hệ thống suy luận.

Đánh giá mức độ phù hợp của các món chưa được gọi.

Cập nhật kết quả khi bàn gọi thêm món.

Tạo nền tảng để cải thiện hệ thống khi có thêm dữ liệu thực tế.

1.2. Định hướng cốt lõi

Đối tượng được phân tích là cả bàn ăn, không phải từng cá nhân.

Ví dụ:

Một bàn đã gọi nhiều món cay và một số món hải sản. Hệ thống có thể nhận diện xu hướng ưu tiên món cay và hải sản với mức độ nổi trội khác nhau.

Các xu hướng sở thích có thể đồng thời tồn tại. Hệ thống không được ép bàn vào một nhóm sở thích duy nhất.

Hành vi gọi món là bằng chứng để phân tích xu hướng của bàn, không chứng minh rằng tất cả thành viên đều có cùng sở thích.

2. Phạm vi hệ thống

2.1. Dữ liệu đầu vào ban đầu

Nguồn dữ liệu ban đầu gồm:

237 món ăn trong menu do người dùng cung cấp.

Danh sách món đã gọi trong từng phiên ăn.

Số lượng phần ăn của từng món.

Sở thích khách hàng cung cấp qua bộ câu hỏi, nếu có.

Ở giai đoạn khởi đầu, hệ thống chưa sử dụng lịch sử gọi món của khách hàng để huấn luyện.

Menu là nguồn dữ liệu mô tả món ăn. Danh sách món đã gọi là dữ liệu hành vi của phiên ăn. Câu trả lời khảo sát là dữ liệu sở thích do khách chủ động cung cấp.

Ba nguồn này phải được phân biệt rõ ràng.

2.2. Những gì hệ thống cần thực hiện

Xây dựng dữ liệu đặc trưng cho menu.

Xác định các nhóm sở thích có thể nhận diện.

Thu thập sở thích trực tiếp từ khách hàng nếu khách lựa chọn trả lời khảo sát.

Phân tích toàn bộ danh sách món đã gọi của phiên ăn.

Kết hợp độ đa dạng món và số lượng phần ăn khi đánh giá mức độ nổi trội của từng đặc trưng.

Suy luận nhiều xu hướng sở thích đồng thời.

Phân biệt và xử lý riêng dữ liệu khách xác nhận với dữ liệu hệ thống suy luận.

Đánh giá mức độ phù hợp của các món chưa được gọi.

Lọc và trả về các món đạt ngưỡng đề xuất.

2.3. Những gì chưa thuộc phạm vi ban đầu

Collaborative Filtering dựa trên lịch sử gọi món của nhiều khách hàng.

Xây dựng hồ sơ sở thích cá nhân.

Huấn luyện mô hình dựa trên dữ liệu lịch sử chưa tồn tại.

Tìm món tương tự bằng tên món làm mục tiêu chính.

Tự động khẳng định đặc điểm khách hàng từ một vài món đã gọi.

Tự gán nhãn đặc trưng khi không có đủ căn cứ.

Tự quyết định thuật toán, công thức hoặc trọng số khi chưa được thiết kế và kiểm chứng.

3. Các nhóm sở thích cần nhận diện

Hệ thống cần hỗ trợ nhiều nhóm sở thích đồng thời.

Nhóm

Mã

Các đặc trưng dự kiến

Khẩu vị

TASTE

Cay, chua, ngọt, béo, thanh đạm

Nguyên liệu

INGREDIENT

Hải sản, bò, gà, heo, rau...

Chế biến

COOKING

Nướng, chiên, hấp, luộc...

Nhu cầu món ăn

MEAL_ROLE

Ăn nhẹ, ăn no, ăn kèm

Đối tượng

AUDIENCE

Phù hợp trẻ em, người thích ăn cay...

Phong cách bữa ăn

DINING_STYLE

Gia đình, nhóm bạn, ăn nhậu...

Các nhóm trên là phạm vi sở thích cần nghiên cứu và xây dựng. Danh sách nhãn chi tiết sẽ được chuẩn hóa trong giai đoạn thiết kế dữ liệu.

Không phải món ăn nào cũng có đầy đủ tất cả đặc trưng.

3.1. Phân biệt đặc trưng món và sở thích tiềm ẩn

Đây là nguyên tắc quan trọng của hệ thống.

Đặc trưng có căn cứ từ món ăn:

Là những thông tin có thể xác định từ dữ liệu menu, thành phần, cách chế biến hoặc nguồn dữ liệu đáng tin cậy khác.

Ví dụ: món sử dụng hải sản, món được chế biến bằng phương pháp nướng.

Sở thích tiềm ẩn:

Là những giả thuyết được hệ thống suy luận từ tập hợp hành vi gọi món và các mối quan hệ có căn cứ.

Ví dụ: xu hướng thích ăn cay, khả năng ưu tiên các món phù hợp với nhóm đông người.

Sở thích tiềm ẩn phải có căn cứ, mức độ tin cậy và quy tắc suy luận riêng.

Không được lấy một tổ hợp món đơn lẻ làm bằng chứng chắc chắn cho một đặc điểm như có trẻ em, ăn gia đình hoặc ăn nhậu.

Nếu không đủ căn cứ, hệ thống phải để trạng thái chưa xác định thay vì tự tạo nhãn.

4. Thu thập sở thích từ khách hàng

4.1. Bộ câu hỏi sở thích

Hệ thống cung cấp chức năng để khách hàng trả lời câu hỏi về sở thích của bàn ăn.

Đây là chức năng thu thập dữ liệu, không bắt buộc.

Khách hàng có thể:

Trả lời toàn bộ câu hỏi.

Chỉ trả lời một số câu hỏi.

Chọn nhiều sở thích trong cùng một nhóm.

Bỏ qua hoàn toàn chức năng này.

4.2. Quy tắc lưu trữ

Sở thích được lưu theo dining_session.

Không tạo hồ sơ sở thích cá nhân.

Không coi việc bỏ qua câu hỏi là bằng chứng khách không thích một đặc trưng.

Câu trả lời phải được phân biệt với kết quả do AI suy luận.

Dữ liệu khảo sát không được tự động ghi đè dữ liệu suy luận và ngược lại.

4.3. Vai trò của dữ liệu khảo sát

Câu trả lời khảo sát là nguồn thông tin sở thích trực tiếp do khách cung cấp.

Khi khách xác nhận một sở thích, hệ thống có thêm căn cứ trực tiếp và có thể giảm sự phụ thuộc vào việc suy luận những nhãn tương ứng từ hành vi gọi món.

Điều này không có nghĩa là hệ thống phải ngừng phân tích các nhóm sở thích khác.

Khi khách không cung cấp sở thích, hệ thống vẫn phải hoạt động dựa trên dữ liệu món đã gọi.

Hành vi gọi món có thể khác với sở thích được khách xác nhận. Ví dụ, khách xác nhận không thích cay nhưng bàn vẫn gọi nhiều món cay vì có thể gọi cho thành viên khác.

Do đó, hai nguồn dữ liệu phải được duy trì riêng biệt, không tự động coi một nguồn là sai khi chúng không trùng khớp.

5. Cơ chế suy luận sở thích

5.1. Phân tích toàn bộ danh sách món đã gọi

AI phải phân tích toàn bộ danh sách món thuộc phiên ăn hiện tại.

Việc đánh giá mức độ nổi trội của một đặc trưng cần kết hợp hai yếu tố:

Độ đa dạng:

Số lượng món khác nhau có cùng đặc trưng.

Số lượng phần ăn:

Tổng số phần ăn thuộc các món có đặc trưng đó.

Ví dụ:

Danh sách gọi món

Ý nghĩa

1 món cay × 5 phần

Số lượng phần cao nhưng độ đa dạng thấp

5 món cay × 1 phần

Độ đa dạng cao

3 món cay với số phần khác nhau

Có bằng chứng từ cả hai yếu tố

Hai yếu tố phải được xem xét đồng thời. Tỷ lệ và công thức kết hợp cụ thể sẽ được xác định trong giai đoạn thiết kế và kiểm thử thuật toán.

5.2. Nguyên tắc suy luận

Duy trì nhiều sở thích đồng thời.

Đánh giá mức độ nổi trội riêng của từng sở thích.

Sở thích có nhiều bằng chứng hơn có thể có mức độ nổi trội cao hơn.

Không để một sở thích duy nhất chi phối toàn bộ kết quả.

Không đánh đồng hành vi gọi món với sở thích được khách xác nhận.

Không suy diễn sở thích của từng cá nhân từ dữ liệu chung của bàn.

Không kết luận chắc chắn về đặc điểm khách hàng chỉ từ một tổ hợp món.

Các đặc trưng tiềm ẩn phải có căn cứ và quy tắc suy luận riêng.

5.3. Cập nhật sở thích

Mỗi khi bàn gọi thêm món, hệ thống phải phân tích lại toàn bộ danh sách món hiện tại.

Không cộng dồn máy móc điểm của lần phân tích trước.

Kết quả mới phải phản ánh toàn bộ dữ liệu hiện có của phiên ăn.

6. Cơ chế chấm điểm và gợi ý món

6.1. Mục tiêu

Đánh giá mức độ phù hợp của từng món chưa được gọi với tập hợp sở thích hiện tại của bàn.

Một món có thể phù hợp với nhiều sở thích cùng lúc. Hệ thống phải đánh giá sự phù hợp dựa trên các đặc trưng tương ứng, thay vì chỉ chọn một sở thích để quyết định.

Sở thích nổi trội hơn cần có ảnh hưởng lớn hơn trong quá trình đánh giá. Cách chuyển mức độ nổi trội thành trọng số cụ thể sẽ được thiết kế và kiểm thử riêng.

6.2. Ngưỡng đề xuất

Ngưỡng điểm đã thống nhất:

70/100

Chỉ những món đạt hoặc vượt ngưỡng mới được đưa vào kết quả đề xuất.

Ngưỡng 70/100 là quyết định nghiệp vụ đã thống nhất. Công thức tạo ra điểm số vẫn cần được thiết kế và kiểm chứng để bảo đảm ý nghĩa của thang điểm.

6.3. Các nhóm thành phần đánh giá

Điểm phù hợp của món có thể xem xét sáu nhóm:

Khẩu vị.

Nguyên liệu.

Chế biến.

Nhu cầu món ăn.

Đối tượng.

Phong cách bữa ăn.

Sáu nhóm là phạm vi đánh giá, không có nghĩa mỗi nhóm mặc định có trọng số bằng nhau.

Trọng số, cách tổng hợp và cách xử lý nhóm không có đủ dữ liệu phải được xác định trong giai đoạn thiết kế thuật toán.

Không được tự gán điểm mặc định để bù cho dữ liệu đặc trưng còn thiếu.

6.4. Quy tắc kết quả

Không đề xuất món đã được gọi trong phiên ăn.

Chỉ đưa vào kết quả những món đạt từ 70/100.

Sắp xếp món theo điểm giảm dần.

Việc lọc món không khả dụng phải tuân theo trạng thái menu thực tế của ResMan.

Không bắt buộc hiển thị giải thích hoặc điểm thành phần cho khách hàng.

6.5. Định dạng đầu ra

Kết quả dành cho khách hàng là bảng các món đạt ngưỡng đề xuất.

Món ăn

Điểm

Món A

92

Món B

85

Món C

78

Các giá trị trên chỉ là ví dụ minh họa, không phải kết quả thực tế.

Không yêu cầu khách hàng phải đọc các thông tin kỹ thuật hoặc giải thích dài dòng về quá trình suy luận.

7. Định hướng kiến trúc dữ liệu

Hệ thống cần phân biệt rõ các loại dữ liệu:

Dữ liệu menu gốc.

Dữ liệu đặc trưng món ăn.

Dữ liệu khảo sát và sở thích khách xác nhận.

Dữ liệu sở thích AI suy luận.

Dữ liệu phân tích và chấm điểm.

Kết quả gợi ý món ăn.

7.1. Nguyên tắc dữ liệu

Menu gốc của ResMan phải được giữ nguyên.

Hệ thống AI tham chiếu món ăn thông qua mã định danh menu_item_id. Không tự tạo bản sao menu nếu không có nhu cầu độc lập đã được xác định.

Dữ liệu đặc trưng món ăn cần truy vết được:

Món ăn liên quan.

Đặc trưng được xác định.

Nguồn xác định.

Mức độ tin cậy khi phù hợp.

Trạng thái kiểm tra hoặc xác nhận.

Dữ liệu khách xác nhận và dữ liệu AI suy luận phải được lưu tách biệt.

Dữ liệu sở thích thuộc phạm vi dining_session, không trở thành hồ sơ sở thích cá nhân.

7.2. Trạng thái thiết kế

Các nhóm dữ liệu trên là định hướng phân tách về mặt nghiệp vụ.

Chúng chưa phải cấu trúc database vật lý đã được phê duyệt.

Tên bảng, quan hệ, kiểu dữ liệu, khóa và cách lưu kết quả sẽ được xác định trong tài liệu Data Dictionary và Data Model sau khi hoàn thiện phân tích.

Không được xem một cấu trúc kỹ thuật được đề xuất là quyết định nghiệp vụ đã thống nhất.

8. Vòng đời hoạt động

Quy trình nghiệp vụ dự kiến:

ResMan mở một dining_session.

Khách có thể trả lời bộ câu hỏi sở thích.

Hệ thống lưu câu trả lời theo phiên ăn nếu khách cung cấp.

Khách gọi món.

Hệ thống nhận toàn bộ danh sách món đã gọi và số lượng.

AI phân tích đặc trưng của các món.

AI phân tích xu hướng sở thích của bàn.

AI duy trì riêng dữ liệu khách xác nhận và dữ liệu suy luận.

Hệ thống đánh giá các món chưa được gọi.

Lọc món đạt từ 70/100.

ResMan hiển thị danh sách đề xuất.

Khi có món mới được gọi, hệ thống thực hiện lại quá trình phân tích.

Khi phiên ăn kết thúc, dữ liệu sở thích được quản lý theo phạm vi phiên ăn, không trở thành hồ sơ sở thích cá nhân.

9. Nguyên tắc thiết kế và phát triển

9.1. Tách biệt dữ liệu và thuật toán

Không gắn cứng đặc trưng món vào mã nguồn xử lý.

Danh mục đặc trưng, dữ liệu đặc trưng, quy tắc suy luận và công thức chấm điểm cần có khả năng quản lý, điều chỉnh độc lập.

Không lựa chọn thuật toán chỉ vì thuật toán đó phổ biến hoặc dễ triển khai.

Thuật toán phải phù hợp với dữ liệu thực tế, mục tiêu nghiệp vụ và có khả năng kiểm thử.

9.2. Minh bạch nguồn dữ liệu

Mỗi thông tin cần xác định được nguồn:

Dữ liệu menu.

Khách hàng cung cấp.

Hệ thống suy luận.

Người quản trị kiểm tra hoặc hiệu chỉnh.

Không trộn các nguồn thành một dữ liệu không thể truy vết.

9.3. Không tự tạo dữ liệu thiếu căn cứ

Nếu thông tin không đủ để xác định đặc trưng, phải ghi nhận trạng thái chưa xác định.

Không sử dụng giá trị mặc định để làm cho dữ liệu có vẻ đầy đủ.

Không biến giả thuyết suy luận thành thông tin chắc chắn.

9.4. Có thể kiểm thử và tái lập

Mỗi lần chạy đề xuất cần có khả năng xác định:

Phiên ăn.

Danh sách món đầu vào và số lượng.

Dữ liệu sở thích khách xác nhận.

Dữ liệu sở thích AI suy luận.

Phiên bản quy tắc hoặc thuật toán.

Ngưỡng điểm.

Kết quả chấm điểm.

Điều này giúp so sánh các phiên bản, kiểm tra kết quả và phát hiện thay đổi ngoài dự kiến.

10. Lộ trình phát triển

Giai đoạn

Công việc

Trạng thái

1

Thống nhất định hướng và nghiệp vụ cốt lõi

Hoàn thành

2

Thiết kế Data Dictionary và Data Model

Đang thực hiện

3

Chuẩn hóa danh mục đặc trưng

Chưa thực hiện

4

Gán và kiểm tra đặc trưng cho 237 món

Chưa thực hiện

5

Thiết kế bộ câu hỏi sở thích

Chưa thực hiện

6

Thiết kế cơ chế suy luận

Chưa thực hiện

7

Thiết kế thuật toán chấm điểm

Chưa thực hiện

8

Xây dựng bộ kiểm thử và dữ liệu đánh giá

Chưa thực hiện

9

Triển khai hệ thống Recommendation

Chưa thực hiện

10

Tích hợp với ResMan

Chưa thực hiện

11

Kiểm thử thực tế và điều chỉnh

Chưa thực hiện

Không chuyển sang triển khai khi các quyết định thiết kế quan trọng của giai đoạn trước chưa được xác định và kiểm chứng.

11. Tiêu chí kiểm thử và đánh giá

Hệ thống cần được kiểm tra ít nhất theo các tình huống:

Bàn chưa cung cấp sở thích và mới gọi một vài món.

Bàn có sở thích được khách xác nhận.

Bàn có nhiều sở thích khác nhau.

Sở thích khách xác nhận khác với xu hướng gọi món.

Một món được gọi nhiều phần.

Nhiều món khác nhau có chung đặc trưng.

Bàn gọi thêm món và cần phân tích lại.

Món đã gọi phải được loại khỏi kết quả.

Món có dữ liệu đặc trưng chưa đầy đủ.

Một giả thuyết sở thích tiềm ẩn không có đủ căn cứ.

Không có món nào đạt ngưỡng 70/100.

Tiêu chí đánh giá:

Tính đúng đắn của dữ liệu đặc trưng.

Tính hợp lý và có căn cứ của sở thích được suy luận.

Khả năng phân biệt dữ liệu khách xác nhận và dữ liệu AI suy luận.

Tính nhất quán của điểm số.

Khả năng cập nhật khi danh sách gọi món thay đổi.

Mức độ phù hợp của các món được đề xuất.

Không đánh giá chất lượng hệ thống chỉ dựa trên việc chương trình chạy thành công.

12. Những quyết định nghiệp vụ đã thống nhất

Mã

Quyết định

BR-01

Mục tiêu là suy luận sở thích của cả bàn từ tập hợp món đã gọi

BR-02

Hệ thống duy trì nhiều sở thích cùng lúc

BR-03

Cho phép suy luận sở thích tiềm ẩn nhưng phải có căn cứ và không kết luận chắc chắn

BR-04

Mỗi lần gọi thêm món phải phân tích lại toàn bộ danh sách

BR-05

Dữ liệu menu ban đầu gồm 237 món

BR-06

Chưa sử dụng lịch sử gọi món của khách hàng để huấn luyện ban đầu

BR-07

Kết hợp độ đa dạng món và số lượng phần ăn khi đánh giá mức độ nổi trội

BR-08

Bộ câu hỏi sở thích là tùy chọn

BR-09

Câu trả lời khảo sát được lưu theo dining_session

BR-10

Không xây dựng hồ sơ sở thích cá nhân

BR-11

Sở thích khách xác nhận và AI suy luận phải được phân biệt

BR-12

Ngưỡng đề xuất là 70/100

BR-13

Kết quả cuối cùng là danh sách món đạt ngưỡng, sắp xếp theo điểm giảm dần

13. Những nội dung chưa được thống nhất hoặc cần thiết kế

Các nội dung dưới đây chưa được xem là quyết định cuối cùng:

Danh mục nhãn chi tiết cho từng nhóm đặc trưng.

Cách xác định mức độ thể hiện đặc trưng và độ tin cậy.

Tỷ lệ và công thức kết hợp độ đa dạng với số lượng phần ăn.

Trọng số giữa sáu nhóm sở thích.

Công thức kết hợp sở thích khách xác nhận và AI suy luận.

Quy tắc và nguồn tri thức dùng để suy luận các đặc trưng tiềm ẩn.

Cách xử lý dữ liệu thiếu hoặc mâu thuẫn.

Cấu trúc database vật lý.

Thuật toán, mô hình và công nghệ triển khai cuối cùng.

Phương pháp đánh giá chất lượng và tiêu chí chấp nhận kết quả.

Các nội dung này phải được phân tích, có căn cứ và kiểm thử trước khi chốt.

Không được tự ý đưa giả định vào phần quyết định nghiệp vụ đã thống nhất.

14. Định hướng hoàn thiện sản phẩm

Mục tiêu cuối cùng không phải chỉ tạo ra một mô hình dự đoán hoặc một chương trình tìm món tương tự.

Sản phẩm cần có khả năng:

Hiểu dữ liệu và đặc trưng của món ăn.

Nhận biết xu hướng sở thích của từng bàn.

Tiếp nhận sở thích do khách chủ động cung cấp.

Suy luận các sở thích từ hành vi gọi món với mức độ tin cậy phù hợp.

Đánh giá nhiều sở thích đồng thời.

Đề xuất những món phù hợp với xu hướng của bàn.

Cập nhật kết quả theo diễn biến của phiên ăn.

Nguyên tắc phát triển xuyên suốt:

Dữ liệu phải có căn cứ. Sở thích xác nhận và sở thích suy luận phải được phân biệt. Suy luận phải có kiểm soát. Thuật toán phải được kiểm chứng bằng dữ liệu và tình huống thực tế. Kết quả gợi ý phải phản ánh đúng mục tiêu nghiệp vụ của ResMan.