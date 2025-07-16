import { pool } from '../db';

export interface Denuncia {
  id?: number;
  usuario_id: number;
  titulo: string;
  descricao: string;
  status?: string;
  criado_em?: Date;
  clincode?: string;
}

function gerarClincode(tamanho = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < tamanho; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function criarDenuncia(denuncia: Denuncia): Promise<Denuncia> {
  const { usuario_id, titulo, descricao } = denuncia;
  let clincode: string;
  let tentativa = 0;
  // Garante unicidade do clincode
  do {
    clincode = gerarClincode();
    const result = await pool.query('SELECT 1 FROM denuncias WHERE clincode = $1', [clincode]);
    if (result.rowCount === 0) break;
    tentativa++;
  } while (tentativa < 5);

  const result = await pool.query(
    'INSERT INTO denuncias (usuario_id, titulo, descricao, clincode) VALUES ($1, $2, $3, $4) RETURNING *',
    [usuario_id, titulo, descricao, clincode]
  );
  return result.rows[0];
}

export async function buscarDenunciasPorUsuario(usuario_id: number): Promise<Denuncia[]> {
  const result = await pool.query('SELECT * FROM denuncias WHERE usuario_id = $1', [usuario_id]);
  return result.rows;
}

export async function buscarDenunciaPorId(id: number): Promise<Denuncia | null> {
  const result = await pool.query('SELECT * FROM denuncias WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function buscarDenunciaPorClincode(clincode: string): Promise<Denuncia | null> {
  const result = await pool.query('SELECT * FROM denuncias WHERE clincode = $1', [clincode]);
  return result.rows[0] || null;
}
