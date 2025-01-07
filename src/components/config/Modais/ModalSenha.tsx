import React, { useState } from "react";
import { supabase } from "../../../services/supabaseClient";

interface ModalSenhaProps {
    userId: string | null;
  onClose: () => void;
}

const ModalSenha: React.FC<ModalSenhaProps> = ({ userId, onClose }) => {
  const [newPassword, setNewPassword] = useState("");

  // Função para redefinir a senha no Supabase
  const handleSave = async () => {
    if (!newPassword) {
      alert("Por favor, insira a nova senha.");
      return;
    }

    try {
      // Atualiza a senha do usuário autenticado no Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("Erro ao redefinir a senha:", error.message);
        alert("Erro ao redefinir a senha. Tente novamente.");
      } else {
        alert("Senha redefinida com sucesso!");
        onClose(); // Fecha o modal após o sucesso
      }
    } catch (err: any) {
      console.error("Erro ao conectar ao Supabase:", err.message);
      alert("Erro inesperado. Tente novamente.");
    }
  };

  return (
    <div className="modal-content">
      <h2>Redefinir Senha</h2>
      <form>
        <div className="form-group">
          <label htmlFor="newPassword">Nova Senha:</label>
          <input
            id="newPassword"
            type="password"
            placeholder="Digite a nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="modal-actions">
          <button type="button" onClick={handleSave} className="btn btn-primary">
            Redefinir Senha
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalSenha;
