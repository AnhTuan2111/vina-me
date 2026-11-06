#!/usr/bin/env node
// Dựng văn bản hành chính (báo cáo, tờ trình, kế hoạch, công văn...) ra tệp docx theo thể thức Nghị định 30/2020/NĐ-CP,
// Phụ lục I. Nội dung lấy từ một tệp JSON, cấu trúc ở references/docx-export.md.
// Dùng: node official-doc-docx.mjs <content.json> <out.docx>. Lần đầu chạy, script tự cài gói docx (xem load-docx.mjs).
import fs from 'node:fs';
import { loadDocx } from './load-docx.mjs';

const docx = loadDocx();
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, Header,
  PageNumber,
} = docx;

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error('Dùng: node official-doc-docx.mjs <content.json> <out.docx>');
  process.exit(1);
}
const d = JSON.parse(fs.readFileSync(input, 'utf8'));

const FONT = 'Times New Roman';
const MONO = 'Consolas';
const SIZE = 28;                     // cỡ thân bài 14, đơn vị nửa điểm
const MM = 56.7;                     // 1 mm theo DXA
const MARGIN = { top: Math.round(20 * MM), bottom: Math.round(20 * MM), left: Math.round(30 * MM), right: Math.round(15 * MM) };
const TEXT_WIDTH = 11906 - MARGIN.left - MARGIN.right; // bề ngang chữ trên A4
const FIRST_LINE = 720;              // lùi đầu dòng 1,27 cm
const AFTER = 120;                   // cách đoạn 6pt
const LINE = 288;                    // cách dòng 1,2 lines, trong khoảng dòng đơn tới 1,5 lines
const VI_ALPHABET = 'a b c d đ e g h i k l m n o p q r s t u v x y'.split(' ');
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];

