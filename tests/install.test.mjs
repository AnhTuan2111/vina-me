// Test cho các script cài (install-*.mjs), lệnh bộ nhớ (memory.mjs), tự cập nhật (update.mjs) và setup.mjs chuyển tiếp:
// cài từng việc, máy thứ hai, cài lại không trùng, gom commit, kéo về, xung đột, soát, mất mạng, kênh cập nhật, lịch tự lưu,
// máy cài bản cũ. Mọi lệnh chạy trên home giả trong thư mục tạm.
// Chạy: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, tmp, node, git, bareRepo, machine, answers, read, append } from './helpers.mjs';

const mem = (home, f) => path.join(home, 'agent-memory', f);
const ok = (r) => assert.equal(r.status, 0, r.out);
const settings = (home) => JSON.parse(read(path.join(home, '.claude', 'settings.json')));

// Cài đủ năm việc trên một máy. remote: repo bộ nhớ (máy đầu đẩy lên, máy sau kéo về).
function installAll(home, { ans, remote } = {}) {
  ok(node('install-skill.mjs', ['--home', home]));
  ok(node('install-remind.mjs', ['--home', home]));
  ok(node('install-memory.mjs', ['--home', home, ...(ans ? ['--answers', ans] : []), ...(remote ? ['--remote', remote] : [])]));
  ok(node('install-autosave.mjs', ['--home', home]));
}

// Hai máy dùng chung một repo bộ nhớ; máy A cài trước và đẩy lên, máy B kéo về.
function twoMachines({ codex = false, omp = false } = {}) {
  const root = tmp();
  const remote = bareRepo(path.join(root, 'memory.git'));
  const a = machine(root, 'a', { codex, omp });
  const b = machine(root, 'b', { codex, omp });
  installAll(a, { ans: answers(root), remote });
  installAll(b, { remote });
  return { root, remote, a, b };
}

test('install-skill chép skill cho từng agent có trên máy, không thấy agent nào thì dừng', () => {
  const root = tmp();
  const a = machine(root, 'a', { codex: true, omp: true });
  ok(node('install-skill.mjs', ['--home', a]));
  for (const d of ['.claude/skills', '.agents/skills', '.codex/skills']) assert.ok(fs.existsSync(path.join(a, d, 'vina-me', 'SKILL.md')), d);
  const empty = machine(root, 'empty', { claude: false });
  const r = node('install-skill.mjs', ['--home', empty]);
  assert.notEqual(r.status, 0);
  assert.match(r.out, /Không thấy Claude Code, Codex hay omp/);
});

test('install-remind gắn hook Claude Code và extension omp, cần cài skill trước', () => {
  const root = tmp();
  const a = machine(root, 'a', { omp: true });
  const before = node('install-remind.mjs', ['--home', a]);
  assert.notEqual(before.status, 0);
  assert.match(before.out, /install-skill\.mjs trước/);
  ok(node('install-skill.mjs', ['--home', a]));
  ok(node('install-remind.mjs', ['--home', a]));
  assert.ok(settings(a).hooks.UserPromptSubmit[0].hooks[0].command.includes('remind.mjs'));
  const ext = read(path.join(a, '.omp', 'agent', 'extensions', 'vina-me-remind.ts'));
  assert.match(ext, /before_agent_start/);
  assert.match(ext, /skill:\/\/vina-me/);
  // remind.mjs của bản đã cài in đúng lời nhắc cho Claude Code
  const remind = spawnSync(process.execPath, [path.join(a, '.claude', 'skills', 'vina-me', 'scripts', 'remind.mjs')], { encoding: 'utf8' });
  assert.match(remind.stdout, /Luật cứng của skill vina-me/);
});

