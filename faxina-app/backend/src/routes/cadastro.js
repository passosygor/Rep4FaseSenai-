// src/routes/profissionais.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { nome: 'asc' }
    });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuarios.' });
  }
});

// GET /api/usuarios/:id
router.get('/:id', async (req, res) => {
  try {
    const u = await prisma.usuario.findUnique({ where: { id: +req.params.id } });
    if (!u) return res.status(404).json({ erro: 'Usuario não encontrado.' });
    res.json(u);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuario.' });
  }
});

// POST /api/usuarios
router.post('/', async (req, res) => {
  const { nome, email, senha} = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório.' });
  try {
    const u = await prisma.usuario.create({ data: { nome, email, senha } });
    res.status(201).json(u);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ erro: 'Email já cadastrado.' });
    res.status(500).json({ erro: 'Erro ao criar usuario.' });
  }
});

// PUT /api/usuarios/:id
router.put('/:id', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const u = await prisma.usuario.update({
      where: { id: +req.params.id },
      data: { nome, email, senha },
    });
    res.json(u);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar usuario.' });
  }
});

// DELETE /api/usuarios/:id (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.usuario.update({ where: { id: +req.params.id }, data: { ativo: false } });
    res.json({ mensagem: 'usuario desativado.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao desativar usuario.' });
  }
});

module.exports = router;
