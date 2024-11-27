import React, { useState, useEffect, useCallback } from "react";
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
          situacao,
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
        .order('data_registro', { ascending: false });
  
      if (error) {
        console.log("Erro de busca", error.message);
      } else {
        // Transformar os dados
        const registrosFormatados = (data as RegistroProps[])?.map((registro) => ({
          ...registro,
          tipo_categoria: registro.tipo_categoria?.categoria || "N/A", // Acessa a propriedade 'registro' de tipo_categoria
          conta_bancaria: registro.conta_bancaria?.banco || "N/A", 
        }));
        
        console.log(' Dados Formatados',registrosFormatados);
        setRegistros(registrosFormatados || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Funções para calcular entradas, saídas e saldo total, usando useCallback
  const saldoEntrada = useCallback((): void => {
    let totalEntrada = 0;
    registros.map((registro) => {
      if (registro.tipo_registro === "Entrada") {
        totalEntrada += Number(registro.valor);
      }
      return totalEntrada;
    });
    setTotalEntrada(totalEntrada);
  }, [registros]); // Dependência de registros

  const conta = useCallback((): void => {
    let totalConta = registros.length;
    setTotalConta(totalConta);
  }, [registros]); // Dependência de registros

  const saldoSaida = useCallback((): void => {
    let totalSaida = 0;
    registros.map((registro) => {
      if (registro.tipo_registro === "Saída") {
        totalSaida += Number(registro.valor);
      }
      return totalSaida;
    });
    setTotalSaida(totalSaida);
  }, [registros]); // Dependência de registros

  const saldoTotal = useCallback((): void => {
    setSaldo(totalEntrada - totalSaida);
  }, [totalEntrada, totalSaida]); // Dependências de totalEntrada e totalSaida

  // Chama as funções dentro do useEffect
  useEffect(() => {
    fetchRegistros();
  }, []); // O fetchRegistros só precisa ser chamado uma vez ao montar o componente

  useEffect(() => {
    saldoEntrada();
    saldoSaida();
    saldoTotal();
    conta();
  }, [registros, saldoEntrada, saldoSaida, saldoTotal, conta]); // Agora as funções são estáveis e não causam re-renders desnecessários


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
