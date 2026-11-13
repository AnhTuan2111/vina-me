# Thang chấm nhóm explain: ghi chú OOMKilled

Tổng 100 điểm, đạt từ 95. Mọi điểm trừ phải trích nguyên văn câu trong bài làm. Đáp án dữ kiện và bẫy ở `scenario.md`.
Bài làm gồm tệp ghi chú (`output.md`) và lời trả trong chat (chép vào `notes.md` của người làm hoặc phần đầu, cuối
`output.*`). Phần "văn" để đếm chữ và soát là phần ghi chú, trừ khối code.

## Mức trần (áp sau khi cộng điểm)

- Một dữ kiện bịa (danh sách ở `scenario.md`, mục "Điều bài không được bịa") hoặc một lỗi kỹ thuật ở lý do chính (ví dụ
  bị kill vì request 512Mi, vì CPU, vì liveness probe, vì GC; 137 là "hết heap"; `-Xmx` chặn cả bộ nhớ của process): tổng
  không quá 80.
- Hai chỗ như thế trở lên: tổng không quá 70.
- Phép trừ "1019 trừ 612 ra khoảng 400 MiB ngoài heap" viết như sự thật tính là một dữ kiện bịa. Viết kèm lời nói rõ
  phép trừ này không cho ra phần ngoài heap thì không tính.

## A. Đúng dữ kiện (30)

| Ý (theo đáp án ở `scenario.md`) | Tối đa | Trừ |
|---|---|---|
| Kernel giết process vì tổng bộ nhớ container chạm limit 1Gi; Kubernetes ghi `OOMKilled` và chạy lại container | 5 | thiếu: -5; chỉ nói "Kubernetes kill" mà không chỗ nào nhắc kernel: -2; viết "pod bị xoá, tạo pod mới": -2 |
| Exit code 137 là bị tín hiệu số 9 (SIGKILL) giết từ bên ngoài | 3 | không giải nghĩa 137: -3; giải mơ hồ ("mã lỗi bộ nhớ"): -2 |
| Không có `OutOfMemoryError` vì process bị giết từ ngoài, JVM không kịp ném; khớp log trong tệp vào | 4 | thiếu: -4; có ý nhưng không nối với dòng log trong tệp vào: -1 |
| `-Xmx` chỉ chặn heap; JVM còn bộ nhớ ngoài heap, kể ra ít nhất một thứ đúng | 5 | thiếu: -5; kể sai một thứ (thứ đó nằm trong heap): -2 |
| `-Xmx1g` bằng `1Gi`, nên không còn chỗ cho phần ngoài heap, container chạm limit trước khi heap đầy | 5 | thiếu: -5; nói hai số khác nhau: -3 |
| Dùng số Grafana: heap cao nhất 612 MiB, 548 MiB lúc 14:51, container 1019 MiB rồi restart | 4 | không dùng số nào: -4; chép sai một số, giờ: -2 mỗi chỗ |
| Hướng chỉnh nói qua: hạ heap tối đa (hoặc `MaxRAMPercentage`) hay tăng limit; con số phải đo | 4 | thiếu: -4; đưa con số và khẳng định là đủ: -3; giảng chi tiết dài quá ba câu dù người dùng dặn "nói qua thôi": -2 |

## B. Trả lời đúng câu hỏi, nói thẳng chỗ người dùng đoán sai (8)

| Ý | Tối đa | Trừ |
|---|---|---|
| Nói thẳng đoán "memory leak, heap đầy nên chết" không khớp dữ kiện, kèm lý do từ tệp vào | 4 | không nói: -4; nói vòng, rào ("có thể không hẳn là") mà không nói sai ở đâu: -2; khẳng định chắc chắn không có rò bộ nhớ nào: -2 |
| Nói thẳng đặt `-Xmx` bằng limit chính là lý do bị kill | 4 | không nói: -4; chỉ ngầm hiểu, người đọc phải tự suy ra: -2 |

## C. Đúng loại việc, đúng cách trả kết quả (8)

Việc này là "Viết mới" trong bảng Trả kết quả của `SKILL.md`: trả văn bản, thêm một hai câu về chỗ chưa kiểm hay thiếu dữ
kiện.

