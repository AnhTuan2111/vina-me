#!/usr/bin/env node
// Lệnh hằng ngày của bộ nhớ dùng chung ở ~/agent-memory (dựng bằng install-memory.mjs). Không cài gì lên máy.
//
//   node scripts/memory.mjs sync [--quiet]        gom thay đổi chưa commit thành một commit, kéo bản mới, đẩy lên
//   node scripts/memory.mjs save "<đã ghi gì>"    commit và đẩy bộ nhớ ngay, với lời commit tự đặt
//   node scripts/memory.mjs check                 soát bộ nhớ: quá 200 dòng, ý gần trùng, lời trích thiếu ngày
//   node scripts/memory.mjs conflict              sync báo không gộp được: in phần khác nhau giữa bản máy này và bản trên repo
//   node scripts/memory.mjs resolve mine|theirs   giữ bản máy này ở chỗ đụng nhau, hoặc lấy bản trên repo (sao lưu bản cũ)
//   node scripts/memory.mjs github [tên repo]     đưa bộ nhớ lên một repo GitHub riêng tư (cần gh đã đăng nhập)
//   node scripts/memory.mjs remote <url git>      đưa bộ nhớ lên một repo git bất kỳ đã tạo sẵn
//   node scripts/memory.mjs team <tệp luật>       thay luật chung của đội trong team.md
//   node scripts/memory.mjs codex                 chép lại bộ nhớ vào ~/.codex/AGENTS.md
//
// Option: --home <thư mục> để thử trên home giả. Chạy không có lệnh con thì chỉ in cách dùng này.
// Lệnh sync không bao giờ báo lỗi bằng mã thoát: lỗi in thành chữ cho agent đọc và ghi vào ~/.config/vina-me/sync.log.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleHelpAndFlags, command, commandArg, memDir, configDir, MEMORY_FILES, exists, read, write, quiet, log, shown, selfCommand, git, isRepo, hasUpstream, firstLine, gitNet, timedOut, OFFLINE } from './lib/context.mjs';
import { connectRemote, commitPending, pull, pushIfAhead } from './lib/repo.mjs';
import { syncCodex } from './lib/agents.mjs';
import { teamMd, writeMachineFile } from './lib/memory.mjs';

// Khoá đơn giản để hook, lịch và người dùng không chạy sync chồng lên nhau; khoá cũ hơn 2 phút coi như bỏ.
function withLock(fn) {
  const lock = path.join(configDir, 'sync.lock');
  fs.mkdirSync(configDir, { recursive: true });
  try {
    if (exists(lock) && Date.now() - fs.statSync(lock).mtimeMs < 120000) return null;
    fs.writeFileSync(lock, String(process.pid));
    return fn();
  } finally {
    try { if (read(lock) === String(process.pid)) fs.rmSync(lock); } catch { /* đã có tiến trình khác dọn */ }
  }
}

function appendLog(lines) {
  if (!lines.length) return;
  const file = path.join(configDir, 'sync.log');
  const old = exists(file) ? read(file).split('\n') : [];
  const now = new Date();
  const stamp = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16).replace('T', ' ');
  write(file, [...old, ...lines.map((l) => `${stamp} ${l}`)].filter(Boolean).slice(-200).join('\n') + '\n');
}

// Trả về các dòng cần báo cho agent và các dòng ghi log.
function syncMemory() {
  const report = [];
  const logLines = [];
  if (!exists(path.join(memDir, 'AGENTS.md'))) return { report, logLines };
  try {
    const committed = commitPending();
    if (committed.length) logLines.push(`commit ${committed.join(', ')}`);
    const { changed, error, offline } = pull();
    if (offline) {
      report.push('Không kết nối được repo bộ nhớ lúc này; đang dùng bản trên máy, lần sync sau sẽ thử lại.');
      logLines.push(`pull: ${error}`);
    } else if (error) {
      report.push(`Không gộp được bộ nhớ với bản trên repo (${error}). Bản trên máy vẫn còn, chưa đẩy. Chạy \`${selfCommand} conflict\` để xem hai bản, rồi báo người dùng.`);
      logLines.push(`pull lỗi: ${error}`);
    } else {
      const pushError = pushIfAhead();
      if (pushError) { report.push(`Chưa đẩy được bộ nhớ lên repo (${pushError}); lần sync sau sẽ thử lại.`); logLines.push(`push lỗi: ${pushError}`); }
      if (changed.length) {
        logLines.push(`kéo về ${changed.join(', ')}`);
        report.push(`Bộ nhớ ở ${shown(memDir)} vừa được kéo bản mới từ repo (đã sửa ở máy khác). Dùng bản dưới đây thay cho bản đã nạp:\n`);
        for (const f of changed) if (exists(path.join(memDir, f))) report.push(`<!-- ${f} -->\n${read(path.join(memDir, f)).trim()}\n`);
      }
    }
    syncCodex();
  } catch (e) { report.push(`Lưu bộ nhớ lỗi: ${e.message}`); logLines.push(`lỗi: ${e.message}`); }
  return { report, logLines };
}

