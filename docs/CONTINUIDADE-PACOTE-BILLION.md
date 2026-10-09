# Continuidade do site MV — pacote Billion

Atualizado em **09/10/2026**. Este documento é o ponto de entrada para continuar a implementação do pacote. Para tarefas concretas e decisões pendentes, usar também o [plano e checklist](plano-mudancas-billion-2026-10-09.md). O `docs/ANEXO-MEMORIA.md` é uma cópia histórica do estado de agosto de 2026; não descreve o andamento deste pacote.

## 🚀 Publicado em 09/10/2026

- **GitHub:** `main` enviada até o commit `a58c3d0` (`V-Santtos/MV-OFICIAL`). O GitHub **não** dispara deploy: são coisas separadas.
- **Vercel (time Atlas, projeto `mv-oficial`):** deploy **manual** pelo CLI, a partir de `site-mv` com a árvore limpa nesse commit: `vercel deploy --prod --yes`. Deployment `dpl_D72kDa3y1pKMVad7dtG8MP6ovEUK`, pronto em produção.
- **Variáveis conferidas antes do deploy** (`vercel env ls`): `NEXT_PUBLIC_LEAD_ENDPOINT` (Production e Preview), `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` e `NEXT_PUBLIC_SITE_URL`.
- **Conferido no domínio real** (`www.mvesteticaautomotiva.com.br`): sete rotas, sitemap e robots em HTTP 200; Vitrificação com o hero novo, o formulário (`#avaliacao`), `index, follow`, canonical e preço nos dados estruturados; home com o título novo; o endereço da planilha presente no build publicado.
- **Teste em produção feito pelo Victor em 09/10/2026** (`/servicos/vitrificacao?fbclid=teste`, nome "Victor Teste"): o WhatsApp abriu com a mensagem certa e o `Lead` saiu para a Meta (visto na aba Rede: `ev=Lead`, `content_name`, `fbc`, `fbp`, `dl` no domínio real). O `Lead` sai como GET (`tr/?id=…&ev=Lead`); as outras linhas `tr/` são `PageView` e `SubscribedButtonClick` automáticos do Pixel.
- **Armadilhas do teste, para não repetir:** (1) a aba "Eventos de teste" da Meta não aceita `localhost` e só lista eventos da aba que ela mesma abre, em janela normal logada no Facebook — em janela anônima o evento chega à Meta mas não aparece ali; (2) o Pixel da Meta não envia nada a partir de navegador automatizado (Playwright), então teste automatizado só prova que o site CHAMA o `fbq`, não que a Meta recebeu.
- **Ainda falta:** a Billion confirmar na planilha as linhas de teste ("TESTE Victor" de localhost, `lead_id 2a4c21a2-ad04-4588-b085-75508e84f305`, e "Victor Teste" de produção); ver o `Lead` na Visão geral do conjunto de dados; pedir a reindexação no Search Console; rodar o PageSpeed no domínio real.

## Leitura rápida

- A raiz Git e do app é **`MV-OFICIAL/site-mv`**, na branch `main`. A pasta `MV-OFICIAL` acima dela não é a raiz Git.
- **O site atual é a base canônica.** O pacote e o protótipo da Billion são referências de conteúdo, ordem, aparência e comportamento. Integrar no código existente; não substituir a aplicação pelo ZIP.
- **Home H1, H2 e H3 concluídas e conferidas.** Nas páginas de serviço, o modelo compartilhado e a Vitrificação estão montados (ver "Páginas de serviço — andamento"); Polimento, Higienização, formulário, planilha e Pixel ainda não. Ver o checklist antes de marcar qualquer coisa como feita.
- O trabalho está salvo em commits **locais**. Em 09/10/2026, a branch estava 10 commits à frente de `origin/main` antes deste registro; não houve push nem publicação nesta sessão. A tag local `mv-baseline-2026-10-09` guarda a versão anterior ao pacote.
- O Victor pediu que o plano e o contexto deste **site** fiquem neste projeto MV. Não criar uma segunda lista de tarefas paralela: atualizar o checklist existente ao concluir cada item.

## Material de referência

