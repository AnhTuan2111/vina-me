# Loại văn bản

Trước khi viết, chọn một mục đích chính. Lẫn mục đích là lẫn giọng.

| Mục đích | Loại | Đơn vị tổ chức | Người đọc kiểm tra bằng gì |
|---|---|---|---|
| Cung cấp thông tin, giải thích | văn bản thông tin, thuyết minh, tài liệu kỹ thuật | thông tin chính, đề mục, câu chủ đề | nguồn có tin được không, thông tin có đúng không |
| Thuyết phục | nghị luận, bài thuyết phục, kiến nghị | luận điểm, lí lẽ, dẫn chứng | luận điểm rõ không, dẫn chứng đủ và đáng tin không, lập luận chặt không |
| Hướng dẫn | quy trình, quy tắc, nội quy | các bước, các quy tắc | làm theo được không |
| Ghi lại việc đã xảy ra | báo cáo, tường trình, biên bản | sự việc, mốc thời gian | đúng, đủ, không cảm tính |


## Xưng hô theo loại văn bản

- Bài giảng, ghi chú, blog, lời giải thích trong chat: "mình, bạn", thân mật có mức. Ghi chú viết hộ để người dùng lưu thì
  "mình" là người dùng.
- Tin nhắn công việc (Zalo, Slack) gửi sếp, đồng nghiệp: xưng như lúc nói với người đó, giọng nói chuyện (mục Tin nhắn công
  việc).
- Tài liệu kỹ thuật, hướng dẫn, bản tin, thông báo gửi khách: trung tính, ít xưng hô; thông báo thì câu đầu nói ngay điều
  khách nhận được.
- Báo cáo, kiến nghị, thư công việc: trang trọng, theo cách xưng hô của nơi nhận. Báo cáo gửi cả nhóm, hoặc người nhận dặn
  "chỉ báo cáo", thì không xưng hô, chủ ngữ là vật hoặc trang.
- Văn bản hành chính nhà nước: không xưng hô, chủ ngữ là cơ quan; thể thức ở `references/official-documents.md`.

## Văn bản thông tin và giải thích

- Chính xác, tức là dựa trên dữ liệu và có nguồn.
- Khách quan, tức là sự thật đi trước. Ý kiến riêng được có, nhưng đứng sau phần sự thật và nhận ra được là ý kiến.
- Có hệ thống, tức là chọn một cách sắp thông tin rồi giữ nó.
- Dùng từ phổ thông, dễ hiểu. Thuật ngữ chỉ dùng khi người đọc sẽ gặp lại nó (trong log, trên màn hình, trong câu hỏi
  của họ), và giải nghĩa ở lần đầu (`word-choice.md`, mục Thuật ngữ). Ít biện pháp tu từ.
- Mở đầu nêu thứ đang nói và cái nhìn bao quát, thân triển khai, kết bằng kết quả cuối hoặc việc người đọc cần làm
  tiếp (`structure.md`, mục Kết).

Giải thích một hiện tượng, một lỗi, một thứ xảy ra thế nào trong tài liệu, bài viết, báo cáo phân tích lỗi thì đi theo
tám bước. Trả lời trong chat thì chỉ giữ bước tả, bước nguyên nhân và bước việc cần làm, mỗi bước một hai câu. Người
đọc đã có cách đoán thì trước bước 1 nêu cách đoán đó rồi "Nhưng" kèm dữ kiện bác nó (`core-rules.md` điều 1): "Bạn đoán
Nginx chặn. Nhưng log Nginx ghi request đã đi qua và app trả 403, nên chỗ chặn là app." Bài giảng kể chỗ người học đoán
sai thì khác: câu thứ hai là lý do cách đoán nghe hợp lý, câu thứ ba mới "Nhưng" (`teaching-checklist.md`).

1. Tả biểu hiện, tức là nó trông thế nào, xảy ra ở đâu, khi nào.
2. Gọi tên nó, ngay sau phần tả. Sai: "Lỗi này là OOMKilled. Pod `api` khởi động lại 14 lần từ 02:00." Sửa: "Từ 02:00,
   pod `api` restart 14 lần, lần nào log cũng dừng giữa chừng. Kubernetes ghi lý do là `OOMKilled`: container dùng quá
   mức RAM được cấp nên bị tắt."
3. Nêu khái niệm. Có nhiều thành phần thì tách ra, định nghĩa từng thành phần; định nghĩa đặt sau khi đã kể việc xảy
   ra (`core-rules.md` điều 4).
