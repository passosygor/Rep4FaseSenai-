// src/index.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');

// Importação das rotas atualizadas para o Hotel
const authRoutes = require('./routes/auth');
const hospedesRoutes = require('./routes/hospedes');
const usuariosRoutes = require('./routes/usuarios');
const quartosRoutes = require('./routes/quartos');
const reservasRoutes = require('./routes/reservas');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração de CORS (permitindo o frontend Vite)
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Definição das Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/hospedes', hospedesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/quartos', quartosRoutes);
app.use('/api/reservas', reservasRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Middleware de Erro Global
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor', detalhe: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 Health: http://localhost:${PORT}/api/health\n`);
});