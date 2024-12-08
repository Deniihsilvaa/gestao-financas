// src/components/Produto/HomeProduto.jsx
import React, { useState, useEffect } from "react";
import { Divider } from "primereact/divider";
import TabelaProdutos from "./table/TableProdutos";
import { Fieldset } from 'primereact/fieldset';
import { fetchProdutos } from "../connection";

function HomeProduto() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false); // Estado para controle de carregamento

  const carregarprodutos = async () => {
    if (produtos.length === 0 && !loading) { // Verifica se já existem produtos ou se já está carregando
      setLoading(true);
      try {
        const produtos = await fetchProdutos();
        console.log(produtos);
        setProdutos(produtos);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false); // Define o loading como false quando a requisição terminar
      }
    }
  };

  useEffect(() => {
    carregarprodutos();
  }, );

  return (
    <div className="min-h-screen p-6 space-y-8 text-white shadow-sm sbg-gray-900 text- bg-gradient-to-b from-blue-900 to-black">
      <div className="text-3xl text-center text-bold font card shadow-neutral-300">
        Produtos
      </div>
      <main className="p-4 text-black bg-white h-96 rounded-2xl">
        <Divider />
        <div className="card">
        <Fieldset legend="Cadastro de Produtos">
            <p className="p-2">
              Cadastre os produtos para realizar o controle de estoque.
            </p>
        </Fieldset>
        </div>
        <div className="card">
        <Fieldset legend="Produtos Cadastrados">
            <TabelaProdutos produtos={produtos} />
        </Fieldset>
        </div>
      </main>
    </div>
  );
}

export default HomeProduto;
