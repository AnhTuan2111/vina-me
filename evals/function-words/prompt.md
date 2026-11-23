sửa giúp mình đoạn hướng dẫn này, mình dịch từ README tiếng Anh của tool nên đọc cứ ra giọng dịch. đăng lên wiki nội bộ, giọng trung tính, giữ nguyên lệnh với số liệu nha

**Sao lưu database bằng db-snap**

db-snap là một công cụ được sử dụng để tạo các bản sao lưu của các database PostgreSQL. Việc cài đặt của công cụ này sẽ được thực hiện bằng lệnh `npm install -g db-snap`. Đối với lệnh `db-snap init` thì sẽ tạo các tệp cấu hình mặc định. Bạn có thể xem danh sách các bản sao lưu bằng lệnh `db-snap list`.

Trên các máy chủ production, việc sao lưu đã được lên lịch để chạy lúc 02:00 hằng ngày. Việc sao lưu chạy lúc 02:00 mất khoảng 40 phút cho database 120 GB. Các bản sao lưu sẽ được lưu giữ trong 14 ngày, sau đó chúng sẽ được xoá một cách tự động.

Nếu mật khẩu bị nhập sai năm lần thì tài khoản được khoá trong 30 phút nhé. Mỗi lần khôi phục, các người dùng cần chạy lệnh `db-snap restore --at <thời điểm>`. Lệnh này có thể mất những 2 giờ với database lớn.

Tình trạng hiện tại: đã sửa lỗi ghi đè tệp cấu hình ở bản 1.4.2, không kiểm tra lại trên máy staging. Ổ đĩa sao lưu có thể đầy trong tuần này vì dung lượng còn 8%. Giấy phép của bản Enterprise được thuê từ tháng 01/2027.
