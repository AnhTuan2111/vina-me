# Bảy điều cốt lõi, bản đầy đủ

`SKILL.md` nêu bảy điều cốt lõi, mỗi điều vài dòng. Vài dòng thì dễ nhớ, nhưng tới lúc phải quyết một câu cụ thể là được
hay hỏng thì chưa đủ. Tệp này kể lại từng điều cho tới chỗ quyết được: luật nói gì, áp vào lúc nào, có ngoại lệ nào, và
câu sai, câu sửa trông ra sao. Agent mở tệp khi viết hay sửa văn bản dài, khi soát kỹ, hoặc khi bản rút gọn chưa đủ để
quyết. Người bảo trì skill đọc tệp để biết agent đang được dặn những gì.

Bảy điều đi theo thứ tự của `SKILL.md`. Sau bảy điều là những mục dùng cho mọi loại bài: trình bày, sửa văn có sẵn, soát
theo năm phương châm hội thoại, phạm vi của skill, dấu gạch và ký hiệu. Hai mục cuối nói lời trả trong chat và lời trả
theo từng việc.

## 1. Dẫn người đọc bằng điều họ đang thắc mắc

Người đọc đọc tiếp khi câu sau trả lời điều họ vừa thắc mắc. Họ thắc mắc gì thì tuỳ loại văn bản, nên cách mở bài, mở
mục cũng đi theo loại văn bản.

### 1.1 Chọn cách dẫn theo loại văn bản

| Cách | Dùng cho | Làm thế nào |
|---|---|---|
| Hỏi rồi đáp | bài giảng, ghi chú giải thích, lời giải thích trong chat | Mở mục hay đoạn bằng câu hỏi người đọc đang có, đáp ngay ở câu kế |
| Câu hỏi ở đề mục | bài báo, tài liệu tra cứu | Đoạn ngay dưới đề mục đáp luôn |
| Nêu điều người đọc đang nghĩ, rồi "Nhưng" | bài phải sửa một cách hiểu | Viết cách hiểu đó ra trước, rồi mới bác |

### 1.2 Người đọc đã đoán sai thì nêu cách đoán ấy trước

Người hỏi có khi đã tự đoán, kiểu "chắc Nginx chặn?". Lúc đó việc họ cần biết đầu tiên là mình đoán trúng hay trật, nên
cách dẫn thứ ba trong bảng đi trước mọi khung khác, kể cả tám bước giải thích một lỗi ở `document-types.md`. Câu đầu nêu
cách đoán, câu thứ hai mở bằng "Nhưng" và đưa dữ kiện bác nó: "Bạn đoán Nginx chặn. Nhưng log Nginx ghi request đã đi qua
và app trả 403, nên chỗ chặn là app." Xong hai câu ấy mới tới hỏi rồi đáp. Giảng trước thì người hỏi vừa đọc vừa phải giữ
câu hỏi của mình trong đầu mà chưa biết mình sai ở đâu.

Bài giảng kể chỗ người học hay đoán sai thì thêm một câu ở giữa: câu thứ hai nói vì sao cách đoán ấy nghe hợp lý, câu thứ
ba mới "Nhưng" (`teaching-checklist.md`, mục Chỗ hay hiểu sai).

### 1.3 Hỏi rồi đáp

Câu hỏi bám vào thứ vừa nói, bằng "vậy", "thế", "còn… thì sao". Câu đáp đứng ngay sau, trả lời thẳng trước rồi mới nói lý
do, và làm luôn câu chủ đề của đoạn. Hỏi xong mà mấy đoạn sau mới đáp thì tới lúc đáp người đọc đã quên mình hỏi gì. Mở
bằng "Vì sao lệnh `git push` bị từ chối? Có nhiều lý do. Trước hết cần hiểu Git lưu lịch sử thế nào." là để người đọc chờ.
Đáp ngay thì họ có cái để bám: "Vì sao lệnh `git push` bị từ chối? Vì nhánh trên GitHub đã có commit mà máy bạn chưa có,
nên Git không cho ghi đè."

Ba lỗi hay gặp khi hỏi rồi đáp là hỏi xong bỏ lửng, hỏi dồn mấy câu liền, và để ba đoạn liền nhau cùng mở bằng câu hỏi.
Câu hỏi không có câu đáp ngay sau là câu hỏi tu từ, bỏ đi. Riêng câu hỏi của cả bài thì được đứng một mình: bài giảng nêu
nó ở đầu, cả bài trả lời nó, miễn mục ngay sau bắt đầu đáp.

### 1.4 Báo cáo, thư công việc thì vào việc ngay

Người đọc báo cáo, thư công việc, kiến nghị đọc hai câu đầu để quyết có đọc tiếp không, nên những văn bản này không hỏi.
Câu đầu nói đang bàn gì hay viết để làm gì. Câu thứ hai đưa một thứ cụ thể: một ví dụ có tên, một con số, một chi tiết
thấy được. Câu "Thời gian qua, hệ thống đã gặp một số vấn đề cần được quan tâm." không cho người đọc biết gì để quyết.
Hai câu sau thì cho: "Trang đăng nhập trả 502 từ 22h00 tới 22h12 tối qua. Trong 12 phút đó, khách không đăng nhập được."

## 2. Mạch lạc trước, rồi câu sau nắm tay câu trước

### 2.1 Mỗi đoạn một đề tài, một trình tự

Mạch lạc là mọi câu trong đoạn cùng nói về một đề tài và đứng theo một trình tự: theo thời gian, theo nhân quả, hay từ
đặc điểm tới điều nó kéo theo. Người đọc coi mỗi câu là một bước tiếp của câu trước, nên gặp câu lạc đề thì họ đi tìm một
mối nối không có. Thêm từ nối cũng không cứu được đoạn như vậy. Trong "Ổ /data đầy 93% lúc 19:57. Team đã họp với khách
sáng thứ Hai. Log của app chiếm 60 GB.", câu về cuộc họp phải ra khỏi đoạn. Hai câu còn lại khi đó nối được thành một: "Ổ
/data đầy 93% lúc 19:57, trong đó log của app chiếm 60 GB."

### 2.2 Mỗi câu nối với câu trước

Có mạch lạc rồi mới tới chuyện nối từng câu. Mỗi câu nối với câu trước bằng ít nhất một trong bốn cách sau; bảng đầy đủ
ở `cohesion.md`.

- Phép lặp: lặp từ khoá của câu trước. Tốt nhất là mở câu sau bằng thứ câu trước vừa kết thúc.
- Phép thế: thay bằng danh từ gốc kèm "này", "ấy", "đó" ("Nhận thức ấy…"). Chỉ dùng "nó", "họ" khi câu trước có một danh
  từ duy nhất để trỏ về.
- Phép nối: dùng từ nối hợp với quan hệ thật giữa hai ý.
- Trạng ngữ chỉ thời gian hay nơi chốn ở đầu câu.

Muốn biết hai câu có nối không thì che câu trước đi. Câu sau vẫn đứng một mình được, không thiếu gì, thì hai câu đang rời
nhau. Với "Bash tìm lệnh trong một danh sách thư mục. Biến môi trường có nhiều loại.", câu sau che hay không che câu
trước cũng đọc y như nhau. Viết "Danh sách ấy nằm trong biến PATH." thì câu sau cần câu trước mới hiểu "danh sách ấy" là
gì.

### 2.3 Đoạn cũng nối như câu

Câu đầu đoạn mới nắm lấy câu cuối đoạn cũ. Đổi đề tài thì xuống dòng; câu sau còn đang triển khai câu trước thì viết
liền. Cách nối đoạn có ở `cohesion.md`, mục Nối đoạn.

