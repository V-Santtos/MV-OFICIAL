# ANEXO-MEMORIA — Estado vivo do projeto MV Estética Automotiva

> **O que é.** O **FLUXO** do trabalho: o que já foi feito, o que está em andamento e o próximo
> passo. É o que muda toda sessão — por isso fica curto. Histórico de sessão a sessão é o `git log`;
> lição de engenharia, decisão travada e "não repetir" moram em `regras/` (nunca aqui).
>
> **Onde está o resto.** Regra durável, decisão travada, aprendizado de engenharia, copy →
> **`regras/ANEXO-REGRAS.md`** (índice; abrir a ficha da área quando precisar do "porquê"). **Cold
> start:** `CLAUDE.md` → este arquivo (pra saber onde estamos) → `regras/ANEXO-REGRAS.md` (índice →
> ficha, quando a tarefa pedir uma regra específica).
>
> **Companheiros:** `CLAUDE.md` · `regras/ANEXO-REGRAS.md` · `.agents/product-marketing.md` (copy).
>
> Última atualização: **2026-08-03** — **FASE DE COPY CONCLUÍDA** (as 6 rotas), faixa de cortesia,
> 3 carrosséis de case ocultos. **+ Cases reais no Polimento (Gol, Hilux) e 1º case em VÍDEO**
> (Higienização, RAM Rampage — padrão de edição travado, ver seção 0). Dev: `npm run dev -- -p 3001`.

---

## 0. 📍 ONDE PARAMOS

### ✅ FASE DE COPY — CONCLUÍDA. As 6 rotas estão escritas e no ar.

Nenhuma sobrou na fôrma antiga. O eixo de cada categoria e as 15 regras aprendidas estão em
**[regras/copy.md](regras/copy.md)** — é lá que se consulta antes de mexer em qualquer linha.

| Rota | Estado |
|---|---|
| Higienização Completa · Bancos e Estofados | ✅ escritas e **validadas por ele** |
| Limpeza de Motor · Polimento | ✅ escritas · ⬜ falta o olhar dele |
| Vitrificação e Proteção · Cristalização de Vidros | ✅ escritas dos flyers reais · ⬜ falta o olhar dele |

⬜ **A bola está com ele:** levar as copies pro **dono da estética** reler. Ele já avisou que o dono
pode modificar coisas — inclusive **recuar da cortesia** (se recuar, apagar a chave `cobre.cortesia`
e a faixa some sozinha). As respostas do dono destravam 3 pendências:
1. A **face interna** do vidro entra na cristalização? *(se sim, vira card e conserta também o
   placeholder `cv-3`, que hoje promete isso sem respaldo — comentário deixado no código)*
2. A vitrificação cobre **roda e pinça de freio**?
3. A MV faz **película/insulfilm**? — é o único `crossLink` candidato da Cristalização.

⬜ **Sobras pequenas, não bloqueantes:** o `seoDescription` da Higienização ainda fala só de interior
· o `summary` do case Hilux-poeira (rascunho meu, nunca escolhido) · os `summary` dos 2 cases novos do
Polimento (Gol-hologramas, Hilux-riscos) também são rascunho meu, escritos só pra ligar a foto — ainda
não passaram pelo olhar do Victor · na Cristalização, os cards 1 e 2 ainda repetem a ideia do título
novo da seção 2 ("não sai lavando"), avisado e não pedido pra mexer.

🚩 **MODO DE TRABALHO — confirmar a cada rota nova.** Até Bancos ele queria **opções escritas** peça
por peça; de Motor em diante pediu **a rota inteira de uma vez**, com planejamento antes de executar.
Na lapidação fina (hero da Cristalização) voltou a querer **opções**. Não assumir: perguntar.

### 🔕 Carrosséis "Alguns trabalhos" — ocultos onde não há case real

| Rota | `placeholdersVisiveis` | Carrossel |
|---|---|---|
| Higienização Completa | (global = 1) | ✅ visível — **2 cases REAIS** (Hilux poeira + RAM Rampage lavagem, EM VÍDEO) + 1 de enchimento |
| Polimento | (global = 1) | ✅ visível — **2 cases REAIS** (Gol hologramas + Hilux riscos, 2026-08-03) + 1 de enchimento |
| Bancos e Estofados | 5 | ✅ visível — só cards de enchimento |
| Limpeza de Motor · Vitrificação · Cristalização | **0** | 🔕 **oculta** |

