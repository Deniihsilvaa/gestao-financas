export interface RegistroProps {
  id?: number;
  descricao: string;
  valor: number;
  situacao: string;
  observacao: string;
  tipo_categoria: string;
  conta_bancaria: string;
  data_transacao: string;
  data_vencimento: string;

  data_registro: string;
  user_id: string;
  tipo_registro: string;
  
}
export interface TableRegistroProps {
  registros: RegistroProps[]; // Registros recebidos como prop
  onDelete: (id: RegistroProps["id"]) => void; // Função para deletar um registro
  onEdit: (id: RegistroProps["id"]) => void;
}


export interface ContaProps {
  id?: number; // Torna id opcional
  descricao: string;
  valor: number;
  data_vencimento: string;
  conta_bancaria: string;
  tipo_categoria: string;
  data_transacao: string;
  data_registro: string;
  situacao: string;
  observacao: string;
  user_id: string;
  tipo_registro: string;
}

export interface ContaPropsEdit {
  id?: number;
  descricao: string;
  valor: number;
  data_vencimento: string;
  conta_bancaria: string;
  tipo_categoria: string;
  data_transacao: string;
  data_registro: string;
  situacao: string;
  observacao: string;
  user_id: string;
  tipo_registro: string;
}
export interface TemplateRegistrosProps {
  registro: RegistroProps | null; // Aceita RegistroProps ou null
  onClose: () => void;
  onSave: (novoRegistro: ContaProps) => void; // Aceita um argumento
  registroParaEdicao?: ContaPropsEdit | null; // Opcional
}
