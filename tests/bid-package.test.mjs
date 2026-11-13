// Test cho bộ tệp hồ sơ kỹ thuật: tô vàng PDF của hãng, soát nhiều tài liệu hãng có mã, khối ký liên danh, soát dẫn chéo
// giữa các tệp. Dữ liệu đều là dữ liệu giả, PDF dựng tay trong test. Bài cần pdftotext của Poppler thì bỏ qua khi máy không có.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmp, node } from './helpers.mjs';
import { readZip } from '../scripts/bid/lib/zip.mjs';

const hasPoppler = (() => {
  if (process.env.PDFTOTEXT) return true;
  return (process.env.PATH ?? '').split(path.delimiter).some((d) => ['pdftotext', 'pdftotext.exe'].some((n) => {
    const f = path.join(d, n);
    if (!fs.existsSync(f)) return false;
    const r = spawnSync(f, ['-v'], { encoding: 'utf8' });
    return /poppler/i.test(`${r.stdout}${r.stderr}`);
  }));
})();
const needPoppler = { skip: hasPoppler ? false : 'máy không có pdftotext của Poppler' };

// PDF một hay nhiều trang chữ Helvetica, mỗi phần tử của lines là một dòng. xrefStream: bảng tham chiếu dạng luồng như PDF 1.5+.
function makePdf(pages, { xrefStream = false } = {}) {
  const objs = [];
  const add = (s) => { objs.push(s); return objs.length; };
  const catalog = add(null); const pagesObj = add(null); const font = add('<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>');
  const kids = [];
  for (const lines of pages) {
    const content = `BT /F1 12 Tf 72 760 Td 16 TL ${lines.map((l) => `(${l}) Tj T*`).join(' ')} ET`;
    const c = add(`<</Length ${content.length}>>\nstream\n${content}\nendstream`);
    kids.push(add(`<</Type/Page/Parent ${pagesObj} 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 ${font} 0 R>>>>/Contents ${c} 0 R>>`));
  }
  objs[catalog - 1] = `<</Type/Catalog/Pages ${pagesObj} 0 R>>`;
  objs[pagesObj - 1] = `<</Type/Pages/Kids[${kids.map((k) => `${k} 0 R`).join(' ')}]/Count ${kids.length}>>`;
  let out = '%PDF-1.7\n';
  const offs = [];
  objs.forEach((s, i) => { offs.push(Buffer.byteLength(out, 'latin1')); out += `${i + 1} 0 obj\n${s}\nendobj\n`; });
  const xrefAt = Buffer.byteLength(out, 'latin1');
  if (!xrefStream) {
    out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f\r\n${offs.map((o) => `${String(o).padStart(10, '0')} 00000 n\r\n`).join('')}`;
    out += `trailer\n<</Size ${objs.length + 1}/Root ${catalog} 0 R>>\nstartxref\n${xrefAt}\n%%EOF\n`;
    return Buffer.from(out, 'latin1');
  }
  const n = objs.length + 1;
  const rec = Buffer.alloc((n + 1) * 7);
  rec[0] = 0; rec.writeUInt16BE(65535, 5);
  offs.forEach((o, i) => { rec[(i + 1) * 7] = 1; rec.writeUInt32BE(o, (i + 1) * 7 + 1); });
  rec[n * 7] = 1; rec.writeUInt32BE(xrefAt, n * 7 + 1);
  return Buffer.concat([Buffer.from(`${out}${n} 0 obj\n<</Type/XRef/Size ${n + 1}/W[1 4 2]/Root ${catalog} 0 R/Length ${rec.length}>>\nstream\n`, 'latin1'),
    rec, Buffer.from(`\nendstream\nendobj\nstartxref\n${xrefAt}\n%%EOF\n`, 'latin1')]);
}

const write = (dir, name, value) => {
  const p = path.join(dir, name);
  fs.writeFileSync(p, typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value));
  return p;
};
const PAGES = [['Product Guide'], ['Network port', 'One RJ45 Ethernet port, 10 GbE', 'Ten externally facing storage', 'flexbays without optical drive'], ['Memory 16 DIMMS']];

for (const xrefStream of [false, true]) {
  test(`pdf-highlight tô vàng đúng trang, chữ vắt hai dòng, giữ nguyên tệp gốc (bảng tham chiếu ${xrefStream ? 'dạng luồng' : 'dạng bảng'})`, needPoppler, () => {
    const dir = tmp();
    const src = write(dir, 'goc.pdf', makePdf(PAGES, { xrefStream }));
    const before = fs.readFileSync(src);
    const marks = write(dir, 'marks.json', [{ page: 2, text: 'One RJ45 Ethernet port, 10 GbE' }, { page: 2, text: 'storage flexbays without' }, { page: 3, text: '16 DIMMS' }]);
    const out = path.join(dir, 'to.pdf');
    const r = node('bid/pdf-highlight.mjs', [src, marks, out]);
    assert.equal(r.status, 0, r.out);
    assert.match(r.out, /Trang 2: tô 2\/2 chỗ/);
    assert.match(r.out, /tô vàng 3 chỗ trên 2 trang/);
    const after = fs.readFileSync(out);
    assert.ok(after.subarray(0, before.length).equals(before), 'phần đầu tệp ra là nguyên tệp gốc (cập nhật nối thêm)');
    assert.match(after.toString('latin1'), /\/Subtype\/Highlight\/Rect\[[\d. ]+\]\/QuadPoints\[(?:[\d.]+ ){15}[\d.]+\]/, 'chữ vắt hai dòng thành hai tứ giác');
    const list = node('bid/pdf-highlight.mjs', ['--list', out]);
    assert.match(list.out, /Trang 2: 2 chỗ tô vàng\nTrang 3: 1 chỗ tô vàng\nTổng: 3 chỗ tô vàng/);
    // Tô thêm lần nữa lên tệp đã tô: chú thích cũ còn nguyên.
    const again = node('bid/pdf-highlight.mjs', [out, write(dir, 'm2.json', [{ page: 1, text: 'Product Guide' }]), path.join(dir, 'to2.pdf')]);
    assert.equal(again.status, 0, again.out);
    assert.match(node('bid/pdf-highlight.mjs', ['--list', path.join(dir, 'to2.pdf')]).out, /Tổng: 4 chỗ tô vàng/);
  });
}

test('pdf-highlight báo LỖI và không ghi tệp khi chữ không có trên trang dẫn', needPoppler, () => {
  const dir = tmp();
  const src = write(dir, 'goc.pdf', makePdf(PAGES));
  const out = path.join(dir, 'to.pdf');
  const r = node('bid/pdf-highlight.mjs', [src, write(dir, 'm.json', [{ page: 3, text: 'One RJ45 Ethernet port' }, { page: 9, text: 'x' }]), out]);
  assert.equal(r.status, 1, r.out);
  assert.match(r.out, /LỖI Không thấy "One RJ45 Ethernet port" trên trang 3/);
  assert.match(r.out, /LỖI Trang 9 không có \(tệp có 3 trang\)/);
  assert.equal(fs.existsSync(out), false);
});

// Bảng đáp ứng giả dựng bằng bid-docx, để bid-check đọc đúng như tệp Word thật.
function draft(dir, rows, extra = []) {
  const json = write(dir, 'c.json', { title: 'Bảng đáp ứng', blocks: [
    { part: 'Bảng đáp ứng yêu cầu kỹ thuật hàng hóa' }, { p: 'Nhà thầu đáp ứng như sau:' },
    { table: { columns: ['STT', 'Yêu cầu kỹ thuật của E-HSMT', 'Đáp ứng kỹ thuật của E-HSDT', 'Tài liệu tham chiếu'], widths: [8, 30, 40, 22], rows } },
    ...extra] });
  const out = path.join(dir, 'KT-01 Bang dap ung.docx');
  const r = node('bid/bid-docx.mjs', [json, out]);
  assert.equal(r.status, 0, r.out);
  return out;
}

test('bid-check với tài liệu hãng có mã: chữ trích phải có trên trang dẫn, trang dẫn phải đã tô vàng, mã tài liệu không bị đọc là số đo', needPoppler, () => {
  const dir = tmp();
  const pdf = write(dir, 'KT-02A.pdf', makePdf(PAGES));
  const doc = draft(dir, [
    ['1.1', '- Mạng: tối thiểu 1 cổng 10GbE', '01 cổng 10 GbE; KT-02A ghi "One RJ45 Ethernet port, 10 GbE"', 'KT-02A, tr. 2'],
    ['1.2', '- Khe RAM: tối thiểu 8 khe', '16 khe; KT-02A ghi "32 DIMMS"', 'KT-02A, tr. 3'],
  ]);
  const marks = write(dir, 'marks.json', [{ page: 2, text: '10 GbE' }]);
  const r = node('bid/bid-check.mjs', [doc, '--catalog', `KT-02A=${pdf}`, '--highlight', `KT-02A=${marks}`]);
  assert.equal(r.status, 1, r.out);
  assert.match(r.out, /LỖI {2}Chữ "32 DIMMS" gán cho catalog không có trên trang KT-02A tr\. 3/);
  assert.match(r.out, /LỖI {2}Dẫn KT-02A trang 3 nhưng trang đó chưa tô vàng/);
  assert.doesNotMatch(r.out, /Dẫn KT-02A trang 2 nhưng trang đó chưa tô/);
  assert.doesNotMatch(r.out, /Số "02A"/, 'mã KT-02A không phải số kèm đơn vị A');
});

test('bid-check bắt ô đáp ứng chép lại câu yêu cầu và lời hứa xin xác nhận của hãng sau', () => {
  const dir = tmp();
  const doc = draft(dir, [
    ['1.13', '- Hỗ trợ quản trị, giám sát phần cứng từ xa', 'Hỗ trợ quản trị, giám sát phần cứng từ xa', 'Bản cam kết kỹ thuật'],
    ['1.18', '- Khả năng hoạt động: thiết kế vận hành liên tục 24/7', 'Có', 'Xác nhận của Nhà sản xuất khi Chủ đầu tư yêu cầu'],
    ['1.16', '- Tản nhiệt phù hợp CPU', 'Bo mạch có 06 đầu nối quạt hệ thống [chưa có chứng minh: vận hành liên tục]', 'Tài liệu hãng'],
  ]);
  const r = node('bid/bid-check.mjs', [doc]);
  assert.equal(r.status, 1, r.out);
  assert.equal((r.out.match(/Ô đáp ứng chép lại câu yêu cầu/g) ?? []).length, 2, r.out);
  assert.match(r.out, /LỖI {2}Lấy lời hứa xin xác nhận sau làm chứng minh/);
  assert.doesNotMatch(r.out, /chép lại câu yêu cầu[^\n]*06 đầu nối/, 'ô đã đánh dấu thì không bắt');
});

test('bid-docx dựng khối ký liên danh: một người ký nửa phải, nhiều thành viên mỗi người một cột', () => {
  const dir = tmp();
  const json = write(dir, 'c.json', { blocks: [
    { part: 'Bảng đáp ứng' }, { p: 'Nội dung.' },
    { sign: { signers: [{ title: 'ĐẠI DIỆN HỢP PHÁP CỦA\nTHÀNH VIÊN ĐỨNG ĐẦU LIÊN DANH', org: 'CÔNG TY GIẢ A', note: '(thay mặt liên danh)', name: 'Người Ký A' }] } },
    { letter: { org: ['LIÊN DANH GIẢ'], date: 'Hà Nội, ngày ... tháng ... năm 2026', subject: 'Về uy tín của nhà thầu', to: 'Kính gửi: Chủ đầu tư Giả',
      body: ['Mỗi thành viên cam kết.'], signers: [{ title: 'ĐẠI DIỆN HỢP PHÁP', org: 'CÔNG TY GIẢ A', name: 'Người Ký A' }, { title: 'ĐẠI DIỆN HỢP PHÁP', org: 'CÔNG TY GIẢ B', name: 'Người Ký B' }] } },
  ] });
  const out = path.join(dir, 'c.docx');
  const r = node('bid/bid-docx.mjs', [json, out]);
  assert.equal(r.status, 0, r.out);
  const doc = readZip(fs.readFileSync(out)).get('word/document.xml').toString('utf8');
  assert.match(doc, /<w:gridCol w:w="3931"\/><w:gridCol w:w="5440"\/>[\s\S]*?THÀNH VIÊN ĐỨNG ĐẦU LIÊN DANH[\s\S]*?CÔNG TY GIẢ A[\s\S]*?Người Ký A/, 'một người ký: nửa phải');
  assert.match(doc, /<w:gridCol w:w="4685"\/><w:gridCol w:w="4685"\/>[\s\S]*?CÔNG TY GIẢ A[\s\S]*?Người Ký A[\s\S]*?CÔNG TY GIẢ B[\s\S]*?Người Ký B/, 'hai thành viên: hai cột');
});

test('package-check bắt mã dẫn không có tệp, mục không có, mục lục KT-00 kê thiếu; bộ đúng thì sạch', () => {
  const dir = tmp();
  const build = (name, blocks) => {
    const j = write(dir, `${name}.json`, { blocks });
    const r = node('bid/bid-docx.mjs', [j, path.join(dir, `${name}.docx`)]);
    assert.equal(r.status, 0, r.out);
  };
  build('KT-00 Muc luc', [{ part: 'Mục lục hồ sơ kỹ thuật' }, { p: 'Gồm KT-01 và KT-04.' }]);
  build('KT-01 Bang dap ung', [{ part: 'Bảng đáp ứng' }, { p: 'Chức năng đăng nhập: KT-04, mục 3.1; tra cứu: KT-04, mục 3.9; hình: KT-07, tr. 2.' }]);
  build('KT-04 Tai lieu phan mem', [{ part: 'Tài liệu kỹ thuật' }, { h1: '3. Chức năng' }, { h2: '3.1. Đăng nhập' }, { p: 'Nội dung.' }]);
  build('KT-05 Thuyet minh', [{ part: 'Thuyết minh' }, { p: 'Xem KT-01.' }]);
  const r = node('bid/package-check.mjs', [dir]);
  assert.equal(r.status, 1, r.out);
  assert.match(r.out, /LỖI {2}KT-01 dẫn KT-04 mục 3\.9 nhưng KT-04 không có đề mục 3\.9/);
  assert.match(r.out, /LỖI {2}KT-01 dẫn KT-07 nhưng không có tệp nào mang mã đó/);
  assert.match(r.out, /LỖI {2}KT-00 không kê tài liệu KT-05/);
  assert.doesNotMatch(r.out, /mục 3\.1 nhưng/);

  build('KT-00 Muc luc', [{ part: 'Mục lục hồ sơ kỹ thuật' }, { p: 'Gồm KT-01, KT-04, KT-05.' }]);
  build('KT-01 Bang dap ung', [{ part: 'Bảng đáp ứng' }, { p: 'Chức năng đăng nhập: KT-04, mục 3.1.' }]);
  const ok = node('bid/package-check.mjs', [dir]);
  assert.equal(ok.status, 0, ok.out);
});

test('bid-docx: "cover": false không bìa, không mục lục; ***chữ*** đậm nghiêng', () => {
  const dir = tmp();
  const json = write(dir, 'c.json', { cover: false, toc: true, blocks: [{ part: 'Bảng đáp ứng' }, { p: '***Nhà thầu cam kết.***' }] });
  const out = path.join(dir, 'c.docx');
  const r = node('bid/bid-docx.mjs', [json, out]);
  assert.equal(r.status, 0, r.out);
  const doc = readZip(fs.readFileSync(out)).get('word/document.xml').toString('utf8');
  assert.doesNotMatch(doc, /instrText[^>]*>\s*TOC/);
  assert.match(doc, /<w:b\/><w:bCs\/><w:i\/><w:iCs\/>[\s\S]*?Nhà thầu cam kết\./);
});

test('bid-check: hàng tiêu đề cột không bị coi là ô chép yêu cầu; dẫn mục bằng mã tài liệu; bỏ qua cột bản gốc của bản dịch', () => {
  const dir = tmp();
  const tl = path.join(dir, 'KT-04.docx');
  assert.equal(node('bid/bid-docx.mjs', [write(dir, 't.json', { blocks: [{ part: 'Tài liệu' }, { h1: '3. Chức năng' }, { h2: '3.1. Đăng nhập' }, { p: 'x' }] }), tl]).status, 0);
  const json = write(dir, 'c.json', { blocks: [
    { part: 'Bảng' }, { p: 'Như sau:' },
    { table: { columns: ['STT', 'Yêu cầu chức năng của E-HSMT', 'Đáp ứng', 'Mục chi tiết'], widths: [8, 30, 40, 22], rows: [['1', 'Đăng nhập bằng tài khoản', 'Đăng nhập bằng tài khoản và mật khẩu, khóa phiên khi không thao tác', 'KT-04, mục 3.1; KT-04, mục 3.7']] } },
    { p: 'Bản dịch trang 6:' },
    { table: { columns: ['Bản gốc (tiếng Anh)', 'Bản dịch tiếng Việt'], widths: [50, 50], rows: [['Base clock 3.20 GHz, 1 port', 'Xung nhịp cơ bản 3,20 GHz, 01 cổng']] } },
  ] });
  const doc = path.join(dir, 'c.docx');
  assert.equal(node('bid/bid-docx.mjs', [json, doc]).status, 0);
  const r = node('bid/bid-check.mjs', [doc, '--tlkt', tl, '--tlkt-name', 'KT-04']);
  assert.doesNotMatch(r.out, /chép lại câu yêu cầu/, r.out);
  assert.match(r.out, /Mục dẫn sang KT-04: 2 chỗ/);
  assert.match(r.out, /LỖI {2}Dẫn tới mục 3\.7 của KT-04 nhưng tài liệu đó không có mục này/);
  assert.doesNotMatch(r.out, /3\.20 GHz|"1 port"/, 'cột bản gốc không bị soát như chữ của nhà thầu');
});

test('bid-check: chữ trích phải trùng chỗ tô vàng; dòng tốt hơn còn đánh dấu; bản dịch thiếu số của bản gốc', needPoppler, () => {
  const dir = tmp();
  const pdf = write(dir, 'KT-02A.pdf', makePdf(PAGES));
  const marks = write(dir, 'marks.json', [{ page: 2, text: 'Network port' }, { page: 3, text: '16 DIMMS' }]);
  const doc = draft(dir, [
    ['1.1', '- Mạng: tối thiểu 1 cổng 10GbE', '01 cổng 10 GbE; KT-02A ghi "One RJ45 Ethernet port, 10 GbE"', 'KT-02A, tr. 2'],
    ['1.2', '- Khe RAM: tối thiểu 8 khe', '16 khe (tốt hơn) [chưa có chứng minh: khe ECC]; KT-02A ghi "16 DIMMS"', 'KT-02A, tr. 3'],
    ['', 'Tiêu chí đáp ứng tương đương hoặc tốt hơn', 'Tốt hơn: dòng 1.2', ''],
  ], [{ p: 'Bản dịch:' }, { table: { columns: ['Bản gốc (tiếng Anh)', 'Bản dịch tiếng Việt'], widths: [50, 50], rows: [['Up to 12 TB (note 2)', 'Tối đa 12 TB']] } }]);
  const r = node('bid/bid-check.mjs', [doc, '--catalog', `KT-02A=${pdf}`, '--highlight', `KT-02A=${marks}`]);
  assert.match(r.out, /LỖI {2}Chữ trích "One RJ45 Ethernet port, 10 GbE" chưa có chỗ tô vàng/);
  assert.doesNotMatch(r.out, /Chữ trích "16 DIMMS" chưa có/);
  assert.match(r.out, /LỖI {2}Dòng 1\.2 vừa ghi "\(tốt hơn\)" vừa còn đánh dấu/);
  assert.match(r.out, /LỖI {2}Hàng "Tiêu chí đáp ứng tương đương hoặc tốt hơn" kê dòng 1\.2/);
  assert.match(r.out, /XEM {2}Bản dịch thiếu số 2 của bản gốc/);
});

test('bid-check: tô nhãn mà bỏ giá trị, giá trị ngoài ngoặc kép, chỗ tô thừa', needPoppler, () => {
  const dir = tmp();
  const pdf = write(dir, 'KT-02A.pdf', makePdf([['Spec'], ['Memory size', '16', 'Ports 2']]));
  const marks = write(dir, 'marks.json', [{ page: 2, text: 'Memory size' }, { page: 2, text: 'Ports 2' }]);
  const doc = draft(dir, [
    ['1.1', '- RAM: tối thiểu 8 GB', '16 GB; KT-02A ghi "Memory size 16"', 'KT-02A, tr. 2'],
    ['1.2', '- RAM: tối thiểu 8 GB', '16 GB; KT-02A ghi "Memory size" là 16', 'KT-02A, tr. 2'],
  ]);
  const r = node('bid/bid-check.mjs', [doc, '--catalog', `KT-02A=${pdf}`, '--highlight', `KT-02A=${marks}`]);
  assert.match(r.out, /LỖI {2}Chữ trích "Memory size 16" mới tô một phần .*con số 16 chưa tô/);
  assert.match(r.out, /LỖI {2}Giá trị "16" đứng ngoài ngoặc kép sau nhãn/);
  assert.match(r.out, /XEM {2}KT-02A có 1 chỗ tô không ứng với chữ trích nào trong bảng \(tr\. 2 "Ports 2"\)/);
});

test('bid-docx: dấu sao viết \* giữ nguyên, không thành chữ nghiêng', () => {
  const dir = tmp();
  const out = path.join(dir, 'c.docx');
  assert.equal(node('bid/bid-docx.mjs', [write(dir, 'c.json', { blocks: [{ part: 'Bản dịch' }, { p: String.raw`Pin 8.400 mAh\* và sạc 45 W\*\*` }] }), out]).status, 0);
  const doc = readZip(fs.readFileSync(out)).get('word/document.xml').toString('utf8');
  assert.match(doc, /Pin 8\.400 mAh\* và sạc 45 W\*\*/);
  assert.doesNotMatch(doc, /<w:i\/>/);
});

test('pdf-highlight: số ngắn khớp trọn từ, "after" tô lần xuất hiện sau chữ neo', needPoppler, () => {
  const dir = tmp();
  const src = write(dir, 'goc.pdf', makePdf([['Battery 128 mAh', 'RAM (GB)', '12', 'Storage (GB)', '128']]));
  const out = path.join(dir, 'to.pdf');
  const r = node('bid/pdf-highlight.mjs', [src, write(dir, 'm.json', [{ page: 1, text: '12', after: 'RAM (GB)' }, { page: 1, text: '128', after: 'Storage (GB)' }]), out]);
  assert.equal(r.status, 0, r.out);
  const pdf = fs.readFileSync(out, 'latin1');
  const ys = [...pdf.matchAll(/\/QuadPoints\[[\d.]+ ([\d.]+)/g)].map((m) => Number(m[1]));
  assert.equal(ys.length, 2);
  assert.ok(ys[0] < 760 - 16 && ys[1] < ys[0], 'không tô "12" ở dòng "Battery 128 mAh", không tô "128" đầu trang');
});

test('bid-check --ba: dấu đứng sau điều BA đã chốt, nhiều dấu trần trong ô bảng', () => {
  const dir = tmp();
  const ba = write(dir, 'ba.md', 'Giao thiết bị ngày 21 đến ngày 22. Đào tạo 02 lớp.');
  const json = write(dir, 'c.json', { blocks: [{ part: 'Tiến độ' }, { p: 'Lịch như sau:' },
    { table: { columns: ['STT', 'Việc', 'Ngày', 'Ghi chú'], widths: [8, 40, 30, 22], rows: [
      ['1', 'Giao thiết bị', 'ngày 22 [cần xác nhận]', 'x'], ['2', 'Lắp đặt', 'ngày 23 [cần xác nhận]', 'x'], ['3', 'Cài đặt', 'ngày 25 [cần xác nhận]', 'x']] } }] });
  const doc = path.join(dir, 'c.docx');
  assert.equal(node('bid/bid-docx.mjs', [json, doc]).status, 0);
  const r = node('bid/bid-check.mjs', [doc, '--ba', ba]);
  assert.match(r.out, /XEM {2}Dấu "\[cần xác nhận\]" đứng ngay sau "ngày 22" mà tệp trả lời của BA đã chốt/);
  assert.doesNotMatch(r.out, /sau "ngày 23"/);
  assert.match(r.out, /XEM {2}3 dấu trần "\[cần xác nhận\]" trong ô bảng/);
});

test('package-check: số trang ở KT-00 khớp PDF, link trong sources.md phải có trong bộ tệp', needPoppler, () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'KT-02A Hãng.pdf'), makePdf(PAGES));
  const j = write(dir, 'k0.json', { blocks: [{ part: 'Mục lục' }, { p: 'Danh mục:' },
    { table: { columns: ['Mã', 'Tài liệu', 'Số trang'], widths: [15, 65, 20], rows: [['KT-02A', 'Tài liệu hãng, https://example.com/a.pdf', '5']] } }] });
  assert.equal(node('bid/bid-docx.mjs', [j, path.join(dir, 'KT-00 Mục lục.docx')]).status, 0);
  const src = write(dir, 'sources.md', '| Ngày | Đường dẫn | Tệp |\n|---|---|---|\n| 12/11/2026 | https://example.com/a.pdf | KT-02A.pdf |\n| 12/11/2026 | https://example.com/b.pdf | KT-03A.pdf |\n');
  const r = node('bid/package-check.mjs', [dir, '--sources', src]);
  assert.equal(r.status, 1, r.out);
  assert.match(r.out, /LỖI {2}KT-00 ghi KT-02A có 5 trang nhưng PDF có 3 trang/);
  assert.match(r.out, /LỖI {2}Tài liệu KT-03A tải từ https:\/\/example\.com\/b\.pdf/);
  assert.doesNotMatch(r.out, /a\.pdf\.\.\. nhưng/);
});

test('bid-check: ô dẫn nhiều trang kèm bảng, chữ trích "12 tháng" của hãng, dấu ghi rõ chờ việc khác', needPoppler, () => {
  const dir = tmp();
  const pdf = write(dir, 'KT-02A.pdf', makePdf(PAGES));
  const ba = write(dir, 'ba.md', 'Bảo hành 36 tháng, thư xác nhận của hãng chưa về.');
  const doc = draft(dir, [
    ['1.1', '- Mạng: tối thiểu 1 cổng 10GbE', '01 cổng 10 GbE; KT-02A ghi "One RJ45 Ethernet port, 10 GbE" và "16 DIMMS"', 'KT-02A, tr. 3 (bảng 1); tr. 2 (bảng 4)'],
    ['1.2', '- Bảo hành theo hãng', 'Bảo hành 12 (mười hai) tháng; chính sách ghi "12 tháng"', 'Chính sách bảo hành'],
    ['1.3', '- Bảo hành máy chủ', 'Bảo hành 36 (ba mươi sáu) tháng [cần xác nhận: thư xác nhận gói của hãng]', 'Thư hãng'],
  ]);
  const r = node('bid/bid-check.mjs', [doc, '--catalog', `KT-02A=${pdf}`, '--ba', ba]);
  assert.doesNotMatch(r.out, /không có trên trang/, r.out);
  assert.doesNotMatch(r.out, /"12 tháng" có chỗ kèm chữ/, r.out);
  assert.doesNotMatch(r.out, /đứng ngay sau "36 tháng"/, r.out);
});

test('package-check --sources: dòng "không dùng" của lần in bị thay không bị đòi link', needPoppler, () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'KT-02A Hãng.pdf'), makePdf(PAGES));
  const j = write(dir, 'k0.json', { blocks: [{ part: 'Mục lục' }, { p: 'Danh mục:' },
    { table: { columns: ['Mã', 'Tài liệu', 'Số trang'], widths: [15, 65, 20], rows: [['KT-02A', 'Tài liệu hãng, https://example.com/a.pdf', '3']] } }] });
  assert.equal(node('bid/bid-docx.mjs', [j, path.join(dir, 'KT-00 Mục lục.docx')]).status, 0);
  const src = write(dir, 'sources.md', '| Ngày | Đường dẫn | Tệp | Cách lấy |\n|---|---|---|---|\n| 12/11/2026 | https://example.com/a.pdf | KT-02A.pdf | tệp PDF |\n| 12/11/2026 | https://example.com/old | KT-02A-cu.pdf | không dùng: in lại không ảnh |\n');
  const r = node('bid/package-check.mjs', [dir, '--sources', src]);
  assert.equal(r.status, 0, r.out);
});

test('package-check: trang tài liệu hãng thuyết minh dẫn phải được dịch và tô; tài liệu hãng có giá bán', needPoppler, () => {
  const dir = tmp();
  const src = write(dir, 'goc.pdf', makePdf([...PAGES, ['Price $1,299.00']]));
  assert.equal(node('bid/pdf-highlight.mjs', [src, write(dir, 'm.json', [{ page: 2, text: 'Network port' }]), path.join(dir, 'KT-02A Hãng.pdf')]).status, 0);
  const build = (name, blocks) => assert.equal(node('bid/bid-docx.mjs', [write(dir, `${name}.json`, { blocks }), path.join(dir, `${name}.docx`)]).status, 0);
  build('KT-00 Mục lục', [{ part: 'Mục lục' }, { p: 'Gồm KT-02, KT-02A, KT-05.' }]);
  build('KT-02 Bản dịch', [{ part: 'Bản dịch' }, { h1: 'KT-02A: Hãng, hướng dẫn' }, { h2: 'Trang 2: Cổng mạng' }, { p: 'x' }]);
  build('KT-05 Thuyết minh', [{ part: 'Thuyết minh' }, { p: 'Cổng mạng: KT-02A, tr. 2. Bộ nhớ: KT-02A, tr. 3.' }]);
  const r = node('bid/package-check.mjs', [dir]);
  assert.equal(r.status, 1, r.out);
  assert.match(r.out, /LỖI {2}KT-05 dẫn KT-02A tr\. 3 nhưng bản dịch không có trang đó/);
  assert.match(r.out, /LỖI {2}KT-05 dẫn KT-02A tr\. 3 nhưng trang đó chưa tô vàng/);
  assert.doesNotMatch(r.out, /tr\. 2 nhưng/);
  assert.match(r.out, /XEM {2}KT-02A có giá bán \(tr\. 4 "\$1,299\.00"\)/);
});

test('bid-check: một dấu có nội dung lặp ở nhiều ô bảng', () => {
  const dir = tmp();
  const json = write(dir, 'c.json', { blocks: [{ part: 'Tiến độ' }, { p: 'Lịch như sau:' },
    { table: { columns: ['STT', 'Việc', 'Ngày'], widths: [10, 50, 40], rows: [
      ['1', 'Lắp đặt', 'Ngày 23 [cần xác nhận: lịch]'], ['2', 'Cài đặt', 'Ngày 25 [cần xác nhận: lịch]'], ['3', 'Đào tạo', 'Ngày 30 [cần xác nhận: lịch]']] } }] });
  const doc = path.join(dir, 'c.docx');
  assert.equal(node('bid/bid-docx.mjs', [json, doc]).status, 0);
  assert.match(node('bid/bid-check.mjs', [doc]).out, /XEM {2}Dấu "\[cần xác nhận: lịch\]" lặp ở 3 ô bảng/);
});

test('bid-check: "1, 2 ngày 21" không phải thời hạn; dấu điền Mẫu 10A ở từng ô; chỗ tô ở trang chỉ tệp khác dẫn', needPoppler, () => {
  const dir = tmp();
  const pdf = write(dir, 'KT-02A.pdf', makePdf(PAGES));
  const marks = write(dir, 'marks.json', [{ page: 2, text: '10 GbE' }, { page: 3, text: '16 DIMMS' }]);
  const doc = draft(dir, [
    ['1.1', '- Mạng: tối thiểu 1 cổng 10GbE', '01 cổng 10 GbE; KT-02A ghi "10 GbE"', 'KT-02A, tr. 2'],
    ['1.2', 'Giao hạng mục 1, 2 ngày 21', 'Ngày 21 [cần xác nhận: điền Mẫu 10A]', 'x'],
    ['1.3', 'Lắp đặt', 'Ngày 23 [cần xác nhận: điền Mẫu 10A]', 'x'],
    ['1.4', 'Cài đặt', 'Ngày 25 [cần xác nhận: điền Mẫu 10A]', 'x'],
  ]);
  const r = node('bid/bid-check.mjs', [doc, '--catalog', `KT-02A=${pdf}`, '--highlight', `KT-02A=${marks}`]);
  assert.doesNotMatch(r.out, /"2 ngày"/, r.out);
  assert.doesNotMatch(r.out, /lặp ở/, r.out);
  assert.doesNotMatch(r.out, /chỗ tô không ứng/, r.out);
});

test('pdf-highlight "near": tô giá trị cùng hàng với nhãn ở bảng nhãn trái; chữ nhiều lần không chỉ lần nào thì XEM', needPoppler, () => {
  const dir = tmp();
  const src = write(dir, 'goc.pdf', makePdf([['FAN SYS2 System fan', 'FAN SYS1 System fan', 'CPU Socket']]));
  const out = path.join(dir, 'to.pdf');
  const r = node('bid/pdf-highlight.mjs', [src, write(dir, 'm.json', [{ page: 1, text: 'System fan', near: 'FAN SYS1' }]), out]);
  assert.equal(r.status, 0, r.out);
  const ys = [...fs.readFileSync(out, 'latin1').matchAll(/\/QuadPoints\[[\d.]+ ([\d.]+)/g)].map((m) => Number(m[1]));
  assert.equal(ys.length, 1);
  assert.ok(ys[0] < 760, 'tô hàng thứ hai (FAN SYS1), không tô hàng đầu (đáy hàng đầu ở 760)');
  const w = node('bid/pdf-highlight.mjs', [src, write(dir, 'm2.json', [{ page: 1, text: 'System fan' }]), path.join(dir, 'to2.pdf')]);
  assert.match(w.out, /XEM "System fan" có 2 lần trên trang 1/);
});

test('bid-check dò từ khóa hai thứ tiếng cho hàng còn dấu; package-check bắt link tự ghép đổi mã vùng', needPoppler, () => {
  const dir = tmp();
  const pdf = write(dir, 'KT-03A.pdf', makePdf([['Spec'], ['Body: Armor Aluminum frame']]));
  const doc = draft(dir, [['2.16', '- Vỏ máy bằng kim loại', 'Có [chưa có chứng minh: thân máy bằng nhôm]', 'KT-03A, tr. 1']]);
  assert.match(node('bid/bid-check.mjs', [doc, '--catalog', `KT-03A=${pdf}`]).out, /XEM {2}Dấu "\[chưa có chứng minh: thân máy bằng nhôm\]" nhưng KT-03A tr\. 2 có "aluminum"/);
  fs.writeFileSync(path.join(dir, 'KT-03A Hãng.pdf'), makePdf(PAGES));
  const src = write(dir, 'sources.md', '| Ngày | Đường dẫn | Tệp | Cách lấy |\n|---|---|---|---|\n| 1 | https://example.com/asset/en-us/x/spec.pdf | (không lưu) | LỖI mã 404 |\n| 1 | https://example.com/asset/de-de/x/spec.pdf | (không lưu) | LỖI mã 404 |\n');
  assert.match(node('bid/package-check.mjs', [dir, '--sources', src]).out, /LỖI {2}2 lần tải hỏng chỉ khác mã vùng/);
  // Có mục "Lần tìm": link hỏng có thể do kết quả tìm kiếm trả về, chỉ XEM. Đã tải được tài liệu cùng tên miền: không báo.
  const fails = '| 1 | https://example.com/asset/en-us/x/spec.pdf | (không lưu) | LỖI mã 404 |\n| 1 | https://example.com/asset/de-de/x/spec.pdf | (không lưu) | LỖI mã 404 |\n';
  const head = '| Ngày | Đường dẫn | Tệp | Cách lấy |\n|---|---|---|---|\n';
  const src2 = write(dir, 'sources2.md', `${head}${fails}\n## Lần tìm\n\n| Ngày | Câu tìm | Link |\n|---|---|---|\n| 1 | X spec sheet | chỉ có link /asset/ |\n`);
  const o2 = node('bid/package-check.mjs', [dir, '--sources', src2]).out;
  assert.match(o2, /XEM {2}2 lần tải hỏng chỉ khác mã vùng/);
  assert.doesNotMatch(o2, /LỖI {2}2 lần tải hỏng/);
  const src3 = write(dir, 'sources3.md', `${head}${fails}| 1 | https://www.example.com/assetlink/doc/spec.pdf | KT-03A-goc.pdf | tệp PDF của hãng |\n`);
  assert.doesNotMatch(node('bid/package-check.mjs', [dir, '--sources', src3]).out, /khác mã vùng/);
});

