# Plano de mudanças do site MV — pacote Billion (09/10/2026)

## Estado e ponto de retorno

- Projeto: `MV-OFICIAL/site-mv` (este diretório é a raiz Git; `MV-OFICIAL` não é).
- Branch de trabalho no início: `main`.
- Commit anterior ao registro deste plano: `c6a4461`.
- **Ponto de retorno local:** tag anotada `mv-baseline-2026-10-09`, criada no commit que registra este plano e as cinco alterações locais que já existiam antes da implementação do pacote.
- Essas cinco alterações estavam em `.gitignore`, `next.config.ts`, `src/app/globals.css`, `src/app/layout.tsx` e `src/components/layout/IntroReveal.tsx`. Elas fazem parte do estado inicial salvo; não são mudanças do pacote Billion.
- Para comparar o trabalho futuro com esta versão: `git diff mv-baseline-2026-10-09..HEAD`.
- Para consultar a versão sem modificar a branch: `git show mv-baseline-2026-10-09` ou criar uma nova worktree a partir da tag. Antes de restaurar arquivos ou desfazer commits, verificar as mudanças posteriores e escolher o método de retorno conforme o que precisa ser preservado.
- A tag e o commit são **locais** até que haja um envio explícito ao remoto.

## Fontes recebidas

- `D:\00-LEIA-ME.txt` — inventário e instruções do pacote.
- `D:\01-MUDANCAS-SITE-MV.pdf` e `.txt` — antes/depois das mudanças H, V, P, L e R.
- `D:\prototipo-completo.zip` — protótipo executável e assets.
- `D:\codigo-20261009T204334Z-1-001.zip` — 36 arquivos de código; conferidos como idênticos aos equivalentes do protótipo.
- `D:\assets-20261009T204335Z-1-001.zip` — quatro imagens novas; conferidas como idênticas às equivalentes do protótipo.
- `D:\prints-20261009T204333Z-1-001.zip` — 106 quadros: home e três serviços, desktop de 1440 px e celular de 390 px. Alguns quadros capturam animações em andamento.

