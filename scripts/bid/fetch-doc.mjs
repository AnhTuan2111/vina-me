#!/usr/bin/env node
// Lấy tài liệu chính thức của hãng làm tài liệu chứng minh (Chương V cho dùng catalog hoặc "đường dẫn website chính thức
// của nhà sản xuất"), lưu thành PDF kèm dấu vết nguồn.
// Dùng: node fetch-doc.mjs <url> <ra.pdf> [--expect "chữ phải có"]... [--click "Expand all"]... [--sources nguon.md]
//                          [--wait 20000] [--keep-fixed] [--scale 0.8] [--hide "<CSS selector>"]... [--hide-price]
//   - URL trả về PDF (datasheet, spec sheet) thì lưu nguyên tệp của hãng.
//   - URL là trang web thì in ra PDF bằng Edge hoặc Chrome chạy ngầm. Với Node 22 trở lên script điều khiển trình duyệt qua
//     giao thức DevTools: cuộn hết trang cho phần nạp chậm hiện ra, mở mọi <details>, bấm các nút có chữ ở --click (mục thông
//     số thu gọn: "Expand all", "See all specs", "Xem thêm"), ẩn thanh dính đầu trang, hộp cookie, khung chat (phần tử
//     position fixed) để chúng không đè lên chữ ở mỗi trang in; --keep-fixed thì giữ. In thu nhỏ 0,8 (--scale) để trang
//     rộng không bị cắt mép phải. Node cũ hơn thì in thẳng bằng dòng lệnh.
//   - --expect: chữ thông số phải có trong tệp đã lưu (ví dụ "Dimensity 9400+"); thiếu thì báo LỖI, thoát mã 1.
//   - --sources: ghi thêm một dòng vào bảng nguồn (ngày tải, đường dẫn, tệp, cách lấy, số trang, SHA-256).
//   - --hide-price: ẩn khối giá bán (lớp, id có chữ "price", chữ ngắn dạng "$1,234", "AUD 5.000", "12.990.000 ₫"); hồ sơ kỹ thuật
//     không mang giá. Không có option này mà bản in có giá thì script nhắc.
//   - Trang in ra là trang báo lỗi ("404", "Page Not Found", "Không tìm thấy trang") thì báo LỖI, không giữ tệp.
// Chỉ lấy từ trang của hãng (dell.com, samsung.com, intel.com...). Đường dẫn gửi đi chỉ chứa tên sản phẩm, không chứa
// tên gói thầu, chủ đầu tư hay nhà thầu. Trang trả 401, 403, 429 là chặn tải tự động: không vượt, BA tải tay.
// Sau khi lưu vẫn phải xem ảnh trang: chữ có trong lớp chữ của PDF chưa chắc đã đọc được trên trang in.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { pdfPages } from './lib/poppler.mjs';

