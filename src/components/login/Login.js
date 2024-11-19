import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import logo from '../../img/logo.png';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [loading, setLoading] = useState(false);  // Adicionado para controlar o carregamento
  const navigate = useNavigate();

  // Verifique se o usuário já está autenticado
  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/home');
        console.log('Usuário autenticado:', session.user.email);
      }
    }
    checkUser();
  }, [navigate]);

  // Função de envio do formulário (login)
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true); // Inicia o carregamento
    setError(null);   // Limpa o erro anterior

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw error;
      }

      navigate('/home');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  }

  // Função para enviar e-mail de recuperação de senha
  async function handleResetPassword(event) {
    event.preventDefault();
    setLoading(true);  // Inicia o carregamento
    setError(null);    // Limpa o erro anterior

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
      if (error) {
        throw error;
      }
      alert('E-mail de recuperação enviado, verifique sua caixa de entrada.');
      setIsResetting(false);  // Volta ao login após o envio
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);  // Finaliza o carregamento
    }
  }

  return (
    <div className="component">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img alt="Your Company" src={logo} className="mx-auto h-28 w-auto" />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            {isResetting ? 'Redefinir Senha' : 'Entre na sua conta'}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {!isResetting ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  Endereço de Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Senha
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  disabled={loading} // Desabilita o botão durante o carregamento
                >
                  {loading ? 'Carregando...' : 'Entrar'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-900">
                  Endereço de Email
                </label>
                <div className="mt-2">
                  <input
                    id="resetEmail"
                    name="resetEmail"
                    type="email"
                    required
                    autoComplete="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  disabled={loading} // Desabilita o botão durante o carregamento
                >
                  {loading ? 'Enviando...' : 'Enviar E-mail de Recuperação'}
                </button>
              </div>
            </form>
          )}

          <p className="mt-10 text-center text-sm text-gray-500">
            {isResetting ? (
              <span>
                Lembrei da minha senha{' '}
                <a
                  href="#"
                  onClick={() => setIsResetting(false)}
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Voltar para login
                </a>
              </span>
            ) : (
              <span>
                Esqueceu a senha?{' '}
                <a
                  href="#"
                  onClick={() => setIsResetting(true)}
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Redefina aqui
                </a>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
