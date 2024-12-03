import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { supabase } from "../../services/supabaseClient";

function Contas() {
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("viewBaseCaixa").select("*");
      if (error) {
        console.error("Erro ao buscar dados:", error);
        return;
      }

      // Organiza os dados por categoria e transforma datas em meses
      const groupedData = groupByCategoryAndMonth(data);
      setData(groupedData);
    }

    fetchData();
  }, []);

  // Função para agrupar os dados por categoria e mês
  const groupByCategoryAndMonth = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const month = new Date(item.data_transacao).toLocaleString("default", {
        month: "short",
      });
      if (!grouped[item.categoria]) {
        grouped[item.categoria] = { categoria: item.categoria, meses: {} };
      }
      if (!grouped[item.categoria].meses[month]) {
        grouped[item.categoria].meses[month] = [];
      }
      grouped[item.categoria].meses[month].push(item);
    });

    return Object.values(grouped).map((group) => ({
      ...group,
      total: Object.values(group.meses)
        .flat()
        .reduce((sum, item) => sum + item.valor, 0),
    }));
  };

  // Template para expandir linhas
  const rowExpansionTemplate = (rowData) => {
    return (
      <div className="p-3">
        <DataTable
          value={Object.entries(rowData.meses)}
          responsiveLayout="scroll"
        >
          <Column field="0" header="Mês" />
          <Column
            header="Descrição"
            body={(row) =>
              row[1].map((item, index) => (
                <div key={index}>
                  <strong>{item.descricao}</strong> ({item.tipo_registro}): R${" "}
                  {item.valor.toFixed(2)}
                </div>
              ))
            }
          />
        </DataTable>
      </div>
    );
  };

  return (
    <div className="card w-50">
      <div className="datatable-expand-demo">
        <h3>Contas por Categoria</h3>
        <DataTable
          value={data}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          responsiveLayout="scroll"
        >
          <Column expander style={{ width: "3em" }} />
          <Column field="tipo_categoria" header="Categoria" />
          <Column
            header="Total"
            body={(rowData) => `R$ ${rowData.total.toFixed(2)}`}
            style={{ textAlign: "right" }}
          />
          {/* Colunas dinâmicas para meses */}
          {data[0] &&
            Object.keys(data[0].meses).map((month) => (
              <Column
                key={month}
                header={month}
                body={(rowData) =>
                  rowData.meses[month]
                    ? rowData.meses[month]
                        .reduce((sum, item) => sum + item.valor, 0)
                        .toFixed(2)
                    : "-"
                }
                style={{ textAlign: "right" }}
              />
            ))}
        </DataTable>
      </div>
    </div>
  );
}

export default Contas;
