"use client";

import { Fragment, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { depoimentos, depoimentosMeta, type Depoimento } from "@/content";
import { SectionHeading, Avatar } from "@/components/ui";
import { columnCascade } from "@/lib/animation";
import styles from "./Depoimentos.module.css";

const col1 = depoimentos.slice(0, 3);
const col2 = depoimentos.slice(3, 6);
const col3 = depoimentos.slice(6, 9);

function Column({
  items,
  duration,
  className,
  index,
  inView,
}: {
  items: readonly Depoimento[];
  duration: number;
  className?: string;
  /** posição da coluna (0-2) — dá o stagger da cascata. */
  index: number;
  /** gatilho compartilhado: as 3 colunas entram juntas, escalonadas. */
  inView: boolean;
}) {
  return (
    <motion.div
      className={`${styles.col} ${className ?? ""}`}
      custom={index}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={columnCascade}
    >
      <motion.div
        className={styles.track}
        animate={{ translateY: "-50%" }}
        transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
      >
        {/* Duas passagens idênticas garantem loop contínuo sem salto. */}
        {[0, 1].map((pass) => (
          <Fragment key={pass}>
            {items.map(({ text, name, role, initials }, i) => (
              <figure key={`${pass}-${i}`} className={styles.card}>
                <blockquote className={styles.text}>{text}</blockquote>
                <figcaption className={styles.person}>
                  <Avatar initials={initials} label={name} />
                  <div>
                    <p className={styles.name}>{name}</p>
                    <p className={styles.role}>{role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </Fragment>
        ))}
      </motion.div>
    </motion.div>
  );
}

export function Depoimentos() {
  // O mural (colunas) revela em CASCATA quando entra na vista — DEPOIS de o
  // título ter tido o beat dele sozinho no palco (.beat, min-height de tela).
  // useInView CONTROLADO (não whileInView): a seção vem após o Processo pinado.
  const columnsRef = useRef<HTMLDivElement>(null);
  const columnsInView = useInView(columnsRef, { once: true, margin: "0px 0px -20% 0px" });

  return (
    <section id="depoimentos" className={styles.section} aria-labelledby="dep-heading">
      <div className={styles.inner}>
        {/* Palco do título: ele pousa SOZINHO na 1ª tela (centrado, dark limpo);
            o mural fica abaixo da dobra e entra só quando rolamos até ele. */}
        <div className={styles.beat}>
          <SectionHeading id="dep-heading" eyebrow={depoimentosMeta.eyebrow} title={depoimentosMeta.title} animation="fade" />
        </div>

        <div className={styles.columns} ref={columnsRef}>
          <Column items={col1} duration={22} index={0} inView={columnsInView} />
          <Column items={col2} duration={28} index={1} inView={columnsInView} className={styles.colMd} />
          <Column items={col3} duration={19} index={2} inView={columnsInView} className={styles.colLg} />
        </div>
      </div>
    </section>
  );
}
