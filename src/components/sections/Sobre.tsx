"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
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
 * 🚩 IGNORA `prefers-reduced-motion` DE PROPÓSITO (Victor, 2026-08-09). Esse
 * pin + parallax É o efeito-âncora do site — o que faz ele parecer prêmio.
 * Fomos atrás do porquê no site de referência (bogdankolomiyets.com): a seção
 * dele com o mesmo efeito (`.selected-projects`, cards passando, pinado)
 * TAMBÉM não checa a preferência — continua rodando igual, toggle ligado ou
 * desligado. Testamos ao vivo nos dois modos: ela segue `position: sticky` e
 * os cards seguem trocando de qualquer jeito.
 * Decisão consciente: quem tem "Reduzir Movimento" ligado é, na prática, muito
 * mais gente com o Android em economia de bateria (que liga isso sozinho) do
 * que gente com sensibilidade real a movimento — e a MV não pode abrir mão do
 * efeito que mais comunica "acabamento premium" pra atender esse grupo minoritário.
 * Havia uma versão anterior que desmontava o palco nesse modo (ver histórico);
 * foi removida — não reintroduzir sem essa mesma conversa de novo.
 *
 * ⚠️ Copy/fotos são placeholder; a cor clara é intencional (única ilha clara).
 */

/** Uma palavra que acende conforme o progresso cruza sua fatia. */
function Word({
  children,
  start,
  end,
  progress,
}: {
  children: string;
  start: number;
  end: number;
  progress: MotionValue<number>;
}) {
  const opacity = useSpring(
    useTransform(progress, [start, end], [scrollReveal.fadedOpacity, 1]),
    scrollReveal.spring,
  );
  return (
    <motion.span className={styles.word} style={{ opacity }}>
      {children}
    </motion.span>
  );
}

/** Parágrafo revelado palavra por palavra sobre a janela de progresso da seção. */
function RevealParagraph({
  text,
  progress,
}: {
  text: string;
  progress: MotionValue<number>;
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
        >
          {/* espaço à direita: preserva separação e permite quebra de linha */}
          {`${word} `}
        </Word>
      ))}
    </p>
  );
}

/**
 * `sizes` por lane — ESPELHA as larguras de `.lane[data-lane=N]` no CSS.
 *
 * 🚩 Cada lane tem uma moldura DIFERENTE (290px a 700px). Um `sizes` único pra
 * todas (era `24vw`) fazia o navegador pedir a foto pela moldura errada: medido
 * em 2026-08-09, a lane 3 (`salao.webp`) vinha com 256px numa moldura de 614px
 * = 0,42× da resolução — e o defeito NÃO aparece como lentidão, aparece como
 * BORRÃO (em retina, 0,21×). Mexeu na largura no CSS, mexe aqui junto.
 */
const laneSizes: Record<SobrePhoto["lane"], string> = {
  // desktop: `min(40vw, 290px)` — a partir de 768px o teto de 290px já vale.
  1: "(max-width: 767px) 50vw, 290px",
  2: "(max-width: 767px) 46vw, 290px",
  // `min(62vw, 700px)`: 62vw manda até o teto bater, em 1129px de viewport.
  3: "(max-width: 767px) 70vw, (max-width: 1129px) 62vw, 700px",
  // 300px de moldura × o `scale(1.12)` que o CSS aplica na própria imagem.
  4: "(max-width: 767px) 50vw, 336px",
};

/** Foto em parallax PURO (sem opacidade): sobe de `fromY` (abaixo do palco,
 *  escondida) → `toY` (descanso). Entradas escalonadas = surgem distribuídas
 *  pelo movimento, não por fade. */
function Photo({
  photo,
  progress,
}: {
  photo: SobrePhoto;
  progress: MotionValue<number>;
}) {
  const lane = scrollReveal.photoLanes[photo.lane];
  const y = useTransform(progress, [0, 1], [lane.fromY, lane.toY]);

  // 🚩 O <video> só MONTA perto da viewport (medido, 2026-08-03): com ele no
  // SSR, o `autoPlay` vence o `preload="metadata"` — o navegador baixa o
  // arquivo INTEIRO no load, e era a maior transferência da página (720 KiB
  // terminando a ~5,7s no 4G lento), na frente do JS que a intro espera.
  // `useInView` do Framer (padrão do projeto), gatilho `once`. Até montar, o
  // ramo de baixo (Image do poster) segura o visual — é o MESMO frame do vídeo.
  // ⚠️ Margem de 200px, não mais: a lane é `top: 0` do palco (o transform do
  // parallax não muda a caixa dela), então margem de ~1 tela alcançava a seção
  // ainda NO LOAD e o download voltava pro caminho crítico (medido: 800px
  // reintroduzia os 429 KiB @4,1s). (O observer só roda pós-hidratação, mas
  // aqui isso não é o problema do mapa do Contato: a seção fica ~3 telas
  // abaixo, hidrata muito antes.)
  const laneRef = useRef<HTMLDivElement>(null);
  const nearView = useInView(laneRef, { once: true, margin: "0px 0px 200px 0px" });

  // Salvaguarda do autoplay: em vídeo montado DEPOIS da carga (o nosso caso),
  // alguns Safari ignoram o atributo `autoPlay`. O play() imperativo cobre;
  // o catch engole o NotAllowedError — aí fica o poster, que é o mesmo frame.
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (nearView) videoRef.current?.play().catch(() => {});
  }, [nearView]);

  return (
    <div ref={laneRef} className={styles.lane} data-lane={photo.lane}>
      <motion.div className={styles.photo} style={{ y }}>
        {photo.video && nearView ? (
          // Loop mudo e decorativo: sem controles, sem áudio, sem entrar na
          // ordem de foco.
          <video
            ref={videoRef}
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
            sizes={laneSizes[photo.lane]}
            className={styles.photoImg}
          />
        )}
      </motion.div>
    </div>
  );
}

/** Marquee horizontal contínuo — duas metades idênticas p/ emenda invisível. */
function Marquee({ text }: { text: string }) {
  const run = text.repeat(6);
  return (
    <div className={styles.marquee} aria-hidden="true">
      <motion.div
        className={styles.marqueeTrack}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: marquee.duration, ease: "linear", repeat: Infinity }}
      >
        <span className={styles.marqueeText}>{run}</span>
        <span className={styles.marqueeText}>{run}</span>
      </motion.div>
    </div>
  );
}

export function Sobre() {
  const sectionRef = useRef<HTMLElement>(null);
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
        <Marquee text={sobre.marquee} />

        <div className={styles.photos}>
          {sobre.photos.map((photo) => (
            <Photo key={photo.src} photo={photo} progress={sectionProgress} />
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

            <RevealParagraph text={sobre.body} progress={textProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}
