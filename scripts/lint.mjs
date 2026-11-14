#!/usr/bin/env node
// Soát phần máy đếm được trong một văn bản tiếng Việt (.md, .txt, .html).
// Dùng: node lint.mjs [--official] <tệp> [tệp khác…]   ("-" là đọc từ stdin)
// Tệp có Quốc hiệu, hoặc chạy với --official, thì soát theo thể thức văn bản hành chính (references/official-documents.md).
// Độ dài câu đếm theo tiếng (âm tiết, tách theo dấu cách), như cách người Việt vẫn đếm "chữ".
// Script chỉ bắt dấu hiệu bề mặt. Nó không biết câu nào rời câu nào, nên vẫn phải tự đọc lại hai lượt.
import fs from 'node:fs';

// "-" là đọc từ stdin, để soát lời trả trước khi gửi mà không phải ghi ra tệp.
const cache = new Map();
function readText(file) {
  if (!cache.has(file)) cache.set(file, fs.readFileSync(file === '-' ? 0 : file, 'utf8'));
  return cache.get(file);
}

// Không có cụm nào bị cấm. Đây là những cụm ngoài đời ít người nói khi giải thích cho nhau,
// nên script đếm để người viết xem lại: một lần, đúng chỗ thì để; lặp lại thì sửa.
const RARE_PHRASES = [
  'do đó', 'hệ quả là', 'bởi vậy', 'nói cách khác', 'thật ra', 'thực chất', 'về bản chất',
  'hành trình', 'điều quan trọng nhất là', 'điều đáng chú ý là', 'đóng vai trò', 'mang tính',
  'thông qua việc', 'thực hiện việc', 'chúng ta', 'bên cạnh đó', 'qua đó', 'đồng thời',
  'sâu sắc', 'mạnh mẽ', 'toàn diện', 'liền mạch', 'phải chăng', 'không chỉ',
  // bảng D của references/machine-tells.md
  'bức tranh', 'chìa khoá', 'chìa khóa', 'bài toán', 'then chốt', 'có tính chất', 'đã đến lúc', 'chung tay', 'nhức nhối',
];
// Chữ nhấn thừa (machine-tells.md, bảng D): bỏ khi câu không mất nghĩa. "đúng" chỉ bắt khi đứng trước chữ chỉ lượng, chỗ,
// thời điểm, vì "đúng" nghĩa là không sai thì vẫn giữ.
const EMPHASIS = /(?<![\p{L}])(thật sự|bằng đúng|chính là|hoàn toàn|đúng (?:các|những|hai|ba|bốn|năm|lúc|thời điểm|chỗ|dòng|chữ|điều))(?![\p{L}])/giu;
// Lỗi chính tả hay gặp (common-errors.md, Lỗi dùng từ).
const TYPOS = ['thiếu xót', 'sáng lạng', 'xán lạng', 'đọc giả', 'chuẩn đoán'];
const SENTENCE_OPENERS = ['Hãy ', 'Tóm lại', 'Nhìn chung', 'Có thể nói', 'Không thể phủ nhận', 'Thiết nghĩ'];
// Khuôn mở bài của văn mẫu nhà trường. "Trong thời đại…" mở bài gần như luôn là khuôn, dù vế sau là gì
// ("Trong thời đại dữ liệu là tài sản…"), nên không đòi chữ "hiện nay" theo sau như ba khuôn còn lại.
const SCHOOL_OPENING = /^(Trong thời đại\s|Trong (xã hội|cuộc sống|bối cảnh|thế giới)[^.]{0,60}(hiện đại|hiện nay|ngày nay|công nghệ|chuyển đổi số|số hoá|số hóa|toàn cầu hoá|toàn cầu hóa|4\.0)|Ngày nay,|Từ xưa đến nay|Cuộc sống (là|luôn))/i;
// Lời trích trong ngoặc kép: lời người khác, hoặc chính câu lỗi mà một báo cáo soát trích ra ("Câu gốc: "Hãy kiểm tra…"").
// Các phép dò chữ, ký hiệu, độ dài câu không tính nó. Cho phép xuống một dòng bên trong vì Markdown hay ngắt dòng cứng.
const QUOTED = /"(?:[^"\n]|\n(?![ \t]*\n)){0,300}"|“(?:[^”\n]|\n(?![ \t]*\n)){0,300}”/g;
// Nhãn đầu dòng của báo cáo soát (SKILL.md, review-reports.md). Bỏ nhãn trước khi đo câu, để "Vấn đề: …" không bị đếm là
// câu dùng dấu hai chấm làm khung.
const REPORT_LABEL = /^(Câu gốc|Vấn đề|Cách sửa|Sửa|Trên site|Hiện trạng|Tài liệu gốc|Cần xác nhận|Chỗ bị|Thấy lại|Đoán lý do|Lý do)\s*:\s*/;
const LIST_MARK = /^([-*+]|\d{1,3}[.)])\s+/;
// Một thứ nhiều tên (core-rules.md mục 5). Mỗi nhóm là các tên hay gặp của cùng một thứ; chữ in hoa viết tắt so khớp đúng hoa.
const NAME_GROUPS = [
  [/\bdatabase\b/gi, /cơ sở dữ liệu/gi, /\bCSDL\b/g, /\bDB\b/g],
  [/máy chủ/gi, /\bserver\b/gi],
  [/thư mục/gi, /\bfolder\b/gi],
  [/mật khẩu/gi, /\bpassword\b/gi],
  [/\bwebsite\b/gi, /\bsite\b/gi, /trang web/gi],
];
// Buổi trong ngày theo giờ: chữ chỉ buổi đứng cạnh một giờ cụ thể của buổi khác thường là sót sau khi đổi múi giờ hay
// đổi lịch ("Mỗi đêm… tức 9h sáng").
// Giờ trong ngày: "2h sáng", "9 giờ tối", "lúc 21h", "02:00". Số giờ không có buổi, không có "lúc", "vào" là khoảng thời gian.
const HOUR = /(?<![\p{L}\d])(lúc |vào )?(\d{1,2})(?:\s?(?:h|giờ)(?:\s?\d{2}(?:p|'| phút)?)?|:\d{2})(?:\s+(sáng|trưa|chiều|tối|đêm|khuya))?(?![\p{L}\d])/giu;
const PERIOD_WORD = /(?<![\p{L}])(?:(?:mỗi|ban|buổi|hằng|hàng|nửa|cả|suốt)\s+(đêm|sáng|trưa|chiều|tối)|(đêm|khuya))(?![\p{L}])/giu;
// Hai ý chọi nhau trong một câu (common-errors.md): câu vừa nói việc đã làm đúng lúc vừa nói lẽ ra phải làm
// ("Việc làm kịp thời này lẽ ra phải được tiến hành từ tháng trước").
const SHOULD_HAVE = /(?<![\p{L}])(lẽ ra|đáng lẽ|đáng ra)(?![\p{L}])/iu;
const ON_TIME = /(?<![\p{L}])(kịp thời|đúng lúc|đúng hạn|đã xong|đã hoàn thành|vừa xong)(?![\p{L}])/iu;
// Cùng một việc đi với hai con số khác nhau ("giữ 7 ngày" ở đoạn này, "giữ 14 ngày" ở đoạn khác; common-errors.md, Hai dữ
// kiện vênh nhau). Khoá là chữ đứng ngay trước con số cộng đơn vị đo thời gian, dung lượng, số bản; tỉ lệ % đổi theo ngữ
// cảnh nên không xét. Chữ chỉ khoảng hay mốc ("mất", "khoảng", "sau") bỏ qua, vì hai bước khác nhau mất 5 phút và 15 phút
// là chuyện thường; chữ đứng trước là ngày tháng hay số hiệu ("ngày 05 tháng 11", "tháng 11 năm 2026", "Điều 5") cũng bỏ qua.
const AMOUNT = /(?<![\p{L}\d])(\p{L}+)\s+(\d+(?:[.,]\d+)?)\s*(ngày|tuần|tháng|năm|giờ|phút|giây|bản|GB|MB|TB)(?![\p{L}\d])/giu;
const AMOUNT_SKIP = new Set(['mất', 'khoảng', 'chừng', 'tầm', 'sau', 'trước', 'trong', 'là', 'có', 'và', 'hoặc', 'hay', 'tới', 'đến', 'từ', 'lúc', 'vào', 'còn', 'thêm', 'gần', 'hơn', 'dưới', 'trên', 'mỗi', 'cách', 'với', 'của', 'các', 'những',
  'ngày', 'tuần', 'tháng', 'năm', 'giờ', 'phút', 'số', 'điều', 'khoản', 'mục', 'bước', 'bản', 'phiên', 'lần']);

// Lời trả của người soát văn (SKILL.md, dòng "Soát mà không sửa"): các mục danh sách có dòng "Vấn đề:". Tách từ tệp gốc
// (đã bỏ khối code) để còn thấy lời trích và code, thứ mà prose đã thay bằng "x".
const PROBLEM_LABEL = /^(Vấn đề|Lỗi)\s*:/;
const FIX_LABEL = /^(Cách sửa|Sửa|Đề xuất)\s*:/;
function reviewItems(raw) {
  const out = [];
  let cur = null;
  for (const line of raw.replace(/\r\n/g, '\n').replace(/```[\s\S]*?```/g, ' ').split('\n')) {
    const m = line.match(/^ {0,1}(?:[-*+]|(\d{1,3})[.)])\s+(.*)$/);
    if (m) { cur = { n: m[1] || String(out.length + 1), lines: [m[2].trim()] }; out.push(cur); }
    else if (!line.trim()) cur = null;            // dòng trống là hết mục: đoạn chen giữa danh sách không thuộc mục nào
    else if (cur) cur.lines.push(line.trim());
  }
  return out.map((it) => {
    const p = it.lines.findIndex((l) => PROBLEM_LABEL.test(l));
    if (p < 0) return { ...it, labelled: false };
    let f = it.lines.findIndex((l, i) => i > p && FIX_LABEL.test(l));
    if (f < 0) f = it.lines.length;
    return { ...it, labelled: true, head: it.lines.slice(0, p).join(' '), problem: it.lines.slice(p, f).join(' ').replace(PROBLEM_LABEL, '').trim() };
  });
}

// Ghép các dòng của một mục danh sách thành một đoạn để đo câu. Dòng không kết bằng dấu câu mà dòng sau mở bằng nhãn
// ("Vấn đề:") hay là dòng tên mục thì coi là hết câu; bỏ nhãn rồi viết hoa chữ đầu để tách câu đúng chỗ.
function joinItem(lines) {
  return lines.map((l, i) => {
    const next = lines[i + 1];
    let t = l.replace(REPORT_LABEL, '');
    if (t !== l) t = t.charAt(0).toUpperCase() + t.slice(1);
    const ends = /[.!?…:;,]$/.test(l);
    if (next && !ends && (REPORT_LABEL.test(next) || (i === 0 && /^\p{Lu}/u.test(next)))) t += '.';
    return t;
  }).join(' ');
}

function extractProse(file) {
  let s = readText(file).replace(/\r\n/g, '\n');
  if (/\.html?$/i.test(file)) {
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

// Điểm trong khoản đánh theo bảng chữ cái tiếng Việt (Nghị định 30/2020, Phụ lục I).
const VI_ALPHABET = 'a b c d đ e g h i k l m n o p q r s t u v x y'.split(' ');

// Các phép dò thể thức văn bản hành chính. Chỉ bắt chỗ máy đếm được; cỡ chữ, lề, phông phải xem trong tệp Word.
function lintOfficial(raw) {
  const issues = [];
  const lines = raw.replace(/\r\n/g, '\n').split('\n').map((l) => l.replace(/^\s*[|>]\s*|\s*\|\s*$/g, '').trim());

  const mottos = raw.match(/Độc\s*lập\s*\S?\s*Tự\s*do\s*\S?\s*Hạnh\s*phúc/g) || [];
  const badMotto = mottos.filter((t) => t !== 'Độc lập - Tự do - Hạnh phúc');
  if (badMotto.length) issues.push(`Tiêu ngữ viết "${badMotto[0]}": phải là gạch nối có cách chữ, "Độc lập - Tự do - Hạnh phúc"`);

  const dates = raw.match(/ngày\s+[1-9]\s+tháng|tháng\s+[12]\s+năm|\bngày\s+[1-9]\/\d{1,2}\/\d{4}|\b\d{1,2}\/[12]\/\d{4}/g) || [];
  if (dates.length) issues.push(`ngày dưới 10 hoặc tháng 1, 2 thiếu số 0: ${[...new Set(dates)].slice(0, 3).join(', ')}`);
  const numbers = raw.match(/Số:\s*[1-9]\//g) || [];
  if (numbers.length) issues.push(`số văn bản dưới 10 thiếu số 0: ${numbers[0]}`);

  // Điểm a), b)…: chữ không có trong bảng chữ cái tiếng Việt, hoặc nhảy chữ trong cùng một khoản.
  let prev = -1;
  const badPoints = [];
  for (const l of lines) {
    const m = l.match(/^([a-zđ])\)\s/);
    if (!m) { if (/^\d+\.\s/.test(l)) prev = -1; continue; }
    const i = VI_ALPHABET.indexOf(m[1]);
    if (i < 0) badPoints.push(`${m[1]}) không có trong bảng chữ cái tiếng Việt`);
    else if (i !== 0 && prev >= 0 && i !== prev + 1) badPoints.push(`${VI_ALPHABET[prev]}) rồi ${m[1]}), phải là ${VI_ALPHABET[prev + 1]})`);
    prev = i < 0 ? prev + 1 : i;
  }
  if (badPoints.length) issues.push(`đánh điểm sai: ${[...new Set(badPoints)].slice(0, 3).join('; ')}`);

  const englishNumbers = raw.match(/\b\d{1,3}(,\d{3})+(\.\d+)?\b|\b\d+\.\d{1,2}\s?%/g) || [];
  if (englishNumbers.length) issues.push(`số viết kiểu tiếng Anh: ${[...new Set(englishNumbers)].slice(0, 3).join(', ')}; tiếng Việt dùng dấu chấm tách hàng nghìn, dấu phẩy trước phần thập phân`);

  // Ba khối có dấu cố định: Kính gửi, Nơi nhận (dòng mở bằng gạch nối) và Căn cứ.
  const block = (start, isLine) => {
    const i = lines.findIndex((l) => start.test(l));
    if (i < 0) return null;
    const items = [];
    const first = lines[i].replace(start, '').trim();
    if (first && isLine(first)) items.push(first);
    for (let k = i + 1; k < lines.length && (isLine(lines[k]) || (!lines[k] && !items.length)); k++) if (lines[k]) items.push(lines[k]);
    return items;
  };
  const checkEndings = (name, items) => {
    if (!items || items.length < 2) return;
    const middle = items.slice(0, -1).filter((l) => !/;$/.test(l));
    if (middle.length) issues.push(`khối ${name}: dòng "${middle[0].slice(0, 40)}" phải kết bằng chấm phẩy`);
    if (!/\.$/.test(items[items.length - 1])) issues.push(`khối ${name}: dòng cuối "${items[items.length - 1].slice(0, 40)}" phải kết bằng dấu chấm`);
  };
  const isDashLine = (l) => /^-\s?\S/.test(l);
  const recipients = block(/^Kính gửi:\s*/, isDashLine);
  checkEndings('Kính gửi', recipients);
  const distribution = block(/^Nơi nhận:\s*/, isDashLine);
  checkEndings('Nơi nhận', distribution);
  if (lines.some((l) => /^Kính gửi:/.test(l)) && distribution && distribution.length && !/Như trên/.test(distribution[0])) {
    issues.push('có Kính gửi mà dòng đầu Nơi nhận không phải "- Như trên;"');
  }
  if (distribution && distribution.length && !distribution.some((l) => /Lưu:/.test(l))) issues.push('Nơi nhận thiếu dòng "- Lưu: VT, ..."');
  checkEndings('Căn cứ', block(/^(?=Căn cứ )/, (l) => /^(Căn cứ|Xét|Theo đề nghị|Thực hiện) /.test(l)));

  // Viện dẫn: Phần, Chương, Mục, Điều viết hoa; khoản, điểm viết thường.
  const capitalised = raw.match(/(?<=[\p{Ll},]\s)(Khoản\s+\d+|Điểm\s+[a-zđ])\s+(khoản|Điều)/gu) || [];
  const lowerArticle = raw.match(/(khoản\s+\d+|điểm\s+[a-zđ])\s+điều\s+\d+/giu) || [];
  const citations = [...capitalised, ...lowerArticle.filter((x) => /điều\s+\d+$/.test(x))];
  if (citations.length) issues.push(`viện dẫn: ${[...new Set(citations)].slice(0, 3).map((x) => `"${x}"`).join(', ')}; viết "điểm a khoản 2 Điều 5"`);
  // Khẩu ngữ hay sót (official-documents.md, mục Văn phong, bảng lỗi câu), kể cả khi có chữ chen giữa.
  const casual = [...raw.matchAll(/(?<![\p{L}])(làm xong|\p{L}+ xong(?=[,.;])|đưa(?:\s+[^\s,.;]+){1,4}\s+ra phục vụ|tức là tăng)/giu)].map((m) => m[1]);
  if (casual.length) issues.push(`khẩu ngữ: ${[...new Set(casual)].slice(0, 3).map((x) => `"${x}"`).join(', ')}; xem bảng lỗi câu ở official-documents.md`);
  return issues;
}

function lint(file, forceOfficial) {
  const raw = readText(file);
  const s = extractProse(file);
  const report = [];
  const notes = [];   // thấy nhưng chưa tới mức phải sửa
  // Văn bản hành chính: khuôn mẫu là bắt buộc, đề mục in hoa là quy định, khoản và điểm thường chỉ một câu.
  const official = forceOfficial || /CỘNG\s+H(ÒA|OÀ)\s+XÃ\s+HỘI\s+CHỦ\s+NGHĨA\s+VIỆT\s+NAM/.test(raw);
  if (official) {
    console.log('  (soát theo thể thức văn bản hành chính)');
    report.push(...lintOfficial(raw));
  }

  // 1. gạch dài, gạch vừa: đếm trên cả tệp, kể cả code và tiêu đề
  const DASHES = new RegExp('[' + String.fromCharCode(0x2014, 0x2013) + ']', 'g');
  const dashCount = (raw.match(DASHES) || []).length;
  const dashLines = raw.split('\n').map((l, i) => (l.match(DASHES) ? i + 1 : 0)).filter(Boolean);
  if (dashCount) report.push(`gạch dài hoặc gạch vừa: ${dashCount} chỗ, dòng ${dashLines.slice(0, 8).join(', ')}${dashLines.length > 8 ? '…' : ''}`);

  // 2. cụm nên tránh
  // Lời trích trong ngoặc kép và khối trích không tính: đó là lời người khác, hoặc ví dụ về chính lỗi này. Báo cáo soát trích
  // nguyên văn câu lỗi của người khác, nên mọi phép dò bên dưới chạy trên prose, không chạy trên s.
  const prose = s.replace(/^\s*>.*$/gm, ' ').replace(QUOTED, 'x');
  const lower = prose.toLowerCase();
  // Tệp là lời trả của một người soát văn khi có từ hai mục mang dòng "Vấn đề:".
  const reviewed = /\.html?$/i.test(file) ? [] : reviewItems(raw).filter((it) => it.labelled);
  const isReview = reviewed.length >= 2;
  const rare = [];
  for (const c of RARE_PHRASES) {
    const n = lower.split(c).length - 1;
    if (n) rare.push([c, n]);
  }
  const rareTotal = rare.reduce((a, [, n]) => a + n, 0);
  const wordCount = lower.split(/\s+/).length;
  if (rareTotal) {
    const list = rare.map(([c, n]) => (n > 1 ? `${c} (${n})` : c)).join(', ');
    const dense = !official && (rareTotal / wordCount > 0.004 || rare.some(([, n]) => n >= 3));
    (dense ? report : notes).push(`cụm ít gặp ngoài đời${dense ? ', đang dày' : ''}: ${list}`);
  }
  for (const m of SENTENCE_OPENERS) {
    const n = (prose.match(new RegExp('(^|[.!?]\\s+|\\n)\\s*(?:[-*+]\\s+|\\d{1,3}[.)]\\s+)?' + m, 'g')) || []).length;
    if (n) report.push(`câu mở bằng "${m.trim()}": ${n} lần`);
  }
  const notOnly = (lower.match(/không chỉ[^.?!\n]{1,90}mà còn/g) || []).length;
  if (notOnly >= 2) report.push(`"không chỉ … mà còn": ${notOnly} lần (văn mẫu dùng khuôn này để nâng tầm; người viết thật ít dùng)`);
  // "không phải … mà là" được giữ khi câu đó sửa một cách hiểu sai đã nêu ra (core-rules.md mục 1, machine-tells.md).
  // Câu trước hay chính câu đó có "dễ nghĩ", "tưởng", "nhầm"… thì nhiều khả năng là chỗ được giữ: chỉ ghi chú, không báo.
  let correcting = 0, bare = 0;
  for (const m of prose.matchAll(/không phải[^.?!\n]{1,80}(, | )mà là/gi)) {
    const before = prose.slice(Math.max(0, m.index - 300), m.index).split(/[.!?]\s+/).slice(-2).join(' ');
    if (/dễ nghĩ|hay nghĩ|cứ nghĩ|tưởng|nhầm|hiểu sai|hiểu lầm/i.test(before)) correcting++; else bare++;
  }
  if (bare) report.push(`"không phải … mà là": ${bare} lần (chỉ giữ khi sửa một chỗ hiểu sai có thật)`);
  if (correcting) notes.push(`"không phải … mà là" ngay sau câu nêu một cách hiểu sai: ${correcting} lần, thường là chỗ được giữ; soát văn người khác thì đừng báo là lỗi`);
  // Chữ viết tắt (UBND, ĐHQG) không tính; dòng đứng riêng mà cả dòng in hoa (tên tài liệu theo mẫu) cũng không tính.
  const notTitle = prose.split('\n').filter((l) => !(/\p{Lu}{2,}/u.test(l) && l === l.toUpperCase())).join('\n');
  const shouting = (notTitle.match(/(?<![\p{L}\d])[\p{Lu}]{5,}(?![\p{L}\d])/gu) || []).filter((w) => !/^[A-ZĐ0-9]+$/.test(w));
  if (shouting.length && !official) report.push(`chữ in hoa nhấn mạnh: ${[...new Set(shouting)].slice(0, 5).join(', ')}`);
  if (/\p{Extended_Pictographic}/u.test(prose)) report.push('có emoji');
  // ký hiệu trong câu văn (code và output đã được bỏ ra ở extractProse)
  const ARROWS = new RegExp('[' + [0x2190, 0x2192, 0x21d0, 0x21d2, 0x2713, 0x2714, 0x2717, 0x2718].map((c) => String.fromCharCode(c)).join('') + ']', 'g');
  const symbols = [];
  const count = (re, label) => { const n = (prose.match(re) || []).length; if (n) symbols.push(`${label} (${n})`); };
  count(ARROWS, 'mũi tên hoặc dấu tick');
  count(/~\s?\d/g, 'dấu ~ trước con số');
  count(/\p{L} & \p{L}/gu, 'dấu &');
  count(/(?<![/?&#][^\s]*)[\p{L}\d] ?= ?[\p{L}\d]/gu, 'dấu = giữa hai vế (nhãn "a=b" thì để trong dấu mã)');
  count(/\bv\.v\.?/g, 'v.v.');
  count(/(^|\s)(->|=>|<-|<=>)(?=\s|$)/gm, 'mũi tên "->"');
  count(/(^|\s)[<>]=?\s?\d/gm, 'dấu so sánh trước con số');
  count(/\[(?:_{2,}|x%|cần (?:xác nhận|điền)[^\]]*|điền[^\]]*)\]/g, 'chỗ trống chưa điền');
  if (symbols.length) report.push('ký hiệu trong câu văn, viết thành chữ: ' + symbols.join(', '));
  const emphasis = new Map();
  for (const m of prose.matchAll(EMPHASIS)) emphasis.set(m[1].toLowerCase(), (emphasis.get(m[1].toLowerCase()) ?? 0) + 1);
  if (emphasis.size) notes.push(`chữ nhấn thừa: ${[...emphasis].map(([w, n]) => (n > 1 ? `${w} (${n})` : w)).join(', ')}; bỏ khi câu không mất nghĩa (machine-tells.md, bảng D)`);
  const typos = TYPOS.filter((t) => lower.includes(t));
  if (typos.length) report.push(`lỗi chính tả hay gặp: ${typos.join(', ')} (common-errors.md, Lỗi dùng từ)`);
  const loneKiem = (prose.match(/(?<![\p{L}])kiểm(?![\p{L}])(?!\s+(?:tra|thử|kê|soát|định|duyệt|chứng|nghiệm))/giu) || []).length;
  if (loneKiem) report.push(`"kiểm" đứng lẻ ${loneKiem} lần: chỉ dùng trong từ ghép (kiểm thử, kiểm kê), còn lại viết "kiểm tra"`);
  const wrapUps = (prose.match(/(^|\n)\s*(Nhớ gọn|Nói ngắn gọn|Nói tóm lại|Tóm gọn lại|Chốt lại)[:,]/g) || []).length;
  if (wrapUps) report.push(`câu chốt kiểu "Nhớ gọn:": ${wrapUps} lần (hết ý thì dừng)`);

  // 3. số đo câu và đoạn
  // Khối thường là đoạn văn. Khối danh sách thì mỗi mục là một đơn vị riêng: mục dài (như mục của một báo cáo soát) vẫn được
  // đo câu, nhưng không tính là đoạn khi đếm số câu mỗi đoạn, đầu đoạn lặp, đoạn mở bằng câu hỏi.
  const blocks = [], items = [];
  for (const block of prose.split(/\n\s*\n/)) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length || /^[#>|]/.test(lines[0])) continue;
    if (!LIST_MARK.test(lines[0])) { blocks.push(lines.join(' ')); continue; }
    let item = [];
    const flush = () => { if (item.length) items.push(joinItem(item)); item = []; };
    for (const l of lines) {
      if (LIST_MARK.test(l)) { flush(); item.push(l.replace(LIST_MARK, '')); } else item.push(l);
    }
    flush();
  }
  const long = (d) => d.split(' ').length >= 25;
  const paragraphs = blocks.filter(long);
  const listItems = items.filter(long);
  const splitSentences = (d) => d.split(/(?<=[.!?…])\s+(?=[\p{Lu}"(])/u).filter((c) => c.split(' ').length >= 3);
  let sentences = 0, words = 0, questions = 0, shortOnes = 0, colons = 0, paraSentences = 0;
  const opensWithQuestion = [];
  for (const d of [...paragraphs, ...listItems]) {
    const list = splitSentences(d);
    sentences += list.length;
    for (const c of list) {
      const n = c.split(' ').length;
      words += n;
      if (c.trim().endsWith('?')) questions++;
      if (n <= 6) shortOnes++;
    }
  }
  // Đoạn mở bằng nhãn cố định của báo cáo ("Trên site:", "Tài liệu gốc:") là khung bắt buộc, không tính khi đếm câu mỗi
  // đoạn và đầu đoạn lặp.
  const plainParagraphs = paragraphs.filter((d) => !REPORT_LABEL.test(d));
  let plainSentences = 0;
  for (const d of paragraphs) {
    const list = splitSentences(d);
    paraSentences += list.length;
    if (!REPORT_LABEL.test(d)) plainSentences += list.length;
    // Dấu hai chấm chỉ đếm trong đoạn văn: mục danh sách kiểu "tên: giải thích" là cách viết bình thường của danh sách.
    // Không đếm dấu hai chấm sau chỗ ghi vị trí ("dòng 9:", "trang 17:") và ngay trước lời trích (lời trích đã thành "x").
    colons += list.filter((c) => /:\s+\p{Ll}/u.test(c.replace(/(dòng|trang|mục|bước|hàng|cột)\s+\d+[a-z]?\s*:/giu, '').replace(/:\s+x(?![\p{L}])/gu, ''))).length;
    opensWithQuestion.push(list.length > 0 && list[0].trim().endsWith('?'));
  }
  if (sentences && !official) {
    const avg = words / sentences;
    const inItems = listItems.length ? ` (kể cả ${listItems.length} mục danh sách dài)` : '';
    const perPara = paragraphs.length ? paraSentences / paragraphs.length : 0;
    const plainPerPara = plainParagraphs.length ? plainSentences / plainParagraphs.length : 0;
    console.log(`  ${paragraphs.length} đoạn, ${sentences} câu${inItems} · ${avg.toFixed(1)} tiếng mỗi câu · ${perPara.toFixed(1)} câu mỗi đoạn · ${(100 * questions / sentences).toFixed(1)}% là câu hỏi`);
    if (avg < 15) report.push(`câu trung bình chỉ ${avg.toFixed(1)} tiếng: xem có đang chặt câu cụt và bỏ từ nối không`);
    // Mục danh sách nhiều hơn đoạn văn (lời soát, hướng dẫn) thì vài đoạn còn lại chỉ là câu dẫn, đếm câu mỗi đoạn không có nghĩa.
    if (plainParagraphs.length >= 2 && listItems.length <= paragraphs.length && plainPerPara < 2.2) report.push(`đoạn trung bình chỉ ${plainPerPara.toFixed(1)} câu: xem các đoạn có rời rạc không`);
    // Văn bản dưới năm câu (lời trả ba câu có một câu đường dẫn) thì tỉ lệ câu ngắn không nói được gì.
    if (sentences >= 5 && shortOnes / sentences > 0.25) report.push(`${Math.round(100 * shortOnes / sentences)}% số câu dài không quá 6 tiếng`);
    if (paraSentences && colons / paraSentences > 0.2) report.push(`${colons} câu có dấu hai chấm theo sau là lời giải thích: xem có đang dùng nó làm khung không`);
  }
  // Câu mở bài: khối văn đầu tiên, dù ngắn hay dài.
  if (blocks.length && SCHOOL_OPENING.test(blocks[0])) report.push(`mở bài bằng khuôn "Trong thời đại…", "Trong xã hội hiện đại…" ("${blocks[0].slice(0, 50)}…"): mở bằng việc đang bàn và một thứ cụ thể`);
  if (paragraphs.length > 2 && /(^|[.!?]\s)(Hãy|Tóm lại|Mỗi (người|chúng ta)|Chúng ta (cần|hãy))/.test(paragraphs[paragraphs.length - 1])) report.push('kết bằng lời kêu gọi hoặc "Tóm lại": hết ý thì dừng, hoặc quay về câu mở');
  let run = 0, longest = 0;
  for (const q of opensWithQuestion) { run = q ? run + 1 : 0; longest = Math.max(longest, run); }
  if (longest >= 3) report.push(`${longest} đoạn liền nhau cùng mở bằng câu hỏi`);

  // Câu mở bằng "Với…", "Qua…", "Đối với…" mà không có dấu phẩy nào thường đã mất chủ ngữ
  // ("Với bản báo cáo này đã cho thấy…"; common-errors.md, dòng Thiếu chủ ngữ).
  const noSubject = [];
  for (const d of [...blocks, ...items]) {
    for (const c of d.split(/(?<=[.!?…])\s+/)) {
      if (/^(Với|Qua|Đối với|Thông qua|Bằng việc|Nhờ có)\s/.test(c) && !/,| thì /.test(c) && c.split(' ').length >= 5) noSubject.push(c.slice(0, 50));
    }
  }
  // Câu quá dài, ẩn dụ mở bằng "Giống…:", khuôn "vì … còn … nên" (core-rules.md mục Trình bày, sentences-and-paragraphs.md).
  const longOnes = [], likeColon = [], whyElseSo = [];
  for (const d of [...blocks, ...items]) {
    for (const c of d.split(/(?<=[.!?…])\s+/)) {
      const n = c.split(' ').length;
      if (n > 40) longOnes.push(`"${c.slice(0, 40)}…" (${n} tiếng)`);
      if (/^Giống\s[^.?!:]{0,40}:/.test(c)) likeColon.push(`"${c.slice(0, 50)}…"`);
      if (/(?<![\p{L}])vì\s.+(?<![\p{L}])còn\s.+(?<![\p{L}])nên\s/u.test(c)) whyElseSo.push(`"${c.slice(0, 60)}…"`);
    }
  }
  if (likeColon.length) report.push(`câu mở ẩn dụ bằng "Giống…:" không chủ ngữ: ${likeColon.slice(0, 3).join(', ')}; chủ ngữ là thứ đang bàn ("Chuyện của X giống…")`);
  if (longOnes.length) notes.push(`câu quá 40 tiếng: ${longOnes.slice(0, 3).join(', ')}`);
  if (whyElseSo.length) notes.push(`câu có "vì … còn … nên": ${whyElseSo.slice(0, 3).join(', ')}; bỏ vế "vì" rồi đọc lại, vế trước "nên" phải dẫn tới vế sau`);
  // Câu mang từ ba đoạn mã trở lên, và số tiếng của cả tệp (core-rules.md điều 5 và mục Trình bày). Đếm trên Markdown gốc,
  // vì prose đã thay đoạn mã bằng "x".
  if (!/\.html?$/i.test(file)) {
    const md = raw.replace(/\r\n/g, '\n').replace(/^---[\s\S]*?\n---\n/, '').replace(/```[\s\S]*?```/g, ' ');
    const body = md.split('\n').filter((l) => !/^\s*(#|\|)/.test(l)).join('\n');
    const codeHeavy = body.split(/\n\s*\n|\n\s*(?:[-*+]|\d{1,3}[.)])\s+|(?<=[.!?…])\s+/).filter((c) => (c.match(/`[^`\n]+`/g) || []).length >= 3);
    if (codeHeavy.length && !official) report.push(`${codeHeavy.length} câu mang từ ba đoạn mã trở lên: "${codeHeavy[0].replace(/\s+/g, ' ').slice(0, 60)}…"; tách câu, mỗi câu không quá hai đoạn mã`);
    const countWords = (t) => t.replace(/^\s*([-*+]|\d{1,3}[.)])\s+/gm, ' ').split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;
    console.log(`  ${countWords(body)} tiếng, không tính nhan đề, đề mục, bảng, khối code; bỏ cả đoạn mã trong dòng thì ${countWords(body.replace(/`[^`\n]*`/g, ' '))}`);
  }
  if (noSubject.length) report.push(`câu mở bằng "Với…", "Qua…" mà không có dấu phẩy, dễ thiếu chủ ngữ: ${noSubject.slice(0, 3).map((c) => `"${c}…"`).join(', ')}`);

  // Một thứ nhiều tên trong cùng văn bản (core-rules.md mục 5).
  for (const group of NAME_GROUPS) {
    const found = group.map((re) => prose.match(re) || []).filter((m) => m.length);
    if (found.length < 2) continue;
    const list = found.map((m) => `${m[0]} (${m.length})`).join(', ');
    (found.length >= 3 ? report : notes).push(`một thứ nhiều tên: ${list}; chọn một tên dùng suốt văn bản`);
  }

  // Chữ chỉ buổi ("mỗi đêm", "buổi sáng") đứng cùng đoạn với giờ cụ thể của buổi khác.
  const FITS = { đêm: (h) => h >= 20 || h <= 6, tối: (h) => h >= 17 || h <= 1, sáng: (h) => h >= 4 && h <= 11, trưa: (h) => h >= 10 && h <= 14, chiều: (h) => h >= 12 && h <= 18 };
  const clashes = [], quotedClashes = [];
  for (const d of [...blocks, ...items]) {
    const inItem = items.includes(d);
    const hours = [];
    const rest = d.replace(HOUR, (all, at, num, period) => {
      if (!period && !at && !/:\d{2}/.test(all)) return all;   // "mất 2 giờ" là khoảng thời gian, không phải giờ trong ngày
      let h = Number(num);
      const p = (period || '').toLowerCase();
      if ((p === 'chiều' || p === 'tối') && h < 12) h += 12;
      if (p === 'trưa' && h < 6) h += 12;
      if ((p === 'đêm' || p === 'khuya') && h >= 6 && h < 12) h += 12;
      if (h <= 24) hours.push([all.trim(), h % 24]);
      return ' ';
    });
    if (!hours.length) continue;
    for (const w of rest.matchAll(PERIOD_WORD)) {
      const period = (w[1] || w[2]).toLowerCase().replace('khuya', 'đêm');
      const clash = hours.find(([, h]) => !FITS[period](h));
      if (clash) { (isReview && inItem ? quotedClashes : clashes).push(`"${w[0].trim()}" với "${clash[0]}"`); break; }
    }
  }
  if (clashes.length) report.push(`chữ chỉ buổi đứng cùng đoạn với giờ của buổi khác: ${clashes.slice(0, 3).join(', ')}; đọc lại xem chữ chỉ buổi còn đúng sau khi đổi giờ, đổi múi giờ không`);
  // Trong mục của lời soát, hai thứ đó thường được đặt cạnh nhau có chủ ý để chỉ ra lỗi của tệp đang soát.
  if (quotedClashes.length) notes.push(`chữ chỉ buổi cạnh giờ của buổi khác trong mục soát: ${quotedClashes.slice(0, 3).join(', ')}; nếu là chỗ đang chỉ lỗi thì để`);

  // Hai ý chọi nhau trong một câu: "kịp thời" (đã làm đúng lúc) cùng câu với "lẽ ra" (chưa làm).
  const contradictions = [];
  for (const d of [...blocks, ...items]) {
    for (const c of d.split(/(?<=[.!?…])\s+/)) if (SHOULD_HAVE.test(c) && ON_TIME.test(c)) contradictions.push(c.slice(0, 70));
  }
  if (contradictions.length) report.push(`câu vừa nói việc đã làm đúng lúc vừa nói lẽ ra phải làm: ${contradictions.slice(0, 3).map((c) => `"${c}…"`).join(', ')}; đó là lỗi hai ý chọi nhau trong một câu (common-errors.md), bỏ một trong hai ý; soát văn người khác thì gọi đúng tên lỗi này, đừng chỉ bảo bỏ câu`);

  // Cùng một việc đi với hai con số khác nhau.
  const amounts = new Map();
  for (const m of prose.matchAll(AMOUNT)) {
    const word = m[1].toLowerCase();
    if (AMOUNT_SKIP.has(word)) continue;
    const key = `${word} … ${m[3].toLowerCase()}`;
    if (!amounts.has(key)) amounts.set(key, new Set());
    amounts.get(key).add(`${word} ${m[2]} ${m[3]}`);
  }
  const mismatched = [...amounts.values()].filter((v) => v.size >= 2).map((v) => [...v].map((x) => `"${x}"`).join(' với '));
  if (mismatched.length) report.push(`cùng một việc đi với hai con số khác nhau: ${mismatched.slice(0, 3).join('; ')}; nếu là một thứ thì hai chỗ vênh nhau, trích cả hai câu và hỏi tác giả số nào đúng, đừng tự chọn`);

  // Lời trả của người soát văn: phần máy kiểm được của dòng "Soát mà không sửa" trong SKILL.md.
  if (isReview) {
    const noQuote = reviewed.filter((it) => !/["“`]/.test(it.head)).map((it) => it.n);
    if (noQuote.length) report.push(`mục soát không trích câu gốc: mục ${noQuote.join(', ')}; chỗ thiếu thì trích câu hay lệnh liền trước nơi cần thêm và ghi "thêm sau câu …"`);
    const merged = reviewed.filter((it) => /(^|[.!?]\s+)(Thêm nữa|Ngoài ra|Còn nữa|Bên cạnh đó|Một chỗ khác)[ ,]/.test(it.problem)).map((it) => it.n);
    if (merged.length) report.push(`mục soát gộp hai chỗ bằng "Thêm nữa", "Ngoài ra": mục ${merged.join(', ')}; tách thành hai mục, mỗi mục một câu gốc`);
    const guesses = [];
    for (const it of reviewed) {
      for (const m of it.problem.replace(QUOTED, 'x').matchAll(/(?<![\p{L}])(một nửa|hàng loạt|chắc chắn|luôn luôn|không bao giờ|toàn bộ)(?![\p{L}])/giu)) guesses.push(`"${m[1]}" (mục ${it.n})`);
    }
    if (guesses.length) notes.push(`lượng, mức chắc chắn trong lời tả hậu quả: ${guesses.slice(0, 4).join(', ')}; chỉ nói phần chắc (lỗi gì, dừng hay chạy tiếp), lượng ước chừng thì bỏ hoặc thêm "có thể"`);
    const body = raw.replace(/```[\s\S]*?```/g, ' ').replace(QUOTED, 'x');
    if (/(?<![\p{L}])(script|lint)(?![\p{L}])/iu.test(body) && !/\d+\s*(chỗ|báo|lỗi)/u.test(body)) {
      report.push('lời soát nhắc tới script mà không nói nó báo mấy chỗ: ghi script báo N chỗ, nhận chỗ nào, bỏ chỗ nào và vì sao (báo nhầm, ghi chú · là chỗ thường giữ)');
    }
  }

  // 4. đầu đoạn lặp
  const starts = plainParagraphs.map((d) => d.split(' ').slice(0, 2).join(' ').toLowerCase());
  for (let i = 2; i < starts.length; i++) {
    if (starts[i] === starts[i - 1] && starts[i] === starts[i - 2]) { report.push(`ba đoạn liền cùng mở bằng "${starts[i]}"`); break; }
  }
  // 5. gạch đầu dòng mở bằng nhãn in đậm (markdown)
  const labelled = (raw.match(/^\s*[-*]\s+\*\*[^*]+\*\*[:.]?\s/gm) || []).length;
  const bullets = (raw.match(/^\s*[-*]\s+\S/gm) || []).length;
  if (bullets >= 6 && labelled / bullets > 0.6) report.push(`${labelled}/${bullets} gạch đầu dòng mở bằng nhãn in đậm`);

  for (const n of notes) console.log('  · ' + n + ' (có ít, xem từng chỗ rồi quyết)');
  if (report.length) for (const r of report) console.log('  - ' + r);
  else console.log('  không thấy chỗ nào máy đếm được mà cần sửa');
  return report.length;
}

const args = process.argv.slice(2);
const forceOfficial = args.includes('--official');
const files = args.filter((a) => a !== '--official');
const USAGE = 'Dùng: node lint.mjs [--official] <tệp> [tệp khác…]   ("-" là đọc từ stdin)\n'
  + 'Soát văn của người khác thì chạy trên tệp đó và trên chính lời soát; lời soát (mục có dòng "Vấn đề:") được kiểm thêm câu gốc,\n'
  + 'mục gộp hai chỗ, lượng ước chừng và câu nói script báo gì.';
if (args.some((a) => a === '--help' || a === '-h')) { console.log(USAGE); process.exit(0); }
if (!files.length) { console.log(USAGE); process.exit(1); }
const missing = files.filter((f) => f !== '-' && !fs.existsSync(f));
if (missing.length) { console.error(`Không thấy tệp: ${missing.join(', ')}\n${USAGE}`); process.exit(1); }
const docx = files.filter((f) => /\.docx$/i.test(f));
if (docx.length) {
  console.error(`Chưa đọc được tệp Word: ${docx.join(', ')}. Dựng lại kèm --text <tệp.md> (report-docx.mjs, official-doc-docx.mjs) rồi soát tệp .md đó.`);
  process.exit(1);
}
let total = 0;
for (const f of files) { console.log(f); total += lint(f, forceOfficial); }
console.log(`\n${total} chỗ cần xem lại. Xong bước này vẫn phải tự đọc hai lượt: người mới, và người bắt văn máy.`);
console.log('Soát văn của người khác thì ghi trong lời trả: script báo mấy chỗ, nhận chỗ nào, bỏ chỗ nào và vì sao.');
