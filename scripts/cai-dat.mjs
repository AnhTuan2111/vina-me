#!/usr/bin/env node
// Cài vina-me cho các agent trên máy và dựng bộ nhớ dùng chung ở ~/agent-memory. Chạy một lần.
//
//   node scripts/cai-dat.mjs                       hỏi vài câu rồi cài
//   node scripts/cai-dat.mjs --tra-loi tl.json     không hỏi, lấy câu trả lời từ tệp (agent chạy thay người dùng)
//   node scripts/cai-dat.mjs --dong-bo             chép lại bộ nhớ vào ~/.codex/AGENTS.md sau khi sửa
//   node scripts/cai-dat.mjs --doi luat-doi.md     thay luật chung của đội trong bộ nhớ đã có
//
// Thêm --home <thư mục> để thử trên một thư mục home giả, --khong-chep-skill để chỉ dựng bộ nhớ,
// --claude hoặc --codex để nối bộ nhớ vào agent đó dù chưa thấy thư mục cấu hình của nó.
//
// Luồng: chép skill vào thư mục skill của từng agent, dựng ~/agent-memory nếu chưa có (đã có thì giữ nguyên),
// rồi nối vào agent. Claude Code nạp bộ nhớ qua dòng @ trong ~/.claude/CLAUDE.md. Codex không có cú pháp nạp
// tệp khác, nên nhận một bản chép nằm giữa hai dòng đánh dấu trong ~/.codex/AGENTS.md; bản chép này phải đồng bộ
// lại bằng --dong-bo mỗi khi bộ nhớ đổi. Tệp nào sắp bị sửa thì được sao lưu một lần thành <tệp>.truoc-vina-me.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const hasFlag = (name) => args.includes(name);
const valueOf = (name) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : undefined;
};

const realHome = os.homedir();
const home = path.resolve(valueOf('--home') ?? realHome);
const skillSrc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templates = path.join(skillSrc, 'mau-bo-nho');
const memDir = path.join(home, 'agent-memory');
const claudeDir = path.join(home, '.claude');
const codexDir = path.join(home, '.codex');
const claudeSkill = path.join(claudeDir, 'skills', 'vina-me');
// Tài liệu Codex hiện ghi skill toàn cục ở ~/.agents/skills; bản cũ dùng ~/.codex/skills. Chép cả hai cho chắc.
const codexSkills = [path.join(home, '.agents', 'skills', 'vina-me'), path.join(codexDir, 'skills', 'vina-me')];

const START = '<!-- bộ nhớ vina-me: bắt đầu. Chép từ ~/agent-memory, sửa ở đó rồi chạy đồng bộ, đừng sửa ở đây. -->';
const END = '<!-- bộ nhớ vina-me: hết -->';

const exists = (p) => fs.existsSync(p);
const read = (p) => fs.readFileSync(p, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
const write = (p, text) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text, 'utf8'); };
const slash = (p) => p.split(path.sep).join('/');
const today = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};
const log = (s) => console.log(s);

function backupOnce(file) {
  const bak = `${file}.truoc-vina-me`;
  if (exists(file) && !exists(bak)) { fs.copyFileSync(file, bak); log(`  sao lưu ${file} thành ${path.basename(bak)}`); }
}

// Đường dẫn ghi trong tệp cấu hình: dùng ~ khi đang cài cho home thật, đường dẫn đầy đủ khi thử trên home giả.
const shown = (p) => (home === realHome ? '~/' + slash(path.relative(home, p)) : slash(p));

const useClaude = hasFlag('--claude') || exists(claudeDir);
const useCodex = hasFlag('--codex') || exists(codexDir);

// Bản chép cho Codex: tệp cửa vào bỏ ba dòng @, rồi nối nội dung ba tệp kia vào sau.
function codexBlock() {
  const entry = read(path.join(memDir, 'AGENTS.md')).replace(
    /^@user\.md\n[\s\S]*?^- `doi\.md`[^\n]*\n/m,
    `Bộ nhớ gốc nằm ở \`${shown(memDir)}/\`. Khối này chỉ là bản chép: ghi nhớ thì sửa tệp gốc ở đó, không sửa khối này.\n` +
      'Ba phần cuối khối là `user.md` (người dùng là ai), `memory.md` (cách làm việc) và `doi.md` (luật của đội).\n',
  );
  const parts = ['user.md', 'memory.md', 'doi.md']
    .filter((f) => exists(path.join(memDir, f)))
    .map((f) => `<!-- ${f} -->\n${read(path.join(memDir, f)).trim()}`);
  return [START, entry.trim(), ...parts, END].join('\n\n');
}

