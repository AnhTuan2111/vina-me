ghi chú buổi kèm 05/11/2026, bạn Trần Quang Minh (thực tập sinh backend, vào nhóm từ 20/10)

- 13:41 Minh chạy order-service bằng ./mvnw spring-boot:run ở tab 1 của Windows Terminal. Sửa code xong thì mở tab 2 chạy lại,
  ra lỗi Port 8080 was already in use.
- Minh nói: "ủa em có sửa gì đâu mà app lỗi". Ngồi sửa controller gần 20 phút vì tưởng code sai, rồi mới gọi mình.
- Mình hỏi tab cũ đâu, Minh bảo "em tắt tab kia rồi mà". Thật ra tab 1 vẫn mở, chỉ bị tab 2 che, Windows Terminal đang có 3 tab.
- Minh hỏi: "8080 là cổng riêng của java hả anh, app java nào cũng phải chạy 8080?". Mình giải thích 8080 là số Spring Boot dùng
  khi mình không cấu hình gì, đổi bằng server.port trong application.properties.
- Minh tra mạng thấy lsof, gõ thì máy chưa cài. Mình chỉ sang ss vì Ubuntu có sẵn.
- Minh hỏi: "nếu kill mà nó không chết thì sao anh". Mình nói nhanh là có kill -9, chưa giải thích gì thêm, hẹn lúc khác.
- Chưa thử: đổi server.port sang 8081 rồi chạy hai bản cùng lúc. Hết giờ nên chưa chạy.
- Minh hỏi thêm "thế sao mấy app khác trên máy em như postgres không bị đụng" -> postgres dùng 5432, cổng khác thì không đụng nhau.
  Chưa kiểm postgres có chạy trên máy Minh không.
