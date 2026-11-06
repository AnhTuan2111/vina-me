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
//   node scripts/setup.mjs update                kéo bản vina-me mới nhất và chép sang các agent (sync tự kiểm 6 giờ một lần)
//   node scripts/setup.mjs check                 soát bộ nhớ: quá 200 dòng, ý gần trùng, lời trích thiếu ngày
//   node scripts/setup.mjs conflict              sync báo không gộp được: in phần khác nhau giữa bản máy này và bản trên repo
//   node scripts/setup.mjs resolve mine|theirs   giữ bản máy này ở chỗ đụng nhau, hoặc lấy bản trên repo (sao lưu bản cũ)
//
// Cờ: --home <thư mục> để thử trên home giả, --no-copy-skill để không chép skill, --plain để hỏi trơn không màu,
// --no-schedule để không cài lịch tự lưu, --claude hoặc --codex để nối vào agent đó dù chưa thấy thư mục cấu hình của nó.
// Khi cài có thể kèm --github [tên repo] hoặc --remote <url>.
//
// Lưu bộ nhớ: agent chỉ sửa tệp, không commit. Lệnh sync gom mọi thay đổi chưa commit thành một commit rồi đẩy lên; nó chạy
// khi mở và khi đóng phiên Claude Code (hook SessionStart, SessionEnd), khi đăng nhập máy, và mỗi 2 giờ (Task Scheduler
// trên Windows, crontab trên macOS và Linux). Cùng lúc đó sync kéo vina-me mới nhất vào bản clone ở ~/.config/vina-me/source
// và chép sang thư mục skill của từng agent. Tệp cấu hình nào sắp bị sửa thì được sao lưu một lần thành <tệp>.vina-me-backup.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline/promises';
import { emitKeypressEvents } from 'node:readline';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const COMMANDS = ['sync', 'save', 'github', 'remote', 'team', 'codex', 'update', 'check', 'conflict', 'resolve'];
const args = process.argv.slice(2);
const hasFlag = (name) => args.includes(name);
const valueOf = (name) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : undefined;
};
// Lệnh con đứng ở đâu cũng được (hook ghi "--home <thư mục> sync"), miễn không phải giá trị của một cờ.
const VALUE_FLAGS = ['--home', '--answers', '--remote', '--github'];
const commandIndex = args.findIndex((a, i) => COMMANDS.includes(a) && !VALUE_FLAGS.includes(args[i - 1]));
const command = commandIndex >= 0 ? args[commandIndex] : null;
const commandArg = command && args[commandIndex + 1] && !args[commandIndex + 1].startsWith('--') ? args[commandIndex + 1] : undefined;

const realHome = os.homedir();
const fakeHome = valueOf('--home');
const home = path.resolve(fakeHome ?? realHome);
const skillSrc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templates = path.join(skillSrc, 'memory-template');
const memDir = path.join(home, 'agent-memory');
const configDir = path.join(home, '.config', 'vina-me');
const managedSource = path.join(configDir, 'source');
// Claude Code và Codex cho đổi thư mục cấu hình bằng biến môi trường; thử trên home giả thì bỏ qua hai biến đó.
const claudeDir = path.resolve(!fakeHome && process.env.CLAUDE_CONFIG_DIR ? process.env.CLAUDE_CONFIG_DIR : path.join(home, '.claude'));
const codexDir = path.resolve(!fakeHome && process.env.CODEX_HOME ? process.env.CODEX_HOME : path.join(home, '.codex'));
const claudeSkill = path.join(claudeDir, 'skills', 'vina-me');
// Tài liệu Codex hiện ghi skill toàn cục ở ~/.agents/skills; bản cũ dùng ~/.codex/skills. Chép cả hai cho chắc.
const codexSkills = [path.join(home, '.agents', 'skills', 'vina-me'), path.join(codexDir, 'skills', 'vina-me')];
const UPSTREAM_URL = 'https://github.com/AnhTuan2111/vina-me.git';

const START = '<!-- vina-me memory: start. Copied from ~/agent-memory; edit there, not here. -->';
const END = '<!-- vina-me memory: end -->';
const MEMORY_FILES = ['AGENTS.md', 'user.md', 'memory.md', 'team.md'];
const GITIGNORE = 'machine.md\n.pending-learn\n.disabled\n*.vina-me-backup\n';

const exists = (p) => fs.existsSync(p);
const read = (p) => fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
const write = (p, text) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text, 'utf8'); };
const slash = (p) => p.split(path.sep).join('/');
const today = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};
// Giao diện màu (bên dưới) thay decorate để tô các dòng báo; chạy qua pipe hay trong hook thì giữ chữ trơn cho agent đọc.
let decorate = (s) => s;
const quiet = hasFlag('--quiet');
const log = (s) => { if (!quiet) console.log(decorate(s)); };
const yes = (v, byDefault = true) => (String(v ?? '').trim() === '' ? byDefault : !/^\s*(k|n)/i.test(String(v)));

