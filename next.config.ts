import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Fixa a raiz do workspace nesta pasta. Sem isso, o Next detecta um
  // package-lock.json perdido em C:\Users\victo e infere o root errado.
  turbopack: {
    root: path.resolve(__dirname),
  },

  // 🚫 NÃO reativar `experimental.inlineCss` (testado e revertido, 2026-08-04).
  // Ele de fato tira os 3 <link rel=stylesheet> render-blocking do caminho
  // crítico (750ms), MAS QUEBRA as rotas /servicos/[slug]: o hero renderiza
  // vazio (título e subtítulo ficam no HTML, invisíveis — a animação de entrada
  // nunca dispara). Isolado com probe: `false` → hero aparece, `true` → some.
  // A home não é afetada, então só se vê o defeito conferindo uma rota.

  // Rota renomeada (Victor, 2026-08-03): "Higienização Interna" virou
  // "Completa". Redirect permanente pra não perder o que já foi indexado.
  async redirects() {
    return [
      {
        source: "/servicos/higienizacao-interna",
        destination: "/servicos/higienizacao-completa",
        permanent: true,
      },
    ];
  },

  images: {
    // Formatos modernos servidos pelo otimizador do next/image.
    formats: ["image/avif", "image/webp"],
    // Fase 2: a galeria troca os placeholders do Unsplash por fotos REAIS
    // do cliente (locais). Quando isso acontecer, remover este remotePattern.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
