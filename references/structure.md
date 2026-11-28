# Dựng bài

Một bài dễ đọc khi người đọc biết mình đang ở đâu trong bài và sắp đi tới đâu. Tệp này đi theo thứ tự dựng một bài: việc
cần làm trước khi viết, cách sắp thông tin, cách mở, cách triển khai một ý, cách chuyển ý, cách kết, nhịp của bài, rồi
cuối cùng là một lượt tự soát.

## Trước khi viết

Chưa hiểu thứ sẽ viết thì chưa viết. Hiểu ở đây là biết nguyên nhân của nó, cách nó chạy và tác động của nó. Viết khi chưa
hiểu thì bài lấp chỗ trống bằng câu chung chung.

Tiếp theo là người nhận và mục đích, vì hai thứ này quyết định nội dung và xưng hô. Từ mục đích, đặt một câu hỏi trọng tâm
mà bài phải trả lời; phần kết sẽ trả lời câu hỏi đó.

Có câu hỏi rồi thì lọc thông tin theo hai tiêu chí: có liên quan tới câu hỏi không, và có đáng tin, còn đúng không. Thông
tin không qua được thì bỏ. Trong phần còn lại, chọn điểm nổi bật để nói, không kể hết.

## Sắp thông tin

Thông tin sắp theo một cách, và bài giữ cách đó suốt bài, để người đọc đoán được câu sau sẽ là gì.

| Cách sắp | Dùng khi |
|---|---|
| Theo thời gian | kể sự việc, lịch sử, các bước của một quá trình |
| Theo nhân quả | giải thích vì sao một việc xảy ra |
| Theo mức quan trọng | tập quy tắc, báo cáo cho người bận; các bước của một hướng dẫn thì theo thời gian |
| So sánh, đối chiếu | đặt một thứ mới cạnh một thứ người đọc đã biết |
| Theo không gian | tả một nơi, một giao diện, một kiến trúc |
| Theo từng mặt | thứ có nhiều mặt cần nói riêng |
| Từ khái quát tới cụ thể | giới thiệu, tổng quan |

Báo cáo, tài liệu dài có đề mục thì câu mở báo trước các phần, rồi bài đi theo thứ tự ấy. Bài giảng và lời giải thích trong
chat thì không báo trước, mà đi thẳng vào câu trả lời: "502 nghĩa là Nginx gọi app mà app không trả lời", không "Mình sẽ
nói ba phần: 502 là gì, vì sao, cách sửa".

