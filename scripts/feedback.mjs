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

let body;
try {
  body = fs.readFileSync(bodyFile === '-' ? 0 : bodyFile, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n').trim();
} catch (e) {
  fail(`Không đọc được nội dung góp ý ở ${bodyFile}: ${e.message}`);
}
if (!body) fail('Nội dung góp ý đang trống.');

// Phiên bản đọc từ SKILL.md nằm cạnh thư mục scripts, để biết góp ý ứng với bản nào.
function skillVersion() {
  const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'SKILL.md');
  try { return fs.readFileSync(file, 'utf8').match(/^\s*version:\s*"?([^"\n]+)"?/m)?.[1]?.trim() ?? 'không rõ'; } catch { return 'không rõ'; }
}

title = redact(title).replace(/\s+/g, ' ');
if (!title.toLowerCase().startsWith(PREFIX.toLowerCase())) title = PREFIX + title;
if (title.length > MAX_TITLE) title = `${title.slice(0, MAX_TITLE - 3)}...`;

body = redact(body);
if (body.length > MAX_BODY) body = `${body.slice(0, MAX_BODY)}\n\n[cắt bớt ${body.length - MAX_BODY} ký tự]`;
body += `\n\n---\nGửi qua scripts/feedback.mjs: vina-me ${skillVersion()}, ${agent}, ${process.platform}`;

// Link trang tạo issue điền sẵn tiêu đề và nội dung; nội dung quá dài thì cắt cho link vừa giới hạn.
function issueUrl() {
  const base = `https://github.com/${repo}/issues/new`;
  let text = body;
  const make = (t) => `${base}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(t)}`;
  while (make(text).length > MAX_URL && text.length > 200) text = `${text.slice(0, Math.floor(text.length * 0.8))}\n\n[cắt bớt cho vừa link]`;
  return make(text);
}

function printFallback(reason) {
  console.log(reason);
  console.log('Mở link dưới, đăng nhập GitHub, xem lại rồi bấm "Submit new issue":');
  console.log(issueUrl());
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
