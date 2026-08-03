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
    /** 🚩 Escape hatch (Victor, 2026-08-03, Bancos e Estofados): quando uma
     *  palavra do `title` (branca) precisa continuar na MESMA linha visual do
     *  `titleAccent` (azul) — ex. "tratados" branco colado em "de acordo"
     *  azul. Sem isto o `titleAccent` sempre abre linha própria no desktop
     *  (`display:block`), o que impede cor mista na mesma linha. Default
     *  (`undefined`) preserva o comportamento das outras 5 rotas. */
    accentInline?: boolean;
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
    /** 🎁 BÔNUS declarado no flyer real da categoria (Victor, 2026-08-03):
     *  serviço que entra junto, sem custo. Renderiza como FAIXA PRÓPRIA entre o
     *  grid e o `crossLink`, não como 7º card — o grid é de 3 colunas, e um card
     *  a mais ficaria órfão sozinho na 3ª linha. A faixa também é o lugar certo
     *  semanticamente: os 6 cards são o que a categoria COBRE; isto é o que ela
     *  DÁ. 🚩 Está no ar aguardando validação do dono da estética (ele ainda vai
     *  reler as copies e pode recuar da cortesia) — se cair, some a chave e a
     *  faixa desaparece sozinha, sem tocar em componente. */
    cortesia?: { label: string; text: string };
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
    // Título e subtítulo lapidados em conjunto com o Victor (2026-08-03):
    // categoria renomeada de "Higienização Interna" pra "Completa" — o título
    // já entrega a ideia de interior+exterior sem precisar de seção própria
    // pra parte externa (que aparece em detalhe só no "O que cobre").
    // 🚩 O `\n` é a quebra de linha ESCOLHIDA pelo Victor (2026-08-03): sem ele
    // o navegador quebrava em "…do seu / carro como", com a 2ª linha curta
    // demais. Só vale no desktop (`white-space: pre-line` no .title); no mobile
    // vira espaço comum e a frase flui sozinha. Ver ServicoPage.module.css.
    title: "O interior e o exterior\ndo seu carro como",
    titleAccent: "no primeiro dia.",
    // Registro revisado (Victor, 2026-08-03): a versão anterior foi apontada
    // como "melosa" — queria linguagem fácil e benefício direto, não cena
    // emocional nem tom de venda.
    subtitle:
      "Limpeza de verdade por dentro, sem cheiro nem poeira escondida,\ncom mais conforto no seu dia a dia.",
  },

  oQueE: {
    // Corpo reescrito com o Victor (2026-08-03), no lugar dos 3 parágrafos de
    // cena+definição+público-alvo: ele pediu linguagem fácil e foco em
    // benefício, sem tom de venda. Texto entregue por ele, só lapidado por mim
    // (paralelismo da lista + troca de "limpeza técnica" por "processo
    // técnico", que já é eco do título).
    title: "O que a limpeza comum não alcança",
    body: [
      "A higienização completa trata o interior do carro em profundidade: os tecidos, os bancos, o painel, o ar-condicionado e as frestas onde a sujeira se acumula. É um processo técnico que pode ser feito por dentro, por fora ou nos dois, num cuidado único.",
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
        // FUNDIDO (Victor, 2026-08-03): eram dois cards, "Carpetes e tapetes" e
        // "Teto e forros". Viraram um só — as duas são as superfícies de tecido
        // do carro — pra abrir o slot do card de lavagem externa, sem o site
        // deixar de comunicar o teto (que o catálogo da MV entrega de fato).
        title: "Carpetes, teto e forros",
        desc: "Extração profunda no assoalho e nos tapetes, e limpeza do teto e das colunas respeitando cada material.",
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
      {
        // Card que sustenta o "Completa" do nome da categoria (Victor,
        // 2026-08-03): é o único item da lista que sai do interior. Entrou no
        // slot aberto pela fusão de "Carpetes e tapetes" + "Teto e forros".
        // Texto escrito pelo Victor, itens vindos do catálogo real da MV.
        title: "Lavagem externa",
        desc: "Pré-lavagem com espuma automotiva, rodas e caixas de roda, grades, retrovisores e maçanetas.",
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
        q: "Quanto tempo leva uma higienização completa?",
        a: "Depende do estado do veículo. Na avaliação gratuita a gente te passa o prazo certo antes de começar — sem surpresa.",
      },
      {
        // Adicionada (Victor, 2026-08-03): a categoria virou "Completa" e o
        // corpo do "O que é" agora diz que dá pra escolher interior, exterior
        // ou os dois — sem essa pergunta, nenhum FAQ confirmava isso na prática.
        q: "Dá pra fazer só a parte interna ou só a externa?",
        a: "Dá sim. A higienização completa cobre as duas frentes, mas você escolhe o que faz sentido pro seu carro — só o interior, só a lavagem externa, ou os dois juntos.",
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
    // 🔑 2ª rodada (2026-08-03, pedido do Victor): a rota passa a FUNDIR dois
    // serviços — polimento de pintura e polimento de farol — mesmo molde da
    // Higienização Completa (interior+exterior numa rota só). "E o farol"
    // entra direto no título em vez de ficar só escondido no card 4 do "O que
    // cobre"; o accent "de volta ao brilho" segue valendo pros dois, sem
    // precisar reescrever (brilho da pintura, transparência do farol — a
    // frase não afirma nada técnico demais pra quebrar com o farol).
    // 🚩 `\n` trava a quebra ANTES do navegador orfanizar "carro" sozinho numa
    // linha (aconteceu na 1440 antes deste ajuste — ver
    // `quebra-de-linha-titulos-hero`, ler antes de mexer aqui de novo).
    title: "A pintura e o farol\ndo seu carro",
    titleAccent: "de volta ao brilho",
    // Nomeia os dois sintomas explicitamente, com o mesmo verbo espelhado
    // ("perdeu"/"perdeu") pra não parecer dois textos colados. `\n` marca a
    // quebra no fim da 1ª oração, mesma receita do resto da rota.
    subtitle:
      "O reflexo que a pintura perdeu não sumiu.\nNem a transparência que o farol perdeu por baixo do amarelado.",
  },

  oQueE: {
    // 🐞 Título trocado (2026-08-03): "As marcas que só aparecem no sol" era
    // exato pra teia de lavagem (some em luz difusa, só aparece em luz direta
    // e rasante), mas NÃO é verdade pro farol — o amarelado é visível em
    // qualquer luz. Manter a frase cobrindo os dois seria afirmar sem
    // critério (o defeito que já custou caro na rota de Motor — ver
    // `copy-nao-afirmar-sem-criterio`). Título novo nomeia os dois sintomas em
    // espelho, mesmo molde de "Couro e tecido não se limpam igual" (Bancos).
    title: "Pintura sem brilho, farol sem transparência",
    // Corpo reescrito pra encaixar os dois: mesma causa (sol, ao longo dos
    // anos, sobre dois materiais diferentes — verniz e policarbonato) →
    // tratamento próprio pra cada um, na construção "cada um sai de um jeito:
    // X; Y" que já funcionou em Bancos e Estofados (couro por pH+hidratação,
    // tecido por extração) → benefício dos dois juntos no fecho.
    body: [
      "Teias finas na lataria, o risco de anel no puxador e o farol amarelado têm a mesma origem: anos de sol sobre o verniz e sobre o policarbonato. Cada um sai de um jeito — na pintura, por abrasão controlada que nivela o risco em vez de disfarçar com cera; no farol, removendo a camada oxidada até a luz voltar a passar limpa. Nos dois casos, o serviço fecha com uma proteção por cima, pra segurar o resultado por mais tempo.",
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
    // 🐞 Título trocado (2026-08-03, pedido do Victor): era "Do risco isolado à
    // pintura inteira" — a mesma fôrma "do PONTO pro TODO" que ele já cortou em
    // Bancos ("soa gíria de quem já entende de carro") e em Motor. Título vira
    // rótulo funcional (mesmo molde de Motor: "O que a limpeza completa
    // cobre") e a faixa ponto-a-ponto desce pro subtítulo — aqui não é a ordem
    // real do serviço (isso é o campo `processo`, não renderizado), é o
    // primeiro e o último item da lista abaixo.
    title: "O que o polimento completo cobre",
    intro: "Da correção da pintura à proteção do resultado.",
    items: [
      {
        // 🐞 Era "Remoção de riscos superficiais, teias de lavagem e marcas do
        // uso diário" — só listava o que some, sem dizer como nem por quê (o
        // defeito genérico que o Victor pediu pra caçar nesta rota). Agora diz
        // o que muda entre um painel e outro, sem prometer corrigir risco
        // fundo (o FAQ já é honesto que isso não sai no polimento).
        title: "Correção da pintura",
        desc: "Cada painel recebe o corte que o estado do verniz pede, sem aplicar a mesma agressividade no carro inteiro.",
      },
      {
        title: "Oxidação e opacidade",
        // Mecanismo: o que o sol faz e o que o polimento reverte.
        desc: "O sol resseca a camada externa do verniz até ela embaçar; o polimento remove essa camada e expõe a cor viva por baixo.",
      },
      {
        // Diferencia do card de Correção: aqui o composto é mais fino, é outra
        // etapa (refino corrige o que o corte deixa), não o mesmo passo citado
        // no "O que é".
        title: "Refino e lustro",
        desc: "O corte inicial pode deixar microrrisco no verniz; o refino usa boina e composto mais finos até o reflexo voltar nítido.",
      },
      {
        // 🐞 Era "Polimento dos faróis amarelados..." — repetia a palavra do
        // título logo na abertura. Título ganhou o sintoma ("amarelados"), a
        // desc virou o porquê: é oxidação do policarbonato pelo UV, mesma
        // lógica da pintura, mecanismo diferente.
        // 🔑 2ª rodada (2026-08-03): acréscimo da proteção final, que o flyer
        // real da MV lista como parte do serviço ("Aplicação de proteção na
        // lente"). Sem inventar prazo — a durabilidade específica vive no FAQ.
        title: "Faróis amarelados",
        desc: "O amarelado é oxidação do policarbonato pelo sol; o polimento desgasta essa camada e devolve transparência ao facho, com uma proteção aplicada por cima pra segurar o resultado.",
      },
      {
        // Porquê a descontaminação existe como etapa própria, não só lista de
        // resíduo: protege o verniz de ser arranhado durante o corte.
        title: "Descontaminação",
        desc: "Resíduo ferroso, seiva e respingo de asfalto não saem na lavagem comum — e arranham o verniz se o polimento passar por cima sem removê-los antes.",
      },
      {
        // A tese "corrigir, não encobrir" já vive no "O que é" — aqui a proteção
        // aparece só como o que ela é: o passo que segura o resultado.
        title: "Proteção do resultado",
        desc: "Sem uma camada de proteção por cima, a pintura corrigida volta a marcar já nas primeiras lavagens — o acabamento final atrasa isso.",
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
        // Adicionada (2026-08-03, mesmo motivo da pergunta equivalente na
        // Higienização Completa): a rota fundiu pintura+farol, e sem essa
        // pergunta nenhum FAQ confirmava que dá pra pedir só um dos dois.
        // 🔑 2ª rodada: o flyer real da MV vende o farol EM PAR ("R$ 250 -
        // Par"), então a resposta precisa deixar isso claro pra não
        // desalinhar expectativa quando o cliente chegar no WhatsApp.
        q: "Dá pra polir só o farol, sem polir o carro inteiro?",
        a: "Dá sim. São processos independentes — você pode pedir só os faróis, só a pintura, ou os dois juntos. O polimento dos faróis é feito no par, não em um farol solto.",
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
        // Mesma honestidade da pergunta acima, agora pro farol.
        // 🔑 2ª rodada: o "2 a 3 anos" veio do flyer real da MV (bloco
        // "Resultado Final") — é o dado deles, não prazo inventado. Regra de
        // `.agents/product-marketing.md` sobre "sem número/prazo" vale pra
        // invenção; fato real da MV pode e deve entrar.
        q: "O farol volta a amarelar depois do polimento?",
        a: "Com o tempo, sim — é o mesmo sol que causou o amarelado da primeira vez. A proteção que aplicamos por cima do polimento ajuda a segurar a transparência por 2 a 3 anos, em média, dependendo da exposição do carro.",
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
    // Lapidado com o Victor (2026-08-03): "tratados material por material"
    // repetia a palavra e soava estranho; a 1ª correção ("cada material, seu
    // processo") resolvia a repetição mas quebrava a gramática — lido corrido
    // faltava o verbo ligando as duas partes do H1 (padrão das outras rotas:
    // "A pintura do seu carro, de volta ao brilho"). "Corretamente" saiu por
    // ser autoafirmação sem prova (mesma categoria vetada de
    // "qualidade"/"excelência").
    // 🚩 3ª rodada (Victor, 2026-08-03): ele queria a MESMA quebra de 3 linhas
    // ("Os bancos do seu carro" / "tratados de acordo" / "com o material") MAS
    // só "de acordo com o material" em azul — ou seja, "tratados" branco e
    // "de acordo" azul precisam dividir a mesma linha 2. Isso exigiu o
    // `accentInline` abaixo (ver comentário no tipo `ServicoDetalhe.hero`).
    // O `\n` aqui fecha "Os bancos do seu carro" na linha 1 antes de "tratados"
    // começar a linha 2.
    title: "Os bancos do seu carro\ntratados",
    titleAccent: "de acordo\ncom o material",
    // Sem isto, o `titleAccent` abriria linha própria (comportamento padrão
    // das outras 5 rotas) e "tratados" ficaria sozinho na linha 2.
    accentInline: true,
    // Registro revisado (Victor, 2026-08-03): a versão anterior era a cena
    // "encosta em você o tempo inteiro" — mesma queixa de "meloso" da
    // Higienização. Troca por linguagem fácil e benefício direto.
    subtitle:
      "Bancos limpos de verdade, com o processo certo pra cada material, seja couro ou tecido.",
  },

  oQueE: {
    // Registro revisado (Victor, 2026-08-03): a versão anterior era a fôrma
    // recusada (cena + aforismo + público-alvo), mesma queixa de "meloso" da
    // Higienização. Corpo escolhido por ele entre 3 opções apresentadas.
    title: "Couro e tecido não se limpam igual",
    body: [
      "O tratamento alcança a sujeira que ficou presa dentro da trama do tecido e o encardido que o uso deixa no couro. Cada um sai de um jeito: no tecido, por extração; no couro, com limpeza de pH adequado e hidratação para repor a maciez. Entram junto as laterais de entrada, os cintos e as costuras, e a impermeabilização.",
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
    // Registro revisado (Victor, 2026-08-03): a fôrma "do PONTO pro TODO" das
    // rotas irmãs ("Do banco do motorista ao jogo inteiro") não comunicava —
    // ele apontou que soa gíria de quem já entende de carro. Título+subtítulo
    // escolhidos entre várias rodadas de opções: foco no BENEFÍCIO (a lista é
    // completa), não na jornada sujo→limpo (óbvio demais, ele cortou de cara).
    title: "O que o tratamento completo cobre",
    intro: "Do assento aos cintos de segurança.",
    items: [
      {
        // Copy revisada (Victor, 2026-08-03): a versão anterior só repetia o
        // parágrafo do "O que é" ("extração") com outra roupagem. Agora nomeia
        // o mecanismo (a extratora) e contrasta com o que o aspirador não
        // alcança — sem "costuras", que já é do card 6.
        title: "Higienização do tecido",
        desc: "Uma extratora tira a sujeira de dentro da fibra, não só a da superfície.",
      },
      {
        // Título sem dois-pontos (era o único do site com essa pontuação),
        // espelhando "Higienização do tecido". Desc troca a frase quase
        // idêntica à do "O que é" pelo PORQUÊ da hidratação (risco de rachar).
        title: "Limpeza e hidratação do couro",
        desc: "Sem hidratação regular o couro resseca e racha, por isso limpeza e hidratação vêm sempre juntas.",
      },
      {
        title: "Áreas de contato",
        // "porta do motorista" no lugar de "lateral de entrada" — a mesma
        // frase literal já apareceu no parágrafo do "O que é" logo acima.
        desc: "Encosto, assento e porta do motorista escurecem primeiro, porque são os pontos que mais recebem contato.",
      },
      {
        // Título trocado: "Revitalização do acabamento" não dizia nada
        // verificável. 🚩 Teste do eco: "sem brilho artificial" já é o fecho do
        // card "Painel e plásticos" da Higienização — aqui a ideia continua
        // saindo com outra palavra ("plastificado"), só que também no título.
        title: "Sem acabamento plastificado",
        desc: "A cor volta ao normal e o material recupera o toque natural, que o desgaste tinha apagado.",
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
    // 🐞 Era "limpo sem molhar o que não pode" e o Victor cortou (2026-08-03):
    // a IDEIA é boa, mas "o que não pode" é subordinada mole, não fecha a
    // frase. "a elétrica" nomeia a coisa e o destaque para de escorregar.
    titleAccent: "limpo sem molhar a elétrica",
    // Registro revisado (2026-08-03), duas correções do Victor no mesmo passe:
    // (1) a versão original abria em "Muita gente nunca lavou o motor com medo
    // de dar problema" — falava dos OUTROS, não do que o cliente ganha;
    // (2) o meio de caminho fechava em "protegida antes de começar", e ele
    // cortou: antes de começar O QUÊ? Fecho solto, sem referente. Agora a frase
    // termina num estado concreto. 🚩 "elétrica" saiu daqui pra não ecoar o
    // título, que já é dono da palavra.
    subtitle:
      "Graxa, poeira e barro fora do cofre,\ne o carro pronto pra levar em qualquer revisão.",
  },

  oQueE: {
    // Título nomeia o sintoma pelo ângulo do abandono, não da sujeira: o cofre é
    // literalmente a parte do carro que o dono nunca abre, e é daí que vem o
    // estado dele. Fôrma diferente das outras três rotas.
    // 🐞 Era "A parte do carro que ninguém abre" e o Victor cortou (2026-08-03):
    // afirmação sem critério nenhum pra sustentar — o MESMO defeito do subtítulo
    // que ele já tinha mandado tirar ("Muita gente nunca lavou o motor…"). Eu
    // tirei de um lugar e deixei no outro.
    // 🔑 ENQUADRAMENTO da seção, dito por ele: é INFORMATIVA. Diz o óbvio com
    // clareza e descreve o que é feito. Não é tease, não é insinuação, não
    // precisa de gancho. Mesmo molde do "O que é" aprovado na Higienização.
    // Título escolhido pelo Victor (2026-08-03). "Atenção" no lugar de
    // "limpeza": não repete a palavra que já está no hero, no título do "O que
    // cobre" e no nome da categoria, e é a palavra dele pro que a seção comunica.
    title: "O motor também precisa de atenção",
    // 🐞 O corpo anterior abria em "segue uma ordem que não muda" e ele cortou
    // pela mesma razão do título: por que precisa NECESSARIAMENTE seguir uma
    // ordem? Premissa inventada. Agora o parágrafo só descreve o que o serviço
    // trata e o cuidado que existe nele, sem afirmar regra que não dá pra
    // provar. Antes disso, a versão original era a fôrma recusada de 3 §§
    // (cena → aforismo "Proteger antes de molhar, secar antes de fechar" →
    // "É o serviço certo pra quem…").
    body: [
      "Graxa e óleo acumulados escondem de onde vem um vazamento. A limpeza de motor trata o compartimento inteiro: o bloco, as tampas plásticas, as mangueiras, o chicote elétrico e o fundo do cofre, onde barro e folha se acumulam. Protegemos os componentes sensíveis durante todo o serviço, e num motor limpo qualquer vazamento novo aparece de primeira.",
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
    // 🐞 O título anterior era "Da tampa do motor ao fundo do cofre" — a mesma
    // fôrma "do PONTO pro TODO" que o Victor recusou em Bancos e Estofados
    // ("soa gíria de quem já entende de carro"). Agora o título é o rótulo
    // funcional e a faixa desce pro subtítulo, exatamente como ficou lá.
    title: "O que a limpeza completa cobre",
    // A faixa aqui é o PROCESSO, não o espaço físico: é a espinha da categoria
    // e a ordem real em que os 6 cards estão dispostos.
    intro: "Da proteção da elétrica à secagem final.",
    items: [
      {
        // 🚩 PRIMEIRO de propósito: é a objeção da categoria. A ordem dos cards
        // é a ordem real do serviço, e começar pela proteção já responde o medo
        // antes de o cliente chegar no FAQ.
        title: "Proteção dos componentes",
        desc: "Isolamos central, chicotes, alternador e entradas de ar antes de qualquer produto entrar.",
      },
      {
        title: "Desengraxe",
        // Mecanismo, não repetição: o produto amolece, então não precisa raspar.
        desc: "O desengraxante amolece a graxa endurecida no bloco, e ela sai sem precisar de raspagem.",
      },
      {
        title: "Tampas e plásticos",
        // O "sem produto oleoso" ganha o PORQUÊ, que o card antigo não dava.
        desc: "Capas, tampas e reservatórios ficam limpos sem produto oleoso por cima, que atrai poeira de novo.",
      },
      {
        title: "Mangueiras e chicotes",
        // Mecanismo, não repetição: escova em vez de jato direto, e o porquê.
        desc: "A crosta de poeira sai com escova, sem jato direto que possa forçar os conectores.",
      },
      {
        title: "Fundo do cofre",
        // Não repete mais "barro e folha se acumulam" do parágrafo do "O que é"
        // (linha ~926) — agora explica por que esse ponto fica de fora do
        // cuidado comum, sem inventar técnica não confirmada (ex.: "sucção").
        desc: "É o ponto mais baixo do cofre — o único que fica de fora quando o motor é só espanado por cima.",
      },
      {
        title: "Secagem",
        desc: "O ar comprimido tira a água dos conectores e dos vãos antes de o capô fechar.",
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

  // CASES — 🔕 SEÇÃO OCULTA (Victor, 2026-08-03): "a gente não tem case ainda".
  // O `0` zera os cards de enchimento; como não há nenhum trabalho REAL nesta
  // categoria, `casesPublicaveis` devolve lista vazia e o ServicoPage não
  // renderiza a seção — some título, setas e o padding, sem vão na página.
  // ➡️ PRA REATIVAR: basta escrever o 1º case real no `items` (com fotos). A
  //    seção volta SOZINHA, sem tocar neste número — com `0`, o que aparece é
  //    exatamente o que é real. Só voltar pra `5` se ele quiser encher o reel
  //    de novo enquanto a captação não acontece.
  // 🚩 NUNCA apagar os placeholders (ocultar-nunca-apagar) — eles seguem aqui,
  //    dormentes, e voltam a servir de molde quando o trabalho real chegar.
  cases: {
    heading: "Alguns trabalhos",
    subheading: "Motores limpos na MV, cada um no seu estado de origem.",
    placeholdersVisiveis: 0,
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
  // 2ª rodada: passa a citar os plásticos (o 2º serviço do agrupamento) e o
  // prazo real de 2 anos, que é o que diferencia numa lista de resultados.
  seoDescription:
    "Vitrificação em Simonésia, MG: camada cerâmica na pintura e nos plásticos externos, com proteção de até 2 anos. Avaliação gratuita.",
  hero: {
    eyebrow: "Estética automotiva · Proteção",
    // 🔑 2ª rodada (2026-08-03, flyers reais da MV): a rota passa a FUNDIR dois
    // serviços do catálogo — Vitrificação Comercial (pintura) + Vitrificação de
    // Plásticos Externos —, mesmo molde da Higienização Completa e do Polimento.
    // 🚩 Teste do eco: NÃO usar "A pintura e os plásticos do seu carro", que
    // seria a manchete do Polimento ("A pintura e o farol do seu carro") com as
    // palavras trocadas. O objeto aqui é o CARRO protegido, e o prazo carrega o
    // destaque — é o dado que separa da cera sem citar concorrente.
    // ✅ "dois anos" é dado REAL do flyer ("protegido por até 2 anos" / "Pintura
    // protegida por até 24 meses"), não prazo inventado — mesma licença do
    // "2 a 3 anos" do farol no Polimento (regra 6 vale pra invenção, não pra
    // fato da MV).
    title: "Seu carro protegido",
    titleAccent: "por dois anos",
    // Responde "protegido de quê / como" na linha seguinte, pra o destaque não
    // ficar com referente solto (o defeito recorrente — ver
    // `copy-mv-registro-processo`). `\n` marca a quebra no fim da 1ª oração.
    subtitle:
      "Uma camada cerâmica sobre o verniz e sobre as peças plásticas de fora.\nA água escorre, a sujeira agarra menos, e a lavagem seguinte sai mais fácil.",
  },

  oQueE: {
    // 🐞 Título trocado (2026-08-03): "O brilho que some poucas lavagens depois"
    // era tease E afirmação sem critério (quantas lavagens? de quem?) — os dois
    // defeitos que custaram caro na rota de Motor. O novo faz o trabalho nº1 do
    // eixo (separar de CERA, que é com o que o cliente compara) apoiado no dado
    // real do flyer, então a comparação é verificável em vez de retórica.
    title: "Proteção que dura mais que uma cera",
    // Corpo saiu da fôrma recusada (3 §§ cena+aforismo+público-alvo) pra 1
    // parágrafo informativo na fôrma aprovada: problema observável → o que o
    // serviço trata (lista concreta, agora com os DOIS materiais) → benefício.
    // A lista de peças plásticas é a do flyer 12 (para-choques, retrovisores,
    // frisos e acabamentos). "Recebe o desgaste no lugar da superfície" é a
    // camada de sacrifício dita sem jargão.
    body: [
      "O sol, a chuva e o resíduo do dia a dia atacam o verniz e as peças plásticas o ano inteiro. A vitrificação cobre os dois com uma camada cerâmica: na pintura, aplicada painel a painel sobre o verniz original; nos plásticos externos, o mesmo revestimento nos para-choques, retrovisores, frisos e acabamentos, que devolve a cor e segura o desbotamento. A camada recebe o desgaste no lugar da superfície e mantém o carro protegido por até dois anos.",
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
    // 🐞 Título trocado (2026-08-03): era "Da pintura às rodas" — a fôrma "do
    // PONTO pro TODO" que ele já cortou em Bancos ("soa gíria de quem já entende
    // de carro") e de novo em Motor. Vira rótulo funcional, e a faixa
    // ponto-a-ponto desce pro subtítulo. 🚩 "rodas" saiu junto: NENHUM flyer da
    // MV menciona roda ou pinça de freio — era invenção minha (ver o card antigo
    // "Rodas e pinças" abaixo, removido pelo mesmo motivo).
    title: "O que a vitrificação completa cobre",
    // 🐞 O intro antigo ("É isto que entra quando você faz a proteção completa")
    // era legenda de lista, não dizia nada. Agora carrega a faixa do PROCESSO,
    // que é a espinha da categoria — mesma receita de Motor.
    intro: "Da correção da pintura à proteção dos plásticos.",
    // 🚩 Os 6 cards saíram do 1º passe genérico e agora seguem os flyers reais
    // (Vitrificação Comercial + Vitrificação de Plásticos). Cada um acrescenta
    // MECANISMO, nunca reformula o parágrafo do "O que é"
    // (`copy-cards-nao-repetem-paragrafo`).
    items: [
      {
        // 🚩 PRIMEIRO de propósito: é o ponto que decide se o serviço vale. A
        // camada sela o que estiver embaixo, então o preparo não é detalhe.
        // ✅ Respaldo do flyer: "Correção com Polimento Comercial" está na
        // PREPARAÇÃO — o polimento não é upsell desta rota, é pré-requisito
        // declarado por eles. Isso também resolve a dúvida antiga sobre o
        // crossLink inverso (Polimento → Vitrificação) "beirar upsell".
        title: "Correção antes da camada",
        desc: "A camada sela a pintura no estado em que ela está, então o polimento entra antes: risco que ficar embaixo continua lá depois.",
      },
      {
        // ✅ Flyer: "Descontaminação da pintura" (Preparação). O porquê é o que
        // o card acrescenta — sem ele, é só nome de etapa.
        title: "Descontaminação da pintura",
        desc: "Resíduo ferroso e respingo agarrados no verniz impedem a camada de assentar direto sobre a pintura.",
      },
      {
        // ✅ Flyer: "Vitrificação da pintura" + "Processo técnico de cura e
        // fixação do produto" (Aplicação). A cura é o mecanismo não-óbvio.
        title: "Vitrificação da pintura",
        desc: "O produto é aplicado painel a painel e passa pelo tempo de cura antes de o carro sair.",
      },
      {
        // ✅ Flyer 12 (Vitrificação de Plásticos Externos), o 2º serviço que esta
        // rota agrupa: a lista de peças e o ganho ("Cor original restaurada",
        // "Menos ressecamento e desbotamento") são de lá.
        title: "Vitrificação dos plásticos",
        desc: "Para-choques, retrovisores, frisos e acabamentos recebem o revestimento que segura o ressecamento e o desbotamento.",
      },
      {
        // Funde o antigo card "Efeito hidrofóbico" com a resistência a resíduo:
        // é UM mecanismo só (a camada é o que recebe o ataque), e assim sobra
        // slot pros dois serviços do agrupamento. ✅ Flyer: "Superfície mais lisa
        // e repelente à água" + "Resistência a fezes de aves e seiva de árvores".
        title: "Barreira sobre o verniz",
        desc: "A água junta em gota e escorre; seiva de árvore e fezes de pássaro encontram a camada antes de encontrar o verniz.",
      },
      {
        // ✅ Flyer: "Proteção contra raios UV". Fecha a lista pelo agente que
        // ataca os DOIS materiais da rota, amarrando pintura e plástico.
        title: "Proteção contra o sol",
        desc: "O UV é o que desbota a pintura e resseca os plásticos; a camada recebe essa exposição por cima das duas superfícies.",
      },
    ],
    // 🚩 ÓRFÃO: o CoberturaBlock não renderiza `note`.
    note: "Não sabe se a sua pintura está pronta pra receber proteção? Na avaliação a gente olha o estado dela antes, sem compromisso.",
    // 🎁 Do flyer da Vitrificação Comercial, literal: "CORTESIA INCLUSA:
    // descontaminação e cristalização de TODOS os vidros!". Victor autorizou
    // publicar em 2026-08-03 ("pode colocar exatamente como está nos flyers"),
    // com a ressalva de que o dono da estética ainda vai reler e pode recuar —
    // por isso vive numa chave própria, fácil de remover.
    // 🚩 Preço e tempo do flyer NÃO entram (regra fechada: fechamento por
    // WhatsApp). Só o brinde.
    cortesia: {
      label: "Cortesia inclusa",
      text: "Descontaminação e cristalização de todos os vidros entram junto com a vitrificação, sem custo.",
    },
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

  // 🔕 SEÇÃO OCULTA (Victor, 2026-08-03) — mesma receita da Limpeza de Motor:
  // sem case real, `0` esvazia a lista publicável e a seção inteira não
  // renderiza. Reativa sozinha quando o 1º trabalho real for escrito aqui.
  cases: {
    heading: "Alguns trabalhos",
    subheading: "Pinturas protegidas na MV, cada uma no seu estado de origem.",
    placeholdersVisiveis: 0,
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
        // ✅ DESTRAVADO 2026-08-03 pelos flyers reais: "protegido por até 2 anos"
        // / "Pintura protegida por até 24 meses". Antes esta resposta esquivava
        // do prazo ("depende do produto aplicado") porque eu não tinha o dado —
        // hoje tenho, e é da MV, não inventado. A ressalva de uso/lavagem fica,
        // porque o próprio flyer diz "até".
        q: "Quanto tempo dura a proteção?",
        a: "Até dois anos, dependendo de como o veículo é usado e lavado. Na avaliação a gente te diz o que dá pra esperar no seu caso, antes de fechar.",
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
  // 2ª rodada: "chuva ácida" entra, porque é o NOME do serviço no catálogo real
  // (flyer "Remoção de Chuva Ácida + Cristalização de Vidros") e é o termo que o
  // cliente digita.
  seoDescription:
    "Cristalização de vidros em Simonésia, MG: remoção de mancha de chuva ácida e camada que faz a água escorrer com o vento. Avaliação gratuita.",
  hero: {
    eyebrow: "Estética automotiva · Vidros",
    // 🔑 ESCOLHIDO POR ELE (2026-08-03), entre 6 opções apresentadas. O caminho
    // até aqui, que vale como régua:
    //  1. "O para-brisa do seu carro" — estreito demais (o serviço trata TODOS
    //     os vidros, não só o da frente).
    //  2. "Vidros sem mancha / e chuva sem borrão" — ele cortou "borrão":
    //     *"precisa ser mais claro, eu não sei do que você está falando"*. É o
    //     REFERENTE SOLTO de novo (borrão de quê?), o mesmo defeito de "o que
    //     não pode" e "antes de começar" na rota de Motor.
    //  3. Mais 3 opções minhas, todas recusadas de uma vez — e o diagnóstico foi
    //     de ENQUADRAMENTO, não de palavra: as quatro tentavam descrever *a
    //     chuva atrapalhando a visão*, que é cena negativa e abstrata. Só
    //     destravou quando parei de propor variações e ofereci ÂNGULOS.
    // 🚩 Eco conhecido e aceito por ele: Bancos ("Os bancos do seu carro
    //    tratados") e Polimento ("A pintura e o farol do seu carro") já usam
    //    "<peça> do seu carro" — esta é a 3ª. Eu tinha evitado de propósito; ele
    //    escolheu assim mesmo, sabendo. NÃO reabrir sem ele pedir.
    // Sem `\n`: as duas linhas cabem inteiras em 1024→1920 (medido), e o
    // `titleAccent` já abre linha própria por padrão (`display:block`).
    title: "Os vidros do seu carro",
    titleAccent: "transparentes de novo",
    // 🔑 MANTIDO quase intacto de propósito — é a linha mais forte das 6 rotas: a
    // cena é um fato óptico observável, não uma suposição sobre o que "as pessoas
    // fazem" (o defeito de `copy-nao-afirmar-sem-criterio`). Só "encardido" virou
    // "manchado", pra amarrar com a chuva ácida do título e do corpo.
    subtitle:
      "Vidro manchado espalha a luz do farol que vem na frente.\nÀ noite, debaixo de chuva, é isso que mais cansa a vista.",
  },

  oQueE: {
    // 🐞 2 trocas até fechar (2026-08-03). "A marca que o limpador não tira" não
    // nomeava a chuva ácida; a 2ª, "Chuva ácida deixa marca no vidro", ele cortou
    // pelo TOM — e o diagnóstico vale pras outras rotas: aquele título punha **a
    // chuva como sujeito**, virando manchete sobre chuva ácida em vez de falar do
    // carro de quem lê. Nenhum título aprovado no site é sobre o agente agressor;
    // todos falam do carro ou do serviço ("O motor também precisa de atenção").
    // 🔑 O título agora abre o PROBLEMA e a seção seguinte abre RESOLVENDO ele —
    // par pedido por ele: *"se for falar do problema na seção 2, tem que abrir a
    // seção posterior e falar que é aquilo que resolve. Contraste."* O elo é
    // "não sai lavando" → "Tira o que está incrustado" (ver `cobre.intro`).
    title: "Nem toda sujeira do vidro sai lavando",
    // Saiu a fôrma recusada (3 §§) pra 1 parágrafo na fôrma aprovada: problema
    // observável → o que o serviço trata → benefício. As duas etapas (remover o
    // incrustado, depois proteger) são o que o flyer descreve e o que separa
    // isto de "passar um produto no vidro". Fecho no eixo da categoria — a única
    // das 6 em que o ganho é SEGURANÇA, e o flyer confirma ("contribuindo para
    // uma condução mais segura").
    // 🚩 Cortado daqui: "a película de gordura que embaça por dentro" — nenhum
    // flyer menciona a face INTERNA do vidro, e eu tinha afirmado isso sem base.
    // Volta se o Victor confirmar que o serviço trata o vidro por dentro.
    body: [
      "A chuva ácida, a poeira e o tempo deixam manchas agarradas na superfície do vidro, que o limpador também não tira. A cristalização trata os vidros em duas etapas: primeiro sai o que está incrustado, depois entra uma camada protetora que faz a água juntar em gota e escorrer com o vento. Vidro transparente muda o que você enxerga à noite e na chuva.",
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
    // 🐞 Título trocado: "Do para-brisa aos retrovisores" era a fôrma "do PONTO
    // pro TODO" cortada em Bancos e em Motor — e ainda prometia retrovisor, que
    // nenhum flyer menciona. Vira rótulo funcional + faixa de processo no
    // subtítulo, mesma receita das rotas já fechadas.
    title: "O que o tratamento dos vidros cobre",
    // 🔑 O CONTRASTE com a seção de cima (Victor, 2026-08-03): o "O que é" abre
    // no problema ("Nem toda sujeira do vidro sai lavando") e este subtítulo abre
    // resolvendo exatamente ele — "não sai lavando" → "Tira o que está
    // incrustado". A faixa de processo antiga ("Da remoção da mancha à camada que
    // repele a água") descrevia a lista sem responder a seção anterior.
    // 🚩 O título ficou no molde das outras 5 rotas de propósito: das 3 opções
    // apresentadas, ele escolheu a que preserva o padrão "O que a X cobre" e faz
    // o contraste só no subtítulo.
    intro: "Tira o que está incrustado e protege pra não voltar.",
    // 🚩 TRÊS cards antigos saíram por não terem respaldo em flyer nenhum —
    // eram invenção minha, o defeito de `copy-nao-afirmar-sem-criterio`:
    // "Limpeza da face interna" (gordura por dentro), "Retrovisores" e
    // "Palhetas" (esta ainda por cima era política operacional: conferir o
    // estado da palheta do cliente). Se o Victor confirmar qualquer um dos três
    // com o dono, voltam com o mecanismo que já estava escrito.
    items: [
      {
        // ✅ Flyer: "Remoção de manchas de chuva ácida". O mecanismo é o porquê
        // de ser serviço e não lavagem: está INCRUSTADO, não pousado em cima.
        title: "Remoção de chuva ácida",
        desc: "A mancha da chuva ácida fica incrustada na superfície, e por isso não sai com produto de limpeza comum.",
      },
      {
        // ✅ Flyer: "Limpeza profunda dos vidros". O card acrescenta o que a
        // película faz (embaça mesmo depois de lavado), não repete o nome.
        title: "Limpeza profunda",
        desc: "Poeira e resíduo do tempo formam uma película que embaça o vidro mesmo depois de lavado.",
      },
      {
        // ✅ Flyer: "Aplicação de cristalização protetora" + "Tratamento de
        // proteção da superfície do vidro".
        title: "Camada de cristalização",
        desc: "O tratamento sela a superfície depois de limpa, pra a mancha não voltar a se agarrar tão rápido.",
      },
      {
        // ✅ Flyer: "Vidros com efeito hidrorrepelente". Mantido do 1º passe —
        // já trazia o efeito sentido, não o nome da etapa.
        title: "Efeito hidrorrepelente",
        desc: "A água junta em gota e sai com o vento, em vez de espalhar na frente da vista.",
      },
      {
        // Substitui o antigo "Laterais e traseiro", que era fragmento sem verbo
        // ("Mesmo tratamento nas outras faces"). ✅ Respaldo: o flyer da
        // Vitrificação declara "cristalização de TODOS os vidros", e o desta
        // categoria fala em "vidros" no plural o tempo todo.
        title: "Todos os vidros",
        desc: "Para-brisa, laterais e traseiro recebem o mesmo tratamento, não só o vidro da frente.",
      },
      {
        // ✅ Flyer: "Maior facilidade na limpeza dos vidros". 🚩 Escolhido no
        // lugar de um card sobre ofuscamento à noite, que ecoaria o subtítulo do
        // hero (teste do eco — a cena do farol já é a linha de abertura da rota).
        title: "Limpeza mais fácil depois",
        desc: "Com a superfície selada, poeira e resíduo têm menos onde agarrar e saem com menos esforço.",
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

  // 🔕 SEÇÃO OCULTA (Victor, 2026-08-03) — mesma receita das outras duas.
  // 🚩 Quando reativar, ANTES de publicar: o card `cv-3` abaixo ainda promete
  //    "película de gordura retirada da face interna", que é justamente o
  //    escopo que saiu dos cards por falta de respaldo em flyer. Ou o dono
  //    confirma que o serviço trata o vidro por dentro, ou esse summary muda.
  cases: {
    heading: "Alguns trabalhos",
    subheading: "Vidros tratados na MV, cada um no seu estado de origem.",
    placeholdersVisiveis: 0,
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
  "higienizacao-completa": higienizacaoInterna,
  polimento,
  "bancos-e-estofados": bancosEEstofados,
  "limpeza-de-motor": limpezaDeMotor,
  vitrificacao,
  "cristalizacao-de-vidros": cristalizacaoDeVidros,
};
