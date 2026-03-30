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
            <p className="hero__eyebrow">Crowdfunding · PW 2026</p>
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
            <p className="hero__visual-caption">Proyectos con impacto local</p>
          </div>
        </div>
      </section>

      <section id="destacadas" className="section section--tint" aria-labelledby="destacadas-title">
        <div className="section__inner">
          <h2 id="destacadas-title" className="section__title">
            Campañas destacadas
          </h2>
          <p className="section__intro">
            Tres campañas destacadas (mock) para la demo: elegí una y entrá al detalle para ver progreso y aportes públicos.
          </p>
          <div className="campaign-grid">
            {featured.map((c) => (
              <CampaignCard key={c.slug} campaign={c} />
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-band" aria-labelledby="cta-title">
        <div className="section__inner cta-band__inner">
          <h2 id="cta-title" className="cta-band__title">
            ¿Listo para explorar el catálogo completo?
          </h2>
          <p className="cta-band__text">Todas las campañas activas están en un solo lugar.</p>
          <Link href="/campanas" className="button button--primary button--lg">
            Ir al listado de campañas
          </Link>
        </div>
      </section>
    </>
  );
}
