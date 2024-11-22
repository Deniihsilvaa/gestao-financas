import React, { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";

interface Conta {
    id: number;
    descricao: string;
    categoria: string;
    valor: number;
    vencimento: string;
    bancoId: number;
    tipoCategoria: string;
    datacompetencia: string; // Alterando para datacompetencia
}


interface TemplateRegistrosProps {
    onClose: () => void;
}

function TemplateRegistros({ onClose }: TemplateRegistrosProps) {
    const [descricao, setDescricao] = useState("");
    const [categoria, setCategoria] = useState("");
    const [valor, setValor] = useState("");
    const [vencimento, setVencimento] = useState("");
    const [bancoId, setBancoId] = useState<number | "">(""); // Estado para armazenar o ID do banco
    const [tipoCategoria, setTipoCategoria] = useState<string>(""); // Estado para armazenar o tipo de categoria
    const [bancos, setBancos] = useState<{ id: number; banco: string }[]>([]); // Estado para os bancos
    const [categorias, setCategorias] = useState<{ id: number; categoria: string }[]>([]); // Estado para as categorias
    const [datacompetencia, setdatacompetencia] = useState("");

    // Buscar bancos do Supabase
    useEffect(() => {
        const fetchBancos = async () => {
            try {
                const { data, error } = await supabase.from("bank_account").select("id, banco");

                if (error) {
                    throw error;
                }

                setBancos(data);
            } catch (error) {
                console.error("Erro ao buscar bancos:", error);
            }
        };

        const fetchCategorias = async () => {
            try {
                // Aqui estamos buscando as categorias onde o tipo é "Saída"
                const { data, error } = await supabase
                    .from("type_categoria")
                    .select("id, categoria")
                    .eq("tipo", "Saída"); // Filtra por "Saída"

                if (error) {
                    throw error;
                }

                setCategorias(data);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };

        fetchBancos();
        fetchCategorias();
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const novaConta: Conta = {
            id: Date.now(),
            descricao,
            categoria,
            valor: parseFloat(valor),
            vencimento,
            datacompetencia, // Usando datacompetencia corretamente
            bancoId: Number(bancoId),
            tipoCategoria, // Incluindo tipoCategoria no objeto
        };
    
        alert("Conta registrada com sucesso!");
        setDescricao("");
        setCategoria("");
        setdatacompetencia(""); // Limpar datacompetencia
        setValor("");
        setVencimento("");
        setBancoId(""); // Limpar bancoId
        setTipoCategoria(""); // Limpar tipoCategoria
        onClose();
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
                <label htmlFor="descricao" className="input-group-text">Descrição</label>
                <input
                    id="descricao"
                    type="text"
                    className="form-control"
                    placeholder="Descrição do pagamento"
                    value={descricao}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescricao(e.target.value)}
                />
            </div>
            <div className="input-group mb-3">
                <label htmlFor="data_competencia" className="input-group-text">Data de compentencia</label>
                <input
                    id="data_competencia"
                    type="date"
                    className="form-control"
                    value={datacompetencia}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setdatacompetencia(e.target.value)}
                />
            </div>
            <div className="input-group mb-3">
                <label htmlFor="valor" className="input-group-text">Valor</label>
                <input
                    id="valor"
                    type="number"
                    className="form-control"
                    placeholder="Digite o valor"
                    value={valor}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValor(e.target.value)}
                />
            </div>

            <div className="input-group mb-3">
                <label htmlFor="vencimento" className="input-group-text">Vencimento</label>
                <input
                    id="vencimento"
                    type="date"
                    className="form-control"
                    value={vencimento}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVencimento(e.target.value)}
                />
            </div>

            {/* Select para o banco */}
            <div className="input-group mb-3">
                <label htmlFor="banco" className="input-group-text">Banco</label>
                <select
                    id="banco"
                    className="form-select"
                    value={bancoId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBancoId(Number(e.target.value))}
                >
                    <option value="">Selecione o banco</option>
                    {bancos.map((banco) => (
                        <option key={banco.id} value={banco.id}>
                            {banco.banco}
                        </option>
                    ))}
                </select>
            </div>

            {/* Select para a categoria de tipo (Saída) */}
            <div className="input-group mb-3">
                <label htmlFor="tipo_categoria" className="input-group-text">Tipo de Categoria</label>
                <select
                    id="tipo_categoria"
                    className="form-select"
                    value={tipoCategoria}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTipoCategoria(e.target.value)}
                >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.categoria}>
                            {categoria.categoria}
                        </option>
                    ))}
                </select>
            </div>

            <div className="d-flex justify-content-end mt-4">
                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                    Registrar
                </button>
            </div>
        </form>
    );
}

export default TemplateRegistros;
