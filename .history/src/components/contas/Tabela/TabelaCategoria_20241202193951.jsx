import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function TabelaCategoria({ data }) {
  const [expandedRows, setExpandedRows] = useState(null);

  const rowExpansionTemplate = (rowData) => {
    return (
      <div className="p-3">
        <DataTable value={Object.entries(rowData.meses)} responsiveLayout="scroll">
          <Column field="0" header="Mês" />
          <Column
            header="Descrição"
            body={(row) =>
              row[1].map((item, index) => (
                <div key={index}>
                  <strong>{item.descricao}</strong> ({item.tipo_registro}): R$ {item.valor.toFixed(2)}
                </div>
              ))
            }
          />
        </DataTable>
      </div>
    );
  };

  return (
    <div>
      
    </div>
  );
}

export default TabelaCategoria;
