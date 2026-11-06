# vina-me

Skill giúp AI agent viết và sửa văn tiếng Việt cho thuận mồm, dễ hiểu, không có mùi văn máy. Skill theo chuẩn
[Agent Skills](https://agentskills.io/specification), nên agent nào đọc được chuẩn này cũng cài được.

## Cài một lần cho mọi agent, kèm bộ nhớ

Máy có Node thì cách này gọn nhất:

```bash
git clone https://github.com/AnhTuan2111/vina-me.git
node vina-me/scripts/setup.mjs
```

Script hỏi vài câu (bạn muốn được gọi là gì, làm vai trò gì, hay viết cho ai, muốn agent trả lời dài hay ngắn), câu chọn
thì dùng phím mũi tên (phông của terminal không có ký tự Powerline, hiện ô vuông, thì thêm `--plain`), rồi làm ba việc:

1. Chép skill vào thư mục skill của Claude Code (`~/.claude/skills`) và Codex (`~/.agents/skills`, `~/.codex/skills`), agent
   nào có trên máy thì chép cho agent đó.
2. Dựng bộ nhớ ở `~/agent-memory/`. Agent đọc bộ nhớ này ở đầu mỗi phiên, và tự ghi thêm khi bạn sửa hay khen một cách làm,
   nên điều đã dặn một lần thì không phải dặn lại. Điều nói về bạn vào `user.md`, điều nói về cách làm việc vào `memory.md`;
   agent tự xếp. Dặn Claude Code điều gì thì Codex cũng biết.
3. Nối bộ nhớ vào `~/.claude/CLAUDE.md` và `~/.codex/AGENTS.md`, cài hook và lịch tự lưu. Tệp cấu hình được sao lưu trước
   khi sửa.

Bạn đồng ý lưu lên GitHub thì script tạo một repo riêng tư `agent-memory` trên tài khoản của bạn (cần `gh auth login` trước).
Trong lúc làm việc agent chỉ sửa tệp; các thay đổi được gom thành một commit và đẩy lên khi mở và đóng phiên Claude Code,
khi đăng nhập máy, và mỗi 2 giờ. Cùng lúc đó vina-me tự kéo bản mới nhất về. Cài trên máy thứ hai bằng đúng lệnh trên:
script thấy repo đã có thì kéo về, khỏi hỏi lại.

Đội có bộ luật chung (phông chữ, mẫu văn bản) thì đưa đường dẫn tệp luật khi được hỏi. Bạn đồng ý cho agent học từ các
phiên cũ thì ở phiên đầu tiên, agent đọc lại những gì bạn đã gõ trong các phiên Claude Code, Codex trước đó, soạn nháp bộ
nhớ để bạn duyệt rồi mới ghi.

Agent cần mật khẩu (GitLab, VPN, trang quản trị) thì không dán vào chat: chạy `node scripts/secrets.mjs add <tên>`, gõ vào
cửa sổ hiện ra. Mật khẩu được mã hoá bằng tài khoản Windows của bạn (Keychain trên macOS), agent dùng được mà không thấy
giá trị.

Chi tiết, cách cập nhật và cách gỡ ở `references/agent-memory.md`.

Không muốn có bộ nhớ thì cài theo các mục dưới.

## Claude Code

Muốn dùng skill ở mọi dự án thì clone repo vào thư mục skill của tài khoản:

```bash
git clone https://github.com/AnhTuan2111/vina-me.git ~/.claude/skills/vina-me
```

Còn nếu chỉ muốn dùng trong một dự án thì đứng ở thư mục gốc của dự án đó rồi clone vào `.claude/skills/`:

```bash
git clone https://github.com/AnhTuan2111/vina-me.git .claude/skills/vina-me
```

Cài xong thì mở một phiên Claude Code mới. Gõ `/vina-me` để gọi skill, hoặc cứ nhờ viết và sửa văn tiếng Việt như
thường, Claude sẽ tự dùng skill khi yêu cầu khớp phần mô tả.

Cập nhật bản mới bằng `git pull` trong thư mục vừa clone.

## Claude trên web và ứng dụng desktop

1. Tải repo về dưới dạng zip (nút Code, rồi Download ZIP).
2. Đổi tên thư mục bên trong zip thành `vina-me` nếu nó đang là `vina-me-main`, rồi nén lại.
3. Vào phần cài đặt, tìm mục Skills và tải tệp zip lên.

Tên mục và chỗ đặt nút có thể khác nhau giữa các phiên bản, nên nếu không thấy thì xem tài liệu về skill của Claude.

## Agent khác có hỗ trợ Agent Skills

Chép cả thư mục `vina-me` vào thư mục skill của agent đó. Mỗi agent đặt thư mục này ở một chỗ riêng, bạn xem tài
liệu của agent đang dùng. Thư mục phải giữ nguyên tên `vina-me` và có `SKILL.md` nằm ngay bên trong.

## AI không có khái niệm skill

Dán toàn bộ nội dung `SKILL.md` vào phần chỉ dẫn hệ thống (system prompt, custom instructions). Nếu còn chỗ thì dán
thêm `references/machine-tells.md` và `references/punctuation.md`, vì hai tệp này giữ bảng dấu hiệu văn máy và quy tắc dấu câu.

Cách này AI không tự mở được các tệp còn lại trong `references/`, nên kết quả sẽ kém hơn cài thành skill.

## Giấy phép

MIT.
