import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Importações do react-router-dom
import Login from './Login';
import App from './App';  // Página de destino (AppPage)
import reportWebVitals from './reportWebVitals';

// Criando o root da aplicação
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>  {/* Envolvendo com Router para definir rotas */}
    <Routes>
      <Route path="/" element={<Login />} />  {/* Rota para Login */}
      <Route path="/App" element={<App />} />  {/* Rota para a página App */}
    </Routes>
  </Router>
);

// Se você quiser medir a performance na aplicação, use reportWebVitals
reportWebVitals();
