
// AnaliseTypes.ts

export interface Bank {
  value: number;
  label: string;
}

export interface Movement {
  description: string;
  date: string;
  situacao: 'Entrada' | 'Saída';
  paymentType: string;
  movementType: string;
  paymentMethod: string;
  bank: string;
  value: string; // Use string porque envolve moeda
  supplier: string;
}

export type Nullable<T> = T | null;


