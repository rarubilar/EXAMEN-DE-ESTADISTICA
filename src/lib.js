'use strict';
/* =====================================================================
   lib.js — utilidades, íconos y generadores de figuras SVG
   ===================================================================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const UNITS = [];

/* Número con coma decimal y signo menos tipográfico */
function dec(x, d = 3) {
  let v = Math.round(x * 10 ** d) / 10 ** d;
  if (Object.is(v, -0)) v = 0;
  return v.toFixed(d).replace('.', ',').replace('-', '−');
}

/* ---------- Notación matemática en HTML ---------- */
const fr = (a, b) => `<span class="fr"><span>${a}</span><span>${b}</span></span>`;
const bn = (n, k) => `<span class="bn"><span class="bn-c"><span>${n}</span><span>${k}</span></span></span>`;
const eq = s => `<div class="eq">${s}</div>`;
const mt = s => `<span class="mt">${s}</span>`;
const ex = (b, e) => `${b}<sup>${e}</sup>`;
const box = s => `<span class="box-ans">${s}</span>`;
const dataRow = arr => `<div class="data">${arr.map(v => `<span>${v}</span>`).join('')}</div>`;
function tbl(head, rows, cls = '') {
  return `<div class="tb-wrap"><table class="tb ${cls}"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => i === 0 ? `<th>${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

/* ---------- Campos para ejercicios ---------- */
const fP = (l, ans, tol = 0.003, alt) => ({ l, ans, tol, p: true, alt });
const fN = (l, ans, tol = 0.01, u = '') => ({ l, ans, tol, u });
const fS = (l, opts, ok) => ({ l, opts, ok });

/* ---------- Funciones de probabilidad ---------- */
const npdf = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
function erf(x) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return x >= 0 ? y : -y;
}
const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
let _uid = 0;
const uid = p => `${p}${++_uid}`;

/* =====================================================================
   ÍCONOS (trazo 24×24, heredan currentColor)
   ===================================================================== */
const ICONS = {
  insignia: '<path d="M4 15l8-4.5 8 4.5M4 20l8-4.5 8 4.5"/><path d="M12 2.5l1.3 2.7 2.9.4-2.1 2 .5 2.9L12 9.1l-2.6 1.4.5-2.9-2.1-2 2.9-.4z"/>',
  chart: '<path d="M3 21h18M6 21V11M11 21V5M16 21v-7M21 21V9"/>',
  dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.3" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.3" fill="currentColor"/>',
  hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
  bell: '<path d="M2 20h20"/><path d="M3 19.5c4.5 0 5-14.5 9-14.5s4.5 14.5 9 14.5"/>',
  network: '<rect x="2" y="9.5" width="6" height="5" rx="1"/><rect x="16" y="4" width="6" height="5" rx="1"/><rect x="16" y="15" width="6" height="5" rx="1"/><path d="M8 12h4M12 6.5v11M12 6.5h4M12 17.5h4"/>',
  shuffle: '<path d="M3 7h3.5c2.5 0 4 1.5 5.5 5s3 5 5.5 5H21M3 17h3.5c1.4 0 2.5-.5 3.4-1.6M14.1 8.6C15 7.5 16.1 7 17.5 7H21M18.5 4.5 21 7l-2.5 2.5M18.5 14.5 21 17l-2.5 2.5"/>',
  users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.5 20c.7-3.6 3.3-5.6 6.5-5.6s5.8 2 6.5 5.6"/><circle cx="17.2" cy="9" r="2.4"/><path d="M16.6 14.4c2.5.3 4.2 2 4.9 4.8"/>',
  tag: '<path d="M3 12.2V4a1 1 0 0 1 1-1h8.2l8.6 8.6a1.4 1.4 0 0 1 0 2l-7.2 7.2a1.4 1.4 0 0 1-2 0z"/><circle cx="7.6" cy="7.6" r="1.5"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 14.5h18M10 4v16"/>',
  hist: '<path d="M2 21h20M4 21v-7h4v7M8 21V8h4v13M12 21V5h4v16M16 21v-9h4v9"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
  ruler: '<path d="M3 17.5 17.5 3l3.5 3.5L6.5 21z"/><path d="M7.5 13l2 2M10.5 10l2 2M13.5 7l2 2"/>',
  boxplot: '<path d="M2 12h4M18 12h4M2 9v6M22 9v6"/><rect x="6" y="7" width="12" height="10" rx="1"/><path d="M11 7v10"/>',
  venn: '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',
  grid: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
  branch: '<circle cx="5" cy="12" r="2.2"/><circle cx="19" cy="5" r="2.2"/><circle cx="19" cy="19" r="2.2"/><circle cx="19" cy="12" r="2.2"/><path d="M7.2 12h9.6M7 11l10-5M7 13l10 5"/>',
  combo: '<circle cx="6" cy="6.5" r="2.4"/><circle cx="12" cy="6.5" r="2.4"/><circle cx="18" cy="6.5" r="2.4"/><path d="M4 13.5h16v6.5H4z"/><path d="M8.5 16.8h7"/>',
  crosshair: '<circle cx="12" cy="12" r="8"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',
  urn: '<path d="M8 3h8M9 3v3.5L5.5 11v7.5A2.5 2.5 0 0 0 8 21h8a2.5 2.5 0 0 0 2.5-2.5V11L15 6.5V3"/><circle cx="10" cy="15" r="1.4" fill="currentColor"/><circle cx="14" cy="15" r="1.4"/><circle cx="12" cy="18" r="1.4" fill="currentColor"/>',
  burst: '<path d="M12 2.5l1.8 5.2 4.9-2.6-2.6 4.9 5.2 1.8-5.2 1.8 2.6 4.9-4.9-2.6L12 21.5l-1.8-5.2-4.9 2.6 2.6-4.9L2.7 12.2l5.2-1.8-2.6-4.9 4.9 2.6z"/>',
  repeat: '<path d="M17 2.5 20.5 6 17 9.5"/><path d="M3.5 11.5V10a4 4 0 0 1 4-4h13"/><path d="M7 21.5 3.5 18 7 14.5"/><path d="M20.5 12.5V14a4 4 0 0 1-4 4h-13"/>',
  square: '<path d="M2 20h20M6 20V8h12v12"/>',
  bellLeft: '<path d="M2 20h20"/><path d="M3 19.5c4.5 0 5-14.5 9-14.5s4.5 14.5 9 14.5"/><path d="M8 20v-6.5M5 20v-1.8" stroke-width="3"/>',
  hourglass: '<path d="M6 2.5h12M6 21.5h12M7.5 2.5c0 5 9 5.5 9 9.5s-9 4.5-9 9.5M16.5 2.5c0 5-9 5.5-9 9.5s9 4.5 9 9.5"/>',
  serie: '<path d="M1.5 12h3M19.5 12h3M10 12h4"/><rect x="4.5" y="8.5" width="5.5" height="7" rx="1"/><rect x="14" y="8.5" width="5.5" height="7" rx="1"/>',
  paralelo: '<path d="M1.5 12h3M19.5 12h3M4.5 6v12M19.5 6v12M4.5 6h3M4.5 18h3M16.5 6h3M16.5 18h3"/><rect x="7.5" y="3.5" width="9" height="5" rx="1"/><rect x="7.5" y="15.5" width="9" height="5" rx="1"/>',
  mixto: '<path d="M1 12h2M3 6.5v11M3 6.5h1.5M3 17.5h1.5M11.5 6.5h1.5M11.5 17.5h1.5M13 6.5v11M13 12h2.5M21.5 12H23"/><rect x="4.5" y="4" width="7" height="5" rx="1"/><rect x="4.5" y="15" width="7" height="5" rx="1"/><rect x="15.5" y="9.5" width="6" height="5" rx="1"/>',
  compass: '<circle cx="12" cy="12" r="9.5"/><path d="M15.8 8.2 13.6 13.6 8.2 15.8 10.4 10.4z"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17.5" rx="2"/><path d="M9 4V2.8h6V4M8.5 10h7M8.5 14h7M8.5 18h4"/>',
  flag: '<path d="M5 21.5V3M5 4h12.5l-2.5 4.5 2.5 4.5H5"/>',
  play: '<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M10 8v5l4.5-2.5zM8 21h8M12 17v4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
  moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/>',
  check: '<path d="M4.5 12.5l5 5 10-11"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  bulb: '<path d="M9 18h6M10 21.5h4M12 2.5a6.5 6.5 0 0 0-4 11.6c.7.6 1 1.3 1 2.1V17h6v-.8c0-.8.4-1.5 1-2.1a6.5 6.5 0 0 0-4-11.6z"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  chevR: '<path d="M9 5l7 7-7 7"/>',
  chevL: '<path d="M15 5l-7 7 7 7"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  alert: '<path d="M12 3 2 20.5h20z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.6" r=".9" fill="currentColor"/>',
  book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  list: '<path d="M9 6h12M9 12h12M9 18h12"/><path d="M3.5 6l1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/>',
  scope: '<circle cx="12" cy="12" r="7.5"/><path d="M12 1.5v5M12 17.5v5M1.5 12h5M17.5 12h5"/>',
  steps: '<path d="M3 20h5v-5h5v-5h5V5h3"/>',
  pencil: '<path d="M4 20h4L19.5 8.5a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  medal: '<circle cx="12" cy="15" r="6"/><path d="M8.5 10 5 2.5h4.5L12 7.5l2.5-5H19L15.5 10"/><path d="M12 12.2l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3z"/>',
  clock: '<circle cx="12" cy="12" r="9.5"/><path d="M12 6.5V12l3.5 2.5"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  collapse: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
  refresh: '<path d="M20.5 12a8.5 8.5 0 1 1-2.5-6M20.5 3.5V8H16"/>',
  sigma: '<path d="M18 4H6l6.5 8L6 20h12"/>',
  arrowR: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  fullscreen: '<path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6"/>',
  question: '<circle cx="12" cy="12" r="9.5"/><path d="M9.3 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.7 2.4-2.7 4.3"/><circle cx="12" cy="17.6" r=".9" fill="currentColor"/>',
  info: '<circle cx="12" cy="12" r="9.5"/><path d="M12 11v6"/><circle cx="12" cy="7.6" r=".9" fill="currentColor"/>',
  calc: '<rect x="4.5" y="2.5" width="15" height="19" rx="2"/><path d="M8 7h8M8 11.5h.01M12 11.5h.01M16 11.5h.01M8 15.5h.01M12 15.5h.01M16 15.5v3.5M8 19h4"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>',
  zap: '<path d="M13.5 2 4.5 13.5h6.5L9.5 22l9-11.5H12z" fill="currentColor"/>',
};
function ic(name, cls = '') {
  return `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

/* =====================================================================
   FIGURAS SVG (usan clases .sv-* → se adaptan a modo claro/oscuro)
   ===================================================================== */
const svgWrap = (w, h, body, label = '', extra = '') =>
  `<svg class="sv" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" ${extra}>${body}</svg>`;

/* Curva normal con área sombreada y fila de valores z */
function svgNormal(o) {
  const mu = o.mu ?? 0, s = o.s ?? 1, w = o.w ?? 460, h = o.h ?? 200, dd = o.dd ?? 0;
  const from = o.from ?? -Infinity, to = o.to ?? Infinity, zrow = o.zrow !== false;
  const L = 16, R = 26, T = 18, axisY = h - (zrow ? 46 : 28);
  const x0 = mu - 3.6 * s, x1 = mu + 3.6 * s;
  const X = v => L + (v - x0) / (x1 - x0) * (w - L - R);
  const top = npdf(mu, mu, s);
  const Y = v => axisY - v / top * (axisY - T - 14);
  let curve = '';
  for (let i = 0; i <= 160; i++) { const v = x0 + (x1 - x0) * i / 160; curve += (i ? 'L' : 'M') + X(v).toFixed(1) + ' ' + Y(npdf(v, mu, s)).toFixed(1); }
  let g = '';
  const a = Math.max(from, x0), b = Math.min(to, x1);
  if (a < b) {
    let p = `M${X(a).toFixed(1)} ${axisY}`;
    for (let i = 0; i <= 100; i++) { const v = a + (b - a) * i / 100; p += `L${X(v).toFixed(1)} ${Y(npdf(v, mu, s)).toFixed(1)}`; }
    g += `<path class="sv-area" d="${p}L${X(b).toFixed(1)} ${axisY}Z"/>`;
  }
  g += `<path class="sv-curve" d="${curve}"/>`;
  g += `<line class="sv-ax" x1="${L}" y1="${axisY}" x2="${w - R + 8}" y2="${axisY}"/>`;
  for (let k = -3; k <= 3; k++) {
    const x = X(mu + k * s);
    g += `<line class="sv-tick" x1="${x}" y1="${axisY}" x2="${x}" y2="${axisY + 5}"/>`;
    g += `<text class="sv-t" x="${x}" y="${axisY + 18}" text-anchor="middle">${dec(mu + k * s, dd)}</text>`;
    if (zrow) g += `<text class="sv-z" x="${x}" y="${axisY + 35}" text-anchor="middle">${k === 0 ? '0' : (k > 0 ? k : '−' + (-k))}</text>`;
  }
  g += `<text class="sv-t sv-it" x="${w - 6}" y="${axisY + 18}" text-anchor="end">x</text>`;
  if (zrow) g += `<text class="sv-z sv-it" x="${w - 6}" y="${axisY + 35}" text-anchor="end">z</text>`;
  (o.marks || []).forEach(m => {
    const x = X(m.v);
    g += `<line class="sv-mark" x1="${x}" y1="${T - 2}" x2="${x}" y2="${axisY}"/>`;
    g += `<text class="sv-ml" x="${x + (m.dx ?? 0)}" y="${T - 5}" text-anchor="middle">${m.t}</text>`;
  });
  if (o.label && a < b) {
    const rTail = isFinite(from) && !isFinite(to), lTail = !isFinite(from) && isFinite(to);
    const mid = rTail ? from + 0.7 * s : lTail ? to - 0.7 * s : (a + b) / 2;
    const wide = X(b) - X(a) > 90 && axisY - Y(npdf(mid, mu, s)) > 50;
    const lx = Math.min(Math.max(X(mid), L + 34), w - R - 30);
    const ly = wide ? (axisY + Y(npdf(mid, mu, s))) / 2 + 5 : Math.min(Y(npdf(mid, mu, s)) - 10, axisY - 30);
    g += `<text class="sv-al${wide ? ' in' : ''}" x="${lx + (o.ldx ?? 0)}" y="${ly + (o.ldy ?? 0)}" text-anchor="middle">${o.label}</text>`;
  }
  return svgWrap(w, h, g, o.aria || 'Curva normal');
}

/* Histograma de barras contiguas */
function svgHist(o) {
  const bins = o.bins, w = o.w ?? 380, h = o.h ?? 210, n = bins.length;
  const L = 34, R = 10, T = 22, B = o.xlab ? 46 : 32;
  const maxF = Math.max(...bins.map(b => b.f), 1);
  const yMax = Math.max(Math.ceil(maxF * 1.15), maxF + 1);
  const step = yMax <= 7 ? 1 : yMax <= 14 ? 2 : 5;
  const bw = (w - L - R) / n, Y = v => h - B - v / yMax * (h - B - T);
  let g = '';
  for (let v = 0; v <= yMax; v += step) g += `<line class="sv-grid" x1="${L}" x2="${w - R}" y1="${Y(v)}" y2="${Y(v)}"/><text class="sv-t" x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${v}</text>`;
  bins.forEach((b, i) => {
    const x = L + i * bw, y = Y(b.f);
    if (b.f > 0) g += `<rect class="sv-bar${(o.hl || []).includes(i) ? ' hl' : ''}" x="${x}" y="${y}" width="${bw}" height="${h - B - y}"/>`;
    g += `<text class="sv-v" x="${x + bw / 2}" y="${y - 6}" text-anchor="middle">${b.f}</text>`;
    g += `<text class="sv-t" x="${x + bw / 2}" y="${h - B + 15}" text-anchor="middle">${b.l}</text>`;
  });
  g += `<line class="sv-ax" x1="${L}" x2="${w - R}" y1="${h - B}" y2="${h - B}"/>`;
  if (o.xlab) g += `<text class="sv-t sv-cap" x="${(L + w - R) / 2}" y="${h - 8}" text-anchor="middle">${o.xlab}</text>`;
  return svgWrap(w, h, g, 'Histograma');
}

/* Boxplot horizontal con vallas */
function svgBox(o) {
  const w = o.w ?? 460, h = o.h ?? 136, L = 22, R = 22, a = o.a, b = o.b, dd = o.dd ?? 1;
  const X = v => L + (v - a) / (b - a) * (w - L - R);
  const cy = 66, bh = 30, axisY = h - 30;
  const wl = o.wl ?? o.mn, wr = o.wr ?? o.mx;
  let g = '';
  g += `<line class="sv-ax" x1="${L}" x2="${w - R}" y1="${axisY}" y2="${axisY}"/>`;
  for (let v = Math.ceil(a / o.step) * o.step; v <= b + 1e-9; v += o.step) {
    g += `<line class="sv-tick" x1="${X(v)}" x2="${X(v)}" y1="${axisY}" y2="${axisY + 5}"/><text class="sv-t" x="${X(v)}" y="${axisY + 18}" text-anchor="middle">${dec(v, 0)}</text>`;
  }
  if (o.lo != null) [['LI', o.lo], ['LS', o.hi]].forEach(([nm, v]) => {
    if (v >= a && v <= b) {
      g += `<line class="sv-fence" x1="${X(v)}" x2="${X(v)}" y1="20" y2="${axisY}"/><text class="sv-fl" x="${X(v)}" y="14" text-anchor="middle">${nm} = ${dec(v, dd)}</text>`;
    } else {
      const left = v < a;
      g += `<text class="sv-fl" x="${left ? L : w - R}" y="14" text-anchor="${left ? 'start' : 'end'}">${left ? '← ' : ''}${nm} = ${dec(v, dd)}${left ? '' : ' →'}</text>`;
    }
  });
  g += `<line class="sv-wh" x1="${X(wl)}" x2="${X(o.q1)}" y1="${cy}" y2="${cy}"/><line class="sv-wh" x1="${X(o.q3)}" x2="${X(wr)}" y1="${cy}" y2="${cy}"/>`;
  g += `<line class="sv-wh" x1="${X(wl)}" x2="${X(wl)}" y1="${cy - 9}" y2="${cy + 9}"/><line class="sv-wh" x1="${X(wr)}" x2="${X(wr)}" y1="${cy - 9}" y2="${cy + 9}"/>`;
  g += `<rect class="sv-box" x="${X(o.q1)}" y="${cy - bh / 2}" width="${X(o.q3) - X(o.q1)}" height="${bh}" rx="3"/>`;
  g += `<line class="sv-med" x1="${X(o.me)}" x2="${X(o.me)}" y1="${cy - bh / 2}" y2="${cy + bh / 2}"/>`;
  (o.out || []).forEach(v => { g += `<circle class="sv-out" cx="${X(v)}" cy="${cy}" r="5"/><text class="sv-v" x="${X(v)}" y="${cy - 11}" text-anchor="middle">${dec(v, 0)}</text>`; });
  if (o.names !== false) [['C1', o.q1], ['Me', o.me], ['C3', o.q3]].forEach(([nm, v]) => { g += `<text class="sv-ml" x="${X(v)}" y="${cy - bh / 2 - 6}" text-anchor="middle">${nm}</text>`; });
  if (o.vals !== false) [wl, o.q1, o.me, o.q3, wr].forEach(v => { g += `<text class="sv-v" x="${X(v)}" y="${cy + bh / 2 + 15}" text-anchor="middle">${dec(v, Number.isInteger(v) ? 0 : 1)}</text>`; });
  return svgWrap(w, h, g, 'Gráfico de caja y bigotes');
}

/* Barras de una distribución discreta (función de probabilidad) */
function svgBars(o) {
  const xs = o.xs, ps = o.ps, w = o.w ?? 400, h = o.h ?? 190, n = xs.length;
  const L = 38, R = 8, T = 22, B = 30, maxP = Math.max(...ps) * 1.18;
  const slot = (w - L - R) / n, bw = Math.min(slot * 0.72, 34), Y = v => h - B - v / maxP * (h - B - T);
  let g = '';
  [0, maxP / 2, maxP / 1.18].forEach(v => { g += `<line class="sv-grid" x1="${L}" x2="${w - R}" y1="${Y(v)}" y2="${Y(v)}"/><text class="sv-t" x="${L - 5}" y="${Y(v) + 4}" text-anchor="end">${dec(v, 2)}</text>`; });
  xs.forEach((x, i) => {
    const cx = L + slot * (i + 0.5), y = Y(ps[i]), on = (o.hl || []).includes(x);
    g += `<rect class="sv-bar${on ? ' hl' : ''}" x="${cx - bw / 2}" y="${y}" width="${bw}" height="${h - B - y}" rx="2"/>`;
    g += `<text class="sv-t" x="${cx}" y="${h - B + 15}" text-anchor="middle">${x}</text>`;
    if (on) g += `<text class="sv-v" x="${cx}" y="${y - 6}" text-anchor="middle">${dec(ps[i], 3)}</text>`;
  });
  g += `<line class="sv-ax" x1="${L}" x2="${w - R}" y1="${h - B}" y2="${h - B}"/>`;
  if (o.cap) g += `<text class="sv-t sv-cap" x="${w - R}" y="${T - 6}" text-anchor="end">${o.cap}</text>`;
  return svgWrap(w, h, g, 'Distribución de probabilidad');
}

/* Densidad exponencial con cola sombreada P(T > t) */
function svgExp(o) {
  const mu = o.mean, t = o.t, w = o.w ?? 460, h = o.h ?? 190, u = o.unit ?? 'h';
  const L = 18, R = 14, T = 18, B = 32, xmax = Math.max(mu * 3.4, t * 1.6), lam = 1 / mu;
  const X = v => L + v / xmax * (w - L - R), Y = v => h - B - v / lam * (h - B - T);
  let c = '', a = `M${X(t)} ${h - B}`;
  for (let i = 0; i <= 120; i++) { const v = xmax * i / 120; c += (i ? 'L' : 'M') + X(v).toFixed(1) + ' ' + Y(lam * Math.exp(-lam * v)).toFixed(1); }
  for (let i = 0; i <= 80; i++) { const v = t + (xmax - t) * i / 80; a += `L${X(v).toFixed(1)} ${Y(lam * Math.exp(-lam * v)).toFixed(1)}`; }
  let g = `<path class="sv-area" d="${a}L${X(xmax)} ${h - B}Z"/><path class="sv-curve" d="${c}"/>`;
  g += `<line class="sv-ax" x1="${L}" x2="${w - R}" y1="${h - B}" y2="${h - B}"/>`;
  g += `<line class="sv-mark" x1="${X(t)}" x2="${X(t)}" y1="${T + 10}" y2="${h - B}"/><text class="sv-ml" x="${X(t)}" y="${T + 4}" text-anchor="middle">t = ${t} ${u}</text>`;
  g += `<line class="sv-mean" x1="${X(mu)}" x2="${X(mu)}" y1="${T + 30}" y2="${h - B}"/><text class="sv-t" x="${X(mu)}" y="${h - B + 16}" text-anchor="middle">μ = ${mu}</text>`;
  g += `<text class="sv-t" x="${X(0)}" y="${h - B + 16}" text-anchor="middle">0</text>`;
  if (o.label) g += `<text class="sv-al" x="${Math.min(X(t) + 12, w - 150)}" y="${Y(lam * Math.exp(-lam * t)) - 12}" text-anchor="start">${o.label}</text>`;
  return svgWrap(w, h, g, 'Densidad exponencial');
}

/* Uniforme U(a,b) con tramo sombreado */
function svgUnif(o) {
  const { a, b, c, d } = o, w = o.w ?? 420, h = o.h ?? 168, ext = (b - a) * 0.18;
  const L = 16, R = 16, T = 30, B = 32, X = v => L + (v - (a - ext)) / (b - a + 2 * ext) * (w - L - R);
  const yTop = T + 14, yAx = h - B;
  let g = `<rect class="sv-area" x="${X(c)}" y="${yTop}" width="${X(d) - X(c)}" height="${yAx - yTop}"/>`;
  g += `<path class="sv-curve" d="M${L} ${yAx}H${X(a)}V${yTop}H${X(b)}V${yAx}H${w - R}"/>`;
  g += `<line class="sv-ax" x1="${L}" x2="${w - R}" y1="${yAx}" y2="${yAx}"/>`;
  [...new Set([a, c, d, b])].forEach(v => { g += `<text class="sv-t" x="${X(v)}" y="${yAx + 17}" text-anchor="middle">${v}</text>`; });
  g += `<text class="sv-ml" x="${(X(a) + X(b)) / 2}" y="${yTop - 8}" text-anchor="middle">altura = 1/(b − a) = 1/${b - a}</text>`;
  if (o.label) g += `<text class="sv-al in" x="${(X(c) + X(d)) / 2}" y="${(yTop + yAx) / 2 + 5}" text-anchor="middle">${o.label}</text>`;
  return svgWrap(w, h, g, 'Distribución uniforme');
}

/* Diagrama de bloques serie/paralelo: el = '1' | {s:[...]} | {p:[...]} */
function svgSys(el, o = {}) {
  const BW = o.bw ?? 56, BH = 38, G = 26, E = 22, V = 14, sub = o.sub || {};
  function lay(e) {
    if (typeof e === 'string') return {
      w: BW, h: BH, draw(x, y) {
        const cy = y + BH / 2;
        return `<rect class="sv-node" x="${x}" y="${y}" width="${BW}" height="${BH}" rx="7"/><text class="sv-nl" x="${x + BW / 2}" y="${cy + (sub[e] ? -2 : 5)}" text-anchor="middle">${e}</text>` +
          (sub[e] ? `<text class="sv-ns" x="${x + BW / 2}" y="${cy + 12}" text-anchor="middle">${sub[e]}</text>` : '');
      }
    };
    if (e.s) {
      const ps = e.s.map(lay), w = ps.reduce((t, p) => t + p.w, 0) + G * (ps.length - 1), h = Math.max(...ps.map(p => p.h));
      return { w, h, draw(x, y) { let s = '', cx = x; const cy = y + h / 2; ps.forEach((p, i) => { s += p.draw(cx, cy - p.h / 2); if (i < ps.length - 1) s += `<line class="sv-wire" x1="${cx + p.w}" y1="${cy}" x2="${cx + p.w + G}" y2="${cy}"/>`; cx += p.w + G; }); return s; } };
    }
    const ps = e.p.map(lay), mw = Math.max(...ps.map(p => p.w)), w = mw + 2 * E, h = ps.reduce((t, p) => t + p.h, 0) + V * (ps.length - 1);
    return {
      w, h, draw(x, y) {
        let s = '', yy = y; const cys = [];
        ps.forEach(p => {
          const px = x + E + (mw - p.w) / 2, pcy = yy + p.h / 2; cys.push(pcy);
          s += p.draw(px, yy) + `<line class="sv-wire" x1="${x}" y1="${pcy}" x2="${px}" y2="${pcy}"/><line class="sv-wire" x1="${px + p.w}" y1="${pcy}" x2="${x + w}" y2="${pcy}"/>`;
          yy += p.h + V;
        });
        return s + `<line class="sv-wire" x1="${x}" y1="${cys[0]}" x2="${x}" y2="${cys.at(-1)}"/><line class="sv-wire" x1="${x + w}" y1="${cys[0]}" x2="${x + w}" y2="${cys.at(-1)}"/>`;
      }
    };
  }
  const root = lay(el), pad = 10, term = 36, W = root.w + 2 * term + 2 * pad, H = root.h + 2 * pad + (o.caption ? 22 : 0), cy = pad + root.h / 2;
  let s = `<circle class="sv-term" cx="${pad + 10}" cy="${cy}" r="10"/><text class="sv-tl" x="${pad + 10}" y="${cy + 4}" text-anchor="middle">A</text>`;
  s += `<line class="sv-wire" x1="${pad + 20}" y1="${cy}" x2="${pad + term}" y2="${cy}"/>` + root.draw(pad + term, pad);
  const xe = pad + term + root.w;
  s += `<line class="sv-wire" x1="${xe}" y1="${cy}" x2="${xe + term - 20}" y2="${cy}"/><circle class="sv-term" cx="${xe + term - 10}" cy="${cy}" r="10"/><text class="sv-tl" x="${xe + term - 10}" y="${cy + 4}" text-anchor="middle">B</text>`;
  if (o.caption) s += `<text class="sv-t sv-cap" x="${W / 2}" y="${H - 6}" text-anchor="middle">${o.caption}</text>`;
  return svgWrap(W, H, s, 'Diagrama de sistema', `style="max-width:${Math.round(W * 1.35)}px"`);
}

/* Diagrama de Venn A, B con intersección destacada */
function svgVenn() {
  const id = uid('vc');
  const g = `<defs><clipPath id="${id}"><circle cx="122" cy="84" r="62"/></clipPath></defs>
  <rect class="sv-omega" x="8" y="8" width="304" height="152" rx="10"/>
  <circle class="sv-setA" cx="122" cy="84" r="62"/><circle class="sv-setB" cx="198" cy="84" r="62"/>
  <circle class="sv-inter" cx="198" cy="84" r="62" clip-path="url(#${id})"/>
  <text class="sv-nl" x="96" y="88" text-anchor="middle">A</text><text class="sv-nl" x="224" y="88" text-anchor="middle">B</text>
  <text class="sv-ml" x="160" y="88" text-anchor="middle">A∩B</text><text class="sv-t" x="22" y="28">Ω</text>`;
  return svgWrap(320, 168, g, 'Diagrama de Venn');
}

/* Árbol de probabilidad (Bayes / probabilidad total) */
function svgTree(o) {
  const leaves = o.br.reduce((t, b) => t + b.sub.length, 0), w = o.w ?? 500, rowH = 36, h = leaves * rowH + 16;
  const x0 = 18, x1 = 178, x2 = 330;
  let g = '', row = 0;
  const rootY = h / 2;
  o.br.forEach(b => {
    const ys = b.sub.map((_, j) => 8 + (row + j + 0.5) * rowH), by = ys.reduce((t, v) => t + v, 0) / ys.length;
    g += `<line class="sv-wire" x1="${x0 + 8}" y1="${rootY}" x2="${x1 - 6}" y2="${by}"/>`;
    g += `<text class="sv-bp" x="${(x0 + x1) / 2}" y="${(rootY + by) / 2 - 6}" text-anchor="middle">${b.p}</text>`;
    g += `<circle class="sv-dot" cx="${x1}" cy="${by}" r="5"/><text class="sv-nl sm" x="${x1}" y="${by - 10}" text-anchor="middle">${b.l}</text>`;
    b.sub.forEach((s, j) => {
      const y = ys[j];
      g += `<line class="sv-wire" x1="${x1 + 6}" y1="${by}" x2="${x2 - 6}" y2="${y}"/>`;
      g += `<text class="sv-bp" x="${(x1 + x2) / 2 + 6}" y="${(by + y) / 2 - 5}" text-anchor="middle">${s.p}</text>`;
      g += `<circle class="sv-dot${s.hl ? ' hl' : ''}" cx="${x2}" cy="${y}" r="5"/><text class="sv-t" x="${x2 + 12}" y="${y + 4}">${s.l}${s.prod ? `  →  ${s.prod}` : ''}</text>`;
    });
    row += b.sub.length;
  });
  g += `<circle class="sv-dot" cx="${x0}" cy="${rootY}" r="6"/>`;
  return svgWrap(w, h, g, 'Árbol de probabilidad');
}

/* Tres formas de distribución con media y mediana */
function svgShapes(o = {}) {
  const sets = [
    { t: 'Asimétrica a la izquierda', f: [1, 2, 3, 5, 8, 7], tail: 'l' },
    { t: 'Simétrica', f: [2, 4, 7, 7, 4, 2] },
    { t: 'Asimétrica a la derecha', f: [7, 8, 5, 3, 2, 1], tail: 'r' },
  ];
  const pw = 170, W = pw * 3 + 20, H = o.h ?? 180, base = H - 46, top = 34;
  let g = '';
  sets.forEach((st, k) => {
    const x0 = 10 + k * pw + 10, bw = (pw - 30) / st.f.length, mx = Math.max(...st.f), tot = st.f.reduce((a, b) => a + b, 0);
    const Y = v => base - v / mx * (base - top);
    st.f.forEach((f, i) => { g += `<rect class="sv-bar${k === 1 ? '' : ' alt'}" x="${x0 + i * bw}" y="${Y(f)}" width="${bw}" height="${base - Y(f)}"/>`; });
    const mean = st.f.reduce((a, f, i) => a + (i + 0.5) * f, 0) / tot;
    let acc = 0, med = 0; for (let i = 0; i < st.f.length; i++) { if (acc + st.f[i] >= tot / 2) { med = i + (tot / 2 - acc) / st.f[i]; break; } acc += st.f[i]; }
    const xm = x0 + mean * bw, xd = x0 + med * bw;
    g += `<line class="sv-ax" x1="${x0 - 4}" x2="${x0 + st.f.length * bw + 4}" y1="${base}" y2="${base}"/>`;
    g += `<line class="sv-medl" x1="${xd}" x2="${xd}" y1="${top - 8}" y2="${base}"/>`;
    g += `<path class="sv-meant" d="M${xm} ${base + 3}l-6 9h12z"/>`;
    if (st.tail) g += `<text class="sv-ml" x="${st.tail === 'l' ? x0 + 4 : x0 + st.f.length * bw - 4}" y="${top + 6}" text-anchor="${st.tail === 'l' ? 'start' : 'end'}">${st.tail === 'l' ? '← cola' : 'cola →'}</text>`;
    g += `<text class="sv-t sv-b" x="${x0 + st.f.length * bw / 2}" y="${H - 18}" text-anchor="middle">${st.t}</text>`;
    g += `<text class="sv-t" x="${x0 + st.f.length * bw / 2}" y="${H - 4}" text-anchor="middle">${['media < mediana', 'media ≈ mediana', 'media > mediana'][k]}</text>`;
  });
  g += `<path class="sv-meant" d="M${W - 150} 10l-5 8h10z"/><text class="sv-t" x="${W - 140}" y="18">media</text><line class="sv-medl" x1="${W - 78}" x2="${W - 78}" y1="6" y2="20"/><text class="sv-t" x="${W - 70}" y="18">mediana</text>`;
  return svgWrap(W, H, g, 'Formas de una distribución');
}

/* Población y muestra */
function svgPop() {
  /* Población (elipse) → muestreo → muestra (círculo); los puntos dorados son los que salieron en la muestra */
  const pts = [[52, 78], [86, 52], [120, 70], [158, 46], [196, 64], [232, 84], [70, 112], [108, 100], [146, 120], [186, 104], [222, 122], [96, 142], [136, 154], [176, 146], [60, 140], [214, 156]];
  const pick = [2, 9, 12, 15];
  let dots = '';
  pts.forEach(([x, y], i) => { dots += `<circle class="${pick.includes(i) ? 'sv-dot' : 'sv-dot2'}" cx="${x}" cy="${y}" r="5"/>`; });
  const g = `<ellipse class="sv-pop" cx="142" cy="102" rx="126" ry="78"/>${dots}
  <path class="sv-arrow" d="M276 102 H 316"/><path class="sv-meant" d="M322 102l-9 -5v10z"/>
  <text class="sv-ml" x="299" y="90" text-anchor="middle">muestreo</text>
  <circle class="sv-sam" cx="374" cy="102" r="50"/>
  <circle class="sv-dot" cx="356" cy="88" r="5"/><circle class="sv-dot" cx="390" cy="84" r="5"/><circle class="sv-dot" cx="364" cy="120" r="5"/><circle class="sv-dot" cx="394" cy="116" r="5"/>
  <text class="sv-nl" x="142" y="204" text-anchor="middle">POBLACIÓN (N)</text><text class="sv-t" x="142" y="222" text-anchor="middle">parámetros μ, σ, p · fijos</text>
  <text class="sv-nl" x="374" y="176" text-anchor="middle">MUESTRA (n)</text><text class="sv-t" x="374" y="194" text-anchor="middle">estadísticos x̄, s, p̂</text><text class="sv-t" x="374" y="210" text-anchor="middle">· varían</text>`;
  return svgWrap(440, 230, g, 'Población y muestra');
}

/* Datos ordenados con posiciones de cuartiles */
function svgPositions(o) {
  const d = o.data, n = d.length, cw = Math.min(40, 520 / n), W = n * cw + 20, H = 92;
  let g = '';
  d.forEach((v, i) => {
    const x = 10 + i * cw, m = (o.marks || []).find(k => k.pos === i + 1);
    g += `<rect class="sv-cell${m ? ' hl' : ''}" x="${x}" y="30" width="${cw - 3}" height="30" rx="4"/>`;
    g += `<text class="sv-v" x="${x + (cw - 3) / 2}" y="50" text-anchor="middle">${v}</text>`;
    g += `<text class="sv-t" x="${x + (cw - 3) / 2}" y="76" text-anchor="middle">${i + 1}</text>`;
    if (m) g += `<text class="sv-ml" x="${x + (cw - 3) / 2}" y="22" text-anchor="middle">${m.t}</text>`;
  });
  g += `<text class="sv-t sv-cap" x="10" y="90">posición</text>`;
  return svgWrap(W, H + 4, g, 'Datos ordenados y posiciones');
}

/* Diagrama de puntos con media y mediana */
function svgDots(o) {
  const w = o.w ?? 460, h = 120, L = 20, R = 20, a = o.a, b = o.b, X = v => L + (v - a) / (b - a) * (w - L - R), base = 74;
  let g = `<line class="sv-ax" x1="${L}" x2="${w - R}" y1="${base}" y2="${base}"/>`;
  const cnt = {};
  o.data.forEach(v => { cnt[v] = (cnt[v] || 0) + 1; g += `<circle class="sv-dot" cx="${X(v)}" cy="${base - 8 - (cnt[v] - 1) * 12}" r="5"/>`; });
  for (let v = a; v <= b; v += o.step) g += `<text class="sv-t" x="${X(v)}" y="${base + 16}" text-anchor="middle">${v}</text>`;
  g += `<path class="sv-meant" d="M${X(o.mean)} ${base + 22}l-6 9h12z"/><text class="sv-t" x="${X(o.mean) + 10}" y="${base + 33}">media ${dec(o.mean, 1)}</text>`;
  g += `<line class="sv-medl" x1="${X(o.med)}" x2="${X(o.med)}" y1="18" y2="${base}"/><text class="sv-ml" x="${X(o.med)}" y="13" text-anchor="middle">mediana ${dec(o.med, 0)}</text>`;
  return svgWrap(w, h, g, 'Diagrama de puntos');
}

/* Población de personas (hipergeométrica / conteo) */
function svgPeople(o) {
  const N = o.N, K = o.K, cols = o.cols ?? 10, s = 30, W = cols * s + 20, rows = Math.ceil(N / cols), H = rows * s + 40;
  let g = '';
  for (let i = 0; i < N; i++) {
    const x = 10 + (i % cols) * s + s / 2, y = 10 + Math.floor(i / cols) * s + s / 2, isK = i >= N - K, pk = (o.pick || []).includes(i);
    g += `<g class="${isK ? 'sv-pk' : 'sv-pn'}${pk ? ' pick' : ''}"><circle cx="${x}" cy="${y - 6}" r="4.5"/><path d="M${x - 7} ${y + 9}a7 7 0 0 1 14 0z"/></g>`;
  }
  g += `<g class="sv-pn"><circle cx="18" cy="${H - 18}" r="4"/></g><text class="sv-t" x="28" y="${H - 14}">${o.ln}</text>`;
  g += `<g class="sv-pk"><circle cx="${W / 2 + 10}" cy="${H - 18}" r="4"/></g><text class="sv-t" x="${W / 2 + 20}" y="${H - 14}">${o.lk}</text>`;
  return svgWrap(W, H, g, 'Población');
}

/* Línea de tiempo de eventos Poisson con ventana destacada */
function svgRate(o) {
  const w = o.w ?? 480, h = 116, L = 18, R = 18, X = v => L + v / o.T * (w - L - R), y = 58;
  let g = `<rect class="sv-win" x="${X(o.a)}" y="${y - 30}" width="${X(o.b) - X(o.a)}" height="44" rx="5"/>`;
  g += `<line class="sv-ax" x1="${L}" x2="${w - R}" y1="${y}" y2="${y}"/>`;
  o.ev.forEach(t => { g += `<path class="sv-evt" d="M${X(t)} ${y - 16}l4 8-4 8-4-8z"/>`; });
  for (let v = 0; v <= o.T; v += o.step) g += `<line class="sv-tick" x1="${X(v)}" x2="${X(v)}" y1="${y}" y2="${y + 5}"/><text class="sv-t" x="${X(v)}" y="${y + 19}" text-anchor="middle">${v}:00</text>`;
  g += `<text class="sv-ml" x="${(X(o.a) + X(o.b)) / 2}" y="${y - 36}" text-anchor="middle">${o.wl}</text>`;
  g += `<text class="sv-t sv-cap" x="${w / 2}" y="${h - 6}" text-anchor="middle">${o.cap}</text>`;
  return svgWrap(w, h, g, 'Eventos en el tiempo');
}

/* Transformada inversa sobre la acumulada normal */
function svgInverse(o) {
  const w = 440, h = 220, L = 40, R = 16, T = 14, B = 34, mu = o.mu, s = o.s;
  const x0 = mu - 3.3 * s, x1 = mu + 3.3 * s, X = v => L + (v - x0) / (x1 - x0) * (w - L - R), Y = p => h - B - p * (h - B - T);
  let c = '';
  for (let i = 0; i <= 120; i++) { const v = x0 + (x1 - x0) * i / 120; c += (i ? 'L' : 'M') + X(v).toFixed(1) + ' ' + Y(Phi((v - mu) / s)).toFixed(1); }
  let g = `<line class="sv-ax" x1="${L}" x2="${w - R}" y1="${h - B}" y2="${h - B}"/><line class="sv-ax" x1="${L}" x2="${L}" y1="${T}" y2="${h - B}"/>`;
  [0, 0.5, 1].forEach(p => { g += `<text class="sv-t" x="${L - 6}" y="${Y(p) + 4}" text-anchor="end">${dec(p, 1)}</text>`; });
  g += `<path class="sv-curve" d="${c}"/>`;
  const xu = o.x;
  g += `<path class="sv-arrowl" d="M${L} ${Y(o.u)}H${X(xu)}V${h - B}"/><path class="sv-meant" d="M${X(xu)} ${h - B}l-5 -9h10z"/>`;
  g += `<text class="sv-ml" x="${L + 6}" y="${Y(o.u) - 6}">u = ${dec(o.u, 3)}</text><text class="sv-ml" x="${X(xu)}" y="${h - B + 18}" text-anchor="middle">x = ${dec(xu, 1)}</text>`;
  g += `<text class="sv-t" x="${X(mu)}" y="${h - 4}" text-anchor="middle">F(x) = P(X < x) → se lee al revés</text>`;
  return svgWrap(w, h, g, 'Transformada inversa');
}

/* Barras horizontales para comparar valores */
function svgCompare(items, o = {}) {
  const w = o.w ?? 420, rh = 40, h = items.length * rh + 16, L = 120, R = 64, mx = o.max ?? 1;
  let g = '';
  items.forEach((it, i) => {
    const y = 10 + i * rh, bw = it.v / mx * (w - L - R);
    g += `<text class="sv-nl sm" x="${L - 10}" y="${y + 22}" text-anchor="end">${it.l}</text>`;
    g += `<rect class="sv-cmp${it.hl ? ' hl' : ''}" x="${L}" y="${y + 6}" width="${bw}" height="24" rx="4"/>`;
    g += `<text class="sv-v" x="${L + bw + 8}" y="${y + 23}">${dec(it.v, 3)}</text>`;
  });
  return svgWrap(w, h, g, 'Comparación');
}
