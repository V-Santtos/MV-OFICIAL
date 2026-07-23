/**
 * Superfície-base reutilizável (glass sutil sobre fundo escuro).
 * Sem 'use client' — puro wrapper. Estende via className.
 */

import type { ReactNode } from "react";
import styles from "./Card.module.css";

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return <Tag className={[styles.card, className].filter(Boolean).join(" ")}>{children}</Tag>;
}
