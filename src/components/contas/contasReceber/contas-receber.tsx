import React,{useEffect, useState} from "react";
import Modal from "../../Modal/Modal";
import { supabase } from "../../../services/supabaseClient";
import { BaseDataProps,ContasReceber } from './types';
import TabelaContasReceber from "./Components/table";
import FormRegistro from "./Components/formContasReceber";

function ContasResceber() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [baseData, setBaseData] = useState<BaseDataProps[]>([]);

    useEffect(() => {
        const fetchBaseData = async () => {
            const { data: baseData, error } = await supabase.from('base').select('*');
            if (error) {
                console.error('Erro ao buscar dados da base:', error);
            } else {
                setBaseData(baseData || []);
            }
        };
        fetchBaseData();
    }, []);
    const handleOpenModal = () => {
        setIsModalOpen(true);
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = async (novoRegistro: BaseDataProps) => {
    console.log('dados Salvo',novoRegistro)
    try {
      const { error } = await ContasReceber.upsert([novoRegistro]);
      if (error) {
        console.error('Erro ao salvar registro:', error);
      } else {
        setBaseData((prev) => [...prev, novoRegistro]);
      }
      alert('Registro salvo com sucesso!');
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
    }
  }

  const fetchRegistros = async () => {
    try {
      const { data: registros, error } = await ContasReceber.select('*');
      if (error) {
        console.error('Erro ao buscar registros:', error);
      } else {
        setBaseData(registros || []);
      }
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
    }
  }
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
                  Contas a Receber
                </span>
              </li>
            </ol>
          </nav>
  
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Contas a Receber
          </h2>
  
          {/* Barra de filtros */}
          <div className="flex items-center justify-between bg-white p-4 rounded shadow mb-6">

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleOpenModal}
            >
              Registrar
            </button>
          </div>
  
          {/* Tabela */}
          <div className="overflow-y-auto bg-white shadow rounded">
            <TabelaContasReceber
            onSave={baseData}
            />
          </div>
          
        </main>
  
        {/* Barra escura no lado direito */}
        <aside className="w-1/6 bg-gray-800 text-white p-4">
          <h2 className="text-lg font-semibold mb-4">Resumo</h2>
          <p>Dados importantes:</p>
          <ul className="list-disc ml-4 mt-2 space-y-2">
            <li>Total de contas: {baseData.length}</li>
            <li>
              Valor total: R$
              {baseData.reduce((acc, reg) => acc + Number(reg.valor), 0).toFixed(2)}
            </li>
            <li>Próximas a vencer: {/* Lógica personalizada */}</li>
          </ul>
        </aside>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Registrar Conta"
        >
          <FormRegistro
            onClose={handleCloseModal}
            onSave={handleSubmit}
          />
        </Modal>
        
      </div>
    )
}

export default ContasResceber;