# Thuyết minh phần mềm

Hạng mục phần mềm không có catalog; tài liệu chứng minh là thuyết minh cùng tài liệu kỹ thuật sản phẩm. Người chấm so từng
chức năng HSMT liệt kê với thuyết minh, nên đi theo đúng danh sách của HSMT.

## Chức năng

- Bảng đáp ứng chức năng: STT; Yêu cầu chức năng của E-HSMT (chép nguyên văn từng gạch đầu dòng); Đáp ứng (phần mềm làm gì,
  ai dùng, kết quả); Mục chi tiết. Tỉ lệ 7, 38, 40, 15. Có tài liệu kỹ thuật riêng thì cột cuối dẫn mục của tài liệu đó; không
  có thì cột cuối đổi tên "Thuyết minh tại" và dẫn mục trong chính hồ sơ (A.II.3, B.6). Có thể dùng chung bảng bốn cột của
  Chương V cho các hạng mục phần mềm, dịch vụ để cả hồ sơ một kiểu bảng.
- Mô tả chức năng bằng việc người dùng làm và phần mềm trả lại: "Cán bộ nhập từ khóa hoặc chọn lĩnh vực; phần mềm
  trả danh sách quy trình, văn bản pháp lý liên quan." Không mô tả bằng tính từ.
- Nếu HSMT có quy trình nghiệp vụ (tiếp nhận hồ sơ, sinh văn bản theo mẫu), mô tả quy trình: hiện trạng làm thủ công, các
  bước trên phần mềm, kết quả; sơ đồ quy trình dạng làn đặt ở tài liệu kỹ thuật hoặc thuyết minh.

## Công nghệ, kiến trúc, triển khai

- Công nghệ, kiến trúc là đề xuất của nhà thầu: viết rõ ràng nhưng chỉ những gì nhà thầu làm được; stack cụ thể (ngôn ngữ, cơ sở
  dữ liệu, mô hình AI) lấy từ tài liệu kỹ thuật hoặc BA, không có thì viết ở mức thành phần ("máy chủ ứng dụng", "cơ sở dữ liệu
  quan hệ", "mô hình ngôn ngữ chạy tại máy chủ của Chủ đầu tư") và đánh dấu `[cần xác nhận: công nghệ cụ thể]` một lần ở đầu mục.
- Gói có mua máy chủ thì mô hình triển khai đặt phần mềm lên chính máy chủ đã chào, nêu thông số đã chào; có thiết bị đầu cuối
  (máy tính bảng) thì nêu ứng dụng chạy trên thiết bị đó.
- Kết nối, đồng bộ, IPv6, xác thực theo đúng yêu cầu HSMT; không thêm kết nối HSMT không nói.
- Tên và phiên bản phần mềm nền (hệ điều hành "Ubuntu 24.04 LTS", cơ sở dữ liệu, máy chủ ứng dụng) mà HSMT, BA không đưa là
  lựa chọn của nhà thầu: đánh dấu `[cần xác nhận: công nghệ cụ thể]`, kể cả khi catalog ghi có hỗ trợ; `bid-check` nêu tên kèm số
  phiên bản không có trong HSMT.
- Tính năng Chương V không đòi (dùng ngoại tuyến, đồng bộ khi mất mạng, thông báo đẩy) không tự hứa; đề xuất thêm thì đánh dấu
  như cam kết mới.
- Chi tiết kỹ thuật cụ thể (giao thức, cách lưu mật khẩu, khóa tài khoản, giao diện chạy ở đâu, mã hóa) chỉ viết khi HSMT hay BA
  nêu; nhà thầu đề xuất thêm thì đánh dấu `[cần xác nhận: đề xuất của nhà thầu]` một lần ở đầu mục. Điều gì báo cáo bảo "nên hỏi
  đơn vị phát triển" thì trong hồ sơ cũng phải có chỗ đánh dấu.
- BA đã nêu công nghệ thì viết đúng chữ BA. Dù BA nêu hay chưa, không suy thêm cách chạy (mô hình chạy trên CPU hay GPU, Chủ
  đầu tư lắp thêm phần cứng, "còn khe PCIe cho GPU rời khi cần", phần mềm nào đặt trên ổ nào, số luồng, bản phát hành): mỗi chi tiết thêm là một cam kết BA chưa duyệt, và câu đẩy việc sang
  Chủ đầu tư (tự lắp, tự mua) là bất lợi cho hồ sơ.

## Phi chức năng, tiêu chuẩn, an toàn thông tin, kiểm thử

- Dàn theo hồ sơ mẫu: yêu cầu chung (mở rộng, ổn định, bảo mật, hiệu năng, tuân thủ tiêu chuẩn); an toàn truyền thông; tương
  thích; quản trị; phân lập lỗi; kết nối ra ngoài; tiêu chuẩn kỹ thuật ứng dụng công nghệ thông tin trong cơ quan nhà nước;
  an toàn thông tin theo cấp độ; kế hoạch kiểm thử, vận hành thử, UAT.
- Mỗi mục là bảng Nội dung | Đáp ứng. Con số (thời gian phản hồi, sao lưu, khả dụng) theo `writing.md`, mục Số và đơn vị.
- Văn bản pháp luật, tiêu chuẩn chỉ dùng những văn bản có trong hồ sơ mẫu, HSMT hoặc BA đưa (`writing.md`).

## Tài liệu kỹ thuật sản phẩm

Khi có tài liệu kỹ thuật riêng: thuyết minh tóm tắt mỗi ý một đoạn hoặc một bảng ngắn, rồi dẫn "(thuyết minh chi tiết tại mục X
của <tên tài liệu>)"; tài liệu kỹ thuật có đủ chi tiết. Số mục dẫn phải khớp, `bid-check.mjs --tlkt` soát. Khi không có tài liệu
kỹ thuật riêng, thuyết minh phải tự đủ chi tiết, không dẫn sang tài liệu không tồn tại.
