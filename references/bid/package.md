# Bộ tệp hồ sơ kỹ thuật

Tổ chuyên gia chấm Mục 3 bằng cách mở Chương V cạnh hồ sơ: với mỗi thông số, họ tìm dòng đáp ứng, rồi lật sang tài liệu
hãng ở đúng trang được dẫn và tìm chỗ tô vàng. Nên hồ sơ kỹ thuật là một bộ tệp, mỗi tệp một vai, dẫn chéo nhau bằng mã.

## Các tệp và mã

Mã đặt theo thứ tự hàng hóa trong Biểu phạm vi cung cấp (Mẫu 01A Chương IV), tài liệu chung đứng sau:

| Mã | Tệp | Nội dung |
|---|---|---|
| KT-00 | Mục lục hồ sơ kỹ thuật (Word) | danh mục tài liệu; bảng từng hàng hóa dẫn tới tài liệu, dòng, mục (E-CDNT 10.8: xếp theo số thứ tự hàng hóa) |
| KT-01 | Bảng đáp ứng yêu cầu kỹ thuật hàng hóa (Word) | đúng mẫu ở mục 1.2.1 Chương V, mọi hạng mục, ký cuối bảng |
| KT-02, KT-03… | một mã cho mỗi thiết bị | KT-0nA, KT-0nB… là tài liệu gốc của hãng đã tô vàng (PDF); KT-0n là bản dịch tiếng Việt (Word) khi tài liệu gốc tiếng nước ngoài |
| KT-0n tiếp theo | Tài liệu kỹ thuật sản phẩm phần mềm (Word) | khi gói có hạng mục phần mềm (`outline.md`, mục Tài liệu kỹ thuật sản phẩm) |
| kế tiếp | Thuyết minh đề xuất kỹ thuật (Word) | năm phần theo năm tiêu chí Mục 3 (`outline.md`) |
| cuối | Bộ bản cam kết (Word) | mỗi bản một trang (`schedule-letters.md`) |

Mỗi tệp Word dựng từ một `content-<mã>.json` riêng bằng `bid-docx.mjs`, cùng `--template` là hồ sơ mẫu (khổ trang, phông, kiểu
đoạn, kiểu bảng giống nhau cả bộ), xuất PDF bằng `render-pdf.ps1`. Tên tệp: `KT-01 Bảng đáp ứng yêu cầu kỹ thuật.docx` (mã, tên
tài liệu tiếng Việt có dấu; không viết không dấu). Tài liệu hãng giữ tên theo tài liệu gốc: `KT-02A Dell Precision 7960 Tower
Setup and Specifications.pdf`; trang web in ra thì đặt theo hãng, sản phẩm và loại trang: `KT-03A Samsung Galaxy Tab S11 trang
thông số.pdf`. Thuyết minh, tài liệu phần mềm có bìa và mục lục; bảng đáp ứng, bản dịch, mục
lục hồ sơ, bộ cam kết ghi `"cover": false` (không bìa, không mục lục, vẫn theo khuôn) và mở bằng `part` mang tên tài liệu. BA có
gửi tài liệu kỹ thuật phần mềm cũ thì dùng nó làm khuôn cho tệp tài liệu phần mềm. Mốc 95% của `docx-profile --compare` áp cho
thuyết minh; các tệp khác soát bằng ảnh trang cạnh trang mẫu cùng loại.

Dẫn chéo luôn bằng mã: "KT-02A, tr. 19 (bảng 9)" (tài liệu hãng, số trang của tệp PDF), "KT-04, mục 3.2" (tài liệu phần mềm),
"KT-05, phần D, mục 3" (thuyết minh). Thuyết minh không chép lại bảng đáp ứng: phần A kể hàng hóa chào (hãng, model, xuất xứ,
số lượng), dẫn sang KT-01 và tài liệu hãng, rồi thuyết minh phần mềm, phi chức năng, an toàn thông tin, kiểm thử như cũ.

## KT-01 Bảng đáp ứng

Dựng đúng mẫu của Chương V, không đổi tên cột, không bỏ hàng của mẫu:

