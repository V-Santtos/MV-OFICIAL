/**
 * 9 depoimentos. Migrado as-is do case congelado.
 * ⚠️ Depoimentos FICTÍCIOS — substituir por reais (com permissão) na Fase 2.
 */

export type Depoimento = {
  text: string;
  name: string;
  role: string;
  initials: string;
};

export const depoimentos: readonly Depoimento[] = [
  {
    text: "Levei meu Corolla para higienização interna e fiquei impressionado com o resultado. O carro saiu como se fosse zero, cheiro e visual impecáveis.",
    name: "Rafael Souza",
    role: "Toyota Corolla — Higienização Interna",
    initials: "RS",
  },
  {
    text: "Polimento técnico muito bem executado. Os riscos superficiais sumiram completamente e a pintura ficou com um brilho que eu não via desde que comprei o carro.",
    name: "Camila Ferreira",
    role: "Honda Civic — Polimento Técnico",
    initials: "CF",
  },
  {
    text: "Vitrificação aplicada com muita atenção ao detalhe. Atendimento honesto, sem enrolação. Recomendo sem hesitar.",
    name: "Thiago Martins",
    role: "Volkswagen Golf — Vitrificação",
    initials: "TM",
  },
  {
    text: "Meu farol estava completamente amarelado. Depois da restauração ficou transparente de novo. Serviço rápido e resultado excelente.",
    name: "Patrícia Lima",
    role: "Jeep Renegade — Restauração de Faróis",
    initials: "PL",
  },
  {
    text: "Trouxe meu carro sujo de barro após uma viagem longa. A limpeza técnica foi cirúrgica — não sobrou nada na pintura. Profissionalismo acima do esperado.",
    name: "Bruno Almeida",
    role: "Ford Ranger — Limpeza Técnica",
    initials: "BA",
  },
  {
    text: "Transparência no diagnóstico, prazo cumprido e entrega com registro fotográfico de tudo. É exatamente assim que eu espero ser atendido.",
    name: "Gustavo Mendonça",
    role: "Mercedes-AMG C43 — PPF + Higienização",
    initials: "GM",
  },
  {
    text: "Fiz limpeza de motor e fiquei surpreso com o nível de cuidado. Usaram produtos corretos, sem molhar o que não podia. Nota 10.",
    name: "Eduardo Costa",
    role: "BMW 320i — Limpeza de Motor",
    initials: "EC",
  },
  {
    text: "Atendimento diferenciado desde o primeiro contato. Me explicaram tudo que seria feito antes de começar. Voltarei com certeza.",
    name: "Aline Rocha",
    role: "Audi A3 — Higienização + Polimento",
    initials: "AR",
  },
  {
    text: "Resultado do polimento superou minhas expectativas. A equipe realmente entende do serviço e não corta caminho no processo.",
    name: "Marcelo Dias",
    role: "Chevrolet Onix — Polimento de Faróis",
    initials: "MD",
  },
] as const;

export const depoimentosMeta = {
  eyebrow: "Clientes",
  title: "Quem já passou por aqui",
} as const;
