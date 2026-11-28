# Sơ đồ, trang trình chiếu, tài liệu kỹ thuật

Tệp này gom cách viết chữ cho những thứ không phải văn xuôi: sơ đồ luồng, sơ đồ triển khai, trang trình chiếu, tài liệu
cấu hình gửi khách, báo cáo trạng thái hệ thống. Ở những chỗ này chữ ít, nên chữ nào cũng phải có việc của nó.

## Sơ đồ

### Câu hỏi và nhãn

Sơ đồ vẽ ra để trả lời một câu hỏi, như "yêu cầu đi qua những máy nào", hay "từ lúc đẩy code tới lúc chạy có mấy bước".
Câu hỏi đó chốt trước khi vẽ, và đặt làm tiêu đề hay câu đầu của chú thích.

Mỗi khối chỉ ghi tên. Cấu hình, phiên bản, mô tả dài để trong tài liệu đi kèm hay trong bảng dưới sơ đồ, và dòng phụ dưới
tên khối là thứ đầu tiên nên bỏ khi sơ đồ rối. Khối người dùng, dải mạng cũng vậy: ghi "Users", "Admins", không ghi "Users
(LAN, VPN)", "Admins (10.0.5.0/24)"; dải IP, loại mạng để trong bảng cổng.

Nhãn dùng một ngôn ngữ suốt sơ đồ. Sơ đồ triển khai, sơ đồ luồng mạng để nhãn bằng tên gốc tiếng Anh của phần mềm, máy,
giao thức, vì đó là chữ sẽ gặp trên màn hình thật. Sơ đồ quy trình công việc cho người không làm kỹ thuật thì để nhãn tiếng
Việt ("gửi hồ sơ", "duyệt", không "submit request", "approve"), nhưng tên phần mềm, tên máy vẫn giữ như gốc ("Keycloak").
Tiêu đề và chú thích thì tiếng Việt.

Một thứ một tên trên mọi nhãn, và tên ấy khớp với tài liệu đi kèm. Một luồng đã gọi "sync" ở nhãn này thì nhãn khác không gọi
"replicate"; cùng một việc mà hiện trên hai mũi tên thì hai nhãn dùng cùng chữ. Động từ trên nhãn dùng lại tên mà tài liệu đã
gọi luồng đó. Tài liệu viết "LDAP sync" thì nhãn là "sync users (LDAPS 636)", không đặt động từ mới như "pull accounts" chỉ
để nói chiều, vì chiều đã có mũi tên và chú giải lo. Muốn soát thì đặt từng nhãn cạnh cột Mục đích của bảng cổng và câu thân
bài nói về luồng đó: ba chỗ phải gọi cùng một tên.

### Mũi tên

Mũi tên đi theo đường thật, trỏ thẳng vào thứ nhận, không trỏ vào một đường chung chung. Luồng hai chiều dùng mũi tên hai
đầu. Mũi tên không cắt nhau; cắt thì sắp lại vị trí các khối trước khi nghĩ tới đường vòng.

Một mũi tên có một thứ nhận. Một khối gửi tới năm máy thì vẽ năm mũi tên, xếp khối gửi ở một cạnh và các máy nhận thành một
hàng để mũi tên toả ra không cắt nhau. Đừng gom các máy vào một khung bao chỉ để trỏ một mũi tên rồi ghi trong nhãn máy nào
nhận gì. Khung bao chỉ dùng khi nó là một thứ thật, như một mạng hay một cluster.

Sơ đồ triển khai đi kèm bảng cổng thì chiều mũi tên là chiều mở kết nối, khớp cột Từ, Đến của bảng, và chú giải nói điều
đó. Chiều mở kết nối có thể ngược chiều dữ liệu chạy: máy giám sát mở kết nối để kéo số đo về, máy dự phòng mở kết nối để
kéo dữ liệu từ máy chính. Chiều do mũi tên và chú giải nói, còn nhãn vẫn giữ tên mà tài liệu gọi luồng đó, không đổi động từ
thành "pull", "fetch" chỉ để nói chiều.

