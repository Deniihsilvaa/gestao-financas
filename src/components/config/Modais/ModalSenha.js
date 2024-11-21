import React, { useState } from "react";
import { supabase } from '../../../services/supabaseClient';

function ModalSenha({ userId, onClose }) {
    const [newPassword, setNewPassword] = useState("");

    // Função para redefinir a senha no Supabase
    const handleSave = async () => {
        if (!newPassword) {
            alert("Por favor, insira a nova senha.");
            return;
        }

        try {
            // Atualiza a senha do usuário no Supabase
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
        } catch (err) {
            console.error("Erro ao conectar ao Supabase:", err.message);
            alert("Erro inesperado. Tente novamente.");
        }
    };

    return (
        <form>
            <div>
                <label>Nova Senha:</label>
                <input
                    type="password"
                    placeholder="Digite a nova senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>
            <button type="button" onClick={handleSave}>
                Redefinir Senha
            </button>
        </form>
    );
}

export default ModalSenha;
