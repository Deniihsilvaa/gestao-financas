import React from "react";
import { useNavigate } from "react-router-dom";
import "./layout.css"; // Arquivo de estilos para animações

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside
      className={`sidebar bg-slate-900 text-white transition-all duration-500 ${
        isOpen ? "w-60" : "w-0 overflow-hidden"
      }`}
    >
      <div className="p-4">
        <button
          onClick={toggleSidebar}
          className="text-white text-lg mb-4 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <i className={`bi ${isOpen ? "bi-x" : "bi-list"}`} style={{ fontSize: "1.5rem" }}></i>
        </button>
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
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => handleNavigation("/config")}
                  >
                    Configuração Geral
                  </a>
                  <a className="dropdown-item" href="#">
                    Pessoas
                  </a>
                  <a className="dropdown-item" href="#">
                    Conta
                  </a>
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
                Finaças
              </button>
              <ul className="dropdown-menu">
                <li>
                <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => handleNavigation("/contas")}
                  >
                    Contas Gerais
                  </a>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => handleNavigation("/caixabancos")}
                  >
                    Caixa e Bancos
                  </a>
                  <a className="dropdown-item" href="#"
                  onClick={() => handleNavigation("/contasapagar")}
                  >
                    Contas a Pagar
                  </a>
                  <a className="dropdown-item" href="#"
                   onClick={() => handleNavigation("/contasresceber")}
                  >
                    Conta a Resceber
                  </a>
                  <a className="dropdown-item" href="#">
                    Relatorio
                  </a>
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
