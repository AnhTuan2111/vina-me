// Dựng các tệp bộ nhớ từ câu trả lời và mẫu, sinh machine.md cho máy đang chạy.

import os from 'node:os';
import path from 'node:path';
import { templates, memDir, read, write, slash, today, log, yes, shown, skillHome, selfCommand, git, isRepo } from './context.mjs';
import { LENGTHS } from './prompt.mjs';

function userMd(a) {
  const val = (x) => (x && String(x).trim()) || 'chưa rõ';
  const lines = [
    '# Người dùng', '',
    `Dựng ngày ${today()} từ lượt hỏi đầu tiên. Agent sửa dần theo luật ở \`AGENTS.md\`.`, '',
    '## Là ai', '',
    `- Gọi là: ${val(a.name)}.`,
    `- Vai trò: ${val(a.role)}.`,
    `- Hay viết văn bản cho: ${val(a.writesFor)}.`, '',
    '## Cách trả lời', '',
    '- Trả lời bằng tiếng Việt có dấu; tên tệp, lệnh, thuật ngữ kỹ thuật giữ nguyên.',
    `- ${LENGTHS[String(a.length ?? '').trim()] ?? LENGTHS['1']}`,
  ];
  const no = a.avoid && String(a.avoid).trim().replace(/[.;]+$/, '');
  if (no) lines.push(`- Không muốn: ${no}.`);
  return lines.join('\n') + '\n';
}

function teamMd(file) {
  const text = read(path.resolve(file)).trim();
  return (text.startsWith('#') ? text : `# Luật chung của đội\n\n${text}`) + '\n';
}

function buildMemory(answers) {
  write(path.join(memDir, 'AGENTS.md'), read(path.join(templates, 'AGENTS.template.md')).replace('{{DATE}}', today()));
  write(path.join(memDir, 'user.md'), userMd(answers));
  write(path.join(memDir, 'memory.md'), read(path.join(templates, 'memory.md')));
  const team = answers.teamRules && String(answers.teamRules).trim();
  write(path.join(memDir, 'team.md'), team ? teamMd(team) : read(path.join(templates, 'team.md')));
  // Đồng ý học từ phiên cũ thì để lại dấu; AGENTS.md dặn agent thấy dấu này thì làm ở phiên đầu tiên.
  if (yes(answers.learnFromSessions)) write(path.join(memDir, '.pending-learn'), `Người dùng đồng ý ngày ${today()}.\n`);
  log(`  dựng bộ nhớ ở ${memDir}`);
}

// Lệnh và đường dẫn riêng của máy này. Không đẩy lên repo (có trong .gitignore), mỗi máy tự sinh khi cài.
function writeMachineFile() {
  const remote = isRepo() ? git('remote', 'get-url', 'origin').stdout.trim() : '';
  const lines = [
    '# Máy này', '',
    `Lệnh và đường dẫn trên máy ${os.hostname()}. Script cài đặt sinh ra tệp này, mỗi máy một bản, không đẩy lên repo.`, '',
    `- \`<setup>\`: \`${selfCommand}\``,
    // Agent từng gõ "<setup> --help" để xem cách dùng: script không có --help nên cài lại cả bộ, kể cả task Windows thật.
    '  Luôn chạy kèm lệnh con (`check`, `save`, `sync`...). Không có `--help`: chạy trơn hay kèm option đoán là cài lại lên máy.',
    `- \`<secrets>\`: \`node "${slash(path.join(skillHome, 'scripts', 'secrets.mjs'))}"\``,
    `- Skill vina-me: \`${shown(skillHome)}\``,
    `- Repo bộ nhớ: ${remote ? `\`${remote}\`` : 'chưa có, bộ nhớ chỉ nằm trên máy này'}.`,
    '- Claude Code tự chạy `<setup> sync` khi mở và đóng phiên; máy tự chạy nó khi đăng nhập và mỗi 2 giờ. Agent không có hook',
    '  đó (Codex, agent khác) thì đầu mỗi phiên, trước khi làm việc, chạy `<setup> sync`. Lệnh in ra gì thì đó là phần bộ nhớ',
    '  vừa được sửa ở máy khác: dùng bản in ra thay cho bản đã nạp.',
  ];
  write(path.join(memDir, 'machine.md'), lines.join('\n') + '\n');
}

export { userMd, teamMd, buildMemory, writeMachineFile };
