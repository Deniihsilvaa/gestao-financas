export interface Conta {
    id: number;
    banco: string;
    agencia: string;
    conta: string;
  }
export interface TableContaProps {
    contas: Conta[];
    isLoading: boolean;
    handleDelete: (id: number) => void;
}

export interface FormularioContaProps {
    onClose: () => void;

    
    
}
