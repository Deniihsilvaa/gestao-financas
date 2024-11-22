import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";

// Defina a interface para os dados da conta bancária
interface Conta {
    id: number;
    banco: string;
    agencia: string;
    conta: string;
}

const TableConta = () => {
    const [contas, setContas] = useState<Conta[]>([]); // Tipagem do estado
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from("bank_account")
                    .select("*");

                if (error) {
                    throw error;
                }

                setContas(data); // Atribua os dados à variável 'contas'
                setIsLoading(false);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchData();
    }, []);
    const handleDelete = async (id: number) => {
        try {
            const { error } = await supabase
                .from("bank_account")
                .delete()
                .eq("id", id);
            
            if (error) {
                throw error;
            }
    
            // Remover a conta da lista após a exclusão
            setContas(contas.filter((conta) => conta.id !== id));
        } catch (error) {
            console.error("Erro ao excluir a conta:", error);
        }
    };
    
    return (
        <div className="responsive-table">
            <table className="table table-striped mt-3">
                <thead>
                    <tr>
                        <th scope="col">Banco</th>
                        <th scope="col">Agência</th>
                        <th scope="col">Conta</th>
                        <th scope="col">Editar</th>
                        <th scope="col">Excluir</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={5}>Carregando...</td>
                        </tr>
                    ) : (
                        contas.map((conta) => (
                            <tr key={conta.id}>
                                <td>{conta.banco}</td>
                                <td>{conta.agencia}</td>
                                <td>{conta.conta}</td>
                                <td>
                                    <button className="btn btn-primary">Editar</button>
                                </td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => handleDelete(conta.id)} >Excluir</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableConta;
