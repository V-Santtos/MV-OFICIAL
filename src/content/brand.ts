/**
 * Identidade da marca + copy compartilhada (hero, posicionamento, contato, nav, social).
 * Conteúdo migrado as-is do case congelado. NÃO redesenhar aqui — Fase 2.
 *
 * ⚠️ Bugs de conteúdo herdados (parqueados p/ Fase 2, ver ANEXO-MEMORIA §6):
 *   - ~~WhatsApp é placeholder~~ ✅ RESOLVIDO 2026-08-03 (número confirmado pelo Victor).
 *   - Nome do fundador conflita entre `alt` da foto ("Diogo Andrade") e o texto ("Matheus Vitor").
 *   - Nav tem âncora quebrada (`#quem-somos` não existe; a seção é `#posicionamento`).
 *   - Redes sociais genéricas; Política/Termos vazios.
 */

export const brand = {
  name: "MV Estética Automotiva",
  shortName: "MV",
  city: "Simonésia",
  state: "MG",
  location: "Simonésia, MG",

  /** Cor de destaque da marca. Fonte-verdade real vive em tokens.css. */
  accent: "#3965C8",

  /**
   * Frase de fechamento usada no rodapé.
   *
   * Fechada em 2026-07-22 (Victor) depois de MUITAS rodadas. O que a frase faz:
   * o leitor precisa se reconhecer nela ("essa estética é pra mim"), então ela
   * descreve o CLIENTE, não a MV. O duplo sentido de "vale" (em dinheiro e em
   * estima) é o que a segura sem precisar de adjetivo.
   *
   * 🚫 O QUE JÁ CAIU AQUI, pra não voltar:
   *  · "…entre um serviço comum e um resultado que dura" — "resultado que dura"
   *    é promessa de tempo sem objeto, não dá imagem nenhuma.
   *  · "…entre lavar um carro e cuidar dele" — boa tese, mas define a MV pelo
   *    que ela NÃO é: sem o lava-jato do outro lado, a frase não existe.
   *  · "…como um investimento importante" — "importante" é intensificador vazio
   *    (mesmo caso do "realmente" cortado do título do Contato no mesmo dia), e
   *    "investimento" é clichê de anúncio: carro DESVALORIZA. O contexto de
   *    marketing chama o carro de "segundo maior BEM", que é outra coisa.
   *  · A palavra "qualidade" — vaga, todo concorrente assina.
   *
   * ⚠️ REGRA DURA (a lição mais cara do dia): as versões que o Victor chamou de
   * "feitas por IA" tinham sempre uma SEGUNDA METADE depois de travessão, com
   * autoelogio abstrato ("responde pelo trabalho", "o acabamento se sustenta
   * sozinho"). A skill `marketing:humanizer` nomeia esse aglomerado: travessão +
   * fórmula de aforismo + paralelismo negativo + regra de três + punchline
   * fabricada. Uma ideia, uma oração, sem travessão. Rodar a humanizer antes de
   * fechar qualquer copy.
   */
  footerTagline: "Para quem sabe quanto o próprio carro vale.",

  copyright: "© 2026 MV Estética Automotiva. Todos os direitos reservados.",
} as const;

/** Copy do rodapé (ilha CLARA de fecho, ref MetroRide). Marquee do topo é
 *  provisório (Victor troca depois); `band` é a faixa azul gigante embaixo. */
export const footer = {
  /**
   * Marquee de fecho do rodapé — PAR de frases alternadas, não uma só (Victor,
   * 2026-07-22). O marquee é um LOOP: com duas frases, a repetição deixa de ser
   * eco e vira um par que conversa — a página reconhece que cumpriu o que
   * prometeu ("agora você conhece a MV") e se despede ("obrigado pela visita").
   *
   * Por que a anterior caiu: "Vamos cuidar do seu carro" era SERVIÇAL — mesma
   * família do "a gente cuida do resto" cortado do fecho no mesmo dia. Promete
   * conveniência, quando o site inteiro vende critério. E, por ser um pedido,
   * competia com o CTA de WhatsApp logo acima em vez de encerrar a página.
   *
   * ⚠️ Régua p/ trocar depois: NÃO pode virar 2º CTA (a ação já foi pedida no
   * Contato) · curta, porque a Birthstone é manuscrita e corre grande · não
   * repetir nome/cidade, que o marquee da Sobre já carrega.
   * ⚠️ Mexer no comprimento MUDA A VELOCIDADE percebida: a duração no
   * `Footer.module.css` é calibrada pro tamanho deste texto.
   */
  // ⚠️ "Obrigado pela VISITA" foi testado e trocado por "chegar até aqui": quem
  // lê o rodapé desceu a página inteira, então a 2ª é literalmente verdadeira e
  // agradece a ATENÇÃO, não a passagem. "Visita" é vocabulário de comércio de
  // rua ("volte sempre") e passaria em qualquer site de qualquer ramo — reprova
  // no teste do genérico que vale pro site todo.
  marquee: ["Agora você conhece a MV", "Obrigado por chegar até aqui"],
} as const;

