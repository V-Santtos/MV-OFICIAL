"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { circulo } from "@/content";
import { circuloReveal } from "@/lib/animation";
import styles from "./Circulo.module.css";

/**
 * Seção "Círculo" — transição CLARO → DARK (ref MetroRide "Round Section").
 * Seção alta com palco PINADO claro; dentro, um círculo escuro cresce (scale)
 * dirigido pelo scroll até cobrir a viewport. Quando o palco solta, o fundo
 * dark da seção já está por baixo — emenda direto na próxima seção escura.
 *
 * O texto usa `mix-blend-mode: difference` (via CSS) pra ser legível tanto no
 * claro quanto no escuro, invertendo conforme o círculo passa por baixo dele.
 * Texto é placeholder (ver content/circulo).
 */
export function Circulo() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: circuloReveal.offset });
  const scale = useTransform(scrollYProgress, circuloReveal.scaleInput, circuloReveal.scaleOutput);
  // Deslocamento vertical amarrado ao scroll: entra pra cima (peek) e volta ao
  // centro antes de expandir. Círculo e texto usam o MESMO `lift` → alinhados.
  const lift = useTransform(scrollYProgress, circuloReveal.liftInput, circuloReveal.liftOutput);
  const textClip = useTransform(scale, (value) => `circle(${75 * value}vmax at 50% 50%)`);

  return (
    <section ref={ref} aria-label="Transição" className={styles.section}>
      <div className={styles.stage}>
        {/* Reduced-motion: círculo já cheio (dark), sem crescer. */}
        <motion.div
          className={styles.circle}
          style={{ scale: reduced ? 1 : scale, y: reduced ? 0 : lift }}
          aria-hidden="true"
        />
        <div className={styles.textLayer}>
          <motion.h2
            className={styles.heading}
            style={{ y: reduced ? 0 : lift, clipPath: reduced ? "none" : textClip }}
          >
            {circulo.title} <span className={styles.emphasis}>{circulo.emphasis}</span>
          </motion.h2>
        </div>
      </div>
    </section>
  );
}
