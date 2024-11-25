import React, { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface Conta {
    id: number;
    banco: string;
    agencia: string;
    conta: string;
}

interface TableRowProps {
    conta: Conta;
    onDelete: (id: number) => void;
}

const TableRow: React.FC<TableRowProps> = ({ conta, onDelete }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleConfirmDelete = () => {
        onDelete(conta.id);
        setModalOpen(false);
    };

    return (
        <>
            <tr>
                <td>{conta.banco}</td>
                <td>{conta.agencia}</td>
                <td>{conta.conta}</td>
                <td>
                    <button className="btn btn-primary">Editar</button>
                </td>
                <td>
                    <button
                        className="btn btn-danger"
                        onClick={() => setModalOpen(true)}
                    >
                        Excluir
                    </button>
                </td>
            </tr>
            {isModalOpen && (
                <DeleteConfirmationModal
                    onClose={() => setModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </>
    );
};

export default TableRow;
