#!/usr/bin/env node
// Đọc hình thức của một tệp Word ra số đo: section (khổ, lề, số trang), phông, định dạng thực tế của từng loại đoạn (đã gộp
// kiểu gốc, kiểu kế thừa và định dạng tay), bảng (loại, tỉ lệ cột, nền tiêu đề), ảnh, chú thích, dàn đề mục.
// Dùng để phân tích hồ sơ mẫu trước khi viết, và để so bản dựng với mẫu sau khi dựng.
//
//   node docx-profile.mjs <tệp.docx>                 in số đo
//   node docx-profile.mjs <tệp.docx> --json          in JSON
//   node docx-profile.mjs --compare <mẫu.docx> <bản dựng.docx>
//                                                     so từng thuộc tính của từng loại đoạn, section, bảng; in tỉ lệ khớp
import fs from 'node:fs';
import { readZip } from './lib/zip.mjs';
import { decodeXml } from './lib/doc-text.mjs';

const twCm = (v) => Math.round((Number(v) / 567) * 100) / 100;

function load(file) {
  const zip = readZip(fs.readFileSync(file));
  const text = (n) => zip.get(n)?.toString('utf8') ?? '';
  return { zip, doc: text('word/document.xml'), styles: text('word/styles.xml'), rels: text('word/_rels/document.xml.rels'), text };
}

