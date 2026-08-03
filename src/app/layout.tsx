import type { Metadata, Viewport } from "next";
import { Inter, Birthstone } from "next/font/google";
import {
  Navbar,
  Footer,
  IntroReveal,
  SmoothScroll,
  RouteTransitionProvider,
} from "@/components/layout";
import { brand } from "@/content";
import { siteConfig, siteUrl, localBusinessJsonLd } from "@/lib/seo";
import "./globals.css";

/** Fonte do projeto — Inter (referência MAX COLOR). Variável, cobre todos os pesos. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Fonte script — Birthstone (Robert Leuschke). Uso PONTUAL: só os marquees
 *  (Sobre, Círculo, Footer), todos ABAIXO da dobra (Victor, 2026-07-17).
 *  `preload: false` (2026-08-03): o preload punha 23 KiB no caminho crítico do
 *  1º paint por uma fonte que nada acima da dobra usa. Sem ele, a fonte baixa
 *  quando o CSS a referencia — antes de qualquer marquee entrar em cena. */
const birthstone = Birthstone({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
  preload: false,
});

/**
 * SEO completo desde o dia 1 (decisão travada no CLAUDE.md).
 * OG image é gerada por `app/opengraph-image.tsx` (Next injeta og/twitter image).
 * Fontes (Syncopate/Inter via next/font) seguem sendo Fase 2 → hoje, fallback.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s — ${brand.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: brand.name,
  authors: [{ name: brand.name }],
  creator: brand.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteUrl,
    siteName: brand.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/**
 * `viewportFit: "cover"` é OBRIGATÓRIO no iPhone: sem ele o Safari NÃO estende a
 * página atrás da status bar/Dynamic Island — a faixa do sistema fica com o
 * fundo do site (#1C1C1C), lida como uma "barra preta" no topo (Victor viu no
 * 14 Pro real, 2026-07-24). Com o cover a página vai edge-to-edge (o glow do
 * Hero sobe até o topo) E o `env(safe-area-inset-top)` passa a valer de verdade,
 * que é o que a Navbar usa pra assentar a logo logo abaixo do relógio.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: o script inline abaixo carimba `data-intro-done`
    // no <html> ANTES da hidratação, então o atributo existe no cliente e não no
    // HTML do servidor. É o mesmo padrão dos scripts anti-flash de tema.
    // Silencia só os ATRIBUTOS deste elemento — não mascara erro de componente.
    <html
      lang="pt-BR"
      className={`${inter.variable} ${birthstone.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: extensões de navegador (ex.: ColorZilla →
          `cz-shortcut-listen`) injetam atributos no <body> antes da hidratação,
          gerando um mismatch falso-positivo. Silencia SÓ os atributos deste
          elemento (1 nível) — não mascara erros reais dos componentes. */}
      <body className="min-h-full" suppressHydrationWarning>
        {/* ❌ BOOT SKELETON AZUL REMOVIDO (Victor, 2026-08-03). Existia um
            painel fixo (#__boot) que pintava o azul do Hero na 1ª pintura só
            pra o Safari iOS amostrar a status bar em azul. Decisão: NÃO forçar
            mais o azul — a barra fica com o default do sistema. O sumiço desse
            painel (2 rAFs após o paint) era o provável causador do "flick azul"
            que estava aberto em regras/mobile.md. Regra que segue valendo:
            NUNCA setar theme-color. */}
        {/* Script de PRÉ-PAINT. Inline e síncrono de propósito: um componente
            client chegaria depois do primeiro paint, quando o estrago já é
            visível. Faz três coisas:

            1. `scrollRestoration = manual` — o Chrome devolve a posição de
               rolagem no reload, o que numa página única com abertura significa
               recarregar no meio do site.
            2. Tira o HASH quando a navegação é RELOAD. Um clique em "Contato"
               deixa `/#contato` na URL; recarregar depois abre direto na seção
               errada (Victor, 2026-07-22). Em navegação normal o hash é
               PRESERVADO — link compartilhado e âncora vinda de `/servicos/...`
               continuam funcionando.
            3. Carimba `data-intro-done` se a intro já tocou nesta aba; o
               `globals.css` usa isso pra esconder a cortina antes do 1º paint.
               Par: `IntroReveal`. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if('scrollRestoration' in history)history.scrollRestoration='manual';var n=performance.getEntriesByType('navigation')[0];if(n&&n.type==='reload'&&location.hash)history.replaceState(null,'',location.pathname+location.search);if(sessionStorage.getItem('mv:intro-played')==='1')document.documentElement.setAttribute('data-intro-done','')}catch(e){}`,
          }}
        />
        <SmoothScroll />
        <IntroReveal />
        {/* Cortina de troca de ROTA (a logo se desenhando, como na abertura).
            Envolve Navbar/main/Footer porque quem dispara mora nos dois: os
            cards do mosaico (dentro de `main`) e a logo/"Início" da Navbar.
            Navbar, `children` e Footer continuam renderizando no SERVER — o JSX
            é montado aqui, num Server Component, e chega ao provider como
            `children` (não vira client por estar dentro de um). */}
        <RouteTransitionProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </RouteTransitionProvider>
        <script
          type="application/ld+json"
          // JSON-LD LocalBusiness (Simonésia-MG). Conteúdo controlado, sem input de usuário.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
      </body>
    </html>
  );
}
