# Đề nhóm word-report: báo cáo sự cố MediBook xuất Word

Lời yêu cầu nằm ở `prompt.md`, tệp vào ở `inputs/`. Mọi tên người, công ty, sản phẩm, số liệu đều là dữ kiện giả.

## Đề thử điều gì của skill

- Dựng một báo cáo sự cố (loại "báo cáo công việc và báo cáo sự cố" ở `references/document-types.md`): câu đầu nói việc
  gì xảy ra, khi nào, ảnh hưởng tới đâu; rồi đã làm gì, lý do, việc tiếp theo và ai làm.
- Đọc hết bảy tệp nguồn, chọn số đo thật thay cho lời ghi vội, không bịa số người bị ảnh hưởng hay lý do chưa có nguồn
  (điều 6 của SKILL.md, `references/citations-data-figures.md`).
- Xuất Word bằng `scripts/report-docx.mjs` theo `references/docx-export.md`, xuất PDF xem từng trang trước khi đưa (bảng
  "Trả kết quả" của SKILL.md).
- Hai yêu cầu người dùng mà script hiện không có: phông Times New Roman (script cứng `Arial`) và số trang ở chân trang
  (script không có chân trang). Bài phải giao đúng yêu cầu, bằng cách chép script ra chỗ khác để sửa hoặc xử lý tệp sau khi
  dựng, và nói rõ đã làm thế nào. Không sửa script trong thư mục skill.
- Ảnh chụp điện thoại 1080 x 2400: script chỉ thu bề ngang về 600 điểm ảnh, nên ảnh cao khoảng 35 cm, quá một trang A4
  (bề cao chữ khoảng 25,7 cm). `docx-export.md` dặn ảnh dọc cao quá một trang thì cắt phần không nói tới. Phần cần giữ là
  hộp thoại lỗi (khoảng dòng 980 tới 1500 của ảnh gốc) và có thể giữ phần form phía trên.
- Biểu đồ Grafana nền tối, ngang 1600 x 700: phải thu vừa bề ngang chữ, chú thích dưới ảnh, có câu trong thân bài trỏ tới.

## Đáp án dữ kiện

### Mốc thời gian (ngày thứ Ba 10/11/2026, giờ UTC+7)

| Giờ | Việc | Nguồn |
|---|---|---|
| 09/11 17:42 | commit `a3f9c21` "tạm giảm pool để chạy local" đổi `maximum-pool-size` từ 50 xuống 5 trong `application-prod.yml` | `config-diff.txt` |
| 08:10 | deploy `medibook-api` v3.8.0 lên prod, pipeline #4471; v3.8.0 chứa commit `a3f9c21` | ghi chú, `config-diff.txt` |
| 08:12:40 | phản hồi 5xx đầu tiên, `GET /api/slots...` trả 503 | `api-errors-excerpt.log` |
| 08:14:02 | cảnh báo `HighErrorRate` bật; 08:14:05 gửi kênh `#medibook-oncall` | `alert-log.txt` |
| 08:16 | cuộc gọi hotline đầu tiên về việc không đặt được lịch (HL-20811) | `hotline-tickets.csv` |
| khoảng 08:15 | CSKH (chị Trang) nhắn người trực | ghi chú |
| 08:31 | người trực bắt đầu xem | ghi chú |
| 08:44:05, 09:14:05 | cảnh báo nhắc lại | `alert-log.txt` |
| 08:52 | khởi động lại 2 pod api; lỗi giảm khoảng 5 phút (ô 08:55 chỉ còn 4) rồi tăng lại | ghi chú, `grafana-5xx.csv` |
| 09:20 | tìm ra giá trị pool bị đổi từ 50 xuống 5 | ghi chú |
| 09:34 | anh Vinh đồng ý rollback về v3.7.2 | ghi chú |
| 09:40 | rollback xong, pipeline #4473 | ghi chú |
| 09:47:05 | phản hồi 5xx cuối cùng, `POST /api/bookings` trả 503 | `api-errors-excerpt.log` |
| 09:52:10 | cảnh báo chuyển `RESOLVED` | `alert-log.txt` |

- Khoảng lỗi: 08:12:40 tới 09:47:05, tức khoảng 1 giờ 35 phút (94 phút 25 giây). Viết "từ 08:12 tới 09:47" là đúng.
- Tổng số phản hồi 5xx trong đợt: 1.284 (cộng cột `status_5xx_count` của `grafana-5xx.csv`). Đây là số phản hồi lỗi, không
  phải số người, không phải số lượt đặt lịch hỏng.
- Lời báo lỗi trên app (ảnh): "Không thể đặt lịch lúc này. Vui lòng thử lại sau." kèm "(Mã lỗi: E503)".
- Lỗi trong log, trích nguyên văn: "Connection is not available, request timed out after 30000ms" (HikariPool-1, `total=5,
  active=5`). Chỉ số `waiting=37` ở bản ghi đầu, `waiting=4` ở bản ghi cuối.
