#!/usr/bin/env node
// Soát phần máy đếm được trong một văn bản tiếng Việt (.md, .txt, .html).
// Dùng: node lint.mjs [--official] <tệp> [tệp khác…]
// Tệp có Quốc hiệu, hoặc chạy với --official, thì soát theo thể thức văn bản hành chính (references/official-documents.md).
// Độ dài câu đếm theo tiếng (âm tiết, tách theo dấu cách), như cách người Việt vẫn đếm "chữ".
// Script chỉ bắt dấu hiệu bề mặt. Nó không biết câu nào rời câu nào, nên vẫn phải tự đọc lại hai lượt.
import fs from 'node:fs';

// Không có cụm nào bị cấm. Đây là những cụm ngoài đời ít người nói khi giải thích cho nhau,
// nên script đếm để người viết xem lại: một lần, đúng chỗ thì để; lặp lại thì sửa.
const RARE_PHRASES = [
  'do đó', 'hệ quả là', 'bởi vậy', 'nói cách khác', 'thật ra', 'thực chất', 'về bản chất',
  'hành trình', 'điều quan trọng nhất là', 'điều đáng chú ý là', 'đóng vai trò', 'mang tính',
  'thông qua việc', 'thực hiện việc', 'chúng ta', 'bên cạnh đó', 'qua đó', 'đồng thời',
  'sâu sắc', 'mạnh mẽ', 'toàn diện', 'liền mạch', 'phải chăng', 'không chỉ',
];
const SENTENCE_OPENERS = ['Hãy ', 'Tóm lại', 'Nhìn chung', 'Có thể nói', 'Không thể phủ nhận', 'Thiết nghĩ'];
// Khuôn mở bài của văn mẫu nhà trường
const SCHOOL_OPENING = /^(Trong (xã hội|cuộc sống|thời đại|bối cảnh|thế giới)[^.]{0,60}(hiện đại|hiện nay|ngày nay|công nghệ)|Ngày nay,|Từ xưa đến nay|Cuộc sống (là|luôn))/i;

function extractProse(file) {
  let s = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
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
  return issues;
}

