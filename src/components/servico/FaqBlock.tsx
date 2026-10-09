"use client";

/**
 * FAQ da rota /servicos/[slug] — TRILHO À ESQUERDA + cascata de entrada.
 * Extraído pra client component (o template ServicoPage segue Server) só pela
 * animação: título + linha de apoio + CTA (trilho) e as perguntas revelam em
 * cascata ao entrar na tela — mesmo idioma da home (useInView CONTROLADO +
 * variants centralizados, nunca whileInView/useScroll por causa do Lenis).
 *
 * O CTA do WhatsApp vive AQUI, no trilho, ao lado das dúvidas (o fecho pesado
 * "Seu interior merece esse cuidado" foi removido; o fecho global fica no rodapé).
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion, useInView } from "framer-motion";
import { contact, contactSection } from "@/content";
import { Button, WhatsAppIcon } from "@/components/ui";
import { faqAccordion, revealHeadingVariants, staggerCard } from "@/lib/animation/motion";
import styles from "./ServicoPage.module.css";

type FaqItem = { q: string; a: string };

/**
 * Uma pergunta. Continua sendo `<details>/<summary>` de verdade (teclado,
 * leitor de tela, busca na página e a resposta no HTML do servidor); o GSAP só
 * assume o MOVIMENTO de abrir e fechar, que no nativo é um corte seco.
 *
 * Quem decide qual está aberta é o FaqBlock (só UMA por vez); aqui o efeito
 * reage à troca de `aberto`. O atributo `open` é dirigido à mão: ao abrir ele
 * entra ANTES da animação (o conteúdo precisa existir pra ter altura) e ao
 * fechar só sai DEPOIS dela. Por isso o ícone +/− lê `data-aberto`, que vira
 * na hora do clique, e não `[open]`.
 */
function Pergunta({
  item,
  index,
  aberto,
  onAlternar,
}: {
  item: FaqItem;
  index: number;
  aberto: boolean;
  onAlternar: (abrir: boolean) => void;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const respostaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const details = detailsRef.current;
    const resposta = respostaRef.current;
    if (!details || !resposta || details.open === aberto) return;

    // Reduced-motion: troca seca, como o <details> nativo.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      details.open = aberto;
      return;
    }

    gsap.killTweensOf(resposta);
    if (aberto) {
      details.open = true;
      gsap.fromTo(
        resposta,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, ...faqAccordion.open, clearProps: "height,opacity" },
      );
    } else {
      gsap.to(resposta, {
        height: 0,
        opacity: 0,
        ...faqAccordion.close,
        onComplete: () => {
          details.open = false;
          gsap.set(resposta, { clearProps: "height,opacity" });
        },
      });
    }
  }, [aberto]);

  return (
    <motion.details
      ref={detailsRef}
      className={styles.faqItem}
      data-aberto={aberto}
      // Abertura que não passa pelo clique (ex.: a busca do navegador abrindo
      // o <details> pra mostrar um trecho): avisa o bloco, que fecha a anterior.
      onToggle={(e) => {
        if (e.currentTarget.open && !aberto) onAlternar(true);
      }}
      variants={staggerCard}
      custom={index + 1}
    >
      <summary
        onClick={(e) => {
          e.preventDefault();
          onAlternar(!aberto);
        }}
      >
        {item.q}
        <span className={styles.faqIcon} aria-hidden="true" />
      </summary>
      <div ref={respostaRef} className={styles.faqAnswer}>
        <p>{item.a}</p>
      </div>
    </motion.details>
  );
}

export function FaqBlock({
  faq,
}: {
  faq: { title: string; items: readonly FaqItem[] };
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const revealState = inView ? "visible" : "hidden";
  // Só UMA pergunta aberta por vez (Victor, 2026-10-09): abrir outra fecha a
  // anterior; clicar na aberta fecha ela.
  const [abertaIdx, setAbertaIdx] = useState<number | null>(null);

  return (
    <motion.section
      ref={ref}
      className={styles.faq}
      aria-labelledby="faq-heading"
      initial="hidden"
      animate={revealState}
    >
      <div className={styles.faqInner}>
        <div className={styles.faqAside}>
          <motion.h2 id="faq-heading" className={styles.faqTitle} variants={revealHeadingVariants}>
            {faq.title}
          </motion.h2>
          <motion.p className={styles.faqAsideText} variants={staggerCard} custom={0}>
            Restou alguma dúvida? Chame no WhatsApp e receba a avaliação gratuita.
          </motion.p>
          <motion.div variants={staggerCard} custom={1}>
            <Button
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar pelo WhatsApp"
            >
              <WhatsAppIcon size={19} />
              {contactSection.whatsappCta}
            </Button>
          </motion.div>
        </div>

        <div className={styles.faqList}>
          {faq.items.map((item, i) => (
            <Pergunta
              key={item.q}
              item={item}
              index={i}
              aberto={abertaIdx === i}
              onAlternar={(abrir) => setAbertaIdx(abrir ? i : null)}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
