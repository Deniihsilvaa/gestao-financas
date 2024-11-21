import React, { useState } from "react";
import { supabase } from "../../../services/supabaseClient";

function ModalRegistro({ onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    const handleRegister = async () => {
        if (!email || !password || !name || !role) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            // Registra o usuário no sistema de autenticação do Supabase
            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) {
                console.error("Erro ao registrar o usuário:", authError.message);
                alert("Erro ao registrar o usuário. Tente novamente.");
                return;
            }

            const userId = data.user?.id;

            // Insere os dados adicionais do usuário na tabela `users`
            const { error: dbError } = await supabase
                .from("general_data")
                .insert([
                    {
                        tokenID: userId, // ID gerado pelo Supabase Auth
                        name,
                        email,
                        role,
                    },
                ]);

            if (dbError) {
                console.error("Erro ao salvar os dados do usuário:", dbError.message);
                alert("Erro ao salvar os dados no banco de dados.");
            } else {
                alert("Usuário registrado com sucesso!");
                onClose(); // Fecha o modal após o sucesso
            }
        } catch (err) {
            console.error("Erro inesperado:", err.message);
            alert("Erro inesperado. Tente novamente.");
        }
    };

    return (
        <div>
            <form>
                <div>
                    <label>Nome:</label>
                    <input
                        type="text"
                        placeholder="Digite o nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Digite o email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input
                        type="password"
                        placeholder="Digite a senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>Função:</label>
                    <input
                        type="text"
                        placeholder="Ex: administrador, usuário"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />
                </div>
                <button type="button" onClick={handleRegister}>
                    Registrar
                </button>
            </form>
        </div>
    );
}

export default ModalRegistro;
