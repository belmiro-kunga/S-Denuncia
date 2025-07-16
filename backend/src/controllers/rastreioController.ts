import { Request, Response } from 'express';
import { criarRastreio, buscarRastreiosPorDenuncia } from '../models/rastreioModel';

export async function cadastrarRastreio(req: Request, res: Response) {
  try {
    const { denuncia_id, status, observacao } = req.body;
    if (!denuncia_id || !status) {
      return res.status(400).json({ error: 'Denúncia e status são obrigatórios.' });
    }
    const rastreio = await criarRastreio({ denuncia_id, status, observacao });
    res.status(201).json(rastreio);
  } catch {
    res.status(500).json({ error: 'Erro ao cadastrar rastreio.' });
  }
}

export async function listarRastreiosPorDenuncia(req: Request, res: Response) {
  try {
    const denuncia_id = Number(req.params.denuncia_id);
    if (!denuncia_id) {
      return res.status(400).json({ error: 'ID da denúncia é obrigatório.' });
    }
    const rastreios = await buscarRastreiosPorDenuncia(denuncia_id);
    res.json(rastreios);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar rastreios.' });
  }
}
