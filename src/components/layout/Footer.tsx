import { brand, footer, footerNavLinks, socialLinks } from "@/content";
import { socialIcons } from "@/components/ui";
import { FooterCascade } from "./FooterCascade";
import styles from "./Footer.module.css";

/**
 * Footer — ilha CLARA de fecho (2ª do site, depois da Sobre). Base MetroRide,
 * adaptada: marquee de convite (ANIMADO, script) no topo + colunas (SEM
 * newsletter/logo/botão) + faixa AZUL gigante "MV AUTOMOTIVA" embaixo (caixa-alta
 * e ESTÁTICA — texto fixo, não anima; Victor 2026-07-17). O marquee do topo é
 * CSS puro → Footer segue Server Component.
 */
/** As frases do par, encadeadas pelo travessão e repetidas até encher a faixa.
 *  O `join` é o que faz o loop alternar as duas em vez de repetir uma só. */
const marqueeRun = `${footer.marquee.join("  —  ")}  —  `.repeat(6);

export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Marquee de convite (ANIMADO, script) */}
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          <span className={styles.marqueeText}>{marqueeRun}</span>
          <span className={styles.marqueeText}>{marqueeRun}</span>
        </div>
      </div>

      <div className={styles.inner}>
        {/* Cascata das 3 colunas ao entrar em vista. O invólucro é a ÚNICA parte
            client do rodapé; as colunas seguem renderizadas no servidor. */}
        <FooterCascade className={styles.grid}>
          {/* Marca (no lugar da newsletter) — só identidade em texto: sem logo e
              sem botão WhatsApp (o CTA do WhatsApp já está logo acima, no Contato;
              dois botões colados não fazem sentido). Victor, 2026-07-17. */}
          <div className={styles.brandCol}>
            <p className={styles.brandName}>{brand.name}</p>
            <p className={styles.tagline}>{brand.footerTagline}</p>
            <p className={styles.loc}>{brand.location}</p>
          </div>

          {/* Navegação */}
          <nav className={styles.navCol} aria-label="Rodapé">
            <p className={styles.colTitle}>Navegação</p>
            <ul className={styles.list}>
              {footerNavLinks.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className={styles.link}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Redes */}
          <div className={styles.socialCol}>
            <p className={styles.colTitle}>Redes</p>
            <ul className={styles.list}>
              {socialLinks.map(({ href, label, icon }) => {
                const Icon = socialIcons[icon];
                return (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.social}>
                      <Icon size={16} />
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </FooterCascade>

        <div className={styles.rule} aria-hidden="true" />

        <div className={styles.bottom}>
          <p className={styles.copy}>{brand.copyright}</p>
        </div>
      </div>

      {/* Faixa azul de fecho — só a cor da marca, SEM texto (Victor 2026-07-17:
          o wordmark ficava estranho; a faixa limpa fecha melhor). */}
      <div className={styles.band} aria-hidden="true" />
    </footer>
  );
}
