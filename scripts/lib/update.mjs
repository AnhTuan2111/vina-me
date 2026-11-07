// Giữ bản clone của vina-me và cập nhật lên tag phát hành mới nhất (hoặc nhánh main).

import fs from 'node:fs';
import path from 'node:path';
import { skillSrc, configDir, managedSource, UPSTREAM_URL, exists, read, write, log, run, gitIn, git, firstLine, gitNet, timedOut, OFFLINE } from './context.mjs';

// Bản clone vina-me do script giữ, để máy nào đã cài cũng kéo được bản mới, kể cả khi thư mục người dùng clone lúc đầu đã xoá.
function ensureManagedSource() {
  if (exists(path.join(managedSource, '.git'))) return true;
  if (exists(path.join(skillSrc, '.git'))) {
    fs.cpSync(skillSrc, managedSource, { recursive: true, filter: (src) => !path.relative(skillSrc, src).split(path.sep).includes('node_modules') });
    return true;
  }
  return run('git', ['clone', '-q', UPSTREAM_URL, managedSource]).status === 0;
}

function copySkill(target, from = skillSrc) {
  if (path.resolve(target) === path.resolve(from)) return;
  fs.cpSync(from, target, {
    recursive: true,
    filter: (src) => !path.relative(from, src).split(path.sep).some((s) => s === '.git' || s === 'node_modules'),
  });
}

// Kéo vina-me mới nhất; có bản mới thì chép sang mọi thư mục skill đã cài. Trả về dòng báo, hoặc rỗng nếu không có gì mới.
// Không ép (force) thì kiểm tối đa 6 giờ một lần, để hook đầu phiên không tốn thêm một lượt mạng ở mọi phiên.
const SKILL_CHECK_EVERY = 6 * 3600 * 1000;
function updateSkill(force = false) {
  const cfg = readConfig();
  const source = cfg.source && exists(path.join(cfg.source, '.git')) ? cfg.source : null;
  if (!source) return '';
  if (!force && Date.now() - (cfg.lastSkillCheck ?? 0) < SKILL_CHECK_EVERY) return '';
  writeConfig({ ...cfg, lastSkillCheck: Date.now() });
  const g = gitIn(source);
  const before = g('rev-parse', 'HEAD').stdout.trim();
  // Ép cập nhật (lệnh update) mà lỗi thì nói lỗi; trong sync tự động thì im, lần sau thử lại.
  const failed = (r) => (force ? `  chưa cập nhật được vina-me: ${timedOut(r) ? OFFLINE : firstLine(r)}` : '');
  // Kênh release (mặc định): đứng ở tag vX.Y.Z mới nhất. Kênh main: theo đầu nhánh main, dành cho người bảo trì thử bản
  // đang làm. Repo chưa có tag nào thì kênh release cũng theo main.
  const channel = cfg.channel === 'main' ? 'main' : 'release';
  const f = gitNet(source, 'fetch', '-q', '--tags', '--prune', 'origin');
  if (f.status !== 0) return failed(f);
  const tag = channel === 'release' ? latestTag(source) : null;
  const target = tag ?? 'origin/main';
  // Bản clone này do script giữ, người dùng không sửa: ép chuyển để một thay đổi lạc (kiểu xuống dòng, quyền tệp) không chặn cập nhật.
  const c = g('checkout', '-q', '--force', '--detach', target);
  if (c.status !== 0) return failed(c);
  const after = g('rev-parse', 'HEAD').stdout.trim();
  const missing = (cfg.targets ?? []).some((t) => !exists(path.join(t, 'SKILL.md')));
  if (before === after && !missing) return '';
  for (const t of cfg.targets ?? []) copySkill(t, source);
  const label = tag ?? `${after.slice(0, 7)} (nhánh main)`;
  const note = tag ? changelogLine(source, tag) : g('log', '-1', '--format=%s').stdout.trim();
  return `vina-me vừa được cập nhật lên ${label}${note ? `: ${note}` : ''}`;
}

// Tag phát hành mới nhất dạng vX.Y.Z, so theo số phiên bản chứ không theo chữ.
function latestTag(dir) {
  const tags = gitIn(dir)('tag', '-l', 'v*', '--sort=-v:refname').stdout.split('\n').map((t) => t.trim());
  return tags.find((t) => /^v\d+\.\d+\.\d+$/.test(t)) ?? null;
}

// Dòng gạch đầu dòng đầu tiên của mục phiên bản đó trong CHANGELOG.md.
function changelogLine(dir, tag) {
  const file = path.join(dir, 'CHANGELOG.md');
  if (!exists(file)) return '';
  const lines = read(file).split('\n');
  const start = lines.findIndex((l) => l.startsWith(`## ${tag.replace(/^v/, '')}`));
  if (start < 0) return '';
  const rest = lines.slice(start + 1);
  const at = rest.findIndex((l) => /^-\s/.test(l));
  if (at < 0) return '';
  // một gạch đầu dòng có thể xuống dòng giữa câu: nối các dòng thụt vào ngay sau nó
  const tail = [];
  for (const l of rest.slice(at + 1)) { if (!/^\s+\S/.test(l)) break; tail.push(l.trim()); }
  return [rest[at].replace(/^-\s+/, '').trim(), ...tail].join(' ');
}

function readConfig() {
  try { return JSON.parse(read(path.join(configDir, 'config.json'))); } catch { return {}; }
}
function writeConfig(cfg) { write(path.join(configDir, 'config.json'), JSON.stringify(cfg, null, 2) + '\n'); }

export { ensureManagedSource, copySkill, SKILL_CHECK_EVERY, updateSkill, latestTag, changelogLine, readConfig, writeConfig };
