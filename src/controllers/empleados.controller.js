const Empleados = require("../models/empleados.model");

function agregarEmpleado(req, res) {
  const parametros = req.body;
  const modeloEmpleados = new Empleados();

  if (
    parametros.nombre &&
    parametros.apellido &&
    parametros.puesto &&
    parametros.departamento &&
    parametros.idEmpresa
  ) {
    modeloEmpleados.nombre = parametros.nombre;
    modeloEmpleados.apellido = parametros.apellido;
    modeloEmpleados.puesto = parametros.puesto;
    modeloEmpleados.departamento = parametros.departamento;
    modeloEmpleados.idEmpresa = req.user.sub;

    modeloEmpleados.save((err, empleadoGuardado) => {
      if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
      if (!empleadoGuardado)
        return res
          .status(500)
          .send({ mensaje: "Error al agregar el empleado" });

      return res.status(200).send({ empleado: empleadoGuardado });
    });
  } else {
    return res
      .status(400)
      .send({ mensaje: "Debe enviar los parametros solicitados" });
  }
}

function editarEmpleado(req, res) {

  const empleadoId = req.params.idEmpleado;
  const parametros = req.body;

  Empleados.findOne( {_id : empleadoId, idEmpresa: req.user.sub}, (err, empladoEmpresa) => {

    if(!empladoEmpresa){
      return res
        .status(400)
        .send({ mensaje: "No puede editar empleados de otras empresas" });
    }

      Empleados.findByIdAndUpdate(
        empleadoId,
        parametros,
        { new: true },
        (err, empleadoEditado) => {
          if (err)
            return res.status(500).send({ mensaje: "Error en la peticion" });
          if (!empleadoEditado)
            return res
              .status(403)
              .send({ mensaje: "Error al editar el empleado" });

          return res.status(200).send({ empleado: empleadoEditado });
        }
      );
    
  })

}

function eliminarEmpleados(req, res) {

  const empleadoId = req.params.idEmpleado;

  Empleados.findOne( {_id : empleadoId, idEmpresa: req.user.sub}, (err, empladoEmpresa) => {

    if(!empladoEmpresa){
      return res
        .status(400)
        .send({ mensaje: "No puede eliminar empleados de otras empresas" });
    }

    Empleados.findByIdAndDelete(empleadoId, (err, empleadoEliminado) => {
      if(err) return res.status(500).send({ mensaje: "Error en la peticion" })
      if(!empleadoEliminado) return res.status(403).send({ mensaje: "Error al eliminar el empleado"})

      return res.status(200).send({ empleado: empleadoEliminado})
    })

  })
}

function contarEmpleados(req, res) {

  Empleados.find( { idEmpresa: req.user.sub}, (err, empladoEmpresa) => {
      for (let i = 0; i < empladoEmpresa.length; i++) {
          empladoEmpresa[i].nombre;
      }
      return res.status(200).send({Empleados: empladoEmpresa.length})
  })

}

function buscarEmpleadoPorId(req, res){
  
}

module.exports = {
    agregarEmpleado,
    editarEmpleado,
    eliminarEmpleados,
    contarEmpleados
}