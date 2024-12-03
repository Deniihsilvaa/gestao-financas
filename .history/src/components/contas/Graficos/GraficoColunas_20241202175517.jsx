import React from "react";
import { Chart } from "primereact/chart";
import Prop
function GraficoColunas({ data }) {
  const barData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Despesas por mês",
        backgroundColor: "#42A5F5",
        data: Object.values(data),
      },
    ],
  };

  return (
    <>
      <h4>Gráfico de Colunas - Despesas por Mês</h4>
      <Chart type="bar" data={barData} />
    </>
  );
}

export default GraficoColunas;