4. Nêu nguyên nhân, đi từ nguyên nhân tới kết quả. Nói thành phần nào làm từng việc trong chuỗi, kể cả việc chạy lại,
   chặn, xoá; không để câu bị động không chủ thể.
5. Nêu điều kiện cần để nó xảy ra: "Lỗi chỉ xảy ra khi job sao lưu chạy lúc 02:00 cùng lúc với lượt import, vì hai việc
   cùng ghi vào ổ `/data`", không "Lỗi xảy ra khi nhiều yếu tố kết hợp với nhau".
6. Nêu các thứ tác động lên nhau thế nào: "Ổ càng đầy thì job sao lưu càng chạy lâu, nên càng dễ trùng với lượt import
   của đêm sau."
7. Nối với việc của người đọc, tức là nó ảnh hưởng gì tới họ và họ làm gì với nó.
8. Kết bằng kết quả cuối, hoặc việc người đọc cần làm tiếp. Không thêm đoạn tóm lại.

Giải thích một quá trình thì cần ba nhóm từ là thuật ngữ, động từ chỉ việc xảy ra, và từ chỉ trình tự (bắt đầu,
tiếp theo, ngay sau đó, khi… thì).

## Hướng dẫn, quy tắc, quy trình

1. Nhan đề nêu tên việc.
2. Nói ngắn việc này làm ở đâu, khi nào, để làm gì.
3. Liệt kê thứ cần chuẩn bị.
4. Quy trình thì các bước theo thứ tự làm, lời dặn quan trọng nằm trong bước cần nó. Tập quy tắc, nội quy thì quy tắc
   quan trọng lên trước, đi từ cơ bản tới chi tiết.
5. Tách điều bắt buộc khỏi điều gợi ý.
6. Mỗi quy tắc kèm lý do.
7. Câu ngắn, câu cầu khiến mở bằng động từ. Nói cả việc phải làm lẫn việc không được làm.
8. Kèm một ví dụ hoặc tình huống áp dụng.
9. Thông tin thực dụng (giờ, địa chỉ, liên hệ) đặt thành mục riêng ở cuối.

Mỗi bước nói kết quả mong đợi, để người làm biết mình đã làm đúng. Bước chỉ ghi việc người làm; việc máy tự làm sau đó
viết nối vào bước trước ("Bấm Lưu, hệ thống gửi thư xác nhận"), không thành một bước riêng. Soát một hướng dẫn người
khác viết cũng theo khung này: thiếu phần chuẩn bị, thiếu kết quả mong đợi, lời dặn của một bước nguy hiểm đứng sau
bước đó, con số chọi nhau giữa hai bước. Sai: "3. Chạy `DROP DATABASE shop;` 4. Lưu ý: sao lưu trước khi làm bước 3."
Sửa: "3. Sao lưu: `pg_dump shop > shop.sql`. Chưa có tệp `shop.sql` thì dừng ở đây. 4. Chạy `DROP DATABASE shop;`"

## Báo cáo

Báo cáo khảo sát, đánh giá, nghiên cứu dài nhiều trang thì đủ khung gồm tên, tóm tắt, mở đầu, nội dung, kết luận, tài
liệu tham khảo và phụ lục. Báo cáo công việc, báo cáo sự cố thì theo đoạn ngay dưới danh sách này.

- Tóm tắt thì ngắn, đọc riêng vẫn hiểu.
- Mở đầu nêu vấn đề, vì sao làm, câu hỏi cần trả lời, cách làm và giới hạn.
- Trong phần nội dung, mỗi nhận định có số liệu hoặc bằng chứng đi kèm.
- Kết luận trả lời câu hỏi đã đặt ở mở đầu, rồi nêu hạn chế và việc còn lại.
- Lời văn ngắn gọn, khách quan, không có từ cảm tính: "Đợt nâng cấp xong lúc 23:40, sớm 20 phút so với kế hoạch; từ
  đó tới 08:00 không có cảnh báo nào", không "Đợt nâng cấp diễn ra rất suôn sẻ, hệ thống chạy cực kỳ ổn định".

Báo cáo công việc và báo cáo sự cố thì nói ngay việc gì đã xảy ra, khi nào, ảnh hưởng tới đâu, đã làm gì, lý do,
việc tiếp theo và ai làm. Báo cáo sự cố (cả postmortem):

