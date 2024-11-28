import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient'; // Importando o cliente Supabase
import { User } from '@supabase/auth-js'; // Importando os tipos corretos do Supabase
import { AuthContextType, AuthProviderProps } from './type'; // Tipagem do contexto

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Armazena o usuário autenticado

  // Função para verificar a sessão ao inicializar o componente
  const checkSession = async () => {
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
      setCurrentUser(user); // Atualiza o estado de currentUser conforme o evento de autenticação

      // Lógica de redirecionamento conforme os eventos de autenticação
      if (event === 'SIGNED_OUT') {
        alert('Usuário deslogado com sucesso.');
        console.log('Usuário deslogado. Redirecionando para login...');
      }

      // Armazena a sessão no localStorage para persistir entre atualizações de página
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    });

    // Limpa a assinatura quando o componente for desmontado
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Executa apenas uma vez durante a montagem do componente

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