- Hotline: 40 cuộc ngày 10/11. 38 cuộc nhóm "Không đặt được lịch" (35 cuộc từ 08:16 tới 09:45, trong lúc lỗi; 3 cuộc lúc
  10:05, 10:21, 11:02 gọi phản ánh lại lỗi buổi sáng). 2 cuộc "Quên mật khẩu" (08:57, 09:26) không liên quan.
- Lý do: commit `a3f9c21` đổi `maximum-pool-size` trong `application-prod.yml` từ 50 xuống 5, commit nằm trong v3.8.0. Pool
  chỉ có 5 kết nối nên yêu cầu phải chờ quá 30 giây và bị trả 503. Diff có lời commit "tạm giảm pool để chạy local".
- Ảnh hưởng đi kèm: rollback về v3.7.2 làm mất tính năng chọn bác sĩ của v3.8.0; muốn có lại phải ra bản 3.8.1 (sửa pool)
  rồi deploy lại, chưa có lịch.

### Việc tiếp theo (đúng như ghi chú)

| Việc | Người làm | Hạn, tình trạng |
|---|---|---|
| Thêm bước kiểm tra config prod vào pipeline (giá trị pool khác 50 thì fail) | Quân | trước 17/11 |
| Gọi lại cho khách đã gọi hotline | chị Trang | trước 12/11; sáng 11/11 chị Trang nói đã gọi được 30 người |
| Thêm cảnh báo khi pool dùng quá 90% | chưa ai nhận | chưa có hạn |
| Dời giờ deploy prod sang sau 21h | anh Vinh trình anh Phong | chưa hẹn ngày |
| Ra bản 3.8.1 sửa pool, deploy lại tính năng chọn bác sĩ | chưa ghi người | chưa có lịch |
| Đếm số lượt đặt lịch bị hỏng (query bảng `booking_attempts`) | chưa ai làm | chưa có hạn |

Ý kiến chuyển sang pgbouncer: ghi chú nói "chưa bàn". Không bắt buộc đưa vào; đưa vào thì chỉ ghi là ý kiến chưa bàn.

### Điều bài không được bịa

- Số khách, số người bị ảnh hưởng ("vài trăm khách" là lời đoán của người trực; 1.284 là số phản hồi, không phải số người).
- Số lượt đặt lịch bị hỏng, số lịch bị mất, thiệt hại tiền.
- Lý do người trực xem lúc 08:31 dù cảnh báo gửi lúc 08:14; lý do vẫn còn lỗi từ 09:40 tới 09:47; lý do review không bắt
  được commit. Nguồn không nói, bài chỉ được nêu sự kiện hoặc ghi là chưa rõ.
- Người làm, hạn cho việc chưa có người, chưa có hạn.
- Tỉ lệ lỗi phần trăm (nguồn không có tổng số request), tên người viết commit, người bấm deploy.
- Kết quả gọi lại khách sau sáng 11/11, hay "còn 8 khách chưa gọi" viết như sự thật (30 là lời kể, cơ sở của con số không
  rõ là 38 hay 40 cuộc).

## Bẫy đã cài

1. Giờ bắt đầu: ghi chú nói "khoảng 8h15", log cho 08:12:40.
2. Giờ kết thúc: ba mốc dễ nhầm là 09:40 (rollback xong), 09:47:05 (lỗi cuối), 09:52:10 (cảnh báo hết). Hết lỗi là 09:47.
3. Số lỗi: ghi chú nói "khoảng 1300 lỗi", CSV cộng ra 1.284.
4. Tên khoá: ghi chú gọi `maxPoolSize`, diff cho tên thật `maximum-pool-size`.
5. Số người: ghi chú "chắc tầm vài trăm khách bị ảnh hưởng"; dễ biến 1.284 hay 40 thành số khách.
6. Hotline: 40 cuộc, chỉ 38 liên quan; 3 cuộc gọi sau khi hết lỗi nhưng vẫn là phản ánh lỗi buổi sáng.
7. Đổ lỗi: ghi chú có "quên trả lại", câu mỉa "lại cái kiểu deploy sáng thứ ba đúng giờ cao điểm" kèm emoji. Báo cáo gửi ban
   giám đốc không được mang giọng đó, không quy lỗi cho một người.
8. Ghi chú viết vội, đầy dấu gạch dài: không được lọt dấu nào vào báo cáo.
9. Khoảng trống 08:14 tới 08:31: dễ thêm lời giải thích không có nguồn.
10. Ảnh điện thoại dài quá một trang; biểu đồ nền tối, chữ nhỏ.
11. Times New Roman và số trang: script không làm được, phải xử lý và nói ra.
12. Lời trích: thông báo lỗi trên app và trong log phải chép đúng từng chữ.
