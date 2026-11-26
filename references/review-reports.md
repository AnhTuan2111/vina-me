# Báo cáo rà soát và báo cáo lỗi

Báo cáo rà soát ghi lại những chỗ sai, chỗ lệch giữa một sản phẩm (trang web, ứng dụng, tài liệu) và nguồn gốc của nó (tài
liệu khách gửi, quyết định, đặc tả), để người nhận sửa hoặc xác nhận. Người nhận kiểm tra báo cáo bằng một câu hỏi: mở chỗ
đó ra thì có thấy như báo cáo nói không. Mọi luật trong tệp này phục vụ câu hỏi ấy.

Tệp này dành cho báo cáo có từ hai mục trở lên, giao thành tệp. Báo một lỗi qua tin nhắn thì theo `document-types.md`, mục
Tin nhắn công việc, và nói ba thứ (chỗ bị, cách thấy lại, đoán lý do) thành câu văn: "Anh ơi, trang `/orders` bấm Lưu thì
trả 500 từ 09:00 ạ. Log ghi timeout ở câu truy vấn bảng `orders`, em đoán thiếu index cột `created_at`, em đang kiểm tra."

## Trước khi viết

Đọc hết nguồn trước khi viết dòng đầu. Tài liệu scan thì vẫn mở ra xem từng trang, vì tên tệp hay trạng thái ghi trong bảng
theo dõi không đáng tin: một tệp tên "truyền thuyết" có thể là hai trang nhận xét viết tay.

Ngay trước khi gửi thì kiểm tra lại trên bản mới nhất; sản phẩm đang được sửa thì ghi giờ kiểm tra. Người dùng chỉ đưa bản
lưu (tệp tải về, thư mục chép từ máy chủ) thì kiểm tra trên bản đó, ghi ở mở đầu là bản lưu lúc nào, và nói trong lời trả
là chưa kiểm tra bản sau giờ đó. Bản lưu không được gọi là "bản đang chạy".

Chỗ nào kiểm tra lại thấy không phải lỗi thì bỏ khỏi báo cáo. Danh sách đã gửi cho ai đó rồi thì giữ số mục, ghi "không phải
lỗi" kèm lý do một câu.

## Mở đầu

Báo cáo mở bằng một đoạn ngắn nói ba thứ: kiểm tra cái gì, lúc nào (ngày, giờ, bản nào); đối chiếu với nguồn nào; và quy
ước trong ảnh, ví dụ "khung đỏ đánh dấu chỗ được nêu".

Báo cáo dài, khoảng mười mục trở lên, thì đoạn này thêm được một câu đếm. Câu đếm chia theo các nhóm có thật trong báo cáo,
như ghi khác nguồn, chưa có nguồn, sản phẩm thiếu thông tin mà tài liệu gốc có, lỗi chính tả, chức năng hỏng. Các số cộng
lại bằng số mục: "Báo cáo có 12 mục: 7 chỗ ghi khác nguồn, 3 chỗ chưa có nguồn, 2 lỗi chính tả." Câu đếm thay cho phần tóm
tắt và kết luận của một báo cáo đủ khung, nên ngoài nó, mở đầu không có đoạn tóm tắt hay kết luận nào.

Khối lặp ở mọi trang (thanh trên cùng, chân trang, menu) đặt tên ở đây, một lần, rồi giữ tên đó ở tên mục, thân mục và chú
thích ảnh.

Xuất Word bằng `scripts/report-docx.mjs` thì một dòng ngắn nói kiểm tra gì, lúc nào, đối chiếu với gì để ở `meta`. Ví dụ
của dòng ấy có trong `docx-export.md`. Câu đếm và tên khối lặp để ở `intro`, vì `meta` in chữ nhỏ màu xám như dòng phụ.

