#!/usr/bin/env node
// Soát bộ tệp hồ sơ kỹ thuật (references/bid/package.md): mã tài liệu dẫn chéo giữa các tệp phải có tệp thật, mục được dẫn
// phải có trong tệp đó, mục lục KT-00 phải kê đủ mọi tệp.
// Dùng: node package-check.mjs <thư mục bộ tệp> [--prefix KT] [--sources work/tl/sources.md]
//   Tệp trong thư mục đặt tên bắt đầu bằng mã: "KT-01 Bang dap ung....docx", "KT-02A Dell ....pdf".
//   Chỗ dẫn được soát: "KT-04, mục 3.2", "KT-05 phần D, mục 3", "KT-02A, tr. 19" (trang có trong PDF).
// Lỗi thì thoát mã 1.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readParagraphs, isHeading } from './lib/doc-text.mjs';
import { pdfPages, pdftotext } from './lib/poppler.mjs';
import { pagesAfter } from './lib/page-refs.mjs';

const argv = process.argv.slice(2);
let prefix = 'KT';
let sourcesFile;
const dirs = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--prefix') prefix = argv[++i];
  else if (argv[i] === '--sources') sourcesFile = argv[++i];
  else dirs.push(argv[i]);
}
if (dirs.length !== 1) { console.log('Dùng: node package-check.mjs <thư mục bộ tệp> [--prefix KT]'); process.exit(2); }
const dir = dirs[0];
const codeRe = new RegExp(`\\b${prefix}-\\d{2}[A-Z]?\\b`, 'g');
const errors = [];
const warnings = [];

// Mã của từng tệp.
const files = new Map(); // mã -> [tệp]
for (const f of fs.readdirSync(dir)) {
  const m = f.match(new RegExp(`^(${prefix}-\\d{2}[A-Z]?)[ _.]`));
  if (!m) continue;
  if (!files.has(m[1])) files.set(m[1], []);
  files.get(m[1]).push(path.join(dir, f));
}
if (!files.size) { console.log(`Không có tệp nào đặt tên bắt đầu bằng mã ${prefix}-NN trong ${dir}`); process.exit(1); }

const docx = (code) => (files.get(code) ?? []).find((f) => /\.docx$/i.test(f));
const pdf = (code) => (files.get(code) ?? []).find((f) => /\.pdf$/i.test(f));
for (const [code, fs_] of files) {
  if (fs_.some((f) => /\.docx$/i.test(f)) && !fs_.some((f) => /\.pdf$/i.test(f))) warnings.push(`${code}: có Word, chưa có PDF xuất từ Word`);
}

// Đề mục của từng tệp Word, để soát "mục 3.2", "phần D".
const heads = new Map();
const paras = new Map();
for (const code of files.keys()) {
  const f = docx(code);
  if (!f) continue;
  const ps = readParagraphs(f);
  paras.set(code, ps);
  const hs = new Set();
  for (const p of ps) {
    if (!isHeading(p.style) && !(p.style === 'Normal' && p.text.length < 120 && /^[A-Z\d]/.test(p.text))) continue;
    const m = p.text.match(/^([A-Z]|[IVX]+|\d+(?:\.\d+)*)\.\s/);
    if (m) hs.add(m[1]);
  }
  heads.set(code, hs);
}
const pageCount = new Map();
const pagesOf = (code) => {
  if (!pageCount.has(code)) { const ps = pdfPages(pdf(code)); pageCount.set(code, ps.at(-1)?.trim() ? ps.length : ps.length - 1); }
  return pageCount.get(code);
};

