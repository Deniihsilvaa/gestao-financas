import React, { useEffect, useState } from "react";
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
import { buscaDadosConsolidado } from "../../connection"; // Importando a função para buscar dados

// Registrar os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraficoConsolidado = () => {
  const [chartData, setChartData] = useState<any>(null); // Estado para os dados do gráfico

  // Função para buscar dados do Supabase
  const fetchData = async () => {
    const data = await buscaDadosConsolidado(); // Chama a função de busca dos dados agrupados
    if (data) {
      // Atualiza o estado com os dados processados para entrada e saída
      setChartData({
        labels: data.labels, // Meses (labels)
        datasets: [
          {
            label: "Entradas Mensais", // Série para as entradas
            data: data.entradas, // Dados das entradas
            backgroundColor: "rgba(75, 192, 192, 0.6)", // Cor das barras de entrada
            borderColor: "rgba(75, 192, 192, 1)", // Cor da borda
            borderWidth: 1,
          },
          {
            label: "Saídas Mensais", // Série para as saídas
            data: data.saidas, // Dados das saídas
            backgroundColor: "rgba(255, 99, 132, 0.6)", // Cor das barras de saída
            borderColor: "rgba(255, 99, 132, 1)", // Cor da borda
            borderWidth: 1,
          },
        ],
      });
    } else {
      setChartData(null); // Caso não tenha dados
    }
  };

  useEffect(() => {
    fetchData(); // Chama a função para pegar os dados ao montar o componente
  }, []); // Apenas executa uma vez quando o componente for montado

  if (!chartData) {
    return (
      <p>Não há dados para exibir ou ocorreu um erro ao carregar os dados.</p>
    );
  }

  // Opções de configuração do gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const, // Posição da legenda
      },
      title: {
        display: true,
        text: "Gráfico Consolidado de Entradas e Saídas", // Título do gráfico
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default GraficoConsolidado;
