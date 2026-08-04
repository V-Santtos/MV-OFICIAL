# Regras de copy (aprendido na marra) · ANEXO-REGRAS
> Legenda: 🐞 bug caro · 🚫 fechado · 🔑 princípio · 🚩 restrição · [← índice](ANEXO-REGRAS.md)

> 🚩 Antes de escrever qualquer linha, ler **`.agents/product-marketing.md`** (público, objeções, voz, 6 testes, PENDENTE DO DONO).

1. **Apresentar OPÇÕES escritas, nunca aplicar versão pronta direto.** Aplicar direto gera o ciclo "aplica → pede troca → aplica de novo". **Exceção:** quando o Victor entrega o texto à mão e pede lapidação — aí aplicar, mas **declarando cada palavra trocada e por quê**.
2. **Ao 2º texto recusado na mesma seção, PARAR e questionar o ENQUADRAMENTO**, não escrever a 3ª versão. (A lição mais cara: o card 02 do Processo queimou 5+ versões por erro de enquadramento — eu tratava como "provar diferencial competitivo"; era só um MAPA DA JORNADA.)
   - 🔑 **Na prática (hero da Cristalização, 2026-08-03): oferecer ÂNGULOS, não variações.** Propus 4 frases e ele recusou as 4 — todas atacavam o mesmo ângulo (*a chuva atrapalhando a visão*, cena negativa e abstrata). Só destravou quando parei de trocar palavra e apresentei **ângulos diferentes agrupados** (o mecanismo visível · o problema no passado · o momento do ganho · a segurança), pra ele escolher o ângulo ANTES da frase. Quando 2+ caem, o próximo passo é sempre esse — nunca a 5ª variação.
3. **Rodar `marketing:humanizer` antes de fechar qualquer copy.** 🐞 O que soa "feito por IA" é sempre o mesmo aglomerado: **travessão + segunda metade com autoelogio abstrato + aforismo + paralelismo negativo ("não é X, é Y") + regra de três + punchline fabricada**. Frase boa aqui = **uma ideia, uma oração, sem travessão**.
4. **Credibilidade vem de especificidade verificável**, nunca de adjetivo. 🚫 Proibidas: "qualidade", "excelência", "método", "personalizado", "importante", "realmente" e afins.
5. **Régua de registro:** título = rótulo NOMINAL, nunca frase · 2ª pessoa direta ("você") SIM, "a gente"/"te fala" NÃO · 🚫 as palavras **"oficina"** e **"avulso"** (expurgada por ele 2026-08-03, cuidado pra não voltar a usar sem lembrar). Os **6 testes** (óbvio · genérico · vago · escopo · eco · ganho do cliente) estão em `.agents/product-marketing.md`.
6. 🚩 **Nada marcado PENDENTE DO DONO vira copy publicada.** Não inventar número, prazo, garantia ou política operacional.
7. 🔑 **Teste do eco:** ao escrever uma rota que compartilha vocabulário com outra já escrita (ex: as rotas de interior — Higienização/Bancos), checar se a frase-chave não é a MESMA da rota irmã. Aplicado em Bancos e Estofados: "a mancha que já virou parte do carro" é da Higienização → lá virou desgaste por contato/ressecamento; "sem brilho artificial" → virou "sem deixar aparência plastificada"; pergunta de frequência no FAQ → trocada por impermeabilização.
8. 🚫 **Não prometer segurança/garantia absoluta** ("sem risco", "garantido") quando o serviço é fisicamente delicado (ex: Limpeza de Motor perto de elétrica) — isso é política operacional, e política operacional é PENDENTE DO DONO (regra 6). Afirmar o **processo verificável** (o que é protegido, em que ordem), não o resultado.

