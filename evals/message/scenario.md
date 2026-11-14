# Đề nhóm message: mail gửi khách và tin Zalo gửi trưởng nhóm từ một đoạn chat lộn xộn

Lời yêu cầu nằm ở `prompt.md`, tệp vào ở `inputs/thread.txt` (đoạn chat Zalo nội bộ, 24 tin, ngày 13-16/11/2026). Mọi tên
người, máy, đường dẫn đều giả.

## Đề thử điều gì của skill

- Rút đúng dữ kiện từ một mớ tin nhắn có tin cũ bị tin sau sửa (3/5 thành 4/5, tem 50x25 thành 50x30mm, 6 thành 8 thủ kho,
  2 ngày thành 3 ngày làm việc). Đây là điểm yếu dễ lộ nhất: bài lấy tin đầu tiên gặp thay vì tin chốt.
- Lọc thứ không được đưa ra ngoài: link staging, tài khoản admin, chuyện staging sập, chuyện Huy quên merge, lời Linh trách
  khách gửi thông số chậm. `document-types.md` mục Thư và email: "Chỉ dùng dữ kiện được đưa. Không thêm lời giải thích mình
  tự suy ra."
- Luật thư của `document-types.md`: câu đầu nói mục đích; thông tin cần biết; "Yêu cầu, hạn chót và lý do của hạn gói trong
  một câu"; kết bằng điều cần ở người nhận; xưng hô theo quan hệ; không hỏi rồi đáp, không dựng cảnh; viết liền, chỉ dùng danh
  sách khi có danh sách thật (ở đây hai phương án và ba việc cần khách làm là danh sách thật).
- Đổi giọng giữa hai người nhận trong cùng một lượt: mail cho khách trang trọng vừa phải, em và chị; Zalo cho trưởng nhóm ngắn,
  em và anh, được nói chuyện nội bộ.
- Ràng buộc độ dài có trong dữ kiện chứ không ở lời yêu cầu: Linh dặn "chị Thu hay đọc mail trên điện thoại, viết ngắn thôi".
- Cách trả kết quả theo bảng "Trả kết quả" của `SKILL.md`, dòng Viết mới: "Văn bản, thêm một hai câu về chỗ chưa kiểm tra hay
  thiếu dữ kiện".

## Đáp án dữ kiện

### Mail gửi chị Thu

Phải có:

- Tiêu đề nói đúng việc và có việc cần chị làm, ví dụ về lịch UAT đợt 1 và việc chọn phương án trước 17h 17/11. Cc anh Khoa.
- Xưng em, gọi chị (hoặc "bên em" khi nói về công ty) từ đầu tới cuối.
- Câu đầu nói mục đích: chức năng in tem mã vạch chưa sẵn sàng cho UAT ngày 18/11, cần chị chọn một trong hai phương án.
- Tình hình: bốn chức năng nhập kho, xuất kho, kiểm kê, báo cáo tồn kho đã sẵn sàng; in tem mã vạch chưa xong vì bên em chưa có
  máy Zebra ZD230 để thử, máy đang thử là loại khác, tem in ra lệch lề và mã vạch quét không được. Tên máy Xprinter XP-365B có
  hay không đều được.
- Phương án A: vẫn UAT ngày 18/11 với bốn chức năng đã xong; in tem mã vạch UAT riêng sau, 3 ngày làm việc kể từ khi bên em
  nhận được máy in; vẫn tính trong nghiệm thu đợt 1.
- Phương án B: dời UAT cả năm chức năng sang thứ Tư 25/11; thời gian sửa lỗi sau UAT ngắn, dễ trễ mốc nghiệm thu đợt 1 (hợp
  đồng ghi trước 30/11).
- Ba việc cần chị, mỗi việc có hạn và lý do của hạn:
  - chọn phương án trước 17h thứ Ba 17/11, để bên em kịp báo (sắp xếp) người kiểm thử;
  - danh sách 8 thủ kho, gồm họ tên và email, trước 17h thứ Ba 17/11, để tạo tài khoản UAT;
  - cho mượn 1 máy Zebra ZD230 và 1 cuộn tem 50x30mm đúng loại kho đang dùng, chậm nhất thứ Năm 19/11, gửi về văn phòng bên em
    (Linh nhận), vì cần 3 ngày làm việc để chỉnh chức năng in tem; câu này phải nói rõ là cần cho cả hai phương án.
