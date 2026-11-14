// Tham số dòng lệnh, đường dẫn, hằng số và hàm tiện ích dùng chung cho setup.mjs và các mô-đun trong lib/.
// Tính một lần lúc nạp, từ process.argv và biến môi trường.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const COMMANDS = ['sync', 'save', 'github', 'remote', 'team', 'codex', 'update', 'check', 'conflict', 'resolve', 'channel'];
const args = process.argv.slice(2);
// Option setup.mjs nhận; option lạ (đoán bừa như "--help" ở bản cũ) thì setup.mjs báo lỗi chứ không rơi xuống nhánh cài đặt.
const KNOWN_FLAGS = ['--home', '--answers', '--remote', '--github', '--no-copy-skill', '--plain', '--no-window', '--no-schedule', '--real-schedule',
  '--claude', '--codex', '--quiet', '--help', '-h'];
const hasFlag = (name) => args.includes(name);
const valueOf = (name) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : undefined;
};
// Lệnh con đứng ở đâu cũng được (hook ghi "--home <thư mục> sync"), miễn không phải giá trị của một option.
const VALUE_FLAGS = ['--home', '--answers', '--remote', '--github'];
const commandIndex = args.findIndex((a, i) => COMMANDS.includes(a) && !VALUE_FLAGS.includes(args[i - 1]));
const command = commandIndex >= 0 ? args[commandIndex] : null;
const commandArg = command && args[commandIndex + 1] && !args[commandIndex + 1].startsWith('--') ? args[commandIndex + 1] : undefined;

const realHome = os.homedir();
const fakeHome = valueOf('--home');
const home = path.resolve(fakeHome ?? realHome);
const skillSrc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
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
const setDecorate = (fn) => { decorate = fn; };
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

const run = (cmd, argv, opts = {}) => spawnSync(cmd, argv, {
  encoding: 'utf8', timeout: 60000, ...opts, env: { ...process.env, GIT_TERMINAL_PROMPT: '0', ...(opts.env ?? {}) },
});
const gitIn = (dir) => (...argv) => run('git', ['-C', dir, ...argv]);
const git = gitIn(memDir);
const isRepo = () => exists(path.join(memDir, '.git'));
const hasUpstream = () => isRepo() && git('rev-parse', '--abbrev-ref', '@{u}').status === 0;
const firstLine = (r) => `${r.stderr || r.stdout || r.error?.message || ''}`.trim().split('\n')[0];

// Lệnh git đi qua mạng (pull, push) chạy trong thời hạn ngắn, để mất mạng thì hook đầu phiên bỏ qua nhanh thay vì treo.
// VINA_ME_NET_TIMEOUT (mili giây) chỉ để bộ test chạy nhanh.
const NET_TIMEOUT = Number(process.env.VINA_ME_NET_TIMEOUT ?? 15000);
const gitNet = (dir, ...argv) => run('git', ['-C', dir, ...argv], { timeout: NET_TIMEOUT });
// Coi là mất mạng khi hết thời gian chờ, hoặc git báo lỗi kết nối (không phân giải được tên, bị từ chối, không có đường).
const NETWORK_ERROR = /could not resolve host|unable to access|failed to connect|connection (refused|timed out|reset)|network is unreachable|no route to host|could not read from remote|operation timed out/i;
const timedOut = (r) => r.error?.code === 'ETIMEDOUT' || r.signal === 'SIGTERM' || NETWORK_ERROR.test(`${r.stderr ?? ''}`);
const OFFLINE = 'không kết nối được repo (hết thời gian chờ)';

export { COMMANDS, KNOWN_FLAGS, args, hasFlag, valueOf, VALUE_FLAGS, commandIndex, command, commandArg, realHome, fakeHome, home, skillSrc, templates, memDir, configDir, managedSource, claudeDir, codexDir, claudeSkill, codexSkills, UPSTREAM_URL, START, END, MEMORY_FILES, GITIGNORE, exists, read, write, slash, today, decorate, setDecorate, quiet, log, yes, backupOnce, shown, useClaude, useCodex, skillTargets, skillHome, scriptPath, homeFlag, selfCommand, run, gitIn, git, isRepo, hasUpstream, firstLine, NET_TIMEOUT, gitNet, timedOut, OFFLINE };