## 3. Ý có quan hệ thì viết thành một câu

### 3.1 Ý có quan hệ thì gộp bằng câu ghép

Hai ý có quan hệ nhân quả, điều kiện, nhượng bộ thì cho vào một câu ghép: vì… nên, nếu… thì, tuy… nhưng, phải… thì… mới.
Tách ra hai câu cụt thì người đọc phải tự đoán chữ "nên" nằm ở đâu: "Bảng `users` không có index trên cột email. Mỗi lần
đăng nhập, database đọc hết 2 triệu dòng." Viết liền thì quan hệ hiện ra ngay: "Bảng `users` không có index trên cột email,
nên mỗi lần đăng nhập database phải đọc hết 2 triệu dòng." Đã mở cặp thì đóng cặp, và hai vế nói về cùng một loại thứ.

### 3.2 Vế sau không mượn sai chủ ngữ

Vế sau bỏ chủ ngữ thì người đọc mượn chủ ngữ của vế trước. Chủ ngữ ấy không làm được việc ở vế sau thì câu nói ra một điều
vô lý: "Bản 2.3 thêm cache cho trang tìm kiếm, chưa đo lại độ trễ" đọc thành bản phần mềm tự đi đo độ trễ. Vế sau cần chủ
ngữ của nó: "Bản 2.3 thêm cache cho trang tìm kiếm, nhưng nhóm chưa đo lại độ trễ." Lỗi này sinh ra nhiều nhất lúc gộp
hai câu khi sửa văn.

### 3.3 Độ dài và nhịp câu

Câu 20 tới 30 tiếng không sao, miễn khớp nối rõ. Thứ làm bài khó đọc là chuỗi câu cụt, vì nó bỏ mất quan hệ giữa các
việc. "Mất điện. Máy chủ tắt. Ổ RAID hỏng một đĩa." là ba sự việc đứng cạnh nhau. Gộp lại thì người đọc thấy việc nào kéo
theo việc nào: "Mất điện lúc 03:00 làm máy chủ tắt đột ngột, và lúc bật lại thì ổ RAID báo hỏng một đĩa."

Câu cụt vẫn có chỗ dùng: nói kết quả của một bước kiểm tra ("Log app sạch."). Nó không dùng để tóm hay răn. Câu dài và
câu ngắn nên xen nhau, vì câu nào cũng dài bằng nhau thì đọc đều đều. Đoạn chỉ có một câu thì để dành cho kết quả hay
bước ngoặt cần đứng riêng; báo cáo, hướng dẫn không chèn đoạn một câu cho có nhịp.

### 3.4 Không rút câu cho vừa số chữ

Người dùng đặt mốc số chữ mà bài vượt thì đừng nén câu, vì câu bị cắt mất "nên", "vì" ngắn hơn vài chữ mà khó hiểu hơn
nhiều. Bỏ hẳn một ý không cần, hoặc tách làm hai bài, rồi báo số tiếng thật trong lời trả: "Ghi chú 520 tiếng, quá mốc
400 vì phần cách đo không bỏ được."

## 4. Hình trước, tên và định nghĩa sau

### 4.1 Bắt đầu từ thứ người đọc đã thấy

Người đọc hiểu một cái tên khi đã thấy thứ nó gọi. Vì vậy bài bắt đầu từ một vật người đọc đang có hoặc đã thấy, kể nó
làm gì theo thứ tự, rồi mới gọi tên và chốt định nghĩa. Với một vật thì tả hình dáng và chỗ đặt trước, gọi tên sau, rồi
nói nó dùng để làm gì.

Bài mở bằng "Rate limit là số request tối đa API cho gọi trong một phút. Từ 10:00, app nhận lỗi 429 liên tục." bắt người
đọc nhớ một chữ chưa có nghĩa. Đảo thứ tự thì cái tên có chỗ bám: "Từ 10:00, cứ gọi API quá 100 lần trong một phút là app
nhận lỗi 429, và phải đợi sang phút sau mới gọi tiếp được. Giới hạn đó gọi là rate limit, tức số lần tối đa một khoá được
gọi API trong một phút."

### 4.2 Hai khái niệm dễ lẫn thì định nghĩa thành một cặp

Có những cặp người đọc hay lẫn: 401 với 403, exception với dòng lỗi trong log. Cặp như vậy thì định nghĩa cả hai trong một
câu, hay hai câu kề nhau, theo cùng một khuôn và nối bằng "còn": "401 là server chưa biết bạn là ai, còn 403 là server biết
bạn là ai mà không cho vào." Skill gọi câu như vậy là câu cặp. Hai định nghĩa cách xa nhau thì người đọc không so được, và
câu cặp hay hỏng ở ba chỗ.

- Thứ nhất đã được định nghĩa ở đoạn trước. Tới khi thứ hai xuất hiện thì gọi lại thứ nhất ngay cạnh nó cho thành cặp
  (`examples.md`, mục 20).
- Thứ nhất mới xuất hiện như một bằng chứng ("log không có dòng X", "X không xảy ra"), dù câu đó có giải X là gì. Như vậy
  chưa tính là đã định nghĩa thành cặp, nên câu đầu tiên gọi tên thứ hai phải viết đủ cặp: "Y là…, còn X (cái đã nhắc ở
  trên) là…" (`examples.md`, mục 23).
- Câu cặp đổi chữ khi gọi lại thứ nhất. Câu trước viết "app ném exception" thì câu cặp vẫn viết "exception là lỗi app tự
  ném ra khi gặp chuyện không xử lý được, còn dòng ERROR trong log là chữ app ghi lại", không đổi "ném" thành "báo". Đổi
  chữ thì người đọc tưởng là một việc khác, nhất là chữ "báo" đứng cạnh "log" dễ đọc thành ghi log. Chữ chỉ trạng thái
  cũng giữ: câu trước viết "ổ đầy" thì câu cặp không đổi sang "hết chỗ".

### 4.3 Chủ ngữ là người hay vật làm việc

Câu giải thích lấy một vật hay một người làm một việc làm chủ ngữ, kiểu "router bỏ packet". Chủ ngữ như "định nghĩa", "cơ
chế", "việc triển khai" giấu mất ai làm, mà người đọc thường cần biết ai làm để xử lý tiếp. "Việc triển khai bản mới đã
được thực hiện vào lúc 14:00" nói ít hơn "Nhóm deploy bản mới lúc 14:00", dù dài gấp đôi. Câu cũng không mở bằng "Với…",
"Qua…" rồi quên mất chủ ngữ.

### 4.4 Câu định nghĩa có "là"

Câu định nghĩa có chữ "là". Khuôn "Tên: lời giải thích" là khuôn của từ điển và slide, đặt vào câu văn thì đứt mạch kể.
Thay "Cache: chỗ giữ sẵn kết quả đã tính." bằng hai câu, câu sau lặp từ khoá của câu trước: "Cache là chỗ giữ sẵn kết quả
đã tính. Nhờ cache, lần hỏi sau không phải tính lại."

## 5. Một thứ một tên, mỗi đoạn một thuật ngữ mới

### 5.1 Một thứ một tên

Người đọc thấy tên khác thì tưởng là thứ khác. Vì vậy mỗi khái niệm chỉ có một tên trong cả văn bản. Từ thường thì đổi
được cho đỡ lặp; thuật ngữ thì chỉ lặp lại, hoặc thay bằng "nó", "cái này". Tên thứ hai hay lọt vào bài từ ba chỗ.

