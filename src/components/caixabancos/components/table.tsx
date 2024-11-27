import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { RegistroProps } from "../types"; // Importando o tipo RegistroProps
import { formatDate, formatCurrency } from "../../../utils/formatters";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
// Definindo o componente TableCaixaBancos com tipagem adequada
const TableCaixaBancos = ({ registros }: { registros: RegistroProps[] }) => {
  // Estado para armazenar a seleção das linhas
  const [selectedRows, setSelectedRows] = useState<RegistroProps[]>([]);

  // Função para lidar com a seleção das linhas
  const onRowSelect = (e: any) => {
    setSelectedRows(e.value); // Atualiza as linhas selecionadas
  };

  // Função para excluir registros selecionados
  const deleteSelected = () => {
    const idsToDelete = selectedRows.map((row) => row.id);
    // Aqui você pode implementar a lógica para deletar os registros selecionados
    console.log("Deletando registros: ", idsToDelete);
  };

  // Função para adicionar um novo registro
  const addNewRegistro = () => {
    // Implemente a lógica para adicionar um novo registro
    console.log("Adicionar novo registro");
    };
    
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
  return (
    <div className="grid grid-cols-1 gap-3 m-2 bg-slate-50">
      <div className="flex justify-between mb-2">
        <button className="p-button p-button-success" onClick={addNewRegistro}>
          Adicionar Novo Registro
        </button>
        <button
          className="p-button p-button-danger"
          onClick={deleteSelected}
          disabled={selectedRows.length === 0} // Desativa se nenhuma linha estiver selecionada
        >
          Deletar Selecionados
        </button>
      </div>

      <DataTable
        scrollHeight="400px"
        virtualScrollerOptions={{ itemSize: 46 }}
        columnResizeMode="expand"
        resizableColumns
        showGridlines
        value={registros}
        dataKey="id"
        tableStyle={{ minWidth: "50rem" }}
        dragSelection
        scrollable
        rows={10}
        paginator
        selectionMode="multiple" // Permite selecionar várias linhas
        selection={selectedRows} // Linhas selecionadas
        onSelectionChange={onRowSelect} // Atualiza a seleção
        emptyMessage="Nenhum registro encontrado."
        className="p-datatable-small"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem", textAlign: "center" }}
        />
        <Column field="conta_bancaria" header="Conta" />
        <Column field="descricao" header="Descrição" />
        <Column
          field="valor"
          header="Valor"
          style={{ minWidth: "5rem" }}
          body={(rowData) => formatCurrency(rowData.valor)}
        />
        <Column
          field="data_transacao"
          header="Data de Registros"
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
        />
        <Column field="tipo_categoria" header="Categoria" />
        <Column
          field="situacao"
          header="Situação"
          body={(rowData) =>
            rowData.situacao === "Pendente" ? (
              <i
                className="pi pi-exclamation-triangle"
                style={{ color: "red" }}
                aria-label="Pendente"
                title="Pendente"
              />
            ) : (
              <i
                className="pi pi-check"
                style={{ color: "green" }}
                aria-label="Concluido"
                title="Concluido"
              />
            )
          }
        />
      </DataTable>
    </div>
  );
};

export default TableCaixaBancos;
