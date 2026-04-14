const express = require('express');
const cors = require('cors'); // Permite a conexão com o Front-end

const app = express();

// Configurações (Middlewares)
app.use(cors()); 
app.use(express.json()); // Permite que o servidor entenda dados em JSON

// Rota de teste rápida
app.get('/', (req, res) => {
  res.send('🚀 Servidor da Clínica SENAI rodando perfeitamente!');
});

// (Aqui no futuro nós vamos colocar as rotas de usuários e agendamentos)
// const routes = require('./routes/index');
// app.use('/api', routes);

// Liga o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000 🚀');
});