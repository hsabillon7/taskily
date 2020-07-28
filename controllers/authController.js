// Importar passport
const passport = require("passport");
// Importar el modelo de Usuario
const Usuario = require("../models/Usuario");
// Importar Sequelize
const Sequelize = require("sequelize");
// Utilizar los operadores de Sequelize
const Op = Sequelize.Op;
// Importar crypto
const crypto = require("crypto");
// Importar la configuración de envío de correo electrónico
const enviarCorreo = require("../helpers/email");
// Importar bcrypt
const bcrypt = require("bcrypt-nodejs");

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

// Genera un token que le permite al usuario restablecer la contraseña
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
    res.redirect("/restablecer_password");
  }

  // Si el usuario existe
  // Generar un token único con una fecha de expiración
  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expiration = Date.now() + 3600000;

  // Guardar el token y la fecha de validez
  await usuario.save();

  // URL de reestablecer contraseña
  const resetUrl = `http://${req.headers.host}/resetear_password/${usuario.token}`;

  // Enviar el correo electrónico al usuario con el link que contiene
  // el token generado
  await enviarCorreo.enviarCorreo({
    usuario,
    subject: "Restablece tu contraseña de Taskily",
    resetUrl,
    vista: "email_restablecer",
    text:
      "Has solicitado restablecer tu contraseña de Taskily! Autoriza el contenido HTML.",
  });

  // Redireccionar al usuario al inicio de sesión
  req.flash(
    "success",
    "Se envió un enlace para reestablecer tu contraseña a tu correo electrónico"
  );
  res.redirect("/iniciar_sesion");
};

// Muestra el formulario de cambiar la contraseña si existe un token válido
exports.validarToken = async (req, res, next) => {
  try {
    // Buscar si el token enviado existe
    const { token } = req.params;

    const usuario = await Usuario.findOne({
      where: {
        token,
      },
    });

    // Si no se encuentra el usuario
    if (!usuario) {
      req.flash("error", "¡El enlace que seguiste no es válido!");
      res.redirect("/restablecer_password");
    }

    // Si el usuario existe, mostrar el formulario de generar nueva contraseña
    res.render("resetear_password", { layout: "auth", token });
  } catch (error) {
    res.redirect("/iniciar_sesion");
  }
};

// Permite cambiar la contraseña de un token válido
exports.actualizarPassword = async (req, res, next) => {
  // Obtener el usuario mediante el token y verificar que
  // el token aún no ha expirado. El token vence en una hora.
  // https://sequelize.org/master/manual/model-querying-basics.html
  const usuario = await Usuario.findOne({
    where: {
      token: req.params.token,
      expiration: {
        [Op.gte]: Date.now(),
      },
    },
  });

  // Verificar que se obtiene un usuario
  if (!usuario) {
    req.flash(
      "error",
      "Token no válido o vencida. El token tiene 1 hora de validez"
    );
    res.redirect("/restablecer_password");
  }

  // Si el token es correcto y aún no vence
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

  // Limpiar los valores del token y de la expiración
  usuario.token = null;
  usuario.expiration = null;

  // Guardar los cambios
  await usuario.save();

  // Redireccionar al inicio de sesión
  req.flash("success", "Tu contraseña se ha actualizado correctamente");
  res.redirect("/iniciar_sesion");
};
