#!/usr/bin/env node
// Dựng văn bản hành chính (báo cáo, tờ trình, kế hoạch, công văn...) ra tệp docx theo thể thức Nghị định 30/2020/NĐ-CP,
// Phụ lục I. Nội dung lấy từ một tệp JSON, cấu trúc ở references/xuat-docx.md.
// Dùng: NODE_PATH=<thư mục node_modules có gói docx> node van-ban-hc-docx.mjs <noi-dung.json> <ra.docx>
import fs from 'node:fs';
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
  Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, Header,
  PageNumber,
} = docx;

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error('Dùng: node van-ban-hc-docx.mjs <noi-dung.json> <ra.docx>');
  process.exit(1);
}
const d = JSON.parse(fs.readFileSync(input, 'utf8'));

const FONT = 'Times New Roman';
const MONO = 'Consolas';
const CO = 28;                       // cỡ thân bài 14, đơn vị nửa điểm
const MM = 56.7;                     // 1 mm theo DXA
const LE = { top: Math.round(20 * MM), bottom: Math.round(20 * MM), left: Math.round(30 * MM), right: Math.round(15 * MM) };
const RONG = 11906 - LE.left - LE.right; // bề ngang chữ trên A4
const LUI = 720;                     // lùi đầu dòng 1,27 cm
const SAU = 120;                     // cách đoạn 6pt
const DONG = 288;                    // cách dòng 1,2 lines, trong khoảng dòng đơn tới 1,5 lines
const CHU_CAI = 'a b c d đ e g h i k l m n o p q r s t u v x y'.split(' ');
const LA_MA = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];

