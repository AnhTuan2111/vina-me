// Nạp gói docx cho report-docx.mjs và official-doc-docx.mjs.
// Tìm theo thứ tự: NODE_PATH hay node_modules quanh thư mục script, rồi thư mục cache ~/.cache/vina-me (đổi bằng biến
// VINA_ME_CACHE). Chưa có ở đâu thì tự cài bằng npm vào cache ở lần chạy đầu, để người dùng khỏi tự cài và đặt NODE_PATH.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const CACHE = process.env.VINA_ME_CACHE ?? path.join(os.homedir(), '.cache', 'vina-me');

export function loadDocx() {
  try { return createRequire(import.meta.url)('docx'); } catch { /* chưa có quanh script, thử cache */ }
  const fromCache = createRequire(path.join(CACHE, 'package.json'));
  try { return fromCache('docx'); } catch { /* chưa có trong cache, cài */ }

  console.error(`Chưa có gói docx, đang cài vào ${CACHE} (chỉ lần đầu)...`);
  fs.mkdirSync(CACHE, { recursive: true });
  const pkg = path.join(CACHE, 'package.json');
  if (!fs.existsSync(pkg)) fs.writeFileSync(pkg, '{ "private": true }\n');
  // Trên Windows npm là npm.cmd, phải chạy qua shell; khi đó truyền cả lệnh thành một chuỗi (tham số cố định, không lấy
  // từ người dùng) cho Node khỏi cảnh báo DEP0190.
  const args = ['install', 'docx@9', '--no-audit', '--no-fund', '--silent'];
  const opts = { cwd: CACHE, stdio: 'inherit' };
  const r = process.platform === 'win32'
    ? spawnSync(`npm ${args.join(' ')}`, { ...opts, shell: true })
    : spawnSync('npm', args, opts);
  if (r.status !== 0) {
    console.error('Không cài được gói docx (máy chưa có npm hoặc không có mạng). Cài tay: "npm install docx" ở một thư mục,');
    console.error('rồi chạy script với NODE_PATH trỏ tới node_modules của thư mục đó.');
    process.exit(1);
  }
  return fromCache('docx');
}
