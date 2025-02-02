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
  const [typePG,setTypePG] = useState('')
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
    registroParaEdicao?.tipo_pagamento || ""
  );

  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  const [categorias, setCategorias] = useState<
    { id: number; categoria: string }[]
  >([]);

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    descricao: false,
    valor: false,
    data_vencimento: false,
    
    tipo_categoria: false,
    data_registro: false,
    data_transacao: false,
  });

  const fetchPaymentMethods = async () => {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("id, payment_type, card_name, pix_key, bank , account");

    if (error) {
      console.error("Erro ao buscar métodos de pagamento:", error);
    } else {
      setPaymentMethods(data || []);
    }
  };

  const fetchCategorias = async () => {
    const { data, error } = await supabase
      .from("type_categoria")
      .select("id, categoria")
      .eq("tipo", "Saída"); // Obtendo tanto entradas quanto saídas
    if (error) {
      console.error("Erro ao buscar categorias:", error);
    } else {
      setCategorias(data || []);
    }
  };
  useEffect(() => {

    fetchPaymentMethods();
    fetchCategorias();
  }, [ ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = {
      descricao: !descricao,
      valor: !valor,
      data_vencimento: !data_vencimento,
      
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
        tipo_pagamento,
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
        className="grid grid-cols-4 gap-4"
        noValidate
      >
        <div className="col-span-4">
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

        <div className="col-span-2">
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

        <div className="col-span-2">
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

        <div className="col-span-2">
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

        <div className="col-span-2">
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

        <div className="col-span-2">
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

        <div className="col-span-2">
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

        <div className="col-span-2">  
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
          </div>

          <div className="col-span-2">
            <label htmlFor="tipo_pagamento" className="form-label">
              Tipo de Pagamento *
            </label>
            <select
              id="tipo_pagamento"
              className="form-select"
              value={typePG}
              onChange={(e) => {
                const selectedMethod = paymentMethods.find(
                  (method) => method.payment_type === e.target.value
                );
                if (selectedMethod) {
                  setTipoPagamento(selectedMethod.id);
                  setTypePG(selectedMethod.payment_type)
                }
              }}
              style={getInputStyle("tipo_pagamento")}
            >
              <option value="">Selecione um tipo</option>
              {paymentMethods
                
          
                .map((method) => (
                  <option key={method.id} value={method.payment_type}>
                    {method.payment_type} 
                  </option>
                ))}
            </select>
          

          {typePG === "Cartao" && (
            <div className="col-span-2">
              <label htmlFor="cartao" className="form-label">
                Nome do Cartão *
              </label>
              <select
                id="cartao"
                className="form-select"
                value={conta_bancaria ?? ""}
                onChange={(e) => {
                  setBancoId(e.target.value)
                }}
              >
                <option value="">Selecione o Cartão</option>
                {paymentMethods
                
                  .filter((method) => method.payment_type === "Cartao")
                  .map((method) => (
                    <option key={method.id} value={method.bank}>
                      {method.card_name} 
                    </option>
                  ))}
              </select>
            </div>
          )}

          {typePG === "Pix" && (
            <div>
              <label htmlFor="pix" className="form-label">
                Chave Pix *
              </label>
              <select
                id="pix"
                className="form-select"
                value={conta_bancaria || ""}
                onChange={(e) => {
                  setBancoId(e.target.value)
                }}
              >
                <option value="">Selecione a Chave Pix</option>
                {paymentMethods
                  .filter((method) => method.payment_type === "Pix")
                  .map((method) => (
                    <option key={method.id} value={method.bank}>
                      {method.pix_key}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
          <div className="col-span-4">
          <Button type="submit" label="Salvar" icon="pi pi-check" />
        </div>
      </form>
  );
};

export default FormRegistro;
