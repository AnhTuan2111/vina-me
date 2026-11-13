# Viết phần kỹ thuật của hồ sơ dự thầu

Người chấm hồ sơ đi từng tiêu chí của E-HSMT, tìm chỗ nhà thầu đáp ứng và tài liệu chứng minh; thiếu một tiêu chí cơ bản là
hồ sơ bị loại. Hồ sơ cũ của công ty là bản đối chứng về hình thức và cách viết, không phải về nội dung. Nên việc chia làm hai
nửa: đọc cho đúng và đủ, rồi viết và dựng tệp cho giống hồ sơ cũ.

Mọi thứ đọc vào là tài liệu nội bộ. Không đưa nội dung lên dịch vụ ngoài, repo công khai, issue. Chỗ skill hướng dẫn sai hay
script lỗi thì vẫn ghi vào sổ góp ý (`references/feedback.md`, mục Sổ góp ý trong lúc làm), bằng chữ chung, không kèm nội dung hồ sơ. Tìm tài liệu hãng trên mạng
chỉ bằng tên sản phẩm, mã model, tên linh kiện.

## Quy trình

Làm đủ các bước, theo thứ tự. Mỗi bước có tệp kết quả trong thư mục làm việc (ví dụ `work/`), để BA và người soát xem lại.

1. **Đọc bộ tài liệu như người đọc thật** (`references/bid/reading.md`). Kiểm kê từng tệp; trích chữ; xem ảnh từng trang của
   bảng yêu cầu, biểu phạm vi, tệp quét; đối chiếu chéo giữa các tệp. Kết quả `00-reading.md`: thông tin gói, nhà thầu
   (lấy từ giấy tờ nhà thầu, không lấy từ hồ sơ cũ), phạm vi và số lượng, tiêu chí đánh giá, điều kiện hợp đồng, chỗ HSMT
   tự lệch, chỗ bản chữ trích sai. BA có gửi tệp trả lời, ghi chú (vai các công ty, địa chỉ dùng, công nghệ, model) thì đó là
   nguồn cao nhất cho điều BA chốt: ghi nguồn "BA, <ngày>", dùng đúng chữ BA, không thêm chi tiết BA không nêu, và chỉ bỏ đánh
   dấu ở đúng chỗ BA đã trả lời; điều BA nói "chưa có" thì vẫn đánh dấu.
2. **Bảng truy vết** (`references/bid/traceability.md`): mỗi yêu cầu một dòng, nguồn, mức, mục sẽ đáp ứng, tài liệu chứng minh,
   trạng thái. Kết quả `01-traceability.md`.
2b. **Tài liệu hãng** (`references/bid/package.md`): với mỗi thiết bị, lấy tài liệu BA gửi; thiếu thông số hay thiếu cả tài liệu thì
   tìm, tải tài liệu chính thức của hãng và hãng linh kiện (`scripts/bid/fetch-doc.mjs`), ghi `tl/sources.md`. Cập nhật cột chứng minh
   của bảng truy vết theo tài liệu tìm được; thông số vẫn không có tài liệu thì ghi vào danh sách giấy tờ phải xin.
3. **Phân tích bản đối chứng** (`references/bid/house-style.md`): chạy `node scripts/bid/docx-profile.mjs <mẫu.docx>`, xuất mẫu ra
   PDF và xem ảnh các trang tiêu biểu; đọc hết chữ. Kết quả `02-sample.md`: dàn mục, định dạng từng loại đoạn, loại bảng
   và tỉ lệ cột, cách viết từng mục, chỗ mẫu sai không chép theo. Không có hồ sơ mẫu thì `02-sample.md` ghi rõ điều đó và
   dùng số đo, dàn mục, câu mẫu đã ghi trong `house-style.md`, `outline.md`, `writing.md`; bước 6 bỏ `--template` để dựng bằng
   khuôn dựng sẵn (mang số đo của hồ sơ mẫu).
4. **Dàn mục** (`references/bid/outline.md`, `references/bid/package.md`): danh sách tệp KT-00 tới tệp cuối và mã của từng tệp; thuyết
   minh có phần lớn theo đúng tên, thứ tự tiêu chí của HSMT đang làm; đối chiếu với dàn mục của mẫu, ghi chỗ thêm, bớt, đổi. Kết
   quả `03-outline.md`.
5. **Viết nội dung**, mỗi tệp một `content-<mã>.json`, theo `references/bid/writing.md`, `references/bid/goods.md` (bảng đáp ứng),
   `references/bid/package.md` (bộ tệp, bản dịch, liên danh), `references/bid/software.md` (phần mềm), `references/bid/schedule-letters.md`
   (tiến độ, bản cam kết). Cấu trúc JSON ở `references/bid/docx-json.md`. Mỗi tài liệu gốc của hãng một `marks-<mã>.json` (chữ cần tô).
6. **Dựng**: `node scripts/bid/bid-docx.mjs content-<mã>.json "<mã> <tên>.docx" --template <mẫu.docx>` cho từng tệp (không có mẫu thì
   bỏ `--template`); `node scripts/bid/pdf-highlight.mjs <gốc.pdf> marks-<mã>.json "<mã> <tên>.pdf"` cho từng tài liệu hãng.
