# Seção: Rota `/servicos/[slug]` · ANEXO-REGRAS
> Legenda: 🐞 bug caro · 🚫 fechado · 🔑 princípio · 🚩 restrição · [← índice](ANEXO-REGRAS.md)
> 📱 Ajustes mobile desta rota (título do `ServicoHero`, título hasteado do "O que é") estão em [mobile.md](mobile.md).

- **Engenharia:** `generateStaticParams` (6 slugs) + `dynamicParams=false` · `params` é **Promise** no Next 16 (`await params`) · tudo SSG. Categorias sem miolo caem numa versão **RESUMO** — nenhum card dá 404. SEO: metadata/canonical/OG + JSON-LD `Service`+`BreadcrumbList`+`FAQPage`; sitemap com as 6 rotas.
- ⚠️ Âncoras da Navbar/Footer prefixadas com `/` (`/#servicos`) p/ funcionarem nas subpáginas.
- **Ordem atual do molde:** Hero → O que é → O que cobre (cards) → Cases (reel) → FAQ(+CTA) → CTA. Benefícios e "Como fazemos" foram apagados.
- 🔑 **CARD da cobertura = spec do FIGMA** (node `5:16`): **ELEVADO** por 2 drop shadows EXTERNOS (luz `#2D2D2D` 25% topo-esq + sombra `#000` 25% baixo-dir), escalado ~2,6×. **Fundo do card = `--bg-0` (IGUAL à seção)** → é isso que faz o relevo REAL (esculpido do fundo). Radius 20px.
  - 🐞 **Não repetir:** (1) comecei com `inset` (afundado) em vez de drop externo → chapado; (2) o **grão do card lavava o relevo** → grão removido do card (se voltar, vai na SEÇÃO inteira).
- 🔑 **LUZ AMBIENTE azul reativa ao scroll** (`CoberturaGlow.tsx`, client isolado): poça radial que acende quando a seção centraliza; medição À MÃO (rAF + `getBoundingClientRect`, **não** `useScroll`). É o **único azul da seção** e vaza pelos vãos dos cards. Reduced-motion = luz estática.
  - 🐞 **LIÇÃO (corte do glow):** aumentar padding NÃO conserta glow que vaza (a altura dele é % da seção, o corte por `overflow:hidden` é escala-invariante). Cura = a CAUDA do degradê desvanecer DENTRO dos limites: `top + (transparent% × raio-vertical)` entre 0% e 100%.
- **7º card = Bancos, ILHA CLARA** (`.covCardRelated`): fundo `#f4f4f2`, sombra com respingo do azul da cena = "porta pra OUTRA categoria".
- 🚫 **hover dos cards escuros SEM azul** (só relevo; a luz de fundo já é o azul).
- **Cases = REEL HORIZONTAL:** 🔑 **RECONSTRUÍDO LIMPO, NÃO colado** (colar traria shadcn/tokens inexistentes/Embla). **Motor = scroll-snap NATIVO + JS mínimo** (setas `scrollBy`, pontas via listener + ResizeObserver). Zero dependência nova. `CasesReel.tsx` (client); dados em `content/servico-detalhe.ts` (campo `cases`, `image` OPCIONAL). Sem `image` → placeholder de marca (monograma "MV").
- **FAQ = TRILHO À ESQUERDA** (título sticky à esq. + accordion à dir.) alinhado à margem dos Cases; o **CTA foi FUNDIDO no trilho** (botão órfão solto foi recusado). `CtaFinal` só sobrevive na versão RESUMO.
- **Extração client:** hero/cobertura/FAQ viraram clients isolados (`ServicoHero`/`CoberturaBlock`/`FaqBlock`); resto do `ServicoPage` segue Server, **texto sempre no HTML do servidor** (SEO ok, reveal é só opacidade).

## 🔑 Replicar rota nova = CONTEÚDO, não engenharia (descoberta 2026-08-03)

Os **6 slugs já existem e já buildam** (`generateStaticParams` sobre `content/servicos.ts`) — nenhum dá 404. `app/servicos/[slug]/page.tsx:62-70`: **tem entrada no mapa `servicosDetalhe` → renderiza a página COMPLETA; não tem → cai no `ServicoResumoPage`.** Portanto **escrever o objeto `ServicoDetalhe` + adicionar a chave no mapa já vira a rota completa** — zero plumbing, zero componente novo. O trabalho real de cada rota nova é conteúdo: copy, fotos, cases, FAQ.

