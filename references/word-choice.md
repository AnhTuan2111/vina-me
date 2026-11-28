# Chọn từ và thuật ngữ

Chọn từ là chọn chữ người đọc hiểu ngay mà không phải dịch lại trong đầu. Tệp này đi từ thuật ngữ (chữ của nghề) tới cách
giải nghĩa một từ, cách chọn từ thường, thành phần tình thái và phạm vi của câu, phép tu từ, rồi tới viết hoa và chữ viết
tắt.

## Thuật ngữ

Mỗi khái niệm có một thuật ngữ, và bài không đổi tên nó cho đỡ lặp. Người đọc thấy tên khác thì tưởng là thứ khác.

Thuật ngữ cũng không mang cảm xúc, nhất là trong báo cáo, tài liệu, tin nhắn công việc. "Con Redis cùi bắp này lại sập."
gắn một tính từ chê vào thuật ngữ mà không cho người đọc thêm gì để xử lý, và trong báo cáo thì đọc như đổ lỗi. Câu có
việc để làm thì nói sự việc: "Redis dừng lúc 09:12 vì hết RAM, lần thứ hai trong tuần."

Bài chỉ cần một thuật ngữ khi người đọc sẽ gặp lại chữ đó trong log, trên dashboard, trong lệnh phải gõ (`core-rules.md`,
điều 5). Cần thì giải nghĩa ngay tại lần đầu dùng; không cần thì nói bằng lời thường. Tin gửi sếp mà viết "Pod bị
OOMKilled do vượt memory limit của cgroup." là đưa cho sếp ba chữ mà sếp không dùng tới, vì sếp không gõ lệnh, không đọc
cgroup. Thứ sếp cần là hỏng gì và đang làm gì: "App bị Kubernetes tắt vì dùng quá mức RAM cho phép; em đang nâng mức đó
lên 1 GB."

Thuật ngữ có tên chuẩn tiếng Anh thì giữ nguyên tiếng Anh, không dịch, kể cả khi đã có chữ Việt quen: viết option, không
viết "cờ"; layer, không viết "tầng"; packet, domain, browser, certificate, cluster, exit code, status code, prompt cũng
vậy. Thuật ngữ viết thế nào ở nguồn gốc thì để yên thế, và cả bài một cách viết, không lúc "Container" lúc "container". Lần
đầu dùng thì giải nghĩa bằng lời thường. Chữ đời thường không phải thuật ngữ (máy, tệp, thư mục, lệnh, ổ đĩa, đường dẫn,
"bản 2.4" cho số phiên bản) thì vẫn viết tiếng Việt.

Động từ tiếng Anh quen trong nghề như "deploy", "rollback", "restart" cũng giữ như gốc, một dạng suốt bài, không lúc
"restart" lúc "khởi động lại". Viết cho người ngoài nghề thì giải nghĩa ở lần đầu, chứ không dịch.

Giữ thuật ngữ tiếng Anh không có nghĩa là chữ tiếng Anh nào cũng được giữ. Ranh giới nằm ở chỗ chữ đó có gọi tên một thứ
của nghề hay không. Deploy, merge, pull request, staging là tên của việc, của chỗ mà người đọc sẽ gặp lại trong lệnh, trên
giao diện, trong log, nên giữ. Còn "deadline", "confirm", "feedback", "check", "update", "basically" khi chỉ là chữ thường
thì tiếng Việt đã có chữ nói được ý đó: hạn, xác nhận, góp ý, kiểm tra, cập nhật, còn "basically" thì bỏ. Chen những chữ
này vào câu là pha tạp, điều mà sách Ngữ văn 12 gọi là làm mất sự trong sáng của tiếng Việt. "Anh confirm giúp em deadline để
em check lại plan." viết lại thành "Anh xác nhận giúp em hạn nộp để em xem lại kế hoạch."

Một chữ có thể đứng ở cả hai phía. "Update" là tên nút trên giao diện thì giữ, đặt trong ngoặc kép như mọi chữ trên giao
diện; "update tài liệu" thì viết "cập nhật tài liệu". Thử bằng câu hỏi: người đọc có cần nhận ra đúng chữ này ở một chỗ khác
(lệnh, nút, log) không. Cần thì giữ; không cần thì viết tiếng Việt.

