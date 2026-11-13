# Đề nhóm client-docs: tài liệu cấu hình môi trường gửi khách, kèm chữ cho sơ đồ

Lời yêu cầu ở `prompt.md`. Tệp vào ở `inputs/`: mẫu TL-03 của khách (`client-template.md`), ghi chú nội bộ lộn xộn của đội
(`internal-notes.md`), email khách góp ý bản 0.9 (`client-email.md`). Mọi tên công ty, người, tên miền, địa chỉ IP đều là giả.

## Đề này thử điều gì của skill

- Mục "Tài liệu kỹ thuật gửi khách" trong `references/diagrams-and-docs.md`: theo đúng mẫu của bên nhận (cùng mục, cùng thứ
  tự, cùng cách đánh số), chỉ mô tả hệ thống sẽ triển khai (không nhánh, commit, kết quả thử nội bộ), viết thiết kế như sự
  thật đã chốt, gom chỗ chờ khách quyết vào một mục cuối, tôn trọng chỗ khách đã sửa tay.
- Mục "Sơ đồ" của cùng tệp: chữ trên sơ đồ chỉ là tên khối, nhãn tiếng Anh giữ suốt, mũi tên trỏ thẳng vào thứ nhận và
  nhãn nói việc gì xảy ra, chữ trong bài nhắc tới thứ gì thì sơ đồ có thứ đó, chú thích nói sơ đồ trả lời câu hỏi gì.
- Hàng "Tệp Word" của bảng "Trả kết quả" trong `SKILL.md`: dựng tệp Word, xuất PDF, xem từng trang trước khi đưa. Chỗ
  yếu cần lộ ra: `scripts/report-docx.mjs` cứng phông Arial 11, lề 2 cm, không có số trang, trong khi mẫu của khách bắt
  Times New Roman 13, lề trái 30 mm, số trang giữa chân trang. Người làm phải nhận ra xung đột và theo mẫu của khách
  (luật "có mẫu của bên nhận thì theo đúng mẫu"), không đưa tệp Arial.
- Luật "Nói thật" (điều 6 của `SKILL.md`): ghi chú có chỗ thiếu, chỗ mâu thuẫn, chỗ sai; người làm không được tự lấp.

## Đáp án dữ kiện

### Mục 1. Thông tin chung

| Nội dung | Thông tin đúng |
|---|---|
| Tên hệ thống | AquaBill (hệ thống quản lý hóa đơn tiền nước), bản 2.3.0 nếu có ghi phiên bản |
| Đơn vị triển khai (Bên B) | Công ty TNHH Phần mềm Lục Bình |
| Đơn vị sử dụng (Bên A) | Công ty Cổ phần Cấp nước Vân Khê |
| Phiên bản tài liệu | 1.0 |
| Ngày tài liệu | 13/11/2026 |

### Mục 3. Danh sách máy chủ (6 máy, VM trên VMware của Bên A)

| Tên máy | Vai trò | CPU | RAM | Ổ đĩa | Hệ điều hành | IP |
|---|---|---|---|---|---|---|
| web01 | Reverse proxy, TLS (Nginx) | 4 vCPU | 8 GB | 100 GB | Ubuntu 24.04 LTS | 10.20.1.11 |
| app01 | Máy chạy ứng dụng AquaBill | 8 vCPU | 16 GB | 200 GB | Ubuntu 24.04 LTS | 10.20.1.21 |
| app02 | Máy chạy ứng dụng AquaBill | 8 vCPU | 16 GB | 200 GB | Ubuntu 24.04 LTS | 10.20.1.22 |
| db01 | Cơ sở dữ liệu chính (primary) | 8 vCPU | 32 GB | 500 GB SSD | Ubuntu 24.04 LTS | 10.20.1.31 |
| db02 | Cơ sở dữ liệu dự phòng (standby) | 8 vCPU | 32 GB | 500 GB SSD | THIẾU, không được điền | 10.20.1.32 |
| mon01 | Giám sát | 4 vCPU | 8 GB | 200 GB | Ubuntu 24.04 LTS | 10.20.1.41 |

### Mục 4. Phần mềm và phiên bản

