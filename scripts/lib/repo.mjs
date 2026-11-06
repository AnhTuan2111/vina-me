// Repo git của bộ nhớ: tạo, nối remote, kéo về máy thứ hai, gom commit, kéo, đẩy.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { memDir, MEMORY_FILES, GITIGNORE, exists, write, quiet, log, selfCommand, run, git, isRepo, hasUpstream, firstLine, gitNet, timedOut, OFFLINE } from './context.mjs';

function ghUser() {
  const r = run('gh', ['api', 'user', '--jq', '.login + " " + (.id|tostring)']);
  if (r.error || r.status !== 0) return null;
  const [login, id] = r.stdout.trim().split(' ');
  return { login, id };
}

// Commit cần tên và email. Máy chưa đặt thì đặt riêng cho repo bộ nhớ: email noreply của GitHub nếu có, không thì tên máy.
function ensureIdentity(gh) {
  if (git('config', 'user.email').stdout.trim()) return;
  const user = gh?.login ?? os.userInfo().username;
  const email = gh ? `${gh.id}+${gh.login}@users.noreply.github.com` : `${user}@${os.hostname()}`;
  git('config', 'user.name', user);
  git('config', 'user.email', email);
}

function initRepo(gh) {
  if (!isRepo()) git('init', '-q', '-b', 'main');
  if (!exists(path.join(memDir, '.gitignore'))) write(path.join(memDir, '.gitignore'), GITIGNORE);
  ensureIdentity(gh);
  git('add', '-A');
  if (git('diff', '--cached', '--quiet').status !== 0) git('commit', '-q', '-m', 'Create agent memory');
}

// Đưa bộ nhớ đã có lên một repo mới. Có tên repo thì tạo trên GitHub bằng gh; có url thì dùng repo đã tạo sẵn.
function connectRemote({ repoName, url }) {
  if (url) {
    initRepo(null);
    if (git('remote', 'get-url', 'origin').status === 0) git('remote', 'set-url', 'origin', url);
    else git('remote', 'add', 'origin', url);
    const r = git('push', '-q', '-u', 'origin', 'main');
    if (r.status !== 0) { log(`  chưa đẩy được lên ${url}: ${firstLine(r)}`); return false; }
    log(`  bộ nhớ đã nằm ở repo ${url}`);
    return true;
  }
  const gh = ghUser();
  if (!gh) {
    log('  Chưa dùng được GitHub: máy chưa cài gh hoặc chưa đăng nhập. Chạy "gh auth login", rồi chạy:');
    log(`  ${selfCommand} github`);
    return false;
  }
  initRepo(gh);
  const full = `${gh.login}/${repoName}`;
  let r = run('gh', ['repo', 'create', full, '--private', '--source', memDir, '--remote', 'origin', '--push',
    '--description', 'Shared memory for coding agents (set up by vina-me)']);
  if (r.status !== 0) {
    // gh tạo repo được nhưng git chưa có quyền đẩy: nhờ gh làm trình giữ mật khẩu cho git rồi đẩy lại.
    run('gh', ['auth', 'setup-git']);
    r = git('push', '-q', '-u', 'origin', 'main');
    if (r.status !== 0) { log(`  chưa đẩy được lên GitHub: ${firstLine(r)}`); return false; }
  }
  log(`  bộ nhớ đã nằm ở repo riêng tư github.com/${full}`);
  return true;
}

// Máy thứ hai: repo bộ nhớ đã có thì kéo về thay vì dựng mới.
function cloneExisting({ url, full }) {
  const r = url ? run('git', ['clone', '-q', url, memDir]) : run('gh', ['repo', 'clone', full, memDir, '--', '-q']);
  if (r.status !== 0) { log(`  không kéo được bộ nhớ về: ${firstLine(r)}`); return false; }
  log(`  kéo bộ nhớ từ ${url ?? `github.com/${full}`} về ${memDir}`);
  return true;
}

function remoteHasCommits(url) {
  const r = run('git', ['ls-remote', url]);
  return r.status === 0 && r.stdout.trim() !== '';
}

// Gom mọi thay đổi chưa commit thành một commit. Trả về danh sách tệp đã commit.
function commitPending(message) {
  if (!isRepo()) return [];
  git('add', '-A');
  const files = git('diff', '--cached', '--name-only').stdout.split('\n').filter(Boolean);
  if (!files.length) return [];
  ensureIdentity(null);
  const r = git('commit', '-q', '-m', message ?? `Update ${files.join(', ')} (${os.hostname()})`);
  if (r.status !== 0) throw new Error(`không commit được: ${firstLine(r)}`);
  return files;
}



// Kéo bản mới; có tệp bộ nhớ nào đổi thì trả về danh sách tệp đó. Gặp xung đột thì huỷ rebase để repo không kẹt giữa chừng.
// strategy 'mine' giữ bản trên máy ở những đoạn đụng nhau (trong rebase, phía "theirs" là commit của máy này).
function pull(strategy) {
  if (!hasUpstream()) return { changed: [] };
  const before = git('rev-parse', 'HEAD').stdout.trim();
  const r = gitNet(memDir, 'pull', '-q', '--rebase', '--autostash', ...(strategy === 'mine' ? ['-X', 'theirs'] : []));
  const stuck = () => exists(path.join(memDir, '.git', 'rebase-merge')) || exists(path.join(memDir, '.git', 'rebase-apply'));
  if (r.status !== 0) {
    if (stuck()) git('rebase', '--abort');
    return { error: timedOut(r) ? OFFLINE : firstLine(r), offline: timedOut(r), changed: [] };
  }
  const after = git('rev-parse', 'HEAD').stdout.trim();
  if (before === after) return { changed: [] };
  const changed = git('diff', '--name-only', before, after).stdout.split('\n').filter((f) => MEMORY_FILES.includes(f));
  return { changed };
}

function pushIfAhead() {
  if (!hasUpstream()) return null;
  const ahead = Number(git('rev-list', '--count', '@{u}..HEAD').stdout.trim() || 0);
  if (!ahead) return null;
  const r = gitNet(memDir, 'push', '-q');
  return r.status === 0 ? null : timedOut(r) ? OFFLINE : firstLine(r);
}

export { ghUser, ensureIdentity, initRepo, connectRemote, cloneExisting, remoteHasCommits, commitPending, pull, pushIfAhead };
