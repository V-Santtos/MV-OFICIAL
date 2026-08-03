/**
 * Presets de animação — Framer Motion CENTRALIZADO.
 * Fonte única de easings, durações e variantes de entrada.
 *
 * Regra do projeto: nenhuma seção define curvas/variantes soltas (o legado
 * espalhava `rv`/`hv`/`fadeUp` em cada arquivo). Importe daqui.
 *
 * Nota: GSAP é Fase 2. Por ora, todo movimento passa por estes presets.
 */

import type { Variants } from "framer-motion";

/** Curvas de easing padrão do projeto. */
export const easing = {
  /** Saída suave (revelações de conteúdo). */
  out: [0.16, 1, 0.3, 1] as const,
  /** Curva de títulos (entrada mais longa e assentada). */
  heading: [0.25, 0.4, 0.25, 1] as const,
};

/** Durações base (segundos). */
export const duration = {
  fast: 0.42,
  base: 0.6,
  slow: 1,
};

/** Viewport padrão para animações on-scroll (dispara uma vez). */
export const viewportOnce = { once: true, margin: "-48px" } as const;
export const viewportHeading = { once: true, amount: 0.4 } as const;

/**
 * Revelação simples de conteúdo (fade + subida curta).
 * Uso: <motion.div {...revealUp()} />  ou  {...revealUp(0.1)} p/ delay.
 */
export const revealUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: duration.fast, delay, ease: easing.out },
  viewport: viewportOnce,
});

/**
 * Revelação de cabeçalho de seção (eyebrow + título).
 * Movimento mais longo e presente.
 */
export const revealHeading = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: duration.slow, delay: 0.1, ease: easing.heading },
  viewport: viewportHeading,
};

/**
 * Cabeçalho SÓ opacidade (sem `y` de subida), para uso CONTROLADO via `useInView`
 * + animate="visible". Necessário em Depoimentos: a seção vem logo após o Processo
 * PINADO, onde o `whileInView` disparava "preso invisível" — o fade terminava
 * antes de o título entrar de fato na vista, e o começo sereno se perdia. (Victor.)
 */
export const revealHeadingFadeVariants: Variants = {
  hidden: { opacity: 0 },
  // 1.0s (era 2s): com o palco (.beat) dando o tempo do título sozinho, o fade
  // precisa COMPLETAR enquanto o título está centrado — a 2s ele só ficava cheio
  // depois de sair pelo topo (medido por probe). Sereno, mas presente. (Victor.)
  visible: { opacity: 1, transition: { duration: 1.0, ease: easing.out } },
};

/**
 * Cabeçalho de seção como VARIANTS (mesma curva/tempo do `revealHeading`, mas
 * para uso CONTROLADO via `useInView` + animate="visible"). Usar quando o
 * `whileInView` é arriscado — ex.: logo após uma seção PINADA, onde ele já
 * disparou "preso invisível" (Serviços, após o Círculo). (Victor, 2026-07-17.)
 */
export const revealHeadingVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, delay: 0.1, ease: easing.heading },
  },
};

/**
 * Entrada SUAVE no MOUNT — hero das rotas /servicos/[slug] (acima da dobra, então
 * dispara no load, não no scroll). Fade dominante + subida bem curta (y:14),
 * mais GENTIL que a cascata de conteúdo (`staggerCard`/`revealHeading`): título e
 * subtítulo sobem de leve, escalonados. Uso CONTROLADO (initial="hidden" +
 * animate="visible" no container); `custom` = índice (0 título → 1 subtítulo).
 * (Victor, 2026-07-23: "efeito de entrada, só que mais suave".)
 */
export const softRiseOnMount: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, delay: 0.1 + i * 0.2, ease: easing.out },
  }),
};

/**
 * Reveal de bloco que DESLIZA de um lado e ASSENTA — usado no "O que é" das
 * páginas de serviço: a foto grande entra da esquerda (x negativo → 0) + fade +
 * micro-scale, na curva expo-out (`easing.out`): corre e DESACELERA forte no fim
 * = "chega e pousa", sem quicar. (Victor, 2026-07-18.) Uso CONTROLADO (useInView
 * + animate="visible"), nunca whileInView — que dispara "preso invisível" com o
 * Lenis. `custom` = distância/sentido em px (negativo = vem da esquerda).
 * reduced-motion: aplicar sem o `x` no componente.
 */
