import React, { useState, useEffect, useRef } from "react";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import RowExpansionTemplate from "./RowExpansionTemplate";
import SearchBar from "./SearchBar";
import "./table.css";
import { RegistroProps, TableRegistroProps } from "../types";

const TableRegistro: React.FC<TableRegistroProps> = ({ registros }) => {
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | undefined>(undefined);
  const [search, setSearch] = useState<string>(""); // Texto de busca
  const [dadosFiltrados, setDadosFiltrados] = useState<RegistroProps[]>(registros); // Dados exibidos na tabela
  const toast = useRef<Toast>(null);

  // Atualiza os dados filtrados quando os registros ou a busca mudam
  useEffect(() => {
    if (search.trim() === "") {
      setDadosFiltrados(registros); // Exibe todos os registros se não houver busca
    } else {
      const filtrados = registros.filter((registro) =>
        typeof registro.descricao === "string" &&
        registro.descricao.toLowerCase().includes(search.toLowerCase()) // Filtra pela descrição
      );
      setDadosFiltrados(filtrados);
    }
  }, [search, registros]);

  const onRowExpand = (event: any) => {
    toast.current?.show({
      severity: "info",
      summary: "Linha expandida",
      detail: event.data.descricao,
      life: 3000,
    });
  };

  const onRowCollapse = (event: any) => {
    toast.current?.show({
      severity: "success",
      summary: "Linha recolhida",
      detail: event.data.descricao,
      life: 3000,
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const priceBodyTemplate = (registro: RegistroProps) => {
    return formatCurrency(registro.valor);
  };

  return (
    <div className="container max-md:w-full">
      <Toast ref={toast} />

      {/* Barra de pesquisa */}
      <SearchBar search={search} setSearch={setSearch} />

      {/* Tabela */}
      <DataTable
        value={dadosFiltrados} // Exibe os dados filtrados ou todos
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data as DataTableExpandedRows)} // Garantir que o tipo de expandedRows é DataTableExpandedRows
        onRowExpand={onRowExpand}
        onRowCollapse={onRowCollapse}
        rowExpansionTemplate={(data: RegistroProps) => (
          <RowExpansionTemplate
            data={data}
            onDelete={(id) => {
              // Atualiza os dados após exclusão
              const novosDados = dadosFiltrados.filter((registro) => registro.id !== id);
              setDadosFiltrados(novosDados);

              toast.current?.show({
                severity: "warn",
                summary: "Registro excluído",
                detail: `Registro "${data.descricao}" foi removido.`,
                life: 3000,
              });
            }}
          />
        )}
        dataKey="id"
        paginator
        rows={10}
        tableStyle={{ minWidth: "40rem" }}
      >
        <Column expander style={{ width: "3em" }} />
        <Column field="descricao" header="Descrição" sortable />
        <Column field="data_transacao" header="Data" sortable />
        <Column field="valor" header="Valor" body={priceBodyTemplate} sortable />
        <Column field="situacao" header="Status" sortable />
      </DataTable>
    </div>
  );
};

export default TableRegistro;
