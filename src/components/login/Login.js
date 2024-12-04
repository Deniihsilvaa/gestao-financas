import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import logo from "../../img/logo.png";
import BackFUndo from "../../img/Login.jpg";
export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [loading, setLoading] = useState(false); // Adicionado para controlar o carregamento
  const navigate = useNavigate();

  // Verifique se o usuário já está autenticado
  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        navigate("/home");
        console.log("Usuário autenticado:", session.user.email);
      }
    }
    checkUser();
  }, [navigate]);

  // Função de envio do formulário (login)
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true); // Inicia o carregamento
    setError(null); // Limpa o erro anterior

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      navigate("/home");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  }

  // Função para enviar e-mail de recuperação de senha
  async function handleResetPassword(event) {
    event.preventDefault();
    setLoading(true); // Inicia o carregamento
    setError(null); // Limpa o erro anterior

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
      if (error) {
        throw error;
      }
      alert("E-mail de recuperação enviado, verifique sua caixa de entrada.");
      setIsResetting(false); // Volta ao login após o envio
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  }

  return (
    <div className="relative flex items-center justify-center w-full h-screen bg-gradient-to-b from-indigo-900 to-blue-900">
      {/* Estrelas no fundo */}
      <div className="inset-0 overflow-hidden ">
        {/* Estrelas animadas espalhadas */}
        {Array.from({ length: 30 }).map((_, index) => (
          <div
            key={index}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`, // Posição vertical aleatória
              left: `${Math.random() * 100}%`, // Posição horizontal aleatória
              animationDelay: `${Math.random() * 2}s`, // Atraso de animação aleatório
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-md p-8 bg-blue-800 rounded-lg shadow-lg bg-opacity-80">
        <div className="text-center">
          <img
            alt="Daily Control"
            src={logo}
            className="w-auto h-16 mx-auto mb-4"
          />
          <h2 className="text-xl font-bold tracking-tight text-white">
            {isResetting ? "Redefinir Senha" : "Bem-vindo de volta!"}
          </h2>
        </div>

        <div className="mt-6">
          {!isResetting ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-200"
                >
                  Endereço de Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-2 mt-1 text-gray-900 placeholder-gray-400 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200"
                >
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-2 mt-1 text-gray-900 placeholder-gray-400 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                type="submit"
                className="w-full py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? "Carregando..." : "Entrar"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label
                  htmlFor="resetEmail"
                  className="block text-sm font-medium text-gray-200"
                >
                  Endereço de Email
                </label>
                <input
                  id="resetEmail"
                  name="resetEmail"
                  type="email"
                  required
                  autoComplete="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="block w-full px-4 py-2 mt-1 text-gray-900 placeholder-gray-400 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar E-mail de Recuperação"}
              </button>
            </form>
          )}

          <p className="mt-4 text-sm text-center text-gray-300">
            {isResetting ? (
              <>
                Lembrei da minha senha{" "}
                <button
                  onClick={() => setIsResetting(false)}
                  className="font-semibold text-indigo-400 hover:underline"
                >
                  Voltar para login
                </button>
              </>
            ) : (
              <>
                Esqueceu a senha?{" "}
                <button
                  onClick={() => setIsResetting(true)}
                  className="font-semibold text-indigo-400 hover:underline"
                >
                  Redefina aqui
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
