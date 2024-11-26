import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";  // Importe o cliente Supabase

function Tabela() {
    const [dados, setDados] = useState([]); // Para armazenar os dados da tabela
    const [loading, setLoading] = useState(true); // Para controlar o carregamento dos dados

    // UseEffect para buscar os dados da tabela do Supabase
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('general_data')  // Nome da tabela no Supabase
                    .select('id, dateofrecords, name, enterprise');  // Colunas que você deseja

                if (error) {
                    throw error;
                }

                setDados(data);  // Salva os dados na state
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
               
            } finally {
                setLoading(false); // Finaliza o carregamento
            }
        };

        fetchData(); // Chama a função para buscar os dados
    }, []);
const formatarData = (data) => {
    const dataObj = new Date(data);
    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataObj.getFullYear().toString();

    return `${dia}/${mes}/${ano}`;
}
    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Nome
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Data de Registro
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Empresa
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Email
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dados.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatarData(item.dateofrecords)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.enterprise}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.email}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tabela;
