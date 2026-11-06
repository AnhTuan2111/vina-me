# Bộ nhớ dùng chung cho các agent

Agent quên hết sau mỗi phiên, nên người dùng phải dặn lại những điều đã dặn: gọi mình là gì, trả lời dài hay ngắn, văn bản
gửi sếp mở thế nào. Bộ nhớ là một thư mục `~/agent-memory/` mà agent đọc ở đầu mỗi phiên và tự ghi thêm khi người dùng sửa
hay khen một cách làm. Mọi agent trên máy dùng chung thư mục đó, nên dặn Claude Code điều gì thì Codex cũng biết. Thư mục có
thể là một repo GitHub riêng tư: sửa ở máy này thì máy kia kéo về ở phiên sau.

## Trong thư mục có gì

| Tệp | Chứa gì | Ai sửa | Lên repo |
|---|---|---|---|
| `AGENTS.md` | cửa vào: nạp bốn tệp dưới, luật khi nào ghi, ghi vào tệp nào, lưu thế nào | ít khi sửa | có |
| `machine.md` | lệnh và đường dẫn trên máy đang chạy (`<setup>`, `<secrets>`, thư mục skill, địa chỉ repo) | script cài đặt | không |
| `user.md` | con người: là ai, vai trò, viết cho ai, muốn được nói chuyện thế nào | agent, theo lời người dùng | có |
| `memory.md` | cách làm việc: quy trình, quy ước, định dạng tài liệu người dùng đã dặn hoặc đã khen | agent, theo lời người dùng | có |
| `team.md` | luật chung của đội: phông chữ, mẫu văn bản, việc không được làm | đội, qua `<setup> team` | có |

Agent tự xếp một ý vào `user.md` hay `memory.md` theo bảng trong `AGENTS.md`: nói về con người thì vào `user.md`, nói về cách
làm việc thì vào `memory.md`, ý có cả hai thì tách làm hai. `machine.md` tách riêng vì mỗi máy một đường dẫn: máy này có
Claude Code ở `~/.claude`, máy kia chỉ có Codex. Mẫu của các tệp nằm ở `memory-template/`, không chứa thông tin của ai.

## Agent đọc bộ nhớ bằng cách nào

- **Claude Code** đọc `CLAUDE.md` trong thư mục cấu hình (`~/.claude`, hoặc `$CLAUDE_CONFIG_DIR` nếu có) ở mọi phiên. Script
  thêm vào đó dòng `@~/agent-memory/AGENTS.md`, và `AGENTS.md` lại có bốn dòng `@`, nên Claude nạp đủ năm tệp.
- **Codex** đọc `~/.codex/AGENTS.md` (hoặc `$CODEX_HOME/AGENTS.md`) ở mọi phiên nhưng không có cú pháp `@`. Script chép cả bộ
  nhớ vào tệp đó, giữa hai dòng đánh dấu "vina-me memory: start" và "vina-me memory: end", và chép lại mỗi lần `sync` chạy.
  Codex có hook riêng nhưng phải bật cờ thử nghiệm và tin cậy hook, nên script chưa dùng; `machine.md` dặn Codex chạy
  `<setup> sync` ở đầu phiên.
- **Agent khác**: trỏ tệp chỉ dẫn toàn cục của nó tới `~/agent-memory/AGENTS.md`, hoặc chép nội dung các tệp vào đó.

## Lưu và kéo bộ nhớ

Agent chỉ sửa tệp, không tự commit. Lệnh `<setup> sync` làm cả việc lưu lẫn việc kéo:

1. kéo vina-me mới nhất (mục dưới);
2. gom mọi thay đổi chưa commit trong `~/agent-memory` thành một commit, tên commit liệt kê tệp đã đổi và tên máy;
3. kéo bản trên repo về gộp; máy khác đã sửa cùng chỗ thì huỷ gộp, giữ nguyên bản trên máy, báo lỗi;
4. đẩy lên repo;
5. chép lại bộ nhớ sang Codex.

`sync` chạy ở bốn lúc, nên thay đổi không mất dù phiên bị tắt ngang hay máy tắt đột ngột:

- mở phiên Claude Code: hook `SessionStart` (matcher `startup`) trong `settings.json`. Tệp nào vừa được kéo về từ máy khác
  thì hook in nội dung tệp đó ra, và Claude Code đưa chữ đó vào ngữ cảnh của phiên;
- đóng phiên Claude Code: hook `SessionEnd`;
- đăng nhập máy: Windows đặt `vina-me-sync.vbs` trong thư mục Startup, chạy ẩn không bật cửa sổ; macOS và Linux dùng dòng
  `@reboot` trong crontab;
