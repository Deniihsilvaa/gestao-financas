import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { RegistroProps } from "./types"; // Supondo que RegistroProps esteja no arquivo types.ts
import TableCaixaBancos from "./components/table";
function CaixaBancos() {
  const [registros, setRegistros] = useState<RegistroProps[]>([]);
  const [totalEntrada, setTotalEntrada] = useState<number>(0);
  const [totalSaida, setTotalSaida] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [totalConta, setTotalConta] = useState<number>(0);

  const fetchRegistros = async (): Promise<void> => {
    try { 
      const { data, error } = await supabase
      .from('base_caixa')
      .select(`
        id,
        descricao,
        valor,
        tipo_registro,
        data_transacao,
        tipo_categoria (
          categoria
        ),
        conta_bancaria (
          banco
        ),
        data_vencimento,
        observacao
      `)
      .eq('tipo_categoria', 'tipo_categoria_id') // Assegure-se que isso tenha a coluna correta de relacionamento
      .order('data_registro', { ascending: false });

    if (error) {
      console.log("Erro de busca", error.message);
    } else {
      console.log(data);
      setRegistros(data || []);
    }
    } catch (error) { 
      console.log(error);
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
      return totalEntrada;
    } );
    setTotalEntrada(totalEntrada);
  };
  const conta = (): void => {
    let totalConta = registros.length;
    setTotalConta(totalConta);
  };
  const saldoSaida = (): void => {
    let totalSaida = 0;
    registros.map((registro) => {
      if (registro.tipo_registro === "Saída") {
        totalSaida += Number(registro.valor);
      }
      return totalSaida;
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
    conta();
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
          <TableCaixaBancos registros={registros} />
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
