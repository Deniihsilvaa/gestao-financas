import React from "react";
import { Chart } from "primereact/chart";
import PropTypes from "prop-types";

function GraficoPizza({ data }) {
  const currentMonth = new Date().toLocaleString("default", { month: "short" }); // Obter mês atual abreviado, ex: 'nov.'
  console.log("Dados chegando", data);
  // Filtra os dados para pegar somente os registros de "Saída" do mês atual
  const filteredData = data
    .filter(
      (item) => item.tipo_registro === "Saída" && item.meses[currentMonth]
    ) // Filtra por "Saída" e mês atual
    .map((item) => ({
      tipo_categoria: item.tipo_categoria,
      valor: item.meses[currentMonth].reduce(
        (sum, record) => sum + record.valor,
        0
      ), // Soma os valores do mês
    }));

  // Agrupa os valores por categoria
  const groupedData = filteredData.reduce((acc, item) => {
    if (!acc[item.tipo_categoria]) {
      acc[item.tipo_categoria] = 0;
    }
    acc[item.tipo_categoria] += item.valor;
    return acc;
  }, {});

  // Prepara os dados para o gráfico de pizza
  const pieData = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        data: Object.values(groupedData),
        backgroundColor: [
          "#42A5F5",
          "#66BB6A",
          "#FFA726",
          "#FF5252",
          "#7E57C2",
        ],
      },
    ],
  };

  // Calcula o valor total
  const total = Object.values(groupedData).reduce(
    (sum, value) => sum + value,
    0
  );

  return (
    <div>
      <h4>Resumo de Despesas por Categoria</h4>
      <Chart type="doughnut" data={pieData} />
      <div>
        {Object.entries(groupedData).map(([category, value]) => (
          <div key={category}>
            <strong>{category}: </strong>
            R$ {value.toFixed(2)} ({((value / total) * 100).toFixed(2)}%)
          </div>
        ))}
      </div>
    </div>
  );
}

GraficoPizza.propTypes = {
  data: PropTypes.array.isRequired,
};

export default GraficoPizza;
