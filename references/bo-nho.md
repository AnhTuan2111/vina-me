# Bộ nhớ dùng chung cho các agent

Agent quên hết sau mỗi phiên, nên người dùng phải dặn lại những điều đã dặn: gọi mình là gì, trả lời dài hay ngắn, văn bản
gửi sếp mở thế nào. Bộ nhớ là một thư mục `~/agent-memory/` mà agent đọc ở đầu mỗi phiên và tự ghi thêm khi người dùng sửa
hay khen một cách làm. Mọi agent trên máy dùng chung thư mục đó, nên dặn Claude Code điều gì thì Codex cũng biết. Thư mục có
thể là một repo GitHub riêng tư: sửa ở máy này thì máy kia kéo về ở phiên sau.

## Trong thư mục có gì

| Tệp | Chứa gì | Ai sửa | Lên repo |
|---|---|---|---|
| `AGENTS.md` | cửa vào: nạp bốn tệp dưới, luật khi nào ghi, ghi thế nào | ít khi sửa | có |
| `may-nay.md` | lệnh và đường dẫn trên máy đang chạy (`<cai-dat>`, `<bi-mat>`, thư mục skill, địa chỉ repo) | script cài đặt | không |
| `user.md` | người dùng là ai, cách họ muốn được trả lời | agent, theo lời người dùng | có |
| `memory.md` | cách làm việc người dùng đã dặn hoặc đã khen | agent, theo lời người dùng | có |
| `doi.md` | luật chung của đội: phông chữ, mẫu văn bản, việc không được làm | đội, qua `--doi` | có |

`may-nay.md` tách riêng vì mỗi máy một đường dẫn: máy này có Claude Code ở `~/.claude`, máy kia chỉ có Codex. Mẫu của các tệp
nằm ở `mau-bo-nho/` trong thư mục skill, không chứa thông tin của ai.

## Agent đọc bộ nhớ bằng cách nào

- **Claude Code** đọc `CLAUDE.md` trong thư mục cấu hình (`~/.claude`, hoặc `$CLAUDE_CONFIG_DIR` nếu có) ở mọi phiên. Script
  thêm vào đó dòng `@~/agent-memory/AGENTS.md`, và `AGENTS.md` lại có bốn dòng `@`, nên Claude nạp đủ năm tệp. Bộ nhớ có repo
  thì script thêm hook `SessionStart` vào `settings.json`: mỗi phiên mới, hook chạy `<cai-dat> --keo` để kéo bản mới; có tệp
  nào đổi thì hook in nội dung tệp đó ra, và Claude Code đưa chữ đó vào ngữ cảnh của phiên.
- **Codex** đọc `~/.codex/AGENTS.md` (hoặc `$CODEX_HOME/AGENTS.md`) ở mọi phiên nhưng không có cú pháp `@`. Script chép cả bộ
  nhớ vào tệp đó, giữa hai dòng đánh dấu "bộ nhớ vina-me: bắt đầu" và "bộ nhớ vina-me: hết". `may-nay.md` dặn Codex chạy
  `<cai-dat> --keo` ở đầu phiên. Codex có hook riêng nhưng phải bật cờ thử nghiệm và tin cậy hook, nên script chưa dùng.
- **Agent khác**: trỏ tệp chỉ dẫn toàn cục của nó tới `~/agent-memory/AGENTS.md`, hoặc chép nội dung các tệp vào đó.

## Cài lần đầu

Người dùng tự chạy, trong thư mục skill:

```bash
node scripts/cai-dat.mjs
```

Script hỏi tám câu (gọi là gì, vai trò, hay viết cho ai, trả lời dài hay ngắn, điều không muốn agent làm, tệp luật của
đội, có cho agent học từ các phiên cũ không, có lưu bộ nhớ lên GitHub không), rồi:

1. chép skill vào thư mục skill của Claude Code (`~/.claude/skills/vina-me`) nếu có Claude Code, vào `~/.agents/skills/vina-me`
   và `~/.codex/skills/vina-me` nếu có Codex;
2. dựng `~/agent-memory/` từ câu trả lời;
3. nếu người dùng muốn lưu lên GitHub: tạo repo riêng tư `<tài khoản GitHub>/agent-memory` bằng `gh`, commit và đẩy lên;
4. sinh `may-nay.md`, rồi nối bộ nhớ vào từng agent như mục trên.

Lưu lên GitHub cần `gh` đã đăng nhập (`gh auth login`, chạy một lần). Chưa đăng nhập thì script vẫn dựng bộ nhớ trên máy và
nói lệnh để đưa lên sau: `node scripts/cai-dat.mjs --github`. Muốn dùng repo khác (GitLab của công ty chẳng hạn) thì tạo repo
trống rồi chạy `node scripts/cai-dat.mjs --remote <url git>`.

