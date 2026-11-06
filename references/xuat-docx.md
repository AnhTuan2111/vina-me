# Xuất tài liệu ra tệp Word (docx)

Người đọc mở tệp Word bằng nhiều phần mềm khác nhau (Word, Google Docs, LibreOffice, xem trước trong ứng dụng chat), nên
trình bày càng đơn giản càng ít vỡ. Phần này là cách trình bày; script dựng sẵn nằm ở `scripts/bao-cao-docx.mjs`.
Văn bản gửi cơ quan nhà nước thì theo thể thức riêng, xem mục cuối.

## Trình bày

- Một phông cho cả tệp, phông có đủ dấu tiếng Việt như Arial. Cỡ thân bài 11, đề mục cấp 1 khoảng 14, cấp 2 khoảng 12.
- Tối đa hai cấp đề mục. Đề mục cấp 1 cho các phần lớn, cấp 2 cho từng điểm.
- Lề khoảng 2 cm. Khổ A4 nếu người nhận ở Việt Nam.
- Nhãn in đậm ở đầu đoạn chỉ dùng cho bộ nhãn cố định lặp lại ở mọi mục (kiểu "Trên site:", "Tài liệu gốc:"). Đoạn
  văn thường không in đậm nhãn.
- Gạch đầu dòng tạo bằng định dạng danh sách của Word, không gõ ký tự chấm tròn vào chữ.
- Dòng mới là đoạn mới. Không chèn ký tự xuống dòng trong một đoạn.
- Mã, tên tệp, lệnh để phông chữ đều (Consolas), nền xám nhạt.

## Ảnh

- Ảnh rộng tối đa bằng bề ngang chữ, khoảng 16 cm trên A4 lề 2 cm. Ảnh dọc cao quá một trang thì cắt bớt phần không
  nói tới.
- Chú thích nằm ngay dưới ảnh, chữ nghiêng, cỡ nhỏ hơn thân bài, màu xám. Đặt thuộc tính giữ ảnh cùng trang với chú
  thích.
- Ảnh có chữ alt nói ảnh là gì.
- Nén ảnh JPEG chất lượng khoảng 85 trước khi chèn, giữ tệp dưới vài MB để gửi qua ứng dụng chat được.

## Kiểm sau khi xuất

1. Xuất tệp sang PDF bằng chính phần mềm người nhận hay dùng (Word nếu có, không thì LibreOffice), rồi xem từng trang.
2. Tìm: ảnh tràn lề, chú thích rơi sang trang sau ảnh, trang trống, đề mục nằm cuối trang mà nội dung ở trang sau.
3. Tìm dấu gạch dài, gạch vừa trong nội dung trước khi dựng tệp.
4. Một số dịch vụ xem tệp trên mạng từ chối tệp zip có mục thư mục rỗng. Tệp do thư viện sinh ra thì xoá các mục đó:
   `zip -d tep.docx '*/'`.

## Script dựng sẵn

`scripts/bao-cao-docx.mjs` đọc một tệp JSON và dựng tệp docx theo đúng các quy ước trên. Cần Node 18 trở lên và thư
viện `docx` (`npm install docx` trong một thư mục bất kỳ, rồi chạy script với `NODE_PATH` trỏ tới `node_modules` đó).

```bash
NODE_PATH=/duong/dan/node_modules node scripts/bao-cao-docx.mjs noi-dung.json bao-cao.docx
```

Cấu trúc JSON:

```json
{
  "title": "Báo cáo rà soát nội dung trang X",
  "meta": "Kiểm ngày 06/11/2026 trên bản đang chạy, đối chiếu với tài liệu A, B. Khung đỏ đánh dấu chỗ được nêu.",
  "sections": [
    {
      "heading": "Tài liệu đã nhận",
      "bullets": ["Tệp A: 24 trang scan, nội dung …"]
    },
    {
      "heading": "Các điểm cần xác nhận",
      "items": [
        {
          "title": "Ngày ban hành quyết định ghi sai",
          "fields": [["Trên site:", "Ngày ban hành ghi 11/01/1993."],
                     ["Tài liệu gốc:", "Bản quyết định ghi \"ngày 18 tháng 1 năm 1993\"."],
                     ["Cần xác nhận:", "Sửa thành 18/01/1993."]],
          "images": [{ "file": "anh/qd.jpg", "caption": "Bản quyết định: ngày ký" }]
        }
      ]
    }
  ]
}
```

- `items` được đánh số theo phần, ví dụ 2.1, 2.2.
- `fields` là các cặp nhãn và nội dung. Trong nội dung, chữ bọc `` `…` `` thành phông mã.
- `images[].file` là đường dẫn tương đối với tệp JSON. Script tự thu ảnh về rộng 16 cm.
- Một phần có thể có `paragraphs` (đoạn văn thường), `tables`, `bullets`, `items`, theo thứ tự đó. Một mục có thể có
  `paragraphs`, `fields`, `tables`, `images`.
