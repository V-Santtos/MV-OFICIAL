"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { brand, contact, contactSection } from "@/content";
import { revealHeading, revealUp } from "@/lib/animation";
import { Button, WhatsAppIcon } from "@/components/ui";
import styles from "./Contato.module.css";

/** Espera antes de remontar o mapa depois que o ponteiro sai (ms). Curto demais
 *  recarrega quando a pessoa só passa o mouse por cima indo pro rodapé. */
const MAP_RESET_DELAY = 1200;

/** Duração do crossfade entre o mapa antigo e o novo (ms). Precisa bater com o
 *  `transition` de `.mapFrame` no CSS. */
const MAP_FADE = 600;

/**
 * Um iframe do mapa. Nasce invisível e só aparece depois do `load` — é isso que
 * elimina o "retângulo preto" que o Victor viu (2026-07-22): antes o fade rodava
 * por tempo fixo e terminava ANTES de o Google desenhar o mapa, então entrava
 * uma janela vazia e o conteúdo estourava depois.
 */
function MapaFrame({
  src,
  title,
  onReady,
}: {
  src: string;
  title: string;
  onReady: () => void;
}) {
  const [ready, setReady] = useState(false);

  return (
    <iframe
      className={`${styles.mapFrame} ${ready ? styles.mapFrameReady : ""}`}
      src={src}
      title={title}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen={false}
      onLoad={() => {
        setReady(true);
        onReady();
      }}
    />
  );
}

/**
 * Devolve o mapa ao estado default depois que o usuário mexe nele e sai
 * (Victor, 2026-07-22: "pra não ficar perdido no mapa, colocou num lugar que
 * não sabe voltar").
 *
 * O iframe é de OUTRO DOMÍNIO — não há como pedir a ele "recentralize". O que dá
 * é REMONTAR: trocando a `key`, o React descarta o iframe e cria outro, que
 * carrega de novo na busca pela MV, com o cartão da ficha aberto.
 *
 * Só remonta se houve interação de verdade — sem isso, cada passada de mouse
 * custaria um carregamento à toa. Dois gatilhos, porque `pointerleave` não é
 * confiável no toque:
 *  · ponteiro saiu da janela (desktop);
 *  · a seção saiu da tela (mobile e "rolei pra longe e voltei depois").
 *
 * 🐞 COMO DETECTAR A INTERAÇÃO — não repetir o erro: a 1ª versão usava
 * `onPointerDown` no wrapper e NUNCA disparava. **Evento de mouse dentro de um
 * iframe cross-origin não chega ao documento pai** — o clique acontece no
 * documento do Google. A flag ficava falsa e o reset nunca rodava (Victor:
 * "não está voltando"). O sinal que funciona é o FOCO: clicar no iframe tira o
 * foco da janela principal, então no `blur` do window basta olhar se o
 * `document.activeElement` é o nosso iframe.
 */
function useMapaReset() {
  /**
   * CROSSFADE: durante o reset existem DOIS iframes na janela — o antigo, ainda
   * pintado, e o novo carregando por cima invisível. Quando o novo termina de
   * carregar ele aparece, e só então o antigo é descartado. Sem isso, o iframe
   * novo entra vazio e a janela pisca preta (Victor, 2026-07-22).
   */
  const [frames, setFrames] = useState<readonly number[]>([0]);
  const nextKey = useRef(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const interacted = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    if (!interacted.current) return;
    interacted.current = false;
    nextKey.current += 1;
    const key = nextKey.current;
    setFrames((f) => [...f, key]);
  }, []);

  /** O iframe `key` acabou de carregar. Se ele é o mais novo, o fade já começou:
   *  ao fim dele, descarta os antigos. (Agendar FORA do updater do `setFrames` —
   *  o updater pode rodar duas vezes em StrictMode.) */
  const onFrameReady = useCallback((key: number) => {
    if (key !== nextKey.current) return;
    if (dropTimer.current) clearTimeout(dropTimer.current);
    dropTimer.current = setTimeout(() => setFrames([key]), MAP_FADE);
  }, []);

  /** Clique nas bordas do wrapper (fora do iframe) — vale como interação. */
  const onPointerDown = useCallback(() => {
    interacted.current = true;
    cancel();
  }, [cancel]);

  const onPointerLeave = useCallback(() => {
    cancel();
    timer.current = setTimeout(reset, MAP_RESET_DELAY);
  }, [cancel, reset]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    // Foco: o único sinal que atravessa a fronteira do iframe cross-origin.
    const onBlur = () => {
      const active = document.activeElement;
      if (active instanceof HTMLIFrameElement && el.contains(active)) {
        interacted.current = true;
      }
    };
    window.addEventListener("blur", onBlur);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          cancel();
          reset();
        }
      },
      { threshold: 0 },
    );
    io.observe(el);

    return () => {
      window.removeEventListener("blur", onBlur);
      io.disconnect();
      cancel();
      if (dropTimer.current) clearTimeout(dropTimer.current);
    };
  }, [cancel, reset]);

  return { frames, wrapRef, onFrameReady, onPointerDown, onPointerLeave, onPointerEnter: cancel };
}

