/**
 * Sinal one-shot Intro → Hero.
 *
 * A intro de abertura (`components/layout/IntroReveal`) emite quando o painel
 * COMEÇA a subir; o Hero escuta pra disparar sua cascata de entrada (GSAP) no
 * momento exato da revelação — não no load, senão a cascata roda atrás do
 * painel e ninguém vê (era o bug do preset Framer `enterUp`).
 *
 * O mecanismo (evento de window + flag de módulo) fica encapsulado aqui: nenhum
 * componente fala com `window` direto. A flag é singleton do módulo (bundle
 * único), então cobre a corrida "emitiu antes de eu escutar" — quem assina
 * depois do disparo é chamado na hora. Reinicia a cada reload (a intro toca
 * inteira toda vez, decisão do Victor).
 */

/**
 * 🔕 Chave da abertura com a logo. DESLIGADA no pacote Billion de 19/10/2026
 * (item 2): no 4G a cortina segurava a página por até ~3,9 s. A animação segue
 * inteira em `IntroReveal`; pra voltar, `true`.
 *
 * Desligada, a entrada da Navbar e dos heros passa a ser em CSS
 * (`html[data-entrada-css]` no `globals.css`), que roda na 1ª pintura sem
 * esperar o JavaScript. Em GSAP ela PISCAVA: o texto vinha visível no HTML, o
 * `gsap.set` zerava e só então subia (medido em 20/10/2026, probes/abertura-timing).
 */
export const INTRO_ATIVA = false;

const EVENT = "mv:intro-reveal";

let revealed = false;
let instant = false;

/**
 * A intro chama isto quando o painel sobe. Idempotente (só dispara 1×).
 *
 * `instant: true` quando NÃO houve cortina nenhuma — intro pulada (já tocou
 * nesta sessão) ou reduced-motion. Quem escuta precisa saber: as cascatas do
 * Hero e da Navbar têm um `delay` calibrado pela subida do painel, e sem painel
 * esse delay vira tela parada. Ver `introDelay()`.
 */
export function emitIntroReveal(opts?: { instant?: boolean }): void {
  if (revealed) return;
  revealed = true;
  instant = opts?.instant ?? false;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT));
  }
}

/**
 * Delay que uma cascata encadeada à intro deve usar. Devolve 0 quando a intro
 * foi pulada: o `delay` dos presets existe só para esperar a cortina subir.
 */
export function introDelay(presetDelay: number): number {
  return instant ? 0 : presetDelay;
}

/** True se a intro já revelou (ex.: reduced-motion, que pula direto). */
export function hasIntroRevealed(): boolean {
  return revealed;
}

/**
 * Registra `cb` pra quando a intro revelar. Retorna a função de cleanup.
 * Se a revelação já aconteceu, chama `cb` imediatamente (sem esperar evento).
 */
export function onIntroReveal(cb: () => void): () => void {
  if (revealed) {
    cb();
    return () => {};
  }
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT, handler, { once: true });
  return () => window.removeEventListener(EVENT, handler);
}
