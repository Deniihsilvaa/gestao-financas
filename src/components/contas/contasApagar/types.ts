export interface Registro {
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
  registros: Registro[]; // Registros recebidos como prop
}
