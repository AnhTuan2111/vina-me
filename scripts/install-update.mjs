#!/usr/bin/env node
// Tự cập nhật vina-me lên bản phát hành mới nhất. Script giữ một bản clone ở ~/.config/vina-me/source; Claude Code kiểm tra
// bản mới khi mở phiên (tối đa 6 giờ một lần) rồi chép sang thư mục skill của từng agent đã cài. Agent khác thì chạy
// "node scripts/update.mjs" khi muốn lên bản mới.
//
//   node scripts/install-update.mjs                  theo tag phát hành vX.Y.Z mới nhất
//   node scripts/install-update.mjs --channel main   theo đầu nhánh main (người bảo trì thử bản đang làm)
//
// Cài skill trước (install-skill.mjs). Option: --home <thư mục> để thử trên home giả.

import path from 'node:path';
import { handleHelpAndFlags, valueOf, home, managedSource, skillTargets, exists, log, useClaude } from './lib/context.mjs';
import { ensureManagedSource, readConfig, writeConfig } from './lib/update.mjs';
import { installClaudeHooks } from './lib/agents.mjs';

handleHelpAndFlags(import.meta.url, ['--channel']);

const channel = valueOf('--channel') ?? 'release';
if (!['release', 'main'].includes(channel)) { console.error('--channel chỉ nhận release hoặc main.'); process.exit(2); }
const targets = skillTargets().filter((t) => exists(path.join(t, 'SKILL.md')));
if (!targets.length) {
  console.error('Chưa có bản skill nào đã cài để cập nhật. Chạy node scripts/install-skill.mjs trước.');
  process.exit(1);
}
log(`Cài tự cập nhật vina-me cho ${home}`);
if (!ensureManagedSource()) {
  console.error('Không giữ được bản clone vina-me (không có mạng, hoặc git không clone được). Chạy lại khi có mạng.');
  process.exit(1);
}
writeConfig({ ...readConfig(), source: managedSource, targets, channel, lastSkillCheck: 0 });
log(`  giữ bản clone ở ${managedSource}, kênh ${channel}`);
for (const t of targets) log(`  bản mới sẽ chép sang ${t}`);
if (useClaude && installClaudeHooks(['UpdateCheck']) === null) process.exitCode = 1;
log('\nXong. Muốn lên bản mới ngay: node scripts/update.mjs');
