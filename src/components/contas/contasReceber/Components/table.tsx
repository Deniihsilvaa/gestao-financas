import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { BaseDataProps, DeleteProps } from "../types";
import { formatDate, formatCurrency } from "../../../../utils/formatters";
import Modal from "../../../Modal/Modal";
import FormContasReceber from "./formContasReceber";

interface TabelaContasReceberProps {
  baseData: BaseDataProps[];
  onDelete: (data: DeleteProps) => Promise<void>;
}
function TabelaContasReceber({ baseData, onDelete }: TabelaContasReceberProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => setIsModalOpen(false);

  const handleEdit = (registro: BaseDataProps) => {
    console.log("Editando registro:", registro);
  };
  const handleSubmit = async (novoRegistro: BaseDataProps) => {
    console.log("dados Salvo");
    // Lógica para salvar ou editar o registro (no caso de edição, você pode atualizar na tabela)
  };

  return (
    <div className="p-3 m-1">
      <DataTable
        value={baseData}
        filterDisplay="row"
        paginator
        rows={10}
        tableStyle={{ minWidth: "40rem" }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        emptyMessage="Nenhum registro encontrado"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      >
        <Column
          field="descricao"
          header="Descrição"
          filter
          filterPlaceholder="Buscar por descrição"
        />
        <Column
          field="data_vencimento"
          header="Data de Vencimento"
          body={(rowData) => formatDate(rowData.data_vencimento)}
        />
        <Column
          field="valor"
          header="Valor"
          body={(rowData) => formatCurrency(rowData.valor)}
        />
        <Column field="observacao" header="Observação" />
        <Column
          header="Ações"
          style={{ minWidth: "12rem" }}
          body={(rowData) => (
            <div className="grid grid-cols-3 gap-2">
              <Button
                label="Editar"
                onClick={() => handleEdit(rowData)}
                className="bg-gradient-to-r from-teal-100 to-blue-200 hover:from-pink-100 hover:to-indigo-400 ..."
              />
              <Button
                label="Excluir"
                onClick={() => onDelete(rowData.id)} // Chamada da função recebida do componente pai
                className="bg-gradient-to-r from-teal-100 to-blue-200 hover:from-pink-100 hover:to-rose-800 ..."
              />
            </div>
          )}
        />
      </DataTable>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Editar Conta"
        >
          <FormContasReceber onClose={handleCloseModal} onSave={handleSubmit} />
        </Modal>
      )}
    </div>
  );
}

export default TabelaContasReceber;