1. Đầu tài liệu: tên gói, số E-TBMT, Chủ đầu tư, nhà thầu (tên liên danh và các thành viên khi liên danh), bảng mã tài liệu
   tham chiếu (mã, tên tài liệu của hãng, phiên bản, ngày lấy; tài liệu BA gửi thì ghi nguồn bằng lời của hồ sơ, như "catalog của hãng nộp kèm E-HSDT",
   không ghi "BA cung cấp": thân hồ sơ không nói với BA, `bid-check` báo lỗi chữ đó). Link dài không đặt trong ô bảng (Word ngắt giữa chữ): kê ngay dưới
   bảng mã thành danh sách "KT-03A: <link>, tải ngày ...".
2. Bảng bốn cột đúng chữ mẫu: STT; Yêu cầu kỹ thuật của Hồ sơ mời thầu; Đáp ứng kỹ thuật của Hồ sơ dự thầu; Tài liệu kỹ thuật
   tham chiếu trong E-HSDT. Hàng thứ hai là (1) (2) (3) (4) như mẫu. Mỗi hạng mục một hàng nhóm (tên hạng mục đúng chữ HSMT,
   số lượng; hàng chào: hãng, model, ký mã hiệu, năm sản xuất), rồi mỗi thông số một hàng (`goods.md`). Hạng mục phần mềm, dịch
   vụ cũng một hàng mỗi chức năng, dẫn KT-04 hay thuyết minh.
3. Hai hàng cuối đúng chữ mẫu: "Tiêu chí đáp ứng tương đương hoặc tốt hơn" (kê số dòng tốt hơn; dòng tương đương thì ghi theo
   nội hàm tương đương nào của Chương V và dòng nào chứng minh) và "Tiêu chí gây hạn chế nhà thầu (không được xem xét và đánh
   giá)" (kê dòng nào chỉ một hãng đáp ứng kèm tài liệu chứng minh, không có thì "Không có").
4. Hai đoạn cam kết dưới bảng chép nguyên văn Chương V ("Nhà thầu cam kết những nội dung kê khai nêu trên là chính xác...",
   "Trường hợp Nhà thầu cố tình kê khai thông tin không trung thực...").
5. Khối ký (`sign`): nhà thầu độc lập thì đại diện hợp pháp của nhà thầu; liên danh thì xem mục Liên danh.

Hai đoạn cam kết đó là lý do không được viết "đáp ứng" khi chưa có tài liệu: ký dưới bảng là khai với Chủ đầu tư.

## Tài liệu hãng: tìm, tải, tô vàng, dịch

**Tìm.** Thứ tự ưu tiên: tài liệu BA gửi; tệp PDF chính thức của hãng (datasheet, spec sheet, "Setup and Specifications", hướng
dẫn sử dụng, chính sách bảo hành); trang thông số chính thức của hãng (cả trang tại Việt Nam, đỡ phải dịch); trang cấu hình đặt
hàng trên cửa hàng của chính hãng (dell.com/shop kê từng tùy chọn: RDIMM ECC, ổ, card, gói bảo hành; dẫn và tô đúng dòng tùy
chọn được chào, không dẫn phần "Selected" của cấu hình mặc định hay giá, và nói rõ ở bảng mã đó là trang cấu hình; khối "Tech
Specs" mang một giá trị cho mỗi mục (một bộ xử lý, một dung lượng RAM, một gói bảo hành) là cấu hình mặc định, không phải cấu
hình chào: không dẫn, không trích, không tô chữ trong khối đó, kể cả dòng bảo hành, vì nó có thể là gói khác gói chào, như
"Basic ... Onsite Support After Remote Diagnosis" khi chào ProSupport; khối kê nhiều lựa chọn cho mỗi mục là danh sách tùy chọn,
dẫn được, trích đúng dòng tùy chọn được chào); bảng thông số trong thông
cáo báo chí trên trang tin của hãng (news.samsung.com); tài liệu của hãng linh kiện cho thông số của linh kiện (chip, GPU, card
mạng), dùng khi tài liệu thiết bị đã nêu đúng tên linh kiện đó: trang của Samsung ghi "Dimensity 9400+", trang MediaTek ghi tiến
trình và GPU, trang Arm ghi Vulkan. Một thông số tìm ở mọi nguồn trên rồi mới kết luận chưa có chứng minh: cùng một thông số có
lần tìm được ở spec sheet, có lần chỉ ở trang cấu hình. Hướng dẫn sử dụng, datasheet hay nằm sau nút tải dựng bằng JavaScript:
`fetch-doc` in trang sản phẩm hay trang hỗ trợ của hãng sẽ kê các link PDF có trên trang (trang hỗ trợ của Dell hiện chuyển
về trang chủ hỗ trợ khi in không đăng nhập, không kê gì: dùng trang sản phẩm và kết quả tìm). Không dùng trang bán lẻ, báo, diễn đàn, Wikipedia, trang so sánh cấu
hình. Câu tìm kiếm chỉ chứa tên sản phẩm, mã model, tên linh kiện; không chứa tên gói, Chủ đầu tư, nhà thầu.

