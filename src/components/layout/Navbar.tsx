"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { assets, brand, navLinks } from "@/content";
import { introDelay, navCascade, onIntroReveal, INTRO_ATIVA } from "@/lib/animation";
import { Button } from "@/components/ui";
import { MobileMenu } from "./MobileMenu";
import { ehCliqueSimples, useRouteTransition } from "./RouteTransition";
import styles from "./Navbar.module.css";

/** Destino de "Início" e da logo. Fora da home é troca de rota; na home, âncora. */
const HOME_HREF = "/#hero";

export function Navbar() {
  const [revealed, setRevealed] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { transitionTo } = useRouteTransition();

  /**
   * Volta pra home (logo e "Início").
   *
   * ESTANDO NUMA ROTA DE SERVIÇO isso é troca de rota, e passa pela cortina da
   * logo (Victor, 2026-08-03) — antes era recarga completa, com o flash branco
   * no meio. NA PRÓPRIA HOME segue sendo âncora nativa: o `<a href="/#hero">`
   * rola até o topo como sempre fez, comportamento já validado que não vale a
   * pena trocar por navegação client-side só pra uniformizar.
   */
  const voltarPraHome = (e: React.MouseEvent) => {
    if (pathname === "/" || !ehCliqueSimples(e)) return;
    e.preventDefault();
    transitionTo("/");
  };

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

  // ⚠️ A trava de rolagem NÃO fica mais aqui. Ela mudou de `body.overflow` pra
  // `lenis.stop()` e vive dentro do `MobileMenu`, junto do resto do ciclo de
  // abertura — com o Lenis rodando, `overflow:hidden` no body não basta: ele
  // mantém o próprio loop de rAF e segue processando o scroll por baixo.

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

    // Sem abertura, a entrada é a do CSS (`html[data-entrada-css]`, globals.css).
    if (!INTRO_ATIVA) return;

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

  // Com o menu aberto, o drawer cobre a navbar inteira. `inert` tira a logo e o
  // hambúrguer cobertos da ordem de foco / leitor de tela (o X do drawer fecha).
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    if (open) nav.setAttribute("inert", "");
    else nav.removeAttribute("inert");
  }, [open]);

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
            href={HOME_HREF}
            aria-label={`${brand.name} — início`}
            className={styles.logo}
            onClick={voltarPraHome}
            data-reveal="0"
          >
            {/* ⚠️ PNG de propósito, NÃO trocar pelo SVG de `ui/logo.ts`
                (tentado e revertido em 2026-08-01). O vetor NÃO é fiel ao
                original: no PNG existe um respiro entre o chevron e o corpo do
                "M", e no traçado vetorizado as duas formas se encostam. O SVG
                serve pra intro (onde o contorno é desenhado), não pra marca
                parada. Ver ANEXO-MEMORIA antes de mexer. */}
            <Image
              src={assets.logo}
              alt={brand.name}
              width={120}
              height={38}
              /* SEM `priority`/`preload`/`loading` (2026-08-04): qualquer um dos
                 três emite um 2º `<link rel=preload as=image>` que disputa a fila
                 crítica com o carro do Hero — o elemento de LCP, e que ainda por
                 cima está escondido atrás da cortina de abertura. No default o
                 logo continua baixando de imediato (está na viewport), só não
                 fura a fila. Medido no `next start`: `loading="eager"` NÃO
                 resolve, o preload sai do mesmo jeito. */
              className={styles.logoImg}
            />
          </a>

          <ul className={styles.links}>
            {navLinks.map(({ href, label }, i) => (
              <li key={href} data-reveal={i + 1}>
                {/* Só "Início" passa pela cortina (e só fora da home). Os
                    demais são ÂNCORAS da home e seguem como estavam. */}
                <a
                  href={href}
                  className={styles.link}
                  onClick={href === HOME_HREF ? voltarPraHome : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.cta} data-reveal={navLinks.length + 1}>
            <Button href="/#contato" variant="light" className={styles.ctaBtn}>
              Contato
            </Button>
          </div>

          {/* Fica ACIMA do painel do menu (z-index no CSS) pra virar X e fechar
              sem precisar de um segundo botão dentro da cortina. */}
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={styles.burger}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            data-reveal="1"
          >
            <span className={styles.burgerTop} data-open={open} />
            <span className={styles.burgerMid} data-open={open} />
            <span className={styles.burgerBottom} data-open={open} />
          </button>
        </div>
      </nav>

      <MobileMenu open={open} onClose={close} botaoRef={burgerRef} />
    </>
  );
}
