# Seção: Footer — 2ª ilha CLARA · Server Component · ANEXO-REGRAS
> Legenda: 🐞 bug caro · 🚫 fechado · 🔑 princípio · 🚩 restrição · [← índice](ANEXO-REGRAS.md)

(a) **marquee** no topo em Birthstone, CSS puro; (b) colunas: marca só em texto · Navegação · Redes (sem logo, sem botão WhatsApp — o CTA já está no Contato); (c) faixa azul de fecho **limpa, sem texto**, com grão. Copyright centralizado.
- ⚠️ Cores hardcoded (`#f4f4f2`/`#1c1c1c`) — ilha clara consciente (os tokens são dark).
- **Marquee:** PAR de frases alternadas (`footer.marquee` array + `join("  —  ")`). ⚠️ **Comprimento muda a velocidade percebida** — recalcular a duração p/ manter ~58px/s (referência da Sobre).
- **Cascata das colunas** (`FooterCascade.tsx`): reusa `columnCascade`. ⚠️ É um **invólucro client** p/ o Footer continuar Server Component; o invólucro vira o item do grid → o `min-width:0` migrou p/ `.cascadeItem`.