// Thuộc tính đoạn và chữ cần so. Giá trị ở dạng đọc được (cỡ chữ theo pt, khoảng cách theo pt, lề theo cm).
function readProps(ppr = '', rpr = '') {
  const o = {};
  const g = (re, x) => x.match(re)?.[1];
  const jc = g(/<w:jc w:val="(\w+)"/, ppr);
  if (jc) o.align = jc === 'both' ? 'justify' : jc;
  const sp = ppr.match(/<w:spacing\b[^>]*\/>/)?.[0] ?? '';
  if (/w:before="/.test(sp)) o.before = Number(g(/w:before="(\d+)"/, sp)) / 20;
  if (/w:after="/.test(sp)) o.after = Number(g(/w:after="(\d+)"/, sp)) / 20;
  if (/w:line="/.test(sp)) {
    const rule = g(/w:lineRule="(\w+)"/, sp) ?? 'auto';
    const v = Number(g(/w:line="(\d+)"/, sp));
    o.line = rule === 'auto' ? `${Math.round((v / 240) * 100) / 100}x` : `${v / 20}pt ${rule}`;
  }
  const ind = ppr.match(/<w:ind\b[^>]*\/>/)?.[0] ?? '';
  if (/w:left="/.test(ind)) o.indLeft = twCm(g(/w:left="(-?\d+)"/, ind));
  if (/w:firstLine="/.test(ind)) o.firstLine = twCm(g(/w:firstLine="(\d+)"/, ind));
  if (/w:hanging="/.test(ind)) o.hanging = twCm(g(/w:hanging="(\d+)"/, ind));
  if (/<w:keepNext\/>|<w:keepNext w:val="(?:1|true)"\/>/.test(ppr)) o.keepNext = true;
  if (/<w:keepNext w:val="(?:0|false)"\/>/.test(ppr)) o.keepNext = false;
  if (/<w:pageBreakBefore\/>|<w:pageBreakBefore w:val="(?:1|true)"\/>/.test(ppr)) o.pageBreakBefore = true;
  if (/<w:pageBreakBefore w:val="(?:0|false)"\/>/.test(ppr)) o.pageBreakBefore = false;
  if (/<w:numPr>/.test(ppr)) o.list = true;
  const font = g(/<w:rFonts\b[^>]*w:ascii="([^"]+)"/, rpr);
  if (font) o.font = font;
  const sz = g(/<w:sz w:val="(\d+)"/, rpr);
  if (sz) o.size = Number(sz) / 2;
  for (const [k, tag] of [['bold', 'b'], ['italic', 'i'], ['caps', 'caps'], ['underline', 'u']]) {
    if (new RegExp(`<w:${tag}/>|<w:${tag} w:val="(?:1|true|single)"/>`).test(rpr)) o[k] = true;
    if (new RegExp(`<w:${tag} w:val="(?:0|false|none)"/>`).test(rpr)) o[k] = false;
  }
  const color = g(/<w:color w:val="([0-9A-Fa-f]{6}|auto)"/, rpr);
  if (color && color !== 'auto' && color !== '000000') o.color = color.toUpperCase();
  return o;
}

// Định dạng thực tế của một kiểu: docDefaults, rồi chuỗi basedOn từ gốc tới kiểu đó.
function styleResolver(stylesXml) {
  const defP = stylesXml.match(/<w:pPrDefault>[\s\S]*?<w:pPr>([\s\S]*?)<\/w:pPr>/)?.[1] ?? '';
  const defR = stylesXml.match(/<w:rPrDefault>[\s\S]*?<w:rPr>([\s\S]*?)<\/w:rPr>/)?.[1] ?? '';
  const map = new Map();
  let normal;
  for (const m of stylesXml.matchAll(/<w:style\b([^>]*)>([\s\S]*?)<\/w:style>/g)) {
    const id = m[1].match(/w:styleId="([^"]+)"/)?.[1];
    if (!id) continue;
    const type = m[1].match(/w:type="(\w+)"/)?.[1];
    if (type === 'paragraph' && /w:default="1"/.test(m[1])) normal = id;
    map.set(id, {
      type, name: m[2].match(/<w:name w:val="([^"]+)"/)?.[1] ?? id, basedOn: m[2].match(/<w:basedOn w:val="([^"]+)"/)?.[1],
      ppr: m[2].match(/<w:pPr>([\s\S]*?)<\/w:pPr>/)?.[1] ?? '', rpr: m[2].match(/<w:rPr>([\s\S]*?)<\/w:rPr>/)?.[1] ?? '',
    });
  }
  const resolve = (id, seen = new Set()) => {
    const st = map.get(id ?? normal);
    if (!st || seen.has(id)) return { ...readProps(defP, defR) };
    seen.add(id);
    const base = st.basedOn ? resolve(st.basedOn, seen) : readProps(defP, defR);
    return { ...base, ...readProps(st.ppr, st.rpr) };
  };
  return { resolve, name: (id) => map.get(id)?.name ?? id, normal };
}

function profile(file) {
  const { doc, styles, rels, text } = load(file);
  const R = styleResolver(styles);
  const body = doc.slice(doc.indexOf('<w:body>'));
  const footerHasPage = (rid) => {
    const t = rels.match(new RegExp(`<Relationship\\b[^>]*\\bId="${rid}"[^>]*/>`))?.[0]?.match(/Target="([^"]+)"/)?.[1];
    return t ? /PAGE/.test(text(`word/${t}`)) : false;
  };
  const sections = [...doc.matchAll(/<w:sectPr\b[\s\S]*?<\/w:sectPr>/g)].map((m) => {
    const s = m[0];
    const n = (re) => s.match(re)?.[1];
    return {
      orient: /w:orient="landscape"/.test(s) ? 'ngang' : 'dọc',
      margins: ['top', 'right', 'bottom', 'left'].map((k) => twCm(n(new RegExp(`<w:pgMar[^>]*w:${k}="(\\d+)"`)) ?? 0)),
      titlePg: /<w:titlePg\/>/.test(s),
      pageNumber: [...s.matchAll(/<w:footerReference w:type="default" r:id="([^"]+)"/g)].some((x) => footerHasPage(x[1])),
    };
  });

  // Đoạn: vai trò đoán theo kiểu và định dạng, như bid-docx.mjs.
  const paras = [];
  const re = /<w:tbl>|<\/w:tbl>|<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g;
  let depth = 0;
  const tstack = [];
  let m;
  while ((m = re.exec(body))) {
    if (m[0] === '<w:tbl>') {
      depth++;
      // Loại bảng: tiến độ theo ngày (từ 10 cột), không viền (đầu bản cam kết, khối ký), bảng thường.
      const head = body.slice(m.index, m.index + 4000);
      const cols = (head.match(/<w:tblGrid>[\s\S]*?<\/w:tblGrid>/)?.[0].match(/<w:gridCol\b/g) ?? []).length;
      const tblPr = head.match(/<w:tblPr>[\s\S]*?<\/w:tblPr>/)?.[0] ?? '';
      tstack.push(cols >= 10 ? 'gantt' : /w:val="single"/.test(tblPr) ? 'normal' : 'plain');
      continue;
    }
    if (m[0] === '</w:tbl>') { depth--; tstack.pop(); continue; }
    const x = m[0];
    const t = decodeXml([...x.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g)].map((r) => r[1]).join('')).trim();
    if (!t) continue;
    const ppr = (x.match(/<w:pPr>([\s\S]*?)<\/w:pPr>/)?.[1] ?? '').replace(/<w:rPr>[\s\S]*?<\/w:rPr>|<w:sectPr\b[\s\S]*?<\/w:sectPr>/g, '');
    // Định dạng chữ của đoạn: lấy theo lần chữ dài nhất, để nhãn đậm ở đầu đoạn không làm cả đoạn thành đậm.
    const runsIn = [...x.matchAll(/<w:r\b[^>]*>([\s\S]*?)<\/w:r>/g)].map((r) => ({
      rpr: r[1].match(/<w:rPr>([\s\S]*?)<\/w:rPr>/)?.[1] ?? '',
      len: [...r[1].matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g)].map((q) => q[1]).join('').length,
    }));
    const rpr = runsIn.sort((p, q) => q.len - p.len)[0]?.rpr ?? '';
    const sid = ppr.match(/<w:pStyle w:val="([^"]+)"/)?.[1];
    const name = sid ? R.name(sid).toLowerCase() : 'normal';
    const eff = { ...R.resolve(sid), ...readProps(ppr, rpr) };
    let role;
    const kind = tstack.at(-1);
    if (depth > 0 && kind === 'gantt') role = 'ô bảng tiến độ';
    else if (depth > 0 && kind === 'plain') role = 'bảng không viền';
    else if (name === 'ck05text') role = 'bản cam kết';
    else if (/^BẢNG \d+\/\d+/.test(t)) role = 'ô bảng tiến độ';
    else if (depth > 0) role = /header|heading/.test(name) ? 'ô tiêu đề bảng' : 'ô bảng';
    else if (/^toc/.test(name)) role = 'mục lục';
    else if (name === 'mucchinh') role = 'phần lớn (A, B…)';
    else if (name === 'muctailieu') role = 'tài liệu con (I, II…)';
    else if (name === 'heading 1') role = 'đề mục cấp 1';
    else if (name === 'heading 2') role = 'đề mục cấp 2';
    else if (name === 'heading 3') role = 'đề mục cấp 3';
    else if (name === 'caption') role = 'chú thích hình';
    else if (eff.list) role = 'gạch đầu dòng';
    else if (eff.bold && eff.keepNext && t.length < 160) role = 'nhãn đậm';
    else if (t.length > 60) role = 'đoạn văn';
    else role = 'đoạn ngắn khác';
    paras.push({ role, text: t, eff, style: sid ? R.name(sid) : 'Normal' });
  }
  const roles = {};
  for (const p of paras) {
    const r = (roles[p.role] ??= { count: 0, variants: new Map(), example: p.text.slice(0, 60) });
    r.count++;
    const k = JSON.stringify(p.eff);
    r.variants.set(k, (r.variants.get(k) ?? 0) + 1);
  }
  for (const r of Object.values(roles)) {
    const [k] = [...r.variants].sort((a, b) => b[1] - a[1])[0];
    r.props = JSON.parse(k);
    r.share = Math.round(([...r.variants].sort((a, b) => b[1] - a[1])[0][1] / r.count) * 100);
    delete r.variants;
  }

  const fonts = new Set([...(doc + styles).matchAll(/w:ascii="([^"]+)"/g)].map((x) => x[1]));
  const tables = [];
  for (const t of body.match(/<w:tbl>[\s\S]*?<\/w:tbl>/g) ?? []) {
    const grid = [...t.matchAll(/<w:gridCol w:w="(\d+)"/g)].map((x) => Number(x[1]));
    const total = grid.reduce((a, b) => a + b, 0) || 1;
    const first = t.match(/<w:tr\b[\s\S]*?<\/w:tr>/)?.[0] ?? '';
    const head = [...first.matchAll(/<w:tc>([\s\S]*?)<\/w:tc>/g)].map((c) => decodeXml([...c[1].matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g)].map((r) => r[1]).join('')).trim());
    tables.push({
      head: head.join(' | ').slice(0, 90), cols: grid.map((x) => Math.round((x / total) * 100)), widthCm: twCm(total),
      fill: first.match(/w:fill="([0-9A-Fa-f]{6})"/)?.[1]?.toUpperCase() ?? null, rows: (t.match(/<w:tr\b/g) ?? []).length,
      repeatHeader: /<w:tblHeader\/>/.test(first), borders: /<w:tblBorders>[\s\S]*?w:val="single"/.test(t),
    });
  }
  const images = [...doc.matchAll(/<wp:extent cx="(\d+)" cy="(\d+)"/g)].map((x) => [Math.round(Number(x[1]) / 36000) / 10, Math.round(Number(x[2]) / 36000) / 10]);
  const outline = paras.filter((p) => /phần lớn|tài liệu con|đề mục/.test(p.role)).map((p) => `${p.role.startsWith('phần') ? '' : p.role.startsWith('tài') ? '  ' : p.role.endsWith('1') ? '    ' : p.role.endsWith('2') ? '      ' : '        '}${p.text}`);
  const toc = /<w:instrText[^>]*>\s*TOC\b/.test(doc);
  return { file, sections, fonts: [...fonts], roles, tables, images, captions: paras.filter((p) => p.role === 'chú thích hình').map((p) => p.text), toc, outline };
}

