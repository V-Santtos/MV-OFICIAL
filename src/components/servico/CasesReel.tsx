"use client";

/**
 * Reel horizontal de CASES — ref. de layout: gallery6 (shadcnblocks), porém
 * RECONSTRUÍDO limpo no padrão MV (regra de ouro: código não migra). Sem shadcn,
 * sem Embla: motor = scroll-snap NATIVO do CSS + JS mínimo só pras setas e pro
 * estado (habilita/desabilita nas pontas). Swipe no touch e trackpad vêm de graça.
 *
 * Cabeçalho no canto (título + subtítulo opcional), setas no lado oposto — o card
 * herda o "verniz" do site (bg-2, moldura fina, sombra funda). O track SANGRA pela
 * direita (o próximo card espia), assinatura do padrão de referência.
 *
 * Cada card é UM trabalho (uma foto por enquanto). O mecanismo de antes/depois
 * dentro do card é a próxima camada, depois desta casca ser aprovada.
 *
 * FOTO EM RETRATO 3:4 (Victor, 2026-08-01) — decisão de PROCESSO: o material
 * sempre vem do celular, e 3:4 é o retrato nativo da câmera. A foto entra sem
 * corte manual nenhum. Formato de entrega pro Victor: **1200×1600** (ou
 * 1500×2000 com folga), JPG/WEBP. Montagem antes/depois: empilhada, antes em
 * cima e depois embaixo, cada metade 1200×800.
 */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { revealHeadingVariants, staggerCard } from "@/lib/animation/motion";
import { CaseLightbox } from "./CaseLightbox";
import styles from "./CasesReel.module.css";

export interface CaseFoto {
  src: string;
  alt: string;
}

export interface CaseItem {
  id: string;
  title: string;
  summary: string;
  /**
   * Galeria do trabalho. A PRIMEIRA foto é a CAPA do card — escolher a mais
   * forte, é ela que decide se a pessoa abre ou não. Sem fotos, o card cai no
   * placeholder de marca (monograma).
   *
   * O card mostra só a capa, recortada em 3:4; as fotos INTEIRAS (sem corte
   * nenhum) só aparecem no Lightbox. Por isso montagem antes/depois pode vir
   * em 9:16 sem problema: o card corta, a galeria mostra completa.
   */
  fotos?: readonly CaseFoto[];
  /**
   * Campo INTERNO, nunca renderizado — mesma convenção do `real` em
   * `content/depoimentos.ts`. `true` = card de enchimento (carro e resultado
   * inventados), no ar só pra sustentar o visual do reel. Quantos desses
   * aparecem é decidido por `PLACEHOLDERS_VISIVEIS` em `casesPublicaveis()`;
   * os que sobram ficam no arquivo, ocultos — nunca são apagados.
   */
  placeholder?: boolean;
}

interface CasesReelProps {
  heading: string;
  subheading?: string;
  items: readonly CaseItem[];
}

function ArrowIcon({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={dir === "prev" ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function CasesReel({ heading, subheading, items }: CasesReelProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // Cascata de entrada CONTROLADA (padrão do projeto: useInView + animate),
  // nunca whileInView/useScroll — reveal on-enter, dispara uma vez.
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const revealState = inView ? "visible" : "hidden";
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  // Galeria: guarda QUAL case abriu e em que foto. Um estado só (não dois
  // booleanos) — assim é impossível existir "aberto sem case".
  const [galeria, setGaleria] = useState<{ item: CaseItem; indice: number } | null>(null);

  const abrirGaleria = useCallback((item: CaseItem, indice: number) => {
    setGaleria({ item, indice });
  }, []);
  const fecharGaleria = useCallback(() => setGaleria(null), []);

  const syncEdges = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    syncEdges();
    el.addEventListener("scroll", syncEdges, { passive: true });
    const ro = new ResizeObserver(syncEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      ro.disconnect();
    };
  }, [syncEdges]);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const el = viewportRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const slide = track.querySelector<HTMLElement>("[data-slide]");
    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    const step = slide ? slide.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: step * direction, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return (
    <section ref={sectionRef} className={styles.cases} aria-labelledby="cases-heading">
      <div className={styles.head}>
        <motion.div className={styles.headText} initial="hidden" animate={revealState}>
          <motion.h2 id="cases-heading" className={styles.title} variants={revealHeadingVariants}>
            {heading}
          </motion.h2>
          {subheading && (
            <motion.p className={styles.subtitle} variants={staggerCard} custom={0}>
              {subheading}
            </motion.p>
          )}
        </motion.div>
        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Ver trabalho anterior"
          >
            <ArrowIcon dir="prev" />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Ver próximo trabalho"
          >
            <ArrowIcon dir="next" />
          </button>
        </div>
      </div>

      <div className={styles.viewport} ref={viewportRef}>
        <motion.ul
          className={styles.track}
          ref={trackRef}
          initial="hidden"
          animate={revealState}
        >
          {items.map((item, i) => {
            const capa = item.fotos?.[0];
            const total = item.fotos?.length ?? 0;

            return (
              <motion.li
                key={item.id}
                className={styles.slide}
                data-slide
                variants={staggerCard}
                custom={i + 1}
              >
                {/* ESTRUTURA (Victor, 2026-08-01 — "mais vertical + premium"):
                    título e texto vivem DENTRO da foto, sobre um véu em degradê.
                    O gatilho de clique é um <button> transparente esticado por
                    cima de tudo, NÃO a moldura: <h3>/<p> são conteúdo de fluxo e
                    não podem morar dentro de <button> (HTML inválido, quebra
                    leitor de tela). Card sem foto não ganha gatilho — clicar num
                    placeholder e abrir o nada é pior que não ser clicável. */}
                <article className={styles.card}>
                  <div className={styles.media}>
                    {capa ? (
                      <Image
                        src={capa.src}
                        alt={capa.alt}
                        fill
                        /* Tem que ESPELHAR o .slide do CSS (min(86vw, 23rem)) —
                           já esteve 82vw/27rem, dessincronizado, e o Next servia
                           arquivo menor que o card e borrava. Mudou lá, muda aqui. */
                        sizes="(max-width: 640px) 86vw, 23rem"
                        className={styles.img}
                      />
                    ) : (
                      <div className={styles.mediaEmpty} aria-hidden="true">
                        <span className={styles.mono}>MV</span>
                      </div>
                    )}

                    {/* Véu: degradê de baixo pra cima + vinheta no topo. Só ele
                        garante que o texto tenha contraste sobre QUALQUER foto —
                        sem isso o título some numa capa clara. */}
                    <div className={styles.veu} aria-hidden="true" />

                    {total > 1 && (
                      <span className={styles.selo}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="3" y="3" width="13" height="13" rx="2" />
                          <path d="M8 21h11a2 2 0 0 0 2-2V8" />
                        </svg>
                        {total} fotos
                      </span>
                    )}

                    <div className={styles.legenda}>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardText}>{item.summary}</p>
                    </div>

                    {capa && (
                      <button
                        type="button"
                        className={styles.gatilho}
                        onClick={() => abrirGaleria(item, 0)}
                        aria-label={`Ver as ${total} fotos do trabalho: ${item.title}`}
                      />
                    )}
                  </div>
                </article>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>

      {/* GALERIA — fica FORA do viewport com scroll-snap de propósito: dentro,
          o overlay herdaria o recorte e o snap horizontal do track. */}
      <CaseLightbox
        fotos={galeria?.item.fotos ?? []}
        abertaEm={galeria?.indice ?? null}
        titulo={galeria?.item.title ?? ""}
        onFechar={fecharGaleria}
      />
    </section>
  );
}
