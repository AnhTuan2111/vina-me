# Bảy điều cốt lõi, bản đầy đủ

`SKILL.md` nêu bảy điều cốt lõi, mỗi điều vài dòng. Vài dòng thì nhớ được, nhưng chưa đủ để quyết một câu cụ thể là được
hay hỏng. Tệp này nói lại từng điều cho đủ: luật cụ thể, khi nào áp, một câu sai, một câu sửa, và vì sao. Agent mở tệp này
khi viết hay sửa văn bản dài, khi soát kỹ, hoặc khi bản rút gọn chưa đủ để quyết. Người bảo trì skill đọc tệp này để biết
agent đang được dặn những gì.

Bảy điều đi trước, theo thứ tự của `SKILL.md`. Sau đó tới các mục dùng chung: trình bày, sửa văn có sẵn, soát theo năm
phương châm hội thoại, phạm vi của skill, dấu gạch và ký hiệu, trả lời trong chat, lời trả theo từng việc.

Mỗi luật có một đề mục là tên luật. Ngay dưới là một đoạn nói luật ấy và lúc nào dùng, rồi một câu sai, một câu sửa, và
lý do. Luật nào có ngoại lệ thì ngoại lệ nằm ngay trong đoạn của luật đó.

## 1. Dẫn người đọc bằng điều họ đang thắc mắc

Người đọc đi tiếp khi câu sau trả lời điều họ vừa thắc mắc. Vì vậy điều này quyết định cách mở bài, mở mục và mở đoạn.

### 1.1 Chọn cách dẫn theo loại văn bản

| Cách | Dùng cho | Làm thế nào |
|---|---|---|
| Hỏi rồi đáp | bài giảng, ghi chú giải thích, lời giải thích trong chat | Mở mục hay đoạn bằng câu hỏi người đọc đang có, đáp ngay ở câu kế |
| Câu hỏi ở đề mục | bài báo, tài liệu tra cứu | Đoạn ngay dưới đề mục đáp luôn |
| Nêu điều người đọc đang nghĩ, rồi "Nhưng" | bài phải sửa một cách hiểu | Viết cách hiểu đó ra trước, rồi mới bác |

### 1.2 Người đọc đã đoán sai thì nêu cách đoán ấy trước

Người đọc đã đưa ra một cách đoán sai, trong câu hỏi hay trong chat, thì cách dẫn thứ ba ở bảng trên đi trước mọi khung
khác, kể cả tám bước giải thích một lỗi ở `document-types.md`. Câu đầu nêu cách đoán, câu thứ hai "Nhưng" kèm dữ kiện bác
nó, sau đó mới hỏi rồi đáp. Bài giảng kể chỗ người học đoán sai thì khác: câu thứ hai là lý do cách đoán nghe hợp lý,
câu thứ ba mới "Nhưng" (`teaching-checklist.md`, mục Chỗ hay hiểu sai).

Sai (người hỏi vừa đoán "chắc Nginx chặn?"): "Lỗi 403 nghĩa là server biết bạn là ai mà không cho vào. Có nhiều nơi trả mã
này…"

Sửa: "Bạn đoán Nginx chặn. Nhưng log Nginx ghi request đã đi qua và app trả 403, nên chỗ chặn là app."

Vì sao: người hỏi cần biết ngay mình đoán đúng hay sai; giảng trước thì họ vừa đọc vừa giữ câu hỏi trong đầu.

### 1.3 Hỏi rồi đáp

Câu hỏi bám vào thứ vừa nói bằng "vậy", "thế", "còn… thì sao". Câu đáp trả lời thẳng trước, lý do đi sau, và làm luôn
câu chủ đề của đoạn. Không hỏi rồi bỏ lửng, không hỏi dồn, không để ba đoạn liền cùng mở bằng câu hỏi. Câu hỏi không có
câu đáp ngay sau là câu hỏi tu từ, bỏ đi. Riêng câu hỏi của cả bài (bài giảng nêu ở đầu, cả bài trả lời) thì được, miễn
mục ngay sau bắt đầu đáp nó.

Sai: "Vì sao pod cứ restart? Có nhiều lý do. Trước hết cần hiểu Kubernetes quản lý container thế nào."

Sửa: "Vì sao pod cứ restart? Vì app không trả lời lần hỏi thăm định kỳ trong 3 giây, nên Kubernetes tắt nó rồi chạy lại."

Vì sao: câu hỏi để lửng bắt người đọc giữ nó trong đầu qua mấy đoạn, tới khi được đáp thì họ đã quên mình hỏi gì.

### 1.4 Báo cáo, thư công việc thì nói ngay

Báo cáo, thư công việc, kiến nghị thì không hỏi. Câu đầu nói ngay đang bàn gì hoặc viết để làm gì. Câu thứ hai là một
thứ cụ thể: một ví dụ có tên, một con số, một chi tiết thấy được.

Sai: "Thời gian qua, hệ thống đã gặp một số vấn đề cần được quan tâm."

Sửa: "Trang đăng nhập trả 502 từ 22h00 tới 22h12 tối qua. Trong 12 phút đó, khách không đăng nhập được."

Vì sao: người đọc báo cáo đọc hai câu đầu để quyết có đọc tiếp không.

## 2. Mạch lạc trước, rồi câu sau nắm tay câu trước

### 2.1 Mỗi đoạn một đề tài, một trình tự

Mạch lạc là mọi câu trong đoạn cùng nói về một đề tài và đứng theo một trình tự: theo thời gian, theo nhân quả, hay từ
đặc điểm tới điều nó kéo theo. Câu lạc đề tài hay sai thứ tự thì thêm bao nhiêu từ nối đoạn vẫn hỏng.

Sai: "Ổ /data đầy 93% lúc 19:57. Team đã họp với khách sáng thứ Hai. Log của app chiếm 60 GB."

Sửa: bỏ câu về cuộc họp, hay dời nó sang đoạn khác; hai câu còn lại nối thành "Ổ /data đầy 93% lúc 19:57, trong đó log
của app chiếm 60 GB."

Vì sao: người đọc coi mỗi câu là một bước tiếp của câu trước; câu lạc đề làm họ tìm mối nối không có.

### 2.2 Mỗi câu nối với câu trước bằng một phép liên kết

Có mạch lạc rồi mới tới nối câu. Mỗi câu nối với câu trước bằng ít nhất một cách:

- Phép lặp: lặp từ khoá của câu trước, tốt nhất là mở câu sau bằng thứ câu trước vừa kết thúc.
- Phép thế: thay bằng danh từ gốc kèm "này", "ấy", "đó" ("Nhận thức ấy…"). Chỉ dùng "nó", "họ" khi câu trước chỉ có một
  danh từ để trỏ về.
