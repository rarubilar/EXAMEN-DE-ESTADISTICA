/* =====================================================================
   extras.js — Formulario, «¿Qué distribución uso?» y Simulacro
   ===================================================================== */
const sheet = $('#sheet'), shBody = $('#sh-body');
let sheetLast = null, simTimer = null;

function openSheet(kind) {
  if (sheet.hidden) sheetLast = document.activeElement;
  sheet.hidden = false;
  sheet.dataset.kind = kind;
  document.body.classList.add('noscroll');
  const cfg = {
    formulario: ['clipboard', 'Formulario y tabla normal', 'Lo que entrega el examen + lo que conviene memorizar', renderFormulario],
    decision: ['compass', 'Practica aquí: ¿qué distribución es para qué?', 'Paso 1 aprende · Paso 2 decide · Paso 3 practica con 20 casos', renderDecision],
    simulacro: ['flag', 'Simulacro · Sustitutiva 2026', 'Mismas preguntas y puntajes que el examen, con corrección', renderSimulacro],
  }[kind];
  $('#sh-title').innerHTML = `<span class="sh-ic">${ic(cfg[0])}</span><span><b>${cfg[1]}</b><small>${cfg[2]}</small></span>`;
  if (simTimer) { clearInterval(simTimer); simTimer = null; }
  shBody.innerHTML = '';
  shBody.onclick = shBody.oninput = shBody.onchange = null;
  cfg[3]();
  shBody.scrollTop = 0;
  setTimeout(() => $('#sh-close').focus({ preventScroll: true }), 30);
}
function closeSheet() {
  sheet.hidden = true;
  if (simTimer) { clearInterval(simTimer); simTimer = null; }
  if (!drawer.classList.contains('open')) document.body.classList.remove('noscroll');
  if (sheetLast && sheetLast.focus) sheetLast.focus({ preventScroll: true });
}
$('#sh-close').addEventListener('click', closeSheet);
$('#sh-backdrop').addEventListener('click', closeSheet);
document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-open]'); if (!b) return;
  if (b.dataset.open === 'deck') openDeck(); else openSheet(b.dataset.open);
});

/* =====================================================================
   FORMULARIO
   ===================================================================== */
const NT = [
  [[-3.0, .001], [-2.9, .002], [-2.8, .003], [-2.7, .003], [-2.6, .005], [-2.5, .006], [-2.45, .007], [-2.40, .008], [-2.35, .009], [-2.30, .011]],
  [[-2.25, .012], [-2.20, .014], [-2.15, .016], [-2.10, .018], [-2.05, .020], [-2.00, .023], [-1.95, .026], [-1.90, .029], [-1.85, .032], [-1.80, .036], [-1.75, .040], [-1.70, .045], [-1.65, .050], [-1.60, .055], [-1.55, .061], [-1.5, .067], [-1.4, .081], [-1.3, .097], [-1.2, .115], [-1.1, .136]],
  [[-1.0, .159], [-0.9, .184], [-0.8, .212], [-0.7, .242], [-0.6, .274], [-0.5, .309], [-0.4, .345], [-0.3, .382], [-0.2, .421], [-0.1, .460], [0.0, .500], [0.1, .540], [0.2, .579], [0.3, .618], [0.4, .655], [0.5, .691], [0.6, .726], [0.7, .758], [0.8, .788], [0.9, .816]],
  [[1.0, .841], [1.1, .864], [1.2, .885], [1.3, .903], [1.4, .919], [1.5, .933], [1.55, .939], [1.60, .945], [1.65, .950], [1.70, .955], [1.75, .960], [1.80, .964], [1.85, .968], [1.90, .971], [1.95, .974], [2.00, .977], [2.05, .980], [2.10, .982], [2.15, .984], [2.20, .986]],
  [[2.25, .988], [2.30, .989], [2.35, .991], [2.40, .992], [2.45, .993], [2.5, .994], [2.6, .995], [2.7, .996], [2.8, .997], [2.9, .998], [3.0, .999]],
];
const NT_FLAT = NT.flat().map(([z, p], i) => ({ z, p, i }));
const zfmt = z => (Math.abs(z) < 1e-9 ? '0,0' : dec(z, Math.round(Math.abs(z) * 100) % 10 ? 2 : 1));
function normalTableHTML() {
  let k = 0;
  return `<div class="nt">${NT.map(row => {
    const start = k; k += row.length;
    return `<div class="nt-row"><table><tbody>
    <tr><th>z</th>${row.map(([z], j) => `<td data-i="${start + j}">${zfmt(z)}</td>`).join('')}</tr>
    <tr><th>P(Z&lt;z)</th>${row.map(([, p], j) => `<td data-i="${start + j}">${dec(p, 3)}</td>`).join('')}</tr></tbody></table></div>`;
  }).join('')}</div>`;
}

/* «Cuándo se usa» de cada tarjeta del formulario */
const WHEN = {
  unif: { casos: ['Un valor que puede caer en cualquier punto de [a, b] con la misma probabilidad (hora de llegada, error de redondeo).', 'P(c < X < d) se calcula como la proporción del largo del intervalo.', 'Simulación: los números aleatorios son U(0, 1).'], sig: ['igualmente probable', 'en cualquier momento entre a y b'], t: ['t41', 't61'] },
  exp: { casos: ['Duración o vida útil de una componente (Ítem V: NAC 60 h, IMP 150 h).', 'Tiempo de espera hasta la próxima llegada o falla.', 'Es la base de los sistemas en serie y en paralelo.'], sig: ['duración media de…', 'tiempo hasta la falla', 'funcione más de t horas'], t: ['t44', 't51', 't52'] },
  norm: { casos: ['Medidas con media y desviación dadas: tiempos, pesos, puntajes (Ítem IV).', '«Proporción que supera / queda bajo / está entre…» → estandarizar y leer la tabla.', '«El x% más rápido o más lento» → percentil: a = μ + σ·Φ⁻¹(p).'], sig: ['media … y desviación …', 'se comporta como normal', 'el x% más…'], t: ['t42', 't43'] },
  desc: { casos: ['Ítem II: tabla de frecuencias, histograma, resumen de 5 números y boxplot.', 'Percentil K de un conjunto de datos con la regla L = n·K/100.', 'Detectar valores anómalos con las vallas C1 − 1,5·RIQ y C3 + 1,5·RIQ.'], sig: ['tabule', 'resumen de los 5 números', 'caja y bigotes', 'anómalos'], t: ['t13', 't16', 't17'] },
  rules: { casos: ['«Al menos uno», «ninguno» o «ambos» con eventos independientes.', 'Tablas de doble entrada: probabilidad conjunta, marginal y condicional.', 'Probabilidad total y Bayes: «si falló, ¿de qué proveedor viene?».'], sig: ['al menos uno', 'entre los…', 'dado que', 'si se sabe que'], t: ['t21', 't22', 't23'] },
  count: { casos: ['Ítem III-a: elegir al azar un comando o un equipo de k personas.', 'Cualquier «casos favorables / casos totales» donde no importa el orden.'], sig: ['seleccionar al azar un comando de k', 'conformado por', 'exactamente x de…'], t: ['t24'] },
  binhip: { casos: ['Binomial: éxitos en n intentos independientes con la misma p (tiros, saltos).', 'Hipergeométrica: éxitos al elegir n sin reemplazo de un grupo de N (cadetes, lotes).'], sig: ['ronda de n tiros', 'probabilidad p de acertar', 'se eligen n de N'], t: ['t31', 't32'] },
  poisbn: { casos: ['Poisson: número de eventos en un intervalo, con una tasa promedio (Ítem III-b, misiles).', 'Binomial negativa: número de intentos hasta lograr k éxitos.'], sig: ['en promedio … por día', 'entre las … y las … hrs', 'hasta lograr'], t: ['t33', 't34'] },
  sys: { casos: ['Ítem V: componentes exponenciales conectadas en serie o en paralelo.', 'Serie: todas deben funcionar. Paralelo: basta que funcione una.', 'Comparar dos sistemas calculando su confiabilidad al mismo tiempo t.'], sig: ['en serie', 'en paralelo', 'funcione sin problema más de t'], t: ['t51', 't52', 't53'] },
};
function fCard(key, title, icon, body, official) {
  const w = WHEN[key];
  return `<article class="fcard${official ? ' off' : ''}"><header>${ic(icon)}<b>${title}</b><span class="badge">${official ? 'En la hoja del examen' : 'Memorizar'}</span></header><div class="fbody">${body}</div>
    <button type="button" class="when-btn" data-when aria-expanded="false"><span class="wb-ic">${ic('zap')}</span><span class="wb-t">Cuándo se usa</span><span class="wb-chev">${ic('chevR')}</span></button>
    <div class="when" hidden><ul>${w.casos.map(c => `<li>${ic('check')}<span>${c}</span></li>`).join('')}</ul>
      <div class="when-sig"><span class="sig-l">${ic('search')}Señales</span>${w.sig.map(s => `<span class="sig">«${s}»</span>`).join('')}</div>
      <div class="when-links">${w.t.map(id => `<button type="button" class="chip c-${TOPIC[id].unit.color}" data-topic="${id}">${ic(TOPIC[id].icon)}${TOPIC[id].map}</button>`).join('')}</div></div>
  </article>`;
}