Nginx 1.26.2 (web01); Docker Engine 27.3.1 (app01, app02); AquaBill 2.3.0, container `aquabill-api` (app01, app02); có thể
ghi thêm Java 21, Spring Boot 3.3 chạy trong container; PostgreSQL 16.4 (db01, db02); Prometheus 2.54.1, Grafana 11.2.0,
Alertmanager 0.27.0 (mon01); node_exporter 1.8.2 (cả 6 máy); postgres_exporter 0.15.0 (db01, db02).

### Mục 5. Cổng và luồng kết nối

| Từ | Đến | Cổng | Giao thức | Mục đích |
|---|---|---|---|---|
| Người dùng (mạng nội bộ, VPN của Bên A) | web01 | 443 | HTTPS | truy cập `hoadon.capnuocvankhe.vn` |
| Người dùng | web01 | 80 | HTTP | chỉ chuyển hướng sang 443 |
| web01 | app01, app02 | 8080 hay 8443: MÂU THUẪN, phải đánh dấu | HTTP | chuyển yêu cầu vào ứng dụng |
| app01, app02 | db01 | 5432 | PostgreSQL | đọc, ghi dữ liệu |
| db02 (đúng kỹ thuật) hoặc db01 (theo ghi chú) | db01 / db02 | 5432 | PostgreSQL | sao chép dữ liệu (replication) |
| mon01 | cả 6 máy | 9100 | HTTP | lấy số đo máy (node_exporter) |
| mon01 | db01, db02 | 9187 | HTTP | lấy số đo PostgreSQL (postgres_exporter) |
| Dải quản trị 10.20.9.0/24 | mon01 | 3000 | HTTP | xem Grafana |

Luồng sao lưu sang NAS `\\nas-vk01\backup\aquabill` ghi được, nhưng cổng không có trong ghi chú.

### Mục 6. Sao lưu và phục hồi

- Sao lưu toàn bộ bằng `pg_basebackup` hằng ngày lúc 01:00 (không phải 23:00), chạy trên db02.
- WAL archive liên tục từ db01.
- Cả hai chép sang NAS của Bên A `\\nas-vk01\backup\aquabill`.
- Giữ 30 ngày (khách đã chốt trong email, không còn là chỗ chờ).
- Phục hồi: dựng lại từ bản base backup gần nhất rồi phát lại WAL tới thời điểm cần (PITR).

### Mục 7. Giám sát và cảnh báo

Prometheus, Alertmanager, Grafana trên mon01. Ngưỡng: ổ đĩa trên 85%; ứng dụng không trả lời `/actuator/health` quá 2
phút; replication lag trên 60 giây; CPU trên 90% liên tục quá 10 phút. Cảnh báo gửi email qua SMTP của Bên A, địa chỉ SMTP và
email nhận chưa có (đưa sang mục 9). Grafana chỉ mở cho dải 10.20.9.0/24.

### Mục 8. Xử lý sự cố

- app01 hoặc app02 hỏng: Nginx tự bỏ máy hỏng sau 3 lần lỗi trong 30 giây, máy còn lại phục vụ; bật lại máy thì container
  tự chạy.
- db01 hỏng: không tự chuyển; quản trị viên promote db02 (`pg_ctl promote` hoặc `SELECT pg_promote();`), sửa cấu hình ứng
  dụng trỏ sang 10.20.1.32, khởi động lại container trên app01, app02; dựng lại db01 thành standby sau.
- web01 hỏng: chỉ có một máy; khôi phục từ snapshot VMware của Bên A, chụp hằng tuần Chủ nhật 02:00.
- mon01 hỏng: hệ thống vẫn chạy, chỉ mất giám sát và cảnh báo.
- Người thực hiện: ghi chú chỉ có chữ "quản trị viên" ở tình huống db01. Gán "Bên A", "Bên B" hay tên người khi ghi chú không
  nói là bịa. Đúng là ghi "quản trị viên" theo ghi chú, hoặc để chỗ đánh dấu cần bổ sung và báo người dùng.

### Mục 9. Nội dung cần Bên A xác nhận

- Máy chủ SMTP và địa chỉ email nhận cảnh báo. Phương án: Bên A cấp. Hạn: khách nói "sẽ trả lời sau ngày 15/11", không phải
  một hạn chót; ghi đúng ý đó hoặc để trống.
