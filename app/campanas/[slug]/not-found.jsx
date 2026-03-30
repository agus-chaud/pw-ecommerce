import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell not-found">
      <h1 className="not-found__title">Campaña no encontrada</h1>
      <p className="not-found__text">El enlace puede estar desactualizado o la campaña fue dada de baja.</p>
      <Link href="/campanas" className="button button--primary">
        Volver al listado
      </Link>
    </div>
  );
}
