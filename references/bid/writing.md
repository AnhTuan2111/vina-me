# Cách viết

Hồ sơ dự thầu là văn bản cam kết: mỗi câu "đáp ứng" là một nghĩa vụ trong hợp đồng sau này. Người chấm đọc nhanh, so chữ
với HSMT, nên câu ngắn, cụ thể, dùng đúng chữ của HSMT, và đặt vào bảng khi có thể.

## Giọng

- Thân hồ sơ viết cho Chủ đầu tư và tổ chuyên gia, không viết cho BA: không "BA", "hồ sơ BA cung cấp", "trước khi nộp", "để hoàn
  thiện", "theo nhận định của Nhà thầu", và câu nói về tình trạng bản nháp ("thông số tài liệu chưa thể hiện được ghi rõ tại ô tương ứng"); điều cần BA làm chỉ nằm trong chỗ đánh dấu `[...]` và báo cáo. `bid-check` bắt các chữ này.
- Không xưng hô trong thuyết minh. Chủ ngữ là "Nhà thầu", "Phần mềm", "Hệ thống", "Chủ đầu tư", tên hạng mục. Bản cam kết
  xưng "chúng tôi".
- Gọi các bên và hồ sơ đúng như HSMT: Chủ đầu tư, E-HSMT, E-HSDT, Chương V. Không dùng "HSYC" khi gói không phải hồ sơ yêu cầu.
- Tên gói, tên hạng mục, tên chủ đầu tư, địa điểm chép đúng HSMT; một thứ một tên suốt hồ sơ, kể cả trong hình, bảng tài liệu
  nộp kèm, bảng kê sai khác (không lúc "thiết bị di động", lúc "máy tính bảng"). HSMT tự dùng hai tên (tên hạng mục ở Mẫu 01A
  và loại thiết bị ở Chương V) thì lấy tên hạng mục, nói một lần ở đầu bảng đáp ứng "(dưới đây gọi là ...)" nếu cần tên ngắn,
  rồi giữ đúng một tên đó; ô chép nguyên văn yêu cầu HSMT giữ chữ HSMT.
- Văn bản hành chính, không hỏi rồi đáp, không văn hoa, không "hiện đại, vượt trội, toàn diện" không kèm số.

## Câu mẫu, lấy từ hồ sơ mẫu

- Mọi bảng có một câu mở ngay trên nó, kể cả bảng đứng ngay dưới đề mục (`bid-docx` cảnh báo bảng thiếu câu mở).
- Mở một mục bảng: "Nhà thầu đáp ứng các yêu cầu này như sau:" hoặc "Cam kết phần mềm đáp ứng các yêu cầu này như sau
  (thuyết minh chi tiết tại mục X của <tên tài liệu kỹ thuật>):", rồi bảng Nội dung | Đáp ứng (32/68).
- Mở mục danh sách: một câu nói danh sách gồm gì, rồi gạch đầu dòng mở bằng nhãn đậm: "**Phần mềm X:** ...".
- Kết phần lớn: "Nhà thầu cam kết <nội dung> nêu trên."
- Dẫn sang tài liệu kỹ thuật: "(thuyết minh chi tiết tại mục 10.7 của Tài liệu kỹ thuật ...)". Số mục phải có thật.
- Văn bản thay thế: "Nhà thầu đề xuất áp dụng <văn bản mới> là văn bản đang có hiệu lực thay thế <văn bản HSMT nêu>."

## Số và đơn vị

- Số đếm dưới 10 có số 0 đầu: "04 giờ", "02 ngày", "03 lớp", "01 bộ", "08 thanh". Thời hạn quan trọng kèm chữ ở mọi lần nhắc,
  kể cả bản cam kết và ô bảng (trừ bảng tiến độ theo ngày): thời gian thực hiện "60 (sáu mươi) ngày", bảo hành "12 (mười hai)
  tháng", "36 (ba mươi sáu) tháng", đáp ứng "48 (bốn mươi tám) giờ", sửa chữa thay thế "02 (hai) ngày". `bid-check` nêu thời hạn
  lúc kèm chữ lúc không và số đếm thiếu số 0.
- Số tiền, số lớn: dấu chấm ngăn nghìn ("37.000.000 đồng"); số thập phân: dấu phẩy ("3,84 TB", "4,80 GHz", "37,56 kg") ở mọi
  chữ của nhà thầu, kể cả ô đáp ứng của bảng; chỉ giữ dấu chấm kiểu Anh trong chữ trích nguyên catalog đặt trong ngoặc kép.
  `bid-check` nêu số thập phân dấu chấm kèm đơn vị đo nằm ngoài ngoặc kép.