function printProfile(p) {
  console.log(`# ${p.file}`);
  console.log(`\nSection (lề trên, phải, dưới, trái theo cm):`);
  p.sections.forEach((s, i) => console.log(`  ${i + 1}. ${s.orient}, lề ${s.margins.join(' / ')}${s.titlePg ? ', trang đầu khác' : ''}, ${s.pageNumber ? 'có số trang' : 'không số trang'}`));
  console.log(`\nPhông: ${p.fonts.join(', ')}; mục lục: ${p.toc ? 'có' : 'không'}`);
  console.log('\nLoại đoạn (định dạng thực tế hay gặp nhất, tỉ lệ đoạn theo đúng định dạng đó):');
  for (const [k, r] of Object.entries(p.roles)) console.log(`  ${k} (${r.count}, ${r.share}%): ${JSON.stringify(r.props)}  vd: ${r.example}`);
  const kinds = new Map();
  for (const t of p.tables) {
    const k = `${t.head} [${t.cols.join('/')}]`;
    kinds.set(k, { n: (kinds.get(k)?.n ?? 0) + 1, t });
  }
  console.log(`\nBảng (${p.tables.length}):`);
  for (const [k, { n, t }] of [...kinds].sort((a, b) => b[1].n - a[1].n)) console.log(`  ${n}x ${k} rộng ${t.widthCm} cm, nền tiêu đề ${t.fill ?? 'không'}, ${t.repeatHeader ? 'lặp tiêu đề' : ''}`);
  console.log(`\nẢnh (${p.images.length}, rộng x cao cm): ${p.images.map((x) => x.join('x')).join('; ')}`);
  console.log(`Chú thích: ${p.captions.join(' | ')}`);
  console.log('\nDàn đề mục:');
  for (const l of p.outline) console.log(`  ${l}`);
}

