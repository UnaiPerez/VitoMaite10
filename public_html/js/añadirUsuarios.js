/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/*var bdPromise = new Promise(function (resolve, reject) {
    // Abrir la base de datos
    var solicitud = indexedDB.open("vitomaite10", 1); 

    solicitud.addEventListener("error", function (evento) {
        console.error("Error al abrir la base de datos: ", evento.target.error);
        reject(evento.target.error);
    });

    solicitud.addEventListener("success", function (evento) {
        var bd = evento.target.result;
        console.log("Base de datos abierta correctamente");
        resolve(bd);
    });

    solicitud.addEventListener("upgradeneeded", function (evento) {
        var basededatos = evento.target.result;

        // Crear almacén de objetos "usuarios" con keyPath "email"
        if (!basededatos.objectStoreNames.contains("usuarios")) {
            var almacen = basededatos.createObjectStore("usuarios", { keyPath: "email" });
            console.log("Almacén 'usuarios' creado correctamente");

            // Cargar usuarios iniciales
            var usuarios = [
                { email: "ibai@gmail.com", contraseña: "123456", nombre: "Ibai", movil: "666661212", foto: "img/mujer1.jpg" },
                { email: "unai@gmail.com", contraseña: "654321", nombre: "Unai", movil: "611111111", foto: "img/mujer2.jpg" },
                { email: "enara@hotmail.com", contraseña: "enaraAA", nombre: "Enara", movil: "600018756", foto: "img/mujer3.jpg" },
                { email: "javier@gmail.com", contraseña: "javier123", nombre: "Javier", movil: "678678678", foto: "img/hombre1.jpg" }
                
            ];

            var transaction = evento.target.transaction;
            var store = transaction.objectStore("usuarios");

            // Agregar usuarios al almacén
            usuarios.forEach(function (usuario) {
                store.add(usuario);
            });

            console.log("Usuarios iniciales añadidos correctamente");
        }
    });
});*/
// Promesa para abrir la base de datos
var bdPromise = new Promise(function (resolve, reject) {
    // Abrir la base de datos
    var solicitud = indexedDB.open("vitomaite10", 1);

    solicitud.onerror = function (evento) {
        console.error("Error al abrir la base de datos: ", evento.target.error);
        reject(evento.target.error);
    };

    solicitud.onsuccess = function (evento) {
        var bd = evento.target.result;
        console.log("Base de datos abierta correctamente");
        resolve(bd);
    };

    solicitud.onupgradeneeded = function (evento) {
        var basededatos = evento.target.result;

        // Verifica si el almacén "usuarios" no existe
        if (!basededatos.objectStoreNames.contains("usuarios")) {
            var almacen = basededatos.createObjectStore("usuarios", { keyPath: "email" });
            console.log("Almacén 'usuarios' creado correctamente");

            // Usuarios iniciales
            var usuarios = [
                { email: "ibai@gmail.com", contraseña: "123456", nombre: "Ibai", movil: "666661212", foto: "img/mujer1.jpg" },
                { email: "unai@gmail.com", contraseña: "654321", nombre: "Unai", movil: "611111111", foto: "img/mujer2.jpg" },
                { email: "enara@hotmail.com", contraseña: "enaraAA", nombre: "Enara", movil: "600018756", foto: "img/mujer3.jpg" },
                { email: "javier@gmail.com", contraseña: "javier123", nombre: "Javier", movil: "678678678", foto: "img/hombre1.jpg" }
            ];

            var transaction = evento.target.transaction;
            var store = transaction.objectStore("usuarios");

            usuarios.forEach(function (usuario) {
                store.add(usuario);
                console.log("Usuario añadido: ", usuario.email);
            });

            console.log("Usuarios iniciales añadidos correctamente");
        }
    };
});


