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
  // có chỗ che thì stdout và overview.md nhắc gọi tên từng thứ và khuyên đổi, không có chỗ che thì không nhắc
  assert.match(r.stdout, /khuyên đổi từng thứ còn dùng được/);
  assert.match(read(path.join(out, 'overview.md')), /vẫn nằm trong lịch sử phiên[\s\S]*khuyên đổi từng thứ còn dùng được/);
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
  assert.ok(!/khuyên đổi/.test(only.stdout));
  assert.ok(!/khuyên đổi/.test(read(path.join(out, 'overview.md'))));
});

test('learn-from-sessions báo số phiên đã bỏ theo từng nguồn, chạy lại không xoá tệp khác trong thư mục ra', () => {
  const home = tmp();
  fakeSessions(home);
  const out = path.join(home, 'out');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'draft.md'), 'nháp của agent');
  fs.writeFileSync(path.join(out, 'batch-07.md'), 'đợt cũ');
  const r = node('learn-from-sessions.mjs', ['--home', home, '--out', out, '--exclude', 'alpha']);
  assert.equal(r.status, 0, r.out);
  assert.match(r.stdout, /Đã bỏ 1 phiên Claude Code, 0 phiên Codex có thư mục làm việc chứa: alpha\./);
  const overview = read(path.join(out, 'overview.md'));
  assert.match(overview, /Đã bỏ 1 phiên Claude Code, 0 phiên Codex/);
  assert.ok(!overview.includes('mọi thư mục'));
  assert.equal(read(path.join(out, 'draft.md')), 'nháp của agent');
  assert.ok(!fs.existsSync(path.join(out, 'batch-07.md')));
  const kept = node('learn-from-sessions.mjs', ['--home', home, '--out', out, '--only', 'beta']);
  assert.match(kept.stdout, /Đã bỏ 1 phiên Claude Code, 0 phiên Codex; chỉ giữ phiên có thư mục làm việc chứa: beta\./);
});

test('learn-from-sessions gặp cờ lạ hay --help thì không rút gì', () => {
  const home = tmp();
  fakeSessions(home);
  const out = path.join(home, 'out');
  const help = node('learn-from-sessions.mjs', ['--help', '--home', home, '--out', out]);
  assert.equal(help.status, 0, help.out);
  assert.match(help.stdout, /--exclude private/);
  assert.ok(!fs.existsSync(out));
  for (const bad of [['--exlude', 'alpha'], ['--exclude'], ['alpha'], ['--since', 'hôm qua']]) {
    const r = node('learn-from-sessions.mjs', ['--home', home, '--out', out, ...bad]);
    assert.equal(r.status, 2, bad.join(' '));
    assert.match(r.stderr, /Không rút gì, vì: /);
    assert.ok(!fs.existsSync(out), bad.join(' '));
  }
});

test('learn-from-sessions che mật khẩu kể trong câu có chữ chen giữa "mật khẩu" và "là", để yên câu thường', () => {
  const home = tmp();
  const claude = path.join(home, '.claude', 'projects', 'proj-gamma');
  fs.mkdirSync(claude, { recursive: true });
  const msg = (text, minute) => JSON.stringify({ type: 'user', origin: { kind: 'human' }, cwd: '/work/proj-gamma', timestamp: `2026-11-03T02:${minute}:00Z`, message: { content: text } });
  fs.writeFileSync(path.join(claude, 's1.jsonl'), [
    msg('nhân tiện mật khẩu wifi văn phòng là Tre#Xanh77 nhé', '00'),
    msg('the guest wifi password is Hello!2026', '01'),
    msg('mật khẩu mới là do bên IT cấp', '02'),
    msg('khoá học năm nay là 2026', '03'),
  ].join('\n'));
  const out = path.join(home, 'out');
  const r = node('learn-from-sessions.mjs', ['--home', home, '--out', out]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.stdout, /đã che 2 chỗ/);
  const batch = read(path.join(out, 'batch-01.md'));
  assert.match(batch, /mật khẩu wifi văn phòng là \[ĐÃ ẨN\] nhé/);
  assert.match(batch, /password is \[ĐÃ ẨN\]/);
  assert.match(batch, /mật khẩu mới là do bên IT cấp/);
  assert.match(batch, /khoá học năm nay là 2026/);
  for (const bad of ['Tre#Xanh77', 'Hello!2026']) assert.ok(!batch.includes(bad), bad);
});

