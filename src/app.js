/* =====================================================================
   app.js — mapa mental, panel de lección, ejercicios y progreso
   ===================================================================== */
const STORE = 'estad-sust26-v1';
let S = { ex: {}, open: [], theme: null, sim: {} };
try { const raw = localStorage.getItem(STORE); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) { /* sin almacenamiento */ }
function save() { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { /* sin almacenamiento */ } }

const TOPICS = UNITS.flatMap(u => u.topics.map(t => { t.unit = u; return t; }));
const TOPIC = Object.fromEntries(TOPICS.map(t => [t.id, t]));
const UNIT = Object.fromEntries(UNITS.map(u => [u.id, u]));
const PARENT = { root: null };
UNITS.forEach(u => { PARENT[u.id] = 'root'; u.topics.forEach(t => { PARENT[t.id] = u.id; }); });
const TOTAL_EX = TOPICS.length * 3;
const LV = { 1: 'Básico', 2: 'Material del curso', 3: 'Tipo examen' };
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function fmtNum(v, d) {
  const neg = v < 0, [i, f] = Math.abs(v).toFixed(d).split('.');
  return (neg ? '−' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (f ? ',' + f : '');
}
function fmtAns(f) {
  const s = String(f.ans), d = Number.isInteger(f.ans) ? 0 : Math.min(3, (s.split('.')[1] || '').length);
  return fmtNum(f.ans, d) + (f.u ? ' ' + f.u : '');
}

/* ---------------- Tema claro / oscuro ---------------- */
function isDark() { return S.theme ? S.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; }
function applyTheme() {
  const r = document.documentElement;
  if (S.theme) r.dataset.theme = S.theme; else delete r.dataset.theme;
  const b = $('#theme-btn'); if (b) { b.innerHTML = ic(isDark() ? 'sun' : 'moon'); b.setAttribute('aria-label', isDark() ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'); }
}

/* =====================================================================
   MAPA MENTAL
   ===================================================================== */
const mapEl = $('#map'), inner = $('#map-inner'), edgesSvg = $('#map-edges');
const openSet = new Set(S.open || []);
const nodeEls = {};
let mode = 'h', cur = {}, animId = 0;

function mkNode(id, cls, html, label) {
  const b = document.createElement('button');
  b.type = 'button'; b.className = cls; b.dataset.id = id; b.innerHTML = html; b.style.display = 'none';
  if (label) b.setAttribute('aria-label', label);
  inner.appendChild(b); nodeEls[id] = b;
}
function buildNodes() {
  mkNode('root', 'mn mn-root', `<span class="mn-ins">${ic('insignia')}</span><span class="mn-rt"><b>Estadística I</b><small>Sustitutiva 2026</small><span class="rbar"><i data-rfill></i></span><small class="rtxt" data-rtxt></small></span>`, 'Estadística I: desplegar o contraer todo');
  UNITS.forEach(u => {
    mkNode(u.id, `mn mn-unit c-${u.color}`, `<span class="mn-ic">${ic(u.icon)}</span><span class="mn-tx"><b>${u.n}. ${u.title}</b><small>${u.item} · <span class="mn-prog" data-prog></span></small></span><span class="mn-chev">${ic('chevR')}</span>`);
    u.topics.forEach(t => mkNode(t.id, `mn mn-leaf c-${u.color}`, `<span class="mn-lic">${ic(t.icon)}</span><span class="mn-lt">${t.map}</span><span class="dots" data-dots></span>`));
  });
}

function computeLayout() {
  const pos = {};
  if (mode === 'h') {
    const { RW, RH, UW, UH, LW, LH, GAP, colU, colL, W } = HL;
    let y = 22;
    UNITS.forEach(u => {
      if (openSet.has(u.id)) {
        const n = u.topics.length, block = n * LH + (n - 1) * 10, y0 = y + Math.max(0, (UH - block) / 2);
        u.topics.forEach((t, j) => { pos[t.id] = { x: colL, y: y0 + j * (LH + 10), w: LW, h: LH }; });
        pos[u.id] = { x: colU, y: y + Math.max(0, (block - UH) / 2), w: UW, h: UH };
        y += Math.max(block, UH) + 30;
      } else {
        pos[u.id] = { x: colU, y, w: UW, h: UH };
        y += UH + 19;
      }
    });
    const f = pos[UNITS[0].id], l = pos[UNITS.at(-1).id], cy = (f.y + l.y + l.h) / 2;
    pos.root = { x: 14, y: cy - RH / 2, w: RW, h: RH };
    return { pos, W, H: Math.max(y, cy + RH / 2 + 10) + 6 };
  }
  const W = mapEl.clientWidth;
  let y = 12;
  pos.root = { x: 8, y, w: W - 16, h: 84 }; y += 84 + 16;
  UNITS.forEach(u => {
    pos[u.id] = { x: 24, y, w: W - 32, h: 72 }; y += 72 + 10;
    if (openSet.has(u.id)) { u.topics.forEach(t => { pos[t.id] = { x: 58, y, w: W - 66, h: 55 }; y += 62; }); y += 8; }
  });
  return { pos, W, H: y + 8 };
}
/* Medidas del mapa horizontal (nodos un 20% más grandes, columnas más separadas) */
const HL = (() => {
  const RW = 266, RH = 125, UW = 336, UH = 79, LW = 314, LH = 55, GAP = 110;
  const colU = 14 + RW + GAP, colL = colU + UW + GAP;
  return { RW, RH, UW, UH, LW, LH, GAP, colU, colL, W: colL + LW + 14 };
})();

function edgePath(p, c) {
  if (mode === 'h') {
    const x1 = p.x + p.w, y1 = p.y + p.h / 2, x2 = c.x, y2 = c.y + c.h / 2, dx = Math.max(20, (x2 - x1) * 0.55);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)}C${(x1 + dx).toFixed(1)} ${y1.toFixed(1)} ${(x2 - dx).toFixed(1)} ${y2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  const x1 = p.x + 18, y1 = p.y + p.h, x2 = c.x, y2 = c.y + c.h / 2, r = Math.max(0, Math.min(10, y2 - y1, x2 - x1));
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}V${(y2 - r).toFixed(1)}Q${x1.toFixed(1)} ${y2.toFixed(1)} ${(x1 + r).toFixed(1)} ${y2.toFixed(1)}H${x2.toFixed(1)}`;
}
function drawEdges(P) {
  let s = '';
  for (const id in P) {
    const pid = PARENT[id];
    if (!pid || !P[pid]) continue;
    const u = UNIT[id] || TOPIC[id].unit;
    s += `<path d="${edgePath(P[pid], P[id])}" class="edge c-${u.color}${PARENT[id] === 'root' ? ' trunk' : ''}" style="opacity:${P[id].o.toFixed(3)}"/>`;
  }
  edgesSvg.innerHTML = s;
}
function applyPos(id, p) {
  const el = nodeEls[id];
  el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
  el.style.width = p.w.toFixed(1) + 'px';
  el.style.height = p.h.toFixed(1) + 'px';
  el.style.opacity = p.o.toFixed(3);
  el.style.pointerEvents = p.o > 0.6 ? '' : 'none';
}

function relayout(animate = true) {
  const m = mapEl.clientWidth >= HL.W + 16 ? 'h' : 'v';
  if (m !== mode) { mode = m; animate = false; }
  mapEl.classList.toggle('vmode', mode === 'v');
  const { pos, W, H } = computeLayout();
  inner.style.width = W + 'px';
  const from = {}, to = {};
  new Set([...Object.keys(cur), ...Object.keys(pos)]).forEach(id => {
    const t = pos[id], c = cur[id];
    if (t) {
      to[id] = { ...t, o: 1 };
      if (c && animate) from[id] = c;
      else if (animate) { const pp = cur[PARENT[id]] || pos[PARENT[id]]; from[id] = { x: pp.x + (mode === 'h' ? 0 : 12), y: pp.y + pp.h / 2 - t.h / 2, w: t.w, h: t.h, o: 0 }; }
      else from[id] = to[id];
      nodeEls[id].style.display = '';
    } else if (c) {
      const pp = pos[PARENT[id]];
      from[id] = c; to[id] = { x: pp.x, y: pp.y + pp.h / 2 - c.h / 2, w: c.w, h: c.h, o: 0, gone: true };
    }
  });
  const startH = parseFloat(inner.style.height) || H, my = ++animId, dur = animate && !reduceMotion ? 430 : 0, t0 = performance.now();
  const step = now => {
    if (my !== animId) return;
    const k = dur ? Math.min(1, (now - t0) / dur) : 1;
    const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const P = {};
    for (const id in to) {
      const a = from[id], b = to[id];
      P[id] = { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, w: a.w + (b.w - a.w) * e, h: a.h + (b.h - a.h) * e, o: a.o + (b.o - a.o) * e };
      applyPos(id, P[id]);
    }
    drawEdges(P);
    inner.style.height = (startH + (H - startH) * e) + 'px';
    cur = P;
    if (k < 1) requestAnimationFrame(step);
    else {
      for (const id in to) if (to[id].gone) { nodeEls[id].style.display = 'none'; delete cur[id]; }
      drawEdges(cur);
    }
  };
  if (dur) requestAnimationFrame(step); else step(t0);
  UNITS.forEach(u => { nodeEls[u.id].classList.toggle('open', openSet.has(u.id)); nodeEls[u.id].setAttribute('aria-expanded', openSet.has(u.id)); });
}
function persistOpen() { S.open = [...openSet]; save(); }
function toggleUnit(id, force) {
  const on = force ?? !openSet.has(id);
  if (on) openSet.add(id); else openSet.delete(id);
  persistOpen(); relayout();
}

inner.addEventListener('click', ev => {
  const n = ev.target.closest('.mn'); if (!n) return;
  const id = n.dataset.id;
  if (id === 'root') { const any = openSet.size > 0; UNITS.forEach(u => any ? openSet.delete(u.id) : openSet.add(u.id)); persistOpen(); relayout(); }
  else if (UNIT[id]) toggleUnit(id);
  else openTopic(id);
});

/* ---------------- Progreso ---------------- */
const doneCount = t => [0, 1, 2].filter(i => S.ex[`${t.id}-e${i}`] === 'ok').length;
function refreshProgress() {
  let total = 0;
  TOPICS.forEach(t => {
    const d = doneCount(t); total += d;
    const el = nodeEls[t.id];
    el.querySelector('[data-dots]').innerHTML = [0, 1, 2].map(i => `<i class="${S.ex[`${t.id}-e${i}`] || ''}"></i>`).join('');
    el.classList.toggle('done', d === 3);
    el.setAttribute('aria-label', `${t.title}: ${d} de 3 ejercicios resueltos`);
  });
  UNITS.forEach(u => {
    const d = u.topics.reduce((a, t) => a + doneCount(t), 0), n = u.topics.length * 3;
    nodeEls[u.id].querySelector('[data-prog]').innerHTML = `<b>${d}</b>/${n}`;
    nodeEls[u.id].style.setProperty('--pct', (d / n).toFixed(3));
    nodeEls[u.id].setAttribute('aria-label', `Unidad ${u.n}: ${u.title}, ${d} de ${n} ejercicios`);
  });
  UNITS.forEach(u => {
    const d = u.topics.reduce((a, t) => a + doneCount(t), 0), n = u.topics.length * 3, li = $(`#route [data-unit="${u.id}"]`);
    if (!li) return;
    li.querySelector('[data-rt-n]').textContent = `${d}/${n}`;
    li.querySelector('[data-rt-bar]').style.width = (d / n * 100).toFixed(1) + '%';
    li.classList.toggle('done', d === n);
  });
  nodeEls.root.querySelector('[data-rfill]').style.width = (total / TOTAL_EX * 100).toFixed(1) + '%';
  nodeEls.root.querySelector('[data-rtxt]').textContent = `${total} de ${TOTAL_EX} ejercicios`;
  $('#hp-n').textContent = `${total}/${TOTAL_EX}`;
  $('#hp-fill').style.width = (total / TOTAL_EX * 100).toFixed(1) + '%';
}
function setState(id, st) {
  if (S.ex[id] === 'ok') return;
  if (st === 'try' && S.ex[id] === 'sol') return;
  S.ex[id] = st; save(); refreshProgress();
  const card = document.querySelector(`[data-ex="${id}"], [data-cq="${id}"]`);
  if (card) { card.classList.remove('ok', 'sol', 'try'); card.classList.add(st); const l = card.querySelector('.st'); if (l) l.innerHTML = stLabel(st); }
}
function stLabel(st) {
  return { ok: `${ic('check')}Resuelto`, sol: `${ic('eye')}Solución vista`, try: `${ic('pencil')}En intento` }[st] || '';
}

