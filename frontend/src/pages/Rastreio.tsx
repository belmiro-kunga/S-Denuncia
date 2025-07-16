import React, { useState, useEffect } from 'react';
import './Rastreio.css';

interface RastreioItem {
  id: number;
  status: string;
  descricao: string;
  data_atualizacao: string;
  protocolo: string;
}

const Rastreio: React.FC = () => {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState<RastreioItem[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isValidProtocol, setIsValidProtocol] = useState(true);

  // Validação do formato do protocolo em tempo real
  useEffect(() => {
    if (codigo.length > 0) {
      const protocolPattern = /^[A-Z]{3}-\d{4}-\d{3}$/;
      setIsValidProtocol(protocolPattern.test(codigo) || codigo.length < 3);
    } else {
      setIsValidProtocol(true);
    }
  }, [codigo]);

  // Verificar se há código na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codigoUrl = urlParams.get('codigo');
    if (codigoUrl) {
      setCodigo(codigoUrl);
      setCurrentStep(2);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim()) {
      setErro('Por favor, informe o número do protocolo.');
      return;
    }

    if (!isValidProtocol) {
      setErro('Formato do protocolo inválido. Use o formato: DEN-2024-001');
      return;
    }

    setErro(null);
    setResultado(null);
    setLoading(true);
    setCurrentStep(2);

    try {
      const resp = await fetch(`http://localhost:3001/rastreio/denuncia/${codigo}`);
      if (!resp.ok) throw new Error('Denúncia não encontrada. Verifique o número do protocolo.');
      const data = await resp.json();

      if (data.length === 0) {
        throw new Error('Nenhum registro encontrado para este protocolo.');
      }

      setResultado(data);
      setCurrentStep(3);
    } catch (err: any) {
      setErro(err.message || 'Ocorreu um erro ao buscar a denúncia. Tente novamente mais tarde.');
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'em andamento':
        return 'status-warning';
      case 'concluído':
        return 'status-success';
      case 'pendente':
        return 'status-secondary';
      default:
        return 'status-secondary';
    }
  };

  const resetForm = () => {
    setResultado(null);
    setCodigo('');
    setErro(null);
    setCurrentStep(1);
  };

  return (
    <div className="login-bg rastreio-bg">
      <div className="login-container rastreio-container">
        <div className="login-card rastreio-card">
          <div className="login-header rastreio-header">
            <div className="icon-pulse rastreio-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h1>Rastrear Denúncia</h1>
            <p className="subtitle rastreio-subtitle">Acompanhe o andamento da sua denúncia de forma simples e segura.</p>
          </div>
          {/* Indicador de Etapas */}
          <div className="step-indicator">
            <div className="step-container">
              <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="step-circle">
                  <i className="fas fa-edit"></i>
                </div>
                <span className="step-label">Informar Protocolo</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="step-circle">
                  <i className="fas fa-search"></i>
                </div>
                <span className="step-label">Buscar</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="step-circle">
                  <i className="fas fa-list-alt"></i>
                </div>
                <span className="step-label">Resultado</span>
              </div>
            </div>
          </div>

          {/* Corpo do Formulário */}
          <div className="card-body rastreio-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="codigo" className="form-label">
                  <i className="fas fa-file-alt me-2"></i>
                  Número do Protocolo
                </label>
                {!isValidProtocol && codigo.length >= 3 && (
                  <div className="validation-feedback">
                    <i className="fas fa-exclamation-triangle me-1"></i>
                    Formato inválido. Use: DEN-2024-001
                  </div>
                )}
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-hashtag"></i>
                  </span>
                  <input
                    type="text"
                    className={`form-control ${!isValidProtocol && codigo.length >= 3 ? 'is-invalid' : ''}`}
                    id="codigo"
                    value={codigo}
                    onChange={e => setCodigo(e.target.value.toUpperCase())}
                    placeholder="Ex: DEN-2024-001"
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-text">
                  <i className="fas fa-info-circle me-1"></i>
                  O número do protocolo foi enviado para o e-mail cadastrado no momento da denúncia.
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading || !isValidProtocol}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      BUSCANDO...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search me-2"></i>
                      RASTREAR DENÚNCIA
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={() => window.location.href = '/denuncia'}
                >
                  <i className="fas fa-plus me-2"></i>
                  NOVA DENÚNCIA
                </button>
              </div>
            </form>

            {/* Estado de Erro */}
            {erro && (
              <div className="alert alert-danger mt-4" role="alert">
                <div className="d-flex align-items-start">
                  <i className="fas fa-exclamation-triangle me-3 mt-1"></i>
                  <div className="flex-grow-1">
                    <h5 className="alert-heading">Erro na Consulta</h5>
                    <p className="mb-2">{erro}</p>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => setErro(null)}
                    >
                      <i className="fas fa-redo me-1"></i>
                      Tentar Novamente
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="loading-state mt-4">
                <div className="text-center">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                  <p className="text-muted">Buscando informações da denúncia...</p>
                </div>
              </div>
            )}

            {/* Resultados */}
            {resultado && (
              <div className="results-section mt-4">
                <div className="results-header">
                  <h3>
                    <i className="fas fa-clipboard-list me-2"></i>
                    Histórico da Denúncia
                  </h3>
                  <div className="protocol-info">
                    <span className="protocol-label">Protocolo:</span>
                    <span className="protocol-number">{resultado[0]?.protocolo || codigo}</span>
                  </div>
                </div>

                <div className="timeline-container">
                  {resultado.map((item, idx) => (
                    <div key={item.id} className={`timeline-item ${idx === 0 ? 'current' : ''}`}>
                      <div className="timeline-marker">
                        <div className={`timeline-icon ${getStatusClass(item.status)}`}>
                          <i className={`fas ${idx === 0 ? 'fa-clock' : 'fa-check'}`}></i>
                        </div>
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <span className={`status-badge ${getStatusClass(item.status)}`}>
                            {item.status.toUpperCase()}
                          </span>
                          <span className="timeline-date">
                            <i className="fas fa-calendar-alt me-1"></i>
                            {formatarData(item.data_atualizacao)}
                          </span>
                        </div>
                        <p className="timeline-description">{item.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="results-actions mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => window.print()}
                  >
                    <i className="fas fa-print me-2"></i>
                    IMPRIMIR COMPROVANTE
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    <i className="fas fa-search me-2"></i>
                    NOVA CONSULTA
                  </button>
                </div>
              </div>
            )}

            {/* Link de Volta */}
            <div className="back-link-container mt-4">
              <a href="/" className="back-link">
                <i className="fas fa-arrow-left me-2"></i>
                Voltar para a página inicial
              </a>
            </div>
          </div>

          {/* Rodapé de Privacidade */}
          <div className="privacy-footer">
            <div className="privacy-content">
              <i className="fas fa-shield-alt me-2"></i>
              <small>
                <strong>Privacidade e Segurança:</strong> Suas informações são protegidas e tratadas com total confidencialidade. 
                Este sistema utiliza criptografia para garantir a segurança dos seus dados.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rastreio; 