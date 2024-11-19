import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartExample = () => {
  // Dados para o gráfico
  const data = {
    labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"],
    datasets: [
      {
        label: "Vendas 2024",
        data: [500, 800, 400, 900, 1000],
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Cor das barras
        borderColor: "rgba(75, 192, 192, 1)", // Cor da borda
        borderWidth: 1,
      },
    ],
  };

  // Opções de configuração
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Posição da legenda
      },
      title: {
        display: true,
        text: "Gráfico de Vendas Mensais",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ChartExample;
