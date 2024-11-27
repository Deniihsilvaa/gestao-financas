import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { RegistroProps } from "./types";  // Supondo que RegistroProps esteja no arquivo types.ts

function CaixaBancos() {

  const [registros, setRegistros] = useState<RegistroProps[]>([]);
  const [totalEntrada, setTotalEntrada] = useState<number>(0);
  const [totalSaida, setTotalSaida] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [totalConta, setTotalConta] = useState<number>(0);


  const fetchRegistros = async (): Promise<void> => {
    const { data, error } = await supabase
    .from("base_caixa")
    .select("*")
    .order("data_transacao", { ascending: true });
  

    if (error) {
      console.log("Erro de busca", error.message);
    } else {
      setRegistros(data || []);
    }
  };

  useEffect(() => {
    fetchRegistros();
  }, []);

  // Funções para calcular entradas, saídas e saldo total
  const saldoEntrada = (): void => {
    let totalEntrada = 0;
    registros.map((registro) => {
      if (registro.tipo_registro === "Entrada") {
        totalEntrada += Number(registro.valor);
      }
    });
    setTotalEntrada(totalEntrada);
  };
  const conta = (): void => {
    let totalConta = registros.length;
    setTotalConta(totalConta);
}
  const saldoSaida = (): void => {
    let totalSaida = 0;
    registros.map((registro) => {
      if (registro.tipo_registro === "Saída") {
        totalSaida += Number(registro.valor);
      }
    });
    setTotalSaida(totalSaida);
  };

  const saldoTotal = (): void => {
    setSaldo(totalEntrada - totalSaida);
  };

  useEffect(() => {
    saldoEntrada();
    saldoSaida();
    saldoTotal();
  }, [registros]);
  return (
    <div className="flex h-screen">
      <main className="flex-1 bg-gray-100 p-6">

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
                <th className="px-4 py-2 border border-gray-300 text-left">Nome</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Categoria</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Valor</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Vencimento</th>
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
            </tbody>
          </table>
        </div>
      </main>

      {/* Barra escura no lado direito */}
      <aside className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-semibold mb-4">Resumo</h2>
        <p>Dados importantes:</p>
        <ul className="list-disc ml-4 mt-2 space-y-2">
          <li>Total de contas: {totalConta}</li>
          <li>Total Entrada: R$ {totalEntrada}</li>
          <li>Total Saída: R$ {totalSaida}</li>
          <li>Saldo Total: R$ {saldo}</li>
        </ul>
      </aside>
    </div>
  );
}

export default CaixaBancos;
