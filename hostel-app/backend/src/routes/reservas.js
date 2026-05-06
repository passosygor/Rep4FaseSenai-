// src/routes/reservas.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const TIPO_DB_TO_FE = {
  Standard: 'compartilhado',
  Luxo: 'casal',
  Suite: 'suite',
  Master: 'suite',
};

/** Compatível com o frontend legado (checkIn/checkOut, quarto.nome, tipoQuarto). */
function enrichReserva(r) {
  if (!r) return r;
  const out = { ...r };
  out.checkIn = r.dataCheckIn;
  out.checkOut = r.dataCheckOut;
  out.tipoQuarto = TIPO_DB_TO_FE[r.quarto?.tipo] || 'compartilhado';
  out.qtdHospedes = r.qtdHospedes ?? 1;
  if (out.quarto) {
    out.quarto = { ...out.quarto, nome: out.quarto.numero };
  }
  return out;
}

function pickDatesQuery(q) {
  return {
    dataCheckIn: q.dataCheckIn || q.checkIn,
    dataCheckOut: q.dataCheckOut || q.checkOut,
  };
}

function pickDatesBody(body) {
  return {
    dataCheckIn: body.dataCheckIn || body.checkIn,
    dataCheckOut: body.dataCheckOut || body.checkOut,
  };
}

// Verifica conflito de datas para um QUARTO específico
async function verificarConflito(quartoId, dataCheckIn, dataCheckOut, excluirId = null) {
  const where = {
    quartoId,
    status: { not: 'cancelada' }, // Ignora as reservas que foram canceladas
    AND: [
      { dataCheckIn: { lt: new Date(dataCheckOut) } },
      { dataCheckOut: { gt: new Date(dataCheckIn) } },
    ],
  };
  if (excluirId) where.id = { not: excluirId };

  const conflito = await prisma.reserva.findFirst({ where });
  return conflito;
}

// GET /api/reservas — lista ordenada cronologicamente com joins
router.get('/', async (req, res) => {
  try {
    const { status, quartoId, hospedeId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (quartoId) where.quartoId = +quartoId;
    if (hospedeId) where.hospedeId = +hospedeId;

    const reservas = await prisma.reserva.findMany({
      where,
      orderBy: { dataCheckIn: 'asc' },
      include: {
        hospede: { select: { id: true, nome: true, telefone: true } },
        quarto: { select: { id: true, numero: true, tipo: true } },
        responsavel: { select: { id: true, nome: true } }
      },
    });
    res.json(reservas.map(enrichReserva));
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar reservas.' });
  }
});

async function handleDisponibilidadeOuConflito(req, res) {
  const { quartoId, excluirId } = req.query;
  const { dataCheckIn, dataCheckOut } = pickDatesQuery(req.query);

  if (!quartoId || !dataCheckIn || !dataCheckOut) {
    return res.status(400).json({
      erro: 'Parâmetros insuficientes. Informe quartoId e datas (checkIn/checkOut ou dataCheckIn/dataCheckOut).',
    });
  }

  try {
    const conflito = await verificarConflito(
      +quartoId,
      dataCheckIn,
      dataCheckOut,
      excluirId ? +excluirId : null
    );

    if (conflito) {
      const inicio = new Date(conflito.dataCheckIn).toLocaleDateString('pt-BR');
      const fim = new Date(conflito.dataCheckOut).toLocaleDateString('pt-BR');
      return res.json({
        temConflito: true,
        mensagem: `O quarto já possui uma reserva de ${inicio} até ${fim}.`,
        conflito,
      });
    }

    res.json({ temConflito: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao verificar disponibilidade das datas.' });
  }
}

// GET /api/reservas/conflito — mesmo comportamento que /disponibilidade
router.get('/conflito', handleDisponibilidadeOuConflito);
// Alias usado pelo frontend (api.verificarDisponibilidade)
router.get('/disponibilidade', handleDisponibilidadeOuConflito);

// GET /api/reservas/:id
router.get('/:id', async (req, res) => {
  try {
    const reserva = await prisma.reserva.findUnique({
      where: { id: +req.params.id },
      include: {
        hospede: true,
        quarto: true,
        responsavel: { select: { id: true, nome: true } },
      },
    });
    if (!reserva) return res.status(404).json({ erro: 'Reserva não encontrada.' });
    res.json(enrichReserva(reserva));
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar reserva.' });
  }
});

// POST /api/reservas — cria com verificação de conflito
router.post('/', async (req, res) => {
  const { hospedeId, quartoId, responsavelId, valorTotal, observacoes } = req.body;
  const { dataCheckIn, dataCheckOut } = pickDatesBody(req.body);

  if (!hospedeId || !quartoId || !responsavelId || !dataCheckIn || !dataCheckOut) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: hospedeId, quartoId, responsavelId e datas (checkIn/checkOut ou dataCheckIn/dataCheckOut).',
    });
  }

  if (new Date(dataCheckOut) <= new Date(dataCheckIn)) {
    return res.status(400).json({ erro: 'A data de Check-out deve ser posterior à data de Check-in.' });
  }

  try {
    // Verifica se o quarto já está reservado nessas datas
    const conflito = await verificarConflito(+quartoId, dataCheckIn, dataCheckOut);
    
    if (conflito) {
      const inicio = new Date(conflito.dataCheckIn).toLocaleDateString('pt-BR');
      const fim = new Date(conflito.dataCheckOut).toLocaleDateString('pt-BR');
      return res.status(409).json({
        erro: `Conflito de datas! O quarto selecionado já está reservado de ${inicio} até ${fim}.`,
        conflito,
      });
    }

    const reserva = await prisma.reserva.create({
      data: {
        hospedeId: +hospedeId,
        quartoId: +quartoId,
        responsavelId: +responsavelId, // ID do recepcionista/usuário que fez a reserva
        dataCheckIn: new Date(dataCheckIn),
        dataCheckOut: new Date(dataCheckOut),
        valorTotal: valorTotal ? parseFloat(valorTotal) : null,
        observacoes,
      },
      include: {
        hospede: { select: { id: true, nome: true } },
        quarto: { select: { id: true, numero: true } },
      },
    });

    res.status(201).json(enrichReserva(reserva));
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar reserva.' });
  }
});

