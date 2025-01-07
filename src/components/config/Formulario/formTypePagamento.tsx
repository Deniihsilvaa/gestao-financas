import React, { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";
import { FormularioTypePagamentoProps } from "./type";
import TableTipoPagamento from "./TableTipoPagamento";
import {InputText} from "primereact/inputtext";
const FormularioTypePagamentos: React.FC<FormularioTypePagamentoProps> = ({
  onClose,
}) => {
  const [tipoPagamento, setTipoPagamento] = useState<string>("");
  const [tiposPagamentos, setTiposPagamentos] = useState<any[]>([
    "PIX",
    "Dinheiro",
    "Cartão de Crédito",
    "Cartão de Débito",
    "TED",
    "Transferência Bancária",
    "Boleto",
  ]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Tipo de pagamento:", tipoPagamento);
    if (!tipoPagamento) {
      alert("Por favor, selecione um tipo de pagamento.");
      return;
    }

    try {
      const dadoslocal = localStorage.getItem("user");
      if (!dadoslocal) {
        throw new Error("Dados do usuário não encontrados.");
      }

      const user_id = JSON.parse(dadoslocal).id;

      const { error } = await supabase
        .from("payment_type")
        .insert([{ tipo_pagamento: tipoPagamento, user_id }]);

      if (error) {
        alert("Erro ao registrar tipo de pagamento. Tente novamente.");
      } else {
        alert("Tipo de pagamento registrado com sucesso!");
        fetchTiposPagamentos(); // Atualiza a tabela
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("Erro inesperado. Tente novamente.");
    }
  };

  const fetchTiposPagamentos = async () => {
    try {
      const { data, error } = await supabase.from("payment_type").select("*");
      if (error) throw error;

      setTiposPagamentos(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar tipos de pagamento:", error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from("payment_type")
        .delete()
        .eq("id", id);
      if (error) throw error;
      alert("Tipo de pagamento excluído com sucesso!");
      fetchTiposPagamentos();
    } catch (error) {
      alert("Erro ao excluir o tipo de pagamento. Tente novamente.");
    }
  };

  useEffect(() => {
    fetchTiposPagamentos();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-body">
          <div className="mt-3 row">
            <div className="mb-3 input-group">
              <span className="input-group-text">Tipo de Pagamento</span>
              <InputText placeholder="Username" />
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

          <div className="mt-3 row">
            <TableTipoPagamento
              tiposPagamentos={tiposPagamentos}
              isLoading={isLoading}
              handleDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormularioTypePagamentos;
