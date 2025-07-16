import { Request, Response } from 'express';
import { criarUsuario, buscarUsuarioPorEmail } from '../models/usuarioModel';
import bcrypt from 'bcrypt';
import Joi from 'joi';

const usuarioSchema = Joi.object({
  nome: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
});

export async function cadastrarUsuario(req: Request, res: Response) {
  try {
    const { nome, email, senha } = req.body;
    const { error } = usuarioSchema.validate({ nome, email, senha });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }
    const usuarioExistente = await buscarUsuarioPorEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await criarUsuario({ nome, email, senha: senhaHash });
    res.status(201).json(usuario);
  } catch {
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
}
