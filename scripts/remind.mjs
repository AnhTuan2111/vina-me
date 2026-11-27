#!/usr/bin/env node
// Hook UserPromptSubmit của Claude Code chạy script này mỗi lần người dùng gửi một tin; chữ in ra được chèn vào ngữ cảnh
// của lượt đó. Nội dung SKILL.md chỉ nạp một lần lúc gọi skill, phiên dài thì bị tóm gọn, và agent có thể quên áp nó cho
// câu trả lời ngắn; dòng nhắc này nhắc lại ở mọi lượt. install-remind.mjs cài hook này.
import { VINA_ME_CLAUDE } from './lib/remind-text.mjs';

console.log(VINA_ME_CLAUDE);
