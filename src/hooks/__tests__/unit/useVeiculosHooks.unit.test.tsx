import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMapaPoll, useVeiculosInfinite } from "@/hooks/useVeiculos";
import { buscarVeiculos } from "@/services/veiculoService";
import type {
  BuscarVeiculosParams as FetchVehiclesParams,
  LocationVehicle,
  VeiculosListResponse,
} from "@/types/veiculos";

import { locationVehicleMock } from "@/__fixtures__/locationVehicle.fixture";
import { mockVeiculosListResponse } from "@/__fixtures__/vehicles.fixture";

jest.mock("@/services/veiculoService");
const mockedFetchVehicles = buscarVeiculos as jest.MockedFunction<
  typeof buscarVeiculos
>;

const createQueryClientWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const QueryClientWrapper: React.FC<React.PropsWithChildren<unknown>> = ({
    children,
  }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return QueryClientWrapper;
};

const baseFetchParams: Omit<FetchVehiclesParams, "page" | "perPage"> = {
  tipo: "tracked",
  filter: "teste",
};

describe("useMapaPoll", () => {
  it("deve buscar e retornar veículos de localização corretamente", async () => {
    const vehiclesArray: LocationVehicle[] = [locationVehicleMock];
    const page1Response: VeiculosListResponse = mockVeiculosListResponse(
      vehiclesArray,
      { ...baseFetchParams, page: 1, perPage: 1000 }
    );
    mockedFetchVehicles.mockResolvedValueOnce(page1Response);

    const { result } = renderHook(() => useMapaPoll(baseFetchParams), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(vehiclesArray);
    expect(mockedFetchVehicles).toHaveBeenCalledWith({
      ...baseFetchParams,
      page: 1,
      perPage: 1000,
    });
  });
});

describe("useVeiculosInfinite", () => {
  it("deve suportar paginação infinita com fetchNextPage se existir próxima página", async () => {
    const vehiclesPage1: LocationVehicle[] = [locationVehicleMock];
    const vehiclesPage2: LocationVehicle[] = [
      { ...locationVehicleMock, id: "2" },
    ];

    const response1 = mockVeiculosListResponse(vehiclesPage1, {
      ...baseFetchParams,
      page: 1,
      perPage: 20,
    });
    const response2 = mockVeiculosListResponse(vehiclesPage2, {
      ...baseFetchParams,
      page: 2,
      perPage: 20,
    });

    mockedFetchVehicles
      .mockResolvedValueOnce(response1)
      .mockResolvedValueOnce(response2);

    const { result } = renderHook(() => useVeiculosInfinite(baseFetchParams), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.pages[0]).toEqual(response1);

    if (result.current.hasNextPage) {
      act(() => {
        result.current.fetchNextPage();
      });
      await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
      expect(result.current.data?.pages[1]).toEqual(response2);
      expect(mockedFetchVehicles).toHaveBeenCalledWith({
        ...baseFetchParams,
        page: 2,
        perPage: 20,
      });
    }

    expect(result.current.hasNextPage).toBe(false);
  });
});
