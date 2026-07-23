/**
 * Cabeçalho de seção reutilizável: eyebrow (label caps) + título.
 * Anima com os presets de cabeçalho centralizados, disparando via `useInView`
 * CONTROLADO (não `whileInView`): a única consumidora hoje (Depoimentos) vem
 * logo após o Processo PINADO, onde o `whileInView` disparava "preso invisível"
 * — mesma lição do Serviços após o Círculo. (Victor, 2026-07-17.)
 */

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";
import { revealHeadingVariants, revealHeadingFadeVariants } from "@/lib/animation";
import styles from "./SectionHeading.module.css";

export function SectionHeading({
  eyebrow,
  title,
  id,
  align = "center",
  className,
  animation = "rise",
}: {
  eyebrow: string;
  title: ReactNode;
  /** id do <h2> p/ aria-labelledby da seção. */
  id?: string;
  align?: "center" | "left";
  className?: string;
  /** `rise` = padrão (opacity + subida). `fade` = só opacidade, mais longo/sereno. */
  animation?: "rise" | "fade";
}) {
  // Gatilho só quando o título entra de fato na vista — a margem inferior
  // negativa segura o disparo até passar bem do topo da seção seguinte, para o
  // fade sereno tocar quando Victor chega nele (e não sob o pin do Processo).
  const ref = useRef<HTMLDivElement>(null);
  // -18%: dispara com o título ainda subindo pela base do palco, dando folga p/
  // o fade completar ANTES de ele chegar ao centro (beat cheio e sozinho).
  const inView = useInView(ref, { once: true, margin: "0px 0px -18% 0px" });

  return (
    <motion.div
      ref={ref}
      className={[styles.wrap, align === "left" ? styles.left : styles.center, className]
        .filter(Boolean)
        .join(" ")}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={animation === "fade" ? revealHeadingFadeVariants : revealHeadingVariants}
    >
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
    </motion.div>
  );
}
