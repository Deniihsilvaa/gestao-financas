// AnaliseMovimentacao.tsx
import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { PencilLine, Users } from 'lucide-react';

import { calcularTotais, calcularPorBanco, calcularPorDinheiro, calcularTotalPorMetodo, formatarMoeda } from './AnaliseFunctions';
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

  useEffect(() => {
    async function fetchAllData() {
      setIsLoading(true);
      try {
        const [bankData, movementData] = await Promise.all([buscarBancos(), buscarDados()]);

        const listBanco = bankData.map((item: any) => ({
          value: item.id,    // Valor associado ao item
          label: item.banco, // Texto que será exibido no Dropdown
        }));
        setBanks(listBanco);

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
    fetchAllData();
  }, []);

  const totalEntrada = calcularTotais(movements, 'Entrada');
  const totalSaida = calcularTotais(movements, 'Saída');
  const totalCaixa = calcularPorBanco(movements, 'Caixa');
  const totalNubank = calcularPorBanco(movements, 'Nubank');
  const totalDinheiro = calcularPorDinheiro(movements, 'Dinheiro');

  const editarMovimento = (rowData: Movement) => {
    console.log('Editar movimento:', rowData);
    // Adicione lógica de edição aqui
  };

  const visualizarMovimento = (rowData: Movement) => {
    console.log('Visualizar movimento:', rowData);
    // Adicione lógica de visualização aqui
  };

  const actionTemplate = (rowData: Movement) => (
    <div className="flex gap-2">
      <Button
        icon={<PencilLine className="w-4 h-4" />}
        rounded
        text
        severity="secondary"
        onClick={() => editarMovimento(rowData)}
      />
      <Button
        icon={<Users className="w-4 h-4" />}
        rounded
        text
        severity="secondary"
        onClick={() => visualizarMovimento(rowData)}
      />
    </div>
  );

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
              showTime
              hourFormat="24"
            />
            <Calendar
              value={endDate}
              onChange={(e) => setEndDate(e.value as Date)}
              className="w-full mt-4"
              dateFormat="dd/mm/yy"
              showIcon
              showTime
              hourFormat="24"
            />
            <Dropdown
              value={selectedBank}
              options={banks}
              onChange={(e) => setSelectedBank(e.value)}
              placeholder="Selecione"
              className="w-full mt-4"
            />
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

        <DataTable value={movements} stripedRows>
          <Column field="description" header="Descrição" />
          <Column field="date" header="Data" />
          <Column field="situacao" header="Tipo de Pagamento" />
          <Column field="movementType" header="Tipo de Movimentação" />
          <Column field="paymentMethod" header="Meio de pagamento" />
          <Column field="bank" header="Banco" />
          <Column field="value" header="Valor" />
          <Column field="supplier" header="Fornecedor" />
          <Column body={actionTemplate} header="Ações" />
        </DataTable>
      </div>
    </div>
  );
}

export default AnaliseMovimentacao;