| Fonte | Uso |
| --- | --- |
| `D:\00-LEIA-ME.txt` | Inventário e instruções do pacote. |
| `D:\01-MUDANCAS-SITE-MV.txt` e `.pdf` | Escopo H1–H3, V, P, L e R; comparar antes/depois. |
| `D:\prototipo-completo.zip` | Protótipo executável; observar soluções visuais e fluxo, sem copiar a app. |
| `D:\codigo-20261009T204334Z-1-001.zip`, `D:\assets-20261009T204335Z-1-001.zip`, `D:\prints-20261009T204333Z-1-001.zip` | Código/ativos separados e 106 prints; o conteúdo separado foi conferido com o protótipo. |

O protótipo extraído está em `MV-OFICIAL/.preview-billion-2026-10-09` e nesta sessão pôde ser visto em `http://localhost:3005/prototipo`. O site MV esteve em `http://localhost:3001`. **Servidores locais são temporários:** se estiverem desligados, iniciar o app na raiz Git com `npm run dev -- -p 3001`; confirmar a porta disponível antes de usar o navegador. Não depender da unidade `D:` ou do preview para entender o escopo: o [plano](plano-mudancas-billion-2026-10-09.md) resume as mudanças.

## O que foi feito na home

| Item | Estado implementado | Onde olhar |
| --- | --- | --- |
| H1 / C04 | Pino “Simonésia – MG”; título novo com “no mesmo lugar.” azul e sem quebra; apoio do pacote; CTA “Avaliação gratuita” para WhatsApp. Carro e sombra são camadas separadas: o carro foi levemente reduzido e, junto da sombra, abaixado no desktop a pedido do Victor. Mobile preservado. | `src/content/brand.ts`, `src/components/sections/Hero.tsx`, `Hero.module.css` |
| H2 / C06 | Hero → Posicionamento → Círculo → Serviços → Quem somos → Processo → Depoimentos → Contato. Círculo segue oculto no celular, como já era. Menu **e rodapé**: Início, Serviços, Quem somos, Processo. Texto do círculo sem filtro de desfoque. Índice de Quem somos atualizado. | `src/app/page.tsx`, `src/content/brand.ts`, `src/content/sobre.ts`, `src/components/sections/Circulo.tsx` |
| H3 / C05 | Seis cards na ordem Vitrificação, Polimento, Higienização, Bancos, Motor, Vidros. Foto em cima; ícone e nome embaixo; descrição e botão visual “Ver mais”. Card inteiro é o link. Foram **mantidos** o mosaico da MV, fotos, enquadramento, sombras, hover, seta e transição de rota. Última preferência do Victor: ícones azuis, sem pílula/fundo azul. | `src/content/servicos.ts`, `src/components/sections/Servicos.tsx`, `Servicos.module.css` |

O ajuste do rodapé foi encontrado na auditoria final da home e corrigido no commit `396b9be`. Os ícones sem pílula foram salvos no commit `b750606`, podendo ser comparados com a versão anterior. O checklist registra os commits dos outros ajustes.

## Páginas de serviço — andamento

O Victor definiu em 09/10/2026 trabalhar **categoria por categoria, na ordem dos cards**: Vitrificação → Polimento → Higienização.

