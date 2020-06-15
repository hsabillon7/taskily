// Importar sequelize
const Sequilize = require("sequelize");
// Importar la configuración de la base de datos
const db = require("../config/db");
// Importar slug
const slug = require("slug");
// Importar shortid
const shortid = require("shortid");

// Definición del modelo
const Proyecto = db.define(
  "proyecto",
  {
    id: {
      type: Sequilize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: Sequilize.STRING,
    },
    descripcion: {
      type: Sequilize.STRING,
    },
    fecha: {
      type: Sequilize.DATE,
    },
    url: {
      type: Sequilize.STRING,
    },
  },
  {
    hooks: {
      beforeCreate(proyecto) {
        console.log("Antes de insertar en la base de datos");
        const url = slug(proyecto.nombre).toLowerCase();
        const date = new Date();

        proyecto.url = `${url}_${shortid.generate()}`;
        proyecto.fecha = date.toISOString();
      },
      beforeUpdate(proyecto) {
        console.log("Antes de actualizar en la base de datos");
        const url = slug(proyecto.nombre).toLowerCase();

        proyecto.url = `${url}_${shortid.generate()}`;
      },
    },
  }
);

// Importar el modelo para poder utilizarlo
module.exports = Proyecto;
