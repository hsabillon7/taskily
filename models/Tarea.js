// Importar Sequelize
const Sequelize = require("sequelize");
// Importar la configuración de la base de datos
const db = require("../config/db");
// Importar el modelo de Proyecto
const Proyecto = require("./Proyecto");

// Definir el modelo de Tarea
const Tarea = db.define("tarea", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  definicion: Sequelize.STRING,
  estado: Sequelize.BOOLEAN,
  fecha: Sequelize.DATE,
});
Tarea.belongsTo(Proyecto);

// Exportar el modelo
module.exports = Tarea;
