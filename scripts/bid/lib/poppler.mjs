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
  // stderr bỏ đi: Poppler in "Syntax Warning: Invalid Font Weight" với nhiều bản in trang web, lẫn vào kết quả soát.
  execFileSync(popplerPdftotext(), [...args, pdf, '-'], { encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] });

// Chữ từng trang, trang 1 ở phần tử 0 (pdftotext ngăn trang bằng ký tự \f).
export const pdfPages = (pdf) => pdftotext(pdf, ['-layout']).split('\f');

// Khối chữ từng trang theo -bbox-layout: mỗi khối là một ô bảng hay một đoạn, các dòng của khối nối bằng dấu cách ("Khe cắm
// tai nghe/Khe" và "cắm đa năng (USB Type-C)" là một khối). Trang 1 ở phần tử 0.
const dec = (s) => s.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
export const pdfBlocks = (pdf) => [...pdftotext(pdf, ['-bbox-layout']).matchAll(/<page\b[^>]*>([\s\S]*?)<\/page>/g)].map((pg) =>
  [...pg[1].matchAll(/<block\b[^>]*>([\s\S]*?)<\/block>/g)].map((b) => dec([...b[1].matchAll(/<word\b[^>]*>([^<]*)<\/word>/g)].map((w) => w[1]).join(' '))));
