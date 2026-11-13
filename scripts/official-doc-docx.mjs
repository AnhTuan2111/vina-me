#!/usr/bin/env node
// Dựng văn bản hành chính (báo cáo, tờ trình, kế hoạch, công văn...) ra tệp docx theo thể thức Nghị định 30/2020/NĐ-CP,
// Phụ lục I. Nội dung lấy từ một tệp JSON, cấu trúc ở references/docx-export.md.
// Dùng: node official-doc-docx.mjs <content.json> <out.docx> [--text <out.txt>]. Lần đầu chạy, script tự cài gói docx
// (xem load-docx.mjs). --text ghi thêm chữ của văn bản theo thứ tự đọc, mỗi đoạn một dòng, để chạy lint.mjs --official
// trên đúng chữ đã dựng (rút chữ từ PDF thì cột Nơi nhận và cột chữ ký dễ dính vào nhau, lint báo sai).
// Khóa thêm ngoài bảng ở docx-export.md: agencyFullName (tên đủ của cơ quan ban hành cho dòng "(Kèm theo ... của ...)" của
// phụ lục, khi "agency" ở phần đầu ngắt dòng hay ghi gọn hơn); lineSpacing (cách dòng thân bài, 1 tới 1,5 lines, mặc định
// 1,2) và fontSize (cỡ thân bài 13 hay 14, mặc định 14), để dồn trang khi trang cuối chỉ còn câu kết và khối ký.
// Soát bố cục trang sau khi xuất PDF: node official-doc-docx.mjs --check-pdf <vb.pdf>. Script đọc vị trí từng chữ bằng
// pdftotext -bbox của Poppler, báo trang của văn bản chính bị trống lớn ở cuối và trang cuối chỉ có câu kết, khối ký.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadDocx } from './load-docx.mjs';

