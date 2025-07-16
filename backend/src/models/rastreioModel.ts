import { pool } from '../db';

export interface Rastreio {
  id?: number;
  denuncia_id: number;
  status: string;
  atualizado_em?: Date;
  observacao?: string;
}

export async function criarRastreio(rastreio: Rastreio): Promise<Rastreio> {
  const { denuncia_id, status, observacao } = rastreio;
  const result = await pool.query(
    'INSERT INTO rastreio_denuncia (denuncia_id, status, observacao) VALUES ($1, $2, $3) RETURNING *',
    [denuncia_id, status, observacao],
  );
  return result.rows[0];
}

export async function buscarRastreiosPorDenuncia(denuncia_id: number): Promise<Rastreio[]> {
  const result = await pool.query(
    'SELECT * FROM rastreio_denuncia WHERE denuncia_id = $1 ORDER BY atualizado_em DESC',
    [denuncia_id],
  );
  return result.rows;
}
