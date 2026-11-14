#!/usr/bin/env node
// Hook UserPromptSubmit của Claude Code chạy script này mỗi lần người dùng gửi một tin; chữ in ra được chèn vào ngữ cảnh
// của lượt đó. Nội dung SKILL.md chỉ nạp một lần lúc gọi skill, phiên dài thì bị tóm gọn, và agent có thể quên áp nó cho
// câu trả lời ngắn; dòng nhắc này nhắc lại ở mọi lượt. setup.mjs cài hook (lib/agents.mjs, installClaudeHooks).
console.log('Luật cứng của skill vina-me: mọi thứ có tiếng Việt viết ở lượt này, kể cả câu chat vài chữ, tệp, chú thích, commit, '
  + 'issue, PR, đều phải theo vina-me. Lượt này chưa gọi skill thì gọi vina-me bằng công cụ Skill trước khi viết, không viết '
  + 'theo trí nhớ về luật; soát lại trước khi gửi.');
