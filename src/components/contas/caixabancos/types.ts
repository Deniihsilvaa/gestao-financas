export interface CategoriaProps {
  categoria?: any;
}
export interface ContaProps {
  banco?: any;
}
export interface RegistroProps {
  id: string;
  descricao: string;
  situacao?: string;
  valor: number;
  tipo_registro: string;
  data_transacao: string;
  data_vencimento?: string;
  observacao?: string;
  tipo_categoria?: CategoriaProps | null;
  conta_bancaria?: ContaProps | null;
}
export interface FiltrobancosProps {
  id: string;
  banco: string;
}
interface TableCaixaBancosProps {
  registros: RegistroProps[];
  mapearSituacao: (situacao: string) => string;
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
  onSave: (registro: RegistroProps) => Promise<void>;
  registroParaEdicao?: ContaPropsEdit | null; // Opcional
}