Hai thuật ngữ dễ lẫn thì đặt cạnh nhau và chỉ nói điểm khác nhau liên quan tới việc người đọc đang làm, thường chỉ có một
điểm. Chữ dùng để gọi thay một thuật ngữ thì phải chưa dùng cho thứ khác trong bài. "Bản" đã là phiên bản (bản 2.4) thì
không gọi máy đang chạy là "bản đang chạy". Ghi chú gọi một thứ bằng tên mơ hồ ("bản cũ", "con kia") thì bài dùng tên đã
gọi nó ở chỗ khác ("bản 2.3").

## Sáu cách giải nghĩa một từ

Gặp một từ người đọc chưa biết thì có sáu cách giải nghĩa, chọn theo từ và theo người đọc:

| Cách | Làm thế nào | Ví dụ |
|---|---|---|
| Nêu khái niệm | Nói nó thuộc loại gì, rồi nét nào làm nó khác các thứ cùng loại | "Tượng đài là công trình kiến trúc lớn gồm một hoặc một nhóm tượng, đặt ở nơi công cộng để tưởng niệm." |
| Chỉ vật thật | Ảnh, hình, output, một vật người đọc đã thấy | Ảnh chụp màn hình có dòng lỗi đó |
| Đặt vào một câu cụ thể | Cho một câu dùng thật | "Món này ngon lắm" và "Xe này ngon lắm" cho hai nghĩa của "ngon" |
| Từ đồng nghĩa, trái nghĩa | Dùng một từ quen hơn | "phi trường là sân bay" |
| Tách từng phần rồi gom lại | Giải từng tiếng, rồi nói nghĩa cả từ | "di là để lại, sản là của cải; di sản là của cải người trước để lại" |
| Phân tích kèm chỗ dùng | Nói nghĩa, nói nó dùng ở đâu, khác từ gần nghĩa chỗ nào | "kiêu căng là tự cho mình hơn mà khinh người; kiêu hãnh là tự hào về giá trị của mình" |

Cách nào cũng phải qua bốn yêu cầu. Từ dùng để giải nghĩa dễ hơn từ được giải nghĩa: không giải một từ lạ bằng một từ lạ
khác, cũng không giải bằng chính nó. Định nghĩa nêu đủ các nét làm nó khác thứ cùng loại. Tách từng phần xong thì phải gom
lại thành một nghĩa. Và lời giải nghĩa dùng một lần: các câu sau quay về thuật ngữ, không lấy lời giải nghĩa làm tên thứ
hai (`core-rules.md`, điều 5).

Với người mới thì thứ tự là câu dùng thật hay vật thật trước, rồi lời giải nghĩa đặt làm thành phần phụ chú, rồi mới tới
định nghĩa đủ.

## Chọn từ

Từ toàn dân đi trước. Từ ngữ địa phương và biệt ngữ xã hội thì không dùng.

Từ Hán Việt người ta ít nói ngoài đời thì thay bằng từ thường. "Tiến hành thẩm định cấu hình trước khi triển khai" viết
thành "Xem lại cấu hình trước khi deploy". Từ Hán Việt ai cũng nói (hệ thống, kiểm tra, dịch vụ) và thuật ngữ thì giữ. Phép
thử là người ngồi cạnh: không ai nói "thẩm định cấu hình" khi nói chuyện.

Từ phải đi được với nhau. Động từ đi được với chủ ngữ của nó, và các vế ngang hàng dùng cùng một lớp từ. Giữa các từ gần
nghĩa thì chọn theo sắc thái: "chăm sóc" vườn cây, không "săn sóc"; "đốn" cây, không "cắt". Trong văn kỹ thuật, chọn sai
sắc thái có khi đổi cả việc phải làm: "xoá ổ /var" đọc thành format cả ổ, còn ý là "dọn bớt tệp trong /var".

Từ nhiều nghĩa thì thêm từ để khoá nghĩa, hoặc đổi sang từ chỉ có một nghĩa. "Giữ hai bản trên máy chủ" để người đọc đoán
là hai bản sao lưu hay hai phiên bản app; "Giữ hai bản sao lưu gần nhất trên máy chủ" thì không.

Câu cũng nói tường minh, không để người mới phải đoán hàm ý. "Cái vụ hôm trước lại bị rồi anh" chỉ người trong cuộc hiểu;
"Trang đăng nhập lại trả 502 lúc 09:10, giống lỗi ngày 21/11" thì ai đọc cũng hiểu.

