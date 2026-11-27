#!/usr/bin/env node
// Bản cũ cài mọi thứ trong một lệnh. Từ bản 0.28.0, mỗi việc một script, cần việc nào thì chạy script đó:
//
//   node scripts/install-skill.mjs      chép skill vào Claude Code, Codex, omp (việc duy nhất ai cũng cần)
//   node scripts/install-remind.mjs     nhắc agent dùng vina-me ở mỗi tin (Claude Code, omp)
//   node scripts/install-memory.mjs     bộ nhớ dùng chung ở ~/agent-memory
//   node scripts/install-autosave.mjs   tự lưu bộ nhớ lên repo khi mở, đóng phiên Claude Code (--schedule thêm lịch của máy)
//   node scripts/install-update.mjs     tự cập nhật vina-me lên bản phát hành mới
//
// Tệp này chỉ còn để máy đã cài bản cũ chạy tiếp: hook và lịch tự lưu gọi "setup.mjs sync", lời dặn trong bộ nhớ cũ gọi
// "setup.mjs check|save|conflict|resolve|...". Lệnh bộ nhớ chuyển sang memory.mjs; sync còn chạy kiểm tra bản mới như bản
// cũ; update, channel chuyển sang update.mjs. Chạy không có lệnh con thì chỉ in danh sách trên, không cài gì.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const MEMORY = ['sync', 'save', 'check', 'conflict', 'resolve', 'team', 'codex', 'github', 'remote'];
const UPDATE = ['update', 'channel'];
// Lệnh con đứng ở đâu cũng được (hook cũ ghi "--home <thư mục> sync"), miễn không phải giá trị của --home.
const sub = args.find((a, i) => (MEMORY.includes(a) || UPDATE.includes(a)) && args[i - 1] !== '--home');

const runScript = (name, argv) => spawnSync(process.execPath, [path.join(here, name), ...argv], { stdio: 'inherit' }).status ?? 1;

if (!sub) {
  const lines = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').replace(/\r\n/g, '\n').split('\n').slice(1);
  const head = [];
  for (const l of lines) { if (!l.startsWith('//')) break; head.push(l.replace(/^\/\/ ?/, '')); }
  console.log(head.join('\n'));
  process.exit(0);
}
if (sub === 'update') process.exit(runScript('update.mjs', args.filter((a) => a !== 'update')));
if (sub === 'channel') process.exit(runScript('update.mjs', args));
if (sub === 'sync') {
  // Bản cũ: sync vừa lưu bộ nhớ vừa kiểm tra bản mới của vina-me. update.mjs --quiet im lặng khi máy chưa cài tự cập nhật.
  const home = args.includes('--home') ? ['--home', args[args.indexOf('--home') + 1]] : [];
  runScript('update.mjs', [...home, '--quiet']);
  process.exit(runScript('memory.mjs', args));
}
process.exit(runScript('memory.mjs', args));
