# Lộ trình nhóm tự học Linux cho dev Java

Học viên: thực tập sinh backend, biết Java và Spring Boot (controller, `application.properties`, chạy app bằng IntelliJ
hoặc `./mvnw spring-boot:run`). Máy: Windows 11, WSL2 Ubuntu 22.04, mở terminal bằng Windows Terminal.

## Bài 1: Terminal và câu lệnh (đã dạy)

Terminal, shell bash, câu lệnh và tham số, đường dẫn tuyệt đối và tương đối, `pwd`, `ls`, `cd`, bấm Tab để gõ nhanh.

## Bài 2: File và quyền (đã dạy)

File, thư mục, `cat`, `less`, `grep` để lọc dòng có chữ cần tìm, dấu `|` (pipe) đưa output của lệnh trước làm input
của lệnh sau, quyền đọc ghi chạy (rwx), `sudo`, cài gói bằng `sudo apt install <tên gói>`.

## Bài 3: Process (đã dạy)

Chương trình đang chạy gọi là process. Mỗi process có một số PID. Xem process bằng `ps aux`, lọc bằng `ps aux | grep java`.
`kill <PID>` gửi yêu cầu tắt tới process đó. Process chạy trong một tab terminal sẽ tắt theo khi đóng tab đó.

Chưa dạy ở Bài 3: signal, `kill -9`, chạy nền.

Bảng hiểu sai của Bài 3 có dòng:

| Dễ nghĩ là | Thật ra |
|---|---|
| Đóng tab terminal thì app trong đó vẫn chạy tiếp | Process chạy trong tab nào thì tắt theo tab đó |

## Bài 4: Cổng (đang soạn)

Mục tiêu: hiểu cổng (port) ở mức dùng được, đọc được lỗi "Port 8080 was already in use", tìm process đang giữ cổng bằng
`ss`, xử lý bằng cách tắt process đó hoặc đổi cổng của app bằng `server.port`.

## Bài 5: Firewall

Vì sao gọi app từ chính máy mình được mà máy khác trong mạng gọi không được.

## Bài 6: Docker

Chạy app trong container, mở cổng ra ngoài bằng `-p`.
