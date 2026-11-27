#!/usr/bin/env node
// Dựng bộ nhớ dùng chung ở ~/agent-memory và nối nó vào từng agent có trên máy: Claude Code (dòng @ trong CLAUDE.md),
// Codex (bản chép trong ~/.codex/AGENTS.md), omp (lời dặn trong ~/.omp/agent/AGENTS.md và extension nhắc ghi nhớ ở mỗi tin).
//
//   node scripts/install-memory.mjs                       hỏi bảy câu rồi dựng
//   node scripts/install-memory.mjs --answers a.json      không hỏi, lấy câu trả lời từ tệp (agent chạy thay người dùng)
//   node scripts/install-memory.mjs --github [tên repo]   dựng xong thì đưa lên repo GitHub riêng tư (cần gh đã đăng nhập)
//   node scripts/install-memory.mjs --remote <url>        như trên với một repo git đã tạo sẵn; repo đã có bộ nhớ thì kéo về
//   node scripts/install-memory.mjs --clone <url|chủ/repo> máy thứ hai: kéo bộ nhớ đã có về thay vì hỏi
//
// Bộ nhớ đã có thì giữ nguyên, chỉ nối lại vào agent. Tự lưu lên repo là việc riêng: install-autosave.mjs.
// Option: --home <thư mục> để thử trên home giả, --claude, --codex, --omp để nối dù chưa thấy thư mục cấu hình của agent.

import path from 'node:path';
import { handleHelpAndFlags, hasFlag, valueOf, home, memDir, exists, log, shown, useClaude, useCodex, useOmp, hasUpstream } from './lib/context.mjs';
import { connectRemote, cloneExisting, remoteHasCommits } from './lib/repo.mjs';
import { syncCodex, linkClaude, linkOmp, installOmpExtension } from './lib/agents.mjs';
import { getAnswers, closePrompt } from './lib/prompt.mjs';
import { buildMemory, writeMachineFile } from './lib/memory.mjs';
import { memoryReminder } from './lib/remind-text.mjs';

handleHelpAndFlags(import.meta.url, ['--answers', '--github', '--remote', '--clone']);

const url = valueOf('--remote');
const clone = valueOf('--clone');
const wantRepo = hasFlag('--github') || Boolean(url);

let hasMemory = exists(path.join(memDir, 'AGENTS.md'));
if (!hasMemory && (clone || (url && remoteHasCommits(url)))) {
  // "chủ/repo" mà không phải thư mục trên máy thì kéo bằng gh; còn lại coi là url hay đường dẫn git.
  const viaGh = clone && /^[\w.-]+\/[\w.-]+$/.test(clone) && !exists(clone);
  if (!cloneExisting(viaGh ? { full: clone } : { url: clone ?? url })) process.exit(1);
  hasMemory = true;
} else if (!hasMemory) {
  const answers = await getAnswers();
  closePrompt();
  log(`Dựng bộ nhớ cho ${home}`);
  buildMemory(answers);
} else {
  log(`Bộ nhớ ở ${memDir} đã có, giữ nguyên; nối lại vào agent`);
}

if (wantRepo && !hasUpstream()) connectRemote(url ? { url } : { repoName: valueOf('--github') ?? 'agent-memory' });
writeMachineFile();

if (useClaude) linkClaude();
if (useCodex && syncCodex()) log('  Codex: chép bộ nhớ vào AGENTS.md của Codex');
if (useOmp) {
  linkOmp();
  installOmpExtension('vina-me-memory', memoryReminder(shown(path.join(memDir, 'AGENTS.md'))));
}
if (!useClaude && !useCodex && !useOmp) {
  log('  Không thấy Claude Code, Codex hay omp. Agent khác thì trỏ tệp chỉ dẫn toàn cục của nó tới');
  log(`  ${shown(path.join(memDir, 'AGENTS.md'))}.`);
}
log('\nXong. Mở một phiên agent mới để nó đọc bộ nhớ.');
if (!hasUpstream()) log('Bộ nhớ mới nằm trên máy này. Muốn đưa lên repo riêng: node scripts/memory.mjs github');
log('Muốn tự lưu lên repo khi mở, đóng phiên: node scripts/install-autosave.mjs');
