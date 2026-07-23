"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { sobre, type SobrePhoto } from "@/content";
import { marquee, scrollReveal } from "@/lib/animation";
import styles from "./Sobre.module.css";

/**
 * Seção "Quem somos" (About us) — ilha CLARA e PINADA (exceção ao dark).
 * Réplica de estrutura/efeito da ref MetroRide: a seção é alta e o palco fica
 * `sticky` (pinado) na viewport enquanto se rola. O progresso do scroll da
 * SEÇÃO dirige tudo — parágrafo acende palavra a palavra, fotos sobem em faixas
 * escalonadas e o marquee corre atrás. Framer Motion (mesmo stack da ref).
 *
 * ⚠️ Copy/fotos são placeholder; a cor clara é intencional (única ilha clara).
 */

/** Uma palavra que acende conforme o progresso cruza sua fatia. */
function Word({
  children,
  start,
  end,
  progress,
  reduced,
}: {
  children: string;
  start: number;
  end: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const opacity = useSpring(
    useTransform(progress, [start, end], [scrollReveal.fadedOpacity, 1]),
    scrollReveal.spring,
  );
  return (
    <motion.span className={styles.word} style={reduced ? { opacity: 1 } : { opacity }}>
      {children}
    </motion.span>
  );
}

/** Parágrafo revelado palavra por palavra sobre a janela de progresso da seção. */
function RevealParagraph({
  text,
  progress,
  reduced,
}: {
  text: string;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const words = text.split(" ");
  const [wStart, wEnd] = scrollReveal.window;
  const span = wEnd - wStart;

  return (
    <p className={styles.body}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          start={wStart + (i / words.length) * span}
          end={wStart + ((i + 1) / words.length) * span}
          progress={progress}
          reduced={reduced}
        >
          {/* espaço à direita: preserva separação e permite quebra de linha */}
          {`${word} `}
        </Word>
      ))}
    </p>
  );
}

/** Foto em parallax PURO (sem opacidade): sobe de `fromY` (abaixo do palco,
 *  escondida) → `toY` (descanso). Entradas escalonadas = surgem distribuídas
 *  pelo movimento, não por fade. */
function Photo({
  photo,
  progress,
  reduced,
}: {
  photo: SobrePhoto;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const lane = scrollReveal.photoLanes[photo.lane];
  const y = useTransform(progress, [0, 1], [lane.fromY, lane.toY]);

  return (
    <div className={styles.lane} data-lane={photo.lane}>
      {/* Reduced-motion: parada numa posição visível fixa (sem esteira). */}
      <motion.div className={styles.photo} style={{ y: reduced ? lane.staticY : y }}>
        {photo.video && !reduced ? (
          // Loop mudo e decorativo: sem controles, sem áudio, sem entrar na
          // ordem de foco. Em reduced-motion cai no poster (o ramo de baixo).
          <video
            className={styles.photoVideo}
            src={photo.video}
            poster={photo.src}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
          />
        ) : (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 48rem) 60vw, 24vw"
            className={styles.photoImg}
          />
        )}
      </motion.div>
    </div>
  );
}

/** Marquee horizontal contínuo — duas metades idênticas p/ emenda invisível. */
function Marquee({ text, reduced }: { text: string; reduced: boolean }) {
  const run = text.repeat(6);
  return (
    <div className={styles.marquee} aria-hidden="true">
      <motion.div
        className={styles.marqueeTrack}
        animate={reduced ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduced
            ? undefined
            : { duration: marquee.duration, ease: "linear", repeat: Infinity }
        }
      >
        <span className={styles.marqueeText}>{run}</span>
        <span className={styles.marqueeText}>{run}</span>
      </motion.div>
    </div>
  );
}

export function Sobre() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: scrollReveal.sectionOffset,
  });
  const { scrollYProgress: textProgress } = useScroll({
    target: sectionRef,
    offset: scrollReveal.textOffset,
  });

  return (
    <section
      ref={sectionRef}
      id="quem-somos"
      aria-labelledby="sobre-label"
      className={styles.section}
    >
      {/* Palco pinado (sticky) — cobre a viewport durante a rolagem da seção. */}
      <div className={styles.stage}>
        <Marquee text={sobre.marquee} reduced={reduced} />

        <div className={styles.photos}>
          {sobre.photos.map((photo) => (
            <Photo
              key={photo.src}
              photo={photo}
              progress={sectionProgress}
              reduced={reduced}
            />
          ))}
        </div>

        <div className={styles.content}>
          <div className={styles.head}>
            <p id="sobre-label" className={styles.label}>
              <span className={styles.index}>{sobre.index}</span>
              <span className={styles.dot} aria-hidden="true">
                •
              </span>
              <span className={styles.labelText}>{sobre.label}</span>
            </p>

            <RevealParagraph text={sobre.body} progress={textProgress} reduced={reduced} />
          </div>
        </div>
      </div>
    </section>
  );
}