**Tải.** Chỉ tải bằng `fetch-doc` (trang hãng hay chặn curl, WebFetch mà vẫn cho trình duyệt; link hỏng với công cụ khác thì thử
lại bằng `fetch-doc` rồi mới kết luận): `node scripts/bid/fetch-doc.mjs <url> tl/KT-03A.pdf --expect "<thông số>" --sources
tl/sources.md`. Lần hỏng cũng được ghi vào `sources.md`. `fetch-doc` ghi vào bảng có cột "Ngày tải" (tạo bảng đó ở đầu tệp khi
chưa có), tải lại cùng link ra cùng tệp thì thay dòng cũ. Mỗi lần tìm ghi vào mục "Lần tìm" của `sources.md` (câu tìm, link trong kết quả đã
dùng), để báo cáo chứng minh được đã tìm. Bảng "Lần tìm" có các cột "| Ngày | Dòng KT-01 | Thông số | Câu tìm hay trang đã xem |
Kết quả |". Mỗi hàng KT-01 còn `[chưa có chứng minh: ...]` có ít nhất một dòng "Lần tìm" ghi đúng số thứ tự hàng đó ở cột "Dòng
KT-01" (quản trị từ xa, tản nhiệt, vận hành 24/7, zoom cũng vậy), kể cả nguồn của linh kiện (trang Intel của CPU cho vPro, AMT);
`package-check --sources` báo LỖI hàng thiếu lần tìm. Chưa tìm thì chưa được để dấu. Link trong bảng "Lần tìm" là kết quả đã xem,
không phải tài liệu đã tải: bộ tệp không phải ghi lại. Link lấy từ kết quả tìm kiếm hay từ trang của hãng, không tự ghép
đường dẫn theo mẫu, kể cả đổi mã ngôn ngữ (en-us thành de-de) của một link 404: link tự ghép trả 404 không chứng tỏ tài liệu
không có. Spec sheet của Dell là tệp PDF trên delltechnologies.com, thường ghi đủ chứng nhận nguồn ("80PLUS Platinum
Certified"), RAM ECC, gói bảo hành. Tìm nó theo thứ tự sau, ghi từng lần vào "Lần tìm":
1. WebSearch "<model> spec sheet" với tham số `allowed_domains: ["delltechnologies.com"]`, không viết `site:` trong câu (viết
   `site:` thì kết quả chỉ ra link cũ đã bỏ). Nhận link theo URL có tên model và chữ `spec-sheet` (tiêu đề kết quả là dòng đầu của
   PDF, không có tên model), ưu tiên `en-us` rồi các bản `en-*`, bỏ đuôi `.external` nếu có. Link dạng
   `.../assetlink/doc/...-original.pdf` tải thẳng; link dạng cũ `.../asset/<ngôn ngữ>/products/...-spec-sheet.pdf` thì máy chủ
   chuyển sang link mới khi tên tệp đúng, `fetch-doc` tự đi theo. Link cũ trả 404 là tên tự ghép sai hay tài liệu đã đăng lại dưới
   tên mới: đừng thử các bản đổi mã vùng, quay lại bước này.
2. Không có spec sheet: làm lại bước 1 với "<model> technical guidebook" (máy trạm) hay "<model> technical guide" (PowerEdge).
3. Spec sheet thiếu chữ cần dẫn (có bản chỉ ghi "Platinum", không ghi "80 PLUS"): WebSearch "<model> Setup and Specifications pdf"
   (máy trạm) hay "<model> Installation and Service Manual" (PowerEdge) với `allowed_domains: ["dl.dell.com"]`; PDF trên dl.dell.com
   tải thẳng được.
4. Cuối cùng mới in trang sản phẩm dell.com để xem link PDF trên trang, mỗi lần in cách nhau vài phút (in liên tiếp thì bị chặn).
Tải về mà `fetch-doc` ghi "bản in trang web" có chữ "Sign In", hay báo LỖI tài liệu riêng (link chuyển sang `isPrivate=Y`), thì
đó là tài liệu cần đăng nhập: bỏ, tìm tài liệu khác. Chỉ khi mọi đường trên hỏng mới kết luận thông số chưa có chứng minh, báo
cáo kê từng link đã thử và đưa vào danh sách BA tải tay. In lại một trang
(thêm `--click`, bỏ ảnh) thì dòng của lần in cũ trong `sources.md` chuyển sang bảng "Lần tải hỏng hay không dùng" với chữ "không
dùng: <lý do>" (`package-check --sources` bỏ qua dòng đó). Trang in ra có giá bán (cửa hàng, giá khuyến nghị) thì in lại với
`--hide-price` để ẩn khối giá: hồ sơ kỹ thuật không mang giá. Bản in có ảnh quá nặng (trên 10 MB) mà vẫn cần ảnh sản phẩm thì
giữ bản có ảnh làm tệp nháp trong `work/tl/`, cắt ảnh sản phẩm từ trang đó (`pdftoppm -f N -l N -r 150 -x .. -y .. -W .. -H ..
-png`), nộp kèm bản in không ảnh (`--hide "img, picture, video"`), và chú thích ảnh ghi ảnh lấy từ link nào. Trang in ra là trang báo lỗi ("404", "Page Not Found") hay trang chặn ("Access Denied", "You don't have permission") thì
`fetch-doc` báo LỖI và xoá tệp; tìm link khác. dell.com chặn sau vài lần in liên tiếp: in trang cấu hình đặt hàng một lần, có
ảnh và `--hide-price` ngay từ lần đầu, chọn đúng trang cấu hình cần dùng trước khi in. Danh sách tùy chọn của trang cấu hình hay bị
thu gọn (chỉ hiện vài dòng và một nút mở rộng): đọc bản in đầu xem nhóm tùy chọn cần dẫn (ổ, nguồn, card) có đủ dòng chưa, thiếu thì
in lại với `--click "<chữ trên nút mở rộng>"`, rồi mới kết luận tùy chọn không có. Tệp PDF của hãng được
lưu nguyên; trang web được in ra PDF bằng Edge chạy ngầm: script cuộn hết trang, mở mục thu gọn, ẩn thanh dính đầu trang và hộp
cookie. Phần tử nổi khác còn đè chữ (khung phát trực tiếp, khung chat) thì thêm `--hide "<CSS selector>"`. Mục thông số phải bấm mới mở thì thêm `--click "<chữ trên nút>"` ("Expand all", "See all specs", "Xem tất cả"). Xem ảnh mọi
trang có thông số được dẫn: chữ có trong lớp chữ chưa chắc đọc được trên trang in (bị đè, bị cắt), `pdf-highlight` không biết điều
đó. `--expect` thiếu thì tìm tệp PDF spec sheet, trang thông số riêng, hướng dẫn sử dụng, hoặc tài liệu hãng linh kiện; vẫn không
có thì thông số đó chưa có chứng minh. Trang trả lỗi chặn tải (403) thì không vượt: ghi vào danh sách
giấy tờ phải xin, BA tải tay. Danh mục tài liệu ở KT-00, KT-01 ghi link và ngày tải theo `sources.md`.

**Tô vàng.** Mỗi tài liệu gốc một tệp `marks-<mã>.json`: mỗi dòng bảng đáp ứng dẫn trang nào thì trang đó có ít nhất một chỗ tô,
đúng chữ được trích trong ô đáp ứng. Trang chỉ được dẫn ở chú thích hình (ảnh sản phẩm cắt từ trang đó: "Hình 1: ... (KT-02A,
tr. 7)") không chứng minh thông số, nên không tô và không dịch; đừng tô một câu không liên quan cho đủ luật. Chữ trên nền tối
(ô tiêu đề cột chữ trắng nền đen) thì vạch tô không thấy khi in: `pdf-highlight` tự vẽ khung vàng quanh chữ đó và in dòng `GHI`;
xem ảnh trang cho chắc khung hiện. Bảng ma trận dấu tích thì chọn ô bằng `"near": "<nhãn hàng>", "col": "<tiêu đề cột>"`
(`{"text": "✓", "near": "Vulkan 1.3", "col": "Immortalis-G925"}`), không tự tính `nth` bằng tọa độ. Trang dạng bảng thông số (nhãn một dòng, giá trị dòng dưới, như trang Samsung) thì tô cả
nhãn lẫn giá trị: hai mục marks, một cho "Bộ nhớ đệm (GB)", một cho "12"; giá trị ngắn trùng chữ khác trên trang thì ghi `"after": "<nhãn>"` để tô lần xuất hiện đầu tiên sau nhãn. Bảng nhãn ở cột
trái, giá trị ở cột phải (bảng đầu nối "FAN SYS1 | System fan connector", bảng bảo hành "Máy tính bảng; | 12 tháng", ô nhãn nhiều
dòng) thì ghi `"near": "<nhãn>"`: script tô lần xuất hiện bên phải nhãn, gần nhãn nhất theo chiều dọc, tức đúng hàng của nhãn;
`after` ở bảng này hay rơi vào hàng sau. Nhãn cũng tô ở ô bảng, không ở tiêu đề mục trùng chữ: nhãn trùng chữ khác trên trang ("Chipset" là tiêu đề, là nhãn ô, và nằm
trong "TPM 2.0 on chipset") thì ghi `"near": "<giá trị cùng hàng>"` cho nhãn (`{"text": "Chipset", "near": "Intel W790"}`):
lần xuất hiện cùng dòng với chữ neo được chọn trước, kể cả khi đứng bên trái. Không bỏ nhãn khỏi chữ trích và chỗ tô để né
lỗi tô nhầm; người chấm cần thấy nhãn để biết giá trị thuộc trường nào. Chữ trích lấy trọn ô hay trọn mệnh đề của trang, không
dừng giữa ô ("2 x 3.5-inch flexbays without optical drive configuration", không cắt còn "2 x 3.5-inch flexbays").
`pdf-highlight` in `XEM` khi chữ có nhiều lần trên trang mà không ghi `nth`, `after`, `near`, khi `after` chọn lần cách nhãn
quá hai dòng, khi tô giá trị có số mà nhãn đầu hàng ("Weight", "Display", "Temperature range") chưa tô, và khi chỉ tô một phần một
ô xuống dòng ("Battery /" mà thiếu "Charging", "Network &" mà thiếu "Connectivity"): xử lý hết các dòng đó; nhãn vắt hai dòng thì
ghi đủ chữ của cả hai dòng vào marks.
Bảng có nhãn ở hàng tiêu đề cột (bảng bộ xử lý: cột "Cores", "Cache") thì tô cả tiêu đề cột của giá trị được trích. Bảng so
nhiều máy (thông số Tab S11 Ultra cạnh Tab S11) thì luôn tô ô đầu cột của máy chào, vì đó là chỗ duy nhất cho biết giá trị thuộc
máy nào; trang cấu hình có nhãn nhóm viết hoa ("PROCESSOR OPTIONS", "STORAGE CONTROLLERS", "WARRANTY") thì tô nhãn nhóm của dòng
được trích, và xem ảnh trang cho chắc chỗ tô nằm ở ô nhãn chứ không ở chữ trùng giữa câu bên cạnh. Chữ neo đỡ phải đoán `nth` (trang in từ web có chữ ẩn trùng chữ hiện); vẫn xem ảnh trang
sau khi tô cho đúng chỗ. `bid-check --highlight` báo khi con số của chữ trích chưa được tô, và khi một chỗ tô không ứng với chữ trích nào
(bỏ khỏi marks, hoặc trích chữ đó ở dòng nó chứng minh). `node scripts/bid/pdf-highlight.mjs tl/KT-02A-goc.pdf marks-KT-02A.json "KT-02A ....pdf"`; chữ
không thấy là LỖI (trang dẫn sai, hoặc chữ không có thật). Xem ảnh các trang đã tô (`pdftoppm -f N -l N`). Tệp BA gửi đã tô sẵn
thì `pdf-highlight.mjs --list` để biết trang nào đã tô.

**Dịch.** Tài liệu gốc không phải tiếng Việt thì có bản dịch KT-0n (Word), dịch đủ mọi trang được dẫn ở bất cứ tệp nào của bộ hồ
sơ (KT-01, thuyết minh, bản cam kết), không chỉ dòng được tô. Trang chỉ thuyết minh dẫn (yêu cầu điện, khối lượng máy cho phần
lắp đặt) cũng dịch và tô chữ được trích, như trang KT-01 dẫn. Một thiết bị có nhiều tài liệu gốc (KT-02A, KT-02B, KT-02C) thì một bản dịch KT-02 chung: đề mục cấp 1 cho từng tài liệu
("KT-02A: <tên tài liệu>"), cấp 2 cho từng trang ("Trang N: <tên bảng trên trang>"). Dấu chú thích của trang (*, **, †) giữ đủ ở
cả hai cột, cạnh đúng chữ nó gắn; trong `content.json` viết dấu sao thật là `\\*` (không thì `bid-docx` hiểu cặp sao là chữ đậm,
nghiêng và nuốt mất dấu). Mỗi trang một bảng hai cột "Bản gốc (tiếng
Anh) | Bản dịch tiếng Việt" (`bid-check` bỏ qua cột bản gốc), dòng được tô in đậm cả hai cột. Cột bản gốc chỉ chép chữ có trên
trang: không thêm chữ của người dịch ("Highlighted line: ...", "every line", "(hidden when printed)", "(continued on the next
page)", "(continued from previous row)", "all 18 GPUs"); ghi chú của người dịch (chỗ đã ẩn giá, hàng nối từ trang trước) để ở
cột tiếng Việt. `package-check` nêu cặp từ của cột bản gốc không có trên trang gốc. Đề mục trang không đánh số ("Trang 16: Bảng 7",
không "A.1. Trang 16"). Mỗi hàng của bảng dịch là một
hàng của bảng trên trang gốc, không phải một dòng chữ của `pdftotext`: bảng gốc nhiều cột (bảng thông số Tab S11 Ultra và Tab S11,
nhãn bên trái, giá trị bên phải) thì đọc bằng `pdftotext -layout` (hay `-bbox-layout` khi cột lệch) để biết chữ nào thuộc cột nào,
rồi đối chiếu với `pdftotext -raw` và ảnh trang: `-layout` có lúc làm mất nhãn bảng (spec sheet Dell mất "GRAPHICS", "PORTS",
"REGULATORY", nhãn nhóm "NVIDIA:", "Front:", "Rear:"), bản dịch phải có đủ các nhãn đó,
rồi ghi mỗi ô "Nhãn: <tên cột 1>: giá trị; <tên cột 2>: giá trị" ở cả hai cột của bảng dịch. Bảng ma trận dấu tích (bảng GPU
của Arm: mỗi hàng một tính năng, mỗi cột một dòng chip, ô có dấu ✓ hay để trống) thì cột bản gốc ghi "Nhãn / ✓: <tên các cột có
dấu>" (chỉ chữ có trên trang, không thêm "at", "other columns", "all"), cột bản dịch ghi "Nhãn: ✓ ở <tên các cột có dấu>"; đếm
cột bằng tọa độ chữ của `pdftotext -bbox-layout`; cột của chip đang chào ghi đầu tiên. Hàng dài (bảng Tech Specs dồn vào một hàng)
được `bid-docx` cắt qua trang khi ô hơn 700 ký tự, hay khi bảng ghi `"splitRows": true`. Dịch xong đọc lại từng hàng: nhãn
dịch đúng nghĩa nhãn ("Resolution" là "Độ phân giải"), không dịch mảnh vỡ của câu bị ngắt dòng thành nghĩa khác. Tài liệu gốc tiếng Việt (trang của
hãng tại Việt Nam) thì không cần dịch, ghi rõ ở bảng mã. Số, đơn vị, tên riêng, mã linh kiện giữ nguyên; số thập phân trong cột bản dịch viết dấu phẩy.
Mở đầu bản dịch kê tài liệu gốc (tên, phiên bản, số trang, link) và câu của Chương V: nhà thầu chịu trách nhiệm về nội dung và
tính chính xác giữa bản gốc và bản dịch. Không dịch thêm điều trang gốc không có; không bỏ chữ nào của trang, kể cả số chú
thích, chú thích (NOTE), chữ quảng cáo đầu trang (`bid-check` báo số có ở cột bản gốc mà thiếu ở cột bản dịch).

