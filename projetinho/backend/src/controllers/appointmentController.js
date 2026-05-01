import prisma from '../config/db';

export async function CreateAppointment (req, res) {
  const { date, patientName, doctorId } = req.body;
  const appointmentDate = new Date(date);

  const conflict = await prisma.appointment.findFirst({
    where: { doctorId: Number(doctorId), date: appointmentDate }
  });

  if (conflict) {
    return res.status(400).json({ error: "O médico já possui consulta neste horário." });
  }

  try {
    const appointment = await prisma.appointment.create({
      data: { date: appointmentDate, patientName, doctorId: Number(doctorId) }
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Erro ao agendar." });
  }
};

export async function GetAppointments (req, res) {
  const appointments = await prisma.appointment.findMany({ include: { doctor: true } });
  res.json(appointments);
};