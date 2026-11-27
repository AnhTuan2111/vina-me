# Đề nhóm loanwords: sửa thông báo nội bộ chêm tiếng Anh, sai dấu phẩy và dấu chấm lửng

Lời yêu cầu nằm ở `prompt.md` (dán nguyên vào phiên làm bài). Không có tệp vào. Dữ kiện đều là giả: cụm staging, máy
stg-db-1, các app order-api, payment-api, user-api, team Platform, anh Long không gắn với công ty thật nào. Ngày 04/12/2026
là thứ Sáu, 03/12/2026 là thứ Năm.

## Đề thử điều gì của skill

- Ranh giới giữa thuật ngữ được giữ và chữ tiếng Anh pha tạp (`references/word-choice.md`, mục Thuật ngữ): deploy,
  pipeline, pull request, merge, job, restart, staging, Kubernetes là tên của việc, của chỗ người đọc gặp lại trong lệnh,
  trên giao diện, nên giữ; "Basically", "check", "Deadline", "confirm", "update", "feedback", "support" là chữ thường, viết
  tiếng Việt. Người dùng nói "chêm tiếng anh nhiều quá", nên bài dễ sửa quá tay, dịch luôn cả thuật ngữ.
- Bốn việc và ba lỗi của dấu phẩy (`references/punctuation.md`, mục Dấu phẩy): thiếu dấu phẩy sau trạng ngữ làm câu đọc
  hai cách, dấu phẩy chen giữa chủ ngữ và vị ngữ, phần chú thích giữa câu không được bọc bằng hai dấu phẩy, hai câu không
  liên quan nối bằng dấu phẩy.
- Dấu chấm lửng cuối dãy liệt kê (`punctuation.md`, mục Ký hiệu trong câu văn): kể đủ hoặc nói rõ còn gì; không được tự
  thêm tên app.
- Cách trả kết quả theo dòng "Sửa đoạn được dán vào" của bảng Trả kết quả trong `SKILL.md`.

## Đáp án dữ kiện

| Mã | Dữ kiện |
|---|---|
| D1 | Team Platform bảo trì cụm staging tối thứ Sáu 04/12, từ 20h tới 23h |
| D2 | Trong lúc bảo trì, cụm staging không nhận job mới |
| D3 | Các pipeline đang chạy lúc 20h sẽ bị dừng, không deploy được cho tới khi bảo trì xong |
| D4 | Kiểm tra các pull request đang mở, merge xong trước 18h ngày 04/12 |
| D5 | Hạn gửi danh sách app cần giữ chạy: 17h thứ Năm 03/12, gửi qua kênh #staging |
| D6 | Sau bảo trì, cụm staging lên bản Kubernetes mới; order-api, payment-api, user-api được deploy lại; danh sách app chưa đủ (gốc để dấu chấm lửng) |
| D7 | Máy stg-db-1 là máy chứa database của staging, restart sau cùng |
| D8 | Lịch đã chốt với anh Long |
| D9 | Phòng họp tầng 3 vẫn mở như thường |
| D10 | Có góp ý về lịch thì cứ gửi, team Platform hỗ trợ |

## Chỗ bài phải sửa

### Chữ tiếng Anh pha tạp

1. "Basically" ở đầu bài: bỏ.
2. "check lại": "kiểm tra lại", "xem lại".
3. "Deadline gửi danh sách": "Hạn gửi danh sách".
4. "confirm qua kênh #staging": "xác nhận", "báo" qua kênh #staging. Tên kênh giữ nguyên.
5. "được update lên bản Kubernetes mới": "được cập nhật lên", "lên".
6. "feedback": "góp ý".
7. "support": "hỗ trợ".

### Thuật ngữ phải giữ

deploy, pipeline, pull request, merge, job, restart, staging, Kubernetes, tên app, tên máy, tên kênh. "team Platform" giữ
như gốc (tên nhóm, `word-choice.md` có dòng viết hoa cho chữ "team"). Dịch "deploy" thành "triển khai", "pipeline" thành
"quy trình", "pull request" thành "yêu cầu hợp nhất", "restart" thành "khởi động lại", "job" thành "tác vụ" là sửa quá tay.

### Dấu phẩy

8. "Trong lúc bảo trì cụm staging không nhận job mới." thiếu dấu phẩy sau trạng ngữ, đọc được như "bảo trì cụm staging"
   rồi câu mất chủ ngữ. Sửa: "Trong lúc bảo trì, cụm staging không nhận job mới."
9. "Các pipeline đang chạy lúc 20h, sẽ bị dừng…" có dấu phẩy chen giữa chủ ngữ và vị ngữ. Sửa: bỏ dấu phẩy.
10. "Máy stg-db-1 máy chứa database của staging sẽ restart sau cùng." thiếu hai dấu phẩy bọc phần chú thích. Sửa: "Máy
    stg-db-1, máy chứa database của staging, restart sau cùng." Viết lại thành câu khác giữ đủ hai ý cũng được.
11. "Lịch này đã chốt với anh Long, phòng họp tầng 3 vẫn mở như thường." nối hai câu không liên quan bằng dấu phẩy. Sửa:
    tách thành hai câu, hoặc đưa câu phòng họp về chỗ khác.

### Dấu chấm lửng

12. "order-api, payment-api, user-api..." để dấu chấm lửng cuối dãy. Sửa: "order-api, payment-api, user-api và các app
    khác", hay hỏi người dùng danh sách đủ. Không tự thêm tên app.

## Điều bài không được bịa

- Tên app, tên máy ngoài các tên đã có; số bản Kubernetes; giờ deploy lại.
- Ngày cho mốc 18h ngoài "hôm đó" (04/12) đã có trong gốc.
- Cách liên lạc khác ngoài kênh #staging; người phụ trách ngoài team Platform và anh Long.

## Bẫy đã cài

| Bẫy | Ở đâu | Bài tốt làm gì | Lỗi hay gặp |
|---|---|---|---|
| Sửa quá tay thuật ngữ | cả bài | Giữ deploy, pipeline, pull request, merge, job, restart | "triển khai", "yêu cầu hợp nhất", "khởi động lại" |
| Chữ có ở cả hai phía | "update" | Viết "cập nhật", vì đây không phải tên nút hay lệnh | Giữ "update" vì tưởng là thuật ngữ |
| Trạng ngữ thiếu dấu phẩy | đoạn một | Thêm dấu phẩy sau "Trong lúc bảo trì" | Để nguyên, hay đặt dấu phẩy sau "cụm staging" |
| Dấu phẩy giữa chủ ngữ và vị ngữ | đoạn một | Bỏ dấu phẩy | Để nguyên |
| Chú thích chưa bọc | đoạn ba | Hai dấu phẩy | Một dấu phẩy, hay thêm "là" làm đổi câu |
| Hai câu nối bằng dấu phẩy | đoạn ba | Tách câu | Để nguyên, hay thêm "và" như thể hai việc liên quan |
| Dấu chấm lửng | đoạn ba | "và các app khác", hay hỏi | Giữ "...", hay bịa thêm tên app |
| Đổi giọng | cả bài | Giữ giọng thông báo nội bộ, "các bạn" | Chuyển sang giọng công văn, "Kính gửi" |
| Cách trả kết quả | cuối bài | Bản sửa, tối đa năm dòng thay đổi kèm lý do | Bảng mười dòng, kể từng chữ đã thay |
