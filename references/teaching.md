# Bài giảng và tài liệu dạy học

Một bài giảng là một câu chuyện người học đi theo một mạch từ đầu tới cuối. Họ ở lại tới cuối khi câu nào cũng khiến họ muốn
đọc câu sau, và họ hiểu được khi không gặp chữ nào bài chưa dạy. Tệp này nói cách viết để có cả hai điều đó. Đọc
`storytelling.md` trước rồi mới đọc tệp này; viết xong thì soát theo `teaching-checklist.md`. Các luật ở đây thêm vào bảy điều
cốt lõi, không thay chúng.

## Trước khi viết: kê chữ

Lỗi hay gặp nhất của bài giảng là dùng một chữ người học chưa biết. Chữ ấy lọt vào vì người viết đã quen nó tới mức không còn
thấy nó lạ. Vì vậy, trước khi viết câu đầu tiên, kê ra giấy nháp mọi thứ bài sẽ đưa tới mắt người học: thuật ngữ, tên lệnh,
tham số của lệnh, ký hiệu (`*`, `~`, `:`), chữ tiếng Anh trong output và thông báo lỗi, tên cột, động từ đi kèm thuật ngữ chính
("cấp" bộ nhớ, "ghi" log). Cạnh mỗi thứ ghi một trong ba chữ:

- **đã dạy**: có trong nền người học hay các bài trước (đề, lộ trình, ghi chú buổi học nói rõ). Bài gọi lại nó bằng tên bài
  trước đã dùng, không đổi sang chữ gần nghĩa.
- **dạy ở đây**: bài này giảng nó. Ghi luôn nó được giải nghĩa ở đoạn nào, bằng vật quen gì.
- **tránh**: bài không cần nó, nên thay bằng lời thường, hay chọn lệnh, output khác không có nó.

Thứ nào chưa xếp được vào một trong ba thì chưa viết.

Lúc viết, lần đầu một thứ "dạy ở đây" vào câu văn thì câu đó, hay câu liền trước trong cùng đoạn, giải nghĩa nó, theo cách đặt
lời giải nghĩa ở `core-rules.md`, điều 5. Mỗi đoạn dạy nhiều nhất một thứ mới; đoạn nào cần hai thì tách.

Tên gọi đã chọn giữ nguyên tới cuối bài, kể cả trong thực hành, câu hỏi, đáp án và đề mục. Chữ mô tả dùng trước lúc đặt tên
cũng theo luật này. Bài đã gọi "một cái nhãn" rồi mới nói "cái nhãn ấy gọi là nhánh" thì từ đó chỉ nói "nhánh", không quay về
"nhãn", nhất là ở đoạn cấu hình hay cách xử lý cuối bài ("đặt nhãn khác"). Câu văn trích output thì chỉ trích phần bài dùng.
Viết xong thì đối chiếu bài với bảng kê.

## Dẫn dắt

### Mở bằng câu của người học

Bài mở bằng một vụ cụ thể người học đã gặp hay sẽ gặp, như thông báo lỗi họ vừa thấy hay việc họ vừa làm hỏng. Phần mở kể đủ
để họ thấy đó là chuyện của mình, rồi đặt câu hỏi của bài ở cuối. Bài không mở bằng "X là…", không dựng cảnh, không mở bằng lời
giới thiệu chủ đề. Câu kể vụ đi một mạch tới chỗ hỏng; ngày và máy đứng câu riêng.

### Câu trả lời mở ra câu hỏi sau

Mỗi mục trả lời được một phần, và chính chỗ còn thiếu của câu trả lời ấy thành câu hỏi mở mục sau. Nhờ vậy người học không bao
giờ đứng ở chỗ "xong rồi" giữa bài. Mục mới mở bằng chỗ hở đó, nhắc lại đủ tên vật nó dựa vào: "Biết tệp log nằm ở đâu rồi,
nhưng ai đang ghi vào nó?".

