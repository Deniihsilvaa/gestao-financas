// src/components/contas/contasReceber/types.ts
import { supabase } from "../../../services/supabaseClient";

export interface BaseDataProps {
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

export interface ContaProps extends BaseDataProps {
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
export interface Categoria {
    id: string;
    categoria: string;
}
export interface FormContasReceberProps {
    registroParaEdicao?: {
        descricao?: string;
        data_registro?: string;
        data_vencimento?: string;
        data_transacao?: string;
        situacao?: string;
        observacao?: string;
        valor?: number;
        conta_bancaria?: string;
        tipo_categoria?: string;
    };
    onSave: (registro: any) => void;
    onClose: () => void;
    registro?: ContaProps;

}

export interface Banco {
    id: string;
    banco: string;
}
export interface DeleteProps {
    id: number;
    onClose: () => void;
}

export const ContasReceber = supabase.from("base_caixa");