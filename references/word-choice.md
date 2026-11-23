# Chọn từ và thuật ngữ

## Thuật ngữ

- Một khái niệm một thuật ngữ. Không đổi tên cho đỡ lặp.
- Thuật ngữ không mang cảm xúc, nhất là trong báo cáo, tài liệu, tin nhắn công việc: không gắn tính từ khen chê vào nó.
  Sai: "Con Redis cùi bắp này lại sập." Sửa: "Redis dừng lúc 09:12 vì hết RAM, lần thứ hai trong tuần." Tính từ khen chê
  không cho người đọc thêm gì để xử lý, và trong báo cáo đọc như đổ lỗi.
- Thuật ngữ cần khi người đọc sẽ gặp lại chữ đó trong log, trên dashboard, trong lệnh phải gõ (`core-rules.md`, điều 5);
  cần thì giải nghĩa ngay tại lần đầu dùng, không cần thì nói bằng lời thường. Sai (tin gửi sếp): "Pod bị OOMKilled do
  vượt memory limit của cgroup." Sửa: "App bị Kubernetes tắt vì dùng quá mức RAM cho phép; em đang nâng mức đó lên 1 GB."
  Sếp không gõ lệnh, không đọc cgroup; thứ sếp cần là hỏng gì và đang làm gì.
- Thuật ngữ có tên chuẩn tiếng Anh thì giữ nguyên tiếng Anh, không dịch, kể cả khi đã có chữ Việt quen: viết option, không
  "cờ"; layer, không "tầng"; packet, domain, browser, certificate, cluster, exit code, status code, prompt. Nó
  viết thế nào ở nguồn gốc thì để yên thế, một cách viết duy nhất trong cả bài (không lúc "Container" lúc "container").
  Lần đầu dùng thì giải nghĩa bằng lời thường. Chữ đời thường không phải thuật ngữ (máy, tệp, thư mục, lệnh, ổ đĩa,
  đường dẫn, "bản 2.4" cho số phiên bản) thì vẫn viết tiếng Việt.
- Hai thuật ngữ dễ lẫn thì đặt cạnh nhau và chỉ nói điểm khác liên quan tới việc người đọc đang làm, thường là một.
- Chữ thay cho một thuật ngữ phải chưa dùng cho thứ khác trong bài: "bản" đã là phiên bản (bản 2.4) thì không gọi máy
  đang chạy là "bản đang chạy". Ghi chú gọi một thứ bằng tên mơ hồ ("bản cũ", "con kia") thì bài dùng tên đã gọi nó ở
  chỗ khác ("bản 2.3").
- Động từ tiếng Anh quen trong nghề ("deploy", "rollback", "restart") cũng giữ như gốc, một dạng suốt bài, không lúc
  "restart" lúc "khởi động lại". Viết cho người ngoài nghề thì giải nghĩa ở lần đầu, không dịch.

## Sáu cách giải nghĩa một từ

| Cách | Làm thế nào | Ví dụ |
|---|---|---|
| Nêu khái niệm | Nói nó thuộc loại gì, rồi nét nào làm nó khác các thứ cùng loại | "Tượng đài là công trình kiến trúc lớn gồm một hoặc một nhóm tượng, đặt ở nơi công cộng để tưởng niệm." |
| Chỉ vật thật | Ảnh, hình, output, một vật người đọc đã thấy | Ảnh chụp màn hình có dòng lỗi đó |
| Đặt vào một câu cụ thể | Cho một câu dùng thật | "Món này ngon lắm" và "Xe này ngon lắm" cho hai nghĩa của "ngon" |
| Từ đồng nghĩa, trái nghĩa | Dùng một từ quen hơn | "phi trường là sân bay" |
| Tách từng phần rồi gom lại | Giải từng tiếng, rồi nói nghĩa cả từ | "di là để lại, sản là của cải; di sản là của cải người trước để lại" |
| Phân tích kèm chỗ dùng | Nói nghĩa, nói nó dùng ở đâu, khác từ gần nghĩa chỗ nào | "kiêu căng là tự cho mình hơn mà khinh người; kiêu hãnh là tự hào về giá trị của mình" |

Bốn yêu cầu:

- Từ dùng để giải nghĩa phải dễ hơn từ được giải nghĩa. Không giải một từ lạ bằng một từ lạ khác, không giải bằng
  chính nó.