test('cài máy A rồi máy B kéo đúng bộ nhớ về, nối vào Claude Code, Codex, omp; machine.md không lên repo', () => {
  const { remote, a, b } = twoMachines({ codex: true, omp: true });
  for (const f of ['AGENTS.md', 'user.md', 'memory.md', 'team.md', 'machine.md']) assert.ok(fs.existsSync(mem(a, f)), f);
  assert.match(read(mem(a, 'user.md')), /Gọi là: Lan\./);
  const tree = git(remote, 'ls-tree', '--name-only', 'main').split('\n');
  assert.ok(tree.includes('user.md') && !tree.includes('machine.md'));
  assert.equal(read(mem(b, 'user.md')), read(mem(a, 'user.md')));
  assert.match(read(path.join(a, '.claude', 'CLAUDE.md')), /@.*agent-memory\/AGENTS\.md/);
  const hooks = settings(a).hooks;
  assert.ok(hooks.SessionStart[0].hooks[0].command.includes('memory.mjs'));
  assert.ok(hooks.SessionEnd[0].hooks[0].command.includes('sync --quiet'));
  assert.match(read(path.join(a, '.codex', 'AGENTS.md')), /vina-me memory: start[\s\S]*Gọi là: Lan[\s\S]*vina-me memory: end/);
  assert.match(read(path.join(a, '.omp', 'agent', 'AGENTS.md')), /agent-memory\/AGENTS\.md/);
  assert.match(read(path.join(a, '.omp', 'agent', 'extensions', 'vina-me-memory.ts')), /Bộ nhớ dùng chung/);
  assert.match(read(mem(a, 'machine.md')), /memory\.mjs[\s\S]*Tự lưu: Claude Code chạy/);
});

test('chạy cài lại không sinh dòng, hook, khối hay extension trùng', () => {
  const { a, remote } = twoMachines({ codex: true, omp: true });
  const files = [
    path.join(a, '.claude', 'CLAUDE.md'), path.join(a, '.claude', 'settings.json'), path.join(a, '.codex', 'AGENTS.md'),
    path.join(a, '.omp', 'agent', 'AGENTS.md'), path.join(a, '.omp', 'agent', 'extensions', 'vina-me-remind.ts'),
  ];
  const before = files.map(read);
  installAll(a, { remote });
  assert.deepEqual(files.map(read), before);
});

test('các script cài chỉ làm việc của mình', () => {
  const root = tmp();
  const a = machine(root, 'a');
  ok(node('install-skill.mjs', ['--home', a]));
  assert.ok(!fs.existsSync(path.join(a, '.claude', 'settings.json')));
  assert.ok(!fs.existsSync(path.join(a, 'agent-memory')));
  ok(node('install-memory.mjs', ['--home', a, '--answers', answers(root)]));
  assert.ok(!fs.existsSync(path.join(a, '.claude', 'settings.json')), 'install-memory không thêm hook');
  assert.match(read(mem(a, 'machine.md')), /Chưa cài tự lưu/);
  const r = node('install-autosave.mjs', ['--home', path.join(root, 'none')]);
  assert.notEqual(r.status, 0);
  assert.match(r.out, /install-memory\.mjs trước/);
});

test('máy cài bản cũ: hook setup.mjs sync vẫn chạy được, cài tự lưu không thêm hook trùng', () => {
  const { a } = twoMachines();
  const file = path.join(a, '.claude', 'settings.json');
  const s = settings(a);
  const skillDir = path.join(a, '.claude', 'skills', 'vina-me').split(path.sep).join('/');
  const old = `node "${skillDir}/scripts/setup.mjs" --home "${a.split(path.sep).join('/')}" sync`;
  s.hooks.SessionStart = [{ matcher: 'startup', hooks: [{ type: 'command', command: old, timeout: 60 }] }];
  fs.writeFileSync(file, JSON.stringify(s, null, 2));
  ok(node('install-autosave.mjs', ['--home', a]));
  assert.equal(settings(a).hooks.SessionStart.length, 1);
  append(mem(a, 'memory.md'), '- ghi từ máy cài bản cũ\n');
  ok(node('setup.mjs', ['--home', a, 'sync']));
  assert.match(git(path.join(a, 'agent-memory'), 'log', '-1', '--format=%s'), /^Update memory\.md/);
});

