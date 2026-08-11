import { brand, contact, servicos } from "@/content";
import { siteConfig, siteUrl } from "@/lib/seo";

/**
 * Resumo factual e legível por ferramentas de IA. O conteúdo vem das mesmas
 * fontes usadas pelo site para não criar copy paralela nem informação divergente.
 */
export const dynamic = "force-static";

export function GET() {
  const servicosLinks = servicos
    .map(
      (servico) =>
        `- [${servico.title}](${siteUrl}/servicos/${servico.slug}): ${servico.desc}`,
    )
    .join("\n");

  const body = `# ${brand.name}

> ${siteConfig.description}

## Serviços

${servicosLinks}

## Contato e localização

- [Site oficial](${siteUrl})
- [WhatsApp](${contact.whatsapp})
- [Instagram](${contact.instagram})
- [Facebook](${contact.facebook})
- [TikTok](${contact.tiktok})
- [Google Maps](${contact.mapsPlaceUrl})
- Telefone: ${contact.phoneDisplay}
- Localização: ${brand.location}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
