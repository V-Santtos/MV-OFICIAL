"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { assets, brand, navLinks } from "@/content";
import { introDelay, navCascade, onIntroReveal } from "@/lib/animation";
import { Button } from "@/components/ui";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [revealed, setRevealed] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Navbar "inteligente" (Victor, 2026-07-17): no topo/hero a barra é ABSOLUTA —
  // rola junto e some NATURALMENTE ao descer (não desliza pra cima). Só ao rolar
  // PRA CIMA (fora do topo) o card fixo (pílula) aparece. Detecta a direção do
  // scroll (rAF-throttled; threshold p/ não tremer com o smooth do Lenis).
  useEffect(() => {
    let lastY = window.scrollY;
    let acc = 0; // acumulador de direção (histerese anti-jitter do Lenis)
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;

      // Topo → modo hero (barra absoluta, sem card). Limiar pequeno pra a troca
      // fixed→absolute acontecer só bem no topo (imperceptível, sem "pulo"); o
      // fade do card é tratado por transição no CSS. Ao descer daqui ela rola
      // embora com a página.
      if (y < 8) {
        setRevealed(false);
        lastY = y;
        acc = 0;
        return;
      }

      // Fora do topo: acumula o movimento na direção atual e zera ao inverter.
      // Só troca de estado após um movimento REAL (>10px) — evita a pílula
      // piscar/sumir no meio do caminho por causa do micro-jitter da inércia do
      // Lenis perto do topo (aquele "vão" antes da barra do hero chegar).
      const delta = y - lastY;
      lastY = y;
      if (delta > 0) {
        acc = acc > 0 ? acc + delta : delta;
        if (acc > 10) setRevealed(false);
      } else if (delta < 0) {
        acc = acc < 0 ? acc + delta : delta;
        if (acc < -10) setRevealed(true);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Cascata de entrada (GSAP), encadeada à intro: é a PRIMEIRA a animar quando
  // o painel sobe (sinal `onIntroReveal`) — logo → links → CTA/burger caem do
  // topo enquanto a cortina revela a barra. Anima os FILHOS marcados com
  // `data-reveal`, nunca o `<ul>` (carrega o translateX de centralização).
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", nav);
    if (!items.length) return;

    // Reduced-motion: barra já visível (default do CSS), sem cascata.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let off = () => {};
    const ctx = gsap.context(() => {
      gsap.set(items, navCascade.from);
      off = onIntroReveal(() => {
        // Sem cortina (intro já tocada nesta aba), o delay do preset vira tela
        // parada — `introDelay` zera nesse caso. Ver `lib/animation/introSignal`.
        gsap.to(items, { ...navCascade.to, delay: introDelay(navCascade.to.delay) });
      });
    }, nav);

    return () => {
      off();
      ctx.revert();
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <nav
        ref={navRef}
        className={`${styles.nav} ${revealed ? styles.revealed : ""}`}
        aria-label="Navegação principal"
      >
        <div className={styles.inner}>
          <a
            href="/#hero"
            aria-label={`${brand.name} — início`}
            className={styles.logo}
            data-reveal
          >
            <Image
              src={assets.logo}
              alt={brand.name}
              width={120}
              height={38}
              priority
              className={styles.logoImg}
            />
          </a>

          <ul className={styles.links}>
            {navLinks.map(({ href, label }) => (
              <li key={href} data-reveal>
                <a href={href} className={styles.link}>
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.cta} data-reveal>
            <Button href="/#contato" variant="light" className={styles.ctaBtn}>
              Contato
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={styles.burger}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            data-reveal
          >
            <span className={styles.burgerTop} data-open={open} />
            <span className={styles.burgerBottom} data-open={open} />
          </button>
        </div>
      </nav>

      <div
        id="mobile-drawer"
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        aria-hidden={!open}
      >
        <button type="button" onClick={close} className={styles.drawerClose} aria-label="Fechar menu">
          ✕ fechar
        </button>
        <nav>
          <ul className={styles.drawerList}>
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className={styles.drawerLink} onClick={close} tabIndex={open ? 0 : -1}>
                  {label}
                </a>
              </li>
            ))}
            <li>
              <Button href="/#contato" onClick={close} tabIndex={open ? 0 : -1}>
                Contato
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