Báo cáo dựa trên tài liệu người khác gửi thì sau đoạn mở liệt kê mỗi tệp chứa gì, mỗi tệp một dòng, vì người nhận thường chỉ
biết tên tệp. Tệp khác với tên của nó, hay khác với trạng thái trong bảng theo dõi, thì nói luôn ở dòng đó. Kể cả khi tệp
đúng loại mà còn thiếu một phần (ô để trống, dòng ghi "sẽ gửi sau"), dòng của tệp viết ngay "bảng theo dõi ghi "Đã nhận",
nhưng tệp còn thiếu…", không để tới phần thiếu mới nói. Con số trong dòng này (bao nhiêu hạng mục, bao nhiêu dòng, bao
nhiêu người) đếm trên tệp, không tính dòng tên cột của CSV hay bảng.

## Mỗi điểm một mục

### Thứ tự các mục

Các mục xếp từ nặng tới nhẹ, theo thứ người dùng cuối dựa vào để hành động. Thứ tự các nhóm:

1. Địa chỉ, giờ, ngày, giá, thứ có làm hay không (dịch vụ, chức năng), số người dùng phải gọi hay nhập (hotline, số tài
   khoản); chức năng hỏng cũng ở nhóm này.
2. Thông tin còn thiếu mà người dùng cần để hiểu nhóm trên (cột ghi chú, điều kiện đi kèm giá).
3. Thông tin về người phụ trách (tên, chức danh, số chứng chỉ) và lời giới thiệu, con số quảng bá.
4. Lỗi trình bày, rồi lỗi chính tả. Lỗi chính tả luôn là các mục cuối của phần.

Báo lỗi cho người sửa code thì xếp theo nhóm khác: mất hay sai dữ liệu, lộ thông tin; chức năng không dùng được; sai kết quả
mà vẫn dùng được; chậm; giao diện, chính tả. Người sửa làm theo thứ tự mục, nên "API `/users` trả cả cột `password_hash`"
đứng trước "nút Xuất Excel lệch 2 px".

Trong một nhóm thì thứ tự linh động. Gặp chỗ nghi ngờ thì hỏi: người dùng đọc sai chỗ này thì có đi nhầm, trả nhầm tiền, gọi
nhầm số không; có thì đưa lên nhóm đầu.

### Tên mục và số mục

Tên mục là một câu khẳng định nói thẳng chỗ sai, có chi tiết: "Toạ độ trên bản đồ lệch khoảng 30 km so với địa chỉ", không
phải "Vấn đề về bản đồ". Mục được đánh số để người nhận trả lời theo số.

Một mục nói một chỗ sai. Hai chỗ chung một gốc thì vẫn tách, rồi ghi "cùng gốc với mục 1". Một khối lặp ở nhiều trang (thanh
trên cùng, chân trang) tính là một chỗ, và mục kể đủ các trang nó hiện. Cùng chữ sai mà nằm ở một khối riêng (khung liên hệ
của một trang) thì là chỗ khác: tách mục, ghi cùng gốc. Hai giá trị sai khác nhau nằm cùng một dòng của một khối (số điện
thoại và email trên một dòng chân trang) vẫn là hai chỗ, vì người nhận sửa hai thứ.

### Nhãn trong thân mục

Thân mục dùng nhãn cố định, cùng thứ tự ở mọi mục. Bộ nhãn chọn theo việc:

| Việc | Nhãn |
|---|---|
| Đối chiếu nội dung với tài liệu gốc | Trên site (hoặc Hiện trạng), Tài liệu gốc, Cần xác nhận |
| Báo lỗi cho người sửa code | Chỗ bị, Thấy lại, Đoán lý do (hoặc Lý do), Cách sửa |

Mỗi nhãn có việc của nó. "Trên site" và "Chỗ bị" nói vị trí cụ thể: trang nào, khối nào, dòng nào, để người nhận tìm ra
trong một lần. "Thấy lại" là các bước hay lệnh làm ra lỗi, kèm kết quả thật (mã trả về, thông báo lỗi nguyên văn). "Đoán lý
do" nói tới tệp, dòng, cấu hình cụ thể; chưa kiểm tra được thì nói vì sao chưa kiểm tra được.

