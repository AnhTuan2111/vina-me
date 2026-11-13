# Khôi phục database staging — hướng dẫn cho dev mới

Trong thời đại dữ liệu là tài sản quý giá nhất của doanh nghiệp, việc sao lưu đóng vai trò then chốt. Tài liệu này hướng dẫn các bạn khôi phục database PostgreSQL của app ClinicBook trên máy `db-staging-01` từ bản backup gần nhất.

## Backup chạy thế nào

Mỗi đêm, một cron job dump toàn bộ database ra một tệp nén rồi đẩy lên bucket `clinicbook-backup`. Rất dễ nghĩ là cron chạy theo giờ Việt Nam. Lịch thật không phải 2h sáng giờ Việt Nam mà là 2h sáng giờ UTC, tức 9h sáng ở Việt Nam, vì máy chủ để múi giờ UTC. Bản backup được giữ 7 ngày rồi tự xoá.

Với bản dump này đã chứa cả dữ liệu lẫn cấu trúc bảng. CSDL staging dùng chung cho cả nhóm QA, nên trước khi khôi phục phải báo trên kênh #staging. Tuy nhiên, nó mất khoảng 15 phút.

## Các bước

Bước 1. Tải bản backup mới nhất về máy `db-staging-01`:

```bash
aws s3 cp s3://clinicbook-backup/latest.sql.gz ~/restore/ && gunzip ~/restore/latest.sql.gz
```

Bước 2. Dừng app ClinicBook trên staging để không còn kết nối nào ghi vào DB.

Bước 3. Xoá database cũ, tạo lại database rỗng rồi nạp bản dump:

```bash
dropdb clinicbook && createdb clinicbook && psql clinicbook < ~/restore/latest.sql
```

Bước 4. Bật lại app, đăng nhập bằng tài khoản test và kiểm tra vài màn chính.

Lưu ý: KHÔNG chạy bước 3 trên production. Hãy kiểm tra kỹ tên máy trước khi gõ lệnh. Việc kiểm tra tên máy kịp thời này lẽ ra phải được làm trước khi tải backup.

## Khi có lỗi

Nếu psql báo lỗi role không tồn tại thì tạo role đó trước rồi chạy lại. Lỗi này thường gặp khi bản dump lấy từ production, vì production có role `report_reader` mà staging không có. Bản backup trên bucket được giữ 14 ngày, nên có thể lấy bản cũ hơn nếu bản mới nhất bị hỏng.

Khôi phục không chỉ giúp sửa lỗi mà còn giúp đội ngũ tự tin hơn, nhanh hơn & chủ động hơn. Tóm lại, nắm vững quy trình này chính là chìa khoá để làm chủ hệ thống.
