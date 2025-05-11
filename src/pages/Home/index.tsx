import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ControlVehicle } from "@/components/ControlVehicle";
import { MapaVeiculos } from "@/components/Map";
import { TabelaVeiculos } from "@/components/Table";
import { useMapaPoll, useVeiculosInfinite } from "@/hooks/useVeiculos";
import type {
  LocationVehicle,
  BuscarVeiculosParams,
  TipoFiltro,
} from "@/types/veiculos";

export const Home: React.FC = () => {
  const [filtro, setFiltro] = useState<TipoFiltro>("rastreado");
  const [busca, setBusca] = useState("");

  const queryParams: Omit<BuscarVeiculosParams, "page" | "perPage"> = {
    tipo: filtro === "rastreado" ? "tracked" : "others",
    filter: busca || undefined,
  };

  const {
    data: locations = [],
    isLoading: mapLoading,
    error: mapError,
  } = useMapaPoll(queryParams);

  const {
    data: tableData,
    fetchNextPage,
    hasNextPage,
    isLoading: tableLoading,
    error: tableError,
  } = useVeiculosInfinite(queryParams);

  const allVehicles = tableData
    ? tableData.pages.flatMap((p) => p.content.vehicles)
    : [];

  return (
    <main className="bg-[#000f17] min-h-screen text-white">
      <ControlVehicle
        filtro={filtro}
        aoMudarFiltro={setFiltro}
        busca={busca}
        aoBuscar={setBusca}
        aoCriarNovo={() => alert("Criar novo veículo")}
      />

      <section
        className="max-w-[1920px] mx-auto px-6 sm:px-8 lg:px-12 mt-6"
        aria-labelledby="titulo-mapa"
      >
        <div className="bg-[#001622] rounded-xl border border-[#002d44] overflow-hidden">
          <header
            id="titulo-mapa"
            className="px-6 py-4 border-b border-[#002d44]"
          >
            <h2 className="text-gray-200 font-medium">Mapa rastreador</h2>
          </header>
          <div className="p-6">
            <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[650px] rounded-lg overflow-hidden">
              {mapLoading && (
                <p className="text-gray-200 text-center py-6">
                  Carregando mapa...
                </p>
              )}
              {mapError && (
                <p className="text-red-500 text-center py-6">
                  Erro ao carregar o mapa
                </p>
              )}
              {!mapLoading && !mapError && (
                <MapaVeiculos positions={locations as LocationVehicle[]} />
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        className="max-w-[1920px] mx-auto px-6 sm:px-8 lg:px-12 mt-8"
        aria-labelledby="titulo-tabela"
      >
        <header id="titulo-tabela" className="sr-only">
          Lista de veículos
        </header>

        {tableLoading && (
          <p className="text-gray-200 text-center py-6">Carregando tabela...</p>
        )}
        {tableError && (
          <p className="text-red-500 text-center py-6">
            Erro ao carregar tabela
          </p>
        )}

        {!tableLoading && !tableError && (
          <InfiniteScroll
            dataLength={allVehicles.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={
              <p className="text-center py-4 text-gray-200">
                Carregando mais...
              </p>
            }
            endMessage={null} 
          >
            <div className="overflow-x-auto">
              <TabelaVeiculos
                dados={allVehicles.map((v) => ({
                  placa: v.plate,
                  frota: v.fleet ?? "",
                  tipo: v.type,
                  modelo: v.model,
                  status:
                    filtro === "rastreado"
                      ? locations.find((l) => l.plate === v.plate)?.ignition ??
                        v.status
                      : v.status,
                }))}
              />
            </div>
          </InfiniteScroll>
        )}
      </section>
    </main>
  );
};
