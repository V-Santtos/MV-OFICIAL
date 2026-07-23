"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { processo, processoMeta } from "@/content";
import { revealHeadingVariants } from "@/lib/animation";
import styles from "./Processo.module.css";

/**
 * Processo — ref MetroRide "Numbers" (§12 do ANEXO-METRORIDE-EFEITOS).
 *
 *  · Só o TÍTULO é PINADO (sticky). Os CARDS sobem NORMALMENTE (fluxo, não
 *    grudam) e passam por cima do título; enquanto o cobrem, o título BORRA
 *    (só ele). No fim, o título ESVAZIA a opacidade e sai.
 *
 * ⚠️ blur + fade do título são calculados de um progresso da seção medido À MÃO
 * (getBoundingClientRect num rAF), NÃO pelo `useScroll` do Framer: aqui o
 * `scrollYProgress` do Framer vinha NÃO-MONOTÔNICO (oscilava pra trás — provável
 * conflito com o Lenis nesta seção alta), fazendo o título "sumir e reaparecer"
 * (bug pego pelo Victor e confirmado por probe Playwright, 2026-07-17). O rect é
 * monotônico com o scroll real, então o fade é limpo e não volta.
 */
export function Processo() {
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });

  const blurPx = useMotionValue(0);
  const headOpacity = useMotionValue(1);
  const headFilter = useMotionTemplate`blur(${blurPx}px)`;

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
    const mapClamp = (v: number, i0: number, i1: number, o0: number, o1: number) =>
      o0 + (o1 - o0) * clamp((v - i0) / (i1 - i0), 0, 1);

    // Último card (03, ESCURO): o fade do título é ancorado na posição REAL dele,
    // não num `p` fixo — o título só some quando o card escuro sobe e o cobre.
    const lastCard = section.querySelector<HTMLElement>("ol > li:last-child");

    let raf = 0;
    let running = false;
    const loop = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      // p: 0 quando o topo da seção está no topo da viewport; 1 quando o fim
      // encosta no fim. `-r.top` cresce monotonicamente com o scroll.
      const p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
      blurPx.set(mapClamp(p, 0.06, 0.18, 0, 4)); // borra cedo, mantém 4px

      // FADE ANCORADO NO CARD ESCURO (Victor, 2026-07-17): o título esvazia
      // conforme o topo do card 03 SOBE em direção à linha do pin (18vh). Cheio
      // enquanto o card está lá embaixo (top ~60vh); zero quando o card alcança
      // ~20vh (encosta na base do título e começa a cobri-lo). Assim o sumiço
      // acontece SOB o card escuro, não "no vazio". Robusto a viewport/altura.
      if (lastCard) {
        const vh = window.innerHeight;
        const cardTop = lastCard.getBoundingClientRect().top;
        headOpacity.set(mapClamp(cardTop, 0.2 * vh, 0.6 * vh, 0, 1));
      } else {
        headOpacity.set(mapClamp(p, 0.55, 0.98, 1, 0));
      }
      if (running) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Roda o rAF só quando a seção está por perto — fora de vista, medir o rect
    // + setar motion values a cada frame é desperdício de CPU. (Otimização.)
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "300px 0px 300px 0px" },
    );
    io.observe(section);

    return () => {
      io.disconnect();
      stop();
    };
  }, [reduced, blurPx, headOpacity]);

  return (
    <section id="processo" ref={sectionRef} className={styles.section} aria-labelledby="proc-heading">
      <div className={styles.inner}>
        {/* Camada EXTERNA (sticky): blur + fade-out por scroll. INTERNA: entrada
            (reveal). Separadas pra não disputar `opacity` (produto das duas). */}
        <motion.div
          ref={headRef}
          className={styles.head}
          style={reduced ? undefined : { filter: headFilter, opacity: headOpacity }}
        >
          <motion.div
            className={styles.headInner}
            initial="hidden"
            animate={headInView ? "visible" : "hidden"}
            variants={revealHeadingVariants}
          >
            <p className={styles.eyebrow}>{processoMeta.eyebrow}</p>
            <h2 id="proc-heading" className={styles.title}>
              {processoMeta.title}
            </h2>
          </motion.div>
        </motion.div>

        <ol className={styles.stack} role="list">
          {processo.map((step) => (
            <li key={step.num} className={styles.card} data-variant={step.variant}>
              {/* Duas âncoras REAIS: topo (número + título) e rodapé (descrição +
                  checkpoints). O `.foot` mantém o `margin-top:auto` da ref, mas
                  agora com massa — antes o rodapé eram 2 linhas soltas e sobrava
                  um vão morto no meio do card. */}
              <div className={styles.top}>
                <span className={styles.num} aria-hidden="true">
                  {step.num}
                </span>
                <h3 className={styles.label}>{step.label}</h3>
              </div>

              <div className={styles.foot}>
                <p className={styles.desc}>{step.desc}</p>
                <ul className={styles.checks} role="list">
                  {step.checkpoints.map((item) => (
                    <li key={item} className={styles.check}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
