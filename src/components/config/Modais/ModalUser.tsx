import React, { useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import {ModalRegistroProps,FormData } from "../type";

const ModalRegistro: React.FC<ModalRegistroProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    role: "",
    access_level: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(!name || !value){
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleRegister = async () => {
    const { email, password, name, role, access_level } = formData;

    if (!email || !password || !name || !role || !access_level) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Registra o usuário no sistema de autenticação do Supabase
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        if (authError.message === "User already registered") {
          alert(
            "Erro ao registrar o usuário. O email inserido já está em uso."
          );
        }
        return;
      }

      const userId = data?.user?.id;

      // Insere os dados adicionais do usuário na tabela `general_data`
      const { error: dbError,data: dbData } = await supabase.from("general_data").insert([
        {
          tokenID: userId, // ID gerado pelo Supabase Auth
          name,
          email,
          role,
          access_level,
        },
      ]);
      console.log('Dados Salvo',dbData);
      if (dbError) {
        alert("Erro ao salvar os dados no banco de dados.");
      } else {
        alert("Usuário registrado com sucesso!");
        onClose(); // Fecha o modal após o sucesso
      }
    } catch (err) {
      alert("Erro inesperado. Tente novamente.");
      console.error(err);
    }
  };

  return (
    <div>
      <form>
        <div className="input-group mb-3">
          <span className="input-group-text">
            Nome:
          </span>
          <input
            type="text"
            className="form-control"
            name="name"
            id="name" // Agora a associação visual é feita pelo id
            placeholder="Digite o nome"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">
            Email:
          </span>
          <input
            className="form-control"
            type="email"
            name="email"
            id="email"
            placeholder="Digite o email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">
            Senha:
          </span>
          <input
            className="form-control"
            type="password"
            name="password"
            id="password"
            placeholder="Digite a senha"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">
            Função:
          </span>
          <input
            className="form-control"
            type="text"
            name="role"
            id="role"
            placeholder="Ex: administrador, usuário"
            value={formData.role}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">
            Nível de Acesso:
          </span>
          <input
            className="form-control"
            type="text"
            name="access_level"
            id="access_level"
            placeholder="Ex: 1,2,3"
            value={formData.access_level}
            onChange={handleInputChange}
          />
        </div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleRegister}
        >
          Registrar
        </button>
      </form>
    </div>
  );
  
};

export default ModalRegistro;