- mỗi 2 giờ: Windows tạo task "vina-me sync" trong Task Scheduler; macOS và Linux dùng dòng `0 */2 * * *` trong crontab.

Nhiều lần `sync` chạy chồng nhau (hai phiên cùng mở) thì lần sau thấy khoá ở `~/.config/vina-me/sync.lock` và bỏ qua. Mỗi
lần chạy ghi một dòng vào `~/.config/vina-me/sync.log`, giữ 200 dòng cuối. Người dùng bảo lưu ngay thì `<setup> save
"<đã ghi gì>"`: commit với lời commit đó và đẩy luôn.

## Tự cập nhật vina-me

Khi cài, script giữ một bản clone của vina-me ở `~/.config/vina-me/source` (chép từ thư mục đã clone, hoặc clone lại từ
GitHub nếu tải zip). Mỗi lần `sync` chạy, nó `git pull` bản clone đó; có bản mới thì chép sang mọi thư mục skill đã cài và
in một dòng "vina-me vừa được cập nhật lên …". Cập nhật bằng tay: `<setup> update`. Danh sách thư mục skill nằm ở
`~/.config/vina-me/config.json`.

## Cài lần đầu

Người dùng tự chạy, trong thư mục vina-me vừa clone:

```bash
node scripts/setup.mjs
```

Trong cửa sổ dòng lệnh có màu, script hỏi theo kiểu dải màu như prompt oh-my-posh: mỗi câu có số thứ tự và nhãn, câu đã
trả lời thu thành một dòng, câu có/không và câu chọn độ dài thì chọn bằng phím mũi tên. Dải màu dùng ký tự Powerline (có
sẵn trong phông Cascadia của Windows Terminal và các phông Nerd Font); phông nào hiện thành ô vuông thì thêm `--plain` để hỏi
trơn từng dòng. Chạy qua pipe hoặc có biến `NO_COLOR` thì script tự hỏi trơn.

Script hỏi tám câu (gọi là gì, vai trò, hay viết cho ai, trả lời dài hay ngắn, điều không muốn agent làm, tệp luật của
đội, có cho agent học từ các phiên cũ không, có lưu bộ nhớ lên GitHub không), rồi:

1. chép skill vào thư mục skill của Claude Code nếu có, vào `~/.agents/skills/vina-me` và `~/.codex/skills/vina-me` nếu có
   Codex, và giữ bản clone để tự cập nhật;
2. dựng `~/agent-memory/` từ câu trả lời;
3. nếu người dùng muốn lưu lên GitHub: tạo repo riêng tư `<tài khoản GitHub>/agent-memory` bằng `gh`, commit và đẩy lên;
4. sinh `machine.md`, nối bộ nhớ vào từng agent, cài hook và lịch tự lưu (bỏ lịch bằng `--no-schedule`).

Lưu lên GitHub cần `gh` đã đăng nhập (`gh auth login`, chạy một lần). Chưa đăng nhập thì script vẫn dựng bộ nhớ trên máy và
nói lệnh để đưa lên sau: `<setup> github`. Muốn dùng repo khác (GitLab của công ty chẳng hạn) thì tạo repo trống rồi chạy
`<setup> remote <url git>`.

**Máy thứ hai**: chạy đúng lệnh cài như trên. Script thấy trên GitHub đã có repo `agent-memory` của người dùng thì hỏi có kéo
về không, kéo về rồi khỏi hỏi tám câu. Với repo khác thì cài kèm `--remote <url>`: repo đã có bộ nhớ thì kéo về.

Tệp cấu hình nào sắp bị sửa thì được sao lưu một lần thành `<tệp>.vina-me-backup`. Chạy lại nhiều lần không sinh thêm dòng,
hook hay khối trùng.

## Agent dựng thay người dùng

Script không hỏi được khi agent chạy nó, vì không có cửa sổ dòng lệnh để gõ. Agent làm thế này:

1. Hỏi người dùng tám câu ở trên ngay trong chat, gộp vào một tin. Câu nào người dùng bỏ trống thì để trống.
2. Ghi câu trả lời vào một tệp JSON tạm, các khoá là `name`, `role`, `writesFor`, `length` (`1` ngắn, `2` vừa, `3` đủ chi
   tiết), `avoid`, `teamRules` (đường dẫn tệp luật của đội), `learnFromSessions` và `github` (`y` hoặc `n`). Tuỳ chọn: `repo`
   (tên repo, mặc định `agent-memory`), `remote` (url git), `pullFromGithub` (`y`/`n`, khi đã có repo từ máy khác).
