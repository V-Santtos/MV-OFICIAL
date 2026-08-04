# Animação e scroll — regras GOLD (não repetir) · ANEXO-REGRAS
> Legenda: 🐞 bug caro · 🚫 fechado · 🔑 princípio · 🚩 restrição · [← índice](ANEXO-REGRAS.md)

- 🐞 **GOLD — `useScroll` do Framer é NÃO-MONOTÔNICO com Lenis** em seções altas (oscila pra trás, quebra fades/pins). **Fix:** medir à MÃO (`getBoundingClientRect().top` num rAF → `p = clamp(-r.top/(r.height-vh),0,1)` → `useMotionValue`), gated por IntersectionObserver.
- ⚠️ **`whileInView` dispara "preso invisível" logo após seção PINADA.** Usar **`useInView` CONTROLADO + variants**, nunca `whileInView`/`useScroll` em conteúdo perto de pin.
- ⚠️ **`once: true`** em tudo que revela — sem isso a animação reverte quando o usuário sobe a página.
- 🔑 **Card com `:hover` de transform → entrada só OPACIDADE** (`staggerFadeIn`). Animar `y` no mount deixa `transform` inline que vence a folha e MATA o hover. (Se o hover é numa parte interna, ex. `.img`, aí pode entrar com rise.)
- 🔑 **Trava de rolagem de overlay = `lenis.stop()`** (via `travarRolagem()` em `SmoothScroll.tsx`), **nunca `body.overflow`** — o Lenis mantém o próprio rAF. `SmoothScroll` expõe `getLenis()` e `travarRolagem(bool)`.
- 🔑 **`100svh`** (não `vh`, não `dvh`) nos palcos pinados. `vh` do CSS ignora a barra do navegador no mobile; `dvh` refluiria durante o scroll e faria o palco pinado tremer.
- 🔑 **Toda animação é centralizada** em `lib/animation/motion.ts` — nenhuma seção define curva/variante solta. **GSAP só na abertura** (e no menu mobile). **Lenis** = smooth-scroll global (`lerp 0.1`).
- 🐞 **GOLD — `yPercent` do GSAP SOMA ao `transform` que já está no CSS.** Um painel estacionado com `transform: translateY(100%)` na folha tem computed style em MATRIZ (pixels): o GSAP lê `y: 900px`, não "100%". Aí `gsap.set({yPercent:100})` empilha e o elemento vai pra 200%. **Fix: `gsap.set(el, { y: 0, yPercent: 100 })`** — zerar o `y` junto. Custou o defeito da cortina de rota, que "cobria" fora da vista e só aparecia DEPOIS de navegar (achado por probe, invisível na leitura do código).
- 🔑 **Testar scroll com Playwright headless, nunca no olho.** Medir espaçamento, nunca decidir no olho.
