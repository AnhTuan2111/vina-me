// Lượt hỏi khi dựng bộ nhớ (install-memory.mjs): hỏi trơn từng dòng, hoặc lấy câu trả lời từ tệp --answers.
// Bản trước có giao diện tô màu kiểu powerline và tự mở cửa sổ PowerShell khi không có TTY; cả hai từng hỏng trên máy lạ
// (phông thiếu ký tự, PowerShell bị chặn), nên bỏ.

import path from 'node:path';
import readline from 'node:readline/promises';
import { valueOf, read, log } from './context.mjs';

const LENGTHS = {
  '1': 'Trả lời ngắn: hỏi gì đáp nấy, vài câu. Thấy điều cần nói thêm ngoài câu hỏi thì một dòng ở cuối.',
  '2': 'Trả lời vừa phải: đủ để làm theo được, không giảng lại thứ người dùng đã biết.',
  '3': 'Trả lời đủ chi tiết: nói lý do và từng bước; chủ đề mới thì giảng từ khái niệm.',
};

const YES_NO = [['Có', 'y'], ['Không', 'n']];
const QUESTIONS = [
  { key: 'name', q: 'Bạn muốn agent gọi bạn là gì?', hint: 'ví dụ: anh Nam, chị Lan' },
  { key: 'role', q: 'Bạn làm vai trò gì?', hint: 'BA, tester, dev, quản lý dự án...' },
  { key: 'writesFor', q: 'Bạn hay viết văn bản cho ai?', hint: 'khách hàng, sếp, đội dev...' },
  { key: 'length', q: 'Bạn muốn agent trả lời thế nào?', choices: [['Ngắn gọn', '1'], ['Vừa phải', '2'], ['Đủ chi tiết', '3']] },
  { key: 'avoid', q: 'Có điều gì bạn không muốn agent làm không?', hint: 'bỏ trống nếu chưa có' },
  { key: 'teamRules', q: 'Tệp luật chung của đội, nếu có?', hint: 'đường dẫn tệp, bỏ trống nếu chưa có' },
  { key: 'learnFromSessions', q: 'Cho agent đọc các phiên Claude Code, Codex cũ để soạn nháp bộ nhớ cho bạn duyệt?', hint: 'agent đọc lịch sử thì nội dung được gửi lên nhà cung cấp mô hình; trước khi đọc agent sẽ hỏi lại', choices: YES_NO },
];

const answersFile = valueOf('--answers') ? JSON.parse(read(path.resolve(valueOf('--answers')))) : null;

// Đọc qua iterator vì rl.question làm rơi dòng có sẵn trong stdin (khi câu trả lời được dẫn vào bằng pipe).
let lineReader;
async function ask(q) {
  if (!lineReader) lineReader = readline.createInterface({ input: process.stdin, output: process.stdout });
  lineReader.iter ??= lineReader[Symbol.asyncIterator]();
  const choiceText = q.choices && q.choices.map(([label, v]) => `${v} ${label.toLowerCase()}`).join(', ') + ', bỏ trống là cái đầu';
  const extra = [choiceText, q.hint].filter(Boolean).join('; ');
  process.stdout.write(`${q.q}${extra ? ` (${extra})` : ''} `);
  const { value, done } = await lineReader.iter.next();
  const v = done ? '' : value.trim();
  return q.choices && !v ? q.choices[0][1] : v;
}

// Không có TTY (agent chạy script thay người dùng) và không có tệp trả lời thì dừng trước khi ghi gì, kèm cách làm tiếp.
function requireTty() {
  if (answersFile || process.stdin.isTTY) return;
  console.error('Không hỏi được vì không chạy trong cửa sổ dòng lệnh. Ghi câu trả lời vào một tệp JSON có các khoá');
  console.error(`${QUESTIONS.map((q) => q.key).join(', ')} rồi chạy lại với --answers <tệp>.`);
  process.exit(1);
}

async function getAnswers() {
  if (answersFile) return answersFile;
  requireTty();
  log(`${QUESTIONS.length} câu. Câu nào chưa nghĩ ra thì bỏ trống, agent ghi dần sau.\n`);
  const answers = {};
  for (const q of QUESTIONS) answers[q.key] = await ask(q);
  return answers;
}

function closePrompt() { lineReader?.close(); }

export { LENGTHS, YES_NO, QUESTIONS, answersFile, ask, requireTty, getAnswers, closePrompt };
