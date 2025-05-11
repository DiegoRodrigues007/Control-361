import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocationVehicles } from "@/hooks/useLocationVehicles";
import { buscarVeiculos } from "@/services/veiculoService";
import type { BuscarVeiculosParams } from "@/types/veiculos";

import { locationVehicleMock } from "@/__fixtures__/locationVehicle.fixture";
import { mockVeiculosListResponse } from "@/__fixtures__/vehicles.fixture";

jest.mock("@/services/veiculoService");
const mockedBuscarVeiculos = buscarVeiculos as jest.MockedFunction<
  typeof buscarVeiculos
>;

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

const fakeParams: BuscarVeiculosParams = {
  tipo: "tracked",
  filter: "abc",
  page: 1,
  perPage: 10,
};

describe("useLocationVehicles", () => {
  beforeEach(() => jest.clearAllMocks());

  it("deve retornar os dados quando buscarVeiculos resolver", async () => {
    mockedBuscarVeiculos.mockResolvedValueOnce(
      mockVeiculosListResponse([locationVehicleMock], fakeParams)
    );

    const { result } = renderHook(() => useLocationVehicles(fakeParams), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([locationVehicleMock]);
    expect(result.current.error).toBeNull();
  });

  it("deve sinalizar erro quando buscarVeiculos rejeitar", async () => {
    const fakeError = new Error("network down");
    mockedBuscarVeiculos.mockRejectedValueOnce(fakeError);

    const { result } = renderHook(() => useLocationVehicles(fakeParams), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(fakeError);
    expect(result.current.data).toBeUndefined();
  });
});
