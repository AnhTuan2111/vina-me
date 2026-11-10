#!/usr/bin/env node
// Soát bản nháp hồ sơ dự thầu (thuyết minh đề xuất kỹ thuật, tài liệu kỹ thuật) trước khi giao cho BA.
// Dùng: node bid-check.mjs <bản nháp.docx|.md|.txt> [--hsmt <tệp>]... [--sample <tệp>]... [--tlkt <tệp>]
//                           [--tlkt-name "Tài liệu kỹ thuật"] [--term "tên cũ"]... [--catalog <catalog.pdf>]
//   --hsmt    chữ của hồ sơ mời thầu (.txt trích từ PDF, .docx); nhiều tệp thì lặp cờ
//   --sample  hồ sơ đã nộp dùng làm bản đối chứng; tìm tên riêng, mã của gói cũ còn sót trong bản nháp
//   --tlkt    tài liệu kỹ thuật mà bản nháp dẫn tới ("thuyết minh chi tiết tại mục 10.7 của Tài liệu kỹ thuật")
//   --term    chữ chắc chắn thuộc gói cũ (tên tỉnh, tên sản phẩm cũ), tìm thêm ngoài phần tự đoán
//   --catalog catalog PDF mà bảng thông số dẫn trang ("Catalog, tr. 19"): chữ trong ngoặc kép ở cùng đoạn, cùng hàng bảng
//             phải có trên đúng trang được dẫn; số trang phải có trong tệp. Số trang dẫn là số trang của tệp PDF.
// Lỗi (thoát mã 1): chỗ còn để trống, mục dẫn sang tài liệu kỹ thuật không có, chữ ở --term còn sót.
// Cần xem lại (không làm hỏng lệnh): tên riêng của bản đối chứng không có trong HSMT, con số thời hạn không có trong HSMT.
// Script chỉ bắt dấu hiệu bề mặt; đối chiếu yêu cầu với bảng truy vết vẫn phải tự đọc (references/bid/checks.md).
import { readParagraphs, isHeading } from './lib/doc-text.mjs';
import { pdfPages } from './lib/poppler.mjs';

const argv = process.argv.slice(2);
const opt = { hsmt: [], sample: [], term: [], tlkt: undefined, tlktName: 'Tài liệu kỹ thuật', catalog: [] };
const files = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--hsmt') {
    opt.hsmt.push(argv[++i]);
    // PDF đưa thẳng vào thì đọc ra rỗng và mọi so sánh với HSMT đều sai: dừng ngay.
    if (/\.pdf$/i.test(argv[i])) { console.log(`--hsmt nhận .txt, .md hay .docx; trích chữ ${argv[i]} bằng pdftotext (Poppler) trước`); process.exit(2); }
  } else if (a === '--sample') opt.sample.push(argv[++i]);
  else if (a === '--term') opt.term.push(argv[++i]);
  else if (a === '--tlkt') opt.tlkt = argv[++i];
  else if (a === '--tlkt-name') opt.tlktName = argv[++i];
  else if (a === '--catalog') opt.catalog.push(argv[++i]);
  else files.push(a);
}
if (files.length !== 1) {
  console.log('Dùng: node bid-check.mjs <bản nháp> [--hsmt <tệp>]... [--sample <tệp>]... [--tlkt <tệp>] [--term "chữ"]...');
  process.exit(1);
}

const norm = (s) => s.normalize('NFC').replace(/\s+/g, ' ').toLowerCase();
const draft = readParagraphs(files[0]);
const hsmtText = norm(opt.hsmt.map((f) => readParagraphs(f).map((p) => p.text).join('\n')).join('\n'));
// Chữ chép nguyên văn HSMT: so lỏng (bỏ dấu cách, ký hiệu ≥ ≤ hay mất khi trích PDF), chỉ lấy phần chữ trong cùng ô bảng.
const loose = (s) => norm(s).replace(/[\s≥≤<>=]/g, '');
const hsmtLoose = loose(hsmtText);
const fromHsmt = (t, start, end) => {
  if (!opt.hsmt.length) return false;
  const left = t.slice(Math.max(0, start - 20), start);
  const piece = left.slice(left.lastIndexOf('|') + 1) + t.slice(start, end);
  return loose(piece).length >= 4 && hsmtLoose.includes(loose(piece));
};
const errors = [];
const warnings = [];

