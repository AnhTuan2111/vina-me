# Dựng bài

## Trước khi viết

- Hiểu rõ thứ sẽ viết, gồm nguyên nhân, cách nó chạy và tác động. Chưa hiểu thì chưa viết.
- Xác định người nhận và mục đích. Hai thứ này quyết định nội dung và xưng hô.
- Đặt một câu hỏi trọng tâm mà bài phải trả lời. Phần kết trả lời câu hỏi đó.
- Lọc thông tin theo hai tiêu chí là có liên quan không, và có đáng tin, còn đúng không. Không qua thì bỏ.
- Chọn điểm nổi bật. Không kể hết.

## Sắp thông tin

Chọn một cách và giữ nó suốt bài.

| Cách sắp | Dùng khi |
|---|---|
| Theo thời gian | kể sự việc, lịch sử, các bước của một quá trình |
| Theo nhân quả | giải thích vì sao một việc xảy ra |
| Theo mức quan trọng | tập quy tắc, báo cáo cho người bận; các bước của một hướng dẫn thì theo thời gian |
| So sánh, đối chiếu | đặt một thứ mới cạnh một thứ người đọc đã biết |
| Theo không gian | tả một nơi, một giao diện, một kiến trúc |
| Theo từng mặt | thứ có nhiều mặt cần nói riêng |
| Từ khái quát tới cụ thể | giới thiệu, tổng quan |

Thêm:

- Báo cáo, tài liệu dài có đề mục thì báo các phần ở câu mở, rồi đi theo thứ tự ấy. Bài giảng, lời giải thích trong chat
  thì không báo: "502 nghĩa là Nginx gọi app mà app không trả lời", không "Mình sẽ nói ba phần: 502 là gì, vì sao, cách sửa".
