# Hồ sơ dự thầu: phần đề xuất kỹ thuật

Bên mời thầu đăng hồ sơ mời thầu (E-HSMT); nhà thầu nộp hồ sơ dự thầu (E-HSDT). Phần agent viết là thuyết minh đề xuất
kỹ thuật (gọi tắt HSDX ở đây) và, khi gói thầu có phần mềm, tài liệu kỹ thuật sản phẩm (TLKT). Tổ chuyên gia chấm hồ sơ
theo từng tiêu chí đạt hay không đạt, hoặc chấm điểm, nên người chấm cần thấy ngay chỗ đáp ứng từng tiêu chí và tài liệu
chứng minh nó. Thiếu một tiêu chí cơ bản là hồ sơ bị loại, văn hay đến đâu cũng không bù được.

Hồ sơ mời thầu do chủ đầu tư viết; tệp này không dùng để viết hồ sơ mời thầu.

## Đầu vào

| Tài liệu | Lấy gì |
|---|---|
| Chương V, Yêu cầu về kỹ thuật | phạm vi, bảng yêu cầu chi tiết từng hạng mục, mẫu bảng đáp ứng, tài liệu phải nộp kèm (catalog, đánh dấu thông số, bản dịch), kiểm tra và thử nghiệm |
| Chương III, mục Tiêu chuẩn đánh giá về kỹ thuật | tên từng tiêu chí, điều kiện đạt; đây là dàn mục của HSDX |
| Chương II, Bảng dữ liệu | thời hạn hiệu lực, tài liệu chứng minh năng lực, cách xếp thư mục khi nộp |
| Chương IV, Biểu mẫu | biểu phạm vi cung cấp, tiến độ (webform), mẫu cam kết |
| Chương VI, VII, Điều kiện hợp đồng | bảo hành, nghiệm thu, thời gian thực hiện |
| Catalog, tài liệu kỹ thuật của hàng hóa định chào | thông số thật, số trang để dẫn |
| Giấy tờ của nhà thầu | tên, địa chỉ, người đại diện theo đăng ký kinh doanh; hợp đồng tương tự; nhân sự |
| Bản đối chứng | hồ sơ đã nộp ở gói trước, tệp Word, dùng theo mục Bản đối chứng bên dưới |

Trích chữ PDF bằng `pdftotext -layout -enc UTF-8 <tệp.pdf> <tệp.txt>`, hoặc PyMuPDF. Tệp quét không có chữ (quyết định có
dấu đỏ, đăng ký kinh doanh) thì OCR, hoặc hỏi BA những thông tin cần. Bảng yêu cầu kỹ thuật thì xem ảnh từng trang
(`pdftoppm -png`) và đối chiếu từng hàng trước khi dùng, vì bản chữ trích ra hay sai ở ba chỗ:

- ký hiệu so sánh bị mất: "Nguồn ≥ 1.200W" thành "Nguồn 1.200W", "Trọng lượng ≤ 500 g" thành "Trọng lượng 500 g", nên
  mức tối thiểu đọc thành con số bắt buộc đúng bằng;
- hàng của một hạng mục tràn sang trang sau thì phần tràn trông như thuộc hạng mục ở dòng kế, và bảng nhiều cột bị lệch
  dòng làm thông số nhảy sang hạng mục khác;
- tên riêng, số hiệu bị ngắt dòng giữa chừng.

Cột yêu cầu trong bảng đáp ứng chép theo ảnh trang, không chép theo bản chữ.

## Quy trình

1. Đọc HSMT, lập bảng truy vết. Mỗi yêu cầu một dòng:

   | Mã | Yêu cầu (nguyên văn) | Nguồn | Mức | Mục đáp ứng | Tài liệu chứng minh | Trạng thái |
   |---|---|---|---|---|---|---|

   Nguồn là chương, mục, trang. Mức là cơ bản (không đạt thì loại), chấp nhận được, hay chỉ để biết. Trạng thái là đáp
   ứng, tương đương, tốt hơn, chưa có chứng minh, không đáp ứng. Gửi BA bảng này trước khi viết: dòng "chưa có chứng
   minh" là việc BA đi lấy (catalog, xác nhận của hãng), agent không tự điền.
