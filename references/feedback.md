# Gửi góp ý về skill thành issue

Người dùng chê một câu agent viết thì phần lớn là chuyện của bài đó: sửa xong là hết. Nhưng có lúc cái sai nằm ở chính
skill, ví dụ quy tắc khuyên một kiểu câu mà người dùng thấy gượng, một loại văn bản skill chưa nói tới, `lint.mjs` báo
nhầm, script cài lỗi. Những chỗ đó tác giả skill cần biết để sửa cho mọi người dùng, nên agent hỏi người dùng có muốn
gửi góp ý thành issue trên repo `github.com/AnhTuan2111/vina-me` không.

## Sổ góp ý trong lúc làm

Người dùng hiếm khi nói "skill sai". Họ nói "bảng này sai dòng 1.9", "bỏ đoạn này đi", agent sửa xong là thôi, trong khi lỗi gốc
có khi nằm ở chính skill: một quy tắc dẫn agent viết sai, một script báo nhầm hay chạy lỗi, một bước hướng dẫn thiếu. Nên agent
không đợi người dùng chê mới để ý. Trong lúc làm, mỗi khi gặp một chỗ như thế, agent ghi ngay một dòng vào sổ góp ý trên máy,
không cần hỏi:

- sổ ở `~/agent-memory/vina-me-feedback.md` khi máy có bộ nhớ dùng chung, không thì ở `~/.config/vina-me/feedback.md`;
- mỗi dòng gồm ngày, tệp của skill (`references/...`, `scripts/...`), chuyện gì xảy ra, và agent đã làm cách khác ra sao;
- chỉ ghi chuyện của skill, viết bằng chữ chung, không chép nội dung tài liệu người dùng, tên khách hàng, con số của dự án.

Một chỗ có thể chỉ do bài này đặc biệt, nhưng ghi lại vẫn hơn: tác giả skill gộp nhiều sổ mới thấy lỗi nào lặp lại.

Làm xong việc chính, sổ có dòng mới của phiên này thì hỏi người dùng một lần, ở một dòng cuối lời trả, có muốn gửi các dòng ấy
thành góp ý không. Đồng ý thì soạn bản nháp từ các dòng đó theo các bước dưới. Máy không có `gh` mà người dùng cũng không có tài
khoản GitHub thì chỉ đường dẫn của sổ, để họ gửi tệp ấy cho người cài skill cho họ (qua chat, email). Người dùng không muốn gửi
thì sổ vẫn giữ trên máy; lần sau chỉ hỏi về dòng mới.

## Khi nào hỏi

Hỏi khi lời chê hay góp ý nhắm vào cách skill làm việc:

- văn agent viết theo skill vẫn bị chê là máy móc, rời rạc, văn mẫu, và lỗi lặp lại sau khi đã sửa theo quy tắc;
- người dùng nói một quy tắc của skill sai, thừa, hay thiếu một trường hợp;
- script của skill (`setup.mjs`, `lint.mjs`, `learn-from-sessions.mjs`, script xuất Word) báo lỗi hay chạy sai;
- người dùng nói thẳng muốn góp ý cho skill.

Không hỏi khi người dùng chỉ sửa dữ kiện, con số, ý của bài, chê thứ không do skill quyết (mô hình chậm, công cụ khác
lỗi), hay khi họ đã từ chối gửi chuyện đó trong phiên này.

Một tin nhắn hay trộn nhiều lời chê, nên tách từng lời ra xét riêng. Lời nào trúng một quy tắc hay một script thì vào góp
ý. Lời nào do người dùng hiểu nhầm skill, ví dụ tưởng `lint.mjs` báo sai trong khi nó đếm đúng, thì kiểm lại rồi nói thẳng
họ nhầm ở đâu (dòng nào, ký tự nào), và không đưa chuyện đó vào issue, kể cả dưới dạng một đề xuất phụ. Trước khi nói script
lỗi, chạy thử nó trên một tệp nhỏ hoặc đọc đoạn code bắt lỗi ấy; chưa kiểm thì chỉ được ghi là đoán.

