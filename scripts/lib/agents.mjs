// Nối bộ nhớ vào Claude Code (CLAUDE.md, hook) và Codex (bản chép trong AGENTS.md), cài lịch tự lưu.

import fs from 'node:fs';
import path from 'node:path';
import { hasFlag, command, fakeHome, home, memDir, configDir, claudeDir, codexDir, START, END, exists, read, write, quiet, log, backupOnce, shown, slash, scriptPath, homeFlag, selfCommand, run, firstLine } from './context.mjs';

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

// Hook của Claude Code: SessionStart chạy sync và chữ in ra được đưa vào ngữ cảnh của phiên; SessionEnd lưu nốt thay đổi;
// UserPromptSubmit chạy remind.mjs ở mỗi tin người dùng gửi, nhắc agent soát lời trả lời theo vina-me.
// silent: không in gì; events: chỉ thêm các hook này (sync dùng để thêm riêng hook nhắc). Trả về true khi vừa thêm hook.
function installClaudeHooks({ silent = false, events } = {}) {
  const say = silent ? () => {} : log;
  const file = path.join(claudeDir, 'settings.json');
  let cfg = {};
  if (exists(file)) {
    try { cfg = JSON.parse(read(file)); } catch {
      say(`  Claude Code: không đọc được ${file} (không phải JSON chuẩn), nên chưa thêm hook. Tự thêm hook SessionStart chạy:`);
      say(`  ${selfCommand} sync`);
      return false;
    }
  }
  const remind = `node "${slash(path.join(path.dirname(scriptPath), 'remind.mjs'))}"`;
  const isSync = (h) => String(h.command ?? '').includes('setup.mjs') && /\bsync\b/.test(String(h.command));
  const isRemind = (h) => String(h.command ?? '').includes('remind.mjs');
  cfg.hooks ??= {};
  const added = [];
  for (const [event, matcher, cmd, ours, timeout] of [
    ['SessionStart', 'startup', `${selfCommand} sync`, isSync, 60],
    ['SessionEnd', undefined, `${selfCommand} sync --quiet`, isSync, 60],
    ['UserPromptSubmit', undefined, remind, isRemind, 10],
  ]) {
    if (events && !events.includes(event)) continue;
    cfg.hooks[event] ??= [];
    if (cfg.hooks[event].some((g) => (g.hooks ?? []).some(ours))) continue;
    cfg.hooks[event].push({ ...(matcher ? { matcher } : {}), hooks: [{ type: 'command', command: cmd, timeout }] });
    added.push(event);
  }
  if (!added.length) { say(`  Claude Code: ${file} đã có hook tự lưu bộ nhớ và hook nhắc dùng vina-me`); return false; }
  backupOnce(file);
  write(file, JSON.stringify(cfg, null, 2) + '\n');
  say(`  Claude Code: thêm hook ${added.join(', ')} vào ${file} (tự lưu bộ nhớ khi mở, đóng phiên; nhắc dùng vina-me ở mỗi tin)`);
  return true;
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
    // Home giả (--home): Task Scheduler là của cả máy thật, không theo home giả, nên không tạo task trừ khi có --real-schedule.
    // Một agent thử skill từng chạy setup với home tạm và để lại task "vina-me sync" thật trên máy người dùng.
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

export { codexBlock, syncCodex, linkClaude, installClaudeHooks, installSchedule };