Văn bản về một vấn đề cần xử lý thì đi theo chuỗi biểu hiện, tác động, nguyên nhân, giải pháp, và giải pháp rút từ nguyên
nhân. Bài chỉ viết khâu có dữ kiện. Khâu chưa có dữ kiện thì một câu nói chưa có ("Chưa rõ nguyên nhân; log app không có
exception trong khoảng 09:00 tới 09:30."), không viết năm câu đoán cho đủ khâu. Nói chung, bài chỉ viết phần có điều để
nói, không dựng đủ khung cho đều.

Việc cần làm trong báo cáo, văn bản dài thì viết thành bảng ba cột: việc gì, ai làm, khi nào. Ghi chú, email, chat dưới
khoảng 800 tiếng thì mỗi việc một gạch đầu dòng gồm việc, người làm, hạn: "Thêm biến `DB_URL` vào production, Tuấn, trước
14h hôm nay."

Mỗi đoạn nói một nội dung. Đề mục và số thứ tự giúp thông tin chính nổi lên khi người đọc lướt.

## Mở

Câu đầu nói ngay đang bàn về cái gì; thư và văn bản công việc thì nói ngay viết để làm gì. Câu thứ hai là một thứ cụ thể:
một trường hợp có tên, một con số, một chi tiết thấy được.

Người đọc đã đưa ra một cách đoán sai thì cách mở ấy nhường chỗ. Câu đầu nêu cách đoán đó, câu thứ hai mở bằng "Nhưng" kèm dữ
kiện bác nó (`core-rules.md`, điều 1).

Mở bằng câu hỏi hay một sự việc thì nó phải dính trực tiếp tới điều sắp bàn. Bài giảng mở bằng một tình huống cụ thể làm
người đọc cần câu trả lời, rồi mới nêu câu hỏi của bài. Bài nào cũng không dựng cảnh, không mở bằng bối cảnh thời đại hay
một nhận định to về cuộc đời. Bài nghị luận văn học, nghị luận xã hội là ngoại lệ: ở đó mở bài gián tiếp, đi từ rộng tới hẹp,
là cách dựng bài đã dạy trong trường (`essays.md`, mục Mở bài).

Câu mở cũng không dựng nghịch lý cho có vẻ lạ bằng cách đặt hai thứ không đo cùng một kiểu cạnh nhau: "Cả truyện chỉ có một
chuyến tàu đi qua trong vài giây, vậy mà tác giả viết gần ba nghìn chữ". Câu ấy nói quá, và nó tạo ra một điều bất thường mà
sự việc không có: truyện ngắn nào cũng dài hơn sự việc nó kể. Việc thật đáng ngạc nhiên thì kể sự việc và số đo của
chính nó, để người đọc tự thấy.

## Triển khai một ý

Một ý đi theo thứ tự: nêu ý, lý do, bằng chứng hoặc ví dụ, rồi nói bằng chứng đó cho thấy gì. Nhận định trừu tượng đi kèm
ngay một việc thấy được; nhiều việc thì xếp tăng dần. Mỗi ý phụ đỡ trực tiếp cho ý chính, và các ý không chọi nhau.
Mỗi quy tắc, mỗi yêu cầu kèm lý do của nó.

Giải thích một thứ lạ thì đi từ thứ người đọc đã thấy tận mắt. Một vật thì tả hình dáng và chỗ đặt, gọi tên, rồi nói nó
dùng để làm gì. Một trạng thái thì tả trạng thái đó trước, đưa tên ra sau, nối bằng "tức là", "gọi là". Một công nghệ thì
giải thích bằng thứ người dùng nhận được, không bằng tên công nghệ. Một khái niệm gồm nhiều phần thì tách ra, định nghĩa
từng phần, rồi nói các phần gặp nhau thế nào. Hai khái niệm dễ lẫn thì định nghĩa thành cặp, cùng khuôn câu, nối bằng
"còn", hai vế đứng liền nhau. Đang tả một vật thì giữ một chủ ngữ suốt đoạn.

Số liệu đi cùng mốc so sánh, và ví dụ thì cụ thể, có tên. Ví dụ về người nêu tên khi dữ kiện có tên, không có thì gọi theo
vai. Ví dụ ấy nói cả mặt được và cái giá phải trả, bằng việc cụ thể chứ không bằng tính từ.

Muốn bác một cách nghĩ thì nêu nó ra trước bằng ví dụ của chính nó, rồi mới tới "Nhưng".

## Chuyển ý

Câu đầu đoạn mới nắm lấy điều đoạn trước vừa nói, bằng tên thứ vừa nói kèm "này" ("lỗi 502 này", "hai pod này"), hoặc lặp
từ khoá.

Trong một chuỗi sự việc thì mỗi bước mở câu mới, bằng mốc thời gian hoặc bằng thứ vừa nhắc ở câu trước làm chủ ngữ. Bước nào
là lý do của bước sau thì nối bằng "nên", "rồi" ngay trong câu: "Lúc 09:00 nhóm deploy bản 2.4; app mất ba phút mới khởi
động xong, nên từ 09:01 tới 09:03 Nginx trả 502."

Liệt kê theo thứ tự thì gắn số vào danh từ ("Bước thứ hai", "Lý do thứ ba"). Hết một chặng dài thì gom lại một câu trước khi
sang chặng mới.

## Kết

Hết ý thì dừng. Bài kết bằng một trong hai cách. Cách thứ nhất là quay về câu mở, tức trả lời câu hỏi đã đặt ở đầu mà không
chép lại câu đó. Cách thứ hai là dừng ở kết quả cuối hay việc tiếp theo. Kết không tóm, không răn: "Sau khi nâng mức chờ
lên 120 giây, trang báo cáo không còn trả 504", không "Nhớ gọn: thấy 504 là nhìn Nginx".

Văn giải thích không có đoạn tóm lại điều vừa giải thích, kể cả khi người dùng xin "dễ nhớ". Thứ làm bài dễ nhớ là một phép
so sánh đặt ở chỗ cần nó và một câu đáp thẳng, chứ câu tóm thì không. Bài dài nhiều chặng thì gom ở chỗ chuyển chặng (mục
Chuyển ý), không gom ở cuối.

Mỗi loại văn bản có cách kết riêng. Báo cáo trả lời câu hỏi đã đặt, nêu hạn chế và việc còn lại. Văn bản công việc kết bằng
điều cần ở người nhận, có hạn. Bài giảng kết bằng câu trả lời trọn vẹn hay kết quả cuối; câu hỏi còn mở chỉ được để lại khi
nó tự đứng được và không hẹn chỗ khác trả lời (`teaching.md`).

Loại nào thì phần kết cũng ngắn, không kêu gọi, không hứa, không có câu khẳng định ý nghĩa chung chung, không có câu chốt cho
dễ nhớ. Bài nghị luận văn học còn được kết bằng một nhận định có tên người nói hay bằng hình ảnh trung tâm mang nghĩa mới
(`essays.md`, mục Kết bài).

## Nhịp

Câu ngắn xen câu dài. Câu ngắn dùng để nói kết quả của một bước, không dùng để tóm hay răn. Đoạn một câu chỉ dùng khi câu
đó là kết quả hay bước ngoặt cần đứng riêng.

Độ sâu cũng không đều: dừng lâu ở chỗ khó, còn chỗ dễ thì lướt và nói rõ là đang lướt.

Bài dài có đề mục thì không để quá khoảng 250 chữ liền mà không có một chỗ nghỉ mắt như hình, bảng, ví dụ, khối chú thích.
Ghi chú, email, lời giải thích dưới khoảng 800 tiếng thì khác: viết liền theo `core-rules.md`, mục Trình bày, xuống dòng
giữa các đoạn là đủ, và đừng thêm bảng chép lại số đã có trong lời văn.

## Tự soát

Viết xong thì soát theo thứ tự dưới, từ nội dung tới câu chữ, vì sửa câu chữ của một ý sai là phí công.

1. Thông tin có đúng không? Con số, tên, lời trích có nguồn không?
2. Có thiếu ý chính nào không? Phần kết có trả lời câu hỏi của bài không? Phần người dùng chỉ xin "nói qua" có đang đưa
   option, lệnh, tên công cụ không?
3. Các phần có nối với nhau không? Có chỗ nào chọi nhau không?
4. Thuật ngữ nào dùng trước khi giải nghĩa? Liệt kê thuật ngữ mới của từng đoạn, tính cả chữ người dùng đã gõ mà chưa hiểu
   và tên trong lời khuyên: đoạn nào có từ hai trở lên? Thứ nào có hai tên, kể cả lời giải nghĩa bị dùng lại như tên, động
   từ cho cùng một việc, và hai thứ dính nhau bị dùng lẫn (máy chủ với máy ảo)? Hai khái niệm dễ lẫn đã đứng thành một câu
   cặp có "còn" chưa, kể cả khi thứ nhất chỉ mới xuất hiện làm bằng chứng? Câu cặp có giữ nguyên động từ, chữ trạng thái
   mà câu trước đã dùng không? Tên dashboard, biểu đồ chép lại có mang chữ chưa giải nghĩa không? Việc người dùng hỏi
   tới (chạy lại, bị chặn) đã có câu nói thành phần nào làm chưa, hay chỉ còn câu bị động?
5. Che câu trước đi, câu sau còn đứng một mình được không? Đọc liền câu cuối đoạn trước với câu đầu đoạn sau ở mọi chỗ
   xuống dòng. Câu nào nói lại con số mà câu trước vừa dẫn, hay dặn lại việc cần đo đã dặn?
6. Phép so sánh có mang con số hay phép chia mà bài nói là chưa biết không? Nó có đứng ngay sau đoạn nó minh hoạ không, hay
   đoạn ngay trước đã sang ý khác (số liệu, chỗ chưa biết)? Câu mở phép so sánh có chủ ngữ không, vế đem ra so có phải việc
   người ta làm thật không, chỗ hết đúng có nói ngược câu mà bài vừa viết không? Câu nào nghiêng kết luận ngược lời rào ngay
   trước nó? Lý do bài đưa cho một phép trừ không ra có nói số nào chứa thứ gì không, hay chỉ nói hai số do hai bên đo?
7. Có dấu hiệu văn AI slop, văn mẫu nào lặp thành khuôn không?
8. Câu nào phải đọc hai lần mới hiểu? Câu nào quá khoảng 40 tiếng, mang từ ba đoạn mã trở lên, hay có thành phần phụ chú
   chen giữa động từ và bổ ngữ của nó? Vế cuối câu nào chỉ nói lại câu đáp ngay trước? Câu nào theo khuôn "X, vì A, còn B,
   nên X'"?
9. Chính tả, dấu câu.

Soát xong thì đọc thành tiếng, chỗ nào vấp thì viết lại. Nếu được, nhờ một người khác đọc. Với bản tóm tắt hoặc bản sửa thì
soát thêm hai điều: có thêm gì bản gốc không có không, và có đổi nghĩa không.
