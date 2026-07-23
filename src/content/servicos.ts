/**
 * Catálogo de serviços da MV — 6 CATEGORIAS (cards do mosaico foto-led).
 *
 * ⚠️ PLACEHOLDER (2026-07-17): esta lista fecha a QUANTIDADE (6) e a estrutura pra
 * validar layout + efeito da grade. Os serviços REAIS vêm depois (Victor confirma
 * com o dono). Muitos serviços "picotados" do catálogo real viram sub-serviços
 * DENTRO da página `/servicos/[slug]` de cada categoria; Comercial/Premium/Técnico
 * são TIERS dentro da página, não cards. Sem preço aqui (orçamento via WhatsApp).
 *
 * FOTOS (2026-07-17): as 6 são REAIS do dono, em `/public/assets/servicos/`.
 * Nenhum card aponta mais pra Unsplash. ⚠️ Mas o `remotePatterns` de unsplash
 * SEGUE no `next.config.ts` porque as seções Galeria e Sobre ainda usam Unsplash
 * — só remover quando ELAS também migrarem pra fotos locais. `desc` alimenta o
 * JSON-LD (`makesOffer` em lib/seo/jsonld.ts) e a futura página do serviço.
 */

export type Servico = {
  /** Nome da categoria (rótulo do card). */
  title: string;
  /** Slug da rota `/servicos/[slug]` (a construir). */
  slug: string;
  /** Descrição curta — usada no JSON-LD e na página do serviço. */
  desc: string;
  /** Foto de fundo do card (foto real do dono, em /public/assets/servicos/). */
  image: string;
  /** Texto alternativo da imagem. */
  alt: string;
};

export const servicos: readonly Servico[] = [
  {
    title: "Higienização Interna",
    slug: "higienizacao-interna",
    desc: "Limpeza profunda de painel, carpetes, teto e superfícies internas, devolvendo frescor e conservação ao interior do veículo.",
    image: "/assets/servicos/higienizacao-interna-v2.jpg",
    alt: "Higienização interna do veículo — limpeza de superfícies internas",
  },
  {
    title: "Tratamento de Bancos e Estofados",
    slug: "bancos-e-estofados",
    desc: "Higienização a fundo de bancos de couro e tecido, com hidratação e revitalização que preservam e renovam os estofados.",
    image: "/assets/servicos/bancos-e-estofados.jpg",
    alt: "Tratamento de bancos e estofados — higienização e hidratação de couro",
  },
  {
    title: "Limpeza de Motor",
    slug: "limpeza-de-motor",
    desc: "Desengraxe e higienização do compartimento do motor com segurança elétrica e produtos de alta performance.",
    image: "/assets/servicos/limpeza-de-motor-v2.jpg",
    alt: "Limpeza do compartimento do motor",
  },
  {
    title: "Polimento",
    slug: "polimento",
    desc: "Correção de riscos, oxidação e imperfeições da pintura e dos faróis, restaurando brilho e profundidade ao acabamento.",
    image: "/assets/servicos/polimento.jpg",
    alt: "Polimento técnico da pintura do veículo",
  },
  {
    title: "Vitrificação & Proteção",
    slug: "vitrificacao",
    desc: "Revestimento cerâmico e selantes que protegem a pintura por anos, com brilho intenso e efeito hidrofóbico.",
    image: "/assets/servicos/vitrificacao-v2.jpg",
    alt: "Vitrificação e proteção da pintura — reflexo na lataria",
  },
  {
    title: "Cristalização de Vidros",
    slug: "cristalizacao-de-vidros",
    desc: "Tratamento que repele a água dos vidros e remove marcas de chuva ácida, ampliando a visibilidade e a segurança.",
    image: "/assets/servicos/cristalizacao-v2.jpg",
    alt: "Cristalização de vidros — tratamento hidrofóbico",
  },
] as const;

export const servicosMeta = {
  eyebrow: "O que fazemos",
  title: "Serviços que realizamos",
} as const;
