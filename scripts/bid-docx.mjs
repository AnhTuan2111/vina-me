#!/usr/bin/env node
// Dựng tệp Word cho hồ sơ dự thầu từ một tệp JSON, lấy một tệp Word có sẵn (hồ sơ đã nộp, mẫu của công ty) làm khuôn:
// giữ kiểu đoạn, khổ giấy, lề, chân trang, đánh số của tệp khuôn; bỏ toàn bộ thân, ảnh, chú thích cuối trang cũ.
// Không có khuôn thì dùng khuôn dựng sẵn: Times New Roman 13, A4, lề 2-2-3-2 cm, số trang ở chân.
// Dùng: node bid-docx.mjs <content.json> <out.docx> [--template <khuôn.docx>]
// Cấu trúc JSON và cách dùng: references/bid-proposals.md, mục "Dựng tệp Word". Không cần cài gói npm nào.
import fs from 'node:fs';
import path from 'node:path';
import { readZip, writeZip } from './lib/zip.mjs';
import { styleNames } from './lib/doc-text.mjs';

const args = process.argv.slice(2);
const ti = args.indexOf('--template');
const templateArg = ti >= 0 ? args.splice(ti, 2)[1] : undefined;
const [input, output] = args;
if (!input || !output) {
  console.error('Dùng: node bid-docx.mjs <content.json> <out.docx> [--template <khuôn.docx>]');
  process.exit(1);
}
const baseDir = path.dirname(path.resolve(input));
const data = JSON.parse(fs.readFileSync(input, 'utf8'));
const templatePath = templateArg ?? (data.template ? path.resolve(baseDir, data.template) : undefined);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- Khuôn dựng sẵn ----------
// Tên kiểu đoạn giống hồ sơ của các công ty hay dùng (MucChinh cho phần A, B…; MucTaiLieu cho I, II…), để JSON viết
// cho khuôn này dùng được luôn với khuôn thật của BA.
function defaultTemplate() {
  const font = '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/>';
  const st = (id, name, ppr, rpr, extra = '') => `<w:style w:type="paragraph" w:customStyle="${/^(Normal|Heading\d|Caption|ListParagraph|TOC\d)$/.test(id) ? 0 : 1}" w:styleId="${id}"><w:name w:val="${name}"/>${id === 'Normal' ? '' : '<w:basedOn w:val="Normal"/><w:next w:val="Normal"/>'}${extra}<w:qFormat/><w:pPr>${ppr}</w:pPr><w:rPr>${rpr}</w:rPr></w:style>`;
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr>${font}<w:sz w:val="26"/><w:szCs w:val="26"/><w:lang w:val="vi-VN"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="312" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr></w:pPrDefault></w:docDefaults>`
    + st('Normal', 'Normal', '', '')
    + st('MucChinh', 'MucChinh', '<w:keepNext/><w:pageBreakBefore/><w:spacing w:before="240" w:after="240"/><w:jc w:val="center"/><w:outlineLvl w:val="0"/>', '<w:b/><w:caps/><w:sz w:val="28"/><w:szCs w:val="28"/>')
    + st('MucTaiLieu', 'MucTaiLieu', '<w:keepNext/><w:spacing w:before="240" w:after="120"/><w:jc w:val="left"/><w:outlineLvl w:val="1"/>', '<w:b/><w:caps/>')
    + st('Heading1', 'heading 1', '<w:keepNext/><w:spacing w:before="240" w:after="120"/><w:jc w:val="left"/><w:outlineLvl w:val="2"/>', '<w:b/>')
    + st('Heading2', 'heading 2', '<w:keepNext/><w:spacing w:before="120" w:after="120"/><w:jc w:val="left"/><w:outlineLvl w:val="3"/>', '<w:b/><w:i/>')
    + st('Heading3', 'heading 3', '<w:keepNext/><w:spacing w:before="120" w:after="60"/><w:jc w:val="left"/><w:outlineLvl w:val="4"/>', '<w:i/>')
    + st('ListParagraph', 'List Paragraph', '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:spacing w:after="60"/><w:ind w:left="567" w:hanging="283"/>', '')
    + st('Figure', 'Figure', '<w:keepNext/><w:spacing w:before="120" w:after="60" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/>', '')
    + st('Caption', 'caption', '<w:spacing w:after="200" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/>', '<w:i/><w:sz w:val="24"/><w:szCs w:val="24"/>')
    + st('TableHeader', 'Table Header', '<w:keepNext/><w:spacing w:before="40" w:after="40" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/>', '<w:b/><w:sz w:val="24"/><w:szCs w:val="24"/>')
    + st('TableText', 'Table Text', '<w:spacing w:before="40" w:after="40" w:line="240" w:lineRule="auto"/><w:jc w:val="left"/>', '<w:sz w:val="24"/><w:szCs w:val="24"/>')
    + st('AfterTable', 'After Table', '<w:spacing w:after="0" w:line="240" w:lineRule="auto"/>', '<w:sz w:val="12"/><w:szCs w:val="12"/>')
    + st('TOC1', 'toc 1', '<w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9061"/></w:tabs><w:spacing w:after="60"/><w:jc w:val="left"/>', '<w:b/>')
    + st('TOC2', 'toc 2', '<w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9061"/></w:tabs><w:spacing w:after="60"/><w:ind w:left="284"/><w:jc w:val="left"/>', '')
    + st('TOC3', 'toc 3', '<w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9061"/></w:tabs><w:spacing w:after="60"/><w:ind w:left="567"/><w:jc w:val="left"/>', '')
    + '<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>'
    + '</w:styles>';
  const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
  return new Map([
    ['[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>'],
    ['_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>'],
    ['docProps/core.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title></dc:title><dc:creator></dc:creator><cp:lastModifiedBy></cp:lastModifiedBy></cp:coreProperties>'],
    ['word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/></Relationships>'],
    ['word/styles.xml', styles],
    ['word/numbering.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering ${W}><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="-"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="567" w:hanging="283"/></w:pPr></w:lvl><w:lvl w:ilvl="1"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="+"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="993" w:hanging="283"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`],
    ['word/settings.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings ${W}><w:defaultTabStop w:val="720"/><w:characterSpacingControl w:val="doNotCompress"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>`],
    ['word/footer1.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr ${W}><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>1</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>`],
    ['word/document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${W} xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><w:body><w:sectPr><w:footerReference w:type="default" r:id="rId4"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1701" w:header="680" w:footer="680" w:gutter="0"/><w:cols w:space="720"/></w:sectPr></w:body></w:document>`],
  ]);
}

