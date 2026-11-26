# Trích dẫn, nguồn, số liệu, hình

Người đọc tin một văn bản qua bốn thứ: tác giả hay tổ chức đứng sau nó, thời điểm viết, nguồn trích, và việc đối chiếu được
với nguồn khác. Nhiều số liệu mà thiếu bốn thứ ấy thì chưa đủ để được tin. Tệp này nói cách dẫn lời, ghi nguồn, chú thích,
viết số liệu, và đặt hình sao cho người đọc kiểm tra lại được.

## Dẫn lời

Có hai cách dẫn lời một người hay một tài liệu:

| | Dẫn trực tiếp | Dẫn gián tiếp |
|---|---|---|
| Là gì | chép nguyên văn | diễn lại bằng lời mình, không đổi ý |
| Dấu hiệu | dấu hai chấm rồi ngoặc kép | "rằng", "là", không ngoặc kép |
| Dùng khi | cần nguyên văn từng chữ: định nghĩa chuẩn, thông báo lỗi, lời nói của một người | cần lời dẫn chảy cùng câu văn |
| Nguồn | phải ghi | vẫn phải ghi |

Trích nguyên văn thì chép nguyên văn từng chữ, kể cả chỗ bản gốc sai; chỗ sai thì ghi [sic] hoặc thêm một chú thích. Cắt
bớt thì đánh dấu […], và chỉ cắt phần ít quan trọng, không cắt tới mức đổi nghĩa. Câu chữ trong lời trích không được sửa
cho hợp giọng của bài. Ngoại lệ duy nhất là dấu gạch dài, ghi thành gạch nối (`punctuation.md`).

Lời trích còn nằm ở cả những chỗ ngoài phần dẫn lời. Chữ của nguồn được nhắc lại ở chỗ khác (chú thích ảnh, tên mục, câu hỏi gửi người
nhận) mà để trong ngoặc kép thì cũng là lời trích: giữ chính tả của nguồn, không sửa lỗi gõ.

Ngày, số trong nguồn thiếu một phần (ngày không ghi năm, số không ghi đơn vị) thì giữ nguyên cách ghi đó ở mọi chỗ nhắc lại,
kể cả câu hỏi gửi người nhận: "từ 5/3 như thông báo ghi", không "từ 5/3/2026". Cần phần thiếu thì hỏi phần đó, không tự
điền năm hiện tại hay năm của tài liệu khác.

Nhắc lại một ý đã viết ở chỗ khác (lời trả trong chat, câu đếm ở mở đầu) thì giữ mức chắc chắn của chỗ gốc. Chỗ gốc viết
"trùng", "có thể", "chưa kiểm tra" thì chỗ nhắc lại cũng vậy, không thành "là", "còn dùng", "đã".

## Ghi nguồn

Ý tưởng, thông tin, con số, định nghĩa và cách diễn đạt riêng lấy của người khác đều phải ghi nguồn. Kiến thức phổ quát thì
không cần. Phổ quát là điều sách nhập môn nào cũng ghi và không có số đo, như "404 nghĩa là server không tìm thấy trang".
Con số, ngày, hành vi của một bản phần mềm cụ thể thì cần nguồn: "PostgreSQL 16 bỏ option X" phải dẫn release notes.

Nguồn ghi ngay tại chỗ dùng, ở một trong ba chỗ: ngay sau lời trích, ở chú thích cuối trang, hoặc ở danh mục cuối bài. Một
nguồn ghi đủ có tác giả hay tổ chức, tên tài liệu, nơi xuất bản và năm; nguồn trên mạng kèm ngày đọc. Cả bài dùng một kiểu
ghi nguồn.

Bài chỉ dẫn tới nguồn chắc chắn tồn tại và kiểm tra được, nên không viết "các nghiên cứu cho thấy" khi không nêu được nghiên
cứu nào. Nguồn chính thức đi trước: văn bản chuẩn, tài liệu của chính dự án, cơ quan có thẩm quyền.

## Chú thích

Chú thích trong câu, đặt trong ngoặc đơn, dùng cho tên gọi khác, nghĩa của một từ, chữ viết tắt. Chú thích cuối trang thì
đánh số ngay sau từ cần chú, rồi ghi số đó kèm nội dung ở cuối trang. Chú thích nào cũng có dấu đánh ở chỗ được chú, và
chú thích không dồn hết xuống cuối văn bản.

## Số liệu

Con số đi liền với thứ nó đo: "hơn 400.000 người", "khoảng 22 tới 26 m". Số dùng để đánh giá tốt hay xấu thì kèm một thứ để
so, vì một con số đứng riêng không nói được là nhiều hay ít: "Độ trễ trung bình là 800 ms, hôm qua cùng giờ là 200 ms";
"…chiếm gần 31% dân số cả tỉnh"; "lớn hơn khoảng 14% so với lúc ở xa". Số đi kèm thời điểm đo, và nói nó là đo thật hay
ước tính. Số lớn làm tròn thì nói rõ "khoảng", "hơn", "gần". Đơn vị đo thì soát lại trước khi đưa.

Thứ tự giữa ví dụ và số tổng tuỳ loại bài. Bài giảng, lời giải thích đưa ví dụ lẻ trước, số tổng sau, để người đọc thấy một
trường hợp rồi mới thấy quy mô. Báo cáo thì số tổng trước, ví dụ sau: "Từ 09:00 tới 09:30 có 37 giao dịch thanh toán lỗi,
ví dụ đơn 1042 lúc 09:05."

Con số tu từ ("cao hơn hàng trăm lần") không đứng cạnh con số đo được. Số chưa ai đếm thì nói cách lấy như nguồn nói. Nguồn
nói bảng X cho số lượt thì không gán thêm số khách cho bảng X; số đó lấy từ đâu mà nguồn không nói thì ghi là chưa rõ cách
lấy.

Output, log, thông báo lỗi cũng là số liệu, nên dán nguyên văn và ghi nơi chạy, ngày chạy. Chưa chạy thì ghi là kỳ vọng.

## Hình, bảng, sơ đồ

Dạng hình chọn theo thứ cần cho người đọc thấy:

| Cần cho thấy | Dùng |
|---|---|
| con số chính xác | ghi số, hoặc bảng |
| quan hệ giữa các phần | sơ đồ có đường nối |
| thay đổi theo thời gian | biểu đồ đường |
| so các mục | biểu đồ cột, hoặc bảng |
| một vật, một giao diện | ảnh, ảnh chụp màn hình |

Hình nào cũng qua bốn yêu cầu:

1. Hình dính trực tiếp tới một ý đang nói. Không ý nào cần nó thì bỏ.
2. Hình đặt ngay chỗ ý đó xuất hiện.
3. Trong đoạn văn có câu trỏ tới hình.
4. Hình có chú thích nói nó cho thấy gì, kèm nguồn nếu lấy của người khác.

Hình đi kèm chữ, không thay chữ, vì hình không lời dễ bị hiểu sai. Chú thích nói hình chứng minh điều gì cho bài; chỉ tả lại
hình thì chưa đủ. Đọc một biểu đồ thành lời thì đi ba bước: trong hình có gì, nhìn thấy điều gì, rút ra điều gì.

Bảng tóm ý thì ngắn, 3 tới 6 dòng; bảng dài chỉ để tra. Nhan đề nói nội dung chính, đề mục làm nổi thông tin chính, và đề
mục dạng câu hỏi thì đoạn ngay dưới đáp luôn.
