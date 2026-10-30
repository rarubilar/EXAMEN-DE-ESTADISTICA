/* =====================================================================
   UNIDAD 4 — DISTRIBUCIONES CONTINUAS    (Ítem IV, 6 pts)
   UNIDAD 5 — SISTEMAS Y CONFIABILIDAD    (Ítem V, 6 pts)
   UNIDAD 6 — SIMULACIÓN                  (Sesión 47)
   ===================================================================== */
const NOTA_IMP = 'Ojo con el enunciado de la sustitutiva: el texto general del Ítem V dice que las importadas duran en promedio <b>120 h</b>, pero el recuadro del Sistema IMP dice <b>150 h</b>. Aquí se usa 150 h. Si el dato correcto fuera 120 h: cada componente tendría R = e<sup>−1</sup> = 0,368 y el sistema e<sup>−2</sup> = 0,135. Conviene confirmarlo con el profesor.';

UNITS.push({
  id: 'u4', n: 4, title: 'Distribuciones continuas', short: 'Continuas', item: 'Ítem IV · 6 pts', color: 'u4', icon: 'bell',
  intro: 'Modelos para medir: Uniforme, Normal (directa e inversa) y Exponencial.',
  topics: [

    /* ---------------------------------------------------------- 4.1 */
    {
      id: 't41', title: 'Distribución Uniforme', map: 'Uniforme', icon: 'square', exam: ['Formulario'],
      def: `X ~ U(a, b) cuando todos los valores entre a y b son <b>igualmente probables</b>. Su densidad es un rectángulo: f(x) = 1/(b − a) para a < x < b, y F(x) = (x − a)/(b − a).`,
      fig: svgUnif({ a: 10, b: 30, c: 10, d: 15, label: '0,25' }) +
        `<div class="formula-grid"><div>${eq(`P(c < X < d) = ${fr('d − c', 'b − a')}`)}<span>proporción del largo</span></div><div>${eq(`E(X) = ${fr('a + b', '2')}`)}<span>media</span></div><div>${eq(`V(X) = ${fr('(b − a)²', '12')}`)}<span>varianza</span></div></div>`,
      car: [
        'La densidad es un rectángulo de altura 1/(b − a).',
        'P(c < X < d) = (d − c)/(b − a): la proporción del largo total.',
        'E(X) = (a + b)/2 ; V(X) = (b − a)²/12.',
        'Es la base de la simulación: los números aleatorios son U(0, 1).',
      ],
      casos: ['Tiempos de llegada «en cualquier momento» de un intervalo.', 'Errores de redondeo.', 'Simulación: generar U(0, 1) y transformar.'],
      senales: ['igualmente probable', 'uniforme', 'en cualquier momento entre'],
      como: ['Identifica a y b.', 'Probabilidad = largo del tramo pedido / largo total.', 'Media y varianza con las fórmulas del formulario.'],
      ej: {
        src: 'Formulario de la sustitutiva · ejemplo nuevo',
        q: 'El bus de enlace llega, con igual probabilidad, entre 10 y 30 minutos después de la formación. a) P(llegue antes de los 15 min) b) E(X) c) V(X).',
        steps: ['X ~ U(10, 30); b − a = 20.', 'a) P(X < 15) = (15 − 10)/20 = <b>0,25</b>.', 'b) E(X) = (10 + 30)/2 = <b>20 min</b>.', 'c) V(X) = 20²/12 = <b>33,3 min²</b>.'],
        res: '0,25 · 20 min · 33,3 min²',
      },
      ex: [
        { n: 1, src: 'Nuevo', q: 'X ~ U(0, 60). ¿P(X > 45)?', f: [fP('P(X > 45)', 0.25)], hint: 'Largo del tramo (45 a 60) / largo total.', sol: ['(60 − 45)/60 = <b>0,25</b>.'] },
        {
          n: 2, src: 'Nuevo · estilo curso', q: 'El tiempo de armado de una carpa es uniforme entre 8 y 20 minutos.',
          f: [fP('P(10 < X < 15)', 0.417, 0.002), fN('E(X) (min)', 14, 0.01), fN('Desviación estándar (min)', 3.464, 0.005)],
          hint: 'b − a = 12. La desviación es √V.',
          sol: ['P = 5/12 = <b>0,417</b>.', 'E = (8 + 20)/2 = <b>14</b>.', 'V = 12²/12 = 12 → DE = √12 = <b>3,464</b>.'],
        },
        {
          n: 3, src: 'Nuevo · tipo examen', q: 'Con X ~ U(8, 20) minutos (tiempo de armado):',
          f: [fN('Tiempo máximo del 30% más rápido (min)', 11.6, 0.01), fP('P(X > 18 | X > 15)', 0.4)],
          hint: 'Percentil: a = a₀ + p·(b − a₀). Condicional: P(X > 18) / P(X > 15).',
          sol: ['P(X < t) = 0,30 → (t − 8)/12 = 0,3 → t = <b>11,6 min</b>.', 'P(X > 18 | X > 15) = (2/12)/(5/12) = <b>0,4</b>.'],
        },
      ],
      cq: [
        { q: 'Si X ~ U(a, b), P(X = c) para un valor c es:', o: ['1/(b − a)', '0', '(c − a)/(b − a)', '0,5'], ok: 1, exp: 'En toda variable continua la probabilidad de un punto exacto es 0.' },
        { q: 'La media de una U(a, b) es:', o: ['(b − a)/2', '(a + b)/2', '(b − a)²/12', '1/(b − a)'], ok: 1, exp: 'El punto medio del intervalo.' },
      ],
    },

    /* ---------------------------------------------------------- 4.2 */
    {
      id: 't42', title: 'Distribución Normal: calcular probabilidades', map: 'Normal: probabilidades', icon: 'bell', exam: ['Ítem IV-a', 'Ítem IV-c'],
      def: `X ~ N(μ, σ²) tiene forma de <b>campana</b> simétrica centrada en μ. Para calcular probabilidades se <b>estandariza</b>: Z = (X − μ)/σ ~ N(0, 1), y se busca Φ(z) = P(Z < z) en la <b>tabla normal</b>.`,
      fig: svgNormal({ mu: 26, s: 2, from: 29, label: '0,067', marks: [{ v: 29, t: '29 → z = 1,5' }] }) +
        `<div class="formula-grid"><div>${eq(`Z = ${fr('X − μ', 'σ')}`)}<span>estandarizar</span></div><div>${eq('P(X < a) = Φ(z)')}<span>«menos de»</span></div><div>${eq('P(X > a) = 1 − Φ(z)')}<span>«más de»</span></div><div>${eq('P(a < X < b) = Φ(z<sub>b</sub>) − Φ(z<sub>a</sub>)')}<span>«entre»</span></div></div>`,
      car: [
        'Media = mediana = moda = μ (simétrica).',
        'P(X < a) = Φ((a − μ)/σ) · P(X > a) = 1 − Φ((a − μ)/σ).',
        'P(a < X < b) = Φ(z<sub>b</sub>) − Φ(z<sub>a</sub>).',
        'P(X = a) = 0 (es continua).',
        'Regla empírica: μ ± 1σ ≈ 68% · μ ± 2σ ≈ 95% · μ ± 3σ ≈ 99,7%.',
      ],
      casos: [
        'Ítem IV-a: «proporción de cadetes que se demora más de 29 min».',
        'Ítem IV-c: «a menos de una desviación estándar de la media».',
        'Pesos, tiempos y puntajes con media y desviación dadas.',
      ],
      senales: ['se comporta como una distribución normal', 'media … y desviación estándar …', 'proporción que supera / menos de'],
      como: [
        'Identifica μ, σ y el valor a.',
        'Estandariza: z = (a − μ)/σ.',
        'Busca Φ(z) en la tabla (es la probabilidad <b>a la izquierda</b> de z).',
        'Ajusta: «menos de» → Φ(z) · «más de» → 1 − Φ(z) · «entre» → resta.',
        'Responde en contexto (proporción o porcentaje).',
      ],
      ej: {
        src: 'Sustitutiva 2026 · Ítem IV-a y IV-c',
        q: 'Los tiempos en desarrollar el cuarto control se comportan como una normal de media 26 min y desviación estándar 2 min. a) Proporción de cadetes que se demora más de 29 min. c) Probabilidad de que el tiempo esté a menos de una desviación estándar de la media.',
        steps: [
          'a) z = (29 − 26)/2 = 1,5 → en la tabla Φ(1,5) = 0,933 (es la probabilidad a la <b>izquierda</b>).',
          'P(X > 29) = 1 − 0,933 = <b>0,067</b> → el 6,7% de los cadetes.',
          'c) «A menos de 1σ de la media» = P(24 < X < 28) = P(−1 < Z < 1).',
          '= Φ(1) − Φ(−1) = 0,841 − 0,159 = <b>0,682</b>. ' + svgNormal({ mu: 26, s: 2, from: 24, to: 28, label: '0,682' }),
        ],
        res: 'a) 0,067 (6,7%) · c) 0,682',
        err: 'En el intento se calculó bien z = 1,5 pero se respondió 14,8%. Faltó leer Φ(1,5) = 0,933 en la tabla y hacer <b>1 − 0,933</b>, porque piden «más de». La parte c) quedó en blanco.',
      },
      ex: [
        { n: 1, src: 'Nuevo', q: 'X ~ N(50, 10²). ¿P(X < 60)?', f: [fP('P(X < 60)', 0.841, 0.002)], hint: 'z = (60 − 50)/10.', sol: ['z = 1 → Φ(1) = <b>0,841</b>.'] },
        {
          n: 2, src: 'Sesión 47 · a) y c)', q: 'Los tiempos en el desarrollo de la solemne se comportan como una normal de media 62 min y desviación 7 min.',
          f: [fP('a) Proporción de entregas antes de 56 min', 0.196, 0.015), fP('c) P(a menos de 1σ de la moda)', 0.682, 0.003), fP('P(X = 62)', 0, 0.0001)],
          hint: 'z = (56 − 62)/7 ≈ −0,86, entre −0,9 y −0,8 en la tabla. En la normal, moda = media.',
          sol: ['a) z = −0,857 → tabla: Φ(−0,9) = 0,184 y Φ(−0,8) = 0,212 → ≈ <b>0,196</b> (19,6%).', 'c) Moda = media = 62 → P(55 < X < 69) = Φ(1) − Φ(−1) = <b>0,682</b>.', 'P(X = 62) = <b>0</b> (variable continua).'],
        },
        {
          n: 3, src: 'Basado en Sesión 45 · mochilas', q: 'El peso de las mochilas en campaña se comporta como una normal de media 26 kg y desviación 2 kg.',
          f: [fP('P(24 < X < 29)', 0.774, 0.003), fP('P(X > 23)', 0.933, 0.003)],
          hint: 'z = −1 y 1,5 para la primera; z = −1,5 para la segunda.',
          sol: ['P(24 < X < 29) = Φ(1,5) − Φ(−1) = 0,933 − 0,159 = <b>0,774</b>.', 'P(X > 23) = 1 − Φ(−1,5) = 1 − 0,067 = <b>0,933</b>.'],
        },
      ],
      cq: [
        { q: 'Si el peso de las mochilas es N(26, 2²), la probabilidad de que una mochila pese <b>exactamente</b> 27 kg es: <span class="src-inline">(Sesión 45 d)</span>', o: ['Φ(0,5)', '0,5', '0', '1 − Φ(0,5)'], ok: 2, exp: 'Variable continua: la probabilidad de un valor exacto es 0.' },
        { q: 'En una distribución normal:', o: ['La media es mayor que la mediana', 'Media, mediana y moda coinciden', 'La moda es siempre 0', 'Es asimétrica a la derecha'], ok: 1, exp: 'Es simétrica alrededor de μ.' },
      ],
    },

    /* ---------------------------------------------------------- 4.3 */
    {
      id: 't43', title: 'Normal inversa: percentiles', map: 'Normal inversa (percentil)', icon: 'bellLeft', exam: ['Ítem IV-b'],
      def: `A veces te dan la <b>probabilidad</b> y piden el <b>valor</b>: el valor a tal que P(X < a) = p. Se busca p en el <b>cuerpo de la tabla</b>, se lee su z = Φ<sup>−1</sup>(p) y se «des-estandariza»: <b>a = μ + σ·Φ<sup>−1</sup>(p)</b>.`,
      fig: svgNormal({ mu: 26, s: 2, to: 23.93, label: '15%', marks: [{ v: 23.93, t: 'a ≈ 23,9' }], ldx: -6 }) +
        `<div class="flow3"><span>p = 0,15</span>${ic('arrowR')}<span>tabla: z ≈ −1,04</span>${ic('arrowR')}<span>a = 26 + (−1,04)·2 = 23,9</span></div>`,
      car: [
        'Es el camino inverso: probabilidad → z → valor.',
        'Si p < 0,5, entonces z es <b>negativo</b> (el valor queda bajo la media).',
        '«El x% más bajo / rápido / liviano» → p = x/100. «El x% más alto / lento / pesado» → p = 1 − x/100.',
        'Si p no aparece exacto en la tabla, usa el valor más cercano o interpola.',
      ],
      casos: [
        'Ítem IV-b: «tiempo máximo logrado por el 15% de los cadetes más veloces».',
        'Sesión 45: máximo peso del 15% de las mochilas más livianas.',
        'Sesión 47: tiempo mínimo del 15% que más se demora.',
      ],
      senales: ['el x% más…', 'tiempo máximo / mínimo', 'valor que separa', 'percentil'],
      como: [
        'Traduce a P(X < a) = p (si es «el x% más alto», p = 1 − x/100).',
        'Busca p dentro de la tabla → lee z.',
        'a = μ + z·σ.',
        'Revisa el sentido: si piden los más rápidos, a debe ser <b>menor</b> que μ.',
      ],
      ej: {
        src: 'Sustitutiva 2026 · Ítem IV-b',
        q: 'Tiempos ~ N(26, 2²). ¿Cuál es el tiempo máximo logrado por el 15% de los cadetes más veloces?',
        steps: [
          'Más veloces = tiempos <b>más bajos</b> → buscamos a tal que P(X < a) = 0,15.',
          'En la tabla: Φ(−1,1) = 0,136 y Φ(−1,0) = 0,159. El 0,15 está entre ellos → z ≈ −1,04.',
          'a = 26 + (−1,04)·2 = <b>23,9 min</b>.',
          'Interpretación: el 15% más veloz demora a lo más 23,9 minutos.',
        ],
        res: 'a ≈ 23,9 min',
        err: 'En el intento se escribió «15% → z = 0,85»: se confundió la probabilidad con el valor z. Hay que buscar 0,15 <b>dentro</b> de la tabla y leer el z correspondiente, que resulta negativo.',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: 'Puntajes ~ N(500, 100²). ¿Puntaje mínimo para quedar en el 5% superior?',
          f: [fN('Puntaje', 665, 1.5)], hint: '5% superior → p = 0,95. Busca 0,950 en la tabla.',
          sol: ['Φ(1,65) = 0,950 → z = 1,65.', 'a = 500 + 1,65·100 = <b>665</b>.'],
        },
        {
          n: 2, src: 'Sesión 47 · b)', q: 'Tiempos de la solemne ~ N(62, 7²). ¿Cuál es el tiempo mínimo que le toma al 15% de los cadetes que más se demoran?',
          f: [fN('Tiempo (min)', 69.3, 0.35)], hint: 'Los que más se demoran = el 15% superior → p = 0,85.',
          sol: ['P(X < a) = 0,85 → tabla: Φ(1,0) = 0,841 y Φ(1,1) = 0,864 → z ≈ 1,04.', 'a = 62 + 1,04·7 = <b>69,3 min</b>.'],
        },
        {
          n: 3, src: 'Nuevo · tipo examen', q: 'Tiempos del cuarto control ~ N(26, 2²).',
          f: [fN('Tiempo que separa al 10% más lento (min)', 28.56, 0.1), fN('Tiempo máximo del 25% más veloz (min)', 24.65, 0.1)],
          hint: '10% más lento → p = 0,90 (z entre 1,2 y 1,3). 25% más veloz → p = 0,25 (z entre −0,7 y −0,6).',
          sol: ['p = 0,90 → z ≈ 1,28 → a = 26 + 1,28·2 = <b>28,6 min</b>.', 'p = 0,25 → z ≈ −0,67 → a = 26 − 0,67·2 = <b>24,65 min</b>.'],
        },
      ],
      cq: [
        { q: 'Para encontrar el tiempo máximo del 15% más veloz en una normal, se busca en la tabla:', o: ['z = 0,15', 'z = 0,85', 'La probabilidad 0,15 en el cuerpo de la tabla, y se lee su z', 'La probabilidad 0,85 y se usa z positivo'], ok: 2, exp: 'Los más veloces tienen tiempos bajos: P(X < a) = 0,15 → z negativo.' },
        { q: 'Si a es tal que P(X < a) = p, entonces:', o: ['a = μ + σ·Φ⁻¹(p)', 'a = (p − μ)/σ', 'a = μ·σ·p', 'a = Φ(p)'], ok: 0, exp: 'Es la observación del formulario de la sustitutiva.' },
      ],
    },

    /* ---------------------------------------------------------- 4.4 */
    {
      id: 't44', title: 'Distribución Exponencial', map: 'Exponencial', icon: 'hourglass', exam: ['Ítem V'],
      def: `X ~ Exp(λ) modela <b>tiempos de espera o de vida</b> (hasta una falla, hasta la próxima llegada). f(x) = λ${ex('e', '−λx')} para x > 0 y F(x) = 1 − ${ex('e', '−λx')}. El parámetro λ es una <b>tasa</b>: <b>λ = 1/media</b>.`,
      fig: svgExp({ mean: 60, t: 120, label: 'P(T > 120) = e⁻² = 0,135' }) +
        `<div class="formula-grid"><div>${eq(`P(X > t) = ${ex('e', '−t/μ')}`)}<span>funciona más de t</span></div><div>${eq(`P(X ≤ t) = 1 − ${ex('e', '−t/μ')}`)}<span>falla antes de t</span></div><div>${eq('E(X) = 1/λ = μ')}<span>media</span></div><div>${eq('V(X) = 1/λ²')}<span>varianza</span></div></div>`,
      car: [
        'E(X) = 1/λ ; V(X) = 1/λ² (la desviación estándar es igual a la media).',
        `Supervivencia: P(X > t) = ${ex('e', '−λt')} = ${ex('e', '−t/μ')}.`,
        `P(X ≤ t) = 1 − ${ex('e', '−λt')}.`,
        '<b>Falta de memoria</b>: P(X > s + t | X > s) = P(X > t).',
        'Muy asimétrica a la derecha: la mediana (μ·ln 2) es menor que la media.',
      ],
      casos: [
        'Ítem V: duración de componentes nacionales (media 60 h) e importadas (media 150 h).',
        'Sesión 45 y 47: tiempo de servicio de equipos de telecomunicaciones.',
        'Tiempo entre llegadas en una línea de espera.',
      ],
      senales: ['duración media de', 'tiempo de vida / hasta la falla', 'exponencial', 'funcione más de t horas'],
      como: [
        'Convierte la media en tasa: λ = 1/μ.',
        `«Funcione más de t» → P(X > t) = ${ex('e', '−t/μ')}.`,
        `«Falle antes de t» → 1 − ${ex('e', '−t/μ')}.`,
        `Usa la tecla ${ex('e', 'x')} de la calculadora.`,
      ],
      ej: {
        src: 'Sustitutiva 2026 · Ítem V (una componente)',
        q: 'Una componente nacional dura en promedio 60 h y una importada 150 h (exponenciales). ¿Probabilidad de que cada una funcione más de 120 h?',
        steps: [
          `NAC: λ = 1/60 → P(X > 120) = ${ex('e', '−120/60')} = ${ex('e', '−2')} = <b>0,135</b>.`,
          `IMP: λ = 1/150 → P(X > 120) = ${ex('e', '−120/150')} = ${ex('e', '−0,8')} = <b>0,449</b>.`,
        ],
        res: 'NAC: 0,135 · IMP: 0,449',
        nota: NOTA_IMP,
      },
      ex: [
        { n: 1, src: 'Nuevo', q: 'El tiempo de atención en el casino es exponencial con media 10 min. ¿Probabilidad de que una atención dure menos de 5 min?', f: [fP('P(X < 5)', 0.393, 0.002)], hint: `1 − ${ex('e', '−5/10')}.`, sol: [`1 − ${ex('e', '−0,5')} = 1 − 0,607 = <b>0,393</b>.`] },
        {
          n: 2, src: 'Basado en Sesión 45 · equipo A', q: 'El tiempo de servicio del equipo A es exponencial con media 12 min.',
          f: [fP('P(dure más de 15 min)', 0.287, 0.002), fP('P(dure menos de 10 min)', 0.565, 0.002)],
          hint: 'λ = 1/12.',
          sol: [`P(X > 15) = ${ex('e', '−15/12')} = ${ex('e', '−1,25')} = <b>0,287</b>.`, `P(X < 10) = 1 − ${ex('e', '−10/12')} = 1 − 0,435 = <b>0,565</b>.`],
        },
        {
          n: 3, src: 'Nuevo · tipo examen', q: 'Componente nacional con duración exponencial de media 60 h.',
          f: [fN('Mediana de la duración (h)', 41.6, 0.15), fP('P(dure más de 150 h | ya duró 100 h)', 0.435, 0.002)],
          hint: `Mediana: ${ex('e', '−t/60')} = 0,5. Falta de memoria: solo importan las 50 h extra.`,
          sol: ['t = 60·ln 2 = <b>41,6 h</b> (menor que la media: asimetría a la derecha).', `P(X > 150 | X > 100) = P(X > 50) = ${ex('e', '−50/60')} = <b>0,435</b>.`],
        },
      ],
      cq: [
        { q: 'Si la duración media de una componente es 60 h, el parámetro de la exponencial es:', o: ['λ = 60', 'λ = 1/60', 'λ = 60²', 'λ = √60'], ok: 1, exp: 'λ es una tasa (fallas por hora) = 1/media.' },
        { q: 'La propiedad de «falta de memoria» de la exponencial significa que:', o: ['La componente olvida su media', 'La probabilidad de durar t horas más no depende de cuánto ya funcionó', 'La varianza es cero', 'Siempre falla antes de la media'], ok: 1, exp: 'P(X > s + t | X > s) = P(X > t).' },
      ],
    },
  ],
});