🔑 **Pra reativar, não precisa mexer no número:** basta escrever o 1º case REAL no `items`. Com `0`, o
que aparece é exatamente o que é real, e a seção volta sozinha. Os 5 placeholders de cada rota seguem
no arquivo, dormentes (`ocultar-nunca-apagar`).

### 🎁 Faixa de cortesia — peça nova de UI

Do flyer da Vitrificação Comercial: *"CORTESIA INCLUSA: descontaminação e cristalização de TODOS os
vidros"*. Renderiza como faixa própria entre o grid e o `crossLink` — **não** como 7º card (o grid é
de 3 colunas e sobraria órfão; e os cards são o que a categoria COBRE, isto é o que ela DÁ). Usa o
**filete azul dos flyers da MV**: vertical no desktop, horizontal no mobile. Chave `cobre.cortesia`;
sem ela, nada renderiza. Preço nunca entra.

### ⬜ Validação no CELULAR REAL — a lista que ele vai conferir

Tudo abaixo foi medido e printado no 393, mas **não** no aparelho:

- ⬜ As 6 rotas de copy no mobile (hero, "O que é", cards).
- ⬜ A **faixa de cortesia** no mobile (o filete deitado).
- ⬜ A **transição de rota** com a cortina do "M" — foi ao ar sem ele ver rodando (decisão dele,
  "commita tudo"); dá pra reverter pelo GitHub. Engenharia em `regras/sec-abertura.md`.
- ⬜ Menu cabe inteiro, sem rolagem por dentro (`svh` no clamp + topo no `--safe-top`) → `regras/mobile.md`.
- ⬜ Vídeo da Sobre tocando normal + status bar sem o azul forçado; **rodar o PageSpeed de novo no ar**.
- ⬜ Feedback tátil (`:active`) no mosaico de categorias, no reel de cases e no lightbox.

🚩 **Ainda ABERTO no mobile:** o **flick azul na status bar** (provavelmente morreu junto com o
`#__boot` removido — confirmar no aparelho antes de fechar a ficha em `regras/mobile.md`).

⚠️ **Herdado, sem conferência dele:** WhatsApp **(33) 99846-3806** está no site inteiro — ele digitou
8 dígitos mas confirmou verbalmente o de 9. Se estiver errado, é 1 linha em `contact.whatsapp`.

### 🎬 Cases em VÍDEO — capacidade nova, padrão de referência travado (Victor, 2026-08-03)

`CasesReel`/`CaseLightbox` agora aceitam vídeo (`tipo: "video"` + `poster`). Primeiro uso: case
`rampage-lavagem` da Higienização Completa — **11,97s**, antes/durante alternando 2 takes rápidos
(~0,5s) + 1 no ritmo anterior (~1,2s), depois intocado (~2,3s/take, teto total ~12s).

📖 **Isto é o PADRÃO DE REFERÊNCIA pros próximos vídeos de case** — receita completa (pastas
`IMPUT/{antes,durante,depois}`, `manifest.csv`, `montar.sh`, a pegadinha da rotação do iPhone,
specs de saída) em **[regras/sec-rota-servico.md](regras/sec-rota-servico.md)**, seção "Cases em
VÍDEO — padrão de edição". Não reescrever aqui — abrir a ficha.

### 📸 Fotos — a maior lacuna visual

As 6 rotas usam PLACEHOLDER no bloco "O que é" (repetem o card da home nos dois slots), de propósito.
Fase própria: ler **[regras/foto-assinatura.md](regras/foto-assinatura.md)** ANTES de gerar. Trava:
(a) picape grande × carro de meia faixa, não escolhido pras 5 rotas novas; (b) a foto do motor tem
pessoa no quadro, que a ficha proíbe.

🔴 **Contradição em aberto, NÃO bloqueante — "restauração de faróis".** A meta description da home
promete faróis que a MV talvez não faça. Ele respondeu que vai pontuar o escopo real com o dono.
**Não perguntar de novo em cold start.** Quando a lista chegar, muda em 4 lugares:
`siteConfig.description`, `siteConfig.keywords`, card "Faróis" do Polimento, `seoDescription` dele.

---

## 1. Em ANDAMENTO — Passe de Mobile

Plano em `C:\Users\victo\.claude\plans\beleza-agora-a-gente-recursive-clock.md`. Diretriz: preservar
os efeitos recalibrados, nunca versão mobile chapada. Engenharia → [regras/mobile.md](regras/mobile.md).

- ✅ Etapa 0 (fundação) · ✅ 1 (menu hambúrguer GSAP) · ✅ 2 (Hero) · ✅ 4 (rota do serviço) ·
  ✅ 5 (menu que cabe sem rolar + mapa full-bleed).
