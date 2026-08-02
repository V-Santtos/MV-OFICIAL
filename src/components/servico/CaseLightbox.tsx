"use client";

/**
 * LIGHTBOX de case — galeria em tela cheia (Victor, 2026-08-01).
 *
 * POR QUE ELE EXISTE (a decisão, pra ninguém desfazer sem saber):
 * as fotos do Victor são montagens ANTES/DEPOIS empilhadas, em 9:16. O card do
 * reel é 3:4, então `object-fit: cover` come ~25% da altura — justo o topo do
 * "antes" e a base do "depois". Aqui a foto aparece com `contain`, INTEIRA.
 * O card é a chamada; a prova está neste overlay.
 *
 * Também foi decidido NÃO botar setas nem miniaturas dentro do card: o reel já
 * é uma navegação horizontal, e uma segunda dentro dele vira o mesmo gesto de
 * arrastar no celular — as duas brigam. Uma navegação por nível.
 *
 * ⚠️ SCROLL: usa `travarRolagem()` do SmoothScroll, NUNCA `body.overflow` —
 * com o Lenis rodando ele mantém o próprio rAF e continua rolando por baixo.
 *
 * ⚠️ ESTRUTURA: o miolo vive num componente separado (`Galeria`) que só existe
 * enquanto está aberto. É de propósito — assim o índice da foto nasce do
 * `useState(inicial)` no mount, sem effect de sincronia (que gerava render em
 * cascata e era pego pelo `react-hooks/set-state-in-effect`).
 */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { travarRolagem } from "@/components/layout";
import type { CaseFoto } from "./CasesReel";
import styles from "./CaseLightbox.module.css";

interface CaseLightboxProps {
  fotos: readonly CaseFoto[];
  /** Índice inicial; `null` = fechado. */
  abertaEm: number | null;
  titulo: string;
  onFechar: () => void;
}

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={dir === "prev" ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function CaseLightbox({ fotos, abertaEm, titulo, onFechar }: CaseLightboxProps) {
  const aberto = abertaEm !== null && abertaEm >= 0 && abertaEm < fotos.length;

  return (
    <AnimatePresence>
      {aberto && (
        <Galeria fotos={fotos} inicial={abertaEm} titulo={titulo} onFechar={onFechar} />
      )}
    </AnimatePresence>
  );
}

function Galeria({
  fotos,
  inicial,
  titulo,
  onFechar,
}: {
  fotos: readonly CaseFoto[];
  inicial: number;
  titulo: string;
  onFechar: () => void;
}) {
  const [i, setI] = useState(inicial);
  const overlayRef = useRef<HTMLDivElement>(null);
  // Pra devolver o foco ao card que abriu — sem isso o teclado volta pro topo.
  const focoAnterior = useRef<HTMLElement | null>(null);

  const irPara = useCallback(
    (proximo: number) => {
      // Circular: da última volta pra primeira. Numa galeria de 4 é o esperado.
      setI((proximo + fotos.length) % fotos.length);
    },
    [fotos.length],
  );

  // Trava a rolagem e administra o foco enquanto o overlay vive. Sincronia com
  // sistema externo (Lenis + foco do documento) — este effect é legítimo.
  useEffect(() => {
    focoAnterior.current = document.activeElement as HTMLElement | null;
    travarRolagem(true);
    overlayRef.current?.focus();

    return () => {
      travarRolagem(false);
      focoAnterior.current?.focus?.();
    };
  }, []);

  // Teclado no OVERLAY (não no window): fechado, não sequestra as setas da página.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onFechar();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        irPara(i + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        irPara(i - 1);
      }
    },
    [i, irPara, onFechar],
  );

  const foto = fotos[i];
  if (!foto) return null;

  return (
    <motion.div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos do trabalho: ${titulo}`}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Clicar no fundo fecha. É um <button> de verdade (não uma div com
          onClick) pra continuar acessível por teclado e leitor de tela. */}
      <button
        type="button"
        className={styles.fundo}
        onClick={onFechar}
        aria-label="Fechar galeria"
        tabIndex={-1}
      />

      <div className={styles.barra}>
        <p className={styles.contador} aria-live="polite">
          {i + 1} <span className={styles.contadorSep}>/</span> {fotos.length}
        </p>
        <button type="button" className={styles.fechar} onClick={onFechar} aria-label="Fechar galeria">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* PALCO: a foto INTEIRA (`contain`), nunca cortada. `key` no motion faz
          cada troca ter seu próprio fade — sem isso a imagem trocaria seca. */}
      <div className={styles.palco}>
        <AnimatePresence mode="wait">
          <motion.figure
            key={foto.src}
            className={styles.figura}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            // Swipe no touch: só aqui dentro, e o overlay já travou a página.
            drag={fotos.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) irPara(i + 1);
              else if (info.offset.x > 60) irPara(i - 1);
            }}
          >
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              sizes="(max-width: 900px) 100vw, 80vh"
              className={styles.img}
              priority
              draggable={false}
            />
          </motion.figure>
        </AnimatePresence>
      </div>

      {fotos.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.seta} ${styles.setaPrev}`}
            onClick={() => irPara(i - 1)}
            aria-label="Foto anterior"
          >
            <Chevron dir="prev" />
          </button>
          <button
            type="button"
            className={`${styles.seta} ${styles.setaNext}`}
            onClick={() => irPara(i + 1)}
            aria-label="Próxima foto"
          >
            <Chevron dir="next" />
          </button>
        </>
      )}

      <p className={styles.legenda}>{titulo}</p>
    </motion.div>
  );
}
