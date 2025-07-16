import { Router } from 'express';
import { cadastrarRastreio, listarRastreiosPorDenuncia } from '../controllers/rastreioController';

const router = Router();

router.post('/', cadastrarRastreio);
router.get('/denuncia/:denuncia_id', listarRastreiosPorDenuncia);

export default router;
