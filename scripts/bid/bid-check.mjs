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
import fs from 'node:fs';
import { pdfPages, pdfBlocks } from './lib/poppler.mjs';
import { pagesAfter } from './lib/page-refs.mjs';

const argv = process.argv.slice(2);
const opt = { hsmt: [], sample: [], term: [], tlkt: undefined, tlktName: 'Tài liệu kỹ thuật', catalog: [], highlight: [], ba: [] };
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
  // --package <thư mục bộ tệp> [--marks <thư mục marks>]: tự lấy mọi tài liệu hãng "KT-02A ....pdf" làm --catalog, và
  // marks-<mã>.json trong thư mục marks làm --highlight, để không sót tài liệu nào (s4j bỏ sót KT-03G khi tự kê).
  else if (a === '--package') opt.package = argv[++i];
  else if (a === '--marks') opt.marksDir = argv[++i];
  else if (a === '--highlight') opt.highlight.push(argv[++i]);
  else if (a === '--also') (opt.also ??= []).push(argv[++i]);
  else if (a === '--seen') opt.seen = argv[++i];
  else if (a === '--ba') { opt.ba.push(argv[++i]); opt.hsmt.push(argv[i]); }
  else files.push(a);
}
if (opt.package) {
  for (const f of fs.readdirSync(opt.package).sort()) {
    const m = f.match(/^(KT-\d{2}[A-Z])\s.*\.pdf$/i);
    if (!m || opt.catalog.some((c) => c.startsWith(`${m[1]}=`))) continue;
    opt.catalog.push(`${m[1]}=${opt.package}/${f}`);
    const mk = opt.marksDir && [`${opt.marksDir}/marks-${m[1]}.json`].find((x) => fs.existsSync(x));
    if (mk && !opt.highlight.some((h) => h.startsWith(`${m[1]}=`))) opt.highlight.push(`${m[1]}=${mk}`);
  }
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
  // Cắt ở ranh ô bảng hay sau tiền tố "Hạng mục 1, dòng 19:" để chỉ so phần chép nguyên HSMT.
  const piece = left.slice(Math.max(left.lastIndexOf('|'), left.lastIndexOf(':')) + 1) + t.slice(start, end);
  return loose(piece).length >= 4 && hsmtLoose.includes(loose(piece));
};
const errors = [];
const warnings = [];

