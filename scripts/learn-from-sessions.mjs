#!/usr/bin/env node
// Rút lời người dùng trong các phiên cũ của Claude Code và Codex ra thành các đợt văn bản ngắn, kèm tóm gọn agent đã nghĩ
// gì, trả lời gì và gọi skill nào ở lượt đó, để agent đọc rồi soạn nháp bộ nhớ cho người dùng duyệt. Script không ghi gì
// vào bộ nhớ.
//
//   node scripts/learn-from-sessions.mjs                    mọi phiên, ghi ra <thư mục tạm>/vina-me-learn
//   node scripts/learn-from-sessions.mjs --since 2026-09-01 chỉ phiên từ ngày đó
//   node scripts/learn-from-sessions.mjs --out <thư mục>    chọn chỗ ghi; chỉ xoá overview.md, batch-*.md cũ trong đó, tệp
//                                                           khác (nháp của agent) để nguyên
//   node scripts/learn-from-sessions.mjs --only project-a --only project-b chỉ phiên có thư mục làm việc chứa một trong các chữ đó
//   node scripts/learn-from-sessions.mjs --exclude private          bỏ phiên có thư mục làm việc chứa chữ đó (lặp lại được)
//   node scripts/learn-from-sessions.mjs --user-only        chỉ lời người dùng, bỏ phần tóm gọn của agent
//   --home <thư mục>   thử trên home khác;  --batch-size <số ký tự>  độ dài mỗi đợt (mặc định 60000)
//   --help             in cách dùng rồi thoát; option lạ hay option thiếu giá trị thì báo lỗi và không rút gì
//
// Riêng tư: các đợt rút ra nằm trên máy, nhưng khi agent đọc chúng thì nội dung được gửi lên nhà cung cấp mô hình thêm
// một lần. Dùng --only, --exclude để giữ lại những dự án không muốn gửi.
//
// Lấy gì: tin người dùng tự gõ; sau mỗi tin, một hai dòng tóm gọn phần agent của lượt đó: đoạn đầu phần suy nghĩ (Claude
// Code ghi khối thinking có chữ ở một số lượt; Codex ghi reasoning summary), đoạn đầu câu trả lời cuối, tên skill đã gọi.
// Có lời agent thì câu sửa kiểu "không phải thế" mới rõ là sửa cái gì. Bỏ output công cụ, khối hệ thống tự chèn
// (AGENTS.md, environment_context, system-reminder), thông báo task, lệnh gạch chéo, tóm tắt khi nén ngữ cảnh, phiên của
// agent con.
// Nguồn: Claude Code ở ~/.claude/projects và $CLAUDE_CONFIG_DIR/projects; Codex ở ~/.codex/sessions và $CODEX_HOME/sessions.
// Mật khẩu, token, khoá trông thấy được thì thay bằng [ĐÃ ẨN]; bộ lọc không bắt được hết, agent đọc vẫn phải để ý.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { HIDDEN, redact } from './lib/redact.mjs';

const args = process.argv.slice(2);

// Soát option trước khi đọc gì: option gõ sai mà vẫn chạy thì script rút luôn mọi phiên, kể cả dự án người dùng dặn bỏ, ra thư mục
// tạm. --help in cách dùng lấy từ chú thích đầu tệp rồi thoát, không rút gì.
const VALUE_FLAGS = new Set(['--home', '--out', '--since', '--batch-size', '--only', '--exclude']);
const BOOL_FLAGS = new Set(['--user-only']);
const usage = () => fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1)
  .filter((l) => l.startsWith('//')).slice(0, 16).map((l) => l.replace(/^\/\/ ?/, '')).join('\n');
