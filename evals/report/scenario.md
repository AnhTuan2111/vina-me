# Đề nhóm report: rà soát web phòng khám Hòa An so với tài liệu khách gửi

Lời yêu cầu nằm ở `prompt.md`. Mọi dữ kiện là giả: phòng khám, thành phố K, bác sĩ, số giấy phép, số chứng chỉ, hotline.

## Đề thử gì của skill

- Mảng báo cáo rà soát của `references/review-reports.md`: đọc hết nguồn trước khi viết, không tin tên tệp và trạng thái
  trong bảng theo dõi, mở đầu đủ ba thứ, phần "Tài liệu đã nhận" nói tệp thật sự chứa gì, mỗi điểm một mục đánh số xếp
  nặng tới nhẹ, tên mục là câu khẳng định, nhãn cố định Trên site, Tài liệu gốc, Cần xác nhận, trích nguyên văn giữ lỗi
  chính tả của bản gốc, ghi nguồn tự mâu thuẫn mà không chọn hộ, đánh giá "nói quá" kèm lý do, phần thiếu theo trang web
  kèm mã dòng, ảnh hai phía có khung đỏ, không đoạn kết, không khen.
- `references/citations-data-figures.md`: trích đúng từng chữ, nói đúng mức chắc chắn, không suy quá nguồn.
- Bảng "Trả kết quả" của `SKILL.md`: báo cáo rà soát theo `review-reports.md`, tệp Word dựng bằng `scripts/report-docx.mjs`,
  xuất PDF xem từng trang trước khi đưa; lời trả trong chat nói đã kiểm gì, chưa kiểm gì.
- Giọng: người dùng dặn "chỉ báo cáo thôi ko xưng hô gì", báo cáo gửi cả nhóm BA, nên không xưng hô, chủ ngữ là vật hay
  trang.

## Tệp vào

`inputs/site/` là web bản staging lưu lúc 9:00 ngày 12/11/2026, bốn trang: `index.html` (Trang chủ), `services.html` (Bảng
giá), `doctors.html` (Đội ngũ bác sĩ), `contact.html` (Liên hệ). Thanh trên cùng (giờ làm việc, hotline) và chân trang (địa
chỉ, giấy phép, hotline, email) lặp ở cả bốn trang. Bảng giá, ô số liệu trang chủ, thẻ bác sĩ có hiệu ứng hiện dần khi
cuộn (`reveal.js`): chụp ảnh mà không cuộn thì các hàng đó trống.

`inputs/source/`:

| Tệp | Thật sự chứa gì |
|---|---|
| `operating-license.txt` | bản đánh máy lại Giấy phép hoạt động số 318/K-GPHĐ, Sở Y tế tỉnh K cấp ngày 14/3/2024: địa chỉ Số 27 đường số 9; người chịu trách nhiệm chuyên môn BS.CKII Lương Thị Hạnh, CCHN 001873/K-CCHN; sáu dòng phạm vi chuyên môn (không có tiêm chủng); giờ làm việc 07:00 tới 19:30 thứ Hai tới thứ Bảy, Chủ nhật 07:00 tới 11:30 |
| `price-list-2026-10.csv` | bảng giá áp dụng từ 01/10/2026, thay bảng 01/03/2025, 12 dịch vụ; dòng 10 viết sai chính tả "Nội soi đại tràn gây mê", 2.100.000 |
| `price-list-2025-03.csv` | bảng giá cũ áp dụng từ 01/03/2025, chỉ để đối chiếu |
| `doctors-full-list.md` | sáu bác sĩ cập nhật 20/10/2026; hai người (Phạm Thu Ngân, Đặng Văn Khoa) để trống số CCHN, ghi chú "sẽ gửi bổ sung sau" |
| `facade-photo.png` | không phải ảnh mặt tiền: ảnh chụp tờ ghi chú viết tay ký "Hạnh 28/10" (không ghi năm), ba ý: từ 1/11 nghỉ Chủ nhật, chỉ trực điện thoại; bỏ mục tiêm chủng trên web, phòng khám chưa làm dịch vụ này; ảnh mặt tiền chụp lại xong gửi sau |
| `tracking-sheet.csv` | bảng theo dõi tám dòng A1 tới D1; A3 và B1 ghi "Đã nhận" dù tệp thiếu hoặc sai thứ; B2, C1, C2, D1 "Chưa nhận" |

## Đáp án dữ kiện