/* =================================================================== */

UNITS.push({
  id: 'u5', n: 5, title: 'Sistemas y confiabilidad', short: 'Sistemas', item: 'Ítem V · 6 pts', color: 'u5', icon: 'network',
  intro: 'Componentes exponenciales conectados en serie, en paralelo o mixtos.',
  topics: [

    /* ---------------------------------------------------------- 5.1 */
    {
      id: 't51', title: 'Sistemas en serie', map: 'Sistema en serie', icon: 'serie', exam: ['Ítem V-b'],
      def: `En un sistema <b>en serie</b> la señal pasa por todas las componentes, una tras otra: el sistema funciona <b>solo si todas funcionan</b>. Con componentes independientes: <b>R<sub>serie</sub> = R₁ · R₂ · … · R<sub>n</sub></b>.`,
      fig: svgSys({ s: ['1', '2'] }, { sub: { 1: 'μ = 150 h', 2: 'μ = 150 h' }, bw: 70, caption: 'R = R₁ · R₂' }),
      car: [
        'Basta que <b>una</b> componente falle para que falle todo el sistema.',
        'La confiabilidad del sistema es menor que la de cada componente (se multiplican números menores que 1).',
        `Con exponenciales: R(t) = ${ex('e', '−(λ₁ + λ₂ + …)t')} → el sistema es exponencial con la suma de las tasas.`,
        `Si todas son iguales: R = (${ex('e', '−t/μ')})${ex('', 'n')} = ${ex('e', '−nt/μ')}.`,
      ],
      casos: ['Ítem V-b: sistema IMP de 2 componentes importadas en serie.', 'Sesión 45: dos equipos de telecomunicaciones en serie.', 'Cadenas de enlace donde cada eslabón es imprescindible.'],
      senales: ['en serie', 'A → 1 → 2 → B', 'funcione sin problema', 'todas deben funcionar'],
      como: [
        `Calcula la confiabilidad de cada componente: Rᵢ = P(Tᵢ > t) = ${ex('e', '−t/μᵢ')}.`,
        'Multiplica todas las Rᵢ.',
        'Si piden «falle antes de t»: 1 − R<sub>serie</sub>.',
      ],
      ej: {
        src: 'Sustitutiva 2026 · Ítem V-b',
        q: 'Sistema IMP: 2 componentes importadas en serie, cada una exponencial con media 150 h. ¿Probabilidad de que el sistema funcione sin problema por más de 120 horas?',
        steps: [
          `Cada componente: R = ${ex('e', '−120/150')} = ${ex('e', '−0,8')} = 0,449.`,
          `Serie: R<sub>IMP</sub> = 0,449 · 0,449 = ${ex('e', '−1,6')} = <b>0,202</b>.`,
        ],
        res: 'P(IMP funcione más de 120 h) = 0,202',
        nota: NOTA_IMP,
      },
      ex: [
        { n: 1, src: 'Nuevo', q: 'Dos componentes en serie con confiabilidad 0,9 cada una. ¿Confiabilidad del sistema?', f: [fP('R serie', 0.81)], hint: 'Multiplica.', sol: ['0,9 · 0,9 = <b>0,81</b>.'] },
        {
          n: 2, src: 'Sesión 45 · sistema en serie', q: `Un sistema en serie A–B: el tiempo de servicio de A es exponencial de media 12 min y el de B exponencial de media 20 min, independientes. ${svgSys({ s: ['A', 'B'] }, { sub: { A: 'μ = 12', B: 'μ = 20' }, bw: 62 })}`,
          f: [fP('a) P(sistema funcione a lo más 15 min)', 0.865, 0.002), fP('b) P(sistema funcione 10 min o más)', 0.264, 0.002)],
          hint: `R(t) = ${ex('e', '−t/12')}·${ex('e', '−t/20')}. «A lo más 15» = 1 − R(15).`,
          sol: [`R(15) = ${ex('e', '−15/12 − 15/20')} = ${ex('e', '−2')} = 0,135 → a) 1 − 0,135 = <b>0,865</b>.`, `b) R(10) = ${ex('e', '−10/12 − 10/20')} = ${ex('e', '−1,333')} = <b>0,264</b>.`],
        },
        {
          n: 3, src: 'Examen 2023 · Ítem V-b', q: `Sistema 2: tres componentes importadas en serie, cada una exponencial con media 12 h. ¿Probabilidad de que funcione sin problema por más de 10 horas? ${svgSys({ s: ['1', '2', '3'] })}`,
          f: [fP('R serie (10 h)', 0.082, 0.002)], hint: `(${ex('e', '−10/12')})³.`,
          sol: [`Cada una: ${ex('e', '−10/12')} = 0,4346.`, `Serie: 0,4346³ = ${ex('e', '−2,5')} = <b>0,082</b>.`],
        },
      ],
      cq: [
        { q: 'Un sistema en serie falla cuando:', o: ['Fallan todas las componentes', 'Falla al menos una componente', 'Falla la última componente', 'Fallan la mitad de las componentes'], ok: 1, exp: 'La señal necesita pasar por todas.' },
        { q: 'Al agregar más componentes en serie, la confiabilidad del sistema:', o: ['Aumenta', 'Disminuye', 'No cambia', 'Se duplica'], ok: 1, exp: 'Se multiplica por otro número menor que 1.' },
      ],
    },

    /* ---------------------------------------------------------- 5.2 */
    {
      id: 't52', title: 'Sistemas en paralelo', map: 'Sistema en paralelo', icon: 'paralelo', exam: ['Ítem V-a'],
      def: `En un sistema <b>en paralelo</b> hay caminos alternativos: funciona si <b>al menos una</b> componente funciona, y falla solo si <b>fallan todas</b>. <b>R<sub>paralelo</sub> = 1 − (1 − R₁)(1 − R₂)…(1 − R<sub>n</sub>)</b>.`,
      fig: svgSys({ p: ['1', '2'] }, { sub: { 1: 'μ = 60 h', 2: 'μ = 60 h' }, bw: 70, caption: 'R = 1 − (1 − R₁)(1 − R₂)' }),
      car: [
        'Redundancia: agregar componentes en paralelo <b>aumenta</b> la confiabilidad.',
        'P(sistema falla antes de t) = F₁(t)·F₂(t)·… (todas fallan).',
        'Truco: calcula primero la probabilidad de que <b>todas fallen</b> y luego usa el complemento.',
        'El sistema ya no es exponencial, aunque sus componentes lo sean.',
      ],
      casos: ['Ítem V-a: sistema NAC con 2 componentes nacionales en paralelo.', 'Sesión 47: dos equipos de telecomunicaciones en paralelo.', 'Respaldo de comunicaciones (radio principal + radio de respaldo).'],
      senales: ['en paralelo', 'respaldo / redundancia', 'funciona si al menos uno funciona'],
      como: [
        `Calcula Rᵢ = ${ex('e', '−t/μᵢ')} para cada componente.`,
        'Probabilidad de que cada una falle: 1 − Rᵢ.',
        'Todas fallan: multiplica los (1 − Rᵢ).',
        'R<sub>paralelo</sub> = 1 − ese producto.',
      ],
      ej: {
        src: 'Sustitutiva 2026 · Ítem V-a',
        q: 'Sistema NAC: 2 componentes nacionales en paralelo, cada una exponencial con media 60 h. ¿Probabilidad de que el sistema funcione sin problema por más de 120 horas?',
        steps: [
          `Cada una: R = ${ex('e', '−120/60')} = ${ex('e', '−2')} = 0,135 → probabilidad de fallar: 1 − 0,135 = 0,865.`,
          'Ambas fallan: 0,865 · 0,865 = 0,748.',
          'R<sub>NAC</sub> = 1 − 0,748 = <b>0,252</b>.',
        ],
        res: 'P(NAC funcione más de 120 h) = 0,252',
        err: 'En el intento esta parte quedó en blanco (3 pts). Son solo tres pasos: e<sup>−t/μ</sup> → complemento → 1 − producto.',
      },
      ex: [
        { n: 1, src: 'Nuevo', q: 'Dos componentes en paralelo con confiabilidad 0,9 cada una. ¿Confiabilidad del sistema?', f: [fP('R paralelo', 0.99)], hint: '1 − 0,1·0,1.', sol: ['1 − (0,1)(0,1) = <b>0,99</b>.'] },
        {
          n: 2, src: 'Sesión 47 · a)', q: `Un sistema en paralelo con dos equipos: A exponencial de media 12 min y B exponencial de media 20 min. ¿Cuál es la probabilidad de que el sistema falle dentro de los primeros 10 min? ${svgSys({ p: ['A', 'B'] }, { sub: { A: 'μ = 12', B: 'μ = 20' }, bw: 62 })}`,
          f: [fP('P(sistema falle antes de 10 min)', 0.222, 0.002)],
          hint: 'El sistema falla solo si fallan ambos: F_A(10)·F_B(10).',
          sol: [`F_A(10) = 1 − ${ex('e', '−10/12')} = 0,565 · F_B(10) = 1 − ${ex('e', '−10/20')} = 0,393.`, 'P = 0,565 · 0,393 = <b>0,222</b>.'],
        },
        {
          n: 3, src: 'Nuevo · tipo examen', q: 'Componentes nacionales (exponencial, media 60 h) en paralelo; tiempo de misión 120 h.',
          f: [fP('R con 3 componentes en paralelo', 0.354, 0.002), fN('Mínimo nº de componentes para que R ≥ 0,5', 5, 0)],
          hint: 'Con n componentes: R = 1 − 0,865ⁿ. Prueba n = 4, 5…',
          sol: ['R₃ = 1 − 0,865³ = 1 − 0,646 = <b>0,354</b>.', 'R₄ = 1 − 0,865⁴ = 0,441 < 0,5 · R₅ = 1 − 0,865⁵ = 0,516 ≥ 0,5 → <b>5 componentes</b>.'],
        },
      ],
      cq: [
        { q: 'Un sistema en paralelo falla cuando:', o: ['Falla al menos una componente', 'Fallan todas las componentes', 'Falla la primera', 'Nunca falla'], ok: 1, exp: 'Mientras quede una funcionando, el sistema funciona.' },
        { q: 'La confiabilidad de 2 componentes en paralelo con R₁ y R₂ es:', o: ['R₁·R₂', 'R₁ + R₂', '1 − (1 − R₁)(1 − R₂)', '(R₁ + R₂)/2'], ok: 2, exp: 'Complemento de «fallan ambas».' },
      ],
    },

    /* ---------------------------------------------------------- 5.3 */
    {
      id: 't53', title: 'Sistemas mixtos y comparación', map: 'Mixtos y comparación', icon: 'mixto', exam: ['Ítem V', 'Examen 2023'],
      def: `Un sistema <b>mixto</b> combina bloques en serie y en paralelo. Se resuelve <b>reduciendo por bloques</b>: cada bloque en paralelo se reemplaza por su confiabilidad equivalente y luego se multiplica en serie (o al revés), como con paréntesis.`,
      fig: svgSys({ s: [{ p: ['1', '2'] }, '3'] }, { caption: 'R = [1 − (1 − R₁)(1 − R₂)] · R₃' }),
      car: [
        'Trabaja de adentro hacia afuera, como con paréntesis.',
        'Bloque en paralelo → 1 − Π(1 − Rᵢ). Bloque en serie → Π Rᵢ.',
        'Para <b>comparar sistemas</b>, calcula la confiabilidad de cada uno al <b>mismo</b> tiempo t: el mayor es el mejor.',
        'Componentes más durables no garantizan un mejor sistema: importa la configuración.',
      ],
      casos: ['Examen 2023: sistema (1 ∥ 2) en serie con 3.', 'Ítem V: comparar el sistema NAC con el IMP.', 'Diseño de redes de comunicaciones con respaldo parcial.'],
      senales: ['paralelo/serie', '¿cuál de los dos sistemas…?', 'mayor probabilidad de funcionar'],
      como: ['Dibuja el sistema e identifica los bloques.', 'Reduce cada bloque paralelo a una R equivalente.', 'Multiplica en serie las R resultantes.', 'Para comparar: calcula R de cada sistema y elige la mayor.'],
      ej: {
        src: 'Sustitutiva 2026 · Ítem V (comparación)',
        q: '¿Qué sistema tiene mayor probabilidad de funcionar sin falla más de 120 h: NAC (2 nacionales en paralelo, media 60 h) o IMP (2 importadas en serie, media 150 h)?',
        steps: [
          `NAC (paralelo): 1 − (1 − ${ex('e', '−2')})² = <b>0,252</b>.`,
          `IMP (serie): (${ex('e', '−0,8')})² = <b>0,202</b>.`,
          svgCompare([{ l: 'NAC ∥', v: 0.2524, hl: 1 }, { l: 'IMP —', v: 0.2019 }], { max: 0.3 }),
          '0,252 > 0,202 → conviene el <b>sistema NAC</b>, aunque sus componentes duren menos: la redundancia compensa.',
        ],
        res: 'Sistema NAC (0,252) > Sistema IMP (0,202)',
        nota: NOTA_IMP,
      },
      ex: [
        { n: 1, src: 'Nuevo', q: `Sistema: (1 ∥ 2) en serie con 3. Cada componente tiene confiabilidad 0,9. ¿Confiabilidad del sistema? ${svgSys({ s: [{ p: ['1', '2'] }, '3'] })}`, f: [fP('R sistema', 0.891)], hint: 'Primero el bloque paralelo: 1 − 0,1².', sol: ['Bloque (1 ∥ 2): 1 − 0,1·0,1 = 0,99.', 'En serie con 3: 0,99 · 0,9 = <b>0,891</b>.'] },
        {
          n: 2, src: 'Examen 2023 · Ítem V', q: `Sistema 1: (1 ∥ 2) en serie con 3, componentes nacionales de media 8 h. Sistema 2: 1–2–3 en serie, importadas de media 12 h. Se pide la probabilidad de funcionar sin problema por más de 10 horas. ${svgSys({ s: [{ p: ['1', '2'] }, '3'] }, { caption: 'Sistema 1 (μ = 8 h)' })}`,
          f: [fP('R Sistema 1', 0.141, 0.002), fP('R Sistema 2', 0.082, 0.002), fS('¿Cuál es mejor?', ['Sistema 1', 'Sistema 2', 'Son iguales'], 0)],
          hint: `Nacional: r = ${ex('e', '−10/8')} = 0,2865.`,
          sol: ['r = e<sup>−1,25</sup> = 0,2865 → bloque (1 ∥ 2) = 1 − 0,7135² = 0,4909.', 'Sistema 1 = 0,4909 · 0,2865 = <b>0,141</b>.', 'Sistema 2 = (e<sup>−10/12</sup>)³ = <b>0,082</b>.', '0,141 > 0,082 → <b>Sistema 1</b>.'],
        },
        {
          n: 3, src: 'Nuevo · tipo examen', q: `La rama (1–2 en serie, cada una de media 100 h) está en paralelo con la componente 3 (media 50 h). Todas exponenciales. ¿Probabilidad de que el sistema funcione más de 40 h? ${svgSys({ p: [{ s: ['1', '2'] }, '3'] })}`,
          f: [fP('R sistema (40 h)', 0.697, 0.002)],
          hint: `Rama serie: (${ex('e', '−0,4')})² · Componente 3: ${ex('e', '−0,8')}.`,
          sol: [`Rama 1–2: ${ex('e', '−0,4')}·${ex('e', '−0,4')} = ${ex('e', '−0,8')} = 0,449.`, `Componente 3: ${ex('e', '−40/50')} = 0,449.`, 'Paralelo: 1 − (1 − 0,449)² = 1 − 0,303 = <b>0,697</b>.'],
        },
      ],
      cq: [
        { q: 'Para resolver un sistema mixto, lo primero es:', o: ['Multiplicar todas las confiabilidades', 'Reducir cada bloque interno a su confiabilidad equivalente', 'Sumar todas las medias', 'Usar la normal'], ok: 1, exp: 'Como resolver paréntesis: de adentro hacia afuera.' },
        { q: 'Dos sistemas se comparan correctamente cuando se calcula su confiabilidad:', o: ['Con distintos tiempos t', 'Al mismo tiempo t', 'Solo con la media de las componentes', 'Con la varianza'], ok: 1, exp: 'La comparación es justa solo con el mismo horizonte de tiempo.' },
      ],
    },
  ],
});