/* =====================================================================
   PANEL DE LECCIÓN
   ===================================================================== */
const drawer = $('#drawer'), drBody = $('#dr-body');
let curTopic = null, lastFocus = null;

function exCard(e, id) {
  const st = S.ex[id] || '';
  const inputs = e.o
    ? `<div class="mc">${e.o.map((o, k) => `<button type="button" class="mc-opt" data-o="${k}"><b>${'abcd'[k]})</b><span>${o}</span></button>`).join('')}</div>`
    : `<div class="fields${e.f.length === 1 ? ' one' : ''}">${e.f.map(fieldHTML).join('')}</div>`;
  return `<article class="exc lv${e.n} ${st}" data-ex="${id}">
    <header class="exh"><span class="lv-b">Nivel ${e.n} · ${LV[e.n]}</span><span class="src">${e.src}</span><span class="st">${stLabel(st)}</span></header>
    <div class="exq">${e.q}</div>${inputs}
    <div class="acts">${e.o ? '' : `<button type="button" class="btn pri" data-act="check">${ic('check')}Comprobar</button>`}<button type="button" class="btn gh" data-act="hint">${ic('bulb')}Pista</button><button type="button" class="btn gh" data-act="sol">${ic('eye')}Ver solución</button></div>
    <div class="fb" aria-live="polite"></div>
    <div class="hint" hidden>${ic('bulb')}<span>${e.hint}</span></div>
    <div class="sol" hidden><b>Solución paso a paso</b><ol>${e.sol.map(s => `<li>${s}</li>`).join('')}</ol>${solFinal(e)}</div>
  </article>`;
}
function fieldHTML(f, k) {
  if (f.opts) return `<label class="fld sel"><span class="fl">${f.l}</span><span class="inp"><select data-f="${k}"><option value="">— elige —</option>${f.opts.map((o, j) => `<option value="${j}">${o}</option>`).join('')}</select></span><i class="mk"></i></label>`;
  return `<label class="fld"><span class="fl">${f.l}</span><span class="inp"><input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-f="${k}" placeholder="${f.p ? 'ej: 0,067' : 'tu respuesta'}">${f.u ? `<em>${f.u}</em>` : ''}</span><i class="mk"></i></label>`;
}
function solFinal(e) {
  if (e.o) return `<div class="res">${ic('check')}<span>Respuesta: <b>${'abcd'[e.ok]})</b> ${e.o[e.ok]}</span></div>`;
  return `<div class="res">${ic('check')}<span>${e.f.map(f => `${f.l}: <b>${f.opts ? f.opts[f.ok] : fmtAns(f)}</b>`).join(' · ')}</span></div>`;
}
function cqCard(q, id, i) {
  return `<article class="cq ${S.ex[id] || ''}" data-cq="${id}"><div class="cq-q"><span class="cq-n">${i + 1}</span><div>${q.q}</div></div>
    <div class="mc">${q.o.map((o, k) => `<button type="button" class="mc-opt" data-o="${k}"><b>${'abcd'[k]})</b><span>${o}</span></button>`).join('')}</div><div class="fb" aria-live="polite"></div></article>`;
}