Mỗi mũi tên mang một nghĩa. Có nhiều loại luồng thì phân bằng màu hay nét, có chú giải, và nhãn trên mũi tên nói việc gì xảy
ra ("đọc để so", "sửa cho khớp"); tên giao thức, cổng hay tên phần mềm đứng một mình thì chưa đủ. Cổng, giao thức để sau động
từ, trong ngoặc: "HTTPS 443" thành "open web app (HTTPS 443)", "Keycloak :8443" thành "log in (8443)". Một nhãn một việc;
luồng phụ (cổng 80 chỉ để chuyển sang 443) thì vẽ một mũi tên riêng hay để trong bảng, không nhồi vào ngoặc của nhãn chính.

### Dữ kiện và hình trên sơ đồ

Nhãn mang dữ kiện như tài liệu: cổng, giao thức, giờ chạy mà nguồn không ghi thì không đưa lên nhãn. Chỗ còn phải kiểm tra
thì ghi rõ trên nhãn bằng ngôn ngữ của nhãn ("forward requests (port TBD)") và báo người dùng. Chữ trong bài nhắc tới thứ
gì thì sơ đồ phải có thứ đó: bài nói "so tệp YAML với bản trên cluster" thì sơ đồ có cả hai phía của phép so.

Ô nào là một phần mềm thật thì dùng logo chính thức hay ảnh chụp giao diện thật, không dùng biểu tượng chung chung cho có
hình; ảnh lấy của người khác thì ghi nguồn. Biểu tượng phải hợp với loại thứ được vẽ, nên kho đối tượng (S3) không vẽ bằng
biểu tượng thư mục.

Sơ đồ là một quy trình đọc một lần từ đầu tới cuối thì đánh số các bước. Sơ đồ cấu trúc thì gọi bằng tên, không bắt người
đọc nhớ số.

Vẽ xong thì xuất ra ảnh và xem tận mắt: chữ có đè nhau không, mũi tên có bị khung che không, cỡ chữ có đọc được ở khổ trang
sẽ in hay chiếu không.

### Đưa chữ sơ đồ cho người tự vẽ

Người dùng tự vẽ (draw.io, Visio) và chỉ xin chữ thì đưa ba thứ dưới đây, ngoài ba thứ đó không bàn thêm cách vẽ:

- Danh sách khối, mỗi khối một tên, cùng tên dùng trên nhãn và trong tài liệu.
- Bảng mũi tên, mỗi hàng một mũi tên với các cột Từ, Đến, Nhãn, Nét. Cột Đến chỉ có một thứ nhận; hai máy nhận là hai hàng.
  Nhãn đã soát theo các luật ở trên.
- Chú giải: mỗi loại nét là loại luồng nào, chiều mũi tên là chiều gì.

Tài liệu Word chừa chỗ cho hình thì để một khung trống bằng cỡ hình sẽ dán, và chú thích ngay dưới khung theo dạng "Hình
1. <câu nói sơ đồ cho thấy gì>", ví dụ "Hình 1. Đường đi của một lượt đăng nhập từ browser qua Keycloak tới ứng dụng". Chỉ
ghi "Sơ đồ triển khai" thì chưa đủ. Khung và chú thích nằm cùng trang.

## Trang trình chiếu

Mỗi trang trình chiếu nói một ý. Phần lớn diện tích là sơ đồ hay hình; chữ chỉ là nhãn và một câu chốt. Người cần tài liệu
"để thuyết trình" thì nhận luồng, không nhận đoạn văn; phần giải thích dài đưa vào tài liệu riêng.

Trang sau nối trang trước: tiêu đề trang sau bắt đầu từ thứ trang trước vừa dừng lại. Phụ đề, nhãn trang trí, lời dẫn kiểu
"Sau đây là…" thì bỏ. Trang rối thì bớt chữ trước, rồi mới bớt hình.

## Tài liệu kỹ thuật gửi khách

### Mẫu và trình bày

Bên nhận có mẫu thì theo mẫu: cùng mục, cùng thứ tự, cùng cách đánh số, cùng cột bảng, không tự thêm mục, không đổi tên mục.

Mẫu có quy định trình bày (phông, cỡ, lề, số trang, cách viết tên tài liệu) thì quy định của mẫu thắng mọi mặc định của
skill, kể cả Arial 11, lề 2 cm của `docx-export.md` và `scripts/report-docx.mjs`. Script không đặt được thì tự dựng, hoặc
sửa tệp sau khi dựng, rồi soát trên ảnh trang PDF. Ba thứ phải đạt: không còn phông nào ngoài phông mẫu (`pdffonts`), đề
mục không nằm cuối trang, và không tên định danh nào gãy dòng giữa ô.

