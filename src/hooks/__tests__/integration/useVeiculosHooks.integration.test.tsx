import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMapaPoll, useVeiculosInfinite } from "@/hooks/useVeiculos";
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

const fetchParams: Omit<FetchVehiclesParams, "page" | "perPage"> = {
  tipo: "tracked",
};

const hasEnv = Boolean(
  process.env.VITE_APP_BASE_URL && process.env.VITE_APP_API_TOKEN
);
const describeIfEnv = hasEnv ? describe : describe.skip;

describeIfEnv("useMapaPoll (integration)", () => {
  it("busca dados reais de localização de veículos", async () => {
    const { result } = renderHook(() => useMapaPoll(fetchParams), {
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

describeIfEnv("useVeiculosInfinite (integration)", () => {
  it("faz paginação real de veículos", async () => {
    const { result } = renderHook(() => useVeiculosInfinite(fetchParams), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 20_000,
    });

    const pages = result.current.data!.pages;
    expect(pages.length).toBeGreaterThanOrEqual(1);

    expect(pages[0].content.locationVehicles.length).toBeGreaterThan(0);
    expect(result.current.hasNextPage).toBe(
      pages[0].content.page < pages[0].content.totalPages
    );

    if (result.current.hasNextPage) {
      result.current.fetchNextPage();
      await waitFor(
        () => expect(result.current.data!.pages.length).toBeGreaterThan(1),
        { timeout: 20_000 }
      );
    }
  }, 35_000);
});
