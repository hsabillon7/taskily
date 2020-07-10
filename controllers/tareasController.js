// Importar modelos
const Proyecto = require("../models/Proyecto");
const Tarea = require("../models/Tarea");

exports.agregarTarea = async (req, res, next) => {
  try {
    // Obtener el proyecto mediante la URL
    const proyecto = await Proyecto.findOne({
      where: {
        url: req.params.url,
      },
    });

    // Leer los valores de la tarea
    const { definicion } = req.body;

    // Insertar en la base de datos la nueva tarea
    const resultado = await Tarea.create({
      definicion,
      estado: 0,
      fecha: new Date.now(),
      proyectoId: proyecto.id,
    });

    res.redirect(`/proyecto/${proyecto.url}`);
  } catch (error) {
    return next();
  }
};
