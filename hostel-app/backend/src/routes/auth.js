// src/routes/auth.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ erro: 'Usuário não encontrado ou inativo.' });
    }

    if (usuario.senha !== senha) {
      return res.status(401).json({ erro: 'Senha incorreta.' });
    }

    return res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao fazer login.' });
  }
});

// POST /api/auth/cadastro
router.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
  }

  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Este e-mail já está em uso.' });
    }

    // 👇 Correção aqui: Removido o perfil vazio, deixando o banco assumir o padrão
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha,
        ativo: true
      }
    });

    return res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      perfil: novoUsuario.perfil,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao realizar cadastro.' });
  }
});

module.exports = router;