// Mỗi đoạn gắn với đề mục gần nhất phía trên, để báo lỗi nói được "ở mục nào".
let section = '(đầu tài liệu)';
// Bản dịch tài liệu hãng có cột "Bản gốc": chữ trong cột đó chép nguyên tài liệu hãng (số thập phân dấu chấm, số không có số
// 0 đầu), không phải lời của nhà thầu, nên để trống cột đó khi soát; giữ cột "Bản dịch".
let origCol = -1;
const located = draft.map((p) => {
  if (isHeading(p.style)) section = p.text.slice(0, 70);
  else if (/^Về việc\s/i.test(p.text)) section = `Bản cam kết ${p.text.slice(0, 60)}`;
  if (p.style !== 'table') { origCol = -1; return { ...p, section }; }
  const cells = p.text.split(' | ');
  const head = cells.findIndex((c) => /^bản gốc\b/i.test(c.trim()));
  if (head >= 0) { origCol = head; return { ...p, section }; }
  if (origCol >= 0 && origCol < cells.length) {
    const kept = cells.map((c, i) => (i === origCol ? '' : c));
    // Cả hàng bản dịch là chữ của hãng (bản gốc và lời dịch nguyên văn): không soát như lời nhà thầu (tên phần mềm kèm phiên
    // bản, thời hạn, cam kết, tên riêng); chỉ giữ để so số giữa hai cột (mục 6e).
    return { ...p, text: '', original: p.text, translated: kept.join(' | '), section };
  }
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
  // Dẫn bằng mã tài liệu của bộ hồ sơ (--tlkt-name KT-04): "KT-04, mục 3.2", "KT-04 mục 3.2 và 3.3".
  const refCode = new RegExp(`${name},?\\s*mục\\s+(\\d+(?:\\.\\d+)*(?:\\s*(?:,|và|đến|tới)\\s*(?:mục\\s+)?\\d+(?:\\.\\d+)*)*)`, 'gi');
  let count = 0;
  for (const p of located) {
    for (const m of [...p.text.matchAll(ref), ...p.text.matchAll(refCode)]) {
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
  // "--catalog KT-02A=dell.pdf": tài liệu có mã, chỗ dẫn viết "KT-02A, tr. 15". Không có mã thì như cũ: một catalog, chỗ
  // dẫn là đoạn có chữ "Catalog" kèm "tr. N".
  const cats = opt.catalog.map((c) => {
    const m = c.match(/^([^=]{1,40})=(.+)$/);
    const file = m ? m[2] : c;
    const ps = pdfPages(file);
    return { label: m ? m[1] : null, file, pages: ps.at(-1)?.trim() ? ps : ps.slice(0, -1) };
  });
  const labelled = cats.every((c) => c.label);
  // Hàng còn "[chưa có chứng minh: ...]" mà một tài liệu hãng có trong tay lại ghi đúng thông số đó (Samsung ghi "Armor
  // Aluminum" ở trang khác trang đã dẫn): dò từ khóa hai thứ tiếng trên mọi trang của mọi tài liệu hãng trước khi để dấu.
  const KW = [
    [/nhôm/i, ['nhôm', 'aluminum', 'aluminium']],
    [/80\s*plus/i, ['80 plus', '80plus']],
    [/24\s*\/\s*7|liên tục/i, ['24/7', '24x7', '24 x 7']],
    [/\becc\b/i, ['ecc']],
    [/từ xa/i, ['remote management', 'vpro', 'idrac', 'intel amt', 'out-of-band']],
    [/tản nhiệt/i, ['thermal', 'cooling', 'tản nhiệt']],
    [/chống nước|chống bụi|\bip\d/i, ['ip68', 'ip67', 'water resistant', 'chống nước']],
  ];
  for (const p of located) {
    if (p.style !== 'table') continue;
    for (const mk of p.text.matchAll(/\[chưa có chứng minh:\s*([^\]]+)\]/gi)) {
      const terms = KW.filter(([re]) => re.test(mk[1])).flatMap(([, t]) => t);
      if (!terms.length) continue;
      const found = [];
      for (const c of cats) c.pages.forEach((t, i) => {
        const low = t.toLowerCase().replace(/\s+/g, ' ');
        const hit = terms.find((w) => new RegExp(`(?<![\\p{L}\\d])${w.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}(?![\\p{L}\\d])`, 'iu').test(low));
        if (hit && found.length < 3) found.push(`${c.label ?? 'catalog'} tr. ${i + 1} có "${hit}"`);
      });
      if (found.length) warnings.push(`Dấu "${mk[0].slice(0, 50)}" nhưng ${found.join('; ')} ${where(p)}: đọc các trang đó trước khi để dấu, có chứng minh thì trích và tô`);
    }
  }
  // K\u00fd hi\u1ec7u nh\u00e3n hi\u1ec7u ("OpenCL\u21221.2") kh\u00f4ng t\u00ednh khi so ch\u1eef tr\u00edch v\u1edbi trang t\u00e0i li\u1ec7u h\u00e3ng.
  const flat = (s) => norm(s).replace(/[\u2122\u00ae\u00a9]/g, ' ').replace(/\s+/g, ' ').replace(/[\u2010-\u2015-]/g, '-').replace(/\s*-\s*/g, '-');
  // Một ô dẫn nhiều trang của cùng tài liệu: "tr. 19, 30", "tr. 19 (bảng 9, bảng 10); tr. 30 (bảng 25)": lib/page-refs.mjs.
  const unmark = (s) => s.replace(/\[(?:cần|chưa|chờ|bổ sung|xác nhận)[^\]]*\]/gi, ' ');
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let refs = 0;
  // Trang đã tô vàng theo từng tài liệu (--highlight KT-02A=marks.json): trang nào được dẫn trong bảng cũng phải có chỗ tô vàng.
  const marked = new Map(opt.highlight.map((h) => {
    const [label, f] = h.split('=');
    let ms = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (!Array.isArray(ms)) ms = ms.marks;
    return [label, Object.assign(new Set(ms.map((x) => x.page)), { marks: ms })];
  }));
  const usedMarks = new Set();
  const docCited = new Set(); // "KT-02A|19": trang tệp này dẫn; chỗ tô ở trang chỉ tệp khác dẫn (thuyết minh) không xét ở đây
  for (const p of located) {
    const cited = [];
    if (labelled) {
      for (const c of cats) {
        const set = new Set();
        for (const m of p.text.matchAll(new RegExp(esc(c.label) + String.raw`(?![\w-])`, 'gi'))) pagesAfter(p.text.slice(m.index + m[0].length))?.pages.forEach((n) => set.add(n));
        if (set.size) cited.push([c, set]);
      }
    } else {
      if (!/catalog|tài liệu hãng|tài liệu kỹ thuật của hãng/i.test(p.text)) continue;
      const set = new Set();
      for (const m of p.text.matchAll(/\btr(?:ang)?\.?\s*(?=\d)/gi)) pagesAfter(p.text.slice(m.index))?.pages.forEach((n) => set.add(n));
      if (set.size) cited.push([cats.length === 1 ? cats[0] : { label: null, pages: cats.flatMap((c) => c.pages) }, set]);
    }
    if (!cited.length) continue;
    refs++;
    const pagesCited = new Set(cited.flatMap(([c, s]) => [...s].map((n) => (c.label ? `${c.label} tr. ${n}` : n))));
    for (const [c, set] of cited) {
      for (const n of set) {
        if (c.label && p.style === 'table') docCited.add(`${c.label}|${n}`);
        if (n < 1 || n > c.pages.length) errors.push(`Dẫn ${c.label ?? 'catalog'} trang ${n} nhưng tài liệu chỉ có ${c.pages.length} trang ${where(p)}`);
        else if (c.label && marked.has(c.label) && !marked.get(c.label).has(n) && p.style === 'table') errors.push(`Dẫn ${c.label} trang ${n} nhưng trang đó chưa tô vàng thông số (marks của ${c.label}) ${where(p)}`);
      }
    }
    // Chữ theo dòng của -layout cộng chữ theo khối của -bbox-layout: ô bảng xuống dòng ("3.20 GHz to" / "4.80 GHz") bị -layout
    // xen chữ của cột bên cạnh vào giữa, khối thì giữ trọn ô.
    const text = flat(cited.flatMap(([c, set]) => [...set].map((n) => {
      if (!c.blocks) c.blocks = pdfBlocks(c.file);
      return `${c.pages[n - 1] ?? ''} ${(c.blocks[n - 1] ?? []).join(' ')}`;
    })).join(' '));
    // Chữ trích trong ô đáp ứng ("KT-03A ghi "12 GB"") phải nằm trong một chỗ tô vàng của đúng tài liệu, đúng trang được dẫn:
    // người chấm lật trang ra là thấy ngay chữ đó được tô; tô chữ bên cạnh (tên trường, đơn vị) mà bỏ con số là không đạt.
    if (p.style === 'table' && labelled) {
      const cellsQ = p.text.split(' | ');
      // Chữ trong dấu đánh dấu ("[chưa có chứng minh: chữ "zoom kỹ thuật số" ...]") là lời nhắn cho BA, không phải chữ trích.
      const resp = cellsQ.length >= 4 ? unmark(cellsQ[2]) : '';
      // Hàng dẫn trang mà không trích chữ (bảng mã, hàng dịch vụ): chỗ tô trên trang đó coi như đã có chỗ dùng.
      if (!/["“]/.test(resp)) {
        for (const [c, set] of cited) if (marked.has(c.label)) for (const m of marked.get(c.label).marks) if (set.has(m.page)) usedMarks.add(`${c.label}|${m.page}|${m.text}`);
      }
      const tf = (x) => x.normalize('NFC').toLowerCase().replace(/[™®©]/g, ' ').replace(/[‐-―]/g, '-').replace(/\s+/g, ' ').trim();
      // Nhãn trong ngoặc, giá trị ngoài ngoặc (KT-03A ghi "Bộ nhớ đệm (GB)" là 12): giá trị mới là thông số, phải trích và tô.
      for (const m of resp.matchAll(/["”]\s*(?:là|:)\s*(\d+(?:[.,]\d+)*|có|không)(?![\p{L}\d])/giu)) {
        if (cited.some(([c]) => marked.has(c.label))) errors.push(`Giá trị "${m[1]}" đứng ngoài ngoặc kép sau nhãn ${where(p)}: trích cả giá trị trong ngoặc (KT-03A ghi "Bộ nhớ đệm (GB)": "12") và tô cả nhãn lẫn giá trị`);
      }
      // Ngoặc thẳng đóng bằng ngoặc thẳng, ngoặc cong đóng bằng ngoặc cong: ký hiệu inch ” trong chữ trích không cắt chữ trích.
      for (const q of [...resp.matchAll(/(?<![\d.])"([^"]{1,120})"|“([^”]{1,120})”/g)].map((m) => Object.assign([m[0], m[1] ?? m[2]], { index: m.index }))) {
        const owners = cited.filter(([c]) => marked.has(c.label));
        if (!owners.length) continue;
        const qq = tf(q[1]);
        // Chữ trích chỉ có số và đơn vị ("13.0 MP") không cho biết thuộc trường nào (camera trước hay sau): trích kèm nhãn.
        if (/^[\d.,x×\s]+[a-z%]{0,4}$/i.test(q[1].trim()) && !/["”]\s*:\s*$/.test(resp.slice(Math.max(0, q.index - 6), q.index))) warnings.push(`Chữ trích "${q[1]}" chỉ có số ${where(p)}: trích kèm nhãn trường ("Camera sau": "13.0 MP") và tô cả nhãn`);
        const onPages = owners.flatMap(([c, set]) => marked.get(c.label).marks.filter((m) => set.has(m.page)).map((m) => ({ m, label: c.label })));
        const whole = onPages.filter(({ m }) => tf(m.text).includes(qq));
        // Tô từng mảnh (nhãn một chỗ, giá trị một chỗ) cũng được, miễn mọi con số của chữ trích nằm trong chỗ đã tô: tô nhãn
        // "Bộ nhớ đệm (GB)" mà bỏ giá trị "12" là chưa tô thông số.
        const parts = onPages.filter(({ m }) => tf(m.text).length >= 2 && qq.includes(tf(m.text)));
        const nums = (x) => x.match(/\d+(?:[.,]\d+)*/g) ?? [];
        const partNums = new Set(parts.flatMap(({ m }) => nums(tf(m.text))));
        const hit = whole.length > 0 || (parts.length > 0 && nums(qq).every((n) => partNums.has(n)) && parts.some(({ m }) => tf(m.text).length >= 6 || nums(qq).length));
        for (const { m, label } of [...whole, ...(hit ? parts : [])]) usedMarks.add(`${label}|${m.page}|${m.text}`);
        if (!hit && parts.length) errors.push(`Chữ trích "${q[1]}" mới tô một phần (${parts.map(({ m }) => `"${m.text}"`).join(', ')}), con số ${nums(qq).filter((n) => !partNums.has(n)).join(', ')} chưa tô ${where(p)}: tô cả giá trị, không chỉ nhãn`);
        else if (!hit) errors.push(`Chữ trích "${q[1]}" chưa có chỗ tô vàng trùng chữ ở trang được dẫn (${[...pagesCited].join(', ')}) ${where(p)}: thêm vào marks của tài liệu đó`);
      }
      // Hàng có trích chữ thì mỗi trang dẫn phải có ít nhất một chữ trích nằm trên nó: trang dẫn mà không trích gì thì người
      // chấm lật ra chỉ thấy chỗ tô không gắn với câu đáp ứng nào (s4g: tiêu đề chữ trắng của KT-03C tr. 1).
      // Chữ trích gắn với mã tài liệu đứng trước nó ("KT-03B ghi "..." và "..."; KT-03C ghi ..."); chữ trích trước mọi mã thì tính cho mọi tài liệu.
      const quotes = [];
      let owner = null;
      for (const m of resp.matchAll(/\b(KT-\d{2}[A-Z])\b|(?<![\d.])"([^"]{2,120})"|“([^”]{2,120})”/g)) {
        if (m[1]) owner = m[1]; else quotes.push({ owner, q: flat(m[2] ?? m[3]) });
      }
      // Bản in nhiều cột (hướng dẫn Samsung) làm chữ trích tiếng Việt đứt dòng: đủ mọi từ của chữ trích trên trang cũng tính.
      const onPage = (q, pt) => pt.includes(q) || pt.replace(/([,;)])\d{1,3}(?=\s)/g, '$1').includes(q)
        || q.split(/[^\p{L}\d.+-]+/u).filter((w) => w.length >= 2).every((w) => pt.includes(w));
      if (quotes.length) {
        for (const [c, set] of cited) {
          if (!c.label || !marked.has(c.label)) continue;
          const mine = quotes.filter((x) => x.owner === c.label || x.owner === null);
          for (const n of set) {
            if (!c.blocks) c.blocks = pdfBlocks(c.file);
            const pt = flat(`${c.pages[n - 1] ?? ''} ${(c.blocks[n - 1] ?? []).join(' ')}`);
            // Chữ trích cắt giữa một ô bảng của trang ("cắm đa năng (USB Type-C)" trong ô "Khe cắm tai nghe/Khe cắm đa năng
            // (USB Type-C)", "Adapter X710-T2L" trong "Intel® Ethernet Network Adapter X710-T2L"): người chấm thấy chữ cụt, không
            // biết trường nào. Ô là khối chữ của -bbox-layout; khối dài trên 90 ký tự là đoạn văn, trích một mệnh đề là đủ. Chữ
            // trích ngắn ("có", "16", "Wi-Fi") là giá trị đi cùng nhãn, hay khớp nhầm vào ô khác: chỉ xét từ 8 ký tự. Trên trang
            // có một chỗ chữ trích đứng trọn (cả ô, hay giữa hai dấu câu) thì coi là đã trích trọn.
            if (!c.blocks) c.blocks = pdfBlocks(c.file);
            for (const x of mine) {
              if (x.q.length < 8) continue;
              const cut = [];
              let whole = false;
              for (const cell of (c.blocks[n - 1] ?? []).map(flat)) {
                for (let at = cell.indexOf(x.q); at >= 0; at = cell.indexOf(x.q, at + 1)) {
                  const cutStart = /[\p{L}\d)]\s?$/u.test(cell.slice(0, at));
                  // Khối gộp nhiều trường "Nhãn: giá trị" (bìa "Regulatory Model: D05X Regulatory Type: D05X001"): chữ đứng
                  // sau là một nhãn mới thì chữ trích đã trọn trường.
                  const rest = cell.slice(at + x.q.length);
                  const cutEnd = /^\s?[\p{L}\d(]/u.test(rest) && !(x.q.includes(':') &&/^\s?[\p{L}][\p{L}\d ]{0,30}:/u.test(rest));
                  if (cell.length > 90 || (!cutStart && !cutEnd)) whole = true;
                  else cut.push([cell, cutStart]);
                }
              }
              if (!whole && cut.length) warnings.push(`Chữ trích "${x.q}" ${cut[0][1] ? 'bắt đầu' : 'dừng'} giữa ô "${cut[0][0].slice(0, 90)}" của ${c.label} tr. ${n} ${where(p)}: trích trọn ô (kèm nhãn), không cắt giữa ô`);
            }
            if (!mine.some((x) => onPage(x.q, pt))) warnings.push(`Dẫn ${c.label} tr. ${n} nhưng không chữ trích nào của ${c.label} trong hàng ${cellsQ[0]} nằm trên trang đó ${where(p)}: trích chữ của trang đó (kèm nhãn) hoặc bỏ trang khỏi cột tham chiếu`);
          }
        }
      }
    }
    // Ngoặc kép đứng sau chữ số là ký hiệu inch (3.5"/2.5"), không phải chữ trích.
    // Chữ trích mở bằng số ("128 GB, 8 x 16 GB") cũng soát.
    for (const q of [...unmark(p.text).matchAll(/(?<![\d.])"([A-Za-z0-9][^"]{2,79})"|“([A-Za-z0-9][^”]{2,79})”/g)].map((m) => [m[0], m[1] ?? m[2]])) {
      // Chỉ soát chữ Latin (chữ trích của catalog tiếng Anh); chữ tiếng Việt trong ngoặc là lời của hồ sơ.
      if (/[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệịỉĩọỏốồổỗộớờởỡợụủứừửữựỳỷỹỵ]/i.test(q[1])) continue;
      // Số chú thích dính sau dấu phẩy trên trang ("11.0-inch,27 2560 x 1600"): chữ trích bỏ số đó vẫn tính là có trên trang.
      if (!text.includes(flat(q[1])) && !text.replace(/([,;)])\d{1,3}(?=\s)/g, '$1').includes(flat(q[1]))) errors.push(`Chữ "${q[1]}" gán cho catalog không có trên trang ${[...pagesCited].join(', ')} ${where(p)}`);
    }
    // Tên chứng nhận, tiêu chuẩn ở cột yêu cầu ("80 Plus Platinum", "Energy Star") phải có nguyên tên trên trang dẫn:
    // catalog chỉ ghi "Platinum" thì chưa chứng minh được "80 Plus".
    const cells = p.style === 'table' ? p.text.split(' | ') : [];
    // Con số kèm đơn vị đo trong chữ đáp ứng ("PDU 16 A", "1500 W") phải có trên trang dẫn; không có là dẫn nhầm trang
    // hay con số không phải của catalog.
    {
      const said = cells.length >= 4 ? cells[2] : p.text;
      const dotted = text.replace(/(\d),(\d)/g, '$1.$2');
      // Mã tài liệu ("KT-02A") không phải số kèm đơn vị: bỏ số dính chữ hay dấu nối đứng trước.
      for (const m of said.matchAll(/(?<![\d.,\p{L}-])(\d+(?:[.,]\d+)?)\s?(GB|TB|MB|GHz|MHz|W|A|V|mm|kg|Gbps|GbE|MT\/s)(?![\p{L}])/gu)) {
        // Cùng số (4,80 = 4.80 = 4.8) đứng riêng, ngay trước đúng đơn vị; "16 A" không khớp nhầm vào "116 a" hay "16 amp".
        // "1.500 W" là một nghìn năm trăm (dấu chấm nghìn kiểu Việt), "4,80 GHz" là số thập phân.
        const raw = /^\d{1,3}(?:\.\d{3})+$/.test(m[1]) ? m[1].replace(/\./g, '') : m[1];
        const [int, dec = ''] = raw.replace(',', '.').split('.');
        const num = dec.replace(/0+$/, '') ? `${int}\\.${dec.replace(/0+$/, '')}0*` : `${int}(?:\\.0+)?`;
        const unit = m[2].toLowerCase().replace('/', '\\/');
        // Hàng đã trích nhãn mang đơn vị và giá trị riêng ("Lưu trữ (GB)": "128"): trang Samsung để nhãn và số ở hai dòng của
        // một cột, so trên chữ trang không ghép được; chữ trích được soát riêng ở trên.
        if (new RegExp(`\\(${unit}\\)["”]\\s*:\\s*["“]${num}["”]`, 'i').test(said)) continue;
        // Dải "2.60 GHz to 4.80": đơn vị đứng trước số cuối của dải. Đơn vị nằm ở nhãn ("Bộ nhớ đệm (GB) 12" ở trang Samsung).
        if (!new RegExp(`(?<![\\d.])${num}\\s?${unit}(?![a-z])|${unit}\\s*(?:to|-)\\s*${num}(?![\\d])|\\(${unit}\\)[^\\d]{0,60}(?<![\\d.])${num}(?![\\d.])`).test(dotted)) { warnings.push(`Số "${m[0]}" không có trên trang catalog ${[...pagesCited].join(', ')} ${where(p)}: kiểm lại trang dẫn, hoặc ghi rõ đó là cấu hình chào tính ra`); break; }
      }
    }
    if (cells.length >= 4 && !/\[(?:cần|chưa|chờ)/i.test(p.text)) {
      const cert = /80\s*plus|energy\s*star|epeat|tüv|tco\s*certified|iso\s*\d{4,5}|iec\s*\d{4,5}|fips\s*\d+|tpm\s*\d(?:\.\d)?|mil-std-\d+|\bip\d{2}\b/gi;
      for (const m of cells[1].matchAll(cert)) {
        // Hãng hay in liền ("80PLUS"): so sau khi bỏ dấu cách cả hai phía.
        if (!text.replace(/\s+/g, '').includes(flat(m[0]).replace(/\s+/g, ''))) errors.push(`Yêu cầu "${m[0]}" không có trên trang catalog ${[...pagesCited].join(', ')} mà hàng không đánh dấu ${where(p)}: ghi điều catalog có và [chưa có chứng minh: ${m[0]}]`);
      }
    }
  }
  // Đoạn văn (thuyết minh, chú thích hình) dẫn "(KT-03B, tr. 4)": chữ trích và tên chứng nhận, tiêu chuẩn đứng trước chỗ dẫn
  // (từ chỗ dẫn trước hay đầu câu) phải được tô trên trang đó; s4h ghi "đạt chuẩn kháng bụi, nước IP68 (KT-03B, tr. 4)" mà
  // trang đó không tô IP68. Chỗ dẫn này cũng tính là chỗ dùng của chỗ tô.
  if (labelled) {
    const certRe = /80\s*plus(?:\s*\w+)?|energy\s*star|epeat|tüv|tco\s*certified|iso\s*\d{4,5}|iec\s*\d{4,5}|fips\s*\d+|tpm\s*\d(?:\.\d)?|mil-std-\d+|\bip\d{2}\b/gi;
    const tf = (x) => x.normalize('NFC').toLowerCase().replace(/[™®©]/g, ' ').replace(/[‐-―]/g, '-').replace(/\s+/g, ' ').trim();
    // --also KT-05.docx: chỗ dẫn của tệp khác trong bộ (thuyết minh, chú thích hình) chỉ tính là chỗ dùng của chỗ tô, để soát
    // KT-01 không nêu chỗ tô mà chỉ thuyết minh dẫn là thừa; lỗi của tệp đó soát ở lần chạy riêng của nó.
    const others = (opt.also ?? []).flatMap((f) => readParagraphs(f).map((p) => ({ ...p, also: true })));
    for (const p of [...located, ...others]) {
      if ((p.style === 'table' && !p.also) || !p.text) continue;
      // Chú thích hình chỉ nói ảnh lấy từ trang nào, không chứng minh thông số (package-check cũng không bắt tô trang đó).
      if (/caption|chú thích/i.test(p.style) || /^Hình\s+\d+\s*[:.]/i.test(p.text)) continue;
      if (p.also) for (const c of cats) for (const m of p.text.matchAll(new RegExp(esc(c.label) + String.raw`(?![\w-])`, 'g'))) pagesAfter(p.text.slice(m.index + m[0].length))?.pages.forEach((n) => docCited.add(`${c.label}|${n}`));
      const text = unmark(p.text);
      let from = 0;
      const hits = [];
      for (const c of cats) {
        if (!marked.has(c.label)) continue;
        for (const m of text.matchAll(new RegExp(esc(c.label) + String.raw`(?![\w-])`, 'g'))) {
          const r = pagesAfter(text.slice(m.index + m[0].length));
          if (r) hits.push({ c, at: m.index, pages: r.pages });
        }
      }
      hits.sort((a, b) => a.at - b.at);
      for (const h of hits) {
        // Mệnh đề trước chỗ dẫn: từ chỗ dẫn trước, hay từ dấu chấm, chấm phẩy gần nhất.
        const head = text.slice(from, h.at);
        from = h.at + 1;
        const clause = head.slice(Math.max(head.lastIndexOf('; '), head.lastIndexOf('. ')) + 1);
        const terms = [
          ...[...clause.matchAll(/(?<![\d.])"([^"]{2,120})"|“([^”]{2,120})”/g)].map((m) => m[1] ?? m[2]),
          ...[...clause.matchAll(certRe)].map((m) => m[0]),
        ];
        const ms = marked.get(h.c.label).marks;
        for (const n of h.pages) {
          const onP = ms.filter((m) => m.page === n);
          for (const t of terms) {
            const hit = onP.filter((m) => tf(m.text).includes(tf(t)) || (tf(m.text).length >= 2 && tf(t).includes(tf(m.text))));
            hit.forEach((m) => usedMarks.add(`${h.c.label}|${m.page}|${m.text}`));
            if (!hit.length && !p.also) warnings.push(`Đoạn dẫn ${h.c.label} tr. ${n} cho "${t}" nhưng trang đó chưa tô chữ này ${where(p)}: tô chữ đó (kèm nhãn) trên trang, hoặc dẫn đúng trang có chữ`);
          }
          if (!terms.length) onP.forEach((m) => usedMarks.add(`${h.c.label}|${m.page}|${m.text}`));
        }
      }
    }
  }
  // Chỗ tô vàng không ứng với chữ trích nào của bảng đáp ứng: người chấm thấy chữ được tô mà không biết tô để chứng minh gì.
  if (refs && usedMarks.size) {
    for (const [label, set] of marked) {
      const extra = set.marks.filter((m) => docCited.has(`${label}|${m.page}`) && !usedMarks.has(`${label}|${m.page}|${m.text}`));
      if (extra.length) warnings.push(`${label} có ${extra.length} chỗ tô không ứng với chữ trích nào trong bảng (${extra.slice(0, 4).map((m) => `tr. ${m.page} "${m.text.slice(0, 30)}"`).join(', ')}): trích chữ đó ở dòng nó chứng minh, hoặc bỏ khỏi marks`);
    }
  }
  console.log(`Chỗ dẫn trang tài liệu hãng: ${refs} đoạn, hàng bảng; ${cats.map((c) => `${c.label ?? 'catalog'} ${c.pages.length} trang`).join(', ')}.`);
}
for (const [label] of new Map(opt.highlight.map((h) => h.split('=')))) {
  if (!opt.catalog.some((c) => c.startsWith(`${label}=`))) warnings.push(`--highlight ${label} không có --catalog ${label}=<tệp.pdf> đi kèm: không soát được trang tô vàng`);
}

// 6b. Ô đáp ứng chép lại câu yêu cầu ("Hỗ trợ quản trị, giám sát phần cứng từ xa" đáp cho chính câu đó) hay chỉ ghi "Đáp
// ứng": người chấm không thấy hàng chào có gì, và câu cam kết khai trung thực dưới bảng biến nó thành lời khai không căn cứ.
for (const p of located) {
  if (p.style !== 'table') continue;
  const cells = p.text.split(' | ');
  if (cells.length < 4 || /\[(?:cần|chưa|chờ)/i.test(p.text)) continue;
  // Hàng tiêu đề cột ("STT | Yêu cầu | Đáp ứng | ...") và hàng đánh số cột "(1) | (2)" không phải hàng đáp ứng.
  if (/^(?:stt|tt|số tt|\(1\))$/i.test(cells[0].trim())) continue;
  const strip = (s) => norm(s).replace(/^[-•+]\s*/, '').replace(/[;.,:\s]+$/, '').replace(/[\s,;]+/g, ' ');
  const req = strip(cells[1]); const resp = strip(cells[2]);
  if (req.length < 12) continue;
  if (/^(?:đáp ứng|có|đạt|tuân thủ|đáp ứng yêu cầu)$/.test(resp) || resp === req || (resp.startsWith(req) && resp.length - req.length < 12)) {
    errors.push(`Ô đáp ứng chép lại câu yêu cầu thay vì nói hàng chào có gì ${where(p)}: "${cells[2].slice(0, 90)}"; ghi con số, tính năng cụ thể kèm tài liệu, không có tài liệu thì đánh dấu`);
  }
}

// 6d. Dòng đáp ứng tự mâu thuẫn: vừa "(tốt hơn)" vừa còn đánh dấu chưa có chứng minh; hàng "Tiêu chí đáp ứng tương đương hoặc
// tốt hơn" kê dòng còn đánh dấu là tốt hơn. Ô đáp ứng chỉ có dấu, không ghi gì tài liệu đã có: người chấm thấy hàng chào trống.
{
  const rows = new Map();
  for (const p of located) {
    if (p.style !== 'table') continue;
    const cells = p.text.split(' | ');
    if (cells.length < 4) continue;
    rows.set(cells[0].trim(), p);
    const marker = /\[(?:cần|chưa|chờ)/i.test(cells[2]);
    if (marker && /\(tốt hơn\)/i.test(cells[2])) errors.push(`Dòng ${cells[0].trim()} vừa ghi "(tốt hơn)" vừa còn đánh dấu chờ ${where(p)}: chưa có chứng minh thì chưa tốt hơn`);
    if (/^\s*\[(?:cần|chưa)/i.test(cells[2]) && /[≥≤]|\d\s*(?:gb|tb|ghz|w|inch)\b/i.test(cells[1])) warnings.push(`Ô đáp ứng dòng ${cells[0].trim()} chỉ có dấu ${where(p)}: ghi trước điều tài liệu hãng đã có liên quan (trang, chữ trích) rồi mới đánh dấu phần còn thiếu`);
  }
  for (const p of located) {
    if (p.style !== 'table' || !/tiêu chí đáp ứng tương đương hoặc tốt hơn/i.test(p.text)) continue;
    const list = p.text.split(' | ').slice(1).join(' ');
    for (const m of list.matchAll(/(?<![\d.])(\d+\.\d+)(?![\d.])/g)) {
      const r = rows.get(m[1]);
      if (r && /\[(?:cần|chưa|chờ)/i.test(r.text.split(' | ')[2] ?? '')) errors.push(`Hàng "Tiêu chí đáp ứng tương đương hoặc tốt hơn" kê dòng ${m[1]} nhưng dòng đó còn đánh dấu chờ ${where(p)}`);
    }
  }
}

// 6e. Bản dịch thiếu số của bản gốc (số chú thích, con số thông số): mỗi số ở cột bản gốc phải có ở cột bản dịch.
for (const p of located) {
  if (!p.original) continue;
  const all = p.original.split(' | ');
  const kept = p.translated.split(' | ');
  const oi = kept.findIndex((c, i) => c === '' && all[i] !== '');
  if (oi < 0) continue;
  const nums = (s) => (s.match(/\d+(?:[.,]\d+)*/g) ?? []).map((x) => x.replace(/[.,]/g, '').replace(/^0+(?=\d)/, ''));
  const tr = new Set(nums(kept.filter((c, i) => i !== oi).join(' ')));
  const miss = [...new Set(nums(all[oi]))].filter((x) => !tr.has(x));
  // Dấu chú thích (*, **, †) phải giữ đủ: chú thích dưới trang gắn với đúng thông số nhờ dấu đó.
  const stars = (s) => (s.match(/\*+|†/g) ?? []).join(' ');
  if (stars(all[oi]) !== stars(kept.filter((c, i) => i !== oi).join(' '))) miss.push(`dấu chú thích (${stars(all[oi]) || 'không có'} so với ${stars(kept.filter((c, i) => i !== oi).join(' ')) || 'không có'})`);
  if (miss.length) warnings.push(`Bản dịch thiếu số ${miss.slice(0, 5).join(', ')} của bản gốc ${where(p)}: "${all[oi].slice(0, 70)}"; dịch đủ, kể cả số chú thích`);
}

// 6f. Dấu đánh dấu đứng cạnh điều BA đã chốt ("Giao ngày 22 [cần xác nhận]" khi tệp trả lời của BA ghi "ngày 21 đến ngày 22"):
// BA đã chốt thì bỏ dấu. Dấu trần "[cần xác nhận]" trong ô bảng: không nói chờ gì; lịch trong bảng tiến độ đã có một dấu ở câu
// mở phần tiến độ thì các ô không cần dấu.
{
  const baText = norm(opt.ba.map((f) => readParagraphs(f).map((p) => p.text).join(' ')).join(' '));
  const facts = (t) => [...t.matchAll(/(?:ngày|tháng|năm)\s+\d+|\d+\s*(?:\([^)]{1,20}\)\s*)?(?:ngày|tháng|năm|buổi|lớp|học viên|lần)/giu)].map((m) => m[0].replace(/\([^)]*\)\s*/, '').replace(/(^|\D)0+(\d)/g, '$1$2'));
  const baFacts = new Set(facts(baText));
  let bare = 0; let bareAt;
  for (const p of located) {
    for (const m of p.text.matchAll(/\[(?:cần|chưa)[^\]]*\]/gi)) {
      if (p.style === 'table' && /^\[cần xác nhận\]$/i.test(m[0])) { bare++; bareAt ??= p; }
      // Ô Mẫu 10A mang con số trùng mốc BA đã chốt ("Ngày giao do nhà thầu đề xuất: 22 [cần xác nhận: điền Mẫu 10A]" khi BA chốt
      // giao ngày 21 đến ngày 22): ô đó điền luôn, không đánh dấu (s4k). Ô có số BA chưa chốt thì vẫn để dấu.
      if (/webform|mẫu\s*\d/i.test(m[0])) {
        const n = p.text.slice(Math.max(0, m.index - 12), m.index).match(/(\d{1,3})\s*$/)?.[1];
        if (opt.ba.length && n && new RegExp(`(?:ngày|tới|đến)\\s+(?:ngày\\s+)?0*${n}(?!\\d)`, 'i').test(baText)) warnings.push(`Dấu "${m[0].slice(0, 40)}" đứng sau "${n}" mà tệp trả lời của BA đã chốt mốc đó ${where(p)}: ô Mẫu 10A trùng mốc BA chốt thì điền luôn, bỏ dấu`);
        continue;
      }
      if (!opt.ba.length) continue;
      const before = norm(p.text.slice(Math.max(0, m.index - 40), m.index));
      const hit = facts(before).at(-1);
      // Dấu ghi rõ chờ một thứ khác ("[cần xác nhận: thư xác nhận gói ProSupport]") thì không phải dấu cho con số đứng trước.
      const says = m[0].match(/:\s*([^\]]+)/)?.[1] ?? '';
      if (hit && says && !says.includes(hit.replace(/\D+/g, ' ').trim())) continue;
      // Tệp trả lời của BA nói điều trong dấu còn chờ ("thư xác nhận của hãng chưa về"): dấu đúng, không nêu.
      const keys = norm(says).split(/[^\p{L}\d]+/u).filter((w) => w.length >= 4);
      const pending = [...baText.matchAll(/chưa|đang chờ|chờ\s/g)].some((c) => {
        const win = baText.slice(Math.max(0, c.index - 80), c.index + 80);
        return keys.filter((w) => win.includes(w)).length >= 2;
      });
      if (pending) continue;
      if (hit && baFacts.has(hit)) warnings.push(`Dấu "${m[0].slice(0, 40)}" đứng ngay sau "${hit}" mà tệp trả lời của BA đã chốt ${where(p)}: bỏ dấu, hoặc ghi rõ còn chờ điều gì khác`);
    }
  }
  // Cùng một dấu lặp ở nhiều ô bảng ("Ngày 60 [cần xác nhận: lịch]" ở bốn hàng): một dấu ở câu mở bảng là đủ.
  const sameInCells = new Map();
  for (const p of located) {
    if (p.style !== 'table') continue;
    for (const m of p.text.matchAll(/\[(?:cần|chưa)[^\]]*:[^\]]*\]/gi)) {
      if (/webform|mẫu\s*\d/i.test(m[0])) continue;
      const k = norm(m[0]);
      if (!sameInCells.has(k)) sameInCells.set(k, { n: 0, p });
      sameInCells.get(k).n++;
    }
  }
  // Phần tiến độ chỉ một dấu "lịch do nhà thầu đề xuất" ở câu mở đầu phần; câu mở các mục con không đặt lại.
  // Chỗ khác nhắc lại lịch thì dùng dấu ngắn "[cần xác nhận]" (schedule-letters.md), nên dấu có lời "lịch ..." chỉ được một chỗ.
  const sched = located.filter((p) => p.style !== 'table' && [...p.text.matchAll(/\[cần xác nhận:[^\]]*\]/gi)].some((m) => /lịch|tiến độ/i.test(m[0]) && !/webform|mẫu\s*\d/i.test(m[0])));
  if (sched.length > 1) warnings.push(`Dấu chờ duyệt lịch có lời giải thích ở ${sched.length} câu (${sched.slice(0, 3).map(where).join(', ')}): giữ một dấu ở câu mở đầu phần tiến độ; chỗ khác nhắc lại lịch dùng dấu ngắn [cần xác nhận]`);
  for (const [k, { n, p }] of sameInCells) if (n > 2) warnings.push(`Dấu "${k}" lặp ở ${n} ô bảng, đầu tiên ${where(p)}: đặt một dấu ở câu mở bảng (hay ô đầu), bỏ ở các ô sau`);
  if (bare > 2) warnings.push(`${bare} dấu trần "[cần xác nhận]" trong ô bảng, đầu tiên ${where(bareAt)}: lịch trong bảng tiến độ đã có dấu ở câu mở phần tiến độ thì bỏ dấu ở ô; chỗ khác ghi rõ chờ gì ("[cần xác nhận: xuất xứ]")`);
}

// 6c. Chứng minh bằng lời hứa xin xác nhận sau ("xác nhận của Nhà sản xuất khi Chủ đầu tư yêu cầu"): Mục 3 đòi tài liệu chứng
// minh nộp cùng hồ sơ; lời hứa đó không phải tài liệu. Thiếu tài liệu thì đánh dấu và đưa vào danh sách giấy tờ phải xin.
for (const p of located) {
  if (/\[(?:cần|chưa|chờ)/i.test(p.text)) continue;
  const t = norm(p.text);
  if (/xác nhận của (?:nhà sản xuất|hãng)[^.|]{0,40}(?:khi|nếu) (?:chủ đầu tư|bên mời thầu|tổ chuyên gia)[^.|]{0,15}yêu cầu/.test(t)
    || (p.style === 'table' && /(?:khi|nếu) (?:chủ đầu tư|bên mời thầu) (?:có )?yêu cầu/.test(norm(p.text.split(' | ').at(-1))))) {
    errors.push(`Lấy lời hứa xin xác nhận sau làm chứng minh ${where(p)}: "${p.text.slice(0, 100)}"; Mục 3 đòi tài liệu nộp cùng hồ sơ, thiếu thì đánh dấu [chưa có chứng minh: ...] và đưa vào danh sách giấy tờ phải xin`);
  }
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
  const dur = /(?<![\p{L}\d.,/])(\d+)\s*(\([^)]{1,30}\))?\s*(ngày|tháng|giờ)(?![\p{L}\d])(?!\s+\d)/gu;
  for (const p of located) {
    if (p.style === 'table' && /^\d+(\.\d+)? \| /.test(p.text) && /\| \d \| \d/.test(p.text)) continue;
    if (p.original) continue;
    // Chữ trong chỗ đánh dấu là lời nhắn cho BA, không phải chữ của hồ sơ; chữ trong ngoặc kép là chữ trích tài liệu hãng
    // ("12 tháng" của chính sách bảo hành), giữ như hãng viết.
    const t = norm(p.text.replace(/\[[^\]]*\]/g, '').replace(/["“][^"”]{0,300}["”]/g, ''));
    for (const m of t.matchAll(dur)) {
      const k = `${Number(m[1])} ${m[3]}`;
      // Chữ chép nguyên văn HSMT ("Bảo hành: ≥ 36 tháng") giữ như HSMT viết.
      if (!m[2] && fromHsmt(t, m.index, m.index + m[0].length)) continue;
      if (m[2]) withWords.add(k); else if (!plain.has(k)) plain.set(k, p);
    }
  }
  for (const [k, p] of plain) if (withWords.has(k)) warnings.push(`"${k}" có chỗ kèm chữ, có chỗ không, đầu tiên ${where(p)}: thời hạn quan trọng kèm chữ ở mọi lần nhắc, kể cả bản cam kết`);
  const count = /(?<![\p{L}\d.,/:×x-])([1-9])\s+(thanh|ổ|bộ|chiếc|lớp|buổi|cổng|khe|khoang|người|bản|gói|máy|lần|ngày|giờ|tháng)(?![\p{L}])(?!\s+\d)/gu;
  const seen = new Set();
  for (const p of located) {
    // Bản dịch tài liệu hãng giữ số như bản gốc ("3 ports" dịch "3 cổng"), không thêm số 0.
    if (p.original) continue;
    for (const m of p.text.matchAll(count)) {
      const k = `${m[1]} ${m[2]}`;
      if (seen.has(k)) continue;
      // Số hiệu ("Bảng 5 bộ xử lý", "Hình 2 máy", "mục 3 lớp") không phải số đếm.
      if (/(?:bảng|hình|mục|phần|điều|khoản|bước|trang|tr\.)\s*$/i.test(p.text.slice(Math.max(0, m.index - 8), m.index))) continue;
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
  const catText = opt.catalog.length ? norm(opt.catalog.flatMap((f) => pdfPages(f.replace(/^[^=]{1,40}=(?=.)/, ''))).join(' ').replace(/[®™©]/g, '')) : '';
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
  const talk = /(?<![\p{L}])BA(?![\p{L}])|trước khi nộp|để hoàn thiện hồ sơ|[Tt]heo nhận định của [Nn]hà thầu|[Pp]hần này nêu|ở mức thành phần/u;
  for (const p of located) {
    const outside = p.text.replace(/\[[^\]]*\]/g, '');
    const m = outside.match(talk);
    if (m) errors.push(`Lời nói với BA trong thân hồ sơ ("${m[0]}") ${where(p)}: "${p.text.slice(0, 100)}"; đưa vào chỗ đánh dấu hoặc báo cáo`);
  }
  // Chi tiết công nghệ, an toàn thông tin cụ thể (RESTful, TLS 1.2, băm mật khẩu, OWASP) mà HSMT, BA không nêu: đề xuất của
  // nhà thầu, phải có chỗ đánh dấu trong cùng mục (đánh dấu một lần ở đầu mục là đủ).
  const tech = /\b(?:RESTful|REST API|JSON|XML|TLS\s*v?\d(?:\.\d)?|SSL|HTTPS?(?:\s*v?\d(?:\.\d)?)?|OAuth\s*\d?(?:\.\d)?|JWT|OWASP(?: Top 10)?|bcrypt|SHA-?\d+|AES-?\d+|WebSocket|gRPC|Docker|Kubernetes|Redis|Kafka|Nginx)\b|dạng băm|khóa tài khoản khi đăng nhập sai|hiển thị dần|thiết bị (?:dự phòng|cùng loại)|cho (?:Chủ đầu tư )?mượn|sao lưu tự động|thử khôi phục|bản vá|(?:giao|nộp|cung cấp|kèm)[^.;]{0,30}bản in|trực tại chỗ|thường trực|\b(?:0?[2-9]|hai|ba|bốn) người (?:nâng|khiêng|trực|lắp)/gi;
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
  // Ai làm phần mềm đang chờ BA (có chỗ đánh dấu nhắc đơn vị phát triển, nhà thầu phụ) mà câu khác khẳng định thẳng "do Nhà thầu
  // thực hiện", "Nhà thầu tự phát triển": BA đổi vai sẽ sót câu đó.
  if (located.some((p) => /\[(?:cần|chưa|chờ)[^\]]*(?:đơn vị phát triển|nhà thầu phụ|thầu phụ|ai làm|phát triển phần mềm)/i.test(p.text))) {
    for (const p of located) {
      if (/\[(?:cần|chưa|chờ)/i.test(p.text)) continue;
      const m = p.text.match(/(?:do|bởi) Nhà thầu (?:tự )?(?:thực hiện|phát triển|xây dựng)|Nhà thầu tự (?:thực hiện|phát triển|xây dựng)/i);
      if (m) warnings.push(`Câu "${m[0]}" khẳng định ai làm phần mềm trong khi hồ sơ đang đánh dấu chỗ này chờ BA ${where(p)}: thêm [cần xác nhận] hay viết trung tính`);
    }
  }
  // Mục lục còn chữ giữ chỗ của bid-docx: tệp Word chưa được Word cập nhật trường.
  if (draft.some((p) => p.text.startsWith('Mục lục chưa dựng'))) errors.push('Tệp Word còn chữ giữ chỗ của mục lục: chạy render-pdf.ps1 -UpdateDocx HSDX.docx để Word dựng mục lục vào chính tệp');
}

// 18. Số thập phân dấu chấm kiểu Anh trong chữ của nhà thầu ("4.80 GHz", "37.56 kg"); chữ trích catalog trong ngoặc kép giữ
// nguyên. Hai chữ số trở xuống sau dấu chấm mới là thập phân ("1.500 W" là một nghìn năm trăm).
{
  const seenDec = new Set();
  for (const p of located) {
    const t = p.text.replace(/"[^"]*"|“[^”]*”/g, '');
    for (const m of t.matchAll(/(?<![\d.,])\d+\.\d{1,2}\s?(?:GHz|MHz|kg|TB|GB|MB|mm|cm|inch|W|V|A)(?![A-Za-z])/g)) {
      // Ô yêu cầu chép nguyên HSMT ("Tần số CPU Tối đa ≥ 4.5 GHz") giữ như HSMT viết.
      if (seenDec.has(m[0]) || fromHsmt(t, m.index, m.index + m[0].length)) continue;
      seenDec.add(m[0]);
      warnings.push(`Số thập phân "${m[0]}" dùng dấu chấm ${where(p)}: chữ của nhà thầu viết dấu phẩy ("${m[0].replace('.', ',')}"), chỉ giữ dấu chấm khi trích nguyên catalog trong ngoặc kép`);
    }
  }
}

// 17. Lịch tự đặt nhắc lại ngoài phần tiến độ ("giao nhận ngày 2 đến ngày 25", "nghiệm thu ngày 58 đến ngày 60") mà không
// đánh dấu: BA đổi lịch ở phần tiến độ sẽ sót những chỗ này. Bỏ qua phần lớn có tên "tiến độ" (bảng tiến độ là chỗ gốc), bảng
// tiến độ theo ngày, bản cam kết tiến độ, và câu chép nguyên HSMT.
{
  let inSchedule = false;
  const seenDay = new Set();
  for (const p of located) {
    if (isHeading(p.style) && /^[A-H]\.\s+\S/.test(p.text)) inSchedule = /tiến độ/i.test(p.text);
    if (inSchedule || /^Bản cam kết/.test(p.section) || /\[(?:cần|chưa|chờ)/i.test(p.text)) continue;
    if (p.style === 'table' && /\| \d+ \| \d+/.test(p.text)) continue;
    const t = p.text.replace(/\[[^\]]*\]/g, '');
    for (const m of t.matchAll(/ngày\s+(\d{1,3})\s*(?:đến|tới|-)\s*(?:ngày\s+)?(\d{1,3})/giu)) {
      // Khoảng ngày có nguyên trong HSMT hay tệp trả lời của BA (BA chốt "giao ngày 21 đến ngày 22") là lịch đã chốt.
      if (fromHsmt(t, m.index, m.index + m[0].length) || (opt.hsmt.length && hsmtLoose.includes(loose(m[0])))) continue;
      const k = `${m[1]}-${m[2]}`;
      if (seenDay.has(k)) continue;
      seenDay.add(k);
      warnings.push(`Lịch "${m[0]}" nhắc lại ngoài phần tiến độ không đánh dấu ${where(p)}: lịch là đề xuất của nhà thầu thì mỗi chỗ nhắc lại có [cần xác nhận]`);
    }
  }
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

// --seen <tệp>: mỗi dòng là một đoạn chữ của dòng XEM đã đọc và xử lý (lý do ghi ở báo cáo); dòng XEM chứa đoạn đó in thành
// "ĐÃ XEM" và không tính vào số chỗ cần xem lại. Chỉ áp cho XEM, không áp cho LỖI.
let seenLines = [];
if (opt.seen) seenLines = fs.readFileSync(opt.seen, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const open = warnings.filter((w) => !seenLines.some((l) => w.includes(l)));
for (const e of errors) console.log(`LỖI  ${e}`);
for (const w of open) console.log(`XEM  ${w}`);
for (const w of warnings.filter((x) => !open.includes(x))) console.log(`ĐÃ XEM  ${w}`);
console.log(`${files[0]}: ${draft.length} đoạn, ${errors.length} lỗi, ${open.length} chỗ cần xem lại${open.length < warnings.length ? ` (${warnings.length - open.length} chỗ đã xem theo ${opt.seen})` : ''}.`);
process.exit(errors.length ? 1 : 0);
