export interface Transaction {
    id: string;
    type: 'Entrada' | 'Saída';
    category: string;
    paymentMethod: string;
    date: string;
    amount: number;
    previousBalance: number;
    currentBalance: number;
  }
  
  export interface FinancialSummary {
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
    monthlyChange: string;
  }