function lessonHTML(t) {
  return `
  <section class="ls" id="ls-def"><h3>${ic('book')}Definición</h3><div class="def-grid"><p class="def-text">${t.def}</p><figure class="def-fig">${t.fig}</figure></div></section>
  <section class="ls" id="ls-car"><h3>${ic('list')}Características</h3><ul class="checks">${t.car.map(c => `<li>${ic('check')}<span>${c}</span></li>`).join('')}</ul></section>
  <section class="ls" id="ls-cuando"><h3>${ic('scope')}¿Cuándo se usa?</h3><ul class="cases">${t.casos.map(c => `<li>${ic('chevR')}<span>${c}</span></li>`).join('')}</ul>
    <div class="signals"><span class="sig-l">${ic('search')}Señales en el enunciado</span>${t.senales.map(s => `<span class="sig">«${s}»</span>`).join('')}</div></section>
  <section class="ls" id="ls-como"><h3>${ic('steps')}¿Cómo se usa? Paso a paso</h3><ol class="stepper">${t.como.map(c => `<li><span>${c}</span></li>`).join('')}</ol></section>
  <section class="ls" id="ls-ej"><h3>${ic('target')}Ejemplo resuelto</h3><div class="ej-card"><div class="src-tag">${ic('flag')}${t.ej.src}</div><div class="ej-q">${t.ej.q}</div>
    <ol class="ej-steps">${t.ej.steps.map(s => `<li>${s}</li>`).join('')}</ol><div class="res">${ic('check')}<span>${t.ej.res}</span></div>
    ${t.ej.err ? `<div class="callout bad">${ic('alert')}<div><b>Error frecuente</b><p>${t.ej.err}</p></div></div>` : ''}
    ${t.ej.nota ? `<div class="callout info">${ic('info')}<div><b>Nota sobre el enunciado</b><p>${t.ej.nota}</p></div></div>` : ''}</div></section>
  <section class="ls" id="ls-ex"><h3>${ic('pencil')}Ejercicios <small>Nivel 1 → 3</small></h3>${t.ex.map((e, i) => exCard(e, `${t.id}-e${i}`)).join('')}</section>
  <section class="ls" id="ls-cq"><h3>${ic('question')}Conceptos <small>tipo Ítem I</small></h3>${t.cq.map((q, i) => cqCard(q, `${t.id}-c${i}`, i)).join('')}</section>
  <nav class="ls-next">${navBtn(t, -1)}${navBtn(t, 1)}</nav>`;
}
function navBtn(t, d) {
  const o = TOPICS[TOPICS.indexOf(t) + d];
  if (!o) return '<span></span>';
  return `<button type="button" class="nx ${d < 0 ? 'prev' : 'next'}" data-go="${o.id}"><small>${d < 0 ? '← Anterior' : 'Siguiente →'}</small><b>${o.title}</b></button>`;
}

