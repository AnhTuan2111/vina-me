# Bảng đáp ứng thông số hàng hóa

Thiết bị (máy chủ, máy tính bảng, thiết bị mạng) đáp ứng bằng bảng theo đúng mẫu ở Chương V, thường bốn cột: STT; Yêu cầu
kỹ thuật của E-HSMT; Đáp ứng kỹ thuật của hàng hóa dự thầu; Tài liệu kỹ thuật tham chiếu. Tỉ lệ cột ở mục Cách điền.

## Cách điền

- Mỗi hạng mục một bảng (hoặc một nhóm hàng trong bảng), mở bằng đề mục mang đúng tên hạng mục trong HSMT, kể cả lỗi chính tả
  của HSMT.
- Hàng đầu (hàng nhóm, đậm): hãng, model, xuất xứ, năm sản xuất, số lượng theo Mẫu 01A.
- Cột yêu cầu: chép theo ảnh trang của Chương V, mỗi thông số một hàng, giữ ký hiệu ≥ ≤.
- Tỉ lệ cột 8, 30, 40, 22. Cột tham chiếu ngắn: câu mở trước bảng gọi tên tài liệu một lần ("Catalog là tài liệu Dell Precision
  7960 Tower Setup and Specifications, Rev. A08"), trong bảng chỉ ghi "Catalog, tr. 16, bảng 7".
- Cột đáp ứng: con số thật của cấu hình chào ("16 khe DIMM", "02 ổ NVMe 1 TB"), không chép lại mức yêu cầu (≥ 960 GB) và không
  chỉ ghi "Đáp ứng". Catalog có tùy chọn đạt mức (ổ 1 TB cho yêu cầu 960 GB) thì chào đúng tùy chọn đó, dẫn trang, không đánh
  dấu; chỉ đánh dấu khi catalog không có tùy chọn nào đạt hoặc ghi chung chung ("Up to 12 TB"). Hơn yêu cầu
  thì thêm "(tốt hơn)"; tương đương thì ghi theo nội hàm tương đương nào của HSMT (chứng nhận tương đương, tính năng, công
  suất…) và lý do.
- Cột tham chiếu: tên tài liệu, trang, mục hoặc bảng ("Catalog, tr. 16, bảng 9"). Dùng số trang của tệp PDF (`bid-check
  --catalog` soát theo số đó); trang in khác trang tệp thì nói rõ ở danh mục tài liệu nộp kèm.
- Câu nói catalog ghi gì phải trích đúng chữ tiếng Anh của trang được dẫn, trong ngoặc kép: Catalog ghi "Tower", "Platinum".
  `bid-check --catalog` tìm từng chữ trích trên trang dẫn. Nhận định bất lợi cho chính hồ sơ (máy chào thuộc dòng
  máy trạm, không đạt một thông số) không viết vào thân hồ sơ: đánh dấu ở ô đó (`[cần xác nhận: giải trình tương đương hay đổi
  model]`) và giải thích trong báo cáo cho BA.
- Catalog không ghi thông số đó: cột đáp ứng ghi điều catalog có, rồi `[chưa có chứng minh: ...]`; không ghi "đáp ứng".
- Chứng nhận, tiêu chuẩn (80 Plus, Energy Star, TPM 2.0, ISO) phải có đúng tên trên trang dẫn. Catalog chỉ ghi "Platinum" thì
  chưa chứng minh "80 Plus Platinum": ghi "Catalog ghi "Platinum"" kèm `[chưa có chứng minh: chứng nhận 80 Plus]`, không ghi "tốt hơn".
- HSMT đòi hình ảnh sản phẩm (Mục 3, Chương V) thì mỗi thiết bị có một hình: cắt ảnh máy từ trang catalog (`pdftoppm -f N -l N`,
  cắt bằng công cụ ảnh có sẵn) và đặt bằng khối `figure`, chú thích dẫn trang catalog; cắt sát thân máy, bỏ đường chú thích,
  số chú dẫn của catalog (xem ảnh sau khi cắt, mép ảnh không còn đường kẻ cụt); chưa có catalog thì
  `[cần bổ sung: hình ảnh sản phẩm]`.
- Thông số không đạt (ví dụ cần 2 cổng 10GbE, máy có 1): ghi đúng hiện trạng và `[cần xác nhận: thêm card mạng hay đổi model]`.
- Loại thiết bị phải khớp (HSMT đòi máy chủ dạng tháp mà model là máy trạm): ghi `[cần xác nhận: giải trình tương đương hay đổi
  model]`.
- Không có catalog cho hạng mục: vẫn dựng đủ bảng với cột yêu cầu, cột đáp ứng và tham chiếu để `[cần bổ sung: model, catalog]`.
- Bảo hành thiết bị: chứng minh là tài liệu của hãng (gói bảo hành, chính sách bảo hành có thời hạn), không phải bản cam kết của
  chính nhà thầu. HSMT đòi dài hơn mức chuẩn của hãng (máy chủ 36 tháng) mà chưa có tài liệu gói bảo hành thì cột đáp ứng ghi
  thời hạn kèm `[cần xác nhận: gói bảo hành 36 tháng của hãng]`; cột tham chiếu được dẫn thêm bản cam kết nhưng không thay
  được tài liệu hãng. Cùng luật cho mọi thông số mà chỉ có lời cam kết của nhà thầu (24/7, vận hành liên tục).

## Vật tư, phụ tùng thay thế

HSMT mua sắm hàng hóa thường có điều về vật tư, phụ tùng thay thế (E-CDNT 15.10 mẫu thông dụng): nhà thầu phải cung cấp danh
mục, giá, nhà cung cấp của vật tư, phụ tùng cần cho vận hành trong thời gian quy định. Đọc đúng chữ của điều đó trong HSMT và
viết thành mục riêng (thường trong phần bảo hành, bảo trì), theo đúng mức HSMT đòi: HSMT ghi "phải cung cấp" thì không viết
thành "nếu Chủ đầu tư yêu cầu". Chưa có danh mục, giá thì để `[cần bổ sung: danh mục, giá vật tư phụ tùng]`.

## Các bảng khác nhắc lại thông số

- Bảng kê sai khác, danh mục tài liệu, Mẫu 10B, bản cam kết nhắc lại thông số nào thì giữ đúng trạng thái của dòng đó ở bảng đáp
  ứng: dòng đã đánh dấu chưa có chứng minh thì chỗ nhắc lại cũng đánh dấu, không viết "Đáp ứng theo cấu hình đặt hàng". Bảng kê
  sai khác liệt kê đủ mọi dòng có đánh dấu của bảng đáp ứng. `bid-check` báo câu vừa nói tài liệu chưa ghi vừa ghi "đáp ứng".
- Bảng kê sai khác là lời kê khai của nhà thầu với Chủ đầu tư (E-CDNT 15.9): câu mở "Nhà thầu kê các nội dung sai khác, ngoại
  lệ so với yêu cầu của Chương V như sau:", mỗi dòng ghi yêu cầu, nội dung chào và chỗ sai khác. Không viết thành danh sách việc
  chờ ("còn chờ tài liệu", "chờ xác nhận cấu hình"): điều chờ BA chỉ nằm trong chỗ đánh dấu.
- Mẫu 10B (STT, danh mục, ký mã hiệu, nhãn hiệu, hãng, xuất xứ, năm sản xuất) có nhiều cột hẹp: ô chưa biết để chữ ngắn
  "[cần bổ sung]", không nhét câu đánh dấu dài vào cột hẹp (ô cao mười dòng, mỗi dòng một chữ). Không viết đoạn "Ghi chú: ô
  [cần bổ sung] là..." vào thân hồ sơ: giải thích chỗ đánh dấu thuộc về báo cáo cho BA.
- Bảng Mẫu 10B dựng 6 cột, gộp xuất xứ và năm sản xuất: STT, danh mục, ký mã hiệu và nhãn hiệu, hãng sản xuất, xuất xứ và năm
  sản xuất, số lượng; tỉ lệ 6/27/21/18/17/11. `bid-docx` báo tiêu đề cột xếp mỗi dòng một tiếng hay chữ ngắn gãy dòng thì nới
  cột đó, lấy bớt từ cột danh mục.
- Mẫu 10B cho hạng mục phần mềm do nhà thầu hay đơn vị phát triển làm ra: ký mã hiệu là tên phần mềm (kèm phiên bản nếu có),
  hãng là đơn vị phát triển, xuất xứ theo nơi phát triển, năm là năm bàn giao; mỗi ô đó đánh dấu `[cần xác nhận]` khi BA chưa
  chốt. Hạng mục dịch vụ (triển khai, đào tạo, bảo hành) ghi tên dịch vụ, đơn vị thực hiện, các cột ký mã hiệu, xuất xứ, năm
  sản xuất ghi đúng chữ ghi chú của Mẫu 10B trong HSMT (thường là "không có"; thiếu ký mã hiệu, xuất xứ thì hồ sơ không được xem
  xét, nên đọc kỹ ghi chú đó). Hỏi BA cách điền trên hệ thống nếu HSMT có hướng dẫn khác.

## Sau bảng

- Câu cam kết: hàng mới 100%, sản xuất từ năm HSMT đòi, chưa qua sử dụng, nguồn gốc xuất xứ rõ ràng, nguyên đai nguyên kiện.
- Danh mục tài liệu nộp kèm: catalog, link website chính thức của nhà sản xuất, bản dịch tiếng Việt, bản đánh dấu thông số;
  xếp theo số thứ tự hàng hóa trong Biểu phạm vi cung cấp.
- Câu cam kết khai trung thực theo mẫu Chương V.
