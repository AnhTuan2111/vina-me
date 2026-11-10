// Gọi pdftotext của Poppler. Git for Windows kèm pdftotext của xpdf (không có -bbox-layout, ngắt trang khác) và hay đứng
// trước trong PATH của Git Bash, nên dò từng thư mục trong PATH lấy bản Poppler đầu tiên. Biến PDFTOTEXT chỉ thẳng đường dẫn.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

let found;
export function popplerPdftotext() {
  if (found) return found;
  if (process.env.PDFTOTEXT) return (found = process.env.PDFTOTEXT);
  for (const dir of (process.env.PATH ?? '').split(path.delimiter)) {
    for (const name of ['pdftotext.exe', 'pdftotext']) {
      const f = path.join(dir, name);
      if (!fs.existsSync(f)) continue;
      const r = spawnSync(f, ['-v'], { encoding: 'utf8' });
      if (/poppler/i.test(`${r.stdout}${r.stderr}`)) return (found = f);
    }
  }
  console.error('Không tìm thấy pdftotext của Poppler trong PATH; cài Poppler hoặc đặt biến PDFTOTEXT.');
  process.exit(2);
}

export const pdftotext = (pdf, args = []) =>
  execFileSync(popplerPdftotext(), [...args, pdf, '-'], { encoding: 'utf8', maxBuffer: 1 << 28 });

// Chữ từng trang, trang 1 ở phần tử 0 (pdftotext ngăn trang bằng ký tự \f).
export const pdfPages = (pdf) => pdftotext(pdf, ['-layout']).split('\f');
