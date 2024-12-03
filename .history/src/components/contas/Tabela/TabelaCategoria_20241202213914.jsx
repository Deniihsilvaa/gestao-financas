import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PropTypes from "prop-types";

function TabelaCategoria({ data }) {
  
  const [expandedRows, setExpandedRows] = useState(null);

  const rowExpansionTemplate = (rowData) => {
    // Garantir que 'meses' existe em rowData
    const meses = rowData.meses || {};
    return (
      <div className="p-3">
        <DataTable value={Object.entries(meses)}>
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
        body={(rowData) => {
          // Verificação para garantir que 'total' existe em rowData
          const total = rowData.total || 0;
          return `R$ ${total.toFixed(2)}`;
        }}
        style={{ textAlign: "right" }}
      />
      {data && data[0] && data[0].meses ? (
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
        ))
      ) : (
        <Column header="Nenhum dado de mês disponível" body={() => "-"} />
      )}
    </DataTable>
  );
}

// Definindo corretamente os tipos para as props
TabelaCategoria.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      tipo_categoria: PropTypes.string.isRequired,
      total: PropTypes.number,
      meses: PropTypes.objectOf(
        PropTypes.arrayOf(
          PropTypes.shape({
            descricao: PropTypes.string.isRequired,
            tipo_registro: PropTypes.string.isRequired,
            valor: PropTypes.number.isRequired,
          })
        )
      ),
    })
  ).isRequired,
};

export default TabelaCategoria;
