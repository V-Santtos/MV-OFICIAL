/**
 * Conteúdo DETALHADO das páginas `/servicos/[slug]` — o "miolo" de cada categoria.
 *
 * MODELO (validado com Victor, 2026-07-18 — ref. estrutural: página de categoria
 * do Glänzen, ENXUGADA): Hero → O que é → O que cobre (container de sub-serviços)
 * → Benefícios → Como fazemos → FAQ → [antes/depois — PARTE FINAL, ainda não] → CTA.
 * Cortado da ref: "Mitos comuns" (sobrepõe o FAQ) e pacotes com prazo/reserva
 * (nosso fluxo é orçamento via WhatsApp, sem preço no site).
 *
 * ⚠️ COPY PLACEHOLDER (2026-07-18): texto provisório crível e SEGURO (sem número
 * inventado, sem promessa técnica específica) só pra validar o template visual.
 * A copy real de cada categoria será decidida com o Victor, categoria por
 * categoria — começando pela Higienização Interna (a piloto).
 *
 * Categorias SEM entrada aqui ainda renderizam a versão RESUMO da rota (hero +
 * desc + CTA) — clicar no card não dá mais 404.
 */

/* ============================================================
   CASES — regra de publicação (Victor, 2026-08-01)
   ============================================================
   Regra dele, textual: "depois vai sair e ficar somente os preenchidos, e
   quando não tiver case a sessão não aparece."

   Hoje os 5 cards da Higienização são de ENCHIMENTO (`placeholder: true`) e
   estão no ar SÓ pra validar o visual do reel — decisão consciente dele.
   Quando o primeiro case real fotografado entrar, basta virar o switch abaixo
   pra `false`: o reel passa a mostrar só os cases de verdade e, se não sobrar
   nenhum na categoria, a seção inteira some da página (guarda em ServicoPage).
   ============================================================ */

/** `true` = mostra os cards de enchimento (validação visual). Virar pra `false`
 *  quando houver case real. NÃO apagar os placeholders: o switch já os esconde. */
export const MOSTRAR_CASES_PLACEHOLDER = true;

/**
 * Cases que podem ir pro ar numa categoria. Com o switch ligado devolve tudo;
 * desligado, filtra os de enchimento. Devolver array VAZIO é o sinal de "não
 * renderiza a seção" — quem consome tem que checar `.length`.
 */
export function casesPublicaveis<T extends { placeholder?: boolean }>(
  items: readonly T[],
): readonly T[] {
  return MOSTRAR_CASES_PLACEHOLDER ? items : items.filter((c) => !c.placeholder);
}

export type SplitBlock = {
  title: string;
  /** Parágrafos do corpo (cada string = um <p>). */
  body: readonly string[];
  image: string;
  imageAlt: string;
  /** Card menor do PAR EMPILHADO (Victor, 2026-07-18 — essência Glänzen):
   *  sobrepõe o canto inferior do card grande, do lado do texto. Semântica
   *  ideal: grande = RESULTADO, pequeno = PROCESSO. Opcional (sem ele o
   *  bloco renderiza foto única, como antes). */
  imagePair?: { src: string; alt: string };
};

export type CobreItem = {
  title: string;
  desc: string;
};