test('bid-check hiểu đơn vị nằm ở nhãn ("Bộ nhớ đệm (GB)" rồi "12")', needPoppler, () => {
  const dir = tmp();
  const pdf = write(dir, 'KT-03A.pdf', makePdf([['Memory (GB) 12', 'Storage (GB) 128']]));
  const ok = draft(dir, [['2.3', '- RAM >= 12 GB', 'RAM 12 GB', 'KT-03A, tr. 1']]);
  assert.doesNotMatch(node('bid/bid-check.mjs', [ok, '--catalog', `KT-03A=${pdf}`]).out, /Số "12 GB" không có/);
  const bad = draft(dir, [['2.3', '- RAM >= 16 GB', 'RAM 16 GB', 'KT-03A, tr. 1']]);
  assert.match(node('bid/bid-check.mjs', [bad, '--catalog', `KT-03A=${pdf}`]).out, /Số "16 GB" không có trên trang catalog/);
});

test('pdf-highlight: "near" chọn lần cùng dòng chữ neo kể cả bên trái (nhãn); chữ trùng màu nền thì LỖI', needPoppler, () => {
  const dir = tmp();
  const src = write(dir, 'goc.pdf', makePdf([['Chipset', 'Chipset Intel W790', 'TPM on chipset']]));
  const out = path.join(dir, 'to.pdf');
  const r = node('bid/pdf-highlight.mjs', [src, write(dir, 'm.json', [{ page: 1, text: 'Chipset', near: 'Intel W790' }]), out]);
  assert.equal(r.status, 0, r.out);
  const ys = [...fs.readFileSync(out, 'latin1').matchAll(/\/QuadPoints\[[\d.]+ ([\d.]+)/g)].map((m) => Number(m[1]));
  assert.equal(ys.length, 1);
  assert.ok(ys[0] > 745 && ys[0] < 762, `tô dòng thứ hai (nhãn ô bảng), không tô tiêu đề hay dòng TPM: ${ys[0]}`);
  // "1 g" đổi màu tô chữ sang trắng: chữ vẫn có trong lớp chữ nhưng không hiện trên trang.
  const white = write(dir, 'white.pdf', makePdf([['Visible title', 'Spec) Tj T* 1 g (White title']]));
  const w = node('bid/pdf-highlight.mjs', [white, write(dir, 'w.json', [{ page: 1, text: 'White title' }]), path.join(dir, 'w.pdf')]);
  assert.match(w.out, /LỖI "White title" trên trang 1 không hiện trên bản in/);
  const v = node('bid/pdf-highlight.mjs', [white, write(dir, 'v.json', [{ page: 1, text: 'Visible title' }]), path.join(dir, 'v.pdf')]);
  assert.equal(v.status, 0, v.out);
});

test('bid-check: trang dẫn mà không chữ trích nào của tài liệu đó nằm trên trang thì XEM', needPoppler, () => {
  const dir = tmp();
  const pdf = write(dir, 'KT-02A.pdf', makePdf(PAGES));
  const marks = write(dir, 'marks.json', [{ page: 2, text: 'One RJ45 Ethernet port, 10 GbE' }, { page: 3, text: '16 DIMMS' }]);
  const doc = draft(dir, [['1.1', '- Mạng: tối thiểu 1 cổng 10GbE', '01 cổng 10 GbE. KT-02A ghi "One RJ45 Ethernet port, 10 GbE"', 'KT-02A, tr. 2, 3']]);
  const out = node('bid/bid-check.mjs', [doc, '--catalog', `KT-02A=${pdf}`, '--highlight', `KT-02A=${marks}`]).out;
  assert.match(out, /XEM {2}Dẫn KT-02A tr\. 3 nhưng không chữ trích nào của KT-02A trong hàng 1\.1/);
  assert.doesNotMatch(out, /Dẫn KT-02A tr\. 2 nhưng không chữ trích/);
});

test('page-refs: bid-check và package-check đọc chỗ dẫn trang như nhau', async () => {
  const { pagesAfter } = await import('../scripts/bid/lib/page-refs.mjs');
  assert.deepEqual(pagesAfter(', tr. 19 (bảng 9, bảng 10); tr. 30 (bảng 25)').pages, [19, 30]);
  assert.deepEqual(pagesAfter(', tr. 19, bảng 9, 10').pages, [19], 'số sau "bảng" là số bảng');
  assert.deepEqual(pagesAfter(', tr. 6, 14 và 27').pages, [6, 14, 27]);
  assert.deepEqual(pagesAfter(', tr. 30-31)').pages, [30, 31]);
  assert.equal(pagesAfter(', trang 1.500 W'), null);
});

test('bid-check: chữ trích cắt giữa ô thì XEM; "Bảng 5 bộ" không phải số đếm', needPoppler, () => {
  const dir = tmp();
  const pdf = write(dir, 'KT-02D.pdf', makePdf([['Intel Ethernet Network Adapter X710-T2L']]));
  const marks = write(dir, 'marks.json', [{ page: 1, text: 'Intel Ethernet Network Adapter X710-T2L' }]);
  const cut = draft(dir, [['1.9', '- Card mạng 10GbE', 'Card X710-T2L. KT-02D ghi "Adapter X710-T2L"', 'KT-02D, tr. 1']], [{ p: 'Xem Bảng 5 bộ xử lý.' }]);
  const out = node('bid/bid-check.mjs', [cut, '--catalog', `KT-02D=${pdf}`, '--highlight', `KT-02D=${marks}`]).out;
  assert.match(out, /XEM {2}Chữ trích "adapter x710-t2l" bắt đầu giữa ô "intel ethernet network adapter x710-t2l"/, out);
  assert.doesNotMatch(out, /Số đếm "5 bộ"/);
  const whole = draft(dir, [['1.9', '- Card mạng 10GbE', 'Card X710-T2L. KT-02D ghi "Intel Ethernet Network Adapter X710-T2L"', 'KT-02D, tr. 1']]);
  assert.doesNotMatch(node('bid/bid-check.mjs', [whole, '--catalog', `KT-02D=${pdf}`, '--highlight', `KT-02D=${marks}`]).out, /giữa ô/);
});

test('bid-check: đoạn thuyết minh dẫn trang mà chưa tô chữ được dẫn; --also tính chỗ dẫn của tệp khác là chỗ dùng chỗ tô', needPoppler, () => {
  const dir = tmp();
  const pdf = write(dir, 'KT-03B.pdf', makePdf([['Durability', 'IP68 rating', 'Armor Aluminum frame']]));
  const marks = write(dir, 'marks.json', [{ page: 1, text: 'Armor Aluminum frame' }, { page: 1, text: 'IP68 rating' }]);
  const tm = path.join(dir, 'KT-05 Thuyet minh.docx');
  assert.equal(node('bid/bid-docx.mjs', [write(dir, 't.json', { blocks: [{ part: 'Thuyết minh' }, { p: 'Máy đạt chuẩn kháng nước IP68 (KT-03B, tr. 1).' }] }), tm]).status, 0);
  const one = write(dir, 'one.json', [{ page: 1, text: 'Armor Aluminum frame' }]);
  assert.match(node('bid/bid-check.mjs', [tm, '--catalog', `KT-03B=${pdf}`, '--highlight', `KT-03B=${one}`]).out, /XEM {2}Đoạn dẫn KT-03B tr\. 1 cho "IP68" nhưng trang đó chưa tô/);
  assert.doesNotMatch(node('bid/bid-check.mjs', [tm, '--catalog', `KT-03B=${pdf}`, '--highlight', `KT-03B=${marks}`]).out, /Đoạn dẫn/);
  const kt01 = draft(dir, [['2.5', '- Vỏ nhôm', 'Khung nhôm. KT-03B ghi "Armor Aluminum frame"', 'KT-03B, tr. 1']]);
  const args = [kt01, '--catalog', `KT-03B=${pdf}`, '--highlight', `KT-03B=${marks}`];
  assert.match(node('bid/bid-check.mjs', args).out, /KT-03B có 1 chỗ tô không ứng với chữ trích nào/);
  assert.doesNotMatch(node('bid/bid-check.mjs', [...args, '--also', tm]).out, /chỗ tô không ứng/);
});

test('package-check: cột bản gốc của bản dịch có chữ tự viết thì XEM; đề mục trang có đánh số vẫn nhận', needPoppler, () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'KT-02A Hãng.pdf'), makePdf(PAGES));
  const build = (name, blocks) => assert.equal(node('bid/bid-docx.mjs', [write(dir, `${name}.json`, { blocks }), path.join(dir, `${name}.docx`)]).status, 0);
  build('KT-00 Mục lục', [{ part: 'Mục lục' }, { p: 'Gồm KT-02, KT-02A.' }]);
  build('KT-02 Bản dịch', [{ part: 'Bản dịch' }, { h1: 'KT-02A: Hãng, hướng dẫn' }, { h2: 'A.1. Trang 2: Cổng mạng' }, { p: 'Nội dung trang:' },
    { table: { columns: ['Bản gốc (tiếng Anh)', 'Bản dịch tiếng Việt'], widths: [50, 50], rows: [
      ['Network port', 'Cổng mạng'],
      ['One RJ45 Ethernet port, 10 GbE (highlighted when printed)', 'Một cổng Ethernet RJ45, 10 GbE'],
      ['Ten externally facing storage flexbays without optical drive', 'Mười khoang ổ mặt ngoài, không có ổ quang'],
    ] } }]);
  const r = node('bid/package-check.mjs', [dir]);
  assert.match(r.out, /XEM {2}Bản dịch KT-02A, cột "Bản gốc" có chữ không có trên trang gốc \(tr\. 2 "gbe highlighted when printed"\)/, r.out);
  assert.doesNotMatch(r.out, /flexbays without|storage flexbays/, 'chữ vắt hai dòng của trang vẫn là chữ của trang');
});