export const revealFromSide: Variants = {
  hidden: (fromX: number = -72) => ({ opacity: 0, x: fromX, scale: 0.985 }),
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: duration.slow, ease: easing.out },
  },
};

/**
 * Coluna de texto que acompanha o `revealFromSide` — entra LOGO DEPOIS do card
 * (delay curto), num fade-up sóbrio: o olho pousa na foto, depois lê. Uso
 * CONTROLADO no mesmo gatilho do bloco.
 */
export const revealAfter: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, delay: 0.18, ease: easing.out },
  },
};

/**
 * Fade puro no load (cenário do hero: carro + luzes) — sem deslocamento,
 * para elementos "ambientais" que não devem parecer entrar na cena.
 */
export const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: duration.slow, delay, ease: easing.out },
});

/**
 * Cards que sobem em sequência dentro de um grid (processo).
 * `custom={i}` = índice do card.
 */
export const staggerCard: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, delay: 0.18 + i * 0.13, ease: easing.out },
  }),
};

/**
 * Cascata de entrada SÓ OPACIDADE, LENTA e PERCEPTÍVEL — cards da cobertura da
 * rota /servicos. Duas razões:
 * (1) Só opacidade (sem transform) porque o `:hover` do card é `translateY`
 *     (emboss neumórfico); um transform inline VENCE a folha e mataria o hover.
 * (2) Fade BEM LENTO (1.5s) + stagger largo (0.18) pra a cascata ser vista card
 *     a card. Dispara no gatilho do GRID (separado do cabeçalho) → entra DEPOIS
 *     do título/subtítulo (Victor, 2026-07-23: "bem mais lenta, perceptível").
 * `custom={i}` = índice 0-based.
 */
export const staggerFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 1.5, delay: 0.1 + i * 0.18, ease: easing.heading },
  }),
};

/**
 * Colunas do mural de Depoimentos — entrada em CASCATA coluna a coluna (Victor,
 * 2026-07-17). O mural é um marquee infinito (já nasce cheio/em movimento), que
 * é anti-cascata: então as 3 colunas entram em stagger (fade + rise) DEPOIS de o
 * título ter o beat dele sozinho na tela. Uso: container com useInView +
 * animate="visible"; cada coluna herda e usa `custom={i}`. Delay maior que o
 * `staggerCard` p/ a esteira ser sentida entrando, não "aparecendo pronta".
 */
export const columnCascade: Variants = {
  hidden: { opacity: 0, y: 44 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, delay: i * 0.18, ease: easing.out },
  }),
};

/**
 * Stats do Posicionamento — entrada em CASCATA stat a stat (lapidação
 * 2026-07-17, Victor): cada um dos 4 blocos entra individualmente (não mais o
 * container monolítico). O contador numérico dispara sincronizado à entrada do
 * próprio bloco (config `statCounter`). Uso: container com initial="hidden" +
 * animate="visible" (via useInView); filhos herdam e usam `custom={i}`.
 * (A "régua editorial" no topo de cada stat foi testada e REMOVIDA — Victor.)
 */
export const statCascade: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, delay: i * 0.12, ease: easing.out },
  }),
};

/** Contador dos stats: mais lento que o antigo (800ms) e escalonado igual aos
 *  blocos — número e bloco chegam como uma coisa só. */
export const statCounter = {
  /** Duração do count-up (ms). */
  duration: 1400,
  /** Delay por índice (s) — espelha o stagger do `statCascade`. */
  delayPerIndex: 0.12,
} as const;

/**
 * Intro de abertura — a logo MV se desenha (contorno → preenche) num painel
 * que cobre a tela e sobe revelando o Hero. Efeito referência do portfólio do
 * Victor, reconstruído em GSAP (mesma técnica: `strokeDashoffset` + timeline),
 * decisão do Victor por fidelidade/qualidade. É a exceção "tecnológica" em
 * GSAP; o resto do site segue em Framer Motion.
 *
 * Config em eases nomeados do GSAP (não os arrays de bezier do Framer). A
 * orquestração vive em `components/layout/IntroReveal`.
 */
export const intro = {
  /** Traço do contorno — as duas formas em stagger (igual à referência).
   *  A logo começa a se desenhar no 1º frame (sem delay inicial — Victor, 2026-07-16). */
  draw: { duration: 1.1, ease: "power2.inOut", stagger: 0.16 },
  /** Preenchimento após o contorno (+ fade do traço). */
  fill: { duration: 0.3, ease: "power1.in", stagger: 0.07 },
  /** Pausa com a logo cheia antes de revelar (segundos). */
  hold: 0.35,
  /** Painel sobe revelando a página. */
  lift: { duration: 0.6, ease: "power3.inOut" },
} as const;