Trong lời trả lời, các lời chê không do skill gom vào một đoạn, mở bằng một câu nói luôn có mấy chỗ và chúng không do skill,
ví dụ "Ba chỗ còn lại không do skill, nên không vào góp ý:", rồi mỗi chỗ một câu: lời chê nào, do đâu, đã làm gì. Câu nào đưa
số đo (thời gian chạy, số dòng, mã ký tự) thì nói trước nó trả lời lời chê nào, kiểu "Chuyện xuất Word lâu: chạy lại script
chỉ mất hai giây, nên ...", để người đọc che câu trước đi vẫn biết vì sao có con số đó.

## Các bước

1. Làm xong việc người dùng đang cần trước, góp ý để sau. Lời trả lời cũng theo thứ tự đó: kết quả việc chính trước, phần
   góp ý sau. Việc chính là sửa một tệp thì báo theo bảng "Trả kết quả" của `SKILL.md`: tệp mới ở đâu, rồi số chỗ đã sửa theo
   từng loại, loại nào cũng kèm con số, ví dụ "5 đoạn mở bằng câu hỏi, 4 chỗ xưng hô, 2 số tiền sai, 1 câu không có trong dữ
   kiện đã bỏ". Kể loại mà không đếm thì người dùng không biết bản cũ sai tới đâu. Lời chê trúng một script mà bản sửa vẫn
   dính, vì chữ bị bắt phải giữ (tên riêng, chữ viết tắt khách đặt), thì nói luôn ở phần này: chạy script lên bản mới vẫn ra
   dòng đó, giữ vì sao, và chỗ báo nhầm ấy đã vào bản nháp góp ý; không nói thì người dùng chạy lại thấy lỗi cũ, tưởng chưa sửa.
   Đối chiếu bản cũ với dữ kiện gốc thì chỉ bỏ lời tả việc mà dữ kiện không có (cách làm cũ của người nhận, vị trí trên màn,
   lời hứa). Tên riêng có sẵn trong bản cũ mà người dùng không chê (tên hệ thống, tên đơn vị, tên phân hệ) thì giữ, kể cả khi
   tin nhắn đưa dữ kiện không nhắc tới, và không đếm nó vào số chi tiết bịa. Chưa chắc cái tên ấy có thật thì vẫn giữ nó rồi
   hỏi trong lời trả lời; bỏ trước hỏi sau thì người dùng gửi ngay sẽ gửi đi một văn bản không nói là của hệ thống nào.
   Lời chê nằm ở chỗ skill chưa có loại văn bản ấy thì bản sửa không dựa được vào skill, nên tự hỏi người nhận mở văn bản ra
   cần biết gì trước, rồi đặt điều đó vào câu đầu: thư mời họp thì họp gì, lúc nào, ở đâu; thông báo đổi giá thì giá mới áp
   từ ngày nào. Việc phía người viết làm (cài đặt, tạm dừng, chuẩn bị) và lý do của nó đi sau. Bản sửa vẫn theo mọi luật khác
   của skill, đọc lại từng câu như bất kỳ bản sửa nào. Văn bản gửi người nhận kiểu này hay dính hai mẫu dịch sát, nên soát
   riêng:
   - Đuôi "với N thay đổi (nêu) dưới đây" treo sau câu đầu: tách thành câu riêng. "Từ ngày 01/12, cửa hàng áp dụng bảng giá
     mới với ba thay đổi nêu dưới đây." viết thành "Từ ngày 01/12, cửa hàng áp dụng bảng giá mới. Bảng giá này có ba thay
     đổi:".
   - Câu bị động không nói ai làm ("X được chọn", "được đặt", "được cài", "được dời"): cho vật chịu việc làm chủ ngữ và bỏ
     "được", hoặc nói ai làm. "Cuộc họp được dời sang 14h vì phòng bận." viết thành "Cuộc họp dời sang 14h vì phòng
     bận."; "Mức giảm này được đặt theo đề nghị của hội khách hàng." viết thành "Mức giảm này theo đề nghị của hội khách hàng.".
   Viết xong, tìm chữ "được" và "với" trong bản sửa rồi xét từng chỗ theo hai mẫu trên, vì đọc lướt cả bài thì mắt bỏ qua
   chúng.
