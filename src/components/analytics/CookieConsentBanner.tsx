"use client";

import { useEffect, useState } from "react";
import {
  ANALYTICS_CONSENT_KEY,
  readAnalyticsConsent,
  saveAnalyticsConsent,
} from "./analyticsConsent";
import styles from "./CookieConsentBanner.module.css";

/**
 * Aviso de cookies SÓ INFORMATIVO (pacote Billion de 19/10/2026, item 1).
 *
 * Até ali ele ligava e desligava o Pixel e o GA ("Recusar" / "Aceitar"). Na
 * reunião de 19/10 a Billion e o Matheus decidiram carregar os dois com a
 * página: quem chega pelo anúncio quase nunca toca no aviso, e a Meta ficava
 * sem o sinal. A responsabilidade pela escolha é da Billion e da MV.
 *
 * Aparece uma vez, com o mesmo visual, e some no "Entendi". Grava a mesma chave
 * de antes (`mv:analytics-consent`), então quem já tinha tocado em Aceitar ou
 * Recusar não vê o aviso de novo. O valor gravado não liga nem desliga nada.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const syncVisibility = (event?: StorageEvent) => {
      if (event?.key && event.key !== ANALYTICS_CONSENT_KEY) return;
      setVisible(readAnalyticsConsent() === null);
    };

    syncVisibility();
    window.addEventListener("storage", syncVisibility);

    return () => window.removeEventListener("storage", syncVisibility);
  }, []);

  const close = () => {
    saveAnalyticsConsent("granted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section
      className={styles.banner}
      aria-label="Aviso de cookies"
      aria-live="polite"
      data-lenis-prevent
    >
      <div className={styles.copy}>
        <p className={styles.title}>Sua privacidade</p>
        <p className={styles.description}>
          Usamos cookies de medição (Meta e Google) para entender o uso do site
          e o resultado dos nossos anúncios. Seus dados pessoais só são enviados
          quando você preenche o formulário.
        </p>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.button} ${styles.accept}`}
          onClick={close}
        >
          Entendi
        </button>
      </div>
    </section>
  );
}
