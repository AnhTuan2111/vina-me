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
  Codex có hook riêng nhưng phải bật flag thử nghiệm và tin cậy hook, nên script chưa dùng; `machine.md` dặn Codex chạy
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
GitHub nếu tải zip). Mỗi lần `sync` chạy (tối đa 6 giờ kiểm một lần), nó lấy tag phát hành `vX.Y.Z` mới nhất; có bản mới thì
chép sang mọi thư mục skill đã cài và in một dòng "vina-me vừa được cập nhật lên vX.Y.Z" kèm dòng đầu của mục đó trong
`CHANGELOG.md`. Commit mới trên `main` chưa gắn tag thì máy người dùng chưa nhận. Cập nhật ngay: `<setup> update`.

Người bảo trì muốn máy mình chạy bản đang làm thì `<setup> channel main`: máy đó theo đầu nhánh `main`. Về lại bản phát
hành: `<setup> channel release`. Danh sách thư mục skill và kênh nằm ở `~/.config/vina-me/config.json`.

Phát hành một bản:

1. sửa `version` trong `SKILL.md`, thêm mục mới lên đầu `CHANGELOG.md` (dòng đầu là điều đáng báo nhất);
2. merge vào `main`, gắn tag: `git tag v0.9.0 && git push origin v0.9.0`;
3. tạo bản phát hành trên GitHub: `gh release create v0.9.0 --notes-file <mục changelog>`.

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

Ngoài hai hook tự lưu, Claude Code còn được cài hook `UserPromptSubmit`. Mỗi lần người dùng gửi một tin, hook chạy
`scripts/remind.mjs`, in một dòng nhắc agent soát lời trả lời theo vina-me, và Claude Code chèn dòng đó vào ngữ cảnh của lượt
ấy. Lý do là nội dung `SKILL.md` chỉ được nạp một lần lúc gọi skill, phiên dài thì bị tóm gọn, nên agent dễ quên áp luật cho
câu trả lời ngắn. Máy cài từ bản trước được `sync` thêm hook này một lần sau khi cập nhật; người dùng tự gỡ thì không thêm lại.

Lưu lên GitHub cần `gh` đã đăng nhập (`gh auth login`, chạy một lần). Chưa đăng nhập thì script vẫn dựng bộ nhớ trên máy và
nói lệnh để đưa lên sau: `<setup> github`. Muốn dùng repo khác (GitLab của công ty chẳng hạn) thì tạo repo trống rồi chạy
`<setup> remote <url git>`.

**Máy thứ hai**: chạy đúng lệnh cài như trên. Script thấy trên GitHub đã có repo `agent-memory` của người dùng thì hỏi có kéo
về không, kéo về rồi khỏi hỏi tám câu. Với repo khác thì cài kèm `--remote <url>`: repo đã có bộ nhớ thì kéo về.

Tệp cấu hình nào sắp bị sửa thì được sao lưu một lần thành `<tệp>.vina-me-backup`. Chạy lại nhiều lần không sinh thêm dòng,
hook hay khối trùng.

## Agent cài thay người dùng

Người dùng không quen dòng lệnh thường nhờ agent cài, kiểu "cài giúp mình vina-me". Script không hỏi được khi agent chạy nó,
vì không có cửa sổ dòng lệnh để gõ, nên agent làm từng bước dưới đây, tự chạy lệnh, và chỉ dừng lại ở chỗ cần người dùng tự
làm. Mỗi bước xong thì báo một câu ngắn bằng lời thường, không đưa cả khối lệnh cho người dùng đọc.

1. **Node và git.** Chạy `node -v` và `git --version`. Node dưới 18 hay thiếu một trong hai thì nói với người dùng sắp cài gì,
   rồi cài bằng trình quản lý gói của máy: Windows `winget install OpenJS.NodeJS.LTS` và `winget install Git.Git`, macOS
   `brew install node git`, Ubuntu `sudo apt install nodejs git`. Cài xong trên Windows thì terminal cũ chưa thấy lệnh mới;
   mở lại phiên, hoặc gọi bằng đường dẫn đầy đủ.