Thứ tự gợi ý từ nặng tới nhẹ. Nhóm nặng (thông tin người bệnh dựa vào: địa chỉ, giờ, giá, dịch vụ có làm hay không) phải
đứng trước nhóm bác sĩ, lỗi chính tả đứng cuối. Thứ tự bên trong một nhóm được linh động.

| Mã | Chỗ sai | Trên site | Tài liệu gốc |
|---|---|---|---|
| F1 | Số nhà sai | Liên hệ và chân trang mọi trang: "Số 72 đường số 9, phường Tân Lộc" | giấy phép mục 3: "Số 27 đường số 9" |
| F2 | Giờ đóng cửa ngày thường ở thanh trên cùng sai | thanh trên cùng mọi trang: "Thứ Hai - Thứ Bảy: 7:00 - 19:00"; riêng trang Liên hệ ghi "7:00 - 19:30", tức web tự lệch | giấy phép mục 6: "từ 07 giờ 00 đến 19 giờ 30" |
| F3 | Giờ Chủ nhật: hai nguồn mâu thuẫn | thanh trên cùng và Liên hệ: "Chủ nhật: 7:00 - 11:30"; trang chủ ô "Mở cửa 7 ngày" | giấy phép: Chủ nhật 07:00 tới 11:30; ghi chú tay: "Từ 1/11 phòng khám nghỉ Chủ nhật, chỉ trực điện thoại." Không chọn hộ, hỏi BA bên nào áp dụng |
| F4 | Giá Khám phụ khoa sai | 180.000đ | bảng 01/10/2026 dòng 3: 200.000; trùng bảng cũ 2025 |
| F5 | Giá Nội soi dạ dày gây mê sai, cùng gốc với F4 | 1.500.000đ | bảng 01/10/2026 dòng 9: 1.650.000; trùng bảng cũ |
| F6 | Giá Nội soi đại tràng gây mê sai, không trùng bảng nào | 2.000.000đ | bảng 01/10/2026 dòng 10 "Nội soi đại tràn gây mê" 2.100.000 (bảng cũ 1.900.000); trích phải giữ chữ "đại tràn" |
| F7 | Web có dịch vụ tiêm chủng mà nguồn không có | Bảng giá: "Tiêm chủng vắc xin cho trẻ", giá "Liên hệ" | không có trong phạm vi chuyên môn của giấy phép, không có trong bảng giá; ghi chú tay: "Bỏ mục tiêm chủng trên web, PK chưa làm dịch vụ này." |
| F8 | Chức danh BS Hạnh sai ở hai chỗ, cùng gốc | Đội ngũ bác sĩ thẻ 1 và trang chủ khối Giám đốc chuyên môn: "BS.CKI Lương Thị Hạnh" | giấy phép mục 4 và danh sách bác sĩ dòng 1: "BS.CKII" |
| F9 | Số CCHN của BS Phước sai | "004215/K-CCHN" | danh sách dòng 2: "004512/K-CCHN" |
| F10 | Bác sĩ không có trong danh sách | thẻ "BS.CKII Trần Minh Đức, Trưởng khoa Nhi", CCHN 000957/K-CCHN | danh sách sáu người không có tên này |
| F11 | "Hơn 20 bác sĩ đầu ngành" nói quá | trang chủ ô số liệu | danh sách có sáu bác sĩ, chính trang Đội ngũ có bảy thẻ; không nguồn nào có ý "hơn 20", "đầu ngành" |
| F12 | Lỗi chính tả trên web | Bảng giá: "Xét nghiệm công thức mấu" | bảng giá dòng 11: "Xét nghiệm công thức máu" |

Phần "Tài liệu đã nhận" phải nói đúng: `facade-photo.png` là ghi chú tay chứ không phải ảnh mặt tiền dù bảng theo dõi B1
ghi "Đã nhận"; `doctors-full-list.md` thiếu CCHN của hai bác sĩ dù A3 ghi "Đã nhận"; bảng giá 2025 là bảng cũ.

Phần thiếu, theo trang web, kèm mã dòng:

- Thanh trên cùng, Liên hệ, chân trang: hotline "1900 6868 27" và email "lienhe@pkhoaan.vn" chưa có nguồn (C1 Chưa nhận).
- Liên hệ: link "Xem bản đồ" trỏ tọa độ 10.7769, 106.7009, chưa có nguồn (C2 Chưa nhận).
- Trang chủ: "Thành lập năm 2009", "Hơn 15.000 lượt khám mỗi năm", "hơn 25 năm kinh nghiệm" chưa có nguồn (D1 Chưa nhận).
- Trang chủ: ảnh mặt tiền chưa có (B1 ghi "Đã nhận" nhưng tệp là ghi chú, ghi chú nói sẽ gửi sau); ảnh phòng khám và thiết
  bị chưa có (B2).
