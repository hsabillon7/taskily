// Importar los modelos necesarios
const Proyecto = require("../models/Proyecto");

// Muestra todos los proyectos del usuario
exports.home = (req, res, next) => {
  res.render("crear_proyecto");
};

// Permite la creación de un nuevo proyecto
exports.nuevoProyecto = (req, res, next) => {
  // Validar que el input del formulario tenga valor
  // Para acceder a los valores y asignarlos en un solo paso
  // vamos a utilizar destructuring.
  const { nombre } = req.body;
  const errores = [];

  // Verificar si el nombre del proyecto tiene un valor
  if (!nombre) {
    errores.push({ error: "El nombre del proyecto no puede ser vacío." });
  }

  // Si hay errores
  if (errores.length) {
    res.render("crear_proyecto", {
      errores,
    });
  } else {
    // Insertar el proyecto a la base de datos
    res.send("Insertado en la BD");
  }
};