## Thông số chưa có tài liệu

Thông số mà mọi tài liệu tìm được đều không ghi (ECC, quản trị từ xa, vận hành 24/7, chứng nhận 80 Plus, gói bảo hành 36 tháng).
Trước khi kết luận không ghi, tìm chữ trên mọi trang của mọi tài liệu đã tải, cả tiếng Anh lẫn tiếng Việt (nhôm và "Aluminum",
quản trị từ xa và "vPro", "iDRAC", tản nhiệt và "thermal"): thông số hay nằm ở trang khác trang đang dẫn. `bid-check --catalog`
in `XEM Dấu "[chưa có chứng minh: ...]" nhưng KT-03A tr. 8 có "aluminum"` cho việc này; đọc từng trang nó nêu.

- Trong hồ sơ: ô đáp ứng ghi điều tài liệu có, rồi `[chưa có chứng minh: ...]`. Không viết lại câu yêu cầu làm câu đáp ứng,
  không dẫn "xác nhận của Nhà sản xuất khi Chủ đầu tư yêu cầu", không đưa chúng vào một mục "thông số catalogue không thể hiện"
  để coi là đã xong: Mục 3 đòi tài liệu chứng minh nộp cùng hồ sơ, `bid-check` báo LỖI cả ba kiểu.
- Trong báo cáo cho BA: bảng **Giấy tờ phải xin trước khi nộp**, mỗi dòng: thông số, dòng KT-01, xin ai (hãng, nhà phân phối được
  ủy quyền), giấy gì (datasheet của linh kiện, thư xác nhận cấu hình, giấy chứng nhận 80 Plus, xác nhận gói bảo hành), giấy phải
  ghi đúng chữ gì. Có giấy rồi thì giấy đó thành một tài liệu KT-0nC, tô vàng, dẫn trang như mọi tài liệu hãng.
