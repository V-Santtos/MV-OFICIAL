import type { MetadataRoute } from "next";
import { servicos } from "@/content";
import { siteUrl } from "@/lib/seo";

/**
 * Sitemap: home + as 6 rotas de categoria `/servicos/[slug]` (2026-07-18).
 * Fase 2: se surgirem páginas reais (Política/Termos, blog), adicionar aqui.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...servicos.map((s) => ({
      url: `${siteUrl}/servicos/${s.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