function openTopic(id) {
  const t = TOPIC[id], u = t.unit;
  if (!$('#sheet').hidden) closeSheet();
  if (!drawer.classList.contains('open')) lastFocus = document.activeElement;
  curTopic = t;
  drawer.className = `drawer open c-${u.color}`;
  drawer.hidden = false;
  $('#dr-crumb').innerHTML = `${ic(u.icon)}<span>Unidad ${u.n} · ${u.title}</span>`;
  $('#dr-title').innerHTML = `<span class="dr-ic">${ic(t.icon)}</span><span>${t.title}</span>`;
  $('#dr-tags').innerHTML = t.exam.map(e => `<span class="tag">${e}</span>`).join('');
  $('#dr-prev').disabled = TOPICS.indexOf(t) === 0;
  $('#dr-next').disabled = TOPICS.indexOf(t) === TOPICS.length - 1;
  drBody.innerHTML = lessonHTML(t);
  drBody.scrollTop = 0;
  document.body.classList.add('noscroll');
  $$('.mn-leaf.active').forEach(n => n.classList.remove('active'));
  nodeEls[id].classList.add('active');
  if (!openSet.has(u.id)) { openSet.add(u.id); persistOpen(); relayout(); }
  setTimeout(() => $('#dr-close').focus({ preventScroll: true }), 30);
}
function closeDrawer() {
  drawer.classList.remove('open');
  document.body.classList.remove('noscroll');
  setTimeout(() => { if (!drawer.classList.contains('open')) drawer.hidden = true; }, 320);
  if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
}
$('#dr-close').addEventListener('click', closeDrawer);
$('#dr-backdrop').addEventListener('click', closeDrawer);
$('#dr-prev').addEventListener('click', () => { const i = TOPICS.indexOf(curTopic); if (i > 0) openTopic(TOPICS[i - 1].id); });
$('#dr-next').addEventListener('click', () => { const i = TOPICS.indexOf(curTopic); if (i < TOPICS.length - 1) openTopic(TOPICS[i + 1].id); });
$('#dr-nav').addEventListener('click', ev => {
  const b = ev.target.closest('[data-sec]'); if (!b) return;
  const sec = $('#' + b.dataset.sec, drBody); if (sec) drBody.scrollTo({ top: sec.offsetTop - 8, behavior: reduceMotion ? 'auto' : 'smooth' });
});

