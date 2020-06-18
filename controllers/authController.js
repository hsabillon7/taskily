// Importar passport
const passport = require("passport");
// Importar el modelo de Usuario
const Usuario = require("../models/Usuario");
// Importar Sequelize
const Sequelize = require("sequelize");

// Verificar si el usuario se puede autenticar con sus credenciales
exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/iniciar_sesion",
  badRequestMessage: "Debes ingresar tu correo electrónico y tu contraseña",
});
