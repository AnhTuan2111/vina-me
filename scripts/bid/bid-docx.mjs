#!/usr/bin/env node
// Dựng tệp Word cho hồ sơ dự thầu từ một tệp JSON, theo đúng hình thức của một hồ sơ đã nộp (tệp khuôn).
//
// Script không chỉ lấy kiểu đoạn của khuôn: hồ sơ thật hay định dạng tay đè lên kiểu (đề mục "1." mang kiểu Heading 1
// nhưng được chỉnh về cỡ 13, căn trái). Nên với mỗi loại đoạn (phần lớn, tài liệu con, đề mục từng cấp, đoạn văn, nhãn
// đậm, gạch đầu dòng, chú thích hình, ô tiêu đề và ô thân bảng), script tìm cách định dạng hay gặp nhất trong thân khuôn
// rồi dùng lại nguyên văn. Trang bìa và mục lục của khuôn được giữ, chỉ thay chữ; cách chia section (bìa không số trang,
// trang xoay ngang) giữ như khuôn. Bảng tiến độ theo ngày và bản cam kết dựng theo hình thức đo từ hồ sơ mẫu.
// Không có khuôn thì dùng khuôn dựng sẵn theo cùng các số đo đó.
//
// Dùng: node bid-docx.mjs <content.json> <out.docx> [--template <khuôn.docx>]
// Cấu trúc JSON: references/bid/docx-json.md. Không cần cài gói npm nào.
import fs from 'node:fs';
import path from 'node:path';
import { readZip, writeZip } from './lib/zip.mjs';
import { styleNames, decodeXml } from './lib/doc-text.mjs';

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
const W_NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';

// ---------- Khuôn dựng sẵn ----------
// Số đo lấy từ hồ sơ mẫu: Times New Roman 13, căn đều, giãn dòng 1,5, cách đoạn 10pt; A4, lề trên 2, dưới 3, trái 3,
// phải 2 cm; "A." cỡ 16 căn giữa, "I." cỡ 14 căn giữa, "1." cỡ 13 viết hoa căn trái, "1.1." đậm; bảng chữ 12.
function defaultTemplate() {
  const font = '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/>';
  const st = (id, name, ppr, rpr, basedOn = 'Normal') => `<w:style w:type="paragraph"${/^(Normal|Heading\d|Caption|ListParagraph|TOC\d)$/.test(id) ? '' : ' w:customStyle="1"'} w:styleId="${id}"><w:name w:val="${name}"/>${id === 'Normal' ? '' : `<w:basedOn w:val="${basedOn}"/><w:next w:val="Normal"/>`}<w:qFormat/><w:pPr>${ppr}</w:pPr><w:rPr>${rpr}</w:rPr></w:style>`;
  // Mục lục như hồ sơ mẫu: dòng phần lớn đậm, cách trên 8 pt; dòng tài liệu con thụt 0,8 cm.
  const toc = (lvl, ind, rpr, before) => st(`TOC${lvl}`, `toc ${lvl}`, `<w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9071"/></w:tabs><w:spacing w:before="${before}" w:after="${lvl === 1 ? 60 : 40}" w:line="288" w:lineRule="auto"/><w:ind w:left="${ind}"/><w:jc w:val="left"/>`, rpr);
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles ${W_NS}><w:docDefaults><w:rPrDefault><w:rPr>${font}<w:sz w:val="26"/><w:szCs w:val="26"/><w:lang w:val="vi-VN"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="200" w:line="360" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr></w:pPrDefault></w:docDefaults>`
    + st('Normal', 'Normal', '', '')
    + st('Heading1', 'heading 1', '<w:keepNext/><w:spacing w:before="360" w:line="288" w:lineRule="auto"/><w:jc w:val="left"/><w:outlineLvl w:val="0"/>', '<w:b/><w:caps/>')
    + st('Heading2', 'heading 2', '<w:keepNext/><w:spacing w:before="280" w:after="120" w:line="288" w:lineRule="auto"/><w:jc w:val="left"/><w:outlineLvl w:val="1"/>', '<w:b/>')
    + st('Heading3', 'heading 3', '<w:keepNext/><w:spacing w:before="200" w:after="120" w:line="288" w:lineRule="auto"/><w:jc w:val="left"/><w:outlineLvl w:val="2"/>', '<w:b/><w:i/>')
    + st('MucChinh', 'MucChinh', '<w:pageBreakBefore/><w:jc w:val="center"/>', '<w:sz w:val="32"/><w:szCs w:val="32"/>', 'Heading1')
    + st('MucTaiLieu', 'MucTaiLieu', '<w:pageBreakBefore/><w:jc w:val="center"/>', '<w:sz w:val="28"/><w:szCs w:val="28"/>', 'Heading2')
    + st('ListParagraph', 'List Paragraph', '<w:spacing w:after="80" w:line="312" w:lineRule="auto"/><w:ind w:left="454" w:hanging="284"/><w:contextualSpacing/>', '')
    + st('CK05Text', 'CK05Text', '<w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="left"/>', '<w:sz w:val="28"/><w:szCs w:val="28"/>')
    + st('Figure', 'Figure', '<w:keepNext/><w:spacing w:before="200" w:after="60" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/>', '')
    + st('Caption', 'caption', '<w:spacing w:after="240" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/>', '<w:i/><w:sz w:val="24"/><w:szCs w:val="24"/>')
    + st('TableText', 'Table Text', '<w:spacing w:before="20" w:after="20" w:line="240" w:lineRule="auto"/><w:jc w:val="left"/>', '<w:sz w:val="24"/><w:szCs w:val="24"/>')
    + st('TableHeader', 'Table Header', '<w:jc w:val="center"/>', '<w:b/>', 'TableText')
    + st('AfterTable', 'After Table', '<w:spacing w:after="0" w:line="120" w:lineRule="auto"/>', '<w:sz w:val="12"/><w:szCs w:val="12"/>')
    + toc(1, 0, '<w:b/>', 160) + toc(2, 454, '', 0) + toc(3, 851, '', 0)
    + '<w:style w:type="character" w:styleId="Hyperlink"><w:name w:val="Hyperlink"/></w:style>'
    + '<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>'
    + '</w:styles>';
  const sect = '<w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1701" w:left="1701" w:header="680" w:footer="680" w:gutter="0"/><w:cols w:space="720"/>';
  return new Map([
    ['[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/word/footer2.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>'],
    ['_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>'],
    ['docProps/core.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title></dc:title><dc:creator></dc:creator><cp:lastModifiedBy></cp:lastModifiedBy></cp:coreProperties>'],
    ['word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer2.xml"/></Relationships>'],
    ['word/styles.xml', styles],
    ['word/numbering.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering ${W_NS}><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="&#8226;"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="454" w:hanging="284"/></w:pPr><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr></w:lvl><w:lvl w:ilvl="1"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="-"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="851" w:hanging="284"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`],
    ['word/settings.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings ${W_NS}><w:defaultTabStop w:val="720"/><w:characterSpacingControl w:val="doNotCompress"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>`],
    ['word/footer1.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr ${W_NS}><w:p><w:pPr><w:spacing w:after="0"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:t>1</w:t></w:r><w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>`],
    ['word/footer2.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr ${W_NS}><w:p><w:pPr><w:spacing w:after="0"/></w:pPr></w:p></w:ftr>`],
    ['word/document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${W_NS} xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><w:body><w:sectPr><w:footerReference w:type="default" r:id="rId4"/>${sect}</w:sectPr></w:body></w:document>`],
  ]);
}

// ---------- Thứ tự phần tử trong pPr, rPr ----------
// Word từ chối tệp khi phần tử con không đúng thứ tự của chuẩn OOXML, nên mọi lần ghép định dạng đều sắp lại theo đây.
const PPR_ORDER = 'pStyle keepNext keepLines pageBreakBefore framePr widowControl numPr suppressLineNumbers pBdr shd tabs suppressAutoHyphens kinsoku wordWrap overflowPunct topLinePunct autoSpaceDE autoSpaceDN bidi adjustRightInd snapToGrid spacing ind contextualSpacing mirrorIndents suppressOverlap jc textDirection textAlignment textboxTightWrap outlineLvl divId cnfStyle'.split(' ');
const RPR_ORDER = 'rStyle rFonts b bCs i iCs caps smallCaps strike dstrike outline shadow emboss imprint noProof snapToGrid vanish webHidden color spacing w kern position sz szCs highlight u effect bdr shd fitText vertAlign rtl cs em lang eastAsianLayout specVanish'.split(' ');
function children(xml) {
  const out = [];
  const re = /<w:(\w+)\b[^>]*?(?:\/>|>[\s\S]*?<\/w:\1>)/g;
  let m;
  while ((m = re.exec(xml))) out.push([m[1], m[0]]);
  return out;
}
function merge(order, ...parts) {
  const map = new Map();
  for (const p of parts) for (const [tag, x] of children(p ?? '')) map.set(tag, x);
  return [...map].filter(([tag]) => order.includes(tag)).sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0])).map(([, x]) => x).join('');
}
const mergePpr = (...p) => merge(PPR_ORDER, ...p);
const mergeRpr = (...p) => merge(RPR_ORDER, ...p);
const clean = (x) => x.replace(/\s(?:w:rsid\w*|w14:\w+)="[^"]*"/g, '');

