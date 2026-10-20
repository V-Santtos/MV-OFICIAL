/**
 * Chave e evento do aviso de cookies.
 *
 * 🔕 Desde o pacote Billion de 19/10/2026 o aviso é só informativo: o Pixel e o
 * GA carregam sem esperar o aceite. Daqui só o banner usa a chave (pra aparecer
 * uma vez). `hasAnalyticsConsent` e `hasBrowserPrivacySignal` ficaram sem uso,
 * mantidos caso a trava precise voltar.
 */
export const ANALYTICS_CONSENT_KEY = "mv:analytics-consent";
export const ANALYTICS_CONSENT_EVENT = "mv:analytics-consent-change";

export type AnalyticsConsent = "granted" | "denied";

type NavigatorWithPrivacy = Navigator & {
  globalPrivacyControl?: boolean;
};

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function hasBrowserPrivacySignal(): boolean {
  if (typeof navigator === "undefined") return false;

  const privacyNavigator = navigator as NavigatorWithPrivacy;
  const doNotTrack =
    navigator.doNotTrack === "1" || navigator.doNotTrack === "yes";

  return privacyNavigator.globalPrivacyControl === true || doNotTrack;
}

export function hasAnalyticsConsent(): boolean {
  return !hasBrowserPrivacySignal() && readAnalyticsConsent() === "granted";
}

export function saveAnalyticsConsent(consent: AnalyticsConsent): void {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent);
  } catch {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<AnalyticsConsent>(ANALYTICS_CONSENT_EVENT, {
      detail: consent,
    }),
  );
}