function syncCodex() {
  const file = path.join(codexDir, 'AGENTS.md');
  const block = codexBlock();
  let text = exists(file) ? read(file) : '';
  const a = text.indexOf(START);
  const b = text.indexOf(END);
  if (a >= 0 && b > a) text = text.slice(0, a) + block + text.slice(b + END.length);
  else { backupOnce(file); text = (text.trim() ? text.trimEnd() + '\n\n' : '') + block + '\n'; }
  write(file, text);
  log(`  Codex: đã chép bộ nhớ vào ${file}`);
}

function linkClaude() {
  const file = path.join(claudeDir, 'CLAUDE.md');
  const line = `@${shown(path.join(memDir, 'AGENTS.md'))}`;
  const text = exists(file) ? read(file) : '';
  if (text.split('\n').some((l) => l.trim() === line)) { log(`  Claude Code: ${file} đã có dòng ${line}`); return; }
  backupOnce(file);
  write(file, (text.trim() ? text.trimEnd() + '\n\n' : '') + line + '\n');
  log(`  Claude Code: thêm dòng ${line} vào ${file}`);
}

function copySkill(target) {
  if (path.resolve(target) === skillSrc) { log(`  skill đã nằm sẵn ở ${target}`); return; }
  fs.cpSync(skillSrc, target, {
    recursive: true,
    filter: (src) => !path.relative(skillSrc, src).split(path.sep).some((s) => s === '.git' || s === 'node_modules'),
  });
  log(`  chép skill vào ${target}`);
}

const LENGTHS = {
  '1': 'Trả lời ngắn: hỏi gì đáp nấy, vài câu. Thấy điều cần nói thêm ngoài câu hỏi thì một dòng ở cuối.',
  '2': 'Trả lời vừa phải: đủ để làm theo được, không giảng lại thứ người dùng đã biết.',
  '3': 'Trả lời đủ chi tiết: nói lý do và từng bước; chủ đề mới thì giảng từ khái niệm.',
};

const QUESTIONS = [
  ['ten', 'Bạn muốn agent gọi bạn là gì (ví dụ: anh Nam, chị Lan)? '],
  ['vaiTro', 'Bạn làm vai trò gì (BA, tester, dev, quản lý dự án...)? '],
  ['vietCho', 'Bạn hay viết văn bản cho ai (khách hàng, sếp, đội dev...)? '],
  ['doDai', 'Bạn muốn agent trả lời: 1 ngắn gọn, 2 vừa phải, 3 đủ chi tiết? (bỏ trống là 1) '],
  ['khongMuon', 'Có điều gì bạn không muốn agent làm không? (bỏ trống nếu chưa có) '],
  ['luatDoi', 'Đường dẫn tệp luật chung của đội, nếu có (bỏ trống nếu chưa có): '],
];

