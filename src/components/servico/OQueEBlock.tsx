/**
 * "O que é" — bloco de entrada da página do serviço (foto grande à ESQUERDA,
 * texto à DIREITA). O card DESLIZA da esquerda e ASSENTA (expo-out), o texto
 * entra logo depois em fade-up. Gatilho `useInView` CONTROLADO (não whileInView
 * — lição do projeto: dispara "preso invisível" com o Lenis). reduced-motion
 * remove o deslocamento. (Victor, 2026-07-18.)
 *
 * PAR EMPILHADO (Parte 1 do passe de estrutura/copy, 2026-07-18): quando o
 * content traz `imagePair`, um card MENOR (processo) sobrepõe o canto inferior
 * direito do grande (resultado), vazando pro vão do texto — essência da ref.
 * Glänzen SEM rotação (profundidade por sobreposição + sombra). Neste passe o
 * par anima como UMA unidade; parallax entre os cards fica pra lapidação.
 *
 * Client Component isolado: só este bloco precisa de JS/motion — o resto da
 * página segue Server Component estático.
 */

"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { SplitBlock } from "@/content";
import { revealFromSide, revealAfter } from "@/lib/animation";
import styles from "./ServicoPage.module.css";

export function OQueEBlock({ block }: { block: SplitBlock }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();

  return (
    <section
      ref={ref}
      className={`${styles.split} ${styles.splitTall}`}
      aria-labelledby="oque-heading"
    >
      <motion.div
        className={styles.pair}
        // custom = distância/sentido do deslize; 0 quando reduced-motion.
        // Suavizado -72 → -40 (Victor, 2026-07-23): deslize mais curto e gentil.
        custom={reduce ? 0 : -40}
        variants={revealFromSide}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <div className={styles.pairMain}>
          <Image
            src={block.image}
            alt={block.imageAlt}
            fill
            sizes="(max-width: 900px) 100vw, 52vw"
            className={styles.splitImg}
            priority
          />
        </div>
        {block.imagePair && (
          <div className={styles.pairSecondary}>
            <Image
              src={block.imagePair.src}
              alt={block.imagePair.alt}
              fill
              sizes="(max-width: 900px) 45vw, 20vw"
              className={styles.splitImg}
            />
          </div>
        )}
      </motion.div>

      <motion.div
        className={styles.splitCopy}
        variants={revealAfter}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <h2 id="oque-heading" className={styles.sectionTitle}>
          {block.title}
        </h2>
        {block.body.map((p) => (
          <p key={p} className={styles.bodyText}>
            {p}
          </p>
        ))}
      </motion.div>
    </section>
  );
}
