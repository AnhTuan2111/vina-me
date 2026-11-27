#!/usr/bin/env node
// Chép skill vina-me vào thư mục skill của từng agent có trên máy: Claude Code (~/.claude/skills), Codex và omp
// (~/.agents/skills), Codex bản cũ (~/.codex/skills). Chạy lại bất cứ lúc nào để chép bản đang có đè lên bản đã cài.
//
//   node scripts/install-skill.mjs                    tự nhận agent có trên máy
//   node scripts/install-skill.mjs --claude --omp     cài cho agent đó dù chưa thấy thư mục cấu hình của nó
//
// Option: --home <thư mục> để thử trên home giả, --codex cho Codex.

import path from 'node:path';
import { handleHelpAndFlags, home, skillSrc, skillTargets, log } from './lib/context.mjs';
import { copySkill, readConfig, writeConfig } from './lib/update.mjs';

handleHelpAndFlags(import.meta.url);

const targets = skillTargets();
if (!targets.length) {
  console.error('Không thấy Claude Code, Codex hay omp trên máy này (chưa có ~/.claude, ~/.codex, ~/.omp).');
  console.error('Cài agent trước, hoặc chỉ định agent bằng --claude, --codex, --omp.');
  process.exit(1);
}
log(`Cài skill vina-me cho ${home}`);
for (const t of targets) {
  if (path.resolve(t) === path.resolve(skillSrc)) { log(`  ${t} chính là thư mục đang chạy, bỏ qua`); continue; }
  copySkill(t);
  log(`  chép skill vào ${t}`);
}
// Máy đã cài tự cập nhật thì thêm thư mục mới vào danh sách để lần cập nhật sau chép sang cả nó.
const cfg = readConfig();
if (cfg.source) writeConfig({ ...cfg, targets: [...new Set([...(cfg.targets ?? []), ...targets])] });
log('\nXong. Mở một phiên agent mới để nó nạp skill.');
log('Việc tuỳ chọn, cần thì chạy thêm:');
log('  node scripts/install-remind.mjs   nhắc agent dùng vina-me ở mỗi tin (Claude Code, omp)');
log('  node scripts/install-memory.mjs   bộ nhớ dùng chung cho các agent');
log('  node scripts/install-update.mjs   tự cập nhật vina-me lên bản phát hành mới');
