import React, { useEffect, useState } from "react";
import Modal from "../../Modal/Modal";
import { BaseDataProps, ContasReceber } from "./types";
import TabelaContasReceber from "../Tabela/TabelaFomsCaixa";
import FormRegistro from "./Components/formContasReceber";
import { supabase } from "../../../services/supabaseClient";

interface ContasReceberProps {
  baseData: BaseDataProps[];
}
function ContasResceber(): React.ReactElement<ContasReceberProps> {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [baseData, setBaseData] = useState<BaseDataProps[]>([]);

  const fetchBaseData = async () => {
    const { data, error } = await supabase
      .from("viewBaseCaixa")
      .select("*")
      .eq("tipo_registro", "Entrada")
      .eq("situacao", "Pendente")
      .order("data_transacao", { ascending: true });

    if (error) {
      console.error("Erro ao buscar dados da base:", error);
    } else {
      setBaseData(data || []);
    }
  };

  useEffect(() => {
    fetchBaseData();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = async (novoRegistro: BaseDataProps) => {
    try {
      const { error } = await ContasReceber.upsert([novoRegistro]);
      if (error) {
        console.error("Erro ao salvar registro:", error);
        alert("Erro ao salvar registro. Tente novamente.");
      } else {
        fetchBaseData();
        alert("Registro salvo com sucesso!");
        handleCloseModal();
      }
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
    }
  };
  const onDelete = async (id: BaseDataProps["id"]) => {
    try {
      const { error } = await supabase.from("base_caixa").delete().eq("id", id);
      if (error) throw error;
      fetchBaseData(); // Atualiza a tabela após a exclusão
    } catch (error) {
      console.error("Erro ao excluir o registro:", error);
    }
  };
  const onEdit = async (id: BaseDataProps["id"]) => {
    try {
      const { error } = await supabase
        .from("base_caixa") //tabela
        .update({ situacao: "Concluido" }) //atualiza o registro
        .eq("id", id); //busca o id

      if (error) throw error;
      alert("Registro pago com sucesso!");
      fetchBaseData();
    } catch (error) {
      console.error("Erro ao pagar o registro:", error);
    }
  };
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Conteúdo principal */}
      <main className="flex-1 p-2 ml-0 overflow-y-auto bg-gray-100 rounded-2xl">
        <h2 className="mb-4 text-lg font-semibold">Contas a Receber</h2>
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

        {/* Barra de filtros */}
        <div className="flex items-center justify-between p-4 mb-6 bg-white rounded shadow">
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={handleOpenModal}
          >
            Registrar
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-y-auto bg-white rounded shadow">
          <TabelaContasReceber
            registros={baseData}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      </main>

      {/* Barra escura no lado direito */}
      <aside className="hidden w-1/6 p-4 text-white bg-gray-800 md:block">
        <h2 className="mb-4 text-lg font-semibold">Resumo</h2>
        <p>Dados importantes:</p>
        <ul className="mt-2 ml-4 space-y-2 list-disc">
          <li>Total de contas: {baseData.length}</li>
          <li>
            Valor total: R$
            {baseData
              .reduce((acc, reg) => acc + Number(reg.valor), 0)
              .toFixed(2)}
          </li>
          <li>Próximas a vencer: {/* Lógica personalizada */}</li>
        </ul>
      </aside>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Conta"
      >
        <FormRegistro onClose={handleCloseModal} onSave={handleSubmit} />
      </Modal>
    </div>
  );
}

export default ContasResceber;
