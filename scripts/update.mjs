#!/usr/bin/env node
// Kéo vina-me bản mới (cài bằng install-update.mjs) và chép sang thư mục skill của các agent.
//
//   node scripts/update.mjs                     kiểm tra ngay, có bản mới thì cập nhật
//   node scripts/update.mjs --quiet             kiểm tra tối đa 6 giờ một lần, chỉ in khi vừa lên bản mới (hook đầu phiên dùng)
//   node scripts/update.mjs channel release|main  đổi kênh: tag phát hành mới nhất, hay đầu nhánh main
//
// Option: --home <thư mục> để thử trên home giả.

import { handleHelpAndFlags, command, commandArg, quiet } from './lib/context.mjs';
import { updateSkill, readConfig, writeConfig } from './lib/update.mjs';

handleHelpAndFlags(import.meta.url);

if (!readConfig().source) {
  if (!quiet) console.error('Máy này chưa cài tự cập nhật. Chạy node scripts/install-update.mjs trước.');
  process.exit(quiet ? 0 : 1);
}
if (command === 'channel') {
  if (!['release', 'main'].includes(commandArg)) { console.error('Dùng: update.mjs channel release|main'); process.exit(1); }
  writeConfig({ ...readConfig(), channel: commandArg, lastSkillCheck: 0 });
  console.log(`  kênh cập nhật: ${commandArg}`);
  console.log(updateSkill(true) || '  vina-me đang ở bản mới nhất của kênh này');
} else if (quiet) {
  // Hook đầu phiên: chữ in ra vào ngữ cảnh của agent, nên chỉ in khi có bản mới; lỗi mạng thì im, lần sau thử lại.
  const line = updateSkill(false);
  if (line) console.log(line);
} else {
  console.log(updateSkill(true) || '  vina-me đang là bản mới nhất');
}
