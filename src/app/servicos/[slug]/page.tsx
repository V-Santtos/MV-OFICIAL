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
import { servicoJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
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
  // Snippet de busca escrito pra ESTA rota; sem ele, cai no texto do card do
  // mosaico (que tem outro trabalho). Ver `seoDescription` em servico-detalhe.ts.
  const description = servicosDetalhe[slug]?.seoDescription ?? servico.desc;

  return {
    title,
    description,
    alternates: { canonical: `/servicos/${slug}` },
    openGraph: {
      title,
      description,
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
      {/* Service — enriquecido com os sub-serviços do "O que cobre" quando a
          categoria tem miolo completo: assim o buscador sabe o que a categoria
          COBRE, não só o nome dela. */}
      <script
        type="application/ld+json"
        // Conteúdo controlado (content/*.ts), sem input de usuário.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            servicoJsonLd(
              servico,
              detalhe?.cobre.items,
              detalhe?.seoDescription,
              detalhe?.venda?.preco.priceFrom,
            ),
          ),
        }}
      />
      {/* BreadcrumbList — vale pras 6 rotas, inclusive as que caem no resumo:
          a trilha existe independente de a página ter miolo. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(servico)) }}
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
