/**
 * Geometria vetorial da marca MV (monograma).
 *
 * Origem: a logo só existia como PNG (`/logo.png`, 534×430). Foi vetorizada a
 * partir dele e simplificada para paths limpas — necessário porque o efeito de
 * intro "desenha" o contorno (`stroke`/`pathLength`), o que um raster não permite.
 *
 * São duas formas empilhadas que compõem o "MV":
 *  - `body`  → corpo branco (o "M", com os recortes que formam as hastes)
 *  - `chevron` → o "V" superior, no azul da marca (`--accent`)
 *
 * viewBox 0 0 512 400 = bounding box real dos pixels da logo (medido direto do
 * PNG: proporção 1,28 — largura/altura). A altura do desenho foi ajustada para
 * essa proporção real (o auto-trace vinha cortando a base das pernas do "M", o
 * que deixava a logo achatada/larga). Fonte única: quem precisar da logo em SVG
 * importa daqui.
 */
export const MV_LOGO = {
  viewBox: "0 0 512 400",
  /** Corpo branco do monograma (a base "M"). */
  body:
    "M0,0L111,114L254,266L260,265L480,30L510,0L512,0L512,400L351,400L430,316L431,221L426,222L412,236L257,400L252,398L98,234L85,221L81,221L81,312L83,317L161,400L0,400Z",
  /** Chevron superior (o "V"), ciano da marca. */
  chevron:
    "M0,0L121,0L251,137L256,136L384,0L506,0L504,5L445,69L254,270L248,267L0,2Z",
} as const;
