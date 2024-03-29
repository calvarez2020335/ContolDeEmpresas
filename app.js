//Importaciones
const express = require('express');
const cors = require('cors');
var app = express();

// importacion de rutas
const UsuarioRutas = require('./src/routes/usuario.routes')
const EmpleadosRutas = require('./src/routes/empleados.routes')


//MIDDLEWARES

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Cabeceras

app.use(cors());


//Carga de rutas

app.use('/api', UsuarioRutas, EmpleadosRutas);


//Exportaciones

module.exports = app;