const argv = process.argv.slice(2);
const opt = { expect: [], click: [], hide: [], sources: undefined, wait: 20000, keepFixed: false, scale: 0.8 };
const pos = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--expect') opt.expect.push(argv[++i]);
  else if (argv[i] === '--click') opt.click.push(argv[++i]);
  else if (argv[i] === '--sources') opt.sources = argv[++i];
  else if (argv[i] === '--wait') opt.wait = Number(argv[++i]);
  else if (argv[i] === '--keep-fixed') opt.keepFixed = true;
  else if (argv[i] === '--hide') opt.hide.push(argv[++i]);
  else if (argv[i] === '--scale') opt.scale = Number(argv[++i]);
  else if (argv[i] === '--hide-price') opt.hidePrice = true;
  else pos.push(argv[i]);
}
if (pos.length !== 2) {
  console.log('Dùng: node fetch-doc.mjs <url> <ra.pdf> [--expect "chữ"]... [--click "Expand all"]... [--sources nguon.md] [--wait 20000] [--keep-fixed]');
  process.exit(2);
}
const [url, out] = pos;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function browser() {
  if (process.env.BROWSER && fs.existsSync(process.env.BROWSER)) return process.env.BROWSER;
  const pf = [process.env['ProgramFiles(x86)'], process.env.ProgramFiles, process.env.LOCALAPPDATA].filter(Boolean);
  const cands = [
    ...pf.map((d) => path.join(d, 'Microsoft/Edge/Application/msedge.exe')),
    ...pf.map((d) => path.join(d, 'Google/Chrome/Application/chrome.exe')),
    '/usr/bin/microsoft-edge', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  return cands.find((c) => fs.existsSync(c));
}

// Chạy trong trang trước khi in: cuộn hết trang, mở <details>, bấm nút theo chữ, ẩn phần tử fixed, gỡ sticky.
const PRICE_RE = String.raw`(?:US\$|A\$|S\$|AU\$|\$|€|£|₫|\b(?:AUD|USD|SGD|EUR|VND|MYR|RM)\b)\s?\d[\d.,]*|\d[\d.,]{2,}\s?(?:₫|\b(?:VND|USD|AUD|SGD|MYR)\b)`;
const PREPARE = (clicks, keepFixed, hide, hidePrice) => `(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let i = 0; i < 80; i++) {
    const before = document.scrollingElement.scrollTop;
    window.scrollBy(0, Math.max(400, innerHeight * 0.9));
    await wait(250);
    if (document.scrollingElement.scrollTop === before) break;
  }
  document.querySelectorAll('details').forEach((d) => { d.open = true; });
  const want = ${JSON.stringify(clicks.map((c) => c.toLowerCase()))};
  let clicked = 0;
  for (const w of want) {
    for (const el of document.querySelectorAll('button, a, [role="button"], summary, [aria-expanded="false"]')) {
      const t = (el.innerText || el.getAttribute('aria-label') || '').trim().toLowerCase();
      if (t && (t === w || (t.includes(w) && t.length < w.length + 25))) { try { el.click(); clicked++; } catch {} }
    }
  }
  if (clicked) await wait(2500);
  let hidden = 0;
  // Mọi phần tử, kể cả trong shadow DOM (khung video nổi, khung chat của bên thứ ba hay nằm trong shadowRoot).
  const all = [];
  const walk = (root) => { for (const el of root.querySelectorAll('*')) { all.push(el); if (el.shadowRoot) walk(el.shadowRoot); } };
  walk(document);
  const roots = [document, ...all.filter((el) => el.shadowRoot).map((el) => el.shadowRoot)];
  for (const sel of ${JSON.stringify(hide)}) {
    for (const r of roots) {
      try { for (const el of r.querySelectorAll(sel)) { el.style.setProperty('display', 'none', 'important'); hidden++; } } catch {}
    }
  }
  let prices = 0;
  if (${hidePrice}) {
    const re = new RegExp(${JSON.stringify(PRICE_RE)}, 'i');
    for (const r of roots) {
      try { for (const el of r.querySelectorAll('[class*="price" i], [id*="price" i], [data-testid*="price" i]')) { el.style.setProperty('display', 'none', 'important'); prices++; } } catch {}
    }
    // Giá nằm trong câu dài ("Pay in 4 interest-free payments on purchases under $2,000"): bọc riêng chữ giá trong một span ẩn
    // (visibility: hidden giữ chỗ trống, câu không xô lệch), câu còn lại giữ nguyên.
    const reG = new RegExp(${JSON.stringify(PRICE_RE)}, 'gi');
    for (const r of roots) {
      const tw = document.createTreeWalker(r, NodeFilter.SHOW_TEXT);
      const texts = [];
      for (let n = tw.nextNode(); n; n = tw.nextNode()) if (re.test(n.nodeValue || '') && (n.nodeValue || '').trim().length > 60) texts.push(n);
      for (const n of texts) {
        const frag = document.createDocumentFragment();
        let last = 0;
        const v = n.nodeValue;
        for (const m of v.matchAll(reG)) {
          frag.append(v.slice(last, m.index));
          const sp = document.createElement('span'); sp.textContent = m[0]; sp.style.setProperty('visibility', 'hidden', 'important');
          frag.append(sp); last = m.index + m[0].length; prices++;
        }
        frag.append(v.slice(last));
        n.replaceWith(frag);
      }
    }
    // Chữ giá đứng lẻ: phần tử nhỏ nhất có chữ giá, chữ ngắn (không ẩn cả đoạn mô tả có nhắc tới giá).
    for (const el of all) {
      const t = (el.innerText || '').trim();
      if (t.length > 60 || !re.test(t) || [...el.children].some((c) => re.test(c.innerText || ''))) continue;
      // Ẩn cả hàng nhãn "Recommended Customer Price | $260" khi phần còn lại của hàng chỉ là nhãn (ngắn, không có số). Hàng
      // tùy chọn của trang cấu hình ("4 TB, 7200 RPM, 3.5-inch ... RM 1,868.00 /ea.") mang thông số: chỉ ẩn ô giá.
      const rest = el.parentElement ? (el.parentElement.innerText || '').replace(t, '').trim() : '';
      const row = el.parentElement && rest.length < 60 && !/\d/.test(rest) ? el.parentElement : el;
      row.style.setProperty('display', 'none', 'important'); prices++;
    }
  }
  if (!${keepFixed}) {
    for (const el of all) {
      if (el === document.documentElement || el === document.body) continue;
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed') { el.style.setProperty('display', 'none', 'important'); hidden++; }
      else if (cs.position === 'sticky') el.style.setProperty('position', 'static', 'important');
    }
    document.documentElement.style.setProperty('overflow', 'visible', 'important');
    document.body.style.setProperty('overflow', 'visible', 'important');
  }
  window.scrollTo(0, 0);
  await wait(500);
  // Link tệp PDF có trên trang (hướng dẫn sử dụng, datasheet hay nằm sau nút tải dựng bằng JavaScript).
  const pdfLinks = [...new Set([...document.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => /[.]pdf(?:$|[?#])/i.test(h)))].slice(0, 30);
  const h1 = (document.querySelector('h1')?.innerText || '').trim().slice(0, 80);
  return JSON.stringify({ clicked, hidden, prices, pdfLinks, title: document.title.slice(0, 120), h1 });
})()`;

let linksOut = '';
let errorPage = '';
async function printWithDevTools(exe) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'fetch-doc-'));
  const child = spawn(exe, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars',
    `--user-data-dir=${profile}`, '--remote-debugging-port=0', `--user-agent=${UA}`, '--window-size=1366,900', 'about:blank'], { stdio: 'ignore' });
  try {
    let port;
    for (let i = 0; i < 100 && !port; i++) {
      await sleep(150);
      const f = path.join(profile, 'DevToolsActivePort');
      if (fs.existsSync(f)) port = fs.readFileSync(f, 'utf8').split('\n')[0].trim();
    }
    if (!port) throw new Error('trình duyệt không mở cổng DevTools');
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const page = targets.find((t) => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('không nối được DevTools')); });
    let id = 0;
    const pending = new Map();
    const events = [];
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
      else if (m.method) events.push(m.method);
    };
    const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
    await send('Page.enable');
    await send('Network.enable');
    await send('Network.setUserAgentOverride', { userAgent: UA });
    const nav = await send('Page.navigate', { url });
    if (nav.errorText) throw new Error(nav.errorText);
    for (let t = 0; t < opt.wait && !events.includes('Page.loadEventFired'); t += 200) await sleep(200);
    await sleep(Math.min(6000, opt.wait / 3));
    const prep = await send('Runtime.evaluate', { expression: PREPARE(opt.click, opt.keepFixed, opt.hide, !!opt.hidePrice), awaitPromise: true, returnByValue: true });
    const info = JSON.parse(prep.result?.value ?? '{}');
    // Trang báo lỗi mềm: máy chủ trả 200 nhưng trang ghi 404 (gặp ở arm.com).
    // Trang chặn tải tự động (dell.com sau vài lần in liên tiếp: "Access Denied", "You don't have permission") cũng là lỗi:
    // in ra chỉ được một trang thông báo, không phải tài liệu.
    const errRe = /\b404\b|page not found|not found|không tìm thấy|không tồn tại|page (?:does not|doesn't) exist|access denied|you don't have permission|request blocked|\b403\b/i;
    if (errRe.test(info.title ?? '') || errRe.test(info.h1 ?? '')) errorPage = `${info.title ?? ''} / ${info.h1 ?? ''}`.trim();
    if (info.pdfLinks?.length) linksOut = (['Link PDF trên trang (tải bằng fetch-doc nếu là tài liệu của hãng):', ...info.pdfLinks.map((l) => `  ${l}`)].join('\n'));
    const pdf = await send('Page.printToPDF', { printBackground: true, scale: opt.scale, paperWidth: 8.27, paperHeight: 11.69, marginTop: 0.4, marginBottom: 0.4, marginLeft: 0.4, marginRight: 0.4 });
    fs.writeFileSync(out, Buffer.from(pdf.data, 'base64'));
    try { await send('Browser.close'); } catch {}
    ws.close();
    return `bản in trang web qua DevTools (${path.basename(exe)}; bấm ${info.clicked ?? 0} nút, ẩn ${info.hidden ?? 0} phần tử cố định${opt.hidePrice ? `, ẩn ${info.prices ?? 0} khối giá` : ''})`;
  } finally {
    await sleep(300);
    try { child.kill(); } catch {}
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
  }
}

