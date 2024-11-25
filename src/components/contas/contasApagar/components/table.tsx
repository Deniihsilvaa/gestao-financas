import React, { useState, useEffect, useRef } from "react";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import RowExpansionTemplate from "./RowExpansionTemplate";
import SearchBar from "./SearchBar";
import "./table.css";
import { Registro, TableRegistroProps } from "../types";

const TableRegistro: React.FC<TableRegistroProps> = ({ registros }) => {
  // Estados para controle de expansão e carregamento dos dados
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | undefined>(undefined);
  const [carregar, setCarregar] = useState<boolean>(false); // Controle do estado de carregamento
  const [search, setSearch] = useState<string>(""); // Texto de busca
  const [dadosFiltrados, setDadosFiltrados] = useState<Registro[]>(registros); // Dados exibidos na tabela
  const toast = useRef<Toast>(null);

  // Atualiza os dados filtrados quando os registros ou a busca mudam
  useEffect(() => {
    if (search.trim() === "") {
      setDadosFiltrados(registros); // Retorna todos os registros se a busca estiver vazia
      setCarregar(false); // Desativa o estado de carregamento
    } else {
      const filtrados = registros.filter((registro) =>
        typeof registro.descricao === "string" &&
        registro.descricao.toLowerCase().includes(search.toLowerCase()) // Filtra pela descrição
      );
      setDadosFiltrados(filtrados);
      setCarregar(true); // Ativa o estado de carregamento com os dados filtrados
    }
  }, [search, registros]); // Dependência para recarregar os dados quando registros ou a busca mudarem

  // Função de quando uma linha é expandida
  const onRowExpand = (event: any) => {
    toast.current?.show({
      severity: "info",
      summary: "Linha expandida",
      detail: event.data.descricao,
      life: 3000,
    });
  };

  // Função de quando uma linha é recolhida
  const onRowCollapse = (event: any) => {
    toast.current?.show({
      severity: "success",
      summary: "Linha recolhida",
      detail: event.data.descricao,
      life: 3000,
    });
  };

  return (
    <div className="container max-md:w-full">
      <Toast ref={toast} />

      {/* Barra de pesquisa */}
      <SearchBar search={search} setSearch={setSearch} />
      <button
        onClick={() => setCarregar(true)} // Atualiza o estado para refletir os dados filtrados
        style={{ margin: "10px 0", padding: "8px 12px", cursor: "pointer" }}
      >
        Buscar
      </button>

      {/* Tabela */}
      <DataTable
        value={carregar ? dadosFiltrados : registros} // Exibe os dados filtrados ou todos
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data as DataTableExpandedRows)} // Garantir que o tipo de expandedRows é DataTableExpandedRows
        onRowExpand={onRowExpand}
        onRowCollapse={onRowCollapse}
        rowExpansionTemplate={(data: Registro) => ( // Definir o tipo de data explicitamente como Registro
          <RowExpansionTemplate
            data={data}
            onDelete={(id) => {
              // Atualiza os dados filtrados após exclusão
              setDadosFiltrados((prev) => prev.filter((registro) => registro.id !== id));

              // Se a busca estiver ativa, a exclusão também deve ser filtrada
              if (search.trim() !== "") {
                const filtrados = dadosFiltrados.filter((registro) =>
                  registro.descricao.toLowerCase().includes(search.toLowerCase())
                );
                setDadosFiltrados(filtrados);
              }
            }}
          />
        )}
        dataKey="id"
        paginator
        rows={10}
      >
        <Column expander style={{ width: "3em" }} />
        <Column field="descricao" header="Descrição" sortable />
        <Column field="data_transacao" header="Data" sortable />
        <Column field="valor" header="Valor" sortable />
        <Column field="situacao" header="Status" sortable />
      </DataTable>
    </div>
  );
};

export default TableRegistro;
