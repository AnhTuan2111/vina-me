# Thang chấm nhóm teaching: bài giảng về cổng

Tổng 100 điểm, đạt từ 95. Chấm `runs/rN/output.md` (bài giảng) và `runs/rN/chat.md` (lời trả lời trong chat). Mỗi điểm
trừ phải trích nguyên văn câu trong bài làm. Đối chiếu dữ kiện với `scenario.md` và `inputs/`. Mỗi mục trừ tới 0 là hết,
không âm; một lỗi chỉ trừ ở một mục, mục ghi cụ thể nhất.

Bài làm là tệp Markdown, không xuất Word, nên không chấm hình thức trang PDF; trình bày Markdown chấm ở mục I.

## Mức trần (áp sau khi cộng các mục)

- Bịa một dữ kiện (output trình bày như thật mà không có trong `inputs/`, con số, ngày, chỗ hiểu sai, trải nghiệm ngôi thứ
  nhất của người viết): tổng không quá 80. Bịa từ ba dữ kiện trở lên: tổng không quá 65.
- Để lộ từ hai loại thông tin riêng trở lên (tên máy, tên người dùng máy, họ tên thực tập sinh, đường dẫn hay tên gói có
  tên công ty): tổng không quá 85.
- Thiếu hẳn phần thực hành hoặc thiếu hẳn câu hỏi kiểm tra: tổng không quá 70.
- Có câu hẹn bài sau (firewall, Docker, `kill -9`, "bài sau", "sẽ học"): tổng không quá 90.

## A. Đúng dữ kiện, không bịa (18 điểm)

| Kiểm | Trừ |
|---|---|
| Thông báo lỗi Spring Boot trích đúng nguyên văn | sai chữ hay viết lại: -3 |
| Lý do vụ việc đúng: bản chạy từ tab 1 lúc 13:41 vẫn giữ cổng 8080, không phải code sai | sai hay mơ hồ: -4 |
| Dòng `ss`, PID 4821, process `java`, output `ps aux` (cột `pts/1`, giờ 13:41) khớp tệp vào | mỗi chỗ sai: -2 |
| Output curl "Connection refused" và `{"status":"UP"}` đúng thứ tự xảy ra | sai thứ tự hay sai chữ: -2 |
| Ngày và nơi chạy ghi đủ (05/11/2026, WSL2 Ubuntu 22.04) | thiếu: -2 |
| Output chưa chạy (đổi `server.port`, `lsof` sau khi cài, `kill -9`, `ss` lúc trống ngoài dòng có trong tệp) ghi là kỳ vọng | mỗi chỗ trình bày như thật: -4, và áp trần bịa |
| Con số đúng: "gần 20 phút", 3 tab, 8080, 5432 | mỗi số sai: -2 |
| Mức chắc chắn đúng: không nói postgres đang chạy trên máy Minh | nói như đã kiểm: -2 |
| Sửa output ngoài phần che thông tin riêng (đổi PID, bỏ dòng, sửa chữ) | mỗi chỗ: -2 |

## B. Thông tin riêng (8 điểm)

| Kiểm | Trừ |
|---|---|
| Không còn `abc-dev-02`, `minhtq`, `abc-erp`, `com.abc.erp`, "laptop công ty", họ tên "Trần Quang Minh" | mỗi loại còn sót: -3 (tối đa -8), từ hai loại áp trần 85 |
| Có câu nói đã che tên máy, đường dẫn trong output (trong bài hoặc trong chat) | không nói: -2 |
| Che mà làm hỏng output (che luôn PID, cổng, chữ lỗi) | -2 |

Gọi "bạn Minh" hay "một bạn trong nhóm" thì được; họ tên đủ thì trừ.

## C. Người đọc chỉ biết những gì đã dạy (12 điểm)

Người đọc chỉ biết Java, Spring Boot và Bài 1-3 trong `syllabus.md`.

| Kiểm | Trừ |
|---|---|
| Cổng (port) giải nghĩa bằng lời thường trước khi dùng như thuật ngữ, câu định nghĩa có "là" | thiếu hay định nghĩa kiểu "Port: ..." trong câu văn: -3 |
| Mỗi thứ chưa dạy mà bài dùng (`LISTEN`, cờ `-t`, `-n`, `-p`, dấu `*`, `curl`, `localhost`, TCP, IP) được giải nghĩa tại chỗ hoặc tránh hẳn | mỗi thứ dùng mà không giải nghĩa: -2 (tối đa -8) |
| Một đoạn tối đa một thuật ngữ mới | mỗi đoạn có từ hai thuật ngữ mới: -2 |
| Không nhắc bài sau: không "Bài 5", "bài 6", "sẽ học", "để sau", "lúc khác", "firewall sẽ...", "Docker sẽ..." | mỗi câu: -5, áp trần 90 |
| Gọi lại bài trước đúng tên đã dùng (process, PID, `kill`, pipe, `grep`) | đổi tên hay giảng lại từ đầu như chưa học: -1 mỗi chỗ |

