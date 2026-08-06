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
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={styles.img}
                    // 🚫 SEM `priority` (2026-07-22). Era `priority={i<3}`, o que
                    // emitia 3 `<link rel=preload>` para fotos que ficam ~6 telas
                    // abaixo (depois de Posicionamento + Sobre 260vh + Círculo
                    // 260vh) e disputavam banda com o `hero-car.png`, que é o LCP
                    // real. Lazy (padrão) é o certo aqui.
                  />
                  <span className={styles.scrim} aria-hidden="true" />
                  <span className={styles.tint} aria-hidden="true" />
                  <div className={styles.meta}>
                    <h3 className={styles.label}>{s.title}</h3>
                    <span className={styles.arrow} aria-hidden="true">
                      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </span>
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
