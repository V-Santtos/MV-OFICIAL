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
/**
 * Instância viva do Lenis, em escopo de módulo.
 *
 * Existe porque overlays que cobrem a tela (o menu mobile) precisam TRAVAR a
 * rolagem, e `document.body.style.overflow = "hidden"` é o jeito errado com o
 * Lenis rodando: ele mantém o próprio loop de rAF e continua processando o
 * scroll por baixo. O jeito certo é `lenis.stop()` / `lenis.start()`, que também
 * carimba `.lenis-stopped` no `<html>` (regra já existente no `globals.css`).
 *
 * É `null` quando o Lenis não está ativo — `prefers-reduced-motion`, antes da
 * montagem, ou em SSR. Quem consome trata o nulo e cai no scroll nativo.
 */
let lenisInstance: Lenis | null = null;

/** Acessa o Lenis vivo (ou `null` se não houver). Ver `travarRolagem`. */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Trava/destrava a rolagem da página para overlays de tela cheia.
 *
 * Com o Lenis ativo usa `stop()/start()`. Sem ele (reduced-motion) cai no
 * `overflow` do body, que aí sim é o mecanismo correto — não há nada disputando.
 */
export function travarRolagem(travar: boolean): void {
  const lenis = getLenis();

  if (lenis) {
    if (travar) lenis.stop();
    else lenis.start();
    return;
  }

  document.body.style.overflow = travar ? "hidden" : "";
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisInstance = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
