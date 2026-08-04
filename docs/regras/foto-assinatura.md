# Foto gerada — assinatura visual das rotas de serviço

> **Quando abrir.** Antes de gerar QUALQUER foto para o site (rotas `/servicos/[slug]`, cards,
> blocos). A assinatura foi fechada com o Victor em 2026-08-02 na rota da Higienização e vale
> para as 5 rotas restantes — o objetivo é que nasçam coerentes sem rediscutir cor e luz.
>
> Motor: pasta **`C:\Users\victo\Desktop\Agent Labs\Human Images`** (autocontida, ver §6).

---

## 1. 🚫 Decisões fechadas (não reabrir)

- **Sem pessoa em foto gerada.** Nem rosto, nem mão segurando ferramenta. Dois motivos, os dois
  dele: (a) pessoa identificável lê como "esse é o time da MV" e é personagem inventado — anda na
  contramão do que ele fez nos depoimentos, que ficaram 9/9 reais; (b) mão segurando objeto é onde
  o modelo quebra. Superfície, textura e reflexo ele acerta quase sempre.
- **Carro sem emblema, sem marca, sem placa.** Marca de terceiro em foto comercial da MV não entra.
- **Acabamento MATTE, nunca lustroso.** Produto barato deixa painel brilhando; trabalho bom deixa
  matte com cara de novo. Pedir `dry matte finish, no greasy sheen`.
- **A foto precisa ter cor.** Regra dele, textual: *"essas fotos precisam de uma corzinha, senão
  vai desaparecer na sessão que não é tudo escuro e branco."* Está certo — a seção não é preta
  pura, então imagem monocromática se dissolve no fundo em vez de se destacar dele. Monocromático
  só funciona quando o entorno tem cor pra contrastar.

## 2. 🔑 A assinatura (a receita que ficou)

Fechada a partir de uma referência que o Victor trouxe (console de picape, foto de catálogo).

```
CAMERA: IMAX MK IV 65mm ISO 250        LENS: Zeiss Makro-Planar 65mm T2.2 (close/objeto)
                                             Leica Summilux-C 40mm T1.4 (cabine inteira)
LIGHT:  uma fonte ÚNICA muito grande e difusa, alta e frontal, 5400K.
        Sem borda dura em lugar nenhum. Speculars rolando suaves nos cromados.
        Flags dos lados segurando o entorno em 6 IRE. Highlights 74-78 IRE.
POST:   Kodak 2383 print emulation, grão orgânico visível, balanço neutro,
        midtone separation rica, pretos densos SEM crush, saturação contida.
```

Paleta que saiu disso: **grafite + prata/champagne**, com madeira e couro dando a cor. É luz de
catálogo automotivo — o dark premium que o site persegue.

## 3. 🚩 A restrição que manda em tudo: o filtro do site

```css
.splitImg { filter: saturate(0.82) contrast(1.08) brightness(0.94); }
```
`ServicoPage.module.css:200`. **Toda foto perde 18% de saturação e 6% de brilho depois de entrar
no card.** Consequência dura: **low key aqui chega escuro DUAS vezes e vira mancha.** Por isso a
receita pede sombras abertas e `midtone priority` — nunca `crushed blacks`.

## 4. 🐞 Erros que custaram rodada (não repetir)

| Sintoma | Causa real | Correção |
|---|---|---|
| **Azul demais**, imagem toda com cast frio | `Kodak 5219` é filme balanceado pra **tungstênio** — exposto em luz de dia puxa azul por física. Somado a key 6000K + fita LED azul = três coisas empurrando pro mesmo lado | Stock neutro (`2383 print`), key 5200-5400K, cor vindo de fonte **motivada** e localizada |
| **Volante do lado errado** (carro inglês) | Nunca escrevi `left-hand drive`. O modelo escolheu | Sempre declarar `left-hand drive` |
| **Emblema de outra marca** no volante | Pedir "sem emblema" não basta — o modelo preenche o cubo com o volante "premium" que conhece | **Cortar o cubo fora do quadro.** Geometria resolve o que instrução não resolve |
| **Fundo estourado** (para-brisa branco), 3 rodadas seguidas | Interior de carro visto de dentro vem com vidro claro atrás por padrão. Pedir "fundo escuro" não vence esse reflexo | **Tirar o vidro do enquadramento** — câmera alta olhando pra baixo, painel escuro ocupando o fundo |
| **Texto inventado** (gibberish em botões e painel) | Modelo tenta escrever onde vê superfície marcada | Duas defesas: (a) descrição física — `buttons unmarked, screen dark and unlit`; (b) **profundidade de campo** — `legends unreadable at this depth of field`. Onde ele não tenta escrever, não erra. A pasta proíbe bloco de proibição em CAPS no fim do prompt |

