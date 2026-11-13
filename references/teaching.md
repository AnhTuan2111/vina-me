# Bài giảng và tài liệu dạy học

Một bài giảng là một câu chuyện người học đi theo một mạch từ đầu tới cuối. Họ ở lại tới cuối khi câu nào cũng khiến họ muốn đọc
câu sau, và họ hiểu được khi không gặp chữ nào bài chưa dạy. Tệp này nói cách viết để có cả hai điều đó; đọc
`references/storytelling.md` trước, rồi tệp này, viết xong thì soát theo `references/teaching-checklist.md`. Các quy tắc ở đây
thêm vào bảy điều cốt lõi.

## Trước khi viết: kê chữ

Lỗi hay gặp nhất của bài giảng là dùng một chữ người học chưa biết. Nó lọt vào vì người viết đã quen chữ đó tới mức không còn
thấy nó lạ. Nên trước khi viết câu đầu tiên, kê ra giấy nháp mọi thứ bài sẽ đưa tới mắt người học: thuật ngữ, tên lệnh, tham số
của lệnh, ký hiệu (`*`, `~`, `:`), chữ tiếng Anh trong output và thông báo lỗi, tên cột, động từ đi kèm thuật ngữ chính ("cấp" bộ
nhớ, "ghi" log). Cạnh mỗi thứ ghi một trong ba chữ:

- **đã dạy**: có trong nền người học hay các bài trước (đề, lộ trình, ghi chú buổi học nói rõ); bài gọi đúng tên bài trước đã
  dùng, không đổi sang chữ gần nghĩa;
- **dạy ở đây**: bài giảng nó, và ghi luôn nó được giải nghĩa ở đoạn nào, bằng vật quen gì;
- **tránh**: bài không cần nó thì thay bằng lời thường, hay chọn lệnh, output khác không có nó.

Thứ nào chưa xếp được vào một trong ba thì chưa viết. Khi viết, lần đầu một thứ "dạy ở đây" vào câu văn thì câu đó (hoặc câu liền
trước, trong cùng đoạn) giải nghĩa nó. Mỗi đoạn dạy nhiều nhất một thứ mới; đoạn nào cần hai thì tách. Tên gọi đã chọn giữ nguyên
tới cuối bài, kể cả trong thực hành, câu hỏi, đáp án và đề mục. Chữ mô tả dùng trước lúc đặt tên cũng theo luật này: đã gọi "một
cái nhãn" rồi mới nói "cái nhãn ấy gọi là nhánh" thì từ đó chỉ nói "nhánh", không quay về "nhãn", nhất là ở đoạn cấu hình, cách
xử lý cuối bài ("đặt nhãn khác"). Câu văn trích output thì chỉ trích phần bài dùng. Viết xong, đối chiếu bài với bảng kê.

## Dẫn dắt

**Mở bằng câu của người học.** Bài mở bằng một vụ cụ thể họ đã gặp hay sẽ gặp (thông báo lỗi họ vừa thấy, việc họ vừa làm hỏng),
kể đủ để họ thấy đó là chuyện của mình, rồi đặt câu hỏi của bài ở cuối phần mở. Không mở bằng "X là…", không dựng cảnh, không mở
bằng lời giới thiệu chủ đề. Câu kể vụ đi một mạch tới chỗ hỏng, ngày và máy đứng câu riêng.

