// src/routes/hospedes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/hospedes — lista ordenada alfabeticamente
router.get('/', async (req, res) => {
  try {
    const hospedes = await prisma.hospede.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
    res.json(hospedes);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar hóspedes.' });
  }
});

// GET /api/hospedes/:id
router.get('/:id', async (req, res) => {
  try {
    const hospede = await prisma.hospede.findUnique({ where: { id: +req.params.id } });
    if (!hospede) return res.status(404).json({ erro: 'Hóspede não encontrado.' });
    res.json(hospede);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar hóspede.' });
  }
});

// POST /api/hospedes
router.post('/', async (req, res) => {
  const { nome, email, telefone, documento, cpf, endereco, cidade, uf, observacoes } = req.body;
  const doc = documento ?? cpf;

  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório.' });

  try {
    const hospede = await prisma.hospede.create({
      data: { nome, email, telefone, documento: doc, endereco, cidade, uf, observacoes },
    });
    res.status(201).json(hospede);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ erro: 'Email ou documento já cadastrado.' });
    res.status(500).json({ erro: 'Erro ao criar hóspede.' });
  }
});

// PUT /api/hospedes/:id
router.put('/:id', async (req, res) => {
  const { nome, email, telefone, documento, cpf, endereco, cidade, uf, observacoes, ativo } = req.body;
  const doc = documento !== undefined ? documento : cpf;
  try {
    const hospede = await prisma.hospede.update({
      where: { id: +req.params.id },
      data: {
        nome,
        email,
        telefone,
        ...(doc !== undefined && { documento: doc }),
        endereco,
        cidade,
        uf,
        observacoes,
        ativo,
      },
    });
    res.json(hospede);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar hóspede.' });
  }
});

// DELETE /api/hospedes/:id  (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.hospede.update({ where: { id: +req.params.id }, data: { ativo: false } });
    res.json({ mensagem: 'Hóspede desativado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao desativar hóspede.' });
  }
});

module.exports = router;