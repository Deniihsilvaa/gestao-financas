import React, { useState } from 'react';
import { createClient } from '../../services/clientService'; // Importando a função para criar cliente

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Função de envio do formulário para criar o cliente
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      // Criando cliente no Supabase
      const clientData = {
        email,
        password,
      };

      await createClient(clientData); // Chamando a função de criação de cliente

      // Lógica após a criação do cliente, como redirecionamento ou mensagem de sucesso
      console.log('Cliente criado com sucesso');
    } catch (error) {
      setError(error.message); // Exibe a mensagem de erro se houver
      console.error('Erro ao criar cliente:', error);
    }
  }

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Senha:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Register;