"Cần xác nhận" là một câu hỏi người nhận trả lời được, không phải lời khuyên chung. Câu hỏi chỉ dùng dữ kiện có trong nguồn:
không thêm năm, giờ, số mà nguồn không ghi, không gợi ý giá trị mới. Nó hỏi điều người nhận phải quyết (ô nên ghi gì, có
giữ chữ ấy không), không hỏi lại điều sản phẩm đang ghi mà báo cáo đã trích.

Lỗi nằm hẳn ở phía sản phẩm, không có gì để hỏi, thì vẫn giữ nhãn và ghi "Không cần xác nhận, sửa trên site." Loại này gồm
lỗi gõ, và chỗ sản phẩm ghi khác một tài liệu gốc mà không tài liệu nào khác nói ngược lại (giá khác bảng giá mới nhất, số
hiệu đảo chữ số). Khi đó ghi theo tệp nào: "Không cần xác nhận, sửa theo `bang-gia.csv`, dòng 4." Tài liệu gốc là bản chép
lại, bản viết tay khó đọc, hay hai tài liệu nói khác nhau thì vẫn hỏi; bản viết tay đọc rõ, có người ký, thì tính như mọi
tài liệu gốc khác. Mục cùng gốc với mục trước thì ghi "Cùng câu hỏi ở mục 1."

## Trích và mức chắc chắn

### Trích

Lời trích chép nguyên văn trong ngoặc kép, giữ cả lỗi chính tả của bản gốc, vì lỗi chính tả đó là một phần của chỗ sai.
Chữ của nguồn nhắc lại ở tên mục, chú thích ảnh, câu hỏi cũng giữ chính tả ấy nếu để trong ngoặc kép. Chỗ sai là chính dấu
gạch dài thì tả bằng lời (dấu gạch dài giữa "A" và "B"), không trích cả câu (`punctuation.md`).

Lời trích nói nó nằm ở đâu: trang mấy, mục nào, dòng nào của bảng theo dõi. Bảng theo dõi có mã hạng mục thì gọi bằng mã
("hạng mục E3"). Số dòng của một tệp chữ là số dòng trình soạn thảo hiện, tính cả dòng tên cột; luật không tính dòng tên cột
chỉ dùng khi đếm có bao nhiêu hạng mục, bao nhiêu người.

Ngày, số trong nguồn thiếu một phần (không ghi năm, không ghi đơn vị) thì giữ nguyên cách ghi ở mọi chỗ, kể cả câu hỏi gửi
người nhận (`citations-data-figures.md`, mục Dẫn lời).

### Mức chắc chắn

