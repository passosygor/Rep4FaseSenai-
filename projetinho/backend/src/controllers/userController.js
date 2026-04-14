const prisma = require('../config/db');

exports.register = async (req, res) => {
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

exports.login = async (req, res) => {
  const { cpf, password } = req.body;
  const user = await prisma.user.findUnique({ where: { cpf } });
  
  if (user && user.password === password) {
    res.json(user); // Login simples, sem JWT conforme solicitado
  } else {
    res.status(401).json({ error: "CPF ou senha inválidos." });
  }
};

exports.forgotPassword = async (req, res) => {
  const { cpf, newPassword } = req.body;
  try {
    const user = await prisma.user.update({
      where: { cpf },
      data: { password: newPassword }
    });
    res.json({ message: "Senha atualizada com sucesso." });
  } catch (error) {
    res.status(404).json({ error: "CPF não encontrado." });
  }
};