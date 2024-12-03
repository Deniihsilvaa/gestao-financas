import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import TabelaCategoria from "./Tabela/TabelaCategoria";
import GraficoPizza from "./Graficos/GraficoPizza";
import GraficoColunas from "./Graficos/GraficoColunas";
import GraficoGeral from "./Graficos/GraficoGeral";
import GraficoReceitaDespesas from "./Graficos/GraficoReceitaDespesas";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

function Contas() {
  const [data, setData] = useState([]);
  const [receita, setReceita] = useState(0);
  const [despesa, setDespesa] = useState(0);
  const [selectedSituacao, setSelectedSituacao] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null); // Data de início do período
  const [selectedEndDate, setSelectedEndDate] = useState(null); // Data de fim do período

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

      const groupedData = groupByCategoryAndMonth(filteredData);
      const { receita, despesa } = getReceitaDespesa(filteredData);

      setData(groupedData);
      setReceita(receita);
      setDespesa(despesa);
    }

    fetchData();
  }, [selectedStartDate, selectedEndDate, selectedSituacao]);

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

  const groupByCategoryAndMonth = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const month = new Date(item.data_transacao).toLocaleString("default", {
        month: "short",
      });
      if (!grouped[item.tipo_categoria]) {
        grouped[item.tipo_categoria] = {
          tipo_categoria: item.tipo_categoria,
          meses: {},
        };
      }
      if (!grouped[item.tipo_categoria].meses[month]) {
        grouped[item.tipo_categoria].meses[month] = [];
      }
      grouped[item.tipo_categoria].meses[month].push(item);
    });

    return Object.values(grouped).map((group) => ({
      ...group,
      total: Object.values(group.meses)
        .flat()
        .reduce((sum, item) => sum + item.valor, 0),
    }));
  };

  const getReceitaDespesa = (data) => {
    const receita = data
      .filter((item) => item.tipo_registro === "Entrada")
      .reduce((sum, item) => sum + item.valor, 0);
    const despesa = data
      .filter((item) => item.tipo_registro === "Saída")
      .reduce((sum, item) => sum + item.valor, 0);
    return { receita, despesa };
  };

  // Função para filtrar os dados pelo tipo de registro
  const filtrarPorTipoRegistro = (dados, tipoRegistro) => {
    console.log("Dado FIltrado",dados)
    return dados.filter((item) => item.tipo_registro === tipoRegistro);
  };

  const situacaoOptions = [
    { label: "Pendente", value: "Pendente" },
    { label: "Concluído", value: "Concluido" },
  ];

  return (
    <div className="p-2 text-white rounded-lg shadow-lg bg-gradient-to-r from-blue-900 to-black">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 p-4 text-white bg-green-800 rounded-lg shadow-xl">
          <h5>Total Receita</h5>
          <p className="text-2xl">{receita}</p>
        </div>
        <div className="col-span-1 p-4 text-white bg-red-800 rounded-lg shadow-xl">
          <h5>Total Despesa</h5>
          <p className="text-2xl">{despesa}</p>
        </div>
        <div className="col-span-1 p-4 text-white bg-blue-800 rounded-lg shadow-xl">
          <h5>Saldo</h5>
          <p className="text-2xl">{receita - despesa}</p>
        </div>
      </div>

      <div className="dashboard">
        <h3 className="mb-6 text-3xl font-bold text-center">
          Dashboard de Contas
        </h3>

        <div className="flex justify-center gap-4 mb-4">
          <Dropdown
            value={selectedSituacao}
            options={situacaoOptions}
            onChange={(e) => setSelectedSituacao(e.value)}
            placeholder="Filtrar por Situação"
            className="w-40"
          />

          {/* Filtros de período */}
          <div className="flex justify-center gap-4 text-black">
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

        {/* Grid de gráficos */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="card">
            {/* Filtrando os dados de "Saída" para o gráfico de pizza */}
            <GraficoPizza data={filtrarPorTipoRegistro(data, "Saída")} />
          </div>
          
          <div className="card">
              {/* Dados de receita e despesas */}
            <GraficoReceitaDespesas receita={receita} despesa={despesa} />
          </div>
          <div className="card">
            <GraficoColunas data={data} />
          </div>
          <div className="card">
            <TabelaCategoria data={data} />
          </div>
          <div className="card">
            <GraficoGeral situacaoData={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contas;
