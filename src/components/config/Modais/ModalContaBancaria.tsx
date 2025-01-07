import React, { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";
import TableConta from "../Formulario/TableConta";
import { Conta, FormularioContaProps } from "../Formulario/type";

const ModalContaBancaria: React.FC<FormularioContaProps> = ({ onClose }) => {
  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [contas, setContas] = useState<Conta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("banco:", banco, "agencia:", agencia, "conta:", conta);
    if (!banco || !agencia || !conta) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const dadoslocal = localStorage.getItem("user");
      if (!dadoslocal) {
        throw new Error("Dados do usuário não encontrados.");
      }

      const user_id = JSON.parse(dadoslocal).id;

      const { error } = await supabase
        .from("bank_account")
        .insert([{ banco, agencia, conta, user_id }]);

      if (error) {
        alert("Erro ao registrar conta. Tente novamente.");
      } else {
        alert("Conta registrada com sucesso!");
        fetchContas(); // Atualiza a tabela
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("Erro inesperado. Tente novamente.");
    }
  };

  const fetchContas = async () => {
    try {
      const { data, error } = await supabase.from("bank_account").select("*");
      if (error) throw error;

      setContas(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar contas bancárias:", error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log("ID pra excluir:", id);
      const { error } = await supabase
        .from("bank_account")
        .delete()
        .eq("id", id);
      if (error) throw error;
      alert("Conta excluida com sucesso!");
      fetchContas();
    } catch (error) {
      // Verifica se o erro é um objeto e possui a propriedade "code"
      if (error && typeof error === "object" && "code" in error) {
        const err = error as {
          code: string;
          message: string;
          details?: string;
        };

        // Verifica se o código do erro é "23503"
        if (err.code === "23503") {
          alert(
            "Não é possível excluir uma conta bancária que contém dados vinculados."
          );
        } else {
          alert("Erro ao excluir a conta bancária. Tente novamente.");
        }
      } else {
        alert("Ocorreu um erro inesperado. Tente novamente.");
      }
    }
  };

  useEffect(() => {
    fetchContas();
  }, []);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            <div className="mt-3 row">
              <div className="mb-3 input-group">
                <span className="input-group-text">Banco</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Digite o nome do banco"
                  value={banco}
                  onChange={(e) => setBanco(e.target.value)}
                />
              </div>
              <div className="mb-3 input-group">
                <span className="input-group-text">Agência</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Digite o número da agência"
                  value={agencia}
                  onChange={(e) => setAgencia(e.target.value)}
                />
              </div>
              <div className="mb-3 input-group">
                <span className="input-group-text">Conta</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Digite o número da conta"
                  value={conta}
                  onChange={(e) => setConta(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="mt-3 row">
        <TableConta
          contas={contas}
          isLoading={isLoading}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ModalContaBancaria;
