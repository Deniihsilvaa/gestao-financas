import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../services/supabaseClient";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import TableContaFormPG from "../Formulario/TableContaFormPG";
import { ContaType, FormularioContaProps } from "../Formulario/type";
import AlertDialog, { AlertDialogRef } from "../../Alert/Alert";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
const paymentTypes = [
  { label: "Dinheiro", value: "Dinheiro" },
  { label: "Cartão", value: "Cartão" },
  { label: "Pix", value: "Pix" },
];

interface BankProps {
  label: string; // Nome do banco
  value: string; // ID do banco como string
}

const ModalFormPG: React.FC<FormularioContaProps> = ({ onClose }) => {
  const [paymentType, setPaymentType] = useState<string>("");
  const [cardName, setCardName] = useState("");
  const [cardType, setCardType] = useState<string>("");
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [accounts, setAccounts] = useState<ContaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banks, setBanks] = useState<BankProps[]>([]);
  const alertDialogRef = useRef<AlertDialogRef | null>(null);

  useEffect(() => {
    const getBanks = async () => {
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
    };
    getBanks();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase.from("payment_methods").select("*");
      if (error) throw error;

      setAccounts(data || []);
      setIsLoading(false);
    } catch (error) {
      alertDialogRef.current?.showAlert("Erro ao buscar métodos de pagamento.");
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!paymentType || (paymentType === "Cartão" && (!cardName || !cardType || !bank || !account)) || (paymentType === "Pix" && (!pixKey || !account))) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const user_id = user.id;

      const payload = {
        payment_type: paymentType,
        card_name: paymentType === "Cartão" ? cardName : null,
        card_type: paymentType === "Cartão" ? cardType : null,
        bank: paymentType !== "Dinheiro" ? bank : null,
        account: paymentType !== "Dinheiro" ? account : null,
        pix_key: paymentType === "Pix" ? pixKey : null,
        user_id: user_id,
      };

      const { error } = await supabase.from("payment_methods").insert([payload]);

      if (error) {
        alertDialogRef.current?.showAlert("Erro ao registrar método de pagamento.");
      } else {
        alertDialogRef.current?.showAlert("Método de pagamento registrado com sucesso!");
        fetchAccounts();
      }
    } catch (err) {
      console.error(err);
      alertDialogRef.current?.showAlert("Erro inesperado. Tente novamente.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const user_id = user.id;
      const { error } = await supabase
        .from("payment_methods")
        .delete()
        .eq("id", id)
        .eq("user_id", user_id);

      if (error) throw error;

      fetchAccounts();
      alertDialogRef.current?.showAlert("Método de pagamento excluído com sucesso!");
    } catch (error) {
      console.error(error);
      alertDialogRef.current?.showAlert("Erro ao excluir o método de pagamento. Tente novamente.");
    }
  };

  const confirmSave = () => {
    confirmDialog({
      message: "Deseja realmente salvar os dados?",
      header: "Confirmação de Salvar",
      icon: "pi pi-question-circle",
      accept: handleSave,
      reject: () => alertDialogRef.current?.showAlert("Ação cancelada."),
    });
  };

  const confirmDelete = (id: number) => {
    confirmDialog({
      message: "Deseja realmente excluir este registro?",
      header: "Confirmação de Exclusão",
      icon: "pi pi-exclamation-triangle",
      accept: () => handleDelete(id),
      reject: () => alertDialogRef.current?.showAlert("Ação cancelada."),
    });
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl h-auto p-2">
      <AlertDialog ref={alertDialogRef} />
      <ConfirmDialog />
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Pagamento</label>
            <Dropdown
              value={paymentType}
              options={paymentTypes}
              onChange={(e) => setPaymentType(e.value)}
              placeholder="Selecione o tipo de pagamento"
              className="w-full"
            />
          </div>

          {paymentType === "Cartão" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome do Cartão</label>
                <InputText
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Digite o nome do cartão"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Crédito ou Débito</label>
                <Dropdown
                  value={cardType}
                  options={[{ label: "Crédito", value: "Crédito" }, { label: "Débito", value: "Débito" }]}
                  onChange={(e) => setCardType(e.value)}
                  placeholder="Selecione o tipo de cartão"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Banco</label>
                <Dropdown
                  value={bank}
                  options={banks}
                  onChange={(e) => setBank(e.value)}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Selecione o tipo de banco"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Conta</label>
                <InputText
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder="Digite a conta"
                  className="w-full"
                />
              </div>
            </>
          )}

          {paymentType === "Pix" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Chave do Pix</label>
                <InputText
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="Digite a chave do Pix"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Conta</label>
                <InputText
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder="Digite a conta vinculada ao Pix"
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button label="Cancelar" onClick={onClose} className="p-button-secondary" />
          <Button label="Registrar" onClick={confirmSave} className="p-button-primary" />
        </div>
      </form>

      <div className="w-100">
        <TableContaFormPG contas={accounts} isLoading={isLoading} handleDelete={confirmDelete} />
      </div>
    </div>
  );
};

export default ModalFormPG;
