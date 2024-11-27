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
