"use client";

import { useEffect, useState } from "react";
import {
  ANALYTICS_CONSENT_KEY,
  hasBrowserPrivacySignal,
  readAnalyticsConsent,
  saveAnalyticsConsent,
  type AnalyticsConsent,
} from "./analyticsConsent";
import styles from "./CookieConsentBanner.module.css";

/**
 * Aviso de cookies — 🔕 SÓ VISUAL desde o pacote Billion de 19/10/2026 (item 1).
 *
 * O Pixel e o GA carregam com a página, sem esperar a escolha (decisão da
 * Billion e da MV). O aviso fica IGUAL ao de antes, com a mesma mensagem e os
 * dois botões, por decisão do Victor (20/10): um botão único "Entendi" dava a
 * entender que o visitante era obrigado a concordar. "Recusar" e "Aceitar"
 * só gravam a escolha e fecham o aviso; nada mais lê esse valor.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const syncVisibility = (event?: StorageEvent) => {
      if (event?.key && event.key !== ANALYTICS_CONSENT_KEY) return;

      setVisible(
        readAnalyticsConsent() === null && !hasBrowserPrivacySignal(),
      );
    };

    syncVisibility();
    window.addEventListener("storage", syncVisibility);

    return () => window.removeEventListener("storage", syncVisibility);
  }, []);

  const choose = (consent: AnalyticsConsent) => {
    saveAnalyticsConsent(consent);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section
      className={styles.banner}
      aria-label="Preferências de cookies"
      aria-live="polite"
      data-lenis-prevent
    >
      <div className={styles.copy}>
        <p className={styles.title}>Sua privacidade</p>
        <p className={styles.description}>
          Usamos cookies opcionais para melhorar sua experiência no site. Eles
          só serão ativados se você aceitar.
        </p>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.button} ${styles.reject}`}
          onClick={() => choose("denied")}
        >
          Recusar
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.accept}`}
          onClick={() => choose("granted")}
        >
          Aceitar
        </button>
      </div>
    </section>
  );
}
