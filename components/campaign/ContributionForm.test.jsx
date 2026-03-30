import { render, screen, fireEvent, within } from "@testing-library/react";
import { ContributionForm } from "./ContributionForm";

describe("ContributionForm (comportamiento E3)", () => {
  it("muestra el título y el nombre de campaña", () => {
    render(<ContributionForm campaignTitle="Biblioteca barrial Norte" />);
    expect(screen.getByRole("heading", { name: /Hacé tu aporte/i })).toBeInTheDocument();
    expect(screen.getByText(/Biblioteca barrial Norte/i)).toBeInTheDocument();
  });

  it("actualiza la vista previa con nombre y monto cuando el usuario completa los campos", () => {
    render(<ContributionForm campaignTitle="Test" />);

    fireEvent.change(screen.getByLabelText(/Monto \(ARS\)/i), {
      target: { value: "500" },
    });
    fireEvent.change(screen.getByLabelText(/Nombre para identificarte/i), {
      target: { value: "Ana López" },
    });

    const previewHeading = screen.getByRole("heading", { name: /Vista previa en la lista/i });
    const previewBlock = previewHeading.closest(".contribution-form__preview-block");
    const list = within(previewBlock).getByRole("list");
    const row = within(list).getByRole("listitem");

    expect(row).toHaveTextContent("Ana López");
    expect(row.textContent).toMatch(/500/);
  });

  it("si se oculta el nombre público, la vista previa muestra iniciales derivadas del nombre", () => {
    render(<ContributionForm campaignTitle="Test" />);

    fireEvent.change(screen.getByLabelText(/Monto \(ARS\)/i), {
      target: { value: "200" },
    });
    fireEvent.change(screen.getByLabelText(/Nombre para identificarte/i), {
      target: { value: "Ana López" },
    });

    const publicName = screen.getByRole("checkbox", {
      name: /Mostrar mi nombre públicamente/i,
    });
    fireEvent.click(publicName);

    const previewHeading = screen.getByRole("heading", { name: /Vista previa en la lista/i });
    const previewBlock = previewHeading.closest(".contribution-form__preview-block");
    const list = within(previewBlock).getByRole("list");
    const row = within(list).getByRole("listitem");

    expect(row).toHaveTextContent("A. L.");
    expect(row).not.toHaveTextContent("Ana López");
  });

  it("muestra error de validación si el monto es menor al mínimo al enviar", () => {
    render(<ContributionForm campaignTitle="Test" />);

    fireEvent.change(screen.getByLabelText(/Monto \(ARS\)/i), {
      target: { value: "50" },
    });
    fireEvent.change(screen.getByLabelText(/Nombre para identificarte/i), {
      target: { value: "Sólo nombre" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Continuar \(simulación\)/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/mínimo/i);
  });
});
