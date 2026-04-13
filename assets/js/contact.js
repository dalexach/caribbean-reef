
/*
|--------------------------------------------------------------------------
| contact.js
|--------------------------------------------------------------------------
| Este archivo contiene la lógica del formulario de contacto.
|
| Responsabilidades:
| 1. Esperar a que el DOM cargue completamente.
| 2. Capturar el formulario y el contenedor de mensajes.
| 3. Validar que todos los campos obligatorios estén completos.
| 4. Validar que el correo electrónico tenga un formato correcto.
| 5. Mostrar mensajes de error o éxito al usuario.
|--------------------------------------------------------------------------
*/


/* ==========================================================================
   1. EVENTO PRINCIPAL: CUANDO EL DOM ESTÁ LISTO
   ========================================================================== */

/*
| DOMContentLoaded se ejecuta cuando el documento HTML ya fue cargado
| completamente en memoria.
|
| Esto garantiza que los elementos del formulario ya existen en el DOM
| antes de intentar buscarlos con getElementById.
*/
document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================================
       2. SELECCIÓN DE ELEMENTOS DEL DOM
       ======================================================================== */

    /*
    | Se obtiene el formulario principal de contacto.
    | Este elemento será el que escuchará el evento submit.
    */
    const form = document.getElementById("contact-form");

    /*
    | Se obtiene el contenedor donde se mostrarán los mensajes
    | de validación o confirmación.
    */
    const message = document.getElementById("form-message");

    /*
    | Validación de seguridad:
    | si no existe el formulario o no existe el contenedor de mensajes,
    | se detiene la ejecución para evitar errores en consola.
    */
    if (!form || !message) return;


    /* ========================================================================
       3. EVENTO SUBMIT DEL FORMULARIO
       ======================================================================== */

    /*
    | Se escucha el evento submit del formulario.
    | Esto ocurre cuando el usuario intenta enviar la información.
    */
    form.addEventListener("submit", (event) => {

        /*
        | Evita que el formulario se envíe de forma tradicional
        | y recargue la página.
        |
        | Esto permite validar primero los datos con JavaScript.
        */
        event.preventDefault();


        /* ======================================================================
           4. CAPTURA Y LIMPIEZA DE LOS DATOS DEL FORMULARIO
           ====================================================================== */

        /*
        | Se obtiene el valor ingresado en el campo nombre.
        | trim() elimina espacios vacíos al inicio y al final.
        */
        const name = document.getElementById("name").value.trim();

        /*
        | Se obtiene el valor del correo electrónico.
        */
        const email = document.getElementById("email").value.trim();

        /*
        | Se obtiene el número de teléfono.
        */
        const phone = document.getElementById("phone").value.trim();

        /*
        | Se obtiene el servicio de interés seleccionado o escrito.
        */
        const service = document.getElementById("service").value.trim();

        /*
        | Se obtiene el mensaje o detalle adicional escrito por el usuario.
        */
        const details = document.getElementById("details").value.trim();


        /* ======================================================================
           5. EXPRESIÓN REGULAR PARA VALIDAR EL CORREO
           ====================================================================== */

        /*
        | Esta expresión regular valida que el correo tenga una estructura básica:
        | texto@texto.dominio
        |
        | No busca validar todos los casos posibles del correo,
        | pero sí cubre una validación práctica para este formulario.
        */
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        /* ======================================================================
           6. VALIDACIÓN DE CAMPOS OBLIGATORIOS
           ====================================================================== */

        /*
        | Si alguno de los campos está vacío, se muestra un mensaje de error
        | y se detiene la ejecución con return.
        */
        if (!name || !email || !phone || !service || !details) {
            message.className = "form-message error";
            message.textContent = "Todos los campos son obligatorios.";
            return;
        }


        /* ======================================================================
           7. VALIDACIÓN DEL FORMATO DEL CORREO
           ====================================================================== */

        /*
        | Si el correo no cumple con el formato esperado,
        | se informa al usuario y se detiene el envío.
        */
        if (!emailRegex.test(email)) {
            message.className = "form-message error";
            message.textContent = "Ingresa un correo electrónico válido.";
            return;
        }


        /* ======================================================================
           8. MENSAJE DE ÉXITO
           ====================================================================== */

        /*
        | Si todas las validaciones fueron correctas:
        | - se muestra mensaje de éxito
        | - se limpia el formulario
        */
        message.className = "form-message success";
        message.textContent =
            "Mensaje enviado correctamente. Pronto te contactaremos.";

        /*
        | reset() limpia todos los campos del formulario.
        */
        form.reset();
    });
});
