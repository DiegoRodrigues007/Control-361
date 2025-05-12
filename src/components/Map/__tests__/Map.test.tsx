import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MapaVeiculos } from "../index";
import type { LocationVehicle } from "@/types/veiculos";
import { locationVehicleMock } from "@/__fixtures__/locationVehicle.fixture";
import { useJsApiLoader as mockUseJsApiLoader } from "@react-google-maps/api";

Object.defineProperty(window, "google", {
  writable: true,
  value: {
    maps: {
      Size: class Size {
        constructor(public width: number, public height: number) {}
      },
      Point: class Point {
        constructor(public x: number, public y: number) {}
      },
      LatLng: class LatLng {
        constructor(public lat: number, public lng: number) {}
      },
    },
  },
});

jest.mock("@/assets/icons/cars-blue.png", () => "");
jest.mock("@/assets/icons/cars-red.png", () => "");
jest.mock("@/assets/icons/cars-green.png", () => "");
jest.mock("@/assets/icons/cars-yellow.png", () => "");

jest.mock("@react-google-maps/api", () => ({
  useJsApiLoader: jest.fn(),
  GoogleMap: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="google-map">{children}</div>
  ),
  Marker: ({ onClick }: { onClick?: () => void }) => (
    <div data-testid="marker" onClick={onClick} />
  ),
  InfoBox: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="info-box">{children}</div>
  ),
}));

jest.mock("@/components/InfoWindowContent/InfoWindowContent", () => ({
  InfoWindowContent: () => <div data-testid="info-content">Sample Info</div>,
}));

const mockedLoader = mockUseJsApiLoader as jest.MockedFunction<
  () => { isLoaded: boolean; loadError?: Error | null }
>;

describe("<MapaVeiculos />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("mostra texto de loading enquanto o mapa carrega", () => {
    mockedLoader.mockReturnValue({ isLoaded: false, loadError: null });

    render(<MapaVeiculos positions={[]} />);

    expect(screen.getByText(/Carregando mapa/i)).toBeInTheDocument();
  });

  it("exibe mensagem de erro quando falha ao carregar o mapa", () => {
    mockedLoader.mockReturnValue({
      isLoaded: false,
      loadError: new Error("fail"),
    });

    render(<MapaVeiculos positions={[]} />);

    expect(screen.getByText(/Erro ao carregar o mapa/i)).toBeInTheDocument();
  });

  it("renderiza marcadores e exibe InfoBox ao clicar", async () => {
    mockedLoader.mockReturnValue({ isLoaded: true, loadError: undefined });

    const base: LocationVehicle = {
      ...locationVehicleMock,
      id: "1",
      equipmentId: "eq-1",
      plate: "XYZ-111",
    };
    const positions: LocationVehicle[] = [
      base,
      { ...base, id: "2", equipmentId: "eq-2", plate: "XYZ-222" },
    ];

    render(<MapaVeiculos positions={positions} />);

    const markers = screen.getAllByTestId("marker");
    expect(markers).toHaveLength(2);

    await userEvent.click(markers[0]);

    expect(screen.getByTestId("info-box")).toBeInTheDocument();
    expect(screen.getByTestId("info-content")).toHaveTextContent("Sample Info");
  });
});
