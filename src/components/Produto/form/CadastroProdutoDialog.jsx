import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import PropTypes from "prop-types";

const CadastroProdutoDialog = ({ visible, onHide, onCadastrar }) => {
  // Estado único para o produto
  const [produto, setProduto] = useState({
    descricao: "",
    quantidade: 0,
    price: 0,
    familia: "",
  });

  // Função para tratar o formulário e enviar os dados
  const handleCadastrar = () => {
    onCadastrar(produto); // Passa o objeto produto inteiro
    setProduto({ descricao: "", quantidade: 0, price: 0 }); // Limpa o formulário
  };
  const tipo = [
    { name: "Pai", value: "Pai" },
    { name: "Filho", value: "Filho" },
  ];

  return (
    <Dialog
      visible={visible}
      modal
      onHide={onHide}
      header={
        <div className="flex text-white justify-content-center bg-slate-700">
          Cadastro de Produto
        </div>
      }
      footer={
        <div className="flex justify-content-end text-wrap">
          <Button label="Cancelar" icon="pi pi-times" onClick={onHide} />
          <Button
            label="Cadastrar"
            icon="pi pi-check"
            onClick={handleCadastrar}
          />
        </div>
      }
      className="bg-white w-30rem"
    >
      <div className="p-3 rounded-sm shadow-lg p-fluid">
        <div className="p-field">
          <label htmlFor="descricao">Descrição</label>
          <InputText
            id="descricao"
            name="descricao"
            value={produto.descricao}
            onChange={(e) =>
              setProduto({ ...produto, descricao: e.target.value })
            }
            required
            autoFocus
            placeholder="Digite a descrição do produto"
          />
        </div>

        <div className="p-field">
          <label htmlFor="quantidade">Quantidade</label>
          <InputNumber
            id="quantidade"
            name="quantidade"
            value={produto.quantidade}
            onValueChange={(e) =>
              setProduto({ ...produto, quantidade: e.value })
            }
            required
            min={0}
            placeholder="Digite a quantidade de produtos"
          />
        </div>

        <div className="p-field">
          <label htmlFor="price">Preço</label>
          <InputNumber
            id="price"
            name="price"
            value={produto.price}
            onValueChange={(e) => setProduto({ ...produto, price: e.value })}
            required
            min={0}
            mode="currency"
            currency="BRL"
            placeholder="Digite o preço do produto"
          />
        </div>

        <div className="p-field">
          <label htmlFor="familia">Tipo</label>
          <Dropdown
            id="familia"
            name="familia"
            value={produto.familia}
            options={tipo}
            onChange={(e) => setProduto({ ...produto, familia: e.value })}
            required
            placeholder="Selecione o tipo"
            optionLabel="name" // Usa 'name' para mostrar no Dropdown
            optionValue="value" // Usa 'value' para o valor
          />
        </div>
      </div>
    </Dialog>
  );
};

CadastroProdutoDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onCadastrar: PropTypes.func.isRequired,
};

export default CadastroProdutoDialog;
