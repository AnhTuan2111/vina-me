# Thang điểm nhóm word-report: báo cáo sự cố MediBook xuất Word

Tổng 100 điểm, đạt từ 95. Đáp án dữ kiện ở `scenario.md`. Người chấm mở tệp `.docx` (đọc chữ, kiểm tra phông và cấu trúc bằng
cách giải nén `word/document.xml`, `word/styles.xml`, `word/footer*.xml`), xuất PDF bằng Word theo khóa ở `evals/README.md` rồi xem
ảnh từng trang, và đọc lời trả trong chat (`notes.md` của lần chạy). Mỗi điểm trừ ghi kèm câu trích nguyên văn hoặc số
trang PDF. Một lỗi chỉ trừ ở một mục, mục nặng nhất.

## Chặn trần vì bịa

Bịa là đưa vào bài một dữ kiện không có trong bảy tệp nguồn, hoặc đổi nghĩa một dữ kiện có trong nguồn. Danh sách điều
không được bịa ở `scenario.md`. Lời đoán có ghi rõ là đoán và chỉ ra nguồn đoán thì không tính là bịa.

- Bịa một dữ kiện: tổng không quá 80.
- Bịa từ hai dữ kiện trở lên: tổng không quá 70.
- Viết 1.284 (hay 40, 38) thành số người, số khách, số lượt đặt lịch hỏng: tính là bịa.

## 1. Đúng dữ kiện: 30 điểm