function lint(file, forceOfficial) {
  const raw = fs.readFileSync(file, 'utf8');
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
  if (dashCount) report.push(`gạch dài hoặc gạch vừa: ${dashCount} chỗ`);

  // 2. cụm nên tránh
  // Lời trích trong ngoặc kép và khối trích không tính: đó là lời người khác, hoặc ví dụ về chính lỗi này.
  const lower = s.replace(/^\s*>.*$/gm, ' ').replace(/"[^"\n]{0,300}"/g, ' ').toLowerCase();
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
    const n = (s.match(new RegExp('(^|[.!?]\\s+|\\n)' + m, 'g')) || []).length;
    if (n) report.push(`câu mở bằng "${m.trim()}": ${n} lần`);
  }
  const notOnly = (lower.match(/không chỉ[^.?!\n]{1,90}mà còn/g) || []).length;
  if (notOnly >= 2) report.push(`"không chỉ … mà còn": ${notOnly} lần (văn mẫu dùng khuôn này để nâng tầm; người viết thật ít dùng)`);
  const notButRather = (s.match(/không phải[^.?!\n]{1,80}(, | )mà là/gi) || []).length;
  if (notButRather) report.push(`"không phải … mà là": ${notButRather} lần (chỉ giữ khi sửa một chỗ hiểu sai có thật)`);
  const shouting = (s.match(/(?<![\p{L}\d])[\p{Lu}]{5,}(?![\p{L}\d])/gu) || []).filter((w) => !/^[A-Z0-9]+$/.test(w));
  if (shouting.length && !official) report.push(`chữ in hoa nhấn mạnh: ${[...new Set(shouting)].slice(0, 5).join(', ')}`);
  if (/\p{Extended_Pictographic}/u.test(s)) report.push('có emoji');
  // ký hiệu trong câu văn (code và output đã được bỏ ra ở extractProse)
  const ARROWS = new RegExp('[' + [0x2190, 0x2192, 0x21d0, 0x21d2, 0x2713, 0x2714, 0x2717, 0x2718].map((c) => String.fromCharCode(c)).join('') + ']', 'g');
  const symbols = [];
  const count = (re, label) => { const n = (s.match(re) || []).length; if (n) symbols.push(`${label} (${n})`); };
  count(ARROWS, 'mũi tên hoặc dấu tick');
  count(/~\s?\d/g, 'dấu ~ trước con số');
  count(/\p{L} & \p{L}/gu, 'dấu &');
  count(/\p{L} = \p{L}/gu, 'dấu = giữa hai vế');
  count(/\bv\.v\.?/g, 'v.v.');
  if (symbols.length) report.push('ký hiệu trong câu văn, viết thành chữ: ' + symbols.join(', '));
  const wrapUps = (s.match(/(^|\n)\s*(Nhớ gọn|Nói ngắn gọn|Nói tóm lại|Tóm gọn lại|Chốt lại)[:,]/g) || []).length;
  if (wrapUps) report.push(`câu chốt kiểu "Nhớ gọn:": ${wrapUps} lần (hết ý thì dừng)`);

  // 3. số đo câu và đoạn
  const paragraphs = s.split(/\n\s*\n/).map((d) => d.replace(/\s+/g, ' ').trim())
    .filter((d) => d.split(' ').length >= 25 && !/^[#>|\-*\d]/.test(d));
  const splitSentences = (d) => d.split(/(?<=[.!?…])\s+(?=[\p{Lu}"(])/u).filter((c) => c.split(' ').length >= 3);
  let sentences = 0, words = 0, questions = 0, shortOnes = 0, colons = 0;
  const opensWithQuestion = [];
  for (const d of paragraphs) {
    const list = splitSentences(d);
    sentences += list.length;
    for (const c of list) {
      const n = c.split(' ').length;
      words += n;
      if (c.trim().endsWith('?')) questions++;
      if (n <= 6) shortOnes++;
      if (/:\s+\p{Ll}/u.test(c)) colons++;
    }
    opensWithQuestion.push(list.length > 0 && list[0].trim().endsWith('?'));
  }
  if (sentences && !official) {
    const avg = words / sentences, perPara = sentences / paragraphs.length;
    console.log(`  ${paragraphs.length} đoạn, ${sentences} câu · ${avg.toFixed(1)} tiếng mỗi câu · ${perPara.toFixed(1)} câu mỗi đoạn · ${(100 * questions / sentences).toFixed(1)}% là câu hỏi`);
    if (avg < 15) report.push(`câu trung bình chỉ ${avg.toFixed(1)} tiếng: xem có đang chặt câu cụt và bỏ từ nối không`);
    if (perPara < 2.2) report.push(`đoạn trung bình chỉ ${perPara.toFixed(1)} câu: xem các đoạn có rời rạc không`);
    if (shortOnes / sentences > 0.25) report.push(`${Math.round(100 * shortOnes / sentences)}% số câu dài không quá 6 tiếng`);
    if (colons / sentences > 0.2) report.push(`${colons} câu có dấu hai chấm theo sau là lời giải thích: xem có đang dùng nó làm khung không`);
  }
  if (paragraphs.length && SCHOOL_OPENING.test(paragraphs[0])) report.push('mở bài bằng khuôn "Trong xã hội hiện đại…": mở bằng việc đang bàn và một thứ cụ thể');
  if (paragraphs.length > 2 && /(^|[.!?]\s)(Hãy|Tóm lại|Mỗi (người|chúng ta)|Chúng ta (cần|hãy))/.test(paragraphs[paragraphs.length - 1])) report.push('kết bằng lời kêu gọi hoặc "Tóm lại": hết ý thì dừng, hoặc quay về câu mở');
  let run = 0, longest = 0;
  for (const q of opensWithQuestion) { run = q ? run + 1 : 0; longest = Math.max(longest, run); }
  if (longest >= 3) report.push(`${longest} đoạn liền nhau cùng mở bằng câu hỏi`);

  // 4. đầu đoạn lặp
  const starts = paragraphs.map((d) => d.split(' ').slice(0, 2).join(' ').toLowerCase());
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
if (!files.length) { console.log('Dùng: node lint.mjs [--official] <tệp> [tệp khác…]'); process.exit(1); }
let total = 0;
for (const f of files) { console.log(f); total += lint(f, forceOfficial); }
console.log(`\n${total} chỗ cần xem lại. Xong bước này vẫn phải tự đọc hai lượt: người mới, và người bắt văn máy.`);