| Ý | Tối đa | Trừ |
|---|---|---|
| Ra một tệp ghi chú `.md` như người dùng xin, lời trả trong chat chỉ gồm đường dẫn tệp và một hai câu | 4 | không có tệp: -4; lời trả dài quá ba câu, tóm lại bài vừa viết, liệt kê việc đã làm, khen, mời làm thêm nhiều thứ: -3; có chấm điểm hay ước lượng thời gian: -2 |
| Một hai câu nói chỗ thiếu dữ kiện hay chưa kiểm (ví dụ chưa biết phần ngoài heap bao nhiêu, chưa biết bản JDK, chưa đo) | 4 | thiếu: -4; có nhưng chung chung, không nêu thứ cụ thể: -2 |

## D. Độ lưu loát, đọc tuần tự từng câu (26)

Cách chấm: đánh số từng câu của ghi chú, đọc từ câu 1 tới câu cuối, với mỗi câu ghi nó nối với câu trước bằng gì (lặp từ
khoá, "này, ấy, đó", từ nối đúng quan hệ, mốc thời gian) hoặc ghi "rời". Thử bằng cách che câu trước: câu sau vẫn đứng
một mình được thì là rời. Không quét cả bài rồi cho điểm chung. Bảng đánh số này phải có trong `grade.md`.

Bắt đầu 26, trừ dần, thấp nhất 0:

- Mỗi cặp câu rời: -2. Câu đầu đoạn mới không nắm lấy điều đoạn trước vừa nói: -1.
- Từ nối sai quan hệ ("Tuy nhiên" nối hai ý cùng chiều, "Và" mở câu tương phản): -2 mỗi chỗ.
- Câu chốt, câu tóm cuối đoạn ("Điều này giúp…", "Đó là lý do…", câu châm ngôn): -2 mỗi câu.
- Kết bằng "Tóm lại", "Nhìn chung", "Nhớ gọn:", "Nói ngắn gọn:", lời kêu gọi, câu khẳng định ý nghĩa: -3.
- Liệt kê "một là, hai là", "Thứ nhất, Thứ hai" cho đủ khi các ý không ngang hàng hay bị độn cho đủ số: -3. Bộ ba cho đủ
  vần, dãy từ gần nghĩa: -2.
- Mỗi lần dùng một cụm ở `machine-tells.md` mục B, C, D ("không chỉ… mà còn", "đóng vai trò", "thực chất", "về bản chất",
  "do đó", "chúng ta", "Hãy…", "hành trình", "điều quan trọng là"…): -1. Riêng "không phải X mà là Y" được dùng khi X là
  điều người dùng đã đoán (heap đầy), không trừ.
- Chữ nhấn thừa ("thật sự", "chính là" để nhấn, "đúng là", "hoàn toàn", "cực kỳ", "rất rất"): -1 mỗi chữ.
- Câu phải đọc hai lần mới hiểu, câu sai ngữ pháp, mở cặp từ nối mà không đóng, mở bằng "Với…", "Qua…" rồi mất chủ ngữ:
  -2 mỗi câu.
- Ba câu cụt (dưới 8 tiếng) liền nhau mà các ý có quan hệ nhân quả, điều kiện: -2.
- Mọi đoạn cùng một khuôn (cùng mở bằng câu hỏi, cùng dài, cùng kết bằng một câu ngắn): -2.
- Ý lặp lại không thêm gì (nói lại điều đoạn trước đã nói): -1 mỗi chỗ.

## E. Luật riêng của mảng giải thích (20)

