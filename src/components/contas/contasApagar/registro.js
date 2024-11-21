import React, { useState } from "react";

function TemplateRegistros({ onClose }) {
    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [valor, setValor] = useState("");
    const [vencimento, setVencimento] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const novaConta = { nome, categoria, valor, vencimento };
        console.log("Conta registrada:", novaConta);
        alert("Conta registrada com sucesso!");
        onClose(); // Fecha o modal após o envio
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
                <span className="input-group-text">Nome</span>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Digite o nome da conta"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text">Categoria</span>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Digite a categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                />
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text">Valor</span>
                <input
                    type="number"
                    className="form-control"
                    placeholder="Digite o valor"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                />
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text">Vencimento</span>
                <input
                    type="date"
                    className="form-control"
                    value={vencimento}
                    onChange={(e) => setVencimento(e.target.value)}
                />
            </div>
            <div className="d-flex justify-content-end mt-4">
                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                    Registrar
                </button>
            </div>
        </form>
    );
}

export default TemplateRegistros;