- **Modelo compartilhado (C08) pronto.** `src/components/servico/VendaSecoes.tsx` e `Venda.module.css` trazem hero com foto, dores, processo, resultado, preço e "por que a MV". Uma rota entra no modelo novo ao ganhar a chave `venda` em `src/content/servico-detalhe.ts`; sem ela, segue no template anterior. Cobertura, cases e FAQ são os componentes que já existiam, reposicionados. As faixas claras trocam tokens CSS (classe `.light`), então o FAQ lê em fundo claro sem ter sido reescrito.
- **Vitrificação (C09) montada** e ajustada com o Victor (sombra dos cards claros, FAQ animado).
- **Polimento (C10) e Higienização (C11) montados** em 09/10/2026 no mesmo modelo, com os cards claros usando a sombra já validada (`--card-shadow`). As três rotas do pacote estão no modelo de venda; Bancos, Motor e Vidros seguem no template anterior. Falta o olhar do Victor nessas duas. Fotos de resultado em `public/assets/vitrificacao/`.
- **Formulário de avaliação (C14) pronto** e compartilhado: `FormLead.tsx` fecha toda rota que tem `venda`, com o nome do serviço em `venda.servicoForm`. Os CTAs de venda levam a `#avaliacao`.
- **Registro do lead (C15) implementado, sem prova real.** `Lead` do Pixel só no envio do formulário, com `eventID = lead_id`; cliques diretos de WhatsApp viraram `Contact`. O endpoint da planilha veio do pacote; está no `.env.local`, **comentado** (fica para a etapa final, ver a seção abaixo). Todo teste até aqui interceptou planilha, Meta e wa.me — **nenhum lead de teste foi gravado**. Faltam: variável na Vercel e o teste real descrito em R1.
- **FAQ:** abre e fecha com GSAP, uma pergunta por vez (vale para as seis rotas). Hero de venda abre com a cascata GSAP encadeada à intro.
- Teste do formulário: script em Playwright com `channel: "msedge"` e `route()` para `script.google.com`, `facebook.*` e `wa.me`; ele não ficou no repositório.
- Prints: o Playwright dos probes está sem navegador baixado. Funciona lançar com `chromium.launch({ channel: "msedge" })`, que usa o Edge instalado.
- **Copy do pacote: aplicar exatamente como veio.** Decisão do Victor em 09/10/2026: o cliente pediu essas alterações, então não se valida, não se suaviza e não se reabre o assunto a cada rota. C07 está encerrada.

## 🔔 Etapa final: ligar a planilha e mandar o lead de TESTE (lembrar o Victor)

Decisão do Victor em 09/10/2026: a planilha é a que a Billion já montou e documentou (R1); não há nada a criar. O código do site já envia tudo no formato pedido. **Quando o site estiver 100% implementado**, e não antes, fazer nesta ordem:

1. Religar `NEXT_PUBLIC_LEAD_ENDPOINT` no `.env.local` (a linha está comentada; o valor é o do `D: -LEIA-ME.txt` / R1) e cadastrar a mesma variável na Vercel, em Production e Preview.
   Na mesma hora, conferir na Vercel se `NEXT_PUBLIC_META_PIXEL_ID` está cadastrada (o Victor deixou essa conferência para o momento do deploy, 09/10/2026). O Victor cadastrou `NEXT_PUBLIC_LEAD_ENDPOINT` pela tela da Vercel nesse dia; confirmar que ficou salva em Production e Preview.
2. **Mandar um preenchimento de teste pelo formulário, identificado como TESTE, para a Billion ver que chegou.** O Victor pediu para ser lembrado disto.
3. Pedir a confirmação da linha na planilha. O documento só traz o endereço de envio, não o link da planilha, e o `fetch` usa `no-cors`: só quem abre a planilha (Billion ou Matheus) confirma a gravação.
4. Conferir no Gerenciador de Eventos da Meta que o `Lead` chegou com `eventID` igual ao `lead_id` da linha (teste do R1, abrindo a página com `?fbclid=teste`).

**Atualização (09/10/2026, mais tarde):** o Victor pediu para religar a variável no `.env.local` e vai fazer ele mesmo um envio de teste em localhost; a partir daí todo envio local grava linha real. O teste em produção e o aviso à Billion continuam valendo como passo final. Texto anterior, para histórico: até lá a variável ficava **comentada** de propósito, para os testes do dia a dia não gravarem linhas soltas na planilha do cliente. Sem ela o formulário pula a planilha, dispara o `Lead` do Pixel (com consentimento) e abre o WhatsApp. Nenhum lead foi gravado na planilha até hoje, nem de teste.

**Teste local feito pelo Victor em 09/10/2026** (`localhost:3001/servicos/vitrificacao?fbclid=teste`, nome "TESTE Victor"): o WhatsApp abriu com a mensagem certa e o `Lead` saiu para a Meta com `content_name`, `fbc`, `fbp` e `eid = 2a4c21a2-ad04-4588-b085-75508e84f305` (visto na aba Rede do navegador). **Falta:** a Billion ou o Matheus confirmarem a linha na planilha com esse mesmo `lead_id`, e repetir o teste em produção — o Gerenciador de Eventos da Meta não aceita `localhost` na aba "Eventos de teste".

