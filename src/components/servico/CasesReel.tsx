"use client";

/**
 * Reel horizontal de CASES — ref. de layout: gallery6 (shadcnblocks), porém
 * RECONSTRUÍDO limpo no padrão MV (regra de ouro: código não migra). Sem shadcn,
 * sem Embla: motor = scroll-snap NATIVO do CSS + JS mínimo só pras setas e pro
 * estado (habilita/desabilita nas pontas). Swipe no touch e trackpad vêm de graça.
 *
 * Cabeçalho no canto (título + subtítulo opcional), setas no lado oposto — o card
 * herda o "verniz" do site (bg-2, moldura fina, sombra funda). O track SANGRA pela
 * direita (o próximo card espia), assinatura do padrão de referência.
 *
 * Cada card é UM trabalho (uma foto por enquanto). O mecanismo de antes/depois
 * dentro do card é a próxima camada, depois desta casca ser aprovada.
 */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { revealHeadingVariants, staggerCard } from "@/lib/animation/motion";
import styles from "./CasesReel.module.css";

export interface CaseItem {
  id: string;
  title: string;
  summary: string;
  /** Sem foto ainda: o card cai no placeholder de marca (monograma). */
  image?: string;
  alt?: string;
}

interface CasesReelProps {
  heading: string;
  subheading?: string;
  items: readonly CaseItem[];
}

function ArrowIcon({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={dir === "prev" ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function CasesReel({ heading, subheading, items }: CasesReelProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // Cascata de entrada CONTROLADA (padrão do projeto: useInView + animate),
  // nunca whileInView/useScroll — reveal on-enter, dispara uma vez.
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const revealState = inView ? "visible" : "hidden";
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const syncEdges = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    syncEdges();
    el.addEventListener("scroll", syncEdges, { passive: true });
    const ro = new ResizeObserver(syncEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      ro.disconnect();
    };
  }, [syncEdges]);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const el = viewportRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const slide = track.querySelector<HTMLElement>("[data-slide]");
    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    const step = slide ? slide.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: step * direction, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return (
    <section ref={sectionRef} className={styles.cases} aria-labelledby="cases-heading">
      <div className={styles.head}>
        <motion.div className={styles.headText} initial="hidden" animate={revealState}>
          <motion.h2 id="cases-heading" className={styles.title} variants={revealHeadingVariants}>
            {heading}
          </motion.h2>
          {subheading && (
            <motion.p className={styles.subtitle} variants={staggerCard} custom={0}>
              {subheading}
            </motion.p>
          )}
        </motion.div>
        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Ver trabalho anterior"
          >
            <ArrowIcon dir="prev" />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Ver próximo trabalho"
          >
            <ArrowIcon dir="next" />
          </button>
        </div>
      </div>

      <div className={styles.viewport} ref={viewportRef}>
        <motion.ul
          className={styles.track}
          ref={trackRef}
          initial="hidden"
          animate={revealState}
        >
          {items.map((item, i) => (
            <motion.li
              key={item.id}
              className={styles.slide}
              data-slide
              variants={staggerCard}
              custom={i + 1}
            >
              <article className={styles.card}>
                <div className={styles.media}>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.alt ?? item.title}
                      fill
                      sizes="(max-width: 640px) 82vw, 27rem"
                      className={styles.img}
                    />
                  ) : (
                    <div className={styles.mediaEmpty} aria-hidden="true">
                      <span className={styles.mono}>MV</span>
                    </div>
                  )}
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.summary}</p>
              </article>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
