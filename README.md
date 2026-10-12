# vina-me

Tên đọc là "vina" và "me", tức tiếng Việt của mình.

Skill giúp AI viết và sửa văn tiếng Việt cho thuận mồm, dễ hiểu, không có mùi văn máy và không rơi vào giọng văn mẫu.
Skill theo chuẩn [Agent Skills](https://agentskills.io/specification).

## Cấu trúc

```
vina-me/
├── SKILL.md             quy trình, bảy điều cốt lõi, dấu gạch và ký hiệu, giọng, cách trả kết quả
├── references/          12 tệp quy tắc, cần tới tệp nào thì đọc tệp đó
├── scripts/soat.mjs     đếm phần máy đếm được trong một văn bản
└── evals/evals.json     các đề thử
```

## Cài

- Với Claude Code thì chép thư mục vào `~/.claude/skills/` hoặc `.claude/skills/` của dự án. Gọi bằng
  `/vina-me`, hoặc để skill tự được gọi khi yêu cầu khớp phần mô tả.
- Với công cụ khác theo chuẩn Agent Skills thì nén thư mục thành zip rồi tải lên ở phần quản lý skill.
- Với AI không có khái niệm skill thì dán `SKILL.md` vào phần chỉ dẫn hệ thống. Cần soát kỹ thì dán thêm
  `references/dau-hieu.md` và `references/dau-cau.md`.

## Script soát

```bash
node scripts/soat.mjs bai-viet.md trang.html
```

Script cần Node 18 trở lên và đọc được tệp `.md`, `.txt`, `.html`. Nó in ra số chữ mỗi câu, số câu mỗi đoạn, tỉ lệ câu
hỏi, dấu gạch dài, ký hiệu trong câu văn, cụm ít gặp ngoài đời, khuôn mở và kết của văn mẫu. Script chỉ đếm bề mặt,
nên chạy xong vẫn phải tự đọc lại.

## Giấy phép

MIT.