function backupOnce(file) {
  const bak = `${file}.vina-me-backup`;
  if (exists(file) && !exists(bak)) { fs.copyFileSync(file, bak); log(`  sao lưu ${file} thành ${path.basename(bak)}`); }
}

// Đường dẫn ghi trong tệp cấu hình: dùng ~ khi nằm trong home thật, đường dẫn đầy đủ khi thử trên home giả.
const shown = (p) => {
  const rel = path.relative(home, p);
  return home === realHome && !rel.startsWith('..') && !path.isAbsolute(rel) ? '~/' + slash(rel) : slash(p);
};

const useClaude = hasFlag('--claude') || exists(claudeDir);
const useCodex = hasFlag('--codex') || exists(codexDir);
const skillTargets = () => (hasFlag('--no-copy-skill') ? [] : [...(useClaude ? [claudeSkill] : []), ...(useCodex ? codexSkills : [])]);
const skillHome = hasFlag('--no-copy-skill') ? skillSrc : useClaude ? claudeSkill : useCodex ? codexSkills[0] : skillSrc;
// Lệnh gọi lại chính script này từ bản skill đã cài; hook, lịch và lời dặn trong bộ nhớ dùng nó.
const scriptPath = path.join(skillHome, 'scripts', 'setup.mjs');
const homeFlag = fakeHome ? ` --home "${slash(home)}"` : '';
const selfCommand = `node "${slash(scriptPath)}"${homeFlag}`;

// ---------- git ----------

const run = (cmd, argv, opts = {}) => spawnSync(cmd, argv, {
  encoding: 'utf8', timeout: 60000, ...opts, env: { ...process.env, GIT_TERMINAL_PROMPT: '0', ...(opts.env ?? {}) },
});
const gitIn = (dir) => (...argv) => run('git', ['-C', dir, ...argv]);
const git = gitIn(memDir);
const isRepo = () => exists(path.join(memDir, '.git'));
const hasUpstream = () => isRepo() && git('rev-parse', '--abbrev-ref', '@{u}').status === 0;
const firstLine = (r) => `${r.stderr || r.stdout || r.error?.message || ''}`.trim().split('\n')[0];

function ghUser() {
  const r = run('gh', ['api', 'user', '--jq', '.login + " " + (.id|tostring)']);
  if (r.error || r.status !== 0) return null;
  const [login, id] = r.stdout.trim().split(' ');
  return { login, id };
}

// Commit cần tên và email. Máy chưa đặt thì đặt riêng cho repo bộ nhớ: email noreply của GitHub nếu có, không thì tên máy.
function ensureIdentity(gh) {
  if (git('config', 'user.email').stdout.trim()) return;
  const user = gh?.login ?? os.userInfo().username;
  const email = gh ? `${gh.id}+${gh.login}@users.noreply.github.com` : `${user}@${os.hostname()}`;
  git('config', 'user.name', user);
  git('config', 'user.email', email);
}

function initRepo(gh) {
  if (!isRepo()) git('init', '-q', '-b', 'main');
  if (!exists(path.join(memDir, '.gitignore'))) write(path.join(memDir, '.gitignore'), GITIGNORE);
  ensureIdentity(gh);
  git('add', '-A');
  if (git('diff', '--cached', '--quiet').status !== 0) git('commit', '-q', '-m', 'Create agent memory');
}

// Đưa bộ nhớ đã có lên một repo mới. Có tên repo thì tạo trên GitHub bằng gh; có url thì dùng repo đã tạo sẵn.
function connectRemote({ repoName, url }) {
  if (url) {
    initRepo(null);
    if (git('remote', 'get-url', 'origin').status === 0) git('remote', 'set-url', 'origin', url);
    else git('remote', 'add', 'origin', url);
    const r = git('push', '-q', '-u', 'origin', 'main');
    if (r.status !== 0) { log(`  chưa đẩy được lên ${url}: ${firstLine(r)}`); return false; }
    log(`  bộ nhớ đã nằm ở repo ${url}`);
    return true;
  }
  const gh = ghUser();
  if (!gh) {
    log('  Chưa dùng được GitHub: máy chưa cài gh hoặc chưa đăng nhập. Chạy "gh auth login", rồi chạy:');
    log(`  ${selfCommand} github`);
    return false;
  }
  initRepo(gh);
  const full = `${gh.login}/${repoName}`;
  let r = run('gh', ['repo', 'create', full, '--private', '--source', memDir, '--remote', 'origin', '--push',
    '--description', 'Shared memory for coding agents (set up by vina-me)']);
  if (r.status !== 0) {
    // gh tạo repo được nhưng git chưa có quyền đẩy: nhờ gh làm trình giữ mật khẩu cho git rồi đẩy lại.
    run('gh', ['auth', 'setup-git']);
    r = git('push', '-q', '-u', 'origin', 'main');
    if (r.status !== 0) { log(`  chưa đẩy được lên GitHub: ${firstLine(r)}`); return false; }
  }
  log(`  bộ nhớ đã nằm ở repo riêng tư github.com/${full}`);
  return true;
}

