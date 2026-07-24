"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { circulo } from "@/content";
import { circuloReveal } from "@/lib/animation";
import styles from "./Circulo.module.css";

/**
 * Seção "Círculo" — transição CLARO → DARK (ref MetroRide "Round Section").
 * Seção alta com palco PINADO claro; dentro, um círculo escuro cresce (scale)
 * dirigido pelo scroll até cobrir a viewport. Quando o palco solta, o fundo
 * dark da seção já está por baixo — emenda direto na próxima seção escura.
 *
 * O texto usa `mix-blend-mode: difference` (via CSS) pra ser legível tanto no
 * claro quanto no escuro, invertendo conforme o círculo passa por baixo dele.
 * Texto é placeholder (ver content/circulo).
 */
export function Circulo() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;

  // Retrato usa uma trava de estado inicial DIFERENTE (o círculo já entra no
  // tamanho do "print 2", quebrando o vão branco); o desktop, aprovado, segue com
  // a rampa original. É `matchMedia` e não só CSS porque o mapa de escala vive no
  // JS (Framer), não no CSS. Inicia `false` (= server/desktop) pra casar a
  // hidratação; ajusta no mount. (Victor, 2026-07-24.)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: circuloReveal.offset });
  const scale = useTransform(
    scrollYProgress,
    isMobile ? circuloReveal.scaleInputMobile : circuloReveal.scaleInput,
    isMobile ? circuloReveal.scaleOutputMobile : circuloReveal.scaleOutput,
  );
  // Deslocamento vertical amarrado ao scroll: entra pra cima (peek) e volta ao
  // centro antes de expandir. Círculo e texto usam o MESMO `lift` → alinhados.
  const lift = useTransform(scrollYProgress, circuloReveal.liftInput, circuloReveal.liftOutput);
  const textClip = useTransform(scale, (value) => `circle(${75 * value}vmax at 50% 50%)`);

  // Mobile — SAÍDA da frase por FADE + BLUR (Victor, 2026-07-24). No desktop a
  // frase saía só por scroll físico, e por isso o título de Serviços esperava
  // (margem -45%) pra não aparecer junto com "Do cuidado ao resultado". No mobile
  // a frase SOME visualmente aqui (borra e esvazia — a MESMA linguagem do título
  // do Processo), o que libera apertar o gatilho de Serviços sem os dois se
  // cruzarem, encurtando o vão escuro.
  // ⚠️ Amarrado a um `useScroll` SEPARADO de SAÍDA — não ao `scrollYProgress` da
  // seção, que TRAVA em 1.0 enquanto o palco ainda está pinado (aí a frase apagava
  // com o cover PARADO na tela = "sumia cedo"). Este offset mede o cover subindo
  // pra fora (fim da seção do topo→base da viewport), então a frase segura toda a
  // cobertura e só dissolve quando o escuro começa a sair.
  const { scrollYProgress: exitProgress } = useScroll({
    target: ref,
    offset: ["end end", "end start"],
  });
  const headExitOpacity = useTransform(exitProgress, [0.15, 0.45], [1, 0]);
  const headExitBlur = useTransform(exitProgress, [0.15, 0.45], [0, 5]);
  const headExitFilter = useMotionTemplate`blur(${headExitBlur}px)`;

  return (
    <section ref={ref} aria-label="Transição" className={styles.section}>
      <div className={styles.stage}>
        {/* Reduced-motion: círculo já cheio (dark), sem crescer.
            Mobile (Opção 2, Victor 2026-07-24): SEM peek — `y` fixo em 0. O peek
            (`lift` -100→0) fazia o círculo DESCER durante a entrada, um movimento
            que briga com o scroll natural e incomoda no touch. Aqui ele fica
            travado e imóvel, subindo só junto com a página até pinar e expandir. */}
        <motion.div
          className={styles.circle}
          style={{ scale: reduced ? 1 : scale, y: reduced || isMobile ? 0 : lift }}
          aria-hidden="true"
        />
        <div className={styles.textLayer}>
          <motion.h2
            className={styles.heading}
            style={{
              y: reduced || isMobile ? 0 : lift,
              clipPath: reduced ? "none" : textClip,
              // Fade+blur de saída SÓ no mobile; desktop segue sem (sai por scroll).
              opacity: isMobile && !reduced ? headExitOpacity : 1,
              filter: isMobile && !reduced ? headExitFilter : undefined,
            }}
          >
            {circulo.title} <span className={styles.emphasis}>{circulo.emphasis}</span>
          </motion.h2>
        </div>
      </div>
    </section>
  );
}
