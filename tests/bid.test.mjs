// Test cho bid-docx.mjs, bid-check.mjs và lib/zip.mjs. Dữ liệu đều là dữ liệu giả: hồ sơ thật của công ty không vào repo.
// Chạy: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { tmp, node } from './helpers.mjs';
import { readZip, writeZip, crc32 } from '../scripts/lib/zip.mjs';
import { docxParagraphs } from '../scripts/lib/doc-text.mjs';

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

test('zip ghi rồi đọc lại đúng nội dung, CRC32 đúng giá trị chuẩn', () => {
  assert.equal(crc32(Buffer.from('123456789')), 0xcbf43926);
  const entries = new Map([['b.txt', 'chữ có dấu'], ['[Content_Types].xml', '<Types/>'], ['d/c.bin', Buffer.from([1, 2, 3])]]);
  const back = readZip(writeZip(entries));
  assert.deepEqual([...back.keys()], ['[Content_Types].xml', 'b.txt', 'd/c.bin']);
  assert.equal(back.get('b.txt').toString('utf8'), 'chữ có dấu');
  assert.deepEqual([...back.get('d/c.bin')], [1, 2, 3]);
});

test('bid-docx dựng tệp từ khuôn dựng sẵn: đề mục, danh sách, bảng, ảnh, mục lục', () => {
  const dir = tmp();
  write(dir, 'a.png', png());
  const json = write(dir, 'c.json', {
    title: 'Thuyết minh', author: 'Công ty Giả',
    cover: [{ text: 'NHÀ THẦU: CÔNG TY GIẢ', bold: true }], toc: true,
    blocks: [
      { part: 'A. Đặc tính kỹ thuật' }, { doc: 'I. Bảng đáp ứng' }, { h1: '1. Máy chủ' },
      { p: 'Nhà thầu chào **máy chủ X**.' }, { bullets: ['Ý một', ['ý con']] },
      { table: { columns: ['STT', 'Yêu cầu', 'Đáp ứng'], rows: [{ cells: ['I', 'Nhóm'], bold: true }, ['1', 'RAM 128 GB', '128 GB\nDDR5']] } },
      { figure: { file: 'a.png', caption: 'Hình 1: Kiến trúc' } },
    ],
  });
  const out = path.join(dir, 'out.docx');
  const r = node('bid-docx.mjs', [json, out]);
  assert.equal(r.status, 0, r.out);
  const doc = xml(out, 'word/document.xml');
  assert.match(doc, /<w:pStyle w:val="MucChinh"\/>/);
  assert.match(doc, /<w:pStyle w:val="MucTaiLieu"\/><w:pageBreakBefore w:val="0"\/>/);
  assert.match(doc, /<w:numPr><w:ilvl w:val="1"\/><w:numId w:val="1"\/><\/w:numPr>/);
  assert.match(doc, /TOC \\o "1-3"/);
  assert.match(doc, /r:embed="rIdBid\d+"/);
  assert.ok(readZip(fs.readFileSync(out)).has('word/media/bid-image1.png'));
  assert.match(xml(out, 'word/settings.xml'), /w:updateFields/);
  const texts = docxParagraphs(fs.readFileSync(out)).map((p) => `${p.style}: ${p.text}`);
  assert.ok(texts.includes('heading 1: 1. Máy chủ'));
  assert.ok(texts.includes('table: 1 | RAM 128 GB | 128 GB DDR5'));
  assert.ok(texts.includes('Normal: Nhà thầu chào máy chủ X.'));
});