Tên định danh là mọi chuỗi người đọc sẽ gõ lại hay tìm trên máy: tên máy, tên container, tên dịch vụ, IP, phiên bản, đường
dẫn, domain, kể cả khi nó nằm trong ngoặc sau một chữ khác ("Ứng dụng (container shop-api)"). Word ngắt dòng ở dấu gạch
nối, nên tên có "-" hay gãy nhất. Cách chữa là nới cột đó, bớt cột đang thừa chỗ (cột phiên bản ngắn), hoặc thay "-" trong
tên bằng gạch nối không ngắt của Word (`NoBreakHyphen` của thư viện `docx`). Hàm `unbroken` trong
`scripts/official-doc-docx.mjs` làm việc này cho gạch nối giữa hai chữ số; tên có chữ thì bỏ điều kiện chữ số. Soát từng ô
trên ảnh trang, không dò theo danh sách loại tên.

Mẫu không quy định thì thân bài, bảng, chú thích dùng một phông, một cỡ. Khối cấu hình dùng một phông chữ đều, cỡ nhỏ hơn.
Đề mục thống nhất từng cấp.

### Nội dung

Tài liệu mô tả cấu hình môi trường chỉ nói về hệ thống sẽ triển khai: từng máy, cấu hình, hệ điều hành, phần mềm và phiên
bản, cổng, tệp cấu hình, sao lưu, giám sát, xử lý khi máy hỏng. Nhánh code, commit, tình trạng code hiện tại, kết quả thử
nội bộ, tên người của bên mình thì không nhắc; những thứ đó để báo cáo nội bộ riêng.

Hiện trạng lệch thiết kế, như máy đang thiếu RAM, ổ đĩa chưa nâng, phần mềm chưa cài xong, cũng là chuyện nội bộ. Bảng ghi
số của thiết kế, và không câu nào ghi số hay tình trạng hiện tại, kể cả ở mục cuối. Việc bên nhận cần làm cho đạt thiết kế
thì ghi ở mục cuối bằng số đích: "Bên A nâng ổ đĩa máy X lên 500 GB trước ngày …", không thêm "hiện đang có 300 GB".

Thiết kế viết như một sự thật đã chốt ("Keycloak chạy trên hai máy…"), không viết dạng đề xuất ("có thể dùng…"). Chỗ còn
chờ khách quyết thì gom vào một mục riêng ở cuối. Bảng thiết kế (máy, phần mềm, cổng) cũng chỉ có thứ đã chốt, không có ô
"chờ Bên A cấp", "chưa có". Thứ còn chờ khách (máy chủ thư, nơi lưu tệp) chỉ nằm ở mục cuối; thân bài cần nhắc thì trỏ sang
bằng một câu.

Mục xử lý sự cố đánh số các bước, và bước chỉ ghi việc người làm. Việc máy tự làm sau đó (container tự chạy khi máy lên)
viết nối vào bước vừa làm trong cùng một câu, không thành bước riêng.

Bên nhận đã sửa tay trong tài liệu thì không dán đè cả tài liệu: tải bản hiện tại về so trước, rồi chỉ sửa chỗ cần. Không có
bản đó, chỉ có email tóm tắt chỗ sửa, thì dựng theo email cộng nguồn, rồi trong chat xin người dùng bản bên nhận trả về để so
trước khi gửi.

### Soát câu văn trong tài liệu gửi khách

Mục sao lưu, giám sát, xử lý sự cố là văn xuôi ngắn đặt giữa các bảng, nên lỗi câu ở đây dễ lọt: người viết chỉ soát dữ
kiện. Xuất chữ ra tệp `.md`, chạy `node scripts/lint.mjs` trên tệp đó, rồi đọc từng câu của các mục văn xuôi theo ba điểm
dưới đây, vì lint không bắt được cả ba.

