import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import logo from "../../img/logo.png";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        navigate("/home");
      }
    };
    checkUser();
  }, [navigate]);
  

  // Função de login
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      navigate("/home");
    } catch (error: any) {
      setError(error.message || "Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para redefinir a senha
  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
      if (error) throw error;

      alert("E-mail de recuperação enviado. Verifique sua caixa de entrada.");
      setIsResetting(false);
    } catch (error: any) {
      setError(error.message || "Erro ao enviar o e-mail. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-b from-indigo-900 to-blue-900">
      {/* Estrelas no fundo */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, index) => (
          <div
            key={index}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-md p-8 bg-blue-800 rounded-lg shadow-lg bg-opacity-80">
        <div className="text-center">
          <img src={logo} alt="Daily Control" className="w-auto h-16 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">
            {isResetting ? "Redefinir Senha" : "Bem-vindo de volta!"}
          </h2>
        </div>

        <div className="mt-6">
          {error && <p className="text-xs text-red-400">{error}</p>}

          {!isResetting ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm text-gray-200">
                  Endereço de Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full px-4 py-2 text-gray-900 rounded-md bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-gray-200">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full px-4 py-2 text-gray-900 rounded-md bg-gray-50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md"
                disabled={loading}
              >
                {loading ? "Carregando..." : "Entrar"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="resetEmail" className="block text-sm text-gray-200">
                  Endereço de Email
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="block w-full px-4 py-2 text-gray-900 rounded-md bg-gray-50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar E-mail"}
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