if (args.includes('--help') || args.includes('-h')) {
  console.log(usage());
  process.exit(0);
}
const argErrors = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (BOOL_FLAGS.has(a)) continue;
  if (VALUE_FLAGS.has(a)) {
    if (!args[i + 1] || args[i + 1].startsWith('--')) argErrors.push(`${a} thiếu giá trị`);
    else i++;
    continue;
  }
  argErrors.push(a.startsWith('-') ? `không biết option ${a}` : `không biết tham số ${a}`);
}
const sinceArg = args.includes('--since') ? args[args.indexOf('--since') + 1] : undefined;
if (sinceArg && !sinceArg.startsWith('--') && Number.isNaN(new Date(sinceArg).getTime())) argErrors.push(`--since không phải ngày: ${sinceArg}`);
if (argErrors.length) {
  console.error(`Không rút gì, vì: ${argErrors.join('; ')}.\n\n${usage()}`);
  process.exit(2);
}

const valueOf = (name) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : undefined;
};

const home = path.resolve(valueOf('--home') ?? os.homedir());
const outDir = path.resolve(valueOf('--out') ?? path.join(os.tmpdir(), 'vina-me-learn'));
const since = valueOf('--since') ? new Date(valueOf('--since')) : null;
const batchSize = Number(valueOf('--batch-size') ?? 60000);
const valuesOf = (name) => args.flatMap((a, i) => (a === name && args[i + 1] && !args[i + 1].startsWith('--') ? [args[i + 1].toLowerCase()] : []));
const only = valuesOf('--only');
const exclude = valuesOf('--exclude');
const wanted = (cwd) => {
  const c = String(cwd ?? '').toLowerCase();
  return (!only.length || only.some((x) => c.includes(x))) && !exclude.some((x) => c.includes(x));
};
const MAX_MSG = 2000;
const userOnly = args.includes('--user-only');
const THINK_LEN = 300;
const REPLY_LEN = 200;

const unique = (xs) => [...new Set(xs.map((x) => path.resolve(x)))];
const claudeRoots = unique([
  path.join(home, '.claude', 'projects'),
  ...(process.env.CLAUDE_CONFIG_DIR && !valueOf('--home') ? [path.join(process.env.CLAUDE_CONFIG_DIR, 'projects')] : []),
]).filter((p) => fs.existsSync(p));
const codexRoots = unique([
  path.join(home, '.codex', 'sessions'),
  ...(process.env.CODEX_HOME && !valueOf('--home') ? [path.join(process.env.CODEX_HOME, 'sessions')] : []),
]).filter((p) => fs.existsSync(p));

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.jsonl')) out.push(p);
  }
  return out;
}

function* records(file) {
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { yield JSON.parse(line); } catch { /* dòng hỏng thì bỏ */ }
  }
}

