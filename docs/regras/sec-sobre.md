# Seção: Sobre / "Quem somos" — ilha CLARA pinada · ANEXO-REGRAS
> Legenda: 🐞 bug caro · 🚫 fechado · 🔑 princípio · 🚩 restrição · [← índice](ANEXO-REGRAS.md)

`id="quem-somos"`. Seção `260vh` + `.stage sticky`. Reveal palavra-a-palavra · marquee horizontal · 4 fotos em parallax (`toY` NEGATIVO). z: marquee<texto<fotos.
- ⚠️ Reveal precisa de espaço entre `<Word>` (`${word} `). Marquee em Birthstone, 260s = **~58px/s, a referência de velocidade de TODOS os marquees do site**.
- ⚠️ Conflito de copy: "Desde 2010" × stat "8+ anos".
- **Engenharia do vídeo:** `SobrePhoto` ganhou `video?`; quando existe, `src` vira o **poster**. `<video autoPlay loop muted playsInline>` (⚠️ **sem `muted` o navegador bloqueia o autoplay**), `aria-hidden`+`tabIndex={-1}` (decorativo), **cai no poster em `prefers-reduced-motion`**. CSS `.photoVideo` replica na mão o `object-fit:cover` do `fill`.
- 🔑 **Regra do corte de imagem (reutilizável):** o preset do gerador nunca é o do slot; escolhe-se por ONDE o corte dói menos, não pelo número mais próximo (3:2→16:10 corta ALTURA/chão; 16:9→16:10 corta LARGURA). Corte **assimétrico** é ferramenta.
- 🔑 **Prompt de fachada/logo (reutilizável):** pedir **RETOQUE, não criação** (*"retouch the building in the reference, keep angle/proportions, change only…"*) — senão o modelo trata a referência como clima, não como assunto. Logo legível descrita por **FORMA** ("blue/white chevron, small car outline"), não por texto.
