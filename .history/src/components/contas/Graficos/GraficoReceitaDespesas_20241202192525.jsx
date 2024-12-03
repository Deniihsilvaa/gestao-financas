import React from "react";
import { Chart } from "primereact/chart";
import PropTypes from "prop-types";

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
    <div className="p-card w-25">
      <h4>Receitas e Despesas - Mês Atual</h4>
      <Chart type="bar" data={barData} />
    </div>
  );
}

export default GraficoReceitaDespesas;

GraficoReceitaDespesas.propTypes = {
  receita: PropTypes.any,
  despesa: PropTypes.any,
};
