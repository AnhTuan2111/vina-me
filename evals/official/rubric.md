# Thang điểm nhóm official: tờ trình số hóa tài liệu lưu trữ

Tổng 100 điểm, đạt từ 95. Đáp án dữ kiện ở `scenario.md`. Mỗi điểm trừ ghi trong `grade.md` kèm trích nguyên văn câu, ô
bảng hoặc số trang PDF làm bằng chứng. Điểm mỗi mục không xuống dưới 0. Cùng một lỗi lặp ở nhiều chỗ thì trừ theo mức ghi
ở dòng đó (có dòng ghi "mỗi chỗ", có dòng trừ một lần).

Chấm trên `output.docx` (đọc chữ), ảnh từng trang của `output.pdf` (hình thức) và `reply.md` (cách trả kết quả). Người làm
không xuất PDF thì người chấm tự xuất bằng Word, giữ khóa `evals/.word-lock` theo `evals/README.md`, để chấm mục C,
và trừ ở mục E.

## Trần điểm

| Điều kiện | Tổng không quá |
|---|---|
| Bịa một dữ kiện: con số, ngày, tên, trích yếu văn bản, đơn vị thực hiện, căn cứ không có trong đề; dùng số trong bản nháp mà người dùng dặn không dùng (70%, 1.500 lượt) | 80 |
| Bịa từ ba dữ kiện trở lên | 60 |
| Không có tệp Word, hoặc tệp Word không do `scripts/official-doc-docx.mjs` dựng mà không giải thích lý do | 70 |
| Tệp Word không mở được, hay mất cả phần nội dung | 40 |

## A. Đúng dữ kiện, không bịa (30 điểm)

| Lỗi | Trừ |
|---|---|
| Chép tổng 1.850.000.000 hoặc dòng biên mục 278.000.000 mà không báo người dùng | 12 |
| Viết đúng 1.800.000.000 nhưng không nói trong chat là đã sửa so với CSV và lời người dùng | 5 |
| Phần đề nghị bổ sung sai (650.000.000) hoặc thiếu con số bổ sung mà không đánh dấu cần xác nhận | 4 |
| Bảng dự toán trong phụ lục không khớp số lượng, đơn giá, thành tiền của đáp án (mỗi ô sai) | 2, tối đa 6 |
| "tăng 5,6%" hay "tăng 5.6%" thay cho điểm phần trăm | 5 |
| Mất hoặc sai một dữ kiện người dùng đưa: 2.150 mét giá, 18,4%, 24%, 30%, ngày biên bản 26/8/2026, 120 mét giá, phông và giai đoạn 1976-1995, 360.000 trang, 24.000 hồ sơ, 12 tháng, 1,2 tỷ, các mốc tiến độ (mỗi dữ kiện) | 3 |
| Đổi mức chắc chắn: bỏ chữ "khoảng" của 30% hay 360.000 trang, hoặc viết số ước tính như số đã chốt | 2 |
| Gắn Sở Tài chính vào Kính gửi, hoặc bỏ mất Sở Tài chính khỏi Nơi nhận | 3 |
| Thêm dữ kiện không bịa nhưng ngoài đề (ghi gửi kèm biên bản kiểm tra kho, thêm mục tiêu, lợi ích có số) mỗi chỗ | 2 |

Bịa thì áp trần ở trên, cộng trừ 10 ở mục này cho mỗi dữ kiện bịa.

## B. Thể thức theo Nghị định 30/2020 (22 điểm)

So với `references/official-documents.md` và bảng đáp án ở `scenario.md`.

