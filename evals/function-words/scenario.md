# Đề nhóm function-words: sửa đoạn hướng dẫn dịch sát tiếng Anh

Lời yêu cầu nằm ở `prompt.md` (dán nguyên vào phiên làm bài). Không có tệp vào. Dữ kiện đều là giả: công cụ db-snap, các con
số và mốc giờ không gắn với sản phẩm thật nào.

## Đề thử điều gì của skill

Đề thử `references/function-words.md`: văn dịch sát tiếng Anh thừa hư từ ("đã được", "sẽ được", "các", "việc… của", "có
thể", "chúng"), và những chỗ hư từ phải giữ vì bỏ đi thì nghĩa đổi. Bài làm đạt phải làm được cả hai chiều: bỏ chỗ thừa, giữ
chỗ cần. Bài chỉ xoá hàng loạt "được", "các", "có thể" sẽ rơi vào bẫy ở mục Bẫy đã cài.

Ngoài ra thử cách trả kết quả "Sửa đoạn được dán vào" của SKILL.md (bản đã sửa, rồi tối đa năm dòng nêu thay đổi chính và lý
do), giọng trung tính của tài liệu kỹ thuật, và luật hỏi lại chỗ gốc đọc được hai cách (`common-errors.md`).

## Đáp án dữ kiện

| Mã | Dữ kiện |
|---|---|
| D1 | db-snap tạo bản sao lưu cho database PostgreSQL |
| D2 | Cài bằng lệnh `npm install -g db-snap` |
| D3 | Lệnh `db-snap init` tạo tệp cấu hình mặc định |
| D4 | Xem danh sách bản sao lưu bằng lệnh `db-snap list` |
| D5 | Trên máy chủ production, sao lưu chạy lúc 02:00 hằng ngày |
| D6 | Mỗi lần sao lưu mất khoảng 40 phút cho database 120 GB ("khoảng" giữ lại) |
| D7 | Bản sao lưu giữ 14 ngày, sau đó tự xoá |
| D8 | Nhập sai mật khẩu năm lần thì tài khoản bị khoá 30 phút |
| D9 | Khôi phục bằng lệnh `db-snap restore --at <thời điểm>` |
| D10 | Với database lớn, lệnh khôi phục có thể mất 2 giờ ("có thể" chỉ khả năng, giữ lại) |
| D11 | Bản 1.4.2 đã sửa lỗi ghi đè tệp cấu hình; trên máy staging gốc ghi "không kiểm tra lại" |
| D12 | Ổ đĩa sao lưu có thể đầy trong tuần này, dung lượng còn 8% |
| D13 | Giấy phép bản Enterprise được thuê từ tháng 01/2027 |

## Hư từ thừa, bỏ hay viết lại là đúng

| Mã | Gốc | Vì sao thừa |
|---|---|---|
| H1 | "được sử dụng để tạo" | bị động dịch từ "is used"; "dùng để tạo", hoặc "tạo" |
| H2 | "các bản sao lưu của các database" | "các" dịch đuôi "-s"; "của" nối chuỗi danh từ |
| H3 | "Việc cài đặt của công cụ này sẽ được thực hiện bằng lệnh" | danh hoá động từ, mượn "được thực hiện" làm vị ngữ; "sẽ" dịch "will" |
| H4 | "Đối với lệnh `db-snap init` thì sẽ tạo" | thừa quan hệ từ, câu mất chủ ngữ; "sẽ" thừa |
| H5 | "Bạn có thể xem" | "can" dịch sát; viết thẳng việc cần làm |
| H6 | "đã được lên lịch để chạy" | "đã được" dịch "has been scheduled"; mốc giờ đủ rõ |
| H7 | "Các bản sao lưu sẽ được lưu giữ…, sau đó chúng sẽ được xoá một cách tự động" | "các", "sẽ được" hai lần, "chúng" dịch "they", "một cách" thừa |
| H8 | "tài khoản được khoá" | việc thiệt cho chủ ngữ phải dùng "bị" |
| H9 | "nhé" | tình thái từ trong tài liệu trung tính |
| H10 | "các người dùng" | "các" trước danh từ nói chung |
| H11 | "những 2 giờ" | trợ từ "những" cài đánh giá "lâu" vào con số |

## Hư từ phải giữ

| Mã | Gốc | Vì sao giữ |
|---|---|---|
| G1 | "Giấy phép… được thuê từ tháng 01/2027" | bỏ "được" thì đọc như giấy phép đi thuê |
| G2 | "Ổ đĩa sao lưu có thể đầy" | "có thể" chỉ việc chưa chắc xảy ra, không phải chữ dịch thừa |
| G3 | "Lệnh này có thể mất… 2 giờ" | như G2; bỏ thì thành lần nào cũng mất 2 giờ |
| G4 | "đã sửa lỗi ghi đè… ở bản 1.4.2" | "đã" tách việc xong khỏi việc chưa làm ở vế sau |
| G5 | "Việc sao lưu chạy lúc 02:00 mất khoảng 40 phút" | "việc" gọi tên tác vụ có thật; viết "Bản sao lưu chạy…" là sai vì bản sao lưu là tệp. Gộp với câu trước hay viết "Mỗi lần sao lưu mất…" cũng đạt |

## Chỗ đọc được hai cách

"không kiểm tra lại trên máy staging" (D11): gốc có thể muốn nói chưa kiểm tra (sẽ kiểm tra), hoặc quyết không kiểm tra.
`function-words.md` dạy "chưa" và "không" khác nhau, nhưng người sửa không biết tác giả muốn nói gì. Bài tốt giữ chữ "không"
và hỏi một câu tự đứng được, hoặc đổi thành "chưa" và nêu rõ trong danh sách thay đổi kèm câu hỏi xác nhận. Lặng lẽ đổi thành
"chưa" là tự quyết thay tác giả.

## Điều bài không được bịa

- Không thêm lệnh, option, đường dẫn mà gốc không có (ví dụ chỗ lưu bản sao lưu, lịch cron, cách mở khoá tài khoản).
- Không thêm lý do vì sao ổ sắp đầy hay cách xử lý ổ đầy.
- Không đổi con số, mốc giờ, phiên bản, tháng thuê giấy phép.
- Không đổi lệnh trong backtick, kể cả `<thời điểm>`.

Thêm thứ tự trước sau giữa các lệnh mà gốc không nói (gốc không nói `db-snap init` chạy ngay sau khi cài) là lỗi nhẹ, trừ ở
mục A của `rubric.md`, không tính là bịa dữ kiện nên không kéo trần.

"Các" trong "các tệp cấu hình mặc định" trỏ toàn bộ một tập đã xác định (`function-words.md`, bảng lượng từ), nên giữ hay bỏ
đều được.
