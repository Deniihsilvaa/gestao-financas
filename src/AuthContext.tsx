import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient'; // Importando o cliente Supabase
import { User } from '@supabase/auth-js'; // Importando os tipos corretos do Supabase
import { AuthContextType, AuthProviderProps } from './type'; // Tipagem do contexto

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Armazena o usuário autenticado

  const checkSession = async () => {
    // Verifica a sessão do usuário no cache
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      setCurrentUser(JSON.parse(cachedUser));
      return;
    }
    const { data, error } = await supabase.auth.getSession();
    const session = data?.session || null;
    if (!session?.user && !error) {
      return;
    }
    setCurrentUser(session?.user || null);
  };

  // Verifica a sessão uma vez ao montar o componente
  useEffect(() => {
    checkSession();
  }, []); // Apenas executa uma vez quando o componente é montado

  // Função para escutar mudanças no estado de autenticação
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user || null;
      setCurrentUser(user);
      if (event === 'SIGNED_OUT') {
        alert('Usuário deslogado com sucesso.');
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acessar o contexto de autenticação
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
