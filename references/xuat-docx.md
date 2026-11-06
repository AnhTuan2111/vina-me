# Xuất tài liệu ra tệp Word (docx)

Người đọc mở tệp Word bằng nhiều phần mềm khác nhau (Word, Google Docs, LibreOffice, xem trước trong ứng dụng chat), nên
trình bày càng đơn giản càng ít vỡ. Phần này là cách trình bày; script dựng sẵn nằm ở `scripts/bao-cao-docx.mjs`.

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
- Một phần có thể có `paragraphs` (đoạn văn thường), `bullets`, `items`, theo thứ tự đó.
