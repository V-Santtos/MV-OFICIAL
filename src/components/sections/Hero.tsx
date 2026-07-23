"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { hero, contact, assets } from "@/content";
import { heroCascade, introDelay, onIntroReveal } from "@/lib/animation";
import { Button } from "@/components/ui";
import styles from "./Hero.module.css";

export function Hero() {
  const innerRef = useRef<HTMLDivElement>(null);

  // Cascata de entrada (GSAP), encadeada à intro: dispara quando o painel da
  // intro sobe (sinal `onIntroReveal`), não no load — assim o conteúdo é visto
  // ENTRANDO conforme a cena é revelada. Itens marcados com `data-reveal`,
  // animados na ordem do DOM (título → subtítulo → CTA).
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", inner);
    if (!items.length) return;

    // Reduced-motion: conteúdo já visível (default do CSS), sem cascata.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let off = () => {};
    const ctx = gsap.context(() => {
      gsap.set(items, heroCascade.from);
      // Assina o sinal da intro; se ela já revelou, toca na hora.
      off = onIntroReveal(() => {
        // `introDelay` zera a espera quando não houve cortina (intro já tocada
        // nesta aba): o delay do preset existe só p/ aguardar o painel subir.
        gsap.to(items, { ...heroCascade.to, delay: introDelay(heroCascade.to.delay) });
      });
    }, inner);

    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <section id="hero" aria-label="Hero principal" className={styles.hero}>
      {/* Cenário (ref. Figma 475:143) — ordem de pintura de baixo p/ cima:
          luz do chão → sombra do carro → carro → glow azul → grain.
          SEM animação de entrada: o cenário (carro+sombra+luz) já está na cena
          quando a página abre (Victor, 2026-07-15); a cascata é só do conteúdo.
          Tudo decorativo (aria-hidden) e sem pointer-events. */}
      <div className={styles.fx} aria-hidden="true">
        <div className={styles.carGroup}>
          <div className={styles.floorLight} />
          <div className={styles.carShadow} />
          <div className={styles.car}>
            <Image
              src={assets.heroCar}
              alt=""
              fill
              sizes="(max-width: 48rem) 125vw, 72vw"
              quality={90}
              priority
            />
          </div>
        </div>
        <div className={styles.glow} />
        <div className={styles.grain} />
      </div>

      <div ref={innerRef} className={styles.inner}>
        <h1 className={styles.headline} data-reveal>
          {hero.title}
        </h1>

        <p className={styles.subtitle} data-reveal>
          {hero.subtitle}
        </p>

        <div className={styles.ctas} data-reveal>
          <Button href={contact.whatsapp} target="_blank" rel="noopener noreferrer" arrow>
            {hero.primaryCta}
          </Button>
          {/* Hero com CTA único (secundário "Tabela de serviços" removido — Victor). */}
        </div>
        {/* Selos de confiança REMOVIDOS de vez (Victor, 2026-07-17) — decisão final, não voltar. */}
      </div>
    </section>
  );
}
