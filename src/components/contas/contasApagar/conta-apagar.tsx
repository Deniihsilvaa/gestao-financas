import React, { useState, useEffect } from "react";
import Modal from "../../Modal/Modal"; 
import FormRegistro from "./components/Formregistro"; 
import { supabase } from "../../../services/supabaseClient";
import TableRegistro from "./components/table";
import {RegistroProps} from "./types";



function ContasApagar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registros, setRegistros] = useState<RegistroProps[]>([]);

  const fetchRegistros = async () => {
    const { data, error } = await supabase
      .from("base_caixa")
      .select("*")
      .eq("tipo_registro", "Saída")
      .order("data_transacao", { ascending: true });
  
    if (error) {
      console.error("Erro ao buscar registros:", error);
    } else {
      setRegistros(data || []);
    }
  };
  
  

  useEffect(() => {
    fetchRegistros(); // Inicializa os registros na montagem do componente
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen">
      {/* Conteúdo principal */}
      <main className="flex-1 bg-gray-100 p-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center space-x-4">
            <li>
              <a href="/" className="text-sm font-medium text-gray-900">
                Home
              </a>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li>
              <a href="/contas" className="text-sm font-medium text-gray-900">
                Contas
              </a>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li>
              <span className="text-sm font-medium text-gray-500">
                Contas a Pagar
              </span>
            </li>
          </ol>
        </nav>
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Contas a Pagar
        </h2>
        {/* Barra de filtros */}
        <div className="flex items-center justify-between bg-white p-4 rounded shadow mb-6">
          <input
            type="text"
            placeholder="Pesquisar por nome ou categoria..."
            className="border border-gray-300 rounded px-4 py-2 w-1/2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Filtrar
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleOpenModal}
          >
            Registrar
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-y-auto bg-white shadow rounded">
          <TableRegistro registros={registros} />
        </div>
      </main>

      {/* Barra escura no lado direito */}
      <aside className="w-1/6 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-semibold mb-4">Resumo</h2>
        <p>Dados importantes:</p>
        <ul className="list-disc ml-4 mt-2 space-y-2">
          <li>Total de contas: {registros.length}</li>
          <li>
            Valor total: R$
            {registros.reduce((acc, reg) => acc + Number(reg.valor), 0).toFixed(2)}
          </li>
          <li>Próximas a vencer: {/* Lógica personalizada */}
            
          </li>
        </ul>
      </aside>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Registrar Conta a Pagar"
      >
        <FormRegistro
          onClose={handleCloseModal}
          onSave={() => {
            fetchRegistros(); // Atualiza a tabela após salvar
          }}
        />
      </Modal>
    </div>
  );
}

export default ContasApagar;