🔑 **O padrão por trás de três desses:** quando o modelo insiste contra a instrução, **mude a
geometria, não o adjetivo.** Cortar o cubo, tirar o vidro do quadro, fechar o foco.

## 5. 🚩 Casar o arquivo com o CSS antes de gerar

Ler o `aspect-ratio` do slot no CSS e gerar **nesse** aspect — não recortar depois.

| Slot | CSS | Aspect do render | Arquivo entregue |
|---|---|---|---|
| `.pairMain` (grande) | `46 / 45` = 1.022 | `1:1` | 1472×1440 · 201KB |
| `.pairSecondary` (pequeno) | `4 / 3` | `4:3` | 800×600 · 43KB |

- **Verificado em 2026-08-02:** ratio do arquivo idêntico ao do slot nos dois = **zero corte**.
- **Folga de nitidez apertada:** o console tem 1472px para uma necessidade de 1436px em DPR 2 —
  **2,5% de margem.** Card cresceu no CSS? o arquivo tem que crescer junto (e o `sizes` também).
- 🐞 **`naturalWidth` NÃO serve pra decidir se borra** — ele é corrigido por densidade e mente
  nesse teste (me fez reportar "BORRA" numa imagem sã). A resposta está na **requisição de rede**:
  interceptar `/_next/image` e ler o `w=`. Em DPR 2 deu `w=1920` e `w=640` — folgado.

## 6. Como rodar (pasta Human Images)

- **Motor:** Higgsfield CLI + `nano_banana_2`, via `scripts/render_image.py` da pasta.
- 🚩 **A pasta proíbe skill externa** — inclusive a `higgsfield-generate` instalada na sessão.
  Passar pelo script dela, sempre.
- Saída em `human-output/image/{slug}/` na raiz do `MV-OFICIAL` (fora do repo do `site-mv`).
- **Rascunho em `1k`, final em `2k`.** ⚠️ O modelo **não expõe seed**: gerar em 2k **não amplia** a
  imagem aprovada, produz uma nova na mesma família. Contar com variação de enquadramento.
- Referência com `--reference` (repetir em toda chamada do batch). Com referência, usar `@img1`
  no parágrafo `SUBJECT:`.
- Batch em paralelo, **teto de 2** — com 3 simultâneas o Higgsfield devolveu `not_enough_credits`
  tendo 1000 créditos em conta (throttling reportado com o erro errado).
- Custo real da rota inteira (3 testes de assinatura + 6 iterações + 2 finais em 2k): **~18 créditos.**

## 7. ⬜ Em aberto

- **Direitos da referência.** A foto usada como referência é do Vecteezy e está na raiz do
  `MV-OFICIAL`. O resultado é imagem nova, não cópia, mas a grande ficou próxima do enquadramento
  original. Some com a dívida já registrada em [`pendencias-legal-fase2.md`](pendencias-legal-fase2.md).
- **Gibberish residual** na foto do console: "PASSENGER ARONG", "BUAL", "MAX AFC", "ENI". Reduzido
  aos 736px do card fica ilegível — mas existe. Se algum dia a foto for usada maior, refazer.
- **A picape contradiz o briefing anterior.** Duas mensagens antes ele tinha pedido "meia faixa,
  nem popular nem de rico, tipo Corolla"; a referência que ele escolheu é uma F-150. Foi escolha
  consciente dele (avisado na hora), mas as **outras 5 rotas** precisam decidir se seguem a picape
  ou voltam pro carro de meia faixa.

---

*Companheiros: [`ANEXO-REGRAS.md`](ANEXO-REGRAS.md) (índice) · [`sec-rota-servico.md`](sec-rota-servico.md) (engenharia da rota) · [`produto-visual.md`](produto-visual.md) (paleta e princípios).*
