# Báo cáo rà soát và báo cáo lỗi

Loại này ghi lại những chỗ sai, chỗ lệch giữa một sản phẩm (trang web, ứng dụng, tài liệu) và nguồn gốc của nó (tài
liệu khách gửi, quyết định, đặc tả), để người nhận sửa hoặc xác nhận. Người đọc kiểm báo cáo bằng một câu hỏi: mở
đúng chỗ đó ra thì có thấy đúng như báo cáo nói không. Mọi quy tắc dưới đây phục vụ câu hỏi ấy.

## Trước khi viết

- Đọc hết nguồn trước khi viết dòng đầu. Tài liệu scan thì vẫn mở ra xem từng trang. Đừng tin tên tệp hay trạng thái
  ghi trong bảng theo dõi: một tệp tên "truyền thuyết" có thể là hai trang nhận xét viết tay.
- Kiểm lại trên bản mới nhất ngay trước khi gửi. Sản phẩm đang được sửa thì ghi giờ kiểm.
- Chỗ nào kiểm lại thấy không phải lỗi thì bỏ khỏi báo cáo. Đã gửi danh sách cho ai đó rồi thì giữ số, ghi "không phải
  lỗi" kèm lý do một câu.

## Mở đầu

Một đoạn ngắn nói ba thứ:

- kiểm cái gì, lúc nào (ngày, giờ, bản nào);
- đối chiếu với nguồn nào;
- quy ước trong ảnh, ví dụ "khung đỏ đánh dấu chỗ được nêu".

Sau đó, nếu báo cáo dựa trên tài liệu người khác gửi, liệt kê tài liệu đó thật sự chứa gì, mỗi tệp một dòng. Người
nhận thường chỉ biết tên tệp.

## Mỗi điểm một mục

- Xếp từ nặng tới nhẹ. Nặng là làm sai thông tin người dùng cuối dựa vào (địa chỉ, giờ, ngày, số hiệu), hoặc làm hỏng
  một chức năng.
- Tên mục là một câu khẳng định nói thẳng chỗ sai, có chi tiết: "Toạ độ trên bản đồ lệch khoảng 30 km so với địa chỉ",
  không phải "Vấn đề về bản đồ".
- Một mục một chỗ sai. Hai chỗ chung một gốc thì vẫn tách, rồi ghi "cùng gốc với mục 1".
- Đánh số mục để người nhận trả lời theo số.

Thân mục dùng nhãn cố định, cùng thứ tự ở mọi mục. Chọn bộ nhãn theo việc:

| Việc | Nhãn |
|---|---|
| Đối chiếu nội dung với tài liệu gốc | Trên site (hoặc Hiện trạng), Tài liệu gốc, Cần xác nhận |
| Báo lỗi cho người sửa code | Chỗ bị, Thấy lại, Đoán lý do (hoặc Lý do), Cách sửa |

- "Trên site" và "Chỗ bị" nói đúng vị trí: trang nào, khối nào, dòng nào. Người nhận phải tìm ra trong một lần.
- "Thấy lại" là các bước hoặc lệnh làm ra lỗi, kèm kết quả thật (mã trả về, thông báo lỗi nguyên văn).
- "Đoán lý do" nói tới tệp, dòng, cấu hình cụ thể. Chưa kiểm được thì nói vì sao chưa kiểm được.
- "Cần xác nhận" là một câu hỏi người nhận trả lời được, không phải lời khuyên chung.

## Trích và mức chắc chắn

- Trích nguyên văn trong ngoặc kép, giữ cả lỗi chính tả của bản gốc. Lỗi chính tả đó là một phần của chỗ sai.
- Nói chỗ trích nằm ở đâu: trang mấy, mục nào, dòng nào của bảng theo dõi.
- Mức chắc chắn đúng như đã kiểm: "đã thử", "suy từ code, chưa xem log", "chữ số viết tay, đọc giống 57 hoặc 58".
- Đã thấy nguồn gốc tự mâu thuẫn thì ghi luôn, không chọn hộ người nhận.
- Lời đánh giá kiểu "nói quá" phải kèm câu bị đánh giá và lý do: không nguồn nào có ý đó.

## Ảnh

- Mỗi điểm có ảnh của hai phía nếu có thể: sản phẩm đang ghi gì, và nguồn gốc ghi gì.
- Khung đỏ đóng đúng câu hoặc ô được nêu, không đóng cả trang. Cắt ảnh sát vùng đó, chừa đủ chữ xung quanh để biết
  nó nằm ở đâu.
- Chú thích nói ảnh lấy ở đâu và khung đỏ đánh dấu gì: "Hồ sơ gốc, trang 17: hai lần tu sửa".
- Một ảnh dùng cho nhiều mục thì đặt ở mục đầu, các mục sau ghi "ảnh ở mục 4", không lặp ảnh.
- Ảnh chụp trang web thì chụp trên bản đang chạy, sau khi nội dung đã hiện đủ (trang có hiệu ứng hiện dần khi cuộn
  thì cuộn hết trang trước khi chụp).

## Phần thiếu

Liệt kê thứ còn thiếu theo từng mục của sản phẩm (trang, chức năng), không theo tên tệp. Mỗi dòng nói đã có gì, thiếu
gì, kèm mã dòng của bảng theo dõi nếu có.

## Giọng

- Người nhận nói "chỉ báo cáo" hoặc báo cáo gửi cho cả nhóm thì không xưng hô. Câu có chủ ngữ là vật hoặc trang: "Trang
  chủ ghi…", "Tài liệu không có…".
- Gửi đích danh một người thì xưng hô theo quan hệ với người đó, dùng ở câu mở và câu đoán lý do.
- Không có đoạn khen, phần "điểm tốt", bảng chấm điểm, thanh điểm, ma trận ưu tiên, ước lượng thời gian sửa.
- Không có đoạn kết chung chung. Hết mục cuối là hết. Cần người nhận làm gì thì đã nằm ở "Cần xác nhận".

## Tự soát trước khi gửi

1. Mở từng chỗ được nêu trên bản mới nhất, xem có còn đúng không.
2. So từng lời trích với ảnh: chữ trong ngoặc kép phải thấy được trong khung đỏ.
3. Mỗi khung đỏ có câu trong báo cáo nói về nó.
4. Tìm dấu gạch dài, gạch vừa trong cả nội dung lẫn chú thích ảnh.
5. Xuất ra định dạng người nhận sẽ mở (PDF, Word) và nhìn từng trang.
