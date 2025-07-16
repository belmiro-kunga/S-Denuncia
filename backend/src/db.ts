import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres', // ajuste se necessário
  host: 'localhost',
  database: 'sistema_denuncia',
  password: 'proativa_2025', // senha atualizada
  port: 5432,
});

// Exemplo de teste de conexão
export async function testConnection() {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('Conexão com o PostgreSQL bem-sucedida!');
  } catch (err) {
    console.error('Erro ao conectar ao PostgreSQL:', err);
  }
}
