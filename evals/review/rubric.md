# Thang chấm nhóm review: soát hướng dẫn khôi phục database

Tổng 100 điểm, đạt từ 95. Mọi điểm trừ phải trích nguyên văn câu trong bài làm làm bằng chứng. Đáp án và bẫy ở `scenario.md`.
Bài trung bình (bắt hết chỗ script báo, thêm vài lỗi câu dễ thấy, sót lỗi nội dung tinh) rơi vào khoảng 75-82.

## Trần điểm, xét trước khi cộng

| Trường hợp | Tổng không quá |
|---|---|
| Sửa vào `inputs/restore-guide.md` (SHA-256 khác `126b4ceb…1536`) | 70 |
| Bịa một dữ kiện: chọn 7 hay 14 ngày làm số đúng; khẳng định bản dump là của production hay staging; đặt tên màn cho Bước 4; đưa lệnh tạo role kèm quyền như cấu hình thật; thêm bất kỳ con số, giờ, tên người nào tệp không có | 80 |
| Bỏ sót cả hai chỗ 7/14 ngày và lời dặn kiểm tra tên máy đứng sai chỗ | 80 |
| Bỏ sót một trong hai chỗ trên | 90 |
| Viết lại cả tệp thay cho danh sách soát (dán cả bài đã sửa vào chat) | 85 |

Trần nhỏ nhất thắng khi dính nhiều trường hợp.

## A. Nội dung sai hoặc làm người đọc làm sai: 25 điểm

| Chỗ (số theo đáp án) | Tối đa | Cách trừ |
|---|---|---|
| 1. Giữ backup 7 ngày và 14 ngày | 8 | Không nêu: trừ 8. Nêu mà chỉ trích một câu: trừ 3. Cách sửa không nói phải hỏi tác giả hay xem cấu hình bucket: trừ 2 |
| 2. "Mỗi đêm" chọi với 9h sáng giờ Việt Nam | 6 | Không nêu: trừ 6. Nêu nhưng đổ lỗi cho phép đổi giờ: trừ 6 và tính thêm bắt nhầm ở mục D |
| 3. Lời dặn kiểm tra tên máy đứng sau Bước 4 | 6 | Không nêu: trừ 6. Chỉ chê chữ "KHÔNG", "Hãy" mà không nói vị trí làm người đọc xoá xong mới thấy lời dặn: trừ 6. Nêu vị trí mà cách sửa không chỉ chỗ đặt mới: trừ 2 |
| 4. Không rõ bản dump lấy từ database nào | 5 | Không nêu: trừ 5. Nêu mà không nói vì sao quan trọng (nạp dữ liệu nào vào staging): trừ 2 |

## B. Lỗi câu, từ, liên kết: 25 điểm

| Chỗ | Tối đa | Cách trừ |
|---|---|---|
| 5. "Với bản dump này đã chứa…" thiếu chủ ngữ | 5 | Không nêu: trừ 5. Gọi sai tên lỗi (ví dụ "câu dài", "lủng củng") mà không nói thiếu chủ ngữ: trừ 3 |
| 6. "Tuy nhiên, nó mất khoảng 15 phút." | 6 | Mỗi lỗi bỏ sót (từ nối sai quan hệ; "nó" trỏ không rõ): trừ 3 |
| 7. database, CSDL, DB: một thứ ba tên | 5 | Không nêu: trừ 5. Chỉ nêu hai trong ba tên: trừ 2 |
| 8. "kịp thời" chọi "lẽ ra" | 4 | Không nêu: trừ 4. Nêu như lỗi văn máy hay câu dài chứ không nói hai ý chọi nhau: trừ 2 |
| 9. Mở bài "Trong thời đại…", "đóng vai trò" | 2 | Không nêu: trừ 2 |
| 10. Đoạn kết "không chỉ… mà còn", bộ ba, "Tóm lại", "chính là chìa khoá" | 3 | Không nêu: trừ 3. Đề xuất giữ đoạn và chỉ thay từ: trừ 2 |

## C. Dấu và ký hiệu: 8 điểm

| Chỗ | Tối đa | Cách trừ |
|---|---|---|
| 11. Gạch dài ở nhan đề | 4 | Không nêu: trừ 4. Cách sửa vẫn dùng gạch dài hay gạch vừa: trừ 4 |
| 12. "KHÔNG" in hoa | 2 | Không nêu: trừ 2 |
| 13. "Hãy" đầu câu hướng dẫn | 2 | Không nêu: trừ 2 |

Dấu `&` trong câu văn ở đoạn kết tính trong chỗ 10; bài nêu riêng thì không cộng thêm.

## D. Không bắt nhầm, không bịa trong cách sửa: 15 điểm