2. **Lấy vina-me về.** `git clone https://github.com/AnhTuan2111/vina-me.git ~/vina-me`; đã có thư mục đó thì
   `git -C ~/vina-me pull`. Script tự giữ một bản riêng để cập nhật, nên thư mục này chỉ cần cho lần cài.
3. **GitHub.** Đăng nhập GitHub để lưu bộ nhớ lên repo riêng và để gửi góp ý thành issue. Chạy `gh auth status`. Chưa có `gh`
   thì cài (`winget install GitHub.cli`, `brew install gh`). Chưa đăng nhập thì chạy
   `gh auth login --hostname github.com --git-protocol https --web` ở chế độ chạy nền: lệnh in một mã tám ký tự rồi đứng chờ.
   Đưa người dùng mã đó và link `https://github.com/login/device`, bảo họ mở link, đăng nhập GitHub, nhập mã, bấm cho phép.
   Lệnh tự xong khi họ cho phép; kiểm lại bằng `gh auth status`. Người dùng không có tài khoản GitHub thì bỏ bước này và trả
   lời `n` ở câu GitHub.
4. **Tám câu hỏi.** Hỏi người dùng tám câu ở trên ngay trong chat, gộp vào một tin, câu nào cũng kèm gợi ý như script hỏi.
   Câu nào người dùng bỏ trống thì để trống.
5. **Chạy script.** Ghi câu trả lời vào một tệp JSON tạm, các khoá là `name`, `role`, `writesFor`, `length` (`1` ngắn, `2` vừa,
   `3` đủ chi tiết), `avoid`, `teamRules` (đường dẫn tệp luật của đội), `learnFromSessions` và `github` (`y` hoặc `n`). Tuỳ
   chọn: `repo` (tên repo, mặc định `agent-memory`), `remote` (url git), `pullFromGithub` (`y`/`n`, khi đã có repo từ máy
   khác). Chạy `node ~/vina-me/scripts/setup.mjs --answers <tệp JSON>`, rồi xoá tệp tạm.
   Trên Windows còn một cách: chạy `node ~/vina-me/scripts/setup.mjs` không kèm `--answers`, script tự mở cửa sổ PowerShell
   riêng cho người dùng trả lời rồi chờ cửa sổ đóng. Báo người dùng trước là sắp có cửa sổ hiện lên; khi đó bỏ bước 4.
6. **Kiểm và báo.** Chạy `node ~/vina-me/scripts/setup.mjs check`. Báo người dùng: bộ nhớ nằm ở đâu, có repo chưa, đã nối vào
   agent nào, và phải mở phiên mới thì agent mới đọc skill và bộ nhớ.

Cần xem script nhận lệnh con và option nào thì chạy `node ~/vina-me/scripts/setup.mjs --help`.

Máy không có Node thì dựng tay: chép ba tệp trong `memory-template/` vào `~/agent-memory/` (đổi `AGENTS.template.md` thành
`AGENTS.md`, thay `{{DATE}}` bằng ngày hôm nay), viết `user.md` từ câu trả lời và `machine.md` theo bảng trên, rồi thêm dòng
`@~/agent-memory/AGENTS.md` vào `~/.claude/CLAUDE.md` hoặc chép nội dung vào `~/.codex/AGENTS.md`.

Người dùng không muốn có bộ nhớ thì tạo tệp rỗng `~/agent-memory/.disabled` để lần sau khỏi hỏi.

## Việc sau khi cài

- Sau khi cài, `<setup>` chỉ chạy kèm một lệnh con đã ghi trong tài liệu này hay `machine.md` (`check`, `save`, `sync`,
  `conflict`, `resolve`...). Chạy trơn không kèm lệnh con là cài lại từ đầu: chép skill, sửa `CLAUDE.md`, thêm hook vào
  `settings.json` và tạo lịch tự lưu. Xem lệnh con và option bằng `--help`; option lạ thì script báo lỗi và dừng, không cài gì. Chạy
  với `--home` giả thì script không tạo task trong Task Scheduler thật (trừ khi thêm `--real-schedule`). Lỡ cài lại khi người
  dùng không nhờ thì nói ngay ở câu đầu, gỡ theo gạch "Gỡ" dưới đây (tìm tên task bằng
  `schtasks /Query /FO LIST | findstr /I vina`), rồi kiểm lại đã hết.