7. **Soát** (`references/bid/checks.md`), lặp lại bước 5, 6, 7 tới khi sạch:
   - `bid-docx.mjs` không còn dòng `SỬA` (đề mục gõ hoa, bảng thiếu câu mở, cột quá hẹp);
   - `bid-check.mjs` cho từng tệp Word (kèm `--catalog <mã>=<pdf>`, `--highlight <mã>=<marks>`, `--sample`): sửa mọi `LỖI` trừ
     chỗ đánh dấu, xử lý từng dòng `XEM`;
   - `package-check.mjs <thư mục bộ tệp>`: mã dẫn chéo có tệp, mục được dẫn có thật, KT-00 kê đủ;
   - `docx-profile.mjs --compare <mẫu> <thuyết minh>` từ 95% thuộc tính khớp (dòng lệch "bản cam kết" là bình thường vì bản cam
     kết nằm ở tệp riêng);
   - xuất PDF bằng Word (`scripts/bid/render-pdf.ps1 -UpdateDocx HSDX.docx`: mục lục cập nhật vào cả tệp Word giao BA),
     `page-check.mjs` không còn lỗi bố cục;
   - đặt ảnh trang của bản dựng cạnh trang mẫu cùng loại (bìa, mục lục, mở phần, bảng, tiến độ, cam kết) và sửa tới khi giống;
   - đi lại bảng truy vết;
   - soát cuối như người chấm: đi từng dạng lỗi trong mục "Soát cuối như người chấm" của `references/bid/checks.md`.
8. **Báo lại BA** (mục Báo lại trong `references/bid/checks.md`).

## Những điều không được làm

- Không bịa: thông số hàng hóa, số trang catalog, con số cam kết, tên người, số hợp đồng, ngày ký. Thiếu thì ghi
  `[cần xác nhận: ...]` và đưa vào danh sách hỏi BA. Một chỗ đánh dấu đúng tốt hơn một con số đẹp mà sai.
- Không chép nội dung riêng của gói cũ: tên chủ đầu tư, địa danh, tên nhà thầu và đơn vị phát triển, người ký, sản phẩm,
  thời hạn, tên gọi hồ sơ ("HSYC" của gói chào hàng cũ). Công ty, người ký của hồ sơ mẫu chỉ được dùng khi BA xác nhận họ tham
  gia gói này (thành viên liên danh), và khi đó lấy thông tin theo lời BA, giấy tờ của chính công ty đó.
- Không ghi "đáp ứng" khi tài liệu chứng minh không ghi thông số đó.
- Không gán cho catalog chữ mà trang được dẫn không có; không lấy bản cam kết của chính nhà thầu làm chứng minh thông số thiết bị.
- Không chép câu yêu cầu làm câu đáp ứng; không lấy "xác nhận của Nhà sản xuất khi Chủ đầu tư yêu cầu" làm chứng minh.
- Không lấy tài liệu từ trang bán lẻ, báo, diễn đàn; không vượt trang chặn tải tự động.
- Không để cam kết mới tự đặt (thời hạn, tần suất, số buổi) mà không đánh dấu và không báo BA.
- Không đổi tên hạng mục, tên gói, tên tiêu chí của HSMT; tên gói lấy theo quyết định phê duyệt khi các chương ghi khác nhau.
- Không dấu gạch dài, gạch vừa, mũi tên, emoji trong chữ của hồ sơ (chữ chép nguyên tài liệu hãng ở cột bản gốc, trong ngoặc
  kép thì giữ như hãng viết).

## Tệp tham khảo

| Tệp | Đọc khi |
|---|---|
| `references/bid/reading.md` | bước 1: kiểm kê, trích chữ, đọc ảnh, bẫy khi trích PDF |
| `references/bid/traceability.md` | bước 2 |
| `references/bid/house-style.md` | bước 3, 6: hình thức hồ sơ mẫu đo được, cách đo hồ sơ mẫu khác |
| `references/bid/outline.md` | bước 4: dàn mục theo tiêu chí, dàn mục mẫu, tài liệu kỹ thuật |
| `references/bid/writing.md` | bước 5: giọng, câu mẫu, số, văn bản pháp luật |
| `references/bid/goods.md` | bước 5: bảng đáp ứng thông số thiết bị |
| `references/bid/package.md` | bước 2b, 4, 5, 6: bộ tệp và mã, KT-01 đúng mẫu, tìm, tải, tô vàng, dịch tài liệu hãng, giấy tờ phải xin, liên danh |
| `references/bid/software.md` | bước 5: thuyết minh phần mềm, phi chức năng, an toàn thông tin, kiểm thử |
| `references/bid/schedule-letters.md` | bước 5: tiến độ theo ngày, bản cam kết, bảo hành, đào tạo |
| `references/bid/docx-json.md` | bước 5, 6: cấu trúc `content.json` |
| `references/bid/checks.md` | bước 7, 8 |

Script cần Node 18 trở lên, không cần cài gói npm. Xuất PDF cần Microsoft Word (Windows). `page-check.mjs`, `bid-check --catalog`,
`pdf-highlight.mjs` cần `pdftotext` của Poppler (script tự tìm trong PATH, bỏ qua bản xpdf kèm Git for Windows); xem ảnh trang cần
`pdftoppm`. `fetch-doc.mjs` in trang web bằng Edge hoặc Chrome có sẵn trên máy.
