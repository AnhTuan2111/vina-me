ghi chú sự cố sáng 10/11 — Quân trực ca

- 08:10 deploy medibook-api v3.8.0 lên prod (pipeline #4471) — bản này có tính năng chọn bác sĩ khi đặt lịch
- khoảng 8h15 chị Trang bên CSKH nhắn là khách gọi hotline báo app không đặt được lịch
- 08:31 mình mới vào xem — log toàn lỗi HikariCP "Connection is not available, request timed out after 30000ms"
- 08:52 thử restart 2 pod api, đỡ được tầm 5 phút rồi lại lỗi y như cũ
- 09:20 so config với bản cũ thì thấy maxPoolSize trong application-prod.yml bị đổi từ 50 xuống 5, chắc lúc sửa để test local quên trả lại
- 09:34 anh Vinh đồng ý rollback về v3.7.2
- 09:40 rollback xong (pipeline #4473)
- sau đó grafana hết 5xx, tổng cả đợt grafana thấy khoảng 1300 lỗi
- chắc tầm vài trăm khách bị ảnh hưởng — lại cái kiểu deploy sáng thứ ba đúng giờ cao điểm 🙄
- chưa đếm được bao nhiêu lượt đặt lịch bị hỏng, phải query bảng booking_attempts — chưa ai làm
- rollback thì mất luôn tính năng chọn bác sĩ, phải ra bản 3.8.1 (sửa pool) rồi deploy lại — chưa có lịch

việc cần làm:
- Quân: thêm bước kiểm config prod vào pipeline (giá trị pool khác 50 thì fail) — xong trước 17/11
- chị Trang: gọi lại cho khách đã gọi hotline — xong trước 12/11 (sáng 11/11 chị Trang nói đã gọi được 30 người)
- thêm cảnh báo khi pool dùng quá 90% — chưa ai nhận
- dời giờ deploy prod sang sau 21h — anh Vinh sẽ trình anh Phong, chưa hẹn ngày
- có ý kiến chuyển sang pgbouncer — chưa bàn