Mức chắc chắn khớp với việc đã kiểm tra: "đã thử", "suy từ code, chưa xem log", "chữ số viết tay, đọc giống 57 hoặc 58".
Thấy hai thứ trùng nhau thì nói là trùng ("số trên site trùng báo cáo năm trước"), không nói lý do như đã biết ("site còn
lấy báo cáo năm trước"); muốn nói lý do thì nói là đoán. Câu đếm ở mở đầu, lời trả trong chat và mọi chỗ tóm lại giữ mức
chắc chắn của mục: mục ghi "trùng" thì chỗ tóm lại cũng ghi "trùng".

Lời đánh giá kiểu "nói quá" kèm câu bị đánh giá và lý do cụ thể, như không tài liệu gốc nào có ý đó, hay con số lệch với tệp
nào: "Câu 'Hơn 50 kỹ sư hàng đầu' ghi quá: danh sách nhân sự (`nhan-su.csv`) có 23 người." Câu quảng bá có cả con số lẫn chữ
khen ("Hơn 50 kỹ sư hàng đầu", "đơn vị uy tín nhất") thì nói cả hai phần, không dừng ở con số: con số lệch bao nhiêu so với
tệp nào, còn chữ khen thì không tài liệu nào có. Câu hỏi đi kèm hỏi cả hai: "Ô này nên ghi bao nhiêu kỹ sư, và có giữ chữ
"hàng đầu" không?"

### Hai tài liệu gốc nói khác nhau

Đã thấy nguồn gốc tự mâu thuẫn thì ghi luôn, không chọn hộ người nhận. Hai tài liệu gốc nói khác nhau về cùng một chỗ thì
mọi chỗ nhắc tới nó đều giữ cả hai bên.

- Tên mục nêu cả hai tài liệu và nói sản phẩm khớp với bên nào: "Trang Giao hàng ghi miễn phí nội thành như bảng phí, email
  của khách báo thu 20.000 đồng từ 5/3". Tên mục chỉ đặt sản phẩm cạnh một tài liệu thì người đọc lướt danh sách tên mục
  hiểu là sản phẩm sai. Chữ ngầm chọn bên ("vẫn", "còn", "chưa sửa theo", "đã cũ") cũng không dùng, vì chúng coi một bên là
  bản mới.
- Câu hỏi nêu đủ hai phương án, gọi tên từng tài liệu, và hỏi bên nào áp dụng: "Từ 5/3 thu 20.000 đồng như email, hay giữ
  miễn phí như bảng phí?". Điều chỉ có nghĩa khi một bên đúng thì hỏi sau, mở bằng "Nếu…": "Nếu thu phí thì áp dụng cho
  những quận nào?". Đừng hỏi "ghi phí thế nào", "thu ở quận nào" như thể việc thu phí đã chốt.
- Phần thiếu không liệt kê thứ chỉ cần khi một bên đúng, như thể bên đó đã được chốt; viết "nếu áp dụng email thì còn thiếu…".
- Lời trả trong chat chỉ nói "không chọn hộ" khi tên mục, câu hỏi và phần thiếu đều đã giữ cả hai bên.

## Ảnh

Mỗi điểm có ảnh của hai phía nếu có thể: sản phẩm đang ghi gì, và nguồn gốc ghi gì. Nguồn là ảnh, scan, PDF thì luôn cắt ảnh
phía nguồn. Nguồn là tệp chữ (`.txt`, `.csv`, `.md`) thì dựng trang có số dòng rồi chụp vài dòng quanh dòng được nêu, hoặc
chỉ trích kèm tên tệp và số dòng; không chụp nguyên tệp.

Khung đỏ chỉ đóng câu hay ô được nêu, không đóng cả trang. Ảnh cắt sát vùng đó, chừa đủ chữ xung quanh để biết nó nằm ở đâu.
Khung bao hết chữ được trích, kể cả khi chữ nằm ở hai dòng hay hai khối (con số to và dòng chữ nhỏ bên dưới); khung chỉ đóng
được một phần thì lời trích chỉ lấy phần trong khung.

Một câu của sản phẩm có khi chứa chỗ của hai mục, chẳng hạn tên người thuộc một mục, câu giới thiệu sau tên thuộc mục khác.
Khi đó mỗi mục có khung riêng, và phần chữ nằm giữa hai khung là chữ ngoài khung. Mỗi mục trích riêng phần trong khung của
mình, cắt phần còn lại bằng […], hoặc vẽ thêm khung cho phần giữa; không trích cả câu khi khung chỉ bao hai đầu.

Dòng dùng làm đối chứng (giá trị ở khối khác của chính sản phẩm, đặt cạnh để so) cũng đóng khung, và chú thích ghi là khung
đối chứng của mục nào. Không trích một dòng không có khung rồi trỏ "(ảnh ở mục N)".

Chú thích nói ảnh lấy ở đâu và khung đỏ đánh dấu gì: "Hồ sơ gốc, trang 17: hai lần tu sửa". Chữ của nguồn trong chú thích
chép như lời trích, kể cả lỗi chính tả.

Một ảnh dùng cho nhiều mục thì đặt ở mục đầu, các mục sau ghi "ảnh ở mục 4", không lặp ảnh. Nhiều chỗ sai trong cùng một
khối nhỏ (khung liên hệ, một bảng giá) thì chụp một ảnh, mỗi chỗ một khung, chú thích nói khung nào thuộc mục nào.

Ảnh chụp trang web thì chụp trên bản đang chạy (hay bản lưu người dùng đưa), sau khi nội dung đã hiện đủ; trang có hiệu ứng
hiện dần khi cuộn thì cuộn hết trang trước khi chụp. Ảnh cần đặt ở một phần không có mục đánh số (tờ ghi chú ở phần tài liệu
đã nhận) thì dùng `blocks` của phần đó trong `scripts/report-docx.mjs`.

## Phần thiếu

Phần thiếu liệt kê thứ còn thiếu theo từng mục của sản phẩm (trang, chức năng), không theo tên tệp. Mỗi dòng nói đã có gì,
thiếu gì, kèm mã dòng của bảng theo dõi nếu có.

Phần "đã có gì" lấy từ chính các mục đã nêu. Một khối có phần đã đối chiếu được với tài liệu gốc ở một mục, như tên và chức
danh người phụ trách có trong danh sách nhân sự ở mục 2.7, thì dòng của khối đó nói phần nào đã có và ở mục nào, không viết
"tài liệu gốc chưa có phần nào".

"Còn thiếu" chỉ dành cho thứ không tài liệu gốc nào có. Một số đã đếm được trên tài liệu gốc (số người trong danh sách) thì
không ghi là còn thiếu; việc còn lại là chốt ô nên ghi số nào, thì nói vậy và trỏ về mục đã hỏi. Thứ chỉ cần khi một bên của
chỗ hai tài liệu nói khác nhau đúng thì mở bằng "nếu" (mục Trích và mức chắc chắn).

## Giọng

Người nhận nói "chỉ báo cáo", hay báo cáo gửi cho cả nhóm, thì không xưng hô; câu có chủ ngữ là vật hay trang: "Trang chủ
ghi…", "Tài liệu không có…". Gửi đích danh một người thì xưng hô theo quan hệ với người đó, dùng ở câu mở và câu đoán lý do.

Báo cáo chốt một tên cho sản phẩm và một tên cho nguồn, dùng suốt bài, khớp với nhãn. Nhãn là "Trên site" thì tiêu đề, tên
phần, thân mục, chú thích đều gọi "site"; muốn gọi "web" hay "ứng dụng" thì dùng nhãn "Hiện trạng". Nhãn là "Tài liệu gốc"
thì không chỗ nào khác gọi "nguồn", "hồ sơ". Báo cáo phân biệt bản gốc với bản chép lại (bản giấy và bản đánh máy, bản scan
và bản gõ lại) thì đặt tên ngắn cho từng bản ở dòng của tệp trong phần tài liệu đã nhận, rồi giữ tên đó ở tên mục, thân mục,
câu hỏi, không gọi trống bằng tên chung cho một trong hai bản.

Trong thân mục, câu sau nối với câu trước bằng chính chỗ đang nêu. Che câu trước đi mà không biết câu này đứng đây làm gì thì
viết lại. Chỗ hay hỏng nhất là câu dẫn mã hạng mục của bảng theo dõi, nên có một luật cứng: câu ấy luôn mở bằng chủ ngữ trỏ
về chỗ đang nêu, như "Ô này", "Câu này", "Số này", "Thẻ này", "Dòng này". Lỗi đã gặp nhiều lần là câu trước nói chữ khen trong
ô không tài liệu nào có, còn câu sau mở bằng "Số liệu giới thiệu thuộc hạng mục E3…". Chủ ngữ "số liệu giới thiệu" là tên
một nhóm, nên người đọc không biết ô vừa nêu có nằm trong nhóm ấy không. Câu sửa: "Ô này thuộc phần số liệu giới thiệu, hạng
mục E3 của bảng theo dõi, trạng thái "Chưa nhận"." Mở bằng một chủ ngữ mới đứng trơ, kiểu "Khối giới thiệu chưa có: bảng
theo dõi, dòng 12…", cũng hỏng theo cùng một cách.

Câu so hai bên không cần chữ nhấn: "bằng số trên site", không "bằng đúng số trên site"; "tệp chứa gì", không "tệp thật sự
chứa gì".

Lỗi được chỉ ra bằng sự việc và cách sửa, với chữ chê đã nói giảm: "chưa khớp", "cần sửa", không "cẩu thả", "sai bét", "vô
lý". Nói giảm vừa đủ để người nhận không mất mặt, không tới mức họ không biết đó là lỗi. Lỗi làm người đọc làm sai thì viết
thẳng "cần sửa trước khi gửi", không "có lẽ nên cân nhắc xem lại" (`core-rules.md`, mục Soát theo năm phương châm hội thoại).

Báo cáo không có đoạn khen, phần "điểm tốt", bảng chấm điểm, thanh điểm, ma trận ưu tiên, ước lượng thời gian sửa. Nó cũng
không có đoạn kết chung chung: hết mục cuối là hết, vì việc cần người nhận làm đã nằm ở "Cần xác nhận".

## Tự soát trước khi gửi

1. Mở từng chỗ được nêu trên bản mới nhất, xem có còn như báo cáo nói không.
2. So từng lời trích với ảnh: chữ trong ngoặc kép phải thấy được trong khung đỏ, và chú thích không sửa chữ của nguồn. Với mọi
   câu có "(ảnh ở mục N)", mở ảnh mục N, đặt lời trích cạnh từng khung. Chữ nào nằm ngoài khung, kể cả chữ nằm giữa hai khung
   của hai mục, thì cắt lời trích cho bằng khung hoặc vẽ thêm khung.
3. Mỗi khung đỏ có câu trong báo cáo nói về nó.
4. Đọc lần lượt tên các mục, xem nhóm có xếp theo thứ tự nặng tới nhẹ ở trên không, lỗi chính tả có nằm cuối không. Tên mục
   của chỗ hai tài liệu gốc nói khác nhau có nêu đủ hai tài liệu, có nói sản phẩm khớp bên nào không; câu hỏi của mục đó có
   nêu đủ hai phương án không.
5. Tìm mọi chữ gọi sản phẩm (web, site, trang, ứng dụng) và khối lặp; mỗi thứ chỉ còn một tên.
6. Đếm lại trên tệp gốc mọi con số báo cáo tự đếm (số hạng mục, số dòng, số người, số mục, số ảnh), không tính dòng tên cột
   của CSV hay bảng.
7. Đọc lần lượt dòng mô tả từng tệp ở mở đầu: tệp nào bảng theo dõi ghi "Đã nhận" mà còn thiếu một phần thì dòng đó đã nói
   chưa. Rồi đọc từng câu thân mục theo thứ tự, xem câu thứ hai trở đi có nối với câu trước không. Tìm mọi câu có mã hạng mục
   trong thân mục: chủ ngữ phải là "Ô này", "Câu này", "Số này"…
8. Đọc từng dòng phần thiếu, so với các mục nó trỏ tới. Thứ đã đối chiếu được ở một mục không được ghi là còn thiếu hay
   "chưa có phần nào"; thứ chỉ cần khi một bên của chỗ mâu thuẫn đúng thì phải mở bằng "nếu".
9. Tìm dấu gạch dài, gạch vừa trong cả nội dung lẫn chú thích ảnh.
10. Xuất ra định dạng người nhận sẽ mở (PDF, Word) và nhìn từng trang.

## Lời trả trong chat

Lời trả gồm đường dẫn tệp (Word, PDF), số trang, đã kiểm tra gì bằng cách nào, chưa kiểm tra gì, chỗ nào chưa chắc. Cả lời
trả không quá khoảng tám dòng, như `docx-export.md`, mục Lời trả kèm tệp. Lời trả không kể lại các mục; cần nhắc một mục thì
giữ mức chắc chắn của mục đó.

Mỗi câu tả bài nộp phải khớp với bản đã xuất, nên đếm rồi mới nói: "ảnh hai phía ở 6 trên 14 mục, các mục còn lại nguồn là
tệp chữ, trích kèm số dòng". Chưa đếm thì không viết "mỗi chỗ", "mọi ảnh".
