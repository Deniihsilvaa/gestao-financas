import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PropTypes from "prop-types";

function TabelaCategoria({ data }) {
  const [expandedRows, setExpandedRows] = useState(null);

  const rowExpansionTemplate = (rowData) => {
    return (
      <div className="p-3">
        <div>
          <strong>Descrição:</strong> {rowData.descricao}
        </div>
        <div>
          <strong>Data da Transação:</strong> {rowData.data_transacao}
        </div>
        <div>
          <strong>Tipo de Registro:</strong> {rowData.tipo_registro}
        </div>
        <div>
          <strong>Conta Bancária:</strong> {rowData.conta_bancaria}
        </div>
        <div>
          <strong>Situação:</strong> {rowData.situacao}
        </div>
      </div>
    );
  };

  return (
    <DataTable
      value={data}
      expandedRows={expandedRows}
      onRowToggle={(e) => setExpandedRows(e.data)}
      rowExpansionTemplate={rowExpansionTemplate}
    >
      <Column expander style={{ width: "3em" }} />
      <Column field="tipo_categoria" header="Tipo de Categoria" />
      <Column field="descricao" header="Descrição" />
      <Column field="data_transacao" header="Data de Transação" />
      <Column field="tipo_registro" header="Tipo de Registro" />
      <Column field="conta_bancaria" header="Conta Bancária" />
      <Column field="situacao" header="Situação" />
    </DataTable>
  );
}

// Definindo corretamente os tipos para as props
TabelaCategoria.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      conta_bancaria: PropTypes.string.isRequired,
      data_transacao: PropTypes.string.isRequired,
      descricao: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      situacao: PropTypes.string.isRequired,
      tipo_categoria: PropTypes.string.isRequired,
      tipo_registro: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TabelaCategoria;
