import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../services/supabaseClient";
import TableCaixaBancos from "./components/table";
import FormRegistroH from "./components/FormRegistroH";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import Modal from "../../Modal/Modal";

function CaixaBancos() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [filtroBanco, setFiltroBanco] = useState(null);
  const [filtroDataInicio, setFiltroDataInicio] = useState(null);
  const [filtroDataFim, setFiltroDataFim] = useState(null);
  const [bancosDisponiveis, setBancosDisponiveis] = useState([
    "Selecione um banco",
  ]);
  const [totais, setTotais] = useState({
    totalEntrada: 0,
    totalSaida: 0,
    saldo: 0,
    totalConta: 0,

    totalEntradaPendente: 0,
    totalSaidaPendente: 0,
    totalSaldoPendente: 0,
    totalRegistroPendente: 0,
  });

  // Use useCallback to memorize fetchRegistros
  const fetchRegistros = useCallback(async () => {
    try {
      let query = supabase
        .from("viewBaseCaixa")
        .select(
          `
          id,
          descricao,
          valor,
          situacao,
          tipo_registro,
          data_transacao,
          tipo_categoria ,
          conta_bancaria,
          data_vencimento,
          observacao
        `
        )
        .order("data_transacao", { ascending: false });

      if (filtroBanco) {
        query = query.eq("conta_bancaria", filtroBanco);
      }
      if (filtroDataInicio && filtroDataFim) {
        query = query
          .gte("data_transacao", filtroDataInicio.toISOString())
          .lte("data_transacao", filtroDataFim.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      const registrosFormatados = data.map((registro) => ({
        ...registro,
        tipo_categoria: registro.tipo_categoria || "N/A",
        conta_bancaria: registro.conta_bancaria || "N/A",
      }));

      setRegistros(registrosFormatados || []);
    } catch (error) {
      console.error("Erro ao buscar registros:", error);
    }
  }, [filtroBanco, filtroDataInicio, filtroDataFim]); // Dependências de filtro

  const fetchBancos = async () => {
    try {
      const { data, error } = await supabase
        .from("bank_account")
        .select("id, banco")
        .order("banco", { ascending: true });
      if (error) throw error;
      
      setBancosDisponiveis(data || []);
    } catch (error) {
      console.error("Erro ao buscar bancos:", error);
    }
  };


  const handlerSubmit = async (data) => {
    try {
      console.log(data);
      const { error } = await supabase.from("base_caixa").insert([data]);
      if (error) throw error;
      alert("Registro registrado com sucesso!");
      fetchRegistros(); // Atualiza os registros após inserir
    } catch (error) {
      alert("Erro ao registrar o registro. Tente novamente.");
    }
  };

  const calcularTotais = useCallback(() => {
    const registrosFiltrado = registros.filter(
      (reg) => reg.situacao === "Concluído"
    );

    const totalEntrada = registrosFiltrado.reduce(
      (acc, reg) =>
        reg.tipo_registro === "Entrada" ? acc + Number(reg.valor) : acc,
      0
    );
    const totalSaida = registrosFiltrado.reduce(
      (acc, reg) =>
        reg.tipo_registro === "Saída" ? acc + Number(reg.valor) : acc,
      0
    );
    const saldo = totalEntrada - totalSaida;
    const totalConta = registrosFiltrado.length;

    const totalEntradaPendente = registros.reduce(
      (acc, reg) =>
        reg.situacao === "Pendente" && reg.tipo_registro === "Entrada"
          ? acc + Number(reg.valor)
          : acc,
      0
    );
    const totalSaidaPendente = registros.reduce(
      (acc, reg) =>
        reg.situacao === "Pendente" && reg.tipo_registro === "Saída"
          ? acc + Number(reg.valor)
          : acc,
      0
    );
    const totalSaldoPendente = totalEntradaPendente - totalSaidaPendente;
    const totalRegistroPendente = registros.reduce(
      (acc, reg) => (reg.situacao === "Pendente" ? acc + 1 : acc),
      0
    );

    setTotais({
      totalEntrada,
      totalSaida,
      saldo,
      totalConta,
      totalEntradaPendente,
      totalSaidaPendente,
      totalSaldoPendente,
      totalRegistroPendente,
    });
  }, [registros]); // Depende de registros

  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleDelete = async (id) => {
    try {
      // Aguarde o resultado da exclusão
      const { error } = await supabase.from("base_caixa").delete().eq("id", id);

      if (error) {
        alert("Erro ao excluir o registro. Tente novamente.");
        console.error("Erro ao excluir:", error);
        return;
      }

      // Atualize os registros após a exclusão
      fetchRegistros();

      alert("Registro excluído com sucesso!");
    } catch (err) {
      console.error("Erro inesperado:", err);
      alert("Ocorreu um erro inesperado. Tente novamente.");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    fetchRegistros();
    fetchBancos();
  }, [fetchRegistros]); // Agora, use o fetchRegistros memorado

  useEffect(() => {
    calcularTotais();
  }, [registros, calcularTotais]); // Calcula os totais sempre que registros mudarem

  return (
    <div className="flex flex-col h-full md:flex-row">
      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Caixa Bancos
        </h2>

        {/* Filter Section */}
        <div className="flex flex-col items-start gap-4 p-4 mb-6 bg-white rounded-lg shadow md:flex-row md:items-center">
          <Dropdown
            value={filtroBanco}
            onChange={(e) => setFiltroBanco(e.value)}
            options={[
              { label: "Todos", value: "" }, // Aqui adicionamos a opção "Todos"
              ...bancosDisponiveis.map((banco) => ({
                label: banco.banco,
                value: banco.banco,
              })),
            ]}
            placeholder="Selecione um banco"
            className="w-full md:w-52"
          />
          <Calendar
            value={filtroDataInicio}
            onChange={(e) => setFiltroDataInicio(e.value)}
            placeholder="Data início"
            className="w-full md:w-52"
            dateFormat="dd/mm/yy"
          />
          <Calendar
            value={filtroDataFim}
            onChange={(e) => setFiltroDataFim(e.value)}
            placeholder="Data fim"
            className="w-full md:w-52"
            dateFormat="dd/mm/yy"
          />
          <Button
            label="Filtrar"
            onClick={fetchRegistros}
            className="w-full md:w-auto p-button-primary"
          />
          <button
            onClick={handleOpenModal}
            className="w-full px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg md:w-auto hover:bg-green-600"
          >
            Registrar
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <TableCaixaBancos registros={registros} onDelete={handleDelete} />
        </div>
      </main>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Registro">
        <FormRegistroH onSave={handlerSubmit} onClose={handleCloseModal} />
      </Modal>

      {/* Sidebar */}
      <aside className="w-full p-4 text-white bg-gray-800 md:w-1/4 lg:w-1/6 fontesize-sm">
        <h2 className="mb-4 text-lg font-semibold">Resumo</h2>
        <ul className="mt-2 ml-4 space-y-2 list-disc">
          <li>Total de contas: {totais.totalConta}</li>
          <li>Total Entrada: R$ {totais.totalEntrada.toFixed(2)}</li>
          <li>Total Saída: R$ {totais.totalSaida.toFixed(2)}</li>
          <li>Saldo Total: R$ {totais.saldo.toFixed(2)}</li>

          <li>Contas a Receber pendentes: {totais.totalEntradaPendente}</li>
          <li>Contas a Paga pendentes: {totais.totalSaidaPendente}</li>
          <li>Saldo pendentes: R$ {totais.totalSaldoPendente.toFixed(2)}</li>
        </ul>
      </aside>
    </div>
  );
}

export default CaixaBancos;
