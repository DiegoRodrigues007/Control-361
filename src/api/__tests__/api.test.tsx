import { api } from "../api";
import type { VeiculosListResponse, Veiculo } from "@/types/veiculos";

describe("API client integration", () => {
  const params = { type: "tracked", page: 1, perPage: 10 };

  it("deve buscar lista real de veículos via api.get", async () => {
    const response = await api.get<VeiculosListResponse>(
      "/vehicles/list-with-paginate",
      { params }
    );

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data.content.vehicles)).toBe(true);
    expect(response.data.content.vehicles.length).toBeGreaterThan(0);
  }, 20_000);

  it("deve verificar campos de um veículo da listagem", async () => {
    const listResp = await api.get<VeiculosListResponse>(
      "/vehicles/list-with-paginate",
      { params }
    );
    const vehicle = listResp.data.content.vehicles[0] as Veiculo;

    expect(vehicle.id).toBeDefined();
    expect(typeof vehicle.plate).toBe("string");
    expect(typeof vehicle.model).toBe("string");
    expect(typeof vehicle.fleet === "string" || vehicle.fleet === null).toBe(
      true
    );
    expect(typeof vehicle.nameOwner).toBe("string");
    expect(typeof vehicle.status).toBe("string");
  }, 20_000);
});
