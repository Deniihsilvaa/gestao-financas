import React,{useState} from "react";
import { Chart } from "primereact/chart";
import PropTypes from "prop-types";
import { Colors } from "chart.js";

function GraficoReceitaDespesas({ receita, despesa }) {
  const documentStyle = getComputedStyle(document.documentElement);
  
  const [chartOptions, setChartOptions] = useState({});
  const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        
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

setChartOptions(options);


  return (
    <div className="text-black p-car">
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
