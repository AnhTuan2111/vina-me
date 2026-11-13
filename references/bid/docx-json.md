# Cấu trúc content.json cho bid-docx.mjs

```bash
node scripts/bid/bid-docx.mjs content.json HSDX.docx --template <hồ sơ mẫu.docx>
```

Có khuôn thì script giữ bìa, mục lục, cách chia section của khuôn và học định dạng thực tế của từng loại đoạn; không có khuôn
thì dùng khuôn dựng sẵn theo số đo của hồ sơ mẫu. Không cần cài gì ngoài Node.

```json
{
  "title": "Thuyết minh đề xuất kỹ thuật",
  "author": "<tên nhà thầu>",
  "cover": ["NHÀ THẦU: ...", "GÓI THẦU ...", "<tên gói>", "Hà Nội, 2026"],
  "toc": true,
  "blocks": [
    { "part": "A. <tên tiêu chí 1>" },
    { "doc": "I. Bảng đáp ứng yêu cầu kỹ thuật hàng hóa" },
    { "h1": "1. <tên hạng mục>" },
    { "h2": "1.1. <mục con>" },
    { "h3": "1.1.1. <mục nhỏ>" },
    { "p": "Đoạn văn. **Chữ đậm**, *chữ nghiêng*. Ký tự xuống dòng tách thành đoạn mới." },
    { "label": "a) Nhãn đậm đầu một khối" },
    { "bullets": ["**Nhãn:** nội dung", ["ý con"], "ý khác"] },
    { "table": { "columns": ["STT", "Yêu cầu", "Đáp ứng", "Tham chiếu"], "widths": [7, 35, 38, 20],
                 "rows": [{ "cells": ["I", "Máy chủ ..."], "bold": true, "shade": true }, ["1", "...", "...", "..."]],
                 "caption": "Bảng 1: ...", "center": [0] } },
    { "figure": { "file": "img/kien-truc.png", "caption": "Hình 1: ...", "width": 100 } },
    { "gantt": { "days": 60, "perTable": 10, "dayOne": "ngày ký hợp đồng",
                 "intro": [{ "h1": "3. Bảng tiến độ theo ngày" }, { "p": "Tiến độ chi tiết theo ngày như sau:" }],
                 "rows": [{ "no": "I", "task": "CUNG CẤP HÀNG HÓA", "group": 1 },
                          { "no": "1", "task": "Khởi động", "group": 2 },
                          { "no": "1.1", "task": "Ký hợp đồng, khởi động dự án", "owner": "Chủ trì dự án", "from": 1, "to": 2 }] } },
    { "letter": { "org": ["CÔNG TY CỔ PHẦN", "TÊN CÔNG TY"], "date": "Hà Nội, ngày ... tháng ... năm 2026",
                  "subject": "Về việc ...", "to": "Kính gửi: <Chủ đầu tư>",
                  "info": ["**Tên nhà thầu:** ...", "Địa chỉ: ...", "Mã số doanh nghiệp: ...; Điện thoại: ...", "Fax: ...; Thư điện tử: ...", "Người đại diện: ..., <chức danh>"],
                  "body": ["Sau khi nghiên cứu ...", "Cam kết ...", "Chúng tôi hoàn toàn chịu trách nhiệm trước pháp luật về nội dung cam kết nêu trên./."],
                  "signer": "<họ tên>" } },
    { "sign": { "signers": [{ "title": "ĐẠI DIỆN HỢP PHÁP CỦA\nTHÀNH VIÊN ĐỨNG ĐẦU\nLIÊN DANH", "org": "CÔNG TY ...",
                              "note": "(thay mặt liên danh; ký, ghi rõ họ tên, đóng dấu)", "name": "<họ tên>" }] } },
    { "pageBreak": true }
  ]
}
```

- `cover`: khuôn có bìa thì đủ số dòng chữ của bìa khuôn, theo thứ tự (dòng nhắc lại tên tài liệu ở đầu thân, sau mục lục, của
  khuôn tài liệu kỹ thuật cũng tính là một dòng bìa; chạy thử với `"cover": []` để script in đủ các dòng); sai số dòng thì script in ra các dòng của bìa khuôn
  và dừng. Chữ dài hơn bìa khuôn thì script tự bớt khoảng trống để bìa vẫn vừa một trang. Dòng bìa nào của khuôn ghi thông
  tin gói không có (khuôn có "GÓI THẦU SỐ ..." mà HSMT không đánh số gói) thì thay bằng thông tin cùng vai mà gói có: tên tài
  liệu ("THUYẾT MINH ĐỀ XUẤT KỸ THUẬT") ở dòng đó, tên gói kèm số E-TBMT ở dòng tên gói.
- Tên phần lớn, tài liệu con dài (giữ nguyên chữ HSMT): script tự dính hai chữ cuối để dòng cuối không còn một chữ ("NGHỆ");
  không tự đổi chữ của HSMT.
- `part` là phần lớn (sang trang mới); `doc` là tài liệu con (sang trang mới, trừ khi ngay sau `part`); `h1`, `h2`, `h3` tự ghi
  số vào chữ, script không đánh số.
