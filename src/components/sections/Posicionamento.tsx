"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { positioning, stats } from "@/content";
import { revealHeading, statCascade, statCounter, viewportOnce } from "@/lib/animation";
import styles from "./Posicionamento.module.css";

/**
 * Contador que anima de 0 até `target`, SINCRONIZADO à entrada do bloco:
 * dispara quando `start` vira true (o mesmo useInView que rege a cascata dos
 * blocos), com o MESMO delay escalonado do bloco — número e bloco chegam
 * juntos. (Antes: IntersectionObserver próprio com threshold diferente do
 * viewport da cascata → podia dessincronizar.)
 */
function Counter({ target, suffix = "", start, delay }: {
  target: number;
  suffix?: string;
  start: boolean;
  delay: number;
}) {
  const [value, setValue] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!start || done.current) return;
    done.current = true;

    let raf = 0;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const timer = window.setTimeout(() => {
      // Reduced-motion: número já chega pronto, sem count-up.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setValue(target);
        return;
      }
      const startTime = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - startTime) / statCounter.duration, 1);
        setValue(Math.round(easeOut(t) * target));
        if (t < 1) raf = requestAnimationFrame(step);
        else setValue(target);
      };
      raf = requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [start, target, delay]);

  return (
    <span>
      {value}
      <span className={styles.statPlus}>{suffix}</span>
    </span>
  );
}

export function Posicionamento() {
  // Um gatilho só pra cascata dos blocos E os contadores (sincronia real).
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: viewportOnce.margin });

  return (
    <section id="posicionamento" aria-labelledby="pos-heading" className={styles.section}>
      <div className={styles.layout}>
        <motion.div className={styles.left} {...revealHeading}>
          <h2 id="pos-heading" className={styles.title}>
            {positioning.title}
          </h2>
          <p className={styles.body}>{positioning.body}</p>
        </motion.div>

        {/* Stats em CASCATA (stat a stat, não em bloco): cada um sobe com a
            régua editorial se desenhando no topo e o contador chegando junto. */}
        <div ref={statsRef} className={styles.stats}>
          {stats.map(({ target, suffix, badge, desc }, i) => (
            <motion.div
              className={styles.statBlock}
              key={badge}
              custom={i}
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
              variants={statCascade}
            >
              <p className={styles.statNumber}>
                <Counter
                  target={target}
                  suffix={suffix}
                  start={statsInView}
                  delay={i * statCounter.delayPerIndex}
                />
              </p>
              <span className={styles.statBadge}>{badge}</span>
              <p className={styles.statDesc}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bloco do dono (foto + nome + bio) removido a pedido do Victor (2026-07-16):
          será refeito "de forma diferente" depois. Dados seguem em content/positioning.founder. */}

      <div className={styles.accentLine} aria-hidden="true" />
    </section>
  );
}
