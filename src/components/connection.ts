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
export async function bsucaDadosMensal() {
  try {
    // Buscar dados onde tipo de registro é 'entrada' e agrupando por mês
    const { data, error } = await supabase
      .from('base_caixa')
      .select('data_registro, valor')
      .eq('tipo_registro', 'Saída');	
      
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

export const buscaDadosConsolidado = async () => {
  try {
    const { data, error } = await supabase
      .from('base_caixa')
      .select('data_registro, valor, tipo_registro')
      .in('tipo_registro', ['Entrada', 'Saída']); // Pegando tanto entrada quanto saída

    if (error) throw error;

    if (data && data.length > 0) {
      const monthsData: { [key: string]: { entradas: number, saidas: number } } = {};

      data.forEach((item: { data_registro: string, valor: number, tipo_registro: string }) => {
        const month = new Date(item.data_registro).toLocaleString('pt-BR', { month: 'long' });

        if (!monthsData[month]) {
          monthsData[month] = { entradas: 0, saidas: 0 };
        }

        if (item.tipo_registro === 'Entrada') {
          monthsData[month].entradas += item.valor;
        } else if (item.tipo_registro === 'Saída') {
          monthsData[month].saidas += item.valor;
        }
      });

      const labels = Object.keys(monthsData);
      const entradas = labels.map(label => monthsData[label].entradas);
      const saidas = labels.map(label => monthsData[label].saidas);

      return {
        labels,
        entradas,
        saidas
      };
    } else {
      return null; // Caso não haja dados
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return null;
  }
};
