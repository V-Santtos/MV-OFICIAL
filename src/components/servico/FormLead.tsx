"use client";

/**
 * Formulário de avaliação em QUATRO etapas (pacote Billion, V9): nome →
 * WhatsApp → modelo do carro → prazo. Fecha as rotas de serviço no modelo de
 * venda e é o destino (`#avaliacao`) de todos os CTAs dessas páginas.
 *
 * Ao enviar: gera o `lead_id`, dispara o `Lead` do Pixel, grava na planilha e
 * abre o WhatsApp da MV com a mensagem pronta. A ordem e as regras de cada
 * passo estão em `lib/lead/enviar.ts`.
 *
 * As quatro etapas ficam SEMPRE no DOM (só a ativa é exibida): voltar não
 * perde o que já foi digitado, e o preenchimento automático do navegador
 * alcança nome e telefone de uma vez.
 */

import { useRef, useState, type FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import { contact, formularioLead as f } from "@/content";
import { Button, WhatsAppIcon } from "@/components/ui";
import { revealHeadingVariants, staggerCard } from "@/lib/animation/motion";
import { dispararLeadPixel, gravarNaPlanilha, montarLead, novoLeadId } from "@/lib/lead/enviar";
import v from "./Venda.module.css";

const TOTAL = 4;

/** (33) 99999-9999 conforme a pessoa digita; guarda no máximo 11 dígitos. */
function mascararCelular(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length > 7) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return d ? `(${d}` : "";
}

/** Celular brasileiro: DDD (não começa com 0) + 9 + oito dígitos. */
function celularValido(valor: string): boolean {
  return /^[1-9]\d9\d{8}$/.test(valor.replace(/\D/g, ""));
}

