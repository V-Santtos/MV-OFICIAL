"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { servicos, servicosMeta } from "@/content";
import { revealHeadingVariants, staggerCard } from "@/lib/animation";
// Import DIRETO (não pelo barrel `@/components/layout`): o barrel reexporta o
// Footer, que é Server Component, e puxá-lo pra dentro de um client component
// o arrastaria pro bundle do navegador.
import { ehCliqueSimples, useRouteTransition } from "@/components/layout/RouteTransition";
import styles from "./Servicos.module.css";

function ServiceIcon({ slug }: { slug: string }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };

  switch (slug) {
    case "vitrificacao":
      return <svg {...common}><path d="M12 3 19 6v5c0 4.8-2.8 8.1-7 10-4.2-1.9-7-5.2-7-10V6l7-3Z" /></svg>;
    case "polimento":
      return <svg {...common}><path d="m12 2 2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2Z" /><path d="m19 19 1 2m-2-1 2-1" /></svg>;
    case "higienizacao-completa":
      return <svg {...common}><path d="M12 3C9 7.5 6 10.8 6 14.3a6 6 0 0 0 12 0C18 10.8 15 7.5 12 3Z" /></svg>;
    case "bancos-e-estofados":
      return <svg {...common}><path d="M7 3h7a3 3 0 0 1 3 3v7H7V3Zm0 10H5a2 2 0 0 0-2 2v3h17v-3a2 2 0 0 0-2-2h-1M5 18v3m14-3v3" /></svg>;
    case "limpeza-de-motor":
      return <svg {...common}><path d="M5 8h13v10H5V8Zm3-3v3m4-3v3m4-3v3M2 11h3m-3 4h3m13-4h4m-4 4h4M8 12h7" /></svg>;
    default:
      return <svg {...common}><path d="M5 4h14v16H5V4Zm0 5h14M8 15h8" /></svg>;
  }
}

/**
 * Catálogo de serviços — mosaico foto-led (ref Glänzen), emendado no fim do
 * Círculo (dark). Cada card é uma PORTA pra rota `/servicos/[slug]` (a construir).
 *
 * ENTRADA (lapidação 2026-07-17, Victor A+B+C): o cabeçalho REVELA e os cards
 * MONTAM em stagger ao entrar (antes era estático — destoava do resto do site,
 * que revela tudo no scroll). Client Component + `useInView` CONTROLADO (não
 * `whileInView`, que disparava "preso invisível" logo após o Círculo pinado).
 * O conteúdo continua no HTML do SSR (client component SSR-a), então SEO ok.
 *
 * ⚠️ O escalonamento do mosaico é `transform: translateY` no `.cell` (CSS). O
 * Framer NÃO pode animar o `.cell` (sobrescreveria esse transform e achataria o
 * mosaico) — por isso o reveal roda num WRAPPER interno (`.cardReveal`), e o
 * `.cell` mantém só o offset do mosaico. HOVER segue em CSS no `.card`.
 *
 * ⚠️ Rotas `/servicos/[slug]` ainda não existem — clicar dá 404 até construí-las.
 */
export function Servicos() {
  // Cada card abre a rota da categoria pela CORTINA da logo (Victor, 2026-08-03)
  // em vez do corte seco da navegação client-side. Ver `RouteTransition`.
  const { transitionTo } = useRouteTransition();

  // UM gatilho ÚNICO pra toda a cascata (Victor, 2026-07-17): tag → título →
  // cards revelam em sequência a partir do MESMO ponto, na ordem certa. Atrasado
  // (margem inferior -45%): só dispara quando o cabeçalho sobe além da metade da
  // tela, com a frase do Círculo ("Do cuidado ao resultado") já fora de cena —
  // assim não se vê os dois títulos juntos NEM a galeria antes do título.
  const revealRef = useRef<HTMLElement>(null);

  // Mobile aperta o gatilho (Victor, 2026-07-24): no desktop o -45% é OBRIGATÓRIO
  // — segura o título até "Do cuidado ao resultado" sair de cena (lá a frase sai
  // só por scroll). No mobile a frase agora dá FADE+BLUR de saída no Círculo, então
  // ela já sumiu visualmente cedo; o título pode entrar bem antes (-15%) sem os dois
  // se cruzarem, encurtando o vão escuro da emenda.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const inView = useInView(revealRef, {
    once: true,
    margin: isMobile ? "0px 0px -15% 0px" : "0px 0px -45% 0px",
  });

  return (
    <section id="servicos" className={styles.section} aria-labelledby="serv-heading">
      <div className={styles.inner}>
        <motion.header
          ref={revealRef}
          className={styles.head}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={revealHeadingVariants}
        >
          <p className={styles.eyebrow}>{servicosMeta.eyebrow}</p>
          <h2 id="serv-heading" className={styles.title}>
            {servicosMeta.title}
          </h2>
        </motion.header>

        <ul className={styles.grid}>
          {servicos.map((s, i) => (
            <li key={s.slug} className={styles.cell}>
              <motion.div
                className={styles.cardReveal}
                custom={i}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={staggerCard}
              >
                {/* Segue sendo `<Link href>` de verdade — prefetch, URL real e
                    abrir em aba nova continuam nativos. O `onClick` só troca o
                    corte seco pela cortina no clique SIMPLES. */}
                <Link
                  href={`/servicos/${s.slug}`}
                  className={styles.card}
                  // Deixa o CSS enquadrar a foto de cada categoria por slug
                  // (`object-position`) sem depender de nth-child.
                  data-slug={s.slug}
                  onClick={(e) => {
                    if (!ehCliqueSimples(e)) return;
                    e.preventDefault();
                    transitionTo(`/servicos/${s.slug}`);
                  }}
                >
                  <div className={styles.media}>
                    <Image
                      src={s.image}
                      alt={s.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={styles.img}
                    />
                    <span className={styles.scrim} aria-hidden="true" />
                    <span className={styles.tint} aria-hidden="true" />
                    <div className={styles.meta}>
                      <span className={styles.arrow} aria-hidden="true">
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="m13 6 6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className={styles.details}>
                    <div className={styles.name}>
                      <span className={styles.icon}><ServiceIcon slug={s.slug} /></span>
                      <h3 className={styles.label}>{s.title}</h3>
                    </div>
                    <p className={styles.description}>{s.desc}</p>
                    <span className={styles.more}>Ver mais <span aria-hidden="true">→</span></span>
                  </div>
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
