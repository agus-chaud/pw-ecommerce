import Link from "next/link";
import { CampaignCard } from "@/components/campaign/CampaignCard";
import { getFeaturedCampaigns } from "@/lib/data/campaigns";

export default function Home() {
  const featured = getFeaturedCampaigns();

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__inner">
          <div className="hero__copy">
            <p className="hero__eyebrow">Proyectos que transforman el barrio</p>
            <h1 id="hero-title" className="hero__title">
              Microfinanciación que se ve en el barrio
            </h1>
            <p className="hero__lead">
              Sumate a campañas reales: bibliotecas, huertas, radios escolares y más. Transparencia en metas y respeto
              por quien aporta.
            </p>
            <div className="hero__actions">
              <Link href="/campanas" className="button button--primary">
                Ver campañas
              </Link>
              <a href="#destacadas" className="button button--ghost">
                Destacadas
              </a>
            </div>
          </div>
          <div className="hero__visual" aria-hidden="true">
            <div className="hero__blob" />
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-icon">🏘️</span>
                <div>
                  <span className="hero__stat-label">Campañas activas</span>
                  <span className="hero__stat-value">3 proyectos</span>
                </div>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-icon">💰</span>
                <div>
                  <span className="hero__stat-label">Recaudado</span>
                  <span className="hero__stat-value">$45.000 ARS</span>
                </div>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-icon">🤝</span>
                <div>
                  <span className="hero__stat-label">Aportantes</span>
                  <span className="hero__stat-value">12 vecinos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="destacadas" className="section section--tint" aria-labelledby="destacadas-title">
        <div className="section__inner">
          <h2 id="destacadas-title" className="section__title">
            Campañas destacadas
          </h2>
          <p className="section__intro">
            Explorá los proyectos activos y aportá al que más te movilice.
          </p>
          <div className="campaign-grid">
            {featured.map((c) => (
              <CampaignCard key={c.slug} campaign={c} />
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-split" aria-labelledby="cta-split-title">
        <div className="section__inner">
          <h2 id="cta-split-title" className="cta-split__title">
            ¿Qué querés hacer hoy?
          </h2>
          <div className="cta-split__grid">
            <div className="cta-split__card cta-split__card--donor">
              <span className="cta-split__icon" aria-hidden="true">🤝</span>
              <h3 className="cta-split__card-title">Quiero apoyar</h3>
              <p className="cta-split__card-text">
                Explorá campañas activas y aportá a proyectos que transforman el barrio.
              </p>
              <Link href="/campanas" className="button button--primary">
                Ver campañas
              </Link>
            </div>
            <div className="cta-split__card cta-split__card--creator">
              <span className="cta-split__icon" aria-hidden="true">🌱</span>
              <h3 className="cta-split__card-title">Quiero crear</h3>
              <p className="cta-split__card-text">
                Publicá tu campaña y conectá con quienes quieren ver tu proyecto crecer.
              </p>
              <button className="button button--ghost" disabled aria-disabled="true">
                Próximamente
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
