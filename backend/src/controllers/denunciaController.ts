import { Request, Response } from 'express';
import {
  criarDenuncia,
  buscarDenunciasPorUsuario,
  buscarDenunciaPorId,
  buscarDenunciaPorClincode,
} from '../models/denunciaModel';

export async function cadastrarDenuncia(req: Request, res: Response) {
  try {
    const { usuario_id, titulo, descricao } = req.body;
    if (!usuario_id || !titulo || !descricao) {
      return res.status(400).json({ error: 'Usuário, título e descrição são obrigatórios.' });
    }
    const denuncia = await criarDenuncia({ usuario_id, titulo, descricao });
    res.status(201).json(denuncia);
  } catch {
    res.status(500).json({ error: 'Erro ao cadastrar denúncia.' });
  }
}

export async function listarDenunciasPorUsuario(req: Request, res: Response) {
  try {
    const usuario_id = Number(req.params.usuario_id);
    if (!usuario_id) {
      return res.status(400).json({ error: 'ID do usuário é obrigatório.' });
    }
    const denuncias = await buscarDenunciasPorUsuario(usuario_id);
    res.json(denuncias);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar denúncias.' });
  }
}

export async function buscarDenuncia(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'ID da denúncia é obrigatório.' });
    }
    const denuncia = await buscarDenunciaPorId(id);
    if (!denuncia) {
      return res.status(404).json({ error: 'Denúncia não encontrada.' });
    }
    res.json(denuncia);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar denúncia.' });
  }
}

export async function buscarDenunciaPorClincodeController(req: Request, res: Response) {
  try {
    const { clincode } = req.params;
    if (!clincode) {
      return res.status(400).json({ error: 'Clincode é obrigatório.' });
    }
    const denuncia = await buscarDenunciaPorClincode(clincode);
    if (!denuncia) {
      return res.status(404).json({ error: 'Denúncia não encontrada.' });
    }
    res.json(denuncia);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar denúncia por clincode.' });
  }
}
