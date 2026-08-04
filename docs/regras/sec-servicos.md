# Seção: Serviços — mosaico foto-led (ref Glänzen) · ANEXO-REGRAS
> Legenda: 🐞 bug caro · 🚫 fechado · 🔑 princípio · 🚩 restrição · [← índice](ANEXO-REGRAS.md)

Grade clicável → `/servicos/[slug]`. 6 cards. `content/servicos.ts` `{title,slug,desc,image,alt}` (⚠️ `jsonld.ts` consome `title`+`desc`). Hover: foto `scale(1.06)` + faixa azul diagonal + seta gira. Entrada: `revealHeadingVariants` + `staggerCard`, gatilho único atrasado (`margin -45%`, `once:true`).
- ⚠️ **Título invisível (não repetir):** o Círculo é `position:relative` e pintava por cima → `Servicos .section {position:relative; z-index:1}`.
- ⚠️ Mosaico via `transform:translateY` no `.cell`; o reveal roda num wrapper interno `.cardReveal`.
- ⚠️ **Cache de imagem do Next:** trocar foto com o MESMO nome serve a antiga → nome novo (sufixo `-v2`) e/ou `rm -rf .next/cache/images`.