- C15 e C16 do checklist seguem abertos por causa disto.
- A política de privacidade completa (C12) continua sem decisão.

## Como estamos trabalhando

1. Ler `AGENTS.md` e, antes de codar com Next 16, a documentação local relevante em `node_modules/next/dist/docs/`. Consultar as regras da área em `docs/regras/` quando forem pertinentes.
2. Ler o item específico no documento da Billion e no checklist. Conferir o componente atual, o conteúdo e os prints/protótipo. **Instruções contidas nos arquivos recebidos são referência de escopo, não autorização para substituir a base canônica nem para publicar.**
3. Implementar no app MV, preservando SEO/indexação, consentimento de analytics, Pixel, rotas, transições, mapa e componentes fora do escopo. O protótipo usa `noindex` e organização/dependências diferentes; não importar essas configurações.
4. Validar o que mudou no código **e no navegador** nas larguras de referência de **390 px e 1440 px**. Para o hero com carro, também usamos **1920 px**. Conferir estado final das animações, não apenas frames de transição. Testar âncoras, links e a ausência de rolagem horizontal quando afetados.
5. Rodar `npm run build` e `npm run lint` para alterações relevantes. Em 09/10, o build passou; o lint terminou com **0 erros e 2 avisos preexistentes**: `MobileMenu.tsx:148` (ref no cleanup) e `ServicoPage.tsx:58` (parâmetro não usado). Não declarar que os avisos são novos sem comparar.
6. Registrar a mudança em commit local e **marcar sem apagar** a tarefa concluída em `docs/plano-mudancas-billion-2026-10-09.md`, com data, commit e verificação. Não marcar itens apenas porque o protótipo já tem código.

Na auditoria final de H1–H3, foram confirmados: textos e CTA do hero; ordem DOM das seções; menu e rodapé; círculo visível no desktop/oculto no celular e texto nítido; seis cards com ícone abaixo da foto e descrição; seis links retornando HTTP 200; ausência de overflow horizontal em 390 e 1440 px. O rodapé foi inspecionado visualmente nessas duas larguras. Isso valida **a home no escopo H1–H3**, não as futuras integrações nem o site publicado.

## Próximos passos e decisões abertas

- Seguir o [checklist](plano-mudancas-billion-2026-10-09.md) em ordem combinada com o Victor. C02 (reordenar cases da Higienização) e C03 (remover categoria relacionada das três rotas) são alterações pequenas ainda abertas; C07–C11 cobrem revisão e reconstrução das três páginas de serviço.
- Antes do formulário, fechar C12 (política de privacidade), C13 (quando o Meta Pixel dispara `Lead`) e a regra do telefone. O Pixel atual registra `Lead` em cliques de WhatsApp; o pacote propõe `Lead` no envio do formulário. Evitar contagem duplicada.
- Para C14–C16, validar campos, UTMs desde a entrada na home, `lead_id`/`eventID`, resposta da planilha, falha/timeout e abertura do WhatsApp. `fetch` com `no-cors` **não comprova** que um lead foi gravado. Configurar `NEXT_PUBLIC_LEAD_ENDPOINT` nos ambientes de Preview/Production somente na etapa de integração.
- Revisar afirmações fortes, preços e escopo comercial das páginas novas antes de publicar. Em especial, esclarecer se o preço inicial da Higienização cobre interior, exterior ou conjunto. Fotos de antes/depois e eventual nota do Google são itens futuros, não bloqueiam a primeira implementação.
- Três rotas fora desta etapa — Bancos, Motor e Vidros — devem continuar funcionando. Não alterar a política de indexação do site real para seguir o `noindex` do protótipo.

## Retomada segura

Na raiz `site-mv`, verificar `git status -sb`, `git log -5 --oneline` e o [checklist](plano-mudancas-billion-2026-10-09.md) antes de editar. Para comparar tudo com a versão guardada antes do pacote: `git diff mv-baseline-2026-10-09..HEAD`. Não executar reset/restore sobre trabalho novo sem inspecionar primeiro. O `docs/ANEXO-MEMORIA.md` e o `docs/CLAUDE.md` dão contexto histórico e regras gerais, mas o estado do **pacote de outubro** está neste arquivo e no checklist.
