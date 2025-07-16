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
  const [isFocused, setIsFocused] = useState(false);
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

    try {
      const resp = await fetch(`http://localhost:3001/rastreio/denuncia/${codigo}`);
      if (!resp.ok) throw new Error('Denúncia não encontrada. Verifique o número do protocolo.');
      const data = await resp.json();

      if (data.length === 0) {
        throw new Error('Nenhum registro encontrado para este protocolo.');
      }

      setResultado(data);
    } catch (err: any) {
      setErro(err.message || 'Ocorreu um erro ao buscar a denúncia. Tente novamente mais tarde.');
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
        return 'status-em-andamento';
      case 'concluído':
        return 'status-concluido';
      case 'pendente':
        return 'status-pendente';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'em andamento':
        return '🔄';
      case 'concluído':
        return '✅';
      case 'pendente':
        return '⏳';
      default:
        return '📋';
    }
  };

  return (
    <div className="rast-bg">
      <div className="rast-container">
        <div className="rast-card">
          <div className="rast-header">
            <div className="icon-pulse">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#4f46e5" />
                <path d="M15.5 9L11 13.5L8.5 11" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1>Rastrear Denúncia</h1>
            <p className="rast-sub">Acompanhe o andamento do seu caso de forma segura</p>
          </div>

          <form className="rast-form" onSubmit={handleSubmit}>
            <div className="label-row">
              <label htmlFor="codigo">Número do Protocolo</label>
              {!isValidProtocol && codigo.length >= 3 && (
                <span className="validation-error">Formato inválido</span>
              )}
            </div>
            <div className={`rast-input-group ${erro ? 'invalid' : ''} ${isFocused ? 'focused' : ''} ${!isValidProtocol && codigo.length >= 3 ? 'invalid' : ''}`}>
              <span className="rast-input-icon">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <input
                id="codigo"
                type="text"
                value={codigo}
                onChange={e => setCodigo(e.target.value.toUpperCase())}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ex: DEN-2024-001"
                disabled={loading}
                required
                aria-describedby="codigo-help"
              />
              <button
                type="submit"
                className="rast-btn rast-btn-blue"
                disabled={loading || !isValidProtocol}
                aria-label={loading ? 'Buscando...' : 'Buscar denúncia'}
              >
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden="true"></span>
                    <span>Buscando...</span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Rastrear</span>
                  </>
                )}
              </button>
            </div>

            <div className="rast-info" id="codigo-help">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="rast-info-icon">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <strong>Onde encontrar o número do protocolo?</strong>
                <p>O número do protocolo foi enviado para o e-mail cadastrado no momento da denúncia.</p>
              </div>
            </div>
          </form>

          <div className="rast-actions">
            <button
              className="rast-btn rast-btn-outline"
              type="button"
              onClick={() => window.location.href = '/denuncia'}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Nova Denúncia</span>
            </button>
          </div>

          <div className="rast-link-row">
            <a href="/" className="back-link">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Voltar para a página inicial
            </a>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="loading-skeleton">
              <div className="skeleton-header"></div>
              <div className="skeleton-timeline">
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton-item">
                    <div className="skeleton-circle"></div>
                    <div className="skeleton-content">
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line short"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {erro && (
            <div className="rastreio-erro">
              <div className="rastreio-erro-content">
                <div className="rastreio-erro-icon">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3>Não foi possível encontrar sua denúncia</h3>
                  <p>{erro}</p>
                  <button
                    className="rast-btn rast-btn-outline"
                    onClick={() => setErro(null)}
                    style={{ marginTop: '1rem' }}
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results Timeline */}
          {resultado && (
            <div className="rastreio-resultado">
              <div className="rastreio-header">
                <h2>Acompanhamento da Denúncia</h2>
                <div className="rastreio-protocolo">
                  <span>Protocolo:</span> {resultado[0]?.protocolo || codigo}
                </div>
              </div>

              <div className="timeline">
                {resultado.map((item, idx) => (
                  <div key={item.id} className={`timeline-item ${idx === 0 ? 'active' : ''}`}>
                    <div className="timeline-marker">
                      {idx === 0 ? (
                        <div className="timeline-icon active">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      ) : (
                        <div className="timeline-dot"></div>
                      )}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-status">
                        <span className={`status-badge ${getStatusClass(item.status)}`}>
                          <span className="status-icon">{getStatusIcon(item.status)}</span>
                          {item.status}
                        </span>
                        <span className="timeline-date">{formatarData(item.data_atualizacao)}</span>
                      </div>
                      <p className="timeline-desc">{item.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rastreio-actions">
                <button
                  className="rast-btn rast-btn-purple"
                  onClick={() => window.print()}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Imprimir Comprovante
                </button>
                <button
                  className="rast-btn rast-btn-outline"
                  onClick={() => {
                    setResultado(null);
                    setCodigo('');
                    setErro(null);
                  }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Nova Consulta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rastreio; 