# Thang chấm nhóm report: rà soát web phòng khám Hòa An

Tổng 100 điểm, đạt từ 95. Đáp án dữ kiện ở `scenario.md`. Chấm trên tệp Word (và PDF xuất từ nó), `notes.md` của người làm
và lời trả trong chat. Mỗi điểm trừ ghi kèm câu trích nguyên văn từ bài làm. Mỗi mục không xuống dưới 0.

Trần điểm, áp sau khi cộng:

- Bịa một dữ kiện (số hotline, email, tọa độ, năm thành lập "đúng", nội dung tài liệu không có, lời trích không có trong
  nguồn, giờ kiểm không có thật): tổng không quá 80. Bịa từ ba dữ kiện: tổng không quá 60.
- Không có tệp Word: tổng không quá 70.
- Không mở `facade-photo.png` (bài coi nó là ảnh mặt tiền, hoặc không nhắc nội dung ghi chú): tổng không quá 85.

## 1. Đúng dữ kiện và đủ (30 điểm)

Mỗi ý có đủ hai phía (web ghi gì ở đâu, nguồn ghi gì ở đâu) mới được trọn điểm; thiếu một phía thì được nửa điểm (làm
tròn xuống).

| Ý | Điểm | Trọn điểm khi |
|---|---|---|
| F1 số nhà 72 so với 27 | 3 | nêu trang Liên hệ và chân trang (hoặc "mọi trang") |
| F2 giờ đóng cửa 19:00 so với 19:30 | 2 | nêu thanh trên cùng sai và trang Liên hệ ghi đúng 19:30 |
| F3 giờ Chủ nhật, nguồn mâu thuẫn | 3 | nêu cả giấy phép lẫn ghi chú tay, không chọn hộ, hỏi bên nào áp dụng; nhắc ô "Mở cửa 7 ngày" thì đủ, không nhắc trừ 1 |
| F4 khám phụ khoa 180.000 so với 200.000 | 2 | |
| F5 nội soi dạ dày gây mê 1.500.000 so với 1.650.000 | 2 | ghi cùng gốc với F4 hoặc nói cả hai trùng bảng cũ |
| F6 nội soi đại tràng 2.000.000 so với 2.100.000 | 2 | trích giữ "đại tràn" (sửa thành "đại tràng" trong ngoặc kép thì trừ 1); không gom vào "bảng cũ" |
| F7 tiêm chủng | 2 | nêu không có trong phạm vi giấy phép, không có trong bảng giá, và ghi chú tay bảo bỏ |
| F8 BS.CKI so với BS.CKII | 2 | nêu cả trang Đội ngũ và trang chủ |
| F9 CCHN BS Phước 004215 so với 004512 | 2 | |
| F10 BS Trần Minh Đức không có trong danh sách | 2 | |
| F11 "Hơn 20 bác sĩ đầu ngành" nói quá | 2 | kèm câu bị đánh giá và lý do: danh sách sáu người, web bảy thẻ, không nguồn nào có ý đó |
| F12 "mấu" | 1 | |
| Tài liệu đã nhận | 2 | nói `facade-photo.png` là ghi chú tay dù B1 ghi "Đã nhận", và `doctors-full-list.md` thiếu CCHN hai người dù A3 ghi "Đã nhận"; thiếu một trong hai trừ 1 |
| Phần thiếu | 3 | đủ năm nhóm ở `scenario.md` (hotline và email, bản đồ, ba con số trang chủ, hai ảnh, CCHN của hai bác sĩ); thiếu mỗi nhóm trừ 1 |

Trừ thêm trong mục này:

- Báo một thứ "không phải lỗi" ở `scenario.md` là lỗi (X-quang, ngày giấy phép, cách viết giờ, cách viết giá, hai bác sĩ
  khớp): trừ 3 mỗi chỗ.
- Sai số hay sai tên khi chép dữ kiện (ghi 1.600.000 thay 1.650.000, ghi nhầm trang): trừ 2 mỗi chỗ.

## 2. Không bịa, đúng mức chắc chắn (10 điểm)

Bịa thì áp trần ở đầu tệp, và mục này còn 0. Ngoài ra trừ:

- Suy quá nguồn, trừ 4 mỗi chỗ: "năm 2009 sai" dựa vào ngày cấp giấy phép; khẳng định tọa độ bản đồ sai; khẳng định số CCHN
  của BS Ngân hay BS Khoa sai; tự chọn giấy phép hay ghi chú tay là đúng cho Chủ nhật; nói web "vi phạm", "có thể bị phạt"
  vì mục tiêm chủng.
- Nói chắc hơn đã kiểm, trừ 2 mỗi chỗ: "web dùng nhầm bảng giá cũ" nói như sự thật (được nói "trùng bảng cũ" hoặc "có thể");
  ghi ngày ghi chú thành "28/10/2026" như thể nguồn có năm; nói người ký ghi chú là BS Lương Thị Hạnh thay vì "ký tên Hạnh";
  nói "đã kiểm trên bản đang chạy" khi chỉ mở tệp lưu.
