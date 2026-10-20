"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Meta Pixel — espelho do `GoogleAnalytics.tsx`, com DUAS diferenças
 * deliberadas:
 *
 * 1. **Carrega também em DEV.** O `layout.tsx` gateia o GA com
 *    `NODE_ENV === "production"`; o Pixel NÃO herda esse portão, pra dar pra
 *    validar com o Meta Pixel Helper no localhost. O único freio é o formato
 *    do ID.
 * 2. **Listener de WhatsApp PRÓPRIO.** O `generate_lead` mora dentro do
 *    componente do GA, que não monta em dev — pendurar o evento do Pixel lá
 *    deixaria o evento morto justamente onde ele precisa ser testado, e
 *    acoplaria os dois componentes. A leitura do `<a>` mais próximo é replicada
 *    aqui, com a mesma lógica.
 *
 * 🚩 SEM TRAVA DE CONSENTIMENTO desde o pacote Billion de 19/10/2026 (item 1).
 * Até ali só carregava depois do "Aceitar" (e nunca com GPC/DNT). Quem chega
 * pelo anúncio quase nunca toca no aviso: em 5 dias, 3 pedidos na planilha e 1
 * `Lead` na Meta. Decisão da Billion com o Matheus (19/10), responsabilidade
 * deles; o aviso de cookies ficou só visual (Recusar e Aceitar só fecham).
 *
 * Sem `<img>` de `<noscript>`: este componente só existe no cliente. Com JS
 * desligado ele nunca renderiza, então o fallback não apareceria.
 */

/** `fbq` é função E fila — o snippet carimba `queue`/`loaded`/`version` nela. */
type Fbq = ((...args: unknown[]) => void) & {
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
};

/** Mesmo padrão do `AnalyticsWindow` do GA: intersection local, sem `declare global`. */
type PixelWindow = Window & {
  fbq?: Fbq;
  _fbq?: Fbq;
};

function getPixelWindow(): PixelWindow {
  return window as PixelWindow;
}

/** ID de Pixel da Meta é numérico, 15 ou 16 dígitos. */
const PIXEL_ID_PATTERN = /^\d{15,16}$/;

/** Mesma leitura do `linkEvent` do GA, reduzida ao caso do WhatsApp. */
function isWhatsAppLink(anchor: HTMLAnchorElement): boolean {
  const href = anchor.getAttribute("href");
  if (!href) return false;

  try {
    const url = new URL(href, window.location.href);
    return url.hostname === "wa.me" || url.hostname.endsWith("whatsapp.com");
  } catch {
    return false;
  }
}

export function MetaPixel({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  /** Último pathname JÁ contabilizado. `null` = ainda não houve PageView. */
  const lastTrackedPath = useRef<string | null>(null);

  /**
   * PageView nas TROCAS de rota (o site tem 7). A 1ª passada só ANOTA o
   * pathname e sai: o `fbq('track','PageView')` do snippet de init já contou
   * essa — sem o early-return, a rota de entrada sairia duplicada.
   */
  useEffect(() => {
    if (lastTrackedPath.current === null) {
      lastTrackedPath.current = pathname;
      return;
    }

    if (lastTrackedPath.current === pathname) return;

    lastTrackedPath.current = pathname;
    getPixelWindow().fbq?.("track", "PageView");
  }, [pathname]);

  /**
   * `Contact` no clique de WhatsApp. Delegação em CAPTURA, igual ao GA: os CTAs
   * (Hero, Contato, CTA final de serviço, trilho do FAQ) saem todos do mesmo
   * `Button` polimórfico como `<a href>`, então um listener no document cobre
   * todos — e cobre qualquer CTA novo, sem instrumentar componente.
   *
   * 🚩 Era `Lead` até 2026-10-09. O pacote Billion (R1) reserva o `Lead` ao
   * ENVIO DO FORMULÁRIO (`lib/lead/enviar.ts`), que sai com `eventID` e casa
   * com a API de Conversões; a campanha otimiza por esse lead. Um `Lead` solto
   * no clique de WhatsApp não tem `eventID`, não deduplica e inflaria a conta.
   * O clique direto continua medido, só que como `Contact`.
   *
   * `data-lead-registrado`: o botão "Abrir o WhatsApp" da tela de pedido
   * enviado. Quem chega nele já gerou o `Lead` — não conta outra vez.
   */
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (anchor && isWhatsAppLink(anchor) && !anchor.hasAttribute("data-lead-registrado")) {
        getPixelWindow().fbq?.("track", "Contact");
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  if (!PIXEL_ID_PATTERN.test(pixelId)) return null;

  const serializedId = JSON.stringify(pixelId);

  return (
    <Script id="mv-meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${serializedId});fbq('track','PageView');`}
    </Script>
  );
}
