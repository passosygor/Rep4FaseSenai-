const { app } = require('./app.js');
const dotenv = require('dotenv');
dotenv.config(); 

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});