## D. Cấu trúc bài giảng (9 điểm)

| Kiểm | Trừ |
|---|---|
| Mở bằng vụ lỗi cụ thể (bản thứ hai không lên, thông báo lỗi), không mở bằng "Port là...", "Trong lập trình web...", dựng cảnh | sai: -3 |
| Có một câu hỏi của bài, rõ ràng, và bài trả lời trọn | thiếu câu hỏi hay không trả lời trọn: -3 |
| Không lộ khung xương: "Câu hỏi con 1", "Phần này trả lời câu hỏi thứ hai", đánh số khái niệm rồi gọi lại bằng số | mỗi chỗ: -2 |
| Các phần mở mỗi phần một kiểu; không phần nào cũng có khối chốt | cùng khuôn: -2 |
| Mỗi mục phục vụ câu hỏi của bài; không lan sang firewall, Docker, mạng nhiều máy, signal | mỗi mục lạc đề: -3 |
| Kết bằng câu trả lời trọn hay kết quả cuối; câu hỏi còn mở (nếu có) không hẹn chỗ trả lời; không "Tóm lại", câu châm ngôn, lời kêu gọi | sai: -2 |
| Độ dài phần bài giảng (không tính khối code, output, đáp án) trong 1300-2300 chữ | ngoài khoảng: -2 |

## E. Thực hành (14 điểm)

| Kiểm | Trừ |
|---|---|
| Lệnh chạy được trên WSL Ubuntu 22.04 mặc định: dùng `ss`; `lsof` chỉ khi có bước `sudo apt install lsof`; không `netstat -ano` hay lệnh Windows | mỗi lệnh sai môi trường: -3 |
| Giải thích trước, lệnh sau; không dàn lệnh thành danh sách trơn | danh sách lệnh không lời: -2 |
| Mỗi lệnh, cờ lạ được giải nghĩa ngay chỗ gõ | mỗi lệnh lạ không giải nghĩa: -1 (tính chung với C nếu là cùng một chữ thì chỉ trừ một lần) |
| Có bước cố tình gây lỗi (chạy bản thứ hai khi bản đầu còn chạy) rồi tự sửa | thiếu: -4 |
| Output thật ghi ngày, nơi chạy; output chưa chạy ghi kỳ vọng | thiếu ghi: -2 (trùng A thì chỉ trừ ở A) |
| Bảng tra triệu chứng ra lý do, mỗi dòng nói ai viết ra thông báo (Spring Boot, curl, bash hay Ubuntu khi thiếu lệnh) | thiếu bảng: -3; có bảng mà thiếu cột hay câu "ai viết ra": -2; gán sai người viết: -1 mỗi dòng |
| Có cách xử lý thứ hai bằng `server.port` trong `application.properties`, nói khi nào chọn cách nào | thiếu: -2 |

## F. Câu hỏi kiểm tra (12 điểm)

| Kiểm | Trừ |
|---|---|
| Đúng 4 câu, đáp án để riêng ở cuối bài | sai số câu: -2; đáp án xen giữa câu hỏi: -2 |
| Mỗi câu bắt suy luận từ tình huống, không hỏi nhắc lại định nghĩa, không "bạn hiểu chưa" | mỗi câu chỉ nhắc lại: -2 |
| Đáp án đúng sai rõ, một đáp án chấm được | mỗi câu mơ hồ hay nhiều đáp án đều đúng: -2 |
| Mọi khái niệm trong đáp án đã dạy ở Bài 1-3 hoặc trong chính bài này (người chấm liệt kê khái niệm của từng đáp án và đối chiếu) | mỗi câu dùng thứ chưa dạy (firewall, Docker, `kill -9`, signal, IP, `0.0.0.0`, TCP chưa giải nghĩa): -4 |
| Đáp án đúng về kỹ thuật | mỗi đáp án sai: -4 |

## G. Chỗ hay hiểu sai (6 điểm)

| Kiểm | Trừ |
|---|---|
| Dùng chỗ hiểu sai có thật trong ghi chú: tưởng code sai, tưởng đã tắt tab, tưởng 8080 là cổng riêng của Java | không dùng cái nào: -2 |
| Mỗi chỗ nói vì sao nghe hợp lý trước, rồi mới nói sai ở đâu | mỗi chỗ chỉ phán sai: -1 |
| Không đặt cột hay câu "Mình từng nghĩ" (chỗ hiểu sai là của Minh, người viết là người kèm) | có: -3, và áp trần bịa |
| Không chép nguyên dòng hiểu sai của Bài 3 | chép: -3 |

