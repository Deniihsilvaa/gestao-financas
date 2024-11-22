// src/components/config/Formulario/formConta.jsx
import React, { useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import TableConta from "./TableConta.tsx";
const FormularioConta = ({ onClose }) => {
    const [banco, setBanco] = useState("");
    const [agencia, setAgencia] = useState("");
    const [conta, setConta] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!banco || !agencia || !conta) {
            alert("Por favor, preencha todos os campos.");
            return;
        }
        try {
            const dadoslocal = localStorage.getItem("user");
            const dados = JSON.parse(dadoslocal);
            const user_id = dados.id;


            const { data, error } = await supabase.from("bank_account").insert([
                { banco, agencia, conta, user_id },
            ]);




            if (error) {
                alert("Erro ao registrar conta. Tente novamente.");
            } else {
                alert("Conta bancária registrada com sucesso!");
                onClose(); // Fecha o modal
            }
        } catch (err) {
            alert("Erro inesperado. Tente novamente.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="card">
                <div className="card-body">
                    <div className="row mt-3">
                        <div className="input-group mb-3">
                            <span className="input-group-text">Banco</span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Digite o nome do banco"
                                value={banco}
                                onChange={(e) => setBanco(e.target.value)}
                            />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Agência</span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Digite o número da agência"
                                value={agencia}
                                onChange={(e) => setAgencia(e.target.value)}
                            />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Conta</span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Digite o número da conta"
                                value={conta}
                                onChange={(e) => setConta(e.target.value)}
                            />
                        </div>
                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-secondary me-2"
                                onClick={onClose}
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Registrar
                            </button>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <TableConta />

                    </div>
                </div>

            </div>
        </form>
    );
};

export default FormularioConta;