- Đội ngũ bác sĩ: số CCHN "002641/K-CCHN" của BS Phạm Thu Ngân và "006118/K-CCHN" của BS Đặng Văn Khoa trên web chưa có
  nguồn để đối chiếu (A3).

Các ý F11 và các dòng "chưa có nguồn" được phép đặt thành mục đánh số có nhãn đủ thay vì nằm ở phần thiếu; miễn là có mặt
và không bị gọi là sai.

## Không phải lỗi (báo là lỗi thì bị trừ)

- X-quang ngực thẳng 120.000đ: khớp bảng 01/10/2026 (bảng cũ ghi 100.000, bẫy đọc nhầm bảng).
- Các giá còn lại (khám nội, khám nhi, khám thai, siêu âm, nội soi không gây mê, gói khám): khớp bảng mới.
- Chân trang "cấp ngày 14/3/2024" so với "ngày 14 tháng 3 năm 2024": cùng một ngày, khác cách viết.
- "7:00" so với "07 giờ 00", "150.000đ" so với "150000": khác cách viết.
- BS Vũ Thị Lan Anh, BS Hồ Minh Quân: khớp chức danh và số CCHN.
- Tên dịch vụ "Khám phụ khoa", "Khám thai" trên web khớp bảng giá.

## Không được bịa hay suy quá nguồn

- Không đưa số hotline, email, tọa độ, năm thành lập "đúng"; nguồn không có.
- Không kết luận "năm 2009 sai vì giấy phép cấp năm 2024": ngày cấp giấy phép không phải năm thành lập.
- Không khẳng định tọa độ bản đồ sai, không khẳng định CCHN của BS Ngân, BS Khoa sai: chưa có nguồn.
- Không tự chọn giấy phép hay ghi chú tay là đúng cho giờ Chủ nhật.
- Không nói web "vi phạm pháp luật", "có thể bị phạt" vì mục tiêm chủng: nguồn không nói, chỉ được nói dịch vụ không có
  trong phạm vi chuyên môn ghi ở giấy phép.
- Không viết ngày ghi chú thành "28/10/2026" như thể nguồn ghi năm; không khẳng định người ký là BS Lương Thị Hạnh, chỉ
  được nói ghi chú ký "Hạnh".
- Không khẳng định web lấy nhầm bảng giá cũ như một sự thật đã kiểm; được nói giá trùng bảng cũ, hoặc đoán có nói là đoán.
- Không thêm giờ kiểm khác 9:00 ngày 12/11/2026 cho bản staging (được ghi thêm giờ mở tệp để chụp ảnh nếu nói rõ).

## Bẫy đã cài

1. Tên tệp đánh lừa: `facade-photo.png` là ghi chú tay mang hai dữ kiện quan trọng (F3, F7). Không mở ảnh thì mất F3,
   một phần F7, và phần "Tài liệu đã nhận" sai.
2. Trạng thái bảng theo dõi sai: A3, B1 "Đã nhận" mà thiếu hoặc sai thứ.
3. Hai bảng giá: X-quang khớp bảng mới khác bảng cũ; F4, F5 trùng bảng cũ; F6 không trùng bảng nào, nên không được gom
   cả ba vào "dùng bảng cũ".
4. Nguồn tự mâu thuẫn ở giờ Chủ nhật.
5. Web tự lệch giữa thanh trên cùng (19:00) và trang Liên hệ (19:30).
6. Lỗi chính tả ở nguồn ("đại tràn") phải giữ nguyên khi trích; lỗi chính tả ở web ("mấu") là một mục nhẹ.
7. Một lỗi ở hai chỗ (F8; F1 ở Liên hệ và chân trang) để thử luật "một mục một chỗ sai, cùng gốc thì tách và ghi cùng gốc"
   hoặc nêu đủ mọi vị trí.
8. Hiệu ứng hiện dần khi cuộn: ảnh chụp bảng giá, thẻ bác sĩ, ô số liệu phải cuộn trước khi chụp.
9. Câu nói quá trên trang chủ cùng các con số không nguồn, để thử luật đánh giá kèm lý do và mức chắc chắn.
10. Lời yêu cầu viết thường, thiếu dấu câu, "ko xưng hô gì": bài vẫn phải viết tiếng Việt có dấu, không xưng hô.
