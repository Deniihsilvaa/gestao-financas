import React, { useState, useEffect, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { supabase } from "../../../services/supabaseClient";
import AlertDialog, { AlertDialogRef } from "../../Alert/Alert";

interface BankProps {
  label: string;
  value: string;
}

interface CardMachine {
  id: number;
  bank_id: string;
  account: string;
  machine_name: string;
  machine_type: string;
}

const ModalMaquininha: React.FC = () => {
  const [banks, setBanks] = useState<BankProps[]>([]);
  const [bank, setBank] = useState<string>("");
  const [account, setAccount] = useState<string>("");
  const [machineName, setMachineName] = useState<string>("");
  const [machineType, setMachineType] = useState<string>("");
  const [cardMachines, setCardMachines] = useState<CardMachine[]>([]);
  const alertDialogRef = useRef<AlertDialogRef | null>(null);

  useEffect(() => {
    const getBanks = async () => {
      try {
        const { data, error } = await supabase.from("bank_account").select("id,banco");
        if (error) {
          alertDialogRef.current?.showAlert("Erro ao buscar bancos.");
        } else {
          const formattedBanks = data.map((item: { id: number; banco: string }) => ({
            label: item.banco,
            value: String(item.id),
          }));
          setBanks(formattedBanks);
        }
      } catch (err) {
        console.error("Erro ao buscar bancos:", err);
        alertDialogRef.current?.showAlert("Erro ao buscar bancos.");
      }
    };

    const getCardMachines = async () => {
      try {
        const { data, error } = await supabase.from("card_machines").select("*");
        if (error) throw error;
        setCardMachines(data || []);
      } catch (err) {
        console.error("Erro ao buscar máquinas de cartão:", err);
        alertDialogRef.current?.showAlert("Erro ao buscar máquinas de cartão.");
      }
    };

    getBanks();
    getCardMachines();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!bank || !account || !machineName || !machineType) {
      alertDialogRef.current?.showAlert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const user_id = user.id;

      const payload = {
        bank_id: bank,
        account,
        machine_name: machineName,
        machine_type: machineType,
        user_id,
      };

      const { error } = await supabase.from("card_machines").insert([payload]);

      if (error) {
        alertDialogRef.current?.showAlert("Erro ao registrar máquina de cartão.");
      } else {
        alertDialogRef.current?.showAlert("Máquina de cartão registrada com sucesso!");
        setBank("");
        setAccount("");
        setMachineName("");
        setMachineType("");
        fetchCardMachines();
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alertDialogRef.current?.showAlert("Erro inesperado. Tente novamente.");
    }
  };

  const fetchCardMachines = async () => {
    try {
      const { data, error } = await supabase.from("card_machines").select("*");
      if (error) throw error;
      setCardMachines(data || []);
    } catch (err) {
      console.error("Erro ao buscar máquinas de cartão:", err);
      alertDialogRef.current?.showAlert("Erro ao buscar máquinas de cartão.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("card_machines").delete().eq("id", id);
      if (error) throw error;
      alertDialogRef.current?.showAlert("Máquina de cartão excluída com sucesso!");
      fetchCardMachines();
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alertDialogRef.current?.showAlert("Erro ao excluir máquina de cartão.");
    }
  };

  const renderActions = (rowData: CardMachine) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-warning"
        onClick={() => {
          setBank(String(rowData.bank_id));
          setAccount(rowData.account);
          setMachineName(rowData.machine_name);
          setMachineType(rowData.machine_type);
        }}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => handleDelete(rowData.id)}
      />
    </div>
  );

  return (
    <div className="flex p-2  bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl p-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Registrar Máquina de Cartão</h2>

        <AlertDialog ref={alertDialogRef} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banco</label>
              <Dropdown
                value={bank}
                options={banks}
                onChange={(e) => setBank(e.value)}
                optionLabel="label"
                optionValue="value"
                placeholder="Selecione o banco"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conta</label>
              <InputText
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Digite a conta vinculada"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Máquina</label>
              <InputText
                value={machineName}
                onChange={(e) => setMachineName(e.target.value)}
                placeholder="Digite o nome da máquina"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Máquina</label>
              <Dropdown
                value={machineType}
                options={[
                  { label: "Débito", value: "Débito" },
                  { label: "Crédito", value: "Crédito" },
                  { label: "Ambos", value: "Ambos" },
                ]}
                onChange={(e) => setMachineType(e.value)}
                placeholder="Selecione o tipo de máquina"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button label="Registrar" type="submit" className="p-button-primary" />
          </div>
        </form>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Máquinas de Cartão Registradas</h3>
          <DataTable value={cardMachines} responsiveLayout="scroll">
            <Column field="machine_name" header="Nome" />
            <Column field="machine_type" header="Tipo" />
            <Column field="account" header="Conta" />
            <Column header="Ações" body={renderActions} />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default ModalMaquininha;
