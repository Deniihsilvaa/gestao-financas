import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Chart } from "primereact/chart";
import { supabase } from "../../services/supabaseClient";
import "./Contas.css"; // Adicione estilos personalizados se necessário.

function Contas() {
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
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

  // Função para agrupar os dados por categoria e mês
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

  // Filtra os dados do mês atual para o gráfico de pizza
  const getCurrentMonthData = (data) => {
    const currentMonth = new Date().getMonth();
    return data.filter((item) => new Date(item.data_transacao).getMonth() === currentMonth);
  };

  // Filtra os dados do ano atual para o gráfico de colunas
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

  // Template para expandir linhas
  const rowExpansionTemplate = (rowData) => {
    return (
      <div className="p-3">
        <DataTable value={Object.entries(rowData.meses)} responsiveLayout="scroll">
          <Column field="0" header="Mês" />
          <Column
            header="Descrição"
            body={(row) =>
              row[1].map((item, index) => (
                <div key={index}>
                  <strong>{item.descricao}</strong> ({item.tipo_registro}): R$ {item.valor.toFixed(2)}
                </div>
              ))
            }
          />
        </DataTable>
      </div>
    );
  };

  // Configuração dos gráficos
  const pieData = {
    labels: currentMonthData.map((item) => item.tipo_categoria),
    datasets: [
      {
        data: currentMonthData.map((item) => item.valor),
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#FF5252", "#7E57C2"],
      },
    ],
  };

  const barData = {
    labels: Object.keys(yearlyData),
    datasets: [
      {
        label: "Despesas por mês",
        backgroundColor: "#42A5F5",
        data: Object.values(yearlyData),
      },
    ],
  };

  return (
    <div className="datatable-expand-demo">
      <h3>Contas por Categoria</h3>
      <div className="p-grid">
        <div className="p-col-12 p-md-8">
          <DataTable
            value={data}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            responsiveLayout="scroll"
          >
            <Column expander style={{ width: "3em" }} />
            <Column field="tipo_categoria" header="Tipo de Categoria" />
            <Column
              header="Total"
              body={(rowData) => `R$ ${rowData.total.toFixed(2)}`}
              style={{ textAlign: "right" }}
            />
            {/* Colunas dinâmicas para meses */}
            {data[0] &&
              Object.keys(data[0].meses).map((month) => (
                <Column
                  key={month}
                  header={month}
                  body={(rowData) =>
                    rowData.meses[month]
                      ? rowData.meses[month].reduce((sum, item) => sum + item.valor, 0).toFixed(2)
                      : "-"
                  }
                  style={{ textAlign: "right" }}
                />
              ))}
          </DataTable>
        </div>

        <div className="p-col-12 p-md-4">
          <h4>Gráfico de Pizza - Despesas do Mês Atual</h4>
          <Chart type="pie" data={pieData} />

          <h4>Gráfico de Colunas - Despesas por Mês</h4>
          <Chart type="bar" data={barData} />
        </div>
      </div>
    </div>
  );
}

export default Contas;
