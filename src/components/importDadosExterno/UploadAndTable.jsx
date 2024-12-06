import React, { useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import * as XLSX from "xlsx";

const UploadAndTable = () => {
  const [tableData, setTableData] = useState([]); // Dados da tabela
  const documentId = "2365"; // ID prefixado para o documento

  // Função para processar o arquivo Excel
  const processExcelFile = async (file) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      // Adiciona o ID do documento a cada linha
      const formattedRows = rows.map((row) => ({
        ...row,
        DocumentID: documentId,
      }));

      console.log("Dados do Excel processados:", formattedRows); // Exibe os dados processados no console
      setTableData(formattedRows); // Atualiza o estado com os dados carregados
    } catch (error) {
      console.error("Erro ao processar o arquivo:", error);
    }
  };

  // Função chamada ao enviar o arquivo
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      processExcelFile(file);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8 text-white bg-gray-900 shadow-sm rounded-2xl bg-gradient-to-b from-blue-900 to-black">
      {/* Botão de Upload */}
      <div className="flex flex-col items-center space-y-4">
        <label htmlFor="file-upload" className="text-lg font-semibold">
          Enviar Arquivo Excel
        </label>
        <input
          type="file"
          id="file-upload"
          accept=".xls,.xlsx"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          label="Escolher Arquivo"
          icon="pi pi-upload"
          className="p-button-success"
          onClick={() => document.getElementById("file-upload").click()}
        />
      </div>

      {/* Tabela */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">Dados Processados</h2>
        <DataTable
          value={tableData}
          paginator
          size="small"
          rows={10} // Limita a visualização para 10 itens por página
          className="rounded-lg shadow-md"
          responsiveLayout="scroll"
        >
          {/* Defina as colunas da tabela */}
          <Column field="DocumentID" header="ID do Documento" />
          <Column field="Nome Prod" header="Nome do Produto" />
          <Column field="Tipo Prod" header="Tipo do Produto" />
          <Column field="Cat. Prod." header="Categoria" />
          <Column field="Valor Prod" header="Valor" />
          <Column field="Cod. Ped." header="Código do Pedido" />
          <Column field="Núm. Mesa/Com." header="Mesa" />
          <Column field="Data Ab. Ped." header="Abertura" />
          <Column field="Data Fec. Ped." header="Fechamento" />
          <Column field="Tipo Ped." header="Tipo Pedido" />
          <Column field="Stat. Ped." header="Status" />
        </DataTable>
      </div>
    </div>
  );
};

export default UploadAndTable;