Chỗ đầu tiên là lời giải nghĩa. Giải "cache là chỗ giữ sẵn kết quả" xong thì những câu sau vẫn gọi là cache. Viết tiếp
"Khi bộ đệm đầy, chỗ giữ sẵn sẽ xoá bớt mục cũ" là đã có ba tên cho một thứ.

Động từ cũng lọt tên thứ hai như vậy, khi cùng một việc kỹ thuật được gọi bằng hai chữ. Đã viết "chặn" thì chỗ khác không đổi sang "từ chối", "drop"; đã viết
"deploy" thì không đổi sang "triển khai", "đẩy lên". Người dùng gõ chữ nào trong lời nhờ ("bị drop") thì bài không buộc
phải theo chữ đó, nhưng chọn chữ nào thì giữ chữ ấy suốt bài. Tên in ra trong output thì để trong dấu mã, không tính là
động từ thứ hai.

Khó thấy hơn cả là hai thứ dính nhau mà khác nhau: máy chủ và máy ảo, repo và nhánh, ổ đĩa và phân vùng. Bài chọn một chữ cho
thứ đang được nói tới, hoặc giải cả hai một lần rồi giữ rõ thứ nào là thứ nào. Câu chép lại từ tệp của người dùng ("máy
chủ đã restart") cũng đổi về chữ đã chọn, trừ khi trích nguyên văn trong ngoặc kép hay dấu mã.

### 5.2 Thuật ngữ tiếng Anh giữ nguyên

Thuật ngữ có tên chuẩn tiếng Anh thì giữ nguyên, vì người đọc sẽ gặp lại chữ tiếng Anh trong lệnh, log và tài liệu; chữ
dịch bắt họ tự đổi ngược trong đầu. Viết "option `--force`", không viết "cờ `--force`"; viết "layer", không viết "tầng".
Thuật ngữ viết thế nào thì để yên thế, cả bài một dạng. Chữ viết tắt phải có chỗ giải. Danh sách chi tiết ở
`word-choice.md`, mục Thuật ngữ.

### 5.3 Mỗi đoạn tối đa một thuật ngữ mới

Đoạn đưa hai chữ mới thì người đọc chưa nắm được chữ này đã phải nhận chữ kia, nên mỗi đoạn chỉ đưa một thuật ngữ mới.
Thuật ngữ mới là mọi từ người đọc chưa biết, tính theo điều đã chốt ở bước "người đọc đã biết gì": tên thành phần (node,
pod), tên trạng thái, tên tín hiệu, mã số (exit code), tên option, tên metric. Mấy trường hợp sau dễ tính nhầm.

- Chữ người dùng đã gõ hay đã thấy trong output mà chưa hiểu (họ chép lại tên trạng thái, mã lỗi rồi hỏi vì sao) vẫn là
  thuật ngữ mới.
- Tên công cụ, lệnh, option, tính năng nêu trong lời khuyên cũng là thuật ngữ mới.
- Chữ chưa giải trong tên dashboard, biểu đồ, màn hình người dùng ghi lại ("dashboard upstream", "bảng p95") vẫn là thuật
  ngữ mới. Gọi thứ đó bằng cái nó đo ("biểu đồ thời gian trả lời của app").
- Chữ người dùng tự dùng đúng trong lời hỏi và thuộc mảng họ đã biết (transaction, `@Transactional` với người code Spring)
  thì tính là đã biết.
- Tên tự đặt ghép từ chữ đã biết, đọc là ra nghĩa ("phần ngoài thư mục log"), không tính là thuật ngữ mới. Có điều đặt rồi
  thì nó là tên duy nhất của thứ đó.

Bài không cần thuật ngữ nào thì đừng nhắc nó, kể cả khi người dùng đã gõ. Kể ví dụ cho một nhóm thì tối đa ba thứ, và câu
phải nói chúng thuộc nhóm nào.

Lời giải nghĩa thuật ngữ mới đặt ở câu dùng nó lần đầu hoặc câu ngay trước, bằng từ quen hơn chính nó. Cụm giải nghĩa ngắn
đặt cuối câu, sau dấu phẩy hay trong ngoặc đơn. Cụm chen giữa chủ ngữ và động từ bắt người đọc giữ chủ ngữ trong đầu qua
cả lời giải, nên tách nó thành câu riêng đặt trước: thay "Pod, đơn vị nhỏ nhất Kubernetes chạy, bị tắt lúc 02:00." bằng
"Kubernetes chạy app trong những đơn vị nhỏ gọi là pod. Pod `api` bị tắt lúc 02:00."

### 5.4 Chuỗi việc kéo theo nhiều thuật ngữ

Một chuỗi việc hay kéo theo nhiều thuật ngữ đi liền: thành phần A gửi tín hiệu B, process trả mã C, hệ thống ghi trạng
thái D. Bốn thuật ngữ trong một câu thì không cái nào được giải, trong khi người đọc thường chỉ cần một cái để tra tiếp.
Hỏi vì sao browser chặn trang mà nhận về "Server gửi leaf certificate mà thiếu intermediate CA, browser không dựng được
chain tới root CA nên báo lỗi" thì người hỏi không biết tra chữ nào. Câu sau chỉ gọi tên thứ họ sẽ gặp lại: "Server gửi
thiếu một mảnh trong bộ certificate, nên browser không kiểm tra được certificate của trang và chặn trang. Mã lỗi browser
hiện là `NET::ERR_CERT_AUTHORITY_INVALID`, chữ bạn sẽ gặp lại khi tra lỗi này."

Gặp chuỗi như thế thì:

- Chỉ gọi tên thuật ngữ người đọc sẽ gặp lại (chữ in trong log, trên dashboard, trong câu hỏi của họ). Phần còn lại nói
  bằng lời thường ("tắt process ngay, không cho nó dọn dẹp").
- Bỏ tên một thành phần thì vẫn nói ai làm việc đó, bằng tên hệ thống người đọc đã biết (Nginx thay cho tên module,
  browser thay cho tên engine).
- Câu kể một bước trong chuỗi vì sao, nhất là việc người dùng hỏi tới ("cứ chiều là bị chặn"), phải nói ai làm: không viết
  "request bị chặn" mà viết "Nginx chặn request". Câu dòng thời gian mà người làm không quan trọng thì được bỏ chủ thể;
  chưa biết ai làm thì ghi là chưa biết. Chuỗi do hai thành phần làm thì mỗi bước gọi thành phần của bước đó, không gán cả
  chuỗi cho thành phần đầu.
- Thuật ngữ nào cũng phải gọi tên thì tách chuỗi ra, mỗi thuật ngữ một đoạn ngắn, đoạn sau mở bằng thứ đoạn trước vừa nhắc.
- Tên metric, tên trường trong output chỉ để chỉ chỗ lấy số thì thường bỏ được; nói số đó đo cái gì ("số request lỗi mỗi
  phút trên dashboard"). Giữ tên khi người đọc phải tự đi tìm ô đó, và khi giữ thì nó là thuật ngữ mới của đoạn.
- Người dùng chỉ xin "nói qua", "sơ sơ" phần cách chỉnh thì phần đó nói việc cần làm và lý do bằng lời thường ("đo xem app
  khởi động mất bao lâu rồi mới đặt mức chờ"), không đưa option, lệnh, tên công cụ, tên trường cấu hình. Người dùng hỏi
  tiếp mới đưa (`examples.md`, mục 24).

### 5.5 Mỗi câu tối đa hai đoạn mã

Tên tham số, option dòng lệnh, tên lớp lỗi, tên metric, tên trạng thái, tên trường chép từ output (`Last State`), nhãn có
dấu "=" thì đặt trong dấu mã, cả bài một kiểu. Một câu mang tối đa hai đoạn mã hay ký hiệu, vì ba đoạn mã trong một câu thì
mắt nhảy qua lại giữa chữ và mã, đọc xong không nhớ cái nào làm gì. Cụm option viết gộp (`-ltnp`) tính là một.

Câu cần nhắc ba cái trở lên thì tách câu, và câu nào sau khi tách vẫn giữ vế nhân quả của nó, không bỏ "nên", "tức" cho
ngắn. "Chạy `git fetch`, `git status` rồi `git log HEAD..origin/main` để xem nhánh lệch bao nhiêu." tách thành: "Chạy `git
fetch` để tải các commit mới về máy, rồi `git status` để xem nhánh của bạn đi sau bao nhiêu commit. Muốn xem từng commit
đó thì chạy `git log HEAD..origin/main`."

### 5.6 Soát thuật ngữ sau khi viết

Viết xong bản nháp thì liệt kê thuật ngữ mới của từng đoạn, kể cả chữ người dùng đã gõ và tên trong lời khuyên. Đoạn nào
có từ hai trở lên thì tách, hay nói một cái bằng lời thường. Rồi liệt kê mọi chữ đã dùng cho mỗi thứ quan trọng, cả danh
từ lẫn động từ; thứ nào có hai chữ thì gộp về một (`examples.md`, mục 18, 19 và 23). Sáu cách giải nghĩa một từ nằm ở
`word-choice.md`.

## 6. Nói thật

### 6.1 Không bịa trải nghiệm

Chỉ kể ở ngôi thứ nhất việc đã xảy ra thật. Câu "Mình từng mất cả đêm vì lỗi này" mà không có đêm nào như thế thì bỏ đi,
hoặc nói thẳng "Lỗi này rất dễ gặp khi…". Người đọc tin bài vì nghĩ nó kể chuyện thật, nên lộ ra một câu bịa là họ nghi cả
bài. Cảm xúc và từ cảm thán bịa ra cũng vậy.

### 6.2 Chỉ dùng dữ kiện được đưa

Viết từ dữ kiện người dùng đưa thì chỉ dùng những dữ kiện đó: không thêm suy diễn, không thêm chi tiết cho tròn câu, không
tự nghĩ ra ví dụ hay con số. Thiếu dữ kiện thì có hai trường hợp, xử lý khác nhau.

Thiếu mà câu không viết được thì viết câu nói rõ chưa có, rồi hỏi một câu trong lời trả. Chẳng hạn log chỉ có giờ bắt
đầu: bài viết "Sự cố bắt đầu lúc 09:10; log chưa cho biết giờ hết lỗi.", còn lời trả hỏi "Log chỉ có giờ bắt đầu 09:10,
anh có giờ hết lỗi trên dashboard không?". Không để ô trống kiểu "[__]", vì người nhận đọc như bài chưa viết xong.

Thiếu chi tiết chỉ làm bài đầy hơn thì không hỏi, để người dùng khỏi phải trả lời chuyện bài không cần.

### 6.3 Số đo không nói quá điều nó đo

Một số đo chỉ nói được điều nó đo. Có ba chỗ hay nói quá.

- Vài mẫu đo không nói được xu hướng. "Lúc 09:00 ổ dùng 60%, lúc 10:00 dùng 65%" là đủ. Thêm "ổ đang đầy dần" là đoán mà
  viết như đã đo, vì hai điểm không vẽ được một đường.
- Hiệu của hai số đo khác loại không cho ra phần còn lại, chẳng hạn dung lượng `du` đếm với dung lượng `df` báo, hay số
  request vào với số request lỗi của hai nguồn. Giải vì sao phép trừ không ra thì nói thứ nằm trong số lớn mà không thuộc
  phần cần tìm, hay thứ thuộc phần cần tìm mà số lớn không đếm ("số người đến có cả người không đăng ký mà vẫn tới"). Hai
  số do hai người, hai công cụ đo không tự làm phép trừ hỏng, nên đừng lấy đó làm lý do. Không biết chắc hai số đếm gì
  thì nói thẳng là chưa rõ.
- Dữ kiện chỉ phủ một khoảng, như quanh một lần lỗi hay trong một ngày, thì câu chỉ nói về khoảng đó, không viết "chưa lần
  nào", "lúc nào cũng".

Câu phóng đại quy mô ("cả công ty không ai vào được", "suốt cả ngày") đứng cạnh một số đo nhỏ hơn là phép nói quá, và trong văn
công việc nó là nói sai mức. Bỏ câu đó, để số đo nói (`word-choice.md`, mục con Nói quá).

### 6.4 Đã rào thì không nghiêng

Đã rào một điều ("chưa tách được", "chưa đủ dữ kiện") thì câu sau không được nghiêng kết luận về phía mà lời rào vừa nói là
chưa biết, kể cả bằng "nhiều khả năng", "có vẻ". Viết "Chưa đủ dữ kiện để biết ổ đầy vì log hay vì image Docker. Nhiều khả
năng là do log." là câu trước nói chưa biết, câu sau lại nói biết. Câu sau nên nói cần đo gì để biết: "Chưa đủ dữ kiện để
biết ổ đầy vì log hay vì image Docker; chạy `du -sh /var/log /var/lib/docker` thì biết phần nào lớn."

Có một dấu hiệu cho X thì "có lẽ X" vẫn được; luật này chỉ cấm nghiêng ngay sau câu vừa nói là chưa tách được X với Y.
Luật cũng chỉ áp cho văn viết mới. Sửa văn có sẵn mà tác giả viết "nhiều khả năng X, chưa xác nhận" thì giữ mức đó như gốc.

### 6.5 Tả hậu quả thì chỉ nói phần chắc

Tả hậu quả của một lệnh, một lỗi thì chỉ nói phần chắc: lỗi gì, dừng hay chạy tiếp, ghi đè hay không. "Chạy lệnh này sẽ
làm hỏng hàng loạt dữ liệu" doạ mà không cho biết gì. "Lệnh này ghi đè bảng `orders`, không hỏi lại" cho người đọc đủ để
quyết có chạy hay không. Lượng ước chừng như "một nửa", "hàng loạt" thì bỏ, hoặc ghi "có thể".

### 6.6 Văn gửi người ngoài không để ô trống

Văn gửi người ngoài còn chỗ chưa chốt thì viết câu nói rõ chỗ đó chưa chốt, chẳng hạn "Giờ bảo trì hiện chưa chốt." Ô
trống kiểu "Hệ thống bảo trì từ [__] tới [__]" tới tay khách thì đọc như bên mình quên điền.

### 6.7 "Mình" là ai

Ghi chú viết hộ để người dùng lưu thì "mình" là chủ ghi chú, tức người dùng, và chỉ dùng cho việc họ đã kể là đã làm, đã
đoán. Lời trả trong chat thì "mình" là người viết.

### 6.8 Có nguồn mới viết số, năm, tên chuẩn, lời trích

Con số, năm, tên chuẩn, lời trích chỉ viết khi kiểm tra được nguồn. Con số đi kèm thứ để so và thời điểm đo. Output chưa
chạy thật thì ghi là kỳ vọng. Trích nguyên văn thì để trong ngoặc kép, cắt bớt thì đánh dấu […]. Chi tiết ở
`citations-data-figures.md`.

### 6.9 Nói đúng mức chắc chắn

Câu không có từ chỉ mức chắc chắn đọc thành chắc chắn, và người đọc sẽ làm theo nó như theo một điều đã kiểm tra. Chưa xem
dung lượng ổ thì không viết "Nguyên nhân là ổ đầy."; viết "Có lẽ ổ đầy; chưa kiểm tra lại dung lượng." Từ cho từng mức
chọn theo bảng ở `word-choice.md`, mục Thành phần tình thái. "Tất cả", "luôn luôn" chỉ dùng khi không có ngoại lệ.

### 6.10 Không khen, không phán xét người đọc

Không khen người đọc, không khen câu hỏi, không phán xét một nhóm người. "Câu hỏi hay đấy! Người mới hay nhầm chỗ này."
không cho người đọc thêm gì, lại đặt người viết lên cao hơn họ. Muốn nói chỗ dễ nhầm thì viết "Rất dễ nghĩ là…", rồi
"Nhưng…".

### 6.11 Câu ai cũng viết được thì bỏ

Câu nào đặt vào bài nào cũng được, không có chi tiết thật đứng sau, thì sửa hoặc bỏ. "Sự cố đã được xử lý kịp thời, đảm
bảo hệ thống vận hành ổn định." hợp với mọi báo cáo sự cố, nên không nói gì về sự cố này. Câu có chi tiết thì nói: "Lúc
22h15 em rollback về bản 2.4.0, trang đăng nhập trả lời bình thường từ 22h16."

## 7. Dùng chữ người ta vẫn nói ngoài đời

Muốn thử một từ hay một mẫu câu thì tự hỏi: nếu đang giải thích chuyện này cho một người ngồi cạnh, mình có nói ra chữ đó
không? Không nói thì đừng viết.

### 7.1 Chọn từ đời thường

Từ toàn dân, đời thường đi trước: vì, nên, mà, chứ, hết, đầy, chỗ, thứ, lý do. Từ Hán Việt người ta ít nói ngoài đời
("thẩm định", "tiến hành") thì thay bằng từ thường; từ Hán Việt ai cũng nói ("hệ thống", "kiểm tra") thì giữ
(`word-choice.md`, mục Chọn từ). Câu "Tiến hành thẩm định cấu hình trước khi triển khai." nghe như công văn. Người đọc phải
dịch nó lại trong đầu thành "Xem lại cấu hình trước khi deploy." Biệt ngữ xã hội, từ ngữ địa phương, thán từ, câu tỉnh lược
tới mức mất chủ ngữ cũng không dùng, trừ khi viết theo hồ sơ giọng của một người (`voice.md`, mục Dùng hồ sơ).

### 7.2 Nhấn bằng lời, không bằng chữ in hoa

Chữ viết không có giọng và nét mặt. Ý nào khi nói phải nhấn giọng thì khi viết phải nói thành lời: bỏ qua thì hỏng gì, mất
gì. "Bước này QUAN TRỌNG, đừng bỏ qua." chỉ báo là có nhấn. "Bỏ bước sao lưu thì migrate hỏng giữa chừng sẽ không còn bản
nào để quay về." nói ra vì sao phải nhấn.

### 7.3 Những dấu hiệu gặp nhiều nhất

Bảng đầy đủ ở `machine-tells.md`. Mấy dấu hiệu gặp nhiều nhất:

- "Không phải X, mà là Y" khi chưa ai nói X. Đó là câu phủ định bác bỏ, nên cần một ý kiến X có thật để bác.
- "Không chỉ… mà còn…" để nâng tầm; bộ ba cho đủ vần; dãy từ gần nghĩa thay cho một con số.
- Mở bằng dựng cảnh, "Trong xã hội hiện đại…", "Trong cuộc sống…".
- Kết bằng "Tóm lại", "Hãy…", "Nhớ gọn:", một câu châm ngôn, hay một câu khẳng định ý nghĩa dùng cho bài nào cũng được.
  Hết ý thì dừng.
- "Hãy…", "hành trình", "điều quan trọng nhất là", "thật ra", "đóng vai trò", "chúng ta".
- Mọi phần cùng một khuôn.

## Trình bày

### Văn bản ngắn thì viết liền

Văn bản ngắn như ghi chú, email, câu trả lời trong chat thì viết liền: không chia đề mục, không in đậm nhãn. Ngắn ở đây là
dưới khoảng 800 tiếng. Văn bản cỡ đó không cần bảng hay hình làm chỗ nghỉ mắt, xuống dòng giữa các đoạn là đủ. Danh sách
việc cần làm có người nhận, có hạn thì vẫn giữ gạch đầu dòng, chỉ bỏ nhãn in đậm. Bài nào cũng giải thích bằng lời trước;
bảng tóm thì ngắn, bảng dài chỉ để tra.

Đếm chữ thì đếm theo tiếng, không tính nhan đề, đề mục và khối code nhiều dòng. Đoạn mã trong dòng (`-Xmx1g`) vẫn tính, mỗi
chữ tách bằng dấu cách là một tiếng, kể cả mốc giờ, ngày, số và đơn vị (`09:15`, `21/4`, `GB`). Người dùng xin một khoảng
("300-400 chữ") thì đếm cả hai cách, có và không có đoạn mã trong dòng, và giữ cả hai con số trong khoảng đó.

### Danh sách, đề mục, hình

Gạch đầu dòng không mở bằng nhãn in đậm ở mọi dòng. Phần chỉ có một hai câu thì không cần đề mục. Các mục trong một danh
sách cùng loại, cùng cấp. Hình, bảng, sơ đồ bám vào một ý đang nói, có câu trong bài trỏ tới, và có chú thích nói nó cho
thấy gì.

### Phép so sánh

Phép so sánh có chữ "giống", "như"; ẩn dụ là phép so sánh ngầm, bỏ chữ so sánh đi. Cả hai giúp người đọc nhớ, nhưng người
đọc cũng suy từ vật đem ra so sang thứ thật. Chỗ nào vật ấy khác thứ thật mà bài không nói ra thì người đọc suy sai ở chỗ
đó. Vì vậy:

- Bài có tối đa một phép so sánh, cho khái niệm trung tâm, đặt sau khi đã nói ý bằng lời thường, kèm chỗ nó hết đúng.
  Luật này dành cho tài liệu, bài giảng, báo cáo, lời giải thích. Nghị luận văn học, nghị luận xã hội, bài cảm nhận, blog
  kể chuyện dùng hình ảnh theo `essays.md`, mục Hình ảnh lấy từ đâu, dùng bao nhiêu.
- Câu mở phép so sánh có chủ ngữ là thứ đang bàn ("Chuyện của ổ này giống…"), không mở bằng "Giống…:" rồi dấu hai chấm làm
  khung. Vế đem ra so là việc người ta làm thật ngoài đời; phải bịa một luật lạ cho vế ấy ("chỉ giới hạn ngăn của mình sao
  cho bằng cả tủ") thì đổi sang cách so sánh khác.
- Phép so sánh không mang con số hay phép chia mà bài đã nói là chưa biết. Bài vừa rào "chưa tách được phần A với phần B"
  thì trong phép so sánh cũng không gán số cân, số ngăn cho từng phần (`examples.md`, mục 21).
- Chỗ hết đúng là chỗ người đọc dễ suy sai nhất, nhất là chỗ phép so sánh chia rạch ròi một thứ mà ngoài đời chưa chia
  được; đừng chọn một khác biệt vô hại. Chỗ hết đúng cũng không được nói ngược câu bài vừa viết: bài đã kể một phần gồm
  những gì thì chỗ chưa biết là phần ấy lớn bao nhiêu, có lớn dần không, chứ không phải "chưa biết gồm gì". Vật đem ra so
  có cỡ cố định mà thứ thật có thể lớn dần thì chỗ hết đúng nói ra điều đó (`examples.md`, mục 25).
- Đoạn so sánh đặt ngay sau đoạn nó minh hoạ, trước khi sang ý mới. Đoạn ngay sau đoạn so sánh gọi lại thứ đang bàn bằng
  tên, không mở bằng "số liệu này", "chuyện đó", vì thứ gần nhất lúc ấy là đoạn so sánh. Muốn biết đoạn so sánh có đứng
  sai chỗ không thì đọc liền câu cuối đoạn trước với câu đầu đoạn so sánh: đoạn so sánh không minh hoạ câu đó là nó đang
  đứng sai chỗ.

## Khi sửa văn có sẵn

### Sửa cấu trúc trước, thay từ sau

Sửa văn có sẵn thì sửa cấu trúc câu và đoạn trước, thay từ sau. Câu đã ổn thì để yên. Giọng là của tác giả, nên chỉ đổi
xưng hô khi được yêu cầu.

### Giữ dữ kiện và mức chắc chắn của tác giả

Dữ kiện, con số, tên riêng, mức chắc chắn và ý của tác giả giữ nguyên; bản sửa không thêm chi tiết, ví dụ hay nguồn. Gốc
thiếu một chi tiết mà bản sửa cần chi tiết đó mới viết được thì nói với người dùng là thiếu, không tự điền. Hai dữ kiện
vênh nhau thì giữ như gốc và hỏi, không gỡ theo cách đọc của mình (`common-errors.md`, dòng Hai dữ kiện vênh nhau).

Cách gỡ sai hay gặp nhất là gán cho một trong hai con số một việc khác để hai câu hết chọi nhau. Gốc ghi "Bản 4.1 deploy lúc
21:05" ở đoạn đầu và "deploy xong lúc 21:20" ở đoạn sau. Bản sửa viết "Bản 4.1 deploy lúc 21:05, tới 21:20 thì web chạy lại
bình thường" là đã bịa, vì gốc không nói 21:20 là lúc web chạy lại. Có thể 21:05 là lúc bắt đầu và 21:20 là lúc xong, có thể
một trong hai giờ ghi nhầm; chỉ tác giả biết. Bản sửa giữ cả hai giờ ở đúng câu của chúng, và lời trả hỏi một câu: "Gốc ghi
deploy lúc 21:05 ở đoạn đầu và 21:20 ở đoạn sau; đó là lúc bắt đầu và lúc xong, hay một giờ ghi nhầm?"

Câu đoán cũng là dữ kiện, chỉ khác là nó mang mức chắc chắn. "Lượng truy cập tăng có lẽ vì đợt gửi email quảng cáo" cho
người đọc một hướng để kiểm tra, nên bản sửa giữ câu đó với đúng chữ "có lẽ". Bỏ hẳn câu vì nó chưa chắc là làm mất dữ kiện;
viết "lượng truy cập tăng vì đợt email" là nói chắc hơn tác giả; viết "chưa rõ có liên quan tới đợt email không" là nói kém
chắc hơn. Cả ba cách đều đổi ý của tác giả.

Câu bác bỏ có ý kiến đã nêu cũng là ý của tác giả. "Ban đầu nhóm nghi do mạng. Ping tới máy chủ vẫn ổn, nên không phải do
mạng." gồm ý bị bác, lý do và kết luận. Bản sửa giữ cả ba, chỉ sửa câu chữ, ví dụ "Ban đầu nhóm nghi do mạng, nhưng ping tới
máy chủ vẫn ổn nên loại khả năng này." Bỏ vế kết luận để chỉ còn con số thì người đọc không biết con số ấy dùng để làm gì.
Luật bỏ câu "không phải X, mà là Y" (`machine-tells.md`) chỉ áp cho câu bác một ý chưa ai nói.

Riêng mức chắc chắn thì có một trường hợp phải đổi. Gốc tự lệch mức, một câu nói chắc còn câu khác nói chưa xác nhận, thì
bản sửa theo mức thấp hơn ở mọi câu, vì chính tác giả đã nói là chưa chắc (`common-errors.md`, dòng Hai câu lệch mức chắc
chắn). Gốc ghi "Lỗi do certificate hết hạn" ở đoạn đầu rồi "có lẽ certificate hết hạn, chưa xem lại ngày" ở đoạn sau thì
bản sửa viết "Có lẽ lỗi do certificate hết hạn; chưa xem lại ngày hết hạn", không giữ cả hai câu như gốc.

### Không thêm quan hệ gốc không nói

Gộp hay viết lại câu thì không thêm quan hệ trước sau, nhân quả mà gốc không nói. "Rồi", "nên" là dữ kiện mới: người đọc sẽ
làm theo thứ tự ấy, hay tin quan hệ ấy như tác giả đã nói. Gốc kể hai lệnh rời nhau thì bản sửa không viết "cài xong rồi
chạy `init`"; giữ hai câu rời, hay nối bằng "và".

### Lời trích, code, chữ in đậm

Lời trích nguyên văn, output, code, đường dẫn, tên lệnh thì không đụng. Riêng dấu gạch dài, gạch vừa trong lời trích thì
đổi thành gạch nối, chữ giữ nguyên ("báo lỗi - tôi thử ba lần"), như `punctuation.md`.

Lời trích của người ngoài (khách, người dùng) đứng ở đâu cũng cần câu dẫn nối nó vào mạch kể, nói nó minh hoạ ảnh hưởng
nào: "Phía khách, thanh toán treo rồi báo lỗi; CSKH chuyển lại lời một khách: …". Đặt lời trích ngay sau một câu đang nói
chuyện khác thì nó đứng lạc. Chữ in đậm giữa câu văn của gốc thì bỏ.

## Soát theo năm phương châm hội thoại

Sách Ngữ văn 9 dạy năm phương châm hội thoại: về lượng, về chất, quan hệ, cách thức, lịch sự. Viết xong thì đọc lại bài
bằng năm câu hỏi ứng với năm phương châm ấy. Các luật ở trên đã nói từng phần; năm câu hỏi gom chúng lại để soát một lượt.

| Phương châm | Câu hỏi khi soát | Sai | Sửa |
|---|---|---|---|
| Về lượng | Bài có thiếu điều người đọc cần, hay thừa điều họ không hỏi? | Báo sự cố mà không nói ảnh hưởng tới ai; hoặc hỏi "pod lên chưa?" mà đáp ba đoạn giảng readiness probe | Thêm "khách không thanh toán được từ 09:00 tới 09:30"; đáp "Lên rồi, 3/3 pod Running từ 09:20" |
| Về chất | Mỗi điều đã có bằng chứng chưa, hay đang đoán mà viết như chắc? | "Nguyên nhân là ổ đầy." khi chưa xem dung lượng ổ | "Có lẽ ổ đầy, chưa kiểm tra lại" (`word-choice.md`, mục Thành phần tình thái) |
| Quan hệ | Mỗi đoạn, mỗi câu có phục vụ câu hỏi của người đọc không? | Hướng dẫn cài Nginx mà chen "Nginx do một kỹ sư Nga viết năm 2004 nên chạy rất nhẹ" | Bỏ câu đó; nó lạc đề, và vế "nên" không theo được |
| Cách thức | Có câu nào hiểu được hai cách, có từ nào mơ hồ, có lời khuyên nào chung chung? | "Viết lại đoạn này cho rõ hơn" | "Đoạn 2 có 'nó' trỏ được cả app lẫn database; gọi tên 'database'" |
| Lịch sự | Xưng hô, tình thái từ có hợp quan hệ với người đọc? Lời chỉ lỗi có giữ thể diện người nhận mà vẫn nói rõ là lỗi? | "Khách hàng thường không đọc kỹ"; "Tài liệu viết cẩu thả" | Bỏ câu phán xét nhóm người; "Mục 3 ghi port 8080, mục 5 ghi 8081, cần sửa về một số" |

Các phương châm có lúc nhường nhau, nhưng lịch sự không được che mất chất. Lời chỉ lỗi nói giảm (nói giảm nói tránh) cho
bớt nặng thì được, nói giảm tới mức người nhận không biết đó là lỗi thì không. Một lỗi làm người đọc xoá nhầm dữ liệu
không thể viết thành "có lẽ nên cân nhắc xem lại".

## Phạm vi của skill

Skill này không áp cho văn bản quy phạm pháp luật, hợp đồng, biểu mẫu, thơ, lời thoại. Văn bản hành chính nhà nước thì
theo `official-documents.md`, vì ở đó khuôn mẫu là bắt buộc và một số luật ở trên làm ngược lại.

Gặp một dấu hiệu văn AI slop đơn lẻ thì chưa sửa; sửa khi nó lặp thành khuôn hay làm câu khó hiểu. Riêng mấy thứ sau thì
gặp là sửa, dù chỉ một chỗ: dấu gạch dài, gạch vừa, "đúng" để nhấn, "Hãy" mở câu hướng dẫn, "chúng ta", lời khen người
đọc, trải nghiệm bịa, emoji, mũi tên.

Sửa quá tay cũng làm hỏng bài. Chặt hết thành câu cụt, rút cho ngắn, rải "ừ thì", "nói thật là" cho ra vẻ người đều làm bài
khó đọc hơn. Văn bản trang trọng thì giữ giọng trang trọng, không ép sang giọng thân mật, và định nghĩa chuẩn hay nguồn
không bị bỏ để câu nghe đời thường hơn. Người dùng chê một câu thì sửa câu đó và hỏi lý do trước khi áp cho cả bài.

## Dấu gạch và ký hiệu

Dấu gạch dài và gạch vừa không dùng ở bất cứ đâu, kể cả nhan đề, đề mục, chú thích, bảng, danh sách nguồn, ghi chú trong
code, sơ đồ, commit message, câu trả lời trong chat; chỉ dùng gạch nối thường. Thành phần phụ chú thì đặt giữa hai dấu phẩy
hay trong ngoặc đơn. Nhan đề viết "A: B". Khoảng số viết "3-5 giờ" hay dùng "tới". Ô bảng không có giá trị thì viết thành
chữ.

Trong câu văn không dùng mũi tên, dấu tick, emoji, số khoanh tròn, `~`, `&`, `=`; viết thành chữ. Chữ in hoa cả từ không
dùng để nhấn, chữ in đậm không rải khắp đoạn. Sửa xong thì tìm hai ký tự gạch dài, gạch vừa trong mọi tệp; kết quả phải
là 0. Bảng thay thế đầy đủ ở `punctuation.md`.

## Trả lời trong chat

### Hỏi gì trả lời cái đó

Người dùng hỏi gì thì trả lời cái đó, trong vài câu. Thấy thêm điều cần nói ngoài câu hỏi thì nói trong một dòng ở cuối.
Hỏi "pod lên chưa?" thì đáp "Lên rồi, 3/3 pod Running từ 09:20.", không giảng ba đoạn về readiness probe. Câu hỏi "là
gì", "vì sao" về thứ người dùng chưa học trong phiên thì khác: lúc đó giảng trọn một cơ chế. Câu hỏi tò mò giữa lúc làm
việc thì trả lời đủ rồi dừng, không đố lại. Người dùng nói sai thì nói thẳng là sai, kèm lý do.

### Câu hỏi gửi người dùng phải tự đứng được

Người dùng đọc câu hỏi giữa lúc đang làm việc khác, nên câu hỏi phải tự nói đủ: ở đâu (tệp, màn hình, vị trí nào), hiện
giờ thế nào, vì sao phải hỏi, và mỗi phương án trông ra sao. Mã nội bộ người dùng chưa thấy bao giờ thì không dùng. "Mục
C3 xử lý theo hướng A hay B?" bắt người dùng đi tìm C3 là gì. Câu sau thì không: "Đầu `README.md` ghi bản 1.2, còn
`package.json` ghi 1.3. Mình sửa README theo `package.json`, hay giữ nguyên và hỏi lại người phát hành?"

### Báo kết quả

Báo kết quả công việc thì chỉ gồm vấn đề cụ thể và việc cần làm: không đoạn khen, không mục "điểm tốt", không bảng chấm
điểm, không ước lượng thời gian kiểu "1-2 ngày", không lộ trình nhiều tuần. Báo kết quả một việc sửa, kiểm tra, chạy thì
nói đã kiểm tra gì và bằng cách nào, chưa kiểm tra gì, chỗ nào là đoán.

### Giao văn bản vừa viết

Giao một văn bản vừa viết mới (ghi chú, bài, thư) thì lời trả chỉ gồm đường dẫn tệp hay chính văn bản, cộng một hai câu
nêu chỗ thiếu dữ kiện hay chưa kiểm tra, gọi tên thứ cụ thể. Người dùng sẽ đọc văn bản, nên lời trả không tóm lại nó,
không nhắc lại số liệu trong đó, không kể đã chạy lint hay đọc lại mấy lượt, không báo số chữ khi không ai hỏi. Người dùng
đoán sai thì một câu nói sai ở đâu là đủ, lý do để trong văn bản. Cả lời trả không quá ba câu, khoảng 100 chữ, không câu
nào quá 40 chữ (`examples.md`, mục 22).

Những việc sau có mục lời trả riêng, và theo mục đó thay cho mốc ba câu:

- Tệp Word, PDF: `docx-export.md`, mục Lời trả kèm tệp.
- Văn bản hành chính: `official-documents.md`, mục Soát.
- Báo cáo rà soát: `review-reports.md`, mục Lời trả trong chat.
- Tài liệu gửi khách: `diagrams-and-docs.md`.
- Bài giảng: `teaching.md`, mục Giao bài.
- Bản nháp góp ý: `feedback.md`.
- Nháp bộ nhớ: `agent-memory.md`.

Câu hỏi có muốn dựng bộ nhớ không (`SKILL.md`, mục Bộ nhớ cho agent) và câu hỏi có muốn gửi góp ý về skill không (`SKILL.md`,
mục Góp ý về skill) là dòng riêng ở cuối, không tính vào mốc ba câu; có cả hai thì gộp một dòng.

### Soát lời trả như soát văn

Câu trong lời trả cũng soát như văn trong tệp: một thứ một tên, không hai chữ "nên" khác nghĩa đứng liền nhau, không nói
quá điều đã đếm. Người dùng dán mật khẩu, token vào chat thì nói rõ đó là thứ gì và khuyên thu hồi, đổi mới
(`agent-memory.md`, mục Mật khẩu và token).

## Lời trả theo từng việc

Bảng Trả kết quả trong `SKILL.md` là bản gọn của mục này.

### Viết mới

Lời trả gồm đường dẫn tuyệt đối trọn của từng tệp (hay chính văn bản), thêm một hai câu về chỗ chưa kiểm tra hay thiếu dữ
kiện, cả thảy không quá ba câu như mục Trả lời trong chat ở trên. Nó không tóm lại văn bản, không kể lại chỗ người dùng đã
tự chốt, không kể việc đã soát. Nói dữ kiện nào đã đối chiếu với nguồn thì không tính là kể việc soát, vì người dùng cần
biết điều đó. Tài liệu gửi khách thì theo `diagrams-and-docs.md`.

### Thư, tin nhắn công việc

Lời trả là văn bản chép đi gửi được ngay, thư và tin nhắn tách rõ nếu có cả hai. Sau văn bản chỉ một hai câu về dữ kiện còn
thiếu, như email người nhận hay chữ ký đầy đủ. Không thêm bảng so sánh, không giải thích vì sao viết thế, không tự chấm,
không kể đã soát những gì. Bốn luật về câu đầu, câu nhờ, câu kết và cách trình bày nằm dưới bảng Trả kết quả trong
`SKILL.md`; lý do và ví dụ ở `document-types.md`, mục Thư và email công việc.

### Sửa đoạn được dán vào

Người dùng dán đoạn vào là để lấy bản sửa, nên bản đã sửa đứng ngay đầu lời trả, không có câu dẫn kiểu "Bản sửa đây:" hay
"Dưới đây là bản đã sửa". Sau bản sửa là tối đa năm dòng nêu thay đổi chính, mỗi dòng một thay đổi kèm lý do của nó ("bỏ
câu hỏi tu từ vì nó không đưa dữ kiện nào"). Dòng chỉ kể đã sửa gì mà không nói vì sao thì chưa đủ.

Thay đổi nhiều hơn năm thì chọn năm thay đổi người đọc dễ thấy nhất: đổi nghĩa, đổi mức chắc chắn, gộp hay sắp lại câu.
Chỗ sửa dấu và ký hiệu (gạch dài, mũi tên, in đậm, chữ in hoa) không cần dòng riêng; có nêu thì gom vào một dòng cuối với
một lý do chung. Dòng nào cũng kể một việc đã làm, nên những việc cố ý không làm, như không thêm "vì" mà gốc không nói, không
chiếm dòng nào. Lời trích trong dòng thay đổi chép nguyên chữ của gốc, kể cả chữ hoa chữ thường. Hai dòng "Ký hiệu đổi
thành chữ, bỏ chữ in hoa, nhãn in đậm, gạch dài." và "Không thêm "nên" giữa việc nâng bản Java và việc build chậm." phạm cả
hai lỗi: dòng đầu gom bốn thay đổi mà không có lý do, dòng sau kể một việc không làm. Viết lại thì thành:

- Gộp hai câu cùng mở bằng "Nhóm mobile" thành một câu, vì đó là hai việc liền nhau của cùng một nhóm.
- Bỏ in đậm, chữ in hoa và mũi tên, vì ghi chú ngắn đọc liền là đủ, không cần nhấn.

Chỗ vênh hay đọc được hai cách mà bản sửa phải chọn một mới viết được thì thêm một dòng hỏi ở cuối, ngoài năm dòng. Dòng
ấy là một câu hỏi, nói câu nào ghi gì và có những cách hiểu nào. Chỗ cần hỏi nhiều hơn một thì hỏi chỗ bản sửa phải chọn mà
không chọn được. Chi tiết gốc không có (chức danh của một người, một con số) thì không hỏi để bài đầy hơn; chỗ gốc thiếu mà
bản sửa giữ như gốc cũng không hỏi.

### Sửa một tệp

Chỉ sửa phần văn, rồi báo số chỗ đã sửa theo loại, kiểu "6 câu hỏi rồi đáp, 7 chỗ xưng hô, 1 dấu gạch".

### Soát mà không sửa

Lời soát đi từng chỗ theo khuôn "câu gốc, vấn đề, cách sửa", từ nặng tới nhẹ, hay theo thứ tự người dùng dặn nếu có. Câu
gốc chép nguyên văn từ tệp, trọn câu, trong ngoặc kép, để tác giả tìm ra ngay bằng Ctrl+F. Tả lại câu bằng lời của mình
("câu nói về lịch backup", "lệnh ở Bước 3") thì tác giả phải tự đi tìm, nên chưa tính là có câu gốc. Mỗi
mục một chỗ, không gộp bằng "thêm nữa". Chỗ thiếu thì câu gốc là câu liền trước nơi cần thêm, ghi "thiếu, thêm sau câu …".
Gom nhiều câu vào một mục thì gọi tên lỗi của từng câu (`common-errors.md`). Lời soát dùng lại cái tên mình vừa đề xuất,
không đổi sang tên khác. Lời trả nói script báo mấy chỗ, nhận chỗ nào, bỏ chỗ nào và vì sao. Số chỗ
script báo là số dòng "-" trong phần "Cần sửa"; dòng "·" trong phần "Ghi chú" không tính vào số đó. Người dùng dặn không sửa tệp
thì việc mình làm gọi là "tính lại", "kiểm tra lại", không gọi là sửa.

Mấy luật sau hay bị quên khi soát. Bảy câu hỏi đọc từng câu nằm dưới bảng Trả kết quả trong `SKILL.md`.

- Lỗi làm người đọc hiểu sai giờ, ngày, con số (chữ chỉ buổi lệch với giờ ghi bên cạnh, hai số chọi nhau) là lỗi nội
  dung, xếp trên mọi lỗi câu chữ.
- Hướng dẫn làm theo từng bước thì đọc như người đang làm theo, từ trên xuống. Lời cảnh báo hay điều kiện ("đóng app trước
  khi xoá thư mục cache") đứng sau bước nó cảnh báo thì người làm chỉ đọc thấy khi đã làm xong bước đó. Chỗ này là lỗi nội dung,
  và cách sửa phải chỉ chỗ đặt mới, ví dụ đưa thành một bước đứng trước.
- Nhắc lại một chỗ khác trong lời soát thì gọi bằng vài chữ của câu gốc ("lời dặn kiểm tra tên máy"), không bằng số mục
  tự đặt ("như mục 1"), vì người đọc phải lật lại mới biết mục 1 là gì.
- Câu gốc lạc đề hay sai thì chỉ ra và đề nghị bỏ, hay hỏi tác giả. Đừng đưa dữ kiện ngoài tệp (năm, tên, số) để bác nó,
  vì dữ kiện ấy cũng chưa ai kiểm tra.
- Cách sửa cần một thứ tệp không có (tên bảng, lệnh tạo tài khoản, một con số) thì ghi rõ đó là ví dụ chưa kiểm tra, hay
  để chỗ trống cho tác giả điền. Viết như thể đó là cấu hình thật của hệ thống là bịa.

### Các việc có tệp riêng

- Báo cáo lỗi, báo cáo rà soát: theo `review-reports.md`, cả mục Lời trả trong chat của tệp đó.
- Báo cáo sự cố, báo cáo công việc: theo `document-types.md`; xuất Word thì thêm `docx-export.md`.
- Hồ sơ dự thầu: làm đủ quy trình trong `bid-proposals.md`, gồm đọc bộ tài liệu, lập bảng truy vết, tìm và tô vàng tài
  liệu hãng, dựng bộ tệp Word bằng `scripts/bid/`, soát bằng các lệnh ở `bid/checks.md`, rồi báo cáo cho BA.
- Tệp Word: theo `docx-export.md`, mục Lời trả kèm tệp.
- Bộ nhớ, học từ phiên cũ: theo `agent-memory.md`, mục Học từ phiên cũ, bước 6.