/**
 * Transição entre ROTAS — a mesma cortina com o "M" da abertura, em ritmo de
 * navegação (Victor, 2026-08-03). Home → categoria e categoria → home passam
 * pela logo se desenhando, em vez do flash branco da recarga.
 *
 * É a irmã rápida da `intro`: mesma técnica (`strokeDashoffset` + timeline),
 * mesma paleta, mesma DIREÇÃO de movimento — o painel entra por baixo e sai
 * pelo topo, sempre subindo, como a cortina da abertura. Só o tempo muda:
 * ~1,6s contra os ~2,4s da intro. A abertura é cena e acontece uma vez por aba;
 * a transição acontece a cada clique, e a 2,4s ela viraria pedágio.
 *
 * Onde não dá pra cortar: o `draw`. Abaixo de ~0,5s o traço deixa de ser lido
 * como desenho e vira um piscar. O que saiu foi o `hold` da intro (a pausa com
 * a logo cheia) — aqui a navegação acontece nesse lugar.
 *
 * Orquestração em `components/layout/RouteTransition`.
 */
export const routeTransition = {
  /** Painel entra POR BAIXO cobrindo a tela (yPercent 100 → 0). */
  cover: { duration: 0.45, ease: "power3.inOut" },
  /** Traço do contorno — as duas formas em stagger, como na intro. */
  draw: { duration: 0.6, ease: "power2.inOut", stagger: 0.1 },
  /** Preenche e apaga o traço. A rota troca no fim disto, com a tela coberta. */
  fill: { duration: 0.25, ease: "power1.in", stagger: 0.06 },
  /** Sobreposição fill↔draw. ⚠️ STRING: número é tempo ABSOLUTO na timeline do
   *  GSAP e inverteria a ordem — foi o bug do delay de 280ms no menu mobile
   *  (ver `menuOverlay.items.overlap`). */
  fillOverlap: "-=0.1",
  /** Painel sai PELO TOPO revelando a rota nova (yPercent 0 → -100). */
  reveal: { duration: 0.5, ease: "power3.inOut" },
  /**
   * Teto de espera pela rota nova (ms), contado de quando a tela fica coberta.
   *
   * A revelação normalmente espera o `pathname` virar o destino de verdade — as
   * 6 rotas são estáticas e o `<Link>` já as prefetcha, então isso é imediato.
   * Numa conexão ruim, porém, ficar preso atrás de uma cortina é pior que ver a
   * página montando: passado este teto, revela de qualquer jeito.
   */
  esperaMaxima: 2500,
} as const;

/**
 * Cascata de entrada do Hero — GSAP, disparada pelo sinal `onIntroReveal`
 * (introSignal) no instante em que o painel da intro sobe. Título → subtítulo →
 * CTA sobem em stagger enquanto a "cortina" revela a cena, então o visitante
 * vê o conteúdo ENTRAR (antes rodava em Framer no load, atrás do painel, e
 * ficava invisível). É a 2ª exceção em GSAP, encadeada à intro; o resto do
 * site segue em Framer Motion.
 *
 * `power2.out` = decel suave e assentada (equivalente prático ao `easing.heading`
 * do Framer, em ease nomeado do GSAP, como o resto do bloco de intro).
 */
export const heroCascade = {
  /** Estado inicial dos itens (escondido). `autoAlpha` = opacity + visibility. */
  from: { autoAlpha: 0, y: 30 },
  /** Reveal em stagger, na ordem do DOM (título → subtítulo → CTA).
   *  `delay` = duração do `lift` + folga curta: o Hero começa DEPOIS que a
   *  cortina termina de subir e a Navbar já iniciou, com a cena revelada —
   *  assim se vê a cascata inteira, do zero (antes começava atrás do painel e
   *  só o fim aparecia). A Navbar (mesmo delay-base do lift) segue liderando,
   *  agora também visível por inteiro. (Victor, 2026-07-16) */
  to: {
    autoAlpha: 1,
    y: 0,
    duration: duration.slow,
    ease: "power2.out",
    stagger: 0.2,
    delay: intro.lift.duration + 0.35,
  },
} as const;

