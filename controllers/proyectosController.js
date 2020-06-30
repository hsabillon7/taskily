// Importar los modelos necesarios
const Proyecto = require("../models/Proyecto");
// Importar Moment.js
const moment = require("moment");
moment.locale("es");

// Muestra todos los proyectos del usuario
exports.formularioNuevoProyecto = (req, res, next) => {
  res.render("crear_proyecto");
};

// Permite la creación de un nuevo proyecto
// La conexión para almacenar en la base de datos es asíncrona (async / await)
exports.nuevoProyecto = async (req, res, next) => {
  // Obtener el usuario actual
  const usuario = res.locals.usuario;

  // Validar que el input del formulario tenga valor
  // Para acceder a los valores y asignarlos en un solo paso
  // vamos a utilizar destructuring.
  const { nombre, descripcion } = req.body;
  const mensajes = [];

  // Verificar si el nombre del proyecto tiene un valor
  if (!nombre) {
    mensajes.push({
      error: "El nombre del proyecto no puede ser vacío.",
      type: "alert-danger",
    });
  }

  if (!descripcion) {
    mensajes.push({
      error: "Debes ingresar una breve descripción del proyecto.",
      type: "alert-danger",
    });
  }

  // Si hay errores
  if (mensajes.length) {
    res.render("crear_proyecto", {
      mensajes,
    });
  } else {
    try {
      // Insertar el proyecto a la base de datos
      await Proyecto.create({ nombre, descripcion, usuarioId: usuario.id });

      mensajes.push({
        error: "Proyecto almacenado satisfactoriamente.",
        type: "alert-success",
      });

      res.redirect("/");
    } catch (error) {
      mensajes.push({
        error:
          "Ha ocurrido un error interno en el servidor. Comunicate con el personal de Taskily.",
        type: "alert-warning",
      });
    }
  }
};

// Obtener todos los proyectos
exports.proyectosHome = async (req, res, next) => {
  // Obtener el usuario actual
  const usuario = res.locals.usuario;
  const mensajes = [];

  try {
    const proyectos = await Proyecto.findAll({
      where: {
        usuarioId: usuario.id,
      },
    });

    res.render("home_proyecto", { proyectos });
  } catch (error) {
    // Crear el mensaje de error
    mensajes.push({
      error: "Error al obtener los proyectos. Favor reintentar.",
      type: "alert-warning",
    });

    res.render("home_proyecto", mensajes);
  }
};

// Busca un proyecto por su URL
exports.obtenerProyectoPorUrl = async (req, res, next) => {
  // Obtener el usuario actual
  const usuario = res.locals.usuario;

  try {
    // Obtener el proyecto mediante la URL
    const proyecto = await Proyecto.findOne({
      where: {
        url: req.params.url,
      },
    });

    // Verificar que el proyecto pertenece al usuario
    if (proyecto.usuarioId != usuario.id) {
      res.redirect("/");
    } else {
      // Cambiar la visualización de la fecha con Moment.js
      const hace = moment(proyecto.dataValues.fecha).fromNow();

      res.render("ver_proyecto", {
        proyecto: proyecto.dataValues,
        hace,
      });
    }
  } catch (error) {
    res.redirect("/");
  }
};

// Actualizar los datos de un proyecto
exports.actualizarProyecto = async (req, res, next) => {
  // Obtener la información enviada
  const { nombre, descripcion } = req.body;

  // Obtener la información del usuario actual
  const usuario = res.locals.usuario;

  const mensajes = [];

  // Verificar si el nombre del proyecto es enviado
  if (!nombre) {
    mensajes.push({
      error: "¡El nombre del proyecto no puede ser vacío!",
      type: "alert-danger",
    });
  }

  // Verificar si la descripción del proyecto es enviada
  if (!descripcion) {
    mensajes.push({
      error: "¡La descripción del proyecto no puede ser vacía!",
      type: "alert-danger",
    });
  }

  // Si hay mensajes
  if (mensajes.length) {
    // Enviar valores correctos si la actualización falla
    const proyecto = await Proyecto.findByPk(req.params.id);

    // Cambiar la visualización de la fecha con Moment.js
    const hace = moment(proyecto.dataValues.fecha).fromNow();

    res.render("ver_proyecto", {
      proyecto: proyecto.dataValues,
      mensajes,
      hace,
    });
  } else {
    // No existen errores ni mensajes
    await Proyecto.update(
      { nombre, descripcion },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    // Redirigir hacia el home de proyectos
    res.redirect("/");
  }
};
