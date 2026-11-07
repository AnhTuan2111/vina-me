<img src="assets/banner.svg" alt="vina-me: viết tiếng Việt cho thuận mồm" width="100%">

vina-me giúp AI agent viết và sửa văn tiếng Việt cho dễ đọc, không có mùi văn máy: bài giảng, tài liệu, báo cáo gửi sếp,
văn bản hành chính, email, tệp Word. Cài một lần là có thêm bộ nhớ dùng chung cho Claude Code và Codex, nên điều đã dặn
agent một lần thì không phải dặn lại.

## Cài

Cần Node 18 trở lên và git.

```bash
git clone https://github.com/AnhTuan2111/vina-me.git
node vina-me/scripts/setup.mjs
```

Script hỏi tám câu, câu chọn thì dùng phím mũi tên. Phông của terminal hiện ô vuông thay cho mũi nhọn thì thêm `--plain`.

<img src="assets/setup.svg" alt="Màn hỏi của setup.mjs: dải màu tím, lam, xanh lục; các câu đã trả lời thu thành một dòng" width="100%">

Trả lời xong là có:

- skill trong Claude Code và Codex, agent nào có trên máy thì cài cho agent đó;
- bộ nhớ ở `~/agent-memory/`: agent đọc ở đầu mỗi phiên, tự ghi khi bạn sửa hay khen một cách làm;
- repo GitHub riêng tư cho bộ nhớ nếu bạn chọn, tự lưu khi mở và đóng phiên, khi đăng nhập máy và mỗi 2 giờ;
- vina-me tự lên bản phát hành mới nhất.

Cài trên máy thứ hai bằng đúng hai lệnh trên: script thấy repo bộ nhớ đã có thì kéo về, không hỏi lại.

## Dùng

Mở phiên Claude Code mới, gõ `/vina-me` hoặc cứ nhờ viết, sửa văn tiếng Việt như thường. Thường agent tự gọi các
script; bạn muốn chạy tay thì đứng trong thư mục `vina-me`:

| Lệnh | Làm gì |
|---|---|
| `node scripts/lint.mjs <tệp>` | soát văn máy, dấu câu, độ dài câu; thêm `--official` để soát thể thức văn bản hành chính |
| `node scripts/report-docx.mjs <content.json> <out.docx>` | xuất báo cáo ra Word |
| `node scripts/secrets.mjs add <tên>` | cất mật khẩu cho agent dùng mà không dán vào chat |
| `node scripts/setup.mjs check` | soát bộ nhớ: quá dài, ý gần trùng |

Mật khẩu được mã hoá bằng tài khoản Windows (Keychain trên macOS) nên không lọt vào chat hay lịch sử phiên, nhưng chương
trình nào chạy bằng tài khoản của bạn, kể cả agent, vẫn giải mã được. Chi tiết về bộ nhớ, đồng bộ, xung đột và cách gỡ ở
[`references/agent-memory.md`](references/agent-memory.md).

## Chỉ cài skill, không cần bộ nhớ

- Claude Code: `git clone https://github.com/AnhTuan2111/vina-me.git ~/.claude/skills/vina-me`, cập nhật bằng `git pull`.
- Claude trên web, ứng dụng desktop: tải zip, đổi thư mục bên trong thành `vina-me`, nén lại rồi tải lên ở mục Skills.
- Agent khác có Agent Skills: chép thư mục `vina-me` (có `SKILL.md` ngay bên trong) vào thư mục skill của agent.
- AI không có skill: dán `SKILL.md` vào phần chỉ dẫn hệ thống, còn chỗ thì thêm `references/core-rules.md`,
  `references/machine-tells.md` và `references/punctuation.md`.

## Phát triển

```bash
node --test tests/setup.test.mjs tests/tools.test.mjs
```

Bộ test chạy trên home giả và repo git trần, không chạm GitHub hay lịch thật. Đã chạy trên Windows 11 và Ubuntu; chưa
thử trên macOS. Lịch sử thay đổi ở [`CHANGELOG.md`](CHANGELOG.md), quy trình phát hành ở `references/agent-memory.md`.

## Giấy phép

MIT.
