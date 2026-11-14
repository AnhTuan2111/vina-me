#!/usr/bin/env node
// Cài vina-me cho các agent trên máy, dựng bộ nhớ dùng chung ở ~/agent-memory, và giữ cả hai luôn mới. Chạy một lần.
//
//   node scripts/setup.mjs                       hỏi vài câu rồi cài
//   node scripts/setup.mjs --answers a.json      không hỏi, lấy câu trả lời từ tệp (agent chạy thay người dùng)
//   node scripts/setup.mjs sync [--quiet]        gom thay đổi bộ nhớ chưa commit thành một commit, kéo, đẩy; cập nhật vina-me
//   node scripts/setup.mjs save "<đã ghi gì>"    commit và đẩy bộ nhớ ngay, với lời commit tự đặt
//   node scripts/setup.mjs github [tên repo]     đưa bộ nhớ đã có lên một repo GitHub riêng tư (cần gh đã đăng nhập)
//   node scripts/setup.mjs remote <url git>      như trên nhưng với một repo git bất kỳ đã tạo sẵn
//   node scripts/setup.mjs team <tệp luật>       thay luật chung của đội trong bộ nhớ
//   node scripts/setup.mjs codex                 chép lại bộ nhớ vào ~/.codex/AGENTS.md
//   node scripts/setup.mjs update                kéo bản phát hành vina-me mới nhất và chép sang các agent (sync tự kiểm 6 giờ một lần)
//   node scripts/setup.mjs channel release|main  theo tag phát hành (mặc định) hay theo đầu nhánh main (người bảo trì)
//   node scripts/setup.mjs check                 soát bộ nhớ: quá 200 dòng, ý gần trùng, lời trích thiếu ngày
//   node scripts/setup.mjs conflict              sync báo không gộp được: in phần khác nhau giữa bản máy này và bản trên repo
//   node scripts/setup.mjs resolve mine|theirs   giữ bản máy này ở chỗ đụng nhau, hoặc lấy bản trên repo (sao lưu bản cũ)
//
// Option: --home <thư mục> để thử trên home giả, --no-copy-skill để không chép skill, --plain để hỏi trơn không màu,
// --no-schedule để không cài lịch tự lưu, --claude hoặc --codex để nối vào agent đó dù chưa thấy thư mục cấu hình của nó.
// Khi cài có thể kèm --github [tên repo] hoặc --remote <url>.
//
// Lưu bộ nhớ: agent chỉ sửa tệp, không commit. Lệnh sync gom mọi thay đổi chưa commit thành một commit rồi đẩy lên; nó chạy
// khi mở và khi đóng phiên Claude Code (hook SessionStart, SessionEnd), khi đăng nhập máy, và mỗi 2 giờ (Task Scheduler
// trên Windows, crontab trên macOS và Linux). Cùng lúc đó sync kéo bản phát hành vina-me mới nhất vào bản clone ở ~/.config/vina-me/source
// và chép sang thư mục skill của từng agent. Tệp cấu hình nào sắp bị sửa thì được sao lưu một lần thành <tệp>.vina-me-backup.
//
// Mã chia trong scripts/lib/: context (tham số, đường dẫn, tiện ích), repo (git của bộ nhớ), update (tự cập nhật), agents
// (Claude Code, Codex, lịch), prompt (lượt hỏi), memory (dựng tệp bộ nhớ). Test ở tests/, chạy bằng node --test.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { hasFlag, valueOf, args, VALUE_FLAGS, KNOWN_FLAGS, command, commandArg, home, memDir, configDir, managedSource, codexDir, MEMORY_FILES, exists, read, write, slash, quiet, log, yes, shown, useClaude, useCodex, skillTargets, selfCommand, run, git, isRepo, hasUpstream, firstLine, gitNet, timedOut, OFFLINE } from './lib/context.mjs';
import { ghUser, connectRemote, cloneExisting, remoteHasCommits, commitPending, pull, pushIfAhead } from './lib/repo.mjs';
import { ensureManagedSource, copySkill, updateSkill, readConfig, writeConfig } from './lib/update.mjs';
import { syncCodex, linkClaude, installClaudeHooks, installSchedule } from './lib/agents.mjs';
import { YES_NO, ask, finish, answersFile, requireTty, getAnswers, closePrompt } from './lib/prompt.mjs';
import { teamMd, buildMemory, writeMachineFile } from './lib/memory.mjs';


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