- Linh kiện thêm vào cấu hình (card mạng cho đủ 2 × 10GbE) là một hàng hóa con: có hãng, model, tài liệu hãng riêng, tô vàng
  riêng; chưa có model thì `[cần xác nhận: model card mạng]`.

## Liên danh

Mẫu số 03 Chương IV quy định thành viên đứng đầu nộp E-HSDT và đại diện liên danh trong các phần việc ghi ở thỏa thuận; công việc
và tỷ lệ của từng thành viên ghi ở bảng phân công của thỏa thuận.

- Tên nhà thầu ở mọi chỗ là tên liên danh kèm các thành viên ("Liên danh X, gồm Công ty A (thành viên đứng đầu) và Công ty B").
  Riêng dòng nhà thầu trên bìa chỉ ghi tên liên danh ("NHÀ THẦU: LIÊN DANH X"), để bìa vừa một trang; các thành viên kê ở trang
  trong.
  Thông tin từng thành viên (tên, mã số doanh nghiệp, địa chỉ, người đại diện) lấy từ giấy tờ của chính thành viên đó.
- Phân công trong hồ sơ (ai cung cấp thiết bị, ai làm phần mềm, ai bảo hành phần nào) khớp bảng phân công BA đưa; BA chưa đưa
  thì `[cần xác nhận: phân công trong thỏa thuận liên danh]` ở mục tổ chức thực hiện.
