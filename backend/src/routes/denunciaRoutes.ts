import { Router } from 'express';
import {
  cadastrarDenuncia,
  listarDenunciasPorUsuario,
  buscarDenuncia,
  buscarDenunciaPorClincodeController,
} from '../controllers/denunciaController';

const router = Router();

router.post('/', cadastrarDenuncia);
router.get('/usuario/:usuario_id', listarDenunciasPorUsuario);
router.get('/:id', buscarDenuncia);
router.get('/clincode/:clincode', buscarDenunciaPorClincodeController);

export default router;