/* Buscador rápido de la tabla normal: z → Φ(z) o probabilidad → z, con interpolación */
let nfMode = 'z';
function nfFind() {
  const inp = $('#nf-in', shBody), out = $('#nf-out', shBody);
  $$('.nt td.find', shBody).forEach(c => c.classList.remove('find'));
  const r = parseNum(inp.value, false);
  if (r.empty) { out.innerHTML = nfMode === 'z' ? 'Escribe un z, por ejemplo <b>1,5</b>' : 'Escribe una probabilidad, por ejemplo <b>0,15</b>'; return; }
  if (r.invalid) { out.innerHTML = 'Número no válido'; return; }
  const v = r.pct ? r.v / 100 : r.v, key = nfMode, other = nfMode === 'z' ? 'p' : 'z', F = NT_FLAT;
  const mark = list => {
    list.forEach(e => $$(`.nt td[data-i="${e.i}"]`, shBody).forEach(c => c.classList.add('find')));
    const first = $(`.nt td[data-i="${list[0].i}"]`, shBody);
    if (first) first.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  const show = e => (nfMode === 'z' ? `Φ(${zfmt(e.z)}) = <b>${dec(e.p, 3)}</b> · P(Z &gt; ${zfmt(e.z)}) = ${dec(1 - e.p, 3)}` : `P = ${dec(e.p, 3)} → z = <b>${zfmt(e.z)}</b>`);
  if (nfMode === 'p' && (v <= 0 || v >= 1)) { out.innerHTML = 'Una probabilidad va entre 0 y 1 (o escribe 15%)'; return; }
  if (v <= F[0][key]) { mark([F[0]]); out.innerHTML = `Fuera de la tabla (extremo inferior): ${show(F[0])}`; return; }
  if (v >= F.at(-1)[key]) { mark([F.at(-1)]); out.innerHTML = `Fuera de la tabla (extremo superior): ${show(F.at(-1))}`; return; }
  const exact = F.filter(e => Math.abs(e[key] - v) < 1e-9);
  if (exact.length) { mark(exact); out.innerHTML = exact.map(show).join(' · o bien '); return; }
  const j = F.findIndex((e, i) => i < F.length - 1 && e[key] < v && F.at(i + 1)[key] > v);
  if (j < 0) { out.innerHTML = 'No encontrado'; return; }
  const a = F.at(j), b = F.at(j + 1), est = a[other] + (v - a[key]) / (b[key] - a[key]) * (b[other] - a[other]);
  mark([a, b]);
  out.innerHTML = nfMode === 'z'
    ? `${zfmt(v)} está entre ${zfmt(a.z)} (${dec(a.p, 3)}) y ${zfmt(b.z)} (${dec(b.p, 3)}) → Φ ≈ <b>${dec(est, 3)}</b> · P(Z &gt; z) ≈ ${dec(1 - est, 3)}`
    : `${dec(v, 3)} está entre ${dec(a.p, 3)} (z = ${zfmt(a.z)}) y ${dec(b.p, 3)} (z = ${zfmt(b.z)}) → z ≈ <b>${dec(est, 2)}</b>`;
}

function renderFormulario() {
  shBody.innerHTML = `
  <p class="sh-lead">${ic('info')}<span>La hoja de la sustitutiva trae <b>Uniforme, Exponencial, Normal y la tabla normal</b> (tarjetas verdes). El resto no aparece en la hoja que vimos: conviene <b>memorizarlo</b>. Toca <b>«Cuándo se usa»</b> en cada tarjeta para saber en qué preguntas aplicarla.</span></p>
  <div class="fgrid">
    ${fCard('unif', 'Distribución Uniforme', 'square', `${eq(`f(x) = ${fr(1, 'b − a')},  a < x < b`)}${eq(`F(x) = ${fr('x − a', 'b − a')}`)}${eq(`E(X) = ${fr('a + b', 2)}    V(X) = ${fr('(b − a)²', 12)}`)}`, 1)}
    ${fCard('exp', 'Distribución Exponencial', 'hourglass', `${eq(`f(x) = λ${ex('e', '−λx')},  x > 0`)}${eq(`F(x) = 1 − ${ex('e', '−λx')}`)}${eq(`E(X) = ${fr(1, 'λ')}    V(X) = ${fr(1, 'λ²')}`)}<p class="fnote">P(X &gt; t) = ${ex('e', '−λt')} · λ = 1/media</p>`, 1)}
    ${fCard('norm', 'Distribución Normal', 'bell', `${eq(`P(X < x) = P(Z < ${fr('x − μ', 'σ')})`)}<p class="fnote">Z normal estándar (media 0, varianza 1) → tabla.</p>${eq('Si P(X < a) = p  →  a = μ + σ·Φ⁻¹(p)')}<p class="fnote">Φ⁻¹(p): buscar en la tabla el z tal que P(Z &lt; z) = p.</p>`, 1)}
    ${fCard('desc', 'Descriptiva', 'chart', `<ol class="fol"><li>Ordenar los datos.</li><li>L = n·K/100.</li><li>¿L entero? Sí → promedio de posiciones L y L+1. No → subir al entero siguiente.</li></ol><p class="fnote">5 números: Mín &lt; C1 &lt; Me &lt; C3 &lt; Máx · RIQ = C3 − C1</p><p class="fnote">Anómalo si obs &lt; C1 − 1,5·RIQ o obs &gt; C3 + 1,5·RIQ</p>${eq(`x̄ = ${fr('Σx', 'n')}    s² = ${fr('Σ(x − x̄)²', 'n − 1')}`)}`)}
    ${fCard('rules', 'Reglas de probabilidad', 'venn', `${eq('P(Aᶜ) = 1 − P(A)')}${eq('P(A ∪ B) = P(A) + P(B) − P(A ∩ B)')}${eq(`P(A | B) = ${fr('P(A ∩ B)', 'P(B)')}`)}${eq('P(A ∩ B) = P(A | B)·P(B)')}${eq('P(B) = Σ P(B | Aᵢ)·P(Aᵢ)')}`)}
    ${fCard('count', 'Conteo', 'combo', `${eq(`${bn('n', 'k')} = ${fr('n!', 'k!·(n − k)!')}`)}<p class="fnote">P = casos favorables / casos totales · calculadora: nCr</p>`)}
    ${fCard('binhip', 'Binomial · Hipergeométrica', 'crosshair', `${eq(`Bin: ${bn('n', 'k')}${ex('p', 'k')}${ex('(1 − p)', 'n − k')}`)}<p class="fnote">E = np · V = np(1 − p)</p>${eq(`Hiper: ${fr(`${bn('K', 'k')}${bn('N − K', 'n − k')}`, bn('N', 'n'))}`)}<p class="fnote">E = nK/N</p>`)}
    ${fCard('poisbn', 'Poisson · Binomial negativa', 'burst', `${eq(`Poisson: ${fr(`${ex('e', '−λ')}${ex('λ', 'k')}`, 'k!')}`)}<p class="fnote">λ = tasa × largo del intervalo · E = V = λ</p>${eq(`BN: ${bn('x − 1', 'k − 1')}${ex('p', 'k')}${ex('(1 − p)', 'x − k')}`)}<p class="fnote">E = k/p</p>`)}
    ${fCard('sys', 'Sistemas', 'network', `${eq('Serie: R = R₁·R₂·…·Rₙ')}${eq('Paralelo: R = 1 − (1 − R₁)(1 − R₂)…')}<p class="fnote">Con exponencial: Rᵢ = ${ex('e', '−t/μᵢ')}</p>`)}
  </div>
  <div class="nt-head">
    <h3 class="sh-h nt-title">${ic('table')}<span>Tabla Normal estándar <span class="nt-f">→ P(Z &lt; z) = Φ(z)</span><small>Los mismos valores que trae el examen</small></span></h3>
    <div class="nt-find" role="search" aria-label="Buscador rápido de la tabla normal">
      <span class="nf-l">${ic('search')}Buscar rápido</span>
      <div class="nf-seg" role="group" aria-label="Qué buscar"><button type="button" class="on" data-nf="z">z → Φ(z)</button><button type="button" data-nf="p">Prob. → z</button></div>
      <input type="text" inputmode="decimal" id="nf-in" autocomplete="off" spellcheck="false" placeholder="ej: 1,5" aria-label="Valor a buscar">
      <output id="nf-out" class="nf-out" aria-live="polite"></output>
    </div>
  </div>
  ${normalTableHTML()}
  <div class="howto">
    <div><b>Leer «menos de»</b><span>P(Z &lt; 1,5) = 0,933 → se lee directo.</span></div>
    <div><b>Leer «más de»</b><span>P(Z &gt; 1,5) = 1 − 0,933 = 0,067.</span></div>
    <div><b>Al revés (percentil)</b><span>p = 0,15 → buscar 0,15 <u>en la fila P(Z&lt;z)</u>: está entre 0,136 (z = −1,1) y 0,159 (z = −1,0) → z ≈ −1,04.</span></div>
  </div>`;
  $$('.nt td', shBody).forEach(td => {
    td.addEventListener('mouseenter', () => { const i = td.cellIndex; td.closest('table').querySelectorAll('tr').forEach(tr => tr.cells[i].classList.add('hl')); });
    td.addEventListener('mouseleave', () => { td.closest('table').querySelectorAll('.hl').forEach(c => c.classList.remove('hl')); });
  });
  nfMode = 'z';
  nfFind();
  $('#nf-in', shBody).addEventListener('input', nfFind);
  shBody.onclick = ev => {
    const seg = ev.target.closest('[data-nf]');
    if (seg) {
      nfMode = seg.dataset.nf;
      $$('[data-nf]', shBody).forEach(b => b.classList.toggle('on', b === seg));
      const inp = $('#nf-in', shBody); inp.placeholder = nfMode === 'z' ? 'ej: 1,5' : 'ej: 0,15'; inp.value = ''; inp.focus(); nfFind();
      return;
    }
    const w = ev.target.closest('[data-when]');
    if (w) {
      const panel = w.nextElementSibling, open = panel.hidden;
      panel.hidden = !open; w.setAttribute('aria-expanded', open); w.classList.toggle('on', open);
      $('.wb-t', w).textContent = open ? 'Ocultar' : 'Cuándo se usa';
    }
  };
}

/* =====================================================================
   ¿QUÉ DISTRIBUCIÓN USO?
   ===================================================================== */
const DT = {
  start: { q: '¿Qué describe la variable aleatoria del problema?', o: [
    { t: 'Un <b>conteo</b>: 0, 1, 2, 3… (aciertos, misiles, mujeres, fallas)', i: 'hash', go: 'cnt' },
    { t: 'Una <b>medida continua</b>: tiempo, peso, duración', i: 'bell', go: 'cont' }] },
  cnt: { q: '¿Qué estás contando?', o: [
    { t: 'Eventos que ocurren en un <b>intervalo de tiempo</b> a una tasa promedio («14 misiles al día», «3 fallas por semana»)', i: 'burst', go: 'R:pois' },
    { t: 'Éxitos dentro de un número <b>fijo n</b> de intentos o de seleccionados', i: 'target', go: 'fix' },
    { t: 'Intentos necesarios <b>hasta lograr</b> k éxitos', i: 'repeat', go: 'R:bn' }] },
  fix: { q: '¿Cómo se obtienen esos n?', o: [
    { t: 'Ensayos <b>independientes</b> con la misma probabilidad p (tiros, saltos, con reemplazo)', i: 'crosshair', go: 'R:bin' },
    { t: 'Se eligen <b>sin reemplazo</b> de un grupo finito con N y K conocidos (cadetes de un curso, radios de un lote)', i: 'urn', go: 'R:hip' }] },
  cont: { q: '¿Qué información te dan?', o: [
    { t: '<b>Media y desviación estándar</b>, «se comporta como una normal»', i: 'bell', go: 'R:norm' },
    { t: 'Una <b>duración media</b> o tiempo hasta una falla/llegada («duración media de 60 h»)', i: 'hourglass', go: 'R:exp' },
    { t: 'Un intervalo [a, b] donde todos los valores son <b>igual de probables</b>', i: 'square', go: 'R:unif' }] },
};
const DIST = {
  bin: { n: 'Binomial', i: 'crosshair', t: 't31', f: `P(X = k) = ${bn('n', 'k')}${ex('p', 'k')}${ex('(1 − p)', 'n − k')}`, par: 'n = nº de intentos · p = probabilidad de éxito', use: 'Cuenta éxitos en n intentos fijos e independientes', ask: '¿Cuántos de los n salen bien?', sig: ['ronda de n tiros', 'probabilidad p de acertar', 'de n, ¿cuántos…?'], ej: 'Aciertos en una ronda de 8 tiros con p = 0,7', trap: 'Si los elegidos salen de un grupo pequeño sin reemplazo, NO es binomial: es hipergeométrica.' },
  hip: { n: 'Hipergeométrica', i: 'urn', t: 't32', f: `P(X = k) = ${fr(`${bn('K', 'k')}${bn('N − K', 'n − k')}`, bn('N', 'n'))}`, par: 'N total · K éxitos · n elegidos · k pedidos', use: 'Cuenta éxitos al elegir n sin reemplazo de un grupo finito', ask: '¿Cuántos del grupo elegido tienen la característica?', sig: ['se eligen al azar n de N', 'comando / equipo / muestra de un lote', 'K de ellos son…'], ej: 'Sustitutiva III-a: mujeres en un comando de 5 (de 30)', trap: 'Nunca uses Z = (x − μ)/σ para contar personas: es favorables / totales.' },
  pois: { n: 'Poisson', i: 'burst', t: 't33', f: `P(X = k) = ${fr(`${ex('e', '−λ')}${ex('λ', 'k')}`, 'k!')}`, par: 'λ = tasa × largo del intervalo pedido', use: 'Cuenta eventos en un intervalo de tiempo, a una tasa', ask: '¿Cuántos eventos ocurren en este lapso?', sig: ['en promedio … por día / hora', 'entre las … y las … hrs', 'proceso Poisson'], ej: 'Sustitutiva III-b: 14 misiles/24 h → entre 12 y 16 h, λ = 2,33', trap: 'Ajusta λ al intervalo que preguntan: no uses la tasa diaria si piden 4 horas.' },
  bn: { n: 'Binomial negativa', i: 'repeat', t: 't34', f: `P(X = x) = ${bn('x − 1', 'k − 1')}${ex('p', 'k')}${ex('(1 − p)', 'x − k')}`, par: 'k = éxitos buscados · p · x = ensayo del k-ésimo éxito', use: 'Cuenta intentos hasta lograr k éxitos', ask: '¿En qué intento llega el k-ésimo éxito?', sig: ['hasta lograr', 'hasta el primer / tercer…', 'número de intentos necesarios'], ej: 'Tiros hasta el 3er acierto', trap: 'El último ensayo siempre es un éxito.' },
  norm: { n: 'Normal', i: 'bell', t: 't42', f: `Z = ${fr('X − μ', 'σ')}  →  tabla Φ(z)`, par: 'μ = media · σ = desviación estándar', use: 'Mide valores con forma de campana (media y desviación)', ask: '¿Qué proporción supera, queda bajo o entre…? ¿Qué valor deja el x%?', sig: ['media … y desviación …', 'se comporta como normal', 'el x% más…'], ej: 'Sustitutiva IV: tiempos N(26, 2²)', trap: '«Más de» = 1 − Φ(z). Para percentiles busca p dentro de la tabla.' },
  exp: { n: 'Exponencial', i: 'hourglass', t: 't44', f: `P(X > t) = ${ex('e', '−t/μ')}`, par: 'λ = 1/media', use: 'Mide tiempos de vida o de espera', ask: '¿Qué probabilidad hay de que dure más de t?', sig: ['duración media de', 'tiempo hasta la falla', 'funcione más de t horas'], ej: 'Sustitutiva V: componentes NAC (60 h) e IMP (150 h)', trap: 'λ no es la media: λ = 1/μ. Con varias componentes, revisa si están en serie o en paralelo.' },
  unif: { n: 'Uniforme', i: 'square', t: 't41', f: `P(c < X < d) = ${fr('d − c', 'b − a')}`, par: 'a, b = extremos del intervalo', use: 'Mide un valor igual de probable en todo [a, b]', ask: '¿Qué parte del intervalo cae en el tramo pedido?', sig: ['igualmente probable', 'en cualquier momento entre a y b'], ej: 'Llegada del bus entre 10 y 30 min', trap: 'P(X = c) = 0 en toda continua.' },
};
const DORDER = ['bin', 'hip', 'pois', 'bn', 'norm', 'exp', 'unif'];
const RULE = {
  bin: 'n fijo de intentos independientes con la misma p → Binomial',
  hip: 'se eligen n sin reemplazo de un grupo finito → Hipergeométrica',
  pois: 'eventos en un intervalo de tiempo a una tasa promedio → Poisson',
  bn: 'se cuentan intentos hasta lograr k éxitos → Binomial negativa',
  norm: 'una medida con media y desviación (campana) → Normal',
  exp: 'un tiempo de vida o de espera con duración media → Exponencial',
  unif: 'cualquier valor del intervalo es igual de probable → Uniforme',
};
/* 20 casos; `clue` es el trozo exacto del enunciado que delata el modelo */
const CASES = [
  { q: 'Número de aciertos en una ronda de 10 tiros, si cada tiro acierta con probabilidad 0,6.', k: 'bin', clue: 'una ronda de 10 tiros' },
  { q: 'Número de misiles que caen sobre Kiev entre las 12:00 y las 16:00, si en promedio caen 14 al día.', k: 'pois', clue: 'en promedio caen 14 al día' },
  { q: 'Número de mujeres en un comando de 5 cadetes elegido al azar de un curso de 30 (6 mujeres).', k: 'hip', clue: 'elegido al azar de un curso de 30' },
  { q: 'Tiempo que tarda un cadete en el cuarto control, con media 26 min y desviación 2 min.', k: 'norm', clue: 'con media 26 min y desviación 2 min' },
  { q: 'Duración de una componente nacional cuya duración media es de 60 horas.', k: 'exp', clue: 'duración media es de 60 horas' },
  { q: 'Número de tiros necesarios hasta lograr el tercer acierto.', k: 'bn', clue: 'hasta lograr el tercer acierto' },
  { q: 'Minuto en que llega el bus de enlace, igualmente probable entre los 10 y los 30 minutos.', k: 'unif', clue: 'igualmente probable entre los 10 y los 30 minutos' },
  { q: 'Número de radios defectuosas en una muestra de 4 tomada de un lote de 12 que tiene 3 defectuosas.', k: 'hip', clue: 'una muestra de 4 tomada de un lote de 12' },
  { q: 'Número de fallas de un equipo de comunicaciones en 2 días, si falla en promedio 3 veces por semana.', k: 'pois', clue: 'en promedio 3 veces por semana' },
  { q: 'Peso de las mochilas en campaña, con media 26 kg y desviación 2 kg.', k: 'norm', clue: 'con media 26 kg y desviación 2 kg' },
  { q: 'De 12 paracaidistas que saltan, número que aterriza en la zona, si cada uno lo logra con probabilidad 0,9.', k: 'bin', clue: 'De 12 paracaidistas que saltan' },
  { q: 'Tiempo hasta que falla un equipo de telecomunicaciones que funciona en promedio 12 minutos sin fallar.', k: 'exp', clue: 'Tiempo hasta que falla' },
  { q: 'Número de bombas que caen sobre Róterdam en media hora, si cayeron 57 en 24 horas.', k: 'pois', clue: 'cayeron 57 en 24 horas' },
  { q: 'Número de cadetes de regiones en un comando de 10 elegido de una compañía de 140 (35 son de regiones).', k: 'hip', clue: 'elegido de una compañía de 140' },
  { q: 'Número de intentos de enlace radial hasta conseguir la primera conexión, si cada intento funciona con p = 0,4.', k: 'bn', clue: 'hasta conseguir la primera conexión' },
  { q: 'Puntaje de un postulante en la prueba de admisión, con media 500 y desviación 110.', k: 'norm', clue: 'con media 500 y desviación 110' },
  { q: 'Entre 5 padres elegidos al azar de los 201 encuestados (114 asistieron y son de familia militar), número que asistió y es de familia militar.', k: 'hip', clue: 'elegidos al azar de los 201 encuestados' },
  { q: 'Tiempo de espera hasta el próximo vehículo en un control de ruta, si pasa uno cada 10 minutos en promedio.', k: 'exp', clue: 'Tiempo de espera hasta el próximo vehículo' },
  { q: 'De 8 cadetes que rinden la prueba física, número que aprueba, si cada uno aprueba con probabilidad 0,75 de forma independiente.', k: 'bin', clue: 'cada uno aprueba con probabilidad 0,75 de forma independiente' },
  { q: 'Error al medir una distancia redondeando al metro: cualquier valor entre −0,5 y 0,5 m es igual de probable.', k: 'unif', clue: 'cualquier valor entre −0,5 y 0,5 m es igual de probable' },
];

/* Mini-gráfica de la forma de cada distribución */
function svgMini(k) {
  const W = 140, H = 56, base = 48, top = 10;
  const ax = `<line class="mn-ax" x1="4" x2="${W - 4}" y1="${base}" y2="${base}"/>`;
  if (k in { bin: 1, hip: 1, pois: 1, bn: 1 }) {
    const p = { bin: PMF.bin.p, hip: PMF.hip.p, pois: PMF.poi.p, bn: PMF.bn.p }[k], mx = Math.max(...p), bw = (W - 16) / p.length;
    return `<svg class="mini" viewBox="0 0 ${W} ${H}" aria-hidden="true">${p.map((v, i) => `<rect x="${(8 + i * bw + 1.5).toFixed(1)}" y="${(base - v / mx * (base - top)).toFixed(1)}" width="${(bw - 3).toFixed(1)}" height="${(v / mx * (base - top)).toFixed(1)}" rx="1.5"/>`).join('')}${ax}</svg>`;
  }
  let d = '';
  if (k === 'unif') d = `M26 ${base}V${top + 12}H${W - 26}V${base}Z`;
  else {
    for (let i = 0; i <= 60; i++) {
      const x = k === 'norm' ? -3.2 + 6.4 * i / 60 : 4 * i / 60, y = k === 'norm' ? Math.exp(-x * x / 2) : Math.exp(-1.2 * x);
      d += (i ? 'L' : 'M') + (8 + i / 60 * (W - 16)).toFixed(1) + ' ' + (base - y * (base - top)).toFixed(1);
    }
    d += `L${W - 8} ${base}L8 ${base}Z`;
  }
  return `<svg class="mini" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="${d}"/>${ax}</svg>`;
}

let dtPath = [], dtStep = 0, Q = null;
const nextBtn = (i, t) => `<div class="dt-next"><button type="button" class="btn pri" data-step-go="${i}">${t}${ic('arrowR')}</button></div>`;
function renderDecision() {
  const steps = [['book', 'Aprende', 'para qué sirve cada una'], ['compass', 'Decide', 'con el árbol de 2 preguntas'], ['target', 'Practica', `${CASES.length} casos del curso`]];
  shBody.innerHTML = `<div class="gsteps" role="tablist">${steps.map((s, i) => `<button type="button" class="gstep" role="tab" data-step="${i}"><span class="gs-n">${i + 1}</span><span class="gs-ic">${ic(s[0])}</span><span class="gs-t"><b>${s[1]}</b><small>${s[2]}</small></span></button>`).join('<span class="gs-line" aria-hidden="true"></span>')}</div><div id="dt-pane"></div>`;
  shBody.onclick = ev => {
    const b = ev.target.closest('[data-step], [data-step-go]');
    if (b) goStep(Number(b.dataset.step ?? b.dataset.stepGo));
  };
  goStep(0);
}
function goStep(i) {
  dtStep = i;
  $$('.gstep', shBody).forEach((b, j) => { b.classList.toggle('on', j === i); b.classList.toggle('past', j < i); b.setAttribute('aria-selected', j === i); });
  if (i === 0) drawLearn();
  else if (i === 1) { dtPath = ['start']; drawDT(); }
  else startQuiz();
  shBody.scrollTop = 0;
}

/* Paso 1: para qué sirve cada distribución */
function drawLearn() {
  const grp = (title, icon, keys) => `<h3 class="lg-h">${ic(icon)}${title}</h3><div class="dcards">${keys.map(k => {
    const d = DIST[k];
    return `<article class="dcard"><header><span class="dc-ic">${ic(d.i)}</span><div><b>${d.n}</b><small>${d.use}</small></div></header>${svgMini(k)}
      <p class="dc-ask">${ic('question')}<span>${d.ask}</span></p><div class="dc-sig">${d.sig.map(s => `<span>«${s}»</span>`).join('')}</div>
      <p class="dc-ej">${ic('flag')}<span>${d.ej}</span></p><button type="button" class="lnk" data-topic="${d.t}">Ver la lección →</button></article>`;
  }).join('')}</div>`;
  const pane = $('#dt-pane');
  pane.onclick = null;
  pane.innerHTML = `<p class="sh-lead">${ic('info')}<span>Reconocer el modelo es la mitad del Ítem III y varias preguntas del Ítem I. La primera pregunta siempre es: <b>¿estoy contando o estoy midiendo?</b></span></p>`
    + grp('Si CUENTAS (0, 1, 2…)', 'hash', ['bin', 'hip', 'pois', 'bn'])
    + grp('Si MIDES (tiempo, peso, duración…)', 'bell', ['norm', 'exp', 'unif'])
    + nextBtn(1, 'Paso 2: decide con el árbol');
}

/* Paso 2: árbol de decisión */
function drawDT() {
  const pane = $('#dt-pane'), last = dtPath.at(-1);
  const crumbs = `<div class="dt-crumbs">${dtPath.map((p, i) => `<button type="button" class="crumb" data-back="${i}">${i === 0 ? 'Inicio' : (p.startsWith('R:') ? DIST[p.slice(2)].n : DT[p].q.replace(/<[^>]+>/g, '').slice(0, 26) + '…')}</button>`).join(`<span>${ic('chevR')}</span>`)}</div>`;
  if (last.startsWith('R:')) {
    const d = DIST[last.slice(2)];
    pane.innerHTML = crumbs + `<div class="dt-res"><div class="dt-res-h"><span class="dt-big">${ic(d.i)}</span><div><small>Usa la distribución</small><h3>${d.n}</h3></div>${svgMini(last.slice(2))}</div>
      ${eq(d.f)}<dl><dt>Sirve para</dt><dd>${d.use}</dd><dt>Parámetros</dt><dd>${d.par}</dd><dt>Ejemplo del curso</dt><dd>${d.ej}</dd><dt>${ic('alert')}Trampa típica</dt><dd>${d.trap}</dd></dl>
      <div class="dt-acts"><button type="button" class="btn gh" data-topic="${d.t}">${ic('book')}Ir a la lección</button><button type="button" class="btn gh" data-back="0">${ic('refresh')}Probar otro camino</button></div></div>` + nextBtn(2, `Paso 3: practica con ${CASES.length} casos`);
  } else {
    const n = DT[last];
    pane.innerHTML = crumbs + `<div class="dt-q"><h3>${n.q}</h3><div class="dt-opts">${n.o.map(o => `<button type="button" class="dt-opt" data-go="${o.go}"><span class="dt-oi">${ic(o.i)}</span><span>${o.t}</span>${ic('chevR')}</button>`).join('')}</div></div>`;
  }
  pane.onclick = ev => {
    const g = ev.target.closest('[data-go]'); if (g) { dtPath.push(g.dataset.go); drawDT(); return; }
    const b = ev.target.closest('[data-back]'); if (b) { dtPath = dtPath.slice(0, Number(b.dataset.back) + 1); drawDT(); }
  };
}

/* Paso 3: práctica de a un caso, con puntaje */
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function startQuiz(only) {
  Q = { order: shuffle(only || CASES.map((_, i) => i)), i: 0, ok: 0, bad: 0, miss: [], answered: false, full: !only };
  drawCase();
}
function drawCase() {
  const pane = $('#dt-pane');
  if (Q.i >= Q.order.length) { drawQuizEnd(); return; }
  const c = CASES[Q.order.at(Q.i)], n = Q.order.length;
  Q.answered = false;
  pane.innerHTML = `<div class="qz-top"><div class="qz-prog"><span>Caso ${Q.i + 1} de ${n}</span><div class="qz-bar"><i style="width:${(Q.i / n * 100).toFixed(1)}%"></i></div></div>
      <div class="qz-sc"><span class="ok">${ic('check')}<b id="qz-ok">${Q.ok}</b></span><span class="bad">${ic('x')}<b id="qz-bad">${Q.bad}</b></span></div></div>
    <article class="qz-card"><p class="qz-q">${c.q}</p><p class="qz-ask">¿Qué distribución modela esta variable? <small>(teclas 1–7)</small></p>
      <div class="qz-grid">${DORDER.map((k, j) => `<button type="button" class="qz-opt" data-k="${k}"><span class="qz-key">${j + 1}</span>${ic(DIST[k].i)}<span>${DIST[k].n}</span></button>`).join('')}</div>
      <div id="qz-fb"></div></article>`;
  pane.onclick = ev => {
    const b = ev.target.closest('[data-k]'); if (b && !Q.answered) { answerCase(b.dataset.k); return; }
    if (ev.target.closest('[data-next]')) { Q.i++; drawCase(); }
  };
}
function answerCase(k) {
  const c = CASES[Q.order.at(Q.i)], right = k === c.k;
  Q.answered = true;
  if (right) Q.ok++; else { Q.bad++; Q.miss.push(Q.order.at(Q.i)); }
  $('#qz-ok').textContent = Q.ok; $('#qz-bad').textContent = Q.bad;
  $$('.qz-opt', shBody).forEach(b => { b.disabled = true; if (b.dataset.k === c.k) b.classList.add('right'); else if (b.dataset.k === k) b.classList.add('wrong'); });
  $('.qz-q', shBody).innerHTML = c.q.replace(c.clue, `<mark>${c.clue}</mark>`);
  $('#qz-fb').innerHTML = `<div class="fb ${right ? 'ok' : 'bad'}">${ic(right ? 'check' : 'x')}<span><b>${right ? '¡Correcto!' : `Era ${DIST[c.k].n}.`}</b> Señal: «${c.clue}»: ${RULE[c.k]}.</span></div>
    <div class="qz-acts"><button type="button" class="btn pri" data-next>${Q.i + 1 < Q.order.length ? 'Siguiente caso' : 'Ver resultado'}${ic('arrowR')}</button><button type="button" class="btn gh" data-topic="${DIST[c.k].t}">${ic('book')}Repasar ${DIST[c.k].n}</button></div>`;
  const nb = $('[data-next]', shBody); if (nb) nb.focus({ preventScroll: true });
}
function drawQuizEnd() {
  const pane = $('#dt-pane'), n = Q.order.length, pct = Q.ok / n;
  if (Q.full) { S.qbest = Math.max(S.qbest || 0, Q.ok); save(); }
  const msg = pct === 1 ? '¡Perfecto! Ya distingues todos los modelos.' : pct >= 0.8 ? 'Muy bien. Repasa las que fallaste y vuelve a intentarlo.' : 'Sigue practicando: vuelve al paso 1, revisa las tarjetas y repite.';
  pane.innerHTML = `<div class="qz-end"><div class="sr-nota ${pct >= 0.8 ? 'ok' : 'bad'}"><small>Aciertos</small><b>${Q.ok}/${n}</b></div><div><h3>${msg}</h3><p>Mejor puntaje en la serie completa: <b>${S.qbest ?? 0}/${CASES.length}</b></p></div></div>
    ${Q.miss.length ? `<h4 class="lg-h">${ic('alert')}Para repasar</h4><ul class="qz-miss">${Q.miss.map(i => `<li><span>${CASES[i].q.replace(CASES[i].clue, `<mark>${CASES[i].clue}</mark>`)}</span><b>${ic(DIST[CASES[i].k].i)}${DIST[CASES[i].k].n}</b></li>`).join('')}</ul>` : ''}
    <div class="qz-acts">${Q.miss.length ? `<button type="button" class="btn pri" data-retry>${ic('refresh')}${Q.miss.length === 1 ? 'Repetir la fallada' : `Repetir las ${Q.miss.length} falladas`}</button>` : ''}<button type="button" class="btn gh" data-again>${ic('shuffle')}Nueva ronda de ${CASES.length} casos</button></div>`;
  pane.onclick = ev => {
    if (ev.target.closest('[data-retry]')) startQuiz([...Q.miss]);
    else if (ev.target.closest('[data-again]')) startQuiz();
  };
}
document.addEventListener('keydown', ev => {
  if (sheet.hidden || sheet.dataset.kind !== 'decision' || dtStep !== 2 || !Q || Q.answered || Q.i >= Q.order.length) return;
  if (/^[1-7]$/.test(ev.key) && !ev.target.matches('input, select, textarea')) { ev.preventDefault(); answerCase(DORDER.at(Number(ev.key) - 1)); }
});

/* =====================================================================
   SIMULACRO (Sustitutiva 2026)
   ===================================================================== */
const SIM = [
  { it: 'I', title: 'Ítem I · Conocimiento', pts: 5, note: 'Las fotos no muestran este ítem: estas 5 preguntas de selección única siguen el estilo del curso (1 punto c/u).', qs: [
    { id: 'I1', pts: 1, q: 'El número de misiles que caen sobre Kiev en 4 horas es una variable:', f: [fS('Respuesta', ['Cualitativa ordinal', 'Cuantitativa continua', 'Cuantitativa discreta', 'Cualitativa nominal'], 2)], sol: ['Se cuenta (0, 1, 2…) → cuantitativa discreta.'] },
    { id: 'I2', pts: 1, q: 'Una distribución asimétrica a la derecha se caracteriza porque:', f: [fS('Respuesta', ['La cola está a la izquierda y la media < mediana', 'La cola está a la derecha y la media > mediana', 'La media es igual a la mediana', 'La barra más alta está a la derecha'], 1)], sol: ['Se nombra por la cola; los valores altos «arrastran» la media hacia arriba.'] },
    { id: 'I3', pts: 1, q: 'El tiempo hasta la falla de una componente electrónica se modela típicamente con la distribución:', f: [fS('Respuesta', ['Binomial', 'Poisson', 'Exponencial', 'Hipergeométrica'], 2)], sol: ['Tiempos de vida / hasta la falla → exponencial.'] },
    { id: 'I4', pts: 1, q: 'En un gráfico de caja y bigotes, la caja contiene:', f: [fS('Respuesta', ['El 25% de los datos', 'El 50% central de los datos (entre C1 y C3)', 'Todos los datos no anómalos', 'Solo la mediana'], 1)], sol: ['La caja va de C1 (25%) a C3 (75%) → el 50% central.'] },
    { id: 'I5', pts: 1, q: 'Al seleccionar sin reemplazo 5 cadetes de un curso de 30 (6 mujeres), el número de mujeres seleccionadas sigue una distribución:', f: [fS('Respuesta', ['Binomial', 'Poisson', 'Hipergeométrica', 'Normal'], 2)], sol: ['Población finita, sin reemplazo → hipergeométrica.'] },
  ] },
  { it: 'II', title: 'Ítem II · Comprensión', pts: 7, intro: `Los siguientes datos corresponden a los rendimientos (puntaje entre 0 y 100) de 13 cadetes en el pentatlón: ${dataRow(D_SUST)}`, qs: [
    { id: 'IIa', pts: 1, q: 'a) Basado en la siguiente categorización (40 a 59 · 60 a 79 · 80 a 99), obtenga la tabla de frecuencias (casos y porcentajes).', f: [fN('Frecuencia 40–59', 4, 0), fN('Frecuencia 60–79', 6, 0), fN('Frecuencia 80–99', 3, 0), fN('% 40–59', 30.8, 0.15), fN('% 60–79', 46.2, 0.15), fN('% 80–99', 23.1, 0.15)], sol: ['Ordenados: 44 48 52 58 | 62 65 67 76 78 79 | 84 96 98.', 'f = 4, 6, 3 → 30,8% · 46,2% · 23,1%.'] },
    { id: 'IIb', pts: 2, q: 'b) Bosqueje el histograma y, basado en éste, ¿la distribución es simétrica o asimétrica? En caso de ser asimétrica, indique si es a la derecha o a la izquierda. <span class="sim-live-note">(El histograma se dibuja con tus frecuencias de a.)</span>', live: 'hist', f: [fS('En relación a la asimetría, la distribución es', ASIM, 0)], sol: ['Pico al centro (6) y lados parecidos (4 y 3) → <b>simétrica</b>. Media 69,8 ≈ mediana 67.'] },
    { id: 'IIc', pts: 2, q: 'c) Obtenga el resumen de los 5 números.', f: [fN('Mín', 44, 0.01), fN('C1', 58, 0.01), fN('Mediana', 67, 0.01), fN('C3', 79, 0.01), fN('Máx', 98, 0.01)], sol: ['n = 13: C1 → L = 3,25 → pos. 4 = 58 · Me → L = 6,5 → pos. 7 = 67 · C3 → L = 9,75 → pos. 10 = 79.'] },
    { id: 'IId', pts: 2, q: 'd) Bosqueje el gráfico de caja y línea (cajón con bigotes) e indique si existen valores anómalos. <span class="sim-live-note">(El boxplot se dibuja con tus valores de c y d.)</span>', live: 'box', f: [fN('RIQ', 21, 0.01), fN('LI = C1 − 1,5·RIQ', 26.5, 0.01), fN('LS = C3 + 1,5·RIQ', 110.5, 0.01), fS('Valores anómalos', ['No existen', 'Sí: 98', 'Sí: 44', 'Sí: 96 y 98'], 0)], sol: ['RIQ = 79 − 58 = 21 → LI = 26,5 · LS = 110,5.', 'Ningún dato queda fuera → no hay anómalos.'] },
  ] },
  { it: 'III', title: 'Ítem III · Aplicación', pts: 4, intro: 'Usando propiedades de probabilidad, conteo y distribuciones de probabilidad, responda (resultados con tres decimales, redondeados).', qs: [
    { id: 'IIIa', pts: 2, q: 'a) Si el curso tiene 30 cadetes, 24 de sexo masculino y 6 de sexo femenino, determine la probabilidad de que al seleccionar al azar un comando de 5 cadetes, este quede conformado por tres mujeres y dos hombres.', f: [fN('Casos totales', 142506, 0), fN('Casos favorables', 5520, 0), fP('Probabilidad', 0.039, 0.001)], sol: [`Totales: ${bn(30, 5)} = 142.506.`, `Favorables: ${bn(6, 3)}·${bn(24, 2)} = 20·276 = 5.520.`, 'P = 5.520/142.506 = 0,039.'] },
    { id: 'IIIb', pts: 2, q: 'b) Si el número de misiles que caen sobre Kiev se comporta como un proceso Poisson con una media de 14 diarios (24 hrs), determine la probabilidad de que entre las 12:00 y 16:00 hrs caigan sobre Kiev 3 misiles.', f: [fS('Tipo de distribución', ['Binomial', 'Poisson', 'Hipergeométrica', 'Normal', 'Exponencial'], 1), fN('Parámetro λ (para 4 h)', 2.333, 0.01), fP('Probabilidad pedida', 0.205, 0.002)], sol: ['Poisson con λ = 14·4/24 = 2,333.', `P(X = 3) = ${ex('e', '−2,333')}·2,333³/3! = 0,205.`] },
  ] },
  { it: 'IV', title: 'Ítem IV · Aplicación', pts: 6, intro: 'Los tiempos en desarrollar el cuarto control se comportan como una distribución normal con una media de 26 min y una desviación estándar de 2 min. Determine:', qs: [
    { id: 'IVa', pts: 2, q: 'a) La proporción de cadetes que se demora más de 29 min (son los más lentos).', f: [fP('Proporción', 0.067, 0.003)], sol: ['z = (29 − 26)/2 = 1,5 → Φ(1,5) = 0,933.', 'P(X > 29) = 1 − 0,933 = 0,067 (6,7%).'] },
    { id: 'IVb', pts: 2, q: 'b) El tiempo máximo logrado por el 15% de los cadetes más veloces.', f: [fN('Tiempo (min)', 23.93, 0.12)], sol: ['P(X < a) = 0,15 → tabla: entre −1,1 (0,136) y −1,0 (0,159) → z ≈ −1,04.', 'a = 26 − 1,04·2 = 23,9 min.'] },
    { id: 'IVc', pts: 2, q: 'c) La probabilidad de que el tiempo se encuentre a menos de una desviación estándar de la media (en cualquiera de los dos sentidos).', f: [fP('Probabilidad', 0.682, 0.003)], sol: ['P(24 < X < 28) = Φ(1) − Φ(−1) = 0,841 − 0,159 = 0,682.'] },
  ] },
  { it: 'V', title: 'Ítem V · Análisis', pts: 6, intro: `Dos sistemas para el envío de información cifrada, con duraciones exponenciales e independientes. <b>NAC</b>: en paralelo con dos componentes nacionales (media 60 h c/u). <b>IMP</b>: en serie con dos componentes importadas (media 150 h c/u). ${svgSys({ p: ['1', '2'] }, { sub: { 1: '60 h', 2: '60 h' }, caption: 'Sistema NAC' })}${svgSys({ s: ['1', '2'] }, { sub: { 1: '150 h', 2: '150 h' }, caption: 'Sistema IMP' })}`, qs: [
    { id: 'Va', pts: 3, q: 'a) Probabilidad de que el sistema NAC funcione sin problema por más de 120 horas.', f: [fP('Probabilidad', 0.252, 0.002)], sol: [`Cada una: ${ex('e', '−2')} = 0,135 → fallan ambas: 0,865² = 0,748.`, 'R = 1 − 0,748 = 0,252.'] },
    { id: 'Vb', pts: 3, q: 'b) Probabilidad de que el sistema IMP funcione sin problema por más de 120 horas.', f: [fP('Probabilidad', 0.202, 0.002, [0.135])], sol: [`Cada una: ${ex('e', '−0,8')} = 0,449 → serie: 0,449² = 0,202.`, 'Si se usa el dato de 120 h del enunciado general: (e<sup>−1</sup>)² = 0,135 (también se acepta aquí).'] },
    { id: 'Vc', pts: 0, q: 'c) (Extra, sin puntaje) ¿Cuál sistema conviene?', f: [fS('Conviene', ['Sistema NAC', 'Sistema IMP', 'Son iguales'], 0)], sol: ['0,252 > 0,202 → NAC: la redundancia compensa la menor duración.'] },
  ] },
];
const SIM_MAX = SIM.reduce((a, s) => a + s.pts, 0);

function simQ(q) {
  const v = S.sim[q.id] || {};
  return `<div class="sq" data-sq="${q.id}"><div class="sq-h"><p>${q.q}</p><span class="sq-pts">${q.pts ? q.pts + (q.pts === 1 ? ' pto' : ' pts') : 'extra'}</span></div>
    ${q.live ? `<div class="sim-live" id="live-${q.live}"></div>` : ''}
    <div class="fields">${q.f.map((f, k) => fieldHTML(f, k)).join('')}</div>
    <div class="fb"></div><div class="sol" hidden><b>Solución</b><ol>${q.sol.map(s => `<li>${s}</li>`).join('')}</ol></div></div>`;
}
function renderSimulacro() {
  shBody.innerHTML = `<div class="sim-bar"><div class="sim-timer">${ic('clock')}<span id="sim-clock">00:00</span><button type="button" class="btn gh sm" id="sim-tgo">Iniciar</button></div>
    <div class="sim-acts"><button type="button" class="btn gh sm" id="sim-reset">${ic('refresh')}Reiniciar</button><button type="button" class="btn pri" id="sim-grade">${ic('check')}Corregir todo</button></div></div>
    <div class="paper"><div class="paper-h"><span>ESTADÍSTICA – SUSTITUTIVA 2026</span><span>Simulacro · ${SIM_MAX} pts</span></div>
    ${SIM.map(s => `<section class="sim-it"><h3><span>${s.title}</span><small>${s.pts} pts</small></h3>${s.note ? `<p class="sim-note">${ic('info')}${s.note}</p>` : ''}${s.intro ? `<div class="sim-intro">${s.intro}</div>` : ''}${s.qs.map(simQ).join('')}</section>`).join('')}
    </div><div id="sim-result"></div>`;
  // restaurar respuestas guardadas
  SIM.forEach(s => s.qs.forEach(q => { const v = S.sim[q.id]; if (!v) return; q.f.forEach((f, k) => { const el = shBody.querySelector(`[data-sq="${q.id}"] [data-f="${k}"]`); if (el && v[k] != null) el.value = v[k]; }); }));
  drawLive();
  shBody.oninput = ev => {
    const el = ev.target.closest('[data-f]'); if (!el) return;
    const sq = el.closest('[data-sq]'); if (!sq) return;
    (S.sim[sq.dataset.sq] = S.sim[sq.dataset.sq] || {})[el.dataset.f] = el.value; save();
    el.closest('.fld').classList.remove('ok', 'bad');
    drawLive();
  };
  shBody.onchange = shBody.oninput;
  let secs = 0, running = false;
  $('#sim-tgo').onclick = () => {
    running = !running; $('#sim-tgo').textContent = running ? 'Pausar' : 'Seguir';
    if (running) simTimer = setInterval(() => { secs++; $('#sim-clock').textContent = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`; }, 1000);
    else { clearInterval(simTimer); simTimer = null; }
  };
  $('#sim-reset').onclick = ev => confirmTwice(ev.currentTarget, () => { S.sim = {}; save(); renderSimulacro(); });
  $('#sim-grade').onclick = gradeSim;
  shBody.onclick = ev => { const b = ev.target.closest('[data-solq]'); if (b) { const s = b.closest('.sq').querySelector('.sol'); s.hidden = !s.hidden; } };
}
function simVal(id, k) { const v = S.sim[id]; return v ? v[k] : undefined; }
function drawLive() {
  const h = $('#live-hist', shBody);
  if (h) {
    const fs = [0, 1, 2].map(k => parseNum(simVal('IIa', k) ?? '', false));
    h.innerHTML = fs.every(r => !r.empty && !r.invalid)
      ? svgHist({ bins: ['40–59', '60–79', '80–99'].map((l, i) => ({ l, f: Math.max(0, Math.round(fs[i].v)) })), w: 340, h: 180 })
      : `<div class="live-ph">${ic('hist')}<span>Completa las frecuencias de a) para ver tu histograma</span></div>`;
  }
  const b = $('#live-box', shBody);
  if (b) {
    const v = [0, 1, 2, 3, 4].map(k => parseNum(simVal('IIc', k) ?? '', false));
    const ok = v.every(r => !r.empty && !r.invalid) && v.every((r, i) => i === 0 || r.v >= v[i - 1].v);
    if (ok) {
      const [mn, q1, me, q3, mx] = v.map(r => r.v), lo = parseNum(simVal('IId', 1) ?? '', false), hi = parseNum(simVal('IId', 2) ?? '', false);
      const L = lo.empty || lo.invalid ? null : lo.v, H = hi.empty || hi.invalid ? null : hi.v;
      b.innerHTML = svgBox({ mn, q1, me, q3, mx, lo: L != null && H != null ? L : null, hi: H, a: Math.floor(Math.min(mn, 20) / 10) * 10, b: Math.ceil(Math.max(mx, 110) / 10) * 10, step: 10, w: 440 });
    } else b.innerHTML = `<div class="live-ph">${ic('boxplot')}<span>Completa el resumen de 5 números (c) en orden para ver tu boxplot</span></div>`;
  }
}
function gradeSim() {
  let total = 0;
  const rows = SIM.map(s => {
    let got = 0;
    s.qs.forEach(q => {
      const card = shBody.querySelector(`[data-sq="${q.id}"]`), g = gradeFields(card, q.f), fb = card.querySelector('.fb');
      const pts = q.pts * g.okN / g.n; got += pts;
      fb.className = `fb ${g.okN === g.n ? 'ok' : g.okN ? 'warn' : 'bad'}`;
      fb.innerHTML = `${ic(g.okN === g.n ? 'check' : 'x')}<span><b>${q.pts ? `${dec(pts, 1)} / ${q.pts} pts` : (g.okN === g.n ? 'Correcto' : 'Revisa')}</b> · ${g.okN} de ${g.n} campos correctos ${g.notes.join(' ')} <button type="button" class="lnk" data-solq>Ver solución</button></span>`;
    });
    total += got;
    return { s, got };
  });
  const pct = total / SIM_MAX, nota = pct >= 0.6 ? 4 + 3 * (pct - 0.6) / 0.4 : 1 + 3 * pct / 0.6;
  $('#sim-result').innerHTML = `<div class="sim-res"><div class="sr-main"><div class="sr-nota ${nota >= 4 ? 'ok' : 'bad'}"><small>Nota estimada</small><b>${dec(nota, 1)}</b></div><div><b>${dec(total, 1)} / ${SIM_MAX} pts</b> (${Math.round(pct * 100)}%) · exigencia 60% → nota 4,0</div></div>
    <table class="tb tb-sm"><thead><tr><th>Ítem</th><th>Puntaje</th><th>Repasar</th></tr></thead><tbody>${rows.map(r => `<tr><th>${r.s.title}</th><td>${dec(r.got, 1)} / ${r.s.pts}</td><td>${r.got < r.s.pts ? (EXAM.find(e => e.it === r.s.it)?.topics || []).map(id => `<button type="button" class="chip c-${TOPIC[id].unit.color}" data-topic="${id}">${TOPIC[id].map}</button>`).join(' ') : '✓'}</td></tr>`).join('')}</tbody></table></div>`;
  $('#sim-result').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}