| Lỗi | Trừ |
|---|---|
| Số, ký hiệu khác "07/TTr-TTLT" (thiếu số 0, sai ký hiệu loại, có dấu cách) | 2 |
| Ngày khác "Hòa Lâm, ngày 06 tháng 01 năm 2027"; ngày trong viện dẫn thiếu số 0 ở ngày dưới 10, tháng 1, 2 (mỗi chỗ) | 2, tối đa 4 |
| Tiêu ngữ dùng gạch dài, gạch vừa hoặc thiếu dấu cách quanh gạch nối | 3 |
| Tên cơ quan chủ quản, cơ quan ban hành sai tên hoặc sai cách viết (chủ quản đậm, ban hành không đậm) | 2 |
| Kính gửi một nơi mà tách dòng, hay thiếu dấu chấm cuối | 1 |
| Viện dẫn Quyết định 2318 lần đầu thiếu một thành phần (tên loại, số ký hiệu, ngày, cơ quan, trích yếu); lần sau vẫn viết đủ hay viết khác | 2 |
| Viết hoa sai theo Phụ lục II: "sở nội vụ", "ubnd tỉnh", "Uỷ Ban Nhân Dân", "Trung tâm lưu trữ Lịch sử"... (mỗi kiểu) | 1, tối đa 3 |
| "UBND" dùng trước khi viết đủ một lần, hoặc chữ tắt khác không có chỗ giải (TTLT trong thân bài, NVLT ngoài dòng Lưu) | 1 |
| Bố cục không có mục số La Mã có tiêu đề in hoa, hoặc thiếu một trong các khối: sự cần thiết, nội dung và khối lượng, kinh phí và nguồn, tiến độ, kiến nghị | 2 mỗi khối thiếu, tối đa 4 |
| Câu mở không theo khuôn "[đơn vị] kính trình [nơi nhận]..." hoặc câu kết không theo khuôn tờ trình | 2 |
| Thân bài không nói phụ lục nào kèm theo (Phụ lục I dự toán, Phụ lục II tiến độ) | 2 |
| Phụ lục không đánh số La Mã khi có hai phụ lục, thiếu dòng "(Kèm theo Tờ trình số ... của ...)", hay dòng đó sai số, ngày | 2 |
| Khối ký sai: thiếu "KT.", chức vụ sai, có "ThS." hay "Thạc sĩ" trước tên | 3 |
| Nơi nhận thiếu "- Như trên;" hay dòng Lưu khác "Lưu: VT, NVLT." | 2 |
| Nội dung không kết bằng "./." | 1 |
| Điểm nhảy chữ (d) sang e), có f), j)...) hay số kiểu tiếng Anh còn sót ở bất kỳ đâu, kể cả bảng (mỗi chỗ) | 1, tối đa 3 |

## C. Hình thức trang, chấm trên ảnh PDF (15 điểm)

Xem từng trang PDF ở cỡ đủ đọc. Lề, phông, cỡ chữ đo bằng cách đọc thuộc tính trong `document.xml` khi ảnh không đủ rõ.

| Lỗi | Trừ |
|---|---|
| Không phải A4 dọc, lề khác trên dưới 20-25 mm, trái 30-35 mm, phải 15-20 mm | 3 |
| Phông khác Times New Roman, thân bài khác cỡ 13-14, không canh đều hai lề | 3 |
| Tên cơ quan ban hành bị Word tự ngắt giữa cụm (ví dụ "LỊCH" một dòng, "SỬ TỈNH HÒA LÂM" dòng dưới), hai cột phần đầu lệch nhau, đường kẻ dưới tên cơ quan, Tiêu ngữ, trích yếu mất hay dài quá | 2 |
| Số trang hiện ở trang đầu, không ở giữa lề trên, hay phụ lục không đánh lại từ 1 | 2 |
| Tiêu đề mục hay khoản nằm cuối trang mà nội dung sang trang sau; khối ký và Nơi nhận tách khỏi câu kết sang một trang chỉ có khối ký; trang trống (mỗi chỗ) | 2, tối đa 4 |
| Bảng tràn lề, con số trong ô bị xuống dòng giữa số, chữ trong bảng nhỏ hơn 11 hay lớn hơn 13, cột tiêu đề bảng không lặp khi bảng sang trang | 2 |
| Phụ lục không bắt đầu trang mới | 1 |
| Chữ in đậm ở thân bài ngoài đề mục và khối quy định | 1 |

## D. Văn phong và độ lưu loát (23 điểm)

Đọc tuần tự từng câu của phần nội dung (từ câu mở tới câu kết, cả phụ lục có lời văn). Mỗi câu hỏi hai điều: câu này có nối
đuôi câu trước (lặp từ khóa, "này, đó", từ nối đúng quan hệ, mốc thời gian) không; che câu trước thì câu này còn hiểu được
không. Ở cấp khoản, điểm, câu đơn lẻ là bình thường (mục "Văn phong" của `official-documents.md`), không trừ vì rời; các
khối Căn cứ, Kính gửi, câu mở, câu kết theo khuôn không bị coi là văn mẫu.

