// src/routes/clientes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/clientes — lista ordenada alfabeticamente
router.get('/', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar clientes.' });
  }
});

// GET /api/clientes/:id
router.get('/:id', async (req, res) => {
  try {
    const cliente = await prisma.cliente.findUnique({ where: { id: +req.params.id } });
    if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado.' });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar cliente.' });
  }
});

// POST /api/clientes
router.post('/', async (req, res) => {
  const { nome, email, telefone, cpf, endereco, cidade, uf, observacoes } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório.' });
  try {
    const cliente = await prisma.cliente.create({
      data: { nome, email, telefone, cpf, endereco, cidade, uf, observacoes },
    });
    res.status(201).json(cliente);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ erro: 'Email ou CPF já cadastrado.' });
    res.status(500).json({ erro: 'Erro ao criar cliente.' });
  }
});

// PUT /api/clientes/:id
router.put('/:id', async (req, res) => {
  const { nome, email, telefone, cpf, endereco, cidade, uf, observacoes, ativo } = req.body;
  try {
    const cliente = await prisma.cliente.update({
      where: { id: +req.params.id },
      data: { nome, email, telefone, cpf, endereco, cidade, uf, observacoes, ativo },
    });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar cliente.' });
  }
});

// DELETE /api/clientes/:id  (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.cliente.update({ where: { id: +req.params.id }, data: { ativo: false } });
    res.json({ mensagem: 'Cliente desativado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao desativar cliente.' });
  }
});

module.exports = router;