2. Đọc bản đối chứng, lấy dàn mục, kiểu đoạn, cách dựng bảng, câu dẫn, câu cam kết.
3. Dựng dàn mục theo tiêu chí của HSMT đang làm (mục Dàn mục).
4. Viết TLKT trước nếu gói có phần mềm, rồi viết HSDX tóm tắt và dẫn sang TLKT (mục Phần mềm).
5. Dựng tệp Word bằng `scripts/bid-docx.mjs`, lấy tệp mẫu của BA làm khuôn.
6. Soát bằng `scripts/bid-check.mjs`, rồi đi lại bảng truy vết: dòng nào cũng phải trỏ tới một mục có thật trong tệp.
7. Báo BA theo mục Báo lại.

## Dàn mục

Phần lớn của HSDX là các tiêu chí tổng quát ở mục Tiêu chuẩn đánh giá về kỹ thuật, giữ nguyên tên và thứ tự của HSMT.
Mỗi ý HSMT liệt kê trong điều kiện đạt có một mục con riêng, tên gần đúng chữ HSMT, để người chấm dò bằng mắt. Ví dụ
tiêu chí "Giải pháp kỹ thuật, biện pháp tổ chức cung cấp, lắp đặt, bảo hành, bảo trì hàng hóa" mà HSMT kể ra "biện pháp
phòng cháy, chữa cháy; biện pháp bảo đảm vệ sinh môi trường, an toàn lao động; đào tạo hướng dẫn sử dụng, chuyển giao
công nghệ" thì mỗi biện pháp có một mục, kể cả khi gói thầu chỉ có phần mềm.

Dàn mục của bản đối chứng chỉ đúng với HSMT của gói cũ. Gói mới thường thêm, bớt hay đổi tên tiêu chí (gói cũ chỉ có phần
mềm, gói mới có cả thiết bị; gói cũ chấm "kết quả thực hiện hợp đồng", gói mới chấm "uy tín của nhà thầu"). So từng tiêu
chí của HSMT mới với dàn mục cũ, liệt kê chỗ thêm, bớt, đổi trước khi viết.

## Hàng hóa có thông số

Thiết bị (máy chủ, máy tính bảng, thiết bị mạng) đáp ứng bằng bảng theo đúng mẫu ở Chương V, thường bốn cột: STT, yêu
cầu kỹ thuật của E-HSMT, đáp ứng kỹ thuật của hàng hóa dự thầu, tài liệu kỹ thuật tham chiếu.

- Cột yêu cầu chép nguyên văn HSMT, mỗi thông số một dòng; dòng đầu của mỗi hạng mục ghi hãng, model, xuất xứ, năm sản
  xuất của hàng chào.
- Cột đáp ứng ghi con số thật của model ("128 GB DDR5 RDIMM, 8 khe, tối đa 4 TB"), không chỉ ghi "Đáp ứng". Tốt hơn thì
  ghi con số và chữ "tốt hơn"; tương đương thì nói tương đương theo nội hàm nào trong số các nội hàm HSMT định nghĩa.
- Cột tham chiếu ghi tên tài liệu, trang, mục ("Catalog, trang 16, mục Memory"). Tài liệu tiếng nước ngoài cần bản dịch
  tiếng Việt; HSMT thường đòi đánh dấu (highlight) thông số trên catalog: nhắc BA.
- Catalog không ghi thông số đó thì trạng thái là "chưa có chứng minh", báo BA, không viết "đáp ứng". Kê khai không trung
  thực để qua bước đánh giá kỹ thuật bị coi là gian lận (HSMT thường dẫn khoản 4 Điều 16 Luật Đấu thầu).