/** Caminhos dos assets — nomes limpos (sem espaço/acento), renomeados no Passo 6. */
export const assets = {
  logo: "/logo.png",
  /** PNG recortado do sedã two-tone — o espaço vazio na parte de baixo é
   *  intencional: permite ancorar o carro no limite da dobra deixando luz/sombra (por código)
   *  vazarem p/ a seção 2. Fonte-verdade do efeito: Figma "Página" node 475:143 (2026-07-15).
   *  ⚠️ `-v2` (2026-07-22) = 2048px de largura, contra 2748px do original: é o LCP da home e
   *  a fonte tinha 2,63 MB. O sufixo existe por causa do cache de imagem do Next — trocar foto
   *  com o MESMO nome continua servindo a antiga. Original preservado em `assets-originais/`. */
  heroCar: "/assets/hero-car-v2.png",
} as const;

/**
 * Contato.
 *
 * ✅ **WhatsApp CONFIRMADO pelo Victor em 2026-08-03** — era
 * `wa.me/5500000000000` (placeholder) e travava o CTA do site inteiro: Hero,
 * Contato, Footer, o trilho do FAQ e o CTA de cada rota de serviço apontam
 * todos pra cá. Também destrava o `telephone` do JSON-LD.
 *
 * 🚩 Formato: `wa.me` exige **só dígitos**, com país e DDD e SEM `+`, espaço ou
 * traço — `55` (Brasil) + `33` (DDD) + `998463806`. O `phoneE164` é a mesma
 * coisa no formato que o schema.org espera, e o `phoneDisplay` é o único que
 * pode ser lido por humano.
 */
export const contact = {
  whatsapp: "https://wa.me/5533998463806",
  /** E.164 — usado no `telephone` do JSON-LD e em `href="tel:"`. */
  phoneE164: "+5533998463806",
  /** Formato de leitura. Nunca usar em link. */
  phoneDisplay: "(33) 99846-3806",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",

  /**
   * Mapa da seção Contato — IFRAME DE COMPARTILHAMENTO do Google Maps.
   *
   * Por que este caminho e não a API (Victor, 2026-07-22): a Maps JavaScript API
   * exige conta de FATURAMENTO ativa. O mapa em si seria gratuito (10.000
   * carregamentos/mês por SKU desde mar/2025, e o site não chega perto disso) e
   * o "pagamento de R$ 200" da tela do Google é PRÉ-PAGAMENTO via Pix que vira
   * saldo — mas o Victor recusou cadastrar cartão/depositar de qualquer forma.
   * Decisão: **zero dependência do Google Cloud**. Este iframe não usa chave,
   * não tem cota e não pede faturamento. A chave que chegou a ser gerada foi
   * apagada; não recriar sem decisão nova.
   *
   * FORMATO USADO: `?q=<busca>&output=embed`. É a forma clássica sem chave —
   * mais estável e legível que o `?pb=` do botão "Incorporar um mapa", que é uma
   * string opaca gerada pela sessão do navegador. `z` = zoom, `hl` = idioma.
   *
   * ⚠️ A query é o NOME + ENDEREÇO, nunca as coordenadas. Com `q=lat,lng` o
   * Google planta um pino GENÉRICO e mudo — ele recebeu um par de números, não
   * sabe que ali existe um negócio. Buscando pelo estabelecimento, o embed
   * resolve a ficha real e o pino vem ROTULADO "MV Estética Automotiva"
   * (Victor, 2026-07-22: "só tá mostrando o pingo vermelho").
   *
   * Coordenadas da ficha, guardadas caso a busca por nome falhe algum dia:
   * -20.1281816, -42.0014907 — R. Padre Horácio Rentis, Simonésia/MG, 36930-000.
   *
   * Se `mapsEmbedUrl` estiver VAZIO, a seção volta sozinha ao placeholder em CSS
   * (moldura + malha + pino + selo "MAPA EM BREVE") — nada quebra.
   */
  // z=18 (era 17): aproxima pra empurrar o rótulo "Alfa Car Lava Jato" pra fora
  // do enquadramento — o estabelecimento não existe mais, mas segue na base do
  // Google. ⚠️ Rótulo de POI NÃO se oculta por código no embed sem chave (só com
  // estilização via Maps JavaScript API, que pede faturamento). A correção de
  // verdade é o dono abrir a ficha do Alfa Car no Maps → "Sugerir uma mudança"
  // → "Fechado permanentemente"; aí some pra todo mundo.
  mapsEmbedUrl:
    "https://www.google.com/maps?q=MV+Est%C3%A9tica+Automotiva,+R.+Padre+Hor%C3%A1cio+Rentis,+Simon%C3%A9sia+-+MG,+36930-000&z=18&hl=pt-BR&output=embed",
  mapsPlaceUrl:
    "https://www.google.com/maps/search/?api=1&query=MV+Est%C3%A9tica+Automotiva,+Simon%C3%A9sia+-+MG",
} as const;