Biệt ngữ xã hội ở đây là tiếng lóng của một nhóm ("toang", "out trình"). Buộc phải dùng thì để trong ngoặc kép và giải
nghĩa. Từ chuyên môn của nghề (deploy, rollback, restart) thì khác: đó là thuật ngữ, theo mục Thuật ngữ, và không để trong
ngoặc kép. Viết "Em deploy lại lúc 14h", không viết 'Em "deploy" lại lúc 14h'; viết "Bản 2.4 lỗi trang đăng nhập", không
viết "Bản 2.4 toang rồi".

Từ ghép thì viết đủ: "tóm tắt", "khai báo", "quản lý", "kiểm tra", không cắt còn "tóm", "khai", "quản", "kiểm". Cắt cho
gọn thì câu không ngắn đi bao nhiêu mà người đọc phải đoán chữ bị bỏ. Câu nào cũng đủ chủ ngữ, vị ngữ.

Mấy nhóm việc hay gặp có sẵn chữ đời thường. Nói về tài nguyên thì dùng "hết", "đầy", "tràn". Nói về việc làm thì dùng
"xem", "thử", "kiểm tra", "sửa", "chạy", "tắt", "bật". Nói về lý do thì dùng "lý do", "vì sao".

## Thành phần tình thái

Mỗi câu nói hai thứ: một sự việc (ổ đầy, request bị chặn), và người viết chắc tới đâu về sự việc đó. Sách Ngữ văn 11 gọi
phần thứ hai là nghĩa tình thái; những chữ nói ra nó, như "chắc", "có lẽ", sách lớp 9 gọi là thành phần tình thái. Cùng
một sự việc mà khác thành phần tình thái thì người đọc làm việc khác: đọc "ổ đầy" thì họ dọn ổ ngay, đọc "có lẽ ổ đầy" thì
họ kiểm tra lại trước đã.

| Mức | Từ | Dùng khi |
|---|---|---|
| Chắc chắn | để câu trơn; "chắc chắn", "rõ là" chỉ khi người đọc đang có lý do để nghi | đã kiểm tra: có log, có số đo, đã chạy lại |
| Phỏng đoán cao | "chắc", "hẳn là" | có dấu hiệu mạnh nhưng chưa kiểm tra |
| Phỏng đoán thấp | "có lẽ", "hình như", "có vẻ" | mới có một dấu hiệu, hay đang đoán |
| Ý riêng | "theo mình", "theo tôi" | đánh giá, đề xuất; không dùng cho sự việc đã kiểm tra |

Câu trơn, không có thành phần tình thái, đọc thành chắc chắn. Vì thế điều chưa kiểm tra phải mang một từ phỏng đoán, hoặc
ghi rõ "chưa kiểm tra". Ngược lại, thêm "chắc chắn" vào câu đã chắc chỉ là chữ nhấn thừa.

Thành phần tình thái đặt ở đầu câu ("Có lẽ ổ đã đầy.") hay ngay trước vị ngữ ("Ổ có lẽ đã đầy."), và nó áp cho cả phần
đứng sau. Câu có một ý đã kiểm tra và một ý đang đoán thì từ phỏng đoán đứng ngay trước ý đoán: trong "Ổ đầy, có lẽ vì log
tăng sau bản 2.4.", ổ đầy là việc đã thấy, còn lý do thì mới đoán. Mỗi câu chỉ có một thành phần tình thái; "có lẽ hình
như", "chắc có lẽ" chồng hai mức lên nhau nên người đọc không biết người viết chắc tới đâu.

Mọi câu nói về cùng một việc giữ cùng một mức, kể cả câu tóm tắt ở đầu báo cáo. Thân bài ghi "có lẽ" thì tóm tắt không được
viết "Nguyên nhân là ổ đầy" (`common-errors.md`, dòng Hai câu lệch mức chắc chắn).

Tình thái từ ("ạ", "nhé", "nhỉ") là loại khác. Chúng nói quan hệ với người đọc chứ không nói mức chắc chắn; xem
`function-words.md`, mục Tình thái từ.

## Phạm vi của câu

Thành phần tình thái nói người viết chắc tới đâu, còn phạm vi nói sự việc đúng cho bao nhiêu trường hợp. Lượng từ chỉ toàn
thể ("tất cả", "mọi") và phó từ "luôn luôn", "không bao giờ" nói sự việc đúng cho mọi trường hợp, nên chỉ dùng khi không
có ngoại lệ. Có ngoại lệ thì thu hẹp lại bằng "thường thì", "phần lớn", "ít khi", "không mấy".

