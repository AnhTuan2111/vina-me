# Hình thức hồ sơ: đo từ mẫu, dựng theo mẫu

Hồ sơ cũ là chuẩn hình thức. Kiểu đoạn (style) không đủ để biết nó trông thế nào, vì người làm hồ sơ hay chỉnh tay đè lên:
đề mục "1." mang kiểu Heading 1 nhưng được chỉnh từ cỡ 16 căn giữa về cỡ 13 căn trái. Nên đo định dạng thực tế, và dựng bằng
`bid-docx.mjs` với chính tệp mẫu làm khuôn: script học định dạng thực tế của từng loại đoạn trong mẫu rồi dùng lại.

## Đo một hồ sơ mẫu

```bash
node scripts/bid/docx-profile.mjs <mẫu.docx>          # section, phông, định dạng từng loại đoạn, bảng, ảnh, dàn đề mục
pwsh -NoProfile -File scripts/bid/render-pdf.ps1 -OutDir work/sample <mẫu.docx>  # Word xuất PDF nguyên trạng, ghi ra thư mục làm việc
pdftoppm -r 60 -png <mẫu.pdf> page                 # ảnh từng trang
```

Xem ảnh đủ sáu loại trang: bìa, mục lục, trang mở phần lớn, trang thân bài có gạch đầu dòng, trang bảng, trang tiến độ, trang
cam kết. Ghi vào `02-sample.md` những gì đo được, theo các mục dưới.

## Hồ sơ mẫu của công ty (thuyết minh đề xuất kỹ thuật, 68 trang), đo ngày 09/11/2026

### Trang
- A4 dọc, lề trên 2, phải 2, dưới 3, trái 3 cm. Không đầu trang. Số trang giữa chân trang.
- Section 1 (bìa tới hết phần A) có "trang đầu khác": bìa không in số. Mục lục là trang 2.
- Phần tiến độ là section A4 ngang, lề trên 2,75, phải 2, dưới 0,75, trái 2 cm.
- Phần F và các bản cam kết là section cuối, lề dưới 1 cm, không in số trang.

### Chỗ skill cố ý làm khác mẫu

