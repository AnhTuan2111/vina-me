# Đề nhóm proposal: sửa một bản kiến nghị lập luận chưa chặt, lẫn phong cách

Lời yêu cầu nằm ở `prompt.md` (dán nguyên vào phiên làm bài). Không có tệp vào. Dữ kiện đều là giả: repo shop-web, máy
jenkins-01, người tên Nam, anh Quang không gắn với công ty thật nào.

## Đề thử điều gì của skill

- Ba lỗi lập luận ở `references/document-types.md`, mục Nghị luận, thuyết phục (sách Ngữ văn 12): luận điểm không nhất
  quán, luận cứ không xác đáng hay không đủ, lập luận mâu thuẫn hay luận cứ không dẫn tới kết luận. Bản kiến nghị mắc cả
  ba, mỗi lỗi ít nhất hai chỗ.
- Lẫn phong cách ở `document-types.md`, mục Phong cách chức năng: kiến nghị là văn chính luận mà bản gốc pha giọng quảng
  cáo ("giải pháp đột phá, mang tính cách mạng"), khẩu ngữ của chat ("Nói chung là", "kiểu như là", "anh ạ") và lời kêu gọi
  ("Hãy cùng nhau hành động"). Người dùng còn dặn "đọc ra dáng kiến nghị chứ đừng như chat", nên bỏ khẩu ngữ mà không đẩy
  sang giọng công văn.
- Luật kiến nghị ở `document-types.md`, mục Kiến nghị, đề xuất: mở bằng việc mình đã làm, chuỗi biểu hiện, tác động, nguyên
  nhân, giải pháp; kết bằng việc người nhận cần làm; không tự đặt con số.
- Luật sửa văn có sẵn: giữ luận điểm của tác giả, không thêm dữ kiện ("đừng thêm gì nha"), hai câu ngược nhau thì hỏi tác
  giả chứ không tự chọn. Cách trả kết quả theo dòng "Sửa đoạn được dán vào" của bảng Trả kết quả trong `SKILL.md`.

## Đáp án dữ kiện

Bài phải giữ đủ và đúng giá trị:

| Mã | Dữ kiện |
|---|---|
| D1 | Đề xuất chuyển pipeline của repo shop-web từ Jenkins sang GitLab CI, trong tháng 12 |
| D2 | Từ 01/11 tới 25/11, pipeline shop-web chạy 214 lần |
| D3 | 9 lần hỏng vì plugin Git của Jenkins bị treo |
| D4 | Lần nào Nam cũng phải vào máy jenkins-01 restart Jenkins bằng tay |
| D5 | GitLab CI dễ học hơn: người mới đọc file `.gitlab-ci.yml` là hiểu (lý do này giữ lại được, nhưng không còn là "lý do chính") |
| D6 | Câu về runner: gốc nói không cần thêm máy, chạy trên jenkins-01, rồi lại nói cần thêm một máy runner 8 GB RAM (chỗ mâu thuẫn, xem dưới) |
| D7 | Đề xuất bỏ bước test tích hợp trong pipeline để pipeline nhanh hơn (đề xuất khác luận điểm, xem dưới) |
| D8 | Người ký: Nam; người nhận: anh Quang |

## Ba lỗi lập luận bài phải xử lý

### Luận điểm không nhất quán

1. Đoạn số liệu cho thấy lý do thật là Jenkins hỏng 9 trong 214 lần và phải restart tay, nhưng đoạn sau viết "Lý do chính
   để chuyển là GitLab CI dễ học hơn". Bài tốt chốt luận điểm theo số liệu (lỗi treo plugin, restart tay) và để "dễ học"
   thành lý do phụ, hoặc hỏi Nam lý do nào là chính. Giữ "Lý do chính… dễ học" ngay sau đoạn số liệu là chưa sửa.
2. "Bỏ luôn bước chạy test tích hợp" là một đề xuất khác, không đỡ cho luận điểm chuyển CI. Bài tốt tách nó khỏi kiến
   nghị này (để riêng một dòng, hay đề nghị Nam gửi một kiến nghị khác) và nói lý do trong danh sách thay đổi. Lặng lẽ xoá
   là bỏ luận điểm của tác giả mà không nói; giữ nguyên như một phần của đề xuất là chưa sửa.

### Luận cứ không xác đáng hay không đủ

3. "Google, Netflix và rất nhiều công ty lớn đều dùng GitLab CI nên chắc chắn nó phù hợp với mình." Luận cứ không dính tới
   hoàn cảnh của đội, kèm "chắc chắn". Bỏ câu.
4. "Em đọc trên một blog thấy GitLab CI chạy nhanh hơn Jenkins gấp 3 lần." Nguồn không kiểm tra được, con số không đo trên
   hệ thống của đội. Bỏ câu, hoặc giữ mà nói rõ là con số trên blog chưa đo lại (vẫn yếu, trừ nhẹ).