// PUT /api/reservas/:id
router.put('/:id', async (req, res) => {
  const id = +req.params.id;
  const { hospedeId, quartoId, responsavelId, status, valorTotal, observacoes } = req.body;
  const dates = pickDatesBody(req.body);
  const dataCheckIn = dates.dataCheckIn;
  const dataCheckOut = dates.dataCheckOut;

  try {
    // Se estiver mudando as datas ou o quarto, precisa verificar conflito novamente
    if (quartoId && dataCheckIn && dataCheckOut) {
      const conflito = await verificarConflito(+quartoId, dataCheckIn, dataCheckOut, id);
      if (conflito) {
        const inicio = new Date(conflito.dataCheckIn).toLocaleDateString('pt-BR');
        const fim = new Date(conflito.dataCheckOut).toLocaleDateString('pt-BR');
        return res.status(409).json({
          erro: `Conflito de datas! O quarto selecionado já está reservado de ${inicio} até ${fim}.`,
          conflito,
        });
      }
    }

    const reserva = await prisma.reserva.update({
      where: { id },
      data: {
        ...(hospedeId && { hospedeId: +hospedeId }),
        ...(quartoId && { quartoId: +quartoId }),
        ...(responsavelId && { responsavelId: +responsavelId }),
        ...(dataCheckIn !== undefined && dataCheckIn !== '' && { dataCheckIn: new Date(dataCheckIn) }),
        ...(dataCheckOut !== undefined && dataCheckOut !== '' && { dataCheckOut: new Date(dataCheckOut) }),
        ...(status && { status }),
        ...(valorTotal !== undefined && { valorTotal: valorTotal ? parseFloat(valorTotal) : null }),
        ...(observacoes !== undefined && { observacoes }),
      },
      include: {
        hospede: { select: { id: true, nome: true } },
        quarto: { select: { id: true, numero: true } },
      },
    });
    
    res.json(enrichReserva(reserva));
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar reserva.' });
  }
});

// DELETE /api/reservas/:id (cancelamento)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.reserva.update({
      where: { id: +req.params.id },
      data: { status: 'cancelada' },
    });
    res.json({ mensagem: 'Reserva cancelada com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cancelar reserva.' });
  }
});

module.exports = router;