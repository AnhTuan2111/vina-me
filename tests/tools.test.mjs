// Test cho learn-from-sessions.mjs, lint.mjs, secrets.mjs, feedback.mjs. Chạy: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { tmp, node, read, ROOT } from './helpers.mjs';

// Phiên giả: Claude Code có tin người dùng gõ, tool_result, tin meta, lệnh gạch chéo, lượt agent có suy nghĩ, gọi skill và
// trả lời; Codex có khối AGENTS.md tự chèn, reasoning summary, lệnh đọc SKILL.md và câu trả lời.
function fakeSessions(home) {
  const claude = path.join(home, '.claude', 'projects', 'proj-alpha');
  fs.mkdirSync(claude, { recursive: true });
  const line = (o) => JSON.stringify(o);
  fs.writeFileSync(path.join(claude, 's1.jsonl'), [
    line({ type: 'user', origin: { kind: 'human' }, cwd: '/work/proj-alpha', timestamp: '2026-11-01T02:00:00Z', message: { content: 'từ nay báo cáo gửi sếp câu đầu là kết luận nhé' } }),
    line({ type: 'user', origin: { kind: 'human' }, cwd: '/work/proj-alpha', timestamp: '2026-11-01T02:05:00Z', message: { content: 'mật khẩu: Abc@12345 dùng cho máy chủ' } }),
    line({ type: 'user', cwd: '/work/proj-alpha', timestamp: '2026-11-01T02:06:00Z', message: { content: [{ type: 'tool_result', content: 'output dài' }] } }),
    line({ type: 'user', isMeta: true, cwd: '/work/proj-alpha', timestamp: '2026-11-01T02:07:00Z', message: { content: 'tin meta' } }),
    line({ type: 'user', origin: { kind: 'human' }, cwd: '/work/proj-alpha', timestamp: '2026-11-01T02:08:00Z', message: { content: '<command-name>/clear</command-name>' } }),
    line({ type: 'assistant', cwd: '/work/proj-alpha', message: { content: [{ type: 'thinking', thinking: 'Người dùng muốn **kết luận** lên đầu báo cáo, token=abc123xyz' }] } }),
    line({ type: 'assistant', cwd: '/work/proj-alpha', message: { content: [{ type: 'tool_use', name: 'Skill', input: { skill: 'vina-me' } }] } }),
    line({ type: 'assistant', cwd: '/work/proj-alpha', message: { content: [{ type: 'text', text: 'lời agent' }] } }),
    line({ type: 'assistant', isSidechain: true, cwd: '/work/proj-alpha', message: { content: [{ type: 'text', text: 'agent con nói' }] } }),
  ].join('\n'));
  const codex = path.join(home, '.codex', 'sessions', '2026', '11', '02');
  fs.mkdirSync(codex, { recursive: true });
  fs.writeFileSync(path.join(codex, 'rollout-1.jsonl'), [
    line({ type: 'session_meta', timestamp: '2026-11-02T03:00:00Z', payload: { cwd: '/work/proj-beta', timestamp: '2026-11-02T03:00:00Z' } }),
    line({ type: 'response_item', timestamp: '2026-11-02T03:00:01Z', payload: { type: 'message', role: 'user', content: [{ type: 'input_text', text: '# AGENTS.md instructions for /work/proj-beta' }] } }),
    line({ type: 'response_item', timestamp: '2026-11-02T03:00:02Z', payload: { type: 'message', role: 'user', content: [{ type: 'input_text', text: 'đừng giảng lý thuyết dài, đi thẳng vào việc' }] } }),
    line({ type: 'response_item', payload: { type: 'reasoning', summary: [{ type: 'summary_text', text: '**Rút gọn câu trả lời**' }] } }),
    line({ type: 'response_item', payload: { type: 'function_call', name: 'exec_command', arguments: JSON.stringify({ cmd: String.raw`Get-Content 'C:\Users\x\.agents\skills\docx\SKILL.md'` }) } }),
    line({ type: 'response_item', payload: { type: 'message', role: 'assistant', content: [{ type: 'output_text', text: `Làm luôn: ${'x'.repeat(400)}` }] } }),
  ].join('\n'));
}

