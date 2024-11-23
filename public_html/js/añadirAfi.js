/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


let db;

// Abrir la base de datos
function openDB(callback) {
    let request = indexedDB.open('vitomaite10', 1);

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log('Base de datos abierta en añadir aficiones.');
        callback();
    };

    request.onerror = function (event) {
        console.error('Error al abrir la base de datos:', event.target.errorCode);
        alert('No se pudo conectar a la base de datos.');
    };
}

// Cargar las opciones de aficiones desde la tabla "aficion"
function loadAficiones() {
    let transaction = db.transaction(['aficion'], 'readonly');
    let aficionStore = transaction.objectStore('aficion');

    let request = aficionStore.getAll();

    request.onsuccess = function (event) {
        let aficiones = event.target.result;
        let afiSelect = document.getElementById('afi-select');

        aficiones.forEach(afi => {
            let option = document.createElement('option');
            option.value = afi.id;
            option.textContent = afi.nombre;
            afiSelect.appendChild(option);
        });
    };

    request.onerror = function () {
        console.error('Error al cargar las aficiones.');
    };
}

// Añadir una afición al usuario logueado
function addUsuAfi() {
    let emailUsuario = JSON.parse(sessionStorage.getItem('loggedInUser')).email;
    let idAficion = parseInt(document.getElementById('afi-select').value);

    if (!emailUsuario || isNaN(idAficion)) {
        alert('Por favor, selecciona una afición válida.');
        return;
    }

    let transaction = db.transaction(['usuAfi'], 'readwrite');
    let usuAfiStore = transaction.objectStore('usuAfi');

    let request = usuAfiStore.add({ emailUsuario, idAficion });

    request.onsuccess = function () {
        alert('Afición añadida con éxito.');
    };

    request.onerror = function (event) {
        if (event.target.error.name === 'ConstraintError') {
            alert('Ya tienes esta afición añadida.');
        } else {
            console.error('Error al añadir la afición:', event.target.error);
        }
    };
}

// Inicializar
document.addEventListener('DOMContentLoaded', function () {
    openDB(() => {
        loadAficiones();

        let addButton = document.getElementById('btn-add-afi');
        addButton.addEventListener('click', addUsuAfi);
    });
});
