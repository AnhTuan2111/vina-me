# Loại văn bản

Trước khi viết thì chọn một mục đích chính, vì mỗi mục đích có giọng và cách sắp xếp riêng. Một bài vừa muốn báo việc đã
xảy ra vừa muốn thuyết phục người đọc làm theo thì thường lẫn giọng: câu báo cáo bỗng có tính từ khen chê, câu thuyết
phục bỗng thiếu dẫn chứng. Bảng dưới nối mục đích với loại văn bản, và nói người đọc dựa vào đâu để tin bài.

| Mục đích | Loại | Đơn vị tổ chức | Người đọc kiểm tra bằng gì |
|---|---|---|---|
| Cung cấp thông tin, giải thích | văn bản thông tin, thuyết minh, tài liệu kỹ thuật | thông tin chính, đề mục, câu chủ đề | nguồn có tin được không, thông tin có đúng không |
| Thuyết phục | nghị luận, bài thuyết phục, kiến nghị | luận điểm, lí lẽ, dẫn chứng | luận điểm rõ không, dẫn chứng đủ và đáng tin không, lập luận chặt không |
| Hướng dẫn | quy trình, quy tắc, nội quy | các bước, các quy tắc | làm theo được không |
| Ghi lại việc đã xảy ra | báo cáo, tường trình, biên bản | sự việc, mốc thời gian | đúng, đủ, không cảm tính |

Các mục sau đi lần lượt từng loại, từ văn bản thông tin, hướng dẫn, báo cáo, thư, tin nhắn, thông báo gửi khách, tới kiến
nghị, nghị luận và mấy loại ngắn hơn.

## Xưng hô theo loại văn bản

Xưng hô đi theo người đọc và theo quan hệ với họ:

- Bài giảng, ghi chú, blog, lời giải thích trong chat dùng "mình, bạn", thân mật có mức. Ghi chú viết hộ để người dùng lưu
  thì "mình" là người dùng.
- Tin nhắn công việc (Zalo, Slack) gửi sếp, đồng nghiệp thì xưng như lúc nói với người đó, giọng nói chuyện (mục Tin nhắn
  công việc).
- Tài liệu kỹ thuật, hướng dẫn, bản tin, thông báo gửi khách giữ giọng trung tính, ít xưng hô. Thông báo thì câu đầu nói
  ngay điều khách nhận được.
- Báo cáo, kiến nghị, thư công việc giữ giọng trang trọng, theo cách xưng hô của nơi nhận. Báo cáo gửi cả nhóm, hoặc người
  nhận dặn "chỉ báo cáo", thì không xưng hô; chủ ngữ là vật hoặc trang.
- Văn bản hành chính nhà nước không xưng hô, chủ ngữ là cơ quan; thể thức ở `official-documents.md`.

## Văn bản thông tin và giải thích

Văn bản thông tin được tin khi nó chính xác, tức là dựa trên dữ liệu và có nguồn. Nó cũng phải khách quan: sự thật đi
trước, ý kiến riêng được có nhưng đứng sau phần sự thật và nhận ra được là ý kiến. Bài chọn một cách sắp thông tin rồi giữ
nó suốt bài. Từ dùng là từ phổ thông, ít biện pháp tu từ; thuật ngữ chỉ dùng khi người đọc sẽ gặp lại nó trong log, trên
màn hình hay trong câu hỏi của họ, và được giải nghĩa ở lần đầu (`word-choice.md`, mục Thuật ngữ). Phần mở đầu nêu thứ đang
nói và cái nhìn bao quát, phần thân triển khai, phần kết là kết quả cuối hay việc người đọc cần làm tiếp (`structure.md`,
mục Kết).

Giải thích một hiện tượng, một lỗi, một thứ xảy ra thế nào trong tài liệu, bài viết, báo cáo phân tích lỗi thì đi theo tám
bước dưới đây. Trả lời trong chat thì chỉ giữ ba bước: tả, nguyên nhân, và việc cần làm, mỗi bước một hai câu.

Người đọc đã tự đoán thì trước bước 1 nêu cách đoán đó, rồi "Nhưng" kèm dữ kiện bác nó (`core-rules.md`, điều 1). Chẳng
hạn: "Bạn đoán Nginx chặn. Nhưng log Nginx ghi request đã đi qua và app trả 403, nên chỗ chặn là app." Bài giảng kể chỗ người học đoán sai
thì thêm một câu ở giữa: câu thứ hai nói vì sao cách đoán nghe hợp lý, câu thứ ba mới "Nhưng" (`teaching-checklist.md`).