- Một mục nói về nhiều thứ cùng loại việc (sao lưu cơ sở dữ liệu và sao lưu máy, giám sát máy và giám sát ứng dụng) thì mỗi
  thứ một đoạn. Câu đầu đoạn sau gọi tên thứ mới và nói nó khác thứ trước ra sao: "Riêng máy cache01 không có bản sao lưu
  dữ liệu; Bên A chụp snapshot máy này hằng tuần." Câu về thứ mới không đứng cuối đoạn của thứ cũ, vì người đọc đang theo
  thứ cũ không được báo là đã đổi.
- Chủ ngữ phải làm được việc của động từ. Bản sao lưu, snapshot, tệp log, báo cáo là kết quả, nên chúng không "chạy"; thứ
  chạy là việc, lệnh, tác vụ. "Bản snapshot chạy lúc 02:00 trên máy chủ ảo hoá" thành "Việc chụp snapshot chạy lúc 02:00
  trên máy chủ ảo hoá", "Báo cáo chạy mỗi sáng" thành "Tác vụ xuất báo cáo chạy mỗi sáng". Đọc riêng cặp chủ ngữ, động từ
  của từng câu là thấy.
- Chữ nhấn mà nguồn không có thì không thêm: "đúng", "chính", "hoàn toàn", "luôn" đứng trước thời điểm, số lượng, danh từ.
  "Khôi phục dữ liệu về đúng lúc trước sự cố" thành "về lúc trước sự cố", "mở đúng các cổng sau" thành "mở các cổng sau".
  Bỏ chữ đó mà câu không mất nghĩa thì nó thừa.

### Dữ kiện trong tài liệu gửi khách

Tài liệu này đi thẳng tới khách, nên một ô đoán sai là một lời hứa sai. Mỗi ô dữ kiện phải có trong nguồn người dùng đưa
(ghi chú, email, tệp cấu hình).

Cổng, giao thức, phiên bản, hệ điều hành, người thực hiện, hạn mà nguồn không ghi thì không suy ra, kể cả từ kiến thức chung
("đường dẫn `\\máy\thư mục` thì là SMB 445") hay từ việc máy thuộc bên nào. Ô đó ghi "cần bổ sung" và tô vàng. Đừng điền
bản đoán kèm dấu hỏi, vì người dùng quên sửa thì bản đoán tới tay khách.

Ngoại lệ duy nhất là giao thức suy theo phần mềm. Nguồn đã ghi phần mềm nghe ở một cổng, và phần mềm ấy chỉ nói một giao thức
ở cổng đó, thì giao thức ghi được, vì nó theo phần mềm nguồn đã chốt chứ không đoán. Ví dụ là Redis ở 6379 của máy chạy
Redis, HTTP ở cổng số đo của một exporter Prometheus, HTTPS ở 443 khi nguồn ghi Nginx nhận TLS. Mọi cổng trong bảng xử lý
theo cùng một cách: cổng nào thoả điều kiện thì ghi giao thức, cổng nào không (nguồn chỉ có số cổng, hay chỉ có đường dẫn như
`\\máy\thư mục` mà không ghi phần mềm) thì "cần bổ sung" tô vàng. Hai cổng cùng loại nguồn thì không để cổng này ghi, cổng
kia tô vàng.

Mục xử lý sự cố mà mẫu đòi dấu hiệu nhận biết, trong khi nguồn không ghi riêng, thì lấy từ danh sách cảnh báo và ngưỡng
trong nguồn, và xét mọi tình huống theo cùng một cách. Cảnh báo nào trong nguồn sẽ bật khi máy đó hỏng thì ghi cảnh báo
đó; không cảnh báo nào bật thì "cần bổ sung" tô vàng. Ô dấu hiệu chỉ ghi điều người trực thấy được (cảnh báo nào, lỗi gì
trên màn hình); ảnh hưởng tới hệ thống không đặt vào đó.

Mỗi chỗ ghi từ suy luận (giao thức theo phần mềm, dấu hiệu theo danh sách cảnh báo, chiều kết nối đã sửa) có một dòng trong
chat. Kể đủ mọi chỗ, không kể một nửa, vì người dùng chỉ kiểm tra lại những chỗ được báo.

