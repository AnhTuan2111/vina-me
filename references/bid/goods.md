# Bảng đáp ứng thông số hàng hóa

Thiết bị (máy chủ, máy tính bảng, thiết bị mạng) đáp ứng bằng bảng theo đúng mẫu ở Chương V, thường bốn cột: STT; Yêu cầu
kỹ thuật của E-HSMT; Đáp ứng kỹ thuật của hàng hóa dự thầu; Tài liệu kỹ thuật tham chiếu. Bảng là tệp riêng KT-01 của bộ hồ sơ
(`package.md`); tài liệu hãng là các tệp KT-0nA, KT-0nB đã tô vàng. Tỉ lệ cột ở mục Cách điền.

## Cách điền

- Mỗi hạng mục một bảng (hoặc một nhóm hàng trong bảng), mở bằng đề mục mang đúng tên hạng mục trong HSMT, kể cả lỗi chính tả
  của HSMT.
- Hàng đầu (hàng nhóm, đậm): hãng, model, xuất xứ, năm sản xuất, số lượng theo Mẫu 01A.
- Cột yêu cầu: chép theo ảnh trang của Chương V, mỗi thông số một hàng, giữ ký hiệu ≥ ≤.
- Một hàng yêu cầu có nhiều ý (tối thiểu 8 nhân, tiến trình ≤ 4nm, hoặc Dimensity 9400+) thì ô đáp ứng trả lời từng ý, ý nào tài
  liệu có số liệu thì dẫn và trích số liệu đó ("3nm"), kể cả khi hàng chào đã đúng phương án nêu trong ngoặc. Bảng truy vết tách
  mỗi ý một dòng con để không sót.
- Catalog BA gửi ghi thông số nào thì dòng đó dẫn catalog BA gửi (trang, chữ trích), kể cả khi đã có tài liệu khác ghi rõ hơn: BA
  và người chấm mở catalog đó trước.
