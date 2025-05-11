import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InfoWindowContent } from "../InfoWindowContent";
import { locationVehicleMock } from "@/__fixtures__/locationVehicle.fixture";

describe("<InfoWindowContent />", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <InfoWindowContent position={locationVehicleMock} onClose={onClose} />
    );
  });

  it("deve exibir todos os campos corretamente", () => {
    expect(
      screen.getByText(new RegExp(`Placa ${locationVehicleMock.plate}`, "i"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`Frota ${locationVehicleMock.fleet}`, "i"))
    ).toBeInTheDocument();

    const date = new Date(locationVehicleMock.createdAt);
    const datePattern = date.toLocaleDateString().replace(/\//g, "\\/");
    const timePattern = date.toLocaleTimeString().slice(0, 5);
    const dateEls = screen.getAllByText(new RegExp(datePattern));
    expect(dateEls.length).toBeGreaterThanOrEqual(1);
    const timeEls = screen.getAllByText(new RegExp(timePattern));
    expect(timeEls.length).toBeGreaterThanOrEqual(1);

    const coords = `${locationVehicleMock.lat.toFixed(
      6
    )}, ${locationVehicleMock.lng.toFixed(6)}`;
    expect(screen.getByText(coords)).toBeInTheDocument();
  });

  it("deve chamar o onClose ao clicar no botão de fechar", async () => {
    const btn = screen.getByLabelText(/Fechar informações do veículo/i);
    await userEvent.click(btn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
