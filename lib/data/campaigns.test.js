import {
  deriveInitialsFallback,
  getContributionAmountDisplay,
  getContributorDisplayName,
} from "./campaigns";

describe("privacidad de aportes (vista pública)", () => {
  it("muestra nombre público cuando showPublicName es true", () => {
    const name = getContributorDisplayName({
      id: "1",
      showPublicName: true,
      displayNameWhenPublic: "Ana López",
      initialsFallback: "A. L.",
      showAmount: true,
      amount: 100,
    });
    expect(name).toBe("Ana López");
  });

  it("usa iniciales cuando el nombre no es público", () => {
    const name = getContributorDisplayName({
      id: "2",
      showPublicName: false,
      displayNameWhenPublic: "Oculto",
      initialsFallback: "I. R.",
      showAmount: true,
      amount: 50,
    });
    expect(name).toBe("I. R.");
  });

  it('muestra "Anónimo" si no hay iniciales y el nombre no es público', () => {
    const name = getContributorDisplayName({
      id: "3",
      showPublicName: false,
      displayNameWhenPublic: "—",
      initialsFallback: "",
      showAmount: true,
      amount: 20,
    });
    expect(name).toBe("Anónimo");
  });

  it("deriva iniciales nombre y apellido", () => {
    expect(deriveInitialsFallback("María Elena Vidal")).toBe("M. V.");
  });

  it("deriva una inicial si hay un solo término", () => {
    expect(deriveInitialsFallback("Cooperativa")).toBe("C.");
  });

  it("devuelve cadena vacía si no hay nombre", () => {
    expect(deriveInitialsFallback("   ")).toBe("");
  });

  it('oculta el monto con etiqueta "Monto oculto"', () => {
    const out = getContributionAmountDisplay({
      id: "4",
      showPublicName: true,
      displayNameWhenPublic: "X",
      initialsFallback: "X",
      showAmount: false,
      amount: 999,
    });
    expect(out.isHidden).toBe(true);
    expect(out.visibleLabel).toBe("Monto oculto");
  });
});
