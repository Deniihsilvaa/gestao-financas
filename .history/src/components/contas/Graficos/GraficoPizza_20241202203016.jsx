import React from "react";
import { Chart } from "primereact/chart";
import PropTypes from "prop-types";

function GraficoPizza({ data }) {
  // Soma os valores de cada tipo de categoria
  const categoriaSoma = data.reduce((acc, item) => {
    if (acc[item.tipo_categoria]) {
      acc[item.tipo_categoria] += item.valor; // Soma o valor caso a categoria já exista
    } else {
      acc[item.tipo_categoria] = item.valor; // Cria a categoria se não existir
    }
    return acc;
  }, {});

  // Transforma o objeto categoriaSoma em um array
  const categorias = Object.keys(categoriaSoma);
  const valores = categorias.map((categoria) => categoriaSoma[categoria]);

  // Soma total de todos os valores
  const total = valores.reduce((acc, valor) => acc + valor, 0);

  // Calcula as porcentagens
  const porcentagens = valores.map((valor) => (valor / total) * 100);

  // Cria os rótulos com o valor em reais e a porcentagem
  const labels = categorias.map((categoria, index) => {
    return `${categoria} - R$ ${valores[index].toFixed(2)} (${porcentagens[index].toFixed(2)}%)`;
  });

  // Dados do gráfico de pizza
  const pieData = {
    labels: labels,
    datasets: [
      {
        data: valores,
        backgroundColor: [
          "#42A5F5", "#66BB6A", "#FFA726", "#FF5252", "#7E57C2",
        ],
      },
    ],
  };

  return (
    <>
      <Chart type="doughnut" data={pieData} />
    </>
  );
}

GraficoPizza.propTypes = {
  data: PropTypes.array.isRequired,
};

export default GraficoPizza;
