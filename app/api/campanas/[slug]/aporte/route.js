import { NextResponse } from "next/server";
import { getCampaignBySlug } from "@/lib/data/campaigns";
import {
  buildPublicPreviewRow,
  validateContributionBody,
} from "@/lib/contribution/validate";

/**
 * POST /api/campanas/[slug]/aporte
 * Valida en servidor (E3). En fases posteriores se enlaza a pago y persistencia.
 */
export async function POST(request, { params }) {
  const campaign = getCampaignBySlug(params.slug);
  if (!campaign) {
    return NextResponse.json({ error: "Campaña no encontrada." }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "No se pudo leer el cuerpo (JSON esperado)." },
      { status: 400 },
    );
  }

  const result = validateContributionBody(body);
  if (!result.valid) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  const preview = buildPublicPreviewRow(result.data);

  return NextResponse.json(
    {
      ok: true,
      campaignSlug: params.slug,
      message:
        "Datos validados en el servidor. El siguiente paso del producto será Mercado Pago y el registro del aporte.",
      publicPreview: {
        contributorLabel: preview.contributorLabel,
        amountLabel: preview.amount.visibleLabel,
        amountHidden: preview.amount.isHidden,
      },
    },
    { status: 200 },
  );
}
