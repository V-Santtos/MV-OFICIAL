/**
 * Seção "Quem somos" (About us) — ilha CLARA do site (exceção ao dark, decisão
 * do Victor, 2026-07-16: testar como possível única parte clara).
 * Estrutura/efeito inspirados na ref MetroRide (marquee + reveal de texto no scroll).
 *
 * As 4 fotos já são do cliente (nenhuma é mais banco de imagem) — ver a nota do
 * bloco `photos` para a origem de cada uma.
 */

export type SobrePhoto = {
  /** Imagem do card. Quando há `video`, vira o poster/fallback dele. */
  src: string;
  alt: string;
  /** Faixa (lane) em que a foto deriva (parallax) ao rolar. Ref tem 4. */
  lane: 1 | 2 | 3 | 4;
  /** Se presente, o card exibe este vídeo em loop mudo no lugar da imagem.
   *  Com `prefers-reduced-motion`, o poster (`src`) é exibido no lugar. */
  video?: string;
};

export const sobre = {
  /** Índice/rótulo à esquerda (padrão "00 — 02 · QUEM SOMOS"). */
  index: "00 — 02",
  label: "Quem somos",

  /** Parágrafo revelado palavra por palavra conforme o scroll.
   *  Copy final do Victor (2026-07-17); ajustados só os erros de PT. */
  body:
    "Desde 2022 atendendo Simonésia e região. Aqui na MV, cuidar de um veículo é mais do que aparência. Trabalhamos com produtos de alta performance e com uma equipe dedicada a cada detalhe, para entregar cuidado e um acabamento à altura que seu veículo merece.",

  /** Texto do marquee (carrossel horizontal contínuo, fonte script Birthstone).
   *  Separador " — " no fim p/ emenda no loop. (Victor, 2026-07-17.) */
  marquee: "MV ESTÉTICA AUTOMOTIVA — SIMONÉSIA — ",

  /** Fotos flutuando em faixas sticky sobre o marquee.
   *  Lanes 1 (fachada, recriada por IA a partir de foto real do local), 2
   *  (polimento) e 3 (salão) já estão definidas — 2026-07-22. A fachada serve
   *  de referência de estilo. Lane 4: retrato do dono — FOTO REAL (Victor,
   *  2026-09-10). Substituiu o retrato que era gerado por IA (Atlas Image +
   *  Nano Banana 2, 2026-08-06); o arquivo antigo segue em `dono-logo.webp`,
   *  não referenciado. Guardada em 1500² QUASE SEM PERDA (184 KB) de propósito:
   *  este arquivo é a FONTE do `next/image`, não o que o navegador baixa. Comprimir
   *  aqui empilha perda antes do re-encode do Next — e em tela 3x o `sizes` de 336px
   *  pede 1080, que a versão anterior (1024) estava AMPLIANDO.
   *  ⚠️ A lane 2 é um trecho de vídeo de terceiro (reel da "The Detailing
   *  Mafia") — recortado para excluir fachada, placa e logo da marca deles,
   *  mas ainda é material licenciado a outrem. Validar direito de uso antes de
   *  publicar, ou substituir por captação própria. */
  photos: [
    {
      src: "/assets/sobre/fachada.webp",
      alt: "Fachada da MV Estética Automotiva em Simonésia, com vitrine de vidro escuro e carro no interior",
      lane: 1,
    },
    {
      src: "/assets/sobre/polimento-poster.webp",
      video: "/assets/sobre/polimento.mp4",
      alt: "Politriz passando sobre a lataria escura durante o polimento",
      lane: 2,
    },
    {
      src: "/assets/sobre/salao.webp",
      alt: "Salão da MV Estética Automotiva com a marca na parede e veículos em atendimento",
      lane: 3,
    },
    {
      src: "/assets/sobre/dono.webp",
      alt: "Dono da MV Estética Automotiva de braços cruzados no salão da oficina",
      lane: 4,
    },
  ] as readonly SobrePhoto[],
} as const;
