import { api } from '@/api/api';
import {
  VeiculosListResponse,
  BuscarVeiculosParams,
} from '@/types/veiculos';

export const buscarVeiculos = async (
  params: BuscarVeiculosParams
): Promise<VeiculosListResponse> => {
  console.log('🔄 buscarVeiculos iniciado com params:', params);

  const { tipo, filter, page, perPage } = params;
  const queryParams: Record<string, string | number> = {
    type: tipo,
    page: page!,
    perPage: perPage!,
  };
  if (filter) {
    queryParams.filter = filter;
  }

  console.log('➡️ Chamando GET /vehicles/list-with-paginate com', queryParams);

  const { data } = await api.get<VeiculosListResponse>(
    '/vehicles/list-with-paginate',
    { params: queryParams }
  );

  console.log(
    'buscarVeiculos recebeu:',
    JSON.stringify(data, null, 2)
  );

  

  return data;
};
