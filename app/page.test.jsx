import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renderiza el título principal del hero", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /microfinanciación que se ve en el barrio/i }),
    ).toBeInTheDocument();
  });

  it("muestra enlace al listado de campañas", () => {
    render(<Home />);
    const links = screen.getAllByRole("link", { name: /ver campañas/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute("href", "/campanas");
  });
});