/* =====================================================================
   CORRECCIÓN DE RESPUESTAS
   ===================================================================== */
function parseNum(str, big) {
  let s = String(str).trim().replace(/\s+/g, '').replace(/−/g, '-');
  if (!s) return { empty: true };
  let pct = false;
  if (s.endsWith('%')) { pct = true; s = s.slice(0, -1); }
  const conv = x => {
    if (x.includes(',')) return x.replace(/\./g, '').replace(',', '.');
    if (big && /^-?\d{1,3}(\.\d{3})+$/.test(x)) return x.replace(/\./g, '');
    return x;
  };
  let v;
  if (s.includes('/')) { const [a, b] = s.split('/'); v = Number(conv(a)) / Number(conv(b)); }
  else v = Number(conv(s));
  if (!isFinite(v) || s === '-' || s === '.') return { invalid: true };
  return { v, pct };
}
function judge(str, f) {
  const r = parseNum(str, Math.abs(f.ans) >= 1000);
  if (r.empty || r.invalid) return r;
  let v = r.v, note = '';
  if (r.pct) v /= 100;
  else if (f.p && v > 1 && v <= 100) { v /= 100; note = `(Leí «${str}» como porcentaje.)`; }
  const tol = f.tol ?? 0.003;
  return { ok: [f.ans, ...(f.alt || [])].some(a => Math.abs(v - a) <= tol + 1e-9), note };
}
/* Revisa los campos de una tarjeta; devuelve fracción correcta */
function gradeFields(card, fields) {
  let okN = 0, filled = 0; const notes = [];
  fields.forEach((f, k) => {
    const el = card.querySelector(`[data-f="${k}"]`), wrap = el.closest('.fld');
    wrap.classList.remove('ok', 'bad');
    if (f.opts) {
      if (el.value === '') return;
      filled++; const ok = Number(el.value) === f.ok; wrap.classList.add(ok ? 'ok' : 'bad'); if (ok) okN++;
      return;
    }
    const r = judge(el.value, f);
    if (r.empty) return;
    filled++;
    if (r.invalid) { wrap.classList.add('bad'); notes.push(`«${el.value}» no es un número válido (usa coma o punto decimal).`); return; }
    wrap.classList.add(r.ok ? 'ok' : 'bad'); if (r.ok) okN++; if (r.note) notes.push(r.note);
  });
  return { okN, filled, n: fields.length, notes };
}
function checkCard(card, e, id) {
  const g = gradeFields(card, e.f), fb = card.querySelector('.fb');
  if (g.filled === 0) { fb.className = 'fb warn'; fb.innerHTML = `${ic('info')}<span>Escribe tu respuesta antes de comprobar.</span>`; return; }
  if (g.okN === g.n) { fb.className = 'fb ok'; fb.innerHTML = `${ic('check')}<span><b>¡Correcto!</b> ${g.notes.join(' ')}</span>`; setState(id, 'ok'); }
  else {
    fb.className = 'fb bad';
    const miss = g.n - g.filled;
    fb.innerHTML = `${ic('x')}<span><b>${g.okN} de ${g.n} correctos.</b> ${miss ? (miss === 1 ? 'Falta 1 por completar. ' : `Faltan ${miss} por completar. `) : ''}${g.notes.join(' ')} Revisa los marcados en rojo o pide una pista.</span>`;
    setState(id, 'try');
  }
}
function getItem(id) {
  const [tid, k] = id.split('-'), t = TOPIC[tid], i = Number(k.slice(1));
  return k[0] === 'e' ? t.ex[i] : t.cq[i];
}
function answerMC(card, item, k, id) {
  const opts = $$('.mc-opt', card), fb = card.querySelector('.fb');
  if (k === item.ok) {
    opts.forEach(o => o.classList.remove('wrong'));
    opts[k].classList.add('right');
    fb.className = 'fb ok'; fb.innerHTML = `${ic('check')}<span><b>¡Correcto!</b> ${item.exp || ''}</span>`;
    setState(id, 'ok');
  } else {
    opts[k].classList.add('wrong');
    fb.className = 'fb bad';
    fb.innerHTML = `${ic('x')}<span>${(item.why && item.why[k]) || 'No es correcta. Vuelve a intentar.'}${card.matches('.cq') ? ` <button type="button" class="lnk" data-act="reveal">Ver respuesta</button>` : ''}</span>`;
    setState(id, 'try');
  }
}

