// Test cho các script hồ sơ dự thầu ở scripts/bid/. Dữ liệu đều là dữ liệu giả: hồ sơ thật của công ty không vào repo.
// page-check và render-pdf cần Word, Poppler nên không chạy ở đây.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { tmp, node } from './helpers.mjs';
import { readZip, writeZip, crc32 } from '../scripts/bid/lib/zip.mjs';
import { docxParagraphs } from '../scripts/bid/lib/doc-text.mjs';

// Ảnh PNG 2x1 điểm ảnh dựng tay, để test không phụ thuộc thư viện ảnh.
function png() {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(2, 0); ihdr.writeUInt32BE(1, 4); ihdr[8] = 8; ihdr[9] = 2;
  const raw = Buffer.from([0, 255, 0, 0, 0, 0, 255]);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

const write = (dir, name, value) => {
  const p = path.join(dir, name);
  fs.writeFileSync(p, typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value));
  return p;
};
const xml = (file, part) => readZip(fs.readFileSync(file)).get(part)?.toString('utf8');

// Một hồ sơ giả đủ các loại khối: bìa, mục lục, phần lớn, bảng có hàng nhóm, câu dẫn, tiến độ theo ngày, bản cam kết.
const content = (extra = {}) => ({
  title: 'Thuyết minh', author: 'Công ty Giả',
  cover: [{ text: 'NHÀ THẦU: CÔNG TY GIẢ', bold: true }, 'THUYẾT MINH ĐỀ XUẤT KỸ THUẬT', 'Hà Nội, 2026'], toc: true,
  blocks: [
    { part: 'A. Đặc tính kỹ thuật' }, { doc: 'I. Bảng đáp ứng' }, { h1: '1. Máy chủ' },
    { p: 'Nhà thầu chào **máy chủ X** như sau:' },
    { table: { columns: ['STT', 'Yêu cầu', 'Đáp ứng', 'Tham chiếu'], widths: [8, 30, 40, 22],
      rows: [{ cells: ['I', 'Máy chủ X'], bold: true, shade: true }, ['1', 'RAM ≥ 128 GB', '128 GB\nDDR5', 'Catalog, tr. 2']] } },
    { p: 'Các biện pháp gồm:' }, { bullets: ['Ý một', ['ý con']] },
    { figure: { file: 'a.png', caption: 'Hình 1: Kiến trúc' } },
    { gantt: { dayOne: 'ngày ký hợp đồng', days: 12, intro: [{ h1: '2. Bảng tiến độ' }, { p: 'Tiến độ theo ngày như sau.' }],
      rows: [{ no: 'A', task: 'Cung cấp hàng hóa', group: true }, { no: '1', task: 'Giao máy chủ', owner: 'Nhà thầu', from: 1, to: 11 }] } },
    { letter: { org: ['CÔNG TY GIẢ'], date: 'Hà Nội, ngày ... tháng ... năm 2026', title: 'BẢN CAM KẾT',
      about: 'Về việc bảo hành', to: 'Kính gửi: Bên mời thầu Giả', body: ['Công ty Giả cam kết bảo hành 12 tháng.'],
      sign: ['ĐẠI DIỆN NHÀ THẦU', '[cần xác nhận: người ký]'] } },
  ],
  ...extra,
});

test('zip ghi rồi đọc lại đúng nội dung, CRC32 đúng giá trị chuẩn', () => {
  assert.equal(crc32(Buffer.from('123456789')), 0xcbf43926);
  const entries = new Map([['b.txt', 'chữ có dấu'], ['[Content_Types].xml', '<Types/>'], ['d/c.bin', Buffer.from([1, 2, 3])]]);
  const back = readZip(writeZip(entries));
  assert.deepEqual([...back.keys()], ['[Content_Types].xml', 'b.txt', 'd/c.bin']);
  assert.equal(back.get('b.txt').toString('utf8'), 'chữ có dấu');
});

