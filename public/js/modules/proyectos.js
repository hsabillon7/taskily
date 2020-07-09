// Importar los módulos necesarios
// Utilizar la sintáxis de ECMAScript2015 (6ta Edición de JS [ES6])
// https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/import
import axios from "axios";
import Swal from "sweetalert2";
import { locale } from "moment";

// Obtener el nombre del botón desde el DOM
const botonesEliminar = document.querySelectorAll(
  "button[name='eliminar-proyecto']"
);

botonesEliminar.forEach((botonEliminar) => {
  // Agregar un evento al click del botón
  botonEliminar.addEventListener("click", (e) => {
    //  Capturar la URL del proyecto que se encuentra en una propiedad data HTML5
    const urlProyecto = e.target.dataset.proyectoUrl;

    //sweetalert2.github.io/
    https: Swal.fire({
      title: "¿Estás seguro que deseas eliminar este proyecto?",
      text: "¡Si eliminas este proyecto no es posible recuperarlo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      // Si el usuario confirma la eliminación del proyecto al hacer
      // click en el botón eliminar.
      // Nos vamos a conectar mediante axios utilizando AJAX
      if (result.value) {
        // Obtener la URL del sitio
        const url = `${location.origin}/proyecto/${urlProyecto}`;

        //   Implementar axios para la petición
        axios
          .delete(url, {
            params: {
              url: urlProyecto,
            },
          })
          .then(function (response) {
            Swal.fire("¡Eliminado!", response.data, "success");
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "¡Error!",
              text: "No se ha podido eliminar el proyecto...",
            });
          });

        //   Redireccionar a /
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
    });
  });
});

export default botonesEliminar;