Câu báo lộ trình thì không dùng để chuyển mục: "Tiếp theo ta xem…", "Phần này…", "Bài đi lần lượt hai cách", hay câu đếm "đã có
hai cách" rồi "Cách thứ nhất…". Mục thực hành mở bằng việc người học sắp tự tay làm lại. Bài có hai cách xử lý thì cách đầu kể
bằng việc người trong vụ đã làm, còn cách sau mở bằng chỗ cách đầu không dùng được ("Nhưng nhánh ấy còn người khác đang dùng
thì sao?") hay bằng câu hỏi thật của người học.

Câu hỏi của bài gọi bằng nội dung, không bằng số hay vị trí. Vật nào được nhắc thì gọi tên, không để "một lệnh", "một công cụ"
treo đó. Câu hỏi thật của người học đem vào giữa bài thì mở bằng việc ("Hôm đó bạn ấy cũng hỏi:"), không bằng câu nói về mạch
bài ("Câu ấy dẫn tới chỗ…"). Đoạn tìm tiếp mở bằng từ nối về câu hở ("Để tìm commit ấy, bạn ấy…"), nhất là khi có đoạn chen
giữa.

Câu hở chỉ hở khi các câu trước chưa nói sẵn đáp án, kể cả qua những chữ gắn thứ đang hỏng vào một vật đã kể ("cùng", "vẫn",
"lại", "cũng"). Câu "lần chạy này đặt cùng tên với container hôm qua" đã trả lời câu hỏi "container nào đang mang tên ấy?", lại
coi như đã biết container hôm qua còn đó. Kể việc hỏng bằng chính nó: "tên `web` đã có container mang".

### Vật quen đi trước, tên gọi đi sau

Tả thứ đó làm gì bằng một vật người học đã có trong tay, như một `HashMap` trong bean hay một bảng trong database, rồi mới đặt
tên; tên đứng cuối câu, sau "gọi là". Chữ Hán Việt thì tách ra từng tiếng khi việc tách giúp nhớ ("tiến trình: tiến là đi tới,
trình là chặng đường").

Phép so sánh nào cũng nói luôn chỗ nó hết đúng ("giống…, chỉ khác là…"), và chủ ngữ câu so ứng với cả vật được so chứ không với
một phần của nó (chi tiết ở checklist). Vật đem ra so giữ một tên tới hết đoạn. Quay lại nó ở mục sau là gài sớm quay lại muộn,
không tính là ẩn dụ thứ hai.

### Nói hộ chỗ người học đoán sai, rồi gỡ

Chỗ người học dễ nghĩ sai thì nói cách nghĩ ấy bằng giọng của họ, kèm lý do nó nghe hợp lý, rồi mới đưa điều thật, tốt nhất là
bằng một output cho họ tự thấy: "Đã `git commit` là code lên GitHub rồi, đúng không? Nghe hợp lý, vì lệnh vừa báo thành công…".

Câu lý do chỉ tả thứ người đó thấy lúc ấy, như lệnh báo thành công. Điều output sắp cho thấy ("mà chưa ai chạy `git push`")
không vào câu lý do, vì đọc tới đó người đọc đã biết đáp án và output không còn gì để gỡ. Vế tả cảnh cũng tính: "vì `docker ps`
không còn dòng của nó, chỉ `docker ps -a` còn" đã nói container vẫn còn. Cách hiểu sai gán cho "nhiều người", "dễ nghĩ là",
không gán cho người đọc.

Chỗ đoán sai mà một output trong bài gỡ được thì kể nó trước đoạn đọc output ấy, như người kể nói điều người nghe đoán rồi mới
kể thí nghiệm, để chính output làm việc gỡ. Gỡ một lần, ở câu suy ra điều thật. Câu kế không thêm vế đuôi nói lại điều ấy, và
câu hỏi của bài đặt ngay sau cũng không mang lại nó, mà chỉ hỏi thứ còn thiếu.

### Gài sớm, quay lại muộn

Vật hay vụ mở bài quay lại ở các mục sau và ở phần thực hành (cùng thông báo lỗi ấy, cùng con số ấy), để người học thấy các mảnh
dính vào nhau. Bài kết bằng câu trả lời trọn cho câu hỏi của bài, đặt ở đoạn cuối phần giảng, trước thực hành và câu hỏi kiểm
tra. Phần kết không có "Tóm lại", không câu châm ngôn, không hẹn bài sau, không nhắc thứ người dùng dặn tránh.

### Câu nối câu

Câu nối câu như trong `storytelling.md`, bằng hư từ giữa câu: "lại", "thì", "mà", "cứ… thì… lại". Câu trước có từ hai danh từ
thì nhắc lại danh từ kèm "ấy, đó, này" ("Container `web` dùng image `nginx:1.25`. Container ấy báo lỗi lúc khởi động."); câu
trước chỉ có một danh từ thì "nó" được.

Một kết luận nói một lần, ở chỗ bằng chứng cho ra nó, rồi đoạn sau dựa vào nó mà đi tiếp. Hai đoạn đang nối nhau (cách xử lý
sau và câu chọn cách) đứng liền nhau, và câu hỏi phụ đặt ngay sau đoạn giảng thứ nó dựa vào. Nhịp không đều: chỗ khó viết
chậm, nhiều ví dụ; chỗ chỉ để nối thì đi nhanh.

## Thứ gì cũng có chỗ dùng

Mỗi mục, mỗi khái niệm trong bài phục vụ câu hỏi của bài và được dùng lại ở phần giảng hay thực hành. Không trả lời được "mục
này phục vụ câu hỏi nào" thì bỏ mục đó; nội dung đúng mà thuộc bài khác thì để bài khác.

Người dùng đặt số chữ thì số đó tính phần giảng và phần thực hành, không tính khối output, bảng tra, câu hỏi và đáp án (cách
đếm ở checklist). Dư thì bỏ hẳn một ý, không rút câu.

## Thực hành

Lệnh trong phần thực hành chạy được trên môi trường của chính người học. Giải thích đi trước, lệnh theo sau, và mỗi lệnh, mỗi
option lạ được giải nghĩa ngay chỗ gõ.

Phần thực hành có một bước cố tình gây lại vụ mở bài rồi tự sửa. Gây lại mà mất dữ liệu hay đụng máy thật thì gây trên một bản
thử (container, thư mục tạm) và nói rõ là bản thử: "Chạy `docker run --name pg-test postgres:16`, rồi xoá thư mục dữ liệu bên
trong container `pg-test`", không "Xoá thư mục `/var/lib/postgresql`".

Bài đưa từ hai cách xử lý thì một câu nói khi nào chọn cách nào, áp vào chính vụ mở bài. Lý do nằm ở câu ấy, vì đoạn kể cách
đầu chỉ kể việc người trong vụ làm; còn điều kiện đã mở cách sau thì câu ấy không nói lại. Bài kể một sự cố thì có bảng tra từ
triệu chứng ra lý do, mỗi dòng nói ai in ra thông báo đó.

Việc chuẩn bị phải làm trước (bỏ một dependency, tắt một chế độ) là bước 1, lý do nằm ngay trong bước ấy, và bước sau cần nó
thì không nhắc lại. Bước cuối trả lại mọi thứ phần thực hành đã thêm, đã sửa. Output thật ghi ngày và nơi chạy (hệ điều hành,
phiên bản); output chưa chạy ghi là kỳ vọng.

## Câu hỏi kiểm tra

Câu hỏi kiểm tra bắt người học suy luận từ một tình huống mới, ghép ít nhất hai điều đã dạy ở hai chỗ khác nhau của bài. Hỏi
lại một câu thân bài đã nói gần nguyên thì chỉ kiểm tra trí nhớ.

Viết đáp án trước. Kê mọi khái niệm, mọi hành vi và quan hệ nhân quả đáp án dùng, rồi đối chiếu với bảng kê chữ và thân bài:
có thứ chưa dạy, hay chữ bài chỉ nhắc qua mà chưa giải nghĩa, thì bỏ câu đó. Tình huống mới là đổi dữ kiện (ảnh khác, số khác),
không đổi cách hệ thống chạy.

Lấy ví dụ một bài vừa giảng bước detection của OCR. Câu hỏi "Ảnh có con dấu đỏ đè lên dòng chữ thì detection ra sao? Nếu
thiếu dòng thì có nên fine-tune không?" là đánh đố: nó bắt đoán việc bài chưa kể (con dấu đè làm detection ra sao) và dùng chữ
bài chỉ nhắc qua (fine-tune). Câu hỏi được hỏi từ chính điều bài đã kể: "Bài đã kể detection bỏ sót dòng chữ quá mờ. Một ảnh
scan có dòng cuối mờ hẳn thì phần chữ đọc ra thiếu gì, vì sao?"

Đề tả output bằng lời thì nói đủ số dòng và mỗi dòng là gì, hoặc dán khối output. Đáp án để riêng ở cuối bài, kết luận trước,
lý do sau, bằng tên bài đã dùng.

## Trung thực

Bài chỉ kể điều ghi chú và tệp vào có: người thật làm gì, nói gì, theo thứ tự nào. Điều họ nghĩ hay lý do họ làm mà ghi chú
không ghi ("bạn ấy không cần nó nữa") thì không thêm; cần lý do thì viết thành điều chung.

Tài liệu công khai không mang họ tên đủ, tên máy, tên công ty. Che phần riêng trong output, giữ số hiệu, giờ, chữ lỗi, và một
câu nói đã che gì. Lời dặn đọc lướt phần output bài không giảng là câu riêng, không nối vào câu che bằng "và".

Dữ kiện chưa kiểm tra thì giữ lời rào. Con số ghi chú kèm chữ rào ("gần", "khoảng") thì giữ chữ ấy ở mọi lần nhắc lại.

Công cụ bài khuyên dùng mà có cái giá với việc người học đang làm (xoá thêm thứ khác, chậm, cần quyền cao) thì nói cái giá đó
ngay ở câu khuyên: "`docker system prune -a` xoá cả image không có container nào đang chạy, nên lần chạy sau phải tải lại image
đó", không "lệnh này có nhược điểm nhất định".

## Giao bài

Lời trả gồm đường dẫn tệp, đứng riêng một dòng, rồi nhiều nhất ba câu: đã che hay ẩn danh gì, output nào là kỳ vọng, đã đối
chiếu dữ kiện nào với tệp vào nào, còn gì chưa kiểm tra. Mỗi câu mang nhiều nhất hai đoạn mã hay ký hiệu, và dấu che (`$`,
`[…]`) cũng tính, nên chỗ che nói bằng lời ("che dấu nhắc lệnh và tên riêng"), không chép lại dấu che. Lời trả không tóm lại
bài, không báo số chữ khi không ai hỏi.

## Soát trước khi giao

Đọc tuần tự từng câu từ đầu như một người học thật, và ở mỗi câu tự hỏi: câu này có dựa trên câu trước không, có chữ nào mình
chưa được dạy không, tới cuối mục có muốn đọc mục sau không. Rồi soát theo `teaching-checklist.md` và chạy `node
scripts/lint.mjs` trên bài, cả trên lời trả (`lint.mjs -` qua stdin).