function printWithCli(exe) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'fetch-doc-'));
  const r = spawnSync(exe, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars',
    `--user-data-dir=${profile}`, '--no-pdf-header-footer', `--virtual-time-budget=${opt.wait}`, `--user-agent=${UA}`,
    `--print-to-pdf=${path.resolve(out)}`, url], { encoding: 'utf8', timeout: opt.wait + 90000 });
  fs.rmSync(profile, { recursive: true, force: true });
  if (!fs.existsSync(out) || fs.statSync(out).size < 1000) throw new Error(`trình duyệt không in được trang (mã ${r.status})`);
  return `bản in trang web (${path.basename(exe)}, không bấm nút, không ẩn phần tử cố định)`;
}

// Ghi một dòng vào bảng tải của sources.md (bảng có cột "Ngày tải"; chèn sau hàng cuối của bảng đó, không nối vào cuối tệp:
// tệp còn bảng "Lần tìm" và các bảng người dùng tự thêm). Tải lại cùng link ra cùng tệp thì thay dòng cũ, không ghi hai dòng.
function addSource(row) {
  if (!opt.sources) return;
  const head = '| Ngày tải | Đường dẫn | Tệp | Cách lấy | Số trang | SHA-256 |\n|---|---|---|---|---|---|\n';
  if (!fs.existsSync(opt.sources)) { fs.writeFileSync(opt.sources, head + row); return; }
  const lines = fs.readFileSync(opt.sources, 'utf8').split('\n');
  const first = lines.findIndex((l) => /^\|\s*Ngày tải\s*\|/i.test(l));
  if (first < 0) { fs.writeFileSync(opt.sources, `${head}${row}\n${lines.join('\n')}`); return; }
  let last = first;
  while (last + 1 < lines.length && lines[last + 1].startsWith('|')) last++;
  const cells = row.split('|').map((c) => c.trim());
  const same = lines.findIndex((l, i) => i > first + 1 && i <= last && l.split('|').map((c) => c.trim())[2] === cells[2] && l.split('|').map((c) => c.trim())[3] === cells[3]);
  if (same >= 0) lines[same] = row.replace(/\n$/, '');
  else lines.splice(last + 1, 0, row.replace(/\n$/, ''));
  fs.writeFileSync(opt.sources, lines.join('\n'));
}
const today = () => { const d = new Date(); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; };
// Lần tải hỏng cũng ghi vào bảng nguồn, để báo cáo nói được đã thử link nào, hỏng ra sao.
function logFail(why) {
  addSource(`| ${today()} | ${url} | (không lưu) | LỖI ${why} | | |\n`);
}

