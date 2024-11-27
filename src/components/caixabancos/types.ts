export interface RegistroProps {
    id: number;                // ID do registro (pode ser um número ou string, dependendo do banco de dados)
    descricao: string;              // Nome do registro
    valor: string | number;    // Valor do registro, pode ser número ou string, dependendo do formato dos dados
    tipo_registro: 'Entrada' | 'Saída'; // Tipo do registro
    data_transacao: string;    // Data da transação (usando string aqui, mas pode ser Date se for manipulado como objeto Date)
    tipo_categoria: string;         // Categoria do registro, como 'Entrada' ou 'Saída'
    situacao?: string;       // Data de vencimento (opcional)
    conta_bancaria?: string;        // Descrição (opcional)
    data_vencimento?: string;        // Descrição (opcional)
    observacao?: string;        // Descrição (opcional)
    totalConta?: number; // Total da conta
  }