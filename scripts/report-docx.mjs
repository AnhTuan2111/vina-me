#!/usr/bin/env node
// Dựng tệp docx từ một tệp JSON, theo quy ước ở references/docx-export.md.
// Dùng: node report-docx.mjs <content.json> <out.docx> [--text <out.md>]. Lần đầu chạy, script tự cài gói docx (xem load-docx.mjs).
// --text ghi thêm toàn bộ chữ của báo cáo ra một tệp Markdown để soát bằng lint.mjs (lint không đọc JSON hay docx).
import fs from 'node:fs';
import path from 'node:path';
import { loadDocx } from './load-docx.mjs';

const docx = loadDocx();
const {
  Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType, LevelFormat, BorderStyle, ShadingType, Table, TableRow, TableCell, WidthType,
  Footer, PageNumber,
} = docx;

const args = process.argv.slice(2);
const textAt = args.indexOf('--text');
const textOut = textAt >= 0 ? args.splice(textAt, 2)[1] : null;
const [input, output] = args;
if (!input || !output || (textAt >= 0 && !textOut)) {
  console.error('Dùng: node report-docx.mjs <content.json> <out.docx> [--text <out.md>]');
  process.exit(1);
}
const baseDir = path.dirname(path.resolve(input));
const data = JSON.parse(fs.readFileSync(input, 'utf8'));

// Phông cả tệp: khoá "font" của JSON (người dùng đòi Times New Roman thì đặt ở đó), mặc định Arial.
const FONT = data.font ?? 'Arial';
const MONO = 'Consolas';
const PX_PER_CM = 96 / 2.54; // docx tính cỡ ảnh theo điểm ảnh 96 dpi
const MAX_W = Math.round(16 * PX_PER_CM); // điểm ảnh của 16 cm; bề ngang chữ của A4 lề 2 cm là 17 cm
const MAX_H = Math.round(22 * PX_PER_CM); // bề cao chữ của A4 lề 2 cm là 25,7 cm, chừa chỗ cho chú thích và một đoạn
const imageLog = [];

