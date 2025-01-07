import React from "react";
import {ContaType} from "./type";

 interface TableContaProps {
  contas: ContaType[];                // Lista de contas/métodos de pagamento
  isLoading: boolean;             // Indica se os dados estão sendo carregados
  handleDelete: (id: number) => void; // Função para excluir um registro
}

const TableContaFormPG: React.FC<TableContaProps> = ({ contas, isLoading, handleDelete }) => {
  return (
    <div className="responsive-table">
      <table className="table mt-3 table-striped">
        <thead>
          <tr>
            <th scope="col">Tipo de Pagamento</th>
            <th scope="col">Nome do Cartão</th>
            <th scope="col">Tipo do Cartão</th>
            <th scope="col">Banco</th>
            <th scope="col">Conta</th>
            <th scope="col">Chave Pix</th>
            <th scope="col">Editar</th>
            <th scope="col">Excluir</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8}>Carregando...</td>
            </tr>
          ) : contas.length > 0 ? (
            contas.map((conta) => (
              <tr key={conta.id}>
                <td>{conta.payment_type}</td>
                <td>{conta.card_name || "-"}</td>
                <td>{conta.card_type || "-"}</td>
                <td>{conta.bank || "-"}</td>
                <td>{conta.account || "-"}</td>
                <td>{conta.pix_key || "-"}</td>
                <td>
                  <button className="btn btn-primary">Editar</button>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(conta.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>Nenhum método de pagamento encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableContaFormPG;
