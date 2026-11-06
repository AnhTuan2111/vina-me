# Bộ nhớ của người dùng

Thư mục này là bộ nhớ dùng chung cho mọi agent (Claude Code, Codex và các agent khác) trên mọi máy của người dùng. Agent
đọc nó ở đầu mỗi phiên, nên điều gì đã ghi ở đây thì người dùng không phải dặn lại. Dựng ngày {{NGAY}} bằng skill vina-me.

@may-nay.md
@user.md
@memory.md
@doi.md

Agent nào không tự nạp được bốn dòng `@` ở trên thì đọc bốn tệp đó trong cùng thư mục này trước khi làm việc:

- `may-nay.md`: lệnh và đường dẫn trên máy đang chạy. Tệp này mỗi máy một bản, không đẩy lên repo.
- `user.md`: người dùng là ai, cách họ muốn được trả lời.
- `memory.md`: cách làm việc người dùng đã dặn hoặc đã khen, áp cho mọi việc.
- `doi.md`: luật chung của đội, do đội quản lý.

## Khi nào ghi

- Người dùng sửa cách làm của agent ("đừng làm thế", "lần sau thì…"): ghi luật đó kèm lý do.
- Người dùng khen hay nhận một cách làm không hiển nhiên ("đúng rồi, cứ thế"): cũng ghi, để lần sau không đổi đi.
- Người dùng kể về mình (vai trò, việc đang làm, người đọc văn bản của họ): ghi vào `user.md`.
- Không ghi thứ chỉ đúng trong một việc hay một dự án; thứ đó để ở tài liệu của dự án.

## Cách ghi

- Sửa chứ đừng nối thêm. Ý mới trùng ý cũ thì gộp, ý cũ đã sai thì xoá.
- Mỗi luật một gạch đầu dòng: luật, rồi lý do. Lời người dùng thì trích nguyên văn trong ngoặc kép, kèm ngày (dd/MM/yyyy).
- Giữ `user.md` cộng `memory.md` dưới khoảng 200 dòng, vì cả hai được nạp vào đầu mọi phiên.
- Không ghi mật khẩu, token, khoá API, thông tin khách hàng, chuyện riêng người dùng kể.
- Không sửa `doi.md`. Thấy luật của đội cần đổi thì nói với người dùng.
- Ghi xong thì báo người dùng một dòng: đã ghi gì, vào tệp nào.

## Học từ phiên cũ

Thư mục này có tệp `.can-hoc-phien` nghĩa là người dùng đã đồng ý cho agent học từ các phiên Claude Code, Codex cũ trên máy
mà việc đó chưa làm. Đầu phiên, hỏi người dùng có muốn làm ngay không; đồng ý thì làm theo mục "Học từ phiên cũ" trong
`references/bo-nho.md` của skill vina-me (đường dẫn ở `may-nay.md`), xong thì xoá tệp `.can-hoc-phien`.

## Mật khẩu và token

Dưới đây `<bi-mat>` là lệnh ghi ở `may-nay.md`.

- Không bảo người dùng dán mật khẩu, token vào chat. Cần thì chạy `<bi-mat> them <tên>`: script mở một cửa sổ riêng
  để người dùng tự gõ, mật khẩu được mã hoá và không đi qua agent.
- Người dùng đã lỡ dán vào chat thì lưu bằng `<bi-mat> them <tên> --tai-khoan <tk> --tu-stdin` (mật khẩu đưa vào
  stdin), rồi nhắc họ: thứ đã dán nằm trong lịch sử phiên, nên đổi mật khẩu nếu nó quan trọng.
- Dùng: `<bi-mat> chay <tên> -- <lệnh>` (lệnh con có biến `<TÊN>_USER`, `<TÊN>_PASS`), hoặc
  `<bi-mat> stdin <tên> -- <lệnh>` cho lệnh đọc mật khẩu từ stdin. Xem có những gì: `ds`.
- Không in, không echo, không ghi mật khẩu ra tệp hay vào câu trả lời. Bộ nhớ chỉ ghi tên bí mật và nó dùng cho việc gì.

## Sau khi sửa bộ nhớ

Sửa xong tệp nào trong thư mục này (trừ `may-nay.md`) thì chạy `<cai-dat> --day "<đã ghi gì, một dòng>"`, trong đó
`<cai-dat>` là lệnh ghi ở `may-nay.md`.

Lệnh này chép bản mới sang Codex nếu máy có Codex, và nếu bộ nhớ nằm trong một repo git thì commit rồi đẩy lên, để máy khác
kéo về. Đẩy lỗi (mất mạng, xung đột với bản sửa ở máy khác) thì báo người dùng nguyên văn lỗi, không tự ép đẩy.

## Viết tiếng Việt

Khi viết hay sửa một đoạn tiếng Việt dài hơn vài câu, dùng skill `vina-me`.
