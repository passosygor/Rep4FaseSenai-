// src/routes/quartos.js — CRUD de quartos (compatível com o formulário antigo: nome, precoDiaria, tipo hostel)
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const FE_TIPO_TO_DB = {
  compartilhado: 'Standard',
  privativo: 'Standard',
  casal: 'Luxo',
  suite: 'Suite',
};

const DB_TIPO_TO_FE = {
  Standard: 'compartilhado',
  Luxo: 'casal',
  Suite: 'suite',
  Master: 'suite',
};

function mapTipoIncoming(t) {
  if (!t) return 'Standard';
  if (FE_TIPO_TO_DB[t]) return FE_TIPO_TO_DB[t];
  if (['Standard', 'Luxo', 'Suite', 'Master'].includes(t)) return t;
  return 'Standard';
}

/** Expõe numero como nome e valorDiaria como precoDiaria para o frontend legado */
function toFront(q) {
  return {
    ...q,
    nome: q.numero,
    precoDiaria: q.valorDiaria != null ? Number(q.valorDiaria) : null,
    tipo: DB_TIPO_TO_FE[q.tipo] || q.tipo,
  };
}

function parseBody(body) {
  const numero = body.numero ?? body.nome;
  const rawValor = body.valorDiaria ?? body.precoDiaria;
  const valorDiaria = rawValor !== undefined && rawValor !== '' ? parseFloat(String(rawValor).replace(',', '.')) : NaN;

  if (!numero || String(numero).trim() === '') {
    const err = new Error('VALIDATION');
    err.code = 'VALIDATION';
    throw err;
  }
  if (Number.isNaN(valorDiaria)) {
    const err = new Error('VALIDATION');
    err.code = 'VALIDATION';
    throw err;
  }

  return {
    numero: String(numero).trim(),
    tipo: mapTipoIncoming(body.tipo),
    capacidade: body.capacidade != null ? Math.max(1, +body.capacidade) : 2,
    valorDiaria,
    statusAtual: body.statusAtual || 'disponivel',
    ativo: body.ativo !== false,
  };
}

router.get('/', async (_req, res) => {
  try {
    const quartos = await prisma.quarto.findMany({
      where: { ativo: true },
      orderBy: { numero: 'asc' },
    });
    res.json(quartos.map(toFront));
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar quartos.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const q = await prisma.quarto.findUnique({ where: { id: +req.params.id } });
    if (!q) return res.status(404).json({ erro: 'Quarto não encontrado.' });
    res.json(toFront(q));
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar quarto.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = parseBody(req.body);
    const created = await prisma.quarto.create({ data });
    res.status(201).json(toFront(created));
  } catch (err) {
    if (err.code === 'VALIDATION') {
      return res.status(400).json({ erro: 'Número/nome do quarto e preço da diária são obrigatórios.' });
    }
    if (err.code === 'P2002') return res.status(409).json({ erro: 'Já existe um quarto com este número.' });
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar quarto.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = +req.params.id;
    const partial = {};
    const numero = req.body.numero ?? req.body.nome;
    if (numero !== undefined) partial.numero = String(numero).trim();
    if (req.body.tipo !== undefined) partial.tipo = mapTipoIncoming(req.body.tipo);
    if (req.body.capacidade !== undefined) partial.capacidade = Math.max(1, +req.body.capacidade);
    const rawValor = req.body.valorDiaria ?? req.body.precoDiaria;
    if (rawValor !== undefined && rawValor !== '') partial.valorDiaria = parseFloat(String(rawValor).replace(',', '.'));
    if (req.body.statusAtual !== undefined) partial.statusAtual = req.body.statusAtual;
    if (req.body.ativo !== undefined) partial.ativo = req.body.ativo;

    const updated = await prisma.quarto.update({ where: { id }, data: partial });
    res.json(toFront(updated));
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ erro: 'Quarto não encontrado.' });
    if (err.code === 'P2002') return res.status(409).json({ erro: 'Já existe um quarto com este número.' });
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar quarto.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.quarto.update({
      where: { id: +req.params.id },
      data: { ativo: false },
    });
    res.json({ mensagem: 'Quarto desativado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao desativar quarto.' });
  }
});

module.exports = router;
