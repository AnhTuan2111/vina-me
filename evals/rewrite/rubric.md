# Thang chấm nhóm rewrite

Thang 100 điểm, đạt từ 95. Đáp án dữ kiện (mã D1 tới D17) và danh sách bẫy ở `scenario.md`. Đề không có tệp Word nên
không chấm hình thức trang.

## Cách chấm

1. Đọc `scenario.md` trước, rồi mới đọc bài.
2. Dò dữ kiện: đi từng mã D1 tới D17, tìm câu tương ứng trong bài, ghi "có, đúng", "thiếu", "đổi" kèm câu trích.
3. Đọc độ lưu loát tuần tự: đánh số từng câu của bản sửa (S1, S2…), đọc từng câu, che câu trước đi rồi hỏi câu này có nối
   và dựa trên câu trước không (lặp từ khoá, "này, ấy, đó", từ nối đúng quan hệ, mốc thời gian). Không quét cả bài rồi
   chấm theo cảm giác. Ghi mọi chỗ đứt kèm số câu.
4. Tìm ký tự U+2013 và U+2014 trong toàn bộ câu trả lời (cả bản sửa lẫn danh sách thay đổi).
5. Mọi điểm trừ phải có câu trích nguyên văn. Một lỗi chỉ trừ ở một mục, mục nặng nhất. Mỗi mục không trừ quá điểm tối đa
   của mục đó.

## Trần điểm

Trần áp sau khi cộng, lấy trần thấp nhất:

| Lỗi | Tổng không quá |
|---|---|
| Bịa một dữ kiện (xem danh sách "Điều bài không được bịa" ở `scenario.md`) | 80 |
| Bịa từ hai dữ kiện | 70 |
| Viết nguyên nhân thành điều đã chắc ở bất cứ câu nào | 85 |
| Còn ký tự gạch dài hay gạch vừa ở bất cứ đâu trong câu trả lời | 90 |
| Không trả bản sửa (chỉ hỏi lại, hoặc chỉ soát) | 30 |

## A. Đúng dữ kiện và mức chắc chắn: 30 điểm

| Lỗi | Trừ |
|---|---|
| Thiếu một dữ kiện trong D1 tới D17 | 4 mỗi dữ kiện |
| Đổi giá trị một dữ kiện (số, giờ, phiên bản, tên, "quá 10" thành "từ 10", 50 và 20 đảo chỗ) | 5 mỗi chỗ |
| Bỏ chữ "khoảng" của 18%, 4.2s hay 1.200 request/phút | 2 mỗi chỗ |
| Bỏ "theo đánh giá sơ bộ" hoặc nói ảnh hưởng doanh thu chắc hơn gốc | 3 |
| Viết một trong ba việc tiếp theo như đã làm xong | 5 |
| Lặng lẽ chọn 14:41 hoặc 14:44, không nêu chỗ vênh | 6 |
| Giữ cả hai giờ nhưng không nêu chỗ vênh với người dùng | 3 |
| Sửa lệnh `kubectl` hay `maximumPoolSize` (đổi ký tự, bỏ backtick, dịch) | 5 |
| Đổi chữ trong lời khách (ngoài việc đổi gạch dài thành gạch nối) | 5 |
| Lời giải nghĩa liveness probe bị bỏ hay sai nghĩa | 4 (tính vào D5, không cộng dồn) |

## B. Đúng loại việc và cách trả kết quả: 12 điểm

Loại việc là "Sửa đoạn được dán vào" ở bảng "Trả kết quả" của SKILL.md: trả bản đã sửa ngay trong chat, rồi tối đa năm
dòng nêu thay đổi chính và lý do. Câu hỏi về chỗ vênh được thêm một dòng ở cuối.

| Lỗi | Trừ |
|---|---|
| Danh sách thay đổi quá năm dòng | 3 |
| Danh sách thay đổi không nêu lý do, chỉ kể "đã sửa A, B, C" | 3 |
| Không có danh sách thay đổi | 5 |
| Có lời mở hay lời kết thừa ("Dưới đây là bản đã sửa", "Hy vọng giúp được"), khen bài gốc, bảng chấm điểm | 2 mỗi loại |
| Câu hỏi về giờ rollback không tự đứng được (không nói câu nào ghi giờ nào, không nêu cách hiểu có thể) | 3 |
| Hỏi người dùng quá một câu, hoặc hỏi điều đọc gốc là biết | 2 |
| Ghi bản sửa ra tệp thay vì trả trong chat khi không được nhờ | 3 |
| Giọng không trung tính: xưng "mình, bạn, chúng tôi", hay giọng bài giảng, hỏi rồi đáp | 4 |
| Bỏ khung đoạn văn của gốc để chuyển cả bài thành bảng hay toàn gạch đầu dòng | 4 |

## C. Độ lưu loát, đọc tuần tự từng câu: 30 điểm

Chấm theo bảng số câu đã ghi ở bước 3. Văn máy cụ thể chấm ở mục D, ở đây chấm mạch câu.