**Câu trả lời mở ra câu hỏi sau.** Mỗi mục trả lời được một phần, và chính chỗ còn thiếu của câu trả lời ấy thành câu hỏi mở mục
sau, nên người học không bao giờ đứng ở chỗ "xong rồi" giữa bài. Chuyển mục bằng chỗ hở đó ("Biết tệp log nằm ở đâu rồi, nhưng ai
đang ghi vào nó?"), nhắc lại đủ tên vật nó dựa vào. Không chuyển bằng câu báo lộ trình ("Tiếp theo ta xem…", "Phần này…", "Bài đi
lần lượt hai cách", hay câu đếm "đã có hai cách" rồi "Cách thứ nhất…"); mục thực hành mở bằng việc người học sắp tự tay làm lại.
Cách đầu kể bằng việc người trong vụ đã làm, cách sau mở bằng chỗ cách đầu không dùng được ("Nhưng nhánh ấy còn người khác đang
dùng thì sao?") hay bằng câu hỏi thật của người học. Câu hỏi của bài gọi bằng nội dung, không bằng số hay vị trí; vật nào được
nhắc thì gọi tên, không để "một lệnh", "một công cụ" treo đó. Câu hỏi thật của người học đem vào giữa bài thì mở bằng việc ("Hôm
đó bạn ấy cũng hỏi:"), không bằng câu nói về mạch bài ("Câu ấy dẫn tới chỗ…"). Đoạn tìm tiếp mở bằng chữ nối về câu hở ("Để tìm
commit ấy, bạn ấy…"), nhất là khi có đoạn chen giữa. Câu hở chỉ hở khi các câu trước chưa nói sẵn đáp án, kể cả qua một chữ so
sánh ("cùng", "vẫn", "lại"): "lần chạy này đặt cùng tên với container hôm qua" đã trả lời "container nào đang mang tên ấy?", lại
coi như đã biết container hôm qua còn đó. Kể việc hỏng bằng chính nó ("tên `web` đã có container mang").

**Vật quen đi trước, tên gọi đi sau.** Tả thứ đó làm gì bằng một vật người học đã có trong tay (một `HashMap` trong bean, một
bảng trong database), rồi mới đặt tên, tên đứng cuối câu sau "gọi là"; chữ Hán Việt thì tách ra từng tiếng khi việc tách giúp nhớ
("tiến trình: tiến là đi tới, trình là chặng đường"). So sánh nào cũng nói luôn chỗ nó hết đúng ("giống…, chỉ khác là…"), chủ ngữ
câu so ứng với cả vật được so chứ không với một phần của nó (chi tiết ở checklist). Vật so giữ một tên tới hết đoạn; quay lại nó
ở mục sau là gài sớm quay lại, không tính là ẩn dụ thứ hai.

**Nói hộ chỗ người học đoán sai, rồi gỡ.** Chỗ người học dễ nghĩ sai thì nói cách nghĩ ấy bằng giọng của họ, kèm lý do nó nghe
hợp lý ("Đã `git commit` là code lên GitHub rồi, đúng không? Nghe hợp lý, vì lệnh vừa báo thành công…"), rồi mới đưa điều thật,
tốt nhất là bằng một output cho họ tự thấy. Câu lý do chỉ tả thứ người đó thấy lúc ấy (lệnh báo thành công); điều output sắp cho
thấy ("mà chưa ai chạy `git push`") không vào câu lý do, vì đọc tới đó người đọc đã biết đáp án và output không còn gì để gỡ. Vế
tả cảnh cũng tính: "vì `docker ps` không còn dòng của nó, chỉ `docker ps -a` còn" đã nói container vẫn còn. Cách hiểu sai gán cho
"nhiều người", "dễ nghĩ là", không gán cho người đọc. Chỗ đoán sai mà một output trong bài gỡ được thì kể nó trước đoạn đọc
output ấy, như người kể nói điều người nghe đoán rồi mới kể thí nghiệm, để output làm việc gỡ. Gỡ một lần, ở câu suy ra điều
thật: câu kế không thêm vế đuôi nói lại điều ấy, câu hỏi của bài đặt ngay sau cũng không mang lại nó mà chỉ hỏi thứ còn thiếu.

**Gài sớm, quay lại muộn.** Vật hay vụ mở bài quay lại ở các mục sau và ở phần thực hành (cùng thông báo lỗi ấy, cùng con số ấy),
để người học thấy các mảnh dính vào nhau. Bài kết bằng câu trả lời trọn cho câu hỏi của bài, đặt ở đoạn cuối phần giảng, trước
thực hành và câu hỏi kiểm tra; không "Tóm lại", không câu châm ngôn, không hẹn bài sau, không nhắc thứ người dùng dặn tránh.

Câu nối câu như trong `references/storytelling.md`: chữ nhỏ giữa câu ("lại", "thì", "mà", "cứ… thì… lại"), danh từ nhắc lại kèm
"ấy, đó, này" thay cho "nó", "điều này". Một kết luận nói một lần, ở chỗ bằng chứng cho ra nó, rồi đoạn sau dựa vào nó mà đi
tiếp. Hai đoạn đang nối nhau (cách xử lý sau và câu chọn cách) đứng liền; câu hỏi phụ đặt ngay sau đoạn giảng thứ nó dựa vào.
Nhịp không đều: chỗ khó viết chậm, nhiều ví dụ; chỗ chỉ nối thì đi nhanh.

## Thứ gì cũng có chỗ dùng

Mỗi mục, mỗi khái niệm phục vụ câu hỏi của bài và được dùng lại ở phần giảng hay thực hành. Không trả lời được "mục này phục vụ
câu hỏi nào" thì bỏ; nội dung đúng mà thuộc bài khác thì để bài khác. Người dùng đặt số chữ thì số đó tính phần giảng và phần
thực hành, không tính khối output, bảng tra, câu hỏi và đáp án (cách đếm ở checklist); dư thì bỏ hẳn một ý, không rút câu.

## Thực hành

Lệnh chạy được trên đúng môi trường của người học, giải thích trước rồi lệnh theo sau, mỗi lệnh và tham số lạ giải nghĩa ngay chỗ
gõ. Có một bước cố tình gây lại đúng vụ mở bài rồi tự sửa. Bài đưa từ hai cách xử lý thì một câu nói khi nào chọn cách nào, áp
vào chính vụ mở bài: lý do nằm ở câu ấy (đoạn kể cách đầu chỉ kể việc người trong vụ làm), điều kiện đã mở cách sau thì câu ấy
không nói lại. Bài kể một sự cố thì có bảng tra từ triệu chứng ra lý do, mỗi dòng nói ai in ra thông báo đó. Việc chuẩn bị phải
làm trước (bỏ một dependency, tắt một chế độ) là bước 1, lý do nằm ngay trong bước ấy; bước sau cần nó thì không nhắc lại. Bước
cuối trả lại mọi thứ phần thực hành đã thêm, sửa. Output thật ghi ngày và nơi chạy (hệ điều hành, phiên bản); output chưa chạy
ghi là kỳ vọng.

## Câu hỏi kiểm tra

Hỏi để người học phải suy luận từ một tình huống mới, ghép ít nhất hai điều đã dạy ở hai chỗ khác nhau của bài; không hỏi lại một
câu thân bài đã nói gần nguyên. Viết đáp án trước, kê mọi khái niệm đáp án dùng và đối chiếu với bảng kê chữ: có thứ chưa dạy thì
bỏ câu. Đề tả output bằng lời thì nói đủ số dòng và mỗi dòng là gì, hay dán khối output. Đáp án để riêng ở cuối bài, kết luận
trước, lý do sau, bằng đúng tên bài đã dùng.

## Trung thực

Chỉ kể điều ghi chú và tệp vào có: người thật làm gì, nói gì, theo thứ tự nào; không thêm điều họ nghĩ hay lý do họ làm mà ghi
chú không ghi ("bạn ấy không cần nó nữa"), cần lý do thì viết thành điều chung. Tài liệu công khai không mang họ tên đủ, tên máy,
tên công ty: che đúng phần riêng trong output, giữ số hiệu, giờ, chữ lỗi, và một câu nói đã che gì; lời dặn đọc lướt phần output
bài không giảng là câu riêng, không nối vào câu che bằng "và". Dữ kiện chưa kiểm thì giữ lời rào, con số ghi chú kèm chữ rào
("gần", "khoảng") giữ chữ ấy ở mọi lần nhắc lại. Công cụ nào có nhược điểm thì nói ra.

## Giao bài

Lời trả gồm đường dẫn tệp, đứng riêng một dòng, rồi nhiều nhất ba câu: đã che hay ẩn danh gì, output nào là kỳ vọng, đã đối chiếu
dữ kiện nào với tệp vào nào, còn gì chưa kiểm. Mỗi câu nhiều nhất hai đoạn mã hay ký hiệu, dấu che (`$`, `[…]`) cũng tính, nên
chỗ che nói bằng lời ("che dấu nhắc lệnh và tên riêng"), không chép lại dấu che. Không tóm lại bài, không báo số chữ khi không ai
hỏi.

## Soát trước khi giao

Đọc tuần tự từng câu từ đầu như một người học thật: câu này có dựa trên câu trước không, có chữ nào mình chưa được dạy không, tới
cuối mục có muốn đọc mục sau không. Rồi soát theo `references/teaching-checklist.md` và chạy `node scripts/lint.mjs` trên bài, cả
trên lời trả (`lint.mjs -` qua stdin).