3. Chạy `node <thư mục skill>/scripts/setup.mjs --answers <tệp JSON>`, rồi xoá tệp tạm.
4. Báo người dùng: bộ nhớ nằm ở đâu, có repo chưa, đã nối vào agent nào, và phải mở phiên mới thì agent mới đọc.

Máy không có Node thì dựng tay: chép ba tệp trong `memory-template/` vào `~/agent-memory/` (đổi `AGENTS.template.md` thành
`AGENTS.md`, thay `{{DATE}}` bằng ngày hôm nay), viết `user.md` từ câu trả lời và `machine.md` theo bảng trên, rồi thêm dòng
`@~/agent-memory/AGENTS.md` vào `~/.claude/CLAUDE.md` hoặc chép nội dung vào `~/.codex/AGENTS.md`.

Người dùng không muốn có bộ nhớ thì tạo tệp rỗng `~/agent-memory/.disabled` để lần sau khỏi hỏi.

## Việc sau khi cài

- `sync` báo "không gộp được": máy khác đã sửa cùng chỗ. Bản trên máy vẫn còn, chưa đẩy. Agent xem hai bản
  (`git -C ~/agent-memory diff HEAD origin/main`), hỏi người dùng giữ ý nào, rồi `git -C ~/agent-memory pull --rebase`, giải
  xung đột như mọi repo git, và chạy lại `<setup> sync`. Không ép đẩy.
- Đội đổi luật chung: `<setup> team <tệp luật>`. Lần `sync` sau sẽ lưu lên repo.
- Mật khẩu lưu bằng `secrets.mjs` không theo repo: mã hoá bằng tài khoản của từng máy, nên máy mới phải lưu lại.
- Gỡ:
  - xoá dòng `@~/agent-memory/AGENTS.md` trong `CLAUDE.md` và hai hook có `setup.mjs` trong `settings.json`;
  - xoá khối giữa hai dòng đánh dấu trong `~/.codex/AGENTS.md`;
  - Windows: xoá `vina-me-sync.vbs` trong thư mục Startup, chạy `schtasks /Delete /TN "vina-me sync" /F`; macOS, Linux: xoá
    hai dòng có `# vina-me sync` trong crontab;
  - hoặc chép lại các bản `.vina-me-backup`; rồi xoá `~/agent-memory/` và `~/.config/vina-me/` nếu không cần nữa. Repo trên
    GitHub thì xoá trên GitHub.

## Học từ phiên cũ

Bộ nhớ dựng từ tám câu hỏi thì còn mỏng. Phần dày lên được là những gì người dùng đã sửa, đã khen, đã kể về mình trong các
phiên trước. Agent làm việc này một lần, khi người dùng đồng ý (tệp `~/agent-memory/.pending-learn` là dấu đã đồng ý):

1. Nói với người dùng trước khi làm: các đợt rút ra nằm trên máy, nhưng khi agent đọc chúng thì nội dung được gửi lên nhà
   cung cấp mô hình thêm một lần. Hỏi dự án nào cần bỏ ra; người dùng đổi ý thì dừng.
2. Chạy `node <thư mục skill>/scripts/learn-from-sessions.mjs`. Script đọc các phiên Claude Code (`~/.claude/projects`,
   `$CLAUDE_CONFIG_DIR/projects`) và Codex (`~/.codex/sessions`), chỉ lấy tin người dùng tự gõ, che mật khẩu và token trông
   thấy được, rồi ghi ra thư mục tạm: `overview.md` và các đợt `batch-01.md`, `batch-02.md`… mỗi đợt khoảng 60.000 ký tự.
   Chỉ muốn từ một ngày thì thêm `--since 2026-09-01`. Chỉ lấy vài dự án thì `--only <chữ trong đường dẫn>`, bỏ dự án
   thì `--exclude <chữ trong đường dẫn>`; hai cờ lặp lại được. Script báo số chỗ đã che.
3. Đọc `overview.md`, rồi từng đợt theo thứ tự. Sau mỗi đợt, ghi các ý tìm được vào một tệp nháp trong cùng thư mục tạm,
   không ghi thẳng vào bộ nhớ. Tìm bốn loại:
   - người dùng sửa cách làm: "đừng", "sao lại", "không phải thế", "lần sau", "tôi bảo rồi";
   - người dùng khen hay nhận một cách làm: "hay đấy", "đúng rồi", "cứ thế";
   - người dùng kể về mình: vai trò, việc đang làm, người đọc văn bản của họ, cách họ muốn được trả lời;
   - điều người dùng nhắc đi nhắc lại ở nhiều phiên. Nhắc càng nhiều lần thì càng chắc là luật.
