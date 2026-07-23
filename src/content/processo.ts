/**
 * 3 passos do processo. Conteúdo migrado as-is do case congelado.
 *
 * `variant` = esquema de cor do card no efeito de EMPILHAMENTO sticky (ref
 * MetroRide "Numbers", adaptado ao nosso tom — Victor, 2026-07-17): a ref usa
 * laranja/branco/preto; aqui é AZUL da marca / CLARO / CINZA escuro.
 */

export type PassoProcesso = {
  num: string;
  label: string;
  desc: string;
  /**
   * O que ACONTECE na etapa (3 itens). Entrou p/ resolver o card magro: número +
   * título em cima e 2 linhas de texto embaixo deixavam um vão morto no meio de
   * um card de 30rem (Victor, 2026-07-22). A cura é MASSA DE CONTEÚDO no rodapé,
   * não decoração — mesma tese da rota de serviços: credibilidade vem de
   * especificidade.
   *
   * ⚠️ COPY PROVISÓRIA (proposta, não validada com o dono). Regra que ela segue e
   * que deve ser mantida: descreve o PROCESSO, sem número, prazo, garantia ou
   * qualquer promessa que dependa de confirmação. Revisar no passe de copy final.
   */
  checkpoints: readonly string[];
  variant: "blue" | "light" | "dark";
};

