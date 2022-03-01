const Empleados = require("../models/empleados.model");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const doc = new PDFDocument();

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
  
  var empleadoId = req.params.idEmpleado;

  Empleados.findOne({_id : empleadoId, idEmpresa: req.user.sub}, (err, empleadoEncontrado)=>{

    if(!empleadoEncontrado){
      return res
        .status(400)
        .send({ mensaje: "No puede buscar empleados de otras empresas" });
    }

    if(err) return res.status(500).send({ mensaje: "Error en la peticion" })

    return res.status(200).send({ empleado: empleadoEncontrado})

  })

}

function buscarEmpleadoPorNombre(req, res){
  var nombreEmpleado = req.params.nombreEmpleado;

  Empleados.find( {nombre : nombreEmpleado, idEmpresa: req.user.sub}, (err, empleadoEncontrado)=>{

    if(!empleadoEncontrado){
      return res
        .status(400)
        .send({ mensaje: empleadoEncontrado.length });
    }

    if(err) return res.status(500).send({ mensaje: "Error en la peticion" })

    return res.status(200).send({ empleado: empleadoEncontrado})


  })

}

function buscarEmpleadoPorPuesto(req, res){
  var puestoEmpleado = req.params.puesto;

  Empleados.find(
    { puesto : puestoEmpleado, idEmpresa: req.user.sub },
    (err, empleadoEncontrado) => {
      if (!empleadoEncontrado) {
        return res
          .status(400)
          .send({ mensaje: "No puede buscar empleados de otras empresas" });
      }

      if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

      return res.status(200).send({ empleado: empleadoEncontrado });
    }
  );
}

function buscarEmpleadoPorDepartamento(req, res){
  var departamentoEmpleado = req.params.departamento;

  Empleados.find(
    { departamento : departamentoEmpleado, idEmpresa: req.user.sub },
    (err, empleadoEncontrado) => {
      if (!empleadoEncontrado) {
        return res
          .status(400)
          .send({ mensaje: "No puede buscar empleados de otras empresas" });
      }

      if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

      return res.status(200).send({ empleado: empleadoEncontrado });
    }
  );
}

function buscarTodosLosEmpleados(req, res){

  Empleados.find({idEmpresa: req.user.sub}, (err, empleadoEncontrado)=>{
    return res.send({Empleados: empleadoEncontrado})
  })

}

function pdf(req, res){
  Empleados.find({idEmpresa: req.user.sub}, (err, empleadoEncontrado)=>{
    for(let i = 0; i < empleadoEncontrado.length; i++) {
      doc.pipe(fs.createWriteStream("reportes/"+ req.user.nombre + ".pdf"));
      doc.text(empleadoEncontrado[i]._id)
      doc.text(empleadoEncontrado[i].nombre + " " + empleadoEncontrado[i].apellido);
      doc.text(empleadoEncontrado[i].puesto)
    }
    doc.end();
  })
  return res.status(200).send("Pdf generado en la carpeta reportes");
}


module.exports = {
    agregarEmpleado,
    editarEmpleado,
    eliminarEmpleados,
    contarEmpleados,
    buscarEmpleadoPorId,
    buscarEmpleadoPorNombre,
    buscarEmpleadoPorPuesto,
    buscarEmpleadoPorDepartamento,
    buscarTodosLosEmpleados,
    pdf
}