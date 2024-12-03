import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import TabelaCategoria from "./Tabela/TabelaCategoria";
import GraficoPizza from "./Graficos/GraficoPizza";
import GraficoColunas from "./Graficos/GraficoColunas";
import GraficoGeral from "./Graficos/GraficoGeral";
import GraficoReceitaDespesas from "./Graficos/GraficoReceitaDespesas";
function Contas() {
  const [data, setData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [situacaoData, setSituacaoData] = useState({});
  const [receita, setReceita] = useState({});
  const [despesa, seDespesa] = useState({});
  
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
    const receita = data
      .filter(
        (item) =>
          new Date(item.data_transacao).getMonth() === currentMonth &&
          item.tipo_categoria === "Entrada"
      )
      .reduce((sum, item) => sum + item.valor, 0);

    const despesa = data
      .filter(
        (item) =>
          new Date(item.data_transacao).getMonth() === currentMonth &&
          item.tipo_categoria === "Saída"
      )
      .reduce((sum, item) => sum + item.valor, 0);

    return { receita, despesa };
  };

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("viewBaseCaixa").select("*");
      if (error) {
        console.error("Erro ao buscar dados:", error);
        return;
      }

      // Calcular valores de receitas e despesas
      const { receita, despesa } = getReceitaDespesaMesAtual(data);

      setReceita(receita);
      setDespesa(despesa);

      // Outros cálculos aqui...
    }

    fetchData();
  }, []);

  return (
    <div className="p-4 card max-w-100 shadow-indigo-950">
      <div className="dashboard">
        <h3 className="header">Dashboard de Contas</h3>
        <div className="p-grid border-spacing-2">
          <div className="p-col-12 p-md-8">
            <TabelaCategoria data={data} />
          </div>
          <div className="p-col-12 p-md-4">
            <GraficoPizza data={currentMonthData} />
            <GraficoColunas data={yearlyData} />
          </div>
          <div className="p-col-12">
            <GraficoGeral situacaoData={situacaoData} />
          </div>
          <div className="p-col-12">
            <GraficoReceitaDespesas situacaoData={situacaoData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contas;
