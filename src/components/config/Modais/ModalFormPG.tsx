import React, { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import TableContaFormPG from "../Formulario/TableContaFormPG";
import { ContaType, FormularioContaProps } from "../Formulario/type";

const paymentTypes = [
  { label: "Dinheiro", value: "Dinheiro" },
  { label: "Cartão", value: "Cartão" },
  { label: "Pix", value: "Pix" },
];

const ModalFormPG: React.FC<FormularioContaProps> = ({ onClose }) => {
  const [paymentType, setPaymentType] = useState<string>("");
  const [cardName, setCardName] = useState("");
  const [cardType, setCardType] = useState<string>("");
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [accounts, setAccounts] = useState<ContaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      
      console.log('ID',payload);
      
      const { error } = await supabase.from("payment_methods").insert([payload]);

      if (error) {
        alert("Erro ao registrar método de pagamento. Tente novamente.");
      } else {
        alert("Método de pagamento registrado com sucesso!");
        fetchAccounts();
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("Erro inesperado. Tente novamente.");
    }
  };

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase.from("payment_methods").select("*");
      if (error) throw error;
        console.log(data)
      setAccounts(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar métodos de pagamento:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
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
                <InputText
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  placeholder="Digite o banco"
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
          <Button label="Registrar" type="submit" className="p-button-primary" />
        </div>
      </form>

      <div className="mt-4">
        <TableContaFormPG contas={accounts} isLoading={isLoading} handleDelete={() => {}} />
      </div>
    </div>
  );
};

export default ModalFormPG;
