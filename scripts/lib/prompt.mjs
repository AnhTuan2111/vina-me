// Lượt hỏi khi cài: giao diện kiểu powerline trong cửa sổ dòng lệnh có màu, hỏi trơn khi không có.

import path from 'node:path';
import readline from 'node:readline/promises';
import { emitKeypressEvents } from 'node:readline';
import { spawnSync } from 'node:child_process';
import { hasFlag, valueOf, home, read, slash, setDecorate, log } from './context.mjs';

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
  setDecorate((s) => {
    const t = shorten(s);
    if (t.startsWith('Cài vina-me cho ')) return segments([['blue', 'ink', 'Cài đặt']]) + ' ' + paint('gray')(t.slice('Cài vina-me cho '.length));
    if (t.startsWith('  ')) return `  ${paint('green')('✓')} ${paint('gray')(t.trim())}`;
    return t;
  });
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

// Agent chạy script qua công cụ không có TTY nên không hỏi được. Trên Windows thì mở một cửa sổ PowerShell riêng, chạy lại
// đúng lệnh này trong đó để người dùng tự trả lời, chờ cửa sổ đóng rồi thoát theo mã thoát của nó. Biến VINA_ME_WINDOW chặn
// cửa sổ con mở tiếp cửa sổ khác; CI và --no-window giữ cách cũ (nhắc dùng --answers). macOS, Linux chưa làm.
const psQuote = (s) => `'${String(s).replace(/'/g, "''")}'`;
const encodePs = (script) => Buffer.from(script, 'utf16le').toString('base64');
function windowScript(argv = process.argv, cwd = process.cwd()) {
  return [
    '$Host.UI.RawUI.WindowTitle = "vina-me: cài đặt"',
    '$env:VINA_ME_WINDOW = "1"',
    `Set-Location -LiteralPath ${psQuote(cwd)}`,
    `& ${argv.map(psQuote).join(' ')}`,
    '$code = $LASTEXITCODE',
    'if ($code -ne 0) { Write-Host ""; Read-Host "Có lỗi ở trên. Bấm Enter để đóng cửa sổ" | Out-Null } else { Start-Sleep -Seconds 3 }',
    'exit $code',
  ].join('\n');
}
function canOpenWindow() {
  return process.platform === 'win32' && !process.env.VINA_ME_WINDOW && !process.env.CI && !hasFlag('--no-window');
}
function runInOwnWindow() {
  const ps = spawnSync('pwsh', ['-NoProfile', '-Command', 'exit 0']).status === 0 ? 'pwsh' : 'powershell.exe';
  const outer = [
    `$w = Start-Process -FilePath ${psQuote(ps)} -ArgumentList '-NoProfile','-EncodedCommand',${psQuote(encodePs(windowScript()))} -Wait -PassThru`,
    'exit $w.ExitCode',
  ].join('\n');
  console.log('Đã mở một cửa sổ PowerShell riêng để người dùng trả lời các câu hỏi cài đặt. Đang chờ cửa sổ đó đóng...');
  const r = spawnSync(ps, ['-NoProfile', '-NonInteractive', '-EncodedCommand', encodePs(outer)], { stdio: ['ignore', 'inherit', 'inherit'] });
  const code = r.status ?? 1;
  console.log(code === 0 ? 'Cửa sổ cài đặt đã xong. Mở một phiên agent mới để nó đọc bộ nhớ.' : `Cửa sổ cài đặt thoát với mã ${code}; xem lỗi người dùng thấy trong cửa sổ đó.`);
  process.exit(code);
}

function requireTty() {
  if (answersFile || process.stdin.isTTY) return;
  if (canOpenWindow()) runInOwnWindow();
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

function closePrompt() { lineReader?.close(); }

export { LENGTHS, YES_NO, QUESTIONS, pretty, out, CSI, fg, bg, bold, dim, COL, paint, segments, exitOnCtrlC, rawOn, rawOff, inputLine, inputChoice, askPretty, lineReader, askPlain, ask, banner, finish, answersFile, windowScript, canOpenWindow, requireTty, getAnswers, closePrompt };
