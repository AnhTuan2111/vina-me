# Viết phần kỹ thuật của hồ sơ dự thầu

Người chấm hồ sơ đi từng tiêu chí của E-HSMT, tìm chỗ nhà thầu đáp ứng và tài liệu chứng minh; thiếu một tiêu chí cơ bản là
hồ sơ bị loại. Hồ sơ cũ của công ty là bản đối chứng về hình thức và cách viết, không phải về nội dung. Vì vậy việc làm hồ sơ
chia làm hai nửa: đọc cho chính xác và đủ, rồi viết và dựng tệp cho giống hồ sơ cũ.

Mọi thứ đọc vào là tài liệu nội bộ, nên nội dung không đưa lên dịch vụ ngoài, repo công khai hay issue. Chỗ skill hướng dẫn sai
hay script lỗi thì vẫn ghi vào sổ góp ý (`feedback.md`, mục Sổ góp ý trong lúc làm), bằng chữ chung, không kèm nội dung hồ sơ.
Tìm tài liệu hãng trên mạng thì chỉ tìm bằng tên sản phẩm, mã model, tên linh kiện.

Người giao việc là BA: người làm hồ sơ và nắm thông tin gói thầu, thường là nhân viên kinh doanh hay phân tích nghiệp vụ. Mọi
câu hỏi, mọi chỗ đánh dấu trong hồ sơ đều chờ người này trả lời.

## Quy trình

Quy trình có tám bước, làm đủ và theo thứ tự. Bước nào cũng để lại một tệp kết quả trong thư mục làm việc (ví dụ `work/`), để
BA và người soát xem lại.

1. **Đọc bộ tài liệu như người đọc thật** (`bid/reading.md`). Kiểm kê từng tệp, trích chữ, xem ảnh từng trang của bảng yêu cầu,
   biểu phạm vi, tệp quét, rồi đối chiếu chéo giữa các tệp. Kết quả là `00-reading.md`: thông tin gói, nhà thầu (lấy từ giấy tờ
   nhà thầu, không lấy từ hồ sơ cũ), phạm vi và số lượng, tiêu chí đánh giá, điều kiện hợp đồng, chỗ HSMT tự lệch, chỗ bản chữ
   trích sai. BA có gửi tệp trả lời, ghi chú (vai các công ty, địa chỉ dùng, công nghệ, model) thì đó là nguồn cao nhất cho điều
   BA chốt. Ghi nguồn "BA, <ngày>", giữ nguyên chữ BA dùng, không thêm chi tiết BA không nêu, và chỉ bỏ đánh dấu ở chỗ BA đã trả
   lời; điều BA nói "chưa có" thì vẫn đánh dấu.
2. **Bảng truy vết** (`bid/traceability.md`): mỗi yêu cầu một dòng, gồm nguồn, mức, mục sẽ đáp ứng, tài liệu chứng minh, trạng
   thái. Kết quả là `01-traceability.md`.
   - **2b. Tài liệu hãng** (`bid/package.md`): với mỗi thiết bị, lấy tài liệu BA gửi. Thiếu thông số hay thiếu cả tài liệu thì
     tìm, tải tài liệu chính thức của hãng và hãng linh kiện (`scripts/bid/fetch-doc.mjs`), ghi vào `tl/sources.md`. Cột chứng
     minh của bảng truy vết cập nhật theo tài liệu tìm được; thông số vẫn không có tài liệu thì ghi vào danh sách giấy tờ phải
     xin.
3. **Phân tích bản đối chứng** (`bid/house-style.md`): chạy `node scripts/bid/docx-profile.mjs <mẫu.docx>`, xuất mẫu ra PDF
   và xem ảnh các trang tiêu biểu, rồi đọc hết chữ. Kết quả là `02-sample.md`: dàn mục, định dạng từng loại đoạn, loại bảng
   và tỉ lệ cột, cách viết từng mục, chỗ mẫu sai không chép theo. Không có hồ sơ mẫu thì `02-sample.md` ghi rõ điều đó và
   dùng số đo, dàn mục, câu mẫu đã ghi trong `house-style.md`, `outline.md`, `writing.md`; khi đó bước 6 bỏ `--template` để
   dựng bằng khuôn dựng sẵn (mang số đo của hồ sơ mẫu).
4. **Dàn mục** (`bid/outline.md`, `bid/package.md`): danh sách tệp từ KT-00 tới tệp cuối và mã của từng tệp. Phần lớn thuyết
   minh đặt theo tên và thứ tự tiêu chí của HSMT đang làm; đối chiếu với dàn mục của mẫu, ghi chỗ thêm, bớt, đổi. Kết quả là
   `03-outline.md`.
5. **Viết nội dung**: mỗi tệp một `content-<mã>.json`, theo `bid/writing.md`, `bid/goods.md` (bảng đáp ứng), `bid/package.md`
   (bộ tệp, bản dịch, liên danh), `bid/software.md` (phần mềm), `bid/schedule-letters.md` (tiến độ, bản cam kết). Cấu trúc JSON
   ở `bid/docx-json.md`. Mỗi tài liệu gốc của hãng có một `marks-<mã>.json` ghi chữ cần tô.
6. **Dựng**: `node scripts/bid/bid-docx.mjs content-<mã>.json "<mã> <tên>.docx" --template <mẫu.docx>` cho từng tệp (không có
   mẫu thì bỏ `--template`); `node scripts/bid/pdf-highlight.mjs <gốc.pdf> marks-<mã>.json "<mã> <tên>.pdf"` cho từng tài
   liệu hãng.
