// Chữ của các lời nhắc chèn vào mỗi lượt. Claude Code nhận qua hook UserPromptSubmit (scripts/remind.mjs in ra), omp nhận
// qua extension do install-remind.mjs và install-memory.mjs ghi vào ~/.omp/agent/extensions. SKILL.md và bộ nhớ chỉ được
// đọc ở lượt đầu, nên từ lượt hai agent hay viết theo trí nhớ và quên ghi bộ nhớ; lời nhắc nhắc lại ở mọi lượt.

const VINA_ME_CLAUDE = 'Luật cứng của skill vina-me: mọi thứ có tiếng Việt viết ở lượt này, kể cả câu chat vài chữ, tệp, chú thích, commit, '
  + 'issue, PR, đều phải theo vina-me. Lượt này chưa gọi skill thì gọi vina-me bằng công cụ Skill trước khi viết, không viết '
  + 'theo trí nhớ về luật; soát lại trước khi gửi.';

const VINA_ME_OMP = 'Luật cứng của skill vina-me: mọi thứ có tiếng Việt viết ở lượt này, kể cả câu chat vài chữ, tệp, chú thích, commit, '
  + 'issue, PR, đều phải theo vina-me. Lượt này chưa đọc skill thì đọc `skill://vina-me` và tệp trong `references/` hợp loại việc '
  + 'trước khi viết, không viết theo trí nhớ về luật; soát lại trước khi gửi.';

// memoryEntry: đường dẫn AGENTS.md của bộ nhớ, ghi theo kiểu người dùng đọc được (~/agent-memory/AGENTS.md).
const memoryReminder = (memoryEntry) => 'Bộ nhớ dùng chung: phiên này chưa đọc '
  + `\`${memoryEntry}\` và các tệp nó chỉ tới thì đọc trước. Người dùng sửa cách làm, dặn "nhớ", "lần sau", "từ giờ", hay đưa `
  + 'thông tin mới về dự án, máy, tài khoản thì ghi vào bộ nhớ ngay trong lượt này theo luật ghi nhớ trong tệp đó, rồi báo '
  + 'người dùng một dòng đã ghi gì, vào tệp nào. Không tự thêm hay đổi remote của repo bộ nhớ, không nói đã lưu lên repo khi '
  + 'lệnh lưu chưa chạy được.';

export { VINA_ME_CLAUDE, VINA_ME_OMP, memoryReminder };