// Mỗi đoạn gắn với đề mục gần nhất phía trên, để báo lỗi nói được "ở mục nào".
let section = '(đầu tài liệu)';
const located = draft.map((p) => {
  if (isHeading(p.style)) section = p.text.slice(0, 70);
  else if (/^Về việc\s/i.test(p.text)) section = `Bản cam kết ${p.text.slice(0, 60)}`;
  return { ...p, section };
});
const where = (p) => `[${p.section}]`;
const snippet = (text, idx, len) => {
  const a = Math.max(0, idx - 30);
  return `${a > 0 ? '...' : ''}${text.slice(a, idx + len + 30)}${idx + len + 30 < text.length ? '...' : ''}`;
};

// 1. Chỗ còn để trống, đánh dấu chờ xác nhận.
const PLACEHOLDER = /\[(?:cần|chờ|chưa|bổ sung|điền|xác nhận|TODO)[^\]]*\]|\bTODO\b|\bxxx+\b|\?\?\?+|\.{4,}|…{2,}|<[^<>]{1,30}>/gi;
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
  const GENERIC_HEAD = /^(Bộ|Luật|Khung|Nghị|Thông|Quyết|Chính|Ủy|Cục|Sở|Văn|Tiêu|Quy|ĐẠI DIỆN|CỘNG HÒA|OWASP)\s/u;
  // Chữ in sẵn của bản cam kết do bid-docx dựng (quốc hiệu, khối ký): có trong mọi hồ sơ, không phải của gói cũ.
  const FIXED = ['ĐẠI DIỆN HỢP PHÁP CỦA NHÀ THẦU', 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', 'Độc lập - Tự do - Hạnh phúc'];
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
        if (k.length < 3 || GENERIC_HEAD.test(k) || FIXED.some((x) => x.includes(k)) || COMMON_CODES.has(k.toUpperCase()) || /^(QH|NĐ|TT|QĐ|CP)\d*$/.test(k)) continue;
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
  // Số đứng riêng, không dính chữ hay số khác: "A08 tháng 8/2026" là mã bản tài liệu và ngày, không phải thời hạn.
  const re = /(?<![\p{L}\d.,/])(\d+)\s*(?:\([^)]{1,30}\)\s*)?(ngày|tháng|giờ)(?![\p{L}\d]|\s*\/\s*\d)/gu;
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