let refs = 0;
const cited = new Map(); // mã tài liệu hãng -> trang -> tệp dẫn đầu tiên
for (const [from, ps] of paras) {
  for (const p of ps) {
    for (const m of p.text.matchAll(codeRe)) {
      const code = m[0];
      if (code === from) continue;
      refs++;
      if (!files.has(code)) { errors.push(`${from} dẫn ${code} nhưng không có tệp nào mang mã đó: "${p.text.slice(0, 90)}"`); continue; }
      const after = p.text.slice(m.index + code.length, m.index + code.length + 60);
      // "KT-05, phần D, mục 3" / "KT-04 mục 3.2" / "KT-02A, tr. 19-20"
      const part = after.match(/^,?\s*phần\s+([A-Z])\b/);
      const sec = after.match(/^,?\s*(?:phần\s+[A-Z],?\s*)?mục\s+(\d+(?:\.\d+)*)/);
      // Mọi trang được dẫn (kể cả "tr. 6, 14 và 27", "tr. 19 (bảng 9, bảng 10); tr. 30"), để soát bản dịch và chỗ tô ở dưới;
      // cùng cách đọc với bid-check (lib/page-refs.mjs).
      const pg = pagesAfter(p.text.slice(m.index + code.length, m.index + code.length + 160));
      // Chú thích hình ("Hình 1: Máy Dell Precision 7960 Tower (KT-02A, tr. 7)") chỉ nói ảnh cắt từ trang nào: trang đó không
      // chứng minh thông số nên không bắt tô, không bắt dịch (tô chữ không liên quan cho đủ luật bị trừ điểm ở s4i).
      const caption = /caption|chú thích/i.test(p.style) || /^Hình\s+\d+\s*[:.]/i.test(p.text);
      if (pg && from !== code && !caption) {
        for (const k of pg.pages) {
          if (!cited.has(code)) cited.set(code, new Map());
          if (!cited.get(code).has(k)) cited.get(code).set(k, from);
        }
      }
      if ((part || sec) && heads.has(code)) {
        if (part && !heads.get(code).has(part[1])) errors.push(`${from} dẫn ${code} phần ${part[1]} nhưng ${code} không có phần đó`);
        // Có "phần X, mục N" thì mục đánh số lại trong từng phần; chỉ soát số mục khi không kèm phần.
        if (sec && !part && !heads.get(code).has(sec[1])) errors.push(`${from} dẫn ${code} mục ${sec[1]} nhưng ${code} không có đề mục ${sec[1]}`);
      }
      if (pg && pdf(code)) {
        const last = Math.max(...pg.pages);
        if (last > pagesOf(code)) errors.push(`${from} dẫn ${code} trang ${last} nhưng ${code} chỉ có ${pagesOf(code)} trang`);
      }
    }
  }
}

