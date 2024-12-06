// src/components/contas/Tabela/tabelaUpdate.tsx
import React, { useState, useMemo, useRef } from "react";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import RowExpansionTemplate from "./RowExpansionTemplate";
import SearchBar from "../contasApagar/components/SearchBar";
import FormRegistro from "../contasApagar/components/Formregistro";
import Modal from "../../Modal/Modal";
import { RegistroProps, TableRegistroProps } from "../contasApagar/types";
import { formatCurrency, formatDate } from "../../../utils/formatters";

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

  // Abrir o modal em modo de edição ou criação
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

  // Excluir o registro
  const handleDelete = (id: RegistroProps["id"]) => {
    onDelete(id);
    toast.current?.show({
      severity: "warn",
      summary: "Registro excluído",
      detail: `O registro foi excluído.`,
      life: 3000,
    });
  };

  // Pagar a conta
  const handlePagar = (registro: RegistroProps) => {
    toast.current?.show({
      severity: "success",
      summary: "Conta Paga",
      detail: `A conta "${registro.descricao}" foi marcada como paga.`,
      life: 3000,
    });
  };

  // Configurar menu de ações
  const ActionMenuTemplate = (rowData: RegistroProps) => {
    const menuRef = useRef<Menu>(null); // Tipando o useRef corretamente

    const items = [
      {
        label: "Editar",
        icon: "pi pi-pencil",
        command: () => handleEdit(rowData),
      },
      {
        label: "Excluir",
        icon: "pi pi-trash",
        command: () => handleDelete(rowData.id),
      },
      {
        label: "Pagar",
        icon: "pi pi-check",
        command: () => handlePagar(rowData),
      },
    ];

    return (
      <div className="flex justify-content-center">
        <Menu model={items} popup ref={menuRef} id="popup_menu"  />
        <Button
          icon="pi pi-ellipsis-v"
          className="p-button-rounded p-button-text"
          onClick={(e) => menuRef.current?.toggle(e)}
          aria-controls="popup_menu"
          aria-haspopup
        />
      </div>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="flex justify-between mb-2">
        {/* Barra de pesquisa */}
        <SearchBar search={search} setSearch={setSearch} />
      </div>

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
        className="p-datatable-sm"
        tableStyle={{ minWidth: "40rem" }}
      >
        <Column expander style={{ width: "3em" }} />
        <Column field="descricao" header="Descrição" sortable />
        <Column
          field="data_vencimento"
          header="Vencimento"
          body={(rowData) => formatDate(rowData.data_vencimento)}
          sortable
        />
        <Column field="tipo_categoria" header="Tipo de Categoria" sortable />
        <Column
          field="valor"
          header="Valor"
          body={(rowData) => formatCurrency(rowData.valor)}
          sortable
        />
        <Column
          body={ActionMenuTemplate}
          header="Ações"
          style={{ textAlign: "center", width: "8rem" }}
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
