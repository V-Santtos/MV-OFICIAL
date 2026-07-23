/**
 * Rota `/servicos/[slug]` — página de cada categoria do catálogo (backlog #1).
 *
 * Engenharia (Next 16, docs locais em node_modules/next/dist/docs):
 * - `generateStaticParams` sobre os 6 slugs de `content/servicos.ts` → todas as
 *   páginas saem ESTÁTICAS no build, como o resto do site.
 * - `dynamicParams = false` → slug fora do catálogo = 404 direto.
 * - `params` é Promise nesta versão → sempre `await params`.
 *
 * Conteúdo: categorias com miolo completo em `content/servico-detalhe.ts`
 * renderizam o template cheio; as demais, a versão RESUMO (sem 404 nos cards).
 * SEO: metadata por categoria + JSON-LD Service/Breadcrumb (+ FAQPage no cheio).
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brand, servicos, servicosDetalhe } from "@/content";
import { servicoJsonLd, faqJsonLd } from "@/lib/seo";
import { ServicoDetalhePage, ServicoResumoPage } from "@/components/servico";

export const dynamicParams = false;

export function generateStaticParams() {
  return servicos.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const servico = servicos.find((s) => s.slug === slug);
  if (!servico) return {};

  // Título entra no template do layout: "%s — MV Estética Automotiva".
  const title = `${servico.title} em ${brand.location}`;

  return {
    title,
    description: servico.desc,
    alternates: { canonical: `/servicos/${slug}` },
    openGraph: {
      title,
      description: servico.desc,
      url: `/servicos/${slug}`,
      type: "website",
      images: [{ url: servico.image }],
    },
  };
}

export default async function ServicoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const servico = servicos.find((s) => s.slug === slug);
  if (!servico) notFound();

  const detalhe = servicosDetalhe[slug];

  return (
    <>
      {detalhe ? (
        <ServicoDetalhePage servico={servico} detalhe={detalhe} />
      ) : (
        <ServicoResumoPage servico={servico} />
      )}
      <script
        type="application/ld+json"
        // Conteúdo controlado (content/*.ts), sem input de usuário.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicoJsonLd(servico)) }}
      />
      {detalhe && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(detalhe.faq.items)) }}
        />
      )}
    </>
  );
}
