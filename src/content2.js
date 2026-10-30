/* =====================================================================
   UNIDAD 2 — PROBABILIDAD Y CONTEO       (Ítem III-a y base del Ítem V)
   UNIDAD 3 — DISTRIBUCIONES DISCRETAS    (Ítem III)
   ===================================================================== */
const TB_PADRES = tbl(['Asistió', 'F. Militar', 'No F. Militar', 'Total'], [['Sí', '114', '60', '174'], ['No', '9', '18', '27'], ['Total', '123', '78', '201']], 'tb-sm');

UNITS.push({
  id: 'u2', n: 2, title: 'Probabilidad y conteo', short: 'Probabilidad', item: 'Ítem III-a · 2 pts', color: 'u2', icon: 'dice',
  intro: 'Reglas para combinar eventos, tablas, Bayes y combinatoria (casos favorables / totales).',
  topics: [

    /* ---------------------------------------------------------- 2.1 */
    {
      id: 't21', title: 'Reglas básicas de probabilidad', map: 'Reglas básicas', icon: 'venn', exam: ['Ítem III', 'Ítem V'],
      def: `La probabilidad P(A) mide qué tan posible es un evento A, entre 0 (imposible) y 1 (seguro). Con resultados igualmente probables, P(A) = casos favorables / casos totales. Las reglas básicas permiten combinar eventos: <b>complemento</b> («no»), <b>aditiva</b> («o») y <b>multiplicativa</b> («y»).`,
      fig: svgVenn() + `<div class="formula-grid">
        <div>${eq('P(Aᶜ) = 1 − P(A)')}<span>complemento</span></div>
        <div>${eq('P(A ∪ B) = P(A) + P(B) − P(A ∩ B)')}<span>aditiva («o»)</span></div>
        <div>${eq('P(A ∩ B) = P(A)·P(B | A)')}<span>multiplicativa («y»)</span></div>
        <div>${eq('P(A ∩ B) = P(A)·P(B)')}<span>si son independientes</span></div></div>`,
      car: [
        'Complemento: P(Aᶜ) = 1 − P(A). Clave para «al menos uno» = 1 − P(ninguno).',
        'Aditiva: P(A ∪ B) = P(A) + P(B) − P(A ∩ B).',
        'Multiplicativa: P(A ∩ B) = P(A)·P(B | A).',
        '<b>Independientes</b>: P(A ∩ B) = P(A)·P(B) (uno no afecta al otro).',
        '<b>Mutuamente excluyentes</b>: P(A ∩ B) = 0 (no pueden ocurrir juntos).',
      ],
      casos: [
        'Base de todos los ítems de aplicación.',
        'Ítem V: sistemas en serie («todas funcionan» = y) y en paralelo («al menos una funciona»).',
        'Preguntas con «al menos uno», «ninguno», «ambos».',
      ],
      senales: ['al menos uno', 'ninguno', 'ambos', 'o', 'y', 'independientes'],
      como: [
        'Define los eventos con letras (A, B…).',
        'Traduce: «y» → ∩ · «o» → ∪ · «no» → complemento.',
        'Si son independientes, multiplica las probabilidades.',
        'Para «al menos uno» usa 1 − P(ninguno).',
      ],
      ej: {
        src: 'Sustitutiva 2026 · Ítem V (sistema NAC)',
        q: 'Cada componente nacional funciona más de 120 h con probabilidad 0,135, de forma independiente. ¿Probabilidad de que funcionen <b>ambas</b>? ¿Y de que funcione <b>al menos una</b>?',
        steps: [
          'Ambas (∩, independientes): 0,135 · 0,135 = 0,0183.',
          'Al menos una (∪): 0,135 + 0,135 − 0,0183 = 0,252.',
          'Con complemento: 1 − P(ninguna) = 1 − (1 − 0,135)² = 1 − 0,865² = 0,252 ✓ (mismo resultado, más rápido).',
        ],
        res: 'P(ambas) = 0,018 · P(al menos una) = 0,252',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: 'P(A) = 0,5; P(B) = 0,4 y P(A ∩ B) = 0,2. Calcula P(A ∪ B).',
          f: [fP('P(A ∪ B)', 0.7)],
          hint: 'Regla aditiva: suma y resta la intersección.',
          sol: ['P(A ∪ B) = 0,5 + 0,4 − 0,2 = <b>0,7</b>.'],
        },
        {
          n: 2, src: 'Nuevo · estilo Sesión 45 (tiros)', q: 'Dos tiradores disparan al mismo blanco de forma independiente. El primero acierta con probabilidad 0,7 y el segundo con 0,6. ¿Probabilidad de que el blanco sea alcanzado (al menos un acierto)?',
          f: [fP('P(al menos un acierto)', 0.88)],
          hint: 'Más fácil: 1 − P(ninguno acierta).',
          sol: ['P(ninguno) = 0,3 · 0,4 = 0,12 (independientes).', 'P(al menos uno) = 1 − 0,12 = <b>0,88</b>.'],
        },
        {
          n: 3, src: 'Nuevo · tipo examen', q: 'Un convoy pasa por dos puntos de control independientes. P(ser detenido en el 1º) = 0,3 y P(ser detenido en el 2º) = 0,2. Calcula:',
          f: [fP('P(detenido en al menos un punto)', 0.44), fP('P(detenido en exactamente un punto)', 0.38)],
          hint: '«Exactamente uno» = (detenido en 1 y no en 2) + (no en 1 y detenido en 2).',
          sol: ['Al menos uno: 1 − 0,7·0,8 = 1 − 0,56 = <b>0,44</b>.', 'Exactamente uno: 0,3·0,8 + 0,7·0,2 = 0,24 + 0,14 = <b>0,38</b>.'],
        },
      ],
      cq: [
        { q: 'Si A y B son mutuamente excluyentes, entonces P(A ∩ B) es:', o: ['P(A)·P(B)', '0', '1', 'P(A) + P(B)'], ok: 1, exp: 'No pueden ocurrir juntos: la intersección es vacía.' },
        { q: 'Si A y B son independientes:', o: ['P(A ∩ B) = 0', 'P(A | B) = P(A)', 'P(A ∪ B) = P(A)·P(B)', 'P(A) + P(B) = 1'], ok: 1, exp: 'Saber que ocurrió B no cambia la probabilidad de A.' },
      ],
    },

    /* ---------------------------------------------------------- 2.2 */
    {
      id: 't22', title: 'Tablas de doble entrada', map: 'Tablas de doble entrada', icon: 'grid', exam: ['Sesión 47'],
      def: `Una <b>tabla de doble entrada</b> (de contingencia) cruza dos variables. De ella salen tres tipos de probabilidad: <b>conjunta</b> (celda / total general), <b>marginal</b> (total de fila o columna / total general) y <b>condicional</b> (celda / total de la fila o columna que se da como condición).`,
      fig: `<div class="tb-wrap"><table class="tb tb-sm tb-2w"><thead><tr><th>Pentatlón</th><th>Aprobó</th><th>No aprobó</th><th>Total</th></tr></thead><tbody>
        <tr><th>Hombres</th><td>18</td><td>6</td><td>24</td></tr>
        <tr class="row-cond"><th>Mujeres</th><td class="cell-j">4</td><td>2</td><td class="cell-m">6</td></tr>
        <tr><th>Total</th><td class="cell-m">22</td><td>8</td><td><b>30</b></td></tr></tbody></table></div>
        <div class="legend-row"><span class="lg lg-j">conjunta: celda / 30</span><span class="lg lg-m">marginal: total / 30</span><span class="lg lg-c">condicional: celda / total de la condición</span></div>`,
      car: [
        'Conjunta: P(A ∩ B) = celda / N.',
        'Marginal: P(A) = total de A / N.',
        'Condicional: P(A | B) = celda / total de B (el «universo» se reduce a B).',
        'En general P(A | B) ≠ P(B | A): fíjate en <b>quién es la condición</b> («entre…», «dado que…», «si…»).',
      ],
      casos: [
        'Sesión 47: encuesta a padres (asistencia vs familia militar).',
        'Preguntas «al seleccionar un caso al azar…» y «entre los que…».',
        'Verificar independencia: P(A | B) = P(A).',
      ],
      senales: ['entre los…', 'dado que', 'si se sabe que', 'al seleccionar al azar', 'tabla'],
      como: [
        'Identifica si piden «A y B» (conjunta), «A» (marginal) o «A entre los B» (condicional).',
        'Ubica la celda o el total correspondiente.',
        'Divide por el total correcto: N (conjunta y marginal) o el total de la condición (condicional).',
      ],
      ej: {
        src: 'Nuevo · contexto Sustitutiva (curso de 30 cadetes)',
        q: 'Los 30 cadetes del curso (24 H, 6 M) rinden el pentatlón (tabla de la figura). Calcula: a) P(mujer y aprobó) b) P(aprobó) c) P(mujer | aprobó) d) P(aprobó | mujer).',
        steps: [
          'a) Conjunta: 4/30 = <b>0,133</b>.',
          'b) Marginal: 22/30 = <b>0,733</b>.',
          'c) Condicional, la condición es «aprobó» (22 casos): 4/22 = <b>0,182</b>.',
          'd) Condicional, la condición es «mujer» (6 casos): 4/6 = <b>0,667</b>. ¡Distinta de c!',
        ],
        res: '0,133 · 0,733 · 0,182 · 0,667',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: `Cadetes por compañía y sexo: ${tbl(['Compañía', 'Hombres', 'Mujeres', 'Total'], [['1ª', '40', '10', '50'], ['2ª', '35', '15', '50'], ['Total', '75', '25', '100']], 'tb-sm')}`,
          f: [fP('P(mujer)', 0.25), fP('P(2ª y mujer)', 0.15), fP('P(mujer | 2ª)', 0.30)],
          hint: 'La condicional «| 2ª» se divide por el total de la 2ª (50).',
          sol: ['P(M) = 25/100 = 0,25.', 'P(2ª ∩ M) = 15/100 = 0,15.', 'P(M | 2ª) = 15/50 = 0,30.'],
        },
        {
          n: 2, src: 'Sesión 47 · a) y b)', q: `Encuesta a los padres de los cadetes: ${TB_PADRES} a) ¿Probabilidad de que un caso al azar pertenezca a la familia militar y no haya asistido a la entrega de espadines? b) Entre los asistentes, ¿probabilidad de que no pertenezca a la familia militar?`,
          f: [fP('a) P(FM y no asistió)', 0.045, 0.002), fP('b) P(no FM | asistió)', 0.345, 0.002)],
          hint: 'a) es conjunta (/201). b) es condicional: «entre los asistentes» → /174.',
          sol: ['a) 9/201 = <b>0,045</b>.', 'b) 60/174 = <b>0,345</b>.'],
        },
        {
          n: 3, src: 'Nuevo · tipo examen', q: `Radios revisadas según proveedor: ${tbl(['Proveedor', 'OK', 'Falla', 'Total'], [['NAC', '45', '5', '50'], ['IMP', '27', '3', '30'], ['Total', '72', '8', '80']], 'tb-sm')}`,
          f: [fP('P(falla)', 0.1), fP('P(IMP | falla)', 0.375), fS('¿«Falla» es independiente del proveedor?', ['Sí, porque P(falla | NAC) = P(falla)', 'No, porque hay más NAC que IMP'], 0)],
          hint: 'Compara P(falla | NAC) = 5/50 con P(falla) = 8/80.',
          sol: ['P(falla) = 8/80 = 0,1.', 'P(IMP | falla) = 3/8 = 0,375.', 'P(falla | NAC) = 5/50 = 0,1 = P(falla) → <b>independientes</b>.'],
        },
      ],
      cq: [
        { q: 'En una tabla de doble entrada, P(A | B) se calcula como:', o: ['celda A∩B / total general', 'celda A∩B / total de B', 'total de A / total general', 'total de B / total de A'], ok: 1, exp: 'Se reduce el universo a B.' },
        { q: '«Entre los asistentes, ¿qué proporción no pertenece a la familia militar?» es una probabilidad:', o: ['Conjunta', 'Marginal', 'Condicional', 'Complementaria'], ok: 2, exp: '«Entre los asistentes» es la condición.' },
      ],
    },

    /* ---------------------------------------------------------- 2.3 */
    {
      id: 't23', title: 'Probabilidad total y teorema de Bayes', map: 'Prob. total y Bayes', icon: 'branch', exam: ['Ítem I'],
      def: `Si los eventos A₁, A₂, …, A<sub>k</sub> forman una <b>partición</b> (no se traslapan y cubren todo), la <b>probabilidad total</b> de B es la suma de los caminos: P(B) = Σ P(B | Aᵢ)·P(Aᵢ). El <b>teorema de Bayes</b> «invierte» la condición: P(Aⱼ | B) = P(B | Aⱼ)·P(Aⱼ) / P(B).`,
      fig: svgTree({ br: [{ l: 'NAC', p: '0,6', sub: [{ l: 'Falla', p: '0,865', prod: '0,519', hl: 1 }, { l: 'No falla', p: '0,135' }] }, { l: 'IMP', p: '0,4', sub: [{ l: 'Falla', p: '0,551', prod: '0,220', hl: 1 }, { l: 'No falla', p: '0,449' }] }] }),
      car: [
        'Se dibuja un <b>árbol</b>: primera rama = origen (Aᵢ); segunda rama = resultado (B o Bᶜ).',
        'Cada camino se multiplica (regla multiplicativa); los caminos que llevan a B se suman (probabilidad total).',
        'Bayes = (camino que interesa) / (suma de todos los caminos que llevan a B).',
        'Se usa cuando conoces P(resultado | origen) y te preguntan P(origen | resultado).',
      ],
      casos: [
        'Detectar de qué proveedor o lote viene una pieza defectuosa.',
        'Alarmas y detección (radar, sensores).',
        '«Si el sistema falló, ¿cuál es la probabilidad de que haya sido…?» (Sesión 47).',
      ],
      senales: ['¿probabilidad de que provenga de…?', 'porcentaje de cada proveedor', 'dado que falló', 'si se sabe que'],
      como: [
        'Identifica la partición (orígenes) y sus probabilidades P(Aᵢ).',
        'Identifica P(B | Aᵢ) para cada origen.',
        'Multiplica por rama: P(Aᵢ)·P(B | Aᵢ).',
        'Suma las ramas que llevan a B → P(B).',
        'Bayes: divide la rama de interés por P(B).',
      ],
      ej: {
        src: 'Nuevo · contexto Sustitutiva Ítem V',
        q: 'En bodega, 60% de las componentes son nacionales (media 60 h) y 40% importadas (media 150 h). La probabilidad de fallar antes de 120 h es 0,865 (NAC) y 0,551 (IMP). Se toma una al azar y falla antes de 120 h. ¿P(falla)? ¿P(sea nacional | falló)?',
        steps: [
          `P(F | NAC) = 1 − ${ex('e', '−120/60')} = 0,865 · P(F | IMP) = 1 − ${ex('e', '−120/150')} = 0,551.`,
          'Ramas que llevan a «falla»: 0,6·0,865 = 0,519 y 0,4·0,551 = 0,220.',
          'Probabilidad total: P(F) = 0,519 + 0,220 = <b>0,739</b>.',
          'Bayes: P(NAC | F) = 0,519 / 0,739 = <b>0,702</b>.',
        ],
        res: 'P(falla) = 0,739 · P(NAC | falla) = 0,702',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: 'La 1ª compañía prepara el 70% de las raciones (2% salen defectuosas) y la 2ª el 30% (5% defectuosas). Se elige una ración al azar.',
          f: [fP('P(defectuosa)', 0.029, 0.001), fP('P(2ª | defectuosa)', 0.517, 0.003)],
          hint: 'Ramas: 0,7·0,02 y 0,3·0,05.',
          sol: ['P(D) = 0,7·0,02 + 0,3·0,05 = 0,014 + 0,015 = <b>0,029</b>.', 'P(2ª | D) = 0,015 / 0,029 = <b>0,517</b>.'],
        },
        {
          n: 2, src: 'Nuevo · basado en Sesión 45 y 47', q: 'El 32% de los cadetes proviene de familia militar (FM). Asiste a la entrega de espadines el 93% de los padres FM y el 77% de los no FM.',
          f: [fP('P(asistió)', 0.821, 0.002), fP('P(FM | asistió)', 0.362, 0.003)],
          hint: 'Partición: FM (0,32) y no FM (0,68).',
          sol: ['P(A) = 0,32·0,93 + 0,68·0,77 = 0,2976 + 0,5236 = <b>0,821</b>.', 'P(FM | A) = 0,2976 / 0,8212 = <b>0,362</b>.'],
        },
        {
          n: 3, src: 'Nuevo · tipo examen', q: 'Un radar recibe contactos: el 5% son drones enemigos. La alarma suena con probabilidad 0,95 si es un dron y 0,10 si no lo es (falsa alarma).',
          f: [fP('P(alarma)', 0.1425, 0.002), fP('P(dron | alarma)', 0.333, 0.003)],
          hint: 'Ramas: 0,05·0,95 y 0,95·0,10.',
          sol: ['P(alarma) = 0,0475 + 0,095 = <b>0,1425</b>.', 'P(dron | alarma) = 0,0475 / 0,1425 = <b>0,333</b>: solo 1 de cada 3 alarmas es un dron real.'],
        },
      ],
      cq: [
        { q: 'Para aplicar el teorema de probabilidad total, los eventos A₁, …, A<sub>k</sub> deben:', o: ['Ser independientes', 'Formar una partición (excluyentes y que cubran todo)', 'Tener igual probabilidad', 'Ser complementos de B'], ok: 1, exp: 'Cada caso debe caer en exactamente un Aᵢ.' },
        { q: 'El teorema de Bayes permite calcular:', o: ['P(B) a partir de P(A)', 'P(origen | resultado) conociendo P(resultado | origen)', 'La probabilidad de la intersección de eventos independientes', 'El número de casos favorables'], ok: 1, exp: '«Invierte» la condicional.' },
      ],
    },

    /* ---------------------------------------------------------- 2.4 */
    {
      id: 't24', title: 'Conteo: combinaciones', map: 'Conteo: combinaciones', icon: 'combo', exam: ['Ítem III-a'],
      def: `Cuando todos los resultados son igualmente probables, P(A) = <b>casos favorables / casos totales</b>. Para contar grupos donde <b>no importa el orden</b> (comandos, patrullas, equipos) se usan <b>combinaciones</b>: ${bn('n', 'k')} = ${fr('n!', 'k!·(n − k)!')} = formas de elegir k elementos de n.`,
      fig: svgPeople({ N: 30, K: 6, ln: '24 hombres', lk: '6 mujeres', pick: [3, 11, 25, 27, 29] }) +
        eq(`P = ${fr(`${bn(6, 3)}·${bn(24, 2)}`, bn(30, 5))} = ${fr('casos favorables', 'casos totales')}`),
      car: [
        `${bn('n', 'k')} cuenta subconjuntos (no importa el orden). En la calculadora: tecla <b>nCr</b>.`,
        `Principio multiplicativo: elegir «k₁ de un grupo» <b>y</b> «k₂ de otro» → se multiplica: ${bn('K', 'k₁')}·${bn('N − K', 'k₂')}.`,
        `${bn('n', 0)} = ${bn('n', 'n')} = 1 · ${bn('n', 1)} = n · ${bn('n', 'k')} = ${bn('n', 'n − k')}.`,
        'Ejemplo: 30 nCr 5 = 142.506 comandos posibles.',
      ],
      casos: [
        'Ítem III-a: «probabilidad que el comando quede conformado por 3 mujeres y 2 hombres».',
        'Sesión 45: equipos de debate, comandos de visita instruccional.',
        'Cualquier selección al azar, sin reemplazo, de personas u objetos.',
      ],
      senales: ['seleccionar al azar un comando de k', 'conformado por', 'exactamente x de…', 'casos totales / favorables'],
      como: [
        `Casos totales: ${bn('N', 'n')} → formas de elegir el grupo completo.`,
        `Casos favorables: multiplica las formas de elegir cada parte: ${bn('mujeres', 'x')}·${bn('hombres', 'n − x')}.`,
        'Probabilidad = favorables / totales, con 3 decimales.',
      ],
      ej: {
        src: 'Sustitutiva 2026 · Ítem III-a',
        q: 'Si el curso tiene 30 cadetes, 24 de sexo masculino y 6 de sexo femenino, determine la probabilidad que al seleccionar al azar un comando de 5 cadetes, este quede conformado por tres mujeres y dos hombres (tres decimales).',
        steps: [
          `Casos totales: ${bn(30, 5)} = <b>142.506</b>.`,
          `Casos favorables: ${bn(6, 3)}·${bn(24, 2)} = 20 · 276 = <b>5.520</b>.`,
          `P = ${fr('5.520', '142.506')} = 0,0387 → <b>0,039</b>.`,
        ],
        res: 'Casos totales 142.506 · Favorables 5.520 · P = 0,039',
        err: 'En el intento se usó Z = (x − μ)/σ: esa fórmula es de la <b>normal</b> (variables continuas). Aquí se <b>cuentan personas</b> → combinatoria (hipergeométrica). Obtuvo 0 pts.',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: '¿De cuántas formas se puede elegir una patrulla de 3 cadetes entre 10?',
          f: [fN('Número de patrullas', 120, 0)],
          hint: '10 nCr 3.',
          sol: [`${bn(10, 3)} = ${fr('10·9·8', '3·2·1')} = <b>120</b>.`],
        },
        {
          n: 2, src: 'Examen 2023 · Ítem III-a', q: 'Si el curso tiene 26 cadetes, 22 de sexo masculino y 4 de sexo femenino, determine la probabilidad que al seleccionar al azar un comando de 5 cadetes, este quede conformado por una mujer y cuatro hombres (tres decimales).',
          f: [fN('Casos totales', 65780, 0), fN('Casos favorables', 29260, 0), fP('Probabilidad', 0.445, 0.001)],
          hint: `Totales: ${bn(26, 5)}. Favorables: ${bn(4, 1)}·${bn(22, 4)}.`,
          sol: [`Totales: ${bn(26, 5)} = 65.780.`, `Favorables: ${bn(4, 1)}·${bn(22, 4)} = 4 · 7.315 = 29.260.`, 'P = 29.260 / 65.780 = <b>0,445</b>.'],
        },
        {
          n: 3, src: 'Sesión 45 · equipo de debate', q: 'La 3ª compañía tiene 120 cadetes, de los cuales 25 son mujeres. Se forma un equipo de debate de 5 con exactamente 3 hombres y 2 mujeres. a) Si se eligen los 5 al azar. b) Si el jefe es el comandante de la sección 2 (hombre) y los otros 4 se eligen al azar entre los 119 restantes.',
          f: [fP('a) Probabilidad', 0.218, 0.002), fP('b) Probabilidad', 0.165, 0.002)],
          hint: 'b) Ya hay 1 hombre fijo: entre los 4 restantes faltan 2 hombres (de 94) y 2 mujeres (de 25).',
          sol: [`a) ${fr(`${bn(95, 3)}·${bn(25, 2)}`, bn(120, 5))} = ${fr('138.415 · 300', '190.578.024')} = <b>0,218</b>.`, `b) ${fr(`${bn(94, 2)}·${bn(25, 2)}`, bn(119, 4))} = ${fr('4.371 · 300', '7.940.751')} = <b>0,165</b>.`],
        },
      ],
      cq: [
        { q: 'Los casos totales al elegir al azar un comando de 5 cadetes de un curso de 30 son:', o: ['30·5 = 150', '30⁵', `${bn(30, 5)} = 142.506`, '5!'], ok: 2, exp: 'No importa el orden y no hay repetición → combinaciones.' },
        { q: 'Se usan combinaciones (y no permutaciones) cuando:', o: ['Importa el orden de selección', 'No importa el orden (solo quiénes quedan en el grupo)', 'Hay reemplazo', 'Los elementos son números'], ok: 1, exp: 'Un comando {Ana, Luis} es el mismo que {Luis, Ana}.' },
      ],
    },
  ],
});

