# Bộ nhớ của người dùng

Thư mục này là bộ nhớ dùng chung cho mọi agent trên máy (Claude Code, Codex và các agent khác). Agent đọc nó ở đầu mỗi
phiên, nên điều gì đã ghi ở đây thì người dùng không phải dặn lại. Dựng ngày {{NGAY}} bằng skill vina-me.

@user.md
@memory.md
@doi.md

Agent nào không tự nạp được ba dòng `@` ở trên thì đọc ba tệp đó trong cùng thư mục này trước khi làm việc:

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
{{DONG_BO}}
## Viết tiếng Việt

Khi viết hay sửa một đoạn tiếng Việt dài hơn vài câu, dùng skill `vina-me`.
