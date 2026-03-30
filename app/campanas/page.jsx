import { CampaignCard } from "@/components/campaign/CampaignCard";
import { campaigns } from "@/lib/data/campaigns";

export const metadata = {
  title: "Campañas",
  description: "Listado de campañas de crowdfunding comunitario disponibles.",
};

export default function CampanasPage() {
  return (
    <div className="page-shell">
      <header className="page-header">
        <h1 className="page-header__title">Campañas activas</h1>
        <p className="page-header__lead">
          Cada tarjeta enlaza al detalle: vas a ver la meta, el progreso y los aportes visibles según privacidad.
        </p>
      </header>
      <div className="campaign-grid campaign-grid--wide">
        {campaigns.map((c) => (
          <CampaignCard key={c.slug} campaign={c} />
        ))}
      </div>
    </div>
  );
}
