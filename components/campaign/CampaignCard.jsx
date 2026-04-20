import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/data/campaigns";

export function CampaignCard({ campaign }) {
  const pct = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));

  return (
    <article className="campaign-card">
      <Link href={`/campanas/${campaign.slug}`} className="campaign-card__image-link">
        <Image
          src={campaign.imageSrc}
          alt=""
          width={800}
          height={500}
          className="campaign-card__image"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={campaign.featured}
        />
        <span className="sr-only">Ir a {campaign.title}</span>
      </Link>
      <div className="campaign-card__body">
        <h3 className="campaign-card__title">
          <Link href={`/campanas/${campaign.slug}`}>{campaign.title}</Link>
        </h3>
        <p className="campaign-card__summary">{campaign.summary}</p>
        <p className="campaign-card__stats" aria-label={`Progreso ${pct} por ciento`}>
          <span>{formatMoney(campaign.raised)}</span>
          <span className="campaign-card__stats-sep"> · </span>
          <span>meta {formatMoney(campaign.goal)}</span>
        </p>
        <div className="campaign-card__progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="campaign-card__progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <Link href={`/campanas/${campaign.slug}`} className="campaign-card__cta">
          Ver campaña
        </Link>
      </div>
    </article>
  );
}
