// Test cho scripts/setup.mjs: cài, máy thứ hai, gom commit, kéo về, xung đột, soát, mất mạng, kênh cập nhật, lịch tự lưu.
// Chạy: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, tmp, node, git, bareRepo, machine, answers, read, append } from './helpers.mjs';

const mem = (home, f) => path.join(home, 'agent-memory', f);

// Hai máy dùng chung một repo bộ nhớ; máy A cài trước và đẩy lên, máy B kéo về.
function twoMachines({ codex = false } = {}) {
  const root = tmp();
  const remote = bareRepo(path.join(root, 'memory.git'));
  const a = machine(root, 'a', { codex });
  const b = machine(root, 'b', { codex });
  const ans = answers(root);
  const ra = node('setup.mjs', ['--home', a, '--answers', ans, '--remote', remote, '--no-schedule']);
  assert.equal(ra.status, 0, ra.out);
  const rb = node('setup.mjs', ['--home', b, '--remote', remote, '--no-schedule']);
  assert.equal(rb.status, 0, rb.out);
  return { root, remote, a, b };
}

test('cài máy A rồi máy B kéo đúng bộ nhớ về, machine.md không lên repo', () => {
  const { remote, a, b } = twoMachines({ codex: true });
  for (const f of ['AGENTS.md', 'user.md', 'memory.md', 'team.md', 'machine.md']) assert.ok(fs.existsSync(mem(a, f)), f);
  assert.match(read(mem(a, 'user.md')), /Gọi là: Lan\./);
  const tree = git(remote, 'ls-tree', '--name-only', 'main').split('\n');
  assert.ok(tree.includes('user.md') && !tree.includes('machine.md'));
  assert.equal(read(mem(b, 'user.md')), read(mem(a, 'user.md')));
  assert.match(read(path.join(a, '.claude', 'CLAUDE.md')), /@.*agent-memory\/AGENTS\.md/);
  const hooks = JSON.parse(read(path.join(a, '.claude', 'settings.json'))).hooks;
  assert.ok(hooks.SessionStart[0].hooks[0].command.includes('sync'));
  assert.ok(hooks.SessionEnd[0].hooks[0].command.includes('sync --quiet'));
  assert.match(read(path.join(a, '.codex', 'AGENTS.md')), /vina-me memory: start[\s\S]*Gọi là: Lan[\s\S]*vina-me memory: end/);
});

test('chạy cài lại không sinh dòng, hook hay khối trùng', () => {
  const { a, remote } = twoMachines({ codex: true });
  const files = [path.join(a, '.claude', 'CLAUDE.md'), path.join(a, '.claude', 'settings.json'), path.join(a, '.codex', 'AGENTS.md')];
  const before = files.map(read);
  const r = node('setup.mjs', ['--home', a, '--remote', remote, '--no-schedule']);
  assert.equal(r.status, 0, r.out);
  assert.deepEqual(files.map(read), before);
});

test('sync gom thay đổi thành một commit, máy kia kéo về và in đúng tệp đổi', () => {
  const { remote, a, b } = twoMachines();
  append(mem(a, 'memory.md'), '- Báo cáo gửi sếp: câu đầu là kết luận.\n');
  node('setup.mjs', ['--home', a, 'sync']);
  assert.match(git(remote, 'log', '-1', '--format=%s', 'main'), /^Update memory\.md/);
  const r = node('setup.mjs', ['--home', b, 'sync']);
  assert.match(r.stdout, /<!-- memory\.md -->[\s\S]*câu đầu là kết luận/);
  assert.equal(node('setup.mjs', ['--home', b, 'sync']).stdout.trim(), '');
});

test('xung đột: resolve mine giữ bản máy này, resolve theirs lấy bản repo và sao lưu', () => {
  const { remote, a, b } = twoMachines();
  const edit = (home, text) => fs.writeFileSync(mem(home, 'user.md'), read(mem(home, 'user.md')).replace(/Gọi là: [^\n]*/, `Gọi là: ${text}.`));
  edit(a, 'A1'); node('setup.mjs', ['--home', a, 'sync']);
  edit(b, 'B1');
  assert.match(node('setup.mjs', ['--home', b, 'sync']).stdout, /Không gộp được/);
  assert.match(node('setup.mjs', ['--home', b, 'conflict']).stdout, /-- Gọi là: A1\.[\s\S]*\+- Gọi là: B1\./);
  assert.equal(node('setup.mjs', ['--home', b, 'resolve', 'mine']).status, 0);
  assert.match(git(remote, 'show', 'main:user.md'), /Gọi là: B1\./);

  node('setup.mjs', ['--home', a, 'sync']); edit(a, 'A2'); node('setup.mjs', ['--home', a, 'sync']);
  edit(b, 'B2'); node('setup.mjs', ['--home', b, 'sync']);
  assert.equal(node('setup.mjs', ['--home', b, 'resolve', 'theirs']).status, 0);
  assert.match(read(mem(b, 'user.md')), /Gọi là: A2\./);
  assert.ok(fs.readdirSync(path.join(b, '.config', 'vina-me')).some((f) => f.startsWith('conflict-backup-')));
  assert.ok(!fs.existsSync(path.join(b, '.config', 'vina-me', 'sync.lock')));
});