| Lỗi | Trừ |
|---|---|
| Bắt `~` hay `&&` trong khối code là lỗi | 3 mỗi ký hiệu |
| Coi câu "không phải 2h sáng giờ Việt Nam mà là 2h sáng giờ UTC" là lỗi cần sửa | 4 |
| Nói phép đổi 2h UTC ra 9h giờ Việt Nam sai | 5 |
| Bắt lỗi đánh số Bước 1 tới Bước 4, hay bắt "Rất dễ nghĩ là…" | 3 mỗi chỗ |
| Cách sửa đổi ý, đổi mức chắc chắn của tác giả (ví dụ biến "thường gặp" thành "luôn gặp") | 3 mỗi chỗ |
| Một mục soát mà câu gốc không có trong tệp (trích sai, trích bịa) | 4 mỗi mục |
| Cách sửa đưa dữ kiện mới không đánh dấu là đề xuất hay ví dụ chưa kiểm tra | 3 mỗi chỗ (bịa dữ kiện hệ thống thì xét trần 80) |

Mục này không xuống dưới 0.

## E. Đúng loại việc và đúng cách trả kết quả: 12 điểm

Theo dòng "Soát mà không sửa" trong bảng Trả kết quả của `SKILL.md` và lời dặn của người dùng.

| Yêu cầu | Tối đa | Cách trừ |
|---|---|---|
| Mỗi mục đủ ba phần: câu gốc trích nguyên văn trong ngoặc kép, vấn đề, cách sửa cụ thể | 4 | Mỗi mục thiếu một phần: trừ 1, tối đa trừ 4. Cách sửa chung chung ("viết lại cho rõ", "xem lại") tính như thiếu |
| Xếp nặng tới nhẹ, nội dung trước câu chữ như người dùng dặn | 4 | Một lỗi dấu, chữ in hoa hay văn mẫu đứng trên một lỗi nội dung: trừ 2 mỗi lần, tối đa trừ 4 |
| Không viết lại cả bài, không tạo tệp bản sửa khi không ai yêu cầu | 2 | Vi phạm: trừ 2 (dán cả bài đã sửa thì xét thêm trần 85) |
| Nói đã kiểm tra gì, bằng cách nào (chạy `lint.mjs` hay không, kết quả dùng thế nào), chỗ nào chưa chắc | 2 | Không nói: trừ 2. Nói đã chạy script mà bài không có dấu vết chạy: trừ 2 |

## F. Độ lưu loát của chính lời soát: 15 điểm

Người chấm đọc tuần tự từng câu của bài làm, từng chữ, xem câu sau có nối đuôi và dựa trên câu trước không; không quét cả
bài một lần rồi chấm. Ghi từng chỗ trừ kèm câu trích.

| Lỗi | Trừ |
|---|---|
| Dấu gạch dài hay gạch vừa ở bất cứ đâu trong bài (kể cả trong bảng, trong cách sửa đề xuất) | 5 lần đầu, 2 mỗi lần sau |
| Cụm văn máy trong lời của người soát: "đóng vai trò", "điều quan trọng nhất là", "chúng ta", "Hãy…", "nhìn chung", "thật ra", "về bản chất", "đáng chú ý" và các cụm cùng loại trong `machine-tells.md` | 2 mỗi cụm |
| Câu chốt cuối đoạn hay cuối bài ("Tóm lại", "Nhìn chung tài liệu khá ổn", "Sửa xong các điểm trên là tài liệu sẽ…") | 2 mỗi câu |
| Khen tài liệu hay khen tác giả, mục "điểm tốt", chấm điểm tài liệu, ước lượng thời gian sửa | 3 mỗi chỗ |
| Liệt kê "một là, hai là", "thứ nhất, thứ hai" cho đủ, hay mọi dòng mở bằng nhãn in đậm ngoài ba nhãn câu gốc, vấn đề, cách sửa | 2 |
| Chữ nhấn thừa: "rất", "thật sự", "chính là", "hoàn toàn", "đúng là" khi bỏ đi câu không mất nghĩa | 1 mỗi chữ, tối đa trừ 3 |
| Câu rời: che câu trước thì câu sau vẫn đứng một mình mà lẽ ra phải nối; từ nối sai quan hệ; đại từ trỏ không rõ (chính các lỗi bài đang bắt) | 2 mỗi chỗ |
| Mũi tên, dấu tick, emoji, `~`, `&`, `=` trong câu văn của người soát | 2 mỗi loại |
| Lời giải thích vấn đề dùng thuật ngữ người dùng chưa thấy (mã nội bộ, số mục tự đặt rồi gọi lại bằng số) | 2 |
| Ngoài danh sách soát, bài viết thêm đoạn dài hơn một dòng không ai hỏi | 2 |

Mục này không xuống dưới 0.

## G. Hình thức trang Word

Đề không có tệp Word, không xuất PDF; mục này không áp dụng. Bài làm tự xuất Word khi không ai yêu cầu thì trừ 2 ở mục E,
dòng "không tạo tệp bản sửa".

## Ghi điểm

`grade.md` ghi: điểm từng mục A tới F, từng chỗ trừ kèm câu trích, trần đã áp (nếu có), tổng cuối, và bài có đạt 95 không.