As fontes externas em `D:\` são referência, não substituem o código deste repositório. O documento aqui resume o escopo para que o plano continue legível mesmo que os ZIPs saiam dessa unidade.

## Objetivo e limites

Atualizar a home e as rotas `/servicos/vitrificacao`, `/servicos/polimento` e `/servicos/higienizacao-completa`; criar um formulário compartilhado nessas três rotas; enviar os dados do lead à planilha da MV e abrir uma conversa no WhatsApp com mensagem preenchida. As páginas de bancos e estofados, limpeza de motor e cristalização de vidros permanecem fora desta etapa.

O protótipo é uma referência de resultado e comportamento. A integração deve preservar no projeto real o SEO, a indexação, o consentimento de analytics, o Pixel, as rotas existentes, as transições, o mapa e os componentes que não estão no escopo. O protótipo marca páginas como `noindex` e usa uma estrutura diferente de arquivos; portanto, copiar a aplicação inteira traria regressões.

## Ranking inicial

Prioridade considera impacto para o visitante e dependência para publicar. Dificuldade considera código, integração e teste. "Pronto" significa que o pacote traz material suficiente para começar após a decisão do Victor sobre a etapa; não significa copy ou publicação aprovadas.

| Ordem | Bloco | Mudanças | Prioridade | Dificuldade | Pode começar? | Dependência / risco |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Revisão de conteúdo e promessas | Todas as novas copies, preços e escopos | Crítica | Média | Sim, como revisão | Confirmar afirmações quantitativas ou absolutas antes de publicar. Preços de R$ 1.800, R$ 1.100 e R$ 800 constam no pacote como confirmados. |
| 2 | Home: hero | H1 | Alta | Baixa | Sim | Texto novo, pino de Simonésia e destaque azul; manter carro, fundo e CTA. Rever a frase negativa "Não somos lava-jato" pela régua de copy do projeto. |
| 3 | Home: ordem e navegação | H2 | Alta | Média | Sim | Mover Círculo + Serviços antes de Sobre; conferir animação sticky e âncoras em desktop e celular. |
| 4 | Home: cards | H3 | Alta | Média | Sim | Nova ordem, foto no topo, ícone, descrição e "Ver mais"; seis links continuam funcionais. |
| 5 | Base visual das páginas de serviço | V1–V7, P1–P6, L1–L6 | Alta | Alta | Sim, após mapear componentes atuais | Criar seções compartilhadas, alternância de fundos, heróis com foto, preços, dores e processo sem substituir a infraestrutura global. |
| 6 | Conteúdo das três rotas | V1–V8, P1–P6, L1–L6 | Alta | Média | Após base visual e revisão | Vitrificação acrescenta resultado com três fotos e FAQ novo; Polimento e Higienização preservam seus cases e FAQs, com reposicionamento. |
| 7 | Formulário compartilhado | V9 | Crítica | Alta | Após fechar política/fluxo | Quatro etapas; nome, WhatsApp, modelo e prazo; campo oculto de serviço e honeypot; mensagem do WhatsApp por rota. |
| 8 | Registro e mensuração do lead | R1 | Crítica | Alta | Após definir semântica do Lead | POST na planilha, UTMs, `fbclid`, `_fbp`, `_fbc`, `lead_id` e `eventID`; testar consentimento, falhas e deduplicação. |
| 9 | Configuração e validação final | R1 + conjunto | Crítica para publicar | Média | Após implementação | Variável `NEXT_PUBLIC_LEAD_ENDPOINT` em Preview/Production, testes de planilha e Meta, responsividade, acessibilidade, SEO e build. |

## Checklist de execução

Este é o controle operacional. A tabela acima mostra **prioridade e impacto**; a ordem abaixo começa pelo trabalho menor e deixa as integrações e decisões mais incertas para depois. Uma etapa concluída deve permanecer na lista como `- [x] ~~texto original da tarefa~~ — concluída em DD/MM/AAAA, commit <hash>; verificação: <resultado>`. Não apagar nem reescrever a tarefa para esconder seu escopo original. Marcar apenas quando a alteração e a verificação indicada estiverem feitas. Se houver uma decisão pendente, anotá-la no item sem marcá-lo.

### A. Preparação e alterações pontuais

- [x] ~~C00 · Guardar a versão inicial do site e o plano no Git local.~~ — concluída em 09/10/2026; commit `197a87d`, tag `mv-baseline-2026-10-09`; área de trabalho limpa após o registro.
- [x] ~~C01 · Conferir documento, código, assets e prints do pacote.~~ — concluída em 09/10/2026; os arquivos separados de código e assets coincidem com o protótipo, e os 106 prints cobrem as quatro páginas em desktop e celular. A avaliação crítica está registrada nas decisões abaixo.
- [ ] **C02 · Reordenar os trabalhos da Higienização (L4).** Dificuldade baixa; impacto limitado a uma rota. Vídeo da RAM Rampage primeiro, depois Chevrolet e Hilux. Verificar reel e lightbox.
- [ ] **C03 · Remover os cartões de categoria relacionada nas três rotas (V2/P2/L2).** Dificuldade baixa; conferir que os blocos de cobertura e cortesia continuam completos.
- [ ] **C04 · Atualizar o hero da home (H1).** Dificuldade baixa de código; inserir pino, título e apoio, mantendo carro, fundo e CTA. Verificar que "no mesmo lugar." não se divide e que a copy foi aprovada.
- [ ] **C05 · Atualizar os cards da home (H3).** Dificuldade média; ordem, ícones, foto, descrição, botão visual e seis links. Verificar em 390 px e 1440 px.
- [ ] **C06 · Mudar a ordem da home e do menu (H2).** Dificuldade média; mover Círculo + Serviços antes de Sobre. Verificar âncoras, animações sticky e transição claro/escuro em desktop e celular.

### B. Páginas de serviço

- [ ] **C07 · Revisar as novas copies e o escopo comercial das três rotas.** Dificuldade média; decisão de conteúdo. Validar números, absolutos, tratamento de faróis, proteção, custos e o que entra em cada preço antes de publicar. Registrar as aprovações no próprio item ou em seção vinculada.
- [ ] **C08 · Integrar o modelo visual compartilhado das páginas de serviço.** Dificuldade alta; preservar layout global, SEO, consentimento, Pixel, transições e rotas fora do escopo. Adaptar os imports de animação à dependência existente. Verificar o componente em mobile e desktop antes de replicar.
- [ ] **C09 · Montar Vitrificação (V1–V8).** Dificuldade média após C08; hero, dores, cobertura sem cross-link, processo, três resultados da SW4, preço, por que a MV e FAQ novo. Verificar imagens, textos e JSON-LD.
- [ ] **C10 · Montar Polimento (P1–P6).** Dificuldade média após C08; hero da SW4, dores, cobertura, processo, trabalhos, preço, por que a MV e FAQ preservado.
- [ ] **C11 · Montar Higienização completa (L1–L6).** Dificuldade média após C08; hero do console, dores, cobertura, processo, trabalhos na ordem de C02, preço, por que a MV e FAQ preservado.

### C. Formulário, decisões e integrações

- [ ] **C12 · Decidir a política de privacidade e o texto de uso de dados.** Dificuldade de código baixa, dependência de conteúdo/decisão. Necessário antes da publicação do formulário.
- [ ] **C13 · Decidir o significado do evento Meta `Lead`.** Dificuldade de decisão média. O site atual o usa nos cliques de WhatsApp; o pacote o reserva ao formulário. Definir a regra antes de alterar o Pixel.
- [ ] **C14 · Implementar o formulário de quatro etapas (V9).** Dificuldade alta; compartilhar entre as três rotas, validar nome/telefone/modelo/prazo, preservar respostas ao voltar, aplicar honeypot e gerar a mensagem correta para o WhatsApp. Resolver a regra de 10 ou 11 dígitos.
- [ ] **C15 · Integrar atribuição, planilha e Pixel (R1).** Dificuldade alta; capturar UTMs desde a página de entrada, enviar todos os campos mesmo vazios, respeitar o consentimento, usar o mesmo `lead_id` no Pixel e na planilha e seguir para WhatsApp após falha/tempo limite. Verificar registro real, pois `no-cors` não confirma sucesso.
- [ ] **C16 · Configurar Preview/Production e validar a entrega.** Dificuldade média, dependência externa; configurar `NEXT_PUBLIC_LEAD_ENDPOINT`, testar planilha e Gerenciador de Eventos com o mesmo ID, executar build/lint e conferir quatro páginas nas duas larguras de referência. Não importar `noindex` do protótipo.

### D. Itens futuros, fora desta entrega

- [ ] **C17 · Adicionar pares de antes/depois à seção Resultado quando o Matheus enviar as fotos.** Bloqueado por material futuro; não impede C09.
- [ ] **C18 · Avaliar nota do Google na seção Por que a MV, se o Matheus quiser exibi-la.** Opcional; não impede publicação.

### Mudanças pontuais que podem ser feitas separadamente

- H1: pino e textos da home, depois de revisar a copy.
- H3: ordem dos seis serviços e apresentação dos cards.
- L4: colocar o vídeo da RAM Rampage antes dos casos Chevrolet e Hilux.
- Retirar os cartões de "Categoria relacionada" nas três rotas, preservando a cobertura e as cortesias existentes.
- Preços, FAQ e textos de cada rota podem ser revistos em blocos antes da implementação visual.

### Trabalho que precisa ser integrado e testado junto

- H2 e suas animações/âncoras: mover seções muda o contexto de entrada do Círculo e de Serviços.
- Template compartilhado das três rotas: mudanças de CSS ou estrutura afetam as três páginas.
- Formulário + planilha + Pixel: a jornada só está completa quando os dados chegam ao destino certo e o evento Lead é contado uma vez conforme a regra aprovada.

## Escopo por página

### Home

- H1: novo título e apoio, pino "Simonésia – MG"; carro, fundo e botão "Avaliação gratuita" permanecem.
- H2: ordem final Hero → Posicionamento → Círculo (desktop) → Serviços → Quem somos → Processo → Depoimentos → Contato. Menu: Início, Serviços, Quem somos, Processo.
- H3: cards na ordem Vitrificação, Polimento, Higienização, Bancos, Motor e Vidros; foto superior, ícone azul, nome, descrição e botão visual "Ver mais". O card inteiro é o link.

### Vitrificação

- Hero com foto existente, pino, nova copy e âncora para `#avaliacao`.
- Sai o bloco de texto/fotos "Proteção que dura mais que uma cera" e o cartão de categoria relacionada.
- Entram Dores, Processo, Resultado (três fotos da SW4), Quanto custa (a partir de R$ 1.800) e Por que a MV.
- Cobertura e cortesia seguem; FAQ recebe cinco perguntas novas; formulário ao final.

