// Importar los módulos de express.js
const express = require("express");
// Importar Handlebars
const exphbs = require("express-handlebars");
// Importar todas las rutas disponibles
const routes = require("./routes");

// Crear la conexión con la base de datos
const db = require("./config/db");

// Importar los modelos
require("./models/Proyecto");

// Realizar la conexión a la base de datos
// Sequelize se conecta mediante promises
// https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Promise
db.sync()
  .then(() => console.log("Conectado con el servidor de BD"))
  .catch((error) => console.log(error));

// Crear un servidor de express
const app = express();

// Indicar el template engine a utilizar (Handlebars)
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

// Indicarle a express dónde están las rutas del servidor
app.use("/", routes());

// Inicializar el servidor en un puerto en específico
app.listen(7000, () => {
  console.log("Servidor ejecutandose en el puerto 7000");
});