1. Tả biểu hiện: nó trông thế nào, xảy ra ở đâu, khi nào.
2. Gọi tên nó, ngay sau phần tả. Gọi tên trước thì người đọc phải nhớ một chữ chưa có nghĩa: "Lỗi này là deadlock. Hai
   request treo 30 giây rồi cùng hỏng lúc 10:05." Đảo lại thì cái tên có chỗ bám: "Lúc 10:05, hai request cùng treo 30
   giây rồi cùng hỏng, vì request nào cũng đang chờ request kia nhả một dòng trong bảng. Database gọi tình huống đó là
   deadlock."
3. Nêu khái niệm. Có nhiều thành phần thì tách ra, định nghĩa từng thành phần; định nghĩa đặt sau khi đã kể việc xảy ra
   (`core-rules.md`, điều 4).
4. Nêu nguyên nhân, đi từ nguyên nhân tới kết quả. Nói thành phần nào làm từng việc trong chuỗi, kể cả việc chạy lại, chặn,
   xoá; không để câu bị động không chủ thể.
5. Nêu điều kiện cần để nó xảy ra: "Lỗi chỉ xảy ra khi job sao lưu chạy lúc 02:00 cùng lúc với lượt import, vì hai việc
   cùng ghi vào ổ `/data`", không "Lỗi xảy ra khi nhiều yếu tố kết hợp với nhau".
6. Nêu các thứ tác động lên nhau thế nào: "Ổ càng đầy thì job sao lưu càng chạy lâu, nên càng dễ trùng với lượt import của
   đêm sau."
7. Nối với việc của người đọc: nó ảnh hưởng gì tới họ, và họ làm gì với nó.
8. Kết bằng kết quả cuối, hoặc việc người đọc cần làm tiếp. Không thêm đoạn tóm lại.

Giải thích một quá trình thì cần ba nhóm từ: thuật ngữ, động từ chỉ việc xảy ra, và từ chỉ trình tự (bắt đầu, tiếp theo,
ngay sau đó, khi… thì).

## Hướng dẫn, quy tắc, quy trình

Người đọc hướng dẫn vừa đọc vừa làm, nên hướng dẫn sắp theo thứ tự họ cần:

1. Nhan đề nêu tên việc.
2. Một hai câu nói việc này làm ở đâu, khi nào, để làm gì.
3. Danh sách thứ cần chuẩn bị.
4. Các bước. Quy trình thì các bước theo thứ tự làm, và lời dặn quan trọng nằm trong bước cần nó. Tập quy tắc, nội quy thì
   quy tắc quan trọng lên trước, đi từ cơ bản tới chi tiết.
5. Điều bắt buộc tách khỏi điều gợi ý.
6. Mỗi quy tắc kèm lý do.
7. Câu ngắn; câu cầu khiến mở bằng động từ. Nói cả việc phải làm lẫn việc không được làm.
8. Một ví dụ hoặc tình huống áp dụng.
9. Thông tin thực dụng (giờ, địa chỉ, liên hệ) đặt thành mục riêng ở cuối.

Mỗi bước nói kết quả mong đợi, để người làm biết mình đã làm xong bước đó chưa. Bước chỉ ghi việc người làm; việc máy tự làm
sau đó viết nối vào bước trước ("Bấm Lưu, hệ thống gửi thư xác nhận"), không thành một bước riêng.

