import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./layout.css"; // Arquivo de estilos para animações

const Sidebar = ({ isOpen,onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <aside
      className={`sidebar bg-slate-900 text-white transition-all duration-500 ${
        isOpen ? "w-60" : "w-0 overflow-hidden"
      }`}
    >
      <div className="p-4">

        {isOpen && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Menu</h2>
            <div className="dropdown">
              <button
                className="buton dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Cadastros
              </button>
              <ul className="dropdown-menu">
                <li>
                  {/* Substituído por botão estilizado */}
                  <button
                    className="dropdown-item"
                    onClick={() => handleNavigation("/config")}
                  >
                    Configuração Geral
                  </button>
                  {/* Ou usar Link */}
                  <Link className="dropdown-item" to="/pessoas">
                    Pessoas
                  </Link>
                  <Link className="dropdown-item" to="/conta">
                    Conta
                  </Link>
                </li>
              </ul>
            </div>

            <div className="dropdown">
              <button
                className="buton dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Finanças
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleNavigation("/contas")}
                  >
                    Contas Gerais
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handleNavigation("/caixabancos")}
                  >
                    Caixa e Bancos
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handleNavigation("/contasapagar")}
                  >
                    Contas a Pagar
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handleNavigation("/contasresceber")}
                  >
                    Contas a Receber
                  </button>
                  <Link className="dropdown-item" to="/relatorio">
                    Relatório
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
