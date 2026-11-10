# Tiến độ, bảo hành, đào tạo, bản cam kết

## Tiến độ

- Thời gian thực hiện lấy từ HSMT; ghi rõ ngày 1 tính từ đâu (ngày ký hợp đồng hay ngày hợp đồng có hiệu lực) theo đúng chữ của
  HSMT. Mốc giao hàng sớm nhất, muộn nhất theo Mẫu 01A.
- Bảng tiến độ tóm tắt (bảng thường, trang dọc): STT | Nội dung công việc | Đơn vị tính | Khối lượng | Tổng số ngày | Kết quả /
  Ghi chú (7/28/12/11/14/28). Nhóm A cung cấp hàng hóa (từng hạng mục, khối lượng theo Mẫu 01A), nhóm B dịch vụ liên quan.
- Mọi câu nói thời điểm ở phần khác (đặt hàng, giao, lắp, đào tạo, nghiệm thu) lấy đúng "ngày N" của bảng tiến độ; không viết
  "ngay sau khi ký hợp đồng" khi bảng bắt đầu việc đó từ ngày 3.
- Lịch từng việc trong thời gian HSMT cho là đề xuất của nhà thầu: đánh dấu `[cần xác nhận: lịch tiến độ do nhà thầu đề xuất]`
  ở lần nhắc đầu tiên trong hồ sơ và một lần nữa ở câu mở phần tiến độ (người chấm đọc phần tiến độ riêng), không đánh dấu từng
  mốc. Lịch lớp đào tạo, lịch bảo trì cũng vậy.
- Phần tiến độ kết bằng bảng theo ngày thì câu cam kết kết phần đặt trong `outro` của khối `gantt`.
- Bảng tiến độ theo ngày: khối `gantt` của `bid-docx.mjs` (trang ngang, mỗi bảng 10 ngày, đủ số bảng cho thời gian thực hiện).
  `dayOne` bắt buộc, chữ đúng mốc của HSMT và trùng mốc ghi ở mục tiến độ. Đề mục và câu mở của mục bảng tiến độ theo ngày đặt
  trong `intro` của khối `gantt` để in ngay trên bảng đầu tiên của trang ngang; đặt ở trang dọc trước đó thì trang dọc gần trắng.
  Các mục tiến độ dạng chữ, bảng tóm tắt đặt trước khối `gantt`, trên trang dọc.
- Mỗi bảng 10 ngày phải vừa một trang ngang. Đã đo: bảng đầu kèm `intro` (một đề mục, một câu) chứa được 23 hàng một dòng, kể cả
  hàng nhóm; 26 hàng là tràn. Các bảng sau không có `intro` chứa thêm khoảng 3 hàng, nhưng mọi bảng có cùng số hàng, nên lấy
  23 làm trần. Tên việc ngắn, vừa một dòng của cột Công việc (khoảng 45 ký tự),
  người thực hiện vừa một dòng; tên dài xuống dòng làm hàng cao gấp đôi. Bảng tràn thì `page-check.mjs` báo trang ngang gần
  trắng; bớt chữ hoặc gộp việc nhỏ, không bỏ việc HSMT đòi.
  Hàng `group: 1` là nhóm lớn (nền xanh đậm chữ trắng), `group: 2` là nhóm việc (nền xanh nhạt), hàng việc có `from`, `to`,
  `owner`. Người thực hiện trùng tên vị trí trong bảng tổ chức nhân sự. Việc sau không bắt đầu trước việc nó phụ thuộc; tổng
  không vượt thời gian thực hiện; số ngày ở bảng tóm tắt khớp bảng theo ngày.
- Việc thường có (gói thiết bị và phần mềm): ký hợp đồng, khởi động; khảo sát, phân tích yêu cầu; chuẩn bị, giao thiết bị; lắp
  đặt, cài đặt máy chủ; cài đặt, cấu hình phần mềm, thiết lập dữ liệu; cài ứng dụng lên thiết bị đầu cuối; đào tạo người dùng,
  đào tạo quản trị; vận hành thử; kiểm thử chấp nhận; nghiệm thu, bàn giao. Chỉ dùng việc HSMT có yêu cầu.

