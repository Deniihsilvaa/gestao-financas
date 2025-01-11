// AnaliseService.ts
import { supabase } from "../../../services/supabaseClient";
import { Bank } from './AnaliseTypes';

export const buscarBancos = async (): Promise<Bank[]> => {
  const { data, error } = await supabase.from('bank_account').select('*');
  if (error) {
    console.error('Erro ao buscar bancos:', error);
    throw error;
  }
  return data || [];
};
export const buscarDados= async (): Promise<Bank[]> => {
  const { data, error } = await supabase.from('viewBaseCaixa').select('*');
  if (error) {
    console.error('Erro ao buscar bancos:', error);
    throw error;
  }
  return data || [];
};