## H. Độ lưu loát và dẫn dắt (15 điểm)

Đọc tuần tự từng câu từ đầu tới cuối như một người học thật, không quét cả bài. Với mỗi câu, che câu trước rồi hỏi câu này
có đứng một mình mà không thiếu gì không; đứng được thì hai câu đang rời nhau. Tới cuối mỗi mục, hỏi mục vừa đọc có để lại
một câu hỏi khiến mình muốn đọc mục sau không. Ghi lại từng chỗ trừ kèm câu trích. Đối chiếu với `references/storytelling.md`.

| Kiểm | Trừ |
|---|---|
| Dẫn dắt: chuyển mục bằng câu báo lộ trình ("Tiếp theo…", "Phần này…") thay vì bằng chỗ hở của câu trả lời trước; tên gọi đặt trước khi tả vật quen; so sánh không nói chỗ hết đúng; ẩn dụ chen vào mà không nói cái gì ứng với cái gì; vụ mở bài không quay lại ở mục sau hay thực hành | -1 mỗi chỗ, tối đa -4 |
| Câu rời câu trước (không lặp từ khoá, không "này, ấy, đó", không từ nối đúng quan hệ, không mốc thời gian) | -1 mỗi chỗ, tối đa -5 |
| Văn máy, văn mẫu: "Hãy", "chúng ta", "đóng vai trò", "hành trình", "không chỉ... mà còn", "không phải X mà là Y" khi chưa ai nói X, bộ ba cho đủ vần, mở bằng dựng cảnh, "Trong thế giới...", câu hỏi tu từ, hỏi dồn | -1 mỗi chỗ, tối đa -5 |
| Liệt kê "một là, hai là", "Trước hết, Bên cạnh đó, Ngoài ra, Cuối cùng" cho đủ | -1 mỗi chỗ |
| Câu chốt cuối đoạn ("Điều này giúp...", "Nhớ gọn:", "Nói ngắn gọn:", câu tóm lặp ý vừa nói) | -1 mỗi chỗ |
| Chữ nhấn thừa ("chính là", "thật sự", "đúng là", "cực kỳ", "hoàn toàn") | -1 mỗi chỗ, tối đa -3 |
| Ý nhân quả, điều kiện bị chặt thành câu cụt; nhịp đều tăm tắp, đoạn nào cũng dài bằng nhau | -1 mỗi chỗ, tối đa -3 |
| Một thứ hai tên (cổng và port lẫn lộn không giải thích, process và tiến trình) | -1 mỗi cặp |

Mục H trừ tối đa 15.

## I. Giọng, dấu, trình bày (3 điểm)

| Kiểm | Trừ |
|---|---|
| Xưng "mình, bạn", không "chúng ta", không "các em" | sai: -1 |
| Không dấu gạch dài, gạch vừa ở bất cứ đâu (tìm hai ký tự đó trong tệp) | mỗi chỗ: -1, tối đa -3 |
| Câu văn không mũi tên, emoji, dấu tick, `~`, `&`, `=` (trong khối code, output thì được); không in hoa cả chữ để nhấn | mỗi chỗ: -1 |
| In đậm chỉ ở thuật ngữ lần đầu; không mở mọi gạch đầu dòng bằng nhãn in đậm | rải khắp: -1 |

## J. Đúng loại việc và cách trả kết quả (3 điểm)

Việc là viết mới, bảng "Trả kết quả" của SKILL.md ghi: văn bản, thêm một hai câu về chỗ chưa kiểm hay thiếu dữ kiện.

| Kiểm | Trừ |
|---|---|
| Ghi ra đúng tệp `lesson-04-port.md` | sai tên hay không ghi tệp: -2 |
| Chat chỉ một hai câu (tối đa khoảng năm dòng) về chỗ chưa kiểm, thiếu dữ kiện, đã che gì; không chép lại bài | dài, chép bài: -2 |
| Chat không khen, không chấm điểm, không ước lượng thời gian, không lộ trình; nói đã kiểm gì bằng cách nào (ví dụ đã chạy `node scripts/lint.mjs`) | mỗi lỗi: -1 |

## Mốc hiệu chỉnh

Một bài trung bình thường: đủ phần, trích output đúng, nhưng còn sót một hai thứ chưa dạy (`-t`, `LISTEN`, `curl`), bảng triệu
chứng không nói ai viết thông báo, ba bốn câu rời và vài câu chốt cuối đoạn, chat hơi dài. Bài đó mất khoảng 4 ở C, 2 ở E,
5-6 ở H, 2 ở J, 2-4 rải ở các mục khác, ra khoảng 80. Bài chỉ cần quên che tên máy và tên người dùng là đã chạm trần 85.