// Tài liệu hãng (mã có chữ, chỉ có PDF): trang nào được dẫn ở bất kỳ tệp nào cũng phải có chỗ tô vàng; tài liệu có phần trong
// bản dịch (đề mục "KT-02A: ...", trang "Trang N: ...") thì trang được dẫn phải có trong bản dịch, kể cả trang chỉ thuyết minh dẫn.
{
  const translated = new Map(); // mã -> Set trang đã dịch
  // Đề mục có thể mang số thứ tự ("A.1. Trang 1: ...", "1. KT-02A: ...").
  const num = String.raw`(?:[A-Z\d]{1,3}(?:\.\d+)*\.?\s+)?`;
  const origRows = []; // { code, page, text }: ô cột "Bản gốc" của bản dịch, soát ở dưới
  for (const [code, ps] of paras) {
    if (!/-\d{2}$/.test(code)) continue;
    let cur;
    let page;
    let origCol = -1;
    for (const p of ps) {
      const h = p.text.match(new RegExp(`^${num}(${prefix}-\\d{2}[A-Z])\\s*:`));
      if (h && isHeading(p.style) && !/^https?:/.test(p.text.slice(h[0].length).trim())) { cur = h[1]; page = undefined; if (!translated.has(cur)) translated.set(cur, new Set()); continue; }
      const t = p.text.match(new RegExp(String.raw`^${num}Trang\s+(\d+)(?:\s*(?:-|–|đến)\s*(\d+))?\s*:`));
      if (t && cur && isHeading(p.style)) { for (let k = Number(t[1]); k <= Number(t[2] ?? t[1]); k++) translated.get(cur).add(k); page = t[2] ? undefined : Number(t[1]); continue; }
      if (p.style !== 'table') { origCol = -1; continue; }
      const cells = p.text.split(' | ');
      const hc = cells.findIndex((c) => /^bản gốc\b/i.test(c.trim()));
      if (hc >= 0) { origCol = hc; continue; }
      if (origCol >= 0 && cur && page && cells[origCol]?.trim()) origRows.push({ code: cur, page, text: cells[origCol] });
    }
  }
  // Cột "Bản gốc" chỉ chép chữ có trên trang gốc. Chữ tự viết ("Highlighted line: ...", "(hidden when printed)", "(continued
  // from previous row)") làm người chấm tưởng hãng ghi thế. So từng cặp từ liền nhau của ô với chữ trang gốc (cả -layout lẫn
  // -raw, vì -layout có lúc mất nhãn bảng): từ hai cặp liền nhau trở lên không có trên trang thì nêu. Ô nối nhiều cột của trang
  // gốc bằng "/" hay ";" thì so từng mảnh, vì chỗ nối hai cột không phải cặp từ của trang.
  {
    const words = (x) => x.normalize('NFC').toLowerCase().replace(/[™®©●•]/g, ' ').replace(/[‐-―]/g, '-').match(/[\p{L}\d][\p{L}\d.+\-/]*[\p{L}\d]|[\p{L}\d]/gu) ?? [];
    const pairCache = new Map();
    const pairsOf = (code, n) => {
      const key = `${code}|${n}`;
      if (!pairCache.has(key)) {
        const set = new Set();
        for (const mode of ['-layout', '-raw']) {
          // Trang ngắt dòng ngay sau gạch nối hay gạch chéo ("5G-" / "CA", "SAS/" / "Optical"): nối lại như ô bản dịch viết.
          const w = words(pdftotext(pdf(code), [mode, '-f', String(n), '-l', String(n)]).replace(/([-/])[ \t]*\r?\n[ \t]*/g, '$1'));
          for (let i = 0; i + 1 < w.length; i++) set.add(`${w[i]} ${w[i + 1]}`);
          w.forEach((x) => set.add(`1:${x}`));
        }
        pairCache.set(key, set);
      }
      return pairCache.get(key);
    };
    const found = new Map(); // mã -> [mẫu]
    for (const r of origRows) {
      if (!pdf(r.code) || docx(r.code) || r.page > pagesOf(r.code)) continue;
      const set = pairsOf(r.code, r.page);
      // Ô "Nhãn: <tên cột>: giá trị" (bảng nhiều cột, package.md mục Dịch) cũng tách theo dấu hai chấm.
      for (const piece of r.text.split(/\s+\/\s+|\s*;\s*|\s+\|\s+|:\s+/)) {
        const w = words(piece);
        let run = [];
        const flush = () => {
          // Mọi từ đều có trên trang thì chỉ là chỗ nối các cột của bảng gốc ("Dimensions Ultra 208.5"): bỏ qua. Từ ngắn ("at",
          // "of") không tính là từ lạ.
          const alien = (x) => x.length >= 3 && !set.has(`1:${x}`);
          if (run.length >= 2 && run.some(([a, b]) => alien(a) || alien(b))) {
            if (!found.has(r.code)) found.set(r.code, []);
            found.get(r.code).push(`tr. ${r.page} "${[run[0][0], ...run.map(([, b]) => b)].join(' ').slice(0, 50)}"`);
          }
          run = [];
        };
        for (let i = 0; i + 1 < w.length; i++) {
          if (set.has(`${w[i]} ${w[i + 1]}`)) flush(); else run.push([w[i], w[i + 1]]);
        }
        flush();
      }
    }
    for (const [code, list] of found) warnings.push(`Bản dịch ${code}, cột "Bản gốc" có chữ không có trên trang gốc (${list.slice(0, 6).join('; ')}${list.length > 6 ? `; còn ${list.length - 6} chỗ` : ''}): cột bản gốc chỉ chép chữ của trang, ghi chú của người dịch để ở cột tiếng Việt`);
  }
  const hl = fileURLToPath(new URL('./pdf-highlight.mjs', import.meta.url));
  for (const [code, pages] of cited) {
    if (docx(code) || !pdf(code)) continue;
    const tr = translated.get(code);
    if (tr) {
      const miss = [...pages].filter(([n]) => !tr.has(n));
      for (const [n, from] of miss) errors.push(`${from} dẫn ${code} tr. ${n} nhưng bản dịch không có trang đó (đề mục "Trang ${n}: ..." dưới "${code}: ..."): dịch đủ mọi trang được dẫn ở bất kỳ tệp nào`);
    }
    const r = spawnSync(process.execPath, [hl, '--list', pdf(code)], { encoding: 'utf8' });
    const lit = new Set([...(r.stdout ?? '').matchAll(/Trang (\d+): \d+ chỗ tô/g)].map((m) => Number(m[1])));
    if (r.status === 0) for (const [n, from] of pages) if (!lit.has(n) && n <= pagesOf(code)) errors.push(`${from} dẫn ${code} tr. ${n} nhưng trang đó chưa tô vàng chữ được dẫn`);
  }
}