// Đọc kích thước ảnh PNG hoặc JPEG mà không cần thư viện ngoài.
function imageSize(buf) {
  if (buf.readUInt32BE(0) === 0x89504e47) return { type: 'png', w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { type: 'jpg', h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  throw new Error('Chỉ nhận ảnh PNG hoặc JPEG');
}

// Tách `mã` trong chữ thành phông đều.
function runs(text, base = {}) {
  const out = [];
  const parts = String(text).split(/(`[^`]+`)/);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('`') && part.endsWith('`')) {
      out.push(new TextRun({ text: part.slice(1, -1), font: MONO, size: 19,
        shading: { type: ShadingType.CLEAR, fill: 'F1EEE8', color: 'auto' } }));
    } else out.push(new TextRun({ text: part, font: FONT, ...base }));
  }
  return out;
}

const para = (children, after = 120, opts = {}) => new Paragraph({ spacing: { after }, ...opts, children });

// Bảng: { columns: [...], rows: [[...]], widths: [phần trăm] }. Ô trống để người nhận tự điền.
const TEXT_W = 11906 - 2 * 1134; // bề ngang chữ của A4 lề 2 cm, đơn vị DXA
function table(t) {
  const n = t.columns.length;
  const pct = t.widths ?? Array(n).fill(100 / n);
  const widths = pct.map((x) => Math.round(TEXT_W * x / 100));
  widths[n - 1] = TEXT_W - widths.slice(0, -1).reduce((a, b) => a + b, 0);
  const border = { style: BorderStyle.SINGLE, size: 4, color: 'BFB8AA' };
  const borders = { top: border, bottom: border, left: border, right: border };
  // keep: giữ hàng cùng trang với đoạn ngay sau nó. Hàng tiêu đề giữ với hàng đầu; hàng cuối giữ với chú thích, để chú thích
  // không rơi một mình sang trang mới. Hàng nào cũng cantSplit nên ô nhiều dòng không bị cắt đôi qua hai trang.
  const cell = (text, i, head, keep) => new TableCell({
    width: { size: widths[i], type: WidthType.DXA }, borders,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    ...(head ? { shading: { type: ShadingType.CLEAR, fill: 'EFEAE0', color: 'auto' } } : {}),
    children: String(text ?? '').split(/\r?\n/).map((line) => new Paragraph({ spacing: { after: 0 }, keepNext: keep,
      children: runs(line, head ? { bold: true, size: 20 } : { size: 20 }) })),
  });
  const last = t.rows.length - 1;
  return [
    new Table({ width: { size: TEXT_W, type: WidthType.DXA }, columnWidths: widths, rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: t.columns.map((c, i) => cell(c, i, true, true)) }),
      ...t.rows.map((r, ri) => new TableRow({ cantSplit: true,
        children: t.columns.map((_, i) => cell(r[i], i, false, ri === last && !!t.caption)) })),
    ] }),
    ...(t.caption ? [para(runs(t.caption, { italics: true, color: '666666', size: 18 }), 200, { keepLines: true })] : [para([], 160)]),
  ];
}

// Ảnh: rộng theo "widthCm" nếu có, không thì bằng bề ngang ảnh, tối đa 16 cm; ảnh cao quá 22 cm thì thu cả hai chiều cho
// vừa trang. In ra cỡ in và số mm của một điểm ảnh gốc để tính chữ trong ảnh in ra to cỡ nào (docx-export.md, mục Ảnh).
function image(img) {
  const file = path.resolve(baseDir, img.file);
  const buf = fs.readFileSync(file);
  const { type, w, h } = imageSize(buf);
  let width = Math.min(MAX_W, img.widthCm ? Math.round(img.widthCm * PX_PER_CM) : w);
  let height = Math.round(h * width / w);
  const tall = height > MAX_H;
  if (tall) { height = MAX_H; width = Math.round(w * height / h); }
  const cm = (px) => (px / PX_PER_CM).toFixed(1);
  imageLog.push(`${img.file}: in ${cm(width)} x ${cm(height)} cm, 1 điểm ảnh gốc = ${(width / PX_PER_CM * 10 / w).toFixed(3)} mm`
    + (tall ? '; ảnh cao quá trang nên đã thu nhỏ, cắt sát phần được nói tới thì in được to hơn' : ''));
  const caption = img.caption ?? '';
  return [
    new Paragraph({ spacing: { before: 120, after: 40 }, keepNext: true, children: [
      new ImageRun({ type, data: buf, transformation: { width, height },
        altText: { title: caption, description: caption, name: path.basename(file) } }),
    ] }),
    para(runs(caption, { italics: true, color: '666666', size: 18 }), 200, { keepLines: true }),
  ];
}

// Đoạn mã, log, cấu hình trích nguyên văn: mỗi dòng một đoạn phông đều nền xám, giữ cả khối trên một trang.
function code(text) {
  const lines = String(text).replace(/\r\n/g, '\n').split('\n');
  return lines.map((line, i) => new Paragraph({
    spacing: { before: i ? 0 : 60, after: i === lines.length - 1 ? 160 : 0, line: 240 },
    keepNext: i < lines.length - 1, keepLines: true,
    shading: { type: ShadingType.CLEAR, fill: 'F1EEE8', color: 'auto' },
    children: [new TextRun({ text: line, font: MONO, size: 18 })],
  }));
}

const bullet = (b) => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 80 }, children: runs(b) });

// Khối theo thứ tự tự do trong "blocks": chuỗi là một đoạn văn, hoặc { table }, { image }, { bullets }, { code }.
// Đoạn văn đứng ngay trước danh sách giữ cùng trang với nó, để câu dẫn không nằm một mình cuối trang.
function block(b, next) {
  if (typeof b === 'string') return [para(runs(b), 120, next?.bullets ? { keepNext: true } : {})];
  if (b.table) return table(b.table);
  if (b.image) return image(b.image);
  if (b.bullets) return b.bullets.map(bullet);
  if (b.code != null) return code(b.code);
  throw new Error(`Khối không hiểu được trong blocks: ${JSON.stringify(b).slice(0, 80)}`);
}

const children = [];
children.push(new Paragraph({ heading: HeadingLevel.TITLE, children: runs(data.title) }));
if (data.meta) children.push(para(runs(data.meta, { color: '555555', size: 20 }), 240));
// Đoạn mở ngay dưới nhan đề, trước mục 1: nói ngay việc gì xảy ra, khi nào, ảnh hưởng tới đâu. Nhận khối như "blocks".
(data.intro ?? []).forEach((b, i, a) => children.push(...block(b, a[i + 1])));

(data.sections ?? []).forEach((sec, si) => {
  children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: runs(`${si + 1}. ${sec.heading}`) }));
  const leadsList = !sec.blocks?.length && !sec.tables?.length && sec.bullets?.length;
  (sec.paragraphs ?? []).forEach((p, i, a) => children.push(para(runs(p), 120, leadsList && i === a.length - 1 ? { keepNext: true } : {})));
  (sec.blocks ?? []).forEach((b, i, a) => children.push(...block(b, a[i + 1])));
  for (const t of sec.tables ?? []) children.push(...table(t));
  for (const b of sec.bullets ?? []) children.push(bullet(b));
  (sec.items ?? []).forEach((it, ii) => {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: runs(`${si + 1}.${ii + 1}. ${it.title}`) }));
    for (const p of it.paragraphs ?? []) children.push(para(runs(p)));
    (it.blocks ?? []).forEach((b, i, a) => children.push(...block(b, a[i + 1])));
    for (const [label, text] of it.fields ?? []) {
      children.push(para([new TextRun({ text: label + ' ', bold: true, font: FONT }), ...runs(text)]));
    }
    for (const t of it.tables ?? []) children.push(...table(t));
    for (const img of it.images ?? []) children.push(...image(img));
  });
});

const heading = (id, name, size, color, before, outlineLevel, border) => ({
  id, name, basedOn: 'Normal', next: 'Normal', quickFormat: true,
  run: { font: FONT, size, bold: true, color },
  paragraph: { spacing: { before, after: 120 }, keepNext: true, outlineLevel, ...(border ? { border } : {}) },
});

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: 22 }, paragraph: { spacing: { line: 300 } } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', run: { font: FONT, size: 34, bold: true },
        paragraph: { spacing: { before: 0, after: 120 }, keepNext: true } },
      heading('Heading1', 'Heading 1', 28, '8B1A1A', 360, 0,
        { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'D9D2C4', space: 4 } }),
      heading('Heading2', 'Heading 2', 24, '222222', 280, 1),
    ],
  },
  numbering: { config: [{ reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•',
    alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 },
      margin: { top: 1134, bottom: 1134, left: 1134, right: 1134, footer: 567 } } },
    // Số trang "Trang x / y" giữa chân trang, mặc định bật; "pageNumbers": false thì bỏ.
    ...(data.pageNumbers === false ? {} : { footers: { default: new Footer({ children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: ['Trang ', PageNumber.CURRENT, ' / ', PageNumber.TOTAL_PAGES], font: FONT, size: 20 })],
    })] }) } }),
    children,
  }],
});

// Chữ của báo cáo ra Markdown, cùng thứ tự với tệp Word, để chạy lint.mjs. Bảng thành bảng Markdown, mã thành khối ```.
function textOf() {
  const out = [`# ${data.title}`];
  if (data.meta) out.push(data.meta);
  const cellText = (c) => String(c ?? '').replace(/\r?\n/g, '; ');
  const md = {
    table: (t) => [['| ' + t.columns.join(' | ') + ' |', '|' + t.columns.map(() => '---|').join(''),
      ...t.rows.map((r) => '| ' + t.columns.map((_, i) => cellText(r[i])).join(' | ') + ' |')].join('\n'),
    ...(t.caption ? [t.caption] : [])],
    image: (img) => (img.caption ? [img.caption] : []),
    bullets: (bs) => [bs.map((b) => `- ${b}`).join('\n')],
    code: (c) => ['```\n' + c + '\n```'],
  };
  const blk = (b) => (typeof b === 'string' ? [b] : b.table ? md.table(b.table) : b.image ? md.image(b.image)
    : b.bullets ? md.bullets(b.bullets) : md.code(b.code));
  out.push(...(data.intro ?? []).flatMap(blk));
  (data.sections ?? []).forEach((sec, si) => {
    out.push(`## ${si + 1}. ${sec.heading}`, ...(sec.paragraphs ?? []), ...(sec.blocks ?? []).flatMap(blk),
      ...(sec.tables ?? []).flatMap(md.table), ...(sec.bullets?.length ? md.bullets(sec.bullets) : []));
    (sec.items ?? []).forEach((it, ii) => {
      out.push(`### ${si + 1}.${ii + 1}. ${it.title}`, ...(it.paragraphs ?? []), ...(it.blocks ?? []).flatMap(blk),
        ...(it.fields ?? []).map(([l, t]) => `${l} ${t}`), ...(it.tables ?? []).flatMap(md.table),
        ...(it.images ?? []).flatMap(md.image));
    });
  });
  return out.join('\n\n') + '\n';
}

// Chữ trông như tên trong mã (tên bảng, cột, khoá cấu hình, tên tệp) mà nằm ngoài `…` thì ra phông thường, lẫn vào câu
// văn. Script không tự bọc vì không chắc đó là mã; chỉ in ra để người làm xem lại (docx-export.md, mục Trình bày).
const CODE_LIKE = [
  /\b[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)+\b/g, // snake_case: order_items, MAX_RETRY
  /\b[a-z]{2,}(?:[A-Z][a-z0-9]+)+\b/g, // camelCase: retryCount
  /\b[a-z][a-z0-9]*(?:-[a-z0-9]+){2,}\b/g, // khoá nối gạch từ ba chữ trở lên: max-idle-time (không bắt ngày 2026-01-05)
  /\b[\w-]+(?:\.[\w-]+)*\.(?:ya?ml|json|xml|properties|conf|cfg|ini|toml|env|sql|sh|ps1|py|js|mjs|ts|java|kt|go|log)\b/gi,
  /\b[A-Za-z][\w.-]*=[^\s,;]+/g, // key=value
];
function bareCode(text) {
  const seen = new Map();
  const plain = text.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`\n]+`/g, ' ').replace(/https?:\/\/\S+/g, ' ');
  for (const re of CODE_LIKE) for (const m of plain.matchAll(re)) seen.set(m[0], (seen.get(m[0]) ?? 0) + 1);
  return [...seen].map(([w, n]) => (n > 1 ? `${w} (${n} lần)` : w));
}

// Mốc giờ (08:52, 08:12:40) có mặt ở từ hai mục trở lên. Báo cáo sự cố hay kể một sự việc (khởi động lại, quay bản)
// ở mục thời gian lỗi, ở bảng diễn biến rồi lại ở đoạn sau bảng; script chỉ in ra để người làm xem từng mốc
// (docx-export.md, mục "Chữ trong bảng, dòng nguồn và đoạn cuối"). Nhan đề, meta, intro không tính.
function repeatedTimes() {
  const where = new Map();
  (data.sections ?? []).forEach((sec, si) => {
    const marks = [...JSON.stringify(sec).matchAll(/(?<![\d:])([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?(?![\d:])/g)];
    const count = new Map();
    for (const m of marks) count.set(m[0].slice(0, 5), (count.get(m[0].slice(0, 5)) ?? 0) + 1);
    for (const [t, n] of count) where.set(t, [...(where.get(t) ?? []), n > 1 ? `${si + 1} (${n} lần)` : `${si + 1}`]);
  });
  return [...where].filter(([, s]) => s.length > 1).map(([t, s]) => `${t} ở mục ${s.join(', ')}`);
}

const buf = await Packer.toBuffer(doc);
fs.writeFileSync(output, buf);
console.log(`${output}: ${Math.round(buf.length / 1024)} KB`);
for (const line of imageLog) console.log(line);
const bare = bareCode(textOf());
if (bare.length) {
  console.log(`Chữ giống tên trong mã nằm ngoài \`…\` nên đang để phông thường: ${bare.join(', ')}. `
    + 'Tên bảng, cột, khoá cấu hình, tệp, lệnh thì bọc trong `…`; tên riêng của sản phẩm thì để nguyên.');
}
const times = repeatedTimes();
if (times.length) {
  console.log(`Mốc giờ có ở nhiều mục: ${times.join('; ')}. Xem từng mốc: sự việc ở mốc đó kể một lần (bảng diễn biến), `
    + 'mục khác chỉ nhắc mốc khi cần cho ý của mục ấy, không kể lại sự việc.');
}
if (textOut) {
  fs.writeFileSync(textOut, textOf());
  console.log(`${textOut}: chữ của báo cáo, soát bằng node scripts/lint.mjs ${textOut}`);
}
console.log('Nhớ xuất sang PDF và xem từng trang trước khi gửi.');
