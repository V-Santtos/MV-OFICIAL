"use client";

import Script from "next/script";
import { useCallback, useEffect } from "react";
import { useReportWebVitals } from "next/web-vitals";

type Gtag = (...args: unknown[]) => void;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: Gtag;
};

type WebVitalMetric = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];

function getAnalyticsWindow(): AnalyticsWindow {
  return window as AnalyticsWindow;
}

function queueGtag(...args: unknown[]) {
  const analyticsWindow = getAnalyticsWindow();
  analyticsWindow.dataLayer ??= [];
  analyticsWindow.gtag ??= (...gtagArgs: unknown[]) => {
    analyticsWindow.dataLayer?.push(gtagArgs);
  };
  analyticsWindow.gtag(...args);
}

function linkEvent(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");
  if (!href) return null;

  const url = new URL(href, window.location.href);
  const common = {
    link_url: url.href,
    link_text: anchor.textContent?.trim().replace(/\s+/g, " ").slice(0, 120) ?? "",
  };

  if (url.hostname === "wa.me" || url.hostname.endsWith("whatsapp.com")) {
    return { name: "generate_lead", params: { ...common, method: "whatsapp" } };
  }

  if (url.protocol === "tel:") {
    return { name: "phone_click", params: common };
  }

  if (url.hostname.endsWith("google.com") && url.pathname.startsWith("/maps")) {
    return { name: "map_click", params: common };
  }

  if (url.origin === window.location.origin && url.pathname.startsWith("/servicos/")) {
    return {
      name: "service_open",
      params: { ...common, service_slug: url.pathname.split("/").filter(Boolean).at(-1) ?? "" },
    };
  }

  return null;
}

/**
 * GA4. 🚩 SEM TRAVA DE CONSENTIMENTO desde o pacote Billion de 19/10/2026
 * (item 1): carrega com a página, como o Pixel (ver `MetaPixel.tsx`). Eventos
 * de clique e Web Vitals seguem iguais.
 */
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (anchor) {
        const tracked = linkEvent(anchor);
        if (tracked) queueGtag("event", tracked.name, tracked.params);
        return;
      }

      const caseButton = target.closest<HTMLButtonElement>(
        'button[aria-label^="Ver o vídeo do trabalho:"], button[aria-label^="Ver as "]',
      );
      if (caseButton) {
        queueGtag("event", "case_open", {
          case_label: caseButton.getAttribute("aria-label") ?? "",
        });
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  const reportWebVital = useCallback((metric: WebVitalMetric) => {
    queueGtag("event", metric.name, {
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }, []);

  useReportWebVitals(reportWebVital);

  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) return null;

  const serializedId = JSON.stringify(measurementId);

  return (
    <>
      <Script id="mv-google-analytics-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=window.gtag||gtag;gtag('js',new Date());gtag('config',${serializedId});`}
      </Script>
      <Script
        id="mv-google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="afterInteractive"
      />
    </>
  );
}
