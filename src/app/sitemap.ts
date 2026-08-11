import type { MetadataRoute } from "next";
import { servicos } from "@/content";
import { siteUrl } from "@/lib/seo";

/**
 * Sitemap: home + as 6 rotas de categoria `/servicos/[slug]` (2026-07-18).
 * Fase 2: se surgirem páginas reais (Política/Termos, blog), adicionar aqui.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
    },
    ...servicos.map((s) => ({
      url: `${siteUrl}/servicos/${s.slug}`,
    })),
  ];
}
