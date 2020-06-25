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
  failureFlash: true,
});

// Cerrar la sesión del usuario actual
exports.cerrarSesion = (req, res, next) => {
  // Al cerrar sesión redirigimos al usuario al inicio de sesión
  req.session.destroy(() => {
    res.redirect("/iniciar_sesion");
  });
};

// Verificar si el usuario está autenticado o no
exports.usuarioAutenticado = (req, res, next) => {
  // Si el usuario está autenticado que continúe con la petición
  if (req.isAuthenticated()) {
    return next();
  }

  // Si el usuario no está autenticado, iniciar sesión
  return res.redirect("/iniciar_sesion");
};
