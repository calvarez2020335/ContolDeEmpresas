const Usuario = require("../models/usuario.model");
const bcrypt = require("bcrypt-nodejs");

function registrarAdmin(req, res) {
  var parametros = req.body;
  var usuarioModel = new Usuario();

  usuarioModel.nombre = "ADMIN";
  usuarioModel.apellido = "ADMIN";
  usuarioModel.email = "admin";
  usuarioModel.rol = "ROL_ADMIN";

  Usuario.find({ email: "ADMIN" }, (err, usuarioEncontrado) => {
    if (usuarioEncontrado.length == 0) {
      bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
        usuarioModel.password = passwordEncriptada;

        usuarioModel.save((err, usuarioGuardado) => {
          if (err)
            return res.status(500).send({ mensaje: "Error en la peticion" });
          if (!usuarioGuardado)
            return res
              .status(500)
              .send({ mensaje: "Error al agregar el Usuario" });

          return res.status(200).send({ usuario: usuarioGuardado });
        });
      });
    } else {
      return res
        .status(500)
        .send({ mensaje: "Este correo, ya  se encuentra utilizado" });
    }
  });
}

module.exports = {
    registrarAdmin
}