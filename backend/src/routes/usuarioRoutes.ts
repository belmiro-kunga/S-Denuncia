import { Router } from 'express';
import { cadastrarUsuario } from '../controllers/usuarioController';

const router = Router();

router.post('/', cadastrarUsuario);

export default router;
