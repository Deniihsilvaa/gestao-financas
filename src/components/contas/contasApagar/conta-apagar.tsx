import React, { useState, useEffect } from "react";
import Modal from "../../Modal/Modal";
import FormRegistro from "./components/Formregistro";

import { supabase } from "../../../services/supabaseClient";
import TableRegistro from "../Tabela/TabelaFomsCaixa";

import { RegistroProps } from "./types";

function ContasApagar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registros, setRegistros] = useState<RegistroProps[]>([]);

  // Função para buscar os registros da tabela base_caixa
  const fetchRegistros = async () => {
    const { data, error } = await supabase
      .from("viewBaseCaixa")
      .select("*")
      .eq("tipo_registro", "Saída")
      .eq("situacao", "Pendente")
      .order("data_transacao", { ascending: true });

    if (error) {
      console.error("Erro ao buscar registros:", error);
    } else {
      setRegistros(data || []);
    }
  };

  // Efeito para buscar os registros na montagem do componente
  useEffect(() => {
    fetchRegistros(); // Inicializa os registros na montagem do componente
  }, []);

  // Função para abrir o modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Função de salvar e atualizar registros
  const handleSave = async (novoRegistro: RegistroProps) => {
    alert("Registro salvo com sucesso!");
    const { error } = await supabase.from("base_caixa").upsert([novoRegistro]);

    if (error) {
      console.error("Erro ao salvar registro:", error);
    } else {
      fetchRegistros(); 
      alert("Registro salvo com sucesso!");
    }
    handleCloseModal(); // Fecha o modal após salvar
  };
  const onDelete = async (id: RegistroProps["id"]) => {
    try {
      const { error } = await supabase.from("base_caixa").delete().eq("id", id);
      if (error) throw error;
      fetchRegistros(); // Atualiza a tabela após a exclusão
    } catch (error) {
      console.error("Erro ao excluir o registro:", error);
    }
  };
  const onEdit = async (id: RegistroProps["id"]) => {
    if (!id) {
      console.error("ID inválido. Não é possível editar o registro.");
      alert("Erro: ID inválido.");
      return;
    }

    console.log("Editando registro ", id);

    try {
      const { error } = await supabase
        .from("base_caixa") // tabela
        .update({ situacao: "Concluido" }) // atualiza o registro
        .eq("id", id); // busca o id

      if (error) {
        console.error("Erro ao pagar o registro:", error.message);
        alert("Erro ao pagar o registro. Tente novamente.");
        return;
      }

      alert("Registro pago com sucesso!");
      fetchRegistros(); // Atualiza os registros
    } catch (error) {
      console.error("Erro ao pagar o registro:", error);
      alert(
        "Erro inesperado ao pagar o registro. Verifique o console para mais detalhes."
      );
    }
  };

  return (
<div className="container mx-auto p-1 md:p-10">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-screen">
    {/* Conteúdo principal */}
    <main className="col-span-1 md:col-span-2 ">
      <h2 className="mb-4 text-lg font-semibold text-white">Contas a Pagar</h2>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center mb-6 text-sm text-gray-400"
      >
        <a href="/" className="hover:text-white">
          Home
        </a>
        <span className="mx-2">/</span>
        <a href="/contas" className="hover:text-white">
          Contas
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-500">Contas a Pagar</span>
      </nav>

      {/* Barra de filtros */}
      <div className="flex flex-col items-center justify-between gap-4 p-4 mb-6 bg-white rounded-lg shadow md:flex-row">
        <input
          type="text"
          placeholder="Pesquisar por nome ou categoria..."
          className="flex-1 px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600">
            Filtrar
          </button>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600"
          >
            Registrar
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <TableRegistro
          registros={registros} // os registros que vêm do seu Supabase
          onDelete={onDelete} // sua função para deletar registros
          onEdit={onEdit} // aqui passamos a função corretamente
        />
      </div>
    </main>

    {/* Barra lateral enconstar no canto direito */}
    <aside className="hidden md:block text-white bg-gray-800 p-4 rounded-lg col-span-1 mt-4 ">
      <h2 className="mb-4 text-lg font-bold">Resumo</h2>
      <ul className="space-y-2">
        <li>
          <span className="font-medium">Total de contas:</span> {registros.length}
        </li>
        <li>
          <span className="font-medium">Valor total:</span> R$
          {registros
            .reduce((acc, reg) => acc + Number(reg.valor), 0)
            .toFixed(2)}
        </li>
        <li>
          <span className="font-medium">Próximas a vencer:</span>{" "}
          {/* Lógica personalizada */}
        </li>
      </ul>
    </aside>
  </div>

  {/* Modal */}
  <Modal
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    title="Registrar Conta a Pagar"
  >
    <FormRegistro
      onClose={handleCloseModal}
      registro={null}
      onSave={handleSave}
    />
  </Modal>
</div>

  );
}

export default ContasApagar;
