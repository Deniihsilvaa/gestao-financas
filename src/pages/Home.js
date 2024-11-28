// components/home/Home.js
import React from 'react';

import ChartVisualization from '../components/Graficos/Grafico de vendas/ChartVisualization';
const Home = () => {
  return (
<div>
    <div className="container mx-auto p-4">
      <h2 className='text-black'> Página Inicial</h2>
      <div className='card'>
      </div>

        <ChartVisualization />

    </div>
    </div>
  );
};

export default Home;