// Máy thứ hai: repo bộ nhớ đã có thì kéo về thay vì dựng mới.
function cloneExisting({ url, full }) {
  const r = url ? run('git', ['clone', '-q', url, memDir]) : run('gh', ['repo', 'clone', full, memDir, '--', '-q']);
  if (r.status !== 0) { log(`  không kéo được bộ nhớ về: ${firstLine(r)}`); return false; }
  log(`  kéo bộ nhớ từ ${url ?? `github.com/${full}`} về ${memDir}`);
  return true;
}

function remoteHasCommits(url) {
  const r = run('git', ['ls-remote', url]);
  return r.status === 0 && r.stdout.trim() !== '';
}

// Gom mọi thay đổi chưa commit thành một commit. Trả về danh sách tệp đã commit.
function commitPending(message) {
  if (!isRepo()) return [];
  git('add', '-A');
  const files = git('diff', '--cached', '--name-only').stdout.split('\n').filter(Boolean);
  if (!files.length) return [];
  ensureIdentity(null);
  const r = git('commit', '-q', '-m', message ?? `Update ${files.join(', ')} (${os.hostname()})`);
  if (r.status !== 0) throw new Error(`không commit được: ${firstLine(r)}`);
  return files;
}

// Lệnh git đi qua mạng (pull, push) chạy trong thời hạn ngắn, để mất mạng thì hook đầu phiên bỏ qua nhanh thay vì treo.
const NET_TIMEOUT = 15000;
const gitNet = (dir, ...argv) => run('git', ['-C', dir, ...argv], { timeout: NET_TIMEOUT });
const timedOut = (r) => r.error?.code === 'ETIMEDOUT' || r.signal === 'SIGTERM';
const OFFLINE = 'không kết nối được repo (hết thời gian chờ)';

// Kéo bản mới; có tệp bộ nhớ nào đổi thì trả về danh sách tệp đó. Gặp xung đột thì huỷ rebase để repo không kẹt giữa chừng.
// strategy 'mine' giữ bản trên máy ở những đoạn đụng nhau (trong rebase, phía "theirs" là commit của máy này).
function pull(strategy) {
  if (!hasUpstream()) return { changed: [] };
  const before = git('rev-parse', 'HEAD').stdout.trim();
  const r = gitNet(memDir, 'pull', '-q', '--rebase', '--autostash', ...(strategy === 'mine' ? ['-X', 'theirs'] : []));
  const stuck = () => exists(path.join(memDir, '.git', 'rebase-merge')) || exists(path.join(memDir, '.git', 'rebase-apply'));
  if (r.status !== 0) {
    if (stuck()) git('rebase', '--abort');
    return { error: timedOut(r) ? OFFLINE : firstLine(r), offline: timedOut(r), changed: [] };
  }
  const after = git('rev-parse', 'HEAD').stdout.trim();
  if (before === after) return { changed: [] };
  const changed = git('diff', '--name-only', before, after).stdout.split('\n').filter((f) => MEMORY_FILES.includes(f));
  return { changed };
}

function pushIfAhead() {
  if (!hasUpstream()) return null;
  const ahead = Number(git('rev-list', '--count', '@{u}..HEAD').stdout.trim() || 0);
  if (!ahead) return null;
  const r = gitNet(memDir, 'push', '-q');
  return r.status === 0 ? null : timedOut(r) ? OFFLINE : firstLine(r);
}

// ---------- cập nhật vina-me ----------

// Bản clone vina-me do script giữ, để máy nào đã cài cũng kéo được bản mới, kể cả khi thư mục người dùng clone lúc đầu đã xoá.
function ensureManagedSource() {
  if (exists(path.join(managedSource, '.git'))) return true;
  if (exists(path.join(skillSrc, '.git'))) {
    fs.cpSync(skillSrc, managedSource, { recursive: true, filter: (src) => !path.relative(skillSrc, src).split(path.sep).includes('node_modules') });
    return true;
  }
  return run('git', ['clone', '-q', UPSTREAM_URL, managedSource]).status === 0;
}