/**
 * Contato — FECHO da página. Sem formulário (decisão do Victor 2026-07-17:
 * ninguém manda e-mail; o caminho é o WhatsApp). Coluna ÚNICA centralizada,
 * dark com clima próprio (glow azul só como FOCO do CTA), pra fechar a página
 * com destaque. O "completo" vem do título + corpo + CTA + linha de reassurance
 * — não de um form.
 */
export function Contato() {
  // Desestruturado de propósito: acessar `mapa.wrapRef` direto no JSX faz o
  // lint do React ("Cannot access refs during render") acusar leitura de ref
  // durante a renderização.
  const { frames, wrapRef, onFrameReady, onPointerDown, onPointerEnter, onPointerLeave } =
    useMapaReset();

  return (
    <section id="contato" className={styles.section} aria-labelledby="cta-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <motion.h2 id="cta-heading" className={styles.title} {...revealHeading}>
            {contactSection.title}
          </motion.h2>

          <motion.p className={styles.body} {...revealUp(0.12)}>
            {contactSection.body.map((linha) => (
              <span key={linha} className={styles.bodyLine}>
                {linha}
              </span>
            ))}
          </motion.p>

          <motion.div className={styles.ctaWrap} {...revealUp(0.2)}>
            <Button
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
              aria-label="Falar pelo WhatsApp"
            >
              <WhatsAppIcon size={19} />
              {contactSection.whatsappCta}
            </Button>
          </motion.div>

          <motion.ul className={styles.trust} {...revealUp(0.28)} aria-label="Como funciona">
            {contactSection.trust.map((item) => (
              <li key={item} className={styles.trustItem}>
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Mapa — janela arredondada mostrando onde é a estética.
            DOIS ESTADOS, decididos pelo conteúdo (não por env/flag):
             · `contact.mapsEmbedUrl` preenchido → mapa REAL (iframe de
               compartilhamento do Google Maps: sem chave, sem faturamento, sem
               cota — ver o comentário longo em `content/brand.ts`).
             · vazio → o PLACEHOLDER em CSS que o Victor já aprovou.
            O selo com nome/local é NOSSO nos dois casos; no mapa real ele vai
            pro TOPO da janela pra não cobrir a atribuição do Google (canto
            inferior esquerdo), que precisa ficar visível. */}
        <motion.div className={styles.mapWrap} {...revealUp(0.36)}>
          {contact.mapsEmbedUrl ? (
            <div
              ref={wrapRef}
              className={`${styles.map} ${styles.mapLive}`}
              onPointerDown={onPointerDown}
              onPointerEnter={onPointerEnter}
              onPointerLeave={onPointerLeave}
            >
              {frames.map((key) => (
                <MapaFrame
                  key={key}
                  src={contact.mapsEmbedUrl}
                  title={`Mapa — ${brand.name}, ${brand.location}`}
                  onReady={() => onFrameReady(key)}
                />
              ))}
              {/* Véu: casa as bordas do mapa com o dark da seção e tampa o
                  thumbnail de camadas do Google no canto inferior esquerdo, que
                  o filtro de inversão deixa como um quadrado branco quebrado. */}
              <span className={styles.mapVeil} aria-hidden="true" />
              {contact.mapsPlaceUrl ? (
                <a
                  className={styles.mapLink}
                  href={contact.mapsPlaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir no Google Maps
                </a>
              ) : null}
            </div>
          ) : (
            <div className={styles.map} role="img" aria-label="Mapa de localização — em breve">
              <span className={styles.mapPin} aria-hidden="true" />
              <div className={styles.mapLabel}>
                <strong>{brand.name}</strong>
                <span>{brand.location}</span>
              </div>
              <span className={styles.mapNote}>Mapa em breve</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
