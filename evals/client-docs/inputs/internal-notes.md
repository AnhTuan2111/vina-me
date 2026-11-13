# ghi chú triển khai AquaBill tại Cấp nước Vân Khê (nội bộ Lục Bình, đừng gửi nguyên cho khách)

bản phát hành cho khách: AquaBill 2.3.0 (hệ thống quản lý hóa đơn tiền nước)
build đang chạy: nhánh release/2.3, commit a1f9c3e, tag v2.3.0-rc2
tài liệu cấu hình: bản 0.9 đã gửi khách 05/11, bản 1.0 ngày 13/11/2026. khách sửa tay mấy chỗ trên bản 0.9, xem email anh Đức

## máy (VM trên VMware của khách, khách cấp)

- web01 10.20.1.11: 4 vCPU, 8 GB RAM, 100 GB, Ubuntu 24.04 LTS. Nginx 1.26.2 làm reverse proxy và TLS, chứng chỉ wildcard
  khách cấp
- app01 10.20.1.21, app02 10.20.1.22: 8 vCPU, 16 GB RAM, 200 GB, Ubuntu 24.04 LTS. Docker Engine 27.3.1, mỗi máy một container
  aquabill-api (Java 21, Spring Boot 3.3). app02 hiện khách mới cấp 12 GB RAM, hứa nâng lên 16 GB trước 20/11
- db01 10.20.1.31 (primary), db02 10.20.1.32 (standby): 8 vCPU, 32 GB RAM, 500 GB SSD. PostgreSQL 16.4, streaming replication
  bất đồng bộ. db01 Ubuntu 24.04 LTS. db02 thì Huy cài, chưa hỏi lại bản nào
- mon01 10.20.1.41: 4 vCPU, 8 GB RAM, 200 GB, Ubuntu 24.04 LTS. Prometheus 2.54.1, Grafana 11.2.0, Alertmanager 0.27.0.
  node_exporter 1.8.2 cài trên cả 6 máy, postgres_exporter 0.15.0 trên db01 và db02

## cổng

- người dùng (mạng nội bộ khách và VPN của khách) vào web01 cổng 443. cổng 80 chỉ để chuyển hướng sang 443
- web01 tới app01, app02: 8080 (http)
- app tới db01: 5432
- db01 tới db02: 5432 (replication)
- mon01 tới cả 6 máy: 9100 (node_exporter); mon01 tới db01, db02: 9187 (postgres_exporter)
- grafana: người quản trị vào mon01:3000
- nginx conf trên web01 (copy nguyên từ máy):

```
upstream aquabill {
    server 10.20.1.21:8443 max_fails=3 fail_timeout=30s;
    server 10.20.1.22:8443 max_fails=3 fail_timeout=30s;
}
```

  chỗ này Huy bảo app nghe 8080 mà conf lại ghi 8443?? chưa rõ cái nào đúng, chưa kịp lên máy xem

## sao lưu

- pg_basebackup toàn bộ hằng ngày lúc 23:00, chạy trên db02 cho đỡ tải primary; WAL archive liên tục từ db01
- cả hai chép sang NAS của khách: \\nas-vk01\backup\aquabill
- giữ bao lâu: chưa thống nhất (mình đề xuất 30 ngày, khách chưa trả lời)
- phục hồi: dựng lại từ bản base backup gần nhất rồi phát lại WAL tới thời điểm cần (PITR)
- thử phục hồi 1 lần ngày 08/11 trên máy test nội bộ, mất 40 phút với 120 GB dữ liệu

## giám sát

- cảnh báo khi: ổ đĩa dùng trên 85%; app không trả lời /actuator/health quá 2 phút; replication lag trên 60 giây; CPU trên 90%
  liên tục quá 10 phút
- Alertmanager gửi email qua SMTP của khách. khách chưa cấp địa chỉ SMTP với email nhận cảnh báo

## xử lý sự cố

- app01 hoặc app02 chết: nginx tự bỏ máy chết ra (max_fails=3, fail_timeout=30s), máy còn lại gánh. bật lại máy là container
  tự chạy (restart: always)
- db01 chết: KHÔNG tự chuyển. quản trị viên promote db02 (`pg_ctl promote` hoặc `SELECT pg_promote();`), sửa cấu hình
  app trỏ sang 10.20.1.32 rồi khởi động lại container trên app01, app02. db01 dựng lại thành standby sau
- web01 chết: chỉ có 1 máy. khôi phục từ snapshot VMware của khách (khách chụp snapshot hằng tuần, Chủ nhật 02:00)
- mon01 chết: hệ thống vẫn chạy, chỉ mất giám sát và cảnh báo

## lưu ảnh hóa đơn scan

- chưa chốt: có thể dùng MinIO dựng trên app01/app02, hoặc dùng S3 nội bộ của khách (khách đang có Ceph RGW). anh Khoa nghiêng
  về S3 của khách vì khỏi phải tự lo sao lưu. chờ khách trả lời

## tình hình nội bộ (KHÔNG gửi khách)

- load test 300 user đồng thời, p95 1,2 giây, ổn
- bug BILL-412 xuất PDF hóa đơn lệch font, phải sửa trước nghiệm thu
- Huy đang làm lại module thanh toán trên nhánh feature/payment-v2
