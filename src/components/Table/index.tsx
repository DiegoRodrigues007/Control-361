import { VeiculoTable } from "@/types/veiculos";
import React from "react";

interface PropriedadesTabela {
  dados: VeiculoTable[];
}

export const TabelaVeiculos: React.FC<PropriedadesTabela> = ({ dados }) => (
  <section className="py-4 sm:py-8" aria-labelledby="titulo-tabela-veiculos">
    <div className="w-full">
      <div className="overflow-x-auto shadow-md border border-[#002d44] rounded-3xl">
        <div className="overflow-hidden rounded-t-3xl">
          <table className="w-full table-fixed border-collapse bg-[#001622] text-gray-100">
            <caption id="titulo-tabela-veiculos" className="sr-only">
              Lista de veículos com placa, frota, tipo, modelo e status
            </caption>
            <thead>
              <tr className="bg-[#001622] border-b border-[#002d44] text-center">
                {["Placa", "Frota", "Tipo", "Modelo", "Status"].map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="px-2 sm:px-6 py-4 text-sm sm:text-base font-semibold border-r border-[#002d44]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dados.map((v, i) => (
                <tr
                  key={`${v.placa}-${i}`}
                  className="odd:bg-[#001622] even:bg-[#001622] hover:bg-[#002d44] border-b border-[#002d44] transition-colors duration-200"
                >
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap border-r border-[#002d44] text-center text-sm sm:text-base text-[#C8C8C8]">
                    {v.placa}
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap border-r border-[#002d44] text-center text-sm sm:text-base text-[#C8C8C8]">
                    {v.frota}
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap border-r border-[#002d44] text-center text-sm sm:text-base text-[#C8C8C8]">
                    {v.tipo}
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap border-r border-[#002d44] text-center text-sm sm:text-base text-[#C8C8C8]">
                    {v.modelo}
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-center text-sm sm:text-base text-[#C8C8C8]">
                    {v.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
);
