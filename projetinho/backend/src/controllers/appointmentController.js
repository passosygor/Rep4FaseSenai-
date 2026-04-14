const prisma = require('../config/db');

exports.createAppointment = async (req, res) => {
  const { date, patientName, doctorId } = req.body;
  const appointmentDate = new Date(date);

  // Validação: Uma consulta não pode ser agendada no mesmo horário para o mesmo médico.
  const conflict = await prisma.appointment.findFirst({
    where: {
      doctorId: Number(doctorId),
      date: appointmentDate
    }
  });

  if (conflict) {
    return res.status(400).json({ error: "O médico já possui uma consulta neste horário." });
  }

  try {
    const appointment = await prisma.appointment.create({
      data: { date: appointmentDate, patientName, doctorId: Number(doctorId) }
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Erro ao agendar consulta." });
  }
};

exports.getAppointments = async (req, res) => {
  const appointments = await prisma.appointment.findMany({
    include: { doctor: true }
  });
  res.json(appointments);
};