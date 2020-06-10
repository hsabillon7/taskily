// Importar los modelos necesarios
const Proyecto = require("../models/Proyecto");

// Muestra todos los proyectos del usuario
exports.home = (req, res, next) => {
  res.render("crear_proyecto");
};

// Permite la creación de un nuevo proyecto
// La conexión para almacenar en la base de datos es asíncrona (async / await)
exports.nuevoProyecto = async (req, res, next) => {
  // Validar que el input del formulario tenga valor
  // Para acceder a los valores y asignarlos en un solo paso
  // vamos a utilizar destructuring.
  const { nombre } = req.body;
  const mensajes = [];

  // Verificar si el nombre del proyecto tiene un valor
  if (!nombre) {
    mensajes.push({
      error: "El nombre del proyecto no puede ser vacío.",
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
      await Proyecto.create({ nombre });

      mensajes.push({
        error: "Proyecto almacenado satisfactoriamente.",
        type: "alert-success",
      });

      res.render("crear_proyecto", {
        mensajes,
      });
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
  const mensajes = [];

  try {
    const proyectos = await Proyecto.findAll();
    console.log(proyectos);

    res.render("home_proyecto", { proyectos });
  } catch (error) {
    // Crear el mensaje de error
    mensajes.push({
      error: "Error al obtener los proyectos. Favor reintentar.",
      type: "alert-warning",
    });

    res.render("home_proyectos", mensajes);
  }
};
