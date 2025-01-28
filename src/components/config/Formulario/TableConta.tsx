import React from "react";
import { TableContaProps } from "./type";

const TableConta: React.FC<TableContaProps> = ({
  contas,
  isLoading,
  handleDelete,
  handleEdit,
}) => {
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
                  <button className="btn btn-primary" onClick={() => handleEdit(conta)}>Editar</button>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger" onClick={() => handleDelete(conta.id)}>
                    Excluir
                  </button>
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
