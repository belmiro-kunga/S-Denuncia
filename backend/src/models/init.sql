-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de denúncias
CREATE TABLE IF NOT EXISTS denuncias (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'aberta',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de rastreio de denúncia
CREATE TABLE IF NOT EXISTS rastreio_denuncia (
  id SERIAL PRIMARY KEY,
  denuncia_id INTEGER REFERENCES denuncias(id),
  status VARCHAR(50) NOT NULL,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  observacao TEXT
); 