// Chữ thường; `mã` thành phông đều. Kiểu chữ (đậm, nghiêng) ghi rõ ở mọi đoạn, kể cả khi là chữ thường.
function runs(text, style = {}) {
  const base = { font: FONT, size: SIZE, bold: false, italics: false, ...style };
  return String(text ?? '').split(/(`[^`]+`)/).filter(Boolean).map((p) => (p.startsWith('`') && p.endsWith('`')
    ? new TextRun({ ...base, text: p.slice(1, -1), font: MONO, size: base.size - 4 })
    : new TextRun({ ...base, text: p })));
}
const para = (text, o = {}) => new Paragraph({
  alignment: o.align ?? AlignmentType.JUSTIFIED,
  indent: o.indent ?? { firstLine: FIRST_LINE },
  spacing: { after: o.after ?? AFTER, line: LINE, ...(o.before ? { before: o.before } : {}) },
  keepNext: o.keepNext ?? false,
  children: runs(text, o.style),
});
const centered = (text, style, after = 0) => para(text, { align: AlignmentType.CENTER, indent: {}, style, after });
// Đường kẻ ngang ngắn dưới tên cơ quan, Tiêu ngữ, trích yếu: một đoạn rỗng có viền trên, độ dài chỉnh bằng lề hai bên.
const rule = (width, fraction) => {
  const side = Math.round(width * (1 - fraction) / 2);
  return new Paragraph({ indent: { left: side, right: side }, spacing: { before: 40, after: 0, line: 240 },
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 1 } }, children: [new TextRun({ text: '', size: 4 })] });
};
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER, insideHorizontal: NO_BORDER, insideVertical: NO_BORDER };
const cellOf = (w, children) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: noBorders,
  margins: { top: 0, bottom: 0, left: 0, right: 0 }, children });

// Ngày: nhận "2026-01-06" hoặc "06/01/2026", trả "ngày 06 tháng 01 năm 2026" (ngày dưới 10, tháng 1 và 2 thêm số 0).
function dateText(s) {
  if (!s) return 'ngày ... tháng ... năm ...';
  const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/) || s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return s;
  const [y, mo, da] = s.includes('-') ? [m[1], m[2], m[3]] : [m[3], m[2], m[1]];
  const dd = String(+da).padStart(2, '0');
  const mm = +mo <= 2 ? String(+mo).padStart(2, '0') : String(+mo);
  return `ngày ${dd} tháng ${mm} năm ${y}`;
}
// Dòng của khối Kính gửi, Nơi nhận, Căn cứ: chấm phẩy cuối dòng, dấu chấm ở dòng cuối.
const punctuateList = (items) => items.map((l, i) => l.replace(/[;.,\s]+$/, '') + (i === items.length - 1 ? '.' : ';'));

const body = [];
const LEFT = Math.round(TEXT_WIDTH * 0.4), RIGHT = TEXT_WIDTH - LEFT;

// Phần đầu: tên cơ quan, số ký hiệu bên trái; Quốc hiệu, Tiêu ngữ, địa danh và ngày bên phải.
const headLeft = [];
// Tên dài thì tự ngắt dòng bằng \n trong JSON, để không bị ngắt giữa một cụm.
for (const t of String(d.parentAgency ?? '').split('\n').filter(Boolean)) headLeft.push(centered(t.toUpperCase(), { size: 26 }));
for (const t of String(d.agency).split('\n')) headLeft.push(centered(t.toUpperCase(), { size: 26, bold: true }));
headLeft.push(rule(LEFT, 0.4));
const headRight = [
  centered('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', { size: 24, bold: true }),
  centered('Độc lập - Tự do - Hạnh phúc', { size: 28, bold: true }),
  rule(RIGHT, 0.6),
];
const isLetter = !d.docType;          // công văn: không có tên loại, trích yếu đi sau "V/v"
const numberLines = [centered(`Số: ${d.number ?? '.../...'}`, { size: 26 }, 0)];
if (isLetter && d.subject) numberLines.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 },
  children: runs(`V/v ${d.subject}`, { size: 26 }) }));
body.push(new Table({ width: { size: TEXT_WIDTH, type: WidthType.DXA }, columnWidths: [LEFT, RIGHT], borders: noBorders, rows: [
  new TableRow({ children: [cellOf(LEFT, headLeft), cellOf(RIGHT, headRight)] }),
  new TableRow({ children: [cellOf(LEFT, numberLines), cellOf(RIGHT, [centered(`${d.place ?? '...'}, ${dateText(d.date)}`, { size: 28, italics: true })])] }),
] }));

if (!isLetter) {
  body.push(centered('', {}, 240), centered(d.docType.toUpperCase(), { bold: true }));
  if (d.subject) body.push(centered(d.subject, { bold: true }));
  body.push(rule(TEXT_WIDTH, 0.25), centered('', {}, 120));
} else body.push(centered('', {}, 240));

// Căn cứ: nghiêng, mỗi căn cứ một dòng.
for (const l of punctuateList(d.legalBases ?? [])) body.push(para(l, { style: { italics: true } }));

// Kính gửi: một nơi thì cùng dòng; nhiều nơi thì mỗi nơi một dòng, gạch nối ở đầu.
const recipients = d.recipients ?? [];
if (recipients.length === 1) body.push(para(`Kính gửi: ${recipients[0].replace(/[;.]$/, '')}.`, { align: AlignmentType.CENTER, indent: {}, after: 240 }));
else if (recipients.length > 1) {
  body.push(para('Kính gửi:', { indent: { left: 1700 }, after: 0 }));
  punctuateList(recipients).forEach((l, i) => body.push(para(`- ${l}`, { indent: { left: 2700 }, after: i === recipients.length - 1 ? 240 : 0 })));
}

for (const p of d.opening ?? []) body.push(para(p));

// Nội dung: mục I., II. (in hoa, đậm); khoản 1., 2. (đậm nếu có tiêu đề); điểm a), b) theo chữ cái tiếng Việt.
function clause(k, i) {
  const num = `${i + 1}.`;
  if (k.title) body.push(para(`${num} ${k.title}`, { style: { bold: true }, keepNext: true }));
  (k.paragraphs ?? []).forEach((p, j) => body.push(para(!k.title && j === 0 ? `${num} ${p}` : p)));
  (k.points ?? []).forEach((p, j) => {
    const [main, ...subs] = Array.isArray(p) ? p : [p];
    body.push(para(`${VI_ALPHABET[j]}) ${main}`));
    for (const t of subs) body.push(para(`- ${t}`));
  });
  for (const t of k.tables ?? []) body.push(...table(t));
}
(d.body ?? []).forEach((section, i) => {
  body.push(para(`${ROMAN[i]}. ${section.heading.toUpperCase()}`, { style: { bold: true }, keepNext: true, before: 120 }));
  for (const p of section.paragraphs ?? []) body.push(para(p));
  (section.clauses ?? []).forEach(clause);
  for (const t of section.tables ?? []) body.push(...table(t));
});

// Câu kết: dòng cuối phần nội dung kết bằng "./." như các mẫu ở Phụ lục III.
const closing = [...(d.closing ?? [])];
if (closing.length) closing[closing.length - 1] = closing[closing.length - 1].replace(/[.\s/]*$/, '') + './.';
for (const p of closing) body.push(para(p));

// Nơi nhận bên trái, chữ ký bên phải.
const distribution = [...(d.recipients?.length ? ['Như trên'] : []), ...(d.distribution ?? []), `Lưu: ${d.archive ?? 'VT'}`];
const signLeft = [new Paragraph({ spacing: { before: 240 }, children: runs('Nơi nhận:', { size: 24, bold: true, italics: true }) }),
  ...punctuateList(distribution).map((l) => new Paragraph({ children: runs(`- ${l}`, { size: 22 }) }))];
// Dòng đầu hai bên cùng cách phần trên 12pt để "Nơi nhận:" ngang dòng quyền hạn người ký.
const signLines = [d.signingAuthority, d.signerTitle].filter(Boolean).map((t) => t.toUpperCase());
const signRight = signLines.map((t, k) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: k === 0 ? 240 : 0 },
  children: runs(t, { bold: true }) }));
signRight.push(centered('', {}, 1400), centered(d.signer ?? '', { bold: true }));
const HALF = Math.round(TEXT_WIDTH * 0.5);
body.push(new Table({ width: { size: TEXT_WIDTH, type: WidthType.DXA }, columnWidths: [HALF, TEXT_WIDTH - HALF], borders: noBorders, rows: [
  new TableRow({ children: [cellOf(HALF, signLeft), cellOf(TEXT_WIDTH - HALF, signRight)] }),
] }));

// Bảng: { columns, rows, widths (phần trăm), caption }. Chữ cỡ 12.
function table(t) {
  const n = t.columns.length;
  const pct = t.widths ?? Array(n).fill(100 / n);
  const w = pct.map((x) => Math.round(TEXT_WIDTH * x / 100));
  w[n - 1] = TEXT_WIDTH - w.slice(0, -1).reduce((a, b) => a + b, 0);
  const line = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
  const borders = { top: line, bottom: line, left: line, right: line };
  const cell = (text, i, isHeader) => new TableCell({ width: { size: w[i], type: WidthType.DXA }, borders,
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    children: String(text ?? '').split(/\r?\n/).map((l) => new Paragraph({
      alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT, spacing: { after: 0 },
      children: runs(l, { size: 24, bold: isHeader }) })) });
  const out = [];
  if (t.caption) out.push(centered(t.caption, { bold: true }, 120));
  out.push(new Table({ width: { size: TEXT_WIDTH, type: WidthType.DXA }, columnWidths: w, rows: [
    new TableRow({ tableHeader: true, children: t.columns.map((c, i) => cell(c, i, true)) }),
    ...t.rows.map((r) => new TableRow({ children: t.columns.map((_, i) => cell(r[i], i, false)) })),
  ] }), centered('', {}, 120));
  return out;
}

// Số trang: canh giữa ở lề trên, trang đầu không hiện.
const pageHeaders = () => ({
  default: new Header({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
    children: [new TextRun({ font: FONT, size: SIZE, children: [PageNumber.CURRENT] })] })] }),
  first: new Header({ children: [new Paragraph({ children: [] })] }),
});
const page = { size: { width: 11906, height: 16838 }, margin: MARGIN };
const sections = [{ properties: { page, titlePage: true }, headers: pageHeaders(), children: body }];

// Phụ lục: mỗi phụ lục một section, số trang đánh lại từ 1. Từ hai phụ lục trở lên thì đánh số La Mã.
const appendices = d.appendices ?? [];
appendices.forEach((a, i) => {
  const label = appendices.length > 1 ? `Phụ lục ${ROMAN[i]}` : 'Phụ lục';
  const docName = isLetter ? 'Công văn' : d.docType.charAt(0) + d.docType.slice(1).toLowerCase();
  const c = [centered(label, { bold: true }), centered(a.title.toUpperCase(), { bold: true }),
    centered(`(Kèm theo ${docName} số ${d.number ?? '...'} ${dateText(d.date)} của ${String(d.agency).split('\n').join(' ')})`, { italics: true }, 120),
    rule(TEXT_WIDTH, 0.25), centered('', {}, 120)];
  for (const t of a.paragraphs ?? []) c.push(para(t));
  (a.clauses ?? []).forEach((k, j) => { const start = body.length; clause(k, j); c.push(...body.splice(start)); });
  for (const t of a.tables ?? []) c.push(...table(t));
  sections.push({ properties: { page: { ...page, pageNumbers: { start: 1 } }, titlePage: true }, headers: pageHeaders(), children: c });
});

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: SIZE }, paragraph: { spacing: { line: LINE } } } } },
  sections,
});
const buf = await Packer.toBuffer(doc);
fs.writeFileSync(output, buf);
console.log(`${output}: ${Math.round(buf.length / 1024)} KB`);
console.log('Nhớ xuất sang PDF và xem từng trang trước khi gửi.');