/* =================================================================== */

UNITS.push({
  id: 'u6', n: 6, title: 'Simulación', short: 'Simulación', item: 'Sesión 47', color: 'u6', icon: 'shuffle',
  intro: 'Generar datos de una distribución a partir de números aleatorios.',
  topics: [
    {
      id: 't61', title: 'Simulación: transformada inversa', map: 'Transformada inversa', icon: 'shuffle', exam: ['Sesión 47'],
      def: `Para <b>simular</b> datos de una distribución se parte de números aleatorios u ~ U(0, 1) y se aplica la <b>transformada inversa</b>: x = F<sup>−1</sup>(u). Es decir, se busca el valor x cuya probabilidad acumulada es u.`,
      fig: svgInverse({ mu: 500, s: 110, u: 0.745, x: 500 + 110 * 0.6588 }) +
        `<div class="formula-grid"><div>${eq('x = μ + σ·Φ⁻¹(u)')}<span>Normal</span></div><div>${eq('x = −μ·ln(1 − u)')}<span>Exponencial</span></div><div>${eq('x = a + (b − a)·u')}<span>Uniforme</span></div></div>`,
      car: [
        'Normal: x = μ + σ·Φ<sup>−1</sup>(u) → busca u en el cuerpo de la tabla y lee z.',
        'Exponencial: x = −μ·ln(1 − u).',
        'Uniforme U(a, b): x = a + (b − a)·u.',
        'u = 0,5 genera la mediana; u cercano a 1 genera valores altos.',
      ],
      casos: ['Sesión 47: simular 5 puntajes N(500, 110²) con 5 números aleatorios.', 'Simular tiempos de falla de equipos (exponencial) en Excel.', 'Líneas de espera y mantenimiento (método de Montecarlo).'],
      senales: ['simular', 'números aleatorios entre 0 y 1', 'generar datos'],
      como: ['Para cada u, plantea F(x) = u.', 'Normal: busca u en la tabla → z; luego x = μ + z·σ.', 'Exponencial: x = −μ·ln(1 − u).', 'Reporta los valores simulados.'],
      ej: {
        src: 'Sesión 47 · Simulación',
        q: 'Se desea simular 5 datos de una normal de media 500 y desviación 110 (como la PDT), con los números aleatorios 0,745 · 0,912 · 0,264 · 0,539 · 0,421.',
        steps: [
          'Para cada u se busca z con Φ(z) = u en la tabla y se calcula x = 500 + 110·z.',
          tbl(['u', 'z ≈ Φ⁻¹(u)', 'x = 500 + 110·z'], [['0,745', '0,66', '572,6'], ['0,912', '1,35', '648,5'], ['0,264', '−0,63', '430,7'], ['0,539', '0,10', '511,0'], ['0,421', '−0,20', '478,0']], 'tb-sm'),
          'Ej.: 0,745 está entre Φ(0,6) = 0,726 y Φ(0,7) = 0,758 → z ≈ 0,66.',
        ],
        res: '≈ 573 · 649 · 431 · 511 · 478',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: 'Simula un valor de cada distribución:',
          f: [fN('U(10, 30) con u = 0,25', 15, 0.01), fN('Exponencial de media 60 con u = 0,5 (x = −60·ln(1 − u))', 41.6, 0.1)],
          hint: 'a + (b − a)u · −60·ln(0,5).',
          sol: ['10 + 20·0,25 = <b>15</b>.', '−60·ln(0,5) = 60·0,693 = <b>41,6</b>.'],
        },
        {
          n: 2, src: 'Basado en Sesión 47', q: 'Simula tiempos N(26, 2²) con u₁ = 0,933 y u₂ = 0,159.',
          f: [fN('x₁', 29, 0.05), fN('x₂', 24, 0.05)],
          hint: 'Busca 0,933 y 0,159 en la tabla.',
          sol: ['Φ(1,5) = 0,933 → x₁ = 26 + 1,5·2 = <b>29</b>.', 'Φ(−1) = 0,159 → x₂ = 26 − 1·2 = <b>24</b>.'],
        },
        {
          n: 3, src: 'Nuevo · tipo examen', q: 'Simula tiempos de servicio exponenciales de media 12 min con u₁ = 0,2 y u₂ = 0,7 (usa x = −μ·ln(1 − u)).',
          f: [fN('x₁ (min)', 2.68, 0.02), fN('x₂ (min)', 14.45, 0.02)],
          hint: 'ln(0,8) y ln(0,3).',
          sol: ['x₁ = −12·ln(0,8) = 12·0,2231 = <b>2,68</b>.', 'x₂ = −12·ln(0,3) = 12·1,204 = <b>14,45</b>.'],
        },
      ],
      cq: [
        { q: 'El método de la transformada inversa consiste en:', o: ['Generar u ~ U(0, 1) y calcular x = F⁻¹(u)', 'Promediar números aleatorios', 'Calcular F(u)', 'Multiplicar u por la media'], ok: 0, exp: 'Se «lee al revés» la función de distribución acumulada.' },
        { q: 'Al simular una normal N(μ, σ²) con u = 0,5 se obtiene:', o: ['μ + σ', 'μ', '0', 'μ − σ'], ok: 1, exp: 'Φ⁻¹(0,5) = 0 → x = μ.' },
      ],
    },
  ],
});
