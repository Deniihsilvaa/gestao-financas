import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PropTypes from "prop-types""
"
function TabelaCategoria({ data }) {
  const [expandedRows, setExpandedRows] = useState(null);

  const rowExpansionTemplate = (rowData) => {
    return (
      <div className="p-3">
        <DataTable
          value={Object.entries(rowData.meses)}
        >
          <Column field="0" header="Mês" />
          <Column
            header="Descrição"
            body={(row) =>
              row[1].map((item, index) => (
                <div key={index}>
                  <strong>{item.descricao}</strong> ({item.tipo_registro}): R${" "}
                  {item.valor.toFixed(2)}
                </div>
              ))
            }
          />
        </DataTable>
      </div>
    );
  };

  return (
    <DataTable
      value={data}
      expandedRows={expandedRows}
      onRowToggle={(e) => setExpandedRows(e.data)}
      rowExpansionTemplate={rowExpansionTemplate}
      style={{ maxWidth: "25vw" }}
    >
      <Column expander style={{ width: "3em" }} />
      <Column field="tipo_categoria" header="Tipo de Categoria" />
      <Column
        header="Total"
        body={(rowData) => `R$ ${rowData.total.toFixed(2)}`}
        style={{ textAlign: "right" }}
      />
      {data[0] &&
        Object.keys(data[0].meses).map((month) => (
          <Column
            key={month}
            header={month}
            body={(rowData) =>
              rowData.meses[month]
                ? rowData.meses[month]
                    .reduce((sum, item) => sum + item.valor, 0)
                    .toFixed(2)
                : "-"
            }
            style={{ textAlign: "right" }}
          />
        ))}
    </DataTable>
  );
}


export default TabelaCategoria;
TabelaCategoria