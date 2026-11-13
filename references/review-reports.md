# Báo cáo rà soát và báo cáo lỗi

Loại này ghi lại những chỗ sai, chỗ lệch giữa một sản phẩm (trang web, ứng dụng, tài liệu) và nguồn gốc của nó (tài
liệu khách gửi, quyết định, đặc tả), để người nhận sửa hoặc xác nhận. Người đọc kiểm báo cáo bằng một câu hỏi: mở
đúng chỗ đó ra thì có thấy đúng như báo cáo nói không. Mọi quy tắc dưới đây phục vụ câu hỏi ấy.

## Trước khi viết

- Đọc hết nguồn trước khi viết dòng đầu. Tài liệu scan thì vẫn mở ra xem từng trang. Đừng tin tên tệp hay trạng thái
  ghi trong bảng theo dõi: một tệp tên "truyền thuyết" có thể là hai trang nhận xét viết tay.
- Kiểm lại trên bản mới nhất ngay trước khi gửi. Sản phẩm đang được sửa thì ghi giờ kiểm.
- Người dùng chỉ đưa bản lưu (tệp tải về, thư mục chép từ máy chủ) thì kiểm trên bản đó, ghi ở mở đầu là bản lưu lúc nào, và
  nói trong lời trả là chưa kiểm bản sau giờ đó. Không viết "bản đang chạy" cho bản lưu.
- Chỗ nào kiểm lại thấy không phải lỗi thì bỏ khỏi báo cáo. Đã gửi danh sách cho ai đó rồi thì giữ số, ghi "không phải
  lỗi" kèm lý do một câu.

## Mở đầu

Một đoạn ngắn nói ba thứ:

- kiểm cái gì, lúc nào (ngày, giờ, bản nào);
- đối chiếu với nguồn nào;
- quy ước trong ảnh, ví dụ "khung đỏ đánh dấu chỗ được nêu".

Báo cáo dài (khoảng mười mục trở lên) thì đoạn này thêm được một câu đếm: bao nhiêu chỗ ghi khác nguồn, bao nhiêu chỗ
chưa có nguồn, và nếu có thì bao nhiêu chỗ sản phẩm thiếu thông tin mà tài liệu gốc có. Ba số cộng lại bằng số mục. Câu đếm thay cho phần tóm tắt và kết luận của báo cáo đủ khung; không thêm đoạn nào khác.

Khối lặp ở mọi trang (thanh trên cùng, chân trang, menu) đặt tên ở đây, một lần, rồi giữ tên đó ở tên mục, thân mục và
chú thích ảnh.

Xuất Word bằng `scripts/report-docx.mjs` thì một dòng ngắn kiểm gì, lúc nào, đối chiếu với gì để ở `meta` như ví dụ trong
`references/docx-export.md`; câu đếm và tên khối lặp để ở `intro`, vì `meta` in chữ nhỏ màu xám như dòng phụ.

Sau đó, nếu báo cáo dựa trên tài liệu người khác gửi, liệt kê mỗi tệp chứa gì, mỗi tệp một dòng. Người nhận thường chỉ
biết tên tệp. Tệp khác với tên hay với trạng thái trong bảng theo dõi thì nói luôn ở dòng đó, kể cả khi tệp đúng loại mà
còn thiếu một phần (ô để trống, dòng ghi "sẽ gửi sau"): viết ngay ở dòng của tệp "bảng theo dõi ghi "Đã nhận", nhưng tệp
còn thiếu…", không để tới phần thiếu mới nói. Con số trong dòng này (bao nhiêu hạng mục, bao nhiêu dòng, bao nhiêu người)
đếm trên tệp, không tính dòng tên cột của CSV hay bảng.

## Mỗi điểm một mục

- Xếp từ nặng tới nhẹ, theo thứ người dùng cuối dựa vào để hành động. Thứ tự các nhóm:
  1. Địa chỉ, giờ, ngày, giá, thứ có làm hay không (dịch vụ, chức năng), số người dùng phải gọi hay nhập (hotline, số tài
     khoản); chức năng hỏng cũng ở nhóm này.
  2. Thông tin còn thiếu mà người dùng cần để hiểu nhóm trên (cột ghi chú, điều kiện đi kèm giá).
  3. Thông tin về người phụ trách (tên, chức danh, số chứng chỉ) và lời giới thiệu, con số quảng bá.
  4. Lỗi trình bày, rồi lỗi chính tả. Lỗi chính tả luôn là các mục cuối của phần.

  Trong một nhóm thì thứ tự linh động. Chỗ nghi ngờ thì hỏi: người dùng đọc sai chỗ này thì đi nhầm, trả nhầm tiền, gọi
  nhầm số không; có thì đưa lên nhóm đầu.
