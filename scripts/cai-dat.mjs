#!/usr/bin/env node
// Cài vina-me cho các agent trên máy và dựng bộ nhớ dùng chung ở ~/agent-memory. Chạy một lần.
//
//   node scripts/cai-dat.mjs                       hỏi vài câu rồi cài
//   node scripts/cai-dat.mjs --tra-loi tl.json     không hỏi, lấy câu trả lời từ tệp (agent chạy thay người dùng)
//   node scripts/cai-dat.mjs --day "đã ghi gì"     sau khi sửa bộ nhớ: chép sang Codex, commit, đẩy lên repo
//   node scripts/cai-dat.mjs --keo                 kéo bộ nhớ mới nhất từ repo về; có thay đổi thì in ra (hook đầu phiên)
//   node scripts/cai-dat.mjs --github [tên repo]   đưa bộ nhớ đã có lên một repo GitHub riêng tư (cần gh đã đăng nhập)
//   node scripts/cai-dat.mjs --remote <url git>    như trên nhưng với một repo git bất kỳ đã tạo sẵn
//   node scripts/cai-dat.mjs --dong-bo             chỉ chép lại bộ nhớ vào ~/.codex/AGENTS.md
//   node scripts/cai-dat.mjs --doi luat-doi.md     thay luật chung của đội trong bộ nhớ đã có
//
// Thêm --home <thư mục> để thử trên một thư mục home giả, --khong-chep-skill để chỉ dựng bộ nhớ,
// --claude hoặc --codex để nối bộ nhớ vào agent đó dù chưa thấy thư mục cấu hình của nó.
//
// Luồng cài: nếu trên GitHub đã có repo bộ nhớ của người dùng (cài ở máy thứ hai) thì kéo về, khỏi hỏi; không thì hỏi rồi
// dựng ~/agent-memory, tạo repo riêng tư nếu người dùng muốn. Sau đó nối vào agent. Claude Code nạp bộ nhớ qua dòng @ trong
// CLAUDE.md và kéo bản mới qua hook SessionStart trong settings.json. Codex không có cú pháp nạp tệp khác, nên nhận một bản
// chép nằm giữa hai dòng đánh dấu trong ~/.codex/AGENTS.md, kèm lời dặn chạy --keo đầu phiên. Tệp cấu hình nào sắp bị sửa
// thì được sao lưu một lần thành <tệp>.truoc-vina-me.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const hasFlag = (name) => args.includes(name);
const valueOf = (name) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : undefined;
};

const realHome = os.homedir();
const fakeHome = valueOf('--home');
const home = path.resolve(fakeHome ?? realHome);
const skillSrc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templates = path.join(skillSrc, 'mau-bo-nho');
const memDir = path.join(home, 'agent-memory');
// Claude Code và Codex cho đổi thư mục cấu hình bằng biến môi trường; thử trên home giả thì bỏ qua hai biến đó.
const claudeDir = path.resolve(!fakeHome && process.env.CLAUDE_CONFIG_DIR ? process.env.CLAUDE_CONFIG_DIR : path.join(home, '.claude'));
const codexDir = path.resolve(!fakeHome && process.env.CODEX_HOME ? process.env.CODEX_HOME : path.join(home, '.codex'));
const claudeSkill = path.join(claudeDir, 'skills', 'vina-me');
// Tài liệu Codex hiện ghi skill toàn cục ở ~/.agents/skills; bản cũ dùng ~/.codex/skills. Chép cả hai cho chắc.
const codexSkills = [path.join(home, '.agents', 'skills', 'vina-me'), path.join(codexDir, 'skills', 'vina-me')];

const START = '<!-- bộ nhớ vina-me: bắt đầu. Chép từ ~/agent-memory, sửa ở đó rồi chạy đồng bộ, đừng sửa ở đây. -->';
const END = '<!-- bộ nhớ vina-me: hết -->';
const MEMORY_FILES = ['AGENTS.md', 'user.md', 'memory.md', 'doi.md'];
const GITIGNORE = 'may-nay.md\n.can-hoc-phien\n.khong-dung\n*.truoc-vina-me\n';

const exists = (p) => fs.existsSync(p);
const read = (p) => fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
const write = (p, text) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text, 'utf8'); };
const slash = (p) => p.split(path.sep).join('/');
const today = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};
const log = (s) => console.log(s);
const yes = (v, byDefault = true) => (String(v ?? '').trim() === '' ? byDefault : !/^\s*k/i.test(String(v)));

