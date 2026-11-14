# Chấm điểm một bài viết

Viết xong một bài, làm sao biết nó còn mùi AI slop ở đâu? Người viết đọc lại bài của chính mình thì hay đọc theo ý đã có
trong đầu, nên lướt qua những câu cần sửa. Vì vậy bài cần một người chấm khác, đọc như người đọc thật, chỉ ra từng câu
có vấn đề và trừ điểm theo một thang cố định. Tệp này là cách chấm ấy, dùng cho lệnh `/vina-me score` và cho vòng sửa rồi
chấm lại.

## Ai chấm

Người chấm phải là một agent mới, không thấy quá trình viết. Agent đã viết bài thì biết mình định nói gì, nên đọc câu tối
nghĩa vẫn thấy rõ. Trong Claude Code thì gọi một subagent; nơi không có subagent thì mở phiên mới. Lời nhờ chấm chỉ gồm
đường dẫn bài, người đọc là ai và đã biết gì, đường dẫn các tệp chuẩn dưới đây, cùng mục Cách đọc và Thang điểm. Đừng gửi
kèm lời tự nhận xét hay danh sách chỗ đã sửa, vì người chấm sẽ chỉ đi tìm những chỗ đó mà bỏ qua chỗ khác.

Trước khi chấm, người chấm đọc `SKILL.md` và các tệp về văn máy, về nối câu, về dẫn dắt: `references/machine-tells.md`,
`references/cohesion.md`, `references/storytelling.md`. Bài giảng thì đọc thêm `references/teaching.md`. Người dùng có hồ
sơ giọng riêng thì đưa cả tệp ấy.

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

Output lệnh, code và lời trích nguyên văn thì không chấm văn, chỉ kiểm tra có khớp với lời kể quanh nó không.

## Thang điểm

Bắt đầu từ 100. Mỗi chỗ chỉ trừ một lần, ở mức nặng nhất của nó.

| Mức | Trừ | Gồm |
|---|---|---|
| Nặng | 3 | câu tối nghĩa hay đọc hiểu sai được; dùng thứ người đọc chưa biết mà câu cần nó để hiểu; sai sự thật, mâu thuẫn trong bài; hai câu liền nhau đứt mạch hẳn |
| Vừa | 1 | câu nối lỏng; đoạn có hơn một thuật ngữ mới; chữ nhấn thừa; dấu hiệu văn máy; câu dài tới mức phải đọc lại; ẩn dụ không nói cái gì ứng với cái gì; một thứ gọi hai tên; từ ghép bị cắt |
| Nhẹ | 0,5 | chữ kém tự nhiên, ngoài đời ít ai nói vậy; dấu câu, chính tả |

Điểm cuối là 100 trừ tổng các chỗ, và phải khớp với danh sách. Loại văn bản có luật riêng (bài giảng cấm hẹn bài sau, văn
bản hành chính theo thể thức) thì phạm luật ấy tính là nặng.

## Lời trả của người chấm

Dòng đầu là `ĐIỂM: <số>`. Sau đó là danh sách xếp từ nặng tới nhẹ, mỗi chỗ gồm vị trí (tệp và dòng), câu gốc nguyên văn
trong ngoặc kép, mức và vấn đề, rồi câu thay thế viết sẵn. Không khen, không nhận xét chung, không có phần "điểm tốt".

## Sửa rồi chấm lại

Người viết sửa theo danh sách rồi gọi một người chấm mới chấm lại cả bài. Bài đạt khi ba lần chấm liên tiếp cùng từ mốc trở
lên; một lần dưới mốc thì đếm lại từ đầu. Mốc do người dùng đặt, chưa đặt thì lấy 90.

Điểm của người chấm dao động. Cùng một bản, hai người chấm cho điểm cách nhau khoảng 5, và người chấm sau hay bắt lỗi ở
chính câu vừa sửa. Vì vậy:

- Đặt mốc thấp hơn mức mình mong khoảng 5 điểm. Mốc 97 cho ba lần liền gần như không đạt được, vì mỗi người chấm mới đều
  tìm thêm vài chỗ nhẹ.
- Hai người chấm chê ngược nhau ở cùng một câu (người này bảo viết "lên GitLab", người sau bảo viết "lên đó") thì giữ bản
  đang có, không sửa qua sửa lại.
- Chỗ nặng thì luôn sửa. Chỗ vừa và nhẹ thì sửa khi câu thay thế đọc tốt hơn thật, không sửa chỉ để lấy lại nửa điểm.
- Sửa một câu xong thì đọc lại câu trước và câu sau nó, vì câu mới hay làm đứt chỗ nối cũ.
- Sau khoảng năm vòng mà điểm vẫn đứng yên thì dừng, báo người dùng điểm từng vòng và các chỗ người chấm còn chê, để người
  dùng quyết.

Con số chỉ để biết bài còn bao nhiêu chỗ cần xem lại; cái cần sửa là danh sách câu. Đừng viết lại bài cho đạt một con số.