// ---------- Mở khuôn ----------
const zip = templatePath ? readZip(fs.readFileSync(templatePath)) : defaultTemplate();
const text = (name) => zip.get(name)?.toString('utf8');
let docXml = text('word/document.xml');
if (!docXml) throw new Error('Tệp khuôn không có word/document.xml');
const stylesXml = text('word/styles.xml') ?? '';
const names = styleNames(stylesXml);
const byName = new Map([...names].map(([id, name]) => [name.toLowerCase(), id]));

// Vai trò của đoạn trong JSON, tìm kiểu đoạn tương ứng trong khuôn theo tên (không phân biệt hoa thường).
const ROLES = {
  part: ['MucChinh', 'Title'],
  doc: ['MucTaiLieu', 'Subtitle'],
  h1: ['heading 1'], h2: ['heading 2'], h3: ['heading 3'],
  bullet: ['List Paragraph', 'List Bullet'],
  figure: ['Figure'], caption: ['caption'],
  th: ['Table Header', 'Table Heading'], td: ['Table Text', 'Table Paragraph', 'Table Contents'],
  after: ['After Table'],
};
const style = {};
const missing = [];
for (const [role, cands] of Object.entries(ROLES)) {
  style[role] = cands.map((c) => byName.get(c.toLowerCase()) ?? (names.has(c) ? c : undefined)).find(Boolean);
  if (!style[role]) missing.push(`${role} (${cands.join(', ')})`);
}
// Khuôn thiếu kiểu cho phần lớn thì dùng đề mục cấp 1, để vẫn có đề mục và vẫn lên mục lục.
style.part ??= style.h1;
style.doc ??= style.h1;

// Danh sách gạch đầu dòng: dùng đúng đánh số mà khuôn đang gắn cho kiểu List Paragraph; không thấy thì thêm một định
// nghĩa gạch đầu dòng vào numbering.xml của khuôn.
const bulletStyleXml = style.bullet ? stylesXml.match(new RegExp(`<w:style\\b[^>]*w:styleId="${style.bullet}"[\\s\\S]*?</w:style>`))?.[0] ?? '' : '';
let bulletNum = (style.bullet && docXml.match(new RegExp(`<w:pStyle w:val="${style.bullet}"/>(?:<[^>]+>)*?<w:numId w:val="(\\d+)"/>`))?.[1])
  ?? bulletStyleXml.match(/<w:numId w:val="(\d+)"/)?.[1];