- Câu tóm cả sự việc đặt ở đoạn mở trước mục 1 (tệp Word: khoá `intro`). Mỗi sự việc kể một lần ở phần diễn biến; mục
  thời gian lỗi chỉ nêu khoảng lỗi và hai mốc đó lấy từ đâu.
- Giờ bắt đầu, giờ hết lỗi lấy từ log hay số đo. Nguồn lệch nhau thì nêu cả hai.
- Số lượt lỗi khác số người bị ảnh hưởng. Chưa có số người thì nói chưa có, và cách lấy như nguồn nói.
- Không quy lỗi cho người. Lời đoán trong nguồn ("chắc quên", "sơ ý") không đưa vào, kể cả khi ghi là đoán; nêu sự
  việc kiểm tra được. Không câu hỏi tu từ trách nhóm. Sai: "Anh Nam không đổi biến `DB_HOST` nên bản 2.4 trỏ vào
  database cũ." Sửa: "Bản 2.4 lên lúc 14:05 với `DB_HOST` vẫn trỏ database cũ; quy trình deploy chưa có bước kiểm tra
  biến này." Câu lấy tên người làm chủ ngữ vẫn đọc thành lỗi của người đó.
- Gọi người theo chức danh khi nguồn có; nguồn chỉ có tên thì tên kèm vai trò trong sự việc ("An, người trực ca"), và
  hỏi chức danh trong lời trả. Luật này dùng khi viết mới từ nguồn; sửa văn có sẵn thì giữ cách gọi của gốc và không hỏi
  (`core-rules.md`, dòng Sửa đoạn được dán vào).
- Việc tiếp theo giữ người nhận và hạn như nguồn; việc chưa có người nhận thì ghi "chưa có người nhận", không tự điền.
  Việc sắp làm không viết như đã xong.

Báo cáo rà soát, báo cáo lỗi không có tóm tắt và kết luận riêng; khung của chúng ở `review-reports.md`.

Báo cáo, tờ trình, công văn gửi cơ quan nhà nước hoặc do cơ quan nhà nước ban hành: xem `official-documents.md`. Báo cáo lỗi, báo cáo rà soát nội dung so với tài liệu gốc: xem `review-reports.md`. Báo cáo trạng thái hệ thống, tài
liệu cấu hình gửi khách, sơ đồ và trang trình chiếu: xem `diagrams-and-docs.md`. Xuất ra tệp Word: xem `docx-export.md`.

## Thư và email công việc

- Dòng tiêu đề nói việc và điều cần ở người nhận, có hạn thì kèm hạn, không quá khoảng 15 tiếng. Không đặt tiêu đề
  chung chung kiểu "Cập nhật tiến độ dự án".
- Câu đầu nói mục đích viết bằng chính việc đó. Cụm mở kiểu "Em viết mail này để", "Em xin gửi chị" bỏ đi câu vẫn
  đứng được, nên bỏ.
- Rồi tới thông tin cần biết như thời gian, địa điểm, con số.
- Yêu cầu, hạn chót và lý do của hạn gói trong một câu. Yêu cầu có nhiều phần (vật cần, số lượng, nơi nhận, ai nhận)
  thì phần chi tiết vào ngoặc đơn hay vế phụ của câu ghép, còn hạn và lý do vẫn ở cùng câu với động từ nhờ. Sai: "Anh gửi giúp
  em bản scan hợp đồng đã ký và giấy ủy quyền. Hạn là 12h thứ Năm 5/3, vì bên em phải nộp hồ sơ thanh toán thứ Sáu."
  Đúng: "Anh gửi giúp em bản scan hợp đồng đã ký và giấy ủy quyền trước 12h thứ Năm 5/3, để bên em kịp nộp hồ sơ
  thanh toán thứ Sáu."
- Mấy yêu cầu liền nhau thì đổi cách mở câu, đừng để cả ba câu cùng khuôn "chị… giúp em… để…".
- Mỗi dữ kiện nói một lần, ở chỗ nó được dùng. Con số thuộc về một phương án hay một yêu cầu thì để ở đó, không nói
  trước ở đoạn tình hình rồi nhắc lại.
- Người nhận đọc trên điện thoại, hay có lời dặn "viết ngắn" (trong lời yêu cầu hoặc trong tài liệu được đưa), thì thân
  thư không quá khoảng 250 tiếng, không tính lời chào, chữ ký, tiêu đề. Đếm trước khi đưa. Quá thì bỏ câu nhắc lại và
  cụm thừa, không nén câu cho cụt.
