// Importar passport
// http://www.passportjs.org/
const passport = require("passport");
// Utilizar la estrategia local
const LocalStrategy = require("passport-local");
// Importar la referencia al modelo que contiene los datos de autenticación
const Usuario = require("../models/Usuario");

// Definir nuestra estrategia de autencitación
// Local Strategy --> realizar un login con credenciales propias (user, pass)
passport.use(
  new LocalStrategy(
    // Por defecto passport en LocalStrategy requiere de un usuario y una contraseña
    {
      usernameField: "email",
      passwordField: "password",
    },
    // Verificar si los datos enviados por el usuario son correctos
    async (email, password, done) => {
      try {
        // Realizar la búsqueda del usuario
        const usuario = await Usuario.findOne({
          where: { email },
        });

        // Si el usuario existe, verificar si su contraseña es correcta
        if (!usuario.comparePassword(password)) {
          return done(null, false, {
            message: "Nombre de usuario o contraseña incorrecta",
          });
        }

        // El usuario y la contraseña son correctas
        return done(null, usuario);
      } catch (error) {
        // El usuario no existe
        return done(null, false, {
          message: "La cuenta de correo electrónico no se encuentra registrada",
        });
      }
    }
  )
);

// Permitir que passport lea los valores del objeto usuario
// Serializar el usuario
passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
});

// Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
});

module.exports = passport;
