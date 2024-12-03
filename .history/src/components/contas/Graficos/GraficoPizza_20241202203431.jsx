import React from "react";
import { Chart } from "primereact/chart";
import PropTypes from "prop-types";

function GraficoPizza({ data }) {
  console.log("Dados pizza:", data);

  // Soma os valores por categoria
  const categoriaSoma = data.reduce((acc, item) => {
    if (item.tipo_categoria && item.valor) {
      if (acc[item.tipo_categoria]) {
        acc[item.tipo_categoria] += item.valor; // Soma o valor se a categoria já existe
      } else {
        acc[item.tipo_categoria] = item.valor; // Cria a categoria se não existir
      }
    }
    return acc;
  }, {});

  // Transforma o objeto categoriaSoma em arrays de categorias e valores
  const categorias = Object.keys(categoriaSoma);
  const valores = categorias.map((categoria) => categoriaSoma[categoria]);

  // Soma o total
  const total = valores.reduce((acc, valor) => acc + valor, 0);

  // Calcula as porcentagens para cada categoria
  const porcentagens = valores.map((valor) => (valor / total) * 100);

  // Cria os rótulos no formato desejado: "Categoria - R$ valor (porcentagem%)"
  const labels = categorias.map((categoria, index) => {
    return `${categoria} - R$ ${valores[index].toFixed(2)} (${porcentagens[
      index
    ].toFixed(2)}%)`;
  });

  // Dados para o gráfico de pizza
  const pieData = {
    labels: labels,
    datasets: [
      {
        data: valores,
        backgroundColor: [
          "#42A5F5",
          "#66BB6A",
          "#FFA726",
          "#FF5252",
          "#7E57C2",
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