2. Người dùng chưa nhắc tới góp ý thì hỏi một câu, nói rõ repo công khai: "Chỗ này có vẻ do quy tắc của skill. Mình gửi
   góp ý lên repo vina-me để tác giả sửa nhé? Issue ở repo công khai nên ai cũng đọc được, mình sẽ cho bạn xem bản nháp
   trước." Không đồng ý thì thôi.
   Người dùng đã tự nhờ soạn bản nháp góp ý (kể cả khi dặn "chưa gửi") thì không hỏi lại, soạn luôn.
3. Viết bản nháp, mỗi chỗ sai một bản: một quy tắc và một script là hai issue, hai script lỗi cũng là hai issue, vì tác giả
   sửa và đóng từng cái riêng. Hai lời chê cùng do một chỗ thiếu của skill, sửa một chỗ là hết cả hai (ví dụ skill chưa có
   loại văn bản ấy nên vừa sai giọng vừa sai xưng hô), thì vẫn là một chỗ sai, một bản. Bản nháp chỉ nói chỗ người dùng chê;
   thứ khác agent tự thấy mà người dùng không chê thì không nhét thêm vào. Tiêu đề là một câu nói chỗ sai, ví dụ "Quy tắc hỏi
   rồi đáp bị áp cho cả thư gửi sếp". Loại văn bản bị chê thì gọi bằng một tên suốt bản nháp: lấy tên người dùng gọi, lần đầu
   có thể kèm một tên giải nghĩa trong ngoặc, từ đó về sau chỉ dùng tên ấy, không đổi qua "thông báo gửi khách", "văn bản
   phát hành" cho đỡ lặp. Thân có bốn mục, giữ nguyên bốn tên này:
   - **Người dùng nói gì**: lời phàn nàn, trích nguyên văn trong ngoặc kép, giữ cả chữ viết thường, chữ số, lối gõ tắt của
     người dùng; chỉ thay những thứ bước 4 bảo thay.
   - **Skill đã làm gì**: loại văn bản đang viết, đoạn bị chê (tối đa mười dòng); lỗi của script thì chép dòng output. Câu
     tả cả bản cũ ("đoạn nào cũng ...", "mọi đoạn ...") thì đếm lại trên bản cũ; số script báo là số chỗ bị bắt, không phải
     tổng số đoạn, nên bản cũ có đoạn không bị bắt thì viết "N đoạn liền nhau ..." chứ không viết "đoạn nào cũng".
   - **Lẽ ra thế nào**: theo lời người dùng; quy tắc nào của skill dính vào (tên tệp, tên mục). Dẫn một quy tắc thì chép
     nguyên cả câu hay cả ô bảng trong ngoặc kép, kèm số dòng; không tóm, không cắt bớt danh sách trong ô. Chữ hay rơi khi
     cắt là chữ giới hạn phạm vi (ô "Dùng cho" ghi ba loại mà chỉ chép hai), mà lập luận của bản nháp thường dựa vào phạm
     vi ấy; tác giả mở tệp thấy ô dài hơn lời dẫn sẽ không tin phần còn lại. Trước khi đề xuất thêm một chữ vào quy tắc,
     đọc lại cả câu, cả ô xem chữ ấy đã có chưa; có rồi thì đề xuất đưa nó lên chỗ agent đã đọc nhầm. Chỗ đã kiểm thì nói
     kiểm bằng gì (đã chạy thử, đã đọc đoạn code nào); đoán thì ghi là đoán, cách sửa tự nghĩ ra thì ghi là đề xuất. Đề
     xuất sửa script mà kèm ví dụ "sửa xong thì chữ này qua, chữ kia vẫn bị bắt" thì ví dụ phải đi qua chính script: chép script ra
     thư mục tạm, sửa bản chép, chạy nó trên tệp thử, rồi mới ghi kết quả. Thử riêng một biểu thức bằng `node -e` thì bỏ qua
     các bước lọc khác của script (độ dài tối thiểu, vùng được dò, khối code bị bỏ qua), nên một chữ quá ngắn mà script
     không bao giờ bắt sẽ hiện ra như "vẫn bị báo". Soát từng ví dụ có lọt các điều kiện đó không; không chạy qua script được
     thì ghi rõ chỉ mới thử riêng đoạn nào. Câu khái quát chưa đếm (kiểu "chữ viết tắt thường chỉ có ...") thì ghi là đoán
     hoặc bỏ. Lời chê về một loại văn bản skill chưa nói tới thì ngoài quy tắc đã bị áp nhầm, nêu cả hai chỗ loại ấy lẽ ra
     phải có: bảng loại văn bản ở `references/document-types.md` (bước 1 của "Cách viết" trong `SKILL.md` dựa vào tệp này để
     chọn loại) và bảng "Giọng" của `SKILL.md`. Nói đã tìm tên loại ấy ở hai chỗ đó mà không thấy, rồi viết đề xuất cho từng
     tệp; chỉ đề xuất sửa quy tắc bị áp nhầm thì tác giả vá được một câu mà loại văn bản ấy vẫn không có chỗ.
   - **Cách lặp lại**: với quy tắc, yêu cầu kiểu gì thì ra lỗi, chê lại thế nào mà lỗi vẫn còn. Với script, nội dung tệp
     thử, lệnh, output đã chạy thật, kèm một trường hợp đối chứng không bị lỗi để tác giả thấy ranh giới.