// redact() chỉ che "mật khẩu là x" khi "là" đứng ngay sau "mật khẩu", nên câu kể "mật khẩu wifi văn phòng là x" lọt. Ở đây
// cho tối đa bốn chữ chen giữa; vẫn chỉ che khi x có số hay ký tự đặc biệt, để câu thường ("mật khẩu mới là do IT cấp") còn
// nguyên. Chỉ nhận chữ chỉ mật khẩu, không nhận "khoá", "token", vì "khoá học năm nay là 2026" là câu thường.
const LOOSE_PASSWORD = /(\b(?:password|passwd|pass|mật khẩu|mat khau)(?:\s+[^\s:=]+){1,4}?\s+(?:là|is)\s+)(?=\S*[\d@#$%^&*!?_])(?!\[ĐÃ ẨN\])\S+/gi;
function redactLoose(text) {
  return text.replace(LOOSE_PASSWORD, `$1${HIDDEN}`);
}

// s là phiên đang đọc: số chỗ đã che cộng vào s.hidden, để chỉ đếm những phiên được giữ lại sau khi lọc.
function clean(text, s) {
  let t = text.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '').replace(/\r\n/g, '\n').trim();
  if (t.length < 4) return '';
  const before = t.split(HIDDEN).length;
  t = redactLoose(redact(t));
  s.hidden += t.split(HIDDEN).length - before;
  if (t.length > MAX_MSG) t = `${t.slice(0, MAX_MSG)}\n[cắt bớt ${t.length - MAX_MSG} ký tự]`;
  return t;
}

// Tóm gọn một đoạn của agent: che bí mật, bỏ dấu markdown, gộp thành một dòng, cắt ở n ký tự.
function brief(text, n, s) {
  const t = clean(String(text ?? '').normalize('NFC'), s).replace(/\[cắt bớt \d+ ký tự\]$/, '').replace(/\*\*|`/g, '').replace(/\s+/g, ' ').trim();
  // cắt theo ký tự chứ không theo đơn vị UTF-16, để không cắt đôi một chữ có dấu hay một emoji
  const chars = [...t];
  return chars.length > n ? `${chars.slice(0, n).join('').trimEnd()}...` : t;
}

// Tên skill từ đường dẫn .../skills/<tên>/SKILL.md trong một lệnh hay tham số công cụ.
const SKILL_PATH = /skills[\\/]+([^\\/"'\s]+)[\\/]+SKILL\.md/gi;
const skillsIn = (text) => [...String(text ?? '').matchAll(SKILL_PATH)].map((m) => m[1]);

const textOf = (content) =>
  typeof content === 'string' ? content
    : Array.isArray(content) ? content.filter((c) => c.type === 'text' || c.type === 'input_text').map((c) => c.text).join('\n')
    : '';

// Mỗi phiên: { agent, cwd, start, messages: [{ time, text, think, reply, skills }] }
// Phần agent của lượt đang đọc gắn vào tin người dùng gần nhất: think lấy khối suy nghĩ đầu tiên có chữ, reply lấy đoạn
// chữ cuối cùng (thường là câu trả lời chốt), skills gom tên skill đã gọi.
function addAgent(s, part) {
  const m = s.messages.at(-1);
  if (!m || userOnly) return;
  if (part.think && !m.think) m.think = brief(part.think, THINK_LEN, s) || undefined;
  if (part.reply) m.reply = brief(part.reply, REPLY_LEN, s) || m.reply;
  for (const k of part.skills ?? []) (m.skills ??= new Set()).add(k);
}

function readClaude(file) {
  const s = { agent: 'Claude Code', cwd: '', start: null, messages: [], hidden: 0 };
  for (const o of records(file)) {
    if (o.type === 'assistant' && !o.isSidechain) {
      for (const c of Array.isArray(o.message?.content) ? o.message.content : []) {
        if (c.type === 'thinking' && c.thinking?.trim()) addAgent(s, { think: c.thinking });
        else if (c.type === 'text' && c.text?.trim()) addAgent(s, { reply: c.text });
        else if (c.type === 'tool_use') addAgent(s, { skills: c.name === 'Skill' && c.input?.skill ? [c.input.skill] : skillsIn(JSON.stringify(c.input)) });
      }
      continue;
    }
    if (o.type !== 'user' || o.isMeta || o.isCompactSummary || o.isSidechain) continue;
    const c = o.message?.content;
    if (Array.isArray(c) && c.some((x) => x.type === 'tool_result')) continue;
    if (o.origin && o.origin.kind !== 'human') continue;
    const raw = textOf(c);
    if (raw.trimStart().startsWith('<')) continue; // lệnh gạch chéo, lệnh !, thông báo task
    const text = clean(raw, s);
    if (!text) continue;
    s.cwd ||= o.cwd ?? '';
    s.start ??= o.timestamp;
    s.messages.push({ time: o.timestamp, text });
  }
  return s;
}

const CODEX_INJECTED = /^\s*(# AGENTS\.md instructions|<environment_context>|<recommended_plugins>|<INSTRUCTIONS>|<user_instructions>|<user_shell_command>|<turn_aborted>)/;
function readCodex(file) {
  const s = { agent: 'Codex', cwd: '', start: null, messages: [], hidden: 0 };
  let last = '';
  for (const o of records(file)) {
    if (o.type === 'session_meta') { s.cwd ||= o.payload?.cwd ?? ''; s.start ??= o.payload?.timestamp ?? o.timestamp; continue; }
    if (o.type !== 'response_item') continue;
    const p = o.payload ?? {};
    if (p.type === 'reasoning') { addAgent(s, { think: (p.summary ?? []).map((x) => x.text).join(' ') }); continue; }
    if (p.type === 'message' && p.role === 'assistant') { addAgent(s, { reply: textOf((p.content ?? []).map((c) => ({ ...c, type: 'text' }))) }); continue; }
    if (p.type === 'function_call' || p.type === 'custom_tool_call') { addAgent(s, { skills: skillsIn(p.arguments ?? p.input) }); continue; }
    if (p.type !== 'message' || p.role !== 'user') continue;
    let raw = textOf(o.payload.content);
    if (CODEX_INJECTED.test(raw)) continue;
    const marker = raw.indexOf('## My request for Codex:'); // tiện ích IDE chèn ngữ cảnh trước lời người dùng
    if (marker >= 0) raw = raw.slice(marker + '## My request for Codex:'.length);
    const text = clean(raw, s);
    if (!text || text === last) continue;
    last = text;
    s.messages.push({ time: o.timestamp, text });
  }
  return s;
}

const found = [
  // Cùng một phiên có thể nằm ở cả ~/.claude và $CLAUDE_CONFIG_DIR: gộp theo tên tệp (mã phiên).
  ...[...new Map(claudeRoots.flatMap((r) => walk(r))
    .filter((f) => !f.includes(`${path.sep}subagents${path.sep}`))
    .map((f) => [path.basename(f), f])).values()].map(readClaude),
  ...codexRoots.flatMap((r) => walk(r)).map(readCodex),
].filter((s) => s.messages.length && (!since || new Date(s.start) >= since));
const sessions = found.filter((s) => wanted(s.cwd)).sort((a, b) => String(a.start).localeCompare(String(b.start)));
// Số phiên bị --only, --exclude bỏ ra, đếm theo từng nguồn, để agent báo người dùng đúng con số đã kiểm chứ không đoán.
const dropped = { 'Claude Code': 0, Codex: 0 };
for (const s of found) if (!wanted(s.cwd)) dropped[s.agent]++;
const droppedLine = only.length || exclude.length
  ? `Đã bỏ ${dropped['Claude Code']} phiên Claude Code, ${dropped.Codex} phiên Codex${exclude.length ? ` có thư mục làm việc chứa: ${exclude.join(', ')}` : ''}${only.length ? `; chỉ giữ phiên có thư mục làm việc chứa: ${only.join(', ')}` : ''}.`
  : '';

const stamp = (iso) => (iso ? new Date(iso).toLocaleString('sv-SE', { hour12: false }).slice(0, 16) : '?');
function agentLines(m) {
  return [
    m.think && `    agent nghĩ: ${m.think}`,
    m.reply && `    agent trả lời: ${m.reply}`,
    m.skills?.size && `    skill: ${[...m.skills].join(', ')}`,
  ].filter(Boolean);
}
const blocks = sessions.map((s) =>
  [`## ${stamp(s.start)} · ${s.agent} · ${s.cwd || 'không rõ thư mục'}`, '',
    ...s.messages.flatMap((m) => [`[${stamp(m.time).slice(11)}] ${m.text.replace(/\n/g, '\n    ')}`, ...agentLines(m)]), ''].join('\n'));

// Chỉ xoá kết quả của lần chạy trước, không xoá cả thư mục: --out trỏ nhầm vào một thư mục có sẵn thì không mất gì, và tệp
// nháp agent ghi trong thư mục này vẫn còn khi chạy lại.
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) if (f === 'overview.md' || /^batch-\d+\.md$/.test(f)) fs.rmSync(path.join(outDir, f));
const batches = [];
let cur = '';
for (const b of blocks) {
  if (cur && cur.length + b.length > batchSize) { batches.push(cur); cur = ''; }
  cur += b + '\n';
}
if (cur) batches.push(cur);
batches.forEach((b, i) => {
  const name = `batch-${String(i + 1).padStart(2, '0')}.md`;
  fs.writeFileSync(path.join(outDir, name), `# Đợt ${i + 1} trên ${batches.length}: lời người dùng trong các phiên cũ${userOnly ? '' : ', kèm tóm gọn phần agent'}\n\n${b}`, 'utf8');
});

