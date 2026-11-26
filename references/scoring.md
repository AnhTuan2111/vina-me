# Chấm điểm một bài viết

Viết xong một bài, làm sao biết nó còn mùi AI slop ở đâu? Cách làm ở đây là đọc tuần tự từng câu như người đọc thật, chỉ
ra từng câu có vấn đề và trừ điểm theo một thang cố định. Tệp này là cách chấm ấy, dùng cho lệnh `/vina-me score`.

Lệnh `score` chỉ chấm, tức là đọc bài, trả điểm cùng danh sách câu rồi dừng. Nó không gọi agent khác, không tự sửa bài,
không chấm lại nhiều vòng, vì mỗi việc ấy tốn thêm token mà người dùng chưa nhờ. Người dùng muốn thêm việc nào thì nói rõ
việc đó trong lời nhờ; cách làm từng việc ở hai mục cuối tệp.

## Ai chấm

Agent đang chạy lệnh tự chấm, ngay trong phiên hiện tại. Trước khi chấm, agent đọc `SKILL.md` và tệp về văn AI slop
`references/machine-tells.md`. Agent đọc thêm tệp về nối câu `references/cohesion.md` và tệp về dẫn dắt
`references/storytelling.md`. Bài giảng thì đọc thêm `references/teaching.md`. Người dùng có hồ sơ giọng riêng thì đọc cả tệp ấy.

## Cách đọc

Người chấm đọc tuần tự từng câu, từ đầu tới cuối, như người đọc thật đi một mạch. Đọc lướt cả bài rồi tóm tắt cảm nhận thì
không tính là chấm. Ở mỗi câu, người chấm tự hỏi:

- Đọc một lần có hiểu ngay không, chủ ngữ có rõ không, "nó", "đó", "ấy" trỏ về đâu.
- Che câu trước đi thì câu này còn đứng làm gì ở đây, tức là nó có nối với câu trước không.
- Câu có nhắc thứ người đọc chưa biết mà không giải nghĩa ngay tại đó không.
- Câu có đi từ thứ người đọc đã biết, tả trước rồi mới gọi tên không; đoạn có hơn một thuật ngữ mới không.
- Câu có dấu hiệu trong `machine-tells.md` không, có chữ nhấn thừa không, có từ ghép bị cắt còn một tiếng không ("tóm" thay
  "tóm tắt", "quản" thay "quản lý").
- Câu có nói sai sự thật, con số có lệch với chỗ khác trong bài không.
- Hết bài thì hỏi thêm năm câu theo phương châm hội thoại ở `core-rules.md`. Bài thiếu hay thừa so với điều người đọc
  cần (lượng)? Có điều nào viết chắc mà chưa có bằng chứng (chất)? Có đoạn nào lạc đề (quan hệ)? Có chỗ nào mơ hồ
  (cách thức)? Xưng hô và lời chỉ lỗi có hợp người đọc không (lịch sự)? Mỗi chỗ phạm trừ theo mức của lỗi cụ thể ở bảng
  dưới.

Output lệnh, code và lời trích nguyên văn thì không chấm văn, chỉ kiểm tra có khớp với lời kể quanh nó không.

## Thang điểm

Bắt đầu từ 100. Mỗi chỗ chỉ trừ một lần, ở mức nặng nhất của nó.

| Mức | Trừ | Gồm |
|---|---|---|
| Nặng | 3 | câu tối nghĩa hay đọc hiểu sai được; dùng thứ người đọc chưa biết mà câu cần nó để hiểu; sai sự thật, mâu thuẫn trong bài; hai câu liền nhau đứt mạch hẳn |
| Vừa | 1 | câu nối lỏng; đoạn có hơn một thuật ngữ mới; chữ nhấn thừa; dấu hiệu văn AI slop; câu dài tới mức phải đọc lại; ẩn dụ không nói cái gì ứng với cái gì; một thứ gọi hai tên; từ ghép bị cắt |
| Nhẹ | 0,5 | chữ kém tự nhiên, ngoài đời ít ai nói vậy; dấu câu, chính tả |

Ranh giới giữa các mức:

- Đứt mạch hẳn (nặng): "Ổ `/data` đầy 93% lúc 19:57. Team đã họp với khách sáng thứ Hai." Câu sau không dính gì tới câu
  trước.
