import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalSenha from "./Modais/ModalSenha";
import ModalRegistro from "./Modais/ModalUser";
import ModalContaBancaria from "./Modais/ModalContaBancaria";
import ModalFormPG from "./Modais/ModalFormPG";
import ModalTipoCategoria from "./Modais/ModalTipoCategorias";
import ModalMaquininha from "./Modais/ModalMaquininha";

import { Button } from "primereact/button";

const Config: React.FC = () => {
  const [isSenhaModalOpen, setIsSenhaModalOpen] = useState(false);
  const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false);
  const [isContaModalOpen, setIsContaModalOpen] = useState(false);
  const [isFormPGModalOpen, setIsFormPGModalOpen] = useState(false);
  const [isTipoCategoriaModalOpen, setIsTipoCategoriaModalOpen] = useState(false);
  const [isMaquininhaModalOpen, setIsMaquininhaModalOpen] = useState(false);
  const [userID, setUserID] = useState<string | null>(null);

  // Funções para abrir/fechar modais
  const handleOpenSenhaModal = (id: string | null = null) => {
    setUserID(id);
    setIsSenhaModalOpen(true);
  };
  const handleCloseSenhaModal = () => {
    setIsSenhaModalOpen(false);
    setUserID(null);
  };
  const handleOpenRegistroModal = () => setIsRegistroModalOpen(true);
  const handleCloseRegistroModal = () => setIsRegistroModalOpen(false);
  const handleOpenContaModal = () => setIsContaModalOpen(true);
  const handleCloseContaModal = () => setIsContaModalOpen(false);
  const handleOpenFormPGModal = () => setIsFormPGModalOpen(true);
  const handleCloseFormPGModal = () => setIsFormPGModalOpen(false);
  const handleOpenTipoCategoriaModal = () => setIsTipoCategoriaModalOpen(true);
  const handleCloseTipoCategoriaModal = () => setIsTipoCategoriaModalOpen(false);
  const handleOpenMaquininhaModal = () => setIsMaquininhaModalOpen(true);
  const handleCloseMaquininhaModal = () => setIsMaquininhaModalOpen(false);

  return (
    <div className="container mx-auto p-5 md:p-10 lg:p-20">
      <h2 className="car-title text-2xl font-bold mb-5 md:text-3xl text-white">Configurações Gerais</h2>

      {/* Botões de Ações */}
      {/* usar grid para alinhar os botões se for tela menor que 768px deixar de lado */}
      <div className="grid grid-cols-1 gap-3 button-container md:grid-cols-5">
        <Button
            label="Alterar Senha"
            icon="pi pi-key"
            className="p-button-primary"
            onClick={() => handleOpenSenhaModal()}
          />
          <Button
            label="Registrar Usuário"
            icon="pi pi-user-plus"
            className="p-button-success"
            onClick={handleOpenRegistroModal}
          />
          <Button
            label="Conta Bancária"
            icon="pi pi-wallet"
            className="p-button-info"
            onClick={handleOpenContaModal}
          />
          <Button
            label="Formas de Pagamento"
            icon="pi pi-credit-card"
            className="p-button-warning"
            onClick={handleOpenFormPGModal}
          />
          <Button
            label="Tipo de categorias"
            icon="pi pi-list"
            className="p-button-secondary"
            onClick={handleOpenTipoCategoriaModal}
          />
          <Button
            label="Maquininha"
            icon="pi pi-cog"
            className="p-button-secondary"
            onClick={handleOpenMaquininhaModal}
          />
        </div>

        {/* Modal para Alterar Senha */}
        <Modal
          isOpen={isSenhaModalOpen}
          onClose={handleCloseSenhaModal}
          title="Alterar Senha"
        >
          <ModalSenha userId={userID} onClose={handleCloseSenhaModal} />
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
          <ModalContaBancaria onClose={handleCloseContaModal} />
        </Modal>

        {/* Modal para Formas de Pagamento */}
        <Modal
          isOpen={isFormPGModalOpen}
          onClose={handleCloseFormPGModal}
          title="Formas de Pagamento"
        >
          <ModalFormPG onClose={handleCloseFormPGModal} />
        </Modal>

        {/* Modal para Tipo de Categorias */}
        <Modal
          isOpen={isTipoCategoriaModalOpen}
          onClose={handleCloseTipoCategoriaModal}
          title="Tipo de Categorias"
        >
          <ModalTipoCategoria
            isOpen={isTipoCategoriaModalOpen}
            onClose={handleCloseTipoCategoriaModal}
            title="Tipo de Categorias"
          />
        </Modal>
        {/* Modal para Maquininha */}
        <Modal
          isOpen={isMaquininhaModalOpen}
          onClose={handleCloseMaquininhaModal}
          title="Maquininha"
        >
          <ModalMaquininha />
        </Modal>
      </div>
  );
};

export default Config;
