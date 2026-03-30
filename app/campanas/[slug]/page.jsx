import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContributionsList } from "@/components/campaign/ContributionsList";
import { FundingProgress } from "@/components/campaign/FundingProgress";
import { campaigns, getCampaignBySlug } from "@/lib/data/campaigns";

export async function generateStaticParams() {
  return campaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const campaign = getCampaignBySlug(params.slug);
  if (!campaign) return { title: "No encontrada" };
  return {
    title: campaign.title,
    description: campaign.summary,
  };
}

export default function CampanaDetallePage({ params }) {
  const campaign = getCampaignBySlug(params.slug);
  if (!campaign) notFound();

  return (
    <article className="page-shell campaign-detail">
      <nav className="breadcrumb" aria-label="Migas de pan">
        <Link href="/">Inicio</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/campanas">Campañas</Link>
        <span aria-hidden="true"> / </span>
        <span className="breadcrumb__current">{campaign.title}</span>
      </nav>

      <header className="campaign-detail__header">
        <h1 className="campaign-detail__title">{campaign.title}</h1>
        <p className="campaign-detail__summary">{campaign.summary}</p>
      </header>

      <div className="campaign-detail__media">
        <Image
          src={campaign.imageSrc}
          alt={campaign.imageAlt}
          width={960}
          height={600}
          className="campaign-detail__image"
          sizes="(max-width: 960px) 100vw, 960px"
          priority
        />
      </div>

      <div className="campaign-detail__grid">
        <section className="campaign-detail__body" aria-labelledby="desc-heading">
          <h2 id="desc-heading" className="campaign-detail__section-title">
            Sobre la campaña
          </h2>
          <p className="campaign-detail__description">{campaign.description}</p>
        </section>
        <aside className="campaign-detail__aside">
          <FundingProgress campaign={campaign} />
        </aside>
      </div>

      <ContributionsList contributions={campaign.contributions} />
    </article>
  );
}