- Viết chữ đề mục đúng như khuôn gõ, không tự viết hoa: khuôn mẫu gõ phần lớn và đề mục cấp 1 chữ thường ("A. Yêu cầu kỹ thuật
  của hàng hóa", "1. Giới thiệu phần mềm"), kiểu đoạn tự hiện chữ hoa trên trang, còn mục lục giữ chữ thường. Tài liệu con
  cũng viết chữ thường ("I. Bảng đáp ứng yêu cầu kỹ thuật hàng hóa"): với `tocStyle` mặc định, khuôn mẫu gõ chữ hoa tài liệu
  con thì script cho kiểu đoạn tự in hoa. `bid-docx` cảnh báo đề mục gõ hoa ở loại đoạn tự in hoa.
- `tocStyle`: mặc định `"clean"` (mục lục hai cấp, mục con chữ thường không đậm, dòng thứ hai thụt thẳng); `"template"` giữ
  kiểu mục lục của khuôn.
- `coverStyle`: mặc định `"clean"` (khung viền đôi xanh đậm ở trang bìa, tên tài liệu cùng màu, dòng nhà thầu dài tự ngắt hai
  dòng cân nhau); `"template"` giữ bìa của khuôn. Bìa không cần chữ `size` hay ngắt dòng tay.
- `tableStyle`: mặc định `"clean"`, kiểu bảng của skill (viền ngoài xám đậm mảnh, viền trong xám nhạt, tiêu đề nền xanh nhạt
  chữ xanh đậm, hàng nhóm nền xám nhạt, ô có lề), sửa chỗ yếu của bảng mẫu (viền đen dày, nền xám nhạt khó phân biệt, chữ sát
  viền). `"template"` thì giữ kiểu bảng của khuôn. Cột có từ tiêu đề không vừa một dòng ("STT") được script tự nới, lấy bớt từ
  cột rộng nhất.
- `table.widths` là phần trăm; `center` là các cột căn giữa (mặc định cột STT); hàng nhóm `bold`, `shade`. Hàng có ít ô hơn số
  cột thì ô cuối trải ngang hết các cột còn lại (hàng nhóm `["B", "TRIỂN KHAI, ĐÀO TẠO"]`). Bảng rộng hết bề ngang chữ; trong khối
  `gantt`, `landscape` thì theo bề ngang trang ngang.
- Đề mục, nhãn tự giữ với đoạn sau; đoạn `p` đứng ngay trước bảng, hình tự giữ với hàng đầu bảng. Đề mục vẫn rơi cuối trang
  (đoạn sau quá dài) thì `page-check.mjs` báo; sửa bằng cách thêm câu mở ngắn trước bảng hoặc chia đoạn.
- `gantt` tự mở và đóng section ngang. `outro` là các khối in ngay dưới bảng cuối, trên trang ngang (câu "Nhà thầu cam kết
  ..." kết phần tiến độ khi phần kết bằng bảng tiến độ). `dayOne` bắt buộc (mốc ngày 1, in ở tiêu đề mọi bảng). `intro` là các khối in trên
  trang ngang đầu tiên trước bảng 1 (đề mục, câu mở). `title` là phần lớn đặt trên trang ngang, chỉ dùng khi cả phần tiến độ
  chỉ có bảng theo ngày (như hồ sơ mẫu: "E. TIẾN ĐỘ"); `title` vào mục lục như mọi phần lớn. `landscape: [blocks]` đặt các khối
  thường trên trang ngang.
- `letter.org`: các dòng tên công ty, in đậm hết. Dòng đầu là cơ quan chủ quản (không phải một phần tên công ty) thì thêm
  `"orgParent": true` để dòng đó chữ thường theo Nghị định 30.
- `letter.signers`: thay cho `signer` khi nhiều người cùng ký (liên danh): mỗi người `title`, `org`, `note`, `name`, mỗi người một
  cột. Một người thì khối ký ở nửa phải. `sign` là khối ký đứng riêng cuối tài liệu không phải bản cam kết (KT-01), cùng cách ghi.
  `\n` trong `title`, `org` là xuống dòng.
- Tài liệu không bìa (bảng đáp ứng, bản dịch, mục lục hồ sơ, bộ cam kết): `"cover": false`, dùng được cả khi có `--template`
  (bỏ bìa, mục lục của khuôn, giữ định dạng của khuôn), mở bằng `part` mang tên tài liệu.
- Dấu sao thật (dấu chú thích "8.400 mAh*", "**") viết `\\*` trong chuỗi JSON; dấu `*` trần đi cặp sẽ thành chữ nghiêng, đậm.
- `***chữ***` là chữ đậm nghiêng (hai đoạn cam kết dưới bảng đáp ứng của Chương V).
- `letter` mở trang mới; bản cam kết đầu tiên mở section cuối của khuôn (không in số trang, như hồ sơ mẫu). Script ngắt trang
  bằng đoạn có "ngắt trước", nên bản vừa khít trang không sinh trang trắng.
- Ảnh PNG hoặc JPEG, đường dẫn tương đối với tệp JSON.
- Không dùng dấu gạch dài, gạch vừa, mũi tên trong chữ.
