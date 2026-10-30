/* =====================================================================
   slides.js — Modo presentación (8 láminas 16:9)
   ===================================================================== */
const deck = $('#deck'), stage = $('#deck-stage');
let slideI = 0, deckLast = null;

const slHead = (k, t, s, icon) => `<header class="sl-h"><span class="sl-ic">${ic(icon)}</span><div><span class="sl-k">${k}</span><h2>${t}</h2>${s ? `<p>${s}</p>` : ''}</div></header>`;
/* Explicación «fácil» (como para un niño de 10 años) de cada apartado de las láminas:
   q = ¿Qué es?   c = ¿Cómo se usa? */
const KID = {
  /* Lámina 1 — Mapa del examen */
  iI: { q: 'Son preguntas de alternativas, como un quiz: te muestran varias respuestas y tú eliges la correcta.', c: 'Lee con calma, tacha las que suenan raras y quédate con la que calza con la definición. Si dudas, márcala y vuelve a ella al final.' },
  iII: { q: 'Te dan una lista de números (por ejemplo, los puntajes de 13 cadetes) y tienes que ordenarlos y resumirlos.', c: 'Es como ordenar tus cartas de menor a mayor: primero las cuentas por grupos (tabla), después las dibujas (histograma y caja) y buscas la del medio.' },
  iIII: { q: 'Son problemas de contar: de cuántas formas se puede armar un grupo, o cuántas veces pasa algo en un rato.', c: 'Si eliges personas de un curso, usas combinaciones (la tecla nCr de la calculadora). Si cuentas cosas que pasan en el tiempo, como misiles por hora, usas Poisson.' },
  iIV: { q: 'Es la «campana»: casi todos los tiempos quedan cerca del promedio y muy pocos quedan muy lejos.', c: 'Conviertes el tiempo en un número z, lo buscas en la tabla y lees qué parte de los cadetes queda a la izquierda de ese tiempo.' },
  iV: { q: 'Son aparatos armados con piezas que se pueden echar a perder con el tiempo.', c: 'Primero calculas cuánto aguanta cada pieza con e<sup>−t/μ</sup>. Después miras si están en fila (serie) o con respaldo (paralelo) y las juntas.' },
  /* Lámina 2 — Descriptiva */
  tabla: { q: 'Una tabla que cuenta cuántos datos caen en cada grupo, como contar cuántos compañeros sacaron entre 40 y 59 puntos, entre 60 y 79, y así.', c: 'Ordenas los datos, cuentas cuántos hay en cada grupo y lo pasas a porcentaje: los del grupo divididos por el total, por 100. ¡Siempre las dos columnas!' },
  forma: { q: 'Es la forma del dibujo de barras. Puede ser pareja como un cerro (simétrica) o tener una «cola» larga hacia un lado.', c: 'Mira hacia dónde se estiran las barras bajitas, como la cola de un perro: si la cola apunta a la derecha, es asimétrica a la derecha.' },
  cinco: { q: 'Son cinco números que resumen todo: el más chico, el del 25%, el del medio, el del 75% y el más grande.', c: 'Pones los datos en fila de menor a mayor y usas la regla L = n·K/100 para saber en qué lugar de la fila está cada uno.' },
  box: { q: 'Un dibujo con una caja y dos «bigotes». La caja guarda la mitad de los datos, los del medio.', c: 'Dibujas la caja desde C1 hasta C3 con una raya en la mediana. Si un dato queda demasiado lejos de la caja (fuera de las vallas LI y LS), es un dato raro: un «anómalo».' },
  /* Lámina 3 — Probabilidad y conteo */
  reglas: { q: 'Son las reglas para juntar probabilidades, como las reglas de un juego.', c: '«Y» quiere decir que pasen las dos cosas: multiplicas. «O» quiere decir que pase una u otra: sumas y restas lo repetido. «Al menos uno» es 1 menos «ninguno».' },
  comando: { q: 'Es contar de cuántas formas puedes elegir un grupo, como elegir 5 jugadores para un equipo de un curso de 30.', c: 'Cuentas los grupos que te sirven (favorables) y los divides por todos los grupos posibles (totales). La calculadora los cuenta con la tecla nCr.' },
  doble: { q: 'Una tabla que mezcla dos preguntas a la vez, por ejemplo: ¿es hombre o mujer? y ¿aprobó o no aprobó?', c: 'Para una probabilidad divides una casilla por el total. Pero si te dicen «entre los que aprobaron», divides solo por el total de los que aprobaron.' },
  bayes: { q: 'Un árbol de caminos, como un laberinto donde cada camino tiene su probabilidad.', c: 'Multiplicas los números de cada camino y sumas los caminos que llegan al mismo final. Para saber de dónde vino algo, divides su camino por esa suma.' },
  /* Lámina 4 — Discretas */
  bin: { q: 'Contar cuántas veces aciertas cuando intentas un número fijo de veces, como 8 tiros al arco.', c: 'Necesitas saber cuántos intentos son (n) y la probabilidad de acertar cada vez (p). Con eso usas la fórmula para la cantidad de aciertos que te piden.' },
  hiper: { q: 'Contar cuántos «especiales» salen al sacar sin devolver, como sacar 5 dulces de una bolsa de 30 donde 6 son de chocolate.', c: 'Cuentas las formas de sacar los especiales que quieres y los demás, y lo divides por todas las formas de sacar el grupo. Es lo mismo que «favorables / totales».' },
  poisson: { q: 'Contar cuántas veces pasa algo en un rato, como cuántos autos pasan por una esquina en una hora.', c: 'Lo más importante es λ: cuántas veces pasa en promedio EN EL RATO QUE TE PREGUNTAN. Si son 14 al día y preguntan por 4 horas, λ = 14 × 4 ÷ 24.' },
  bneg: { q: 'Contar cuántos intentos necesitas hasta lograr lo que quieres, como cuántos lanzamientos hasta encestar 3 veces.', c: 'El último intento siempre es un acierto. Antes de ese, cuentas de cuántas formas se repartieron los otros aciertos.' },
  linea: { q: 'Una línea con las 24 horas del día; cada rombo rojo es un misil que cayó.', c: 'Mira solo el pedazo que te preguntan (de 12:00 a 16:00) y calcula cuántos esperarías ahí. Ese número es λ, y con él usas la fórmula de Poisson.' },
  /* Lámina 5 — Normal */
  masde: { q: 'Saber qué parte de los cadetes se demora MÁS de 29 minutos: los más lentos.', c: 'La tabla siempre te da lo que queda a la IZQUIERDA. Como quieres lo de la derecha, haces 1 menos el número de la tabla.' },
  perc: { q: 'Encontrar el tiempo que separa al 15% más rápido del resto de los cadetes.', c: 'Es al revés: buscas 0,15 adentro de la tabla, lees su z (sale negativo porque son más rápidos que el promedio) y lo conviertes en minutos con μ + σ·z.' },
  sigma: { q: 'Qué parte de los tiempos queda cerca del promedio, a menos de una «desviación» (un paso) hacia cualquier lado.', c: 'Restas lo de la tabla en z = 1 menos lo de z = −1. Siempre da cerca de 68%: más o menos 2 de cada 3 cadetes.' },
  /* Lámina 6 — Exponencial y sistemas */
  comp: { q: 'La probabilidad de que una pieza siga funcionando después de cierto tiempo.', c: 'Usas e<sup>−t/μ</sup>: t es el tiempo que te preguntan y μ lo que dura en promedio. Mientras más tiempo pasa, más chica es la probabilidad.' },
  para: { q: 'Dos piezas que se cubren entre sí, como tener una linterna de repuesto: basta con que una funcione.', c: 'Calculas la probabilidad de que fallen las dos (multiplicas las fallas) y se la restas a 1.' },
  serie: { q: 'Piezas puestas en fila, como una cadena: si se rompe un eslabón, se cae todo.', c: 'Multiplicas las probabilidades de que cada pieza funcione. Por eso un sistema en serie siempre aguanta menos que cada pieza sola.' },
  /* Lámina 7 — ¿Qué distribución uso? */
  conteo: { q: 'Cuando la respuesta es un número para contar con los dedos: 0, 1, 2, 3… (aciertos, personas, misiles).', c: 'Pregúntate qué cuentas: cosas que pasan en el tiempo → Poisson; aciertos en intentos fijos → Binomial; elegidos de un grupo sin devolver → Hipergeométrica; intentos hasta lograrlo → Binomial negativa.' },
  medida: { q: 'Cuando la respuesta se mide con reloj o con pesa y puede tener decimales (tiempo, peso).', c: 'Si te dan promedio y desviación → Normal. Si te dan cuánto dura algo en promedio → Exponencial. Si todo es igual de probable entre dos números → Uniforme.' },
  /* Lámina 8 — Trampas */
  t0: { q: 'Una trampa: usar la fórmula de la campana (la Z) cuando hay que contar personas.', c: 'Si eliges gente de un grupo, cuenta con combinaciones (nCr). La Z es solo para cosas que se miden, como el tiempo o el peso.' },
  t1: { q: 'Olvidarse de cambiar el promedio al pedazo de tiempo que te preguntan.', c: 'Haz una regla de tres: si en 24 horas caen 14, en 4 horas caen 14 × 4 ÷ 24.' },
  t2: { q: 'La tabla solo te dice lo que queda a la izquierda de tu número.', c: 'Si te preguntan «más de», haces 1 menos el número de la tabla.' },
  t3: { q: 'Cuando te dan el porcentaje y te piden el tiempo, la tabla se usa al revés.', c: 'Buscas el porcentaje adentro de la tabla, lees su z y lo pasas a minutos con μ + σ·z.' },
  t4: { q: 'λ no es el promedio: es 1 dividido por el promedio.', c: 'Si una pieza dura 60 horas en promedio, λ = 1/60. Para «funcione más de t» usas e<sup>−t/μ</sup>.' },
  t5: { q: 'No confundir «paralelo» con «serie».', c: 'Paralelo: 1 menos la probabilidad de que fallen todas. Serie: multiplicas las que funcionan.' },
  t6: { q: 'Una tabla de frecuencias sin porcentajes está incompleta y pierde puntos.', c: 'Pon siempre dos columnas: cuántos casos hay en cada grupo y qué porcentaje son del total.' },
  t7: { q: 'La forma se nombra por la cola, no por la barra más alta.', c: 'Si las barras bajitas se estiran hacia la izquierda, es asimétrica a la izquierda.' },
};
const kidBtn = () => `<button type="button" class="kid-btn" data-kid aria-label="Explicación fácil">${ic('bulb')}<span>¿Qué es?</span></button>`;
const kidBox = k => `<div class="kid" role="note"><div class="kid-h"><span class="kid-ic">${ic('bulb')}</span><b>Explicado fácil</b><button type="button" class="kid-x" data-kid aria-label="Volver a la lámina">${ic('close')}</button></div><p><span class="kq">¿Qué es?</span>${KID[k].q}</p><p><span class="kc">¿Cómo se usa?</span>${KID[k].c}</p></div>`;
const card = (k, title, icon, body, cls = '') => `<div class="sc kidable ${cls}"><div class="sc-h">${ic(icon)}<b>${title}</b>${kidBtn()}</div>${body}${kidBox(k)}</div>`;
/* Recorte de la tabla normal con columnas destacadas */
const tSnip = (zs, ps, hl) => `<table class="tsnip"><tr><th>z</th>${zs.map((z, i) => `<td class="${hl.includes(i) ? 'on' : ''}">${z}</td>`).join('')}</tr><tr><th>Φ(z)</th>${ps.map((p, i) => `<td class="${hl.includes(i) ? 'on' : ''}">${p}</td>`).join('')}</tr></table>`;
/* Funciones de probabilidad para las mini-gráficas */
const comb = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; };
const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
const PMF = {
  bin: { x: [0, 1, 2, 3, 4, 5, 6, 7, 8], p: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(k => comb(8, k) * 0.7 ** k * 0.3 ** (8 - k)) },
  hip: { x: [0, 1, 2, 3, 4, 5], p: [0, 1, 2, 3, 4, 5].map(k => comb(6, k) * comb(24, 5 - k) / comb(30, 5)) },
  poi: { x: [0, 1, 2, 3, 4, 5, 6, 7], p: [0, 1, 2, 3, 4, 5, 6, 7].map(k => Math.exp(-14 / 6) * (14 / 6) ** k / fact(k)) },
  bn: { x: [3, 4, 5, 6, 7, 8, 9], p: [3, 4, 5, 6, 7, 8, 9].map(x => comb(x - 1, 2) * 0.7 ** 3 * 0.3 ** (x - 3)) },
};