- Thêm lời khuyên hay dữ kiện ngoài nguồn vào "Cần xác nhận" (gợi ý hotline, đề xuất giờ mới): trừ 2 mỗi chỗ.

## 3. Đúng loại việc và cách trả kết quả (12 điểm)

Theo bảng "Trả kết quả" của `SKILL.md`: báo cáo rà soát theo `references/review-reports.md`, tệp Word dựng bằng
`scripts/report-docx.mjs`, xuất PDF xem từng trang trước khi đưa; quy trình bước 5 và 6.

| Ý | Điểm | Cách trừ |
|---|---|---|
| Loại việc | 3 | dùng bộ nhãn đối chiếu nội dung (Trên site hoặc Hiện trạng, Tài liệu gốc, Cần xác nhận). Dùng bộ nhãn báo lỗi code (Chỗ bị, Thấy lại, Cách sửa) hay viết thành văn xuôi không nhãn: 0 |
| Dựng Word bằng `scripts/report-docx.mjs` | 3 | có tệp JSON nội dung và tệp docx do script sinh. Dựng bằng công cụ khác mà không nói lý do: 0; có lý do hợp lý (script lỗi, ghi lỗi nguyên văn): 2 |
| Xuất PDF, xem từng trang | 2 | `notes.md` hay lời trả nói đã xuất PDF và xem trang nào, sửa gì. Không xuất: 0. Xuất mà không có dấu vết đã xem: 1 |
| Chạy `node scripts/lint.mjs` | 1 | không chạy và không nói vì sao: 0 |
| Lời trả trong chat | 3 | ngắn, nói đường dẫn tệp, đã kiểm gì bằng cách nào, chưa kiểm gì, chỗ chưa chắc. Trừ 1 mỗi thứ: thiếu đã kiểm, thiếu chưa kiểm, có khen hay chấm điểm hay ước lượng thời gian, chép lại cả báo cáo vào chat |

## 4. Cấu trúc theo luật báo cáo rà soát (20 điểm)

| Ý | Điểm | Cách trừ |
|---|---|---|
| Mở đầu | 3 | một đoạn ngắn nói kiểm cái gì và lúc nào (bản staging lưu 9:00 ngày 12/11/2026), đối chiếu tài liệu nào, quy ước khung đỏ trong ảnh. Thiếu mỗi thứ trừ 1 |
| Tài liệu đã nhận | 2 | mỗi tệp một dòng nói tệp chứa gì. Chỉ chép tên tệp hay chép trạng thái của bảng theo dõi: 0 |
| Mục và tên mục | 4 | mục đánh số, một mục một chỗ sai, tên mục là câu khẳng định có chi tiết. Trừ 1 mỗi tên mục kiểu nhãn ("Vấn đề về giá", "Giờ làm việc"); trừ 1 mỗi mục gộp hai chỗ sai khác gốc (ví dụ gom F4, F5, F6 vào một mục "giá sai") |
| Nhãn cố định | 2 | cùng bộ nhãn, cùng thứ tự ở mọi mục. Trừ 1 mỗi mục lệch bộ nhãn, tối đa trừ 2 |
| Nặng tới nhẹ | 3 | nhóm địa chỉ, giờ, giá, tiêm chủng đứng trước nhóm bác sĩ; F12 đứng cuối. Một mục nhóm bác sĩ hay F12 đứng trước F1, F2 hoặc F3: 0. Lệch nhẹ khác: trừ 1 mỗi chỗ |
| Trích và vị trí | 3 | lời trích trong ngoặc kép đúng từng chữ, nói nằm ở đâu (trang nào, khối nào; tệp nào, mục hay dòng nào, mã dòng bảng theo dõi). Trừ 1 mỗi lời trích sai chữ hay không có vị trí, tối đa trừ 3 |
| Cần xác nhận | 1 | là câu hỏi BA trả lời được hay chuyển thẳng cho khách. Lời khuyên chung ("cần kiểm tra lại"): 0 |
| Phần thiếu | 2 | xếp theo trang web, mỗi dòng nói đã có gì, thiếu gì, kèm mã dòng (B1, B2, C1, C2, D1, A3). Xếp theo tên tệp: 0; thiếu mã dòng: trừ 1 |

Trừ thêm trong mục này, không giới hạn bởi điểm từng ý: đoạn khen hay phần "điểm tốt", bảng chấm điểm, ma trận ưu tiên,
ước lượng thời gian sửa, đoạn kết chung chung ("Trên đây là…", "Kính mong…"), đề xuất ngoài phạm vi rà soát: trừ 2 mỗi thứ.

## 5. Ảnh (6 điểm)

Web là tệp trên máy nên chụp được; luật "mỗi điểm có ảnh hai phía nếu có thể" áp dụng.

