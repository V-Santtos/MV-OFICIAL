# Seção: Navbar — pílula flutuante · ANEXO-REGRAS
> Legenda: 🐞 bug caro · 🚫 fechado · 🔑 princípio · 🚩 restrição · [← índice](ANEXO-REGRAS.md)

Topo/hero: transparente `absolute`. Rolando PRA CIMA fora do topo: card `#2e2e2e` + grão + borda + sombra, `fixed`, fade (estado `revealed`).
- ⚠️ **Histerese >10px** (mata o jitter do Lenis) · **grão em camada própria** (`.inner::after`; junto do blur impedia o blur) · **`backdrop-filter`** morre se ancestral tem `overflow` clipado/`transform`/`filter` → `overflow-x:clip` em **`main`**, não em `html,body`.
- Hover dos links = risquinho branco + spotlight (irmãos a 45%), **NÃO cor**. Azul só no CTA.
- **Links:** `Início · Serviços · Processo · Quem somos` + CTA Contato. Ordem por prioridade comercial (escolha do Victor). ⚠️ 4 itens alargam a pílula — conferir em 1366px.
- 🚫 **Depoimentos NÃO entra na navbar** enquanto os 9 forem fictícios (item de navbar = promessa de substância). No rodapé o link "Clientes" fica. Reabrir com depoimentos reais.

## ❌ Logo em SVG — TENTADO E REVERTIDO (2026-08-01). Não repetir.

**Pedido do Victor:** topo do "M" no azul da marca **só na pílula flutuante** (ao rolar pra cima); no estado default do topo/hero a logo fica **toda branca**.

- **Estado atual (o que está no ar):** `<Image src={assets.logo}>` (PNG) + `filter: brightness(0) invert(1)` no `.logoImg`. Único uso de `assets.logo`.
- 🐞 **Por que reverteu:** troquei o PNG pelo SVG inline `MV_LOGO` (`ui/logo.ts`) pra poder colorir só o "M" — mas **o vetor não é fiel ao PNG**: no original existe um respiro entre o chevron e o corpo do "M"; no traçado vetorizado as duas formas se encostam (confirmado no print ampliado 5×). Victor viu na hora.
- ⬜ **Bloqueado até existir um vetor fiel** — falta o arquivo original (AI/EPS/SVG) do Victor, ou revetorizar preservando o vão. Só depois disso vale ligar a cor por estado (o gancho certo é a classe `.revealed` do `<nav>`: `false` = topo/hero, `true` = pílula).
- 🚩 **Suspeita nunca verificada:** a intro (`IntroReveal`, ver [sec-abertura.md](sec-abertura.md)) usa o MESMO `MV_LOGO` — provavelmente tem o mesmo defeito do vão.