- Tỉ lệ cột 8, 30, 40, 22. Cột tham chiếu ngắn: bảng mã ở đầu KT-01 gọi tên tài liệu một lần ("KT-02A: Dell Precision 7960 Tower
  Setup and Specifications, Rev. A08"), trong bảng chỉ ghi "KT-02A, tr. 16, bảng 7".
- Cột đáp ứng: con số thật của cấu hình chào ("16 khe DIMM", "02 ổ NVMe 1 TB"), không chép lại mức yêu cầu (≥ 960 GB) và không
  chỉ ghi "Đáp ứng". Catalog có tùy chọn đạt mức (ổ 1 TB cho yêu cầu 960 GB) thì chào đúng tùy chọn đó, dẫn trang, không đánh
  dấu; chỉ đánh dấu khi catalog không có tùy chọn nào đạt hoặc ghi chung chung ("Up to 12 TB"). Hơn yêu cầu
  thì thêm "(tốt hơn)"; tương đương thì ghi theo nội hàm tương đương nào của HSMT (chứng nhận tương đương, tính năng, công
  suất…) và lý do.
- Cột tham chiếu: mã tài liệu, trang, mục hoặc bảng ("KT-02A, tr. 16 (bảng 9)"; số bảng, số hình để trong ngoặc, hai bảng thì
  "(bảng 9, bảng 10)": bid-check và package-check đọc "tr. 19, bảng 9, 10" là một trang, số sau "bảng" là số bảng). Dùng số trang của tệp PDF (`bid-check
  --catalog KT-02A=<tệp>` soát theo số đó); trang in khác trang tệp thì nói rõ ở bảng mã đầu KT-01. Trang nào được dẫn thì trang
  đó có chỗ tô vàng đúng chữ được trích (`package.md`, mục Tô vàng).
- Câu nói tài liệu hãng ghi gì phải trích đúng chữ của trang được dẫn, trong ngoặc kép: KT-02A ghi "Tower", "Platinum". Trích
  chữ mang con số đáp ứng ("512 GB/1 TB", không chỉ "PCIe NVMe Gen4 x4"), lấy ở đúng trường có nhãn khớp yêu cầu: cổng kết nối
  lấy ở trường "Cổng đa năng" hay "Interface", không lấy ở trường "Earjack" dù cùng chữ "USB Type-C"; trường có nhãn thì trích kèm
  nhãn ("Cổng đa năng (USB Type-C)"). Trích trọn cụm, không cắt giữa cụm danh từ ("enhanced 3nm processor", không dừng ở
  "enhanced 3nm"). Giá trị đứng dưới nhãn trên trang dạng bảng ("Wi-Fi" trên dòng "802.11a/b/g/n/ac/ax ...") thì trích và tô cả
  nhãn, kể cả khi ô đáp ứng đã có chữ trùng nhãn ở lời của nhà thầu.
  Nhãn và giá trị nằm hai dòng (trang thông số dạng bảng) thì trích cả hai trong ngoặc: KT-03A ghi "Bộ nhớ đệm (GB)": "12";
  không viết giá trị ngoài ngoặc ("... là 12"), vì giá trị mới là thông số phải tô.
  `bid-check --catalog` tìm từng chữ trích trên trang dẫn. Nhận định bất lợi cho chính hồ sơ (máy chào thuộc dòng
  máy trạm, không đạt một thông số) không viết vào thân hồ sơ: đánh dấu ở ô đó (`[cần xác nhận: giải trình tương đương hay đổi
  model]`) và giải thích trong báo cáo cho BA.
- Catalog không ghi thông số đó: tìm tiếp tài liệu chính thức khác của hãng, của hãng linh kiện (`package.md`, mục Tìm); vẫn
  không có thì cột đáp ứng ghi điều tài liệu đã có liên quan tới yêu cầu (tản nhiệt: các đầu nối quạt hệ thống ở bảng bo mạch;
  vận hành liên tục: dải nhiệt độ hoạt động, nguồn dự phòng), dẫn trang, tô vàng, rồi `[chưa có chứng minh: ...]` cho phần còn
  thiếu. Ô chỉ có dấu mà không ghi gì là bỏ trống chứng cứ đang có; và thông số vào bảng giấy tờ phải xin trong
  báo cáo. Không ghi "đáp ứng", không chép lại câu yêu cầu làm câu đáp ứng ("Hỗ trợ quản trị, giám sát phần cứng từ xa" đáp cho
  chính câu đó), không dẫn "xác nhận của Nhà sản xuất khi Chủ đầu tư yêu cầu".
- Chứng nhận, tiêu chuẩn (80 Plus, Energy Star, TPM 2.0, ISO) phải có đúng tên trên trang dẫn. Catalog chỉ ghi "Platinum" thì
  chưa chứng minh "80 Plus Platinum": ghi "Catalog ghi "Platinum"" kèm `[chưa có chứng minh: chứng nhận 80 Plus]`, không ghi "tốt hơn".
- HSMT đòi hình ảnh sản phẩm (Mục 3, Chương V) thì mỗi thiết bị có một hình: cắt ảnh máy từ trang catalog (`pdftoppm -f N -l N`,
  cắt bằng công cụ ảnh có sẵn) và đặt bằng khối `figure`, chú thích dẫn trang catalog; cắt sát thân máy, bỏ đường chú thích (không tẩy, vẽ đè lên ảnh của hãng; đường chú dẫn chạy ngang thân máy thì chọn ảnh khác
  của hãng không có chú dẫn, như ảnh ở spec sheet, trang sản phẩm, rồi dẫn đúng nguồn ảnh đó),
  số chú dẫn của catalog (xem ảnh sau khi cắt, mép ảnh không còn đường kẻ cụt); chưa có catalog thì
  `[cần bổ sung: hình ảnh sản phẩm]`.
- Chương V nêu sẵn linh kiện thay thế trong ngoặc ("tiến trình ≤ 4nm (hoặc MediaTek Dimensity 9400+ / Qualcomm Snapdragon 8 Gen
  3 hoặc tương đương)", "(hoặc ARM Immortalis-G925 hoặc tương đương)"): hàng chào dùng đúng linh kiện được nêu thì dòng đó đáp ứng
  theo phương án ấy, chứng minh bằng trang tài liệu ghi tên linh kiện trong máy; vẫn dẫn thêm trang của hãng linh kiện ghi số liệu
  (tiến trình, số nhân, API đồ họa) khi tìm được, để người chấm không phải tự suy.
- Tài liệu hãng ghi hai mức cho một thông số (pin 8.400 mAh "điển hình", định mức tối thiểu 8.160 mAh): ô đáp ứng ghi mức hãng
  công bố kèm chữ "điển hình" như hãng viết; báo cáo cho BA nêu rủi ro mức tối thiểu thấp hơn yêu cầu.
- Trang cấu hình đặt hàng (dell.com/shop) có tùy chọn kèm mã ràng buộc ("RAID 1 ... F1" chỉ đi với một loại vỏ, bộ nguồn): trích
  đúng tên tùy chọn như trang ghi, và ô đáp ứng nêu cấu hình chào gồm cả tùy chọn mà ràng buộc đòi (vỏ, bộ nguồn), dẫn trang của
  từng tùy chọn; trang không nói rõ ràng buộc thì đánh dấu `[cần xác nhận: tùy chọn đi kèm]`.
- Ô tham chiếu dẫn nhiều trang của một tài liệu: "KT-02A, tr. 19, 30" hoặc "KT-02A, tr. 30 (bảng 25); tr. 19 (bảng 10)".
- Gọi giá trị bằng đúng nhãn in trên trang: "PCIe NVMe Gen4 x4" nằm ở cột "Interface type" thì là giao tiếp, không gọi là "loại
  ổ"; trích kèm ô định danh của hàng (tên ổ, mã tùy chọn) để người chấm biết hàng nào. Giá trị trích khác cấu hình chào (trang ghi
  Gen4, ổ chào Gen5) thì không dùng chữ đó làm chứng minh.
