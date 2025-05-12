import { api } from "@/api/api";
import { VeiculosListResponse, BuscarVeiculosParams } from "@/types/veiculos";

export const buscarVeiculos = async (
  params: BuscarVeiculosParams
): Promise<VeiculosListResponse> => {
  const { tipo, filter, page, perPage } = params;
  const queryParams: Record<string, string | number> = {
    type: tipo,
    page: page!,
    perPage: perPage!,
  };
  if (filter) {
    queryParams.filter = filter;
  }

  const { data } = await api.get<VeiculosListResponse>(
    "/vehicles/list-with-paginate",
    { params: queryParams }
  );

  return data;
};
