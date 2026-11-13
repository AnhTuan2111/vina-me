# Đề nhóm rewrite: sửa đoạn postmortem dán vào chat

Lời yêu cầu nằm ở `prompt.md` (dán nguyên vào phiên làm bài). Không có tệp vào. Dữ kiện đều là giả: dịch vụ order-api,
namespace shop, người tên Minh, team Platform, bộ phận CSKH không gắn với công ty thật nào.

## Đề thử điều gì của skill

Đề nặng hơn eval số 2 trong `skill/evals/evals.json` ở bốn chỗ:

1. Đoạn gốc có nhiều dữ kiện (giờ, phần trăm, độ trễ, số pod, phiên bản, lệnh, hạn) xen với lời độn không có dữ kiện,
   nên phải bỏ lời độn mà không rơi dữ kiện nào. Thử mục "Sửa văn có sẵn" của SKILL.md và `core-rules.md` mục "Khi sửa
   văn có sẵn".
2. Đoạn gốc có mức chắc chắn lệch nhau (một câu nói chắc nguyên nhân là pool, câu sau nói "nhiều khả năng", "chưa được
   xác nhận") và một chỗ tự mâu thuẫn (rollback lúc 14:41 và 14:44). Thử luật giữ mức chắc chắn, không thêm chi tiết,
   thiếu hay vênh thì hỏi chứ không tự điền.
3. Có lời trích nguyên văn chứa gạch dài, có lệnh và tên cấu hình trong backtick. Thử luật "không đụng lời trích, code"
   cùng luật ở `punctuation.md`: gạch dài trong lời trích ghi thành gạch nối, không đổi chữ nào khác.
4. Có bẫy sửa quá tay: một câu bác bỏ hợp lệ ("không phải database quá tải") vì ý bị bác đã được nói ngay trước, và một
   câu đã ổn (câu 14:20). Thử mục G "Sửa quá tay" của `machine-tells.md` và luật "câu đã ổn thì để yên".

Ngoài ra thử luật riêng của mảng: một thứ một tên (`word-choice.md`), lỗi chính tả và câu thiếu chủ ngữ
(`common-errors.md`), ký hiệu trong câu văn (`punctuation.md`), các dấu hiệu ở bảng A tới F của `machine-tells.md`, và cách trả
kết quả "Sửa đoạn được dán vào: bản đã sửa, rồi tối đa năm dòng nêu thay đổi chính và lý do".

## Đáp án dữ kiện

Bài phải giữ đủ, đúng giá trị và đúng mức chắc chắn:

| Mã | Dữ kiện |
|---|---|
| D1 | Sự cố ngày 03/11/2026, dịch vụ order-api |
| D2 | Từ 14:05 tới 14:47, order-api trả lỗi 503 cho khoảng 18% request thanh toán ("khoảng" giữ lại) |
| D3 | Độ trễ p95 từ 380ms lên khoảng 4.2s (hay 4,2 giây; "~" thành "khoảng", giá trị không đổi) |
| D4 | 3 trong 6 pod bị restart liên tục do liveness probe fail |
| D5 | Lời giải nghĩa liveness probe: Kubernetes gọi định kỳ để biết container còn sống không, fail thì restart container đó |
| D6 | Bản 3.8.0 deploy lúc 13:58, đổi `maximumPoolSize` của HikariCP từ 50 xuống 20 (`maximumPoolSize` giữ nguyên dạng code) |
| D7 | Ban đầu team nghi database quá tải; CPU database lúc đó 35% nên loại giả thuyết này |
| D8 | Lúc 14:20, Minh mở dashboard, thấy số kết nối đang dùng trong pool luôn ở mức 20/20 |
| D9 | Nhiều khả năng pool 20 không đủ khi cao điểm khoảng 1.200 request/phút; chưa xác nhận bằng load test |
| D10 | Team Platform rollback bằng lệnh `kubectl rollout undo deployment/order-api -n shop`, lệnh giữ nguyên từng ký tự |
| D11 | Giờ rollback: gốc ghi 14:41 ở một câu, 14:44 ở câu khác |
| D12 | CSKH chuyển lời một khách: "Thanh toán cứ xoay mãi rồi báo lỗi - tôi thử ba lần đều vậy." (gạch dài thành gạch nối, chữ giữ nguyên) |
| D13 | Sau rollback, tỉ lệ lỗi giảm dần, về 0 lúc 14:47 |
| D14 | Theo đánh giá sơ bộ, sự cố ảnh hưởng tới doanh thu; gốc không có con số |
| D15 | Việc tiếp: đưa pool về 50 trong bản 3.8.1, Minh làm, hạn 07/11 |
| D16 | Việc tiếp: thêm cảnh báo khi số luồng chờ kết nối quá 10 (lớn hơn 10, không phải "từ 10") trong 2 phút |
| D17 | Việc tiếp: chạy load test để xác nhận nguyên nhân, chưa có người nhận |

Ba việc ở D15 tới D17 là việc sắp làm, không được viết như đã làm xong.

## Điều bài không được bịa

- Không chọn một trong hai giờ rollback 14:41 và 14:44 mà không nói gì. Cách đúng là giữ cả hai đúng như gốc rồi nêu chỗ
  vênh, hoặc tốt nhất là nêu chỗ vênh và hỏi người dùng giờ nào đúng (có thể 14:41 là lúc chạy lệnh, 14:44 là lúc rollout
  xong, nhưng đó là đoán, không được viết thành dữ kiện).
- Không viết nguyên nhân thành điều đã chắc ("nguyên nhân là pool quá nhỏ") ở bất cứ câu nào. Gốc có câu nói chắc, nhưng
  ngay sau đó gốc nói chưa xác nhận; bản sửa phải theo mức "nhiều khả năng", hoặc nêu chỗ lệch cho người dùng.
- Không thêm con số doanh thu, số đơn hàng, số khách bị ảnh hưởng.
- Không thêm người nhận cho việc load test, không thêm hạn cho việc cảnh báo và load test.
- Không thêm giải thích kỹ thuật mà gốc không có (ví dụ vì sao pool 20 thì nghẽn, mỗi request giữ kết nối bao lâu, thời
  gian chờ kết nối của HikariCP).
- Không thêm giờ, tên người, tên kênh báo động, tên công cụ dashboard.
- Không đổi chữ trong lời khách, không đổi lệnh `kubectl`.
- Tính ra "42 phút" từ 14:05 tới 14:47 là phép tính đúng, không tính là bịa; tính sai thì tính là đổi dữ kiện.

Lời độn không có dữ kiện, bỏ là đúng: câu mở "Trong bối cảnh…", "không chỉ… mà còn là bài học quý giá", "một con số đáng
báo động", câu hỏi tu từ "Phải chăng…", câu chốt "Điều này cho thấy…", bộ ba "nhanh chóng, quyết liệt và hiệu quả", câu
kết "Tóm lại, hãy luôn nhớ rằng…".

## Bẫy đã cài

| Bẫy | Ở đâu | Bài tốt làm gì | Lỗi hay gặp |
|---|---|---|---|
| Giờ rollback vênh | đoạn ba: 14:41 và 14:44 | Giữ hoặc nêu chỗ vênh, hỏi người dùng | Lặng lẽ chọn một giờ, hoặc tự bịa lý giải |
| Mức chắc chắn lệch | đoạn hai: "nguyên nhân KHÔNG phải… mà là pool" rồi "nhiều khả năng… chưa xác nhận" | Giữ "nhiều khả năng" | Bỏ in hoa xong viết luôn "nguyên nhân là pool quá nhỏ" |
| Gạch dài trong lời trích | lời khách | Đổi thành gạch nối, giữ chữ | Giữ gạch dài; hoặc viết lại lời khách cho "mượt" |
| Gạch dài trong văn | đoạn một | Viết lại câu, bỏ gạch | Giữ, hoặc thay bằng gạch vừa |
| Code và lệnh | `maximumPoolSize`, lệnh `kubectl` | Giữ nguyên | Bỏ backtick, dịch tên, sửa lệnh |
| Một thứ bốn tên | connection pool, pool kết nối, bể kết nối, Connection Pool | Chốt một tên, viết một kiểu | Còn hai tên trở lên, hoặc chữ hoa lẫn chữ thường |
| Pod và pod, Container | đoạn một | Một cách viết | Để lẫn |
| Ký hiệu trong câu | `->`, `~`, `>` | "xuống", "khoảng", "quá" | Giữ ký hiệu; hay đổi "> 10" thành "từ 10" |
| Câu thiếu chủ ngữ | "Với bản 3.8.0 được deploy lúc 13:58 đã thay đổi…" | Sửa thành câu có chủ ngữ | Giữ nguyên |
| Chính tả | "thiếu xót" | "thiếu sót" | Giữ |
| Hai chấm làm khung định nghĩa | "Liveness probe: cơ chế…" | Viết thành câu có "là", giữ đủ nghĩa | Bỏ hẳn lời giải nghĩa; hoặc giữ khuôn hai chấm |
| Bác bỏ hợp lệ | "Ban đầu, team nghi… Tuy nhiên, CPU… 35%" | Giữ ý bác bỏ, chỉ bỏ in hoa | Xoá vì tưởng là khuôn "không phải X mà là Y" |
| Câu đã ổn | "Lúc 14:20, Minh mở dashboard…" | Để gần như nguyên | Viết lại kiểu văn hoa hơn |
| Xưng "chúng ta" | đoạn hai, đoạn bốn | Không xưng hô, chủ ngữ là team Platform, đúng chủ thể | Đổi sang "mình", "bạn", "chúng tôi" |
| Danh sách việc có nhãn in đậm | đoạn bốn | Giữ danh sách (ba việc có người, hạn thật) nhưng bỏ nhãn in đậm, hoặc viết thành câu | Giữ "**Cấu hình:**" |
| Văn máy mới | cả bài | Không thêm | Thêm câu tóm, "đáng chú ý", "chính là", câu chốt mới |
| Sửa quá tay | cả bài | Câu ghép có quan hệ nhân quả | Chặt thành chuỗi câu cụt mỗi câu một giờ |
| Cách trả kết quả | cuối bài | Bản sửa, rồi tối đa năm dòng thay đổi chính kèm lý do, một dòng hỏi về giờ rollback | Mở bằng "Dưới đây là…", danh sách mười dòng, bảng chấm điểm, ghi ra tệp khi không được nhờ |
