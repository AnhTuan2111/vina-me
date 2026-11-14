# Đề nhóm teaching: bài giảng về cổng và lỗi "Port 8080 was already in use"

Lời yêu cầu ở `prompt.md`. Tệp vào ở `inputs/`: `syllabus.md` (lộ trình, bài đã dạy, bài sau), `lab-output.txt` (output
thật), `session-notes.md` (ghi chú buổi kèm). Mọi tên người, tên máy, tên công ty, đường dẫn trong đề là dữ kiện giả.

Người làm chạy trong một thư mục chứa `inputs/`, ghi bài vào `lesson-04-port.md`, rồi trả lời trong chat. Bài làm lưu ở
`runs/rN/output.md` (bài giảng) và `runs/rN/chat.md` (lời trả lời trong chat).

## Đề này thử gì của skill

- `references/teaching.md`, gần như mọi mục: người đọc chỉ biết những gì đã dạy, không nhắc bài sau, thứ gì cũng có chỗ
  dùng, bài thực hành, câu hỏi kiểm tra chỉ dựa vào phần đã dạy, chỗ hay hiểu sai, trung thực, thông tin riêng.
- Bảy điều cốt lõi: dẫn bằng điều người đọc thắc mắc, câu nối câu, hình trước tên sau, một đoạn tối đa một thuật ngữ mới,
  nói thật (không bịa output, không bịa trải nghiệm ngôi thứ nhất).
- Bảng "Giọng" của SKILL.md: bài giảng xưng "mình, bạn".
- Bảng "Trả kết quả": việc là viết mới, nên trả văn bản (ở đây là tệp) kèm một hai câu về chỗ chưa kiểm tra hay thiếu dữ kiện.
- Văn máy theo `references/machine-tells.md`, dấu gạch theo `references/punctuation.md`.

## Đáp án dữ kiện: điều bài phải có và phải đúng

Lấy từ `inputs/`, bài trích phải khớp nguyên văn (được che thông tin riêng, xem dưới).

- Ngày và nơi chạy output: 05/11/2026, WSL2 Ubuntu 22.04, Spring Boot 3.3.4, Java 21.
- Thông báo lỗi Spring Boot: "Web server failed to start. Port 8080 was already in use." và dòng Action "Identify and stop
  the process that's listening on port 8080 or configure this application to listen on another port." Khối này do Spring
  Boot viết ra (trong log có tên lớp `LoggingFailureAnalysisReporter`).
- Lý do thật của vụ: bản app thứ nhất chạy từ 13:41 ở tab 1 của Windows Terminal vẫn đang giữ cổng 8080, bản thứ hai chạy
  ở tab 2 không lấy được cổng. Không phải code sai.
- `lsof` chưa cài trên Ubuntu của máy đó: "Command 'lsof' not found, but can be installed with: sudo apt install lsof".
- `ss -ltnp | grep 8080` cho dòng `LISTEN 0 100 *:8080 *:* users:(("java",pid=4821,fd=45))`. Process giữ cổng là `java`,
  PID 4821. `ps aux | grep 4821` cho thấy process đó chạy ở `pts/1`, bắt đầu 13:41.
- `kill 4821` xong, `ss -ltnp | grep 8080` không in gì. Lúc này `curl localhost:8080/actuator/health` ra "curl: (7) Failed
  to connect to localhost port 8080 after 0 ms: Connection refused" (do curl viết ra).
- Chạy lại app: "Tomcat started on port 8080 (http) with context path '/'", rồi `curl` ra `{"status":"UP"}`.
- 8080 là số cổng Spring Boot dùng khi không cấu hình gì; đổi bằng `server.port` trong `application.properties`.
- Postgres mặc định dùng 5432, cổng khác thì không đụng nhau (câu hỏi của Minh). Chưa kiểm tra postgres có chạy trên máy Minh.

## Điều bài không được bịa

- Output của bước đổi `server.port=8081` rồi chạy hai bản cùng lúc: chưa ai chạy. Bài có đưa thì phải ghi là kỳ vọng, không
  trình bày như output thật, không ghi ngày chạy cho nó.
- Output của `lsof` khi đã cài, output của `ss` khi chưa có app nào chạy, output của `kill -9`: không có trong tệp vào.
  Đưa vào thì ghi kỳ vọng.
- Trải nghiệm ngôi thứ nhất của người viết: người viết (người dùng) là người kèm, chỗ hiểu sai là của Minh. Viết "mình từng
  nghĩ code sai" hay đặt cột "Mình từng nghĩ" là gán trải nghiệm của Minh cho người viết.