function copySkill(target, from = skillSrc) {
  if (path.resolve(target) === path.resolve(from)) return;
  fs.cpSync(from, target, {
    recursive: true,
    filter: (src) => !path.relative(from, src).split(path.sep).some((s) => s === '.git' || s === 'node_modules'),
  });
}

// Kéo vina-me mới nhất; có bản mới thì chép sang mọi thư mục skill đã cài. Trả về dòng báo, hoặc rỗng nếu không có gì mới.
// Không ép (force) thì kiểm tối đa 6 giờ một lần, để hook đầu phiên không tốn thêm một lượt mạng ở mọi phiên.
const SKILL_CHECK_EVERY = 6 * 3600 * 1000;
function updateSkill(force = false) {
  const cfg = readConfig();
  const source = cfg.source && exists(path.join(cfg.source, '.git')) ? cfg.source : null;
  if (!source) return '';
  if (!force && Date.now() - (cfg.lastSkillCheck ?? 0) < SKILL_CHECK_EVERY) return '';
  writeConfig({ ...cfg, lastSkillCheck: Date.now() });
  const g = gitIn(source);
  const before = g('rev-parse', 'HEAD').stdout.trim();
  const r = gitNet(source, 'pull', '-q', '--ff-only');
  // Ép cập nhật (lệnh update) mà lỗi thì nói lỗi; trong sync tự động thì im, lần sau thử lại.
  if (r.status !== 0) return force ? `  chưa cập nhật được vina-me: ${timedOut(r) ? OFFLINE : firstLine(r)}` : '';
  const after = g('rev-parse', 'HEAD').stdout.trim();
  const missing = (cfg.targets ?? []).some((t) => !exists(path.join(t, 'SKILL.md')));
  if (before === after && !missing) return '';
  for (const t of cfg.targets ?? []) copySkill(t, source);
  return `vina-me vừa được cập nhật lên ${after.slice(0, 7)}: ${g('log', '-1', '--format=%s').stdout.trim()}`;
}

function readConfig() {
  try { return JSON.parse(read(path.join(configDir, 'config.json'))); } catch { return {}; }
}
function writeConfig(cfg) { write(path.join(configDir, 'config.json'), JSON.stringify(cfg, null, 2) + '\n'); }

// ---------- nối vào agent ----------

// Bản chép cho Codex: tệp cửa vào bỏ các dòng @, rồi nối nội dung các tệp kia vào sau.
function codexBlock() {
  const entry = read(path.join(memDir, 'AGENTS.md')).replace(
    /^@machine\.md\n[\s\S]*?^- `team\.md`[^\n]*\n/m,
    `Bộ nhớ gốc nằm ở \`${shown(memDir)}/\`. Khối này chỉ là bản chép: ghi nhớ thì sửa tệp gốc ở đó, không sửa khối này.\n` +
      'Bốn phần cuối khối là `machine.md` (lệnh trên máy này), `user.md` (người dùng là ai), `memory.md` (cách làm việc)\n' +
      'và `team.md` (luật của đội).\n',
  );
  const parts = ['machine.md', 'user.md', 'memory.md', 'team.md']
    .filter((f) => exists(path.join(memDir, f)))
    .map((f) => `<!-- ${f} -->\n${read(path.join(memDir, f)).trim()}`);
  return [START, entry.trim(), ...parts, END].join('\n\n');
}

function syncCodex() {
  if (!exists(codexDir) && !hasFlag('--codex')) return false;
  if (!exists(path.join(memDir, 'AGENTS.md'))) return false;
  const file = path.join(codexDir, 'AGENTS.md');
  const block = codexBlock();
  const old = exists(file) ? read(file) : '';
  let text = old;
  const a = text.indexOf(START);
  const b = text.indexOf(END);
  if (a >= 0 && b > a) text = text.slice(0, a) + block + text.slice(b + END.length);
  else { backupOnce(file); text = (text.trim() ? text.trimEnd() + '\n\n' : '') + block + '\n'; }
  if (text !== old) write(file, text);
  return true;
}

function linkClaude() {
  const file = path.join(claudeDir, 'CLAUDE.md');
  const line = `@${shown(path.join(memDir, 'AGENTS.md'))}`;
  const text = exists(file) ? read(file) : '';
  if (text.split('\n').some((l) => l.trim() === line)) { log(`  Claude Code: ${file} đã có dòng ${line}`); return; }
  backupOnce(file);
  write(file, (text.trim() ? text.trimEnd() + '\n\n' : '') + line + '\n');
  log(`  Claude Code: thêm dòng ${line} vào ${file}`);
}

