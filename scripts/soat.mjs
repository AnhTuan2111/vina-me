#!/usr/bin/env node
// Soát phần máy đếm được trong một văn bản tiếng Việt (.md, .txt, .html).
// Dùng: node soat.mjs <tệp> [tệp khác…]
// Script chỉ bắt dấu hiệu bề mặt. Nó không biết câu nào rời câu nào, nên vẫn phải tự đọc lại hai lượt.
import fs from 'node:fs';

// Không có cụm nào bị cấm. Đây là những cụm ngoài đời ít người nói khi giải thích cho nhau,
// nên script đếm để người viết xem lại: một lần, đúng chỗ thì để; lặp lại thì sửa.
const CUM_IT_GAP = [
  'do đó', 'hệ quả là', 'bởi vậy', 'nói cách khác', 'thật ra', 'thực chất', 'về bản chất',
  'hành trình', 'điều quan trọng nhất là', 'điều đáng chú ý là', 'đóng vai trò', 'mang tính',
  'thông qua việc', 'thực hiện việc', 'chúng ta', 'bên cạnh đó', 'qua đó', 'đồng thời',
  'sâu sắc', 'mạnh mẽ', 'toàn diện', 'liền mạch', 'phải chăng', 'không chỉ',
];
const MO_CAU = ['Hãy ', 'Tóm lại', 'Nhìn chung', 'Có thể nói', 'Không thể phủ nhận', 'Thiết nghĩ'];
// Khuôn mở bài của văn mẫu nhà trường
const MO_BAI = /^(Trong (xã hội|cuộc sống|thời đại|bối cảnh|thế giới)[^.]{0,60}(hiện đại|hiện nay|ngày nay|công nghệ)|Ngày nay,|Từ xưa đến nay|Cuộc sống (là|luôn))/i;

function layVan(tep) {
  let s = fs.readFileSync(tep, 'utf8').replace(/\r\n/g, '\n');
  if (/\.html?$/i.test(tep)) {
    s = s.replace(/<(script|style|pre|code)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<(figcaption|caption|h[1-6]|dt|th)[\s>][\s\S]*?<\/\1>/gi, '\n\n')   // chú thích, tiêu đề: không tính là đoạn văn
      .replace(/<\/(li|dd|td)>/gi, ' ')                                             // cả một danh sách tính là một khối
      .replace(/<\/(p|ul|ol|dl|tr|table|div|section|blockquote)>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  } else {
    s = s.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`\n]*`/g, 'x');
    s = s.replace(/^\s*\|.*\|\s*$/gm, '');            // dòng bảng
    s = s.replace(/^---[\s\S]*?\n---\n/, '');         // frontmatter
  }
  return s;
}

