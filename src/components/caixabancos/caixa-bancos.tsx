import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../services/supabaseClient";
import { RegistroProps, FiltrobancosProps } from "./types";
import TableCaixaBancos from "./components/table";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

function CaixaBancos() {
  const [registros, setRegistros] = useState<RegistroProps[]>([]);
  const [filtroBanco, setFiltroBanco] = useState<string | null>(null);
  const [filtroDataInicio, setFiltroDataInicio] = useState<Date | null>(null);
  const [filtroDataFim, setFiltroDataFim] = useState<Date | null>(null);
  const [bancosDisponiveis, setBancosDisponiveis] = useState<
    FiltrobancosProps[]
  >([]);
  const [totais, setTotais] = useState({
    totalEntrada: 0,
    totalSaida: 0,
    saldo: 0,
    totalConta: 0,
  });

  const fetchRegistros = async (): Promise<void> => {
    try {
      let query = supabase
        .from("base_caixa")
        .select(
          `
          id,
          descricao,
          valor,
          situacao,
          tipo_registro,
          data_transacao,
          tipo_categoria ( categoria ),
          conta_bancaria ( banco ),
          data_vencimento,
          observacao
        `
        )
        .order("data_transacao", { ascending: false });

      // Aplicar filtros ao banco de dados
      if (filtroBanco) {
        console.log("filtroBanco", filtroBanco);
        query = query.eq("conta_bancaria.banco", filtroBanco); // Filtro de banco
        console.log("query", query);
      }
      if (filtroDataInicio && filtroDataFim) {
        query = query
          .gte("data_transacao", filtroDataInicio.toISOString())
          .lte("data_transacao", filtroDataFim.toISOString()); // Filtro de data
      }

      const { data, error } = await query;
      if (error) throw error;

      // Somente formata os dados dos registros que foram filtrados corretamente
      const registrosFormatados = (data as RegistroProps[]).map((registro) => ({
        ...registro,
        tipo_categoria: registro.tipo_categoria?.categoria || "N/A",
        conta_bancaria: registro.conta_bancaria?.banco || "N/A",
      }));

      setRegistros(registrosFormatados || []);
    } catch (error) {
      console.error("Erro ao buscar registros:", error);
    }
  };

  const fetchBancos = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("bank_account")
        .select("id, banco")
        .order("banco", { ascending: true });
      if (error) throw error;
      setBancosDisponiveis(data || []);
    } catch (error) {
      console.error("Erro ao buscar bancos:", error);
    }
  };

  const calcularTotais = useCallback(() => {
    const totalEntrada = registros.reduce(
      (acc, reg) =>
        reg.tipo_registro === "Entrada" ? acc + Number(reg.valor) : acc,
      0
    );
    const totalSaida = registros.reduce(
      (acc, reg) =>
        reg.tipo_registro === "Saída" ? acc + Number(reg.valor) : acc,
      0
    );
    const saldo = totalEntrada - totalSaida;
    const totalConta = registros.length;

    setTotais({ totalEntrada, totalSaida, saldo, totalConta });
  }, [registros]);

  useEffect(() => {
    fetchRegistros();
    fetchBancos();
  }, [filtroBanco, filtroDataInicio, filtroDataFim]);

  useEffect(() => {
    calcularTotais();
  }, [registros, calcularTotais]);

  return (
    <div className="flex h-screen">
      {/* Conteúdo principal */}
      <main className="flex-1 p-6 bg-gray-100">
        <h2 className="mb-4 text-lg font-semibold">Caixa Bancos</h2>

        {/* Barra de filtros */}
        <div className="flex items-center gap-4 p-4 mb-6 bg-white rounded shadow">
          <Dropdown
            value={filtroBanco}
            onChange={(e) => setFiltroBanco(e.value)}
            options={bancosDisponiveis.map((banco) => ({
              label: banco.banco,
              value: banco.banco,
            }))}
            placeholder="Selecione um banco"
            className="w-full md:w-14rem"
          />
          <Calendar
            value={filtroDataInicio}
            onChange={(e) => setFiltroDataInicio(e.value as Date | null)}
            placeholder="Data início"
            className="w-full md:w-14rem"
            dateFormat="dd/mm/yy"
          />
          <Calendar
            value={filtroDataFim}
            onChange={(e) => setFiltroDataFim(e.value as Date | null)}
            placeholder="Data fim"
            className="w-full md:w-14rem"
            dateFormat="dd/mm/yy"
          />
          <Button
            label="Filtrar"
            onClick={fetchRegistros}
            className="p-button-primary"
          />
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <TableCaixaBancos registros={registros} />
        </div>
      </main>

      {/* Barra lateral */}
      <aside className="hidden w-1/6 p-4 text-white bg-gray-800 md:block">
        <h2 className="mb-4 text-lg font-semibold">Resumo</h2>
        <ul className="mt-2 ml-4 space-y-2 list-disc">
          <li>Total de contas: {totais.totalConta}</li>
          <li>Total Entrada: R$ {totais.totalEntrada.toFixed(2)}</li>
          <li>Total Saída: R$ {totais.totalSaida.toFixed(2)}</li>
          <li>Saldo Total: R$ {totais.saldo.toFixed(2)}</li>
        </ul>
      </aside>
    </div>
  );
}

export default CaixaBancos;
