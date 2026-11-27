#!/usr/bin/env node
// Tự lưu bộ nhớ lên repo: Claude Code chạy "memory.mjs sync" khi mở phiên (chữ in ra vào ngữ cảnh, gồm phần bộ nhớ vừa sửa
// ở máy khác) và khi đóng phiên. Codex, omp chưa có hook đầu phiên; machine.md dặn chúng tự chạy sync ở đầu phiên.
//
//   node scripts/install-autosave.mjs              thêm hook vào Claude Code
//   node scripts/install-autosave.mjs --schedule   thêm cả lịch của máy: khi đăng nhập và mỗi 2 giờ (Task Scheduler trên
//                                                  Windows, crontab trên macOS và Linux)
//
// Cần dựng bộ nhớ trước (install-memory.mjs) và nên có repo cho bộ nhớ (memory.mjs github), không thì sync chỉ commit trên máy.
// Option: --home <thư mục> để thử trên home giả, --claude để thêm hook dù chưa thấy ~/.claude.

import path from 'node:path';
import { handleHelpAndFlags, hasFlag, home, memDir, skillHome, skillSrc, exists, log, useClaude, hasUpstream } from './lib/context.mjs';
import { installClaudeHooks, installSchedule, syncCodex } from './lib/agents.mjs';
import { writeMachineFile } from './lib/memory.mjs';
import { readConfig, writeConfig } from './lib/update.mjs';

handleHelpAndFlags(import.meta.url, ['--schedule', '--real-schedule']);

if (!exists(path.join(memDir, 'AGENTS.md'))) {
  console.error(`Chưa có bộ nhớ ở ${memDir}. Chạy node scripts/install-memory.mjs trước.`);
  process.exit(1);
}
if (skillHome === skillSrc) {
  console.error('Chưa cài skill cho agent nào, nên hook không có bản skill cố định để trỏ tới. Chạy node scripts/install-skill.mjs trước.');
  process.exit(1);
}
const schedule = hasFlag('--schedule');
if (!useClaude && !schedule) {
  console.error('Không thấy Claude Code, nên không có hook nào để thêm. Dùng --schedule để máy tự lưu theo lịch.');
  process.exit(1);
}
log(`Cài tự lưu bộ nhớ cho ${home}`);
if (!hasUpstream()) log('  bộ nhớ chưa có repo: sync chỉ commit trên máy. Đưa lên repo bằng: node scripts/memory.mjs github');
if (useClaude && installClaudeHooks(['SessionStart', 'SessionEnd']) === null) process.exitCode = 1;
if (schedule) installSchedule();
const cfg = readConfig();
writeConfig({ ...cfg, autosave: useClaude || cfg.autosave === true, schedule: schedule || cfg.schedule === true });
writeMachineFile();
syncCodex(); // bản chép trong AGENTS.md của Codex có cả machine.md, nên chép lại sau khi machine.md đổi
log('\nXong. Hook có hiệu lực từ phiên Claude Code mở sau.');
