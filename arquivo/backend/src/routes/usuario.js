const express = require('express');
const app = express();
const cors = require('cors');
const routerUser = express.Router();

const {createUser} = require('../controllers/Usuario/UsuarioController');

routerUser.post('/usuario', createUser);

module.exports = routerUser;