// Trang cuối chỉ có câu kết và khối ký: Word giữ đoạn cuối thân bài, câu kết, khối ký cùng một trang (keepNext, cantSplit);
// khối đó không vừa phần còn lại của trang thì cả khối sang trang sau, trang trước trống lớn ở cuối. Xem tận mắt từng trang
// vẫn phải làm, phép soát này chỉ đo khoảng trống để không bỏ sót.
if (process.argv[2] === '--check-pdf') {
  process.exitCode = checkPdf(process.argv[3]);
  process.exit();
}
function pdfWords(file) {
  if (/\.x?html?$/i.test(file)) return fs.readFileSync(file, 'utf8');
  const tries = [process.env.PDFTOTEXT, 'pdftotext'].filter(Boolean);
  // Trên Windows, Poppler cài bằng winget nằm ngoài PATH của Git Bash (ở đó pdftotext là bản xpdf, không có -bbox).
  const pkgs = path.join(process.env.LOCALAPPDATA ?? '', 'Microsoft', 'WinGet', 'Packages');
  if (fs.existsSync(pkgs)) for (const p of fs.readdirSync(pkgs).filter((x) => /poppler/i.test(x))) {
    for (const v of fs.readdirSync(path.join(pkgs, p))) tries.push(path.join(pkgs, p, v, 'Library', 'bin', 'pdftotext.exe'));
  }
  for (const exe of tries) {
    const r = spawnSync(exe, ['-bbox', file, '-'], { encoding: 'utf8', maxBuffer: 64 << 20 });
    if (r.status === 0 && r.stdout.includes('<page')) return r.stdout;
  }
  return null;
}
function checkPdf(file) {
  if (!file || !fs.existsSync(file)) {
    console.error('Dùng: node official-doc-docx.mjs --check-pdf <vb.pdf>');
    return 1;
  }
  const html = pdfWords(file);
  if (!html) {
    console.error('Không chạy được pdftotext -bbox của Poppler (bản xpdf không có -bbox). Cài Poppler hoặc đặt PDFTOTEXT trỏ tới nó.');
    return 1;
  }
  const MARGIN_PT = 20 * 72 / 25.4;   // lề trên, lề dưới 20 mm
  const pages = html.split(/<page\b/).slice(1).map((s) => ({
    height: +(s.match(/height="([\d.]+)"/)?.[1] ?? 841.92),
    // Bỏ số trang ở phần đầu trang (nằm trên lề trên).
    words: [...s.matchAll(/<word xMin="[\d.]+" yMin="([\d.]+)" xMax="[\d.]+" yMax="([\d.]+)">([^<]*)<\/word>/g)]
      .map((m) => ({ y0: +m[1], y1: +m[2], t: m[3] })).filter((w) => w.y1 > MARGIN_PT),
  }));
  const end = pages.findIndex((p) => p.words.some((w) => /\.\/\.$/.test(w.t)));
  if (end < 0) {
    console.error('Không thấy câu kết có "./." trong PDF, không soát được bố cục trang.');
    return 1;
  }
  const problems = [];
  const usable = (p) => p.height - 2 * MARGIN_PT;
  for (let i = 0; i < end; i++) {
    const p = pages[i];
    const bottom = Math.max(...p.words.map((w) => w.y1));
    const blank = (p.height - MARGIN_PT - bottom) / usable(p);
    if (blank > 0.2) problems.push(`trang ${i + 1} trống khoảng ${Math.round(blank * 100)}% ở cuối, mà văn bản chính còn sang trang ${i + 2}`);
  }
  const closingY = Math.min(...pages[end].words.filter((w) => /\.\/\.$/.test(w.t)).map((w) => w.y0));
  const linesAbove = new Set(pages[end].words.filter((w) => w.y1 <= closingY).map((w) => Math.round(w.y0))).size;
  if (end > 0 && linesAbove <= 3) {
    problems.push(`trang ${end + 1} (trang cuối của văn bản chính) chỉ có ${linesAbove} dòng thân bài phía trên câu kết, còn lại là câu kết và khối ký`);
  }
  if (!problems.length) {
    console.log(`Bố cục trang: văn bản chính ${end + 1} trang, không trang nào trống lớn ở cuối, trang cuối có thân bài trước câu kết.`);
    return 0;
  }
  console.error(`Bố cục trang cần sửa (${problems.length} chỗ):`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error('Dồn trang theo thứ tự ở official-documents.md, mục "Soát", bước 4: bỏ câu thân bài nhắc lại nội dung đã có ở');
  console.error('phụ lục; gộp khoản, câu ngắn cùng ý (giữ từ nối giữa hiện trạng và đề nghị); đặt "lineSpacing": 1.1 rồi 1 trong');
  console.error('JSON; đặt "fontSize": 13. Dựng lại, xuất PDF, chạy lại --check-pdf tới khi hết báo.');
  return 2;
}

const docx = loadDocx();
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, Header,
  PageNumber, NoBreakHyphen,
} = docx;

const argv = process.argv.slice(2);
const textAt = argv.indexOf('--text');
const textOut = textAt >= 0 ? argv[textAt + 1] : null;
const [input, output] = argv.filter((_, i) => textAt < 0 || (i !== textAt && i !== textAt + 1));
if (!input || !output || (textAt >= 0 && !textOut)) {
  console.error('Dùng: node official-doc-docx.mjs <content.json> <out.docx> [--text <out.txt>]');
  process.exit(1);
}
const d = JSON.parse(fs.readFileSync(input, 'utf8'));

const FONT = 'Times New Roman';
const MONO = 'Consolas';
// Cỡ thân bài và cách dòng theo Phụ lục I: cỡ 13-14, cách dòng từ dòng đơn tới 1,5 lines. Ngoài khoảng thì báo và dùng mặc định.
const layoutWarnings = [];
const fontSize = d.fontSize ?? 14;
if (![13, 14].includes(fontSize)) layoutWarnings.push(`"fontSize" ${fontSize} ngoài cỡ 13-14 của Phụ lục I, đã dùng 14`);
const lineSpacing = d.lineSpacing ?? 1.2;
if (!(lineSpacing >= 1 && lineSpacing <= 1.5)) layoutWarnings.push(`"lineSpacing" ${lineSpacing} ngoài khoảng 1 tới 1,5 lines của Phụ lục I, đã dùng 1,2`);
const SIZE = [13, 14].includes(fontSize) ? fontSize * 2 : 28; // cỡ thân bài, đơn vị nửa điểm
const MM = 56.7;                     // 1 mm theo DXA
const MARGIN = { top: Math.round(20 * MM), bottom: Math.round(20 * MM), left: Math.round(30 * MM), right: Math.round(15 * MM) };
const TEXT_WIDTH = 11906 - MARGIN.left - MARGIN.right; // bề ngang chữ trên A4
const FIRST_LINE = 720;              // lùi đầu dòng 1,27 cm
const AFTER = 120;                   // cách đoạn 6pt
const LINE = Math.round(240 * (lineSpacing >= 1 && lineSpacing <= 1.5 ? lineSpacing : 1.2)); // 240 là dòng đơn
const VI_ALPHABET = 'a b c d đ e g h i k l m n o p q r s t u v x y'.split(' ');
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];

