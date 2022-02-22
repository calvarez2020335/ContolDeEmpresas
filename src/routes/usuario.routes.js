const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller');

const api = express.Router();

api.post('/registrar', usuarioControlador.registrarAdmin);
api.post('/login', usuarioControlador.Login)

module.exports = api;