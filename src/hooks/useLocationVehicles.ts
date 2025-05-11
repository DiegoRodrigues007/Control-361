import { useQuery } from "@tanstack/react-query";
import { buscarVeiculos } from "@/services/veiculoService";
import type { LocationVehicle, BuscarVeiculosParams } from "@/types/veiculos";

export function useLocationVehicles(params: BuscarVeiculosParams) {
  return useQuery<LocationVehicle[], Error>({
    queryKey: ["locations", params],
    queryFn: async () => {
      const res = await buscarVeiculos(params);
      return res.content.locationVehicles;
    },
  });
}
