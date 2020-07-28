// Importar nodemailer
const nodemailer = require("nodemailer");
// Importar la configuración de Mailtrap.io
const mailTrapConfig = require("../config/email");
// Importar Handlebars
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

// Realizar el envío del correo electrónico mediante nodemailer
// hacia Mailtrap
// https://nodemailer.com/about/
exports.enviarCorreo = async (opciones) => {
  // Crear nuestro transportador SMTP reutilizable
  const transporter = nodemailer.createTransport({
    host: mailTrapConfig.host,
    port: mailTrapConfig.port,
    secure: false, // true for 465 port, false for other ports
    auth: {
      user: mailTrapConfig.user,
      pass: mailTrapConfig.pass,
    },
  });

  // Obtener y construir el template del correo electrónico
  fs.readFile(
    path.resolve(__dirname, "../views/emails/email_restablecer.hbs"),
    "utf8",
    async function (error, source) {
      if (error) {
        console.log("No se puede cargar el template de correo");
        throw error;
      }

      // Generar un HTML para el cuerpo del correo electrónico
      const data = {
        fullname: opciones.usuario.fullname,
        resetUrl: opciones.resetUrl,
      };

      const template = handlebars.compile(source.toString());
      const html = template(data);

      // Enviar el correo electrónico
      const info = await transporter.sendMail({
        from: "Taskily <noreply@taskily.com>", // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text: opciones.text, // plain text body
        html,
      });
    }
  );
};
