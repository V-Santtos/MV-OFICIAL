"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scroll GLOBAL (Lenis) — igual à referência MetroRide (confirmado no
 * bundle: `html.lenis`, e a receita de replicação começa por "instalar smooth
 * scroll global com Lenis"). Dá a inércia/peso premium que faz os efeitos
 * dirigidos por scroll (reveal, parallax, pin) ficarem fluidos.
 *
 * Headless: instancia o Lenis num raf loop e limpa no unmount. Respeita
 * `prefers-reduced-motion` (não ativa — scroll nativo). O framer-motion
 * `useScroll` das seções continua funcionando: o Lenis atualiza a rolagem real
 * da janela, então o progresso é lido normalmente (só que suavizado).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
