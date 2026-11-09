#!/usr/bin/env node
// Soát bản nháp hồ sơ dự thầu (thuyết minh đề xuất kỹ thuật, tài liệu kỹ thuật) trước khi giao cho BA.
// Dùng: node bid-check.mjs <bản nháp.docx|.md|.txt> [--hsmt <tệp>]... [--sample <tệp>]... [--tlkt <tệp>]
//                           [--tlkt-name "Tài liệu kỹ thuật"] [--term "tên cũ"]...
//   --hsmt    chữ của hồ sơ mời thầu (.txt trích từ PDF, .docx); nhiều tệp thì lặp cờ
//   --sample  hồ sơ đã nộp dùng làm bản đối chứng; tìm tên riêng, mã của gói cũ còn sót trong bản nháp
//   --tlkt    tài liệu kỹ thuật mà bản nháp dẫn tới ("thuyết minh chi tiết tại mục 10.7 của Tài liệu kỹ thuật")
//   --term    chữ chắc chắn thuộc gói cũ (tên tỉnh, tên sản phẩm cũ), tìm thêm ngoài phần tự đoán
// Lỗi (thoát mã 1): chỗ còn để trống, mục dẫn sang tài liệu kỹ thuật không có, chữ ở --term còn sót.
// Cần xem lại (không làm hỏng lệnh): tên riêng của bản đối chứng không có trong HSMT, con số thời hạn không có trong HSMT.
// Script chỉ bắt dấu hiệu bề mặt; đối chiếu yêu cầu với bảng truy vết vẫn phải tự đọc (references/bid-proposals.md).
import { readParagraphs, isHeading } from './lib/doc-text.mjs';

const argv = process.argv.slice(2);
const opt = { hsmt: [], sample: [], term: [], tlkt: undefined, tlktName: 'Tài liệu kỹ thuật' };
const files = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--hsmt') opt.hsmt.push(argv[++i]);
  else if (a === '--sample') opt.sample.push(argv[++i]);
  else if (a === '--term') opt.term.push(argv[++i]);
  else if (a === '--tlkt') opt.tlkt = argv[++i];
  else if (a === '--tlkt-name') opt.tlktName = argv[++i];
  else files.push(a);
}
if (files.length !== 1) {
  console.log('Dùng: node bid-check.mjs <bản nháp> [--hsmt <tệp>]... [--sample <tệp>]... [--tlkt <tệp>] [--term "chữ"]...');
  process.exit(1);
}

const norm = (s) => s.normalize('NFC').replace(/\s+/g, ' ').toLowerCase();
const draft = readParagraphs(files[0]);
const hsmtText = norm(opt.hsmt.map((f) => readParagraphs(f).map((p) => p.text).join('\n')).join('\n'));
const errors = [];
const warnings = [];

// Mỗi đoạn gắn với đề mục gần nhất phía trên, để báo lỗi nói được "ở mục nào".
let section = '(đầu tài liệu)';
const located = draft.map((p) => {
  if (isHeading(p.style)) section = p.text.slice(0, 70);
  return { ...p, section };
});
const where = (p) => `[${p.section}]`;
const snippet = (text, idx, len) => {
  const a = Math.max(0, idx - 30);
  return `${a > 0 ? '...' : ''}${text.slice(a, idx + len + 30)}${idx + len + 30 < text.length ? '...' : ''}`;
};

// 1. Chỗ còn để trống, đánh dấu chờ xác nhận.
const PLACEHOLDER = /\[(?:cần|chờ|bổ sung|điền|xác nhận|TODO)[^\]]*\]|\bTODO\b|\bxxx+\b|\?\?\?+|\.{4,}|…{2,}|<[^<>]{1,30}>/gi;
for (const p of located) {
  for (const m of p.text.matchAll(PLACEHOLDER)) {
    errors.push(`Còn để trống ${where(p)}: ${snippet(p.text, m.index, m[0].length)}`);
  }
}

