# Ferramentas · probes · SEO · ANEXO-REGRAS
> Legenda: 🐞 bug caro · 🚫 fechado · 🔑 princípio · 🚩 restrição · [← índice](ANEXO-REGRAS.md)

## ✅ Imagens JÁ ESTÃO otimizadas — auditado 2026-08-03, não refazer

Victor perguntou se as fotos do site estavam otimizadas. **Estão** — medido, não suposto. O
`next.config.ts` tem `images.formats: ["image/avif", "image/webp"]` e TUDO que é imagem no site
passa por `next/image` (auditado: zero `url()` de imagem no CSS, zero `<img>` cru nos `.tsx`).

**A prova:** `hero-car-v2.png` tem **1498 KB** no disco (2048×1810, RGBA) e é entregue como
**50 KB AVIF** no tamanho cheio / **14 KB** a 828px. Redução de ~30×, automática.

🐞 **Como medir isso SEM se enganar:** `fetch(url)` manda `Accept: */*` e o Next devolve o formato
ORIGINAL — dá a falsa impressão de que nada foi otimizado. Tem que mandar o Accept do navegador:
```js
fetch(u, { headers: { Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8' } })
```
🔑 **Conclusão prática: arquivo-fonte pesado no `public/` NÃO é problema de performance** — o
otimizador resolve na entrega. Só pesa no repositório. Não sair recomprimindo fonte à toa.

⚠️ **As 2 exceções que o otimizador NÃO cobre** (aí sim o arquivo cru importa):
1. **`poster=` de `<video>`** — URL crua. Ver a regra dos dois frames em
   [sec-rota-servico.md](sec-rota-servico.md).
2. **Vídeo** — `next/image` não toca em `.mp4`. `montagem.mp4` (7,5 MB) é de longe o arquivo mais
   pesado do site; foi mantido em `crf 23` a pedido do Victor ("sem perder qualidade"). Se um dia
   pesar, é `crf` que mexe, não imagem.

- ⚙️ **Dev:** `npm run dev -- -p 3001` → `localhost:3001`.
- 🔑 **Verificar de verdade antes de dizer "pronto" — método cobrado pelo Victor, vale sempre.** Print da seção inteira NÃO confere um defeito de 1px (custou 3 tentativas numa sombra, ver [sec-rota-servico.md](sec-rota-servico.md) §sombreamento) — pra isso a verificação é **ler os pixels**, não olhar a imagem inteira.
- 🔑 **Medir o que o usuário aponta, não o que é fácil instrumentar.** Lição do caso do mapa "lento" ([sec-contato.md](sec-contato.md)): a medição óbvia (`onLoad` do iframe) media a coisa errada e apontava um problema que não existia na prática. Antes de instrumentar, confirmar o que exatamente o Victor está vendo.
- 🔬 **Probe de mapa (`probes/mapa-timing.mjs`, 2026-08-03):** rola como pessoa e mede o instante em que o mapa PINTA. Flags: `--rapido --mobile --net 3g --eager`.
- 🔬 **Probe de menu (`probes/menu-altura.mjs`, 2026-08-03):** abre o drawer em 7 perfis de celular e diz se ele CABE sem rolar (`--shot` printa cada um). As alturas dos perfis são **área útil (`svh` com a barra do navegador visível)**, não altura de tela; injeta `--safe-top` como a moldura. Nasceu do requisito "menu não pode rolar em celular nenhum" (ver [mobile.md](mobile.md)).
  - 🐞 **Duas armadilhas que ele já pagou** — valem pra qualquer probe novo: (1) **`waitUntil:"load"` não é hidratação** — clicar antes acerta um `<button>` sem `onClick`, o Playwright reporta sucesso e a medida sai do estado errado (e `visibility:hidden` **preserva o layout**, então os números vêm plausíveis!). Afirmar o estado esperado antes de medir. (2) **Não medir folga com `scrollHeight - clientHeight` num filho `flex:1 1 auto`** — ele sempre preenche o espaço livre, os dois empatam e dá "folga 0" mesmo sobrando lugar; a folga real é o espaço visível menos a soma do conteúdo.
- 🔬 **Probe de scroll/medição (CONSERTADO 2026-07-24):** Playwright agora é **devDependency real** do projeto (`playwright@1.61`, Chromium **v1228** gerenciado — era esse o build que a gambiarra velha do scratchpad procurava e não achava, por isso quebrava). Dois scripts versionados em **`site-mv/probes/`**: `shot.mjs` (print de uma seção/frame num viewport à escolha) e `measure.mjs` (top/bottom de cada elemento em px e %). Prints saem em `probes/out/` (gitignored). Uso no `probes/README.md`. 🔑 **Pulam a intro por padrão** (injetam `sessionStorage['mv:intro-played']` antes do load — senão o overlay tampa a seção); `--intro` mantém. 🔑 **Rodar contra o dev que já estiver de pé** (o Next 16 recusa 2º server): checar `:3000` e `:3001` e passar `--url`.
- 🛠️ **Moldura de celular:** `site-mv/public/preview-mobile.html`. 🚩 Agora está **blindada no `.gitignore`** (`/public/preview-mobile.html`) — não vai mais pro deploy sozinha. As duas barras são transparentes de verdade (exigência do Victor — não repor fundo). Detalhes na memória `moldura-preview-mobile`.
  - 🔑 **Recalibrada pro iPhone 14 Pro REAL (2026-07-24):** casca `393×852` (era 390×844); área útil do site (o `100svh` que o site enxerga = altura do iframe) = **760px**, exposta na constante **`SVH`** no JS — **é o ÚNICO lever** se o carro não assentar igual ao telefone. Status bar `59px`. **Injeta `--safe-top: 59px` no `documentElement` do iframe** no `load` (iframe não recebe `env()`), senão a navbar apareceria colada no topo e a moldura mentiria.
  - 🔑 **A "linha divisória" que aparece no claro NÃO é do site** (2026-07-24). Sobre/Círculo/`page.tsx` não têm `border` nenhuma. É artefato da **moldura**: o `transform: scale(0.91)` do `.device` arredonda pra pixels diferentes a borda de cima do `.stage` claro e da `.section` escura do Círculo → vaza **1px** do fundo escuro (claro/linha/claro). **Não existe em celular real** (escala 1). Victor optou por mantê-la por ora como olhômetro.
- **SEO:** verificar sempre no **HTML gerado** (`.next/server/app/index.html`), não no código. Cascata do rodapé é invólucro client, conteúdo segue no servidor. `-v2` obrigatório nos nomes de imagem (cache do Next). JSON-LD `LocalBusiness` completado com dados reais da ficha do Google (endereço, `geo` exato, `hasMap`).
- **`open-design`:** consulta de craft apenas, o app nunca roda (ver memória `open-design-usage`). ⬜ `.git` de 537 MB pode ser apagado (falta ordem do Victor).
- **Organização das skills:** as 41 de marketing viraram plugin em `.claude/skills/marketing/` (`plugin.json` + `skills/<nome>/`). ⚠️ **Descoberta de skills é de UM NÍVEL** — subpasta comum sem `plugin.json` apaga as skills. Nomes com prefixo (`/marketing:copywriting`).
