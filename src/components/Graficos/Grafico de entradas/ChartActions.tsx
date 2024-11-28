import React from 'react';
import { Button } from 'primereact/button';

const ChartActions = () => {
  // Ações que você deseja implementar, como buscar dados novamente, limpar, etc.
  const handleRefreshData = () => {
    console.log("Atualizando dados...");
    // Aqui você poderia chamar uma função do componente pai para atualizar os dados
  };

  return (
    <div>
      <Button onClick={handleRefreshData}>Atualizar Dados</Button>
      {/* Aqui você pode adicionar mais botões para outras interações */}
    </div>
  );
};

export default ChartActions;
