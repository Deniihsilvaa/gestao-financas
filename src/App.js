import React from 'react';
import { AuthProvider } from './AuthContext'; // Importando o AuthProvider
import Rota from './hooks/rota';
function App() {
  return (
    <AuthProvider> 
      <Rota />
    </AuthProvider>
  );
}

export default App;