// 2. Mục dẫn sang tài liệu kỹ thuật phải có thật.
if (opt.tlkt) {
  const tlkt = readParagraphs(opt.tlkt);
  const heads = new Map();
  // Chỉ đề mục mới tính; tài liệu không dùng kiểu đề mục (gõ tay số mục rồi in đậm) thì mới tính đoạn ngắn mở bằng số.
  const numbered = (ps) => ps.map((p) => [p, p.text.match(/^(\d+(?:\.\d+)*)\.?\s+(.+)$/)]).filter(([, m]) => m);
  let cands = numbered(tlkt.filter((p) => isHeading(p.style)));
  if (!cands.length) cands = numbered(tlkt.filter((p) => p.style === 'Normal' && p.text.length < 120));
  for (const [, m] of cands) if (!heads.has(m[1])) heads.set(m[1], m[2]);
  const name = opt.tlktName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // "tại mục 10.7 của Tài liệu kỹ thuật", "các mục từ 11.1 đến 11.4 của Tài liệu kỹ thuật", "mục 4 và mục 5 của …"
  const ref = new RegExp(`mục\\s+(?:từ\\s+)?(\\d+(?:\\.\\d+)*(?:\\s*(?:,|và|đến|tới)\\s*(?:mục\\s+)?\\d+(?:\\.\\d+)*)*)\\s+(?:của\\s+)?(?:bản\\s+)?${name}`, 'gi');
  let count = 0;
  for (const p of located) {
    for (const m of p.text.matchAll(ref)) {
      for (const n of m[1].match(/\d+(?:\.\d+)*/g)) {
        count++;
        if (!heads.has(n)) errors.push(`Dẫn tới mục ${n} của ${opt.tlktName} nhưng tài liệu đó không có mục này ${where(p)}`);
      }
    }
  }
  console.log(`Mục dẫn sang ${opt.tlktName}: ${count} chỗ, đối chiếu với ${heads.size} đề mục đánh số.`);
  if (!count) warnings.push(`Không thấy chỗ nào dẫn sang "${opt.tlktName}"; tên tài liệu trong bản nháp khác thì chạy lại với --tlkt-name.`);
}

// 3. Chữ chắc chắn của gói cũ (--term).
for (const t of opt.term) {
  const hits = located.filter((p) => norm(p.text).includes(norm(t)));
  if (hits.length) errors.push(`Còn "${t}" của gói cũ ở ${hits.length} đoạn, đầu tiên ${where(hits[0])}: ${hits[0].text.slice(0, 110)}`);
}

// 4. Tên riêng, mã của bản đối chứng không có trong HSMT mà vẫn có trong bản nháp: thường là chép sót từ gói cũ.
// Tên riêng đoán theo chữ hoa: từ hai tiếng viết hoa liền nhau trở lên ("Tuyên Quang"), hoặc mã viết hoa có từ ba ký tự
// hay có số ("HSYC", "M07"). Tên cơ quan ban hành văn bản dùng lại hợp lệ cũng có thể bị nêu; đọc rồi bỏ qua.
// Viết tắt kỹ thuật, pháp lý dùng chung cho mọi gói thầu: không nêu.
const COMMON_CODES = new Set(`ACID AES AI API ASR ATTT BCA BIOS BKHCN BTTTT CCTV CNTT CPU CSDL CSRF CSV CSVC DDR DNS DOCX FTP FTPS GPU HDD
  HDMI HSDT HSDX HSMT HTTP HTTPS IDE IDS IEC IEEE IPS IPV ISO JSON JWT LAN LDAP LGSP LLM MP3 MP4 NIC NVME ONNX OTP
  OWASP PCCC PDF RAID RAM RBAC REST RESTFUL RFC RPO RTO SATA SLA SMS SOAP SQL SSD SSH SSL SSO TCVN TLS UAT UEFI
  UML UPS USB UTF VNCERT VPN WAL WAN WAV WIFI WSDL XHTML XLSX XML XSL XSS`.split(/\s+/));