- Bảng có tiêu đề cột (bảng ổ đĩa: "Storage type", "Interface type", "Capacity"; bảng nguồn: "Option two"; chính sách bảo hành:
  "Thời hạn bảo hành") thì chữ trích ghi kèm tên cột ("Capacity": "4 TB") và marks tô cả ô tiêu đề cột lẫn ô giá trị, như nhãn đầu
  hàng. Thiếu tô tiêu đề cột là lỗi bị trừ ở mọi lần chấm.
- Máy không có cổng hình trên bo mạch (trang hãng ghi "Video port(s): Not supported") mà hồ sơ cần màn hình quản trị tại chỗ, hay
  phần mềm chào chạy mô hình cần GPU: chào sẵn card đồ họa có trong danh mục tùy chọn của hãng (dẫn trang đó) kèm
  `[cần xác nhận: kèm card đồ họa]`, ô đáp ứng nói rõ trang hãng ghi máy không có cổng hình; thuyết minh và tài liệu phần mềm nói
  đúng cấu hình đó, không cho chạy mô hình trên máy không có card.
- Số đếm ở cột đáp ứng ("08 khe") bằng số mục đã trích và tô; trích được ít hơn thì ghi đúng số trích được, phần còn lại đánh dấu.
- Mọi thông số nêu ở cột đáp ứng có chữ trích và chỗ tô, kể cả số đếm ("06 đầu nối quạt hệ thống" thì trích và tô đủ các hàng
  "FAN SYS0" tới "FAN SYS5" của bảng đầu nối). Tô nhãn thì tô cả giá trị cùng hàng, tô giá trị thì tô cả nhãn ("Operating
  temperature" cùng "10°C to 35°C"; "EPEAT" cùng "Yes").
- Chữ trích lấy trọn ô của trang, kể cả khi ô xuống dòng ("Khe cắm tai nghe/Khe cắm đa năng (USB Type-C)", không "cắm đa năng
  (USB Type-C)"; "Intel® Ethernet Network Adapter X710-T2L", không "Adapter X710-T2L"); `bid-check` nêu chữ trích bắt đầu hay
  dừng giữa một ô. Giá trị có dấu inch (`11.0" (278.1mm)`) thì đặt trong ngoặc cong “ ”, ngoặc thẳng bên trong không cắt chữ trích.
- Trang cấu hình đặt hàng in ra mang trạng thái chọn mặc định của trang (ô đã tích, khối "Tech Specs" của cấu hình mặc định):
  chỉ dẫn dòng tùy chọn được chào, không dẫn khối Tech Specs (`package.md`, mục Tìm), và bảng mã ghi rõ phần chọn sẵn trên bản in
  không phải cấu hình chào. Tùy chọn đáp ứng thông số này mà ràng buộc mã loại trừ tùy chọn đáp ứng thông số khác (RAID 1 cho ổ
  NVMe chỉ đi với nguồn Gold, trong khi HSMT cần nguồn Platinum) thì ô đáp ứng ghi cả hai ràng buộc và
  `[cần xác nhận: cấu hình ... với hãng]`, đưa vào báo cáo; không chọn một bên rồi lờ bên kia.
- Thông số không đạt (ví dụ cần 2 cổng 10GbE, máy có 1): ghi đúng hiện trạng và `[cần xác nhận: thêm card mạng hay đổi model]`.
- Loại thiết bị phải khớp (HSMT đòi máy chủ dạng tháp mà model là máy trạm): ghi `[cần xác nhận: giải trình tương đương hay đổi
  model]`.
- Không có catalog cho hạng mục mà BA đã nêu model: tự tìm tài liệu chính thức của hãng (`package.md`). Chưa có model: vẫn dựng
  đủ bảng với cột yêu cầu, cột đáp ứng và tham chiếu để `[cần bổ sung: model, catalog]`.
- Chọn tùy chọn cụ thể (ổ 4 TB) mà tài liệu chỉ ghi chung ("Up to 12 TB") thì chưa chứng minh có tùy chọn đó: ghi chữ tài liệu có
  và `[chưa có chứng minh: tùy chọn ổ ... trong cấu hình đặt hàng]`, hoặc tìm tài liệu của chính ổ đó.
- Chương V không có dòng bảo hành riêng cho một thiết bị (máy tính bảng): thời hạn theo mức chung của Mục 3 (tiêu chuẩn của nhà
  sản xuất, tối thiểu 12 tháng); tìm chính sách bảo hành của hãng tại Việt Nam cho model đó và dẫn; chưa có thì đánh dấu và đưa
  vào giấy tờ phải xin.
- Bảo hành thiết bị: chứng minh là tài liệu của hãng (gói bảo hành, chính sách bảo hành có thời hạn), không phải bản cam kết của
  chính nhà thầu. Tài liệu phải nói gói bảo hành áp cho đúng model và thị trường cung cấp: cấu hình mặc định trên cửa hàng của hãng
  ở nước khác chỉ cho biết có gói đó, nên vẫn ghi `[cần xác nhận: xác nhận gói bảo hành ... tại Việt Nam]` và đưa vào giấy tờ phải
  xin. HSMT đòi dài hơn mức chuẩn của hãng (máy chủ 36 tháng) mà chưa có tài liệu gói bảo hành thì cột đáp ứng ghi
  thời hạn kèm `[cần xác nhận: gói bảo hành 36 tháng của hãng]`; cột tham chiếu được dẫn thêm bản cam kết nhưng không thay
  được tài liệu hãng. Cùng luật cho mọi thông số mà chỉ có lời cam kết của nhà thầu (24/7, vận hành liên tục).

## Vật tư, phụ tùng thay thế

HSMT mua sắm hàng hóa thường có điều về vật tư, phụ tùng thay thế (E-CDNT 15.10 mẫu thông dụng): nhà thầu phải cung cấp danh
mục, giá, nhà cung cấp của vật tư, phụ tùng cần cho vận hành trong thời gian quy định. Đọc đúng chữ của điều đó trong HSMT và
viết thành mục riêng (thường trong phần bảo hành, bảo trì), theo đúng mức HSMT đòi: HSMT ghi "phải cung cấp" thì không viết
thành "nếu Chủ đầu tư yêu cầu". Chưa có danh mục, giá thì để `[cần bổ sung: danh mục, giá vật tư phụ tùng]`.

## Các bảng khác nhắc lại thông số

- Bảng kê sai khác, danh mục tài liệu, Mẫu 10B, bản cam kết nhắc lại thông số nào thì giữ đúng trạng thái của dòng đó ở bảng đáp
  ứng: dòng đã đánh dấu chưa có chứng minh thì chỗ nhắc lại cũng đánh dấu, không viết "Đáp ứng theo cấu hình đặt hàng". `bid-check`
  báo câu vừa nói tài liệu chưa ghi vừa ghi "đáp ứng". Một dòng chỉ một trạng thái ở mọi chỗ: dòng còn dấu thì không kê "tốt hơn".
- Bảng kê sai khác là lời kê khai của nhà thầu với Chủ đầu tư (E-CDNT 15.9): chỉ kê chỗ hàng chào thật sự khác yêu cầu và nhà
  thầu chấp nhận khác (thông số thấp hơn, thiếu một chức năng). Dòng đáp ứng tương đương theo nội hàm của Chương V (máy dạng tháp
  cho yêu cầu Tower Server) là đáp ứng, không phải sai khác; dòng đang chờ giấy tờ cũng không phải sai khác. Không có gì khác thì
  ghi một câu "Hàng hóa chào thầu không có nội dung sai khác, ngoại lệ so với yêu cầu của Chương V." Không viết thành danh sách
  việc chờ: điều chờ BA chỉ nằm trong chỗ đánh dấu.
- Mẫu 10B (STT, danh mục, ký mã hiệu, nhãn hiệu, hãng, xuất xứ, năm sản xuất) có nhiều cột hẹp: ô chưa biết để chữ ngắn
  "[cần bổ sung]", không nhét câu đánh dấu dài vào cột hẹp (ô cao mười dòng, mỗi dòng một chữ). Không viết đoạn "Ghi chú: ô
  [cần bổ sung] là..." vào thân hồ sơ: giải thích chỗ đánh dấu thuộc về báo cáo cho BA.
- Bảng Mẫu 10B dựng 6 cột, gộp xuất xứ và năm sản xuất: STT, danh mục, ký mã hiệu và nhãn hiệu, hãng sản xuất, xuất xứ và năm
  sản xuất, số lượng; tỉ lệ 6/20/18/19/18/19. `bid-docx` báo tiêu đề cột xếp mỗi dòng một tiếng hay chữ ngắn gãy dòng thì nới
  cột đó, lấy bớt từ cột danh mục.
- Mẫu 10B cho hạng mục phần mềm do nhà thầu hay đơn vị phát triển làm ra: ký mã hiệu là tên phần mềm (kèm phiên bản nếu có),
  hãng là đơn vị phát triển, xuất xứ theo nơi phát triển, năm là năm bàn giao; mỗi ô đó đánh dấu `[cần xác nhận]` khi BA chưa
  chốt. Hạng mục dịch vụ (triển khai, đào tạo, bảo hành) ghi tên dịch vụ, đơn vị thực hiện, các cột ký mã hiệu, xuất xứ, năm
  sản xuất ghi đúng chữ ghi chú của Mẫu 10B trong HSMT (thường là "không có"; thiếu ký mã hiệu, xuất xứ thì hồ sơ không được xem
  xét, nên đọc kỹ ghi chú đó). Hỏi BA cách điền trên hệ thống nếu HSMT có hướng dẫn khác.

## Sau bảng

- Câu cam kết: hàng mới 100%, sản xuất từ năm HSMT đòi, chưa qua sử dụng, nguồn gốc xuất xứ rõ ràng, nguyên đai nguyên kiện.
- Danh mục tài liệu nộp kèm là KT-00 (`package.md`): tài liệu gốc đã tô vàng, link website chính thức và ngày tải, bản dịch
  tiếng Việt; xếp theo số thứ tự hàng hóa trong Biểu phạm vi cung cấp.
- Hai hàng tiêu chí tương đương, gây hạn chế và hai đoạn cam kết khai trung thực theo đúng mẫu Chương V (`package.md`, mục KT-01).