**Máy thứ hai**: chạy đúng lệnh cài như trên. Script thấy trên GitHub đã có repo `agent-memory` của người dùng thì hỏi có kéo
về không, kéo về rồi khỏi hỏi tám câu. Với repo khác thì `--remote <url>`: repo đã có bộ nhớ thì kéo về.

Tệp cấu hình nào sắp bị sửa thì được sao lưu một lần thành `<tệp>.truoc-vina-me`. Chạy lại nhiều lần không sinh thêm dòng,
hook hay khối trùng.

## Agent dựng thay người dùng

Script không hỏi được khi agent chạy nó, vì không có cửa sổ dòng lệnh để gõ. Agent làm thế này:

1. Hỏi người dùng tám câu ở trên ngay trong chat, gộp vào một tin. Câu nào người dùng bỏ trống thì để trống.
2. Ghi câu trả lời vào một tệp JSON tạm, các khoá là `ten`, `vaiTro`, `vietCho`, `doDai` (`1` ngắn, `2` vừa, `3` đủ chi
   tiết), `khongMuon`, `luatDoi` (đường dẫn tệp luật của đội), `hocPhienCu` và `github` (`c` hoặc `k`). Tuỳ chọn: `repo`
   (tên repo, mặc định `agent-memory`), `remote` (url git), `keoTuGithub` (`c`/`k`, khi đã có repo từ máy khác).
3. Chạy `node <thư mục skill>/scripts/cai-dat.mjs --tra-loi <tệp JSON>`, rồi xoá tệp tạm.
4. Báo người dùng: bộ nhớ nằm ở đâu, có repo chưa, đã nối vào agent nào, và phải mở phiên mới thì agent mới đọc.

Máy không có Node thì dựng tay: chép ba tệp trong `mau-bo-nho/` vào `~/agent-memory/` (đổi `AGENTS.mau.md` thành
`AGENTS.md`, thay `{{NGAY}}` bằng ngày hôm nay), viết `user.md` từ câu trả lời và `may-nay.md` theo bảng trên, rồi thêm dòng
`@~/agent-memory/AGENTS.md` vào `~/.claude/CLAUDE.md` hoặc chép nội dung vào `~/.codex/AGENTS.md`.

Người dùng không muốn có bộ nhớ thì tạo tệp rỗng `~/agent-memory/.khong-dung` để lần sau khỏi hỏi.

## Việc sau khi cài

- Sửa bộ nhớ xong: `<cai-dat> --day "<đã ghi gì>"`. Lệnh chép bản mới sang Codex nếu có, rồi nếu có repo thì kéo bản trên
  repo về gộp, commit và đẩy lên.
- `--day` báo "không gộp được": máy khác đã sửa cùng chỗ. Bản trên máy vẫn còn, chưa đẩy. Agent xem hai bản
  (`git -C ~/agent-memory diff HEAD origin/main`), hỏi người dùng giữ ý nào, sửa tệp cho đúng, rồi
  `git -C ~/agent-memory pull --rebase` và giải xung đột như mọi repo git; xong chạy lại `--day`. Không ép đẩy.
- Kéo bản mới bằng tay: `<cai-dat> --keo`. Không có gì mới thì lệnh không in gì.
- Đội đổi luật chung: `<cai-dat> --doi <tệp luật>`, rồi `--day "cập nhật luật đội"`.
- Mật khẩu lưu bằng `bi-mat.mjs` không theo repo: mã hoá bằng tài khoản của từng máy, nên máy mới phải lưu lại.
- Gỡ: xoá dòng `@~/agent-memory/AGENTS.md` trong `CLAUDE.md`, hook có `cai-dat.mjs --keo` trong `settings.json`, khối giữa
  hai dòng đánh dấu trong `~/.codex/AGENTS.md` (hoặc chép lại các bản `.truoc-vina-me`), rồi xoá `~/agent-memory/` nếu không
  cần nữa. Repo trên GitHub thì xoá trên GitHub.

## Học từ phiên cũ

Bộ nhớ dựng từ tám câu hỏi thì còn mỏng. Phần dày lên được là những gì người dùng đã sửa, đã khen, đã kể về mình trong các
phiên trước. Agent làm việc này một lần, khi người dùng đồng ý (tệp `~/agent-memory/.can-hoc-phien` là dấu đã đồng ý):

