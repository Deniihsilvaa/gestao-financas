import React, { useState, useEffect } from "react";
import { supabase } from "../../../../services/supabaseClient";
import PropTypes from "prop-types";
import { AutoComplete } from "primereact/autocomplete";
const FormRegistroH = ({ onClose, onSave }) => {
  const [descricao, setDescricao] = useState("");
  const [situacao] = useState("Concluído");
  const [valor, setValor] = useState("");
  const [data_registro, setDataRegistro] = useState("");
  const [conta_bancaria, setBancoId] = useState(null);
  const [tipo_categoria, setTipoCategoria] = useState(null);
  const [observacao, setObservacao] = useState("");
  const [tipo_registro, setTipoRegistro] = useState("");
  const [data_transacao, setDataTransacao] = useState("");
  const [bancos, setBancos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [errors, setErrors] = useState({
    descricao: false,
    valor: false,
    data_registro: false,
    data_transacao: false,
    conta_bancaria: false,
    tipo_categoria: false,
    tipo_registro: false,
  });
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);

  // Fetch bancárias
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
  const search = (event) => {
    setItems([...Array(10).keys()].map((item) => event.query + "-" + item));
  };

  // Fetch categorias
  const fetchCategorias = async () => {
    const { data, error } = await supabase
      .from("type_categoria")
      .select("id, categoria, tipo")
      .in("tipo", ["Entrada", "Saída"]);
    if (error) {
      console.error("Erro ao buscar categorias:", error);
    } else {
      setCategorias(data || []);
    }
  };

  // Filtrar categorias por tipo de registro
  useEffect(() => {
    fetchBancos();
    fetchCategorias();
  }, []);

  useEffect(() => {
    // Filtra categorias quando o tipo de registro muda
    if (tipo_registro) {
      const categoriasFiltradas = categorias.filter(
        (categoria) => categoria.tipo === tipo_registro
      );
      setCategoriasFiltradas(categoriasFiltradas);
    }
  }, [tipo_registro, categorias]);
  const dadoslocal = localStorage.getItem("user");
  if (!dadoslocal) {
    throw new Error("Dados do usuário não encontrados.");
  }

  const dados = JSON.parse(dadoslocal);
  const user_id = dados.id;

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação
    const validationErrors = {
      descricao: !descricao,
      valor: !valor,
      data_registro: !data_registro,
      data_transacao: !data_transacao,
      conta_bancaria: !conta_bancaria, // Verifique se o id do banco foi selecionado
      tipo_categoria: !tipo_categoria, // Verifique se o id da categoria foi selecionado
      tipo_registro: !tipo_registro,
    };

    if (Object.values(validationErrors).includes(true)) {
      setErrors(validationErrors);
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    // Chama a função de onSave, caso exista
    if (onSave) {
      onSave({
        user_id,
        descricao,
        situacao,
        valor,
        tipo_registro,
        data_registro,
        conta_bancaria, // Passa o ID do banco
        tipo_categoria, // Passa o ID da categoria
        observacao,
        data_transacao,
      });
    }

    onClose();
  };

  // Obter estilo para destacar os campos obrigatórios
  const getInputStyle = (field) => {
    return errors[field] ? { borderColor: "red" } : {};
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 mt-4 gap-2 md:grid-cols-4 "
    >
      {/* Descrição */}
      <div className="field col-span-2">
        <label htmlFor="descricao">Descrição</label>
        <input
          type="text"
          id="descricao"
      value={descricao}
      onChange={(e) => setDescricao(e.target.value)}
      className="w-full p-2 border rounded"
      required
      style={getInputStyle("descricao")}
    />
  </div>

  {/* Fornecedor */}
  <div className="field col-span-2">
    <label htmlFor="fornecedor">Fornecedor *</label>
    <AutoComplete
      value={value}
      suggestions={items}
      completeMethod={search}
      disabled
      style={getInputStyle("fornecedor")}
      placeholder="Selecione um fornecedor"
      className="w-full p-2 border rounded"
      onChange={(e) => setValue(e.value)}
    />
  </div>

  {/* Valor */}
  <div className="field col-span-2">
    <label htmlFor="valor">Valor</label>
    <input
      type="number"
      id="valor"
      value={valor}
      onChange={(e) => setValor(e.target.value)}
     className="w-full p-2 border rounded"
      required
      style={getInputStyle("valor")}
    />
  </div>

  {/* Tipo de Registro */}
  <div className="field col-span-2">
    <label htmlFor="tipo_registro">Tipo</label>
    <select
      id="tipo_registro"
      value={tipo_registro}
      onChange={(e) => setTipoRegistro(e.target.value)}
      className="w-full p-2 border rounded"
      required
      style={getInputStyle("tipo_registro")}
    >
      <option value="">Selecione</option>
      <option value="Entrada">Entrada</option>
      <option value="Saída">Saída</option>
    </select>
  </div>

  {/* Banco */}
  <div className="field col-span-2">
    <label htmlFor="banco">Banco</label>
    <select
      id="banco"
      value={conta_bancaria ?? ""}
      onChange={(e) => setBancoId(Number(e.target.value))}
      className="w-full p-2 border rounded"
      required
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

  {/* Categoria */}
  <div className="field col-span-2">
    <label htmlFor="categoria">Categoria</label>
    <select
      id="categoria"
      value={tipo_categoria ?? ""}
      onChange={(e) => setTipoCategoria(Number(e.target.value))}
      className="w-full p-2 border rounded"
      disabled={!tipo_registro}
      required
      style={getInputStyle("tipo_categoria")}
    >
      <option value="">Selecione a Categoria</option>
      {categoriasFiltradas.map((categoria) => (
        <option key={categoria.id} value={categoria.id}>
          {categoria.categoria}
        </option>
      ))}
    </select>
  </div>

  {/* Data de Registro */}
  <div className="field col-span-2">
    <label htmlFor="data_registro">Data competência *</label>
    <input
      type="date"
      id="data_registro"
      value={data_registro}
      onChange={(e) => setDataRegistro(e.target.value)}
      className="w-full p-2 border rounded"
      required
      style={getInputStyle("data_registro")}
    />
  </div>

  {/* Data de Transação */}
  <div className="field col-span-2">
    <label htmlFor="data_transacao">Data Transação</label>
    <input
      type="date"
      id="data_transacao"
      value={data_transacao}
      onChange={(e) => setDataTransacao(e.target.value)}
      className="w-full p-2 border rounded"
      required
      style={getInputStyle("data_transacao")}
    />
  </div>

  {/* Observações */}
  <div className="col-span-1 md:col-span-4 field col-span-2">
    <label htmlFor="observacao">Observações</label>
    <textarea
      id="observacao"
      value={observacao}
      onChange={(e) => setObservacao(e.target.value)}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Botões */}
  <div className="flex justify-end col-span-1 md:col-span-4 space-x-2">
    <button
      type="button"
      onClick={onClose}
      className="px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded-lg hover:bg-gray-600"
    >
      Cancelar
    </button>
    <button
      type="submit"
      className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600"
    >
      Salvar
    </button>
  </div>
</form>
  );
};

FormRegistroH.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FormRegistroH;