export type SocialLink = {
  href: string;
  label: string;
  /** Identificador do ícone — o componente resolve o SVG. */
  icon: "whatsapp" | "instagram" | "facebook";
};

export const socialLinks: readonly SocialLink[] = [
  { href: contact.whatsapp, label: "WhatsApp", icon: "whatsapp" },
  { href: contact.instagram, label: "Instagram", icon: "instagram" },
  { href: contact.facebook, label: "Facebook", icon: "facebook" },
] as const;

export type NavLink = { href: string; label: string };

/** Nav da navbar. Âncoras com `/` na frente: nas rotas `/servicos/[slug]` elas
 *  voltam pra home e rolam até a seção (na home o comportamento não muda). */
// Ordem por PRIORIDADE COMERCIAL, não pela ordem da página (na rolagem, "Quem
// somos" vem antes de Serviços). Escolha do Victor, 2026-07-22.
// "Processo" entrou aqui porque responde a objeção que nasce logo depois de "o
// que vocês fazem?" — *"vão fazer direito no meu carro?"* — e é a seção mais
// trabalhada do site.
// 🚫 **Depoimentos NÃO entra na navbar** enquanto os 9 forem FICTÍCIOS: item de
// navbar é promessa de substância, e mandaria o visitante direto pra parte menos
// confiável da página. No rodapé o link existe ("Clientes") e o dano é menor,
// porque ninguém navega por rodapé com intenção. Reabrir quando entrarem os
// depoimentos reais (há 5 avaliações públicas na ficha do Google).
// ⚠️ Rótulo curto de propósito: a navbar é uma pílula flutuante e não comporta
// "Como trabalhamos" — essa continua sendo o eyebrow dentro da seção.
export const navLinks: readonly NavLink[] = [
  { href: "/#hero", label: "Início" },
  { href: "/#servicos", label: "Serviços" },
  { href: "/#processo", label: "Processo" },
  { href: "/#quem-somos", label: "Quem somos" },
] as const;

/** Nav do rodapé (âncoras válidas, prefixadas p/ funcionar nas subpáginas). */
export const footerNavLinks: readonly NavLink[] = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/#processo", label: "Processo" },
  { href: "/#depoimentos", label: "Clientes" },
  { href: "/#contato", label: "Contato" },
] as const;

/** Copy do Hero (validada na Fase 2, 2026-07-14). */
export const hero = {
  /* Quebra de linha intencional (Victor, 2026-07-15): duas linhas fixas no Hero. */
  title: "Seu veículo\nmerece o melhor",
  subtitle:
    "Serviços completos de estética automotiva, com produtos de qualidade e acabamento de precisão.",
  /* "Solicitar orçamento" → "Avaliação gratuita" (Victor, 2026-07-17): orçamento
     soava pressão/dinheiro no 1º clique; avaliação gratuita é convite — e casa
     com o fluxo real (chama no WhatsApp → avalia → orçamento vem depois). */
  primaryCta: "Avaliação gratuita",
  // `seals` removido de vez (Victor, 2026-07-17): selos de confiança NÃO entram no Hero.
} as const;