| Ý | Tối đa | Trừ |
|---|---|---|
| Mở bằng điều người đọc đang thắc mắc (vì sao bị kill dù đã đặt `-Xmx1g`); không dựng cảnh, không mở bằng "Kubernetes là…", không mở bằng bối cảnh chung | 2 | sai: -2 |
| Hỏi rồi đáp: mỗi câu hỏi có câu đáp ngay sau, đáp thẳng trước rồi mới lý do; không hỏi dồn, không hỏi tu từ, không ba đoạn liền cùng mở bằng câu hỏi | 2 | -1 mỗi chỗ sai |
| Hình trước tên sau: đi từ thứ người đọc biết (heap, `-Xmx`, `OutOfMemoryError`), kể việc xảy ra rồi mới gọi tên; chủ ngữ là vật làm việc, không "cơ chế", "việc…"; câu định nghĩa có "là", không viết "Tên: lời giải thích" | 3 | -1 mỗi chỗ sai |
| Mỗi đoạn tối đa một thuật ngữ mới, giải nghĩa ngay lần đầu bằng từ dễ hơn. Người đọc đã biết: Java, Spring Boot, heap, `-Xmx`, `OutOfMemoryError`, GC, thread. Thuật ngữ mới: limit, OOMKilled, OOM killer, cgroup, SIGKILL, exit code, metaspace, committed… Danh sách ví dụ bộ nhớ ngoài heap được miễn giải từng tên nếu câu đã nói chúng là bộ nhớ ngoài heap và kể tối đa ba tên | 4 | -1 mỗi thuật ngữ dùng mà không giải nghĩa; -1 mỗi đoạn có từ hai thuật ngữ mới; -1 nếu danh sách ngoài heap quá ba tên |
| Một thứ một tên: limit của container, OOMKilled, container và pod không dùng lẫn cho nhau; thuật ngữ tiếng Anh một cách viết | 2 | -1 mỗi tên thừa |
| OOMKilled và `OutOfMemoryError` định nghĩa thành cặp, cùng khuôn câu, nối bằng "còn" | 2 | không phân biệt: -2; có phân biệt nhưng không thành cặp: -1 |
| Ẩn dụ: đúng một, đặt sau lời giải thích bằng lời thường, dùng để suy ra được một điều, nói chỗ nó hết đúng | 2 | không có ẩn dụ dù người dùng xin: -1; từ hai ẩn dụ, phép so sánh trở lên: -2; mở bài bằng ẩn dụ: -2; thiếu chỗ hết đúng: -1 |
| Ghi chú viết liền: không đề mục, không in đậm nhãn, phần giải thích không viết thành gạch đầu dòng (một khối code trích describe hay số liệu thì được); kết bằng kết quả cuối hoặc việc cần chỉnh, không câu chốt | 2 | có đề mục hay in đậm nhãn: -2; gạch đầu dòng cho phần giải thích: -1 |
| Độ dài phần văn (trừ khối code, đếm theo tiếng) 380-550 | 1 | 330-379 hay 551-650: -0,5; ngoài khoảng đó: -1 |

## F. Dấu, ký hiệu, chính tả, script soát (8)

Chạy `node scripts/lint.mjs <output.md>` và đọc từng cảnh báo.

- Dấu gạch dài hoặc gạch vừa ở bất cứ đâu (ghi chú, lời trả, khối code do người làm tự viết): -2 mỗi chỗ.
- Mũi tên, `~`, `&`, `=`, `vs`, emoji, dấu tick, số khoanh tròn trong câu văn; in hoa cả chữ để nhấn: -1 mỗi chỗ.
- Lỗi chính tả, dấu câu, viết hoa sai (ví dụ "Container" giữa câu): -1 mỗi chỗ.
- Cảnh báo của `lint.mjs` mà người làm không sửa và không có lý do hợp lý: -1 mỗi cảnh báo.

## G. Hình thức trang Word

Không áp dụng: đề xin tệp `.md`. Nếu người làm tự xuất Word mà người dùng không xin thì trừ 2 ở mục C.

## Cách ghi `grade.md`

1. Bảng đánh số câu và cách nối (mục D).
2. Từng mục A tới F: điểm, mỗi điểm trừ kèm câu trích nguyên văn.
3. Mức trần nào bị kích, vì câu nào.
4. Tổng, đạt hay chưa đạt, và những lỗi mà skill (tệp nào, mục nào) lẽ ra phải chặn được.

Bài trung bình thường mất điểm ở: chia đề mục, viết phép trừ 400 MiB, dồn thuật ngữ, câu chốt cuối đoạn, ẩn dụ đặt đầu
bài, lời trả tóm lại cả bài. Một bài như thế rơi vào khoảng 70-80.
