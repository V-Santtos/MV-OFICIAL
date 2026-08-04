# CLAUDE.md — MV Estética Automotiva

> **Função única deste arquivo:** ser o manual de operação do agente — as instruções que o Claude
> carrega automaticamente em TODA sessão pra saber como agir neste projeto. Não é documentação pra
> humano nem o "porquê" das coisas. Cada linha paga token toda mensagem, então só entra o que preciso
> saber SEMPRE. O resto é ponteiro.
>
> - **`ANEXO-MEMORIA.md`** = estado vivo (feito / em andamento / próximo passo). **Ler no início de toda sessão.**
> - **`regras/ANEXO-REGRAS.md`** = índice das regras duráveis (fichas por área na pasta `regras/`). **Abrir a ficha certa só quando a tarefa pedir.**

---

## 1. O projeto

Site para **MV Estética Automotiva**, de **Simonésia-MG**. Deve transmitir acabamento premium, impacto visual, clareza comercial e estrutura profissional. **Nunca** genérico, simplório ou com "cara de IA".

Direção visual: **dark premium** (não preto puro), azul da marca como destaque controlado, tipografia técnica com presença. Referências: Apple, Porsche, Rimac. (Paleta, tokens e tipografia exatos → `regras/produto-visual.md`.)

---

## 2. Mapa do ambiente (onde está cada coisa)

| Onde | O que é |
|---|---|
| **`site-mv/`** | O app (Next.js + TS). ⚠️ **A NOSSA.** Sempre qualifique o caminho. |
| **`GSAP/`** | A biblioteca GSAP de verdade (dist + tipos TS) — a **API exata** pra conferir. |
| **`.claude/skills/`** | Cardápio de skills. Plugins: **`gsap`** (8 guias de animação), **`marketing`** (41 de copy), **`taste-skill`** (12 de design). Acionadas **sob demanda**, nunca automáticas. |
| **`ANEXO-MEMORIA.md`** · **`regras/`** | Estado vivo · regras duráveis (índice em `regras/ANEXO-REGRAS.md`). |
| **memória** (`~/.claude/…/memory/`) | Fatos que persistem entre sessões (índice em `MEMORY.md`). |
| **case congelado** `…\Projetos Gith Hub\site-mv` | Fonte de **conteúdo** e referência visual. **SÓ LEITURA, nunca editar.** Chaves: `ANEXO-MIGRACAO.md` (arquitetura) · `design-system/PLANO-ESTRATEGICO.md` (design). |

- **Regra de ouro da migração:** **conteúdo migra, código NÃO.** Reconstruir limpo, nunca colar componente do case externo.
- ⚠️ Só vale o cardápio de skills de `MV-OFICIAL/.claude/skills` — nenhum outro.

---

## 3. Como codar aqui

- Stack: **Next.js + React + Tailwind v4** (CSS-first, `@theme`) + CSS Modules · Framer Motion centralizado · GSAP na abertura/menu · Lenis. (Detalhes travados → `regras/01-stack-arquitetura.md`; regras GOLD de animação → `regras/03-animacao-scroll-gold.md`.)
- Skills que **guiam o código certo** (aciono quando codo): **`next-best-practices`** e **`tailwind-design-system`**. Animação → família **`gsap`** (+ a lib `GSAP/`).
- ⚠️ **O Next daqui não é o padrão** — ler o guia em `site-mv/node_modules/next/dist/docs/` **antes de escrever código Next** (ver `site-mv/AGENTS.md`).
- **Deploy:** `deploy-to-vercel`, só na hora de subir (já funciona).
- **Verificar antes de dizer "pronto":** probes em `site-mv/probes/` (print + medida). Nunca decidir no olho.

**Comandos** (rodar de dentro de `site-mv/`): dev `npm run dev -- -p 3001` (ou usar o server que já estiver de pé) · build `npm run build` · print `node probes/shot.mjs --sel "#secao" --out probes/out/x.png` · medir `node probes/measure.mjs --sel "#secao .card"`.

---

## 4. Protocolo de sessão

- **Cold start:** este arquivo → `ANEXO-MEMORIA` (onde estamos) → `regras/ANEXO-REGRAS.md` (índice) → a ficha da área só quando a tarefa pedir uma regra.
- **Trabalhar por fases, uma coisa de cada vez.** Pedir a referência antes de construir; mostrar o resultado a cada ajuste; não desfazer o que o Victor já aprovou. (Memória `trabalhar-uma-coisa-por-vez`.)
- **Copy:** antes de escrever qualquer linha, ler `.agents/product-marketing.md`. Apresentar **opções**, nunca aplicar versão pronta direto. Rodar `marketing:humanizer` antes de fechar. (Régua completa → `regras/copy.md`.)
- **Ao fim de cada etapa relevante:** atualizar `ANEXO-MEMORIA.md`.
- 🚩 **Bug: LER o componente inteiro antes de instrumentar.** O projeto é pequeno e mapeado — quase todo defeito está visível nos 2-3 arquivos da peça. Probe/medição é o **último** recurso, não o primeiro. (Custou ~30% de uma janela num delay de menu cuja causa estava numa linha do `motion.ts` que eu já tinha aberto.)
- O `site-mv` congelado externo é intocável. Só leitura.

---

*Companheiros: `ANEXO-MEMORIA.md` (estado vivo + próximos passos) · `regras/ANEXO-REGRAS.md` (índice das regras duráveis).*
