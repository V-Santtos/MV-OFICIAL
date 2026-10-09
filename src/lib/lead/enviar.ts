/**
 * Registro do lead do formulário de avaliação (pacote Billion, V9 + R1).
 *
 * Dois destinos, com o MESMO `lead_id`:
 * - Meta Pixel: evento `Lead` com `eventID = lead_id`;
 * - planilha da MV (Web App do Apps Script em `NEXT_PUBLIC_LEAD_ENDPOINT`),
 *   de onde a API de Conversões lê o mesmo id pra deduplicar com o Pixel.
 *
 * 🚩 `no-cors`: a resposta do Web App é opaca. Um `fetch` que resolve NÃO
 * prova que a linha foi gravada — a conferência é na planilha. A regra do
 * pacote é não perder o cliente: falha ou 4s de espera, e o fluxo segue pro
 * WhatsApp do mesmo jeito.
 */

import { hasAnalyticsConsent } from "@/components/analytics/analyticsConsent";
import { lerAtribuicao } from "./atribuicao";

const ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT ?? "";
const ESPERA_MAXIMA_MS = 4000;

export type DadosLead = {
  nome: string;
  whatsapp: string;
  modelo: string;
  urgencia: string;
  servico: string;
};

type FbqWindow = Window & { fbq?: (...args: unknown[]) => void };

function lerCookie(nome: string): string {
  const achado = document.cookie.match(`(?:^|; )${nome}=([^;]*)`);
  return achado ? decodeURIComponent(achado[1]) : "";
}

export function novoLeadId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Linha da planilha. TODOS os campos vão no POST, mesmo vazios (o pacote pede:
 * a planilha é o backlog de leads e as colunas são fixas).
 *
 * 🔒 Consentimento: os identificadores de anúncio (`fbclid`, `fbp`, `fbc`) e o
 * `user_agent` existem pra casar o lead com a Meta na API de Conversões. Sem
 * o "Aceitar" do banner eles vão VAZIOS — mandá-los por fora seria rastrear
 * quem recusou o rastreamento. Nome, telefone, carro e UTMs seguem: é o que a
 * pessoa digitou pra ser atendida e de qual campanha a visita veio.
 */
export function montarLead(dados: DadosLead, leadId: string): Record<string, string> {
  const atribuicao = lerAtribuicao();
  const rastreavel = hasAnalyticsConsent();
  const fbclid = rastreavel ? (atribuicao.fbclid ?? "") : "";

  return {
    nome: dados.nome.trim(),
    whatsapp: dados.whatsapp,
    modelo: dados.modelo.trim(),
    urgencia: dados.urgencia,
    servico: dados.servico,
    pagina: window.location.pathname,
    origem: "Site MV",
    lead_id: leadId,
    utm_source: atribuicao.utm_source ?? "",
    utm_medium: atribuicao.utm_medium ?? "",
    utm_campaign: atribuicao.utm_campaign ?? "",
    utm_content: atribuicao.utm_content ?? "",
    utm_term: atribuicao.utm_term ?? "",
    fbclid,
    fbp: rastreavel ? lerCookie("_fbp") : "",
    fbc: rastreavel ? lerCookie("_fbc") || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : "") : "",
    user_agent: rastreavel ? window.navigator.userAgent : "",
    url: window.location.href.split("#")[0],
  };
}

/** `Lead` no Pixel. Sem consentimento o Pixel nem carrega: `fbq` não existe. */
export function dispararLeadPixel(servico: string, leadId: string): void {
  try {
    (window as FbqWindow).fbq?.("track", "Lead", { content_name: servico }, { eventID: leadId });
  } catch {
    // Pixel bloqueado por extensão: o lead continua indo pra planilha.
  }
}

/** POST na planilha. Nunca rejeita: devolve se a requisição chegou a SAIR. */
export async function gravarNaPlanilha(lead: Record<string, string>): Promise<boolean> {
  if (!ENDPOINT) return false;

  const controle = new AbortController();
  const limite = window.setTimeout(() => controle.abort(), ESPERA_MAXIMA_MS);

  try {
    await fetch(ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: new URLSearchParams(lead),
      signal: controle.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    window.clearTimeout(limite);
  }
}
