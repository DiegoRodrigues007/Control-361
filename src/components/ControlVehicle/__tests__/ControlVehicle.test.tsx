import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ControlVehicle as VehicleControls } from "../index";

describe("<VehicleControls />", () => {
  const onFilterChange = jest.fn();
  const onSearchInput = jest.fn();
  const onCreateNew = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <VehicleControls
        filtro="rastreado"
        aoMudarFiltro={onFilterChange}
        busca=""
        aoBuscar={onSearchInput}
        aoCriarNovo={onCreateNew}
      />
    );
  });

  it("alterna filtro ao clicar nos rádios", async () => {
    const trackedRadio = screen.getByRole("radio", { name: /rastreado/i });
    const othersRadio = screen.getByRole("radio", { name: /outros/i });

    expect(trackedRadio).toBeChecked();
    expect(othersRadio).not.toBeChecked();

    await userEvent.click(othersRadio);

    expect(onFilterChange).toHaveBeenCalledTimes(1);
    expect(onFilterChange).toHaveBeenCalledWith("outros");
  });

  it("chama onSearchInput para cada caractere digitado", async () => {
    const searchBox = screen.getByRole("searchbox", {
      name: /buscar por placa ou frota/i,
    });
    const inputText = "ABC123";

    await userEvent.type(searchBox, inputText);

    expect(onSearchInput).toHaveBeenCalledTimes(inputText.length);
    const typedCharacters = onSearchInput.mock.calls.map((call) => call[0]);
    expect(typedCharacters).toEqual(inputText.split(""));
  });

  it("chama onCreateNew ao clicar no botão Novo", async () => {
    const newButton = screen.getByRole("button", { name: /^novo$/i });

    await userEvent.click(newButton);

    expect(onCreateNew).toHaveBeenCalledTimes(1);
  });
});
