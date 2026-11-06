#!/usr/bin/env node
// Rút lời người dùng trong các phiên cũ của Claude Code và Codex ra thành các đợt văn bản ngắn, để agent đọc rồi soạn
// nháp bộ nhớ cho người dùng duyệt. Script không ghi gì vào bộ nhớ.
//
//   node scripts/learn-from-sessions.mjs                    mọi phiên, ghi ra <thư mục tạm>/vina-me-learn
//   node scripts/learn-from-sessions.mjs --since 2026-09-01 chỉ phiên từ ngày đó
//   node scripts/learn-from-sessions.mjs --out <thư mục>    chọn chỗ ghi
//   --home <thư mục>   thử trên home khác;  --batch-size <số ký tự>  độ dài mỗi đợt (mặc định 60000)
//
// Lấy gì: chỉ tin người dùng tự gõ. Bỏ output công cụ, lời agent, khối hệ thống tự chèn (AGENTS.md, environment_context,
// system-reminder), thông báo task, lệnh gạch chéo, tóm tắt khi nén ngữ cảnh, phiên của agent con.
// Nguồn: Claude Code ở ~/.claude/projects và $CLAUDE_CONFIG_DIR/projects; Codex ở ~/.codex/sessions và $CODEX_HOME/sessions.
// Mật khẩu, token, khoá trông thấy được thì thay bằng [ĐÃ ẨN]; bộ lọc không bắt được hết, agent đọc vẫn phải để ý.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const valueOf = (name) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : undefined;
};

const home = path.resolve(valueOf('--home') ?? os.homedir());
const outDir = path.resolve(valueOf('--out') ?? path.join(os.tmpdir(), 'vina-me-learn'));
const since = valueOf('--since') ? new Date(valueOf('--since')) : null;
const batchSize = Number(valueOf('--batch-size') ?? 60000);
const MAX_MSG = 2000;

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