- Link và tài khoản UAT gửi riêng sau khi chị chọn phương án.
- Ngắn, đọc trên điện thoại được: thân mail khoảng 120 tới 250 tiếng.

Không được có:

- Link staging, tài khoản `admin / kho@2026`, hay bất kỳ đường dẫn, tài khoản nào khác.
- Chuyện staging sập, ổ đĩa đầy, Huy quên merge, "3/5 chức năng".
- Lời đổ cho khách, kể cả nói khéo kiểu "do bên chị gửi thông số máy in muộn" hay "thông số máy in đến ngày 12/11 mới nhận".
- Ngày cụ thể cho buổi UAT in tem ở phương án A (ví dụ "25/11"): dữ kiện chỉ cho "3 ngày làm việc kể từ khi nhận máy".
- Con số tự tính hay tự nghĩ: "chỉ còn 3 ngày để sửa lỗi", "trễ khoảng một tuần", phần trăm hoàn thành, giờ UAT bắt đầu,
  số người kiểm thử.
- Lời giải thích tự suy ra về lý do kỹ thuật (driver, khổ giấy, độ phân giải máy in), lời hứa không có trong chat ("bên em cam
  kết không ảnh hưởng tiến độ"), đề xuất phương án C.
- Địa chỉ văn phòng, số điện thoại, họ đầy đủ, tên công ty, tên dự án mà chat không có. Chữ ký chỉ được "Phong" hoặc để chỗ
  trống đánh dấu rõ.

### Tin Zalo gửi anh Khoa

Phải có: xưng em, gọi anh; đã soạn xong mail gửi chị Thu (dán kèm hoặc nói là ở trên); nhờ anh xem trước 15h hôm nay để em gửi;
tình hình năm chức năng: bốn chức năng nhập kho, xuất kho, kiểm kê, báo cáo tồn kho đã lên staging (báo cáo tồn kho Huy merge
sáng nay), in tem mã vạch còn chờ máy ZD230 của khách. Ngắn, khoảng 30 tới 80 tiếng, viết liền.

Không được có: tự bịa lý do cho mốc 15h; nhắc lại cả nội dung mail; giọng mail ("Kính gửi anh", "Trân trọng"); đề mục.
Chuyện staging sập không cần nhắc (anh Khoa tự dọn), nhắc thì không sai dữ kiện nhưng là thông tin thừa.

### Phần nói thêm với người dùng

Một hai câu về chỗ thiếu dữ kiện hay chưa kiểm tra, ví dụ: chưa có email của chị Thu và anh Khoa, chưa có chữ ký đầy đủ (họ tên,
chức danh, số điện thoại), địa chỉ văn phòng để chị Thu gửi máy in lấy theo chat là chị đã biết. Không giải thích lại cách viết,
không tự khen bài, không chấm điểm.

## Bẫy đã cài

| Bẫy | Tin trong chat | Đúng |
|---|---|---|
| Số chức năng xong | Phong 13/11 "xong 3/5" | 4/5, vì báo cáo tồn kho đã merge sáng 16/11 |
| Khổ tem | Linh "tem 50x25" | 50x30mm, Linh sửa lại theo biên bản 05/11 |
| Số thủ kho | Huy "6 người" | 8, anh Khoa chốt theo biên bản |
| Thời gian chỉnh in tem | Huy "2 ngày" | 3 ngày làm việc, anh Khoa chốt theo Linh |
| Đề xuất dời của Huy | "dời UAT sang 20/11" | Không có ngày 20/11 trong mail; B là 25/11 |
| Đổ lỗi | Linh trách khách gửi thông số từ 05/11 tới 12/11 mới gửi | Không nhắc; anh Khoa dặn nói thẳng là bên mình chưa có máy |
| Thông tin nội bộ | link staging, tài khoản admin, staging sập, Huy quên merge | Không có trong mail |
| Độ dài | Linh dặn viết ngắn vì chị Thu đọc trên điện thoại | Mail ngắn |
| Hạn và lý do | Lý do của từng hạn nằm rải ở ba tin khác nhau | Mỗi yêu cầu gói việc, hạn, lý do vào một câu |
| Phạm vi của việc mượn máy | "phương án nào cũng phải mượn" | Mail nói rõ việc mượn máy cần cho cả hai phương án |
| Ngày cho phương án A | Không có ngày, chỉ "3 ngày làm việc kể từ khi nhận máy" | Không tự đổi ra ngày |
| Hai người nhận, hai giọng | | Mail trang trọng vừa, Zalo ngắn và thân |
