# Bộ nhớ của người dùng

Thư mục này là bộ nhớ dùng chung cho mọi agent (Claude Code, Codex và các agent khác) trên mọi máy của người dùng. Agent
đọc nó ở đầu mỗi phiên, nên điều gì đã ghi ở đây thì người dùng không phải dặn lại. Dựng ngày {{DATE}} bằng skill vina-me.

@machine.md
@user.md
@memory.md
@team.md

Agent nào không tự nạp được bốn dòng `@` ở trên thì đọc bốn tệp đó trong cùng thư mục này trước khi làm việc:

- `machine.md`: lệnh và đường dẫn trên máy đang chạy. Tệp này mỗi máy một bản, không đẩy lên repo.
- `user.md`: người dùng là ai, cách họ muốn được trả lời.
- `memory.md`: cách làm việc người dùng đã dặn hoặc đã khen, áp cho mọi việc.
- `team.md`: luật chung của đội, do đội quản lý.

## Khi nào ghi

- Người dùng sửa cách làm của agent ("đừng làm thế", "lần sau thì…"): ghi luật đó kèm lý do.
- Người dùng khen hay nhận một cách làm không hiển nhiên ("đúng rồi, cứ thế"): cũng ghi, để lần sau không đổi đi.
- Người dùng kể về mình: vai trò, việc đang làm, người đọc văn bản của họ.
- Không ghi thứ chỉ đúng trong một việc hay một dự án; thứ đó để ở tài liệu của dự án.

## Ghi vào tệp nào

Agent tự xếp, không hỏi người dùng nên ghi vào đâu. Hỏi một câu: điều này nói về con người, hay nói về cách làm việc?

| Ghi vào | Khi điều đó nói về | Ví dụ |
|---|---|---|
| `user.md` | con người: là ai, vai trò, đang làm gì, viết cho ai, muốn được nói chuyện thế nào (dài ngắn, xưng hô, giọng), điều họ ghét nghe | "tôi là BA", "trả lời ngắn thôi", "đừng giảng lý thuyết dài" |
| `memory.md` | cách làm một việc: quy trình, quy ước, định dạng tài liệu, công cụ, việc phải làm trước khi gửi | "báo cáo gửi sếp câu đầu là kết luận", "tài liệu dùng Times New Roman", "xuất PDF xem từng trang trước khi gửi" |
| `team.md` | luật của cả đội | không tự ghi; thấy cần đổi thì nói với người dùng |
| không ghi | chỉ đúng trong một dự án hay một lần; mật khẩu, token; thông tin khách hàng; chuyện riêng | |

Một ý vừa nói về người vừa nói về cách làm thì tách làm hai, mỗi phần vào đúng tệp của nó. Ví dụ "tôi đọc dài bị mất tập
trung, nên báo cáo chỉ ghi vấn đề và việc cần làm": phần "đọc dài bị mất tập trung" vào `user.md`, phần cách viết báo cáo
vào `memory.md`. Ý nói về người đọc văn bản của người dùng cũng tách như thế: "chị Mai kế toán chỉ đọc trên điện thoại, nên
bảng gửi chị ấy tối đa ba cột" thì thói quen đọc của chị Mai vào dòng "Hay viết văn bản cho" ở `user.md` (chỉ thêm tên chị
Mai thì chưa đủ), viết thành câu riêng sau danh sách chứ đừng nối đuôi bằng dấu phẩy: "Hay viết văn bản cho: khách hàng,
sếp. Chị Mai kế toán chỉ đọc trên điện thoại: "<lời trích>" (ngày)." Luật về bảng vào `memory.md`. Phần về người đã sang
`user.md` thì dòng ở `memory.md` không viết lại nó làm lý do: ghi "Bảng gửi chị Mai tối đa ba cột: "<lời trích>" (ngày)",
không thêm "vì chị Mai chỉ đọc trên điện thoại"; lời trích nguyên văn có nhắc tới chị Mai thì vẫn giữ. Trước khi thêm một
dòng, tìm trong cả hai tệp xem đã có ý đó chưa; có rồi thì sửa dòng cũ.

Cùng một chữ mà khác phạm vi thì là hai luật ở hai tệp: "trả lời trong chat đừng in đậm" vào `user.md`, "slide gửi khách
không in đậm cả câu" vào `memory.md`. Đừng gắn luật về một loại tài liệu làm lý do cho dòng về cách trả lời.

## Cách ghi

- Sửa chứ đừng nối thêm. Ý mới trùng ý cũ thì gộp, ý cũ đã sai thì xoá.
- Mỗi luật một gạch đầu dòng: luật, rồi lý do. Lời người dùng thì trích nguyên văn trong ngoặc kép, kèm ngày (dd/MM/yyyy).
  Viết mỗi gạch đầu dòng liền trên một dòng, vì `<setup> check` chỉ đọc dòng đầu của gạch đầu dòng. Trong tệp gọi người dùng
  bằng tên hay "người dùng", không "bạn": "bạn" ở đây trỏ tới agent đang đọc.
- Ý mới ngược ý cũ thì thay dòng cũ và ghi ngay trong dòng là đã đổi, kèm lời cũ và ngày, ví dụ: Báo cáo tuần gửi bằng Word
  để khách sửa được: "gửi Word nhé, bên kia cần sửa" (03/11/2026); đổi từ "gửi PDF cho gọn" (01/09/2026). Dòng cũ chỉ mang
  ngày dựng bộ nhớ mà lời mới cùng ngày có "từ giờ", "từ nay", "lần sau" thì lời mới là ý sau, không hỏi lại. Sau "đổi từ"
  chỉ trích lời người dùng; dòng cũ do lượt cài dựng thì không đặt trong ngoặc kép như lời họ, và lý lẽ mình dùng để chọn
  lời nào mới hơn không ghi vào dòng.