test('setup.mjs chạy trơn chỉ in danh sách script, không cài gì', () => {
  const root = tmp();
  const a = machine(root, 'a');
  const r = node('setup.mjs', ['--home', a]);
  ok(r);
  assert.match(r.stdout, /install-skill\.mjs/);
  assert.ok(!fs.existsSync(path.join(a, '.claude', 'skills')));
  assert.ok(!fs.existsSync(path.join(a, 'agent-memory')));
});

test('sync gom thay đổi thành một commit, máy kia kéo về và in đúng tệp đổi', () => {
  const { remote, a, b } = twoMachines();
  append(mem(a, 'memory.md'), '- Báo cáo gửi sếp: câu đầu là kết luận.\n');
  node('memory.mjs', ['--home', a, 'sync']);
  assert.match(git(remote, 'log', '-1', '--format=%s', 'main'), /^Update memory\.md/);
  const r = node('memory.mjs', ['--home', b, 'sync']);
  assert.match(r.stdout, /<!-- memory\.md -->[\s\S]*câu đầu là kết luận/);
  assert.equal(node('memory.mjs', ['--home', b, 'sync']).stdout.trim(), '');
});

test('xung đột: resolve mine giữ bản máy này, resolve theirs lấy bản repo và sao lưu', () => {
  const { remote, a, b } = twoMachines();
  const edit = (home, text) => fs.writeFileSync(mem(home, 'user.md'), read(mem(home, 'user.md')).replace(/Gọi là: [^\n]*/, `Gọi là: ${text}.`));
  edit(a, 'A1'); node('memory.mjs', ['--home', a, 'sync']);
  edit(b, 'B1');
  assert.match(node('memory.mjs', ['--home', b, 'sync']).stdout, /Không gộp được/);
  assert.match(node('memory.mjs', ['--home', b, 'conflict']).stdout, /-- Gọi là: A1\.[\s\S]*\+- Gọi là: B1\./);
  ok(node('memory.mjs', ['--home', b, 'resolve', 'mine']));
  assert.match(git(remote, 'show', 'main:user.md'), /Gọi là: B1\./);

  node('memory.mjs', ['--home', a, 'sync']); edit(a, 'A2'); node('memory.mjs', ['--home', a, 'sync']);
  edit(b, 'B2'); node('memory.mjs', ['--home', b, 'sync']);
  ok(node('memory.mjs', ['--home', b, 'resolve', 'theirs']));
  assert.match(read(mem(b, 'user.md')), /Gọi là: A2\./);
  assert.ok(fs.readdirSync(path.join(b, '.config', 'vina-me')).some((f) => f.startsWith('conflict-backup-')));
  assert.ok(!fs.existsSync(path.join(b, '.config', 'vina-me', 'sync.lock')));
});

test('check báo ý gần trùng và lời trích thiếu ngày', () => {
  const { a } = twoMachines();
  append(mem(a, 'memory.md'), '- Báo cáo gửi sếp câu đầu tiên luôn là kết luận rõ ràng.\n- Báo cáo gửi sếp: câu đầu tiên luôn là kết luận rõ ràng nhé.\n- Lời họ: "đừng viết dài quá nhé bạn".\n');
  const out = node('memory.mjs', ['--home', a, 'check']).stdout;
  assert.match(out, /gần trùng: memory\.md:\d+ và memory\.md:\d+/);
  assert.match(out, /có lời trích mà thiếu ngày/);
});

test('mất mạng: sync vẫn commit trên máy, báo một dòng, xong nhanh', () => {
  const { a } = twoMachines();
  git(path.join(a, 'agent-memory'), 'remote', 'set-url', 'origin', 'https://invalid.invalid/memory.git');
  append(mem(a, 'memory.md'), '- thử khi mất mạng\n');
  const start = Date.now();
  const r = node('memory.mjs', ['--home', a, 'sync']);
  assert.ok(Date.now() - start < 20000);
  assert.match(r.stdout, /Không kết nối được repo bộ nhớ/);
  assert.match(git(path.join(a, 'agent-memory'), 'log', '-1', '--format=%s'), /^Update memory\.md/);
});

