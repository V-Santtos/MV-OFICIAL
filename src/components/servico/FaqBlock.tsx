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

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { contact, contactSection } from "@/content";
import { Button, WhatsAppIcon } from "@/components/ui";
import { revealHeadingVariants, staggerCard } from "@/lib/animation/motion";
import styles from "./ServicoPage.module.css";

type FaqItem = { q: string; a: string };

export function FaqBlock({
  faq,
}: {
  faq: { title: string; items: readonly FaqItem[] };
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const revealState = inView ? "visible" : "hidden";

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
            <motion.details
              key={item.q}
              className={styles.faqItem}
              variants={staggerCard}
              custom={i + 1}
            >
              <summary>
                {item.q}
                <span className={styles.faqIcon} aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
