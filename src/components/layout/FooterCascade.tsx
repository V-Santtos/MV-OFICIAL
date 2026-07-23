"use client";

import { Children, useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { columnCascade } from "@/lib/animation";
import styles from "./Footer.module.css";

/**
 * Cascata de entrada das colunas do rodapé (Victor, 2026-07-22): o usuário
 * chega no fim da página, vê o marquee correndo, e ao descer mais um pouco as
 * colunas entram em fade + rise, uma depois da outra.
 *
 * ⚠️ POR QUE ISTO EXISTE EM VEZ DE `"use client"` NO `Footer.tsx`: o rodapé é
 * **Server Component de propósito** (o marquee é CSS puro, sem JS). Este
 * invólucro é a única parte client; as colunas continuam sendo renderizadas no
 * servidor e chegam aqui como `children`. Converter o Footer inteiro custaria
 * JS para conteúdo 100% estático.
 *
 * Reusa `columnCascade`, o MESMO preset das 3 colunas dos Depoimentos — a
 * arquitetura do projeto manda centralizar curva e variante em
 * `lib/animation/motion.ts`, nunca definir solto na seção.
 *
 * `useInView` CONTROLADO (não `whileInView`) com `once: true`: rodapé não
 * reverte quando o usuário sobe a página de volta.
 */
export function FooterCascade({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  // Margem inferior negativa: dispara quando as colunas já subiram um pedaço na
  // tela, não no instante em que a primeira linha encosta na borda.
  const inView = useInView(ref, { once: true, margin: "0px 0px -18% 0px" });

  // Reduced-motion: entrega as colunas prontas, sem wrapper de animação.
  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, i) => (
        <motion.div
          // O invólucro passa a ser o ITEM do grid, então o `min-width:0` que
          // protegia as colunas do estouro tem que morar aqui.
          className={styles.cascadeItem}
          custom={i}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={columnCascade}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
