# Roteiro de validação — rodada de 20/10/2026 (pacote Billion de 19/10)

Para fazer com o Victor em casa, **um item por vez**, marcando aqui. O detalhe técnico de cada mudança está em [plano-mudancas-billion-2026-10-19.md](plano-mudancas-billion-2026-10-19.md).

**Estado ao deixar pronto (20/10/2026):** tudo implementado, revisado e commitado em `main`, **8 commits à frente do `origin`**, sem push e sem deploy. O ponto de antes da rodada é a tag `mv-baseline-2026-10-20`.

---

## Etapa 1 · Olhar no computador antes de publicar (aprovação do Victor)

Subir o build de produção local, de dentro de `site-mv/`: `npm run build` e depois `npm run start -- -p 3010` (ou a configuração `site-mv-prod` do `.claude/launch.json`). Abrir `http://localhost:3010`.

⚠️ Enviar o formulário em localhost **grava linha real na planilha do cliente** (`NEXT_PUBLIC_LEAD_ENDPOINT` ativa no `.env.local`). Nesta etapa, não enviar.

- [ ] **Home sem a tela da logo.** A página aparece direto; a navbar e o título descem e entram animados, sem piscar. (Voltar a abertura = `INTRO_ATIVA = true` em `src/lib/animation/introSignal.ts`.)
- [ ] **Vitrificação** (`/servicos/vitrificacao`): "R$ 2.200" na seção Quanto custa; "até 3 anos" no FAQ e no cartão "Proteção de até 3 anos" de Por que a MV. Ctrl+F: nenhum "1.800", nenhum "2 anos".
- [ ] **Higienização** (`/servicos/higienizacao-completa`): "A lavagem externa já vem inclusa." no hero; "com a parte externa inclusa" em Do volante ao carro inteiro; "A parte externa (lavagem externa) já está inclusa." no cartão de preço; resposta nova em "Dá pra fazer só a parte interna ou só a externa?".
- [ ] **Aviso de cookies** igual ao de antes ("Recusar" e "Aceitar"), só visual: qualquer botão fecha e não volta.
- [ ] **Polimento e home** sem mudança de conteúdo.

## Etapa 2 · Publicar (só com o "pode" do Victor)

De dentro de `site-mv/`, com a árvore limpa:

1. `git push origin main` (o GitHub **não** publica sozinho).
2. `vercel deploy --prod --yes` (CLI da Vercel, time Atlas / `workflow-atlas`, projeto `mv-oficial`).
3. Anotar o horário do deploy e o ID do deployment aqui: ______________________
4. Conferir que `www.mvesteticaautomotiva.com.br` aponta para o deployment novo (`vercel --scope workflow-atlas inspect www.mvesteticaautomotiva.com.br`).
5. [ ] Avisar o Davi com o horário (ele confere do lado da Meta).

## Etapa 3 · Conferência no ar (lista do LEIA-ME da Billion)

Fazer no **celular**, em **aba anônima**, **sem tocar no aviso de cookies**. Ver os eventos no Gerenciador de Eventos > **Testar eventos** (conjunto "MV Estética Automotiva - Site"), ou no Meta Pixel Helper no computador, ou na aba Rede (`fbevents.js` e `tr/?ev=PageView`).

- [ ] Abrir `https://www.mvesteticaautomotiva.com.br/servicos/vitrificacao`: a página aparece direto (sem tela escura com a logo) e o **PageView** chega sem tocar no aviso.
- [ ] Ir da home para a Higienização pelo card: **um PageView novo** por página.
- [ ] Tocar num botão de WhatsApp: chega **`Contact`** (não `Lead`). Decisão do Victor: o clique continua medido.
- [ ] **GA4 > Tempo real** mostra a visita, também sem tocar no aviso.
- [ ] Textos da Vitrificação e da Higienização como na etapa 1, agora no domínio real.
- [ ] Aviso de cookies aparece uma vez e some no toque; o Pixel já tinha carregado antes.
- [ ] Formulário com `?fbclid=teste` no endereço, nome identificado como TESTE: **`Lead` com `eventID`** em Testar eventos, e a **mesma linha na planilha com o `lead_id` igual** (Billion confirma).
- [ ] Se aparecer visita de `localhost` no conjunto da Meta, é teste local: desde esta rodada o Pixel carrega também em dev, sem esperar o aceite.

Alinhamento dos eventos da Meta com o agente: **o Victor vai olhar os eventos antes**, e a conversa sobre eles acontece depois.

## Etapa 4 · Depois do ar

- [ ] **Search Console:** pedir reindexação de `/servicos/vitrificacao` e `/servicos/higienizacao-completa` (preço, prazo e descrição mudaram, também nos dados estruturados).
- [ ] *(opcional)* **Teste de pesquisa aprimorada** do Google nas duas páginas: `Service` e `FAQPage` sem erro.
- [ ] **PageSpeed no domínio real**, home: Navegação agêntica deve dar **3/3** (era 2/3).
- [ ] **Celular de verdade:** passada rápida pela home e pelas três rotas de venda (até hoje só houve emulação).

## Etapa 5 · Pendências que não travam a publicação

- Sim ou não do Victor (de 09/10): "completa." sozinha na última linha do título de preço da Higienização no celular; título do hero do Polimento em quatro linhas no desktop.
- Material do Matheus: fotos de antes/depois (C17) e nota do Google em Por que a MV (C18).
- Política de privacidade completa (C12): pesa mais agora que o rastreamento não espera o aceite; entra na conversa da transferência do site para a Billion.
- Opcionais: `llms.txt` e descrição da home ainda dizem "higienização interna"; contraste do "©" no rodapé.