// ---------- Mở khuôn ----------
const zip = templatePath ? readZip(fs.readFileSync(templatePath)) : defaultTemplate();
const text = (name) => zip.get(name)?.toString('utf8');
let docXml = text('word/document.xml');
if (!docXml) throw new Error('Tệp khuôn không có word/document.xml');
const stylesXml = text('word/styles.xml') ?? '';
const names = styleNames(stylesXml);
const byName = new Map([...names].map(([id, name]) => [name.toLowerCase(), id]));
const findStyle = (...cands) => cands.map((c) => byName.get(c.toLowerCase()) ?? (names.has(c) ? c : undefined)).find(Boolean);
const S = {
  part: findStyle('MucChinh'), doc: findStyle('MucTaiLieu'),
  h1: findStyle('heading 1'), h2: findStyle('heading 2'), h3: findStyle('heading 3'),
  bullet: findStyle('List Paragraph', 'List Bullet'), figure: findStyle('Figure'), caption: findStyle('caption'),
  th: findStyle('Table Header', 'Table Heading'), td: findStyle('Table Text', 'Table Paragraph', 'Table Contents'),
  after: findStyle('After Table'), letter: findStyle('CK05Text'),
};

const bodyStart = docXml.indexOf('<w:body>') + '<w:body>'.length;
const bodyEnd = docXml.lastIndexOf('</w:body>');
const oldBody = docXml.slice(bodyStart, bodyEnd);

// Đi qua thân khuôn, ghi lại mỗi đoạn: nằm trong bảng hay không, kiểu, định dạng đoạn, định dạng lần chữ đầu, chữ.
const paras = [];
{
  const re = /<w:tbl>|<\/w:tbl>|<w:p(?:\s[^>]*)?\/>|<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g;
  let depth = 0;
  let afterTable = false;
  let m;
  while ((m = re.exec(oldBody))) {
    if (m[0] === '<w:tbl>') { depth++; continue; }
    if (m[0] === '</w:tbl>') { depth--; afterTable = depth === 0; continue; }
    const x = m[0];
    const pprRaw = clean(x.match(/<w:pPr>([\s\S]*?)<\/w:pPr>/)?.[1] ?? '').replace(/<w:rPr>[\s\S]*?<\/w:rPr>|<w:sectPr\b[\s\S]*?<\/w:sectPr>|<w:pPrChange\b[\s\S]*?<\/w:pPrChange>/g, '');
    const rpr = clean(x.match(/<w:r\b[^>]*>\s*<w:rPr>([\s\S]*?)<\/w:rPr>/)?.[1] ?? '').replace(/<w:lang\b[^>]*\/>|<w:noProof\/>|<w:rStyle w:val="Hyperlink"\/>/g, '');
    const t = decodeXml([...x.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g)].map((r) => r[1]).join(''));
    paras.push({
      start: m.index, end: m.index + x.length, xml: x, inTable: depth > 0, afterTable: afterTable && depth === 0,
      style: pprRaw.match(/<w:pStyle w:val="([^"]+)"/)?.[1], ppr: pprRaw, rpr, text: t,
    });
    if (depth === 0) afterTable = false;
  }
}