**Decisões de copy já fechadas (racional nos comentários dos `content/*.ts`):**
- **Contato:** título "Confie seu veículo a quem entende" (um FECHO afirma, não convida). Corpo em 2 linhas. Bullets `Simonésia e região · Atendimento imediato · Vagas limitadas` (⚠️ as 2 últimas são promessas operacionais não confirmadas — decisão do Victor).
- **Footer tagline:** "Para quem sabe quanto o próprio carro vale." (duplo sentido de "vale").
- **Processo:** seção = MAPA DE OBJEÇÕES (01 avaliação/"quanto custa?" · 02 processo/"vão fazer direito?" · 03 entrega/"como recebo?").
- **`crossLink` das rotas `/servicos/[slug]` = DEMARCA FRONTEIRA, não vende a categoria vizinha** (Victor, 2026-08-03, corrigindo Bancos e Estofados). Só entra se houver **dependência técnica** (Polimento → Vitrificação: a proteção pede pintura corrigida antes) ou **carve-out real** (Higienização → Bancos: "isto não entra aqui, tem página própria"). Sem um dos dois, **não põe** — vira upsell. 🐞 O erro foi apontar Bancos de volta pra Higienização: adjacência não é fronteira. Consequência aceita: a seção "O que cobre" de Bancos fecha em 6 cards, sem a 7ª linha.

9. 🔑 **A fôrma do 1º passe das rotas foi RECUSADA (Victor, 2026-08-03): "melosa".** O molde
   `§1 cena emocional → §2 definição + linha-âncora aforística → §3 público-alvo` sai. Ele quer
   **1 parágrafo informativo**, linguagem fácil, **benefício** — *"não fazer uma copy de marketing
   pra poder persuadir as pessoas"*. Aprovado na Higienização Completa: *"A higienização completa
   trata o interior do carro em profundidade: os tecidos, os bancos, o painel, o ar-condicionado e
   as frestas onde a sujeira se acumula. É um processo técnico que pode ser feito por dentro, por
   fora ou nos dois, num cuidado único."* Repare no fecho: **dá opção ao cliente**, não afirma que
   tudo vem junto. 🚫 Advérbio de autoafirmação ("corretamente") entra na mesma lista vetada de
   "qualidade"/"excelência". Detalhe na memória `copy-registro-meloso`.
10. 🚩 **O site AGRUPA serviços do catálogo real; não é 1 rota por serviço.** Regra dele: *"a gente
    está juntando o benefício de dois serviços ou três serviços que conversarem entre si"*. A rota
    comunica a IDEIA do conjunto — **não copiar a lista do flyer item a item**. Preço e tempo do
    catálogo não vão pro site. Memória `catalogo-real-mv-agrupamento`.
11. 🐞 **Título de hero: quebra de linha e cor são dimensões independentes e brigam entre si.**
    Mexer numa desarruma a outra — custou ~6 rodadas em Bancos e ele perdeu a paciência. Receita
    técnica travada (o `\n` do content, o `white-space: pre-line` só no desktop, a flag
    `hero.accentInline`, e o que NÃO usar) na memória `quebra-de-linha-titulos-hero`.
12. 🔑 **CONTRASTE entre a seção 2 e a 3** (Victor, 2026-08-03, na Cristalização): *"se for falar do
    problema na seção 2, tem que abrir a seção posterior e falar que é aquilo que resolve"*. Quando o
    título do `oQueE` nomeia o PROBLEMA, o `cobre.intro` tem que responder **aquele** problema, com o
    elo audível. Fechado: *"Nem toda sujeira do vidro sai lavando"* → *"Tira o que está incrustado e
    protege pra não voltar."* ⚠️ Efeito colateral a varrer: o corpo e os cards costumam repetir a
    frase que virou manchete (aqui, "não sai na lavagem" aparecia mais 3×) — reler a seção inteira
    depois de trocar o título.
