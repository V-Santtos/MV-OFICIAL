"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import styles from "./ServicoPage.module.css";

/**
 * Luz ambiente azul ATRÁS do grid de cobertura — REATIVA AO SCROLL (Victor,
 * 2026-07-23). Acende conforme a seção centraliza na viewport e apaga ao entrar/
 * sair. É o ÚNICO azul da seção (acento essencial); vaza pelos vãos entre os
 * cards neumórficos, que são da cor do fundo.
 *
 * Medição À MÃO (getBoundingClientRect num rAF) — de propósito NÃO usa o
 * `useScroll` do Framer, que é não-monotônico com o Lenis e quebra o mapa (bug
 * GOLD do projeto). O rAF é gated por IntersectionObserver (só roda em vista).
 * Respeita prefers-reduced-motion: luz estática, sem rAF.
 *
 * Client component ISOLADO — o resto do template segue Server Component.
 */
export function CoberturaGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  // Base: invisível até entrar em vista. Em reduced-motion, luz estática média.
  const opacity = useMotionValue(reduced ? 0.6 : 0);
  const scale = useMotionValue(reduced ? 1 : 0.92);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    const section = el?.parentElement;
    if (!el || !section) return;

    let rafId = 0;
    let running = false;

    const tick = () => {
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = r.top + r.height / 2;
      // t = 1 quando o CENTRO da seção coincide com o centro da viewport; cai
      // suave pros lados. Janela de 0.75*vh dá uma acensão gradual, não abrupta.
      const t = 1 - Math.min(Math.abs(center - vh / 2) / (vh * 0.75), 1);
      opacity.set(0.14 + t * 0.86);
      scale.set(0.9 + t * 0.1);
      rafId = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          rafId = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(rafId);
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(section);

    return () => {
      io.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [reduced, opacity, scale]);

  return (
    <motion.div
      ref={ref}
      className={styles.cobreGlow}
      style={{ opacity, scale, x: "-50%", y: "-50%" }}
      aria-hidden="true"
    />
  );
}
