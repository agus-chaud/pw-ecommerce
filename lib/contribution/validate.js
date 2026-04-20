import {
  deriveInitialsFallback,
  formatMoney,
  getContributionAmountDisplay,
  getContributorDisplayName,
} from "@/lib/data/campaigns";

export const MIN_CONTRIBUTION_AMOUNT = 100;
export const MAX_DISPLAY_NAME_LENGTH = 120;

/**
 * Normaliza y valida el cuerpo del aporte (cliente y servidor).
 * @param {unknown} raw
 * @returns {{ valid: boolean; errors: Record<string, string>; data?: { amount: number; displayName: string; showPublicName: boolean; showAmount: boolean } }}
 */
export function validateContributionBody(raw) {
  const displayName = String(raw?.displayName ?? "").slice(0, MAX_DISPLAY_NAME_LENGTH);
  const showPublicName =
    raw?.showPublicName === undefined
      ? true
      : raw?.showPublicName === true || raw?.showPublicName === "true";
  const showAmount =
    raw?.showAmount === undefined
      ? true
      : raw?.showAmount !== false && raw?.showAmount !== "false";

  const amountRaw = raw?.amount;
  const amount =
    typeof amountRaw === "number"
      ? amountRaw
      : Number.parseFloat(String(amountRaw ?? "").replace(",", "."));

  const errors = {};

  if (!Number.isFinite(amount) || amount < MIN_CONTRIBUTION_AMOUNT) {
    errors.amount = `Ingresá un monto válido (mínimo ${formatMoney(MIN_CONTRIBUTION_AMOUNT)}).`;
  }

  if (showPublicName && !displayName.trim()) {
    errors.displayName =
      "Si querés mostrar tu nombre en la lista, escribilo acá (o desactivá “Mostrar mi nombre públicamente”).";
  }

  const valid = Object.keys(errors).length === 0;

  return {
    valid,
    errors,
    data: valid
      ? {
          amount,
          displayName: displayName.trim(),
          showPublicName,
          showAmount,
        }
      : undefined,
  };
}

/**
 * Construye la fila pública que vería la lista (sin persistir aún).
 * @param {{ amount: number; displayName: string; showPublicName: boolean; showAmount: boolean }} data
 */
export function buildPublicPreviewRow(data) {
  const initialsFallback = deriveInitialsFallback(data.displayName);
  const contribution = {
    id: "pending",
    showPublicName: data.showPublicName,
    displayNameWhenPublic: data.displayName.trim() || "—",
    initialsFallback,
    showAmount: data.showAmount,
    amount: data.amount,
  };
  return {
    contributorLabel: getContributorDisplayName(contribution),
    amount: getContributionAmountDisplay(contribution),
  };
}