- Phép nối: dùng từ nối hợp với quan hệ thật giữa hai ý. Bảng tra ở `cohesion.md`.
- Trạng ngữ chỉ thời gian hay nơi chốn ở đầu câu.

Cách thử là che câu trước đi. Câu sau vẫn đứng một mình được, không thiếu gì, thì hai câu đang rời nhau.

Sai: "Bash tìm lệnh trong một danh sách thư mục. Biến môi trường có nhiều loại."

Sửa: "Bash tìm lệnh trong một danh sách thư mục. Danh sách ấy nằm trong biến PATH."

Vì sao: câu nối với câu trước thì người đọc không phải tự đoán hai câu dính nhau thế nào.

### 2.3 Đoạn cũng nối như câu

Câu đầu đoạn mới nắm lấy câu cuối đoạn cũ. Đổi đề tài thì xuống dòng; câu sau còn đang triển khai câu trước thì viết
liền. Cách nối đoạn chi tiết ở `cohesion.md`, mục Nối đoạn.

## 3. Ý có quan hệ thì viết thành một câu

### 3.1 Ý có quan hệ thì gộp bằng câu ghép

Hai ý có quan hệ nhân quả, điều kiện, nhượng bộ thì cho vào một câu ghép: vì… nên, nếu… thì, tuy… nhưng, phải… thì… mới.
Đã mở cặp thì đóng cặp. Hai vế nói về cùng một loại thứ.

Sai: "Bảng `users` không có index trên cột email. Mỗi lần đăng nhập, database đọc hết 2 triệu dòng."

Sửa: "Bảng `users` không có index trên cột email, nên mỗi lần đăng nhập database phải đọc hết 2 triệu dòng."

Vì sao: tách ra hai câu cụt thì người đọc phải tự nối "nên"; viết thành một câu thì quan hệ hiện ra ngay.

### 3.2 Vế sau không mượn sai chủ ngữ

Vế sau bỏ chủ ngữ thì mượn chủ ngữ của vế trước. Chủ ngữ ấy không làm được việc ở vế sau thì phải nói chủ ngữ riêng.
Gộp hai câu khi sửa văn hay sinh ra lỗi này nhất.

Sai: "Bản 2.3 thêm cache cho trang tìm kiếm, chưa đo lại độ trễ." (bản phần mềm không tự đo)

Sửa: "Bản 2.3 thêm cache cho trang tìm kiếm, nhưng nhóm chưa đo lại độ trễ."

Vì sao: người đọc gán việc ở vế sau cho chủ ngữ vế trước, nên câu nói một điều vô lý mà người viết không định nói.

### 3.3 Độ dài và nhịp câu

Câu 20 tới 30 tiếng không sao, miễn khớp nối rõ. Câu dài ngắn xen nhau. Câu cụt dùng để nói kết quả của một bước kiểm tra
("Log app sạch."), không dùng để tóm hay răn. Đoạn một câu chỉ dùng khi câu đó là kết quả hay bước ngoặt cần đứng riêng;
báo cáo, hướng dẫn không chèn đoạn một câu cho có nhịp.

Sai: "Pod khởi động. Probe kiểm tra. Container chạy lại."

Sửa: "Pod khởi động chậm nên probe hỏi lúc app chưa sẵn sàng, và Kubernetes restart container."

Vì sao: chuỗi câu cụt bỏ mất quan hệ giữa các việc; câu nào cũng dài như nhau thì đọc đều đều.

### 3.4 Không rút câu cho vừa số chữ

Người dùng đặt mốc số chữ mà bài vượt thì bỏ hẳn một ý không cần, hay tách làm hai bài, rồi báo số tiếng thật trong lời
trả ("Ghi chú 520 tiếng, quá mốc 400 vì phần cách đo không bỏ được"). Không cắt từ nối, không nén câu cho vừa mốc.

Vì sao: câu bị nén mất "nên", "vì" thì ngắn hơn vài chữ mà khó hiểu hơn nhiều.

## 4. Hình trước, tên và định nghĩa sau

### 4.1 Bắt đầu từ thứ người đọc đã thấy

Bắt đầu từ một vật người đọc đang có hoặc đã thấy. Kể nó làm gì theo thứ tự, rồi mới gọi tên và chốt định nghĩa. Với
một vật thì tả hình dáng và chỗ đặt, gọi tên, rồi nói nó dùng để làm gì.

Sai: "Rate limit là số request tối đa API cho gọi trong một phút. Từ 10:00, app nhận lỗi 429 liên tục."

Sửa: "Từ 10:00, cứ gọi API quá 100 lần trong một phút là app nhận lỗi 429, và phải đợi sang phút sau mới gọi tiếp được.
Giới hạn đó gọi là rate limit: số lần tối đa API cho một khoá gọi trong một phút."

Vì sao: thấy việc xảy ra trước thì cái tên có chỗ bám; gặp tên trước thì người đọc phải nhớ một chữ chưa có nghĩa.

### 4.2 Hai khái niệm dễ lẫn thì định nghĩa thành một cặp

Hai thứ dễ lẫn (401 với 403, exception với log lỗi) thì định nghĩa cả hai trong một câu, hay hai câu kề nhau, theo cùng
một khuôn và nối bằng "còn": "401 là server chưa biết bạn là ai, còn 403 là server biết bạn là ai mà không cho vào." Câu
như vậy gọi là câu cặp. Có ba trường hợp hay làm hỏng câu cặp:

- Thứ nhất đã được định nghĩa ở đoạn trước. Khi thứ hai xuất hiện, gọi lại thứ nhất ngay cạnh nó cho thành cặp, đừng
  để hai định nghĩa cách nhau cả đoạn (`examples.md`, mục 20).
- Thứ nhất mới chỉ xuất hiện như một bằng chứng ("log không có dòng X", "X không xảy ra"), dù câu đó có giải X là gì.
  Như vậy chưa tính là đã định nghĩa thành cặp. Câu đầu tiên gọi tên thứ hai phải viết đủ cặp: "Y là…, còn X (cái đã
  nhắc ở trên) là…" (`examples.md`, mục 23).
- Câu cặp đổi chữ khi gọi lại thứ nhất. Câu cặp phải giữ nguyên động từ và chữ chỉ trạng thái câu trước đã dùng.

Sai (câu trước viết "app ném exception"): "Exception là lỗi app báo ra khi gặp chuyện không xử lý được."

Sửa: "Exception là lỗi app tự ném ra khi gặp chuyện không xử lý được, còn dòng ERROR trong log là chữ app ghi lại."

