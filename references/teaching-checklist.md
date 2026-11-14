# Soát bài giảng: luật chi tiết

Tệp này đi kèm `references/teaching.md`. Đọc nó ở bước soát trước khi giao, sau khi bài đã viết xong theo `teaching.md`:
từng mục dưới đây là một chỗ các bài giảng trước hay vấp, gom từ những lần chấm. Luật ở đây chi tiết hơn, không thay cách
dẫn dắt ở `teaching.md`. Một luật ở đây mà làm câu mất trôi hay chọi một luật khác thì giữ mạch kể và câu trôi theo
`references/storytelling.md`, rồi tìm cách viết khác đủ luật (trích ít output hơn, đổi chỗ câu, tách đoạn), không ép câu cho
vừa luật. Tệp dài hơn một lần đọc của công cụ đọc tệp: đọc tới hết mục Soát trước khi giao ở cuối tệp, lượt đầu
bị cắt thì đọc tiếp từ dòng bị cắt.

## Người đọc chỉ biết những gì đã được dạy

Hình dung người đọc chỉ biết nền sẵn có của họ và những gì các phần trước đã dạy.

- Không dùng một thuật ngữ trước khi giới thiệu nó. Lần đầu xuất hiện thì giải nghĩa ngay bằng một hai câu lời thường,
  hoặc thay hẳn bằng lời thường nếu đoạn văn không thật sự cần nó.
