// src/components/contas/contasApagar/components/FormRegistro.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../../../services/supabaseClient";

import {
  RegistroProps,
  ContaPropsEdit,
  TemplateRegistrosProps,
} from "../types";

import { Button } from "primereact/button";

const FormRegistro: React.FC<TemplateRegistrosProps> = ({
  onClose,
  onSave,
  registroParaEdicao, // Prop opcional para edição
}) => {
  const [descricao, setDescricao] = useState(
    registroParaEdicao?.descricao || ""
  );
  const [situacao, setSituacao] = useState(
    registroParaEdicao?.situacao || "Pendente"
  );
  const [valor, setValor] = useState(
    registroParaEdicao?.valor?.toString() || ""
  );
  const [data_vencimento, setVencimento] = useState(
    registroParaEdicao?.data_vencimento || ""
  );
  const [data_registro, setDataOriginal] = useState(
    registroParaEdicao?.data_registro || ""
  );
  const [conta_bancaria, setBancoId] = useState<string | null>(
    registroParaEdicao?.conta_bancaria || null
  );
  const [tipo_categoria, setTipoCategoria] = useState<string | null>(
    registroParaEdicao?.tipo_categoria || null
  );
  const [data_transacao, setDatacompetencia] = useState(
    registroParaEdicao?.data_transacao || ""
  );
  const [observacao, setObservacao] = useState(
    registroParaEdicao?.observacao || ""
  );
  const [tipo_pagamento, setTipoPagamento] = useState<string>(
    registroParaEdicao?.tipo_pagamento || "Dinheiro"
  );

  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  const [bancos, setBancos] = useState<{ id: number; banco: string }[]>([]);
  const [categorias, setCategorias] = useState<
    { id: number; categoria: string }[]
  >([]);

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    descricao: false,
    valor: false,
    data_vencimento: false,
    conta_bancaria: false,
    tipo_categoria: false,
    data_registro: false,
    data_transacao: false,
  });
    
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("id, paymentType, cardName, pixKey");
      if (error) {
        console.error("Erro ao buscar métodos de pagamento:", error);
      } else {
        setPaymentMethods(data || []);
      }
    };
    const fetchBancos = async () => {
      const { data, error } = await supabase
        .from("bank_account")
        .select("id, banco");
      if (error) {
        console.error("Erro ao buscar bancos:", error);
      } else {
        setBancos(data || []);
      }
    };

    const fetchCategorias = async () => {
      const { data, error } = await supabase
        .from("type_categoria")
        .select("id, categoria")
        .in("tipo", ["Entrada", "Saída"]); // Obtendo tanto entradas quanto saídas
      if (error) {
        console.error("Erro ao buscar categorias:", error);
      } else {
        setCategorias(data || []);
      }
    };

    fetchPaymentMethods();
    fetchBancos();
    fetchCategorias();
  }, []);



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = {
      descricao: !descricao,
      valor: !valor,
      data_vencimento: !data_vencimento,
      conta_bancaria: !conta_bancaria,
      tipo_categoria: !tipo_categoria,
      data_registro: !data_registro,
      data_transacao: !data_transacao,
    };

    // Atualiza o estado dos erros
    setErrors(validationErrors);

    if (Object.values(validationErrors).includes(true)) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const dadoslocal = localStorage.getItem("user");
      if (!dadoslocal) {
        throw new Error("Dados do usuário não encontrados.");
      }

      const dados = JSON.parse(dadoslocal);
      const user_id: string = dados.id;

      const registro: RegistroProps | null = {
        user_id,
        descricao,
        valor: parseFloat(valor),
        tipo_registro: tipo_categoria === "Entrada" ? "Entrada" : "Saída", // Define o tipo baseado na categoria
        data_transacao,
        tipo_categoria: tipo_categoria as string,
        situacao,
        data_registro,
        conta_bancaria: conta_bancaria as string,
        data_vencimento,
        observacao,
      };

      if (registroParaEdicao) {
        // Atualiza o registro existente
        const updatedRegistro: ContaPropsEdit = {
          ...registro,
          id: registroParaEdicao.id,
        };

        // Chama a função onSave com o objeto editado
        onSave(updatedRegistro);

        const { error } = await supabase
          .from("base_caixa")
          .update(updatedRegistro)
          .eq("id", registroParaEdicao.id);

        if (error) {
          alert("Erro ao atualizar registro: " + error.message);
          return;
        }
        alert("Registro atualizado com sucesso!");
      } else {
        // Insere novo registro
        onSave(registro);
      }

      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar registro:", error.message);
      alert("Erro ao salvar registro: " + error.message);
    }
  };

  const getInputStyle = (field: string) => {
    return errors[field] ? { borderColor: "red" } : {};
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1rem",
        width: "98%",
      }}
    >
      <div>
        <label htmlFor="descricao" className="form-label">
          Descrição *
        </label>
        <input
          id="descricao"
          type="text"
          className="form-control"
          placeholder="Descrição do pagamento"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={getInputStyle("descricao")}
        />
      </div>

      <div>
        <label htmlFor="data_registro" className="form-label">
          Data competência *
        </label>
        <input
          id="data_registro"
          type="date"
          className="form-control"
          value={data_registro}
          onChange={(e) => setDataOriginal(e.target.value)}
          style={getInputStyle("data_registro")}
        />
      </div>

      <div>
        <label htmlFor="data_vencimento" className="form-label">
          Vencimento *
        </label>
        <input
          id="data_vencimento"
          type="date"
          className="form-control"
          value={data_vencimento}
          onChange={(e) => setVencimento(e.target.value)}
          style={getInputStyle("data_vencimento")}
        />
      </div>

      <div>
        <label htmlFor="data_transacao" className="form-label">
          Data da emissão *
        </label>
        <input
          id="data_transacao"
          type="date"
          className="form-control"
          value={data_transacao}
          onChange={(e) => setDatacompetencia(e.target.value)}
          style={getInputStyle("data_transacao")}
        />
      </div>

      <div>
        <label htmlFor="situacao" className="form-label">
          Situação
        </label>
        <select
          id="situacao"
          className="form-select"
          value={situacao}
          onChange={(e) => setSituacao(e.target.value)}
        >
          <option value="Pendente">Pendente</option>
        </select>
      </div>

      <div>
        <label htmlFor="observacao" className="form-label">
          Observação
        </label>
        <textarea
          id="observacao"
          className="form-control"
          placeholder="Adicione uma observação"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
        ></textarea>
      </div>

      <div>
        <label htmlFor="valor" className="form-label">
          Valor *
        </label>
        <input
          id="valor"
          type="number"
          className="form-control"
          placeholder="Digite o valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          style={getInputStyle("valor")}
        />
      </div>

      <div>
        <label htmlFor="banco" className="form-label">
          Banco *
        </label>
        <select
          id="banco"
          className="form-select"
          value={conta_bancaria ?? ""}
          onChange={(e) => setBancoId(e.target.value)}
          style={getInputStyle("conta_bancaria")}
        >
          <option value="">Selecione o Banco</option>
          {bancos.map((banco) => (
            <option key={banco.id} value={banco.id}>
              {banco.banco}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tipo_categoria" className="form-label">
          Categoria *
        </label>
        <select
          id="tipo_categoria"
          className="form-select"
          value={tipo_categoria ?? ""}
          onChange={(e) => setTipoCategoria(e.target.value)}
          style={getInputStyle("tipo_categoria")}
        >
          <option value="">Selecione a Categoria</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.categoria}
            </option>
          ))}
        </select>
        <div>
        <label htmlFor="tipo_pagamento" className="form-label">
          Tipo de Pagamento *
        </label>
        <select
          id="tipo_pagamento"
          className="form-select"
          value={tipo_pagamento}
          onChange={(e) => setTipoPagamento(e.target.value)}
          style={getInputStyle("tipo_pagamento")}
        >
          <option value="3">Dinheiro</option>
          <option value="2">Cartão</option>
          <option value="4">Pix</option>
        </select>
      </div>

      {tipo_pagamento === "Cartão" && (
        <div>
          <label htmlFor="cartao" className="form-label">
            Nome do Cartão *
          </label>
          <select
            id="cartao"
            className="form-select"
            value={conta_bancaria ?? ""}
            onChange={(e) => setBancoId(e.target.value)}
            style={getInputStyle("conta_bancaria")}
          >
            <option value="">Selecione o Cartão</option>
            {paymentMethods
              .filter((method) => method.paymentType === "Cartão")
              .map((method) => (
                <option key={method.id} value={method.id}>
                  {method.cardName}
                </option>
              ))}
          </select>
        </div>
      )}

      {tipo_pagamento === "Pix" && (
        <div>
          <label htmlFor="pix" className="form-label">
            Chave Pix *
          </label>
          <select
            id="pix"
            className="form-select"
            value={conta_bancaria ?? ""}
            onChange={(e) => setBancoId(e.target.value)}
            style={getInputStyle("conta_bancaria")}
          >
            <option value="">Selecione a Chave Pix</option>
            {paymentMethods
              .filter((method) => method.paymentType === "Pix")
              .map((method) => (
                <option key={method.id} value={method.id}>
                  {method.pixKey}
                </option>
              ))}
          </select>
        </div>
      )}
      </div>

      <div style={{ gridColumn: "span 2" }}>
        <Button type="submit" label="Salvar" icon="pi pi-check" />
      </div>
    </form>
  );
};

export default FormRegistro;
