// Importar express router
const express = require("express");
const routes = express.Router();

// Importar los controladores
const proyectosController = require("../controllers/proyectosController");

// Construir las rutas disponibles para el servidor
// Las rutas deben exportarse para poder ser utilizadas en otros archivos
module.exports = function () {
  // Documentación sobre los distintos verbos HTTP
  // https://developer.mozilla.org/es/docs/Web/HTTP/Methods
  routes.get("/", proyectosController.home);

  routes.post("/nuevo_proyecto", proyectosController.nuevoProyecto);

  routes.get("/home_proyecto", proyectosController.proyectosHome);

  return routes;
};
