import React from 'react';
import { useNavigate, } from "react-router-dom";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import { Avatar } from 'primereact/avatar';
import { Ripple } from 'primereact/ripple';

const Sidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();

  const handleNavigation = (path: any) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="flex overflow-y-auto">
      <PrimeSidebar
        visible={isOpen}
        onHide={onClose}
        position="left"
        baseZIndex={1000}
        className="p-sidebar w-full sm:w-60 md:w-80 lg:w-90 bg-slate-900 shadow-lg"
      >
        <div className="flex flex-col p-1 h-full border-right: 2px solid #2e2e2e">
          <div className="flex justify-center bg-slate-700">
            <h2 className="text-white text-lg font-semibold mb-4">Menu</h2>

            <Ripple />
          </div>

          <div className="menu-section mb-1">
            <h3 className="text-black text-base font-medium mb-2">Cadastros</h3>
            <Button
              label="Configurações"
              icon="pi pi-cog"
              className="p-button-text text-black w-full text-left p-button-rounded p-button-outlined mb-2"
              onClick={() => handleNavigation("/config")}
            />
            <Ripple />
            <Button
              label="Pessoas"
              icon="pi pi-users"
              className="p-button-text text-black w-full text-left p-button-rounded p-button-outlined mb-2"
              onClick={() => handleNavigation("/pessoas")}
            />
            <Ripple />
          </div>

          <div className="menu-section mb-4">
            <h3 className="text-black text-base font-medium mb-2">Financeiro</h3>
            <Button
              label="Contas"
              icon="pi pi-book"
              className="p-button-text text-black w-full text-left p-button-rounded p-button-outlined mb-2"
              onClick={() => handleNavigation("/contas")}
            />
            <Ripple />
            <Button
              label="Caixa e Bancos"
              icon="pi pi-wallet"
              className="p-button-text text-black w-full text-left p-button-rounded p-button-outlined mb-2"
              onClick={() => handleNavigation("/caixabancos")}
            />
            <Ripple />
            <Button
              label="Contas a Pagar"
              icon="pi pi-money-bill"
              className="p-button-text text-black w-full text-left p-button-rounded p-button-outlined mb-2"
              onClick={() => handleNavigation("/contasapagar")}
            />
            <Ripple />
            <Button
              label="Contas a Receber"
              icon="pi pi-inbox"
              className="p-button-text text-black w-full text-left p-button-rounded p-button-outlined mb-2"
              onClick={() => handleNavigation("/contasresceber")}
            />
            <Ripple />
            <Button
              label="Relatório"
              icon="pi pi-file"
              className="p-button-text text-black w-full text-left p-button-rounded p-button-outlined mb-2"
              onClick={() => handleNavigation("/analisemovimentacao")}
            />
            <Ripple />
          </div>

          <div className="menu-section mb-4">
            <h3 className="text-black text-base font-medium mb-2">Outros</h3>
            <Button
              label="Upload e Tabela"
              icon="pi pi-upload"
              className="p-button-text text-black w-full text-left p-button-rounded p-button-outlined mb-2"
              onClick={() => handleNavigation("/uploadandtable")}
            />
            <Ripple />
          </div>

          <div className="menu-section mb-4">
            <Button
              label="Produto"
              icon="pi pi-box"
              className="p-button-text text-black w-full text-left p-button-rounded p-button-outlined mb-2"
              onClick={() => handleNavigation("/produto")}
            />
            <Ripple />
          </div>

          <div className="mt-auto">
            <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
            <div className="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple ">
              <Avatar icon="pi pi-user" shape="circle" size="large" />
              <div className="ml-3">
                <div className="font-medium">Nome do Usuário</div>
                <div className="text-sm font-light">Perfil</div>
              </div>
            </div>
            <Ripple />
          </div>
        </div>
      </PrimeSidebar>
    </div>
  );
};

export default Sidebar;
