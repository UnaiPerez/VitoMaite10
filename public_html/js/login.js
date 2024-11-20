/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
/**
 * Script para gestionar el inicio de sesión en VitoMaite10.
 */

function iniciar() {
    var boton = document.getElementById("enviar");
    boton.addEventListener("click", enviarFormulario);
}

function enviarFormulario(event) {
    event.preventDefault(); // Evita el envío predeterminado del formulario

    // Obtención de los valores de los campos de correo y contraseña
    var correo = document.getElementById("correo").value.trim();
    var contraseña = document.getElementById("contraseña").value.trim();

    // Referencia al formulario
    var formulario = document.getElementById("formulariolgin");

    // Verificar que los campos no estén vacíos
    if (correo === "" || contraseña === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Abrir conexión con IndexedDB
    var solicitud = indexedDB.open("VitoMaiteBD", 1);

    solicitud.onerror = function (evento) {
        console.error("Error al abrir la base de datos: ", evento.target.error);
        alert("Ocurrió un problema al conectar con la base de datos. Inténtalo más tarde.");
    };

    solicitud.onsuccess = function (evento) {
        var bd = evento.target.result;

        // Iniciar una transacción de solo lectura
        var transaction = bd.transaction(["usuarios"], "readonly");
        var coleccionUsuarios = transaction.objectStore("usuarios");

        // Intentar obtener el usuario por correo
        var consulta = coleccionUsuarios.get(correo);

        consulta.onsuccess = function (evento) {
            var usuario = evento.target.result;

            if (usuario && usuario.contraseña === contraseña) {
                // Usuario encontrado y contraseña correcta
                localStorage.setItem("nombre", usuario.nombre);
                localStorage.setItem("correo", usuario.correo);
                localStorage.setItem("foto", usuario.foto);

                alert(`¡Bienvenido/a, ${usuario.nombre}!`);
                window.location.href = "logeado.html"; // Redirigir a la página logeado
            } else {
                // Usuario no encontrado o contraseña incorrecta
                alert("Correo o contraseña incorrectos. Inténtalo de nuevo.");
                window.location.href = "hacerlogin.html"; // Redirigir al login nuevamente
            }
        };

        consulta.onerror = function () {
            alert("Error al buscar el usuario. Inténtalo de nuevo.");
        };
    };

    solicitud.onupgradeneeded = function (evento) {
        var bd = evento.target.result;
        console.warn("La base de datos necesita ser configurada. Crea el objectStore 'usuarios'.");
    };
}

window.addEventListener("load", iniciar);