Vì sao: hai định nghĩa cách xa nhau thì người đọc không so được; đổi chữ "ném" thành "báo" thì họ tưởng là một việc
khác, nhất là chữ "báo" đứng cạnh "log" dễ đọc thành ghi log.

### 4.3 Chủ ngữ là người hay vật làm việc

Chủ ngữ của câu giải thích là một vật hay một người làm một việc ("router bỏ packet"). Không lấy "định nghĩa", "cơ chế",
"việc triển khai" làm chủ ngữ. Không mở câu bằng "Với…", "Qua…" rồi quên chủ ngữ.

Sai: "Việc triển khai bản mới đã được thực hiện vào lúc 14:00."

Sửa: "Nhóm deploy bản mới lúc 14:00."

Vì sao: chủ ngữ trừu tượng giấu mất ai làm, mà người đọc thường cần biết ai làm để xử lý tiếp.

### 4.4 Câu định nghĩa có "là"

Câu định nghĩa có chữ "là". Không viết định nghĩa theo khuôn "Tên: lời giải thích" trong câu văn; viết thành hai câu,
câu sau lặp từ khoá của câu trước.

Sai: "Cache: chỗ giữ sẵn kết quả đã tính."

Sửa: "Cache là chỗ giữ sẵn kết quả đã tính. Nhờ cache, lần hỏi sau không phải tính lại."

Vì sao: khuôn hai chấm là khuôn của từ điển và slide, đặt vào câu văn thì đứt mạch kể.

## 5. Một thứ một tên, mỗi đoạn một thuật ngữ mới

### 5.1 Một thứ một tên

Một khái niệm một tên trong cả văn bản. Từ thường thì đổi được cho đỡ lặp, còn thuật ngữ thì chỉ lặp lại hoặc thay bằng
"nó", "cái này". Ba chỗ hay lọt tên thứ hai:

- Lời giải nghĩa thành tên. Giải "cache là chỗ giữ sẵn kết quả" xong thì những câu sau vẫn gọi là cache, không lúc "chỗ
  giữ sẵn", lúc "bộ đệm".
- Động từ cho cùng một việc kỹ thuật. Đã viết "chặn" thì không chỗ khác "từ chối", "drop"; đã viết "deploy" thì không
  chỗ khác "triển khai", "đẩy lên". Chữ người dùng gõ trong lời yêu cầu ("bị drop") không buộc phải theo, nhưng chọn chữ
  nào thì giữ chữ đó. Tên in ra trong output thì để trong dấu mã, không tính là động từ thứ hai.
