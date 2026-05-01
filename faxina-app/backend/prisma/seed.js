// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Populando banco de dados...');

  // Usuários
  const usuarios = [
    { nome: 'Administrador', email: 'admin@faxina.com', senha: 'admin123', perfil: 'admin' },
    { nome: 'Ana Atendente', email: 'ana@faxina.com', senha: 'ana123', perfil: 'atendente' },
    { nome: 'Carlos Supervisor', email: 'carlos@faxina.com', senha: 'carlos123', perfil: 'admin' },
  ];

  for (const u of usuarios) {
    await prisma.usuario.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }
  console.log('✅ Usuários criados');

  // Profissionais
  const profissionais = [
    { nome: 'Maria da Silva', email: 'maria@faxina.com', telefone: '(48) 99101-0001', cpf: '111.222.333-01', especialidades: 'Residencial, Pós-obra' },
    { nome: 'João Ferreira', email: 'joao@faxina.com', telefone: '(48) 99101-0002', cpf: '111.222.333-02', especialidades: 'Comercial, Industrial' },
    { nome: 'Fernanda Costa', email: 'fernanda@faxina.com', telefone: '(48) 99101-0003', cpf: '111.222.333-03', especialidades: 'Residencial, Manutenção' },
    { nome: 'Ricardo Alves', email: 'ricardo@faxina.com', telefone: '(48) 99101-0004', cpf: '111.222.333-04', especialidades: 'Pós-obra, Comercial' },
    { nome: 'Patrícia Mendes', email: 'patricia@faxina.com', telefone: '(48) 99101-0005', cpf: '111.222.333-05', especialidades: 'Residencial' },
  ];

  const profMap = {};
  for (const p of profissionais) {
    const prof = await prisma.profissional.upsert({
      where: { cpf: p.cpf },
      update: {},
      create: p,
    });
    profMap[p.nome] = prof.id;
  }
  console.log('✅ Profissionais criados');

  // Clientes
  const clientes = [
    { nome: 'Empresa ABC Ltda', email: 'contato@abc.com', telefone: '(48) 3333-0001', cpf: '12.345.678/0001-99', endereco: 'Rua das Flores, 100', cidade: 'Florianópolis', uf: 'SC' },
    { nome: 'Roberto Oliveira', email: 'roberto@email.com', telefone: '(48) 99200-0001', cpf: '222.333.444-01', endereco: 'Av. Central, 250, Apto 3', cidade: 'Tubarão', uf: 'SC' },
    { nome: 'Clínica SaudaVida', email: 'admin@saudavida.com', telefone: '(48) 3333-0002', cpf: '98.765.432/0001-11', endereco: 'Rua dos Médicos, 45', cidade: 'Criciúma', uf: 'SC' },
    { nome: 'Luciana Pereira', email: 'lu@email.com', telefone: '(48) 99200-0002', cpf: '333.444.555-02', endereco: 'Rua das Palmeiras, 8', cidade: 'Imbituba', uf: 'SC' },
    { nome: 'Tech Solutions SA', email: 'ti@techsol.com', telefone: '(48) 3333-0003', cpf: '11.223.344/0001-55', endereco: 'Parque Tecnológico, Bloco B', cidade: 'Joinville', uf: 'SC' },
    { nome: 'Carlos Drummond', email: 'carlos.d@email.com', telefone: '(48) 99200-0003', cpf: '444.555.666-03', endereco: 'Travessa da Serra, 12', cidade: 'Blumenau', uf: 'SC' },
  ];

  const cliMap = {};
  for (const c of clientes) {
    const cli = await prisma.cliente.upsert({
      where: { cpf: c.cpf },
      update: {},
      create: c,
    });
    cliMap[c.nome] = cli.id;
  }
  console.log('✅ Clientes criados');

  // Agendamentos
  const now = new Date();
  const addHours = (d, h) => new Date(d.getTime() + h * 3600000);
  const addDays = (d, days) => new Date(d.getTime() + days * 86400000);

  const agendamentos = [
    {
      clienteId: cliMap['Empresa ABC Ltda'],
      profissionalId: profMap['João Ferreira'],
      tipoServico: 'comercial',
      dataHoraInicio: addHours(addDays(now, 1), 8),
      dataHoraFim: addHours(addDays(now, 1), 12),
      status: 'agendado',
      endereco: 'Rua das Flores, 100',
      valorTotal: 350.00,
      observacoes: 'Trazer equipamentos pesados',
    },
    {
      clienteId: cliMap['Roberto Oliveira'],
      profissionalId: profMap['Maria da Silva'],
      tipoServico: 'residencial',
      dataHoraInicio: addHours(addDays(now, 2), 9),
      dataHoraFim: addHours(addDays(now, 2), 13),
      status: 'agendado',
      endereco: 'Av. Central, 250, Apto 3',
      valorTotal: 180.00,
      observacoes: 'Apartamento 3 andares',
    },
    {
      clienteId: cliMap['Clínica SaudaVida'],
      profissionalId: profMap['João Ferreira'],
      tipoServico: 'comercial',
      dataHoraInicio: addHours(addDays(now, 3), 14),
      dataHoraFim: addHours(addDays(now, 3), 18),
      status: 'agendado',
      endereco: 'Rua dos Médicos, 45',
      valorTotal: 420.00,
      observacoes: 'Limpeza pré-inauguração',
    },
    {
      clienteId: cliMap['Luciana Pereira'],
      profissionalId: profMap['Fernanda Costa'],
      tipoServico: 'residencial',
      dataHoraInicio: addHours(addDays(now, -5), 9),
      dataHoraFim: addHours(addDays(now, -5), 13),
      status: 'concluido',
      endereco: 'Rua das Palmeiras, 8',
      valorTotal: 160.00,
    },
    {
      clienteId: cliMap['Tech Solutions SA'],
      profissionalId: profMap['Ricardo Alves'],
      tipoServico: 'comercial',
      dataHoraInicio: addHours(addDays(now, -2), 8),
      dataHoraFim: addHours(addDays(now, -2), 17),
      status: 'concluido',
      endereco: 'Parque Tecnológico, Bloco B',
      valorTotal: 680.00,
      observacoes: 'Escritório grande',
    },
    {
      clienteId: cliMap['Carlos Drummond'],
      profissionalId: profMap['Patrícia Mendes'],
      tipoServico: 'residencial',
      dataHoraInicio: addHours(addDays(now, 4), 10),
      dataHoraFim: addHours(addDays(now, 4), 14),
      status: 'agendado',
      endereco: 'Travessa da Serra, 12',
      valorTotal: 200.00,
    },
    {
      clienteId: cliMap['Empresa ABC Ltda'],
      profissionalId: profMap['Ricardo Alves'],
      tipoServico: 'posObra',
      dataHoraInicio: addHours(addDays(now, 7), 7),
      dataHoraFim: addHours(addDays(now, 7), 15),
      status: 'agendado',
      endereco: 'Rua das Flores, 100 – Obra',
      valorTotal: 750.00,
      observacoes: 'Limpeza pesada pós-reforma',
    },
    {
      clienteId: cliMap['Roberto Oliveira'],
      profissionalId: profMap['Fernanda Costa'],
      tipoServico: 'manutencao',
      dataHoraInicio: addHours(addDays(now, -10), 9),
      dataHoraFim: addHours(addDays(now, -10), 11),
      status: 'concluido',
      endereco: 'Av. Central, 250',
      valorTotal: 90.00,
      observacoes: 'Revisão mensal',
    },
  ];

  await prisma.agendamento.createMany({ data: agendamentos, skipDuplicates: true });
  console.log('✅ Agendamentos criados');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('  admin@faxina.com    / admin123  (Administrador)');
  console.log('  ana@faxina.com      / ana123    (Atendente)');
  console.log('  carlos@faxina.com   / carlos123 (Supervisor)');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
