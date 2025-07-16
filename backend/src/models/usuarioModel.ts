import { pool } from '../db';

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  criado_em?: Date;
}

export async function criarUsuario(usuario: Usuario): Promise<Usuario> {
  const { nome, email, senha } = usuario;
  const result = await pool.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
    [nome, email, senha],
  );
  return result.rows[0];
}

export async function buscarUsuarioPorEmail(email: string): Promise<Usuario | null> {
  const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return result.rows[0] || null;
}
