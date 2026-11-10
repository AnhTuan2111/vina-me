# Soát và báo lại

## Soát bằng lệnh

Chạy cả bốn lệnh sau mỗi lần dựng lại. Thư mục đầu vào BA gửi là chỉ đọc: PDF, ảnh trang của hồ sơ mẫu cũng ghi ra thư mục
làm việc (`-OutDir`).

```bash
node scripts/bid/bid-check.mjs HSDX.docx --hsmt "<chương I.txt>" --hsmt "<chương II.txt>" --hsmt "<chương IV.txt>" \
  --hsmt "<chương V.txt>" --hsmt "<chương VI.txt>" --hsmt "<chương VII.txt>" --hsmt "<mục 3.txt>" \
  --catalog "<catalog.pdf>" \
  --sample "<hồ sơ mẫu.docx>" --term "<tên tỉnh, tên công ty, tên người, mã sản phẩm của gói cũ>"
node scripts/bid/docx-profile.mjs --compare "<hồ sơ mẫu.docx>" HSDX.docx
pwsh -NoProfile -File scripts/bid/render-pdf.ps1 -UpdateDocx HSDX.docx   # Word cập nhật mục lục trong chính tệp Word, xuất PDF
node scripts/bid/page-check.mjs HSDX.pdf HSDX.docx
pdftoppm -r 60 -png HSDX.pdf pages/p
```

- `bid-check`:
  - `LỖI Còn để trống` là các chỗ đánh dấu `[cần xác nhận]`, `[chưa có chứng minh]`, `[cần bổ sung]`: hồ sơ giao BA được phép
    còn, nhưng số chỗ ở từng mục (dòng `ĐẾM`) phải khớp danh sách báo lại.
  - Mọi `LỖI` khác phải sửa: chữ ở `--term` còn sót, mục dẫn sang tài liệu kỹ thuật không có, chữ gán cho catalog không có
    trên trang dẫn, số trang catalog không có, tên chứng nhận (80 Plus) không có trên trang dẫn mà không đánh dấu, lời nói với BA
    trong thân hồ sơ ("BA", "trước khi nộp").
  - Mọi `XEM` phải xử lý từng dòng, không để nguyên: thời hạn, tần suất, số buổi không có trong HSMT thì đánh dấu là cam kết mới
    hoặc sửa nếu là số của gói cũ; hàng thông số thiết bị chỉ dẫn cam kết của nhà thầu thì đánh dấu thiếu tài liệu hãng; hai
    mốc tính ngày 1 thì chọn một; mốc bảo hành, tên phần mềm kèm phiên bản không có trong HSMT thì đánh dấu; con số không có trên
    trang catalog dẫn thì sửa trang; phần lớn thiếu câu kết "Nhà thầu cam kết" thì thêm; tên riêng của mẫu thì đọc rồi bỏ hoặc sửa.
  - Đưa mọi chương hồ sơ có dẫn (I, II, IV, V, VI, VII, Mục 3) vào `--hsmt`, thiếu chương thì thời hạn đúng bị nêu nhầm.
  - BA có tệp trả lời thì đưa cả tệp đó vào `--hsmt`: số BA đã chốt (số lớp, số buổi, tần suất) không bị nêu là cam kết tự đặt.
  - Chữ chép nguyên văn HSMT (cột yêu cầu) không bị nêu thiếu số 0, thiếu chữ kèm thời hạn hay ghi mức ≥; còn bị nêu thì kiểm lại xem có chép sai chữ HSMT.
- `bid-docx` in dòng `SỬA` khi dựng (đề mục gõ sẵn chữ hoa, bảng thiếu câu mở, cột bảng quá hẹp): sửa hết trong `content.json`.
- Không có hồ sơ mẫu: bỏ `--sample` và `docx-profile --compare` (khuôn dựng sẵn đã mang số đo của mẫu), ghi điều đó vào báo cáo;
  vẫn đặt ảnh trang cạnh số đo trong `house-style.md` để xem bằng mắt.
- `docx-profile --compare` từ 95% thuộc tính khớp. Dòng `KHÔNG DÙNG` (bản dựng không có hình) không tính.
- `page-check` không còn lỗi nào: đề mục cuối trang, trang gần trắng, trang trắng, bản cam kết dài quá một trang. Đây là lỗi
  phải sửa trong `content.json` rồi dựng lại (bớt chữ, gộp đoạn, đưa đề mục vào `intro` của `gantt`, thêm câu mở trước bảng),
  không phải điều để ghi vào báo cáo. Hồ sơ mẫu cũng mắc vài lỗi loại này; không lấy đó làm lý do giữ lại.

## Soát bằng mắt (trên ảnh trang)

- Bìa vừa một trang, không in số; mục lục có số trang, đủ phần lớn và tài liệu con.
- Phần lớn mở trang mới.
- Bảng không tràn lề, hàng tiêu đề lặp khi sang trang, chữ trong ô không bị dọc từng chữ, hàng nhóm trải ngang hết bảng.
- Trang tiến độ xoay ngang, các bảng cùng bề rộng, ô ngày tô đúng khoảng, tiêu đề bảng ghi đúng mốc ngày 1.
- Mỗi bản cam kết vừa một trang, có "Về việc", khối ký ở nửa phải.

## Soát nội dung

- Đi bảng truy vết: dòng nào cũng có mục đáp ứng có thật trong tệp.
- Đủ tiêu chí của Mục 3, đúng thứ tự, đúng tên; mỗi ý trong điều kiện đạt có chỗ đáp ứng.
- Nhà thầu đúng theo giấy tờ; tên gói theo quyết định; số lượng theo Mẫu 01A; các thời hạn nhất quán (`schedule-letters.md`).
- Bảng thiết bị: mỗi hàng ghi "đáp ứng" có trang catalog thật ghi thông số đó; thông số chỉ có lời cam kết của nhà thầu (bảo
  hành dài hơn chuẩn hãng, 24/7) có đánh dấu (`goods.md`).