- Văn bản về một vấn đề cần xử lý thì đi theo chuỗi biểu hiện, tác động, nguyên nhân, giải pháp. Giải pháp rút từ nguyên nhân. Chỉ viết khâu có dữ
  kiện; khâu chưa có thì một câu nói chưa có ("Chưa rõ nguyên nhân; log app không có exception trong khoảng 09:00 tới
  09:30."), không viết năm câu đoán cho đủ khâu.
- Việc cần làm trong báo cáo, văn bản dài thì viết thành bảng ba cột là việc gì, ai làm, khi nào. Ghi chú, email, chat
  dưới khoảng 800 tiếng thì mỗi việc một gạch đầu dòng gồm việc, người làm, hạn: "Thêm biến `DB_URL` vào production,
  Tuấn, trước 14h hôm nay."
- Mỗi đoạn một nội dung. Đề mục và số thứ tự làm nổi thông tin chính.
- Chỉ viết phần có điều để nói. Không dựng đủ khung cho đều.

## Mở

- Câu đầu nói ngay đang bàn về cái gì. Thư và văn bản công việc thì nói ngay viết để làm gì.
- Người đọc đã đưa ra một cách đoán sai thì câu đầu nêu cách đoán đó, câu thứ hai "Nhưng" kèm dữ kiện bác nó
  (`core-rules.md` điều 1). Cách mở này đi trước dòng trên và dòng "Câu thứ hai…" ở dưới.
- Câu thứ hai là một thứ cụ thể, kiểu một trường hợp có tên, một con số, một chi tiết thấy được.
- Mở bằng câu hỏi hay một sự việc thì nó phải dính trực tiếp tới điều sắp bàn.
- Bài giảng thì mở bằng một tình huống cụ thể làm người đọc cần câu trả lời, rồi nêu câu hỏi của bài.
- Không dựng cảnh. Không mở bằng bối cảnh thời đại hay một nhận định to về cuộc đời.

## Triển khai một ý

- Đi theo thứ tự nêu ý, lý do, bằng chứng hoặc ví dụ, rồi nói bằng chứng đó cho thấy gì.
- Một nhận định trừu tượng được trả ngay bằng việc thấy được. Nhiều việc thì xếp tăng dần.
- Mỗi ý phụ đỡ trực tiếp cho ý chính. Các ý không chọi nhau.
- Giải thích một khái niệm gồm nhiều phần thì tách ra, định nghĩa từng phần, rồi nói chúng gặp nhau thế nào.
- Với một vật thì tả hình dáng và chỗ đặt, gọi tên, nói nó dùng để làm gì.
- Tên của một trạng thái đưa ra sau khi đã tả trạng thái đó, nối bằng "tức là", "gọi là".
- Định nghĩa một thứ lạ bằng một thứ người đọc đã thấy tận mắt.
- Giải thích một công nghệ bằng thứ người dùng nhận được, không bằng tên công nghệ.
- Hai khái niệm dễ lẫn thì định nghĩa thành cặp, cùng khuôn câu, nối bằng "còn", hai vế đứng liền nhau.
- Số liệu đi cùng mốc so sánh. Ví dụ cụ thể, có tên.
- Ví dụ về người thì nêu tên khi dữ kiện có tên, không có thì gọi theo vai; nói cả mặt được và cái giá, bằng việc cụ thể chứ không bằng tính từ.
- Mỗi quy tắc, mỗi yêu cầu kèm lý do của nó.
- Muốn bác một cách nghĩ thì nêu nó ra trước bằng ví dụ của chính nó, rồi mới "Nhưng".
- Giữ một chủ ngữ suốt đoạn khi đang tả một vật.

## Chuyển ý

- Câu đầu đoạn mới nắm lấy điều đoạn trước vừa nói, bằng tên thứ vừa nói kèm "này" ("lỗi 502 này", "hai pod
  này"), hoặc lặp từ khoá.
- Trong một chuỗi sự việc thì mỗi bước mở câu mới, bằng mốc thời gian hoặc lấy thứ vừa nhắc ở câu trước làm chủ ngữ;
  bước nào là lý do của bước sau thì nối bằng "nên", "rồi" trong cùng câu: "Lúc 09:00 nhóm deploy bản 2.4; app mất ba
  phút mới khởi động xong, nên từ 09:01 tới 09:03 Nginx trả 502."
- Liệt kê theo thứ tự thì gắn số vào danh từ ("Bước thứ hai", "Lý do thứ ba").
- Hết một chặng dài thì gom lại một câu trước khi sang chặng mới.

## Kết

- Hết ý thì dừng.
- Hoặc quay về câu mở, tức trả lời câu hỏi đã đặt ở đầu mà không chép lại câu đó, hoặc dừng ở kết quả cuối hay việc
  tiếp theo. Không tóm, không răn: "Sau khi nâng mức chờ lên 120 giây, trang báo cáo không còn trả 504", không "Nhớ gọn:
  thấy 504 là nhìn Nginx".
- Văn giải thích thì kết bằng kết quả cuối, hoặc việc người đọc cần làm tiếp. Không viết đoạn tóm lại điều vừa giải
  thích, kể cả khi người dùng xin "dễ nhớ": thứ làm bài dễ nhớ là một phép so sánh đặt ở chỗ cần nó và một câu đáp thẳng, không phải câu
  tóm. Bài dài nhiều chặng thì gom ở chỗ chuyển chặng (mục Chuyển ý), không gom ở cuối.
- Báo cáo thì trả lời câu hỏi đã đặt, nêu hạn chế và việc còn lại.
- Văn bản công việc thì kết bằng điều cần ở người nhận, có hạn.
- Bài giảng thì kết bằng câu trả lời trọn vẹn hay kết quả cuối. Câu hỏi còn mở chỉ khi nó tự đứng được và không hẹn
  chỗ khác trả lời (`references/teaching.md`).
- Kết ngắn. Không kêu gọi, không hứa, không câu khẳng định ý nghĩa chung chung, không câu chốt cho dễ nhớ.

## Nhịp

- Câu ngắn xen câu dài. Câu ngắn dùng để nói kết quả của một bước, không dùng để tóm hay răn.
- Đoạn một câu chỉ khi câu đó là kết quả hay bước ngoặt cần đứng riêng.
- Độ sâu không đều. Dừng lâu ở chỗ khó, còn chỗ dễ thì lướt và nói rõ là lướt.
- Bài dài có đề mục thì không quá khoảng 250 chữ liền mà không có một điểm nghỉ mắt như hình, bảng, ví dụ, khối chú
  thích. Ghi chú, email, lời giải thích dưới khoảng 800 tiếng thì viết liền theo `core-rules.md` mục Trình bày, xuống
  dòng giữa các đoạn là đủ; đừng thêm bảng chép lại số đã có trong lời văn.

## Tự soát

Theo thứ tự:

1. Thông tin có đúng không? Con số, tên, lời trích có nguồn không?
2. Có thiếu ý chính nào không? Phần kết có trả lời câu hỏi của bài không? Phần người dùng chỉ xin "nói qua" có
   đang đưa option, lệnh, tên công cụ không?
3. Các phần có nối với nhau không? Có chỗ nào chọi nhau không?
4. Thuật ngữ nào dùng trước khi giải nghĩa? Liệt kê thuật ngữ mới của từng đoạn, tính cả chữ người dùng đã gõ mà
   chưa hiểu và tên trong lời khuyên: đoạn nào từ hai trở lên? Thứ nào có hai tên, kể cả lời giải nghĩa bị dùng lại
   như tên, động từ cho cùng một việc, và hai thứ dính nhau bị dùng lẫn (máy chủ với máy ảo)? Hai khái niệm dễ lẫn đã
   đứng thành một câu cặp có "còn" chưa, kể cả khi cái thứ nhất chỉ mới xuất hiện làm bằng chứng? Câu cặp có giữ nguyên
   động từ, chữ trạng thái câu trước đã dùng không? Tên dashboard, biểu đồ chép lại có mang chữ chưa giải không? Việc
   người dùng hỏi tới (chạy lại, bị chặn) đã có câu nói thành phần nào làm chưa, hay chỉ còn câu bị động?
5. Che câu trước đi, câu sau còn đứng một mình được không? Đọc liền câu cuối đoạn trước với câu đầu đoạn sau ở mọi chỗ
   xuống dòng. Câu nào nói lại số câu trước vừa dẫn, hay dặn lại việc cần đo đã dặn?
6. Ẩn dụ có mang con số hay phép chia mà bài nói là chưa biết không? Ẩn dụ có đứng ngay sau đoạn nó minh hoạ không,
   hay đoạn ngay trước đã sang ý khác (số liệu, chỗ chưa biết)? Câu mở phép so sánh có chủ ngữ không, vế so có phải việc người
   ta làm thật không, chỗ hết đúng có nói ngược câu bài vừa viết không? Câu nào nghiêng kết luận ngược lời rào ngay trước
   nó? Lý do bài đưa cho một phép trừ không ra có nói số nào chứa thứ gì không, hay chỉ nói hai số do hai bên đo?
7. Có dấu hiệu văn AI slop, văn mẫu nào lặp thành khuôn không?
8. Câu nào phải đọc hai lần mới hiểu? Câu nào quá khoảng 40 tiếng, mang từ ba đoạn mã trở lên, hay có thành phần phụ chú chen giữa động
   từ và bổ ngữ của nó? Vế cuối câu nào chỉ nói lại câu đáp ngay trước? Câu nào theo khuôn "X, vì A, còn B, nên X'"?
9. Chính tả, dấu câu.

Rồi đọc thành tiếng. Chỗ nào vấp thì viết lại. Nếu được, nhờ một người khác đọc.

Với bản tóm tắt hoặc bản sửa thì soát thêm hai điều: có thêm gì bản gốc không có không, và có đổi nghĩa không.