// So bản dựng với mẫu. Mỗi loại đoạn có mặt ở cả hai bên: so từng thuộc tính của định dạng hay gặp nhất. Thêm so section
// chính, phông, bảng thường (nền tiêu đề, lặp tiêu đề, viền, bề rộng). Kết quả là tỉ lệ thuộc tính khớp.
function compare(a, b) {
  const checks = [];
  const add = (what, ok, detail) => checks.push({ what, ok, detail });
  for (const [role, ra] of Object.entries(a.roles)) {
    if (['đoạn ngắn khác', 'mục lục', 'ô bảng tiến độ', 'bảng không viền'].includes(role)) continue;
    const rb = b.roles[role];
    // Hình và đề mục cấp 3 tuỳ nội dung: bản dựng không có hình thì không có chú thích hình, không phải lỗi hình thức.
    if (!rb && ['chú thích hình', 'đề mục cấp 3', 'nhãn đậm'].includes(role)) { console.log(`KHÔNG DÙNG  ${role}: bản dựng không có, không tính`); continue; }
    if (!rb) { add(`${role}: có trong bản dựng`, false, 'bản dựng không có loại đoạn này'); continue; }
    for (const k of new Set([...Object.keys(ra.props), ...Object.keys(rb.props)])) {
      // keepNext chỉ điều khiển ngắt trang, không nhìn thấy trên trang; bản dựng thêm nó cho đề mục, tiêu đề bảng.
      if (['list', 'keepNext'].includes(k)) continue;
      // Màu chữ tiêu đề bảng thuộc kiểu bảng clean, cố ý khác mẫu (xem bid-docx, tableStyle).
      if (role === 'ô tiêu đề bảng' && k === 'color') continue;
      // Tài liệu con: mẫu gõ sẵn chữ hoa, bản dựng in hoa bằng kiểu đoạn (mục lục clean); trên trang trông như nhau.
      if (role === 'tài liệu con (I, II…)' && k === 'caps') continue;
      // Bản cam kết: dòng thông tin thụt trái, dòng thân thụt dòng đầu; loại hay gặp nhất đổi theo số dòng mỗi loại.
      if (role === 'bản cam kết' && ['indLeft', 'firstLine'].includes(k)) continue;
      const va = ra.props[k];
      const vb = rb.props[k];
      add(`${role}: ${k}`, JSON.stringify(va ?? null) === JSON.stringify(vb ?? null), `mẫu ${JSON.stringify(va ?? null)}, bản dựng ${JSON.stringify(vb ?? null)}`);
    }
  }
  const main = (p) => p.sections.filter((s) => s.orient === 'dọc' && !s.titlePg && s.pageNumber)[0];
  const ma = main(a);
  const mb = main(b);
  add('section chính: lề', JSON.stringify(ma?.margins) === JSON.stringify(mb?.margins), `mẫu ${ma?.margins}, bản dựng ${mb?.margins}`);
  add('bìa không số trang', a.sections[0]?.titlePg === b.sections[0]?.titlePg, `mẫu ${a.sections[0]?.titlePg}, bản dựng ${b.sections[0]?.titlePg}`);
  add('có section xoay ngang', a.sections.some((s) => s.orient === 'ngang') === b.sections.some((s) => s.orient === 'ngang'), '');
  add('có mục lục', a.toc === b.toc, '');
  const extraFonts = b.fonts.filter((f) => !a.fonts.includes(f));
  add('không thêm phông lạ', extraFonts.length === 0, extraFonts.join(', '));
  const normal = (p) => p.tables.filter((t) => t.borders && t.fill && t.cols.length <= 8);
  const ta = normal(a)[0];
  for (const t of normal(b)) {
    // Màu nền tiêu đề không so: bid-docx mặc định dùng kiểu bảng "clean" (nền xanh nhạt), cố ý khác bảng nền xám của mẫu.
    add(`bảng "${t.head.slice(0, 40)}": tiêu đề có nền`, Boolean(t.fill), `bản dựng ${t.fill}`);
    add(`bảng "${t.head.slice(0, 40)}": lặp tiêu đề`, t.repeatHeader === ta?.repeatHeader, '');
    add(`bảng "${t.head.slice(0, 40)}": rộng`, Math.abs(t.widthCm - (ta?.widthCm ?? 0)) <= 0.3, `mẫu ${ta?.widthCm}, bản dựng ${t.widthCm}`);
  }
  const ok = checks.filter((c) => c.ok).length;
  for (const c of checks.filter((x) => !x.ok)) console.log(`LỆCH  ${c.what}: ${c.detail}`);
  console.log(`\nKhớp ${ok}/${checks.length} thuộc tính (${Math.round((ok / checks.length) * 1000) / 10}%).`);
}

const args = process.argv.slice(2);
if (args[0] === '--compare' && args.length === 3) compare(profile(args[1]), profile(args[2]));
else if (args.length >= 1 && !args[0].startsWith('--')) {
  const p = profile(args[0]);
  if (args.includes('--json')) console.log(JSON.stringify(p, null, 2)); else printProfile(p);
} else {
  console.log('Dùng: node docx-profile.mjs <tệp.docx> [--json] | --compare <mẫu.docx> <bản dựng.docx>');
  process.exit(1);
}
