# Xuất tài liệu ra tệp Word (docx)

Người đọc mở tệp Word bằng nhiều phần mềm khác nhau (Word, Google Docs, LibreOffice, xem trước trong ứng dụng chat), nên
trình bày càng đơn giản càng ít vỡ. Phần này là cách trình bày; script dựng sẵn nằm ở `scripts/report-docx.mjs`.
Văn bản gửi cơ quan nhà nước thì theo thể thức riêng, xem mục cuối.

## Trình bày

- Có mẫu hay quy định trình bày của bên nhận thì theo mẫu đó; mẫu thắng mọi mặc định ở mục này (`diagrams-and-docs.md`,
  mục Tài liệu kỹ thuật gửi khách).
- Một phông cho cả tệp, phông có đủ dấu tiếng Việt như Arial. Người dùng hay nơi nhận đòi phông khác (Times New Roman)
  thì đặt khoá `font` của script, không chép script ra sửa. Cỡ thân bài 11, đề mục cấp 1 khoảng 14, cấp 2 khoảng 12.
- Tệp dài hơn một trang thì có số trang "Trang x / y" giữa chân trang; script tự thêm.
- Tối đa hai cấp đề mục. Đề mục cấp 1 cho các phần lớn, cấp 2 cho từng điểm.
- Lề khoảng 2 cm. Khổ A4 nếu người nhận ở Việt Nam.
- Nhãn in đậm ở đầu đoạn chỉ dùng cho bộ nhãn cố định lặp lại ở mọi mục (kiểu "Trên site:", "Tài liệu gốc:"). Đoạn
  văn thường không in đậm nhãn.
- Gạch đầu dòng tạo bằng định dạng danh sách của Word, không gõ ký tự chấm tròn vào chữ.
- Dòng mới là đoạn mới. Không chèn ký tự xuống dòng trong một đoạn.
- Mã, tên tệp, lệnh để phông chữ đều (Consolas), nền xám nhạt. Chữ trích từ log hay tệp cấu hình cũng vậy, kể cả một
  cụm ngắn đặt giữa câu như `retries=3, timeout=30s`: bọc trong `` `…` ``. Trích nguyên một dòng log trở lên thì để khối `code`
  riêng, câu văn trước nó nói dòng đó cho thấy gì.
- Tên bảng, tên cột cơ sở dữ liệu, khoá cấu hình, tên biến cũng là mã: `order_items`, `retryCount`. Bọc ở mọi chỗ chúng xuất
  hiện, kể cả ô bảng việc tiếp theo và chú thích. Script in ra những chữ trông như mã mà nằm ngoài
  `` `…` `` (có gạch dưới, viết kiểu `retryCount`, đuôi tệp, `a=b`); xem từng chữ trong danh sách đó trước khi xuất PDF.

## Ảnh

- Ảnh rộng tối đa bằng bề ngang chữ, khoảng 16 cm trên A4 lề 2 cm. Ảnh dọc cao quá một trang thì cắt bớt phần không
  nói tới.
- Ảnh chụp điện thoại (dọc, kiểu 1080 x 2400): cắt sát phần câu văn nói tới (hộp thoại lỗi, dòng thông báo), bỏ thanh
  trạng thái, thanh điều hướng, vùng trống; rồi đặt `widthCm` cho ảnh. Chữ cần đọc trong ảnh in ra không được nhỏ hơn
  thân bài. Script in ra "1 điểm ảnh gốc = c mm" cho từng ảnh; đo khoảng cách giữa hai dòng chữ liền nhau trong ảnh (điểm
  ảnh), nhân với c. Kết quả dưới khoảng 4,5 mm (khoảng cách dòng của chữ 11pt) thì cắt sát hơn hoặc tăng `widthCm`. Giữ
  cả phần trên màn hình để người đọc biết đang ở bước nào thì thường phải thu nhỏ, chữ trong hộp thoại sẽ bé lại. Ảnh
  chụp trang web ở mật độ 2x thì đo trên chính tệp ảnh theo điểm ảnh; một điểm CSS lúc chụp bằng hai điểm ảnh.
