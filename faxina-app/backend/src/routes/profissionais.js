// src/routes/profissionais.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/profissionais
router.get('/', async (req, res) => {
  try {
    const profissionais = await prisma.profissional.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
    res.json(profissionais);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar profissionais.' });
  }
});

// GET /api/profissionais/:id
router.get('/:id', async (req, res) => {
  try {
    const p = await prisma.profissional.findUnique({ where: { id: +req.params.id } });
    if (!p) return res.status(404).json({ erro: 'Profissional não encontrado.' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar profissional.' });
  }
});

// POST /api/profissionais
router.post('/', async (req, res) => {
  const { nome, email, telefone, cpf, especialidades } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório.' });
  try {
    const p = await prisma.profissional.create({ data: { nome, email, telefone, cpf, especialidades } });
    res.status(201).json(p);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ erro: 'Email ou CPF já cadastrado.' });
    res.status(500).json({ erro: 'Erro ao criar profissional.' });
  }
});

// PUT /api/profissionais/:id
router.put('/:id', async (req, res) => {
  const { nome, email, telefone, cpf, especialidades, ativo } = req.body;
  try {
    const p = await prisma.profissional.update({
      where: { id: +req.params.id },
      data: { nome, email, telefone, cpf, especialidades, ativo },
    });
    res.json(p);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar profissional.' });
  }
});

// DELETE /api/profissionais/:id (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.profissional.update({ where: { id: +req.params.id }, data: { ativo: false } });
    res.json({ mensagem: 'Profissional desativado.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao desativar profissional.' });
  }
});

module.exports = router;
