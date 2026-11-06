// Hàm dùng chung cho bộ test: thư mục tạm, chạy script trên home giả, gọi git.
// Mọi lệnh chạy với GH_CONFIG_DIR trỏ tới thư mục trống, để gh coi như chưa đăng nhập và không bao giờ chạm GitHub thật.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const script = (name) => path.join(ROOT, 'scripts', name);

export function tmp(prefix = 'vina-me-test-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

const GH_EMPTY = tmp('vina-me-gh-');
export const baseEnv = { ...process.env, GH_CONFIG_DIR: GH_EMPTY, VINA_ME_NET_TIMEOUT: '3000', NO_COLOR: '1' };

export function node(name, args, { input = '', env = {} } = {}) {
  const r = spawnSync(process.execPath, [script(name), ...args], { encoding: 'utf8', input, env: { ...baseEnv, ...env }, timeout: 120000 });
  return { ...r, out: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}

export function git(dir, ...args) {
  const r = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8', env: { ...baseEnv, GIT_TERMINAL_PROMPT: '0' } });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr}`);
  return r.stdout.trim();
}

export function bareRepo(dir) {
  spawnSync('git', ['init', '-q', '--bare', '-b', 'main', dir]);
  return dir;
}

// Một máy giả: home có .claude (và .codex nếu cần), tệp câu trả lời cho lượt hỏi.
export function machine(root, name, { codex = false } = {}) {
  const home = path.join(root, name);
  fs.mkdirSync(path.join(home, '.claude'), { recursive: true });
  if (codex) fs.mkdirSync(path.join(home, '.codex'), { recursive: true });
  return home;
}

export function answers(root, extra = {}) {
  const file = path.join(root, 'answers.json');
  fs.writeFileSync(file, JSON.stringify({ name: 'Lan', role: 'BA', writesFor: 'sếp', length: '2', learnFromSessions: 'n', github: 'n', ...extra }));
  return file;
}

export const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
export const append = (p, text) => fs.appendFileSync(p, text);
