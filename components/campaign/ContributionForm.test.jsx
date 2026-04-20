import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContributionForm } from "./ContributionForm";

const slugOk = "biblioteca-barrial-norte";

function getPreviewListRegion() {
  return screen.getByRole("region", { name: /Vista previa en la lista/i });
}

describe("ContributionForm — comportamiento observable (smart-testing)", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("muestra el título y el nombre de campaña", () => {
    render(
      <ContributionForm campaignSlug={slugOk} campaignTitle="Biblioteca barrial Norte" />,
    );
    expect(screen.getByRole("heading", { name: /Hacé tu aporte/i })).toBeInTheDocument();
    expect(screen.getByText(/Biblioteca barrial Norte/i)).toBeInTheDocument();
  });

  it("cuando el donante completa monto y nombre, la vista previa refleja nombre y cifra visibles", async () => {
    const user = userEvent.setup();
    render(<ContributionForm campaignSlug={slugOk} campaignTitle="Test" />);

    const amountField = screen.getByLabelText(/Monto \(ARS\)/i);
    await user.clear(amountField);
    await user.type(amountField, "500");

    const nameField = screen.getByLabelText(/Nombre para identificarte/i);
    await user.clear(nameField);
    await user.type(nameField, "Ana López");

    const preview = getPreviewListRegion();
    const row = within(preview).getByRole("listitem");

    expect(row).toHaveTextContent("Ana López");
    expect(row.textContent).toMatch(/500/);
  });

  it("si el donante oculta el nombre público, la vista previa muestra iniciales (no el nombre completo)", async () => {
    const user = userEvent.setup();
    render(<ContributionForm campaignSlug={slugOk} campaignTitle="Test" />);

    await user.clear(screen.getByLabelText(/Monto \(ARS\)/i));
    await user.type(screen.getByLabelText(/Monto \(ARS\)/i), "200");
    await user.clear(screen.getByLabelText(/Nombre para identificarte/i));
    await user.type(screen.getByLabelText(/Nombre para identificarte/i), "Ana López");

    await user.click(
      screen.getByRole("checkbox", { name: /Mostrar mi nombre públicamente/i }),
    );

    const preview = getPreviewListRegion();
    const row = within(preview).getByRole("listitem");

    expect(row).toHaveTextContent("A. L.");
    expect(row).not.toHaveTextContent("Ana López");
  });

  it("al enviar con monto por debajo del mínimo, el usuario ve un mensaje de error claro", async () => {
    const user = userEvent.setup();
    render(<ContributionForm campaignSlug={slugOk} campaignTitle="Test" />);

    await user.clear(screen.getByLabelText(/Monto \(ARS\)/i));
    await user.type(screen.getByLabelText(/Monto \(ARS\)/i), "50");
    await user.clear(screen.getByLabelText(/Nombre para identificarte/i));
    await user.type(screen.getByLabelText(/Nombre para identificarte/i), "Sólo nombre");

    await user.click(screen.getByRole("button", { name: /Continuar hacia el pago/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/mínimo/i);
  });

  it("con datos válidos, envía POST al borde de red con el JSON acordado y muestra la respuesta del servidor", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Respuesta del servidor" }),
    });

    const user = userEvent.setup();
    render(<ContributionForm campaignSlug={slugOk} campaignTitle="Test" />);

    await user.clear(screen.getByLabelText(/Monto \(ARS\)/i));
    await user.type(screen.getByLabelText(/Monto \(ARS\)/i), "1000");
    await user.clear(screen.getByLabelText(/Nombre para identificarte/i));
    await user.type(screen.getByLabelText(/Nombre para identificarte/i), "Ana López");

    await user.click(screen.getByRole("button", { name: /Continuar hacia el pago/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    const [, init] = global.fetch.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      amount: 1000,
      displayName: "Ana López",
      showPublicName: true,
      showAmount: true,
    });

    expect(await screen.findByText(/Respuesta del servidor/i)).toBeInTheDocument();
  });
});