// Chạy ở đầu phiên (chữ in ra vào ngữ cảnh của agent), cuối phiên, lúc đăng nhập và mỗi 2 giờ. Không bao giờ báo lỗi
// bằng mã thoát: lỗi chỉ in thành chữ để agent đọc được, và ghi vào ~/.config/vina-me/sync.log.
function cmdSync() {
  withLock(() => {
    const report = [];
    const logLines = [];
    try {
      const updated = updateSkill();
      if (updated) { report.push(updated); logLines.push(updated); }
    } catch (e) { logLines.push(`cập nhật vina-me lỗi: ${e.message}`); }
    // Máy cài trước khi có hook nhắc dùng vina-me: thêm riêng hook đó ở lần sync đầu tiên sau khi cập nhật, rồi ghi dấu
    // vào cấu hình để không bao giờ thêm lại, kể cả khi người dùng tự gỡ hook.
    try {
      const conf = readConfig();
      if (useClaude && !conf.remindHook) {
        if (installClaudeHooks({ silent: true, events: ['UserPromptSubmit'] })) {
          report.push('Đã thêm hook nhắc dùng vina-me ở mỗi tin vào settings.json của Claude Code; hook có hiệu lực từ phiên sau.');
          logLines.push('thêm hook UserPromptSubmit');
        }
        writeConfig({ ...readConfig(), remindHook: true });
      }
    } catch (e) { logLines.push(`thêm hook lỗi: ${e.message}`); }
    if (exists(path.join(memDir, 'AGENTS.md'))) {
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
    }
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
  if (!['mine', 'theirs'].includes(commandArg)) { console.error('Dùng: setup.mjs resolve mine|theirs'); process.exit(1); }
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

function wireAgents() {
  if (useClaude) {
    linkClaude();
    installClaudeHooks();
    writeConfig({ ...readConfig(), remindHook: true });
  }
  if (useCodex && syncCodex()) log(`  Codex: đã chép bộ nhớ vào ${path.join(codexDir, 'AGENTS.md')}`);
  installSchedule();
}

async function main() {
  // --help, -h: in phần chú thích đầu tệp. Option lạ: báo lỗi và thoát, không chạy cài đặt.
  if (hasFlag('--help') || hasFlag('-h')) {
    const head = fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1).filter((l) => l.startsWith('//')).map((l) => l.replace(/^\/\/ ?/, ''));
    console.log(head.join('\n'));
    return;
  }
  const unknown = args.filter((a, i) => a.startsWith('-') && !KNOWN_FLAGS.includes(a) && !VALUE_FLAGS.includes(args[i - 1]));
  if (unknown.length) {
    console.error(`Option không biết: ${unknown.join(' ')}. Xem cách dùng: node scripts/setup.mjs --help`);
    process.exit(2);
  }
  if (command === 'sync') { cmdSync(); return; }
  if (command === 'save') { cmdSave(); return; }
  if (command === 'codex') { if (syncCodex()) log(`  Codex: đã chép bộ nhớ vào ${path.join(codexDir, 'AGENTS.md')}`); return; }
  if (command === 'update') { log(updateSkill(true) || '  vina-me đang là bản mới nhất'); return; }
  if (command === 'check') { cmdCheck(); return; }
  if (command === 'channel') {
    if (!['release', 'main'].includes(commandArg)) { console.error('Dùng: setup.mjs channel release|main'); process.exit(1); }
    writeConfig({ ...readConfig(), channel: commandArg, lastSkillCheck: 0 });
    log(`  kênh cập nhật: ${commandArg}`);
    log(updateSkill(true) || '  vina-me đang ở bản mới nhất của kênh này');
    return;
  }
  if (command === 'conflict') { cmdConflict(); return; }
  if (command === 'resolve') { cmdResolve(); return; }
  if (command === 'team') {
    if (!commandArg) { console.error('Thiếu đường dẫn tệp luật: node setup.mjs team <tệp>'); process.exit(1); }
    write(path.join(memDir, 'team.md'), teamMd(commandArg));
    log('  thay luật chung của đội trong team.md; lần sync sau sẽ lưu lên repo');
    syncCodex();
    return;
  }
  if (command === 'github' || command === 'remote') {
    if (!exists(path.join(memDir, 'AGENTS.md'))) { console.error(`Chưa có bộ nhớ ở ${memDir}; chạy cài đặt trước.`); process.exit(1); }
    if (command === 'remote' && !commandArg) { console.error('Thiếu url: node setup.mjs remote <url git>'); process.exit(1); }
    if (!hasUpstream() && connectRemote(command === 'remote' ? { url: commandArg } : { repoName: commandArg ?? 'agent-memory' })) {
      writeMachineFile();
      wireAgents();
    }
    return;
  }

  // Cài đặt. Hỏi và kéo trước khi chép skill hay sửa cấu hình, để không hỏi được thì cũng không cài dở.
  let hasMemory = exists(path.join(memDir, 'AGENTS.md'));
  const url = valueOf('--remote') ?? answersFile?.remote;
  const repoName = valueOf('--github') ?? answersFile?.repo ?? 'agent-memory';
  let wantRepo = false;
  let cloned = false;

  if (!hasMemory) {
    // Máy thứ hai: repo đã có bộ nhớ thì kéo về.
    if (url && remoteHasCommits(url)) {
      cloned = cloneExisting({ url });
    } else if (!url) {
      const gh = ghUser();
      const full = gh && `${gh.login}/${repoName}`;
      if (gh && run('gh', ['repo', 'view', full, '--json', 'name']).status === 0) {
        requireTty();
        const ok = answersFile ? yes(answersFile.pullFromGithub) : yes(await ask({ label: 'Repo', q: `Thấy repo bộ nhớ github.com/${full}. Kéo về máy này?`, choices: YES_NO }, 1, 1));
        if (ok) cloned = cloneExisting({ full });
      }
    }
    hasMemory = cloned;
  }
  const answers = hasMemory ? null : await getAnswers();
  if (answers) wantRepo = Boolean(url) || yes(answers.github);
  closePrompt();

  log(`Cài vina-me cho ${home}`);
  const targets = skillTargets();
  for (const t of targets) { copySkill(t); log(`  chép skill vào ${t}`); }
  // Giữ một bản clone để lần sau tự cập nhật; tải zip về (không có .git) thì vẫn clone được từ GitHub nếu có mạng.
  if (targets.length) {
    if (ensureManagedSource()) {
      writeConfig({ ...readConfig(), source: managedSource, targets });
      log(`  tự cập nhật vina-me từ ${managedSource}`);
    } else log('  chưa giữ được bản clone vina-me để tự cập nhật (không có mạng?); chạy lại cài đặt sau');
  }

  if (cloned) {
    // Kéo từ repo về thì giữ nguyên nội dung; phần riêng của máy này nằm ở machine.md, sinh lại ngay dưới.
  } else if (hasMemory) {
    log(`  bộ nhớ ở ${memDir} đã có, giữ nguyên`);
    if (valueOf('--github') !== undefined || hasFlag('--github') || valueOf('--remote')) wantRepo = true;
  } else {
    buildMemory(answers);
  }

  if (wantRepo && !hasUpstream()) connectRemote({ repoName, url });
  writeMachineFile();
  wireAgents();
  if (!useClaude && !useCodex) {
    log('  Không thấy Claude Code hay Codex. Agent khác thì trỏ tệp chỉ dẫn toàn cục của nó tới');
    log(`  ${slash(path.join(memDir, 'AGENTS.md'))}, hoặc chép nội dung các tệp trong ${memDir} vào đó.`);
  }
  finish('Mở một phiên agent mới để nó đọc bộ nhớ.');
}

main();