- Định nghĩa nêu đủ các nét làm nó khác thứ cùng loại.
- Tách từng phần xong phải gom lại thành một nghĩa.
- Lời giải nghĩa dùng một lần; các câu sau quay về thuật ngữ, không dùng lời giải nghĩa làm tên thứ hai
  (`core-rules.md` điều 5).

Với người mới thì đưa một câu dùng thật hoặc một vật thật trước, rồi lời giải nghĩa đặt làm thành phần phụ chú, rồi mới tới định nghĩa
đủ.

## Chọn từ

- Từ toàn dân trước; từ ngữ địa phương và biệt ngữ xã hội thì không.
- Từ Hán Việt người ta ít nói ngoài đời thì thay bằng từ thường: "Tiến hành thẩm định cấu hình trước khi triển khai"
  viết thành "Xem lại cấu hình trước khi deploy". Từ Hán Việt ai cũng nói (hệ thống, kiểm tra, dịch vụ) và thuật ngữ thì
  giữ. Phép thử là người ngồi cạnh: không ai nói "thẩm định cấu hình" khi nói chuyện.
- Động từ phải đi được với chủ ngữ. Các vế ngang hàng cùng một lớp từ.
- Chọn giữa các từ gần nghĩa theo sắc thái, ví dụ "chăm sóc" vườn cây, không "săn sóc"; "đốn" cây, không "cắt"; "dọn bớt tệp trong /var", không "xoá ổ /var" (đọc thành format cả ổ).
- Từ nhiều nghĩa thì thêm từ để khoá nghĩa, hoặc đổi sang từ một nghĩa: "Giữ hai bản sao lưu gần nhất trên máy chủ",
  không "Giữ hai bản trên máy chủ" (hai bản sao lưu hay hai phiên bản app?).
- Nói tường minh. Không để người mới phải đoán hàm ý: "Trang đăng nhập lại trả 502 lúc 09:10, giống lỗi ngày 21/11",
  không "Cái vụ hôm trước lại bị rồi anh".
- Biệt ngữ xã hội ở đây là tiếng lóng của một nhóm ("toang", "out trình"); buộc phải dùng thì để trong ngoặc kép và chú
  nghĩa. Từ chuyên môn của nghề (deploy, rollback, restart) là thuật ngữ, theo mục Thuật ngữ, không để ngoặc kép: "Em
  deploy lại lúc 14h", không 'Em "deploy" lại lúc 14h'; "Bản 2.4 lỗi trang đăng nhập", không "Bản 2.4 toang rồi".
- Viết đủ từ ghép: "tóm tắt", "khai báo", "quản lý", "kiểm tra", không cắt còn "tóm", "khai", "quản", "kiểm". Cắt cho gọn
  thì câu không ngắn đi bao nhiêu mà người đọc phải đoán chữ bị bỏ. Câu nào cũng đủ chủ ngữ, vị ngữ.

Nói về tài nguyên thì dùng "hết", "đầy", "tràn". Nói về việc làm thì dùng "xem", "thử", "kiểm tra", "sửa", "chạy",
"tắt", "bật". Nói về lý do thì dùng "lý do", "vì sao".

## Thành phần tình thái

Mỗi câu nói hai thứ: một sự việc (ổ đầy, request bị chặn), và người viết chắc tới đâu về sự việc đó. Sách Ngữ văn 11 gọi
phần thứ hai là nghĩa tình thái; những chữ nói ra nó, như "chắc", "có lẽ", sách lớp 9 gọi là thành phần tình thái. Cùng
một sự việc mà khác thành phần tình thái thì người đọc làm việc khác: đọc "ổ đầy" thì họ dọn ổ ngay, đọc "có lẽ ổ
đầy" thì họ kiểm tra lại trước đã.

| Mức | Từ | Dùng khi |
|---|---|---|
| Chắc chắn | để câu trơn; "chắc chắn", "rõ là" chỉ khi người đọc đang có lý do để nghi | đã kiểm tra: có log, có số đo, đã chạy lại |
| Phỏng đoán cao | "chắc", "hẳn là" | có dấu hiệu mạnh nhưng chưa kiểm tra |
| Phỏng đoán thấp | "có lẽ", "hình như", "có vẻ" | mới có một dấu hiệu, hay đang đoán |
| Ý riêng | "theo mình", "theo tôi" | đánh giá, đề xuất; không dùng cho sự việc đã kiểm tra |

Câu trơn, không có thành phần tình thái, đọc thành chắc chắn. Vì thế điều chưa kiểm tra phải mang một từ phỏng đoán,
hoặc ghi rõ "chưa kiểm tra". Ngược lại, thêm "chắc chắn" vào câu đã chắc chỉ là chữ nhấn thừa.