drBody.addEventListener('click', ev => {
  const go = ev.target.closest('[data-go]');
  if (go) { openTopic(go.dataset.go); return; }
  const card = ev.target.closest('[data-ex], [data-cq]'); if (!card) return;
  const id = card.dataset.ex || card.dataset.cq, item = getItem(id);
  const opt = ev.target.closest('.mc-opt');
  if (opt) { answerMC(card, item, Number(opt.dataset.o), id); return; }
  const act = ev.target.closest('[data-act]'); if (!act) return;
  const a = act.dataset.act;
  if (a === 'check') checkCard(card, item, id);
  else if (a === 'hint') { const h = card.querySelector('.hint'); h.hidden = !h.hidden; act.classList.toggle('on', !h.hidden); }
  else if (a === 'sol') {
    const s = card.querySelector('.sol'); s.hidden = !s.hidden; act.classList.toggle('on', !s.hidden);
    if (!s.hidden) { setState(id, 'sol'); if (item.o) $$('.mc-opt', card)[item.ok].classList.add('right'); }
  } else if (a === 'reveal') {
    $$('.mc-opt', card)[item.ok].classList.add('right');
    const fb = card.querySelector('.fb'); fb.className = 'fb info'; fb.innerHTML = `${ic('info')}<span>Respuesta: <b>${'abcd'[item.ok]})</b>. ${item.exp || ''}</span>`;
    setState(id, 'sol');
  }
});
drBody.addEventListener('keydown', ev => {
  if (ev.key !== 'Enter' || !ev.target.matches('input[data-f]')) return;
  ev.preventDefault();
  const card = ev.target.closest('[data-ex]'); checkCard(card, getItem(card.dataset.ex), card.dataset.ex);
});
drBody.addEventListener('input', ev => {
  const w = ev.target.closest('.fld'); if (w) w.classList.remove('ok', 'bad');
});