async function getAnswers() {
  const file = valueOf('--tra-loi');
  if (file) return JSON.parse(read(path.resolve(file)));
  if (!process.stdin.isTTY) {
    console.error('Không hỏi được vì không chạy trong cửa sổ dòng lệnh. Ghi câu trả lời vào một tệp JSON có các khoá');
    console.error(`${QUESTIONS.map((q) => q[0]).join(', ')} rồi chạy lại với --tra-loi <tệp>.`);
    process.exit(1);
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  log('Dựng bộ nhớ cho agent. Trả lời vài câu, câu nào chưa nghĩ ra thì bỏ trống, agent sẽ ghi dần sau.\n');
  // Đọc từng dòng qua iterator thay cho rl.question, vì rl.question làm rơi các dòng đã có sẵn trong stdin.
  const lines = rl[Symbol.asyncIterator]();
  const answers = {};
  for (const [key, q] of QUESTIONS) {
    process.stdout.write(q);
    const { value, done } = await lines.next();
    answers[key] = done ? '' : value.trim();
  }
  rl.close();
  return answers;
}

function userMd(a) {
  const val = (x) => (x && String(x).trim()) || 'chưa rõ';
  const lines = [
    '# Người dùng', '',
    `Dựng ngày ${today()} từ lượt hỏi đầu tiên. Agent sửa dần theo luật ở \`AGENTS.md\`.`, '',
    '## Là ai', '',
    `- Gọi là: ${val(a.ten)}.`,
    `- Vai trò: ${val(a.vaiTro)}.`,
    `- Hay viết văn bản cho: ${val(a.vietCho)}.`, '',
    '## Cách trả lời', '',
    '- Trả lời bằng tiếng Việt có dấu; tên tệp, lệnh, thuật ngữ kỹ thuật giữ nguyên.',
    `- ${LENGTHS[String(a.doDai ?? '').trim()] ?? LENGTHS['1']}`,
  ];
  const no = a.khongMuon && String(a.khongMuon).trim().replace(/[.;]+$/, '');
  if (no) lines.push(`- Không muốn: ${no}.`);
  return lines.join('\n') + '\n';
}

function teamMd(file) {
  const text = read(path.resolve(file)).trim();
  return (text.startsWith('#') ? text : `# Luật chung của đội\n\n${text}`) + '\n';
}

function buildMemory(answers) {
  const syncNote = useCodex
    ? [
        '',
        '## Sau khi sửa bộ nhớ',
        '',
        'Codex đọc một bản chép của bộ nhớ này trong `~/.codex/AGENTS.md`. Sửa xong tệp nào trong thư mục này thì chạy lệnh',
        'dưới đây để Codex thấy bản mới:',
        '',
        '```',
        `node "${shown(path.join(codexSkills[0], 'scripts', 'cai-dat.mjs'))}" --dong-bo${home === realHome ? '' : ` --home "${slash(home)}"`}`,
        '```',
        '',
      ].join('\n')
    : '';
  const entry = read(path.join(templates, 'AGENTS.mau.md')).replace('{{NGAY}}', today()).replace('{{DONG_BO}}', syncNote);
  write(path.join(memDir, 'AGENTS.md'), entry);
  write(path.join(memDir, 'user.md'), userMd(answers));
  write(path.join(memDir, 'memory.md'), read(path.join(templates, 'memory.md')));
  const team = answers.luatDoi && String(answers.luatDoi).trim();
  write(path.join(memDir, 'doi.md'), team ? teamMd(team) : read(path.join(templates, 'doi.md')));
  log(`  dựng bộ nhớ ở ${memDir}`);
}

async function main() {
  if (hasFlag('--dong-bo')) {
    if (!exists(path.join(memDir, 'AGENTS.md'))) { console.error(`Chưa có bộ nhớ ở ${memDir}.`); process.exit(1); }
    if (!exists(codexDir)) { log('Không thấy Codex (~/.codex), không có gì để đồng bộ.'); return; }
    syncCodex();
    return;
  }

  // Hỏi trước khi đụng vào máy, để không hỏi được thì cũng không cài dở.
  const hasMemory = exists(path.join(memDir, 'AGENTS.md'));
  const answers = hasMemory ? null : await getAnswers();

  log(`Cài vina-me cho ${home}`);
  if (!hasFlag('--khong-chep-skill')) {
    if (useClaude) copySkill(claudeSkill);
    if (useCodex) codexSkills.forEach(copySkill);
  }

  if (hasMemory) {
    log(`  bộ nhớ ở ${memDir} đã có, giữ nguyên`);
    const team = valueOf('--doi');
    if (team) { write(path.join(memDir, 'doi.md'), teamMd(team)); log('  thay luật chung của đội trong doi.md'); }
  } else {
    buildMemory(answers);
  }

  if (useClaude) linkClaude();
  if (useCodex) syncCodex();
  if (!useClaude && !useCodex) {
    log('  Không thấy Claude Code (~/.claude) hay Codex (~/.codex). Agent khác thì trỏ tệp chỉ dẫn toàn cục của nó tới');
    log(`  ${slash(path.join(memDir, 'AGENTS.md'))}, hoặc chép nội dung các tệp trong ${memDir} vào đó.`);
  }
  log('\nXong. Mở một phiên agent mới để nó đọc bộ nhớ.');
}

main();
