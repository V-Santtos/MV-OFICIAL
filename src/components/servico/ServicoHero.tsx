"use client";

/**
 * Hero da rota /servicos/[slug] — pórtico dark com glow sutil, só título +
 * subtítulo. Entrada SUAVE no MOUNT (acima da dobra, dispara no load): fade
 * dominante + subida bem curta, escalonado (título → subtítulo). Client component
 * só pela animação; o resto do template ServicoPage segue Server. reduced-motion
 * cai num fade puro (sem o deslocamento). (Victor, 2026-07-23.)
 */

import { motion, useReducedMotion } from "framer-motion";
import { softRiseOnMount } from "@/lib/animation/motion";
import styles from "./ServicoPage.module.css";

export function ServicoHero({
  title,
  titleAccent,
  subtitle,
}: {
  title: string;
  titleAccent: string;
  subtitle: string;
}) {
  const reduce = useReducedMotion();
  // reduced-motion: mantém o fade, remove o y (a variante herda o custom, mas a
  // subida some no estado hidden zerado abaixo).
  const variants = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }
    : softRiseOnMount;

  return (
    <header className={styles.hero}>
      <motion.div className={styles.heroInner} initial="hidden" animate="visible">
        <motion.h1 className={styles.title} variants={variants} custom={0}>
          {/* Espaço EXPLÍCITO: no mobile o acento vira `inline` (ver
              ServicoPage.module.css) e sem isto "carro" colaria em "como". No
              desktop o acento é `display:block`, então o espaço é colapsado — sem
              efeito lá. */}
          {title}{" "}
          <span className={styles.titleAccent}>{titleAccent}</span>
        </motion.h1>
        <motion.p className={styles.subtitle} variants={variants} custom={1}>
          {subtitle}
        </motion.p>
      </motion.div>
    </header>
  );
}
