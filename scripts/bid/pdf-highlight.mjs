#!/usr/bin/env node
// Tô vàng (highlight) thông số trên PDF gốc của hãng, đúng như Chương V đòi "đánh dấu thông số cụ thể của hàng hóa".
// Dùng: node pdf-highlight.mjs <gốc.pdf> <marks.json> <ra.pdf>
//       node pdf-highlight.mjs --list <tệp.pdf>          liệt kê các chỗ tô vàng đã có, theo trang
// marks.json: [{ "page": 15, "text": "Intel Xeon W5-3525" }, { "page": 19, "text": "One RJ45 Ethernet port, 10 GbE", "nth": 1 }]
//   page  số trang của tệp PDF (trang 1 là trang đầu tệp), cùng số trang mà bảng đáp ứng dẫn
//   text  chữ đúng như trên trang (chữ tiếng Anh của hãng); có thể nằm vắt qua hai dòng
//   nth   lần xuất hiện thứ mấy trên trang (mặc định 1); "all": true tô mọi lần
//   after chữ neo đứng trước (nhãn của trường, như "Bộ nhớ đệm (GB)"): tô lần xuất hiện đầu tiên sau chữ neo; dùng cho bảng
//         nhãn một dòng, giá trị dòng dưới
//   near  chữ neo cùng hàng bảng (nhãn ở cột trái, như "FAN SYS1"): tô lần xuất hiện bên phải hay ngay dưới nhãn, gần nhãn nhất
//         theo chiều dọc; dùng cho bảng nhãn trái, giá trị phải, kể cả ô nhãn nhiều dòng. Lần xuất hiện nằm cùng dòng với chữ neo
//         thì được chọn trước, kể cả khi đứng bên trái: tô nhãn "Chipset" với "near": "Intel W790". "nearNth": lần thứ mấy của chữ neo
// Chữ được tô phải hiện trên bản in: vùng tô dựng ảnh ra (bỏ chú thích) mà không có nét chữ nào (chữ trắng trên ảnh nền đã mất
// khi in trang web) thì báo LỖI.
// Chữ có nhiều lần trên trang mà không ghi nth, after hay near thì in XEM; "after" chọn lần cách nhãn quá hai dòng cũng in XEM.
// Tệp gốc giữ nguyên: script chép sang tệp mới rồi ghi thêm một lần cập nhật (incremental update) gồm các chú thích
// Highlight kèm hình hiển thị, nên chữ, liên kết, chữ ký số cũ của hãng không bị đụng tới và mọi trình đọc PDF đều thấy.
// Chữ không tìm thấy trên trang thì báo LỖI và thoát mã 1: hoặc trang dẫn sai, hoặc chữ gán cho hãng không có thật.
// Cần pdftotext của Poppler (tọa độ từng chữ, option -bbox-layout). Không cần cài gói npm.
import fs from 'node:fs';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { popplerPdftotext } from './lib/poppler.mjs';

// ---------- Đọc cấu trúc PDF (đủ dùng cho việc thêm chú thích) ----------
const WS = new Set([0, 9, 10, 12, 13, 32]);
const DELIM = new Set([...'()<>[]{}/%'].map((c) => c.charCodeAt(0)));