- Tên mục là một câu khẳng định nói thẳng chỗ sai, có chi tiết: "Toạ độ trên bản đồ lệch khoảng 30 km so với địa chỉ",
  không phải "Vấn đề về bản đồ".
- Một mục một chỗ sai. Hai chỗ chung một gốc thì vẫn tách, rồi ghi "cùng gốc với mục 1".
- Một khối lặp ở nhiều trang (thanh trên cùng, chân trang) tính là một chỗ, kể đủ các trang nó hiện. Cùng chữ sai mà nằm
  ở một khối riêng (khung liên hệ của một trang) thì là chỗ khác: tách mục, ghi cùng gốc. Hai giá trị sai khác nhau nằm
  cùng một dòng của một khối (số điện thoại và email trên một dòng chân trang) vẫn là hai chỗ, vì người nhận sửa hai thứ.
- Đánh số mục để người nhận trả lời theo số.

Thân mục dùng nhãn cố định, cùng thứ tự ở mọi mục. Chọn bộ nhãn theo việc:

| Việc | Nhãn |
|---|---|
| Đối chiếu nội dung với tài liệu gốc | Trên site (hoặc Hiện trạng), Tài liệu gốc, Cần xác nhận |
| Báo lỗi cho người sửa code | Chỗ bị, Thấy lại, Đoán lý do (hoặc Lý do), Cách sửa |

- "Trên site" và "Chỗ bị" nói đúng vị trí: trang nào, khối nào, dòng nào. Người nhận phải tìm ra trong một lần.
- "Thấy lại" là các bước hoặc lệnh làm ra lỗi, kèm kết quả thật (mã trả về, thông báo lỗi nguyên văn).
- "Đoán lý do" nói tới tệp, dòng, cấu hình cụ thể. Chưa kiểm được thì nói vì sao chưa kiểm được.
- "Cần xác nhận" là một câu hỏi người nhận trả lời được, không phải lời khuyên chung. Câu hỏi chỉ dùng dữ kiện có trong
  nguồn: không thêm năm, giờ, số mà nguồn không ghi, không gợi ý giá trị mới. Câu hỏi hỏi điều người nhận phải quyết (ô
  nên ghi gì, có giữ chữ ấy không), không hỏi lại điều sản phẩm đang ghi mà báo cáo đã trích.
- Lỗi nằm hẳn ở phía sản phẩm, không có gì để hỏi, thì vẫn giữ nhãn và ghi "Không cần xác nhận, sửa trên site." Loại này
  gồm lỗi gõ, và chỗ sản phẩm ghi khác một tài liệu gốc mà không tài liệu nào khác nói ngược lại (giá khác bảng giá mới
  nhất, số hiệu đảo chữ số); khi đó ghi theo tệp nào: "Không cần xác nhận, sửa theo `bang-gia.csv`, dòng 4." Tài liệu gốc
  là bản chép lại, bản viết tay khó đọc, hay hai tài liệu nói khác nhau thì vẫn hỏi; bản viết tay đọc rõ, có người ký, thì
  tính như mọi tài liệu gốc khác. Mục cùng gốc với mục trước thì ghi
  "Cùng câu hỏi ở mục 1."

## Trích và mức chắc chắn

- Trích nguyên văn trong ngoặc kép, giữ cả lỗi chính tả của bản gốc. Lỗi chính tả đó là một phần của chỗ sai. Chữ của
  nguồn nhắc lại ở tên mục, chú thích ảnh, câu hỏi cũng giữ chính tả ấy nếu để trong ngoặc kép. Chỗ sai là chính dấu
  gạch dài thì tả bằng lời (dấu gạch dài giữa "A" và "B"), không trích cả câu (`punctuation.md`).
- Nói chỗ trích nằm ở đâu: trang mấy, mục nào, dòng nào của bảng theo dõi. Bảng theo dõi có mã hạng mục thì gọi bằng mã
  ("hạng mục E3"). Số dòng của một tệp chữ là số dòng trình soạn thảo hiện, tính cả dòng tên cột; luật không tính dòng tên
  cột chỉ dùng khi đếm có bao nhiêu hạng mục, bao nhiêu người.
