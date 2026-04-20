import {
  MIN_CONTRIBUTION_AMOUNT,
  buildPublicPreviewRow,
  validateContributionBody,
} from "./validate";

/**
 * Capa de reglas de negocio compartida (cliente + API).
 * Smart-testing: se prueba el contrato que el usuario “siente” (mensajes, flags, etiquetas públicas).
 */
describe("Aporte — validateContributionBody (reglas de negocio)", () => {
  it("acepta un aporte mínimo con nombre público y monto visible", () => {
    const r = validateContributionBody({
      amount: MIN_CONTRIBUTION_AMOUNT,
      displayName: "Ana López",
      showPublicName: true,
      showAmount: true,
    });
    expect(r.valid).toBe(true);
    expect(r.data).toMatchObject({
      amount: MIN_CONTRIBUTION_AMOUNT,
      displayName: "Ana López",
      showPublicName: true,
      showAmount: true,
    });
  });

  it("rechaza montos por debajo del piso (mensaje alineado al formulario)", () => {
    const r = validateContributionBody({
      amount: MIN_CONTRIBUTION_AMOUNT - 1,
      displayName: "X",
      showPublicName: true,
    });
    expect(r.valid).toBe(false);
    expect(r.errors.amount).toMatch(/mínimo/i);
  });

  it("exige nombre si el donante eligió mostrar nombre público", () => {
    const r = validateContributionBody({
      amount: 500,
      displayName: "   ",
      showPublicName: true,
    });
    expect(r.valid).toBe(false);
    expect(r.errors.displayName).toBeTruthy();
  });

  it("permite nombre vacío cuando el nombre no se muestra en la lista (iniciales o anónimo)", () => {
    const r = validateContributionBody({
      amount: 500,
      displayName: "",
      showPublicName: false,
    });
    expect(r.valid).toBe(true);
  });

  it("normaliza montos ingresados como texto con coma decimal", () => {
    const r = validateContributionBody({
      amount: "500,5",
      displayName: "A",
      showPublicName: true,
    });
    expect(r.valid).toBe(true);
    expect(r.data.amount).toBe(500.5);
  });
});

describe("Aporte — buildPublicPreviewRow (vista pública derivada)", () => {
  it("combina nombre oculto + monto oculto según reglas de privacidad", () => {
    const row = buildPublicPreviewRow({
      amount: 10_000,
      displayName: "María Pérez",
      showPublicName: false,
      showAmount: false,
    });
    expect(row.contributorLabel).toMatch(/M\./);
    expect(row.amount.isHidden).toBe(true);
    expect(row.amount.visibleLabel).toBe("Monto oculto");
  });
});