- **Fila de cada rota nova (a ordem importa):** 1) **Copy** — ler `.agents/product-marketing.md` + [`copy.md`](copy.md), apresentar opções, rodar `marketing:humanizer`. 2) **Fotos** — ler [`foto-assinatura.md`](foto-assinatura.md) antes de gerar. 3) **Cases** — provavelmente nenhum real no começo; o mecanismo de placeholder abaixo já resolve. 4) **Mobile** — herdar o que a rota molde (Higienização) já resolveu, ver [mobile.md](mobile.md).
- 🚩 **Órfãos herdados em TODAS as 6 rotas:** `beneficios`, `processo`, `cta` e `note` existem no tipo `ServicoDetalhe` e são preenchidos (o tipo exige), mas **nenhum é renderizado** — confirmado lendo o `CoberturaBlock`. 24 blocos de texto morto no total. Decidir um dia: voltam ao template ou saem do tipo.

## Cases — mecanismo de publicação (placeholder por número, não boolean)

**Regra geral do projeto: "tirar" = OCULTAR, nunca apagar** (ver [produto-visual.md](produto-visual.md)) — aqui é onde ela vira código.

- `CaseItem` tem `placeholder?: boolean` (interno, nunca renderizado — mesma convenção do campo `real` em `content/depoimentos.ts`, ver [sec-depoimentos.md](sec-depoimentos.md)).
- **`PLACEHOLDERS_VISIVEIS`** (número global, hoje `1`) + **`casesPublicaveis(items, limite?)`** em `content/servico-detalhe.ts`: devolve **todos os reais + os primeiros N de enchimento**. Real vem SEMPRE primeiro, independente da posição no array — placeholder é fim de fila, nunca abre a seção.
- **Override por categoria:** o objeto `cases` aceita `placeholdersVisiveis?`. O número global `1` foi calibrado pra Higienização (1 real + 1 enchimento); categoria sem nenhum case real herdaria isso e o reel abriria com **um card solitário** (não sustenta leitura de carrossel) — por isso Polimento e as demais sem case real usam `placeholdersVisiveis: 5`.
- A guarda `{cases && casesVisiveis.length > 0 && ...}` fica em `ServicoPage.tsx`, **fora** do `CasesReel` — assim, sem case nenhum, some até o padding da seção (nada de vão morto). Verificado com o filtro zerado: seção sai 100% do DOM.
- 🔑 **Efeito colateral que resolve uma dúvida de UX:** com 2 cards (Higienização) não há overflow no desktop → as duas setas do reel ficam **visíveis e desabilitadas** (mobília morta). Com 5 cards (Polimento) **há overflow** → setas vivas. Confirma que a correção certa é **sumir com a `.nav` quando não há o que rolar** (proposto, ainda não aplicado — decisão do Victor pendente).
- ➡️ Quando um case real entrar numa categoria: só escrever o objeto. Nada de descomentar/reativar; decidir depois se `placeholdersVisiveis` daquela categoria abaixa.

## Formato de entrega das fotos de CASE (fotos reais que o Victor manda, não geradas)

**Proporção `9:16`. Ideal `1200×2133`; o `900×1600` do celular já serve.** JPG ou WEBP. Montagem antes/depois **empilhada** (antes em cima, depois embaixo, cada metade com metade da altura). Por quê 9:16: é a proporção nativa das montagens que ele já faz — bate exato com o card, entra sem corte e sem Photoshop. Qualquer proporção mais vertical passa a cortar as **laterais** (9:16 é o teto do zero-corte).

- **Case Hilux (piloto):** modelo de dados é `fotos?: {src, alt}[]`, a primeira é a capa (`CaseFoto` exportado de `CasesReel.tsx`). Capa escolhida = a foto mais forte (assoalho tomado de barro), de propósito — é ela que faz abrir a galeria.
- 🚩 **Placa do cliente (PYN-5709) aparece na foto do exterior — decisão do Victor: MANTER.**

## 🐞 Deslocar um `motion.div` no CSS — `transform` e margem NÃO servem (2026-08-03)

Pedido simples ("sobe a foto principal e joga pra esquerda") que custou 2 tentativas erradas. O
`.pair` do "O que é" é um `motion.div` com a variante `revealFromSide`, dentro de um grid de
`minmax()`/`fr`. Ordem do que falhou e por quê:

1. 🚫 **`transform: translate(...)` na classe** — o Framer escreve `transform: none` **INLINE** no
   elemento quando a animação de entrada assenta. Estilo inline ganha da classe: o deslocamento
   some sem deixar rastro no DevTools (a regra aparece riscada). Medido: voltava aos mesmos 41.7px.
2. 🚫 **Margem negativa** — as colunas do `.splitTall` (`minmax(0,46rem) minmax(0,30rem) .5fr`)
   somam mais que o espaço disponível, então se redistribuem; a margem entra na conta de largura da
   coluna. Pedi 32px, andou **17.7px** e ainda alargou o card em ~28px.