function backupOnce(file) {
  const bak = `${file}.truoc-vina-me`;
  if (exists(file) && !exists(bak)) { fs.copyFileSync(file, bak); log(`  sao lưu ${file} thành ${path.basename(bak)}`); }
}

// Đường dẫn ghi trong tệp cấu hình: dùng ~ khi nằm trong home thật, đường dẫn đầy đủ khi thử trên home giả.
const shown = (p) => {
  const rel = path.relative(home, p);
  return home === realHome && !rel.startsWith('..') && !path.isAbsolute(rel) ? '~/' + slash(rel) : slash(p);
};

const useClaude = hasFlag('--claude') || exists(claudeDir);
const useCodex = hasFlag('--codex') || exists(codexDir);
const skillHome = hasFlag('--khong-chep-skill') ? skillSrc : useClaude ? claudeSkill : useCodex ? codexSkills[0] : skillSrc;
// Lệnh gọi lại chính script này từ bản skill đã cài; hook và lời dặn trong bộ nhớ dùng nó.
const selfCommand = `node "${slash(path.join(skillHome, 'scripts', 'cai-dat.mjs'))}"${fakeHome ? ` --home "${slash(home)}"` : ''}`;

// ---------- git và GitHub ----------

const run = (cmd, argv, opts = {}) => spawnSync(cmd, argv, {
  encoding: 'utf8', timeout: 60000, ...opts, env: { ...process.env, GIT_TERMINAL_PROMPT: '0', ...(opts.env ?? {}) },
});
const git = (...argv) => run('git', ['-C', memDir, ...argv]);
const isRepo = () => exists(path.join(memDir, '.git'));
const hasUpstream = () => isRepo() && git('rev-parse', '--abbrev-ref', '@{u}').status === 0;
const firstLine = (r) => `${r.stderr || r.stdout || ''}`.trim().split('\n')[0];

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
  if (git('diff', '--cached', '--quiet').status !== 0) git('commit', '-q', '-m', 'Dựng bộ nhớ');
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
    log('  Chưa dùng được GitHub: máy chưa cài gh hoặc chưa đăng nhập. Chạy "gh auth login", rồi chạy lại:');
    log(`  ${selfCommand} --github`);
    return false;
  }
  initRepo(gh);
  const full = `${gh.login}/${repoName}`;
  let r = run('gh', ['repo', 'create', full, '--private', '--source', memDir, '--remote', 'origin', '--push',
    '--description', 'Bộ nhớ dùng chung cho các agent (dựng bằng vina-me)']);
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

// Kéo bản mới; có tệp bộ nhớ nào đổi thì trả về danh sách tệp đó. Gặp xung đột thì huỷ rebase để repo không kẹt giữa chừng.
function pull() {
  if (!hasUpstream()) return { changed: [] };
  const before = git('rev-parse', 'HEAD').stdout.trim();
  const r = git('pull', '-q', '--rebase', '--autostash');
  if (r.status !== 0) {
    if (exists(path.join(memDir, '.git', 'rebase-merge')) || exists(path.join(memDir, '.git', 'rebase-apply'))) git('rebase', '--abort');
    return { error: firstLine(r), changed: [] };
  }
  const after = git('rev-parse', 'HEAD').stdout.trim();
  if (before === after) return { changed: [] };
  const changed = git('diff', '--name-only', before, after).stdout.split('\n').filter((f) => MEMORY_FILES.includes(f));
  return { changed };
}

// ---------- nối vào agent ----------

// Bản chép cho Codex: tệp cửa vào bỏ bốn dòng @, rồi nối nội dung bốn tệp kia vào sau.
function codexBlock() {
  const entry = read(path.join(memDir, 'AGENTS.md')).replace(
    /^@may-nay\.md\n[\s\S]*?^- `doi\.md`[^\n]*\n/m,
    `Bộ nhớ gốc nằm ở \`${shown(memDir)}/\`. Khối này chỉ là bản chép: ghi nhớ thì sửa tệp gốc ở đó, không sửa khối này.\n` +
      'Bốn phần cuối khối là `may-nay.md` (lệnh trên máy này), `user.md` (người dùng là ai), `memory.md` (cách làm việc)\n' +
      'và `doi.md` (luật của đội).\n',
  );
  const parts = ['may-nay.md', 'user.md', 'memory.md', 'doi.md']
    .filter((f) => exists(path.join(memDir, f)))
    .map((f) => `<!-- ${f} -->\n${read(path.join(memDir, f)).trim()}`);
  return [START, entry.trim(), ...parts, END].join('\n\n');
}

