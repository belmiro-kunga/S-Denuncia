import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Denuncia from './pages/Denuncia';

function Home() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Sistema de Denúncia</h1>
      <nav style={{ marginBottom: 24 }}>
        <Link to="/denuncia" style={{ marginRight: 16 }}>Denúncia</Link>
        <Link to="/rastreio" style={{ marginRight: 16 }}>Rastreio de Denúncia</Link>
        <Link to="/login">Login</Link>
      </nav>
      <p>Bem-vindo ao sistema! Escolha uma opção no menu.</p>
    </div>
  );
}

function Rastreio() {
  return <h2>Página de Rastreio de Denúncia (em construção)</h2>;
}
function Login() {
  return <h2>Página de Login (em construção)</h2>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/denuncia" element={<Denuncia />} />
        <Route path="/rastreio" element={<Rastreio />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