// 6. Chữ gán cho catalog phải có trên trang được dẫn. Câu "Catalog ghi "Tower"" mà trang dẫn không có chữ Tower là
// gán cho hãng điều hãng không viết; tổ chuyên gia mở catalog ra là thấy.
if (opt.catalog.length) {
  const cat = opt.catalog.flatMap((f) => { const ps = pdfPages(f); return ps.at(-1)?.trim() ? ps : ps.slice(0, -1); });
  const flat = (s) => norm(s).replace(/[\u2010-\u2015-]/g, '-').replace(/\s*-\s*/g, '-');
  const pageRef = /\b(?:tr(?:ang)?\.?)\s*(\d+(?:\s*(?:,|;|-|đến|tới|và)\s*\d+)*)/gi;
  let refs = 0;
  for (const p of located) {
    if (!/catalog|tài liệu hãng|tài liệu kỹ thuật của hãng/i.test(p.text)) continue;
    const pagesCited = new Set();
    for (const m of p.text.matchAll(pageRef)) {
      const parts = m[1].split(/\s*(?:,|;|và)\s*/);
      for (const part of parts) {
        const r = part.match(/^(\d+)\s*(?:-|đến|tới)\s*(\d+)$/);
        if (r) for (let k = Number(r[1]); k <= Number(r[2]); k++) pagesCited.add(k);
        else if (/^\d+$/.test(part)) pagesCited.add(Number(part));
      }
    }
    if (!pagesCited.size) continue;
    refs++;
    for (const n of pagesCited) if (n < 1 || n > cat.length) errors.push(`Dẫn catalog trang ${n} nhưng catalog chỉ có ${cat.length} trang ${where(p)}`);
    const text = flat([...pagesCited].map((n) => cat[n - 1] ?? '').join(' '));
    // Ngoặc kép đứng sau chữ số là ký hiệu inch (3.5"/2.5"), không phải chữ trích.
    for (const q of p.text.matchAll(/(?<![\d.])["“]([A-Za-z][^"”]{2,79})["”]/g)) {
      // Chỉ soát chữ Latin (chữ trích của catalog tiếng Anh); chữ tiếng Việt trong ngoặc là lời của hồ sơ.
      if (/[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệịỉĩọỏốồổỗộớờởỡợụủứừửữựỳỷỹỵ]/i.test(q[1])) continue;
      if (!text.includes(flat(q[1]))) errors.push(`Chữ "${q[1]}" gán cho catalog không có trên trang ${[...pagesCited].join(', ')} ${where(p)}`);
    }
    // Tên chứng nhận, tiêu chuẩn ở cột yêu cầu ("80 Plus Platinum", "Energy Star") phải có nguyên tên trên trang dẫn:
    // catalog chỉ ghi "Platinum" thì chưa chứng minh được "80 Plus".
    const cells = p.style === 'table' ? p.text.split(' | ') : [];
    // Con số kèm đơn vị đo trong chữ đáp ứng ("PDU 16 A", "1500 W") phải có trên trang dẫn; không có là dẫn nhầm trang
    // hay con số không phải của catalog.
    {
      const said = cells.length >= 4 ? cells[2] : p.text;
      const dotted = text.replace(/(\d),(\d)/g, '$1.$2');
      for (const m of said.matchAll(/(?<![\d.,])(\d+(?:[.,]\d+)?)\s?(GB|TB|MB|GHz|MHz|W|A|V|mm|kg|Gbps|GbE|MT\/s)(?![A-Za-z])/g)) {
        // Cùng số (4,80 = 4.80 = 4.8) đứng riêng, ngay trước đúng đơn vị; "16 A" không khớp nhầm vào "116 a" hay "16 amp".
        // "1.500 W" là một nghìn năm trăm (dấu chấm nghìn kiểu Việt), "4,80 GHz" là số thập phân.
        const raw = /^\d{1,3}(?:\.\d{3})+$/.test(m[1]) ? m[1].replace(/\./g, '') : m[1];
        const [int, dec = ''] = raw.replace(',', '.').split('.');
        const num = dec.replace(/0+$/, '') ? `${int}\\.${dec.replace(/0+$/, '')}0*` : `${int}(?:\\.0+)?`;
        const unit = m[2].toLowerCase().replace('/', '\\/');
        // Dải "2.60 GHz to 4.80": đơn vị đứng trước số cuối của dải.
        if (!new RegExp(`(?<![\\d.])${num}\\s?${unit}(?![a-z])|${unit}\\s*(?:to|-)\\s*${num}(?![\\d])`).test(dotted)) { warnings.push(`Số "${m[0]}" không có trên trang catalog ${[...pagesCited].join(', ')} ${where(p)}: kiểm lại trang dẫn, hoặc ghi rõ đó là cấu hình chào tính ra`); break; }
      }
    }
    if (cells.length >= 4 && !/\[(?:cần|chưa|chờ)/i.test(p.text)) {
      const cert = /80\s*plus|energy\s*star|epeat|tüv|tco\s*certified|iso\s*\d{4,5}|iec\s*\d{4,5}|fips\s*\d+|tpm\s*\d(?:\.\d)?|mil-std-\d+|\bip\d{2}\b/gi;
      for (const m of cells[1].matchAll(cert)) {
        if (!text.includes(flat(m[0]))) errors.push(`Yêu cầu "${m[0]}" không có trên trang catalog ${[...pagesCited].join(', ')} mà hàng không đánh dấu ${where(p)}: ghi điều catalog có và [chưa có chứng minh: ${m[0]}]`);
      }
    }
  }
  console.log(`Chỗ dẫn trang catalog: ${refs} đoạn, hàng bảng; catalog ${cat.length} trang.`);
}

// 7. Cam kết mới do nhà thầu tự đặt: tần suất, số buổi, số lần mà HSMT không có. BA phải duyệt trước khi ký.
{
  const freq = /(?:hằng|hàng|định kỳ)\s+(?:ngày|tuần|tháng|quý|năm)|(?<![\p{L}\d.,/])\d+\s*(?:\([^)]{1,30}\)\s*)?(?:buổi|lần|ca|lượt)(?![\p{L}])/giu;
  const seen = new Map();
  // Cam kết đã đánh dấu ở một chỗ (lần nhắc đầu) thì các lần nhắc lại không phải đánh dấu nữa.
  const marked = new Set();
  for (const p of located) {
    if (!/\[(?:cần|chưa|chờ)/i.test(p.text)) continue;
    for (const m of norm(p.text).matchAll(freq)) marked.add(m[0].replace(/\s+/g, ' '));
  }
  for (const p of located) {
    if (/\[(?:cần|chưa|chờ)/i.test(p.text)) continue;
    for (const m of norm(p.text).matchAll(freq)) {
      const k = m[0].replace(/\s+/g, ' ');
      if (marked.has(k)) continue;
      if (opt.hsmt.length && hsmtText.includes(k)) continue;
      if (!seen.has(k)) seen.set(k, p);
    }
  }
  for (const [k, p] of seen) warnings.push(`Cam kết "${k}" không có trong HSMT và không đánh dấu ${where(p)}: đánh dấu [cần xác nhận] và đưa vào danh sách báo lại`);
}

// 8. Hàng bảng lấy bản cam kết của chính nhà thầu làm chứng minh cho thông số hàng hóa: với thiết bị, chứng minh phải là
// tài liệu của hãng; chỉ có cam kết của nhà thầu thì đánh dấu.
for (const p of located) {
  if (p.style !== 'table') continue;
  const cells = p.text.split(' | ');
  if (cells.length < 3) continue;
  const ref = cells.at(-1);
  // Chỉ hàng thông số thiết bị (yêu cầu có ≥ ≤ hay số kèm đơn vị); dịch vụ, phần mềm thì cam kết của nhà thầu là chứng minh.
  if (!/[≥≤]|\d\s*(?:gb|tb|ghz|w|inch|tháng)(?![\p{L}])/iu.test(cells[1] ?? '')) continue;
  if (/cam kết|phần d\b|mục d\.\d/i.test(ref) && !/tr(?:ang)?\.?\s*\d/i.test(ref) && !/\[(?:cần|chưa|chờ)/i.test(p.text)) {
    warnings.push(`Hàng bảng chỉ dẫn cam kết của nhà thầu làm chứng minh ${where(p)}: "${p.text.slice(0, 90)}"; là thông số thiết bị thì cần tài liệu hãng hoặc đánh dấu`);
  }
}

// 9. Mốc tính ngày 1 của tiến độ: một mốc suốt hồ sơ.
{
  const all = norm(located.map((p) => p.text).join(' '));
  const a = /ngày 1 là ngày ký hợp đồng|kể từ ngày ký hợp đồng|tính từ ngày ký hợp đồng/.test(all);
  const b = /ngày 1 là ngày hợp đồng có hiệu lực|kể từ ngày hợp đồng có hiệu lực|tính từ ngày hợp đồng có hiệu lực/.test(all);
  if (a && b) warnings.push('Hồ sơ dùng cả hai mốc "ngày ký hợp đồng" và "ngày hợp đồng có hiệu lực" để tính thời gian: chọn một mốc theo HSMT');
}

// 10. Câu vừa nói tài liệu chưa ghi một thông số vừa ghi "đáp ứng" mà không đánh dấu: tự mâu thuẫn, người chấm bắt ngay
// (bảng kê sai khác ghi "Đáp ứng theo cấu hình đặt hàng" cho thông số mà bảng trên đã ghi chưa có chứng minh).
for (const p of located) {
  const t = norm(p.text);
  if (/chưa ghi|không ghi|chưa có (?:tài liệu|chứng minh)|catalog không/.test(t) && /(?<!không |chưa )đáp ứng/.test(t) && !/\[(?:cần|chưa|chờ)/i.test(p.text)) {
    errors.push(`Vừa nói tài liệu chưa ghi vừa ghi "đáp ứng", không đánh dấu ${where(p)}: "${p.text.slice(0, 110)}"`);
  }
}

// 11. Ô đáp ứng chép lại mức yêu cầu (≥, ≤) thay vì con số của hàng chào: catalog có tùy chọn thì chào đúng tùy chọn đó.
for (const p of located) {
  if (p.style !== 'table') continue;
  const cells = p.text.split(' | ');
  // Ô chép nguyên văn chữ HSMT (hàng chỉ có yêu cầu, bảng kê sai khác) thì không nêu.
  if (cells.length >= 4 && /[≥≤]/.test(cells[2]) && !(opt.hsmt.length && hsmtLoose.includes(loose(cells[2])))) {
    warnings.push(`Ô đáp ứng ghi mức "≥/≤" thay vì con số chào ${where(p)}: "${cells[2].slice(0, 80)}"; catalog có tùy chọn đạt mức thì ghi đúng tùy chọn và trang`);
  }
}

// 12. Văn bản pháp luật đã bị thay thế: hồ sơ mẫu có câu "<văn bản mới> ... thay thế <văn bản cũ>"; bản nháp dẫn văn bản cũ
// mà không nhắc văn bản mới, không đánh dấu, là dẫn văn bản hết hiệu lực.
if (opt.sample.length) {
  const num = /\d+\/\d{4}\/[\p{Lu}\d-]+/gu;
  const pairs = [];
  for (const f of opt.sample) {
    // Hai cách viết trong hồ sơ mẫu: "A thay thế B" (văn bản mới đứng trước); "theo B (Nhà thầu đề xuất áp dụng A là văn bản
    // đang có hiệu lực thay thế)" (sau "thay thế" không còn số hiệu, văn bản cũ là số đứng ngay trước "đề xuất áp dụng").
    for (const p of readParagraphs(f)) {
      const t = p.text;
      for (const m of t.matchAll(/thay thế/gi)) {
        const tail = t.slice(m.index, m.index + 90).split(/[;.](?:\s|$)/)[0];
        const older = tail.match(num)?.[0];
        if (older) {
          const head = t.slice(0, m.index).split(/;|\.\s|áp dụng/).at(-1);
          // "áp dụng A ..., quy định chi tiết Luật X, là văn bản đang có hiệu lực thay thế B": A là số đầu tiên; "A thay thế B"
          // không có "là văn bản": A là số đứng sát "thay thế".
          const nums = [...head.matchAll(num)].map((x) => x[0]);
          const newer = /là văn bản/.test(head) ? nums[0] : nums.at(-1);
          if (newer) pairs.push({ newer, older });
          continue;
        }
        const k = t.lastIndexOf('đề xuất áp dụng', m.index);
        if (k < 0) continue;
        const newer = t.slice(k, m.index).match(num)?.[0];
        const prev = [...t.slice(0, k).matchAll(num)].at(-1)?.[0];
        if (newer && prev) pairs.push({ newer, older: prev });
      }
    }
  }
  const all = located.map((p) => p.text).join('\n');
  for (const { newer, older } of pairs) {
    if (!all.includes(older) || all.includes(newer)) continue;
    const p = located.find((x) => x.text.includes(older));
    if (/\[(?:cần|chưa|chờ)/i.test(p.text)) continue;
    errors.push(`Dẫn ${older} mà hồ sơ mẫu ghi đã được ${newer} thay thế ${where(p)}: dẫn văn bản đang có hiệu lực kèm câu thay thế, hoặc đánh dấu [cần xác nhận: hiệu lực]`);
  }
}

// 13. Một thời hạn lúc kèm chữ lúc không ("12 (mười hai) tháng" và "12 tháng"); số đếm dưới 10 thiếu số 0 ("8 thanh").
{
  const withWords = new Set();
  const plain = new Map();
  const dur = /(?<![\p{L}\d.,/])(\d+)\s*(\([^)]{1,30}\))?\s*(ngày|tháng|giờ)(?![\p{L}\d])/gu;
  for (const p of located) {
    if (p.style === 'table' && /^\d+(\.\d+)? \| /.test(p.text) && /\| \d \| \d/.test(p.text)) continue;
    // Chữ trong chỗ đánh dấu là lời nhắn cho BA, không phải chữ của hồ sơ.
    const t = norm(p.text.replace(/\[[^\]]*\]/g, ''));
    for (const m of t.matchAll(dur)) {
      const k = `${Number(m[1])} ${m[3]}`;
      // Chữ chép nguyên văn HSMT ("Bảo hành: ≥ 36 tháng") giữ như HSMT viết.
      if (!m[2] && fromHsmt(t, m.index, m.index + m[0].length)) continue;
      if (m[2]) withWords.add(k); else if (!plain.has(k)) plain.set(k, p);
    }
  }
  for (const [k, p] of plain) if (withWords.has(k)) warnings.push(`"${k}" có chỗ kèm chữ, có chỗ không, đầu tiên ${where(p)}: thời hạn quan trọng kèm chữ ở mọi lần nhắc, kể cả bản cam kết`);
  const count = /(?<![\p{L}\d.,/:×x-])([1-9])\s+(thanh|ổ|bộ|chiếc|lớp|buổi|cổng|khe|khoang|người|bản|gói|máy|lần|ngày|giờ|tháng)(?![\p{L}])/gu;
  const seen = new Set();
  for (const p of located) {
    for (const m of p.text.matchAll(count)) {
      const k = `${m[1]} ${m[2]}`;
      if (seen.has(k)) continue;
      // Chữ chép nguyên văn HSMT ("Tối thiểu 8 khe DIMM") giữ như HSMT viết, không bắt thêm số 0.
      if (fromHsmt(p.text, m.index, m.index + m[0].length)) continue;
      seen.add(k);
      warnings.push(`Số đếm "${k}" thiếu số 0 đầu ("0${k}") ${where(p)}`);
    }
  }
}

// 15. Mốc bắt đầu bảo hành tự đặt ("bảo hành ... tính từ ngày nghiệm thu") mà HSMT không nêu; tên phần mềm kèm số phiên bản
// ("Ubuntu 24.04 LTS") mà HSMT, BA, catalog không có: lựa chọn của nhà thầu, phải đánh dấu.
{
  const seenStart = new Set();
  const seenVer = new Set();
  const catText = opt.catalog.length ? norm(opt.catalog.flatMap((f) => pdfPages(f)).join(' ')) : '';
  for (const p of located) {
    if (/\[(?:cần|chưa|chờ)/i.test(p.text)) continue;
    const t = norm(p.text);
    if (/bảo hành|bảo trì/.test(t)) {
      for (const m of t.matchAll(/(?:tính|kể)\s+từ\s+(?:ngày\s+)?[\p{L} ,]{3,50}?(?=[.;,)|]|$)/gu)) {
        const k = m[0].trim();
        if (seenStart.has(k) || (opt.hsmt.length && hsmtLoose.includes(loose(k)))) continue;
        seenStart.add(k);
        warnings.push(`Mốc "${k}" của bảo hành, bảo trì không có trong HSMT và không đánh dấu ${where(p)}: cam kết mới thì đánh dấu [cần xác nhận]`);
      }
    }
    // Tên viết hoa chữ đầu, có chữ thường ("Ubuntu", không phải mã mục "CDNT 15.9"); so cả hai tiếng cuối ("Opal 2.0") vì
    // catalog hay ngắt dòng giữa tên dài.
    for (const m of p.text.matchAll(/\b[A-Z][a-z][A-Za-z]+(?:\s[A-Z][A-Za-z]+)?\s\d{1,2}(?:\.\d{1,2})+(?:\s?LTS)?\b/g)) {
      const k = m[0];
      const tail = k.replace(/\s?LTS$/, '').split(/\s+/).slice(-2).join(' ');
      if (seenVer.has(k) || (opt.hsmt.length && (hsmtLoose.includes(loose(k)) || hsmtLoose.includes(loose(tail)))) || catText.includes(norm(k)) || catText.includes(norm(tail))) continue;
      seenVer.add(k);
      warnings.push(`Phần mềm "${k}" không có trong HSMT, tệp trả lời của BA hay catalog, và không đánh dấu ${where(p)}: lựa chọn của nhà thầu thì đánh dấu [cần xác nhận: công nghệ cụ thể]`);
    }
  }
}

// 16. Lời nói với BA lọt vào thân hồ sơ (ngoài chỗ đánh dấu): người chấm đọc thấy hồ sơ chưa xong.
{
  // "BA" phân biệt hoa thường ("ba mươi sáu" là số).
  const talk = /(?<![\p{L}])BA(?![\p{L}])|trước khi nộp|để hoàn thiện hồ sơ|[Tt]heo nhận định của [Nn]hà thầu/u;
  for (const p of located) {
    const outside = p.text.replace(/\[[^\]]*\]/g, '');
    const m = outside.match(talk);
    if (m) errors.push(`Lời nói với BA trong thân hồ sơ ("${m[0]}") ${where(p)}: "${p.text.slice(0, 100)}"; đưa vào chỗ đánh dấu hoặc báo cáo`);
  }
  // Chi tiết công nghệ, an toàn thông tin cụ thể (RESTful, TLS 1.2, băm mật khẩu, OWASP) mà HSMT, BA không nêu: đề xuất của
  // nhà thầu, phải có chỗ đánh dấu trong cùng mục (đánh dấu một lần ở đầu mục là đủ).
  const tech = /\b(?:RESTful|REST API|JSON|XML|TLS\s*v?\d(?:\.\d)?|SSL|HTTPS?(?:\s*v?\d(?:\.\d)?)?|OAuth\s*\d?(?:\.\d)?|JWT|OWASP(?: Top 10)?|bcrypt|SHA-?\d+|AES-?\d+|WebSocket|gRPC|Docker|Kubernetes|Redis|Kafka|Nginx)\b|dạng băm|khóa tài khoản khi đăng nhập sai|hiển thị dần|thiết bị (?:dự phòng|cùng loại)|cho (?:Chủ đầu tư )?mượn/gi;
  // Phạm vi đánh dấu theo cây đề mục: chỗ đánh dấu ở mục cha (A.IV.3) phủ cả mục con (3.1, 3.2). Cấp đề mục: phần lớn 0, tài
  // liệu con 1, heading N là N + 1.
  const level = (s) => (/^mucchinh/i.test(s) ? 0 : /^muc/i.test(s) ? 1 : Number(s.match(/heading (\d)/i)?.[1] ?? 9) + 1);
  const stack = [];
  const scopes = located.map((p) => {
    if (isHeading(p.style)) {
      const lv = level(p.style);
      while (stack.length && stack.at(-1).lv >= lv) stack.pop();
      stack.push({ lv, id: Symbol(p.text) });
    }
    return stack.map((x) => x.id);
  });
  const markedIds = new Set(located.flatMap((p, i) => (/\[(?:cần|chưa|chờ)/i.test(p.text) && scopes[i].length ? [scopes[i].at(-1)] : [])));
  const seenTech = new Set();
  for (const [i, p] of located.entries()) {
    if (scopes[i].some((id) => markedIds.has(id))) continue;
    for (const m of p.text.replace(/\[[^\]]*\]/g, '').matchAll(tech)) {
      const k = m[0];
      if (seenTech.has(k.toLowerCase()) || (opt.hsmt.length && hsmtLoose.includes(loose(k)))) continue;
      seenTech.add(k.toLowerCase());
      warnings.push(`Chi tiết kỹ thuật "${k}" không có trong HSMT, tệp trả lời của BA, mục không có chỗ đánh dấu ${where(p)}: đề xuất của nhà thầu thì đánh dấu [cần xác nhận: đề xuất của nhà thầu] ở đầu mục`);
    }
  }
  // Mục lục còn chữ giữ chỗ của bid-docx: tệp Word chưa được Word cập nhật trường.
  if (draft.some((p) => p.text.startsWith('Mục lục chưa dựng'))) errors.push('Tệp Word còn chữ giữ chỗ của mục lục: chạy render-pdf.ps1 -UpdateDocx HSDX.docx để Word dựng mục lục vào chính tệp');
}

// 14. Phần lớn (A., B., ...) nào cũng kết bằng câu cam kết của nhà thầu, như hồ sơ mẫu ("Nhà thầu cam kết ... nêu trên.").
{
  let cur = null;
  const parts = [];
  for (const p of located) {
    if (isHeading(p.style) && /^[A-H]\.\s+\S/.test(p.text)) { cur = { name: p.text.slice(0, 60), ok: false }; parts.push(cur); continue; }
    if (/^Về việc\s/i.test(p.text)) cur = null;
    if (cur && /^(?:Nhà thầu|Công ty\b[^.]{0,80}?)\s+cam kết/i.test(p.text.trim())) cur.ok = true;
  }
  for (const pt of parts) if (!pt.ok) warnings.push(`Phần "${pt.name}" không có câu kết "Nhà thầu cam kết ...": thêm một câu cam kết ở cuối phần`);
}

// Đếm chỗ đánh dấu theo mục, để danh sách báo lại BA khớp số chỗ trong tệp.
{
  const by = new Map();
  for (const p of located) {
    const n = [...p.text.matchAll(PLACEHOLDER)].length;
    if (n) by.set(p.section, (by.get(p.section) ?? 0) + n);
  }
  for (const [k, n] of by) console.log(`ĐẾM  ${n} chỗ đánh dấu ở [${k}]`);
}

for (const e of errors) console.log(`LỖI  ${e}`);
for (const w of warnings) console.log(`XEM  ${w}`);
console.log(`${files[0]}: ${draft.length} đoạn, ${errors.length} lỗi, ${warnings.length} chỗ cần xem lại.`);
process.exit(errors.length ? 1 : 0);
