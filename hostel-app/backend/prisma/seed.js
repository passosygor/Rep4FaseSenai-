// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Populando banco de dados do Hotel...');

  // ============================================================
  // 1. USUÁRIOS (Funcionários)
  // ============================================================
  const usuarios = [
    { nome: 'Administrador', email: 'admin@hotel.com', senha: 'admin123', perfil: 'admin' },
    { nome: 'Ana Recepção', email: 'ana@hotel.com', senha: 'ana123', perfil: 'recepcionista' },
    { nome: 'Carlos Gerente', email: 'carlos@hotel.com', senha: 'carlos123', perfil: 'gerente' },
  ];

  const userMap = {};
  for (const u of usuarios) {
    const user = await prisma.usuario.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
    userMap[u.nome] = user.id;
  }
  console.log('✅ Usuários criados');

  // ============================================================
  // 2. QUARTOS
  // ============================================================
  const quartos = [
    { numero: '101', tipo: 'Standard', capacidade: 2, valorDiaria: 150.00, statusAtual: 'disponivel' },
    { numero: '102', tipo: 'Standard', capacidade: 2, valorDiaria: 150.00, statusAtual: 'disponivel' },
    { numero: '201', tipo: 'Luxo', capacidade: 3, valorDiaria: 250.00, statusAtual: 'disponivel' },
    { numero: '202', tipo: 'Luxo', capacidade: 3, valorDiaria: 250.00, statusAtual: 'disponivel' },
    { numero: '301', tipo: 'Suite', capacidade: 4, valorDiaria: 400.00, statusAtual: 'disponivel' },
    { numero: '401', tipo: 'Master', capacidade: 4, valorDiaria: 800.00, statusAtual: 'manutencao' },
  ];

  const quartoMap = {};
  for (const q of quartos) {
    const quarto = await prisma.quarto.upsert({
      where: { numero: q.numero },
      update: {},
      create: q,
    });
    quartoMap[q.numero] = quarto.id;
  }
  console.log('✅ Quartos criados');

  // ============================================================
  // 3. HÓSPEDES
  // ============================================================
  const hospedes = [
    { nome: 'Empresa ABC Ltda', email: 'contato@abc.com', telefone: '(48) 3333-0001', documento: '12.345.678/0001-99', endereco: 'Rua das Flores, 100', cidade: 'Florianópolis', uf: 'SC' },
    { nome: 'Roberto Oliveira', email: 'roberto@email.com', telefone: '(48) 99200-0001', documento: '222.333.444-01', endereco: 'Av. Central, 250, Apto 3', cidade: 'Tubarão', uf: 'SC' },
    { nome: 'Clínica SaudaVida', email: 'admin@saudavida.com', telefone: '(48) 3333-0002', documento: '98.765.432/0001-11', endereco: 'Rua dos Médicos, 45', cidade: 'Criciúma', uf: 'SC' },
    { nome: 'Luciana Pereira', email: 'lu@email.com', telefone: '(48) 99200-0002', documento: '333.444.555-02', endereco: 'Rua das Palmeiras, 8', cidade: 'Imbituba', uf: 'SC' },
    { nome: 'Carlos Drummond', email: 'carlos.d@email.com', telefone: '(48) 99200-0003', documento: '444.555.666-03', endereco: 'Travessa da Serra, 12', cidade: 'Blumenau', uf: 'SC' },
  ];

  const hospMap = {};
  for (const h of hospedes) {
    const hospede = await prisma.hospede.upsert({
      where: { documento: h.documento },
      update: {},
      create: h,
    });
    hospMap[h.nome] = hospede.id;
  }
  console.log('✅ Hóspedes criados');

  // ============================================================
  // 4. RESERVAS
  // ============================================================
  // Zeramos as horas para garantir que as datas sejam exatas para Check-in / Check-out
  const now = new Date();
  now.setHours(0, 0, 0, 0); 
  const addDays = (d, days) => new Date(d.getTime() + days * 86400000);

  // Criamos as reservas com datas seguras para não disparar a Exception de Overbooking do SQL
  const reservas = [
    {
      hospedeId: hospMap['Empresa ABC Ltda'],
      quartoId: quartoMap['101'],
      responsavelId: userMap['Ana Recepção'],
      dataCheckIn: addDays(now, 1),
      dataCheckOut: addDays(now, 5),
      status: 'confirmada',
      valorTotal: 600.00,
      observacoes: 'Hóspede corporativo VIP',
    },
    {
      hospedeId: hospMap['Roberto Oliveira'],
      quartoId: quartoMap['201'],
      responsavelId: userMap['Ana Recepção'],
      dataCheckIn: addDays(now, 2),
      dataCheckOut: addDays(now, 4),
      status: 'confirmada',
      valorTotal: 500.00,
      observacoes: 'Pediu berço no quarto',
    },
    {
      hospedeId: hospMap['Clínica SaudaVida'],
      quartoId: quartoMap['301'],
      responsavelId: userMap['Carlos Gerente'],
      dataCheckIn: addDays(now, 10),
      dataCheckOut: addDays(now, 15),
      status: 'pendente',
      valorTotal: 2000.00,
      observacoes: 'Aguardando pagamento de sinal',
    },
    {
      hospedeId: hospMap['Luciana Pereira'],
      quartoId: quartoMap['102'],
      responsavelId: userMap['Ana Recepção'],
      dataCheckIn: addDays(now, -5), // Reserva no passado
      dataCheckOut: addDays(now, -2),
      status: 'check_out',
      valorTotal: 450.00,
      observacoes: 'Check-out realizado sem problemas',
    },
    {
      hospedeId: hospMap['Carlos Drummond'],
      quartoId: quartoMap['202'],
      responsavelId: userMap['Ana Recepção'],
      dataCheckIn: addDays(now, -1),
      dataCheckOut: addDays(now, 3),
      status: 'check_in',
      valorTotal: 1000.00,
      observacoes: 'Hóspede atualmente no hotel',
    },
    {
      hospedeId: hospMap['Empresa ABC Ltda'],
      quartoId: quartoMap['101'], // Mesmo quarto da primeira reserva, mas em dias futuros sem conflito
      responsavelId: userMap['Carlos Gerente'],
      dataCheckIn: addDays(now, 7),
      dataCheckOut: addDays(now, 10),
      status: 'confirmada',
      valorTotal: 450.00,
      observacoes: 'Retorno da empresa na semana seguinte',
    }
  ];

  // Inserindo reservas. O trigger de auditoria (SQL) será acionado automaticamente 
  // pelo banco para gerar os registros em "HistoricoReserva"
  await prisma.reserva.createMany({ 
    data: reservas, 
    skipDuplicates: true 
  });
  console.log('✅ Reservas criadas e histórico de auditoria gerado pelo banco!');

  console.log('\n🎉 Seed do Hotel concluído com sucesso!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('  admin@hotel.com   / admin123  (Administrador)');
  console.log('  ana@hotel.com     / ana123    (Recepção)');
  console.log('  carlos@hotel.com  / carlos123 (Gerente)');
}

main()
  .catch(e => { 
    console.error('❌ Erro no seed:', e); 
    process.exit(1); 
  })
  .finally(async () => {
    await prisma.$disconnect();
  });