// Cách định dạng hay gặp nhất trong một nhóm đoạn. Định dạng chữ chỉ lấy khi đa số đoạn trong nhóm có nó.
function common(list) {
  if (!list.length) return undefined;
  const count = new Map();
  for (const p of list) {
    const k = `${p.ppr}\u0000${p.rpr}`;
    count.set(k, (count.get(k) ?? 0) + (p.text.length > 0 ? 1 : 0.1));
  }
  const [k] = [...count].sort((a, b) => b[1] - a[1])[0];
  const [ppr, rpr] = k.split('\u0000');
  return { ppr, rpr };
}
const out_ = paras.filter((p) => !p.inTable && p.text.trim());
const inT = paras.filter((p) => p.inTable && p.text.trim());
const isBold = (r) => /<w:b\/>|<w:b w:val="(?:1|true)"\/>/.test(r);
const ps = (id) => (id ? `<w:pStyle w:val="${id}"/>` : '');
const F = {
  part: common(out_.filter((p) => S.part && p.style === S.part)) ?? { ppr: ps(S.part ?? S.h1), rpr: '' },
  doc: common(out_.filter((p) => S.doc && p.style === S.doc)) ?? { ppr: ps(S.doc ?? S.h1), rpr: '' },
  h1: common(out_.filter((p) => S.h1 && p.style === S.h1 && /^\d+\.\s/.test(p.text))) ?? { ppr: ps(S.h1), rpr: '' },
  h2: common(out_.filter((p) => S.h2 && p.style === S.h2)) ?? { ppr: ps(S.h2), rpr: '' },
  h3: common(out_.filter((p) => S.h3 && p.style === S.h3)) ?? { ppr: ps(S.h3), rpr: '' },
  p: common(out_.filter((p) => !p.style && !isBold(p.rpr) && !/numPr|<w:ind |<w:jc w:val="center"/.test(p.ppr) && p.text.length > 60)) ?? { ppr: '', rpr: '' },
  label: common(out_.filter((p) => !p.style && isBold(p.rpr) && /keepNext/.test(p.ppr) && p.text.length < 160)) ?? { ppr: '<w:keepNext/>', rpr: '<w:b/>' },
  bullet: common(out_.filter((p) => S.bullet && p.style === S.bullet && /numPr/.test(p.ppr) && !isBold(p.rpr))) ?? { ppr: ps(S.bullet), rpr: '' },
  figure: common(paras.filter((p) => S.figure && p.style === S.figure)) ?? { ppr: S.figure ? ps(S.figure) : '<w:keepNext/><w:jc w:val="center"/>', rpr: '' },
  caption: common(out_.filter((p) => S.caption && p.style === S.caption)) ?? { ppr: S.caption ? ps(S.caption) : '<w:jc w:val="center"/>', rpr: S.caption ? '' : '<w:i/>' },
  tocTitle: common(out_.filter((p) => /^m[ụu]c l[ụu]c$/i.test(p.text.trim()))) ?? { ppr: '<w:spacing w:before="0" w:after="240"/><w:jc w:val="left"/>', rpr: '<w:b/>' },
  th: common(inT.filter((p) => S.th && p.style === S.th)) ?? { ppr: S.th ? ps(S.th) : '<w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/>', rpr: S.th ? '' : '<w:b/>' },
  td: common(inT.filter((p) => S.td && p.style === S.td && !/<w:jc /.test(p.ppr))) ?? { ppr: S.td ? ps(S.td) : '<w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="left"/>', rpr: '' },
  after: common(paras.filter((p) => p.afterTable && !p.text.trim())) ?? { ppr: S.after ? ps(S.after) : '<w:spacing w:after="0"/>', rpr: '' },
};
F.tdc = { ppr: mergePpr(F.td.ppr, '<w:jc w:val="center"/>'), rpr: F.td.rpr };
// Cảnh báo in ra khi dựng xong; mỗi cảnh báo là một chỗ phải sửa trong content.json.
const warnings = [];
// Loại đoạn mà khuôn tự in hoa (thuộc tính caps ở định dạng tay hay ở kiểu đoạn): chữ trong JSON phải viết thường như
// khuôn ("A. Yêu cầu kỹ thuật của hàng hóa"), Word tự hiện chữ hoa trên trang còn mục lục giữ chữ thường. Gõ sẵn chữ hoa
// thì mục lục cũng in hoa, khác mẫu.
const styleHasCaps = (ppr) => {
  // Đi ngược chuỗi kiểu gốc (MucChinh dựa trên Heading 1, Heading 1 mới có caps).
  let id = ppr.match(/<w:pStyle w:val="([^"]+)"/)?.[1];
  for (let depth = 0; id && depth < 6; depth++) {
    const sx = stylesXml.match(new RegExp(`<w:style\\b[^>]*w:styleId="${id}"[\\s\\S]*?</w:style>`))?.[0] ?? '';
    const caps = sx.match(/<w:caps(?: w:val="(\w+)")?\/>/);
    if (caps) return !['0', 'false'].includes(caps[1]);
    id = sx.match(/<w:basedOn w:val="([^"]+)"/)?.[1];
  }
  return false;
};
const CAPS = Object.fromEntries(['part', 'doc', 'h1', 'h2', 'h3'].map((k) => [k, /<w:caps\/>/.test(F[k].rpr) || styleHasCaps(F[k].ppr)]));
const isUpper = (t) => { const l = t.replace(/[^\p{L}]/gu, ''); return l.length > 3 && l === l.toLocaleUpperCase('vi'); };
// Mục lục "clean" (mặc định), sửa chỗ yếu của mục lục hồ sơ mẫu: mẫu gõ sẵn chữ hoa cho tài liệu con (I, II...) nên trong mục
// lục mục con in hoa, trông to hơn mục cha; mục cha dài xuống dòng sát lề trái. Ở đây tài liệu con viết chữ thường trong JSON,
// kiểu đoạn tự in hoa trên trang (giữ hình của mẫu), mục lục giữ chữ thường; dòng thứ hai thụt thẳng sau "A. ", "II. ".
// "tocStyle": "template" thì giữ mục lục của khuôn.
const TOC_CLEAN = (data.tocStyle ?? 'clean') === 'clean';
const docTypedCaps = (() => {
  const ds = out_.filter((p) => S.doc && p.style === S.doc);
  return !templatePath || (ds.length > 0 && ds.filter((p) => isUpper(p.text)).length * 2 >= ds.length);
})();
if (TOC_CLEAN && S.doc && docTypedCaps) CAPS.doc = true;
// Đánh số của gạch đầu dòng: numId hay gặp nhất của kiểu List Paragraph trong khuôn; khuôn không có thì thêm một định nghĩa.
let bulletNum = F.bullet.ppr.match(/<w:numId w:val="(\d+)"\/>/)?.[1];
if (!bulletNum) {
  const sx = S.bullet ? stylesXml.match(new RegExp(`<w:style\\b[^>]*w:styleId="${S.bullet}"[\\s\\S]*?</w:style>`))?.[0] ?? '' : '';
  bulletNum = sx.match(/<w:numId w:val="(\d+)"/)?.[1];
}
if (!bulletNum) {
  let numbering = text('word/numbering.xml');
  if (!numbering) {
    numbering = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering ${W_NS}></w:numbering>`;
    addRel('http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering', 'numbering.xml');
    addOverride('/word/numbering.xml', 'application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml');
  }
  const abs = '<w:abstractNum w:abstractNumId="9001"><w:multiLevelType w:val="hybridMultilevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="&#8226;"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="567" w:hanging="284"/></w:pPr></w:lvl><w:lvl w:ilvl="1"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="-"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="993" w:hanging="284"/></w:pPr></w:lvl></w:abstractNum>';
  numbering = numbering.includes('<w:num ') ? numbering.replace('<w:num ', `${abs}<w:num `) : numbering.replace('</w:numbering>', `${abs}</w:numbering>`);
  zip.set('word/numbering.xml', numbering.replace('</w:numbering>', '<w:num w:numId="9001"><w:abstractNumId w:val="9001"/></w:num></w:numbering>'));
  bulletNum = '9001';
}
F.bullet.ppr = F.bullet.ppr.replace(/<w:numPr>[\s\S]*?<\/w:numPr>/, '');

// Hình thức bảng: lấy từ bảng đầu tiên của khuôn có ô tiêu đề (viền, lề ô, màu nền tiêu đề, cách căn dọc).
const TABLE = (() => {
  const def = {
    tblPr: '<w:tblBorders><w:top w:val="single" w:sz="6" w:space="0" w:color="000000"/><w:left w:val="single" w:sz="6" w:space="0" w:color="000000"/><w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/><w:right w:val="single" w:sz="6" w:space="0" w:color="000000"/><w:insideH w:val="single" w:sz="6" w:space="0" w:color="000000"/><w:insideV w:val="single" w:sz="6" w:space="0" w:color="000000"/></w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="40" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:bottom w:w="40" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>',
    headFill: 'E7E7E7', headVAlign: 'center', bodyVAlign: 'top',
  };
  for (const t of oldBody.match(/<w:tbl>[\s\S]*?<\/w:tbl>/g) ?? []) {
    if (!S.th || !t.includes(`<w:pStyle w:val="${S.th}"/>`)) continue;
    const tblPr = clean(t.match(/<w:tblPr>([\s\S]*?)<\/w:tblPr>/)?.[1] ?? '').replace(/<w:tblW\b[^>]*\/>|<w:tblStyle\b[^>]*\/>/g, '');
    const rows = t.match(/<w:tr\b[\s\S]*?<\/w:tr>/g) ?? [];
    const head = rows[0] ?? '';
    const body = rows[1] ?? '';
    return {
      tblPr: tblPr || def.tblPr,
      headFill: head.match(/w:fill="([0-9A-Fa-f]{6})"/)?.[1] ?? def.headFill,
      headVAlign: head.match(/<w:vAlign w:val="(\w+)"/)?.[1] ?? def.headVAlign,
      bodyVAlign: body.match(/<w:vAlign w:val="(\w+)"/)?.[1] ?? def.bodyVAlign,
    };
  }
  return def;
})();
// Kiểu bảng "clean" (mặc định), sửa chỗ yếu của bảng hồ sơ mẫu: viền đen dày đều khắp bảng làm bảng nặng, hàng tiêu đề nền
// xám nhạt khó tách khỏi thân, chữ sát viền ô. Ở đây viền ngoài xám đậm mảnh, viền trong xám nhạt, hàng tiêu đề nền xanh nhạt
// chữ xanh đậm và gạch dưới đậm hơn, hàng nhóm nền xám rất nhạt, ô có lề trên dưới. Màu cùng tông bảng tiến độ của mẫu
// (D9E2F3, 2F5496), in đen trắng vẫn phân biệt được. "tableStyle": "template" trong JSON thì giữ nguyên kiểu bảng của khuôn.
const CLEAN = (data.tableStyle ?? 'clean') === 'clean';
// Bìa clean (mặc định): khung viền đôi xanh đậm chỉ ở trang bìa, tên tài liệu cùng màu, dòng nhà thầu vừa một dòng. Hồ sơ mẫu
// để bìa trơn, chữ rời rạc giữa trang trắng. "coverStyle": "template" giữ bìa của khuôn.
const COVER_CLEAN = (data.coverStyle ?? 'clean') === 'clean';
const COVER_COLOR = '1F3864';
const COVER_BORDER = ['top', 'left', 'bottom', 'right'].map((k) => `<w:${k} w:val="double" w:sz="6" w:space="24" w:color="${COVER_COLOR}"/>`).join('');
// Dòng bìa (dòng nhà thầu) dài hơn một dòng: ngắt thành hai dòng gần bằng nhau ở chỗ giữa hai từ, thay vì để Word cắt ở từ
// cuối ("CÔNG / NGHỆ"). Chữ hoa đậm rộng khoảng 0,72 cỡ chữ.
const coverRuns = (t, rpr, pt, width) => {
  const text = String(t);
  if (!COVER_CLEAN || text.length * pt * 0.72 * 20 <= width) return runs(text, rpr);
  const words = text.split(' ');
  let best = 1;
  let bestDiff = Infinity;
  for (let k = 1; k < words.length; k++) {
    const a = words.slice(0, k).join(' ').length;
    const b = words.slice(k).join(' ').length;
    if (Math.abs(a - b) < bestDiff) { bestDiff = Math.abs(a - b); best = k; }
  }
  return runs(words.slice(0, best).join(' '), rpr) + '<w:r><w:br/></w:r>' + runs(words.slice(best).join(' '), rpr);
};
const addCoverBorder = (sect) => (/<w:pgBorders\b/.test(sect) ? sect : sect.replace(/(<w:pgMar\b[^>]*\/>)/, `$1<w:pgBorders w:display="firstPage" w:offsetFrom="page">${COVER_BORDER}</w:pgBorders>`));
if (CLEAN) {
  const b = (side, sz, color) => `<w:${side} w:val="single" w:sz="${sz}" w:space="0" w:color="${color}"/>`;
  Object.assign(TABLE, {
    tblPr: `<w:tblBorders>${b('top', 8, '595959')}${b('left', 8, '595959')}${b('bottom', 8, '595959')}${b('right', 8, '595959')}${b('insideH', 4, 'A6A6A6')}${b('insideV', 4, 'A6A6A6')}</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="57" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="57" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>`,
    headFill: 'D9E2F3', headColor: '1F3864', groupFill: 'F2F2F2',
    headBorder: `<w:tcBorders>${b('bottom', 12, '2F5496')}</w:tcBorders>`,
    headVAlign: 'center', bodyVAlign: 'top',
  });
}

function addRel(type, target) {
  const name = 'word/_rels/document.xml.rels';
  const rels = text(name);
  let n = 1;
  while (rels.includes(`Id="rIdBid${n}"`)) n++;
  zip.set(name, rels.replace('</Relationships>', `<Relationship Id="rIdBid${n}" Type="${type}" Target="${target}"/></Relationships>`));
  return `rIdBid${n}`;
}
function addOverride(part, type) {
  const ct = text('[Content_Types].xml');
  if (!ct.includes(`PartName="${part}"`)) zip.set('[Content_Types].xml', ct.replace('</Types>', `<Override PartName="${part}" ContentType="${type}"/></Types>`));
}
function addDefault(ext, type) {
  const ct = text('[Content_Types].xml');
  if (!new RegExp(`Extension="${ext}"`, 'i').test(ct)) zip.set('[Content_Types].xml', ct.replace('<Default ', `<Default Extension="${ext}" ContentType="${type}"/><Default `));
}

// ---------- Section ----------
// Section chính: khổ dọc, không có trang đầu riêng, chân trang có số trang. Section ngang: section xoay ngang của khuôn,
// không có thì xoay section chính.
const docRels = text('word/_rels/document.xml.rels') ?? '';
const footerHasPage = (rid) => {
  const rel = docRels.match(new RegExp(`<Relationship\\b[^>]*\\bId="${rid}"[^>]*/>`))?.[0];
  const target = rel?.match(/Target="([^"]+)"/)?.[1];
  return target ? /PAGE/.test(text(`word/${target}`) ?? '') : false;
};
const sections = [...docXml.matchAll(/<w:sectPr\b[\s\S]*?<\/w:sectPr>/g)].map((m) => clean(m[0]));
const landscapeOf = (s) => /w:orient="landscape"/.test(s);
const score = (s) => (landscapeOf(s) ? 0 : 4) + (/<w:titlePg\/>/.test(s) ? 0 : 2)
  + ([...s.matchAll(/<w:footerReference w:type="default" r:id="([^"]+)"/g)].some((m) => footerHasPage(m[1])) ? 1 : 0);
const MAIN = sections.reduce((best, s) => (best === undefined || score(s) > score(best) ? s : best), undefined)
  ?? '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1701" w:left="1701" w:header="680" w:footer="680" w:gutter="0"/><w:cols w:space="720"/></w:sectPr>';
const LANDSCAPE = sections.find(landscapeOf) ?? (() => {
  const w = MAIN.match(/<w:pgSz[^>]*w:w="(\d+)"/)?.[1] ?? '11906';
  const h = MAIN.match(/<w:pgSz[^>]*w:h="(\d+)"/)?.[1] ?? '16838';
  return MAIN.replace(/<w:pgSz\b[^>]*\/>/, `<w:pgSz w:w="${h}" w:h="${w}" w:orient="landscape"/>`)
    .replace(/<w:pgMar\b[^>]*\/>/, '<w:pgMar w:top="1559" w:right="1134" w:bottom="425" w:left="1134" w:header="567" w:footer="340" w:gutter="0"/>');
})();
// Section cuối của khuôn: hồ sơ mẫu để các bản cam kết trong một section riêng không in số trang. Dùng nó cho phần cam kết
// khi chân trang của nó không có số trang và nó là khổ dọc.
const lastSect = sections.at(-1);
const TAIL = lastSect && !landscapeOf(lastSect) && ![...lastSect.matchAll(/<w:footerReference w:type="default" r:id="([^"]+)"/g)].some((m) => footerHasPage(m[1])) ? lastSect
  : !templatePath ? MAIN.replace(/<w:footerReference\b[^>]*\/>/, '<w:footerReference w:type="default" r:id="rId5"/>').replace(/w:bottom="\d+"/, 'w:bottom="567"')
  : MAIN;
let inTail = false;
const textWidth = (s) => Number(s.match(/<w:pgSz[^>]*w:w="(\d+)"/)?.[1] ?? 11906)
  - Number(s.match(/<w:pgMar[^>]*w:left="(\d+)"/)?.[1] ?? 1701) - Number(s.match(/<w:pgMar[^>]*w:right="(\d+)"/)?.[1] ?? 1134);
const sectBreak = (s) => `<w:p><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/>${s.replace(/<w:titlePg\/>/, '')}</w:pPr></w:p>`;
let TEXT_W = textWidth(MAIN);
// Đoạn rất thấp (1 pt): ngăn hai bảng liền nhau dính làm một, hoặc mở trang mới bằng pageBreakBefore. Ngắt trang bằng ký tự
// ngắt đặt trong một đoạn riêng sẽ sinh trang trắng khi trang trước vừa khít, vì đoạn chứa ký tự ngắt bị đẩy sang trang mới.
const TINY = '<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="20" w:lineRule="exact"/></w:pPr><w:r><w:rPr><w:sz w:val="2"/><w:szCs w:val="2"/></w:rPr></w:r></w:p>';
const TINY_BREAK = '<w:p><w:pPr><w:pageBreakBefore/><w:spacing w:before="0" w:after="0" w:line="20" w:lineRule="exact"/></w:pPr><w:r><w:rPr><w:sz w:val="2"/><w:szCs w:val="2"/></w:rPr></w:r></w:p>';

// ---------- Viết đoạn ----------
// Chữ bọc **…** thành chữ đậm, *…* thành chữ nghiêng. Hồ sơ mẫu đậm nhãn đầu đoạn, đầu gạch đầu dòng ("Phần mềm X: …").
function runs(s, rpr = '') {
  return String(s).split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/).filter(Boolean).map((part) => {
    const bold = /^\*\*[\s\S]+\*\*$/.test(part);
    const ital = !bold && /^\*[\s\S]+\*$/.test(part);
    const t = bold ? part.slice(2, -2) : ital ? part.slice(1, -1) : part;
    const props = mergeRpr(rpr, bold ? '<w:b/><w:bCs/>' : '', ital ? '<w:i/><w:iCs/>' : '');
    // "E-HSMT", "E-HSDT", "E-TBMT": gạch nối không ngắt dòng, để Word không bẻ thành "E-" cuối dòng và "HSMT" dòng sau.
    const body = esc(t).replace(/(^|[^\p{L}])E-(?=[A-ZĐ])/gu, '$1E</w:t><w:noBreakHyphen/><w:t xml:space="preserve">');
    return `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ''}<w:t xml:space="preserve">${body}</w:t></w:r>`;
  }).join('');
}
function para(content, f, extraPpr = '', extraRpr = '') {
  const ppr = mergePpr(f?.ppr ?? '', extraPpr);
  return `<w:p>${ppr ? `<w:pPr>${ppr}</w:pPr>` : ''}${runs(content, mergeRpr(f?.rpr ?? '', extraRpr))}</w:p>`;
}
const lines = (v) => (Array.isArray(v) ? v : String(v).split('\n')).filter((x) => x !== '');

function table(t) {
  const cols = t.columns ?? [];
  const rowsIn = (t.rows ?? []).map((r) => (Array.isArray(r) ? { cells: r } : r));
  const n = Math.max(cols.length, ...rowsIn.map((r) => r.cells.length));
  const pct = t.widths && t.widths.length === n ? t.widths : Array(n).fill(100 / n);
  const sum = pct.reduce((a, b) => a + b, 0);
  const w = pct.map((x) => Math.floor((TEXT_W * x) / sum));
  // Từ dài nhất của tiêu đề cột phải nằm trọn một dòng ("STT", "lượng"): cột thiếu thì nới, lấy bớt từ cột rộng nhất.
  // Chữ đậm ở ô tiêu đề rộng khoảng 0,6 cỡ chữ, chữ hoa đậm khoảng 0,72; lề ô hai bên 200 twip cộng phần dư của Word.
  {
    const headPt = Number((F.th.rpr.match(/<w:sz w:val="(\d+)"/)?.[1] ?? F.td.rpr.match(/<w:sz w:val="(\d+)"/)?.[1] ?? 24)) / 2;
    cols.forEach((c, i) => {
      const word = String(c).split(/\s+/).reduce((a, b) => (b.length > a.length ? b : a), '');
      const need = Math.ceil(word.length * headPt * (word === word.toLocaleUpperCase("vi") ? 0.72 : 0.6) * 20 + 220);
      if (w[i] >= need) return;
      const widest = w.indexOf(Math.max(...w));
      if (widest === i) return;
      const d = need - w[i];
      w[i] += d;
      w[widest] -= d;
    });
  }
  // Cột số thứ tự căn giữa như hồ sơ mẫu; cột khác căn giữa khi JSON chỉ định.
  const center = new Set(t.center ?? cols.map((c, i) => (/^(stt|tt|số tt)$/i.test(String(c).trim()) ? i : -1)).filter((i) => i >= 0));
  // Ước lượng chữ Times New Roman: một ký tự thường rộng khoảng 0,45 cỡ chữ, chữ đậm in hoa ở ô tiêu đề khoảng 0,6; lề ô hai
  // bên khoảng 160 twip. Từ dài hơn bề ngang ô thì Word ngắt giữa từ ("ST / T"); cột hẹp (dưới 15%) mà ô quá 8 dòng là nhét
  // chữ dài (chỗ đánh dấu) vào cột hẹp.
  const cellPt = Number((F.td.rpr.match(/<w:sz w:val="(\d+)"/)?.[1] ?? 24)) / 2;
  const fit = (i, header) => Math.max(1, (w[i] - 200) / (cellPt * (header ? 0.6 : 0.45) * 20));
  const narrow = (i) => (pct[i] / sum) * 100 < 15;
  const name = t.caption ?? cols.join(' | ').slice(0, 50);
  const seenWarn = new Set();
  // Số dòng khi Word xếp từng từ vào ô rộng `cap` ký tự.
  const wrapLines = (txt, cap) => txt.split(/\s+/).reduce((acc, wd) => {
    if (acc.cur && acc.cur + 1 + wd.length <= cap) acc.cur += 1 + wd.length; else { acc.n += 1; acc.cur = wd.length; }
    return acc;
  }, { n: 0, cur: 0 }).n;
  const checkCell = (value, i, header = false) => {
    for (const l of lines(value ?? '')) {
      const plain = l.replace(/\*\*|\*/g, '');
      const word = plain.split(/\s+/).reduce((a, b) => (b.length > a.length ? b : a), '');
      if (word.length > fit(i, header) && !seenWarn.has(`w${i}`)) { seenWarn.add(`w${i}`); warnings.push(`Bảng "${name}": cột ${i + 1} hẹp, chữ "${word}" bị ngắt giữa từ; nới tỉ lệ cột`); }
      // Ô tiêu đề mỗi dòng một tiếng ("Đơn / vị / tính"): ba dòng trở lên thì nới cột.
      if (header && wrapLines(plain, fit(i, true)) >= 3 && wrapLines(plain, fit(i, true)) >= plain.split(/\s+/).length && !seenWarn.has(`v${i}`)) { seenWarn.add(`v${i}`); warnings.push(`Bảng "${name}": tiêu đề cột ${i + 1} "${plain}" xuống từ ba dòng, mỗi dòng một tiếng; nới cột (khoảng 11-12% cho "Đơn vị tính", "Tổng số ngày")`); }
      if (narrow(i) && Math.ceil(plain.length / fit(i)) > 8 && !seenWarn.has(`h${i}`)) { seenWarn.add(`h${i}`); warnings.push(`Bảng "${name}": cột ${i + 1} hẹp so với chữ trong ô ("${plain.slice(0, 40)}..."), ô cao quá 8 dòng; nới cột hoặc dồn ghi chú sang cột rộng`); }
    }
  };
  cols.forEach((c, i) => checkCell(c, i, true));
  rowsIn.forEach((o) => o.cells.forEach((c, i) => checkCell(c, i)));
  const cell = (value, i, { header = false, bold = false, shade = false, fill, keepRow = false } = {}, span = 1) => {
    const f = header ? F.th : center.has(i) ? F.tdc : F.td;
    const bg = fill ?? (header ? TABLE.headFill : shade ? TABLE.groupFill ?? TABLE.headFill : undefined);
    const shd = bg ? `<w:shd w:val="clear" w:color="auto" w:fill="${bg}"/>` : '';
    // Ô tiêu đề giữ với hàng sau, để tiêu đề bảng không đứng một mình cuối trang.
    const rpr = (bold ? '<w:b/><w:bCs/>' : '') + (header && TABLE.headColor ? `<w:color w:val="${TABLE.headColor}"/>` : '');
    // Hàng nhóm (shade) cũng giữ với hàng sau, để không rơi một mình cuối trang.
    const keep = header || shade || keepRow ? '<w:keepNext/>' : '';
    const ps_ = lines(value ?? '').map((l) => para(l, f, keep, rpr)).join('') || para('', f, keep);
    const width = w.slice(i, i + span).reduce((a, b) => a + b, 0);
    return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${span > 1 ? `<w:gridSpan w:val="${span}"/>` : ''}${header && TABLE.headBorder ? TABLE.headBorder : ''}${shd}<w:vAlign w:val="${header ? TABLE.headVAlign : TABLE.bodyVAlign}"/></w:tcPr>${ps_}</w:tc>`;
  };
  const head = cols.length ? `<w:tr><w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>${cols.map((c, i) => cell(c, i, { header: true })).join('')}</w:tr>` : '';
  // Hàng áp chót giữ với hàng cuối, để hàng cuối (thường là hàng tổng) không sang trang một mình.
  const body = rowsIn.map((o0, ri) => {
    const o = ri === rowsIn.length - 2 ? { ...o0, keepRow: true } : o0;
    // Hàng ít ô hơn số cột (hàng nhóm "B | DỊCH VỤ LIÊN QUAN"): ô cuối trải ngang hết các cột còn lại, như hồ sơ mẫu.
    const k = o.cells.length;
    const cells = k < n ? o.cells.map((c, i) => cell(c, i, o, i === k - 1 ? n - i : 1)) : o.cells.map((c, i) => cell(c, i, o));
    return `<w:tr><w:trPr><w:cantSplit/></w:trPr>${cells.join('')}</w:tr>`;
  }).join('');
  const out = [];
  if (t.caption) out.push(para(t.caption, F.caption, '<w:keepNext/>'));
  out.push(`<w:tbl><w:tblPr><w:tblW w:w="${w.reduce((a, b) => a + b, 0)}" w:type="dxa"/>${TABLE.tblPr}</w:tblPr><w:tblGrid>${w.map((x) => `<w:gridCol w:w="${x}"/>`).join('')}</w:tblGrid>${head}${body}</w:tbl>`);
  // Kiểu clean: đoạn sau bảng cao 8pt để chữ sau không dính mép dưới bảng.
  out.push(CLEAN ? '<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="160" w:lineRule="exact"/></w:pPr></w:p>' : para('', F.after));
  return out.join('');
}