## Bảo hành

- Thời hạn theo từng hạng mục, không thấp hơn HSMT (thiết bị theo hãng nhưng không dưới mức HSMT ghi; phần mềm theo Mục 3).
- Gom đủ các điều kiện ở Mục 3 và Chương VII: thời gian đáp ứng, thời hạn sửa chữa thay thế, hỗ trợ kỹ thuật 24/7 nếu có, địa
  điểm bảo hành, đổi trả hàng lỗi, thu hồi hàng, bảo lãnh bảo hành. Các số này phải nhất quán với nhau.
- Đầu mối tiếp nhận: điện thoại, thư điện tử, địa chỉ của nhà thầu theo giấy tờ; thiếu thì `[cần xác nhận]`.

## Đào tạo

- Đối tượng, số lớp, thời lượng, địa điểm, tài liệu theo HSMT; bảng chuyên đề STT | Chuyên đề | Nội dung (7/33/60); bảng lớp
  Lớp | Tên lớp | Nhóm học viên | Thời lượng | Thời gian (7/25/19/32/17). Ngày đào tạo khớp bảng tiến độ.

## Bản cam kết

Khối `letter` của `bid-docx.mjs` dựng đúng hình thức hồ sơ mẫu (đầu trang hai cột, quốc hiệu, tên văn bản, kính gửi, thông tin
nhà thầu, thân, khối ký). Mỗi bản một trang, đặt cuối hồ sơ.

- Mỗi con số, mốc trong bản cam kết lấy đúng như bảng tương ứng trong thân (thời hạn bảo hành từng hạng mục, thời gian đáp ứng,
  tiến độ); bảng còn đánh dấu chờ thì bản cam kết cũng đánh dấu, không tự ghi một con số khác.
- Bộ bản cam kết thường cần (theo điều kiện đạt của Mục 3 và tài liệu Chương II, V đòi): tiến độ cung cấp; đáp ứng yêu cầu kỹ
  thuật của hàng hóa (kể cả hàng mới 100%, năm sản xuất, xuất xứ); bảo hành; đào tạo, hướng dẫn sử dụng; uy tín nhà thầu (số hợp
  đồng chậm tiến độ, bỏ dở); dịch vụ sau bán hàng nếu HSMT có.
- Bản nào cũng có dòng "Về việc ...".
- `org`: tên nhà thầu ngắt thành 2-3 dòng ngắn, dòng đầu là loại hình ("CÔNG TY CỔ PHẦN"), các dòng sau đậm.
- `info`: "**Tên nhà thầu:** ...", địa chỉ trụ sở, mã số doanh nghiệp, điện thoại, fax, thư điện tử, người đại diện và chức
  danh, tất cả lấy từ giấy tờ nhà thầu. Giấy tờ không có thư điện tử thì vẫn giữ dòng: "Thư điện tử: [cần bổ sung]".
- Mỗi bản vừa một trang A4: thông tin nhà thầu 4-5 dòng, thân 3-6 câu cam kết ngắn, mỗi câu dẫn một mục HSMT. Dài hơn thì
  `page-check.mjs` báo trang không mở bằng quốc hiệu; bớt chữ chứ không thu cỡ chữ.
- `body`: câu mở "Sau khi nghiên cứu E-HSMT gói thầu: <tên gói> do <chủ đầu tư> làm Chủ đầu tư, chúng tôi cam kết như sau:", các
  câu cam kết dẫn đúng mục HSMT, câu kết "Chúng tôi hoàn toàn chịu trách nhiệm trước pháp luật về nội dung cam kết nêu trên./.".
- Ngày ký để trống dạng "Hà Nội, ngày ... tháng ... năm 2026" trừ khi BA đưa ngày.
