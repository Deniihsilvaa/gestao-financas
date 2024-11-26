import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";

interface Conta {
  id: number;
  banco: string;
  agencia: string;
  conta: string;
}

const TableConta = () => {
  const [contas, setContas] = useState<Conta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar dados iniciais
  const fetchContas = async () => {
    try {
      const { data, error } = await supabase.from("bank_account").select("*");
      if (error) throw error;

      setContas(data || []);
      setIsLoading(false);
    } catch (error) {
      const tratarErro = JSON.stringify(error)
      console.error("Erro ao buscar dados:", tratarErro);
      if (tratarErro) {

      } 
    }
  };

  // Função para excluir conta localmente
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("bank_account").delete().eq("id", id);
      if (error) throw error;

      // Atualiza o estado local após exclusão
      setContas((prev) => prev.filter((conta) => conta.id !== id));
    } catch (error) {
      console.error("Erro ao excluir a conta:", error);
    }
  };

  // Inscreve-se em notificações em tempo real
  useEffect(() => {
    fetchContas(); // Carrega os dados iniciais

    const channel = supabase // Inscreve-se no canal
      .channel("bank-account-delete")
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "bank_account" },
        (payload) => {
          const deletedId = payload.old.id; // ID excluído
    
          // Atualiza o estado com base na exclusão recebida
          setContas((prev) => prev.filter((conta) => conta.id !== deletedId));
        }
      )
      .subscribe();

    // Limpa a inscrição no canal ao desmontar o componente
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="responsive-table">
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th scope="col">Banco</th>
            <th scope="col">Agência</th>
            <th scope="col">Conta</th>
            <th scope="col">Editar</th>
            <th scope="col">Excluir</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5}>Carregando...</td>
            </tr>
          ) : (
            contas.map((conta) => (
              <tr key={conta.id}>
                <td>{conta.banco}</td>
                <td>{conta.agencia}</td>
                <td>{conta.conta}</td>
                <td>
                  <button className="btn btn-primary">Editar</button>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(conta.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableConta;
