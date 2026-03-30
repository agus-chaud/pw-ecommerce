import { formatMoney } from "@/lib/data/campaigns";

export function FundingProgress({ campaign }) {
  const pct = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
  const labelId = `progress-label-${campaign.slug}`;

  return (
    <section className="funding-progress" aria-labelledby={labelId}>
      <h2 id={labelId} className="funding-progress__title">
        Progreso de la meta
      </h2>
      <p className="funding-progress__figures">
        <span className="funding-progress__raised">{formatMoney(campaign.raised)}</span>
        <span className="funding-progress__sep" aria-hidden="true">
          {" "}
          /{" "}
        </span>
        <span className="funding-progress__goal">de {formatMoney(campaign.goal)}</span>
      </p>
      <div
        className="funding-progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-labelledby={labelId}
      >
        <div className="funding-progress__fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="funding-progress__pct">{pct}% de la meta</p>
    </section>
  );
}
