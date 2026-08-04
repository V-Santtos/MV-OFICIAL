# ANEXO-REGRAS — índice das regras duráveis (MV Estética Automotiva)

> **O que é.** Regras fortes, decisões travadas, aprendizados de engenharia e restrições que **NÃO mudam** de sessão pra sessão — o **"porquê"** do projeto. O conteúdo mora em fichas curtas **nesta pasta (`regras/`)**; este arquivo é só o **índice** pra abrir a ficha certa sem carregar o resto.
>
> **Como usar.** Ache a área na tabela → abra **só** aquela ficha. O estado vivo (o que fazemos agora) fica em **`../ANEXO-MEMORIA.md`**.
>
> **Legenda (usada nas fichas):** 🐞 bug que já custou caro (não repetir) · 🚫 decisão fechada (não reabrir) · 🔑 princípio reutilizável · 🚩 restrição dura.

---

## Base e transversal

| Ficha | Quando abrir |
|---|---|
| [`01-stack-arquitetura.md`](01-stack-arquitetura.md) | Versões, arquitetura de pastas, tokens, colisão de nomes, regra de ouro da migração. |
| [`02-git-deploy-vercel.md`](02-git-deploy-vercel.md) | Repo, branch, produção, fluxo de push/redeploy, `NEXT_PUBLIC_SITE_URL`. |
| [`03-animacao-scroll-gold.md`](03-animacao-scroll-gold.md) | **Regras GOLD** de animação/scroll (Framer×Lenis, pins, `100svh`, `once`). Abrir em QUALQUER trabalho de animação. |

## Engenharia por seção (o "por que o código é assim")

| Ficha | Seção |
|---|---|
| [`sec-abertura.md`](sec-abertura.md) | Abertura (intro GSAP) + script de pré-paint do `layout.tsx`. |
| [`sec-navbar.md`](sec-navbar.md) | Navbar — pílula flutuante. |
| [`sec-hero.md`](sec-hero.md) | Hero (cena do Figma) + Posicionamento. |
| [`sec-sobre.md`](sec-sobre.md) | Sobre / "Quem somos" — ilha clara pinada. |
| [`sec-circulo.md`](sec-circulo.md) | Círculo — transição claro→dark. |
| [`sec-servicos.md`](sec-servicos.md) | Serviços — mosaico foto-led. |
| [`sec-processo.md`](sec-processo.md) | Processo — empilhamento sticky. |
| [`sec-depoimentos.md`](sec-depoimentos.md) | Depoimentos — mural em cascata. |
| [`sec-contato.md`](sec-contato.md) | Contato — fecho dark + mapa por iframe. |
| [`sec-footer.md`](sec-footer.md) | Footer — 2ª ilha clara, Server Component. |
| [`sec-rota-servico.md`](sec-rota-servico.md) | Rota `/servicos/[slug]` — cobertura, glow, cases reel (foto E VÍDEO — padrão de edição FFmpeg), FAQ. |
| [`mobile.md`](mobile.md) | **Mobile** — fundação, menu, hero, passe de seções, topo/navbar/drawer. Abrir em qualquer trabalho mobile. |

## Copy · Produto · Pendências · Ferramentas

| Ficha | Quando abrir |
|---|---|
| [`copy.md`](copy.md) | Antes de escrever QUALQUER copy — régua, 6 testes, decisões fechadas, tells de IA. |
| [`foto-assinatura.md`](foto-assinatura.md) | Antes de gerar QUALQUER foto — assinatura de luz/cor travada, o filtro que come a imagem, os 5 erros que custaram rodada, como rodar o Higgsfield. |
| [`produto-visual.md`](produto-visual.md) | Decisões travadas de produto/visual: paleta, princípios, schema, sem-Google-Cloud. |
| [`pendencias-legal-fase2.md`](pendencias-legal-fase2.md) | Dívida de direitos, PENDENTE DO DONO, parqueado p/ Fase 2, contexto do negócio. |
| [`ferramentas-seo-probes.md`](ferramentas-seo-probes.md) | Dev, **probes** (print/medida), moldura de celular, SEO, organização de skills. |

---

*Companheiros: `../CLAUDE.md` (manual de operação) · `../ANEXO-MEMORIA.md` (estado vivo).*
