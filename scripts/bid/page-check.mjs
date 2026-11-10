#!/usr/bin/env node
// Soát bố cục trang của bản PDF do Word xuất (render-pdf.ps1), những lỗi người chấm thấy ngay khi lật hồ sơ:
//   - đề mục ở cuối trang, sau nó trên cùng trang còn dưới hai dòng, nội dung sang trang sau;
//   - trang gần trắng: chữ chỉ chiếm dưới một phần tư chiều cao vùng chữ (vài dòng tràn sang trang mới, đề mục đứng một
//     mình trước trang xoay ngang);
//   - trang trắng: không có chữ nào ngoài số trang;
//   - bản cam kết dài quá một trang: trong phần cam kết, trang nào cũng phải mở bằng quốc hiệu.
// Bỏ qua trang bìa, các trang mục lục và trang cuối của tệp.
// Dùng: node page-check.mjs <HSDX.pdf> <HSDX.docx>     (cần pdftotext của Poppler trong PATH)
// Thoát mã 1 khi có lỗi. Mỗi lỗi là lỗi phải sửa trong content.json (bớt chữ, gộp đoạn, chuyển đề mục), không phải
// điều để ghi vào báo cáo.
import { readParagraphs, isHeading, decodeXml } from './lib/doc-text.mjs';
import { pdftotext } from './lib/poppler.mjs';

const [pdf, docx] = process.argv.slice(2);
if (!pdf || !docx) {
  console.log('Dùng: node page-check.mjs <HSDX.pdf> <HSDX.docx>');
  process.exit(1);
}
const xml = pdftotext(pdf, ['-bbox-layout']);
const norm = (s) => s.normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase();

// Mỗi trang: kích thước, các dòng chữ (toạ độ theo điểm, gốc ở góc trên trái).
const pages = [...xml.matchAll(/<page width="([\d.]+)" height="([\d.]+)">([\s\S]*?)<\/page>/g)].map((m, i) => {
  const W = Number(m[1]);
  const H = Number(m[2]);
  const lines = [...m[3].matchAll(/<line xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([\s\S]*?)<\/line>/g)].map((l) => ({
    y0: Number(l[2]), y1: Number(l[4]),
    text: decodeXml([...l[5].matchAll(/<word[^>]*>([^<]*)<\/word>/g)].map((w) => w[1]).join(' ')).trim(),
  })).filter((l) => l.text);
  // Số trang ở chân trang (một con số đứng riêng trong 10% cuối trang) không tính là chữ của trang.
  const body = lines.filter((l) => !(l.y0 > H * 0.9 && /^\d{1,3}$/.test(l.text))).sort((a, b) => a.y0 - b.y0);
  return { no: i + 1, W, H, landscape: W > H, body };
});

// Đề mục của bản dựng: đoạn mang kiểu đề mục, phần lớn, tài liệu con.
const heads = readParagraphs(docx).filter((p) => isHeading(p.style)).map((p) => norm(p.text)).filter((t) => t.length >= 4);
// Phần lớn (A, B…), tài liệu con (I, II…) mở trang mới: một phần ngắn đứng riêng một trang là bố cục bình thường.
const partHeads = readParagraphs(docx).filter((p) => /^muc/i.test(p.style)).map((p) => norm(p.text));
const opensPart = (text) => partHeads.some((h) => h.length >= 4 && h.slice(0, 40) === norm(text).slice(0, Math.min(40, h.length)));
const isHeadLine = (text) => {
  const t = norm(text);
  if (t.length < 4) return false;
  return heads.some((h) => {
    const n = Math.min(h.length, t.length, 40);
    return n >= 4 && h.slice(0, n) === t.slice(0, n);
  });
};
const isToc = (p) => {
  const ends = p.body.filter((l) => /(\.{3,}|…)\s*\d+$|\s\d{1,3}$/.test(l.text)).length;
  return /^m[ụu]c l[ụu]c$/i.test(p.body[0]?.text ?? '') || (p.body.length >= 5 && ends / p.body.length > 0.5);
};

