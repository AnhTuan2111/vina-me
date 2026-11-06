#!/usr/bin/env node
// Giữ mật khẩu, token cho agent dùng mà không lộ ra trong chat hay trong lịch sử phiên.
//
//   node scripts/secrets.mjs add <tên>                       mở một cửa sổ riêng để người dùng gõ tài khoản, mật khẩu
//   node scripts/secrets.mjs add <tên> --account <tk> --from-stdin   lấy mật khẩu từ stdin (khi người dùng đã dán vào chat)
//   node scripts/secrets.mjs run <tên> -- <lệnh> [tham số]   chạy lệnh với biến môi trường <TÊN>_USER, <TÊN>_PASS
//   node scripts/secrets.mjs stdin <tên> -- <lệnh> [tham số] chạy lệnh, đưa mật khẩu vào stdin của nó (--password-stdin)
//   node scripts/secrets.mjs list | check <tên> | remove <tên>
//
// Thêm --home <thư mục> để thử trên home khác, --env-prefix <TIỀN_TỐ> để đổi tên biến môi trường.
//
// Cất ở đâu: Windows lưu mỗi bí mật thành ~/.secrets/<tên>.xml bằng Export-Clixml của PowerShell, mật khẩu mã hoá bằng
// DPAPI nên chỉ đúng tài khoản Windows đó trên đúng máy đó giải mã được; tệp chép sang máy khác là vô dụng. macOS lưu
// vào Keychain với tên dịch vụ "vina-me:<tên>" (chưa thử). Script không tự in mật khẩu: giá trị chỉ đi thẳng vào biến môi
// trường hoặc stdin của lệnh con. Việc này giữ mật khẩu khỏi chat và lịch sử phiên, nhưng không giấu nó khỏi chương trình
// chạy bằng cùng tài khoản: lệnh con nào cũng đọc được biến môi trường của nó.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const argv = process.argv.slice(2);
const dash = argv.indexOf('--');
const args = dash >= 0 ? argv.slice(0, dash) : argv;
const command = dash >= 0 ? argv.slice(dash + 1) : [];
const valueOf = (name) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : undefined;
};
const hasFlag = (name) => args.includes(name);
const [action, name] = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && ['--home', '--account', '--env-prefix'].includes(args[i - 1])));

const home = path.resolve(valueOf('--home') ?? os.homedir());
const secretsDir = path.join(home, '.secrets');
const isWin = process.platform === 'win32';
const isMac = process.platform === 'darwin';

const fail = (msg, code = 1) => { console.error(msg); process.exit(code); };
const fileOf = (n) => path.join(secretsDir, `${n}.xml`);
const envPrefix = (n) => valueOf('--env-prefix') ?? n.toUpperCase().replace(/[^A-Z0-9]/g, '_');

function checkName(n) {
  if (!n || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(n)) fail('Tên bí mật chỉ gồm chữ không dấu, số, dấu chấm, gạch nối, gạch dưới. Ví dụ: gitlab, sso-cong-ty.');
}

// ---------- Windows: PowerShell, DPAPI ----------

// Dùng PowerShell 7 nếu có, không thì Windows PowerShell có sẵn trên mọi máy Windows. Tệp do bản nào ghi thì bản kia đọc được.
let psExe;
function powershell() {
  if (psExe) return psExe;
  psExe = spawnSync('pwsh', ['-NoProfile', '-Command', 'exit 0']).status === 0 ? 'pwsh' : 'powershell.exe';
  return psExe;
}
const encode = (script) => Buffer.from(script, 'utf16le').toString('base64');
const psQuote = (s) => `'${s.replace(/'/g, "''")}'`;
const b64 = (s) => Buffer.from(s, 'utf8').toString('base64');

// Chạy một đoạn PowerShell; dữ liệu vào và ra đi qua base64 để mật khẩu có dấu hay ký tự lạ không bị hỏng bảng mã.
function runPs(script, input = '') {
  const r = spawnSync(powershell(), ['-NoProfile', '-NonInteractive', '-EncodedCommand', encode(script)], { input, encoding: 'utf8' });
  if (r.status !== 0) fail(`PowerShell báo lỗi: ${(r.stderr || '').trim().split('\n')[0]}`);
  return r.stdout;
}

const PS_DECODE = '[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String([Console]::In.ReadLine()))';

