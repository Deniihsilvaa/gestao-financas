import React from "react";
import { Chart } from "primereact/chart";
import PropTypes from "prop-types";

function GraficoReceitaDespesas({ receita, despesa }) {
  // Garantir que os valores são números antes de renderizar
  const receitaValor = parseFloat(receita) || 0; // Caso não seja numérico, 0
  const despesaValor = parseFloat(despesa) || 0; // Caso não seja numérico, 0

  const barData = {
    labels: ["Receita", "Despesa"],
    datasets: [
      {
        label: "Total (Mês Atual)",
        backgroundColor: ["#42A5F5", "#FF5252"],
        data: [receitaValor, despesaValor],
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

GraficoReceitaDespesas.propTypes = {
  receita: PropTypes.number.isRequired,
  despesa: PropTypes.number.isRequired,
};

export default GraficoReceitaDespesas;
