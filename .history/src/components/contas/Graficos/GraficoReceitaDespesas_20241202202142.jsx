import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import PropTypes from "prop-types";

function GraficoReceitaDespesas({ receita, despesa }) {
  const documentStyle = getComputedStyle(document.documentElement);

  // Estado para armazenar as opções do gráfico
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    // Verifica se as opções já foram configuradas, se não, configura uma vez
    if (!chartOptions) {
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      
      const options = {
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          r: {
            grid: {
              color: textColorSecondary
            }
          }
        }
      };

      setChartOptions(options); // Atualiza as opções uma vez
    }
  }, [chartOptions, documentStyle]); // Executa apenas uma vez se chartOptions for null

  // Dados do gráfico
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

  if (!chartOptions) {
    return <div>Carregando gráfico...</div>; // Mostra um texto de carregamento até as opções estarem prontas
  }

  return (
    <div className="text-black p-car">
      <h4>Receitas e Despesas - Mês Atual</h4>
      <Chart type="bar" data={barData} options={chartOptions} />
    </div>
  );
}

GraficoReceitaDespesas.propTypes = {
  receita: PropTypes.number.isRequired,
  despesa: PropTypes.number.isRequired,
};

export default GraficoReceitaDespesas;
