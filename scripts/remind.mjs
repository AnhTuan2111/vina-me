#!/usr/bin/env node
// Hook UserPromptSubmit của Claude Code chạy script này mỗi lần người dùng gửi một tin; chữ in ra được chèn vào ngữ cảnh
// của lượt đó. Nội dung SKILL.md chỉ nạp một lần lúc gọi skill, phiên dài thì bị tóm gọn, và agent có thể quên áp nó cho
// câu trả lời ngắn; dòng nhắc này nhắc lại ở mọi lượt. setup.mjs cài hook (lib/agents.mjs, installClaudeHooks).
console.log('Nhắc của skill vina-me: lời trả lời bằng tiếng Việt ở lượt này, dù chỉ vài câu, và mọi chữ tiếng Việt viết vào '
  + 'tệp, issue, PR, commit đều theo vina-me (SKILL.md, mục Trả lời trong chat); soát trước khi gửi. Ngữ cảnh không còn nội '
  + 'dung SKILL.md thì gọi lại skill vina-me.');