Người thực hiện, bên chịu trách nhiệm thì ghi chữ nguồn dùng ("quản trị viên"). Nguồn không nói ai làm thì để ô "cần bổ
sung", không gán "Bên A", "Bên B" hay tên người. Hai nguồn ghi khác nhau (ghi chú một số, tệp cấu hình một số khác) thì không
tự chọn: ô ghi cả hai kèm "cần kiểm tra", tô vàng. Nguồn mới hơn của khách (email góp ý) thắng ghi chú cũ, và thứ khách đã
chốt thì không còn ở mục chờ. Ghi chú sai kỹ thuật (chiều kết nối ngược, tên phần mềm nhầm) thì ghi theo kỹ thuật và nói
trong chat đã sửa gì, vì sao.

Cột mẫu đòi mà nguồn không cho, như cột hạn khi khách chỉ hẹn "sau ngày X", thì chép nguyên lời nguồn ("sau ngày nghiệm thu
giai đoạn 1"), không đổi thành một ngày. Nguồn không có lời nào thì ghi "cần bổ sung" và tô vàng như ô dữ kiện khác, vì khách
nhận tài liệu có ô trống sẽ hiểu là bên mình quên điền.

Ô tô vàng là việc của bên mình phải làm xong trước khi gửi; chỗ chờ khách mới vào mục cuối. Mỗi ô tô vàng có một dòng trong
chat, và chat có nói thì ô trong tệp vẫn phải tô, vì hai thứ không thay được cho nhau.

### Trả tài liệu gửi khách trong chat

Chat chỉ gồm những thứ người dùng không tự thấy khi mở tệp: đường dẫn tệp; từng ô tô vàng (mục nào, ô nào, vì sao chưa
điền được, ai kiểm tra được); chỗ đã ghi khác nguồn và lý do; mọi chỗ ghi từ suy luận; chữ sơ đồ nếu người dùng xin; đã
kiểm tra gì, chưa kiểm tra gì. Chat không kể lại tệp có những mục nào, đã theo chỗ sửa nào của khách, đã bỏ những thứ nội
bộ nào, vì người dùng mở tệp là thấy.

Dòng ô tô vàng nào cũng đủ bốn thứ kể trên, kể cả "ai kiểm tra được" (người quản trị máy đó, bên khách, người đã viết ghi
chú). Lý do chưa điền được dùng lời nguồn ("ghi chú ghi chưa hỏi lại bản nào"), không thêm điều nguồn không nói, như tên một
bản phần mềm mà nguồn không nhắc. Tên máy, đường dẫn, domain nhắc trong chat đặt trong backtick, chép từ nguồn chứ không gõ
lại, rồi so từng ký tự với tệp Word. Đường dẫn mạng `\\máy\thư mục` mở bằng hai dấu `\`, mất một dấu là thành đường dẫn
khác.

## Báo cáo trạng thái hệ thống

Báo cáo trạng thái trả lời câu "giờ nó đang thế nào", và người đọc dùng nó để quyết định có phải làm gì không. Vì vậy câu đầu
là kết luận: chạy bình thường, hay có chỗ hỏng, hỏng ở đâu. Số đo kèm giờ đo và nguồn: "lúc 19:57, ổ `/` dùng 179G trên
194G (93%)".

Phần còn lại chỉ nêu cái lệch khỏi bình thường, kèm lý do đã biết hay ghi rõ là chưa biết lý do. Thứ chạy bình thường thì gom
một dòng.

Báo cáo dọn dẹp, đề xuất thay đổi thì chia theo mức rủi ro (dọn được ngay, cần hỏi chủ, không nên đụng), mỗi dòng có dung
lượng hay tác động đo được. Báo cáo ghi rõ đã làm gì và chưa làm gì ("chỉ xem, chưa xoá gì"). Đã làm thay người nhận việc
gì thì ghi lệnh hay thao tác, kết quả, và cách quay lại.

## Giải thích một hệ thống cho người mới vào

Người đọc chưa biết dự án thì trước khi vào chi tiết một khối, bài giải thích dự án làm gì, cho ai, gồm những khối lớn nào.
Sau đó mỗi lần một khối: nói cơ chế chính của khối đó (nó làm gì, vì sao cần, luồng chính đi qua nó), chưa đi vào từng dòng
cấu hình. Các dòng thuộc cùng một cơ chế thì giảng trong cùng một lần, theo thứ tự luồng chạy, gọi tên cụ thể (máy nào,
domain nào, dòng nào). Ít hơn không có nghĩa là dễ hiểu hơn.