// Hook của Claude Code: SessionStart chạy sync và chữ in ra được đưa vào ngữ cảnh của phiên; SessionEnd lưu nốt thay đổi.
function installClaudeHooks() {
  const file = path.join(claudeDir, 'settings.json');
  let cfg = {};
  if (exists(file)) {
    try { cfg = JSON.parse(read(file)); } catch {
      log(`  Claude Code: không đọc được ${file} (không phải JSON chuẩn), nên chưa thêm hook. Tự thêm hook SessionStart chạy:`);
      log(`  ${selfCommand} sync`);
      return;
    }
  }
  const ours = (h) => String(h.command ?? '').includes('setup.mjs') && /\bsync\b/.test(String(h.command));
  cfg.hooks ??= {};
  let changed = false;
  for (const [event, matcher, cmd] of [['SessionStart', 'startup', `${selfCommand} sync`], ['SessionEnd', undefined, `${selfCommand} sync --quiet`]]) {
    cfg.hooks[event] ??= [];
    if (cfg.hooks[event].some((g) => (g.hooks ?? []).some(ours))) continue;
    cfg.hooks[event].push({ ...(matcher ? { matcher } : {}), hooks: [{ type: 'command', command: cmd, timeout: 60 }] });
    changed = true;
  }
  if (!changed) { log(`  Claude Code: ${file} đã có hook tự lưu bộ nhớ`); return; }
  backupOnce(file);
  write(file, JSON.stringify(cfg, null, 2) + '\n');
  log(`  Claude Code: thêm hook tự lưu bộ nhớ khi mở và đóng phiên vào ${file}`);
}