export function FormLead({ servico }: { servico: string }) {
  const [etapa, setEtapa] = useState(0);
  const [valores, setValores] = useState({ nome: "", whatsapp: "", modelo: "", urgencia: "" });
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  /** Link do WhatsApp já montado; preenchido = pedido enviado. */
  const [destino, setDestino] = useState("");
  const armadilha = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const secaoRef = useRef<HTMLElement>(null);
  const inView = useInView(secaoRef, { once: true, amount: 0.25 });
  const estado = inView ? "visible" : "hidden";

  function validar(): boolean {
    const regras = [
      [valores.nome.trim().length >= 2, f.campos.nome.erro],
      [celularValido(valores.whatsapp), f.campos.whatsapp.erro],
      [valores.modelo.trim().length > 0, f.campos.modelo.erro],
      [valores.urgencia !== "", f.campos.urgencia.erro],
    ] as const;
    const [ok, mensagem] = regras[etapa];
    setErro(ok ? "" : mensagem);
    return ok;
  }

  function irPara(proxima: number) {
    setErro("");
    setEtapa(proxima);
    // Foco no campo da etapa que acabou de aparecer (depois do paint).
    requestAnimationFrame(() => {
      formRef.current
        ?.querySelector<HTMLInputElement>(`[data-etapa="${proxima}"] input`)
        ?.focus({ preventScroll: true });
    });
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    if (enviando) return;
    if (!validar()) return;
    // Enter numa etapa intermediária avança, não envia.
    if (etapa < TOTAL - 1) return irPara(etapa + 1);
    // Campo-armadilha preenchido = robô: some em silêncio.
    if (armadilha.current?.value) return;

    setEnviando(true);
    const leadId = novoLeadId();
    const dados = { ...valores, servico };

    dispararLeadPixel(servico, leadId);

    const mensagem = [
      f.whatsappTexto,
      `Nome: ${valores.nome.trim()}`,
      `Carro: ${valores.modelo.trim()}`,
      `Serviço: ${servico}`,
      `Quando: ${valores.urgencia}`,
    ].join("\n");
    const link = `${contact.whatsapp}?text=${encodeURIComponent(mensagem)}`;

    await gravarNaPlanilha(montarLead(dados, leadId));

    setEnviando(false);
    setDestino(link);
    // Navegação na MESMA aba: depois de um `await` o navegador já não trata
    // `window.open` como gesto do usuário e bloquearia a aba nova.
    window.location.href = link;
  }

  const invalido = (n: number) => (erro && etapa === n ? `${v.input} ${v.invalid}` : v.input);

  return (
    <motion.section
      ref={secaoRef}
      id="avaliacao"
      className={`${v.sec} ${v.formSec}`}
      aria-labelledby="form-heading"
      initial="hidden"
      animate={estado}
    >
      <div className={v.formWrap}>
        <div>
          <motion.div variants={revealHeadingVariants}>
            <p className={v.eyebrow}>{f.eyebrow}</p>
            <h2 id="form-heading" className={`${v.h2} ${v.formTitle}`}>
              {f.title} <span className={v.accent}>{f.titleAccent}</span>
            </h2>
          </motion.div>
          <motion.p className={v.formIntro} variants={staggerCard} custom={0}>
            {f.intro}
          </motion.p>
          <motion.ul className={v.formPontos} variants={staggerCard} custom={1}>
            {f.pontos.map((ponto) => (
              <li key={ponto}>{ponto}</li>
            ))}
          </motion.ul>
        </div>

        <motion.div variants={staggerCard} custom={1}>
          {destino ? (
            <div className={v.form} role="status">
              <h3 className={v.enviadoTitle}>{f.enviado.title}</h3>
              <p className={v.enviadoBody}>{f.enviado.body}</p>
              {/* `data-lead-registrado`: o Pixel não conta este clique de novo
                  (ver o listener de WhatsApp no MetaPixel). */}
              <Button href={destino} data-lead-registrado="" fullWidth>
                <WhatsAppIcon size={19} />
                {f.enviado.cta}
              </Button>
            </div>
          ) : (
            <form ref={formRef} className={v.form} onSubmit={enviar} noValidate>
              <input
                ref={armadilha}
                className={v.honey}
                type="text"
                name="site"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div className={v.progresso} aria-hidden="true">
                <div
                  className={v.progressoBar}
                  style={{ width: `${((etapa + 1) / TOTAL) * 100}%` }}
                />
              </div>
              <p className={v.etapaTxt}>
                Etapa {etapa + 1} de {TOTAL}
              </p>

              <div className={etapa === 0 ? v.stepOn : v.step} data-etapa="0">
                <label className={v.label} htmlFor="lead-nome">
                  {f.campos.nome.label}
                </label>
                <input
                  id="lead-nome"
                  className={invalido(0)}
                  type="text"
                  name="nome"
                  autoComplete="name"
                  placeholder={f.campos.nome.placeholder}
                  value={valores.nome}
                  onChange={(e) => setValores({ ...valores, nome: e.target.value })}
                />
              </div>

              <div className={etapa === 1 ? v.stepOn : v.step} data-etapa="1">
                <label className={v.label} htmlFor="lead-whatsapp">
                  {f.campos.whatsapp.label}
                </label>
                <input
                  id="lead-whatsapp"
                  className={invalido(1)}
                  type="tel"
                  name="whatsapp"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder={f.campos.whatsapp.placeholder}
                  value={valores.whatsapp}
                  onChange={(e) =>
                    setValores({ ...valores, whatsapp: mascararCelular(e.target.value) })
                  }
                />
              </div>

              <div className={etapa === 2 ? v.stepOn : v.step} data-etapa="2">
                <label className={v.label} htmlFor="lead-modelo">
                  {f.campos.modelo.label}
                </label>
                <input
                  id="lead-modelo"
                  className={invalido(2)}
                  type="text"
                  name="modelo"
                  autoComplete="off"
                  placeholder={f.campos.modelo.placeholder}
                  value={valores.modelo}
                  onChange={(e) => setValores({ ...valores, modelo: e.target.value })}
                />
              </div>

              <fieldset className={etapa === 3 ? v.stepOn : v.step} data-etapa="3">
                <legend className={v.label}>{f.campos.urgencia.label}</legend>
                <div className={v.opcoes}>
                  {f.campos.urgencia.opcoes.map((opcao) => (
                    <label key={opcao} className={v.opcao}>
                      <input
                        type="radio"
                        name="urgencia"
                        value={opcao}
                        checked={valores.urgencia === opcao}
                        onChange={() => {
                          setValores({ ...valores, urgencia: opcao });
                          setErro("");
                        }}
                      />
                      {opcao}
                    </label>
                  ))}
                </div>
              </fieldset>

              <p className={v.erro} role="alert">
                {erro}
              </p>

              <div className={v.acoes}>
                {etapa > 0 && (
                  <button type="button" className={v.voltar} onClick={() => irPara(etapa - 1)}>
                    {f.botoes.voltar}
                  </button>
                )}
                <Button type="submit" disabled={enviando} className={v.avancar} arrow>
                  {etapa < TOTAL - 1
                    ? f.botoes.continuar
                    : enviando
                      ? f.botoes.enviando
                      : f.botoes.enviar}
                </Button>
              </div>
              <p className={v.priv}>{f.privacidade}</p>
            </form>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