test('learn-from-sessions ghi khoảng ngày tới tin muộn nhất, không tới giờ mở phiên cuối', () => {
  const home = tmp();
  const claude = path.join(home, '.claude', 'projects', 'proj-delta');
  fs.mkdirSync(claude, { recursive: true });
  const msg = (text, time) => JSON.stringify({ type: 'user', origin: { kind: 'human' }, cwd: '/work/proj-delta', timestamp: time, message: { content: text } });
  fs.writeFileSync(path.join(claude, 's1.jsonl'), msg('phiên đầu', '2026-10-01T02:00:00Z'));
  fs.writeFileSync(path.join(claude, 's2.jsonl'), [msg('mở phiên cuối', '2026-11-05T02:00:00Z'), msg('tin cuối chiều', '2026-11-05T09:10:00Z')].join('\n'));
  const out = path.join(home, 'out');
  const r = node('learn-from-sessions.mjs', ['--home', home, '--out', out]);
  assert.equal(r.status, 0, r.out);
  const stamp = (iso) => new Date(iso).toLocaleString('sv-SE', { hour12: false }).slice(0, 16);
  assert.ok(read(path.join(out, 'overview.md')).includes(`Từ ${stamp('2026-10-01T02:00:00Z')} tới ${stamp('2026-11-05T09:10:00Z')}.`));
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

test('lint đếm tiếng cả tệp, bắt ẩn dụ "Giống…:", câu ba đoạn mã, mũi tên ASCII, chỗ trống, chữ nhấn thừa, lỗi chính tả; tha dòng tên in hoa', () => {
  const dir = tmp();
  const file = path.join(dir, 'note.md');
  fs.writeFileSync(file, [
    '# Ghi chú dọn ổ', '',
    'HƯỚNG DẪN VẬN HÀNH', '',
    'Giống một cái kho: hàng nào cũng chiếm chỗ. Cron job chạy -> dọn thư mục tạm khi có > 3 tệp cũ, giữ [__] ngày. Bản mới thật sự nhẹ hơn, thiếu xót một bước. Chạy `df`, rồi `du`, rồi `lsof` để thấy phần chênh.', '',
    '```bash', 'df -h -> /tmp/out', '```', '',
  ].join('\n'));
  const out = node('lint.mjs', [file]).stdout;
  assert.match(out, /tiếng, không tính nhan đề, đề mục, bảng, khối code; bỏ cả đoạn mã trong dòng thì/);
  assert.match(out, /câu mở ẩn dụ bằng "Giống…:"/);
  assert.match(out, /1 câu mang từ ba đoạn mã trở lên/);
  assert.match(out, /mũi tên "->" \(1\), dấu so sánh trước con số \(1\), chỗ trống chưa điền \(1\)/);
  assert.match(out, /· chữ nhấn thừa: thật sự/);
  assert.match(out, /lỗi chính tả hay gặp: thiếu xót/);
  assert.doesNotMatch(out, /chữ in hoa nhấn mạnh/);
  const stdin = node('lint.mjs', ['-'], { input: 'Một câu thử từ stdin để soát lời trả.' });
  assert.equal(stdin.status, 0);
  assert.match(stdin.stdout, /tiếng, không tính nhan đề/);
});

test('redact che mật khẩu có chữ chen giữa "mật khẩu" và "là", để yên câu thường', async () => {
  const { redact, HIDDEN } = await import('../scripts/lib/redact.mjs');
  assert.equal(redact('mật khẩu wifi văn phòng là Abc@2026 nhé'), `mật khẩu wifi văn phòng là ${HIDDEN} nhé`);
  assert.equal(redact('mật khẩu mới là chuỗi dài hơn'), 'mật khẩu mới là chuỗi dài hơn');
});

test('lint bắt mở bài "Trong thời đại…", câu thiếu chủ ngữ, một thứ nhiều tên, chữ chỉ buổi lệch giờ; bỏ qua code', () => {
  const dir = tmp();
  const file = path.join(dir, 'guide.md');
  fs.writeFileSync(file, [
    '# Xoay vòng log', '',
    'Trong thời đại mọi thứ đều để lại dấu vết, log là thứ ai cũng cần. Tài liệu này nói cách dọn log trên máy chủ báo cáo.', '',
    'Mỗi tối, script nén log lúc 23h giờ UTC, tức 6h sáng ở Hà Nội, rồi đẩy lên server lưu trữ. Rất dễ nghĩ là script chạy theo giờ Hà Nội. Lịch thật không phải giờ Hà Nội mà là giờ UTC. Script cũng ghi số dòng đã nén vào cơ sở dữ liệu.', '',
    'Với tệp nén này đã gồm log của cả tuần. CSDL báo cáo chỉ giữ số dòng, còn database chính không đụng tới.', '',
    '```bash', 'tar czf ~/logs.tgz /var/log/app && rm -rf /var/log/app/*.log', '```', '',
  ].join('\n'));
  const out = node('lint.mjs', [file]).stdout;
  assert.match(out, /mở bài bằng khuôn "Trong thời đại…"/);
  assert.match(out, /dễ thiếu chủ ngữ: "Với tệp nén này/);
  assert.match(out, /- một thứ nhiều tên: database \(1\), cơ sở dữ liệu \(1\), CSDL \(1\)/);
  assert.match(out, /· một thứ nhiều tên: máy chủ \(1\), server \(1\)/);
  assert.match(out, /"Mỗi tối" với "6h sáng"/);
  // "không phải … mà là" ngay sau "Rất dễ nghĩ" là chỗ được giữ: ghi chú, không báo
  assert.match(out, /· "không phải … mà là" ngay sau câu nêu một cách hiểu sai: 1 lần/);
  assert.doesNotMatch(out, /- "không phải … mà là"/);
  assert.doesNotMatch(out, /ký hiệu trong câu văn/);
});

test('lint không bắt lỗi trong lời trích của một báo cáo soát, đo câu cả trong mục danh sách', () => {
  const dir = tmp();
  const file = path.join(dir, 'reply.md');
  const item = (n, quote) => [
    `${n}. Lời dặn đứng sau bước nó phải chặn (dòng ${n * 10})`,
    `   Câu gốc: "${quote}"`,
    '   Vấn đề: người làm theo thứ tự sẽ chạy lệnh xoá trước rồi mới đọc tới lời dặn này, vì nó nằm ngay dưới bước cuối cùng của danh sách.',
    '   Cách sửa: đưa lời dặn thành bước đầu tiên, ghi rõ lệnh xem tên máy và tên máy phải thấy trước khi làm tiếp.',
  ].join('\n');
  fs.writeFileSync(file, [
    item(1, 'Lưu ý: KHÔNG chạy lệnh này trên production. Hãy kiểm tra kỹ tên máy.'), '',
    item(2, 'Tóm lại, nắm vững quy trình giúp đội nhanh hơn & chủ động hơn.'), '',
  ].join('\n'));
  const out = node('lint.mjs', [file]).stdout;
  assert.match(out, /câu \(kể cả 2 mục danh sách dài\)/);
  for (const bad of [/câu mở bằng "Hãy"/, /Tóm lại/, /in hoa/, /dấu &/, /dấu hai chấm/]) assert.doesNotMatch(out, bad);
  assert.match(out, /0 chỗ cần xem lại/);
});

test('lint bắt hai ý chọi nhau trong một câu, một việc hai con số; kiểm lời soát: câu gốc, mục gộp, lượng ước chừng, số báo của script', () => {
  const dir = tmp();
  const guide = path.join(dir, 'guide.md');
  fs.writeFileSync(guide, [
    'Log của máy chủ báo cáo được nén mỗi tuần rồi đẩy lên kho lưu trữ. Bản nén được giữ 5 ngày rồi tự xoá, nên muốn xem log cũ thì tải về sớm.', '',
    'Bước nén mất 5 phút, bước đẩy lên kho mất 20 phút. Việc dọn đĩa đúng lúc này đáng lẽ phải làm trước khi nén. Bản nén trên kho được giữ 30 ngày.', '',
  ].join('\n'));
  const g = node('lint.mjs', [guide]).stdout;
  assert.match(g, /hai ý chọi nhau trong một câu/);
  assert.match(g, /"giữ 5 ngày" với "giữ 30 ngày"/);
  assert.doesNotMatch(g, /mất 5 phút/);

  const item = (n, head, problem, fix) => [`${n}. ${head}`, `Vấn đề: ${problem}`, `Sửa: ${fix}`].join('\n');
  const bad = path.join(dir, 'reply.md');
  fs.writeFileSync(bad, [
    'Mình chỉ đọc tệp, không sửa gì vào tệp. Phần đầu là chỗ sai nội dung, lỗi câu chữ để sau cùng.', '',
    item(1, '"Bản nén được giữ 5 ngày rồi tự xoá." và "Bản nén trên kho được giữ 30 ngày."', 'hai đoạn ghi hai con số cho cùng một kho, người cần log cũ sẽ tin số lớn hơn. Thêm nữa, lệnh nén ghi đè tệp cũ trên máy mà không hỏi lại.', 'giữ một con số, hỏi lại cấu hình của kho.'), '',
    item(2, 'Tài liệu không có phần chuẩn bị', 'người mới chưa có quyền vào kho thì kẹt ngay ở bước đẩy, và lệnh chạy lại sẽ để lại một nửa số tệp trên kho.', 'thêm một đoạn ngắn nói các quyền cần xin.'), '',
    'Mình đọc từng câu và chạy script soát văn của skill.',
  ].join('\n'));
  const r = node('lint.mjs', [bad]).stdout;
  assert.match(r, /mục soát không trích câu gốc: mục 2;/);
  assert.match(r, /gộp hai chỗ bằng "Thêm nữa", "Ngoài ra": mục 1;/);
  assert.match(r, /· lượng, mức chắc chắn .*"một nửa" \(mục 2\)/);
  assert.match(r, /nhắc tới script mà không nói nó báo mấy chỗ/);

  const good = path.join(dir, 'reply-ok.md');
  fs.writeFileSync(good, [
    item(1, '"Bản nén được giữ 5 ngày rồi tự xoá." và "Bản nén trên kho được giữ 30 ngày."', 'hai đoạn ghi hai con số cho cùng một kho, người cần log cũ sẽ tin số lớn hơn rồi đi tìm một bản đã bị xoá.', 'giữ một con số, hỏi lại cấu hình của kho.'), '',
    item(2, 'Thiếu, thêm sau câu "Log của máy chủ báo cáo được nén mỗi tuần."', 'người mới chưa có quyền vào kho thì kẹt ngay ở bước đẩy lên kho, mà tài liệu không nói xin quyền ở đâu.', 'thêm một đoạn ngắn nói các quyền cần xin.'), '',
    'Script soát văn báo 4 chỗ trên tệp, mình nhận cả 4.',
  ].join('\n'));
  const o = node('lint.mjs', [good]).stdout;
  for (const re of [/không trích câu gốc/, /gộp hai chỗ/, /lượng, mức chắc chắn/, /không nói nó báo mấy chỗ/, /hai con số/]) assert.doesNotMatch(o, re);
  assert.equal(node('lint.mjs', ['--help']).status, 0);
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
  assert.match(r.out, /Nội dung dài \d+ ký tự, quá mức 6000/);
  assert.match(r.out, /Link chỉ mang được \d+\/\d+ ký tự đầu/);
  assert.ok(urlOf(r.out).length <= 7500, String(urlOf(r.out).length));
  assert.equal(node('feedback.mjs', ['--body-file', file, '--dry-run'], { env: NO_GH }).status, 2);
  const empty = path.join(dir, 'empty.md');
  fs.writeFileSync(empty, '  \n');
  assert.equal(node('feedback.mjs', ['--title', 'x', '--body-file', empty, '--dry-run'], { env: NO_GH }).status, 2);
});

test('feedback báo link bị cắt giữa mục nào, mất mục nào; bản ngắn thì không báo', () => {
  const dir = tmp();
  const file = path.join(dir, 'draft.md');
  const para = 'Đoạn này viết tiếng Việt có dấu để link dài ra nhanh hơn chữ không dấu. '.repeat(12);
  fs.writeFileSync(file, ['**Người dùng nói gì**', para, '**Skill đã làm gì**', para, '**Lẽ ra thế nào**', para, para,
    '**Cách lặp lại**', para].join('\n\n'));
  const r = node('feedback.mjs', ['--title', 'Bản nháp dài', '--body-file', file, '--dry-run', '--repo', NO_REPO], { env: NO_GH });
  assert.equal(r.status, 0, r.out);
  const line = r.out.split(/\r?\n/).find((l) => l.startsWith('Link chỉ mang được'));
  assert.ok(line, r.out);
  assert.match(line, /cắt giữa mục [^;)]+; mất mục: .*Cách lặp lại/);
  assert.ok(!r.out.includes('Nội dung dài'), r.out);
  const short = path.join(dir, 'short.md');
  fs.writeFileSync(short, '**Người dùng nói gì**\n\n"câu này vẫn máy"\n');
  assert.ok(!node('feedback.mjs', ['--title', 'x', '--body-file', short, '--dry-run', '--repo', NO_REPO], { env: NO_GH }).out.includes('Link chỉ'));
});

test('feedback chạy thử nhắc dòng còn ngày, giờ, số điện thoại, đường dẫn có tên người; bỏ qua lệnh và output trong code', () => {
  const dir = tmp();
  const file = path.join(dir, 'body.md');
  fs.writeFileSync(file, [
    '**Skill đã làm gì**',
    '> Hệ thống tạm dừng từ 22h00 tối [thứ] để cài bản mới.',
    '> Dùng được từ sáng 19/11/2026, gọi 0987 654 321.',
    'Output ở C:\\Users\\hoang.nm\\Desktop\\lint.txt',
    '**Cách lặp lại**',
    '```',
    'node scripts/lint.mjs test.md   # chạy lúc 10:30 ngày 12/11',
    '```',
    'Lệnh `echo 08:15` không tính. Chữ chung [ngày], [giờ] và phiên bản 0.15.0 không tính.',
  ].join('\n'));
  const r = node('feedback.mjs', ['--title', 'Thử nhắc dữ liệu', '--body-file', file, '--dry-run', '--repo', NO_REPO], { env: NO_GH });
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /Xem lại 4 chỗ/);
  assert.match(r.out, /dòng 2, giờ: 22h00/);
  assert.match(r.out, /dòng 3, ngày: 19\/11\/2026/);
  assert.match(r.out, /dòng 3, số điện thoại: 0987 654 321/);
  assert.match(r.out, /dòng 4, đường dẫn có tên người: C:\\Users\\hoang\.nm/);
  assert.ok(!/dòng [79],/.test(r.out), r.out);
  const clean = path.join(dir, 'clean.md');
  fs.writeFileSync(clean, 'Lint báo [tên phân hệ] là chữ in hoa nhấn mạnh.\n');
  assert.ok(!node('feedback.mjs', ['--title', 'x', '--body-file', clean, '--dry-run', '--repo', NO_REPO], { env: NO_GH }).out.includes('Xem lại'));
});

test('official-doc-docx: căn cứ sau Kính gửi, báo phép tính bảng lệch, gạch nối không ngắt, chữ cho lint', async () => {
  const { readZip } = await import('../scripts/bid/lib/zip.mjs');
  const dir = tmp();
  const json = path.join(dir, 'tt.json');
  fs.writeFileSync(json, JSON.stringify({
    parentAgency: 'Sở A', agency: 'Trung tâm B', number: '03/TTr-TTB', place: 'Tỉnh A', date: '2027-02-05',
    docType: 'Tờ trình', subject: 'Về việc phê duyệt dự toán mua sắm năm 2027',
    legalBases: ['Căn cứ Quyết định số 12/QĐ-UBND ngày 03 tháng 01 năm 2027 của Ủy ban nhân dân tỉnh A về giao dự toán'],
    recipients: ['Sở A'], opening: ['Trung tâm B kính trình Sở A như sau:'],
    body: [{ heading: 'Nội dung', clauses: [{ title: 'Khối lượng', points: ['Mua 10 máy giai đoạn 2027-2028;'], paragraphsAfter: ['Chi tiết tại Phụ lục.'] }] }],
    closing: ['Kính trình Sở A xem xét, quyết định.'], archive: 'VT, TTB',
    signingAuthority: 'KT. Giám đốc', signerTitle: 'Phó Giám đốc', signer: 'Nguyễn Văn C',
    appendices: [{ title: 'Dự toán', tables: [{ columns: ['STT', 'Nội dung', 'Số lượng', 'Đơn giá', 'Thành tiền'],
      align: ['center', 'left', 'right', 'right', 'right'], boldRows: [-1],
      rows: [['1', 'Máy tính', '10', '15.000.000', '150.000.000'], ['2', 'Máy in', '4', '6.000.000', '28.000.000'],
        ['3', 'Bản quyền', '10', '1.200.000', '12.000.000'], ['', 'Tổng cộng', '', '', '200.000.000']] }] }],
  }));
  const out = path.join(dir, 'tt.docx');
  const txt = path.join(dir, 'tt.txt');
  const r = node('official-doc-docx.mjs', [json, out, '--text', txt]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.stderr, /4 × 6\.000\.000 = 24\.000\.000, bảng ghi 28\.000\.000/);
  assert.match(r.stderr, /hàng tổng cộng, cột "Thành tiền": cộng các hàng được 190\.000\.000, bảng ghi 200\.000\.000/);
  const text = read(txt);
  assert.ok(text.indexOf('Kính gửi: Sở A.') < text.indexOf('Căn cứ Quyết định'), text);
  assert.ok(text.indexOf('b) ') < 0 && text.indexOf('2027-2028;') < text.indexOf('Chi tiết tại Phụ lục.'), text);
  assert.match(text, /- Như trên;\n- Lưu: VT, TTB\.\nKT\. GIÁM ĐỐC/);
  assert.match(text, /^2 \| Máy in \| 4 \| 6\.000\.000 \| 28\.000\.000$/m);
  const doc = readZip(fs.readFileSync(out)).get('word/document.xml').toString('utf8');
  assert.match(doc, /2027<\/w:t><w:noBreakHyphen\/><w:t xml:space="preserve">2028/);
  assert.match(doc, /<w:cantSplit\/>/);
  assert.match(doc, /<w:keepNext\/>(?:(?!<\/w:p>).)*?quyết định\.\/\./s);
  assert.match(node('lint.mjs', ['--official', txt]).stdout, /0 chỗ cần xem lại/);
});

test('official-doc-docx: tên cơ quan đủ địa danh, ngắt trước địa danh, chỉ ô sai của dòng nhân lệch', async () => {
  const { readZip } = await import('../scripts/bid/lib/zip.mjs');
  const dir = tmp();
  const base = {
    parentAgency: 'Sở Văn hóa tỉnh Bình An', number: '04/TTr-BTA', place: 'Bình An', date: '2027-03-02', docType: 'Tờ trình',
    subject: 'Về việc phê duyệt dự toán tu bổ hiện vật năm 2027', recipients: ['Sở Văn hóa tỉnh Bình An'],
    opening: ['Bảo tàng Văn hóa dân gian tỉnh Bình An (sau đây gọi là Bảo tàng) kính trình Sở Văn hóa như sau:'],
    body: [{ heading: 'Kiến nghị', paragraphs: ['Đề nghị phê duyệt dự toán.'] }],
    closing: ['Kính trình Sở Văn hóa xem xét, quyết định.'], archive: 'VT, HV',
    signingAuthority: 'KT. Giám đốc', signerTitle: 'Phó Giám đốc', signer: 'Trần Văn D',
    appendices: [{ title: 'Dự toán', tables: [{ columns: ['STT', 'Nội dung', 'Số lượng', 'Đơn giá', 'Thành tiền'],
      rows: [['1', 'Tu bổ', '40', '2.500.000', '100.000.000'], ['2', 'Chụp ảnh', '300', '50.000', '15.000.000'],
        ['3', 'Lập hồ sơ', '120', '80.000', '10.630.000'], ['4', 'Vận chuyển', '5', '3.000.000', '16.000.000']] }] }],
  };
  // Phần đầu ghi thiếu địa danh, ngắt tay giữa một cụm: báo cả hai, dòng kèm theo của phụ lục dùng tên đủ ở câu mở.
  const short = path.join(dir, 'short.json');
  fs.writeFileSync(short, JSON.stringify({ ...base, agency: 'Bảo tàng Văn hóa\ndân gian' }));
  const r1 = node('official-doc-docx.mjs', [short, path.join(dir, 'short.docx'), '--text', path.join(dir, 'short.txt')]);
  assert.equal(r1.status, 0, r1.out);
  assert.match(r1.stderr, /câu mở gọi là "Bảo tàng Văn hóa dân gian tỉnh Bình An" mà "agency" chỉ ghi "Bảo tàng Văn hóa dân gian"/);
  assert.match(r1.stderr, /"BẢO TÀNG VĂN HÓA" \/ "DÂN GIAN" dồn một dòng vẫn vừa cột/);
  assert.match(read(path.join(dir, 'short.txt')), /\(Kèm theo Tờ trình số 04\/TTr-BTA ngày 02 tháng 3 năm 2027 của Bảo tàng Văn hóa dân gian tỉnh Bình An\)/);
  // Ô thành tiền lệch: không thừa số nào chia ra số nguyên thì báo ô thành tiền; chia ra số nguyên thì nêu số thay thế.
  assert.match(r1.stderr, /10\.630\.000 \(cột "Thành tiền"\); chia ngược không ra số nguyên ở cột nào, nên nhiều khả năng ô thành tiền ghi sai/);
  assert.match(r1.stderr, /16\.000\.000 \(cột "Thành tiền"\); muốn thành tiền đúng thì cột "Đơn giá" là 3\.200\.000/);
  // Tên đủ một dòng, dài quá cột: tự ngắt trước địa danh, không báo gì về tên.
  const full = path.join(dir, 'full.json');
  fs.writeFileSync(full, JSON.stringify({ ...base, agency: 'Bảo tàng Văn hóa dân gian tỉnh Bình An' }));
  const r2 = node('official-doc-docx.mjs', [full, path.join(dir, 'full.docx'), '--text', path.join(dir, 'full.txt')]);
  assert.equal(r2.status, 0, r2.out);
  assert.ok(!/Tên cơ quan cần xem lại/.test(r2.stderr), r2.stderr);
  assert.match(read(path.join(dir, 'full.txt')), /^SỞ VĂN HÓA TỈNH BÌNH AN\nBẢO TÀNG VĂN HÓA DÂN GIAN\nTỈNH BÌNH AN\n/);
  const doc = readZip(fs.readFileSync(path.join(dir, 'full.docx'))).get('word/document.xml').toString('utf8');
  assert.match(doc, /BẢO TÀNG VĂN HÓA DÂN GIAN<\/w:t>/);
  // Đoạn cuối thân bài giữ cùng trang với câu kết; chữ cho lint không lặp đoạn đó.
  assert.match(doc, /<w:keepNext\/>(?:(?!<\/w:p>).)*?Đề nghị phê duyệt dự toán\./s);
  assert.equal(read(path.join(dir, 'full.txt')).split('Đề nghị phê duyệt dự toán.').length, 2);
});

test('official-doc-docx: cách dòng, cỡ chữ để dồn trang; --check-pdf báo trang trống lớn và trang cuối chỉ có khối ký', async () => {
  const { readZip } = await import('../scripts/bid/lib/zip.mjs');
  const dir = tmp();
  const base = {
    parentAgency: 'Sở Y tế tỉnh C', agency: 'Trung tâm Kiểm nghiệm tỉnh C', number: '09/TTr-TTKN', place: 'Tỉnh C',
    date: '2027-04-08', docType: 'Tờ trình', subject: 'Đề nghị phê duyệt dự toán mua hóa chất năm 2027',
    recipients: ['Sở Y tế tỉnh C'], opening: ['Trung tâm Kiểm nghiệm tỉnh C kính trình Sở Y tế tỉnh C như sau:'],
    body: [{ heading: 'Kiến nghị', paragraphs: ['Đề nghị phê duyệt dự toán.'] }],
    closing: ['Kính trình Sở Y tế tỉnh C xem xét, quyết định.'], archive: 'VT, KN',
    signingAuthority: 'KT. Giám đốc', signerTitle: 'Phó Giám đốc', signer: 'Phạm Thị E',
  };
  const tight = path.join(dir, 'tight.json');
  fs.writeFileSync(tight, JSON.stringify({ ...base, lineSpacing: 1.1, fontSize: 13 }));
  const r1 = node('official-doc-docx.mjs', [tight, path.join(dir, 'tight.docx')]);
  assert.equal(r1.status, 0, r1.out);
  assert.ok(!/Cỡ chữ, cách dòng/.test(r1.stderr), r1.stderr);
  const doc = readZip(fs.readFileSync(path.join(dir, 'tight.docx'))).get('word/document.xml').toString('utf8');
  assert.match(doc, /w:line="264"/);
  assert.match(doc, /<w:sz w:val="26"\/>(?:(?!<\/w:p>).)*?Đề nghị phê duyệt dự toán\./s);
  // Ngoài khoảng của Phụ lục I thì báo và dùng mặc định.
  const wide = path.join(dir, 'wide.json');
  fs.writeFileSync(wide, JSON.stringify({ ...base, lineSpacing: 2, fontSize: 12 }));
  const r2 = node('official-doc-docx.mjs', [wide, path.join(dir, 'wide.docx')]);
  assert.match(r2.stderr, /"fontSize" 12 ngoài cỡ 13-14/);
  assert.match(r2.stderr, /"lineSpacing" 2 ngoài khoảng 1 tới 1,5 lines/);
  // Chữ có vị trí như pdftotext -bbox in ra: trang 2 dừng ở 556pt (trống khoảng 31%), trang 3 chỉ một dòng thân bài trước câu kết.
  const word = (y, t) => `<word xMin="100" yMin="${y}" xMax="150" yMax="${y + 15}">${t}</word>`;
  const page = (...ws) => `<page width="595.32" height="841.92">${word(36, '2')}${ws.join('')}</page>`;
  const bad = path.join(dir, 'bad.html');
  fs.writeFileSync(bad, `<doc>${page(word(700, 'a'), word(760, 'b'))}${page(word(541, 'đồng;'))}${page(word(57, 'UBND.'), word(80, 'định./.'), word(260, 'E'))}${page(word(60, 'Phụ'))}</doc>`);
  const r3 = node('official-doc-docx.mjs', ['--check-pdf', bad]);
  assert.equal(r3.status, 2, r3.out);
  assert.match(r3.stderr, /trang 2 trống khoảng 31% ở cuối, mà văn bản chính còn sang trang 3/);
  assert.match(r3.stderr, /trang 3 \(trang cuối của văn bản chính\) chỉ có 1 dòng thân bài phía trên câu kết/);
  assert.ok(!/trang 1 trống/.test(r3.stderr), r3.stderr);
  const good = path.join(dir, 'good.html');
  fs.writeFileSync(good, `<doc>${page(word(760, 'a'))}${page(word(57, 'b'), word(80, 'c'), word(100, 'd'), word(120, 'e'), word(140, 'định./.'))}</doc>`);
  const r4 = node('official-doc-docx.mjs', ['--check-pdf', good]);
  assert.equal(r4.status, 0, r4.out);
  assert.match(r4.stdout, /văn bản chính 2 trang, không trang nào trống lớn/);
});

test('report-docx: phông theo khoá font, số trang ở chân trang, khối tự do, ảnh dọc thu vừa trang, xuất chữ để soát', async () => {
  const { readZip } = await import('../scripts/bid/lib/zip.mjs');
  const dir = tmp();
  // Ảnh PNG 1x1 hợp lệ, sửa số đo trong phần đầu thành 1080 x 2400 như ảnh chụp điện thoại dọc (script chỉ đọc phần đầu).
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  png.writeUInt32BE(1080, 16);
  png.writeUInt32BE(2400, 20);
  fs.writeFileSync(path.join(dir, 'phone.png'), png);
  const json = path.join(dir, 'c.json');
  fs.writeFileSync(json, JSON.stringify({
    font: 'Times New Roman', title: 'Báo cáo thử', meta: 'Dữ kiện giả.',
    sections: [{ heading: 'Diễn biến', blocks: [
      'Đoạn dẫn tới `config.yml`.',
      { code: 'ERROR queue=12, workers=4\nWARN dòng hai' },
      { image: { file: 'phone.png', caption: 'Ảnh 1. Màn hình báo lỗi' } },
      'Đoạn đọc ảnh.',
      { table: { columns: ['Giờ', 'Việc'], rows: [['08:10', 'Cập nhật phiên bản']], caption: 'Bảng 1. Mốc giờ' } },
    ] }, { heading: 'Ảnh hẹp', blocks: [{ image: { file: 'phone.png', caption: 'Ảnh 2. Thu theo bề ngang', widthCm: 5 } }] }],
  }));
  const out = path.join(dir, 'r.docx');
  const txt = path.join(dir, 'r.md');
  const r = node('report-docx.mjs', [json, out, '--text', txt]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.stdout, /phone\.png: in 9\.9 x 22\.0 cm.*cao quá trang/);
  assert.match(r.stdout, /phone\.png: in 5\.0 x 11\.1 cm/);
  const zip = readZip(fs.readFileSync(out));
  const doc = zip.get('word/document.xml').toString('utf8');
  const styles = zip.get('word/styles.xml').toString('utf8');
  assert.match(styles, /Times New Roman/);
  assert.doesNotMatch(doc + styles, /Arial/);
  const footer = [...zip.keys()].filter((k) => /^word\/footer\d*\.xml$/.test(k)).map((k) => zip.get(k).toString('utf8')).join('');
  assert.match(footer, /PAGE/);
  assert.match(footer, /NUMPAGES/);
  // Thứ tự khối giữ đúng như trong JSON: đoạn dẫn, mã, ảnh, đoạn đọc ảnh, bảng.
  const order = ['config.yml', 'queue=12, workers=4', 'Ảnh 1. Màn hình', 'Đoạn đọc ảnh', 'Cập nhật phiên bản'].map((s) => doc.indexOf(s));
  assert.ok(order.every((x, i) => x > 0 && (i === 0 || x > order[i - 1])), order.join(','));
  // Ảnh cao nhất 22 cm (EMU = cm x 360000).
  const heights = [...doc.matchAll(/<wp:extent cx="(\d+)" cy="(\d+)"/g)].map((m) => Number(m[2]));
  assert.ok(heights.length === 2 && heights.every((cy) => cy <= 22 * 360000 + 10000), heights.join(','));
  const text = read(txt);
  assert.match(text, /^## 1\. Diễn biến\n\nĐoạn dẫn tới `config\.yml`\.\n\n```\nERROR queue=12/m);
  assert.match(text, /^\| 08:10 \| Cập nhật phiên bản \|$/m);
  // Bỏ số trang khi không cần.
  fs.writeFileSync(json, JSON.stringify({ title: 'Ngắn', pageNumbers: false, sections: [{ heading: 'A', paragraphs: ['Một đoạn.'] }] }));
  assert.equal(node('report-docx.mjs', [json, out]).status, 0);
  assert.ok(![...readZip(fs.readFileSync(out)).keys()].some((k) => /footer/.test(k)));
});

test('report-docx: hàng cuối giữ cùng trang với chú thích bảng, ảnh ngang in đủ 16 cm, báo tên mã nằm ngoài `…`', async () => {
  const { readZip } = await import('../scripts/bid/lib/zip.mjs');
  const dir = tmp();
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  png.writeUInt32BE(1600, 16);
  png.writeUInt32BE(700, 20);
  fs.writeFileSync(path.join(dir, 'chart.png'), png);
  const json = path.join(dir, 'c.json');
  fs.writeFileSync(json, JSON.stringify({
    title: 'Báo cáo thử', meta: 'Dữ kiện giả, xuất ngày 2026-01-05.',
    sections: [{ heading: 'Lý do', blocks: [
      'Cần đếm lại bảng order_items, khoá `max_retry` đã bọc, tệp app-config.yml và khoá max-idle-time chưa bọc.',
      { image: { file: 'chart.png', widthCm: 16, caption: 'Hình 1. Biểu đồ' } },
      { table: { columns: ['Việc', 'Người làm'], rows: [['Việc đầu', 'An'], ['Đếm order_items', 'HÀNG CUỐI']],
        caption: 'Bảng 1. Việc tiếp theo' } },
      { table: { columns: ['A'], rows: [['BẢNG KHÔNG CHÚ THÍCH']] } },
    ] }],
  }));
  const out = path.join(dir, 'r.docx');
  const r = node('report-docx.mjs', [json, out]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.stdout, /chart\.png: in 16\.0 x 7\.0 cm/);
  const warn = r.stdout.split('\n').find((l) => l.startsWith('Chữ giống tên trong mã')) ?? '';
  assert.match(warn, /order_items \(2 lần\)/);
  assert.match(warn, /app-config\.yml/);
  assert.match(warn, /max-idle-time/);
  assert.doesNotMatch(warn, /max_retry|2026-01-05/);
  const doc = readZip(fs.readFileSync(out)).get('word/document.xml').toString('utf8');
  const paraOf = (s) => doc.slice(doc.lastIndexOf('<w:p>', doc.indexOf(s)), doc.indexOf(s));
  assert.match(paraOf('HÀNG CUỐI'), /<w:keepNext\/>/);
  assert.doesNotMatch(paraOf('Việc đầu'), /<w:keepNext\/>/);
  assert.doesNotMatch(paraOf('BẢNG KHÔNG CHÚ THÍCH'), /<w:keepNext\/>/);
  assert.match(doc, /<w:cantSplit\/>/);
});

test('report-docx: đoạn mở intro trước mục 1, báo mốc giờ có ở nhiều mục', async () => {
  const { readZip } = await import('../scripts/bid/lib/zip.mjs');
  const dir = tmp();
  const json = path.join(dir, 'c.json');
  fs.writeFileSync(json, JSON.stringify({
    title: 'Báo cáo thử', meta: 'Dữ kiện giả, lập lúc 10:00.',
    intro: ['ĐOẠN MỞ: từ 07:05 tới 07:55, khách không thanh toán được.'],
    sections: [
      { heading: 'Thời gian lỗi', paragraphs: ['Lỗi đầu tiên lúc 07:05:12. Sau khi khởi động lại lúc 07:20, lỗi giảm.'] },
      { heading: 'Diễn biến', blocks: [
        { table: { columns: ['Giờ', 'Việc'], rows: [['07:05:12', 'Lỗi đầu tiên'], ['07:20', 'Khởi động lại']] } },
        'Lần khởi động lại lúc 07:20 không làm hết lỗi.',
      ] },
      { heading: 'Việc tiếp theo', paragraphs: ['Chưa có hạn.'] },
    ],
  }));
  const out = path.join(dir, 'r.docx');
  const txt = path.join(dir, 'r.md');
  const r = node('report-docx.mjs', [json, out, '--text', txt]);
  assert.equal(r.status, 0, r.out);
  const doc = readZip(fs.readFileSync(out)).get('word/document.xml').toString('utf8');
  assert.ok(doc.indexOf('ĐOẠN MỞ') > doc.indexOf('Dữ kiện giả') && doc.indexOf('ĐOẠN MỞ') < doc.indexOf('1. Thời gian lỗi'));
  assert.match(read(txt), /^Dữ kiện giả, lập lúc 10:00\.\n\nĐOẠN MỞ/m);
  const line = r.stdout.split('\n').find((l) => l.startsWith('Mốc giờ có ở nhiều mục')) ?? '';
  assert.match(line, /07:20 ở mục 1, 2 \(2 lần\)/);
  assert.match(line, /07:05 ở mục 1, 2/);
  // Nhan đề, meta, intro không tính; mốc chỉ ở một mục thì không báo.
  assert.doesNotMatch(line, /07:55|10:00/);
});

test('official-doc-docx và report-docx tô nền vàng chỗ đánh dấu cần xác nhận, cần bổ sung', async () => {
  const { readZip } = await import('../scripts/bid/lib/zip.mjs');
  const dir = tmp();
  const lit = (file) => [...readZip(fs.readFileSync(file)).get('word/document.xml').toString('utf8')
    .matchAll(/<w:r>(?:(?!<\/w:r>).)*?<w:highlight w:val="yellow"\/>(?:(?!<\/w:r>).)*?<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]);
  const off = path.join(dir, 'tt.json');
  fs.writeFileSync(off, JSON.stringify({
    parentAgency: 'Sở A', agency: 'Trung tâm B', number: '03/TTr-TTB', place: 'Tỉnh A', date: '2027-02-05',
    docType: 'Tờ trình', subject: 'Về việc mua sắm năm 2027', recipients: ['Sở A'],
    opening: ['Trung tâm B mua 10 máy, đơn giá [cần xác nhận: 15 hay 16 triệu đồng] mỗi máy.'],
    closing: ['Kính trình Sở A xem xét.'], archive: 'VT, TTB',
    signingAuthority: 'Giám đốc', signerTitle: 'Giám đốc', signer: '[cần bổ sung: người ký]',
  }));
  const r1 = node('official-doc-docx.mjs', [off, path.join(dir, 'tt.docx')]);
  assert.equal(r1.status, 0, r1.out);
  assert.ok(lit(path.join(dir, 'tt.docx')).includes('[cần xác nhận: 15 hay 16 triệu đồng]'));
  const rep = path.join(dir, 'r.json');
  fs.writeFileSync(rep, JSON.stringify({ title: 'Báo cáo thử', sections: [{ heading: 'Diễn biến',
    blocks: ['Lỗi bắt đầu lúc [cần xác nhận: giờ], sau khi cập nhật `config.yml` [Cần bổ sung phiên bản].'] }] }));
  const r2 = node('report-docx.mjs', [rep, path.join(dir, 'r.docx')]);
  assert.equal(r2.status, 0, r2.out);
  assert.deepEqual(lit(path.join(dir, 'r.docx')), ['[cần xác nhận: giờ]', '[Cần bổ sung phiên bản]']);
});
