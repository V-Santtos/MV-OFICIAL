"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { intro, emitIntroReveal } from "@/lib/animation";
import { MV_LOGO } from "@/components/ui/logo";
import styles from "./IntroReveal.module.css";

/**
 * Intro de abertura. Painel dark cobre a tela, a logo MV se desenha
 * (contorno traçado → preenche) e o painel sobe revelando o Hero.
 *
 * Reconstrução em GSAP do efeito de máscara-de-logo do portfólio do Victor —
 * mesma técnica e ritmo do original (`PageTransition.jsx`): `strokeDashoffset`
 * para o traço + `gsap.timeline` com stagger. Toca por inteiro a cada carga
 * (validação); reduced-motion pula direto pro conteúdo. Renderiza coberto
 * desde o 1º paint; a logo fica invisível até o GSAP preparar o traço (svg
 * opacity 0 no CSS). Tempos/curvas vêm de `lib/animation` (`intro`).
 */
/**
 * Chave de sessão. A intro toca UMA VEZ POR ABA (2026-07-22): antes rodava
 * inteira em TODO carregamento de URL, cobrando ~2,4s de scroll bloqueado
 * também de quem só voltou pra home ou abriu uma rota `/servicos/...` direto.
 * Na 1ª visita nada muda — os tempos validados seguem intactos.
 * `sessionStorage` (não `localStorage`): aba nova = primeira impressão de novo.
 *
 * ⚠️ O `<html data-intro-done>` que evita o PISCA da cortina em cargas
 * seguintes é escrito por um script inline no `layout.tsx`, que roda antes de o
 * overlay ser pintado. A regra que o esconde está no `globals.css`. Mexer numa
 * ponta sem a outra devolve o pisca.
 */
const SESSION_KEY = "mv:intro-played";

/** Lê/escreve a flag sem quebrar onde o storage é bloqueado (modo privado). */
function alreadyPlayed(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markPlayed(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* storage bloqueado: a intro simplesmente toca de novo */
  }
}

export function IntroReveal() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    const svg = svgRef.current;
    if (!overlay || !svg) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const finish = () => {
      body.style.overflow = prevOverflow;
      setDone(true);
    };

    // Sem cortina: reduced-motion, ou a intro já tocou nesta aba. Revela na
    // hora e avisa `instant` — sem isso, as cascatas do Hero e da Navbar ficam
    // esperando um painel que não vai subir (tela parada por ~1s).
    if (prefersReduced || alreadyPlayed()) {
      emitIntroReveal({ instant: true });
      finish();
      return () => {
        body.style.overflow = prevOverflow;
      };
    }

    markPlayed();

    const ctx = gsap.context(() => {
      const paths = gsap.utils.toArray<SVGPathElement>("path", svg);

      // Estado inicial: contorno "não desenhado" (dash deslocado) e sem fill.
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
      });
      gsap.set(svg, { autoAlpha: 1 });

      const tl = gsap.timeline({ onComplete: finish });

      // 1. Desenha o contorno — as duas formas em stagger.
      tl.to(paths, {
        strokeDashoffset: 0,
        duration: intro.draw.duration,
        ease: intro.draw.ease,
        stagger: intro.draw.stagger,
      });

      // 2. Preenche e apaga o traço.
      tl.to(
        paths,
        {
          fillOpacity: 1,
          strokeOpacity: 0,
          duration: intro.fill.duration,
          ease: intro.fill.ease,
          stagger: intro.fill.stagger,
        },
        "-=0.12",
      );

      // 3. Segura a logo cheia e 4. sobe o painel revelando a página.
      //    `onStart` sinaliza o Hero pra disparar a cascata NO instante em que
      //    a "cortina" começa a subir (não no load) — intro → cascata do Hero.
      tl.to(
        overlay,
        {
          yPercent: -100,
          duration: intro.lift.duration,
          ease: intro.lift.ease,
          onStart: emitIntroReveal,
        },
        `+=${intro.hold}`,
      );
    }, overlay);

    return () => {
      ctx.revert();
      body.style.overflow = prevOverflow;
    };
  }, []);

  if (done) return null;

  return (
    <div ref={overlayRef} className={`${styles.overlay} mv-intro-overlay`} aria-hidden="true">
      {/* Sem JS o painel nunca sobe — esconde-o para não travar o conteúdo. */}
      <noscript>
        <style>{`.mv-intro-overlay{display:none!important}`}</style>
      </noscript>

      <svg ref={svgRef} className={styles.logo} viewBox={MV_LOGO.viewBox} aria-hidden="true">
        <path
          d={MV_LOGO.body}
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* "V" no azul oficial do projeto (--accent / Royalblue MAX COLOR),
            não mais no ciano cru --brand-pure (Victor, lapidação). */}
        <path
          d={MV_LOGO.chevron}
          fill="var(--accent)"
          stroke="var(--accent)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