### Polimento

- Hero com nova foto da SW4, pino, copy e âncora; saem o bloco de introdução atual e a categoria relacionada.
- Entram Dores, Processo, Quanto custa (a partir de R$ 1.100) e Por que a MV.
- Cobertura, trabalhos e perguntas continuam, em nova ordem; formulário ao final.

### Higienização completa

- Hero com foto do console, pino, copy e âncora; saem o bloco de introdução atual e a categoria relacionada.
- Entram Dores, Processo, Quanto custa (a partir de R$ 800) e Por que a MV.
- Cobertura e perguntas continuam; vídeo da RAM Rampage passa a ser o primeiro trabalho; formulário ao final.

### Formulário e rastreamento

- Etapas: nome (mínimo de 2 caracteres), WhatsApp com DDD, modelo do carro e intenção de prazo (esta semana / próximos 30 dias / pesquisando). Validar a entrada em cada etapa.
- Envio: gerar UUID `lead_id`; enviar dados e atribuição à planilha; disparar Meta `Lead` com o mesmo ID; abrir `wa.me/5533998463806` com nome, carro, serviço e prazo. O pacote especifica seguir para WhatsApp mesmo se a planilha não responder em 4 segundos.
- Os campos enviados incluem serviço, página, origem, UTMs, `fbclid`, `_fbp`, `_fbc`, `user_agent` e URL. A data/hora é gravada pela planilha.
- O projeto atual já dispara `Lead` nos cliques de links para WhatsApp em `src/components/analytics/MetaPixel.tsx`. O pacote pede `Lead` somente no envio do formulário. Resolver essa divergência antes de instrumentar o evento novo.
- O Pixel atual depende de consentimento; o formulário e a captura de dados devem seguir essa política. O `fetch` do protótipo usa `no-cors`, que não confirma sucesso da gravação; validar o registro real pela planilha.
- O protótipo importa de `motion/react`, enquanto este repositório usa `framer-motion`; adaptar os componentes sem adicionar dependência se essa continuar sendo a decisão.

