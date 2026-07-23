/**
 * Avatar circular com iniciais e gradiente azul da marca.
 * Reutilizável — usado nos depoimentos.
 */

import styles from "./Avatar.module.css";

export function Avatar({ initials, label }: { initials: string; label?: string }) {
  return (
    <div className={styles.avatar} role="img" aria-label={label ?? initials}>
      {initials}
    </div>
  );
}