function winSave(n, account, password) {
  runPs([
    '$ErrorActionPreference = "Stop"',
    `$u = ${PS_DECODE}`,
    `$p = ${PS_DECODE}`,
    '$s = ConvertTo-SecureString $p -AsPlainText -Force',
    `New-Item -ItemType Directory -Force -Path ${psQuote(secretsDir)} | Out-Null`,
    `New-Object System.Management.Automation.PSCredential($u, $s) | Export-Clixml -Path ${psQuote(fileOf(n))}`,
  ].join('\n'), `${b64(account)}\n${b64(password)}\n`);
}

function winRead(n) {
  if (!fs.existsSync(fileOf(n))) fail(`Chưa có bí mật "${n}". Lưu bằng: node scripts/secrets.mjs add ${n}`);
  const out = runPs([
    '$ErrorActionPreference = "Stop"',
    `$c = Import-Clixml -Path ${psQuote(fileOf(n))}`,
    '$b = [Text.Encoding]::UTF8.GetBytes($c.UserName + "`n" + $c.GetNetworkCredential().Password)',
    '[Console]::Out.Write([Convert]::ToBase64String($b))',
  ].join('\n'));
  const [account, ...rest] = Buffer.from(out.trim(), 'base64').toString('utf8').split('\n');
  return { account, password: rest.join('\n') };
}

// Mở một cửa sổ PowerShell riêng cho người dùng gõ. Chữ gõ vào không hiện, không đi qua chat, không vào lịch sử phiên.
function winPrompt(n, account) {
  const inner = [
    '$ErrorActionPreference = "Stop"',
    `$Host.UI.RawUI.WindowTitle = ${psQuote(`vina-me: lưu bí mật ${n}`)}`,
    `Write-Host ${psQuote(`Lưu bí mật "${n}" cho agent. Mật khẩu gõ vào không hiện ra; chỉ tài khoản Windows này trên máy này giải mã được.`)}`,
    'Write-Host ""',
    account ? `$u = ${psQuote(account)}` : '$u = Read-Host "Tài khoản (bỏ trống nếu chỉ có token)"',
    'if (-not $u) { $u = "-" }',
    '$p = Read-Host "Mật khẩu hoặc token" -AsSecureString',
    'if ($p.Length -eq 0) { Write-Host "Chưa gõ gì, không lưu."; Start-Sleep -Seconds 2; exit 2 }',
    `New-Item -ItemType Directory -Force -Path ${psQuote(secretsDir)} | Out-Null`,
    `New-Object System.Management.Automation.PSCredential($u, $p) | Export-Clixml -Path ${psQuote(fileOf(n))}`,
    'Write-Host "Đã lưu. Cửa sổ tự đóng."',
    'Start-Sleep -Seconds 1',
  ].join('\n');
  const outer = [
    `$w = Start-Process -FilePath ${psQuote(powershell())} -ArgumentList '-NoProfile','-EncodedCommand',${psQuote(encode(inner))} -Wait -PassThru`,
    'exit $w.ExitCode',
  ].join('\n');
  const r = spawnSync(powershell(), ['-NoProfile', '-EncodedCommand', encode(outer)], { stdio: 'inherit' });
  return r.status === 0;
}

// ---------- macOS: Keychain (chưa thử) ----------

