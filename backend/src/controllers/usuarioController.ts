import { Request, Response } from 'express';
import { criarUsuario, buscarUsuarioPorEmail } from '../models/usuarioModel';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

const usuarioSchema = Joi.object({
  nome: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
});

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

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

export async function loginUsuario(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }
    const usuario = await buscarUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }
    const senhaOk = await bcrypt.compare(senha, usuario.senha);
    if (!senhaOk) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch {
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
}
