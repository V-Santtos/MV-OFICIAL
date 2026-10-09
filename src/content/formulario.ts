/**
 * Formulário de avaliação das rotas de serviço (pacote Billion, V9).
 * Textos e regras IGUAIS nas três rotas; cada rota só informa o nome do
 * serviço (`venda.servicoForm` em servico-detalhe.ts), que vai pra planilha e
 * pra mensagem do WhatsApp.
 */
export const formularioLead = {
  eyebrow: "Avaliação sem custo",
  title: "Venha conhecer",
  titleAccent: "a nossa estética.",
  intro:
    "Conte qual é o veículo e qual serviço ele precisa e envie pelo nosso formulário, direto para o nosso WhatsApp.",
  pontos: [
    "Leva menos de um minuto",
    "A equipe te responde pelo WhatsApp",
    "Orçamento e prazo antes de começar",
  ],
  campos: {
    nome: {
      label: "Seu nome",
      placeholder: "Como podemos te chamar?",
      erro: "Digite o seu nome.",
    },
    // Só CELULAR com DDD, 11 dígitos (Victor, 2026-10-09): o contato é por
    // WhatsApp, então fixo e número incompleto não servem.
    whatsapp: {
      label: "Número de WhatsApp",
      placeholder: "(33) 99999-9999",
      erro: "Digite o celular com DDD, 11 dígitos.",
    },
    modelo: {
      label: "Modelo do carro",
      placeholder: "Ex.: Corolla Cross 2024",
      erro: "Conte qual é o modelo do carro.",
    },
    urgencia: {
      label: "Quando você pretende fazer?",
      opcoes: ["Esta semana", "Nos próximos 30 dias", "Só estou pesquisando"],
      erro: "Escolha uma opção.",
    },
  },
  botoes: {
    voltar: "Voltar",
    continuar: "Continuar",
    enviar: "Pedir avaliação sem custo",
    enviando: "Enviando...",
  },
  privacidade:
    "Seus dados são usados só para a MV Estética Automotiva entrar em contato sobre a avaliação.",
  whatsappTexto: "Olá, Matheus! Acabei de pedir uma avaliação pelo site.",
  enviado: {
    title: "Pedido enviado.",
    body: "Estamos abrindo o WhatsApp com a sua mensagem pronta. Se ele não abrir sozinho, use o botão abaixo.",
    cta: "Abrir o WhatsApp",
  },
} as const;
