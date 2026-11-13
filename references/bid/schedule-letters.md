# Tiến độ, bảo hành, đào tạo, bản cam kết

## Tiến độ

- Thời gian thực hiện lấy từ HSMT; ghi rõ ngày 1 tính từ đâu (ngày ký hợp đồng hay ngày hợp đồng có hiệu lực) theo đúng chữ của
  HSMT. Mốc giao hàng sớm nhất, muộn nhất theo Mẫu 01A.
- Bảng tiến độ tóm tắt (bảng thường, trang dọc): STT | Nội dung công việc | Đơn vị tính | Khối lượng | Tổng số ngày | Kết quả /
  Ghi chú (7/20/12/19/14/28). Nhóm A cung cấp hàng hóa (từng hạng mục, khối lượng theo Mẫu 01A); nhóm B theo hạng mục triển khai, đào tạo (chỉ gọi "dịch vụ liên quan" khi Mẫu 01D có).
- Mọi câu nói thời điểm ở phần khác (đặt hàng, giao, lắp, đào tạo, nghiệm thu) lấy đúng "ngày N" của bảng tiến độ; không viết
  "ngay sau khi ký hợp đồng" khi bảng bắt đầu việc đó từ ngày 3.
- Lịch từng việc trong thời gian HSMT cho là đề xuất của nhà thầu: đánh dấu `[cần xác nhận: lịch tiến độ do nhà thầu đề xuất]`
  một lần duy nhất, ở câu mở đầu phần tiến độ (người chấm đọc phần tiến độ riêng); không đặt lại ở câu mở các mục con như "Bảng
  tiến độ theo ngày", không đặt thêm ở lần nhắc lịch đầu tiên ở phần khác (chỗ đó dùng dấu ngắn như bên dưới). `bid-check` báo
  `XEM` khi dấu có lời "lịch" nằm ở hơn một câu; trong phần tiến độ
  (bảng tóm tắt, bảng theo ngày) không đánh dấu từng mốc. Ngoài phần tiến độ (giải pháp, giao nhận, nghiệm thu, đào tạo, bản cam
  kết) mỗi câu nhắc lại một mốc có `[cần xác nhận]` ngắn; `bid-check` nêu "ngày N đến ngày M" ngoài phần tiến độ không có dấu.
  Lịch lớp đào tạo, lịch bảo trì cũng vậy. Mốc BA đã chốt (ngày giao thiết bị, tần suất bảo trì) không đánh dấu ở bất cứ đâu,
  kể cả trong bảng; câu có cả mốc đã chốt và mốc chưa chốt thì đặt dấu ngay sau mốc chưa chốt. Không đặt dấu trần
  `[cần xác nhận]` vào từng ô của bảng tiến độ, cũng không lặp một dấu có nội dung ("[cần xác nhận: lịch]") ở nhiều ô: lịch
  nằm trong bảng thì đặt một dấu ở câu mở bảng; `bid-check` nêu dấu lặp ở quá hai ô. Số sẽ điền vào biểu mẫu trên hệ thống (số ngày nhà thầu đề xuất ở Mẫu 10A, Mẫu 01A)
  có dấu ngay tại ô, viết `[cần xác nhận: điền Mẫu 10A]` (ghi đúng tên mẫu), vì BA chép ô đó sang webform; `bid-check` không tính
  các dấu này là dấu lặp hay dấu trần.
- Tên hàng nhóm trong bảng tiến độ theo đúng HSMT: Mẫu 01D ghi không có dịch vụ liên quan thì không có nhóm "dịch vụ liên quan"
  (ghi "CUNG CẤP HÀNG HÓA", "TRIỂN KHAI, ĐÀO TẠO" theo hạng mục).
- Phần tiến độ kết bằng bảng theo ngày thì câu cam kết kết phần đặt trong `outro` của khối `gantt`.
- Bảng tiến độ theo ngày chia nhóm và đặt tên nhóm đúng như bảng tiến độ tóm tắt (cùng hạng mục, cùng việc trong nhóm). Cột "Tổng
  số ngày" của bảng tóm tắt bằng số ngày từ ngày đầu tới ngày cuối của các việc thuộc hạng mục đó trong bảng theo ngày; soát
  lại bằng cách cộng từng dòng trước khi giao.
- Bảng tiến độ theo ngày: khối `gantt` của `bid-docx.mjs` (trang ngang, mỗi bảng 10 ngày, đủ số bảng cho thời gian thực hiện).
  `dayOne` bắt buộc, chữ đúng mốc của HSMT và trùng mốc ghi ở mục tiến độ. Đề mục và câu mở của mục bảng tiến độ theo ngày đặt
  trong `intro` của khối `gantt` để in ngay trên bảng đầu tiên của trang ngang; đặt ở trang dọc trước đó thì trang dọc gần trắng.
  Các mục tiến độ dạng chữ, bảng tóm tắt đặt trước khối `gantt`, trên trang dọc.
