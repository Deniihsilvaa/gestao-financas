import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { RegistroProps } from "../types"; // Importando o tipo RegistroProps
import { formatDate } from "../../../utils/formatters";
// Definindo o componente TableCaixaBancos com tipagem adequada
const TableCaixaBancos = ({ registros }: { registros: RegistroProps[] }) => {


    return (
        <div className="grid grid-cols-1 gap-3 m-2 bg-slate-50">
            <DataTable
                scrollHeight="400px" virtualScrollerOptions={{ itemSize: 46 }}
                columnResizeMode="expand" resizableColumns showGridlines
                value={registros}
                dataKey="id" // Corrigido para usar a chave 'id'
                tableStyle={{ minWidth: "50rem" }}
                dragSelection
                scrollable
                rows={10}
                paginator
                selectionMode="single"
                emptyMessage="Nenhum registro encontrado."
                className="p-datatable-small"
            >
                <Column field="conta_bancaria" header="Conta" style={{ minWidth: "10rem" }} />
                <Column field="descricao" header="Descrição" style={{ minWidth: "10rem" }} />
                <Column field="valor" header="Valor" style={{ minWidth: "5rem" }}/>
                <Column field="data_transacao" header="Data de registros" body={rowData => formatDate(rowData.data_transacao)} style={{ minWidth: "10rem" }} />
                <Column field="tipo_registro" header="Tipo" style={{ minWidth: "10rem" }} />
                <Column field="tipo_categoria" header="Categoria" style={{ minWidth: "20rem" }} />
                <Column field="situacao" header="Situação" />
            </DataTable>
        </div>
    );
};

export default TableCaixaBancos;
