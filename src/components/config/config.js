import React, { useState } from "react";
import "./config.css";
import Modal from "../Modal/Modal";
import ModalSenha from "./Modais/ModalSenha";
import ModalRegistro from "./Modais/ModalUser";

function Config() {
    const [isSenhaModalOpen, setIsSenhaModalOpen] = useState(false);
    const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false);
    const [userID, setUserID] = useState(null);

    // Funções para abrir/fechar modais
    const handleOpenSenhaModal = (id) => {
        setUserID(id); // Define o ID do usuário (se necessário)
        setIsSenhaModalOpen(true);
    };

    const handleCloseSenhaModal = () => {
        setIsSenhaModalOpen(false);
        setUserID(null); // Limpa o ID ao fechar o modal
    };

    const handleOpenRegistroModal = () => {
        setIsRegistroModalOpen(true);
    };

    const handleCloseRegistroModal = () => {
        setIsRegistroModalOpen(false);
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
                </div>

                {/* Modal para Alterar Senha */}
                <Modal
                    isOpen={isSenhaModalOpen}
                    onClose={handleCloseSenhaModal}
                    title="Alterar Senha"
                >
                    <ModalSenha
                        userID={userID}
                        onClose={handleCloseSenhaModal}
                    />
                </Modal>

                {/* Modal para Registrar Usuário */}
                <Modal
                    isOpen={isRegistroModalOpen}
                    onClose={handleCloseRegistroModal}
                    title="Registrar Usuário"
                >
                    <ModalRegistro onClose={handleCloseRegistroModal} />
                </Modal>
            </div>
        </div>
    );
}

export default Config;