3. ✅ **`top`/`left`** — o `.pair` já é `position: relative` (é a âncora do `.pairSecondary`), então
   offset não gera layout: não mexe na largura da coluna, não encolhe a seção, não empurra o texto.
   E o Framer só escreve `transform`/`opacity`, nunca `top`/`left`. Medido: `cardLeft` = padding −32
   exato, largura do card intacta.

🔑 **Regra geral:** pra deslocar visualmente um elemento animado por Framer, usar `top`/`left` sobre
`position: relative`. `transform` é território do Framer; margem é território do grid.

🐞 **Ao MEDIR isso no navegador:** os `clamp()` do projeto usam `vw`/`vh`, então o painel mudar de
largura (1057 → 1142 aqui) muda padding e colunas e os números "não fecham". Sempre logar
`innerWidth` + `location.pathname` junto da medição — perdi uma rodada comparando número de páginas
e viewports diferentes.

## Cases em VÍDEO — padrão de edição (Victor, 2026-08-03, primeiro uso: `rampage-lavagem`)

🔑 **Este é o padrão de referência pra próximos vídeos de case.** Não é regra fechada tipo
"sempre 12s" — é o ponto de partida validado; ajustar por olho quando o material pedir.

- **Dado:** `CaseFoto` (`CasesReel.tsx`) ganhou `tipo?: "video"` + `poster?: string`. O tipo
  espelhado em `content/servico-detalhe.ts` (inline, não importa o de `CasesReel.tsx` — a
  camada de conteúdo não depende de componente) precisa ter os dois campos também.
- **Card do reel NUNCA autoplaya vídeo** — mostra só o `poster` (frame estático) com selo
  "▶ Vídeo" no lugar da contagem de fotos (10 cards autoplayando juntos é LCP morto + bateria).
  O `.mp4` só carrega (`preload="none"`) quando o `CaseLightbox` abre; lá toca em loop, mudo,
  com controles nativos.
- **Ritmo (o que faz "dinâmico" sem virar picotado):** separar os takes em 3 pastas — `antes/`,
  `durante/`, `depois/`. **Antes + durante alternam**: 2 takes rápidos (~0,5s) + 1 no ritmo
  "normal" (~1,2s), repete — a variação é o que evita som de metrônomo. **Depois fica intocado**,
  mais longo (~2,3s por take), sem alternância — é onde o olho descansa no resultado, não pode
  competir em velocidade com o antes/durante. 🚩 **Teto de duração total: ~12s** (short-form
  social) — se o antes/durante não couber no orçamento, ele que encolhe; o depois não perde tempo.
- **Fluxo de edição — FORA do site**, com FFmpeg (instalado, `ffmpeg -version` confirma):
  pasta de trabalho `MV-OFICIAL/IMPUT/{antes,durante,depois}/` (clipes brutos do celular) +
  `IMPUT/manifest.csv` (`fase,file,start,duration` — um trim por clipe) + `IMPUT/montar.sh`
  (lê o manifest, corta com `trim`+`setpts`, escala pro final, concatena com corte seco, sem
  fade, sem áudio). Reaproveitável: outro case é só gravar os clipes nas 3 pastas e reescrever
  o manifest — o script não muda.
- 🐞 **iPhone grava vertical mas o arquivo REPORTA paisagem** — `.MP4` do iPhone carrega
  metadado de rotação (`rotation=-90`, Display Matrix). `ffprobe` mostra `1280×720`, mas o
  FFmpeg já decodifica ROTACIONADO (`720×1280` real, conferido extraindo frame e medindo). Não
  precisa cropar nem pillarbox — só escalar pro `1080×1920` final, proporção idêntica (9:16).
  ⚠️ Não confiar no `width`/`height` do `ffprobe` puro pra decidir enquadramento sem checar a
  `Display Matrix` primeiro.
- **Saída:** `1080×1920`, `libx264 -preset slow -crf 23 -movflags +faststart`, sem áudio (`-an`).
  Arquivo final vai direto pra `site-mv/public/assets/cases/<slug>/montagem.mp4`.
- 🚩 **DOIS frames de capa, não um** (`CaseFoto` tem `poster` E `posterVideo`): o `poster=` do
  `<video>` é URL **crua** — não passa pelo `next/image`, o navegador baixa o arquivo do disco
  inteiro. Então: `poster` = capa do CARD, pode ser grande e nítida (`capa.jpg`, o otimizador
  entrega ~20KB AVIF); `posterVideo` = webp pequeno só pro atributo (`montagem-poster.webp`,
  480px/40KB) — ele só pisca antes do autoplay. Mesma convenção da Sobre
  (`polimento.mp4` → `polimento-poster.webp`, 14KB). Sem `posterVideo` cai no `poster` e volta a
  baixar o arquivo grande cru (era 245KB).

