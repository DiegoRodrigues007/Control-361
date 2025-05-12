import { render, screen } from "@testing-library/react";
import { TabelaVeiculos } from "../index";
import { vehiclesMock } from "@/__fixtures__/vehicles.fixture";

describe("<TabelaVeiculos />", () => {
  it("deve renderizar os cabeçalhos de coluna", () => {
    render(<TabelaVeiculos dados={vehiclesMock} />);
    ["Placa", "Frota", "Tipo", "Modelo", "Status"].forEach((header) => {
      expect(
        screen.getByRole("columnheader", { name: new RegExp(header, "i") })
      ).toBeInTheDocument();
    });
  });

  it("deve renderizar uma linha por veículo mais o header", () => {
    render(<TabelaVeiculos dados={vehiclesMock} />);
    expect(screen.getAllByRole("row")).toHaveLength(1 + vehiclesMock.length);
  });

  it("deve exibir corretamente os dados de cada veículo", () => {
    render(<TabelaVeiculos dados={vehiclesMock} />);
    vehiclesMock.forEach(({ placa, frota, status }) => {
      expect(screen.getByText(placa)).toBeInTheDocument();
      expect(screen.getByText(frota)).toBeInTheDocument();
      expect(screen.getByText(status)).toBeInTheDocument();
    });
  });
});