// Bảng: { columns, rows, widths (phần trăm), align, boldRows, caption }. Chữ cỡ 12.
// align: cách canh từng cột, "left", "center" hay "right" (cột số tiền nên "right"); mặc định canh trái.
// boldRows: chỉ số các hàng in đậm (đếm từ 0, không tính hàng tiêu đề; -1 là hàng cuối), ví dụ dòng "Tổng cộng".
const ALIGN = { left: AlignmentType.LEFT, center: AlignmentType.CENTER, right: AlignmentType.RIGHT };
// Soát phép tính của bảng số liệu (dự toán, tổng hợp): bảng người dùng đưa hay có một dòng nhân sai mà tổng cộng theo dòng
// sai, hai nguồn khớp nhau nên đọc lướt không thấy. Số viết kiểu Việt: 1.020.000.000, 18,4.
const warnings = [];
const num = (s) => (/^\d{1,3}(\.\d{3})*(,\d+)?$|^\d+(,\d+)?$/.test(String(s ?? '').trim())
  ? Number(String(s).trim().replace(/\./g, '').replace(',', '.')) : null);
const viNum = (x) => x.toLocaleString('de-DE', { maximumFractionDigits: 2 });
// Ô nào sai: chia ngược thành tiền cho từng thừa số. Ra số nguyên thì thừa số kia có thể là ô sai; không cột nào ra số
// nguyên thì gần như chắc ô thành tiền ghi sai (đơn giá, số lượng hiếm khi lẻ thập phân).
function whichCell(t, r, a, b, c) {
  const whole = (x) => Math.abs(x - Math.round(x)) < 1e-9;
  const alt = [[a, b], [b, a]].filter(([x, y]) => whole(num(r[c]) / num(r[y])))
    .map(([x, y]) => `cột "${t.columns[x]}" là ${viNum(num(r[c]) / num(r[y]))}`);
  return alt.length
    ? `muốn thành tiền đúng thì ${alt.join(' hoặc ')}; hỏi người dùng ô nào sai`
    : 'chia ngược không ra số nguyên ở cột nào, nên nhiều khả năng ô thành tiền ghi sai';
}
function checkArithmetic(t, name) {
  const isTotal = (r) => r.some((c) => /^\s*(tổng|cộng)/iu.test(String(c ?? '')));
  const items = t.rows.filter((r) => !isTotal(r));
  const n = t.columns.length;
  // Cột thành tiền = số lượng × đơn giá: tìm bộ ba cột (a, b, c) mà phần lớn hàng khớp, rồi báo hàng lệch.
  for (let c = 2; c < n; c++) for (let a = 0; a < c; a++) for (let b = a + 1; b < c; b++) {
    const rows = items.filter((r) => [a, b, c].every((i) => num(r[i]) !== null));
    const ok = rows.filter((r) => Math.abs(num(r[a]) * num(r[b]) - num(r[c])) < 0.5);
    if (rows.length < 2 || ok.length * 2 < rows.length || ok.length === rows.length) continue;
    for (const r of rows.filter((x) => !ok.includes(x))) {
      warnings.push(`${name}, hàng "${r.slice(0, 2).join(' ')}": ${r[a]} × ${r[b]} = ${viNum(num(r[a]) * num(r[b]))}, bảng ghi ${r[c]} (cột "${t.columns[c]}"); ${whichCell(t, r, a, b, c)}`);
    }
  }
  // Hàng tổng cộng: mỗi cột có số thì phải bằng tổng các hàng còn lại.
  for (const r of t.rows.filter(isTotal)) for (let c = 0; c < n; c++) {
    const total = num(r[c]);
    if (total === null) continue;
    const sum = items.reduce((s, x) => s + (num(x[c]) ?? 0), 0);
    if (Math.abs(sum - total) >= 0.5) warnings.push(`${name}, hàng tổng cộng, cột "${t.columns[c]}": cộng các hàng được ${viNum(sum)}, bảng ghi ${r[c]}`);
  }
}
let where = 'thân văn bản';          // chỗ của bảng, để cảnh báo chỉ đúng bảng