// Che bí mật trông thấy được. Giữ tên khoá để agent vẫn hiểu câu, chỉ thay giá trị.
const HIDDEN = '[ĐÃ ẨN]';
function redact(text) {
  return text
    .replace(/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, HIDDEN)
    // "mật khẩu: x", "token=x" thì che luôn; "mật khẩu là x" chỉ che khi x có số hay ký tự đặc biệt, vì câu thường cũng hay
    // có "mật khẩu là ...". Hai luật này chạy trước các mẫu token để một giá trị không bị che hai lần.
    .replace(/(\b(?:password|passwd|pwd|pass|mật khẩu|mat khau|mk|token|secret|api[ _-]?key|khoá|khóa)\s*[:=]\s*)("[^"]*"|'[^']*'|\S+)/gi, `$1${HIDDEN}`)
    .replace(/(\b(?:password|pass|mật khẩu|mat khau|mk|token|khoá|khóa)\s+(?:là|is)\s+)(?=\S*[\d@#$%^&*!?_])\S+/gi, `$1${HIDDEN}`)
    .replace(/\b(gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|glpat-[A-Za-z0-9_-]{16,}|sk-[A-Za-z0-9_-]{20,}|xox[abprs]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35})\b/g, HIDDEN)
    .replace(/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g, HIDDEN)
    .replace(/(\b[a-z][a-z0-9+.-]*:\/\/[^\s:/@]+:)[^\s@/]+@/gi, `$1${HIDDEN}@`)
    .replace(/\b(?=[A-Za-z0-9+/_-]{32,}\b)(?=[A-Za-z0-9+/_-]*\d)(?=[A-Za-z0-9+/_-]*[A-Za-z])[A-Za-z0-9+/_-]{32,}={0,2}/g, HIDDEN);
}

function clean(text) {
  let t = text.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '').replace(/\r\n/g, '\n').trim();
  if (t.length < 4) return '';
  t = redact(t);
  if (t.length > MAX_MSG) t = `${t.slice(0, MAX_MSG)}\n[cắt bớt ${t.length - MAX_MSG} ký tự]`;
  return t;
}

const textOf = (content) =>
  typeof content === 'string' ? content
    : Array.isArray(content) ? content.filter((c) => c.type === 'text' || c.type === 'input_text').map((c) => c.text).join('\n')
    : '';

// Mỗi phiên: { agent, cwd, start, messages: [{ time, text }] }
function readClaude(file) {
  const s = { agent: 'Claude Code', cwd: '', start: null, messages: [] };
  for (const o of records(file)) {
    if (o.type !== 'user' || o.isMeta || o.isCompactSummary || o.isSidechain) continue;
    const c = o.message?.content;
    if (Array.isArray(c) && c.some((x) => x.type === 'tool_result')) continue;
    if (o.origin && o.origin.kind !== 'human') continue;
    const raw = textOf(c);
    if (raw.trimStart().startsWith('<')) continue; // lệnh gạch chéo, lệnh !, thông báo task
    const text = clean(raw);
    if (!text) continue;
    s.cwd ||= o.cwd ?? '';
    s.start ??= o.timestamp;
    s.messages.push({ time: o.timestamp, text });
  }
  return s;
}

const CODEX_INJECTED = /^\s*(# AGENTS\.md instructions|<environment_context>|<recommended_plugins>|<INSTRUCTIONS>|<user_instructions>|<user_shell_command>|<turn_aborted>)/;
function readCodex(file) {
  const s = { agent: 'Codex', cwd: '', start: null, messages: [] };
  let last = '';
  for (const o of records(file)) {
    if (o.type === 'session_meta') { s.cwd ||= o.payload?.cwd ?? ''; s.start ??= o.payload?.timestamp ?? o.timestamp; continue; }
    if (o.type !== 'response_item' || o.payload?.type !== 'message' || o.payload?.role !== 'user') continue;
    let raw = textOf(o.payload.content);
    if (CODEX_INJECTED.test(raw)) continue;
    const marker = raw.indexOf('## My request for Codex:'); // tiện ích IDE chèn ngữ cảnh trước lời người dùng
    if (marker >= 0) raw = raw.slice(marker + '## My request for Codex:'.length);
    const text = clean(raw);
    if (!text || text === last) continue;
    last = text;
    s.messages.push({ time: o.timestamp, text });
  }
  return s;
}

const sessions = [
  // Cùng một phiên có thể nằm ở cả ~/.claude và $CLAUDE_CONFIG_DIR: gộp theo tên tệp (mã phiên).
  ...[...new Map(claudeRoots.flatMap((r) => walk(r))
    .filter((f) => !f.includes(`${path.sep}subagents${path.sep}`))
    .map((f) => [path.basename(f), f])).values()].map(readClaude),
  ...codexRoots.flatMap((r) => walk(r)).map(readCodex),
]
  .filter((s) => s.messages.length && (!since || new Date(s.start) >= since))
  .sort((a, b) => String(a.start).localeCompare(String(b.start)));

const stamp = (iso) => (iso ? new Date(iso).toLocaleString('sv-SE', { hour12: false }).slice(0, 16) : '?');
const blocks = sessions.map((s) =>
  [`## ${stamp(s.start)} · ${s.agent} · ${s.cwd || 'không rõ thư mục'}`, '',
    ...s.messages.map((m) => `[${stamp(m.time).slice(11)}] ${m.text.replace(/\n/g, '\n    ')}`), ''].join('\n'));

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
const batches = [];
let cur = '';
for (const b of blocks) {
  if (cur && cur.length + b.length > batchSize) { batches.push(cur); cur = ''; }
  cur += b + '\n';
}
if (cur) batches.push(cur);
batches.forEach((b, i) => {
  const name = `batch-${String(i + 1).padStart(2, '0')}.md`;
  fs.writeFileSync(path.join(outDir, name), `# Đợt ${i + 1} trên ${batches.length}: lời người dùng trong các phiên cũ\n\n${b}`, 'utf8');
});

const byProject = {};
for (const s of sessions) byProject[s.cwd || 'không rõ'] = (byProject[s.cwd || 'không rõ'] ?? 0) + s.messages.length;
const total = sessions.reduce((n, s) => n + s.messages.length, 0);
const summary = [
  '# Tổng quan', '',
  `Rút ngày ${new Date().toLocaleDateString('vi-VN')}. ${sessions.length} phiên, ${total} tin của người dùng, chia ${batches.length} đợt.`,
  sessions.length ? `Từ ${stamp(sessions[0].start)} tới ${stamp(sessions.at(-1).start)}.` : '',
  '', '| Thư mục làm việc | Số tin |', '|---|---|',
  ...Object.entries(byProject).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`),
  '', 'Cách đọc và soạn nháp bộ nhớ: `references/agent-memory.md`, mục "Học từ phiên cũ".', '',
].join('\n');
fs.writeFileSync(path.join(outDir, 'overview.md'), summary, 'utf8');

console.log(`Nguồn Claude Code: ${claudeRoots.join(', ') || 'không có'}`);
console.log(`Nguồn Codex: ${codexRoots.join(', ') || 'không có'}`);
console.log(`${sessions.length} phiên, ${total} tin, ${batches.length} đợt, ghi ở ${outDir}`);
