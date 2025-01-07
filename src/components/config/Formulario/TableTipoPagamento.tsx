import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";

interface TipoPagamento {
  id: number;
  tipo_pagamento: string;
}

interface TableTipoPagamentoProps {
  tiposPagamentos: TipoPagamento[];
  isLoading: boolean;
  handleDelete: (id: number) => Promise<void>;
}


const TableTipoPagamentos: React.FC<TableTipoPagamentoProps> = ({
  tiposPagamentos,
  isLoading,
  handleDelete,
}) => {
  const [selectedRows, setSelectedRows] = useState<TipoPagamento[]>([]);

  const onRowSelect = (e: { value: TipoPagamento[] }) => {
    setSelectedRows(e.value);
  };

  return (
    <div className="p-3 m-1">
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <DataTable
          scrollHeight="400px"
          scrollable
          virtualScrollerOptions={{ itemSize: 46 }}
          columnResizeMode="expand"
          sortMode="multiple"
          resizableColumns
          showGridlines
          value={tiposPagamentos}
          dataKey="id"
          tableStyle={{ minWidth: "50rem" }}
          paginator
          rows={10}
          selectionMode="multiple"
          selection={selectedRows}
          onSelectionChange={onRowSelect}
          emptyMessage="Nenhum tipo de pagamento encontrado."
          className="p-datatable-small"
        >
          <Column field="id" header="ID" />
          <Column field="tipo_pagamento" header="Tipo de Pagamento" />
          <Column
            body={(rowData: TipoPagamento) => (
              <Button
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => handleDelete(rowData.id)}
              />
            )}
            header="Ações"
          />
        </DataTable>
      )}
    </div>
  );
};

export default TableTipoPagamentos;