function cmdSync() {
  withLock(() => {
    const { report, logLines } = syncMemory();
    appendLog(logLines);
    if (!quiet) for (const r of report) console.log(r);
  });
}

// Soát bộ nhớ: tổng số dòng có chữ, ý gần trùng giữa các gạch đầu dòng (trong cùng tệp hay giữa user.md và memory.md),
// và lời trích trong ngoặc kép mà dòng đó không có ngày. Chỉ báo, không sửa: gộp hay xoá là việc của agent và người dùng.
function cmdCheck() {
  const files = ['user.md', 'memory.md'].filter((f) => exists(path.join(memDir, f)));
  if (!files.length) { console.error(`Chưa có bộ nhớ ở ${memDir}.`); process.exit(1); }
  const issues = [];
  const bullets = [];
  let lines = 0;
  for (const f of files) {
    read(path.join(memDir, f)).split('\n').forEach((l, i) => {
      if (l.trim()) lines++;
      if (/^\s*-\s+\S/.test(l)) bullets.push({ f, n: i + 1, text: l.replace(/^\s*-\s+/, '').trim() });
    });
  }
  if (lines > 200) issues.push(`user.md cộng memory.md có ${lines} dòng, quá mốc 200: gộp ý trùng, bỏ ý đã cũ.`);
  const words = (t) => new Set(t.toLowerCase().normalize('NFC').replace(/[^\p{L}\d\s]/gu, ' ').split(/\s+/).filter((w) => w.length > 1));
  const sets = bullets.map((b) => words(b.text));
  for (let i = 0; i < bullets.length; i++) {
    for (let j = i + 1; j < bullets.length; j++) {
      const a = sets[i], b = sets[j];
      if (a.size < 4 || b.size < 4) continue;
      const common = [...a].filter((w) => b.has(w)).length;
      if (common / Math.min(a.size, b.size) >= 0.8) {
        issues.push(`gần trùng: ${bullets[i].f}:${bullets[i].n} và ${bullets[j].f}:${bullets[j].n} ("${bullets[i].text.slice(0, 50)}…")`);
      }
    }
  }
  for (const b of bullets) {
    if (/"[^"]{8,}"/.test(b.text) && !/\d{1,2}\/\d{1,2}\/\d{4}/.test(b.text)) issues.push(`có lời trích mà thiếu ngày: ${b.f}:${b.n}`);
  }
  console.log(`${files.join(', ')}: ${lines} dòng có chữ, ${bullets.length} gạch đầu dòng.`);
  if (issues.length) for (const i of issues) console.log(`  - ${i}`);
  else console.log('  không thấy gì cần sửa');
}

// Khi sync báo không gộp được: in phần khác nhau giữa bản trên máy và bản trên repo của các tệp bộ nhớ.
function cmdConflict() {
  if (!hasUpstream()) { console.log('Bộ nhớ chưa có repo, không có gì để so.'); return; }
  const f = gitNet(memDir, 'fetch', '-q');
  if (f.status !== 0) { console.log(`Không kéo được bản trên repo: ${timedOut(f) ? OFFLINE : firstLine(f)}`); return; }
  const diff = git('diff', '@{u}', 'HEAD', '--', ...MEMORY_FILES).stdout.trim();
  if (!diff) { console.log('Bản trên máy và trên repo giống nhau ở các tệp bộ nhớ.'); return; }
  console.log('Dòng "-" là bản trên repo (máy khác vừa sửa), dòng "+" là bản trên máy này:\n');
  console.log(diff);
  console.log(`\nGiữ bản máy này ở chỗ đụng nhau: ${selfCommand} resolve mine`);
  console.log(`Lấy bản trên repo, bỏ thay đổi của máy này (sao lưu trước khi bỏ): ${selfCommand} resolve theirs`);
  console.log('Hoặc sửa tay các tệp cho đúng rồi chạy lại sync.');
}