test('bid-docx với khuôn là hồ sơ cũ: giữ kiểu và khổ trang, bỏ sạch nội dung, ảnh, người sửa của hồ sơ cũ', () => {
  const dir = tmp();
  write(dir, 'old.png', png());
  // Hồ sơ cũ: dựng bằng chính script, rồi đổi lề và người sửa để thấy khuôn được giữ hay bị thay.
  const oldJson = write(dir, 'old.json', { author: 'Người Cũ', blocks: [{ h1: '1. Gói cũ ở tỉnh Hòa Bình' }, { figure: { file: 'old.png' } }] });
  const oldDocx = path.join(dir, 'old.docx');
  assert.equal(node('bid-docx.mjs', [oldJson, oldDocx]).status, 0);
  const zip = readZip(fs.readFileSync(oldDocx));
  zip.set('word/document.xml', zip.get('word/document.xml').toString('utf8').replace('w:left="1701"', 'w:left="1999"'));
  fs.writeFileSync(oldDocx, writeZip(zip));

  const newJson = write(dir, 'new.json', { author: 'Công ty Mới', blocks: [{ h1: '1. Gói mới' }, { bullets: ['Một ý'] }] });
  const out = path.join(dir, 'new.docx');
  const r = node('bid-docx.mjs', [newJson, out, '--template', oldDocx]);
  assert.equal(r.status, 0, r.out);
  const files = readZip(fs.readFileSync(out));
  const doc = files.get('word/document.xml').toString('utf8');
  assert.doesNotMatch(doc, /Hòa Bình/);
  assert.match(doc, /w:left="1999"/);
  assert.ok(![...files.keys()].some((k) => k.startsWith('word/media/')), 'ảnh của hồ sơ cũ phải bị bỏ');
  assert.doesNotMatch(files.get('word/_rels/document.xml.rels').toString('utf8'), /media\//);
  assert.match(files.get('docProps/core.xml').toString('utf8'), /<cp:lastModifiedBy>Công ty Mới<\/cp:lastModifiedBy>/);
});

test('bid-check bắt chỗ để trống, mục dẫn sai, chữ của gói cũ; nêu tên riêng và thời hạn lạ để xem lại', () => {
  const dir = tmp();
  const hsmt = write(dir, 'hsmt.txt', 'Gói thầu tại Học viện Giả. Thời gian thực hiện 60 ngày. Bảo hành tối thiểu 12 tháng, xử lý trong 48 giờ.');
  const sample = write(dir, 'sample.md', '# 1. Giới thiệu\nPhần mềm triển khai tại Tỉnh Hòa Bình theo HSYC.\nKý hợp đồng với ông Trần Văn Mẫu.\n');
  const tlkt = write(dir, 'tlkt.md', '# 1. Thông tin sản phẩm\n## 1.1. Giới thiệu chung\n## 10.7. Đặc tính về cơ sở dữ liệu\n');
  const draft = write(dir, 'draft.md', [
    '# 1. Giới thiệu',
    'Phần mềm đặt tại Học viện Giả (thuyết minh chi tiết tại mục 10.7 của Tài liệu kỹ thuật).',
    'Kiến trúc nêu tại các mục từ 1.1 đến 9.9 của Tài liệu kỹ thuật.',
    '# 2. Tiến độ',
    'Thời gian thực hiện 30 ngày; bảo hành 12 (mười hai) tháng; số điện thoại [cần xác nhận].',
    'Mẫu lấy theo HSYC của Tỉnh Hòa Bình.',
    'Catalog bản A08 tháng 8/2026; số khoang ổ đĩa [chưa có chứng minh].',
  ].join('\n'));
  const r = node('bid-check.mjs', [draft, '--hsmt', hsmt, '--sample', sample, '--tlkt', tlkt, '--term', 'Hòa Bình']);
  assert.equal(r.status, 1, r.out);
  assert.match(r.out, /LỖI {2}Còn để trống \[2\. Tiến độ\]: .*\[cần xác nhận\]/);
  assert.match(r.out, /LỖI {2}Dẫn tới mục 9\.9 của Tài liệu kỹ thuật/);
  assert.doesNotMatch(r.out, /mục 10\.7 của Tài liệu kỹ thuật nhưng/);
  assert.doesNotMatch(r.out, /mục 1\.1 của Tài liệu kỹ thuật nhưng/);
  assert.match(r.out, /LỖI {2}Còn "Hòa Bình" của gói cũ/);
  assert.match(r.out, /XEM {2}"HSYC" có trong bản đối chứng/);
  assert.match(r.out, /XEM {2}"Tỉnh Hòa Bình" có trong bản đối chứng/);
  assert.doesNotMatch(r.out, /Trần Văn Mẫu/, 'tên không có trong bản nháp thì không nêu');
  assert.match(r.out, /XEM {2}Thời hạn "30 ngày" không có trong HSMT/);
  assert.doesNotMatch(r.out, /Thời hạn "12 tháng"/, '"12 (mười hai) tháng" khớp với "12 tháng" của HSMT');
  assert.match(r.out, /LỖI {2}Còn để trống .*\[chưa có chứng minh\]/);
  assert.doesNotMatch(r.out, /Thời hạn "8 tháng"/, '"A08 tháng 8/2026" không phải thời hạn');

  const clean = write(dir, 'clean.md', '# 1. Giới thiệu\nPhần mềm đặt tại Học viện Giả, bảo hành 12 tháng.\n');
  const ok = node('bid-check.mjs', [clean, '--hsmt', hsmt, '--sample', sample]);
  assert.equal(ok.status, 0, ok.out);
  assert.match(ok.out, /0 lỗi, 0 chỗ cần xem lại/);
});
