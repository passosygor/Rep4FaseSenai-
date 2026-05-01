// src/routes/agendamentos.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Verifica conflito de horário
async function verificarConflito(profissionalId, dataHoraInicio, dataHoraFim, excluirId = null) {
  const where = {
    profissionalId,
    status: { not: 'cancelado' },
    AND: [
      { dataHoraInicio: { lt: new Date(dataHoraFim) } },
      { dataHoraFim:    { gt: new Date(dataHoraInicio) } },
    ],
  };
  if (excluirId) where.id = { not: excluirId };

  const conflito = await prisma.agendamento.findFirst({ where });
  return conflito;
}

// GET /api/agendamentos — lista ordenada cronologicamente com joins
router.get('/', async (req, res) => {
  try {
    const { status, profissionalId, clienteId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (profissionalId) where.profissionalId = +profissionalId;
    if (clienteId) where.clienteId = +clienteId;

    const agendamentos = await prisma.agendamento.findMany({
      where,
      orderBy: { dataHoraInicio: 'asc' },
      include: {
        cliente: { select: { id: true, nome: true, telefone: true } },
        profissional: { select: { id: true, nome: true, telefone: true } },
      },
    });
    res.json(agendamentos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar agendamentos.' });
  }
});

// GET /api/agendamentos/conflito — verifica conflito antes de criar
router.get('/conflito', async (req, res) => {
  const { profissionalId, dataHoraInicio, dataHoraFim, excluirId } = req.query;
  if (!profissionalId || !dataHoraInicio || !dataHoraFim) {
    return res.status(400).json({ erro: 'Parâmetros insuficientes.' });
  }
  try {
    const conflito = await verificarConflito(
      +profissionalId,
      dataHoraInicio,
      dataHoraFim,
      excluirId ? +excluirId : null
    );
    if (conflito) {
      const inicio = new Date(conflito.dataHoraInicio).toLocaleString('pt-BR');
      const fim = new Date(conflito.dataHoraFim).toLocaleString('pt-BR');
      return res.json({
        temConflito: true,
        mensagem: `Profissional já possui agendamento de ${inicio} até ${fim}.`,
        conflito,
      });
    }
    res.json({ temConflito: false });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao verificar conflito.' });
  }
});

// GET /api/agendamentos/:id
router.get('/:id', async (req, res) => {
  try {
    const ag = await prisma.agendamento.findUnique({
      where: { id: +req.params.id },
      include: {
        cliente: true,
        profissional: true,
      },
    });
    if (!ag) return res.status(404).json({ erro: 'Agendamento não encontrado.' });
    res.json(ag);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar agendamento.' });
  }
});

// POST /api/agendamentos — cria com verificação de conflito
router.post('/', async (req, res) => {
  const { clienteId, profissionalId, tipoServico, dataHoraInicio, dataHoraFim, endereco, valorTotal, observacoes } = req.body;

  if (!clienteId || !profissionalId || !tipoServico || !dataHoraInicio || !dataHoraFim) {
    return res.status(400).json({ erro: 'Campos obrigatórios: clienteId, profissionalId, tipoServico, dataHoraInicio, dataHoraFim.' });
  }

  if (new Date(dataHoraFim) <= new Date(dataHoraInicio)) {
    return res.status(400).json({ erro: 'O horário de fim deve ser após o horário de início.' });
  }

  try {
    const conflito = await verificarConflito(+profissionalId, dataHoraInicio, dataHoraFim);
    if (conflito) {
      const inicio = new Date(conflito.dataHoraInicio).toLocaleString('pt-BR');
      const fim = new Date(conflito.dataHoraFim).toLocaleString('pt-BR');
      return res.status(409).json({
        erro: `Conflito de horário! O profissional já possui agendamento de ${inicio} até ${fim}.`,
        conflito,
      });
    }

    const ag = await prisma.agendamento.create({
      data: {
        clienteId: +clienteId,
        profissionalId: +profissionalId,
        tipoServico,
        dataHoraInicio: new Date(dataHoraInicio),
        dataHoraFim: new Date(dataHoraFim),
        endereco,
        valorTotal: valorTotal ? parseFloat(valorTotal) : null,
        observacoes,
      },
      include: {
        cliente: { select: { id: true, nome: true } },
        profissional: { select: { id: true, nome: true } },
      },
    });

    res.status(201).json(ag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar agendamento.' });
  }
});

// PUT /api/agendamentos/:id
router.put('/:id', async (req, res) => {
  const id = +req.params.id;
  const { clienteId, profissionalId, tipoServico, dataHoraInicio, dataHoraFim, status, endereco, valorTotal, observacoes } = req.body;

  try {
    if (profissionalId && dataHoraInicio && dataHoraFim) {
      const conflito = await verificarConflito(+profissionalId, dataHoraInicio, dataHoraFim, id);
      if (conflito) {
        const inicio = new Date(conflito.dataHoraInicio).toLocaleString('pt-BR');
        const fim = new Date(conflito.dataHoraFim).toLocaleString('pt-BR');
        return res.status(409).json({
          erro: `Conflito de horário! O profissional já possui agendamento de ${inicio} até ${fim}.`,
          conflito,
        });
      }
    }

    const ag = await prisma.agendamento.update({
      where: { id },
      data: {
        ...(clienteId && { clienteId: +clienteId }),
        ...(profissionalId && { profissionalId: +profissionalId }),
        ...(tipoServico && { tipoServico }),
        ...(dataHoraInicio && { dataHoraInicio: new Date(dataHoraInicio) }),
        ...(dataHoraFim && { dataHoraFim: new Date(dataHoraFim) }),
        ...(status && { status }),
        ...(endereco !== undefined && { endereco }),
        ...(valorTotal !== undefined && { valorTotal: valorTotal ? parseFloat(valorTotal) : null }),
        ...(observacoes !== undefined && { observacoes }),
      },
      include: {
        cliente: { select: { id: true, nome: true } },
        profissional: { select: { id: true, nome: true } },
      },
    });
    res.json(ag);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar agendamento.' });
  }
});

// DELETE /api/agendamentos/:id (cancelamento)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.agendamento.update({
      where: { id: +req.params.id },
      data: { status: 'cancelado' },
    });
    res.json({ mensagem: 'Agendamento cancelado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cancelar agendamento.' });
  }
});

module.exports = router;