/**
 * Menu MOBILE de tela cheia — GSAP (Victor, 2026-07-23).
 *
 * 3ª exceção em GSAP, junto de `intro` e das cascatas de entrada. Entra em GSAP
 * de propósito: é uma CORTINA, exatamente o mecanismo da intro, e reusar a mesma
 * linguagem faz o menu parecer da mesma casa em vez de um componente importado.
 *
 * ⚠️ ENTRA PELA LATERAL, não de cima (Victor, 2026-07-23). A versão anterior
 * descia como cortina (`yPercent: -100 → 0`), espelhando a intro. Foi trocada:
 * o painel desliza da DIREITA (`xPercent: 100 → 0`), que é o lado onde está o
 * hambúrguer — o menu sai de onde o dedo tocou, em vez de cair sobre a página.
 * Eixo diferente da intro, mas a curva segue a mesma (`power3.inOut`).
 *
 * A timeline é construída UMA vez e dirigida por `play()`/`reverse()`; fechar é
 * literalmente a abertura de trás pra frente, então nunca há dois tempos
 * diferentes pra manter em sincronia.
 */
export const menuOverlay = {
  /** Painel deslizando da direita.
      🐞 Era `power3.inOut` (curva da intro) — mas o ease-IN segurava o painel
      ~150ms quase parado antes de deslizar, e no toque isso lê como "o menu
      travou/demora a abrir" (Victor, 2026-07-24, no 14 Pro real). `power3.out`
      arranca na hora e desacelera no fim: responde ao dedo no mesmo instante.
      Menu é utilidade, não cena — snappy ganha do cinematográfico aqui. */
  panel: { duration: 0.45, ease: "power3.out" },
  /**
   * Itens entram em cascata, começando ANTES de a cortina assentar (overlap).
   *
   * ⚠️ `opacity`, NUNCA `autoAlpha`. Um `fromTo` renderiza o estado inicial já
   * na construção da timeline (mesmo pausada), então `autoAlpha: 0` carimbaria
   * `visibility: hidden` nos itens desde o mount — e aí `.focus()` no primeiro
   * link falha EM SILÊNCIO ao abrir, porque elemento invisível não entra na
   * ordem de foco. Quem impede o menu FECHADO de capturar toque é a
   * `visibility` do `.root`, não a dos itens.
   */
  items: {
    /* Deslocamento no MESMO eixo do painel (x, não y): a cascata continua o
       gesto lateral em vez de brigar com ele. */
    from: { opacity: 0, x: 26 },
    to: { opacity: 1, x: 0, duration: 0.5, ease: "power2.out", stagger: 0.06 },
    /**
     * Sobreposição com o fim da cortina: os itens entram 0,28s ANTES de o painel
     * assentar (0.45 − 0.28 = 0.17s).
     *
     * 🐞 **STRING, nunca número.** Era `-0.28` (número) e custou o "delay de
     * ~280ms ao tocar no hambúrguer" que passou semanas sem causa achada. No
     * GSAP, posição em NÚMERO é tempo ABSOLUTO na timeline — `-0.28` punha os
     * itens em −0,28s, e o GSAP normaliza isso empurrando TODO o resto 0,28s pra
     * frente. Resultado medido nos filhos da timeline: itens em 0s e **painel em
     * 0,28s** — a ordem invertida. Os itens animavam primeiro, dentro de um
     * painel ainda fora da tela, e o toque ficava 280ms sem nada visível.
     * `"-=0.28"` (string) é que significa "0,28s antes do fim".
     */
    overlap: "-=0.28",
  },
  /** `prefers-reduced-motion`: sem cortina, só um fade curto. */
  reduced: { duration: 0.2, ease: "power1.out" },
} as const;

/**
 * Reveal de texto palavra por palavra dirigido pelo SCROLL — seção "Quem somos"
 * (ilha clara). Réplica do componente `Text_reveal` da ref MetroRide: o parágrafo
 * é quebrado em palavras e cada uma vai de opacidade baixa → cheia conforme o
 * `scrollYProgress` do bloco avança (Framer Motion `useScroll`+`useTransform`+
 * `useSpring`). Fica em Framer (não GSAP) por ser exatamente o stack da ref e o
 * que já usamos nas seções abaixo da dobra.
 */
