# Seção: Hero + Posicionamento · ANEXO-REGRAS
> Legenda: 🐞 bug caro · 🚫 fechado · 🔑 princípio · 🚩 restrição · [← índice](ANEXO-REGRAS.md)

## Hero — cena do FIGMA
Réplica 1:1 do node `475:143`: glow azul topo + luz branca do chão (vaza p/ a seção 2) + sombra de contato + carro PNG. Cenário estático.
- 🔑 **layer blur do Figma = 2× o `blur()` do CSS** (stdDeviation = radius/2).
- CTA **"Avaliação gratuita"** (convite, não "orçamento"). Botão com prop `arrow`; hover troca material (`--accent-glint`, sem `brightness`).
- 🚫 **SELOS de confiança REMOVIDOS de vez.**

## Posicionamento
Título + corpo + 4 stats + linha de acento. Bloco do dono removido. Stats em cascata (`statCascade`) + contador sincronizado (`statCounter`, 1.4s).
