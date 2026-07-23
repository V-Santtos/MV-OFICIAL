/**
 * Dados estruturados JSON-LD (schema.org) — negócio local.
 *
 * Tipo `AutoWash` (subtipo de LocalBusiness) é o mais próximo de estética/
 * detalhamento automotivo. Ajuda rich results e mecanismos de busca por IA.
 *
 * ⚠️ Regra: só entra o que é VERDADEIRO hoje. Dado fabricado prejudica mais
 * que ajuda.
 *   - ✅ Endereço, CEP e `geo` EXATOS desde 2026-07-22 (ficha do Google da MV).
 *   - `telephone`: (33) 99846-3806 apareceu na ficha, mas o Victor ainda não
 *     confirmou → OMITIDO até confirmar.
 *   - `sameAs`: perfis sociais ainda genéricos, sem handle → omitido.
 *   - `openingHours`: a ficha mostra "Fecha 18:00", mas não temos a semana
 *     inteira → omitido.
 *   - 🚫 **`aggregateRating` NÃO entra.** A MV tem 5,0 com 5 avaliações reais no
 *     Google, mas as diretrizes de rich results proíbem marcação de avaliação
 *     "autosservida" (o próprio negócio publicando a própria nota) para
 *     LocalBusiness. Marcar isso arrisca penalidade manual, não ganha estrela.
 */

import { brand, contact, positioning, servicos } from "@/content";
import type { Servico, FaqItem } from "@/content";
import { siteConfig, siteUrl } from "./site";

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoWash",
    "@id": `${siteUrl}/#business`,
    name: brand.name,
    description: siteConfig.description,
    url: siteUrl,
    image: `${siteUrl}/logo.png`,
    logo: `${siteUrl}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "R. Padre Horácio Rentis",
      addressLocality: brand.city,
      addressRegion: brand.state,
      postalCode: "36930-000",
      addressCountry: "BR",
    },
    // Coordenadas EXATAS da ficha do Google (2026-07-22) — antes eram do centro
    // do município. Endereço + geo precisos são o que sustenta busca local.
    geo: {
      "@type": "GeoCoordinates",
      latitude: -20.1281816,
      longitude: -42.0014907,
    },
    // Aponta a ficha real: ajuda o buscador a casar o site com o perfil do
    // Google Business, que é onde moram avaliações, fotos e horário.
    hasMap: contact.mapsPlaceUrl,
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${brand.city} e região, ${brand.state}`,
    },
    founder: {
      "@type": "Person",
      name: positioning.founder.name,
    },
    knowsAbout: servicos.map((s) => s.title),
    makesOffer: servicos.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        description: s.desc,
      },
    })),
  };
}

/**
 * JSON-LD da PÁGINA de um serviço (`/servicos/[slug]`): `Service` provido pelo
 * negócio local (referência via `@id` — não duplica o LocalBusiness inteiro,
 * que já sai no layout raiz).
 */
export function servicoJsonLd(servico: Servico) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: servico.title,
    description: servico.desc,
    url: `${siteUrl}/servicos/${servico.slug}`,
    image: `${siteUrl}${servico.image}`,
    serviceType: servico.title,
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${brand.city} e região, ${brand.state}`,
    },
  };
}

/** FAQPage — rich result das perguntas frequentes da página do serviço. */
export function faqJsonLd(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
