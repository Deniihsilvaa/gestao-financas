// src/components/connection.ts
import { supabase } from "../services/supabaseClient"; // Importa o cliente Supabase

// Função para buscar dados de entradas mensais
export async function fetchEntriesPerMonth() {
  try {
    // Buscar dados onde tipo de registro é 'entrada' e agrupando por mês
    const { data, error } = await supabase
      .from('base_caixa')
      .select('data_registro, valor')
      .eq('tipo_registro', 'Entrada');
      
    if (error) throw error;

    if (data && data.length > 0) {
      // Agrupar os dados por mês
      const monthsData: { [key: string]: number } = {};

      data.forEach((item: { data_registro: string; valor: number }) => {
        const month = new Date(item.data_registro).toLocaleString('pt-BR', { month: 'long' });
        if (!monthsData[month]) {
          monthsData[month] = 0;
        }
        monthsData[month] += item.valor;
      });
      // Preparar os dados para o gráfico
      const labels = Object.keys(monthsData);
      const values = Object.values(monthsData);

      return { labels, values }; // Retorna os dados agrupados
    } else {
      return null; // Caso não tenha dados
    }
  } catch (error) {
    console.error('Erro ao buscar dados do Supabase:', error);
    return null;
  }
}
