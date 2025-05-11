import React from "react";
import type { LocationVehicle } from "@/types/veiculos";

export interface InfoWindowContentProps {
  position: LocationVehicle;
  onClose: () => void;
}

export const InfoWindowContent: React.FC<InfoWindowContentProps> = ({
  position,
  onClose,
}) => {
  const date = new Date(position.createdAt);

  return (
    <aside className="relative bg-[#001622] text-white rounded-xl p-4 w-72 shadow-lg">
      <button
        onClick={onClose}
        aria-label="Fechar informações do veículo"
        className="absolute top-3 right-3 text-blue-400 hover:text-blue-300 focus:outline-none text-2xl leading-none"
      >
        ×
      </button>
      <header className="mb-2 text-center">
        <h3 className="font-semibold text-base">Placa {position.plate}</h3>
      </header>
      <dl className="space-y-1 text-sm">
        <div>
          <dt className="sr-only">Frota</dt>
          <dd>Frota {position.fleet}</dd>
        </div>
        <div>
          <dt className="sr-only">Data e hora</dt>
          <dd>
            {date.toLocaleDateString()} – {date.toLocaleTimeString()}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Coordenadas</dt>
          <dd>
            {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
          </dd>
        </div>
      </dl>
      <footer className="border-t border-gray-500 mt-3 pt-2 text-center text-xs text-gray-400">
        Atualizado em {date.toLocaleTimeString()}
      </footer>
    </aside>
  );
};