## Decisões e materiais pendentes

1. **Destino deste plano:** confirmado pelo Victor em 09/10/2026: somente dentro da pasta/projeto MV.
2. **Política de privacidade:** o pacote traz uma frase curta e aponta a página/texto completo como pendente. Definir conteúdo e local antes de publicar o formulário.
3. **Critério do evento Lead:** decidir se os CTAs diretos de WhatsApp continuam como Lead ou se apenas o formulário o dispara, conforme R1. Registrar a regra para evitar duplicidade.
4. **Copy com afirmações fortes:** revisar antes de publicar, sobretudo "10 vezes mais espelhada", "100% protegido", "todo carro vale", "sem desgastar o verniz", prazos e escopo técnico. O documento atribui preços ao Matheus; verificar se o Victor mantém essa aprovação para publicação.
5. **Fotos de antes/depois:** aguardadas para expansão posterior da seção Resultado; não bloqueiam a primeira entrega.
6. **Nota do Google:** opcional e não necessária agora.
7. **Preço da Higienização:** esclarecer se o valor inicial de R$ 800 se refere ao interior, ao exterior ou ao conjunto. A página oferece as três opções.
8. **Formulário do protótipo:** a máscara sugere celular com 11 dígitos, mas aceita 10; a captura de UTMs só acontece quando o formulário monta, podendo perder a campanha de quem entra pela home; os campos opcionais sem valor não são enviados, embora o documento peça enviá-los vazios. Corrigir na integração.
9. **Rastreamento e confirmação de registro:** `no-cors` não permite saber pela resposta se a planilha gravou o lead. A verificação precisa consultar a planilha. O protótipo não inclui os componentes globais de analytics/consentimento do site atual e marca páginas como `noindex`.

## Critérios de conclusão da futura implementação

- As quatro páginas seguem a ordem e a composição dos prints em 390 px e 1440 px, respeitando os estados finais das animações.
- Os seis cards da home levam às seis rotas existentes; as três rotas fora do escopo continuam intactas.
- SEO e indexação de produção permanecem ativos; nenhuma configuração `noindex` do protótipo entra no site real.
- Nenhuma dependência é adicionada sem decisão explícita; build e lint passam.
- Formulário valida as quatro etapas, preserva dados ao voltar e gera a mensagem correta por serviço.
- Lead aparece na planilha com o mesmo ID do evento Meta; o comportamento com consentimento concedido ou negado é verificado.
- O WhatsApp abre mesmo quando o endpoint falha; falhas de registro são observáveis no teste de integração.

Este plano registra e classifica o trabalho. Ele **não** autoriza, por si só, substituir o site ou publicar as novas copies; cada bloco será executado conforme a direção do Victor.