4. Bỏ: việc chỉ đúng trong một dự án, chi tiết của một lần làm, chuyện riêng tư, thông tin khách hàng, và mọi thứ trông
   giống mật khẩu dù script đã che hay chưa.
5. Gộp các ý trùng. Hai ý ngược nhau thì giữ ý mới hơn, ghi rõ là đã đổi. Xếp từng ý vào `user.md` hay `memory.md` theo bảng
   trong `AGENTS.md`.
6. Đưa người dùng bản nháp chia hai phần (thêm vào `user.md`, thêm vào `memory.md`). Mỗi ý kèm một lời trích nguyên văn và
   ngày. Người dùng duyệt, sửa, bỏ từng ý.
7. Ghi các ý đã duyệt theo luật ở `AGENTS.md`, chạy `<setup> save "học từ phiên cũ"`, xoá thư mục tạm và tệp
   `.pending-learn`.

Lịch sử dài thì có nhiều đợt; đọc lần lượt và giữ tệp nháp ngắn, đừng chép lại nguyên văn các đợt vào nháp.

## Mật khẩu và token

Agent cần mật khẩu để đăng nhập GitLab, VPN, một trang quản trị. Dán mật khẩu vào chat thì nó nằm lại trong lịch sử phiên trên
máy và được gửi lên nhà cung cấp mô hình, nên `scripts/secrets.mjs` cho người dùng gõ vào một cửa sổ riêng:

```bash
node scripts/secrets.mjs add gitlab                       # mở cửa sổ cho người dùng gõ tài khoản, mật khẩu
node scripts/secrets.mjs run gitlab -- bash -c 'git clone "https://$GITLAB_USER:$GITLAB_PASS@git.example.com/a.git"'
node scripts/secrets.mjs stdin registry -- docker login reg.example.com -u ten --password-stdin
node scripts/secrets.mjs list                             # tên và tài khoản, không có mật khẩu
```

- Windows: mỗi bí mật là một tệp `~/.secrets/<tên>.xml` do `Export-Clixml` của PowerShell ghi. Mật khẩu mã hoá bằng DPAPI, chỉ
  đúng tài khoản Windows đó trên đúng máy đó giải mã được; chép tệp sang máy khác là vô dụng. Tên tài khoản để chữ thường
  trong tệp.
- macOS: lưu vào Keychain, tên dịch vụ `vina-me:<tên>`. Phần này chưa thử trên máy Mac thật.
- `run` đưa tài khoản và mật khẩu vào biến môi trường `<TÊN>_USER`, `<TÊN>_PASS` của lệnh con (tên viết hoa, gạch nối
  thành gạch dưới; đổi tiền tố bằng `--env-prefix`). Lệnh con chạy thẳng, không qua shell, nên muốn dùng biến trong câu lệnh
  thì bọc bằng `bash -c '…'` hoặc `pwsh -c '…'` với nháy đơn, để shell của agent không thay biến trước.
- `stdin` đưa mật khẩu vào stdin của lệnh con, dùng cho lệnh có `--password-stdin`.
- Người dùng đã lỡ dán mật khẩu vào chat: lưu bằng `add <tên> --account <tk> --from-stdin` với mật khẩu đưa vào stdin, rồi
  nhắc người dùng đổi mật khẩu nếu nó quan trọng.
- Agent không in, không echo, không ghi mật khẩu ra tệp. Lệnh con tự in mật khẩu (như `env`, `set -x`) cũng là lộ.

Phạm vi bảo vệ:

- Chặn được: mật khẩu gõ vào cửa sổ riêng thì không vào chat, không vào lịch sử phiên, không bị gửi lên nhà cung cấp mô hình;
  tệp bí mật chép sang máy khác hay tài khoản Windows khác thì không giải mã được.
- Không chặn được: chương trình nào chạy bằng tài khoản của bạn cũng giải mã được, kể cả agent. Agent chỉ cần
  `secrets.mjs run <tên> -- node -e "console.log(process.env)"` là thấy mật khẩu, và chữ in ra đó sẽ vào lịch sử phiên. Mật
  khẩu đã dán vào chat thì đã nằm trong lịch sử, lưu lại không xoá được bản đó.
- Vì vậy: dùng token có phạm vi hẹp và hạn dùng ngắn thay cho mật khẩu chính khi được; để agent hỏi trước khi chạy lệnh nếu
  không muốn nó tự dùng bí mật.