| Ý | Điểm | Cách trừ |
|---|---|---|
| Giờ bắt đầu lỗi 08:12 (hoặc 08:12:40) | 4 | ghi 08:10, 08:15, "khoảng 8h15" làm giờ bắt đầu: trừ 4 |
| Giờ hết lỗi 09:47 (hoặc 09:47:05), phân biệt với rollback xong 09:40 và cảnh báo hết 09:52 | 4 | lấy 09:40 hay 09:52 làm giờ hết lỗi: trừ 4; độ dài sai (ví dụ "1,5 giờ" khi viết từ 08:15) trừ thêm 1 |
| Tổng 1.284 phản hồi 5xx, ghi là phản hồi lỗi | 4 | dùng "khoảng 1300": trừ 3; số sai khác: trừ 4; viết 1284 hay 1,284 thay vì 1.284: trừ 1 |
| Hotline: 38 cuộc liên quan, loại 2 cuộc quên mật khẩu (nói hay không nói 35 cộng 3 đều được) | 3 | ghi 40 cuộc là phản ánh lỗi: trừ 3; ghi 35 mà bỏ 3 cuộc gọi sau 09:47 không nói gì: trừ 1 |
| Lý do: commit `a3f9c21` (v3.8.0) đổi `maximum-pool-size` trong `application-prod.yml` từ 50 xuống 5, yêu cầu chờ quá 30 giây thì bị 503 | 5 | thiếu một trong: tên khoá đúng, tệp, 50 xuống 5, gắn với v3.8.0: trừ 1 mỗi thứ; dùng `maxPoolSize` như tên khoá thật: trừ 2; lý do sai: trừ 5 |
| Lời trích đúng từng chữ: thông báo trên app và lỗi HikariCP | 3 | mỗi lời trích sai chữ, thêm bớt chữ, hay dịch ra tiếng Việt mà để trong ngoặc kép: trừ 1,5 |
| Đã xử lý: khởi động lại 2 pod 08:52 chỉ đỡ khoảng 5 phút; tìm ra lý do 09:20; quyết rollback 09:34; rollback xong 09:40 (pipeline #4473) | 3 | thiếu hay sai mỗi mốc: trừ 1, tối đa 3 |
| Ảnh hưởng đi kèm: mất tính năng chọn bác sĩ tới khi có 3.8.1, chưa có lịch | 1 | thiếu: trừ 1 |
| Việc tiếp theo đủ sáu việc ở `scenario.md`, đúng người, đúng hạn; việc chưa có người, chưa có hạn ghi rõ là chưa có | 3 | thiếu một việc: trừ 0,5; sai người hay sai hạn: trừ 1 mỗi chỗ (nếu là tự đặt người, đặt hạn thì tính bịa) |

Mục này không âm.

## 2. Đúng loại việc và cách trả kết quả: 15 điểm

Đối chiếu dòng "Viết mới" và "Tệp Word" trong bảng "Trả kết quả" của SKILL.md, cùng mục báo cáo sự cố của
`references/document-types.md`.

| Ý | Điểm | Cách trừ |
|---|---|---|
| Câu đầu (hay đoạn đầu ngắn) nói việc gì xảy ra, khi nào, ảnh hưởng tới đâu; không mở bằng dựng cảnh, không "Báo cáo này nhằm…" | 3 | câu đầu là lời dẫn chung: trừ 2; mở bằng bối cảnh dự án dài dòng: trừ 3 |
| Thứ tự theo đúng loại: chuyện gì, khi nào, ảnh hưởng, đã làm gì, lý do, việc tiếp theo kèm ai làm | 2 | thiếu một phần: trừ 1; trộn lý do vào mốc thời gian không tách: trừ 1 |
| Không xưng hô, chủ ngữ là hệ thống, việc, người theo vai trò; không đổ lỗi, không mỉa | 3 | có "chúng tôi", "mình", "chúng ta": trừ 1 mỗi kiểu; nêu tên người như người gây lỗi, có "quên", "sơ suất", "thiếu cẩn thận": trừ 2; còn câu mỉa giờ deploy: trừ 2 |
| Dựng bằng `scripts/report-docx.mjs` (bản chép có sửa cũng được), không tự viết một bộ dựng khác bỏ quy ước của skill | 2 | dựng bằng công cụ khác (pandoc, python-docx, Word COM soạn tay): trừ 2 |
| Đã xuất PDF và xem từng trang trước khi đưa, nói ra trong lời trả | 2 | không xuất PDF: trừ 2; xuất mà không nói đã xem gì: trừ 1 |
| Lời trả trong chat: đường dẫn tệp `.docx` (và PDF nếu có), một hai câu về chỗ thiếu dữ kiện hay chưa kiểm tra (số khách, số lượt đặt hỏng, kết quả gọi lại sau 11/11), nói đã làm phông và số trang thế nào | 3 | thiếu đường dẫn: trừ 1; không nêu chỗ thiếu dữ kiện: trừ 1; không nói cách xử lý phông và số trang khi script không có: trừ 1; lời trả dài quá mười dòng, có khen, chấm điểm, ước lượng thời gian: trừ 1 |

Không có đoạn kết chung chung, đoạn "bài học kinh nghiệm" tự nghĩ ra, lời khuyên ngoài nguồn: có thì trừ ở mục 3.

## 3. Độ lưu loát: 25 điểm

Đọc tuần tự từng câu của bài, từ tiêu đề tới hết bảng, chú thích ảnh. Với mỗi câu hỏi: câu này nối vào câu trước bằng gì
(lặp từ khoá, "đó, này, ấy", từ nối đúng quan hệ, mốc thời gian), che câu trước thì câu này còn hiểu được không. Không quét
cả bài một lúc rồi cho điểm chung.

| Lỗi | Trừ mỗi lần |
|---|---|
| Hai câu liền nhau rời nhau, câu sau không dựa gì vào câu trước | 1 |
| Ý nhân quả, điều kiện bị chặt thành câu cụt thay vì một câu "vì… nên", "nếu… thì" | 1 |
| Văn máy theo `references/machine-tells.md`: "đóng vai trò", "không chỉ… mà còn", "không phải X mà là Y" khi chưa ai nói X, bộ ba cho đủ vần, "Hãy…", "hành trình", "chúng ta", "việc triển khai được thực hiện" | 1,5 |
| Văn mẫu báo cáo: "Báo cáo này nhằm…", "Nhìn chung", "Có thể thấy", "Qua sự cố này…", "đảm bảo tính ổn định của hệ thống" | 1,5 |
| Liệt kê "một là, hai là", "thứ nhất, thứ hai" cho đủ, hay gạch đầu dòng chia nhỏ một chuỗi nhân quả lẽ ra viết liền | 1,5 |
| Câu chốt cuối đoạn nhắc lại điều đoạn vừa nói, câu châm ngôn, "Tóm lại" | 1,5 |
| Chữ nhấn thừa: "thực sự", "chính là", "hoàn toàn", "đúng", "rất nghiêm trọng", "nhanh chóng" không có số đi kèm | 0,5 |
| Danh từ trừu tượng làm chủ ngữ ("Việc rollback đã được thực hiện", "Cơ chế pool…"), câu bị động kiểu dịch | 0,5 |
| Một thứ hai tên (pool, connection pool, nhóm kết nối lẫn lộn; v3.7.2 lúc gọi "bản cũ" lúc gọi "bản ổn định"), thuật ngữ (pool, 5xx, rollback, pod) không giải nghĩa ở lần đầu khi người đọc là ban giám đốc | 0,5 |
| Đoạn quá một thuật ngữ mới chưa giải nghĩa | 1 |

Mục này không âm. Một bài trung bình còn khoảng 15 tới 18 điểm ở mục này.

## 4. Luật của `references/docx-export.md`: 10 điểm

| Ý | Điểm | Cách trừ |
|---|---|---|
| Phông Times New Roman cho cả thân bài, đề mục, bảng, chú thích, tiêu đề (người dùng yêu cầu); mã, tên tệp, lệnh để phông đều | 3 | còn Arial ở một kiểu chữ (tiêu đề, đề mục, bảng, chú thích): trừ 1 mỗi kiểu, tối đa 3; mã không để phông đều: trừ 1 |
| Tối đa hai cấp đề mục; nhãn đậm đầu đoạn chỉ cho bộ nhãn cố định lặp lại | 1 | ba cấp trở lên hay in đậm nhãn ở đoạn thường: trừ 1 |
| Gạch đầu dòng bằng danh sách của Word, không gõ ký tự chấm tròn, gạch nối vào chữ; dòng mới là đoạn mới (trừ trong ô bảng) | 2 | mỗi kiểu sai: trừ 1 |
| Ảnh: rộng không quá bề ngang chữ, có alt, chú thích ngay dưới, nghiêng, nhỏ hơn thân bài, giữ cùng trang với ảnh; chú thích nói ảnh chứng minh điều gì, thân bài có câu trỏ tới ảnh | 3 | thiếu mỗi thứ: trừ 0,5, tối đa 3 |
| Không dấu gạch dài, gạch vừa ở bất cứ đâu trong tệp (cả bảng, chú thích, tiêu đề); không mũi tên, emoji, `~`, `&`, `=` trong câu văn | 1 | có một chỗ: trừ 1 (và trừ thêm ở mục 6 nếu nhiều) |

## 5. Hình thức trang, xem ảnh trang PDF: 15 điểm

| Ý | Điểm | Cách trừ |
|---|---|---|
| Có số trang ở chân trang, mọi trang | 4 | không có: trừ 4; có ở đầu trang chứ không ở chân, hay thiếu ở một số trang: trừ 2 |
| Ảnh chụp điện thoại nằm gọn trong một trang, đã cắt phần không nói tới hoặc thu nhỏ cho chữ trong hộp thoại vẫn đọc được | 4 | ảnh bị cắt mất phần dưới, tràn lề hay đẩy sang một trang riêng chỉ có ảnh: trừ 4; vừa trang nhưng chữ hộp thoại khó đọc (nhỏ hơn cỡ chữ thân bài khi in): trừ 2 |
| Biểu đồ đọc được: nhãn trục, hai vạch deploy và rollback thấy được ở khổ A4 | 2 | chữ trong biểu đồ không đọc được: trừ 2 |
| Chú thích ảnh cùng trang với ảnh; không đề mục mồ côi cuối trang; không trang trống hay trang gần trống giữa bài | 3 | mỗi chỗ: trừ 1 |
| Bảng (mốc thời gian, việc tiếp theo) không tràn lề, cột không bị bóp tới mức mỗi dòng một hai chữ, hàng tiêu đề lặp khi bảng sang trang | 2 | mỗi chỗ: trừ 1 |

Không xuất được PDF để chấm (tệp hỏng, Word không mở): mục 5 được 0 và mục 4 được tối đa 5.

## 6. Dấu, ký hiệu, giọng trang trọng: 5 điểm

| Ý | Cách trừ |
|---|---|
| Dấu gạch dài, gạch vừa từ chỗ thứ hai trở đi (chỗ đầu đã trừ ở mục 4) | trừ 1 mỗi chỗ |
| Chữ in hoa cả từ để nhấn, mũi tên, tick, emoji trong văn | trừ 1 mỗi kiểu |
| Cách viết giờ, ngày, số không thống nhất (08:12 lẫn 8h12; 10/11 lẫn 10-11-2026) | trừ 1 |
| Lời cảm tính, giọng chat lọt vào báo cáo ("toang", "chắc tầm", "y như cũ") | trừ 1 mỗi chỗ |

Mục này không âm.

## Cách cộng

Cộng sáu mục, rồi áp trần vì bịa nếu có. Ghi ở `grade.md`: điểm từng mục, mỗi điểm trừ kèm câu trích hoặc số trang, tổng,
và đạt hay chưa đạt (ngưỡng 95). Một bài làm đúng dữ kiện nhưng văn còn vài chỗ rời, phông còn Arial ở đề mục, chưa có số
trang thường được khoảng 80.
