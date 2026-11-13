// Đọc chỗ dẫn trang đứng ngay sau mã tài liệu ("KT-02A, tr. 19, 30", "KT-02A, tr. 19 (bảng 9, bảng 10); tr. 30 (bảng 25)",
// "KT-02A, tr. 19, bảng 9, 10", "KT-02A, tr. 6, 14 và 27", "KT-02A, tr. 30-31"). bid-check và package-check cùng gọi hàm này
// để hai script hiểu một chỗ dẫn như nhau.
// Luật: chữ trong ngoặc đơn sau số trang là chú thích, bỏ hết. "bảng|hình|mục N" không trong ngoặc cũng là chú thích, và các
// số nối sau nó bằng dấu phẩy hay "và" ("bảng 9, 10") là số bảng, cho tới khi gặp "tr." hay dấu chấm phẩy.
// Trả về { pages: [số trang], end: vị trí ngay sau chỗ dẫn } hoặc null khi s không mở bằng "tr. N".
export function pagesAfter(s) {
  const head = s.match(/^\s*,?\s*tr(?:ang)?\.?\s*(?=\d)/i);
  if (!head) return null;
  let i = head[0].length;
  const pages = [];
  let wantNum = true;
  while (i < s.length) {
    const rest = s.slice(i);
    let m;
    if (wantNum) {
      m = rest.match(/^(\d{1,4})(?:\s*(?:-|–|đến|tới)\s*(\d{1,4}))?(?![\d]|[.,]\d)/);
      if (!m) break;
      const a = Number(m[1]);
      const b = Number(m[2] ?? m[1]);
      for (let k = a; k <= b && k < a + 50; k++) pages.push(k);
      i += m[0].length;
      wantNum = false;
      continue;
    }
    if ((m = rest.match(/^\s*\([^()]{0,80}\)/))) { i += m[0].length; continue; }
    if ((m = rest.match(/^\s*,\s*(?:bảng|hình|mục)\s*[\d.]*\d(?:\s*(?:,|và)\s*(?:(?:bảng|hình|mục)\s*)?[\d.]*\d(?![\d.]))*/i))) { i += m[0].length; continue; }
    if ((m = rest.match(/^\s*(?:,|;|và)\s*(?:tr(?:ang)?\.?\s*)?(?=\d)/i))) { i += m[0].length; wantNum = true; continue; }
    break;
  }
  return pages.length ? { pages, end: i } : null;
}
