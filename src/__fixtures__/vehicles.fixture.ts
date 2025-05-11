import type { BuscarVeiculosParams, VeiculosListResponse,LocationVehicle,VeiculoTable } from '@/types/veiculos'
export const vehiclesMock: VeiculoTable[] = [
  {
    placa: "AAA-0001",
    frota: "100",
    tipo: "Motor",
    modelo: "FH 460",
    status: "Em viagem",
  },
  {
    placa: "AAA-0002",
    frota: "101",
    tipo: "Motor",
    modelo: "FH 460",
    status: "Em manutenção",
  },
];

export const mockVeiculosListResponse = (
  vehicles: LocationVehicle[],
  params: BuscarVeiculosParams
): VeiculosListResponse => ({
  statusCode: 200,
  message: 'Sucesso',
  content: {
    vehicles: [], 
    locationVehicles: vehicles,
    totalPages: 1,
    page: params.page ?? 1,
    perPage: params.perPage ?? vehicles.length,
  },
})