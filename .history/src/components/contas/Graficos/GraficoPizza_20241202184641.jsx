import React from "react";
import { Chart } from "primereact/chart";
import PropTypes from 'prop-types'

function GraficoPizza({ data }) {
  const pieData = {
    labels: data.map((item) => item.tipo_categoria),
    datasets: [
      {
        data: data.map((item) => item.valor),
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#FF5252", "#7E57C2"],
      },
    ],
  };

  return (
    <>
      <Chart type="pie" data={pieData} />
    </>
  );
}

export default GraficoPizza;

GraficoPizza.prototype = {
  data: PropTypes.an
}