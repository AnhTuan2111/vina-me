// Che mật khẩu, token, khoá trông thấy được trong một đoạn chữ. Dùng chung cho learn-from-sessions.mjs và feedback.mjs.
// Giữ tên khoá để người đọc vẫn hiểu câu, chỉ thay giá trị.
export const HIDDEN = '[ĐÃ ẨN]';
export function redact(text) {
  return text
    .replace(/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, HIDDEN)
    // "mật khẩu: x", "token=x" thì che luôn; "mật khẩu là x" chỉ che khi x có số hay ký tự đặc biệt, vì câu thường cũng hay
    // có "mật khẩu là ...". Hai luật này chạy trước các mẫu token để một giá trị không bị che hai lần.
    .replace(/(\b(?:password|passwd|pwd|pass|mật khẩu|mat khau|mk|token|secret|api[ _-]?key|khoá|khóa)\s*[:=]\s*)("[^"]*"|'[^']*'|\S+)/gi, `$1${HIDDEN}`)
    .replace(/(\b(?:password|pass|mật khẩu|mat khau|mk|token|khoá|khóa)\s+(?:là|is)\s+)(?=\S*[\d@#$%^&*!?_])\S+/gi, `$1${HIDDEN}`)
    .replace(/\b(gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|glpat-[A-Za-z0-9_-]{16,}|sk-[A-Za-z0-9_-]{20,}|xox[abprs]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35})\b/g, HIDDEN)
    .replace(/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g, HIDDEN)
    .replace(/(\b[a-z][a-z0-9+.-]*:\/\/[^\s:/@]+:)[^\s@/]+@/gi, `$1${HIDDEN}@`)
    .replace(/\b(?=[A-Za-z0-9+/_-]{32,}\b)(?=[A-Za-z0-9+/_-]*\d)(?=[A-Za-z0-9+/_-]*[A-Za-z])[A-Za-z0-9+/_-]{32,}={0,2}/g, HIDDEN);
}
