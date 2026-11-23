# Thang chấm nhóm cohesion

Thang 100 điểm, đạt từ 95. Đáp án dữ kiện D1 tới D10 và bẫy T1 tới T8 ở `scenario.md`.

## Cách chấm

1. Đọc `scenario.md` trước, rồi mới đọc bài.
2. Dò dữ kiện: đi từng mã D1 tới D10, ghi "có, đúng", "thiếu", "đổi" kèm câu trích.
3. Dò bẫy: đi từng mã T1 tới T8, ghi bài đã làm gì kèm câu trích.
4. Đọc độ lưu loát tuần tự: đánh số từng câu của bản sửa (S1, S2…), che câu trước rồi hỏi câu này có nối với câu trước không.
5. Tìm ký tự U+2013 và U+2014 trong toàn bộ câu trả lời.
6. Mọi điểm trừ phải có câu trích nguyên văn. Một lỗi chỉ trừ ở một mục. Mỗi mục không trừ quá điểm tối đa của mục.

## Trần điểm

| Lỗi | Tổng không quá |
|---|---|
| Bịa một dữ kiện (danh sách "Điều bài không được bịa", trừ hai câu nhân quả đã có dòng trừ riêng ở mục A) | 80 |
| Còn ký tự gạch dài hay gạch vừa ở bất cứ đâu | 90 |
| Không trả bản sửa | 30 |

## A. Đúng dữ kiện: 25 điểm

| Lỗi | Trừ |
|---|---|
| Thiếu một dữ kiện D1 tới D10 | 3 mỗi dữ kiện |
| Đổi giá trị (giờ, phần trăm, tên máy, tên biến, mã ticket) | 5 mỗi chỗ |
| Viết web-2 chưa lên "vì" thiếu PAYMENT_KEY như điều chắc (T7) | 4 |
| Viết ổ còn 71% "nhờ", "vì" xoá log như điều chắc | 3 |
| Đổi "đặt lịch deploy" thành deploy đã xong lúc 22h | 3 |

## B. Liên kết câu: 35 điểm

| Lỗi | Trừ |
|---|---|
| T1: hai câu về Lan vẫn đứng rời, cùng mở bằng "Lan" | 5 |
| T2: web-1 và web-2 vẫn là chuỗi câu cùng mở "Máy web-…", không có "còn" hay câu ghép | 5 |
| T3: các câu về bản 2.4, nhóm QA vẫn lặp tên ở đầu mỗi câu | 5 |
| T4: thêm từ nối giả ("Ngoài ra", "Bên cạnh đó", "Đồng thời", "Thêm vào đó") ở bất cứ chỗ nào | 3 mỗi chỗ, tối đa 5 |
| T5: câu kết bằng "cho" (hay một hư từ khác) còn nguyên | 5 |
| T6: thứ tự giờ vẫn lộn, hay một đoạn trộn hai đề tài làm người đọc lẫn mốc | 5 |
| Gộp câu mà vế sau mượn chủ ngữ không làm được việc đó | 2 mỗi chỗ |
| Chặt thêm câu cụt hay để nguyên chuỗi câu cụt ở chỗ khác ngoài T1 tới T3 | 3 mỗi chuỗi |

## C. Độ lưu loát, đọc tuần tự từng câu: 20 điểm

| Lỗi | Trừ |
|---|---|
| Một chỗ câu sau rời câu trước | 3 mỗi chỗ |
| Từ nối sai quan hệ | 3 mỗi chỗ |
| Đại từ trỏ không rõ | 2 mỗi chỗ |
| Câu dài mà khớp nối rối, phải đọc hai lần | 3 mỗi câu |
| Văn AI slop mới (câu tóm cuối, "đáng chú ý", "chính là", "Hãy…") | 2 mỗi chỗ |

## D. Cách trả kết quả và giọng: 12 điểm

| Lỗi | Trừ |
|---|---|
| Có câu dẫn trước bản sửa ("Bản sửa đây:", "Dưới đây là…") | 2 |
| Không có danh sách thay đổi, hoặc quá năm dòng | 3 |
| Dòng thay đổi không nêu lý do | 1 mỗi dòng, tối đa 3 |
| Hỏi quá một câu, hay hỏi điều gốc đã nói | 2 |
| Giọng lệch: ghi chú nội bộ thành văn trang trọng ("Kính gửi", "Trân trọng"), hay thêm xưng hô gốc không có | 2 |
| Ghi bản sửa ra tệp khi không được nhờ | 2 |

## E. Thuật ngữ, một tên: 8 điểm

| Lỗi | Trừ |
|---|---|
| Dịch deploy, pipeline, ticket, log sang chữ Việt (T8) | 3 mỗi chữ |
| Một thứ gọi hai tên (ổ /data và "đĩa dữ liệu", ticket và "phiếu") | 2 mỗi chỗ |

## Thang tham chiếu

| Tổng | Bài trông thế nào |
|---|---|
| 95-100 | Đủ D1 tới D10, qua T1 tới T8, không thêm nhân quả, câu nối liền, trả kết quả gọn |
| khoảng 80 | Nối được phần lớn nhưng thêm "vì thiếu PAYMENT_KEY", còn câu kết bằng "cho", hay chèn "Ngoài ra" |
| dưới 70 | Chỉ thêm từ nối giữa các câu cụt, không đổi kiểu câu, hay bịa nguyên nhân |

Ghi `grade.md`: điểm từng mục, mọi điểm trừ kèm câu trích, bảng dò D và T, bảng số câu S1, S2… với chỗ đứt, trần đã áp,
tổng, đạt hay chưa.