- Mức chắc chắn đúng như đã kiểm: "đã thử", "suy từ code, chưa xem log", "chữ số viết tay, đọc giống 57 hoặc 58".
  Thấy hai thứ trùng nhau thì nói trùng ("số trên site trùng báo cáo năm trước"), không nói lý do như đã biết ("site còn
  lấy báo cáo năm trước"); muốn nói lý do thì nói là đoán.
- Ngày, số trong nguồn thiếu một phần (không ghi năm, không ghi đơn vị) thì giữ nguyên cách ghi ở mọi chỗ, kể cả câu
  hỏi gửi người nhận (`references/citations-data-figures.md`, mục Dẫn lời).
- Đã thấy nguồn gốc tự mâu thuẫn thì ghi luôn, không chọn hộ người nhận. Hai tài liệu gốc nói khác nhau về cùng một chỗ
  thì mọi chỗ nhắc tới nó đều giữ cả hai bên:
  - Tên mục nêu cả hai tài liệu và nói sản phẩm khớp với bên nào: "Trang Giao hàng ghi miễn phí nội thành như bảng phí,
    email của khách báo thu 20.000 đồng từ 5/3". Tên mục chỉ đặt sản phẩm cạnh một tài liệu thì người đọc lướt danh sách
    tên mục hiểu là sản phẩm sai. Không dùng chữ ngầm chọn bên ("vẫn", "còn", "chưa sửa theo", "đã cũ"): những chữ đó coi
    một bên là bản mới.
  - Câu hỏi nêu đủ hai phương án, gọi tên từng tài liệu, và hỏi bên nào áp dụng: "Từ 5/3 thu 20.000 đồng như email, hay
    giữ miễn phí như bảng phí?". Điều chỉ có nghĩa khi một bên đúng thì hỏi sau, mở bằng "Nếu…": "Nếu thu phí thì áp dụng
    cho những quận nào?". Không hỏi "ghi phí thế nào", "thu ở quận nào" như thể việc thu phí đã chốt.
  - Phần thiếu không liệt kê thứ chỉ cần khi một bên đúng như thể đã chốt; viết "nếu áp dụng email thì còn thiếu…".
  - Lời trả trong chat chỉ nói "không chọn hộ" khi tên mục, câu hỏi và phần thiếu đều đã giữ cả hai bên.
- Lời đánh giá kiểu "nói quá" phải kèm câu bị đánh giá và lý do: không nguồn nào có ý đó.
- Câu quảng bá có cả con số lẫn chữ khen ("Hơn 50 kỹ sư hàng đầu", "đơn vị uy tín nhất") thì nói cả hai phần, không dừng ở
  con số: con số lệch bao nhiêu so với tệp nào, và chữ khen thì không tài liệu nào có. Câu hỏi đi kèm hỏi cả hai: "Ô này
  nên ghi bao nhiêu kỹ sư, và có giữ chữ "hàng đầu" không?"
- Câu đếm ở mở đầu, lời trả trong chat và mọi chỗ tóm lại giữ đúng mức chắc chắn của mục: mục ghi "trùng" thì tóm
  lại cũng ghi "trùng".

## Ảnh

- Mỗi điểm có ảnh của hai phía nếu có thể: sản phẩm đang ghi gì, và nguồn gốc ghi gì. Nguồn là ảnh, scan, PDF thì luôn
  cắt ảnh phía nguồn. Nguồn là tệp chữ (`.txt`, `.csv`, `.md`) thì hoặc dựng trang có số dòng rồi chụp vài dòng quanh
  dòng được nêu, hoặc chỉ trích kèm tên tệp và số dòng; không chụp nguyên tệp.
- Khung đỏ đóng đúng câu hoặc ô được nêu, không đóng cả trang. Cắt ảnh sát vùng đó, chừa đủ chữ xung quanh để biết
  nó nằm ở đâu.
- Khung đỏ bao hết chữ được trích, kể cả khi chữ nằm ở hai dòng hay hai khối (con số to và dòng chữ nhỏ bên dưới). Khung
  chỉ đóng được một phần thì trích đúng phần trong khung.
- Một câu của sản phẩm chứa chỗ của hai mục (tên người thuộc một mục, câu giới thiệu sau tên thuộc mục khác) thì mỗi mục có
  khung riêng, và phần chữ nằm giữa hai khung là chữ ngoài khung. Mỗi mục trích riêng phần trong khung của mình, cắt phần
  còn lại bằng […], hoặc vẽ thêm khung cho phần giữa; không trích cả câu khi khung chỉ bao hai đầu.
- Dòng dùng làm đối chứng (giá trị ở khối khác của chính sản phẩm, đặt cạnh để so) cũng đóng khung, chú thích ghi là khung
  đối chứng của mục nào. Không trích một dòng không có khung rồi trỏ "(ảnh ở mục N)".
- Chú thích nói ảnh lấy ở đâu và khung đỏ đánh dấu gì: "Hồ sơ gốc, trang 17: hai lần tu sửa". Chữ của nguồn trong chú
  thích chép như lời trích, kể cả lỗi chính tả.
- Một ảnh dùng cho nhiều mục thì đặt ở mục đầu, các mục sau ghi "ảnh ở mục 4", không lặp ảnh. Nhiều chỗ sai trong cùng
  một khối nhỏ (khung liên hệ, một bảng giá) thì chụp một ảnh, mỗi chỗ một khung, chú thích nói khung nào thuộc mục nào.
- Ảnh chụp trang web thì chụp trên bản đang chạy (hay bản lưu người dùng đưa), sau khi nội dung đã hiện đủ (trang có
  hiệu ứng hiện dần khi cuộn thì cuộn hết trang trước khi chụp).
- Ảnh cần đặt ở một phần không có mục đánh số (tờ ghi chú ở phần tài liệu đã nhận) thì dùng `blocks` của phần đó trong
  `scripts/report-docx.mjs`.

## Phần thiếu

Liệt kê thứ còn thiếu theo từng mục của sản phẩm (trang, chức năng), không theo tên tệp. Mỗi dòng nói đã có gì, thiếu
gì, kèm mã dòng của bảng theo dõi nếu có.

- Phần "đã có gì" lấy từ chính các mục đã nêu. Một khối có phần đã đối chiếu được với tài liệu gốc ở một mục (tên và chức
  danh người phụ trách có trong danh sách nhân sự, mục 2.7) thì dòng của khối đó nói phần nào đã có và ở mục nào, không
  viết "tài liệu gốc chưa có phần nào".
- "Còn thiếu" chỉ dành cho thứ không tài liệu gốc nào có. Một số đã đếm được trên tài liệu gốc (số người trong danh sách)
  thì không ghi là còn thiếu; việc còn lại là chốt ô nên ghi số nào, thì nói vậy và trỏ về mục đã hỏi.
- Thứ chỉ cần khi một bên của chỗ hai tài liệu nói khác nhau đúng thì mở bằng "nếu" (mục Trích và mức chắc chắn).

## Giọng

- Người nhận nói "chỉ báo cáo" hoặc báo cáo gửi cho cả nhóm thì không xưng hô. Câu có chủ ngữ là vật hoặc trang: "Trang
  chủ ghi…", "Tài liệu không có…".
- Gửi đích danh một người thì xưng hô theo quan hệ với người đó, dùng ở câu mở và câu đoán lý do.
- Chốt một tên cho sản phẩm và một tên cho nguồn, dùng cả bài, khớp với nhãn. Nhãn là "Trên site" thì tiêu đề, tên phần,
  thân mục, chú thích đều gọi "site"; muốn gọi "web" hay "ứng dụng" thì dùng nhãn "Hiện trạng". Nhãn là "Tài liệu gốc" thì
  không chỗ khác gọi "nguồn", "hồ sơ".
- Trong thân mục, câu sau nối với câu trước bằng chính chỗ đang nêu. Câu dẫn mã dòng của bảng theo dõi nói rõ dòng đó
  thuộc chỗ nào: "Ô này nằm trong khối giới thiệu dịch vụ, hạng mục E3 của bảng theo dõi, trạng thái "Chưa
  nhận".", không mở bằng một chủ ngữ mới đứng trơ ("Khối giới thiệu chưa có: bảng theo dõi, dòng 12…"). Che câu trước đi
  mà không biết câu này đứng đây làm gì thì viết lại.
- Luật cứng: câu dẫn mã hạng mục của bảng theo dõi trong thân mục luôn mở bằng chủ ngữ trỏ về chỗ đang nêu: "Ô này", "Câu
  này", "Số này", "Thẻ này", "Dòng này". Lỗi đã gặp nhiều lần: câu trước nói chữ khen trong ô không tài liệu nào có, câu
  sau mở "Số liệu giới thiệu thuộc hạng mục E3…". Chủ ngữ "số liệu giới thiệu" là tên một nhóm, người đọc không biết ô vừa
  nêu có nằm trong nhóm ấy không. Viết: "Ô này thuộc phần số liệu giới thiệu, hạng mục E3 của bảng theo dõi, trạng thái
  "Chưa nhận"."
- Báo cáo phân biệt bản gốc với bản chép lại (bản giấy và bản đánh máy, bản scan và bản gõ lại) thì đặt tên ngắn cho từng
  bản ở dòng của tệp trong phần tài liệu đã nhận, rồi giữ tên đó ở tên mục, thân mục, câu hỏi; không gọi trống tên chung
  cho một trong hai.
- Câu so hai bên không cần chữ nhấn: "bằng số trên site", không "bằng đúng số trên site"; "tệp chứa gì", không "tệp thật
  sự chứa gì".
- Không có đoạn khen, phần "điểm tốt", bảng chấm điểm, thanh điểm, ma trận ưu tiên, ước lượng thời gian sửa.
- Không có đoạn kết chung chung. Hết mục cuối là hết. Cần người nhận làm gì thì đã nằm ở "Cần xác nhận".

## Tự soát trước khi gửi

1. Mở từng chỗ được nêu trên bản mới nhất, xem có còn đúng không.
2. So từng lời trích với ảnh: chữ trong ngoặc kép phải thấy được trong khung đỏ, và chú thích không sửa chữ của nguồn.
   Với mọi câu có "(ảnh ở mục N)", mở ảnh mục N, đặt lời trích cạnh từng khung: chữ nào nằm ngoài khung, kể cả chữ nằm giữa
   hai khung của hai mục, thì cắt lời trích cho bằng khung hoặc vẽ thêm khung.
3. Mỗi khung đỏ có câu trong báo cáo nói về nó.
4. Đọc lần lượt tên các mục, xem nhóm có đúng thứ tự nặng tới nhẹ ở trên không, lỗi chính tả có nằm cuối không. Tên mục của
   chỗ hai tài liệu gốc nói khác nhau có nêu đủ hai tài liệu, có nói sản phẩm khớp bên nào không; câu hỏi của mục đó có
   nêu đủ hai phương án không.
5. Tìm mọi chữ gọi sản phẩm (web, site, trang, ứng dụng) và khối lặp; mỗi thứ chỉ còn một tên.
6. Đếm lại trên tệp gốc mọi con số báo cáo tự đếm (số hạng mục, số dòng, số người, số mục, số ảnh), không tính dòng tên
   cột của CSV hay bảng.
7. Đọc lần lượt dòng mô tả từng tệp ở mở đầu: tệp nào bảng theo dõi ghi "Đã nhận" mà còn thiếu một phần thì dòng đó đã nói
   chưa. Rồi đọc từng câu thân mục theo thứ tự, câu thứ hai trở đi có nối với câu trước không. Tìm mọi câu có mã hạng
   mục trong thân mục: chủ ngữ phải là "Ô này", "Câu này", "Số này"…
8. Đọc từng dòng phần thiếu, so với các mục nó trỏ tới: thứ đã đối chiếu được ở một mục không được ghi là còn thiếu hay
   "chưa có phần nào"; thứ chỉ cần khi một bên của chỗ mâu thuẫn đúng thì đã mở bằng "nếu" chưa.
9. Tìm dấu gạch dài, gạch vừa trong cả nội dung lẫn chú thích ảnh.
10. Xuất ra định dạng người nhận sẽ mở (PDF, Word) và nhìn từng trang.

## Lời trả trong chat

Lời trả gồm đường dẫn tệp (Word, PDF), số trang, đã kiểm gì bằng cách nào, chưa kiểm gì, chỗ nào chưa chắc. Không kể lại
các mục; cần nhắc một mục thì giữ đúng mức chắc chắn của mục đó. Mỗi câu tả bài nộp phải đúng với bản đã xuất: đếm rồi
mới nói ("ảnh hai phía ở 6 trên 14 mục, các mục còn lại nguồn là tệp chữ, trích kèm số dòng"), không viết "mỗi chỗ",
"mọi ảnh" khi chưa đếm.