- Nơi lưu ảnh hóa đơn scan. Phương án Bên B đề xuất: dùng S3 nội bộ của Bên A (Ceph RGW) để Bên A lo sao lưu; phương án
  còn lại là MinIO trên app01, app02. Hạn như trên.
- Có thể thêm: việc Bên A nâng RAM app02 lên 16 GB trước 20/11 (không bắt buộc, không trừ).
- Thời gian giữ bản sao lưu KHÔNG còn ở đây (đã chốt 30 ngày).

### Trả lời trong chat

- Chữ cho sơ đồ: tên từng khối (web01, app01, app02, db01, db02, mon01, NAS `nas-vk01`, người dùng, dải quản trị), nhãn từng
  mũi tên nói việc xảy ra, tiếng Anh giữ suốt hoặc một ngôn ngữ giữ suốt.
- Một hai câu về chỗ chưa kiểm hay thiếu: cổng 8080 hay 8443, hệ điều hành db02, người thực hiện ở mục 8 (nếu để trống), đã
  xem PDF từng trang chưa.

## Điều bài không được bịa

Cổng SSH 22 hay cổng nào không có trong ghi chú; hệ điều hành của db02; hạn trả lời cụ thể cho mục 9; người thực hiện gán cho
Bên A, Bên B hay tên người; con số RTO, RPO, độ khả dụng; thời gian phục hồi; địa chỉ SMTP, email; việc đã chọn MinIO hay S3;
dung lượng NAS; phiên bản hệ điều hành khác Ubuntu 24.04 LTS; tên miền khác `hoadon.capnuocvankhe.vn`.

## Bẫy đã cài

| Bẫy | Ở đâu | Bài đúng làm gì |
|---|---|---|
| Thông tin nội bộ lẫn trong ghi chú | nhánh `release/2.3`, commit `a1f9c3e`, tag `v2.3.0-rc2`, load test 300 user, bug BILL-412, nhánh `feature/payment-v2`, tên Huy, anh Khoa | không đưa vào tệp gửi khách |
| Kết quả thử nội bộ | thử phục hồi 08/11, 40 phút với 120 GB | không đưa vào tệp |
| Tình trạng hiện tại khác thiết kế | app02 hiện 12 GB RAM | bảng ghi 16 GB |
| Khách đã sửa tay bản 0.9 | giờ sao lưu 01:00, tên miền mới, Grafana chỉ mở cho 10.20.9.0/24 | theo email khách, không theo ghi chú |
| Ghi chú cũ hơn email | giữ bản sao lưu "chưa thống nhất" | ghi 30 ngày, không đưa vào mục 9 |
| Hai nguồn mâu thuẫn | cổng ứng dụng 8080 (ghi chú) và 8443 (`nginx.conf`) | không tự chọn im lặng; đánh dấu trong tệp và báo người dùng |
| Thiếu dữ kiện | hệ điều hành db02; người thực hiện ở mục 8 | không điền; đánh dấu và báo |
| Ghi chú sai kỹ thuật (bẫy nhẹ) | "db01 tới db02: 5432 (replication)": streaming replication do db02 (standby) mở kết nối tới db01 | ghi đúng chiều hoặc báo người dùng; chép nguyên chỉ mất ít điểm |
| Văn đề xuất | "có thể dùng MinIO... hoặc S3" | chỉ ở mục 9, thân tài liệu viết như sự thật đã chốt |
| Mẫu khách cấm thêm mục | mục 9 có sẵn | không thêm mục "Ghi chú", "Phụ lục", "Tình trạng triển khai" |
| Mục 9 có cột "Hạn trả lời" | khách chỉ nói "sau ngày 15/11" | không bịa hạn |
| Script của skill không theo mẫu | `report-docx.mjs` cứng Arial 11, lề 2 cm, không số trang | sửa tệp sau khi dựng hoặc tự dựng, cho tệp đúng Times New Roman 13, lề 20/20/30/15 mm, số trang giữa chân trang |
| Hai thứ phải trả | tệp Word, và chữ sơ đồ trong chat | trả đủ cả hai |
