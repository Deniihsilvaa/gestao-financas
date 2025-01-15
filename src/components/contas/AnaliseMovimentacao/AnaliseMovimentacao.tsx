// AnaliseMovimentacao.tsx
import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { calcularTotais, calcularPorBanco, calcularPorDinheiro, formatarMoeda } from './AnaliseFunctions';
import { buscarBancos, buscarDados } from './AnaliseService';
import { Movement, Bank, Nullable } from './AnaliseTypes';

function AnaliseMovimentacao() {
  const [startDate, setStartDate] = useState<Nullable<Date>>(null);
  const [endDate, setEndDate] = useState<Nullable<Date>>(null);
  const [selectedBank, setSelectedBank] = useState<Nullable<Bank>>(null);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState<Nullable<string>>(null);
  
  
  async function fetchAllData() {
    setIsLoading(true);
    try {
      const [bankData, movementData] = await Promise.all([buscarBancos(), buscarDados()]);

      setBanks(bankData.map((item: any) => ({
        value: item.id, label: item.banco
      })));

      const transformedData = movementData.map((item: any) => ({
        description: item.descricao,
        date: item.data_transacao,
        situacao: item.tipo_registro as 'Entrada' | 'Saída',
        paymentType: item.payment_type,
        movementType: item.tipo_categoria,
        paymentMethod: item.payment_type || 'Indefinido',
        bank: item.conta_bancaria || 'Indefinido',
        value: `R$ ${parseFloat(item.valor).toFixed(2).replace('.', ',')}`,
        supplier: item.fornecedores || 'Não informado',
      }));
      setMovements(transformedData);
    } catch (error) {
      setErrorMessage('Erro ao buscar dados. Tente novamente mais tarde.');
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchAllData();
  }, []);

  const paymentTypes = [
    { value: 'Dinheiro', label: 'Dinheiro' },
    { value: 'Cartão', label: 'Cartão' },
    { value: 'Pix', label: 'Pix' },
    { value: 'Transferência', label: 'Transferência' }
  ];
const filterMovements = (data: Movement[]) => {
  return data.filter(movement => {
    const dateInRange = (!startDate || !endDate) ? true : 
      new Date(movement.date) >= startDate && new Date(movement.date) <= endDate;
      
    const bankMatches = !selectedBank ? true : 
      movement.bank === selectedBank.label;

    const paymentTypeMatches = !selectedPaymentType ? true : 
      movement.paymentMethod === selectedPaymentType;


    return dateInRange && bankMatches && paymentTypeMatches;
  });
};
  const totalEntrada = calcularTotais(movements, 'Entrada');
  const totalSaida = calcularTotais(movements, 'Saída');
  const totalCaixa = calcularPorBanco(movements, 'Caixa');
  const totalNubank = calcularPorBanco(movements, 'Nubank');
  const totalDinheiro = calcularPorDinheiro(movements, 'Dinheiro');

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedBank(null);
    setSelectedPaymentType(null);
  };

  if (isLoading) {
    return <div className="mt-8 text-center">Carregando dados...</div>;
  }

  if (errorMessage) {
    return <div className="mt-8 text-center text-red-500">{errorMessage}</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <h1 className="py-4 mb-8 text-3xl font-bold text-center bg-gray-200">
          Análise de movimentação
        </h1>

        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-semibold">Filtros</h2>
            <Calendar
              value={startDate}
              onChange={(e) => setStartDate(e.value as Date)}
              className="w-full"
              dateFormat="dd/mm/yy"
              showIcon
            />
            <Calendar
              value={endDate}
              onChange={(e) => setEndDate(e.value as Date)}
              className="w-full mt-4"
              dateFormat="dd/mm/yy"
              showIcon
            />
            <Dropdown
              value={selectedBank}
              options={banks}
              onChange={(e) => setSelectedBank(e.value)}
              placeholder="Selecione"
              className="w-full mt-4"
             disabled
            />
            <Dropdown
              value={selectedPaymentType}
              options={paymentTypes}
              onChange={(e) => setSelectedPaymentType(e.value)}
              placeholder="Selecione tipo de pagamento"
              className="w-full mt-4"
            />
            <Button label="Limpar Filtros" onClick={handleClearFilters} className="mt-4" />
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-semibold">Resultados</h2>
            <p>Total de Entrada: {formatarMoeda(totalEntrada)}</p>
            <p>Total de Saída: {formatarMoeda(totalSaida)}</p>
            <p>Quantidade de movimentacao: {movements.length}</p>
            <p>Total de movimentação: {formatarMoeda(totalEntrada - totalSaida)}</p>
            <p>Limite de movimentação: R$ 15.000,00 mensais</p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-semibold">Movimentação Financeiras</h2>
            <p>Caixa: {formatarMoeda(totalCaixa)}</p>
            <p>Nubank: {formatarMoeda(totalNubank)}</p>
            <p>Dinheiro: {formatarMoeda(totalDinheiro)}</p>
          </div>
        </div>

        <DataTable value={filterMovements(movements)} stripedRows>
          <Column field="description" header="Descrição" />
          <Column field="date" header="Data" />
          <Column field="situacao" header="Tipo de Pagamento" />
          <Column field="movementType" header="Tipo de Movimentação" />
          <Column field="paymentMethod" header="Meio de pagamento" />
          <Column field="bank" header="Banco" />
          <Column field="value" header="Valor" />
          <Column field="supplier" header="Fornecedor" />
        </DataTable>
      </div>
    </div>
  );
}

export default AnaliseMovimentacao;
