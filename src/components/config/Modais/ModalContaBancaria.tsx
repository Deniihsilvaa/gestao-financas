import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../services/supabaseClient";
import TableConta from "../Formulario/TableConta";
import { Conta, FormularioContaProps } from "../Formulario/type";
import AlertDialog, { AlertDialogRef } from "../../Alert/Alert";
interface FormData {
  banco: string;
  agencia: string;
  conta: string;
  id: number | null;
}
const ModalContaBancaria: React.FC<FormularioContaProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    banco: "",
    agencia: "",
    conta: "",
    id: null,
  });
  const [contas, setContas] = useState<Conta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const alert = useRef<AlertDialogRef | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { banco, agencia, conta } = formData;

    if (!banco || !agencia || !conta) {
      alert.current?.showAlert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) throw new Error("Usuário não autenticado.");
      if (formData.id) {
        // Atualização
        const { error } = await supabase
          .from("bank_account")
          .update({ banco, agencia, conta })
          .eq("id", formData.id);
        if (error) throw error;
        alert.current?.showAlert("Conta atualizada com sucesso!");
        //onClose();
        fetchContas();
        setFormData({ banco: "", agencia: "", conta: "", id: null });
        return;
      }
      // Inserção
      const { error } = await supabase.from("bank_account").insert([
        { banco, agencia, conta, user_id: user.id },
      ]);

      if (error) throw error;

      alert.current?.showAlert("Conta registrada com sucesso!");
      fetchContas();
      setFormData({ banco: "", agencia: "", conta: "", id: null });
    } catch (err) {
      console.error(err);
      alert.current?.showAlert("Erro ao registrar a conta. Tente novamente.");
    }
  };

  const fetchContas = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("bank_account").select("*");
      if (error) throw error;

      setContas(data || []);
    } catch (error) {
      console.error("Erro ao buscar contas bancárias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const user_id = JSON.parse(localStorage.getItem("user") || "{}").id;
    try {
      const { error } = await supabase
        .from("bank_account")
        .delete()
        .eq("id", id)
        .eq("user_id", user_id)

      if (error) throw error;

      alert.current?.showAlert("Conta excluída com sucesso!");
      fetchContas();
    } catch (error) {
      alert.current?.showAlert("Erro ao excluir a conta bancária. Tente novamente.");
    }
  };

  const handleEdit = (conta: Conta) => {
    setFormData({ banco: conta.banco, agencia: conta.agencia, conta: conta.conta, id: conta.id });
  };

  useEffect(() => {
    fetchContas();
  }, []);

  return (
    <div>
      <AlertDialog ref={alert} />

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            {["banco", "agencia", "conta"].map((field) => (
              <div key={field} className="mb-3 input-group">
                <span className="input-group-text">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                <input
                  type="text"
                  name={field}
                  className="form-control"
                  placeholder={`Digite o ${field}`}
                  value={(formData as any)[field]}
                  onChange={handleInputChange}
                />
              </div>
            ))}
            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Registrar
              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="mt-3 row">
        <TableConta contas={contas} isLoading={isLoading} handleDelete={handleDelete} handleEdit={handleEdit} />
      </div>
    </div>
  );
};

export default ModalContaBancaria;