// Bảng tiến độ theo ngày, hình thức đo từ hồ sơ mẫu: xoay ngang, mỗi bảng 10 ngày, cột STT 700, công việc 4800, người
// thực hiện 2200, mỗi ngày 450, tổng 1100 (đơn vị twip); viền xám 808080; tiêu đề và nhóm cấp 2 nền D9E2F3; nhóm cấp 1
// nền 2F5496 chữ trắng; ô ngày làm việc tô FF9900 (hoặc màu riêng của dòng); chữ 9,5.
function gantt(g) {
  if (!g.dayOne) throw new Error('Khối gantt cần "dayOne": mốc ngày 1 đúng chữ HSMT, ví dụ "ngày ký hợp đồng"; phải trùng mốc ghi ở mục tiến độ.');
  const days = g.days;
  const per = g.perTable ?? 10;
  const tables = Math.ceil(days / per);
  const head = g.columns ?? ['STT', 'Công việc', 'Người thực hiện/theo dõi'];
  const fixed = [700, 4800, 2200];
  const dayW = 450;
  const totalW = 1100;
  const sz = (n) => `<w:sz w:val="${n}"/><w:szCs w:val="${n}"/>`;
  const p = (t, { center = false, bold = false, color, size = 19 } = {}) => `<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/>${center ? '<w:jc w:val="center"/>' : '<w:jc w:val="left"/>'}</w:pPr>${runs(t, `${bold ? '<w:b/><w:bCs/>' : ''}${color ? `<w:color w:val="${color}"/>` : ''}${sz(size)}`)}</w:p>`;
  const tc = (w, content, { fill, span, vmerge } = {}) => `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${span ? `<w:gridSpan w:val="${span}"/>` : ''}${vmerge ? `<w:vMerge${vmerge === 'restart' ? ' w:val="restart"' : ''}/>` : ''}${fill ? `<w:shd w:val="clear" w:color="auto" w:fill="${fill}"/>` : ''}<w:vAlign w:val="center"/></w:tcPr>${content}</w:tc>`;
  const border = '<w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:left w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:right w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="808080"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="808080"/></w:tblBorders>';
  const out = [];
  if (g.title) out.push(para(g.title, F.part, '<w:pageBreakBefore w:val="0"/><w:keepNext/>'));
  // Đề mục, câu mở của mục tiến độ theo ngày nằm ngay trên bảng đầu tiên của trang ngang, không để trang dọc gần trắng.
  if (g.intro) out.push(blocks(g.intro, g.title ? { part: g.title } : undefined, true));
  for (let k = 0; k < tables; k++) {
    const from = k * per + 1;
    const to = Math.min(days, from + per - 1);
    // Bảng nào cũng đủ số cột ngày như nhau để các bảng cùng bề rộng; ngày vượt quá thời gian thực hiện để trống, nền xám.
    const cnt = per;
    const beyond = (d) => from + d > days;
    const width = fixed.reduce((a, b) => a + b, 0) + cnt * dayW + totalW;
    out.push(`<w:p><w:pPr><w:keepNext/>${k > 0 ? '<w:pageBreakBefore/>' : ''}<w:spacing w:before="0" w:after="60" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr>${runs(`BẢNG ${k + 1}/${tables}: NGÀY ${from} ĐẾN NGÀY ${to}`, `<w:b/>${sz(20)}`)}</w:p>`);
    const H = 'D9E2F3';
    const r1 = `<w:tr><w:trPr><w:cantSplit/><w:tblHeader/><w:jc w:val="center"/></w:trPr>${head.map((h, i) => tc(fixed[i], p(h, { center: true, bold: true, size: 18 }), { fill: H, vmerge: 'restart' })).join('')}${tc(cnt * dayW, p(`Thời gian thực hiện theo ngày (ngày 1 là ${g.dayOne})`, { center: true, bold: true, size: 18 }), { fill: H, span: cnt })}${tc(totalW, p('Tổng số ngày thực hiện', { center: true, bold: true, size: 18 }), { fill: H, vmerge: 'restart' })}</w:tr>`;
    const r2 = `<w:tr><w:trPr><w:cantSplit/><w:tblHeader/><w:jc w:val="center"/></w:trPr>${head.map((h, i) => tc(fixed[i], p(''), { fill: H, vmerge: 'continue' })).join('')}${Array.from({ length: cnt }, (_, d) => tc(dayW, p(beyond(d) ? '' : String(from + d), { center: true, bold: true, size: 18 }), { fill: beyond(d) ? 'F2F2F2' : H })).join('')}${tc(totalW, p(''), { fill: H, vmerge: 'continue' })}</w:tr>`;
    const rows = g.rows.map((r) => {
      const level = r.group ?? 0;
      if (level === 1) {
        return `<w:tr><w:trPr><w:cantSplit/><w:jc w:val="center"/></w:trPr>${tc(fixed[0], p(r.no ?? '', { center: true, bold: true, color: 'FFFFFF' }), { fill: '2F5496' })}${tc(fixed[1] + fixed[2] + cnt * dayW + totalW, p(r.task, { bold: true, color: 'FFFFFF' }), { fill: '2F5496', span: 3 + cnt })}</w:tr>`;
      }
      if (level === 2) {
        return `<w:tr><w:trPr><w:cantSplit/><w:jc w:val="center"/></w:trPr>${tc(fixed[0], p(r.no ?? '', { center: true, bold: true }), { fill: H })}${tc(fixed[1] + fixed[2] + cnt * dayW + totalW, p(r.task, { bold: true }), { fill: H, span: 3 + cnt })}</w:tr>`;
      }
      const daysCells = Array.from({ length: cnt }, (_, d) => {
        const day = from + d;
        const on = day >= r.from && day <= r.to;
        // Kiểu clean: ô ngày tô xanh cùng tông bảng, không ghi số 1 trong ô; kiểu template giữ ô cam ghi 1 như hồ sơ mẫu.
        return tc(dayW, p(on && !CLEAN ? '1' : '', { center: true, size: 18 }), { fill: on ? r.color ?? (CLEAN ? '4472C4' : 'FF9900') : beyond(d) ? 'F2F2F2' : undefined });
      }).join('');
      return `<w:tr><w:trPr><w:cantSplit/><w:jc w:val="center"/></w:trPr>${tc(fixed[0], p(r.no ?? '', { center: true }))}${tc(fixed[1], p(r.task))}${tc(fixed[2], p(r.owner ?? ''))}${daysCells}${tc(totalW, p(r.from ? String(r.to - r.from + 1) : '', { center: true }))}</w:tr>`;
    }).join('');
    out.push(`<w:tbl><w:tblPr><w:tblW w:w="${width}" w:type="dxa"/><w:jc w:val="center"/>${border}<w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="57" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="57" w:type="dxa"/></w:tblCellMar><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid>${[...fixed, ...Array(cnt).fill(dayW), totalW].map((x) => `<w:gridCol w:w="${x}"/>`).join('')}</w:tblGrid>${r1}${r2}${rows}</w:tbl>`);
  }
  // Chữ sau bảng cuối (câu cam kết kết phần tiến độ) in ngay dưới bảng trên trang ngang, không sang trang dọc gần trắng.
  if (g.outro) out.push(blocks(g.outro, undefined, false));
  out.push(TINY);
  return out.join('');
}

