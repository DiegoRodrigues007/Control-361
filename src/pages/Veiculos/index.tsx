import React, { useEffect, useState } from "react";
import { buscarVeiculos } from "@/services/veiculoService";
import type {
  Veiculo as ApiVeiculo,
  BuscarVeiculosParams,
  TipoFiltro,
} from "@/types/veiculos";
import { ControlVehicle } from "@/components/ControlVehicle";
import { TabelaVeiculos } from "@/components/Table";

export const VeiculosPage: React.FC = () => {
  const [filtro, setFiltro] = useState<TipoFiltro>("rastreado");
  const [busca, setBusca] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 20;

  const [veiculos, setVeiculos] = useState<ApiVeiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVeiculos = async () => {
    setLoading(true);
    setError(null);

    const apiType = filtro === "rastreado" ? "tracked" : "others";

    const params: BuscarVeiculosParams = {
      tipo: apiType,
      filter: busca || undefined,
      page,
      perPage,
    };

    try {
      const response = await buscarVeiculos(params);
      setVeiculos(response.content.vehicles);
    } catch (err) {
      console.error("Erro ao buscar veículos:", err);
      setError("Não foi possível carregar a lista de veículos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVeiculos();
  }, [filtro, busca, page]);

  return (
    <section className="min-h-screen bg-gray-900">
      <ControlVehicle
        filtro={filtro}
        aoMudarFiltro={(novo) => {
          setFiltro(novo);
          setPage(1);
        }}
        busca={busca}
        aoBuscar={(texto) => {
          setBusca(texto);
          setPage(1);
        }}
        aoCriarNovo={() => console.log("Criar novo veículo")}
      />

      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
        {loading && <p className="text-gray-200">Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <TabelaVeiculos
            dados={veiculos.map((v) => ({
              placa: v.plate,
              frota: v.fleet ?? "",
              tipo: v.type,
              modelo: v.model,
              status: v.status,
            }))}
          />
        )}
      </div>
    </section>
  );
};
