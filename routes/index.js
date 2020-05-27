// Importar express router
const express = require("express");
const routes = express.Router();

// Importar los controladores
const proyectosController = require("../controllers/proyectosController");

// Construir las rutas disponibles para el servidor
// Las rutas deben exportarse para poder ser utilizadas en otros archivos
module.exports = function () {
  routes.get("/", proyectosController.home);

  routes.get("/holamundo", proyectosController.holaMundo);

  return routes;
};