Cách đặt thành phần tình thái:

- Đặt ở đầu câu ("Có lẽ ổ đã đầy.") hay ngay trước vị ngữ ("Ổ có lẽ đã đầy."). Từ đó áp cho cả phần đứng sau nó.
- Câu có một ý đã kiểm tra và một ý đang đoán thì đặt từ phỏng đoán ngay trước ý đoán: "Ổ đầy, có lẽ vì log tăng sau bản
  2.4." Ổ đầy là việc đã thấy, còn lý do thì mới đoán.
- Một câu một thành phần tình thái. "Có lẽ hình như", "chắc có lẽ" chồng hai mức, người đọc không biết người viết chắc
  tới đâu.
- Mọi câu nói về cùng một việc giữ cùng một mức, kể cả câu tóm tắt ở đầu báo cáo: thân bài ghi "có lẽ" thì tóm tắt không
  được viết "Nguyên nhân là ổ đầy" (`common-errors.md`, dòng Hai câu lệch mức chắc chắn).

Tình thái từ ("ạ", "nhé", "nhỉ") là loại khác: chúng nói quan hệ với người đọc chứ không nói mức chắc chắn. Xem
`function-words.md`, mục Tình thái từ.

## Phạm vi của câu

Thành phần tình thái nói người viết chắc tới đâu, còn phạm vi nói sự việc đúng cho bao nhiêu trường hợp.

- Lượng từ chỉ toàn thể ("tất cả", "mọi") và phó từ "luôn luôn", "không bao giờ" nói sự việc đúng cho mọi trường hợp.
  Chỉ dùng khi không có ngoại lệ.
- "Thường thì", "phần lớn", "ít khi", "không mấy" thu hẹp lại, dùng khi có ngoại lệ.

## So sánh và ẩn dụ

- So sánh có từ so sánh ("giống", "như"); ẩn dụ là so sánh ngầm, bỏ từ so sánh. Luật về số lượng, chỗ đặt, chỗ hết
  đúng ở `core-rules.md` áp cho cả hai.
- So sánh thì nói rõ so về mặt nào.
- Ẩn dụ là so sánh ngầm, dễ bị hiểu rộng hơn ý muốn nói. Tối đa một cái mỗi văn bản, đặt sau lời giải thích bằng lời
  thường, và phải dùng nó để suy ra được một điều.
- Câu mở phép so sánh có chủ ngữ là thứ đang bàn, không "Giống…:". Vế so là việc người ta làm thật ngoài đời. Chỗ hết đúng
  không nói ngược điều bài đã kể (`core-rules.md`, mục Trình bày).

## Liệt kê và lặp cú pháp

- Các mục cùng loại, cùng cấp.
- Có tăng tiến thì xếp theo thứ tự tăng dần.
- Các ý ngang hàng viết theo cùng một kiểu câu (phép lặp cú pháp).

## Viết hoa và tên riêng

| Thứ | Viết thế nào | Ví dụ |
|---|---|---|
| Tên cơ quan, tổ chức | Viết hoa chữ đầu của từng bộ phận | "Trường Đại học Sư phạm Hà Nội", "Sở Tài nguyên và Môi trường" |
| Tên nước ngoài phiên âm | Viết hoa chữ đầu mỗi bộ phận, gạch nối giữa các tiếng | "Lép Tôn-xtôi" |
| Tên nước ngoài đọc theo Hán Việt | Như tên Việt | "Lỗ Tấn", "Thái Lan" |
| Tên công cụ, hãng, sản phẩm | Giữ nguyên dạng gốc | "PostgreSQL", "GitLab" |
| Danh từ chung | Không viết hoa để nhấn mạnh | "container", không "Container" |
| Loại tài nguyên Kubernetes (pod, node, deployment) | Bài kể sự việc, báo cáo sự cố: danh từ chung, viết thường như "container". Bài giảng về các đối tượng API thì viết hoa như tên kind cả loạt ("Deployment giữ đủ số Pod đã khai"). Một bài một kiểu | "2 trong 5 pod bị restart", không "2 trong 5 Pod" cạnh "container" |

## Chữ viết tắt

Lần đầu viết đủ, kèm chữ viết tắt trong ngoặc đơn. Từ đó dùng chữ viết tắt, một dạng duy nhất. Dữ kiện không cho tên
đầy đủ thì giữ chữ viết tắt trần, không tự đoán.
