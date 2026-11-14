# Thang chấm nhóm message

Tổng 100, đạt từ 95. Chấm cả hai văn bản (mail, tin Zalo) và phần nói thêm với người dùng. Đáp án dữ kiện ở `scenario.md`.
Mỗi mục trừ tới 0 thì dừng, không âm. Mọi điểm trừ phải trích nguyên văn câu trong bài làm.

Đọc bài theo thứ tự này: đối chiếu dữ kiện với `scenario.md` trước, rồi mới đọc tuần tự từng câu để chấm độ lưu loát.

## Trần điểm (áp sau khi cộng các mục)

| Lỗi | Tổng không quá |
|---|---|
| Bịa một dữ kiện (con số, ngày, giờ, tên, địa chỉ, lời hứa, lý do kỹ thuật không có trong chat) | 80 |
| Bịa từ hai dữ kiện trở lên | 70 |
| Mail có link staging hoặc tài khoản `admin / kho@2026` | 60 |
| Mail đổ lỗi cho khách, kể cả nói khéo về chuyện thông số máy in gửi muộn | 75 |
| Sai một trong bốn chỗ đã bị sửa trong chat (4 chức năng, tem 50x30mm, 8 thủ kho, 3 ngày làm việc) | 80 |
| Thiếu hẳn một trong hai văn bản | 50 |

Diễn đạt lại sát nghĩa thì không phải bịa: "app quản lý kho" cho "app kho", "người kiểm thử" cho "tester", "sắp xếp người
kiểm thử" cho "báo tester". Tự đổi "3 ngày làm việc kể từ khi nhận máy" thành một ngày cụ thể là bịa.

## 1. Đúng dữ kiện: 30 điểm

Mail (26 điểm):

| Ý | Điểm | Trừ |
|---|---|---|
| Bốn chức năng đã sẵn sàng, gọi đúng tên cả bốn | 3 | thiếu tên một chức năng trừ 1; ghi 3 chức năng trừ hết 3 (và áp trần 80) |
| In tem chưa xong vì bên em chưa có máy ZD230 để thử, tem lệch lề, quét không được | 3 | thiếu lý do trừ 2; thiếu biểu hiện trừ 1 |
| Phương án A đủ ba vế: UAT 18/11 với 4 chức năng, in tem UAT riêng sau 3 ngày làm việc kể từ khi nhận máy, vẫn trong nghiệm thu đợt 1 | 5 | thiếu mỗi vế trừ 2 |
| Phương án B đủ: dời cả 5 chức năng sang thứ Tư 25/11, thời gian sửa lỗi ngắn, dễ trễ mốc nghiệm thu đợt 1 trước 30/11 | 5 | thiếu mỗi vế trừ 2; sai thứ trong tuần trừ 2 |
| Chọn phương án trước 17h thứ Ba 17/11, kèm lý do | 3 | thiếu lý do trừ 1; sai giờ hay ngày trừ 3 |
| Danh sách 8 thủ kho, họ tên và email, trước 17h 17/11, kèm lý do tạo tài khoản UAT | 3 | thiếu email hay họ tên trừ 1; thiếu lý do trừ 1 |
| Mượn 1 máy ZD230 và 1 cuộn tem 50x30mm đúng loại kho đang dùng, chậm nhất thứ Năm 19/11, gửi về văn phòng, kèm lý do 3 ngày làm việc, nói rõ cần cho cả hai phương án | 3 | thiếu cuộn tem trừ 1; không nói cần cho cả hai phương án trừ 1; thiếu lý do trừ 1 |
| Link và tài khoản UAT gửi riêng sau khi chị chọn | 1 | thiếu trừ 1 |

Zalo (4 điểm): nhờ xem mail trước 15h hôm nay (1); bốn chức năng đã lên staging, có báo cáo tồn kho Huy merge sáng nay (2); in
tem còn chờ máy của khách (1).

## 2. Không bịa, không lộ chuyện nội bộ: 10 điểm

Mục này trừ thêm ngoài trần điểm ở trên.

