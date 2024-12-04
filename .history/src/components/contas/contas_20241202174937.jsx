import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import TabelaCategoria from "./TabelaCategoria";
import GraficoPizza from "./";
import GraficoColunas from "./GraficoColunas";

function Contas() {
  const [data, setData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

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

      setData(groupedData);
      setCurrentMonthData(currentMonth);
      setYearlyData(yearData);
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
        grouped[item.tipo_categoria] = { tipo_categoria: item.tipo_categoria, meses: {} };
      }
      if (!grouped[item.tipo_categoria].meses[month]) {
        grouped[item.tipo_categoria].meses[month] = [];
      }
      grouped[item.tipo_categoria].meses[month].push(item);
    });

    return Object.values(grouped).map((group) => ({
      ...group,
      total: Object.values(group.meses).flat().reduce((sum, item) => sum + item.valor, 0),
    }));
  };

  const getCurrentMonthData = (data) => {
    const currentMonth = new Date().getMonth();
    return data.filter((item) => new Date(item.data_transacao).getMonth() === currentMonth);
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

  return (
    <div className="datatable-expand-demo">
      <h3>Contas por Categoria</h3>
      <div className="p-grid">
        <div className="p-col-12 p-md-8">
          <TabelaCategoria data={data} />
        </div>
        <div className="p-col-12 p-md-4">
          <GraficoPizza data={currentMonthData} />
          <GraficoColunas data={yearlyData} />
        </div>
      </div>
    </div>
  );
}

export default Contas;