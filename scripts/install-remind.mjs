#!/usr/bin/env node
// Gắn lời nhắc dùng vina-me vào mỗi tin người dùng gửi, để agent không viết theo trí nhớ từ lượt thứ hai trở đi.
// Claude Code: hook UserPromptSubmit trong settings.json chạy scripts/remind.mjs của bản skill đã cài.
// omp: extension ~/.omp/agent/extensions/vina-me-remind.ts. Codex chưa có chỗ gắn, script báo và bỏ qua.
// Cài skill trước (install-skill.mjs), vì hook trỏ tới bản skill đã cài. Chạy lại không thêm trùng.
//
//   node scripts/install-remind.mjs
//
// Option: --home <thư mục> để thử trên home giả, --claude, --omp để cài dù chưa thấy thư mục cấu hình của agent đó.

import { handleHelpAndFlags, home, skillHome, skillSrc, useClaude, useCodex, useOmp, log } from './lib/context.mjs';
import { installClaudeHooks, installOmpExtension } from './lib/agents.mjs';
import { VINA_ME_OMP } from './lib/remind-text.mjs';

handleHelpAndFlags(import.meta.url);

if (useClaude && skillHome === skillSrc) {
  console.error('Chưa cài skill cho Claude Code. Chạy node scripts/install-skill.mjs trước, rồi chạy lại script này.');
  process.exit(1);
}
if (!useClaude && !useOmp) {
  console.error('Không thấy Claude Code hay omp trên máy này; lời nhắc chỉ gắn được vào hai agent đó.');
  process.exit(1);
}
log(`Gắn lời nhắc dùng vina-me cho ${home}`);
if (useClaude && installClaudeHooks(['UserPromptSubmit']) === null) process.exitCode = 1;
if (useOmp) installOmpExtension('vina-me-remind', VINA_ME_OMP);
if (useCodex) log('  Codex: chưa có chỗ gắn lời nhắc ở mỗi tin, bỏ qua');
log('\nXong. Lời nhắc có hiệu lực từ phiên agent mở sau.');
