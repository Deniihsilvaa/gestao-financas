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
      // apagar cache
      localStorage.clear();
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
    <header className="bg-gray-100 border-b border-gray-300 aba">
      <div className="flex items-center justify-between p-4 ma">
        <div className="flex items-center space-x-4">
          <Button
            icon="pi pi-list"
            className="p-button-text p-button-rounded"
            style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          />
          <span className="text-lg font-semibold text-gray-800">
          Domifin
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            label="Inicio"
            icon="pi pi-home"
            className="p-button-text p-button-rounded"
            style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
            onClick={() => handleNavigation('/')}
            aria-label="Home"
          />
          
          <Button
            label="Configurações"
            icon="pi pi-cog"
            className="p-button-text p-button-rounded"
            style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
            onClick={() => handleNavigation('/config')}
            aria-label="Configurações"	
          />
          
          <Button
            label="Sair"
            icon="pi pi-sign-out"
            className="p-button-text p-button-rounded"
            style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
            onClick={handleLogout}
            aria-label="Sair"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
