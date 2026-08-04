# Seção: Processo — empilhamento sticky (ref MetroRide "Numbers") · ANEXO-REGRAS
> Legenda: 🐞 bug caro · 🚫 fechado · 🔑 princípio · 🚩 restrição · [← índice](ANEXO-REGRAS.md)

**Lógica CERTA (2 erros antes):** só o **TÍTULO é PINADO** (`.head sticky; top:18vh; z:0`); **cards NÃO grudam**, sobem em fluxo normal e passam por cima (`z:1`); **só o título desfoca.**
- Cards `min(92vw,34rem)×30rem`, 3 `data-variant` (blue/light/dark) + grão (⚠️ vaza sem `.card{position:relative}`).
- **Fade do título ANCORADO NO CARD 03**, não em `p`: rAF lê `lastCard.top` → `mapClamp(cardTop, 0.2vh, 0.6vh, 0, 1)`. `padding-bottom:22vh` no `.stack` dá o scroll extra. Blur segue em `p`. rAF gated por IntersectionObserver.
- 🔑 Lição: fade linear tem topo raso invisível (quem manda é o FIM da janela); ancorar na posição do card resolveu o "sumir no vazio".
- **Cards preenchidos com 3 `checkpoints`:** o vão morto era **desequilíbrio de massa**, não espaçamento. Card = `.top` (nº+título) + `.foot` (`margin-top:auto`, descrição + lista). Checkpoints: hairline via `color-mix(currentColor)`, marcador = traço curto em `currentColor`, **nunca azul** (sumiria no card azul).
- 🚫 **Recusado:** régua cheia embaixo do título (separação vem do espaço e da escala, não de linha).
- 🐞 **Bug PRÉ-EXISTENTE (widescreen):** em 1920×1080 o título termina em opacidade 0.15 e `card3Top` para em 282px (alvo ≤216) — "scroll morto widescreen". Cura = aumentar `padding-bottom` do `.stack`; mexe em coisa validada, decisão do Victor.
