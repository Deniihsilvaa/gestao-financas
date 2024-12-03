import React from "react";
import { Chart } from "primereact/chart";
import PropTypes, { string } from "prop-types";

function GraficoReceitaDespesas({ receita, despesa }) {
  const barData = {
    labels: ["Receita", "Despesa"],
    datasets: [
      {
        label: "Total (Mês Atual)",
        backgroundColor: ["#42A5F5", "#FF5252"],
        data: [receita, despesa],
      },
    ],
  };

  return (
    <div className="p-card">
      <h4>Receitas e Despesas - Mês Atual</h4>
      <Chart type="bar" data={barData} />
    </div>
  );
}

export default GraficoReceitaDespesas;

GraficoReceitaDespesas.prototype = {
  receita: PropTypes.any,
  despesa: PropTypes.any,
};
