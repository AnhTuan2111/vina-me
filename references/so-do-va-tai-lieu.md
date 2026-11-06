# Sơ đồ, trang trình chiếu, tài liệu kỹ thuật

Phần này gom cách viết chữ cho những thứ không phải văn xuôi: sơ đồ luồng, sơ đồ triển khai, trang trình chiếu, tài
liệu cấu hình gửi khách, báo cáo trạng thái hệ thống. Chữ ở đây ít, nên mỗi chữ phải đúng chỗ.

## Sơ đồ

- Sơ đồ vẽ để trả lời một câu hỏi, ví dụ "yêu cầu đi qua những máy nào", "từ lúc đẩy code tới lúc chạy có mấy bước".
  Chốt câu hỏi đó trước khi vẽ, và đặt nó làm tiêu đề hoặc câu đầu của chú thích.
- Mỗi khối chỉ ghi tên. Cấu hình, phiên bản, mô tả dài để trong tài liệu đi kèm hoặc trong bảng dưới sơ đồ. Dòng phụ
  dưới tên khối là thứ đầu tiên nên bỏ khi sơ đồ rối.
- Chọn một ngôn ngữ cho nhãn và giữ suốt sơ đồ. Sơ đồ kỹ thuật thường để nhãn bằng tên gốc tiếng Anh của phần mềm, máy,
  giao thức, vì đó là chữ sẽ gặp trên màn hình thật; tiêu đề và chú thích thì tiếng Việt.
- Mũi tên đi đúng đường thật. Trỏ thẳng vào thứ nhận, không trỏ vào một đường chung chung. Luồng hai chiều dùng mũi
  tên hai đầu. Không để mũi tên cắt nhau; cắt thì sắp lại vị trí các khối trước khi nghĩ tới đường vòng.
- Mỗi mũi tên mang một nghĩa. Có nhiều loại luồng thì phân bằng màu hoặc nét, có chú giải, và nhãn trên mũi tên nói
  việc gì xảy ra ("đọc để so", "sửa cho khớp"), không chỉ ghi tên giao thức.
- Chữ trong bài nhắc tới thứ gì thì sơ đồ phải có thứ đó. Bài nói "so tệp YAML với bản trên cụm" thì sơ đồ phải có cả
  hai phía của phép so.
- Ô nào là một phần mềm thật thì dùng logo chính thức hoặc ảnh chụp giao diện thật. Không dùng biểu tượng chung chung
  cho có hình. Ảnh lấy của người khác thì ghi nguồn.
- Biểu tượng phải đúng loại thứ được vẽ. Kho đối tượng (S3) không vẽ bằng biểu tượng thư mục.
- Đánh số các bước khi sơ đồ là một quy trình đọc một lần từ đầu tới cuối. Sơ đồ cấu trúc thì gọi bằng tên, không bắt
  người đọc nhớ số.
- Vẽ xong thì xuất ra ảnh và xem tận mắt: chữ có đè nhau không, mũi tên có bị khung che không, cỡ chữ đọc được ở khổ
  trang sẽ in hay chiếu.

## Trang trình chiếu

- Một trang một ý. Phần lớn diện tích là sơ đồ hoặc hình; chữ chỉ là nhãn và một câu chốt.
- Người cần "để thuyết trình" thì đưa luồng, không đưa đoạn văn. Phần giải thích dài đưa vào tài liệu riêng.
- Trang sau nối trang trước: tiêu đề trang sau bắt đầu từ thứ trang trước vừa dừng lại.
- Bỏ phụ đề, nhãn trang trí, lời dẫn kiểu "Sau đây là…". Trang rối thì bớt chữ trước, rồi mới bớt hình.

## Tài liệu kỹ thuật gửi khách

- Có mẫu của bên nhận thì theo đúng mẫu: cùng mục, cùng thứ tự, cùng cách đánh số. Không tự thêm mục, không đổi tên mục.
- Một phông, một cỡ cho thân bài, bảng, chú thích. Khối cấu hình dùng một phông chữ đều, cỡ nhỏ hơn. Đề mục thống nhất
  từng cấp.
- Tài liệu mô tả cấu hình môi trường chỉ nói về hệ thống sẽ triển khai: từng máy, cấu hình, hệ điều hành, phần mềm và
  phiên bản, cổng, tệp cấu hình, sao lưu, giám sát, xử lý khi máy hỏng. Không nhắc nhánh code, commit, tình trạng code
  hiện tại, kết quả thử nội bộ. Những thứ đó để báo cáo nội bộ riêng.
- Viết thiết kế như một sự thật đã chốt ("Keycloak chạy trên hai máy…"), không viết dạng đề xuất ("có thể dùng…").
  Chỗ còn chờ khách quyết thì gom vào một mục riêng ở cuối.
- Bên nhận sửa tay trong tài liệu thì không dán đè cả tài liệu. Tải bản hiện tại về so trước, chỉ sửa đúng chỗ cần.

## Báo cáo trạng thái hệ thống

Loại này trả lời "giờ nó đang thế nào". Người đọc cần quyết định có phải làm gì không.

- Câu đầu là kết luận: chạy bình thường, hay có chỗ hỏng, hỏng ở đâu.
- Số đo kèm giờ đo và nguồn: "lúc 19:57, ổ `/` dùng 179G trên 194G (93%)".
- Chỉ nêu cái lệch khỏi bình thường kèm lý do đã biết, hoặc ghi rõ là chưa biết lý do. Thứ chạy bình thường thì gom một
  dòng.
- Báo cáo dọn dẹp, đề xuất thay đổi thì chia theo mức rủi ro (dọn được ngay, cần hỏi chủ, không nên đụng), mỗi dòng có
  dung lượng hoặc tác động đo được. Ghi rõ đã làm gì và chưa làm gì: "chỉ xem, chưa xoá gì".
- Đã làm thay người nhận việc gì thì ghi lệnh hoặc thao tác, kết quả, và cách quay lại.

## Giải thích một hệ thống cho người mới vào

- Người đọc chưa biết dự án thì giải thích dự án làm gì, cho ai, gồm những khối lớn nào, trước khi vào chi tiết một khối.
- Mỗi lần một khối, nói cơ chế chính (khối đó làm gì, vì sao cần, luồng chính đi qua nó), chưa đi vào từng dòng cấu hình.
- Các dòng thuộc cùng một cơ chế thì giảng trong cùng một lần, theo đúng thứ tự luồng chạy, gọi tên cụ thể (máy nào,
  tên miền nào, dòng nào). Ít hơn không có nghĩa là dễ hiểu hơn.
