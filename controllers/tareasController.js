// Importar modelos
const Proyecto = require("../models/Proyecto");
const Tarea = require("../models/Tarea");

// Permite agregar una tarea a un proyecto
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
    await Tarea.create({
      definicion,
      estado: 0,
      fecha: new Date(),
      proyectoId: proyecto.id,
    });

    res.redirect(`/proyecto/${proyecto.url}`);
  } catch (error) {
    return next();
  }
};

// Permite actualizar el estado de una tarea
exports.actualizarEstadoTarea = async (req, res, next) => {
  try {
    // Obtener el id de la tarea
    // Patch como HTTP Verb obtiene solamente los valores a través de req.params
    const { id } = req.params;

    // Buscar la tarea a actualizar
    const tarea = await Tarea.findOne({
      where: {
        id,
      },
    });

    // Actualizar el estado de la tarea
    // ternary operator
    const estado = tarea.estado == 0 ? 1 : 0;

    tarea.estado = estado;

    // Actualizar el estado de la tarea
    await tarea.save();

    res.status(200).send("Tarea actualizada satisfactoriamente!");
  } catch (error) {
    res.send(401).send("Error al momento de actualizar la tarea");
  }
};

// Elimina una tarea basado en su id
exports.eliminarTarea = async (req, res, next) => {
  // Obtener el id de la tarea mediante query o params
  const { id } = req.params;

  try {
    await Tarea.destroy({
      where: {
        id,
      },
    });

    res
      .status(200)
      .send({ message: "La tarea ha sido eliminada correctamente" });
  } catch (error) {
    res.status(401).send("Hubo un problema al momento de eliminar la tarea");
  }
};
