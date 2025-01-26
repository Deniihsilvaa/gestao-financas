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
import { Button } from "primereact/button";
import { formatCurrency } from "../../utils/formatters";
import PropTypes from "prop-types";

function Contas() {
  const [data, setData] = useState([]);
  const [receita, setReceita] = useState(0);
  const [despesa, setDespesa] = useState(0);
  const [selectedSituacao, setSelectedSituacao] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  // Buscar dados do Supabase
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("viewBaseCaixa").select("*");
      if (error) {
        console.error("Erro ao buscar dados:", error);
        return;
      }

      const filteredData = filterByDateAndSituacao(
        data,
        selectedStartDate,
        selectedEndDate,
        selectedSituacao
      );

      const { receita, despesa } = getReceitaDespesa(filteredData);

      setData(filteredData);
      setReceita(receita);
      setDespesa(despesa);
    }

    fetchData();
  }, [selectedStartDate, selectedEndDate, selectedSituacao]);

  // Filtrar dados por data e situação
  const filterByDateAndSituacao = (dados, startDate, endDate, situacao) => {
    if (!dados || !Array.isArray(dados)) return [];
    return dados.filter((item) => {
      const itemDate = new Date(item.data_transacao);
      const isInDateRange =
        (!startDate || itemDate >= new Date(startDate)) &&
        (!endDate || itemDate <= new Date(endDate));
      const matchesSituacao = situacao ? item.situacao === situacao : true;
      return isInDateRange && matchesSituacao;
    });
  };

  // Calcular receita e despesa
  const getReceitaDespesa = (dados) => {
    if (!Array.isArray(dados)) {
      console.error("Dados inválidos:", dados);
      return { receita: 0, despesa: 0 };
    }

    const receita = dados
      .filter((item) => item.tipo_registro === "Entrada")
      .reduce((sum, item) => sum + item.valor, 0);
    const despesa = dados
      .filter((item) => item.tipo_registro === "Saída")
      .reduce((sum, item) => sum + item.valor, 0);
    return { receita, despesa };
  };

  // Filtrar dados por situação
  const filtrarPorSituacao = (dados, situacao) => {
    if (!dados || !Array.isArray(dados)) return [];
    return situacao
      ? dados.filter((item) => item.situacao === situacao)
      : dados;
  };

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
    <div className="min-h-screen p-6 space-y-8 bg-gradient-to-b from-blue-800 to-black text-white">
      <h1 className="text-3xl md:text-4xl font-bold text-center">
        Dashboard de Caixa: Entrada e Saída
      </h1>

      {/* Filtros */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-black">Filtros</h2>
          <Dropdown
            value={selectedSituacao}
            options={situacaoOptions}
            onChange={(e) => setSelectedSituacao(e.value)}
            placeholder="Filtrar por Situação"
            className="w-full mb-4"
          />
          <Calendar
            value={selectedStartDate}
            onChange={(e) => setSelectedStartDate(e.value)}
            dateFormat="dd/mm/yy"
            placeholder="Data Inicial"
            className="w-full mb-4"
          />
          <Calendar
            value={selectedEndDate}
            onChange={(e) => setSelectedEndDate(e.value)}
            dateFormat="dd/mm/yy"
            placeholder="Data Final"
            className="w-full mb-4"
          />
          <Button
            label="Limpar Filtros"
            onClick={handleClearFilters}
            className="w-full"
          />
        </div>

        {/* Resumo Financeiro */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-600 text-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">Receita</h3>
            <p className="text-2xl font-bold">{formatCurrency(receita)}</p>
          </div>
          <div className="bg-red-600 text-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">Despesa</h3>
            <p className="text-2xl font-bold">{formatCurrency(despesa)}</p>
          </div>
          <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">Saldo</h3>
            <p className="text-2xl font-bold">{formatCurrency(receita - despesa)}</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <GraficoPizza data={data} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <GraficoReceitaDespesas receita={receita} despesa={despesa} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <GraficoColunas data={data} />
        </div>
        <div className="col-span-1 sm:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <TabelaCategoria data={data} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <GraficoGeral situacaoData={filtrarPorSituacao(data, selectedSituacao)} />
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