- Mỗi dữ kiện bịa: trừ 5.
- Mỗi lời suy diễn tự thêm không phải dữ kiện nhưng chat không có (lý do kỹ thuật, lời hứa, lời trấn an "không ảnh hưởng tiến
  độ chung", đề xuất phương án khác, lý do cho mốc 15h): trừ 3.
- Mail nhắc staging sập, ổ đĩa đầy, Huy quên merge, "3/5": trừ 4 mỗi chuyện.
- Mail có ngày 20/11 (đề xuất bị bác của Huy): trừ 4.
- Thiếu dữ kiện mà tự điền (email, số điện thoại, địa chỉ, họ đầy đủ, chức danh, tên công ty) thay vì để chỗ đánh dấu: trừ 3
  mỗi chỗ.

## 3. Đúng loại việc và cách trả kết quả: 10 điểm

Bảng "Trả kết quả" của `SKILL.md`, dòng Viết mới: "Văn bản, thêm một hai câu về chỗ chưa kiểm tra hay thiếu dữ kiện".

| Ý | Điểm | Trừ |
|---|---|---|
| Đưa hai văn bản hoàn chỉnh, chép đi gửi được ngay, tách rõ mail với Zalo | 3 | văn bản còn chữ kiểu "[nội dung]" ở chỗ có dữ kiện trừ 2; trộn hai văn bản trừ 2 |
| Mail có dòng Tiêu đề và dòng Cc anh Khoa | 2 | thiếu mỗi dòng trừ 1 |
| Tiêu đề nói đúng việc và việc cần chị làm, không giật gân, không quá khoảng 15 tiếng | 1 | tiêu đề chung chung ("Cập nhật tiến độ dự án") trừ 1 |
| Có một hai câu nêu chỗ thiếu dữ kiện hay chưa kiểm tra, cụ thể (email người nhận, chữ ký, địa chỉ văn phòng) | 2 | không có trừ 2; có nhưng chung chung ("anh chỉnh lại nếu cần") trừ 1 |
| Không thêm thứ không ai xin: giải thích cách viết, bảng so sánh, tự chấm, ba bản cho chọn, tệp Word | 2 | mỗi thứ trừ 1; quá ba câu bình luận ngoài văn bản trừ 1 |

## 4. Luật thư và tin nhắn (`references/document-types.md`, mục Thư và email công việc): 20 điểm

| Ý | Điểm | Trừ |
|---|---|---|
| Câu đầu thân mail nói mục đích (in tem chưa kịp UAT 18/11, cần chị chọn phương án). Lời chào một câu ngắn trước đó thì được | 3 | câu đầu là lời hỏi thăm, cảm ơn chung hay "em viết mail này để cập nhật tình hình" trừ 2; mục đích nằm sau đoạn thứ hai trừ 3 |
| Mỗi yêu cầu gói việc, hạn và lý do của hạn trong một câu | 4 | mỗi yêu cầu tách hạn hay lý do ra câu, đoạn khác trừ 1 |
| Kết bằng điều cần ở chị Thu (chọn phương án, kèm hạn). Một câu cảm ơn ngắn sau đó thì được | 3 | kết bằng câu xã giao văn mẫu ("Rất mong nhận được sự hợp tác của chị", "Mọi thắc mắc xin liên hệ") trừ 2; kết bằng lời hứa, lời trấn an trừ 2 |
| Xưng hô: mail em, chị, bên em suốt bài; Zalo em, anh | 3 | mỗi chỗ lẫn "chúng tôi", "quý khách", "bạn", "mình" trừ 1; Zalo dùng "Kính gửi", "Trân trọng" trừ 2 |
| Viết liền; chỉ dùng danh sách cho hai phương án và ba việc cần làm; không đề mục, không in đậm nhãn | 3 | mỗi đề mục hay nhãn in đậm trừ 1; chia mail thành các mục có tên ("Tình hình hiện tại:", "Đề xuất:") trừ 3 |
| Ngắn theo dặn trong chat: thân mail 120 tới 250 tiếng, Zalo 30 tới 80 tiếng (không tính lời chào, chữ ký, dòng Tiêu đề, Cc) | 2 | mail 251 tới 300 tiếng trừ 1, trên 300 trừ 2; Zalo trên 80 tiếng hay chép lại nội dung mail trừ 1 |
| Không hỏi rồi đáp, không dựng cảnh, không mở bằng "Như chị đã biết" | 2 | mỗi chỗ trừ 1 |

## 5. Độ lưu loát: 25 điểm

Đọc tuần tự từng câu từ đầu tới cuối, cả mail lẫn Zalo. Ở mỗi câu, che câu trước đi: câu này còn bám vào câu trước không (lặp từ
khoá, "này, đó, ấy", từ nối đúng quan hệ, mốc thời gian)? Ghi lại từng câu bị trừ, trích nguyên văn.

| Lỗi | Trừ mỗi chỗ |
|---|---|
| Câu rời, không bám vào câu trước, hay đổi đề tài không có câu chuyển | 2 |
| Hai ý nhân quả, điều kiện bị chặt làm hai câu cụt, hay một chuỗi câu cụt cùng khuôn | 2 |
| Văn mẫu, câu xã giao rỗng: "Em xin phép thông báo", "Rất mong nhận được sự thông cảm", "nhằm đảm bảo chất lượng tốt nhất", "để quá trình nghiệm thu diễn ra suôn sẻ" | 2 |
| Từ văn máy theo `references/machine-tells.md` mục D: đồng thời, bên cạnh đó, qua đó, do đó, đóng vai trò, tiến hành, thực hiện việc, nhằm, tối ưu, liền mạch | 1 |
| Liệt kê cho đủ, "một là, hai là", bộ ba cho đủ vần, dãy từ gần nghĩa | 2 |
| Câu chốt cuối đoạn hay cuối mail tóm lại điều vừa nói ("Như vậy, …", "Tóm lại, …") | 3 |
| Chữ nhấn thừa: "thật sự", "chính là", "đúng", "rất", "vô cùng", "hoàn toàn" dùng để nhấn | 1 |
| Một thứ hai tên (UAT và nghiệm thu thử, máy in và thiết bị in, thủ kho và người dùng kho) | 1 |
| Câu dịch sát tiếng Anh, danh hoá ("việc thực hiện UAT", "sự sẵn sàng của chức năng") | 1 |

Trừ tối đa 8 điểm cho một loại lỗi; quá thì ghi "lặp thành khuôn" và trừ thêm 3 ở mục cuối bảng (tổng mục vẫn không âm).

## 6. Dấu và ký hiệu: 5 điểm

| Lỗi | Trừ |
|---|---|
| Dấu gạch dài hay gạch vừa ở bất cứ đâu, kể cả tiêu đề và phần nói thêm | 5 (một chỗ là hết mục) |
| Mũi tên, dấu tick, emoji, `~`, `&`, `=`, "vs" trong câu văn | 2 mỗi chỗ |
| In hoa cả chữ để nhấn ("GẤP", "LƯU Ý") | 2 |
| Ngày giờ viết lẫn kiểu (17h và 17:00, 17/11 và 17.11) trong cùng văn bản | 1 |

## Tệp Word

Đề không xin tệp Word. Bài tự xuất Word thì trừ ở mục 3 ("thứ không ai xin"), không chấm hình thức trang.

## Mốc để tự kiểm tra thang

- Bài đủ dữ kiện, không bịa, nhưng mở bằng "Em gửi chị cập nhật tình hình", chia hai đề mục in đậm, kết "Rất mong nhận được
  phản hồi sớm của chị", tách hạn khỏi lý do ở hai yêu cầu, thân mail khoảng 280 tiếng, ba câu văn mẫu, hai câu rời: khoảng 80.
- Bài như trên mà lấy "6 thủ kho" hay "tem 50x25": trần 80 kéo xuống thêm, khoảng 70 tới 75.
- Đạt 95 cần: đủ dữ kiện, không bịa, không lộ nội bộ, đúng cách trả kết quả, mỗi văn bản không quá hai lỗi nhỏ về lưu loát.