const errors = [];
const nation = (p) => p.body.slice(0, 6).some((l) => /CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM/i.test(l.text));
const firstLetter = pages.findIndex(nation);
// Mép trên vùng chữ: trung vị của dòng đầu các trang cùng hướng (bỏ bìa).
const textTop = (landscape) => {
  const ys = pages.filter((q) => q.no > 1 && q.landscape === landscape && q.body.length).map((q) => q.body[0].y0).sort((a, b) => a - b);
  return ys.length ? ys[Math.floor(ys.length / 2)] : 72;
};
for (const p of pages) {
  if (p.no === 1 || isToc(p)) continue;
  const last = p.no === pages.length;
  if (!p.body.length) { errors.push(`Trang ${p.no}: trang trắng`); continue; }
  // Vùng chữ: từ mép trên vùng chữ chung của các trang cùng hướng (dòng cao nhất hay gặp, tức lề trên) tới mép dưới vùng chữ
  // (khoảng 88% chiều cao trang với lề của hồ sơ mẫu). Đo từ dòng đầu của chính trang thì trang mở bằng khoảng trống bị tính
  // đầy hơn thật.
  const top = Math.min(textTop(p.landscape), ...p.body.map((l) => l.y0));
  const bottom = Math.max(...p.body.map((l) => l.y1));
  const fill = (bottom - top) / (p.H * 0.88 - top);
  // Trang ngang: mỗi bảng tiến độ phải vừa một trang; trang ngang ngắn mà trang sau vẫn là trang ngang là bảng bị tràn.
  // Trang ngang cuối cùng (bảng cuối, ít việc) được ngắn.
  const lastLandscape = p.landscape && !pages[p.no]?.landscape;
  // Kể cả trang mở một phần lớn ngắn (vài dòng cam kết): người chấm vẫn thấy trang trắng; viết phần đó thành bảng đủ ý.
  // Ngưỡng 30% vùng chữ (khoảng một phần tư trang giấy): thấp hơn là người chấm thấy trang bỏ trống.
  if (!last && !lastLandscape && fill < 0.3) {
    errors.push(`Trang ${p.no}: gần trắng, chữ chiếm ${Math.round(fill * 100)}% vùng chữ (${p.body.length} dòng, bắt đầu "${p.body[0].text.slice(0, 50)}")`);
  }
  if (!last) {
    // Đề mục mà sau nó trên cùng trang còn dưới hai dòng (đề mục là dòng cuối, hoặc chỉ kèm một dòng rồi bảng sang trang).
    // Đề mục kèm hai dòng chữ trở lên ở cuối trang là cách ngắt trang bình thường của sách in.
    const tail = p.body.slice(-2);
    const h = tail.find((l) => isHeadLine(l.text));
    // Câu dẫn kết bằng ":" là dòng cuối trang: danh sách, bảng theo sau sang trang khác.
    const end = p.body[p.body.length - 1];
    if (!h && p.body.length > 3 && /:\s*$/.test(end.text) && !isHeadLine(end.text)) errors.push(`Trang ${p.no}: câu dẫn "${end.text.slice(-60)}" nằm cuối trang, phần nó dẫn sang trang ${p.no + 1}`);
    if (h && p.body.length > 3) errors.push(`Trang ${p.no}: đề mục "${h.text.slice(0, 60)}" nằm cuối trang, nội dung sang trang ${p.no + 1}`);
  }
  if (firstLetter >= 0 && p.no - 1 > firstLetter && !nation(p) && !p.landscape) {
    errors.push(`Trang ${p.no}: trong phần bản cam kết nhưng không mở bằng quốc hiệu, bản cam kết trước dài quá một trang`);
  }
}
for (const e of errors) console.log(`LỖI  ${e}`);
console.log(`${pdf}: ${pages.length} trang, ${errors.length} lỗi bố cục.`);
process.exit(errors.length ? 1 : 0);
