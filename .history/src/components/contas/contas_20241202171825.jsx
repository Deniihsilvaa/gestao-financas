import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

function Contas() {
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  }

  function conncetTable(){
    
  }
  return (
    <div className="flex h-screen">
      {/* Conteúdo principal */}
      <main className="flex-1 p-6 bg-gray-100">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center space-x-4">
            <li>
              <button className="text-sm font-medium text-gray-900"
              onClick={() => handleNavigation("/home")}
              >
                Home
              </button>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li>
              <button className="text-sm font-medium text-gray-900"
              onClick={() => handleNavigation("/contas")}
              >
                Contas
              </button>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li>
              <span className="text-sm font-medium text-gray-500">
                Contas a Pagar
              </span>
            </li>
          </ol>
        </nav>

        {/* Barra de filtros */}
        <div className="flex items-center justify-between p-4 mb-6 bg-white rounded shadow">
          <input
            type="text"
            placeholder="Pesquisar por nome ou categoria..."
            className="w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Filtrar
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left border border-gray-300">
                  Nome
                </th>
                <th className="px-4 py-2 text-left border border-gray-300">
                  Categoria
                </th>
                <th className="px-4 py-2 text-left border border-gray-300">
                  Valor
                </th>
                <th className="px-4 py-2 text-left border border-gray-300">
                  Vencimento
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border border-gray-300">Conta 1</td>
                <td className="px-4 py-2 border border-gray-300">Energia</td>
                <td className="px-4 py-2 border border-gray-300">R$ 200,00</td>
                <td className="px-4 py-2 border border-gray-300">20/11/2024</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 border border-gray-300">Conta 2</td>
                <td className="px-4 py-2 border border-gray-300">Água</td>
                <td className="px-4 py-2 border border-gray-300">R$ 150,00</td>
                <td className="px-4 py-2 border border-gray-300">22/11/2024</td>
              </tr>
              {/* Adicione mais linhas conforme necessário */}
            </tbody>
          </table>
        </div>

      </main>
      {/* Barra escura no lado direito */}
      <aside className="w-1/4 p-4 text-white bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold">Resumo</h2>
        <p>Dados importantes:</p>
        <ul className="mt-2 ml-4 space-y-2 list-disc">
          <li>Total de contas: 10</li>
          <li>Valor total: R$ 5000,00</li>
          <li>Próximas a vencer: 3</li>
        </ul>
      </aside>
    </div>
  );
}

export default Contas;