async function main() {
  let how;
  let res;
  try {
    res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/pdf,text/html;q=0.9,*/*;q=0.8' }, redirect: 'follow' });
  } catch (e) {
    res = null;
    console.log(`Không tải thẳng được (${e.cause?.code ?? e.message}); thử in bằng trình duyệt.`);
  }
  // Đọc hết hay hủy thân phản hồi lỗi để không còn kết nối treo khi thoát.
  if (res && !res.ok) await res.body?.cancel().catch(() => {});
  // Tài liệu riêng của Dell: link chuyển sang "?isPrivate=Y" và trả trang đăng nhập, không phải PDF.
  if (res && /[?&]isPrivate=Y\b/i.test(res.url ?? '')) {
    await res.body?.cancel().catch(() => {});
    console.log(`LỖI ${url} chuyển sang tài liệu riêng (${res.url}): cần đăng nhập, không phải tài liệu công khai. Tìm tài liệu khác.`);
    logFail('tài liệu riêng, cần đăng nhập');
    return 1;
  }
  if (res && [401, 403, 429].includes(res.status)) {
    console.log(`LỖI ${url} trả mã ${res.status}: trang chặn tải tự động. Không vượt: mở bằng trình duyệt thường, lưu tệp hay in ra PDF, ghi nguồn tay.`);
    logFail(`mã ${res.status}`);
    return 1;
  }
  if (res && !res.ok) {
    console.log(`LỖI ${url} trả mã ${res.status}${res.status === 404 && /delltechnologies\.com\/asset\//i.test(url) ? ': link /asset/ của Dell chỉ chuyển sang link mới khi tên tệp đúng; chạy WebSearch "<model> spec sheet" với allowed_domains ["delltechnologies.com"] (không viết site: trong câu), lấy link trong kết quả' : ''}${res.status === 404 ? ': không có trang này. Link tự ghép theo mẫu hay sai: tìm lại bằng tên model ("<model> spec sheet pdf", "<model> datasheet") và lấy link từ kết quả tìm hay từ trang hỗ trợ của hãng' : ''}.`);
    logFail(`mã ${res.status}`);
    return 1;
  }
  const body = res?.ok ? Buffer.from(await res.arrayBuffer()) : null;
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  if (body && (body.subarray(0, 5).toString('latin1') === '%PDF-' || /pdf/i.test(res.headers.get('content-type') ?? ''))) {
    fs.writeFileSync(out, body);
    how = 'tệp PDF của hãng';
  } else {
    const exe = browser();
    if (!exe) { console.log('LỖI Không tìm thấy Edge hay Chrome để in trang web; đặt biến BROWSER chỉ tới trình duyệt.'); return 2; }
    try {
      how = typeof WebSocket === 'function' ? await printWithDevTools(exe) : printWithCli(exe);
    } catch (e) {
      console.log(`LỖI In trang không được: ${e.message}`);
      logFail(e.message);
      return 1;
    }
  }

  if (errorPage) {
    console.log(`LỖI ${url} in ra trang báo lỗi ("${errorPage}"): không có tài liệu ở link này, tìm link khác. Đã xoá tệp.`);
    try { fs.rmSync(out); } catch {}
    logFail(`trang báo lỗi "${errorPage.slice(0, 60)}"`);
    return 1;
  }
  const pages = pdfPages(out).filter((p, i, a) => i < a.length - 1 || p.trim());
  const fold = (s) => s.normalize('NFC').toLowerCase().replace(/[‐-―]/g, '-').replace(/\s+/g, ' ');
  const all = fold(pages.join(' '));
  const missing = opt.expect.filter((e) => !all.includes(fold(e)));
  const where = opt.expect.filter((e) => !missing.includes(e)).map((e) => `"${e}" tr. ${pages.findIndex((p) => fold(p).includes(fold(e))) + 1}`);
  const sha = crypto.createHash('sha256').update(fs.readFileSync(out)).digest('hex');
  const mb = fs.statSync(out).size / 1048576;
  if (mb > 10 && !how.startsWith('tệp PDF')) console.log(`XEM Tệp nặng ${mb.toFixed(1)} MB vì ảnh trên trang; thông số là chữ thì in lại với --hide "img, picture, video" cho nhẹ, rồi kiểm giới hạn dung lượng tệp của hệ thống đấu thầu.`);
  const d = new Date();
  const day = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  console.log(`${out}: ${how}, ${pages.length} trang, SHA-256 ${sha.slice(0, 16)}...`);
  // Danh sách link in sau dòng kết quả, để dòng kết quả không bị trôi mất sau vài chục link.
  if (linksOut) console.log(linksOut);
  if (where.length) console.log(`Có: ${where.join('; ')}`);
  // Thiếu chữ --expect thì tệp vẫn giữ để xem; dòng nguồn ghi "chưa đủ chữ" chứ không ghi "không dùng", vì tệp có khi vẫn
  // dùng (trang ghi "45 W", --expect gõ "45W"): package-check vẫn soát link của dòng đó. Không dùng thì tự xóa tệp và sửa dòng.
  const use = missing.length ? `chưa đủ chữ --expect: thiếu ${missing.map((m) => `"${m}"`).join(', ')}; ${how}` : how;
  addSource(`| ${day} | ${url} | ${path.basename(out)} | ${use} | ${pages.length} | ${sha} |\n`);
  if (!how.startsWith('tệp PDF') && !opt.hidePrice) {
    const priced = pages.findIndex((p) => new RegExp(PRICE_RE, 'i').test(p));
    if (priced >= 0) console.log(`XEM Bản in có giá bán (tr. ${priced + 1}): hồ sơ kỹ thuật không mang giá, in lại với --hide-price.`);
  }
  for (const m of missing) console.log(`LỖI Không thấy "${m}" trong tệp đã lưu`);
  console.log('Xem ảnh các trang có thông số (pdftoppm) để chắc chữ không bị đè, không bị cắt.');
  return missing.length ? 1 : 0;
}

// Không gọi process.exit: trên Windows, thoát ngay khi kết nối mạng của fetch còn mở làm Node in "Assertion failed ... async.c"
// và trả mã 127. Đặt mã thoát rồi để Node tự kết thúc khi kết nối đóng (vài giây).
main().then((code) => { process.exitCode = code; }, (e) => { console.log(`LỖI ${e.message}`); process.exitCode = 1; });