- Chi tiết lắp đặt, điện, mạng lấy đúng chữ catalog (trích trong ngoặc kép kèm trang), không suy thêm cách đấu nối ("qua bộ chia
  nguồn của phòng"); không có trong catalog thì ghi theo yêu cầu của hãng và đánh dấu.
- Cam kết không được kém HSMT: HSMT đòi tối đa 48 giờ thì không hứa 72 giờ; HSMT đòi tối thiểu 36 tháng thì ghi từ 36 tháng.
- Con số HSMT không hỏi (độ khả dụng, RTO, RPO, số người dùng đồng thời) chỉ đưa vào khi có nguồn (tài liệu kỹ thuật, BA);
  không có thì `[cần xác nhận: ...]`.
- Cam kết mới do nhà thầu tự đặt, có số hay không có số: tần suất (bảo trì hằng quý, họp tiến độ hằng tuần), số buổi, số lớp, số lần,
  thời lượng đào tạo, thời gian giao hàng, thời gian dự phòng, và cả việc không kèm số (bố trí thiết bị dự phòng, cho mượn thiết
  bị trong thời gian sửa, cử người trực tại chỗ). HSMT, BA không đưa thì vẫn được đề xuất (người chấm cần thấy
  kế hoạch cụ thể), nhưng mỗi cam kết kèm `[cần xác nhận: cam kết mới của nhà thầu]` ở lần nhắc đầu và có trong danh sách báo
  lại. `bid-check` nêu các tần suất, số buổi, thời hạn không có trong HSMT; chỗ nào chưa đánh dấu thì đánh dấu.
- Một chỗ đánh dấu phủ cả câu chứa nó: điều BA đã chốt (ngày giao 21 đến 22) không đứng chung câu với dấu của điều chưa chốt
  (lịch còn lại). Tách câu, hoặc đặt dấu ngay sau đúng cụm chưa chốt.
- Đề xuất của nhà thầu (sao lưu tự động, thử khôi phục, cập nhật bản vá, thiết bị dự phòng) nhắc lại ở bảng bảo trì, giải
  pháp, bàn giao cũng có `[cần xác nhận]` ngắn ở mỗi chỗ, như lịch.
- Điều chưa chốt (địa chỉ, nơi chạy Chatbot, model, lịch, cam kết mới) nhắc lại ở chỗ khác, kể cả bản cam kết, thì mỗi chỗ nhắc
  lại có `[cần xác nhận]` ngắn: BA sửa ở một chỗ sẽ sót những chỗ không có dấu.
- `bid-docx` tô nền vàng mọi chỗ đánh dấu `[cần xác nhận...]`, `[cần bổ sung...]`, `[chưa có chứng minh...]` để BA mở tệp là
  thấy chỗ phải tự sửa; không tô tay, không đổi cách viết dấu.
- Chữ trong chỗ đánh dấu ngắn, trung tính, nói cần gì (`[cần xác nhận: vai nhà thầu phụ]`), không ghi lý do bất lợi cho hồ
  sơ ("HSMT chỉ cho thầu phụ làm dịch vụ liên quan"): sót khi nộp là tự khai hồ sơ trái HSMT. Lý do, điều khoản dẫn chứng nằm ở
  báo cáo cho BA.
- Mốc bắt đầu bảo hành, bảo trì mà HSMT không nêu (từ ngày nghiệm thu, từ ngày bàn giao) là cam kết mới: đánh dấu như trên.
- Mốc tính thời gian (ngày 1 là ngày ký hợp đồng hay ngày hợp đồng có hiệu lực) theo đúng chữ HSMT, một mốc suốt hồ sơ, kể cả
  tiêu đề bảng tiến độ theo ngày (`gantt.dayOne`). HSMT tự lệch (Mẫu 01A điền "ngày ký hợp đồng", đầu cột in sẵn "ngày hợp đồng
  có hiệu lực") thì theo chữ bên mời thầu đã điền, và hỏi BA trong danh sách báo lại.

## Văn bản pháp luật

- Lần đầu ghi đủ: loại, số, ngày, cơ quan ban hành, trích yếu khi cần ("Nghị định số 85/2016/NĐ-CP ngày 01/7/2016 của Chính
  phủ về bảo đảm an toàn hệ thống thông tin theo cấp độ"). Lần sau ghi số hiệu.
- Chỉ dẫn văn bản có trong HSMT, quyết định phê duyệt, hồ sơ mẫu hoặc BA đưa. Không tự thêm văn bản không kiểm tra được nguồn.
- Hồ sơ mẫu ghi văn bản nào đã được văn bản khác thay thế ("Nhà thầu đề xuất áp dụng Nghị định số 331/2026/NĐ-CP ... là văn bản
  đang có hiệu lực thay thế Nghị định số 85/2016/NĐ-CP") thì dẫn văn bản cũ phải kèm câu thay thế đó, hoặc đánh dấu
  `[cần xác nhận: hiệu lực của văn bản]`. Không dẫn văn bản cũ một mình. `bid-check --sample` soát các cặp thay thế của mẫu.

## Câu chữ

Câu chữ theo bảy điều của skill vina-me nếu có cài (câu nối câu, một thứ một tên, nói thật, chữ người ta vẫn dùng). Riêng hồ sơ
thầu: không dấu gạch dài, gạch vừa, mũi tên; tiêu đề nối số với tên bằng dấu hai chấm ("Lớp 1: Quản trị hệ thống"); khoảng
ngày viết "ngày 1 đến ngày 10".