const macService = (n) => `vina-me:${n}`;
function macSave(n, account, password) {
  const r = spawnSync('security', ['add-generic-password', '-U', '-s', macService(n), '-a', account, '-w', password]);
  if (r.status !== 0) fail('Không lưu được vào Keychain.');
}
function macRead(n) {
  const pw = spawnSync('security', ['find-generic-password', '-s', macService(n), '-w'], { encoding: 'utf8' });
  if (pw.status !== 0) fail(`Chưa có bí mật "${n}" trong Keychain.`);
  const meta = spawnSync('security', ['find-generic-password', '-s', macService(n)], { encoding: 'utf8' }).stdout;
  return { account: (meta.match(/"acct"<blob>="([^"]*)"/) ?? [])[1] ?? '-', password: pw.stdout.replace(/\n$/, '') };
}
function macPrompt(n, account) {
  const ask = (q, hidden) => {
    const r = spawnSync('osascript', ['-e', `text returned of (display dialog ${JSON.stringify(q)} default answer ""${hidden ? ' with hidden answer' : ''} with title "vina-me")`], { encoding: 'utf8' });
    return r.status === 0 ? r.stdout.replace(/\n$/, '') : null;
  };
  const u = account ?? ask(`Tài khoản cho bí mật "${n}" (bỏ trống nếu chỉ có token)`, false);
  if (u === null) return false;
  const p = ask(`Mật khẩu hoặc token cho "${n}"`, true);
  if (!p) return false;
  macSave(n, u || '-', p);
  return true;
}

// ---------- chung ----------

const store = isWin ? { save: winSave, read: winRead, prompt: winPrompt }
  : isMac ? { save: macSave, read: macRead, prompt: macPrompt }
  : null;
if (!store && action !== undefined) fail('Hiện chỉ hỗ trợ Windows (DPAPI) và macOS (Keychain).');

function readStdin() {
  try { return fs.readFileSync(0, 'utf8').replace(/\r?\n$/, ''); } catch { return ''; }
}

function runChild(env, input) {
  if (!command.length) fail('Thiếu lệnh sau dấu --. Ví dụ: node scripts/secrets.mjs run gitlab -- bash -c \'curl -u "$GITLAB_USER:$GITLAB_PASS" ...\'');
  const r = spawnSync(command[0], command.slice(1), {
    stdio: [input === undefined ? 'inherit' : 'pipe', 'inherit', 'inherit'],
    input, env: { ...process.env, ...env },
  });
  if (r.error) fail(`Không chạy được ${command[0]}: ${r.error.message}`);
  process.exit(r.status ?? 1);
}

function list() {
  if (isMac) {
    const out = spawnSync('security', ['dump-keychain'], { encoding: 'utf8' }).stdout ?? '';
    const names = [...out.matchAll(/"svce"<blob>="vina-me:([^"]+)"/g)].map((m) => m[1]);
    console.log(names.length ? names.join('\n') : 'Chưa có bí mật nào.');
    return;
  }
  const files = fs.existsSync(secretsDir) ? fs.readdirSync(secretsDir).filter((f) => f.endsWith('.xml')) : [];
  if (!files.length) { console.log('Chưa có bí mật nào.'); return; }
  for (const f of files) {
    // Tên tài khoản trong tệp Clixml để chữ thường, chỉ mật khẩu là mã hoá, nên đọc được mà không cần giải mã.
    const xml = fs.readFileSync(path.join(secretsDir, f), 'utf8');
    const account = (xml.match(/<S N="UserName">([^<]*)<\/S>/) ?? [])[1] ?? '?';
    const when = fs.statSync(path.join(secretsDir, f)).mtime.toISOString().slice(0, 10);
    console.log(`${f.replace(/\.xml$/, '')}\ttài khoản: ${account}\tlưu ngày ${when}`);
  }
}

switch (action) {
  case 'add': {
    checkName(name);
    const account = valueOf('--account');
    if (hasFlag('--from-stdin')) {
      const password = readStdin();
      if (!password) fail('stdin trống, không có gì để lưu.');
      store.save(name, account || '-', password);
    } else if (!store.prompt(name, account)) {
      fail('Chưa lưu: người dùng đóng cửa sổ hoặc bỏ trống mật khẩu.');
    }
    console.log(`Đã lưu bí mật "${name}". Dùng: node scripts/secrets.mjs run ${name} -- <lệnh>, biến ${envPrefix(name)}_USER và ${envPrefix(name)}_PASS.`);
    break;
  }
  case 'run': {
    checkName(name);
    const { account, password } = store.read(name);
    runChild({ [`${envPrefix(name)}_USER`]: account, [`${envPrefix(name)}_PASS`]: password });
    break;
  }
  case 'stdin': {
    checkName(name);
    const { account, password } = store.read(name);
    runChild({ [`${envPrefix(name)}_USER`]: account }, `${password}\n`);
    break;
  }
  case 'check': {
    checkName(name);
    const { account, password } = store.read(name);
    console.log(`"${name}": tài khoản ${account}, giải mã được${password ? '' : ' nhưng mật khẩu trống'}.`);
    break;
  }
  case 'remove': {
    checkName(name);
    if (isMac) spawnSync('security', ['delete-generic-password', '-s', macService(name)]);
    else fs.rmSync(fileOf(name), { force: true });
    console.log(`Đã xoá bí mật "${name}".`);
    break;
  }
  case 'list': list(); break;
  default:
    console.log('Dùng: node scripts/secrets.mjs add|run|stdin|check|remove|list <tên> [-- lệnh]. Chi tiết ở đầu tệp này và references/agent-memory.md.');
}
