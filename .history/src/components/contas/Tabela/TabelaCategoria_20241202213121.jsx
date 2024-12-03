import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function TabelaCategoria({ data }) {
  const [expandedRows, setExpandedRows] = useState(null);

  const rowExpansionTemplate = (rowData) => {
    const meses = rowData.meses || {};  // Garantir que meses seja um objeto, mesmo se estiver vazio
    return (
      <div className="p-3">
        <DataTable
          value={Object.entries(meses)}  {/* Verificação para meses */}
          responsiveLayout="scroll"
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

  const calculateTotal = (rowData) => {
    // Calcular o total antes da renderização
    return rowData.total ? rowData.total.toFixed(2) : "-";
  };

  const calculateMonthlyTotal = (rowData, month) => {
    if (rowData.meses && rowData.meses[month]) {
      return rowData.meses[month].reduce((sum, item) => sum + item.valor, 0).toFixed(2);
    }
    return "-";
  };

  return (
    <DataTable
      value={data || []}  {/* Verificação para garantir que data não seja undefined */}
      expandedRows={expandedRows}
      onRowToggle={(e) => setExpandedRows(e.data)}
      rowExpansionTemplate={rowExpansionTemplate}
      style={{ maxWidth: "25vw" }}
    >
      <Column expander style={{ width: "3em" }} />
      <Column field="tipo_categoria" header="Tipo de Categoria" />
      <Column
        header="Total"
        body={calculateTotal}  {/* Usando função para calcular o total */}
        style={{ textAlign: "right" }}
      />
      {data && data[0] && data[0].meses && Object.keys(data[0].meses).length > 0 ? (
        Object.keys(data[0].meses).map((month) => (
          <Column
            key={month}
            header={month}
            body={(rowData) => calculateMonthlyTotal(rowData, month)}  {/* Usando função para calcular o total mensal */}
            style={{ textAlign: "right" }}
          />
        ))
      ) : (
        <Column
          header="Nenhum dado de mês disponível"
          body={() => "-"}
        />
      )}
    </DataTable>
  );
}

export default TabelaCategoria;