test('bid-docx dựng bằng khuôn dựng sẵn: mục lục hai cấp, bảng kiểu clean, hàng nhóm và câu dẫn giữ với phần sau', () => {
  const dir = tmp();
  write(dir, 'a.png', png());
  const json = write(dir, 'c.json', content());
  const out = path.join(dir, 'out.docx');
  const r = node('bid/bid-docx.mjs', [json, out]);
  assert.equal(r.status, 0, r.out);
  const doc = xml(out, 'word/document.xml');
  assert.match(doc, /TOC \\h \\z \\t "MucChinh,1,MucTaiLieu,2"/);
  assert.match(doc, /<w:pStyle w:val="MucChinh"\/>/);
  assert.match(doc, /w:fill="D9E2F3"/, 'tiêu đề bảng nền lam nhạt của kiểu clean');
  assert.match(doc, /w:fill="F2F2F2"[\s\S]*?<w:keepNext\/>/, 'hàng nhóm giữ với hàng sau');
  assert.match(doc, /<w:keepNext\/>(?:(?!<\/w:p>).)*Các biện pháp gồm:/s, 'câu dẫn kết bằng dấu hai chấm giữ với danh sách');
  assert.match(doc, /ngày 1 là ngày ký hợp đồng/);
  assert.match(doc, /w:orient="landscape"/);
  assert.ok(readZip(fs.readFileSync(out)).has('word/footer2.xml'), 'section bản cam kết có chân trang trống');
  assert.match(doc, /<w:pgBorders w:display="firstPage"/, 'bìa có khung, chỉ ở trang đầu');
  assert.doesNotMatch(doc, /<w:t xml:space="preserve">1<\/w:t>[\s\S]{0,200}4472C4|4472C4[\s\S]{0,300}<w:t xml:space="preserve">1<\/w:t><\/w:r><\/w:p><\/w:tc>/, 'ô ngày không ghi số 1');
  const styles = xml(out, 'word/styles.xml');
  assert.match(styles, /w:styleId="TOC2"[\s\S]*?<w:caps w:val="0"\/>/, 'mục con trong mục lục chữ thường');
  assert.match(styles, /w:styleId="MucTaiLieu"[\s\S]*?<w:caps\/>/, 'tài liệu con in hoa trên trang bằng kiểu đoạn');
  const texts = docxParagraphs(fs.readFileSync(out)).map((p) => `${p.style}: ${p.text}`);
  assert.ok(texts.some((t) => t.endsWith('1 | RAM ≥ 128 GB | 128 GB DDR5 | Catalog, tr. 2')), texts.join('\n'));
});

test('bid-docx in dòng SỬA: đề mục gõ hoa, bảng ngay sau đề mục, tiêu đề cột mỗi dòng một tiếng', () => {
  const dir = tmp();
  const json = write(dir, 'c.json', { blocks: [
    { part: 'A. ĐẶC TÍNH KỸ THUẬT' }, { h1: '1. Tiến độ' },
    { table: { columns: ['STT', 'Nội dung công việc', 'Đơn vị tính', 'Kết quả'], widths: [8, 60, 6, 26], rows: [['1', 'Giao hàng', 'Bộ', 'Biên bản']] } },
  ] });
  const r = node('bid/bid-docx.mjs', [json, path.join(dir, 'out.docx')]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /SỬA {2}part "A\. ĐẶC TÍNH KỸ THUẬT" gõ chữ hoa/);
  assert.match(r.out, /SỬA {2}Bảng .* đứng ngay sau đề mục "1\. Tiến độ", thiếu câu mở/);
  assert.match(r.out, /SỬA {2}Bảng .*tiêu đề cột 3 "Đơn vị tính" xuống mỗi dòng một tiếng/);
});

test('bid-docx dính hai chữ cuối của tên phần, mã hiệu có gạch nối không gãy dòng', () => {
  const dir = tmp();
  const json = write(dir, 'c.json', { blocks: [
    { part: 'A. Giải pháp và phương pháp luận về công nghệ' },
    { p: 'Nguồn W-3500 của máy chủ.' },
  ] });
  const out = path.join(dir, 'out.docx');
  assert.equal(node('bid/bid-docx.mjs', [json, out]).status, 0);
  const doc = xml(out, 'word/document.xml');
  assert.match(doc, /về công nghệ|công nghệ/);
  assert.match(doc, /W<\/w:t><w:noBreakHyphen\/><w:t xml:space="preserve">3500/);
});

