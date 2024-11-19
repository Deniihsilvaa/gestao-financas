import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Use o contexto de autenticação

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth(); // Recupera o usuário autenticado

  if (!currentUser) {
    // Redireciona para login se não estiver autenticado
    return <Navigate to="/login" />;
  }

  return children; // Retorna os filhos se estiver autenticado
}

export default ProtectedRoute;
