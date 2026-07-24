"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { brand, navLinks, servicos } from "@/content";
import { menuOverlay } from "@/lib/animation";
import { travarRolagem } from "./SmoothScroll";
import styles from "./MobileMenu.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Botão hambúrguer — o foco volta pra ele ao fechar. */
  botaoRef: React.RefObject<HTMLButtonElement | null>;
};

/** Elementos focáveis dentro do painel, na ordem do DOM. */
const FOCAVEIS = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Menu mobile de tela cheia.
 *
 * Substitui o drawer em CSS puro que existia na `Navbar` (fade de
 * opacity/visibility, sem Esc, sem foco preso, e travando a rolagem por
 * `body.overflow` — que é o mecanismo errado com o Lenis rodando).
 *
 * Coreografia em GSAP (`menuOverlay`): a cortina DESCE e cobre a página, e os
 * itens entram em cascata sobrepondo o fim do movimento. É a intro ao contrário
 * — mesma curva, sentido oposto. A timeline é construída UMA vez e dirigida por
 * `play()`/`reverse()`, então fechar é exatamente a abertura de trás pra frente.
 */
export function MobileMenu({ open, onClose, botaoRef }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // ---- Timeline (montada uma vez) ----
  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const itens = gsap.utils.toArray<HTMLElement>("[data-menu-item]", panel);

      const tl = gsap.timeline({
        paused: true,
        // Terminada a volta, o painel volta a `visibility: hidden` — sai da
        // ordem de foco e deixa de capturar toque.
        onReverseComplete: () => {
          root.style.visibility = "";
        },
      });

      // ⚠️ `visibility` NÃO entra na timeline (nada de `autoAlpha` no `.root`).
      // Na abertura ela precisa valer no MESMO frame, antes de mover o foco: o
      // GSAP só aplicaria no próximo tick do ticker, e `.focus()` dentro de uma
      // subárvore `visibility: hidden` falha EM SILÊNCIO. Por isso o `.root` é
      // mostrado à mão no efeito de abrir, e a timeline anima só `opacity`.
      if (prefersReduced) {
        tl.fromTo(root, { opacity: 0 }, { opacity: 1, ...menuOverlay.reduced });
      } else {
        tl.set(root, { opacity: 1 })
          // Lateral: entra pela DIREITA, o lado do hambúrguer.
          .fromTo(panel, { xPercent: 100 }, { xPercent: 0, ...menuOverlay.panel })
          .fromTo(itens, menuOverlay.items.from, menuOverlay.items.to, menuOverlay.items.overlap);
      }

      tlRef.current = tl;
    }, root);

    return () => {
      ctx.revert();
      tlRef.current = null;
    };
  }, []);

  // ---- Abrir / fechar ----
  useEffect(() => {
    const tl = tlRef.current;
    const root = rootRef.current;
    if (!tl || !root) return;

    if (open) {
      // ⚠️ `visibility` é aplicada À MÃO e AQUI, não pela timeline. O efeito de
      // foco roda logo abaixo, no MESMO commit; se o painel ainda estiver
      // `visibility: hidden` nesse instante, `.focus()` falha em silêncio
      // (elemento invisível não entra na ordem de foco). O GSAP só aplicaria
      // no próximo tick do ticker — tarde demais.
      root.style.visibility = "visible";
      tl.play();
    } else {
      // Voltar pra `hidden` é tarefa do `onReverseComplete` da timeline: se
      // fosse aqui, o painel sumiria de imediato e comeria a animação de saída.
      tl.reverse();
    }

    travarRolagem(open);
  }, [open]);

  // ---- Esc, foco preso e devolução do foco ----
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    // O primeiro link recebe o foco: quem navega por teclado ou leitor de tela
    // entra no menu, não continua na página coberta atrás dele.
    const primeiro = panel.querySelector<HTMLElement>(FOCAVEIS);
    primeiro?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      // Foco preso: o Tab circula DENTRO do painel enquanto ele está aberto.
      // Sem isto o foco vaza pros links da página coberta, que estão invisíveis.
      const focaveis = Array.from(panel.querySelectorAll<HTMLElement>(FOCAVEIS));
      if (!focaveis.length) return;

      const primeiroEl = focaveis[0];
      const ultimoEl = focaveis[focaveis.length - 1];
      const ativo = document.activeElement;

      if (e.shiftKey && ativo === primeiroEl) {
        e.preventDefault();
        ultimoEl.focus();
      } else if (!e.shiftKey && ativo === ultimoEl) {
        e.preventDefault();
        primeiroEl.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      // Devolve o foco ao hambúrguer — sem isso ele volta pro <body> e a
      // próxima tecla Tab recomeça do topo da página.
      botaoRef.current?.focus();
    };
  }, [open, onClose, botaoRef]);

  // ---- Esconde o resto da página dos leitores de tela ----
  // `inert` remove o conteúdo coberto da árvore de acessibilidade E do foco.
  // Aplicado imperativamente porque `main`/`footer` são irmãos deste componente.
  useEffect(() => {
    const alvos = [document.querySelector("main"), document.querySelector("footer")];

    for (const el of alvos) {
      if (!el) continue;
      if (open) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    }

    return () => {
      for (const el of alvos) el?.removeAttribute("inert");
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={styles.root}
      id="mobile-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
    >
      <div ref={panelRef} className={styles.panel}>
        <div className={styles.inner}>
          {/* Fechar: o drawer cobre a navbar inteira, então o X mora AQUI dentro
              (não é mais o hambúrguer flutuando por cima). Canto superior direito,
              onde o hambúrguer estava — a troca lê como o mesmo botão. */}
          <button
            type="button"
            className={styles.fechar}
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>

          {/* Só ESTA área rola. O rodapé com o CTA fica fora dela, sempre à
              vista — a lista de navegação + 6 serviços passava da altura útil
              do Safari e empurrava o botão pra baixo da dobra.
              `data-lenis-prevent`: sem ele o Lenis sequestra a rolagem interna. */}
          <div className={styles.rolagem} data-lenis-prevent>
            <nav className={styles.bloco} aria-label="Navegação principal">
              <ul className={styles.lista}>
                {navLinks.map(({ href, label }, i) => (
                  <li key={href} className={styles.item} data-menu-item>
                    <a href={href} className={styles.link} onClick={onClose}>
                      <span className={styles.indice}>{String(i + 1).padStart(2, "0")}</span>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Atalho pras 6 categorias. Hoje só se chega nelas pelo mosaico da
                home — de dentro de `/servicos/[slug]` não há como pular pra
                outra sem voltar. (Bloco novo; se o Victor não quiser, sai
                inteiro e o menu passa a caber sem rolar.) */}
            <div className={styles.bloco} data-menu-item>
              <p className={styles.rotulo}>Serviços</p>
              <ul className={styles.lista}>
                {servicos.map(({ slug, title }) => (
                  <li key={slug} className={styles.servicoItem}>
                    <a href={`/servicos/${slug}`} className={styles.servico} onClick={onClose}>
                      {title}
                      <svg
                        className={styles.seta}
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <path d="M4 12 12 4M6 4h6v6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 🚫 SEM CTA aqui (Victor, 2026-07-23): "Avaliação gratuita" já é o
              botão do Hero, que está logo atrás desta cortina. Repetir o mesmo
              destino a dois toques de distância não acrescenta caminho — só
              peso. Sobra a localidade, que é informação, não ação. */}
          <div className={styles.rodape} data-menu-item>
            <p className={styles.local}>{brand.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
