"use client";

/**
 * "Do volante ao carro inteiro" — grid de cards da cobertura + luz azul reativa
 * (CoberturaGlow) + 7º card ISOLADO (categoria relacionada). Markup VALIDADO
 * (2026-07-23) preservado; virou client component só pela CASCATA de entrada:
 * título (rise) → subtítulo (rise) → cards (fade escalonado) → card relacionado.
 *
 * ⚠️ Cards usam `staggerFadeIn` (SÓ opacidade) de propósito: o `:hover` do card
 * é um `translateY` (emboss neumórfico) — animar `y` no mount deixaria transform
 * inline e mataria o hover. Título/subtítulo (sem hover) podem subir.
 * useInView CONTROLADO + `once` (nunca whileInView/useScroll — bug Lenis).
 */

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { revealHeadingVariants, staggerCard, staggerFadeIn } from "@/lib/animation/motion";
import { CoberturaGlow } from "./CoberturaGlow";
import styles from "./ServicoPage.module.css";

type CobreItem = { title: string; desc: string };

export function CoberturaBlock({
  cobre,
}: {
  cobre: {
    title: string;
    intro: string;
    items: readonly CobreItem[];
    note?: string;
    crossLink?: { label: string; desc: string; slug: string };
  };
}) {
  // DOIS gatilhos separados (Victor, 2026-07-23): o cabeçalho revela quando ELE
  // entra na vista; os cards têm o gatilho do PRÓPRIO grid → entram DEPOIS do
  // título/subtítulo e a cascata lenta é vista de fato (antes, com gatilho único
  // no topo da seção, os cards de baixo animavam fora da tela).
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, amount: 0.5 });
  const gridRef = useRef<HTMLUListElement>(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.2 });
  const cardsState = gridInView ? "visible" : "hidden";

  return (
    <section id="incluso" className={styles.cobre} aria-labelledby="cobre-heading">
      <CoberturaGlow />
      <div className={styles.cobreInner}>
        <motion.div
          ref={headRef}
          className={styles.cobreHead}
          initial="hidden"
          animate={headInView ? "visible" : "hidden"}
        >
          <motion.h2 id="cobre-heading" className={styles.sectionTitle} variants={revealHeadingVariants}>
            {cobre.title}
          </motion.h2>
          <motion.p className={styles.bodyText} variants={staggerCard} custom={0}>
            {cobre.intro}
          </motion.p>
        </motion.div>

        <motion.ul
          ref={gridRef}
          className={styles.cobreGrid}
          initial="hidden"
          animate={cardsState}
        >
          {cobre.items.map((item, i) => (
            <motion.li
              key={item.title}
              className={styles.covCard}
              variants={staggerFadeIn}
              custom={i}
            >
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.li>
          ))}
        </motion.ul>

        {cobre.crossLink && (
          <motion.div
            className={styles.cobreRelatedRow}
            initial="hidden"
            animate={cardsState}
            variants={staggerFadeIn}
            custom={cobre.items.length}
          >
            <Link
              href={`/servicos/${cobre.crossLink.slug}`}
              className={`${styles.covCard} ${styles.covCardRelated}`}
            >
              <span className={styles.relEyebrow}>Categoria relacionada</span>
              <div className={styles.relHead}>
                <h3>{cobre.crossLink.label}</h3>
                <span className={styles.crossArrow} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </span>
              </div>
              <p>{cobre.crossLink.desc}</p>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