- `sync` báo "không gộp được": máy khác đã sửa cùng chỗ. Bản trên máy vẫn còn, chưa đẩy. Agent chạy `<setup> conflict` để
  in phần khác nhau, hỏi người dùng giữ bản nào, rồi `<setup> resolve mine` (giữ bản máy này ở chỗ đụng nhau, phần không
  đụng vẫn gộp bản trên repo) hoặc `<setup> resolve theirs` (lấy bản trên repo; bản cũ của máy này sao lưu ở
  `~/.config/vina-me/conflict-backup-<số>`). Không ép đẩy.
- Soát bộ nhớ: `<setup> check` báo khi `user.md` cộng `memory.md` quá 200 dòng, khi hai gạch đầu dòng gần trùng, và khi
  một dòng có lời trích mà thiếu ngày. Lệnh chỉ báo, không tự sửa. Nó coi mọi chữ từ 8 ký tự trong ngoặc kép là lời trích,
  nên tên cột, tên nút, tên mục trong ngoặc kép cũng bị báo: đó là báo nhầm, để yên dòng đó và nói với người dùng vì sao. Lời
  người dùng thật mà không phiên nào cho biết ngày thì hỏi người dùng, hoặc để nguyên và nói là chưa có ngày; không điền ngày
  dựng bộ nhớ hay ngày hôm nay vào cho hết báo. Lệnh chỉ đọc dòng đầu của mỗi gạch đầu dòng, nên viết mỗi gạch đầu dòng liền
  trên một dòng, đừng gập ngày xuống dòng sau.
- Mất mạng: các lượt kéo, đẩy chờ tối đa 15 giây rồi bỏ qua; đầu phiên agent chỉ thấy một dòng báo, lần sync sau thử lại.
  vina-me được kiểm bản mới tối đa 6 giờ một lần; muốn kiểm ngay thì `<setup> update`.
- Đội đổi luật chung: `<setup> team <tệp luật>`. Lần `sync` sau sẽ lưu lên repo.
- Mật khẩu lưu bằng `secrets.mjs` không theo repo: mã hoá bằng tài khoản của từng máy, nên máy mới phải lưu lại.
- Gỡ:
  - xoá dòng `@~/agent-memory/AGENTS.md` trong `CLAUDE.md`, hai hook có `setup.mjs` và hook có `remind.mjs` trong
    `settings.json`;
  - xoá khối giữa hai dòng đánh dấu trong `~/.codex/AGENTS.md`;
  - Windows: xoá `vina-me-sync.vbs` trong thư mục Startup, chạy `schtasks /Delete /TN "vina-me sync" /F` (cài với `--home`
    thì Startup là `<home>/Startup` và task tên "vina-me sync test <tên thư mục home>"); macOS, Linux: xoá hai dòng có
    `# vina-me sync` trong crontab;
  - hoặc chép lại các bản `.vina-me-backup`; rồi xoá `~/agent-memory/` và `~/.config/vina-me/` nếu không cần nữa. Repo trên
    GitHub thì xoá trên GitHub.

## Học từ phiên cũ

Bộ nhớ dựng từ tám câu hỏi thì còn mỏng. Phần dày lên được là những gì người dùng đã sửa, đã khen, đã kể về mình trong các
phiên trước. Agent làm việc này một lần, khi người dùng đồng ý (tệp `~/agent-memory/.pending-learn` là dấu đã đồng ý):

1. Nói với người dùng trước khi làm: các đợt rút ra nằm trên máy, nhưng khi agent đọc chúng thì nội dung được gửi lên nhà
   cung cấp mô hình thêm một lần. Hỏi dự án nào cần bỏ ra; người dùng đổi ý thì dừng. Người dùng đã tự nói cả hai điều trong
   lời nhờ thì làm luôn, không hỏi lại.
