import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { useState, useEffect } from 'react';
import { ChartData, ChartOptions } from 'chart.js';

export default function Home() {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: []
  });
  const [chartOptions, setChartOptions] = useState<ChartOptions>({});

  const mockTransactions = [
    {
      id: 1,
      type: 'entrada',
      category: 'Vendas',
      paymentMethod: 'Cartão de Crédito',
      date: '2024-03-15',
      amount: 2500.00,
      previousBalance: 5000.00,
      currentBalance: 7500.00
    },
    {
      id: 2,
      type: 'saída',
      category: 'Fornecedores',
      paymentMethod: 'Transferência',
      date: '2024-03-14',
      amount: -1200.00,
      previousBalance: 6200.00,
      currentBalance: 5000.00
    },
    {
      id: 3,
      type: 'entrada',
      category: 'Serviços',
      paymentMethod: 'PIX',
      date: '2024-03-13',
      amount: 1800.00,
      previousBalance: 4400.00,
      currentBalance: 6200.00
    },
    {
      id: 4,
      type: 'saída',
      category: 'Despesas',
      paymentMethod: 'Débito',
      date: '2024-03-12',
      amount: -600.00,
      previousBalance: 5000.00,
      currentBalance: 4400.00
    }
  ];

  const summaryData = {
    totalBalance: 7500.00,
    totalIncome: 4300.00,
    totalExpenses: 1800.00,
    monthlyChange: '+15%'
  };

  useEffect(() => {
    const data: ChartData = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Entradas',
          data: [3500, 4200, 4800, 4300, 5200, 5800],
          backgroundColor: '#22c55e',
          borderColor: '#22c55e',
          tension: 0.4
        },
        {
          label: 'Saídas',
          data: [2100, 2400, 2900, 2800, 3100, 3400],
          backgroundColor: '#ef4444',
          borderColor: '#ef4444',
          tension: 0.4
        }
      ]
    };

    const options: ChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: '#475569'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#475569'
          },
          grid: {
            color: '#e2e8f0'
          }
        },
        y: {
          ticks: {
            color: '#475569'
          },
          grid: {
            color: '#e2e8f0'
          }
        }
      }
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const typeTemplate = (rowData: any) => {
    return (
      <Tag
        value={rowData.type === 'entrada' ? 'Entrada' : 'Saída'}
        severity={rowData.type === 'entrada' ? 'success' : 'danger'}
      />
    );
  };

  const amountTemplate = (rowData: any) => {
    return (
      <span className={rowData.amount >= 0 ? 'text-green-500' : 'text-red-500'}>
        {formatCurrency(rowData.amount)}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Home Financeiro</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1"
        >
          <Card className="bg-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo Total</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(summaryData.totalBalance)}
                </p>
              </div>
              <Wallet className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1"
        >
          <Card className="bg-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Entradas</p>
                <p className="text-2xl font-bold text-green-500">
                  {formatCurrency(summaryData.totalIncome)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-1"
        >
          <Card className="bg-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Saídas</p>
                <p className="text-2xl font-bold text-red-500">
                  {formatCurrency(summaryData.totalExpenses)}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-1"
        >
          <Card className="bg-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Variação Mensal</p>
                <p className="text-2xl font-bold text-blue-500">
                  {summaryData.monthlyChange}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 gap-4"
      >
        <Card className="bg-white shadow-lg col-span-2 p-4 ">
          <h2 className="text-xl font-semibold mb-4">Fluxo de Caixa</h2>
          <div className="w-full max-h-64">
            <Chart type="line" data={chartData} options={chartOptions} className="max-h-64" />
          </div>
        </Card>
        <p></p>
        <Card className="bg-white shadow-lg col-span-2 p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Últimas Transações</h2>
          <DataTable
            value={mockTransactions}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25]}
            className="p-datatable-sm"
            stripedRows
          >
            <Column field="type" header="Tipo" body={typeTemplate} />
            <Column field="category" header="Categoria" />
            <Column field="paymentMethod" header="Forma de Pagamento" />
            <Column field="date" header="Data" />
            <Column field="amount" header="Valor" body={amountTemplate} />
            <Column
              field="currentBalance"
              header="Saldo"
              body={(rowData) => formatCurrency(rowData.currentBalance)}
            />
          </DataTable>
        </Card>
      </motion.div>
    </div>
  );
}