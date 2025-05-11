export interface Veiculo {
  id: string;
  plate: string;
  fleet: string | null;
  type: string;
  model: string;
  nameOwner: string;
  status: string;
  createdAt: string;
}

export interface LocationVehicle {
  id: string;
  fleet: string;
  equipmentId: string;
  name: string;
  plate: string;
  ignition: string;
  lat: number;
  lng: number;
  createdAt: string;
}

export interface BuscarVeiculosParams {
  tipo: "tracked" | "others";
  filter?: string;
  page?: number;
  perPage?: number;
}

export interface VeiculosListResponse {
  statusCode: number;
  message: string;
  content: {
    vehicles: Veiculo[];
    locationVehicles: LocationVehicle[];
    totalPages: number;
    page: number;
    perPage: number;
  };
}

export type TipoFiltro = "rastreado" | "outros";

export interface VeiculoTable {
  placa: string;
  frota: string;
  tipo: string;
  modelo: string;
  status: string;
}
