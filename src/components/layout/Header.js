import React from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegação entre rotas
import { supabase } from '../../services/supabaseClient'; // Configuração do Supabase
import './layout.css'; // Estilos para o layout
import IconeUser from '../../img/iconeuser.svg'
import IconeLogout from '../../img//iconelogout.svg'
const Header = ({ toggleSidebar, isSidebarOpen }) => {
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
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <header className="bg-blue-600 text-white aba">
      <div className="ma">
      <nav aria-label="Global" className="flex items-center justify-between p-2">

        <div className="border-x-2 border-white">
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

    <button
            onClick={() => handleNavigation('/config')}
            className="bttUser"
          >
            <img src={IconeUser} alt="IconeUser" />
          </button>

          <button
          className="bttUser"
            onClick={handleLogout}
          >
            <img src={IconeLogout} alt="IconeLogout" />
            
          </button>
      </div>

        </div>
      </nav>
      </div>
    </header>
  );
};

export default Header;
