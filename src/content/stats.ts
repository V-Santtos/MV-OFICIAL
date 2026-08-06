/**
 * 4 stats do bloco de posicionamento. Migrado as-is do case congelado.
 * ⚠️ Números SEM comprovação (500+, 8+, 98%, 100%) — validar/ajustar na Fase 2.
 */

export type Stat = {
  target: number;
  suffix: string;
  badge: string;
  desc: string;
};

export const stats: readonly Stat[] = [
  {
    target: 500,
    suffix: "+",
    badge: "Veículos atendidos",
    desc: "Carros e motos com tratamento de alta precisão.",
  },
  {
    target: 3,
    suffix: "+",
    badge: "Anos de experiência",
    desc: "Especialização contínua em estética automotiva.",
  },
  {
    target: 98,
    suffix: "%",
    badge: "Satisfação",
    desc: "Clientes que retornam e indicam nosso trabalho.",
  },
  {
    target: 100,
    suffix: "%",
    badge: "Precisão",
    desc: "Comprometimento absoluto em cada serviço realizado.",
  },
] as const;
