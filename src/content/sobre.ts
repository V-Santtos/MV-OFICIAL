/**
 * Seção "Quem somos" (About us) — ilha CLARA do site (exceção ao dark, decisão
 * do Victor, 2026-07-16: testar como possível única parte clara).
 * Estrutura/efeito inspirados na ref MetroRide (marquee + reveal de texto no scroll).
 *
 * ⚠️ Conteúdo PLACEHOLDER (etapa 1 = validar layout + efeito). Copy final vem
 * depois com a skill `copywriting`. As fotos reaproveitam as imagens de banco da
 * galeria (Unsplash) — trocar por fotos REAIS do cliente na Fase 2.
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
    "Desde 2010 atendendo Simonésia e região. Aqui na MV, cuidar de um veículo é mais do que aparência. Trabalhamos com produtos de alta performance e com uma equipe dedicada a cada detalhe, para entregar cuidado e um acabamento à altura que seu veículo merece.",

  /** Texto do marquee (carrossel horizontal contínuo, fonte script Birthstone).
   *  Separador " — " no fim p/ emenda no loop. (Victor, 2026-07-17.) */
  marquee: "MV ESTÉTICA AUTOMOTIVA — SIMONÉSIA — ",

  /** Fotos flutuando em faixas sticky sobre o marquee.
   *  Lanes 1 (fachada, recriada por IA a partir de foto real do local), 2
   *  (polimento) e 3 (salão) já estão definidas — 2026-07-22. A fachada serve
   *  de referência de estilo. Só a lane 4 segue placeholder Unsplash.
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
      src: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80",
      alt: "Faróis restaurados — detalhe de acabamento",
      lane: 4,
    },
  ] as readonly SobrePhoto[],
} as const;
