import { Theme } from "@table-library/react-table-library/types/theme";

export interface RegistroProps {
  id: number;
  descricao: string;
  data: string;
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
  value: number;
  
  
}
export interface TableRegistroProps {
  registros: RegistroProps[]; // Registros recebidos como prop
}
export interface ContaProps {
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
  onClose: () => void;
  onSave: () => void;
}