if (!bulletNum) {
  let numbering = text('word/numbering.xml');
  const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
  if (!numbering) {
    numbering = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering ${W}></w:numbering>`;
    addRel('http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering', 'numbering.xml');
    addOverride('/word/numbering.xml', 'application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml');
  }
  const abs = '<w:abstractNum w:abstractNumId="9001"><w:multiLevelType w:val="hybridMultilevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="-"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="567" w:hanging="283"/></w:pPr></w:lvl></w:abstractNum>';
  // abstractNum phải đứng trước mọi w:num trong numbering.xml.
  numbering = numbering.includes('<w:num ') ? numbering.replace('<w:num ', `${abs}<w:num `) : numbering.replace('</w:numbering>', `${abs}</w:numbering>`);
  numbering = numbering.replace('</w:numbering>', '<w:num w:numId="9001"><w:abstractNumId w:val="9001"/></w:num></w:numbering>');
  zip.set('word/numbering.xml', numbering);
  bulletNum = '9001';
}

function addRel(type, target) {
  const name = 'word/_rels/document.xml.rels';
  const rels = text(name);
  let n = 1;
  while (rels.includes(`Id="rIdBid${n}"`)) n++;
  const id = `rIdBid${n}`;
  zip.set(name, rels.replace('</Relationships>', `<Relationship Id="${id}" Type="${type}" Target="${target}"/></Relationships>`));
  return id;
}
function addOverride(part, type) {
  const ct = text('[Content_Types].xml');
  if (!ct.includes(`PartName="${part}"`)) zip.set('[Content_Types].xml', ct.replace('</Types>', `<Override PartName="${part}" ContentType="${type}"/></Types>`));
}
function addDefault(ext, type) {
  const ct = text('[Content_Types].xml');
  if (!new RegExp(`Extension="${ext}"`, 'i').test(ct)) zip.set('[Content_Types].xml', ct.replace('<Default ', `<Default Extension="${ext}" ContentType="${type}"/><Default `));
}

// ---------- Khổ trang ----------
// Hồ sơ cũ thường có nhiều section: trang bìa không số trang, bảng tiến độ xoay ngang, phụ lục. Thân mới chỉ có một
// section, nên chọn section của phần nội dung chính: khổ dọc, không có trang đầu riêng, chân trang có số trang.
const docRels = text('word/_rels/document.xml.rels') ?? '';
const footerHasPage = (rid) => {
  const target = docRels.match(new RegExp(`<Relationship\\b[^>]*Id="${rid}"[^>]*Target="([^"]+)"`))?.[1]
    ?? docRels.match(new RegExp(`<Relationship\\b[^>]*Target="([^"]+)"[^>]*Id="${rid}"`))?.[1];
  return target ? /PAGE/.test(text(`word/${target}`) ?? '') : false;
};
const sections = [...docXml.matchAll(/<w:sectPr\b[\s\S]*?<\/w:sectPr>/g)].map((m) => m[0]);
const score = (s) => (/w:orient="landscape"/.test(s) ? 0 : 4) + (/<w:titlePg\/>/.test(s) ? 0 : 2)
  + ([...s.matchAll(/<w:footerReference w:type="default" r:id="([^"]+)"/g)].some((m) => footerHasPage(m[1])) ? 1 : 0);
const sectPr = sections.reduce((best, s) => (best === undefined || score(s) > score(best) ? s : best), undefined)
  ?? '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1701" w:header="680" w:footer="680" w:gutter="0"/></w:sectPr>';
const num = (re, d) => Number(sectPr.match(re)?.[1] ?? d);
const TEXT_W = num(/<w:pgSz[^>]*w:w="(\d+)"/, 11906) - num(/<w:pgMar[^>]*w:left="(\d+)"/, 1701) - num(/<w:pgMar[^>]*w:right="(\d+)"/, 1134);

// ---------- Dựng thân ----------
// Chữ bọc **…** thành chữ đậm. Không có định dạng nào khác: hồ sơ thầu chỉ đậm ở đề mục và nhãn trong bảng.
function runs(s, rpr = '') {
  return String(s).split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((part) => {
    const bold = part.startsWith('**') && part.endsWith('**');
    const t = bold ? part.slice(2, -2) : part;
    const props = `${bold ? '<w:b/><w:bCs/>' : ''}${rpr}`;
    return `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ''}<w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;
  }).join('');
}
function para(content, { st, ppr = '', rpr = '' } = {}) {
  const p = `${st ? `<w:pStyle w:val="${st}"/>` : ''}${ppr}`;
  return `<w:p>${p ? `<w:pPr>${p}</w:pPr>` : ''}${runs(content, rpr)}</w:p>`;
}
const lines = (v) => (Array.isArray(v) ? v : String(v).split('\n')).filter((x) => x !== '');

function table(t) {
  const cols = t.columns ?? [];
  const n = Math.max(cols.length, ...(t.rows ?? []).map((r) => (Array.isArray(r) ? r : r.cells).length));
  const pct = t.widths && t.widths.length === n ? t.widths : Array(n).fill(100 / n);
  const sum = pct.reduce((a, b) => a + b, 0);
  const w = pct.map((x) => Math.floor((TEXT_W * x) / sum));
  const border = '<w:top w:val="single" w:sz="6" w:space="0" w:color="000000"/><w:left w:val="single" w:sz="6" w:space="0" w:color="000000"/><w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/><w:right w:val="single" w:sz="6" w:space="0" w:color="000000"/><w:insideH w:val="single" w:sz="6" w:space="0" w:color="000000"/><w:insideV w:val="single" w:sz="6" w:space="0" w:color="000000"/>';
  const cell = (value, i, { header = false, bold = false, shade = false } = {}) => {
    const shd = header || shade ? '<w:shd w:val="clear" w:color="auto" w:fill="E7E7E7"/>' : '';
    const st = header ? style.th : style.td;
    const ppr = header && !style.th ? '<w:jc w:val="center"/>' : '';
    const rpr = (header && !style.th) || bold ? '<w:b/><w:bCs/>' : '';
    const ps = lines(value ?? '').map((l) => para(l, { st, ppr, rpr })).join('') || para('', { st });
    return `<w:tc><w:tcPr><w:tcW w:w="${w[i]}" w:type="dxa"/>${shd}<w:vAlign w:val="${header ? 'center' : 'top'}"/></w:tcPr>${ps}</w:tc>`;
  };
  const head = cols.length ? `<w:tr><w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>${cols.map((c, i) => cell(c, i, { header: true })).join('')}</w:tr>` : '';
  const body = (t.rows ?? []).map((r) => {
    const o = Array.isArray(r) ? { cells: r } : r;
    const cells = [...o.cells, ...Array(n - o.cells.length).fill('')];
    return `<w:tr><w:trPr><w:cantSplit/></w:trPr>${cells.map((c, i) => cell(c, i, o)).join('')}</w:tr>`;
  }).join('');
  const out = [];
  if (t.caption) out.push(para(t.caption, { st: style.caption, ppr: '<w:keepNext/>' + (style.caption ? '' : '<w:jc w:val="center"/>'), rpr: style.caption ? '' : '<w:i/>' }));
  out.push(`<w:tbl><w:tblPr><w:tblW w:w="${TEXT_W}" w:type="dxa"/><w:tblBorders>${border}</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="40" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:bottom w:w="40" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid>${w.map((x) => `<w:gridCol w:w="${x}"/>`).join('')}</w:tblGrid>${head}${body}</w:tbl>`);
  // Word cần một đoạn sau bảng; khuôn có kiểu After Table (đoạn nhỏ) thì dùng nó cho khoảng trống vừa phải.
  out.push(`<w:p>${style.after ? `<w:pPr><w:pStyle w:val="${style.after}"/></w:pPr>` : ''}</w:p>`);
  return out.join('');
}

function imageSize(buf) {
  if (buf.readUInt32BE(0) === 0x89504e47) return { ext: 'png', type: 'image/png', w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { ext: 'jpeg', type: 'image/jpeg', h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  throw new Error('Chỉ nhận ảnh PNG hoặc JPEG');
}

let imageNo = 0;
function figure(f) {
  const buf = fs.readFileSync(path.resolve(baseDir, f.file));
  const size = imageSize(buf);
  imageNo++;
  const media = `media/bid-image${imageNo}.${size.ext}`;
  zip.set(`word/${media}`, buf);
  addDefault(size.ext, size.type);
  const rid = addRel('http://schemas.openxmlformats.org/officeDocument/2006/relationships/image', media);
  // Ảnh rộng tối đa bằng bề ngang chữ; đơn vị EMU, 1 twip = 635 EMU, ảnh coi như 96 dpi (1 px = 9525 EMU).
  const maxW = TEXT_W * 635 * (f.width ?? 100) / 100;
  let cx = size.w * 9525;
  let cy = size.h * 9525;
  if (cx > maxW) { cy = Math.round(cy * maxW / cx); cx = Math.round(maxW); }
  const alt = esc(f.alt ?? f.caption ?? '');
  const drawing = `<w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${9000 + imageNo}" name="Hình ${imageNo}" descr="${alt}"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${9000 + imageNo}" name="${media}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rid}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing>`;
  const figPpr = style.figure ? `<w:pStyle w:val="${style.figure}"/>` : '<w:keepNext/><w:jc w:val="center"/>';
  const out = [`<w:p><w:pPr>${figPpr}</w:pPr><w:r>${drawing}</w:r></w:p>`];
  if (f.caption) out.push(para(f.caption, { st: style.caption, ppr: style.caption ? '' : '<w:jc w:val="center"/>', rpr: style.caption ? '' : '<w:i/>' }));
  return out.join('');
}

const PAGE_BREAK = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
const body = [];
if (data.cover?.length) {
  for (const c of data.cover) {
    const o = typeof c === 'string' ? { text: c } : c;
    if (o.space) { body.push(`<w:p><w:pPr><w:spacing w:before="${o.space * 20}" w:after="0"/></w:pPr></w:p>`); continue; }
    const size = o.size ? `<w:sz w:val="${o.size * 2}"/><w:szCs w:val="${o.size * 2}"/>` : '';
    body.push(para(o.text, { ppr: '<w:spacing w:after="120"/><w:jc w:val="center"/>', rpr: `${o.bold ? '<w:b/><w:bCs/>' : ''}${size}` }));
  }
  body.push(PAGE_BREAK);
}
if (data.toc) {
  const levels = typeof data.toc === 'string' ? data.toc : '1-3';
  body.push(para(data.tocTitle ?? 'MỤC LỤC', { ppr: '<w:jc w:val="center"/>', rpr: '<w:b/><w:bCs/>' }));
  body.push(`<w:p><w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \\o "${levels}" \\h \\z \\u </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t xml:space="preserve">Mục lục chưa dựng: mở tệp bằng Word, chọn Yes khi Word hỏi cập nhật trường, hoặc bấm chuột phải vào đây và chọn Update Field.</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>`);
  body.push(PAGE_BREAK);
}

let prev;
for (const b of data.blocks ?? []) {
  // Khuôn hay đặt ngắt trang trước cả phần lớn (A, B…) lẫn tài liệu con (I, II…); tài liệu con đứng ngay sau phần lớn
  // thì nằm cùng trang với nó, như hồ sơ đã nộp vẫn làm.
  const noBreak = prev && prev.part !== undefined ? '<w:pageBreakBefore w:val="0"/>' : '';
  prev = b;
  if (b.part !== undefined) body.push(para(b.part, { st: style.part }));
  else if (b.doc !== undefined) body.push(para(b.doc, { st: style.doc, ppr: noBreak }));
  else if (b.h1 !== undefined) body.push(para(b.h1, { st: style.h1 }));
  else if (b.h2 !== undefined) body.push(para(b.h2, { st: style.h2 }));
  else if (b.h3 !== undefined) body.push(para(b.h3, { st: style.h3 }));
  else if (b.p !== undefined) for (const l of lines(b.p)) body.push(para(l));
  else if (b.bullets) {
    for (const item of b.bullets) {
      const level = Array.isArray(item) ? 1 : 0;
      for (const l of Array.isArray(item) ? item : [item]) {
        const numPr = bulletNum ? `<w:numPr><w:ilvl w:val="${level}"/><w:numId w:val="${bulletNum}"/></w:numPr>` : '';
        body.push(para(l, { st: style.bullet, ppr: numPr }));
      }
    }
  } else if (b.table) body.push(table(b.table));
  else if (b.figure) body.push(figure(b.figure));
  else if (b.pageBreak) body.push(PAGE_BREAK);
  else throw new Error(`Khối không rõ loại: ${JSON.stringify(b).slice(0, 80)}`);
}

// ---------- Ghép lại ----------
const bodyStart = docXml.indexOf('<w:body>') + '<w:body>'.length;
const bodyEnd = docXml.lastIndexOf('</w:body>');
docXml = `${docXml.slice(0, bodyStart)}${body.join('')}${sectPr}${docXml.slice(bodyEnd)}`;
if (!/xmlns:r=/.test(docXml.slice(0, 2000))) docXml = docXml.replace('<w:document ', '<w:document xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ');
zip.set('word/document.xml', docXml);

// Bỏ mọi thứ còn của hồ sơ cũ: ảnh, chú thích cuối trang, nhận xét, thông tin người sửa. Chỉ giữ quan hệ mà thân mới
// hay khổ trang còn dùng (đầu trang, chân trang, kiểu, đánh số…).
const relsName = 'word/_rels/document.xml.rels';
let rels = text(relsName);
for (const m of [...rels.matchAll(/<Relationship\b[^>]*\/>/g)]) {
  const id = m[0].match(/Id="([^"]+)"/)[1];
  const type = m[0].match(/Type="([^"]+)"/)[1];
  const target = m[0].match(/Target="([^"]+)"/)[1];
  const content = /\/(image|comments|commentsExtended|commentsIds|commentsExtensible|people)$/.test(type);
  if (content && !docXml.includes(`"${id}"`) && !/TargetMode="External"/.test(m[0])) {
    rels = rels.replace(m[0], '');
    const part = `word/${target.replace(/^\.?\//, '')}`;
    zip.delete(part);
    zip.delete(part.replace(/^word\/(.*)$/, 'word/_rels/$1.rels'));
    const ct = text('[Content_Types].xml');
    zip.set('[Content_Types].xml', ct.replace(new RegExp(`<Override PartName="/${part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*/>`), ''));
  } else if (/TargetMode="External"/.test(m[0]) && /\/hyperlink$/.test(type) && !docXml.includes(`"${id}"`)) {
    rels = rels.replace(m[0], '');
  }
}
zip.set(relsName, rels);
for (const part of ['word/footnotes.xml', 'word/endnotes.xml']) {
  const x = text(part);
  if (!x) continue;
  const tag = part.includes('foot') ? 'footnote' : 'endnote';
  // Chỉ giữ các mục đường kẻ phân cách mà Word bắt buộc có.
  zip.set(part, x.replace(new RegExp(`<w:${tag}\\b(?![^>]*w:type="(?:separator|continuationSeparator|continuationNotice)")[^>]*>[\\s\\S]*?</w:${tag}>`, 'g'), ''));
}
const core = text('docProps/core.xml');
if (core) {
  const title = esc(data.title ?? '');
  const author = esc(data.author ?? '');
  zip.set('docProps/core.xml', core
    .replace(/<dc:title>[\s\S]*?<\/dc:title>|<dc:title\/>/, `<dc:title>${title}</dc:title>`)
    .replace(/<dc:creator>[\s\S]*?<\/dc:creator>|<dc:creator\/>/, `<dc:creator>${author}</dc:creator>`)
    .replace(/<cp:lastModifiedBy>[\s\S]*?<\/cp:lastModifiedBy>|<cp:lastModifiedBy\/>/, `<cp:lastModifiedBy>${author}</cp:lastModifiedBy>`)
    .replace(/<(dc:subject|dc:description|cp:keywords|cp:category)>[\s\S]*?<\/\1>/g, '<$1></$1>')
    .replace(/<cp:revision>[^<]*<\/cp:revision>/, '<cp:revision>1</cp:revision>')
    .replace(/<cp:lastPrinted>[^<]*<\/cp:lastPrinted>/, '')
    .replace(/(<dcterms:(?:created|modified)\b[^>]*>)[^<]*/g, `$1${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}`));
}
// Có mục lục thì bảo Word cập nhật trường khi mở tệp, để mục lục và số trang đúng ngay.
if (data.toc) {
  const s = text('word/settings.xml');
  if (s && !s.includes('w:updateFields')) zip.set('word/settings.xml', s.replace(/(<w:settings\b[^>]*>)/, '$1<w:updateFields w:val="true"/>'));
}

fs.writeFileSync(output, writeZip(zip));
console.log(`Đã ghi ${output}: ${(data.blocks ?? []).length} khối, ${imageNo} ảnh, khuôn ${templatePath ? path.basename(templatePath) : 'dựng sẵn'}.`);
if (templatePath && missing.length) console.log(`Khuôn không có kiểu đoạn cho: ${missing.join('; ')}. Các khối đó dùng định dạng thường.`);