export const scrollReveal = {
  /** Offset da SEÇÃO PINADA: progresso 0 quando o topo entra na viewport, 1 ao
   *  sair. Tupla literal p/ casar com a união estrita de `ScrollOffset`. */
  sectionOffset: ["start start", "end end"] as ["start start", "end end"],
  /** Offset do TEXTO: começa quando a seção entra na viewport, antes do pin. */
  textOffset: ["start end", "end end"] as ["start end", "end end"],
  /** Faixa de progresso (0..1) em que o parágrafo acende, 1ª → última palavra. */
  window: [0.06, 0.58] as [number, number],
  /** Opacidade da palavra ainda "apagada" (cinza claro sobre fundo claro). */
  fadedOpacity: 0.16,
  /** Suavização do acender de cada palavra. */
  spring: { stiffness: 120, damping: 32 },
  /** Fotos em PARALLAX puro — SEM opacidade, ESTEIRA CONTÍNUA (ref MetroRide).
   *  Cada foto entra por baixo do palco (`fromY`), SOBE e SAI pelo topo
   *  (`toY` negativo) — NÃO estaciona na tela (o bug do "trava e para": antes o
   *  `toY` era positivo/visível). Entradas escalonadas = surgem distribuídas; e
   *  como saem, no fim do pin só a última (foto 4) ainda aparece, igual à ref.
   *  `staticY` = posição visível fixa p/ prefers-reduced-motion (sem esteira).
   *  Vertical 100% via `y`; CSS só cuida do horizontal. (Victor, 2026-07-16) */
  photoLanes: {
    // Foto 1 já nasce peeking (fromY 78 = visível no progresso 0) e sai ~75%.
    1: { fromY: "78vh", toY: "-60vh", staticY: "8vh" },
    2: { fromY: "106vh", toY: "-52vh", staticY: "14vh" },
    // Fotos 3 e 4 descidas (faixa inteira p/ baixo, mesma velocidade — Victor).
    3: { fromY: "168vh", toY: "-22vh", staticY: "58vh" },
    // Foto 4 entra por último e ainda está visível no fim do pin (como a ref).
    4: { fromY: "200vh", toY: "30vh", staticY: "76vh" },
  },
};

/**
 * Círculo de transição CLARO → DARK (ref MetroRide "Round Section" / Drive
 * Luxury). Um círculo escuro, centralizado e pinado, CRESCE (scale) dirigido
 * pelo scroll da seção até cobrir a viewport — a "cortina" que devolve o site
 * ao dark. Framer Motion (useScroll + useTransform), consistente com a Quem
 * somos. A ref usa scale 0.1→1 com trigger `onScrollTarget`.
 */
