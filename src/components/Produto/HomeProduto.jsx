// src/components/Produto/HomeProduto.jsx
import React, { useState, useEffect } from "react";
import { Divider } from "primereact/divider";
import TabelaProdutos from "./table/TableProdutos";
import { Fieldset } from "primereact/fieldset";
import { fetchProdutos,CadastroProduto } from "../connection";
import { Button } from "primereact/button";
import CadastroProdutoDialog from "./form/CadastroProdutoDialog";

function HomeProduto() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false); // Estado para controle de carregamento
  const [dialogVisible, setDialogVisible] = useState(false);



  
  const carregarprodutos = async () => {
    try {
      setLoading(true);
      const produtos = await fetchProdutos();

  
      setProdutos(produtos); 
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    carregarprodutos();
  }, []); 
  
  // Função que é chamada quando o produto é cadastrado
  const cadastrarProduto = async (produto) => {
    try {
      await CadastroProduto(produto);
      setProdutos([...produtos, produto]);
      setDialogVisible(false);
      alert("Produto cadastrado com sucesso!");
    } catch (error) {
        alert("Erro ao cadastrar produto. Tente novamente.");
      console.error("Erro ao cadastrar produto:", error);
    }
  }


  return (
    <div className="min-h-screen p-6 space-y-8 text-white shadow-sm sbg-gray-900 text- bg-gradient-to-b from-blue-900 to-black">
      <div className="text-3xl text-center text-bold font card shadow-neutral-300">
        Produtos
      </div>
      {loading ? (
        <div className="text-3xl text-center text-bold font card shadow-neutral-300">
          Carregando...
        </div>
      ) : (
        <main className="h-full p-4 text-black bg-white rounded-2xl">
        <Divider />
        <div className="card">
          <Fieldset legend="Cadastro de Produtos">
            <div className="flex space-x-4">
              <Button
                label="Cadastrar Produto"
                icon="pi pi-plus"
                onClick={() => setDialogVisible(true)} // Abre o dialog
              />

              <CadastroProdutoDialog
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)} // Fecha o dialog
                onCadastrar={cadastrarProduto} // Passa a função de cadastro
              />

              <Button
                label="Listar"
                icon="pi pi-list"
                onClick={() => carregarprodutos()}
              ></Button>
            </div>
          </Fieldset>
        </div>
        <div className="h-full p-2 card">
          <Fieldset legend="Produtos Cadastrados">
            <TabelaProdutos produtos={produtos} />
          </Fieldset>
        </div>
      </main>
      )}

    </div>
  );
}

export default HomeProduto;