7. **Soát** (`bid/checks.md`), lặp lại bước 5, 6, 7 tới khi sạch:
   - `bid-docx.mjs` không còn dòng `SỬA` (đề mục gõ hoa, bảng thiếu câu mở, cột quá hẹp);
   - `bid-check.mjs` cho từng tệp Word (kèm `--catalog <mã>=<pdf>`, `--highlight <mã>=<marks>`, `--sample`): sửa mọi `LỖI` trừ
     chỗ đánh dấu, xử lý từng dòng `XEM`;
   - `package-check.mjs <thư mục bộ tệp>`: mã dẫn chéo có tệp, mục được dẫn có thật, KT-00 kê đủ;
   - `docx-profile.mjs --compare <mẫu> <thuyết minh>` từ 95% thuộc tính khớp (dòng lệch "bản cam kết" là bình thường vì bản cam
     kết nằm ở tệp riêng);
   - xuất PDF bằng Word (`scripts/bid/render-pdf.ps1 -UpdateDocx HSDX.docx`, để mục lục cập nhật vào cả tệp Word giao BA), và
     `page-check.mjs` không còn lỗi bố cục;
   - đặt ảnh trang của bản dựng cạnh trang mẫu cùng loại (bìa, mục lục, mở phần, thân bài, bảng, tiến độ, cam kết) và sửa tới
     khi giống;
   - đi lại bảng truy vết;
   - soát cuối như người chấm: đi từng dạng lỗi trong mục "Soát cuối như người chấm" của `bid/checks.md`.
8. **Báo lại BA** (mục Báo lại trong `bid/checks.md`).

## Việc cấm

Hồ sơ dự thầu bị loại hay bị khiếu nại vì một con số sai, nên có những việc không được làm, dù làm thì hồ sơ trông đầy
đủ hơn.

Không bịa thông số hàng hóa, số trang catalog, con số cam kết, tên người, số hợp đồng, ngày ký. Thiếu thì ghi `[cần xác nhận:
...]` và đưa vào danh sách hỏi BA, vì một chỗ đánh dấu còn hơn một con số đẹp mà sai. Cam kết mới tự đặt (thời hạn, tần suất,
số buổi) cũng không được để trơn: chỗ nào có thì đánh dấu và báo BA.

Không chép nội dung riêng của gói cũ: tên chủ đầu tư, địa danh, tên nhà thầu và đơn vị phát triển, người ký, sản phẩm, thời
hạn, tên gọi hồ sơ ("HSYC" của gói chào hàng cũ). Công ty, người ký của hồ sơ mẫu chỉ được dùng khi BA xác nhận họ tham gia gói
này (thành viên liên danh), và khi đó thông tin lấy theo lời BA, giấy tờ của chính công ty đó.

Chứng minh phải có thật ở nguồn. Hồ sơ không ghi "đáp ứng" khi tài liệu chứng minh không ghi thông số đó, không gán cho catalog
chữ mà trang được dẫn không có, và không lấy bản cam kết của chính nhà thầu làm chứng minh thông số thiết bị. Câu yêu cầu không
được chép lại làm câu đáp ứng, và "xác nhận của Nhà sản xuất khi Chủ đầu tư yêu cầu" không phải là chứng minh. Tài liệu không
lấy từ trang bán lẻ, báo, diễn đàn, và không vượt trang chặn tải tự động.

Tên hạng mục, tên gói, tên tiêu chí của HSMT giữ nguyên; tên gói lấy theo quyết định phê duyệt khi các chương ghi khác nhau.
Chữ của hồ sơ không có dấu gạch dài, gạch vừa, mũi tên, emoji; chữ chép nguyên tài liệu hãng ở cột bản gốc, trong ngoặc kép,
thì giữ như hãng viết.

## Tệp tham khảo

| Tệp | Đọc khi |
|---|---|
| `references/bid/reading.md` | bước 1: kiểm kê, trích chữ, đọc ảnh, bẫy khi trích PDF |
| `references/bid/traceability.md` | bước 2 |
| `references/bid/house-style.md` | bước 3, 6: hình thức hồ sơ mẫu đo được, cách đo hồ sơ mẫu khác |
| `references/bid/outline.md` | bước 4: dàn mục theo tiêu chí, dàn mục mẫu, tài liệu kỹ thuật |
| `references/bid/writing.md` | bước 5: giọng, câu mẫu, số, văn bản pháp luật |
| `references/bid/goods.md` | bước 5: bảng đáp ứng thông số thiết bị |
| `references/bid/package.md` | bước 2b, 4, 5, 6: bộ tệp và mã, KT-01 theo mẫu, tìm, tải, tô vàng, dịch tài liệu hãng, giấy tờ phải xin, liên danh |
| `references/bid/software.md` | bước 5: thuyết minh phần mềm, phi chức năng, an toàn thông tin, kiểm thử |
| `references/bid/schedule-letters.md` | bước 5: tiến độ theo ngày, bản cam kết, bảo hành, đào tạo |
| `references/bid/docx-json.md` | bước 5, 6: cấu trúc `content.json` |
| `references/bid/checks.md` | bước 7, 8 |

Script cần Node 18 trở lên, không cần cài gói npm. Xuất PDF cần Microsoft Word (Windows). `page-check.mjs`, `bid-check
--catalog`, `pdf-highlight.mjs` cần `pdftotext` của Poppler (script tự tìm trong PATH, bỏ qua bản xpdf kèm Git for Windows);
xem ảnh trang cần `pdftoppm`. `fetch-doc.mjs` in trang web bằng Edge hoặc Chrome có sẵn trên máy.
