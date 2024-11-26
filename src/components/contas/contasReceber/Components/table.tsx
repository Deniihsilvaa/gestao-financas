import React, { useState, useMemo, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { BaseDataProps, ContasReceber } from "../types";
import { formatDate, formatCurrency } from "../../../../utils/formatters";
import Modal from "../../../Modal/Modal";
import FormContasReceber from "./formContasReceber";
interface TabelaContasReceberProps {
    onSave: any
}

function TabelaContasReceber( onSave: any) {
    const [registros, setRegistros] = useState<BaseDataProps[]>([]);
    const [filtro, setFiltro] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => setIsModalOpen(false);

    useEffect(() => {
        async function fetchRegistros() {
            const { data, error } = await ContasReceber.select("*").eq("tipo_registro", "Entrada").order("id", { ascending: true });
            if (error) {
                console.error("Erro ao buscar dados:", error);
            } else {
                setRegistros(data || []);
            }
        }

        fetchRegistros();
    }, []);

    const dadosTable = useMemo(() => {
        return registros.filter(
            (registro) =>
                typeof registro.descricao === "string" &&
                registro.descricao.toLowerCase().includes(filtro.toLowerCase())
        );
    }, [registros, filtro]);

    const handleEdit = (registro: BaseDataProps) => {
        console.log("Editando registro:", registro);
        // Implementar lógica de edição
    };
    const handleSubmit =   async (novoRegistro: BaseDataProps) => {
        try {
            const { error } = await ContasReceber.upsert([novoRegistro]);
            if (error) {
                console.error("Erro ao salvar registro:", error);
            } else {
                setRegistros((prev) => [...prev, novoRegistro]);
            }
            handleCloseModal();
        } catch (error) {
            console.error("Erro ao salvar registro:", error);
        }
    }
    const handleDelete = async (id?: number) => {
        if (!id) return;
        const { error } = await ContasReceber.delete().eq("id", id);
        if (error) {
            console.error("Erro ao excluir registro:", error);
        } else {
            alert("Registro excluído com sucesso!");
            setRegistros((prev) => prev.filter((registro) => registro.id !== id));
        }
    };

    return (
        <div className="container max-md:w-full">
            <DataTable
                value={dadosTable}
                filterDisplay="row"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                emptyMessage="Nenhum registro encontrado"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <Column field="descricao" header="Descrição" filter filterPlaceholder="Buscar por descrição" />
                <Column
                    field="data_vencimento"
                    header="Data de Vencimento"
                    body={(rowData) => formatDate(rowData.data_vencimento)}
                />
                <Column
                    field="valor"
                    header="Valor"
                    body={(rowData) => formatCurrency(rowData.valor)}
                />
                <Column field="observacao" header="Observação" />
                <Column
                    header="Ações"
                    body={(rowData) => (
                        <div>
                            <Button label="Editar" onClick={() => handleEdit(rowData)} />
                            <Button label="Excluir" onClick={() => handleDelete(rowData.id)} />
                        </div>
                    )}
                />
            </DataTable>
            {isModalOpen && (
                <Modal isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title="Editar Conta">
                    <FormContasReceber
                        onClose={handleCloseModal}
                        onSave={handleSubmit}

                        

                    />
                </Modal>
            )}
        </div>
    );
}

export default TabelaContasReceber;