function soat(tep) {
  const tho = fs.readFileSync(tep, 'utf8');
  const s = layVan(tep);
  const baoCao = [];
  const ghiChu = [];   // thấy nhưng chưa tới mức phải sửa

  // 1. gạch dài, gạch vừa: đếm trên cả tệp, kể cả code và tiêu đề
  const GACH = new RegExp('[' + String.fromCharCode(0x2014, 0x2013) + ']', 'g');
  const gach = (tho.match(GACH) || []).length;
  if (gach) baoCao.push(`gạch dài hoặc gạch vừa: ${gach} chỗ`);

  // 2. cụm nên tránh
  // Lời trích trong ngoặc kép và khối trích không tính: đó là lời người khác, hoặc ví dụ về chính lỗi này.
  const thap = s.replace(/^\s*>.*$/gm, ' ').replace(/"[^"\n]{0,300}"/g, ' ').toLowerCase();
  const itGap = [];
  for (const c of CUM_IT_GAP) {
    const n = thap.split(c).length - 1;
    if (n) itGap.push([c, n]);
  }
  const tongItGap = itGap.reduce((a, [, n]) => a + n, 0);
  const soChuTep = thap.split(/\s+/).length;
  if (tongItGap) {
    const ds = itGap.map(([c, n]) => (n > 1 ? `${c} (${n})` : c)).join(", ");
    const day = tongItGap / soChuTep > 0.004 || itGap.some(([, n]) => n >= 3);
    (day ? baoCao : ghiChu).push(`cụm ít gặp ngoài đời${day ? ", đang dày" : ""}: ${ds}`);
  }
  for (const m of MO_CAU) {
    const n = (s.match(new RegExp('(^|[.!?]\\s+|\\n)' + m, 'g')) || []).length;
    if (n) baoCao.push(`câu mở bằng "${m.trim()}": ${n} lần`);
  }
  const khongChi = (thap.match(/không chỉ[^.?!\n]{1,90}mà còn/g) || []).length;
  if (khongChi >= 2) baoCao.push(`"không chỉ … mà còn": ${khongChi} lần (văn mẫu dùng khuôn này để nâng tầm; người viết thật ít dùng)`);
  const doiLap = (s.match(/không phải[^.?!\n]{1,80}(, | )mà là/gi) || []).length;
  if (doiLap) baoCao.push(`"không phải … mà là": ${doiLap} lần (chỉ giữ khi sửa một chỗ hiểu sai có thật)`);
  const inHoa = (s.match(/(?<![\p{L}\d])[\p{Lu}]{5,}(?![\p{L}\d])/gu) || []).filter((w) => !/^[A-Z0-9]+$/.test(w));
  if (inHoa.length) baoCao.push(`chữ in hoa nhấn mạnh: ${[...new Set(inHoa)].slice(0, 5).join(', ')}`);
  if (/\p{Extended_Pictographic}/u.test(s)) baoCao.push('có emoji');
  // ký hiệu trong câu văn (code và output đã được bỏ ra ở layVan)
  const MUI_TEN = new RegExp('[' + [0x2190, 0x2192, 0x21d0, 0x21d2, 0x2713, 0x2714, 0x2717, 0x2718].map((c) => String.fromCharCode(c)).join('') + ']', 'g');
  const kyHieu = [];
  const dem = (re, ten) => { const n = (s.match(re) || []).length; if (n) kyHieu.push(`${ten} (${n})`); };
  dem(MUI_TEN, 'mũi tên hoặc dấu tick');
  dem(/~\s?\d/g, 'dấu ~ trước con số');
  dem(/\p{L} & \p{L}/gu, 'dấu &');
  dem(/\p{L} = \p{L}/gu, 'dấu = giữa hai vế');
  dem(/\bv\.v\.?/g, 'v.v.');
  if (kyHieu.length) baoCao.push('ký hiệu trong câu văn, viết thành chữ: ' + kyHieu.join(', '));
  const chot = (s.match(/(^|\n)\s*(Nhớ gọn|Nói ngắn gọn|Nói tóm lại|Tóm gọn lại|Chốt lại)[:,]/g) || []).length;
  if (chot) baoCao.push(`câu chốt kiểu "Nhớ gọn:": ${chot} lần (hết ý thì dừng)`);

  // 3. số đo câu và đoạn
  const doan = s.split(/\n\s*\n/).map((d) => d.replace(/\s+/g, ' ').trim())
    .filter((d) => d.split(' ').length >= 25 && !/^[#>|\-*\d]/.test(d));
  const tachCau = (d) => d.split(/(?<=[.!?…])\s+(?=[\p{Lu}"(])/u).filter((c) => c.split(' ').length >= 3);
  let soCau = 0, soChu = 0, soHoi = 0, cauCut = 0, haiCham = 0;
  const moHoi = [];
  for (const d of doan) {
    const cau = tachCau(d);
    soCau += cau.length;
    for (const c of cau) {
      const n = c.split(' ').length;
      soChu += n;
      if (c.trim().endsWith('?')) soHoi++;
      if (n <= 6) cauCut++;
      if (/:\s+\p{Ll}/u.test(c)) haiCham++;
    }
    moHoi.push(cau.length > 0 && cau[0].trim().endsWith('?'));
  }
  if (soCau) {
    const tb = soChu / soCau, cd = soCau / doan.length;
    console.log(`  ${doan.length} đoạn, ${soCau} câu · ${tb.toFixed(1)} chữ mỗi câu · ${cd.toFixed(1)} câu mỗi đoạn · ${(100 * soHoi / soCau).toFixed(1)}% là câu hỏi`);
    if (tb < 15) baoCao.push(`câu trung bình chỉ ${tb.toFixed(1)} chữ: xem có đang chặt câu cụt và bỏ từ nối không`);
    if (cd < 2.2) baoCao.push(`đoạn trung bình chỉ ${cd.toFixed(1)} câu: xem các đoạn có rời rạc không`);
    if (cauCut / soCau > 0.25) baoCao.push(`${Math.round(100 * cauCut / soCau)}% số câu dài không quá 6 chữ`);
    if (haiCham / soCau > 0.2) baoCao.push(`${haiCham} câu có dấu hai chấm theo sau là lời giải thích: xem có đang dùng nó làm khung không`);
  }
  if (doan.length && MO_BAI.test(doan[0])) baoCao.push('mở bài bằng khuôn "Trong xã hội hiện đại…": mở bằng việc đang bàn và một thứ cụ thể');
  if (doan.length > 2 && /(^|[.!?]\s)(Hãy|Tóm lại|Mỗi (người|chúng ta)|Chúng ta (cần|hãy))/.test(doan[doan.length - 1])) baoCao.push('kết bằng lời kêu gọi hoặc "Tóm lại": hết ý thì dừng, hoặc quay về câu mở');
  let lien = 0, toiDa = 0;
  for (const h of moHoi) { lien = h ? lien + 1 : 0; toiDa = Math.max(toiDa, lien); }
  if (toiDa >= 3) baoCao.push(`${toiDa} đoạn liền nhau cùng mở bằng câu hỏi`);

  // 4. đầu đoạn lặp
  const dau = doan.map((d) => d.split(' ').slice(0, 2).join(' ').toLowerCase());
  for (let i = 2; i < dau.length; i++) {
    if (dau[i] === dau[i - 1] && dau[i] === dau[i - 2]) { baoCao.push(`ba đoạn liền cùng mở bằng "${dau[i]}"`); break; }
  }
  // 5. gạch đầu dòng mở bằng nhãn in đậm (markdown)
  const nhan = (tho.match(/^\s*[-*]\s+\*\*[^*]+\*\*[:.]?\s/gm) || []).length;
  const dong = (tho.match(/^\s*[-*]\s+\S/gm) || []).length;
  if (dong >= 6 && nhan / dong > 0.6) baoCao.push(`${nhan}/${dong} gạch đầu dòng mở bằng nhãn in đậm`);

  for (const g of ghiChu) console.log('  · ' + g + ' (có ít, xem từng chỗ rồi quyết)');
  if (baoCao.length) for (const b of baoCao) console.log('  - ' + b);
  else console.log('  không thấy chỗ nào máy đếm được mà cần sửa');
  return baoCao.length;
}

const tep = process.argv.slice(2);
if (!tep.length) { console.log('Dùng: node soat.mjs <tệp> [tệp khác…]'); process.exit(1); }
let tong = 0;
for (const t of tep) { console.log(t); tong += soat(t); }
console.log(`\n${tong} chỗ cần xem lại. Xong bước này vẫn phải tự đọc hai lượt: người mới, và người bắt văn máy.`);
