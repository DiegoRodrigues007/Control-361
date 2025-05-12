import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { buscarVeiculos } from "@/services/veiculoService";
import type {
  BuscarVeiculosParams,
  LocationVehicle,
  VeiculosListResponse,
} from "@/types/veiculos";

export function useMapaPoll(
  params: Omit<BuscarVeiculosParams, "page" | "perPage">
) {
  return useQuery<LocationVehicle[], Error>({
    queryKey: ["locations", params],
    queryFn: async () => {
      const res = await buscarVeiculos({ ...params, page: 1, perPage: 1000 });
      return res.content.locationVehicles ?? [];
    },

    staleTime: 0,

    refetchInterval: 120_000,

    refetchOnMount: true,

    retry: false,
  });
}

export function useVeiculosInfinite(
  params: Omit<BuscarVeiculosParams, "page" | "perPage">
) {
  return useInfiniteQuery<VeiculosListResponse, Error>({
    queryKey: ["vehicles", params] as const,
    queryFn: async ({ pageParam }: { pageParam?: unknown }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      return buscarVeiculos({ ...params, page, perPage: 20 });
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.content;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    retry: false,
  });
}
