# Plano de mudanças do site MV — pacote Billion (19/10/2026)

Rodada aberta em **20/10/2026**. Complementa o pacote de 09/10 (ver `plano-mudancas-billion-2026-10-09.md`), que está no ar e não é desfeito.

## Fonte

`PACOTE-DEV-2026-10-19.zip` (Billion), recebido pelo WhatsApp do Davi em 19/10, 21:21. O Davi pede publicação "hoje ou amanhã" e o horário do deploy, para a Billion conferir do lado da Meta.

- `00-LEIA-ME.txt` e `01-MUDANCAS-SITE-MV.txt`: cinco itens com antes e depois.
- `codigo/`: dois `conteudo.ts` e `IntroReveal.tsx` para substituir; quatro componentes de `components/analytics/` como referência.
- **Sem protótipo novo e sem prints.** A referência visual segue sendo a do pacote de 09/10. O `02-MENSAGEM-WHATSAPP-VITOR.txt` citado no LEIA-ME não veio no zip; é a mensagem do WhatsApp.

## Diferenças entre o pacote e o nosso código

- O conteúdo das rotas não fica em `app/servicos/<rota>/conteudo.ts`, mas todo em `src/content/servico-detalhe.ts`. Os arquivos deles não servem para substituir: as trocas foram aplicadas à mão, com o texto literal deles.
- O `IntroReveal` deles importa de `@/lib/intro`; aqui é `@/lib/animation`.
- O pacote diz que o Pixel publicado dispara `Lead` no clique de WhatsApp. Isso já saiu em 09/10 (vira `Contact`, C13 do pacote anterior), e está no deploy no ar.
- O `<html>` tinha `data-intro-every-load`: a abertura tocava em toda carga, não uma vez por aba como a Billion supôs.
- O pacote não cita que `lib/lead/enviar.ts` manda `fbp`, `fbc`, `fbclid` e `user_agent` vazios sem o "Aceitar". Sem mexer nisso, o item 1 não entrega o que promete à API de Conversões.

## Ranking (do mais fácil ao mais difícil)

1. Vitrificação (item 3): texto.
2. Higienização (item 4): texto.
3. Tela de abertura (item 2): código simples, mas desfaz algo aprovado pelo Victor.
4. Rastreamento (item 1): médio, com decisões. Deixado por último por pedido do Victor (20/10); aval dado no mesmo dia.
5. Navegação agêntica 2/3 do PageSpeed (lembrete do Victor desde 09/10).

## Checklist

- [x] ~~D00 · Ponto de partida.~~ Tag `mv-baseline-2026-10-20` sobre `692b1d6`.
- [x] ~~D01 · Vitrificação V1–V6.~~ Commit `28c6a23`. Texto literal do pacote; `priceFrom` 1800 → 2200 também, que alimenta o `minPrice` do JSON-LD (o pacote não sabia dele). Conferido no HTML servido: nenhum "1.800" nem "2 anos"; "R$ 2.200", "Proteção de até 3 anos", "por até três anos" presentes. O hero e o "O que é" antigos ainda dizem "dois anos", mas são do template de agosto e não renderizam nesta rota (modelo de venda).
- [x] ~~D02 · Higienização L1–L8.~~ Mesmo commit `28c6a23`. As oito trocas conferidas no HTML servido; o OfferCatalog e o FAQPage do JSON-LD saem das próprias listas e acompanham.
- [x] ~~D03 · Tela de abertura.~~ Commit `c2a7686`. Desligada pela chave `INTRO_ATIVA` (`lib/animation/introSignal.ts`), sem apagar a animação: para voltar, `true`. **Desvio do pacote:** só desligar a cortina deixava um pisca no topo (o texto vinha visível no HTML, o `gsap.set` zerava e só depois subia; medido com `probes/abertura-timing.mjs`). A entrada da Navbar e dos heros passou para CSS (`html[data-entrada-css]` no `globals.css`), com o mesmo desenho das cascatas GSAP, rodando na 1ª pintura. Medido: título da home 100% visível em ~1,4 s desde a navegação, sem cortina e sem pisca; CLS 0.
- [x] ~~D04 · Rastreamento (item 1).~~ Aval do Victor em 20/10 ("pode fazer mesmo"; a responsabilidade sobre o site vai passar para a Billion). Feito:
  - `MetaPixel` e `GoogleAnalytics` carregam sem esperar o aceite (sai a trava e o respeito a DNT/GPC). PageView por troca de rota mantido.
  - **Clique no WhatsApp segue como `Contact`** (recomendação aceita); a referência deles apagava esse disparo. O `Lead` continua só no formulário, com `eventID = lead_id`.
  - **Furo do pacote fechado:** `lib/lead/enviar.ts` passa a mandar `fbclid`, `fbp`, `fbc` e `user_agent` sempre (antes iam vazios sem o "Aceitar"), para a API de Conversões da Billion.
  - Aviso de cookies **só visual**: igual ao de antes (mesma mensagem, "Recusar" e "Aceitar"), por decisão do Victor em 20/10; o texto e o botão único "Entendi" do pacote foram testados e descartados, porque davam a entender que o visitante era obrigado a concordar. Os dois botões só gravam a escolha e fecham o aviso; nada lê esse valor.
  - `analyticsConsent.ts` mantido, com `hasAnalyticsConsent`/`hasBrowserPrivacySignal` sem uso.
  - Verificado (`probes/rastreamento-sem-aceite.mjs`, Meta/Google/planilha/WhatsApp interceptados, nada saiu de verdade): sem tocar no aviso, `fbevents.js` carrega e o cookie `_fbp` nasce; o aviso aparece e não volta depois do "Recusar", com o Pixel carregado mesmo assim; o formulário monta a linha da planilha com `fbclid=teste`, `fbp`, `fbc` e `user_agent` preenchidos. No navegador do app, o Pixel `1734207877833519` inicializado e com a configuração baixada, sem aceite.
  - **Não deu para ver localmente:** o PageView/`Contact` saindo para a Meta a partir de `localhost` (nenhuma chamada `tr/` apareceu, nem no navegador do app) e o GA, cujo ID não está no `.env.local` (só na Vercel). O código de disparo é o mesmo que já roda no ar após o "Aceitar"; a prova fica para o "Testar eventos" depois do deploy (checklist do LEIA-ME deles).
- [x] ~~D05 · Navegação agêntica.~~ Commit `fc10e7f`. Lighthouse 13.5 no domínio real: só a home tinha 2/3, por um único defeito (`aria-prohibited-attr`): `aria-label` nas estrelas dos depoimentos, numa `div` sem papel. Com `role="img"`, a home local fica com 3/3. As páginas de serviço já estavam com 3/3.
- [ ] D06 · Publicar (push + `vercel deploy --prod --yes`), avisar o horário ao Davi e rodar a conferência do LEIA-ME deles. **Só quando o Victor indicar** (pedido dele em 20/10).

## Sobra apontada pelo Lighthouse, fora do pacote

Contraste do `©` no rodapé (`Footer .copy`), em todas as páginas. Não mexido; decisão visual.

## Verificação feita em 20/10/2026 (build de produção local, porta 3010)

Build ok; lint com os mesmos 2 avisos preexistentes. Lighthouse local (mobile): home com performance 0,89, acessibilidade 0,96, navegação agêntica 1; Vitrificação com 0,91 / 0,96 / 1. FCP 1,5 s, CLS 0 nas duas.
