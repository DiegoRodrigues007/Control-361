import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocationVehicles } from "@/hooks/useLocationVehicles";
import type {
  BuscarVeiculosParams as FetchVehiclesParams,
  LocationVehicle,
} from "@/types/veiculos";

const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const QueryWrapper: React.FC<React.PropsWithChildren<unknown>> = ({
    children,
  }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return QueryWrapper;
};

const fetchParams: FetchVehiclesParams = {
  tipo: "tracked",
  page: 1,
  perPage: 20,
};

const hasEnv = Boolean(
  process.env.VITE_APP_BASE_URL && process.env.VITE_APP_API_TOKEN
);
const describeIfEnv = hasEnv ? describe : describe.skip;

describeIfEnv("useLocationVehicles (integration)", () => {
  it("retorna um array de LocationVehicle reais da API", async () => {
    const { result } = renderHook(() => useLocationVehicles(fetchParams), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 20_000,
    });

    const vehicles = result.current.data!;
    expect(Array.isArray(vehicles)).toBe(true);
    expect(vehicles.length).toBeGreaterThan(0);

    expect(vehicles[0]).toMatchObject({
      id: expect.any(String),
      lat: expect.any(Number),
      lng: expect.any(Number),
    } as Partial<LocationVehicle>);
  }, 25_000);
});
