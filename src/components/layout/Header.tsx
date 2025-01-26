import React from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom"; // Navegação entre rotas
import { supabase } from "../../services/supabaseClient"; // Configuração do Supabase
import "./layout.css"; // Estilos adicionais

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
  const navigate = useNavigate();

  // Função para lidar com o logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      navigate("/login");
      alert("Você foi deslogado com sucesso.");
    } catch (error) {
      console.error("Erro ao tentar deslogar:", error);
      alert("Ocorreu um erro ao tentar deslogar.");
    }
  };

  // Configuração dos itens do Menubar
  const menuItems = [
    {
      label: "Início",
      icon: "pi pi-home",
      command: () => navigate("/"),
    },
    {
      label: "Configurações",
      icon: "pi pi-cog",
      command: () => navigate("/config"),
    },
    {
      label: "Sair",
      icon: "pi pi-sign-out",
      command: handleLogout,
    },
  ];

  // Template para o ícone de logo e toggle
  const start = (
    <div className="flex items-center space-x-4">
      <button
        className="p-button p-button-text p-button-rounded"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <i className="pi pi-list"></i>
      </button>
      <span className="text-lg font-semibold text-gray-800">Domifin</span>
    </div>
  );

  return (
    <Menubar model={menuItems} start={start} />
  );
};

export default Header;
