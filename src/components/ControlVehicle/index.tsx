import React from "react";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import type { TipoFiltro } from "@/types/veiculos";

interface ControlVehicleProps {
  filtro: TipoFiltro;
  aoMudarFiltro: (novo: TipoFiltro) => void;
  busca: string;
  aoBuscar: (texto: string) => void;
  aoCriarNovo: () => void;
}

export const ControlVehicle: React.FC<ControlVehicleProps> = ({
  filtro,
  aoMudarFiltro,
  busca,
  aoBuscar,
  aoCriarNovo,
}) => (
  <header className="bg-[#000f17]" aria-label="Controles de veículos">
    <div className="max-w-[1800px] mx-auto flex flex-wrap items-center justify-between px-4 sm:px-0 py-4 border-b border-[#002d44]">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <span className="font-medium text-gray-200 whitespace-nowrap mr-4 md:mr-48">Lista
          Lista
        </span>
        {(["rastreado", "outros"] as TipoFiltro[]).map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 text-gray-200 mr-4 md:mr-6"
          >
            <input
              type="radio"
              name="filtro"
              value={option}
              checked={filtro === option}
              onChange={() => aoMudarFiltro(option)}
              className="w-5 h-5 rounded-full bg-black border-[#0095e4] checked:bg-black checked:border-[#0095e4] focus:outline-none"
            />
            <span className="text-sm capitalize">{option}</span>
          </label>
        ))}
      </div>

      <form
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          aoBuscar(busca);
        }}
      >
        <SearchInput
          placeholder="Buscar por placa ou frota"
          aria-label="Buscar por placa ou frota"
          value={busca}
          onChange={(e) => aoBuscar(e.currentTarget.value)}
          className="flex-1 w-full sm:w-auto"
        />
        <Button
          onClick={aoCriarNovo}
          className="w-full sm:w-36 flex-shrink-0 justify-center"
        >
          Novo
        </Button>
      </form>
    </div>
  </header>
);