const byProject = {};
for (const s of sessions) byProject[s.cwd || 'không rõ'] = (byProject[s.cwd || 'không rõ'] ?? 0) + s.messages.length;
const total = sessions.reduce((n, s) => n + s.messages.length, 0);
const hiddenCount = sessions.reduce((n, s) => n + s.hidden, 0);
const skillUse = {};
for (const s of sessions) for (const m of s.messages) for (const k of m.skills ?? []) skillUse[k] = (skillUse[k] ?? 0) + 1;
const skillRows = Object.entries(skillUse).sort((a, b) => b[1] - a[1]).slice(0, 15);
// Mốc cuối là tin muộn nhất chứ không phải giờ mở phiên cuối: phiên mở 09:00 mà tin cuối 16:10 thì khoảng ngày phải tới
// 16:10, vì agent chép khoảng này vào dòng thói quen skill.
const times = sessions.flatMap((s) => [s.start, ...s.messages.map((m) => m.time)]).filter(Boolean);
const lastTime = times.reduce((a, b) => (new Date(b) > new Date(a) ? b : a), times[0]);
// Che trong đợt không xoá được bản đã dán: giá trị vẫn nằm trong lịch sử phiên và đã gửi lên nhà cung cấp mô hình. Các lần
// chấm trước agent chỉ báo "đã che 2 chỗ" mà quên khuyên đổi, nên nhắc ngay ở chỗ agent đọc con số đó.
const CHANGE_SECRETS = 'Chỗ đã che chỉ ẩn trong đợt; giá trị vẫn nằm trong lịch sử phiên và đã gửi lên nhà cung cấp mô hình từ lúc dán. Khi báo người dùng, gọi tên từng thứ đã che (tìm `[ĐÃ ẨN]` trong đợt, không chép giá trị) và khuyên đổi từng thứ còn dùng được.';
const summary = [
  '# Tổng quan', '',
  `Rút ngày ${new Date().toLocaleDateString('vi-VN')}. ${sessions.length} phiên, ${total} tin của người dùng, chia ${batches.length} đợt.`,
  `Đã che ${hiddenCount} chỗ trông như mật khẩu, token, khoá. Bộ lọc dựa trên mẫu chữ nên có thể sót.`,
  ...(hiddenCount ? [CHANGE_SECRETS] : []),
  droppedLine,
  sessions.length ? `Từ ${stamp(sessions[0].start)} tới ${stamp(lastTime)}.` : '',
  '', '| Thư mục làm việc | Số tin |', '|---|---|',
  ...Object.entries(byProject).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`),
  ...(skillRows.length ? ['', '| Skill agent đã gọi | Số lượt |', '|---|---|', ...skillRows.map(([k, v]) => `| ${k} | ${v} |`)] : []),
  '', 'Cách đọc và soạn nháp bộ nhớ: `references/agent-memory.md`, mục "Học từ phiên cũ".', '',
].join('\n');
fs.writeFileSync(path.join(outDir, 'overview.md'), summary, 'utf8');

console.log(`Nguồn Claude Code: ${claudeRoots.join(', ') || 'không có'}`);
console.log(`Nguồn Codex: ${codexRoots.join(', ') || 'không có'}`);
console.log(`${sessions.length} phiên, ${total} tin, ${batches.length} đợt, đã che ${hiddenCount} chỗ, ghi ở ${outDir}`);
if (droppedLine) console.log(droppedLine);
if (hiddenCount) console.log(CHANGE_SECRETS);
console.log('Lưu ý: agent đọc các đợt này thì nội dung được gửi lên nhà cung cấp mô hình. Dự án nào không muốn gửi thì chạy lại với --exclude.');
