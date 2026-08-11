# Google: configuração externa

O código do site já gera `robots.txt`, `sitemap.xml`, `llms.txt`, metadata por
rota e dados estruturados. Este arquivo registra apenas as etapas que dependem
das contas do Google e do DNS do domínio.

## Variáveis de ambiente

Copiar os nomes de `.env.example` para o ambiente de produção:

- `NEXT_PUBLIC_SITE_URL`: domínio canônico, com `https://` e sem barra final.
- `GOOGLE_SITE_VERIFICATION`: token da meta tag, somente se a verificação por
  DNS não for usada.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: ID `G-...` do fluxo Web do GA4.

## Search Console

1. Criar uma propriedade de domínio sem protocolo e sem `www`.
2. Adicionar ao DNS o registro TXT entregue pelo Search Console.
3. Manter o registro TXT depois da verificação.
4. Enviar `https://DOMINIO/sitemap.xml` no relatório de sitemaps.
5. Inspecionar a home e as seis rotas de serviço.
6. Vincular a propriedade do Search Console ao fluxo Web do GA4.

## Google Analytics 4

A integração está no componente `GoogleAnalytics.tsx` e mede, depois do
consentimento:

- `page_view`: visualização de rota pela Métrica otimizada do GA4;
- `generate_lead`: clique para o WhatsApp;
- `phone_click`: clique em link telefônico;
- `map_click`: abertura do Google Maps;
- `service_open`: abertura de uma página de serviço;
- `case_open`: abertura de um case;
- Web Vitals (`LCP`, `CLS`, `INP` e demais métricas fornecidas pelo Next.js).

O script não é carregado durante o desenvolvimento nem antes do consentimento.
O aviso de privacidade grava a decisão no `localStorage`: `granted` ativa a
medição e `denied` mantém o Analytics desligado. Sinais de privacidade do
navegador, como Global Privacy Control e Do Not Track, também impedem a coleta.

## Validação depois do deploy

- Abrir `/robots.txt`, `/sitemap.xml` e `/llms.txt` no domínio final.
- Conferir a propriedade em Search Console > Inspeção de URL.
- Testar o ID no relatório Tempo real do GA4 depois de conceder consentimento.
- Validar os dados estruturados no Rich Results Test do Google.

## Estado validado em 11 de agosto de 2026

- A propriedade de domínio do Search Console foi verificada por DNS no Registro.br.
  Manter o registro TXT de verificação ativo.
- O sitemap enviado é `https://www.mvesteticaautomotiva.com.br/sitemap.xml` e
  já foi processado pelo Search Console.
- O ID do GA4 está configurado como variável de ambiente de produção na Vercel;
  não registrar esse valor no repositório. A coleta só começa após o visitante
  aceitar o aviso de privacidade.
- Linha de base no Lighthouse mobile, antes deste deploy: Performance 96,
  Acessibilidade 93, Boas práticas 100 e SEO 100. Métricas observadas: FCP
  1,1 s, LCP 2,7 s, TBT 30 ms e CLS 0.
- Ao adicionar cases, preservar essa linha de base: comprimir fotos em WebP ou
  AVIF, carregar mídias fora da dobra de forma adiada e não iniciar vídeos
  pesados automaticamente. Rodar Lighthouse antes de publicar lotes maiores.
