# Seção: Abertura (intro → navbar → hero) + Script de pré-paint · ANEXO-REGRAS
> Legenda: 🐞 bug caro · 🚫 fechado · 🔑 princípio · 🚩 restrição · [← índice](ANEXO-REGRAS.md)

## Abertura (intro → navbar → hero) — GSAP
Painel dark cobre a tela → logo MV se desenha → painel sobe → Navbar cai → Hero sobe. Sinal em `lib/animation/introSignal.ts` (trata corrida emit-antes-de-assinar). `navCascade.delay = intro.lift.duration`; `heroCascade.delay = lift.duration + 0.35`.
- ⚠️ Logo `ui/logo.ts` (`MV_LOGO`, viewBox `0 0 512 400`) — vtracer trunca a base do "M"; caixa real 512×400. **Não brigar de novo.**
- ⚠️ Cascatas animam os filhos `data-reveal`, **nunca** o `<ul>` da navbar (tem `translateX(-50%)`).
- 🚫 **Intro toca UMA VEZ POR ABA** (`sessionStorage` `mv:intro-played`) — **aprovado pelo Victor**. 1ª visita inalterada; rever = aba nova/anônima.
  - ⚠️ **Três peças que só funcionam juntas:** (1) script INLINE no `layout.tsx` carimba `data-intro-done` no `<html>` antes do 1º paint; (2) regra no `globals.css` esconde `.mv-intro-overlay`; (3) `IntroReveal` lê a flag. Sem (1)+(2), cargas seguintes **piscam** o painel escuro.
  - ⚠️ `emitIntroReveal({instant:true})` + `introDelay()`: o `delay` das cascatas existe só p/ esperar a cortina subir. Sem zerar quando a intro é pulada, a tela fica **parada ~1s**.
  - ⚠️ **`suppressHydrationWarning` no `<html>` é OBRIGATÓRIO** por causa do script (atributo existe no cliente, não no HTML do servidor).

## Transição entre ROTAS (a irmã rápida da intro) — `RouteTransition`
A mesma cortina com o "M" se desenhando, agora na navegação (Victor, 2026-08-03). Painel entra POR BAIXO → desenha → preenche → **a rota troca com a tela coberta** → painel sai pelo TOPO. Direção igual à da intro (sempre subindo). Tempos em `routeTransition` (`motion.ts`): cover .45 · draw .6 · fill .25 · reveal .5 ≈ **1,6s**. Provider em `layout.tsx` envolvendo Navbar/main/Footer.
- 🚫 **Peso decidido: ~1,6s, não os ~2,4s da intro** — abertura é cena e toca 1×/aba; transição toca a cada clique. O que saiu foi o `hold`; o `draw` **não** desce de ~0,5s (abaixo disso o traço vira piscar, não desenho).
- 🔑 **A revelação espera o `pathname` virar o destino**, não um tempo fixo — `router.push` é assíncrono e revelar cedo mostraria a página ANTIGA. Teto de 2,5s (`esperaMaxima`) pra conexão ruim não prender ninguém atrás da cortina.
- 🔑 **Rolagem:** `travarRolagem(true)` ao cobrir; antes de revelar, `lenis.scrollTo(0,{immediate,force})` — sem isso a rota nova abre na altura da anterior. `force` é o que alcança o alvo com o Lenis parado.
- 🐞 **`gsap.set(el,{ y:0, yPercent:100 })`** — ver o GOLD do `yPercent` em [`03-animacao-scroll-gold.md`](03-animacao-scroll-gold.md). Foi o defeito real desta peça.
- 🚩 **Escopo (Victor):** só os cards do mosaico e a logo/"Início" **fora da home**. Âncoras (`/#servicos`…) e o drawer mobile seguem em `<a>`/recarga — de propósito, pra não trazer âncora×Lenis pra esta fase.
- 🔑 Links continuam `<Link href>`/`<a href>` de verdade: só o clique SIMPLES é interceptado (`ehCliqueSimples`), então ctrl/cmd-clique e botão do meio seguem abrindo em aba nova, e o prefetch continua valendo.
- 🚫 **`IntroReveal` NÃO foi refatorado** pra compartilhar código. São 3 peças amarradas ao script de pré-paint; ~15 linhas duplicadas de timeline custam menos que o risco.
- 🔑 Verificação: `probes/transicao-rota.mjs` (amostra a cobertura ms a ms, prova que a rota troca a 100% coberto, printa o desenho, e confere se a home volta viva depois da navegação client-side).

## Script de PRÉ-PAINT no `layout.tsx` — 3 responsabilidades
Inline e síncrono de propósito (componente client chegaria depois do 1º paint):
1. `history.scrollRestoration = "manual"` — sem isso o Chrome recarrega no meio do site (página única).
2. **Tira o HASH quando a navegação é `reload`** (`performance.getEntriesByType("navigation")[0].type`). ⚠️ Em navegação NORMAL o hash é preservado (link compartilhado + âncora de `/servicos/...` funcionam).
3. Carimba `data-intro-done`.