- 🔄 **Etapa 3 — seções da home:** itens 1–6 ✅. **Pendente:**
  - ⬜ 7. Faixa de ~15px na borda direita com o menu aberto (`scrollbar-gutter:stable`) — só aparece
    em desktop/moldura, **não existe no celular real**. Receita pronta em `mobile.md`; ele ainda não
    decidiu se vale tratar.

### 🚫 Carrossel "Do volante ao carro inteiro" no mobile — **CANCELADO** (Victor, 2026-08-03)

"A gente vai excluir, não vamos fazer mais." **Não reabrir.**

---

## 2. Backlog (depois do mobile)

1. **Copy final — revisão do site inteiro** (fora das 6 rotas). A data de início da MV foi
   alinhada para "Desde 2022" em 2026-08-11 (ver [regras/sec-sobre.md](regras/sec-sobre.md)).
2. **Fechar a mídia da Sobre** — gerar a lane 4 (1:1) e resolver a dívida de direitos da lane 2
   (ver [regras/pendencias-legal-fase2.md](regras/pendencias-legal-fase2.md)).
3. **Setas do reel de cases** — sumir com a `.nav` quando não há overflow (proposto, não aplicado).
4. **Antes/depois arrastável** dentro do card de case — não é requisito, seria ganho de impacto.
5. **Recuperar o argumento de processo** (prazo, registro fotográfico, "não corta caminho") que os
   depoimentos placeholder traziam e os 9 reais não trazem (ver `regras/sec-depoimentos.md`).
6. **Órfãos do tipo `ServicoDetalhe`:** `beneficios`/`processo`/`cta`/`note` estão preenchidos nas 6
   rotas e nenhum é renderizado — decidir se voltam ao template ou saem do tipo
   (ver `regras/sec-rota-servico.md`).
7. **Sobras da transição de rota:** o drawer mobile e os links de âncora seguem em recarga completa,
   de propósito. Estender é o mesmo `onClick`.

---

## 3. Decisões pendentes do Victor (rápidas, ~1 linha de código cada)

- **Meta description A ou B** (home):
  - A) "Estética automotiva em Simonésia, MG: polimento, vitrificação, higienização interna,
    estofados, motor e vidros. Avaliação sem custo antes de qualquer serviço."
  - B) "Polimento, vitrificação, higienização e proteção em Simonésia, MG. Avaliação sem custo e
    orçamento antes de qualquer serviço."
  - (A atual em `lib/seo/site.ts` tem 186 chars — Google corta ~160 — e tem a tensão do farol.)
- Mapa: manter o arrasto (com a faixa do Ctrl aparecendo) ou desligar a interação.
- Apagar o `.git` da `open-design` (537 MB) — ver memória `open-design-usage`.
- Bug do "scroll morto" widescreen no Processo (`padding-bottom` do `.stack`) — mexe em coisa
  validada, decisão dele (ver `regras/sec-processo.md`).
- Direito de uso do vídeo/foto de terceiro na Sobre — licença ou captação própria.
- **Logo da navbar em azul — BLOQUEADO.** Falta o vetor original (AI/EPS/SVG), ou autorizar
  revetorizar preservando o vão entre chevron e corpo do "M" (ver `regras/sec-navbar.md`).
- Depoimentos: Thayná escreveu "quero olhar com você", trocado por "quero ver com você" — reverter se
  ele preferir literal (ver `regras/sec-depoimentos.md`).

---

## 4. Ações do dono (fora do código) e perguntas abertas

**⬜ Ações do DONO:** trocar a categoria do Google de "Lava-rápido" p/ estética automotiva · marcar
o "Alfa Car Lava Jato" como fechado permanentemente.

**❓ Perguntas sem resposta:**
1. O que a MV faz que ninguém na região faz? — maior lacuna do projeto.
2. Quanto tempo o veículo fica com ele?
3. Números reais pros stats (ou remover os que estão no ar).
4. A MV faz película/insulfilm?
5. Os **flyers das outras 4 categorias** — as rotas fechadas antes da Vitrificação nunca passaram
   pela conferência contra o catálogo real (ver memória `copy-conferir-escopo-contra-flyer`).

**Dependências de conteúdo:** fotos reais das 5 rotas novas · captação própria de vídeo/foto no salão.

---

*Companheiros: `CLAUDE.md` (regras de sessão) · `regras/ANEXO-REGRAS.md` (índice das regras
duráveis e o "porquê").*
