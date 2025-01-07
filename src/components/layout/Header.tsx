import React from 'react';
import {Button} from 'primereact/button';
import { useNavigate } from 'react-router-dom'; // Para navegação entre rotas
import { supabase } from '../../services/supabaseClient'; // Configuração do Supabase
import './layout.css'; // Estilos para o layout

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}
const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
  const navigate = useNavigate(); // Hook para navegação entre rotas

  // Função para lidar com o logout
  const handleLogout = async () => {
    try {
      // Desloga o usuário
      await supabase.auth.signOut();
      // Redireciona para a página de login
      navigate('/login');
      alert('Você foi deslogado com sucesso.');
    } catch (error) {
      console.error('Erro ao tentar deslogar:', error);
      alert('Ocorreu um erro ao tentar deslogar.');
    }
  };

  // Função para navegar para uma rota específica
  const handleNavigation = (path:any) => {
    navigate(path);
  };

  return (
    <header className="text-white bg-blue-600 aba">
      <div className="ma">
      <nav aria-label="Global" className="flex items-center justify-between p-2">

        <div className="border-white border-x-2">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <i
            className={`bi ${isSidebarOpen ? 'bi-x' : 'bi-list'}`}
            style={{ fontSize: '1.5rem' }}
          ></i>
        </button>
        </div>

        {/* Botão Home no centro */}
        <div className="flex">
          <button
            onClick={() => handleNavigation('/')}
            className="text-xl font-semibold leading-6 text-white hover:text-gray-300"
          >
            Home
          </button>
        </div>

        {/* Botão de Logout à direita */}
        <div className="flex justify-end">
        <div className="flex items-center">
      <Button
        icon="pi pi-cog"
        className="bttUser p-button-text p-button-rounded p-button-plain"
        onClick={() => handleNavigation('/config')}
        aria-label="Configurações"
      />

      <Button
        icon="pi pi-sign-out"
        className="bttUser p-button-text p-button-rounded p-button-plain"
        onClick={handleLogout}
        aria-label="Sair"
      />
    </div>

        </div>
      </nav>
      </div>
    </header>
  );
};

export default Header;
