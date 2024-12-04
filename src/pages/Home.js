// components/home/Home.js
import React from "react";

import ChartVisualization from "../components/Graficos/Grafico de entradas/ChartVisualization";
import GraficoSaidas from "../components/Graficos/Graficos de saidas/grafico_visualizacao_saida.tsx";
import GraficoConsolidado from "../components/Graficos/GraficoMensalConsolidado/grafico_consolidado";
const Home = () => {
  return (
    <div>
      <div className="p-4">
        <h2 className="p-2 text-center text-white shadow-sm">
          {" "}
          Página Inicial
        </h2>
        <div className="card w-100">
          <div className="row">
            <div className="col">
              <ChartVisualization />
            </div>
            <div className="col">
              <GraficoSaidas />
            </div>
            <div className="col">
              <GraficoConsolidado />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