| Lỗi | Trừ |
|---|---|
| Một chỗ câu sau rời câu trước (che câu trước thì câu sau vẫn đứng một mình, hoặc không có gì nối) | 3 mỗi chỗ |
| Từ nối sai quan hệ ("Tuy nhiên" khi không có đối lập, "Đồng thời" nối hai việc khác thời điểm) | 3 mỗi chỗ |
| Đại từ trỏ không rõ ("nó", "điều này" có hai danh từ để trỏ về) | 2 mỗi chỗ |
| Câu đầu không nói ngay đang bàn gì (sự cố nào, ngày nào), hoặc câu hai không phải một thứ cụ thể | 4 |
| Thứ tự lộn: đoạn không giữ một trình tự (thời gian hoặc nhân quả), việc sau kể trước việc trước mà không có lý do | 4 |
| Ý nhân quả bị chặt thành câu cụt rời nhau (ví dụ "CPU database ở mức 35%. Team loại giả thuyết quá tải.") | 3 mỗi chỗ |
| Ba câu liền trở lên cùng một khuôn, cùng độ dài, cùng mở bằng giờ hay cùng chủ ngữ | 3 mỗi chuỗi |
| Câu dài mà khớp nối rối, phải đọc hai lần mới hiểu | 3 mỗi câu |
| Lời khách đặt chen giữa hai mốc giờ làm đứt mạch kể mà không có câu dẫn | 2 |
| Viết lại câu 14:20 (câu đã ổn) thành câu kém hơn | 2 |

## D. Hết văn máy, văn mẫu: 18 điểm

Mỗi dấu hiệu dưới đây còn sót từ gốc, hay mới xuất hiện trong bản sửa, trừ theo bảng. Dấu hiệu mới do bài tự thêm trừ gấp
đôi, vì sửa văn mà sinh văn máy mới là lỗi nặng hơn sót.

| Dấu hiệu | Trừ |
|---|---|
| Câu mở dựng bối cảnh chung ("Trong bối cảnh…", "Trong thời đại…") | 3 |
| "không chỉ… mà còn…", "bài học quý giá", "đáng báo động", "tăng vọt" dùng làm chữ nhấn | 2 mỗi cụm |
| Câu hỏi tu từ ("Phải chăng…?") | 3 |
| Câu chốt cuối đoạn ("Điều này cho thấy…", "Điều này giúp…", "Qua đó…") | 3 mỗi câu |
| Câu kết kiểu "Tóm lại", "Nhìn chung", lời khuyên, châm ngôn, lời kêu gọi | 3 |
| Bộ ba cho đủ vần, liệt kê "một là, hai là" cho đủ, dãy từ gần nghĩa | 2 mỗi chỗ |
| "tiến hành", "thông qua việc", "thực hiện việc", "một cách + tính từ", "đóng vai trò", "mang tính" | 1 mỗi chỗ |
| "Đồng thời", "Bên cạnh đó", "Ngoài ra" mở câu mà không có quan hệ thật | 1 mỗi chỗ |
| "chúng ta" | 2 mỗi chỗ |
| "Hãy…" | 2 |
| Chữ nhấn thừa ("chính là", "thật sự", "đúng là", "rất", "hoàn toàn") không thêm nghĩa | 1 mỗi chỗ |
| In hoa cả chữ để nhấn ("KHÔNG") | 2 |
| In đậm rải trong đoạn, nhãn in đậm đầu mỗi gạch đầu dòng | 2 |
| Ký hiệu trong câu văn: `->`, mũi tên, `~`, `>`, `&`, `=`, `vs` | 1 mỗi chỗ |
| Dấu hai chấm làm khung định nghĩa ("Liveness probe: …") | 2 |

## E. Luật riêng của mảng sửa văn: 10 điểm

Luật ở `machine-tells.md`, `common-errors.md`, `word-choice.md`, `punctuation.md`.

| Lỗi | Trừ |
|---|---|
| Còn từ hai tên trở lên cho connection pool (connection pool, pool kết nối, bể kết nối), hoặc một tên mà lúc viết hoa lúc viết thường | 4 |
| "Pod" và "pod" lẫn nhau, hoặc tên tiếng Anh viết hoa giữa câu khi không phải tên riêng | 1 |
| Còn "thiếu xót" | 2 |
| Còn câu thiếu chủ ngữ "Với bản 3.8.0… đã thay đổi…" | 2 |
| Xoá ý bác bỏ giả thuyết database quá tải (đó là bác bỏ hợp lệ vì ý bị bác đã được nói) | 3 |
| Thay từ đồng nghĩa mà không sửa cấu trúc câu ở chỗ cấu trúc là lỗi (ví dụ đổi "tiến hành rollback thông qua việc chạy lệnh" thành "thực hiện rollback bằng việc chạy lệnh") | 2 |
| Đổi thuật ngữ kỹ thuật sang lời thường làm mất nghĩa (bỏ "p95", đổi "liveness probe" thành "kiểm tra sức khoẻ" mà không giữ tên) | 2 |
| Dùng "cạn" cho tài nguyên | 1 |

## Thang tham chiếu

| Tổng | Bài trông thế nào |
|---|---|
| 95-100 | Đủ D1 tới D17 đúng mức chắc chắn, nêu chỗ vênh giờ rollback, không gạch dài, mạch câu liền, không văn máy cũ hay mới, đúng cách trả kết quả |
| khoảng 80 | Bỏ hết lời độn và ký hiệu, nhưng lặng lẽ chọn một giờ rollback hoặc không nêu chỗ vênh, còn hai tên cho pool, vài chỗ câu rời hay chặt cụt, danh sách thay đổi dài hơn năm dòng |
| dưới 70 | Bịa con số hay người nhận việc, nói chắc nguyên nhân, còn gạch dài, hoặc chỉ thay từ đồng nghĩa |

Ghi `grade.md`: điểm từng mục, mọi điểm trừ kèm câu trích, bảng dò D1 tới D17, bảng số câu S1, S2… với chỗ đứt, trần đã áp,
tổng, đạt hay chưa.
