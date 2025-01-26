import React, { useCallback, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { ChartData, ChartOptions } from 'chart.js';
import DashboardHome from '../pages/DashBoardHome/types';

interface Transaction {
  id: string;
  type: 'Entrada' | 'Saída';
  category: string;
  paymentMethod: string;
  date: string;
  amount: number;
  previousBalance: number;
  currentBalance: number;
}

interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyChange: string;
}

const TypeTemplate = React.memo(({ rowData }: { rowData: Transaction }) => (
  <Tag
    value={rowData.type === 'Entrada' ? 'Entrada' : 'Saída'}
    severity={rowData.type === 'Entrada' ? 'success' : 'danger'}
  />
));

const AmountTemplate = React.memo(({ rowData }: { rowData: Transaction }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <span className={rowData.type === 'Entrada' ? 'text-green-500' : 'text-red-500'}>
      {formatCurrency(rowData.amount)}
    </span>
  );
});

const DateTemplate = React.memo(({ rowData }: { rowData: Transaction }) => (
  <>{new Date(rowData.date).toLocaleDateString('pt-BR')}</>
));

export default function Home() {
  const [dadosViewBaseCaixa, setDadosViewBaseCaixa] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    monthlyChange: '0%'
  });
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: []
  });
  const [chartOptions, setChartOptions] = useState<ChartOptions>({});
  const toast = useRef<Toast>(null);

  const calculateSummary = (transactions: Transaction[]): FinancialSummary => {
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth - 1;

    const result = transactions.reduce(
      (acc, transaction) => {
        const transactionDate = new Date(transaction.date);
        const amount = transaction.amount;

        if (transaction.type === 'Entrada') {
          acc.totalIncome += amount;
          if (transactionDate.getMonth() === currentMonth) acc.currentMonthIncome += amount;
          if (transactionDate.getMonth() === lastMonth) acc.lastMonthIncome += amount;
        } else {
          acc.totalExpenses += amount;
          if (transactionDate.getMonth() === currentMonth) acc.currentMonthExpenses += amount;
          if (transactionDate.getMonth() === lastMonth) acc.lastMonthExpenses += amount;
        }
        return acc;
      },
      {
        totalIncome: 0,
        totalExpenses: 0,
        currentMonthIncome: 0,
        currentMonthExpenses: 0,
        lastMonthIncome: 0,
        lastMonthExpenses: 0
      }
    );

    const totalBalance = result.totalIncome - result.totalExpenses;
    const currentMonthTotal = result.currentMonthIncome - result.currentMonthExpenses;
    const lastMonthTotal = result.lastMonthIncome - result.lastMonthExpenses;

    const monthlyChange =
      lastMonthTotal !== 0
        ? ((currentMonthTotal - lastMonthTotal) / Math.abs(lastMonthTotal) * 100).toFixed(1)
        : '0';

    return {
      totalBalance,
      totalIncome: result.totalIncome,
      totalExpenses: result.totalExpenses,
      monthlyChange: `${monthlyChange}%`
    };
  };

  const processMonthlyData = useCallback((transactions: Transaction[]) => {
    const months: { [key: string]: { incomes: number; expenses: number } } = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}`;

      if (!months[monthKey]) {
        months[monthKey] = { incomes: 0, expenses: 0 };
      }

      if (transaction.type === 'Entrada') {
        months[monthKey].incomes += transaction.amount;
      } else {
        months[monthKey].expenses += transaction.amount;
      }
    });

    const sortedMonths = Object.keys(months).sort();

    return {
      labels: sortedMonths.map((month) => {
        const [year, monthNum] = month.split('-');
        return `${monthNum}/${year}`;
      }),
      incomes: sortedMonths.map((month) => months[month].incomes),
      expenses: sortedMonths.map((month) => months[month].expenses),
    };
  }, []);

  const carregarDados = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await DashboardHome();
      const transactions = response[0].map((transaction: any) => ({
        ...transaction,
        previousBalance: 0,
        currentBalance: 0
      }));

      setDadosViewBaseCaixa(transactions);
      const calculatedSummary = calculateSummary(transactions);
      setSummary(calculatedSummary);

      const monthlyData = processMonthlyData(transactions);

      const data: ChartData = {
        labels: monthlyData.labels,
        datasets: [
          {
            label: 'Entradas',
            data: monthlyData.incomes,
            backgroundColor: '#22c55e',
            borderColor: '#22c55e',
            tension: 0.4
          },
          {
            label: 'Saídas',
            data: monthlyData.expenses,
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
          },
          tooltip: {
            mode: 'index',
            intersect: false
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
              color: '#475569',
              callback: (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))
            },
            grid: {
              color: '#e2e8f0'
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      };

      setChartData(data);
      setChartOptions(options);
    } catch (error) {
      console.error('Erro ao carregar o dados:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível carregar os dados do dashboard',
        life: 3000
      });
    } finally {
      setIsLoading(false);
    }
  }, [processMonthlyData]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Toast ref={toast} />

      <h1 className="text-2xl font-bold text-white mb-6">Dashboard Financeiro</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-1">
          <Card className="bg-white shadow-lg">
            <div className="flex items-center justify-between p-2 rounded">
              <div>
                <p className="text-sm text-gray-600">Saldo Total</p>
                <p className="text-2xl font-bold text-gray-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.totalBalance)}</p>
              </div>
              <Wallet className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="col-span-1">
          <Card className="bg-white shadow-lg">
            <div className="flex items-center justify-between p-2 rounded">
              <div>
                <p className="text-sm text-gray-600">Total Entradas</p>
                <p className="text-2xl font-bold text-green-500">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.totalIncome)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="col-span-1">
          <Card className="bg-white shadow-lg">
            <div className="flex items-center justify-between p-2 rounded">
              <div>
                <p className="text-sm text-gray-600">Total Saídas</p>
                <p className="text-2xl font-bold text-red-500">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.totalExpenses)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-1">
          <Card className="bg-white shadow-lg">
            <div className="flex items-center justify-between p-2 rounded">
              <div>
                <p className="text-sm text-gray-600">Variação Mensal</p>
                <p className={`text-2xl font-bold ${parseFloat(summary.monthlyChange) >= 0 ? 'text-green-500' : 'text-red-500'}`}>{summary.monthlyChange}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 gap-4">
        <Card className="bg-white shadow-lg col-span-2 p-4">
          <h2 className="text-xl font-semibold mb-4">Fluxo de Caixa</h2>
          <div className="w-full">
            <Chart type="line" data={chartData} options={chartOptions} />
          </div>
        </Card>

        <Card className="bg-white shadow-lg col-span-2 p-4">
          <h2 className="text-xl font-semibold mb-4">Últimas Transações</h2>
          <DataTable
            value={dadosViewBaseCaixa}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            className="p-datatable-sm"
            stripedRows
            emptyMessage="Nenhuma transação encontrada"
            sortField="date"
            sortOrder={-1}
            responsiveLayout="stack"
          >
            <Column field="type" header="Tipo" body={(rowData) => <TypeTemplate rowData={rowData} />} sortable />
            <Column field="category" header="Categoria" sortable />
            <Column field="paymentMethod" header="Forma de Pagamento" sortable />
            <Column field="date" header="Data" body={(rowData) => <DateTemplate rowData={rowData} />} sortable />
            <Column field="amount" header="Valor" body={(rowData) => <AmountTemplate rowData={rowData} />} sortable />
            <Column field="currentBalance" header="Saldo" body={(rowData) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rowData.currentBalance)} />
          </DataTable>
        </Card>
      </motion.div>
    </div>
  );
}