13. 🐞 **Título não pode ter o AGENTE AGRESSOR como sujeito.** Recusado: *"Chuva ácida deixa marca no
    vidro"* — vira manchete sobre chuva ácida em vez de falar do carro de quem lê. Nenhum título
    aprovado no site é sobre o agressor; todos falam do carro ou do serviço ("O motor também precisa
    de atenção", "Couro e tecido não se limpam igual"). O sujeito é sempre o carro, a peça ou o
    tratamento.
14. 🐞 **A fôrma "do PONTO pro TODO" está BANIDA em título de seção** ("Do banco do motorista ao jogo
    inteiro", "Da pintura às rodas", "Do para-brisa aos retrovisores"). Ele cortou de cara em Bancos
    — *"soa gíria de quem já entende de carro"* — e a troca se repetiu em Motor, Polimento,
    Vitrificação e Cristalização. O que ficou no lugar, nas 6 rotas: **rótulo funcional** no título
    (`"O que a X completa cobre"`) e a faixa ponto-a-ponto, quando fizer sentido, no subtítulo.
    🚩 Também caiu a **jornada problema→resultado** ("Do banco sujo ao carro pronto"): troca o
    sujeito no meio da frase e nomeia o problema óbvio.
15. 🚩 **Item de escopo só entra se existir no FLYER real da categoria.** Cruzar a copy com os flyers
    em 2026-08-03 pegou 4 serviços que eu tinha inventado e publicado (rodas/pinças na Vitrificação;
    retrovisores, palhetas e face interna na Cristalização). Detalhe e antídoto na memória
    `copy-conferir-escopo-contra-flyer`. ✅ O inverso também vale: **dado REAL da MV pode e deve
    entrar** — a regra 6 proíbe inventar, não usar o que existe (foi assim que os "2 anos" da
    vitrificação saíram do FAQ evasivo).

## Eixos de copy por rota — as 6 categorias (LAPIDAÇÃO CONCLUÍDA em 2026-08-03)

> ✅ **As 6 rotas saíram da fôrma recusada** (3 §§ cena+aforismo+público-alvo) e dos cards genéricos
> do 1º passe. O que segue abaixo é o **eixo argumentativo** de cada uma — para consultar antes de
> mexer em qualquer linha, não uma lista de pendências.

Cada rota nova tem um eixo argumentativo diferente — não é a mesma copy com o nome trocado. Mapa pra retomar na fase de lapidação:

- **Higienização (molde, validada no desktop):** eixo = a mancha que já virou parte do carro. `crossLink` → Bancos (carve-out: "isto não entra aqui").
- **Polimento:** eixo = nomear o SINTOMA primeiro ("As marcas que só aparecem no sol" = teia de lavagem, o momento em que o dono repara), só depois a definição técnica. Linha-âncora: "Corrigir a pintura, não encobrir com cera." `crossLink` → Vitrificação (dependência técnica — é o mais forte dos 6; o inverso, Vitrificação→Polimento, beira upsell e vale revisar na lapidação). ⬜ Pendente: 3 opções apresentadas pro par hero+destaque, subtítulo do hero e título do "O que é" — hoje no código está a opção 1 de cada, como default até ele escolher.
- **Bancos e Estofados:** eixo = os DOIS materiais (tecido pede extração, couro pede pH+hidratação) — é a resposta concreta pra "por que isso não está incluso na higienização?". Sem `crossLink` (ver regra acima). ⬜ Cruzamento cogitado e NÃO aplicado: apontar carpetes/tapetes pra Higienização (quem lê "estofados" pode supor que o assoalho entra) — perguntar ao Victor um dia.
- **Limpeza de Motor:** eixo = MEDO, não estética ("vai molhar a parte elétrica e dar problema") — por isso o 1º card e a 1ª pergunta do FAQ são sobre a mesma objeção, na ordem real do serviço. Linha-âncora: "Proteger antes de molhar, secar antes de fechar." Benefício mais forte: **vazamento aparece** num cofre limpo (verificável, não é adjetivo). FAQ com 2 limites honestos declarados: a limpeza não resolve vazamento (só mostra) e o motor não fica brilhoso (mesma posição de acabamento do `foto-assinatura.md`: matte, nunca lustroso). Sem `crossLink` (sem fronteira ambígua nem dependência técnica com as outras 5).
- **Vitrificação:** eixo = separar de CERA (com o que o cliente compara) + matar o mito de "à prova de risco" (1ª pergunta do FAQ, de propósito). 🚩 Campo minado evitado: durabilidade/prazo é PENDENTE DO DONO, nenhum prazo entrou. `crossLink` → Polimento (ver acima).
- **Cristalização de Vidros:** eixo = SEGURANÇA, não aparência — a única categoria assim (farol espalhando luz à noite/chuva). Detalhe humano no §3: "pra quem já trocou o limpador achando que o problema era a palheta." FAQ corrige expectativa: o limpador continua em baixa velocidade. Sem `crossLink` — candidato óbvio seria insulfilm/película, mas **não está confirmado que a MV faz** (não virar copy sem confirmação — pergunta nova pro dono, ver `ANEXO-MEMORIA.md` §perguntas abertas).

⬜ **Pendências antigas da Higienização, ainda sem opção escolhida:** `summary` do case Hilux (rascunho meu) e o texto no plural de "Alguns trabalhos" (2 cards hoje). Levar as duas juntas na lapidação.
