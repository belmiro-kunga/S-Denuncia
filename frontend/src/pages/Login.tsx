import React, { useState, useRef } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);
    setLoading(true);
    try {
      const resp = await fetch('http://localhost:3001/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      const data = await resp.json();
      if (resp.ok && data.token) {
        localStorage.setItem('token', data.token);
        setSucesso('Login realizado com sucesso!');
        navigate('/dashboard');
      } else {
        setErro(data.error || 'E-mail ou senha inválidos.');
      }
    } catch (err) {
      setErro('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="icon-pulse">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h1>Sistema de Denúncias</h1>
            <p className="subtitle">Bem-vindo de volta! Por favor, faça login para continuar.</p>
          </div>
          <div className="card-body">
            {sucesso && (
              <div className="alert success">
                <i className="fas fa-check-circle"></i> {sucesso}
                <button onClick={() => setSucesso(null)}>&times;</button>
              </div>
            )}
            {erro && (
              <div className="alert error">
                <i className="fas fa-exclamation-circle"></i> {erro}
                <button onClick={() => setErro(null)}>&times;</button>
              </div>
            )}
            <form onSubmit={handleSubmit} autoComplete="off">
              <label htmlFor="email">E-mail</label>
              <div className={`input-group${erro ? ' invalid' : ''}`}>
                <span className="input-icon"><i className="fas fa-envelope"></i></span>
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  autoComplete="username"
                  required
                />
                {erro && <span className="input-icon right"><i className="fas fa-times-circle"></i></span>}
              </div>
              <div className="label-row">
                <label htmlFor="senha">Senha</label>
                <a href="#" className="forgot">Esqueceu sua senha?</a>
              </div>
              <div className={`input-group${erro ? ' invalid' : ''}`}>
                <span className="input-icon"><i className="fas fa-lock"></i></span>
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="input-icon right eye"
                  onClick={() => setMostrarSenha(m => !m)}
                  tabIndex={-1}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <i className={`fas fa-eye${mostrarSenha ? '' : '-slash'}`}></i>
                </button>
                {erro && <span className="input-icon right"><i className="fas fa-times-circle"></i></span>}
              </div>
              <div className="remember-row">
                <label>
                  <input
                    type="checkbox"
                    checked={lembrar}
                    onChange={e => setLembrar(e.target.checked)}
                  />
                  Lembrar de mim
                </label>
              </div>
              <button className="login-btn" type="submit" disabled={loading}>
                <i className="fas fa-sign-in-alt"></i>
                {loading ? <span className="spinner"></span> : 'Login'}
              </button>
            </form>
            <div className="register-link">
              Novo no sistema? <a href="#">Criar uma conta</a>
            </div>
          </div>
          <div className="login-footer">
            <a href="/">
              <i className="fas fa-arrow-left"></i> Voltar para o início
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 