// Bản cam kết, hình thức đo từ hồ sơ mẫu: đầu trang là bảng hai cột không viền (tên đơn vị 3700, quốc hiệu 5671), dưới
// mỗi bên một gạch ngắn; ngày tháng nghiêng; tên văn bản đậm có gạch dưới; thân chữ 14, giãn dòng 1,2, thụt 1 cm; khối ký
// căn giữa nửa phải.
function letter(l, atPageTop = false) {
  const base = '<w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/>';
  const lp = (t, { jc = 'both', bold = false, ital = false, size = 28, spacing = '<w:spacing w:after="120" w:line="288" w:lineRule="auto"/>', ind = '', keep = false } = {}) =>
    `<w:p><w:pPr>${S.letter ? `<w:pStyle w:val="${S.letter}"/>` : ''}${keep ? '<w:keepNext/>' : ''}${spacing}${ind}<w:jc w:val="${jc}"/></w:pPr>${runs(t, `${bold ? '<w:b/><w:bCs/>' : ''}${ital ? '<w:i/><w:iCs/>' : ''}<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>`)}</w:p>`;
  const rule = (ind) => `<w:p><w:pPr>${S.letter ? `<w:pStyle w:val="${S.letter}"/>` : ''}<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/></w:pBdr><w:spacing w:before="0" w:after="0" w:line="40" w:lineRule="exact"/><w:ind w:left="${ind}" w:right="${ind}"/></w:pPr></w:p>`;
  // Tên công ty in đậm cả mấy dòng; chỉ khi dòng đầu là cơ quan chủ quản (orgParent) thì dòng đó chữ thường như Nghị định 30.
  const org = (l.org ?? []).map((t, i) => lp(t, { jc: 'center', bold: !(l.orgParent && i === 0), size: 26, spacing: base })).join('');
  const nation = lp('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', { jc: 'center', bold: true, size: 26, spacing: base }) + lp('Độc lập - Tự do - Hạnh phúc', { jc: 'center', bold: true, size: 28, spacing: base });
  const noBorder = '<w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders>';
  const headTable = `<w:tbl><w:tblPr><w:tblW w:w="9371" w:type="dxa"/>${noBorder}<w:tblLayout w:type="fixed"/><w:tblCellMar><w:left w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid><w:gridCol w:w="3700"/><w:gridCol w:w="5671"/></w:tblGrid><w:tr><w:tc><w:tcPr><w:tcW w:w="3700" w:type="dxa"/></w:tcPr>${org}${rule(1150)}</w:tc><w:tc><w:tcPr><w:tcW w:w="5671" w:type="dxa"/></w:tcPr>${nation}${rule(1250)}</w:tc></w:tr></w:tbl>`;
  const out = [atPageTop ? '' : TINY_BREAK, headTable];
  out.push(lp(l.date ?? '', { jc: 'right', ital: true, spacing: '<w:spacing w:before="200" w:after="0" w:line="288" w:lineRule="auto"/>' }));
  out.push(lp(l.title ?? 'BẢN CAM KẾT', { jc: 'center', bold: true, spacing: '<w:spacing w:before="360" w:after="0" w:line="288" w:lineRule="auto"/>' }));
  if (l.subject) out.push(lp(l.subject, { jc: 'center', bold: true, spacing: '<w:spacing w:before="0" w:after="0" w:line="288" w:lineRule="auto"/>' }));
  out.push(rule(3200));
  if (l.to) out.push(lp(l.to, { bold: true, ind: '<w:ind w:left="567"/>', spacing: '<w:spacing w:before="240" w:after="120" w:line="288" w:lineRule="auto"/>' }));
  for (const t of l.info ?? []) out.push(lp(t, { ind: '<w:ind w:left="567"/>' }));
  for (const t of l.body ?? []) out.push(lp(t, { ind: '<w:ind w:firstLine="567"/>' }));
  const signW = 5440; // 58% bề ngang như khối ký của hồ sơ mẫu
  const sign = [
    lp(l.signTitle ?? 'ĐẠI DIỆN HỢP PHÁP CỦA NHÀ THẦU', { jc: 'center', bold: true, spacing: '<w:spacing w:before="120" w:after="0" w:line="288" w:lineRule="auto"/>', keep: true }),
    lp(l.signNote ?? '(Ký tên, đóng dấu)', { jc: 'center', ital: true, spacing: '<w:spacing w:before="0" w:after="1200" w:line="288" w:lineRule="auto"/>', keep: true }),
    lp(l.signer ?? '', { jc: 'center', bold: true, spacing: '<w:spacing w:before="0" w:after="0" w:line="288" w:lineRule="auto"/>' }),
  ].join('');
  out.push(`<w:tbl><w:tblPr><w:tblW w:w="9371" w:type="dxa"/>${noBorder}<w:tblLayout w:type="fixed"/><w:tblCellMar><w:left w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid><w:gridCol w:w="${9371 - signW}"/><w:gridCol w:w="${signW}"/></w:tblGrid><w:tr><w:trPr><w:cantSplit/></w:trPr><w:tc><w:tcPr><w:tcW w:w="${9371 - signW}" w:type="dxa"/></w:tcPr><w:p/></w:tc><w:tc><w:tcPr><w:tcW w:w="${signW}" w:type="dxa"/></w:tcPr>${sign}</w:tc></w:tr></w:tbl>`);
  // Không có đoạn trống sau khối ký: bản tiếp theo mở bằng đoạn ngắt trang, bản cuối được blocks() thêm một đoạn rất thấp.
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
  const outp = [`<w:p><w:pPr>${mergePpr(F.figure.ppr)}</w:pPr><w:r>${drawing}</w:r></w:p>`];
  if (f.caption) outp.push(para(f.caption, F.caption));
  return outp.join('');
}