// Giá bán trên bản in trang hãng (cửa hàng, giá khuyến nghị): hồ sơ kỹ thuật không mang giá. Kê hết để báo cáo chép đủ.
{
  const PRICE = /(?:US\$|A\$|S\$|AU\$|\$|€|£|₫|\b(?:AUD|USD|SGD|EUR|VND|MYR|RM)\b)\s?\d[\d.,]*|\d[\d.,]{2,}\s?(?:₫|\b(?:VND|USD|AUD|SGD|MYR)\b)/i;
  for (const [code, fs_] of files) {
    if (!/[A-Z]$/.test(code) || docx(code) || !pdf(code)) continue;
    const ps = pdfPages(pdf(code));
    // Mọi số tiền khác nhau trên từng trang, không chỉ số đầu: báo cáo chép nguyên dòng này cho BA.
    const G = new RegExp(PRICE.source, 'gi');
    const at = ps.map((t, i) => {
      const all = [...new Set([...t.matchAll(G)].map((m) => m[0].trim()))];
      return all.length ? `tr. ${i + 1} ${all.map((x) => `"${x}"`).join(', ')}` : null;
    }).filter(Boolean);
    if (at.length) warnings.push(`${code} có giá bán (${at.join('; ')}): in lại bằng fetch-doc --hide-price, hoặc báo cáo nêu để BA quyết`);
  }
}

// KT-00 kê đủ mọi tệp; số trang KT-00 ghi cho mỗi tài liệu khớp số trang PDF thật.
const index = [...paras.keys()].find((c) => /-00$/.test(c));
if (!index) warnings.push(`Không có mục lục ${prefix}-00`);
else {
  const listed = new Set(paras.get(index).flatMap((p) => p.text.match(codeRe) ?? []));
  for (const code of files.keys()) if (code !== index && !listed.has(code)) errors.push(`${index} không kê tài liệu ${code}`);
  let pageCol = -1;
  for (const p of paras.get(index)) {
    if (p.style !== 'table') { pageCol = -1; continue; }
    const cells = p.text.split(' | ');
    const head = cells.findIndex((c) => /^số trang$/i.test(c.trim()));
    if (head >= 0) { pageCol = head; continue; }
    const code = cells[0].match(codeRe)?.[0];
    // Số trang ở cột "Số trang" của bảng, hoặc viết trong chữ ("29 trang").
    const n = (pageCol >= 0 && /^\d+$/.test(cells[pageCol]?.trim() ?? '') ? cells[pageCol].trim() : undefined) ?? p.text.match(/(\d+)\s*trang\b/)?.[1];
    if (!code || !n || code === index || !pdf(code)) continue;
    if (Number(n) !== pagesOf(code)) errors.push(`${index} ghi ${code} có ${n} trang nhưng PDF có ${pagesOf(code)} trang`);
  }
}

