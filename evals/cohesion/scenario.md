# Đề nhóm cohesion: nối một ghi chú toàn câu cụt

Lời yêu cầu nằm ở `prompt.md` (dán nguyên vào phiên làm bài). Không có tệp vào. Dữ kiện đều là giả: máy db-1, web-1, web-2,
repo payment, ticket OPS-118, người tên Lan, anh Hà không gắn với hệ thống thật nào.

## Đề thử điều gì của skill

Đề thử `references/cohesion.md` (các phép liên kết, mục Chọn kiểu câu để nối) và mục Trật tự từ của
`references/sentences-and-paragraphs.md`:

- Hai câu liền nhau cùng chủ thể gộp được bằng trạng ngữ chỉ tình huống.
- Chuyển từ web-1 sang web-2 nối được bằng khởi ngữ "Còn web-2 thì…" hay câu ghép có "còn".
- Ba câu về bản 2.4 và nhóm QA cần giữ một chủ đề, không lặp nguyên tên ở đầu mỗi câu.
- Pipeline với "bước test" đã nối bằng phép liên tưởng, không cần thêm từ nối.
- Câu cuối kết bằng hư từ "cho" đọc vấp, cần đổi trật tự.
- Gốc kể việc theo thứ tự lộn (02:10 rồi 22h tối qua). Bài sắp lại theo thời gian hay chia đoạn theo đề tài đều được, miễn
  mỗi đoạn một đề tài và người đọc không lẫn mốc giờ.

Ngoài ra thử luật "không thêm quan hệ nhân quả gốc không nói" (`core-rules.md`, mục Khi sửa văn có sẵn) và cách trả kết quả
"Sửa đoạn được dán vào".

## Đáp án dữ kiện

| Mã | Dữ kiện |
|---|---|
| D1 | Bàn giao ca đêm 24/11 |
| D2 | Lúc 02:10 Lan nhận cảnh báo ổ /data của db-1 đầy 92% |
| D3 | Lan xoá log cũ trong /var/log/app |
| D4 | Lúc 02:25 ổ còn 71% |
| D5 | Bản 2.4 của app đặt lịch deploy lúc 22h tối qua |
| D6 | Nhóm QA kiểm tra bản 2.4 tới 23h, chưa thấy lỗi |
| D7 | Máy web-1 đã lên bản 2.4, máy web-2 chưa lên |
| D8 | Máy web-2 báo thiếu biến môi trường PAYMENT_KEY |
| D9 | Pipeline của repo payment đang đỏ, bước test hỏng ở module refund |
| D10 | Lỗi pipeline nằm ở ticket OPS-118; anh Hà muốn ca sáng báo lại kết quả ticket này cho anh |

## Điều bài không được bịa

- Không viết web-2 chưa lên bản 2.4 "vì" thiếu PAYMENT_KEY như điều đã chắc. Gốc đặt hai câu cạnh nhau nhưng không nói quan
  hệ nhân quả. Bài nối hai câu bằng "và", hay viết "có lẽ vì…", hay hỏi người dùng thì được.
- Không viết ổ còn 71% "nhờ" hay "vì" xoá log như điều đã chắc; gốc chỉ kể hai việc liền nhau.
- Không thêm người nhận, hạn, nguyên nhân lỗi test, cách sửa PAYMENT_KEY.
- Không đổi "đặt lịch deploy lúc 22h" thành "đã deploy xong lúc 22h".

## Bẫy đã cài

| Mã | Ở đâu | Bài tốt làm gì | Lỗi hay gặp |
|---|---|---|---|
| T1 | "Lan nhận cảnh báo… Lan xoá log cũ…" | Gộp bằng trạng ngữ chỉ tình huống ("Nhận cảnh báo… lúc 02:10, Lan xoá…") hay một câu ghép | Giữ hai câu cùng mở bằng "Lan" |
| T2 | web-1 rồi web-2 | "Còn web-2 thì chưa lên…", hay một câu ghép có "còn" | Ba câu liền cùng mở bằng "Máy web-…" |
| T3 | Bản 2.4, nhóm QA | Giữ một chủ đề qua các câu (bị động, "bản này", gộp câu) | Lặp "bản 2.4", "Nhóm QA" ở đầu mỗi câu |
| T4 | Pipeline, bước test | Để phép liên tưởng nối, có thể gộp một câu | Thêm "Ngoài ra", "Bên cạnh đó", "Đồng thời" |
| T5 | "…muốn ca sáng báo lại kết quả cho." | Đổi trật tự để câu không kết bằng "cho" | Giữ nguyên |
| T6 | Thứ tự giờ lộn | Sắp theo giờ, hay chia đoạn theo đề tài với mốc giờ rõ | Để nguyên thứ tự, người đọc tưởng deploy sau 02:25 |
| T7 | web-2 và PAYMENT_KEY | Không thêm "vì" như điều chắc | Viết "web-2 chưa lên vì thiếu PAYMENT_KEY" |
| T8 | Thuật ngữ | Giữ deploy, pipeline, ticket, log như gốc | Dịch thành "triển khai", "đường ống", "phiếu" |