| Lỗi | Trừ |
|---|---|
| Ở phần lời văn (sự cần thiết, kiến nghị), câu sau không dựa trên câu trước, đứng rời thành ý mới mà không có từ nối (mỗi chỗ) | 2, tối đa 6 |
| Văn máy mang từ bản nháp hay tự sinh: "trong bối cảnh", "không chỉ... mà còn", "đóng vai trò then chốt", "chìa khóa", "khổng lồ", "mạnh mẽ", "góp phần quan trọng", "có thể nói", "hướng tới", câu khẩu hiệu không có dữ kiện (mỗi chỗ) | 2, tối đa 6 |
| Câu chốt cuối đoạn nhắc lại điều vừa nói ("Do đó, việc ... là hết sức cần thiết và cấp bách", "Tóm lại...") quá một lần trong cả văn bản; lần đầu được giữ nếu nó theo sau dữ kiện | 2 mỗi lần thừa |
| Liệt kê cho đủ: bộ ba tính từ ("nhanh chóng, thuận tiện, hiệu quả"), "một là, hai là", các điểm lợi ích chung chung không gắn dữ kiện nào của đề (mỗi chỗ) | 2, tối đa 4 |
| Chữ nhấn thừa: "rất", "hết sức", "vô cùng", "thực sự", "nghiêm trọng" khi đề không nói mức đó (mỗi chỗ) | 1, tối đa 3 |
| Xưng "chúng tôi", "mình", "tôi"; hỏi rồi đáp, hỏi tu từ; ẩn dụ; cảm thán | 3 |
| Dấu gạch dài, gạch vừa ở bất kỳ đâu trong tệp Word, JSON hay chat (mỗi chỗ) | 2, tối đa 6 |
| Một thứ hai tên: "Trung tâm Lưu trữ tỉnh", "Trung tâm" xen "đơn vị", "số hóa" xen "scan" xen "chuyển đổi số" cho cùng một việc, "biên mục" xen "nhập liệu" (mỗi cặp) | 1, tối đa 3 |
| Câu dài lủng củng, sai quan hệ từ, chủ ngữ là "việc...", "công tác..." khi có thể dùng cơ quan làm chủ ngữ (mỗi chỗ) | 1, tối đa 3 |

## E. Đúng loại việc và cách trả kết quả (10 điểm)

Bảng "Trả kết quả" của `SKILL.md`: việc này là "Viết mới" ra "Tệp Word" văn bản hành chính.

| Lỗi | Trừ |
|---|---|
| Không dùng `scripts/official-doc-docx.mjs` (đã có trần ở trên) | 4 |
| Không xuất PDF, hay xuất mà không nói đã xem từng trang và thấy gì | 3 |
| Không chạy `scripts/lint.mjs` ở chế độ văn bản hành chính, cũng không nói vì sao không chạy | 1 |
| Câu trả lời trong chat không nêu chỗ thiếu dữ kiện: trích yếu Kế hoạch 145 | 2 |
| Câu trả lời không nêu đã bỏ số liệu của bản nháp (70%, 1.500 lượt) và đã đổi "tăng 5,6%" thành điểm phần trăm | 1 |
| Câu trả lời dài quá: dán lại cả văn bản vào chat, kể lại từng mục đã làm, khen, chấm điểm, ước lượng thời gian, đề xuất ngoài việc được giao | 2 |
| Không đưa đường dẫn tệp docx, PDF | 1 |

## Mốc tham khảo

Bài trung bình thường chép tổng 1,85 tỷ từ CSV (trừ 12 và 4 ở mục A), sót một hai chỗ văn máy từ bản nháp và một câu chốt
(trừ khoảng 6 ở mục D), một lỗi hình thức trang (trừ 2 ở mục C), tổng khoảng 76-82. Bài đạt 95 phải bắt được sai số dự toán,
không bịa trích yếu, đúng thể thức gần như trọn và văn không còn khuôn của bản nháp.
