/**
 * Datos mock para E2–E4. Las reglas de privacidad públicas:
 * - Si showPublicName es false: mostrar iniciales si existen, si no "Anónimo".
 * - Si showAmount es false: mostrar "Monto oculto" (el monto real sigue existiendo para totales en servidor en fases posteriores).
 *
 * Objeto aporte (contribution): { id, showPublicName, displayNameWhenPublic, initialsFallback, showAmount, amount }
 */

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatMoney(amount) {
  return currency.format(amount);
}

/**
 * Deriva iniciales para la lista pública cuando el nombre completo no se muestra.
 * Regla: primera letra del primer término + último término (ej. "María Elena Vidal" → "M. V.").
 * Un solo término → una inicial + punto.
 */
export function deriveInitialsFallback(displayName) {
  const trimmed = (displayName ?? "").trim();
  if (!trimmed) return "";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  const up = (ch) => ch.toLocaleUpperCase("es-AR");
  if (parts.length === 1) {
    const w = parts[0];
    return w.length ? `${up(w[0])}.` : "";
  }
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return `${up(first)}. ${up(last)}.`;
}

/** @param {{ showPublicName: boolean; displayNameWhenPublic: string; initialsFallback: string }} c */
export function getContributorDisplayName(c) {
  if (c.showPublicName) return c.displayNameWhenPublic;
  return c.initialsFallback.trim() || "Anónimo";
}

/** @param {{ showAmount: boolean; amount: number }} c */
export function getContributionAmountDisplay(c) {
  if (c.showAmount) {
    return { visibleLabel: formatMoney(c.amount), isHidden: false };
  }
  return { visibleLabel: "Monto oculto", isHidden: true };
}

export const campaigns = [
  {
    slug: "biblioteca-barrial-norte",
    title: "Biblioteca barrial Norte",
    summary: "Libros, lectura y talleres para 120 familias del barrio.",
    description:
      "Queremos acondicionar un espacio comunitario con estanterías, fondo bibliográfico inicial y tres ciclos de talleres de alfabetización digital. El dinero cubre mobiliario, compra coordinada de libros y honorarios de dos facilitadoras.",
    goal: 850_000,
    raised: 512_400,
    imageSrc: "/campaigns/biblioteca.svg",
    imageAlt: "Ilustración abstracta de libros apilados y luz cálida",
    featured: true,
    contributions: [
      {
        id: "c1-1",
        showPublicName: true,
        displayNameWhenPublic: "María Elena Vidal",
        initialsFallback: "M. V.",
        showAmount: true,
        amount: 15_000,
      },
      {
        id: "c1-2",
        showPublicName: false,
        displayNameWhenPublic: "Ignacio Ruiz",
        initialsFallback: "I. R.",
        showAmount: false,
        amount: 8_500,
      },
      {
        id: "c1-3",
        showPublicName: false,
        displayNameWhenPublic: "—",
        initialsFallback: "",
        showAmount: true,
        amount: 5_000,
      },
    ],
  },
  {
    slug: "huerta-comunitaria-sur",
    title: "Huerta comunitaria Sur",
    summary: "Riego, compost y invernadero para abastecer la feria local.",
    description:
      "Instalaremos riego por goteo, tres camas elevadas y un invernadero chico para alargar la temporada. Los fondos compran materiales, semillas certificadas y capacitación en compostaje para quienes participan en turnos.",
    goal: 620_000,
    raised: 198_000,
    imageSrc: "/campaigns/huerta.svg",
    imageAlt: "Ilustración de hojas y suelo en tonos verdes",
    featured: true,
    contributions: [
      {
        id: "c2-1",
        showPublicName: true,
        displayNameWhenPublic: "Cooperativa El Brote",
        initialsFallback: "C. E.",
        showAmount: true,
        amount: 25_000,
      },
      {
        id: "c2-2",
        showPublicName: true,
        displayNameWhenPublic: "Lucas Méndez",
        initialsFallback: "L. M.",
        showAmount: false,
        amount: 12_000,
      },
    ],
  },
  {
    slug: "radio-escolar-fm",
    title: "Radio escolar FM",
    summary: "Equipamiento y habilitación para la radio del polideportivo.",
    description:
      "Necesitamos consola, micrófonos, PC de edición y trámites de habilitación para que el taller de comunicación salga al aire una vez por semana.",
    goal: 1_200_000,
    raised: 945_000,
    imageSrc: "/campaigns/radio.svg",
    imageAlt: "Ilustración de ondas de radio y micrófono estilizado",
    featured: true,
    contributions: [
      {
        id: "c3-1",
        showPublicName: false,
        displayNameWhenPublic: "—",
        initialsFallback: "A. T.",
        showAmount: true,
        amount: 50_000,
      },
      {
        id: "c3-2",
        showPublicName: true,
        displayNameWhenPublic: "Prof. Daniela Ortega",
        initialsFallback: "D. O.",
        showAmount: true,
        amount: 10_000,
      },
    ],
  },
];

export function getCampaignBySlug(slug) {
  return campaigns.find((c) => c.slug === slug);
}

export function getFeaturedCampaigns() {
  return campaigns.filter((c) => c.featured);
}
