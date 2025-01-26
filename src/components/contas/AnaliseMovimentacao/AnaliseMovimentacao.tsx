import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import {
  calcularTotais,
  calcularPorBanco,
  calcularPorDinheiro,
  formatarMoeda,
} from "./AnaliseFunctions";
import { buscarBancos, buscarDados } from "./AnaliseService";
import { Movement, Bank, Nullable } from "./AnaliseTypes";

function AnaliseMovimentacao() {
  const [startDate, setStartDate] = useState<Nullable<Date>>(null);
  const [endDate, setEndDate] = useState<Nullable<Date>>(null);
  const [selectedBank, setSelectedBank] = useState<Nullable<Bank>>(null);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState<Nullable<string>>(null);

  async function fetchAllData() {
    setIsLoading(true);
    try {
      const [bankData, movementData] = await Promise.all([buscarBancos(), buscarDados()]);

      setBanks(
        bankData.map((item: any) => ({
          value: item.id,
          label: item.banco,
        }))
      );

      const transformedData = movementData.map((item: any) => ({
        description: item.descricao,
        date: item.data_transacao,
        situacao: item.tipo_registro as "Entrada" | "Saída",
        paymentType: item.payment_type,
        movementType: item.tipo_categoria,
        paymentMethod: item.payment_type || "Indefinido",
        bank: item.conta_bancaria || "Indefinido",
        value: `R$ ${parseFloat(item.valor).toFixed(2).replace(".", ",")}`,
        supplier: item.fornecedores || "Não informado",
      }));
      setMovements(transformedData);
    } catch (error) {
      setErrorMessage("Erro ao buscar dados. Tente novamente mais tarde.");
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  const paymentTypes = [
    { value: "Dinheiro", label: "Dinheiro" },
    { value: "Cartão", label: "Cartão" },
    { value: "Pix", label: "Pix" },
    { value: "Transferência", label: "Transferência" },
  ];

  const filterMovements = (data: Movement[]) => {
    return data.filter((movement) => {
      const dateInRange =
        !startDate || !endDate
          ? true
          : new Date(movement.date) >= startDate && new Date(movement.date) <= endDate;

      const bankMatches = !selectedBank ? true : movement.bank === selectedBank.label;

      const paymentTypeMatches = !selectedPaymentType
        ? true
        : movement.paymentMethod === selectedPaymentType;

      return dateInRange && bankMatches && paymentTypeMatches;
    });
  };

  const totalEntrada = calcularTotais(movements, "Entrada");
  const totalSaida = calcularTotais(movements, "Saída");
  const totalCaixa = calcularPorBanco(movements, "Caixa");
  const totalNubank = calcularPorBanco(movements, "Nubank");
  const totalDinheiro = calcularPorDinheiro(movements, "Dinheiro");

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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <h1 className="py-6 text-2xl md:text-4xl font-bold text-center bg-gray-200 rounded-lg shadow-sm">
          Análise de Movimentação
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Filtros */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Filtros</h2>
            <Calendar
              value={startDate}
              onChange={(e) => setStartDate(e.value as Date)}
              className="w-full mb-4"
              dateFormat="dd/mm/yy"
              showIcon
              placeholder="Data Inicial"
            />
            <Calendar
              value={endDate}
              onChange={(e) => setEndDate(e.value as Date)}
              className="w-full mb-4"
              dateFormat="dd/mm/yy"
              showIcon
              placeholder="Data Final"
            />
            <Dropdown
              value={selectedBank}
              options={banks}
              onChange={(e) => setSelectedBank(e.value)}
              placeholder="Banco"
              className="w-full mb-4"
            />
            <Dropdown
              value={selectedPaymentType}
              options={paymentTypes}
              onChange={(e) => setSelectedPaymentType(e.value)}
              placeholder="Tipo de Pagamento"
              className="w-full mb-4"
            />
            <Button
              label="Limpar Filtros"
              className="w-full p-button-outlined"
              onClick={handleClearFilters}
            />
          </div>

          {/* Resultados */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Resultados</h2>
            <p className="text-sm md:text-base">Total de Entrada: {formatarMoeda(totalEntrada)}</p>
            <p className="text-sm md:text-base">Total de Saída: {formatarMoeda(totalSaida)}</p>
            <p className="text-sm md:text-base">Movimentação Total: {formatarMoeda(totalEntrada - totalSaida)}</p>
            <p className="text-sm md:text-base">Limite Mensal: R$ 15.000,00</p>
          </div>

          {/* Movimentação Financeira */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Movimentação Financeira</h2>
            <p className="text-sm md:text-base">Caixa: {formatarMoeda(totalCaixa)}</p>
            <p className="text-sm md:text-base">Nubank: {formatarMoeda(totalNubank)}</p>
            <p className="text-sm md:text-base">Dinheiro: {formatarMoeda(totalDinheiro)}</p>
          </div>
        </div>

        {/* Tabela */}
        <div className="mt-8">
          <DataTable value={filterMovements(movements)} stripedRows responsiveLayout="scroll">
            <Column field="description" header="Descrição" />
            <Column field="date" header="Data" />
            <Column field="situacao" header="Tipo de Registro" />
            <Column field="movementType" header="Tipo de Movimentação" />
            <Column field="paymentMethod" header="Meio de Pagamento" />
            <Column field="bank" header="Banco" />
            <Column field="value" header="Valor" />
            <Column field="supplier" header="Fornecedor" />
          </DataTable>
        </div>
      </div>
    </div>
  );
}

export default AnaliseMovimentacao;