test('memory.mjs chạy trơn hay với option lạ thì không làm gì', () => {
  const root = tmp();
  const a = machine(root, 'a');
  ok(node('memory.mjs', ['--home', a]));
  assert.equal(node('memory.mjs', ['--home', a, '--bogus']).status, 2);
  assert.ok(!fs.existsSync(path.join(a, 'agent-memory')));
});

test('kênh release dừng ở tag mới nhất, kênh main theo đầu nhánh', () => {
  const root = tmp();
  const a = machine(root, 'a');
  ok(node('install-skill.mjs', ['--home', a]));
  ok(node('install-update.mjs', ['--home', a]));
  assert.ok(settings(a).hooks.SessionStart[0].hooks[0].command.includes('update.mjs'));
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
  assert.match(node('update.mjs', ['--home', a]).stdout, /v9\.9\.0: Dòng đầu xuống dòng giữa câu vẫn đọc liền\.\n/);
  assert.ok(!read(readme).includes('chưa phát hành'));
  node('update.mjs', ['--home', a, 'channel', 'main']);
  assert.ok(read(readme).includes('chưa phát hành'));
  node('update.mjs', ['--home', a, 'channel', 'release']);
  assert.ok(!read(readme).includes('chưa phát hành'));
  // setup.mjs update của bản cũ chuyển sang update.mjs
  assert.match(node('setup.mjs', ['--home', a, 'update']).stdout, /bản mới nhất/);
});

function spawnBare(source, bare) {
  git(path.dirname(bare), 'clone', '-q', '--bare', source, bare);
  // bản chép từ thư mục đang làm có thể đứng ở nhánh khác: đặt main của repo trần bằng HEAD của bản chép
  const head = git(source, 'rev-parse', 'HEAD');
  git(bare, 'update-ref', 'refs/heads/main', head);
}

test('update.mjs trên máy chưa cài tự cập nhật: --quiet im lặng, chạy tay thì báo', () => {
  const root = tmp();
  const a = machine(root, 'a');
  const q = node('update.mjs', ['--home', a, '--quiet']);
  ok(q);
  assert.equal(q.out.trim(), '');
  assert.notEqual(node('update.mjs', ['--home', a]).status, 0);
});

test('lịch tự lưu trên Linux, macOS: hai dòng crontab, chạy lại không trùng', { skip: process.platform === 'win32' && 'Windows dùng Task Scheduler, đã thử tay' }, () => {
  const root = tmp();
  const bin = path.join(root, 'bin');
  const store = path.join(root, 'crontab.txt');
  fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, 'crontab'), `#!/bin/sh\nif [ "$1" = "-l" ]; then cat "${store}" 2>/dev/null; else cat > "${store}"; fi\n`, { mode: 0o755 });
  const env = { PATH: `${bin}${path.delimiter}${process.env.PATH}` };
  const a = machine(root, 'a');
  ok(node('install-skill.mjs', ['--home', a], { env }));
  ok(node('install-memory.mjs', ['--home', a, '--answers', answers(root)], { env }));
  ok(node('install-autosave.mjs', ['--home', a, '--schedule'], { env }));
  node('install-autosave.mjs', ['--home', a, '--schedule'], { env });
  const lines = read(store).split('\n').filter((l) => l.includes('# vina-me sync'));
  assert.equal(lines.length, 2);
  assert.ok(lines.some((l) => l.startsWith('@reboot')) && lines.some((l) => l.startsWith('0 */2 * * *')));
  assert.ok(lines.every((l) => l.includes('memory.mjs')));
});

test('không có cửa sổ dòng lệnh và không có tệp trả lời thì dừng, không dựng bộ nhớ', () => {
  const root = tmp();
  const a = machine(root, 'a');
  const r = node('install-memory.mjs', ['--home', a]);
  assert.notEqual(r.status, 0);
  assert.match(r.out, /--answers/);
  assert.ok(!fs.existsSync(path.join(a, 'agent-memory')));
});

test('ROOT là thư mục skill', () => assert.ok(fs.existsSync(path.join(ROOT, 'SKILL.md'))));
