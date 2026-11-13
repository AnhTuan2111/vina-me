#!/usr/bin/env node
// Gửi góp ý của người dùng vina-me thành issue trên repo của skill, để tác giả biết quy tắc nào sai, thiếu hay script nào lỗi.
//
//   node scripts/feedback.mjs --title "<một câu nói chỗ sai>" --body-file <tệp> [--agent "Claude Code"] [--dry-run]
//
// --body-file - thì đọc nội dung từ stdin. --repo <chủ/tên> để gửi sang repo khác (bộ test dùng repo không tồn tại).
//
// Script che mật khẩu, token trông thấy được, gắn "Góp ý: " vào đầu tiêu đề, thêm dòng phiên bản skill vào cuối, rồi:
// - máy có gh đã đăng nhập: tạo issue bằng gh, in link issue vừa tạo;
// - chưa có, hoặc gh tạo không được: in link trang tạo issue đã điền sẵn, người dùng đăng nhập GitHub rồi bấm gửi.
// --dry-run chỉ in nội dung sẽ gửi và link dự phòng, không gửi gì.
// Lần chạy nào cũng liệt kê trước những dòng ngoài khối code có vẻ còn dữ liệu dự án (ngày, giờ, số điện thoại, email,
// đường dẫn có tên người), để agent thay bằng chữ chung trước khi đưa người dùng duyệt. Chỉ nhắc, không tự che.
//
// Repo công khai nên ai cũng đọc được issue. Script không nhận ra tài liệu nội bộ hay tên khách hàng; agent phải cho người
// dùng xem bản nháp và chỉ chạy script khi họ đã đồng ý (references/feedback.md).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { redact } from './lib/redact.mjs';

const DEFAULT_REPO = 'AnhTuan2111/vina-me';
const PREFIX = 'Góp ý: ';
const MAX_TITLE = 120;
const MAX_BODY = 6000;
// Trình duyệt và GitHub đều chịu được link khoảng 8.000 ký tự; để dư cho phần đầu link.
const MAX_URL = 7500;

const args = process.argv.slice(2);
const valueOf = (name) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] !== undefined && (args[i + 1] === '-' || !args[i + 1].startsWith('--')) ? args[i + 1] : undefined;
};
const fail = (msg) => { console.error(msg); process.exit(2); };

const repo = valueOf('--repo') ?? DEFAULT_REPO;
const agent = valueOf('--agent') ?? 'không rõ agent';
const dryRun = args.includes('--dry-run');
const bodyFile = valueOf('--body-file');
let title = (valueOf('--title') ?? '').trim();
if (!title) fail('Thiếu --title: một câu nói chỗ skill làm sai hay thiếu.');
if (!bodyFile) fail('Thiếu --body-file <tệp> (hoặc --body-file - để đọc từ stdin).');
if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) fail(`--repo phải có dạng chủ/tên, nhận được "${repo}".`);

