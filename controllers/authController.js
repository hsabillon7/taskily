// Importar passport
const passport = require("passport");
// Importar el modelo de Usuario
const Usuario = require("../models/Usuario");
// Importar Sequelize
const Sequelize = require("sequelize");
// Importar crypto
const crypto = require("crypto");
// Importar la configuración de envío de correo electrónico
const enviarCorreo = require("../helpers/email");

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

// Genera un token que le permite al usuario reestablecer la contraseña
// mediante un enlace
exports.enviarToken = async (req, res, next) => {
  // Verificar si existe el usuario
  const { email } = req.body;
  const usuario = await Usuario.findOne({
    where: {
      email,
    },
  });

  // Si el usuario no existe
  if (!usuario) {
    req.flash("error", "¡Este usuario no está registrado en Taskily!");
    res.redirect("/reestablecer_password");
  }

  // Si el usuario existe
  // Generar un token único con una fecha de expiración
  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expiration = Date.now() + 3600000;

  // Guardar el token y la fecha de validez
  await usuario.save();

  // URL de reestablecer contraseña
  const resetUrl = `http://${req.headers.host}/reestablecerPassword/${usuario.token}`;

  // Enviar el correo electrónico al usuario con el link que contiene
  // el token generado
  await enviarCorreo.enviarCorreo({
    usuario,
    subject: "Reestablece tu contraseña de Taskily",
    resetUrl,
    vista: "email_reestablecer",
    text:
      "Has solicitado reestablecer tu contraseña de Taskily! Autoriza el contenido HTML.",
  });

  // Redireccionar al usuario al inicio de sesión
  req.flash(
    "success",
    "Se envió un enlace para reestablecer tu contraseña a tu correo electrónico"
  );
  res.redirect("/iniciar_sesion");
};
