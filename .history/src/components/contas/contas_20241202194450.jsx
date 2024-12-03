import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import TabelaCategoria from "./Tabela/TabelaCategoria";
import GraficoPizza from "./Graficos/GraficoPizza";
import GraficoColunas from "./Graficos/GraficoColunas";
import GraficoGeral from "./Graficos/GraficoGeral";
import GraficoReceitaDespesas from "./Graficos/GraficoReceitaDespesas";
import { Dropdown } from "primereact/dropdown";

function Contas() {
  const [data, setData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [situacaoData, setSituacaoData] = useState({});
  const [receita, setReceita] = useState(0); // Mudar para número
  const [despesa, setDespesa] = useState(0); // Mudar para número
  const [selectedSituacao, setSelectedSituacao] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("viewBaseCaixa").select("*");
      if (error) {
        console.error("Erro ao buscar dados:", error);
        return;
      }

      const groupedData = groupByCategoryAndMonth(data);
      const currentMonth = getCurrentMonthData(data);
      const yearData = getYearlyData(data);
      const situacao = groupBySituacao(data);

      setData(groupedData);
      setCurrentMonthData(currentMonth);
      setYearlyData(yearData);
      setSituacaoData(situacao);

      // Atualizar o estado com receita e despesa
      const { receita, despesa } = getReceitaDespesaMesAtual(data);
      setReceita(receita);
      setDespesa(despesa);
    }

    fetchData();
  }, []);

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

  const getCurrentMonthData = (data) => {
    const currentMonth = new Date().getMonth();
    return data.filter(
      (item) => new Date(item.data_transacao).getMonth() === currentMonth
    );
  };

  const getYearlyData = (data) => {
    const currentYear = new Date().getFullYear();
    const groupedByMonth = {};
    data.forEach((item) => {
      const date = new Date(item.data_transacao);
      if (date.getFullYear() === currentYear) {
        const month = date.toLocaleString("default", { month: "short" });
        groupedByMonth[month] = (groupedByMonth[month] || 0) + item.valor;
      }
    });

    return groupedByMonth;
  };

  const groupBySituacao = (data) => {
    const situacao = { pendente: 0, concluido: 0 };
    data.forEach((item) => {
      if (item.situacao === "Pendente") {
        situacao.pendente += item.valor;
      } else if (item.situacao === "Concluído") {
        situacao.concluido += item.valor;
      }
    });
    return situacao;
  };

  const getReceitaDespesaMesAtual = (data) => {
    const currentMonth = new Date().getMonth();

    // Calcular a receita para o mês atual
    const receita = data
      .filter(
        (item) =>
          new Date(item.data_transacao).getMonth() === currentMonth &&
          item.tipo_registro === "Entrada"
      )
      .reduce((sum, item) => sum + item.valor, 0);

    // Calcular a despesa para o mês atual
    const despesa = data
      .filter(
        (item) =>
          new Date(item.data_transacao).getMonth() === currentMonth &&
          item.tipo_registro === "Saída"
      )
      .reduce((sum, item) => sum + item.valor, 0);

    return { receita, despesa }; // Retorna os valores calculados
  };

  const situacaoOptions = [
    { label: "Pendente", value: "Pendente" },
    { label: "Concluído", value: "Concluido" },
  ];

  return (
    <div className="p-4 text-white rounded-lg shadow-lg bg-gradient-to-r from-blue-900 to-black">
      <div className="dashboard">
        <h3 className="mb-6 text-3xl font-bold text-center">
          Dashboard de Contas
        </h3>

        {/* Filtro de situação */}
        <div className="flex justify-center gap-4 mb-4">
          <Dropdown
            value={selectedSituacao}
            options={situacaoOptions}
            onChange={(e) => setSelectedSituacao(e.value)}
            placeholder="Filtrar por Situação"
            className="w-40"
          />
        </div>

        {/* Grid de gráficos */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-1 p-4 rounded-lg shadow-xl bg-gradient-to-r from-neutral-900 from-10% via-slate-900 via-30% border-t-stone-950 to-90%">
            <GraficoPizza data={currentMonthData} />
          </div>
          <div className="col-span-1 p-4 scale-75 translate-x-4 skew-y-3 bg-blue-800 rounded-lg shadow-xl md:transform-none">
            <GraficoReceitaDespesas receita={receita} despesa={despesa} />
          </div>
          <div className="col-span-1 p-4 bg-blue-800 rounded-lg shadow-xl">
            <GraficoColunas data={yearlyData} />
          </div>
          <div className="col-span-1 p-4 bg-blue-800 rounded-lg shadow-lg lg:col-span-2">
            <TabelaCategoria data={data} />
          </div>
          <div className="col-span-1 p-4 bg-blue-800 rounded-lg shadow-lg lg:col-span-2">
            <GraficoGeral situacaoData={situacaoData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contas;
