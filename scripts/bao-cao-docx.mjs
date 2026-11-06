#!/usr/bin/env node
// Dựng tệp docx từ một tệp JSON, theo quy ước ở references/xuat-docx.md.
// Dùng: NODE_PATH=<thư mục node_modules có gói docx> node bao-cao-docx.mjs <noi-dung.json> <ra.docx>
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let docx;
try {
  docx = require('docx');
} catch {
  console.error('Không tìm thấy gói "docx". Chạy "npm install docx" ở một thư mục rồi đặt NODE_PATH trỏ tới node_modules của nó.');
  process.exit(1);
}
const {
  Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType, LevelFormat, BorderStyle, ShadingType, Table, TableRow, TableCell, WidthType,
} = docx;

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error('Dùng: node bao-cao-docx.mjs <noi-dung.json> <ra.docx>');
  process.exit(1);
}
const baseDir = path.dirname(path.resolve(input));
const data = JSON.parse(fs.readFileSync(input, 'utf8'));

const FONT = 'Arial';
const MONO = 'Consolas';
const MAX_W = 600; // điểm ảnh, xấp xỉ 16 cm trên A4 lề 2 cm

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

const para = (children, after = 120) => new Paragraph({ spacing: { after }, children });

// Bảng: { columns: [...], rows: [[...]], widths: [phần trăm] }. Ô trống để người nhận tự điền.
const TEXT_W = 11906 - 2 * 1134; // bề ngang chữ của A4 lề 2 cm, đơn vị DXA
function table(t) {
  const n = t.columns.length;
  const pct = t.widths ?? Array(n).fill(100 / n);
  const widths = pct.map((x) => Math.round(TEXT_W * x / 100));
  widths[n - 1] = TEXT_W - widths.slice(0, -1).reduce((a, b) => a + b, 0);
  const border = { style: BorderStyle.SINGLE, size: 4, color: 'BFB8AA' };
  const borders = { top: border, bottom: border, left: border, right: border };
  const cell = (text, i, head) => new TableCell({
    width: { size: widths[i], type: WidthType.DXA }, borders,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    ...(head ? { shading: { type: ShadingType.CLEAR, fill: 'EFEAE0', color: 'auto' } } : {}),
    children: String(text ?? '').split(/\r?\n/).map((line) => new Paragraph({ spacing: { after: 0 },
      children: runs(line, head ? { bold: true, size: 20 } : { size: 20 }) })),
  });
  return [
    new Table({ width: { size: TEXT_W, type: WidthType.DXA }, columnWidths: widths, rows: [
      new TableRow({ tableHeader: true, children: t.columns.map((c, i) => cell(c, i, true)) }),
      ...t.rows.map((r) => new TableRow({ children: t.columns.map((_, i) => cell(r[i], i, false)) })),
    ] }),
    ...(t.caption ? [para(runs(t.caption, { italics: true, color: '666666', size: 18 }), 200)] : [para([], 160)]),
  ];
}

function image(img) {
  const file = path.resolve(baseDir, img.file);
  const buf = fs.readFileSync(file);
  const { type, w, h } = imageSize(buf);
  const width = Math.min(MAX_W, w);
  const height = Math.round(h * width / w);
  const caption = img.caption ?? '';
  return [
    new Paragraph({ spacing: { before: 120, after: 40 }, keepNext: true, children: [
      new ImageRun({ type, data: buf, transformation: { width, height },
        altText: { title: caption, description: caption, name: path.basename(file) } }),
    ] }),
    para(runs(caption, { italics: true, color: '666666', size: 18 }), 200),
  ];
}

const children = [];
children.push(new Paragraph({ heading: HeadingLevel.TITLE, children: runs(data.title) }));
if (data.meta) children.push(para(runs(data.meta, { color: '555555', size: 20 }), 240));

(data.sections ?? []).forEach((sec, si) => {
  children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: runs(`${si + 1}. ${sec.heading}`) }));
  for (const p of sec.paragraphs ?? []) children.push(para(runs(p)));
  for (const t of sec.tables ?? []) children.push(...table(t));
  for (const b of sec.bullets ?? []) {
    children.push(new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 80 }, children: runs(b) }));
  }
  (sec.items ?? []).forEach((it, ii) => {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: runs(`${si + 1}.${ii + 1}. ${it.title}`) }));
    for (const p of it.paragraphs ?? []) children.push(para(runs(p)));
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
  sections: [{ properties: { page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } }, children }],
});

const buf = await Packer.toBuffer(doc);
fs.writeFileSync(output, buf);
console.log(`${output}: ${Math.round(buf.length / 1024)} KB`);
console.log('Nhớ xuất sang PDF và xem từng trang trước khi gửi.');
