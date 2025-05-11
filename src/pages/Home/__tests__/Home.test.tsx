import { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "@/pages/Home";

jest.mock("@react-google-maps/api", () => ({
  useJsApiLoader: () => ({ isLoaded: true, loadError: null }),
  GoogleMap: ({ children }: { children?: ReactNode }) => (
    <div data-testid="google-map">{children}</div>
  ),
  Marker: ({ position }: { position: { lat: number; lng: number } }) => (
    <div data-testid="marker">
      {position.lat},{position.lng}
    </div>
  ),
  InfoBox: ({ children }: { children?: ReactNode }) => (
    <div data-testid="info-box">{children}</div>
  ),
}));

jest.mock("@/assets/icons/cars-blue.png", () => "");
jest.mock("@/assets/icons/cars-red.png", () => "");
jest.mock("@/assets/icons/cars-green.png", () => "");
jest.mock("@/assets/icons/cars-yellow.png", () => "");

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

const hasEnv =
  Boolean(process.env.VITE_APP_BASE_URL) &&
  Boolean(process.env.VITE_APP_API_TOKEN);
const describeIfEnv = hasEnv ? describe : describe.skip;

const createWrapper = ({ children }: { children?: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describeIfEnv("Home page integration", () => {
  it("deve buscar dados e renderizar mapa e tabela reais", async () => {
    render(<Home />, { wrapper: createWrapper });

    expect(screen.getByText(/Carregando mapa/i)).toBeInTheDocument();
    expect(screen.getByText(/Carregando tabela/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText(/Carregando mapa/i)).toBeNull();
        expect(screen.queryByText(/Carregando tabela/i)).toBeNull();
      },
      { timeout: 20000 }
    );

    expect(screen.getByTestId("google-map")).toBeInTheDocument();
    expect(screen.getAllByTestId("marker").length).toBeGreaterThan(0);

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1);
  }, 30000);
});