// Lịch tự lưu: lúc đăng nhập máy và mỗi 2 giờ. Windows chạy qua wscript để không bật cửa sổ đen.
function installSchedule() {
  if (hasFlag('--no-schedule')) return;
  const node = process.execPath;
  if (process.platform === 'win32') {
    const vbs = path.join(configDir, 'sync-hidden.vbs');
    const q = (s) => s.replace(/"/g, '""');
    write(vbs, `CreateObject("WScript.Shell").Run """${q(node)}"" ""${q(scriptPath)}"" sync --quiet${q(homeFlag)}", 0, False\r\n`);
    const startup = fakeHome
      ? path.join(home, 'Startup')
      : path.join(process.env.APPDATA ?? path.join(home, 'AppData', 'Roaming'), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');
    write(path.join(startup, 'vina-me-sync.vbs'), read(vbs));
    const task = fakeHome ? `vina-me sync test ${path.basename(home)}` : 'vina-me sync';
    const r = run('schtasks', ['/Create', '/F', '/SC', 'HOURLY', '/MO', '2', '/TN', task, '/TR', `wscript.exe "${vbs}"`]);
    log(r.status === 0
      ? '  lịch tự lưu: khi đăng nhập máy và mỗi 2 giờ (Startup và Task Scheduler)'
      : `  lịch tự lưu: có khi đăng nhập máy; chưa tạo được lịch 2 giờ (${firstLine(r)})`);
    return;
  }
  const line = (when) => `${when} "${node}" "${scriptPath}" sync --quiet${homeFlag} # vina-me sync`;
  const current = run('crontab', ['-l']).stdout ?? '';
  if (current.includes('# vina-me sync')) { log('  lịch tự lưu đã có trong crontab'); return; }
  const r = run('crontab', ['-'], { input: current.trimEnd() + (current.trim() ? '\n' : '') + line('@reboot') + '\n' + line('0 */2 * * *') + '\n' });
  log(r.status === 0 ? '  lịch tự lưu: khi khởi động máy và mỗi 2 giờ (crontab)' : `  chưa tạo được lịch tự lưu: ${firstLine(r)}`);
}

// ---------- hỏi ----------

const LENGTHS = {
  '1': 'Trả lời ngắn: hỏi gì đáp nấy, vài câu. Thấy điều cần nói thêm ngoài câu hỏi thì một dòng ở cuối.',
  '2': 'Trả lời vừa phải: đủ để làm theo được, không giảng lại thứ người dùng đã biết.',
  '3': 'Trả lời đủ chi tiết: nói lý do và từng bước; chủ đề mới thì giảng từ khái niệm.',
};

const YES_NO = [['Có', 'y'], ['Không', 'n']];
const QUESTIONS = [
  { key: 'name', label: 'Gọi là', q: 'Bạn muốn agent gọi bạn là gì?', hint: 'ví dụ: anh Nam, chị Lan' },
  { key: 'role', label: 'Vai trò', q: 'Bạn làm vai trò gì?', hint: 'BA, tester, dev, quản lý dự án...' },
  { key: 'writesFor', label: 'Viết cho', q: 'Bạn hay viết văn bản cho ai?', hint: 'khách hàng, sếp, đội dev...' },
  { key: 'length', label: 'Trả lời', q: 'Bạn muốn agent trả lời thế nào?', choices: [['Ngắn gọn', '1'], ['Vừa phải', '2'], ['Đủ chi tiết', '3']] },
  { key: 'avoid', label: 'Không muốn', q: 'Có điều gì bạn không muốn agent làm không?', hint: 'bỏ trống nếu chưa có' },
  { key: 'teamRules', label: 'Luật đội', q: 'Tệp luật chung của đội, nếu có?', hint: 'đường dẫn tệp, bỏ trống nếu chưa có' },
  { key: 'learnFromSessions', label: 'Học phiên cũ', q: 'Cho agent đọc các phiên Claude Code, Codex cũ để soạn nháp bộ nhớ cho bạn duyệt?', hint: 'agent đọc lịch sử thì nội dung được gửi lên nhà cung cấp mô hình; trước khi đọc agent sẽ hỏi lại và cho bỏ bớt dự án', choices: YES_NO },
  { key: 'github', label: 'GitHub', q: 'Lưu bộ nhớ vào một repo GitHub riêng tư để máy nào của bạn cũng kéo về được?', choices: YES_NO },
];

// Giao diện hỏi kiểu powerline (dải màu có mũi nhọn như oh-my-posh). Chỉ bật khi chạy trong cửa sổ dòng lệnh có màu;
// chạy qua pipe, có NO_COLOR hoặc --plain thì hỏi trơn từng dòng. Mũi nhọn là ký tự U+E0B0 của bộ Powerline: Cascadia
// và các phông Nerd Font có sẵn; phông khác thì hiện thành ô vuông, khi đó dùng --plain.
const pretty = Boolean(process.stdin.isTTY && process.stdout.isTTY && !process.env.NO_COLOR && !hasFlag('--plain'));
const out = process.stdout;
const CSI = '\x1b[';
const fg = (c) => (s) => `${CSI}38;2;${c}m${s}${CSI}39m`;
const bg = (c) => (s) => `${CSI}48;2;${c}m${s}${CSI}49m`;
const bold = (s) => `${CSI}1m${s}${CSI}22m`;
const dim = (s) => `${CSI}2m${s}${CSI}22m`;
const COL = { ink: '26;27;38', text: '192;202;245', gray: '120;124;153', purple: '187;154;247', blue: '122;162;247', cyan: '42;195;222', green: '158;206;106', slate: '65;72;104' };
const paint = (name) => fg(COL[name]);

// Các dải màu nối nhau, mũi nhọn của dải trước tô lên nền dải sau.
function segments(parts) {
  return parts.map(([b, f, text], k) => {
    const next = parts[k + 1];
    const tip = next ? bg(COL[next[0]])(fg(COL[b])('\ue0b0')) : fg(COL[b])('\ue0b0');
    return bg(COL[b])(fg(COL[f])(bold(` ${text} `))) + tip;
  }).join('');
}

function exitOnCtrlC() { out.write(`${CSI}?25h\n`); process.exit(130); }
function rawOn() { emitKeypressEvents(process.stdin); process.stdin.setRawMode(true); process.stdin.resume(); }
function rawOff(handler) { process.stdin.off('keypress', handler); process.stdin.setRawMode(false); process.stdin.pause(); }

// Ô nhập tự xử lý từng phím, cùng đường đọc phím với ô chọn, để không rơi chữ khi gõ nhanh giữa hai câu. Bộ gõ tiếng Việt
// (Unikey, EVKey) gửi phím xoá rồi gửi chữ có dấu, nên chỉ cần xử lý đúng phím xoá.
function inputLine(prefix) {
  return new Promise((resolve) => {
    let value = '';
    const draw = () => out.write(`\r${CSI}0K${prefix}${value}`);
    const onKey = (str, key = {}) => {
      if (key.ctrl && key.name === 'c') exitOnCtrlC();
      if (key.name === 'return' || key.name === 'enter') { rawOff(onKey); out.write('\n'); resolve(value.trim()); return; }
      if (key.name === 'backspace') value = [...value].slice(0, -1).join('');
      else if (str && !key.ctrl && !key.meta && !/[\x00-\x1f\x7f]/.test(str)) value += str;
      else return;
      draw();
    };
    rawOn();
    draw();
    process.stdin.on('keypress', onKey);
  });
}

// Chọn bằng phím mũi tên, vẽ lại tại chỗ mỗi lần bấm. Trả về cặp [nhãn, giá trị] đã chọn.
function inputChoice(choices) {
  return new Promise((resolve) => {
    let i = 0;
    const draw = (first) => {
      if (!first) out.write(`${CSI}1A\r${CSI}0K`);
      out.write('    ' + choices.map(([label], k) => (k === i ? segments([['green', 'ink', label]]) : paint('gray')(` ${label}  `))).join(' ') +
        '  ' + dim(paint('gray')('mũi tên để chọn, Enter để xác nhận')) + '\n');
    };
    const onKey = (_, key = {}) => {
      if (key.ctrl && key.name === 'c') exitOnCtrlC();
      if (['up', 'left'].includes(key.name)) { i = (i + choices.length - 1) % choices.length; draw(); }
      else if (['down', 'right', 'tab'].includes(key.name)) { i = (i + 1) % choices.length; draw(); }
      else if (key.name === 'return' || key.name === 'enter') {
        rawOff(onKey);
        out.write(`${CSI}1A\r${CSI}0K${CSI}?25h`);
        resolve(choices[i]);
      }
    };
    out.write(`${CSI}?25l`);
    rawOn();
    draw(true);
    process.stdin.on('keypress', onKey);
  });
}

// Một câu hỏi: vẽ đầu câu, nhận câu trả lời, rồi thu gọn thành một dòng "✓ nhãn  câu trả lời".
async function askPretty(q, step, total) {
  const head = ['', segments([['slate', 'text', `${step}/${total}`], ['cyan', 'ink', q.label]]) + '  ' + bold(paint('text')(q.q))];
  if (q.hint) head.push(`    ${dim(paint('gray')(q.hint))}`);
  out.write(head.join('\n') + '\n');
  let value;
  let shownValue;
  if (q.choices) [shownValue, value] = await inputChoice(q.choices);
  else { value = await inputLine(`  ${paint('green')('❯')} `); shownValue = value; }
  // Xoá cả đầu câu lẫn dòng nhập, viết lại thành một dòng tóm tắt, để các câu đã trả lời đứng liền nhau.
  out.write(`${CSI}${head.length + (q.choices ? 0 : 1)}A\r${CSI}0J`);
  out.write(`  ${paint('green')('✓')} ${paint('gray')(q.label.padEnd(15))}${shownValue ? paint('text')(shownValue) : dim(paint('gray')('bỏ trống'))}\n`);
  return value;
}

// Hỏi trơn từng dòng, dùng khi không có cửa sổ dòng lệnh có màu. Đọc qua iterator vì rl.question làm rơi dòng có sẵn trong stdin.
let lineReader;
async function askPlain(q) {
  if (!lineReader) lineReader = readline.createInterface({ input: process.stdin, output: process.stdout });
  lineReader.iter ??= lineReader[Symbol.asyncIterator]();
  const choiceText = q.choices && q.choices.map(([label, v]) => `${v} ${label.toLowerCase()}`).join(', ') + ', bỏ trống là cái đầu';
  const extra = [choiceText, q.hint].filter(Boolean).join('; ');
  process.stdout.write(`${q.q}${extra ? ` (${extra})` : ''} `);
  const { value, done } = await lineReader.iter.next();
  const v = done ? '' : value.trim();
  return q.choices && !v ? q.choices[0][1] : v;
}

const ask = (q, step, total) => (pretty ? askPretty(q, step, total) : askPlain(q));

// Dòng báo khi cài: dòng mở đầu thành dải "Cài đặt", các bước thành "✓ chữ xám", đường dẫn trong home rút gọn thành ~.
if (pretty) {
  const shorten = (s) => [home, slash(home)].reduce((acc, h) => acc.split(h).join('~'), s);
  decorate = (s) => {
    const t = shorten(s);
    if (t.startsWith('Cài vina-me cho ')) return segments([['blue', 'ink', 'Cài đặt']]) + ' ' + paint('gray')(t.slice('Cài vina-me cho '.length));
    if (t.startsWith('  ')) return `  ${paint('green')('✓')} ${paint('gray')(t.trim())}`;
    return t;
  };
}

function banner(subtitle) {
  if (pretty) out.write('\n' + segments([['purple', 'ink', 'vina-me'], ['blue', 'ink', 'bộ nhớ cho agent']]) + '\n' + `  ${paint('gray')(subtitle)}\n\n`);
  else log(subtitle + '\n');
}

function finish(text) {
  if (pretty) out.write('\n' + segments([['green', 'ink', 'Xong']]) + ' ' + paint('gray')(text) + '\n\n');
  else log(`\nXong. ${text}`);
}

const answersFile = valueOf('--answers') ? JSON.parse(read(path.resolve(valueOf('--answers')))) : null;
function requireTty() {
  if (answersFile || process.stdin.isTTY) return;
  console.error('Không hỏi được vì không chạy trong cửa sổ dòng lệnh. Ghi câu trả lời vào một tệp JSON có các khoá');
  console.error(`${QUESTIONS.map((q) => q.key).join(', ')} rồi chạy lại với --answers <tệp>.`);
  process.exit(1);
}

async function getAnswers() {
  if (answersFile) return answersFile;
  requireTty();
  banner(`${QUESTIONS.length} câu. Câu nào chưa nghĩ ra thì bỏ trống, agent ghi dần sau.`);
  const answers = {};
  for (const [n, q] of QUESTIONS.entries()) answers[q.key] = await ask(q, n + 1, QUESTIONS.length);
  out.write('\n');
  return answers;
}

// ---------- dựng bộ nhớ ----------

function userMd(a) {
  const val = (x) => (x && String(x).trim()) || 'chưa rõ';
  const lines = [
    '# Người dùng', '',
    `Dựng ngày ${today()} từ lượt hỏi đầu tiên. Agent sửa dần theo luật ở \`AGENTS.md\`.`, '',
    '## Là ai', '',
    `- Gọi là: ${val(a.name)}.`,
    `- Vai trò: ${val(a.role)}.`,
    `- Hay viết văn bản cho: ${val(a.writesFor)}.`, '',
    '## Cách trả lời', '',
    '- Trả lời bằng tiếng Việt có dấu; tên tệp, lệnh, thuật ngữ kỹ thuật giữ nguyên.',
    `- ${LENGTHS[String(a.length ?? '').trim()] ?? LENGTHS['1']}`,
  ];
  const no = a.avoid && String(a.avoid).trim().replace(/[.;]+$/, '');
  if (no) lines.push(`- Không muốn: ${no}.`);
  return lines.join('\n') + '\n';
}

function teamMd(file) {
  const text = read(path.resolve(file)).trim();
  return (text.startsWith('#') ? text : `# Luật chung của đội\n\n${text}`) + '\n';
}

function buildMemory(answers) {
  write(path.join(memDir, 'AGENTS.md'), read(path.join(templates, 'AGENTS.template.md')).replace('{{DATE}}', today()));
  write(path.join(memDir, 'user.md'), userMd(answers));
  write(path.join(memDir, 'memory.md'), read(path.join(templates, 'memory.md')));
  const team = answers.teamRules && String(answers.teamRules).trim();
  write(path.join(memDir, 'team.md'), team ? teamMd(team) : read(path.join(templates, 'team.md')));
  // Đồng ý học từ phiên cũ thì để lại dấu; AGENTS.md dặn agent thấy dấu này thì làm ở phiên đầu tiên.
  if (yes(answers.learnFromSessions)) write(path.join(memDir, '.pending-learn'), `Người dùng đồng ý ngày ${today()}.\n`);
  log(`  dựng bộ nhớ ở ${memDir}`);
}

// Lệnh và đường dẫn riêng của máy này. Không đẩy lên repo (có trong .gitignore), mỗi máy tự sinh khi cài.
function writeMachineFile() {
  const remote = isRepo() ? git('remote', 'get-url', 'origin').stdout.trim() : '';
  const lines = [
    '# Máy này', '',
    `Lệnh và đường dẫn trên máy ${os.hostname()}. Script cài đặt sinh ra tệp này, mỗi máy một bản, không đẩy lên repo.`, '',
    `- \`<setup>\`: \`${selfCommand}\``,
    `- \`<secrets>\`: \`node "${slash(path.join(skillHome, 'scripts', 'secrets.mjs'))}"\``,
    `- Skill vina-me: \`${shown(skillHome)}\``,
    `- Repo bộ nhớ: ${remote ? `\`${remote}\`` : 'chưa có, bộ nhớ chỉ nằm trên máy này'}.`,
    '- Claude Code tự chạy `<setup> sync` khi mở và đóng phiên; máy tự chạy nó khi đăng nhập và mỗi 2 giờ. Agent không có hook',
    '  đó (Codex, agent khác) thì đầu mỗi phiên, trước khi làm việc, chạy `<setup> sync`. Lệnh in ra gì thì đó là phần bộ nhớ',
    '  vừa được sửa ở máy khác: dùng bản in ra thay cho bản đã nạp.',
  ];
  write(path.join(memDir, 'machine.md'), lines.join('\n') + '\n');
}

// ---------- các lệnh ----------

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
  }
  if (useCodex && syncCodex()) log(`  Codex: đã chép bộ nhớ vào ${path.join(codexDir, 'AGENTS.md')}`);
  installSchedule();
}

async function main() {
  if (command === 'sync') { cmdSync(); return; }
  if (command === 'save') { cmdSave(); return; }
  if (command === 'codex') { if (syncCodex()) log(`  Codex: đã chép bộ nhớ vào ${path.join(codexDir, 'AGENTS.md')}`); return; }
  if (command === 'update') { log(updateSkill(true) || '  vina-me đang là bản mới nhất'); return; }
  if (command === 'check') { cmdCheck(); return; }
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
  lineReader?.close();

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
