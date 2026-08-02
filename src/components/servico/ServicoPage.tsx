/**
 * Template da página de categoria `/servicos/[slug]`.
 *
 * Estrutura (validada com Victor, 2026-07-18 — ref. Glänzen ENXUGADA):
 * Hero → O que é (foto|texto) → O que cobre (container) → Benefícios (texto|foto)
 * → Como fazemos → FAQ → [antes/depois: PARTE FINAL, ainda não] → CTA final.
 *
 * Server Component ESTÁTICO por decisão: primeiro validamos LAYOUT/copy; a
 * camada de animação (reveals do idioma da home) entra na lapidação, depois.
 * FAQ usa <details>/<summary> nativos — acessível e zero JS.
 *
 * Duas variantes:
 * - `ServicoDetalhePage` — categoria com conteúdo completo (`servicosDetalhe`).
 * - `ServicoResumoPage` — categorias ainda sem miolo: hero + foto + CTA
 *   (mata o 404 dos cards enquanto as copies são construídas uma a uma).
 */

import Image from "next/image";
import { contact, contactSection, casesPublicaveis } from "@/content";
import type { Servico, ServicoDetalhe } from "@/content";
import { Button, WhatsAppIcon } from "@/components/ui";
import { ServicoHero } from "./ServicoHero";
import { OQueEBlock } from "./OQueEBlock";
import { CoberturaBlock } from "./CoberturaBlock";
import { CasesReel } from "./CasesReel";
import { FaqBlock } from "./FaqBlock";
import styles from "./ServicoPage.module.css";

/** CTA de fecho — mesma língua do Contato da home (foco único no WhatsApp). */
function CtaFinal({ title, body }: { title: string; body: string }) {
  return (
    <section className={styles.ctaFinal} aria-labelledby="servico-cta">
      <h2 id="servico-cta" className={styles.ctaTitle}>
        {title}
      </h2>
      <p className={styles.ctaBody}>{body}</p>
      <div className={styles.ctaWrap}>
        <Button
          href={contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar pelo WhatsApp"
        >
          <WhatsAppIcon size={19} />
          {contactSection.whatsappCta}
        </Button>
      </div>
      <ul className={styles.trust} aria-label="Como funciona">
        {contactSection.trust.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function ServicoDetalhePage({
  servico,
  detalhe,
}: {
  servico: Servico;
  detalhe: ServicoDetalhe;
}) {
  const { hero, oQueE, cobre, cases, faq } = detalhe;
  // Cases que de fato vão pro ar nesta categoria (ver a regra em servico-detalhe.ts).
  const casesVisiveis = cases ? casesPublicaveis(cases.items) : [];

  return (
    <article className={styles.page}>
      {/* HERO — dark limpo com glow sutil (língua do hero da home), sem foto:
          a foto real da categoria aparece logo abaixo, no "O que é". SEM
          breadcrumb e SEM CTA (Victor, 2026-07-18). Client (ServicoHero) só pela
          ENTRADA SUAVE no mount (Victor, 2026-07-23) — título + subtítulo. */}
      <ServicoHero
        title={hero.title}
        titleAccent={hero.titleAccent}
        subtitle={hero.subtitle}
      />

      {/* O QUE É — foto grande à esquerda (desliza e assenta), texto à direita. */}
      <OQueEBlock block={oQueE} />

      {/* COBERTURA DA CATEGORIA — grid de CARDS + luz + 7º card isolado. Markup
          validado; em client (CoberturaBlock) pela CASCATA de entrada
          (título/subtítulo sobem, cards em fade escalonado). (Victor, 2026-07-23.) */}
      <CoberturaBlock cobre={cobre} />

      {/* CASES — reel horizontal de trabalhos (Victor, 2026-07-23), AQUI entre
          "O que cobre" e o FAQ. Ref. de layout: gallery6 (shadcnblocks),
          reconstruído limpo no padrão MV (scroll-snap nativo, sem shadcn/Embla).
          As seções "Por que higienizar o interior" (Benefícios) e "Como fazemos"
          saíram pra a página não pesar. Client component isolado — o resto do
          template segue Server Component estático. Sem foto ainda: placeholder
          de marca no card.

          🚩 PUBLICAÇÃO (Victor, 2026-08-01): a seção só existe se sobrar case
          pra mostrar. `casesPublicaveis` some com os cards de enchimento quando
          `MOSTRAR_CASES_PLACEHOLDER` for `false`; se a categoria ficar sem
          nenhum, o `.length` zera e NADA é renderizado — nem título, nem setas,
          nem o padding da seção. É de propósito que a checagem seja aqui fora e
          não dentro do CasesReel: assim não sobra um vão vazio na página. */}
      {cases && casesVisiveis.length > 0 && (
        <CasesReel
          heading={cases.heading}
          subheading={cases.subheading}
          items={casesVisiveis}
        />
      )}

      {/* FECHO INTEGRADO (Victor, 2026-07-23): FAQ + CTA num BLOCO SÓ, agora em
          client component (FaqBlock) pela CASCATA de entrada — details/summary
          seguem acessíveis e alimentando o FAQPage no JSON-LD. O botão do
          WhatsApp vive no trilho esquerdo, ao lado das dúvidas. O CTA pesado
          "Seu interior merece esse cuidado" foi removido; fecho global = rodapé. */}
      <FaqBlock faq={faq} />
    </article>
  );
}

/**
 * Versão RESUMO — categorias que ainda não têm o miolo de copy construído.
 * Hero + foto real + CTA: o clique no card deixa de dar 404 e a página já
 * apresenta o serviço com dignidade até a copy completa chegar.
 */
export function ServicoResumoPage({ servico }: { servico: Servico }) {
  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.title}>{servico.title}</h1>
          <p className={styles.subtitle}>{servico.desc}</p>
        </div>
      </header>

      <div className={styles.resumoMedia}>
        <Image
          src={servico.image}
          alt={servico.alt}
          fill
          sizes="(max-width: 900px) 100vw, 72rem"
          className={styles.splitImg}
          priority
        />
      </div>

      <CtaFinal
        title="Quer saber se é o serviço certo pro seu veículo?"
        body="Chame no WhatsApp e receba uma avaliação gratuita — a gente te orienta sem compromisso."
      />
    </article>
  );
}
