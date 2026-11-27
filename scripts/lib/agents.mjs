// Nối vina-me và bộ nhớ vào từng agent: Claude Code (CLAUDE.md, hook trong settings.json), Codex (bản chép trong
// AGENTS.md), omp (AGENTS.md và extension trong ~/.omp/agent), và lịch tự lưu của máy.

import fs from 'node:fs';
import path from 'node:path';
import { hasFlag, fakeHome, home, memDir, configDir, claudeDir, codexDir, ompDir, START, END, exists, read, write, log, backupOnce, shown, slash, scriptPath, scriptIn, homeFlag, selfCommand, run, firstLine } from './context.mjs';

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

// Thay khối giữa START và END trong một tệp, hoặc nối khối vào cuối tệp. Trả về true khi tệp đổi.
function putBlock(file, block) {
  const old = exists(file) ? read(file) : '';
  let text = old;
  const a = text.indexOf(START);
  const b = text.indexOf(END);
  if (a >= 0 && b > a) text = text.slice(0, a) + block + text.slice(b + END.length);
  else { backupOnce(file); text = (text.trim() ? text.trimEnd() + '\n\n' : '') + block + '\n'; }
  if (text === old) return false;
  write(file, text);
  return true;
}

function syncCodex() {
  if (!exists(codexDir) && !hasFlag('--codex')) return false;
  if (!exists(path.join(memDir, 'AGENTS.md'))) return false;
  putBlock(path.join(codexDir, 'AGENTS.md'), codexBlock());
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

// omp đưa ~/.omp/agent/AGENTS.md vào ngữ cảnh mọi phiên; khối này dặn nó đọc bộ nhớ ở đầu phiên.
function linkOmp() {
  const file = path.join(ompDir, 'AGENTS.md');
  const entry = shown(path.join(memDir, 'AGENTS.md'));
  const block = [START, '# Bộ nhớ dùng chung', '', `Trước khi trả lời câu đầu tiên của phiên, đọc và làm theo \`${entry}\`.`, END].join('\n');
  log(putBlock(file, block) ? `  omp: thêm lời dặn đọc bộ nhớ vào ${file}` : `  omp: ${file} đã có lời dặn đọc bộ nhớ`);
}

// Extension của omp: hàm before_agent_start chạy trước mỗi tin người dùng gửi và trả về một tin ẩn có lời nhắc.
// Tên tệp bắt đầu bằng "vina-me-" để biết tệp nào do vina-me ghi; ghi đè được, vì người dùng không sửa tay tệp này.
function ompExtensionSource(customType, text) {
  return [
    `// Do vina-me ghi (scripts/lib/agents.mjs); chạy lại script cài để cập nhật, đừng sửa tay.`,
    `const TEXT = ${JSON.stringify(text)}`,
    '',
    'export default function (pi) {',
    "  pi.on('before_agent_start', async (event) => {",
    "    if (event?.reason && event.reason !== 'prompt') return",
    `    return { message: { customType: ${JSON.stringify(customType)}, content: TEXT, display: false } }`,
    '  })',
    '}',
    '',
  ].join('\n');
}

function installOmpExtension(name, text) {
  const file = path.join(ompDir, 'extensions', `${name}.ts`);
  const source = ompExtensionSource(name, text);
  if (exists(file) && read(file) === source) { log(`  omp: ${file} đã có`); return false; }
  write(file, source);
  log(`  omp: ghi extension ${file} (có hiệu lực từ phiên omp mở sau)`);
  return true;
}

// Hook của Claude Code. SessionStart chạy memory.mjs sync, chữ in ra vào ngữ cảnh của phiên; SessionEnd lưu nốt thay đổi;
// UserPromptSubmit chạy remind.mjs ở mỗi tin người dùng gửi. events chọn hook nào cần thêm. Trả về danh sách hook vừa thêm.
// Máy cài bản cũ có hook gọi setup.mjs sync: vẫn tính là hook tự lưu, không thêm trùng (setup.mjs chuyển tiếp sang memory.mjs).
const HOOKS = {
  SessionStart: { matcher: 'startup', cmd: () => `${selfCommand} sync`, ours: (h) => /(setup|memory)\.mjs/.test(String(h.command ?? '')) && /\bsync\b/.test(String(h.command)), timeout: 60 },
  SessionEnd: { cmd: () => `${selfCommand} sync --quiet`, ours: (h) => /(setup|memory)\.mjs/.test(String(h.command ?? '')) && /\bsync\b/.test(String(h.command)), timeout: 60 },
  UserPromptSubmit: { cmd: () => `node "${slash(scriptIn('remind.mjs'))}"`, ours: (h) => String(h.command ?? '').includes('remind.mjs'), timeout: 10 },
  UpdateCheck: { event: 'SessionStart', label: 'SessionStart (kiểm tra bản vina-me mới)', matcher: 'startup', cmd: () => `node "${slash(scriptIn('update.mjs'))}"${homeFlag} --quiet`, ours: (h) => /update\.mjs/.test(String(h.command ?? '')), timeout: 60 },
};

function installClaudeHooks(names, { silent = false } = {}) {
  const say = silent ? () => {} : log;
  const file = path.join(claudeDir, 'settings.json');
  let cfg = {};
  if (exists(file)) {
    try { cfg = JSON.parse(read(file)); } catch {
      say(`  Claude Code: không đọc được ${file} (không phải JSON chuẩn), nên chưa thêm hook ${names.join(', ')}.`);
      return null;
    }
  }
  cfg.hooks ??= {};
  const added = [];
  for (const name of names) {
    const h = HOOKS[name];
    const event = h.event ?? name;
    cfg.hooks[event] ??= [];
    if (cfg.hooks[event].some((g) => (g.hooks ?? []).some(h.ours))) continue;
    cfg.hooks[event].push({ ...(h.matcher ? { matcher: h.matcher } : {}), hooks: [{ type: 'command', command: h.cmd(), timeout: h.timeout }] });
    added.push(h.label ?? name);
  }
  if (!added.length) { say(`  Claude Code: ${file} đã có hook ${names.join(', ')}`); return []; }
  backupOnce(file);
  write(file, JSON.stringify(cfg, null, 2) + '\n');
  say(`  Claude Code: thêm hook ${added.join(', ')} vào ${file} (có hiệu lực từ phiên mở sau)`);
  return added;
}

// Lịch tự lưu: lúc đăng nhập máy và mỗi 2 giờ. Windows chạy qua wscript để không bật cửa sổ đen.
function installSchedule() {
  const node = process.execPath;
  if (process.platform === 'win32') {
    const vbs = path.join(configDir, 'sync-hidden.vbs');
    const q = (s) => s.replace(/"/g, '""');
    write(vbs, `CreateObject("WScript.Shell").Run """${q(node)}"" ""${q(scriptPath)}"" sync --quiet${q(homeFlag)}", 0, False\r\n`);
    const startup = fakeHome
      ? path.join(home, 'Startup')
      : path.join(process.env.APPDATA ?? path.join(home, 'AppData', 'Roaming'), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');
    write(path.join(startup, 'vina-me-sync.vbs'), read(vbs));
    // Home giả (--home): Task Scheduler là của cả máy thật, không theo home giả, nên không tạo task trừ khi có --real-schedule.
    // Một agent thử skill từng chạy cài đặt với home tạm và để lại task "vina-me sync" thật trên máy người dùng.
    if (fakeHome && !hasFlag('--real-schedule')) {
      log('  lịch tự lưu: home giả, chỉ ghi tệp Startup trong home giả, không tạo task trong Task Scheduler (thêm --real-schedule nếu cần)');
      return;
    }
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

export { codexBlock, putBlock, syncCodex, linkClaude, linkOmp, ompExtensionSource, installOmpExtension, HOOKS, installClaudeHooks, installSchedule };
