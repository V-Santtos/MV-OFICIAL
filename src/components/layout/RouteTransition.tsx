"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { routeTransition } from "@/lib/animation";
import { MV_LOGO } from "@/components/ui/logo";
import { getLenis, travarRolagem } from "./SmoothScroll";
import styles from "./RouteTransition.module.css";

/**
 * Transição entre rotas com a logo — a cortina da abertura reaproveitada na
 * navegação (Victor, 2026-08-03).
 *
 * Painel entra por baixo → o "M" se desenha e preenche → a rota troca COM A
 * TELA COBERTA → painel sai pelo topo revelando a página nova. Mesma técnica e
 * mesma direção da `IntroReveal`, em ~1,6s (tempos em `routeTransition`).
 *
 * ⚠️ A `IntroReveal` NÃO foi refatorada pra compartilhar código com esta peça.
 * Ela são três partes amarradas (script de pré-paint + regra no globals.css +
 * a flag de sessão) e está validada no aparelho do Victor; o ganho de remover
 * ~15 linhas de timeline duplicada não paga o risco de mexer na abertura.
 *
 * Quem dispara: os cards do mosaico de Serviços e a logo/"Início" da Navbar
 * quando se está fora da home. O drawer mobile e os links de âncora seguem como
 * estavam — decisão de escopo do Victor.
 */

type Ctx = {
  /** Cobre a tela com a cortina, navega e revela. Ver `RouteTransitionProvider`. */
  transitionTo: (href: string) => void;
};

// Default no-op: quem consumir fora do provider (teste isolado, storybook)
// simplesmente não anima — nunca quebra.
const TransitionContext = createContext<Ctx>({ transitionTo: () => {} });

export function useRouteTransition(): Ctx {
  return useContext(TransitionContext);
}

/**
 * Interceptador de clique pros call sites: só o clique SIMPLES vira cortina.
 * Ctrl/Cmd/Shift/Alt-clique e botão do meio seguem abrindo em aba nova pelo
 * `href` nativo — por isso os links continuam sendo `<Link href>` de verdade,
 * com prefetch e URL real, e não botões.
 */
export function ehCliqueSimples(e: React.MouseEvent): boolean {
  return !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0);
}