function cmdResolve() {
  if (!['mine', 'theirs'].includes(commandArg)) { console.error('Dùng: memory.mjs resolve mine|theirs'); process.exit(1); }
  if (!hasUpstream()) { console.error('Bộ nhớ chưa có repo.'); process.exit(1); }
  commitPending();
  if (commandArg === 'theirs') {
    const f = gitNet(memDir, 'fetch', '-q');
    if (f.status !== 0) { console.error(`Không kéo được bản trên repo: ${timedOut(f) ? OFFLINE : firstLine(f)}`); process.exit(1); }
    const backup = path.join(configDir, `conflict-backup-${Date.now()}`);
    for (const name of MEMORY_FILES) if (exists(path.join(memDir, name))) { fs.mkdirSync(backup, { recursive: true }); fs.copyFileSync(path.join(memDir, name), path.join(backup, name)); }
    git('reset', '-q', '--hard', '@{u}');
    syncCodex();
    log(`  đã lấy bản trên repo; bản cũ của máy này sao lưu ở ${backup}`);
    return;
  }
  const p = pull('mine');
  if (p.error) { console.error(`Vẫn chưa gộp được: ${p.error}. Sửa tay các tệp rồi chạy lại sync.`); process.exit(1); }
  const pushError = pushIfAhead();
  if (pushError) { console.error(`Đã gộp nhưng chưa đẩy được: ${pushError}`); process.exit(1); }
  syncCodex();
  log('  đã gộp, giữ bản máy này ở chỗ đụng nhau, và đẩy lên repo');
}

function cmdSave() {
  if (!exists(path.join(memDir, 'AGENTS.md'))) { console.error(`Chưa có bộ nhớ ở ${memDir}.`); process.exit(1); }
  syncCodex();
  if (!isRepo()) { log('  bộ nhớ chưa nằm trong repo git nào, chỉ lưu trên máy này'); return; }
  const committed = commitPending(commandArg);
  if (!hasUpstream()) { log(committed.length ? '  đã commit; repo chưa có remote nên chưa đẩy đi đâu' : '  không có gì mới để lưu'); return; }
  const p = pull();
  if (p.error) { console.error(`Không gộp được với bản trên repo: ${p.error}. Bản trên máy vẫn còn, chưa đẩy.`); process.exit(1); }
  const pushError = pushIfAhead();
  if (pushError) { console.error(`Không đẩy được lên repo: ${pushError}`); process.exit(1); }
  syncCodex();
  log(committed.length ? '  đã commit và đẩy bộ nhớ lên repo' : '  không có gì mới để lưu');
}

function needMemory() {
  if (!exists(path.join(memDir, 'AGENTS.md'))) { console.error(`Chưa có bộ nhớ ở ${memDir}; chạy install-memory.mjs trước.`); process.exit(1); }
}

function printUsage() {
  const lines = fs.readFileSync(new URL(import.meta.url), 'utf8').replace(/\r\n/g, '\n').split('\n').slice(1);
  const head = [];
  for (const l of lines) { if (!l.startsWith('//')) break; head.push(l.replace(/^\/\/ ?/, '')); }
  console.log(head.join('\n'));
}

function main() {
  handleHelpAndFlags(import.meta.url);
  switch (command) {
    case 'sync': cmdSync(); return;
    case 'save': cmdSave(); return;
    case 'check': cmdCheck(); return;
    case 'conflict': cmdConflict(); return;
    case 'resolve': cmdResolve(); return;
    case 'codex': needMemory(); if (syncCodex()) log('  đã chép bộ nhớ vào AGENTS.md của Codex'); return;
    case 'team':
      if (!commandArg) { console.error('Thiếu đường dẫn tệp luật: node memory.mjs team <tệp>'); process.exit(1); }
      needMemory();
      write(path.join(memDir, 'team.md'), teamMd(commandArg));
      log('  thay luật chung của đội trong team.md; chạy save hay sync để lưu lên repo');
      syncCodex();
      return;
    case 'github':
    case 'remote':
      needMemory();
      if (command === 'remote' && !commandArg) { console.error('Thiếu url: node memory.mjs remote <url git>'); process.exit(1); }
      if (hasUpstream()) { log('  bộ nhớ đã có repo, giữ nguyên'); return; }
      if (connectRemote(command === 'remote' ? { url: commandArg } : { repoName: commandArg ?? 'agent-memory' })) writeMachineFile();
      return;
    default:
      printUsage();
  }
}

// Chỉ làm lệnh khi được chạy trực tiếp (setup.mjs của bản cũ cũng gọi qua tiến trình con), không làm gì khi bị nạp.
if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) main();

export { syncMemory, cmdSync, appendLog };
