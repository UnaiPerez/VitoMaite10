/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
/**
 * Script para gestionar el inicio de sesión en VitoMaite10.
 */

function iniciar() {
    var boton = document.getElementById("enviar");
    boton.addEventListener("click", enviarformulario);
}

function enviarformulario(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

    // Obtener valores de los campos de correo y contraseña
    var correo = document.getElementById("correo").value.trim();
    var contraseña = document.getElementById("contraseña").value.trim();

    var formulario = document.querySelector("form[name='formulariolgin']");
    
    // Comprobar que los campos no están vacíos
    if (correo === "" || contraseña === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Abrir la base de datos IndexedDB
    var solicitud = indexedDB.open("basededatosUsuarios", 1);

    solicitud.addEventListener("error", function (evento) {
        console.error("Error al abrir la base de datos: ", evento.target.error);
    });

    solicitud.addEventListener("success", function (evento) {
        var bd = evento.target.result;

        // Verificar si el almacén 'usuarios' existe
        if (!bd.objectStoreNames.contains("usuarios")) {
            console.error("El almacén 'usuarios' no existe. Asegúrate de que la base de datos está correctamente inicializada.");
            return;
        }

        // Iniciar la transacción de solo lectura
        var transaction = bd.transaction("usuarios", "readonly");
        
        // Obtener el almacén 'usuarios' de la transacción
        var colecUsuarios = transaction.objectStore("usuarios");
        
        // Buscar en la colección para encontrar al usuario con el correo
        var encontrado = colecUsuarios.get(correo);
        
        // En caso de encontrarlo
        encontrado.onsuccess = function (event) {
            var usuario = event.target.result;

            if (usuario && usuario.contraseña === contraseña) {
                // Guardar datos del usuario en localStorage y redirigir
                localStorage.setItem("nombre", usuario.nombre);
                localStorage.setItem("correo", usuario.email);
                localStorage.setItem("foto", usuario.foto);

                alert("Bienvenido, " + usuario.nombre);
                window.location.href = 'logeado.html';
            } else {
                // Usuario no encontrado o contraseña incorrecta
                alert("Los datos introducidos no son correctos.");
                window.location.href = 'hacerlogin.html';
            }
        };

        encontrado.onerror = function () {
            console.error("Error al buscar el usuario en el almacén 'usuarios'.");
        };
    });

    solicitud.addEventListener("upgradeneeded", function (evento) {
        console.warn("La base de datos necesita ser configurada. Asegúrate de que el almacén 'usuarios' esté creado.");
    });
}

window.addEventListener("load", iniciar);