4. Trong mọi đoạn trích, cả lời người dùng lẫn đoạn văn bị chê, thay tên người, tên cơ quan, tên khách hàng, số điện thoại,
   email, địa chỉ, đường dẫn máy có tên người bằng chữ chung ("[tên công ty]", "[tên người]", "[số điện thoại]"). Trong đoạn
   văn bị chê, thay cả ngày, giờ, số tiền, số phiên bản và số liệu khác của dự án ("[ngày]", "[giờ]", "[phiên bản]", "[số
   phút]"); số phiên bản của skill thì giữ. Soát lại từng con số còn sót, vì che tên mà để nguyên ngày giờ thì người quen dự
   án vẫn nhận ra. Lệnh và output ở mục Cách lặp lại thì giữ. Tên tính năng, tên phân hệ, chữ viết tắt mà lỗi xoay quanh
   thì giữ nguyên, kể cả trong lời trích, vì tác giả phải có chữ đó mới lặp lại được lỗi; chỉ thay khi cái tên ấy lộ ra
   khách là ai. Văn bản mật hay nội bộ thì không trích, chỉ tả kiểu câu
   bị lỗi bằng một câu tự đặt.
5. Trước khi đưa, chạy thử từng bản nháp với `--dry-run` (cách chạy ở bước 6) để soát chỗ còn sót. Rồi đưa nguyên văn từng
   bản nháp, cả tiêu đề lẫn thân, ngay trong lời trả lời; ghi thêm ra tệp thì được, nhưng chỉ đưa đường dẫn hay tóm tắt thì
   người dùng phải mở tệp mới duyệt được. Sau các bản nháp, nói một hai câu gồm: repo công khai nên đã che những gì, chưa gửi
   gì, đồng ý thì gửi bằng `scripts/feedback.mjs`. Ví dụ: "Issue nằm ở repo công khai nên trong cả hai bản mình đã thay tên
   khách, tên người và số liệu dự án bằng chữ chung. Mình chưa gửi gì; bạn đọc xong đồng ý thì mình gửi bằng
   `scripts/feedback.mjs`." Sửa theo ý họ. Có câu đồng ý mới gửi.
   Lúc soát bằng `--dry-run`, đọc lại từng câu của bản nháp và cả lời trả lời theo luật như mọi văn bản khác. Văn góp ý
   hay dính chữ "đúng", "chính" để nhấn, kiểu "chạy lại vẫn ra đúng dòng này", "lỗi xoay quanh đúng chữ đó", "agent viện
   chính quy tắc ấy": bỏ chữ ấy đi câu vẫn đủ nghĩa, nên bỏ. Chỉ giữ "đúng" khi nó nghĩa là không sai, như "lint đếm đúng".
   Ngay sau một danh sách, gọi lại các mục bằng tên ("điều 1 và bảng "Giọng""), không gọi "hai chỗ ấy", "những chỗ trên",
   nhất là khi danh sách có nhiều mục hơn số mình định nói. Thuật lại yêu cầu của người dùng thì giữ chữ chỉ ý muốn của họ
   ("nên", "phải", "cần"): "theo người dùng, thông báo nên viết như ..."; bỏ chữ ấy thì câu đọc thành tả việc đã xảy ra.
   Lời chê không do skill mà chưa kiểm được lý do (chạy chậm, mạng chậm) thì nói là đoán, không nói chắc nó do đâu.
