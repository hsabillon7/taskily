// Importar los módulos de express.js
const express = require("express");
// Importar Handlebars
const exphbs = require("express-handlebars");
// Importar body parser que nos permite acceder al cuerpo
// de la petición HTTP
const bodyParser = require("body-parser");
// Importar todas las rutas disponibles
const routes = require("./routes");
// Importar passport para permitir el inicio de sesión
const passport = require("./config/passport");
// Importar express-session para manejar las sesiones de usuario
const session = require("express-session");
// Importar cookie-parser para habilitar el manejo de cookies en el sitio
const cookieParser = require("cookie-parser");
// Importar connect-flash para disponer de los errores en todo el sitio
const flash = require("connect-flash");
// Importar helpers con funciones comunes para todo el sitio
const helpers = require("./helpers");

// Crear la conexión con la base de datos
const db = require("./config/db");

// Importar los modelos
require("./models/Proyecto");
require("./models/Usuario");
require("./models/Tarea");

// Realizar la conexión a la base de datos
// Sequelize se conecta mediante promises
// https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Promise
db.sync()
  .then(() => console.log("Conectado con el servidor de BD"))
  .catch((error) => console.log(error));

// Crear un servidor de express
const app = express();

// Indicarle al servidor la carpeta de archivos estáticos
app.use(express.static("public"));

// Indicar el template engine a utilizar (Handlebars)
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

// Habilitar bodyParser para leer los datos enviados por POST
app.use(bodyParser.urlencoded({ extended: true }));

// Habilitar el uso de cookieParser
// https://www.npmjs.com/package/cookie-parser
app.use(cookieParser());

// Habilitar las sesiones de usuario
// Las sesiones les permiten al usuario navegar entre las distintas
// páginas del sitio con una sola autenticación
// https://www.npmjs.com/package/express-session
app.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Habilitar el uso de connect-flash para compartir mensajes
// https://github.com/jaredhanson/connect-flash
app.use(flash());

// Crear una instancia de passport y cargar nuestra estrategia
app.use(passport.initialize());
app.use(passport.session());

// Pasar algunos valores mediante middleware
app.use((req, res, next) => {
  // Pasar el usuario a las variables locales de la petición
  res.locals.usuario = { ...req.user } || null;
  res.locals.messages = req.flash();
  // Pasar valores de variables por el helper
  res.locals.vardump = helpers.vardump;
  // Continuar con el camino del middleware
  next();
});

// Indicarle a express dónde están las rutas del servidor
app.use("/", routes());

// Inicializar el servidor en un puerto en específico
app.listen(7000, () => {
  console.log("Servidor ejecutandose en el puerto 7000");
});
