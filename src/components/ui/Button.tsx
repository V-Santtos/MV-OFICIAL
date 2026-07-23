/**
 * Botão/CTA reutilizável com o visual azul da marca.
 * Polimórfico: renderiza <a> quando recebe `href`, senão <button>.
 * O gradiente/estado vive no CSS Module (tokens da marca).
 */

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./Button.module.css";

type BaseProps = {
  children: ReactNode;
  /** Variante visual. `primary` = pílula chapada azul (ref. Figma);
   *  `light` = pílula branca c/ texto escuro (Contato da navbar); `ghost` = contorno sutil. */
  variant?: "primary" | "light" | "ghost";
  /** Seta → à direita do label (língua visual dos cards de Serviços).
   *  No hover ela avança de leve (nudge) — o botão "aponta" pra ação. */
  arrow?: boolean;
  className?: string;
  fullWidth?: boolean;
};

/** Mesma seta dos cards de Serviços (stroke arredondado), em escala de CTA. */
function ArrowIcon() {
  return (
    <span className={styles.arrow} aria-hidden="true">
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    </span>
  );
}

type AnchorProps = BaseProps &
  ComponentPropsWithoutRef<"a"> & { href: string };
type NativeButtonProps = BaseProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

export type ButtonProps = AnchorProps | NativeButtonProps;

export function Button(props: ButtonProps) {
  const { children, variant = "primary", arrow, className, fullWidth, ...rest } = props;
  const classes = [
    styles.btn,
    styles[variant],
    arrow ? styles.hasArrow : "",
    fullWidth ? styles.full : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorProps;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
        {arrow && <ArrowIcon />}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as NativeButtonProps)}>
      {children}
      {arrow && <ArrowIcon />}
    </button>
  );
}
