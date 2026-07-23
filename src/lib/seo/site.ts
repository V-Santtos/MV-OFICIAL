/**
 * Constantes de SEO/site — fonte única de URL, locale e defaults de metadata.
 *
 * ⚠️ `siteUrl` é PROVISÓRIO até o domínio real ser definido (Passo 7 / Vercel).
 * Em produção, sobrescreva com a env `NEXT_PUBLIC_SITE_URL`.
 */

import { brand } from "@/content";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mvesteticaautomotiva.com.br"
).replace(/\/$/, "");

export const siteConfig = {
  name: brand.name,
  /** Título usado como fallback e sufixo de marca. */
  title: `${brand.name} — Estética Automotiva em ${brand.location}`,
  description:
    "Estética automotiva premium em Simonésia, MG: polimento técnico, vitrificação, higienização interna, limpeza de motor e restauração de faróis. Cuidado que vai além da estética.",
  locale: "pt_BR",
  /** Palavras-chave de apoio (peso baixo em ranking, mas úteis p/ contexto). */
  keywords: [
    "estética automotiva",
    "polimento automotivo",
    "vitrificação",
    "higienização interna",
    "limpeza de motor",
    "restauração de faróis",
    "detalhamento automotivo",
    "Simonésia",
    "Minas Gerais",
  ],
} as const;