export const processo: readonly PassoProcesso[] = [
  {
    // CARD 01 = o CHECK-UP (Victor, 2026-07-22). O cliente leva o carro SEM
    // COMPROMISSO, o dono avalia o estado real, levanta o escopo completo
    // (inclusive as ressalvas) e daí sai o PREÇO. Só depois disso se fecha algo.
    //
    // RÉGUA DE REGISTRO desta seção (vale p/ 02 e 03) — Victor, 2026-07-22:
    //  · TÍTULO = rótulo estrutural NOMINAL ("Avaliação técnica"), nunca frase.
    //    Título é impresso em display grande junto de um nº 6.5rem; frase ali
    //    briga com o objeto. ("Você traz o carro" foi testado e RECUSADO.)
    //  · CORPO = 2ª pessoa DIRETA ("Você recebe") SIM; "a gente"/"te fala" NÃO.
    //    Endereçamento não é informalidade — informalidade é o registro falado.
    //  · Sem palavra VAGA. "Te fala tudo antes" caiu não por ser informal, mas
    //    por ser mole: "tudo" não significa nada. Concreto > coloquial.
    //  · 🚫 Nunca usar "oficina" — puxa o clichê que a direção do projeto lista
    //    como anti-padrão. Usar "veículo"/"recebemos".
    //
    // "Avaliação" (e não "Consulta") porque o CTA do Hero, já validado, promete
    // "Avaliação gratuita" — a etapa 01 tem que cumprir a palavra do botão.
    // ⚠️ A ressalva não sumiu — MUDOU DE DONO: virou "o que dá para recuperar —
    // e o que não dá", dita como transparência a favor do cliente, não como
    // aviso defensivo antes de a pessoa sequer chegar.
    // ⚠️ O BEAT QUE FALTAVA (Victor, 2026-07-22): o cliente CHEGA COM UM PEDIDO.
    // A etapa não é "avaliamos o carro" — é CRUZAR o serviço que ele quer com o
    // estado real do veículo, p/ dizer se dá, se não dá, ou se outro serviço
    // atende melhor. O orçamento vem DEPOIS disso, nunca antes.
    // · "definimos" > "apontamos": apontar é gesto (mostra e não resolve);
    //   definir fecha a questão — que é o que de fato acontece antes do preço.
    // · A troca/inclusão de serviço ficou em CHECKPOINT e escrita como aviso a
    //   favor do cliente ("se servir melhor, você fica sabendo"), NUNCA como
    //   oferta: upsell na etapa 01 destrói o "sem compromisso" que ela constrói.
    num: "01",
    label: "Avaliação técnica",
    desc: "Você traz o veículo e o serviço que tem em mente. Avaliamos o estado real do carro e definimos o que dá para ser feito — e o que não dá. Só então passamos o orçamento completo.",
    checkpoints: [
      "Avaliação presencial ou pelo WhatsApp, sem custo",
      "Se outro serviço servir melhor, decidimos juntos",
      // ⚠️ Era "Orçamento completo, item a item" — CAIU (Victor, 2026-07-22):
      // ecoava o fim do corpo ("passamos o orçamento completo") duas linhas
      // acima. Pior: queimava o último slot, que é onde a etapa 01 tem que fechar
      // com o SEM COMPROMISSO — o medo real ("vou ficar preso a alguma coisa?").
      // "Sem custo" (checkpoint 1) é sobre DINHEIRO; "sem compromisso" é sobre
      // ESTAR PRESO. Não são a mesma promessa e o card precisa das duas.
      "Você decide depois, sem compromisso",
    ],
    variant: "blue",
  },
  {
    // CARD 02 = O TRABALHO NO VEÍCULO (Victor, 2026-07-22). O antigo
    // "Diagnóstico preciso" foi REMOVIDO: dizia a mesma coisa da etapa 01 — o
    // cliente lia duas etapas e vivia uma só.
    // · 🚫 NÃO falar de orçamento aqui. Ele já foi aprovado na etapa 01;
    //   renomear isso é pontuar duas vezes o mesmo fato.
    // · ⚠️ DESTRAVOU EM 2026-07-22 quando o Victor REENQUADROU a seção: ela é um
    //   MAPA DA JORNADA (chegou → está sendo feito → recebeu de volta), não uma
    //   vitrine de diferencial competitivo. 5 versões queimaram antes porque eu
    //   tratava o card como se ele tivesse que PROVAR algo único da MV. Não tem.
    //   Ele só precisa ocupar o meio da linha com clareza. "São coisas muito
    //   simples e não precisam de contextos gigantescos" (Victor).
    // · O fecho do corpo é a frase do próprio Victor e é o que segura o card:
    //   "não porque é o seu bem, mas porque é assim que trabalhamos" — move o
    //   cuidado de CORTESIA pontual p/ PADRÃO da casa. É a única linha que fala
    //   da MV e não do carro; sem ela o parágrafo termina em adjetivo.
    // · Recusado no caminho: "máxima atenção em cada detalhe" (dois "cada" na
    //   mesma frase + qualquer concorrente assina).
    num: "02",
    label: "Processo",
    desc: "A partir daqui seu veículo é responsabilidade nossa. Cada etapa do serviço é feita com atenção ao detalhe — não porque é o seu bem, mas porque é assim que trabalhamos.",
    checkpoints: [
      // Os 3 bullets vieram do Victor (2026-07-22), lapidados só na superfície:
      // 1 = correspondência produto ↔ superfície · 2 = ritmo (intacto, dele) ·
      // 3 = o dono acha algo, fotografa, avisa e NÃO mexe sem autorização.
      // ⚠️ Bullet 3 reescrito no registro da casa: o original dele dizia "te
      // deixaremos informado" — "te ..." é registro FALADO, cortado pela régua.
      "Produto profissional e de qualidade para cada superfície",
      "Trabalho feito etapa por etapa, sem pressa",
      "Nada é acrescentado sem a sua aprovação — e você fica sabendo",
    ],
    variant: "light",
  },
  {
    // CARD 03 = A ENTREGA (Victor, 2026-07-22). Substituiu o "Execução
    // controlada" herdado, que era o título RECUSADO e ainda repetia o card 02 —
    // o cliente lia duas vezes a mesma etapa.
    // · Título NOMINAL "Entrega": fecha a jornada e faz o título da seção
    //   ("Do diagnóstico à entrega") virar literal, não figura de linguagem.
    // · A tese do card: a entrega é um MOMENTO, não a devolução da chave. Por
    //   isso a conferência vem ANTES do aviso — a ordem dos fatos é o argumento.
    // · Matéria-prima confirmada pelo Victor: revisão final · aviso de pronto ·
    //   FOTO do resultado · orientação de conservação.
    // · Lapidado do texto dele: "orientações personalizadas" caiu ("personalizadas"
    //   é palavra de folheto, mesmo grupo de "excelência"); "no padrão que a MV
    //   oferece" → "no padrão da MV" (oferecer é verbo de vitrine, e aqui o carro
    //   já está pronto); "foto de como ficou o resultado" → "foto do resultado".
    num: "03",
    label: "Entrega",
    desc: "Antes da entrega, o carro passa por uma última conferência — o que ainda pedia ajuste é revisado e resolvido. Só então você recebe o aviso com foto, e busca o veículo no padrão da MV.",
    checkpoints: [
      "Conferência final antes de liberar",
      "Você recebe foto do resultado",
      "Orientação de como conservar o resultado",
    ],
    variant: "dark",
  },
] as const;

export const processoMeta = {
  eyebrow: "Como trabalhamos",
  title: "Do diagnóstico à entrega",
} as const;