/* =====================================================================
   PORTADA: estructura del examen
   ===================================================================== */
const EXAM = [
  { it: 'I', name: 'Conocimiento', pts: 'Selección única', icon: 'question', what: ['Parámetro vs estadístico', 'Tipos de variable', 'Asimetría e histograma', '¿Qué distribución modela…?'], topics: ['t11', 't12', 't14', 't32', 't34'] },
  { it: 'II', name: 'Comprensión', pts: '7 pts', icon: 'chart', what: ['a) Tabla: casos y % (1)', 'b) Histograma y forma (2)', 'c) Resumen de 5 números (2)', 'd) Boxplot y anómalos (2)'], topics: ['t13', 't14', 't16', 't17'] },
  { it: 'III', name: 'Aplicación', pts: '4 pts', icon: 'dice', what: ['a) Comando de 5: favorables / totales (2)', 'b) Misiles: Poisson con λ ajustado (2)'], topics: ['t24', 't32', 't33'] },
  { it: 'IV', name: 'Aplicación', pts: '6 pts', icon: 'bell', what: ['a) Proporción que supera 29 min (2)', 'b) El 15% más veloz: percentil (2)', 'c) A menos de 1σ de la media (2)'], topics: ['t42', 't43'] },
  { it: 'V', name: 'Análisis', pts: '6 pts', icon: 'network', what: ['a) Sistema NAC en paralelo (3)', 'b) Sistema IMP en serie (3)'], topics: ['t44', 't52', 't51', 't53'] },
];
function renderExamStrip() {
  $('#exam-grid').innerHTML = EXAM.map(e => `<article class="ex-item">
    <header><span class="ei-n">Ítem ${e.it}</span><span class="ei-ic">${ic(e.icon)}</span></header>
    <h4>${e.name}<small>${e.pts}</small></h4>
    <ul>${e.what.map(w => `<li>${w}</li>`).join('')}</ul>
    <div class="ei-topics">${e.topics.map(id => `<button type="button" class="chip c-${TOPIC[id].unit.color}" data-topic="${id}">${ic(TOPIC[id].icon)}${TOPIC[id].map}</button>`).join('')}</div>
  </article>`).join('');
}
document.addEventListener('click', ev => {
  const c = ev.target.closest('[data-topic]'); if (c) openTopic(c.dataset.topic);
});

