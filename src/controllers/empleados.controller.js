const Empleados = require("../models/empleados.model");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const doc = new PDFDocument();
let date = new Date()
let day = date.getDate()
let month = date.getMonth() + 1
let year = date.getFullYear()


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

  Empleados.find( {nombre :{$regex : nombreEmpleado, $options :'i'} , idEmpresa: req.user.sub}, (err, empleadoEncontrado)=>{

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
    { puesto : {$regex : puestoEmpleado, $options :'i'}, idEmpresa: req.user.sub },
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
    { departamento : {$regex :departamentoEmpleado, $options :'i'}, idEmpresa: req.user.sub },
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
  doc.pipe(fs.createWriteStream("reportes/" + req.user.nombre + ".pdf"));
  doc
    .fillColor("#444444")
    .fontSize(32)
    .text("Reporte de Empleados", {
      align: "center",
      bold: true
    });
  doc
    .fillColor("#444444")
    .fontSize(32)
    .text(req.user.nombre, { align: "center", bold: true, underline: true })
    .moveDown();
  
  Empleados.find({ idEmpresa: req.user.sub }, (err, empleadoEncontrado) => {
    ////////////////////////////////////////////////////////////////
    for (let i = 0; i < empleadoEncontrado.length; i++) {
      empleadoEncontrado[i].nombre;
  }
    const beginningOfPage = 50;
    const endOfPage = 500;

    doc.moveTo(beginningOfPage, 200).lineTo(endOfPage, 200).stroke();

    doc.fontSize(16).text(`Total de empleados: ` +empleadoEncontrado.length, 50, 220);

    doc.moveTo(beginningOfPage, 250).lineTo(endOfPage, 250).stroke().moveDown();
    /////////////////////////////////////////////////////////////////

    const tableTop = 270;
    const itemCodeX = 50;
    const descriptionX = 160;
    const quantityX = 260;
    const priceX = 400;
    
    doc
      .fontSize(15)
      .text("Nombre", itemCodeX, tableTop, { bold: true, underline: true })
      .text("Apellido", descriptionX, tableTop, {bold: true, underline: true})
      .text("Puesto", quantityX, tableTop, { bold: true, underline: true})
      .text("Departamento", priceX, tableTop, { bold: true, underline: true});

      let i = 0;
    for (i = 0; i < empleadoEncontrado.length; i++) {

      const y = tableTop + 25 + (i*25)

      doc.text(empleadoEncontrado[i].nombre, itemCodeX, y);
      doc.text(empleadoEncontrado[i].apellido, descriptionX,y);
      doc.text(empleadoEncontrado[i].puesto, quantityX, y);
      doc.text(empleadoEncontrado[i].departamento, priceX, y)

    }

    doc
    .fontSize(10)
    if (month < 10) {
      doc.text(`${day}-0${month}-${year}`, 50, 700, { align: "center" });
    } else {
      doc.text(`${day}-${month}-${year}`, 50, 700, { align: "center" });
    }


    doc.end();
  });
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