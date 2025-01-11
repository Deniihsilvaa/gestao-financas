// AnaliseFunctions.ts
import { Movement } from './AnaliseTypes';

export const calcularTotais = (movements: Movement[], tipo: 'Entrada' | 'Saída') => {
  return movements
    .filter((m) => m.situacao === tipo)
    .reduce((acc, curr) => acc + parseFloat(curr.value.replace('R$ ', '').replace('.', '').replace(',', '.')), 0);
};

export const calcularPorBanco = (movements: Movement[], banco: string) => {
  return movements
    .filter((m) => m.bank === banco)
    .reduce((acc, curr) => {
      const valor = parseFloat(curr.value.replace('R$ ', '').replace('.', '').replace(',', '.'));
      return acc + (curr.situacao === 'Entrada' ? valor : -valor);
    }, 0);
};
export const calcularPorDinheiro = (movements: Movement[], paymentMethod: string) => {
  return movements
    .filter((m) => m.paymentMethod === paymentMethod)
    .reduce((acc, curr) => {
      const valor = parseFloat(curr.value.replace('R$ ', '').replace('.', '').replace(',', '.'));
      return acc + (curr.situacao === 'Entrada' ? valor : -valor);
    }, 0);
};


export const calcularTotalPorMetodo = (
  movements: Movement[],
  tipo: 'Entrada' | 'Saída',
  metodo: string,
  banco: string
) => {
  return movements
    .filter((m) => m.situacao === tipo && m.paymentMethod === metodo && m.bank === banco)
    .reduce((acc, curr) => acc + parseFloat(curr.value.replace('R$ ', '').replace('.', '').replace(',', '.')), 0);
};

export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
