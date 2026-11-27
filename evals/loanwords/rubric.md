# Thang chấm nhóm loanwords

Thang 100 điểm, đạt từ 95. Đáp án dữ kiện (D1 tới D10), mười hai chỗ phải sửa và danh sách bẫy ở `scenario.md`. Đề không
có tệp Word nên không chấm hình thức trang.

## Cách chấm

1. Đọc `scenario.md` trước, rồi mới đọc bài.
2. Dò dữ kiện D1 tới D10, rồi dò mười hai chỗ phải sửa và danh sách thuật ngữ phải giữ, mỗi chỗ ghi bài đã làm gì kèm câu
   trích.
3. Đọc bản sửa tuần tự từng câu (S1, S2…), che câu trước rồi hỏi câu này có nối và dựa trên câu trước không.
4. Tìm ký tự U+2013 và U+2014 trong toàn bộ câu trả lời.
5. Mọi điểm trừ phải có câu trích nguyên văn. Một lỗi chỉ trừ ở một mục, mục nặng nhất. Mỗi mục không trừ quá điểm tối đa
   của mục đó.

## Trần điểm

| Lỗi | Tổng không quá |
|---|---|
| Bịa một dữ kiện (xem "Điều bài không được bịa" ở `scenario.md`) | 80 |
| Bịa từ hai dữ kiện | 70 |
| Dịch từ ba thuật ngữ trở lên sang tiếng Việt | 85 |
| Còn ký tự gạch dài hay gạch vừa ở bất cứ đâu trong câu trả lời | 90 |
| Không trả bản sửa | 30 |

## A. Đúng dữ kiện: 20 điểm

| Lỗi | Trừ |
|---|---|
| Thiếu một dữ kiện D1 tới D10 | 3 mỗi dữ kiện |
| Đổi giá trị một dữ kiện (ngày, thứ, giờ, tên máy, tên app, tên kênh) | 4 mỗi chỗ |
| Đổi "các pipeline đang chạy lúc 20h" thành mọi pipeline, hay đổi "không nhận job mới" thành dừng mọi job | 3 |

## B. Chữ tiếng Anh và thuật ngữ: 25 điểm

| Chỗ | Tối đa | Cách trừ |
|---|---|---|
| 1. "Basically" | 2 | Còn: trừ 2 |
| 2. "check lại" | 2 | Còn: trừ 2 |
| 3. "Deadline" | 3 | Còn: trừ 3 |
| 4. "confirm" | 3 | Còn: trừ 3. Đổi luôn tên kênh: tính ở mục A |
| 5. "update" | 3 | Còn: trừ 3 |
| 6. "feedback" | 2 | Còn: trừ 2 |
| 7. "support" | 2 | Còn: trừ 2 |
| Thuật ngữ phải giữ | 8 | Mỗi thuật ngữ bị dịch (deploy, pipeline, pull request, merge, job, restart, staging, Kubernetes): trừ 2. Một thuật ngữ lúc giữ lúc dịch trong bài: trừ 1 |

## C. Dấu câu: 25 điểm

| Chỗ | Tối đa | Cách trừ |
|---|---|---|
| 8. Trạng ngữ "Trong lúc bảo trì" thiếu dấu phẩy | 5 | Để nguyên: trừ 5. Đặt dấu phẩy sai chỗ ("Trong lúc bảo trì cụm staging, không nhận…"): trừ 5 |
| 9. Dấu phẩy giữa chủ ngữ và vị ngữ | 5 | Còn: trừ 5 |
| 10. Chú thích "máy chứa database của staging" chưa bọc | 5 | Để nguyên: trừ 5. Chỉ thêm một dấu phẩy: trừ 3 |
| 11. Hai câu không liên quan nối bằng dấu phẩy | 4 | Còn: trừ 4. Nối bằng "và", "đồng thời" như thể hai việc liên quan: trừ 3 |
| 12. Dấu chấm lửng cuối dãy app | 4 | Còn: trừ 4. Bỏ dấu mà không nói danh sách chưa đủ (làm như ba app là tất cả): trừ 2. Tự thêm tên app: tính bịa |
| Dấu câu mới sai do bài thêm (phẩy thừa, chấm phẩy sai việc, chấm than) | 2 | Mỗi chỗ: trừ 1 |

## D. Đúng loại việc và cách trả kết quả: 12 điểm

| Lỗi | Trừ |
|---|---|
| Danh sách thay đổi quá năm dòng | 3 |
| Danh sách thay đổi không nêu lý do | 3 |
| Không có danh sách thay đổi | 5 |
| Liệt kê từng chữ đã thay mà không gom (mỗi chữ một dòng) | 2 |
| Đổi giọng thông báo nội bộ sang công văn ("Kính gửi", "Trân trọng thông báo"), hay bỏ "các bạn" làm câu nhờ mất người nhận | 3 |
| Lời mở hay lời kết thừa, khen bài gốc, bảng chấm điểm | 2 mỗi loại |
| Ghi bản sửa ra tệp khi không được nhờ | 3 |

## E. Độ lưu loát và văn AI slop: 18 điểm

Văn AI slop do bài tự thêm trừ gấp đôi.

| Lỗi | Trừ |
|---|---|
| Câu sau rời câu trước | 2 mỗi chỗ |
| Từ nối sai quan hệ | 3 mỗi chỗ |
| Ý nhân quả chặt thành câu cụt rời nhau | 2 mỗi chỗ |
| Văn AI slop theo `machine-tells.md` (câu chốt, "nhằm đảm bảo", "để quá trình diễn ra suôn sẻ", "tiến hành", bộ ba cho đủ vần) | 2 mỗi chỗ |
| Chữ nhấn thừa | 1 mỗi chỗ, tối đa 3 |
| Ký hiệu trong câu văn (`~`, `&`, `=`, mũi tên), in đậm rải trong đoạn | 1 mỗi chỗ |
| Một thứ hai tên (cụm staging và môi trường staging, app và service) | 1 mỗi cặp |

## Thang tham chiếu

| Tổng | Bài trông thế nào |
|---|---|
| 95-100 | Đủ dữ kiện, bỏ bảy chữ pha tạp, giữ mọi thuật ngữ, sửa bốn lỗi dấu phẩy và dấu chấm lửng, không bịa tên app, tối đa năm dòng thay đổi |
| khoảng 80 | Bỏ hết chữ pha tạp nhưng dịch "deploy", "pull request"; hay sửa dấu phẩy được hai trong bốn chỗ |
| dưới 70 | Bịa thêm tên app hay giờ; dịch cả loạt thuật ngữ; đổi sang giọng công văn |

Ghi `grade.md`: điểm từng mục, mọi điểm trừ kèm câu trích, bảng dò D1 tới D10, bảng mười hai chỗ phải sửa, trần đã áp,
tổng, đạt hay chưa.
