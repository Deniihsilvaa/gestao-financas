export interface Conta {
    id: number;
    banco: string;
    agencia: string;
    conta: string;
  }
  export interface ContaType {
    id: number;             // ID único do registro
    payment_type: string;    // Tipo de pagamento (ex.: Dinheiro, Cartão, Pix)
    card_name?: string;      // Nome do cartão (opcional, apenas para Cartão)
    card_type?: string;      // Tipo do cartão (Crédito/Débito, opcional)
    bank?: string;          // Nome do banco (opcional, apenas para Pix ou Cartão)
    account?: string;       // Conta bancária (opcional, apenas para Pix ou Cartão)
    pix_key?: string;        // Chave do Pix (opcional, apenas para Pix)
  }
export interface TableContaProps {
    contas: Conta[];
    isLoading: boolean;
    handleDelete: (id: number) => void;
    handleEdit: (conta: Conta) => void;
}

export interface FormularioContaProps {
    onClose: () => void;
    

}
export interface FormularioTypePagamentoProps {
    onClose: () => void;

}