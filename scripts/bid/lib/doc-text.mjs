// Đọc chữ của một tài liệu thành danh sách đoạn { style, text }, dùng cho bid-check.mjs.
// docx: mỗi đoạn một phần tử, style là tên kiểu đoạn (heading 1, List Paragraph…); mỗi hàng bảng thành một phần tử
// style "table", các ô nối bằng " | ". md, txt: mỗi dòng không trống một phần tử, dòng "#" thành heading theo số dấu #.
// PDF thì trích chữ trước bằng pdftotext (xem references/bid/reading.md) rồi đưa tệp .txt vào.
// Chạy thẳng `node scripts/bid/lib/doc-text.mjs <tệp.docx>` để in chữ từng đoạn kèm kiểu: "[heading 2] ...", "[table] ô | ô".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readZip } from './zip.mjs';

export function decodeXml(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, '&');
}

// Map styleId, tên kiểu đoạn; Word ghi styleId ở đoạn, người dùng nhìn thấy tên.
export function styleNames(stylesXml) {
  const names = new Map();
  for (const m of stylesXml.matchAll(/<w:style\b[^>]*w:styleId="([^"]+)"[^>]*>([\s\S]*?)<\/w:style>/g)) {
    const name = m[2].match(/<w:name w:val="([^"]+)"/);
    names.set(m[1], name ? decodeXml(name[1]) : m[1]);
  }
  return names;
}

// <w:noBreakHyphen/> (gạch nối không ngắt dòng của "E-HSMT") đọc thành dấu gạch nối.
const paraText = (xml) => decodeXml([...xml.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>|<w:tab\/>|<w:noBreakHyphen\/>/g)]
  .map((m) => (m[1] !== undefined ? m[1] : m[0] === '<w:tab/>' ? '\t' : '-')).join(''));

export function docxParagraphs(buf) {
  const zip = readZip(buf);
  const doc = zip.get('word/document.xml')?.toString('utf8');
  if (!doc) throw new Error('Tệp docx không có word/document.xml');
  const names = styleNames(zip.get('word/styles.xml')?.toString('utf8') ?? '');
  const body = doc.slice(doc.indexOf('<w:body>'));
  const out = [];
  // Đi lần lượt qua thân tài liệu: gặp bảng thì lấy trọn bảng (kể cả bảng lồng trong ô, chữ của bảng lồng gộp vào ô
  // chứa nó), gặp đoạn thì lấy đoạn. Đoạn nằm trong bảng không bị lấy hai lần vì con trỏ nhảy qua cả bảng.
  const tokens = /<w:tbl>|<w:p(?:\s[^>]*)?\/>|<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g;
  let m;
  while ((m = tokens.exec(body))) {
    if (m[0] === '<w:tbl>') {
      let j = m.index + 7;
      let depth = 1;
      while (depth > 0) {
        const open = body.indexOf('<w:tbl>', j);
        const close = body.indexOf('</w:tbl>', j);
        if (close === -1) { j = body.length; break; }
        if (open !== -1 && open < close) { depth++; j = open + 7; } else { depth--; j = close + 8; }
      }
      for (const row of body.slice(m.index, j).matchAll(/<w:tr(?:\s[^>]*)?>[\s\S]*?<\/w:tr>/g)) {
        const cells = [...row[0].matchAll(/<w:tc>([\s\S]*?)<\/w:tc>/g)]
          // Dấu "|" trong ô (bảng nhiều cột của tài liệu hãng chép vào một ô) đổi thành "/" để không lẫn với ranh ô.
          .map((c) => [...c[1].matchAll(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g)].map((x) => paraText(x[0])).join(' ').replace(/\|/g, '/').trim());
        if (cells.some(Boolean)) out.push({ style: 'table', text: cells.join(' | ') });
      }
      tokens.lastIndex = j;
      continue;
    }
    const text = paraText(m[0]).trim();
    if (!text) continue;
    const id = m[0].match(/<w:pStyle w:val="([^"]+)"/)?.[1];
    out.push({ style: id ? (names.get(id) ?? id) : 'Normal', text });
  }
  return out;
}

export function readParagraphs(file) {
  if (/\.docx$/i.test(file)) return docxParagraphs(fs.readFileSync(file));
  return fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').split('\n').map((l) => l.trim()).filter(Boolean)
    .map((line) => {
      const h = line.match(/^(#{1,6})\s+(.*)$/);
      return h ? { style: `heading ${h[1].length}`, text: h[2] } : { style: 'Normal', text: line };
    });
}

// realpath hai phía: chạy qua junction hay symlink thì import.meta.url là đường thật, argv[1] là đường đã gõ.
const real = (f) => { try { return fs.realpathSync(f); } catch { return path.resolve(f); } };
if (process.argv[1] && real(process.argv[1]) === real(fileURLToPath(import.meta.url))) {
  if (!process.argv[2]) { console.error('Dùng: node scripts/bid/lib/doc-text.mjs <tệp.docx|.md|.txt>'); process.exit(2); }
  for (const p of readParagraphs(process.argv[2])) console.log(`[${p.style}] ${p.text}`);
}

export const isHeading = (style) => /^(heading \d|title|muc|toc heading)/i.test(style);
