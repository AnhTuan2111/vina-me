# Bộ nhớ dùng chung cho các agent

Agent quên hết sau mỗi phiên, nên người dùng phải dặn lại những điều đã dặn: gọi mình là gì, trả lời dài hay ngắn, văn bản
gửi sếp mở thế nào. Bộ nhớ là một thư mục `~/agent-memory/` mà agent đọc ở đầu mỗi phiên và tự ghi thêm khi người dùng sửa
hay khen một cách làm. Một thư mục dùng chung cho mọi agent trên máy, nên dặn Claude Code điều gì thì Codex cũng biết.

## Trong thư mục có gì

| Tệp | Chứa gì | Ai sửa |
|---|---|---|
| `AGENTS.md` | cửa vào: nạp ba tệp dưới, và luật khi nào ghi, ghi thế nào | ít khi sửa |
| `user.md` | người dùng là ai, cách họ muốn được trả lời | agent, theo lời người dùng |
| `memory.md` | cách làm việc người dùng đã dặn hoặc đã khen | agent, theo lời người dùng |
| `doi.md` | luật chung của đội: phông chữ, mẫu văn bản, việc không được làm | đội, qua `--doi` |

Mẫu của các tệp này nằm ở `mau-bo-nho/` trong thư mục skill. Mẫu không chứa thông tin của ai.

## Agent đọc bộ nhớ bằng cách nào

- **Claude Code** đọc `~/.claude/CLAUDE.md` ở mọi phiên. Script thêm vào đó dòng `@~/agent-memory/AGENTS.md`, và `AGENTS.md`
  lại có ba dòng `@user.md`, `@memory.md`, `@doi.md`, nên Claude nạp đủ bốn tệp.
- **Codex** đọc `~/.codex/AGENTS.md` ở mọi phiên nhưng không có cú pháp `@` để nạp tệp khác. Script chép cả bộ nhớ vào tệp đó,
  giữa hai dòng đánh dấu "bộ nhớ vina-me: bắt đầu" và "bộ nhớ vina-me: hết". Bộ nhớ đổi thì bản chép phải đồng bộ lại, và
  `AGENTS.md` đã dặn agent chạy lệnh đồng bộ sau mỗi lần sửa.
- **Agent khác**: trỏ tệp chỉ dẫn toàn cục của nó tới `~/agent-memory/AGENTS.md`, hoặc chép nội dung bốn tệp vào đó.

## Cài lần đầu

Người dùng tự chạy, trong thư mục skill:

```bash
node scripts/cai-dat.mjs
```

Script hỏi sáu câu (gọi là gì, vai trò, hay viết cho ai, trả lời dài hay ngắn, điều không muốn agent làm, tệp luật của
đội), rồi:

1. chép skill vào `~/.claude/skills/vina-me` nếu có Claude Code, vào `~/.agents/skills/vina-me` và `~/.codex/skills/vina-me`
   nếu có Codex;
2. dựng `~/agent-memory/` từ câu trả lời, hoặc giữ nguyên nếu đã có;
3. nối bộ nhớ vào từng agent như mục trên.

Tệp cấu hình nào sắp bị sửa thì được sao lưu một lần thành `<tệp>.truoc-vina-me`. Chạy lại nhiều lần không sinh thêm dòng
hay khối trùng.

## Agent dựng thay người dùng

Script không hỏi được khi agent chạy nó, vì không có cửa sổ dòng lệnh để gõ. Agent làm thế này:

1. Hỏi người dùng sáu câu ở trên ngay trong chat, gộp vào một tin. Câu nào người dùng bỏ trống thì để trống.
2. Ghi câu trả lời vào một tệp JSON tạm, các khoá là `ten`, `vaiTro`, `vietCho`, `doDai` (`1` ngắn, `2` vừa, `3` đủ chi
   tiết), `khongMuon`, `luatDoi` (đường dẫn tệp luật của đội).
3. Chạy `node <thư mục skill>/scripts/cai-dat.mjs --tra-loi <tệp JSON>`, rồi xoá tệp tạm.
4. Báo người dùng: bộ nhớ nằm ở đâu, đã nối vào agent nào, và phải mở phiên mới thì agent mới đọc.

Máy không có Node thì dựng tay: chép ba tệp trong `mau-bo-nho/` vào `~/agent-memory/` (đổi `AGENTS.mau.md` thành
`AGENTS.md`, thay `{{NGAY}}` bằng ngày hôm nay, xoá `{{DONG_BO}}`), viết `user.md` từ câu trả lời, rồi thêm dòng
`@~/agent-memory/AGENTS.md` vào `~/.claude/CLAUDE.md` hoặc chép nội dung vào `~/.codex/AGENTS.md`.

Người dùng không muốn có bộ nhớ thì tạo tệp rỗng `~/agent-memory/.khong-dung` để lần sau khỏi hỏi.

## Việc sau khi cài

- Sửa bộ nhớ xong mà máy có Codex: chạy `node <thư mục skill>/scripts/cai-dat.mjs --dong-bo`.
- Đội đổi luật chung: chạy `node <thư mục skill>/scripts/cai-dat.mjs --doi <tệp luật>`. Lệnh này thay `doi.md` và đồng bộ
  luôn cho Codex.
- Gỡ: xoá dòng `@~/agent-memory/AGENTS.md` trong `~/.claude/CLAUDE.md` và khối giữa hai dòng đánh dấu trong
  `~/.codex/AGENTS.md` (hoặc chép lại bản `.truoc-vina-me`), rồi xoá `~/agent-memory/` nếu không cần nữa.
