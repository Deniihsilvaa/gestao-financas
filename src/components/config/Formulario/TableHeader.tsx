import React from "react";

const TableHeader: React.FC = () => (
    <thead>
        <tr>
            <th scope="col">Banco</th>
            <th scope="col">Agência</th>
            <th scope="col">Conta</th>
            <th scope="col">Editar</th>
            <th scope="col">Excluir</th>
        </tr>
    </thead>
);

export default TableHeader;