2. Chạy `node <thư mục skill>/scripts/learn-from-sessions.mjs`. Script đọc các phiên Claude Code (`~/.claude/projects`,
   `$CLAUDE_CONFIG_DIR/projects`) và Codex (`~/.codex/sessions`), lấy tin người dùng tự gõ, che mật khẩu và token trông
   thấy được, rồi ghi ra thư mục tạm: `overview.md` và các đợt `batch-01.md`, `batch-02.md`… mỗi đợt khoảng 60.000 ký tự.
   Dưới mỗi tin có tối đa ba dòng tóm gọn lượt đó của agent: `agent nghĩ` (đoạn đầu phần suy nghĩ, chỉ có khi phiên có
   ghi), `agent trả lời` (đoạn đầu câu trả lời cuối), `skill` (skill agent đã gọi). `overview.md` có bảng skill dùng nhiều.
   Chỉ muốn lời người dùng thì thêm `--user-only`.
   Chỉ muốn từ một ngày thì thêm `--since 2026-09-01`. Chỉ lấy vài dự án thì `--only <chữ trong đường dẫn>`, bỏ dự án
   thì `--exclude <chữ trong đường dẫn>`; hai option lặp lại được. Bỏ dự án ngay ở option, đừng rút hết rồi lọc tay, vì đọc đợt là đã
   gửi lên nhà cung cấp mô hình. Script báo số chỗ đã che và số phiên đã bỏ theo từng nguồn (Claude Code, Codex).
   `machine.md` ghi `<setup>` kèm `--home` thì truyền đúng `--home` đó cho script; không có `--home` mà máy có biến
   `CLAUDE_CONFIG_DIR`, `CODEX_HOME` thì script đọc cả hai thư mục ấy. `--out` chọn thư mục ra; script chỉ xoá
   `overview.md`, `batch-*.md` cũ trong đó, tệp khác để nguyên. Option xem ở `--help` (chỉ in cách dùng, không rút gì), đừng chạy
   thử với option đoán; lần chạy nào cũng kèm `--home` (nếu `machine.md` có) và mọi `--exclude` người dùng đã nói. Gõ sai option thì
   script báo lỗi và không rút gì. `--help` chỉ có ở script này: `<setup>` không có nó, và gõ `<setup> --help` là cài lại cả
   bộ lên máy (gạch đầu của mục "Việc sau khi cài").
3. Đọc `overview.md`, rồi từng đợt theo thứ tự. Sau mỗi đợt, ghi các ý tìm được vào một tệp nháp trong cùng thư mục tạm,
   không ghi thẳng vào bộ nhớ. Tìm năm loại:
   - người dùng sửa cách làm: "đừng", "sao lại", "không phải thế", "lần sau", "tôi bảo rồi";
   - người dùng khen hay nhận một cách làm: "hay đấy", "đúng rồi", "cứ thế";
   - người dùng kể về mình: vai trò, việc đang làm, người đọc văn bản của họ, cách họ muốn được trả lời;
   - điều người dùng nhắc đi nhắc lại ở nhiều phiên. Nhắc càng nhiều lần thì càng chắc là luật;
   - skill người dùng hay cần, xem ở bảng trong `overview.md`, kèm loại việc họ hay nhờ skill đó. Ý này là điều quan sát
     được, không phải lời người dùng, nên ghi vào `user.md` như một thói quen kèm số lượt và khoảng ngày, không viết thành
     luật "thì dùng skill X" và không có lời trích, ví dụ: "Hay nhờ skill docx soạn biên bản họp, công văn (4 lượt, 02/09 tới
     28/10/2026)." `AGENTS.md` đã có luật dùng skill đó (như vina-me ở mục Viết tiếng Việt) thì chỉ ghi loại việc hay nhờ,
     đừng viết lại luật.

   Dòng của agent chỉ để hiểu tin người dùng: câu "không phải thế" ngay sau dòng `agent trả lời` cho biết agent đã làm sai
   điều gì, và luật ghi vào bộ nhớ là điều người dùng muốn thay vào. Không chép suy nghĩ hay câu trả lời của agent vào bộ nhớ.