/* =================================================================== */

UNITS.push({
  id: 'u3', n: 3, title: 'Distribuciones discretas', short: 'Discretas', item: 'Ítem III · 4 pts', color: 'u3', icon: 'hash',
  intro: 'Modelos para contar: Binomial, Hipergeométrica, Poisson y Binomial negativa.',
  topics: [

    /* ---------------------------------------------------------- 3.1 */
    {
      id: 't31', title: 'Distribución Binomial', map: 'Binomial', icon: 'crosshair', exam: ['Ítem I', 'Ítem III'],
      def: `X ~ Bin(n, p) cuenta el <b>número de éxitos</b> en <b>n ensayos de Bernoulli</b> independientes, cada uno con la misma probabilidad de éxito p.`,
      fig: eq(`P(X = k) = ${bn('n', 'k')}·${ex('p', 'k')}·${ex('(1 − p)', 'n − k')},  k = 0, 1, …, n`) +
        svgBars({ xs: [0, 1, 2, 3, 4, 5, 6, 7, 8], ps: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(k => [1, 8, 28, 56, 70, 56, 28, 8, 1][k] * 0.7 ** k * 0.3 ** (8 - k)), hl: [7, 8], cap: 'Bin(8; 0,7)' }),
      car: [
        '<b>n fijo</b>: se sabe de antemano cuántos intentos hay.',
        'Cada ensayo tiene dos resultados: éxito o fracaso.',
        '<b>p constante</b> e intentos independientes (con reemplazo o población muy grande).',
        'E(X) = n·p ; V(X) = n·p·(1 − p).',
        '«Al menos k» = P(X = k) + … + P(X = n), o 1 − P(X ≤ k − 1).',
      ],
      casos: [
        'Número de aciertos en una ronda de n tiros (Sesión 45, Examen 2023).',
        'Número de equipos que funcionan de n instalados, con p conocido.',
        'Número de paracaidistas que aterrizan en la zona.',
      ],
      senales: ['ronda de n tiros', 'proceso de Bernoulli', 'probabilidad de acertar p', 'de n, ¿cuántos…?', 'al menos / a lo más'],
      como: [
        'Verifica: n fijo, éxito/fracaso, p constante, independencia.',
        'Identifica n, p y los valores de k pedidos.',
        'Aplica la fórmula para cada k y suma si piden «al menos» o «a lo más».',
        'Redondea a 3 decimales al final.',
      ],
      ej: {
        src: 'Examen 2023 · Ítem III-b (la sustitutiva no trae binomial)',
        q: 'Usted realiza una ronda de n = 8 tiros a un blanco. Si la probabilidad de acertar es p = 0,7 y la sucesión de tiros es un proceso de Bernoulli, calcule la probabilidad de acertar al menos siete tiros.',
        steps: [
          'X ~ Bin(8; 0,7). «Al menos 7» = P(X = 7) + P(X = 8).',
          `P(X = 7) = ${bn(8, 7)}·0,7⁷·0,3¹ = 8 · 0,08235 · 0,3 = 0,1977.`,
          'P(X = 8) = 0,7⁸ = 0,0576.',
          'Suma: 0,1977 + 0,0576 = <b>0,255</b>.',
        ],
        res: 'P(X ≥ 7) = 0,255',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: 'Un tirador acierta con probabilidad 0,8. Dispara 5 tiros independientes. ¿Probabilidad de exactamente 4 aciertos?',
          f: [fP('P(X = 4)', 0.410, 0.002)],
          hint: `${bn(5, 4)} = 5.`,
          sol: [`P(X = 4) = ${bn(5, 4)}·0,8⁴·0,2 = 5 · 0,4096 · 0,2 = <b>0,410</b>.`],
        },
        {
          n: 2, src: 'Basado en Sesión 45 · Pregunta 3', q: 'Ronda de 10 tiros con probabilidad de acierto 0,6 (Bernoulli).',
          f: [fP('P(exactamente 7 aciertos)', 0.215, 0.002), fN('E(X)', 6, 0.01)],
          hint: `${bn(10, 7)} = 120.`,
          sol: [`P(X = 7) = 120 · 0,6⁷ · 0,4³ = 120 · 0,02799 · 0,064 = <b>0,215</b>.`, 'E(X) = 10 · 0,6 = <b>6</b> aciertos.'],
        },
        {
          n: 3, src: 'Nuevo · tipo examen', q: 'Saltan 12 paracaidistas; cada uno aterriza en la zona con probabilidad 0,9, de forma independiente.',
          f: [fP('P(al menos 11 en la zona)', 0.659, 0.002), fN('E(X)', 10.8, 0.01), fN('V(X)', 1.08, 0.01)],
          hint: 'Al menos 11 = P(11) + P(12).',
          sol: [`P(11) = ${bn(12, 11)}·0,9¹¹·0,1 = 0,3766 · P(12) = 0,9¹² = 0,2824.`, 'Suma = <b>0,659</b>.', 'E = 12·0,9 = 10,8 · V = 12·0,9·0,1 = 1,08.'],
        },
      ],
      cq: [
        { q: 'La v.a. que describe el número de aciertos en una ronda de 10 tiros es: <span class="src-inline">(Sesión 45)</span>', o: ['Una variable normal (dado que se repite) e interesa obtener la media y la desviación estándar', 'Una variable binomial (corresponde a sucesos Bernoulli)', 'Una variable Poisson, porque son eventos en el tiempo', 'Una variable exponencial, dado que hay tiempos entre disparos'], ok: 1, exp: 'n = 10 fijo, cada tiro es éxito/fracaso → binomial.' },
        { q: 'Si X ~ Bin(n, p), su varianza es:', o: ['n·p', 'n·p·(1 − p)', 'p·(1 − p)', '√(n·p)'], ok: 1, exp: 'n·p es la media; la varianza agrega el factor (1 − p).' },
      ],
    },

    /* ---------------------------------------------------------- 3.2 */
    {
      id: 't32', title: 'Distribución Hipergeométrica', map: 'Hipergeométrica', icon: 'urn', exam: ['Ítem III-a', 'Ítem I'],
      def: `X ~ Hiper(N, K, n) cuenta el número de éxitos al <b>seleccionar n elementos sin reemplazo</b> desde una población <b>finita</b> de N elementos, de los cuales K son «éxitos».`,
      fig: eq(`P(X = k) = ${fr(`${bn('K', 'k')}·${bn('N − K', 'n − k')}`, bn('N', 'n'))}`) +
        `<div class="param-row"><span><b>N</b> total</span><span><b>K</b> éxitos en la población</span><span><b>n</b> seleccionados</span><span><b>k</b> éxitos pedidos</span></div>` +
        svgPeople({ N: 30, K: 6, ln: 'N − K = 24 hombres', lk: 'K = 6 mujeres', pick: [3, 11, 25, 27, 29] }),
      car: [
        'Población finita y conocida (N), con K éxitos.',
        'Selección <b>sin reemplazo</b>: la probabilidad de éxito cambia en cada extracción (por eso no es binomial).',
        'E(X) = n·K/N.',
        'Es exactamente el cálculo «casos favorables / casos totales» con combinaciones.',
        'Si N es muy grande comparado con n, se parece a una binomial con p = K/N.',
      ],
      casos: [
        'Ítem III-a: mujeres en un comando de 5 elegido de 30.',
        'Sesión 45: cadetes de regiones en un comando de 10 (de 140).',
        'Piezas defectuosas en una muestra tomada de un lote.',
      ],
      senales: ['de un total de N, hay K…', 'se seleccionan n al azar', 'comando / equipo / muestra', 'exactamente k de…'],
      como: [
        'Identifica N (total), K (éxitos en la población), n (tamaño del grupo) y k (éxitos pedidos).',
        `Numerador: ${bn('K', 'k')}·${bn('N − K', 'n − k')}.`,
        `Denominador: ${bn('N', 'n')}.`,
        'Divide y redondea.',
      ],
      ej: {
        src: 'Sustitutiva 2026 · Ítem III-a (variante)',
        q: 'Curso de N = 30 cadetes con K = 6 mujeres; comando de n = 5. Sea X = nº de mujeres en el comando. a) P(X = 3) b) P(X = 0) c) E(X).',
        steps: [
          'X ~ Hiper(N = 30, K = 6, n = 5).',
          `a) P(X = 3) = ${fr(`${bn(6, 3)}·${bn(24, 2)}`, bn(30, 5))} = ${fr('20 · 276', '142.506')} = <b>0,039</b>.`,
          `b) P(X = 0) = ${fr(`${bn(6, 0)}·${bn(24, 5)}`, bn(30, 5))} = ${fr('42.504', '142.506')} = <b>0,298</b>.`,
          'c) E(X) = 5 · 6/30 = <b>1</b> mujer en promedio.',
        ],
        res: '0,039 · 0,298 · 1',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: 'Un lote de 10 radios tiene 3 defectuosas. Se eligen 2 al azar sin reemplazo. ¿Probabilidad de que ninguna sea defectuosa?',
          f: [fP('P(X = 0)', 0.467, 0.002)],
          hint: `N = 10, K = 3, n = 2, k = 0 → ${bn(7, 2)}/${bn(10, 2)}.`,
          sol: [`P = ${fr(`${bn(3, 0)}·${bn(7, 2)}`, bn(10, 2))} = ${fr('21', '45')} = <b>0,467</b>.`],
        },
        {
          n: 2, src: 'Sesión 45 · 4ª compañía', q: 'La 4ª compañía está constituida por 140 cadetes, de los cuales 35 son de regiones. Si usted elige 10 cadetes para un comando de visita instruccional, ¿cuál es la probabilidad de que entre los elegidos…',
          f: [fP('a) haya exactamente 2 de regiones', 0.289, 0.002), fP('b) no haya cadetes de regiones', 0.050, 0.002)],
          hint: 'N = 140, K = 35, n = 10. Usa nCr en la calculadora.',
          sol: [`a) ${fr(`${bn(35, 2)}·${bn(105, 8)}`, bn(140, 10))} = <b>0,289</b>.`, `b) ${fr(bn(105, 10), bn(140, 10))} = <b>0,050</b>.`],
        },
        {
          n: 3, src: 'Sesión 47 · c)', q: `En la encuesta a los padres (tabla), 114 de los 201 asistieron <b>y</b> pertenecen a la familia militar. ${TB_PADRES} Si selecciona 5 padres al azar, ¿cuál es la probabilidad de que exactamente dos hayan asistido y pertenezcan a la familia militar?`,
          f: [fP('Probabilidad', 0.263, 0.003)],
          hint: 'N = 201, K = 114, n = 5, k = 2.',
          sol: [`P = ${fr(`${bn(114, 2)}·${bn(87, 3)}`, bn(201, 5))} = ${fr('6.441 · 105.995', '2.600.334.990')} = <b>0,263</b>.`],
        },
      ],
      cq: [
        { q: 'La distribución hipergeométrica se utiliza cuando: <span class="src-inline">(Sesión 45)</span>', o: ['Se quiere evaluar la probabilidad de un éxito, la cual permanece constante', 'Se selecciona una muestra de una población finita e interesa el número de éxitos, y esta probabilidad de éxito cambia en el tiempo', 'Se observa un periodo de tiempo y se desea contar el número de éxitos', 'Interesa el número de intentos para lograr una cantidad k de éxitos'], ok: 1, exp: 'Población finita, sin reemplazo → la probabilidad cambia en cada extracción.' },
        { q: 'La diferencia clave entre la binomial y la hipergeométrica es que en la hipergeométrica:', o: ['Hay más de dos resultados', 'La selección es sin reemplazo desde una población finita', 'Se cuentan eventos en el tiempo', 'n no es fijo'], ok: 1, exp: 'En la binomial p es constante (ensayos independientes).' },
      ],
    },

    /* ---------------------------------------------------------- 3.3 */
    {
      id: 't33', title: 'Distribución de Poisson', map: 'Poisson', icon: 'burst', exam: ['Ítem III-b'],
      def: `X ~ Poisson(λ) cuenta el <b>número de eventos</b> que ocurren en un <b>intervalo</b> (de tiempo, espacio, etc.) cuando ocurren al azar a una tasa promedio constante. λ es la media de eventos <b>en el intervalo pedido</b>.`,
      fig: eq(`P(X = k) = ${fr(`${ex('e', '−λ')}·${ex('λ', 'k')}`, 'k!')},  k = 0, 1, 2, …     λ = tasa × largo del intervalo`) +
        svgRate({ T: 24, a: 12, b: 16, step: 4, ev: [0.8, 2.1, 3.9, 5.2, 7.5, 8.4, 10.6, 12.9, 13.8, 15.1, 17.7, 19.3, 21.2, 23.1], wl: 'λ = 14 · 4/24 = 2,33', cap: '14 misiles en 24 h → en una ventana de 4 h se esperan 2,33' }),
      car: [
        'λ es la media de eventos <b>en el intervalo que preguntan</b>: hay que <b>ajustar la tasa</b> (regla de tres).',
        'E(X) = V(X) = λ.',
        'No tiene máximo: k = 0, 1, 2, …',
        `P(ninguno) = ${ex('e', '−λ')} · P(al menos uno) = 1 − ${ex('e', '−λ')}.`,
      ],
      casos: [
        'Ítem III-b: misiles que caen sobre Kiev entre 12:00 y 16:00.',
        'Sesión 45: bombas sobre Róterdam por hora.',
        'Fallas de equipos por semana, llamadas por hora, llegadas a una fila.',
      ],
      senales: ['proceso Poisson', 'en promedio … por día / hora', 'entre las … y las … hrs', 'número de eventos en un periodo'],
      como: [
        'Identifica la tasa dada (ej. 14 por 24 h).',
        'Calcula el largo del intervalo pedido (12:00–16:00 = 4 h).',
        'λ = tasa × intervalo = 14 × 4/24 = 2,333.',
        'Aplica la fórmula con el k pedido (o suma / complemento).',
        'Redondea a 3 decimales.',
      ],
      ej: {
        src: 'Sustitutiva 2026 · Ítem III-b',
        q: 'Si el número de misiles que caen sobre Kiev se comporta como un proceso Poisson con una media de 14 diarios (24 hrs), determine la probabilidad de que entre las 12:00 y 16:00 hrs caigan sobre Kiev 3 misiles (tres decimales).',
        steps: [
          'Tipo de distribución: <b>Poisson</b>. Intervalo pedido: 4 h.',
          'Parámetro (tasa ajustada): λ = 14 · 4/24 = <b>2,333</b> misiles en 4 h.',
          `P(X = 3) = ${fr(`${ex('e', '−2,333')} · 2,333³`, '3!')} = ${fr('0,09697 · 12,704', '6')}`,
          '= <b>0,205</b>.',
        ],
        res: 'Poisson con λ = 2,333 → P(X = 3) = 0,205',
        err: 'En el intento se identificó Poisson, pero se usó la tasa de 24 h. La corrección dice «falta la tasa (λ)»: hay que <b>ajustarla a 4 h</b>.',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: 'A una central llegan en promedio 2 llamadas por hora (proceso Poisson). ¿Probabilidad de que no llegue ninguna llamada en una hora?',
          f: [fP('P(X = 0)', 0.135, 0.002)],
          hint: `P(X = 0) = ${ex('e', '−λ')}.`,
          sol: [`λ = 2 → P(X = 0) = ${ex('e', '−2')} = <b>0,135</b>.`],
        },
        {
          n: 2, src: 'Sesión 45 · Róterdam', q: 'Suponga que el bombardeo sobre Róterdam (14 mayo 1940) responde a un proceso Poisson: durante las 24 horas se arrojaron 57 bombas.',
          f: [fP('a) P(exactamente 5 bombas entre 10:00 y 12:00)', 0.174, 0.002), fP('b) P(ninguna bomba en media hora)', 0.305, 0.002), fP('c) P(una o más bombas entre 21:00 y 22:00)', 0.907, 0.002)],
          hint: 'Ajusta λ en cada parte: 2 h, 0,5 h y 1 h.',
          sol: [`a) λ = 57·2/24 = 4,75 → P(X = 5) = ${ex('e', '−4,75')}·4,75⁵/5! = <b>0,174</b>.`, `b) λ = 57·0,5/24 = 1,1875 → ${ex('e', '−1,1875')} = <b>0,305</b>.`, `c) λ = 57/24 = 2,375 → 1 − ${ex('e', '−2,375')} = <b>0,907</b>.`],
        },
        {
          n: 3, src: 'Nuevo · tipo examen', q: 'Un equipo de comunicaciones presenta en promedio 3 fallas por semana (7 días), según un proceso Poisson.',
          f: [fN('λ para 2 días', 0.857, 0.002), fP('P(al menos 2 fallas en 2 días)', 0.212, 0.002)],
          hint: `Al menos 2 = 1 − P(0) − P(1) = 1 − ${ex('e', '−λ')}(1 + λ).`,
          sol: ['λ = 3 · 2/7 = <b>0,857</b>.', `P(X ≥ 2) = 1 − ${ex('e', '−0,857')}·(1 + 0,857) = 1 − 0,4244·1,857 = <b>0,212</b>.`],
        },
      ],
      cq: [
        { q: 'En una distribución de Poisson con parámetro λ:', o: ['E(X) = λ y V(X) = λ²', 'E(X) = V(X) = λ', 'E(X) = 1/λ', 'V(X) = √λ'], ok: 1, exp: 'Media y varianza son iguales a λ.' },
        { q: 'Si en promedio caen 14 misiles al día, para calcular probabilidades en un intervalo de 4 horas se usa λ =', o: ['14', '14/4 = 3,5', '14·4/24 ≈ 2,33', '24/14'], ok: 2, exp: 'Regla de tres: 14 en 24 h → x en 4 h.' },
      ],
    },

    /* ---------------------------------------------------------- 3.4 */
    {
      id: 't34', title: 'Distribución Binomial negativa', map: 'Binomial negativa', icon: 'repeat', exam: ['Ítem I'],
      def: `X ~ BN(k, p) es el <b>número de ensayos</b> de Bernoulli necesarios para obtener el <b>k-ésimo éxito</b>. Con k = 1 se llama distribución <b>geométrica</b>.`,
      fig: eq(`P(X = x) = ${bn('x − 1', 'k − 1')}·${ex('p', 'k')}·${ex('(1 − p)', 'x − k')},  x = k, k + 1, …`) +
        `<div class="seq"><span class="no">✗</span><span class="si">✓</span><span class="no">✗</span><span class="si">✓</span><span class="si last">✓</span><em>3er acierto en el 5º tiro: en los 4 primeros hay 2 aciertos y el 5º es acierto</em></div>`,
      car: [
        'Lo fijo es el número de éxitos k; lo aleatorio es cuántos intentos se necesitan.',
        'El último ensayo es <b>siempre un éxito</b>; en los x − 1 anteriores hay k − 1 éxitos.',
        'E(X) = k/p ; V(X) = k(1 − p)/p².',
        'Es lo «opuesto» a la binomial: en la binomial n es fijo y se cuentan éxitos.',
      ],
      casos: [
        'Número de tiros hasta lograr el 3er acierto.',
        'Número de intentos de enlace radial hasta lograr k conexiones.',
        'Ítem I: identificar qué modela (Examen 2023).',
      ],
      senales: ['hasta lograr', 'hasta obtener el k-ésimo', 'número de intentos necesarios'],
      como: [
        'Identifica k (éxitos buscados) y p.',
        'Identifica x (el ensayo en que ocurre el k-ésimo éxito).',
        `Aplica ${bn('x − 1', 'k − 1')}·${ex('p', 'k')}·${ex('(1 − p)', 'x − k')}.`,
      ],
      ej: {
        src: 'Nuevo · contexto Examen 2023 (p = 0,7)',
        q: 'Un tirador acierta con p = 0,7. ¿Probabilidad de que el 3er acierto ocurra justo en el 5º tiro?',
        steps: [
          'X ~ BN(k = 3, p = 0,7), con x = 5.',
          'En los primeros 4 tiros debe haber exactamente 2 aciertos, y el 5º debe ser acierto.',
          `P = ${bn(4, 2)}·0,7³·0,3² = 6 · 0,343 · 0,09 = <b>0,185</b>.`,
        ],
        res: 'P(X = 5) = 0,185',
      },
      ex: [
        {
          n: 1, src: 'Nuevo', q: 'Un radio logra enlace con p = 0,4 en cada intento. ¿Probabilidad de que el primer enlace se logre en el 3er intento?',
          f: [fP('P(X = 3)', 0.144, 0.002)],
          hint: 'Geométrica: fallo, fallo, éxito.',
          sol: ['P = 0,6 · 0,6 · 0,4 = <b>0,144</b>.'],
        },
        {
          n: 2, src: 'Basado en Examen 2023 · Pregunta 4', q: 'Un tirador con p = 0,6 dispara hasta lograr 2 aciertos.',
          f: [fP('P(necesite exactamente 4 tiros)', 0.173, 0.002), fN('E(X) (tiros)', 3.333, 0.01)],
          hint: `k = 2, x = 4 → ${bn(3, 1)}·0,6²·0,4².`,
          sol: [`P = ${bn(3, 1)}·0,6²·0,4² = 3 · 0,36 · 0,16 = <b>0,173</b>.`, 'E(X) = k/p = 2/0,6 = <b>3,33</b> tiros.'],
        },
        {
          n: 3, src: 'Nuevo · tipo examen', q: 'Un radar detecta el blanco con p = 0,8 en cada pasada. ¿Probabilidad de que el 3er contacto ocurra <b>a lo más</b> en la 4ª pasada?',
          f: [fP('P(X ≤ 4)', 0.819, 0.002)],
          hint: 'P(X = 3) + P(X = 4).',
          sol: ['P(X = 3) = 0,8³ = 0,512.', `P(X = 4) = ${bn(3, 2)}·0,8³·0,2 = 0,3072.`, 'Suma = <b>0,819</b>.'],
        },
      ],
      cq: [
        { q: 'La distribución Binomial – Negativa permite representar: <span class="src-inline">(Examen 2023)</span>', o: ['Número de eventos en un intervalo de tiempo', 'Número de éxitos en n ensayos Bernoulli', 'Número de ensayos Bernoulli para obtener k éxitos', 'Número de éxitos al seleccionar n de N de una población finita'], ok: 2, exp: 'a) es Poisson, b) Binomial, d) Hipergeométrica.' },
        { q: 'En una binomial negativa, el último ensayo observado es:', o: ['Siempre un fracaso', 'Siempre un éxito', 'Puede ser éxito o fracaso', 'El primero'], ok: 1, exp: 'Se detiene justo al lograr el k-ésimo éxito.' },
      ],
    },
  ],
});