- `tables[]` gồm `columns` (tên cột), `rows` (mảng các hàng), `widths` (phần trăm bề ngang mỗi cột, không bắt buộc),
  `caption`. Ô để chuỗi rỗng thành ô trống cho người nhận điền; muốn xuống dòng trong ô thì đặt ký tự xuống dòng trong chuỗi (trong JSON là
  `\n`).

## Văn bản gửi khách để xin dữ liệu

- Viết từ phía người nhận: mở bằng những gì họ đã gửi và sẽ dùng ở đâu, rồi mới tới phần còn thiếu.
- Mỗi yêu cầu nói cần gì (số lượng, định dạng), vì sao (người xem sẽ thấy gì ở chuyên mục đó), và đã có phần nào.
- Dùng đúng cách phân mức, cách đặt tên tệp mà bên nhận đã đặt ra trong tài liệu của họ.
- Không đưa lỗi nội bộ của bên làm vào văn bản gửi khách; việc cần khách làm thì viết thành yêu cầu.
- Thứ khách phải điền thì đưa bảng mẫu có sẵn cột; thứ mình đã soạn nháp thì đưa bản nháp để khách chỉ việc duyệt.

## Văn bản hành chính theo Nghị định 30/2020

`scripts/van-ban-hc-docx.mjs` dựng báo cáo, tờ trình, kế hoạch, công văn theo thể thức ở `van-ban-hanh-chinh.md`: A4, lề
trên và dưới 20 mm, trái 30 mm, phải 15 mm, Times New Roman cỡ 14, canh đều, lùi đầu dòng 1,27 cm, cách đoạn 6pt; khối
tên cơ quan và Quốc hiệu hai cột; số trang giữa lề trên, trang đầu không hiện; mỗi phụ lục một phần riêng, đánh lại số
trang. Script tự thêm số 0 vào ngày và tháng, tự đặt chấm phẩy và dấu chấm cho các khối Căn cứ, Kính gửi, Nơi nhận, tự đánh
mục I., khoản 1., điểm a) theo bảng chữ cái tiếng Việt, thêm "- Như trên;" khi có Kính gửi, và kết nội dung bằng "./.".

```bash
NODE_PATH=/duong/dan/node_modules node scripts/van-ban-hc-docx.mjs bao-cao.json bao-cao.docx
```

```json
{
  "coQuanChuQuan": "Sở Giáo dục và Đào tạo tỉnh A",
  "coQuan": "Trường Trung học\nphổ thông B",
  "so": "05/BC-THPTB",
  "diaDanh": "Thành phố A",
  "ngay": "2026-01-06",
  "tenLoai": "Báo cáo",
  "trichYeu": "Kết quả triển khai phần mềm quản lý thư viện năm 2025",
  "canCu": [],
  "kinhGui": ["Sở Giáo dục và Đào tạo tỉnh A"],
  "moDau": ["Thực hiện Kế hoạch số 12/KH-SGDĐT ngày 05 tháng 9 năm 2025 của ..., Trường ... báo cáo kết quả như sau:"],
  "noiDung": [
    { "muc": "Tình hình thực hiện", "khoan": [
      { "tieuDe": "Kết quả đạt được", "diem": ["Đã nhập 1.234 đầu sách, đạt 98,5% ...", ["Phần mềm chạy ổn định:", "ý nhỏ;", "ý nhỏ."]] }
    ] },
    { "muc": "Đề xuất, kiến nghị", "doan": ["Đề nghị ..."] }
  ],
  "ketThuc": ["Trên đây là báo cáo ... Kính đề nghị ... xem xét."],
  "noiNhan": ["Ban Giám hiệu"],
  "luu": "VT, TV",
  "quyenHan": "KT. Hiệu trưởng",
  "chucVu": "Phó Hiệu trưởng",
  "nguoiKy": "Nguyễn Văn C",
  "phuLuc": [{ "ten": "Danh mục sách", "bang": [{ "columns": ["STT", "Tên sách", "Số bản"], "rows": [["1", "Sách giáo khoa Toán 10", "40"]] }] }]
}
```

- Bỏ `tenLoai` thì thành công văn: trích yếu hiện dưới số ký hiệu sau "V/v".
- `ngay` nhận `2026-01-06` hoặc `06/01/2026`. Tên cơ quan dài thì tự ngắt dòng bằng `\n` cho khỏi bị ngắt giữa một cụm.
- Một mục có `doan`, `khoan`, `bang`. Một khoản có `tieuDe` (khoản đậm, một dòng riêng), `doan`, `diem`, `bang`. Một điểm
  là chuỗi, hoặc mảng mà phần tử đầu là ý chính, các phần tử sau thành dòng gạch nối.
- `kinhGui` một nơi thì cùng dòng với "Kính gửi:", nhiều nơi thì mỗi nơi một dòng.
- Chữ ký để trống chỗ ký; dấu và chữ ký số do văn thư làm.
