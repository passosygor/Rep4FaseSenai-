// src/routes/index.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const appointmentController = require('../controllers/appointmentController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);

router.post('/appointments', appointmentController.createAppointment);
router.get('/appointments', appointmentController.getAppointments);

module.exports = router;

// src/server.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));