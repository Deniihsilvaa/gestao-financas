import React from "react";

function ContasApagar() {
  return (
    <div className="flex h-screen">
      {/* Conteúdo principal */}
      <main className="flex-1 bg-gray-100 p-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center space-x-4">
            <li>
              <a href="/" className="text-sm font-medium text-gray-900">
                Home
              </a>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li>
              <a href="/contas" className="text-sm font-medium text-gray-900">
                Contas
              </a>
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
        <div className="flex items-center justify-between bg-white p-4 rounded shadow mb-6">
          <input
            type="text"
            placeholder="Pesquisar por nome ou categoria..."
            className="border border-gray-300 rounded px-4 py-2 w-1/2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Filtrar
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border border-gray-300 text-left">
                  Nome
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left">
                  Categoria
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left">
                  Valor
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left">
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
      <aside className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-semibold mb-4">Resumo</h2>
        <p>Dados importantes:</p>
        <ul className="list-disc ml-4 mt-2 space-y-2">
          <li>Total de contas: 10</li>
          <li>Valor total: R$ 5000,00</li>
          <li>Próximas a vencer: 3</li>
        </ul>
      </aside>
    </div>
  );
}

export default ContasApagar;
