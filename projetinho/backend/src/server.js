import express from 'express';
import cors from 'cors';
import routes from './routes/index'; // Importa as rotas que acabamos de criar

const app = express();

app.use(cors());
app.use(express.json());

// Agora sim o sistema tem as URLs de /api/login, /api/register, etc!
app.use('/api', routes); 

app.listen(3000, () => {
  console.log('Servidor da Clínica rodando na porta 3000 🚀');
});