test('learn-from-sessions lấy tin người dùng gõ kèm tóm gọn phần agent, che mật khẩu, lọc theo dự án', () => {
  const home = tmp();
  fakeSessions(home);
  const out = path.join(home, 'out');
  const r = node('learn-from-sessions.mjs', ['--home', home, '--out', out]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.stdout, /2 phiên, 3 tin, 1 đợt, đã che 2 chỗ/);
  const batch = read(path.join(out, 'batch-01.md'));
  assert.match(batch, /câu đầu là kết luận/);
  assert.match(batch, /đừng giảng lý thuyết dài/);
  assert.match(batch, /mật khẩu: \[ĐÃ ẨN\]/);
  // phần agent gắn vào tin người dùng gần nhất trước nó: mỗi loại một dòng, bỏ dấu markdown, câu trả lời dài thì cắt
  assert.match(batch, /câu đầu là kết luận nhé\n\[/);
  assert.match(batch, /dùng cho máy chủ\n {4}agent nghĩ: Người dùng muốn kết luận lên đầu báo cáo, token=\[ĐÃ ẨN\]\n {4}agent trả lời: lời agent\n {4}skill: vina-me\n/);
  assert.match(batch, /đi thẳng vào việc\n {4}agent nghĩ: Rút gọn câu trả lời\n {4}agent trả lời: Làm luôn: x{180,200}\.\.\.\n {4}skill: docx\n/);
  assert.match(read(path.join(out, 'overview.md')), /\| vina-me \| 1 \|[\s\S]*\| docx \| 1 \|/);
  for (const bad of ['Abc@12345', 'abc123xyz', 'output dài', 'tin meta', '/clear', 'agent con nói', 'AGENTS.md instructions']) assert.ok(!batch.includes(bad), bad);
  assert.equal(node('learn-from-sessions.mjs', ['--home', home, '--out', out, '--user-only']).status, 0);
  assert.ok(!/agent nghĩ|agent trả lời|skill:/.test(read(path.join(out, 'batch-01.md'))));
  const only = node('learn-from-sessions.mjs', ['--home', home, '--out', out, '--exclude', 'alpha']);
  assert.match(only.stdout, /1 phiên, 1 tin, 1 đợt, đã che 0 chỗ/);
});

// Gạch vừa viết bằng mã ký tự để tệp nguồn không chứa nó; văn bản thử cần nó để bài soát Tiêu ngữ có lỗi mà bắt.
const EN_DASH = String.fromCharCode(0x2013);

test('lint bắt lỗi thể thức văn bản hành chính', () => {
  const dir = tmp();
  const file = path.join(dir, 'vb.md');
  fs.writeFileSync(file, [
    'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', `Độc lập ${EN_DASH} Tự do ${EN_DASH} Hạnh phúc`, '',
    'Số: 5/BC-THPTB                    Thành phố A, ngày 6 tháng 1 năm 2026', '',
    'Kính gửi:', '- Sở Giáo dục và Đào tạo', '- Phòng Kế hoạch - Tài chính;', '',
    '1. Kết quả', 'a) Đã nhập 1,234 đầu sách.', 'b) Phần mềm chạy ổn.', 'd) Còn 19 đầu sách thiếu mã vạch.', '',
    'Nơi nhận:', '- Ban Giám hiệu;', '- Lưu: VT;',
  ].join('\n'));
  const out = node('lint.mjs', [file]).stdout;
  for (const want of [/Tiêu ngữ/, /thiếu số 0: ngày 6/, /Số: 5\//, /b\) rồi d\)/, /1,234/, /Như trên/, /gạch dài/]) assert.match(out, want);
  assert.match(out, /10 chỗ cần xem lại/);
});

test('lint đếm độ dài câu theo tiếng', () => {
  const dir = tmp();
  const file = path.join(dir, 'p.md');
  fs.writeFileSync(file, 'Câu này dài vừa phải để đủ hai mươi lăm tiếng cho một đoạn có nghĩa. Câu thứ hai cũng nối tiếp ý câu trước nên đọc liền mạch hơn nhiều. Câu ba kết đoạn.\n');
  assert.match(node('lint.mjs', [file]).stdout, /tiếng mỗi câu/);
});

test('secrets lưu, dùng qua biến môi trường và stdin, liệt kê, xoá', { skip: process.platform !== 'win32' && 'chỉ thử được trên Windows (DPAPI); macOS chưa có máy thử' }, () => {
  const home = tmp();
  const pass = "Mật@khẩu'1 \"x\" ;$HOME";
  assert.equal(node('secrets.mjs', ['add', 'thu', '--account', 'a.b', '--from-stdin', '--home', home], { input: pass }).status, 0);
  assert.match(node('secrets.mjs', ['list', '--home', home]).stdout, /thu\ttài khoản: a\.b/);
  const check = (cmd) => node('secrets.mjs', [cmd, 'thu', '--home', home, '--', process.execPath, '-e', cmd === 'run'
    ? 'process.stdout.write(process.env.THU_PASS === process.env.EXPECT ? "ok" : "sai")'
    : 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>process.stdout.write(d.trim()===process.env.EXPECT?"ok":"sai"))'], { env: { EXPECT: pass } });
  assert.equal(check('run').stdout, 'ok');
  assert.equal(check('stdin').stdout, 'ok');
  assert.ok(!fs.readFileSync(path.join(home, '.secrets', 'thu.xml'), 'utf8').includes('khẩu'));
  node('secrets.mjs', ['remove', 'thu', '--home', home]);
  assert.match(node('secrets.mjs', ['list', '--home', home]).stdout, /Chưa có bí mật nào/);
});

// feedback.mjs: mọi lần chạy trỏ vào một repo không tồn tại, nên dù máy có gh đăng nhập cũng không tạo issue thật.
const NO_REPO = 'vina-me-test/does-not-exist';
const NO_GH = { GH_TOKEN: '', GITHUB_TOKEN: '' };
const urlOf = (out) => out.split(/\r?\n/).find((l) => l.startsWith('https://github.com/'));

test('feedback chạy thử: che bí mật, gắn "Góp ý: ", thêm phiên bản skill, in link điền sẵn', () => {
  const dir = tmp();
  const file = path.join(dir, 'body.md');
  const ghToken = `ghp_${'a1'.repeat(18)}`;
  fs.writeFileSync(file, `**Người dùng nói gì**: "câu này vẫn máy"\nmật khẩu: Abc@12345\ntoken của tôi ${ghToken}\n`);
  const r = node('feedback.mjs', ['--title', 'Quy tắc hỏi rồi đáp áp nhầm cho thư', '--body-file', file, '--agent', 'Claude Code', '--dry-run', '--repo', NO_REPO], { env: NO_GH });
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /Tiêu đề: Góp ý: Quy tắc hỏi rồi đáp áp nhầm cho thư/);
  assert.match(r.out, /Chạy thử, chưa gửi gì/);
  assert.ok(!r.out.includes('Abc@12345') && !r.out.includes(ghToken), r.out);
  assert.match(r.out, /\[ĐÃ ẨN\]/);
  const version = read(path.join(ROOT, 'SKILL.md')).match(/version:\s*"([^"]+)"/)[1];
  assert.ok(r.out.includes(`vina-me ${version}, Claude Code, ${process.platform}`), r.out);
  const url = urlOf(r.out);
  assert.ok(url.startsWith(`https://github.com/${NO_REPO}/issues/new?title=`), url);
  assert.ok(!decodeURIComponent(url).includes('Abc@12345'));
});

test('feedback trên máy chưa đăng nhập gh thì in link, không gửi; tiêu đề không gắn "Góp ý: " hai lần', () => {
  const r = node('feedback.mjs', ['--title', 'Góp ý: lint báo nhầm câu dài', '--body-file', '-', '--repo', NO_REPO], { input: 'lint báo câu 25 tiếng là quá dài', env: NO_GH });
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /chưa có gh đăng nhập|gh chưa tạo được issue/);
  const title = new URL(urlOf(r.out)).searchParams.get('title');
  assert.equal(title, 'Góp ý: lint báo nhầm câu dài');
});

test('feedback cắt nội dung dài cho link vừa giới hạn, dừng khi thiếu tiêu đề hay nội dung', () => {
  const dir = tmp();
  const file = path.join(dir, 'long.md');
  fs.writeFileSync(file, 'Câu tiếng Việt có dấu khá dài. '.repeat(1000));
  const r = node('feedback.mjs', ['--title', 'Nội dung dài', '--body-file', file, '--dry-run', '--repo', NO_REPO], { env: NO_GH });
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /\[cắt bớt \d+ ký tự\]/);
  assert.ok(urlOf(r.out).length <= 7500, String(urlOf(r.out).length));
  assert.equal(node('feedback.mjs', ['--body-file', file, '--dry-run'], { env: NO_GH }).status, 2);
  const empty = path.join(dir, 'empty.md');
  fs.writeFileSync(empty, '  \n');
  assert.equal(node('feedback.mjs', ['--title', 'x', '--body-file', empty, '--dry-run'], { env: NO_GH }).status, 2);
});
