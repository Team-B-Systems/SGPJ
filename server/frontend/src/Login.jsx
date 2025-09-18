import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { username: "", password: "" };

    if (!username.trim()) {
      newErrors.username = "Informe o E-mail";
      valid = false;
    }
    if (!password.trim()) {
      newErrors.password = "Por favor, informe sua senha";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    // Simulação de login
    if (username === "admin@gmail.com" && password === "123456") {
      navigate("/App");
    } else {
      alert("E-mail ou senha incorretos.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo">
          <h1>SGPJ</h1>
          <p>Sistema de Gestão de Processos Jurídicos</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">E-mail</label>
            <input
              type="text"
              id="username"
              placeholder="Digite seu e-mail"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <div className="error-message">{errors.username}</div>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Digite a palavra-Pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          <button type="submit" className="btn-login">
            Iniciar sessão
          </button>

          <div className="options">
            <div className="remember-me"></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