4. Bỏ: việc chỉ đúng trong một dự án, chi tiết của một lần làm, chuyện riêng tư, thông tin khách hàng, và mọi thứ trông
   giống mật khẩu dù script đã che hay chưa. Bộ lọc của script dựa trên mẫu chữ nên có lúc sót (mật khẩu viết liền trong câu
   kể). Thấy một mật khẩu chưa che trong đợt thì không chép giá trị của nó ra bất cứ chữ nào mình viết: nháp, câu trả lời,
   ghi chú công việc, nhật ký lệnh, báo lỗi script, bản góp ý về skill, cả lệnh tìm như `grep "<giá trị>"`. Cần tả chỗ bộ lọc
   sót thì tả mẫu câu với chỗ giữ chỗ, ví dụ "mật khẩu VPN công ty là <giá trị>", vì người sửa bộ lọc chỉ cần mẫu câu; ghi
   chú và báo lỗi là thứ dễ được chép tiếp sang issue công khai nhất. Đọc xong mọi đợt thì xoá ngay các tệp
   `batch-*.md` (nháp nằm ở tệp riêng nên còn), rồi báo người dùng: bộ lọc sót mật khẩu gì (gọi bằng tên, không ghi giá trị),
   tệp đợt chứa nó đã xoá, và nên đổi mật khẩu vì nó vẫn nằm trong lịch sử phiên và đã gửi lên nhà cung cấp mô hình. Trước
   khi báo xong, soát mọi tệp mình đã viết trong việc này xem còn giá trị đó không, tìm bằng chữ đứng trước nó ("mật khẩu")
   chứ đừng gõ giá trị vào lệnh. Script đã che hết thì vẫn phải khuyên đổi: chỗ che chỉ ẩn trong đợt, còn giá trị vẫn nằm
   trong lịch sử phiên và đã gửi lên nhà cung cấp mô hình từ lúc dán. Nên câu báo gọi tên từng thứ đã che (xem chữ đứng trước
   `[ĐÃ ẨN]` trong đợt) và khuyên đổi từng thứ còn dùng được; thứ nào thấy không cần đổi thì nói lý do trong cùng câu. Chỉ nói
   "đã che 2 chỗ, không thấy gì lọt" là thiếu.
5. Gộp các ý trùng, kể cả với dòng đang có trong bộ nhớ: ý mới cùng việc với một dòng cũ thì đề xuất sửa dòng đó, không thêm
   dòng gần trùng. Gộp hai lời nói cùng một luật thì dòng luật lấy chữ rộng nhất trong các lời đó, không thu hẹp về những
   lần đã xảy ra. Ví dụ hai lời "đừng tự xoá nhánh" và "xoá cái gì cũng phải hỏi mình trước" thì luật là "Xoá bất cứ thứ gì
   (nhánh, tệp, bản ghi) thì hỏi người dùng trước", lần xoá nhánh chỉ là ví dụ trong ngoặc; lời có chữ chung như "cái gì",
   "bất cứ", "gửi", "đẩy" thì giữ chữ đó, đừng đổi thành tên mấy lần đã xảy ra. Hai ý ngược nhau thì giữ ý mới hơn và ghi
   ngay trong dòng nháp là đã đổi, trích cả lời cũ kèm ngày; bộ nhớ đang có dòng theo ý cũ thì đề xuất thay dòng đó. Dòng
   dựng từ tám câu hỏi lúc cài chỉ mang ngày dựng, nên có khi trùng ngày với lời trong phiên cũ; khi đó lời có "từ giờ", "từ
   nay", "lần sau" là lời đổi điều đang có, nên coi nó là ý mới và đề xuất thay dòng mà không hỏi lại điều người dùng đã nói
   rõ. Không đoán được lời nào sau thì mới hỏi, và câu hỏi phải tự đứng được: chép nguyên dòng đang có kèm tên tệp, nói lời
   kia nằm ở phiên nào (agent, ngày, giờ ghi trong đợt), và dòng nháp không ghi "đổi từ" khi chính mình còn đang hỏi. Ví dụ:
   "Dòng `- So sánh thì kẻ bảng.` trong `memory.md` có từ lúc cài bộ nhớ ngày 03/11/2026, còn phiên Codex 15:40 cùng ngày
   bạn dặn "từ giờ so sánh thì viết thành đoạn". Mình đã để dòng thay trong nháp; nếu dòng cũ mới là ý sau cùng thì bạn bỏ ý
   đó đi." Ý về sau này ("từ tháng sau", "sắp chuyển") ghi đúng là dự định kèm mốc, không ghi như đã xảy ra. Xếp từng ý vào
   `user.md` hay `memory.md` theo bảng trong `AGENTS.md`; luật về một loại tài liệu không gắn làm lý do cho dòng về cách trả
   lời trong chat, dù cùng một chữ.
