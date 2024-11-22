// components/config/config.js
import React, { useState } from "react";
import "./config.css";
import Modal from "../Modal/Modal";
import ModalSenha from "./Modais/ModalSenha";
import ModalRegistro from "./Modais/ModalUser";
import FormularioConta from "./Formulario/formConta";

function Config() {
    const [isSenhaModalOpen, setIsSenhaModalOpen] = useState(false);
    const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false);
    const [isContaModalOpen, setIsContaModalOpen] = useState(false);
    const [userID, setUserID] = useState(null);

    // Funções para abrir/fechar modais
    const handleOpenSenhaModal = (id) => {
        setUserID(id);
        setIsSenhaModalOpen(true);
    };
    const handleCloseSenhaModal = () => {
        setIsSenhaModalOpen(false);
        setUserID(null);
    };
    const handleOpenRegistroModal = () => {
        setIsRegistroModalOpen(true);
    };
    const handleCloseRegistroModal = () => {
        setIsRegistroModalOpen(false);
    };
    const handleOpenContaModal = () => {
        setIsContaModalOpen(true);
    };
    const handleCloseContaModal = () => {
        setIsContaModalOpen(false);
    };

    return (
        <div className="container">
            <div className="cardRegistro">
                <h2 className="car-title">Configurações Gerais</h2>

                {/* Botões de Ações */}
                <div className="button-container">
                    <button className="button" onClick={handleOpenSenhaModal}>
                        Alterar Senha
                    </button>
                    <button className="button" onClick={handleOpenRegistroModal}>
                        Registrar Usuário
                    </button>
                    <button className="button" onClick={handleOpenContaModal}>
                        Conta Bancária
                    </button>
                </div>

                {/* Modal para Alterar Senha */}
                <Modal
                    isOpen={isSenhaModalOpen}
                    onClose={handleCloseSenhaModal}
                    title="Alterar Senha"
                >
                    <ModalSenha userID={userID} onClose={handleCloseSenhaModal} />
                </Modal>

                {/* Modal para Registrar Usuário */}
                <Modal
                    isOpen={isRegistroModalOpen}
                    onClose={handleCloseRegistroModal}
                    title="Registrar Usuário"
                >
                    <ModalRegistro onClose={handleCloseRegistroModal} />
                </Modal>

                {/* Modal para Conta Bancária */}
                <Modal
                    isOpen={isContaModalOpen}
                    onClose={handleCloseContaModal}
                    title="Registrar Conta Bancária"
                >
                    <FormularioConta onClose={handleCloseContaModal} />
                </Modal>
            </div>
        </div>
    );
}

export default Config;
