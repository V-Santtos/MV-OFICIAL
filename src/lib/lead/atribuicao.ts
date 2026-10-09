/**
 * Atribuição de campanha do lead (pacote Billion, R1).
 *
 * Os parâmetros são lidos da URL NA CHEGADA ao site e guardados em
 * `sessionStorage`, pra acompanharem o visitante até o formulário mesmo que
 * ele entre pela home e só depois abra a página de serviço. Quem captura é o
 * `AtribuicaoCaptura`, montado no layout — não o formulário, que só existe em
 * três rotas e perderia a campanha de quem entra por outra página.
 */

const CHAVE = "mv_utm";

export const PARAMS_ATRIBUICAO = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

export type Atribuicao = Partial<Record<(typeof PARAMS_ATRIBUICAO)[number], string>>;

export function lerAtribuicao(): Atribuicao {
  try {
    return JSON.parse(window.sessionStorage.getItem(CHAVE) ?? "{}") as Atribuicao;
  } catch {
    return {};
  }
}

/** Mescla o que veio na URL atual com o que já estava guardado nesta aba. */
export function capturarAtribuicao(): void {
  try {
    const query = new URLSearchParams(window.location.search);
    const atribuicao = lerAtribuicao();
    let mudou = false;

    for (const param of PARAMS_ATRIBUICAO) {
      const valor = query.get(param);
      if (valor) {
        atribuicao[param] = valor;
        mudou = true;
      }
    }

    if (mudou) window.sessionStorage.setItem(CHAVE, JSON.stringify(atribuicao));
  } catch {
    // sessionStorage indisponível (modo restrito): o lead segue sem atribuição.
  }
}
