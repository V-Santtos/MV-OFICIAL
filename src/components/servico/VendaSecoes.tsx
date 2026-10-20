"use client";

/**
 * Seções de VENDA da rota /servicos/[slug] (pacote Billion, 2026-10-09): hero
 * com foto, dores, processo, resultado, preço e "por que a MV". O protótipo
 * recebido foi a referência de composição; o código é o da casa — abertura do
 * hero em GSAP encadeada à intro, e seções com variantes centralizadas em
 * `motion.ts` e gatilho por `useInView` CONTROLADO (nunca `whileInView`, que
 * dispara "preso invisível" com o Lenis).
 *
 * Cada seção tem DOIS gatilhos, como o CoberturaBlock: o cabeçalho revela
 * quando ele entra na vista e a lista quando ELA entra — numa seção alta no
 * celular, os itens de baixo não animam fora da tela.
 */

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { motion, useInView } from "framer-motion";
import type { ServicoVenda } from "@/content";
import { Button } from "@/components/ui";
// Import DIRETO (não pelo barrel `@/components/layout`): o barrel reexporta o
// Footer, que é Server Component.
import { getLenis } from "@/components/layout/SmoothScroll";
import { heroCascade, introDelay, onIntroReveal, INTRO_ATIVA } from "@/lib/animation";
import { revealHeadingVariants, staggerCard } from "@/lib/animation/motion";
import v from "./Venda.module.css";

/**
 * CTA de venda: leva ao formulário de avaliação (`#avaliacao`, FormLead) no
 * fim da página. Continua sendo um `<a href>` de verdade; o clique só entrega
 * a rolagem ao Lenis, que é quem dirige o scroll do site — o salto nativo de
 * âncora brigaria com ele. Sem Lenis (reduced-motion), vale o salto nativo.
 */
function CtaAvaliacao({ children }: { children: ReactNode }) {
  return (
    <Button
      href="#avaliacao"
      arrow
      onClick={(e) => {
        const lenis = getLenis();
        const alvo = document.getElementById("avaliacao");
        if (!lenis || !alvo) return;
        e.preventDefault();
        lenis.scrollTo(alvo);
      }}
    >
      {children}
    </Button>
  );
}

function useReveal<T extends HTMLElement>(amount: number) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount });
  return [ref, inView ? "visible" : "hidden"] as const;
}

function Cabeca({
  id,
  eyebrow,
  title,
  accent,
}: {
  id: string;
  eyebrow: string;
  title: string;
  accent?: string;
}) {
  const [ref, state] = useReveal<HTMLDivElement>(0.5);
  return (
    <motion.div
      ref={ref}
      className={v.head}
      initial="hidden"
      animate={state}
      variants={revealHeadingVariants}
    >
      <p className={v.eyebrow}>{eyebrow}</p>
      <h2 id={id} className={v.h2}>
        {title}
        {accent && (
          <>
            {" "}
            <span className={v.accent}>{accent}</span>
          </>
        )}
      </h2>
    </motion.div>
  );
}

/** Lista com gatilho próprio; os filhos entram em cascata via `staggerCard`. */
function Lista({
  as,
  className,
  children,
}: {
  as: "ul" | "ol";
  className: string;
  children: ReactNode;
}) {
  const [ref, state] = useReveal<HTMLUListElement & HTMLOListElement>(0.12);
  const Tag = as === "ul" ? motion.ul : motion.ol;
  return (
    <Tag ref={ref} className={className} initial="hidden" animate={state}>
      {children}
    </Tag>
  );
}

