// src/routes/usuarios.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { nome: 'asc' },
      // O select abaixo garante que não vamos enviar as senhas para o frontend
      select: { id: true, nome: true, email: true, perfil: true, ativo: true, criadoEm: true } 
    });
    res.json(usuarios);
  } catch (err) {
    console.error("Erro no GET /usuarios:", err);
    res.status(500).json({ erro: 'Erro ao buscar usuarios.' });
  }
});

// GET /api/usuarios/:id
router.get('/:id', async (req, res) => {
  try {
    const u = await prisma.usuario.findUnique({ 
      where: { id: +req.params.id },
      select: { id: true, nome: true, email: true, perfil: true, ativo: true }
    });
    if (!u) return res.status(404).json({ erro: 'Usuario não encontrado.' });
    res.json(u);
  } catch (err) {
    console.error("Erro no GET /usuarios/:id:", err);
    res.status(500).json({ erro: 'Erro ao buscar usuario.' });
  }
});

// POST /api/usuarios
router.post('/', async (req, res) => {
  const { nome, email, senha, perfil } = req.body;
  
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
  }

  try {
    const u = await prisma.usuario.create({ 
      data: { 
        nome, 
        email, 
        senha,
        // Isso resolve o erro "Usuario_perfil_check" forçando tudo para minúsculo
        perfil: perfil ? perfil.toLowerCase() : 'recepcionista' 
      } 
    });
    
    // Retira a senha do objeto antes de devolver como resposta
    const { senha: _, ...usuarioSemSenha } = u;
    res.status(201).json(usuarioSemSenha);

  } catch (err) {
    console.error("❌ ERRO NO POST /usuarios:", err);
    if (err.code === 'P2002') return res.status(409).json({ erro: 'Email já cadastrado.' });
    res.status(500).json({ erro: 'Erro ao criar usuario.' });
  }
});

// PUT /api/usuarios/:id
router.put('/:id', async (req, res) => {
  const { nome, email, senha, perfil, ativo } = req.body;
  try {
    const u = await prisma.usuario.update({
      where: { id: +req.params.id },
      data: { 
        nome, 
        email, 
        senha, 
        ...(perfil && { perfil: perfil.toLowerCase() }),
        ativo 
      },
    });
    
    const { senha: _, ...usuarioSemSenha } = u;
    res.json(usuarioSemSenha);
  } catch (err) {
    console.error("Erro no PUT /usuarios/:id:", err);
    res.status(500).json({ erro: 'Erro ao atualizar usuario.' });
  }
});

// DELETE /api/usuarios/:id (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.usuario.update({ 
      where: { id: +req.params.id }, 
      data: { ativo: false } 
    });
    res.json({ mensagem: 'Usuario desativado.' });
  } catch (err) {
    console.error("Erro no DELETE /usuarios/:id:", err);
    res.status(500).json({ erro: 'Erro ao desativar usuario.' });
  }
});

module.exports = router;