6. Đưa người dùng bản nháp ngay trong câu trả lời, chia hai phần theo tệp (`user.md`, `memory.md`). Mỗi ý viết đúng
   dòng sẽ ghi vào tệp: luật, rồi lý do, lời trích nguyên văn trong ngoặc kép kèm ngày; ý sửa một dòng cũ thì chép dòng cũ
   rồi viết dòng sau khi sửa, không chỉ ghi "thêm lý do". Dòng thay ý cũ chỉ gồm luật, lý do, lời trích mới kèm ngày, và
   "đổi từ "<lời cũ của người dùng>" (ngày)". Dòng bộ nhớ cũ do lượt cài dựng không phải lời người dùng, nên đừng đặt nó
   trong ngoặc kép kèm ngày như một lời trích; nó đã hiện ở câu dẫn "thay dòng `...` bằng:". Lý lẽ mình dùng để chọn lời
   nào mới hơn (lời mới có "từ giờ", cùng ngày dựng bộ nhớ) không vào dòng bộ nhớ, vì agent đọc bộ nhớ lần sau không cần
   nó; cần nói thì viết thành một mệnh đề trong câu dẫn, ví dụ "Mục Cách trả lời, thay dòng `- Trả lời dài.` (dòng dựng lúc
   cài, cùng ngày với lời "từ giờ ..." nên mình coi lời đó là ý sau) bằng:", đừng viết thành đoạn riêng dưới nháp. Các dòng
   thêm vào cùng một mục thì gom dưới một câu dẫn ("Mục Là ai, thêm ba dòng:"), đừng mở hai câu dẫn cho cùng một mục. Ý
   về vai trò, kinh nghiệm, người đọc văn bản cũng cần lời trích: dòng kể lại lời người dùng ("làm kế toán được hai năm") vẫn kèm lời trích trong ngoặc kép và ngày, đừng chỉ kể lại bằng lời mình. Dòng nháp gọi
   người dùng bằng tên như trong `user.md` (hay "người dùng"), không "bạn", vì "bạn" trong tệp bộ nhớ sẽ trỏ tới agent đang
   đọc. Người dùng duyệt, sửa, bỏ từng ý.

   Ngoài nháp chỉ nói điều người dùng cần biết hay cần làm: bí mật bị lọt, câu hỏi cần trả lời, điều đã ghi ngay, kết quả
   `<setup> check`. Không liệt kê lại các ý đã bỏ, nhất là chuyện riêng. Con số đã kiểm (số phiên, số tin, số chỗ đã che, số
   phiên đã bỏ ở từng nguồn) lấy đúng như script in ra, không đoán thêm. Kể đủ việc còn lại sau khi duyệt: ghi vào bộ nhớ,
   chạy `<setup> save`, xoá thư mục tạm và tệp `.pending-learn`. Có lần chạy lỡ rút dự án người dùng dặn bỏ thì nói ngay ở
   câu đầu, đừng mở bằng câu khẳng định đã bỏ từ đầu. Đừng dựng vế "chứ không ..." để bác một điều chưa ai nói ("dòng này
   đi ngược dòng cũ chứ không bổ sung cho nó"); điều đã kiểm thì nói cách kiểm (đọc hết đợt, chạy lệnh gì), đừng nối nó bằng
   "nên" vào một việc khác, vì người đọc sẽ hiểu thành suy luận.

   Phần lời ngoài nháp viết liền thành câu thường, như nói với người ngồi cạnh: không in đậm nhãn đầu đoạn, không mở đoạn
   hay câu bằng khuôn "Nhãn: nội dung" ("Script báo: ...", "Đã dọn bộ nhớ: ...", "Kết quả `check`: ..."), nối ý bằng vì,
   nên, nếu... thì. Khối nháp được có tiêu đề, phần lời quanh nó thì không. Con số của script viết vào câu chứ không chép
   dòng stdout. Trong câu trả lời "mình" chỉ trỏ agent; kể lại hay hỏi về lời người dùng thì gọi họ là "bạn", dù trong lời
   trích họ xưng "mình". Bỏ "đúng" khi nó chỉ để nhấn ("đã có dòng nói điều đó", không "nói đúng điều đó"). Ví dụ:
   - thay "**Có một mật khẩu lọt.** Mật khẩu VPN bạn dán hôm 04/09 không bị che." bằng "Bộ lọc của script sót mật khẩu VPN
     bạn dán hôm 04/09, nên mình đã xoá tệp đợt chứa nó; bạn đổi mật khẩu đó đi, vì nó vẫn nằm trong lịch sử phiên.";
   - thay "Script báo: 6 phiên, 40 tin, bỏ 2 phiên Claude Code và 0 phiên Codex." bằng "Script đọc 6 phiên với 40 tin, bỏ 2
     phiên Claude Code của dự án đó, còn Codex không có phiên nào của nó.";
   - thay "Kết quả `check` sau khi sửa: 22 dòng, không trùng." bằng "Chạy lại `check` thì không còn dòng nào trùng, chỉ còn
     ...";
   - thay "Script che 2 chỗ là mật khẩu VPN và token GitLab, mình đọc hết đợt thì không thấy gì lọt." bằng "Script che 2
     chỗ là mật khẩu VPN và token GitLab bạn từng dán, mình đọc hết đợt thì không thấy gì lọt. Hai thứ đó vẫn nằm trong
     lịch sử phiên, nên bạn đổi cả hai đi nếu còn dùng.";
   - thay "bạn nhớ mình nói hôm nào thì báo để mình điền" bằng "bạn nhớ hôm nào bạn nói câu đó thì báo để mình điền".
7. Ghi các ý đã duyệt theo luật ở `AGENTS.md`, chạy `<setup> save "học từ phiên cũ"`, xoá thư mục tạm và tệp
   `.pending-learn`. Bộ nhớ chưa có repo vẫn chạy `save`, vì lệnh đó còn chép bộ nhớ sang Codex.

Lời nhờ học từ phiên cũ có kèm một điều người dùng dặn thẳng ("nhớ giúp cái này") thì điều dặn thẳng ghi ngay theo
`AGENTS.md` và báo một dòng; chỉ các ý rút từ phiên cũ mới chờ duyệt. Lời nhờ dọn bộ nhớ (dòng trùng, dòng sai) cũng thế:
chỗ thấy được ngay trong bộ nhớ thì dọn luôn và báo; chỗ chỉ biết là sai nhờ đọc phiên cũ thì đưa vào nháp. Dọn mà một
mục thành trống thì giữ tiêu đề mục đó, vì nháp hay lần ghi sau sẽ thêm dòng vào; đừng bỏ mục rồi lại đề xuất dựng lại nó.
Điều ghi ngay không cần chạy `save` riêng: `sync` tự lưu, và bước 7 chạy `save` sau khi ghi các ý đã duyệt.

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
  gọi tên từng mật khẩu, token đã dán và khuyên đổi từng thứ còn dùng được; thứ nào không cần đổi thì nói vì sao.
- Agent không in, không echo, không ghi mật khẩu ra tệp. Lệnh con tự in mật khẩu (như `env`, `set -x`) cũng là lộ.

Phạm vi bảo vệ:

- Chặn được: mật khẩu gõ vào cửa sổ riêng thì không vào chat, không vào lịch sử phiên, không bị gửi lên nhà cung cấp mô hình;
  tệp bí mật chép sang máy khác hay tài khoản Windows khác thì không giải mã được.
- Không chặn được: chương trình nào chạy bằng tài khoản của bạn cũng giải mã được, kể cả agent. Agent chỉ cần
  `secrets.mjs run <tên> -- node -e "console.log(process.env)"` là thấy mật khẩu, và chữ in ra đó sẽ vào lịch sử phiên. Mật
  khẩu đã dán vào chat thì đã nằm trong lịch sử, lưu lại không xoá được bản đó.
- Vì vậy: dùng token có phạm vi hẹp và hạn dùng ngắn thay cho mật khẩu chính khi được; để agent hỏi trước khi chạy lệnh nếu
  không muốn nó tự dùng bí mật.