- Thuật ngữ chính của bài hay nằm sẵn trong vụ mở bài (thông báo lỗi có chữ đó, người dùng gọi bài bằng chữ đó), nên dễ
  bị dùng từ câu hỏi của bài và mục đọc lỗi, trước câu định nghĩa nằm mãi ở mục sau. Trước câu định nghĩa, chữ đó chỉ
  được nằm trong lời trích, dấu mã hay nhan đề; câu văn nói bằng lời thường ("con số trong câu báo lỗi", "cái tệp app
  đòi"). Không làm được thì đặt câu định nghĩa ngắn (có "là") ngay lần đầu chữ đó vào câu văn, mục sau đào sâu và giữ đúng
  tên ấy. Động từ đi kèm ("giữ", "lấy", "xin" một thứ) cũng là dùng như thuật ngữ; câu tả việc đứng liền trước câu định
  nghĩa, trong cùng đoạn, thì được dùng động từ đó. Đoạn đọc lỗi đứng trước câu định nghĩa thì trích nguyên câu lỗi; không
  diễn lại câu lỗi bằng một động từ khác ("đã có thứ khác dùng"), vì động từ đó thành chữ thứ hai bên cạnh động từ bài chọn
  ở câu định nghĩa. Câu hỏi của bài đã hỏi con số, cái tên trong câu lỗi là gì thì đoạn đọc lỗi dừng ở câu trích. Không
  thêm câu "muốn hiểu dòng này thì phải biết X là gì", vì hai câu đó cùng hỏi một điều và câu hỏi của bài thành câu nói
  lại. Chỉ thêm câu "cần biết" khi phần mở không có câu hỏi của bài hỏi điều đó.
- Đoạn có câu định nghĩa thuật ngữ chính chỉ giải nghĩa thuật ngữ đó. Thứ người đọc hay gõ, hay thấy thường có nhiều phần
  (tên máy trong `user@máy`, phần `https` trong một địa chỉ web), và mở đoạn bằng thứ đó dễ kéo theo lời giải cả phần bài
  không định nghĩa. Phần ấy mà cần nói thì nói ở đoạn trước, đoạn định nghĩa mở bằng phần còn lại ("Còn cái tên sau dấu
  `@`…"); bài không dùng lại phần ấy thì không giải nghĩa nó. Chữ người đọc đã quen gõ mà bài chưa dạy cũng tính là chữ mới.
- Câu luật mà cả bài dựa vào thì nói thẳng ở mức bài dùng, cùng chữ với đáp án sẽ viết. Không rào bằng "với cách chạy
  thường ngày", "với app như X", "như trong bài này": câu rào mở ra một trường hợp bài không giảng, và người đọc sẽ hỏi
  trường hợp kia thì sao. Luật có ngoại lệ thật cần cấu hình riêng mà người đọc ở mức bài không gặp thì nói ngoại lệ đó
  trong lời trả cho người dùng; muốn đưa vào bài thì giảng nó bằng một ví dụ có output, không để nửa câu rào.
- Phần trước không nhắc tới phần sau. Không viết "sẽ học kỹ ở Bài 17", "để dành cho chương sau", "lúc khác", không nêu
  câu hỏi rồi hẹn chỗ khác trả lời. Phần nào chốt tới đâu thì dừng ở đó và đủ nghĩa ở mức của nó. Trong cùng một bài,
  trỏ sang mục khác của chính bài (phần giảng nói phần thực hành có bước làm lại vụ này) thì được, miễn không bỏ lửng
  một câu hỏi chờ mục đó trả lời.
- Người dùng dặn "đừng lan sang X, bài sau mới tới" là dặn người viết. Không chép lời dặn đó vào bài thành câu hẹn, và
  không nhắc X ở đâu trong bài, kể cả trong câu hỏi kiểm tra và đáp án.
- Phần sau nhắc lại phần trước, gọi đúng tên phần trước đã dùng, rồi đào sâu thêm. Kể cả từ chung của bài trước (option,
  path, câu lệnh, dấu `|`): bài trước dạy "option" thì bài này không viết "tham số", "cờ", "tùy chọn"; bài trước
  dạy "dấu `|` (pipe)" thì không viết "ống lệnh", "đường ống", dù các chữ đó hay dùng thay nhau. Thứ bài trước chưa đặt tên
  mà bài này phải gọi nhiều lần (cả một dòng có dấu `|`) thì gọi bằng chữ đã có ("dòng lệnh", "lệnh có dấu `|`") hay bằng
  chính nó trong dấu mã, không đặt tên mới. Luật trong tệp này dùng một chữ nào thì người viết vẫn gọi theo chữ bài trước
  đã dạy.
- Output, log, thông báo lỗi đặt trong bài cũng là chữ người đọc phải đọc. Chữ nào trong đó bài nhắc tới, hay người đọc phải nhìn
  vào mới làm tiếp được, thì giải nghĩa như thuật ngữ. Phần không dùng tới thì nói một lần cho cả bài, bằng một câu ngắn đứng
  ngay sau câu ghi nơi chạy hay câu che, cạnh khối output đầu, nói với người đọc việc họ làm với phần ấy ("Chữ nào trong output
  mà bài không nhắc tới thì cứ đọc lướt."). Câu ấy không nối vào câu che bằng "và": câu che nói dấu che trông ra sao, câu này dặn
  cách đọc, nối lại thì vế dặn đọc như nói tiếp về dấu che. Câu ấy cũng không nói về cách bài chọn dòng ("phần nào bài không nhắc
  thì bài không dùng"): câu như thế không nói "không dùng" là đã bỏ khỏi khối hay chỉ không giải nghĩa, và chọi với khối ngay
  dưới còn giữ nguyên những phần ấy. Sau đó chỉ nói riêng một phần khi người đọc dễ dừng lại hỏi nó (một ký hiệu trông như có
  nghĩa, một số đứng sát số bài đang đọc), và nói bằng câu có việc (vì sao chưa cần nó). Không kết khối output nào cũng bằng cùng
  một câu "… bài không dùng": câu lặp đó đọc thành nhịp máy. Đổi chữ ("bài không cần", "bài bỏ qua") vẫn là câu đó, và câu đọc
  lướt chung trước khối output đầu cũng tính một lần. Hai phần không dùng trong cùng một đoạn đọc output thì gộp vào một câu
  ("phần trước dấu hai chấm và số sau tên process bài chưa cần"), không để hai câu cùng đuôi. Một output ghi cùng một thứ theo
  dạng khác với dạng bài vừa giảng (cùng một ý mà hai cách viết, hai ký hiệu) thì nói ngay dưới khối output là hai dạng cùng
  nghĩa, hoặc chọn output khác.
- Dòng lệnh trong khối output (dòng có dấu nhắc) cũng là chữ người đọc phải đọc, và câu đọc lướt chung "chữ nào bài không
  nhắc tới thì cứ đọc lướt" không che nó. Phần nào sau tên lệnh bài không giảng (một đường dẫn sau tên miền và cổng, một tham
  số lạ, một tên tệp) thì nửa câu nói nó là gì, hoặc nói bài chỉ cần phần nào của dòng lệnh đó. Gọi phần ấy bằng chữ bài
  trước đã dạy (thường là "tham số"), hoặc bằng chính nó ("phần `-o json`"), không đặt chữ mới.
- Giải nghĩa một chữ trong output thì đặt ở chỗ bài dùng tới chữ đó, hoặc trong đoạn đọc khối output ấy, mở bằng chữ nối
  về câu trước. Không để một đoạn "còn chữ X trong log là…" chen giữa hai ý đang nối nhau (giữa đoạn đọc lỗi và đoạn kể chỗ
  hiểu sai): đoạn chen đứng rời, và đoạn sau mất chỗ bám. Chữ, số trong output mà bài chỉ dùng ở một mục sau (một mã số
  in trong log để đem so với mã số một lệnh khác in ra) thì giải nghĩa ở đoạn so đó, không ở đoạn đọc khối output đầu.
  Chữ trong output mà bài không dùng tới ở đâu (một nhãn trong ngoặc sau một con số, một chữ viết tắt cạnh tên lớp) thì
  không giải nghĩa, để câu đọc lướt chung che nó. Chỉ nói riêng khi
  người đọc dễ dừng lại hỏi, bằng nửa câu ngay trong câu đang trích tới chữ đó; không để nó thành câu cuối của đoạn mà
  đoạn sau (chuyện người thật, chỗ hiểu sai) phải bám vào. Dòng thừa trong output cũng vậy: lệnh lọc in cả dòng của chính
  nó (`grep` lọt vào kết quả của `ps aux | grep`), lệnh in thêm dòng tiêu đề. Người đọc dễ hỏi dòng đó, nên nói nó bằng nửa
  câu ở câu đầu đoạn đọc output ("dòng đầu là process cần tìm, dòng sau là chính lệnh `grep` vừa gõ"), rồi mới đọc từng cột
  của dòng cần đọc, để câu cuối đoạn là kết luận mà đoạn sau bám vào. Viết xong đoạn đọc output đứng ngay trước một chuyện
  người thật hay một chỗ hiểu sai thì che câu cuối của nó: đoạn sau vẫn bám được thì câu cuối đó đang đứng sai chỗ.
- Nói một phần của output là bài không dùng thì gọi nó bằng dấu mã hay vị trí ("phần đứng trước dấu hai chấm"), không
  đặt cho nó một tên thường. Tên đó mà bài dùng lại sau cho thứ khác (gọi phần bỏ qua là "địa chỉ", rồi vài mục sau gọi
  cả chuỗi người học gõ vào lệnh cũng là "địa chỉ") thì thành một tên hai thứ.
- Câu văn chỉ vào một giá trị có nhiều phần mà bài chỉ giảng một phần (`host:cổng`, `user@máy`, `tên:tag`), hay gọi tên
  một cột có chữ chưa dạy (tên cột có `Address`, `Peer`, `Recv-Q`), thì cùng câu đó nói phần còn lại bài không cần, gọi
  bằng vị trí ("phần đứng trước dấu hai chấm"). Câu chung trước khối output đầu không che được phần mà câu văn đã nhắc
  tới. Nhắc lại giá trị đó ở mục sau (phần thực hành, đáp án) thì chỉ nói phần bài dùng ("số sau dấu hai chấm"), không
  chép lại cả giá trị kèm tên cột. Cách gọn nhất là ngay từ đầu chỉ trích phần bài dùng: câu đọc dòng `docker images` viết
  "tag `1.25`", không chép cả `nginx:1.25-alpine`. Chép cả cụm (kể cả cụm có ngoặc, dấu bằng, nhiều trường như
  `name=…,size=…,mode=…`) thì mọi phần trong cụm thành chữ câu văn đã nhắc, câu đọc lướt chung không che được nữa, và phần
  đứng sát số bài cần (một số khác ngay sau dấu phẩy) là chỗ người đọc dừng lại hỏi trước tiên.
- Output in chữ tiếng Anh gần với một chữ bài đã chọn (log in `Killed` trong khi bài đã chọn động từ "tắt", log in
  `connection` trong khi bài gọi thứ gửi tới app là "request") thì giải câu đó bằng chữ bài đã chọn, không dịch ra chữ
  tiếng Việt mới ("giết", "kết nối"). Chữ dịch cũng là tên thứ hai. Cần chữ mới thật thì một câu nói nó khác chữ cũ ở đâu.
- Bài vừa đặt tên một thứ rồi thì giữ tên đó tới cuối, kể cả khi người đọc đã quen một chữ gần nghĩa từ nền của họ. Muốn
  dùng cả hai chữ thì một câu nói hai thứ khác nhau thế nào, hoặc thứ này nằm trong thứ kia. Động từ đi với thuật ngữ
  chính cũng là tên: bài chọn "giữ cổng", "cấp bộ nhớ" thì mọi câu nói về cùng việc ấy, kể cả câu về cấu hình và đáp án
  ("không cấu hình thì app giữ số mặc định", "cho app giữ số khác"), dùng động từ đó, không xen "dùng số khác", "chạy ở số
  đó". Hai động từ trong cùng một câu cho hai việc giống nhau thì người đọc hiểu là hai việc khác nhau. Giới từ, động từ
  phụ đứng trước giá trị đó cũng tính: "nằm ở", "lên ở", "chạy ở", "nghe ở" một số là động từ thứ hai, kể cả trong bước
  thực hành và đáp án. Giữ một động từ cũng không có nghĩa dùng nó cho mọi việc: việc xin mà chưa được ("muốn giữ", "xin
  giữ") khác việc đã giữ. Câu nói về thứ chưa lấy được (bản chạy sau, bản bị từ chối) dùng chữ bài đã đặt cho việc xin,
  không viết "cả hai đều giữ" khi luật bài vừa dạy nói chỉ một thứ giữ được.
- Giải nghĩa tham số của một lệnh (kiểu `-a`, `-ltnp`) thì nói việc nó làm bằng chữ người đọc đã có, thấy được trong output
  họ sắp đọc.
  Lời giải mà mở ra một ý mới thì ý mới đó cũng là thuật ngữ: "`ls -a` in cả tệp ẩn" khi bài chưa nói tệp ẩn là gì,
  "chỉ lấy một loại X", "in bằng số chứ không đổi sang tên" khi người đọc chưa biết X có nhiều loại hay có tên. Giải luôn
  ý đó bằng một ví dụ, hoặc thôi giải từng tham số và nói cả lệnh in ra gì. Tham số viết gộp (`-xyz`) không cần gọi tên
  từng chữ cái, nhưng mỗi ý trong lời giải vẫn tính như trên.
- Đoạn kể một chuỗi lệnh (tắt, kiểm lại, gọi thử) hay gom nhiều thứ mới vào một đoạn: mỗi lệnh mới, đường dẫn mới, thông
  báo lỗi mới đều tính là một thuật ngữ. Có từ hai thì tách đoạn, mỗi đoạn một thứ mới, đoạn sau mở bằng chữ nối về đoạn
  trước ("Còn phần đứng sau tên lệnh là…", "Lệnh đó báo lỗi vì…"). Lệnh gọi thử hay kéo theo cả ba thứ: tên lệnh, đường
  dẫn nó gọi tới, câu lỗi nó in. Lời giải trong một bước thực hành cũng tính như một đoạn: bước giải từ hai thứ mới thì
  tách thành hai đoạn trong bước, hoặc đổi cách làm để khỏi cần thứ mới (xem mục Bài thực hành).

## Mỗi bài một câu hỏi

- Mở bằng một tình huống cụ thể làm người đọc cần câu trả lời. Không mở bằng "X là…".
- Nêu câu hỏi của bài bằng một câu rõ, đặt ở câu cuối của phần mở bài để mục ngay sau bắt đầu đáp nó; cả bài trả lời câu
  đó nên nó không phải câu hỏi tu từ của `references/core-rules.md` điều 1. Không thêm câu báo lộ trình giữa bài ("Bài đi
  lần lượt hai cách này", "Trước hết bài sẽ…, sau đó…"): câu đó nói về bài chứ không về thứ đang giảng, hay trỏ tới thứ
  người đọc chưa thấy ("câu hỏi X đặt ra" khi câu hỏi ấy chưa được trích), và đoạn sau thường tự mở được. Bài dài
  nhiều mục mà cần báo trước chặng đi thì một câu thường ngay sau câu hỏi của bài, chỉ nhắc thứ người đọc đã thấy, không
  đánh số "câu hỏi con 1, 2", không làm danh sách.
- Mỗi phần mở bằng một câu tự nhiên nối với câu hỏi nó trả lời. Mỗi phần mở một kiểu. Mục thực hành cũng vậy: không mở bằng
  "Phần này…", "Mục này…", "Ở phần này bạn sẽ…", "Tiếp theo…". Câu hở mở một mục tìm kiếm ("vậy thứ nào đang chặn?") được đáp ở
  cuối mục, sau các bước tìm, miễn đoạn nào trong mục cũng đi thêm một bước tới đáp án và câu đáp gọi lại đủ tên vật câu hở hỏi.
- Câu hở cuối một đoạn chỉ hở khi các câu trước nó chưa trả lời. Chữ so sánh hay lấp sẵn chỗ hở: "cùng", "vẫn", "lại", "cũng"
  gắn thứ đang hỏng vào một vật đã kể ("lần chạy này đặt cùng tên với container hôm qua, nên bị từ chối" rồi hỏi "container nào
  đang mang tên ấy?"). Câu ấy đã chỉ ra thủ phạm, lại coi như đã biết điều mục sau phải cho thấy (container hôm qua còn đó).
  Kể việc hỏng bằng chính nó ("bị từ chối vì tên `web` đã có container mang"); vật bị nghi chỉ vào bài ở chỗ output chỉ ra nó.
- Kết bằng câu trả lời trọn vẹn cho câu hỏi của bài, hoặc kết quả cuối của vụ việc mở bài. Bài có phần thực hành, bảng tra
  hay câu hỏi kiểm tra đặt sau thì câu trả lời là đoạn cuối của phần giảng, trước các phần đó; các phần sau không nhắc lại
  nó. Câu hỏi còn mở chỉ thêm khi nó tự đứng được và bài không hứa ai trả lời nó. Câu hỏi còn mở tự nhiên nhất mà dẫn
  sang thứ người dùng dặn tránh hay thứ chưa dạy thì bỏ, không thay bằng một câu khác cho có.
- Gọi câu hỏi bằng nội dung của nó, không bằng số, không bằng vị trí. Không viết "câu hỏi đầu bài", "quay lại câu hỏi ban
  đầu", "như đã hỏi ở trên". Đề mục của phần trả lời nói luôn câu trả lời hay việc đang làm, không viết "Trả lời câu hỏi…".

Một khái niệm phải được hiểu trọn: vì sao cần nó, nó là gì (tên chuẩn, nguồn nếu có), nó chạy ra sao, một ví dụ thật có
lệnh và output, giới hạn và ngoại lệ. Đó là những thứ phải có, không phải thứ tự bắt buộc. Khái niệm nào cũng đi đúng một
nhịp thì bài đọc thành khuôn. Khái niệm nhỏ thì một hai câu là đủ.

## Thứ gì cũng phải có chỗ dùng

- Mỗi mục phục vụ câu hỏi của bài, và câu nối đó được viết ra. Không trả lời được "mục này phục vụ câu hỏi nào" thì bỏ.
- Khái niệm nào cũng phải được dùng lại ở đâu đó. Chỉ giới thiệu để biết thì bỏ. Chỗ dùng lại phải nằm ở phần giảng hay
  phần thực hành; chỉ được nhắc lại ở bảng tra hay câu hỏi kiểm tra thì không tính. Nhánh phụ (trường hợp hiếm của một
  lệnh, một biến thể cần quyền khác, một định dạng tệp khác cho cùng một cấu hình) thì bỏ, đừng kéo nó vào bảng tra và câu
  hỏi cho có chỗ dùng.
- Nội dung đúng nhưng thuộc bài khác thì chuyển sang bài đó.
- Thứ hay nhưng không phục vụ câu hỏi của bài thì dời sang phần đọc thêm, ghi rõ là không bắt buộc.
- Bài quá dài, nhiều đề tài thì tách thành nhiều bài. Không nhồi, không nén.
- Người dùng đặt số chữ cho bài giảng thì số đó tính phần giảng, theo cách đếm của `references/core-rules.md`, không tính
  thêm khối output, bảng tra, câu hỏi kiểm tra và đáp án. Người dùng xin bài giảng "có phần thực hành" thì phần thực hành
  nằm trong bài giảng và tính vào số đó. Đếm cả hai cách (có và không có đoạn mã trong dòng, số thứ tự của danh sách không
  tính) và nhắm giữa khoảng, không sát mép trên, vì mỗi người đọc tính phần giảng một khác. `scripts/lint.mjs` in số
  tiếng của cả phần nó nhận, nên cắt bài tới trước bảng tra rồi đưa phần đó vào `lint.mjs -` qua stdin để đếm riêng.
  Dư thì bỏ hẳn một ý, không rút câu; bỏ trước nhánh phụ của mục trên, rồi khối cấu hình cho trường hợp ít gặp, rồi câu
  nói phần output bài không dùng.
- Không đánh số các khái niệm rồi bắt người đọc nhớ số. Gọi bằng tên.
- Lấy một dữ kiện từ ghi chú buổi học mà dữ kiện đó vốn trả lời câu hỏi của một người thì đưa luôn câu hỏi ấy (trích hay
  kể lại), hoặc một câu dẫn nối nó với ý đang nói. Bỏ câu hỏi mà giữ câu trả lời thì câu đó rơi từ đâu xuống. Câu hỏi
  trong ghi chú mà người dùng đã hẹn trả lời lúc khác hay dặn tránh thì bỏ hẳn, cả câu hỏi lẫn câu trả lời; luật này chỉ
  áp khi bài có dùng dữ kiện trả lời câu đó. Đoạn trả lời câu hỏi ấy bằng một câu luật vừa giảng thì dừng ở vế áp luật
  vào câu hỏi (hai thứ xin hai số khác nhau, nên cả hai chạy được); không thêm vế "chỉ khi… mới…" hay "còn nếu…" nói lại
  chính câu luật, vì người đọc vừa đọc nó ở đoạn trên.

## Bài thực hành

- Lệnh chạy được trên đúng môi trường của người học. Bài cần thứ người học có thể chưa có (một project mẫu, một gói chưa
  cài) thì đầu phần thực hành nói cần gì và lấy ở đâu. Cấu hình riêng của project có thể làm kết quả khác kỳ vọng thì một
  câu ở đúng bước đó, không chỉ báo trong lời trả. Chỗ hay gặp nhất: bước sửa tệp cấu hình hay mã nguồn trong lúc một bản
  khác của cùng project đang chạy, vì công cụ tự khởi động lại khi tệp đổi (chế độ dev của framework, nodemon) làm bản
  đang chạy đổi theo. Phần thực hành cho dùng project của người học thay project mẫu thì càng phải có câu này. Cách gỡ
  phải làm từ trước khi chạy bước đầu (bỏ một gói, tắt một chế độ trước khi bản đầu tiên chạy) thì là bước 1 của danh sách
  đánh số, lời cảnh báo ở gạch dưới là đoạn đầu của bước ấy; không để nó trong đoạn văn trước các bước, vì người làm theo
  danh sách dễ bỏ qua đoạn ấy và bước bị ảnh hưởng lại phải nhắc. Bước bị ảnh hưởng không nhắc lại việc đã làm ở bước 1.
  Thêm bước thì đánh lại số mọi chỗ trỏ tới bước, cả câu trong phần giảng trỏ sang thực hành.
- Mức tối thiểu của câu đó là hiện tượng và việc cần làm, cộng một vế gộp nói công cụ chạy lại app khi nào (ở mức người học
  thấy được: mỗi lần lưu tệp, mỗi lần project được build lại). Nói thêm cơ chế (công cụ canh thư mục nào, lệnh nào chép tệp
  vào đó) là tùy chọn; đã nói thì phải đúng như dưới đây, và mỗi cơ chế là một thứ mới. Phần vì sao, khi có, nói đúng thứ
  làm công cụ chạy lại và lúc nào, vì mỗi công cụ canh một chỗ khác nhau: nodemon canh tệp nguồn, nên
  lưu tệp là chạy lại; Spring Boot DevTools canh thư mục build trên classpath (`target/classes`), nên lưu tệp nguồn chưa
  làm gì, phải có một lần build (lệnh chạy app ở terminal khác, IDE tự build) chép tệp mới vào đó thì bản đang chạy mới
  chạy lại. Vế "nên" phải theo được từ đúng thứ vừa nói ở vế trước. Không chắc công cụ canh gì thì chỉ nói "bản đang chạy
  có thể tự chạy lại", không đoán lúc. Công cụ đó giữ thêm thứ gì (DevTools giữ thêm một cổng cho LiveReload) thì kỳ vọng
  ở bước sau phải tính tới nó, hoặc lọc theo đúng giá trị bài đang xét thay vì theo tên process.
- Câu cảnh báo này là đoạn đầu của bước chuẩn bị, đi theo thứ tự: người học sẽ thấy gì nếu bỏ qua (bản đang chạy tự chạy lại,
  bước nào báo lỗi gì), rồi vì sao, rồi việc cần làm. Việc cần làm ("tạm bỏ khối dependency đó") không đứng trước lý do.
  Phần vì sao mà cần hai cơ chế của công cụ (nó canh thư mục nào, lệnh nào chép tệp vào thư mục ấy) là hai thứ mới: tách
  hai đoạn, hoặc chỉ giữ mức tối thiểu ở gạch trên. Không kết bằng "kết quả lệch đi", "có thể sai": nói lỗi cụ thể người
  học sẽ thấy.
- Câu ở đầu phần thực hành mở một nhánh ("project của bạn đã cấu hình sẵn giá trị khác thì thay giá trị ấy vào các bước dưới")
  thì kỳ vọng ở mọi bước sau phải đúng cả với nhánh ấy. Lệnh lọc bằng một chuỗi ngắn có thể khớp thêm thứ khác (một PID, một
  kích thước có cùng chữ số), và số dòng kỳ vọng đổi theo nhánh: lọc bằng giá trị đủ dài, hay nói kỳ vọng cho từng nhánh.
- Bước có cả lệnh, tên tệp, dòng cấu hình (nhất là bước dọn cuối) thì tách câu cho mỗi câu không quá hai đoạn mã, theo
  điều 5 của `references/core-rules.md`; tách xong mỗi câu vẫn giữ vế "nên", "vì" của nó.
- Bước dọn cuối trả lại mọi thứ phần thực hành đã thêm, xoá, sửa trong project, kể cả cách gỡ làm từ trước bước đầu
  (bỏ một dependency thì bước dọn bảo thêm lại đúng khối vừa bỏ, tắt một chế độ thì bật lại), chứ tắt process và xoá
  dòng cấu hình vừa thêm thì chưa đủ. Bài cho dùng project người học đang làm thì càng phải có, vì thay đổi sót lại dễ
  bị commit theo.
- Bài đưa từ hai cách xử lý trở lên thì một câu nói khi nào chọn cách nào, áp vào chính vụ mở bài: cách nào hợp với vụ đó và vì
  sao, cách kia hợp khi nào. Nói hệ quả của từng cách (bản cũ còn chạy tiếp) chưa đủ nếu không câu nào áp hệ quả đó vào vụ mở
  bài. Bảng tra cũng vậy: không viết "quyết định X hay Y" mà không có tiêu chí. Câu chọn cách đứng ngay sau đoạn giảng cách
  cuối, không có đoạn nào chen giữa (xem mục Chỗ hay hiểu sai). Mỗi vế của câu chọn cách nói một lần trong bài: lý do cách
  đầu hợp với vụ mở bài nằm ở câu chọn cách, nên đoạn kể cách đầu chỉ kể việc người trong vụ làm (không thêm "nhánh ấy gộp
  rồi, giữ cũng không ai dùng"); điều kiện của cách sau đã nằm ở câu mở cách sau ("Nhưng nếu nhánh ấy còn người khác dùng
  thì sao?"), nên câu chọn cách không viết lại "cách sau hợp khi cần giữ nhánh ấy". Câu chọn cách lúc đó chỉ còn một vế áp vào
  vụ mở bài kèm lý do ("Vụ hôm đó thì xoá nhánh là đủ, vì nhánh ấy đã gộp xong và không ai làm tiếp trên nó").
- Bước mở terminal, tab, cửa sổ mới thì nói mở vào shell nào và chọn ở đâu. Nơi mở mặc định có thể là shell khác (terminal
  của Windows hay của IDE thường mặc định PowerShell chứ không phải WSL), và lệnh gõ nhầm shell thì không chạy hay chạy ra
  thứ khác. Bước sau "mở như bước N" thì bước N phải nói đủ.
- Giải thích trước, lệnh theo sau. Không liệt kê lệnh.
- Mỗi lệnh lạ được giải nghĩa ngay tại chỗ gõ. Lệnh dọn đường cũng tính: tạo thư mục, chuyển thư mục, tham số của chúng,
  ký hiệu như `~`. Chưa dạy thì giải nghĩa nửa câu, hoặc bỏ lệnh đó (chạy ngay ở thư mục đang đứng).
- Bước dọn đường (lấy một project mẫu, thêm một dòng vào tệp cấu hình) làm bằng cách kéo ít chữ mới nhất. Xét theo nền người
  đọc mang sẵn cộng những gì các bài trước đã dạy: đề hay ghi chú tả người đọc biết gì, dùng công cụ nào hằng ngày thì đọc
  phần đó trước khi chọn cách làm từng bước. Người đọc là dev đã quen IDE thì bảo mở tệp bằng IDE hay trình soạn thảo họ
  vẫn dùng, không dùng lệnh ghi vào tệp (`echo … >>`, `sed -i`). Họ đã biết tạo project trên trang khởi tạo hay trong IDE
  thì bảo tạo theo cách đó, hoặc dùng project họ đang có, không dùng một dòng lệnh tải rồi giải nén. Lệnh dọn đường không
  thay được mà kéo từ hai thứ mới thì mỗi thứ một đoạn, như mọi đoạn khác của bài.
- Mỗi bài thực hành có một bước cố tình gây lỗi rồi tự sửa.
- Một bước bắt người học đối chiếu nhiều chỗ thì mỗi chỗ là một câu ghép: thấy gì, nên suy ra gì ("dung lượng còn trống ít hơn
  số ghi ở bước 2, tức tệp vừa tạo đã chiếm chỗ"). Không xếp ba câu cụt cùng khuôn "X khác Y", "Z khớp W" mà không câu nào nói
  khớp thì sao. Luật hai đoạn mã một câu bắt tách câu thì tách, nhưng mỗi câu tách ra vẫn giữ vế "nên", "tức" của nó; bớt đoạn
  mã bằng cách gọi lại thứ đã có tên bằng lời ("dung lượng còn trống"), không bằng cách bỏ vế suy luận. Đoạn đọc cột output
  trong thân bài cũng theo luật này. Đoạn so hai mã số (hai PID, hai số hiệu) mở bằng câu "X khác Y" thì kết bằng điều suy ra từ
  phép so (Y là thứ gì, đã dừng hay còn chạy), không kết bằng câu "X là một thứ khác": câu đó là câu mở nói lại bằng chữ khác.
  Bước có hai lệnh in output (một lệnh lọc, một lệnh xem dòng tiêu đề mà lệnh lọc làm mất) thì câu đọc output đứng ngay sau lệnh
  của nó; lệnh phụ đặt sau câu đối chiếu, hay thành bước riêng (đánh lại số mọi chỗ trỏ tới bước). Trong bước có từ hai output,
  mỗi lần chỉ "dòng đầu", "dòng cuối" thì gọi kèm lệnh ("dòng đầu `df -h | grep` in ra"). Câu nói tên cột đứng sau câu nói người
  học cần tìm gì ở cột đó, không đứng trước.
- Output đã chạy thật thì ghi ngày và nơi chạy. Nơi chạy là hệ điều hành và phiên bản, cộng phiên bản công cụ chính, lấy đúng như
  tệp vào hay ghi chú ghi. Ghi một lần, ngay trước khối output đầu tiên của lần chạy đó; có ngày mà thiếu máy là thiếu. Nơi chạy
  đứng thành câu riêng, hay vế riêng ở cuối câu dẫn khối ("…, và lệnh báo lỗi. Máy hôm đó chạy Ubuntu 24.04, Git 2.43:"), không
  chen giữa câu kể vụ, nhất là trước vế kể chỗ hỏng. Câu mở bài không mở bằng hai mốc liền (thứ, ngày, giờ): giữ mốc mạch kể cần
  (giờ sẽ đem so với output), ngày đưa vào câu ghi nơi chạy. Output chưa chạy thì ghi là kỳ vọng ("chưa chạy trên máy nào", không
  "chưa chạy trên máy bạn" như thể đã chạy ở máy khác). Output dựng ra cho câu hỏi kiểm tra thì mở bằng "Giả sử lệnh in ra…",
  không ghi ngày, nơi chạy. Câu ghi nơi chạy nói gộp ("mọi output…") mà bài còn kết quả kỳ vọng ở phần thực hành thì nói đúng
  phạm vi ("mọi khối output trong phần giảng").
- Output do người viết bài (agent) chạy trên một máy khác máy người học thì ghi ngày, nơi chạy, và nói nó khác môi trường
  của người học ở đâu. Viết câu không chủ ngữ ("Dòng này chạy ngày… trên…"), không viết "mình đã chạy": trong bài "mình" là
  người dùng, người dùng không chạy lần đó.
- Chỉ vào một cột, một trường của output thì gọi bằng tên cột ở dòng tiêu đề, hoặc bằng chính giá trị nó in ra ("cột ghi
  `13:00`"). Không gọi "cột trước đó", "cột thứ ba" khi chưa đếm lại trên output. Output không có dòng tiêu đề thì đếm lại từng
  cột trước khi viết vị trí. Câu mở đoạn đọc output không báo trước số chỗ hay vị trí sẽ đọc ("đọc ở hai đầu", "có ba phần") khi
  chưa đếm lại số chỗ đoạn đọc; cứ đọc lần lượt từ trái sang phải. Câu mở hẹn hai chỗ mà đoạn đọc ba, hay chỗ bài cần nhất nằm
  giữa hai chỗ đã hẹn, thì người đọc khựng ở câu đọc chỗ thứ ba. Cột mà phần thực hành còn dùng thì gọi bằng tên ở dòng tiêu đề
  ngay từ thân bài, vì giá trị trên máy người học sẽ khác; gọi bằng giá trị ở thân bài rồi tới thực hành mới đặt tên thì thành
  hai tên cho một cột. Khối output thân bài không có dòng tiêu đề (`grep` lọc mất) thì chính câu đầu gọi tên cột nói tên ấy
  nằm ở dòng tiêu đề đã bị lọc, để người đọc khỏi tìm chữ đó trong khối. Ba luật về chỗ này đọc cùng nhau: gạch này, gạch
  dưới (ngoại lệ gọi theo hình dạng giá trị) và gạch về tên cột lấy từ hiểu biết sẵn ở mục Trung thực.
- Không gọi cột bằng loại giá trị ("cột giờ", "cột dung lượng") khi output có từ hai cột cùng loại (`df` có ba cột dung
  lượng, `free` có bốn). Gọi bằng tên ở dòng tiêu đề, kèm nghĩa ("cột `Avail`, dung lượng còn trống"). Lệnh có `grep` làm
  mất dòng tiêu đề thì nói tên cột ấy lấy ở dòng tiêu đề của lệnh không lọc. Ngoại lệ: dòng bài đọc chỉ có một giá trị mỗi
  loại và tên cột mang chữ chưa dạy (`Local Address`, `Peer`) thì gọi theo hình dạng giá trị ("cụm có dấu `@`", "phần đứng
  sau `size=`"), cùng một cách gọi ở thân bài, thực hành và đáp án. Khi đó không cần thêm bước chạy lệnh không lọc chỉ để
  lấy tên cột, và lời trả không phải nói tên cột lấy từ đâu.
- Cột nào đã có tên ở thân bài thì phần thực hành, câu hỏi và đáp án gọi đúng tên ấy. Ở thực hành giá trị trên máy người
  học sẽ khác, nên đừng đổi sang tên theo loại giá trị cho gọn.
- Bài kể một sự cố hay có bước gây lỗi thì có bảng tra từ triệu chứng ra lý do, mỗi dòng nói rõ ai viết ra thông báo đó
  (app, công cụ nào, hay hệ điều hành báo thiếu lệnh). Triệu chứng là một lệnh không in gì thì ô đó ghi lệnh nào không in
  gì, không bỏ trống. Lệnh có dấu `|` thì ô triệu chứng ghi cả dòng lệnh, còn ô ai in ra ghi lệnh đứng sau cùng kèm lý
  do ("`grep`, vì không dòng nào lệnh trước in ra có số đó"). Lệnh đứng trước vẫn in dòng tiêu đề và các dòng khác, chỉ
  là bị lọc hết, nên ghi nó "không in gì" là sai.

## Câu hỏi kiểm tra

- Hỏi để người học phải suy luận. Không hỏi "bạn hiểu chưa".
- Câu hỏi có đáp án đúng sai rõ ràng.
- Đáp án chỉ dựa vào những gì đã dạy. Trước khi hỏi thì viết sẵn đáp án, liệt kê mọi khái niệm đáp án dùng, đối chiếu từng
  cái với phần đã dạy. Thiếu một cái thì bỏ câu hỏi đó.
- Viết xong mỗi câu thì tìm đáp án của nó trong thân bài và bảng tra. Có một câu hay một dòng bảng nói gần nguyên đáp án
  thì câu hỏi chỉ bắt dò lại, dù tình huống kể khác đi. Đổi để đáp án phải ghép hai điều đã dạy ở hai chỗ khác nhau, hay
  đưa tình huống mà không dòng bảng nào khớp thẳng; không đổi được thì thay câu khác. Ý chỉ nằm ở một câu phụ hay một dòng
  bảng tra thì không đem ra hỏi. Hai điều đáp án ghép phải nằm ở hai đoạn khác nhau của thân bài: nằm chung một đoạn, hay
  một bước thực hành nói lại cả hai, thì người học chỉ dò lại đoạn đó. Sửa thân bài cho gọn mà gom hai điều về một đoạn thì
  soát lại câu hỏi dùng chúng, đổi câu hỏi để nó ghép với một điều ở đoạn khác.
- Tìm cả các câu ví dụ trong thân bài (có "kiểu", "chẳng hạn", "ví dụ"), nhất là đoạn nói khi nào chọn cách xử lý nào.
  Tình huống câu hỏi trùng một ví dụ thân bài đã đưa, kèm hệ quả của nó, cũng là câu dò lại. Đổi tình huống sang thứ thân
  bài chưa đi qua, hoặc bỏ ví dụ khỏi thân bài. Soát cho mọi câu, không chỉ câu đáng ngờ nhất.
- Đáp án chỉ là một luật của bài trước áp thẳng, hay vế ngược của một câu thân bài vừa viết (thân bài nói "chưa làm X nên
  còn Y", câu hỏi hỏi "làm X rồi thì sao"), cũng là câu dò lại. Bài có câu nói khi nào chọn cách xử lý nào thì câu hỏi
  về chọn cách không nêu sẵn vế điều kiện của câu đó (thứ kia còn cần hay không): tình huống chỉ cho dữ kiện, người học
  phải suy ra vế điều kiện từ một điều khác đã dạy rồi mới áp tiêu chí.
- Vế phụ chỉ có việc để làm với một đáp án của vế chính thì lộ đáp án đó, kể cả khi mở bằng "nếu": "Có chạy được không? Nếu
  không thì lỗi ghi gì?", "Làm A hay B? Nếu B thì làm ở chỗ nào?", "Làm A hay B, và làm B ở chỗ nào?". Gộp thành một câu hỏi mà
  đáp án phải tự nêu cả kết luận lẫn chi tiết ("Lần chạy thứ hai ra sao, log ghi gì?", "Xử lý thế nào, ở chỗ nào, vì sao?"). Câu
  hỏi về nhiều thứ cùng lúc mà gọi sẵn từng kết cục ("nhánh nào gộp được, nhánh nào bị từ chối", "máy nào lên, máy nào chết")
  cũng lộ, vì nó báo trước mỗi kết cục có ít nhất một thứ. Hỏi chung cho từng thứ: "Mỗi nhánh ra sao, Git báo gì, vì sao?"
- Đề tả output bằng lời thì ghi đủ số dòng và mỗi dòng là gì ("thấy ba dòng: hai dòng là process `nginx`, dòng cuối là
  lệnh `grep`"), hoặc dán output vào khối code mở bằng "Giả sử lệnh in ra…". Câu hỏi là chỗ người học đọc chậm nhất, chữ nào
  cũng thành dữ kiện: "thấy hai dòng X, dòng cuối là Y" đọc thành chỉ một dòng X, rồi câu sau nhắc hai dòng X là mâu thuẫn. Đếm
  lại số dòng câu tả nói với số dòng các câu sau nhắc tới.
- Câu hỏi mà hai cách xử lý đều nghe được (tắt thứ này hay đổi cấu hình thứ kia) thì đề cho đủ dữ kiện để loại cách đáp án
  không chọn, hoặc đáp án nói vì sao không chọn cách ấy; thiếu thì người học chọn cách kia mà đáp án không chấm được.
- Viết xong đáp án thì đọc lại từng vế như người chấm: vế đó có đúng với chính tình huống câu hỏi không, có chọi với câu
  luật đáp án vừa dẫn không. Gộp hai thứ vào một chủ ngữ ("cả hai đều…") thì kiểm vế đó đúng với cả hai.
- Bộ câu hỏi viết sẵn trong bài thì đáp án để riêng ở cuối bài. Mỗi đáp án nêu kết luận trước, rồi lý do bằng đúng tên bài
  đã dùng cho mỗi thứ, không thêm chữ mới. Câu hỏi về thứ người dùng dặn tránh hay đã hẹn "lúc khác" thì không ra.
- Trả lời đúng thì xác nhận ngắn rồi đi tiếp. Trả lời sai thì tìm đúng chỗ hiểu sai và giảng lại chỗ đó.

## Chỗ hay hiểu sai

- Nói vì sao cách nghĩ đó nghe hợp lý, rồi mới nói nó sai ở đâu. Câu ngay sau cách nghĩ sai là lý do nó nghe hợp lý;
  câu phán sai ("Không phải.", "Nhưng…") đứng sau câu đó, không đứng trước. Lý do nghe hợp lý thường là thứ người đó
  thấy lúc ấy: màn hình hiện gì, lỗi hiện ra ngay sau việc gì. Thứ đó phải có trong ghi chú hay output. Ghi chú không có
  thì viết lý do thành điều chung, ai làm theo cách ấy cũng thấy vậy, không gán cho người thật một chuyện cũ ("bạn ấy
  từng chạy…", "lần nào bạn ấy cũng thấy…") mà ghi chú không ghi (xem mục Trung thực).
- Mỗi chỗ hiểu sai làm như vậy, kể cả chỗ chỉ là một câu trích lời ai đó.
- Lý do nghe hợp lý đứng thành câu riêng, mở bằng chính nó ("Nghĩ vậy cũng dễ hiểu, vì…"). Không nối đuôi nó vào câu luật
  hay câu suy luận bằng "mà": người đọc phải đọc lại mới biết vế nào là lý do nghe hợp lý, vế nào là phép suy. Dữ kiện đi
  kèm (số cửa sổ đang mở, giờ chạy) chỉ nối bằng "vì" khi nó là lý do thật của vế trước; không thì nối bằng "và" hay đặt
  câu riêng.
- Nhiều chỗ hiểu sai hay câu hỏi của cùng một người thì đặt mỗi chỗ ở đoạn bài đang giảng tới thứ nó đụng (chỗ nghĩ sai về lỗi
  đặt ngay sau đoạn đọc lỗi, câu hỏi về một con số đặt sau câu giảng con số đó), mở bằng chữ nối về câu trước. Không xếp chúng
  liền nhau thành chuỗi đoạn cùng mở bằng tên người ("X tưởng", "X còn hỏi", "X hỏi thêm"). Hai chỗ đứng gần nhau thì đổi cách
  mở (một chỗ mở bằng câu trích, một chỗ mở bằng việc người đó làm) và đổi chữ dẫn lý do, không cùng "nghe hợp lý, vì… Nhưng…".
  Cả bài cũng không để ba chỗ cùng khung "[Nghĩ vậy, Hỏi vậy, Câu ấy] cũng [dễ hiểu, có lý, phải], vì": đổi tính từ mà giữ
  khung vẫn là một khuôn; có chỗ nói thẳng lý do bằng thứ người đó thấy, có chỗ để output gỡ ngay sau câu trích.
  Câu hỏi phụ không chen giữa đoạn giảng cách xử lý sau và câu nói khi nào chọn cách nào: hai đoạn ấy đứng liền. Câu hỏi phụ trả
  lời bằng một câu luật thì đặt ngay sau đoạn giảng câu luật đó, hay ngay trước đoạn trả lời câu hỏi của bài, không đặt sau đoạn
  giảng một cách xử lý chỉ vì người đó hỏi sau.
- Đoạn gỡ chỗ hiểu sai bằng output dừng ở câu suy ra điều thật ("…, nên cửa sổ cũ vẫn mở"). Không thêm câu xác nhận lại kết luận
  ấy bằng dữ kiện của ghi chú ("Hôm đó cửa sổ cũ vẫn mở thật…"): dữ kiện ghi chú (số cửa sổ, ai thấy gì) đặt vào câu lý do nghe
  hợp lý ở đầu đoạn, hoặc bỏ nếu nó không làm việc gì. Trừ dữ kiện nói ra điều output sắp gỡ: câu lý do "vì lệnh commit báo
  thành công, còn lệnh push thì bạn ấy chưa gõ" đã nói code chưa lên, nên đoạn đọc `git status` sau đó chỉ còn nói lại. Câu
  lý do chỉ giữ thứ người đó thấy lúc ấy ("lệnh commit vừa báo thành công"); dữ kiện lộ đáp án thì để sau đoạn đọc output hay
  bỏ. Cách thử: che phần sau câu lý do, người đọc đã đoán ra điều thật chưa; rồi thì bỏ dữ kiện ấy. Chỗ hiểu sai mà một
  output trong bài gỡ được thì đặt trước đoạn đọc output ấy, để output là thứ gỡ ("Bạn ấy bảo đã đẩy code lên rồi", rồi
  `git status` vẫn báo nhánh đi trước origin một commit). Thứ tự trong ghi chú không cho đặt trước thì đoạn gỡ chỉ gồm câu lý
  do nghe hợp lý cộng một câu trỏ về chỗ output đã cho thấy, không suy lại kết luận đoạn đọc output vừa nói.
- Câu lý do có từ hai vế thì thử từng vế như trên. Vế tả cảnh lúc ấy (màn hình hiện gì, danh sách còn gì) hay mang điều
  thật mà không lộ ra như một kết luận: "vì `docker ps` không còn dòng nào của container ấy, chỉ `docker ps -a` còn" nói container
  vẫn còn, đúng điều đoạn đọc output sắp gỡ, lại làm lý do yếu đi (danh sách kia còn thì sao lại tưởng đã xoá). Giữ vế tả thứ
  người đó nhìn vào, bỏ vế kia.
- Đoạn chỗ hiểu sai chen vào giữa câu hở của một mục ("Vậy commit nào đã làm hỏng build?") và đoạn tìm tiếp thì đoạn tìm tiếp
  mở bằng chữ nối về câu hở ("Để tìm commit ấy, bạn ấy…", "Còn commit làm hỏng thì…"), không mở bằng lời kể trơn ("Bạn ấy tra
  mạng thấy lệnh X…"). Cách thử: che cả đoạn chỗ hiểu sai, đoạn tìm tiếp phải bám được vào câu hở; rồi che câu hở, đoạn tìm
  tiếp không được đứng một mình như một chuyện mới.
- Đoạn đọc lỗi đã gỡ chỗ hiểu sai (lỗi không nằm ở chỗ người đó đang sửa) thì gỡ một lần, ở câu đưa bằng chứng. Vế đuôi câu kế
  ("…, không dòng nào chỉ vào X") cũng là nói lại. Câu hỏi của bài đặt ngay sau đoạn ấy không mang lại kết luận vừa gỡ ("…, dù
  lỗi không nằm ở X?"); nó hỏi thẳng thứ còn thiếu (con số, cái tên trong câu lỗi là gì, vì sao nó làm hỏng việc). Đoạn trả
  lời câu hỏi của bài ở cuối phần giảng gom các kết luận lại một lần, nên gọi lại kết luận đã gỡ ở đó không tính là nói lại.
- Kể ngay chỗ nó xảy ra trong thân bài cũng được, không bắt buộc làm bảng. Có bảng thì ba cột "Dễ nghĩ là", "Vì sao nghe
  hợp lý", "Sai ở đâu". Không đặt tên cột "Thật ra".
- Cột "Mình từng nghĩ" chỉ dùng khi mọi dòng là chỗ người viết (người dùng) đã hiểu sai thật. Chỗ hiểu sai của người học
  mà người dùng kèm thì kể là của người học ("bạn ấy tưởng…"), không viết "mình từng nghĩ".
- Không lặp nguyên văn một dòng hiểu sai ở nhiều bài.

## Hình và ví dụ

- Sơ đồ chữ thẳng cột. Không vẽ khung bọc trọn cả sơ đồ.
- Chú thích hình nói hình chứng minh điều gì cho bài.
- Truyện tranh, hình vui thì phải nói đúng điều mục đó đang giảng. Chú thích kể lại nội dung, và nói truyện nói quá
  hay bỏ qua điều gì.
- Lời trong ảnh không đọc được ở cỡ hiển thị thì trích thành chữ thật kèm nguồn.

## Trung thực

- Công cụ nào có nhược điểm thì nói ra.
- Thông tin riêng của người học (nơi làm việc, tên máy, địa chỉ thật) không đưa vào tài liệu công khai.
- Người thật khác trong chuyện mở bài (học viên, đồng nghiệp) thì không ghi họ tên đủ trong tài liệu công khai. Gọi bằng
  tên gọi người dùng đã dùng; người dùng dặn ẩn danh thì "một bạn trong nhóm". Báo người dùng trong lời trả.
- Kể về người thật thì chỉ kể điều ghi chú có: họ làm gì, nói gì, theo thứ tự nào. Lúc họ nói ("khi thấy khối này",
  "ngay lúc đó"), việc họ từng làm trước buổi đó, điều họ nghĩ trong đầu mà ghi chú không ghi thì không thêm, dù nghe hợp
  lý. Cần lý do thì viết thành điều chung, không gắn tên người. Lý do họ làm một việc cũng tính: "bạn ấy không cần nhánh ấy nữa
  nên xoá" khi ghi chú chỉ ghi việc xoá thì viết "nhánh đã gộp xong thì giữ lại cũng không ai làm tiếp trên nó", không gắn tên.
  Lý do chung ấy phải đúng ở mọi trường hợp bài nêu, kể cả cấu hình riêng phần thực hành đã cảnh báo (một công cụ tự chạy lại
  bản cũ với code mới thì "bản cũ chạy code cũ" sai); không chắc thì lấy lý do từ điều output cho thấy.
- Con số ghi chú kèm chữ rào ("gần nửa tiếng", "khoảng ba lần", "chừng 2 GB") giữ chữ rào ở mọi lần nhắc lại trong bài. Chỗ
  hay rơi là đoạn trả lời cuối và đáp án, nơi câu được rút cho gọn hay viết lại cho có nhịp: rút thì bỏ cả con số ("bạn ấy ngồi
  sửa cả buổi" không được, "bạn ấy ngồi sửa lớp ấy" thì được), không bỏ chữ rào.
- Câu kể thứ tự bên trong một công cụ (lỗi xảy ra trước hay sau khi code của người học chạy, bước nào của lúc khởi động hỏng)
  là dữ kiện kỹ thuật, không phải suy luận từ output. Framework thường tạo xong các lớp của người học rồi mới mở kết nối, đọc
  tệp, nên "app dừng trước khi code kịp chạy" dễ sai. Không chắc thứ tự thì chỉ nói điều output cho thấy ("log không dòng nào
  nhắc tới lớp ấy").
- Ghi chú hay đề ghi một dữ kiện là chưa kiểm (một app có chạy trên máy người học không, nó giữ số nào trên máy đó) thì câu
  trong bài giữ lời rào ("mặc định", "nếu có chạy"), kể cả khi câu đó trả lời một câu hỏi mà người hỏi coi điều ấy là có
  sẵn. Không viết thì hiện tại về máy người học như đã thấy ("X giữ cổng Y"). Sửa câu cho gọn, cho đỡ chữ thì không bỏ lời
  rào; bỏ được thì bỏ cả câu.
- Tên app, service, đường dẫn API không chứa tên công ty hay tên người thì giữ. Lời ghi chú của tệp vào về nơi làm (máy
  công ty, máy ở nhà) không đưa vào câu ghi nơi chạy; nơi chạy chỉ là hệ điều hành và phiên bản.
- Bài dựa vào một dữ kiện kỹ thuật lấy từ hiểu biết sẵn mà lần này không mở được nguồn để kiểm thì không bịa mục nguồn;
  lời trả nêu dữ kiện đó là chưa kiểm nguồn. Dữ kiện chỉ kiểm được trên một máy khác phiên bản (không đưa output đó vào
  bài) thì lời trả nói đã kiểm trên phiên bản nào. Tên cột lấy từ hiểu biết sẵn vì `grep` đã lọc mất dòng tiêu đề cũng là
  dữ kiện chưa kiểm: phần thực hành có bước chạy lệnh không lọc để người học tự thấy dòng tiêu đề, còn lời trả nói gộp
  "tên cột lấy từ hiểu biết sẵn", không kể từng tên. Bài gọi cột theo hình dạng giá trị (ngoại lệ ở mục Bài thực hành) và không
  nêu tên cột nào thì không có dữ kiện này, không cần bước chạy không lọc.
- Output có thông tin riêng thì che đúng phần riêng, còn lại giữ nguyên chữ. Phần riêng thường gặp: dấu nhắc lệnh có tên user và
  tên máy, cột user, đường dẫn và tên gói có tên công ty, cả tên gói viết tắt trong log (`c.x.proj.App`) và classpath sau `-cp`.
  Mỗi loại một chữ thay cố định cho cả bài: dấu nhắc thành `$`, cột user thành `user`, đường dẫn và tên gói thành `[…]`. Đường
  dẫn và tên gói thì che từng đoạn riêng (tên user, tên công ty) chứ không che cả chuỗi; đoạn còn lại (tên project, thư mục
  build) bài cần làm bằng chứng thì giữ. Một đoạn dính phần riêng với phần giữ được (tên công ty nối tên project bằng gạch nối)
  thì che cả đoạn, và chỗ khác mang cùng phần riêng (tên gói, tên gói viết tắt) che cùng một mức: cùng giữ phần project hay cùng
  che, không mỗi chỗ một kiểu. Tên công ty viết tắt còn một chữ cái trong tên gói log (`c.x.…`) cũng che, cho cùng kiểu với tên
  gói đủ ở output khác. Không che số hiệu, cổng, giờ, chữ của thông báo lỗi. Cạnh khối output đầu tiên có che thì một câu nói đã
  che những gì. Câu đó chỉ nói đã che gì và dấu che, dấu cắt trông ra sao (câu đọc lướt ở mục đầu tệp, nếu cần, đứng riêng ngay
  sau), không thêm câu nói về bài. Phần mở bài kể vụ rồi đi thẳng vào khối lỗi thì đặt câu ấy ngay dưới khối ("Khối trên đã
  che…"), để đoạn ghi chú không chen giữa câu mở bài với khối lỗi. Bài cũng cắt bớt dòng (chỗ cắt ghi […] theo
  `references/core-rules.md`) thì chỗ cắt đứng riêng một dòng, chỗ che nằm trong dòng, và cùng câu đó nói […] dùng cho cả hai.
  Tệp vào đã có dấu cắt của người dùng (`...`) thì đổi thành […] cho cùng một dấu, và lời trả nói đã đổi.
- Dòng có phần riêng thì giữ dòng, che phần riêng; không bỏ cả dòng cho khỏi phải che. Bỏ dòng nào cũng là cắt, kể cả
  dòng cuối khối và dòng ngay sau dòng bài đang nói tới, nên chỗ đó ghi […] riêng một dòng. Khối dừng ở giữa những gì
  lệnh in ra mà không có […] thì người đọc hiểu lệnh chỉ in tới đó.
- […] đứng ngay dưới một dòng lệnh thì người đọc hiểu lệnh ấy có in mà bị cắt. Phần bị bỏ là cả một lệnh khác (dấu nhắc, lệnh,
  output của nó) mà lệnh đứng ngay trên không in gì thì không đặt […] ở đó: tách thành hai khối, giữa hai khối là câu văn kể
  tiếp; hoặc giữ lệnh bị bỏ, che phần riêng. Câu văn nói một lệnh "không in gì" thì dưới lệnh ấy trong khối không có […]. Câu
  văn giữa hai khối không phải nói đã bỏ lệnh nào; chỉ nói ("bạn ấy còn xoá thư mục `build`, bài bỏ đoạn đó") khi lệnh bị
  bỏ đổi điều khối sau cho thấy (nó sửa tệp, tắt hay bật một thứ), vì không nói thì người đọc làm lại theo khối sẽ ra kết quả
  khác. Lệnh bị bỏ chỉ đọc mà không đổi gì (gọi thử, xem trạng thái) thì kể thẳng việc tiếp theo. Không nhắc lệnh bị bỏ bằng
  chữ giấu tên ("một lệnh", "một công cụ", "một cách khác"): hoặc gọi đúng tên một lần kèm việc đã xảy ra ("bạn ấy thử
  `tree`, máy báo chưa cài lệnh đó"), hoặc không nhắc. Câu nói đã bỏ đoạn nào ("…, bài bỏ đoạn đó") dùng nhiều nhất một lần
  trong bài, ở chỗ khối output bị tách; chỗ khác kể thẳng việc người trong vụ làm tiếp.

## Giao bài

- Đường dẫn tệp đứng riêng dòng đầu lời trả, không nằm trong câu. Nửa câu đối chiếu đã gọi hai tệp vào là hai đoạn mã, nên
  đường dẫn bài mà nằm chung câu ấy là ba đoạn mã một câu, phạm điều về đoạn mã của `references/core-rules.md`. Viết xong thì
  chạy `node scripts/lint.mjs -` với lời trả qua stdin; còn chỗ nào nó báo thì tách câu.
- Lời trả chỉ gồm đường dẫn tệp cộng nhiều nhất ba câu: đã che hay ẩn danh gì, output nào là kỳ vọng hay chạy ở máy khác, đã
  đối chiếu dữ kiện nào với tệp vào nào (output, câu trích lời, ngày), còn gì chưa kiểm. Theo mục "Trả lời trong chat" của
  `references/core-rules.md`: nửa câu đối chiếu là nói dữ kiện đã kiểm với nguồn, không phải kể đã chạy lint hay đọc lại
  mấy lượt.
- Bài dựng từ tệp vào (output, ghi chú buổi học) thì lời trả luôn có nửa câu đối chiếu đó, gọi tên tệp ("output, giờ và
  lời trích khớp `<tệp output>`, `<tệp ghi chú>`"). Vế này không bị bỏ khi hết chỗ: người dùng dựa vào nó để biết bài không
  bịa. Phần còn lại không đủ chỗ trong giới hạn câu thì ưu tiên theo thứ tự: chỗ che và ẩn danh, output kỳ vọng hay chạy ở
  máy khác, dữ kiện chưa kiểm nguồn và ngoại lệ của câu luật, rồi mới tới câu hỏi đã bỏ.
- Giới hạn tính cả độ dài chứ không riêng số câu: cả lời trả khoảng 100 chữ, không câu nào quá 40 chữ, không liệt kê
  trong ngoặc. Danh sách ưu tiên dài hơn chỗ thì bỏ mục ưu tiên thấp, không nhồi bằng dấu chấm phẩy và ngoặc lồng; mỗi
  mục nói gộp ("đã che tên user, tên công ty", "tên cột lấy từ hiểu biết sẵn", "câu luật có ngoại lệ cần cấu hình
  riêng"), không kể từng tên cột, từng tùy chọn, từng ngoại lệ.
- Dấu che, dấu cắt và ký hiệu (`$`, `[…]`, `...`, `|`) trong lời trả cũng tính là đoạn mã hay ký hiệu, dù `lint.mjs` không
  đếm chúng. Nói chỗ che bằng lời ("che dấu nhắc lệnh, tên user và tên công ty trong output, gộp dấu cắt về một dấu"), không
  chép lại các dấu ấy.
- Không tóm cấu trúc bài, không kể lại các phần, không báo số chữ khi không ai hỏi, không gạch đầu dòng nhiều dòng.

## Soát trước khi giao

Đọc tuần tự từ đầu, từng câu, rồi kiểm thêm. Sáu chỗ hay vấp nhất, soát trước: đoạn nào dạy quá một thứ mới (kể cả bước chuẩn bị
ở đầu thực hành); thứ nào có hai tên; câu nào nói lại câu trước hay một kết luận đã có, hay đứng rời không bám câu trước; đoạn
nào chen giữa hai đoạn đang nối nhau; khối output nào lệch tệp vào hay có […] đặt sai chỗ; câu hỏi kiểm tra nào lộ đáp án.

- Mỗi […] trong khối output: che câu văn quanh nó, người đọc có tưởng nó là phần bị cắt của lệnh ngay trên không. Câu
  văn nói lệnh đó "không in gì" thì dưới nó không được có […].
- Mỗi số, giờ, tên lấy từ output mà câu văn dùng làm bằng chứng: che khối output, câu trước hay chính câu đó có nói nó nằm
  ở cột nào, dòng nào không; không thì chỉ ra ngay trong câu đó.
- Mỗi câu so với một cấu trúc nhiều phần (`Map`, một bảng, một cuốn sổ): chủ ngữ của câu so ứng với cả cấu trúc chứ không
  với một phần ("Git giữ danh sách nhánh giống một `Map`: key là tên nhánh, value là commit nhánh trỏ tới", không "nhánh giống
  một `Map`" khi nhánh chỉ là một key); vật so giữ một tên tới hết đoạn.
- Câu đếm số cách, số phần ("có hai cách", "gồm ba bước") rồi "thứ nhất… thứ hai…": bỏ câu đếm, mở mỗi cách bằng việc
  người trong vụ làm hay chỗ cách trước không dùng được.
- Mỗi khối output: có ngày, nơi chạy (hay chữ "kỳ vọng"); chữ lạ trong đó đã giải nghĩa, hay được câu đọc lướt chung che; câu ấy
  đứng riêng, không nối vào câu che bằng "và". Tìm "không dùng", "không cần", "bỏ qua", "chưa cần" trong bài: cộng cả câu đọc
  lướt chung mà quá hai lần thì gộp vào câu ấy; trong một đoạn có hai câu như vậy thì gộp thành một câu. Đối chiếu từng dòng với
  tệp vào, từ dòng lệnh tới dòng cuối lệnh đó in ra: dòng nào thiếu mà không có […] thì đưa lại (che phần riêng) hay ghi […]. Đọc
  cả dòng lệnh có dấu nhắc, từng phần sau tên lệnh: phần nào chưa có lời thì thêm nửa câu.
- Câu định nghĩa và câu luật cả bài dựa vào: tìm "thường ngày", "như trong bài này", "với app như"; có thì bỏ lời rào,
  ngoại lệ chuyển vào lời trả.
- Mỗi lời giải tham số: có chữ nào nói thứ đó "có loại", "có tên", "có chế độ" mà bài chưa giảng không.
- Mỗi chỗ chỉ vào cột, dòng của output: đếm lại trên output; output có hai cột cùng loại thì gọi bằng tên tiêu đề; thân bài,
  thực hành, đáp án gọi cùng một tên. Giá trị nhiều phần (`host:cổng`) hay tên cột có chữ chưa dạy mà câu văn nhắc tới: cùng
  câu có nói phần còn lại bài không cần không.
- Thuật ngữ chính của bài: tìm lần đầu nó vào câu văn (ngoài lời trích, dấu mã, nhan đề); lần đó phải là câu định nghĩa
  hoặc đứng sau câu định nghĩa. Đoạn có câu định nghĩa: đếm chữ được giải nghĩa trong đoạn, kể cả chữ người đọc quen gõ; quá
  một thì tách đoạn.
- Câu hỏi của bài: tìm trong phần mở câu nào đã hỏi hay nói gần như vậy ("muốn hiểu… thì phải biết…"); có thì bỏ câu đó.
- Mỗi đoạn giải nghĩa chữ trong output: che đoạn trước, đoạn này còn bám vào đâu không; đoạn sau nó có mất chỗ bám không.
  Chữ, số được giải nghĩa có được dùng ở đoạn ngay sau không; không thì dời xuống chỗ dùng. Chữ đó có xuất hiện lại ở
  đâu trong bài không; không thì bỏ câu giải nghĩa.
- Mỗi đoạn đứng ngay trước chuyện người thật hay chỗ hiểu sai: câu cuối của nó có phải câu đoạn sau bám vào không; không
  (một câu giải dòng thừa, một chữ lạ) thì đưa câu đó lên đầu đoạn hay gộp thành nửa câu.
- Mỗi bước thực hành có đối chiếu: câu nào cũng nói khớp hay khác thì suy ra gì.
- Mỗi lệnh trong phần thực hành, kể cả lệnh tạo và chuyển thư mục: đã dạy hay đã giải nghĩa.
- Mỗi đoạn hay bước có lệnh mới (gọi thử, tải về, ghi vào tệp), ở cả thân bài lẫn thực hành: đếm lệnh, đường dẫn, câu lỗi,
  ký hiệu mới trong đó; quá một thì tách đoạn. Lệnh dọn đường nào thay được bằng việc người đọc đã quen làm (mở tệp bằng
  IDE, tạo project theo cách họ vẫn tạo) thì thay.
- Mỗi bước mở terminal hay tab mới: nói shell nào. Mỗi bước sửa tệp của project hay chạy lại app: có câu nói cấu hình
  riêng nào có thể làm kết quả khác kỳ vọng, câu đó nói đúng lúc công cụ chạy lại, và kỳ vọng ở các bước sau có tính tới
  thứ công cụ đó giữ thêm.
- Bài có từ hai cách xử lý: có câu nói khi nào chọn cách nào, áp vào vụ mở bài; bảng tra không có "quyết định X hay Y"
  trơn. Đặt câu chọn cách cạnh câu mở cách sau và đoạn kể cách đầu: vế điều kiện nào đã có ở câu mở cách sau, vế lý do nào
  đã có ở đoạn kể cách đầu thì bỏ khỏi chỗ đến sau.
- Đoạn giảng cách xử lý cuối và câu chọn cách: có đoạn nào chen giữa (câu hỏi phụ, chuyện bên lề) không; có thì dời nó về sau
  đoạn giảng thứ nó dựa vào.
- Mỗi câu kể về người thật (họ từng làm gì, nói lúc nào, nghĩ gì): tìm câu đó trong ghi chú; không có thì viết thành điều
  chung hay bỏ.
- Mỗi dữ kiện ghi chú hay đề đánh dấu "chưa kiểm", "chưa thử": tìm câu tương ứng trong bài; câu đó có lời rào ("mặc định",
  "nếu có chạy") hay ghi kỳ vọng không. Soát lại sau mỗi lần rút câu cho gọn. Mỗi con số ghi chú kèm chữ rào ("gần",
  "khoảng"): tìm con số ấy trong cả bài, lần nào cũng phải còn chữ rào, nhất là ở đoạn trả lời cuối và đáp án.
- Bước dọn của phần thực hành: mọi thứ các bước trước (kể cả bước chuẩn bị) đã thêm, xoá, sửa trong project đều được
  trả lại.
- Mỗi đáp án: đọc từng vế với chính tình huống câu hỏi; vế "cả hai…" đúng với cả hai không, có chọi câu luật vừa dẫn không.
- Lời trả: đường dẫn tệp đứng riêng dòng đầu; có nửa câu đối chiếu gọi tên tệp vào; đếm chữ (khoảng 100), câu dài nhất (không quá
  40 chữ), đếm đoạn mã mỗi câu (không quá hai, dấu che `$`, `[…]` cũng tính), không ngoặc liệt kê. Chạy `lint.mjs -` trên lời
  trả.
- Tên bài trước đã dạy cho từ chung (option, câu lệnh, path, dấu `|`): bài này có dùng chữ khác cho cùng thứ không.
  Tìm "cờ", "đối số", "tùy chọn", "ống" trong bài; thuật ngữ có tên tiếng Anh thì về tên tiếng Anh, còn lại đổi về chữ bài
  trước dạy.
- Mỗi câu hỏi kiểm tra, làm cho cả bộ: đáp án có nằm gần nguyên ở một câu thân bài hay một dòng bảng tra không; tình
  huống có trùng một câu ví dụ ("kiểu", "chẳng hạn") của thân bài không. Ghi cạnh mỗi đáp án các ý nó dẫn nằm ở đoạn nào
  của thân bài; mọi ý nằm trong một đoạn là dò lại. Soát lại bước này sau mỗi lần sửa thân bài cho gọn.
- Bảng tra: ô ai in ra của triệu chứng có dấu `|` là lệnh đứng sau cùng.
- Số chữ: đếm cả phần thực hành, hai cách đếm, nằm giữa khoảng người dùng xin.
- Mỗi chỗ hiểu sai: lý do nghe hợp lý đứng trước câu phán sai, thành câu riêng. Mỗi chữ "vì", "nên", "mà" trong đoạn đó: vế sau
  có đúng là lý do, kết quả của vế trước không. Tìm mọi con số lấy từ ghi chú (số cửa sổ, số lần thử, số phút) trong đoạn gỡ: số
  đó đứng sau "và" ở câu gỡ thì chuyển vào câu lý do nghe hợp lý hoặc bỏ. Vế nào trong câu gỡ nói lại câu lý do ngay trước (cùng
  ý, đổi chữ) thì bỏ. Đoạn gỡ đứng sau đoạn đọc output đã kết luận: câu nào suy lại kết luận ấy thì bỏ, hoặc dời chỗ hiểu sai
  lên trước đoạn đọc output. Câu lý do nghe hợp lý: che mọi thứ sau nó, người đọc đã biết điều thật chưa; rồi thì bỏ dữ kiện
  lộ ra điều ấy. Kết luận gỡ (lỗi không ở chỗ người đó tưởng): đếm số lần nó được nói trong đoạn gỡ và câu hỏi của bài ngay
  sau; quá một lần thì giữ lần ở câu đưa bằng chứng. Đoạn ngay sau đoạn chỗ hiểu sai: che đoạn chỗ hiểu sai, nó có bám được
  vào câu hở của mục không; không thì mở bằng chữ nối về câu hở.
- Mỗi câu hỏi kiểm tra: che đáp án, đọc riêng câu hỏi; vế nào chỉ có việc để làm khi đã chọn một đáp án thì gộp lại. Câu hỏi gọi
  sẵn từng kết cục ("cái nào…, cái nào…") thì hỏi chung ("mỗi cái ra sao").
- Mỗi câu mở đoạn đọc output: có hẹn số chỗ, vị trí sẽ đọc không; có thì đếm lại với đoạn, lệch thì bỏ câu hẹn. Mỗi đoạn mở
  bằng "X khác Y": câu cuối có nói điều suy ra không, hay chỉ nói lại câu mở.
- Chữ đầu của các đoạn liền nhau: ba đoạn cùng mở một kiểu (cùng tên người, cùng khung câu) thì dời chỗ hay đổi cách mở.
- Mỗi câu hở cuối đoạn: che nó, đọc các câu trước; đã đoán ra đáp án chưa. Tìm "cùng", "vẫn", "lại", "cũng" trong đoạn ấy;
  chữ nào gắn thứ đang hỏng vào vật bị nghi thì bỏ.
- Tìm "tức", "tức là" trong cả bài: quá ba lần thì phần lớn đổi sang câu ghép "nên", "vì", hay để câu sau tự nói điều suy ra;
  "tức" hợp nhất khi neo một con số, một chữ lạ vào thứ quen (`references/storytelling.md`). Đọc thành tiếng câu có hai trợ từ
  chồng nhau ("cần đã", "phải đã", "sẽ đã"): người ta không nói vậy, viết lại ("phải bỏ từ trước", "đã bỏ ở bước 1").
- Đề mục và câu nào gọi câu hỏi bằng vị trí ("đầu bài", "ở trên") thì viết lại bằng nội dung.
- Mỗi câu nhắc một vật bằng chữ chung ("một lệnh", "một công cụ", "một cách"): câu đó hay câu sau có gọi tên nó không; không thì
  gọi tên hay bỏ câu. Tìm "bài bỏ": quá một lần thì giữ một, ở chỗ khối output bị tách.
- Câu đầu mỗi mục, kể cả mục thực hành: có "Phần này", "Mục này", "Tiếp theo" không; có thì mở lại bằng việc người học sắp làm
  hay chỗ phần trước còn để ngỏ. Câu kể vụ ở phần mở: có cụm hệ điều hành, phiên bản chen giữa không; có thì tách thành câu ghi
  nơi chạy.
- Mỗi câu, không chỉ câu cuối đoạn: nói lại một câu đã có ở trên (đổi chữ cũng tính, câu giữa đoạn cũng tính) thì bỏ, nối câu
  sau thẳng vào câu đứng trước nó. Xem kỹ vế sau dấu phẩy của câu cuối đoạn trả lời một câu hỏi. Câu nói về bài ("Bài đi lần
  lượt…") thì bỏ. Chữ "đúng", "chính" chỉ để nhấn thì bỏ: tìm "chính", "đúng", "thật" trong cả bài, bỏ chữ đó đi mà câu không
  đổi nghĩa thì bỏ. Kết luận của một đoạn đọc output: tìm câu nói lại nó ở đoạn ngay sau và ở câu mở mục sau; câu mở mục dựa vào
  kết luận ấy để đi tiếp, không chép lại nó. Đoạn đọc lệnh không in gì: đếm chữ "không in"; mỗi lệnh nói một lần rồi đi thẳng vào
  vì sao không in và suy ra gì. Câu mở đã gộp ("Cả hai lệnh đều không in gì") thì câu sau không nói lại cho từng lệnh. Câu
  hỏi thật của người học đem vào giữa bài: câu dẫn nó có nói về mạch bài không ("Câu X dẫn tới chỗ Y", "Câu hỏi này nối
  sang…"); có thì mở bằng việc ("Hôm đó bạn ấy cũng hỏi:"). Chữ "ấy" nào trỏ vào một chữ chỉ có trong lời trích tiếng Anh thì
  gọi thẳng tên tiếng Việt.
- Liệt kê mọi chữ đã dùng cho mỗi thứ bài đặt tên, kể cả chữ dịch từ output tiếng Anh; thứ nào có hai chữ thì gộp, hay nói hai
  chữ khác nhau ở đâu. Chữ mô tả dùng trước lúc đặt tên ("một con số", "một cái nhãn") cũng tính: sau lúc đặt tên, nó chỉ đi kèm
  tên hay bỏ, không đứng một mình thay tên, kể cả trong đề mục. Kể cả động từ đi với thuật ngữ chính: tìm "dùng", "chạy" đứng
  cạnh thứ bài đã gắn một động từ khác, và "lên", "nằm" đứng cạnh giá trị đó, cả trong bước thực hành và đáp án. Rồi liệt kê
  ngược: mỗi chữ thường bài dùng làm tên (kể cả tên đặt cho phần bỏ qua) chỉ trỏ một thứ. Tìm chữ mô tả đứng một mình sau động
  từ của thuật ngữ ("giữ nhãn", "một nhãn khác", "nhãn ấy" khi bài đã đặt tên "nhánh"), kể cả ở đoạn mở thực hành và câu điều
  kiện về cấu hình có sẵn của người học. Chỗ trượt nhiều nhất qua các lần chấm là đoạn cấu hình và cách xử lý cuối phần giảng:
  thuật ngữ chính là một con số có tên (một mã, một số hiệu) thì "số" đứng một mình ("xin số khác", "hai số khác nhau") là tên
  thứ hai, nhất là khi "số" còn chỉ một mã khác trong bài (số tiến trình, số dòng). Tìm chữ "số" trong mọi câu sau câu đặt tên;
  chỗ nào nó trỏ thuật ngữ chính thì thay bằng tên.