## Phép tu từ

Phép tu từ là cách dùng từ, dùng câu cho lời có sức gợi hơn lời thường. Sách Ngữ văn 6 tới 12 dạy cả loạt: so sánh, ẩn dụ,
nhân hoá, hoán dụ, điệp, đối, liệt kê, nói quá, nói giảm nói tránh, nhịp câu. Văn công việc cần ít phép tu từ hơn văn kể,
và mỗi phép có chỗ dùng được, chỗ không. Bảng dưới đi từ phép hay dùng tới phép gần như không dùng trong văn công việc.
Nghị luận văn học, nghị luận xã hội, bài cảm nhận, blog kể chuyện mượn đặc trưng của phong cách nghệ thuật, nên dùng các phép
này rộng hơn cột Giới hạn, theo `essays.md`.

| Phép | Dùng được ở | Giới hạn |
|---|---|---|
| So sánh, ẩn dụ | bài giảng, lời giải thích, bài kể, bài nghị luận | mục con So sánh và ẩn dụ ngay dưới; bài nghị luận theo `essays.md` |
| Nói giảm nói tránh | lời chỉ lỗi, chỗ viết về lỗi của một người, sự cố gây thiệt hại | giảm chữ chê, không giảm sự việc; mục con Nói giảm nói tránh |
| Liệt kê, lặp cú pháp | mọi loại văn, khi các ý ngang hàng thật | mục con Liệt kê và lặp cú pháp; bộ ba cho đủ vần là văn AI slop (`machine-tells.md`, bảng B) |
| Điệp từ ngữ | lặp từ khoá để nối câu (`cohesion.md`) | lặp để dồn cảm xúc ("rất nhanh, rất gọn, rất mạnh") thì bỏ |
| Nhịp câu (tu từ ngữ âm) | bài giảng, bài kể (`storytelling.md`) | câu dài ngắn xen nhau, không đếm chữ cho đều; câu không kết bằng hư từ (`sentences-and-paragraphs.md`, mục Trật tự từ) |
| Nhân hoá | bài kể, bài giảng cho người mới, một lần trong bài; bài nghị luận, blog theo `essays.md` | tài liệu, báo cáo không viết "server đang mệt", "database kêu cứu", vì người đọc cần biết máy làm gì thật |
| Hoán dụ | chat, bài kể, bài nghị luận | báo cáo không gọi người bằng tên bộ phận khi kể lỗi ("phòng IT làm sập web"), vì câu giấu mất ai làm việc gì |
| Phép đối | nhan đề, câu mở của bài kể | câu đối xứng lặp ở nhiều đoạn là văn AI slop |
| Nói quá | chat với người quen, bài kể khi người đọc biết là phóng đại | không dùng trong tài liệu, báo cáo, thư, kiến nghị; mục con Nói quá |
| Chơi chữ, câu hỏi tu từ | không dùng trong văn công việc; bài nghị luận dùng câu hỏi tu từ ở chỗ chuyển ý hay chỗ cảm xúc dồn lên, có câu trả lời ngay sau (`essays.md`) | câu hỏi tu từ ở `machine-tells.md`, bảng B |

### Nói quá

Nói quá là phóng đại mức độ, quy mô của sự việc để gây ấn tượng. Sách Ngữ văn 8 phân biệt nó với nói khoác ở chỗ người
nghe biết đó là phóng đại. Người đọc báo cáo và tài liệu thì không biết: họ đọc "Cả công ty không ai đăng nhập được." như
một dữ kiện, trong khi log ghi 120 trên 900 lượt đăng nhập lỗi trong 15 phút. Vì vậy trong văn công việc, nói quá là nói
sai mức, phạm điều 6 của bảy điều cốt lõi (nói thật). Chữ tăng mức như "cực kỳ", "khủng khiếp", "chưa từng có", "tăng
vọt" cũng là nói quá khi đứng thay con số. Có số thì viết số ("độ trễ tăng từ 200ms lên 1,8 giây"); không có số thì tả
đúng điều đã thấy, không thêm mức.

### Nói giảm nói tránh