export const circuloReveal = {
  /** Crescimento antecipado: começa quando a seção entra pela base da viewport,
   *  antes do pin. O círculo já expande enquanto aparece e continua crescendo
   *  durante o palco sticky, ainda totalmente dirigido pelo scroll. */
  offset: ["start end", "end end"] as ["start end", "end end"],
  /** scale LINEAR clampado. Segura pequeno (0.1) até o pin começar (~0.34) e
   *  expande ao longo de TODO o pin. O PONTO-CHAVE do "scroll morto": numa tela
   *  WIDESCREEN o círculo já cobre a viewport em scale ~0.76 (a diagonal de uma
   *  tela larga é curta em vmax), MUITO antes do scale cheio. Se a cobertura
   *  acontece cedo e o pin continua, sobra tela preta parada = scroll morto.
   *  Fix: ancorar a cobertura de tela larga (~0.775) BEM NO FIM do pin (~0.985 do
   *  progresso) → cobriu, soltou. O último trecho (0.985→1.0) cresce 0.775→0.95
   *  POR BAIXO da cobertura (invisível em widescreen; é só margem pra viewport
   *  quadrada, que só cobre em ~0.94). Base 150vmax.
   *  Levers: "quando solta" numa tela larga = 4º ponto (input 0.985 / output
   *  0.775). Cobre mais tarde → sobe o input pra ~0.99. Cobre cedo demais (ainda
   *  sobra morto) → sobe o output (ex. 0.80) OU o input mais pra 1.0. */
  scaleInput: [0, 0.11, 0.34, 0.985, 1.0] as [number, number, number, number, number],
  scaleOutput: [0.1, 0.1, 0.28, 0.775, 0.95] as [number, number, number, number, number],
  /** MOBILE (retrato) — trava do estado inicial (Victor, 2026-07-24). No desktop
   *  o círculo começa minúsculo (0.1) e cresce imperceptível; no celular esse
   *  trecho vira VÃO BRANCO. Aqui o círculo já ENTRA GRANDE (scale 0.5 — proposta
   *  do Victor, o "print 2" cheio) e SEGURA nesse tamanho durante TODA a entrada.
   *  Círculo grande = preenche o branco da entrada (menos vão visível) e, por já
   *  estar perto de cobrir, exige POUCA expansão depois de pinar (menos scroll pra
   *  dar continuidade). Lê como intenção, não como efeito super-otimizado.
   *  A expansão só começa em ~0.55 — o ponto onde o palco `sticky` trava em TELA
   *  CHEIA (com a seção em 180vh, o pin acontece em progresso V/H ≈ 0.55). Antes
   *  disso a pílula fica travada e imóvel (y=0, sem peek — ver Circulo.tsx) e sobe
   *  junto com a página, mas NÃO expande. Cobre o RETRATO em ~0.73 (diagonal do
   *  retrato em vmax é maior que a widescreen), ancorado no fim (0.97) pra não
   *  sobrar scroll morto, com margem até 0.85. Selecionado por viewport no
   *  componente (matchMedia) — NÃO afeta o desktop (scaleInput/Output acima).
   *  ⚠️ O 0.55 é casado com os 180vh da seção (Circulo.module.css). Mudar a altura
   *  mobile move o ponto de pin → recalcular este 2º ponto junto.
   *  Lever do "tamanho parado": os DOIS primeiros pontos do Output (hoje 0.5). */
  scaleInputMobile: [0, 0.55, 0.97, 1.0] as [number, number, number, number],
  scaleOutputMobile: [0.5, 0.5, 0.73, 0.85] as [number, number, number, number],
  /** Deslocamento vertical (px) do círculo E do texto, amarrado ao scroll.
   *  NEGATIVO = pra cima. O círculo ENTRA deslocado pra cima (peek — a
   *  "beiradinha" que aparece ao entrar na seção; Victor: essencial) e RETORNA
   *  a 0 (centro exato) ANTES de começar a expandir, pra crescer no centro e o
   *  texto ficar alinhado. Círculo e texto usam o MESMO lift → sempre juntos,
   *  nunca desalinham. Substitui o antigo `margin-top: -100px` fixo (que subia
   *  em TODOS os momentos e por isso desalinhava no trava/expande).
   *  Levers: quanto sobe na entrada = `liftOutput` inicial (-100) · quando
   *  recentraliza = 2º/3º ponto do `liftInput` (fica centrado em 0.11, quando a
   *  expansão começa — casado com o `scaleInput`). */
  liftInput: [0, 0.2, 0.34] as [number, number, number],
  liftOutput: [-100, -100, 0] as [number, number, number],
};

/**
 * Marquee horizontal contínuo (carrossel de texto) da seção "Quem somos".
 * Loop infinito de `x: 0 → -50%` sobre a faixa duplicada (duas metades idênticas
 * = emenda invisível). Puramente estético/decorativo (aria-hidden).
 */
export const marquee = {
  /** Segundos por volta completa (menor = mais rápido). */
  duration: 260,
} as const;

/**
 * Cascata da Navbar — GSAP, mesmo sinal `onIntroReveal` da intro. É a PRIMEIRA
 * a animar (logo → links → CTA caem do topo), liderando o Hero.
 *
 * ⚠️ Timing (Victor, 2026-07-16): a cortina sobe (`yPercent:-100`) revelando a
 * tela DE BAIXO PRA CIMA, então o topo (a navbar) é o ÚLTIMO a aparecer. Sem
 * delay, a cascata rodava enquanto a barra ainda estava coberta pelo painel e
 * o usuário só via o fim ("botão Contato já animado, perdi a entrada"). Por
 * isso `delay = duração do lift`: a barra só cascateia QUANDO a cortina termina
 * de subir e já está descoberta. Anima os FILHOS (logo/li/cta/burger), nunca o
 * `<ul>` (que carrega o `translateX(-50%)` de centralização).
 */
export const navCascade = {
  /** Estado inicial (escondido, deslocado pra cima). */
  from: { autoAlpha: 0, y: -14 },
  /** Reveal em stagger na ordem do DOM (logo → links → CTA/burger). */
  to: {
    autoAlpha: 1,
    y: 0,
    duration: 0.55,
    ease: "power2.out",
    stagger: 0.08,
    delay: intro.lift.duration,
  },
} as const;