## `CaseLightbox` — galeria em tela cheia (card = chamada, galeria = prova)

- Card recorta (`cover`); a galeria mostra `contain`, **INTEIRA** — motivo de existir. Medido: foto 412×733, ratio 0.562 vs 0.563 do arquivo = zero corte.
- 🔑 **Decisão de UX: nada de setas nem miniaturas dentro do card.** O reel já é navegação horizontal; uma segunda dentro dele vira o mesmo gesto de arrastar no celular. Uma navegação por nível.
- **Vídeo dentro da galeria:** troca `<Image>` por `<video>` quando `foto.tipo === "video"`, mesma classe `.img` (`object-fit: contain`, mesmo `.figura` 9:16 — vídeo já sai editado nessa proporção, sem letterbox). `autoPlay loop muted playsInline controls`, `preload="none"`.
- Teclado (Esc/←/→ **no overlay**, não no window), swipe, contador, foco devolvido ao card, `aria-modal`. Índice nasce de `useState(inicial)` **sem effect de sincronia** (o componente `Galeria` só existe montado quando aberto).
- 🔑 **Trava de rolagem = `travarRolagem()` do `SmoothScroll`**, nunca `body.overflow` (é a regra GOLD de animação, ver [03-animacao-scroll-gold.md](03-animacao-scroll-gold.md) — aqui é a aplicação prática).
- 🐞 **`inset: 0` NÃO serve no overlay.** O `<html>` tem `scrollbar-gutter: stable` e elemento fixo é posicionado excluindo a calha — medido: cobria 375px de um viewport de 390 (sobrava 15px na direita). **Fix: `width: 100vw`** em vez de `inset:0`. ➡️ **É a mesma faixa que o menu mobile deixa em aberto** (pendência 7 em [mobile.md](mobile.md)) — a receita pra resolver lá é esta.

## Card do reel — 9:16 + véu premium (Victor: "mais vertical, mostrar mais a foto")

- **9:16 é o TETO do zero-corte** (não gosto): medido 368×654 desktop, 335×596 mobile, ratio 0.563 nos dois = igual à fonte. Em 3:4 o navegador comia 25% da altura com emenda visível no meio — não repetir.
- Texto foi **PRA DENTRO da foto**, sobre véu em degradê + vinheta de topo (antes ficava solto embaixo e lia como "imagem + legenda").
- 🚩 **O gatilho de clique é um `<button>` transparente esticado, NÃO a moldura.** `<h3>`/`<p>` são conteúdo de fluxo e **não podem morar dentro de `<button>`** — HTML inválido, quebra leitor de tela.
- Selo "N fotos" no canto superior direito. Hover: card sobe 6px, foto scale 1.06, véu alivia pra 0.82. Filtro da foto: `saturate(.96) contrast(1.05)` (era `saturate(.82) brightness(.94)` — escurecia demais somado ao véu).
- 🐞 **Sombreamento — 3 causas, todas corrigidas:** (1) véu com poucos stops lineares cria "banda de Mach" (degrau visível) — corrigido com ~12 stops em curva de ease, tom base `rgba(9,10,13)` a `.88` (não `.95`, que ficava mais escuro que a própria seção). (2) sombra concentrada em vez de ampla — trocado por 3 camadas (contato curto · ambiente médio · profundidade larga), nenhuma acima de `.5`. 🔑 **Regra: sombra premium é ampla e fraca, nunca concentrada e forte** (hover ganha ALCANCE, não opacidade). (3) 🚩 **A causa real (achada só na 3ª tentativa, medindo pixel a pixel):** o `.viewport` do reel tem `overflow-y:hidden` e só `padding-block:0.5rem` — **toda sombra era decepada a 8px do card.** Fix: `padding-block: 0.75rem 3.5rem` + anel branco `0 0 0 1px` **removido** (num fundo escuro ele risca o retângulo). ⚠️ Aumentar o raio da sombra exige aumentar o `padding-block` do `.viewport` junto, senão volta a cortar.

## SEO — extensões (passe 2026-08-03)

- **`hasOfferCatalog` no `Service`:** os itens do "O que cobre" de cada rota viram `OfferCatalog` — zero dado novo, é conteúdo que já está na página, declarado em schema.
- **`seoDescription`** — slot próprio em `ServicoDetalhe`, distinto do `desc` de `servicos.ts` (que é legenda de card do mosaico, não snippet de busca). Todas as 6 rotas ficaram entre 137-145 chars (teto ~155). Categoria sem a chave cai no `desc` antigo — nada quebra.
- 🚩 O 2º nível do `BreadcrumbList` aponta pra `/#servicos` (âncora do mosaico) — **não existe página `/servicos` própria.** Se um dia existir, trocar o link lá.