let raw;
try {
  raw = fs.readFileSync(bodyFile === '-' ? 0 : bodyFile, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
} catch (e) {
  fail(`Không đọc được nội dung góp ý ở ${bodyFile}: ${e.message}`);
}
let body = raw.trim();
if (!body) fail('Nội dung góp ý đang trống.');

// Dòng có vẻ còn dữ liệu dự án. Ngày, giờ, số điện thoại chỉ xét ngoài khối code và ngoài `...`, vì lệnh và output ở mục
// Cách lặp lại được giữ nguyên; email và đường dẫn có tên người thì xét cả trong code, vì để ở đâu cũng lộ.
const PLAIN_ONLY = [
  ['ngày', /(?<![\d/.])\d{1,2}\/\d{1,2}(?:\/\d{2,4})?(?![\d/])/],
  ['giờ', /(?<![\w.])\d{1,2}(?:h\d{0,2}|:\d{2})(?![\w:])/],
  ['số điện thoại', /(?<![\w.])(?:\+84|0)\d{2,3}[ .-]?\d{3}[ .-]?\d{3,4}(?!\w|\.\d)/],
];
const ANYWHERE = [
  ['email', /[\w.+-]+@[\w-]+\.[\w.-]+/],
  ['đường dẫn có tên người', /(?:\b[A-Za-z]:[\\/]Users[\\/]|\/home\/|\/Users\/)(?!(?:Public|Default)\b|[<[])[^\\/\s`"']+/i],
];
function suspects(text) {
  const found = [];
  let fenced = false;
  text.split('\n').forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; return; }
    const plain = fenced ? '' : line.replace(/`[^`]*`/g, '');
    for (const [kind, re] of PLAIN_ONLY) { const m = plain.match(re); if (m) found.push({ line: i + 1, kind, hit: m[0] }); }
    for (const [kind, re] of ANYWHERE) { const m = line.match(re); if (m) found.push({ line: i + 1, kind, hit: m[0] }); }
  });
  return found;
}
const warn = suspects(raw);

// Phiên bản đọc từ SKILL.md nằm cạnh thư mục scripts, để biết góp ý ứng với bản nào.
function skillVersion() {
  const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'SKILL.md');
  try { return fs.readFileSync(file, 'utf8').match(/^\s*version:\s*"?([^"\n]+)"?/m)?.[1]?.trim() ?? 'không rõ'; } catch { return 'không rõ'; }
}

title = redact(title).replace(/\s+/g, ' ');
if (!title.toLowerCase().startsWith(PREFIX.toLowerCase())) title = PREFIX + title;
if (title.length > MAX_TITLE) title = `${title.slice(0, MAX_TITLE - 3)}...`;

// Tên các mục (dòng **...** hay # ...) nằm trong phần bị cắt, để agent nói với người dùng mất những mục nào.
const headingsIn = (text) => [...text.matchAll(/^(?:#{1,6}[ \t]+(.+?)|\*\*(.+?)\*\*:?)[ \t]*$/gm)].map((m) => (m[1] ?? m[2]).trim());

body = redact(body);
let bodyCut = null;
if (body.length > MAX_BODY) {
  bodyCut = { total: body.length, lost: headingsIn(body.slice(MAX_BODY)) };
  body = `${body.slice(0, MAX_BODY)}\n\n[cắt bớt ${body.length - MAX_BODY} ký tự]`;
}
body += `\n\n---\nGửi qua scripts/feedback.mjs: vina-me ${skillVersion()}, ${agent}, ${process.platform}`;

// Link trang tạo issue điền sẵn tiêu đề và nội dung; nội dung quá dài thì cắt cho link vừa giới hạn. Chữ có dấu khi mã hoá
// vào link dài lên sáu tới chín lần, nên bản nháp tiếng Việt vừa phải cũng hay bị cắt; trả kèm chỗ cắt để báo rõ.
function issueUrl() {
  const base = `https://github.com/${repo}/issues/new`;
  const make = (t) => `${base}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(t)}`;
  const withMark = (n) => (n < body.length ? `${body.slice(0, n)}\n\n[cắt bớt cho vừa link]` : body);
  let kept = body.length;
  while (make(withMark(kept)).length > MAX_URL && kept > 200) kept = Math.floor(kept * 0.8);
  return { url: make(withMark(kept)), kept };
}

function printFallback(reason) {
  const { url, kept } = issueUrl();
  console.log(reason);
  if (kept < body.length) {
    const lost = headingsIn(body.slice(kept));
    const at = headingsIn(body.slice(0, kept)).at(-1);
    const where = [at && `cắt giữa mục ${at}`, lost.length && `mất mục: ${lost.join(', ')}`].filter(Boolean).join('; ');
    console.log(`Link chỉ mang được ${kept}/${body.length} ký tự đầu của nội dung, gửi qua link thì issue thiếu phần sau`
      + `${where ? ` (${where})` : ''}. Người dùng cần dán nốt phần còn lại từ tệp nháp vào ô nội dung trước khi bấm gửi.`);
  }
  console.log('Mở link dưới, đăng nhập GitHub, xem lại rồi bấm "Submit new issue":');
  console.log(url);
}

// In trước phần nội dung để agent không bỏ sót khi output dài.
if (warn.length) {
  console.log(`Xem lại ${warn.length} chỗ có vẻ còn dữ liệu dự án (thay bằng chữ chung như [ngày], [giờ], [số điện thoại] nếu là của dự án):`);
  for (const w of warn) console.log(`  dòng ${w.line}, ${w.kind}: ${redact(w.hit)}`);
  console.log('');
}
if (bodyCut) {
  console.log(`Nội dung dài ${bodyCut.total} ký tự, quá mức ${MAX_BODY} nên đã cắt phần cuối`
    + `${bodyCut.lost.length ? ` (mất mục: ${bodyCut.lost.join(', ')})` : ''}. Rút gọn bản nháp rồi chạy lại.`);
  console.log('');
}

if (dryRun) {
  console.log(`Sẽ gửi tới github.com/${repo}`);
  console.log(`Tiêu đề: ${title}`);
  console.log('Nội dung:');
  console.log(body);
  console.log('');
  printFallback('Chạy thử, chưa gửi gì.');
  process.exit(0);
}

const gh = (...a) => spawnSync('gh', a, { encoding: 'utf8', timeout: 30000 });
if (gh('auth', 'status').status !== 0) {
  printFallback('Máy này chưa có gh đăng nhập GitHub nên chưa tự gửi được.');
  process.exit(0);
}

// gh cần nội dung trong một tệp; ghi vào thư mục tạm rồi xoá ngay sau khi gửi.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vina-me-feedback-'));
const tmpFile = path.join(tmpDir, 'body.md');
fs.writeFileSync(tmpFile, body, 'utf8');
const r = gh('issue', 'create', '--repo', repo, '--title', title, '--body-file', tmpFile);
fs.rmSync(tmpDir, { recursive: true, force: true });
if (r.status === 0) {
  console.log(`Đã gửi góp ý: ${r.stdout.trim()}`);
  process.exit(0);
}
printFallback(`gh chưa tạo được issue: ${(r.stderr || r.stdout || 'không rõ lý do').trim().split('\n')[0]}`);