- Ký: tài liệu chung (KT-01, thuyết minh, các bản cam kết về hàng hóa, tiến độ, bảo hành) do đại diện thành viên đứng đầu ký
  "thay mặt liên danh" khi thỏa thuận giao việc đó; cam kết về uy tín (hợp đồng chậm tiến độ, bỏ dở) là lời khai về từng công ty
  nên mọi thành viên cùng ký, mỗi người một cột (`signers`). BA chưa nói thỏa thuận giao gì thì ký theo cách này và hỏi lại.
- Kinh nghiệm, nhân sự, bảo hành của phần việc nào thì nêu đúng thành viên làm phần việc đó.
- Phần mềm do chính một thành viên liên danh làm: tài liệu kỹ thuật phần mềm đứng tên thành viên đó (hãng sản xuất ở KT-01, Mẫu
  10B là thành viên đó, xuất xứ Việt Nam), không gọi là "đơn vị phát triển" hay "nhà thầu phụ".

## KT-00 Mục lục hồ sơ kỹ thuật

Hai bảng: danh mục tài liệu (mã, tên, số trang hay số tệp; dòng của chính KT-00 không ghi số trang, khỏi phải dựng hai lượt); và từng hàng hóa theo Mẫu 01A dẫn tới dòng KT-01, tài liệu hãng,
mục thuyết minh, bản cam kết. Mọi mã nhắc trong bộ tệp phải có trong KT-00, mọi tệp trong KT-00 phải có thật (`package-check.mjs`).