Bảng thường dựng theo kiểu "clean" của `bid-docx` (xem `docx-json.md`, `tableStyle`) thay cho bảng viền đen dày, tiêu đề nền xám
nhạt của mẫu: người dùng duyệt kiểu này ngày 10/11/2026 ("không cần phải theo ý bản tham khảo BA gửi 100% mà mình có thể làm
tốt hơn bằng cách khắc phục điểm yếu của họ"). Ngày 10/11/2026 người dùng duyệt thêm (xem trang so sánh, "ổn đấy"):
- Mục lục: tài liệu con (I, II...) chữ thường, không đậm trong mục lục, trên trang vẫn in hoa nhờ kiểu đoạn; dòng thứ hai của mục
  dài thụt thẳng sau "A. ", "II. "; mục cha cách trên 6pt (`tocStyle`). Mẫu gõ sẵn chữ hoa nên mục con trông to hơn mục cha.
- Bìa: khung viền đôi xanh đậm chỉ ở trang bìa, tên tài liệu cùng màu, dòng nhà thầu dài ngắt hai dòng cân nhau (`coverStyle`).
- Bảng tiến độ theo ngày: ô ngày tô xanh, không ghi số 1 trong ô (mẫu tô cam, ô nào cũng ghi 1).
- Đoạn sau bảng cách mép dưới bảng 8pt; bản cam kết in đậm cả mấy dòng tên công ty.
Phông, cỡ chữ, lề, đề mục, trang ngang, khối ký vẫn theo mẫu. Những lỗi bố cục mẫu mắc (đề mục cuối trang, trang gần trắng)
skill không chép theo.

### Bìa
- "NHÀ THẦU: <TÊN CÔNG TY VIẾT HOA>" đậm cỡ 14, căn giữa, dòng đầu trang.
- "GÓI THẦU SỐ ..." đậm cỡ 16, cách trên 7,4 cm; dòng tên gói đậm cỡ 13 ngay dưới.
- "<Nơi>, <năm>" đậm, cách trên 10,6 cm, cuối trang.

### Mục lục
- "MỤC LỤC" đậm, căn trái. Hai cấp: phần lớn (A tới F) đậm; tài liệu con (I tới IV) thụt lề, chữ thường. Dấu chấm dẫn tới số
  trang. Đề mục "1.", "1.1." không vào mục lục.

### Đoạn (Times New Roman cho toàn bộ)
| Loại | Định dạng |
|---|---|
| Phần lớn "A. YÊU CẦU KỸ THUẬT ..." | cỡ 16, đậm, viết hoa, căn giữa, sang trang mới |
| Tài liệu con "I. THUYẾT MINH ..." | cỡ 14, đậm, chữ gõ hoa, căn giữa; sang trang mới, trừ khi đứng ngay sau phần lớn |
| Đề mục cấp 1 "1. GIỚI THIỆU PHẦN MỀM" | cỡ 13, đậm, viết hoa, căn trái, cách trên 18pt |
| Đề mục cấp 2 "1.1. Tên phần mềm" | cỡ 13, đậm, căn trái, cách trên 14pt, dưới 6pt |
| Đoạn văn | cỡ 13, căn đều hai bên, giãn dòng 1,5, cách sau 10pt |
| Nhãn đậm "a) Tiêu chuẩn về kết nối" | như đoạn văn, đậm, giữ cùng trang với đoạn sau |
| Gạch đầu dòng | dấu "•", thụt 0,8 cm, treo 0,5 cm, giãn dòng 1,3, cách sau 4pt; thường mở bằng nhãn đậm và dấu hai chấm |
| Chú thích hình "Hình 1: ..." | nghiêng, căn giữa, ngay dưới hình |

### Bảng
- Rộng 16 cm (bằng bề ngang chữ), viền đơn đen 0,75pt, lề ô trái phải 0,14 cm.
- Hàng tiêu đề nền xám E7E7E7, chữ đậm căn giữa, lặp lại khi sang trang. Chữ trong bảng cỡ 12, giãn dòng đơn.
- Cột STT căn giữa; hàng nhóm (A, B, I) đậm; hàng không bị cắt ngang trang.
- Loại bảng và tỉ lệ cột hay dùng:

| Bảng | Tỉ lệ cột (%) |
|---|---|
| Nội dung, Đáp ứng | 32, 68 |
| Tiêu chuẩn, Đáp ứng | 32, 68 |
| Tiêu chí, Mức độ, Diễn giải | 28, 15, 56 |
| STT, Chuyên đề, Nội dung | 7, 33, 60 |
| STT, Vị trí, Yêu cầu năng lực, Nhiệm vụ | 7, 21, 36, 36 |
| STT, Nội dung công việc, Đơn vị tính, Khối lượng, Tổng số ngày, Kết quả | 7, 28, 12, 11, 14, 28 |
| Kênh tiếp nhận, Thông tin | 30, 70 |
| Loại yêu cầu, Thời gian đáp ứng | 43, 57 |
| Lớp, Tên lớp, Nhóm học viên, Thời lượng, Thời gian | 7, 25, 19, 32, 17 |

  Tiêu đề cột ngắn mà nhiều tiếng ("Đơn vị tính", "Tổng số ngày") cần khoảng 11-12% để không xuống mỗi dòng một tiếng;
  `bid-docx` in dòng `SỬA` khi một tiêu đề cột bị xếp như thế.

### Hình
- Rộng 16 cm, căn giữa, không khung; chú thích ngay dưới. Hình là sơ đồ dựng sẵn (kiến trúc, mô hình triển khai).

### Tiến độ và cam kết
Xem `schedule-letters.md`; `bid-docx.mjs` có sẵn khối `gantt` và `letter` dựng đúng các số đo đó.

### Tài liệu kỹ thuật sản phẩm (54 trang) khác thuyết minh ở
- một section, lề dưới 1 cm; bìa: tên công ty phát triển đậm cỡ 14 trên cùng, tên tài liệu đậm cỡ 16 cách trên 6,35 cm, dòng
  tên sản phẩm đậm cỡ 13;
- mục lục hai cấp, cỡ 12; trang nội dung đầu nhắc lại tên tài liệu đậm cỡ 14 căn giữa;
- có đề mục cấp 3; sơ đồ quy trình dạng làn đứng (rộng 8-12 cm, cao 13-20 cm).

## Khi dựng xong

Chạy `node scripts/bid/docx-profile.mjs --compare <mẫu.docx> <bản dựng.docx>`: từ 95% thuộc tính khớp mới đạt. Rồi xuất PDF bản
dựng, đặt từng loại trang cạnh trang mẫu cùng loại và xem bằng mắt: bìa có vừa một trang không, mục lục có đủ hai cấp không,
bảng có tràn lề không, tiến độ có xoay ngang không, bản cam kết có vừa một trang không.
