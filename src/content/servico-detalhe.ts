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
      image?: string;
      alt?: string;
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
    image: "/assets/servicos/higienizacao-interna-v2.jpg",
    imageAlt: "Higienização interna em andamento — limpeza profunda do interior do veículo",
    // ⚠️ PLACEHOLDER: polimento.jpg é stand-in (única foto do acervo com
    // trabalho acontecendo). Quando as fotos reais chegarem: grande =
    // resultado (interior pronto), pequeno = processo (mãos/extratora).
    imagePair: {
      src: "/assets/servicos/polimento.jpg",
      alt: "Detalhamento em andamento — trabalho técnico da MV (foto provisória)",
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
      { id: "hi-1", title: "Sedan · interior completo", summary: "Bancos, forro e tapetes tratados na origem." },
      { id: "hi-2", title: "SUV · bancos e estofados", summary: "Extração profunda nos assentos e no carpete." },
      { id: "hi-3", title: "Hatch · pós-obra e pet", summary: "Pelos e poeira fina removidos de todos os vãos." },
      { id: "hi-4", title: "Picape · uso pesado", summary: "Carpete e plásticos recuperados após meses de estrada." },
      { id: "hi-5", title: "Sedan · manutenção", summary: "Higienização de rotina pra manter o interior em ponto." },
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