- Loại thiết bị phải khớp: HSMT đòi máy chủ dạng tháp mà model là máy trạm, đòi hai cổng 10GbE mà catalog có một, thì
  báo BA để đổi model, thêm linh kiện hay giải trình tương đương; không viết lướt qua.
- Cam kết hàng mới, năm sản xuất, nguồn gốc xuất xứ, bảo hành của hãng viết thành dòng riêng trong bảng hoặc mục cam kết.

## Phần mềm

TLKT mô tả chi tiết, HSDX tóm tắt từng ý, cam kết, và dẫn sang TLKT: "(thuyết minh chi tiết tại mục 10.7 của Tài liệu
kỹ thuật ...)". Số mục dẫn phải có thật trong TLKT, và mục đó nói đúng chuyện đang dẫn; `bid-check.mjs --tlkt` soát số mục.

Dàn mục TLKT hay dùng: thông tin sản phẩm; quy trình nghiệp vụ được tin học hóa (hiện trạng, các bước trên phần mềm, kết
quả, sơ đồ); phân rã chức năng và đối tượng tham gia; danh sách chức năng; trường hợp sử dụng; khối lượng và tài liệu bàn
giao; công nghệ, kiến trúc, mô hình triển khai; mô hình kết nối, IPv6; môi trường vận hành; đặc tính phi chức năng; tiêu
chuẩn, quy chuẩn tuân thủ; an toàn thông tin; quy trình và môi trường phát triển; năng lực tổ chức, cán bộ; kiểm thử.
HSMT liệt kê yêu cầu khác thì theo HSMT.

Số đếm phải khớp giữa hai tài liệu và với HSMT: số yêu cầu chức năng, số chức năng, số trường hợp sử dụng, số phân hệ, số
tác nhân. Gói có mua máy chủ thì mô hình triển khai đặt phần mềm lên chính máy chủ đã chào, với thông số đã chào; chỉ viết
"tận dụng hạ tầng hiện có" khi HSMT nói vậy.

## Cách viết

- Không xưng hô. Chủ ngữ là Nhà thầu, Chủ đầu tư, Phần mềm, Hệ thống, tên hạng mục. Gọi các bên và các hồ sơ đúng tên
  HSMT dùng (Chủ đầu tư hay Bên mời thầu; E-HSMT, E-HSDT; gói chào hàng cũ có thể gọi là HSYC).
- Tên gói thầu, tên hạng mục, tên chủ đầu tư, địa điểm chép đúng HSMT, một tên suốt hồ sơ.
- Mỗi mục mở bằng một câu nói mục đáp ứng yêu cầu nào, rồi tới bảng "Nội dung | Đáp ứng" hoặc danh sách. Câu cam kết
  ("Nhà thầu cam kết ...") đặt ở cuối phần lớn, không mỗi đoạn một câu.
- Nói cụ thể, đo được: "phản hồi trong không quá 03 giây", "khắc phục trong vòng 48 giờ". Chữ "hiện đại, tối ưu, vượt
  trội" không kèm số thì bỏ.
- Con số theo một kiểu suốt hồ sơ. Hồ sơ thầu hay viết số đếm nhỏ hơn 10 có số 0 đầu ("04 giờ", "02 ngày"), thời hạn
  quan trọng kèm chữ ("12 (mười hai) tháng"). Cam kết không được kém HSMT: HSMT đòi tối đa 48 giờ thì không hứa 72 giờ.