- Ảnh chỉ có một dòng chữ để đo (nhãn trục biểu đồ, một dòng trạng thái) thì đo chiều cao chữ số theo điểm ảnh rồi nhân với
  c. Chữ số của thân bài 11pt in ra cao khoảng 2,5 mm; nhãn trục biểu đồ được nhỏ hơn một chút nhưng không dưới khoảng 2 mm.
- Biểu đồ, ảnh chụp màn hình người dùng đưa và bảo chèn: chèn đúng ảnh đó. Chữ in ra quá nhỏ thì trước hết cắt bỏ vùng không
  nói tới (thanh menu, chú giải thừa, khoảng thời gian ngoài đợt đang kể) cho ảnh in to hơn. Cắt rồi vẫn nhỏ mà có số liệu gốc
  của chính biểu đồ đó (tệp CSV xuất từ cùng bảng điều khiển) thì vẽ lại từ số liệu ấy, giữ đúng từng số; chú thích nói vẽ
  lại từ số liệu nào, và mọi thứ thêm vào không có trong ảnh gốc (vạch mốc giờ) lấy từ nguồn nào. Báo cáo gửi lãnh đạo thì
  chú thích gọi loại nguồn ("số liệu của hệ thống giám sát"), tên tệp để ở lời trả. Lời trả nói một câu vì sao vẽ lại. Không có số liệu gốc thì giữ ảnh và nói trong lời trả rằng chữ trong ảnh nhỏ.
- Câu dẫn tới ảnh chỉ nói điều thấy được trong ảnh hay có nguồn. Giờ hiện trên màn hình chụp là giờ trên máy lúc chụp,
  không phải giờ ảnh được gửi.
- Ảnh đã cắt thì chú thích không nói chi tiết nằm ở phần bị cắt: cắt thanh trạng thái rồi mà chú thích còn "đồng hồ trên
  điện thoại chỉ 07:30" thì người đọc nhìn ảnh không thấy. Chi tiết đó cần cho báo cáo thì ghi "trong ảnh gốc, đồng hồ chỉ
  07:30", hoặc để ở câu văn dẫn tới ảnh.
- Chú thích nằm ngay dưới ảnh, chữ nghiêng, cỡ nhỏ hơn thân bài, màu xám. Đặt thuộc tính giữ ảnh cùng trang với chú
  thích.
- Ảnh có chữ alt nói ảnh là gì.
- Ảnh chụp bằng máy ảnh, điện thoại (ảnh chụp cảnh, giấy tờ, vài MB) thì nén JPEG chất lượng khoảng 85 trước khi chèn,
  giữ tệp dưới vài MB để gửi qua ứng dụng chat được. Ảnh chụp màn hình, biểu đồ có chữ nhỏ thì giữ PNG: JPEG làm nhòe nét
  chữ mà tệp PNG loại này vốn đã nhỏ.

## Chữ trong bảng, dòng nguồn và đoạn cuối

