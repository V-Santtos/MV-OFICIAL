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

   Os cards de ENCHIMENTO (`placeholder: true`) NUNCA são apagados do arquivo —
   quem controla quantos aparecem é o número abaixo. Assim, quando um case real
   novo chegar, é só escrever o case: nada precisa ser "descomentado" ou
   reescrito. Se não sobrar NENHUM card visível numa categoria, a seção inteira
   some da página (guarda em ServicoPage).
   ============================================================ */

/**
 * Quantos cards de ENCHIMENTO ficam visíveis DEPOIS dos cases reais.
 *
 * Hoje **1** (Victor, 2026-08-02): a Higienização tem 1 case real, e um único
 * card vazio ao lado basta pra sustentar a leitura de "reel" — sem inventar
 * quatro trabalhos que não existem.
 *
 * `0` = só o que é real. 🚩 NÃO apagar os placeholders do array: este número já
 * dá conta de escondê-los, e eles voltam a servir de molde no próximo serviço.
 */
export const PLACEHOLDERS_VISIVEIS = 1;

/**
 * Cases que vão pro ar numa categoria: TODOS os reais, na ordem em que estão,
 * seguidos dos primeiros N cards de enchimento (N = `PLACEHOLDERS_VISIVEIS`,
 * ou o override da categoria).
 *
 * O trabalho de verdade sempre vem primeiro, independente da posição no array —
 * placeholder é preenchimento de fim de fila, nunca abre a seção. Devolver
 * array VAZIO é o sinal de "não renderiza a seção": quem consome checa `.length`.
 *
 * 🚩 O `limite` existe porque o número global é calibrado pra uma categoria que
 * JÁ TEM case real (a Higienização: 1 real + 1 de enchimento). Uma categoria sem
 * nenhum case real herdaria esse `1` e abriria o reel com um card solitário, que
 * não sustenta a leitura de carrossel. Categoria nova passa o próprio número até
 * o primeiro trabalho real entrar; aí o override sai e ela volta pro global.
 */