// ---------- Trang bìa và mục lục ----------
// Mọi thứ đứng trước đề mục đầu tiên của khuôn là phần đầu (bìa, mục lục cùng các ngắt section của chúng). Giữ nguyên
// phần đầu, thay chữ các dòng bìa theo thứ tự bằng data.cover, dựng lại trường mục lục để Word cập nhật khi mở tệp.
const TOC_PLACEHOLDER = 'Mục lục chưa dựng: mở tệp bằng Word, chọn Yes khi Word hỏi cập nhật trường, hoặc bấm chuột phải vào đây và chọn Update Field.';
const tocField = (instr, f) => `<w:p>${f?.ppr ? `<w:pPr>${f.ppr}</w:pPr>` : ''}<w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r><w:r><w:instrText xml:space="preserve">${instr}</w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t xml:space="preserve">${TOC_PLACEHOLDER}</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>`;
let front = '';
const firstHead = out_.find((p) => [S.part, S.doc, S.h1].filter(Boolean).includes(p.style));
if (templatePath && firstHead) {
  front = oldBody.slice(0, firstHead.start);
  // Trường mục lục: từ đoạn chứa lệnh TOC tới đoạn chứa dấu kết thúc của đúng trường đó (trường PAGEREF lồng bên trong
  // có begin, end riêng nên phải đếm độ sâu).
  const instrAt = front.search(/<w:instrText\b[^>]*>\s*TOC\b/);
  let usedToc = false;
  if (instrAt >= 0) {
    const instr = front.slice(instrAt).match(/<w:instrText\b[^>]*>([^<]*)</)[1];
    const pStart = front.lastIndexOf('<w:p ', instrAt) >= front.lastIndexOf('<w:p>', instrAt) ? front.lastIndexOf('<w:p ', instrAt) : front.lastIndexOf('<w:p>', instrAt);
    const fld = /<w:fldChar\b[^>]*w:fldCharType="(begin|end)"/g;
    fld.lastIndex = instrAt;
    let depth = 1;
    let endAt = front.length;
    let m;
    while ((m = fld.exec(front))) {
      depth += m[1] === 'begin' ? 1 : -1;
      if (depth === 0) { endAt = m.index; break; }
    }
    const pEnd = front.indexOf('</w:p>', endAt) + 6;
    const removed = front.slice(pStart, pEnd);
    const sect = removed.match(/<w:sectPr\b[\s\S]*?<\/w:sectPr>/g)?.at(-1);
    const toc1 = paras.find((p) => /^TOC1$/i.test(p.style ?? ''));
    const f = toc1 ? { ppr: toc1.ppr } : undefined;
    front = front.slice(0, pStart) + (data.toc === false ? '' : tocField(instr, f)) + (sect ? `<w:p><w:pPr>${sect}</w:pPr></w:p>` : '') + front.slice(pEnd);
    usedToc = data.toc !== false;
  }
  // Các dòng bìa: đoạn có chữ trong phần đầu, trừ tiêu đề "MỤC LỤC" và đoạn mục lục.
  const slots = [];
  front = front.replace(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g, (p) => {
    if (p.includes(TOC_PLACEHOLDER)) return p;
    const t = decodeXml([...p.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g)].map((r) => r[1]).join('')).trim();
    if (!t || /^m[ụu]c l[ụu]c$/i.test(t)) return p;
    slots.push(t);
    const i = slots.length - 1;
    const open = p.match(/^<w:p(?:\s[^>]*)?>/)[0];
    const ppr = p.match(/<w:pPr>[\s\S]*?<\/w:pPr>/)?.[0] ?? '';
    const rpr = clean(p.match(/<w:r\b[^>]*>\s*<w:rPr>([\s\S]*?)<\/w:rPr>/)?.[1] ?? '');
    return `\u0000SLOT${i}\u0000${open}${ppr}\u0000RPR${esc(rpr)}\u0000</w:p>`;
  });
  const cover = data.cover?.map((c) => (typeof c === 'string' ? c : c.text));
  if (!cover || cover.length !== slots.length) {
    console.error(`Trang bìa của khuôn có ${slots.length} dòng chữ, JSON cần "cover" đủ ${slots.length} dòng theo đúng thứ tự:`);
    slots.forEach((s, i) => console.error(`  ${i + 1}. ${s}`));
    process.exit(1);
  }
  // Bìa của khuôn canh vị trí dòng cuối bằng khoảng cách phía trên (hồ sơ mẫu: 6000 twip). Chữ mới dài hơn chữ cũ bao nhiêu
  // dòng thì bớt khoảng cách đó bấy nhiêu dòng, để bìa không tràn sang trang hai. Ước lượng: 16 cm chữ chứa khoảng 906/cỡ
  // ký tự một dòng, một dòng cao khoảng 1,5 lần cỡ chữ.
  let extra = 0;
  const slotRpr = [];
  front.replace(/\u0000SLOT(\d+)\u0000([\s\S]*?)\u0000RPR([\s\S]*?)\u0000<\/w:p>/g, (_, i, head, rpr) => { slotRpr[Number(i)] = decodeXml(rpr); return ''; });
  slots.forEach((old, i) => {
    const pt = Number(slotRpr[i]?.match(/<w:sz w:val="(\d+)"/)?.[1] ?? 26) / 2;
    const per = 906 / pt;
    const lines = (s) => Math.max(1, Math.ceil(s.length / per));
    // Dòng nhà thầu bị coverRuns ngắt thành hai dòng cũng tính là dài thêm.
    const nNew = i === 0 && COVER_CLEAN && cover[0].length * pt * 0.72 * 20 > TEXT_W ? Math.max(2, lines(cover[i])) : lines(cover[i]);
    extra += Math.max(0, nNew - lines(old)) * pt * 1.5 * 20;
    // Dòng của khuôn chỉ một dòng (dòng nhà thầu) mà chữ mới xuống hai dòng: tên bị ngắt giữa chừng trên bìa.
    if (lines(old) === 1 && lines(cover[i]) > 1 && i === 0 && !COVER_CLEAN) warnings.push(`Dòng ${i + 1} của bìa "${cover[i].slice(0, 50)}" xuống hai dòng, khuôn chỉ một dòng; viết gọn (bỏ "NHÀ THẦU:", giữ tên công ty) cho vừa một dòng`);
  });
  const sizes = slotRpr.map((r) => Number(r?.match(/<w:sz w:val="(\d+)"/)?.[1] ?? 26));
  const titleAt = sizes.indexOf(Math.max(...sizes));
  front = front.replace(/\u0000SLOT(\d+)\u0000([\s\S]*?)\u0000RPR([\s\S]*?)\u0000<\/w:p>/g, (_, i, head, rpr) => {
    let h = head;
    let r = decodeXml(rpr);
    if (Number(i) === slots.length - 1 && extra > 0) {
      h = h.replace(/w:before="(\d+)"/, (m, v) => `w:before="${Math.max(0, Number(v) - Math.ceil(extra))}"`);
    }
    if (COVER_CLEAN) {
      // Dòng nhà thầu: thu cỡ chữ (không dưới 11) cho vừa một dòng thay vì ngắt giữa tên công ty.
      // Tên tài liệu (dòng chữ to nhất) cùng màu xanh đậm với khung bìa và tiêu đề bảng.
      if (Number(i) === titleAt) r = mergeRpr(r, `<w:color w:val="${COVER_COLOR}"/>`);
    }
    return `${h}${Number(i) === 0 ? coverRuns(cover[0], r, sizes[0] / 2, TEXT_W) : runs(cover[Number(i)], r)}</w:p>`;
  });
  if (!usedToc && data.toc) front += para(data.tocTitle ?? 'MỤC LỤC', F.tocTitle) + tocField(` TOC \\o "${typeof data.toc === 'string' ? data.toc : '1-3'}" \\h \\z \\u `);
  // Section đầu của khuôn (thường có "trang đầu khác" để bìa không in số trang) kết thúc ngay sau mục lục; phần nội dung
  // dùng section chính.
  const firstSect = sections[0];
  if (firstSect && !/<w:sectPr\b/.test(front)) front += `<w:p><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/>${firstSect}</w:pPr></w:p>`;
} else if (data.cover?.length || data.toc) {
  // Khuôn dựng sẵn: bìa theo bố cục của hồ sơ mẫu (dòng nhà thầu ở đầu, tên tài liệu giữa trang, nơi và năm ở cuối),
  // bìa là một section riêng có trang đầu khác nên không in số trang.
  const c = (data.cover ?? []).map((x) => (typeof x === 'string' ? { text: x } : x));
  // Khoảng cách theo hồ sơ mẫu: tên tài liệu cách trên khoảng 6,35 cm, dòng nơi và năm ở cuối trang (6000 twip); dòng nào dài
  // xuống thêm dòng thì bớt khoảng trống trước dòng cuối đúng phần đó để bìa vẫn vừa một trang.
  const gaps = [0, 3600, 0, 0, 0, 0];
  const sizeOf = (o, i) => o.size ?? ([14, 16][i] ?? 13);
  // Dòng nơi và năm đặt sát lề dưới như mẫu: khoảng trống trước nó = chiều cao vùng chữ trừ chiều cao các dòng trên (ước theo
  // số dòng Word xếp), trừ chính nó và đoạn ngắt section ngay sau, chừa 800 twip cho sai số ước lượng.
  const pageH = Number(MAIN.match(/<w:pgSz\b[^>]*w:h="(\d+)"/)?.[1] ?? 16838);
  const mar = (k, d) => Number(MAIN.match(new RegExp(`<w:pgMar\\b[^>]*w:${k}="(\\d+)"`))?.[1] ?? d);
  const textH = pageH - mar('top', 1134) - mar('bottom', 1134);
  const lineH = (o, i) => sizeOf(o, i) * 20 * 1.15;
  const nLines = (o, i) => {
    // Dòng nhà thầu quá dài bị coverRuns ngắt thành hai dòng.
    if (i === 0 && COVER_CLEAN && String(o.text).length * sizeOf(o, i) * 0.72 * 20 > TEXT_W) return 2;
    const per = Math.max(10, Math.floor(TEXT_W / (sizeOf(o, i) * 20 * 0.66)));
    return lines(String(o.text)).reduce((x, l) => x + Math.max(1, Math.ceil(l.length / per)), 0);
  };
  if (c.length && nLines(c[0], 0) > 1 && !COVER_CLEAN) warnings.push(`Dòng nhà thầu trên bìa "${String(c[0].text).slice(0, 50)}" xuống hai dòng; viết gọn (bỏ "NHÀ THẦU:", giữ tên công ty) hoặc ghi "size" nhỏ hơn cho vừa một dòng`);
  const used = c.slice(0, -1).reduce((a, o, i) => a + (gaps[i] ?? 0) + nLines(o, i) * lineH(o, i) + 120, 0);
  const lastH = c.length > 1 ? nLines(c.at(-1), c.length - 1) * lineH(c.at(-1), c.length - 1) + 120 : 0;
  const parts = c.map((o, i) => {
    const last = i === c.length - 1 && c.length > 1;
    const before = last ? Math.max(1200, Math.round(textH - used - lastH - 280 - 800)) : gaps[i] ?? 0;
    // Cỡ chữ bìa theo hồ sơ mẫu: dòng nhà thầu 14, tên tài liệu 16, các dòng sau 13.
    const size = sizeOf(o, i);
    const color = COVER_CLEAN && i === 1 ? `<w:color w:val="${COVER_COLOR}"/>` : '';
    const rpr = `${o.bold === false ? '' : '<w:b/><w:bCs/>'}${color}<w:sz w:val="${size * 2}"/><w:szCs w:val="${size * 2}"/>`;
    if (i === 0) return `<w:p><w:pPr><w:spacing w:before="${before}" w:after="120"/><w:jc w:val="center"/></w:pPr>${coverRuns(o.text, rpr, size, TEXT_W)}</w:p>`;
    return para(o.text, { ppr: `<w:spacing w:before="${before}" w:after="120"/><w:jc w:val="center"/>`, rpr });
  });
  if (parts.length) front += parts.join('') + `<w:p><w:pPr>${MAIN.replace('</w:sectPr>', '<w:titlePg/></w:sectPr>')}</w:pPr></w:p>`;
  if (data.toc) {
    // Hai cấp như hồ sơ mẫu: phần lớn (MucChinh) cấp 1, tài liệu con (MucTaiLieu) cấp 2. "toc": "1-3" thì lấy theo cấp đề mục.
    const instr = typeof data.toc === 'string' ? ` TOC \\o "${data.toc}" \\h \\z \\u ` : ' TOC \\h \\z \\t "MucChinh,1,MucTaiLieu,2" ';
    front += para(data.tocTitle ?? 'MỤC LỤC', F.tocTitle) + tocField(instr, { ppr: '<w:pStyle w:val="TOC1"/>' });
    front += sectBreak(MAIN);
  }
}

