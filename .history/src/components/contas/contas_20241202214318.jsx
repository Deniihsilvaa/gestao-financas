import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import TabelaCategoria from "./Tabela/TabelaCategoria";
import GraficoPizza from "./Graficos/GraficoPizza";
import GraficoColunas from "./Graficos/GraficoColunas";
import GraficoGeral from "./Graficos/GraficoGeral";
import GraficoReceitaDespesas from "./Graficos/GraficoReceitaDespesas";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import {formatCurrency} from '../../utils/formatters'
function Contas() {
  const [data, setData] = useState([]);
  const [receita, setReceita] = useState(0);
  const [despesa, setDespesa] = useState(0);
  const [selectedSituacao, setSelectedSituacao] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null); // Data de início do período
  const [selectedEndDate, setSelectedEndDate] = useState(null); // Data de fim do período

  // Função para buscar os dados no banco
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("viewBaseCaixa").select("*");
      if (error) {
        console.error("Erro ao buscar dados:", error);
        return;
      }

      // Aplicando filtros de período e situação
      const filteredData = filterByDateAndSituacao(
        data,
        selectedStartDate,
        selectedEndDate,
        selectedSituacao
      );

      const { receita, despesa } = getReceitaDespesa(filteredData);

      setData(filteredData); // Dados completos, sem agrupamento por categoria e mês
      setReceita(receita);
      setDespesa(despesa);
    }

    fetchData();
  }, [selectedStartDate, selectedEndDate, selectedSituacao]);

  // Função para filtrar os dados por data e situação
  const filterByDateAndSituacao = (data, startDate, endDate, situacao) => {
    return data.filter((item) => {
      const itemDate = new Date(item.data_transacao);
      const isInDateRange =
        (!startDate || itemDate >= new Date(startDate)) &&
        (!endDate || itemDate <= new Date(endDate));
      const matchesSituacao = situacao ? item.situacao === situacao : true;
      return isInDateRange && matchesSituacao;
    });
  };

  // Função para calcular a receita e a despesa
  const getReceitaDespesa = (data) => {
    if (!Array.isArray(data)) {
      console.error("Dados inválidos:", data);
      return { receita: 0, despesa: 0 };
    }

    const receita = data
      .filter((item) => item.tipo_registro === "Entrada")
      .reduce((sum, item) => sum + item.valor, 0);
    const despesa = data
      .filter((item) => item.tipo_registro === "Saída")
      .reduce((sum, item) => sum + item.valor, 0);
    return { receita, despesa };
  };

  // Função para filtrar os dados de "Saída" para o gráfico de pizza
  const filtrarSaidas = (dados) => {
    return dados.filter((item) => item.tipo_registro === "Saída");
  };

  // Função para filtrar os dados de "Entrada" para o gráfico de receita/despesa
  const filtrarEntradas = (dados) => {
    return dados.filter((item) => item.tipo_registro === "Entrada");
  };

  // Função para filtrar dados por categoria para o gráfico de colunas
  const filtrarPorCategoria = (dados) => {
    return dados.filter((item) => item.tipo_categoria);
  };

  // Função para filtrar os dados por situação (Pendente / Concluído) para o gráfico geral
  const filtrarPorSituacao = (dados, situacao) => {
    return dados.filter((item) => item.situacao === situacao);
  };

  // Funções de opções do Dropdown
  const situacaoOptions = [
    { label: "Pendente", value: "Pendente" },
    { label: "Concluído", value: "Concluido" },
  ];

  return (
    <div className="p-6 text-white rounded-lg shadow-xl bg-gradient-to-r from-blue-900 to-black">
      <h2 className="mb-8 text-3xl font-bold text-center">
        Dashboard de Contas
      </h2>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
          <Dropdown
            value={selectedSituacao}
            options={situacaoOptions}
            onChange={(e) => setSelectedSituacao(e.value)}
            placeholder="Filtrar por Situação"
            className="w-40"
          />

          <div className="flex gap-4">
            <Calendar
              value={selectedStartDate}
              onChange={(e) => setSelectedStartDate(e.value)}
              showIcon
              dateFormat="dd/mm/yy"
              placeholder="Data Início"
              className="w-40"
            />
            <Calendar
              value={selectedEndDate}
              onChange={(e) => setSelectedEndDate(e.value)}
              showIcon
              dateFormat="dd/mm/yy"
              placeholder="Data Fim"
              className="w-40"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="p-4 text-center bg-green-800 rounded-lg shadow-lg">
            <h5>Total Receita</h5>
            <p className="text-xl">{formatCurrency(receita)}</p>
          </div>
          <div className="p-4 text-center bg-red-800 rounded-lg shadow-lg">
            <h5>Total Despesa</h5>
            <p className="text-xl">{formatCurrency(despesa)}</p>
          </div>
          <div className="p-4 text-center bg-blue-800 rounded-lg shadow-lg">
            <h5>Saldo</h5>
            <p className="text-xl">{receita - despesa}</p>
          </div>
        </div>
      </div>

      {/* Grid de gráficos */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="card">
          <GraficoPizza data={filtrarSaidas(data)} />
        </div>
        <div className="card">
          <GraficoReceitaDespesas receita={receita} despesa={despesa} />
        </div>
        <div className="card">
          <GraficoColunas data={filtrarPorCategoria(data)} />
        </div>
        <div className="card">
          <TabelaCategoria data={data} />
        </div>
        <div className="card">
          <GraficoGeral
            situacaoData={filtrarPorSituacao(data, selectedSituacao)}
          />
        </div>
      </div>
    </div>
  );
}

export default Contas;