Soát một hướng dẫn người khác viết cũng theo khung này. Chỗ hay hỏng là thiếu phần chuẩn bị, thiếu kết quả mong đợi, con
số chọi nhau giữa hai bước, và nguy hiểm nhất là lời dặn của một bước đứng sau bước đó. Người làm theo thứ tự sẽ chạy lệnh
trước khi đọc tới lời dặn: "3. Chạy `DROP DATABASE shop;` 4. Lưu ý: sao lưu trước khi làm bước 3." Lời dặn phải thành
bước đứng trước: "3. Sao lưu: `pg_dump shop > shop.sql`. Chưa có tệp `shop.sql` thì dừng ở đây. 4. Chạy `DROP DATABASE
shop;`"

## Báo cáo

Báo cáo khảo sát, đánh giá, nghiên cứu dài nhiều trang thì đủ khung: tên, tóm tắt, mở đầu, nội dung, kết luận, tài liệu
tham khảo và phụ lục. Tóm tắt ngắn, đọc riêng vẫn hiểu. Mở đầu nêu vấn đề, vì sao làm, câu hỏi cần trả lời, cách làm và
giới hạn. Trong phần nội dung, mỗi nhận định có số liệu hoặc bằng chứng đi kèm. Kết luận trả lời câu hỏi đã đặt ở mở đầu,
rồi nêu hạn chế và việc còn lại. Lời văn ngắn gọn, khách quan, không có từ cảm tính: "Đợt nâng cấp xong lúc 23:40, sớm 20
phút so với kế hoạch; từ đó tới 08:00 không có cảnh báo nào", không "Đợt nâng cấp diễn ra rất suôn sẻ, hệ thống chạy cực
kỳ ổn định".

Báo cáo công việc và báo cáo sự cố thì ngắn hơn và đi thẳng vào việc: việc gì đã xảy ra, khi nào, ảnh hưởng tới đâu, đã
làm gì, lý do, việc tiếp theo và ai làm. Báo cáo sự cố, kể cả postmortem, có thêm mấy luật riêng.

- Câu tóm cả sự việc đặt ở đoạn mở trước mục 1 (tệp Word: khoá `intro`). Mỗi sự việc kể một lần ở phần diễn biến; mục
  thời gian lỗi chỉ nêu khoảng lỗi và hai mốc đó lấy từ đâu.
- Giờ bắt đầu, giờ hết lỗi lấy từ log hay số đo. Hai nguồn lệch nhau thì nêu cả hai.
- Số lượt lỗi khác số người bị ảnh hưởng. Chưa có số người thì nói là chưa có, và nói cách lấy số đó như nguồn nói.
- Không quy lỗi cho người. Lời đoán trong nguồn ("chắc quên", "sơ ý") không đưa vào, kể cả khi ghi là đoán; báo cáo nêu
  sự việc kiểm tra được, và không có câu hỏi tu từ trách nhóm. Câu lấy tên người làm chủ ngữ vẫn đọc thành lỗi của người
  đó: "Anh Nam không đổi biến `DB_HOST` nên bản 2.4 trỏ vào database cũ." Câu sửa lấy sự việc làm chủ ngữ và chỉ ra chỗ
  quy trình thiếu: "Bản 2.4 lên lúc 14:05 với `DB_HOST` vẫn trỏ database cũ; quy trình deploy chưa có bước kiểm tra biến
  này."
- Gọi người theo chức danh khi nguồn có. Nguồn chỉ có tên thì dùng tên kèm vai trò trong sự việc ("An, người trực ca"), và
  hỏi chức danh trong lời trả. Luật này dùng khi viết mới từ nguồn; sửa văn có sẵn thì giữ cách gọi của gốc và không hỏi
  (`core-rules.md`, dòng Sửa đoạn được dán vào).
- Việc tiếp theo giữ người nhận và hạn như nguồn. Việc chưa có người nhận thì ghi "chưa có người nhận", không tự điền. Việc
  sắp làm không viết như đã xong.

Riêng báo cáo rà soát, báo cáo lỗi thì không có tóm tắt và kết luận riêng; khung của chúng ở `review-reports.md`. Mấy loại
khác cũng có tệp riêng:

- Báo cáo, tờ trình, công văn gửi hay do cơ quan nhà nước ban hành: `official-documents.md`.
- Báo cáo trạng thái hệ thống, tài liệu cấu hình gửi khách, sơ đồ và trang trình chiếu: `diagrams-and-docs.md`.
- Xuất ra tệp Word: `docx-export.md`.

## Thư và email công việc

Người nhận thư công việc đọc dòng tiêu đề để biết có phải mở thư ngay không. Vì vậy dòng tiêu đề nói việc và điều cần ở
người nhận, có hạn thì kèm hạn, không quá khoảng 15 tiếng. Tiêu đề chung chung kiểu "Cập nhật tiến độ dự án" không cho họ
biết gì.

Câu đầu thư nói mục đích bằng chính việc đó. Cụm mở kiểu "Em viết mail này để", "Em xin gửi chị" bỏ đi câu vẫn đứng được,
nên bỏ. Sau câu đầu là thông tin người nhận cần biết, như thời gian, địa điểm, con số.

Yêu cầu, hạn chót và lý do của hạn gói trong một câu, để người nhận thấy cả ba cùng lúc. Yêu cầu có nhiều phần (vật cần,
số lượng, nơi nhận, ai nhận) thì phần chi tiết vào ngoặc đơn hay vế phụ của câu ghép, còn hạn và lý do vẫn ở cùng câu với
động từ nhờ. "Anh gửi giúp em bản scan hợp đồng đã ký và giấy ủy quyền. Hạn là 12h thứ Năm 5/3, vì bên em phải nộp hồ sơ
thanh toán thứ Sáu." tách hạn ra một câu riêng. Viết gộp thì thành: "Anh gửi giúp em bản scan hợp đồng đã ký và giấy ủy
quyền trước 12h thứ Năm 5/3, để bên em kịp nộp hồ sơ thanh toán thứ Sáu." Mấy yêu cầu liền nhau thì đổi cách mở câu, đừng
để cả ba câu cùng khuôn "chị… giúp em… để…". Câu nhờ có từ nhờ hay là câu hỏi, còn tình hình viết bằng câu trần thuật,
như mục Tin nhắn công việc nói ở dưới.

Mỗi dữ kiện nói một lần, ở chỗ nó được dùng. Con số thuộc về một phương án hay một yêu cầu thì để ở đó, không nói trước ở
đoạn tình hình rồi nhắc lại. Thư có hai thứ cùng loại (bản hợp đồng cũ và bản mới, văn phòng Hà Nội và văn phòng Đà Nẵng)
thì gọi mỗi thứ bằng tên riêng suốt thư, không lùi về tên chung, vì người đọc không biết tên chung trỏ cái nào.

Người nhận đọc trên điện thoại, hay có lời dặn "viết ngắn" (trong lời yêu cầu hoặc trong tài liệu được đưa), thì thân thư
không quá khoảng 250 tiếng, không tính lời chào, chữ ký, tiêu đề. Đếm trước khi đưa. Quá thì bỏ câu nhắc lại và cụm thừa,
không nén câu cho cụt.

Thư viết liền thành thư: không chia mục in đậm, không gạch đầu dòng, trừ khi có một danh sách thật. Xưng hô theo quan hệ với
người nhận; không hỏi rồi đáp, không dựng cảnh. Thư kết bằng điều cần ở người nhận.

Thư chỉ dùng dữ kiện được đưa, không thêm lời giải thích mình tự suy ra. Thời hạn tính theo một sự việc ("hai tuần sau khi
ký") thì giữ nguyên, không tự đổi ra ngày.

Viết thư gửi ra ngoài từ tài liệu nội bộ (đoạn chat nhóm, ghi chú họp) thì đọc hết tài liệu rồi mới viết. Một dữ kiện bị
tin sau sửa thì lấy tin chốt sau cùng, hay theo nguồn có thẩm quyền (biên bản, người được giao chốt), không lấy tin đầu
tiên gặp. Những thứ chỉ người trong nhóm được biết thì bỏ ra: đường dẫn, tài khoản, mật khẩu, sự cố nội bộ, lỗi của một
người trong nhóm, lời trách người nhận. Việc chậm thì nói phần thuộc về bên mình, không nói khéo sang người nhận. Phần nói
thêm với người dùng chỉ nêu chỗ thiếu dữ kiện (email người nhận, chữ ký, địa chỉ) hay chỗ nguồn còn lệch mà chưa ai chốt.
Chỗ người dùng hay người chốt đã tự sửa trong tài liệu thì không kể lại.

## Tin nhắn công việc

Tin Zalo, Slack, Teams gửi sếp hay đồng nghiệp thì xưng như lúc nói với người đó (em, anh), giọng nói chuyện; "ơi", "nhé"
dùng được. Tin nhắn không có "Kính gửi", "Trân trọng", không đề mục, không in đậm, dài khoảng 30 tới 80 tiếng, viết liền.

Câu đầu tuỳ tin để làm gì. Tin có việc nhờ thì câu đầu là việc nhờ, kèm hạn; tình hình hay thông tin kèm theo đi sau. Tin
chỉ báo thì câu đầu là kết quả, không kể lại từ đầu theo thời gian: "Anh ơi, bản 2.5 lên production lúc 22:10 rồi ạ. Lúc
chạy migration, bảng `orders` bị khoá 5 phút; em đã gỡ khoá và web chạy lại bình thường."

Câu nhờ việc chọn kiểu câu theo người nhận. Nhờ sếp, người lớn tuổi hơn hay khách thì không dùng câu cầu khiến trần như
"Anh duyệt bản này trước giờ họp.", vì đọc lên nghe như ra lệnh. Sách Tiếng Việt 4 dạy giữ phép lịch sự khi nêu yêu cầu
bằng cách thêm từ nhờ ("giúp", "nhờ", "phiền") hay chuyển sang câu hỏi. Sách Ngữ văn 8 gọi cách dùng câu hỏi để nhờ là
hành động nói gián tiếp: hình thức là hỏi, việc làm là nhờ. Vì vậy câu nhờ sếp viết "Anh duyệt giúp em bản này trước giờ
họp được không ạ?" hay "Anh duyệt giúp em bản này trước giờ họp nhé." Với đồng nghiệp ngang hàng thì câu cầu khiến có
"giúp" và "nhé" là đủ. Một tin chỉ cần một câu nhờ; đừng đổi mọi câu thành câu hỏi.

Báo lỗi, báo tình hình thì ngược lại, dùng câu trần thuật. Câu hỏi kiểu "Anh có biết job backup tối qua lỗi không?" bắt
người nhận đoán là mình đang được hỏi hay đang được báo. Viết thẳng "Job backup tối qua lỗi lúc 2h05, em đang chạy lại."
thì người nhận biết ngay việc gì xảy ra. Thư gửi khách theo cùng hai luật này: việc nhờ khách có từ nhờ hay là câu hỏi, còn tình hình
dự án viết bằng câu trần thuật.

Tin đi kèm một thư hay một tệp thì không chép lại nội dung thư, vì người nhận mở thư ra là đọc được. Tin cũng không báo
lại cho người nhận điều chính họ đã chốt. Cần nói thêm một điều về thư thì đặt nó liền sau câu nhắc tới thư; đã sang tình
hình thì đừng quay lại thư.

## Thông báo gửi khách, bài đăng công khai

Thông báo phát hành, thông báo bảo trì, thư xin lỗi hay bài đăng mạng xã hội gửi khách giữ giọng trung tính và không có đề
mục. Bài đọc trên điện thoại thì khoảng 150 tới 300 tiếng, đoạn ngắn.

Nhan đề có tên hệ thống hay đơn vị gửi, để những chữ gọi tắt về sau ("Trung tâm", "hệ thống") có chỗ dựa. Câu đầu nói điều
khách nhận được: bản nào dùng được từ khi nào ("Từ sáng [ngày], [hệ thống] dùng phiên bản [số]"), hay việc gì đã xảy ra
kèm con số. Giờ tạm dừng và lý do đi sau.

Mỗi thay đổi một dòng. Đuôi dịch sát "..., với N thay đổi sau" thì tách thành câu: "Từ ngày 01/12, cửa hàng áp dụng bảng
giá mới với ba thay đổi nêu dưới đây." viết thành "Từ ngày 01/12, cửa hàng áp dụng bảng giá mới. Bảng giá này có ba thay
đổi:".

Câu bị động không nói ai làm ("X được chọn", "được đặt", "được dời") thì nói ai làm, hoặc cho vật chịu việc làm chủ ngữ và
bỏ "được": "Cuộc họp được dời sang 14h vì phòng bận" viết thành "Cuộc họp dời sang 14h vì phòng bận". Bỏ "được" mà chủ ngữ
đọc thành người làm việc đó thì giữ "được": viết "Máy chủ được thuê từ tháng 12", không "Máy chủ thuê từ tháng 12"
(`function-words.md`, mục "được", "bị"). Viết xong thì tìm chữ "được" và "với" rồi xét từng chỗ, vì đọc lướt thì mắt bỏ
qua chúng.

Thư xin lỗi thì nhận lỗi bằng một câu riêng, rồi tới việc bù cho khách, rồi thay đổi cho lần sau.

## Kiến nghị, đề xuất

Người nhận kiến nghị tin nó khi người viết đã làm thật với vấn đề. Vì vậy kiến nghị mở bằng việc mình đã làm: "Em trực vận
hành cluster từ tháng 10, đã gặp ba lần ổ đầy trên node `worker-2`", không "Với tư cách một thành viên tâm huyết của đội".

Sau đó bài đi theo chuỗi biểu hiện, tác động, nguyên nhân, giải pháp, và giải pháp rút từ nguyên nhân. Đề xuất cụ thể và làm
được, nói rõ ai làm, làm gì, làm cách nào. Khả năng thành công chỉ nói bằng chỗ đã thử ("Cách xoay vòng log này đã chạy ở
cluster thử từ 15/11, chưa thử trên production"), không tự đặt con số, không "chắc chắn thành công".

Kiến nghị kết bằng việc người nhận cần làm, kèm hạn ("Anh duyệt trước thứ Sáu để em làm trong giờ bảo trì tối thứ Bảy"),
không kết bằng "Rất mong anh quan tâm".

## Tường trình, biên bản, kế hoạch

Tường trình chỉ ghi lúc nào, ở đâu, thấy gì, đã làm gì, và bỏ những cụm như "tôi cảm thấy", "theo tôi nghĩ". Kế hoạch dùng
bảng ba cột: việc gì, ai làm, khi nào. Biên bản thì khác kế hoạch: nó ghi thời gian, thành phần, nội dung đã bàn, kết luận,
và chỉ phần việc giao sau họp mới là bảng ba cột. Biên bản chỉ có bảng việc thì tháng sau không ai biết vì sao có việc đó.
Biên bản, kế hoạch của cơ quan nhà nước theo thể thức và bố cục ở `official-documents.md`.

## Nghị luận, thuyết phục

Bài nghị luận có một luận đề, và ít nhất hai luận điểm đỡ trực tiếp cho luận đề ấy. Mỗi ý đi theo thứ tự: nêu ý, lí lẽ vì
sao, dẫn chứng, rồi phân tích dẫn chứng, để dẫn chứng không đứng trơ. Bằng chứng cụ thể, chính xác, và dính trực tiếp tới
ý đang nói. So sánh thì so trên cùng một tiêu chí.

Bài thuyết phục được khi nó nhìn cả phía bên kia. Nêu ý kiến ngược lại, nhận phần có lí của nó, rồi bác bằng dẫn chứng;
bác từng mặt, không phủ nhận tất cả. Điều mình khẳng định có ngoại lệ và giới hạn thì nói luôn.

Mở bài làm ba việc: nêu vấn đề, nói vì sao đáng bàn, nêu ý kiến của mình. Kết bài ngắn, không kêu gọi, không hứa. Viết xong
thì tự hỏi ba câu: bài chứng minh điều gì, bằng cách nào, dùng cái gì để chứng minh.

## Giới thiệu một cuốn sách, một sản phẩm, một nơi chốn

Bài giới thiệu đi từ khái quát tới cụ thể, từ khách quan tới chủ quan. Thông tin khách quan đi trước: tên, tác giả hay nhà
sản xuất, thời gian, tóm tắt. Nhận xét của người viết đi sau, và người đọc nhận ra được đó là nhận xét. Tả một nơi thì đi
theo thời gian, theo không gian, hoặc theo từng mặt (vị trí, lịch sử, đặc điểm, cách tới).

## Tóm tắt

Bản tóm tắt giữ đủ ý chính theo thứ tự của bản gốc, không thêm điều bản gốc không có, không đổi nghĩa. Nó viết bằng lời
mình, không chép lại câu chữ gốc, trừ thuật ngữ, tên lệnh, mã lỗi, lời trích nguyên văn. Những thứ đó giữ nguyên chữ, vì
người đọc bản tóm tắt sẽ đi tìm chuỗi đó trong log: viết "App trả `403 Forbidden` cho mọi request tới `/admin`", không
viết "Hệ thống báo lỗi không có quyền truy cập".

## Phỏng vấn, hỏi đáp

Bài phỏng vấn mở bằng mục đích và người được hỏi là ai, có chuyên môn gì. Câu hỏi ngắn, đi thẳng vào vấn đề, và kiểu chữ
phân biệt rõ câu hỏi với câu trả lời.
