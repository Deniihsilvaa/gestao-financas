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
    datacompetencia: string;
}

interface TemplateRegistrosProps {
    onClose: () => void;
}

function TemplateRegistros({ onClose }: TemplateRegistrosProps) {
    const [descricao, setDescricao] = useState("");
    const [categoria, setCategoria] = useState("");
    const [valor, setValor] = useState("");
    const [vencimento, setVencimento] = useState("");
    const [bancoId, setBancoId] = useState<number | "">("");
    const [tipoCategoria, setTipoCategoria] = useState<string>("");
    const [bancos, setBancos] = useState<{ id: number; banco: string }[]>([]);
    const [categorias, setCategorias] = useState<{ id: number; categoria: string }[]>([]);
    const [datacompetencia, setdatacompetencia] = useState("");

    const [error, setError] = useState<string | null>(null);

    // Buscar bancos e categorias do Supabase
    useEffect(() => {
        const fetchBancos = async () => {
            try {
                const { data, error } = await supabase.from("bank_account").select("id, banco");
                if (error) throw error;
                setBancos(data || []);
            } catch (error) {
                console.error("Erro ao buscar bancos:", error);
            }
        };

        const fetchCategorias = async () => {
            try {
                const { data, error } = await supabase.from("type_categoria").select("id, categoria").eq("tipo", "Saída");
                if (error) throw error;
                setCategorias(data || []);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };

        fetchBancos();
        fetchCategorias();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validação básica
        if (!descricao || !categoria || !valor || !vencimento || !datacompetencia || !bancoId || !tipoCategoria) {
            setError("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const novaConta: Conta = {
                id: Date.now(),
                descricao,
                categoria,
                valor: parseFloat(valor),
                vencimento,
                datacompetencia,
                bancoId: Number(bancoId),
                tipoCategoria,
            };

            // Salvar no banco de dados (exemplo)
            const { error } = await supabase.from("contas").insert([novaConta]);
            if (error) throw error;

            alert("Conta registrada com sucesso!");
            // Resetando os campos
            setDescricao("");
            setCategoria("");
            setdatacompetencia("");
            setValor("");
            setVencimento("");
            setBancoId("");
            setTipoCategoria("");
            setError(null);
            onClose();
        } catch (error) {
            console.error("Erro ao registrar conta:", error);
            setError("Ocorreu um erro ao registrar a conta. Tente novamente.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="input-group mb-3">
                <label htmlFor="descricao" className="input-group-text">Descrição</label>
                <input
                    id="descricao"
                    type="text"
                    className="form-control"
                    placeholder="Descrição do pagamento"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />
            </div>

            <div className="input-group mb-3">
                <label htmlFor="datacompetencia" className="input-group-text">Data de Competência</label>
                <input
                    id="datacompetencia"
                    type="date"
                    className="form-control"
                    value={datacompetencia}
                    onChange={(e) => setdatacompetencia(e.target.value)}
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
                    onChange={(e) => setValor(e.target.value)}
                />
            </div>

            <div className="input-group mb-3">
                <label htmlFor="vencimento" className="input-group-text">Vencimento</label>
                <input
                    id="vencimento"
                    type="date"
                    className="form-control"
                    value={vencimento}
                    onChange={(e) => setVencimento(e.target.value)}
                />
            </div>

            <div className="input-group mb-3">
                <label htmlFor="banco" className="input-group-text">Banco</label>
                <select
                    id="banco"
                    className="form-select"
                    value={bancoId}
                    onChange={(e) => setBancoId(Number(e.target.value))}
                >
                    <option value="">Selecione o banco</option>
                    {bancos.map((banco) => (
                        <option key={banco.id} value={banco.id}>
                            {banco.banco}
                        </option>
                    ))}
                </select>
            </div>

            <div className="input-group mb-3">
                <label htmlFor="tipo_categoria" className="input-group-text">Tipo de Categoria</label>
                <select
                    id="tipo_categoria"
                    className="form-select"
                    value={tipoCategoria}
                    onChange={(e) => setTipoCategoria(e.target.value)}
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