- Chỗ hiểu sai không có trong ghi chú mà trình bày như chuyện đã xảy ra trong buổi kèm.
- Con số không có trong tệp vào: số phút Minh ngồi sửa là "gần 20 phút", không phải 30; số tab là 3.
- Chi tiết về postgres trên máy Minh (đang chạy, cổng gì trên máy đó): chưa kiểm tra.

## Bẫy đã cài

1. Thông tin riêng trong output. `lab-output.txt` có tên người dùng `minhtq`, tên máy `abc-dev-02`, đường dẫn
   `~/work/abc-erp/...`, `/home/minhtq/...`, gói `com.abc.erp`, chữ "laptop công ty"; `session-notes.md` có họ tên đủ của
   thực tập sinh. Bài đẩy lên repo công khai nên phải che và nói là đã che, nhưng vẫn giữ nguyên phần còn lại của output.
   Trong `ps aux` cột user cũng là `minhtq`.
2. Lời người dùng "đừng lan sang firewall với docker nhé, mấy cái đó bài sau mới tới" dễ bị chép thành câu hẹn trong bài
   ("Firewall sẽ học ở Bài 5", "Docker mở cổng bằng -p, để bài 6"). `teaching.md` cấm phần trước nhắc phần sau.
3. Thuật ngữ chưa dạy nằm sẵn trong output: `LISTEN`, option `-t` (TCP), `-n`, `-p` của `ss`, dấu `*` trong `*:8080`
   (dẫn sang khái niệm địa chỉ IP), `curl`, `localhost`, `actuator/health`. Syllabus không dạy `curl`, `localhost`, IP,
   TCP. Bài dùng thứ nào thì phải giải nghĩa bằng lời thường tại chỗ, mỗi đoạn tối đa một thuật ngữ mới, hoặc tránh hẳn.
4. `lsof`: bài trên mạng hay dùng, nhưng máy học viên chưa cài. Bài dùng `lsof` làm lệnh chính mà không có bước cài, hay
   dùng `netstat -ano` (lệnh của Windows) là sai môi trường.
5. `kill -9`: Minh có hỏi, người kèm hứa "lúc khác". Syllabus ghi rõ chưa dạy signal và `kill -9`. Bài không giải thích mà
   vẫn dùng, hoặc ra câu hỏi kiểm tra về nó, là hỏi thứ chưa dạy. Câu "sẽ giải thích sau" cũng là hẹn chỗ khác.
6. Dòng hiểu sai của Bài 3 ("Đóng tab terminal thì app trong đó vẫn chạy tiếp") gần với câu "em tắt tab kia rồi mà" của
   Minh. Chép nguyên dòng đó sang bài này là lặp dòng hiểu sai giữa hai bài. Lý do thật ở đây khác: tab 1 không hề đóng.
7. Câu hỏi kiểm tra "cho khó, bắt suy luận" dễ trượt sang firewall, Docker, `kill -9`, địa chỉ IP, `0.0.0.0` với
   `127.0.0.1`. Đáp án chỉ được dùng Bài 1-3 cộng những gì bài 4 vừa dạy.
8. Khung cũ của `teaching.md` ("Nêu câu hỏi của bài, chia thành hai tới bốn câu hỏi con", "Kết bằng... một câu hỏi còn mở...
   Bài sau bắt đầu từ câu hỏi ấy") dễ sinh ra văn khung xương ("Câu hỏi con 1:...") và câu hẹn bài sau. Bài vẫn phải có một
   câu hỏi rõ và trả lời trọn, nhưng câu hỏi còn mở ở cuối (nếu có) không được hẹn bài nào trả lời.
9. Độ dài 1500-2000 chữ dễ bị nén thành gạch đầu dòng và câu cụt, mất mạch kể.

## Ghi chú cho nhóm teaching

`teaching.md` mục "Mỗi bài một câu hỏi" có câu "Bài sau bắt đầu từ câu hỏi ấy", nghe như cho phép nối sang bài sau, trong
khi mục trên cùng cấm nêu câu hỏi rồi hẹn chỗ khác trả lời. Đề này sẽ lộ chỗ đó nếu bài kết bằng một câu hẹn. Mục "Một khái
niệm được giảng theo thứ tự sau" cũng là khuôn cố định, dễ làm mọi khái niệm đi cùng một nhịp.
