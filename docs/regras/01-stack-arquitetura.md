# Stack e arquitetura (travado) · ANEXO-REGRAS
> Legenda: 🐞 bug caro · 🚫 fechado · 🔑 princípio · 🚩 restrição · [← índice](ANEXO-REGRAS.md)

- **Stack:** Next **16.2.10** · React **19.2.4** · Tailwind **v4** (CSS-first, `@theme`) · TS 5 · App Router · `src/` · alias `@/*`. Deps: `framer-motion`, `gsap`, `lenis`.
- **Arquitetura:** `components/{sections,ui,layout}` · `lib/{animation,seo}` · `content/` · `styles/`. Tokens em `src/styles/tokens.css` (**fonte-verdade**) + `globals.css` mínimo com `@theme`. Conteúdo→dados em `content/*.ts`. **Zero `style={{}}` inline** (só valor dinâmico real).
- 🚩 **Colisão de nomes:** a NOSSA = `MV-OFICIAL/site-mv/`. A congelada (**só leitura**) = `C:\Users\victo\Desktop\Projetos Gith Hub\site-mv`. **Sempre qualifique o caminho.**
- **Regra de ouro da migração:** **conteúdo migra, código não.** Reconstruir limpo, nunca colar componente do case externo.
- **Ordem da Home:** Hero → Posicionamento → Sobre → Círculo → Serviços → Processo → Depoimentos → Contato(+mapa) → Footer.