test('check báo ý gần trùng và lời trích thiếu ngày', () => {
  const { a } = twoMachines();
  append(mem(a, 'memory.md'), '- Báo cáo gửi sếp câu đầu tiên luôn là kết luận rõ ràng.\n- Báo cáo gửi sếp: câu đầu tiên luôn là kết luận rõ ràng nhé.\n- Lời họ: "đừng viết dài quá nhé bạn".\n');
  const out = node('setup.mjs', ['--home', a, 'check']).stdout;
  assert.match(out, /gần trùng: memory\.md:\d+ và memory\.md:\d+/);
  assert.match(out, /có lời trích mà thiếu ngày/);
});

test('mất mạng: sync vẫn commit trên máy, báo một dòng, xong nhanh', () => {
  const { a } = twoMachines();
  git(path.join(a, 'agent-memory'), 'remote', 'set-url', 'origin', 'https://invalid.invalid/memory.git');
  append(mem(a, 'memory.md'), '- thử khi mất mạng\n');
  const start = Date.now();
  const r = node('setup.mjs', ['--home', a, 'sync']);
  assert.ok(Date.now() - start < 20000);
  assert.match(r.stdout, /Không kết nối được repo bộ nhớ/);
  assert.match(git(path.join(a, 'agent-memory'), 'log', '-1', '--format=%s'), /^Update memory\.md/);
});

test('kênh release dừng ở tag mới nhất, kênh main theo đầu nhánh', () => {
  const root = tmp();
  const a = machine(root, 'a');
  const r = node('setup.mjs', ['--home', a, '--answers', answers(root), '--no-schedule']);
  assert.equal(r.status, 0, r.out);
  const source = path.join(a, '.config', 'vina-me', 'source');
  const bare = path.join(root, 'vina.git');
  spawnBare(source, bare);
  const dev = path.join(root, 'dev');
  git(root, 'clone', '-q', bare, dev);
  git(dev, 'checkout', '-q', '-B', 'main', 'origin/main');
  fs.writeFileSync(path.join(dev, 'CHANGELOG.md'), '# Thay đổi\n\n## 9.9.0 (01/01/2027)\n\n- Dòng đầu xuống dòng\n  giữa câu vẫn đọc liền.\n- Dòng hai.\n');
  git(dev, 'add', 'CHANGELOG.md');
  git(dev, '-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', 'release');
  git(dev, 'tag', 'v9.9.0');
  fs.appendFileSync(path.join(dev, 'README.md'), '\nchưa phát hành\n');
  git(dev, '-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-am', 'unreleased');
  git(dev, 'push', '-q', 'origin', 'main', '--tags');
  git(source, 'remote', 'set-url', 'origin', bare);
  const readme = path.join(a, '.claude', 'skills', 'vina-me', 'README.md');
  assert.match(node('setup.mjs', ['--home', a, 'update']).stdout, /v9\.9\.0: Dòng đầu xuống dòng giữa câu vẫn đọc liền\.\n/);
  assert.ok(!read(readme).includes('chưa phát hành'));
  node('setup.mjs', ['--home', a, 'channel', 'main']);
  assert.ok(read(readme).includes('chưa phát hành'));
  node('setup.mjs', ['--home', a, 'channel', 'release']);
  assert.ok(!read(readme).includes('chưa phát hành'));
});

function spawnBare(source, bare) {
  git(path.dirname(bare), 'clone', '-q', '--bare', source, bare);
  // bản chép từ thư mục đang làm có thể đứng ở nhánh khác: đặt main của repo trần bằng HEAD của bản chép
  const head = git(source, 'rev-parse', 'HEAD');
  git(bare, 'update-ref', 'refs/heads/main', head);
}

test('lịch tự lưu trên Linux, macOS: hai dòng crontab, chạy lại không trùng', { skip: process.platform === 'win32' && 'Windows dùng Task Scheduler, đã thử tay' }, () => {
  const root = tmp();
  const bin = path.join(root, 'bin');
  const store = path.join(root, 'crontab.txt');
  fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, 'crontab'), `#!/bin/sh\nif [ "$1" = "-l" ]; then cat "${store}" 2>/dev/null; else cat > "${store}"; fi\n`, { mode: 0o755 });
  const env = { PATH: `${bin}${path.delimiter}${process.env.PATH}` };
  const a = machine(root, 'a');
  assert.equal(node('setup.mjs', ['--home', a, '--answers', answers(root)], { env }).status, 0);
  node('setup.mjs', ['--home', a, '--answers', answers(root)], { env });
  const lines = read(store).split('\n').filter((l) => l.includes('# vina-me sync'));
  assert.equal(lines.length, 2);
  assert.ok(lines.some((l) => l.startsWith('@reboot')) && lines.some((l) => l.startsWith('0 */2 * * *')));
});

test('không có cửa sổ dòng lệnh và không có tệp trả lời thì dừng, không cài gì', () => {
  const root = tmp();
  const a = machine(root, 'a');
  const r = node('setup.mjs', ['--home', a]);
  assert.notEqual(r.status, 0);
  assert.ok(!fs.existsSync(path.join(a, 'agent-memory')));
  assert.ok(!fs.existsSync(path.join(a, '.claude', 'skills')));
});

test('ROOT là thư mục skill', () => assert.ok(fs.existsSync(path.join(ROOT, 'SKILL.md'))));
