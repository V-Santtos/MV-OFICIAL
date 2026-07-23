import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Fixa a raiz do workspace nesta pasta. Sem isso, o Next detecta um
  // package-lock.json perdido em C:\Users\victo e infere o root errado.
  turbopack: {
    root: path.resolve(__dirname),
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