export function HeroVenda({ data }: { data: ServicoVenda["hero"] }) {
  const txtRef = useRef<HTMLDivElement>(null);

  // ABERTURA em GSAP, a mesma do Hero da home: a cascata é encadeada à intro
  // (`onIntroReveal`) e só toca quando a cortina sobe — no mount ela rodaria
  // atrás do painel e ninguém veria. Itens com `data-reveal`, na ordem do DOM
  // (pino → título → texto → CTA). A foto não entra na cascata: como o carro
  // da home, o cenário já está na cena quando a página abre.
  useEffect(() => {
    const txt = txtRef.current;
    if (!txt) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", txt);
    if (!items.length) return;

    // Reduced-motion: conteúdo já visível (default do CSS), sem cascata.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Sem abertura, a entrada é a do CSS (`html[data-entrada-css]`, globals.css).
    if (!INTRO_ATIVA) return;

    let off = () => {};
    const ctx = gsap.context(() => {
      gsap.set(items, heroCascade.from);
      off = onIntroReveal(() => {
        gsap.to(items, { ...heroCascade.to, delay: introDelay(heroCascade.to.delay) });
      });
    }, txt);

    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <header className={v.hero}>
      <div className={v.heroIn}>
        <figure className={v.heroMedia}>
          <Image
            src={data.image}
            alt={data.imageAlt}
            fill
            sizes="(max-width: 56rem) 100vw, 45vw"
            preload
            fetchPriority="high"
            // `sync`: mesma correção do carro da home (Hero.tsx). Em `async` a
            // foto faltava no 1º quadro e entrava em seguida — um pisca.
            decoding="sync"
          />
        </figure>
        <div ref={txtRef} className={v.heroTxt}>
          <p className={v.local} data-reveal="0">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {data.local}
          </p>
          <h1 className={v.heroTitle} data-reveal="1">
            {data.title} <span className={v.accent}>{data.titleAccent}</span>
          </h1>
          <p className={v.heroBody} data-reveal="2">
            {data.body}
          </p>
          <div className={v.heroCta} data-reveal="3">
            <CtaAvaliacao>{data.cta}</CtaAvaliacao>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Dores({ data }: { data: ServicoVenda["dores"] }) {
  return (
    <section className={`${v.sec} ${v.light}`} aria-labelledby="dores-heading">
      <div className={v.wrap}>
        <Cabeca id="dores-heading" eyebrow={data.eyebrow} title={data.title} />
        <Lista as="ul" className={v.doresGrid}>
          {data.items.map((d, i) => (
            <motion.li key={d.q} className={v.dor} variants={staggerCard} custom={i}>
              <p className={v.dorQ}>“{d.q}”</p>
              <p className={v.dorA}>{d.a}</p>
            </motion.li>
          ))}
        </Lista>
      </div>
    </section>
  );
}

export function ProcessoVenda({ data }: { data: ServicoVenda["processo"] }) {
  return (
    <section className={`${v.sec} ${v.light}`} aria-labelledby="processo-venda-heading">
      <div className={v.wrap}>
        <Cabeca
          id="processo-venda-heading"
          eyebrow={data.eyebrow}
          title={data.title}
          accent={data.titleAccent}
        />
        <Lista as="ol" className={v.etapas}>
          {data.etapas.map((e, i) => (
            <motion.li key={e.title} className={v.etapa} variants={staggerCard} custom={i}>
              <span className={v.num} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className={v.etapaTitle}>{e.title}</h3>
                <p className={v.etapaDesc}>{e.desc}</p>
              </div>
            </motion.li>
          ))}
        </Lista>
      </div>
    </section>
  );
}

export function Resultado({ data }: { data: NonNullable<ServicoVenda["resultado"]> }) {
  // Fotos do MESMO carro repetiam a legenda embaixo de cada uma (Victor,
  // 2026-10-09). Quando todas dizem a mesma coisa, sai UMA legenda só, sob a
  // foto DO MEIO: no desktop ela fica centrada no conjunto; no celular, onde
  // as fotos empilham, fica no card central em vez de sobrar no fim da pilha.
  // Legendas diferentes (os pares de antes/depois que ainda vão chegar)
  // continuam cada uma na sua foto.
  const legendaUnica = data.fotos.every((f) => f.legenda === data.fotos[0].legenda)
    ? data.fotos[0].legenda
    : null;
  const meio = Math.floor(data.fotos.length / 2);

  return (
    <section className={`${v.sec} ${v.dark}`} aria-labelledby="resultado-heading">
      <div className={v.wrap}>
        <Cabeca
          id="resultado-heading"
          eyebrow={data.eyebrow}
          title={data.title}
          accent={data.titleAccent}
        />
        <Lista as="ul" className={v.fotos}>
          {data.fotos.map((f, i) => (
            <motion.li key={f.src} className={v.foto} variants={staggerCard} custom={i}>
              <figure>
                <div className={v.fotoImg}>
                  <Image src={f.src} alt={f.alt} fill sizes="(max-width: 48rem) 100vw, 33vw" />
                </div>
                {legendaUnica ? (
                  i === meio && <figcaption className={v.fotosCap}>{legendaUnica}</figcaption>
                ) : (
                  <figcaption className={v.fotoCap}>{f.legenda}</figcaption>
                )}
              </figure>
            </motion.li>
          ))}
        </Lista>
      </div>
    </section>
  );
}

export function Preco({ data }: { data: ServicoVenda["preco"] }) {
  const [ref, state] = useReveal<HTMLDivElement>(0.3);
  return (
    <section className={`${v.sec} ${v.light}`} aria-labelledby="preco-heading">
      <div className={v.wrap}>
        <Cabeca
          id="preco-heading"
          eyebrow={data.eyebrow}
          title={data.title}
          accent={data.titleAccent}
        />
        <motion.div ref={ref} initial="hidden" animate={state} variants={staggerCard}>
          <div className={v.precoCard}>
            <p className={v.badge}>{data.badge}</p>
            <h3 className={v.precoTitle}>{data.cardTitle}</h3>
            <p className={v.precoDesc}>{data.cardDesc}</p>
            <p className={v.precoFrom}>{data.priceLabel}</p>
            <p className={v.precoValor}>{data.price}</p>
            <p className={v.precoNote}>{data.note}</p>
            <CtaAvaliacao>{data.cta}</CtaAvaliacao>
          </div>
          <p className={v.aviso}>
            <strong>{data.aviso.label}</strong> {data.aviso.text}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function PorQue({ data }: { data: ServicoVenda["porque"] }) {
  return (
    <section className={`${v.sec} ${v.dark}`} aria-labelledby="porque-heading">
      <div className={v.wrap}>
        <Cabeca
          id="porque-heading"
          eyebrow={data.eyebrow}
          title={data.title}
          accent={data.titleAccent}
        />
        <Lista as="ul" className={v.porqueGrid}>
          {data.items.map((it, i) => (
            <motion.li key={it.title} className={v.porqueItem} variants={staggerCard} custom={i}>
              <h3 className={v.porqueTitle}>{it.title}</h3>
              <p className={v.porqueDesc}>{it.desc}</p>
            </motion.li>
          ))}
        </Lista>
      </div>
    </section>
  );
}

/** Envolve um bloco já existente (FAQ) pra ele ler em fundo claro. */
export function FaixaClara({ children }: { children: ReactNode }) {
  return <div className={v.light}>{children}</div>;
}
