const express = require('express')
const controladorEmpleados = require('../controllers/empleados.controller')

//Middleware
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/registrarEmpleado', [md_autenticacion.Auth, md_roles.verEmpresas], controladorEmpleados.agregarEmpleado);
api.put('/editarEmpleado/:idEmpleado', [md_autenticacion.Auth, md_roles.verEmpresas], controladorEmpleados.editarEmpleado);
api.delete('/eliminarEmpleado/:idEmpleado', [md_autenticacion.Auth, md_roles.verEmpresas], controladorEmpleados.eliminarEmpleados)
api.get('/contarEmpleados', [md_autenticacion.Auth, md_roles.verEmpresas], controladorEmpleados.contarEmpleados);
api.get('/buscarEmpleadoId/:idEmpleado', [md_autenticacion.Auth, md_roles.verEmpresas], controladorEmpleados.buscarEmpleadoPorId);


module.exports = api;