Nói giảm nói tránh là nói cho bớt nặng nề, bớt mất lòng. Sách dạy mấy cách làm: phủ định từ trái nghĩa ("chưa tốt" thay
"tệ"), nói vòng, dùng từ đồng nghĩa nhẹ hơn. Văn công việc dùng nó ở lời chỉ lỗi và ở chỗ kể lỗi của một người: "chưa
khớp", "cần sửa", "chưa kịp kiểm tra" thay cho "cẩu thả", "ẩu", "sai bét".

Nói giảm chỉ được giảm chữ chê, không được giảm sự việc. Bỏ chữ "ẩu" khỏi câu "Long làm ẩu nên xoá nhầm bảng." thì
vẫn phải giữ việc đã xảy ra: "Lệnh xoá chạy trên bảng production vì script không hỏi lại tên database." Báo cáo sự cố
viết theo cách này thì nói việc và chỗ mà quy trình còn thiếu, không phán xét người. Giảm tới mức người đọc không biết có
lỗi, lỗi gì, ai cần sửa ("có một vài điểm có thể cân nhắc thêm") là đã giấu lỗi (`review-reports.md`, mục Giọng).

### So sánh và ẩn dụ

So sánh có từ so sánh ("giống", "như"); ẩn dụ là so sánh ngầm, bỏ từ so sánh đi. Luật về số lượng, chỗ đặt và chỗ hết
đúng ở `core-rules.md` áp cho cả hai. So sánh thì nói rõ so về mặt nào. Ẩn dụ dễ bị hiểu rộng hơn ý muốn nói, nên mỗi văn
bản tối đa một cái, đặt sau lời giải thích bằng lời thường, và người đọc phải dùng nó để suy ra được một điều.

Câu mở phép so sánh có chủ ngữ là thứ đang bàn, không mở bằng "Giống…:". Vế đem ra so là việc người ta làm thật ngoài đời,
và chỗ hết đúng không nói ngược điều bài đã kể (`core-rules.md`, mục Trình bày).

### Liệt kê và lặp cú pháp

Các mục trong một lần liệt kê cùng loại, cùng cấp. Có tăng tiến thì xếp theo thứ tự tăng dần. Các ý ngang hàng viết theo
cùng một kiểu câu, sách giáo khoa gọi là phép lặp cú pháp, để người đọc thấy ngay chúng ngang hàng.

## Viết hoa và tên riêng

| Thứ | Viết thế nào | Ví dụ |
|---|---|---|
| Tên cơ quan, tổ chức | Viết hoa chữ đầu của từng bộ phận | "Trường Đại học Sư phạm Hà Nội", "Sở Tài nguyên và Môi trường" |
| Tên nước ngoài phiên âm | Viết hoa chữ đầu mỗi bộ phận, gạch nối giữa các tiếng | "Lép Tôn-xtôi" |
| Tên nước ngoài đọc theo Hán Việt | Như tên Việt | "Lỗ Tấn", "Thái Lan" |
| Tên công cụ, hãng, sản phẩm | Giữ nguyên dạng gốc | "PostgreSQL", "GitLab" |
| Danh từ chung | Không viết hoa để nhấn mạnh | "container", không "Container" |
| Danh từ chung dùng để tỏ sự tôn trọng đặc biệt | Viết hoa, theo chương trình Tiếng Việt lớp 5; chỉ dùng trong văn bản hành chính, hồ sơ gửi cơ quan và bài viết về người được tôn kính | "Bác", "Người" khi chỉ Chủ tịch Hồ Chí Minh; "Nhân dân", "Nhà nước" (`official-documents.md`) |
| Chữ chung đứng trước tên một nhóm trong công ty (team, nhóm) | Viết thường chữ chung giữa câu, giữ hoa tên riêng | "team Billing báo lỗi", không "Team Billing báo lỗi" giữa câu |
| Loại tài nguyên Kubernetes (pod, node, deployment) | Bài kể sự việc, báo cáo sự cố: danh từ chung, viết thường như "container". Bài giảng về các đối tượng API thì viết hoa như tên kind cả loạt ("Deployment giữ đủ số Pod đã khai"). Một bài một kiểu | "2 trong 5 pod bị restart", không "2 trong 5 Pod" cạnh "container" |

## Chữ viết tắt

Chữ viết tắt lần đầu viết đủ, kèm dạng viết tắt trong ngoặc đơn. Từ đó bài dùng dạng viết tắt, một dạng duy nhất. Dữ kiện
không cho tên đầy đủ thì giữ chữ viết tắt trần, không tự đoán tên đầy đủ.