export function casesPublicaveis<T extends { placeholder?: boolean }>(
  items: readonly T[],
  limite: number = PLACEHOLDERS_VISIVEIS,
): readonly T[] {
  return [
    ...items.filter((c) => !c.placeholder),
    ...items.filter((c) => c.placeholder).slice(0, limite),
  ];
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
  /**
   * Descrição de SERP e do `Service` no JSON-LD (2026-08-03).
   *
   * 🚩 Por que existe: sem ela, `generateMetadata` reusava o `desc` de
   * `servicos.ts`, que foi escrito como LEGENDA DO CARD do mosaico da home. As
   * duas coisas têm trabalhos diferentes — a legenda apresenta a categoria dentro
   * de um grid; o snippet disputa clique numa lista de resultados e precisa da
   * cidade, do que está coberto e do gancho. Categoria sem esta chave continua
   * caindo no `desc`, então nada quebra.
   *
   * 🚩 Teto de ~155 caracteres: acima disso o Google corta com reticências.
   */
  seoDescription?: string;
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
    /** Override do `PLACEHOLDERS_VISIVEIS` global — só pra categoria que ainda
     *  não tem case real (ver o porquê em `casesPublicaveis`). Some quando o
     *  primeiro trabalho real da categoria entrar. */
    placeholdersVisiveis?: number;
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
  seoDescription:
    "Higienização interna em Simonésia, MG: painel, carpetes, teto, ar-condicionado e odores tratados na origem. Avaliação gratuita antes do serviço.",
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

/**
 * Polimento — 2ª categoria a ganhar rota completa (Victor, 2026-08-03).
 * Réplica da estrutura já validada na Higienização: mesma ordem de seções,
 * mesma função de cada bloco, mesmo registro de voz.
 *
 * ⚠️ FOTOS SÃO PLACEHOLDER, por decisão dele ("deixe as fotos como default pois
 * depois iremos colocá-las"). O acervo só tem UMA foto de polimento, e ela já é
 * o card da home — então os dois slots do "O que é" apontam pro mesmo arquivo,
 * de propósito: repetida na tela, ninguém publica sem trocar. Quando as reais
 * forem geradas, ler `regras/foto-assinatura.md` ANTES (a receita de cor/luz que
 * mantém as rotas coerentes) e casar as dimensões com o CSS: 1472×1440 no card
 * grande (46/45) e 800×600 no pequeno (4/3).
 *
 * ⚠️ COPY = PRIMEIRO PASSE. Escrita no tom da Higienização, sem número, prazo,
 * garantia ou equipamento inventado (a lista PENDENTE DO DONO em
 * `.agents/product-marketing.md` continua aberta). As linhas que carregam a
 * página foram apresentadas ao Victor como opções; o que está aqui é a escolha
 * default até ele decidir.
 */
const polimento: ServicoDetalhe = {
  seoDescription:
    "Polimento em Simonésia, MG: correção de riscos, teias de lavagem, oxidação e faróis amarelados. Avaliação gratuita antes de qualquer serviço.",
  hero: {
    eyebrow: "Estética automotiva · Pintura",
    title: "A pintura do seu carro",
    titleAccent: "de volta ao brilho",
    // Mesma função do subtítulo da Higienização: fala do VALOR, não ensina o
    // que é polimento (a definição técnica desce pro "O que é"). A imagem do
    // reflexo "que está debaixo das marcas" é o gancho: diz que o brilho não
    // acabou, está coberto — que é exatamente o que o serviço resolve.
    subtitle:
      "O reflexo que a pintura perdeu não foi embora de vez. Ele está debaixo das marcas que o tempo deixou no verniz.",
  },

  oQueE: {
    // Título nomeia o SINTOMA, não o serviço (mesma regra da Higienização):
    // quem chega de anúncio se reconhece antes de saber o nome do serviço.
    // "Só aparecem no sol" é a descrição literal de teia de lavagem, e é o
    // momento exato em que o dono repara no problema.
    title: "As marcas que só aparecem no sol",
    body: [
      "Aquelas teias finas que surgem quando o sol bate na porta. O risco de anel em volta do puxador. A cor que já não devolve reflexo nenhum. Se você se reconheceu, não é falta de lavagem: são anos de marca acumulada no verniz.",
      "O polimento vai atrás delas. É a correção da camada de verniz por abrasão controlada, com máquina, boina e composto escolhidos pelo estado de cada pintura, nivelando o risco em vez de preencher. Corrigir a pintura, não encobrir com cera.",
      "É o serviço certo pra quem vai vender o veículo, pra quem pretende vitrificar depois (a proteção pede pintura corrigida antes) ou pra quem cansou de olhar o carro e não enxergar mais a cor.",
    ],
    // ⚠️ PLACEHOLDER: os dois slots apontam pro MESMO arquivo de propósito
    // (ver o cabeçalho deste objeto). `polimento.jpg` é a foto do card da home.
    image: "/assets/servicos/polimento.jpg",
    imageAlt: "Polimento da pintura de um veículo com politriz",
    imagePair: {
      src: "/assets/servicos/polimento.jpg",
      alt: "Detalhe do trabalho de polimento sobre a lataria",
    },
  },

  cobre: {
    // Mesma construção do "Do volante ao carro inteiro": vai do PONTO pro TODO,
    // comunicando que dá pra contratar avulso ou completo.
    title: "Do risco isolado à pintura inteira",
    intro: "É isto que entra quando você faz o polimento completo.",
    items: [
      {
        title: "Correção da pintura",
        desc: "Remoção de riscos superficiais, teias de lavagem e marcas do uso diário.",
      },
      {
        title: "Oxidação e opacidade",
        desc: "Recuperação da cor em pinturas apagadas pelo sol e pelo tempo.",
      },
      {
        title: "Refino e lustro",
        desc: "Passes finais que fecham o verniz e devolvem profundidade ao reflexo.",
      },
      {
        title: "Faróis",
        desc: "Polimento dos faróis amarelados, devolvendo transparência ao facho de luz.",
      },
      {
        title: "Descontaminação",
        desc: "Retirada do resíduo ferroso, da seiva e do respingo que ficam agarrados na pintura.",
      },
      {
        // A tese "corrigir, não encobrir" já vive no "O que é" — aqui a proteção
        // aparece só como o que ela é: o passo que segura o resultado.
        title: "Proteção do resultado",
        desc: "Acabamento final que segura o brilho por mais tempo depois da correção.",
      },
    ],
    // 🚩 ÓRFÃO: `note` existe no tipo mas o CoberturaBlock não renderiza (o
    // mesmo vale pro `note` da Higienização). Escrito pra ficar pronto se o
    // campo voltar; hoje não aparece na tela.
    note: "Não sabe o que a sua pintura precisa? Na avaliação a gente vê isso junto, sem compromisso.",
    // Cruzamento natural da categoria: polimento é pré-requisito de vitrificação.
    // A Higienização aponta pra Bancos; esta aponta pra Vitrificação.
    crossLink: {
      label: "Vitrificação e proteção",
      desc: "O polimento corrige a pintura; a vitrificação protege o que foi corrigido. Conheça a categoria.",
      slug: "vitrificacao",
    },
  },

  // 🚩 ÓRFÃO, igual na Higienização: `beneficios` e `processo` NÃO são
  // renderizados pelo ServicoPage (as duas seções saíram do template pra página
  // não pesar). Ficam preenchidos porque o tipo exige, e porque servem de
  // matéria-prima se um dia voltarem. Limpeza dos dois está no backlog.
  beneficios: {
    title: "Por que polir a pintura",
    body: [
      "A pintura é a parte do carro que envelhece à vista de todo mundo, e a primeira que pesa na conversa de quem vai comprar.",
    ],
    items: [
      {
        title: "A cor de volta",
        desc: "Pintura corrigida devolve reflexo e profundidade que a lavagem sozinha não recupera.",
      },
      {
        title: "Riscos nivelados",
        desc: "Marcas superficiais saem do verniz em vez de ficarem preenchidas até a próxima chuva.",
      },
      {
        title: "Base pra proteção",
        desc: "Vitrificação e selante rendem mais sobre pintura corrigida do que sobre pintura marcada.",
      },
      {
        title: "Valorização na revenda",
        desc: "A lataria é o primeiro ponto avaliado por quem chega pra ver o veículo.",
      },
    ],
    image: "/assets/servicos/polimento.jpg",
    imageAlt: "Pintura do veículo após polimento, com reflexo definido",
  },

  processo: {
    title: "Como fazemos",
    steps: [
      {
        title: "Avaliação",
        desc: "Analisamos o estado da pintura e definimos com você o nível de correção que o caso pede.",
      },
      {
        title: "Preparo",
        desc: "Lavagem técnica e descontaminação, pra o polimento trabalhar sobre a pintura limpa.",
      },
      {
        title: "Correção",
        desc: "Passes de corte e refino, com composto e boina adequados a cada painel.",
      },
      {
        title: "Entrega",
        desc: "Pintura conferida na luz, com orientações pra conservar o resultado por mais tempo.",
      },
    ],
  },

  // CASES — nenhum trabalho real de polimento ainda. Os 5 cards abaixo são
  // ENCHIMENTO (`placeholder: true`) e existem pra sustentar a leitura do reel
  // enquanto a captação não acontece. `placeholdersVisiveis: 5` sobrepõe o
  // número global (1), que é calibrado pra categoria COM case real.
  // ➡️ Quando o 1º polimento real entrar: escrever o case acima destes e baixar
  //    este número. 🚩 NUNCA apagar os placeholders (ver ocultar-nunca-apagar).
  cases: {
    heading: "Alguns trabalhos",
    subheading: "Pinturas corrigidas na MV, cada uma no seu estado de origem.",
    placeholdersVisiveis: 5,
    items: [
      { id: "po-1", title: "Sedan · correção de pintura", summary: "Teias de lavagem removidas em toda a lataria.", placeholder: true },
      { id: "po-2", title: "SUV · pintura apagada", summary: "Cor recuperada em superfícies castigadas pelo sol.", placeholder: true },
      { id: "po-3", title: "Hatch · marcas do dia a dia", summary: "Riscos de puxador e maçaneta nivelados no verniz.", placeholder: true },
      { id: "po-4", title: "Picape · uso pesado", summary: "Verniz corrigido depois de anos de estrada e sol.", placeholder: true },
      { id: "po-5", title: "Sedan · faróis", summary: "Faróis amarelados de volta à transparência.", placeholder: true },
    ],
  },

  faq: {
    title: "Perguntas frequentes",
    items: [
      {
        q: "Quanto tempo leva um polimento?",
        a: "Depende do estado da pintura. Na avaliação gratuita a gente te passa o prazo certo antes de começar — sem surpresa.",
      },
      {
        // Honestidade técnica no lugar de promessa: o limite do serviço é
        // verificável e dizê-lo constrói mais confiança do que prometer tudo.
        q: "O polimento tira qualquer risco?",
        a: "Risco superficial, que ficou no verniz, sai. Risco que pegou a tinta ou o fundo não sai no polimento. Quando é o caso, avisamos antes de começar.",
      },
      {
        q: "Polir desgasta a pintura?",
        a: "O polimento trabalha o verniz, então não é serviço pra repetir toda semana. Avaliamos a condição da pintura antes e usamos só a correção que o caso pede.",
      },
      {
        q: "Preciso vitrificar depois?",
        a: "Não é obrigatório. Mas o polimento deixa a pintura no melhor estado pra receber proteção, e é por isso que os dois costumam andar juntos. Na avaliação a gente te mostra se faz sentido pro seu caso.",
      },
    ],
  },

  // 🚩 ÓRFÃO como na Higienização: o fecho da página é o FaqBlock (FAQ + CTA no
  // trilho). Mantido por exigência do tipo.
  cta: {
    title: "Sua pintura merece esse cuidado.",
    body: "Chame no WhatsApp, conte o estado atual da pintura e receba uma avaliação gratuita — sem compromisso.",
  },
};

/**
 * Tratamento de Bancos e Estofados — 3ª rota completa (Victor, 2026-08-03).
 * Réplica da estrutura validada na Higienização, mesma ordem e mesmo registro.
 *
 * 🔑 O EIXO desta categoria, e o que a separa da Higienização Interna: é a única
 * que trata DOIS MATERIAIS com processos diferentes. Tecido pede extração; couro
 * pede pH adequado e hidratação depois. Toda a copy se apoia nisso, porque é a
 * resposta concreta pra "por que isso não está incluso na higienização?".
 *
 * ⚠️ FOTOS SÃO PLACEHOLDER (mesma decisão do Polimento). O acervo só tem
 * `bancos-e-estofados.jpg`, que já é o card da home. Os dois slots do "O que é"
 * apontam pro mesmo arquivo de propósito: repetida na tela, ninguém publica sem
 * trocar. Ao gerar as reais, ler `regras/foto-assinatura.md` ANTES e casar com o
 * CSS: 1472×1440 no card grande (46/45) e 800×600 no pequeno (4/3).
 *
 * ⚠️ COPY = PRIMEIRO PASSE, sem número, prazo, garantia ou marca de produto
 * inventada (a lista PENDENTE DO DONO segue aberta).
 */
const bancosEEstofados: ServicoDetalhe = {
  seoDescription:
    "Tratamento de bancos em Simonésia, MG. Couro e tecido com processos próprios: extração, limpeza com pH adequado e hidratação. Avaliação gratuita.",
  hero: {
    eyebrow: "Estética automotiva · Bancos e estofados",
    title: "Os bancos do seu carro",
    // O destaque nomeia o DIFERENCIAL da categoria em vez de prometer um estado.
    // "Material por material" é verificável e é exatamente o que a higienização
    // geral não faz — resolve a dúvida do cliente sem precisar comparar preço.
    titleAccent: "tratados material por material",
    subtitle:
      "É a parte do carro que encosta em você o tempo inteiro. E a primeira que alguém repara ao abrir a porta.",
  },

  oQueE: {
    // Título nomeia os DOIS sintomas, um por material. Deliberadamente diferente
    // da fôrma do título da Higienização ("O que a limpeza comum não alcança")
    // pra as rotas irmãs não lerem como a mesma página com palavra trocada.
    title: "O couro que resseca, o tecido que encardiu",
    body: [
      // 🚩 Teste do eco: a Higienização já usa "a mancha no banco que já virou
      // parte do carro" no §1 dela. Aqui os sintomas são OUTROS de propósito:
      // desgaste por contato e ressecamento, não mancha.
      "O brilho gasto onde as costas encostam todo dia. A lateral do banco do motorista, que sofre em toda entrada e saída. O couro que perdeu a maciez e começou a marcar. Isso não é sujeira de superfície: é o material pedindo tratamento próprio.",
      "O tratamento de bancos vai atrás disso. Couro e tecido são materiais diferentes e pedem processos diferentes: extração no tecido, limpeza com pH adequado e hidratação no couro, revitalização no acabamento dos dois. Tratar o material, não só limpar a superfície.",
      "É o serviço certo pra quem tem banco de couro começando a ressecar, pra quem transporta criança ou pet, ou pra quem vai vender o veículo e sabe que o comprador senta antes de olhar qualquer outra coisa.",
    ],
    // ⚠️ PLACEHOLDER: os dois slots apontam pro MESMO arquivo de propósito.
    image: "/assets/servicos/bancos-e-estofados.jpg",
    imageAlt: "Banco de veículo após tratamento de estofado",
    imagePair: {
      src: "/assets/servicos/bancos-e-estofados.jpg",
      alt: "Detalhe do acabamento do banco depois do tratamento",
    },
  },

  cobre: {
    // Mesma construção das rotas irmãs: do PONTO pro TODO.
    title: "Do banco do motorista ao jogo inteiro",
    intro: "É isto que entra quando você faz o tratamento completo.",
    items: [
      {
        title: "Higienização do tecido",
        desc: "Extração da sujeira que penetrou no tecido e ficou presa nas costuras.",
      },
      {
        title: "Couro: limpeza e hidratação",
        desc: "Limpeza com pH adequado e reposição da maciez que o uso e o sol tiram.",
      },
      {
        title: "Áreas de contato",
        desc: "Tratamento das faixas que escurecem primeiro: encosto, assento e lateral de entrada.",
      },
      {
        // 🚩 Teste do eco: "sem brilho artificial" já é o fecho do card "Painel e
        // plásticos" da Higienização. Aqui a mesma ideia sai com outra palavra.
        title: "Revitalização do acabamento",
        desc: "Recuperação do aspecto e da cor do material, sem deixar aparência plastificada.",
      },
      {
        title: "Impermeabilização",
        desc: "Proteção que dá tempo de limpar o líquido derramado antes que ele penetre.",
      },
      {
        title: "Cintos e costuras",
        desc: "Limpeza dos cintos de segurança e das costuras, onde a sujeira entra sem aparecer.",
      },
    ],
    // 🚩 ÓRFÃO: o CoberturaBlock não renderiza `note` (mesmo caso das outras
    // duas rotas). Escrito pra ficar pronto se o campo voltar.
    // A dúvida é real e específica: muita gente não sabe se o banco é couro ou
    // courvin, e é isso que decide o processo.
    note: "Não sabe se o seu banco é couro ou courvin? Na avaliação a gente identifica o material antes de definir o tratamento, sem compromisso.",
    // 🚩 SEM `crossLink`, por decisão do Victor (2026-08-03) — e ele está certo.
    // O campo serve pra DEMARCAR FRONTEIRA, não pra vender a categoria vizinha:
    // na Higienização ele avisa que bancos não entram ali e têm página própria.
    // Na volta não existe fronteira pra demarcar, só adjacência, e a linha vira
    // upsell numa página que é só de bancos. Compare com o Polimento, onde o
    // link se sustenta porque há dependência técnica real (vitrificação pede
    // pintura corrigida antes). Aqui não há dependência nenhuma.
    // ⬜ Único cruzamento que teria a função certa, se ele quiser um dia:
    //    apontar carpetes/tapetes pra Higienização — quem lê "estofados" pode
    //    supor que o assoalho entra junto, e ele não entra. Não aplicado.
  },

  // 🚩 ÓRFÃOS (`beneficios`, `processo`, `cta`): o ServicoPage não renderiza
  // nenhum dos três. Preenchidos porque o tipo exige. Limpeza no backlog.
  beneficios: {
    title: "Por que tratar os bancos",
    body: [
      "O banco é a única parte do carro que encosta em você o tempo inteiro, e a que mais entrega descuido quando alguém abre a porta.",
    ],
    items: [
      {
        title: "Maciez de volta no couro",
        desc: "Couro hidratado para de endurecer, e é o endurecimento que abre trinca com o tempo.",
      },
      {
        title: "Tecido sem encardido",
        desc: "As faixas escuras de contato clareiam quando a sujeira sai de dentro da trama.",
      },
      {
        title: "Ambiente de quem anda com você",
        desc: "Estofado é onde resíduo e odor ficam presos por mais tempo dentro do carro.",
      },
      {
        title: "Valorização na revenda",
        desc: "Quem vai comprar senta no banco antes de reparar em qualquer outro detalhe.",
      },
    ],
    image: "/assets/servicos/bancos-e-estofados.jpg",
    imageAlt: "Bancos tratados, com acabamento recuperado",
  },

  processo: {
    title: "Como fazemos",
    steps: [
      {
        title: "Identificação do material",
        desc: "Definimos se é couro, courvin ou tecido, porque é isso que decide o processo.",
      },
      {
        title: "Limpeza",
        desc: "Extração no tecido, limpeza com pH adequado no couro, sem encharcar a espuma.",
      },
      {
        title: "Hidratação e revitalização",
        desc: "Reposição no couro e recuperação do acabamento, com secagem controlada.",
      },
      {
        title: "Entrega",
        desc: "Bancos conferidos e secos, com orientações pra conservar o resultado.",
      },
    ],
  },

  // CASES — nenhum trabalho real ainda. 5 cards de ENCHIMENTO pra sustentar a
  // leitura do reel. `placeholdersVisiveis: 5` sobrepõe o global (1), que é
  // calibrado pra categoria COM case real.
  // ➡️ Quando o 1º real entrar: escrever o case acima destes e baixar o número.
  // 🚩 NUNCA apagar os placeholders (ocultar-nunca-apagar).
  cases: {
    heading: "Alguns trabalhos",
    subheading: "Bancos tratados na MV, cada um no seu estado de origem.",
    placeholdersVisiveis: 5,
    items: [
      { id: "be-1", title: "Sedan · bancos de tecido", summary: "Encardido tratado nas faixas de mais contato.", placeholder: true },
      { id: "be-2", title: "SUV · couro ressecado", summary: "Limpeza e hidratação no jogo completo de couro.", placeholder: true },
      { id: "be-3", title: "Hatch · cadeirinha", summary: "Resíduo de alimento retirado de dentro da trama.", placeholder: true },
      { id: "be-4", title: "Picape · uso de serviço", summary: "Assentos recuperados depois de meses de estrada.", placeholder: true },
      { id: "be-5", title: "Sedan · pré-venda", summary: "Jogo inteiro tratado antes de anunciar o veículo.", placeholder: true },
    ],
  },

  faq: {
    title: "Perguntas frequentes",
    items: [
      {
        q: "Quanto tempo leva o tratamento dos bancos?",
        a: "Depende do material e do estado do jogo. Na avaliação gratuita a gente te passa o prazo certo antes de começar — sem surpresa.",
      },
      {
        // A pergunta que define a categoria. A resposta é o diferencial dela.
        q: "Serve para couro e para tecido?",
        a: "Serve, com processos diferentes. Tecido pede extração; couro pede limpeza com pH adequado e hidratação depois. Na avaliação identificamos o material antes de definir o tratamento.",
      },
      {
        // Limite honesto do serviço, como no FAQ do Polimento: dizer o que NÃO
        // sai constrói mais confiança do que prometer tudo.
        q: "Tira qualquer mancha?",
        a: "A maioria sai. Mancha antiga, tinta e material que já perdeu a camada de acabamento podem não voltar por completo. Quando é o caso, avisamos antes de começar.",
      },
      {
        // 🚩 Teste do eco: a Higienização já tem "Com que frequência devo
        // fazer?". Aqui a 4ª pergunta é outra, específica desta categoria.
        q: "Vale a pena impermeabilizar depois?",
        a: "Faz diferença para quem anda com criança ou com pet. A impermeabilização não impede a sujeira, mas dá tempo de limpar o líquido antes que ele penetre no tecido.",
      },
    ],
  },

  cta: {
    title: "Seus bancos merecem esse cuidado.",
    body: "Chame no WhatsApp, conte o material e o estado dos bancos e receba uma avaliação gratuita — sem compromisso.",
  },
};

/**
 * Limpeza de Motor — 4ª rota completa (Victor, 2026-08-03).
 * Réplica da estrutura validada, mesma ordem e mesmo registro.
 *
 * 🔑 O QUE MUDA NESTA CATEGORIA, e por que a copy tem outro trabalho: nas três
 * anteriores a barreira do cliente é ESTÉTICA (o carro está feio, quero que
 * melhore). Aqui a barreira é MEDO — "vai molhar a parte elétrica e dar
 * problema". É por isso que a ordem da página lidera com PROCESSO e proteção em
 * vez de resultado, e por isso o 1º card do "O que cobre" e a 1ª pergunta do FAQ
 * são os dois sobre a mesma objeção. Vender aparência aqui não destrava nada.
 *
 * 🚫 SEM `crossLink`, pela regra fechada em `regras/copy.md`: o campo demarca
 * fronteira, e o cofre do motor não tem fronteira ambígua com nenhuma das outras
 * 5 categorias, nem dependência técnica com elas.
 *
 * ⚠️ FOTO PLACEHOLDER (mesma decisão das rotas anteriores): o acervo só tem
 * `limpeza-de-motor-v2.jpg`, que já é o card da home, repetida nos dois slots do
 * "O que é" de propósito. Ao gerar as reais, ler `regras/foto-assinatura.md`
 * ANTES e casar com o CSS: 1472×1440 no card grande, 800×600 no pequeno.
 *
 * ⚠️ COPY = PRIMEIRO PASSE, sem número, prazo, garantia ou marca de produto
 * inventada. 🚩 Cuidado extra nesta rota: NÃO prometer segurança absoluta
 * ("sem risco", "garantido") — isso seria política operacional inventada. O que
 * a copy afirma é o PROCESSO (o que é protegido, em que ordem), que é
 * verificável.
 */
const limpezaDeMotor: ServicoDetalhe = {
  seoDescription:
    "Limpeza de motor em Simonésia, MG. Componentes elétricos protegidos antes do desengraxe, enxágue controlado e secagem. Avaliação gratuita.",
  hero: {
    eyebrow: "Estética automotiva · Motor",
    title: "O motor do seu carro",
    // O destaque responde a objeção em vez de prometer aparência. Descreve o que
    // é feito, não garante resultado — a diferença que mantém a frase honesta.
    titleAccent: "limpo sem molhar o que não pode",
    subtitle:
      "Muita gente nunca lavou o motor com medo de dar problema. O cuidado está em saber o que proteger antes de começar.",
  },

  oQueE: {
    // Título nomeia o sintoma pelo ângulo do abandono, não da sujeira: o cofre é
    // literalmente a parte do carro que o dono nunca abre, e é daí que vem o
    // estado dele. Fôrma diferente das outras três rotas.
    title: "A parte do carro que ninguém abre",
    body: [
      "Graxa que endureceu em volta do bloco. Folha seca acumulada no fundo do cofre. Poeira que virou crosta em cima das mangueiras. E o motivo de estar tudo assim: quase ninguém lava o motor, com medo de molhar o que não pode.",
      // Linha-âncora da categoria: "Proteger antes de molhar, secar antes de
      // fechar" é o processo inteiro em seis palavras, e responde o medo sem
      // prometer nada. Equivale ao "Remover na origem" da Higienização.
      "A limpeza de motor resolve isso com ordem. Primeiro protegemos o que é sensível: central, chicotes, alternador e as entradas de ar. Depois vem o desengraxante, a agitação onde a sujeira agarrou e o enxágue controlado, sem jato de pressão em cima de conector. Proteger antes de molhar, secar antes de fechar.",
      // O parêntese carrega o benefício mais concreto e verificável da categoria:
      // num cofre limpo, mancha nova de óleo salta à vista. Vale mais que
      // qualquer adjetivo sobre aparência.
      "É o serviço certo pra quem vai vender o veículo, pra quem vai levar na revisão (vazamento aparece na hora num motor limpo) ou pra quem simplesmente não abre o capô há anos.",
    ],
    // ⚠️ PLACEHOLDER: os dois slots apontam pro MESMO arquivo de propósito.
    image: "/assets/servicos/limpeza-de-motor-v2.jpg",
    imageAlt: "Compartimento do motor após limpeza e desengraxe",
    imagePair: {
      src: "/assets/servicos/limpeza-de-motor-v2.jpg",
      alt: "Detalhe do cofre do motor limpo, sem resíduo acumulado",
    },
  },

  cobre: {
    // Mesma construção das rotas irmãs: do PONTO pro TODO, aqui no eixo espacial
    // do compartimento.
    title: "Da tampa do motor ao fundo do cofre",
    intro: "É isto que entra quando você faz a limpeza completa.",
    items: [
      {
        // 🚩 PRIMEIRO de propósito: é a objeção da categoria. A ordem dos cards
        // é a ordem real do serviço, e começar pela proteção já responde o medo
        // antes de o cliente chegar no FAQ.
        title: "Proteção dos componentes",
        desc: "Central, chicotes, alternador e entradas de ar isolados antes de qualquer produto.",
      },
      {
        title: "Desengraxe",
        desc: "Remoção da graxa e do óleo que endureceram nas laterais do bloco.",
      },
      {
        title: "Tampas e plásticos",
        desc: "Limpeza das capas, tampas e reservatórios, sem acabamento oleoso por cima.",
      },
      {
        title: "Mangueiras e chicotes",
        desc: "Limpeza das linhas e do chicote elétrico, onde a poeira vira crosta.",
      },
      {
        title: "Fundo do cofre",
        desc: "Retirada de folha, terra e resíduo acumulados nos cantos mais baixos.",
      },
      {
        // Fecha o ciclo aberto pela linha-âncora: secar antes de fechar.
        title: "Secagem",
        desc: "Ar comprimido nos conectores e nos vãos antes de fechar o capô.",
      },
    ],
    // 🚩 ÓRFÃO: o CoberturaBlock não renderiza `note`. Escrito pra ficar pronto.
    note: "Faz anos que você não abre o capô? Na avaliação a gente olha o estado do cofre e diz o que dá pra fazer, sem compromisso.",
    // 🚫 SEM `crossLink`, pela regra de `regras/copy.md`: sem dependência técnica
    // e sem carve-out, a linha viraria upsell. Ver o cabeçalho deste objeto.
  },

  // 🚩 ÓRFÃOS (`beneficios`, `processo`, `cta`): o ServicoPage não renderiza
  // nenhum dos três. Preenchidos porque o tipo exige. Limpeza no backlog.
  beneficios: {
    title: "Por que limpar o motor",
    body: [
      // Nega o benefício falso na primeira linha. Cliente leigo às vezes acha
      // que motor limpo "anda melhor"; dizer que não constrói mais confiança
      // do que deixar a suposição de pé.
      "Cofre limpo não faz o carro andar melhor. Ele faz você enxergar o que está acontecendo ali dentro.",
    ],
    items: [
      {
        title: "Vazamento aparece",
        desc: "Numa superfície limpa, mancha nova de óleo fica visível antes de virar problema.",
      },
      {
        title: "Revisão mais fácil",
        desc: "Quem vai mexer no motor trabalha melhor e enxerga mais num cofre limpo.",
      },
      {
        title: "Menos acúmulo",
        desc: "Folha e resíduo presos nos cantos seguram umidade em cima de peça metálica.",
      },
      {
        title: "Valorização na revenda",
        desc: "Comprador que abre o capô e vê sujeira acumulada desconfia do resto do carro.",
      },
    ],
    image: "/assets/servicos/limpeza-de-motor-v2.jpg",
    imageAlt: "Compartimento do motor limpo, com acabamento seco",
  },

  processo: {
    title: "Como fazemos",
    steps: [
      {
        title: "Avaliação do cofre",
        desc: "Olhamos o estado do compartimento e o que precisa de proteção reforçada.",
      },
      {
        title: "Isolamento",
        desc: "Central, chicotes, conectores e entradas de ar cobertos antes de qualquer produto.",
      },
      {
        title: "Limpeza",
        desc: "Desengraxante, agitação onde a sujeira agarrou e enxágue controlado, sem alta pressão.",
      },
      {
        title: "Secagem e entrega",
        desc: "Ar comprimido nos vãos e conferência do cofre seco antes de fechar o capô.",
      },
    ],
  },

  // CASES — nenhum trabalho real ainda. 5 cards de ENCHIMENTO pra sustentar a
  // leitura do reel. `placeholdersVisiveis: 5` sobrepõe o global (1).
  // ➡️ Quando o 1º real entrar: escrever o case acima destes e baixar o número.
  // 🚩 NUNCA apagar os placeholders (ocultar-nunca-apagar).
  cases: {
    heading: "Alguns trabalhos",
    subheading: "Motores limpos na MV, cada um no seu estado de origem.",
    placeholdersVisiveis: 5,
    items: [
      { id: "lm-1", title: "Sedan · cofre encardido", summary: "Graxa endurecida retirada das laterais do bloco.", placeholder: true },
      { id: "lm-2", title: "SUV · pré-revisão", summary: "Motor limpo antes de seguir pra manutenção.", placeholder: true },
      { id: "lm-3", title: "Hatch · anos sem abrir", summary: "Folha e terra retiradas do fundo do compartimento.", placeholder: true },
      { id: "lm-4", title: "Picape · uso de estrada", summary: "Barro seco removido do cofre inteiro.", placeholder: true },
      { id: "lm-5", title: "Sedan · pré-venda", summary: "Compartimento tratado antes de anunciar o veículo.", placeholder: true },
    ],
  },

  faq: {
    title: "Perguntas frequentes",
    items: [
      {
        // 🚩 PRIMEIRA de propósito: é a objeção que trava a venda desta
        // categoria. A resposta descreve o PROCESSO, não promete segurança
        // absoluta — promessa de garantia é política operacional, e está na
        // lista PENDENTE DO DONO.
        q: "Lavar o motor pode dar problema elétrico?",
        a: "Esse é o cuidado central do serviço. Central, chicotes e conectores são protegidos antes de qualquer produto entrar, o enxágue é controlado, sem alta pressão, e a secagem é feita com ar comprimido antes de fechar o capô.",
      },
      {
        q: "Quanto tempo leva a limpeza do motor?",
        a: "Depende do estado do cofre. Na avaliação gratuita a gente te passa o prazo certo antes de começar — sem surpresa.",
      },
      {
        // Limite honesto, como nas rotas irmãs. Aqui ele é ainda mais
        // importante: confundir limpeza com reparo geraria reclamação real.
        q: "A limpeza resolve vazamento?",
        a: "Não. A limpeza mostra o vazamento, não conserta. Se aparecer mancha nova depois, é sinal de que a peça precisa de reparo mecânico, e avisamos quando encontramos.",
      },
      {
        // 🚩 Teste do eco: "Com que frequência devo fazer?" já existe no FAQ da
        // Higienização. Esta 4ª é específica da categoria, e a resposta declara
        // a mesma posição de acabamento que `regras/foto-assinatura.md` trava
        // pras fotos: matte, nunca lustroso.
        q: "O motor fica com aspecto brilhoso?",
        a: "Não. O acabamento fica seco e natural. Produto oleoso em cima de plástico quente atrai poeira e volta a sujar mais rápido.",
      },
    ],
  },

  cta: {
    title: "Seu motor merece esse cuidado.",
    body: "Chame no WhatsApp, conte há quanto tempo o cofre não é limpo e receba uma avaliação gratuita — sem compromisso.",
  },
};

/**
 * Vitrificação & Proteção — 5ª rota completa (Victor, 2026-08-03).
 *
 * 🔑 O EIXO: é o serviço mais caro do catálogo e o que o cliente menos entende.
 * A copy tem dois trabalhos, nesta ordem: (1) separar de CERA, que é com o que
 * ele compara; (2) **matar o mito de que vitrificação deixa a pintura à prova de
 * risco** — se o cliente comprar acreditando nisso, a reclamação é certa. Por
 * isso o limite aparece cedo, no FAQ, e não escondido no fim.
 *
 * 🔗 LEVA `crossLink` → Polimento, e é o caso mais forte dos seis: **dependência
 * técnica de verdade.** A camada sela a pintura no estado em que ela está, então
 * risco não corrigido fica selado embaixo. Quem chega aqui direto precisa saber
 * disso ANTES de fechar.
 * ⬜ Observação pra fase de copy: pela régua de `regras/copy.md`, este link é
 *    mais forte do que o inverso (Polimento → Vitrificação), que é "o que vem
 *    depois" e beira o upsell. Vale revisar aquele quando lapidarmos as copies.
 *
 * ⚠️ FOTO PLACEHOLDER (`vitrificacao-v2.jpg`, o card da home) e COPY = 1º PASSE.
 * 🚩 Nesta rota, o campo minado é DURABILIDADE: "protege por anos" depende do
 * produto aplicado, e qual produto a MV usa está PENDENTE DO DONO. Nenhuma
 * afirmação de prazo entrou na copy.
 */
const vitrificacao: ServicoDetalhe = {
  seoDescription:
    "Vitrificação em Simonésia, MG. Revestimento que protege a pintura corrigida, com efeito hidrofóbico e lavagem mais fácil. Avaliação gratuita.",
  hero: {
    eyebrow: "Estética automotiva · Proteção",
    // 🚩 Teste do eco: o Polimento já abre com "A pintura do seu carro". Aqui o
    // objeto é a PROTEÇÃO, não a pintura, e as duas rotas param de ler como a
    // mesma manchete com adjetivo trocado.
    title: "A proteção da pintura",
    // Separa de cera sem citar concorrente e sem afirmar prazo: fala do que a
    // lavagem faz (ou não faz) com a camada, que é observável.
    titleAccent: "que a lavagem não tira",
    subtitle:
      "A pintura corrigida fica exposta do mesmo jeito no dia seguinte. A vitrificação é o que segura esse resultado.",
  },

  oQueE: {
    // Sintoma pelo ângulo da frustração de quem JÁ pagou por um tratamento e viu
    // sumir. É a experiência real que antecede a busca por vitrificação.
    title: "O brilho que some poucas lavagens depois",
    body: [
      "O carro sai do polimento perfeito e um mês depois já não é o mesmo. A cera acabou na terceira lavagem. A chuva secou no capô e deixou marca. Poeira e resíduo voltam a agarrar como antes.",
      // Linha-âncora: "Proteger o que foi corrigido, em vez de repolir todo ano"
      // resume a proposta e amarra a categoria ao Polimento sem empurrar venda.
      "A vitrificação entra aí. É um revestimento que cura sobre o verniz e forma uma camada de sacrifício: a água escorre em vez de assentar, o resíduo tem menos onde agarrar e a lavagem seguinte sai mais fácil. Proteger o que foi corrigido, em vez de repolir todo ano.",
      "É o serviço certo pra quem acabou de polir e não quer perder o resultado, pra quem deixa o carro na rua ou embaixo de árvore, ou pra quem lava com frequência e cansou de repor cera.",
    ],
    // ⚠️ PLACEHOLDER: os dois slots apontam pro MESMO arquivo de propósito.
    image: "/assets/servicos/vitrificacao-v2.jpg",
    imageAlt: "Pintura vitrificada, com reflexo definido na lataria",
    imagePair: {
      src: "/assets/servicos/vitrificacao-v2.jpg",
      alt: "Detalhe do efeito hidrofóbico sobre a pintura tratada",
    },
  },

  cobre: {
    title: "Da pintura às rodas",
    intro: "É isto que entra quando você faz a proteção completa.",
    items: [
      {
        // 🚩 PRIMEIRO de propósito: é o ponto que decide se o serviço vale. A
        // camada sela o que estiver embaixo, então o preparo não é detalhe.
        title: "Preparo da pintura",
        desc: "Descontaminação e correção antes de aplicar, porque a camada sela o que estiver embaixo.",
      },
      {
        title: "Aplicação do revestimento",
        desc: "Produto aplicado painel a painel, com o tempo de cura respeitado antes da entrega.",
      },
      {
        title: "Efeito hidrofóbico",
        desc: "A água junta em gota e escorre, levando parte do resíduo em vez de secar na pintura.",
      },
      {
        title: "Rodas e pinças",
        desc: "Proteção nas rodas, onde o pó de freio agarra com mais força e queima com o calor.",
      },
      {
        title: "Plásticos externos",
        desc: "Proteção das peças plásticas de fora, que desbotam antes da lataria.",
      },
      {
        title: "Orientação de manutenção",
        desc: "Como lavar depois pra não comprometer o rendimento da camada aplicada.",
      },
    ],
    // 🚩 ÓRFÃO: o CoberturaBlock não renderiza `note`.
    note: "Não sabe se a sua pintura está pronta pra receber proteção? Na avaliação a gente olha o estado dela antes, sem compromisso.",
    // 🔗 O crossLink mais justificado do site: é PRÉ-REQUISITO, não sugestão.
    crossLink: {
      label: "Polimento",
      desc: "A camada sela a pintura como ela está. Risco precisa sair antes, e isso é polimento. Conheça a categoria.",
      slug: "polimento",
    },
  },

  // 🚩 ÓRFÃOS (`beneficios`, `processo`, `cta`): não renderizados. Limpeza no backlog.
  beneficios: {
    title: "Por que proteger a pintura",
    body: [
      "Polir recupera o que já foi perdido. Proteger é o que evita perder de novo no ano seguinte.",
    ],
    items: [
      {
        title: "Lavagem mais fácil",
        desc: "Com menos aderência, boa parte do resíduo sai na água antes de precisar esfregar.",
      },
      {
        title: "Menos marca de chuva",
        desc: "A água escorre em vez de secar parada sobre a pintura, que é o que deixa ponto branco.",
      },
      {
        title: "Barreira contra resíduo",
        desc: "Excremento de pássaro e seiva atacam o verniz. A camada leva o ataque primeiro.",
      },
      {
        title: "Resultado do polimento preservado",
        desc: "A correção rende por mais tempo quando não fica exposta desde o dia seguinte.",
      },
    ],
    image: "/assets/servicos/vitrificacao-v2.jpg",
    imageAlt: "Lataria protegida, com água formando gotas na superfície",
  },

  processo: {
    title: "Como fazemos",
    steps: [
      {
        title: "Avaliação da pintura",
        desc: "Vemos o estado do verniz e o que precisa ser corrigido antes de qualquer aplicação.",
      },
      {
        title: "Descontaminação",
        desc: "Retirada do resíduo agarrado, pra a camada assentar sobre a pintura limpa.",
      },
      {
        title: "Aplicação",
        desc: "Revestimento aplicado painel a painel, em ambiente controlado, com curva de cura respeitada.",
      },
      {
        title: "Entrega",
        desc: "Conferência na luz e orientação de como lavar pra não encurtar o rendimento.",
      },
    ],
  },

  cases: {
    heading: "Alguns trabalhos",
    subheading: "Pinturas protegidas na MV, cada uma no seu estado de origem.",
    placeholdersVisiveis: 5,
    items: [
      { id: "vt-1", title: "Sedan · pós-polimento", summary: "Proteção aplicada logo depois da correção da pintura.", placeholder: true },
      { id: "vt-2", title: "SUV · carro na rua", summary: "Camada aplicada em veículo que dorme fora da garagem.", placeholder: true },
      { id: "vt-3", title: "Hatch · primeira proteção", summary: "Preparo e revestimento em pintura nunca tratada.", placeholder: true },
      { id: "vt-4", title: "Picape · uso de estrada", summary: "Lataria e rodas protegidas para rodagem em terra.", placeholder: true },
      { id: "vt-5", title: "Sedan · manutenção da camada", summary: "Revisão da proteção aplicada em serviço anterior.", placeholder: true },
    ],
  },

  faq: {
    title: "Perguntas frequentes",
    items: [
      {
        // 🚩 PRIMEIRA de propósito: é o MITO da categoria. Deixar essa crença de
        // pé é o caminho mais curto pra reclamação depois da entrega.
        q: "Vitrificação deixa a pintura à prova de risco?",
        a: "Não. A camada resiste bem a resíduo, chuva e sol, mas risco de contato continua marcando o verniz. Proteção e blindagem são coisas diferentes.",
      },
      {
        q: "Preciso polir antes?",
        a: "Na maioria dos casos, sim. A camada sela a pintura no estado em que ela está, então risco e marca que ficarem embaixo continuam lá depois. Na avaliação vemos o que a sua precisa antes.",
      },
      {
        // 🚩 Campo minado: durabilidade depende do produto, e qual produto a MV
        // usa está PENDENTE DO DONO. A resposta empurra pra avaliação em vez de
        // inventar prazo.
        q: "Quanto tempo dura a proteção?",
        a: "Depende do produto aplicado e de como o veículo é usado e lavado. Na avaliação a gente te diz o que dá pra esperar no seu caso, antes de fechar.",
      },
      {
        q: "Posso lavar o carro normalmente depois?",
        a: "Pode, com atenção ao produto e ao pano. Lavagem agressiva e pano sujo encurtam o rendimento da camada, e a orientação de manutenção entra junto com a entrega.",
      },
    ],
  },

  cta: {
    title: "Sua pintura merece essa proteção.",
    body: "Chame no WhatsApp, conte o estado atual da pintura e receba uma avaliação gratuita — sem compromisso.",
  },
};

/**
 * Cristalização de Vidros — 6ª e última rota completa (Victor, 2026-08-03).
 *
 * 🔑 O EIXO, e o que a torna a categoria mais fácil de justificar do catálogo:
 * **é a única em que o ganho é SEGURANÇA, não aparência.** Vidro encardido
 * espalha a luz do farol que vem na frente, e à noite debaixo de chuva isso
 * cansa a vista de verdade. A copy inteira mora nessa cena, porque ela é
 * concreta, universal entre motoristas e não precisa de adjetivo nenhum.
 *
 * 🚫 SEM `crossLink` (regra de `regras/copy.md`): sem dependência técnica e sem
 * carve-out. ⚠️ Existiria UM candidato — insulfilm/película, que quem lê "vidros"
 * pode supor que entra —, mas **não está confirmado que a MV faz película**, e
 * a régua proíbe transformar PENDENTE DO DONO em copy publicada. Não entrou.
 *
 * ⚠️ FOTO PLACEHOLDER (`cristalizacao-v2.jpg`, o card da home) e COPY = 1º PASSE.
 */
const cristalizacaoDeVidros: ServicoDetalhe = {
  seoDescription:
    "Cristalização de vidros em Simonésia, MG. Remove marca de chuva incrustada e faz a água escorrer com o vento. Mais visibilidade na chuva.",
  hero: {
    eyebrow: "Estética automotiva · Vidros",
    title: "O para-brisa do seu carro",
    titleAccent: "sem o borrão da chuva",
    // A cena mais concreta que esta categoria tem: farol de frente espalhando no
    // vidro à noite. Não é venda, é a experiência que o motorista reconhece.
    subtitle:
      "Vidro encardido espalha a luz do farol que vem na frente. À noite, debaixo de chuva, é isso que mais cansa a vista.",
  },

  oQueE: {
    // Sintoma que qualquer motorista já viveu, e que ninguém associa a serviço.
    title: "A marca que o limpador não tira",
    body: [
      "O limpador passa e a marca continua ali. À noite, o farol do carro da frente vira um borrão espalhado no vidro. Depois da chuva ficam pontos brancos que a lavagem não leva. Isso não é sujeira solta: é resíduo que penetrou no vidro.",
      // Linha-âncora: nomeia as DUAS etapas, que é o que separa a cristalização
      // de "passar um produto no vidro".
      "A cristalização trata as duas metades do problema. Primeiro sai o que está incrustado: marca de chuva, resíduo mineral e a película de gordura que embaça por dentro. Depois entra o tratamento hidrofóbico, que faz a água juntar em gota e escorrer com o vento. Tirar o resíduo de dentro do vidro antes de proteger a superfície.",
      // O terceiro caso é o detalhe mais humano do catálogo: muita gente troca a
      // palheta achando que o problema é ela, quando é o vidro.
      "É o serviço certo pra quem dirige à noite, pra quem pega estrada com chuva, ou pra quem já trocou o limpador achando que o problema era a palheta.",
    ],
    // ⚠️ PLACEHOLDER: os dois slots apontam pro MESMO arquivo de propósito.
    image: "/assets/servicos/cristalizacao-v2.jpg",
    imageAlt: "Para-brisa tratado, com a água formando gotas sobre o vidro",
    imagePair: {
      src: "/assets/servicos/cristalizacao-v2.jpg",
      alt: "Detalhe do efeito hidrofóbico no vidro depois da cristalização",
    },
  },

  cobre: {
    title: "Do para-brisa aos retrovisores",
    intro: "É isto que entra quando você faz o tratamento completo.",
    items: [
      {
        title: "Remoção de incrustação",
        desc: "Saída da marca de chuva e do resíduo mineral que penetrou na superfície do vidro.",
      },
      {
        title: "Limpeza da face interna",
        desc: "Retirada da película de gordura que embaça e espalha a luz por dentro.",
      },
      {
        title: "Tratamento hidrofóbico",
        desc: "A água junta em gota e sai com o vento, em vez de espalhar na frente da vista.",
      },
      {
        title: "Laterais e traseiro",
        desc: "Mesmo tratamento nas outras faces, não só no para-brisa.",
      },
      {
        title: "Retrovisores",
        desc: "Espelhos tratados, onde a gota parada atrapalha mais na hora de mudar de faixa.",
      },
      {
        title: "Palhetas",
        desc: "Conferência do estado das palhetas, que riscam o vidro quando estão ressecadas.",
      },
    ],
    // 🚩 ÓRFÃO: o CoberturaBlock não renderiza `note`.
    note: "Não sabe se a marca do seu vidro sai? Na avaliação a gente olha antes e te diz o que dá pra recuperar, sem compromisso.",
    // 🚫 SEM `crossLink` — ver o cabeçalho deste objeto.
  },

  // 🚩 ÓRFÃOS (`beneficios`, `processo`, `cta`): não renderizados. Limpeza no backlog.
  beneficios: {
    title: "Por que tratar os vidros",
    body: [
      "É o único serviço da lista em que o ganho aparece dirigindo, não estacionado.",
    ],
    items: [
      {
        title: "Visão melhor na chuva",
        desc: "A água sai do campo de visão com o vento, em vez de escorrer espalhada no vidro.",
      },
      {
        title: "Menos ofuscamento à noite",
        desc: "Vidro sem película de resíduo espalha menos a luz do farol que vem na frente.",
      },
      {
        title: "Menos uso do limpador",
        desc: "Com o vidro tratado, o limpador trabalha menos e a palheta dura mais.",
      },
      {
        title: "Vidro mais fácil de limpar",
        desc: "Poeira e resíduo têm menos aderência e saem com menos esforço na lavagem.",
      },
    ],
    image: "/assets/servicos/cristalizacao-v2.jpg",
    imageAlt: "Vidro tratado, com gotas escorrendo sem espalhar",
  },

  processo: {
    title: "Como fazemos",
    steps: [
      {
        title: "Avaliação do vidro",
        desc: "Olhamos o tipo de marca e o quanto ela penetrou, porque isso define o que dá pra recuperar.",
      },
      {
        title: "Descontaminação",
        desc: "Remoção da incrustação e do resíduo mineral das duas faces do vidro.",
      },
      {
        title: "Aplicação",
        desc: "Tratamento hidrofóbico aplicado por face, com o tempo de assentamento respeitado.",
      },
      {
        title: "Entrega",
        desc: "Conferência na luz e orientação sobre palheta e produto de limpeza.",
      },
    ],
  },

  cases: {
    heading: "Alguns trabalhos",
    subheading: "Vidros tratados na MV, cada um no seu estado de origem.",
    placeholdersVisiveis: 5,
    items: [
      { id: "cv-1", title: "Sedan · marca de chuva", summary: "Incrustação removida do para-brisa e das laterais.", placeholder: true },
      { id: "cv-2", title: "SUV · uso noturno", summary: "Vidros tratados para quem roda à noite com frequência.", placeholder: true },
      { id: "cv-3", title: "Hatch · vidro embaçando", summary: "Película de gordura retirada da face interna.", placeholder: true },
      { id: "cv-4", title: "Picape · estrada de terra", summary: "Vidros recuperados depois de rodagem em poeira.", placeholder: true },
      { id: "cv-5", title: "Sedan · manutenção", summary: "Tratamento renovado em vidros já cristalizados antes.", placeholder: true },
    ],
  },

  faq: {
    title: "Perguntas frequentes",
    items: [
      {
        // Expectativa exagerada comum: que o limpador fica sem uso. Corrigir
        // isso antes evita frustração no primeiro dia de chuva.
        q: "Ainda vou precisar usar o limpador?",
        a: "Em velocidade baixa e no trânsito, sim. Conforme o carro ganha velocidade a água já começa a sair sozinha com o vento.",
      },
      {
        // Limite honesto, como nas rotas irmãs.
        q: "Tira marca antiga de chuva?",
        a: "A maioria sai. Marca que já atacou o vidro fundo pode deixar sombra, e quando é o caso avisamos antes de começar.",
      },
      {
        q: "Serve nos vidros laterais e no traseiro?",
        a: "Serve. O para-brisa é o mais pedido, mas o ganho nas laterais aparece na hora de olhar o retrovisor debaixo de chuva.",
      },
      {
        // 🚩 Teste do eco: "Quanto tempo dura?" já é a 3ª pergunta da
        // Vitrificação. Aqui a 4ª é a palheta, que é específica desta categoria
        // e ainda entrega uma informação útil que o cliente não esperava.
        q: "Palheta ressecada atrapalha o resultado?",
        a: "Atrapalha bastante. Palheta endurecida risca o vidro tratado e volta a espalhar a luz. Conferimos o estado dela na avaliação.",
      },
    ],
  },

  cta: {
    title: "Seus vidros merecem esse cuidado.",
    body: "Chame no WhatsApp, conte como estão os vidros e receba uma avaliação gratuita — sem compromisso.",
  },
};

/** Mapa slug → detalhe. Categorias fora daqui caem na versão RESUMO da rota. */
export const servicosDetalhe: Readonly<Record<string, ServicoDetalhe>> = {
  "higienizacao-interna": higienizacaoInterna,
  polimento,
  "bancos-e-estofados": bancosEEstofados,
  "limpeza-de-motor": limpezaDeMotor,
  vitrificacao,
  "cristalizacao-de-vidros": cristalizacaoDeVidros,
};
