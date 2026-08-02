/**
 * 9 depoimentos — todos REAIS (clientes de verdade, mandados pelo Victor via
 * WhatsApp). Os 4 placeholders fictícios do case congelado foram substituídos.
 *
 * Texto: palavras do cliente preservadas (inclusive regionalismo e voz falada).
 * Só acento e pontuação foram ajustados, e o vocativo "Mateus" removido — o
 * nome dele não aparece em nenhum outro lugar do site.
 *
 * ⚠️ ORDEM IMPORTA: Depoimentos.tsx fatia o array em 3 colunas fixas —
 * slice(0,3) / slice(3,6) / slice(6,9). Mauriane (Nivus, "15 dias") está no
 * índice 4 e Thayná (Nivus, "15 em 15 dias") no 8 de propósito: em colunas
 * diferentes, pra não rolarem coladas repetindo carro e frase.
 *
 * `real`: campo INTERNO, nunca renderizado — marca se o depoimento é de
 * cliente de verdade. Hoje todos true; serve pra barrar placeholder futuro.
 */

export type Depoimento = {
  text: string;
  name: string;
  role: string;
  initials: string;
  /** true = depoimento real (cliente de verdade). false = ainda placeholder fictício. */
  real: boolean;
};

export const depoimentos: readonly Depoimento[] = [
  {
    text: "O carro ficou top, top mesmo. Depois do serviço ele virou outro: parou de rinchar, nem bate bate mais. Perfeito, nota mil pro seu trabalho.",
    name: "José Langames",
    role: "Toyota Hilux — Vitrificação e Higienização Interna",
    initials: "JL",
    real: true,
  },
  {
    text: "Ficou top demais. O pessoal até perguntou se eu tinha pintado o carro, de tanto que ele tá brilhando. Já vou marcar uma higienização também.",
    name: "Cleomar Bertolace",
    role: "Toyota Corolla — Vitrificação",
    initials: "CB",
    real: true,
  },
  {
    text: "Peguei a Toro aqui agora, ficou top demais, cê tá doido. Tava precisando fazer essa estética nela, aqueles arranhões tavam me incomodando demais. Ficou show, valeu!",
    name: "Silas Perigolo",
    role: "Fiat Toro — Vitrificação",
    initials: "SP",
    real: true,
  },
  {
    text: "Carro ficou luxo demais!",
    name: "Gerson",
    role: "Volkswagen Saveiro Cross — Limpeza Técnica Detalhada",
    initials: "G",
    real: true,
  },
  {
    text: "Tô pegando meu carro aqui, o serviço ficou impecável. Pode já marcar pra lavar de novo daqui 15 dias. Muito obrigada, ficou muito bom mesmo!",
    name: "Mauriane Perigolo",
    role: "Volkswagen Nivus — Higienização Interna e Limpeza de Motor",
    initials: "MP",
    real: true,
  },
  {
    text: "O carro virou outro, cê tá doido. Sumiu aquele cheiro forte de poeira. Tava realmente precisando desmontar pra lavar tudo, agora dá até gosto de andar nele novamente.",
    name: "Magno Alves",
    role: "Fiat Palio — Higienização Interna Completa",
    initials: "MA",
    real: true,
  },
  {
    text: "Que brilho incrível que você deixou esse carro. Muito obrigado, meu amigo, pelo capricho. Deus abençoe seu trabalho.",
    name: "Sabrina",
    role: "RAM Rampage — Vitrificação Premium",
    initials: "S",
    real: true,
  },
  {
    text: "Top demais seu trabalho, cara. Continue caprichoso e atencioso assim que você vai longe, meu amigo!",
    name: "Cleuber",
    role: "Chevrolet Astra — Higienização Interna",
    initials: "C",
    real: true,
  },
  {
    text: "Nossa, entrei no carro aqui agora, ficou muito bom. Quero ver com você pra manter o carro limpo de 15 em 15 dias!",
    name: "Thayná Rodrigues",
    role: "Volkswagen Nivus — Limpeza Técnica Detalhada",
    initials: "TR",
    real: true,
  },
] as const;

export const depoimentosMeta = {
  eyebrow: "Clientes",
  title: "Quem já passou por aqui",
} as const;