6. Ghi thân bài ra một tệp tạm, rồi chạy từ thư mục skill:

   ```
   node scripts/feedback.mjs --title "<tiêu đề>" --body-file <tệp> --agent "<Claude Code hoặc Codex>"
   ```

   Script che mật khẩu, token trông thấy được, thêm "Góp ý: " vào đầu tiêu đề và một dòng phiên bản skill ở cuối.
7. Đưa người dùng link script in ra. Máy có `gh` đã đăng nhập thì đó là link issue vừa tạo. Chưa có thì đó là link
   trang tạo issue đã điền sẵn: người dùng mở, đăng nhập GitHub, xem lại rồi bấm "Submit new issue". Người dùng không
   có tài khoản GitHub thì họ gửi link đó cho người có tài khoản, hoặc báo thẳng cho tác giả.
   Link có giới hạn độ dài, mà chữ có dấu khi vào link dài lên sáu tới chín lần, nên bản nháp tiếng Việt quá khoảng 2.000 ký
   tự là có thể bị cắt đuôi. Khi đó script in dòng "Link chỉ mang được ..." kèm mục bị cắt giữa chừng và các mục bị mất; chép
   lại dòng ấy cho người dùng và chỉ tệp nháp để họ dán nốt phần còn lại vào ô nội dung trước khi bấm gửi. Thấy dòng này
   ngay ở lần chạy thử thì nói luôn trong câu kết của bước 5.

Muốn xem trước thứ sẽ gửi thì thêm `--dry-run`: script in tiêu đề, nội dung đã che và link, không gửi gì. Script còn
liệt kê những dòng ngoài khối code có vẻ là dữ liệu dự án (ngày, giờ, số điện thoại, email, đường dẫn có tên người), kèm số
dòng. Xem từng dòng: là dữ liệu của dự án thì thay bằng chữ chung, là chữ của skill hay của lệnh thử thì để nguyên.

## Không gửi

Việc làm có tài liệu nội bộ (hồ sơ dự thầu, tài liệu khách hàng) vẫn ghi sổ và gửi góp ý được: góp ý nói skill sai ở đâu, không
cần nội dung tài liệu. Chỉ những thứ dưới đây là không bao giờ vào sổ hay vào issue.

Mật khẩu, token, khoá; nội dung tài liệu nội bộ; tên khách hàng, dữ liệu cá nhân; đường dẫn máy có tên người. Script chỉ
che được bí mật có hình dạng quen (token GitHub, chuỗi khoá dài, "mật khẩu: ..."), không nhận ra một đoạn văn mật. Giữ
những thứ đó ra khỏi bản nháp là việc của agent ở bước 4.