test('pdf-highlight: nền tối thì vẽ khung vàng; "col" chọn ô theo cột của bảng ma trận; nhãn đầu hàng chưa tô thì XEM', needPoppler, () => {
  const dir = tmp();
  // Ô nền đen chữ trắng: đóng khối chữ, vẽ hình chữ nhật đen, mở khối chữ mới với màu chữ trắng.
  const darkPdf = write(dir, 'dark.pdf', makePdf([['Plain line', 'X) Tj ET 0 g 60 590 300 40 re f BT /F1 12 Tf 72 604 Td 1 g (Dark header cell']]));
  const d = node('bid/pdf-highlight.mjs', [darkPdf, write(dir, 'd.json', [{ page: 1, text: 'Dark header cell' }]), path.join(dir, 'd.pdf')]);
  assert.equal(d.status, 0, d.out);
  assert.match(d.out, /GHI "Dark header cell" trên trang 1 nằm trên nền tối/);
  assert.match(fs.readFileSync(path.join(dir, 'd.pdf'), 'latin1'), /1 0\.85 0 RG 1\.6 w/, 'vẽ khung vàng');
  const matrix = write(dir, 'm.pdf', makePdf([['Feature        ColA        ColB        ColC', 'Vulkan          ok           ok           ok', 'Weight                                   469 g']]));
  const c = node('bid/pdf-highlight.mjs', [matrix, write(dir, 'c.json', [{ page: 1, text: 'ok', near: 'Vulkan', col: 'ColC' }, { page: 1, text: '469 g' }]), path.join(dir, 'c.pdf')]);
  assert.equal(c.status, 0, c.out);
  const xs = [...fs.readFileSync(path.join(dir, 'c.pdf'), 'latin1').matchAll(/\/QuadPoints\[([\d.]+) ([\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
  const colC = xs[0]; // mục đầu của marks là ô "ok"
  assert.ok(colC && colC[0] > 230, `tô "ok" ở cột ColC (bên phải nhất): ${JSON.stringify(xs)}`);
  assert.match(c.out, /XEM Trang 1: tô "469" mà nhãn đầu hàng "Weight" chưa tô/);
});

test('package-check: trang chỉ dẫn ở chú thích hình không bắt tô; hàng còn dấu chưa chứng minh phải có lần tìm; link ở mục Lần tìm không bị đòi', needPoppler, () => {
  const dir = tmp();
  const src = write(dir, 'goc.pdf', makePdf(PAGES));
  assert.equal(node('bid/pdf-highlight.mjs', [src, write(dir, 'm.json', [{ page: 2, text: 'Network port' }]), path.join(dir, 'KT-02A Hãng.pdf')]).status, 0);
  const build = (name, blocks) => assert.equal(node('bid/bid-docx.mjs', [write(dir, `${name}.json`, { blocks }), path.join(dir, `${name}.docx`)]).status, 0);
  build('KT-00 Mục lục', [{ part: 'Mục lục' }, { p: 'Gồm KT-01, KT-02A (https://example.com/a.pdf), KT-05.' }]);
  build('KT-01 Bảng', [{ part: 'Bảng đáp ứng' }, { p: 'Như sau:' }, { table: { columns: ['STT', 'Yêu cầu', 'Đáp ứng', 'Tham chiếu'], widths: [10, 30, 40, 20], rows: [
    ['1.1', 'Mạng', 'KT-02A ghi "Network port"', 'KT-02A, tr. 2'],
    ['1.2', 'Tản nhiệt', 'Có [chưa có chứng minh: tản nhiệt]', 'KT-02A, tr. 2'],
    ['1.3', 'Vận hành 24/7', 'Có [chưa có chứng minh: vận hành 24/7]', 'KT-02A, tr. 2'],
  ] } }]);
  build('KT-05 Thuyết minh', [{ part: 'Thuyết minh' }, { p: 'Hình 1: Máy chủ (KT-02A, tr. 3)' }]);
  const sources = write(dir, 'sources.md', '| Ngày tải | Đường dẫn | Tệp | Cách lấy | Số trang | SHA-256 |\n|---|---|---|---|---|---|\n| 12/11/2026 | https://example.com/a.pdf | KT-02A.pdf | tệp PDF | 3 | x |\n\n## Lần tìm\n\n| Ngày | Dòng KT-01 | Thông số | Câu tìm hay trang đã xem | Kết quả |\n|---|---|---|---|---|\n| 12/11/2026 | 1.2 | tản nhiệt | https://example.com/thermal | không có |\n');
  const r = node('bid/package-check.mjs', [dir, '--sources', sources]);
  assert.doesNotMatch(r.out, /tr\. 3 nhưng trang đó chưa tô/, 'trang chỉ là nguồn ảnh');
  assert.doesNotMatch(r.out, /Dòng 1\.2 còn/);
  assert.match(r.out, /LỖI {2}Dòng 1\.3 còn \[chưa có chứng minh: vận hành 24\/7\] mà mục "Lần tìm"/);
  assert.doesNotMatch(r.out, /example\.com\/thermal/, 'link ở mục Lần tìm không bị đòi ghi vào bộ tệp');
});

test('bid-check --seen: dòng XEM đã xem in thành ĐÃ XEM, không tính vào số chỗ cần xem lại', () => {
  const dir = tmp();
  const doc = draft(dir, [['1', '- Bảo hành', 'Bảo hành 7 tháng', 'Thư hãng']]);
  const seen = write(dir, 'seen.txt', '# số đếm theo thư hãng\nSố đếm "7 tháng"\n');
  const r = node('bid/bid-check.mjs', [doc, '--seen', seen]);
  assert.match(r.out, /ĐÃ XEM {2}Số đếm "7 tháng"/, r.out);
  assert.doesNotMatch(r.out, /^XEM {2}Số đếm "7 tháng"/m);
});

test('bid-check --ba: ô Mẫu 10A trùng mốc BA đã chốt thì báo bỏ dấu; pdf-highlight: chỉ tô một phần ô xuống dòng thì XEM', needPoppler, () => {
  const dir = tmp();
  const ba = write(dir, 'ba.md', 'Giao hàng từ ngày 21 đến ngày 22.');
  const doc = draft(dir, [
    ['1', 'Giao hàng', 'Ngày giao do nhà thầu đề xuất: 22 [cần xác nhận: điền Mẫu 10A]', 'x'],
    ['2', 'Lắp đặt', 'Ngày nhà thầu đề xuất: 30 [cần xác nhận: điền Mẫu 10A]', 'x'],
  ]);
  const out = node('bid/bid-check.mjs', [doc, '--ba', ba]).out;
  assert.match(out, /đứng sau "22" mà tệp trả lời của BA đã chốt/, out);
  assert.doesNotMatch(out, /đứng sau "30"/);
  const src = write(dir, 'goc.pdf', makePdf([['Battery /', 'Charging', '', '', 'Weight']]));
  const r = node('bid/pdf-highlight.mjs', [src, write(dir, 'm.json', [{ page: 1, text: 'Battery /' }]), path.join(dir, 'o.pdf')]);
  assert.match(r.out, /chỉ tô một phần ô "Battery \/ Charging"/, r.out);
  const ok = node('bid/pdf-highlight.mjs', [src, write(dir, 'm2.json', [{ page: 1, text: 'Battery / Charging' }]), path.join(dir, 'o2.pdf')]);
  assert.doesNotMatch(ok.out, /một phần ô/, ok.out);
});
