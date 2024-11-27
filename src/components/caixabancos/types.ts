export interface TipoCategoria {
  categoria: string;
}

export interface ContaBancaria {
  banco: string;
}

export interface RegistroProps {
  id: number;                // ID do registro
  descricao: string;         // Nome do registro
  valor: string | number;    // Valor do registro, pode ser número ou string
  tipo_registro: 'Entrada' | 'Saída'; // Tipo do registro
  data_transacao: string;    // Data da transação
  tipo_categoria: TipoCategoria[];    // Categoria do registro (como 'Entrada' ou 'Saída')
  situacao?: string;         // Situação (opcional)
  conta_bancaria?: ContaBancaria[];  // Conta bancária (opcional)
  data_vencimento?: string;  // Data de vencimento (opcional)
  observacao?: string;       // Observação (opcional)
  totalConta?: number;       // Total da conta (opcional)
}