- Dòng `meta`, ô bảng, chú thích ảnh cũng là chữ của báo cáo, và người đọc hay gặp bảng trước đoạn giải thích. Thuật ngữ
  xuất hiện lần đầu ở đó (commit, pipeline, tên công cụ) thì giải nghĩa ngay ở đó hoặc thay bằng lời thường. Báo cáo gửi
  lãnh đạo thì dòng nguồn nói loại nguồn ("nhật ký lỗi của hệ thống", "lịch sử cảnh báo tự động", "lịch sử thay đổi cấu
  hình"), không kê tên công cụ.
- Bảng có cột nguồn thì mỗi dòng tự ghi nguồn của nó. Câu nói chung về các dòng ("mốc có giây lấy từ log") phải đúng với mọi
  dòng; không đúng hết thì bỏ câu đó.
- Chép từ ghi chú trực ca, tin nhắn, lời kể thì viết lại thành lời báo cáo, cả ở thân bài lẫn ô bảng: giữ sự việc và con
  số, bỏ cách nói. Ghi chú "restart xong ngon được tầm 10 phút rồi lại treo" thành "sau khi khởi động lại, ứng dụng chạy bình
  thường khoảng 10 phút rồi lại không phản hồi"; "log toàn 401" thành "nhật ký lỗi chỉ ghi lỗi 401, tức là bị từ chối
  truy cập". Các chữ "toàn" (theo nghĩa "chỉ có"), "y như cũ", "đỡ được", "tầm" là dấu hiệu lời nói còn lọt vào.
  Câu ghi chú xếp liền nhiều động từ ("chị Lan nhắn là khách gọi hotline kêu không thanh toán được") thì viết lại cho rõ ai
  làm gì, báo cho ai: "Lan (chăm sóc khách hàng) nhắn cho người trực ca rằng khách gọi tổng đài báo không thanh toán được."
- Lời đoán của ghi chú về người gây lỗi ("chắc quên trả lại", "sơ ý", "không để ý") không đưa vào báo cáo gửi lãnh đạo, kể
  cả khi ghi rõ là lời đoán: nó vẫn là câu quy lỗi cho một người. Giữ sự việc có nguồn (lời ghi kèm lần sửa cấu hình, giờ
  phát hành) để người đọc tự kết luận. Cũng vậy với phép tính khoảng chờ đặt cạnh tên người ("An bắt đầu xem lỗi, 17 phút
  sau cảnh báo"): ghi giờ của từng việc ở bảng mốc là đủ.
- Gọi người theo chức danh khi nguồn có. Nguồn chỉ có tên kèm "anh", "chị" thì bỏ "anh", "chị", ghi tên kèm vai trò trong
  sự việc ("An, người trực ca"), và hỏi người dùng chức danh trong lời trả.
- Từ của quy trình nội bộ (đóng bản, merge, tag, chốt bản, lên prod, deploy, rollback, pipeline, pod) gửi lãnh đạo thì
  thay bằng lời thường ở mọi chỗ, thân bài cũng như bảng: "trước khi phát hành bản 2.4" thay cho "trước khi đóng bản 2.4";
  deploy là "cập nhật lên hệ thống chính thức", rollback là "quay lại bản 2.3", pipeline là "quy trình phát hành tự động".
  Chữ thay phải chưa dùng cho thứ khác trong bài: "bản" đã là phiên bản (bản 2.4) thì pod không gọi "bản đang chạy" mà gọi
  "máy chủ chạy `pay-api`" hay "phiên chạy của `pay-api`".
- Ghi chú gọi một thứ bằng tên mơ hồ ("bản cũ", "cấu hình trước", "con kia") thì báo cáo dùng đúng tên đã gọi ở chỗ khác
  ("bản 2.3"), không chép tên mơ hồ vào bảng.
- Mỗi sự việc (cập nhật bản, khởi động lại, quay lại bản cũ, lỗi còn sau khi sửa) kể một lần, ở bảng diễn biến hay đoạn
  diễn biến. Mục nói thời gian lỗi chỉ nêu khoảng lỗi, độ dài và hai mốc đó lấy từ đâu; đoạn sau bảng diễn biến chỉ thêm
  điều bảng không nói được (vì sao lần sửa đầu không ăn thua, điều chưa rõ), không kể lại các dòng của bảng. Câu tóm cả
  sự việc thì để ở đoạn mở (`intro`), trước mục 1. Script in ra những mốc giờ có ở từ hai mục trở lên; xem từng mốc trong
  danh sách đó.
- Số liệu chưa có thì nói cách lấy đúng như nguồn nói. Nguồn nói "đếm trong bảng `order_attempts` thì ra số lượt thanh toán
  hỏng" thì không viết thêm rằng bảng đó cho cả số khách; số khách lấy từ đâu mà nguồn không nói thì ghi là chưa rõ cách lấy.
- Báo cáo đã có bảng việc tiếp theo thì không viết đoạn cuối kể lại bảng. Chỗ hở thấy được mà nguồn chưa có việc nào thì
  nói với người dùng trong lời trả để họ quyết, không tự thêm lời bàn vào báo cáo.

## Kiểm sau khi xuất

1. Soát chữ trước khi đưa: dựng kèm `--text report.md` rồi chạy `node scripts/lint.mjs report.md`. Tệp này có cả chữ
   trong bảng, chú thích, dòng nguồn; đọc lại nó hai lượt như văn thường. Lint không bắt được mấy chỗ báo cáo có mốc giờ
   hay sai, nên lượt đọc thứ hai dừng ở từng câu có giờ, số liệu:
   - "Trong khoảng đó", "lúc đó", "khi ấy" trỏ về mốc gần nhất. Câu trước vừa nêu hai mốc mới (07:40 xong việc, 07:55 hết
     lỗi) mà ý là cả đợt lỗi thì gọi lại bằng chính hai mốc của đợt: "từ 07:05 tới 07:55".
   - Cụm giải nghĩa ("tức là …", "tức …", ", phần … ,") chen vào giữa câu thì tách thành câu riêng đặt trước: chen giữa
     động từ và mốc giờ, con số; giữa chủ ngữ và động từ ("bản 2.5, tức bản 2.4 đã sửa cấu hình, được cập nhật …"); giữa
     danh từ và phần bổ nghĩa của nó; hay trước dấu hai chấm mở danh sách ("nhật ký của `pay-api`, phần nhận yêu cầu từ
     ứng dụng và web: lỗi đầu lúc 07:05 …" đọc như hai chấm kê ứng dụng và web). Sai: "Hình 1 đếm số lỗi 401, tức là lỗi
     bị từ chối truy cập, trong từng khung 10 phút." Đúng: "Lỗi 401 là lỗi bị từ chối truy cập. Hình 1 đếm số lỗi này
     trong từng khung 10 phút."
   - Mốc giờ treo cuối câu bị động ("bản 2.4 được cập nhật, tức là …, lúc 07:00") dễ đọc thành giờ của việc khác: đưa mốc
     lên đầu câu, chủ ngữ là người hay hệ thống làm việc đó. "Việc khởi động lại …" ở đầu câu cũng viết lại theo cách ấy.
   - Câu chỉ nói lại điều câu trước đã đủ ("lỗi đầu tiên lúc 07:05" rồi "trước 07:00 không có lỗi") thì bỏ. Câu cuối đoạn mở
     bằng "Vậy", "Như vậy" rồi kể lại các câu vừa đọc thì bỏ.
2. Xuất tệp sang PDF bằng chính phần mềm người nhận hay dùng, rồi xem từng trang. Windows có Word:
   `pwsh -NoProfile -File scripts/bid/render-pdf.ps1 report.docx` (script nằm trong thư mục hồ sơ dự thầu nhưng dùng
   được cho mọi tệp Word; ra `report.pdf` cạnh tệp Word, PDF có số trang đúng; tệp Word chỉ được lưu lại khi kèm
   `-UpdateDocx`). Văn bản hành chính thì chạy thêm `node scripts/official-doc-docx.mjs --check-pdf vb.pdf` để đo
   khoảng trống trang.
   Không có Word: `soffice --headless --convert-to pdf report.docx`. Đổi trang ra ảnh để xem:
   `pdftoppm -r 80 -png report.pdf page`.
3. Tìm: ảnh tràn lề, chú thích rơi sang trang sau ảnh hay bảng, trang trống, đề mục nằm cuối trang mà nội dung ở trang sau, chữ
   trong ảnh nhỏ hơn thân bài (phóng vùng ảnh lên mà đọc), khối ký rơi một mình sang trang mới, khoảng số bị ngắt giữa dòng,
   tên định danh (tên máy, tên container, IP, đường dẫn) gãy dòng giữa ô ở dấu gạch nối. Gãy ở gạch nối thì nới cột hay
   dùng `NoBreakHyphen` của thư viện `docx` (hàm `unbroken` ở `scripts/official-doc-docx.mjs`). Mẫu bắt một phông thì chạy
   `pdffonts report.pdf`: không còn phông nào ngoài phông mẫu, kể cả ký tự sau số thứ tự của danh sách đánh số.
4. Tìm dấu gạch dài, gạch vừa trong nội dung trước khi dựng tệp.
5. Một số dịch vụ xem tệp trên mạng từ chối tệp zip có mục thư mục rỗng. Tệp do thư viện sinh ra thì xoá các mục đó:
   `zip -d file.docx '*/'`.

## Script dựng sẵn

`scripts/report-docx.mjs` đọc một tệp JSON và dựng tệp docx theo đúng các quy ước trên. Cần Node 18 trở lên và npm.
Lần chạy đầu, script tự cài thư viện `docx` vào `~/.cache/vina-me` (đổi chỗ bằng biến `VINA_ME_CACHE`); máy đã có `docx`
qua `NODE_PATH` thì dùng luôn bản đó.

```bash
node scripts/report-docx.mjs content.json report.docx --text report.md
```

Cấu trúc JSON:

```json
{
  "font": "Times New Roman",
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
          "images": [{ "file": "images/decision.jpg", "caption": "Bản quyết định: ngày ký" }]
        }
      ]
    }
  ]
}
```

- `items` được đánh số theo phần, ví dụ 2.1, 2.2.
- `fields` là các cặp nhãn và nội dung. Trong nội dung, chữ bọc `` `…` `` thành phông mã.
- `images[].file` là đường dẫn tương đối với tệp JSON. Ảnh rộng bằng bề ngang ảnh, tối đa 16 cm; `widthCm` đặt bề ngang
  in riêng cho ảnh đó. Ảnh nào in ra cao quá 22 cm thì script tự thu cho vừa trang và báo ra màn hình.
- `intro` là đoạn mở ngay dưới nhan đề và `meta`, trước mục 1, chưa đánh số, in như thân bài; nhận khối như `blocks`. Báo
  cáo sự cố gửi lãnh đạo đặt ở đây một hai câu nói việc gì xảy ra, khi nào, ảnh hưởng tới đâu, để mục 1 không phải gánh cả
  câu tóm. Báo cáo rà soát đặt ở đây câu đếm và tên khối lặp (`review-reports.md`, mục Mở đầu); `meta` in chữ nhỏ màu xám.
- `font` (mặc định Arial) là phông cả tệp. Số trang "Trang x / y" giữa chân trang bật sẵn; `"pageNumbers": false` thì bỏ.
- Một phần có thể có `paragraphs` (đoạn văn thường), `blocks`, `tables`, `bullets`, `items`, theo thứ tự đó. Một mục có thể
  có `paragraphs`, `blocks`, `fields`, `tables`, `images`.
- `blocks` giữ đúng thứ tự viết, để đặt ảnh, bảng, đoạn log giữa các đoạn văn của một phần mà không phải tách mục con
  (đoạn dẫn, ảnh, đoạn đọc ảnh). Mỗi khối là một chuỗi (đoạn văn), hoặc `{ "table": {…} }`, `{ "image": {…} }`,
  `{ "bullets": [ … ] }`, `{ "code": "dòng 1\ndòng 2" }` (log, cấu hình trích nguyên văn, phông đều, cả khối một trang).

```json
{ "heading": "Diễn biến", "blocks": [
  "Màn hình người dùng thấy khi bấm thanh toán là Ảnh 1.",
  { "image": { "file": "images/payment-error-crop.png", "widthCm": 9, "caption": "Ảnh 1. Hộp thoại báo lỗi trên ứng dụng" } },
  "Nhật ký lỗi của hệ thống ghi dòng sau ở lần lỗi đầu tiên:",
  { "code": "2026-01-05 08:00:01 ERROR ... timeout" }
] }
```
- `tables[]` gồm `columns` (tên cột), `rows` (mảng các hàng), `widths` (phần trăm bề ngang mỗi cột, không bắt buộc),
  `caption`. Ô để chuỗi rỗng thành ô trống cho người nhận điền; muốn xuống dòng trong ô thì đặt ký tự xuống dòng trong chuỗi (trong JSON là
  `\n`). Hàng không bị cắt qua hai trang; bảng có `caption` thì hàng cuối giữ cùng trang với chú thích.
- `--text <tệp.md>` ghi thêm chữ của cả báo cáo, cùng thứ tự với tệp Word, để soát bằng `lint.mjs`.
- Script in ra cỡ in từng ảnh, danh sách chữ trông như mã nằm ngoài `` `…` `` (mục Trình bày) và các mốc giờ có ở từ hai
  mục trở lên (mục "Chữ trong bảng, dòng nguồn và đoạn cuối").

## Lời trả kèm tệp

Tệp Word dựng bằng `scripts/report-docx.mjs`, văn bản hành chính bằng `scripts/official-doc-docx.mjs`; có mẫu của bên nhận
thì theo mẫu. Dựng kèm `--text` rồi chạy `lint.mjs`; xuất PDF bằng `scripts/bid/render-pdf.ps1` (dùng được cho mọi tệp
Word) và xem từng trang trước khi đưa; văn bản hành chính chạy thêm `official-doc-docx.mjs --check-pdf`.

Đưa đường dẫn tệp Word, tệp PDF đã xuất và số trang, và nói luôn trong câu đó đã xuất PDF bằng gì, đã xem từng trang và
kiểm gì trên trang: "Báo cáo ở `…/report.docx`, bản PDF xuất bằng Word ở `…/report.pdf`, 3 trang; đã xem từng trang: chân
trang có số trang, hai ảnh nằm gọn cùng chú thích, bảng sang trang có lặp hàng tiêu đề." Ghi việc xem trang trong ghi chú
riêng mà không nói trong lời trả thì người dùng không biết đã có ai xem bản in. Thêm một hai câu về dữ kiện còn thiếu hay
chỗ các nguồn lệch nhau mà người dùng cần biết trước khi gửi. Yêu cầu nào làm khác mặc định của script (phông, cắt ảnh, vẽ
lại biểu đồ) thì nói một câu đã làm thế nào. Không kể lại báo cáo gồm những mục gì; người dùng mở tệp là thấy.

Cả lời trả không quá khoảng tám dòng, 1.000 ký tự. Với tệp Word, mục này thay cho mốc "không quá ba câu" của
`core-rules.md` (mục Trả lời trong chat), vì phải nói thêm việc xem bản in và cách làm khác mặc định, nhưng vẫn có trần
ấy. Văn bản hành chính thì lời trả theo bước Soát của `official-documents.md`. Dữ kiện thiếu gộp vào một hai câu, không kê thành gạch đầu dòng từng mục; không kể lại bảng việc tiếp theo hay việc
nào chưa có người làm (đã có trong báo cáo); câu hỏi cho người dùng (chức danh, có thêm việc vào bảng không) mỗi thứ
một câu. Sai: dòng dẫn "Trước khi gửi, bạn cần biết mấy chỗ sau:" rồi năm gạch đầu dòng. Đúng: "Chưa có số lượt thanh
toán hỏng vì chưa ai đếm, và nhật ký còn lỗi tới 07:55 dù 07:40 đã quay lại bản 2.3, các tệp không nói vì sao. Tài liệu
không ghi chức danh của Lan và Bình; bạn gửi thì mình thêm."

## Văn bản gửi khách để xin dữ liệu

- Viết từ phía người nhận: mở bằng những gì họ đã gửi và sẽ dùng ở đâu, rồi mới tới phần còn thiếu.
- Mỗi yêu cầu nói cần gì (số lượng, định dạng), vì sao (người xem sẽ thấy gì ở chuyên mục đó), và đã có phần nào.
- Dùng đúng cách phân mức, cách đặt tên tệp mà bên nhận đã đặt ra trong tài liệu của họ.
- Không đưa lỗi nội bộ của bên làm vào văn bản gửi khách; việc cần khách làm thì viết thành yêu cầu.
- Thứ khách phải điền thì đưa bảng mẫu có sẵn cột; thứ mình đã soạn nháp thì đưa bản nháp để khách chỉ việc duyệt.

## Văn bản hành chính theo Nghị định 30/2020

`scripts/official-doc-docx.mjs` dựng báo cáo, tờ trình, kế hoạch, công văn theo thể thức ở `official-documents.md`: A4, lề
trên và dưới 20 mm, trái 30 mm, phải 15 mm, Times New Roman cỡ 14, canh đều, lùi đầu dòng 1,27 cm, cách đoạn 6pt; khối
tên cơ quan và Quốc hiệu hai cột; số trang giữa lề trên, trang đầu không hiện; mỗi phụ lục một phần riêng, đánh lại số
trang. Script tự thêm số 0 vào ngày và tháng, tự đặt chấm phẩy và dấu chấm cho các khối Căn cứ, Kính gửi, Nơi nhận, tự đánh
mục I., khoản 1., điểm a) theo bảng chữ cái tiếng Việt, thêm "- Như trên;" khi có Kính gửi, và kết nội dung bằng "./.".

```bash
node scripts/official-doc-docx.mjs report.json report.docx
```

```json
{
  "parentAgency": "Sở Giáo dục và Đào tạo tỉnh A",
  "agency": "Trường Trung học\nphổ thông B",
  "number": "05/BC-THPTB",
  "place": "Thành phố A",
  "date": "2026-01-06",
  "docType": "Báo cáo",
  "subject": "Kết quả triển khai phần mềm quản lý thư viện năm 2025",
  "legalBases": [],
  "recipients": ["Sở Giáo dục và Đào tạo tỉnh A"],
  "opening": ["Thực hiện Kế hoạch số 12/KH-SGDĐT ngày 05 tháng 9 năm 2025 của ..., Trường ... báo cáo kết quả như sau:"],
  "body": [
    { "heading": "Tình hình thực hiện", "clauses": [
      { "title": "Kết quả đạt được", "points": ["Đã nhập 1.234 đầu sách, đạt 98,5% ...", ["Phần mềm chạy ổn định:", "ý nhỏ;", "ý nhỏ."]] }
    ] },
    { "heading": "Đề xuất, kiến nghị", "paragraphs": ["Đề nghị ..."] }
  ],
  "closing": ["Trên đây là báo cáo ... Kính đề nghị ... xem xét."],
  "distribution": ["Ban Giám hiệu"],
  "archive": "VT, TV",
  "signingAuthority": "KT. Hiệu trưởng",
  "signerTitle": "Phó Hiệu trưởng",
  "signer": "Nguyễn Văn C",
  "appendices": [{ "title": "Danh mục sách", "tables": [{ "columns": ["STT", "Tên sách", "Số bản"], "rows": [["1", "Sách giáo khoa Toán 10", "40"]] }] }]
}
```

| Khoá | Phần nào của văn bản |
|---|---|
| `parentAgency`, `agency` | tên cơ quan chủ quản, tên cơ quan ban hành |
| `number`, `place`, `date` | số ký hiệu, địa danh, ngày ban hành |
| `docType`, `subject` | tên loại (Báo cáo, Tờ trình...), trích yếu |
| `legalBases`, `recipients`, `opening` | các dòng Căn cứ, nơi Kính gửi, đoạn mở đầu |
| `body` | các mục I., II.; mỗi mục có `heading`, `paragraphs`, `clauses`, `tables` |
| `closing` | câu kết, dòng cuối tự thêm "./." |
| `distribution`, `archive` | Nơi nhận, dòng Lưu |
| `signingAuthority`, `signerTitle`, `signer` | quyền hạn ký (KT., TL....), chức vụ, họ tên người ký |
| `appendices` | phụ lục; mỗi phụ lục có `title`, `paragraphs`, `clauses`, `tables`, `paragraphsAfter` |
| `agencyFullName` | tên đủ của cơ quan ban hành, kể cả địa danh, cho dòng "(Kèm theo ... của ...)" của phụ lục |
| `lineSpacing`, `fontSize` | cách dòng thân bài (1 tới 1,5, mặc định 1,2), cỡ thân bài (13 hay 14, mặc định 14), để dồn trang |

- Bỏ `docType` thì thành công văn: trích yếu hiện dưới số ký hiệu sau "V/v".
- `date` nhận `2026-01-06` hoặc `06/01/2026`. Tên cơ quan dài thì script tự nới cột, hạ cỡ, ngắt
  trước địa danh; chỉ ngắt tay bằng `\n` khi cần, và ngắt trước địa danh, không tách đôi một cụm.
- Một khoản (`clauses`) có `title` (khoản đậm, một dòng riêng), `paragraphs`, `points`, `tables`. Một điểm là chuỗi, hoặc
  mảng mà phần tử đầu là ý chính, các phần tử sau thành dòng gạch nối.
- `recipients` một nơi thì cùng dòng với "Kính gửi:", nhiều nơi thì mỗi nơi một dòng. Có `recipients` thì các dòng
  `legalBases` in sau Kính gửi.
- Mục, khoản, phụ lục có `paragraphsAfter` cho đoạn đứng sau danh sách điểm hay bảng. Bảng nhận thêm `align` (canh từng
  cột: "left", "center", "right"; cột tiền nên "right") và `boldRows` (chỉ số hàng in đậm, -1 là hàng cuối như dòng
  "Tổng cộng"); script báo dòng có phép nhân lệch.
- `--text vb.md` ghi chữ của văn bản để soát bằng `lint.mjs`; `--check-pdf vb.pdf` đo khoảng trống trang của bản PDF đã
  xuất (`official-documents.md`, mục Soát).
- Chữ ký để trống chỗ ký; dấu và chữ ký số do văn thư làm.