export type Passo = {
  title: string;
  desc: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type ServicoDetalhe = {
  hero: {
    eyebrow: string;
    /** Linha 1 do H1 (branca). */
    title: string;
    /** Linha 2 do H1 — frase de destaque (acento controlado). */
    titleAccent: string;
    subtitle: string;
  };
  /** Seção "O que é / o que resolve" — foto de um lado, texto do outro. */
  oQueE: SplitBlock;
  /** Menu da categoria: o cliente contrata o COMPLETO ou serviços AVULSOS (sem
   *  gate atrás de um pacote premium). Comunica a extensão do que a MV faz. */
  cobre: {
    title: string;
    intro: string;
    items: readonly CobreItem[];
    /** Linha de fecho reforçando a flexibilidade (avulso | pacote). */
    note?: string;
    /** Cruzamento com outra categoria (ex.: bancos têm página própria). */
    crossLink?: { label: string; desc: string; slug: string };
  };
  /** Benefícios — texto de um lado, foto do outro (alternado com o "O que é"). */
  beneficios: SplitBlock & { items: readonly CobreItem[] };
  processo: {
    title: string;
    steps: readonly Passo[];
  };
  /** CASES — reel horizontal de trabalhos (Victor, 2026-07-23), entre "O que
   *  cobre" e o FAQ. `image` opcional: sem foto, o card mostra um placeholder
   *  de marca (monograma) que faz parte do componente. */
  cases?: {
    heading: string;
    subheading?: string;
    items: readonly {
      id: string;
      title: string;
      summary: string;
      /** Galeria; a PRIMEIRA é a capa do card. Sem fotos = placeholder de marca. */
      fotos?: readonly { src: string; alt: string }[];
      /** Interno, nunca renderizado — card de enchimento. Ver `casesPublicaveis`. */
      placeholder?: boolean;
    }[];
  };
  faq: {
    title: string;
    items: readonly FaqItem[];
  };
  cta: {
    title: string;
    body: string;
  };
};

/**
 * Higienização Interna — categoria PILOTO do template (Victor, 2026-07-18).
 * Validar esta página primeiro; as outras 5 replicam a estrutura depois.
 */
const higienizacaoInterna: ServicoDetalhe = {
  hero: {
    eyebrow: "Estética automotiva · Interior",
    title: "O interior do seu carro",
    titleAccent: "como no primeiro dia",
    // Pórtico da página (Victor, 2026-07-18): a primeira tela é só título +
    // subtítulo, MUITO ar, sem foto e sem "aula". O subtítulo CONVERSA sobre o
    // valor (frescor/conforto/sensação), não ensina o que é a higienização — a
    // definição técnica desce pro "O que é". Placeholder (refinar em conjunto).
    subtitle:
      "Mais do que limpar o que se vê: o frescor, o conforto e a sensação de carro novo de volta — toda vez que você abre a porta.",
  },

  oQueE: {
    // Copy problema→solução (Parte 1 do passe de estrutura/copy, 2026-07-18):
    // título nomeia o SINTOMA (não o serviço — visitante de anúncio se
    // reconhece antes da definição); §1 = sintomas reconhecíveis; §2 = a
    // definição técnica + linha-âncora da categoria ("remover na origem");
    // §3 = o texto anterior, que já estava validado.
    title: "O que a limpeza comum não alcança",
    body: [
      "Aquele cheiro que volta mesmo depois de lavar. A mancha no banco que já virou parte do carro. O que as crianças — e o pet — deixam pra trás e ninguém vê. Se você se reconheceu, não é falta de limpeza: é sujeira acumulada onde a limpeza comum não chega.",
      "A higienização interna vai atrás dela. É uma limpeza técnica e profunda de todo o interior do veículo: a sujeira impregnada nos tecidos, a poeira nas frestas e nos dutos do ar, os ácaros e micro-organismos que se instalam com o uso diário. Remover na origem — não disfarçar com perfume.",
      "É o serviço certo pra quem passa boa parte do dia no carro, transporta a família, ou quer preparar o veículo pra venda com o interior impecável.",
    ],
    // Fotos geradas (Victor, 2026-08-02) — assinatura visual travada em
    // regras/foto-assinatura.md. Saíram no lugar de duas stock: a grande
    // anterior e a polimento.jpg, que era POLIMENTO EXTERNO nesta rota de
    // higienização INTERNA e ainda repetia a foto do card "Polimento" da home
    // (servicos.ts) — mesma imagem com dois significados na mesma visita.
    // Semântica preservada: grande = RESULTADO, pequeno = DETALHE.
    // 🚩 Dimensões casadas com o CSS: console 1472×1440 (ratio 1.022 = o 46/45
    // do .pairMain), volante 800×600 (4/3 do .pairSecondary). Zero corte.
    // Mexeu no aspect-ratio do CSS, regera a imagem junto.
    image: "/assets/servicos/higienizacao-console.jpg",
    imageAlt: "Console central e painel de um veículo após higienização interna, sem poeira nas frestas e nos comandos",
    imagePair: {
      src: "/assets/servicos/higienizacao-volante.jpg",
      alt: "Detalhe dos comandos do volante limpos, sem sujeira acumulada nos vãos dos botões",
    },
  },

  cobre: {
    title: "Do volante ao carro inteiro",
    // Subtítulo CURTO (Victor, 2026-07-23): a versão longa pesava e empurrava o
    // grid pra baixo. Curta, apresentando os cards abaixo. Alternativas da
    // conversa: A "Cada frente que a versão completa trata no interior." · B
    // "Do painel aos dutos do ar, sem pular etapa." (B evita porque "etapa"
    // sugere passo, e os itens são frentes paralelas). Texto longo anterior:
    // "A higienização pode ser completa — num nível simples ou detalhado — ou
    //  avulsa: dá pra cuidar só do painel, só do volante, só dos carpetes..."
    intro: "É isto que entra quando você faz a higienização completa.",
    items: [
      {
        title: "Painel e plásticos",
        desc: "Limpeza e acabamento do painel, console e portas — sem brilho artificial.",
      },
      {
        title: "Volante e comandos",
        desc: "Higienização do volante, manopla e botões — os pontos de mais contato do dia a dia.",
      },
      {
        title: "Carpetes e tapetes",
        desc: "Extração profunda da sujeira impregnada no assoalho e nos tapetes.",
      },
      {
        title: "Teto e forros",
        desc: "Limpeza cuidadosa do teto, colunas e forros, respeitando cada material.",
      },
      {
        // Sem "perfume por cima" aqui: a tese vive na linha-âncora do "O que é"
        // (uma tese, uma aparição por tela). Odores nomeados = concretude.
        title: "Ar-condicionado e odores",
        desc: "Higienização do sistema de ar e neutralização de odores — cigarro, mofo, alimento.",
      },
      {
        // Sem "que a limpeza comum não alcança": virou o TÍTULO do "O que é"
        // (Parte 1) — repetir aqui enfraqueceria os dois.
        title: "Frestas e detalhes",
        desc: "Saídas de ar, botões, trilhos e os cantos onde a sujeira se esconde.",
      },
    ],
    // Nota com trabalho PRÓPRIO (a versão anterior repetia a intro): fecha a
    // dúvida de quem não sabe escolher, apontando pra avaliação.
    note: "Não sabe o que o seu carro precisa? Na avaliação a gente monta isso junto — sem compromisso.",
    // 7ª linha do menu (não mais caixa separada): título curto no padrão das
    // outras linhas; a seta é o sinal de que leva à categoria irmã.
    crossLink: {
      label: "Bancos e estofados",
      desc: "Cuidado próprio — couro e tecido pedem hidratação e revitalização dedicadas. Conheça a categoria.",
      slug: "bancos-e-estofados",
    },
  },

  beneficios: {
    title: "Por que higienizar o interior",
    body: [
      "O interior é onde você e sua família passam o tempo — e é onde o descuido menos aparece e mais pesa.",
    ],
    items: [
      {
        title: "Saúde de quem anda com você",
        desc: "Remove ácaros, fungos e bactérias do ambiente que você respira dentro do carro.",
      },
      {
        title: "Fim dos odores",
        desc: "Neutraliza cheiros de cigarro, mofo e alimentos na origem — não com perfume por cima.",
      },
      {
        title: "Sensação de carro novo",
        desc: "Interior limpo e cheiroso muda a experiência de entrar e dirigir todos os dias.",
      },
      {
        title: "Valorização na revenda",
        desc: "O interior é um dos primeiros pontos avaliados por quem vai comprar seu veículo.",
      },
    ],
    image: "/assets/servicos/bancos-e-estofados.jpg",
    imageAlt: "Interior do veículo após higienização — bancos e acabamentos renovados",
  },

  processo: {
    title: "Como fazemos",
    steps: [
      {
        title: "Avaliação",
        desc: "Analisamos o estado do interior e definimos com você o que o veículo precisa.",
      },
      {
        title: "Limpeza profunda",
        desc: "Aspiração, extração e limpeza técnica de cada superfície, com produto adequado a cada material.",
      },
      {
        title: "Acabamento",
        desc: "Detalhamento das frestas e acabamento final das superfícies, sem excessos.",
      },
      {
        title: "Entrega",
        desc: "Interior renovado, com orientações pra conservar o resultado por mais tempo.",
      },
    ],
  },

  // CASES — reel horizontal (Victor, 2026-07-23). SEM foto por enquanto: o card
  // usa o placeholder de marca do componente. Copy PLACEHOLDER e segura (sem
  // número/promessa inventada); os cases e as fotos reais virão da captação no
  // salão da MV. `heading`/`subheading` = a marca amarela do print do Victor.
  cases: {
    heading: "Alguns trabalhos",
    subheading: "Interiores tratados na MV — cada um no seu estado de origem.",
    items: [
      /* CASE 1 — REAL (Victor, 2026-08-01). Toyota Hilux de estrada de terra.
         As 4 fotos são montagens ANTES/DEPOIS já empilhadas, 900×1600 (9:16).
         A CAPA é a da cabine de propósito: o assoalho tomado de barro seco é a
         imagem mais forte do conjunto e é ela que faz a pessoa abrir a galeria.
         ⚠️ Placa do cliente aparece na foto do exterior — Victor decidiu manter
         (2026-08-01). Copy do `summary` ainda é RASCUNHO, não escolhida por ele. */
      {
        id: "hilux-poeira",
        title: "Toyota Hilux · interior completo",
        summary: "Poeira de estrada de terra impregnada no assoalho, no painel e nos bancos.",
        fotos: [
          {
            src: "/assets/cases/hilux-poeira/cabine.jpg",
            alt: "Cabine da Toyota Hilux antes e depois da higienização: em cima, assoalho e banco cobertos de barro seco; embaixo, o mesmo assoalho e banco limpos.",
          },
          {
            src: "/assets/cases/hilux-poeira/painel.jpg",
            alt: "Painel e volante da Hilux antes e depois: em cima, poeira vermelha impregnada nos difusores e no quadro de instrumentos; embaixo, tudo limpo.",
          },
          {
            src: "/assets/cases/hilux-poeira/multimidia.jpg",
            alt: "Central multimídia e comandos do ar da Hilux antes e depois: em cima, tela e botões tomados de poeira; embaixo, limpos e legíveis.",
          },
          {
            src: "/assets/cases/hilux-poeira/exterior.jpg",
            alt: "Toyota Hilux branca antes e depois: em cima, lataria e rodas encardidas de barro; embaixo, o veículo limpo.",
          },
        ],
      },
      { id: "hi-1", title: "Sedan · interior completo", summary: "Bancos, forro e tapetes tratados na origem.", placeholder: true },
      { id: "hi-2", title: "SUV · bancos e estofados", summary: "Extração profunda nos assentos e no carpete.", placeholder: true },
      { id: "hi-3", title: "Hatch · pós-obra e pet", summary: "Pelos e poeira fina removidos de todos os vãos.", placeholder: true },
      { id: "hi-4", title: "Picape · uso pesado", summary: "Carpete e plásticos recuperados após meses de estrada.", placeholder: true },
      { id: "hi-5", title: "Sedan · manutenção", summary: "Higienização de rotina pra manter o interior em ponto.", placeholder: true },
    ],
  },

  faq: {
    title: "Perguntas frequentes",
    items: [
      {
        q: "Quanto tempo leva uma higienização interna?",
        a: "Depende do estado do veículo. Na avaliação gratuita a gente te passa o prazo certo antes de começar — sem surpresa.",
      },
      {
        q: "Remove qualquer mancha ou odor?",
        a: "A grande maioria, sim. Manchas e odores muito antigos podem pedir tratamento extra — quando é o caso, avisamos antes.",
      },
      {
        q: "É seguro para a parte elétrica e os acabamentos?",
        a: "Sim. Cada material recebe produto e técnica adequados, com proteção dos componentes elétricos durante todo o processo.",
      },
      {
        q: "Com que frequência devo fazer?",
        a: "Varia com a rotina de uso do veículo. Na avaliação a gente indica a frequência ideal pro seu caso.",
      },
    ],
  },

  cta: {
    title: "Seu interior merece esse cuidado.",
    body: "Chame no WhatsApp, conte o estado atual do veículo e receba uma avaliação gratuita — sem compromisso.",
  },
};

/** Mapa slug → detalhe. Categorias fora daqui caem na versão RESUMO da rota. */
export const servicosDetalhe: Readonly<Record<string, ServicoDetalhe>> = {
  "higienizacao-interna": higienizacaoInterna,
};