- Không còn chữ của gói cũ; không có thông số, con số, tần suất, văn bản không có nguồn mà không đánh dấu.

## Soát cuối như người chấm

Các lệnh trên chưa bắt hết. Trước khi giao, đọc lại cả hồ sơ một lượt theo từng dạng dưới đây (đều là lỗi người chấm đã trừ điểm ở
các lần thử), dùng tìm chữ trong `content.json` cho từng từ khóa:

1. Mỗi chỗ đánh dấu: lấy từ khóa của nó (lịch, nơi chạy Chatbot, ai làm phần mềm, model, địa chỉ, đề xuất kỹ thuật), tìm mọi chỗ
   khác nhắc lại; chỗ nào không có dấu thì thêm `[cần xác nhận]` ngắn, trừ bảng trong phần tiến độ.
2. Câu mở bảng, câu giới thiệu đầu phần không khẳng định điều đang chờ BA ("hạng mục 3, 4 do Nhà thầu thực hiện").
3. Mọi việc nhà thầu hứa mà HSMT không đòi, kể cả không có số (bản in, trực tại chỗ, thiết bị dự phòng, cho mượn): có dấu, có
   trong danh sách cam kết mới.
4. Chi tiết kỹ thuật, lắp đặt, điện, mạng không có nguồn: bỏ hoặc đánh dấu.
5. Câu nói thứ tự việc ("trước khi", "sau khi", "song song", "từ ngày N") khớp đúng ngày trong bảng tiến độ; số người, số bộ, số
   lần tự đặt ("hai người nâng máy") cũng là cam kết mới, đánh dấu.
6. Dẫn điều khoản đúng nguồn của từng con số (48 giờ là Mục 3 Chương III, 02 ngày sửa chữa là E-ĐKCT 23.5).
7. Thông tin lấy từ tên tệp chứ không từ nội dung tài liệu (số E-TBMT trong tên tệp quyết định) thì đánh dấu.
8. Báo cáo: mỗi câu "đã đánh dấu ở X" kiểm lại trong tệp Word; không ghi thông số theo trí nhớ.
9. Ảnh trang: tên phần không để một chữ ở dòng cuối, cột bảng không gãy chữ ngắn, ảnh sản phẩm sạch đường chú thích.

## Báo lại BA

Gửi kèm tệp Word và PDF:

0. BA có gửi tệp trả lời thì mở báo cáo bằng bảng từng câu trả lời (trước mọi mục khác): BA chốt gì, đã sửa ở mục nào của hồ sơ,
   còn chờ gì; rủi ro của một câu trả lời (vai nhà thầu phụ trái HSMT) ghi ngay ở dòng của câu đó. Không hỏi lại câu BA đã trả lời.
1. Bảng các dòng truy vết chưa xong: chưa có chứng minh, cần BA quyết, không đáp ứng.
2. Danh sách chỗ đánh dấu, gom theo mục như dòng `ĐẾM` của `bid-check` (số chỗ từng mục khớp), mỗi mục ghi cần gì.
3. Danh sách cam kết mới do nhà thầu tự đặt (thời hạn, tần suất, số buổi, số lớp) chờ BA duyệt.
4. Câu hỏi bắt buộc khi có: vai của đơn vị đứng tên trong hồ sơ mẫu mà khác nhà thầu (`reading.md`); model, catalog của
   hàng hóa chưa có tài liệu; thông số không đáp ứng hay khác loại (đổi model, thêm linh kiện, giải trình tương đương). Điều
   BA đã chốt (giữ model, giải trình tương đương) thì không hỏi lại, chỉ nêu rủi ro còn lại và tài liệu còn thiếu.
5. Chỗ HSMT tự lệch, bản chữ trích sai, và cách hồ sơ đã xử lý.
6. Tiêu chí mới mà hồ sơ mẫu không có, và mục đã thêm.
   Giả định chưa chốt (nhà thầu tự làm phần mềm, nơi chạy Chatbot, lịch) xuất hiện ở bảng nhân sự, giải pháp, tiến độ, bản cam
   kết thì mỗi chỗ có `[cần xác nhận]` ngắn; soát bằng cách tìm từ khóa của từng chỗ đánh dấu trong cả hồ sơ.
   Danh sách cam kết mới trong báo cáo khớp đúng các chỗ đánh dấu cam kết mới trong hồ sơ, không thêm điều hồ sơ không đánh dấu.
   Báo cáo không đưa thông số của hàng chưa có catalog theo trí nhớ hay "hiểu biết chung": ghi "chưa có catalog, chưa đánh giá
   được" và việc cần làm.
   Lập danh sách đó từ các dòng `LỖI Còn để trống` mà bid-check in ra (mỗi dòng có mục và chữ đánh dấu), không viết theo trí
   nhớ; câu "đã đánh dấu" trong báo cáo phải đúng với tệp Word.
   Điều nào báo cáo xếp vào cam kết mới hay việc BA phải quyết (vai thầu phụ, ai làm phần mềm, thiết bị dự phòng, cho mượn
   thiết bị) thì trong thân hồ sơ cũng có chỗ đánh dấu ở đúng câu đó; câu khẳng định thẳng mà BA chưa chốt là lỗi.
7. Đã soát gì bằng lệnh nào: kết quả `docx-profile --compare` (chép nguyên văn các dòng lệch, không tự diễn giải), `page-check`, số dòng `LỖI` và `XEM` của `bid-check` sau khi xử
   lý; chưa soát gì.