- Mỗi bảng 10 ngày phải vừa một trang ngang. Đã đo: bảng đầu kèm `intro` (một đề mục, một câu) chứa được 23 hàng một dòng, kể cả
  hàng nhóm; 26 hàng là tràn. Các bảng sau không có `intro` chứa thêm khoảng 3 hàng, nhưng mọi bảng có cùng số hàng, nên lấy
  23 làm trần. Tên việc ngắn, vừa một dòng của cột Công việc (khoảng 45 ký tự),
  người thực hiện vừa một dòng (khoảng 20 ký tự: "Cán bộ phát triển phần mềm" đã xuống hai dòng); tên dài xuống dòng làm hàng cao
  gấp đôi, nên trần 23 hàng chỉ đúng khi mọi ô một dòng: mỗi hàng hai dòng tính như hai hàng. Người thực hiện dài thì viết gọn
  ("Cán bộ phần mềm") hoặc ghi vai trò ở chú thích dưới bảng. Bảng tràn thì `page-check.mjs` báo trang ngang gần
  trắng; bớt chữ hoặc gộp việc nhỏ, không bỏ việc HSMT đòi. Gói nhiều hạng mục (từ 5 trở lên) thì mỗi hạng mục chỉ một hàng
  `group: 1` rồi tới các việc, bỏ hàng `group: 2` khi nhóm trùng hạng mục; việc của các hạng mục chạy cùng ngày (giao máy chủ và
  giao máy tính bảng) gộp một hàng ghi rõ cả hai. Bảng tóm tắt theo đúng các hàng nhóm đó.
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
- Ô Mẫu 10A mà con số trùng mốc BA đã chốt (BA chốt giao ngày 21 đến ngày 22, ô "ngày giao do nhà thầu đề xuất" ghi 22) thì điền
  luôn, không đánh dấu; chỉ ô có số nhà thầu tự đặt mới mang `[cần xác nhận: điền Mẫu 10A]` (`bid-check --ba` báo dấu thừa).
- Bản nào cũng có dòng "Về việc ...".
- Liên danh: `org` là tên liên danh; `info` gọn ba dòng: "**Tên nhà thầu:** Liên danh X", rồi mỗi thành viên một dòng "Thành
  viên đứng đầu: Công ty A, mã số doanh nghiệp ..." và "Thành viên: Công ty B, ..." (người đại diện ghi ở khối ký, không ghi ở
  `info`: khối ký liên danh ba dòng chức danh cộng tên công ty hai dòng đã dài, thêm đại diện vào `info` là bản tràn trang). Địa chỉ, điện thoại,
  thư điện tử của từng thành viên ghi ở mục đầu mối của phần bảo hành trong thuyết minh, không ghi ở bản cam kết, để bản vừa một
  trang cùng khối ký hai cột. Người ký theo mục Liên danh của `package.md` (bản uy tín: mọi thành viên, `signers`).
- `org`: tên nhà thầu ngắt thành 2-3 dòng ngắn, dòng đầu là loại hình ("CÔNG TY CỔ PHẦN"), các dòng sau đậm.
- `info`: "**Tên nhà thầu:** ...", địa chỉ trụ sở, mã số doanh nghiệp, điện thoại, fax, thư điện tử, người đại diện và chức
  danh, tất cả lấy từ giấy tờ nhà thầu. Giấy tờ không có thư điện tử thì vẫn giữ dòng: "Thư điện tử: [cần bổ sung]".
- Mỗi bản vừa một trang A4: thông tin nhà thầu 5 dòng (gộp fax và thư điện tử một dòng), thân 2-4 câu cam kết ngắn ngoài câu mở
  và câu kết, mỗi câu dẫn một mục HSMT. Nội dung nhiều (bảo hành, đổi trả, thu hồi) thì tách hai bản theo từng ý chứ không nén
  câu. Dài hơn thì `page-check.mjs` báo trang không mở bằng quốc hiệu; bớt chữ chứ không thu cỡ chữ.
- `body`: câu mở "Sau khi nghiên cứu E-HSMT gói thầu: <tên gói> do <chủ đầu tư> làm Chủ đầu tư, chúng tôi cam kết như sau:", các
  câu cam kết dẫn đúng mục HSMT, câu kết "Chúng tôi hoàn toàn chịu trách nhiệm trước pháp luật về nội dung cam kết nêu trên./.".
- Ngày ký để trống dạng "Hà Nội, ngày ... tháng ... năm 2026" trừ khi BA đưa ngày.
