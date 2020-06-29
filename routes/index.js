// Importar express router
const express = require("express");
const routes = express.Router();

// Importar los controladores
const proyectosController = require("../controllers/proyectosController");
const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");

// Construir las rutas disponibles para el servidor
// Las rutas deben exportarse para poder ser utilizadas en otros archivos
module.exports = function () {
  // Documentación sobre los distintos verbos HTTP
  // https://developer.mozilla.org/es/docs/Web/HTTP/Methods

  // Rutas para proyectos
  routes.get(
    "/",
    authController.usuarioAutenticado,
    proyectosController.proyectosHome
  );

  routes.post(
    "/nuevo_proyecto",
    authController.usuarioAutenticado,
    proyectosController.nuevoProyecto
  );

  routes.get(
    "/nuevo_proyecto",
    authController.usuarioAutenticado,
    proyectosController.formularioNuevoProyecto
  );

  routes.get(
    "/proyecto/:url",
    authController.usuarioAutenticado,
    proyectosController.obtenerProyectoPorUrl
  );

  // Rutas para autenticación

  routes.get("/registrate", usuariosController.formularioCrearCuenta);

  routes.post("/registrate", usuariosController.crearCuenta);

  routes.get("/iniciar_sesion", usuariosController.formularioIniciarSesion);

  routes.post("/iniciar_sesion", authController.autenticarUsuario);

  routes.get("/cerrar_sesion", authController.cerrarSesion);

  return routes;
};