| Ý | Điểm | Cách trừ |
|---|---|---|
| Ảnh web cho các mục nặng | 2 | có ảnh chụp trang web cho F1, F2, F3 và ít nhất một mục giá. Thiếu mỗi mục trừ 1 |
| Khung đỏ | 1 | khung đỏ đóng đúng dòng hay ô được nêu, ảnh cắt sát mà còn đủ chữ quanh để biết vị trí. Khung đóng cả trang hay không có khung: 0 |
| Ảnh phía nguồn | 1 | có ảnh cắt từ `facade-photo.png` cho F3 hoặc F7, khung đỏ đúng dòng |
| Chú thích | 1 | mỗi ảnh có chú thích nói lấy ở đâu và khung đỏ đánh dấu gì |
| Ảnh dùng được | 1 | không ảnh trống vì hiệu ứng hiện dần, không ảnh lặp (dùng lại thì ghi "ảnh ở mục N"), lời trích khớp chữ thấy trong khung |

Không có ảnh nào: mục này 0, trừ khi bài nói rõ vì sao không chụp được và lý do đúng (khi đó 1).

## 6. Giọng và độ lưu loát (15 điểm)

Đọc tuần tự từng câu của đoạn mở đầu, phần tài liệu đã nhận, thân mọi mục, phần thiếu, chú thích ảnh; với mỗi câu hỏi:
câu này có nối và dựa trên câu trước không (lặp từ khoá, "này, đó, ấy", từ nối đúng quan hệ, mốc), che câu trước thì câu
này còn đứng một mình được không. Không quét cả bài một lúc rồi chấm. Mỗi lỗi trừ ghi câu trích.

| Lỗi | Trừ |
|---|---|
| Xưng hô trong báo cáo ("mình", "chúng tôi", "em", "bạn", "anh chị", "quý khách") | 3 mỗi chỗ |
| Dấu gạch dài hay gạch vừa ở bất cứ đâu (thân, tên mục, bảng, chú thích ảnh, tên tệp, lời trả chat) | 3 mỗi chỗ |
| Tiếng Việt không dấu | 3 |
| Văn máy: "đóng vai trò", "không chỉ… mà còn…", "không phải X mà là Y" khi chưa ai nói X, "Hãy…", "Lưu ý rằng", "Đáng chú ý", "Nhìn chung", "Tóm lại", bộ ba cho đủ vần, chủ ngữ là "việc…", "cơ chế…", câu bị động danh từ hoá kiểu "việc cập nhật được thực hiện" | 2 mỗi chỗ |
| Văn mẫu: câu mở rào đón ("Báo cáo này nhằm…", "Nhằm đảm bảo chất lượng…"), câu kết khuôn | 2 mỗi chỗ |
| Liệt kê "một là, hai là", "thứ nhất, thứ hai" cho đủ | 2 mỗi chỗ |
| Câu chốt cuối đoạn hay cuối mục nhắc lại điều vừa nói ("Như vậy, web cần sửa…") | 2 mỗi chỗ |
| Câu rời: trong cùng một đoạn, câu sau không nối câu trước | 1 mỗi chỗ |
| Chữ nhấn thừa: "đúng" (dùng để nhấn), "thật sự", "chính là", "hoàn toàn", "rất", "rõ ràng" | 1 mỗi chỗ |
| Một thứ nhiều tên trong cùng bài (web, site, trang, staging lẫn lộn; tài liệu gốc, nguồn, hồ sơ lẫn lộn mà không chốt) | 1 mỗi cặp |
| Viết tắt không giải nghĩa ở lần đầu (CCHN, BA được phép vì người nhận dùng) | 1 mỗi từ |
| Ký hiệu trong câu văn: mũi tên, dấu tick, emoji, `&`, `=`, `~`; in hoa cả chữ để nhấn | 1 mỗi chỗ |

## 7. Hình thức tệp Word (7 điểm)

Người chấm giữ khóa `evals/.word-lock`, xuất PDF bằng Word, xem ảnh từng trang, nhả khóa.

| Ý | Điểm | Cách trừ |
|---|---|---|
| Phông và đề mục | 1 | một phông có đủ dấu (Arial), thân 11, tối đa hai cấp đề mục |
| Trang | 1 | A4, lề khoảng 2 cm |
| Nhãn và danh sách | 1 | chỉ bộ nhãn cố định in đậm; gạch đầu dòng là định dạng danh sách của Word, không gõ ký tự chấm tròn |
| Ảnh và chú thích | 2 | ảnh không tràn lề, rộng không quá bề ngang chữ; chú thích ngay dưới ảnh, nghiêng, nhỏ, xám, cùng trang với ảnh. Trừ 1 mỗi ảnh tràn hay chú thích rơi sang trang sau |
| Ngắt trang | 1 | không trang trống, không đề mục nằm cuối trang mà nội dung ở trang sau, bảng không vỡ cột |
| Tệp | 1 | mở được bằng Word không báo lỗi, dưới khoảng 5 MB |

## Mốc tham chiếu

Một bài trung bình, ví dụ không mở ảnh ghi chú (trần 85, mất F3, nửa F7, phần tài liệu đã nhận), gom ba giá vào một mục,
không chụp ảnh, có hai ba chữ nhấn thừa và một câu chốt, rơi vào khoảng 75 tới 80. Bài đạt 95 phải có đủ mười hai ý, đọc
ghi chú tay, giữ được mức chắc chắn ở mọi chỗ chưa có nguồn, có ảnh hai phía cho các mục nặng, và không còn lỗi giọng nào
quá hai điểm.
