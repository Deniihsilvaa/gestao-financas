// src/utils/formatters.ts

// Função para formatar valores monetários no formato BRL
export const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };
  
  // Função para formatar datas no formato dd/mm/aaaa
  export const formatDate = (date: string): string => {
    const dateObj = new Date(date);
  
    // Corrige a data levando em consideração o fuso horário
    const adjustedDate = new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60 * 1000);
  
    const day = String(adjustedDate.getDate()).padStart(2, "0");
    const month = String(adjustedDate.getMonth() + 1).padStart(2, "0");
    const year = adjustedDate.getFullYear();
  
    return `${day}/${month}/${year}`;
  };
  
  
  // Função para formatar valores numéricos com casas decimais
  export const formatNumber = (value: number, decimals = 2): string => {
    return value.toFixed(decimals).replace(".", ",");
  };
 
  
  // Função para formatar como porcentagem
  export const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };
  
  // Função para formatar status (ex: ativo / inativo)
// Função para formatar status (ex: Ativo / Inativo)
export const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

  
  
  