// Chữ của văn bản theo thứ tự dựng, cho --text. Mỗi lần gọi runs() là một đoạn; bảng tự ghi mỗi hàng một dòng.
const plain = [];
let recording = true;
// Gạch nối giữa hai chữ số (khoảng năm "2015-2020", khoảng số "3-5") thành gạch nối không ngắt của Word, để Word không
// ngắt dòng giữa khoảng, nhất là trong ô bảng hẹp. Chữ vẫn hiện và chép ra là dấu "-".
const unbroken = (s) => s.split(/(?<=\d)-(?=\d)/).flatMap((x, i) => (i ? [new NoBreakHyphen(), x] : [x]));
// Chữ thường; `mã` thành phông đều. Kiểu chữ (đậm, nghiêng) ghi rõ ở mọi đoạn, kể cả khi là chữ thường.
function runs(text, style = {}) {
  if (recording) plain.push(String(text ?? ''));
  const base = { font: FONT, size: SIZE, bold: false, italics: false, ...style };
  return String(text ?? '').split(/(`[^`]+`)/).filter(Boolean).map((p) => (p.startsWith('`') && p.endsWith('`')
    ? new TextRun({ ...base, text: p.slice(1, -1), font: MONO, size: base.size - 4 })
    : new TextRun({ ...base, children: unbroken(p) })));
}
// Nhớ lời và tùy chọn của mỗi đoạn, để dựng lại đoạn cuối thân bài với keepNext (xem chỗ câu kết).
const paraArgs = new WeakMap();
const para = (text, o = {}) => {
  const p = new Paragraph({
    alignment: o.align ?? AlignmentType.JUSTIFIED,
    indent: o.indent ?? { firstLine: FIRST_LINE },
    spacing: { after: o.after ?? AFTER, line: LINE, ...(o.before ? { before: o.before } : {}) },
    keepNext: o.keepNext ?? false,
    children: runs(text, o.style),
  });
  paraArgs.set(p, [text, o]);
  return p;
};
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

// Tên cơ quan ban hành phải ghi đủ như quyết định thành lập, kể cả địa danh ("Trung tâm X tỉnh A"). Câu mở thường gọi đủ
// tên; phần đầu ghi thiếu địa danh thì báo, và dòng "(Kèm theo ... của ...)" của phụ lục dùng tên đủ.
const nameWarnings = [];
const LOCALITY = '(?:tỉnh|thành phố|thị xã|huyện|quận|xã|phường|thị trấn)';
const agencyOneLine = String(d.agency ?? '').split('\n').join(' ').replace(/\s+/g, ' ').trim();
let agencyFull = d.agencyFullName ?? agencyOneLine;
if (!d.agencyFullName && !new RegExp(`\\s${LOCALITY}\\s`, 'iu').test(` ${agencyOneLine} `)) {
  const text = [...(d.opening ?? [])].join(' ');
  const at = text.toLowerCase().indexOf(agencyOneLine.toLowerCase());
  const tail = at >= 0 ? text.slice(at + agencyOneLine.length).match(new RegExp(`^\\s+(${LOCALITY}\\s+\\p{Lu}[\\p{L}\\p{M}]*(?:\\s+\\p{Lu}[\\p{L}\\p{M}]*)*)`, 'u')) : null;
  if (tail) {
    agencyFull = `${agencyOneLine} ${tail[1]}`;
    nameWarnings.push(`tên cơ quan ban hành: câu mở gọi là "${agencyFull}" mà "agency" chỉ ghi "${agencyOneLine}". Ghi đủ cả địa danh vào "agency" (ngắt dòng giữa hai cụm bằng \\n), dòng kèm theo của phụ lục đã dùng tên đủ`);
  }
}

// Bề ngang ước lượng của một dòng in hoa Times New Roman (phần nghìn của cỡ chữ, theo bảng độ rộng chữ của Times), để
// biết tên cơ quan có vừa cột trái không. Dấu thanh không thêm bề ngang; Ư, Ơ có râu rộng hơn U, O một chút.
const CAPS = { bold: 'A722B667C722D722E667F611G778H778I389J500K778L667M944N722O778P611Q778R722S556T667U722V722W1000X722Y722Z667',
  regular: 'A722B667C667D722E611F556G722H722I333J389K722L611M889N722O722P556Q722R667S556T611U722V722W944X722Y722Z611' };
const widthTable = Object.fromEntries(Object.entries(CAPS).map(([k, s]) => [k, Object.fromEntries([...s.matchAll(/([A-Z])(\d+)/g)].map((m) => [m[1], +m[2]]))]));
function capsWidthPt(line, size, bold) {
  let w = 0;
  for (const ch of line.toUpperCase()) {
    const horn = /[ƯỨỪỬỮỰƠỚỜỞỠỢ]/u.test(ch) ? 80 : 0;
    const base = ch === 'Đ' ? 'D' : ch.normalize('NFD').replace(/[̀-̛ͯ]/g, '')[0];
    w += (widthTable[bold ? 'bold' : 'regular'][base] ?? (/\d/.test(base) ? 500 : base === ' ' ? 250 : 333)) + horn;
  }
  return w / 1000 * size;
}
// Dòng quá dài thì tự ngắt trước địa danh cuối cùng ("TRUNG TÂM X" / "TỈNH A"), không ngắt giữa một cụm.
const splitAtLocality = (line) => line.replace(new RegExp(`\\s+(${LOCALITY}\\s+\\p{Lu}[^\\n]*)$`, 'u'), '\n$1');
const fits = (lines, colPt, size, bold) => lines.every((l) => capsWidthPt(l, size, bold) <= colPt * 0.97);
const quoc = 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM';
let parentLines = String(d.parentAgency ?? '').split('\n').filter(Boolean);
let agencyLines = String(d.agency).split('\n');
// Thử cột trái 40% rồi 44% (cột phải vẫn đủ cho Quốc hiệu), cỡ 13 rồi 12 (Phụ lục I cho phép 12-13).
let LEFT = Math.round(TEXT_WIDTH * 0.4), HEAD_SIZE = 26;
const layouts = [[0.4, 26], [0.44, 26], [0.4, 24], [0.44, 24]];
const tryFit = () => layouts.find(([f, s]) => capsWidthPt(quoc, 12, true) <= TEXT_WIDTH * (1 - f) / 20 * 0.97
  && fits(agencyLines, TEXT_WIDTH * f / 20, s / 2, true) && fits(parentLines, TEXT_WIDTH * f / 20, s / 2, false));
let chosen = tryFit();
if (!chosen) {
  // Chỉ ngắt dòng nào không vừa cả ở cột rộng nhất, cỡ nhỏ nhất.
  const split = (lines, bold) => lines.flatMap((l) => (fits([l], TEXT_WIDTH * 0.44 / 20, 12, bold) ? [l] : splitAtLocality(l).split('\n')));
  agencyLines = split(agencyLines, true);
  parentLines = split(parentLines, false);
  chosen = tryFit();
}
// Ngắt tay bằng \n mà hai dòng liền nhau dồn lại vẫn vừa cột thì có thể đã tách đôi một cụm ("LƯU TRỮ" / "LỊCH SỬ");
// dòng sau mở bằng địa danh thì là ngắt đúng chỗ.
for (const [lines, bold] of [[parentLines, false], [agencyLines, true]]) {
  for (let i = 1; i < lines.length; i++) {
    const joined = `${lines[i - 1]} ${lines[i]}`;
    if (!new RegExp(`^${LOCALITY}\\s`, 'iu').test(lines[i]) && fits([joined], TEXT_WIDTH * 0.44 / 20, 12, bold)) {
      nameWarnings.push(`tên cơ quan ở phần đầu: "${lines[i - 1].toUpperCase()}" / "${lines[i].toUpperCase()}" dồn một dòng vẫn vừa cột, ngắt thế dễ tách đôi một cụm. Bỏ \\n, hoặc ngắt trước địa danh`);
    }
  }
}
if (chosen) { LEFT = Math.round(TEXT_WIDTH * chosen[0]); HEAD_SIZE = chosen[1]; } else {
  HEAD_SIZE = 24;
  for (const l of [...parentLines, ...agencyLines].filter((x) => capsWidthPt(x, 12, true) > TEXT_WIDTH * 0.44 / 20 * 0.97)) {
    nameWarnings.push(`tên cơ quan ở phần đầu: dòng "${l.toUpperCase()}" dài quá cột trái, Word sẽ tự ngắt giữa cụm. Ngắt bằng \\n giữa hai cụm trong JSON`);
  }
}
const RIGHT = TEXT_WIDTH - LEFT;

// Phần đầu: tên cơ quan, số ký hiệu bên trái; Quốc hiệu, Tiêu ngữ, địa danh và ngày bên phải.
const headLeft = [];
// Tên dài thì tự ngắt dòng bằng \n trong JSON, để không bị ngắt giữa một cụm. Cơ quan chủ quản và cơ quan ban hành cùng cỡ.
for (const t of parentLines) headLeft.push(centered(t.toUpperCase(), { size: HEAD_SIZE }));
for (const t of agencyLines) headLeft.push(centered(t.toUpperCase(), { size: HEAD_SIZE, bold: true }));
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

// Căn cứ: nghiêng, mỗi căn cứ một dòng. Quyết định (không có Kính gửi) đặt căn cứ ngay dưới trích yếu; tờ trình, báo cáo,
// công văn có Kính gửi thì căn cứ thuộc phần nội dung, đứng sau dòng Kính gửi.
const recipients = d.recipients ?? [];
const legalBases = () => { for (const l of punctuateList(d.legalBases ?? [])) body.push(para(l, { style: { italics: true } })); };
if (!recipients.length) legalBases();

// Kính gửi: một nơi thì cùng dòng; nhiều nơi thì mỗi nơi một dòng, gạch nối ở đầu.
if (recipients.length === 1) body.push(para(`Kính gửi: ${recipients[0].replace(/[;.]$/, '')}.`, { align: AlignmentType.CENTER, indent: {}, after: 240 }));
else if (recipients.length > 1) {
  body.push(para('Kính gửi:', { indent: { left: 1700 }, after: 0 }));
  punctuateList(recipients).forEach((l, i) => body.push(para(`- ${l}`, { indent: { left: 2700 }, after: i === recipients.length - 1 ? 240 : 0 })));
}
if (recipients.length) legalBases();

for (const p of d.opening ?? []) body.push(para(p));

// Nội dung: mục I., II. (in hoa, đậm); khoản 1., 2. (đậm nếu có tiêu đề); điểm a), b) theo chữ cái tiếng Việt.
// Thứ tự trong một khoản: paragraphs, points, tables, rồi paragraphsAfter (đoạn đứng sau danh sách điểm hay bảng).
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
  for (const p of k.paragraphsAfter ?? []) body.push(para(p));
}
(d.body ?? []).forEach((section, i) => {
  where = `mục ${ROMAN[i]}`;
  body.push(para(`${ROMAN[i]}. ${section.heading.toUpperCase()}`, { style: { bold: true }, keepNext: true, before: 120 }));
  for (const p of section.paragraphs ?? []) body.push(para(p));
  (section.clauses ?? []).forEach(clause);
  for (const t of section.tables ?? []) body.push(...table(t));
  for (const p of section.paragraphsAfter ?? []) body.push(para(p));
});

// Câu kết: dòng cuối phần nội dung kết bằng "./." như các mẫu ở Phụ lục III. Câu kết giữ cùng trang với bảng Nơi nhận,
// chữ ký (keepNext), để khối ký không rơi một mình sang trang sau.
const closing = [...(d.closing ?? [])];
if (closing.length) closing[closing.length - 1] = closing[closing.length - 1].replace(/[.\s/]*$/, '') + './.';
// Đoạn cuối của thân bài cũng giữ cùng trang với câu kết, để trang cuối không chỉ có câu kết và khối ký.
const last = body.length - 1;
if (closing.length && paraArgs.has(body[last])) {
  const [text, o] = paraArgs.get(body[last]);
  recording = false;
  body[last] = para(text, { ...o, keepNext: true });
  recording = true;
}
for (const p of closing) body.push(para(p, { keepNext: true }));

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
  new TableRow({ cantSplit: true, children: [cellOf(HALF, signLeft), cellOf(TEXT_WIDTH - HALF, signRight)] }),
] }));

// Bảng: xem chú thích ở đầu tệp (align, boldRows), chữ cỡ 12.
function table(t) {
  checkArithmetic(t, t.caption ? `bảng "${t.caption}"` : `bảng ở ${where}`);
  const n = t.columns.length;
  const pct = t.widths ?? Array(n).fill(100 / n);
  const w = pct.map((x) => Math.round(TEXT_WIDTH * x / 100));
  w[n - 1] = TEXT_WIDTH - w.slice(0, -1).reduce((a, b) => a + b, 0);
  const line = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
  const borders = { top: line, bottom: line, left: line, right: line };
  const bold = new Set((t.boldRows ?? []).map((r) => (r < 0 ? t.rows.length + r : r)));
  const cell = (text, i, isHeader, isBold) => new TableCell({ width: { size: w[i], type: WidthType.DXA }, borders,
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    children: String(text ?? '').split(/\r?\n/).map((l) => new Paragraph({
      alignment: isHeader ? AlignmentType.CENTER : ALIGN[t.align?.[i]] ?? AlignmentType.LEFT, spacing: { after: 0 },
      children: runs(l, { size: 24, bold: isHeader || isBold }) })) });
  const out = [];
  if (t.caption) out.push(centered(t.caption, { bold: true }, 120));
  recording = false;
  const rows = [
    new TableRow({ tableHeader: true, children: t.columns.map((c, i) => cell(c, i, true)) }),
    ...t.rows.map((r, k) => new TableRow({ children: t.columns.map((_, i) => cell(r[i], i, false, bold.has(k))) })),
  ];
  recording = true;
  for (const r of [t.columns, ...t.rows]) plain.push(t.columns.map((_, i) => String(r[i] ?? '').replace(/\r?\n/g, ' ')).join(' | '));
  out.push(new Table({ width: { size: TEXT_WIDTH, type: WidthType.DXA }, columnWidths: w, rows }), centered('', {}, 120));
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
  where = label;
  const docName = isLetter ? 'Công văn' : d.docType.charAt(0) + d.docType.slice(1).toLowerCase();
  const c = [centered(label, { bold: true }), centered(a.title.toUpperCase(), { bold: true }),
    centered(`(Kèm theo ${docName} số ${d.number ?? '...'} ${dateText(d.date)} của ${agencyFull})`, { italics: true }, 120),
    rule(TEXT_WIDTH, 0.25), centered('', {}, 120)];
  for (const t of a.paragraphs ?? []) c.push(para(t));
  (a.clauses ?? []).forEach((k, j) => { const start = body.length; clause(k, j); c.push(...body.splice(start)); });
  for (const t of a.tables ?? []) c.push(...table(t));
  for (const t of a.paragraphsAfter ?? []) c.push(para(t));
  sections.push({ properties: { page: { ...page, pageNumbers: { start: 1 } }, titlePage: true }, headers: pageHeaders(), children: c });
});

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: SIZE }, paragraph: { spacing: { line: LINE } } } } },
  sections,
});
const buf = await Packer.toBuffer(doc);
fs.writeFileSync(output, buf);
console.log(`${output}: ${Math.round(buf.length / 1024)} KB`);
if (textOut) {
  fs.writeFileSync(textOut, plain.join('\n') + '\n');
  console.log(`${textOut}: chữ của văn bản, soát bằng node lint.mjs --official ${textOut}`);
}
if (warnings.length) {
  console.error(`Phép tính trong bảng không khớp (${warnings.length} chỗ). Sửa số trong JSON, cả mọi câu dùng số tổng hay số suy ra từ nó,`);
  console.error('hoặc đánh dấu [cần xác nhận: ...] ở mọi chỗ dùng số đó, rồi báo người dùng:');
  for (const w of new Set(warnings)) console.error(`  - ${w}`);
}
if (nameWarnings.length) {
  console.error(`Tên cơ quan cần xem lại (${nameWarnings.length} chỗ):`);
  for (const w of nameWarnings) console.error(`  - ${w}`);
}
for (const w of layoutWarnings) console.error(`Cỡ chữ, cách dòng: ${w}.`);
console.log(`Nhớ xuất sang PDF, chạy node official-doc-docx.mjs --check-pdf <tệp.pdf> và xem từng trang trước khi gửi.`);