const SLIDES = [
  /* 1 — Mapa del examen */
  () => `${slHead('Estadística I · Sustitutiva 2026', 'Mapa del examen', 'Qué te piden en cada ítem y con qué herramienta se resuelve', 'insignia')}
  <div class="s1">
    ${EXAM.map(e => `<div class="s1-it kidable"><div class="s1-top"><span class="s1-n">Ítem ${e.it}</span><span class="s1-p">${e.pts}</span></div><span class="s1-ic">${ic(e.icon)}</span><h3>${e.name}</h3><ul>${e.what.map(w => `<li>${w}</li>`).join('')}</ul>${kidBtn()}${kidBox('i' + e.it)}</div>`).join('')}
  </div>
  <div class="s1-bar"><span style="flex:7" class="b2">II · 7</span><span style="flex:4" class="b3">III · 4</span><span style="flex:6" class="b4">IV · 6</span><span style="flex:6" class="b5">V · 6</span></div>
  <div class="sl-foot"><span>${ic('clipboard')}Hoja de fórmulas: Uniforme, Exponencial, Normal + tabla</span><span>${ic('calc')}Calculadora: nCr · eˣ · ln</span><span>${ic('target')}Resultados con 3 decimales</span></div>`,

  /* 2 — Descriptiva */
  () => `${slHead('Ítem II · 7 puntos', 'Estadística descriptiva', 'Ordenar → tabla → histograma → 5 números → boxplot', 'chart')}
  <div class="g2x2">
    ${card('tabla', 'a) Tabla de frecuencias', 'table', `<div class="row-c">${tbl(['Categoría', 'f', '%'], [['40–59', '4', '30,8'], ['60–79', '6', '46,2'], ['80–99', '3', '23,1'], ['Total', '13', '100']], 'tb-sm')}<div class="mini">${svgHist({ bins: [{ l: '40–59', f: 4 }, { l: '60–79', f: 6 }, { l: '80–99', f: 3 }], w: 300, h: 170 })}</div></div><p class="sc-n">% = f / n × 100 · ¡casos <b>y</b> porcentajes!</p>`)}
    ${card('forma', 'b) Forma: se nombra por la COLA', 'hist', svgShapes({ h: 168 }))}
    ${card('cinco', 'c) Resumen de 5 números', 'ruler', `${svgPositions({ data: D_SUST_ORD, marks: [{ pos: 4, t: 'C1' }, { pos: 7, t: 'Me' }, { pos: 10, t: 'C3' }] })}<p class="sc-n">L = n·K/100 · entero → promedio (L, L+1) · no entero → subir</p><p class="sc-big">44 · 58 · 67 · 79 · 98</p>`)}
    ${card('box', 'd) Boxplot y anómalos', 'boxplot', `${svgBox({ mn: 44, q1: 58, me: 67, q3: 79, mx: 98, lo: 26.5, hi: 110.5, a: 20, b: 120, step: 10, w: 470, h: 130 })}<p class="sc-n">RIQ = C3 − C1 · LI = C1 − 1,5·RIQ · LS = C3 + 1,5·RIQ</p>`)}
  </div>`,

  /* 3 — Probabilidad y conteo */
  () => `${slHead('Ítem III-a · base de todo', 'Probabilidad y conteo', 'Contar personas = casos favorables / casos totales', 'dice')}
  <div class="g2x2">
    ${card('reglas', 'Reglas básicas', 'venn', `<div class="row-c">${svgVenn()}<div class="rules"><p><b>No</b> → 1 − P(A)</p><p><b>O</b> → P(A) + P(B) − P(A∩B)</p><p><b>Y</b> → P(A)·P(B) <small>(indep.)</small></p><p><b>Al menos uno</b> → 1 − P(ninguno)</p></div></div>`)}
    ${card('comando', 'Comando de 5 de un curso de 30', 'combo', `${svgPeople({ N: 30, K: 6, ln: '24 hombres', lk: '6 mujeres', pick: [3, 11, 25, 27, 29], cols: 15 })}${eq(`P = ${fr(`${bn(6, 3)}·${bn(24, 2)}`, bn(30, 5))} = ${fr('5.520', '142.506')} = 0,039`)}`, 'hl')}
    ${card('doble', 'Tabla de doble entrada', 'grid', `${TOPIC.t22.fig}<p class="sc-n">P(M ∩ aprobó) = 4/30 · P(aprobó) = 22/30 · P(M | aprobó) = 4/22</p>`)}
    ${card('bayes', 'Probabilidad total y Bayes', 'branch', `<div class="fit-sv">${svgTree({ w: 470, br: [{ l: 'NAC', p: '0,6', sub: [{ l: 'Falla', p: '0,865', prod: '0,519', hl: 1 }, { l: 'OK', p: '0,135' }] }, { l: 'IMP', p: '0,4', sub: [{ l: 'Falla', p: '0,551', prod: '0,220', hl: 1 }, { l: 'OK', p: '0,449' }] }] })}</div><p class="sc-n">P(F) = suma de ramas · P(NAC | F) = rama / P(F)</p>`)}
  </div>`,

  /* 4 — Discretas */
  () => `${slHead('Ítem III · contar', 'Distribuciones discretas', 'Cuatro modelos según QUÉ se cuenta', 'hash')}
  <div class="g4 grow">
    ${card('bin', 'Binomial', 'crosshair', `<p class="sc-q">Éxitos en <b>n fijo</b> de intentos independientes</p>${eq(`${bn('n', 'k')}${ex('p', 'k')}${ex('(1−p)', 'n−k')}`)}${svgBars({ xs: PMF.bin.x, ps: PMF.bin.p, hl: [7, 8], w: 280, h: 130, cap: 'Bin(8; 0,7)' })}<p class="sc-n">E = np · V = np(1−p)</p><p class="sc-e">Aciertos en 8 tiros, p = 0,7</p>`)}
    ${card('hiper', 'Hipergeométrica', 'urn', `<p class="sc-q">Éxitos al elegir <b>sin reemplazo</b> de N</p>${eq(fr(`${bn('K', 'k')}${bn('N−K', 'n−k')}`, bn('N', 'n')))}${svgBars({ xs: PMF.hip.x, ps: PMF.hip.p, hl: [3], w: 280, h: 130, cap: 'Hiper(30, 6, 5)' })}<p class="sc-n">E = nK/N</p><p class="sc-e">Mujeres en el comando · III-a</p>`, 'hl')}
    ${card('poisson', 'Poisson', 'burst', `<p class="sc-q">Eventos en un <b>intervalo</b> de tiempo</p>${eq(fr(`${ex('e', '−λ')}${ex('λ', 'k')}`, 'k!'))}${svgBars({ xs: PMF.poi.x, ps: PMF.poi.p, hl: [3], w: 280, h: 130, cap: 'Poisson(2,33)' })}<p class="sc-n">E = V = λ</p><p class="sc-e">Misiles sobre Kiev · III-b</p>`, 'hl')}
    ${card('bneg', 'Binomial negativa', 'repeat', `<p class="sc-q">Intentos <b>hasta</b> el k-ésimo éxito</p>${eq(`${bn('x−1', 'k−1')}${ex('p', 'k')}${ex('(1−p)', 'x−k')}`)}${svgBars({ xs: PMF.bn.x, ps: PMF.bn.p, hl: [5], w: 280, h: 130, cap: 'BN(3; 0,7)' })}<p class="sc-n">E = k/p</p><p class="sc-e">Tiros hasta el 3er acierto</p>`)}
  </div>
  <div class="sc wide kidable">${kidBtn()}${svgRate({ w: 1100, T: 24, a: 12, b: 16, step: 2, ev: [0.8, 2.1, 3.9, 5.2, 7.5, 8.4, 10.6, 12.9, 13.8, 15.1, 17.7, 19.3, 21.2, 23.1], wl: 'λ = 14 × 4/24 = 2,33  →  P(X = 3) = 0,205', cap: 'Poisson: AJUSTA la tasa al intervalo que preguntan (14 en 24 h → 2,33 en 4 h)' })}${kidBox('linea')}</div>`,

  /* 5 — Normal */
  () => `${slHead('Ítem IV · 6 puntos', 'Distribución Normal', 'Tiempos N(26, 2²): tres tipos de pregunta', 'bell')}
  <div class="g3">
    ${card('masde', 'a) «Más de 29 min»', 'bell', `${svgNormal({ mu: 26, s: 2, from: 29, label: '0,067', w: 360, h: 225 })}<p class="sc-n">z = (29 − 26)/2 = 1,5</p>${tSnip(['1,4', '1,5', '1,6'], ['0,919', '0,933', '0,945'], [1])}<p class="sc-big">1 − 0,933 = 0,067</p>`)}
    ${card('perc', 'b) «El 15% más veloz»', 'bellLeft', `${svgNormal({ mu: 26, s: 2, to: 23.93, label: '15%', w: 360, h: 225 })}<p class="sc-n">Busca 0,15 DENTRO de la tabla</p>${tSnip(['−1,1', '≈ −1,04', '−1,0'], ['0,136', '0,150', '0,159'], [1])}<p class="sc-big">a = 26 − 1,04·2 = 23,9</p>`)}
    ${card('sigma', 'c) «A menos de 1σ»', 'target', `${svgNormal({ mu: 26, s: 2, from: 24, to: 28, label: '0,682', w: 360, h: 225 })}<p class="sc-n">P(24 &lt; X &lt; 28) = P(−1 &lt; Z &lt; 1)</p>${tSnip(['−1,0', '…', '1,0'], ['0,159', '…', '0,841'], [0, 2])}<p class="sc-big">0,841 − 0,159 = 0,682</p>`)}
  </div>
  <div class="sl-strip"><span>${eq(`Z = ${fr('X − μ', 'σ')}`)}</span><span>«menos de» → Φ(z)</span><span>«más de» → 1 − Φ(z)</span><span>«entre» → Φ(z₂) − Φ(z₁)</span><span>percentil → a = μ + σ·z</span><span>P(X = a) = 0</span></div>`,

  /* 6 — Exponencial y sistemas */
  () => `${slHead('Ítem V · 6 puntos', 'Exponencial y sistemas', 'Duración de componentes: P(T > t) = e<sup>−t/μ</sup>', 'network')}
  <div class="g3">
    ${card('comp', 'Una componente', 'hourglass', `${svgExp({ mean: 60, t: 120, w: 360, h: 180, label: 'e⁻² = 0,135' })}<p class="sc-n">λ = 1/media · P(T > t) = ${ex('e', '−t/μ')}</p><p class="sc-big">NAC 0,135 · IMP 0,449</p>${svgCompare([{ l: 'NAC ∥', v: 0.2524, hl: 1 }, { l: 'IMP —', v: 0.2019 }], { max: 0.3, w: 360 })}<p class="sc-n">Sistemas a 120 h: gana NAC</p>`)}
    ${card('para', 'Paralelo (NAC)', 'paralelo', `${svgSys({ p: ['1', '2'] }, { sub: { 1: '60 h', 2: '60 h' } })}<p class="sc-n">Funciona si <b>al menos una</b> funciona</p><ol class="sl-steps"><li>R = ${ex('e', '−120/60')} = 0,135</li><li>Cada una falla: 1 − 0,135 = 0,865</li><li>Fallan ambas: 0,865² = 0,748</li><li>R<sub>NAC</sub> = 1 − 0,748</li></ol><p class="sc-big">= 0,252</p>`, 'hl')}
    ${card('serie', 'Serie (IMP)', 'serie', `${svgSys({ s: ['1', '2'] }, { sub: { 1: '150 h', 2: '150 h' } })}<p class="sc-n">Funciona si <b>todas</b> funcionan</p><ol class="sl-steps"><li>R = ${ex('e', '−120/150')} = 0,449</li><li>Funcionan ambas: 0,449 · 0,449</li><li>(= ${ex('e', '−1,6')})</li></ol><p class="sc-big">= 0,202</p><div class="sc-sep"></div><p class="sc-n"><b>Mixto</b> (Examen 2023): primero el bloque paralelo</p><div class="mini-sys">${svgSys({ s: [{ p: ['1', '2'] }, '3'] })}</div><p class="sc-n">R = [1 − (1 − R)²] · R</p>`, 'hl')}
  </div>
  <div class="sl-strip"><span>${ic('mixto')}Mixto: reducir bloques de adentro hacia afuera</span><span>NAC 0,252 &gt; IMP 0,202 → la redundancia gana</span><span>${ic('alert')}Confirmar dato IMP: 150 h (recuadro) vs 120 h (enunciado)</span></div>`,

  /* 7 — ¿Qué distribución uso? */
  () => `${slHead('Ítem I y III', '¿Qué distribución uso?', 'Dos preguntas bastan para elegir el modelo', 'compass')}
  <div class="flow">
    <div class="fl-root">¿Qué describe la variable?</div>
    <div class="fl-cols">
      <div class="fl-col kidable"><div class="fl-q">${ic('hash')}<b>CONTEO</b> (0, 1, 2…)${kidBtn()}</div>
        <div class="fl-leafs">
          <div class="fl-l"><span>Eventos en un intervalo de tiempo, con tasa<em>Misiles sobre Kiev (III-b)</em></span><b>${ic('burst')}Poisson</b></div>
          <div class="fl-l"><span>Éxitos en n fijo, independientes, p constante<em>Aciertos en una ronda de 8 tiros</em></span><b>${ic('crosshair')}Binomial</b></div>
          <div class="fl-l"><span>Éxitos al elegir n sin reemplazo de N<em>Mujeres en un comando de 5 (III-a)</em></span><b>${ic('urn')}Hipergeométrica</b></div>
          <div class="fl-l"><span>Intentos hasta lograr k éxitos<em>Tiros hasta el 3er acierto</em></span><b>${ic('repeat')}Bin. negativa</b></div>
        </div>${kidBox('conteo')}</div>
      <div class="fl-col kidable"><div class="fl-q">${ic('bell')}<b>MEDIDA</b> continua${kidBtn()}</div>
        <div class="fl-leafs">
          <div class="fl-l"><span>Media y desviación, forma de campana<em>Tiempos del cuarto control (IV)</em></span><b>${ic('bell')}Normal</b></div>
          <div class="fl-l"><span>Duración / tiempo hasta falla con media<em>Componentes NAC e IMP (V)</em></span><b>${ic('hourglass')}Exponencial</b></div>
          <div class="fl-l"><span>Todos los valores entre a y b igual de probables<em>Llegada del bus entre 10 y 30 min</em></span><b>${ic('square')}Uniforme</b></div>
          <div class="fl-tip">${ic('alert')}<span>Si te piden <b>contar personas</b> de un grupo, <b>nunca</b> uses la tabla Z.</span></div>
        </div>${kidBox('medida')}</div>
    </div>
  </div>`,

  /* 8 — Trampas y checklist */
  () => `${slHead('Antes de entregar', 'Trampas frecuentes', 'Ocho errores que cuestan puntos', 'alert')}
  <div class="g4 traps">
    ${[
      ['combo', 'Contar ≠ Normal', 'Un comando de cadetes se resuelve con C(n,k). Nunca con Z.'],
      ['burst', 'Ajusta λ', '14 por día → en 4 h: λ = 14·4/24 = 2,33.'],
      ['bell', '«Más de» = 1 − tabla', 'P(X > 29) = 1 − Φ(1,5) = 0,067.'],
      ['bellLeft', 'Percentil al revés', 'Busca p DENTRO de la tabla. 15% → z ≈ −1,04 (negativo).'],
      ['hourglass', 'Media → tasa', 'λ = 1/μ. P(T > t) = e<sup>−t/μ</sup>.'],
      ['paralelo', 'Paralelo', '1 − (fallan todas). Serie: multiplica.'],
      ['table', 'Tabla completa', 'Casos Y porcentajes. Total = n y 100%.'],
      ['hist', 'Asimetría', 'Se nombra por la COLA, no por la barra alta.'],
    ].map(([i, t, d], j) => `<div class="trap kidable">${ic(i)}<b>${t}</b><span>${d}</span>${kidBtn()}${kidBox('t' + j)}</div>`).join('')}
  </div>
  <div class="sl-foot"><span>${ic('pencil')}Escribe siempre la fórmula y los pasos: suman puntaje parcial</span><span>${ic('target')}3 decimales, redondeado</span><span>${ic('check')}Revisa que la respuesta tenga sentido (0 ≤ P ≤ 1)</span></div>`,
];

