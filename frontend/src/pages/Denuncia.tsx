import React, { useState } from 'react';
import './Denuncia.css';

interface FormData {
  tipo_denuncia: string;
  descricao: string;
  local_ocorrencia: string;
  data_ocorrencia: string;
  nome_denunciante: string;
  email_denunciante: string;
  telefone_denunciante: string;
  anonima: boolean;
  evidencias: File[];
}

const Denuncia: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [protocoloGerado, setProtocoloGerado] = useState('');
  const [formData, setFormData] = useState<FormData>({
    tipo_denuncia: '',
    descricao: '',
    local_ocorrencia: '',
    data_ocorrencia: '',
    nome_denunciante: '',
    email_denunciante: '',
    telefone_denunciante: '',
    anonima: false,
    evidencias: []
  });

  const totalSteps = 4;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        evidencias: Array.from(e.target.files || [])
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular envio para API
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'evidencias') {
          (value as File[]).forEach(file => {
            formDataToSend.append('evidencias', file);
          });
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      const response = await fetch('http://localhost:3001/denuncias', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        setProtocoloGerado(result.protocolo || `DEN-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
        setSuccess(true);
        setCurrentStep(totalSteps + 1);
      } else {
        throw new Error('Erro ao enviar denúncia');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar denúncia. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3><i className="fas fa-exclamation-triangle me-2"></i>Tipo de Denúncia</h3>
            <div className="form-group">
              <label htmlFor="tipo_denuncia" className="form-label">
                <i className="fas fa-list me-2"></i>Selecione o tipo de denúncia
              </label>
              <select
                className="form-control"
                id="tipo_denuncia"
                name="tipo_denuncia"
                value={formData.tipo_denuncia}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione uma opção</option>
                <option value="corrupcao">Corrupção</option>
                <option value="assedio">Assédio</option>
                <option value="discriminacao">Discriminação</option>
                <option value="fraude">Fraude</option>
                <option value="abuso_poder">Abuso de Poder</option>
                <option value="outros">Outros</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="local_ocorrencia" className="form-label">
                <i className="fas fa-map-marker-alt me-2"></i>Local da Ocorrência
              </label>
              <input
                type="text"
                className="form-control"
                id="local_ocorrencia"
                name="local_ocorrencia"
                value={formData.local_ocorrencia}
                onChange={handleInputChange}
                placeholder="Ex: Departamento, Setor, Endereço..."
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="data_ocorrencia" className="form-label">
                <i className="fas fa-calendar-alt me-2"></i>Data da Ocorrência
              </label>
              <input
                type="date"
                className="form-control"
                id="data_ocorrencia"
                name="data_ocorrencia"
                value={formData.data_ocorrencia}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3><i className="fas fa-file-alt me-2"></i>Descrição da Denúncia</h3>
            <div className="form-group">
              <label htmlFor="descricao" className="form-label">
                <i className="fas fa-edit me-2"></i>Descreva detalhadamente o ocorrido
              </label>
              <textarea
                className="form-control"
                id="descricao"
                name="descricao"
                rows={8}
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Descreva os fatos de forma clara e objetiva. Inclua datas, horários, pessoas envolvidas e qualquer informação relevante..."
                required
              />
              <div className="form-text">
                <i className="fas fa-info-circle me-1"></i>
                Seja o mais específico possível. Informações detalhadas ajudam na investigação.
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3><i className="fas fa-paperclip me-2"></i>Evidências (Opcional)</h3>
            <div className="form-group">
              <label htmlFor="evidencias" className="form-label">
                <i className="fas fa-upload me-2"></i>Anexar Documentos, Fotos ou Vídeos
              </label>
              <input
                type="file"
                className="form-control"
                id="evidencias"
                name="evidencias"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mp3"
                onChange={handleFileChange}
              />
              <div className="form-text">
                <i className="fas fa-info-circle me-1"></i>
                Formatos aceitos: PDF, DOC, DOCX, JPG, PNG, MP4, MP3. Máximo 10MB por arquivo.
              </div>
              {formData.evidencias.length > 0 && (
                <div className="files-preview mt-3">
                  <h6>Arquivos selecionados:</h6>
                  <ul className="list-group">
                    {formData.evidencias.map((file, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <span><i className="fas fa-file me-2"></i>{file.name}</span>
                        <span className="badge bg-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3><i className="fas fa-user me-2"></i>Identificação (Opcional)</h3>
            <div className="form-group">
              <div className="form-check form-switch mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="anonima"
                  name="anonima"
                  checked={formData.anonima}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="anonima">
                  <i className="fas fa-user-secret me-2"></i>
                  <strong>Denúncia Anônima</strong>
                </label>
              </div>
            </div>

            {!formData.anonima && (
              <>
                <div className="form-group">
                  <label htmlFor="nome_denunciante" className="form-label">
                    <i className="fas fa-user me-2"></i>Nome Completo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nome_denunciante"
                    name="nome_denunciante"
                    value={formData.nome_denunciante}
                    onChange={handleInputChange}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email_denunciante" className="form-label">
                    <i className="fas fa-envelope me-2"></i>E-mail
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email_denunciante"
                    name="email_denunciante"
                    value={formData.email_denunciante}
                    onChange={handleInputChange}
                    placeholder="seu.email@exemplo.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefone_denunciante" className="form-label">
                    <i className="fas fa-phone me-2"></i>Telefone
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="telefone_denunciante"
                    name="telefone_denunciante"
                    value={formData.telefone_denunciante}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </>
            )}

            <div className="alert alert-info mt-4">
              <i className="fas fa-info-circle me-2"></i>
              <strong>Informação:</strong> Seus dados pessoais serão mantidos em sigilo e utilizados apenas para contato, se necessário.
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (success) {
    return (
      <div className="denuncia-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="form-container">
                <div className="success-header">
                  <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h1>Denúncia Enviada com Sucesso!</h1>
                  <p>Sua denúncia foi registrada e será analisada pela nossa equipe</p>
                </div>
                
                <div className="success-body">
                  <div className="protocol-card">
                    <h4><i className="fas fa-hashtag me-2"></i>Número do Protocolo</h4>
                    <div className="protocol-number">{protocoloGerado}</div>
                    <p className="protocol-info">
                      <i className="fas fa-info-circle me-1"></i>
                      Guarde este número para acompanhar o andamento da sua denúncia
                    </p>
                  </div>

                  <div className="next-steps">
                    <h5><i className="fas fa-list-ol me-2"></i>Próximos Passos</h5>
                    <ul className="steps-list">
                      <li><i className="fas fa-envelope me-2"></i>Você receberá um e-mail de confirmação</li>
                      <li><i className="fas fa-search me-2"></i>Nossa equipe analisará sua denúncia</li>
                      <li><i className="fas fa-bell me-2"></i>Você será notificado sobre atualizações</li>
                    </ul>
                  </div>

                  <div className="success-actions">
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={() => window.location.href = `/rastreio?codigo=${protocoloGerado}`}
                    >
                      <i className="fas fa-search me-2"></i>
                      ACOMPANHAR DENÚNCIA
                    </button>
                    <button
                      className="btn btn-secondary btn-lg"
                      onClick={() => window.location.href = '/'}
                    >
                      <i className="fas fa-home me-2"></i>
                      VOLTAR AO INÍCIO
                    </button>
                  </div>
                </div>

                <div className="privacy-footer">
                  <div className="privacy-content">
                    <i className="fas fa-shield-alt me-2"></i>
                    <small>
                      <strong>Confidencialidade Garantida:</strong> Todas as informações são tratadas com máxima segurança e confidencialidade.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-bg denuncia-bg">
      <div className="login-container denuncia-container">
        <div className="login-card denuncia-card">
          <div className="login-header denuncia-header">
            <div className="icon-pulse denuncia-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h1>Registrar Denúncia</h1>
            <p className="subtitle denuncia-subtitle">Preencha o formulário abaixo para registrar sua denúncia de forma segura e confidencial.</p>
          </div>
          {/* Indicador de Etapas */}
          <div className="step-indicator">
            <div className="step-container">
              {[1, 2, 3, 4].map((step) => (
                <React.Fragment key={step}>
                  <div className={`step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}>
                    <div className="step-circle">
                      {currentStep > step ? (
                        <i className="fas fa-check"></i>
                      ) : (
                        <span>{step}</span>
                      )}
                    </div>
                    <span className="step-label">
                      {step === 1 && 'Tipo'}
                      {step === 2 && 'Descrição'}
                      {step === 3 && 'Evidências'}
                      {step === 4 && 'Identificação'}
                    </span>
                  </div>
                  {step < 4 && <div className={`step-line ${currentStep > step ? 'completed' : ''}`}></div>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Corpo do Formulário */}
          <div className="card-body denuncia-body">
            <form onSubmit={handleSubmit}>
              {renderStep()}

              {/* Navegação */}
              <div className="form-navigation">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={prevStep}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    ANTERIOR
                  </button>
                )}
                
                <div className="ms-auto">
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={nextStep}
                    >
                      PRÓXIMO
                      <i className="fas fa-arrow-right ms-2"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-success btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          ENVIANDO...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          ENVIAR DENÚNCIA
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>

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
                <strong>Privacidade e Segurança:</strong> Suas informações são protegidas por criptografia e tratadas com total confidencialidade. 
                Este sistema garante o anonimato quando solicitado e segue rigorosos protocolos de segurança.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Denuncia; 