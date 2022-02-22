const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller');

const api = express.Router();

api.post('/registrar', usuarioControlador.registrarAdmin);

module.exports = api;