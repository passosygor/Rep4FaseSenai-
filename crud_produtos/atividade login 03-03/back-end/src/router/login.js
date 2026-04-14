const express = require('express');
const routerLogin = express.Router();

const {login} = require('../controller/loginController.js');

routerLogin.post('/login', login);

module.exports = routerLogin;