class Lexer {
  constructor(buf, pos = 0) { this.b = buf; this.p = pos; }
  skip() {
    const b = this.b;
    for (;;) {
      while (this.p < b.length && WS.has(b[this.p])) this.p++;
      if (b[this.p] === 37) { while (this.p < b.length && b[this.p] !== 10 && b[this.p] !== 13) this.p++; continue; }
      return;
    }
  }
  token() {
    this.skip();
    const b = this.b; const s = this.p;
    const c = b[s];
    if (c === undefined) return null;
    if (c === 60 && b[s + 1] === 60) { this.p += 2; return { k: '<<' }; }
    if (c === 62 && b[s + 1] === 62) { this.p += 2; return { k: '>>' }; }
    if (c === 91 || c === 93) { this.p++; return { k: String.fromCharCode(c) }; }
    if (c === 40) {
      let depth = 0; let i = s;
      for (; i < b.length; i++) {
        if (b[i] === 92) { i++; continue; }
        if (b[i] === 40) depth++;
        else if (b[i] === 41 && --depth === 0) break;
      }
      this.p = i + 1;
      return { k: 'str', raw: b.toString('latin1', s, i + 1) };
    }
    if (c === 60) { const e = b.indexOf(62, s); this.p = e + 1; return { k: 'str', raw: b.toString('latin1', s, e + 1) }; }
    if (c === 47) {
      let i = s + 1;
      while (i < b.length && !WS.has(b[i]) && !DELIM.has(b[i])) i++;
      this.p = i;
      return { k: 'name', raw: b.toString('latin1', s, i) };
    }
    let i = s;
    while (i < b.length && !WS.has(b[i]) && !DELIM.has(b[i])) i++;
    if (i === s) { this.p++; return { k: 'kw', raw: String.fromCharCode(c) }; }
    this.p = i;
    const raw = b.toString('latin1', s, i);
    return /^[+-]?(\d+\.?\d*|\.\d+)$/.test(raw) ? { k: 'num', raw } : { k: 'kw', raw };
  }
  peek() { const p = this.p; const t = this.token(); this.p = p; return t; }
  value(tok = this.token()) {
    if (!tok) throw new Error('PDF hết dữ liệu khi đang đọc');
    if (tok.k === 'num') {
      // "12 0 R" là tham chiếu tới đối tượng 12.
      const save = this.p;
      const t2 = this.token();
      if (t2?.k === 'num' && /^\d+$/.test(tok.raw) && /^\d+$/.test(t2.raw)) {
        const t3 = this.token();
        if (t3?.k === 'kw' && t3.raw === 'R') return { t: 'ref', n: Number(tok.raw), g: Number(t2.raw) };
      }
      this.p = save;
      return { t: 'num', raw: tok.raw, v: Number(tok.raw) };
    }
    if (tok.k === 'name') return { t: 'name', raw: tok.raw, v: tok.raw.slice(1).replace(/#([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16))) };
    if (tok.k === 'str') return { t: 'str', raw: tok.raw };
    if (tok.k === '[') {
      const v = [];
      for (;;) { const t = this.token(); if (!t || t.k === ']') break; v.push(this.value(t)); }
      return { t: 'arr', v };
    }
    if (tok.k === '<<') {
      const v = new Map();
      for (;;) {
        const t = this.token();
        if (!t || t.k === '>>') break;
        if (t.k !== 'name') throw new Error(`Khóa từ điển PDF không phải tên ở byte ${this.p}`);
        v.set(t.raw.slice(1), this.value());
      }
      return { t: 'dict', v };
    }
    return { t: 'kw', raw: tok.raw };
  }
}

const ser = (x) => {
  if (x.t === 'ref') return `${x.n} ${x.g} R`;
  if (x.t === 'arr') return `[${x.v.map(ser).join(' ')}]`;
  if (x.t === 'dict') return `<<${[...x.v].map(([k, v]) => `/${k} ${ser(v)}`).join(' ')}>>`;
  return x.raw;
};
const num = (v) => ({ t: 'num', raw: String(Math.round(v * 1000) / 1000), v });
const name = (n) => ({ t: 'name', raw: `/${n}`, v: n });

function decode(dict, data, pdf) {
  let filters = pdf.resolve(dict.v.get('Filter'));
  let parms = pdf.resolve(dict.v.get('DecodeParms'));
  filters = !filters ? [] : filters.t === 'arr' ? filters.v.map((f) => pdf.resolve(f).v) : [filters.v];
  parms = !parms ? [] : parms.t === 'arr' ? parms.v.map((p) => pdf.resolve(p)) : [parms];
  filters.forEach((f, i) => {
    if (f !== 'FlateDecode') throw new Error(`Bộ lọc ${f} chưa hỗ trợ`);
    data = zlib.inflateSync(data);
    const pr = parms[i];
    const pred = pr?.t === 'dict' ? pr.v.get('Predictor')?.v ?? 1 : 1;
    if (pred >= 10) {
      const cols = pr.v.get('Columns')?.v ?? 1;
      const bpc = (pr.v.get('Colors')?.v ?? 1) * ((pr.v.get('BitsPerComponent')?.v ?? 8) / 8);
      const rowLen = cols * bpc;
      const out = Buffer.alloc((data.length / (rowLen + 1)) * rowLen);
      let prev = Buffer.alloc(rowLen);
      for (let r = 0; r * (rowLen + 1) < data.length; r++) {
        const type = data[r * (rowLen + 1)];
        const row = Buffer.from(data.subarray(r * (rowLen + 1) + 1, (r + 1) * (rowLen + 1)));
        for (let i = 0; i < rowLen; i++) {
          const a = i >= bpc ? row[i - bpc] : 0; const up = prev[i]; const c = i >= bpc ? prev[i - bpc] : 0;
          if (type === 1) row[i] = (row[i] + a) & 255;
          else if (type === 2) row[i] = (row[i] + up) & 255;
          else if (type === 3) row[i] = (row[i] + ((a + up) >> 1)) & 255;
          else if (type === 4) { const p = a + up - c; const pa = Math.abs(p - a); const pb = Math.abs(p - up); const pc = Math.abs(p - c); row[i] = (row[i] + (pa <= pb && pa <= pc ? a : pb <= pc ? up : c)) & 255; }
        }
        row.copy(out, r * rowLen);
        prev = row;
      }
      data = out;
    }
  });
  return data;
}

class Pdf {
  constructor(buf) {
    this.b = buf;
    this.xref = new Map();
    this.objstm = new Map();
    const tail = buf.toString('latin1', Math.max(0, buf.length - 2048));
    const m = [...tail.matchAll(/startxref\s+(\d+)/g)].at(-1);
    if (!m) throw new Error('Không thấy startxref: tệp không phải PDF hoặc đã hỏng');
    this.startxref = Number(m[1]);
    this.trailer = null;
    this.xrefIsStream = false;
    const seen = new Set();
    let off = this.startxref; let first = true;
    while (off != null && !seen.has(off)) {
      seen.add(off);
      const tr = this.readXref(off, first);
      if (first) this.trailer = tr;
      first = false;
      const stm = tr.v.get('XRefStm');
      if (stm) this.readXref(stm.v, false);
      off = tr.v.get('Prev')?.v;
    }
    if (this.trailer.v.get('Encrypt')) throw new Error('PDF có mã hóa: không ghi thêm chú thích được, xin hãng bản không khóa');
  }
  readXref(off, first) {
    const lx = new Lexer(this.b, off);
    const t = lx.token();
    if (t.k === 'kw' && t.raw === 'xref') {
      for (;;) {
        const a = lx.token();
        if (a.k === 'kw' && a.raw === 'trailer') break;
        const count = Number(lx.token().raw);
        lx.skip();
        for (let i = 0; i < count; i++) {
          const line = this.b.toString('latin1', lx.p, lx.p + 20);
          const [o, g, f] = line.trim().split(/\s+/);
          const n = Number(a.raw) + i;
          if (!this.xref.has(n)) this.xref.set(n, f === 'n' ? { type: 1, off: Number(o), gen: Number(g) } : { type: 0 });
          lx.p += 20; lx.skip();
        }
      }
      return lx.value();
    }
    // Bảng tham chiếu dạng luồng (PDF 1.5 trở lên).
    if (first) this.xrefIsStream = true;
    lx.token(); lx.token();
    const dict = lx.value();
    const data = decode(dict, this.streamData(lx, dict), this);
    const W = dict.v.get('W').v.map((x) => x.v);
    const size = dict.v.get('Size').v;
    const idx = dict.v.get('Index')?.v.map((x) => x.v) ?? [0, size];
    const rec = W[0] + W[1] + W[2];
    let p = 0;
    const field = (o, w, d) => { if (!w) return d; let v = 0; for (let i = 0; i < w; i++) v = v * 256 + data[o + i]; return v; };
    for (let s = 0; s < idx.length; s += 2) {
      for (let i = 0; i < idx[s + 1]; i++, p += rec) {
        const n = idx[s] + i;
        const type = field(p, W[0], 1); const a = field(p + W[0], W[1], 0); const b = field(p + W[0] + W[1], W[2], 0);
        if (this.xref.has(n)) continue;
        this.xref.set(n, type === 1 ? { type, off: a, gen: b } : type === 2 ? { type, stm: a, idx: b } : { type: 0 });
      }
    }
    return dict;
  }
  streamData(lx, dict) {
    lx.skip();
    const kw = lx.token();
    if (kw?.raw !== 'stream') return Buffer.alloc(0);
    let p = lx.p;
    if (this.b[p] === 13) p++;
    if (this.b[p] === 10) p++;
    const len = this.resolve(dict.v.get('Length')).v;
    return this.b.subarray(p, p + len);
  }
  resolve(x) { return x?.t === 'ref' ? this.get(x.n) : x; }
  get(n) {
    const e = this.xref.get(n);
    if (!e || e.type === 0) return { t: 'kw', raw: 'null' };
    if (e.type === 1) {
      const lx = new Lexer(this.b, e.off);
      lx.token(); lx.token(); lx.token(); // "n g obj"
      return lx.value();
    }
    let stm = this.objstm.get(e.stm);
    if (!stm) {
      const se = this.xref.get(e.stm);
      const lx = new Lexer(this.b, se.off);
      lx.token(); lx.token(); lx.token();
      const dict = lx.value();
      const data = decode(dict, this.streamData(lx, dict), this);
      const nObj = dict.v.get('N').v; const first = dict.v.get('First').v;
      const hl = new Lexer(data, 0);
      const offs = [];
      for (let i = 0; i < nObj; i++) { const on = Number(hl.token().raw); offs.push([on, Number(hl.token().raw)]); }
      stm = { data, first, offs };
      this.objstm.set(e.stm, stm);
    }
    const [, o] = stm.offs[e.idx];
    return new Lexer(stm.data, stm.first + o).value();
  }
  pages() {
    const out = [];
    const walk = (ref, inh) => {
      const node = this.get(ref.n);
      const own = { ...inh };
      for (const k of ['MediaBox', 'CropBox', 'Rotate', 'Resources']) if (node.v.has(k)) own[k] = this.resolve(node.v.get(k));
      if (node.v.get('Type')?.v === 'Pages') for (const kid of this.resolve(node.v.get('Kids')).v) walk(kid, own);
      else out.push({ ref, dict: node, ...own });
    };
    const root = this.resolve(this.trailer.v.get('Root'));
    walk(root.v.get('Pages'), {});
    return out;
  }
}

// ---------- Chữ có hiện trên trang không ----------
// Dựng ảnh xám vùng chữ (144 dpi, bỏ chú thích) bằng pdftoppm cùng thư mục pdftotext, đếm điểm ảnh tối. Không có pdftoppm thì bỏ qua.
// Trả về { visible, dark }: dark là nền vùng chữ tối (chữ trắng trên ô đen), nơi vạch vàng trộn Multiply không thấy khi in.
function inkCheck(file, page, ws) {
  const ok = { visible: true, dark: false };
  const exe = path.join(path.dirname(popplerPdftotext()), process.platform === 'win32' ? 'pdftoppm.exe' : 'pdftoppm');
  if (!fs.existsSync(exe)) return ok;
  const s = 2;
  const x0 = Math.floor(Math.min(...ws.map((w) => w.x0)) * s); const y0 = Math.floor(Math.min(...ws.map((w) => w.y0)) * s);
  const x1 = Math.ceil(Math.max(...ws.map((w) => w.x1)) * s); const y1 = Math.ceil(Math.max(...ws.map((w) => w.y1)) * s);
  let img;
  try {
    img = execFileSync(exe, ['-f', String(page), '-l', String(page), '-r', String(72 * s), '-gray', '-hide-annotations',
      '-x', String(x0), '-y', String(y0), '-W', String(Math.max(1, x1 - x0)), '-H', String(Math.max(1, y1 - y0)), file], { maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch { return ok; }
  const head = img.subarray(0, 64).toString('latin1').match(/^P5\s+(\d+)\s+(\d+)\s+(\d+)\s/);
  if (!head) return ok;
  const px = img.subarray(head[0].length);
  // Nền sáng nhất của vùng, rồi đếm điểm tối hơn nền rõ rệt: chữ đen, chữ màu trên nền trắng hay trên nền màu đều có.
  let max = 0; for (const v of px) if (v > max) max = v;
  let ink = 0; for (const v of px) if (v < max - 60) ink++;
  // Độ sáng trung bình thấp: phần lớn vùng là nền tối, chữ sáng nằm trên nó.
  let sum = 0; for (const v of px) sum += v;
  return { visible: ink >= 4, dark: px.length > 0 && sum / px.length < 100 };
}

// ---------- Tọa độ chữ từ Poppler ----------
const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
function pageWords(file, page) {
  const html = execFileSync(popplerPdftotext(), ['-bbox-layout', '-f', String(page), '-l', String(page), file, '-'], { encoding: 'utf8', maxBuffer: 1 << 28 });
  const pg = html.match(/<page width="([\d.]+)" height="([\d.]+)"/);
  const words = [];
  let line = 0;
  // block: khối chữ của -bbox-layout (một ô bảng hay một đoạn), để biết chỗ tô có phủ trọn ô không.
  let block = 0;
  for (const bm of html.matchAll(/<block[^>]*>([\s\S]*?)<\/block>/g)) {
    block++;
    for (const lm of bm[1].matchAll(/<line[^>]*>([\s\S]*?)<\/line>/g)) {
      line++;
      for (const w of lm[1].matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)) {
        words.push({ x0: +w[1], y0: +w[2], x1: +w[3], y1: +w[4], text: unesc(w[5]), line, block });
      }
    }
  }
  return { w: pg ? +pg[1] : 0, h: pg ? +pg[2] : 0, words };
}

// So khớp không phân biệt hoa thường, dấu gạch các kiểu, ngoặc kép cong, khoảng trắng.
const fold = (s) => s.normalize('NFC').toLowerCase().replace(/[‐-―−]/g, '-').replace(/[“”″]/g, '"').replace(/[‘’′]/g, "'").replace(/[®™©]/g, '').replace(/ /g, ' ');
// Số chú thích chỉ số trên ("11.0-inch,27 2560 x 1600", "IP68,28 Armor AL" ở thông cáo Samsung): lần tìm thứ hai bỏ số đó đi,
// cả khi nó dính sau dấu phẩy của từ trước lẫn khi đứng riêng thành một từ nhỏ hơn chữ quanh nó.
function findPhrase(words, text) {
  const hits = findPhraseIn(words, text, false);
  return hits.length ? hits : findPhraseIn(words, text, true);
}
function findPhraseIn(words, text, dropNotes) {
  let joined = ''; const owner = [];
  words.forEach((w, i) => {
    let t = fold(w.text);
    if (dropNotes) {
      const prev = words[i - 1];
      // Chỉ số trên: nhỏ hơn từ trước và đáy chữ nằm cao hơn đáy từ trước.
      const ph = prev ? prev.y1 - prev.y0 : 0;
      const small = prev && prev.line === w.line && (w.y1 - w.y0) < 0.9 * ph && w.y1 < prev.y1 - 0.2 * ph;
      if (/^\d{1,3}[,.]?$/.test(t) && small) return;
      t = t.replace(/([,;)])\d{1,3}$/, '$1');
    }
    // "®" pdftotext tách thành từ riêng ("Intel ® Xeon"): fold xoá nó thành chuỗi rỗng, bỏ luôn để khỏi thừa dấu cách.
    if (!t) return;
    if (joined) { joined += ' '; owner.push(-1); }
    joined += t; for (let k = 0; k < t.length; k++) owner.push(i);
  });
  const needle = fold(text).replace(/\s+/g, ' ').trim();
  const hits = [];
  // Chữ dính dấu nối cuối dòng ("Ether-" "net") thì Poppler vẫn tách hai từ; thử thêm bản bỏ dấu cách quanh dấu nối.
  for (let from = 0; ; ) {
    const i = joined.indexOf(needle, from);
    if (i < 0) break;
    from = i + 1;
    // Chữ ngắn hay số ("12", "Có") phải là trọn từ: "12" không khớp vào "128" hay "2.12".
    if (/^[\p{L}\d.,]{1,4}$/u.test(needle)) {
      const before = joined[i - 1]; const after = joined[i + needle.length];
      if ((before && /[\p{L}\d.,]/u.test(before)) || (after && /[\p{L}\d]/u.test(after))) continue;
    }
    const ids = new Set();
    for (let k = i; k < i + needle.length; k++) if (owner[k] >= 0) ids.add(owner[k]);
    hits.push(Object.assign([...ids], { start: i }));
  }
  hits.joined = joined;
  return hits;
}

function quads(words, ids, box, h) {
  // Mỗi dòng một tứ giác. Tọa độ Poppler tính từ góc trên trái của khung trang (CropBox), PDF tính từ góc dưới trái.
  const [bx0, , , by1] = box;
  const byLine = new Map();
  for (const id of ids) {
    const w = words[id];
    const r = byLine.get(w.line) ?? { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
    r.x0 = Math.min(r.x0, w.x0); r.y0 = Math.min(r.y0, w.y0); r.x1 = Math.max(r.x1, w.x1); r.y1 = Math.max(r.y1, w.y1);
    byLine.set(w.line, r);
  }
  const top = by1 ?? h;
  return [...byLine.values()].map((r) => {
    const x0 = bx0 + r.x0 - 0.5; const x1 = bx0 + r.x1 + 0.5;
    const y0 = top - r.y1 - 0.5; const y1 = top - r.y0 + 0.5;
    return { x0, y0, x1, y1 };
  });
}

const pdfText = (s) => {
  if (/^[\x20-\x7e]*$/.test(s)) return `(${s.replace(/[\\()]/g, (c) => `\\${c}`)})`;
  const be = Buffer.from(`﻿${s}`, 'utf16le').swap16();
  return `<${be.toString('hex').toUpperCase()}>`;
};

function listHighlights(file) {
  const pdf = new Pdf(fs.readFileSync(file));
  let total = 0;
  pdf.pages().forEach((pg, i) => {
    const annots = pdf.resolve(pg.dict.v.get('Annots'));
    const hl = (annots?.v ?? []).map((a) => pdf.resolve(a)).filter((a) => a.v?.get('Subtype')?.v === 'Highlight');
    if (!hl.length) return;
    total += hl.length;
    console.log(`Trang ${i + 1}: ${hl.length} chỗ tô vàng`);
  });
  console.log(`Tổng: ${total} chỗ tô vàng.`);
  return total;
}

// ---------- Chạy ----------
const args = process.argv.slice(2);
if (args[0] === '--list' && args[1]) { listHighlights(args[1]); process.exit(0); }
if (args.length !== 3) {
  console.log('Dùng: node pdf-highlight.mjs <gốc.pdf> <marks.json> <ra.pdf>  |  node pdf-highlight.mjs --list <tệp.pdf>');
  process.exit(2);
}
const [inFile, marksFile, outFile] = args;
let marks = JSON.parse(fs.readFileSync(marksFile, 'utf8'));
if (!Array.isArray(marks)) marks = marks.marks;
const src = fs.readFileSync(inFile);
const pdf = new Pdf(src);
const pages = pdf.pages();
let next = Number(pdf.trailer.v.get('Size').v);
const objs = []; // [số đối tượng, nội dung]
const perPage = new Map();
const errors = [];
const warns = [];
const words = new Map();
const notes = [];
const marked = new Map(); // trang -> Set chỉ số từ đã tô
for (const m of marks) {
  if (!m.page || m.page < 1 || m.page > pages.length) { errors.push(`Trang ${m.page} không có (tệp có ${pages.length} trang): "${m.text}"`); continue; }
  const pg = pages[m.page - 1];
  const rot = pg.Rotate?.v ?? 0;
  if (rot % 360) { errors.push(`Trang ${m.page} xoay ${rot} độ: chưa hỗ trợ tô vàng trang xoay`); continue; }
  if (!words.has(m.page)) words.set(m.page, pageWords(inFile, m.page));
  const pw = words.get(m.page);
  const found = findPhrase(pw.words, m.text);
  if (!found.length) { errors.push(`Không thấy "${m.text}" trên trang ${m.page}`); continue; }
  // Nhãn viết hoa ("WARRANTY") hay viết đúng kiểu chữ: các lần xuất hiện trùng cả hoa thường được xét trước mọi cách chọn khác
  // ("near", "after", "col"), để không tô nhầm chữ "warranty" giữa câu của ô bên cạnh (s4j, KT-02C tr. 8).
  let hits = found;
  if (found.length > 1 && /\p{Lu}/u.test(m.text)) {
    const word = m.text.normalize('NFC').split(/\s+/)[0];
    const same = found.filter((h) => h.map((i) => pw.words[i].text).join(' ').normalize('NFC').includes(word));
    if (same.length && same.length < found.length) hits = Object.assign(same, { joined: found.joined });
  }
  // "after": chữ neo (nhãn của trường) đứng trước giá trị trên trang: lấy lần xuất hiện đầu tiên sau chữ neo, khỏi đoán nth.
  let pool = hits;
  // Khung chữ của một lần xuất hiện: tâm dọc, mép trái, mép phải, cao một dòng.
  const boxOf = (ids) => {
    const ws = ids.map((i) => pw.words[i]);
    const y0 = Math.min(...ws.map((w) => w.y0)); const y1 = Math.max(...ws.map((w) => w.y1));
    return { yc: (y0 + y1) / 2, x0: Math.min(...ws.map((w) => w.x0)), x1: Math.max(...ws.map((w) => w.x1)), h: Math.min(...ws.map((w) => w.y1 - w.y0)) };
  };
  let anchor;
  if (m.after) {
    const at = hits.joined.indexOf(fold(m.after).replace(/\s+/g, ' ').trim());
    if (at < 0) { errors.push(`Không thấy chữ neo "${m.after}" trên trang ${m.page}`); continue; }
    pool = hits.filter((h) => h.start > at);
    const a = findPhrase(pw.words, m.after).find((h) => h.start >= at) ?? findPhrase(pw.words, m.after)[0];
    if (a) anchor = boxOf(a);
  }
  // "near": bảng nhãn trái, giá trị phải ("FAN SYS1 | System fan connector", ô nhiều dòng "Điện thoại di động; Máy tính bảng;
  // | 12 tháng"): lấy lần xuất hiện ở bên phải hay ngay dưới nhãn, gần nhãn nhất theo chiều dọc.
  // "col": bảng ma trận (mỗi cột một dòng chip, ô có dấu ✓): lấy lần xuất hiện thẳng cột với tiêu đề cột ("Immortalis-G925");
  // đi cùng "near" (nhãn hàng) thì chỉ xét các lần cùng hàng với nhãn.
  let colX;
  if (m.col) {
    const cs = findPhrase(pw.words, m.col);
    if (!cs.length) { errors.push(`Không thấy tiêu đề cột "${m.col}" trên trang ${m.page}`); continue; }
    const cb = boxOf(cs[(m.colNth ?? 1) - 1] ?? cs[0]);
    colX = (cb.x0 + cb.x1) / 2;
  }
  const byCol = (list) => [...list].sort((p, q) => Math.abs((boxOf(p).x0 + boxOf(p).x1) / 2 - colX) - Math.abs((boxOf(q).x0 + boxOf(q).x1) / 2 - colX));
  if (m.col && !m.near) pool = byCol(pool).slice(0, 1);
  if (m.near) {
    const as = findPhrase(pw.words, m.near);
    if (!as.length) { errors.push(`Không thấy chữ neo "${m.near}" trên trang ${m.page}`); continue; }
    const a = boxOf(as[(m.nearNth ?? 1) - 1] ?? as[0]);
    if (m.col) {
      const row = hits.filter((h) => Math.abs(boxOf(h).yc - a.yc) < 0.6 * a.h);
      if (!row.length) { errors.push(`"${m.text}" không có lần nào cùng hàng với "${m.near}" trên trang ${m.page}`); continue; }
      pool = byCol(row).slice(0, 1);
    } else {
    // Bên phải hay dưới nhãn, hoặc cùng dòng với chữ neo (nhãn đứng trái giá trị neo).
    const cand = hits.filter((h) => boxOf(h).x0 >= a.x0 - 2 || Math.abs(boxOf(h).yc - a.yc) < 0.6 * a.h);
    cand.sort((p, q) => Math.abs(boxOf(p).yc - a.yc) - Math.abs(boxOf(q).yc - a.yc) || Math.abs(boxOf(p).x0 - a.x1) - Math.abs(boxOf(q).x0 - a.x1));
    pool = cand.slice(0, 1);
    }
  }
  const chosen = m.all ? pool : [pool[(m.nth ?? 1) - 1]].filter(Boolean);
  if (!chosen.length) { errors.push(`"${m.text}" chỉ có ${hits.length} lần trên trang ${m.page}, không có lần thứ ${m.nth}`); continue; }
  // Chữ có nhiều lần trên trang mà không chỉ lần nào: dễ tô nhầm hàng.
  if (hits.length > 1 && !m.after && !m.near && !m.col && !m.nth && !m.all) warns.push(`"${m.text}" có ${hits.length} lần trên trang ${m.page}, đang tô lần đầu: thêm "near": "<nhãn cùng hàng>" (bảng nhãn trái, giá trị phải) hay "after": "<nhãn>" (nhãn trên, giá trị dưới), rồi xem ảnh trang`);
  // "after" lấy lần đầu theo thứ tự đọc; ở bảng nhãn trái, giá trị phải lần đó hay rơi vào hàng sau.
  if (m.after && anchor && !m.all) {
    const b = boxOf(chosen[0]);
    if (Math.abs(b.yc - anchor.yc) > 2.5 * anchor.h) warns.push(`"${m.text}" tô ở cách chữ neo "${m.after}" ${Math.round(Math.abs(b.yc - anchor.yc) / anchor.h)} dòng trên trang ${m.page}: nếu giá trị nằm cùng hàng bảng với nhãn thì dùng "near" thay "after"`);
  }
  const box = (pg.CropBox ?? pg.MediaBox).v.map((x) => x.v);
  const dark = new Set();
  for (const ids of chosen) {
    const ink = inkCheck(inFile, m.page, ids.map((i) => pw.words[i]));
    if (!ink.visible) errors.push(`"${m.text}" trên trang ${m.page} không hiện trên bản in (chữ trùng màu nền, như chữ trắng mất ảnh nền): tô chỗ chữ hiện, hoặc dẫn trang khác`);
    else if (ink.dark) { dark.add(ids); notes.push(`"${m.text}" trên trang ${m.page} nằm trên nền tối: vẽ khung vàng quanh chữ thay cho vạch tô (vạch tô không thấy trên nền tối)`); }
    if (!marked.has(m.page)) marked.set(m.page, new Set());
    ids.forEach((i) => marked.get(m.page).add(i));
  }
  for (const ids of chosen) {
    const qs = quads(pw.words, ids, box, pw.h);
    const rect = [Math.min(...qs.map((q) => q.x0)), Math.min(...qs.map((q) => q.y0)), Math.max(...qs.map((q) => q.x1)), Math.max(...qs.map((q) => q.y1))];
    const qp = qs.flatMap((q) => [q.x0, q.y1, q.x1, q.y1, q.x0, q.y0, q.x1, q.y0]);
    // Hình hiển thị: hình chữ nhật vàng trộn kiểu Multiply để chữ đen bên dưới vẫn đọc rõ.
    const ap = next++;
    // Nền tối: vạch Multiply thành đen trên đen, nên vẽ khung vàng dày quanh chữ (nét vẽ thường, không trộn).
    const draw = dark.has(ids)
      ? `1 0.85 0 RG 1.6 w\n${qs.map((q) => `${num(q.x0 - 1).raw} ${num(q.y0 - 1).raw} ${num(q.x1 - q.x0 + 2).raw} ${num(q.y1 - q.y0 + 2).raw} re S`).join('\n')}\n`
      : `/G0 gs 1 0.9 0.2 rg\n${qs.map((q) => `${num(q.x0).raw} ${num(q.y0).raw} ${num(q.x1 - q.x0).raw} ${num(q.y1 - q.y0).raw} re f`).join('\n')}\n`;
    const bb = dark.has(ids) ? [rect[0] - 3, rect[1] - 3, rect[2] + 3, rect[3] + 3] : rect;
    objs.push([ap, `<</Type/XObject/Subtype/Form/BBox[${bb.map((v) => num(v).raw).join(' ')}]/Resources<</ExtGState<</G0<</BM/Multiply/ca 1>>>>>>/Length ${Buffer.byteLength(draw, 'latin1')}>>\nstream\n${draw}endstream`]);
    const an = next++;
    objs.push([an, `<</Type/Annot/Subtype/Highlight/Rect[${rect.map((v) => num(v).raw).join(' ')}]/QuadPoints[${qp.map((v) => num(v).raw).join(' ')}]/C[1 0.9 0.2]/F 4/P ${pg.ref.n} ${pg.ref.g} R/T${pdfText('vina-me')}/Contents${pdfText(m.text)}/AP<</N ${ap} 0 R>>>>`]);
    if (!perPage.has(m.page)) perPage.set(m.page, []);
    perPage.get(m.page).push(an);
  }
}
// Trang có chú thích mới: ghi lại từ điển trang với mảng /Annots gồm chú thích cũ (liên kết của hãng) và chú thích mới.
const pageVersions = [];
for (const [no, ids] of perPage) {
  const pg = pages[no - 1];
  const d = { t: 'dict', v: new Map(pg.dict.v) };
  const old = pdf.resolve(d.v.get('Annots'));
  const arr = [...(old?.t === 'arr' ? old.v : []), ...ids.map((n) => ({ t: 'ref', n, g: 0 }))];
  d.v.set('Annots', { t: 'arr', v: arr });
  pageVersions.push([pg.ref.n, pg.ref.g, ser(d)]);
}

// Bảng nhãn trái, giá trị phải (thông số Tab S11: "Weight | 469 g | ..."): tô giá trị mà nhãn đầu hàng không tô thì người chấm
// không biết giá trị thuộc trường nào. Hàng là các từ cùng độ cao với chỗ tô; nhãn đầu hàng là cụm từ đầu dòng, ngăn với phần
// sau bằng khoảng trống rộng (ranh cột). Dòng văn xuôi (khoảng cách từ đều) không có cụm như thế nên không xét.
for (const [no, set] of marked) {
  const ws = words.get(no).words;
  const seen = new Set();
  for (const id of set) {
    const w = ws[id];
    const h = w.y1 - w.y0;
    const yc = (w.y0 + w.y1) / 2;
    const row = ws.map((x, i) => [x, i]).filter(([x]) => Math.abs((x.y0 + x.y1) / 2 - yc) < 0.5 * h).sort((a, b) => a[0].x0 - b[0].x0);
    if (row.length < 2 || row[0][1] === id) continue;
    // Cụm đầu dòng: các từ liền nhau tới khoảng trống đầu tiên rộng hơn 1,5 lần chiều cao chữ.
    const head = [row[0]];
    for (let k = 1; k < row.length && row[k][0].x0 - row[k - 1][0].x1 <= 1.5 * h; k++) head.push(row[k]);
    if (head.length === row.length || head.some(([, i]) => set.has(i)) || head.some(([, i]) => i === id)) continue;
    const label = head.map(([x]) => x.text).join(' ');
    // Chỉ xét giá trị có số ("469 g", "120 Hz") với nhãn là chữ ngắn không số, trọn ngoặc ("Weight", "Display"): hàng nhiều cột
    // nhãn (trang thông số Samsung: "Tốc độ CPU | Loại CPU") hay nhãn xuống dòng ("... (Giờ, / Wireless)") không phải trường hợp này.
    const valueWords = ws.filter((x, i) => set.has(i) && Math.abs((x.y0 + x.y1) / 2 - yc) < 0.5 * h).map((x) => x.text).join(' ');
    if (!/\d/.test(valueWords) || /\d/.test(label) || label.length > 30 || !/^\p{Lu}/u.test(label)) continue;
    if ((label.match(/\(/g) ?? []).length !== (label.match(/\)/g) ?? []).length) continue;
    if (seen.has(label)) continue;
    seen.add(label);
    warns.push(`Trang ${no}: tô "${w.text}" mà nhãn đầu hàng "${label.slice(0, 40)}" chưa tô: thêm { "page": ${no}, "text": "${label.slice(0, 40)}", "near": "${w.text}" }`);
  }
}

// Ô ngắn vắt hai dòng ("Battery /" rồi "Charging", "Network &" rồi "Connectivity*") mà mọi chỗ tô trên trang gộp lại vẫn chỉ phủ
// một phần ô: người chấm thấy nhãn cụt (s4k, KT-03B tr. 3, 4). Ô toàn mã ("SM-X730 SM-X736B SM-X930") thì tô riêng mã chào là đúng.
for (const [no, set] of marked) {
  const ws = words.get(no).words;
  for (const b of new Set([...set].map((i) => ws[i].block))) {
    const cell = ws.map((w, i) => [w, i]).filter(([w]) => w.block === b);
    if (cell.length > 6 || new Set(cell.map(([w]) => w.line)).size < 2) continue;
    if (cell.every(([w]) => /\d/.test(w.text) && /^[\p{Lu}\d.\-/+]+$/u.test(w.text))) continue;
    const rest = cell.filter(([, i]) => !set.has(i));
    if (rest.length && rest.some(([w]) => /[\p{L}\d]/u.test(w.text))) warns.push(`Trang ${no}: chỉ tô một phần ô "${cell.map(([w]) => w.text).join(' ')}" (ô xuống dòng, thiếu "${rest.map(([w]) => w.text).join(' ')}"): ghi đủ chữ của ô vào marks`);
  }
}

for (const n of notes) console.log(`GHI ${n}`);
for (const w of warns) console.log(`XEM ${w}`);
if (errors.length) {
  for (const e of errors) console.log(`LỖI ${e}`);
  console.log(`${errors.length} chỗ không tô được; chưa ghi tệp ${outFile}.`);
  process.exit(1);
}

const parts = [src, Buffer.from(src[src.length - 1] === 10 ? '' : '\n', 'latin1')];
let pos = parts[0].length + parts[1].length;
const entries = []; // [số, thế hệ, vị trí]
const push = (n, g, body) => {
  const b = Buffer.from(`${n} ${g} obj\n${body}\nendobj\n`, 'latin1');
  entries.push([n, g, pos]); parts.push(b); pos += b.length;
};
for (const [n, body] of objs) push(n, 0, body);
for (const [n, g, body] of pageVersions) push(n, g, body);
const keep = ['Root', 'Info', 'ID'].filter((k) => pdf.trailer.v.has(k)).map((k) => `/${k} ${ser(pdf.trailer.v.get(k))}`).join('');
if (pdf.xrefIsStream) {
  // Tệp gốc dùng bảng tham chiếu dạng luồng thì lần cập nhật cũng dùng dạng luồng (không nén cho đơn giản).
  const xn = next++;
  entries.push([xn, 0, pos]);
  entries.sort((a, b) => a[0] - b[0]);
  const rec = Buffer.alloc(entries.length * 7);
  entries.forEach(([, g, o], i) => { rec[i * 7] = 1; rec.writeUInt32BE(o, i * 7 + 1); rec.writeUInt16BE(g, i * 7 + 5); });
  const index = entries.map(([n]) => `${n} 1`).join(' ');
  parts.push(Buffer.from(`${xn} 0 obj\n<</Type/XRef/Size ${next}/W[1 4 2]/Index[${index}]/Prev ${pdf.startxref}${keep}/Length ${rec.length}>>\nstream\n`, 'latin1'), rec, Buffer.from(`\nendstream\nendobj\nstartxref\n${pos}\n%%EOF\n`, 'latin1'));
} else {
  entries.sort((a, b) => a[0] - b[0]);
  const lines = ['xref'];
  for (const [n, g, o] of entries) lines.push(`${n} 1`, `${String(o).padStart(10, '0')} ${String(g).padStart(5, '0')} n\r`);
  parts.push(Buffer.from(`${lines.join('\n')}\ntrailer\n<</Size ${next}/Prev ${pdf.startxref}${keep}>>\nstartxref\n${pos}\n%%EOF\n`, 'latin1'));
}
fs.writeFileSync(outFile, Buffer.concat(parts));

// Đọc lại tệp vừa ghi để chắc chú thích nằm đúng trang.
const back = new Pdf(fs.readFileSync(outFile));
const bp = back.pages();
let ok = 0;
for (const [no, ids] of perPage) {
  const annots = back.resolve(bp[no - 1].dict.v.get('Annots'))?.v ?? [];
  const got = annots.filter((a) => ids.includes(a.n)).length;
  ok += got;
  console.log(`Trang ${no}: tô ${got}/${ids.length} chỗ`);
}
console.log(`${outFile}: tô vàng ${ok} chỗ trên ${perPage.size} trang, từ ${marks.length} mục trong ${marksFile}.`);
