import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { RegistroProps } from "../types";
import { formatDate, formatCurrency } from "../../../utils/formatters";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";

const TableCaixaBancos = ({ registros, onDelete }: { registros: RegistroProps[]; onDelete: (id: string) => void }) => {

  const [selectedRows, setSelectedRows] = useState<RegistroProps[]>([]);
  const [expandedRows, setExpandedRows] = useState<RegistroProps[]>([]);

  // Função para lidar com a seleção das linhas
  const onRowSelect = (e: any) => {
    setSelectedRows(e.value);
  };

  // Template para o tipo de registro
  const tipoRegistroTemplate = (rowData: RegistroProps) => {
    if (rowData.tipo_registro === "Entrada") {
      return (
        <i
          className="pi pi-arrow-up"
          style={{ color: "green" }}
          aria-label="Entrada"
          title="Entrada"
        />
      );
    } else if (rowData.tipo_registro === "Saída") {
      return (
        <i
          className="pi pi-arrow-down"
          style={{ color: "red" }}
          aria-label="Saída"
          title="Saída"
        />
      );
    }
    return null;
  };

  // Template para a expansão de linhas
  const rowExpansionTemplate = (rowData: RegistroProps) => (
    <div className="p-3">
      <h5>Detalhes do Registro</h5>
      <div className="grid grid-cols-2 gap-4">
        {[
          ["Descrição", rowData.descricao || "Sem descrição"],
          ["Valor", formatCurrency(rowData.valor)],
          ["Data Transação", formatDate(rowData.data_transacao)],
          ["Categoria", rowData.tipo_categoria || "Sem categoria"],
          ["Conta Bancária", rowData.conta_bancaria || "N/A"],
          ["Observação", rowData.observacao || "Sem observações"],
          ["Situação", rowData.situacao || "N/A"],
        ].map(([label, value], index) => (
          <div key={index}>
            <strong>{String(label)}</strong>: {String(value)}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button
          className="p-button p-component p-button-danger"
          onClick={() => onDelete(rowData.id)}
        >
          <i className="pi pi-trash" style={{ marginRight: '0.5rem' }} />
          Deletar
        </button>
      </div>
    </div>
  );
  

  return (
    <div className="p-3 m-1">
      <DataTable
        scrollHeight="400px"
        scrollable
        virtualScrollerOptions={{ itemSize: 46 }}
        columnResizeMode="expand"
        sortMode="multiple"
        resizableColumns
        showGridlines
        value={registros}
        dataKey="id"
        tableStyle={{ minWidth: "50rem" }}
        paginator
        rows={10}
        selectionMode="multiple"
        selection={selectedRows}
        onSelectionChange={onRowSelect}
        emptyMessage="Nenhum registro encontrado."
        expandedRows={expandedRows} // Usa o estado `expandedRows`, que nunca é null
        onRowToggle={(e) => setExpandedRows(e.data as RegistroProps[])} // Faz a conversão para o tipo correto
        rowExpansionTemplate={rowExpansionTemplate}
        className="p-datatable-small"
      >
        <Column expander style={{ width: "3rem" }} />
        <Column field="conta_bancaria" header="Conta" />
        <Column
          field="descricao"
          header="Descrição"
          body={(rowData) => rowData.descricao || "Sem descrição"}
          style={{ minWidth: "10rem" }}
        />
        <Column
          field="valor"
          header="Valor"
          body={(rowData) => formatCurrency(rowData.valor)}
          style={{ minWidth: "10rem" }}
        />
        <Column
          field="data_transacao"
          header="Data Registro"
          body={(rowData) => formatDate(rowData.data_transacao)}
          style={{ minWidth: "10rem" }}
          sortable
        />
        <Column
          field="tipo_registro"
          header="Tipo"
          body={tipoRegistroTemplate}
          sortable
          filterField="tipo_registro"
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="situacao"
          header="Situação"
          body={(rowData) =>
            rowData.situacao === "Pendente" ? (
              <span className="text-red-500">Pendente</span>
            ) : (
              <span className="text-green-500">Concluído</span>
            )
          }
          style={{ minWidth: "10rem" }}
        />
      </DataTable>
    </div>
  );
};

export default TableCaixaBancos;