- Một thứ một tên. Thư có hai thứ cùng loại (bản hợp đồng cũ và bản mới, văn phòng Hà Nội và văn phòng Đà Nẵng)
  thì gọi mỗi thứ bằng tên riêng suốt thư, không lùi về tên chung, vì người đọc không biết tên chung trỏ cái nào.
- Kết bằng điều cần ở người nhận.
- Xưng hô theo quan hệ với người nhận. Không hỏi rồi đáp, không dựng cảnh.
- Viết liền thành thư. Không chia mục in đậm, không gạch đầu dòng, trừ khi có một danh sách thật.
- Chỉ dùng dữ kiện được đưa. Không thêm lời giải thích mình tự suy ra. Thời hạn tính theo một sự việc ("hai tuần sau khi
  ký") thì giữ nguyên, không tự đổi ra ngày.

Viết thư gửi ra ngoài từ tài liệu nội bộ (đoạn chat nhóm, ghi chú họp):

- Đọc hết rồi mới viết. Một dữ kiện bị tin sau sửa thì lấy tin chốt sau cùng, hay theo nguồn có thẩm quyền (biên bản,
  người được giao chốt), không lấy tin đầu tiên gặp.
- Bỏ thứ chỉ người trong nhóm được biết: đường dẫn, tài khoản, mật khẩu, sự cố nội bộ, lỗi của một người trong nhóm, lời
  trách người nhận. Việc chậm thì nói phần thuộc về bên mình, không nói khéo sang người nhận.
- Phần nói thêm với người dùng chỉ nêu chỗ thiếu dữ kiện (email người nhận, chữ ký, địa chỉ) hay chỗ nguồn còn lệch mà
  chưa ai chốt. Chỗ người dùng hay người chốt đã tự sửa trong tài liệu thì không kể lại.

## Tin nhắn công việc

Tin Zalo, Slack, Teams gửi sếp hay đồng nghiệp.

- Xưng như lúc nói với người đó (em, anh), giọng nói chuyện; "ơi", "nhé" dùng được. Không "Kính gửi", "Trân trọng",
  không đề mục, không in đậm.
- Tin có việc nhờ thì câu đầu là việc nhờ, kèm hạn; tình hình hay thông tin kèm theo đi sau. Tin chỉ báo thì câu đầu là
  kết quả: "Anh ơi, bản 2.5 lên production lúc 22:10 rồi ạ. Lúc chạy migration bảng `orders` bị khoá 5 phút, em đã gỡ
  khoá và web chạy lại bình thường", không kể lại từ đầu theo thời gian.
- Khoảng 30 tới 80 tiếng, viết liền.
- Tin đi kèm một thư hay một tệp thì không chép lại nội dung thư, người nhận mở thư ra là đọc được. Không báo lại cho
  người nhận điều chính họ đã chốt.
- Cần nói thêm một điều về thư thì đặt liền sau câu nhắc tới thư. Đã sang tình hình thì đừng quay lại thư.

## Thông báo gửi khách, bài đăng công khai

Thông báo phát hành, thông báo bảo trì, thư xin lỗi hay bài đăng mạng xã hội gửi khách. Giọng trung tính, không đề mục.

- Nhan đề có tên hệ thống hay đơn vị gửi, để những chữ gọi tắt về sau ("Trung tâm", "hệ thống") có chỗ dựa.
- Câu đầu nói điều khách nhận được: bản nào dùng được từ khi nào ("Từ sáng [ngày], [hệ thống] dùng phiên bản [số]"),
  hay việc gì đã xảy ra kèm con số. Giờ tạm dừng và lý do đi sau.
- Mỗi thay đổi một dòng. Không dùng đuôi dịch sát "..., với N thay đổi sau": "Từ ngày 01/12, cửa hàng áp dụng bảng giá
  mới với ba thay đổi nêu dưới đây." viết thành "Từ ngày 01/12, cửa hàng áp dụng bảng giá mới. Bảng giá này có ba thay
  đổi:".
- Câu bị động không nói ai làm ("X được chọn", "được đặt", "được dời") thì nói ai làm, hoặc cho vật chịu việc làm chủ ngữ
  và bỏ "được": "Cuộc họp được dời sang 14h vì phòng bận" viết thành "Cuộc họp dời sang 14h vì phòng bận". Bỏ "được" mà
  chủ ngữ đọc thành người làm việc đó thì giữ "được" ("Máy chủ được thuê từ tháng 12", không "Máy chủ thuê từ tháng
  12"; `function-words.md`, mục "được", "bị"). Viết xong, tìm chữ "được" và "với" rồi xét từng chỗ, vì đọc lướt thì mắt
  bỏ qua chúng.
- Thư xin lỗi thì nhận lỗi bằng một câu riêng, rồi việc bù cho khách, rồi thay đổi cho lần sau.
- Bài đọc trên điện thoại thì khoảng 150 tới 300 tiếng, đoạn ngắn.

## Kiến nghị, đề xuất

- Nói mình đã làm gì với vấn đề: "Em trực vận hành cluster từ tháng 10, đã gặp ba lần ổ đầy trên node `worker-2`",
  không "Với tư cách một thành viên tâm huyết của đội".
- Đi theo chuỗi biểu hiện, tác động, nguyên nhân, giải pháp. Giải pháp rút từ nguyên nhân.
- Đề xuất cụ thể và làm được, nói rõ ai làm, làm gì, làm cách nào. Khả năng thành công chỉ nói bằng chỗ đã thử ("Cách
  xoay vòng log này đã chạy ở cluster thử từ 15/11, chưa thử trên production"), không tự đặt con số, không "chắc chắn
  thành công".
- Kết bằng việc người nhận cần làm, kèm hạn ("Anh duyệt trước thứ Sáu để em làm trong giờ bảo trì tối thứ Bảy"), không
  "Rất mong anh quan tâm".

## Tường trình, biên bản, kế hoạch

- Tường trình chỉ ghi lúc nào, ở đâu, thấy gì, đã làm gì. Bỏ "tôi cảm thấy", "theo tôi nghĩ".
- Kế hoạch dùng bảng ba cột là việc gì, ai làm, khi nào. Biên bản ghi thời gian, thành phần, nội dung đã bàn, kết luận;
  phần việc giao sau họp mới là bảng ba cột. Biên bản chỉ có bảng việc thì tháng sau không ai biết vì sao có việc đó.
- Biên bản, kế hoạch của cơ quan nhà nước theo thể thức và bố cục ở `official-documents.md`.

## Nghị luận, thuyết phục

- Một luận đề. Ít nhất hai luận điểm, mỗi luận điểm đỡ trực tiếp cho luận đề.
- Một ý đi theo thứ tự nêu ý, lí lẽ vì sao, dẫn chứng, phân tích dẫn chứng. Dẫn chứng không đứng trơ.
- Bằng chứng cụ thể, chính xác, dính trực tiếp tới ý đang nói.
- Nêu ý kiến ngược lại, nhận phần có lí của nó, bác bằng dẫn chứng. Nói luôn ngoại lệ và giới hạn của điều mình
  khẳng định.
- Bác từng mặt, không phủ nhận tất cả.
- So sánh thì so trên cùng một tiêu chí.
- Mở bài làm ba việc là nêu vấn đề, nói vì sao đáng bàn, nêu ý kiến của mình.
- Kết ngắn. Không kêu gọi, không hứa.
- Tự kiểm tra bằng ba câu hỏi là chứng minh điều gì, bằng cách nào, dùng cái gì để chứng minh.

## Giới thiệu một cuốn sách, một sản phẩm, một nơi chốn

- Từ khái quát tới cụ thể, từ khách quan tới chủ quan.
- Thông tin khách quan đi trước, gồm tên, tác giả hoặc nhà sản xuất, thời gian, tóm tắt.
- Nhận xét của người viết sau, và nhận ra được là nhận xét.
- Tả một nơi thì đi theo thời gian, theo không gian, hoặc theo từng mặt (vị trí, lịch sử, đặc điểm, cách tới).

## Tóm tắt

- Giữ đủ ý chính, theo thứ tự của bản gốc.
- Không thêm điều bản gốc không có. Không đổi nghĩa.
- Viết bằng lời mình, không chép lại câu chữ gốc, trừ thuật ngữ, tên lệnh, mã lỗi, lời trích nguyên văn: những thứ đó giữ
  nguyên chữ ("App trả `403 Forbidden` cho mọi request tới `/admin`", không "Hệ thống báo lỗi không có quyền truy cập"),
  vì người đọc bản tóm tắt sẽ đi tìm chuỗi đó trong log.

## Phỏng vấn, hỏi đáp

- Mở đầu nêu mục đích và người được hỏi là ai, có chuyên môn gì.
- Câu hỏi ngắn, đi thẳng vào vấn đề. Phân biệt rõ câu hỏi với câu trả lời bằng kiểu chữ.