export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  /** Pathname de destino enquanto a cortina está fechada (null = ociosa). */
  const destino = useRef<string | null>(null);
  /** True entre "a tela ficou coberta" e "a cortina começou a subir". */
  const coberto = useRef(false);
  /** Trava de reentrada: dois cliques rápidos não montam duas timelines. */
  const animando = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  /** `pathname` legível de dentro de callbacks (o closure envelhece). */
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  /** Sobe a cortina revelando a rota nova e devolve a página ao estado normal. */
  const revelar = useCallback(() => {
    if (!coberto.current) return;
    coberto.current = false;
    destino.current = null;

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const overlay = overlayRef.current;
    if (!overlay) return;

    // Topo ANTES de revelar: a rota nova monta na altura de rolagem da anterior
    // (o Lenis mantém o próprio estado, e `scrollRestoration` está em manual).
    // `force` alcança o alvo mesmo com o Lenis parado pela trava.
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);

    gsap.to(overlay, {
      yPercent: -100,
      duration: routeTransition.reveal.duration,
      ease: routeTransition.reveal.ease,
      onComplete: () => {
        // Volta pra baixo da tela, pronta pro próximo clique, e sai do caminho
        // do toque/foco enquanto ociosa. (`y: 0` pelo mesmo motivo do `cover`.)
        gsap.set(overlay, { y: 0, yPercent: 100 });
        overlay.style.visibility = "hidden";
        travarRolagem(false);
        animando.current = false;
      },
    });
  }, []);

  // A rota chegou de verdade → revela. É este efeito (e não um tempo fixo depois
  // do `push`) que garante que a cortina nunca suba mostrando a página ANTIGA:
  // `router.push` é assíncrono e pode demorar numa conexão ruim.
  useEffect(() => {
    if (coberto.current && destino.current === pathname) revelar();
  }, [pathname, revelar]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, []);

  const transitionTo = useCallback(
    (href: string) => {
      if (animando.current) return;

      const overlay = overlayRef.current;
      const svg = svgRef.current;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Sem cortina: reduced-motion ou refs ainda não montadas. Navega direto —
      // a transição é enfeite, nunca pode ser o que impede de chegar na página.
      if (!overlay || !svg || prefersReduced) {
        router.push(href);
        return;
      }

      animando.current = true;
      // O destino comparável é só o caminho: `/#hero` chega no `usePathname`
      // como `/`.
      destino.current = href.split("#")[0] || "/";
      travarRolagem(true);

      const paths = gsap.utils.toArray<SVGPathElement>("path", svg);

      // Estado inicial a cada uso (a cortina é reaproveitada): contorno "não
      // desenhado", sem preenchimento, painel fora da tela por baixo.
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, {
          strokeDasharray: len,
          strokeDashoffset: len,
          fillOpacity: 0,
          strokeOpacity: 1,
        });
      });
      // 🐞 `y: 0` JUNTO do `yPercent` — não é redundância. O CSS estaciona o
      // painel com `transform: translateY(100%)`, e o computed style disso é uma
      // MATRIZ em pixels: o GSAP lê `y: 900px` (a altura da tela), não "100%".
      // Sem zerar o `y`, o `yPercent` soma em cima dele e a cortina inteira fica
      // uma tela deslocada — o `cover` "cobria" fora da vista e só o `reveal`
      // atravessava a tela, DEPOIS da troca de rota (medido no probe).
      gsap.set(overlay, { y: 0, yPercent: 100 });
      gsap.set(svg, { autoAlpha: 1 });
      overlay.style.visibility = "visible";

      const tl = gsap.timeline();

      // 1. Painel sobe de baixo até cobrir a tela.
      tl.to(overlay, {
        yPercent: 0,
        duration: routeTransition.cover.duration,
        ease: routeTransition.cover.ease,
      });

      // 2. Desenha o contorno (as duas formas em stagger).
      tl.to(paths, {
        strokeDashoffset: 0,
        duration: routeTransition.draw.duration,
        ease: routeTransition.draw.ease,
        stagger: routeTransition.draw.stagger,
      });

      // 3. Preenche e apaga o traço.
      tl.to(
        paths,
        {
          fillOpacity: 1,
          strokeOpacity: 0,
          duration: routeTransition.fill.duration,
          ease: routeTransition.fill.ease,
          stagger: routeTransition.fill.stagger,
        },
        routeTransition.fillOverlap,
      );

      // 4. Tela coberta: navega. A revelação fica a cargo do efeito que observa
      //    o `pathname` — aqui só marcamos o estado e armamos a salvaguarda.
      tl.call(() => {
        coberto.current = true;
        router.push(href);
        timeoutRef.current = window.setTimeout(revelar, routeTransition.esperaMaxima);

        // Destino IGUAL ao caminho atual (ex.: a logo estando já na home): o
        // `pathname` não muda, então o efeito acima nunca dispararia e a cortina
        // ficaria pendurada até o teto de espera.
        if (pathnameRef.current === destino.current) {
          requestAnimationFrame(revelar);
        }
      });
    },
    [router, revelar],
  );

  return (
    <TransitionContext.Provider value={{ transitionTo }}>
      {children}

      {/* `data-route-curtain`: seletor ESTÁVEL pro probe (o className do CSS
          Module é hasheado no build). Ver probes/transicao-rota.mjs. */}
      <div
        ref={overlayRef}
        className={styles.overlay}
        data-route-curtain=""
        aria-hidden="true"
      >
        <svg ref={svgRef} className={styles.logo} viewBox={MV_LOGO.viewBox} aria-hidden="true">
          <path
            d={MV_LOGO.body}
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Mesma paleta da intro: o "V" no azul oficial (`--accent`). */}
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
    </TransitionContext.Provider>
  );
}
