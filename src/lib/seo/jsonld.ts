/**
 * Dados estruturados JSON-LD (schema.org) — negócio local.
 *
 * Tipo `AutoWash` (subtipo de LocalBusiness) é o mais próximo de estética/
 * detalhamento automotivo. Ajuda rich results e mecanismos de busca por IA.
 *
 * ⚠️ Regra: só entra o que é VERDADEIRO hoje. Dado fabricado prejudica mais
 * que ajuda.
 *   - ✅ Endereço, CEP e `geo` EXATOS desde 2026-07-22 (ficha do Google da MV).
 *   - ✅ `telephone`: (33) 99846-3806 — **CONFIRMADO pelo Victor em 2026-08-03**,
 *     entrou no schema. Vive em `contact.phoneE164` (fonte única com o `wa.me`).
 *   - `sameAs`: perfis sociais ainda genéricos, sem handle → omitido.
 *   - `openingHours`: a ficha mostra "Fecha 18:00", mas não temos a semana
 *     inteira → omitido.
 *   - 🚫 **`aggregateRating` NÃO entra.** A MV tem 5,0 com 5 avaliações reais no
 *     Google, mas as diretrizes de rich results proíbem marcação de avaliação
 *     "autosservida" (o próprio negócio publicando a própria nota) para
 *     LocalBusiness. Marcar isso arrisca penalidade manual, não ganha estrela.
 */

import { brand, contact, positioning, servicos, socialLinks } from "@/content";
import type { Servico, FaqItem, CobreItem } from "@/content";
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
    // Confirmado 2026-08-03. E.164 é o formato que o schema.org espera; a mesma
    // constante alimenta o link do WhatsApp, então não há como divergirem.
    telephone: contact.phoneE164,
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
    sameAs: socialLinks.map(({ href }) => href),
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
export function servicoJsonLd(
  servico: Servico,
  /**
   * Sub-serviços da categoria (os itens do "O que cobre"). Quando existem, viram
   * um `OfferCatalog`: sem isso o buscador só sabe o NOME da categoria, e passa
   * a saber que "Polimento" cobre faróis, oxidação e refino. Nenhum dado novo é
   * inventado — é o conteúdo que já está na página, declarado em schema.
   */
  cobre?: readonly CobreItem[],
  /** Descrição de SERP da rota; sem ela, cai no texto do card do mosaico. */
  description?: string,
  /**
   * Preço "a partir de" da rota, em reais (pacote Billion, 2026-10-09). Só
   * entra quando a página MOSTRA o valor na seção "Quanto custa": schema que
   * declara preço ausente da tela é dado fabricado. `minPrice` (e não `price`)
   * porque é piso — o valor final sai na avaliação presencial.
   */
  precoMinimo?: number,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: servico.title,
    description: description ?? servico.desc,
    url: `${siteUrl}/servicos/${servico.slug}`,
    image: `${siteUrl}${servico.image}`,
    serviceType: servico.title,
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${brand.city} e região, ${brand.state}`,
    },
    ...(precoMinimo
      ? {
          offers: {
            "@type": "Offer",
            url: `${siteUrl}/servicos/${servico.slug}`,
            priceCurrency: "BRL",
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: precoMinimo,
              priceCurrency: "BRL",
            },
          },
        }
      : {}),
    ...(cobre?.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `O que entra em ${servico.title}`,
            itemListElement: cobre.map((item) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: item.title,
                description: item.desc,
              },
            })),
          },
        }
      : {}),
  };
}

/**
 * BreadcrumbList da rota de serviço — estava PROMETIDO no cabeçalho de
 * `app/servicos/[slug]/page.tsx` desde a criação da rota, mas nunca existiu
 * (achado em 2026-08-03). É o que faz o Google desenhar a trilha
 * "Início › Serviços › Polimento" no resultado, em vez da URL crua.
 *
 * 🚩 O 2º nível aponta pra `/#servicos`, a âncora do mosaico na home: **não
 * existe uma página `/servicos`**. Se um dia existir, trocar aqui.
 */
export function breadcrumbJsonLd(servico: Servico) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Serviços", item: `${siteUrl}/#servicos` },
      {
        "@type": "ListItem",
        position: 3,
        name: servico.title,
        item: `${siteUrl}/servicos/${servico.slug}`,
      },
    ],
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
