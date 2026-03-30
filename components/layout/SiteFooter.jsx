import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__note">
          Proyecto PW 2026 Q1 — crowdfunding de proyectos comunitarios.{" "}
          <Link href="/campanas">Ver campañas</Link>
        </p>
        <p className="site-footer__meta">Stack: Next.js · Vercel · Supabase · Mercado Pago (fases posteriores).</p>
      </div>
    </footer>
  );
}