- Không biết lời trích được nói ngày nào thì hỏi người dùng, hoặc để nguyên và nói là chưa có ngày. Không điền ngày đoán.
- Giữ `user.md` cộng `memory.md` dưới khoảng 200 dòng, vì cả hai được nạp vào đầu mọi phiên.
- Không ghi mật khẩu, token, khoá API, thông tin khách hàng, chuyện riêng người dùng kể.
- Không sửa `team.md`. Thấy luật của đội cần đổi thì nói với người dùng.
- Ghi xong thì báo người dùng một dòng: đã ghi gì, vào tệp nào, ví dụ "Đã sửa dòng báo cáo tuần trong `memory.md` (gửi Word
  thay PDF)." Không chép lại cả dòng bộ nhớ vào câu báo. Rồi chạy `<setup> check` (lệnh ở `machine.md`); nó báo ý gần trùng
  hay quá dài thì gộp lại. Nó báo "lời trích thiếu ngày" ở chữ trong ngoặc kép không phải lời người dùng (tên cột, tên nút)
  thì là báo nhầm: để yên dòng đó và nói với người dùng.

## Lưu lên repo

Chỉ sửa tệp, không tự commit. Lệnh `<setup> sync` (ghi ở `machine.md`) gom mọi thay đổi chưa commit thành một commit rồi
đẩy lên repo. Claude Code chạy nó khi mở và khi đóng phiên, máy chạy nó khi đăng nhập và mỗi 2 giờ, nên thay đổi không mất
dù phiên bị tắt ngang. Người dùng bảo lưu ngay thì chạy `<setup> save "<đã ghi gì, một dòng>"`. Lệnh báo không gộp được
(máy khác đã sửa cùng chỗ) thì chạy `<setup> conflict`, đưa người dùng xem hai bản, hỏi giữ bản nào, rồi chạy
`<setup> resolve mine` hay `<setup> resolve theirs`. Không tự chọn thay người dùng, không ép đẩy.

`<setup>` luôn chạy kèm một lệnh con ghi ở tệp này (`check`, `save`, `sync`, `conflict`, `resolve`). Nó không có `--help`:
chạy trơn hay kèm cờ đoán là cài lại skill, hook và lịch tự lưu lên máy người dùng, kể cả task trong Task Scheduler của
Windows. Cần lệnh khác thì đọc phần chú thích đầu tệp `scripts/setup.mjs`, đừng chạy thử.

## Học từ phiên cũ

Thư mục này có tệp `.pending-learn` nghĩa là người dùng đã đồng ý cho agent học từ các phiên Claude Code, Codex cũ trên máy
mà việc đó chưa làm. Đầu phiên, hỏi người dùng có muốn làm ngay không, nói rõ: đọc lịch sử thì nội dung được gửi lên nhà
cung cấp mô hình, và hỏi dự án nào cần bỏ ra; người dùng đã tự nói hai điều đó thì làm luôn. Đồng ý thì làm theo mục "Học
từ phiên cũ" trong `references/agent-memory.md` của skill vina-me (đường dẫn ở `machine.md`): ý rút từ phiên cũ chỉ là nháp
chờ người dùng duyệt, ghi các ý đã duyệt xong mới xoá tệp `.pending-learn`.

## Mật khẩu và token

Dưới đây `<secrets>` là lệnh ghi ở `machine.md`.

- Không bảo người dùng dán mật khẩu, token vào chat. Cần thì chạy `<secrets> add <tên>`: script mở một cửa sổ riêng
  để người dùng tự gõ; mật khẩu được mã hoá và không lọt vào chat hay lịch sử phiên.
- Người dùng đã lỡ dán vào chat thì lưu bằng `<secrets> add <tên> --account <tk> --from-stdin` (mật khẩu đưa vào
  stdin), rồi nhắc họ: thứ đã dán nằm trong lịch sử phiên và đã gửi lên nhà cung cấp mô hình, nên gọi tên từng mật khẩu,
  token đã dán và khuyên đổi từng thứ còn dùng được; thứ nào không cần đổi thì nói vì sao. Mật khẩu, token bộ lọc đã che lúc
  học từ phiên cũ cũng phải nhắc đổi, vì che chỉ ẩn trong bản rút ra.
- Dùng: `<secrets> run <tên> -- <lệnh>` (lệnh con có biến `<TÊN>_USER`, `<TÊN>_PASS`), hoặc
  `<secrets> stdin <tên> -- <lệnh>` cho lệnh đọc mật khẩu từ stdin. Xem có những gì: `<secrets> list`.
- Không in, không echo, không ghi mật khẩu ra tệp hay vào câu trả lời. Bộ nhớ chỉ ghi tên bí mật và nó dùng cho việc gì.
  Ghi chú công việc, báo lỗi script, góp ý về skill cũng không chép giá trị; cần tả thì viết "mật khẩu ... là <giá trị>".

## Viết tiếng Việt

Mọi câu trả lời trong chat bằng tiếng Việt, dù chỉ vài câu, và mọi đoạn tiếng Việt viết ra hay sửa đều theo skill `vina-me`.
