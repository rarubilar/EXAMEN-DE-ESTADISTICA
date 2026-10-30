/* =====================================================================
   UNIDAD 1 — ESTADÍSTICA DESCRIPTIVA  (Ítem II del examen, 7 pts)
   ===================================================================== */
const D_SUST = [58, 44, 78, 52, 84, 98, 96, 62, 48, 79, 76, 67, 65];
const D_SUST_ORD = [44, 48, 52, 58, 62, 65, 67, 76, 78, 79, 84, 96, 98];
const D_PESO = [72, 65, 68, 94, 81, 78, 72, 67, 71, 73, 77, 68];
const D_T23 = [58, 34, 68, 52, 75, 98, 86, 52, 38, 79, 66, 57, 55];
const ASIM = ['Simétrica', 'Asimétrica a la derecha', 'Asimétrica a la izquierda'];

UNITS.push({
  id: 'u1', n: 1, title: 'Estadística descriptiva', short: 'Descriptiva', item: 'Ítem II · 7 pts', color: 'u1', icon: 'chart',
  intro: 'Resumir y graficar un conjunto de datos: tabla, histograma, medidas y boxplot.',
  topics: [

    /* ---------------------------------------------------------- 1.1 */
    {
      id: 't11', title: 'Población, muestra y parámetro', map: 'Población, muestra, parámetro', icon: 'users', exam: ['Ítem I'],
      def: `La <b>población</b> es el conjunto completo de elementos sobre el que queremos concluir. La <b>muestra</b> es la parte de la población que realmente observamos. Un <b>parámetro</b> es un número que describe a la población (μ, σ, p) y es <b>fijo</b>; un <b>estadístico</b> (o <b>estimación</b>) es un número calculado con la muestra (x̄, s, p̂) y <b>cambia</b> de muestra en muestra.`,
      fig: svgPop(),
      car: [
        'Población → <b>parámetro</b> (letras griegas: μ, σ, p). Muestra → <b>estadístico</b> (letras latinas: x̄, s, p̂).',
        'El parámetro es fijo (aunque casi siempre desconocido); el estadístico varía según quiénes salieron en la muestra.',
        'Si se mide a <b>todos</b> los elementos (censo), el valor obtenido es un parámetro.',
        'La muestra debe ser representativa (idealmente aleatoria) para que el estadístico sirva para estimar el parámetro.',
      ],
      casos: [
        'Ítem I: «¿esto corresponde a un parámetro o a una estimación?»',
        'Leer enunciados: «el tiempo de los cadetes se comporta como una normal de media 26» → μ = 26 es un parámetro del modelo.',
        'Distinguir si los datos del Ítem II (13 cadetes) son una muestra o toda la población.',
      ],
      senales: ['todos los cadetes', 'entre todos', 'una muestra de', 'se seleccionan', 'en la encuesta'],
      como: [
        'Identifica el <b>grupo completo</b> de interés → población.',
        'Identifica <b>quiénes fueron observados</b> → muestra (si son todos, es un censo).',
        'Pregúntate: ¿el número describe a todos (parámetro) o solo a los observados (estadístico)?',
        'Recuerda: el estadístico se usa para <b>estimar</b> el parámetro.',
      ],
      ej: {
        src: 'Sustitutiva 2026 · Ítems II y IV',
        q: `En el examen aparecen: (1) «Los tiempos en desarrollar el cuarto control se comportan como una distribución normal con una media de 26 min» (todos los cadetes) y (2) «los rendimientos de 13 cadetes en el pentatlón», cuyo promedio es 69,8 puntos. ¿Cuál es parámetro y cuál estadístico?`,
        steps: [
          '(1) La media 26 min describe el comportamiento de <b>todos</b> los cadetes (el modelo de la población) → es un <b>parámetro</b>: μ = 26, σ = 2.',
          '(2) Los 13 cadetes son los observados. El promedio 69,8 se calcula con esos datos → es un <b>estadístico</b>: x̄ = 69,8. Con otros 13 cadetes el promedio cambiaría.',
        ],
        res: 'μ = 26 → parámetro · x̄ = 69,8 → estadístico (estimación)',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: 'Para conocer el peso de <b>todos</b> los cadetes que ingresan a la Escuela Militar, se pesa a 12 de ellos. La <b>población</b> es:',
          o: ['Los 12 cadetes pesados', 'Todos los cadetes que ingresan a la Escuela Militar', 'El peso promedio de los 12 cadetes', 'Los cadetes que pesan más de 70 kg'], ok: 1,
          why: { 0: 'Esos 12 son la <b>muestra</b>.', 2: 'Eso es un número (un estadístico), no un conjunto de elementos.' },
          hint: 'La población es el grupo completo sobre el que quieres concluir.',
          sol: ['Se quiere concluir sobre <b>todos</b> los que ingresan → esa es la población.', 'Los 12 pesados son la muestra; su peso promedio es un estadístico.'],
        },
        {
          n: 2, src: 'Sesión 45 · Pregunta 2', q: 'Cuando se dice que, entre <b>todos</b> los Cadetes de la EM, el 32% proviene de la familia militar. Esto corresponde a:',
          o: ['Una estimación (ya que es una proporción)', 'Un valor que varía, dado que depende de quienes respondieron', 'Un parámetro, dado que caracteriza a la población de interés', 'Una realidad, ya que hay mucha cercanía entre ellos'], ok: 2,
          why: { 0: 'Que sea una proporción no la hace estimación: depende de si describe a todos o a una muestra.', 1: 'Se habla de <b>todos</b> los cadetes, no de una muestra de respuestas.' },
          hint: 'Fíjate en la palabra «todos».',
          sol: ['«Entre todos los Cadetes» → describe a la población completa.', 'Un valor que describe a la población es un <b>parámetro</b> (alternativa c).'],
        },
        {
          n: 3, src: 'Nuevo · tipo Ítem I',
          q: '¿Cuáles de los siguientes valores son <b>parámetros</b>?<br>I. La media de 26 min del tiempo de <b>todos</b> los cadetes en el cuarto control.<br>II. El promedio 69,8 de los 13 cadetes del pentatlón.<br>III. El 32% de <b>todos</b> los cadetes de la EM proviene de familia militar.<br>IV. En una encuesta a 201 padres, el 61% pertenece a la familia militar.',
          o: ['Solo I', 'I y III', 'II y IV', 'I, II y III'], ok: 1,
          why: { 0: 'III también describe a todos los cadetes.', 2: 'II y IV se calculan con una muestra → son estadísticos.', 3: 'II se calcula con 13 cadetes (muestra).' },
          hint: 'Parámetro = describe a todos. Estadístico = calculado con quienes fueron observados.',
          sol: ['I y III hablan de <b>todos</b> los cadetes → parámetros.', 'II (13 cadetes) y IV (201 encuestados) provienen de muestras → estadísticos.'],
        },
      ],
      cq: [
        { q: 'Un parámetro corresponde a un indicador que permite: <span class="src-inline">(Examen 2023)</span>', o: ['Describir una característica en una población de interés', 'Describir una característica en una muestra de una población de interés', 'Mostrar un valor que varía de muestra en muestra', 'Caracterizar exclusivamente el centro de una distribución'], ok: 0, exp: 'El parámetro describe a la <b>población</b>. Lo que varía de muestra en muestra es el estadístico.' },
        { q: 'Un estadístico (estimación) se caracteriza porque:', o: ['Es fijo y conocido', 'Varía de muestra en muestra', 'Solo se calcula con un censo', 'Siempre es igual al parámetro'], ok: 1, exp: 'Se calcula con los datos observados; otra muestra daría otro valor.' },
      ],
    },

    /* ---------------------------------------------------------- 1.2 */
    {
      id: 't12', title: 'Tipos de variables', map: 'Tipos de variables', icon: 'tag', exam: ['Ítem I'],
      def: `Una <b>variable</b> es la característica que se mide en cada elemento. Es <b>cualitativa</b> (categórica) si sus valores son categorías, y <b>cuantitativa</b> (numérica) si sus valores son números con los que tiene sentido calcular.`,
      fig: `<div class="vt">
        <div class="vt-root">Variable</div>
        <div class="vt-row">
          <div class="vt-col"><div class="vt-h">Cualitativa <small>(categorías)</small></div>
            <div class="vt-leaf"><b>Nominal</b><span>sin orden</span><em>sexo, arma, región</em></div>
            <div class="vt-leaf"><b>Ordinal</b><span>con orden</span><em>rango militar, satisfacción</em></div></div>
          <div class="vt-col"><div class="vt-h">Cuantitativa <small>(números)</small></div>
            <div class="vt-leaf"><b>Discreta</b><span>se cuenta</span><em>nº de misiles, nº de aciertos</em></div>
            <div class="vt-leaf"><b>Continua</b><span>se mide</span><em>tiempo, peso, distancia</em></div></div>
        </div></div>`,
      car: [
        '<b>Cualitativa nominal</b>: categorías sin orden (sexo, arma, región).',
        '<b>Cualitativa ordinal</b>: categorías con orden natural (rango militar, nivel de satisfacción bajo–medio–alto).',
        '<b>Cuantitativa discreta</b>: valores que se <b>cuentan</b> (0, 1, 2, …): nº de misiles, nº de aciertos.',
        '<b>Cuantitativa continua</b>: valores que se <b>miden</b> y pueden tomar cualquier valor de un intervalo: tiempo, peso.',
        'El tipo decide el gráfico: barras o circular para cualitativas; histograma o boxplot para cuantitativas.',
      ],
      casos: [
        'Ítem I: «el rango militar corresponde a una variable de tipo…»',
        'Elegir el gráfico correcto (Ítem II).',
        'Elegir la distribución: las discretas (Binomial, Poisson…) modelan conteos; las continuas (Normal, Exponencial…) modelan mediciones.',
      ],
      senales: ['número de…', 'tiempo', 'peso', 'categoría', 'nivel / grado / rango'],
      como: [
        '¿Los valores son números con sentido aritmético? Si no → <b>cualitativa</b>.',
        'Si es cualitativa: ¿hay un orden natural? Sí → <b>ordinal</b>; No → <b>nominal</b>.',
        'Si es cuantitativa: ¿se cuenta o se mide? Contar → <b>discreta</b>; medir → <b>continua</b>.',
        'Ojo: un código numérico (nº de compañía 1, 2, 3) sigue siendo cualitativo.',
      ],
      ej: {
        src: 'Sustitutiva 2026 · variables del examen',
        q: 'Clasifica: (a) rendimiento en el pentatlón (puntaje 0–100), (b) tiempo en desarrollar el cuarto control, (c) número de misiles que caen sobre Kiev, (d) sexo de los cadetes del comando.',
        steps: [
          '(a) Puntaje en puntos enteros, se cuenta → <b>cuantitativa discreta</b>.',
          '(b) El tiempo se mide (puede ser 25,7 min) → <b>cuantitativa continua</b>.',
          '(c) Nº de misiles: se cuenta → <b>cuantitativa discreta</b> (por eso se modela con Poisson).',
          '(d) Sexo: categorías sin orden → <b>cualitativa nominal</b>.',
        ],
        res: 'a) cuantitativa discreta · b) cuantitativa continua · c) cuantitativa discreta · d) cualitativa nominal',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: 'El <b>arma</b> de un cadete (Infantería, Artillería, Caballería, Ingenieros, Telecomunicaciones) es una variable:',
          o: ['Cuantitativa discreta', 'Cualitativa nominal', 'Cualitativa ordinal', 'Cuantitativa continua'], ok: 1,
          why: { 2: 'Las armas no tienen un orden natural (ninguna es «mayor» que otra).' },
          hint: 'Son categorías. ¿Tienen un orden natural?',
          sol: ['Los valores son categorías → cualitativa.', 'No hay orden entre ellas → <b>nominal</b>.'],
        },
        {
          n: 2, src: 'Examen 2023 · Ítem I-2', q: 'El rango militar corresponde a una variable de tipo:',
          o: ['Cualitativa discreta', 'Cuantitativa nominal', 'Cualitativa nominal', 'Cualitativa ordinal'], ok: 3,
          why: { 2: 'Los rangos sí tienen orden (subteniente < teniente < capitán…).', 0: '«Discreta» se usa para variables cuantitativas.', 1: '«Nominal» se usa para cualitativas.' },
          hint: 'Subteniente, teniente, capitán… ¿hay un orden?',
          sol: ['El rango es una categoría → cualitativa.', 'Los rangos tienen jerarquía (orden) → <b>ordinal</b>.'],
        },
        {
          n: 3, src: 'Nuevo · tipo Ítem I', q: '¿Cuál de las siguientes variables es <b>cuantitativa continua</b>?',
          o: ['Número de tiros acertados en una ronda', 'Peso de la mochila de campaña', 'Nivel de satisfacción con el rancho (1 a 5)', 'Número de cadetes de regiones en la compañía'], ok: 1,
          why: { 0: 'Se cuenta → discreta.', 2: 'Es una escala de categorías ordenadas → cualitativa ordinal.', 3: 'Se cuenta → discreta.' },
          hint: 'Busca la que se <b>mide</b> y puede tener decimales.',
          sol: ['El peso se mide y puede valer 25,4 kg → <b>continua</b>.', 'Los «número de…» son discretas; la satisfacción 1–5 es ordinal.'],
        },
      ],
      cq: [
        { q: 'Para representar una variable cualitativa nominal (ej. arma) el gráfico adecuado es:', o: ['Histograma', 'Gráfico de barras o circular', 'Boxplot', 'Gráfico de dispersión'], ok: 1, exp: 'Histograma y boxplot requieren datos numéricos.' },
        { q: 'El número de fallas de un equipo en una semana es una variable:', o: ['Cualitativa ordinal', 'Cuantitativa continua', 'Cuantitativa discreta', 'Cualitativa nominal'], ok: 2, exp: 'Se cuenta (0, 1, 2, …) → discreta. De hecho se modela con Poisson.' },
      ],
    },

    /* ---------------------------------------------------------- 1.3 */
    {
      id: 't13', title: 'Tabla de frecuencias', map: 'Tabla de frecuencias', icon: 'table', exam: ['Ítem II-a'],
      def: `Una <b>tabla de frecuencias</b> organiza los datos en categorías (o intervalos) e indica cuántos datos caen en cada una (<b>frecuencia absoluta</b> f) y qué parte del total representan (<b>porcentaje</b> = f / n × 100).`,
      fig: `<div class="fig-formula">${ic('table')}<div>${eq(`Porcentaje = ${fr('f', 'n')} × 100`)}<p>f = casos en la categoría · n = total de datos</p></div></div>` +
        tbl(['Categoría', 'Conteo', 'f', '%'], [['40 a 59', '<span class="tally">||||</span>', '4', '30,8'], ['60 a 79', '<span class="tally">|||| |</span>', '6', '46,2'], ['80 a 99', '<span class="tally">|||</span>', '3', '23,1'], ['Total', '', '<b>13</b>', '<b>100</b>']], 'tb-sm'),
      car: [
        'La suma de las frecuencias es <b>n</b> y la suma de los porcentajes es <b>100%</b> (± redondeo).',
        'Cada dato cae en <b>una sola</b> categoría; los extremos se incluyen (40 a 59 incluye 40 y 59).',
        'Porcentaje = f / n × 100, normalmente con 1 decimal.',
        'Puede agregarse la frecuencia acumulada (cuántos datos hay «hasta» esa categoría).',
      ],
      casos: [
        'Ítem II-a: «obtenga la tabla de frecuencias (casos y porcentajes)».',
        'Paso previo obligatorio para el histograma (Ítem II-b).',
        'Resumir registros militares (Sesión 47: pesos por categorías).',
      ],
      senales: ['tabule', 'tabla de frecuencias', 'casos y porcentajes', 'categorización'],
      como: [
        'Ordena los datos de menor a mayor (así es más difícil equivocarse al contar).',
        'Cuenta cuántos datos caen en cada intervalo.',
        'Verifica que la suma de frecuencias sea n.',
        'Calcula cada porcentaje: f / n × 100.',
        'Verifica que los porcentajes sumen ≈ 100%.',
      ],
      ej: {
        src: 'Sustitutiva 2026 · Ítem II-a',
        q: `Rendimientos (0–100) de 13 cadetes en el pentatlón: ${dataRow(D_SUST)} Categorías: 40 a 59, 60 a 79, 80 a 99.`,
        steps: [
          `Ordenamos: ${dataRow(['44', '48', '52', '58', '|', '62', '65', '67', '76', '78', '79', '|', '84', '96', '98'])}`,
          '40–59: 44, 48, 52, 58 → f = 4 · 60–79: 62, 65, 67, 76, 78, 79 → f = 6 · 80–99: 84, 96, 98 → f = 3. Total = 13 ✓',
          'Porcentajes: 4/13·100 = 30,8% · 6/13·100 = 46,2% · 3/13·100 = 23,1% (suman 100,1% por redondeo).',
          tbl(['Categoría', 'Frecuencia', 'Porcentaje'], [['40 a 59', '4', '30,8%'], ['60 a 79', '6', '46,2%'], ['80 a 99', '3', '23,1%'], ['Total', '13', '100%']], 'tb-sm'),
        ],
        res: 'f = 4 · 6 · 3 → 30,8% · 46,2% · 23,1%',
        err: 'En el intento faltó la columna de <b>porcentajes</b>: el enunciado pide «casos <u>y</u> porcentajes». Sin ella el punto no está completo.',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: `Puntajes de 10 cadetes en tiro: ${dataRow([26, 14, 31, 22, 19, 38, 24, 17, 35, 28])} Completa la tabla con las categorías 10–19, 20–29 y 30–39.`,
          f: [fN('f (10–19)', 3, 0), fN('f (20–29)', 4, 0), fN('f (30–39)', 3, 0), fN('% (10–19)', 30, 0.15), fN('% (20–29)', 40, 0.15), fN('% (30–39)', 30, 0.15)],
          hint: 'Ordena primero: 14, 17, 19, 22, … Con n = 10, cada dato vale 10%.',
          sol: ['Ordenados: 14 17 19 | 22 24 26 28 | 31 35 38.', 'f = 3, 4, 3 (total 10).', '% = 3/10·100 = 30 · 4/10·100 = 40 · 30.'],
        },
        {
          n: 2, src: 'Sesión 47 · c)', q: `Peso (kg) de 12 cadetes varones al ingresar a la EscMil: ${dataRow(D_PESO)} Tabula con las categorías 65–74, 75–84 y 85–94.`,
          f: [fN('f (65–74)', 8, 0), fN('f (75–84)', 3, 0), fN('f (85–94)', 1, 0), fN('% (65–74)', 66.7, 0.15), fN('% (75–84)', 25, 0.15), fN('% (85–94)', 8.3, 0.15)],
          hint: 'n = 12. Ordena: 65 67 68 68 71 72 72 73 | 77 78 81 | 94.',
          sol: ['Ordenados: 65 67 68 68 71 72 72 73 | 77 78 81 | 94.', 'f = 8, 3, 1 (total 12).', '% = 8/12·100 = 66,7 · 3/12·100 = 25,0 · 1/12·100 = 8,3.'],
        },
        {
          n: 3, src: 'Examen 2023 · Ítem II-a', q: `Rendimientos de 13 cadetes que postulan a telecomunicaciones: ${dataRow(D_T23)} Categorías: 25 a 49, 50 a 74, 75 a 99.`,
          f: [fN('f (25–49)', 2, 0), fN('f (50–74)', 7, 0), fN('f (75–99)', 4, 0), fN('% (25–49)', 15.4, 0.15), fN('% (50–74)', 53.8, 0.15), fN('% (75–99)', 30.8, 0.15)],
          hint: 'Ojo con los repetidos (52 aparece dos veces). n = 13.',
          sol: ['Ordenados: 34 38 | 52 52 55 57 58 66 68 | 75 79 86 98.', 'f = 2, 7, 4 (total 13).', '% = 15,4 · 53,8 · 30,8.'],
        },
      ],
      cq: [
        { q: 'En una tabla de frecuencias con n = 13 datos, una categoría con 4 casos representa:', o: ['4%', '13%', '30,8%', '40%'], ok: 2, exp: '4/13 × 100 = 30,8%.' },
        { q: 'La suma de los porcentajes de una tabla de frecuencias completa debe ser:', o: ['n', '1%', '100% (salvo redondeo)', 'Depende del número de categorías'], ok: 2, exp: 'Cada dato está en una sola categoría, así que entre todas cubren el 100%.' },
      ],
    },

    /* ---------------------------------------------------------- 1.4 */
    {
      id: 't14', title: 'Histograma y asimetría', map: 'Histograma y asimetría', icon: 'hist', exam: ['Ítem II-b', 'Ítem I'],
      def: `El <b>histograma</b> es un gráfico de barras <b>contiguas</b> para variables cuantitativas: la base de cada barra es un intervalo y la altura su frecuencia. Su <b>forma</b> muestra si la distribución es <b>simétrica</b> o <b>asimétrica</b> (sesgada) hacia un lado.`,
      fig: svgShapes(),
      car: [
        '<b>Simétrica</b>: un lado es aproximadamente el espejo del otro; media ≈ mediana.',
        '<b>Asimétrica a la derecha</b> (sesgo positivo): la <b>cola larga</b> va a la derecha (pocos valores muy altos); media > mediana.',
        '<b>Asimétrica a la izquierda</b> (sesgo negativo): la <b>cola larga</b> va a la izquierda (pocos valores muy bajos); media < mediana.',
        'La asimetría se nombra por el lado de la <b>cola</b>, NO por el lado donde está la barra más alta.',
        'A diferencia del gráfico de barras, el histograma no deja espacios entre las barras.',
      ],
      casos: [
        'Ítem II-b: «bosqueje el histograma; ¿la distribución es simétrica o asimétrica?»',
        'Sesión 47 d–e: decidir la asimetría con el gráfico o con media vs mediana.',
        'Ítem I: preguntas teóricas sobre asimetría.',
      ],
      senales: ['bosqueje', 'histograma', 'simétrica', 'asimétrica', 'cola', 'sesgo'],
      como: [
        'Construye primero la tabla de frecuencias.',
        'Eje X: los intervalos (contiguos). Eje Y: la frecuencia.',
        'Levanta una barra por intervalo con altura = frecuencia, sin espacios.',
        'Mira dónde está el pico y hacia dónde se alarga la cola.',
        'Pico al centro y lados parecidos → simétrica. Cola a la derecha → asimétrica a la derecha. Cola a la izquierda → asimétrica a la izquierda.',
        'Si puedes, confirma con media vs mediana.',
      ],
      ej: {
        src: 'Sustitutiva 2026 · Ítem II-b',
        q: 'Con la tabla del Ítem II-a (40–59: 4 · 60–79: 6 · 80–99: 3), bosqueje el histograma e indique la forma.',
        steps: [
          svgHist({ bins: [{ l: '40–59', f: 4 }, { l: '60–79', f: 6 }, { l: '80–99', f: 3 }], xlab: 'Rendimiento (puntos)' }),
          'La barra más alta está en el <b>centro</b> (60–79) y los lados son parecidos (4 y 3): no hay una cola larga hacia ningún lado.',
          'Confirmación: media = 907/13 = 69,8 y mediana = 67 → muy cercanas.',
        ],
        res: 'Distribución aproximadamente <b>simétrica</b>',
        err: 'En el intento se respondió «asimétrica a la izquierda». Con el pico al centro y lados similares (4 y 3), la forma es simétrica. La asimetría se nombra por la <b>cola</b>.',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: `Según el histograma, la distribución es: ${svgHist({ bins: [{ l: '0–24', f: 2 }, { l: '25–49', f: 3 }, { l: '50–74', f: 5 }, { l: '75–99', f: 9 }], w: 340, h: 190 })}`,
          o: ASIM, ok: 2, why: { 1: 'Las barras bajas (la cola) están a la <b>izquierda</b>.', 0: 'Las barras crecen hacia la derecha: no hay simetría.' },
          hint: '¿Hacia qué lado se «estira» la parte baja del gráfico?',
          sol: ['La barra alta está a la derecha y las barras bajas forman una cola hacia la izquierda.', 'Cola a la izquierda → <b>asimétrica a la izquierda</b> (media < mediana).'],
        },
        {
          n: 2, src: 'Sesión 47 · d)', q: `Pesos de 12 cadetes tabulados (65–74: 8, 75–84: 3, 85–94: 1). Basado en el histograma, la distribución es: ${svgHist({ bins: [{ l: '65–74', f: 8 }, { l: '75–84', f: 3 }, { l: '85–94', f: 1 }], w: 320, h: 190 })}`,
          o: ASIM, ok: 1, why: { 2: 'La cola (barras bajas) va hacia la derecha, no hacia la izquierda.' },
          hint: 'La mayoría pesa poco y unos pocos pesan mucho.',
          sol: ['Pico a la izquierda (65–74) y cola que se alarga hacia valores altos.', 'Cola a la derecha → <b>asimétrica a la derecha</b>. Coincide con media 73,8 > mediana 72.'],
        },
        {
          n: 3, src: 'Nuevo · tipo examen', q: `Rendimientos de 13 cadetes: ${dataRow([45, 62, 71, 78, 83, 85, 88, 90, 91, 93, 95, 97, 99])} Con las categorías 40–59, 60–79 y 80–99, tabula y decide la forma.`,
          f: [fN('f (40–59)', 1, 0), fN('f (60–79)', 3, 0), fN('f (80–99)', 9, 0), fS('La distribución es', ASIM, 2), fS('Media vs mediana', ['media > mediana', 'media ≈ mediana', 'media < mediana'], 2)],
          hint: 'Después de contar, mira hacia qué lado queda la cola. La media es 82,8 y la mediana 88.',
          sol: ['f = 1, 3, 9.', 'La barra alta está a la derecha; la cola va a la <b>izquierda</b> → asimétrica a la izquierda.', 'Media = 1077/13 = 82,8 < mediana = 88 ✓ (el 45 «arrastra» la media hacia abajo).'],
        },
      ],
      cq: [
        { q: 'Se dice que una distribución de datos tiene forma asimétrica a la izquierda si: I. Los datos se distribuyen equitativamente a los lados. II. La cola está hacia la izquierda. III. La media es mayor que la mediana. IV. La media y mediana coinciden. <span class="src-inline">(Examen 2023)</span>', o: ['Solo I', 'Solo II', 'II, III', 'II, IV'], ok: 1, exp: 'Asimétrica a la izquierda: cola a la izquierda (II) y media <b>menor</b> que la mediana, por eso III es falsa.' },
        { q: 'El Histograma: I. Es un tipo de gráfico de línea. II. Permite representar pares (X,Y). III. Permite visualizar simetría / asimetría de una distribución. <span class="src-inline">(Examen 2023)</span>', o: ['Solo III', 'II y III', 'I y II', 'I, II y III'], ok: 0, exp: 'Es de barras (no de línea) y no representa pares (eso es el de dispersión). Sirve para ver la forma.' },
      ],
    },

    /* ---------------------------------------------------------- 1.5 */
    {
      id: 't15', title: 'Medidas de tendencia central y dispersión', map: 'Tendencia central y dispersión', icon: 'target', exam: ['Ítem I', 'Ítem II'],
      def: `Las medidas de <b>tendencia central</b> indican el «centro» de los datos: <b>media</b> (promedio), <b>mediana</b> (deja 50% a cada lado) y <b>moda</b> (valor más repetido). Las de <b>dispersión</b> indican cuán separados están: <b>rango</b>, <b>varianza</b> y <b>desviación estándar</b>.`,
      fig: svgDots({ data: D_SUST_ORD, a: 40, b: 100, step: 10, mean: 907 / 13, med: 67 }) +
        `<div class="formula-grid">
          <div>${eq(`x̄ = ${fr('Σ x', 'n')}`)}<span>media</span></div>
          <div>${eq(`s² = ${fr('Σ (x − x̄)²', 'n − 1')}`)}<span>varianza</span></div>
          <div>${eq('s = √s²')}<span>desviación estándar</span></div>
          <div>${eq('Rango = máx − mín')}<span>rango</span></div></div>`,
      car: [
        'La <b>mediana</b> no se ve afectada por valores extremos; la <b>media</b> sí (se «arrastra» hacia la cola).',
        'Por eso: media > mediana → asimetría a la derecha; media < mediana → a la izquierda; media ≈ mediana → simétrica.',
        'La desviación estándar s está en las mismas unidades que los datos; la varianza en unidades al cuadrado.',
        'En la varianza muestral se divide por <b>n − 1</b>.',
      ],
      casos: [
        'Ítem I: interpretar la mediana («divide 50% y 50%»).',
        'Sesión 47 e): con la media 73,8 y la mediana, decidir la asimetría.',
        'Describir datos militares (peso, tiempos, puntajes).',
      ],
      senales: ['promedio', 'mediana', 'moda', 'desviación', 'varianza', 'dispersión'],
      como: [
        'Ordena los datos.',
        'Media: suma todos y divide por n.',
        'Mediana: si n es impar, el dato central (posición (n+1)/2); si n es par, el promedio de los dos centrales.',
        'Moda: el valor que más se repite (puede no existir o haber varias).',
        'Desviación estándar: resta la media a cada dato, eleva al cuadrado, suma, divide por n − 1 y saca raíz.',
      ],
      ej: {
        src: 'Sustitutiva 2026 · datos del Ítem II',
        q: `Para los 13 rendimientos ordenados ${dataRow(D_SUST_ORD)} calcula media, mediana, moda y rango.`,
        steps: [
          'Suma = 907 → media x̄ = 907 / 13 = <b>69,8</b>.',
          'n = 13 (impar) → mediana = dato en la posición 7 = <b>67</b>.',
          'Ningún valor se repite → <b>no hay moda</b>.',
          'Rango = 98 − 44 = <b>54</b>. (Desviación estándar: s ≈ 17,2 puntos.)',
          'Media (69,8) y mediana (67) cercanas → coincide con la forma casi simétrica del histograma.',
        ],
        res: 'x̄ = 69,8 · Me = 67 · sin moda · rango = 54 · s ≈ 17,2',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: `Datos: ${dataRow([4, 7, 7, 9, 13])} Calcula:`,
          f: [fN('Media', 8, 0.01), fN('Mediana', 7, 0.01), fN('Moda', 7, 0.01), fN('Rango', 9, 0.01)],
          hint: 'Suma = 40; n = 5 (impar) → la mediana es el 3er dato.',
          sol: ['Media = 40/5 = 8.', 'Mediana = 3er dato = 7.', 'Moda = 7 (se repite).', 'Rango = 13 − 4 = 9.'],
        },
        {
          n: 2, src: 'Sesión 47 · e)', q: `Pesos de 12 cadetes: ${dataRow(D_PESO)} La media es 73,8 kg. Calcula la mediana y decide la asimetría.`,
          f: [fN('Mediana (kg)', 72, 0.01), fS('Según media y mediana, la distribución es', ASIM, 1)],
          hint: 'n = 12 es par: promedia el 6º y el 7º dato ordenado.',
          sol: ['Ordenados: 65 67 68 68 71 <b>72 72</b> 73 77 78 81 94.', 'Mediana = (72 + 72)/2 = 72.', 'Media 73,8 > mediana 72 → <b>asimétrica a la derecha</b> (el 94 arrastra la media).'],
        },
        {
          n: 3, src: 'Nuevo · tipo examen', q: `Peso (kg) de 5 mochilas: ${dataRow([24, 26, 25, 29, 26])} Calcula media, varianza muestral y desviación estándar.`,
          f: [fN('Media', 26, 0.01), fN('Varianza s²', 3.5, 0.01), fN('Desviación s', 1.871, 0.005)],
          hint: 'Desviaciones respecto a 26: −2, 0, −1, 3, 0. Divide por n − 1 = 4.',
          sol: ['Media = 130/5 = 26.', 'Cuadrados de las desviaciones: 4, 0, 1, 9, 0 → suma 14.', 's² = 14/4 = 3,5 → s = √3,5 = 1,871 kg.'],
        },
      ],
      cq: [
        { q: 'En un conjunto de datos, la mediana se interpreta como: <span class="src-inline">(Sesión 45)</span>', o: ['El valor que divide 50% y 50% en torno a él', 'El valor que divide al 25% de los datos con valores más bajos y al 75% de los más altos', 'El valor que divide al 75% de los datos con valores más altos y al 25% de los más bajos', 'Es el valor central de los datos (promedio aritmético)'], ok: 0, exp: 'La mediana deja la mitad de los datos a cada lado. El promedio es la media, no la mediana.' },
        { q: 'Si en un conjunto de datos la media es mayor que la mediana, la distribución es:', o: ['Simétrica', 'Asimétrica a la derecha', 'Asimétrica a la izquierda', 'No se puede saber'], ok: 1, exp: 'Valores muy altos (cola derecha) suben la media pero no la mediana.' },
      ],
    },

    /* ---------------------------------------------------------- 1.6 */
    {
      id: 't16', title: 'Percentiles y resumen de 5 números', map: 'Percentiles y 5 números', icon: 'ruler', exam: ['Ítem II-c'],
      def: `El <b>percentil K</b> (P<sub>K</sub>) es el valor que deja aproximadamente el K% de los datos por debajo. Los <b>cuartiles</b> son C1 = P25, Mediana = P50 y C3 = P75. El <b>resumen de los 5 números</b> es: <b>Mín · C1 · Mediana · C3 · Máx</b>.`,
      fig: svgPositions({ data: D_SUST_ORD, marks: [{ pos: 4, t: 'C1' }, { pos: 7, t: 'Me' }, { pos: 10, t: 'C3' }] }) +
        `<div class="rule-card"><b>Regla del formulario</b><ol><li>Ordenar los datos.</li><li>L = n · K / 100.</li><li>¿L entero? <b>Sí</b> → promediar los datos en las posiciones L y L+1. <b>No</b> → subir L al entero siguiente y tomar ese dato.</li></ol></div>`,
      car: [
        'Método del curso: L = n·K/100.',
        'L <b>entero</b> → P<sub>K</sub> = promedio de los datos en las posiciones L y L+1.',
        'L <b>no entero</b> → se redondea L <b>hacia arriba</b> y P<sub>K</sub> es el dato en esa posición.',
        'Mín ≤ C1 ≤ Me ≤ C3 ≤ Máx; entre C1 y C3 está el 50% central de los datos.',
      ],
      casos: [
        'Ítem II-c: «obtenga el resumen de los 5 números».',
        'Sesión 47 b): «calcule e interprete el percentil 60».',
        'Es el insumo directo del boxplot (Ítem II-d).',
      ],
      senales: ['resumen de los 5 números', 'percentil', 'cuartil', 'C1, C3'],
      como: [
        'Ordena los datos de menor a mayor y numera las posiciones 1 … n.',
        'C1: L = n·25/100 · Mediana: L = n·50/100 · C3: L = n·75/100.',
        'Aplica la regla: entero → promedio de las posiciones L y L+1; no entero → sube al entero siguiente.',
        'Escribe: Mín, C1, Me, C3, Máx.',
      ],
      ej: {
        src: 'Sustitutiva 2026 · Ítem II-c',
        q: `13 rendimientos ordenados: ${dataRow(D_SUST_ORD)}`,
        steps: [
          'C1: L = 13·25/100 = 3,25 → no es entero → posición 4 → <b>C1 = 58</b>.',
          'Mediana: L = 13·50/100 = 6,5 → posición 7 → <b>Me = 67</b>.',
          'C3: L = 13·75/100 = 9,75 → posición 10 → <b>C3 = 79</b>.',
          'Mín = 44 y Máx = 98.',
        ],
        res: 'Mín 44 · C1 58 · Me 67 · C3 79 · Máx 98',
        err: 'En el intento esta parte quedó en blanco (2 pts). Es un procedimiento mecánico: ordenar los datos y aplicar la regla de L.',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: `Datos (n = 8): ${dataRow([11, 3, 8, 15, 6, 12, 5, 9])} Obtén el resumen de los 5 números.`,
          f: [fN('Mín', 3, 0.01), fN('C1', 5.5, 0.01), fN('Mediana', 8.5, 0.01), fN('C3', 11.5, 0.01), fN('Máx', 15, 0.01)],
          hint: 'Con n = 8 todos los L resultan enteros (2, 4, 6): promedia las posiciones L y L+1.',
          sol: ['Ordenados: 3 5 6 8 9 11 12 15.', 'C1: L = 2 → (5 + 6)/2 = 5,5.', 'Me: L = 4 → (8 + 9)/2 = 8,5.', 'C3: L = 6 → (11 + 12)/2 = 11,5.'],
        },
        {
          n: 2, src: 'Sesión 47 · a) y b)', q: `Pesos de 12 cadetes: ${dataRow(D_PESO)} Obtén el resumen de los 5 números y el percentil 60.`,
          f: [fN('Mín', 65, 0.01), fN('C1', 68, 0.01), fN('Mediana', 72, 0.01), fN('C3', 77.5, 0.01), fN('Máx', 94, 0.01), fN('P60', 73, 0.01)],
          hint: 'n = 12 → L = 3, 6 y 9 (enteros). Para P60: L = 7,2.',
          sol: ['Ordenados: 65 67 68 68 71 72 72 73 77 78 81 94.', 'C1: L = 3 → (68 + 68)/2 = 68 · Me: L = 6 → (72 + 72)/2 = 72 · C3: L = 9 → (77 + 78)/2 = 77,5.', 'P60: L = 12·60/100 = 7,2 → posición 8 → <b>73</b>: el 60% de los cadetes pesa 73 kg o menos.'],
        },
        {
          n: 3, src: 'Examen 2023 · Ítem II-c', q: `Rendimientos de 13 cadetes: ${dataRow(D_T23)}`,
          f: [fN('Mín', 34, 0.01), fN('C1', 52, 0.01), fN('Mediana', 58, 0.01), fN('C3', 75, 0.01), fN('Máx', 98, 0.01)],
          hint: 'n = 13 como en la sustitutiva: posiciones 4, 7 y 10.',
          sol: ['Ordenados: 34 38 52 <b>52</b> 55 57 <b>58</b> 66 68 <b>75</b> 79 86 98.', 'C1 = 4º = 52 · Me = 7º = 58 · C3 = 10º = 75.'],
        },
      ],
      cq: [
        { q: 'El percentil 25 (C1) es el valor que:', o: ['Deja el 25% de los datos por encima', 'Deja aproximadamente el 25% de los datos por debajo', 'Es el promedio de los 25 primeros datos', 'Es igual a la media menos 25%'], ok: 1, exp: 'P<sub>K</sub> deja K% de los datos por debajo.' },
        { q: 'Entre el primer cuartil (C1) y el tercer cuartil (C3) se encuentra:', o: ['El 25% de los datos', 'El 50% central de los datos', 'El 75% de los datos', 'Todos los datos menos los anómalos'], ok: 1, exp: 'De 25% a 75% hay un 50%: es la «caja» del boxplot.' },
      ],
    },

    /* ---------------------------------------------------------- 1.7 */
    {
      id: 't17', title: 'Boxplot y valores anómalos', map: 'Boxplot y anómalos', icon: 'boxplot', exam: ['Ítem II-d'],
      def: `El <b>gráfico de caja y bigotes</b> (boxplot o «cajón con bigotes») dibuja el resumen de 5 números: una <b>caja</b> de C1 a C3 con una línea en la mediana, y <b>bigotes</b> hacia los extremos. Un dato es <b>anómalo</b> si queda fuera de las vallas: menor que C1 − 1,5·RIQ o mayor que C3 + 1,5·RIQ, con RIQ = C3 − C1.`,
      fig: svgBox({ mn: 44, q1: 58, me: 67, q3: 79, mx: 98, lo: 26.5, hi: 110.5, a: 20, b: 120, step: 10 }),
      car: [
        'RIQ (rango intercuartílico) = C3 − C1: dispersión del 50% central.',
        'Valla inferior LI = C1 − 1,5·RIQ; valla superior LS = C3 + 1,5·RIQ.',
        'Los bigotes llegan hasta el dato más extremo que <b>no</b> es anómalo; los anómalos se marcan con un punto.',
        'Una caja o bigote más largo hacia un lado indica asimetría hacia ese lado.',
      ],
      casos: [
        'Ítem II-d: «bosqueje el gráfico de caja y línea e indique si existen valores anómalos».',
        'Sesión 47 a): pesos con un cadete de 94 kg (anómalo).',
        'Detectar errores de digitación o casos extraordinarios.',
      ],
      senales: ['caja y línea', 'cajón con bigotes', 'boxplot', 'anómalos', 'atípicos'],
      como: [
        'Calcula el resumen de 5 números.',
        'RIQ = C3 − C1.',
        'LI = C1 − 1,5·RIQ y LS = C3 + 1,5·RIQ.',
        'Revisa si algún dato es menor que LI o mayor que LS → anómalo.',
        'Dibuja: eje con escala, caja C1–C3, línea en Me, bigotes hasta el último dato no anómalo y los anómalos como puntos.',
      ],
      ej: {
        src: 'Sustitutiva 2026 · Ítem II-d',
        q: 'Con el resumen 44 · 58 · 67 · 79 · 98, bosqueje el gráfico de caja y bigotes e indique si existen valores anómalos.',
        steps: [
          'RIQ = 79 − 58 = 21 → 1,5·RIQ = 31,5.',
          'LI = 58 − 31,5 = 26,5 · LS = 79 + 31,5 = 110,5.',
          'Ningún dato es menor que 26,5 ni mayor que 110,5 → <b>no hay valores anómalos</b>; los bigotes llegan a 44 y 98.',
          svgBox({ mn: 44, q1: 58, me: 67, q3: 79, mx: 98, lo: 26.5, hi: 110.5, a: 20, b: 120, step: 10 }),
        ],
        res: 'RIQ = 21 · LI = 26,5 · LS = 110,5 · sin valores anómalos',
        err: 'En el intento esta parte quedó en blanco (2 pts). Con el resumen de 5 números ya hecho, son solo 3 cuentas y un dibujo.',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: 'Resumen de 5 números: Mín 10 · C1 20 · Me 25 · C3 30 · Máx 52.',
          f: [fN('RIQ', 10, 0.01), fN('LI', 5, 0.01), fN('LS', 45, 0.01), fS('¿Hay anómalos?', ['No hay anómalos', 'Sí: el máximo (52)', 'Sí: el mínimo (10)'], 1)],
          hint: 'RIQ = C3 − C1. Compara el máximo con LS.',
          sol: ['RIQ = 30 − 20 = 10; 1,5·RIQ = 15.', 'LI = 20 − 15 = 5; LS = 30 + 15 = 45.', '52 > 45 → el máximo es <b>anómalo</b>; el bigote derecho llega al mayor dato ≤ 45.'],
        },
        {
          n: 2, src: 'Sesión 47 · a)', q: 'Pesos de 12 cadetes, resumen: 65 · 68 · 72 · 77,5 · 94.',
          f: [fN('RIQ', 9.5, 0.01), fN('LI', 53.75, 0.01), fN('LS', 91.75, 0.01), fS('¿Hay anómalos?', ['No hay anómalos', 'Sí: 94 kg', 'Sí: 65 kg', 'Sí: 65 y 94 kg'], 1)],
          hint: '1,5 × 9,5 = 14,25.',
          sol: ['RIQ = 77,5 − 68 = 9,5 → 1,5·RIQ = 14,25.', 'LI = 68 − 14,25 = 53,75 · LS = 77,5 + 14,25 = 91,75.', '94 > 91,75 → <b>94 kg es anómalo</b>. ' + svgBox({ mn: 65, q1: 68, me: 72, q3: 77.5, mx: 94, wr: 81, out: [94], lo: 53.75, hi: 91.75, a: 50, b: 100, step: 10, dd: 2 })],
        },
        {
          n: 3, src: 'Examen 2023 · tipo Ítem II-d', q: 'Rendimientos de 13 cadetes, resumen: 34 · 52 · 58 · 75 · 98.',
          f: [fN('RIQ', 23, 0.01), fN('LI', 17.5, 0.01), fN('LS', 109.5, 0.01), fS('¿Hay anómalos?', ['No hay anómalos', 'Sí: 98', 'Sí: 34', 'Sí: 34 y 98'], 0)],
          hint: '1,5 × 23 = 34,5.',
          sol: ['RIQ = 75 − 52 = 23 → 1,5·RIQ = 34,5.', 'LI = 52 − 34,5 = 17,5 · LS = 75 + 34,5 = 109,5.', 'Todos los datos están entre 17,5 y 109,5 → <b>no hay anómalos</b>.'],
        },
      ],
      cq: [
        { q: 'En un boxplot, la línea dentro de la caja representa:', o: ['La media', 'La mediana', 'La moda', 'El rango'], ok: 1, exp: 'La caja va de C1 a C3 y la línea interior es la mediana (P50).' },
        { q: 'Un dato se considera anómalo si:', o: ['Es mayor que la media', 'Está fuera del intervalo [C1 − 1,5·RIQ ; C3 + 1,5·RIQ]', 'Es el máximo o el mínimo', 'Está fuera de la caja'], ok: 1, exp: 'Es el criterio del formulario. Estar fuera de la caja es normal (allí está el 50% de los datos).' },
      ],
    },
  ],
});