/* ---------------- Ruta del 1 al 6 ---------------- */
function renderRoute() {
  $('#route').innerHTML = `<ol class="rt-list">${UNITS.map(u => `<li class="rt-step c-${u.color}" data-unit="${u.id}">
      <button type="button" class="rt-btn" data-route="${u.id}" aria-label="Unidad ${u.n}: ${u.title}">
        <span class="rt-dot"><span class="rt-num">${u.n}</span>${ic(u.icon)}</span>
        <b>${u.short}</b><small>${u.item}</small>
        <span class="rt-bar"><i data-rt-bar></i></span><span class="rt-n" data-rt-n></span>
      </button></li>`).join('')}
    <li class="rt-step rt-goal"><button type="button" class="rt-btn" data-open="simulacro" aria-label="Meta: simulacro del examen">
        <span class="rt-dot">${ic('medal')}</span><b>¡Listo!</b><small>Simulacro final</small>
      </button></li></ol>`;
}
$('#route').addEventListener('click', ev => {
  const b = ev.target.closest('[data-route]'); if (!b) return;
  if (!openSet.has(b.dataset.route)) toggleUnit(b.dataset.route, true);
  setTimeout(() => nodeEls[b.dataset.route].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }), 120);
});

/* Confirmación en dos toques (sin confirm(): puede estar bloqueado dentro de un visor) */
function confirmTwice(btn, action) {
  if (btn.dataset.armed) { clearTimeout(Number(btn.dataset.armed)); delete btn.dataset.armed; btn.innerHTML = btn.dataset.label; action(); return; }
  btn.dataset.label = btn.innerHTML;
  btn.textContent = '¿Seguro? Toca otra vez para borrar';
  btn.dataset.armed = String(setTimeout(() => { delete btn.dataset.armed; btn.innerHTML = btn.dataset.label; }, 4000));
}

/* ---------------- Inicio ---------------- */
function hydrateIcons(root = document) { $$('[data-ic]', root).forEach(el => { el.innerHTML = ic(el.dataset.ic); }); }
function init() {
  applyTheme();
  hydrateIcons();
  buildNodes();
  renderRoute();
  renderExamStrip();
  relayout(false);
  refreshProgress();
  $('#theme-btn').addEventListener('click', () => { S.theme = isDark() ? 'light' : 'dark'; save(); applyTheme(); });
  $('#expand-all').addEventListener('click', () => { UNITS.forEach(u => openSet.add(u.id)); persistOpen(); relayout(); });
  $('#collapse-all').addEventListener('click', () => { openSet.clear(); persistOpen(); relayout(); });
  $('#reset-btn').addEventListener('click', ev => confirmTwice(ev.currentTarget, () => {
    S.ex = {}; S.sim = {}; save(); refreshProgress();
    if (curTopic && drawer.classList.contains('open')) openTopic(curTopic.id);
  }));
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => relayout(false), 120); });
  document.addEventListener('keydown', ev => {
    if (ev.key !== 'Escape') return;
    if (!$('#deck').hidden) return;
    if (!$('#sheet').hidden) { closeSheet(); return; }
    if (drawer.classList.contains('open')) closeDrawer();
  });
}
