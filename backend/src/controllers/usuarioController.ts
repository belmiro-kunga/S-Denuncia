import { Request, Response } from 'express';
import { criarUsuario, buscarUsuarioPorEmail } from '../models/usuarioModel';

export async function cadastrarUsuario(req: Request, res: Response) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }
    const usuarioExistente = await buscarUsuarioPorEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }
    const usuario = await criarUsuario({ nome, email, senha });
    res.status(201).json(usuario);
  } catch (_err) {
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
}