- Văn bản pháp luật lần đầu ghi đủ loại, số, ngày, cơ quan ban hành ("Nghị định số 85/2016/NĐ-CP ngày 01/7/2016 của Chính
  phủ"). Chỉ dẫn văn bản đã kiểm còn hiệu lực. HSMT dẫn văn bản đã bị thay thế thì vẫn đáp ứng văn bản HSMT nêu, rồi ghi
  "Nhà thầu đề xuất áp dụng ... là văn bản đang có hiệu lực thay thế ...". Không chắc hiệu lực thì đánh dấu cho BA.
- Mỗi cam kết thành nghĩa vụ trong hợp đồng. Con số HSMT không hỏi (độ khả dụng 99%, RTO 4 giờ, kiểm thử xâm nhập) chỉ
  viết khi BA đồng ý; chưa có thì ghi `[cần xác nhận: ...]` để `bid-check.mjs` bắt được.
- Bảy điều trong SKILL.md vẫn áp cho câu chữ. Khác bài giảng ở chỗ hồ sơ thầu dùng nhiều bảng, câu theo lối văn bản hành
  chính, không hỏi rồi đáp. Tiêu đề nối số với tên bằng dấu gạch thì viết bằng dấu hai chấm: "Lớp 1: Quản trị".

## Nhất quán chéo

Soát trước khi giao, vì người chấm hay so các con số này với nhau:

- thời gian thực hiện: HSMT, mục tiến độ, biện pháp tổ chức, lịch đào tạo, bảng tiến độ theo ngày;
- thời hạn bảo hành, thời gian xử lý sự cố: HSMT (mức tối thiểu), mục bảo hành, dòng hỗ trợ kỹ thuật trong bảng tiến độ;
- số lớp, số ngày đào tạo; danh sách tài liệu bàn giao giữa mục đào tạo, mục nghiệm thu, bảng tiến độ;
- tên vị trí nhân sự giữa bảng tổ chức nhân sự và cột người thực hiện của bảng tiến độ;
- tên, địa chỉ, số điện thoại, thư điện tử của nhà thầu theo đăng ký kinh doanh;
- bảng tiến độ: ngày 1 là ngày hợp đồng có hiệu lực, tổng số ngày không vượt thời gian thực hiện, việc sau không bắt đầu
  trước việc nó phụ thuộc.

## Bản đối chứng

Bản đối chứng là hồ sơ đã nộp ở gói trước, thường đã qua bước đánh giá, nên dàn mục, cách viết và định dạng của nó là cách
công ty quen làm. Lấy từ nó: thứ tự mục, tên kiểu đoạn, kiểu bảng, câu dẫn, câu cam kết, mức chi tiết. Không lấy: tên chủ
đầu tư, địa danh, tên sản phẩm, con số cam kết, mốc thời gian, nhân sự, hợp đồng tương tự của gói cũ. Mỗi con số trong
bản mới phải truy được về HSMT mới, catalog hoặc lời BA.

Chép tệp cũ rồi sửa dần là cách dễ sót nhất: còn sót một tên tỉnh hay một thời hạn của gói cũ là người chấm thấy ngay hồ
sơ được chép. Viết bản mới từ dàn mục mới, rồi chạy `bid-check.mjs --sample` để bắt chỗ còn sót.

Hồ sơ mời thầu đã đăng công khai, nhưng hồ sơ dự thầu, bản đối chứng, bảng giá là tài liệu nội bộ. Không đưa nội dung của
chúng vào issue góp ý, repo công khai hay dịch vụ ngoài.

## Dựng tệp Word

```bash
node scripts/bid-docx.mjs content.json HSDX.docx --template ho-so-cu.docx
```

Script lấy tệp khuôn, giữ kiểu đoạn, khổ giấy, lề, chân trang có số trang, đánh số danh sách; bỏ toàn bộ thân, ảnh, chú
thích cuối trang, nhận xét và tên người sửa của tệp cũ. Hồ sơ cũ có nhiều section (bìa, bảng xoay ngang) thì script chọn
section khổ dọc có số trang làm khuôn cho cả tệp. Không đưa `--template` thì dùng khuôn dựng sẵn: Times New Roman 13, A4,
lề trên 2, dưới 2, trái 3, phải 2 cm. Không cần cài gói npm nào.

```json
{
  "title": "Thuyết minh đề xuất kỹ thuật",
  "author": "Công ty ...",
  "cover": [{ "text": "NHÀ THẦU: ...", "bold": true, "size": 14 }, { "space": 200 }, { "text": "Hà Nội, 2026" }],
  "toc": true,
  "blocks": [
    { "part": "A. Đặc tính, thông số kỹ thuật của hàng hóa" },
    { "doc": "I. Bảng đáp ứng yêu cầu kỹ thuật" },
    { "h1": "1. Máy chủ" },
    { "h2": "1.1. Cấu hình" },
    { "p": "Đoạn văn; **chữ đậm** khi cần. Ký tự xuống dòng tách thành đoạn mới." },
    { "bullets": ["Ý một", ["ý con a", "ý con b"], "Ý hai"] },
    { "table": { "caption": "Bảng 1: ...", "columns": ["STT", "Yêu cầu", "Đáp ứng", "Tham chiếu"], "widths": [7, 38, 38, 17],
                 "rows": [{ "cells": ["I", "Máy chủ"], "bold": true, "shade": true }, ["1", "RAM tối thiểu 128 GB", "128 GB", "Catalog, tr. 16"]] } },
    { "figure": { "file": "img/kien-truc.png", "caption": "Hình 1: Kiến trúc tổng thể", "width": 100 } },
    { "pageBreak": true }
  ]
}
```

- `part` là phần lớn (A, B…), `doc` là tài liệu con (I, II…): khuôn có kiểu `MucChinh`, `MucTaiLieu` thì dùng, không có
  thì dùng đề mục cấp 1. `doc` đứng ngay sau `part` thì không ngắt trang.
- `h1`, `h2`, `h3` là đề mục; tự ghi số ("1.1.") vào chữ, script không đánh số.
- Hàng bảng là mảng ô, hoặc `{ "cells": [...], "bold": true, "shade": true }` cho hàng nhóm. Ô có `\n` thành nhiều đoạn.
- `toc: true` chèn mục lục; Word hỏi cập nhật trường khi mở tệp, chọn Yes. Muốn mức khác thì `"toc": "1-2"`.
- Ảnh PNG hoặc JPEG, đường dẫn tương đối với tệp JSON, thu về vừa bề ngang chữ; `width` là phần trăm bề ngang.
- Script báo kiểu đoạn nào khuôn không có. Xuất PDF bằng Word và xem từng trang trước khi giao (`references/docx-export.md`).

## Soát

```bash
node scripts/bid-check.mjs HSDX.docx --hsmt chuong-V.txt --hsmt muc-3.txt --sample ho-so-cu.docx \
  --tlkt TLKT.docx --tlkt-name "Tài liệu kỹ thuật" --term "tên tỉnh cũ"
```

Lỗi (lệnh thoát mã 1):

- chỗ còn để trống: `[cần xác nhận ...]`, `TODO`, `xxx`, chuỗi dấu chấm;
- dẫn tới mục của TLKT mà TLKT không có;
- chữ ở `--term` còn trong bản nháp.

Cần xem lại:

- tên riêng, mã của bản đối chứng không có trong HSMT mà bản nháp vẫn dùng (tên tỉnh, tên công ty phát triển, tên người,
  "HSYC"), xếp theo số lần dùng; tên cơ quan, chuẩn kỹ thuật dùng lại hợp lệ cũng có thể bị nêu, đọc rồi bỏ qua;
- thời hạn (ngày, tháng, giờ) bản nháp có mà HSMT không có: cam kết mới cần BA duyệt, hoặc số của gói cũ còn sót.

Script không biết yêu cầu nào đã được đáp ứng; việc đó vẫn đối chiếu bằng bảng truy vết. Soát văn bằng `scripts/lint.mjs`
như mọi văn bản khác.

## Báo lại

Gửi BA cùng tệp:

- bảng truy vết, lọc các dòng chưa đáp ứng hoặc chưa có chứng minh;
- con số cam kết đang chờ xác nhận, kèm mục chứa nó;
- chỗ HSMT tự mâu thuẫn, lệch bảng, dẫn văn bản hết hiệu lực;
- tiêu chí của HSMT mới mà bản đối chứng không có mục tương ứng;
- đã soát gì bằng lệnh nào, chưa soát gì.