if (opt.sample.length) {
  const word = '\\p{Lu}[^\\s,.;:()"“”/|]*';
  const multi = new RegExp(`${word}(?:\\s+${word})+`, 'gu');
  // Mã, viết tắt là chữ Latin không dấu (HSYC, M07); chữ hoa có dấu là từ tiếng Việt trong tiêu đề, không phải mã.
  const code = /(?<![\p{L}\d])(?:[A-ZĐ]{3,}|[A-ZĐ]+\d+[A-ZĐ\d]*)(?![\p{L}\d])/gu;
  // Cụm mở bằng chữ chỉ loại cơ quan, văn bản (Bộ Khoa học…, Luật An ninh…) là tên dùng chung, không phải của gói cũ.
  const GENERIC_HEAD = /^(Bộ|Luật|Khung|Nghị|Thông|Quyết|Chính|Ủy|Cục|Sở|Văn|Tiêu|Quy)\s/u;
  const counts = new Map();
  for (const f of opt.sample) {
    for (const p of readParagraphs(f)) {
      if (/^toc/i.test(p.style)) continue;
      // Đoạn viết hoa toàn bộ (bìa, tiêu đề, quốc hiệu) thì chỉ lấy mã, không lấy cụm chữ hoa.
      const letters = p.text.replace(/[^\p{L}]/gu, '');
      const allCaps = letters.length > 0 && letters.replace(/\p{Lu}/gu, '').length / letters.length < 0.3;
      // Bỏ tiếng đầu câu, đầu ô bảng: viết hoa do đứng đầu chứ không phải tên riêng.
      const t = p.text.replace(/(^|[.!?:|]\s*)\S+/g, '$1 ');
      const hits = allCaps ? [...p.text.matchAll(code)] : [...t.matchAll(multi), ...t.matchAll(code)];
      for (const m of hits) {
        const k = m[0].trim();
        if (k.length < 3 || GENERIC_HEAD.test(k) || COMMON_CODES.has(k.toUpperCase()) || /^(QH|NĐ|TT|QĐ|CP)\d*$/.test(k)) continue;
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
    }
  }
  const draftNorm = located.map((p) => norm(p.text));
  const found = [];
  for (const [k, n] of counts) {
    const kn = norm(k);
    if (hsmtText.includes(kn)) continue;
    const idx = draftNorm.findIndex((t) => new RegExp(`(?<![\\p{L}\\d])${kn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\d])`, 'u').test(t));
    if (idx >= 0) found.push({ k, n, p: located[idx], hits: draftNorm.filter((t) => t.includes(kn)).length });
  }
  found.sort((a, b) => b.hits - a.hits);
  for (const f of found.slice(0, 40)) {
    warnings.push(`"${f.k}" có trong bản đối chứng, không có trong HSMT, bản nháp dùng ${f.hits} lần, đầu tiên ${where(f.p)}`);
  }
  if (found.length > 40) warnings.push(`Còn ${found.length - 40} tên khác cùng loại, chạy với ít tệp --sample hơn để xem.`);
  if (!opt.hsmt.length) warnings.push('Chưa đưa --hsmt nên mọi tên riêng của bản đối chứng đều bị nêu; thêm --hsmt để lọc bớt.');
}

// 5. Con số thời hạn (ngày, tháng, giờ) trong bản nháp mà HSMT không có: hoặc là cam kết mới cần BA duyệt, hoặc là số
// của gói cũ còn sót. "04 giờ" và "4 giờ" coi là một; "12 (mười hai) tháng" vẫn nhận ra.
if (opt.hsmt.length) {
  const re = /(\d+)\s*(?:\([^)]{1,30}\)\s*)?(ngày|tháng|giờ)/g;
  const inHsmt = new Set([...hsmtText.matchAll(re)].map((m) => `${Number(m[1])} ${m[2]}`));
  const seen = new Map();
  for (const p of located) {
    for (const m of norm(p.text).matchAll(re)) {
      const k = `${Number(m[1])} ${m[2]}`;
      if (!inHsmt.has(k) && !seen.has(k)) seen.set(k, p);
    }
  }
  for (const [k, p] of seen) warnings.push(`Thời hạn "${k}" không có trong HSMT, đầu tiên ${where(p)}: cam kết mới thì BA duyệt, số của gói cũ thì sửa`);
}

for (const e of errors) console.log(`LỖI  ${e}`);
for (const w of warnings) console.log(`XEM  ${w}`);
console.log(`${files[0]}: ${draft.length} đoạn, ${errors.length} lỗi, ${warnings.length} chỗ cần xem lại.`);
process.exit(errors.length ? 1 : 0);