/** Copy da seção Posicionamento (incl. bloco do fundador). */
export const positioning = {
  eyebrow: "Nossa posição",
  title: "Cuidado que vai além da estética.",
  body:
    "Cada detalhe do veículo influencia a forma como ele é visto, sentido e valorizado. Isso é mais que aparência. Um bom resultado exige critério, precisão e cuidado com cada detalhe.",
  founder: {
    name: "Matheus Vitor",
    // ⚠️ conflito herdado: o alt da foto original diz "Diogo Andrade".
    photoAlt: "Diogo Andrade — Fundador MV Estética Automotiva",
    bio:
      "Fundador da MV Estética Automotiva, Matheus Vitor construiu em Simonésia, MG, uma trajetória marcada por cuidado técnico, precisão e atenção aos detalhes. Cada serviço é realizado com seriedade, respeito ao veículo e foco em resultados que valorizam, preservam e protegem.",
  },
} as const;

/** Copy da seção Contato — FECHO da página. Sem formulário (ninguém manda
 *  e-mail): coluna única centralizada, foco total no CTA do WhatsApp. (Victor,
 *  2026-07-17.) */
export const contactSection = {
  // PASSE DE COPY 2026-07-22 (Victor). O texto anterior era de 2026-07-17, ANTES
  // da régua de registro existir, e quebrava três regras hoje travadas:
  //  · "a gente cuida do resto" — registro FALADO (mesma família de "te falo").
  //  · "Vagas limitadas por semana" abrindo o CORPO — pressão de escassez logo
  //    na 1ª linha do fecho, contradizendo os 3 cards do Processo, que acabaram
  //    de dizer "sem pressa / sem compromisso". Migrou p/ a linha `trust`, onde
  //    é informação de agenda e não empurrão (decisão do Victor).
  //  · "Seu veículo merece isso." — "isso" não tinha referente; o leitor tinha
  //    que voltar aos Depoimentos p/ adivinhar. Teste do vago.
  //
  // TÍTULO — régua que o Victor fixou aqui: um FECHO afirma e dá CREDIBILIDADE,
  // não convida. "Vamos olhar o seu veículo" foi RECUSADO por isso ("como que a
  // gente entra numa seção com um título desses?"). O título escolhido nomeia a
  // competência e é a resposta à tensão central do negócio: entregar a chave do
  // 2º maior bem da pessoa a um desconhecido.
  // ⚠️ Regência: confiar algo A alguém ("a quem"), nunca "em quem".
  // ⚠️ "realmente" CAIU (Victor, 2026-07-22): é intensificador, não informação —
  // a afirmação fica mais firme sem ele, e o título passa a caber em 2 linhas.
  title: "Confie seu veículo a quem entende",
  // Corpo: 1 instrução + 1 garantia. "avaliação gratuita" cumpre a palavra do
  // CTA do Hero; "você decide depois, sem compromisso" é ECO PROPOSITAL do
  // card 01 do Processo — repetir a garantia no instante do clique é onde ela
  // trabalha. ⚠️ Não reintroduzir "sem custo" junto de "gratuita": é a mesma
  // informação duas vezes em 8 palavras.
  // "Nos chame" é escolha do Victor (2026-07-22) — eu havia cortado por soar
  // datado; ele repôs. Decidido, não reabrir.
  //
  // ARRAY, não string: cada frase é UMA LINHA (Victor, 2026-07-22). A quebra
  // natural cortava no meio da segunda frase ("Você decide / depois"), o que
  // embaralha as duas ideias — instrução numa linha, garantia na outra. Cada
  // item vira um bloco próprio, então no mobile cada frase ainda quebra sozinha
  // dentro da sua linha em vez de virar uma coluna estreita.
  body: [
    "Nos chame no WhatsApp e agende a avaliação gratuita.",
    "Você decide depois, sem compromisso.",
  ],
  whatsappCta: "Falar no WhatsApp",
  /**
   * Reassurances curtas abaixo do CTA (dão o "completo" sem formulário).
   *
   * ⚠️ "Atendimento imediato" e "Vagas limitadas" são PROMESSAS OPERACIONAIS —
   * as mais fortes do site. Entraram por decisão do Victor (2026-07-22) e
   * DEPENDEM de confirmação do dono; se ele não segura, o cliente cobra no
   * WhatsApp. Substituíram "Resposta em até 24h", que era prazo inventado.
   * "Vagas limitadas" ficou SEM o "por semana": a linha é um sussurro embaixo do
   * botão (18/20/15 caracteres fecha o ritmo; com "por semana" ia a 26 e puxava
   * o olho) e o corte evita cravar uma cota com periodicidade. Não é limite de
   * largura — `.copy` tem 46rem e a linha inteira dava ~430px, cabia.
   */
  trust: ["Simonésia e região", "Atendimento imediato", "Vagas limitadas"],
} as const;
