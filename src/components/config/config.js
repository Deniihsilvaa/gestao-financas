import React from "react";
import "./config.css";
import Formulario from './Formulario/form'
import Tabela from './Tables/tabela'
function Config() {


  return (
    <div className="container">
      <div className="cardRegistro">
        <h2 className="car-title">Registrar Dados Gerais</h2>
        <Formulario />
        <Tabela />
      </div>
    </div>
  );
}

export default Config;
