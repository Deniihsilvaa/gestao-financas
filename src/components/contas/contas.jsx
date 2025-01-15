// src/components/contas/contas.jsx
import React, { useState, useEffect } from "react";
import "./conta.css";
import { supabase } from "../../services/supabaseClient";
import TabelaCategoria from "./Tabela/TabelaCategoria";
import GraficoPizza from "./Graficos/GraficoPizza";
import GraficoColunas from "./Graficos/GraficoColunas";
import GraficoGeral from "./Graficos/GraficoGeral";
import GraficoReceitaDespesas from "./Graficos/GraficoReceitaDespesas";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { formatCurrency } from "../../utils/formatters";
import PropTypes from "prop-types";
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

  // Funções para filtrar os dados para os gráficos
  const filtrarSaidas = (dados) => {
    return dados.filter((item) => item.tipo_registro === "Saída");
  };

  const filtrarPorCategoria = (dados) => {
    return dados.reduce((acc, item) => {
      if (item.tipo_categoria) {
        acc[item.tipo_categoria] = (acc[item.tipo_categoria] || 0) + item.valor;
      }
      return acc;
    }, {});
  };

  const filtrarPorSituacao = (dados, situacao) => {
    return dados.filter((item) => item.situacao === situacao);
  };

  // Funções de opções do Dropdown
  const situacaoOptions = [
    { label: "Todas", value: "" },
    { label: "Pendente", value: "Pendente" },
    { label: "Concluído", value: "Concluido" },
  ];
  const handleClearFilters = () => {
    setSelectedSituacao(null);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  return (
   <div className="min-h-screen p-4 md:p-6 space-y-4 md:space-y-8 text-white shadow-sm rounded-2xl bg-gradient-to-b from-blue-900 to-black">
      <h2 className="mb-8 text-3xl font-bold text-center">
        Dashboard de Caixa Entrada e Saída
      </h2>

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4 md:mb-6">
      <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 p-4 text-black bg-white rounded-lg">
          <Dropdown
            value={selectedSituacao}
            options={situacaoOptions}
            onChange={(e) => setSelectedSituacao(e.value)}
            placeholder="Filtrar por Situação"
            className="w-40 hover:bg-gray-200"
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
              className="w-40 text-black "
            />
            <button className="btn" onClick={handleClearFilters}>
              Limpar
            </button>
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
            <p className="text-xl">{formatCurrency(receita - despesa)}</p>{" "}
            {/* Corrigido para exibir o valor correto */}
          </div>
        </div>
      </div>

      {/* Grid de gráficos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="card p-4 backdrop-blur-sm rounded-lg">
          <GraficoPizza data={filtrarSaidas(data)} />
        </div>
      <div className="card p-4 backdrop-blur-sm rounded-lg">
          <GraficoReceitaDespesas receita={receita} despesa={despesa} />
        </div>
      <div className="card p-4 backdrop-blur-sm rounded-lg">
          <GraficoColunas data={filtrarPorCategoria(data)} />
        </div>
      <div className="card p-4 backdrop-blur-sm rounded-lg col-span-2">
          <TabelaCategoria data={data} />
        </div>
      <div className="card p-4 backdrop-blur-sm rounded-lg">
          <GraficoGeral
            situacaoData={filtrarPorSituacao(data, selectedSituacao)}
          />
        </div>
      </div>
    </div>
  );
}
Contas.propTypes = {
  data: PropTypes.array,
  receita: PropTypes.number,
  despesa: PropTypes.number,
  selectedSituacao: PropTypes.string,
  selectedStartDate: PropTypes.instanceOf(Date),
  selectedEndDate: PropTypes.instanceOf(Date),
};

export default Contas;
