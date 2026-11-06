// Test cho learn-from-sessions.mjs, lint.mjs, secrets.mjs. Chạy: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { tmp, node, read } from './helpers.mjs';

// Phiên giả: Claude Code có tin người dùng gõ, tool_result, tin meta, lệnh gạch chéo; Codex có khối AGENTS.md tự chèn.
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
    line({ type: 'assistant', cwd: '/work/proj-alpha', message: { content: [{ type: 'text', text: 'lời agent' }] } }),
  ].join('\n'));
  const codex = path.join(home, '.codex', 'sessions', '2026', '11', '02');
  fs.mkdirSync(codex, { recursive: true });
  fs.writeFileSync(path.join(codex, 'rollout-1.jsonl'), [
    line({ type: 'session_meta', timestamp: '2026-11-02T03:00:00Z', payload: { cwd: '/work/proj-beta', timestamp: '2026-11-02T03:00:00Z' } }),
    line({ type: 'response_item', timestamp: '2026-11-02T03:00:01Z', payload: { type: 'message', role: 'user', content: [{ type: 'input_text', text: '# AGENTS.md instructions for /work/proj-beta' }] } }),
    line({ type: 'response_item', timestamp: '2026-11-02T03:00:02Z', payload: { type: 'message', role: 'user', content: [{ type: 'input_text', text: 'đừng giảng lý thuyết dài, đi thẳng vào việc' }] } }),
  ].join('\n'));
}

test('learn-from-sessions chỉ lấy tin người dùng gõ, che mật khẩu, lọc theo dự án', () => {
  const home = tmp();
  fakeSessions(home);
  const out = path.join(home, 'out');
  const r = node('learn-from-sessions.mjs', ['--home', home, '--out', out]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.stdout, /2 phiên, 3 tin, 1 đợt, đã che 1 chỗ/);
  const batch = read(path.join(out, 'batch-01.md'));
  assert.match(batch, /câu đầu là kết luận/);
  assert.match(batch, /đừng giảng lý thuyết dài/);
  assert.match(batch, /mật khẩu: \[ĐÃ ẨN\]/);
  for (const bad of ['Abc@12345', 'output dài', 'tin meta', '/clear', 'lời agent', 'AGENTS.md instructions']) assert.ok(!batch.includes(bad), bad);
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