test('bid-docx với khuôn là hồ sơ cũ: giữ khổ trang, bỏ nội dung, ảnh, người sửa và số đếm của hồ sơ cũ', () => {
  const dir = tmp();
  write(dir, 'old.png', png());
  const cover = ['NHÀ THẦU', 'THUYẾT MINH', 'Hà Nội, 2026'];
  const oldJson = write(dir, 'old.json', { author: 'Người Cũ', cover: ['NHÀ THẦU CŨ', 'THUYẾT MINH', 'Giả Cũ, 2025'], toc: true,
    blocks: [{ h1: '1. Gói cũ ở tỉnh Giả Cũ' }, { figure: { file: 'old.png' } }] });
  const oldDocx = path.join(dir, 'old.docx');
  assert.equal(node('bid/bid-docx.mjs', [oldJson, oldDocx]).status, 0);
  const zip = readZip(fs.readFileSync(oldDocx));
  zip.set('word/document.xml', zip.get('word/document.xml').toString('utf8').replace(/(<w:pgMar[^>]*w:left=")\d+"/g, '$11999"'));
  zip.set('docProps/app.xml', '<?xml version="1.0"?><Properties><Pages>68</Pages><Words>16519</Words><TotalTime>485</TotalTime><Company>Công ty Cũ</Company></Properties>');
  fs.writeFileSync(oldDocx, writeZip(zip));

  const newJson = write(dir, 'new.json', { author: 'Công ty Mới', cover, toc: true, blocks: [{ h1: '1. Gói mới' }, { bullets: ['Một ý'] }] });
  const out = path.join(dir, 'new.docx');
  const r = node('bid/bid-docx.mjs', [newJson, out, '--template', oldDocx]);
  assert.equal(r.status, 0, r.out);
  const files = readZip(fs.readFileSync(out));
  const doc = files.get('word/document.xml').toString('utf8');
  assert.doesNotMatch(doc, /Giả Cũ/);
  assert.match(doc, /w:left="1999"/);
  assert.ok(![...files.keys()].some((k) => k.startsWith('word/media/')), 'ảnh của hồ sơ cũ phải bị bỏ');
  assert.match(files.get('docProps/core.xml').toString('utf8'), /<cp:lastModifiedBy>Công ty Mới<\/cp:lastModifiedBy>/);
  const app = files.get('docProps/app.xml').toString('utf8');
  assert.match(app, /<Pages>0<\/Pages>/);
  assert.match(app, /<TotalTime>0<\/TotalTime>/);
  assert.match(app, /<Company><\/Company>/);
});

test('bid-check bắt chỗ để trống, chữ của gói cũ, cam kết tự đặt; không bắt chữ chép nguyên văn HSMT', () => {
  const dir = tmp();
  const hsmt = write(dir, 'hsmt.txt', 'Thời gian thực hiện 60 ngày. Bảo hành tối thiểu 12 tháng. Máy chủ: Tối thiểu 8 khe DIMM.');
  const sample = write(dir, 'sample.md', '# 1. Giới thiệu\nPhần mềm triển khai tại Tỉnh Giả Cũ theo HSYC.\n');
  const draft = write(dir, 'draft.md', [
    '# 1. Giới thiệu',
    'Thời gian thực hiện 30 ngày; bảo hành 12 (mười hai) tháng; số điện thoại [cần xác nhận].',
    'Mẫu lấy theo HSYC của Tỉnh Giả Cũ.',
    'Nhà thầu bảo trì định kỳ hằng quý.',
    'Máy chủ: Tối thiểu 8 khe DIMM.',
  ].join('\n'));
  const r = node('bid/bid-check.mjs', [draft, '--hsmt', hsmt, '--sample', sample, '--term', 'Giả Cũ']);
  assert.equal(r.status, 1, r.out);
  assert.match(r.out, /LỖI {2}Còn để trống .*\[cần xác nhận\]/);
  assert.match(r.out, /LỖI {2}Còn "Giả Cũ" của gói cũ/);
  assert.match(r.out, /XEM {2}Thời hạn "30 ngày" không có trong HSMT/);
  assert.match(r.out, /XEM {2}Cam kết "hằng quý" không có trong HSMT/);
  assert.doesNotMatch(r.out, /Thời hạn "12 tháng"/, '"12 (mười hai) tháng" khớp với "12 tháng" của HSMT');
  assert.doesNotMatch(r.out, /"8 khe" thiếu số 0/, 'chữ chép nguyên văn HSMT giữ như HSMT viết');

  const clean = write(dir, 'clean.md', '# 1. Giới thiệu\nThời gian thực hiện 60 (sáu mươi) ngày, bảo hành 12 (mười hai) tháng.\n');
  const ok = node('bid/bid-check.mjs', [clean, '--hsmt', hsmt, '--sample', sample]);
  assert.equal(ok.status, 0, ok.out);
});

test('bid-check bắt lời nói với BA, mốc bảo hành tự đặt, phần mềm kèm phiên bản, phần lớn thiếu câu cam kết', () => {
  const dir = tmp();
  const hsmt = write(dir, 'hsmt.txt', 'Bảo hành tối thiểu 12 tháng. Hệ điều hành máy chủ do nhà thầu đề xuất.');
  const draft = write(dir, 'draft.md', [
    '# A. Đặc tính kỹ thuật',
    'Hồ sơ BA cung cấp chưa có model máy tính bảng.',
    'Máy chủ cài Ubuntu 24.04 LTS.',
    'Nhà thầu cam kết đáp ứng các yêu cầu nêu trên.',
    '## 1. Kết nối',
    'Ứng dụng gọi máy chủ qua RESTful, mật khẩu lưu dạng băm.',
    '# B. Bảo hành',
    'Bảo hành 12 (mười hai) tháng tính từ ngày nghiệm thu.',
    'Bảo hành máy chủ 36 (ba mươi sáu) tháng [cần xác nhận: gói của hãng].',
  ].join('\n'));
  const r = node('bid/bid-check.mjs', [draft, '--hsmt', hsmt]);
  assert.match(r.out, /LỖI {2}Lời nói với BA trong thân hồ sơ \("BA"\)/);
  assert.doesNotMatch(r.out, /\("ba"\)/, '"ba mươi sáu" là số, không phải BA');
  assert.match(r.out, /XEM {2}Phần mềm "Ubuntu 24\.04 LTS" không có trong HSMT/);
  assert.match(r.out, /XEM {2}Mốc "tính từ ngày nghiệm thu" của bảo hành/);
  assert.match(r.out, /XEM {2}Phần "B\. Bảo hành" không có câu kết "Nhà thầu cam kết/);
  assert.doesNotMatch(r.out, /Phần "A\. Đặc tính kỹ thuật" không có câu kết/);
  assert.match(r.out, /XEM {2}Chi tiết kỹ thuật "RESTful" không có trong HSMT/);
  assert.match(r.out, /XEM {2}Chi tiết kỹ thuật "dạng băm" không có trong HSMT/);
});

test('bid-check bắt lịch nhắc lại ngoài phần tiến độ, số thập phân dấu chấm, câu khẳng định ai làm phần mềm khi đang chờ BA', () => {
  const dir = tmp();
  const hsmt = write(dir, 'hsmt.txt', 'Thời gian thực hiện 60 ngày. Tần số CPU tối đa ≥ 4.5 GHz.');
  const draft = write(dir, 'draft.md', [
    '# A. Giải pháp',
    'Phần mềm do đơn vị phát triển [cần xác nhận: đơn vị phát triển phần mềm] xây dựng.',
    'Phần mềm quản lý do Nhà thầu thực hiện theo yêu cầu.',
    'Giao nhận thiết bị từ ngày 2 đến ngày 25.',
    'CPU đạt 4.80 GHz, ổ cứng 3,84 TB.',
    'Catalog ghi "4.80 GHz".',
    '# B. Tiến độ thực hiện',
    'Lắp đặt từ ngày 26 đến ngày 40 [cần xác nhận: lịch].',
    'Đào tạo ngày 41 đến ngày 45.',
  ].join('\n'));
  const r = node('bid/bid-check.mjs', [draft, '--hsmt', hsmt]);
  assert.match(r.out, /Lịch "ngày 2 đến ngày 25" nhắc lại ngoài phần tiến độ/);
  assert.doesNotMatch(r.out, /Lịch "ngày 41 đến ngày 45"/, 'trong phần tiến độ không bắt từng mốc');
  assert.match(r.out, /Số thập phân "4\.80 GHz" dùng dấu chấm/);
  assert.doesNotMatch(r.out, /Số thập phân "4\.5 GHz"/, 'chữ chép nguyên HSMT giữ như HSMT viết');
  assert.match(r.out, /Câu "do Nhà thầu thực hiện" khẳng định ai làm phần mềm/);
});

test('docx-profile so bản dựng với chính nó: khớp trọn', () => {
  const dir = tmp();
  write(dir, 'a.png', png());
  const out = path.join(dir, 'out.docx');
  assert.equal(node('bid/bid-docx.mjs', [write(dir, 'c.json', content()), out]).status, 0);
  const r = node('bid/docx-profile.mjs', ['--compare', out, out]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /100(?:[.,]0)?%/);
});