function syncCodex(quiet = false) {
  if (!exists(codexDir) && !hasFlag('--codex')) return;
  const file = path.join(codexDir, 'AGENTS.md');
  const block = codexBlock();
  let text = exists(file) ? read(file) : '';
  const a = text.indexOf(START);
  const b = text.indexOf(END);
  if (a >= 0 && b > a) text = text.slice(0, a) + block + text.slice(b + END.length);
  else { backupOnce(file); text = (text.trim() ? text.trimEnd() + '\n\n' : '') + block + '\n'; }
  write(file, text);
  if (!quiet) log(`  Codex: đã chép bộ nhớ vào ${file}`);
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

// Hook SessionStart: mỗi phiên mới, Claude Code chạy --keo; chữ lệnh in ra được đưa vào ngữ cảnh của phiên.
function installClaudeHook() {
  const file = path.join(claudeDir, 'settings.json');
  let cfg = {};
  if (exists(file)) {
    try { cfg = JSON.parse(read(file)); } catch {
      log(`  Claude Code: không đọc được ${file} (không phải JSON chuẩn), nên chưa thêm hook kéo bộ nhớ. Tự thêm hook`);
      log(`  SessionStart chạy lệnh: ${selfCommand} --keo`);
      return;
    }
  }
  const command = `${selfCommand} --keo`;
  cfg.hooks ??= {};
  cfg.hooks.SessionStart ??= [];
  const has = cfg.hooks.SessionStart.some((g) => (g.hooks ?? []).some((h) => String(h.command ?? '').includes('cai-dat.mjs') && String(h.command).includes('--keo')));
  if (has) { log(`  Claude Code: ${file} đã có hook kéo bộ nhớ`); return; }
  backupOnce(file);
  cfg.hooks.SessionStart.push({ matcher: 'startup', hooks: [{ type: 'command', command, timeout: 30 }] });
  write(file, JSON.stringify(cfg, null, 2) + '\n');
  log(`  Claude Code: thêm hook kéo bộ nhớ đầu phiên vào ${file}`);
}

function copySkill(target) {
  if (path.resolve(target) === skillSrc) { log(`  skill đã nằm sẵn ở ${target}`); return; }
  fs.cpSync(skillSrc, target, {
    recursive: true,
    filter: (src) => !path.relative(skillSrc, src).split(path.sep).some((s) => s === '.git' || s === 'node_modules'),
  });
  log(`  chép skill vào ${target}`);
}

// ---------- hỏi và dựng bộ nhớ ----------

const LENGTHS = {
  '1': 'Trả lời ngắn: hỏi gì đáp nấy, vài câu. Thấy điều cần nói thêm ngoài câu hỏi thì một dòng ở cuối.',
  '2': 'Trả lời vừa phải: đủ để làm theo được, không giảng lại thứ người dùng đã biết.',
  '3': 'Trả lời đủ chi tiết: nói lý do và từng bước; chủ đề mới thì giảng từ khái niệm.',
};

const QUESTIONS = [
  ['ten', 'Bạn muốn agent gọi bạn là gì (ví dụ: anh Nam, chị Lan)? '],
  ['vaiTro', 'Bạn làm vai trò gì (BA, tester, dev, quản lý dự án...)? '],
  ['vietCho', 'Bạn hay viết văn bản cho ai (khách hàng, sếp, đội dev...)? '],
  ['doDai', 'Bạn muốn agent trả lời: 1 ngắn gọn, 2 vừa phải, 3 đủ chi tiết? (bỏ trống là 1) '],
  ['khongMuon', 'Có điều gì bạn không muốn agent làm không? (bỏ trống nếu chưa có) '],
  ['luatDoi', 'Đường dẫn tệp luật chung của đội, nếu có (bỏ trống nếu chưa có): '],
  ['hocPhienCu', 'Cho agent đọc các phiên Claude Code, Codex cũ trên máy để soạn nháp bộ nhớ cho bạn duyệt không? (c/k, bỏ trống là có) '],
  ['github', 'Lưu bộ nhớ vào một repo GitHub riêng tư để máy nào của bạn cũng kéo về được không? (c/k, bỏ trống là có) '],
];

let lineReader;
async function ask(question) {
  if (!lineReader) lineReader = readline.createInterface({ input: process.stdin, output: process.stdout });
  // Đọc từng dòng qua iterator thay cho rl.question, vì rl.question làm rơi các dòng đã có sẵn trong stdin.
  lineReader.iter ??= lineReader[Symbol.asyncIterator]();
  process.stdout.write(question);
  const { value, done } = await lineReader.iter.next();
  return done ? '' : value.trim();
}

const answersFile = valueOf('--tra-loi') ? JSON.parse(read(path.resolve(valueOf('--tra-loi')))) : null;
function requireTty() {
  if (answersFile || process.stdin.isTTY) return;
  console.error('Không hỏi được vì không chạy trong cửa sổ dòng lệnh. Ghi câu trả lời vào một tệp JSON có các khoá');
  console.error(`${QUESTIONS.map((q) => q[0]).join(', ')} rồi chạy lại với --tra-loi <tệp>.`);
  process.exit(1);
}

async function getAnswers() {
  if (answersFile) return answersFile;
  requireTty();
  log('Dựng bộ nhớ cho agent. Trả lời vài câu, câu nào chưa nghĩ ra thì bỏ trống, agent sẽ ghi dần sau.\n');
  const answers = {};
  for (const [key, q] of QUESTIONS) answers[key] = await ask(q);
  return answers;
}

function userMd(a) {
  const val = (x) => (x && String(x).trim()) || 'chưa rõ';
  const lines = [
    '# Người dùng', '',
    `Dựng ngày ${today()} từ lượt hỏi đầu tiên. Agent sửa dần theo luật ở \`AGENTS.md\`.`, '',
    '## Là ai', '',
    `- Gọi là: ${val(a.ten)}.`,
    `- Vai trò: ${val(a.vaiTro)}.`,
    `- Hay viết văn bản cho: ${val(a.vietCho)}.`, '',
    '## Cách trả lời', '',
    '- Trả lời bằng tiếng Việt có dấu; tên tệp, lệnh, thuật ngữ kỹ thuật giữ nguyên.',
    `- ${LENGTHS[String(a.doDai ?? '').trim()] ?? LENGTHS['1']}`,
  ];
  const no = a.khongMuon && String(a.khongMuon).trim().replace(/[.;]+$/, '');
  if (no) lines.push(`- Không muốn: ${no}.`);
  return lines.join('\n') + '\n';
}

function teamMd(file) {
  const text = read(path.resolve(file)).trim();
  return (text.startsWith('#') ? text : `# Luật chung của đội\n\n${text}`) + '\n';
}

function buildMemory(answers) {
  const entry = read(path.join(templates, 'AGENTS.mau.md'))
    .replace('{{NGAY}}', today());
  write(path.join(memDir, 'AGENTS.md'), entry);
  write(path.join(memDir, 'user.md'), userMd(answers));
  write(path.join(memDir, 'memory.md'), read(path.join(templates, 'memory.md')));
  const team = answers.luatDoi && String(answers.luatDoi).trim();
  write(path.join(memDir, 'doi.md'), team ? teamMd(team) : read(path.join(templates, 'doi.md')));
  // Đồng ý học từ phiên cũ thì để lại dấu; AGENTS.md dặn agent thấy dấu này thì làm ở phiên đầu tiên.
  if (yes(answers.hocPhienCu)) write(path.join(memDir, '.can-hoc-phien'), `Người dùng đồng ý ngày ${today()}.\n`);
  log(`  dựng bộ nhớ ở ${memDir}`);
}

// Lệnh và đường dẫn riêng của máy này. Không đẩy lên repo (có trong .gitignore), mỗi máy tự sinh khi cài.
function writeMachineFile() {
  const remote = isRepo() ? git('remote', 'get-url', 'origin').stdout.trim() : '';
  const lines = [
    '# Máy này', '',
    `Lệnh và đường dẫn trên máy ${os.hostname()}. Script cài đặt sinh ra tệp này, mỗi máy một bản, không đẩy lên repo.`, '',
    `- \`<cai-dat>\`: \`${selfCommand}\``,
    `- \`<bi-mat>\`: \`node "${slash(path.join(skillHome, 'scripts', 'bi-mat.mjs'))}"\``,
    `- Skill vina-me: \`${shown(skillHome)}\``,
    `- Repo bộ nhớ: ${remote ? `\`${remote}\`` : 'chưa có, bộ nhớ chỉ nằm trên máy này'}.`,
  ];
  if (remote) {
    lines.push(
      '- Claude Code tự kéo bộ nhớ mới ở đầu phiên qua hook. Agent không có hook đó (Codex, agent khác) thì đầu mỗi phiên,',
      '  trước khi làm việc, chạy `<cai-dat> --keo`. Lệnh in ra gì thì đó là phần bộ nhớ vừa được sửa ở máy khác: dùng bản',
      '  in ra thay cho bản đã nạp.',
    );
  }
  write(path.join(memDir, 'may-nay.md'), lines.join('\n') + '\n');
}

// ---------- các lệnh ----------

function cmdPull() {
  // Chạy trong hook đầu phiên: không bao giờ báo lỗi bằng mã thoát, chỉ in chữ để agent đọc được.
  if (!exists(path.join(memDir, 'AGENTS.md'))) return;
  const { changed, error } = pull();
  if (error) { log(`Không kéo được bộ nhớ mới nhất từ repo (${error}). Đang dùng bản trên máy; báo người dùng nếu cần.`); return; }
  if (!changed.length) return;
  syncCodex(true);
  log(`Bộ nhớ ở ${shown(memDir)} vừa được kéo bản mới từ repo (đã sửa ở máy khác). Dùng bản dưới đây thay cho bản đã nạp:\n`);
  for (const f of changed) if (exists(path.join(memDir, f))) log(`<!-- ${f} -->\n${read(path.join(memDir, f)).trim()}\n`);
}

function cmdPush() {
  if (!exists(path.join(memDir, 'AGENTS.md'))) { console.error(`Chưa có bộ nhớ ở ${memDir}.`); process.exit(1); }
  syncCodex();
  if (!isRepo()) { log('  bộ nhớ chưa nằm trong repo git nào, chỉ lưu trên máy này'); return; }
  git('add', '-A');
  if (git('diff', '--cached', '--quiet').status !== 0) {
    const r = git('commit', '-q', '-m', valueOf('--day') ?? 'Cập nhật bộ nhớ');
    if (r.status !== 0) { console.error(`Không commit được: ${firstLine(r)}`); process.exit(1); }
  }
  if (!hasUpstream()) { log('  đã commit; repo chưa có remote nên chưa đẩy đi đâu'); return; }
  const p = pull();
  if (p.error) { console.error(`Không gộp được với bản trên repo: ${p.error}. Bản trên máy vẫn còn, chưa đẩy.`); process.exit(1); }
  if (p.changed.length) syncCodex(true);
  const r = git('push', '-q');
  if (r.status !== 0) { console.error(`Không đẩy được lên repo: ${firstLine(r)}`); process.exit(1); }
  log('  đã commit và đẩy bộ nhớ lên repo');
}

async function main() {
  if (hasFlag('--keo')) { cmdPull(); return; }
  if (hasFlag('--day')) { cmdPush(); return; }
  if (hasFlag('--dong-bo')) {
    if (!exists(path.join(memDir, 'AGENTS.md'))) { console.error(`Chưa có bộ nhớ ở ${memDir}.`); process.exit(1); }
    syncCodex();
    return;
  }

  // Hỏi và kéo trước khi chép skill hay sửa cấu hình, để không hỏi được thì cũng không cài dở.
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
        const ok = answersFile ? yes(answersFile.keoTuGithub) : yes(await ask(`Thấy repo bộ nhớ github.com/${full}. Kéo về máy này? (c/k, bỏ trống là có) `));
        if (ok) cloned = cloneExisting({ full });
      }
    }
    hasMemory = cloned;
  }
  const answers = hasMemory ? null : await getAnswers();
  if (answers) wantRepo = Boolean(url) || yes(answers.github);
  lineReader?.close();

  log(`Cài vina-me cho ${home}`);
  if (!hasFlag('--khong-chep-skill')) {
    if (useClaude) copySkill(claudeSkill);
    if (useCodex) codexSkills.forEach(copySkill);
  }

  if (cloned) {
    // Kéo từ repo về thì giữ nguyên nội dung; phần riêng của máy này nằm ở may-nay.md, sinh lại ngay dưới.
  } else if (hasMemory) {
    log(`  bộ nhớ ở ${memDir} đã có, giữ nguyên`);
    const team = valueOf('--doi');
    if (team) { write(path.join(memDir, 'doi.md'), teamMd(team)); log('  thay luật chung của đội trong doi.md'); }
    if (hasFlag('--github') || valueOf('--remote')) wantRepo = true;
  } else {
    buildMemory(answers);
  }

  if (wantRepo && !hasUpstream()) connectRemote({ repoName, url });
  writeMachineFile();

  if (useClaude) {
    linkClaude();
    if (hasUpstream()) installClaudeHook();
  }
  if (useCodex) syncCodex();
  if (!useClaude && !useCodex) {
    log('  Không thấy Claude Code hay Codex. Agent khác thì trỏ tệp chỉ dẫn toàn cục của nó tới');
    log(`  ${slash(path.join(memDir, 'AGENTS.md'))}, hoặc chép nội dung các tệp trong ${memDir} vào đó.`);
  }
  log('\nXong. Mở một phiên agent mới để nó đọc bộ nhớ.');
}

main();