// Chữ thường; `mã` thành phông đều. Kiểu chữ (đậm, nghiêng) ghi rõ ở mọi đoạn, kể cả khi là chữ thường.
function runs(text, kieu = {}) {
  const base = { font: FONT, size: CO, bold: false, italics: false, ...kieu };
  return String(text ?? '').split(/(`[^`]+`)/).filter(Boolean).map((p) => (p.startsWith('`') && p.endsWith('`')
    ? new TextRun({ ...base, text: p.slice(1, -1), font: MONO, size: base.size - 4 })
    : new TextRun({ ...base, text: p })));
}
const doan = (text, o = {}) => new Paragraph({
  alignment: o.canh ?? AlignmentType.JUSTIFIED,
  indent: o.indent ?? { firstLine: LUI },
  spacing: { after: o.sau ?? SAU, line: DONG, ...(o.truoc ? { before: o.truoc } : {}) },
  keepNext: o.keepNext ?? false,
  children: runs(text, o.kieu),
});
const giua = (text, kieu, sau = 0) => doan(text, { canh: AlignmentType.CENTER, indent: {}, kieu, sau });
// Đường kẻ ngang ngắn dưới tên cơ quan, Tiêu ngữ, trích yếu: một đoạn rỗng có viền trên, độ dài chỉnh bằng lề hai bên.
const ke = (rong, phan) => {
  const hai = Math.round(rong * (1 - phan) / 2);
  return new Paragraph({ indent: { left: hai, right: hai }, spacing: { before: 40, after: 0, line: 240 },
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 1 } }, children: [new TextRun({ text: '', size: 4 })] });
};
const KHONG_VIEN = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const vienTrong = { top: KHONG_VIEN, bottom: KHONG_VIEN, left: KHONG_VIEN, right: KHONG_VIEN, insideHorizontal: KHONG_VIEN, insideVertical: KHONG_VIEN };
const o = (w, children) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: vienTrong,
  margins: { top: 0, bottom: 0, left: 0, right: 0 }, children });

// Ngày: nhận "2026-01-06" hoặc "06/01/2026", trả "ngày 06 tháng 01 năm 2026" (ngày dưới 10, tháng 1 và 2 thêm số 0).
function ngayChu(s) {
  if (!s) return 'ngày ... tháng ... năm ...';
  const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/) || s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return s;
  const [y, mo, da] = s.includes('-') ? [m[1], m[2], m[3]] : [m[3], m[2], m[1]];
  const dd = String(+da).padStart(2, '0');
  const mm = +mo <= 2 ? String(+mo).padStart(2, '0') : String(+mo);
  return `ngày ${dd} tháng ${mm} năm ${y}`;
}
// Dòng của khối Kính gửi, Nơi nhận, Căn cứ: chấm phẩy cuối dòng, dấu chấm ở dòng cuối.
const dauDong = (ds) => ds.map((l, i) => l.replace(/[;.,\s]+$/, '') + (i === ds.length - 1 ? '.' : ';'));

const conLai = [];
const L = Math.round(RONG * 0.4), R = RONG - L;

// Phần đầu: tên cơ quan, số ký hiệu bên trái; Quốc hiệu, Tiêu ngữ, địa danh và ngày bên phải.
const trai = [];
// Tên dài thì tự ngắt dòng bằng \n trong JSON, để không bị ngắt giữa một cụm.
for (const t of String(d.coQuanChuQuan ?? '').split('\n').filter(Boolean)) trai.push(giua(t.toUpperCase(), { size: 26 }));
for (const t of String(d.coQuan).split('\n')) trai.push(giua(t.toUpperCase(), { size: 26, bold: true }));
trai.push(ke(L, 0.4));
const phai = [
  giua('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', { size: 24, bold: true }),
  giua('Độc lập - Tự do - Hạnh phúc', { size: 28, bold: true }),
  ke(R, 0.6),
];
const congVan = !d.tenLoai;
const soDong = [giua(`Số: ${d.so ?? '.../...'}`, { size: 26 }, 0)];
if (congVan && d.trichYeu) soDong.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 },
  children: runs(`V/v ${d.trichYeu}`, { size: 26 }) }));
conLai.push(new Table({ width: { size: RONG, type: WidthType.DXA }, columnWidths: [L, R], borders: vienTrong, rows: [
  new TableRow({ children: [o(L, trai), o(R, phai)] }),
  new TableRow({ children: [o(L, soDong), o(R, [giua(`${d.diaDanh ?? '...'}, ${ngayChu(d.ngay)}`, { size: 28, italics: true })])] }),
] }));

if (!congVan) {
  conLai.push(giua('', {}, 240), giua(d.tenLoai.toUpperCase(), { bold: true }));
  if (d.trichYeu) conLai.push(giua(d.trichYeu, { bold: true }));
  conLai.push(ke(RONG, 0.25), giua('', {}, 120));
} else conLai.push(giua('', {}, 240));

// Căn cứ: nghiêng, mỗi căn cứ một dòng.
for (const l of dauDong(d.canCu ?? [])) conLai.push(doan(l, { kieu: { italics: true } }));

// Kính gửi: một nơi thì cùng dòng; nhiều nơi thì mỗi nơi một dòng, gạch nối ở đầu.
const kg = d.kinhGui ?? [];
if (kg.length === 1) conLai.push(doan(`Kính gửi: ${kg[0].replace(/[;.]$/, '')}.`, { canh: AlignmentType.CENTER, indent: {}, sau: 240 }));
else if (kg.length > 1) {
  conLai.push(doan('Kính gửi:', { indent: { left: 1700 }, sau: 0 }));
  dauDong(kg).forEach((l, i) => conLai.push(doan(`- ${l}`, { indent: { left: 2700 }, sau: i === kg.length - 1 ? 240 : 0 })));
}

for (const p of d.moDau ?? []) conLai.push(doan(p));

// Nội dung: mục I., II. (in hoa, đậm); khoản 1., 2. (đậm nếu có tiêu đề); điểm a), b) theo chữ cái tiếng Việt.
function khoan(k, i) {
  const so = `${i + 1}.`;
  if (k.tieuDe) conLai.push(doan(`${so} ${k.tieuDe}`, { kieu: { bold: true }, keepNext: true }));
  (k.doan ?? []).forEach((p, j) => conLai.push(doan(!k.tieuDe && j === 0 ? `${so} ${p}` : p)));
  (k.diem ?? []).forEach((p, j) => {
    const [chu, ...y] = Array.isArray(p) ? p : [p];
    conLai.push(doan(`${CHU_CAI[j]}) ${chu}`));
    for (const t of y) conLai.push(doan(`- ${t}`));
  });
  for (const b of k.bang ?? []) conLai.push(...bang(b));
}
(d.noiDung ?? []).forEach((m, i) => {
  conLai.push(doan(`${LA_MA[i]}. ${m.muc.toUpperCase()}`, { kieu: { bold: true }, keepNext: true, truoc: 120 }));
  for (const p of m.doan ?? []) conLai.push(doan(p));
  (m.khoan ?? []).forEach(khoan);
  for (const b of m.bang ?? []) conLai.push(...bang(b));
});

// Câu kết: dòng cuối phần nội dung kết bằng "./." như các mẫu ở Phụ lục III.
const ket = [...(d.ketThuc ?? [])];
if (ket.length) ket[ket.length - 1] = ket[ket.length - 1].replace(/[.\s/]*$/, '') + './.';
for (const p of ket) conLai.push(doan(p));

// Nơi nhận bên trái, chữ ký bên phải.
const nn = [...(d.kinhGui?.length ? ['Như trên'] : []), ...(d.noiNhan ?? []), `Lưu: ${d.luu ?? 'VT'}`];
const traiKy = [new Paragraph({ spacing: { before: 240 }, children: runs('Nơi nhận:', { size: 24, bold: true, italics: true }) }),
  ...dauDong(nn).map((l) => new Paragraph({ children: runs(`- ${l}`, { size: 22 }) }))];
// Dòng đầu hai bên cùng cách phần trên 12pt để "Nơi nhận:" ngang dòng quyền hạn người ký.
const dongKy = [d.quyenHan, d.chucVu].filter(Boolean).map((t) => t.toUpperCase());
const phaiKy = dongKy.map((t, k) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: k === 0 ? 240 : 0 },
  children: runs(t, { bold: true }) }));
phaiKy.push(giua('', {}, 1400), giua(d.nguoiKy ?? '', { bold: true }));
const KL = Math.round(RONG * 0.5);
conLai.push(new Table({ width: { size: RONG, type: WidthType.DXA }, columnWidths: [KL, RONG - KL], borders: vienTrong, rows: [
  new TableRow({ children: [o(KL, traiKy), o(RONG - KL, phaiKy)] }),
] }));

// Bảng: { columns, rows, widths (phần trăm), caption }. Chữ cỡ 12.
function bang(t) {
  const n = t.columns.length;
  const pct = t.widths ?? Array(n).fill(100 / n);
  const w = pct.map((x) => Math.round(RONG * x / 100));
  w[n - 1] = RONG - w.slice(0, -1).reduce((a, b) => a + b, 0);
  const v = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
  const vien = { top: v, bottom: v, left: v, right: v };
  const cell = (text, i, dau) => new TableCell({ width: { size: w[i], type: WidthType.DXA }, borders: vien,
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    children: String(text ?? '').split(/\r?\n/).map((line) => new Paragraph({
      alignment: dau ? AlignmentType.CENTER : AlignmentType.LEFT, spacing: { after: 0 },
      children: runs(line, { size: 24, bold: dau }) })) });
  const ra = [];
  if (t.caption) ra.push(giua(t.caption, { bold: true }, 120));
  ra.push(new Table({ width: { size: RONG, type: WidthType.DXA }, columnWidths: w, rows: [
    new TableRow({ tableHeader: true, children: t.columns.map((c, i) => cell(c, i, true)) }),
    ...t.rows.map((r) => new TableRow({ children: t.columns.map((_, i) => cell(r[i], i, false)) })),
  ] }), giua('', {}, 120));
  return ra;
}

// Số trang: canh giữa ở lề trên, trang đầu không hiện.
const dauTrang = () => ({
  default: new Header({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
    children: [new TextRun({ font: FONT, size: CO, children: [PageNumber.CURRENT] })] })] }),
  first: new Header({ children: [new Paragraph({ children: [] })] }),
});
const trang = { size: { width: 11906, height: 16838 }, margin: LE };
const sections = [{ properties: { page: trang, titlePage: true }, headers: dauTrang(), children: conLai }];

// Phụ lục: mỗi phụ lục một section, số trang đánh lại từ 1. Từ hai phụ lục trở lên thì đánh số La Mã.
const pl = d.phuLuc ?? [];
pl.forEach((p, i) => {
  const ten = pl.length > 1 ? `Phụ lục ${LA_MA[i]}` : 'Phụ lục';
  const c = [giua(ten, { bold: true }), giua(p.ten.toUpperCase(), { bold: true }),
    giua(`(Kèm theo ${congVan ? 'Công văn' : d.tenLoai.charAt(0) + d.tenLoai.slice(1).toLowerCase()} số ${d.so ?? '...'} ${ngayChu(d.ngay)} của ${String(d.coQuan).split('\n').join(' ')})`, { italics: true }, 120),
    ke(RONG, 0.25), giua('', {}, 120)];
  for (const t of p.doan ?? []) c.push(doan(t));
  (p.khoan ?? []).forEach((k, j) => { const truoc = conLai.length; khoan(k, j); c.push(...conLai.splice(truoc)); });
  for (const b of p.bang ?? []) c.push(...bang(b));
  sections.push({ properties: { page: { ...trang, pageNumbers: { start: 1 } }, titlePage: true }, headers: dauTrang(), children: c });
});

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: CO }, paragraph: { spacing: { line: DONG } } } } },
  sections,
});
const buf = await Packer.toBuffer(doc);
fs.writeFileSync(output, buf);
console.log(`${output}: ${Math.round(buf.length / 1024)} KB`);
console.log('Nhớ xuất sang PDF và xem từng trang trước khi gửi.');
