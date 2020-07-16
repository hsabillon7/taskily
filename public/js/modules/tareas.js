import axios from "axios";
import Swal from "sweetalert2";
import Axios from "axios";

// Seleccionar desde el DOM el objeto que contiene las tareas
const tareas = document.querySelector("#listado-tareas");

// Verificar si existe el objeto en el DOM
if (tareas) {
  // Agregar un evento click sobre los i de cada tarea
  tareas.addEventListener("click", (e) => {
    // Actualizar el estado de la tarea
    if (e.target.classList.contains("fa-check-circle")) {
      // Definir los valores para el ícono de FontAwesome y subir hasta el li
      // que contiene el data-tarea
      const icono = e.target;
      const idTarea =
        icono.parentElement.parentElement.parentElement.dataset.tarea;

      // Crear la ruta hacia el endpoint que actualiza el estado de la tarea
      const url = `${location.origin}/tarea/${idTarea}`;

      axios.patch(url, { idTarea }).then(function (response) {
        if (response.status == 200) {
          // Cambiar de estado el ícono con una clase que lo refleje
          icono.parentElement.classList.toggle("btn-primary");
        }
      });
    }

    // Si realizo click sobre la papelera de eliminación (fa-trash)
    if (e.target.classList.contains("fa-trash")) {
      // Necesitamos obtener el elemento <li></li> de la tarea
      const tarea = e.target.parentElement.parentElement;
      // Obtener el id de la tarea
      const idTarea = tarea.dataset.tarea;

      // Mostrar una alerta consultando al usuario si quiere eliminar la tarea
      Swal.fire({
        title: "¿Estás seguro que deseas borrar esta tarea?",
        text: "¡Si eliminas esta tarea no la puedes recuperar!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          // Crear la URL de eliminación
          const url = `${location.origin}/tarea/${idTarea}`;

          Axios.delete(url, { params: { idTarea } })
            .then((response) => {
              if (response.status == 200) {
                // Eliminar el nodo <li></li> desde el padre
                tarea.parentElement.removeChild(tarea);

                // Mostrar un mensaje de confirmación de eliminación
                Swal.fire("Tarea eliminada", response.data.message, "success");
              }
            })
            .catch((result) => {
              // Mostrar un mensaje de confirmación de eliminación
              Swal.fire(
                "Error",
                "Ha ocurrido un error al momento de eliminar la tarea",
                "error"
              );
            });
        }
      });
    }
  });
}

export default tareas;