// ---------- Thân ----------
function blocks(list, prev = undefined, atTop = prev === undefined) {
  const body = [];
  const KEEP = '<w:keepNext/>';
  for (let i = 0; i < list.length; i++) {
    const b = list[i];
    const next = list[i + 1];
    const first = i === 0 && atTop;
    for (const k of ['part', 'doc', 'h1', 'h2', 'h3']) {
      if (b[k] !== undefined && CAPS[k] && isUpper(String(b[k]))) warnings.push(`${k} "${String(b[k]).slice(0, 50)}" gõ chữ hoa; khuôn tự in hoa loại đoạn này, viết chữ thường như mẫu để mục lục đúng kiểu`);
    }
    // Bảng đứng ngay sau đề mục: hồ sơ mẫu luôn mở bảng bằng một câu ("Nhà thầu đáp ứng các yêu cầu này như sau:").
    if (b.table && prev && ['part', 'doc', 'h1', 'h2', 'h3', 'label'].some((k) => prev[k] !== undefined)) {
      warnings.push(`Bảng "${(b.table.caption ?? (b.table.columns ?? []).join(' | ')).slice(0, 50)}" đứng ngay sau đề mục "${String(Object.values(prev)[0]).slice(0, 40)}", thiếu câu mở`);
    }
    // Khuôn hay đặt ngắt trang trước cả phần lớn (A, B…) lẫn tài liệu con (I, II…); tài liệu con đứng ngay sau phần lớn thì
    // nằm cùng trang với nó, như hồ sơ đã nộp vẫn làm. Khối đầu tiên đã nằm đầu trang (sau mục lục, đầu section ngang) nên
    // không ngắt trang thêm.
    const noBreak = first || (prev && prev.part !== undefined) ? '<w:pageBreakBefore w:val="0"/>' : '';
    if (b.part !== undefined) body.push(para(b.part, F.part, (first ? '<w:pageBreakBefore w:val="0"/>' : '') + KEEP));
    else if (b.doc !== undefined) body.push(para(b.doc, F.doc, noBreak + KEEP));
    else if (b.h1 !== undefined) body.push(para(b.h1, F.h1, KEEP));
    else if (b.h2 !== undefined) body.push(para(b.h2, F.h2, KEEP));
    else if (b.h3 !== undefined) body.push(para(b.h3, F.h3, KEEP));
    else if (b.label !== undefined) body.push(para(b.label, F.label, KEEP));
    else if (b.p !== undefined) {
      // Câu mở ngay trước bảng, hình ("Nhà thầu đáp ứng như sau:") giữ với hàng đầu của bảng; câu dẫn kết bằng ":" giữ với
      // danh sách hay đoạn theo sau, để không đứng một mình cuối trang.
      const ls = lines(b.p);
      const keepLast = next && (next.table || next.figure || /:\s*$/.test(ls[ls.length - 1] ?? ''));
      ls.forEach((l, j) => body.push(para(l, F.p, keepLast && j === ls.length - 1 ? KEEP : '')));
    }
    else if (b.bullets) {
      for (const item of b.bullets) {
        const level = Array.isArray(item) ? 1 : 0;
        for (const l of Array.isArray(item) ? item : [item]) {
          body.push(para(l, F.bullet, `<w:numPr><w:ilvl w:val="${level}"/><w:numId w:val="${bulletNum}"/></w:numPr>`));
        }
      }
    } else if (b.table) body.push(table(b.table));
    else if (b.figure) body.push(figure(b.figure));
    else if (b.gantt || b.landscape) {
      // Trang xoay ngang là một section riêng: đóng section dọc đang mở, viết nội dung, đóng section ngang.
      body.push(sectBreak(MAIN));
      const saved = TEXT_W;
      TEXT_W = textWidth(LANDSCAPE);
      body.push(b.gantt ? gantt(b.gantt) : blocks(b.landscape, undefined));
      TEXT_W = saved;
      body.push(sectBreak(LANDSCAPE));
    } else if (b.letter) {
      // Bản cam kết đầu tiên mở section cuối (không số trang): đóng section đang mở bằng section chính.
      if (!inTail && TAIL !== MAIN) { body.push(sectBreak(MAIN)); inTail = true; body.push(letter(b.letter, true)); } else body.push(letter(b.letter));
    }
    else if (b.pageBreak) body.push(TINY_BREAK);
    else throw new Error(`Khối không rõ loại: ${JSON.stringify(b).slice(0, 80)}`);
    prev = b;
  }
  if (list.length && list.at(-1).letter) body.push(TINY);
  return body.join('');
}
const content = blocks(data.blocks ?? []);

