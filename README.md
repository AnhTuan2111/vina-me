# vina-me

Skill giúp AI agent viết và sửa văn tiếng Việt cho thuận mồm, dễ hiểu, không có mùi văn máy. Skill theo chuẩn
[Agent Skills](https://agentskills.io/specification), nên agent nào đọc được chuẩn này cũng cài được.

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
thêm `references/dau-hieu.md` và `references/dau-cau.md`, vì hai tệp này giữ bảng dấu hiệu văn máy và quy tắc dấu câu.

Cách này AI không tự mở được các tệp còn lại trong `references/`, nên kết quả sẽ kém hơn cài thành skill.

## Giấy phép

MIT.