- Hai thứ dính nhau mà khác nhau (máy chủ và máy ảo, repo và nhánh, ổ đĩa và phân vùng). Chọn một chữ cho thứ đang được
  nói tới, hoặc giải cả hai một lần rồi giữ rõ thứ nào là thứ nào. Câu chép lại từ tệp vào của người dùng ("máy chủ đã
  restart") cũng đổi về chữ đã chọn, trừ khi trích nguyên văn trong ngoặc kép hay dấu mã.

Sai: "Cache là chỗ giữ sẵn kết quả. Khi bộ đệm đầy, chỗ giữ sẵn sẽ xoá bớt mục cũ."

Sửa: "Cache là chỗ giữ sẵn kết quả. Khi cache đầy, nó xoá bớt mục cũ."

Vì sao: người đọc thấy tên khác thì tưởng là thứ khác.

### 5.2 Thuật ngữ tiếng Anh giữ nguyên

Thuật ngữ có tên chuẩn tiếng Anh thì giữ nguyên, không dịch sang tiếng Việt (option, không "cờ"; layer, không "tầng"), và
viết thế nào thì để yên thế, một dạng viết suốt bài. Chữ viết tắt phải có chỗ giải. Danh sách chi tiết ở `word-choice.md`,
mục Thuật ngữ.

Sai: "Thêm cờ `--force` để ghi đè tệp đã có."

Sửa: "Thêm option `--force` để ghi đè tệp đã có."

Vì sao: người đọc sẽ gặp lại chữ tiếng Anh trong lệnh, log và tài liệu; chữ dịch bắt họ tự đổi ngược.

### 5.3 Mỗi đoạn tối đa một thuật ngữ mới

Thuật ngữ mới là mọi từ người đọc chưa biết, tính theo điều đã chốt ở bước "người đọc đã biết gì": tên thành phần (node,
pod), tên trạng thái, tên tín hiệu, mã số (exit code), tên option, tên metric. Mỗi đoạn chỉ đưa một thuật ngữ mới. Cách
tính:

- Chữ người dùng đã gõ hay đã thấy trong output mà chưa hiểu (họ chép lại tên trạng thái, mã lỗi rồi hỏi vì sao) vẫn là
  thuật ngữ mới.
- Tên công cụ, lệnh, option, tính năng nêu trong lời khuyên cũng là thuật ngữ mới.
- Tên dashboard, biểu đồ, màn hình người dùng ghi lại ("dashboard upstream", "bảng p95"): chữ chưa giải trong tên đó vẫn
  là thuật ngữ mới, nên gọi bằng thứ nó đo ("biểu đồ thời gian trả lời của app").
- Chữ người dùng tự dùng đúng trong lời hỏi và thuộc mảng họ đã biết (transaction, `@Transactional` với người code Spring)
  thì tính là đã biết.
- Tên tự đặt ghép từ chữ đã biết, đọc là ra nghĩa ("phần ngoài thư mục log"), không tính là thuật ngữ mới, nhưng đặt rồi
  thì nó là tên duy nhất của thứ đó.

Bài không cần thuật ngữ nào thì đừng nhắc nó, kể cả khi người dùng đã gõ. Kể ví dụ cho một nhóm thì tối đa ba thứ, và câu
phải nói chúng thuộc nhóm nào.

Lời giải nghĩa thuật ngữ mới đặt ở câu dùng nó lần đầu hoặc câu ngay trước, bằng từ quen hơn từ được giải. Cụm giải nghĩa
ngắn đặt cuối câu, sau dấu phẩy hay trong ngoặc đơn. Cụm chen giữa chủ ngữ và động từ thì tách thành câu riêng đặt trước.

Sai: "Pod, đơn vị nhỏ nhất Kubernetes chạy, bị tắt lúc 02:00."

Sửa: "Kubernetes chạy app trong những đơn vị nhỏ gọi là pod. Pod `api` bị tắt lúc 02:00."

Vì sao: hai chữ mới trong một đoạn thì người đọc chưa kịp nắm chữ này đã phải nhận chữ kia; cụm giải nghĩa chen giữa câu
bắt họ giữ chủ ngữ trong đầu qua cả lời giải.

### 5.4 Chuỗi việc kéo theo nhiều thuật ngữ

Một chuỗi việc hay kéo theo nhiều thuật ngữ đi liền: thành phần A gửi tín hiệu B, process trả mã C, hệ thống ghi trạng
thái D. Gặp chuỗi như thế thì:

- Chỉ gọi tên thuật ngữ người đọc sẽ gặp lại (chữ in trong log, trên dashboard, trong câu hỏi của họ). Phần còn lại nói
  bằng lời thường ("tắt process ngay, không cho nó dọn dẹp").
- Bỏ tên một thành phần thì vẫn nói ai làm việc đó, bằng tên hệ thống người đọc đã biết (Nginx thay cho tên module,
  browser thay cho tên engine).
- Câu kể một bước trong chuỗi vì sao, nhất là việc người dùng hỏi tới ("cứ chiều là bị chặn"), phải nói ai làm: không
  viết "request bị chặn" mà viết "Nginx chặn request". Câu dòng thời gian mà người làm không quan trọng thì được bỏ chủ
  thể; chưa biết ai làm thì ghi là chưa biết. Chuỗi do hai thành phần làm thì mỗi bước gọi thành phần của bước đó, không
  gán cả chuỗi cho thành phần đầu.
- Thuật ngữ nào cũng phải gọi tên thì tách chuỗi ra, mỗi thuật ngữ một đoạn ngắn, đoạn sau mở bằng thứ đoạn trước vừa nhắc.
- Tên metric, tên trường trong output chỉ để chỉ chỗ lấy số thì thường bỏ được; nói số đó đo cái gì ("số request lỗi mỗi
  phút trên dashboard"). Giữ tên khi người đọc phải tự đi tìm ô đó, và khi giữ thì nó là thuật ngữ mới của đoạn.
- Người dùng chỉ xin "nói qua", "sơ sơ" phần cách chỉnh thì phần đó nói việc cần làm và lý do bằng lời thường ("đo xem app
  khởi động mất bao lâu rồi mới đặt mức chờ"), không đưa option, lệnh, tên công cụ, tên trường cấu hình. Người dùng hỏi
  tiếp mới đưa (`examples.md`, mục 24).

Sai (người dùng hỏi vì sao browser chặn trang): "Server gửi leaf certificate mà thiếu intermediate CA, browser không dựng
được chain tới root CA nên báo lỗi."

Sửa: "Server gửi thiếu một mảnh trong bộ certificate, nên browser không kiểm tra được certificate của trang và chặn trang.
Mã lỗi browser hiện là `NET::ERR_CERT_AUTHORITY_INVALID`, chữ bạn sẽ gặp lại khi tra lỗi này."

Vì sao: bốn thuật ngữ trong một câu thì không cái nào được giải, mà người đọc chỉ cần một cái để tra tiếp.

### 5.5 Mỗi câu tối đa hai đoạn mã

Tên tham số, option dòng lệnh, tên lớp lỗi, tên metric, tên trạng thái, tên trường chép từ output (`Last State`), nhãn có
dấu "=" thì đặt trong dấu mã, cả bài một kiểu. Một câu mang tối đa hai đoạn mã hay ký hiệu; cụm option viết gộp (`-ltnp`)
tính là một. Câu cần nhắc ba cái trở lên thì tách câu, và mỗi câu sau khi tách vẫn giữ vế nhân quả của nó, không bỏ
"nên", "tức" cho ngắn.

Sai: "Chạy `git fetch`, `git status` rồi `git log HEAD..origin/main` để xem nhánh lệch bao nhiêu."

Sửa: "Chạy `git fetch` để tải các commit mới về máy, rồi `git status` để xem nhánh của bạn đi sau bao nhiêu commit. Muốn
xem từng commit đó thì chạy `git log HEAD..origin/main`."

Vì sao: ba đoạn mã trong một câu thì mắt nhảy qua lại giữa chữ và mã, người đọc không nhớ được cái nào làm gì.

### 5.6 Soát thuật ngữ sau khi viết

Viết xong bản nháp thì liệt kê thuật ngữ mới của từng đoạn, kể cả chữ người dùng đã gõ và tên trong lời khuyên. Đoạn nào
có từ hai trở lên thì tách, hay nói một cái bằng lời thường. Rồi liệt kê mọi chữ đã dùng cho mỗi thứ quan trọng, cả danh
từ lẫn động từ; thứ nào có hai chữ thì gộp về một (`examples.md`, mục 18, 19 và 23). Sáu cách giải nghĩa một từ nằm ở
`word-choice.md`.

## 6. Nói thật

### 6.1 Không bịa trải nghiệm

Chỉ kể ở ngôi thứ nhất việc đã xảy ra thật. Không bịa trải nghiệm, cảm xúc, từ cảm thán.

Sai: "Mình từng mất cả đêm vì lỗi này."

Sửa: bỏ câu, hay "Lỗi này rất dễ gặp khi…".

Vì sao: người đọc tin bài vì nghĩ nó kể chuyện thật; một câu bịa lộ ra làm họ nghi cả bài.

### 6.2 Chỉ dùng dữ kiện được đưa

Viết từ dữ kiện người dùng đưa thì chỉ dùng những dữ kiện đó. Không thêm suy diễn, chi tiết cho tròn câu, ví dụ hay con
số tự nghĩ ra. Thiếu dữ kiện mà câu không viết được thì viết câu nói rõ chưa có, rồi hỏi một câu trong lời trả; không để ô
trống. Thiếu chi tiết chỉ làm bài đầy hơn thì không hỏi.

Sai: "Sự cố kéo dài từ 09:10 tới [__]."

Sửa: "Sự cố bắt đầu lúc 09:10; log chưa cho biết giờ hết lỗi." Lời trả kèm một câu hỏi: "Log chỉ có giờ bắt đầu 09:10,
anh có giờ hết lỗi trên dashboard không?"

Vì sao: ô trống làm người nhận tưởng bài chưa xong; hỏi dồn thì người dùng phải trả lời cả chuyện bài không cần.

### 6.3 Số đo không nói quá điều nó đo

- Vài mẫu đo không nói được xu hướng. Hai số ở hai thời điểm chỉ nói được "lúc A là x, lúc B là y", không nói "đã đi
  xuống", "tăng dần".
- Hiệu của hai số đo khác loại (dung lượng `du` đếm với dung lượng `df` báo; số request vào với số request lỗi của hai
  nguồn) không cho ra phần còn lại. Giải vì sao phép trừ không ra thì nói thứ nằm trong số lớn mà không thuộc phần cần
  tìm, hay thứ thuộc phần cần tìm mà số lớn không đếm ("số người đến có cả người không đăng ký mà vẫn tới"). Hai số do
  hai người, hai công cụ đo không tự làm phép trừ hỏng, đừng lấy đó làm lý do. Không biết chắc hai số đếm gì thì nói thẳng
  là chưa rõ.
- Dữ kiện chỉ phủ một khoảng (quanh một lần lỗi, một ngày) thì câu chỉ nói về khoảng đó, không viết "chưa lần nào", "lúc
  nào cũng".

Sai: "Lúc 09:00 ổ dùng 60%, lúc 10:00 dùng 65%, ổ đang đầy dần."

Sửa: "Lúc 09:00 ổ dùng 60%, lúc 10:00 dùng 65%."

Vì sao: hai điểm đo không vẽ được một đường; câu "đầy dần" là đoán mà viết như đã đo.

### 6.4 Đã rào thì không nghiêng

Đã rào một điều ("chưa tách được", "chưa đủ dữ kiện") thì câu sau không nghiêng kết luận về một phía mà lời rào vừa nói
là chưa biết, kể cả bằng "nhiều khả năng", "có vẻ". Nói thiếu gì, cần đo thêm gì để biết. Có một dấu hiệu cho X thì "có
lẽ X" vẫn được; luật này chỉ cấm nghiêng ngay sau câu vừa nói là chưa tách được X với Y. Luật áp cho văn viết mới; sửa
văn có sẵn mà tác giả viết "nhiều khả năng X, chưa xác nhận" thì giữ mức đó như gốc.

Sai: "Chưa đủ dữ kiện để biết ổ đầy vì log hay vì image Docker. Nhiều khả năng là do log."

Sửa: "Chưa đủ dữ kiện để biết ổ đầy vì log hay vì image Docker; chạy `du -sh /var/log /var/lib/docker` thì biết phần nào
lớn."

Vì sao: câu rào vừa nói chưa biết, câu sau lại nói biết, hai câu chọi nhau.

### 6.5 Tả hậu quả thì chỉ nói phần chắc

Tả hậu quả của một lệnh, một lỗi thì chỉ nói phần chắc: lỗi gì, dừng hay chạy tiếp, ghi đè hay không. Lượng ước chừng như
"một nửa", "hàng loạt" thì bỏ, hay ghi "có thể".

Sai: "Chạy lệnh này sẽ làm hỏng hàng loạt dữ liệu."

Sửa: "Lệnh này ghi đè bảng `orders`, không hỏi lại."

Vì sao: người đọc cần biết lệnh làm gì để quyết có chạy không; chữ "hàng loạt" doạ mà không cho biết gì.

### 6.6 Văn gửi người ngoài không để ô trống

Văn gửi người ngoài còn chỗ chưa chốt thì viết câu nói rõ chỗ đó chưa chốt, không để ô trống kiểu "[__]".

Sai: "Hệ thống bảo trì từ [__] tới [__]."

Sửa: "Giờ bảo trì chưa chốt; bên em sẽ báo lại trước thứ Sáu."

Vì sao: ô trống tới tay khách đọc như bên mình quên điền.

### 6.7 "Mình" là ai

Ghi chú viết hộ để người dùng lưu thì "mình" là chủ ghi chú, tức người dùng, và chỉ dùng cho việc họ đã kể là đã làm, đã
đoán. Lời trả trong chat thì "mình" là người viết.

### 6.8 Có nguồn mới viết số, năm, tên chuẩn, lời trích

Con số, năm, tên chuẩn, lời trích chỉ viết khi kiểm tra được nguồn. Con số đi kèm thứ để so và thời điểm đo. Output
chưa chạy thật thì ghi là kỳ vọng. Trích nguyên văn thì để trong ngoặc kép, cắt bớt thì đánh dấu […]. Chi tiết ở
`citations-data-figures.md`.

### 6.9 Nói đúng mức chắc chắn

Chọn từ chỉ mức chắc chắn theo bảng ở `word-choice.md`, mục Thành phần tình thái. "Tất cả", "luôn luôn" chỉ dùng khi không
có ngoại lệ.

Sai: "Nguyên nhân là ổ đầy." (chưa xem dung lượng ổ)

Sửa: "Có lẽ ổ đầy; chưa kiểm tra lại dung lượng."

Vì sao: câu trơn đọc thành chắc chắn, và người đọc sẽ làm theo như điều đã kiểm tra.

### 6.10 Không khen, không phán xét người đọc

Không khen người đọc, không khen câu hỏi, không phán xét một nhóm người.

Sai: "Câu hỏi hay đấy! Người mới hay nhầm chỗ này."

Sửa: "Rất dễ nghĩ là… Nhưng…"

Vì sao: lời khen và lời phán xét không cho người đọc thêm gì, lại đặt người viết lên cao hơn họ.

### 6.11 Câu ai cũng viết được thì bỏ

Câu nào đặt vào bài nào cũng được, không có chi tiết thật đứng sau, thì sửa hoặc bỏ.

Sai: "Sự cố đã được xử lý kịp thời, đảm bảo hệ thống vận hành ổn định."

Sửa: "Lúc 22h15 em rollback về bản 2.4.0, trang đăng nhập trả lời bình thường từ 22h16."

Vì sao: câu chung chung không cho người đọc biết điều gì về việc này.

## 7. Dùng chữ người ta vẫn nói ngoài đời

Muốn thử một từ hay một mẫu câu thì tự hỏi: nếu đang giải thích chuyện này cho một người ngồi cạnh, mình có nói ra chữ đó
không? Không nói thì đừng viết.

### 7.1 Chọn từ đời thường

Ưu tiên từ toàn dân, đời thường: vì, nên, mà, chứ, hết, đầy, chỗ, thứ, lý do. Từ Hán Việt người ta ít nói ngoài đời
("thẩm định", "tiến hành") thì thay bằng từ thường; từ Hán Việt ai cũng nói ("hệ thống", "kiểm tra") thì giữ
(`word-choice.md`, mục Chọn từ). Không lấy biệt ngữ xã hội, từ ngữ địa phương, thán từ, câu tỉnh lược tới mức mất chủ ngữ,
trừ khi viết theo hồ sơ giọng của một người (`voice.md`, mục Dùng hồ sơ).

Sai: "Tiến hành thẩm định cấu hình trước khi triển khai."

Sửa: "Xem lại cấu hình trước khi deploy."

Vì sao: chữ người ta không nói ra miệng làm câu nghe như văn công văn, người đọc phải dịch lại trong đầu.

### 7.2 Nhấn bằng lời, không bằng chữ in hoa

Chữ viết không có giọng và nét mặt. Ý nào khi nói phải nhấn giọng thì khi viết nói thành lời: nói ra hỏng gì, mất gì.

Sai: "Bước này QUAN TRỌNG, đừng bỏ qua."

Sửa: "Bỏ bước sao lưu thì migrate hỏng giữa chừng sẽ không còn bản nào để quay về."

Vì sao: chữ in hoa chỉ báo là có nhấn, câu sửa nói ra vì sao phải nhấn.

### 7.3 Những dấu hiệu gặp nhiều nhất

Bảng đầy đủ ở `machine-tells.md`. Gặp nhiều nhất:

- "Không phải X, mà là Y" khi chưa ai nói X.
- "Không chỉ… mà còn…" để nâng tầm; bộ ba cho đủ vần; dãy từ gần nghĩa thay cho một con số.
- Mở bằng dựng cảnh, "Trong xã hội hiện đại…", "Trong cuộc sống…".
- Kết bằng "Tóm lại", "Hãy…", "Nhớ gọn:", một câu châm ngôn, hay một câu khẳng định ý nghĩa dùng cho bài nào cũng được.
  Hết ý thì dừng.
- "Hãy…", "hành trình", "điều quan trọng nhất là", "thật ra", "đóng vai trò", "chúng ta".
- Mọi phần cùng một khuôn.

## Trình bày

### Văn bản ngắn thì viết liền

Văn bản ngắn như ghi chú, email, câu trả lời trong chat thì viết liền: không chia đề mục, không in đậm nhãn. Ngắn ở đây là
dưới khoảng 800 tiếng; văn bản cỡ đó không cần bảng hay hình làm điểm nghỉ mắt, xuống dòng giữa các đoạn là đủ. Danh sách
việc cần làm có người nhận, có hạn thì vẫn giữ gạch đầu dòng, chỉ bỏ nhãn in đậm. Giải thích bằng lời trước; bảng tóm thì
ngắn, bảng dài chỉ để tra.

Đếm chữ thì đếm theo tiếng, không tính nhan đề, đề mục và khối code nhiều dòng. Đoạn mã trong dòng (`-Xmx1g`) vẫn tính, mỗi
chữ tách bằng dấu cách là một, kể cả mốc giờ, ngày, số và đơn vị (`09:15`, `21/4`, `GB`). Người dùng xin một khoảng
("300-400 chữ") thì đếm cả hai cách, có và không có đoạn mã trong dòng, và giữ cả hai con số trong khoảng đó.

### Danh sách, đề mục, hình

Không mở mọi gạch đầu dòng bằng nhãn in đậm. Không đặt đề mục cho phần chỉ có một hai câu. Các mục trong một danh sách
cùng loại, cùng cấp. Hình, bảng, sơ đồ bám vào một ý đang nói, có câu trong bài trỏ tới, có chú thích nói nó cho thấy gì.

### Phép so sánh

Phép so sánh có chữ "giống", "như"; ẩn dụ là so sánh ngầm, bỏ chữ so sánh. Cả hai theo các luật dưới đây.

- Tối đa một phép so sánh, cho khái niệm trung tâm, đặt sau khi đã nói ý bằng lời thường, kèm chỗ nó hết đúng.
- Câu mở có chủ ngữ là thứ đang bàn ("Chuyện của ổ này giống…"), không mở bằng "Giống…:" rồi dấu hai chấm làm khung. Vế
  so là việc người ta làm thật ngoài đời; phải bịa một luật lạ cho vế so ("chỉ giới hạn ngăn của mình sao cho bằng cả
  tủ") thì đổi cách so sánh khác.
- Phép so sánh không mang con số hay phép chia mà bài đã nói là chưa biết. Bài vừa rào "chưa tách được phần A với phần B"
  thì trong phép so sánh cũng không gán số cân, số ngăn cho từng phần (`examples.md`, mục 21).
- Chỗ hết đúng chọn chỗ người đọc dễ suy sai nhất từ phép so sánh, nhất là chỗ nó chia rạch ròi một thứ mà ngoài đời chưa
  chia được; không chọn một khác biệt vô hại. Chỗ hết đúng cũng không nói ngược câu bài vừa viết: bài đã kể một phần gồm
  những gì thì chỗ chưa biết là nó lớn bao nhiêu, có lớn dần không, chứ không phải "chưa biết gồm gì". Vật đem ra so có cỡ
  cố định mà thứ thật có thể lớn dần thì chỗ hết đúng nói ra điều đó (`examples.md`, mục 25).
- Đoạn so sánh đặt ngay sau đoạn nó minh hoạ, trước khi sang ý mới. Đoạn ngay sau đoạn so sánh gọi lại thứ đang bàn bằng
  tên, không mở bằng "số liệu này", "chuyện đó", vì gần nhất là đoạn so sánh. Cách thử: đọc liền câu cuối đoạn trước với
  câu đầu đoạn so sánh; đoạn so sánh không minh hoạ câu đó thì nó đang đứng sai chỗ.

Vì sao: phép so sánh giúp nhớ, nhưng người đọc suy từ vật đem so ra thứ thật, nên chỗ nào vật ấy khác thứ thật mà không
nói ra thì họ suy sai.

## Khi sửa văn có sẵn

### Sửa cấu trúc trước, thay từ sau

Sửa cấu trúc câu và đoạn trước, thay từ sau. Câu đã ổn thì để yên. Giữ giọng của tác giả, chỉ đổi xưng hô khi được yêu cầu.

### Giữ dữ kiện và mức chắc chắn của tác giả

Giữ nguyên dữ kiện, con số, tên riêng, mức chắc chắn, ý của tác giả. Không thêm chi tiết, ví dụ, nguồn. Gốc thiếu chi
tiết mà bản sửa cần chi tiết đó mới viết được thì nói với người dùng là thiếu, không tự điền. Hai dữ kiện vênh nhau thì
giữ như gốc và hỏi, không gỡ theo cách đọc của mình (`common-errors.md`, dòng Hai dữ kiện vênh nhau). Gốc tự lệch mức chắc
chắn, một câu nói chắc còn câu khác nói chưa xác nhận, thì theo mức thấp hơn ở mọi câu. Lý do là chính tác giả đã nói là
chưa chắc (`common-errors.md`, dòng Hai câu lệch mức chắc chắn).

Sai (gốc ghi "Lỗi do certificate hết hạn" ở đoạn đầu, rồi "có lẽ certificate hết hạn, chưa xem lại ngày" ở đoạn sau): giữ
cả hai câu như gốc.

Sửa: "Có lẽ lỗi do certificate hết hạn; chưa xem lại ngày hết hạn."

### Không thêm quan hệ gốc không nói

Gộp hay viết lại câu thì không thêm quan hệ trước sau, nhân quả mà gốc không nói.

Sai (gốc kể hai lệnh rời nhau): "Cài xong rồi chạy `init`."

Sửa: giữ hai câu rời, hay nối bằng "và".

Vì sao: "rồi", "nên" là dữ kiện mới; người đọc sẽ làm theo thứ tự hay tin quan hệ ấy như tác giả đã nói.

### Lời trích, code, chữ in đậm

Không đụng lời trích nguyên văn, output, code, đường dẫn, tên lệnh. Riêng dấu gạch dài, gạch vừa trong lời trích thì đổi
thành gạch nối, chữ giữ nguyên ("báo lỗi - tôi thử ba lần"), như `punctuation.md`. Lời trích của người ngoài (khách, người
dùng) đứng ở đâu cũng có câu dẫn nối nó vào mạch kể, nói nó minh hoạ ảnh hưởng nào: "Phía khách, thanh toán treo rồi báo
lỗi; CSKH chuyển lại lời một khách: …", không đặt lời trích ngay sau một câu nói chuyện khác. Chữ in đậm giữa câu văn
của gốc thì bỏ.

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
bớt nặng thì được, nói giảm tới mức người nhận không biết đó là lỗi thì không. Lỗi làm người đọc xoá nhầm dữ liệu không
viết thành "có lẽ nên cân nhắc xem lại".

## Phạm vi của skill

Skill này không áp cho văn bản quy phạm pháp luật, hợp đồng, biểu mẫu, thơ, lời thoại. Văn bản hành chính nhà nước thì
theo `official-documents.md`: ở đó khuôn mẫu là bắt buộc, và một số luật ở trên làm ngược lại.

Một dấu hiệu đơn lẻ chưa phải là lỗi; sửa khi nó lặp thành khuôn hay làm câu khó hiểu. Riêng mấy thứ sau thì gặp là sửa,
dù chỉ một chỗ: dấu gạch dài, gạch vừa, "đúng" để nhấn, "Hãy" mở câu hướng dẫn, "chúng ta", lời khen người đọc, trải
nghiệm bịa, emoji, mũi tên.

Sửa thì đừng sửa quá tay: không chặt hết thành câu cụt, không rút cho ngắn, không rải "ừ thì", "nói thật là" cho ra vẻ
người. Văn bản nào cũng giữ giọng hợp với nó, không ép giọng thân mật, và không bỏ định nghĩa chuẩn hay nguồn cho đời thường. Người dùng chê một
câu thì sửa câu đó và hỏi lý do trước khi áp cho cả bài.

## Dấu gạch và ký hiệu

Không dùng dấu gạch dài và gạch vừa ở bất cứ đâu, kể cả nhan đề, đề mục, chú thích, bảng, danh sách nguồn, ghi chú trong
code, sơ đồ, commit message, câu trả lời trong chat; chỉ dùng gạch nối thường. Thành phần phụ chú thì đặt giữa hai dấu
phẩy hay trong ngoặc đơn. Nhan đề viết "A: B". Khoảng số viết "3-5 giờ" hay dùng "tới". Ô bảng không có giá trị thì viết
thành chữ.

Trong câu văn không dùng mũi tên, dấu tick, emoji, số khoanh tròn, `~`, `&`, `=`; viết thành chữ. Không viết in hoa cả chữ
để nhấn, không in đậm rải khắp đoạn. Sửa xong thì tìm hai ký tự gạch dài, gạch vừa trong mọi tệp; kết quả phải là 0.
Bảng thay thế đầy đủ ở `punctuation.md`.

## Trả lời trong chat

### Hỏi gì trả lời cái đó

Hỏi gì trả lời cái đó, vài câu. Thấy thêm điều cần nói ngoài câu hỏi thì một dòng ở cuối. Câu hỏi "là gì", "vì sao" về
thứ người dùng chưa học trong phiên thì giảng trọn một cơ chế; câu hỏi có hay không, ở đâu, xong chưa thì vài câu. Câu
hỏi tò mò giữa lúc làm việc thì trả lời đủ rồi dừng, không đố lại. Người dùng nói sai thì nói thẳng là sai, kèm lý do.

Sai (người dùng hỏi "pod lên chưa?"): ba đoạn giảng readiness probe.

Sửa: "Lên rồi, 3/3 pod Running từ 09:20."

### Câu hỏi gửi người dùng phải tự đứng được

Câu hỏi hay đề xuất gửi người dùng nói đủ: ở đâu (tệp, màn hình, vị trí nào), hiện giờ thế nào, vì sao phải hỏi, mỗi
phương án trông ra sao. Không dùng mã nội bộ người dùng chưa thấy bao giờ.

Sai: "Mục C3 xử lý theo hướng A hay B?"

Sửa: "Đầu `README.md` ghi bản 1.2, còn `package.json` ghi 1.3. Mình sửa README theo `package.json`, hay giữ nguyên và
hỏi lại người phát hành?"

### Báo kết quả

Báo kết quả công việc thì chỉ gồm vấn đề cụ thể và việc cần làm. Không đoạn khen, không mục "điểm tốt", không bảng chấm
điểm, không ước lượng thời gian kiểu "1-2 ngày", không lộ trình nhiều tuần. Báo kết quả một việc sửa, kiểm tra, chạy thì
nói đã kiểm tra gì, bằng cách nào; chưa kiểm tra gì; chỗ nào là đoán.

### Giao văn bản vừa viết

Giao một văn bản vừa viết mới (ghi chú, bài, thư) thì lời trả chỉ gồm đường dẫn tệp hay chính văn bản, cộng một hai câu
nêu chỗ thiếu dữ kiện hay chưa kiểm tra, gọi tên thứ cụ thể. Không tóm lại văn bản, không nhắc lại số liệu trong đó, không
kể đã chạy lint hay đọc lại mấy lượt, không báo số chữ khi không ai hỏi. Người dùng đoán sai thì một câu nói sai ở đâu là
đủ, lý do để trong văn bản. Cả lời trả không quá ba câu, khoảng 100 chữ, không câu nào quá 40 chữ (`examples.md`, mục 22).

Những việc sau có mục lời trả riêng, và theo mục đó thay cho mốc ba câu:

- Tệp Word, PDF: `docx-export.md`, mục Lời trả kèm tệp.
- Văn bản hành chính: `official-documents.md`, mục Soát.
- Báo cáo rà soát: `review-reports.md`, mục Lời trả trong chat.
- Tài liệu gửi khách: `diagrams-and-docs.md`.
- Bài giảng: `teaching.md`, mục Giao bài.
- Bản nháp góp ý: `feedback.md`.
- Nháp bộ nhớ: `agent-memory.md`.

Câu hỏi có muốn dựng bộ nhớ không (`SKILL.md`, mục Bộ nhớ cho agent) và câu hỏi có muốn gửi góp
ý về skill không (`SKILL.md`, mục Góp ý về skill) là dòng riêng ở cuối, không tính vào mốc đó; có cả hai thì gộp một dòng.

### Soát lời trả như soát văn

Câu trong lời trả cũng soát như văn trong tệp: một thứ một tên, không hai chữ "nên" khác nghĩa liền nhau, không nói quá
điều đã đếm. Người dùng dán mật khẩu, token vào chat thì nói rõ đó là thứ gì và khuyên thu hồi, đổi mới (`agent-memory.md`,
mục Mật khẩu và token).

## Lời trả theo từng việc

Bảng Trả kết quả trong `SKILL.md` là bản gọn; đây là bản đủ.

### Viết mới

Đường dẫn tuyệt đối trọn của từng tệp (hay chính văn bản), thêm một hai câu về chỗ chưa kiểm tra hay thiếu dữ kiện. Không
tóm lại văn bản, không kể việc đã soát (nói dữ kiện nào đã đối chiếu với nguồn thì không tính là kể việc soát), không kể
lại chỗ người dùng đã tự chốt; cả lời trả không quá ba câu (mục Trả lời trong chat ở trên). Tài liệu gửi khách thì theo
`diagrams-and-docs.md`.

### Sửa đoạn được dán vào

Bản đã sửa đặt ngay đầu lời trả, không câu dẫn ("Bản sửa đây:", "Dưới đây là bản đã sửa"). Sau bản sửa là tối đa năm dòng
nêu thay đổi chính, mỗi dòng một thay đổi kèm lý do của nó ("bỏ câu hỏi tu từ vì nó không đưa dữ kiện nào"); dòng chỉ kể
đã sửa gì mà không nói vì sao thì chưa đủ.

Thay đổi nhiều hơn năm thì chọn năm thay đổi người đọc dễ thấy nhất: đổi nghĩa, đổi mức chắc chắn, gộp hay sắp lại câu. Sửa
dấu và ký hiệu (gạch dài, mũi tên, in đậm, chữ in hoa) không cần dòng riêng. Có nêu thì gom vào một dòng cuối với một lý
do chung ("bỏ in đậm và chữ in hoa vì ghi chú ngắn đọc liền là đủ"). Dòng nào cũng kể một việc đã làm. Những việc cố ý
không làm, như không thêm "vì" gốc không nói, không chiếm dòng riêng. Lời trích trong dòng thay đổi chép nguyên chữ của gốc,
kể cả chữ hoa chữ thường.

Sai:

- Ký hiệu đổi thành chữ, bỏ chữ in hoa, nhãn in đậm, gạch dài.
- Không thêm "nên" giữa việc nâng bản Java và việc build chậm.

Sửa:

- Gộp hai câu cùng mở bằng "Nhóm mobile" thành một câu, vì hai việc liền nhau của cùng một nhóm.
- Bỏ in đậm, chữ in hoa và mũi tên, vì ghi chú ngắn đọc liền là đủ, không cần nhấn.

Chỗ vênh hay đọc được hai cách mà bản sửa phải chọn một mới viết được thì thêm một dòng hỏi ở cuối, ngoài năm dòng: một
câu hỏi, nói câu nào ghi gì và cách hiểu có thể. Chỗ cần hỏi nhiều hơn một thì hỏi chỗ bản sửa phải chọn mà không chọn
được. Không hỏi thêm chi tiết gốc không có (chức danh của một người, một con số) để bài đầy hơn; chỗ gốc thiếu mà bản sửa
giữ như gốc thì không hỏi.

### Sửa một tệp

Chỉ sửa phần văn, báo số chỗ đã sửa theo loại, kiểu "6 câu hỏi rồi đáp, 7 chỗ xưng hô, 1 dấu gạch".

### Soát mà không sửa

Từng chỗ "câu gốc, vấn đề, cách sửa", từ nặng tới nhẹ, theo thứ tự người dùng dặn nếu có. Mỗi mục một chỗ, không gộp bằng
"thêm nữa"; chỗ thiếu thì câu gốc là câu liền trước nơi cần thêm, ghi "thiếu, thêm sau câu …". Gom nhiều câu vào một mục
thì gọi tên lỗi của từng câu (`common-errors.md`). Lời soát dùng lại tên mình vừa đề xuất. Nói script báo mấy chỗ, nhận
chỗ nào, bỏ chỗ nào và vì sao. Người dùng dặn không sửa tệp thì nói việc mình làm là "tính lại", "kiểm tra lại".

Ba luật hay bị quên khi soát:

- Lỗi làm người đọc hiểu sai giờ, ngày, con số (chữ chỉ buổi lệch với giờ ghi bên cạnh, hai số chọi nhau) là lỗi nội
  dung, xếp trên mọi lỗi câu chữ.
- Nhắc lại một chỗ khác trong lời soát thì gọi bằng vài chữ của câu gốc ("lời dặn kiểm tra tên máy"), không bằng số mục
  tự đặt ("như mục 1"), vì người đọc phải lật lại mới biết mục 1 là gì.
- Câu gốc lạc đề hay sai thì chỉ ra và đề nghị bỏ hay hỏi tác giả; không đưa dữ kiện ngoài tệp (năm, tên, số) để bác
  nó, vì dữ kiện ấy cũng chưa kiểm tra.

### Các việc có tệp riêng

- Báo cáo lỗi, báo cáo rà soát: theo `review-reports.md`, cả mục Lời trả trong chat của tệp đó.
- Báo cáo sự cố, báo cáo công việc: theo `document-types.md`; xuất Word thì thêm `docx-export.md`.
- Hồ sơ dự thầu: làm đủ quy trình trong `bid-proposals.md`: đọc bộ tài liệu, bảng truy vết, tìm và tô vàng tài liệu hãng,
  dựng bộ tệp Word bằng `scripts/bid/`, soát bằng các lệnh ở `bid/checks.md`, báo cáo cho BA.
- Tệp Word: theo `docx-export.md`, mục Lời trả kèm tệp.
- Bộ nhớ, học từ phiên cũ: theo `agent-memory.md`, mục Học từ phiên cũ, bước 6.