// Khung bìa: gắn vào section đầu (section của bìa), chỉ hiện ở trang đầu của section đó.
if (COVER_CLEAN && data.cover?.length) front = front.replace(/<w:sectPr\b[\s\S]*?<\/w:sectPr>/, (x) => addCoverBorder(x));
docXml = `${docXml.slice(0, bodyStart)}${front}${content}${inTail ? TAIL : MAIN}${docXml.slice(bodyEnd)}`;
if (!/xmlns:r=/.test(docXml.slice(0, 3000))) docXml = docXml.replace('<w:document ', '<w:document xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ');
zip.set('word/document.xml', docXml);

// ---------- Dọn phần của hồ sơ cũ ----------
// Bỏ ảnh, nhận xét, liên kết không còn dùng, chú thích cuối trang, thông tin người sửa. Giữ quan hệ mà thân mới hay phần
// đầu còn dùng (logo trên bìa, đầu trang, chân trang, kiểu, đánh số).
const relsName = 'word/_rels/document.xml.rels';
let rels = text(relsName);
for (const m of [...rels.matchAll(/<Relationship\b[^>]*\/>/g)]) {
  const id = m[0].match(/Id="([^"]+)"/)[1];
  const type = m[0].match(/Type="([^"]+)"/)[1];
  const target = m[0].match(/Target="([^"]+)"/)[1];
  const used = docXml.includes(`"${id}"`);
  if (used) continue;
  if (/TargetMode="External"/.test(m[0])) { rels = rels.replace(m[0], ''); continue; }
  if (/\/(image|comments|commentsExtended|commentsIds|commentsExtensible|people)$/.test(type)) {
    rels = rels.replace(m[0], '');
    const part = `word/${target.replace(/^\.?\//, '')}`;
    zip.delete(part);
    zip.delete(part.replace(/^word\/(.*)$/, 'word/_rels/$1.rels'));
    const ct = text('[Content_Types].xml');
    zip.set('[Content_Types].xml', ct.replace(new RegExp(`<Override PartName="/${part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*/>`), ''));
  }
}
zip.set(relsName, rels);
for (const part of ['word/footnotes.xml', 'word/endnotes.xml']) {
  const x = text(part);
  if (!x) continue;
  const tag = part.includes('foot') ? 'footnote' : 'endnote';
  zip.set(part, x.replace(new RegExp(`<w:${tag}\\b(?![^>]*w:type="(?:separator|continuationSeparator|continuationNotice)")[^>]*>[\\s\\S]*?</w:${tag}>`, 'g'), ''));
}
// Thuộc tính ứng dụng của hồ sơ mẫu (số trang, số chữ, phút sửa, công ty) không phải của bản dựng: xoá các số đếm để Word
// tự tính lại khi mở.
const app = text('docProps/app.xml');
if (app) {
  zip.set('docProps/app.xml', app
    .replace(/<(Pages|Words|Characters|CharactersWithSpaces|Lines|Paragraphs|TotalTime)>[^<]*<\/\1>/g, '<$1>0</$1>')
    .replace(/<(Company|Manager|HyperlinkBase)>[\s\S]*?<\/\1>/g, '<$1></$1>')
    .replace(/<Template>[^<]*<\/Template>/, '<Template>Normal.dotm</Template>'));
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
if (docXml.includes(TOC_PLACEHOLDER)) {
  const s = text('word/settings.xml');
  if (s && !s.includes('w:updateFields')) zip.set('word/settings.xml', s.replace(/(<w:settings\b[^>]*>)/, '$1<w:updateFields w:val="true"/>'));
}

if (TOC_CLEAN) {
  let st = text('word/styles.xml');
  const tw = textWidth(MAIN);
  const tocSt = (id, name, ppr, rpr) => `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="39"/><w:unhideWhenUsed/><w:pPr><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="${tw}"/></w:tabs>${ppr}<w:jc w:val="left"/></w:pPr><w:rPr>${rpr}</w:rPr></w:style>`;
  const put = (id, xml) => {
    const re = new RegExp(`<w:style\\b[^>]*w:styleId="${id}"[^>]*>[\\s\\S]*?</w:style>`);
    st = re.test(st) ? st.replace(re, () => xml) : st.replace('</w:styles>', () => `${xml}</w:styles>`);
  };
  // Mục cha: đậm, cách trên 6pt; mục con: thường, thụt một nấc, chữ thường kể cả khi khuôn đặt chữ hoa cho kiểu mục lục.
  put('TOC1', tocSt('TOC1', 'toc 1', '<w:spacing w:before="120" w:after="40" w:line="276" w:lineRule="auto"/><w:ind w:left="397" w:right="567" w:hanging="397"/>', '<w:b/><w:bCs/><w:caps w:val="0"/>'));
  put('TOC2', tocSt('TOC2', 'toc 2', '<w:spacing w:before="0" w:after="40" w:line="276" w:lineRule="auto"/><w:ind w:left="737" w:right="567" w:hanging="340"/>', '<w:b w:val="0"/><w:bCs w:val="0"/><w:caps w:val="0"/>'));
  // Tài liệu con in hoa trên trang bằng kiểu đoạn, như hình của mẫu.
  if (S.doc && docTypedCaps) {
    st = st.replace(new RegExp(`(<w:style\\b[^>]*w:styleId="${S.doc}"[^>]*>[\\s\\S]*?)(</w:style>)`), (m, a, b) => {
      if (/<w:caps\/>|<w:caps w:val="(?:1|true)"\/>/.test(a)) return m;
      return /<w:rPr>/.test(a) ? a.replace(/<w:rPr>/, '<w:rPr><w:caps/>') + b : `${a}<w:rPr><w:caps/></w:rPr>${b}`;
    });
  }
  zip.set('word/styles.xml', st);
}

fs.writeFileSync(output, writeZip(zip));
const learned = Object.entries(F).filter(([, f]) => f.ppr || f.rpr).length;
console.log(`Đã ghi ${output}: ${(data.blocks ?? []).length} khối, ${imageNo} ảnh, khuôn ${templatePath ? path.basename(templatePath) : 'dựng sẵn'}, ${learned} loại đoạn có định dạng riêng.`);
for (const w of warnings) console.log(`SỬA  ${w}`);
console.log(`${warnings.length} chỗ cần sửa trong content.json.`);
