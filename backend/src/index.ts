import express from 'express';
import cors from 'cors';
import { testConnection } from './db';
import usuarioRoutes from './routes/usuarioRoutes';
import denunciaRoutes from './routes/denunciaRoutes';
import rastreioRoutes from './routes/rastreioRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/usuarios', usuarioRoutes);
app.use('/denuncias', denunciaRoutes);
app.use('/rastreios', rastreioRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  testConnection();
});