let deckKid = false;
function setKidAll(on) {
  deckKid = on;
  $('#deck-kid').classList.toggle('on', on);
  $('#deck-kid').setAttribute('aria-pressed', on);
  $$('.kidable', stage).forEach(c => c.classList.toggle('kid-on', on));
}
function renderSlide() {
  stage.innerHTML = `<section class="slide">${SLIDES[slideI]()}<span class="sl-num">${slideI + 1} / ${SLIDES.length}</span></section>`;
  if (deckKid) $$('.kidable', stage).forEach(c => c.classList.add('kid-on'));
  $('#deck-count').textContent = `${slideI + 1} / ${SLIDES.length}`;
  $('#deck-dots').innerHTML = SLIDES.map((_, i) => `<button type="button" class="${i === slideI ? 'on' : ''}" data-s="${i}" aria-label="Lámina ${i + 1}"></button>`).join('');
  $('#deck-prev').disabled = slideI === 0;
  $('#deck-next').disabled = slideI === SLIDES.length - 1;
  fitDeck();
}
function fitDeck() {
  const box = $('#deck-view'), s = Math.min(box.clientWidth / 1280, box.clientHeight / 720);
  stage.style.transform = `translate(-50%, -50%) scale(${s})`;
}
function openDeck() {
  deckLast = document.activeElement;
  deck.hidden = false; document.body.classList.add('noscroll');
  renderSlide();
  setTimeout(() => $('#deck-close').focus({ preventScroll: true }), 30);
}
function closeDeck() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  deck.hidden = true;
  if (sheet.hidden && !drawer.classList.contains('open')) document.body.classList.remove('noscroll');
  if (deckLast && deckLast.focus) deckLast.focus({ preventScroll: true });
}
function goSlide(d) { const n = Math.max(0, Math.min(SLIDES.length - 1, slideI + d)); if (n !== slideI) { slideI = n; renderSlide(); } }
$('#deck-prev').addEventListener('click', () => goSlide(-1));
$('#deck-next').addEventListener('click', () => goSlide(1));
$('#deck-close').addEventListener('click', closeDeck);
$('#deck-kid').addEventListener('click', () => setKidAll(!deckKid));
stage.addEventListener('click', ev => {
  const b = ev.target.closest('[data-kid]'); if (!b) return;
  b.closest('.kidable').classList.toggle('kid-on');
});
$('#deck-fs').addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else if (deck.requestFullscreen) deck.requestFullscreen().catch(() => {});
});
$('#deck-dots').addEventListener('click', ev => { const b = ev.target.closest('[data-s]'); if (b) { slideI = Number(b.dataset.s); renderSlide(); } });
addEventListener('resize', () => { if (!deck.hidden) fitDeck(); });
document.addEventListener('fullscreenchange', () => { if (!deck.hidden) setTimeout(fitDeck, 60); });
document.addEventListener('keydown', ev => {
  if (deck.hidden) return;
  if (ev.key === 'ArrowRight' || ev.key === 'PageDown' || ev.key === ' ') { ev.preventDefault(); goSlide(1); }
  else if (ev.key === 'ArrowLeft' || ev.key === 'PageUp') { ev.preventDefault(); goSlide(-1); }
  else if (ev.key === 'Escape') closeDeck();
  else if (ev.key === 'f' || ev.key === 'F') $('#deck-fs').click();
  else if (ev.key === 'e' || ev.key === 'E') setKidAll(!deckKid);
});
let touchX = null;
deck.addEventListener('touchstart', ev => { touchX = ev.touches[0].clientX; }, { passive: true });
deck.addEventListener('touchend', ev => { if (touchX == null) return; const dx = ev.changedTouches[0].clientX - touchX; if (Math.abs(dx) > 50) goSlide(dx < 0 ? 1 : -1); touchX = null; });

init();
