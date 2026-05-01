import prisma from '../config/db';

export async function Register (req, res) {
  const { cpf, password, name, role } = req.body;
  try {
    const user = await prisma.user.create({
      data: { cpf, password, name, role }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar usuário ou CPF já existe." });
  }
};

export async function Login (req, res) {
  const { cpf, password } = req.body;
  const user = await prisma.user.findUnique({ where: { cpf } });
  
  if (user && user.password === password) {
    res.json(user);
  } else {
    res.status(401).json({ error: "CPF ou senha inválidos." });
  }
};