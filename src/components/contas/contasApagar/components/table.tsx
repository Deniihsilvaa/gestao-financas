// src/components/Table/TableRegistro.tsx
import React, { useState, useMemo, useRef } from "react";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import RowExpansionTemplate from "./RowExpansionTemplate";
import SearchBar from "./SearchBar";
import FormRegistro from "./Formregistro";
import Modal from "../../../Modal/Modal";
import { RegistroProps, TableRegistroProps } from "../types";
import { formatCurrency } from "../../../../utils/formatters";
import {formatDate} from "../../../../utils/formatters";
const TableRegistro = ({ registros, onDelete }: TableRegistroProps) => {

  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | undefined
  >(undefined);
  const [search, setSearch] = useState<string>("");
  const [registroSelecionado, setRegistroSelecionado] =
    useState<RegistroProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useRef<Toast>(null);

  // Filtro dos dados com useMemo para evitar cálculos desnecessários
  const dadosFiltrados = useMemo(() => {
    if (!search.trim()) return registros;
    return registros.filter(
      (registro) =>
        typeof registro.descricao === "string" &&
        registro.descricao.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, registros]);

  // Função para abrir o modal em modo de edição ou criação
  const handleEdit = (registro: RegistroProps | null) => {
    setRegistroSelecionado(registro);
    setIsModalOpen(true);
  };

  // Fechar o modal
  const handleCloseModal = () => setIsModalOpen(false);

  // Salvar ou editar o registro
  const handleSave = (novoRegistro: RegistroProps) => {
    toast.current?.show({
      severity: registroSelecionado ? "success" : "info",
      summary: registroSelecionado
        ? "Registro atualizado"
        : "Novo registro criado",
      detail: `"${novoRegistro.descricao}" foi ${
        registroSelecionado ? "atualizado" : "criado"
      }.`,
      life: 3000,
    });
    handleCloseModal();
  };
  const handleDelete = (id: RegistroProps["id"]) => {
    console.log("ID a ser excluído:", id);
    onDelete(id); 
    toast.current?.show({
      severity: "warn",
      summary: "Registro excluído",
      detail: `O registro foi excluído.`,
      life: 3000,
    });
  }

  return (
    <div className="container max-md:w-full">
      <Toast ref={toast} />

      {/* Barra de pesquisa */}
      <SearchBar search={search} setSearch={setSearch} />

      {/* Tabela */}
      <DataTable
        value={dadosFiltrados}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data as DataTableExpandedRows)}
        rowExpansionTemplate={(data: RegistroProps) => (
          <RowExpansionTemplate data={data} />
        )}
        dataKey="id"
        paginator
        rows={10}
        tableStyle={{ minWidth: "40rem" }}
      >
        <Column expander style={{ width: "3em" }} />
        <Column field="descricao" header="Descrição" sortable />
        <Column field="data_transacao" header="Data" sortable body={(rowData) => formatDate(rowData.data_transacao)} />
        <Column
          field="valor"
          header="Valor"
          body={(rowData) => formatCurrency(rowData.valor)}
          sortable
        />
        <Column
          body={(rowData: RegistroProps) => (
            <Button
              label="Editar"
              onClick={() => handleEdit(rowData)}
              className="bg-gradient-to-r from-teal-100 to-blue-200 hover:from-pink-100 hover:to-indigo-400 ..."
            />
          )}
          header="Ações"
        
        />
        <Column
          
          body={(rowData: RegistroProps) => (
            <Button
              label="Excluir"
              onClick={() => handleDelete(rowData.id)}
              className="bg-gradient-to-r from-teal-100 to-blue-200 hover:from-pink-100 hover:to-rose-800 ..."
            />
          )}
          header="Ações"

        />
      </DataTable>

      {/* Modal e Formulário */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={registroSelecionado ? "Editar Registro" : "Novo Registro"}
        >
          <FormRegistro
            registro={registroSelecionado}
            onClose={handleCloseModal}
            onSave={handleSave}
          />
        </Modal>
      )}
    </div>
  );
};

export default TableRegistro;