5. "Jenkins lúc nào cũng lỗi" kể 9 trên 214 lần thành lúc nào cũng lỗi. Viết theo số thật.
6. "đội mất rất nhiều thời gian" không có số. Bỏ chữ nhấn, hay nói bằng việc có thật (mỗi lần phải restart tay); không tự
   đặt số giờ.

### Lập luận mâu thuẫn, luận cứ không dẫn tới kết luận

7. "Jenkins trên máy jenkins-01 đang chạy ổn định, chưa phải restart lần nào trong tháng 11" ngược với 9 lần restart bằng tay
   trong cùng tháng, và vế "vì vậy cần chuyển sớm" không theo từ vế trước. Bài phải nêu chỗ ngược và hỏi Nam câu nào đúng;
   không tự bỏ một vế mà không nói. Bỏ câu "ổn định" và nói trong danh sách thay đổi là nó ngược với đoạn số liệu thì được.
8. "GitLab runner không cần thêm máy, chạy luôn trên jenkins-01" ngược với "Chuyển xong thì mình sẽ cần thêm một máy runner
   8 GB RAM". Bài phải nêu và hỏi Nam; trong bản sửa thì để chỗ đánh dấu cần xác nhận, hay giữ cả hai mà nói rõ là đang
   chờ xác nhận. Tự chọn một vế là bịa.

## Phong cách

- Bỏ câu mở quảng cáo "Trong kỷ nguyên số, GitLab CI là giải pháp đột phá, mang tính cách mạng cho mọi đội phát triển.";
  mở bằng đề xuất và việc Nam đã làm (restart tay 9 lần).
- Bỏ khẩu ngữ "Nói chung là", "kiểu như là", "hơi cũ rồi anh ạ".
- Bỏ "Hãy cùng nhau hành động để đội mình bắt kịp xu thế!" và "Rất mong anh quan tâm."; kết bằng việc anh Quang cần làm
  (xem và duyệt đề xuất). Gốc không có hạn duyệt, nên không tự đặt ngày; nhắc tới "chiều nay" là lúc Nam gửi, không phải
  hạn của anh Quang.
- Giữ xưng em, anh; giọng trang trọng vừa như kiến nghị gửi lead, không "Kính gửi", "Căn cứ", "Trân trọng đề nghị".

## Điều bài không được bịa

- Số giờ đội mất, tỉ lệ phần trăm ngoài phép chia 9 trên 214 (tính ra khoảng 4% là đúng), tốc độ đo được, chi phí.
- Hạn duyệt, ngày bắt đầu chuyển cụ thể trong tháng 12, kế hoạch chuyển nhiều bước, người làm khác ngoài Nam.
- Lý do kỹ thuật vì sao plugin Git treo, tính năng của GitLab CI mà gốc không nói (cache, runner tự co giãn).
- Câu trả lời thay Nam cho hai chỗ mâu thuẫn.

## Bẫy đã cài

| Bẫy | Ở đâu | Bài tốt làm gì | Lỗi hay gặp |
|---|---|---|---|
| Lý do chính đổi giữa bài | đoạn ba | Chốt luận điểm theo số liệu, "dễ học" thành lý do phụ | Giữ "Lý do chính… dễ học" |
| Đề xuất lạc luận điểm | đoạn năm | Tách ra, nói lý do | Lặng lẽ xoá, hay giữ chung |
| Luận cứ theo người nổi tiếng | đoạn ba | Bỏ | Giữ, chỉ bỏ "chắc chắn" |
| Nguồn không kiểm tra được | đoạn ba | Bỏ, hay nói rõ là chưa đo | Giữ "nhanh gấp 3 lần" như dữ kiện |
| Khái quát quá đà | đoạn hai | Theo số thật 9 trên 214 | Giữ "lúc nào cũng lỗi" |
| Hai câu ngược nhau về restart | đoạn hai, đoạn bốn | Nêu và hỏi | Lặng lẽ bỏ câu "ổn định" |
| Vế "vì vậy" không theo được | đoạn bốn | Bỏ vế đó | Giữ "vì vậy cần chuyển sớm" |
| Hai câu ngược nhau về máy runner | đoạn bốn | Nêu, hỏi, đánh dấu chờ xác nhận | Tự chọn "không cần máy" hay "cần máy 8 GB" |
| Giọng quảng cáo, khẩu ngữ, kêu gọi | đoạn một, hai, cuối | Bỏ cả ba loại | Bỏ khẩu ngữ mà giữ "giải pháp đột phá" |
| Sửa quá tay sang công văn | cả bài | Giọng kiến nghị gửi lead | "Kính gửi", "Căn cứ", "Trân trọng" |
| Tự đặt hạn | câu kết | Kết bằng việc anh Quang cần làm, không ngày | "Anh duyệt trước thứ Sáu" |
| Cách trả kết quả | cuối bài | Bản sửa, tối đa năm dòng thay đổi kèm lý do, câu hỏi về hai chỗ mâu thuẫn tự đứng được | Mười dòng thay đổi, bảng chấm điểm, ghi ra tệp |
