// src/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient'; // Importando o cliente Supabase
import PropTypes from 'prop-types';
// Criando o contexto de autenticação
const AuthContext = createContext();
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
// Provider que gerencia o estado de autenticação
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Armazena o usuário autenticado
  useEffect(() => {
    const checkSession = async () => {
        const { data: session, error } = await supabase.auth.getSession();
        if (!session?.user && !error) {
            console.log("Usuário não autenticado. Redirecionando para login...");
            // Redirecione para a página de login
        }
    };
    checkSession();
}, []);

  useEffect(() => {
    // Verifica se há uma sessão salva no Supabase
    const session = supabase.auth.getSession();
    setCurrentUser(session?.user || null); // Se houver um usuário na sessão, configura o currentUser

    // Escuta mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user || null; // Atualiza o currentUser conforme o evento de autenticação
      setCurrentUser(user);

      // Armazena a sessão no localStorage para persistir entre atualizações de página
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    });

    return () => {
      // Limpa a assinatura quando o componente for desmontado
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acessar o contexto de autenticação
export function useAuth() {
  return useContext(AuthContext);
}