- Nối lỏng (vừa): "Ổ `/data` đầy 93% lúc 19:57. Log của app chiếm 60 GB." Cùng đề tài nhưng không có chữ nối; sửa thành
  "Trong số đó, log của app chiếm 60 GB."
- Chữ hay cụm có trong `machine-tells.md` tính mức vừa ("Redis đóng vai trò bộ nhớ đệm"); chữ kém tự nhiên khác tính mức
  nhẹ ("app tiến hành khởi động", sửa thành "app khởi động").

Điểm cuối là 100 trừ tổng các chỗ, và phải khớp với danh sách. Một số luật riêng của loại văn bản tính là nặng: bài giảng
hẹn bài sau, dùng chữ chưa dạy mà câu cần, câu hỏi kiểm tra lộ đáp án hay bắt đoán điều chưa kể; văn bản hành chính sai
thể thức ở phần đầu, phần cuối. Luật riêng khác tính theo bảng trên.

## Lời trả của người chấm

Dòng đầu là `ĐIỂM: <số>`. Bài do chính agent viết trong phiên này thì dòng thứ hai ghi rằng người chấm cũng là người viết.
Người dùng cần biết điều đó, vì người viết đọc lại bài mình hay đọc theo ý đã có trong đầu nên dễ lướt qua câu tối nghĩa. Sau đó là danh sách xếp từ
nặng tới nhẹ, mỗi chỗ gồm vị trí (tệp và dòng), câu gốc nguyên văn trong ngoặc kép, mức và vấn đề, rồi câu thay thế viết
sẵn. Không khen, không nhận xét chung, không có phần "điểm tốt".

## Nhờ một agent khác chấm

Việc này chỉ làm khi người dùng nhờ, ví dụ "nhờ agent khác chấm", "chấm độc lập". Agent mới không thấy quá trình viết, nên
không đọc theo ý đã có trong đầu như người viết. Trong Claude Code thì gọi một subagent; nơi không có subagent thì mở phiên
mới. Lời nhờ chấm chỉ gồm đường dẫn bài, người đọc là ai và đã biết gì, đường dẫn các tệp chuẩn ở mục Ai chấm, cùng mục Cách
đọc và Thang điểm. Đừng gửi kèm lời tự nhận xét hay danh sách chỗ đã sửa, vì người chấm sẽ chỉ đi tìm những chỗ đó mà bỏ qua
chỗ khác.

## Sửa rồi chấm lại

Việc này chỉ làm khi người dùng nhờ sửa tới một mốc điểm, ví dụ "sửa tới khi đạt 90". Người viết sửa theo danh sách rồi
chấm lại cả bài. Người dùng nói số lần liền phải đạt mốc, hay nói lần chấm lại do agent khác làm, thì theo lời đó; không nói
thì agent tự chấm lại và một lần từ mốc trở lên là đạt.

Điểm của người chấm dao động. Cùng một bản, hai người chấm cho điểm cách nhau khoảng 5, và người chấm sau hay bắt lỗi ở
chính câu vừa sửa. Vì vậy:

- Mốc người dùng đặt cao (97 cho ba lần liền) thì báo trước rằng mốc ấy gần như không đạt được, vì mỗi lần chấm mới đều
  tìm thêm vài chỗ nhẹ.
- Hai lần chấm chê ngược nhau ở cùng một câu (lần này bảo viết "lên GitLab", lần sau bảo viết "lên đó") thì giữ bản đang
  có, không sửa qua sửa lại.
- Chỗ nặng thì luôn sửa. Chỗ vừa và nhẹ thì sửa khi câu thay thế đọc tốt hơn thật, không sửa chỉ để lấy lại nửa điểm.
- Sửa một câu xong thì đọc lại câu trước và câu sau nó, vì câu mới hay làm đứt chỗ nối cũ.
- Sau khoảng năm vòng mà điểm vẫn đứng yên thì dừng, báo người dùng điểm từng vòng và các chỗ còn bị chê, để người dùng
  quyết.

Con số chỉ để biết bài còn bao nhiêu chỗ cần xem lại; cái cần sửa là danh sách câu. Đừng viết lại bài cho đạt một con số.
