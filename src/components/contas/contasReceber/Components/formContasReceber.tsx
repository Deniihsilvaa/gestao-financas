import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { supabase } from "../../../../services/supabaseClient";
import { FormContasReceberProps } from "../types";

const FormContasReceber: React.FC<FormContasReceberProps> = ({
  onClose,
  onSave,
  registroParaEdicao,
}) => {
  const [descricao, setDescricao] = useState(
    registroParaEdicao?.descricao || ""
  );
  const [data_registro, setDataOriginal] = useState(
    registroParaEdicao?.data_registro || ""
  );
  const [data_vencimento, setVencimento] = useState(
    registroParaEdicao?.data_vencimento || ""
  );
  const [data_transacao, setDatacompetencia] = useState(
    registroParaEdicao?.data_transacao || new Date().toISOString()
  );
  const [situacao, setSituacao] = useState("Pendente");
  const [observacao, setObservacao] = useState(
    registroParaEdicao?.observacao || ""
  );
  const [valor, setValor] = useState(
    registroParaEdicao?.valor?.toString() || ""
  );
  const [conta_bancaria, setBancoId] = useState<string | null>(
    registroParaEdicao?.conta_bancaria || null
  );
  const [categorias, setCategorias] = useState<
    { id: number; categoria: string }[]
  >([]);
  const [tipo_categoria, setTipoCategoria] = useState<string | null>(
    registroParaEdicao?.tipo_categoria || null
  );

  const [bancos, setBancos] = useState<{ id: number; banco: string }[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    descricao: false,
    valor: false,
    data_vencimento: false,
    conta_bancaria: false,
    data_registro: false,
    data_transacao: false,
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      const { data, error } = await supabase
        .from("type_categoria")
        .select("id, categoria")
        .eq("tipo", "Entrada");

      if (error) {
        console.error("Erro ao buscar categorias:", error);
      } else {
        setCategorias(data || []);
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

    fetchBancos();
    fetchCategorias();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = {
      descricao: !descricao,
      valor: !valor,
      data_vencimento: !data_vencimento,
      conta_bancaria: !conta_bancaria,
      data_registro: !data_registro,
      data_transacao: !data_transacao,
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).includes(true)) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }
    const dados = localStorage.getItem("user");
    if (!dados) {
      throw new Error("Dados do usuário não encontrados.");
    }
    const dadoslocal = JSON.parse(dados);
    const user_id: string = dadoslocal.id;

    const novoRegistro = {
      user_id,
      descricao,
      data_registro,
      data_vencimento,
      data_transacao,
      situacao,
      observacao,
      valor: parseFloat(valor),
      conta_bancaria,
      tipo_categoria,
      tipo_registro: "Entrada",
    };
    console.log("Registro", novoRegistro);
    onSave(novoRegistro);
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
          placeholder="Descrição da entrada"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={getInputStyle("descricao")}
        />
      </div>

      <div>
        <label htmlFor="data_registro" className="form-label">
          Data Competencia *
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
          disabled
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
          value={conta_bancaria || ""}
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
          value={tipo_categoria || ""}
          onChange={(e) => setTipoCategoria(e.target.value)}
          style={getInputStyle("tipo_categoria")}
        >
          <option value="">Selecione uma Categoria</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.categoria}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3">
        <Button type="submit" className="btn btn-primary">
          {registroParaEdicao ? "Atualizar" : "Salvar"}
        </Button>
        <Button type="button" onClick={onClose} className="btn btn-secondary">
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default FormContasReceber;
