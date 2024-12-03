import React from "react";
import { Chart } from "primereact/chart";
import PropTypes from 'prop-types'

function GraficoGeral({ situacaoData }) {
  const barData = {
    labels: ["Pendente", "Concluído"],
    datasets: [
      {
        label: "Situação das Transações",
        backgroundColor: ["#FF5252", "#66BB6A"],
        data: [situacaoData.pendente, situacaoData.concluido],
      },
    ],
  };

  return (
    <div className="p-card">
      <h4>Resumo Geral - Situações</h4>
      <Chart type="bar" data={barData} />
    </div>
  );
}

GraficoGeral.por
export default GraficoGeral;
