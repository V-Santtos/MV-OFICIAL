import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/**
 * robots.txt. Tudo indexável (site institucional). Não bloqueamos crawlers de
 * IA (OAI-SearchBot, PerplexityBot, ClaudeBot, etc.) — cada bloqueio remove o
 * site das citações daquele buscador.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