// Mọi tài liệu tự tải (dòng trong sources.md) phải có link trong bộ tệp, để người chấm tự mở lại được nguồn.
if (sourcesFile) {
  const allText = [...paras.values()].flatMap((ps) => ps.map((p) => p.text)).join(' ').replace(/\s+/g, '');
  // Nhiều lần hỏng chỉ khác mã vùng (en-us, de-de, nl-nl) là một link tự ghép thử đi thử lại, chưa phải đã tìm.
  const failed = new Map();
  for (const line of fs.readFileSync(sourcesFile, 'utf8').split('\n')) {
    const url = line.match(/https?:\/\/[^\s|]+/)?.[0];
    if (!url || !/LỖI|404/.test(line)) continue;
    const key = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/[a-z]{2}[-_][a-z]{2}\//gi, '/*/');
    if (!failed.has(key)) failed.set(key, []);
    failed.get(key).push(url);
  }
  // Đã tải được một tài liệu khác cùng tên miền thì lần hỏng chỉ là dấu vết đã tìm. Chưa tải được gì: có mục "Lần tìm" ghi câu
  // tìm thì chỉ XEM (link có thể đúng là kết quả tìm kiếm trả về, như link /asset/ cũ của Dell), không có thì LỖI.
  const srcText = fs.readFileSync(sourcesFile, 'utf8');
  const host = (u) => u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
  const okHosts = new Set(srcText.split('\n').filter((l) => !/LỖI|404|không tải|không dùng/i.test(l)).map((l) => l.match(/https?:\/\/[^\s|]+/)?.[0]).filter(Boolean).map(host));
  const searched = /^##\s*Lần tìm[\s\S]*?\n\|[^\n]*\n\|[-| ]+\n\|/m.test(srcText);
  // Mục "Lần tìm" (từ đề mục "## Lần tìm" tới đề mục ## sau): link trong đó là kết quả tìm đã xem, không phải tài liệu đã tải.
  const searchSec = srcText.match(/^##\s*Lần tìm[^\n]*\n([\s\S]*?)(?=^##\s|(?![\s\S]))/m)?.[1] ?? '';
  // Mỗi hàng bảng đáp ứng còn "[chưa có chứng minh: ...]" có ít nhất một dòng "Lần tìm" ghi số thứ tự của hàng đó (cột "Dòng
  // KT-01"): s4i để dấu cho tản nhiệt, 24/7, zoom mà không tìm lần nào.
  {
    const need = new Map(); // STT -> dấu
    for (const ps of paras.values()) for (const p of ps) {
      if (p.style !== 'table') continue;
      const stt = p.text.split(' | ')[0].trim();
      const mk = p.text.match(/\[chưa có chứng minh:[^\]]*\]/i);
      if (mk && /^\d+(?:\.\d+)*$/.test(stt) && !need.has(stt)) need.set(stt, mk[0]);
    }
    for (const [stt, mk] of need) {
      if (!new RegExp(`(?<![\d.])${stt.replace(/\./g, '\.')}(?![\d]|\.\d)`).test(searchSec)) errors.push(`Dòng ${stt} còn ${mk.slice(0, 60)} mà mục "Lần tìm" của sources.md không có dòng nào cho dòng ${stt}: tìm thông số đó (tài liệu thiết bị, tài liệu linh kiện, trang hỗ trợ), ghi câu tìm, nguồn đã xem và kết quả, cột "Dòng KT-01" ghi ${stt}`);
    }
  }
  for (const [key, urls] of failed) {
    if (urls.length < 2 || okHosts.has(host(urls[0]))) continue;
    const msg = `${urls.length} lần tải hỏng chỉ khác mã vùng (${key}): đổi mã vùng không ra link mới; chạy WebSearch "<model> spec sheet" với allowed_domains là tên miền của hãng (không viết site: trong câu), lấy link trong kết quả, ghi câu tìm vào mục "Lần tìm" của sources.md`;
    (searched ? warnings : errors).push(msg);
  }
  for (const line of srcText.replace(searchSec, '').split('\n')) {
    const cells = line.split('|').map((c) => c.trim());
    const url = cells.find((c) => /^https?:\/\//.test(c));
    const code = line.match(codeRe)?.[0];
    if (!url || /LỖI|không tải|không dùng/i.test(line)) continue;
    // Link dài hay bị cắt bớt tham số khi ghi vào hồ sơ: so phần đầu (máy chủ và đường dẫn) tới 60 ký tự.
    const head = url.replace(/[?#].*$/, '').slice(0, 60);
    if (!allText.includes(head)) errors.push(`Tài liệu ${code ?? '(không rõ mã)'} tải từ ${head}... nhưng bộ tệp không ghi link đó (KT-00 hay bảng mã đầu KT-01)`);
  }
}

for (const e of errors) console.log(`LỖI  ${e}`);
for (const w of warnings) console.log(`XEM  ${w}`);
console.log(`${dir}: ${files.size} mã tài liệu, ${refs} chỗ dẫn chéo, ${errors.length} lỗi, ${warnings.length} chỗ cần xem lại.`);
process.exit(errors.length ? 1 : 0);
