import React from "react";
import {ContaType} from "./type";
import {Card} from "primereact/card";
import {DataTable } from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";

interface TableContaProps {
  contas: ContaType[];                // Lista de contas/métodos de pagamento
  isLoading: boolean;             // Indica se os dados estão sendo carregados
  handleDelete: (id: number) => void; // Função para excluir um registro
}

const actionBodyTemplate = (conta: ContaType, handleDelete: (id: number) => void) => {
  return (
    <div>
      {/* <Button
        className="btn btn-primary"
        onClick={() => console.log(conta.id)}
      >
        Editar
      </Button> */}
      <Button
        className="pi pi-trash "
        severity="danger" text
        onClick={(e) => handleDelete(conta.id)}
      />
    </div>
  );
};

const TableContaFormPG: React.FC<TableContaProps> = ({ contas, isLoading, handleDelete }) => {
  return (
    <Card>
      <DataTable
       value={contas}
       columnResizeMode="expand" resizableColumns showGridlines tableStyle={{ minWidth: '50rem' }}
       >
        <Column body={(rowData) => actionBodyTemplate(rowData, handleDelete)} exportable={false} style={{ width: '1rem' }} />
        <Column field="payment_type" header="Tipo de Pagamento" />
        <Column field="card_name" header="Nome do Cartão" />
        <Column field="card_type" header="Tipo do Cartão" />
        <Column field="bank" header="Banco" />
        <Column field="account" header="Conta" />
        <Column field="pix_key" header="Chave Pix" />
      </DataTable>
    </Card>
  );
};

export default TableContaFormPG;