1. Chạy `node <thư mục skill>/scripts/hoc-tu-phien.mjs`. Script đọc các phiên Claude Code (`~/.claude/projects`,
   `$CLAUDE_CONFIG_DIR/projects`) và Codex (`~/.codex/sessions`), chỉ lấy tin người dùng tự gõ, che mật khẩu và token trông
   thấy được, rồi ghi ra thư mục tạm: `tong-quan.md` và các đợt `dot-01.md`, `dot-02.md`… mỗi đợt khoảng 60.000 ký tự.
   Chỉ muốn từ một ngày thì thêm `--tu 2026-09-01`.
2. Đọc `tong-quan.md`, rồi từng đợt theo thứ tự. Sau mỗi đợt, ghi các ý tìm được vào một tệp nháp trong cùng thư mục tạm,
   không ghi thẳng vào bộ nhớ. Tìm bốn loại:
   - người dùng sửa cách làm: "đừng", "sao lại", "không phải thế", "lần sau", "tôi bảo rồi";
   - người dùng khen hay nhận một cách làm: "hay đấy", "đúng rồi", "cứ thế";
   - người dùng kể về mình: vai trò, việc đang làm, người đọc văn bản của họ, cách họ muốn được trả lời;
   - điều người dùng nhắc đi nhắc lại ở nhiều phiên. Nhắc càng nhiều lần thì càng chắc là luật.
3. Bỏ: việc chỉ đúng trong một dự án, chi tiết của một lần làm, chuyện riêng tư, thông tin khách hàng, và mọi thứ trông
   giống mật khẩu dù script đã che hay chưa.
4. Gộp các ý trùng. Hai ý ngược nhau thì giữ ý mới hơn, ghi rõ là đã đổi.
5. Đưa người dùng bản nháp chia hai phần (thêm vào `user.md`, thêm vào `memory.md`). Mỗi ý kèm một lời trích nguyên văn và
   ngày. Người dùng duyệt, sửa, bỏ từng ý.
6. Ghi các ý đã duyệt theo luật ở `AGENTS.md`, chạy `<cai-dat> --day "học từ phiên cũ"`, xoá thư mục tạm và tệp
   `.can-hoc-phien`.

Lịch sử dài thì có nhiều đợt; đọc lần lượt và giữ tệp nháp ngắn, đừng chép lại nguyên văn các đợt vào nháp.

## Mật khẩu và token

Agent cần mật khẩu để đăng nhập GitLab, VPN, một trang quản trị. Dán mật khẩu vào chat thì nó nằm lại trong lịch sử phiên trên
máy và được gửi lên nhà cung cấp mô hình, nên `scripts/bi-mat.mjs` cho người dùng gõ vào một cửa sổ riêng:

```bash
node scripts/bi-mat.mjs them gitlab                       # mở cửa sổ cho người dùng gõ tài khoản, mật khẩu
node scripts/bi-mat.mjs chay gitlab -- bash -c 'git clone "https://$GITLAB_USER:$GITLAB_PASS@git.example.com/a.git"'
node scripts/bi-mat.mjs stdin registry -- docker login reg.example.com -u ten --password-stdin
node scripts/bi-mat.mjs ds                                # tên và tài khoản, không có mật khẩu
```

- Windows: mỗi bí mật là một tệp `~/.secrets/<tên>.xml` do `Export-Clixml` của PowerShell ghi. Mật khẩu mã hoá bằng DPAPI, chỉ
  đúng tài khoản Windows đó trên đúng máy đó giải mã được; chép tệp sang máy khác là vô dụng. Tên tài khoản để chữ thường
  trong tệp.
- macOS: lưu vào Keychain, tên dịch vụ `vina-me:<tên>`. Phần này chưa thử trên máy Mac thật.
- `chay` đưa tài khoản và mật khẩu vào biến môi trường `<TÊN>_USER`, `<TÊN>_PASS` của lệnh con (tên viết hoa, gạch nối
  thành gạch dưới; đổi tiền tố bằng `--bien`). Lệnh con chạy thẳng, không qua shell, nên muốn dùng biến trong câu lệnh thì
  bọc bằng `bash -c '…'` hoặc `pwsh -c '…'` với nháy đơn, để shell của agent không thay biến trước.
- `stdin` đưa mật khẩu vào stdin của lệnh con, dùng cho lệnh có `--password-stdin`.
- Người dùng đã lỡ dán mật khẩu vào chat: lưu bằng `them <tên> --tai-khoan <tk> --tu-stdin` với mật khẩu đưa vào stdin, rồi
  nhắc người dùng đổi mật khẩu nếu nó quan trọng.
- Agent không in, không echo, không ghi mật khẩu ra tệp. Lệnh con tự in mật khẩu (như `env`, `set -x`) cũng là lộ.
