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
                <div className="input-group mb-3">

                    <span htmlFor="name" className="input-group-text">Nome:</span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Digite o nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" htmlFor="email">Email:</span>
                    <input
                     className="form-control"
                        type="email"
                        placeholder="Digite o email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" htmlFor="password">Senha:</span>
                    <input
                    className="form-control"
                        type="password"
                        placeholder="Digite a senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" htmlFor="role">Função:</span>
                    <input
                     className="form-control"
                        type="text"
                        placeholder="Ex: administrador, usuário"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" type="button" onClick={handleRegister}>
                    Registrar
                </button>
            </form>
        </div>
    );
}

export default ModalRegistro;
